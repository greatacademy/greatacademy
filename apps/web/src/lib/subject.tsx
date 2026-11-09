import { subjectCss } from "@ga/design";
import type { Subject } from "@ga/proto/catalog/v1/catalog_pb";
import type { Enrollment } from "@ga/proto/learning/v1/learning_pb";
import { useQuery } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

import { useSession } from "./auth.ts";
import { useI18n } from "./i18n.tsx";
import { catalog, learning, timeZone } from "./rpc.ts";

const STORAGE_KEY = "ga-subject";

/** rememberedSubject is the subject this browser last opened, or "" (docs/experience.md §2). */
export function rememberedSubject(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** rememberSubject keeps the subject now open, for the next visit. */
export function rememberSubject(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage can be blocked; the next visit then opens the subject most recently worked in.
  }
}

/** useCatalog reads the subjects and courses on offer, shared by every page. */
export function useCatalog() {
  return useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}), staleTime: 5 * 60_000 });
}

/** useProfile reads the signed-in learner's current courses, one per subject, the one most recently worked in first. */
export function useProfile() {
  const { data: session } = useSession();
  return useQuery({ queryKey: ["profile"], queryFn: () => learning.getProfile({ timeZone: timeZone() }), enabled: !!session });
}

/** useSubjects lists the subjects on offer, in their order, or none while the catalog loads. */
export function useSubjects(): readonly Subject[] {
  return useCatalog().data?.subjects ?? [];
}

/** useSubjectOfCourse finds the subject a course belongs to, once the catalog is known. */
export function useSubjectOfCourse(courseId: string | undefined): Subject | undefined {
  const list = useCatalog().data;
  const subjectId = list?.courses.find((c) => c.id === courseId)?.subjectId;
  return list?.subjects.find((s) => s.id === subjectId);
}

/** SubjectPlace is the subject a page belongs to, with the learner's current course in it, if any. */
export interface SubjectPlace {
  subject: Subject;
  enrollment?: Enrollment;
}

const SubjectContext = createContext<SubjectPlace | null>(null);

/** SubjectProvider tells the pages under it which subject they belong to. */
export function SubjectProvider({ place, children }: { place: SubjectPlace; children: ReactNode }) {
  return <SubjectContext.Provider value={place}>{children}</SubjectContext.Provider>;
}

/** useSubjectPlace is the subject of the page, or null outside a subject. */
export function useSubjectPlace(): SubjectPlace | null {
  return useContext(SubjectContext);
}

let shown = "";
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * useShowSubject tells the header which subject the page belongs to while the page is open, and remembers it for
 * the next visit. Pages outside a subject leave it alone, and the header ignores it there.
 */
export function useShowSubject(id: string | undefined) {
  useEffect(() => {
    if (!id) return;
    rememberSubject(id);
    shown = id;
    for (const listener of listeners) listener();
  }, [id]);
}

/** useShownSubject is the subject the last subject page showed, or "" before any; the server renders none. */
export function useShownSubject(): string {
  return useSyncExternalStore(
    subscribe,
    () => shown,
    () => "",
  );
}

/** SubjectStyles gives every element marked with a subject's id that subject's colors. */
export function SubjectStyles() {
  const subjects = useSubjects();
  const css = useMemo(() => subjectCss(subjects.map((s) => ({ id: s.id, hue: s.hue }))), [subjects]);
  return css ? <style>{css}</style> : null;
}

/** SubjectMark is a subject's mark on its tinted square, the chip's first half, at a size in pixels. */
export function SubjectMark({ subject, size = 28 }: { subject: Pick<Subject, "id" | "mark">; size?: number }) {
  return (
    <span
      data-subject={subject.id}
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      className="inline-flex shrink-0 items-center justify-center rounded-lg bg-subject font-semibold leading-none text-on-subject"
    >
      {subject.mark}
    </span>
  );
}

/** SubjectChip is a subject's mark beside its name: where a page belongs (docs/experience.md §2). */
export function SubjectChip({ subject, size = 28, className = "" }: { subject: Subject; size?: number; className?: string }) {
  const { tx } = useI18n();
  return (
    <span className={`inline-flex min-w-0 items-center gap-2 font-semibold ${className}`}>
      <SubjectMark subject={subject} size={size} />
      <span className="min-w-0 truncate">{tx(subject.title)}</span>
    </span>
  );
}
