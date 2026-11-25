import type { Figure } from "./figure.ts";
import type { Rng } from "./rng.ts";
import type { SpeechMode } from "./speech.ts";
import type { Locale, Text } from "./text.ts";

/** Json is a JSON-serializable value. */
export type Json = null | boolean | number | string | readonly Json[] | { readonly [key: string]: Json };

/** InputSpec tells the client which input to show for a problem. */
export type InputSpec =
  /** A multiple-choice question; the response is the index of the chosen option. When figures is given, each option is shown as the drawing at its index, and its text only names it. */
  | { readonly kind: "choice"; readonly options: readonly Text[]; readonly figures?: readonly Figure[] }
  /** A math field; the response is the LaTeX the learner entered. */
  | { readonly kind: "math"; readonly prefix?: string; readonly suffix?: string }
  /** A plain text field; hint, when given, says how to type the answer, such as tones in pinyin, and shows under it. */
  | { readonly kind: "text"; readonly hint?: Text }
  /** A list to put in order; the response is the indexes of the items in the chosen order, such as "2,0,1". */
  | { readonly kind: "order"; readonly items: readonly Text[] }
  /**
   * Points marked on the problem's figure; the response lists them as "(x, y)", joined by "; " when there are several, once
   * all of them are marked.
   */
  | { readonly kind: "plot"; readonly grid: PlotGrid; readonly points: number }
  /** A long text field for writing judged by a model; the response is the learner's text, of at least minWords words and at most maxChars characters. */
  | { readonly kind: "writing"; readonly minWords: number; readonly maxChars: number }
  /**
   * A character written by hand on a square pad, stroke by stroke; the response is the strokes drawn (parseStrokes),
   * sent once the learner has drawn as many as the character has. trace is a character shown faintly under the pad to
   * write over; without it the learner writes from memory.
   */
  | { readonly kind: "strokes"; readonly strokes: number; readonly trace?: string }
  /**
   * A recording of the learner speaking, at most maxSeconds long; the server sends it to a speech service of the
   * language and checks what was heard (Heard). text is what to repeat or read aloud, shown above the recorder; a
   * "say" problem shows none.
   */
  | {
      readonly kind: "speech";
      readonly language: string;
      readonly mode: SpeechMode;
      readonly text?: string;
      readonly maxSeconds: number;
    };

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
  /**
   * picture is an illustration the prompt refers to, such as the four pictures of a story to write, by its path from the
   * site's root without an extension, such as "illustrations/<subject>/<name>": the file is <picture>.webp, 3:2. The
   * prompt still says in words what the picture shows, so that the problem can be answered, and judged, without it.
   */
  readonly picture?: string;
  /**
   * listen are the recordings played to answer, such as a dialogue a question asks about, by path as in Sound: the
   * learner hears them but does not see what they say, which the solution may show.
   */
  readonly listen?: readonly string[];
  readonly answer: AnswerSpec;
  /** solution is the worked solution, shown after an answer and in worked examples. */
  readonly solution: Text;
  /** solutionFigure is a drawing that shows the solution, such as the prompt's figure with the answer worked out on it; it stays hidden until the solution is shown. */
  readonly solutionFigure?: Figure;
  /** solutionFigures are drawings placed inside the solution, each by a line `{{figure N}}` in every locale, so that a walkthrough shows each step drawn. */
  readonly solutionFigures?: readonly Figure[];
  /** solutionSounds are recordings that stay hidden, like the solution, until it is shown: never ones that would give the answer away before. */
  readonly solutionSounds?: readonly Sound[];
  /** canonical is a response the checker must accept; it is also the answer shown after a wrong attempt. */
  readonly canonical: string;
  /** wrong are plausible mistaken responses the checker must reject; the compiler checks them. */
  readonly wrong?: readonly string[];
  /** mistakes are wrong responses that get feedback of their own; the compiler checks that they are rejected. */
  readonly mistakes?: readonly Mistake[];
  /** difficulty is the tier a tiered knowledge point's problem was made at; the source sets it, not the generator. */
  readonly difficulty?: Difficulty;
  /**
   * parts make a multistep problem: one scenario, the prompt with its figure, asked in steps, each its own question and
   * answer. The problem's own answer, solution and responses are those of its last part, so that it stands as one
   * problem where parts are not asked; multistep builds it. Each part is asked as partOf makes it.
   */
  readonly parts?: readonly ProblemPart[];
  /**
   * part is the position of a part made by partOf among its problem's parts, with the topic it practices when another,
   * the problem's scenario and the part's own question, which the prompt joins with the parts before it.
   */
  readonly part?: {
    readonly index: number;
    readonly count: number;
    readonly topic?: string;
    readonly scenario?: Text;
    readonly ask?: Text;
  };
}

/** ProblemPart is one step of a multistep problem: a question about the problem's scenario and its answer. */
export interface ProblemPart {
  readonly prompt: Text;
  readonly answer: AnswerSpec;
  readonly solution: Text;
  readonly canonical: string;
  readonly wrong?: readonly string[];
  readonly mistakes?: readonly Mistake[];
  /** topic is the topic the part practices, when it is another than the problem's; the result names it. */
  readonly topic?: string;
}

/** Sound is a recording: a word, a sentence or the sounds of a word, read aloud. */
export interface Sound {
  /** text is what the recording says, in the language practiced, shown on its button. */
  readonly text: string;
  /** audio is the recording's path from the site's root without an extension, such as "audio/english/<name>": the file is <audio>.mp3. */
  readonly audio: string;
}

/**
 * Difficulty is a tier of a knowledge point's problems: easy ones practice the
 * step on its plainest cases, hard ones on the cases that take the most care.
 */
export type Difficulty = "easy" | "medium" | "hard";

/** DIFFICULTIES lists the tiers from easiest to hardest. */
export const DIFFICULTIES: readonly Difficulty[] = ["easy", "medium", "hard"];

/**
 * Generator produces a problem from a seeded Rng; it must be deterministic. A
 * tiered knowledge point's generator also honors the difficulty it is given;
 * without one it produces the mix it would produce anyway.
 */
export type Generator = (rng: Rng, difficulty?: Difficulty) => Problem;

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
  /** tiered says that generate honors the difficulty it is given (Difficulty). */
  readonly tiered?: boolean;
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
  /**
   * intro introduces the topic before its first knowledge point, as a tutorial would: what the idea is for, how it
   * grows from the prerequisites, and the words it needs, with drawings placed by lines `{{figure N}}`.
   */
  readonly intro?: Text;
  /** introFigures are the drawings the intro places. */
  readonly introFigures?: readonly Figure[];
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
  /**
   * essay makes a judged topic an essay: its lesson asks one text, which ends the session when it is submitted and
   * passes or fails the lesson once a model has judged it. An essay is never reviewed explicitly, quizzed or asked by
   * the diagnostic; it gives implicit credit to the topics it encompasses. It needs criteria and one knowledge point.
   */
  readonly essay?: boolean;
  /** strand is the id of the subject's strand the topic belongs to, such as "grammar"; required when the subject declares strands. */
  readonly strand?: string;
  /**
   * spoken makes a topic answered aloud, in the language given, such as "en-US": its problems take a recording. A
   * learner for whom no speech service qualifies, or who turned speaking off, does not get the topic, so no topic that
   * is not spoken may depend on one that is. A spoken topic is never quizzed or asked by the diagnostic.
   */
  readonly spoken?: string;
  /**
   * verbatim makes a spoken topic need what was said heard with its errors kept, so that a wrong answer stays wrong,
   * as answering a question aloud does: a service that hears "She go" as "She goes" would pass a wrong answer. It is
   * offered only through a speech route that also passed the test of keeping errors (criterion
   * `stt-verbatim:<language>`).
   */
  readonly verbatim?: boolean;
}

/** StrandDef is a strand of a subject: a kind of topic a course balances against the others, such as reading or writing. */
export interface StrandDef {
  /** id is unique within its subject, in kebab case. */
  readonly id: string;
  readonly title: Text;
}

/** ModuleDef groups topics of a unit. */
export interface ModuleDef {
  readonly title: Text;
  readonly topics: readonly string[];
}

/** UnitDef groups modules of a course. */
export interface UnitDef {
  /** title names the unit; in a course built on themes, its theme. */
  readonly title: Text;
  readonly modules: readonly ModuleDef[];
  /** reading lists the course's reading units that belong to this unit's theme. */
  readonly reading?: readonly string[];
  /** conversation is the course's conversation that closes this unit. */
  readonly conversation?: string;
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
  /** conversations lists the spoken conversations the course offers, in order. */
  readonly conversations?: readonly string[];
  /**
   * buildsOn lists the courses of the subject this course follows on from,
   * nearest first: what a learner takes before it. A learner placed with many
   * gaps is pointed to one of them, and one who finishes a course to the
   * courses that build on it.
   */
  readonly buildsOn?: readonly string[];
  /** retired marks a course no longer offered to new learners: its learners keep it, and others cannot choose it. */
  readonly retired?: boolean;
}

/** PassageQuestionDef is one comprehension question of a passage. */
export interface PassageQuestionDef {
  readonly prompt: Text;
  /** right is the correct option; it is shuffled among the wrong ones by seed. */
  readonly right: Text;
  /** wrong are plausible wrong options, each a misreading of the passage. */
  readonly wrong: readonly Text[];
  /** why, when given, says for each wrong option in order what the passage says instead, shown when it is chosen. */
  readonly why?: readonly Text[];
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
  /** audio names the recording of the body read aloud in the subject's audio, a file `<audio>.mp3`. */
  readonly audio?: string;
  /** accent names the accent the recording is read in when it is not the subject's usual one, shown beside its player. */
  readonly accent?: Text;
}

/** ReadingUnitDef is a sequence of passages on one domain: each is offered after the one before it, which makes it easier to read. */
export interface ReadingUnitDef {
  readonly id: string;
  readonly title: Text;
  readonly passages: readonly PassageDef[];
  /** illustration names the unit's cover in the subject's illustrations, shown above each of its passages. */
  readonly illustration?: string;
}

/**
 * ConversationDef is a spoken conversation with the AI tutor (S6): a short
 * scenario the tutor plays a part in, with a task for the learner. The tutor
 * is never a companion: it plays a role in the scenario and stays in it.
 */
export interface ConversationDef {
  /** id is unique among the subject's conversations, in kebab case, and never changes once published: routes and sessions name it. */
  readonly id: string;
  readonly title: Text;
  /** task tells the learner what to do in the conversation. */
  readonly task: Text;
  /** scenario tells the tutor, in English, the part it plays and what the learner must do; the learner never sees it. */
  readonly scenario: string;
  /** opening is the tutor's first line, in the language practiced, spoken before any model is called. */
  readonly opening: string;
  /** openingAudio names the recording of the opening in the subject's audio, a file `<openingAudio>.wav` of 16 kHz 16-bit mono PCM, which the voice service plays instead of speaking the line. */
  readonly openingAudio?: string;
  /**
   * spoken is the language the conversation is spoken in, as a language tag such as en-US: the language its speech is
   * heard and spoken in. Without it the voice service has nothing to hear the learner with.
   */
  readonly spoken?: string;
  /** minutes is how long the conversation should last; after it the tutor brings it to an end. */
  readonly minutes: number;
  /** illustration names the conversation's scene in the subject's illustrations. */
  readonly illustration?: string;
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
  /**
   * words splits a passage body into its running words, each to be found in the lexicon or among `known`, the passage's
   * names and glossed terms; a language written without spaces needs its own. Without it, words are runs of letters
   * (bodyWords).
   */
  readonly words?: (body: string, known: readonly string[]) => readonly string[];
  /** conversations are the subject's spoken conversations. */
  readonly conversations?: readonly ConversationDef[];
  /** strands are the kinds of topic the subject has; when given, every topic names one. */
  readonly strands?: readonly StrandDef[];
  /**
   * sequences are the routes through the subject's courses, such as the
   * traditional and the integrated high-school sequence; a learner follows the
   * one their courses lie on, and moves on along it on finishing a course.
   */
  readonly sequences?: readonly SequenceDef[];
}

/**
 * SequenceDef is a route through a subject's courses, in the order they are
 * taken; each course builds on the one before it.
 */
export interface SequenceDef {
  /** id is unique among the subject's sequences, in kebab case. */
  readonly id: string;
  readonly title: Text;
  readonly courses: readonly string[];
  /**
   * fast marks a sequence that covers the courses in less time than another through them, such as an honors
   * sequence: a learner keeps to it only while learning quickly and passing nearly every lesson.
   */
  readonly fast?: boolean;
  /**
   * fallback is the id of the sequence a learner of this fast one moves to on falling short of its pace, the one
   * closest to it; it takes the place of this sequence in choosing the route. A fallback may be fast and have a
   * fallback of its own, such as the integrated sequence below the integrated honors one.
   */
  readonly fallback?: string;
}
