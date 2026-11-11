import { type CompiledSubject, generateProblem, type Problem, type Text } from "@ga/content";

/** StatsOptions sets how many seeds sample each knowledge point and the depth each kind of knowledge point needs. */
export interface StatsOptions {
  /** samples is the number of seeds each knowledge point is generated with. */
  readonly samples?: number;
  /** minRuled is the distinct problems a knowledge point checked by rules needs (docs/english-curriculum.md: 30). */
  readonly minRuled?: number;
  /** minRuledByStrand overrides minRuled for the topics of a strand, such as 25 for vocabulary (three sentences a word). */
  readonly minRuledByStrand?: Readonly<Record<string, number>>;
  /** minJudged is the distinct tasks a knowledge point judged by a model needs (12). */
  readonly minJudged?: number;
}

/** ThinPoint is a knowledge point with fewer distinct problems than its kind needs. */
export interface ThinPoint {
  readonly topic: string;
  readonly kp: string;
  readonly judged: boolean;
  readonly distinct: number;
  readonly needed: number;
}

/** CourseStats counts one course offered to new learners. */
export interface CourseStats {
  readonly id: string;
  readonly group: string;
  readonly topics: number;
  readonly knowledgePoints: number;
  readonly xp: number;
}

/** SubjectStats counts a subject's content and how deep its problems are. */
export interface SubjectStats {
  readonly subject: string;
  readonly samples: number;
  readonly topics: number;
  readonly knowledgePoints: number;
  readonly judgedTopics: number;
  readonly judgedKnowledgePoints: number;
  readonly courses: readonly CourseStats[];
  readonly retiredCourses: number;
  readonly readingUnits: number;
  readonly passages: number;
  readonly passageQuestions: number;
  readonly conversations: number;
  readonly lexicon: number;
  /** distinctProblems sums the distinct problems of every knowledge point within `samples` seeds. */
  readonly distinctProblems: number;
  /** depth counts knowledge points by their distinct problems, in the buckets of `depthBuckets`. */
  readonly depth: ReadonlyMap<string, number>;
  /** strands counts topics and knowledge points by strand, "-" for a topic without one. */
  readonly strands: ReadonlyMap<string, { readonly topics: number; readonly knowledgePoints: number }>;
  /** singleStep are the topics with only one knowledge point. */
  readonly singleStep: readonly string[];
  readonly thin: readonly ThinPoint[];
}

/** depthBuckets names the buckets of distinct problems per knowledge point, by their lower bounds. */
export const depthBuckets: readonly (readonly [string, number])[] = [
  ["under 10", 0],
  ["10–19", 10],
  ["20–29", 20],
  ["30–49", 30],
  ["50 or more", 50],
];

/**
 * problemKey names what a problem asks regardless of the order its options or items are shuffled in: its prompt, its
 * figure, its options or items sorted, and its right option, or its canonical response for other inputs.
 */
export function problemKey(p: Problem): string {
  const input = p.answer.input;
  const sorted = (texts: readonly Text[]) => texts.map((x) => JSON.stringify(x)).sort();
  const answer =
    input.kind === "choice"
      ? [sorted(input.options), input.options[Number(p.canonical)]]
      : input.kind === "order"
        ? [sorted(input.items)]
        : [p.canonical];
  return JSON.stringify([p.prompt, p.figure?.svg, answer]);
}

/** distinctProblems counts the problems a knowledge point generates within `samples` seeds that differ by `problemKey`. */
export function distinctProblems(subject: CompiledSubject, topic: string, kp: number, samples: number): number {
  const seen = new Set<string>();
  for (let seed = 1; seed <= samples; seed++) seen.add(problemKey(generateProblem(subject, { topic, kp, seed })));
  return seen.size;
}

/** subjectStats counts a compiled subject's content and samples each knowledge point for its depth. */
export function subjectStats(subject: CompiledSubject, options: StatsOptions = {}): SubjectStats {
  const samples = options.samples ?? 100;
  const minRuled = options.minRuled ?? 30;
  const minJudged = options.minJudged ?? 12;
  const def = subject.def;
  const depth = new Map<string, number>(depthBuckets.map(([name]) => [name, 0]));
  const strands = new Map<string, { topics: number; knowledgePoints: number }>();
  const singleStep: string[] = [];
  const thin: ThinPoint[] = [];
  let knowledgePoints = 0;
  let judgedTopics = 0;
  let judgedKnowledgePoints = 0;
  let distinct = 0;
  for (const topic of subject.topics.values()) {
    const judged = topic.criteria !== undefined;
    knowledgePoints += topic.knowledgePoints.length;
    if (judged) {
      judgedTopics++;
      judgedKnowledgePoints += topic.knowledgePoints.length;
    }
    if (topic.knowledgePoints.length === 1) singleStep.push(topic.id);
    const strand = strands.get(topic.strand ?? "-") ?? { topics: 0, knowledgePoints: 0 };
    strand.topics++;
    strand.knowledgePoints += topic.knowledgePoints.length;
    strands.set(topic.strand ?? "-", strand);
    topic.knowledgePoints.forEach((kp, index) => {
      const count = distinctProblems(subject, topic.id, index, samples);
      distinct += count;
      const bucket = depthBuckets.findLast(([, low]) => count >= low)?.[0] ?? "under 10";
      depth.set(bucket, (depth.get(bucket) ?? 0) + 1);
      const ruled = (topic.strand !== undefined ? options.minRuledByStrand?.[topic.strand] : undefined) ?? minRuled;
      const needed = Math.min(samples, judged ? minJudged : ruled);
      if (count < needed) thin.push({ topic: topic.id, kp: kp.id, judged, distinct: count, needed });
    });
  }
  const courses = [...subject.courses.values()];
  const live = courses.filter((c) => !c.def.retired);
  const passages = (def.reading ?? []).flatMap((unit) => unit.passages);
  return {
    subject: def.id,
    samples,
    topics: subject.topics.size,
    knowledgePoints,
    judgedTopics,
    judgedKnowledgePoints,
    courses: live.map((c) => {
      const topics = c.topics.map((id) => subject.topics.get(id)).filter((t) => t !== undefined);
      return {
        id: c.def.id,
        group: c.def.group?.en ?? "",
        topics: topics.length,
        knowledgePoints: topics.reduce((sum, t) => sum + t.knowledgePoints.length, 0),
        xp: topics.reduce((sum, t) => sum + t.xp, 0),
      };
    }),
    retiredCourses: courses.length - live.length,
    readingUnits: def.reading?.length ?? 0,
    passages: passages.length,
    passageQuestions: passages.reduce((sum, p) => sum + p.questions.length, 0),
    conversations: def.conversations?.length ?? 0,
    lexicon: def.lexicon ? Object.keys(def.lexicon).length : 0,
    distinctProblems: distinct,
    depth,
    strands,
    singleStep,
    thin,
  };
}

/** renderStats writes the statistics as Markdown, with the thin knowledge points and single-step topics listed. */
export function renderStats(stats: SubjectStats): string {
  const lines = [
    `# Content statistics: ${stats.subject}`,
    "",
    "| Measure | Count |",
    "| :--- | ---: |",
    `| Courses offered (retired) | ${stats.courses.length} (${stats.retiredCourses}) |`,
    `| Topics | ${stats.topics} |`,
    `| Knowledge points | ${stats.knowledgePoints} |`,
    `| Topics judged by a model (their knowledge points) | ${stats.judgedTopics} (${stats.judgedKnowledgePoints}) |`,
    `| Reading units, passages, questions | ${stats.readingUnits}, ${stats.passages}, ${stats.passageQuestions} |`,
    `| Conversations | ${stats.conversations} |`,
    `| Lexicon entries | ${stats.lexicon} |`,
    `| Distinct problems in ${stats.samples} seeds per knowledge point | ${stats.distinctProblems} |`,
    "",
    `## Knowledge points by distinct problems in ${stats.samples} seeds`,
    "",
    "| Distinct problems | Knowledge points |",
    "| :--- | ---: |",
    ...[...stats.depth].map(([bucket, n]) => `| ${bucket} | ${n} |`),
    "",
    "## Strands",
    "",
    "| Strand | Topics | Knowledge points |",
    "| :--- | ---: | ---: |",
    ...[...stats.strands].map(([id, s]) => `| ${id} | ${s.topics} | ${s.knowledgePoints} |`),
    "",
    "## Courses",
    "",
    "| Course | Shelf | Topics | Knowledge points | XP |",
    "| :--- | :--- | ---: | ---: | ---: |",
    ...stats.courses.map((c) => `| ${c.id} | ${c.group} | ${c.topics} | ${c.knowledgePoints} | ${c.xp} |`),
    "",
    `## Thin knowledge points (${stats.thin.length})`,
    "",
    ...stats.thin.map((p) => `- ${p.topic}#${p.kp}: ${p.distinct} of ${p.needed}${p.judged ? " (judged)" : ""}`),
    "",
    `## Topics with one knowledge point (${stats.singleStep.length})`,
    "",
    ...stats.singleStep.map((id) => `- ${id}`),
    "",
  ];
  return lines.join("\n");
}
