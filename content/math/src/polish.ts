import type { Problem, Text, TopicDef } from "@ga/content";

/** singularOf maps the plural nouns generators put after a count to their singular. */
const singularOf: Readonly<Record<string, string>> = {
  ...Object.fromEntries(
    "part unit group apple item side hundred ten one thousand face edge row column marble cup piece student day hour year minute second week month cent dollar mile meter kilometer centimeter millimeter liter gram kilogram pound ounce gallon quart pint ton yard book bag bottle stamp visit game ticket player tray step whole tenth hundredth dot pet tile zero block member goal place outcome radian period role trial attempt element inversion pivot pair monomial variable way input output ordering symbol operation cycle letter transposition choice point head failure degree component sibling run"
      .split(" ")
      .map((word) => [`${word}s`, word]),
  ),
  erasers: "eraser",
  digits: "digit",
  letters: "letter",
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

/** bareNegative matches a negative number written outside math, where its hyphen would not read as a minus sign: "the point -2". */
const bareNegative = /(?<![\w$)\]}.\-−])-(\d+(?:\.\d+)?)(?![\w%])/;

/** spanOrNegative matches what polishSpans changes: a span of math, or a negative number outside math. */
const spanOrNegative = new RegExp(`${mathSpan.source}|${bareNegative.source}`, "g");

/** verbatimTex matches TeX whose characters are names, not products: "\mathrm{1E0}" or "x_{1i}". */
const verbatimTex = /(\\(?:text|mathrm|operatorname|mathbf|mathbb|mathcal|overline)\{[^{}]*\}|_\{[^{}]*\})/;

/** unitCoefficient matches a coefficient of 1 before a variable or a function: "1x", "-1a_{n}", "1\sin x". */
const unitCoefficient = /(^|[\s(=+\-,{[|])1(?=[a-zA-Z](?![a-zA-Z0-9{])|\\(?:sin|cos|tan|cot|sec|csc|ln|log|sqrt|pi|theta)\b)/g;

/** binaryStringTopics lists the topics whose digits 0 and 1 write strings of symbols, not quantities. */
const binaryStringTopics: ReadonlySet<string> = new Set([
  "adding-and-subtracting-binary-integers",
  "cantors-diagonal-argument",
  "deterministic-finite-automata",
  "introduction-to-turing-machines",
  "logic-gates-and-combinational-circuits",
  "mealy-machines",
  "moore-machines",
  "nondeterministic-finite-automata",
  "processing-strings-using-deterministic-finite-automata",
  "processing-strings-using-turing-machines",
  "regular-expressions",
  "the-cardinality-of-the-power-set-of-natural-numbers",
  "the-language-of-automata",
]);

/** digitBlockTopics lists the topics whose long runs of digits are blocks of digits, not quantities. */
const digitBlockTopics: ReadonlySet<string> = new Set(["periods-of-repeating-decimals"]);

/** texOrInteger matches TeX that keeps its digits as they are, or else a whole number of four or more digits, outside a decimal part and a subscript base. */
const texOrInteger = new RegExp(`${verbatimTex.source}|(?<![\\d.])\\d{4,}(?![\\d_])`, "g");

/** isDigitString reports whether the digits of a topic name symbols rather than a quantity. */
function isDigitString(digits: string, topicId: string): boolean {
  return digits.startsWith("0") || digitBlockTopics.has(topicId) || (binaryStringTopics.has(topicId) && /^[01]+$/.test(digits));
}

/**
 * separateThousands writes a whole number of five or more digits, and the
 * four-digit numbers beside it in the same span, as the content writes numbers
 * by hand: "12{,}345".
 */
function separateThousands(tex: string, topicId: string): string {
  const isLong = (digits: string) => digits.length > 4 && !isDigitString(digits, topicId);
  const integers = [...tex.matchAll(texOrInteger)].map((match) => (match[1] === undefined ? match[0] : ""));
  if (!integers.some(isLong)) return tex;
  return tex.replace(texOrInteger, (match, verbatim?: string) =>
    verbatim !== undefined || isDigitString(match, topicId) ? match : match.replace(/\B(?=(\d{3})+$)/g, "{,}"),
  );
}

/** simplifyMath drops the coefficients of 1 of a math expression and a value that a chain of equalities repeats, and separates the thousands of long numbers. */
function simplifyMath(tex: string, topicId: string): string {
  const dropped = tex
    .split(verbatimTex)
    .map((part, i) => (i % 2 ? part : part.replace(unitCoefficient, "$1")))
    .join("");
  const chain = dropped.split(" = ");
  const simplified = chain.length < 3 ? dropped : chain.filter((value, i) => i === 0 || value.trim() !== chain[i - 1]?.trim()).join(" = ");
  return separateThousands(simplified.replace(/\\sqrt\[2\]/g, "\\sqrt").replace(/(?<=\S) {2,}(?=\S)/g, " "), topicId);
}

/** polishSpans applies simplifyMath to every span of math of a text, and puts the negative numbers outside math into math. */
function polishSpans(text: string, topicId: string): string {
  return text.replace(spanOrNegative, (span, negative?: string) => {
    if (negative !== undefined) return `$-${negative}$`;
    if (span === "\\$") return span;
    const delimiter = span.startsWith("$$") ? "$$" : "$";
    return delimiter + simplifyMath(span.slice(delimiter.length, -delimiter.length), topicId) + delimiter;
  });
}

/** repeatedStatement matches a statement said twice in a row when a generated step changes nothing: "$x = 5$, so $x = 5$". */
const repeatedStatement = /(\$[^$]+\$)(?:, so | gives |，所以 ?)\1/g;

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
export function polishText(text: Text, topicId = ""): Text {
  const polished = (s: string) => polishSpans(s, topicId).replace(repeatedStatement, "$1");
  return { en: polishEnglish(polished(text.en)), "zh-CN": polished(text["zh-CN"]) };
}

/** polishProblem applies polishText to what a learner reads of a problem; the answer is left to the checker. */
export function polishProblem(problem: Problem, topicId = ""): Problem {
  const { input } = problem.answer;
  return {
    ...problem,
    prompt: polishText(problem.prompt, topicId),
    solution: polishText(problem.solution, topicId),
    answer:
      input.kind === "choice"
        ? { ...problem.answer, input: { ...input, options: input.options.map((option) => polishText(option, topicId)) } }
        : problem.answer,
  };
}

/** polishTopic makes the generators of a topic polish the problems they produce. */
export function polishTopic(topic: TopicDef): TopicDef {
  return {
    ...topic,
    knowledgePoints: topic.knowledgePoints.map((kp) => ({ ...kp, generate: (rng) => polishProblem(kp.generate(rng), topic.id) })),
  };
}
