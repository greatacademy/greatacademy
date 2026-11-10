import { CheckerRegistry } from "./checkers.ts";
import { explanationParts, figureIssue } from "./figure.ts";
import { bodyWords, lexiconIndex } from "./passages.ts";
import type { Text } from "./text.ts";
import { isText, locales } from "./text.ts";
import type { CourseDef, CriterionSpec, KnowledgePointDef, SubjectDef, TopicDef } from "./types.ts";

/** Issue is a problem the compiler found in a subject's content. */
export interface Issue {
  readonly severity: "error" | "warning";
  /** path locates the issue, such as "topic add-integers › kp same-sign". */
  readonly path: string;
  readonly message: string;
}

/** WeightedEdge is an encompassing edge in the compiled graph. */
export interface WeightedEdge {
  readonly topic: string;
  readonly weight: number;
}

/** GraphKnowledgePoint is what the engine needs of a knowledge point. */
export interface GraphKnowledgePoint {
  readonly id: string;
  readonly keyPrerequisites: readonly string[];
}

/** GraphTopic is what the engine needs of a topic. */
export interface GraphTopic {
  readonly id: string;
  readonly prerequisites: readonly string[];
  readonly encompasses: readonly WeightedEdge[];
  readonly xp: number;
  readonly knowledgePoints: readonly GraphKnowledgePoint[];
  /** diagnosticKp is the index of the knowledge point the diagnostic asks. */
  readonly diagnosticKp: number;
}

/** GraphPassage is what the engine needs of a passage. */
export interface GraphPassage {
  readonly id: string;
  /** unit is the id of its reading unit. */
  readonly unit: string;
  /** previous is the passage before it in the unit, which is read first. */
  readonly previous?: string;
  /** topics are the topics a reader must know, with how much the passage practices each. */
  readonly topics: readonly WeightedEdge[];
  /** words counts its running words. */
  readonly words: number;
  /** wordsByTopic counts the running words each topic teaches; the other words are assumed or explained by the passage. */
  readonly wordsByTopic: Readonly<Record<string, number>>;
  readonly xp: number;
  readonly questions: number;
}

/** Graph is a subject's compiled knowledge graph: plain data, no functions. */
export interface Graph {
  readonly subject: string;
  readonly topics: ReadonlyMap<string, GraphTopic>;
  /** order lists every topic after its prerequisites (a topological order, stable by definition order). */
  readonly order: readonly string[];
  /** dependents are the direct post-requisites of each topic. */
  readonly dependents: ReadonlyMap<string, readonly string[]>;
  /** encompassedBy are the topics that encompass each topic, with their weights. */
  readonly encompassedBy: ReadonlyMap<string, readonly WeightedEdge[]>;
  /** ancestors are every topic reachable through prerequisites, excluding the topic itself. */
  readonly ancestors: ReadonlyMap<string, ReadonlySet<string>>;
  /** passages are the subject's passages, in reading order. */
  readonly passages: ReadonlyMap<string, GraphPassage>;
}

/** CompiledCourse is a course with its derived sets. */
export interface CompiledCourse {
  readonly def: CourseDef;
  /** topics are the course's topics in display order. */
  readonly topics: readonly string[];
  readonly masteryFloor: ReadonlySet<string>;
  /** foundations are ancestors of course topics outside the course and its floor. */
  readonly foundations: readonly string[];
}

/** CompiledSubject is a subject whose content passed the compiler's checks. */
export interface CompiledSubject {
  readonly def: SubjectDef;
  readonly graph: Graph;
  readonly topics: ReadonlyMap<string, TopicDef>;
  readonly courses: ReadonlyMap<string, CompiledCourse>;
  readonly checkers: CheckerRegistry;
  readonly warnings: readonly Issue[];
}

/** CompileError reports every error the compiler found. */
export class CompileError extends Error {
  readonly issues: readonly Issue[];

  constructor(issues: readonly Issue[]) {
    super(`content has ${issues.filter((i) => i.severity === "error").length} error(s):\n${issues.map(formatIssue).join("\n")}`);
    this.name = "CompileError";
    this.issues = issues;
  }
}

/** formatIssue renders an issue on one line. */
export function formatIssue(issue: Issue): string {
  return `${issue.severity}: ${issue.path}: ${issue.message}`;
}

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * compileSubject checks a subject's content and builds its graph. It throws a
 * CompileError when any error is found; warnings are kept on the result.
 */
export function compileSubject(def: SubjectDef): CompiledSubject {
  const issues: Issue[] = [];
  const error = (path: string, message: string) => issues.push({ severity: "error", path, message });
  const warn = (path: string, message: string) => issues.push({ severity: "warning", path, message });
  const text = (path: string, value: Text | undefined) => {
    if (!isText(value)) error(path, "text must be non-empty in every locale");
  };

  if (!idPattern.test(def.id)) error(`subject ${def.id}`, "id must be kebab case");
  text(`subject ${def.id} › title`, def.title);
  if ([...def.mark].length < 1 || [...def.mark].length > 2) error(`subject ${def.id} › mark`, "mark must be one or two characters");
  if (!(def.hue >= 0 && def.hue < 360)) error(`subject ${def.id} › hue`, "hue must be at least 0 and below 360");

  let checkers: CheckerRegistry | undefined;
  try {
    checkers = new CheckerRegistry(def.checkers);
  } catch (e) {
    error(`subject ${def.id}`, (e as Error).message);
  }

  // Topics, their texts and knowledge points.
  const topics = new Map<string, TopicDef>();
  const criteria = new Map<string, CriterionSpec>();
  for (const topic of def.topics) {
    const path = `topic ${topic.id}`;
    if (!idPattern.test(topic.id)) error(path, "id must be kebab case");
    if (topics.has(topic.id)) error(path, "duplicate topic id");
    topics.set(topic.id, topic);
    text(`${path} › title`, topic.title);
    text(`${path} › summary`, topic.summary);
    if (!(Number.isFinite(topic.xp) && topic.xp > 0)) error(path, `xp must be positive, got ${topic.xp}`);
    if (topic.knowledgePoints.length === 0) error(path, "a topic needs at least one knowledge point");
    const kpIds = new Set<string>();
    for (const kp of topic.knowledgePoints) {
      const kpPath = `${path} › kp ${kp.id}`;
      if (!idPattern.test(kp.id)) error(kpPath, "id must be kebab case");
      if (kpIds.has(kp.id)) error(kpPath, "duplicate knowledge point id");
      kpIds.add(kp.id);
      text(`${kpPath} › title`, kp.title);
      text(`${kpPath} › explanation`, kp.explanation);
      const figure = kp.figure && figureIssue(kp.figure);
      if (figure) error(kpPath, figure);
      for (const drawn of kp.figures ?? []) {
        const issue = figureIssue(drawn);
        if (issue) error(kpPath, issue);
      }
      for (const locale of locales) {
        const placed = explanationParts(kp.explanation[locale] ?? "").filter((part) => typeof part === "number");
        const expected = (kp.figures ?? []).map((_, i) => i);
        if (JSON.stringify([...placed].sort((a, b) => a - b)) !== JSON.stringify(expected))
          error(kpPath, `explanation must place each of its ${expected.length} figures once in ${locale}`);
      }
      if (typeof kp.generate !== "function") error(kpPath, "generate must be a function");
    }
    if (topic.diagnostic !== undefined && !kpIds.has(topic.diagnostic))
      error(path, `diagnostic knowledge point ${topic.diagnostic} does not exist`);
    if (topic.criteria) {
      if (topic.criteria.length === 0) error(path, "a judged topic needs at least one criterion");
      const own = new Set<string>();
      for (const c of topic.criteria) {
        const cPath = `${path} › criterion ${c.id}`;
        if (!idPattern.test(c.id)) error(cPath, "id must be kebab case");
        if (own.has(c.id)) error(cPath, "duplicate criterion");
        own.add(c.id);
        if (!/^[a-z0-9.-]{1,16}$/.test(c.version)) error(cPath, "version must be a short token");
        if (!c.question.trim().endsWith("?")) error(cPath, "the question must be a yes-or-no question");
        const before = criteria.get(c.id);
        if (before && (before.version !== c.version || before.question !== c.question || before.quoteWhenMet !== c.quoteWhenMet))
          error(cPath, "a criterion shared by topics must be the same in each; change its id or version");
        criteria.set(c.id, c);
      }
    }
  }

  // Prerequisite edges.
  for (const topic of def.topics) {
    const path = `topic ${topic.id}`;
    const seen = new Set<string>();
    for (const p of topic.prerequisites) {
      if (p === topic.id) error(path, "a topic cannot be its own prerequisite");
      else if (!topics.has(p)) error(path, `prerequisite ${p} does not exist`);
      if (seen.has(p)) error(path, `duplicate prerequisite ${p}`);
      seen.add(p);
      if (!topic.criteria && topics.get(p)?.criteria)
        error(path, `prerequisite ${p} is judged by a model, so a topic that is not cannot depend on it`);
    }
  }

  const order = topologicalOrder(def.topics, topics, (t) => t.prerequisites);
  if (!order.ok) {
    error(`subject ${def.id}`, `prerequisite cycle: ${order.cycle.join(" → ")}`);
    throw new CompileError(issues);
  }

  const ancestors = new Map<string, Set<string>>();
  for (const id of order.order) {
    const set = new Set<string>();
    for (const p of topics.get(id)!.prerequisites) {
      set.add(p);
      for (const a of ancestors.get(p) ?? []) set.add(a);
    }
    ancestors.set(id, set);
  }

  // Encompassing edges and key prerequisites.
  for (const topic of def.topics) {
    const path = `topic ${topic.id}`;
    const anc = ancestors.get(topic.id) ?? new Set<string>();
    const seen = new Set<string>();
    for (const e of topic.encompasses) {
      if (e.topic === topic.id) error(path, "a topic cannot encompass itself");
      else if (!topics.has(e.topic)) error(path, `encompassed topic ${e.topic} does not exist`);
      else if (!e.nonAncestor && !anc.has(e.topic))
        error(path, `encompassed topic ${e.topic} is not an ancestor; mark it nonAncestor if intended`);
      if (!(Number.isFinite(e.weight) && e.weight > 0 && e.weight <= 1))
        error(path, `encompassing weight of ${e.topic} must be in (0, 1], got ${e.weight}`);
      if (seen.has(e.topic)) error(path, `duplicate encompassing of ${e.topic}`);
      seen.add(e.topic);
      if (!topic.criteria && topics.get(e.topic)?.criteria)
        error(path, `encompassed topic ${e.topic} is judged by a model, so a topic that is not cannot encompass it`);
    }
    for (const kp of topic.knowledgePoints) {
      for (const k of kp.keyPrerequisites ?? []) {
        if (!topics.has(k)) error(`${path} › kp ${kp.id}`, `key prerequisite ${k} does not exist`);
        else if (!anc.has(k)) error(`${path} › kp ${kp.id}`, `key prerequisite ${k} is not an ancestor of the topic`);
      }
    }
    // A direct prerequisite already implied by another one adds nothing to the frontier.
    for (const p of topic.prerequisites) {
      if (topic.prerequisites.some((q) => q !== p && ancestors.get(q)?.has(p)))
        warn(path, `prerequisite ${p} is implied by another prerequisite`);
    }
  }
  const encompassingOrder = topologicalOrder(def.topics, topics, (t) => t.encompasses.map((e) => e.topic));
  if (!encompassingOrder.ok) error(`subject ${def.id}`, `encompassing cycle: ${encompassingOrder.cycle.join(" → ")}`);

  // The lexicon and the passages.
  const lexicon = lexiconIndex(def.lexicon ?? []);
  const spellings = new Set<string>();
  for (const entry of def.lexicon ?? []) {
    const path = `lexicon ${entry.word}`;
    if (entry.topic !== undefined && !topics.has(entry.topic)) error(path, `topic ${entry.topic} does not exist`);
    for (const form of [entry.word, ...(entry.forms ?? [])]) {
      const spelling = form.toLowerCase();
      if (spellings.has(spelling)) error(path, `the spelling ${spelling} appears twice in the lexicon`);
      spellings.add(spelling);
    }
  }
  const units = new Set<string>();
  const graphPassages = new Map<string, GraphPassage>();
  for (const unit of def.reading ?? []) {
    const unitPath = `reading unit ${unit.id}`;
    if (!idPattern.test(unit.id)) error(unitPath, "id must be kebab case");
    if (units.has(unit.id)) error(unitPath, "duplicate reading unit id");
    units.add(unit.id);
    text(`${unitPath} › title`, unit.title);
    if (unit.passages.length === 0) error(unitPath, "a reading unit needs at least one passage");
    unit.passages.forEach((passage, position) => {
      const path = `passage ${passage.id}`;
      if (!idPattern.test(passage.id)) error(path, "id must be kebab case");
      if (topics.has(passage.id) || graphPassages.has(passage.id)) error(path, "the id is already used by a topic or a passage");
      text(`${path} › title`, passage.title);
      if (!(Number.isFinite(passage.xp) && passage.xp > 0)) error(path, `xp must be positive, got ${passage.xp}`);
      const words = bodyWords(passage.body);
      if (words.length === 0) error(path, "a passage needs a body");
      const outside = new Set([...(passage.names ?? []), ...(passage.glossed ?? [])].map((w) => w.toLowerCase()));
      const wordsByTopic: Record<string, number> = {};
      const unlisted = new Set<string>();
      for (const word of words) {
        if (outside.has(word)) continue;
        const entry = lexicon.get(word);
        if (!entry) unlisted.add(word);
        else if (entry.topic !== undefined) wordsByTopic[entry.topic] = (wordsByTopic[entry.topic] ?? 0) + 1;
      }
      if (unlisted.size > 0) error(path, `words outside the lexicon: ${[...unlisted].join(", ")}`);
      for (const e of passage.topics) {
        if (!topics.has(e.topic)) error(path, `topic ${e.topic} does not exist`);
        if (!(Number.isFinite(e.weight) && e.weight > 0 && e.weight <= 1))
          error(path, `weight of ${e.topic} must be in (0, 1], got ${e.weight}`);
      }
      if (passage.questions.length === 0) error(path, "a passage needs at least one question");
      passage.questions.forEach((q, i) => {
        const qPath = `${path} › question ${i + 1}`;
        text(`${qPath} › prompt`, q.prompt);
        text(`${qPath} › right`, q.right);
        text(`${qPath} › solution`, q.solution);
        if (q.wrong.length === 0) error(qPath, "a question needs at least one wrong option");
        for (const wrong of q.wrong) text(`${qPath} › wrong`, wrong);
      });
      const previous = unit.passages[position - 1]?.id;
      graphPassages.set(passage.id, {
        id: passage.id,
        unit: unit.id,
        ...(previous !== undefined && { previous }),
        topics: passage.topics.map((e) => ({ topic: e.topic, weight: e.weight })),
        words: words.length,
        wordsByTopic,
        xp: passage.xp,
        questions: passage.questions.length,
      });
    });
  }

  // Courses.
  const courses = new Map<string, CompiledCourse>();
  for (const course of def.courses) {
    const path = `course ${course.id}`;
    if (!idPattern.test(course.id)) error(path, "id must be kebab case");
    if (courses.has(course.id)) error(path, "duplicate course id");
    text(`${path} › title`, course.title);
    text(`${path} › description`, course.description);
    const list: string[] = [];
    const position = new Map<string, number>();
    course.units.forEach((unit, u) => {
      text(`${path} › unit ${u + 1} › title`, unit.title);
      if (unit.modules.length === 0) error(`${path} › unit ${u + 1}`, "a unit needs at least one module");
      unit.modules.forEach((mod, m) => {
        text(`${path} › unit ${u + 1} › module ${m + 1} › title`, mod.title);
        if (mod.topics.length === 0) error(`${path} › unit ${u + 1} › module ${m + 1}`, "a module needs at least one topic");
        for (const id of mod.topics) {
          if (!topics.has(id)) error(path, `topic ${id} does not exist`);
          else if (position.has(id)) error(path, `topic ${id} appears twice`);
          else {
            position.set(id, list.length);
            list.push(id);
          }
        }
      });
    });
    for (const unit of course.reading ?? []) if (!units.has(unit)) error(path, `reading unit ${unit} does not exist`);
    const floor = new Set(course.masteryFloor ?? []);
    for (const f of floor) {
      if (!topics.has(f)) error(path, `mastery floor topic ${f} does not exist`);
      if (position.has(f)) error(path, `mastery floor topic ${f} is in the course`);
    }
    for (const id of list) {
      for (const p of topics.get(id)?.prerequisites ?? []) {
        const pp = position.get(p);
        if (pp !== undefined && pp > position.get(id)!) error(path, `topic ${id} comes before its prerequisite ${p}`);
      }
    }
    const foundations = new Set<string>();
    for (const id of list) {
      for (const a of ancestors.get(id) ?? []) {
        if (!position.has(a) && !floor.has(a) && ![...floor].some((f) => ancestors.get(f)?.has(a))) foundations.add(a);
      }
    }
    for (const before of course.buildsOn ?? []) {
      if (before === course.id) error(path, "a course cannot build on itself");
      else if (!def.courses.some((c) => c.id === before)) error(path, `builds on unknown course ${before}`);
    }
    courses.set(course.id, {
      def: course,
      topics: list,
      masteryFloor: floor,
      foundations: order.order.filter((id) => foundations.has(id)),
    });
  }

  const cycle = courseCycle(def.courses);
  if (cycle) error(`subject ${def.id}`, `courses build on each other: ${cycle.join(" → ")}`);

  if (issues.some((i) => i.severity === "error")) throw new CompileError(issues);

  const dependents = new Map<string, string[]>(order.order.map((id) => [id, []]));
  const encompassedBy = new Map<string, WeightedEdge[]>(order.order.map((id) => [id, []]));
  const graphTopics = new Map<string, GraphTopic>();
  for (const id of order.order) {
    const topic = topics.get(id)!;
    for (const p of topic.prerequisites) dependents.get(p)!.push(id);
    for (const e of topic.encompasses) encompassedBy.get(e.topic)!.push({ topic: id, weight: e.weight });
    graphTopics.set(id, {
      id,
      prerequisites: topic.prerequisites,
      encompasses: topic.encompasses.map((e) => ({ topic: e.topic, weight: e.weight })),
      xp: topic.xp,
      knowledgePoints: topic.knowledgePoints.map((kp: KnowledgePointDef) => ({ id: kp.id, keyPrerequisites: kp.keyPrerequisites ?? [] })),
      diagnosticKp:
        topic.diagnostic === undefined
          ? topic.knowledgePoints.length - 1
          : topic.knowledgePoints.findIndex((kp) => kp.id === topic.diagnostic),
    });
  }

  return {
    def,
    graph: { subject: def.id, topics: graphTopics, order: order.order, dependents, encompassedBy, ancestors, passages: graphPassages },
    topics,
    courses,
    checkers: checkers!,
    warnings: issues.filter((i) => i.severity === "warning"),
  };
}

/** courseCycle finds courses that build on each other in a circle, through buildsOn. */
function courseCycle(courses: readonly CourseDef[]): string[] | undefined {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const state = new Map<string, "visiting" | "done">();
  const stack: string[] = [];
  const visit = (id: string): string[] | undefined => {
    if (state.get(id) === "done") return undefined;
    if (state.get(id) === "visiting") return [...stack.slice(stack.indexOf(id)), id];
    state.set(id, "visiting");
    stack.push(id);
    for (const before of byId.get(id)?.buildsOn ?? []) {
      if (before === id || !byId.has(before)) continue;
      const cycle = visit(before);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(id, "done");
    return undefined;
  };
  for (const c of courses) {
    const cycle = visit(c.id);
    if (cycle) return cycle;
  }
  return undefined;
}

type OrderResult = { ok: true; order: string[] } | { ok: false; cycle: string[] };

/** topologicalOrder orders topics after the topics edges points to, keeping definition order where free. */
function topologicalOrder(
  list: readonly TopicDef[],
  topics: ReadonlyMap<string, TopicDef>,
  edges: (t: TopicDef) => readonly string[],
): OrderResult {
  const state = new Map<string, "visiting" | "done">();
  const order: string[] = [];
  const stack: string[] = [];
  const visit = (id: string): string[] | undefined => {
    const s = state.get(id);
    if (s === "done") return undefined;
    if (s === "visiting") return [...stack.slice(stack.indexOf(id)), id];
    state.set(id, "visiting");
    stack.push(id);
    const topic = topics.get(id);
    for (const next of topic ? edges(topic) : []) {
      if (!topics.has(next)) continue;
      const cycle = visit(next);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(id, "done");
    order.push(id);
    return undefined;
  };
  for (const t of list) {
    const cycle = visit(t.id);
    if (cycle) return { ok: false, cycle };
  }
  return { ok: true, order };
}
