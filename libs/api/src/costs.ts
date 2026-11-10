import { Code, ConnectError } from "@connectrpc/connect";
import {
  callsByModel,
  type Db,
  judgmentsSince,
  logChange,
  logged,
  type ProviderRow,
  platformAdmins,
  providers,
  spendByProvider,
} from "@ga/db";

/** DAILY_JUDGMENTS is how many texts a learner may send to be judged in 24 hours, rewrites included (*starting*). */
export const DAILY_JUDGMENTS = 30;

/** JUDGMENTS_PER_MINUTE is how many texts a learner may send to be judged in one minute, against scripts (*starting*). */
export const JUDGMENTS_PER_MINUTE = 5;

/** MAX_TRIES is how many times one judgment may be tried, retries and the backup included, before it fails for good (*starting*). */
export const MAX_TRIES = 4;

/** BUDGET_STEPS are the shares of a budget at which administrators are warned; at the last one the vendor stops taking new texts. */
export const BUDGET_STEPS = [0.5, 0.8, 1] as const;

/** COST_JUMP is how many times its average of the last seven days a model's cost per call may reach today before administrators are warned. */
export const COST_JUMP = 2;

/** FAILURE_SHARE is the share of a model's calls today that may fail before administrators are warned. */
export const FAILURE_SHARE = 0.3;

/** MIN_ALARM_CALLS is how many calls a model needs in a period before its cost per call or failures raise an alarm. */
export const MIN_ALARM_CALLS = 10;

/** ALARM_ACTION is the change log's action for an alarm; the log keeps one entry per alarm, so none is sent twice. */
export const ALARM_ACTION = "ai.alarm";

const DAY = 24 * 3600_000;

/** dayStart is when the UTC day of a time began; budgets count by UTC day. */
export function dayStart(at: number): number {
  return at - (at % DAY);
}

/** monthStart is when the UTC month of a time began. */
export function monthStart(at: number): number {
  const d = new Date(at);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
}

/** JUDGING_RATE_REFUSAL is the message of the error that refuses a text sent too soon after others. */
export const JUDGING_RATE_REFUSAL = "too many texts in a minute; wait a moment";

/** JUDGING_DAILY_REFUSAL is the message of the error that refuses a text beyond the day's quota. */
export const JUDGING_DAILY_REFUSAL = "today's texts are used up; come back tomorrow";

/**
 * requireJudgingQuota refuses a text a learner may not send now: more than
 * JUDGMENTS_PER_MINUTE in the last minute, or DAILY_JUDGMENTS in the last 24
 * hours. A refused text is not an answer: nothing is recorded.
 */
export async function requireJudgingQuota(db: Db, learnerId: string, now: number): Promise<void> {
  const refuse = (message: string) => new ConnectError(message, Code.ResourceExhausted);
  if ((await judgmentsSince(db, learnerId, new Date(now - 60_000))) >= JUDGMENTS_PER_MINUTE) throw refuse(JUDGING_RATE_REFUSAL);
  if ((await judgmentsSince(db, learnerId, new Date(now - DAY))) >= DAILY_JUDGMENTS) throw refuse(JUDGING_DAILY_REFUSAL);
}

/** Spend is what a vendor has cost this UTC day and month, in US dollars. */
export interface Spend {
  readonly day: number;
  readonly month: number;
}

/** providerSpend is what each vendor has cost this UTC day and month. */
export async function providerSpend(db: Db, at: number): Promise<Map<string, Spend>> {
  const [day, month] = await Promise.all([spendByProvider(db, new Date(dayStart(at))), spendByProvider(db, new Date(monthStart(at)))]);
  return new Map([...month].map(([id, m]) => [id, { day: day.get(id) ?? 0, month: m }]));
}

/** budgeted tells whether an administrator gave a vendor both budgets; without them it serves no learner. */
export function budgeted(p: Pick<ProviderRow, "dailyBudget" | "monthlyBudget">): boolean {
  return p.dailyBudget !== null && p.monthlyBudget !== null;
}

/** withinBudget tells whether a vendor may take a new text: both budgets set, and neither spent. */
export function withinBudget(p: Pick<ProviderRow, "dailyBudget" | "monthlyBudget">, spend: Spend | undefined): boolean {
  if (!budgeted(p)) return false;
  return (spend?.day ?? 0) < p.dailyBudget! && (spend?.month ?? 0) < p.monthlyBudget!;
}

/** Alarm is a warning about spending raised by runCostCheck. */
export interface Alarm {
  readonly target: string;
  readonly detail: string;
  readonly text: string;
}

/** AlarmMail delivers an alarm to one administrator. */
export type AlarmMail = (to: string, alarm: Alarm) => Promise<void>;

const dollars = (n: number) => `$${n.toFixed(2)}`;

/** budgetAlarms are the budget steps vendors have reached in the day and month of a time. */
function budgetAlarms(list: readonly ProviderRow[], spend: ReadonlyMap<string, Spend>, at: number): Alarm[] {
  const out: Alarm[] = [];
  const date = new Date(at).toISOString();
  for (const p of list) {
    const s = spend.get(p.id) ?? { day: 0, month: 0 };
    const periods = [
      { name: "day", key: date.slice(0, 10), spent: s.day, budget: p.dailyBudget },
      { name: "month", key: date.slice(0, 7), spent: s.month, budget: p.monthlyBudget },
    ];
    for (const period of periods) {
      if (period.budget === null || period.budget <= 0) continue;
      for (const step of BUDGET_STEPS) {
        if (period.spent < period.budget * step) continue;
        const pct = Math.round(step * 100);
        out.push({
          target: p.name,
          detail: `budget ${period.name} ${period.key} ${pct}%`,
          text:
            `${p.name} has spent ${dollars(period.spent)} of its ${period.name}ly budget of ${dollars(period.budget)} (${pct}%).` +
            (step === 1 ? " It takes no new texts until the budget is raised or the period ends." : ""),
        });
      }
    }
  }
  return out;
}

/** modelAlarms warn of a model whose cost per call jumped or whose calls fail often today. */
async function modelAlarms(db: Db, list: readonly ProviderRow[], at: number): Promise<Alarm[]> {
  const today = dayStart(at);
  const key = new Date(at).toISOString().slice(0, 10);
  const [now, before] = await Promise.all([
    callsByModel(db, new Date(today), new Date(at + 1)),
    callsByModel(db, new Date(today - 7 * DAY), new Date(today)),
  ]);
  const name = (id: string) => list.find((p) => p.id === id)?.name ?? id;
  const out: Alarm[] = [];
  for (const m of now) {
    if (m.calls < MIN_ALARM_CALLS) continue;
    const target = `${name(m.providerId)}/${m.model}`;
    const past = before.find((b) => b.providerId === m.providerId && b.model === m.model);
    if (past && past.calls >= MIN_ALARM_CALLS && past.cost > 0) {
      const perCall = m.cost / m.calls;
      const usual = past.cost / past.calls;
      if (perCall > COST_JUMP * usual)
        out.push({
          target,
          detail: `cost-jump ${key}`,
          text: `${target} costs ${dollars(perCall)} per call today, against ${dollars(usual)} over the last seven days.`,
        });
    }
    if (m.failed / m.calls > FAILURE_SHARE)
      out.push({
        target,
        detail: `failures ${key}`,
        text: `${m.failed} of ${m.calls} calls to ${target} failed today; retries cost money too.`,
      });
  }
  return out;
}

/**
 * runCostCheck compares spending with budgets and with the last seven days,
 * logs each new alarm once, and mails it to every administrator. It runs on a
 * schedule; a failed mail is logged and does not stop the others.
 */
export async function runCostCheck(db: Db, at: number, mail: AlarmMail): Promise<Alarm[]> {
  const list = await providers(db);
  const candidates = [...budgetAlarms(list, await providerSpend(db, at), at), ...(await modelAlarms(db, list, at))];
  const raised: Alarm[] = [];
  for (const alarm of candidates) {
    if (await logged(db, ALARM_ACTION, alarm.target, alarm.detail)) continue;
    await logChange(db, { actor: "system", action: ALARM_ACTION, target: alarm.target, detail: alarm.detail, at: new Date(at) });
    raised.push(alarm);
  }
  if (raised.length > 0) {
    const admins = await platformAdmins(db);
    for (const alarm of raised)
      for (const a of admins)
        await mail(a.email, alarm).catch((e: unknown) => console.error(`alarm mail failed: ${e instanceof Error ? e.message : e}`));
  }
  return raised;
}
