import type { Figure } from "./figure.ts";
import type { Rng } from "./rng.ts";
import type { Text } from "./text.ts";

/** Json is a JSON-serializable value. */
export type Json = null | boolean | number | string | readonly Json[] | { readonly [key: string]: Json };

/** InputSpec tells the client which input to show for a problem. */
export type InputSpec =
  /** A multiple-choice question; the response is the index of the chosen option. */
  | { readonly kind: "choice"; readonly options: readonly Text[] }
  /** A math field; the response is the LaTeX the learner entered. */
  | { readonly kind: "math"; readonly prefix?: string; readonly suffix?: string }
  /** A plain text field. */
  | { readonly kind: "text" };

/** AnswerSpec is how a response to a problem is checked. */
export interface AnswerSpec {
  /** checker is the id of a checker registered by the subject or by the core, such as "choice". */
  readonly checker: string;
  /** expected is the checker's data: the correct answer and any form requirements. */
  readonly expected: Json;
  readonly input: InputSpec;
}

/** Problem is one generated problem instance. */
export interface Problem {
  readonly prompt: Text;
  /** figure is a drawing the prompt refers to. */
  readonly figure?: Figure;
  readonly answer: AnswerSpec;
  /** solution is the worked solution, shown after an answer and in worked examples. */
  readonly solution: Text;
  /** canonical is a response the checker must accept; it is also the answer shown after a wrong attempt. */
  readonly canonical: string;
  /** wrong are plausible mistaken responses the checker must reject; the compiler checks them. */
  readonly wrong?: readonly string[];
}

/** Generator produces a problem from a seeded Rng; it must be deterministic. */
export type Generator = (rng: Rng) => Problem;

/** KnowledgePointDef is one step of a topic: an explanation, a worked example and practice. */
export interface KnowledgePointDef {
  /** id is unique within its topic. */
  readonly id: string;
  readonly title: Text;
  /** explanation introduces the idea before the worked example. */
  readonly explanation: Text;
  /** figure is a drawing shown with the explanation. */
  readonly figure?: Figure;
  /** keyPrerequisites are the earlier topics this step depends on most directly; they drive remediation. */
  readonly keyPrerequisites?: readonly string[];
  /** generate produces the worked example and the practice problems of this step. */
  readonly generate: Generator;
}

/** EncompassingDef says a topic practices a fraction of a simpler topic. */
export interface EncompassingDef {
  readonly topic: string;
  /** weight in (0, 1] is the fraction of the simpler topic practiced implicitly. */
  readonly weight: number;
  /** nonAncestor marks an equivalent topic that is not a prerequisite ancestor. */
  readonly nonAncestor?: boolean;
}

/** TopicDef is one teachable idea: a lesson and the node of the knowledge graph. */
export interface TopicDef {
  /** id is unique within its subject, in kebab case, and never changes once published. */
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  /** prerequisites are the topics that must be learned first. */
  readonly prerequisites: readonly string[];
  /** encompasses are the simpler topics this topic practices implicitly. */
  readonly encompasses: readonly EncompassingDef[];
  /** xp is the expected minutes of the lesson for a serious learner. */
  readonly xp: number;
  readonly knowledgePoints: readonly KnowledgePointDef[];
  /** diagnostic is the id of the knowledge point the diagnostic asks; the last one by default. */
  readonly diagnostic?: string;
  /** standards are codes of the standards the topic covers, such as "CCSS.7.NS.A.1". */
  readonly standards?: readonly string[];
}

/** ModuleDef groups topics of a unit. */
export interface ModuleDef {
  readonly title: Text;
  readonly topics: readonly string[];
}

/** UnitDef groups modules of a course. */
export interface UnitDef {
  readonly title: Text;
  readonly modules: readonly ModuleDef[];
}

/** CourseDef is an ordered selection of topics: a view of the knowledge graph. */
export interface CourseDef {
  /** id is unique within its subject. */
  readonly id: string;
  readonly title: Text;
  readonly description: Text;
  readonly units: readonly UnitDef[];
  /** masteryFloor are topics outside the course assumed known by every learner. */
  readonly masteryFloor?: readonly string[];
}

/** Verdict is a checker's judgment of a response. */
export interface Verdict {
  readonly correct: boolean;
  /** feedback explains a rejection that is not simply wrong, such as an unsimplified fraction. */
  readonly feedback?: Text;
}

/** Checker judges responses against an AnswerSpec's expected data. */
export interface Checker {
  readonly id: string;
  check(expected: Json, response: string): Verdict;
}

/** SubjectDef is everything a subject contributes. */
export interface SubjectDef {
  /** id is the subject's id, such as "math". */
  readonly id: string;
  readonly title: Text;
  readonly topics: readonly TopicDef[];
  readonly courses: readonly CourseDef[];
  readonly checkers: readonly Checker[];
}
