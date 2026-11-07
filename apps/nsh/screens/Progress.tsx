import type { XpSummary } from "@ga/proto/learning/v1/learning_pb";
import { computed, resource, Text, View } from "nsh";

import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { Card, cellStyle, colors, Grid, Loaded, Muted, PullScroll, Skeleton } from "../lib/ui.tsx";

/** Days draws the XP of the last 14 days as bars, today last. */
function Days(props: { xp: XpSummary | undefined }) {
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
                backgroundColor: index() === days().length - 1 ? colors().accent : colors()["accent-soft"],
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

/** Progress is the Progress tab: XP over the last days and how far each enrolled course is. */
export function Progress(props: { visible: () => boolean }) {
  const shown = computed(() => props.visible() || undefined);
  const data = resource(shown, async (_, { signal }) => {
    const [profile, list] = await Promise.all([
      learning.getProfile({ timeZone: timeZone() }, { signal }),
      catalog.listCourses({}, { signal }),
    ]);
    return { profile, list };
  });
  return (
    <View style={{ backgroundColor: colors().page, flex: 1 }}>
      <Loaded rpc={data} skeleton={<Skeleton rows={3} />}>
        {(loaded) => (
          <PullScroll onRefresh={data.refetch} refreshing={data.state() === "refreshing"}>
            <View style={{ gap: 12 }}>
              <Days xp={loaded().profile.xp} />
              <Grid>
                <Each of={loaded().profile.enrollments} key={(enrollment) => enrollment.courseId}>
                  {(enrollment) => {
                    const stats = () => enrollment().stats;
                    const share = () => ((stats()?.learned ?? 0) / Math.max(1, stats()?.total ?? 0)) * 100;
                    return (
                      <View
                        role="button"
                        onPress={() => nav.push({ name: "map", courseId: enrollment().courseId })}
                        style={{
                          ...cellStyle,
                          backgroundColor: colors().surface,
                          borderColor: colors().line,
                          borderRadius: 12,
                          borderWidth: 1,
                          gap: 8,
                          padding: 16,
                        }}
                      >
                        <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>
                          {tx(loaded().list.courses.find((course) => course.id === enrollment().courseId)?.title) || enrollment().courseId}
                        </Text>
                        <View style={{ backgroundColor: colors().line, borderRadius: 4, height: 8, overflow: "hidden" }}>
                          <View style={{ backgroundColor: colors().good, height: 8, width: `${share()}%` }} />
                        </View>
                        <Muted>{m().topicsLearned(stats()?.learned ?? 0, stats()?.total ?? 0)}</Muted>
                        <If when={(stats()?.due ?? 0) > 0}>
                          <Text style={{ color: colors().warn, fontSize: 14 }}>{m().dueReviews(stats()?.due ?? 0)}</Text>
                        </If>
                      </View>
                    );
                  }}
                </Each>
              </Grid>
            </View>
          </PullScroll>
        )}
      </Loaded>
    </View>
  );
}
