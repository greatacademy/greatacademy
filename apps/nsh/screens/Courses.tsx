import type { Course } from "@ga/proto/catalog/v1/catalog_pb";
import { computed, Image, List, signal, Text, View } from "nsh";
import { AlertDialog, Input, NavPage } from "nsh/base";
import caretRight from "../assets/icons/caret-right.svg";
import search from "../assets/icons/magnifying-glass.svg";
import { errorText, m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { subjectChoice } from "../lib/prefs.ts";
import { query } from "../lib/query.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { token } from "../lib/session.ts";
import { subjectsOf, tint } from "../lib/subject.tsx";
import { Action, cellStyle, colors, ErrorNote, fieldStyle, Grid, headerStyle, Loaded, Muted, PullScroll, Segmented } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

function SignInButton() {
  return (
    <Text role="button" onPress={() => nav.push({ name: "sign-in" })} style={{ color: colors().accent, fontSize: 15 }}>
      {m().signIn}
    </Text>
  );
}

/** Courses is every course, one subject at a time: opened from the welcome page, or from the subject switcher. */
export function Courses() {
  return (
    <NavPage
      headerStyle={headerStyle()}
      title={m().courses}
      header={<Header title={m().courses} right={token() ? undefined : <SignInButton />} />}
      headerRight={token() ? undefined : <SignInButton />}
    >
      <CourseList visible={() => nav.routes().at(-1)?.name === "courses"} intro={m().coursesIntro} />
    </NavPage>
  );
}

/** Shelf is one shelf of the catalog: its title, and its courses in the order the catalog lists them. */
type Shelf = { title: string; courses: Course[] };

/** shelves groups courses by their `group`, in the order the catalog lists them; courses with none are other courses. */
function shelves(courses: readonly Course[]): Shelf[] {
  const found = new Map<string, Course[]>();
  for (const course of courses) {
    const title = tx(course.group) || m().otherCourses;
    found.set(title, [...(found.get(title) ?? []), course]);
  }
  return [...found].map(([title, list]) => ({ title, courses: list }));
}

/** ShelfRow is one row of the course list: a shelf's title, or up to two of its courses, side by side in a wide window. */
type ShelfRow = { title: string } | { courses: Course[] };

/** shelfRows lays the shelves out as rows, so a list binds only the rows that show. */
function shelfRows(list: readonly Shelf[]): ShelfRow[] {
  return list.flatMap(({ title, courses }) => [
    { title },
    ...Array.from({ length: Math.ceil(courses.length / 2) }, (_, at) => ({ courses: courses.slice(at * 2, at * 2 + 2) })),
  ]);
}

const cardStyle = () => ({
  backgroundColor: colors().surface,
  borderColor: colors().line,
  borderRadius: 16,
  borderWidth: 1,
  gap: 8,
  padding: 18,
});

/** Chip is one of the shelf filters over the list, the shelf shown marked. */
function Chip(props: { label: string; active: boolean; onPress: () => void }) {
  return (
    <View
      role="button"
      accessibilityState={{ selected: props.active }}
      onPress={props.onPress}
      style={{
        backgroundColor: props.active ? colors()["accent-soft"] : colors().surface,
        borderColor: props.active ? colors().accent : colors().line,
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <Text style={{ color: props.active ? colors().accent : colors().muted, fontSize: 14, fontWeight: props.active ? "500" : "400" }}>
        {props.label}
      </Text>
    </View>
  );
}

/** Choosing is what a course list chooses for: the caller's course, or that of a learner they are a guardian of. */
export interface Choosing {
  readonly learnerId?: string;
  /** current is the course now current, which is marked instead of offered; choosing another asks first. */
  readonly current?: string;
  readonly onChosen: (courseId: string, subjectId: string) => void;
}

/**
 * CourseList is the catalog of one subject, as on the web: a search and shelf filters, then the courses by shelf, a
 * course the learner has with how far they are. A retired course shows only to a learner who has it. Given `subject`
 * it lists that subject's; without, tabs at its top pick the subject. `visible` says when the page shows, to read the
 * learner's courses again. Given `choose`, it is the list a course is chosen from, the current course marked.
 */
export function CourseList(props: { visible: () => boolean; choose?: Choosing; intro?: string; subject?: string }) {
  const rpc = query(["courses"], ({ signal }) => catalog.listCourses({}, { signal }));
  const visible = computed(() => props.visible() && token());
  const profile = query(
    visible,
    () => ["profile"],
    (_, { signal }) => learning.getProfile({ timeZone: timeZone() }, { signal }),
  );
  const picked = signal(props.subject ?? subjectChoice());
  const subjects = computed(() => {
    const list = rpc();
    return list ? subjectsOf(list) : [];
  });
  // The subject listed: the one asked for, else the one picked in the tabs while the catalog has it, else the first.
  const shown = computed(() => props.subject ?? subjects().find((s) => s.id === picked())?.id ?? subjects()[0]?.id ?? "");
  const stats = computed(() => new Map((token() ? (profile()?.enrollments ?? []) : []).map((e) => [e.courseId, e.stats])));
  const needle = signal("");
  const shelf = signal("");
  const all = computed(() =>
    shelves((rpc()?.courses ?? []).filter((course) => course.subjectId === shown() && (!course.retired || stats().has(course.id)))),
  );
  const listed = computed(() => {
    const words = needle().trim().toLowerCase();
    return all()
      .filter(({ title }) => !shelf() || title === shelf())
      .map(({ title, courses }) => ({ title, courses: courses.filter((c) => !words || tx(c.title).toLowerCase().includes(words)) }))
      .filter(({ courses }) => courses.length > 0);
  });
  const busy = signal(false);
  const error = signal("");
  const choose = async (choosing: Choosing, courseId: string, subjectId: string) => {
    if (choosing.current) {
      const title = (id: string) => tx(rpc()?.courses.find((course) => course.id === id)?.title) || id;
      const { action } = await AlertDialog.show({
        title: m().switchConfirmTitle(title(courseId)),
        description: m().switchConfirmBody(title(choosing.current)),
        actions: [
          { id: "cancel", label: m().cancel, role: "cancel" },
          { id: "switch", label: m().switchConfirm },
        ],
      });
      if (action !== "switch") return;
    }
    busy.set(true);
    error.set("");
    try {
      await learning.chooseCourse({ courseId, learnerId: choosing.learnerId ?? "" });
      choosing.onChosen(courseId, subjectId);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  const open = (courseId: string) => nav.push({ name: "course", courseId });
  return (
    <View style={{ flex: 1, backgroundColor: colors().page }}>
      <Loaded rpc={rpc}>
        {() => (
          <PullScroll onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"}>
            <View style={{ gap: 12 }}>
              <If when={props.intro}>
                <Text style={{ color: colors().muted, fontSize: 15, lineHeight: 22 }}>{props.intro}</Text>
              </If>
              <If when={!props.subject && subjects().length > 1}>
                <Segmented
                  label={m().subjects}
                  labelHidden
                  items={subjects().map((s) => ({ value: s.id, title: tx(s.title) }))}
                  value={shown()}
                  onChange={(id) => {
                    picked.set(id);
                    shelf.set("");
                  }}
                />
              </If>
              <View>
                <Input
                  accessibilityLabel={m().searchCourses}
                  placeholder={m().searchCourses}
                  value={needle()}
                  onChange={({ value }) => needle.set(value)}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ ...fieldStyle(), paddingLeft: 38 }}
                />
                <Image src={search} style={{ height: 18, left: 12, position: "absolute", tintColor: colors().muted, top: 12, width: 18 }} />
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                <Chip label={m().shelfAll} active={!shelf()} onPress={() => shelf.set("")} />
                <Each of={all()} key={(s) => s.title}>
                  {(s) => <Chip label={s().title} active={shelf() === s().title} onPress={() => shelf.set(s().title)} />}
                </Each>
              </View>
              <If when={error()}>
                <ErrorNote message={error()} />
              </If>
              <If when={listed().length === 0}>
                <Muted>{m().noCoursesFound}</Muted>
              </If>
              <List
                viewport="parent"
                each={shelfRows(listed())}
                keyExtractor={(row) => ("title" in row ? `shelf:${row.title}` : row.courses.map((course) => course.id).join(","))}
                estimatedItemSize={170}
                contentStyle={{ gap: 12 }}
              >
                {(row) => (
                  <If
                    when={"title" in row() ? (row() as { title: string }).title : ""}
                    else={
                      <Grid>
                        <Each of={"courses" in row() ? (row() as { courses: Course[] }).courses : []} key={(course) => course.id}>
                          {(course) => {
                            const own = () => stats().get(course().id);
                            const share = () => ((own()?.learned ?? 0) / Math.max(1, own()?.total ?? 0)) * 100;
                            return (
                              <View
                                role={props.choose ? undefined : "button"}
                                onPress={props.choose ? undefined : () => open(course().id)}
                                style={{ ...cardStyle(), ...cellStyle }}
                              >
                                <View style={{ alignItems: "flex-start", flexDirection: "row", gap: 12 }}>
                                  <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>
                                    {tx(course().title)}
                                  </Text>
                                  <If when={!props.choose}>
                                    <Image src={caretRight} style={{ height: 18, marginTop: 2, tintColor: colors().muted, width: 18 }} />
                                  </If>
                                </View>
                                <Text style={{ color: colors().muted, fontSize: 15, lineHeight: 21, numberOfLines: props.choose ? 3 : 2 }}>
                                  {tx(course().description)}
                                </Text>
                                <If
                                  when={!props.choose && own()}
                                  else={<Muted>{`${m().topics(course().topicCount)} · ${course().xp} XP`}</Muted>}
                                >
                                  <View style={{ gap: 6 }}>
                                    <View style={{ backgroundColor: colors().line, borderRadius: 4, height: 6, overflow: "hidden" }}>
                                      <View
                                        style={{
                                          backgroundColor: tint(subjects().find((s) => s.id === course().subjectId)).strong,
                                          height: 6,
                                          width: `${share()}%`,
                                        }}
                                      />
                                    </View>
                                    <Muted>{m().learnedOf(own()?.learned ?? 0, own()?.total ?? 0)}</Muted>
                                  </View>
                                </If>
                                <If when={props.choose}>
                                  {(choosing) => (
                                    <View style={{ alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16, paddingTop: 4 }}>
                                      <If
                                        when={choosing().current !== course().id}
                                        else={
                                          <Text style={{ color: colors().accent, fontSize: 15, fontWeight: "600" }}>
                                            {m().currentCourse}
                                          </Text>
                                        }
                                      >
                                        <Action
                                          label={choosing().current ? m().switchToThis : m().chooseThis}
                                          disabled={busy()}
                                          onPress={() => void choose(choosing(), course().id, course().subjectId)}
                                        />
                                      </If>
                                      <Text
                                        role="button"
                                        onPress={() => open(course().id)}
                                        style={{ color: colors().accent, fontSize: 15 }}
                                      >
                                        {m().aboutCourse}
                                      </Text>
                                    </View>
                                  )}
                                </If>
                              </View>
                            );
                          }}
                        </Each>
                      </Grid>
                    }
                  >
                    {(title) => <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600", marginTop: 8 }}>{title()}</Text>}
                  </If>
                )}
              </List>
            </View>
          </PullScroll>
        )}
      </Loaded>
    </View>
  );
}
