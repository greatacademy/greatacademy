import { type CompiledSubject, generateProblem } from "@ga/content";

/** Outline is a reference course outline: its stated size and its topic titles in order. */
export interface Outline {
  readonly size: string;
  readonly titles: readonly string[];
}

/** CourseGap lists the outline topics a course does not cover yet. */
export interface CourseGap {
  readonly course: string;
  /** missing are outline titles with no topic of that title in the course. */
  readonly missing: readonly { readonly title: string; readonly existsAs: readonly string[] }[];
}

/** AuditReport is the result of an audit: course gaps and topic-level findings by check. */
export interface AuditReport {
  readonly gaps: readonly CourseGap[];
  readonly findings: ReadonlyMap<string, readonly string[]>;
}

/** samplesPerKnowledgePoint is how many seeds each generator is sampled with. */
export const samplesPerKnowledgePoint = 40;
/** minProseWords is the fewest words an explanation needs outside its math. */
export const minProseWords = 15;

const cjk = /[一-鿿]/;
const visualTitle =
  /graph|plot|diagram|number line|figure|picture|chart|histogram|box plot|dot plot|scatter|shaded|net|polygon|triangle|circle/i;

/** normalizeTitle reduces a title to lowercase words so that outline and code titles compare equal. */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** parseOutline reads a course outline from docs/math-courses: the size line and the numbered topic titles. */
export function parseOutline(markdown: string): Outline {
  return {
    size: markdown.match(/\*\*Size:\*\*\s*(.+)/)?.[1] ?? "",
    titles: [...markdown.matchAll(/^\d+\.\d+\.\d+\.\s+(.+?)\s*$/gm)].map((m) => m[1] ?? ""),
  };
}

/** proseWords counts the words of an explanation outside its $…$ and $$…$$ math. */
export function proseWords(text: string): number {
  return text.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, " ").match(/[A-Za-z]{2,}/g)?.length ?? 0;
}

/**
 * audit compares every course with its outline and runs heuristic checks over
 * every topic, knowledge point and sampled problem. Findings are leads to
 * review, not errors: each check has false positives.
 */
export function audit(subject: CompiledSubject, outlines: ReadonlyMap<string, Outline>): AuditReport {
  const byTitle = new Map<string, string[]>();
  for (const topic of subject.topics.values()) {
    const key = normalizeTitle(topic.title.en);
    byTitle.set(key, [...(byTitle.get(key) ?? []), topic.id]);
  }

  const used = new Set<string>();
  const gaps: CourseGap[] = [];
  for (const course of subject.courses.values()) {
    for (const id of course.topics) used.add(id);
    const outline = outlines.get(course.def.id);
    if (!outline) continue;
    const covered = new Set(course.topics.map((id) => normalizeTitle(subject.topics.get(id)?.title.en ?? "")));
    gaps.push({
      course: course.def.id,
      missing: outline.titles
        .filter((title) => !covered.has(normalizeTitle(title)))
        .map((title) => ({ title, existsAs: byTitle.get(normalizeTitle(title)) ?? [] })),
    });
  }

  const findings = new Map<string, string[]>();
  const add = (check: string, item: string) => findings.set(check, [...(findings.get(check) ?? []), item]);
  for (const topic of subject.topics.values()) {
    if (!used.has(topic.id)) add("topic in no course", topic.id);
    if (topic.knowledgePoints.length < 2) add("topic with fewer than 2 knowledge points", topic.id);
    const sameTitle = byTitle.get(normalizeTitle(topic.title.en)) ?? [];
    if (sameTitle.length > 1 && sameTitle[0] === topic.id) add("duplicate topic titles", `${topic.title.en}: ${sameTitle.join(", ")}`);
    if (!cjk.test(topic.title["zh-CN"])) add("zh title without Chinese", `${topic.id}: ${topic.title["zh-CN"]}`);

    let hasFigure = false;
    const explanations = new Set<string>();
    topic.knowledgePoints.forEach((kp, index) => {
      const path = `${topic.id}#${kp.id}`;
      if (explanations.has(kp.explanation.en)) add("duplicate explanation within a topic", path);
      explanations.add(kp.explanation.en);
      if (proseWords(kp.explanation.en) < minProseWords) add(`explanation under ${minProseWords} words of prose`, path);
      if (!cjk.test(kp.explanation["zh-CN"])) add("zh explanation without Chinese", path);
      if (kp.figure) hasFigure = true;

      let choices = 0;
      let options = 0;
      let noWrong = 0;
      let leaks = 0;
      const answerIndexes = new Set<number>();
      const terse = new Set<string>();
      for (let seed = 1; seed <= samplesPerKnowledgePoint; seed++) {
        let problem: ReturnType<typeof generateProblem>;
        try {
          problem = generateProblem(subject, { topic: topic.id, kp: index, seed });
        } catch (e) {
          add("generator throws", `${path} seed ${seed}: ${(e as Error).message}`);
          return;
        }
        if (problem.figure) hasFigure = true;
        if (problem.answer.input.kind === "choice") {
          choices++;
          options = problem.answer.input.options.length;
          answerIndexes.add(Number(problem.answer.expected));
        }
        if (!problem.wrong?.length) noWrong++;
        if (!cjk.test(problem.prompt["zh-CN"])) add("zh prompt without Chinese", `${path} seed ${seed}`);
        if (problem.solution.en.length < 25) terse.add(problem.solution.en);
        const canonical = problem.canonical;
        if (
          problem.answer.input.kind !== "choice" &&
          canonical.length >= 4 &&
          /[a-z\\]/.test(canonical) &&
          problem.prompt.en.includes(canonical)
        )
          leaks++;
      }
      for (const solution of terse) add("terse solution (under 25 characters)", `${path}: ${solution}`);
      if (choices === samplesPerKnowledgePoint && answerIndexes.size === 1) add("choice answer always at the same index", path);
      if (choices === samplesPerKnowledgePoint && options === 2) add("two-option choice", path);
      if (noWrong === samplesPerKnowledgePoint) add("no wrong responses listed", path);
      if (leaks > samplesPerKnowledgePoint / 2) add("canonical answer appears in the prompt", path);
    });
    if (visualTitle.test(topic.title.en) && !hasFigure) add("visual topic without a figure", `${topic.id}: ${topic.title.en}`);
  }
  return { gaps, findings };
}

/** renderReport formats an audit as Markdown: a summary table, then course gaps, then findings by check. */
export function renderReport(report: AuditReport): string {
  const lines = ["# Content audit", "", "## Summary", "", "| Check | Count |", "| :--- | ---: |"];
  for (const [check, items] of report.findings) lines.push(`| ${check} | ${items.length} |`);
  lines.push("", "## Outline topics missing from courses", "");
  for (const gap of report.gaps) {
    if (gap.missing.length === 0) continue;
    const absent = gap.missing.filter((m) => m.existsAs.length === 0).length;
    lines.push(`### ${gap.course}: ${gap.missing.length} missing (${absent} not written anywhere)`, "");
    for (const m of gap.missing) lines.push(`- ${m.title}${m.existsAs.length ? ` (exists as ${m.existsAs.join(", ")})` : ""}`);
    lines.push("");
  }
  lines.push("## Findings", "");
  for (const [check, items] of report.findings) {
    lines.push(`### ${check} (${items.length})`, "");
    for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  }
  return lines.join("\n");
}
