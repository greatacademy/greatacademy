import type { Figure, Problem, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  dec,
  equationChecker,
  expressionChecker,
  factoredChecker,
  factorizationLatex,
  functionChecker,
  inequalityLatexOf,
  intervalLatex,
  parseExpression,
  primeFactors,
  Q,
  type RealSet,
  radical,
  relSymbol,
  sci,
  setEqual,
  surdEqual,
  surdValue,
} from "@ga/subject-math";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** NumberProblem describes a problem whose answer is one number. */
export interface NumberProblem {
  readonly prompt: Text;
  readonly answer: Coefficient;
  readonly solution: Text;
  /** wrong are the values typical mistakes produce; values equal to the answer are dropped. */
  readonly wrong?: readonly Coefficient[];
  /** solveFor shows "x =" before the field and accepts "x = …". */
  readonly solveFor?: string;
  readonly form?: "number" | "integer" | "fraction" | "decimal" | "mixed";
  /** percent shows a percent sign after the field: the answer is a number of percent. */
  readonly percent?: boolean;
  /** unit shows a unit after the field: "°", or a unit such as "cm" or "cm^2". */
  readonly unit?: string;
  /** mistakes are values that typical mistakes produce, with what to say about each; values equal to the answer are dropped. */
  readonly mistakes?: readonly { readonly value: Coefficient; readonly why: Text }[];
}

/** why pairs a value that a typical mistake produces with what to say about it. */
export const why = (value: Coefficient, en: string, zh: string) => ({ value, why: t(en, zh) });

/** say pairs a response that a typical mistake produces with what to say about it. */
export const say = (response: string, en: string, zh: string) => ({ response, why: t(en, zh) });

/** mixedLatex writes a number as an integer or a mixed number: "2\frac{1}{3}", "-\frac{2}{3}". */
export function mixedLatex(c: Coefficient): string {
  const v = toQ(c);
  if (v.isInteger()) return v.toLatex();
  const a = v.abs();
  const whole = a.n / a.d;
  const rest = Q.of(a.n % a.d, a.d);
  const body = whole === 0n ? rest.toLatex() : `${whole}${rest.toLatex()}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** latexIn writes a number in the form a numeric answer asks for. */
function latexIn(v: Q, form: NumberProblem["form"]): string {
  if (form === "decimal") return dec(v);
  if (form === "mixed") return mixedLatex(v);
  return v.toLatex();
}

/** solutionWritesDecimal tells whether a solution ends up with a number as a decimal, and never as its fraction. */
function solutionWritesDecimal(v: Q, solution: Text): boolean {
  if (v.isInteger() || v.d > 10000n || !isTerminating(v) || solution.en.includes(v.toLatex())) return false;
  const decimal = dec(v).replace(/[.\\{}]/g, "\\$&");
  return new RegExp(`(?<![\\d.])${decimal}(?!\\d)`).test(solution.en);
}

/** numberProblem builds a problem checked by the "number" checker. Without a required form, the answer shown after a wrong attempt is written the way the solution writes it. */
export function numberProblem(p: NumberProblem): Problem {
  const answer = toQ(p.answer);
  const written = (w: Q): string => (p.form === "decimal" && isTerminating(w) ? dec(w) : w.toLatex());
  const wrong = [
    ...new Set(
      [...(p.wrong ?? []), ...(p.mistakes ?? []).map((m) => m.value)]
        .map(toQ)
        .filter((w) => !w.eq(answer))
        .map(written),
    ),
  ];
  const mistakes = (p.mistakes ?? [])
    .filter((m) => !toQ(m.value).eq(answer))
    .map((m) => ({ response: written(toQ(m.value)), feedback: m.why }));
  return {
    prompt: p.prompt,
    answer: {
      checker: "number",
      expected: {
        value: answer.toString(),
        ...(p.form && { form: p.form }),
        ...(p.solveFor && { var: p.solveFor }),
        ...(p.percent && { percent: true }),
        ...(p.unit && { unit: p.unit }),
      },
      input: {
        kind: "math",
        ...(p.solveFor && { prefix: `${p.solveFor} =` }),
        ...(p.percent && { suffix: "\\%" }),
        ...(p.unit && { suffix: unitLatex(p.unit) }),
      },
    },
    solution: p.solution,
    canonical: !p.form && solutionWritesDecimal(answer, p.solution) ? dec(answer) : latexIn(answer, p.form),
    wrong,
    ...(mistakes.length > 0 && { mistakes }),
  };
}

/** article picks "a" or "an" by how a number or symbol is read aloud: an 8, an 18, a 7, an x; start capitalizes it. */
export function article(x: number | string, start = false): string {
  const s = String(x);
  const digits = /^\d+/.exec(s)?.[0];
  const an = digits ? digits.startsWith("8") || (/^1[18]/.test(digits) && digits.length % 3 === 2) : /^[aefhilmnorsx]/i.test(s);
  return start ? (an ? "An" : "A") : an ? "an" : "a";
}

/** lowestTerms continues a fraction with its value in lowest terms when that reads differently: lowestTerms(8, 14) is " = \\frac{4}{7}", lowestTerms(4, 7) is "". */
export function lowestTerms(num: number, den: number): string {
  const value = Q.of(num, den).toLatex();
  return value === `\\frac{${num}}{${den}}` ? "" : ` = ${value}`;
}

/** unitLatex writes a unit after a number: "^{\\circ}" for degrees, "\\text{ cm}^{2}" for "cm^2". */
export function unitLatex(unit: string): string {
  if (unit === "°") return "^{\\circ}";
  const [name, power] = unit.split("^");
  return `\\text{ ${name}}${power ? `^{${power}}` : ""}`;
}

/** isTerminating tells whether a number has a terminating decimal expansion. */
export function isTerminating(c: Coefficient): boolean {
  let d = toQ(c).d;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  return d === 1n;
}

/** FactorizationProblem describes a problem whose answer is the prime factorization of a number. */
export interface FactorizationProblem {
  readonly prompt: Text;
  readonly value: number;
  readonly solution: Text;
  /** wrong are products typical mistakes produce, in LaTeX. */
  readonly wrong?: readonly string[];
}

/** factorizationProblem builds a problem checked by the "factorization" checker. */
export function factorizationProblem(p: FactorizationProblem): Problem {
  const canonical = factorizationLatex(primeFactors(p.value));
  return {
    prompt: p.prompt,
    answer: { checker: "factorization", expected: { value: String(p.value) }, input: { kind: "math" } },
    solution: p.solution,
    canonical,
    wrong: [...new Set(p.wrong ?? [])].filter((w) => w !== canonical),
  };
}

/** ScientificProblem describes a problem whose answer is a number written in scientific notation. */
export interface ScientificProblem {
  readonly prompt: Text;
  /** answer is a × 10^n with 1 ≤ |a| < 10. */
  readonly answer: { readonly a: Coefficient; readonly n: number };
  readonly solution: Text;
  /** wrong are the a × 10^n pairs typical mistakes produce; any equal to the answer are dropped. */
  readonly wrong?: readonly (readonly [Coefficient, number])[];
}

/** scientificValue is a × 10^n as an exact rational. */
export function scientificValue(a: Coefficient, n: number): Q {
  const ten = Q.of(10);
  return toQ(a).mul(n >= 0 ? ten.pow(n) : Q.one.div(ten.pow(-n)));
}

/** scientificProblem builds a problem checked by the "scientific" checker. */
export function scientificProblem(p: ScientificProblem): Problem {
  const value = scientificValue(p.answer.a, p.answer.n);
  const canonical = sci(p.answer.a, p.answer.n);
  const wrong = [...new Set((p.wrong ?? []).filter(([a, n]) => !scientificValue(a, n).eq(value)).map(([a, n]) => sci(a, n)))];
  return {
    prompt: p.prompt,
    answer: { checker: "scientific", expected: { value: value.toString() }, input: { kind: "math" } },
    solution: p.solution,
    canonical,
    wrong,
  };
}

/** RadicalProblem describes a problem whose answer is c√m in simplest radical form. */
export interface RadicalProblem {
  readonly prompt: Text;
  /** answer is [c, m] with m square-free; m = 1 for a rational answer. */
  readonly answer: readonly [Coefficient, number];
  readonly solution: Text;
  /** wrong are responses typical mistakes produce, in LaTeX. */
  readonly wrong?: readonly string[];
}

/** radicalProblem builds a problem checked by the "radical" checker. */
export function radicalProblem(p: RadicalProblem): Problem {
  const [c, m] = p.answer;
  const canonical = radical(c, m);
  return {
    prompt: p.prompt,
    answer: { checker: "radical", expected: { coef: toQ(c).toString(), radicand: String(m) }, input: { kind: "math" } },
    solution: p.solution,
    canonical,
    wrong: [...new Set(p.wrong ?? [])].filter((w) => w !== canonical),
  };
}

/** ExpressionProblem describes a problem whose answer is an expression. */
export interface ExpressionProblem {
  readonly prompt: Text;
  /** answer is the expected expression in LaTeX, in simplest form. */
  readonly answer: string;
  readonly solution: Text;
  /** simplified requires the response to be fully simplified: a sum of monomials, which may have monomial denominators. */
  readonly simplified?: boolean;
  /** radical requires the response to be in simplest radical form. */
  readonly radical?: boolean;
  /** lowest requires the response to be one fraction of polynomials in lowest terms. */
  readonly lowest?: boolean;
  /** vertex requires the response to be a quadratic in vertex form, a(x - h)^2 + k. */
  readonly vertex?: boolean;
  /** positive takes the variables to be positive, as the prompt must then say. */
  readonly positive?: boolean;
  /** prefix is shown before the answer field, such as "y =" or "a_n =". */
  readonly prefix?: string;
  /** wrong are responses typical mistakes produce; those the checker accepts (equivalent ones, and with a form required, equivalent ones in that form) are dropped. */
  readonly wrong?: readonly string[];
  /** mistakes are responses that typical mistakes produce, with what to say about each. */
  readonly mistakes?: readonly { readonly response: string; readonly why: Text }[];
}

/** equivalentTo tells whether a response equals the answer of an expression problem in another form, which is no mistake of value. */
function equivalentTo(p: ExpressionProblem, response: string): boolean {
  return expressionChecker.check({ expr: p.answer, ...(p.positive && { positive: true }) }, response).correct;
}

/** expressionProblem builds a problem checked by the "expression" checker. */
export function expressionProblem(p: ExpressionProblem): Problem {
  const expected = {
    expr: p.answer,
    ...(p.simplified && { form: "simplified" }),
    ...(p.radical && { form: "radical" }),
    ...(p.lowest && { form: "lowest" }),
    ...(p.vertex && { form: "vertex" }),
    ...(p.positive && { positive: true }),
  };
  const rejected = (w: string): boolean => !expressionChecker.check(expected, w).correct;
  const wrong = [...new Set([...(p.wrong ?? []), ...(p.mistakes ?? []).map((m) => m.response)])].filter(rejected);
  const problem: Problem = {
    prompt: p.prompt,
    answer: { checker: "expression", expected, input: { kind: "math", ...(p.prefix && { prefix: p.prefix }) } },
    solution: p.solution,
    canonical: p.answer,
    wrong,
  };
  return withMistakes(
    problem,
    (p.mistakes ?? []).filter((m) => rejected(m.response) && !equivalentTo(p, m.response)),
  );
}

/** FunctionProblem describes a problem whose answer is a function that may involve trigonometric, exponential or logarithmic functions. */
export interface FunctionProblem {
  readonly prompt: Text;
  /** answer is the expected expression in LaTeX; for an antiderivative it ends in "+ C". */
  readonly answer: string;
  readonly solution: Text;
  /** antiderivative asks for an antiderivative with the constant of integration C. */
  readonly antiderivative?: boolean;
  /** variable is the variable of the function (default x). */
  readonly variable?: string;
  /** positive takes the variable to be positive, as the prompt must then say. */
  readonly positive?: boolean;
  /** prefix is shown before the answer field, such as "f'(x) =". */
  readonly prefix?: string;
  /** wrong are responses typical mistakes produce; those the checker accepts are dropped. */
  readonly wrong?: readonly string[];
}

/** functionProblem builds a problem checked by the "function" checker. */
export function functionProblem(p: FunctionProblem): Problem {
  const expected = {
    expr: p.answer,
    ...(p.antiderivative && { constant: "C" }),
    ...(p.variable && { var: p.variable }),
    ...(p.positive && { positive: true }),
  };
  const wrong = [...new Set(p.wrong ?? [])].filter((w) => !functionChecker.check(expected, w).correct);
  return {
    prompt: p.prompt,
    answer: { checker: "function", expected, input: { kind: "math", ...(p.prefix && { prefix: p.prefix }) } },
    solution: p.solution,
    canonical: p.answer,
    wrong,
  };
}

/** InequalityOp is the relation of a solution set such as x < 3. */
export type InequalityOp = "<" | "<=" | ">" | ">=";

/** InequalityProblem describes a problem whose answer is a simple inequality. */
export interface InequalityProblem {
  readonly prompt: Text;
  readonly variable?: string;
  readonly op: InequalityOp;
  readonly value: Coefficient;
  readonly solution: Text;
  /** wrong are the relations typical mistakes produce; the answer itself is dropped. */
  readonly wrong?: readonly (readonly [InequalityOp, Coefficient])[];
}

/** inequalityLatex writes "x < 3". */
export function inequalityLatex(variable: string, op: InequalityOp, value: Coefficient): string {
  return `${variable} ${relSymbol(op)} ${toQ(value).toLatex()}`;
}

/** inequalityProblem builds a problem checked by the "inequality" checker. */
export function inequalityProblem(p: InequalityProblem): Problem {
  const variable = p.variable ?? "x";
  const value = toQ(p.value);
  const wrong = [
    ...new Set((p.wrong ?? []).filter(([op, v]) => op !== p.op || !toQ(v).eq(value)).map(([op, v]) => inequalityLatex(variable, op, v))),
  ];
  return {
    prompt: p.prompt,
    answer: { checker: "inequality", expected: { var: variable, op: p.op, value: value.toString() }, input: { kind: "math" } },
    solution: p.solution,
    canonical: inequalityLatex(variable, p.op, value),
    wrong,
  };
}

/** SolutionsProblem describes a problem whose answer is the solution set of an equation in one variable. */
export interface SolutionsProblem {
  readonly prompt: Text;
  /** values are the solutions in LaTeX, in simplest form (see surdLatex); empty when there are none. */
  readonly values: readonly string[];
  readonly variable?: string;
  readonly solution: Text;
  /** wrong are the solution sets typical mistakes produce; sets equal to the answer are dropped. */
  readonly wrong?: readonly (readonly string[])[];
  /** mistakes are solution sets that typical mistakes produce, with what to say about each; sets equal to the answer are dropped. */
  readonly mistakes?: readonly { readonly values: readonly string[]; readonly why: Text }[];
}

/** whySet pairs a solution set that a typical mistake produces with what to say about it. */
export const whySet = (values: readonly string[], en: string, zh: string) => ({ values, why: t(en, zh) });

/** solutionsLatex writes a solution set as a learner would type it: "x = 3, x = -2", or "\varnothing" when it is empty. */
export function solutionsLatex(values: readonly string[], variable = "x"): string {
  return values.length === 0 ? "\\varnothing" : values.map((v) => `${variable} = ${v}`).join(", ");
}

/** solutionsProblem builds a problem checked by the "solutions" checker. */
export function solutionsProblem(p: SolutionsProblem): Problem {
  const variable = p.variable ?? "x";
  const value = (v: string) => {
    const s = surdValue(parseExpression(v));
    if (!s) throw new TypeError(`not an exact number: ${v}`);
    return s;
  };
  const answer = p.values.map(value);
  const sameSet = (vs: readonly string[]) => {
    const set = vs.map(value).filter((s, i, all) => all.findIndex((o) => surdEqual(o, s)) === i);
    return set.length === answer.length && set.every((s) => answer.some((a) => surdEqual(a, s)));
  };
  const listed = (p.mistakes ?? []).filter((m) => !sameSet(m.values));
  return {
    prompt: p.prompt,
    answer: { checker: "solutions", expected: { var: variable, values: [...p.values] }, input: { kind: "math" } },
    solution: p.solution,
    canonical: solutionsLatex(p.values, variable),
    wrong: [
      ...new Set([...(p.wrong ?? []).filter((w) => !sameSet(w)), ...listed.map((m) => m.values)].map((w) => solutionsLatex(w, variable))),
    ],
    ...(listed.length > 0 && { mistakes: listed.map((m) => ({ response: solutionsLatex(m.values, variable), feedback: m.why })) }),
  };
}

/** IntervalProblem describes a problem whose answer is a set of real numbers, such as the solutions of a compound inequality. */
export interface IntervalProblem {
  readonly prompt: Text;
  /** set is the answer, built with union, intersect or parseIntervals. */
  readonly set: RealSet;
  /** form requires interval notation or inequalities; the canonical response is in that form, in interval notation by default. */
  readonly form?: "interval" | "inequality";
  readonly variable?: string;
  readonly solution: Text;
  /** wrong are the sets typical mistakes produce; sets equal to the answer are dropped. */
  readonly wrong?: readonly RealSet[];
}

/** intervalProblem builds a problem checked by the "interval" checker. */
export function intervalProblem(p: IntervalProblem): Problem {
  const variable = p.variable ?? "x";
  const write = (set: RealSet) => (p.form === "inequality" ? inequalityLatexOf(set, variable) : intervalLatex(set));
  return {
    prompt: p.prompt,
    answer: {
      checker: "interval",
      expected: { set: intervalLatex(p.set), var: variable, ...(p.form && { form: p.form }) },
      input: { kind: "math" },
    },
    solution: p.solution,
    canonical: write(p.set),
    wrong: [...new Set((p.wrong ?? []).filter((w) => !setEqual(w, p.set)).map(write))],
  };
}

/** PointProblem describes a problem whose answer is an ordered pair, such as the solution of a system of equations. */
export interface PointProblem {
  readonly prompt: Text;
  readonly answer: readonly Coefficient[];
  /** vars name the coordinates, so that "x = 3, y = -2" is accepted too; x and y by default. */
  readonly vars?: readonly string[];
  /** vector writes the answer as a vector, "\\langle 3, -2 \\rangle", instead of a point. */
  readonly vector?: boolean;
  readonly solution: Text;
  /** wrong are the pairs typical mistakes produce; pairs equal to the answer are dropped. */
  readonly wrong?: readonly (readonly Coefficient[])[];
}

/** pointLatex writes an ordered pair: "(3, -\frac{1}{2})". */
export function pointLatex(values: readonly Coefficient[]): string {
  return `(${values.map((v) => toQ(v).toLatex()).join(", ")})`;
}

/** vectorLatex writes a vector by its components: "\\langle 3, -\\frac{1}{2} \\rangle". */
export function vectorLatex(values: readonly Coefficient[]): string {
  return `\\langle ${values.map((v) => toQ(v).toLatex()).join(", ")} \\rangle`;
}

/** pointProblem builds a problem checked by the "point" checker. */
export function pointProblem(p: PointProblem): Problem {
  const answer = p.answer.map(toQ);
  const write = p.vector ? vectorLatex : pointLatex;
  const same = (w: readonly Coefficient[]) => w.length === answer.length && w.every((v, i) => toQ(v).eq(answer[i]!));
  return {
    prompt: p.prompt,
    answer: {
      checker: "point",
      expected: { values: answer.map((v) => v.toString()), vars: [...(p.vars ?? ["x", "y"])] },
      input: { kind: "math" },
    },
    solution: p.solution,
    canonical: write(answer),
    wrong: [...new Set((p.wrong ?? []).filter((w) => !same(w)).map(write))],
  };
}

/** EquationProblem describes a problem whose answer is an equation, such as the equation of a line. */
export interface EquationProblem {
  readonly prompt: Text;
  /** answer is the expected equation in LaTeX, in the required form. */
  readonly answer: string;
  /** form requires the form of a line: y = mx + b, Ax + By = C or y − k = m(x − h). */
  readonly form?: "slope-intercept" | "standard" | "point-slope";
  readonly vars?: readonly [string, string];
  readonly solution: Text;
  /** wrong are equations typical mistakes produce; those the checker accepts are dropped. */
  readonly wrong?: readonly string[];
}

/** equationProblem builds a problem checked by the "equation" checker. */
export function equationProblem(p: EquationProblem): Problem {
  const expected = { eq: p.answer, ...(p.form && { form: p.form }), ...(p.vars && { vars: [...p.vars] }) };
  return {
    prompt: p.prompt,
    answer: { checker: "equation", expected, input: { kind: "math" } },
    solution: p.solution,
    canonical: p.answer,
    wrong: [...new Set(p.wrong ?? [])].filter((w) => !equationChecker.check(expected, w).correct),
  };
}

/** FactoredProblem describes a problem whose answer is a polynomial factored completely over the integers. */
export interface FactoredProblem {
  readonly prompt: Text;
  /** answer is the complete factorization in LaTeX, such as "2(x + 1)(x - 3)". */
  readonly answer: string;
  readonly solution: Text;
  /** wrong are responses typical mistakes produce; those the checker accepts are dropped. */
  readonly wrong?: readonly string[];
}

/** factoredProblem builds a problem checked by the "factored" checker. */
export function factoredProblem(p: FactoredProblem): Problem {
  const expected = { expr: p.answer };
  return {
    prompt: p.prompt,
    answer: { checker: "factored", expected, input: { kind: "math" } },
    solution: p.solution,
    canonical: p.answer,
    wrong: [...new Set(p.wrong ?? [])].filter((w) => !factoredChecker.check(expected, w).correct),
  };
}

/** ChoiceProblem describes a multiple-choice problem with options in a fixed order. */
export interface ChoiceProblem {
  readonly prompt: Text;
  readonly options: readonly Text[];
  readonly correct: number;
  readonly solution: Text;
}

/** choiceProblem builds a problem checked by the "choice" checker; every other option is a wrong response. */
export function choiceProblem(p: ChoiceProblem): Problem {
  return {
    prompt: p.prompt,
    answer: { checker: "choice", expected: p.correct, input: { kind: "choice", options: p.options } },
    solution: p.solution,
    canonical: String(p.correct),
    wrong: p.options.map((_, i) => String(i)).filter((i) => i !== String(p.correct)),
  };
}

/** FigureChoice describes a choice among drawings, of which one is right. */
export interface FigureChoice {
  readonly prompt: Text;
  readonly correct: Figure;
  /** wrong are the other drawings; one that repeats an earlier drawing is dropped. */
  readonly wrong: readonly Figure[];
  /** whys say, at the same positions as wrong, what mistake leads to each wrong drawing; a learner who picks one is told. */
  readonly whys?: readonly Text[];
  readonly solution: Text;
  /** solutionFigure shows the solution; it defaults to the correct drawing. */
  readonly solutionFigure?: Figure;
  /** figure is a drawing the problem starts from, shown above the options. */
  readonly figure?: Figure;
}

/** figureChoice builds a choice problem whose options are drawings, in a random order, named by their positions. */
export function figureChoice(rng: Rng, p: FigureChoice): Problem {
  const seen = new Set([p.correct.svg]);
  const wrong = p.wrong.filter((f) => {
    if (seen.has(f.svg)) return false;
    seen.add(f.svg);
    return true;
  });
  const why = new Map(p.wrong.flatMap((f, i) => (p.whys?.[i] ? [[f, p.whys[i]] as const] : [])));
  const figures = rng.shuffle([p.correct, ...wrong]);
  const options = figures.map((_, i) => {
    const letter = String.fromCharCode(65 + i);
    return t(`Drawing ${letter}`, `图 ${letter}`);
  });
  const correct = figures.indexOf(p.correct);
  const mistakes = figures.flatMap((f, i) => {
    const feedback = why.get(f);
    return feedback ? [{ response: String(i), feedback }] : [];
  });
  return {
    prompt: p.prompt,
    ...(p.figure && { figure: p.figure }),
    ...(mistakes.length > 0 && { mistakes }),
    answer: { checker: "choice", expected: correct, input: { kind: "choice", options, figures } },
    solution: p.solution,
    solutionFigure: p.solutionFigure ?? p.correct,
    canonical: String(correct),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(correct)),
  };
}

/** yesNo are the options of a yes-or-no question. */
export const yesNo: readonly Text[] = [t("Yes", "是"), t("No", "否")];

/** ReasonChoice describes a choice among answers that carry their reasons, of which one is right. */
export interface ReasonChoice {
  readonly prompt: Text;
  readonly correct: Text;
  /** wrong are the other options; one that repeats an earlier option is dropped. */
  readonly wrong: readonly Text[];
  readonly solution: Text;
}

/** reasonChoice builds a choice problem from its correct option and its wrong ones, in a random order. */
export function reasonChoice(rng: Rng, p: ReasonChoice): Problem {
  const seen = new Set([p.correct.en]);
  const wrong = p.wrong.filter((w) => {
    if (seen.has(w.en)) return false;
    seen.add(w.en);
    return true;
  });
  const options = rng.shuffle([p.correct, ...wrong]);
  return choiceProblem({ prompt: p.prompt, options, correct: options.indexOf(p.correct), solution: p.solution });
}

/** ExplainedChoice describes a choice in which every wrong option says why it is wrong. */
export interface ExplainedChoice {
  readonly prompt: Text;
  readonly correct: Text;
  /** wrong are the other options with what is wrong with each; one that repeats an earlier option is dropped. */
  readonly wrong: readonly { readonly option: Text; readonly why: Text }[];
  /** solution explains the right option; the wrong ones are then gone through in the order they are shown. */
  readonly solution: Text;
  readonly figure?: Figure;
  readonly solutionFigure?: Figure;
}

/**
 * explainedChoice builds a choice problem that goes through its options: a learner who picks a wrong one is told what is
 * wrong with it, and the solution then says the same of every wrong option.
 */
export function explainedChoice(rng: Rng, p: ExplainedChoice): Problem {
  const seen = new Set([p.correct.en]);
  const wrong = p.wrong.filter((w) => {
    if (seen.has(w.option.en)) return false;
    seen.add(w.option.en);
    return true;
  });
  const problem = reasonChoice(rng, { prompt: p.prompt, correct: p.correct, wrong: wrong.map((w) => w.option), solution: p.solution });
  const { input } = problem.answer;
  const shown = input.kind === "choice" ? input.options : [];
  const inOrder = shown.flatMap((o) => wrong.filter((w) => w.option === o));
  const lines = (locale: "en" | "zh-CN", heading: string) =>
    `${p.solution[locale]}\n\n${heading}\n\n${inOrder.map((w) => `- ${w.option[locale]} ${w.why[locale]}`).join("\n")}`;
  return withMistakes(
    {
      ...problem,
      ...(p.figure && { figure: p.figure }),
      ...(p.solutionFigure && { solutionFigure: p.solutionFigure }),
      solution: t(lines("en", "The other options:"), lines("zh-CN", "其他选项：")),
    },
    wrong.map((w) => ({ response: w.option.en, why: w.why })),
  );
}

/** VerdictChoice describes a yes-or-no question whose options each give a verdict and a reason. */
export interface VerdictChoice {
  readonly prompt: Text;
  readonly holds: boolean;
  /** yes is the reason given by the right test when the answer is yes; it is written so that it is false when the answer is no. */
  readonly yes: Text;
  /** no is the reason given by the right test when the answer is no; it is written so that it is false when the answer is yes. */
  readonly no: Text;
  /** yesWrong is a reason for yes that comes from a misconception: never a sound reason, whatever the answer. */
  readonly yesWrong: Text;
  /** noWrong is a reason for no that comes from a misconception: never a sound reason, whatever the answer. */
  readonly noWrong: Text;
  readonly solution: Text;
}

/** verdictChoice asks a yes-or-no question with four options, two reasons for each verdict, so that a guesser passes a quarter of the time. */
export function verdictChoice(rng: Rng, p: VerdictChoice): Problem {
  const because = (verdict: Text, reason: Text) =>
    t(`${verdict.en}, because ${reason.en}.`, `${verdict["zh-CN"]}，因为${reason["zh-CN"].startsWith("$") ? " " : ""}${reason["zh-CN"]}。`);
  const yes = (reason: Text) => because(yesNo[0]!, reason);
  const no = (reason: Text) => because(yesNo[1]!, reason);
  const [right, other] = p.holds ? [yes(p.yes), no(p.no)] : [no(p.no), yes(p.yes)];
  return reasonChoice(rng, { prompt: p.prompt, correct: right, wrong: [other, yes(p.yesWrong), no(p.noWrong)], solution: p.solution });
}

/** steps writes solution steps on lines of their own: a step of pure math as display math, and a step that already contains math delimiters as a paragraph of text. */
export function steps(...lines: readonly string[]): string {
  const kept = lines.filter((l, i) => !(l.startsWith("= ") && lines[i - 1]?.endsWith(l)));
  return `\n\n${kept.map((l) => (l.includes("$") ? l : `$$${l}$$`)).join("\n\n")}\n\n`;
}

/**
 * withMistakes gives a problem's wrong responses feedback of their own. For a math field, a response is written as a learner
 * would; for a choice, it is the text of the option in English, and an option the problem does not list is skipped, since
 * generators drop distractors that coincide. Responses equal to the canonical one are skipped too.
 */
export function withMistakes(problem: Problem, mistakes: readonly { readonly response: string; readonly why: Text }[]): Problem {
  const { input } = problem.answer;
  const listed = mistakes.flatMap((m) => {
    const response = input.kind === "choice" ? String(input.options.findIndex((o) => o.en === m.response)) : m.response;
    return response === "-1" || response === problem.canonical ? [] : [{ response, feedback: m.why }];
  });
  return listed.length > 0 ? { ...problem, mistakes: [...(problem.mistakes ?? []), ...listed] } : problem;
}
