import { computed, resource, Scroll, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { errorText, m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { catalog, learning } from "../lib/rpc.ts";
import { token } from "../lib/session.ts";
import { Action, colors, ErrorNote, headerStyle, Loaded } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** CourseOutline is a course's outline, and the way into studying it. */
export function CourseOutline(props: { courseId: string }) {
  const rpc = resource(({ signal }) => catalog.getCourse({ courseId: props.courseId }, { signal }));
  const title = computed(() => tx(rpc()?.course?.title));
  const busy = signal(false);
  const error = signal("");

  // Enrolling twice is harmless, so a learner already in the course just goes on to it.
  async function study() {
    if (!token()) {
      nav.push({ name: "sign-in" });
      return;
    }
    busy.set(true);
    error.set("");
    try {
      await learning.enroll({ courseId: props.courseId });
      nav.push({ name: "learn", courseId: props.courseId });
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  }

  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />}>
      <View style={{ flex: 1, backgroundColor: colors().page }}>
        <Loaded rpc={rpc}>
          {(data) => (
            <Scroll style={{ flex: 1 }}>
              <View style={{ padding: 16, gap: 12 }}>
                <Action label={m().enroll} disabled={busy()} onPress={() => void study()} />
                <If when={error()}>
                  <ErrorNote message={error()} />
                </If>
                <Each of={data().course?.units ?? []}>
                  {(unit) => (
                    <View
                      style={{
                        backgroundColor: colors().surface,
                        borderColor: colors().line,
                        borderWidth: 1,
                        borderRadius: 12,
                        padding: 16,
                        gap: 6,
                      }}
                    >
                      <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{tx(unit().title)}</Text>
                      <Each of={unit().modules}>
                        {(module) => (
                          <View style={{ gap: 4, marginTop: 8 }}>
                            <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>{tx(module().title)}</Text>
                            <Each of={module().topics} key={(topic) => topic.id}>
                              {(topic) => <Text style={{ color: colors().ink, fontSize: 15 }}>· {tx(topic().title)}</Text>}
                            </Each>
                          </View>
                        )}
                      </Each>
                    </View>
                  )}
                </Each>
              </View>
            </Scroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
