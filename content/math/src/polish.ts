import type { Problem, Text, TopicDef } from "@ga/content";

/** singularOf maps the plural nouns generators put after a count to their singular. */
const singularOf: Readonly<Record<string, string>> = {
  ...Object.fromEntries(
    "part unit group apple item side hundred ten one thousand face edge row column marble cup piece student day hour year minute second week month cent dollar mile meter kilometer centimeter millimeter liter gram kilogram pound ounce gallon quart pint ton yard book bag bottle stamp visit game ticket player tray step whole tenth hundredth dot pet tile zero block member goal place outcome radian period role trial attempt element inversion pivot pair monomial variable way input output ordering symbol operation cycle letter transposition choice point head failure degree component sibling run"
      .split(" ")
      .map((word) => [`${word}s`, word]),
  ),
  boxes: "box",
  copies: "copy",
  successes: "success",
  feet: "foot",
  inches: "inch",
  people: "person",
  vertices: "vertex",
};

const nouns = Object.keys(singularOf).join("|");

/** countOfOne matches a plural noun after a count of one: "$1$ parts", "5 - 4 = 1$ inches" or "1 hours". */
const countOfOne = new RegExp(`(\\$1\\$|= 1\\$|(?<![^\\s(])1)(\\s+)(${nouns})\\b`, "g");

/** thereAreOne matches the verb left plural before a count of one. */
const thereAreOne = /\b([Tt]here) are (\$1\$|1) (?=[a-z])/g;

/** mathSpan matches an escaped dollar sign or a span of display or inline math. */
const mathSpan = /\\\$|\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\\])*\$/g;

/** verbatimTex matches TeX whose characters are names, not products: "\mathrm{1E0}" or "x_{1i}". */
const verbatimTex = /(\\(?:text|mathrm|operatorname|mathbf|mathbb|mathcal)\{[^{}]*\}|_\{[^{}]*\})/;

/** unitCoefficient matches a coefficient of 1 before a variable or a function: "1x", "-1a_{n}", "1\sin x". */
const unitCoefficient = /(^|[\s(=+\-,{[|])1(?=[a-zA-Z](?![a-zA-Z0-9{])|\\(?:sin|cos|tan|cot|sec|csc|ln|log|sqrt|pi|theta)\b)/g;

/** simplifyMath drops the coefficients of 1 of a math expression, and a value that a chain of equalities repeats. */
function simplifyMath(tex: string): string {
  const dropped = tex
    .split(verbatimTex)
    .map((part, i) => (i % 2 ? part : part.replace(unitCoefficient, "$1")))
    .join("");
  const chain = dropped.split(" = ");
  return chain.length < 3 ? dropped : chain.filter((value, i) => i === 0 || value.trim() !== chain[i - 1]?.trim()).join(" = ");
}

/** polishSpans applies simplifyMath to every span of math of a text. */
function polishSpans(text: string): string {
  return text.replace(mathSpan, (span) => {
    if (span === "\\$") return span;
    const delimiter = span.startsWith("$$") ? "$$" : "$";
    return delimiter + simplifyMath(span.slice(delimiter.length, -delimiter.length)) + delimiter;
  });
}

/** polishEnglish makes the words around a generated number agree with it: "$1$ part", "an 8". */
function polishEnglish(text: string): string {
  return text
    .replace(thereAreOne, "$1 is $2 ")
    .replace(countOfOne, (_, count: string, space: string, noun: string) => count + space + singularOf[noun])
    .replace(/\b([Aa]) (?=\$?(?:8|11\b|18\b))/g, "$1n ");
}

/**
 * polishText tidies what number generators leave behind when a random value is
 * 1: templates are written for the general case, so the same fix would
 * otherwise be needed at every "${n}x" and "${n} hours" of the content.
 */
export function polishText(text: Text): Text {
  return { en: polishEnglish(polishSpans(text.en)), "zh-CN": polishSpans(text["zh-CN"]) };
}

/** polishProblem applies polishText to what a learner reads of a problem; the answer is left to the checker. */
export function polishProblem(problem: Problem): Problem {
  const { input } = problem.answer;
  return {
    ...problem,
    prompt: polishText(problem.prompt),
    solution: polishText(problem.solution),
    answer: input.kind === "choice" ? { ...problem.answer, input: { ...input, options: input.options.map(polishText) } } : problem.answer,
  };
}

/** polishTopic makes the generators of a topic polish the problems they produce. */
export function polishTopic(topic: TopicDef): TopicDef {
  return {
    ...topic,
    knowledgePoints: topic.knowledgePoints.map((kp) => ({ ...kp, generate: (rng) => polishProblem(kp.generate(rng)) })),
  };
}
