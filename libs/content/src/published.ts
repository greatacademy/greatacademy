// The ids learner state names never change once published (Content §2). A subject's package keeps the ids it has
// published in `published-ids.txt`, and its tests fail when an id there is no longer defined, or when a defined id has
// not been recorded there yet; `pnpm nx run audit:ids` records the new ones.

import type { SubjectDef } from "./types.ts";

/** IdKind is a kind of id that learner state names. */
export type IdKind = "course" | "topic" | "passage" | "conversation";

/** PublishedIds are the ids of a subject that learner state names, by kind, and each topic's knowledge points. */
export interface PublishedIds {
  readonly ids: ReadonlyMap<IdKind, ReadonlySet<string>>;
  readonly points: ReadonlyMap<string, ReadonlySet<string>>;
}

const KINDS: readonly IdKind[] = ["course", "topic", "passage", "conversation"];

/** subjectIds are the ids a subject defines that learner state names: courses, topics, knowledge points, passages and conversations. */
export function subjectIds(subject: SubjectDef): PublishedIds {
  return {
    ids: new Map<IdKind, ReadonlySet<string>>([
      ["course", new Set(subject.courses.map((c) => c.id))],
      ["topic", new Set(subject.topics.map((t) => t.id))],
      ["passage", new Set((subject.reading ?? []).flatMap((u) => u.passages.map((p) => p.id)))],
      ["conversation", new Set((subject.conversations ?? []).map((c) => c.id))],
    ]),
    points: new Map(subject.topics.map((t) => [t.id, new Set(t.knowledgePoints.map((k) => k.id))])),
  };
}

/** formatIds writes ids one per line, sorted, a topic followed by its knowledge points: `topic <id> <point> …`. */
export function formatIds(ids: PublishedIds): string {
  const lines: string[] = [];
  for (const kind of KINDS) {
    for (const id of [...(ids.ids.get(kind) ?? [])].sort()) {
      lines.push(kind === "topic" ? [kind, id, ...[...(ids.points.get(id) ?? [])].sort()].join(" ") : `${kind} ${id}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

/** parseIds reads ids written by formatIds. */
export function parseIds(text: string): PublishedIds {
  const ids = new Map<IdKind, Set<string>>(KINDS.map((k) => [k, new Set<string>()]));
  const points = new Map<string, Set<string>>();
  for (const line of text.split("\n")) {
    const [kind, id, ...rest] = line.trim().split(/\s+/u);
    if (!kind || !id) continue;
    const set = ids.get(kind as IdKind);
    if (!set) throw new Error(`unknown kind of id: ${line}`);
    set.add(id);
    if (kind === "topic") points.set(id, new Set(rest));
  }
  return { ids, points };
}

/** mergeIds are the ids of both. */
export function mergeIds(a: PublishedIds, b: PublishedIds): PublishedIds {
  const ids = new Map<IdKind, ReadonlySet<string>>(KINDS.map((k) => [k, new Set([...(a.ids.get(k) ?? []), ...(b.ids.get(k) ?? [])])]));
  const points = new Map<string, ReadonlySet<string>>();
  for (const id of ids.get("topic")!) points.set(id, new Set([...(a.points.get(id) ?? []), ...(b.points.get(id) ?? [])]));
  return { ids, points };
}

/** missingIds are the ids of `from` that `to` lacks, as `<kind> <id>` and `point <topic>#<point>`. */
export function missingIds(from: PublishedIds, to: PublishedIds): readonly string[] {
  const out: string[] = [];
  for (const kind of KINDS) {
    const have = to.ids.get(kind) ?? new Set();
    for (const id of from.ids.get(kind) ?? []) if (!have.has(id)) out.push(`${kind} ${id}`);
  }
  for (const [topic, points] of from.points) {
    const have = to.points.get(topic);
    if (!have) continue;
    for (const p of points) if (!have.has(p)) out.push(`point ${topic}#${p}`);
  }
  return out.sort();
}
