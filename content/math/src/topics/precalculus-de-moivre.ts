import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, linear, poly, Q, simplifyRadical, surd, surdLatex } from "@ga/subject-math";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { remainingDrawings8 } from "../explanation-drawings-remaining-8.ts";
import { choiceProblem, expressionProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus Unit 10: Complex Numbers
// Part 2: Modules 10.33 (De Moivre's Theorem) and 10.34 (The Fundamental Theorem of Algebra).

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** why pairs a wrong option with what is wrong with it in English and Chinese. */
const why = (option: Text, en: string, zh: string): Reason => [option.en, en, zh];

/** oneOf builds a multiple-choice problem from the right option and up to three distinct wrong ones, giving the reasons for the wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
    }
  }
  const options = [right, ...rest.slice(0, 3)];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** m$ wraps LaTeX as inline math in both locales. */
const m$ = (s: string): Text => t(`$${s}$`, `$${s}$`);

/** ordinal writes "3rd", "4th", "21st". */
function ordinal(n: number): string {
  const tail = n % 100;
  if (tail >= 11 && tail <= 13) return `${n}th`;
  return `${n}${n % 10 === 1 ? "st" : n % 10 === 2 ? "nd" : n % 10 === 3 ? "rd" : "th"}`;
}

const TWO = Q.of(2);

/** normPi reduces an angle, given as a multiple of π, to [0, 2). */
function normPi(v: Q): Q {
  let x = v;
  while (x.sign() < 0) x = x.add(TWO);
  while (x.sub(TWO).sign() >= 0) x = x.sub(TWO);
  return x;
}

/** piTex writes v·π in LaTeX: "\\frac{2\\pi}{3}", "-\\pi", "0". */
function piTex(v: Q): string {
  if (v.isZero()) return "0";
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  const body = v.d === 1n ? top : `\\frac{${top}}{${v.d}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** radTex writes an angle given in degrees in radians. */
const radTex = (deg: number) => piTex(Q.of(deg, 180));

/** mod360 reduces degrees to [0, 360). */
const mod360 = (d: number) => ((d % 360) + 360) % 360;

/** polarTex writes r(cos θ + i sin θ), omitting a modulus of 1. */
function polarTex(mod: string, angle: string): string {
  return `${mod === "1" ? "" : mod}\\left(\\cos\\left(${angle}\\right) + i\\sin\\left(${angle}\\right)\\right)`;
}

/** expTex writes r e^{iθ}, omitting a modulus of 1. */
function expTex(mod: string, angle: string): string {
  const e = angle.startsWith("-") ? `-i${angle.slice(1)}` : `i${angle}`;
  return `${mod === "1" ? "" : mod}e^{${e}}`;
}

/** cisDeg writes r cis θ° with θ in degrees. */
const cisDeg = (mod: string, deg: number) => `${mod}\\,\\text{cis}\\left(${deg}^{\\circ}\\right)`;

/** SPECIAL are the nonzero multiples of 30° and 45° below 360°. */
const SPECIAL: readonly number[] = [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

/** trig gives 4cos²θ, 4sin²θ and the signs of cos θ and sin θ, for θ in degrees a multiple of 30° or 45°. */
function trig(deg: number): { c4: number; s4: number; cs: number; ss: number } {
  const d = mod360(deg);
  if (d % 30 !== 0 && d % 45 !== 0) throw new RangeError(`not a special angle: ${deg}`);
  const r = (d * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const sg = (x: number) => (Math.abs(x) < 1e-9 ? 0 : x > 0 ? 1 : -1);
  return { c4: Math.round(4 * c * c), s4: Math.round(4 * s * s), cs: sg(c), ss: sg(s) };
}

/** Surd1 is c√m with m square-free. */
type Surd1 = readonly [number, number];

/** Rect is a complex number whose real and imaginary parts are each c√m. */
interface Rect {
  readonly re: Surd1;
  readonly im: Surd1;
}

/** part is √R times a trigonometric value √(q4)/2 with a sign, when that is c√m with an integer c. */
function part(R: number, q4: number, sign: number): Surd1 | undefined {
  if (sign === 0) return [0, 1];
  const v = R * q4;
  if (v % 4 !== 0) return undefined;
  const [k, m] = simplifyRadical(v / 4);
  return [sign * k, m];
}

/** rectOf is √R(cos θ + i sin θ) in rectangular form, when both parts have integer coefficients. */
function rectOf(R: number, deg: number): Rect | undefined {
  const { c4, s4, cs, ss } = trig(deg);
  const re = part(R, c4, cs);
  const im = part(R, s4, ss);
  return re && im ? { re, im } : undefined;
}

/** rect is rectOf, throwing when the parts are not integer multiples of roots. */
function rect(R: number, deg: number): Rect {
  const z = rectOf(R, deg);
  if (!z) throw new RangeError(`no integer rectangular form: ${R}, ${deg}`);
  return z;
}

/** rectTex writes a Rect as a + bi in simplest radical form: "-4 + 4i\\sqrt{3}". */
function rectTex(z: Rect): string {
  return poly([z.re[0], z.re[1] === 1 ? "" : `\\sqrt{${z.re[1]}}`], [z.im[0], z.im[1] === 1 ? "i" : `i\\sqrt{${z.im[1]}}`]);
}

/** rectTexAt writes √R cis θ in rectangular form, or undefined when it has no integer form. */
function rectTexAt(R: number, deg: number): string | undefined {
  const z = rectOf(R, deg);
  return z && rectTex(z);
}

/** defined keeps the defined strings. */
const defined = (xs: readonly (string | undefined)[]): string[] => xs.filter((x): x is string => x !== undefined);

/** modTex writes √R in simplest radical form. */
function modTex(R: number): string {
  const [k, m] = simplifyRadical(R);
  return m === 1 ? `${k}` : `${k === 1 ? "" : k}\\sqrt{${m}}`;
}

/** halfTex writes √q4 / 2 for q4 in 1…4. */
const halfTex = (q4: number) => (q4 === 4 ? "1" : q4 === 1 ? "\\frac{1}{2}" : `\\frac{\\sqrt{${q4}}}{2}`);

/** unitTex writes cos θ + i sin θ in rectangular form, for θ in degrees a multiple of 30° or 45°. */
function unitTex(deg: number): string {
  const { c4, s4, cs, ss } = trig(deg);
  let out = "";
  if (cs !== 0) out = `${cs < 0 ? "-" : ""}${halfTex(c4)}`;
  if (ss !== 0) {
    const body = s4 === 4 ? "i" : `${halfTex(s4)}i`;
    out = out === "" ? `${ss < 0 ? "-" : ""}${body}` : `${out} ${ss < 0 ? "-" : "+"} ${body}`;
  }
  return out === "" ? "0" : out;
}

/** cx writes a + bi for integers. */
const cx = (a: number, b: number) => poly([a, ""], [b, "i"]);

/** cxr writes a + c·i√m. */
const cxr = (a: number, c: number, m: number) => poly([a, ""], [c, m === 1 ? "i" : `i\\sqrt{${m}}`]);

/** polyX writes a polynomial in x from its coefficients, highest power first. */
function polyX(coeffs: readonly number[]): string {
  const d = coeffs.length - 1;
  return poly(...coeffs.map((c, i) => [c, d - i === 0 ? "" : d - i === 1 ? "x" : `x^{${d - i}}`] as const));
}

/** mulP multiplies two polynomials given by coefficients, highest power first. */
function mulP(a: readonly number[], b: readonly number[]): number[] {
  const out = new Array<number>(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => {
    b.forEach((y, j) => {
      out[i + j]! += x * y;
    });
  });
  return out;
}

/** coprimeTo lists the integers in [1, top] coprime to q. */
const coprimeTo = (q: number, top: number) => Array.from({ length: top }, (_, i) => i + 1).filter((p) => gcd(p, q) === 1);

/** IMAG are imaginary parts c√m with a small square-free m. */
const IMAG: readonly Surd1[] = [
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [1, 2],
  [2, 2],
  [1, 3],
  [2, 3],
  [1, 5],
  [1, 6],
  [1, 7],
];

/** iTex writes c·i√m. */
const iTex = (c: number, m: number) => poly([c, m === 1 ? "i" : `i\\sqrt{${m}}`]);

/** surdSquare writes the square of c√m as it would be squared by hand: "(-3)^{2}", "\\left(2\\sqrt{3}\\right)^{2}". */
const surdSquare = ([c, m]: Surd1) =>
  m === 1 ? (c < 0 ? `(${c})^{2}` : `${c}^{2}`) : `\\left(${c === 1 ? "" : c === -1 ? "-" : c}\\sqrt{${m}}\\right)^{2}`;

// ─── Module 10.33: De Moivre's Theorem ───────────────────────────────────────

/** deMoivresTheorem covers raising a complex number in polar form to a positive integer power. */
export const deMoivresTheorem: TopicDef = {
  id: "de-moivres-theorem",
  title: t("De Moivre's Theorem", "棣莫弗定理"),
  summary: t(
    "Raise a complex number in polar form to a positive integer power with De Moivre's theorem, [r(cos θ + i sin θ)]ⁿ = rⁿ(cos nθ + i sin nθ): raise the modulus to the power and multiply the argument.",
    "利用棣莫弗定理 [r(cos θ + i sin θ)]ⁿ = rⁿ(cos nθ + i sin nθ) 计算三角形式复数的正整数次幂：模长取 n 次幂，辐角乘以 n。",
  ),
  prerequisites: ["products-of-complex-numbers-expressed-in-polar-form", "the-cis-notation"],
  encompasses: [{ topic: "products-of-complex-numbers-expressed-in-polar-form", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5"],
  intro: t(
    `Multiplying complex numbers in polar form multiplies the moduli and adds the arguments. For example, $1 + i$ has modulus $\\sqrt{2}$ and argument $45^{\\circ}$. Multiplying it by itself twice more gives a modulus of

$$\\sqrt{2} \\cdot \\sqrt{2} \\cdot \\sqrt{2} = 2\\sqrt{2}$$

and an argument of $45^{\\circ} + 45^{\\circ} + 45^{\\circ} = 135^{\\circ}$, so $(1 + i)^{3}$ is $-2 + 2i$.

Check: multiplying out, $(1 + i)^{2} = 2i$ and $2i(1 + i) = -2 + 2i$.

In this lesson we raise a number in polar form to any positive integer power in one step: the modulus is raised to the power and the argument is multiplied by it. This is De Moivre's theorem.`,
    `三角形式的复数相乘时，模相乘、辐角相加。例如，$1 + i$ 的模是 $\\sqrt{2}$，辐角是 $45^{\\circ}$。把它再自乘两次，模为

$$\\sqrt{2} \\cdot \\sqrt{2} \\cdot \\sqrt{2} = 2\\sqrt{2}$$

辐角为 $45^{\\circ} + 45^{\\circ} + 45^{\\circ} = 135^{\\circ}$，所以 $(1 + i)^{3}$ 等于 $-2 + 2i$。

检验：直接乘开，$(1 + i)^{2} = 2i$，$2i(1 + i) = -2 + 2i$。

这节课我们一步算出三角形式复数的任意正整数次幂：模取这个幂，辐角乘以指数。这就是棣莫弗定理。`,
  ),
  knowledgePoints: [
    {
      id: "powers-in-polar-form",
      figure: precalculusDrawings4["de-moivres-theorem#powers-in-polar-form"],
      title: t("Raise a complex number in polar form to a power", "计算三角形式复数的幂"),
      explanation: t(
        "Multiplying complex numbers in polar form multiplies the moduli and adds the arguments. Multiplying $z = r(\\cos\\theta + i\\sin\\theta)$ by itself $n$ times therefore multiplies $r$ by itself $n$ times and adds $\\theta$ to itself $n$ times. This is **De Moivre's theorem**:\n\n$$\\left[r(\\cos\\theta + i\\sin\\theta)\\right]^{n} = r^{n}(\\cos n\\theta + i\\sin n\\theta)$$\n\nFor example, $\\left[2\\left(\\cos\\frac{\\pi}{5} + i\\sin\\frac{\\pi}{5}\\right)\\right]^{3} = 8\\left(\\cos\\frac{3\\pi}{5} + i\\sin\\frac{3\\pi}{5}\\right)$. Check: three factors multiply the moduli to $2 \\cdot 2 \\cdot 2 = 8$ and add the arguments to $\\frac{\\pi}{5} + \\frac{\\pi}{5} + \\frac{\\pi}{5} = \\frac{3\\pi}{5}$.\n\nIf $n\\theta$ is $2\\pi$ or more, subtract multiples of $2\\pi$ to bring it into $[0, 2\\pi)$.\n\n> **Watch out.** The power applies to the angle inside the cosine and sine, not to the cosine and sine themselves: $\\cos 3\\theta$ is not $\\cos^{3}\\theta$. The modulus is raised to the power, $2^{3} = 8$, not multiplied by it.",
        "三角形式的复数相乘时，模长相乘、辐角相加。因此把 $z = r(\\cos\\theta + i\\sin\\theta)$ 自乘 $n$ 次，就是把 $r$ 自乘 $n$ 次，把 $\\theta$ 自加 $n$ 次。这就是**棣莫弗定理**：\n\n$$\\left[r(\\cos\\theta + i\\sin\\theta)\\right]^{n} = r^{n}(\\cos n\\theta + i\\sin n\\theta)$$\n\n例如，$\\left[2\\left(\\cos\\frac{\\pi}{5} + i\\sin\\frac{\\pi}{5}\\right)\\right]^{3} = 8\\left(\\cos\\frac{3\\pi}{5} + i\\sin\\frac{3\\pi}{5}\\right)$。检验：三个因数的模相乘得 $2 \\cdot 2 \\cdot 2 = 8$，辐角相加得 $\\frac{\\pi}{5} + \\frac{\\pi}{5} + \\frac{\\pi}{5} = \\frac{3\\pi}{5}$。\n\n若 $n\\theta$ 大于或等于 $2\\pi$，减去 $2\\pi$ 的整数倍，使其落在 $[0, 2\\pi)$ 内。\n\n> **注意。** 幂作用在余弦、正弦里面的角上，而不是作用在余弦、正弦本身上：$\\cos 3\\theta$ 不是 $\\cos^{3}\\theta$。模是取幂，$2^{3} = 8$，而不是乘以指数。",
      ),
      generate(rng) {
        const n = rng.int(2, 6);
        const r = n <= 3 ? rng.pick([2, 3, 4, 5]) : n === 4 ? rng.pick([2, 3]) : 2;
        const q = rng.pick([5, 7, 8, 9, 10, 12, 18]);
        const p = rng.pick(coprimeTo(q, 2 * q - 1));
        const theta = Q.of(p, q);
        const raw = theta.mul(Q.of(n));
        const nt = normPi(raw);
        const a = piTex(theta);
        const b = piTex(nt);
        const rn = r ** n;
        const z = `\\left[${polarTex(String(r), a)}\\right]^{${n}}`;
        const right = polarTex(String(rn), b);
        const reduced = raw.eq(nt);
        const powered = m$(`${rn}\\left(\\cos^{${n}}\\left(${a}\\right) + i\\sin^{${n}}\\left(${a}\\right)\\right)`);
        const timesModulus = m$(polarTex(String(n * r), b));
        const sameAngle = m$(polarTex(String(rn), a));
        const sameModulus = m$(polarTex(String(r), b));
        const copies = (one: string, join: string) => Array.from({ length: n }, () => one).join(join);
        const solution = walked(
          [
            [
              ["Raise the modulus to the power", "模取幂"],
              t(`The modulus $${r}$ is raised to the ${ordinal(n)} power:`, `模 $${r}$ 取 $${n}$ 次幂：`),
              [`${r}^{${n}} = ${rn}`],
            ],
            [
              ["Multiply the argument", "辐角乘以指数"],
              reduced
                ? t(
                    `The argument is multiplied by $${n}$, and the result is already in $[0, 2\\pi)$:`,
                    `辐角乘以 $${n}$，结果已在 $[0, 2\\pi)$ 内：`,
                  )
                : t(
                    `The argument is multiplied by $${n}$, and full turns of $2\\pi$ are removed to bring it into $[0, 2\\pi)$:`,
                    `辐角乘以 $${n}$，再去掉整数圈 $2\\pi$，使它落在 $[0, 2\\pi)$ 内：`,
                  ),
              [`${n} \\cdot ${a} = ${piTex(raw)}`, ...(reduced ? [] : [`${piTex(raw)} - ${piTex(raw.sub(nt))} = ${b}`]), `${z} = ${right}`],
            ],
          ],
          t(
            `Multiply the ${n} factors one at a time instead. The moduli multiply:\n\n$$${copies(String(r), " \\cdot ")} = ${rn}$$\n\nThe arguments add:\n\n$$${copies(a, " + ")} = ${piTex(raw)}$$\n\nBoth agree with the answer${reduced ? "" : ", once full turns are removed from the argument"}.`,
            `改为把 ${n} 个因数逐个相乘。模相乘：\n\n$$${copies(String(r), " \\cdot ")} = ${rn}$$\n\n辐角相加：\n\n$$${copies(a, " + ")} = ${piTex(raw)}$$\n\n${reduced ? "两者都与答案一致。" : "去掉辐角中的整数圈后，两者都与答案一致。"}`,
          ),
        );
        return oneOf(
          rng,
          t(
            `Use De Moivre's theorem to write $${z}$ in polar form $r(\\cos\\theta + i\\sin\\theta)$ with $0 \\le \\theta < 2\\pi$.`,
            `用棣莫弗定理把 $${z}$ 写成三角形式 $r(\\cos\\theta + i\\sin\\theta)$，其中 $0 \\le \\theta < 2\\pi$。`,
          ),
          m$(right),
          [powered, timesModulus, sameAngle, sameModulus],
          solution,
          [
            why(
              powered,
              `This raises the cosine and the sine to the power; De Moivre's theorem multiplies the angle inside them by ${n} instead.`,
              `这是把余弦和正弦取了幂；棣莫弗定理是把它们里面的角乘以 ${n}。`,
            ),
            why(
              timesModulus,
              `This multiplies the modulus by ${n}; it must be raised to the power, $${r}^{${n}} = ${rn}$.`,
              `这是把模乘以 ${n}；模应取幂，$${r}^{${n}} = ${rn}$。`,
            ),
            why(sameAngle, `The modulus is right, but the argument must be multiplied by ${n} as well.`, `模是对的，但辐角也要乘以 ${n}。`),
            why(
              sameModulus,
              `The argument is right, but the modulus must be raised to the power as well, giving ${rn}.`,
              `辐角是对的，但模也要取幂，得 ${rn}。`,
            ),
          ],
        );
      },
    },
    {
      id: "modulus-and-argument-of-a-power",
      title: t("Find the modulus or argument of a power", "求幂的模长或辐角"),
      explanation: t(
        "By De Moivre's theorem, if $z = r(\\cos\\theta + i\\sin\\theta)$ then\n\n$$|z^{n}| = r^{n} \\qquad\\text{and}\\qquad \\arg(z^{n}) = n\\theta$$\n\nup to a multiple of $360^{\\circ}$. For $z = 2(\\cos 50^{\\circ} + i\\sin 50^{\\circ})$, $z^{8}$ has modulus $2^{8} = 256$ and argument $8 \\cdot 50^{\\circ} = 400^{\\circ}$, which is $400^{\\circ} - 360^{\\circ} = 40^{\\circ}$ in $[0^{\\circ}, 360^{\\circ})$. Check: $z^{8}$ is the square of $z^{4}$, which has modulus $16$ and argument $200^{\\circ}$. Squaring gives modulus $256$ and argument $400^{\\circ}$, the same.\n\n> **Watch out.** The modulus is raised to the power, $2^{8} = 256$, not multiplied by it, which would give $16$. The argument must be reduced by full turns: $400^{\\circ}$ is not in $[0^{\\circ}, 360^{\\circ})$.",
        "由棣莫弗定理，若 $z = r(\\cos\\theta + i\\sin\\theta)$，则\n\n$$|z^{n}| = r^{n} \\qquad\\text{且}\\qquad \\arg(z^{n}) = n\\theta$$\n\n（相差 $360^{\\circ}$ 的整数倍）。对 $z = 2(\\cos 50^{\\circ} + i\\sin 50^{\\circ})$，$z^{8}$ 的模长是 $2^{8} = 256$，辐角是 $8 \\cdot 50^{\\circ} = 400^{\\circ}$，在 $[0^{\\circ}, 360^{\\circ})$ 内即 $400^{\\circ} - 360^{\\circ} = 40^{\\circ}$。检验：$z^{8}$ 是 $z^{4}$ 的平方，而 $z^{4}$ 的模是 $16$，辐角是 $200^{\\circ}$。平方后模为 $256$，辐角为 $400^{\\circ}$，结果相同。\n\n> **注意。** 模是取幂，$2^{8} = 256$，而不是乘以指数得 $16$。辐角要减去整数圈：$400^{\\circ}$ 不在 $[0^{\\circ}, 360^{\\circ})$ 内。",
      ),
      generate(rng) {
        const r = rng.pick([2, 3]);
        const n = rng.int(2, r === 2 ? 8 : 5);
        const alpha = rng.int(1, 71) * 5;
        const z = `z = ${r}\\left(\\cos ${alpha}^{\\circ} + i\\sin ${alpha}^{\\circ}\\right)`;
        if (rng.bool()) {
          const answer = mod360(n * alpha);
          const turns = (n * alpha - answer) / 360;
          return numberProblem({
            prompt: t(
              `Let $${z}$. Find the argument of $z^{${n}}$ in $[0^{\\circ}, 360^{\\circ})$.`,
              `设 $${z}$。求 $z^{${n}}$ 在 $[0^{\\circ}, 360^{\\circ})$ 内的辐角。`,
            ),
            answer,
            unit: "°",
            wrong: [n * alpha, alpha, mod360((n - 1) * alpha), mod360(alpha + n)],
            solution: walked(
              [
                [
                  ["Multiply the argument", "辐角乘以指数"],
                  t(
                    `By De Moivre's theorem the argument of $z^{${n}}$ is $${n}$ times that of $z$:`,
                    `由棣莫弗定理，$z^{${n}}$ 的辐角是 $z$ 的辐角的 $${n}$ 倍：`,
                  ),
                  [`${n} \\cdot ${alpha}^{\\circ} = ${n * alpha}^{\\circ}`],
                ],
                turns === 0
                  ? [
                      ["Check the range", "检查范围"],
                      t(
                        `This is already in $[0^{\\circ}, 360^{\\circ})$, so the argument is $${answer}^{\\circ}$.`,
                        `它已在 $[0^{\\circ}, 360^{\\circ})$ 内，所以辐角是 $${answer}^{\\circ}$。`,
                      ),
                    ]
                  : [
                      ["Remove full turns", "去掉整数圈"],
                      t(
                        `Subtract ${turns === 1 ? "one full turn" : `${turns} full turns`} of $360^{\\circ}$:`,
                        `减去 ${turns} 个整圈 $360^{\\circ}$：`,
                      ),
                      [`${n * alpha}^{\\circ} - ${turns * 360}^{\\circ} = ${answer}^{\\circ}`],
                    ],
              ],
              t(
                `Multiplying $${n}$ factors of $z$ adds their arguments:\n\n$$${Array.from({ length: n }, () => `${alpha}^{\\circ}`).join(" + ")} = ${n * alpha}^{\\circ}$$\n\n${turns === 0 ? `This is $${answer}^{\\circ}$` : `This differs from $${answer}^{\\circ}$ by $${turns * 360}^{\\circ}$, a whole number of turns`}, and $${answer}^{\\circ}$ lies in $[0^{\\circ}, 360^{\\circ})$.`,
                `$${n}$ 个 $z$ 相乘，辐角相加：\n\n$$${Array.from({ length: n }, () => `${alpha}^{\\circ}`).join(" + ")} = ${n * alpha}^{\\circ}$$\n\n${turns === 0 ? `它就是 $${answer}^{\\circ}$` : `它与 $${answer}^{\\circ}$ 相差 $${turns * 360}^{\\circ}$，是整数圈`}，而 $${answer}^{\\circ}$ 在 $[0^{\\circ}, 360^{\\circ})$ 内。`,
              ),
            ),
          });
        }
        const copies = Array.from({ length: n }, () => String(r)).join(" \\cdot ");
        return numberProblem({
          prompt: t(`Let $${z}$. Find the modulus $|z^{${n}}|$.`, `设 $${z}$。求模长 $|z^{${n}}|$。`),
          answer: r ** n,
          wrong: [n * r, r ** (n - 1), r ** (n + 1), r],
          solution: walked(
            [
              [
                ["Read the modulus", "读出模"],
                t(
                  `The number in front of the bracket is the modulus: $|z| = ${r}$. The angle $${alpha}^{\\circ}$ does not affect it.`,
                  `括号前的数就是模：$|z| = ${r}$。角 $${alpha}^{\\circ}$ 不影响它。`,
                ),
              ],
              [
                ["Raise it to the power", "取幂"],
                t(`By De Moivre's theorem the modulus is raised to the ${ordinal(n)} power:`, `由棣莫弗定理，模取 $${n}$ 次幂：`),
                [`|z^{${n}}| = ${r}^{${n}} = ${r ** n}`],
              ],
            ],
            t(
              `The modulus of a product is the product of the moduli, so $${n}$ factors of $z$ give\n\n$$${copies} = ${r ** n}$$\n\nThis is the same value.`,
              `积的模等于模的积，所以 $${n}$ 个 $z$ 相乘得\n\n$$${copies} = ${r ** n}$$\n\n结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** BASES are complex numbers √R cis α with integer rectangular parts, for powers in rectangular form. */
const BASES: readonly (readonly [number, number])[] = [
  ...[45, 135, 225, 315].flatMap((a) => [[2, a] as const, [8, a] as const]),
  ...[30, 60, 120, 150, 210, 240, 300, 330].flatMap((a) => [[4, a] as const, [16, a] as const]),
];

/** findingPowersOfComplexNumbersUsingDeMoivresTheorem covers computing powers of complex numbers in rectangular form. */
export const findingPowersOfComplexNumbersUsingDeMoivresTheorem: TopicDef = {
  id: "finding-powers-of-complex-numbers-using-de-moivres-theorem",
  title: t("Finding Powers of Complex Numbers Using De Moivre's Theorem", "用棣莫弗定理求复数的幂"),
  summary: t(
    "Compute powers of complex numbers exactly by converting to polar form, applying De Moivre's theorem, and converting back to rectangular form, and find the least power that makes a complex number real.",
    "把复数化为三角形式，应用棣莫弗定理后再化回代数形式，精确计算复数的幂，并求使复数成为实数的最小正整数次幂。",
  ),
  prerequisites: ["de-moivres-theorem"],
  encompasses: [
    { topic: "de-moivres-theorem", weight: 0.5 },
    { topic: "the-polar-form-of-a-complex-number", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSN.CN.B.5"],
  intro: t(
    `De Moivre's theorem raises a number in polar form to a power: the modulus is raised to the power and the argument is multiplied by it. For example,

$$\\left[2(\\cos 30^{\\circ} + i\\sin 30^{\\circ})\\right]^{3} = 8(\\cos 90^{\\circ} + i\\sin 90^{\\circ})$$

Since $\\cos 90^{\\circ} = 0$ and $\\sin 90^{\\circ} = 1$, this is $8i$.

Check: $2(\\cos 30^{\\circ} + i\\sin 30^{\\circ})$ is $\\sqrt{3} + i$. Its square is $2 + 2\\sqrt{3}i$, and multiplying by $\\sqrt{3} + i$ once more gives $8i$.

In this lesson we use the theorem to find exact powers of numbers written as $a + bi$, by passing through polar form and back, and to find the least power of a number that is real.`,
    `棣莫弗定理计算三角形式复数的幂：模取这个幂，辐角乘以指数。例如，

$$\\left[2(\\cos 30^{\\circ} + i\\sin 30^{\\circ})\\right]^{3} = 8(\\cos 90^{\\circ} + i\\sin 90^{\\circ})$$

因为 $\\cos 90^{\\circ} = 0$，$\\sin 90^{\\circ} = 1$，所以它等于 $8i$。

检验：$2(\\cos 30^{\\circ} + i\\sin 30^{\\circ})$ 就是 $\\sqrt{3} + i$。它的平方是 $2 + 2\\sqrt{3}i$，再乘一次 $\\sqrt{3} + i$ 得 $8i$。

这节课我们用这个定理，经由三角形式再回到代数形式，精确求出 $a + bi$ 形式复数的幂，并求使一个数的幂成为实数的最小指数。`,
  ),
  knowledgePoints: [
    {
      id: "polar-powers-in-rectangular-form",
      title: t("Write a power of a number in polar form as a + bi", "把三角形式复数的幂写成 a + bi"),
      figure: remainingDrawings8["finding-powers-of-complex-numbers-using-de-moivres-theorem#polar-powers-in-rectangular-form"],
      explanation: t(
        "Apply De Moivre's theorem, then evaluate the cosine and sine of the new angle exactly:\n\n$$\\left[2\\left(\\cos\\frac{\\pi}{12} + i\\sin\\frac{\\pi}{12}\\right)\\right]^{4} = 16\\left(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3}\\right) = 16\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = 8 + 8i\\sqrt{3}$$\n\nThe angle $\\frac{\\pi}{12}$ is not a special angle, but $4 \\cdot \\frac{\\pi}{12} = \\frac{\\pi}{3}$ is. Check: the answer has modulus $\\sqrt{64 + 192} = \\sqrt{256} = 16$, which is $2^{4}$.\n\n> **Watch out.** Evaluate the cosine and sine of the new angle $n\\theta$, not of $\\theta$, and multiply by $r^{n}$, not by $r$.",
        "先用棣莫弗定理，再精确求出新角的余弦与正弦：\n\n$$\\left[2\\left(\\cos\\frac{\\pi}{12} + i\\sin\\frac{\\pi}{12}\\right)\\right]^{4} = 16\\left(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3}\\right) = 16\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = 8 + 8i\\sqrt{3}$$\n\n角 $\\frac{\\pi}{12}$ 不是特殊角，但 $4 \\cdot \\frac{\\pi}{12} = \\frac{\\pi}{3}$ 是特殊角。检验：答案的模是 $\\sqrt{64 + 192} = \\sqrt{256} = 16$，正是 $2^{4}$。\n\n> **注意。** 要求新角 $n\\theta$ 的余弦和正弦，而不是 $\\theta$ 的；前面乘的是 $r^{n}$，而不是 $r$。",
      ),
      generate(rng) {
        const R = rng.pick([2, 4]);
        const n = rng.int(2, R === 2 ? 6 : 5);
        const phi = rng.pick(SPECIAL);
        const theta = Q.of(phi, 180 * n);
        const z = `\\left[${polarTex(modTex(R), piTex(theta))}\\right]^{${n}}`;
        const Rn = R ** n;
        const w = rect(Rn, phi);
        const answer = rectTex(w);
        return expressionProblem({
          prompt: t(`Write $${z}$ in the form $a + bi$.`, `把 $${z}$ 写成 $a + bi$ 的形式。`),
          answer,
          radical: true,
          wrong: defined([rectTexAt(Rn, -phi), rectTexAt(Rn, 180 - phi), rectTexAt(Rn, 90 - phi), rectTexAt(R, phi)]),
          solution: walked(
            [
              [
                ["Apply De Moivre's theorem", "应用棣莫弗定理"],
                t(
                  `Raise the modulus to the ${ordinal(n)} power and multiply the argument by $${n}$:`,
                  `模取 $${n}$ 次幂，辐角乘以 $${n}$：`,
                ),
                [`\\left(${modTex(R)}\\right)^{${n}} = ${modTex(Rn)}, \\qquad ${n} \\cdot ${piTex(theta)} = ${radTex(phi)}`],
              ],
              [
                ["Evaluate the cosine and sine", "求余弦和正弦"],
                t(`The new angle is a special angle, so its cosine and sine are exact:`, `新角是特殊角，它的余弦和正弦可以精确写出：`),
                [
                  `\\cos\\left(${radTex(phi)}\\right) + i\\sin\\left(${radTex(phi)}\\right) = ${unitTex(phi)}`,
                  `${modTex(Rn)}\\left(${unitTex(phi)}\\right) = ${answer}`,
                ],
              ],
            ],
            t(
              `The modulus of the answer must be $${modTex(Rn)}$. Its parts give\n\n$$${surdSquare(w.re)} + ${surdSquare(w.im)} = ${Rn}$$\n\nThis is the square of $${modTex(Rn)}$, as it should be.`,
              `答案的模应为 $${modTex(Rn)}$。它的两部分给出\n\n$$${surdSquare(w.re)} + ${surdSquare(w.im)} = ${Rn}$$\n\n正是 $${modTex(Rn)}$ 的平方。`,
            ),
          ),
        });
      },
    },
    {
      id: "powers-of-numbers-in-rectangular-form",
      title: t("Raise a number in rectangular form to a power", "计算代数形式复数的幂"),
      explanation: t(
        "To compute $(a + bi)^{n}$ without expanding, convert to polar form, apply De Moivre's theorem and convert back. For $(1 + i)^{5}$: $|1 + i| = \\sqrt{2}$ and $\\arg(1 + i) = \\frac{\\pi}{4}$, so\n\n$$(1 + i)^{5} = \\left(\\sqrt{2}\\right)^{5}\\left(\\cos\\frac{5\\pi}{4} + i\\sin\\frac{5\\pi}{4}\\right) = 4\\sqrt{2}\\left(-\\frac{\\sqrt{2}}{2} - \\frac{\\sqrt{2}}{2}i\\right) = -4 - 4i$$\n\nCheck: $(1 + i)^{2} = 2i$ and $(2i)^{2} = -4$, so $(1 + i)^{5} = -4(1 + i) = -4 - 4i$.\n\n> **Watch out.** Read the argument from the quadrant of $a + bi$, not only from the ratio of its parts: $-1 - i$ has argument $\\frac{5\\pi}{4}$, not $\\frac{\\pi}{4}$. A power of a root keeps its root: $\\left(\\sqrt{2}\\right)^{5} = 4\\sqrt{2}$.",
        "计算 $(a + bi)^{n}$ 时不必展开：先化为三角形式，应用棣莫弗定理，再化回代数形式。对 $(1 + i)^{5}$：$|1 + i| = \\sqrt{2}$，$\\arg(1 + i) = \\frac{\\pi}{4}$，所以\n\n$$(1 + i)^{5} = \\left(\\sqrt{2}\\right)^{5}\\left(\\cos\\frac{5\\pi}{4} + i\\sin\\frac{5\\pi}{4}\\right) = 4\\sqrt{2}\\left(-\\frac{\\sqrt{2}}{2} - \\frac{\\sqrt{2}}{2}i\\right) = -4 - 4i$$\n\n检验：$(1 + i)^{2} = 2i$，$(2i)^{2} = -4$，所以 $(1 + i)^{5} = -4(1 + i) = -4 - 4i$。\n\n> **注意。** 辐角要根据 $a + bi$ 所在的象限来读，不能只看两部分之比：$-1 - i$ 的辐角是 $\\frac{5\\pi}{4}$，不是 $\\frac{\\pi}{4}$。根式的幂仍保留根式：$\\left(\\sqrt{2}\\right)^{5} = 4\\sqrt{2}$。",
      ),
      keyPrerequisites: ["the-polar-form-of-a-complex-number"],
      generate(rng) {
        const [R, alpha] = rng.pick(BASES);
        const n = rng.int(2, R <= 4 ? 6 : 4);
        const b0 = rect(R, alpha);
        const base = rectTex(b0);
        const Rn = R ** n;
        const phi = mod360(n * alpha);
        const w = rect(Rn, phi);
        const answer = rectTex(w);
        const reduced = phi === n * alpha;
        return expressionProblem({
          prompt: t(
            `Use De Moivre's theorem to write $\\left(${base}\\right)^{${n}}$ in the form $a + bi$.`,
            `用棣莫弗定理把 $\\left(${base}\\right)^{${n}}$ 写成 $a + bi$ 的形式。`,
          ),
          answer,
          radical: true,
          wrong: defined([rectTexAt(Rn, -phi), rectTexAt(Rn, phi + 180), rectTexAt(Rn, 90 - phi), rectTexAt(R, phi)]),
          solution: walked(
            [
              [
                ["Write the base in polar form", "把底数写成三角形式"],
                t(
                  `The modulus comes from the parts, and the argument from the quadrant of the point:`,
                  `模由两部分算出，辐角由点所在的象限读出：`,
                ),
                [
                  `|${base}| = \\sqrt{${surdSquare(b0.re)} + ${surdSquare(b0.im)}} = ${modTex(R)}, \\qquad \\arg\\left(${base}\\right) = ${radTex(alpha)}`,
                ],
              ],
              [
                ["Apply De Moivre's theorem", "应用棣莫弗定理"],
                reduced
                  ? t(
                      `Raise the modulus to the ${ordinal(n)} power and multiply the argument by $${n}$:`,
                      `模取 $${n}$ 次幂，辐角乘以 $${n}$：`,
                    )
                  : t(
                      `Raise the modulus to the ${ordinal(n)} power, multiply the argument by $${n}$, and remove full turns:`,
                      `模取 $${n}$ 次幂，辐角乘以 $${n}$，再去掉整数圈：`,
                    ),
                [
                  `\\left(${modTex(R)}\\right)^{${n}} = ${modTex(Rn)}, \\qquad ${n} \\cdot ${radTex(alpha)} = ${piTex(Q.of(n * alpha, 180))}${reduced ? "" : ` \\to ${radTex(phi)}`}`,
                ],
              ],
              [
                ["Return to rectangular form", "化回代数形式"],
                t(`Evaluate the cosine and sine of the new angle exactly:`, `精确求出新角的余弦和正弦：`),
                [`${polarTex(modTex(Rn), radTex(phi))} = ${modTex(Rn)}\\left(${unitTex(phi)}\\right) = ${answer}`],
              ],
            ],
            t(
              `The modulus of a power is the power of the modulus, so the squared modulus of the answer must be $${R}^{${n}} = ${Rn}$. Its parts give\n\n$$${surdSquare(w.re)} + ${surdSquare(w.im)} = ${Rn}$$\n\nThis agrees.`,
              `幂的模等于模的幂，所以答案的模的平方应为 $${R}^{${n}} = ${Rn}$。它的两部分给出\n\n$$${surdSquare(w.re)} + ${surdSquare(w.im)} = ${Rn}$$\n\n两者一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "least-power-that-is-real",
      title: t("Find the least power that is real", "求使幂为实数的最小次数"),
      explanation: t(
        "A complex number is real when its argument is a multiple of $180^{\\circ}$, and a **positive** real number when its argument is a multiple of $360^{\\circ}$. Since $\\arg(z^{n}) = n\\arg(z)$, find the least $n$ that makes $n\\arg(z)$ such a multiple.\n\nFor $z = \\sqrt{3} + i$, $\\arg(z) = 30^{\\circ}$: $z^{n}$ is real first when $30n = 180$, that is $n = 6$, and a positive real number first when $30n = 360$, that is $n = 12$. Check: $z^{6} = 2^{6}(\\cos 180^{\\circ} + i\\sin 180^{\\circ}) = -64$, which is real but negative.\n\n> **Watch out.** A real number may be negative. For a real power the argument only has to reach a multiple of $180^{\\circ}$; only a positive real power needs a multiple of $360^{\\circ}$.",
        "复数的辐角是 $180^{\\circ}$ 的整数倍时它是实数；辐角是 $360^{\\circ}$ 的整数倍时它是**正**实数。由于 $\\arg(z^{n}) = n\\arg(z)$，只需找出使 $n\\arg(z)$ 成为这样的倍数的最小 $n$。\n\n对 $z = \\sqrt{3} + i$，$\\arg(z) = 30^{\\circ}$：当 $30n = 180$ 即 $n = 6$ 时 $z^{n}$ 首次为实数；当 $30n = 360$ 即 $n = 12$ 时首次为正实数。检验：$z^{6} = 2^{6}(\\cos 180^{\\circ} + i\\sin 180^{\\circ}) = -64$，是实数，但为负数。\n\n> **注意。** 实数可以是负数。要幂为实数，辐角只需达到 $180^{\\circ}$ 的倍数；只有要求正实数时才需要 $360^{\\circ}$ 的倍数。",
      ),
      generate(rng) {
        const [R, alpha] = rng.pick([...BASES, [4, 90] as const, [16, 270] as const, [4, 180] as const]);
        const z = rectTex(rect(R, alpha));
        const positive = rng.bool();
        const step = positive ? 360 : 180;
        const g = gcd(alpha, step);
        const answer = step / g;
        const turns = alpha / g;
        const other = (positive ? 180 : 360) / gcd(alpha, positive ? 180 : 360);
        const kind = positive ? t("a positive real number", "正实数") : t("a real number", "实数");
        const where = positive ? t("on the positive real axis", "在正实轴上") : t("on the real axis", "在实轴上");
        return numberProblem({
          prompt: t(
            `Find the least positive integer $n$ for which $\\left(${z}\\right)^{n}$ is ${kind.en}.`,
            `求使 $\\left(${z}\\right)^{n}$ 为${kind["zh-CN"]}的最小正整数 $n$。`,
          ),
          answer,
          form: "integer",
          wrong: [other, answer * 2, answer % 2 === 0 ? answer / 2 : answer + 1, alpha / gcd(alpha, 90)],
          solution: walked(
            [
              [
                ["Find the argument", "求辐角"],
                t(
                  `The point $${z}$ has argument $${alpha}^{\\circ}$, so by De Moivre's theorem $\\arg\\left(z^{n}\\right) = ${alpha}n^{\\circ}$. ${positive ? `A positive real number has an argument that is a multiple of $360^{\\circ}$.` : `A real number, positive or negative, has an argument that is a multiple of $180^{\\circ}$.`}`,
                  `点 $${z}$ 的辐角是 $${alpha}^{\\circ}$，由棣莫弗定理 $\\arg\\left(z^{n}\\right) = ${alpha}n^{\\circ}$。${positive ? `正实数的辐角是 $360^{\\circ}$ 的倍数。` : `实数不论正负，辐角都是 $180^{\\circ}$ 的倍数。`}`,
                ),
              ],
              [
                ["Reduce the fraction", "约简分数"],
                t(`In lowest terms:`, `化成最简分数：`),
                [`\\frac{${alpha}}{${step}} = \\frac{${turns}}{${answer}}`, `n = ${answer}`],
              ],
            ],
            t(
              `With $n = ${answer}$ the argument is $${alpha * answer}^{\\circ} = ${turns} \\cdot ${step}^{\\circ}$, so the power lies ${where.en}. Since $${turns}$ and $${answer}$ share no factor, no smaller $n$ makes $${alpha}n$ a multiple of $${step}$.`,
              `取 $n = ${answer}$，辐角是 $${alpha * answer}^{\\circ} = ${turns} \\cdot ${step}^{\\circ}$，所以这个幂${where["zh-CN"]}。因为 $${turns}$ 与 $${answer}$ 没有公因数，更小的 $n$ 都不能使 $${alpha}n$ 成为 $${step}$ 的倍数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** POWER_REDUCING_DOUBLES are angles 2θ in degrees whose cosine is ±√2/2 or ±√3/2, with θ in (0°, 360°). */
const POWER_REDUCING_DOUBLES: readonly number[] = [30, 45, 135, 150, 210, 225, 315, 330, 390, 405, 495, 510, 570, 585, 675, 690];

/** kx writes kx for a positive integer k. */
const kx = (k: number) => (k === 1 ? "x" : `${k}x`);

/** thePowerReducingFormulasForSineAndCosine covers rewriting squares and fourth powers of sine and cosine with first powers of cosine. */
export const thePowerReducingFormulasForSineAndCosine: TopicDef = {
  id: "the-power-reducing-formulas-for-sine-and-cosine",
  title: t("The Power-Reducing Formulas for Sine and Cosine", "正弦与余弦的降幂公式"),
  summary: t(
    "Use the power-reducing formulas sin²θ = (1 − cos 2θ)/2 and cos²θ = (1 + cos 2θ)/2 to find exact values and to rewrite squares and fourth powers of sine and cosine with first powers of cosine.",
    "利用降幂公式 sin²θ = (1 − cos 2θ)/2 与 cos²θ = (1 + cos 2θ)/2 求精确值，并把正弦、余弦的平方与四次方改写为只含余弦一次幂的式子。",
  ),
  prerequisites: ["de-moivres-theorem", "the-double-angle-formula-for-cosine"],
  encompasses: [{ topic: "the-double-angle-formula-for-cosine", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `The double-angle formula for cosine can be written $\\cos 2\\theta = 2\\cos^{2}\\theta - 1$. Solving it for the square gives a formula with no square on the right:

$$\\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$$

For example, with $\\theta = 30^{\\circ}$ it gives $\\cos^{2} 30^{\\circ} = \\frac{1 + \\frac{1}{2}}{2} = \\frac{3}{4}$.

Check: $\\cos 30^{\\circ} = \\frac{\\sqrt{3}}{2}$, and its square is $\\frac{3}{4}$ as well.

In this lesson we use this formula and its partner for $\\sin^{2}\\theta$ to find exact values at half of a special angle, and to rewrite squares and fourth powers of sine and cosine with first powers of cosine only.`,
    `余弦的二倍角公式可以写成 $\\cos 2\\theta = 2\\cos^{2}\\theta - 1$。把它对平方项解出来，右边就不再有平方：

$$\\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$$

例如取 $\\theta = 30^{\\circ}$，得 $\\cos^{2} 30^{\\circ} = \\frac{1 + \\frac{1}{2}}{2} = \\frac{3}{4}$。

检验：$\\cos 30^{\\circ} = \\frac{\\sqrt{3}}{2}$，它的平方也是 $\\frac{3}{4}$。

这节课我们用这个公式和关于 $\\sin^{2}\\theta$ 的另一个公式，求特殊角一半处的精确值，并把正弦、余弦的平方与四次方改写成只含余弦一次幂的式子。`,
  ),
  knowledgePoints: [
    {
      id: "exact-values-using-power-reducing-formulas",
      title: t("Find exact values with the power-reducing formulas", "用降幂公式求精确值"),
      explanation: t(
        "By De Moivre's theorem, $(\\cos\\theta + i\\sin\\theta)^{2} = \\cos 2\\theta + i\\sin 2\\theta$. Expanding the left side and comparing real parts gives $\\cos 2\\theta = \\cos^{2}\\theta - \\sin^{2}\\theta$, and with $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ this yields the **power-reducing formulas**:\n\n$$\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2} \\qquad \\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$$\n\nThey give exact values at half of a special angle:\n\n$$\\cos^{2}\\frac{\\pi}{12} = \\frac{1 + \\cos\\frac{\\pi}{6}}{2} = \\frac{1 + \\frac{\\sqrt{3}}{2}}{2} = \\frac{2 + \\sqrt{3}}{4}$$\n\nCheck: the other formula gives $\\sin^{2}\\frac{\\pi}{12} = \\frac{2 - \\sqrt{3}}{4}$, and the two squares add to $\\frac{4}{4} = 1$, as they must.\n\n> **Watch out.** The cosine on the right is taken at the **double** angle: for $\\frac{\\pi}{12}$ use $\\cos\\frac{\\pi}{6}$. The formula for $\\sin^{2}$ has a minus sign and the one for $\\cos^{2}$ a plus sign.",
        "由棣莫弗定理，$(\\cos\\theta + i\\sin\\theta)^{2} = \\cos 2\\theta + i\\sin 2\\theta$。展开左边并比较实部，得 $\\cos 2\\theta = \\cos^{2}\\theta - \\sin^{2}\\theta$，再结合 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$，得到**降幂公式**：\n\n$$\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2} \\qquad \\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$$\n\n利用它们可以求特殊角一半处的精确值：\n\n$$\\cos^{2}\\frac{\\pi}{12} = \\frac{1 + \\cos\\frac{\\pi}{6}}{2} = \\frac{1 + \\frac{\\sqrt{3}}{2}}{2} = \\frac{2 + \\sqrt{3}}{4}$$\n\n检验：另一个公式给出 $\\sin^{2}\\frac{\\pi}{12} = \\frac{2 - \\sqrt{3}}{4}$，两个平方相加得 $\\frac{4}{4} = 1$，正应如此。\n\n> **注意。** 右边的余弦取的是**二倍角**：求 $\\frac{\\pi}{12}$ 处的值要用 $\\cos\\frac{\\pi}{6}$。$\\sin^{2}$ 的公式是减号，$\\cos^{2}$ 的公式是加号。",
      ),
      generate(rng) {
        const D = rng.pick(POWER_REDUCING_DOUBLES);
        const isSin = rng.bool();
        const { c4, cs } = trig(D);
        const sign = isSin ? -cs : cs;
        const value = (s: number, half: boolean) => surdLatex(surd(Q.of(half ? 1 : 2, half ? 4 : 2), Q.of(s, half ? 4 : 2), BigInt(c4)));
        const answer = surdLatex(surd(Q.of(1, 2), Q.of(sign, 4), BigInt(c4)));
        const other = surdLatex(surd(Q.of(1, 2), Q.of(-sign, 4), BigInt(c4)));
        const theta = piTex(Q.of(D, 360));
        const f = isSin ? "\\sin" : "\\cos";
        const g = isSin ? "\\cos" : "\\sin";
        const op = isSin ? "-" : "+";
        const po = isSin ? "+" : "-";
        const cosD = `${cs < 0 ? "-" : ""}\\frac{\\sqrt{${c4}}}{2}`;
        return expressionProblem({
          prompt: t(
            `Use a power-reducing formula to find the exact value of $${f}^{2}\\left(${theta}\\right)$.`,
            `用降幂公式求 $${f}^{2}\\left(${theta}\\right)$ 的精确值。`,
          ),
          answer,
          radical: true,
          wrong: [other, surdLatex(surd(Q.one, Q.of(sign, 2), BigInt(c4))), value(sign, true)],
          solution: walked(
            [
              [
                ["Double the angle", "求二倍角"],
                t(
                  `The formula needs the cosine of the double angle, and the double angle is a special angle:`,
                  `公式要用二倍角的余弦，而二倍角是特殊角：`,
                ),
                [`2 \\cdot ${theta} = ${radTex(D)}`, `\\cos\\left(${radTex(D)}\\right) = ${cosD}`],
              ],
              [
                ["Apply the formula", "应用公式"],
                t(`Substitute into the formula for $${f}^{2}$:`, `代入 $${f}^{2}$ 的公式：`),
                [
                  `${f}^{2}\\left(${theta}\\right) = \\frac{1 ${op} \\cos\\left(${radTex(D)}\\right)}{2} = \\frac{1 ${op} \\left(${cosD}\\right)}{2} = ${answer}`,
                ],
              ],
            ],
            t(
              `The other formula gives the other square at the same angle:\n\n$$${g}^{2}\\left(${theta}\\right) = \\frac{1 ${po} \\left(${cosD}\\right)}{2} = ${other}$$\n\nThe two squares add to\n\n$$${answer} + ${other} = 1$$\n\nThis agrees with $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$.`,
              `另一个公式给出同一角处的另一个平方：\n\n$$${g}^{2}\\left(${theta}\\right) = \\frac{1 ${po} \\left(${cosD}\\right)}{2} = ${other}$$\n\n两个平方相加得\n\n$$${answer} + ${other} = 1$$\n\n这与 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ 相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "rewriting-squares-of-sine-and-cosine",
      title: t("Rewrite squares of sine and cosine", "改写正弦与余弦的平方"),
      explanation: t(
        "The power-reducing formulas replace a square by a first power of cosine of the **double** angle. Multiply the whole formula by any coefficient in front:\n\n$$6\\sin^{2} 3x = 6 \\cdot \\frac{1 - \\cos 6x}{2} = 3 - 3\\cos 6x$$\n\nCheck: at $x = \\frac{\\pi}{6}$ the left side is $6\\sin^{2}\\frac{\\pi}{2} = 6$, and the right side is $3 - 3\\cos\\pi = 6$.\n\n> **Watch out.** The angle doubles: $\\sin^{2} 3x$ becomes $\\cos 6x$, not $\\cos 3x$. The coefficient multiplies both terms of the formula, and the $2$ in its denominator halves it.",
        "降幂公式把平方换成**二倍角**余弦的一次幂。前面的系数要乘到整个式子上：\n\n$$6\\sin^{2} 3x = 6 \\cdot \\frac{1 - \\cos 6x}{2} = 3 - 3\\cos 6x$$\n\n检验：在 $x = \\frac{\\pi}{6}$ 处，左边是 $6\\sin^{2}\\frac{\\pi}{2} = 6$，右边是 $3 - 3\\cos\\pi = 6$。\n\n> **注意。** 角要加倍：$\\sin^{2} 3x$ 变成 $\\cos 6x$，而不是 $\\cos 3x$。系数要乘公式的两项，公式分母里的 $2$ 会把它减半。",
      ),
      generate(rng) {
        const a = rng.pick([2, 4, 6, 8, 10, 12]);
        const k = rng.int(1, 6);
        const isSin = rng.bool();
        const s = isSin ? -1 : 1;
        const h = a / 2;
        const f = isSin ? "\\sin" : "\\cos";
        const op = isSin ? "-" : "+";
        const expr = `${a}${f}^{2} ${kx(k)}`;
        const right = poly([h, ""], [s * h, `\\cos ${kx(2 * k)}`]);
        const flipped = m$(poly([h, ""], [-s * h, `\\cos ${kx(2 * k)}`]));
        const sameAngle = m$(poly([h, ""], [s * h, `\\cos ${kx(k)}`]));
        const unhalved = m$(poly([a, ""], [s * a, `\\cos ${kx(2 * k)}`]));
        const sine = m$(poly([h, ""], [s * h, `\\sin ${kx(2 * k)}`]));
        const x0 = piTex(Q.of(1, 2 * k));
        const left = isSin ? a : 0;
        return oneOf(
          rng,
          t(
            `Use a power-reducing formula to rewrite $${expr}$ using only the first power of cosine.`,
            `用降幂公式把 $${expr}$ 改写为只含余弦一次幂的式子。`,
          ),
          m$(right),
          [flipped, sameAngle, unhalved, sine],
          walked(
            [
              [
                ["Choose the formula", "选择公式"],
                t(
                  `The square is of $${f}$, so use the formula with $\\theta = ${kx(k)}$:`,
                  `平方的是 $${f}$，所以取 $\\theta = ${kx(k)}$，用公式：`,
                ),
                [`${f}^{2} ${kx(k)} = \\frac{1 ${op} \\cos ${kx(2 * k)}}{2}`],
              ],
              [
                ["Multiply by the coefficient", "乘以系数"],
                t(`Multiply both terms by $${a}$:`, `两项都乘以 $${a}$：`),
                [`${expr} = ${a} \\cdot \\frac{1 ${op} \\cos ${kx(2 * k)}}{2} = ${right}`],
              ],
            ],
            t(
              `Try $x = ${x0}$, where $${kx(k)} = \\frac{\\pi}{2}$ and $${kx(2 * k)} = \\pi$. The left side is $${a} \\cdot ${isSin ? 1 : 0}^{2} = ${left}$, and the right side is $${h} ${op} ${h} \\cdot (-1) = ${left}$.\n\nThe two sides agree. With $\\cos ${kx(k)}$ in place of $\\cos ${kx(2 * k)}$ the right side would be $${h}$ here instead.`,
              `取 $x = ${x0}$，此时 $${kx(k)} = \\frac{\\pi}{2}$，$${kx(2 * k)} = \\pi$。左边是 $${a} \\cdot ${isSin ? 1 : 0}^{2} = ${left}$，右边是 $${h} ${op} ${h} \\cdot (-1) = ${left}$。\n\n两边相等。若把 $\\cos ${kx(2 * k)}$ 换成 $\\cos ${kx(k)}$，右边在这里会是 $${h}$。`,
            ),
          ),
          [
            why(
              flipped,
              `This has the wrong sign: the formula for $${f}^{2}$ has $1 ${op} \\cos 2\\theta$.`,
              `符号错了：$${f}^{2}$ 的公式是 $1 ${op} \\cos 2\\theta$。`,
            ),
            why(
              sameAngle,
              `This keeps the angle $${kx(k)}$, but the formula uses the double angle $${kx(2 * k)}$.`,
              `这里保留了角 $${kx(k)}$，但公式用的是二倍角 $${kx(2 * k)}$。`,
            ),
            why(
              unhalved,
              `This leaves out the $2$ in the denominator of the formula, so both terms are twice too large.`,
              `这里漏掉了公式分母中的 $2$，两项都大了一倍。`,
            ),
            why(
              sine,
              `The power-reducing formulas give the cosine of the double angle, not the sine.`,
              `降幂公式给出的是二倍角的余弦，而不是正弦。`,
            ),
          ],
        );
      },
    },
    {
      id: "fourth-powers-and-products",
      title: t("Reduce fourth powers and products of squares", "化简四次方与平方之积"),
      explanation: t(
        "Apply the formulas twice: once to the outer square, then again to the $\\cos^{2} 2x$ that appears.\n\n$$\\cos^{4} x = \\left(\\frac{1 + \\cos 2x}{2}\\right)^{2} = \\frac{1 + 2\\cos 2x + \\cos^{2} 2x}{4} = \\frac{1 + 2\\cos 2x + \\frac{1 + \\cos 4x}{2}}{4} = \\frac{3}{8} + \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$$\n\nIn the same way $\\sin^{4} x = \\frac{3}{8} - \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$ and $\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2} 2x = \\frac{1}{8} - \\frac{1}{8}\\cos 4x$.\n\nCheck: at $x = \\frac{\\pi}{4}$, $\\cos^{4} x = \\left(\\frac{1}{2}\\right)^{2} = \\frac{1}{4}$, and the right side is $\\frac{3}{8} + 0 - \\frac{1}{8} = \\frac{1}{4}$.\n\n> **Watch out.** The $\\cos^{2} 2x$ that appears after squaring is still a square and must be reduced again; it is not $\\cos 4x$. The term in $\\cos 4x$ is $+\\frac{1}{8}$ for both $\\sin^{4} x$ and $\\cos^{4} x$.",
        "两次使用降幂公式：先对外层的平方，再对出现的 $\\cos^{2} 2x$。\n\n$$\\cos^{4} x = \\left(\\frac{1 + \\cos 2x}{2}\\right)^{2} = \\frac{1 + 2\\cos 2x + \\cos^{2} 2x}{4} = \\frac{1 + 2\\cos 2x + \\frac{1 + \\cos 4x}{2}}{4} = \\frac{3}{8} + \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$$\n\n同理，$\\sin^{4} x = \\frac{3}{8} - \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$，$\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2} 2x = \\frac{1}{8} - \\frac{1}{8}\\cos 4x$。\n\n检验：在 $x = \\frac{\\pi}{4}$ 处，$\\cos^{4} x = \\left(\\frac{1}{2}\\right)^{2} = \\frac{1}{4}$，右边是 $\\frac{3}{8} + 0 - \\frac{1}{8} = \\frac{1}{4}$。\n\n> **注意。** 平方后出现的 $\\cos^{2} 2x$ 仍是平方，必须再降幂一次，它不等于 $\\cos 4x$。对 $\\sin^{4} x$ 和 $\\cos^{4} x$，$\\cos 4x$ 项都是 $+\\frac{1}{8}$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 4, 8, 16]);
        const k = rng.int(1, 3);
        const kind = rng.pick(["cos", "sin", "both"] as const);
        const c2 = `\\cos ${kx(2 * k)}`;
        const c4 = `\\cos ${kx(4 * k)}`;
        const A = Q.of(a);
        const lead = a === 1 ? "" : String(a);
        const times = a === 1 ? "" : `${a} \\cdot `;
        const sum = (c: Q, m: Q, l: Q, cc = c2) => poly([c, ""], [m, cc], [l, c4]);
        const x0 = piTex(Q.of(1, 4 * k));
        const quarter = A.mul(Q.of(1, 4)).toLatex();
        const leftEn = a === 1 ? "$\\frac{1}{4}$" : `$${a} \\cdot \\frac{1}{4} = ${quarter}$`;
        const at = (expr: string, rightValue: string) =>
          t(
            `Try $x = ${x0}$, where $${kx(k)} = \\frac{\\pi}{4}$. There $\\cos^{2} ${kx(k)} = \\sin^{2} ${kx(k)} = \\frac{1}{2}$, so $${expr}$ is ${leftEn}.\n\nOn the right $${c2} = 0$ and $${c4} = -1$, so the right side is $${rightValue} = ${quarter}$. The two sides agree.`,
            `取 $x = ${x0}$，此时 $${kx(k)} = \\frac{\\pi}{4}$，$\\cos^{2} ${kx(k)} = \\sin^{2} ${kx(k)} = \\frac{1}{2}$，所以 $${expr}$ 等于 ${leftEn}。\n\n右边 $${c2} = 0$，$${c4} = -1$，所以右边是 $${rightValue} = ${quarter}$。两边相等。`,
          );
        if (kind === "both") {
          const expr = `${lead}\\sin^{2} ${kx(k)}\\cos^{2} ${kx(k)}`;
          const e = A.mul(Q.of(1, 8));
          const right = sum(e, Q.zero, e.neg());
          const plus = m$(sum(e, Q.zero, e));
          const unhalved = m$(sum(A.mul(Q.of(1, 4)), Q.zero, A.mul(Q.of(-1, 4))));
          const sameAngle = m$(poly([e, ""], [e.neg(), c2]));
          return oneOf(
            rng,
            t(`Rewrite $${expr}$ using only first powers of cosine.`, `把 $${expr}$ 改写为只含余弦一次幂的式子。`),
            m$(right),
            [plus, unhalved, sameAngle],
            walked(
              [
                [
                  ["Combine the product", "合并乘积"],
                  t(
                    `Since $\\sin\\theta\\cos\\theta = \\frac{1}{2}\\sin 2\\theta$, the product of the squares is a quarter of $\\sin^{2} ${kx(2 * k)}$:`,
                    `因为 $\\sin\\theta\\cos\\theta = \\frac{1}{2}\\sin 2\\theta$，两个平方之积是 $\\sin^{2} ${kx(2 * k)}$ 的四分之一：`,
                  ),
                  [`${expr} = ${times}\\frac{1}{4}\\sin^{2} ${kx(2 * k)}`],
                ],
                [
                  ["Reduce the square", "对平方降幂"],
                  t(
                    `Use the formula for $\\sin^{2}$ with $\\theta = ${kx(2 * k)}$:`,
                    `取 $\\theta = ${kx(2 * k)}$，用 $\\sin^{2}$ 的公式：`,
                  ),
                  [`${expr} = ${times}\\frac{1}{4} \\cdot \\frac{1 - ${c4}}{2} = ${right}`],
                ],
              ],
              at(expr, `${e.toLatex()} + ${e.toLatex()}`),
            ),
            [
              why(
                plus,
                `The term in $${c4}$ comes from $\\sin^{2} ${kx(2 * k)} = \\frac{1 - ${c4}}{2}$, so it has a minus sign.`,
                `$${c4}$ 项来自 $\\sin^{2} ${kx(2 * k)} = \\frac{1 - ${c4}}{2}$，所以是负号。`,
              ),
              why(
                unhalved,
                `This leaves out the $2$ in the denominator of $\\frac{1 - ${c4}}{2}$, so both terms are twice too large.`,
                `这里漏掉了 $\\frac{1 - ${c4}}{2}$ 分母中的 $2$，两项都大了一倍。`,
              ),
              why(
                sameAngle,
                `Reducing $\\sin^{2} ${kx(2 * k)}$ doubles its angle to $${kx(4 * k)}$, so the cosine is of $${kx(4 * k)}$.`,
                `对 $\\sin^{2} ${kx(2 * k)}$ 降幂时角加倍为 $${kx(4 * k)}$，所以余弦的角是 $${kx(4 * k)}$。`,
              ),
            ],
          );
        }
        const s = kind === "sin" ? -1 : 1;
        const f = kind === "sin" ? "\\sin" : "\\cos";
        const op = s < 0 ? "-" : "+";
        const expr = `${lead}${f}^{4} ${kx(k)}`;
        const c = A.mul(Q.of(3, 8));
        const m = A.mul(Q.of(s, 2));
        const l = A.mul(Q.of(1, 8));
        const right = sum(c, m, l);
        const flipped = m$(sum(c, m.neg(), l));
        const unreduced = m$(sum(A.mul(Q.of(1, 4)), m, A.mul(Q.of(1, 4))));
        const negFour = m$(sum(c, m, l.neg()));
        const sameAngle = m$(sum(c, m, l, `\\cos ${kx(k)}`));
        const parts: Step[] = [
          [
            ["Square the formula", "把公式平方"],
            t(
              `Write $${f}^{4} ${kx(k)}$ as the square of $${f}^{2} ${kx(k)}$ and expand:`,
              `把 $${f}^{4} ${kx(k)}$ 写成 $${f}^{2} ${kx(k)}$ 的平方并展开：`,
            ),
            [`${f}^{4} ${kx(k)} = \\left(\\frac{1 ${op} ${c2}}{2}\\right)^{2} = \\frac{1 ${op} 2${c2} + \\cos^{2} ${kx(2 * k)}}{4}`],
          ],
          [
            ["Reduce again", "再次降幂"],
            t(`The term $\\cos^{2} ${kx(2 * k)}$ is still a square, so reduce it:`, `$\\cos^{2} ${kx(2 * k)}$ 仍是平方，再降幂：`),
            [
              `${f}^{4} ${kx(k)} = \\frac{1 ${op} 2${c2} + \\frac{1 + ${c4}}{2}}{4} = \\frac{3}{8} ${op} \\frac{1}{2}${c2} + \\frac{1}{8}${c4}`,
            ],
          ],
        ];
        if (a !== 1) {
          parts.push([
            ["Multiply by the coefficient", "乘以系数"],
            t(`Multiply every term by $${a}$:`, `每一项都乘以 $${a}$：`),
            [`${expr} = ${right}`],
          ]);
        }
        return oneOf(
          rng,
          t(`Rewrite $${expr}$ using only first powers of cosine.`, `把 $${expr}$ 改写为只含余弦一次幂的式子。`),
          m$(right),
          [flipped, unreduced, negFour, sameAngle],
          walked(parts, at(expr, `${c.toLatex()} - ${l.toLatex()}`)),
          [
            why(
              flipped,
              `The sign of the $${c2}$ term is wrong: the formula for $${f}^{2}$ has $1 ${op} \\cos 2\\theta$.`,
              `$${c2}$ 项的符号错了：$${f}^{2}$ 的公式是 $1 ${op} \\cos 2\\theta$。`,
            ),
            why(
              unreduced,
              `This treats $\\cos^{2} ${kx(2 * k)}$ as $${c4}$ instead of reducing it to $\\frac{1 + ${c4}}{2}$.`,
              `这里把 $\\cos^{2} ${kx(2 * k)}$ 当成了 $${c4}$，而没有把它降幂为 $\\frac{1 + ${c4}}{2}$。`,
            ),
            why(
              negFour,
              `The term in $${c4}$ comes from $+\\cos^{2} ${kx(2 * k)}$, so it is positive.`,
              `$${c4}$ 项来自 $+\\cos^{2} ${kx(2 * k)}$，所以是正的。`,
            ),
            why(
              sameAngle,
              `The first reduction doubles the angle, so the middle term is in $${c2}$, not $\\cos ${kx(k)}$.`,
              `第一次降幂时角加倍，所以中间一项是 $${c2}$，而不是 $\\cos ${kx(k)}$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** ALL_SPECIAL are the multiples of 30° and 45° in [0°, 360°). */
const ALL_SPECIAL: readonly number[] = [0, ...SPECIAL];

/** eulersFormula covers e^{iθ} = cos θ + i sin θ and the exponential form of complex numbers. */
export const eulersFormula: TopicDef = {
  id: "eulers-formula",
  title: t("Euler's Formula", "欧拉公式"),
  summary: t(
    "Use Euler's formula $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$ to write complex numbers in exponential form $re^{i\\theta}$, convert between exponential and rectangular form, and multiply, divide and raise to powers using the laws of exponents.",
    "利用欧拉公式 $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$ 把复数写成指数形式 $re^{i\\theta}$，在指数形式与代数形式之间转换，并用指数运算法则进行乘、除与乘方。",
  ),
  prerequisites: ["de-moivres-theorem"],
  encompasses: [{ topic: "the-cis-notation", weight: 0.3 }],
  xp: 16,
  intro: t(
    `Numbers in polar form multiply by adding their arguments, and De Moivre's theorem raises them to powers by multiplying the argument. For example,

$$\\text{cis}\\,30^{\\circ} \\cdot \\text{cis}\\,60^{\\circ} = \\text{cis}\\,90^{\\circ} = i$$

Check: in rectangular form the product is $\\left(\\frac{\\sqrt{3}}{2} + \\frac{1}{2}i\\right)\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right)$, whose real part is $\\frac{\\sqrt{3}}{4} - \\frac{\\sqrt{3}}{4} = 0$ and whose imaginary part is $\\frac{3}{4} + \\frac{1}{4} = 1$.

Adding the arguments when multiplying is exactly how exponents behave. In this lesson we write $\\text{cis}\\,\\theta$ as the power $e^{i\\theta}$, convert between this exponential form and $a + bi$, and multiply, divide and raise to powers with the laws of exponents.`,
    `三角形式的数相乘时辐角相加，棣莫弗定理求幂时辐角乘以指数。例如，

$$\\text{cis}\\,30^{\\circ} \\cdot \\text{cis}\\,60^{\\circ} = \\text{cis}\\,90^{\\circ} = i$$

检验：写成代数形式，乘积是 $\\left(\\frac{\\sqrt{3}}{2} + \\frac{1}{2}i\\right)\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right)$，实部为 $\\frac{\\sqrt{3}}{4} - \\frac{\\sqrt{3}}{4} = 0$，虚部为 $\\frac{3}{4} + \\frac{1}{4} = 1$。

相乘时辐角相加，这正是指数的规律。这节课我们把 $\\text{cis}\\,\\theta$ 写成幂 $e^{i\\theta}$，在这种指数形式与 $a + bi$ 之间转换，并用指数运算法则做乘、除与乘方。`,
  ),
  knowledgePoints: [
    {
      id: "exponential-form-to-rectangular-form",
      title: t("Convert exponential form to rectangular form", "把指数形式化为代数形式"),
      explanation: t(
        "**Euler's formula** states that for every real $\\theta$\n\n$$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$\n\nso $re^{i\\theta}$ is another way of writing $r(\\cos\\theta + i\\sin\\theta) = r\\,\\text{cis}\\,\\theta$. To convert to rectangular form, evaluate the cosine and sine:\n\n$$4e^{i\\frac{2\\pi}{3}} = 4\\left(-\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = -2 + 2i\\sqrt{3}$$\n\nCheck: $(-2)^{2} + \\left(2\\sqrt{3}\\right)^{2} = 4 + 12 = 16$, the square of the modulus $4$. With $\\theta = \\pi$ the formula gives **Euler's identity** $e^{i\\pi} = -1$.\n\n> **Watch out.** In $re^{i\\theta}$ the number $r$ is the modulus and $\\theta$ the angle in radians. The real part comes from the cosine and the imaginary part from the sine, not the other way round.",
        "**欧拉公式**指出，对任意实数 $\\theta$，\n\n$$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$\n\n因此 $re^{i\\theta}$ 是 $r(\\cos\\theta + i\\sin\\theta) = r\\,\\text{cis}\\,\\theta$ 的另一种写法。化为代数形式时，求出余弦与正弦的值：\n\n$$4e^{i\\frac{2\\pi}{3}} = 4\\left(-\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = -2 + 2i\\sqrt{3}$$\n\n检验：$(-2)^{2} + \\left(2\\sqrt{3}\\right)^{2} = 4 + 12 = 16$，正是模 $4$ 的平方。取 $\\theta = \\pi$ 便得到**欧拉恒等式** $e^{i\\pi} = -1$。\n\n> **注意。** 在 $re^{i\\theta}$ 中，$r$ 是模，$\\theta$ 是以弧度计的角。实部来自余弦，虚部来自正弦，不要弄反。",
      ),
      generate(rng) {
        const r = rng.pick([2, 4, 6]);
        const base = rng.pick(ALL_SPECIAL);
        const d = base !== 0 && rng.bool(0.25) ? base - 360 : base;
        const R = r * r;
        const z = expTex(String(r), radTex(d));
        const w = rect(R, d);
        const answer = rectTex(w);
        return expressionProblem({
          prompt: t(`Write $${z}$ in the form $a + bi$.`, `把 $${z}$ 写成 $a + bi$ 的形式。`),
          answer,
          radical: true,
          wrong: defined([rectTexAt(R, -d), rectTexAt(R, 90 - d), rectTexAt(R, 180 - d)]),
          solution: walked(
            [
              [
                ["Apply Euler's formula", "应用欧拉公式"],
                t(`The modulus is $${r}$ and the angle is $${radTex(d)}$:`, `模是 $${r}$，角是 $${radTex(d)}$：`),
                [`${z} = ${polarTex(String(r), radTex(d))}`],
              ],
              [
                ["Evaluate the cosine and sine", "求余弦和正弦"],
                t(`The angle is a special angle, so its cosine and sine are exact:`, `这是特殊角，它的余弦和正弦可以精确写出：`),
                [
                  `\\cos\\left(${radTex(d)}\\right) + i\\sin\\left(${radTex(d)}\\right) = ${unitTex(d)}`,
                  `${r}\\left(${unitTex(d)}\\right) = ${answer}`,
                ],
              ],
            ],
            t(
              `The modulus of the answer must be $${r}$. Its parts give\n\n$$${surdSquare(w.re)} + ${surdSquare(w.im)} = ${R}$$\n\nThis is $${r}^{2}$, as it should be.`,
              `答案的模应为 $${r}$。它的两部分给出\n\n$$${surdSquare(w.re)} + ${surdSquare(w.im)} = ${R}$$\n\n正是 $${r}^{2}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "rectangular-form-to-exponential-form",
      figure: precalculusDrawings3["eulers-formula#rectangular-form-to-exponential-form"],
      title: t("Convert rectangular form to exponential form", "把代数形式化为指数形式"),
      explanation: t(
        "To write $z = a + bi$ as $re^{i\\theta}$, find the modulus $r = |z| = \\sqrt{a^{2} + b^{2}}$ and the argument $\\theta$ from the quadrant of $z$, exactly as for polar form. For $z = -3 + 3i$: $r = \\sqrt{18} = 3\\sqrt{2}$ and $z$ lies in quadrant II with reference angle $\\frac{\\pi}{4}$, so $\\theta = \\frac{3\\pi}{4}$ and $z = 3\\sqrt{2}e^{i\\frac{3\\pi}{4}}$.\n\nCheck: $3\\sqrt{2}\\left(\\cos\\frac{3\\pi}{4} + i\\sin\\frac{3\\pi}{4}\\right) = 3\\sqrt{2}\\left(-\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2}i\\right) = -3 + 3i$.\n\n> **Watch out.** The reference angle alone is not the argument: the signs of $a$ and $b$ decide the quadrant. The modulus is the square root of $a^{2} + b^{2}$, not the sum itself.",
        "把 $z = a + bi$ 写成 $re^{i\\theta}$ 时，求出模长 $r = |z| = \\sqrt{a^{2} + b^{2}}$，并根据 $z$ 所在象限求出辐角 $\\theta$，方法与三角形式相同。对 $z = -3 + 3i$：$r = \\sqrt{18} = 3\\sqrt{2}$，$z$ 在第二象限，参考角为 $\\frac{\\pi}{4}$，所以 $\\theta = \\frac{3\\pi}{4}$，$z = 3\\sqrt{2}e^{i\\frac{3\\pi}{4}}$。\n\n检验：$3\\sqrt{2}\\left(\\cos\\frac{3\\pi}{4} + i\\sin\\frac{3\\pi}{4}\\right) = 3\\sqrt{2}\\left(-\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2}i\\right) = -3 + 3i$。\n\n> **注意。** 参考角本身不一定是辐角：象限由 $a$ 和 $b$ 的符号决定。模是 $a^{2} + b^{2}$ 的平方根，而不是这个和本身。",
      ),
      generate(rng) {
        const [R, d] = rng.pick([
          ...SPECIAL.flatMap((a) => [[4, a] as const, [16, a] as const]),
          ...[45, 135, 225, 315].flatMap((a) => [[2, a] as const, [8, a] as const, [18, a] as const]),
        ]);
        const w = rect(R, d);
        const z = rectTex(w);
        const mod = modTex(R);
        const right = expTex(mod, radTex(d));
        const axes: Record<number, Text> = {
          90: t("on the positive imaginary axis", "在虚轴的正半轴上"),
          180: t("on the negative real axis", "在实轴的负半轴上"),
          270: t("on the negative imaginary axis", "在虚轴的负半轴上"),
        };
        const fold = d % 180;
        const ref = Math.min(fold, 180 - fold);
        const quadrant = QUADRANTS[Math.floor(d / 90)]!;
        const place = axes[d]
          ? t(`The number lies ${axes[d].en}, so`, `这个数${axes[d]["zh-CN"]}，所以`)
          : t(
              `The number lies in ${quadrant.en} with reference angle $${radTex(ref)}$, so`,
              `这个数在${quadrant["zh-CN"]}，参考角为 $${radTex(ref)}$，所以`,
            );
        const mirrored = m$(expTex(mod, radTex(mod360(180 - d))));
        const conjugate = m$(expTex(mod, radTex(mod360(-d))));
        const squared = m$(expTex(String(R), radTex(d)));
        const opposite = m$(expTex(mod, radTex(mod360(d + 180))));
        return oneOf(
          rng,
          t(
            `Write $z = ${z}$ in exponential form $re^{i\\theta}$ with $r > 0$ and $0 \\le \\theta < 2\\pi$.`,
            `把 $z = ${z}$ 写成指数形式 $re^{i\\theta}$，其中 $r > 0$，$0 \\le \\theta < 2\\pi$。`,
          ),
          m$(right),
          [mirrored, conjugate, squared, opposite],
          walked(
            [
              [
                ["Find the modulus", "求模"],
                t(`Add the squares of the parts and take the square root:`, `把两部分的平方相加再开方：`),
                [`|z| = \\sqrt{${surdSquare(w.re)} + ${surdSquare(w.im)}} = \\sqrt{${R}} = ${mod}`],
              ],
              [
                ["Find the argument", "求辐角"],
                t(
                  `${place.en} the argument in $[0, 2\\pi)$ is $\\theta = ${radTex(d)}$.`,
                  `${place["zh-CN"]}在 $[0, 2\\pi)$ 内的辐角是 $\\theta = ${radTex(d)}$。`,
                ),
                [`z = ${right}`],
              ],
            ],
            t(
              `Convert back with Euler's formula:\n\n$$${mod}\\left(\\cos\\left(${radTex(d)}\\right) + i\\sin\\left(${radTex(d)}\\right)\\right) = ${mod}\\left(${unitTex(d)}\\right) = ${z}$$\n\nThis is the number we started with.`,
              `用欧拉公式化回去：\n\n$$${mod}\\left(\\cos\\left(${radTex(d)}\\right) + i\\sin\\left(${radTex(d)}\\right)\\right) = ${mod}\\left(${unitTex(d)}\\right) = ${z}$$\n\n正是原来的数。`,
            ),
          ),
          [
            why(
              mirrored,
              `This angle is $\\pi - \\theta$. It gives the real part the wrong sign, so it lands in the wrong place.`,
              `这个角是 $\\pi - \\theta$，它使实部的符号相反，位置不对。`,
            ),
            why(
              conjugate,
              `This angle is $2\\pi - \\theta$, the argument of the conjugate $\\bar{z}$: the imaginary part has the wrong sign.`,
              `这个角是 $2\\pi - \\theta$，是共轭 $\\bar{z}$ 的辐角：虚部的符号不对。`,
            ),
            why(
              squared,
              `This uses $a^{2} + b^{2} = ${R}$ as the modulus. The modulus is its square root, $${mod}$.`,
              `这里把 $a^{2} + b^{2} = ${R}$ 当成了模。模是它的平方根 $${mod}$。`,
            ),
            why(
              opposite,
              `This angle is $\\theta + \\pi$, which points the opposite way: it is the argument of $-z$.`,
              `这个角是 $\\theta + \\pi$，方向正好相反，是 $-z$ 的辐角。`,
            ),
          ],
        );
      },
    },
    {
      id: "operations-in-exponential-form",
      title: t("Multiply, divide and raise to powers in exponential form", "指数形式下的乘、除与乘方"),
      explanation: t(
        "The laws of exponents hold for $e^{i\\theta}$, which makes the polar rules short:\n\n$$r_{1}e^{i\\alpha} \\cdot r_{2}e^{i\\beta} = r_{1}r_{2}e^{i(\\alpha + \\beta)} \\qquad \\frac{r_{1}e^{i\\alpha}}{r_{2}e^{i\\beta}} = \\frac{r_{1}}{r_{2}}e^{i(\\alpha - \\beta)} \\qquad \\left(re^{i\\theta}\\right)^{n} = r^{n}e^{in\\theta}$$\n\nThe last rule is De Moivre's theorem. Reduce the resulting angle into $[0, 2\\pi)$ by adding or subtracting $2\\pi$. For example, $\\left(2e^{i\\frac{3\\pi}{4}}\\right)^{3} = 8e^{i\\frac{9\\pi}{4}} = 8e^{i\\frac{\\pi}{4}}$.\n\nCheck: $\\frac{9\\pi}{4} - 2\\pi = \\frac{\\pi}{4}$, and $2 \\cdot 2 \\cdot 2 = 8$.\n\n> **Watch out.** The moduli are multiplied or divided, never added or subtracted, while the angles are added or subtracted, never multiplied. In a quotient the angle of the denominator is subtracted from the angle of the numerator.",
        "指数运算法则对 $e^{i\\theta}$ 同样成立，于是三角形式的运算法则可以写得很简洁：\n\n$$r_{1}e^{i\\alpha} \\cdot r_{2}e^{i\\beta} = r_{1}r_{2}e^{i(\\alpha + \\beta)} \\qquad \\frac{r_{1}e^{i\\alpha}}{r_{2}e^{i\\beta}} = \\frac{r_{1}}{r_{2}}e^{i(\\alpha - \\beta)} \\qquad \\left(re^{i\\theta}\\right)^{n} = r^{n}e^{in\\theta}$$\n\n最后一条就是棣莫弗定理。所得的角要加上或减去 $2\\pi$，化到 $[0, 2\\pi)$ 内。例如，$\\left(2e^{i\\frac{3\\pi}{4}}\\right)^{3} = 8e^{i\\frac{9\\pi}{4}} = 8e^{i\\frac{\\pi}{4}}$。\n\n检验：$\\frac{9\\pi}{4} - 2\\pi = \\frac{\\pi}{4}$，且 $2 \\cdot 2 \\cdot 2 = 8$。\n\n> **注意。** 模是相乘或相除，不是相加或相减；角是相加或相减，不是相乘。求商时，用分子的角减去分母的角。",
      ),
      generate(rng) {
        const angles = [3, 4, 5, 6, 8, 12].flatMap((q) => coprimeTo(q, 2 * q - 1).map((p) => Q.of(p, q)));
        const op = rng.pick(["product", "quotient", "power"] as const);
        const e = (mod: number | string, a: Q) => expTex(String(mod), piTex(normPi(a)));
        const reduce = (raw: Q): string[] => {
          const res = normPi(raw);
          const turns = raw.sub(res);
          if (turns.isZero()) return [];
          return [`${piTex(raw)} ${turns.sign() > 0 ? "-" : "+"} ${piTex(turns.sign() > 0 ? turns : turns.neg())} = ${piTex(res)}`];
        };
        const reduceSay = (raw: Q): Text =>
          normPi(raw).eq(raw)
            ? t("This angle is already in $[0, 2\\pi)$.", "这个角已在 $[0, 2\\pi)$ 内。")
            : t("Bring the angle into $[0, 2\\pi)$:", "把角化到 $[0, 2\\pi)$ 内：");
        const angleStep = (title: readonly [string, string], say: Text, line: string, raw: Q): Step => [
          title,
          t(`${say.en} ${reduceSay(raw).en}`, `${say["zh-CN"]}${reduceSay(raw)["zh-CN"]}`),
          [line, ...reduce(raw)],
        ];
        if (op === "power") {
          const a = rng.pick(angles);
          const n = rng.pick([2, 3, 4].filter((k) => !normPi(a.mul(Q.of(k))).isZero()));
          const r = rng.pick([2, 3]);
          const raw = a.mul(Q.of(n));
          const res = normPi(raw);
          const z = `\\left(${e(r, a)}\\right)^{${n}}`;
          const right = e(r ** n, res);
          const timesN = m$(e(n * r, res));
          const sameAngle = m$(e(r ** n, a));
          const sameMod = m$(e(r, res));
          const divided = m$(e(r ** n, a.mul(Q.of(1, n))));
          return oneOf(
            rng,
            t(`Simplify $${z}$. Give the angle in $[0, 2\\pi)$.`, `化简 $${z}$，角取在 $[0, 2\\pi)$ 内。`),
            m$(right),
            [timesN, sameAngle, sameMod, divided],
            walked(
              [
                [["Raise the modulus to the power", "模取幂"], t(`The modulus becomes:`, `模变为：`), [`${r}^{${n}} = ${r ** n}`]],
                angleStep(
                  ["Multiply the angle", "角乘以指数"],
                  t(`The angle is multiplied by $${n}$.`, `角乘以 $${n}$。`),
                  `${n} \\cdot ${piTex(a)} = ${piTex(raw)}`,
                  raw,
                ),
              ],
              t(
                `Multiplying $${n}$ copies of $${e(r, a)}$ adds the angle $${n}$ times and multiplies the modulus $${n}$ times, which gives $${r ** n}$ with angle $${piTex(raw)}$.\n\nAngles that differ by whole turns of $2\\pi$ name the same direction, so the answer is $${right}$.`,
                `把 $${n}$ 个 $${e(r, a)}$ 相乘，角相加 $${n}$ 次，模相乘 $${n}$ 次，得到模 $${r ** n}$、角 $${piTex(raw)}$。\n\n相差整数个 $2\\pi$ 的角表示同一方向，所以答案是 $${right}$。`,
              ),
            ),
            [
              why(
                timesN,
                `This multiplies the modulus by $${n}$. The modulus is raised to the power: $${r}^{${n}} = ${r ** n}$.`,
                `这里把模乘以 $${n}$。模应取幂：$${r}^{${n}} = ${r ** n}$。`,
              ),
              why(
                sameAngle,
                `This keeps the angle $${piTex(a)}$. The power multiplies the angle by $${n}$.`,
                `这里保留了角 $${piTex(a)}$。乘方时角要乘以 $${n}$。`,
              ),
              why(sameMod, `This leaves the modulus at $${r}$. The modulus is raised to the power too.`, `这里模仍是 $${r}$。模也要取幂。`),
              why(
                divided,
                `This divides the angle by $${n}$, which is the rule for roots. A power multiplies the angle by $${n}$.`,
                `这里把角除以了 $${n}$，那是开方的法则。乘方时角要乘以 $${n}$。`,
              ),
            ],
          );
        }
        if (op === "product") {
          const a = rng.pick(angles);
          const b = rng.pick(angles.filter((v) => !v.eq(a) && !normPi(a.add(v)).isZero()));
          const r1 = rng.pick([2, 3, 4, 5]);
          const r2 = rng.pick([2, 3, 4, 5]);
          const raw = a.add(b);
          const res = normPi(raw);
          const z = `\\left(${e(r1, a)}\\right)\\left(${e(r2, b)}\\right)`;
          const right = e(r1 * r2, res);
          const added = m$(e(r1 + r2, res));
          const subtracted = m$(e(r1 * r2, a.sub(b)));
          const multiplied = m$(e(r1 * r2, a.mul(b)));
          const dropped = m$(e(r1 * r2, a));
          return oneOf(
            rng,
            t(`Simplify $${z}$. Give the angle in $[0, 2\\pi)$.`, `化简 $${z}$，角取在 $[0, 2\\pi)$ 内。`),
            m$(right),
            [added, subtracted, multiplied, dropped],
            walked(
              [
                [
                  ["Multiply the moduli", "模相乘"],
                  t(`The modulus of a product is the product of the moduli:`, `积的模等于模的积：`),
                  [`${r1} \\cdot ${r2} = ${r1 * r2}`],
                ],
                angleStep(
                  ["Add the angles", "角相加"],
                  t(`The exponents add.`, `指数相加。`),
                  `${piTex(a)} + ${piTex(b)} = ${piTex(raw)}`,
                  raw,
                ),
              ],
              t(
                `Divide the answer by the second factor. The modulus is $${r1 * r2} \\div ${r2} = ${r1}$, and the angle is the following.\n\n$$${piTex(res)} - ${piTex(b)} = ${piTex(res.sub(b))}$$\n\nUp to whole turns of $2\\pi$ this is $${piTex(a)}$, so we get back the first factor $${e(r1, a)}$.`,
                `用答案除以第二个因数。模是 $${r1 * r2} \\div ${r2} = ${r1}$，角如下。\n\n$$${piTex(res)} - ${piTex(b)} = ${piTex(res.sub(b))}$$\n\n除去整数个 $2\\pi$，它就是 $${piTex(a)}$，所以得回第一个因数 $${e(r1, a)}$。`,
              ),
            ),
            [
              why(
                added,
                `This adds the moduli. The moduli of a product are multiplied: $${r1} \\cdot ${r2} = ${r1 * r2}$.`,
                `这里把模相加了。积的模要相乘：$${r1} \\cdot ${r2} = ${r1 * r2}$。`,
              ),
              why(
                subtracted,
                `This subtracts the angles, which is the rule for a quotient. In a product the angles add.`,
                `这里把角相减了，那是除法的法则。乘法中角相加。`,
              ),
              why(
                multiplied,
                `This multiplies the angles. In a product the exponents, and so the angles, add.`,
                `这里把角相乘了。乘法中指数相加，所以角相加。`,
              ),
              why(
                dropped,
                `This keeps only the angle of the first factor. The angle of the second factor must be added to it.`,
                `这里只保留了第一个因数的角。第二个因数的角也要加上。`,
              ),
            ],
          );
        }
        const a = rng.pick(angles);
        const b = rng.pick(angles.filter((v) => !normPi(a.sub(v)).isZero() && !normPi(a.add(v)).isZero()));
        const r2 = rng.pick([2, 3]);
        const k = rng.pick([2, 3, 4]);
        const r1 = r2 * k;
        const raw = a.sub(b);
        const res = normPi(raw);
        const z = `\\frac{${e(r1, a)}}{${e(r2, b)}}`;
        const right = e(k, res);
        const added = m$(e(k, a.add(b)));
        const reversed = m$(e(k, b.sub(a)));
        const subtracted = m$(e(r1 - r2, res));
        const multiplied = m$(e(r1 * r2, res));
        return oneOf(
          rng,
          t(`Simplify $${z}$. Give the angle in $[0, 2\\pi)$.`, `化简 $${z}$，角取在 $[0, 2\\pi)$ 内。`),
          m$(right),
          [added, reversed, subtracted, multiplied],
          walked(
            [
              [
                ["Divide the moduli", "模相除"],
                t(`The modulus of a quotient is the quotient of the moduli:`, `商的模等于模的商：`),
                [`\\frac{${r1}}{${r2}} = ${k}`],
              ],
              angleStep(
                ["Subtract the angles", "角相减"],
                t(`The exponent of the denominator is subtracted from that of the numerator.`, `用分子的指数减去分母的指数。`),
                `${piTex(a)} - ${piTex(b)} = ${piTex(raw)}`,
                raw,
              ),
            ],
            t(
              `Multiply the answer by the denominator. The modulus is $${k} \\cdot ${r2} = ${r1}$, and the angle is the following.\n\n$$${piTex(res)} + ${piTex(b)} = ${piTex(res.add(b))}$$\n\nUp to whole turns of $2\\pi$ this is $${piTex(a)}$, so we get back the numerator $${e(r1, a)}$.`,
              `用答案乘以分母。模是 $${k} \\cdot ${r2} = ${r1}$，角如下。\n\n$$${piTex(res)} + ${piTex(b)} = ${piTex(res.add(b))}$$\n\n除去整数个 $2\\pi$，它就是 $${piTex(a)}$，所以得回分子 $${e(r1, a)}$。`,
            ),
          ),
          [
            why(
              added,
              `This adds the angles, which is the rule for a product. In a quotient the angles subtract.`,
              `这里把角相加了，那是乘法的法则。除法中角相减。`,
            ),
            why(
              reversed,
              `This subtracts the angle of the numerator from that of the denominator, the wrong way round.`,
              `这里用分母的角减去分子的角，顺序反了。`,
            ),
            why(
              subtracted,
              `This subtracts the moduli. The moduli of a quotient are divided: $\\frac{${r1}}{${r2}} = ${k}$.`,
              `这里把模相减了。商的模要相除：$\\frac{${r1}}{${r2}} = ${k}$。`,
            ),
            why(
              multiplied,
              `This multiplies the moduli. The moduli of a quotient are divided: $\\frac{${r1}}{${r2}} = ${k}$.`,
              `这里把模相乘了。商的模要相除：$\\frac{${r1}}{${r2}} = ${k}$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** ORDERS are orders n of roots of unity whose arguments 360k/n are whole degrees. */
const ORDERS: readonly number[] = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];

/** rootOfUnity writes e^{2πik/n} without reducing the fraction. */
const rootOfUnity = (k: number, n: number) => `e^{\\frac{2\\pi i \\cdot ${k}}{${n}}}`;

/** theRootsOfUnity covers the solutions of zⁿ = 1. */
export const theRootsOfUnity: TopicDef = {
  id: "the-roots-of-unity",
  title: t("The Roots of Unity", "单位根"),
  summary: t(
    "Find the $n$ solutions of $z^n = 1$, the $n$th roots of unity $e^{2\\pi ik/n}$ for $k = 0, 1, \\dots, n - 1$, which lie equally spaced on the unit circle, and write them in rectangular form.",
    "求方程 $z^n = 1$ 的 $n$ 个解，即 $n$ 次单位根 $e^{2\\pi ik/n}$（$k = 0, 1, \\dots, n - 1$），它们等间隔地分布在单位圆上，并把它们写成代数形式。",
  ),
  prerequisites: ["finding-powers-of-complex-numbers-using-de-moivres-theorem", "eulers-formula"],
  encompasses: [{ topic: "eulers-formula", weight: 0.3 }],
  xp: 16,
  intro: t(
    `By De Moivre's theorem a number of modulus $1$ raised to the $n$th power keeps modulus $1$ and has its argument multiplied by $n$. For example, $i = e^{i\\frac{\\pi}{2}}$ gives

$$i^{4} = e^{i \\cdot 4 \\cdot \\frac{\\pi}{2}} = e^{2\\pi i} = 1$$

So $i$ is a solution of $z^{4} = 1$, and so are $1$, $-1$ and $-i$.

Check: $i^{4} = \\left(i^{2}\\right)^{2} = (-1)^{2} = 1$.

In this lesson we find all $n$ solutions of $z^{n} = 1$, the $n$th roots of unity: their arguments, their rectangular forms, and how many lie in each part of the plane.`,
    `由棣莫弗定理，模为 $1$ 的数取 $n$ 次幂后模仍为 $1$，辐角乘以 $n$。例如由 $i = e^{i\\frac{\\pi}{2}}$ 得

$$i^{4} = e^{i \\cdot 4 \\cdot \\frac{\\pi}{2}} = e^{2\\pi i} = 1$$

所以 $i$ 是 $z^{4} = 1$ 的解，$1$、$-1$ 和 $-i$ 也是。

检验：$i^{4} = \\left(i^{2}\\right)^{2} = (-1)^{2} = 1$。

这节课我们求 $z^{n} = 1$ 的全部 $n$ 个解，即 $n$ 次单位根：求它们的辐角和代数形式，并数出平面各部分各有几个。`,
  ),
  knowledgePoints: [
    {
      id: "arguments-of-roots-of-unity",
      figure: precalculusDrawings3["the-roots-of-unity#arguments-of-roots-of-unity"],
      title: t("Find the arguments of the roots of unity", "求单位根的辐角"),
      explanation: t(
        "If $z^{n} = 1$ then $|z|^{n} = 1$, so $|z| = 1$, and by De Moivre's theorem $n\\arg(z)$ must be a multiple of $2\\pi$. The $n$ solutions, the **$n$th roots of unity**, are\n\n$$\\omega_{k} = e^{\\frac{2\\pi i k}{n}} = \\cos\\frac{2\\pi k}{n} + i\\sin\\frac{2\\pi k}{n}, \\qquad k = 0, 1, \\ldots, n - 1$$\n\nThey are equally spaced on the unit circle, $\\frac{360^{\\circ}}{n}$ apart, starting from $\\omega_{0} = 1$. For $n = 8$ and $k = 3$: $\\arg\\omega_{3} = \\frac{360^{\\circ} \\cdot 3}{8} = 135^{\\circ}$.\n\nCheck: $8 \\cdot 135^{\\circ} = 1080^{\\circ}$, which is $3$ full turns, so $\\omega_{3}^{8} = 1$.\n\n> **Watch out.** The roots are $\\frac{360^{\\circ}}{n}$ apart, not $\\frac{180^{\\circ}}{n}$. Counting starts at $\\omega_{0} = 1$, so $\\omega_{k}$ is $k$ steps from $1$, not $k + 1$.",
        "若 $z^{n} = 1$，则 $|z|^{n} = 1$，所以 $|z| = 1$；再由棣莫弗定理，$n\\arg(z)$ 必须是 $2\\pi$ 的整数倍。这 $n$ 个解称为 **$n$ 次单位根**：\n\n$$\\omega_{k} = e^{\\frac{2\\pi i k}{n}} = \\cos\\frac{2\\pi k}{n} + i\\sin\\frac{2\\pi k}{n}, \\qquad k = 0, 1, \\ldots, n - 1$$\n\n它们从 $\\omega_{0} = 1$ 开始，在单位圆上等间隔分布，相邻两个相差 $\\frac{360^{\\circ}}{n}$。当 $n = 8$、$k = 3$ 时，$\\arg\\omega_{3} = \\frac{360^{\\circ} \\cdot 3}{8} = 135^{\\circ}$。\n\n检验：$8 \\cdot 135^{\\circ} = 1080^{\\circ}$，正好是 $3$ 整圈，所以 $\\omega_{3}^{8} = 1$。\n\n> **注意。** 相邻两根相差 $\\frac{360^{\\circ}}{n}$，而不是 $\\frac{180^{\\circ}}{n}$。从 $\\omega_{0} = 1$ 开始数，$\\omega_{k}$ 离 $1$ 有 $k$ 步，而不是 $k + 1$ 步。",
      ),
      generate(rng) {
        const n = rng.pick(ORDERS);
        const k = rng.int(1, n - 1);
        const gap = 360 / n;
        const answer = k * gap;
        return numberProblem({
          prompt: t(
            `The ${ordinal(n)} roots of unity are $\\omega_{k} = ${rootOfUnity(0, n).replace("\\cdot 0", "k")}$ for $k = 0, 1, \\ldots, ${n - 1}$. Find the argument of $\\omega_{${k}}$ in degrees.`,
            `${n} 次单位根为 $\\omega_{k} = ${rootOfUnity(0, n).replace("\\cdot 0", "k")}$，$k = 0, 1, \\ldots, ${n - 1}$。求 $\\omega_{${k}}$ 的辐角（用度表示）。`,
          ),
          answer,
          unit: "°",
          wrong: [Q.of(180 * k, n), Q.of(360 * (k + 1), n), Q.of(360, n), Q.of(360 * k, n + 1)],
          solution: walked(
            [
              [
                ["Find the spacing", "求间隔"],
                t(`The ${n} roots are equally spaced around the full turn:`, `${n} 个根在整圈上等间隔分布：`),
                [`\\frac{360^{\\circ}}{${n}} = ${gap}^{\\circ}`],
              ],
              [
                ["Count steps from 1", "从 1 开始数步"],
                t(
                  `The root $\\omega_{${k}}$ is $${k}$ step${k === 1 ? "" : "s"} from $\\omega_{0} = 1$:`,
                  `$\\omega_{${k}}$ 离 $\\omega_{0} = 1$ 有 $${k}$ 步：`,
                ),
                [`\\arg\\omega_{${k}} = ${k} \\cdot ${gap}^{\\circ} = ${answer}^{\\circ}`],
              ],
            ],
            t(
              `By De Moivre's theorem $\\omega_{${k}}^{${n}}$ has the argument $${n} \\cdot ${answer}^{\\circ} = ${n * answer}^{\\circ}$.\n\nThis is $${k}$ full turn${k === 1 ? "" : "s"} of $360^{\\circ}$, so $\\omega_{${k}}^{${n}} = 1$, as a root of unity must satisfy.`,
              `由棣莫弗定理，$\\omega_{${k}}^{${n}}$ 的辐角是 $${n} \\cdot ${answer}^{\\circ} = ${n * answer}^{\\circ}$。\n\n这正好是 $${k}$ 个 $360^{\\circ}$ 整圈，所以 $\\omega_{${k}}^{${n}} = 1$，符合单位根的要求。`,
            ),
          ),
        });
      },
    },
    {
      id: "roots-of-unity-in-rectangular-form",
      figure: precalculusDrawings3["the-roots-of-unity#roots-of-unity-in-rectangular-form"],
      title: t("Write roots of unity in rectangular form", "把单位根写成代数形式"),
      explanation: t(
        "When $\\frac{360^{\\circ} k}{n}$ is a special angle, the root of unity has an exact rectangular form. For $n = 3$ and $k = 1$:\n\n$$e^{\\frac{2\\pi i}{3}} = \\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3} = -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$$\n\nSo the cube roots of unity are $1$ and $-\\frac{1}{2} \\pm \\frac{\\sqrt{3}}{2}i$.\n\nCheck: $\\left(-\\frac{1}{2}\\right)^{2} + \\left(\\frac{\\sqrt{3}}{2}\\right)^{2} = \\frac{1}{4} + \\frac{3}{4} = 1$, so the point lies on the unit circle.\n\n> **Watch out.** The angle is $\\frac{2\\pi k}{n}$, with the $2$. The real part is its cosine and the imaginary part its sine; the signs follow the quadrant of the angle.",
        "当 $\\frac{360^{\\circ} k}{n}$ 是特殊角时，单位根有精确的代数形式。当 $n = 3$、$k = 1$ 时：\n\n$$e^{\\frac{2\\pi i}{3}} = \\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3} = -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$$\n\n所以三次单位根是 $1$ 和 $-\\frac{1}{2} \\pm \\frac{\\sqrt{3}}{2}i$。\n\n检验：$\\left(-\\frac{1}{2}\\right)^{2} + \\left(\\frac{\\sqrt{3}}{2}\\right)^{2} = \\frac{1}{4} + \\frac{3}{4} = 1$，所以这个点在单位圆上。\n\n> **注意。** 角是 $\\frac{2\\pi k}{n}$，不要漏掉 $2$。实部是它的余弦，虚部是它的正弦，符号由角所在的象限决定。",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 6, 8, 12]);
        const k = rng.int(1, n - 1);
        const d = (360 * k) / n;
        const w = rootOfUnity(k, n);
        const right = unitTex(d);
        const { c4, s4, cs, ss } = trig(d);
        const partTex = (q4: number, sign: number) => (sign === 0 ? "0" : `${sign < 0 ? "-" : ""}${halfTex(q4)}`);
        const swapped = m$(unitTex(90 - d));
        const below = m$(unitTex(-d));
        const across = m$(unitTex(180 - d));
        const opposite = m$(unitTex(d + 180));
        return oneOf(
          rng,
          t(`Write the ${ordinal(n)} root of unity $${w}$ in the form $a + bi$.`, `把 ${n} 次单位根 $${w}$ 写成 $a + bi$ 的形式。`),
          m$(right),
          [swapped, below, across, opposite],
          walked(
            [
              [
                ["Find the angle", "求角"],
                t(`Simplify the exponent's angle:`, `化简指数中的角：`),
                [`\\frac{2\\pi \\cdot ${k}}{${n}} = ${radTex(d)}`],
              ],
              [
                ["Evaluate the cosine and sine", "求余弦和正弦"],
                t(`Apply Euler's formula at this special angle:`, `在这个特殊角处应用欧拉公式：`),
                [`${w} = \\cos\\left(${radTex(d)}\\right) + i\\sin\\left(${radTex(d)}\\right) = ${right}`],
              ],
            ],
            t(
              `A root of unity lies on the unit circle, so the squares of its parts must add to $1$:\n\n$$\\left(${partTex(c4, cs)}\\right)^{2} + \\left(${partTex(s4, ss)}\\right)^{2} = ${Q.of(c4, 4).toLatex()} + ${Q.of(s4, 4).toLatex()} = 1$$\n\nThe signs of the parts also match the position of the angle $${radTex(d)}$.`,
              `单位根在单位圆上，所以两部分的平方和必须是 $1$：\n\n$$\\left(${partTex(c4, cs)}\\right)^{2} + \\left(${partTex(s4, ss)}\\right)^{2} = ${Q.of(c4, 4).toLatex()} + ${Q.of(s4, 4).toLatex()} = 1$$\n\n两部分的符号也与角 $${radTex(d)}$ 的位置相符。`,
            ),
          ),
          [
            why(
              swapped,
              "The real and imaginary parts are swapped: the real part is the cosine of the angle.",
              "实部和虚部弄反了：实部是角的余弦。",
            ),
            why(
              below,
              "The imaginary part has the wrong sign: this is its mirror image in the real axis.",
              "虚部的符号错了：这是它关于实轴的对称点。",
            ),
            why(
              across,
              "The real part has the wrong sign: this is its mirror image in the imaginary axis.",
              "实部的符号错了：这是它关于虚轴的对称点。",
            ),
            why(
              opposite,
              "Both parts have the wrong sign: this point is opposite through the origin.",
              "两部分的符号都错了：这是它关于原点的对称点。",
            ),
          ],
        );
      },
    },
    {
      id: "counting-roots-of-unity",
      figure: precalculusDrawings4["the-roots-of-unity#counting-roots-of-unity"],
      title: t("Count roots of unity by location", "按位置统计单位根的个数"),
      explanation: t(
        "Since the $n$th roots of unity sit at the angles $0^{\\circ}, \\frac{360^{\\circ}}{n}, \\frac{2 \\cdot 360^{\\circ}}{n}, \\ldots$, their positions can be counted:\n\n- $1$ is always a root; $-1$ (at $180^{\\circ}$) is a root exactly when $n$ is even. So there are $2$ real roots when $n$ is even and $1$ when $n$ is odd.\n- The nonreal roots come in conjugate pairs, so half of them have a positive imaginary part.\n\nFor $n = 8$ the roots are at $0^{\\circ}, 45^{\\circ}, \\ldots, 315^{\\circ}$: $2$ are real, $3$ have a positive imaginary part, and $1$ lies strictly inside quadrant I.\n\nCheck: the $2$ real roots, the $3$ above the real axis and their $3$ conjugates below it make $8$.\n\n> **Watch out.** A root on an axis, such as $i$ or $-1$, lies in no quadrant. And $1$ is always one of the roots, at $k = 0$.",
        "$n$ 次单位根位于角 $0^{\\circ}, \\frac{360^{\\circ}}{n}, \\frac{2 \\cdot 360^{\\circ}}{n}, \\ldots$ 处，因此可以按位置计数：\n\n- $1$ 总是单位根；$-1$（位于 $180^{\\circ}$）是单位根当且仅当 $n$ 为偶数。所以 $n$ 为偶数时有 $2$ 个实根，$n$ 为奇数时有 $1$ 个。\n- 非实根成对共轭出现，所以其中一半的虚部为正。\n\n当 $n = 8$ 时，根位于 $0^{\\circ}, 45^{\\circ}, \\ldots, 315^{\\circ}$：$2$ 个是实数，$3$ 个虚部为正，$1$ 个严格位于第一象限内。\n\n检验：$2$ 个实根、实轴上方的 $3$ 个根与它们下方的 $3$ 个共轭根，合起来正是 $8$ 个。\n\n> **注意。** 在坐标轴上的根，如 $i$ 或 $-1$，不属于任何象限。$1$ 总是其中一个根，对应 $k = 0$。",
      ),
      generate(rng) {
        const n = rng.int(3, 14);
        const kind = rng.pick(["real", "upper", "first"] as const);
        const angles = Array.from({ length: n }, (_, k) => (360 * k) / n);
        const real = n % 2 === 0 ? 2 : 1;
        const upper = (n - real) / 2;
        const first = angles.filter((a) => a > 0 && a < 90).length;
        const answer = kind === "real" ? real : kind === "upper" ? upper : first;
        const what =
          kind === "real"
            ? t("are real numbers", "是实数")
            : kind === "upper"
              ? t("have a positive imaginary part", "虚部为正")
              : t("lie strictly inside quadrant I", "严格位于第一象限内");
        const list = angles
          .map((a) => (Number.isInteger(a) ? `${a}^{\\circ}` : `${Q.of(360 * angles.indexOf(a), n).toLatex()}^{\\circ}`))
          .join(", ");
        const rule =
          kind === "real"
            ? n % 2 === 0
              ? t(
                  "The real roots are the ones at $0^{\\circ}$ and $180^{\\circ}$, and both are in the list.",
                  "实根是位于 $0^{\\circ}$ 和 $180^{\\circ}$ 的根，两个都在表中。",
                )
              : t(
                  "The real roots would sit at $0^{\\circ}$ or $180^{\\circ}$, and only $0^{\\circ}$ is in the list.",
                  "实根只能位于 $0^{\\circ}$ 或 $180^{\\circ}$，表中只有 $0^{\\circ}$。",
                )
            : kind === "upper"
              ? t(
                  "A positive imaginary part means an angle strictly between $0^{\\circ}$ and $180^{\\circ}$.",
                  "虚部为正意味着角严格介于 $0^{\\circ}$ 与 $180^{\\circ}$ 之间。",
                )
              : t(
                  "Strictly inside quadrant I means an angle strictly between $0^{\\circ}$ and $90^{\\circ}$.",
                  "严格位于第一象限内意味着角严格介于 $0^{\\circ}$ 与 $90^{\\circ}$ 之间。",
                );
        const check =
          kind === "first"
            ? t(
                `The angle of $\\omega_{k}$ is below $90^{\\circ}$ exactly when $k < \\frac{${n}}{4}$.\n\nThe whole numbers $k \\ge 1$ below $\\frac{${n}}{4}$ number $${first}$, which agrees.`,
                `$\\omega_{k}$ 的角小于 $90^{\\circ}$ 当且仅当 $k < \\frac{${n}}{4}$。\n\n小于 $\\frac{${n}}{4}$ 的正整数 $k$ 有 $${first}$ 个，结果一致。`,
              )
            : t(
                `The nonreal roots pair up as conjugates, one above and one below the real axis.\n\nSo the real roots and twice the roots above the axis make up all of them: $${real} + 2 \\cdot ${upper} = ${n}$.`,
                `非实根成对共轭，一个在实轴上方，一个在下方。\n\n所以实根个数加上方根个数的两倍应等于总数：$${real} + 2 \\cdot ${upper} = ${n}$。`,
              );
        return numberProblem({
          prompt: t(`How many of the ${ordinal(n)} roots of unity ${what.en}?`, `${n} 次单位根中有多少个${what["zh-CN"]}？`),
          answer,
          form: "integer",
          wrong: [n, n - real, real === 2 ? 1 : 2, upper + 1, first + 1],
          solution: walked(
            [
              [
                ["List the arguments", "列出辐角"],
                t(`The ${ordinal(n)} roots of unity have these arguments:`, `${n} 次单位根的辐角如下：`),
                [list],
              ],
              [["Count", "计数"], t(`${rule.en} That gives $${answer}$.`, `${rule["zh-CN"]}所以共有 $${answer}$ 个。`)],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** omegaTex writes ω^e for 0 ≤ e < n. */
const omegaTex = (e: number) => (e === 0 ? "1" : e === 1 ? "\\omega" : `\\omega^{${e}}`);

/** propertiesOfRootsOfUnity covers powers, conjugates, sums and products of roots of unity. */
export const propertiesOfRootsOfUnity: TopicDef = {
  id: "properties-of-roots-of-unity",
  title: t("Properties of Roots of Unity", "单位根的性质"),
  summary: t(
    "Use the properties of the $n$th roots of unity: every root is a power of $\\omega = e^{2\\pi i/n}$, powers repeat with period $n$, the conjugate and reciprocal of $\\omega^k$ are $\\omega^{n-k}$, the roots sum to $0$, and $1 + \\omega + \\omega^2 = 0$ for a cube root of unity $\\omega \\ne 1$.",
    "运用 $n$ 次单位根的性质：每个根都是 $\\omega = e^{2\\pi i/n}$ 的幂，幂以 $n$ 为周期重复，$\\omega^k$ 的共轭与倒数为 $\\omega^{n-k}$，所有根之和为 $0$，且对三次单位根 $\\omega \\ne 1$ 有 $1 + \\omega + \\omega^2 = 0$。",
  ),
  prerequisites: ["the-roots-of-unity"],
  encompasses: [],
  xp: 16,
  intro: t(
    `The $n$th roots of unity are equally spaced around the unit circle, starting at $1$. For $n = 4$ they are $1$, $i$, $-1$ and $-i$, and each one is a power of the first root after $1$:

$$1 = i^{0}, \\qquad i = i^{1}, \\qquad -1 = i^{2}, \\qquad -i = i^{3}$$

Their sum is $1 + i + (-1) + (-i) = 0$.

Check: $i^{4} = 1$, so the next power, $i^{4}$, brings us back to the start.

In this lesson we use such facts for every $n$: powers of $\\omega = e^{\\frac{2\\pi i}{n}}$ repeat every $n$ steps, conjugates and reciprocals are powers too, the roots add to $0$, and the cube roots of unity satisfy $1 + \\omega + \\omega^{2} = 0$.`,
    `$n$ 次单位根从 $1$ 开始，等间隔地分布在单位圆上。当 $n = 4$ 时，它们是 $1$、$i$、$-1$ 和 $-i$，每一个都是 $1$ 之后第一个根的幂：

$$1 = i^{0}, \\qquad i = i^{1}, \\qquad -1 = i^{2}, \\qquad -i = i^{3}$$

它们的和是 $1 + i + (-1) + (-i) = 0$。

检验：$i^{4} = 1$，所以再下一个幂 $i^{4}$ 又回到起点。

这节课我们对任意 $n$ 运用这些事实：$\\omega = e^{\\frac{2\\pi i}{n}}$ 的幂每 $n$ 次重复一次，共轭与倒数也是它的幂，全部根之和为 $0$，三次单位根满足 $1 + \\omega + \\omega^{2} = 0$。`,
  ),
  knowledgePoints: [
    {
      id: "powers-and-conjugates-of-a-primitive-root",
      title: t("Simplify powers, conjugates and reciprocals", "化简幂、共轭与倒数"),
      explanation: t(
        "Let $\\omega = e^{\\frac{2\\pi i}{n}}$. The $n$th roots of unity are $1, \\omega, \\omega^{2}, \\ldots, \\omega^{n-1}$, and since $\\omega^{n} = 1$:\n\n- powers repeat every $n$ steps: $\\omega^{m} = \\omega^{r}$ where $r$ is the remainder of $m$ divided by $n$;\n- $|\\omega^{k}| = 1$, so the conjugate equals the reciprocal: $\\overline{\\omega^{k}} = \\frac{1}{\\omega^{k}} = \\omega^{n-k}$.\n\nFor $n = 7$: $\\omega^{23} = \\omega^{2}$ because $23 = 3 \\cdot 7 + 2$, and $\\overline{\\omega^{3}} = \\omega^{4}$.\n\nCheck: $\\omega^{3} \\cdot \\omega^{4} = \\omega^{7} = 1$, so $\\omega^{4}$ is indeed the reciprocal of $\\omega^{3}$.\n\n> **Watch out.** The power left over is the **remainder** of $m$ divided by $n$, not the quotient: $\\omega^{23} = \\omega^{2}$, not $\\omega^{3}$. The conjugate of $\\omega^{k}$ is $\\omega^{n-k}$, not $\\omega^{k}$ again.",
        "设 $\\omega = e^{\\frac{2\\pi i}{n}}$。$n$ 次单位根为 $1, \\omega, \\omega^{2}, \\ldots, \\omega^{n-1}$，又因为 $\\omega^{n} = 1$：\n\n- 幂每隔 $n$ 次重复一次：$\\omega^{m} = \\omega^{r}$，其中 $r$ 是 $m$ 除以 $n$ 的余数；\n- $|\\omega^{k}| = 1$，所以共轭等于倒数：$\\overline{\\omega^{k}} = \\frac{1}{\\omega^{k}} = \\omega^{n-k}$。\n\n当 $n = 7$ 时：因为 $23 = 3 \\cdot 7 + 2$，所以 $\\omega^{23} = \\omega^{2}$；$\\overline{\\omega^{3}} = \\omega^{4}$。\n\n检验：$\\omega^{3} \\cdot \\omega^{4} = \\omega^{7} = 1$，所以 $\\omega^{4}$ 确实是 $\\omega^{3}$ 的倒数。\n\n> **注意。** 剩下的指数是 $m$ 除以 $n$ 的**余数**，不是商：$\\omega^{23} = \\omega^{2}$，而不是 $\\omega^{3}$。$\\omega^{k}$ 的共轭是 $\\omega^{n-k}$，而不是 $\\omega^{k}$ 本身。",
      ),
      generate(rng) {
        const n = rng.int(5, 12);
        const kind = rng.pick(["power", "conjugate", "reciprocal"] as const);
        const w = `\\omega = e^{\\frac{2\\pi i}{${n}}}`;
        const mod = (e: number) => ((e % n) + n) % n;
        const options = new Map<number, readonly [string, string]>();
        const offer = (e: number, en: string, zh: string) => {
          if (!options.has(mod(e))) options.set(mod(e), [en, zh]);
        };
        let expr: string;
        let answer: number;
        let solution: Text;
        if (kind === "power") {
          const q = rng.int(1, 3);
          const r = rng.int(1, n - 1);
          const m = q * n + r;
          answer = r;
          expr = `\\omega^{${m}}`;
          solution = walked(
            [
              [
                ["Divide the exponent", "用除法拆分指数"],
                t(`Find the quotient and the remainder:`, `求商和余数：`),
                [`${m} = ${q} \\cdot ${n} + ${r}`],
              ],
              [
                ["Remove the full cycles", "去掉完整的周期"],
                t(`Each factor $\\omega^{${n}}$ equals $1$:`, `每个因子 $\\omega^{${n}}$ 都等于 $1$：`),
                [`\\omega^{${m}} = \\left(\\omega^{${n}}\\right)^{${q}}\\omega^{${r}} = ${omegaTex(r)}`],
              ],
            ],
            t(
              `Compare arguments instead. The argument of $\\omega^{${m}}$ is\n\n$$\\frac{2\\pi \\cdot ${m}}{${n}} = ${q} \\cdot 2\\pi + \\frac{2\\pi \\cdot ${r}}{${n}}$$\n\nThat is $${q}$ full turn${q === 1 ? "" : "s"} plus the argument of $${omegaTex(r)}$, so the two numbers are equal.`,
              `改为比较辐角。$\\omega^{${m}}$ 的辐角是\n\n$$\\frac{2\\pi \\cdot ${m}}{${n}} = ${q} \\cdot 2\\pi + \\frac{2\\pi \\cdot ${r}}{${n}}$$\n\n即 $${q}$ 整圈再加上 $${omegaTex(r)}$ 的辐角，所以两数相等。`,
            ),
          );
          offer(
            q,
            `This uses the quotient $${q}$ of $${m} \\div ${n}$. The power left over is the remainder, $${r}$.`,
            `这里用的是 $${m} \\div ${n}$ 的商 $${q}$。剩下的指数应是余数 $${r}$。`,
          );
          offer(
            n - r,
            `This is $\\omega^{${n} - ${r}}$, the conjugate of $${omegaTex(r)}$, not $${expr}$ itself.`,
            `这是 $\\omega^{${n} - ${r}}$，即 $${omegaTex(r)}$ 的共轭，而不是 $${expr}$ 本身。`,
          );
          offer(
            r + 1,
            `The remainder of $${m} \\div ${n}$ is $${r}$, not $${r + 1}$.`,
            `$${m} \\div ${n}$ 的余数是 $${r}$，不是 $${r + 1}$。`,
          );
          offer(
            r - 1,
            `The remainder of $${m} \\div ${n}$ is $${r}$, not $${r - 1}$.`,
            `$${m} \\div ${n}$ 的余数是 $${r}$，不是 $${r - 1}$。`,
          );
          offer(
            0,
            `A power of $\\omega$ is $1$ only when $${n}$ divides the exponent, and $${n}$ does not divide $${m}$.`,
            `只有当 $${n}$ 整除指数时 $\\omega$ 的幂才是 $1$，而 $${n}$ 不整除 $${m}$。`,
          );
        } else {
          const m = rng.int(2, n - 1);
          answer = n - m;
          const name = kind === "conjugate" ? t("conjugate", "共轭") : t("reciprocal", "倒数");
          expr = kind === "conjugate" ? `\\overline{\\omega^{${m}}}` : `\\frac{1}{\\omega^{${m}}}`;
          const first: Step =
            kind === "conjugate"
              ? [
                  ["Turn the conjugate into a reciprocal", "把共轭化为倒数"],
                  t(`Since $|\\omega^{${m}}| = 1$, the conjugate equals the reciprocal:`, `因为 $|\\omega^{${m}}| = 1$，共轭等于倒数：`),
                  [`\\overline{\\omega^{${m}}} = \\frac{1}{\\omega^{${m}}}`],
                ]
              : [
                  ["Write 1 as a power", "把 1 写成幂"],
                  t(`Since $\\omega^{${n}} = 1$, replace the $1$ on top:`, `因为 $\\omega^{${n}} = 1$，把分子的 $1$ 换掉：`),
                  [`\\frac{1}{\\omega^{${m}}} = \\frac{\\omega^{${n}}}{\\omega^{${m}}}`],
                ];
          solution = walked(
            [
              first,
              [
                ["Subtract the exponents", "指数相减"],
                kind === "conjugate"
                  ? t(`Write $1$ as $\\omega^{${n}}$ and subtract the exponents:`, `把 $1$ 写成 $\\omega^{${n}}$，再把指数相减：`)
                  : t(`Divide powers of $\\omega$ by subtracting exponents:`, `同底数幂相除，指数相减：`),
                [
                  `${kind === "conjugate" ? `\\frac{1}{\\omega^{${m}}} = ` : ""}\\frac{\\omega^{${n}}}{\\omega^{${m}}} = \\omega^{${n} - ${m}} = ${omegaTex(answer)}`,
                ],
              ],
            ],
            t(
              `Multiply the answer by $\\omega^{${m}}$:\n\n$$\\omega^{${m}} \\cdot ${omegaTex(answer)} = \\omega^{${n}} = 1$$\n\nSo $${omegaTex(answer)}$ is the reciprocal of $\\omega^{${m}}$, and for a number on the unit circle the reciprocal is also the conjugate.`,
              `用 $\\omega^{${m}}$ 乘答案：\n\n$$\\omega^{${m}} \\cdot ${omegaTex(answer)} = \\omega^{${n}} = 1$$\n\n所以 $${omegaTex(answer)}$ 是 $\\omega^{${m}}$ 的倒数；对单位圆上的数，倒数也就是共轭。`,
            ),
          );
          offer(
            m,
            `This is $\\omega^{${m}}$ itself. Its ${name.en} lies at the mirror position, $\\omega^{${n} - ${m}}$.`,
            `这就是 $\\omega^{${m}}$ 本身。它的${name["zh-CN"]}在对称的位置 $\\omega^{${n} - ${m}}$。`,
          );
          offer(
            answer + 1,
            `The exponent is $${n} - ${m} = ${answer}$, not $${answer + 1}$.`,
            `指数是 $${n} - ${m} = ${answer}$，不是 $${answer + 1}$。`,
          );
          offer(
            answer - 1,
            `The exponent is $${n} - ${m} = ${answer}$, not $${answer - 1}$.`,
            `指数是 $${n} - ${m} = ${answer}$，不是 $${answer - 1}$。`,
          );
          offer(
            0,
            `Only the product $\\omega^{${m}} \\cdot \\omega^{${answer}}$ equals $1$. The ${name.en} itself is a root other than $1$.`,
            `只有乘积 $\\omega^{${m}} \\cdot \\omega^{${answer}}$ 才等于 $1$。${name["zh-CN"]}本身是 $1$ 以外的根。`,
          );
        }
        const wrong = [...options].filter(([e]) => e !== answer).slice(0, 3);
        return oneOf(
          rng,
          t(
            `Let $${w}$. Write $${expr}$ as $1$ or as a power $\\omega^{k}$ with $1 \\le k < ${n}$.`,
            `设 $${w}$。把 $${expr}$ 写成 $1$ 或幂 $\\omega^{k}$（$1 \\le k < ${n}$）的形式。`,
          ),
          m$(omegaTex(answer)),
          wrong.map(([e]) => m$(omegaTex(e))),
          solution,
          wrong.map(([e, [en, zh]]) => why(m$(omegaTex(e)), en, zh)),
        );
      },
    },
    {
      id: "sums-and-products-of-roots-of-unity",
      title: t("Sums and products of all the roots of unity", "全部单位根的和与积"),
      explanation: t(
        "The $n$th roots of unity are the roots of $z^{n} - 1 = 0$. The coefficient of $z^{n-1}$ is $0$, so by Vieta's formulas their **sum is $0$** (for $n \\ge 2$), and their **product is $(-1)^{n+1}$**. Equivalently, $1 + \\omega + \\omega^{2} + \\cdots + \\omega^{n-1} = \\frac{\\omega^{n} - 1}{\\omega - 1} = 0$, so the roots other than $1$ sum to $-1$.\n\nThe $m$th powers of all the roots sum to $n$ when $n$ divides $m$ (every power is $1$), and to $0$ otherwise (they are the same roots in another order, possibly repeated evenly).\n\nFor example, the fourth roots of unity $1, i, -1, -i$ sum to $0$, and their product is $1 \\cdot i \\cdot (-1) \\cdot (-i) = -1 = (-1)^{5}$. Check: their squares are $1, -1, 1, -1$, which sum to $0$, as $4$ does not divide $2$.\n\n> **Watch out.** The product is $-1$ when $n$ is even, not always $1$. The sum of all the roots is $0$, but without the root $1$ it is $-1$.",
        "$n$ 次单位根是 $z^{n} - 1 = 0$ 的根。$z^{n-1}$ 的系数为 $0$，由韦达定理，它们的**和为 $0$**（$n \\ge 2$），**积为 $(-1)^{n+1}$**。等价地，$1 + \\omega + \\omega^{2} + \\cdots + \\omega^{n-1} = \\frac{\\omega^{n} - 1}{\\omega - 1} = 0$，所以除 $1$ 以外的根之和为 $-1$。\n\n所有根的 $m$ 次幂之和：当 $n$ 整除 $m$ 时为 $n$（每个幂都是 $1$），否则为 $0$（它们是同一组根的均匀重复排列）。\n\n例如，四次单位根 $1, i, -1, -i$ 之和为 $0$，积为 $1 \\cdot i \\cdot (-1) \\cdot (-i) = -1 = (-1)^{5}$。检验：它们的平方是 $1, -1, 1, -1$，和为 $0$，因为 $4$ 不整除 $2$。\n\n> **注意。** 当 $n$ 为偶数时积是 $-1$，并不总是 $1$。全部根之和为 $0$，但去掉根 $1$ 后和为 $-1$。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const kind = rng.pick(["sum", "product", "others", "powers", "powers"] as const);
        const series = `1 + \\omega + \\omega^{2} + \\cdots + \\omega^{${n - 1}}`;
        const omega = t(
          `Let $\\omega = e^{\\frac{2\\pi i}{${n}}}$, so the roots are $1, \\omega, \\ldots, \\omega^{${n - 1}}$.`,
          `令 $\\omega = e^{\\frac{2\\pi i}{${n}}}$，则这些根是 $1, \\omega, \\ldots, \\omega^{${n - 1}}$。`,
        );
        if (kind === "powers") {
          const m = rng.bool(0.4) ? n * rng.int(1, 4) : rng.int(2, 40);
          const answer = m % n === 0 ? n : 0;
          const prompt = t(
            `Let $\\omega_{0}, \\omega_{1}, \\ldots, \\omega_{${n - 1}}$ be the ${ordinal(n)} roots of unity. Find $\\omega_{0}^{${m}} + \\omega_{1}^{${m}} + \\cdots + \\omega_{${n - 1}}^{${m}}$.`,
            `设 $\\omega_{0}, \\omega_{1}, \\ldots, \\omega_{${n - 1}}$ 为 ${n} 次单位根。求 $\\omega_{0}^{${m}} + \\omega_{1}^{${m}} + \\cdots + \\omega_{${n - 1}}^{${m}}$。`,
          );
          if (answer === n) {
            const j = m / n;
            return numberProblem({
              prompt,
              answer,
              form: "integer",
              wrong: [0, 1, -1, m],
              solution: walked(
                [
                  [
                    ["Use the definition of a root of unity", "用单位根的定义"],
                    t(
                      `Every root satisfies $\\omega_{k}^{${n}} = 1$, and $${m} = ${j} \\cdot ${n}$:`,
                      `每个根都满足 $\\omega_{k}^{${n}} = 1$，且 $${m} = ${j} \\cdot ${n}$：`,
                    ),
                    [`\\omega_{k}^{${m}} = \\left(\\omega_{k}^{${n}}\\right)^{${j}} = 1`],
                  ],
                  [
                    ["Add", "相加"],
                    t(`The sum has $${n}$ terms, each equal to $1$, so it is $${n}$.`, `和共有 $${n}$ 项，每项都是 $1$，所以和为 $${n}$。`),
                  ],
                ],
                t(
                  `Use arguments instead. The root $\\omega_{k}$ has argument $\\frac{2\\pi k}{${n}}$, so its ${ordinal(m)} power has argument $2\\pi k \\cdot ${j}$.\n\nThat is a whole number of turns, so each power is $1$ and the $${n}$ of them add to $${n}$.`,
                  `改用辐角。根 $\\omega_{k}$ 的辐角是 $\\frac{2\\pi k}{${n}}$，所以它的 $${m}$ 次幂的辐角是 $2\\pi k \\cdot ${j}$。\n\n这是整数圈，所以每个幂都是 $1$，$${n}$ 个相加得 $${n}$。`,
                ),
              ),
            });
          }
          return numberProblem({
            prompt,
            answer,
            form: "integer",
            wrong: [n, 1, -1, m],
            solution: walked(
              [
                [
                  ["Write the sum as a geometric series", "写成等比数列"],
                  t(
                    `${omega.en} Then $\\omega_{k}^{${m}} = \\left(\\omega^{${m}}\\right)^{k}$, so the sum is a geometric series with ratio $\\omega^{${m}}$. This ratio is not $1$, since $${n}$ does not divide $${m}$.`,
                    `${omega["zh-CN"]}于是 $\\omega_{k}^{${m}} = \\left(\\omega^{${m}}\\right)^{k}$，和是公比为 $\\omega^{${m}}$ 的等比数列。因为 $${n}$ 不整除 $${m}$，公比不是 $1$。`,
                  ),
                ],
                [
                  ["Sum the series", "求和"],
                  t(`Use the formula for a geometric sum and $\\omega^{${n}} = 1$:`, `用等比数列求和公式，并利用 $\\omega^{${n}} = 1$：`),
                  [
                    `\\frac{\\left(\\omega^{${m}}\\right)^{${n}} - 1}{\\omega^{${m}} - 1} = \\frac{\\left(\\omega^{${n}}\\right)^{${m}} - 1}{\\omega^{${m}} - 1} = \\frac{1 - 1}{\\omega^{${m}} - 1} = 0`,
                  ],
                ],
              ],
              t(
                `Call the sum $S$. Multiplying every term by $\\omega^{${m}}$ moves each term to the next one, and the last term moves to $\\left(\\omega^{${m}}\\right)^{${n}} = 1$, the first.\n\nSo $\\omega^{${m}}S = S$, and since $\\omega^{${m}} \\ne 1$ this forces $S = 0$.`,
                `设和为 $S$。每一项乘以 $\\omega^{${m}}$ 就变成下一项，最后一项变成 $\\left(\\omega^{${m}}\\right)^{${n}} = 1$，即第一项。\n\n所以 $\\omega^{${m}}S = S$，又因为 $\\omega^{${m}} \\ne 1$，只能 $S = 0$。`,
              ),
            ),
          });
        }
        if (kind === "product") {
          const answer = n % 2 === 0 ? -1 : 1;
          return numberProblem({
            prompt: t(`Find the product of all the ${ordinal(n)} roots of unity.`, `求所有 ${n} 次单位根的乘积。`),
            answer,
            form: "integer",
            wrong: [-answer, 0, n],
            solution: walked(
              [
                [
                  ["Write the polynomial", "写出多项式"],
                  t(
                    `The roots are the solutions of $z^{${n}} - 1 = 0$, which has degree $${n}$, leading coefficient $1$ and constant term $-1$.`,
                    `这些根是 $z^{${n}} - 1 = 0$ 的解，它的次数是 $${n}$，首项系数是 $1$，常数项是 $-1$。`,
                  ),
                ],
                [
                  ["Apply Vieta's formulas", "应用韦达定理"],
                  t(`The product of the roots is $(-1)^{${n}}$ times the constant term:`, `根之积等于 $(-1)^{${n}}$ 乘以常数项：`),
                  [`(-1)^{${n}} \\cdot (-1) = (-1)^{${n + 1}} = ${answer}`],
                ],
              ],
              t(
                `Pair the roots instead. Each nonreal root pairs with its conjugate, and the product of a pair is $|\\omega|^{2} = 1$.\n\nWhat is left are the real roots: ${n % 2 === 0 ? `$1$ and $-1$, with product $-1$` : `only $1$`}. So the product is $${answer}$.`,
                `改为把根配对。每个非实根与它的共轭配对，每对的积是 $|\\omega|^{2} = 1$。\n\n剩下的是实根：${n % 2 === 0 ? `$1$ 和 $-1$，积为 $-1$` : `只有 $1$`}。所以乘积是 $${answer}$。`,
              ),
            ),
          });
        }
        if (kind === "sum") {
          return numberProblem({
            prompt: t(`Find the sum of all the ${ordinal(n)} roots of unity.`, `求所有 ${n} 次单位根之和。`),
            answer: 0,
            form: "integer",
            wrong: [1, -1, n],
            solution: walked(
              [
                [
                  ["Write the polynomial", "写出多项式"],
                  t(
                    `The roots are the solutions of $z^{${n}} - 1 = 0$, in which the coefficient of $z^{${n - 1}}$ is $0$.`,
                    `这些根是 $z^{${n}} - 1 = 0$ 的解，其中 $z^{${n - 1}}$ 的系数为 $0$。`,
                  ),
                ],
                [
                  ["Apply Vieta's formulas", "应用韦达定理"],
                  t(`The sum of the roots is minus that coefficient, so it is $0$.`, `根之和等于这个系数的相反数，所以是 $0$。`),
                ],
              ],
              t(
                `${omega.en} The sum is a geometric series with ratio $\\omega \\ne 1$:\n\n$$${series} = \\frac{\\omega^{${n}} - 1}{\\omega - 1} = \\frac{1 - 1}{\\omega - 1} = 0$$\n\nBoth routes give $0$.`,
                `${omega["zh-CN"]}这个和是公比为 $\\omega \\ne 1$ 的等比数列：\n\n$$${series} = \\frac{\\omega^{${n}} - 1}{\\omega - 1} = \\frac{1 - 1}{\\omega - 1} = 0$$\n\n两种方法都得 $0$。`,
              ),
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Let $\\omega = e^{\\frac{2\\pi i}{${n}}}$. Find $\\omega + \\omega^{2} + \\cdots + \\omega^{${n - 1}}$.`,
            `设 $\\omega = e^{\\frac{2\\pi i}{${n}}}$。求 $\\omega + \\omega^{2} + \\cdots + \\omega^{${n - 1}}$。`,
          ),
          answer: -1,
          form: "integer",
          wrong: [0, 1, n - 1],
          solution: walked(
            [
              [
                ["Add all the roots", "把全部根相加"],
                t(`All ${ordinal(n)} roots of unity together sum to $0$:`, `全部 ${n} 次单位根之和为 $0$：`),
                [`${series} = 0`],
              ],
              [
                ["Remove the root 1", "去掉根 1"],
                t(`The sum asked for leaves out the term $1$, so it is $0 - 1 = -1$.`, `所求的和少了 $1$ 这一项，所以是 $0 - 1 = -1$。`),
              ],
            ],
            t(
              `Sum the geometric series directly. It has first term $\\omega$, ratio $\\omega$ and $${n - 1}$ terms:\n\n$$\\frac{\\omega\\left(\\omega^{${n - 1}} - 1\\right)}{\\omega - 1} = \\frac{\\omega^{${n}} - \\omega}{\\omega - 1} = \\frac{1 - \\omega}{\\omega - 1} = -1$$\n\nBoth routes give $-1$.`,
              `直接对等比数列求和。首项为 $\\omega$，公比为 $\\omega$，共 $${n - 1}$ 项：\n\n$$\\frac{\\omega\\left(\\omega^{${n - 1}} - 1\\right)}{\\omega - 1} = \\frac{\\omega^{${n}} - \\omega}{\\omega - 1} = \\frac{1 - \\omega}{\\omega - 1} = -1$$\n\n两种方法都得 $-1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "identities-of-the-cube-roots-of-unity",
      title: t("Use the identities of the cube roots of unity", "运用三次单位根的恒等式"),
      explanation: t(
        "Let $\\omega$ be a nonreal cube root of unity. Then $\\omega^{3} = 1$ and\n\n$$1 + \\omega + \\omega^{2} = 0, \\qquad \\overline{\\omega} = \\omega^{2}$$\n\nThese identities simplify expressions without rectangular forms. For example $3 + 5\\omega + 5\\omega^{2} = 3 + 5(\\omega + \\omega^{2}) = 3 - 5 = -2$, and multiplying out with $\\omega^{3} = 1$:\n\n$$(a + b\\omega + c\\omega^{2})(a + b\\omega^{2} + c\\omega) = a^{2} + b^{2} + c^{2} - ab - bc - ca$$\n\nCheck: with $\\omega = -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$ and $\\omega^{2} = -\\frac{1}{2} - \\frac{\\sqrt{3}}{2}i$, the imaginary parts of $\\omega + \\omega^{2}$ cancel and the real parts give $-1$, so $1 + \\omega + \\omega^{2} = 0$.\n\n> **Watch out.** It is $\\omega + \\omega^{2}$ that equals $-1$; the sum is $0$ only once the $1$ is included. Replace $\\omega^{3}$ by $1$ and $\\omega^{4}$ by $\\omega$ before collecting terms.",
        "设 $\\omega$ 是一个非实数的三次单位根，则 $\\omega^{3} = 1$，且\n\n$$1 + \\omega + \\omega^{2} = 0, \\qquad \\overline{\\omega} = \\omega^{2}$$\n\n利用这些恒等式，不必化为代数形式即可化简。例如 $3 + 5\\omega + 5\\omega^{2} = 3 + 5(\\omega + \\omega^{2}) = 3 - 5 = -2$；再利用 $\\omega^{3} = 1$ 展开可得：\n\n$$(a + b\\omega + c\\omega^{2})(a + b\\omega^{2} + c\\omega) = a^{2} + b^{2} + c^{2} - ab - bc - ca$$\n\n检验：取 $\\omega = -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$，$\\omega^{2} = -\\frac{1}{2} - \\frac{\\sqrt{3}}{2}i$，$\\omega + \\omega^{2}$ 的虚部相消，实部之和为 $-1$，所以 $1 + \\omega + \\omega^{2} = 0$。\n\n> **注意。** 等于 $-1$ 的是 $\\omega + \\omega^{2}$；只有加上 $1$ 后和才是 $0$。合并同类项前，先把 $\\omega^{3}$ 换成 $1$，$\\omega^{4}$ 换成 $\\omega$。",
      ),
      generate(rng) {
        const paren = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        if (rng.bool(0.35)) {
          const a = rng.nonZero(-9, 9);
          let b = rng.nonZero(-9, 9);
          if (b === a) b = a === 9 ? -9 : a + 1;
          const expr = poly([a, ""], [b, "\\omega"], [b, "\\omega^{2}"]);
          return numberProblem({
            prompt: t(
              `Let $\\omega$ be a nonreal cube root of unity. Evaluate $${expr}$.`,
              `设 $\\omega$ 是一个非实数的三次单位根。求 $${expr}$ 的值。`,
            ),
            answer: a - b,
            form: "integer",
            wrong: [a + b, a + 2 * b, a],
            solution: walked(
              [
                [
                  ["Group the two powers", "合并两个幂"],
                  t(`The last two terms share the factor $${b}$:`, `后两项有公因数 $${b}$：`),
                  [`${expr} = ${a} + ${paren(b)}\\left(\\omega + \\omega^{2}\\right)`],
                ],
                [
                  ["Use the identity", "利用恒等式"],
                  t(`Since $\\omega + \\omega^{2} = -1$:`, `因为 $\\omega + \\omega^{2} = -1$：`),
                  [`${a} + ${paren(b)} \\cdot (-1) = ${a - b}`],
                ],
              ],
              t(
                `Use the rectangular forms of the two roots:\n\n$$\\omega = -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i, \\qquad \\omega^{2} = -\\frac{1}{2} - \\frac{\\sqrt{3}}{2}i$$\n\nThe imaginary parts of $${paren(b)}\\omega$ and $${paren(b)}\\omega^{2}$ cancel.\n\nTheir real parts are each $${paren(b)} \\cdot \\left(-\\frac{1}{2}\\right)$, which together make $${-b}$. Adding $${a}$ gives $${a - b}$ again.`,
                `用两个根的代数形式：\n\n$$\\omega = -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i, \\qquad \\omega^{2} = -\\frac{1}{2} - \\frac{\\sqrt{3}}{2}i$$\n\n$${paren(b)}\\omega$ 与 $${paren(b)}\\omega^{2}$ 的虚部相消。\n\n它们的实部各为 $${paren(b)} \\cdot \\left(-\\frac{1}{2}\\right)$，合起来是 $${-b}$。再加上 $${a}$，同样得 $${a - b}$。`,
              ),
            ),
          });
        }
        const [a, b, c] = rng.sample([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 3) as [number, number, number];
        const f1 = poly([a, ""], [b, "\\omega"], [c, "\\omega^{2}"]);
        const f2 = poly([a, ""], [b, "\\omega^{2}"], [c, "\\omega"]);
        const answer = a * a + b * b + c * c - a * b - b * c - c * a;
        const u = 2 * a - b - c;
        const v = b - c;
        return numberProblem({
          prompt: t(
            `Let $\\omega$ be a nonreal cube root of unity. Evaluate $\\left(${f1}\\right)\\left(${f2}\\right)$.`,
            `设 $\\omega$ 是一个非实数的三次单位根。求 $\\left(${f1}\\right)\\left(${f2}\\right)$ 的值。`,
          ),
          answer,
          form: "integer",
          wrong: [a * a + b * b + c * c + a * b + b * c + c * a, a * a + b * b + c * c, (a + b + c) ** 2],
          solution: walked(
            [
              [
                ["Expand the product", "展开乘积"],
                t(
                  `Multiplying out, the squares $a^{2}, b^{2}, c^{2}$ come with $\\omega^{3} = 1$, and the cross terms collect as $(ab + bc + ca)(\\omega + \\omega^{2}) = -(ab + bc + ca)$. So the product is $a^{2} + b^{2} + c^{2} - ab - bc - ca$ with $a = ${a}$, $b = ${b}$ and $c = ${c}$.`,
                  `展开后，平方项 $a^{2}, b^{2}, c^{2}$ 带有 $\\omega^{3} = 1$，交叉项合并为 $(ab + bc + ca)(\\omega + \\omega^{2}) = -(ab + bc + ca)$。所以乘积是 $a^{2} + b^{2} + c^{2} - ab - bc - ca$，其中 $a = ${a}$，$b = ${b}$，$c = ${c}$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(`Put in the numbers:`, `代入数值：`),
                [`${a * a} + ${b * b} + ${c * c} - ${paren(a * b)} - ${paren(b * c)} - ${paren(c * a)} = ${answer}`],
              ],
            ],
            t(
              `Since $\\overline{\\omega} = \\omega^{2}$, the second factor is the conjugate of the first, so the product is $\\left|${f1}\\right|^{2}$. In rectangular form the first factor has real part $${Q.of(u, 2).toLatex()}$ and imaginary part $${surdLatex(surd(Q.zero, Q.of(v, 2), 3n))}$.\n\nThe squared modulus is\n\n$$\\frac{${paren(u)}^{2} + 3 \\cdot ${paren(v)}^{2}}{4} = \\frac{${u * u + 3 * v * v}}{4} = ${answer}$$\n\nThis matches.`,
              `因为 $\\overline{\\omega} = \\omega^{2}$，第二个因式是第一个的共轭，所以乘积是 $\\left|${f1}\\right|^{2}$。写成代数形式，第一个因式的实部是 $${Q.of(u, 2).toLatex()}$，虚部是 $${surdLatex(surd(Q.zero, Q.of(v, 2), 3n))}$。\n\n模的平方是\n\n$$\\frac{${paren(u)}^{2} + 3 \\cdot ${paren(v)}^{2}}{4} = \\frac{${u * u + 3 * v * v}}{4} = ${answer}$$\n\n结果一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** squareRootsOfComplexNumbers covers finding the two square roots of a complex number. */
export const squareRootsOfComplexNumbers: TopicDef = {
  id: "square-roots-of-complex-numbers",
  title: t("Square Roots of Complex Numbers", "复数的平方根"),
  summary: t(
    "Find the two square roots of a complex number, either by equating real and imaginary parts of (x + yi)² = a + bi, or in polar form as √r cis(θ/2) and √r cis(θ/2 + 180°).",
    "求复数的两个平方根：或令 (x + yi)² = a + bi 并比较实部与虚部，或在三角形式下取 √r cis(θ/2) 与 √r cis(θ/2 + 180°)。",
  ),
  prerequisites: ["the-roots-of-unity", "solving-equations-by-equating-real-and-imaginary-parts"],
  encompasses: [
    { topic: "solving-equations-by-equating-real-and-imaginary-parts", weight: 0.4 },
    { topic: "de-moivres-theorem", weight: 0.3 },
  ],
  xp: 18,
  intro: t(
    `The square roots of unity are the solutions of $z^{2} = 1$: the number $1$ and its opposite $-1$. Every nonzero complex number has two square roots in the same way, one the opposite of the other. For example, $-1$ has the square roots $i$ and $-i$:

$$i^{2} = -1, \\qquad (-i)^{2} = i^{2} = -1$$

Check: in polar form $i = \\text{cis}\\,90^{\\circ}$, and doubling its angle gives $\\text{cis}\\,180^{\\circ} = -1$.

In this lesson we find both square roots of any complex number, either by equating real and imaginary parts or by halving the argument in polar form.`,
    `单位的平方根是 $z^{2} = 1$ 的解：$1$ 和它的相反数 $-1$。同样，每个非零复数都有两个平方根，它们互为相反数。例如，$-1$ 的平方根是 $i$ 和 $-i$：

$$i^{2} = -1, \\qquad (-i)^{2} = i^{2} = -1$$

检验：在三角形式下 $i = \\text{cis}\\,90^{\\circ}$，把它的角加倍得 $\\text{cis}\\,180^{\\circ} = -1$。

这节课我们求任意复数的两个平方根，方法是比较实部与虚部，或者在三角形式下把辐角减半。`,
  ),
  knowledgePoints: [
    {
      id: "square-roots-by-equating-parts",
      title: t("Find square roots by equating parts", "比较实部与虚部求平方根"),
      explanation: t(
        "To find $\\sqrt{a + bi}$, set $(x + yi)^{2} = a + bi$ with real $x$ and $y$. Expanding gives $x^{2} - y^{2} + 2xyi$, so\n\n$$x^{2} - y^{2} = a, \\qquad 2xy = b$$\n\nAlso $|x + yi|^{2} = |a + bi|$ gives $x^{2} + y^{2} = \\sqrt{a^{2} + b^{2}}$. Adding and subtracting find $x^{2}$ and $y^{2}$; the sign of $b$ tells whether $x$ and $y$ have the same sign. For $-5 + 12i$: $x^{2} - y^{2} = -5$ and $x^{2} + y^{2} = 13$, so $x^{2} = 4$, $y^{2} = 9$, and $2xy = 12 > 0$ gives the roots $2 + 3i$ and $-2 - 3i$.\n\nCheck: $(2 + 3i)^{2} = 4 - 9 + 12i = -5 + 12i$.\n\n> **Watch out.** The sum $x^{2} + y^{2}$ is the modulus $\\sqrt{a^{2} + b^{2}}$, not $a^{2} + b^{2}$ itself. Choose the signs from $2xy = b$: $x$ and $y$ have the same sign when $b > 0$ and opposite signs when $b < 0$.",
        "求 $\\sqrt{a + bi}$ 时，设 $(x + yi)^{2} = a + bi$，其中 $x$、$y$ 为实数。展开得 $x^{2} - y^{2} + 2xyi$，所以\n\n$$x^{2} - y^{2} = a, \\qquad 2xy = b$$\n\n又由 $|x + yi|^{2} = |a + bi|$ 得 $x^{2} + y^{2} = \\sqrt{a^{2} + b^{2}}$。两式相加、相减求出 $x^{2}$ 与 $y^{2}$，再由 $b$ 的符号判断 $x$、$y$ 是否同号。对 $-5 + 12i$：$x^{2} - y^{2} = -5$，$x^{2} + y^{2} = 13$，所以 $x^{2} = 4$，$y^{2} = 9$，又 $2xy = 12 > 0$，两个平方根为 $2 + 3i$ 与 $-2 - 3i$。\n\n检验：$(2 + 3i)^{2} = 4 - 9 + 12i = -5 + 12i$。\n\n> **注意。** $x^{2} + y^{2}$ 等于模 $\\sqrt{a^{2} + b^{2}}$，而不是 $a^{2} + b^{2}$ 本身。符号由 $2xy = b$ 决定：$b > 0$ 时 $x$、$y$ 同号，$b < 0$ 时异号。",
      ),
      keyPrerequisites: ["solving-equations-by-equating-real-and-imaginary-parts"],
      generate(rng) {
        const x = rng.int(1, 7);
        const y = rng.nonZero(-7, 7);
        const a = x * x - y * y;
        const b = 2 * x * y;
        const w = cx(a, b);
        const s = x * x + y * y;
        const answer = cx(x, y);
        const pa = a < 0 ? `(${a})` : `${a}`;
        const py = y < 0 ? `(${y})` : `${y}`;
        return expressionProblem({
          prompt: t(
            `Find the square root of $${w}$ that has a positive real part. Write it in the form $a + bi$.`,
            `求 $${w}$ 的实部为正的那个平方根，写成 $a + bi$ 的形式。`,
          ),
          answer,
          simplified: true,
          wrong: [cx(-x, -y), cx(x, -y), cx(Math.abs(y), y < 0 ? -x : x), cx(a, 0)],
          solution: walked(
            [
              [
                ["Equate parts", "比较实部与虚部"],
                t(`Set $(x + yi)^{2} = ${w}$. The real and imaginary parts give`, `设 $(x + yi)^{2} = ${w}$，实部与虚部分别给出`),
                [`x^{2} - y^{2} = ${a}, \\qquad 2xy = ${b}`],
              ],
              [
                ["Use the modulus", "利用模"],
                t(`The modulus of $(x + yi)^{2}$ is $x^{2} + y^{2}$, so`, `$(x + yi)^{2}$ 的模是 $x^{2} + y^{2}$，所以`),
                [`x^{2} + y^{2} = \\sqrt{${a * a} + ${b * b}} = ${s}`],
              ],
              [
                ["Solve for x and y", "解出 x 与 y"],
                t(`Add and subtract the two equations for $x^{2}$ and $y^{2}$:`, `两式相加、相减求出 $x^{2}$ 与 $y^{2}$：`),
                [`x^{2} = \\frac{${s} + ${pa}}{2} = ${x * x}, \\qquad y^{2} = \\frac{${s} - ${pa}}{2} = ${y * y}`],
              ],
              [
                ["Choose the signs", "确定符号"],
                t(
                  `With $x > 0$ we get $x = ${x}$, and $2xy = ${b}$ then gives $y = ${y}$. So the root is $${answer}$, and the other root is its opposite, $${cx(-x, -y)}$.`,
                  `由 $x > 0$ 得 $x = ${x}$，再由 $2xy = ${b}$ 得 $y = ${y}$。所以所求的根是 $${answer}$，另一个根是它的相反数 $${cx(-x, -y)}$。`,
                ),
              ],
            ],
            t(
              `Square the answer directly:\n\n$$\\left(${answer}\\right)^{2} = ${x * x} - ${y * y} + 2 \\cdot ${x} \\cdot ${py}\\,i = ${w}$$\n\nThis is the number we started with.`,
              `直接把答案平方：\n\n$$\\left(${answer}\\right)^{2} = ${x * x} - ${y * y} + 2 \\cdot ${x} \\cdot ${py}\\,i = ${w}$$\n\n正是原来的数。`,
            ),
          ),
        });
      },
    },
    {
      id: "square-roots-in-polar-form",
      figure: precalculusDrawings4["square-roots-of-complex-numbers#square-roots-in-polar-form"],
      title: t("Find square roots in polar form", "在三角形式下求平方根"),
      explanation: t(
        "If $w = r\\,\\text{cis}\\,\\theta$, then by De Moivre's theorem $\\left(\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2}\\right)^{2} = w$. Adding $360^{\\circ}$ to $\\theta$ describes the same $w$ but halves to an angle $180^{\\circ}$ further on, so $w$ has exactly two square roots, which are opposite each other:\n\n$$\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2} \\qquad\\text{and}\\qquad \\sqrt{r}\\,\\text{cis}\\left(\\frac{\\theta}{2} + 180^{\\circ}\\right)$$\n\nFor $w = 9\\,\\text{cis}\\,100^{\\circ}$: $3\\,\\text{cis}\\,50^{\\circ}$ and $3\\,\\text{cis}\\,230^{\\circ}$.\n\nCheck: squaring $3\\,\\text{cis}\\,230^{\\circ}$ gives $9\\,\\text{cis}\\,460^{\\circ}$, and $460^{\\circ} - 360^{\\circ} = 100^{\\circ}$.\n\n> **Watch out.** The two square roots are $180^{\\circ}$ apart, not $90^{\\circ}$. Take the square root of the modulus and halve the argument; keeping $r$ or $\\theta$ unchanged gives a number whose square is not $w$.",
        "若 $w = r\\,\\text{cis}\\,\\theta$，由棣莫弗定理，$\\left(\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2}\\right)^{2} = w$。给 $\\theta$ 加上 $360^{\\circ}$ 表示的仍是同一个 $w$，但减半后的角多出 $180^{\\circ}$，所以 $w$ 恰有两个平方根，它们互为相反数：\n\n$$\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2} \\qquad\\text{和}\\qquad \\sqrt{r}\\,\\text{cis}\\left(\\frac{\\theta}{2} + 180^{\\circ}\\right)$$\n\n对 $w = 9\\,\\text{cis}\\,100^{\\circ}$：两个平方根为 $3\\,\\text{cis}\\,50^{\\circ}$ 与 $3\\,\\text{cis}\\,230^{\\circ}$。\n\n检验：把 $3\\,\\text{cis}\\,230^{\\circ}$ 平方得 $9\\,\\text{cis}\\,460^{\\circ}$，而 $460^{\\circ} - 360^{\\circ} = 100^{\\circ}$。\n\n> **注意。** 两个平方根相差 $180^{\\circ}$，而不是 $90^{\\circ}$。模要开平方，辐角要减半；若保留 $r$ 或 $\\theta$ 不变，所得的数平方后不是 $w$。",
      ),
      generate(rng) {
        const s = rng.int(2, 7);
        const R = s * s;
        const theta = rng.int(1, 179) * 2;
        const h = theta / 2;
        const pair = (m1: string, d1: number, m2: string, d2: number) =>
          t(`$${cisDeg(m1, d1)}$ and $${cisDeg(m2, d2)}$`, `$${cisDeg(m1, d1)}$ 和 $${cisDeg(m2, d2)}$`);
        const S = String(s);
        const quarter = pair(S, h, S, mod360(h + 90));
        const mirror = pair(S, h, S, mod360(-h));
        const unrooted = pair(String(R), h, String(R), h + 180);
        const unhalved = pair(S, theta, S, mod360(theta + 180));
        return oneOf(
          rng,
          t(`Find both square roots of $w = ${cisDeg(String(R), theta)}$.`, `求 $w = ${cisDeg(String(R), theta)}$ 的两个平方根。`),
          pair(S, h, S, h + 180),
          [quarter, mirror, unrooted, unhalved],
          walked(
            [
              [
                ["Take the root of the modulus", "模开平方"],
                t(`Each square root has modulus`, `每个平方根的模为`),
                [`\\sqrt{${R}} = ${s}`],
              ],
              [
                ["Halve the argument", "辐角减半"],
                t(
                  `Halve $${theta}^{\\circ}$ for the first root. The second root is $180^{\\circ}$ further on, the half of $${theta}^{\\circ} + 360^{\\circ}$:`,
                  `第一个根的辐角是 $${theta}^{\\circ}$ 的一半；第二个根再转 $180^{\\circ}$，即 $${theta}^{\\circ} + 360^{\\circ}$ 的一半：`,
                ),
                [`\\frac{${theta}^{\\circ}}{2} = ${h}^{\\circ}, \\qquad ${h}^{\\circ} + 180^{\\circ} = ${h + 180}^{\\circ}`],
              ],
            ],
            t(
              `Square each root with De Moivre's theorem. Both moduli give $${s}^{2} = ${R}$, and the angles double:\n\n$$2 \\cdot ${h}^{\\circ} = ${theta}^{\\circ}, \\qquad 2 \\cdot ${h + 180}^{\\circ} = ${2 * h + 360}^{\\circ} = ${theta}^{\\circ} + 360^{\\circ}$$\n\nBoth squares are $${cisDeg(String(R), theta)} = w$.`,
              `用棣莫弗定理把每个根平方。两个模都给出 $${s}^{2} = ${R}$，角都加倍：\n\n$$2 \\cdot ${h}^{\\circ} = ${theta}^{\\circ}, \\qquad 2 \\cdot ${h + 180}^{\\circ} = ${2 * h + 360}^{\\circ} = ${theta}^{\\circ} + 360^{\\circ}$$\n\n两个平方都是 $${cisDeg(String(R), theta)} = w$。`,
            ),
          ),
          [
            why(
              quarter,
              `These two are $90^{\\circ}$ apart. Square roots are opposite each other, $180^{\\circ}$ apart.`,
              `这两个相差 $90^{\\circ}$。平方根互为相反数，相差 $180^{\\circ}$。`,
            ),
            why(
              mirror,
              `The second root is the mirror image of the first in the real axis. It should be the opposite, $180^{\\circ}$ further on.`,
              `第二个根是第一个关于实轴的对称点。它应是相反数，再转 $180^{\\circ}$。`,
            ),
            why(
              unrooted,
              `The modulus is not square-rooted: each root has modulus $\\sqrt{${R}} = ${s}$.`,
              `模没有开平方：每个根的模是 $\\sqrt{${R}} = ${s}$。`,
            ),
            why(
              unhalved,
              `The argument is not halved, so these numbers square to an angle of $${2 * theta}^{\\circ}$, not $${theta}^{\\circ}$.`,
              `辐角没有减半，这些数平方后角是 $${2 * theta}^{\\circ}$，而不是 $${theta}^{\\circ}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "square-roots-in-rectangular-form",
      figure: precalculusDrawings3["square-roots-of-complex-numbers#square-roots-in-rectangular-form"],
      title: t("Write square roots of special numbers as a + bi", "把特殊复数的平方根写成 a + bi"),
      explanation: t(
        "When the half angle is special, the polar method gives the roots exactly in rectangular form. For $w = -8 + 8i\\sqrt{3} = 16\\,\\text{cis}\\frac{2\\pi}{3}$:\n\n$$\\sqrt{16}\\,\\text{cis}\\frac{\\pi}{3} = 4\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = 2 + 2i\\sqrt{3}$$\n\nThe other square root is its opposite, $-2 - 2i\\sqrt{3}$.\n\nCheck: $\\left(2 + 2i\\sqrt{3}\\right)^{2} = 4 - 12 + 8i\\sqrt{3} = -8 + 8i\\sqrt{3}$.\n\n> **Watch out.** Halve the argument of $w$; do not double it. The root with a positive real part can have a negative argument, such as $-\\frac{\\pi}{6}$, which is the same as $\\frac{11\\pi}{6}$.",
        "当半角是特殊角时，三角形式的方法可以精确地给出代数形式的平方根。对 $w = -8 + 8i\\sqrt{3} = 16\\,\\text{cis}\\frac{2\\pi}{3}$：\n\n$$\\sqrt{16}\\,\\text{cis}\\frac{\\pi}{3} = 4\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = 2 + 2i\\sqrt{3}$$\n\n另一个平方根是它的相反数 $-2 - 2i\\sqrt{3}$。\n\n检验：$\\left(2 + 2i\\sqrt{3}\\right)^{2} = 4 - 12 + 8i\\sqrt{3} = -8 + 8i\\sqrt{3}$。\n\n> **注意。** 要把 $w$ 的辐角减半，而不是加倍。实部为正的根的辐角可能是负的，例如 $-\\frac{\\pi}{6}$，它与 $\\frac{11\\pi}{6}$ 相同。",
      ),
      generate(rng) {
        const [R, phi] = rng.pick([
          ...[30, 60, -30, -60].flatMap((p) => [[4, p] as const, [16, p] as const, [36, p] as const, [64, p] as const]),
          ...[45, -45].flatMap((p) => [[2, p] as const, [8, p] as const]),
        ]);
        const W = R * R;
        const twice = mod360(2 * phi);
        const half = twice / 2;
        const polar = rng.bool();
        const wPolar = polarTex(String(R), radTex(twice));
        const wRect = rectTex(rect(W, twice));
        const w = polar ? wPolar : wRect;
        const root = rect(R, phi);
        const answer = rectTex(root);
        const [c1, m1] = root.re;
        const [c2, m2] = root.im;
        const sTex = ([c, m]: Surd1) => (m === 1 ? `${c}` : `${c === 1 ? "" : c === -1 ? "-" : c}\\sqrt{${m}}`);
        const paren = (v: Surd1) => (v[0] < 0 ? `\\left(${sTex(v)}\\right)` : sTex(v));
        const k = 2 * c1 * c2;
        const xy = m1 * m2 === 1 ? `${k}` : `${k}\\sqrt{${m1 * m2}}`;
        return expressionProblem({
          prompt: t(
            `Find the square root of $${w}$ that has a positive real part. Write it in the form $a + bi$.`,
            `求 $${w}$ 的实部为正的那个平方根，写成 $a + bi$ 的形式。`,
          ),
          answer,
          radical: true,
          wrong: defined([rectTexAt(R, phi + 180), rectTexAt(R, -phi), rectTexAt(R, 90 - phi), rectTexAt(W, phi)]),
          solution: walked(
            [
              polar
                ? [
                    ["Read the polar form", "读出三角形式"],
                    t(
                      `The number is already in polar form, with modulus $${R}$ and argument $${radTex(twice)}$.`,
                      `这个数已是三角形式，模为 $${R}$，辐角为 $${radTex(twice)}$。`,
                    ),
                  ]
                : [
                    ["Write the number in polar form", "化为三角形式"],
                    t(
                      `Its modulus is $\\sqrt{${W}} = ${R}$, and its position gives the argument $${radTex(twice)}$:`,
                      `它的模是 $\\sqrt{${W}} = ${R}$，由位置得辐角 $${radTex(twice)}$：`,
                    ),
                    [`${wRect} = ${wPolar}`],
                  ],
              [
                ["Halve the argument", "辐角减半"],
                t(
                  `The square roots have modulus $\\sqrt{${R}} = ${modTex(R)}$ and arguments $${radTex(half)}$ and $${radTex(half + 180)}$. The one with a positive real part has argument $${radTex(mod360(phi))}$:`,
                  `平方根的模为 $\\sqrt{${R}} = ${modTex(R)}$，辐角为 $${radTex(half)}$ 与 $${radTex(half + 180)}$。实部为正的那个辐角是 $${radTex(mod360(phi))}$：`,
                ),
                [`${polarTex(modTex(R), radTex(mod360(phi)))} = ${answer}`],
              ],
            ],
            t(
              `Square the answer with $(x + yi)^{2} = x^{2} - y^{2} + 2xyi$:\n\n$$x^{2} - y^{2} = ${surdSquare(root.re)} - ${surdSquare(root.im)} = ${c1 * c1 * m1 - c2 * c2 * m2}, \\qquad 2xy = 2 \\cdot ${paren(root.re)} \\cdot ${paren(root.im)} = ${xy}$$\n\nSo the square is $${wRect}$, the number we started with.`,
              `用 $(x + yi)^{2} = x^{2} - y^{2} + 2xyi$ 把答案平方：\n\n$$x^{2} - y^{2} = ${surdSquare(root.re)} - ${surdSquare(root.im)} = ${c1 * c1 * m1 - c2 * c2 * m2}, \\qquad 2xy = 2 \\cdot ${paren(root.re)} \\cdot ${paren(root.im)} = ${xy}$$\n\n所以平方是 $${wRect}$，正是原来的数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** ROOT_NAMES name the nth roots for n = 3…6. */
const ROOT_NAMES: Record<number, Text> = {
  3: t("cube roots", "立方根"),
  4: t("fourth roots", "四次方根"),
  5: t("fifth roots", "五次方根"),
  6: t("sixth roots", "六次方根"),
  8: t("eighth roots", "八次方根"),
};

/** QUADRANTS name the quadrants I–IV. */
const QUADRANTS: readonly Text[] = [
  t("quadrant I", "第一象限"),
  t("quadrant II", "第二象限"),
  t("quadrant III", "第三象限"),
  t("quadrant IV", "第四象限"),
];

/** HIGHER_ROOT_CASES are (n, R, φ): w = (√R cis φ)ⁿ has an integer rectangular form and √R cis φ lies inside a quadrant. */
const HIGHER_ROOT_CASES: readonly (readonly [number, number, number])[] = [3, 4].flatMap((n) =>
  [2, 4, 8, 16].flatMap((R) =>
    SPECIAL.filter((p) => p % 90 !== 0 && rectOf(R, p) !== undefined && rectOf(R ** n, mod360(n * p)) !== undefined).map(
      (p) => [n, R, p] as const,
    ),
  ),
);

/** higherRootsOfComplexNumbers covers the n nth roots of a complex number. */
export const higherRootsOfComplexNumbers: TopicDef = {
  id: "higher-roots-of-complex-numbers",
  title: t("Higher Roots of Complex Numbers", "复数的高次方根"),
  summary: t(
    "Find the n nth roots of w = r cis θ, ⁿ√r cis((θ + 360°k)/n) for k = 0, 1, …, n − 1, equally spaced on a circle of radius ⁿ√r, and write special ones in rectangular form.",
    "求 w = r cis θ 的 n 个 n 次方根 ⁿ√r cis((θ + 360°k)/n)（k = 0, 1, …, n − 1），它们等间隔地分布在半径为 ⁿ√r 的圆上，并把特殊的根写成代数形式。",
  ),
  prerequisites: ["square-roots-of-complex-numbers"],
  encompasses: [],
  xp: 18,
  standards: ["CCSS.HSN.CN.B.5"],
  intro: t(
    `The two square roots of $r\\,\\text{cis}\\,\\theta$ are $\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2}$ and the point $180^{\\circ}$ further on. Cube roots work the same way with three points $120^{\\circ}$ apart. For example, the cube roots of $8 = 8\\,\\text{cis}\\,0^{\\circ}$ are

$$2, \\qquad 2\\,\\text{cis}\\,120^{\\circ}, \\qquad 2\\,\\text{cis}\\,240^{\\circ}$$

Check: by De Moivre's theorem $\\left(2\\,\\text{cis}\\,120^{\\circ}\\right)^{3} = 8\\,\\text{cis}\\,360^{\\circ} = 8$.

In this lesson we find all $n$ of the $n$th roots of a complex number, their arguments, and the rectangular forms of the special ones.`,
    `$r\\,\\text{cis}\\,\\theta$ 的两个平方根是 $\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2}$ 以及再转 $180^{\\circ}$ 的那个点。立方根也一样，只是三个点相隔 $120^{\\circ}$。例如，$8 = 8\\,\\text{cis}\\,0^{\\circ}$ 的立方根是

$$2, \\qquad 2\\,\\text{cis}\\,120^{\\circ}, \\qquad 2\\,\\text{cis}\\,240^{\\circ}$$

检验：由棣莫弗定理，$\\left(2\\,\\text{cis}\\,120^{\\circ}\\right)^{3} = 8\\,\\text{cis}\\,360^{\\circ} = 8$。

这节课我们求一个复数的全部 $n$ 个 $n$ 次方根，求出它们的辐角，并把特殊的根写成代数形式。`,
  ),
  knowledgePoints: [
    {
      id: "recognizing-nth-roots",
      title: t("Recognize the nth roots of a complex number", "识别复数的 n 次方根"),
      explanation: t(
        "The $n$th roots of $w = r(\\cos\\theta + i\\sin\\theta)$ are\n\n$$\\sqrt[n]{r}\\left(\\cos\\frac{\\theta + 2\\pi k}{n} + i\\sin\\frac{\\theta + 2\\pi k}{n}\\right), \\qquad k = 0, 1, \\ldots, n - 1$$\n\nEach has modulus $\\sqrt[n]{r}$, and by De Moivre's theorem its $n$th power has argument $\\theta + 2\\pi k$, the same direction as $w$. Consecutive roots are $\\frac{2\\pi}{n}$ apart. For example, the cube roots of $8\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$ have modulus $2$ and arguments $\\frac{\\pi}{6}$, $\\frac{5\\pi}{6}$ and $\\frac{3\\pi}{2}$.\n\nCheck: cubing $2\\,\\text{cis}\\frac{3\\pi}{2}$ gives modulus $8$ and argument $\\frac{9\\pi}{2} = \\frac{\\pi}{2} + 4\\pi$, the direction of $w$.\n\n> **Watch out.** Add $2\\pi k$ to $\\theta$ first and then divide by $n$; do not multiply $\\theta$ by $n$. The modulus of a root is $\\sqrt[n]{r}$, not $r$.",
        "$w = r(\\cos\\theta + i\\sin\\theta)$ 的 $n$ 次方根为\n\n$$\\sqrt[n]{r}\\left(\\cos\\frac{\\theta + 2\\pi k}{n} + i\\sin\\frac{\\theta + 2\\pi k}{n}\\right), \\qquad k = 0, 1, \\ldots, n - 1$$\n\n每个根的模长都是 $\\sqrt[n]{r}$；由棣莫弗定理，它的 $n$ 次幂的辐角为 $\\theta + 2\\pi k$，与 $w$ 方向相同。相邻两根的辐角相差 $\\frac{2\\pi}{n}$。例如，$8\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$ 的立方根模长为 $2$，辐角为 $\\frac{\\pi}{6}$、$\\frac{5\\pi}{6}$ 与 $\\frac{3\\pi}{2}$。\n\n检验：把 $2\\,\\text{cis}\\frac{3\\pi}{2}$ 立方，模为 $8$，辐角为 $\\frac{9\\pi}{2} = \\frac{\\pi}{2} + 4\\pi$，正是 $w$ 的方向。\n\n> **注意。** 先给 $\\theta$ 加上 $2\\pi k$，再除以 $n$；不要把 $\\theta$ 乘以 $n$。根的模是 $\\sqrt[n]{r}$，而不是 $r$。",
      ),
      generate(rng) {
        const n = rng.int(3, 6);
        const r = n <= 4 ? rng.pick([1, 2, 3]) : rng.pick([1, 2]);
        const q = rng.pick([2, 3, 4, 5, 6]);
        const theta = Q.of(rng.pick(coprimeTo(q, 2 * q - 1)), q);
        const N = Q.of(n);
        const rootAngle = (k: number) => normPi(theta.add(Q.of(2 * k)).div(N));
        const isRoot = (mod: number, a: Q) => mod === r && normPi(a.mul(N).sub(theta)).isZero();
        const k = rng.int(0, n - 1);
        const j = rng.int(0, n - 1);
        const right = polarTex(String(r), piTex(rootAngle(k)));
        const name = ROOT_NAMES[n]!;
        const cands: [number, Q, string, string][] = [
          [
            r ** n,
            rootAngle(k),
            `This has modulus $${r ** n}$, the modulus of the given number itself. A root has modulus $\\sqrt[${n}]{${r ** n}} = ${r}$.`,
            `它的模是 $${r ** n}$，即所给数本身的模。根的模应为 $\\sqrt[${n}]{${r ** n}} = ${r}$。`,
          ],
          [
            r + 1,
            rootAngle(k),
            `This has modulus $${r + 1}$, so its ${ordinal(n)} power has modulus $${(r + 1) ** n}$, not $${r ** n}$.`,
            `它的模是 $${r + 1}$，其 $${n}$ 次幂的模是 $${(r + 1) ** n}$，而不是 $${r ** n}$。`,
          ],
          [
            r,
            normPi(theta.div(N).add(Q.of(2 * j + 1, n))),
            `This lies halfway between two roots. Its ${ordinal(n)} power points opposite to the given number.`,
            `它位于两个根的正中间，其 $${n}$ 次幂与所给的数方向相反。`,
          ],
          [
            r,
            normPi(theta.add(Q.of(2 * k, n))),
            `This adds $\\frac{2\\pi k}{${n}}$ to $${piTex(theta)}$ without dividing $${piTex(theta)}$ by $${n}$.`,
            `这里把 $\\frac{2\\pi k}{${n}}$ 加到 $${piTex(theta)}$ 上，却没有把 $${piTex(theta)}$ 除以 $${n}$。`,
          ],
          [
            r,
            normPi(theta.mul(N)),
            `This multiplies the argument by $${n}$, which is the rule for a power. A root divides it by $${n}$.`,
            `这里把辐角乘以了 $${n}$，那是乘方的法则。开方时要除以 $${n}$。`,
          ],
        ];
        const kept = cands.filter(([mod, a]) => !isRoot(mod, a));
        const opt = ([mod, a]: readonly [number, Q, ...string[]]) => m$(polarTex(String(mod), piTex(a)));
        const w = polarTex(String(r ** n), piTex(theta));
        const power = rootAngle(k).mul(N);
        const turns = power.sub(theta);
        return oneOf(
          rng,
          t(`Which of the following is one of the ${name.en} of $${w}$?`, `下列哪一个是 $${w}$ 的${name["zh-CN"]}之一？`),
          m$(right),
          kept.map(opt),
          walked(
            [
              [
                ["Find the modulus", "求模"],
                t(`Every root has the same modulus:`, `每个根的模都相同：`),
                [`\\sqrt[${n}]{${r ** n}} = ${r}`],
              ],
              [
                ["Find an argument", "求辐角"],
                t(
                  `The arguments are $\\frac{${piTex(theta)} + 2\\pi k}{${n}}$ for $k = 0, 1, \\ldots, ${n - 1}$. With $k = ${k}$:`,
                  `辐角为 $\\frac{${piTex(theta)} + 2\\pi k}{${n}}$，$k = 0, 1, \\ldots, ${n - 1}$。取 $k = ${k}$：`,
                ),
                [`\\frac{${piTex(theta)} + ${piTex(Q.of(2 * k))}}{${n}} = ${piTex(rootAngle(k))}`],
              ],
            ],
            t(
              `Raise the root to the ${ordinal(n)} power with De Moivre's theorem. Its modulus becomes $${r}^{${n}} = ${r ** n}$, and its argument becomes the following.\n\n$$${n} \\cdot ${piTex(rootAngle(k))} = ${piTex(power)}${turns.isZero() ? "" : ` = ${piTex(theta)} + ${piTex(turns)}`}$$\n\nThis is the direction of the given number${turns.isZero() ? "" : " after whole turns"}, so the power is the given number.`,
              `用棣莫弗定理把这个根取 $${n}$ 次幂。模变为 $${r}^{${n}} = ${r ** n}$，辐角变为如下。\n\n$$${n} \\cdot ${piTex(rootAngle(k))} = ${piTex(power)}${turns.isZero() ? "" : ` = ${piTex(theta)} + ${piTex(turns)}`}$$\n\n${turns.isZero() ? "" : "除去整圈后，"}这正是所给数的方向，所以这个幂就是所给的数。`,
            ),
          ),
          kept.map((c) => why(opt(c), c[2], c[3])),
        );
      },
    },
    {
      id: "arguments-of-nth-roots",
      title: t("Find the arguments of the nth roots", "求 n 次方根的辐角"),
      explanation: t(
        "In degrees, the $n$th roots of $r\\,\\text{cis}\\,\\theta$ have arguments\n\n$$\\frac{\\theta}{n}, \\quad \\frac{\\theta}{n} + \\frac{360^{\\circ}}{n}, \\quad \\frac{\\theta}{n} + 2 \\cdot \\frac{360^{\\circ}}{n}, \\quad \\ldots, \\quad \\frac{\\theta}{n} + (n - 1)\\frac{360^{\\circ}}{n}$$\n\nFor the fifth roots of $32\\,\\text{cis}\\,100^{\\circ}$: the smallest argument is $20^{\\circ}$, and the others follow every $72^{\\circ}$: $92^{\\circ}, 164^{\\circ}, 236^{\\circ}, 308^{\\circ}$.\n\nCheck: $5 \\cdot 92^{\\circ} = 460^{\\circ} = 100^{\\circ} + 360^{\\circ}$, so the fifth power of that root points the same way as $32\\,\\text{cis}\\,100^{\\circ}$.\n\n> **Watch out.** The first argument is $\\frac{\\theta}{n}$, not $\\theta$, and the roots are $\\frac{360^{\\circ}}{n}$ apart, not $\\frac{180^{\\circ}}{n}$.",
        "用度表示时，$r\\,\\text{cis}\\,\\theta$ 的 $n$ 次方根的辐角为\n\n$$\\frac{\\theta}{n}, \\quad \\frac{\\theta}{n} + \\frac{360^{\\circ}}{n}, \\quad \\frac{\\theta}{n} + 2 \\cdot \\frac{360^{\\circ}}{n}, \\quad \\ldots, \\quad \\frac{\\theta}{n} + (n - 1)\\frac{360^{\\circ}}{n}$$\n\n对 $32\\,\\text{cis}\\,100^{\\circ}$ 的五次方根：最小辐角为 $20^{\\circ}$，其余每隔 $72^{\\circ}$ 一个：$92^{\\circ}, 164^{\\circ}, 236^{\\circ}, 308^{\\circ}$。\n\n检验：$5 \\cdot 92^{\\circ} = 460^{\\circ} = 100^{\\circ} + 360^{\\circ}$，所以这个根的五次幂与 $32\\,\\text{cis}\\,100^{\\circ}$ 方向相同。\n\n> **注意。** 第一个辐角是 $\\frac{\\theta}{n}$，而不是 $\\theta$；相邻两根相差 $\\frac{360^{\\circ}}{n}$，而不是 $\\frac{180^{\\circ}}{n}$。",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 5, 6, 8]);
        const r = n <= 4 ? rng.pick([2, 3]) : 2;
        const step = 360 / n;
        const b = rng.int(1, step - 1);
        const theta = n * b;
        const kind = rng.pick(["smallest", "largest", "second"] as const);
        const w = cisDeg(String(r ** n), theta);
        const name = ROOT_NAMES[n]!;
        const list = Array.from({ length: n }, (_, k) => `${b + step * k}^{\\circ}`).join(", ");
        const k = kind === "smallest" ? 0 : kind === "second" ? 1 : n - 1;
        const answer = b + step * k;
        const what =
          kind === "smallest"
            ? t("the smallest argument", "最小的辐角")
            : kind === "second"
              ? t("the second smallest argument", "第二小的辐角")
              : t("the largest argument", "最大的辐角");
        return numberProblem({
          prompt: t(
            `The ${name.en} of $${w}$ have arguments in $[0^{\\circ}, 360^{\\circ})$. Find ${what.en}.`,
            `$${w}$ 的${name["zh-CN"]}的辐角都取在 $[0^{\\circ}, 360^{\\circ})$ 内。求其中${what["zh-CN"]}。`,
          ),
          answer,
          unit: "°",
          wrong: [theta + step * k, Q.of(theta + 180 * k, n), b + step * (k + 1), b + 90 * k],
          solution: walked(
            [
              [
                ["Find the first argument", "求第一个辐角"],
                t(`Divide the argument of the given number by $${n}$:`, `把所给数的辐角除以 $${n}$：`),
                [`\\frac{${theta}^{\\circ}}{${n}} = ${b}^{\\circ}`],
              ],
              [
                ["Add the spacing", "加上间隔"],
                t(
                  `The roots are $\\frac{360^{\\circ}}{${n}} = ${step}^{\\circ}$ apart, so the arguments are`,
                  `相邻两根相差 $\\frac{360^{\\circ}}{${n}} = ${step}^{\\circ}$，所以辐角为`,
                ),
                [list],
              ],
              [
                ["Pick the one asked for", "选出所求的辐角"],
                t(`So ${what.en} is $${answer}^{\\circ}$.`, `所以${what["zh-CN"]}是 $${answer}^{\\circ}$。`),
              ],
            ],
            t(
              `By De Moivre's theorem, the ${ordinal(n)} power of the root has argument $${n} \\cdot ${answer}^{\\circ} = ${n * answer}^{\\circ}$.\n\nThis is $${theta}^{\\circ}$${k === 0 ? "" : ` plus $${k} \\cdot 360^{\\circ}$`}, the direction of the given number, and $${answer}^{\\circ}$ lies in $[0^{\\circ}, 360^{\\circ})$.`,
              `由棣莫弗定理，这个根的 $${n}$ 次幂的辐角是 $${n} \\cdot ${answer}^{\\circ} = ${n * answer}^{\\circ}$。\n\n它等于 $${theta}^{\\circ}$${k === 0 ? "" : ` 加 $${k} \\cdot 360^{\\circ}$`}，正是所给数的方向，并且 $${answer}^{\\circ}$ 在 $[0^{\\circ}, 360^{\\circ})$ 内。`,
            ),
          ),
        });
      },
    },
    {
      id: "nth-roots-in-rectangular-form",
      title: t("Write cube and fourth roots as a + bi", "把立方根与四次方根写成 a + bi"),
      explanation: t(
        "Convert $w$ to polar form, find the root in the requested position, and convert it back. The cube roots of $8i = 8\\,\\text{cis}\\frac{\\pi}{2}$ are $2\\,\\text{cis}\\frac{\\pi}{6}$, $2\\,\\text{cis}\\frac{5\\pi}{6}$ and $2\\,\\text{cis}\\frac{3\\pi}{2}$. The one in quadrant II is\n\n$$2\\left(\\cos\\frac{5\\pi}{6} + i\\sin\\frac{5\\pi}{6}\\right) = -\\sqrt{3} + i$$\n\nCheck: $-\\sqrt{3} + i$ has modulus $2$ and argument $150^{\\circ}$, so its cube has modulus $8$ and argument $450^{\\circ} = 90^{\\circ} + 360^{\\circ}$, which is $8i$.\n\n> **Watch out.** The root's modulus is the $n$th root of $|w|$, not $|w|$ itself. Use the signs to confirm the quadrant: quadrant II needs a negative real part and a positive imaginary part.",
        "先把 $w$ 化为三角形式，找出所求位置的根，再化回代数形式。$8i = 8\\,\\text{cis}\\frac{\\pi}{2}$ 的立方根为 $2\\,\\text{cis}\\frac{\\pi}{6}$、$2\\,\\text{cis}\\frac{5\\pi}{6}$ 与 $2\\,\\text{cis}\\frac{3\\pi}{2}$。位于第二象限的是\n\n$$2\\left(\\cos\\frac{5\\pi}{6} + i\\sin\\frac{5\\pi}{6}\\right) = -\\sqrt{3} + i$$\n\n检验：$-\\sqrt{3} + i$ 的模为 $2$，辐角为 $150^{\\circ}$，所以它的立方模为 $8$，辐角为 $450^{\\circ} = 90^{\\circ} + 360^{\\circ}$，正是 $8i$。\n\n> **注意。** 根的模是 $|w|$ 的 $n$ 次方根，而不是 $|w|$ 本身。用符号确认象限：第二象限要求实部为负、虚部为正。",
      ),
      generate(rng) {
        const [n, R, phi] = rng.pick(HIGHER_ROOT_CASES);
        const big = mod360(n * phi);
        const wz = rect(R ** n, big);
        const w = rectTex(wz);
        const quadrant = Math.floor(phi / 90);
        const name = ROOT_NAMES[n]!;
        const answer = rectTex(rect(R, phi));
        const where = QUADRANTS[quadrant]!;
        const roots = Array.from(
          { length: n },
          (_, k) => `${modTex(R)}\\,\\text{cis}\\left(${radTex(mod360(big / n + (360 * k) / n))}\\right)`,
        );
        const turns = (n * phi - big) / 360;
        return expressionProblem({
          prompt: t(
            `Find the one of the ${name.en} of $${w}$ that lies in ${where.en}. Write it in the form $a + bi$.`,
            `求 $${w}$ 的${name["zh-CN"]}中位于${where["zh-CN"]}的那一个，写成 $a + bi$ 的形式。`,
          ),
          answer,
          radical: true,
          wrong: defined([rectTexAt(R, phi + 180), rectTexAt(R, -phi), rectTexAt(R, 90 - phi), rectTexAt(R ** n, phi)]),
          solution: walked(
            [
              [
                ["Write the number in polar form", "化为三角形式"],
                t(`Its modulus and argument are`, `它的模与辐角为`),
                [`\\sqrt{${surdSquare(wz.re)} + ${surdSquare(wz.im)}} = ${modTex(R ** n)}, \\qquad \\theta = ${radTex(big)}`],
              ],
              [
                ["List the roots", "列出各根"],
                t(
                  `The ${name.en} have modulus $${modTex(R)}$, whose ${ordinal(n)} power is $${modTex(R ** n)}$, and start at $\\frac{\\theta}{${n}}$, $\\frac{2\\pi}{${n}}$ apart:`,
                  `${name["zh-CN"]}的模为 $${modTex(R)}$（它的 $${n}$ 次幂是 $${modTex(R ** n)}$），从 $\\frac{\\theta}{${n}}$ 开始，相隔 $\\frac{2\\pi}{${n}}$：`,
                ),
                [roots.join(", \\quad ")],
              ],
              [
                ["Pick the quadrant", "选出所在象限"],
                t(`Only the root at $${radTex(phi)}$ lies in ${where.en}:`, `只有辐角为 $${radTex(phi)}$ 的根位于${where["zh-CN"]}：`),
                [`${polarTex(modTex(R), radTex(phi))} = ${answer}`],
              ],
            ],
            t(
              `Raise the answer to the ${ordinal(n)} power with De Moivre's theorem. The modulus becomes $${modTex(R ** n)}$, and the argument becomes the following.\n\n$$${n} \\cdot ${radTex(phi)} = ${radTex(n * phi)}${turns === 0 ? "" : ` = ${radTex(big)} + ${piTex(Q.of(2 * turns))}`}$$\n\nThis is the direction of $${w}$, and the signs of $${answer}$ match ${where.en}.`,
              `用棣莫弗定理把答案取 $${n}$ 次幂。模变为 $${modTex(R ** n)}$，辐角变为如下。\n\n$$${n} \\cdot ${radTex(phi)} = ${radTex(n * phi)}${turns === 0 ? "" : ` = ${radTex(big)} + ${piTex(Q.of(2 * turns))}`}$$\n\n这正是 $${w}$ 的方向，且 $${answer}$ 的符号与${where["zh-CN"]}相符。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.34: The Fundamental Theorem of Algebra ────────────────────────

/** QuadKind is a monic quadratic x² + bx + c with integer coefficients and a description of its roots. */
interface QuadKind {
  readonly b: number;
  readonly c: number;
  /** nonreal is the number of nonreal roots: 0 or 2. */
  readonly nonreal: number;
  /** reals are keys of the distinct real roots. */
  readonly reals: readonly string[];
}

/** quadKind draws a monic quadratic with complex, repeated, distinct integer or irrational roots. */
function quadKind(rng: Rng, kind = rng.int(0, 3)): QuadKind {
  if (kind === 0) {
    const h = rng.int(-4, 4);
    const k = rng.int(1, 9);
    return { b: -2 * h, c: h * h + k, nonreal: 2, reals: [] };
  }
  if (kind === 1) {
    const s = rng.nonZero(-5, 5);
    return { b: -2 * s, c: s * s, nonreal: 0, reals: [`${s}`] };
  }
  if (kind === 2) {
    const s1 = rng.int(-6, 6);
    let s2 = rng.int(-6, 6);
    if (s2 === s1) s2 = s1 === 6 ? -6 : s1 + 1;
    return { b: -(s1 + s2), c: s1 * s2, nonreal: 0, reals: [`${s1}`, `${s2}`] };
  }
  const h = rng.int(-4, 4);
  const m = rng.pick([2, 3, 5, 6, 7]);
  return { b: -2 * h, c: h * h - m, nonreal: 0, reals: [`${h}+r${m}`, `${h}-r${m}`] };
}

/** quadTex writes x² + bx + c. */
const quadTex = (q: QuadKind) => polyX([1, q.b, q.c]);

/** quadRealRoots writes the real roots of x² + bx + c with multiplicity: none, a repeated root, two integers, or h ± √m. */
function quadRealRoots(q: QuadKind): string[] {
  const disc = q.b * q.b - 4 * q.c;
  if (disc < 0) return [];
  if (disc === 0) return [`${-q.b / 2}`, `${-q.b / 2}`];
  const s = Math.round(Math.sqrt(disc));
  if (s * s === disc) return [`${(-q.b - s) / 2}`, `${(-q.b + s) / 2}`];
  const h = -q.b / 2;
  const root = `\\sqrt{${disc / 4}}`;
  return h === 0 ? [`-${root}`, root] : [`${h} - ${root}`, `${h} + ${root}`];
}

/** theFundamentalTheoremOfAlgebraForQuadraticEquations covers the two complex roots of every quadratic. */
export const theFundamentalTheoremOfAlgebraForQuadraticEquations: TopicDef = {
  id: "the-fundamental-theorem-of-algebra-for-quadratic-equations",
  title: t("The Fundamental Theorem of Algebra for Quadratic Equations", "二次方程的代数基本定理"),
  summary: t(
    "Apply the fundamental theorem of algebra to quadratics: every quadratic has exactly two complex roots counted with multiplicity, classify them with the discriminant, and factor quadratics with nonreal roots into linear factors over the complex numbers.",
    "把代数基本定理应用于二次多项式：每个二次多项式按重数计恰有两个复数根；用判别式对根分类，并在复数范围内把有非实根的二次式分解为一次因式之积。",
  ),
  prerequisites: ["extending-polynomial-identities-to-the-complex-numbers", "solving-quadratic-equations-with-complex-roots"],
  encompasses: [{ topic: "solving-quadratic-equations-with-complex-roots", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSN.CN.C.9"],
  intro: t(
    `A quadratic with no real roots still has complex roots. For example, $x^{2} + 9 = 0$ gives $x^{2} = -9$, so $x = 3i$ or $x = -3i$, and the identity $a^{2} - b^{2} = (a - b)(a + b)$ extends to complex numbers:

$$x^{2} + 9 = (x - 3i)(x + 3i)$$

Check: $(x - 3i)(x + 3i) = x^{2} - 9i^{2} = x^{2} + 9$.

In this lesson we see that every quadratic has exactly two complex roots, counted with multiplicity. We classify them with the discriminant, factor quadratics over the complex numbers, and build a real quadratic from one nonreal root.`,
    `没有实根的二次方程仍有复数根。例如，由 $x^{2} + 9 = 0$ 得 $x^{2} = -9$，所以 $x = 3i$ 或 $x = -3i$；恒等式 $a^{2} - b^{2} = (a - b)(a + b)$ 推广到复数后给出

$$x^{2} + 9 = (x - 3i)(x + 3i)$$

检验：$(x - 3i)(x + 3i) = x^{2} - 9i^{2} = x^{2} + 9$。

这节课我们看到，每个二次式按重数计恰有两个复数根。我们用判别式对根分类，在复数范围内分解二次式，并由一个非实根构造实系数二次式。`,
  ),
  knowledgePoints: [
    {
      id: "classifying-the-roots-of-a-quadratic",
      title: t("Classify the roots of a quadratic", "判断二次方程根的类型"),
      explanation: t(
        "The **fundamental theorem of algebra** says that every polynomial of degree $n \\ge 1$ with complex coefficients has exactly $n$ complex roots, counted with multiplicity. A quadratic $ax^{2} + bx + c$ therefore always has two roots, and with real coefficients the discriminant $\\Delta = b^{2} - 4ac$ tells which kind:\n\n- $\\Delta > 0$: two distinct real roots;\n- $\\Delta = 0$: one real root of multiplicity $2$;\n- $\\Delta < 0$: two nonreal roots, which are complex conjugates.\n\nA real quadratic can never have exactly one nonreal root. For example, $2x^{2} - 4x + 5$ has $\\Delta = 16 - 40 = -24 < 0$, so its two roots are nonreal conjugates.\n\nCheck: $2x^{2} - 4x + 5 = 2(x - 1)^{2} + 3$, which is at least $3$ for every real $x$, so it has no real root.\n\n> **Watch out.** When $\\Delta = 0$ there are still two roots, counted with multiplicity. Keep the signs in $4ac$: a negative $a$ or $c$ makes $-4ac$ positive.",
        "**代数基本定理**指出：每个次数 $n \\ge 1$ 的复系数多项式按重数计恰有 $n$ 个复数根。因此二次式 $ax^{2} + bx + c$ 总有两个根；系数为实数时，判别式 $\\Delta = b^{2} - 4ac$ 决定根的类型：\n\n- $\\Delta > 0$：两个不相等的实根；\n- $\\Delta = 0$：一个二重实根；\n- $\\Delta < 0$：两个非实根，且互为共轭复数。\n\n实系数二次式不可能恰好有一个非实根。例如，$2x^{2} - 4x + 5$ 的 $\\Delta = 16 - 40 = -24 < 0$，所以它的两个根是互为共轭的非实数。\n\n检验：$2x^{2} - 4x + 5 = 2(x - 1)^{2} + 3$，对每个实数 $x$ 它都至少是 $3$，所以没有实根。\n\n> **注意。** $\\Delta = 0$ 时按重数计仍有两个根。计算 $4ac$ 时要带符号：$a$ 或 $c$ 为负时，$-4ac$ 是正的。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3]);
        const q = quadKind(rng);
        const b = a * q.b;
        const c = a * q.c;
        const disc = b * b - 4 * a * c;
        const options: Text[] = [
          t("Two distinct real roots", "两个不相等的实根"),
          t("One real root of multiplicity 2", "一个二重实根"),
          t("Two nonreal complex conjugate roots", "两个互为共轭的非实根"),
          t("One real root and one nonreal root", "一个实根和一个非实根"),
        ];
        const correct = disc > 0 ? 0 : disc === 0 ? 1 : 2;
        const eq = `${polyX([a, b, c])} = 0`;
        const sign = disc > 0 ? t("positive", "大于零") : disc === 0 ? t("zero", "等于零") : t("negative", "小于零");
        const half = Q.of(q.b, 2);
        const shifted = half.isZero() ? "x" : `x ${half.sign() < 0 ? "-" : "+"} ${(half.sign() < 0 ? half.neg() : half).toLatex()}`;
        const rest = Q.of(q.b * q.b - 4 * q.c, 4);
        const reading =
          disc > 0
            ? t(
                `A positive number has two real square roots, so there are two distinct real roots.`,
                `正数有两个实数平方根，所以有两个不相等的实根。`,
              )
            : disc === 0
              ? t(`Only $0$ squares to $0$, so the single real root is repeated.`, `只有 $0$ 的平方是 $0$，所以唯一的实根是二重根。`)
              : t(
                  `No real number has a negative square, so both roots are nonreal: a conjugate pair.`,
                  `没有实数的平方是负数，所以两个根都不是实数，互为共轭。`,
                );
        const pc = 4 * a * c < 0 ? `(${4 * a * c})` : `${4 * a * c}`;
        return oneOf(
          rng,
          t(`Describe the roots of $${eq}$.`, `描述方程 $${eq}$ 的根。`),
          options[correct]!,
          options.filter((_, i) => i !== correct),
          walked(
            [
              [
                ["Compute the discriminant", "计算判别式"],
                t(`With $a = ${a}$, $b = ${b}$ and $c = ${c}$:`, `其中 $a = ${a}$，$b = ${b}$，$c = ${c}$：`),
                [`b^{2} - 4ac = ${b * b} - ${pc} = ${disc}`],
              ],
              [
                ["Read its sign", "看符号"],
                t(
                  `The discriminant is ${sign.en}. Counting multiplicity there are always two roots, and here they are: ${options[correct]!.en.toLowerCase()}.`,
                  `判别式${sign["zh-CN"]}。按重数计总有两个根，这里是：${options[correct]!["zh-CN"]}。`,
                ),
              ],
            ],
            t(
              `Complete the square instead.${a === 1 ? "" : ` Dividing by $${a}$ gives $${quadTex(q)} = 0$.`} Then\n\n$$\\left(${shifted}\\right)^{2} = ${rest.toLatex()}$$\n\n${reading.en}`,
              `改用配方。${a === 1 ? "" : `两边除以 $${a}$，得 $${quadTex(q)} = 0$。`}于是\n\n$$\\left(${shifted}\\right)^{2} = ${rest.toLatex()}$$\n\n${reading["zh-CN"]}`,
            ),
          ),
          [
            why(
              options[0]!,
              `Two distinct real roots need a positive discriminant, but here it is $${disc}$.`,
              `两个不相等的实根要求判别式为正，而这里是 $${disc}$。`,
            ),
            why(
              options[1]!,
              `A repeated real root needs a discriminant of $0$, but here it is $${disc}$.`,
              `二重实根要求判别式为 $0$，而这里是 $${disc}$。`,
            ),
            why(
              options[2]!,
              `Nonreal roots need a negative discriminant, but here it is $${disc}$.`,
              `非实根要求判别式为负，而这里是 $${disc}$。`,
            ),
            why(
              options[3]!,
              `The nonreal roots of a real quadratic come in conjugate pairs, so this never happens.`,
              `实系数二次式的非实根成对共轭出现，所以这种情况不会发生。`,
            ),
          ].filter((_, i) => i !== correct),
        );
      },
    },
    {
      id: "factoring-quadratics-into-complex-linear-factors",
      title: t("Factor a quadratic into complex linear factors", "在复数范围内把二次式分解为一次因式"),
      explanation: t(
        "If $r_{1}$ and $r_{2}$ are the roots of $x^{2} + bx + c$, then $x^{2} + bx + c = (x - r_{1})(x - r_{2})$, even when the roots are not real. For $x^{2} - 4x + 13$ the roots are $2 \\pm 3i$, so\n\n$$x^{2} - 4x + 13 = \\left(x - (2 + 3i)\\right)\\left(x - (2 - 3i)\\right)$$\n\nCheck: the product is $(x - 2)^{2} - (3i)^{2} = x^{2} - 4x + 4 + 9$.\n\n> **Watch out.** Each factor is $x$ minus a root, so the root $2 + 3i$ gives $x - (2 + 3i)$, not $x + (2 + 3i)$. A square $(x - r)^{2}$ is right only when both roots are equal.",
        "若 $r_{1}$、$r_{2}$ 是 $x^{2} + bx + c$ 的根，则即使根不是实数，也有 $x^{2} + bx + c = (x - r_{1})(x - r_{2})$。对 $x^{2} - 4x + 13$，根为 $2 \\pm 3i$，所以\n\n$$x^{2} - 4x + 13 = \\left(x - (2 + 3i)\\right)\\left(x - (2 - 3i)\\right)$$\n\n检验：乘积为 $(x - 2)^{2} - (3i)^{2} = x^{2} - 4x + 4 + 9$。\n\n> **注意。** 每个因式是 $x$ 减去一个根，所以根 $2 + 3i$ 给出 $x - (2 + 3i)$，而不是 $x + (2 + 3i)$。只有两根相等时，才能写成平方 $(x - r)^{2}$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        let c = rng.int(1, 6);
        if (c === Math.abs(h)) c += 1;
        const p = polyX([1, -2 * h, h * h + c * c]);
        const f = (a: number, b: number) => `\\left(x - (${cx(a, b)})\\right)\\left(x - (${cx(a, -b)})\\right)`;
        const right = f(h, c);
        const ci = c === 1 ? "i" : `${c}i`;
        const negated = m$(f(-h, c));
        const swapped = m$(f(c, h));
        const squared = m$(`\\left(x - (${cx(h, c)})\\right)^{2}`);
        const unrooted = m$(f(h, c * c));
        return oneOf(
          rng,
          t(`Factor $${p}$ into linear factors over the complex numbers.`, `在复数范围内把 $${p}$ 分解为一次因式之积。`),
          m$(right),
          [negated, swapped, squared, unrooted],
          walked(
            [
              [
                ["Complete the square", "配方"],
                t(`Rewrite the quadratic around $${linear(1, -h)}$:`, `围绕 $${linear(1, -h)}$ 改写二次式：`),
                [`${p} = (${linear(1, -h)})^{2} + ${c * c}`],
              ],
              [
                ["Solve for the roots", "求根"],
                t(
                  `Set it to $0$. The square is $-${c * c}$, so its square roots are $\\pm ${ci}$:`,
                  `令它等于 $0$。平方等于 $-${c * c}$，所以开方得 $\\pm ${ci}$：`,
                ),
                [`${linear(1, -h)} = \\pm ${ci} \\quad\\Rightarrow\\quad x = ${h} \\pm ${ci}`],
              ],
              [
                ["Write the factors", "写出因式"],
                t(`Each root $r$ gives a factor $x - r$:`, `每个根 $r$ 给出一个因式 $x - r$：`),
                [`${p} = ${right}`],
              ],
            ],
            t(
              `Multiply the factors back as a difference of squares:\n\n$$(${linear(1, -h)})^{2} - (${ci})^{2} = ${polyX([1, -2 * h, h * h])} + ${c * c} = ${p}$$\n\nThis is the quadratic we started with.`,
              `把因式按平方差乘回去：\n\n$$(${linear(1, -h)})^{2} - (${ci})^{2} = ${polyX([1, -2 * h, h * h])} + ${c * c} = ${p}$$\n\n正是原来的二次式。`,
            ),
          ),
          [
            why(
              negated,
              `These factors have roots $${-h} \\pm ${ci}$. Their sum, $${-2 * h}$, should equal $${2 * h}$, minus the coefficient of $x$.`,
              `这些因式的根是 $${-h} \\pm ${ci}$。两根之和 $${-2 * h}$ 应等于 $x$ 系数的相反数 $${2 * h}$。`,
            ),
            why(
              swapped,
              `The real and imaginary parts are swapped: these roots are $${c} \\pm ${Math.abs(h) === 1 ? "" : Math.abs(h)}i$.`,
              `实部与虚部弄反了：这些根是 $${c} \\pm ${Math.abs(h) === 1 ? "" : Math.abs(h)}i$。`,
            ),
            why(
              squared,
              `This square has only the root $${cx(h, c)}$, repeated. The conjugate $${cx(h, -c)}$ must be a root too.`,
              `这个平方只有重根 $${cx(h, c)}$。共轭 $${cx(h, -c)}$ 也必须是根。`,
            ),
            why(
              unrooted,
              `The imaginary part of the roots is the square root of $${c * c}$, which is $${c}$, not $${c * c}$.`,
              `根的虚部是 $${c * c}$ 的平方根 $${c}$，而不是 $${c * c}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "quadratics-from-a-complex-root",
      title: t("Build a real quadratic from a nonreal root", "由一个非实根构造实系数二次式"),
      explanation: t(
        "A real quadratic with the nonreal root $p + qi$ also has the root $p - qi$, and by the fundamental theorem of algebra these are its only roots. The monic quadratic is\n\n$$\\left(x - (p + qi)\\right)\\left(x - (p - qi)\\right) = x^{2} - 2px + (p^{2} + q^{2})$$\n\nFor the root $-1 + 4i$: $x^{2} + 2x + 17$.\n\nCheck: $(-1 + 4i)^{2} + 2(-1 + 4i) + 17 = (-15 - 8i) + (-2 + 8i) + 17 = 0$.\n\n> **Watch out.** The coefficient of $x$ is minus the sum of the roots, $-2p$, not $+2p$. The constant term is $p^{2} + q^{2}$, not $p^{2} - q^{2}$.",
        "若实系数二次式有非实根 $p + qi$，则它也有根 $p - qi$，由代数基本定理，这就是它全部的根。首项系数为 $1$ 的二次式为\n\n$$\\left(x - (p + qi)\\right)\\left(x - (p - qi)\\right) = x^{2} - 2px + (p^{2} + q^{2})$$\n\n例如根为 $-1 + 4i$ 时：$x^{2} + 2x + 17$。\n\n检验：$(-1 + 4i)^{2} + 2(-1 + 4i) + 17 = (-15 - 8i) + (-2 + 8i) + 17 = 0$。\n\n> **注意。** $x$ 的系数是两根之和的相反数 $-2p$，而不是 $+2p$。常数项是 $p^{2} + q^{2}$，而不是 $p^{2} - q^{2}$。",
      ),
      generate(rng) {
        const p = rng.nonZero(-7, 7);
        const q = rng.nonZero(-7, 7);
        const answer = polyX([1, -2 * p, p * p + q * q]);
        const pq = p * p + q * q;
        const pp = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return expressionProblem({
          prompt: t(
            `Find the quadratic $p(x)$ with real coefficients and leading coefficient $1$ that has $${cx(p, q)}$ as a root.`,
            `求首项系数为 $1$ 的实系数二次多项式 $p(x)$，使 $${cx(p, q)}$ 是它的一个根。`,
          ),
          answer,
          simplified: true,
          prefix: "p(x) =",
          wrong: [polyX([1, 2 * p, pq]), polyX([1, -2 * p, p * p - q * q]), polyX([1, -p, pq])],
          solution: walked(
            [
              [
                ["Use the conjugate", "利用共轭"],
                t(
                  `The coefficients are real, so the conjugate $${cx(p, -q)}$ is also a root, and there are no others.`,
                  `系数是实数，所以共轭 $${cx(p, -q)}$ 也是根，此外再无别的根。`,
                ),
              ],
              [
                ["Find the sum and the product", "求和与积"],
                t(`Add and multiply the two roots:`, `把两根相加、相乘：`),
                [`\\text{sum} = ${2 * p}, \\qquad \\text{product} = ${pp(p)}^{2} + ${pp(q)}^{2} = ${pq}`],
              ],
              [
                ["Write the quadratic", "写出二次式"],
                t(
                  `A monic quadratic is $x^{2} - (\\text{sum})x + \\text{product}$:`,
                  `首项系数为 $1$ 的二次式是 $x^{2} - (\\text{和})x + \\text{积}$：`,
                ),
                [`p(x) = ${answer}`],
              ],
            ],
            t(
              `Substitute the root $${cx(p, q)}$. Its square is $${cx(p * p - q * q, 2 * p * q)}$, and $${-2 * p}$ times it is $${cx(-2 * p * p, -2 * p * q)}$, so\n\n$$\\left(${cx(p * p - q * q, 2 * p * q)}\\right) + \\left(${cx(-2 * p * p, -2 * p * q)}\\right) + ${pq} = 0$$\n\nThe root satisfies $p(x) = 0$, as it must.`,
              `代入根 $${cx(p, q)}$。它的平方是 $${cx(p * p - q * q, 2 * p * q)}$，它的 $${-2 * p}$ 倍是 $${cx(-2 * p * p, -2 * p * q)}$，所以\n\n$$\\left(${cx(p * p - q * q, 2 * p * q)}\\right) + \\left(${cx(-2 * p * p, -2 * p * q)}\\right) + ${pq} = 0$$\n\n这个根满足 $p(x) = 0$，正应如此。`,
            ),
          ),
        });
      },
    },
  ],
};

/** cubicFrom is (x − r)(x² + bx + c), highest power first. */
const cubicFrom = (r: number, b: number, c: number) => mulP([1, -r], [1, b, c]);

/** theFundamentalTheoremOfAlgebraWithCubicEquations covers the root structure of real cubics. */
export const theFundamentalTheoremOfAlgebraWithCubicEquations: TopicDef = {
  id: "the-fundamental-theorem-of-algebra-with-cubic-equations",
  title: t("The Fundamental Theorem of Algebra with Cubic Equations", "三次方程的代数基本定理"),
  summary: t(
    "Apply the fundamental theorem of algebra to cubics: a cubic has three complex roots counted with multiplicity, a real cubic has one or three real roots because nonreal roots come in conjugate pairs, and a real cubic can be built or completed from known roots.",
    "把代数基本定理应用于三次多项式：三次式按重数计有三个复数根；由于非实根成对共轭出现，实系数三次式有一个或三个实根；并能由已知根构造或补全实系数三次式。",
  ),
  prerequisites: ["the-fundamental-theorem-of-algebra-for-quadratic-equations", "the-factor-theorem"],
  encompasses: [{ topic: "the-fundamental-theorem-of-algebra-for-quadratic-equations", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.C.9"],
  intro: t(
    `A quadratic has exactly two complex roots, and by the factor theorem each root $r$ of a polynomial gives a factor $x - r$. Together these settle a cubic once one factor is known. For example,

$$x^{3} - x^{2} + x - 1 = (x - 1)(x^{2} + 1)$$

so the roots are $1$ from the linear factor and $\\pm i$ from the quadratic factor: three roots in all.

Check: $(x - 1)(x^{2} + 1) = x^{3} + x - x^{2} - 1$, and at $x = i$ the cubic is $-i + 1 + i - 1 = 0$.

In this lesson we see that every cubic has exactly three complex roots counted with multiplicity, that a real cubic has one or three real roots, and how to find or build a real cubic from known roots.`,
    `二次式恰有两个复数根；由因式定理，多项式的每个根 $r$ 给出一个因式 $x - r$。知道一个因式后，二者合起来就能确定三次式的全部根。例如

$$x^{3} - x^{2} + x - 1 = (x - 1)(x^{2} + 1)$$

所以一次因式给出根 $1$，二次因式给出根 $\\pm i$，一共三个根。

检验：$(x - 1)(x^{2} + 1) = x^{3} + x - x^{2} - 1$，而 $x = i$ 时三次式的值为 $-i + 1 + i - 1 = 0$。

这节课我们看到，每个三次式按重数计恰有三个复数根，实系数三次式有一个或三个实根，并学习由已知根求出或构造实系数三次式。`,
  ),
  knowledgePoints: [
    {
      id: "counting-the-roots-of-a-cubic",
      title: t("Count the real and nonreal roots of a cubic", "统计三次方程的实根与非实根"),
      explanation: t(
        "A cubic has exactly three complex roots counted with multiplicity. With real coefficients, nonreal roots come in conjugate pairs, so a real cubic has either\n\n- three real roots (some possibly repeated), or\n- one real root and two nonreal conjugate roots.\n\nFor $(x - 2)(x^{2} + 2x + 5)$, the quadratic factor has discriminant $4 - 20 < 0$, so there is one real root, $2$, and two nonreal roots, $-1 \\pm 2i$.\n\nCheck: $(-1 + 2i)^{2} + 2(-1 + 2i) + 5 = (-3 - 4i) + (-2 + 4i) + 5 = 0$, so $-1 + 2i$ really is a root.\n\n> **Watch out.** A repeated root counts once among the distinct roots but twice towards the total of three. A real cubic always has at least one real root, because nonreal roots come in pairs.",
        "三次式按重数计恰有三个复数根。系数为实数时，非实根成对共轭出现，所以实系数三次式要么\n\n- 有三个实根（可能有重根），要么\n- 有一个实根和两个互为共轭的非实根。\n\n对 $(x - 2)(x^{2} + 2x + 5)$，二次因式的判别式 $4 - 20 < 0$，所以有一个实根 $2$ 和两个非实根 $-1 \\pm 2i$。\n\n检验：$(-1 + 2i)^{2} + 2(-1 + 2i) + 5 = (-3 - 4i) + (-2 + 4i) + 5 = 0$，所以 $-1 + 2i$ 确实是根。\n\n> **注意。** 重根在统计不同的根时只算一次，但在三个根的总数里算两次。实系数三次式至少有一个实根，因为非实根成对出现。",
      ),
      generate(rng) {
        const r = rng.int(-6, 6);
        const q = quadKind(rng);
        const p = r === 0 ? `x(${quadTex(q)})` : `(${linear(1, -r)})(${quadTex(q)})`;
        const reals = new Set([`${r}`, ...q.reals]).size;
        const kind = rng.pick(["nonreal", "distinct"] as const);
        const disc = q.b * q.b - 4 * q.c;
        const answer = kind === "nonreal" ? q.nonreal : reals;
        const what = kind === "nonreal" ? t("nonreal roots", "非实根") : t("distinct real roots", "不同的实根");
        const minus4c = 4 * q.c < 0 ? `(${4 * q.c})` : `${4 * q.c}`;
        const realList = [`${r}`, ...quadRealRoots(q)].join(", \\; ");
        const kindEn = disc < 0 ? "two nonreal conjugate roots" : disc === 0 ? "one repeated real root" : "two distinct real roots";
        const kindZh = disc < 0 ? "两个互为共轭的非实根" : disc === 0 ? "一个二重实根" : "两个不相等的实根";
        return numberProblem({
          prompt: t(`How many ${what.en} does $${p} = 0$ have?`, `方程 $${p} = 0$ 有多少个${what["zh-CN"]}？`),
          answer,
          form: "integer",
          wrong: [3, 1, 2, 0],
          solution: walked(
            [
              [
                ["Use the linear factor", "看一次因式"],
                t(`The factor $${linear(1, -r)}$ gives the real root $${r}$.`, `因式 $${linear(1, -r)}$ 给出实根 $${r}$。`),
              ],
              [
                ["Classify the quadratic factor", "判断二次因式"],
                t(`The discriminant of $${quadTex(q)}$ is`, `$${quadTex(q)}$ 的判别式为`),
                [`b^{2} - 4ac = ${q.b * q.b} - ${minus4c} = ${disc}`],
              ],
              [
                ["Count", "计数"],
                t(
                  `So the quadratic factor has ${kindEn}. Altogether the equation has $${reals}$ distinct real root${reals === 1 ? "" : "s"} and $${q.nonreal}$ nonreal roots, so the answer is $${answer}$.`,
                  `所以二次因式有${kindZh}。整个方程共有 $${reals}$ 个不同的实根和 $${q.nonreal}$ 个非实根，所以答案是 $${answer}$。`,
                ),
              ],
            ],
            t(
              `Count all three roots with multiplicity. Nonreal roots come in conjugate pairs, so there are $0$ or $2$ of them; here there are $${q.nonreal}$, and the remaining $${3 - q.nonreal}$ roots are real:\n\n$$${realList}$$\n\nRemoving repeats leaves $${reals}$ distinct real root${reals === 1 ? "" : "s"}, and the total is three, as the fundamental theorem of algebra requires.`,
              `按重数统计全部三个根。非实根成对共轭出现，只能有 $0$ 个或 $2$ 个；这里有 $${q.nonreal}$ 个，其余 $${3 - q.nonreal}$ 个根是实数：\n\n$$${realList}$$\n\n去掉重复后剩下 $${reals}$ 个不同的实根，总数是三，符合代数基本定理。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-real-root-from-a-nonreal-root",
      title: t("Find the real root from a nonreal root", "由一个非实根求实根"),
      explanation: t(
        "If a real cubic $x^{3} + bx^{2} + cx + d$ has the nonreal root $p + qi$, it also has $p - qi$, and the third root $r$ is real. By Vieta's formulas the three roots sum to $-b$:\n\n$$r + (p + qi) + (p - qi) = -b \\quad\\Rightarrow\\quad r = -b - 2p$$\n\nFor $x^{3} - 5x^{2} + 17x - 13$ with root $2 + 3i$: $r = 5 - 4 = 1$.\n\nCheck: $1 - 5 + 17 - 13 = 0$, so $1$ is a root.\n\n> **Watch out.** The roots sum to $-b$, not $b$. Count the conjugate too: the two nonreal roots together contribute $2p$, not $p$.",
        "若实系数三次式 $x^{3} + bx^{2} + cx + d$ 有非实根 $p + qi$，则它也有根 $p - qi$，第三个根 $r$ 为实数。由韦达定理，三根之和为 $-b$：\n\n$$r + (p + qi) + (p - qi) = -b \\quad\\Rightarrow\\quad r = -b - 2p$$\n\n例如，$x^{3} - 5x^{2} + 17x - 13$ 有根 $2 + 3i$，则 $r = 5 - 4 = 1$。\n\n检验：$1 - 5 + 17 - 13 = 0$，所以 $1$ 是根。\n\n> **注意。** 三根之和是 $-b$，不是 $b$。别忘了共轭根：两个非实根合起来贡献 $2p$，而不是 $p$。",
      ),
      generate(rng) {
        const r = rng.nonZero(-6, 6);
        const h = rng.int(-4, 4);
        const c = rng.int(1, 5);
        const N = h * h + c * c;
        const coeffs = cubicFrom(r, -2 * h, N);
        const p = polyX(coeffs);
        const b = coeffs[1]!;
        const d = coeffs[3]!;
        const twoH = 2 * h < 0 ? `(${2 * h})` : `${2 * h}`;
        const pr = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return numberProblem({
          prompt: t(
            `The polynomial $${p}$ has the root $${cx(h, c)}$. Find its real root.`,
            `多项式 $${p}$ 有一个根 $${cx(h, c)}$。求它的实根。`,
          ),
          answer: r,
          form: "integer",
          wrong: [-b, -r, -b + 2 * h, b - 2 * h],
          solution: walked(
            [
              [
                ["Use the conjugate", "利用共轭"],
                t(
                  `The coefficients are real, so the conjugate $${cx(h, -c)}$ is also a root. Together the two contribute $${2 * h}$ to the sum of the roots.`,
                  `系数是实数，所以共轭 $${cx(h, -c)}$ 也是根。两者合起来为根的和贡献 $${2 * h}$。`,
                ),
              ],
              [
                ["Use the sum of the roots", "利用根的和"],
                t(
                  `The three roots sum to minus the coefficient of $x^{2}$, which is $${-b}$:`,
                  `三根之和等于 $x^{2}$ 系数的相反数，即 $${-b}$：`,
                ),
                [`r + ${twoH} = ${-b} \\quad\\Rightarrow\\quad r = ${r}`],
              ],
            ],
            t(
              `Use the product of the roots instead. The nonreal pair multiplies to $${h * h} + ${c * c} = ${N}$, and the three roots multiply to minus the constant term:\n\n$$${pr(r)} \\cdot ${N} = ${r * N} = -${pr(d)}$$\n\nThe product agrees, so the real root is $${r}$.`,
              `改用根的积。这对非实根之积为 $${h * h} + ${c * c} = ${N}$，三根之积等于常数项的相反数：\n\n$$${pr(r)} \\cdot ${N} = ${r * N} = -${pr(d)}$$\n\n积也吻合，所以实根是 $${r}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "building-a-real-cubic-from-its-roots",
      title: t("Build a real cubic from given roots", "由已知根构造实系数三次式"),
      explanation: t(
        "A monic cubic with real coefficients and the roots $r$ and $p + qi$ must also have $p - qi$, so\n\n$$p(x) = (x - r)\\left(x^{2} - 2px + p^{2} + q^{2}\\right)$$\n\nFor the roots $3$ and $1 - i$: $(x - 3)(x^{2} - 2x + 2) = x^{3} - 5x^{2} + 8x - 6$.\n\nCheck: the roots $3$, $1 - i$ and $1 + i$ sum to $5$, minus the coefficient of $x^{2}$, and multiply to $3 \\cdot 2 = 6$, minus the constant term.\n\n> **Watch out.** The root $r$ gives the factor $x - r$, not $x + r$. The conjugate pair gives the constant $p^{2} + q^{2}$, not $p^{2} - q^{2}$.",
        "首项系数为 $1$、有实根 $r$ 与非实根 $p + qi$ 的实系数三次式也必有根 $p - qi$，所以\n\n$$p(x) = (x - r)\\left(x^{2} - 2px + p^{2} + q^{2}\\right)$$\n\n例如根为 $3$ 与 $1 - i$ 时：$(x - 3)(x^{2} - 2x + 2) = x^{3} - 5x^{2} + 8x - 6$。\n\n检验：三个根 $3$、$1 - i$、$1 + i$ 之和为 $5$，等于 $x^{2}$ 系数的相反数；之积为 $3 \\cdot 2 = 6$，等于常数项的相反数。\n\n> **注意。** 根 $r$ 给出因式 $x - r$，而不是 $x + r$。共轭的一对根给出常数项 $p^{2} + q^{2}$，而不是 $p^{2} - q^{2}$。",
      ),
      generate(rng) {
        const r = rng.nonZero(-5, 5);
        const h = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const N = h * h + c * c;
        const coeffs = cubicFrom(r, -2 * h, N);
        const answer = polyX(coeffs);
        const quad = polyX([1, -2 * h, N]);
        return expressionProblem({
          prompt: t(
            `Find the cubic $p(x)$ with real coefficients and leading coefficient $1$ whose roots include $${r}$ and $${cx(h, c)}$. Write it in expanded form.`,
            `求首项系数为 $1$ 的实系数三次多项式 $p(x)$，使 $${r}$ 与 $${cx(h, c)}$ 都是它的根，并写成展开式。`,
          ),
          answer,
          simplified: true,
          prefix: "p(x) =",
          wrong: [polyX(cubicFrom(-r, -2 * h, N)), polyX(cubicFrom(r, 2 * h, N)), polyX(cubicFrom(r, -2 * h, h * h - c * c))],
          solution: walked(
            [
              [
                ["Pair the nonreal roots", "配成共轭对"],
                t(
                  `The coefficients are real, so the conjugate $${cx(h, -c)}$ is the third root. The pair sums to $${2 * h}$ and multiplies to $${h * h} + ${c * c} = ${N}$, so it gives the factor`,
                  `系数是实数，所以共轭 $${cx(h, -c)}$ 是第三个根。这对根之和为 $${2 * h}$，之积为 $${h * h} + ${c * c} = ${N}$，所以给出因式`,
                ),
                [quad],
              ],
              [
                ["Multiply by the real factor", "乘以实根的因式"],
                t(`The root $${r}$ gives the factor $${linear(1, -r)}$:`, `根 $${r}$ 给出因式 $${linear(1, -r)}$：`),
                [`p(x) = (${linear(1, -r)})(${quad}) = ${answer}`],
              ],
            ],
            t(
              `Read the coefficients back with Vieta's formulas. The three roots sum to $${r} + ${2 * h < 0 ? `(${2 * h})` : 2 * h} = ${r + 2 * h}$ and multiply to $${r < 0 ? `(${r})` : r} \\cdot ${N} = ${r * N}$.\n\nThese are minus the coefficient of $x^{2}$, $${coeffs[1]}$, and minus the constant term, $${coeffs[3]}$, as they should be.`,
              `用韦达定理反过来核对系数。三根之和为 $${r} + ${2 * h < 0 ? `(${2 * h})` : 2 * h} = ${r + 2 * h}$，之积为 $${r < 0 ? `(${r})` : r} \\cdot ${N} = ${r * N}$。\n\n它们分别是 $x^{2}$ 系数 $${coeffs[1]}$ 的相反数和常数项 $${coeffs[3]}$ 的相反数，正应如此。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingCubicEquationsWithComplexRoots covers finding all three roots of a cubic, including nonreal ones. */
export const solvingCubicEquationsWithComplexRoots: TopicDef = {
  id: "solving-cubic-equations-with-complex-roots",
  title: t("Solving Cubic Equations With Complex Roots", "解有复数根的三次方程"),
  summary: t(
    "Solve cubic equations completely over the complex numbers: factor sums and differences of cubes, divide out a known root with the factor theorem, or factor by grouping, then solve the remaining quadratic with the quadratic formula.",
    "在复数范围内完整求解三次方程：分解立方和与立方差，或用因式定理除去已知根，或分组分解，再用求根公式解剩下的二次方程。",
  ),
  prerequisites: [
    "the-fundamental-theorem-of-algebra-with-cubic-equations",
    "factoring-cubic-polynomials-using-the-factor-theorem",
    "factoring-sums-and-differences-of-cubes",
  ],
  encompasses: [
    { topic: "factoring-sums-and-differences-of-cubes", weight: 0.3 },
    { topic: "solving-quadratic-equations-with-complex-roots", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.HSN.CN.C.9"],
  intro: t(
    `A real cubic has three complex roots counted with multiplicity, and once one linear factor is split off, the other two roots come from a quadratic. For example, the sum of cubes factors as

$$x^{3} + 1 = (x + 1)(x^{2} - x + 1)$$

so $x = -1$ is a root, and the quadratic formula gives the other two, $x = \\frac{1 \\pm i\\sqrt{3}}{2}$.

Check: the cubic has no $x^{2}$ term, so its three roots must add to $0$, and indeed $-1 + \\frac{1}{2} + \\frac{1}{2} = 0$.

In this lesson we solve cubic equations completely over the complex numbers: by factoring sums and differences of cubes, by dividing out a known root, and by grouping.`,
    `实系数三次式按重数计有三个复数根；分离出一个一次因式后，另外两个根来自一个二次式。例如，立方和可以分解为

$$x^{3} + 1 = (x + 1)(x^{2} - x + 1)$$

所以 $x = -1$ 是根，再由求根公式得到另外两个根 $x = \\frac{1 \\pm i\\sqrt{3}}{2}$。

检验：这个三次式没有 $x^{2}$ 项，所以三个根之和必须为 $0$，而 $-1 + \\frac{1}{2} + \\frac{1}{2} = 0$ 确实成立。

这节课我们在复数范围内完整求解三次方程：分解立方和与立方差、除去已知根，以及分组分解。`,
  ),
  knowledgePoints: [
    {
      id: "cubes-equal-to-a-constant",
      title: t("Solve $x^3 = \\pm k^3$", "解 $x^3 = \\pm k^3$"),
      explanation: t(
        "Factor a difference or sum of cubes and solve the quadratic factor:\n\n$$x^{3} - 8 = (x - 2)(x^{2} + 2x + 4) = 0$$\n\nThe linear factor gives $x = 2$; the quadratic gives\n\n$$x = \\frac{-2 \\pm \\sqrt{4 - 16}}{2} = \\frac{-2 \\pm 2i\\sqrt{3}}{2} = -1 \\pm i\\sqrt{3}$$\n\nSo $x^{3} = 8$ has three solutions, as the fundamental theorem of algebra requires: the three cube roots of $8$.\n\nCheck: $(-1 + i\\sqrt{3})^{2} = -2 - 2i\\sqrt{3}$, and multiplying by $-1 + i\\sqrt{3}$ once more gives $2 + 6 = 8$.\n\n> **Watch out.** The quadratic factor of $x^{3} - k^{3}$ is $x^{2} + kx + k^{2}$, and that of $x^{3} + k^{3}$ is $x^{2} - kx + k^{2}$: the middle sign is opposite to the sign in the linear factor. Do not stop at the one real root.",
        "分解立方差或立方和，再解其中的二次因式：\n\n$$x^{3} - 8 = (x - 2)(x^{2} + 2x + 4) = 0$$\n\n一次因式给出 $x = 2$；二次因式给出\n\n$$x = \\frac{-2 \\pm \\sqrt{4 - 16}}{2} = \\frac{-2 \\pm 2i\\sqrt{3}}{2} = -1 \\pm i\\sqrt{3}$$\n\n所以正如代数基本定理所要求的，$x^{3} = 8$ 有三个解，即 $8$ 的三个立方根。\n\n检验：$(-1 + i\\sqrt{3})^{2} = -2 - 2i\\sqrt{3}$，再乘一次 $-1 + i\\sqrt{3}$ 得 $2 + 6 = 8$。\n\n> **注意。** $x^{3} - k^{3}$ 的二次因式是 $x^{2} + kx + k^{2}$，$x^{3} + k^{3}$ 的二次因式是 $x^{2} - kx + k^{2}$：中间项的符号与一次因式中的符号相反。不要只求出那一个实根就停下。",
      ),
      keyPrerequisites: ["factoring-sums-and-differences-of-cubes"],
      generate(rng) {
        const j = rng.int(1, 4);
        const k = 2 * j;
        const a = rng.pick([1, 2, 3]);
        const plus = rng.bool();
        const lead = a === 1 ? "" : String(a);
        const eq = rng.bool() ? `${lead}x^{3} ${plus ? "+" : "-"} ${a * k ** 3} = 0` : `${lead}x^{3} = ${plus ? -a * k ** 3 : a * k ** 3}`;
        const s = plus ? 1 : -1;
        const answer = cxr(s * j, j, 3);
        const lin = linear(1, s * k);
        const quad = polyX([1, -s * k, k * k]);
        const jj = j === 1 ? "" : j;
        const pr = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return expressionProblem({
          prompt: t(
            `Solve $${eq}$ over the complex numbers. Enter the nonreal solution with a positive imaginary part.`,
            `在复数范围内解方程 $${eq}$。请输入虚部为正的那个非实数解。`,
          ),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [cxr(-s * j, j, 3), cxr(s * j, j, 1), cxr(s * k, k, 3), cxr(0, k, 1)],
          solution: walked(
            [
              [
                ["Factor the cubes", "分解立方"],
                t(
                  `${a === 1 ? "Write the equation" : `Divide by $${a}$ and write the equation`} as $x^{3} ${plus ? "+" : "-"} ${k ** 3} = 0$, a ${plus ? "sum" : "difference"} of cubes with $${k ** 3} = ${k}^{3}$:`,
                  `${a === 1 ? "把方程写成" : `两边除以 $${a}$，把方程写成`} $x^{3} ${plus ? "+" : "-"} ${k ** 3} = 0$，这是立方${plus ? "和" : "差"}，$${k ** 3} = ${k}^{3}$：`,
                ),
                [`(${lin})(${quad}) = 0`],
              ],
              [
                ["Solve the quadratic factor", "解二次因式"],
                t(`The linear factor gives $x = ${-s * k}$. The quadratic formula gives`, `一次因式给出 $x = ${-s * k}$。求根公式给出`),
                [
                  `x = \\frac{${s * k} \\pm \\sqrt{${k * k} - ${4 * k * k}}}{2} = \\frac{${s * k} \\pm ${2 * j}i\\sqrt{3}}{2} = ${s * j} \\pm ${jj}i\\sqrt{3}`,
                ],
              ],
              [
                ["Pick the solution", "选出所求的解"],
                t(`The nonreal solution with a positive imaginary part is $${answer}$.`, `虚部为正的非实数解是 $${answer}$。`),
              ],
            ],
            t(
              `Use the sizes and the sum of the roots. Every cube root of $${plus ? "-" : ""}${k ** 3}$ has modulus $${k}$, and for this solution\n\n$$|x|^{2} = ${pr(s * j)}^{2} + \\left(${jj}\\sqrt{3}\\right)^{2} = ${j * j} + ${3 * j * j} = ${k * k}$$\n\nThe cubic has no $x^{2}$ term, so the three roots add to $0$, and indeed $${-s * k} + 2 \\cdot ${pr(s * j)} = 0$.`,
              `用模与根的和来核对。$${plus ? "-" : ""}${k ** 3}$ 的每个立方根的模都是 $${k}$，而对这个解有\n\n$$|x|^{2} = ${pr(s * j)}^{2} + \\left(${jj}\\sqrt{3}\\right)^{2} = ${j * j} + ${3 * j * j} = ${k * k}$$\n\n三次式没有 $x^{2}$ 项，所以三个根之和为 $0$，而 $${-s * k} + 2 \\cdot ${pr(s * j)} = 0$ 确实成立。`,
            ),
          ),
        });
      },
    },
    {
      id: "dividing-out-a-known-root",
      title: t("Divide out a known root", "除去已知根"),
      explanation: t(
        "If $x = r$ is a root, the factor theorem says $x - r$ is a factor. Divide (for example with synthetic division) to get a quadratic, then solve it with the quadratic formula. For $x^{3} - 4x^{2} + 9x - 10 = 0$ with root $x = 2$:\n\n$$x^{3} - 4x^{2} + 9x - 10 = (x - 2)(x^{2} - 2x + 5), \\qquad x = \\frac{2 \\pm \\sqrt{4 - 20}}{2} = 1 \\pm 2i$$\n\nCheck: the three roots $2$, $1 + 2i$ and $1 - 2i$ add to $4$ and multiply to $2 \\cdot 5 = 10$, minus the coefficient of $x^{2}$ and minus the constant term.\n\n> **Watch out.** The root $x = r$ gives the factor $x - r$, so divide by $x - 2$ here, not by $x + 2$. A negative discriminant means the other two roots are nonreal; it does not mean there are no more roots.",
        "若 $x = r$ 是根，由因式定理，$x - r$ 是因式。做除法（例如综合除法）得到二次式，再用求根公式求解。对 $x^{3} - 4x^{2} + 9x - 10 = 0$，已知根 $x = 2$：\n\n$$x^{3} - 4x^{2} + 9x - 10 = (x - 2)(x^{2} - 2x + 5), \\qquad x = \\frac{2 \\pm \\sqrt{4 - 20}}{2} = 1 \\pm 2i$$\n\n检验：三个根 $2$、$1 + 2i$、$1 - 2i$ 之和为 $4$，之积为 $2 \\cdot 5 = 10$，分别等于 $x^{2}$ 系数的相反数和常数项的相反数。\n\n> **注意。** 根 $x = r$ 给出因式 $x - r$，所以这里要除以 $x - 2$，而不是 $x + 2$。判别式为负说明另外两个根是非实数，而不是说没有别的根。",
      ),
      keyPrerequisites: ["factoring-cubic-polynomials-using-the-factor-theorem"],
      generate(rng) {
        const r = rng.nonZero(-5, 5);
        const h = rng.int(-4, 4);
        const [c, m] = rng.pick(IMAG);
        const N = h * h + c * c * m;
        const coeffs = cubicFrom(r, -2 * h, N);
        const eq = `${polyX(coeffs)} = 0`;
        const quad = polyX([1, -2 * h, N]);
        const answer = cxr(h, c, m);
        const disc = 4 * h * h - 4 * N;
        const [c2, m2] = simplifyRadical(-disc);
        const pr = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return expressionProblem({
          prompt: t(
            `One solution of $${eq}$ is $x = ${r}$. Find the nonreal solution with a positive imaginary part.`,
            `方程 $${eq}$ 的一个解是 $x = ${r}$。求虚部为正的那个非实数解。`,
          ),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [cxr(-h, c, m), cxr(h, 2 * c, m), cxr(2 * h, c2, m2)],
          solution: walked(
            [
              [
                ["Divide out the known root", "除去已知根"],
                t(
                  `By the factor theorem $${linear(1, -r)}$ is a factor. Dividing by it leaves a quadratic:`,
                  `由因式定理，$${linear(1, -r)}$ 是因式。除以它后剩下一个二次式：`,
                ),
                [`${polyX(coeffs)} = (${linear(1, -r)})(${quad})`],
              ],
              [
                ["Solve the quadratic", "解二次式"],
                t(`Apply the quadratic formula to $${quad} = 0$:`, `对 $${quad} = 0$ 用求根公式：`),
                [`x = \\frac{${2 * h} \\pm \\sqrt{${disc}}}{2} = \\frac{${2 * h} \\pm ${iTex(c2, m2)}}{2} = ${h} \\pm ${iTex(c, m)}`],
              ],
              [
                ["Pick the solution", "选出所求的解"],
                t(`The solution with a positive imaginary part is $${answer}$.`, `虚部为正的解是 $${answer}$。`),
              ],
            ],
            t(
              `Use Vieta's formulas on the original cubic. The roots $${r}$ and $${h} \\pm ${iTex(c, m)}$ should add to minus the coefficient of $x^{2}$ and multiply to minus the constant term:\n\n$$${r} + ${pr(2 * h)} = ${r + 2 * h}, \\qquad ${pr(r)} \\cdot ${N} = ${r * N}$$\n\nThe cubic has $${coeffs[1]}$ as the coefficient of $x^{2}$ and $${coeffs[3]}$ as the constant term, so both agree.`,
              `对原三次式用韦达定理。根 $${r}$ 与 $${h} \\pm ${iTex(c, m)}$ 之和应等于 $x^{2}$ 系数的相反数，之积应等于常数项的相反数：\n\n$$${r} + ${pr(2 * h)} = ${r + 2 * h}, \\qquad ${pr(r)} \\cdot ${N} = ${r * N}$$\n\n三次式的 $x^{2}$ 系数是 $${coeffs[1]}$，常数项是 $${coeffs[3]}$，两者都吻合。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-cubics-by-grouping",
      title: t("Solve cubics by grouping", "用分组分解法解三次方程"),
      explanation: t(
        "Grouping works when the first two terms and the last two terms share the same binomial factor after taking out their common factors. When the coefficients come in proportional pairs, group them:\n\n$$x^{3} - 3x^{2} + 4x - 12 = x^{2}(x - 3) + 4(x - 3) = (x - 3)(x^{2} + 4)$$\n\nThen $x = 3$ or $x^{2} = -4$, that is $x = \\pm 2i$.\n\nCheck: at $x = 2i$ the cubic is $-8i + 12 + 8i - 12 = 0$.\n\n> **Watch out.** $x^{2} = -4$ gives $x = \\pm 2i$, not $\\pm 2$ or $\\pm 4i$. Take the common factor of the last two terms with its sign, so that the same binomial appears twice.",
        "当前两项和后两项各自提出公因式后剩下相同的二项式时，就可以用分组分解法。当系数成比例地两两成组时，分组分解：\n\n$$x^{3} - 3x^{2} + 4x - 12 = x^{2}(x - 3) + 4(x - 3) = (x - 3)(x^{2} + 4)$$\n\n于是 $x = 3$，或 $x^{2} = -4$，即 $x = \\pm 2i$。\n\n检验：$x = 2i$ 时三次式的值为 $-8i + 12 + 8i - 12 = 0$。\n\n> **注意。** $x^{2} = -4$ 给出 $x = \\pm 2i$，而不是 $\\pm 2$ 或 $\\pm 4i$。提取后两项的公因式时要连同符号一起提，使同一个二项式出现两次。",
      ),
      generate(rng) {
        const r = rng.nonZero(-9, 9);
        const [c, m] = rng.pick(IMAG);
        const n = c * c * m;
        const eq = `${polyX([1, -r, n, -r * n])} = 0`;
        const answer = iTex(c, m);
        return expressionProblem({
          prompt: t(
            `Solve $${eq}$ over the complex numbers. Enter the nonreal solution with a positive imaginary part.`,
            `在复数范围内解方程 $${eq}$。请输入虚部为正的那个非实数解。`,
          ),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [poly([c, m === 1 ? "" : `\\sqrt{${m}}`]), poly([n, "i"]), poly([Math.abs(r), "i"])],
          solution: walked(
            [
              [
                ["Group the terms", "分组"],
                t(`Take $x^{2}$ out of the first two terms and $${n}$ out of the last two:`, `从前两项提出 $x^{2}$，从后两项提出 $${n}$：`),
                [`x^{2}(${linear(1, -r)}) + ${n}(${linear(1, -r)}) = (${linear(1, -r)})(x^{2} + ${n}) = 0`],
              ],
              [
                ["Solve each factor", "解每个因式"],
                t(`Either factor can be zero:`, `任一因式都可以为零：`),
                [`x = ${r} \\quad\\text{or}\\quad x^{2} = -${n} \\;\\Rightarrow\\; x = \\pm ${answer}`],
              ],
              [
                ["Pick the solution", "选出所求的解"],
                t(`The nonreal solution with a positive imaginary part is $${answer}$.`, `虚部为正的非实数解是 $${answer}$。`),
              ],
            ],
            t(
              `Substitute $x = ${answer}$. Then $x^{2} = -${n}$ and $x^{3} = -${n}x$, so the left side becomes\n\n$$-${n}x - ${r < 0 ? `(${r})` : r} \\cdot (-${n}) + ${n}x - ${r < 0 ? `(${r * n})` : r * n} = 0$$\n\nThe terms in $x$ cancel and so do the constants, so $${answer}$ is a solution.`,
              `代入 $x = ${answer}$。此时 $x^{2} = -${n}$，$x^{3} = -${n}x$，所以左边化为\n\n$$-${n}x - ${r < 0 ? `(${r})` : r} \\cdot (-${n}) + ${n}x - ${r < 0 ? `(${r * n})` : r * n} = 0$$\n\n含 $x$ 的项相消，常数项也相消，所以 $${answer}$ 是解。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theFundamentalTheoremOfAlgebraWithQuarticEquations covers the root structure of real quartics. */
export const theFundamentalTheoremOfAlgebraWithQuarticEquations: TopicDef = {
  id: "the-fundamental-theorem-of-algebra-with-quartic-equations",
  title: t("The Fundamental Theorem of Algebra with Quartic Equations", "四次方程的代数基本定理"),
  summary: t(
    "Apply the fundamental theorem of algebra to quartics: a quartic has four complex roots counted with multiplicity, a real quartic has 0, 2 or 4 nonreal roots in conjugate pairs, and its coefficients follow from its roots.",
    "把代数基本定理应用于四次多项式：四次式按重数计有四个复数根；实系数四次式的非实根成对共轭出现，个数为 0、2 或 4；其系数可由根求出。",
  ),
  prerequisites: ["the-fundamental-theorem-of-algebra-with-cubic-equations"],
  encompasses: [{ topic: "the-fundamental-theorem-of-algebra-with-cubic-equations", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.C.9"],
  intro: t(
    `A real cubic has three complex roots, with its nonreal roots in conjugate pairs. The same reasoning reaches one degree higher. For example,

$$x^{4} - 3x^{2} - 4 = (x^{2} + 1)(x^{2} - 4)$$

so the roots are $\\pm i$ from the first factor and $\\pm 2$ from the second: four roots, one of them a conjugate pair.

Check: at $x = i$ we get $i^{4} - 3i^{2} - 4 = 1 + 3 - 4 = 0$.

In this lesson we see that every quartic has exactly four complex roots counted with multiplicity, that a real quartic has $0$, $2$ or $4$ nonreal roots, and how its coefficients follow from its roots.`,
    `实系数三次式有三个复数根，其中的非实根成对共轭出现。同样的道理可以推广到高一次的多项式。例如

$$x^{4} - 3x^{2} - 4 = (x^{2} + 1)(x^{2} - 4)$$

所以第一个因式给出根 $\\pm i$，第二个因式给出根 $\\pm 2$：一共四个根，其中一对互为共轭。

检验：$x = i$ 时，$i^{4} - 3i^{2} - 4 = 1 + 3 - 4 = 0$。

这节课我们看到，每个四次式按重数计恰有四个复数根，实系数四次式有 $0$、$2$ 或 $4$ 个非实根，并学习由根求出它的系数。`,
  ),
  knowledgePoints: [
    {
      id: "counting-the-roots-of-a-quartic",
      title: t("Count the real and nonreal roots of a quartic", "统计四次方程的实根与非实根"),
      explanation: t(
        "A quartic has exactly four complex roots counted with multiplicity. With real coefficients the nonreal roots pair up with their conjugates, so there are $0$, $2$ or $4$ nonreal roots, and $4$, $2$ or $0$ real roots counted with multiplicity. When the quartic is a product of two real quadratics, check each discriminant: $(x^{2} - 1)(x^{2} + 2x + 2)$ has the real roots $\\pm 1$ and the nonreal roots $-1 \\pm i$.\n\nCheck: the discriminants are $0 + 4 = 4 > 0$ and $4 - 8 = -4 < 0$, so each factor gives two roots, four in all.\n\n> **Watch out.** A real quartic never has exactly $1$ or $3$ nonreal roots. A root shared by both factors, or repeated in one, counts once among the distinct real roots.",
        "四次式按重数计恰有四个复数根。系数为实数时，非实根与其共轭成对出现，所以非实根有 $0$、$2$ 或 $4$ 个，实根（按重数计）有 $4$、$2$ 或 $0$ 个。当四次式是两个实系数二次式之积时，分别检查判别式：$(x^{2} - 1)(x^{2} + 2x + 2)$ 有实根 $\\pm 1$ 和非实根 $-1 \\pm i$。\n\n检验：两个判别式分别为 $0 + 4 = 4 > 0$ 与 $4 - 8 = -4 < 0$，所以每个因式给出两个根，一共四个。\n\n> **注意。** 实系数四次式的非实根不可能恰好是 $1$ 个或 $3$ 个。两个因式共有的根，或一个因式的重根，在统计不同的实根时只算一次。",
      ),
      generate(rng) {
        const q1 = quadKind(rng);
        const q2 = quadKind(rng);
        const p = `(${quadTex(q1)})(${quadTex(q2)})`;
        const kind = rng.pick(["nonreal", "distinct"] as const);
        const nonreal = q1.nonreal + q2.nonreal;
        const reals = new Set([...q1.reals, ...q2.reals]).size;
        const answer = kind === "nonreal" ? nonreal : reals;
        const what = kind === "nonreal" ? t("nonreal roots", "非实根") : t("distinct real roots", "不同的实根");
        const d = (q: QuadKind) => q.b * q.b - 4 * q.c;
        const line = (q: QuadKind) => `${q.b * q.b} - ${4 * q.c < 0 ? `(${4 * q.c})` : 4 * q.c} = ${d(q)}`;
        const gives = (q: QuadKind): Text =>
          d(q) < 0
            ? t("two nonreal conjugate roots", "两个互为共轭的非实根")
            : d(q) === 0
              ? t("one repeated real root", "一个二重实根")
              : t("two distinct real roots", "两个不相等的实根");
        const realList = [...quadRealRoots(q1), ...quadRealRoots(q2)].join(", \\; ");
        const plural = reals === 1 ? "" : "s";
        return numberProblem({
          prompt: t(`How many ${what.en} does $${p} = 0$ have?`, `方程 $${p} = 0$ 有多少个${what["zh-CN"]}？`),
          answer,
          form: "integer",
          wrong: [4, 2, 0, 3, 1],
          solution: walked(
            [
              [
                ["Compute the discriminants", "计算判别式"],
                t(`For $${quadTex(q1)}$ and $${quadTex(q2)}$ the discriminants are`, `$${quadTex(q1)}$ 与 $${quadTex(q2)}$ 的判别式分别为`),
                [`\\Delta_{1} = ${line(q1)}, \\qquad \\Delta_{2} = ${line(q2)}`],
              ],
              [
                ["Classify each factor", "判断每个因式"],
                t(
                  `The first factor has ${gives(q1).en}, and the second has ${gives(q2).en}.`,
                  `第一个因式有${gives(q1)["zh-CN"]}，第二个因式有${gives(q2)["zh-CN"]}。`,
                ),
              ],
              [
                ["Count", "计数"],
                t(
                  `Altogether there are $${nonreal}$ nonreal roots and $${reals}$ distinct real root${plural}, so the answer is $${answer}$.`,
                  `共有 $${nonreal}$ 个非实根和 $${reals}$ 个不同的实根，所以答案是 $${answer}$。`,
                ),
              ],
            ],
            realList === ""
              ? t(
                  `Count all four roots with multiplicity. Both factors have negative discriminants, so the roots form two conjugate pairs and none is real.\n\nThat makes $0$ distinct real roots and $4$ nonreal roots, four in all, as the fundamental theorem of algebra requires.`,
                  `按重数统计全部四个根。两个因式的判别式都为负，所以四个根组成两对共轭复数，没有实根。\n\n于是不同的实根有 $0$ 个，非实根有 $4$ 个，一共四个，符合代数基本定理。`,
                )
              : t(
                  `Count all four roots with multiplicity. Nonreal roots come in conjugate pairs, so there are $${nonreal}$ of them, and the remaining $${4 - nonreal}$ roots are real:\n\n$$${realList}$$\n\nRemoving repeats leaves $${reals}$ distinct real root${plural}, and the total is four, as the fundamental theorem of algebra requires.`,
                  `按重数统计全部四个根。非实根成对共轭出现，共 $${nonreal}$ 个，其余 $${4 - nonreal}$ 个根是实数：\n\n$$${realList}$$\n\n去掉重复后剩下 $${reals}$ 个不同的实根，总数是四，符合代数基本定理。`,
                ),
          ),
        });
      },
    },
    {
      id: "the-remaining-roots-of-a-quartic",
      title: t("Find the remaining roots of a real quartic", "求实系数四次方程的其余根"),
      explanation: t(
        "If a real quartic has two nonreal roots that are not conjugates of each other, their conjugates are also roots, and these four are all of its roots. A real quartic with roots $1 + 2i$ and $-3i$ has the other roots $1 - 2i$ and $3i$.\n\nCheck: the pairs multiply to the real quadratics $x^{2} - 2x + 5$ and $x^{2} + 9$, whose product is a real quartic with exactly these four roots.\n\n> **Watch out.** The conjugate of $a + bi$ is $a - bi$: keep the real part and change only the sign of the imaginary part. The negative $-a - bi$ is a different number.",
        "若实系数四次式有两个互不共轭的非实根，则它们的共轭也是根，这四个就是它的全部根。若实系数四次式有根 $1 + 2i$ 与 $-3i$，则其余两根为 $1 - 2i$ 与 $3i$。\n\n检验：两对根分别乘出实系数二次式 $x^{2} - 2x + 5$ 与 $x^{2} + 9$，它们的积是恰好以这四个数为根的实系数四次式。\n\n> **注意。** $a + bi$ 的共轭是 $a - bi$：实部不变，只改变虚部的符号。相反数 $-a - bi$ 是另一个数。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        let c = rng.nonZero(-5, 5);
        let d = rng.nonZero(-5, 5);
        if (c === a && Math.abs(d) === Math.abs(b)) {
          c = a === 5 ? 4 : a === -1 ? 1 : a + 1;
          d = b;
        }
        const pair = (x: string, y: string) => t(`$${x}$ and $${y}$`, `$${x}$ 和 $${y}$`);
        const right = pair(cx(a, -b), cx(c, -d));
        const flipped = pair(cx(-a, b), cx(-c, d));
        const negated = pair(cx(-a, -b), cx(-c, -d));
        const swapped = pair(cx(b, a), cx(d, c));
        const half = pair(cx(a, -b), cx(-c, -d));
        const quad = (h: number, k: number) => polyX([1, -2 * h, h * h + k * k]);
        return oneOf(
          rng,
          t(
            `A polynomial of degree $4$ with real coefficients has the roots $${cx(a, b)}$ and $${cx(c, d)}$. What are its other two roots?`,
            `一个次数为 $4$ 的实系数多项式有根 $${cx(a, b)}$ 和 $${cx(c, d)}$。它的另外两个根是什么？`,
          ),
          right,
          [flipped, negated, swapped, half],
          walked(
            [
              [
                ["Use conjugate pairs", "利用共轭成对"],
                t(
                  `The coefficients are real, so the conjugate of each nonreal root is also a root: $${cx(a, -b)}$ and $${cx(c, -d)}$.`,
                  `系数是实数，所以每个非实根的共轭也是根：$${cx(a, -b)}$ 与 $${cx(c, -d)}$。`,
                ),
              ],
              [
                ["Count the roots", "数根的个数"],
                t(
                  `The two given roots are not conjugates of each other, so these are four different roots, all that a quartic can have.`,
                  `两个已知根互不共轭，所以这是四个不同的根，正是四次多项式全部的根。`,
                ),
              ],
            ],
            t(
              `Multiply the factors $x - z$ of each root and its partner. Each pair gives a quadratic with real coefficients:\n\n$$\\left(x - (${cx(a, b)})\\right)\\left(x - (${cx(a, -b)})\\right) = ${quad(a, b)}$$\n\n$$\\left(x - (${cx(c, d)})\\right)\\left(x - (${cx(c, -d)})\\right) = ${quad(c, d)}$$\n\nTheir product is a real quartic with these four roots, as required.`,
              `把每个根与它的配对根对应的因式 $x - z$ 相乘，每一对都给出实系数二次式：\n\n$$\\left(x - (${cx(a, b)})\\right)\\left(x - (${cx(a, -b)})\\right) = ${quad(a, b)}$$\n\n$$\\left(x - (${cx(c, d)})\\right)\\left(x - (${cx(c, -d)})\\right) = ${quad(c, d)}$$\n\n二者之积是以这四个数为根的实系数四次式，符合要求。`,
            ),
          ),
          [
            why(
              flipped,
              `These are the negatives of the conjugates: the real parts changed sign as well. A conjugate keeps the real part.`,
              `这些是共轭的相反数：实部也变了号。共轭应保持实部不变。`,
            ),
            why(
              negated,
              `These are the negatives of the given roots. The negative of a root need not be a root; the conjugate is.`,
              `这些是已知根的相反数。根的相反数不一定是根，共轭才是。`,
            ),
            why(
              swapped,
              `This swaps the real and imaginary parts. A conjugate keeps the real part and flips only the sign of the imaginary part.`,
              `这里把实部和虚部对调了。共轭保持实部不变，只改变虚部的符号。`,
            ),
            why(
              half,
              `The first root is right, but $${cx(-c, -d)}$ is the negative of $${cx(c, d)}$, not its conjugate $${cx(c, -d)}$.`,
              `第一个根是对的，但 $${cx(-c, -d)}$ 是 $${cx(c, d)}$ 的相反数，而不是它的共轭 $${cx(c, -d)}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "coefficients-of-a-quartic-from-its-roots",
      title: t("Find coefficients of a quartic from its roots", "由根求四次式的系数"),
      explanation: t(
        "Pair each nonreal root with its conjugate to get real quadratic factors, then multiply. A monic real quartic with the roots $2i$ and $1 + 3i$ is\n\n$$(x^{2} + 4)(x^{2} - 2x + 10) = x^{4} - 2x^{3} + 14x^{2} - 8x + 40$$\n\nIts constant term is the product of all four roots, $4 \\cdot 10 = 40$, and the coefficient of $x^{3}$ is minus their sum, $-2$.\n\nCheck: at $x = 1$ the factored form gives $5 \\cdot 9 = 45$ and the expanded form gives $1 - 2 + 14 - 8 + 40 = 45$.\n\n> **Watch out.** For a monic quartic the constant term is the product of the roots itself, not minus it, because the degree is even. The coefficient of $x^{3}$ is minus the sum of the roots, and the pair $\\pm 2i$ adds nothing to that sum.",
        "把每个非实根与其共轭配对，得到实系数二次因式，再相乘。有根 $2i$ 与 $1 + 3i$、首项系数为 $1$ 的实系数四次式为\n\n$$(x^{2} + 4)(x^{2} - 2x + 10) = x^{4} - 2x^{3} + 14x^{2} - 8x + 40$$\n\n常数项是四个根之积 $4 \\cdot 10 = 40$，$x^{3}$ 的系数是四根之和的相反数 $-2$。\n\n检验：$x = 1$ 时，因式形式给出 $5 \\cdot 9 = 45$，展开形式给出 $1 - 2 + 14 - 8 + 40 = 45$。\n\n> **注意。** 首项系数为 $1$ 的四次式，常数项就是四根之积本身，而不是它的相反数，因为次数是偶数。$x^{3}$ 的系数是四根之和的相反数，而 $\\pm 2i$ 这一对对和没有贡献。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const h = rng.nonZero(-4, 4);
        const c = rng.int(1, 5);
        const N = h * h + c * c;
        const K = k * k;
        const coeffs = mulP([1, 0, K], [1, -2 * h, N]);
        const kind = rng.pick(["constant", "cubic", "quadratic"] as const);
        const what =
          kind === "constant"
            ? t("constant term", "常数项")
            : kind === "cubic"
              ? t("coefficient of $x^{3}$", "$x^{3}$ 的系数")
              : t("coefficient of $x^{2}$", "$x^{2}$ 的系数");
        const answer = kind === "constant" ? coeffs[4]! : kind === "cubic" ? coeffs[1]! : coeffs[2]!;
        const wrong = kind === "constant" ? [-K * N, k * N, K + N] : kind === "cubic" ? [2 * h, -h, h] : [N - K, N, K * N];
        const q1 = polyX([1, 0, K]);
        const q2 = polyX([1, -2 * h, N]);
        const check =
          kind === "constant"
            ? t(
                `The constant term of a monic quartic is the product of its four roots. Multiply the conjugate pairs first:\n\n$$(${iTex(k, 1)})(${iTex(-k, 1)}) \\cdot (${cx(h, c)})(${cx(h, -c)}) = ${K} \\cdot ${N} = ${K * N}$$\n\nThis matches the constant term found by expanding.`,
                `首项系数为 $1$ 的四次式的常数项是四根之积。先把共轭对相乘：\n\n$$(${iTex(k, 1)})(${iTex(-k, 1)}) \\cdot (${cx(h, c)})(${cx(h, -c)}) = ${K} \\cdot ${N} = ${K * N}$$\n\n与展开得到的常数项一致。`,
              )
            : kind === "cubic"
              ? t(
                  `The coefficient of $x^{3}$ is minus the sum of the four roots. The pair $\\pm ${iTex(k, 1)}$ adds to $0$ and the other pair adds to $${2 * h}$:\n\n$$-\\left(0 + ${2 * h < 0 ? `(${2 * h})` : 2 * h}\\right) = ${-2 * h}$$\n\nThis matches the coefficient found by expanding.`,
                  `$x^{3}$ 的系数是四根之和的相反数。$\\pm ${iTex(k, 1)}$ 这一对之和为 $0$，另一对之和为 $${2 * h}$：\n\n$$-\\left(0 + ${2 * h < 0 ? `(${2 * h})` : 2 * h}\\right) = ${-2 * h}$$\n\n与展开得到的系数一致。`,
                )
              : t(
                  `Expand only the terms that make $x^{2}$. In the product of $${q1}$ and $${q2}$ they are $x^{2}$ times $${N}$ and $${K}$ times $x^{2}$:\n\n$$${N}x^{2} + ${K}x^{2} = ${N + K}x^{2}$$\n\nThis matches the coefficient found by expanding fully.`,
                  `只展开得到 $x^{2}$ 的项。在 $${q1}$ 与 $${q2}$ 的乘积中，它们是 $x^{2}$ 乘 $${N}$ 与 $${K}$ 乘 $x^{2}$：\n\n$$${N}x^{2} + ${K}x^{2} = ${N + K}x^{2}$$\n\n与完全展开得到的系数一致。`,
                );
        return numberProblem({
          prompt: t(
            `A polynomial of degree $4$ with real coefficients and leading coefficient $1$ has the roots $${iTex(k, 1)}$ and $${cx(h, c)}$. Find its ${what.en}.`,
            `一个首项系数为 $1$、次数为 $4$ 的实系数多项式有根 $${iTex(k, 1)}$ 和 $${cx(h, c)}$。求它的${what["zh-CN"]}。`,
          ),
          answer,
          form: "integer",
          wrong,
          solution: walked(
            [
              [
                ["Pair the conjugates", "配成共轭对"],
                t(
                  `The coefficients are real, so $${iTex(-k, 1)}$ and $${cx(h, -c)}$ are also roots. Each root with its conjugate gives a real quadratic factor:`,
                  `系数是实数，所以 $${iTex(-k, 1)}$ 与 $${cx(h, -c)}$ 也是根。每个根与其共轭给出一个实系数二次因式：`,
                ),
                [`(x - ${iTex(k, 1)})(x + ${iTex(k, 1)}) = ${q1}, \\qquad (x - (${cx(h, c)}))(x - (${cx(h, -c)})) = ${q2}`],
              ],
              [
                ["Multiply the factors", "把因式相乘"],
                t(`The quartic is the product:`, `四次式就是它们的乘积：`),
                [`(${q1})(${q2}) = ${polyX(coeffs)}`],
              ],
              [["Read off the answer", "读出答案"], t(`The ${what.en} is $${answer}$.`, `所以${what["zh-CN"]}是 $${answer}$。`)],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** solvingQuarticEquationsWithComplexRoots covers finding all four roots of a quartic, including nonreal ones. */
export const solvingQuarticEquationsWithComplexRoots: TopicDef = {
  id: "solving-quartic-equations-with-complex-roots",
  title: t("Solving Quartic Equations With Complex Roots", "解有复数根的四次方程"),
  summary: t(
    "Solve quartic equations completely over the complex numbers: biquadratic equations by treating them as quadratics in x², equations x⁴ = ±k⁴ with fourth roots, and general quartics by dividing out known roots.",
    "在复数范围内完整求解四次方程：把双二次方程看作关于 x² 的二次方程，用四次方根解 x⁴ = ±k⁴，并通过除去已知根求解一般的四次方程。",
  ),
  prerequisites: [
    "the-fundamental-theorem-of-algebra-with-quartic-equations",
    "solving-cubic-equations-with-complex-roots",
    "factoring-quartic-polynomials-using-the-factor-theorem",
    "solving-biquadratic-equations",
  ],
  encompasses: [{ topic: "solving-biquadratic-equations", weight: 0.4 }],
  xp: 18,
  standards: ["CCSS.HSN.CN.C.9"],
  intro: t(
    `A quartic has four complex roots counted with multiplicity, and a biquadratic equation can be solved as a quadratic in $x^{2}$. Over the real numbers a negative value of $x^{2}$ was thrown away; over the complex numbers it gives two more roots. For example,

$$x^{4} - 1 = (x^{2} - 1)(x^{2} + 1) = 0$$

so $x^{2} = 1$ gives $x = \\pm 1$ and $x^{2} = -1$ gives $x = \\pm i$: all four roots.

Check: $i^{4} = (i^{2})^{2} = (-1)^{2} = 1$, so $i$ does solve $x^{4} = 1$.

In this lesson we solve quartic equations completely over the complex numbers: biquadratic equations, equations $x^{4} = \\pm k^{4}$, and quartics with two known roots.`,
    `四次式按重数计有四个复数根，双二次方程可以看作关于 $x^{2}$ 的二次方程来解。在实数范围内，$x^{2}$ 取负值时要舍去；在复数范围内，它又给出两个根。例如

$$x^{4} - 1 = (x^{2} - 1)(x^{2} + 1) = 0$$

所以 $x^{2} = 1$ 给出 $x = \\pm 1$，$x^{2} = -1$ 给出 $x = \\pm i$：这就是全部四个根。

检验：$i^{4} = (i^{2})^{2} = (-1)^{2} = 1$，所以 $i$ 确实满足 $x^{4} = 1$。

这节课我们在复数范围内完整求解四次方程：双二次方程、形如 $x^{4} = \\pm k^{4}$ 的方程，以及已知两个根的四次方程。`,
  ),
  knowledgePoints: [
    {
      id: "biquadratic-equations-with-complex-roots",
      title: t("Solve biquadratic equations with complex roots", "解有复数根的双二次方程"),
      explanation: t(
        "A quartic with only even powers is a quadratic in $u = x^{2}$. Factor it, then take square roots, which are imaginary when $x^{2}$ is negative:\n\n$$x^{4} + 5x^{2} - 36 = (x^{2} - 4)(x^{2} + 9) = 0 \\quad\\Rightarrow\\quad x = \\pm 2 \\ \\text{or}\\ x = \\pm 3i$$\n\nCheck: at $x = 3i$ we have $x^{2} = -9$ and $x^{4} = 81$, and $81 - 45 - 36 = 0$.\n\n> **Watch out.** Over the complex numbers a negative value of $x^{2}$ is not thrown away. $x^{2} = -9$ gives $x = \\pm 3i$, not $\\pm 9i$ and not $\\pm 3$.",
        "只含偶次幂的四次方程是关于 $u = x^{2}$ 的二次方程。先分解因式，再开平方；当 $x^{2}$ 为负数时，平方根是虚数：\n\n$$x^{4} + 5x^{2} - 36 = (x^{2} - 4)(x^{2} + 9) = 0 \\quad\\Rightarrow\\quad x = \\pm 2 \\ \\text{或}\\ x = \\pm 3i$$\n\n检验：$x = 3i$ 时 $x^{2} = -9$，$x^{4} = 81$，而 $81 - 45 - 36 = 0$。\n\n> **注意。** 在复数范围内，$x^{2}$ 取负值时不能舍去。$x^{2} = -9$ 给出 $x = \\pm 3i$，而不是 $\\pm 9i$，也不是 $\\pm 3$。",
      ),
      keyPrerequisites: ["solving-biquadratic-equations"],
      generate(rng) {
        const pr = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        if (rng.bool()) {
          const a = rng.int(1, 6);
          const [c, m] = rng.pick(IMAG);
          const n = c * c * m;
          const eq = `${polyX([1, 0, n - a * a, 0, -a * a * n])} = 0`;
          const answer = iTex(c, m);
          return expressionProblem({
            prompt: t(
              `Solve $${eq}$ over the complex numbers. Enter the nonreal solution with a positive imaginary part.`,
              `在复数范围内解方程 $${eq}$。请输入虚部为正的那个非实数解。`,
            ),
            answer,
            radical: true,
            prefix: "x =",
            wrong: [String(a), iTex(a, 1), iTex(n, 1), poly([c, m === 1 ? "" : `\\sqrt{${m}}`])].filter((w) => w !== answer),
            solution: walked(
              [
                [
                  ["Factor as a quadratic in x squared", "看作关于 x 的平方的二次式来分解"],
                  t(
                    `With $u = x^{2}$ the equation is a quadratic in $u$, and it factors:`,
                    `令 $u = x^{2}$，方程就是关于 $u$ 的二次方程，可以分解：`,
                  ),
                  [`(x^{2} - ${a * a})(x^{2} + ${n}) = 0`],
                ],
                [
                  ["Take square roots", "开平方"],
                  t(`Each factor gives two solutions, imaginary when $x^{2}$ is negative:`, `每个因式给出两个解，$x^{2}$ 为负时解是虚数：`),
                  [`x^{2} = ${a * a} \\;\\Rightarrow\\; x = \\pm ${a}, \\qquad x^{2} = -${n} \\;\\Rightarrow\\; x = \\pm ${answer}`],
                ],
                [
                  ["Pick the solution", "选出所求的解"],
                  t(`The nonreal solution with a positive imaginary part is $${answer}$.`, `虚部为正的非实数解是 $${answer}$。`),
                ],
              ],
              t(
                `Substitute $x = ${answer}$, for which $x^{2} = -${n}$ and $x^{4} = ${n * n}$. The left side becomes\n\n$$${n * n} + ${pr(n - a * a)} \\cdot (-${n}) - ${a * a * n} = 0$$\n\nSo $${answer}$ solves the equation.`,
                `代入 $x = ${answer}$，此时 $x^{2} = -${n}$，$x^{4} = ${n * n}$。左边化为\n\n$$${n * n} + ${pr(n - a * a)} \\cdot (-${n}) - ${a * a * n} = 0$$\n\n所以 $${answer}$ 是方程的解。`,
              ),
            ),
          });
        }
        const [p, q] = rng.sample([1, 2, 3, 4, 5, 6], 2).sort((x, y) => x - y) as [number, number];
        const eq = `${polyX([1, 0, p * p + q * q, 0, p * p * q * q])} = 0`;
        const answer = iTex(q, 1);
        return expressionProblem({
          prompt: t(
            `Solve $${eq}$ over the complex numbers. Enter the solution with the greatest imaginary part.`,
            `在复数范围内解方程 $${eq}$。请输入虚部最大的那个解。`,
          ),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [iTex(p, 1), iTex(q * q, 1), String(q), iTex(-q, 1)],
          solution: walked(
            [
              [
                ["Factor as a quadratic in x squared", "看作关于 x 的平方的二次式来分解"],
                t(
                  `With $u = x^{2}$ the equation is a quadratic in $u$, and it factors:`,
                  `令 $u = x^{2}$，方程就是关于 $u$ 的二次方程，可以分解：`,
                ),
                [`(x^{2} + ${p * p})(x^{2} + ${q * q}) = 0`],
              ],
              [
                ["Take square roots", "开平方"],
                t(
                  `Both values of $x^{2}$ are negative, so all four solutions are imaginary:`,
                  `$x^{2}$ 的两个值都是负数，所以四个解都是虚数：`,
                ),
                [`x = \\pm ${iTex(p, 1)} \\quad\\text{or}\\quad x = \\pm ${iTex(q, 1)}`],
              ],
              [
                ["Pick the solution", "选出所求的解"],
                t(`The greatest imaginary part, $${q}$, belongs to $${answer}$.`, `虚部最大的是 $${q}$，对应的解是 $${answer}$。`),
              ],
            ],
            t(
              `Substitute $x = ${answer}$, for which $x^{2} = -${q * q}$ and $x^{4} = ${q ** 4}$. The left side becomes\n\n$$${q ** 4} - ${(p * p + q * q) * q * q} + ${p * p * q * q} = 0$$\n\nSo $${answer}$ solves the equation.`,
              `代入 $x = ${answer}$，此时 $x^{2} = -${q * q}$，$x^{4} = ${q ** 4}$。左边化为\n\n$$${q ** 4} - ${(p * p + q * q) * q * q} + ${p * p * q * q} = 0$$\n\n所以 $${answer}$ 是方程的解。`,
            ),
          ),
        });
      },
    },
    {
      id: "dividing-out-two-known-roots",
      title: t("Divide out two known roots", "除去两个已知根"),
      explanation: t(
        "If two real roots $r_{1}$ and $r_{2}$ are known, divide by $(x - r_{1})(x - r_{2})$, or divide twice by linear factors, to leave a quadratic. For $x^{4} - 2x^{3} + x^{2} + 2x - 2 = 0$ with roots $1$ and $-1$:\n\n$$x^{4} - 2x^{3} + x^{2} + 2x - 2 = (x^{2} - 1)(x^{2} - 2x + 2), \\qquad x = 1 \\pm i$$\n\nCheck: the four roots $1$, $-1$, $1 + i$ and $1 - i$ add to $2$, minus the coefficient of $x^{3}$, and multiply to $(-1) \\cdot 2 = -2$, the constant term.\n\n> **Watch out.** Divide by the product of both linear factors, not by one of them, so that a quadratic is left. The roots $1$ and $-1$ give $(x - 1)(x + 1)$, each factor being $x$ minus a root.",
        "若已知两个实根 $r_{1}$ 与 $r_{2}$，就除以 $(x - r_{1})(x - r_{2})$（或依次除以两个一次因式），剩下一个二次式。对 $x^{4} - 2x^{3} + x^{2} + 2x - 2 = 0$，已知根 $1$ 与 $-1$：\n\n$$x^{4} - 2x^{3} + x^{2} + 2x - 2 = (x^{2} - 1)(x^{2} - 2x + 2), \\qquad x = 1 \\pm i$$\n\n检验：四个根 $1$、$-1$、$1 + i$、$1 - i$ 之和为 $2$，等于 $x^{3}$ 系数的相反数；之积为 $(-1) \\cdot 2 = -2$，等于常数项。\n\n> **注意。** 要除以两个一次因式之积，而不是只除以其中一个，这样才剩下二次式。根 $1$ 与 $-1$ 给出 $(x - 1)(x + 1)$，每个因式都是 $x$ 减去一个根。",
      ),
      keyPrerequisites: ["factoring-quartic-polynomials-using-the-factor-theorem"],
      generate(rng) {
        const [r1, r2] = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4], 2) as [number, number];
        const h = rng.nonZero(-3, 3);
        const c = rng.int(1, 4);
        const N = h * h + c * c;
        const rr = mulP([1, -r1], [1, -r2]);
        const quad = polyX([1, -2 * h, N]);
        const coeffs = mulP(rr, [1, -2 * h, N]);
        const eq = `${polyX(coeffs)} = 0`;
        const answer = cx(h, c);
        const pr = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return expressionProblem({
          prompt: t(
            `Two solutions of $${eq}$ are $x = ${r1}$ and $x = ${r2}$. Find the nonreal solution with a positive imaginary part.`,
            `方程 $${eq}$ 的两个解是 $x = ${r1}$ 与 $x = ${r2}$。求虚部为正的那个非实数解。`,
          ),
          answer,
          simplified: true,
          prefix: "x =",
          wrong: [cx(-h, c), cx(h, c * c), cx(2 * h, c)].filter((w) => w !== answer),
          solution: walked(
            [
              [
                ["Multiply the known factors", "把已知因式相乘"],
                t(
                  `By the factor theorem both $${linear(1, -r1)}$ and $${linear(1, -r2)}$ are factors, so their product is a factor too:`,
                  `由因式定理，$${linear(1, -r1)}$ 与 $${linear(1, -r2)}$ 都是因式，所以它们的积也是因式：`,
                ),
                [`(${linear(1, -r1)})(${linear(1, -r2)}) = ${polyX(rr)}`],
              ],
              [
                ["Divide", "做除法"],
                t(`Dividing by it leaves a quadratic:`, `除以它后剩下一个二次式：`),
                [`${polyX(coeffs)} = (${polyX(rr)})(${quad})`],
              ],
              [
                ["Solve the quadratic", "解二次式"],
                t(`Apply the quadratic formula to $${quad} = 0$:`, `对 $${quad} = 0$ 用求根公式：`),
                [
                  `x = \\frac{${2 * h} \\pm \\sqrt{${4 * h * h - 4 * N}}}{2} = \\frac{${2 * h} \\pm ${iTex(2 * c, 1)}}{2} = ${h} \\pm ${iTex(c, 1)}`,
                ],
              ],
              [
                ["Pick the solution", "选出所求的解"],
                t(`The solution with a positive imaginary part is $${answer}$.`, `虚部为正的解是 $${answer}$。`),
              ],
            ],
            t(
              `Use Vieta's formulas on the original quartic. The four roots should add to minus the coefficient of $x^{3}$ and multiply to the constant term:\n\n$$${r1} + ${pr(r2)} + ${pr(2 * h)} = ${r1 + r2 + 2 * h}, \\qquad ${pr(r1)} \\cdot ${pr(r2)} \\cdot ${N} = ${r1 * r2 * N}$$\n\nThe quartic has $${coeffs[1]}$ as the coefficient of $x^{3}$ and $${coeffs[4]}$ as the constant term, so both agree.`,
              `对原四次式用韦达定理。四个根之和应等于 $x^{3}$ 系数的相反数，之积应等于常数项：\n\n$$${r1} + ${pr(r2)} + ${pr(2 * h)} = ${r1 + r2 + 2 * h}, \\qquad ${pr(r1)} \\cdot ${pr(r2)} \\cdot ${N} = ${r1 * r2 * N}$$\n\n四次式的 $x^{3}$ 系数是 $${coeffs[1]}$，常数项是 $${coeffs[4]}$，两者都吻合。`,
            ),
          ),
        });
      },
    },
    {
      id: "fourth-powers-equal-to-a-constant",
      title: t("Solve x⁴ = ±k⁴", "解 x⁴ = ±k⁴"),
      explanation: t(
        "The four solutions of $x^{4} = w$ are the fourth roots of $w$, $90^{\\circ}$ apart. For $x^{4} = 16$ they are $\\pm 2$ and $\\pm 2i$, from $(x^{2} - 4)(x^{2} + 4) = 0$. For $x^{4} = -16 = 16\\,\\text{cis}\\,\\pi$ they have modulus $2$ and arguments $\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$, one in each quadrant:\n\n$$2\\,\\text{cis}\\frac{\\pi}{4} = \\sqrt{2} + i\\sqrt{2}, \\quad -\\sqrt{2} + i\\sqrt{2}, \\quad -\\sqrt{2} - i\\sqrt{2}, \\quad \\sqrt{2} - i\\sqrt{2}$$\n\nCheck: $(\\sqrt{2} + i\\sqrt{2})^{2} = 2 + 4i - 2 = 4i$, and $(4i)^{2} = -16$.\n\n> **Watch out.** $x^{4} = -16$ has no real solutions, and $\\pm 2i$ do not solve it: $(2i)^{4} = 16$. Its solutions lie on the diagonals, not on the axes.",
        "方程 $x^{4} = w$ 的四个解是 $w$ 的四次方根，彼此相差 $90^{\\circ}$。对 $x^{4} = 16$，由 $(x^{2} - 4)(x^{2} + 4) = 0$ 得 $\\pm 2$ 与 $\\pm 2i$。对 $x^{4} = -16 = 16\\,\\text{cis}\\,\\pi$，解的模长为 $2$，辐角为 $\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$，每个象限各一个：\n\n$$2\\,\\text{cis}\\frac{\\pi}{4} = \\sqrt{2} + i\\sqrt{2}, \\quad -\\sqrt{2} + i\\sqrt{2}, \\quad -\\sqrt{2} - i\\sqrt{2}, \\quad \\sqrt{2} - i\\sqrt{2}$$\n\n检验：$(\\sqrt{2} + i\\sqrt{2})^{2} = 2 + 4i - 2 = 4i$，而 $(4i)^{2} = -16$。\n\n> **注意。** $x^{4} = -16$ 没有实数解，$\\pm 2i$ 也不是它的解：$(2i)^{4} = 16$。它的解位于两条对角线上，而不在坐标轴上。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3]);
        const lead = a === 1 ? "" : String(a);
        const form = rng.bool();
        const divide = (k4: number, sign: string): Text =>
          a === 1
            ? t(`Write the equation as $x^{4} ${sign} ${k4} = 0$.`, `把方程写成 $x^{4} ${sign} ${k4} = 0$。`)
            : t(
                `Divide by $${a}$ and write the equation as $x^{4} ${sign} ${k4} = 0$.`,
                `两边除以 $${a}$，把方程写成 $x^{4} ${sign} ${k4} = 0$。`,
              );
        if (rng.bool(0.4)) {
          const k = rng.int(1, 9);
          const eq = form ? `${lead}x^{4} - ${a * k ** 4} = 0` : `${lead}x^{4} = ${a * k ** 4}`;
          const answer = iTex(k, 1);
          const d = divide(k ** 4, "-");
          return expressionProblem({
            prompt: t(
              `Solve $${eq}$ over the complex numbers. Enter the solution with a positive imaginary part.`,
              `在复数范围内解方程 $${eq}$。请输入虚部为正的那个解。`,
            ),
            answer,
            radical: true,
            prefix: "x =",
            wrong: [String(k), iTex(k * k, 1), iTex(-k, 1)].filter((w) => w !== answer),
            solution: walked(
              [
                [
                  ["Factor twice", "分解两次"],
                  t(`${d.en} It is a difference of squares:`, `${d["zh-CN"]}这是平方差：`),
                  [`(x^{2} - ${k * k})(x^{2} + ${k * k}) = 0`],
                ],
                [
                  ["Take square roots", "开平方"],
                  t(`Each factor gives two solutions:`, `每个因式给出两个解：`),
                  [`x^{2} = ${k * k} \\;\\Rightarrow\\; x = \\pm ${k}, \\qquad x^{2} = -${k * k} \\;\\Rightarrow\\; x = \\pm ${answer}`],
                ],
                [
                  ["Pick the solution", "选出所求的解"],
                  t(`The solution with a positive imaginary part is $${answer}$.`, `虚部为正的解是 $${answer}$。`),
                ],
              ],
              t(
                `Raise the answer to the fourth power directly, using $i^{4} = 1$:\n\n$$\\left(${answer}\\right)^{4} = ${k ** 4} \\cdot i^{4} = ${k ** 4}$$\n\nThe four solutions $\\pm ${k}$ and $\\pm ${answer}$ lie $90^{\\circ}$ apart on the circle of radius $${k}$, as fourth roots should.`,
                `直接把答案取四次方，利用 $i^{4} = 1$：\n\n$$\\left(${answer}\\right)^{4} = ${k ** 4} \\cdot i^{4} = ${k ** 4}$$\n\n四个解 $\\pm ${k}$ 与 $\\pm ${answer}$ 在半径为 $${k}$ 的圆上彼此相差 $90^{\\circ}$，正符合四次方根的特点。`,
              ),
            ),
          });
        }
        const j = rng.int(1, 4);
        const k = 2 * j;
        const quadrant = rng.int(0, 3);
        const phi = 45 + 90 * quadrant;
        const eq = form ? `${lead}x^{4} + ${a * k ** 4} = 0` : `${lead}x^{4} = -${a * k ** 4}`;
        const R = k * k;
        const answer = rectTex(rect(R, phi));
        const where = QUADRANTS[quadrant]!;
        const d = divide(k ** 4, "+");
        const polar = polarTex(String(k), radTex(phi));
        return expressionProblem({
          prompt: t(
            `Solve $${eq}$ over the complex numbers. Enter the solution in ${where.en}.`,
            `在复数范围内解方程 $${eq}$。请输入位于${where["zh-CN"]}的那个解。`,
          ),
          answer,
          radical: true,
          prefix: "x =",
          wrong: defined([
            rectTexAt(R, phi + 180),
            rectTexAt(R, -phi),
            cx(rect(R, phi).re[0], rect(R, phi).im[0]),
            rectTexAt(R * R, phi),
          ]).filter((w) => w !== answer),
          solution: walked(
            [
              [
                ["Write the right side in polar form", "把右边写成极坐标形式"],
                t(
                  `${d.en} Then $x^{4}$ equals a negative number, whose modulus is $${k ** 4}$ and whose argument is $\\pi$:`,
                  `${d["zh-CN"]}于是 $x^{4}$ 等于一个负数，它的模是 $${k ** 4}$，辐角是 $\\pi$：`,
                ),
                [`x^{4} = -${k ** 4} = ${polarTex(String(k ** 4), "\\pi")}`],
              ],
              [
                ["List the fourth roots", "写出四次方根"],
                t(
                  `The fourth roots have modulus $${k}$, since $${k}^{4} = ${k ** 4}$, and arguments $\\pi$ divided by $4$ plus multiples of a quarter turn:`,
                  `四次方根的模是 $${k}$（因为 $${k}^{4} = ${k ** 4}$），辐角是 $\\pi$ 除以 $4$ 再加上四分之一圈的整数倍：`,
                ),
                [`\\frac{\\pi}{4}, \\quad \\frac{3\\pi}{4}, \\quad \\frac{5\\pi}{4}, \\quad \\frac{7\\pi}{4}`],
              ],
              [
                ["Pick the root", "选出所求的根"],
                t(`The one in ${where.en} has the argument $${radTex(phi)}$:`, `位于${where["zh-CN"]}的根辐角为 $${radTex(phi)}$：`),
                [`${polar} = ${answer}`],
              ],
            ],
            t(
              `Raise the answer to the fourth power with De Moivre's theorem: the modulus becomes $${k}^{4}$ and the argument becomes $4 \\cdot ${radTex(phi)}$.\n\n$$\\left(${polar}\\right)^{4} = ${polarTex(String(k ** 4), radTex(4 * phi))} = -${k ** 4}$$\n\nThe cosine of an odd multiple of $\\pi$ is $-1$ and its sine is $0$, so this is the right side of the equation.`,
              `用棣莫弗定理把答案取四次方：模变成 $${k}^{4}$，辐角变成 $4 \\cdot ${radTex(phi)}$。\n\n$$\\left(${polar}\\right)^{4} = ${polarTex(String(k ** 4), radTex(4 * phi))} = -${k ** 4}$$\n\n$\\pi$ 的奇数倍的余弦是 $-1$，正弦是 $0$，所以这正是方程的右边。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module Export ────────────────────────────────────────────────────────────

/** precalculusDeMoivreTopics contains the 13 topics of Precalculus modules 10.33 and 10.34. */
export const precalculusDeMoivreTopics: readonly TopicDef[] = [
  deMoivresTheorem,
  findingPowersOfComplexNumbersUsingDeMoivresTheorem,
  thePowerReducingFormulasForSineAndCosine,
  eulersFormula,
  theRootsOfUnity,
  propertiesOfRootsOfUnity,
  squareRootsOfComplexNumbers,
  higherRootsOfComplexNumbers,
  theFundamentalTheoremOfAlgebraForQuadraticEquations,
  theFundamentalTheoremOfAlgebraWithCubicEquations,
  solvingCubicEquationsWithComplexRoots,
  theFundamentalTheoremOfAlgebraWithQuarticEquations,
  solvingQuarticEquationsWithComplexRoots,
];
