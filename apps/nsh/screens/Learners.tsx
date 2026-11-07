import { Code, ConnectError } from "@connectrpc/connect";
import { signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";
import { errorText, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { dateOf, p } from "../lib/privacy-text.ts";
import { query } from "../lib/query.ts";
import { account, timeZone } from "../lib/rpc.ts";
import { Action, Card, colors, ErrorNote, Field, headerStyle, Loaded, Muted, PullScroll, Row, Skeleton } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";
import { openWeb } from "./Settings.tsx";

/** Learners lists the learners the account follows as a guardian, and follows another with an invitation code. */
export function Learners() {
  const rpc = query(["learners"], ({ signal: abort }) => account.listGuardedLearners({ timeZone: timeZone() }, { signal: abort }));
  const code = signal("");
  const busy = signal(false);
  const error = signal("");
  const follow = async () => {
    busy.set(true);
    error.set("");
    try {
      const { learnerId } = await account.acceptGuardianInvite({ code: code().trim() });
      code.set("");
      rpc.refetch();
      nav.push({ name: "learner", learnerId });
    } catch (e) {
      const known = e instanceof ConnectError && (e.code === Code.NotFound || e.code === Code.InvalidArgument);
      error.set(known ? p().codeInvalid : errorText(e));
    } finally {
      busy.set(false);
    }
  };

  return (
    <NavPage headerStyle={headerStyle()} title={p().guardedTitle} header={<Header title={p().guardedTitle} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={rpc} skeleton={<Skeleton rows={3} />}>
          {(data) => (
            <PullScroll onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"}>
              <View style={{ gap: 12 }}>
                <If when={data().learners.length > 0} else={<Muted>{p().guardedNone}</Muted>}>
                  <Each of={data().learners} key={(learner) => learner.learnerId}>
                    {(learner) => (
                      <View
                        role="button"
                        onPress={() => nav.push({ name: "learner", learnerId: learner().learnerId })}
                        style={{
                          backgroundColor: colors().surface,
                          borderColor: colors().line,
                          borderRadius: 12,
                          borderWidth: 1,
                          gap: 4,
                          padding: 16,
                        }}
                      >
                        <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
                          <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>{learner().name}</Text>
                          <If when={learner().studying}>
                            <Text style={{ color: colors().good, fontSize: 13 }}>{p().studyingNow}</Text>
                          </If>
                        </View>
                        <Muted>{`${m().xpToday(learner().xp?.today ?? 0)} · ${m().xpWeek(learner().xp?.week ?? 0)}`}</Muted>
                        <Muted>{learner().lastActiveAt > 0n ? p().lastActive(dateOf(learner().lastActiveAt)) : p().notStartedYet}</Muted>
                      </View>
                    )}
                  </Each>
                </If>
                <Card>
                  <Muted>{p().guardedBody}</Muted>
                  <Field label={p().enterCode} value={code()} onChange={(v) => code.set(v)} autoComplete="off" />
                  <If when={error()}>
                    <ErrorNote message={error()} />
                  </If>
                  <Action label={p().accept} disabled={busy() || !code().trim()} onPress={() => void follow()} />
                </Card>
                <Row title={p().onTheWeb} onPress={() => void openWeb("/guardian")} />
              </View>
            </PullScroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
