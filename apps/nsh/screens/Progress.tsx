import type { GetDashboardResponse, XpSummary } from "@ga/proto/learning/v1/learning_pb";
import { signal, Text, View, windowSize } from "nsh";
import { errorText, language, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { markChanged } from "../lib/query.ts";
import { learning } from "../lib/rpc.ts";
import { courseTitle, type Place, tint, usePlace } from "../lib/subject.tsx";
import { Card, colors, ErrorNote, Loaded, MonthField, Muted, PullScroll, Quiet, Row, Section, Skeleton } from "../lib/ui.tsx";
import { SubjectStart } from "./CourseTab.tsx";
import { Bar, useDashboard, WeeklyGoals } from "./LearnTab.tsx";

const DAY = 86_400_000;

/** ASIDE_FROM is the window width, in points, from which the goals and the end date sit in a column beside the rest. */
const ASIDE_FROM = 1024;
const ASIDE_WIDTH = 320;

/** Days draws the subject's XP of the last 14 days as bars, today last. */
function Days(props: { xp: XpSummary | undefined; strong: string; soft: string }) {
  const days = () => props.xp?.days ?? [];
  const most = () => Math.max(1, ...days());
  return (
    <Card>
      <View style={{ alignItems: "baseline", flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>{m().lastDays}</Text>
        <Muted>{m().xpTotal(props.xp?.total ?? 0)}</Muted>
      </View>
      <View accessibilityLabel={m().lastDays} style={{ alignItems: "flex-end", flexDirection: "row", gap: 4, height: 96 }}>
        <Each of={days()}>
          {(xp, index) => (
            <View
              style={{
                backgroundColor: index() === days().length - 1 ? props.strong : props.soft,
                borderRadius: 3,
                flex: 1,
                height: Math.max(3, (xp() / most()) * 96),
              }}
            />
          )}
        </Each>
      </View>
      <Muted>{m().xpWeek(props.xp?.week ?? 0)}</Muted>
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
 * Finish says when the course may be finished at the learner's recent pace and, against the end date whoever decides
 * for the learner set, how much XP a day it takes; they set the date by its month, or clear it.
 */
function Finish(props: { place: Place; dash: GetDashboardResponse; onChanged: () => void }) {
  const d = () => props.dash;
  const busy = signal(false);
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
      props.onChanged();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <Card>
      <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{m().forecast}</Text>
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
        <Muted>{m().forecastRemaining(d().remainingXp)}</Muted>
        <Text style={{ color: colors().ink, fontSize: 15 }}>
          {pace() > 0
            ? m().forecastAtPace(pace(), dateText(new Date(Date.now() + Math.ceil(d().remainingXp / d().pace) * DAY)))
            : m().forecastNoPace}
        </Text>
        <If when={d().canDecide} else={<Muted>{m().guardianDecides}</Muted>}>
          <MonthField
            label={d().endDate ? m().endDate : m().endDateSet}
            value={month()}
            ahead={5}
            onChange={({ year, month: mo }) => void save(endOf(year, mo))}
          />
          <Muted>{m().endDateBody}</Muted>
          <If when={d().endDate}>
            <Quiet label={m().endDateClear} disabled={busy()} onPress={() => void save("")} />
          </If>
        </If>
        <If when={error()}>
          <ErrorNote message={error()} />
        </If>
      </If>
    </Card>
  );
}

/**
 * Progress is the Progress page of the subject shown (docs/experience.md §3): the subject's XP over the last days, how
 * far the course is with its map and history, the weekly goals, and when the course may be finished.
 */
export function Progress(props: { visible: () => boolean }) {
  const { rpc, place } = usePlace(props.visible);
  const dash = useDashboard(props.visible, place);
  const wide = () => windowSize().width >= ASIDE_FROM;
  const changed = () => {
    markChanged();
    dash.refetch();
  };
  return (
    <View style={{ backgroundColor: colors().page, flex: 1 }}>
      <Loaded rpc={rpc} skeleton={<Skeleton rows={3} />}>
        {() => (
          <If when={place()}>
            {(here) => (
              <If
                when={here().enrollment}
                else={<SubjectStart place={here()} onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"} />}
              >
                <Loaded rpc={dash} skeleton={<Skeleton rows={3} />}>
                  {(d) => (
                    <PullScroll onRefresh={dash.refetch} refreshing={dash.state() === "refreshing"} underBar>
                      <View
                        style={{
                          alignItems: wide() ? "flex-start" : "stretch",
                          flexDirection: wide() ? "row" : "column",
                          gap: wide() ? 24 : 12,
                        }}
                      >
                        <View style={{ flexBasis: wide() ? 0 : "auto", flexGrow: 1, flexShrink: 1, gap: 12, minWidth: 0 }}>
                          <Days xp={d().xp} strong={tint(here().subject).strong} soft={tint(here().subject).soft} />
                          <Section title={courseTitle(here().data.list, d().courseId)}>
                            <Bar
                              share={(d().stats?.learned ?? 0) / Math.max(1, d().stats?.total ?? 0)}
                              color={tint(here().subject).strong}
                            />
                            <Muted>
                              {[
                                m().topicsLearned(d().stats?.learned ?? 0, d().stats?.total ?? 0),
                                (d().stats?.due ?? 0) > 0 ? m().dueReviews(d().stats?.due ?? 0) : "",
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </Muted>
                            <Row
                              title={m().progressMap}
                              detail={m().progressMapDetail}
                              onPress={() => nav.push({ name: "map", courseId: d().courseId })}
                            />
                            <Row
                              title={m().history}
                              detail={m().historyDetail}
                              onPress={() => nav.push({ name: "history", courseId: d().courseId })}
                            />
                          </Section>
                        </View>
                        <View style={{ gap: 12, width: wide() ? ASIDE_WIDTH : "auto" }}>
                          <WeeklyGoals dash={d()} color={tint(here().subject).strong} />
                          <Finish place={here()} dash={d()} onChanged={changed} />
                        </View>
                      </View>
                    </PullScroll>
                  )}
                </Loaded>
              </If>
            )}
          </If>
        )}
      </Loaded>
    </View>
  );
}
