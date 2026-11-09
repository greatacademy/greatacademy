import type { GetDashboardResponse, XpSummary } from "@ga/proto/learning/v1/learning_pb";
import { computed, type ImageAsset, type Resource, signal, Text, View } from "nsh";
import calendarCheck from "../assets/icons/calendar-check.svg";
import caretDown from "../assets/icons/caret-down.svg";
import caretRight from "../assets/icons/caret-right.svg";
import flag from "../assets/icons/flag.svg";
import lightning from "../assets/icons/lightning.svg";
import trophy from "../assets/icons/trophy.svg";
import { errorText, language, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { account, learning, timeZone } from "../lib/rpc.ts";
import { type Place, tint } from "../lib/subject.tsx";
import { Card, colors, ErrorNote, Icon, MonthField, Muted, Quiet } from "../lib/ui.tsx";

const DAY = 86_400_000;

/** useDashboard reads the dashboard of the course shown in a subject's tab, while the tab shows. */
export function useDashboard(visible: () => boolean, place: () => Place | undefined): Resource<GetDashboardResponse> {
  const course = computed(() => (visible() && place()?.enrollment?.courseId) || undefined);
  return query(
    course,
    (courseId) => ["dashboard", courseId],
    (courseId, { signal: abort }) => learning.getDashboard({ courseId, timeZone: timeZone() }, { signal: abort }),
  );
}

/** Bar is a share (0 to 1) as a bar in a color. */
export function Bar(props: { share: number; color: string; height?: number }) {
  const height = () => props.height ?? 8;
  return (
    <View style={{ backgroundColor: colors().line, borderRadius: height() / 2, height: height(), overflow: "hidden" }}>
      <View
        style={{
          backgroundColor: props.color,
          borderRadius: height() / 2,
          height: height(),
          width: `${Math.min(100, Math.max(0, props.share * 100))}%`,
        }}
      />
    </View>
  );
}

/** CardTitle is the small heading of a card with its icon, and an optional note or action at its right, as on the web. */
export function CardTitle(props: { icon: ImageAsset; title: string; note?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
      <Icon src={props.icon} />
      <Text style={{ color: colors().muted, flex: 1, fontSize: 14 }}>{props.title}</Text>
      <If when={props.note}>
        <Text style={{ color: colors().muted, fontSize: 12 }}>{props.note ?? ""}</Text>
      </If>
      <If when={props.action && props.onAction}>
        <Text role="button" onPress={() => props.onAction?.()} style={{ color: colors().accent, fontSize: 14 }}>
          {props.action ?? ""}
        </Text>
      </If>
    </View>
  );
}

/** EarnedCard shows all the XP earned in the subject, and today's. */
export function EarnedCard(props: { xp: XpSummary | undefined }) {
  return (
    <Card>
      <CardTitle icon={lightning} title={m().totalEarned} />
      <Text style={{ color: colors().ink, fontSize: 30, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
        {`${(props.xp?.total ?? 0).toLocaleString(language())} XP`}
      </Text>
      <Muted>{m().xpToday(props.xp?.today ?? 0)}</Muted>
    </Card>
  );
}

/** GoalBar is one goal's progress: what was earned against the goal, as a bar that turns green once it is met. */
function GoalBar(props: { label: string; xp: number; goal: number }) {
  const met = () => props.xp >= props.goal;
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 15 }}>{props.label}</Text>
        <Text style={{ color: met() ? colors().good : colors().muted, fontSize: 14, fontVariant: ["tabular-nums"] }}>
          {met() ? `${m().goalOf(props.xp, props.goal)} · ${m().goalDone}` : m().goalOf(props.xp, props.goal)}
        </Text>
      </View>
      <Bar share={props.xp / props.goal} color={met() ? colors().good : colors().accent} />
    </View>
  );
}

/** Days draws the XP of the last 14 days as bars, today last and strongest. */
function Days(props: { xp: XpSummary | undefined }) {
  const days = () => props.xp?.days ?? [];
  const most = () => Math.max(1, ...days().map(Math.abs));
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().muted, flex: 1, fontSize: 12 }}>{m().lastDays}</Text>
        <Text style={{ color: colors().muted, fontSize: 12 }}>{m().xpTotal(props.xp?.total ?? 0)}</Text>
      </View>
      <View accessibilityLabel={m().lastDays} style={{ alignItems: "flex-end", flexDirection: "row", gap: 4, height: 48 }}>
        <Each of={days()}>
          {(xp, index) => (
            <View
              style={{
                backgroundColor: xp() < 0 ? colors().bad : index() === days().length - 1 ? colors().accent : colors()["accent-soft"],
                borderRadius: 2,
                flex: 1,
                height: Math.max(2, (Math.abs(xp()) / most()) * 48),
              }}
            />
          )}
        </Each>
      </View>
    </View>
  );
}

/**
 * WeeklyGoals shows today's XP and the week's in a subject against its goals, and the last 14 days; whoever decides
 * for the learner sets the goals, and the learner of a guardian is told who does. It is the same on Learn and Progress.
 */
export function WeeklyGoals(props: { dash: GetDashboardResponse; place: Place }) {
  const xp = (): XpSummary | undefined => props.dash.xp;
  const paused = () => props.dash.goals?.paused ?? false;
  const goalWeek = () => xp()?.goalWeek ?? 0;
  return (
    <Card>
      <CardTitle
        icon={flag}
        title={m().goals}
        action={m().setGoals}
        onAction={props.dash.canDecide ? () => nav.push({ name: "goals", subjectId: props.dash.subjectId }) : undefined}
      />
      <If when={!paused() && goalWeek() > 0} else={<Muted>{paused() ? m().goalsPausedNote : m().goalNone}</Muted>}>
        <If when={(xp()?.goalToday ?? 0) > 0}>
          <GoalBar label={m().goalToday} xp={xp()?.today ?? 0} goal={xp()?.goalToday ?? 0} />
        </If>
        <GoalBar label={m().goalWeek} xp={xp()?.week ?? 0} goal={goalWeek()} />
      </If>
      <Days xp={xp()} />
      <If when={!props.dash.canDecide}>
        <Muted>{m().guardianDecides}</Muted>
      </If>
    </Card>
  );
}

/** dateText writes a day in the app's language. */
function dateText(at: Date): string {
  return at.toLocaleDateString(language(), { year: "numeric", month: "short", day: "numeric" });
}

/** finishAt is the day `remaining` XP is done at `xpPerDay`, from today, in the app's language. */
function finishAt(remaining: number, xpPerDay: number): string {
  return dateText(new Date(Date.now() + Math.ceil(remaining / xpPerDay) * DAY));
}

/** COMPARE_PACES are the XP per day a learner can compare, from gentle to intense, as on the web. */
const COMPARE_PACES = [15, 30, 50, 70, 100];

/** ComparePaces opens, under the forecast, when the course would be finished at the learner's goal and at other paces. */
function ComparePaces(props: { remaining: number; goalPace: number }) {
  const open = signal(false);
  const goal = () => Math.round(props.goalPace);
  const row = (label: string, date: string, strong: boolean) => (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Text style={{ color: colors().ink, flex: 1, fontSize: 14, fontWeight: strong ? "500" : "400" }}>{label}</Text>
      <Text style={{ color: strong ? colors().ink : colors().muted, fontSize: 14, fontWeight: strong ? "500" : "400" }}>{date}</Text>
    </View>
  );
  return (
    <View style={{ gap: 6 }}>
      <View
        role="button"
        accessibilityState={{ expanded: open() }}
        onPress={() => open.set(!open())}
        style={{ alignItems: "center", alignSelf: "flex-start", flexDirection: "row", gap: 4 }}
      >
        <Icon src={open() ? caretDown : caretRight} size={12} color={colors().accent} />
        <Text style={{ color: colors().accent, fontSize: 14 }}>{m().forecastCompare}</Text>
      </View>
      <If when={open()}>
        <View style={{ gap: 4 }}>
          <If when={goal() > 0}>{row(m().forecastGoal(goal()), finishAt(props.remaining, props.goalPace), true)}</If>
          <Each of={COMPARE_PACES}>{(pace) => row(m().forecastRow(pace()), finishAt(props.remaining, pace()), false)}</Each>
        </View>
      </If>
    </View>
  );
}

/** endOf is the last day of a month as "YYYY-MM-DD", the month counted from 1. */
export function endOf(year: number, month: number): string {
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
}

/** daysUntil counts the days from today to a "YYYY-MM-DD" date on this device, at least 1. */
function daysUntil(date: string, now: number): number {
  const [y, mo, day] = date.split("-").map(Number);
  const end = new Date(y ?? 1970, (mo ?? 1) - 1, day ?? 1).getTime();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.max(1, Math.round((end - today.getTime()) / DAY));
}

/**
 * ForecastCard says when the course may be finished at the learner's recent pace and, against the end date whoever
 * decides for the learner set, how much XP a day it takes; they set the date by its month, or clear it. It is the
 * same on Learn and Progress.
 */
export function ForecastCard(props: { place: Place; dash: GetDashboardResponse; onChanged: () => void }) {
  const d = () => props.dash;
  const busy = signal(false);
  const editing = signal(false);
  const error = signal("");
  const color = () => tint(props.place.subject);
  const needed = () => (d().endDate ? Math.ceil(d().remainingXp / daysUntil(d().endDate, Date.now())) : 0);
  const pace = () => Math.round(d().pace);
  const month = () => {
    const [year, mo] = d().endDate.split("-").map(Number);
    return year && mo ? { year, month: mo } : null;
  };
  const save = async (endDate: string) => {
    busy.set(true);
    error.set("");
    try {
      await learning.setEndDate({ subjectId: d().subjectId, endDate, learnerId: "" });
      editing.set(false);
      props.onChanged();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <Card>
      <CardTitle
        icon={calendarCheck}
        title={m().forecast}
        action={d().endDate ? m().endDateChange : m().endDateSet}
        onAction={d().canDecide && !d().finished && !editing() ? () => editing.set(true) : undefined}
      />
      <If when={!d().finished} else={<Text style={{ color: colors().good, fontSize: 15 }}>{m().forecastDone}</Text>}>
        <If when={d().endDate}>
          <View style={{ backgroundColor: color().soft, borderRadius: 10, gap: 4, padding: 12 }}>
            <Text style={{ color: color().onSoft, fontSize: 15, fontWeight: "600" }}>
              {m().endDateIs(dateText(new Date(`${d().endDate}T00:00`)))}
            </Text>
            <Text style={{ color: color().onSoft, fontSize: 14 }}>
              {d().pace >= needed() ? m().endDateOnPace(needed()) : m().endDateBehind(needed())}
            </Text>
          </View>
        </If>
        <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "500" }}>
          {pace() > 0 ? m().forecastAtPace(pace(), finishAt(d().remainingXp, d().pace)) : m().forecastNoPace}
        </Text>
        <Muted>{m().forecastRemaining(d().remainingXp)}</Muted>
        <ComparePaces remaining={d().remainingXp} goalPace={(d().xp?.goalWeek ?? 0) / 7} />
        <If when={editing()}>
          <View style={{ borderColor: colors().line, borderTopWidth: 1, gap: 8, paddingTop: 12 }}>
            <Muted>{m().endDateBody}</Muted>
            <MonthField label={m().endDate} value={month()} ahead={5} onChange={({ year, month: mo }) => void save(endOf(year, mo))} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <If when={d().endDate}>
                <Quiet label={m().endDateClear} disabled={busy()} onPress={() => void save("")} />
              </If>
              <Quiet label={m().cancel} onPress={() => editing.set(false)} />
            </View>
          </View>
        </If>
        <If when={!d().canDecide}>
          <Muted>{m().guardianDecides}</Muted>
        </If>
      </If>
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
    </Card>
  );
}

/**
 * LeagueCard shows the learner's place in this week's league and the learners next to them, as on the web's Learn
 * page; it opens the whole league, or, for a learner not taking part, the league's settings.
 */
export function LeagueCard(props: { visible: () => boolean }) {
  const shown = computed(() => props.visible() || undefined);
  const league = query(
    shown,
    () => ["league"],
    (_, { signal: abort }) => account.getLeague({}, { signal: abort }),
  );
  return (
    <If when={league()}>
      {(l) => {
        const mine = () => l().rows.findIndex((r) => r.me);
        const near = () => (mine() < 0 ? [] : l().rows.slice(Math.max(0, mine() - 1), mine() + 2));
        const days = () => Math.max(1, Math.ceil((Number(l().endsAt) - Date.now()) / DAY));
        return (
          <Card>
            <CardTitle
              icon={trophy}
              title={l().enabled ? (m().tiers[l().tier] ?? m().league) : m().league}
              note={l().enabled ? m().daysLeft(days()) : undefined}
            />
            <If when={l().enabled} else={<Muted>{m().leagueInvite}</Muted>}>
              <If when={near().length > 0} else={<Muted>{m().leagueNoXp}</Muted>}>
                <View style={{ gap: 2 }}>
                  <Each of={near()} key={(r) => r.username}>
                    {(r) => (
                      <View
                        style={{
                          backgroundColor: r().me ? colors()["accent-soft"] : "transparent",
                          borderRadius: 8,
                          flexDirection: "row",
                          gap: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                        }}
                      >
                        <Text style={{ color: colors().muted, fontSize: 14, width: 20 }}>{String(r().rank)}</Text>
                        <Text style={{ color: colors().ink, flex: 1, fontSize: 14, fontWeight: r().me ? "600" : "400", numberOfLines: 1 }}>
                          {r().username}
                        </Text>
                        <Text style={{ color: colors().ink, fontSize: 14, fontWeight: r().me ? "600" : "400" }}>{`${r().xp} XP`}</Text>
                      </View>
                    )}
                  </Each>
                </View>
              </If>
            </If>
            <Text role="button" onPress={() => nav.push({ name: "standings" })} style={{ color: colors().accent, fontSize: 14 }}>
              {l().enabled ? m().leagueSeeAll : m().leagueLearnMore}
            </Text>
          </Card>
        );
      }}
    </If>
  );
}
