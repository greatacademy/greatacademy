import type { GetDashboardResponse, XpSummary } from "@ga/proto/learning/v1/learning_pb";
import { computed, type Resource, signal, Text, View } from "nsh";
import { errorText, language, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { learning, timeZone } from "../lib/rpc.ts";
import { type Place, tint } from "../lib/subject.tsx";
import { Card, colors, ErrorNote, MonthField, Muted, Quiet } from "../lib/ui.tsx";

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

/** CardTitle is the small heading of a card, with an optional action at its right, as on the web. */
function CardTitle(props: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
      <Text style={{ color: colors().muted, flex: 1, fontSize: 14 }}>{props.title}</Text>
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
      <CardTitle title={m().totalEarned} />
      <Text style={{ color: colors().ink, fontSize: 30, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
        {`${(props.xp?.total ?? 0).toLocaleString(language())} XP`}
      </Text>
      <Muted>{m().xpToday(props.xp?.today ?? 0)}</Muted>
    </Card>
  );
}

/** GoalBar is one goal's progress: what was earned against the goal, as a bar that turns green once it is met. */
function GoalBar(props: { label: string; xp: number; goal: number; color: string }) {
  const met = () => props.xp >= props.goal;
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 15 }}>{props.label}</Text>
        <Text style={{ color: met() ? colors().good : colors().muted, fontSize: 14, fontVariant: ["tabular-nums"] }}>
          {met() ? `${m().goalOf(props.xp, props.goal)} · ${m().goalDone}` : m().goalOf(props.xp, props.goal)}
        </Text>
      </View>
      <Bar share={props.xp / props.goal} color={met() ? colors().good : props.color} />
    </View>
  );
}

/** Days draws the XP of the last 14 days as bars, today last and strongest. */
function Days(props: { xp: XpSummary | undefined; strong: string; soft: string }) {
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
                backgroundColor: xp() < 0 ? colors().bad : index() === days().length - 1 ? props.strong : props.soft,
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
  const color = () => tint(props.place.subject);
  const paused = () => props.dash.goals?.paused ?? false;
  const goalWeek = () => xp()?.goalWeek ?? 0;
  return (
    <Card>
      <CardTitle
        title={m().goals}
        action={m().setGoals}
        onAction={props.dash.canDecide ? () => nav.push({ name: "goals", subjectId: props.dash.subjectId }) : undefined}
      />
      <If when={!paused() && goalWeek() > 0} else={<Muted>{paused() ? m().goalsPausedNote : m().goalNone}</Muted>}>
        <If when={(xp()?.goalToday ?? 0) > 0}>
          <GoalBar label={m().goalToday} xp={xp()?.today ?? 0} goal={xp()?.goalToday ?? 0} color={color().strong} />
        </If>
        <GoalBar label={m().goalWeek} xp={xp()?.week ?? 0} goal={goalWeek()} color={color().strong} />
      </If>
      <Days xp={xp()} strong={color().strong} soft={color().soft} />
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
        <Text style={{ color: colors().ink, fontSize: 15 }}>
          {pace() > 0
            ? m().forecastAtPace(pace(), dateText(new Date(Date.now() + Math.ceil(d().remainingXp / d().pace) * DAY)))
            : m().forecastNoPace}
        </Text>
        <Muted>{m().forecastRemaining(d().remainingXp)}</Muted>
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
