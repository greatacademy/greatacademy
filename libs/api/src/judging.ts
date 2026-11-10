import type { CriterionSpec, Problem } from "@ga/content";
import {
  addChecks,
  claimJudgment,
  type Db,
  finishJudgment,
  type JudgmentRow,
  type NewCall,
  providers,
  recordCalls,
  retryJudgment,
  type StoredVerdict,
} from "@ga/db";
import {
  type Configured,
  callCost,
  configure,
  criterionKey,
  gatewayHeaders,
  JudgeRejected,
  judge,
  type ProviderConfig,
  type Verdict,
} from "@ga/judge";

import { type QualifiedRoute, qualifyingRoute } from "./capabilities.ts";
import { CHECK_SHARE, sampled } from "./checks.ts";
import { MAX_TRIES } from "./costs.ts";
import type { CourseEntry } from "./registry.ts";
import { decryptSecret } from "./secrets.ts";

/** JUDGED_PASS is the score at which a judged answer counts as correct (*starting*). */
export const JUDGED_PASS = 0.75;

/** MAX_ATTEMPTS is how many tries a learner has at a judged question: a text below the pass is sent back once for a rewrite. */
export const MAX_ATTEMPTS = 2;

/** JUDGE_LEASE_MS is how long one caller holds a judgment before another may try it again. */
export const JUDGE_LEASE_MS = 30_000;

/** JUDGE_LIMIT_MS is how long a judgment may keep failing before it fails for good and the learner may skip the question. */
export const JUDGE_LIMIT_MS = 10 * 60_000;

/** retryDelay is how long a judgment waits after its nth failed try: 10 s, 20 s, 40 s, up to two minutes. */
export function retryDelay(tries: number): number {
  return Math.min(120_000, 10_000 * 2 ** Math.max(0, tries - 1));
}

/** JudgingDeps are what judging needs from the deployment: the key that seals providers' keys, and how to reach a model. */
export interface JudgingDeps {
  readonly aiKeysSecret: string;
  /** connect builds a model client; tests pass one backed by pi-ai's faux provider. */
  readonly connect?: (config: ProviderConfig, model: string) => Configured;
  /** checkShare is the share of finished judgments sampled for people to check; the default is CHECK_SHARE. */
  readonly checkShare?: number;
}

/** judgedCriteria are the criteria a judged problem is judged on, as its topic defines them. */
export function judgedCriteria(c: CourseEntry, topic: string, problem: Problem): readonly CriterionSpec[] {
  const defs = c.subject.topics.get(topic)?.criteria ?? [];
  return (problem.answer.judged?.criteria ?? []).map((id) => {
    const def = defs.find((d) => d.id === id);
    if (!def) throw new Error(`criterion ${id} is not one of topic ${topic}'s`);
    return def;
  });
}

const routeKey = (r: QualifiedRoute) => `${r.providerId}|${r.model}|${r.promptVersion}`;

/**
 * runJudgment tries once to judge a pending judgment, if it is due: it finds a
 * qualifying route for each criterion, named by its key (id@version) as routes
 * and calibrations name it, calls the model of each route once for
 * the criteria it holds, and stores the checked verdict. A failure waits and is
 * tried again, on the backup after the first two tries, until JUDGE_LIMIT_MS
 * has passed or MAX_TRIES were made. Every call is recorded with its cost at
 * the model's price, failed ones too. A text already taken is finished even
 * when its vendor's budget has since been spent. It never throws for a model's failure.
 */
export async function runJudgment(db: Db, c: CourseEntry, id: string, deps: JudgingDeps, now: number): Promise<void> {
  const row = await claimJudgment(db, id, new Date(now), JUDGE_LEASE_MS);
  if (!row) return;
  const calls: NewCall[] = [];
  const call = (route: QualifiedRoute, usage: { input: number; output: number } | undefined, ok: boolean) =>
    calls.push({
      providerId: route.providerId,
      model: route.model,
      use: "judgment",
      learnerId: row.learnerId,
      inputTokens: usage?.input ?? 0,
      outputTokens: usage?.output ?? 0,
      cost: usage ? callCost(usage, route.price) : 0,
      ok,
      at: new Date(now),
    });
  let current: QualifiedRoute | undefined;
  const fail = async (reason: string) => {
    await recordCalls(db, calls);
    const give = now - row.createdAt.getTime() >= JUDGE_LIMIT_MS || row.tries >= MAX_TRIES;
    await retryJudgment(db, row.id, reason, new Date(now), give ? undefined : new Date(now + retryDelay(row.tries)));
  };
  try {
    const [problem] = await c.source.problems([{ topic: row.topicId, kp: row.kp, seed: row.seed }]);
    const criteria = judgedCriteria(c, row.topicId, problem!);
    const avoid = row.tries > 2 ? ("primary" as const) : undefined;
    const groups = new Map<string, { route: QualifiedRoute; criteria: CriterionSpec[] }>();
    for (const criterion of criteria) {
      const route =
        (await qualifyingRoute(db, criterionKey(criterion), row.learnerId, "writing", now, avoid, false)) ??
        (avoid && (await qualifyingRoute(db, criterionKey(criterion), row.learnerId, "writing", now, undefined, false)));
      if (!route) return await fail("no-route");
      const key = routeKey(route);
      const group = groups.get(key) ?? { route, criteria: [] };
      group.criteria.push(criterion);
      groups.set(key, group);
    }
    const list = await providers(db);
    const verdicts: Verdict[] = [];
    for (const { route, criteria: held } of groups.values()) {
      current = route;
      const p = list.find((x) => x.id === route.providerId);
      if (!p?.keyCipher) return await fail("no-key");
      const config = {
        id: p.id,
        name: p.name,
        api: p.api,
        baseUrl: p.baseUrl,
        apiKey: await decryptSecret(deps.aiKeysSecret, p.keyCipher),
      };
      const { models, model, gateway } = (deps.connect ?? configure)(config, route.model);
      const meta = { use: "judgment", criteria: held.map(criterionKey).join(","), prompt: route.promptVersion };
      const verdict = await judge(
        models,
        model,
        {
          task: {
            prompt: problem!.prompt.en,
            modelAnswer: problem!.canonical,
            ...(problem!.answer.judged?.source && { source: problem!.answer.judged.source }),
          },
          criteria: held,
          text: row.response,
          promptVersion: route.promptVersion,
        },
        gateway ? { headers: gatewayHeaders(meta) } : {},
      );
      call(route, verdict.usage, true);
      verdicts.push(verdict);
      current = undefined;
    }
    const byId = new Map(verdicts.flatMap((v) => v.criteria.map((x) => [x.id, x] as const)));
    const verdict: StoredVerdict = {
      criteria: criteria.map((x) => byId.get(x.id)!),
      feedback: verdicts.flatMap((v) => v.feedback).slice(0, 2),
    };
    const score = verdict.criteria.filter((x) => x.met).length / verdict.criteria.length;
    const routes = [...groups.values()].map((g) => g.route);
    await recordCalls(db, calls);
    if (sampled(row.id, deps.checkShare ?? CHECK_SHARE)) {
      const task = { prompt: problem!.prompt.en, ...(problem!.answer.judged?.source && { source: problem!.answer.judged.source }) };
      await addChecks(
        db,
        [...groups.values()].flatMap(({ route, criteria: held }) =>
          held.map((x) => ({
            judgmentId: row.id,
            criterion: criterionKey(x),
            question: x.question,
            task,
            providerId: route.providerId,
            model: route.model,
            promptVersion: route.promptVersion,
            met: byId.get(x.id)!.met,
            sampledAt: new Date(now),
          })),
        ),
      );
    }
    await finishJudgment(
      db,
      row.id,
      verdict,
      score,
      {
        providerId: [...new Set(routes.map((r) => r.providerId))].join("+"),
        model: [...new Set(routes.map((r) => r.model))].join("+"),
        promptVersion: [...new Set(routes.map((r) => r.promptVersion))].join("+"),
        inputTokens: verdicts.reduce((t, v) => t + v.usage.input, 0),
        outputTokens: verdicts.reduce((t, v) => t + v.usage.output, 0),
        cost: calls.reduce((t, c) => t + c.cost, 0),
      },
      new Date(now),
    );
  } catch (e) {
    if (current) call(current, e instanceof JudgeRejected ? e.usage : undefined, false);
    // Only a reason is kept: a provider's message may repeat the learner's text.
    await fail(e instanceof JudgeRejected ? e.reason : "error");
  }
}

/** JudgmentView is what a learner sees of a judgment. */
export interface JudgmentView {
  readonly row: JudgmentRow;
  readonly passed: boolean;
  /** revise tells that the text goes back to the learner for a rewrite instead of counting. */
  readonly revise: boolean;
}

/** viewJudgment decides what a finished judgment means for the run: counted, or sent back for a rewrite. */
export function viewJudgment(row: JudgmentRow): JudgmentView {
  const passed = (row.score ?? 0) >= JUDGED_PASS;
  return { row, passed, revise: !passed && row.attempt < MAX_ATTEMPTS };
}

/**
 * forLearner narrows a course to what a learner can be taught: a topic judged
 * by a model stays only when every one of its criteria has a route that may
 * receive this learner's text, so without one the course goes on without it.
 */
export async function forLearner(db: Db, c: CourseEntry, learnerId: string, now: number): Promise<CourseEntry> {
  const judged = c.planner.scope.topics.filter((id) => c.subject.topics.get(id)?.criteria);
  if (judged.length === 0) return c;
  const routed = new Map<string, boolean>();
  const off = new Set<string>();
  for (const id of judged) {
    for (const criterion of c.subject.topics.get(id)!.criteria!) {
      const key = criterionKey(criterion);
      if (!routed.has(key)) routed.set(key, (await qualifyingRoute(db, key, learnerId, "writing", now)) !== undefined);
      if (!routed.get(key)) off.add(id);
    }
  }
  if (off.size === 0) return c;
  const { scope } = c.planner;
  const narrowed = {
    ...scope,
    topics: scope.topics.filter((id) => !off.has(id)),
    inCourse: new Set([...scope.inCourse].filter((id) => !off.has(id))),
  };
  return { ...c, planner: { ...c.planner, scope: narrowed } };
}
