import type { Figure } from "./figure.ts";
import type { Rng } from "./rng.ts";
import type { Locale, Text } from "./text.ts";

/** Json is a JSON-serializable value. */
export type Json = null | boolean | number | string | readonly Json[] | { readonly [key: string]: Json };

/** InputSpec tells the client which input to show for a problem. */
export type InputSpec =
  /** A multiple-choice question; the response is the index of the chosen option. When figures is given, each option is shown as the drawing at its index, and its text only names it. */
  | { readonly kind: "choice"; readonly options: readonly Text[]; readonly figures?: readonly Figure[] }
  /** A math field; the response is the LaTeX the learner entered. */
  | { readonly kind: "math"; readonly prefix?: string; readonly suffix?: string }
  /** A plain text field. */
  | { readonly kind: "text" }
  /** A list to put in order; the response is the indexes of the items in the chosen order, such as "2,0,1". */
  | { readonly kind: "order"; readonly items: readonly Text[] }
  /**
   * Points marked on the problem's figure; the response lists them as "(x, y)", joined by "; " when there are several, once
   * all of them are marked.
   */
  | { readonly kind: "plot"; readonly grid: PlotGrid; readonly points: number }
  /** A long text field for writing judged by a model; the response is the learner's text, of at least minWords words and at most maxChars characters. */
  | { readonly kind: "writing"; readonly minWords: number; readonly maxChars: number };

/** PlotGrid says where a figure's coordinates lie and which points of it a learner can mark. */
export interface PlotGrid {
  readonly xMin: number;
  readonly xMax: number;
  readonly yMin: number;
  readonly yMax: number;
  /** step is the distance between the points that can be marked. */
  readonly step: number;
  /** left and top are the position in the figure's viewBox of the corner (xMin, yMax). */
  readonly left: number;
  readonly top: number;
  /** scale is the length in the viewBox of one unit along either axis. */
  readonly scale: number;
}

/** AnswerSpec is how a response to a problem is checked. */
export interface AnswerSpec {
  /** checker is the id of a checker registered by the subject or by the core, such as "choice". */
  readonly checker: string;
  /** expected is the checker's data: the correct answer and any form requirements. */
  readonly expected: Json;
  readonly input: InputSpec;
  /** judged marks a response that a model judges once the checker has accepted its length; the problem's canonical response is then the model answer shown to the judge. */
  readonly judged?: JudgedSpec;
}

/** JudgedSpec is what a model judges a response to a problem against. */
export interface JudgedSpec {
  /** criteria are the ids of the topic's criteria the response is judged on, assessing only what the step taught. */
  readonly criteria: readonly string[];
  /** source is text the task is about, such as the sentences to combine or the passage to answer from, in English. */
  readonly source?: string;
}

/**
 * CriterionSpec is one yes-or-no question a model answers about a learner's
 * text. Its id and version name it in routes and calibrations: changing the
 * question changes the version, and a new version needs its own calibration.
 */
export interface CriterionSpec {
  /** id is unique within its subject, in kebab case. */
  readonly id: string;
  readonly version: string;
  /** question is asked of the text, answerable with yes or no, in English. */
  readonly question: string;
  /** quoteWhenMet asks the judge to quote the words that meet the criterion. */
  readonly quoteWhenMet: boolean;
}

/** Mistake is a wrong response that shows a known misunderstanding, with what to say about it. */
export interface Mistake {
  /** response is the wrong response, written as a learner would. */
  readonly response: string;
  /** feedback says what went wrong, without repeating the solution. */
  readonly feedback: Text;
}

/** Problem is one generated problem instance. */
export interface Problem {
  readonly prompt: Text;
  /** figure is a drawing the prompt refers to. */
  readonly figure?: Figure;
  readonly answer: AnswerSpec;
  /** solution is the worked solution, shown after an answer and in worked examples. */
  readonly solution: Text;
  /** solutionFigure is a drawing that shows the solution, such as the prompt's figure with the answer worked out on it; it stays hidden until the solution is shown. */
  readonly solutionFigure?: Figure;
  /** canonical is a response the checker must accept; it is also the answer shown after a wrong attempt. */
  readonly canonical: string;
  /** wrong are plausible mistaken responses the checker must reject; the compiler checks them. */
  readonly wrong?: readonly string[];
  /** mistakes are wrong responses that get feedback of their own; the compiler checks that they are rejected. */
  readonly mistakes?: readonly Mistake[];
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
  /** figure is a drawing shown after the explanation. */
  readonly figure?: Figure;
  /** figures are drawings placed inside the explanation, each by a line `{{figure N}}` in every locale, so that words and drawings can alternate. */
  readonly figures?: readonly Figure[];
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
  /** practiceOnly starts the lesson with practice, for topics that teach nothing new; a learner who failed it gets the explanations and worked examples. */
  readonly practiceOnly?: boolean;
  /** diagnostic is the id of the knowledge point the diagnostic asks; the last one by default. */
  readonly diagnostic?: string;
  /** standards are codes of the standards the topic covers, such as "CCSS.7.NS.A.1". */
  readonly standards?: readonly string[];
  /**
   * criteria make the topic judged by a model: its judged problems are judged
   * against them. A learner for whom some criterion has no qualifying route does
   * not get the topic, so no topic without criteria may depend on one with them.
   */
  readonly criteria?: readonly CriterionSpec[];
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
  /** group names the shelf a list of courses shows this course on; courses of a group are listed together. */
  readonly group?: Text;
  /** explanationLocale is the locale of the course's lessons and problems whatever the interface's, for a course that teaches in that language. */
  readonly explanationLocale?: Locale;
  readonly units: readonly UnitDef[];
  /** masteryFloor are topics outside the course assumed known by every learner. */
  readonly masteryFloor?: readonly string[];
  /** reading lists the reading units the course offers, in order. */
  readonly reading?: readonly string[];
  /**
   * buildsOn lists the courses of the subject this course follows on from,
   * nearest first: what a learner takes before it. A learner placed with many
   * gaps is pointed to one of them, and one who finishes a course to the
   * courses that build on it.
   */
  readonly buildsOn?: readonly string[];
}

/** PassageQuestionDef is one comprehension question of a passage. */
export interface PassageQuestionDef {
  readonly prompt: Text;
  /** right is the correct option; it is shuffled among the wrong ones by seed. */
  readonly right: Text;
  /** wrong are plausible wrong options, each a misreading of the passage. */
  readonly wrong: readonly Text[];
  /** solution says where the passage gives the answer. */
  readonly solution: Text;
}

/** PassageDef is a graded text to read, with a short comprehension check. */
export interface PassageDef {
  /** id is unique among the subject's topics and passages, in kebab case, and never changes once published. */
  readonly id: string;
  readonly title: Text;
  /** body is the text in the language being read, so it has no translation; paragraphs are separated by blank lines. */
  readonly body: string;
  /** topics are the topics a reader must know, credited in part by reading; weight in (0, 1] is how much the passage practices each. */
  readonly topics: readonly { readonly topic: string; readonly weight: number }[];
  /** names are the proper names of the body, which are outside the lexicon. */
  readonly names?: readonly string[];
  /** glossed are the domain terms the passage itself explains, which are outside the lexicon. */
  readonly glossed?: readonly string[];
  /** xp is the expected minutes of reading and answering for a serious learner. */
  readonly xp: number;
  readonly questions: readonly PassageQuestionDef[];
}

/** ReadingUnitDef is a sequence of passages on one domain: each is offered after the one before it, which makes it easier to read. */
export interface ReadingUnitDef {
  readonly id: string;
  readonly title: Text;
  readonly passages: readonly PassageDef[];
}

/** LexiconEntry is a word of the language a subject teaches. */
export interface LexiconEntry {
  readonly word: string;
  /** forms are its other spellings, such as inflections. */
  readonly forms?: readonly string[];
  /** topic teaches the word; without one, a reader of the subject's passages is assumed to know it. */
  readonly topic?: string;
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
  /** same tells whether a response means the same as a listed mistake; without it they must be equal apart from spacing. */
  same?(expected: Json, response: string, mistake: string): boolean;
  /** maxLength is the longest response the checker reads; longer ones are rejected unread. 2,000 characters by default. */
  readonly maxLength?: number;
}

/** SubjectDef is everything a subject contributes. */
export interface SubjectDef {
  /** id is the subject's id, such as "math". */
  readonly id: string;
  readonly title: Text;
  /** mark is the one or two characters that stand for the subject on its chip, such as "∑". */
  readonly mark: string;
  /** hue is the subject's hue, 0 to 360, from which clients derive its colors. */
  readonly hue: number;
  readonly topics: readonly TopicDef[];
  readonly courses: readonly CourseDef[];
  readonly checkers: readonly Checker[];
  /** reading are the subject's reading units. */
  readonly reading?: readonly ReadingUnitDef[];
  /** lexicon lists the words its passages may use; a subject with passages needs one. */
  readonly lexicon?: readonly LexiconEntry[];
}
