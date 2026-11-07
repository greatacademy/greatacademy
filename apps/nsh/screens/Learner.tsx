import { computed, resource, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { errorText, m, tx } from "../lib/i18n.ts";
import { dateOf, p } from "../lib/privacy-text.ts";
import { account, catalog, privacy, timeZone } from "../lib/rpc.ts";
import {
  Card,
  colors,
  ErrorNote,
  Field,
  headerStyle,
  Loaded,
  Muted,
  PullScroll,
  Quiet,
  Row,
  Section,
  Segmented,
  Skeleton,
} from "../lib/ui.tsx";
import { Header } from "./Header.tsx";
import { bandName, confirm, ScopeRow } from "./Privacy.tsx";
import { openWeb } from "./Settings.tsx";

const LIMITS = ["0", "15", "30", "45", "60", "90"] as const;

/** Learner is how a followed learner is doing, with what their guardian may agree to, limit and delete. */
export function Learner(props: { learnerId: string }) {
  const data = resource(async ({ signal: abort }) => {
    const [learner, consents, list] = await Promise.all([
      account.getGuardedLearner({ learnerId: props.learnerId, timeZone: timeZone() }, { signal: abort }),
      privacy.listConsents({ learnerId: props.learnerId }, { signal: abort }),
      catalog.listCourses({}, { signal: abort }),
    ]);
    return { learner, consents, list };
  });
  const name = computed(() => data()?.learner.learner?.name ?? "");
  const busy = signal(false);
  const note = signal("");
  const error = signal("");
  const password = signal("");
  const act = async (run: () => Promise<unknown>, done?: string) => {
    busy.set(true);
    error.set("");
    note.set("");
    try {
      await run();
      if (done) note.set(done);
      data.refetch();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  const clearText = async () => {
    if (!(await confirm(p().confirmDeleteText, p().deleteTextBody, p().guardianDeleteText))) return;
    await act(async () => {
      const { deleted } = await privacy.deleteResponses({ learnerId: props.learnerId });
      note.set(p().deleted(deleted));
    });
  };
  const limitValue = (minutes: number): (typeof LIMITS)[number] => LIMITS.find((value) => Number(value) === minutes) ?? "0";

  return (
    <NavPage headerStyle={headerStyle()} title={name()} header={<Header title={name()} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={data} skeleton={<Skeleton rows={4} />}>
          {(loaded) => {
            const learner = () => loaded().learner.learner;
            const consents = () => loaded().consents;
            const shown = () => consents().scopes.filter((s) => s.scope !== "research");
            return (
              <PullScroll onRefresh={data.refetch} refreshing={data.state() === "refreshing"}>
                <View style={{ gap: 20 }}>
                  <Card>
                    <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
                      <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>{bandName(consents().band)}</Text>
                      <If when={learner()?.studying}>
                        <Text style={{ color: colors().good, fontSize: 13 }}>{p().studyingNow}</Text>
                      </If>
                    </View>
                    <Muted>{`${m().xpToday(learner()?.xp?.today ?? 0)} · ${m().xpWeek(learner()?.xp?.week ?? 0)}`}</Muted>
                    <Muted>
                      {(learner()?.lastActiveAt ?? 0n) > 0n ? p().lastActive(dateOf(learner()?.lastActiveAt ?? 0n)) : p().notStartedYet}
                    </Muted>
                    <If when={learner()?.recent}>
                      {(recent) => (
                        <Muted>
                          {[
                            `${p().recentWork}: ${p().recentLessons(recent().lessons, recent().failedLessons)}`,
                            recent().blownOff > 0 ? p().recentBlownOff(recent().blownOff) : "",
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </Muted>
                      )}
                    </If>
                  </Card>
                  <Section title={m().courses}>
                    <If when={loaded().learner.enrollments.length > 0} else={<Muted>{p().noCourses}</Muted>}>
                      <Each of={loaded().learner.enrollments} key={(enrollment) => enrollment.courseId}>
                        {(enrollment) => (
                          <View style={{ gap: 2 }}>
                            <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>
                              {tx(loaded().list.courses.find((course) => course.id === enrollment().courseId)?.title) ||
                                enrollment().courseId}
                            </Text>
                            <Muted>
                              {[
                                m().topicsLearned(enrollment().stats?.learned ?? 0, enrollment().stats?.total ?? 0),
                                (enrollment().stats?.due ?? 0) > 0 ? m().dueReviews(enrollment().stats?.due ?? 0) : "",
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </Muted>
                          </View>
                        )}
                      </Each>
                    </If>
                  </Section>
                  <Card>
                    <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{p().guardianControls}</Text>
                    <If when={!shown().some((s) => s.canGrant || s.inForce)}>
                      <Muted>{p().needVerification}</Muted>
                    </If>
                    <Each of={shown()} key={(s) => s.scope}>
                      {(state) => (
                        <ScopeRow
                          state={state()}
                          consents={consents().consents}
                          busy={busy()}
                          onGrant={() => void act(() => privacy.grantConsent({ learnerId: props.learnerId, scope: state().scope }))}
                          onWithdraw={() => void act(() => privacy.withdrawConsent({ learnerId: props.learnerId, scope: state().scope }))}
                        />
                      )}
                    </Each>
                  </Card>
                  <Section title={p().timeLimit}>
                    <Segmented
                      label={p().timeLimit}
                      items={LIMITS.map((value) => ({ value, title: value === "0" ? p().noLimit : value }))}
                      value={limitValue(consents().dailyMinutes)}
                      onChange={(value) =>
                        void act(() => privacy.setTimeLimit({ learnerId: props.learnerId, minutes: Number(value) }), p().saved)
                      }
                    />
                    <Muted>{p().limitBody}</Muted>
                  </Section>
                  <Section title={p().yourData}>
                    <Row title={p().guardianDeleteText} detail={p().deleteTextBody} tone="bad" onPress={() => void clearText()} />
                    <If when={consents().managed}>
                      <Field
                        label={p().resetPassword}
                        value={password()}
                        onChange={(v) => password.set(v)}
                        masked
                        autoComplete="new-password"
                      />
                      <Quiet
                        label={p().save}
                        disabled={busy() || password().length < 8}
                        onPress={() =>
                          void act(async () => {
                            await privacy.resetChildPassword({ learnerId: props.learnerId, password: password() });
                            password.set("");
                          }, p().saved)
                        }
                      />
                    </If>
                    <Row title={p().onTheWeb} onPress={() => void openWeb(`/guardian/${props.learnerId}`)} />
                  </Section>
                  <If when={note()}>
                    <Text android={{ accessibilityLiveRegion: "polite" }} style={{ color: colors().good, fontSize: 14 }}>
                      {note()}
                    </Text>
                  </If>
                  <If when={error()}>
                    <ErrorNote message={error()} />
                  </If>
                </View>
              </PullScroll>
            );
          }}
        </Loaded>
      </View>
    </NavPage>
  );
}
