import type { Generator, Locale, Problem, Text, TopicDef } from "@ga/content";
import { joinText, t } from "@ga/content";

import { choiceProblem } from "./problems.ts";

/** maxOptionLength bounds the prompts that can serve as options; longer ones hold tables or matrices too big for a button. */
const maxOptionLength = 220;

/** draws bounds the attempts to find the other three questions of a problem. */
const draws = 60;

/** twoOptions gives the options and the answer of a two-option question with no figure, if the problem is one. */
function twoOptions(problem: Problem): { readonly options: readonly Text[]; readonly correct: number } | undefined {
  const { answer } = problem;
  if (answer.checker !== "choice" || problem.figure) return undefined;
  const input = answer.input as { readonly kind?: string; readonly options?: readonly Text[] } | undefined;
  if (input?.kind !== "choice" || input.options?.length !== 2) return undefined;
  if (problem.prompt.en.length > maxOptionLength || problem.prompt.en.includes("$$")) return undefined;
  return { options: input.options, correct: answer.expected as number };
}

/** settled writes a question with its answer and solution, leaving out a solution's own repeat of the answer. */
function settled(problem: Problem, answer: Text): Text {
  const rest = (locale: Locale, stops: readonly string[]) => {
    const solution = problem.solution[locale];
    const lead = stops.map((stop) => `${answer[locale]}${stop}`).find((l) => solution.startsWith(l));
    return lead ? solution.slice(lead.length).trimStart() : solution;
  };
  return t(
    `${problem.prompt.en} **${answer.en}.** ${rest("en", [".", ":"])}`,
    `${problem.prompt["zh-CN"]} **${answer["zh-CN"]}。** ${rest("zh-CN", ["。", "："])}`,
  );
}

/**
 * oneOfFour turns a generator of two-option questions into one that asks which of four such questions has a given
 * answer, so that a learner has to judge four cases and cannot guess half of them. A problem it cannot turn, such as one
 * with a figure, or one whose options `accepts` turns down, is returned as it is.
 */
export function oneOfFour(generate: Generator, accepts: (options: readonly Text[]) => boolean = () => true): Generator {
  return (rng) => {
    const first = generate(rng);
    const shape = twoOptions(first);
    if (!shape || !accepts(shape.options)) return first;
    const label = shape.options[shape.correct] as Text;
    const others: Problem[] = [];
    const seen = new Set([first.prompt.en]);
    for (let i = 0; i < draws && others.length < 3; i++) {
      const next = generate(rng);
      const nextShape = twoOptions(next);
      if (!nextShape || seen.has(next.prompt.en)) continue;
      if (nextShape.options[nextShape.correct]?.en === label.en) continue;
      seen.add(next.prompt.en);
      others.push(next);
    }
    if (others.length < 3) return first;
    const options = rng.shuffle([first, ...others].map((p) => p.prompt));
    const explained = others.map((p) => {
      const given = twoOptions(p);
      const answerText = given?.options[given.correct] as Text;
      return settled(p, answerText);
    });
    return choiceProblem({
      prompt: t(
        `Exactly one of these questions has the answer "${label.en}". Which one?`,
        `下列问题中恰有一个的答案是“${label["zh-CN"]}”。是哪一个？`,
      ),
      options,
      correct: options.indexOf(first.prompt),
      solution: joinText([settled(first, label), t("The others go the other way:", "其余问题的答案相反："), ...explained]),
    });
  };
}

/** oneOfFourTopic applies oneOfFour to every knowledge point of a topic. */
export function oneOfFourTopic(topic: TopicDef): TopicDef {
  return { ...topic, knowledgePoints: topic.knowledgePoints.map((kp) => ({ ...kp, generate: oneOfFour((rng) => kp.generate(rng)) })) };
}

/** isVerdict tells whether two options are words that mean the same in any question, such as yes and no. */
const isVerdict = (options: readonly Text[]) => {
  const words = options
    .map((o) => o.en)
    .sort()
    .join("/");
  return words === "No/Yes" || words === "False/True";
};

/**
 * oneOfFourVerdicts applies oneOfFour to the questions of a topic that ask for a verdict, such as yes or no. A question
 * whose two options name its own things, such as two stores, is left as it is, because those words mean nothing in
 * another question.
 */
export function oneOfFourVerdicts(topic: TopicDef): TopicDef {
  return {
    ...topic,
    knowledgePoints: topic.knowledgePoints.map((kp) => ({ ...kp, generate: oneOfFour((rng) => kp.generate(rng), isVerdict) })),
  };
}
