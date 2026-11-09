import { resolveColorScheme, type SubjectColors, subjectColors } from "@ga/design";
import type { ListCoursesResponse, Subject } from "@ga/proto/catalog/v1/catalog_pb";
import type { Enrollment, GetProfileResponse } from "@ga/proto/learning/v1/learning_pb";
import { colorScheme, computed, Image, platform, type Resource, Scroll, safeAreaInsets, signal, Text, View } from "nsh";
import { Popover, Sheet } from "nsh/base";

import caretDown from "../assets/caret-down.svg";
import check from "../assets/check.svg";
import { m, tx } from "./i18n.ts";
import { nav } from "./nav.ts";
import { appearance, chooseSubject, subjectChoice } from "./prefs.ts";
import { query } from "./query.ts";
import { catalog, learning, timeZone } from "./rpc.ts";
import { colors } from "./ui.tsx";

/** PlaceData is what the subject pages read: the learner's profile and the catalog. */
export interface PlaceData {
  readonly profile: GetProfileResponse;
  readonly list: ListCoursesResponse;
}

/**
 * Place is where the learner is (docs/experience.md §3): the subjects, the one shown, and the learner's current
 * course in it, if any.
 */
export interface Place {
  readonly data: PlaceData;
  readonly subjects: readonly Subject[];
  readonly subject: Subject | undefined;
  readonly enrollment: Enrollment | undefined;
  readonly canDecide: boolean;
}

/** loadPlace reads the profile and the catalog together. */
export async function loadPlace(abort: AbortSignal): Promise<PlaceData> {
  const [profile, list] = await Promise.all([
    learning.getProfile({ timeZone: timeZone() }, { signal: abort }),
    catalog.listCourses({}, { signal: abort }),
  ]);
  return { profile, list };
}

/** subjectsOf lists the catalog's subjects; a catalog that names none has them read off its courses. */
export function subjectsOf(list: ListCoursesResponse): readonly Subject[] {
  if (list.subjects.length > 0) return list.subjects;
  const found = new Map<string, Subject>();
  for (const course of list.courses) {
    if (found.has(course.subjectId)) continue;
    const title = course.subjectTitle;
    const mark = [...(title?.values.en ?? course.subjectId)][0]?.toUpperCase() ?? "?";
    found.set(course.subjectId, { id: course.subjectId, title, mark, hue: 250 } as Subject);
  }
  return [...found.values()];
}

/**
 * placeOf finds the subject to show: the one chosen on this device while it is in the catalog, else the subject of
 * the course most recently worked in, else the catalog's first.
 */
export function placeOf(data: PlaceData, chosen: string): Place {
  const subjects = subjectsOf(data.list);
  const enrollments = data.profile.enrollments;
  const subject =
    subjects.find((s) => s.id === chosen) ?? subjects.find((s) => s.id === enrollments[0]?.subjectId) ?? subjects[0] ?? undefined;
  return {
    data,
    subjects,
    subject,
    enrollment: enrollments.find((e) => e.subjectId === subject?.id),
    canDecide: data.profile.canDecide,
  };
}

/** usePlace reads the place while `source` holds, again each time it starts holding, as when a tab is shown again. */
export function usePlace(source: () => boolean): { rpc: Resource<PlaceData>; place: () => Place | undefined } {
  const shown = computed(() => source() || undefined);
  const rpc = query(
    shown,
    () => ["place"],
    (_, { signal: abort }) => loadPlace(abort),
  );
  const place = computed(() => {
    const data = rpc();
    return data ? placeOf(data, subjectChoice()) : undefined;
  });
  return { rpc, place };
}

/** courseTitle names a course of the catalog by its id. */
export function courseTitle(list: ListCoursesResponse, id: string): string {
  return tx(list.courses.find((course) => course.id === id)?.title) || id;
}

/** tint gives a subject's colors in the scheme shown and at the contrast chosen. */
export function tint(subject: Subject | undefined): SubjectColors {
  const scheme = resolveColorScheme(appearance().theme, colorScheme());
  return subjectColors(subject?.hue ?? 250, scheme, appearance().contrast);
}

/** SubjectMark is a subject's mark: its letter on a rounded square of its color. */
export function SubjectMark(props: { subject: Subject | undefined; size: number }) {
  return (
    <View
      accessibilityElementsHidden
      style={{
        alignItems: "center",
        backgroundColor: tint(props.subject).strong,
        borderRadius: props.size * 0.28,
        height: props.size,
        justifyContent: "center",
        width: props.size,
      }}
    >
      <Text style={{ color: tint(props.subject).onStrong, fontSize: props.size * 0.5, fontWeight: "700" }}>
        {props.subject?.mark ?? ""}
      </Text>
    </View>
  );
}

/** SubjectChoices lists the subjects to switch to, each with its course and today's XP, and the way to every course. */
function SubjectChoices(props: { place: Place; onChosen: () => void }) {
  const enrollment = (id: string) => props.place.data.profile.enrollments.find((e) => e.subjectId === id);
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ color: colors().muted, fontSize: 13, fontWeight: "600", paddingHorizontal: 8, paddingVertical: 4 }}>
        {m().subjects}
      </Text>
      <Each of={[...props.place.subjects]} key={(s) => s.id}>
        {(subject) => {
          const chosen = () => subject().id === props.place.subject?.id;
          const detail = () => {
            const e = enrollment(subject().id);
            if (!e) return m().subjectNotStarted;
            return `${courseTitle(props.place.data.list, e.courseId)} · ${m().subjectToday(e.xp?.today ?? 0, e.xp?.goalToday ?? 0)}`;
          };
          return (
            <View
              role="button"
              accessibilityLabel={tx(subject().title)}
              accessibilityState={{ selected: chosen() }}
              onPress={() => {
                chooseSubject(subject().id);
                props.onChosen();
              }}
              hoverStyle={{ backgroundColor: colors().line }}
              style={{
                alignItems: "center",
                backgroundColor: chosen() ? tint(subject()).soft : "transparent",
                borderRadius: 10,
                flexDirection: "row",
                gap: 12,
                minHeight: 52,
                paddingHorizontal: 8,
                paddingVertical: 6,
              }}
            >
              <SubjectMark subject={subject()} size={32} />
              <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
                <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>{tx(subject().title)}</Text>
                <Text style={{ color: colors().muted, fontSize: 13, numberOfLines: 1 }}>{detail()}</Text>
              </View>
              <If when={chosen()}>
                <Image src={check} style={{ height: 14, tintColor: tint(subject()).onSoft, width: 14 }} />
              </If>
            </View>
          );
        }}
      </Each>
      <View style={{ backgroundColor: colors().line, height: 1, marginVertical: 4 }} />
      <Text
        role="button"
        onPress={() => {
          props.onChosen();
          nav.push({ name: "courses" });
        }}
        hoverStyle={{ backgroundColor: colors().line }}
        style={{ borderRadius: 10, color: colors().accent, fontSize: 15, paddingHorizontal: 8, paddingVertical: 10 }}
      >
        {m().allCourses}
      </Text>
    </View>
  );
}

/**
 * SubjectSwitcher names the subject shown, with its mark, and opens the list to switch to another: a popup under it
 * on the desktops, a sheet from the bottom on phones. `compact` shows the mark alone, as a narrow sidebar does; `size`
 * is the name's size.
 */
export function SubjectSwitcher(props: { place: Place | undefined; size: number; compact?: boolean }) {
  const open = signal(false);
  const insets = safeAreaInsets();
  const title = () => tx(props.place?.subject?.title);
  const trigger = () => (
    <View
      role="button"
      accessibilityLabel={m().subjectSwitch(title())}
      tooltip={props.compact ? title() : undefined}
      onPress={platform.desktop ? undefined : () => open.set(true)}
      hoverStyle={{ backgroundColor: colors().line }}
      style={{
        alignItems: "center",
        alignSelf: "flex-start",
        borderRadius: 10,
        flexDirection: "row",
        gap: 8,
        marginHorizontal: -4,
        maxWidth: "100%",
        padding: 4,
      }}
    >
      <SubjectMark subject={props.place?.subject} size={props.size + 8} />
      <If when={!props.compact}>
        <Text style={{ color: colors().ink, flexShrink: 1, fontSize: props.size, fontWeight: "700", numberOfLines: 1 }}>{title()}</Text>
        <Image src={caretDown} style={{ height: 12, tintColor: colors().muted, width: 12 }} />
      </If>
    </View>
  );
  const choices = () => <If when={props.place}>{(place) => <SubjectChoices place={place()} onChosen={() => open.set(false)} />}</If>;
  return (
    <If
      when={platform.desktop}
      else={
        <>
          {trigger()}
          <Sheet
            open={open()}
            onOpenChange={({ open: next }) => open.set(next)}
            closeOnSwipe
            popupStyle={{
              backgroundColor: colors().page,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "70%",
              padding: 12,
              paddingBottom: 12 + insets().bottom,
            }}
            backdropStyle={{ backgroundColor: "#00000066" }}
          >
            <Scroll style={{ flexShrink: 1 }}>{choices()}</Scroll>
          </Sheet>
        </>
      }
    >
      <Popover
        open={open()}
        onOpenChange={({ open: next }) => open.set(next)}
        placement="bottom"
        align="start"
        offset={4}
        margin={8}
        popupStyle={{
          backgroundColor: colors().surface,
          borderColor: colors().line,
          borderRadius: 12,
          borderWidth: 1,
          padding: 6,
          width: 300,
        }}
        trigger={trigger()}
      >
        {choices()}
      </Popover>
    </If>
  );
}
