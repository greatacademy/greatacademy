import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, linear, poly, Q, simplifyRadical, surd, surdLatex } from "@ga/subject-math";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { choiceProblem, expressionProblem, numberProblem, steps } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

// Precalculus Unit 10: Complex Numbers
// Part 2: Modules 10.33 (De Moivre's Theorem) and 10.34 (The Fundamental Theorem of Algebra).

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** oneOf builds a multiple-choice problem from the right option and up to three distinct wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
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
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
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
  knowledgePoints: [
    {
      id: "powers-in-polar-form",
      figure: precalculusDrawings4["de-moivres-theorem#powers-in-polar-form"],
      title: t("Raise a complex number in polar form to a power", "计算三角形式复数的幂"),
      explanation: t(
        "Multiplying complex numbers in polar form multiplies the moduli and adds the arguments. Multiplying $z = r(\\cos\\theta + i\\sin\\theta)$ by itself $n$ times therefore multiplies $r$ by itself $n$ times and adds $\\theta$ to itself $n$ times. This is **De Moivre's theorem**:\n\n$$\\left[r(\\cos\\theta + i\\sin\\theta)\\right]^{n} = r^{n}(\\cos n\\theta + i\\sin n\\theta)$$\n\nFor example, $\\left[2\\left(\\cos\\frac{\\pi}{5} + i\\sin\\frac{\\pi}{5}\\right)\\right]^{3} = 8\\left(\\cos\\frac{3\\pi}{5} + i\\sin\\frac{3\\pi}{5}\\right)$.\n\nIf $n\\theta$ is $2\\pi$ or more, subtract multiples of $2\\pi$ to bring it into $[0, 2\\pi)$. Note that the power applies to the **angle inside** the cosine and sine, not to the cosine and sine themselves.",
        "三角形式的复数相乘时，模长相乘、辐角相加。因此把 $z = r(\\cos\\theta + i\\sin\\theta)$ 自乘 $n$ 次，就是把 $r$ 自乘 $n$ 次，把 $\\theta$ 自加 $n$ 次。这就是**棣莫弗定理**：\n\n$$\\left[r(\\cos\\theta + i\\sin\\theta)\\right]^{n} = r^{n}(\\cos n\\theta + i\\sin n\\theta)$$\n\n例如，$\\left[2\\left(\\cos\\frac{\\pi}{5} + i\\sin\\frac{\\pi}{5}\\right)\\right]^{3} = 8\\left(\\cos\\frac{3\\pi}{5} + i\\sin\\frac{3\\pi}{5}\\right)$。\n\n若 $n\\theta$ 大于或等于 $2\\pi$，减去 $2\\pi$ 的整数倍，使其落在 $[0, 2\\pi)$ 内。注意：幂作用在余弦、正弦**里面的角**上，而不是作用在余弦、正弦本身上。",
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
        const reduce = raw.eq(nt) ? "" : `\\quad\\text{and}\\quad ${piTex(raw)} - ${piTex(raw.sub(nt))} = ${b}`;
        const math = steps(
          `${z} = ${r}^{${n}}\\left(\\cos\\left(${n} \\cdot ${a}\\right) + i\\sin\\left(${n} \\cdot ${a}\\right)\\right)`,
          `${n} \\cdot ${a} = ${piTex(raw)}${reduce}`,
          `${z} = ${right}`,
        );
        return oneOf(
          rng,
          t(
            `Use De Moivre's theorem to write $${z}$ in polar form $r(\\cos\\theta + i\\sin\\theta)$ with $0 \\le \\theta < 2\\pi$.`,
            `用棣莫弗定理把 $${z}$ 写成三角形式 $r(\\cos\\theta + i\\sin\\theta)$，其中 $0 \\le \\theta < 2\\pi$。`,
          ),
          m$(right),
          [
            m$(
              `${r}^{${n}}\\left(\\cos^{${n}}\\left(${a}\\right) + i\\sin^{${n}}\\left(${a}\\right)\\right)`.replace(
                `${r}^{${n}}`,
                String(rn),
              ),
            ),
            m$(polarTex(String(n * r), b)),
            m$(polarTex(String(rn), a)),
            m$(polarTex(String(r), b)),
          ],
          t(
            `Raise the modulus to the ${ordinal(n)} power and multiply the argument by $${n}$:${math}`,
            `模长取 $${n}$ 次幂，辐角乘以 $${n}$：${math}`,
          ),
        );
      },
    },
    {
      id: "modulus-and-argument-of-a-power",
      title: t("Find the modulus or argument of a power", "求幂的模长或辐角"),
      explanation: t(
        "By De Moivre's theorem, if $z = r(\\cos\\theta + i\\sin\\theta)$ then\n\n$$|z^{n}| = r^{n} \\qquad\\text{and}\\qquad \\arg(z^{n}) = n\\theta$$\n\nup to a multiple of $360^{\\circ}$. For $z = 2(\\cos 50^{\\circ} + i\\sin 50^{\\circ})$, $z^{8}$ has modulus $2^{8} = 256$ and argument $8 \\cdot 50^{\\circ} = 400^{\\circ}$, which is $400^{\\circ} - 360^{\\circ} = 40^{\\circ}$ in $[0^{\\circ}, 360^{\\circ})$.",
        "由棣莫弗定理，若 $z = r(\\cos\\theta + i\\sin\\theta)$，则\n\n$$|z^{n}| = r^{n} \\qquad\\text{且}\\qquad \\arg(z^{n}) = n\\theta$$\n\n（相差 $360^{\\circ}$ 的整数倍）。对 $z = 2(\\cos 50^{\\circ} + i\\sin 50^{\\circ})$，$z^{8}$ 的模长是 $2^{8} = 256$，辐角是 $8 \\cdot 50^{\\circ} = 400^{\\circ}$，在 $[0^{\\circ}, 360^{\\circ})$ 内即 $400^{\\circ} - 360^{\\circ} = 40^{\\circ}$。",
      ),
      generate(rng) {
        const r = rng.pick([2, 3]);
        const n = rng.int(2, r === 2 ? 8 : 5);
        const alpha = rng.int(1, 71) * 5;
        const z = `z = ${r}\\left(\\cos ${alpha}^{\\circ} + i\\sin ${alpha}^{\\circ}\\right)`;
        if (rng.bool()) {
          const answer = mod360(n * alpha);
          const turns = (n * alpha - answer) / 360;
          const reduce = turns === 0 ? "" : `${n * alpha}^{\\circ} - ${turns * 360}^{\\circ} = ${answer}^{\\circ}`;
          return numberProblem({
            prompt: t(
              `Let $${z}$. Find the argument of $z^{${n}}$ in $[0^{\\circ}, 360^{\\circ})$.`,
              `设 $${z}$。求 $z^{${n}}$ 在 $[0^{\\circ}, 360^{\\circ})$ 内的辐角。`,
            ),
            answer,
            unit: "°",
            wrong: [n * alpha, alpha, mod360((n - 1) * alpha), mod360(alpha + n)],
            solution: t(
              `Multiply the argument by $${n}$:${steps(`${n} \\cdot ${alpha}^{\\circ} = ${n * alpha}^{\\circ}`, ...(reduce ? [reduce] : []))}`,
              `把辐角乘以 $${n}$：${steps(`${n} \\cdot ${alpha}^{\\circ} = ${n * alpha}^{\\circ}`, ...(reduce ? [reduce] : []))}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(`Let $${z}$. Find the modulus $|z^{${n}}|$.`, `设 $${z}$。求模长 $|z^{${n}}|$。`),
          answer: r ** n,
          wrong: [n * r, r ** (n - 1), r ** (n + 1), r],
          solution: t(
            `Raise the modulus to the ${ordinal(n)} power:${steps(`|z^{${n}}| = ${r}^{${n}} = ${r ** n}`)}`,
            `模长取 $${n}$ 次幂：${steps(`|z^{${n}}| = ${r}^{${n}} = ${r ** n}`)}`,
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
  knowledgePoints: [
    {
      id: "polar-powers-in-rectangular-form",
      title: t("Write a power of a number in polar form as a + bi", "把三角形式复数的幂写成 a + bi"),
      explanation: t(
        "Apply De Moivre's theorem, then evaluate the cosine and sine of the new angle exactly:\n\n$$\\left[2\\left(\\cos\\frac{\\pi}{12} + i\\sin\\frac{\\pi}{12}\\right)\\right]^{4} = 16\\left(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3}\\right) = 16\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = 8 + 8i\\sqrt{3}$$\n\nThe angle $\\frac{\\pi}{12}$ is not a special angle, but $4 \\cdot \\frac{\\pi}{12} = \\frac{\\pi}{3}$ is.",
        "先用棣莫弗定理，再精确求出新角的余弦与正弦：\n\n$$\\left[2\\left(\\cos\\frac{\\pi}{12} + i\\sin\\frac{\\pi}{12}\\right)\\right]^{4} = 16\\left(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3}\\right) = 16\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = 8 + 8i\\sqrt{3}$$\n\n角 $\\frac{\\pi}{12}$ 不是特殊角，但 $4 \\cdot \\frac{\\pi}{12} = \\frac{\\pi}{3}$ 是特殊角。",
      ),
      generate(rng) {
        const R = rng.pick([2, 4]);
        const n = rng.int(2, R === 2 ? 6 : 5);
        const phi = rng.pick(SPECIAL);
        const theta = Q.of(phi, 180 * n);
        const z = `\\left[${polarTex(modTex(R), piTex(theta))}\\right]^{${n}}`;
        const Rn = R ** n;
        const answer = rectTex(rect(Rn, phi));
        const math = steps(
          `${z} = \\left(${modTex(R)}\\right)^{${n}}\\left(\\cos\\left(${radTex(phi)}\\right) + i\\sin\\left(${radTex(phi)}\\right)\\right)`,
          `= ${polarTex(modTex(Rn), radTex(phi))} = ${answer}`,
        );
        return expressionProblem({
          prompt: t(`Write $${z}$ in the form $a + bi$.`, `把 $${z}$ 写成 $a + bi$ 的形式。`),
          answer,
          radical: true,
          wrong: defined([rectTexAt(Rn, -phi), rectTexAt(Rn, 180 - phi), rectTexAt(Rn, 90 - phi), rectTexAt(R, phi)]),
          solution: t(
            `By De Moivre's theorem, the angle becomes $${n} \\cdot ${piTex(theta)} = ${radTex(phi)}$:${math}`,
            `由棣莫弗定理，辐角变为 $${n} \\cdot ${piTex(theta)} = ${radTex(phi)}$：${math}`,
          ),
        });
      },
    },
    {
      id: "powers-of-numbers-in-rectangular-form",
      title: t("Raise a number in rectangular form to a power", "计算代数形式复数的幂"),
      explanation: t(
        "To compute $(a + bi)^{n}$ without expanding, convert to polar form, apply De Moivre's theorem and convert back. For $(1 + i)^{5}$: $|1 + i| = \\sqrt{2}$ and $\\arg(1 + i) = \\frac{\\pi}{4}$, so\n\n$$(1 + i)^{5} = \\left(\\sqrt{2}\\right)^{5}\\left(\\cos\\frac{5\\pi}{4} + i\\sin\\frac{5\\pi}{4}\\right) = 4\\sqrt{2}\\left(-\\frac{\\sqrt{2}}{2} - \\frac{\\sqrt{2}}{2}i\\right) = -4 - 4i$$",
        "计算 $(a + bi)^{n}$ 时不必展开：先化为三角形式，应用棣莫弗定理，再化回代数形式。对 $(1 + i)^{5}$：$|1 + i| = \\sqrt{2}$，$\\arg(1 + i) = \\frac{\\pi}{4}$，所以\n\n$$(1 + i)^{5} = \\left(\\sqrt{2}\\right)^{5}\\left(\\cos\\frac{5\\pi}{4} + i\\sin\\frac{5\\pi}{4}\\right) = 4\\sqrt{2}\\left(-\\frac{\\sqrt{2}}{2} - \\frac{\\sqrt{2}}{2}i\\right) = -4 - 4i$$",
      ),
      keyPrerequisites: ["the-polar-form-of-a-complex-number"],
      generate(rng) {
        const [R, alpha] = rng.pick(BASES);
        const n = rng.int(2, R <= 4 ? 6 : 4);
        const base = rectTex(rect(R, alpha));
        const Rn = R ** n;
        const phi = mod360(n * alpha);
        const answer = rectTex(rect(Rn, phi));
        const math = steps(
          `|${base}| = ${modTex(R)}, \\qquad \\arg\\left(${base}\\right) = ${radTex(alpha)}`,
          `\\left(${base}\\right)^{${n}} = ${polarTex(modTex(Rn), piTex(Q.of(n * alpha, 180)))}`,
          `= ${polarTex(modTex(Rn), radTex(phi))} = ${answer}`,
        );
        return expressionProblem({
          prompt: t(
            `Use De Moivre's theorem to write $\\left(${base}\\right)^{${n}}$ in the form $a + bi$.`,
            `用棣莫弗定理把 $\\left(${base}\\right)^{${n}}$ 写成 $a + bi$ 的形式。`,
          ),
          answer,
          radical: true,
          wrong: defined([rectTexAt(Rn, -phi), rectTexAt(Rn, phi + 180), rectTexAt(Rn, 90 - phi), rectTexAt(R, phi)]),
          solution: t(
            `Write the number in polar form and apply De Moivre's theorem:${math}`,
            `把复数写成三角形式，再应用棣莫弗定理：${math}`,
          ),
        });
      },
    },
    {
      id: "least-power-that-is-real",
      title: t("Find the least power that is real", "求使幂为实数的最小次数"),
      explanation: t(
        "A complex number is real when its argument is a multiple of $180^{\\circ}$, and a **positive** real number when its argument is a multiple of $360^{\\circ}$. Since $\\arg(z^{n}) = n\\arg(z)$, find the least $n$ that makes $n\\arg(z)$ such a multiple.\n\nFor $z = \\sqrt{3} + i$, $\\arg(z) = 30^{\\circ}$: $z^{n}$ is real first when $30n = 180$, that is $n = 6$, and a positive real number first when $30n = 360$, that is $n = 12$.",
        "复数的辐角是 $180^{\\circ}$ 的整数倍时它是实数；辐角是 $360^{\\circ}$ 的整数倍时它是**正**实数。由于 $\\arg(z^{n}) = n\\arg(z)$，只需找出使 $n\\arg(z)$ 成为这样的倍数的最小 $n$。\n\n对 $z = \\sqrt{3} + i$，$\\arg(z) = 30^{\\circ}$：当 $30n = 180$ 即 $n = 6$ 时 $z^{n}$ 首次为实数；当 $30n = 360$ 即 $n = 12$ 时首次为正实数。",
      ),
      generate(rng) {
        const [R, alpha] = rng.pick([...BASES, [4, 90] as const, [16, 270] as const, [4, 180] as const]);
        const z = rectTex(rect(R, alpha));
        const positive = rng.bool();
        const step = positive ? 360 : 180;
        const answer = step / gcd(alpha, step);
        const other = (positive ? 180 : 360) / gcd(alpha, positive ? 180 : 360);
        const kind = positive ? t("a positive real number", "正实数") : t("a real number", "实数");
        return numberProblem({
          prompt: t(
            `Find the least positive integer $n$ for which $\\left(${z}\\right)^{n}$ is ${kind.en}.`,
            `求使 $\\left(${z}\\right)^{n}$ 为${kind["zh-CN"]}的最小正整数 $n$。`,
          ),
          answer,
          form: "integer",
          wrong: [other, answer * 2, answer % 2 === 0 ? answer / 2 : answer + 1, alpha / gcd(alpha, 90)],
          solution: t(
            `The argument of $${z}$ is $${alpha}^{\\circ}$, so $\\arg\\left(z^{n}\\right) = ${alpha}n^{\\circ}$. The least $n$ that makes $${alpha}n$ a multiple of $${step}$ is $${answer}$:${steps(`${alpha} \\cdot ${answer} = ${alpha * answer} = ${(alpha * answer) / step} \\cdot ${step}`)}`,
            `$${z}$ 的辐角是 $${alpha}^{\\circ}$，所以 $\\arg\\left(z^{n}\\right) = ${alpha}n^{\\circ}$。使 $${alpha}n$ 成为 $${step}$ 的倍数的最小 $n$ 是 $${answer}$：${steps(`${alpha} \\cdot ${answer} = ${alpha * answer} = ${(alpha * answer) / step} \\cdot ${step}`)}`,
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
  knowledgePoints: [
    {
      id: "exact-values-using-power-reducing-formulas",
      title: t("Find exact values with the power-reducing formulas", "用降幂公式求精确值"),
      explanation: t(
        "By De Moivre's theorem, $(\\cos\\theta + i\\sin\\theta)^{2} = \\cos 2\\theta + i\\sin 2\\theta$. Expanding the left side and comparing real parts gives $\\cos 2\\theta = \\cos^{2}\\theta - \\sin^{2}\\theta$, and with $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ this yields the **power-reducing formulas**:\n\n$$\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2} \\qquad \\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$$\n\nThey give exact values at half of a special angle:\n\n$$\\cos^{2}\\frac{\\pi}{12} = \\frac{1 + \\cos\\frac{\\pi}{6}}{2} = \\frac{1 + \\frac{\\sqrt{3}}{2}}{2} = \\frac{2 + \\sqrt{3}}{4}$$",
        "由棣莫弗定理，$(\\cos\\theta + i\\sin\\theta)^{2} = \\cos 2\\theta + i\\sin 2\\theta$。展开左边并比较实部，得 $\\cos 2\\theta = \\cos^{2}\\theta - \\sin^{2}\\theta$，再结合 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$，得到**降幂公式**：\n\n$$\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2} \\qquad \\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$$\n\n利用它们可以求特殊角一半处的精确值：\n\n$$\\cos^{2}\\frac{\\pi}{12} = \\frac{1 + \\cos\\frac{\\pi}{6}}{2} = \\frac{1 + \\frac{\\sqrt{3}}{2}}{2} = \\frac{2 + \\sqrt{3}}{4}$$",
      ),
      generate(rng) {
        const D = rng.pick(POWER_REDUCING_DOUBLES);
        const isSin = rng.bool();
        const { c4, cs } = trig(D);
        const sign = isSin ? -cs : cs;
        const value = (s: number, half: boolean) => surdLatex(surd(Q.of(half ? 1 : 2, half ? 4 : 2), Q.of(s, half ? 4 : 2), BigInt(c4)));
        const answer = surdLatex(surd(Q.of(1, 2), Q.of(sign, 4), BigInt(c4)));
        const theta = piTex(Q.of(D, 360));
        const f = isSin ? "\\sin" : "\\cos";
        const op = isSin ? "-" : "+";
        const cosD = `${cs < 0 ? "-" : ""}\\frac{\\sqrt{${c4}}}{2}`;
        const math = steps(
          `${f}^{2}\\left(${theta}\\right) = \\frac{1 ${op} \\cos\\left(${radTex(D)}\\right)}{2} = \\frac{1 ${op} \\left(${cosD}\\right)}{2}`,
          `= ${answer}`,
        );
        return expressionProblem({
          prompt: t(
            `Use a power-reducing formula to find the exact value of $${f}^{2}\\left(${theta}\\right)$.`,
            `用降幂公式求 $${f}^{2}\\left(${theta}\\right)$ 的精确值。`,
          ),
          answer,
          radical: true,
          wrong: [
            surdLatex(surd(Q.of(1, 2), Q.of(-sign, 4), BigInt(c4))),
            surdLatex(surd(Q.one, Q.of(sign, 2), BigInt(c4))),
            value(sign, true),
          ],
          solution: t(
            `The double angle is $2 \\cdot ${theta} = ${radTex(D)}$:${math}`,
            `二倍角为 $2 \\cdot ${theta} = ${radTex(D)}$：${math}`,
          ),
        });
      },
    },
    {
      id: "rewriting-squares-of-sine-and-cosine",
      title: t("Rewrite squares of sine and cosine", "改写正弦与余弦的平方"),
      explanation: t(
        "The power-reducing formulas replace a square by a first power of cosine of the **double** angle. Multiply the whole formula by any coefficient in front:\n\n$$6\\sin^{2} 3x = 6 \\cdot \\frac{1 - \\cos 6x}{2} = 3 - 3\\cos 6x$$",
        "降幂公式把平方换成**二倍角**余弦的一次幂。前面的系数要乘到整个式子上：\n\n$$6\\sin^{2} 3x = 6 \\cdot \\frac{1 - \\cos 6x}{2} = 3 - 3\\cos 6x$$",
      ),
      generate(rng) {
        const a = rng.pick([2, 4, 6, 8, 10, 12]);
        const k = rng.int(1, 6);
        const isSin = rng.bool();
        const s = isSin ? -1 : 1;
        const h = a / 2;
        const f = isSin ? "\\sin" : "\\cos";
        const expr = `${a}${f}^{2} ${kx(k)}`;
        const right = poly([h, ""], [s * h, `\\cos ${kx(2 * k)}`]);
        return oneOf(
          rng,
          t(
            `Use a power-reducing formula to rewrite $${expr}$ using only the first power of cosine.`,
            `用降幂公式把 $${expr}$ 改写为只含余弦一次幂的式子。`,
          ),
          m$(right),
          [
            m$(poly([h, ""], [-s * h, `\\cos ${kx(2 * k)}`])),
            m$(poly([h, ""], [s * h, `\\cos ${kx(k)}`])),
            m$(poly([a, ""], [s * a, `\\cos ${kx(2 * k)}`])),
            m$(poly([h, ""], [s * h, `\\sin ${kx(2 * k)}`])),
          ],
          t(
            `Use $${f}^{2}\\theta = \\frac{1 ${isSin ? "-" : "+"} \\cos 2\\theta}{2}$ with $\\theta = ${kx(k)}$:${steps(`${expr} = ${a} \\cdot \\frac{1 ${isSin ? "-" : "+"} \\cos ${kx(2 * k)}}{2} = ${right}`)}`,
            `利用 $${f}^{2}\\theta = \\frac{1 ${isSin ? "-" : "+"} \\cos 2\\theta}{2}$，其中 $\\theta = ${kx(k)}$：${steps(`${expr} = ${a} \\cdot \\frac{1 ${isSin ? "-" : "+"} \\cos ${kx(2 * k)}}{2} = ${right}`)}`,
          ),
        );
      },
    },
    {
      id: "fourth-powers-and-products",
      title: t("Reduce fourth powers and products of squares", "化简四次方与平方之积"),
      explanation: t(
        "Apply the formulas twice: once to the outer square, then again to the $\\cos^{2} 2x$ that appears.\n\n$$\\cos^{4} x = \\left(\\frac{1 + \\cos 2x}{2}\\right)^{2} = \\frac{1 + 2\\cos 2x + \\cos^{2} 2x}{4} = \\frac{1 + 2\\cos 2x + \\frac{1 + \\cos 4x}{2}}{4} = \\frac{3}{8} + \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$$\n\nIn the same way $\\sin^{4} x = \\frac{3}{8} - \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$ and $\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2} 2x = \\frac{1}{8} - \\frac{1}{8}\\cos 4x$.",
        "两次使用降幂公式：先对外层的平方，再对出现的 $\\cos^{2} 2x$。\n\n$$\\cos^{4} x = \\left(\\frac{1 + \\cos 2x}{2}\\right)^{2} = \\frac{1 + 2\\cos 2x + \\cos^{2} 2x}{4} = \\frac{1 + 2\\cos 2x + \\frac{1 + \\cos 4x}{2}}{4} = \\frac{3}{8} + \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$$\n\n同理，$\\sin^{4} x = \\frac{3}{8} - \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$，$\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2} 2x = \\frac{1}{8} - \\frac{1}{8}\\cos 4x$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 4, 8, 16]);
        const k = rng.int(1, 3);
        const kind = rng.pick(["cos", "sin", "both"] as const);
        const c2 = `\\cos ${kx(2 * k)}`;
        const c4 = `\\cos ${kx(4 * k)}`;
        const A = Q.of(a);
        const lead = a === 1 ? "" : String(a);
        const sum = (c: Q, m: Q, l: Q, cc = c2) => poly([c, ""], [m, cc], [l, c4]);
        if (kind === "both") {
          const expr = `${lead}\\sin^{2} ${kx(k)}\\cos^{2} ${kx(k)}`;
          const e = A.mul(Q.of(1, 8));
          const right = sum(e, Q.zero, e.neg());
          return oneOf(
            rng,
            t(`Rewrite $${expr}$ using only first powers of cosine.`, `把 $${expr}$ 改写为只含余弦一次幂的式子。`),
            m$(right),
            [m$(sum(e, Q.zero, e)), m$(sum(A.mul(Q.of(1, 4)), Q.zero, A.mul(Q.of(-1, 4)))), m$(poly([e, ""], [e.neg(), c2]))],
            t(
              `Use $\\sin\\theta\\cos\\theta = \\frac{1}{2}\\sin 2\\theta$, then reduce the square:${steps(`${expr} = ${a === 1 ? "" : `${a} \\cdot `}\\frac{1}{4}\\sin^{2} ${kx(2 * k)} = ${a === 1 ? "" : `${a} \\cdot `}\\frac{1}{4} \\cdot \\frac{1 - ${c4}}{2} = ${right}`)}`,
              `利用 $\\sin\\theta\\cos\\theta = \\frac{1}{2}\\sin 2\\theta$，再对平方降幂：${steps(`${expr} = ${a === 1 ? "" : `${a} \\cdot `}\\frac{1}{4}\\sin^{2} ${kx(2 * k)} = ${a === 1 ? "" : `${a} \\cdot `}\\frac{1}{4} \\cdot \\frac{1 - ${c4}}{2} = ${right}`)}`,
            ),
          );
        }
        const s = kind === "sin" ? -1 : 1;
        const f = kind === "sin" ? "\\sin" : "\\cos";
        const expr = `${lead}${f}^{4} ${kx(k)}`;
        const c = A.mul(Q.of(3, 8));
        const m = A.mul(Q.of(s, 2));
        const l = A.mul(Q.of(1, 8));
        const right = sum(c, m, l);
        return oneOf(
          rng,
          t(`Rewrite $${expr}$ using only first powers of cosine.`, `把 $${expr}$ 改写为只含余弦一次幂的式子。`),
          m$(right),
          [
            m$(sum(c, m.neg(), l)),
            m$(sum(A.mul(Q.of(1, 4)), m, A.mul(Q.of(1, 4)))),
            m$(sum(c, m, l.neg())),
            m$(sum(c, m, l, `\\cos ${kx(k)}`)),
          ],
          t(
            `Square the formula for $${f}^{2} ${kx(k)}$, then reduce $\\cos^{2} ${kx(2 * k)}$ again:${steps(
              `${f}^{4} ${kx(k)} = \\left(\\frac{1 ${s < 0 ? "-" : "+"} ${c2}}{2}\\right)^{2} = \\frac{1 ${s < 0 ? "-" : "+"} 2${c2} + \\frac{1 + ${c4}}{2}}{4} = \\frac{3}{8} ${s < 0 ? "-" : "+"} \\frac{1}{2}${c2} + \\frac{1}{8}${c4}`,
              `${expr} = ${right}`,
            )}`,
            `把 $${f}^{2} ${kx(k)}$ 的公式平方，再对 $\\cos^{2} ${kx(2 * k)}$ 降幂：${steps(
              `${f}^{4} ${kx(k)} = \\left(\\frac{1 ${s < 0 ? "-" : "+"} ${c2}}{2}\\right)^{2} = \\frac{1 ${s < 0 ? "-" : "+"} 2${c2} + \\frac{1 + ${c4}}{2}}{4} = \\frac{3}{8} ${s < 0 ? "-" : "+"} \\frac{1}{2}${c2} + \\frac{1}{8}${c4}`,
              `${expr} = ${right}`,
            )}`,
          ),
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
  knowledgePoints: [
    {
      id: "exponential-form-to-rectangular-form",
      title: t("Convert exponential form to rectangular form", "把指数形式化为代数形式"),
      explanation: t(
        "**Euler's formula** states that for every real $\\theta$\n\n$$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$\n\nso $re^{i\\theta}$ is another way of writing $r(\\cos\\theta + i\\sin\\theta) = r\\,\\text{cis}\\,\\theta$. To convert to rectangular form, evaluate the cosine and sine:\n\n$$4e^{i\\frac{2\\pi}{3}} = 4\\left(-\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = -2 + 2i\\sqrt{3}$$\n\nWith $\\theta = \\pi$ it gives **Euler's identity** $e^{i\\pi} = -1$.",
        "**欧拉公式**指出，对任意实数 $\\theta$，\n\n$$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$\n\n因此 $re^{i\\theta}$ 是 $r(\\cos\\theta + i\\sin\\theta) = r\\,\\text{cis}\\,\\theta$ 的另一种写法。化为代数形式时，求出余弦与正弦的值：\n\n$$4e^{i\\frac{2\\pi}{3}} = 4\\left(-\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = -2 + 2i\\sqrt{3}$$\n\n取 $\\theta = \\pi$ 便得到**欧拉恒等式** $e^{i\\pi} = -1$。",
      ),
      generate(rng) {
        const r = rng.pick([2, 4, 6]);
        const base = rng.pick(ALL_SPECIAL);
        const d = base !== 0 && rng.bool(0.25) ? base - 360 : base;
        const R = r * r;
        const z = expTex(String(r), radTex(d));
        const answer = rectTex(rect(R, d));
        return expressionProblem({
          prompt: t(`Write $${z}$ in the form $a + bi$.`, `把 $${z}$ 写成 $a + bi$ 的形式。`),
          answer,
          radical: true,
          wrong: defined([rectTexAt(R, -d), rectTexAt(R, 90 - d), rectTexAt(R, 180 - d)]),
          solution: t(
            `By Euler's formula:${steps(`${z} = ${polarTex(String(r), radTex(d))} = ${answer}`)}`,
            `由欧拉公式：${steps(`${z} = ${polarTex(String(r), radTex(d))} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "rectangular-form-to-exponential-form",
      figure: precalculusDrawings3["eulers-formula#rectangular-form-to-exponential-form"],
      title: t("Convert rectangular form to exponential form", "把代数形式化为指数形式"),
      explanation: t(
        "To write $z = a + bi$ as $re^{i\\theta}$, find the modulus $r = |z| = \\sqrt{a^{2} + b^{2}}$ and the argument $\\theta$ from the quadrant of $z$, exactly as for polar form. For $z = -3 + 3i$: $r = \\sqrt{18} = 3\\sqrt{2}$ and $z$ lies in quadrant II with reference angle $\\frac{\\pi}{4}$, so $\\theta = \\frac{3\\pi}{4}$ and $z = 3\\sqrt{2}e^{i\\frac{3\\pi}{4}}$.",
        "把 $z = a + bi$ 写成 $re^{i\\theta}$ 时，求出模长 $r = |z| = \\sqrt{a^{2} + b^{2}}$，并根据 $z$ 所在象限求出辐角 $\\theta$，方法与三角形式相同。对 $z = -3 + 3i$：$r = \\sqrt{18} = 3\\sqrt{2}$，$z$ 在第二象限，参考角为 $\\frac{\\pi}{4}$，所以 $\\theta = \\frac{3\\pi}{4}$，$z = 3\\sqrt{2}e^{i\\frac{3\\pi}{4}}$。",
      ),
      generate(rng) {
        const [R, d] = rng.pick([
          ...SPECIAL.flatMap((a) => [[4, a] as const, [16, a] as const]),
          ...[45, 135, 225, 315].flatMap((a) => [[2, a] as const, [8, a] as const, [18, a] as const]),
        ]);
        const z = rectTex(rect(R, d));
        const mod = modTex(R);
        const right = expTex(mod, radTex(d));
        return oneOf(
          rng,
          t(
            `Write $z = ${z}$ in exponential form $re^{i\\theta}$ with $r > 0$ and $0 \\le \\theta < 2\\pi$.`,
            `把 $z = ${z}$ 写成指数形式 $re^{i\\theta}$，其中 $r > 0$，$0 \\le \\theta < 2\\pi$。`,
          ),
          m$(right),
          [
            m$(expTex(mod, radTex(mod360(180 - d)))),
            m$(expTex(mod, radTex(mod360(-d)))),
            m$(expTex(String(R), radTex(d))),
            m$(expTex(mod, radTex(mod360(d + 180)))),
          ],
          t(
            `The modulus is $|z| = \\sqrt{${R}} = ${mod}$, and the quadrant of $z$ gives the argument $\\theta = ${radTex(d)}$. So $z = ${right}$.`,
            `模长 $|z| = \\sqrt{${R}} = ${mod}$，由 $z$ 所在的位置得辐角 $\\theta = ${radTex(d)}$。所以 $z = ${right}$。`,
          ),
        );
      },
    },
    {
      id: "operations-in-exponential-form",
      title: t("Multiply, divide and raise to powers in exponential form", "指数形式下的乘、除与乘方"),
      explanation: t(
        "The laws of exponents hold for $e^{i\\theta}$, which makes the polar rules short:\n\n$$r_{1}e^{i\\alpha} \\cdot r_{2}e^{i\\beta} = r_{1}r_{2}e^{i(\\alpha + \\beta)} \\qquad \\frac{r_{1}e^{i\\alpha}}{r_{2}e^{i\\beta}} = \\frac{r_{1}}{r_{2}}e^{i(\\alpha - \\beta)} \\qquad \\left(re^{i\\theta}\\right)^{n} = r^{n}e^{in\\theta}$$\n\nThe last rule is De Moivre's theorem. Reduce the resulting angle into $[0, 2\\pi)$.",
        "指数运算法则对 $e^{i\\theta}$ 同样成立，于是三角形式的运算法则可以写得很简洁：\n\n$$r_{1}e^{i\\alpha} \\cdot r_{2}e^{i\\beta} = r_{1}r_{2}e^{i(\\alpha + \\beta)} \\qquad \\frac{r_{1}e^{i\\alpha}}{r_{2}e^{i\\beta}} = \\frac{r_{1}}{r_{2}}e^{i(\\alpha - \\beta)} \\qquad \\left(re^{i\\theta}\\right)^{n} = r^{n}e^{in\\theta}$$\n\n最后一条就是棣莫弗定理。所得的角要化到 $[0, 2\\pi)$ 内。",
      ),
      generate(rng) {
        const angle = () => {
          const q = rng.pick([3, 4, 5, 6, 8, 12]);
          return Q.of(rng.pick(coprimeTo(q, 2 * q - 1)), q);
        };
        const op = rng.pick(["product", "quotient", "power"] as const);
        const e = (mod: number | string, a: Q) => expTex(String(mod), piTex(normPi(a)));
        for (;;) {
          const a = angle();
          const b = angle();
          if (op === "power") {
            const r = rng.pick([2, 3]);
            const n = rng.int(2, 4);
            const res = normPi(a.mul(Q.of(n)));
            if (res.isZero()) continue;
            const z = `\\left(${e(r, a)}\\right)^{${n}}`;
            const right = e(r ** n, res);
            return oneOf(
              rng,
              t(`Simplify $${z}$. Give the angle in $[0, 2\\pi)$.`, `化简 $${z}$，角取在 $[0, 2\\pi)$ 内。`),
              m$(right),
              [m$(e(n * r, res)), m$(e(r ** n, a)), m$(e(r, res))],
              t(
                `Raise the modulus to the power and multiply the angle:${steps(`${z} = ${r}^{${n}}e^{i \\cdot ${n} \\cdot ${piTex(a)}} = ${right}`)}`,
                `模长取幂，角乘以指数：${steps(`${z} = ${r}^{${n}}e^{i \\cdot ${n} \\cdot ${piTex(a)}} = ${right}`)}`,
              ),
            );
          }
          if (op === "product") {
            const r1 = rng.pick([2, 3, 4, 5]);
            const r2 = rng.pick([2, 3, 4, 5]);
            const res = normPi(a.add(b));
            if (res.isZero() || a.eq(b)) continue;
            const z = `\\left(${e(r1, a)}\\right)\\left(${e(r2, b)}\\right)`;
            const right = e(r1 * r2, res);
            return oneOf(
              rng,
              t(`Simplify $${z}$. Give the angle in $[0, 2\\pi)$.`, `化简 $${z}$，角取在 $[0, 2\\pi)$ 内。`),
              m$(right),
              [m$(e(r1 + r2, res)), m$(e(r1 * r2, a.sub(b))), m$(e(r1 * r2, a.mul(b)))],
              t(
                `Multiply the moduli and add the angles:${steps(`${z} = ${r1 * r2}e^{i\\left(${piTex(a)} + ${piTex(b)}\\right)} = ${right}`)}`,
                `模长相乘，角相加：${steps(`${z} = ${r1 * r2}e^{i\\left(${piTex(a)} + ${piTex(b)}\\right)} = ${right}`)}`,
              ),
            );
          }
          const r2 = rng.pick([2, 3]);
          const k = rng.pick([2, 3, 4]);
          const r1 = r2 * k;
          const res = normPi(a.sub(b));
          if (res.isZero() || normPi(a.add(b)).isZero()) continue;
          const z = `\\frac{${e(r1, a)}}{${e(r2, b)}}`;
          const right = e(k, res);
          return oneOf(
            rng,
            t(`Simplify $${z}$. Give the angle in $[0, 2\\pi)$.`, `化简 $${z}$，角取在 $[0, 2\\pi)$ 内。`),
            m$(right),
            [m$(e(k, a.add(b))), m$(e(k, b.sub(a))), m$(e(r1 - r2, res))],
            t(
              `Divide the moduli and subtract the angles:${steps(`${z} = \\frac{${r1}}{${r2}}e^{i\\left(${piTex(a)} - ${piTex(b)}\\right)} = ${right}`)}`,
              `模长相除，角相减：${steps(`${z} = \\frac{${r1}}{${r2}}e^{i\\left(${piTex(a)} - ${piTex(b)}\\right)} = ${right}`)}`,
            ),
          );
        }
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
  knowledgePoints: [
    {
      id: "arguments-of-roots-of-unity",
      figure: precalculusDrawings3["the-roots-of-unity#arguments-of-roots-of-unity"],
      title: t("Find the arguments of the roots of unity", "求单位根的辐角"),
      explanation: t(
        "If $z^{n} = 1$ then $|z|^{n} = 1$, so $|z| = 1$, and by De Moivre's theorem $n\\arg(z)$ must be a multiple of $2\\pi$. The $n$ solutions, the **$n$th roots of unity**, are\n\n$$\\omega_{k} = e^{\\frac{2\\pi i k}{n}} = \\cos\\frac{2\\pi k}{n} + i\\sin\\frac{2\\pi k}{n}, \\qquad k = 0, 1, \\ldots, n - 1$$\n\nThey are equally spaced on the unit circle, $\\frac{360^{\\circ}}{n}$ apart, starting from $\\omega_{0} = 1$. For $n = 8$ and $k = 3$: $\\arg\\omega_{3} = \\frac{360^{\\circ} \\cdot 3}{8} = 135^{\\circ}$.",
        "若 $z^{n} = 1$，则 $|z|^{n} = 1$，所以 $|z| = 1$；再由棣莫弗定理，$n\\arg(z)$ 必须是 $2\\pi$ 的整数倍。这 $n$ 个解称为 **$n$ 次单位根**：\n\n$$\\omega_{k} = e^{\\frac{2\\pi i k}{n}} = \\cos\\frac{2\\pi k}{n} + i\\sin\\frac{2\\pi k}{n}, \\qquad k = 0, 1, \\ldots, n - 1$$\n\n它们从 $\\omega_{0} = 1$ 开始，在单位圆上等间隔分布，相邻两个相差 $\\frac{360^{\\circ}}{n}$。当 $n = 8$、$k = 3$ 时，$\\arg\\omega_{3} = \\frac{360^{\\circ} \\cdot 3}{8} = 135^{\\circ}$。",
      ),
      generate(rng) {
        const n = rng.pick(ORDERS);
        const k = rng.int(1, n - 1);
        const answer = (360 * k) / n;
        return numberProblem({
          prompt: t(
            `The ${ordinal(n)} roots of unity are $\\omega_{k} = ${rootOfUnity(0, n).replace("\\cdot 0", "k")}$ for $k = 0, 1, \\ldots, ${n - 1}$. Find the argument of $\\omega_{${k}}$ in degrees.`,
            `${n} 次单位根为 $\\omega_{k} = ${rootOfUnity(0, n).replace("\\cdot 0", "k")}$，$k = 0, 1, \\ldots, ${n - 1}$。求 $\\omega_{${k}}$ 的辐角（用度表示）。`,
          ),
          answer,
          unit: "°",
          wrong: [Q.of(180 * k, n), Q.of(360 * (k + 1), n), Q.of(360, n), Q.of(360 * k, n + 1)],
          solution: t(
            `Consecutive roots are $\\frac{360^{\\circ}}{${n}}$ apart, so${steps(`\\arg\\omega_{${k}} = \\frac{360^{\\circ} \\cdot ${k}}{${n}} = ${answer}^{\\circ}`)}`,
            `相邻两根相差 $\\frac{360^{\\circ}}{${n}}$，所以${steps(`\\arg\\omega_{${k}} = \\frac{360^{\\circ} \\cdot ${k}}{${n}} = ${answer}^{\\circ}`)}`,
          ),
        });
      },
    },
    {
      id: "roots-of-unity-in-rectangular-form",
      figure: precalculusDrawings3["the-roots-of-unity#roots-of-unity-in-rectangular-form"],
      title: t("Write roots of unity in rectangular form", "把单位根写成代数形式"),
      explanation: t(
        "When $\\frac{360^{\\circ} k}{n}$ is a special angle, the root of unity has an exact rectangular form. For $n = 3$ and $k = 1$:\n\n$$e^{\\frac{2\\pi i}{3}} = \\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3} = -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$$\n\nso the cube roots of unity are $1$ and $-\\frac{1}{2} \\pm \\frac{\\sqrt{3}}{2}i$.",
        "当 $\\frac{360^{\\circ} k}{n}$ 是特殊角时，单位根有精确的代数形式。当 $n = 3$、$k = 1$ 时：\n\n$$e^{\\frac{2\\pi i}{3}} = \\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3} = -\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$$\n\n所以三次单位根是 $1$ 和 $-\\frac{1}{2} \\pm \\frac{\\sqrt{3}}{2}i$。",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 6, 8, 12]);
        const k = rng.int(1, n - 1);
        const d = (360 * k) / n;
        const w = rootOfUnity(k, n);
        const right = unitTex(d);
        return reasoned(
          oneOf(
            rng,
            t(`Write the ${ordinal(n)} root of unity $${w}$ in the form $a + bi$.`, `把 ${n} 次单位根 $${w}$ 写成 $a + bi$ 的形式。`),
            m$(right),
            [m$(unitTex(90 - d)), m$(unitTex(-d)), m$(unitTex(180 - d)), m$(unitTex(d + 180))],
            t(
              `The angle is $\\frac{2\\pi \\cdot ${k}}{${n}} = ${radTex(d)}$:${steps(`${w} = \\cos\\left(${radTex(d)}\\right) + i\\sin\\left(${radTex(d)}\\right) = ${right}`)}`,
              `角为 $\\frac{2\\pi \\cdot ${k}}{${n}} = ${radTex(d)}$：${steps(`${w} = \\cos\\left(${radTex(d)}\\right) + i\\sin\\left(${radTex(d)}\\right) = ${right}`)}`,
            ),
          ),
          [
            [
              m$(unitTex(90 - d)).en,
              "The real and imaginary parts are swapped: the real part is the cosine of the angle.",
              "实部和虚部弄反了：实部是角的余弦。",
            ],
            [
              m$(unitTex(-d)).en,
              "The imaginary part has the wrong sign: this is its mirror image in the real axis.",
              "虚部的符号错了：这是它关于实轴的对称点。",
            ],
            [
              m$(unitTex(180 - d)).en,
              "The real part has the wrong sign: this is its mirror image in the imaginary axis.",
              "实部的符号错了：这是它关于虚轴的对称点。",
            ],
            [
              m$(unitTex(d + 180)).en,
              "Both parts have the wrong sign: this point is opposite through the origin.",
              "两部分的符号都错了：这是它关于原点的对称点。",
            ],
          ],
        );
      },
    },
    {
      id: "counting-roots-of-unity",
      figure: precalculusDrawings4["the-roots-of-unity#counting-roots-of-unity"],
      title: t("Count roots of unity by location", "按位置统计单位根的个数"),
      explanation: t(
        "Since the $n$th roots of unity sit at the angles $0^{\\circ}, \\frac{360^{\\circ}}{n}, \\frac{2 \\cdot 360^{\\circ}}{n}, \\ldots$, their positions can be counted:\n\n- $1$ is always a root; $-1$ (at $180^{\\circ}$) is a root exactly when $n$ is even. So there are $2$ real roots when $n$ is even and $1$ when $n$ is odd.\n- The nonreal roots come in conjugate pairs, so half of them have a positive imaginary part.\n\nFor $n = 8$ the roots are at $0^{\\circ}, 45^{\\circ}, \\ldots, 315^{\\circ}$: $2$ are real, $3$ have a positive imaginary part, and $1$ lies strictly inside quadrant I.",
        "$n$ 次单位根位于角 $0^{\\circ}, \\frac{360^{\\circ}}{n}, \\frac{2 \\cdot 360^{\\circ}}{n}, \\ldots$ 处，因此可以按位置计数：\n\n- $1$ 总是单位根；$-1$（位于 $180^{\\circ}$）是单位根当且仅当 $n$ 为偶数。所以 $n$ 为偶数时有 $2$ 个实根，$n$ 为奇数时有 $1$ 个。\n- 非实根成对共轭出现，所以其中一半的虚部为正。\n\n当 $n = 8$ 时，根位于 $0^{\\circ}, 45^{\\circ}, \\ldots, 315^{\\circ}$：$2$ 个是实数，$3$ 个虚部为正，$1$ 个严格位于第一象限内。",
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
        return numberProblem({
          prompt: t(`How many of the ${ordinal(n)} roots of unity ${what.en}?`, `${n} 次单位根中有多少个${what["zh-CN"]}？`),
          answer,
          form: "integer",
          wrong: [n, n - real, real === 2 ? 1 : 2, upper + 1, first + 1],
          solution: t(
            `The ${ordinal(n)} roots of unity have the arguments${steps(list)}Counting those that ${what.en} gives $${answer}$.`,
            `${n} 次单位根的辐角为${steps(list)}其中${what["zh-CN"]}的有 $${answer}$ 个。`,
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
  knowledgePoints: [
    {
      id: "powers-and-conjugates-of-a-primitive-root",
      title: t("Simplify powers, conjugates and reciprocals", "化简幂、共轭与倒数"),
      explanation: t(
        "Let $\\omega = e^{\\frac{2\\pi i}{n}}$. The $n$th roots of unity are $1, \\omega, \\omega^{2}, \\ldots, \\omega^{n-1}$, and since $\\omega^{n} = 1$:\n\n- powers repeat every $n$ steps: $\\omega^{m} = \\omega^{r}$ where $r$ is the remainder of $m$ divided by $n$;\n- $|\\omega^{k}| = 1$, so the conjugate equals the reciprocal: $\\overline{\\omega^{k}} = \\frac{1}{\\omega^{k}} = \\omega^{n-k}$.\n\nFor $n = 7$: $\\omega^{23} = \\omega^{2}$ because $23 = 3 \\cdot 7 + 2$, and $\\overline{\\omega^{3}} = \\omega^{4}$.",
        "设 $\\omega = e^{\\frac{2\\pi i}{n}}$。$n$ 次单位根为 $1, \\omega, \\omega^{2}, \\ldots, \\omega^{n-1}$，又因为 $\\omega^{n} = 1$：\n\n- 幂每隔 $n$ 次重复一次：$\\omega^{m} = \\omega^{r}$，其中 $r$ 是 $m$ 除以 $n$ 的余数；\n- $|\\omega^{k}| = 1$，所以共轭等于倒数：$\\overline{\\omega^{k}} = \\frac{1}{\\omega^{k}} = \\omega^{n-k}$。\n\n当 $n = 7$ 时：因为 $23 = 3 \\cdot 7 + 2$，所以 $\\omega^{23} = \\omega^{2}$；$\\overline{\\omega^{3}} = \\omega^{4}$。",
      ),
      generate(rng) {
        const n = rng.int(5, 12);
        const kind = rng.pick(["power", "conjugate", "reciprocal"] as const);
        const w = `\\omega = e^{\\frac{2\\pi i}{${n}}}`;
        let m: number;
        let expr: string;
        let answer: number;
        let why: [string, string];
        if (kind === "power") {
          do m = rng.int(n + 1, 4 * n);
          while (m % n === 0);
          answer = m % n;
          expr = `\\omega^{${m}}`;
          const step = `\\omega^{${m}} = \\left(\\omega^{${n}}\\right)^{${Math.floor(m / n)}}\\omega^{${answer}} = ${omegaTex(answer)}`;
          why = [
            `Since $\\omega^{${n}} = 1$ and $${m} = ${Math.floor(m / n)} \\cdot ${n} + ${answer}$:${steps(step)}`,
            `因为 $\\omega^{${n}} = 1$，且 $${m} = ${Math.floor(m / n)} \\cdot ${n} + ${answer}$：${steps(step)}`,
          ];
        } else {
          m = rng.int(2, n - 1);
          answer = n - m;
          expr = kind === "conjugate" ? `\\overline{\\omega^{${m}}}` : `\\frac{1}{\\omega^{${m}}}`;
          const step = `${expr} = \\frac{\\omega^{${n}}}{\\omega^{${m}}} = \\omega^{${n} - ${m}} = ${omegaTex(answer)}`;
          const lead: [string, string] =
            kind === "conjugate"
              ? [
                  `Since $|\\omega^{k}| = 1$, the conjugate equals the reciprocal, and $\\omega^{${n}} = 1$:`,
                  `因为 $|\\omega^{k}| = 1$，共轭等于倒数，且 $\\omega^{${n}} = 1$：`,
                ]
              : [`Write $1$ as $\\omega^{${n}}$:`, `把 $1$ 写成 $\\omega^{${n}}$：`];
          why = [`${lead[0]}${steps(step)}`, `${lead[1]}${steps(step)}`];
        }
        const candidates = [m % n, answer + 1, answer - 1, n - answer, (m + 1) % n, 1];
        const wrong = [...new Set(candidates.map((e) => ((e % n) + n) % n))].filter((e) => e !== answer);
        return oneOf(
          rng,
          t(
            `Let $${w}$. Write $${expr}$ as $1$ or as a power $\\omega^{k}$ with $1 \\le k < ${n}$.`,
            `设 $${w}$。把 $${expr}$ 写成 $1$ 或幂 $\\omega^{k}$（$1 \\le k < ${n}$）的形式。`,
          ),
          m$(omegaTex(answer)),
          wrong.map((e) => m$(omegaTex(e))),
          t(why[0], why[1]),
        );
      },
    },
    {
      id: "sums-and-products-of-roots-of-unity",
      title: t("Sums and products of all the roots of unity", "全部单位根的和与积"),
      explanation: t(
        "The $n$th roots of unity are the roots of $z^{n} - 1 = 0$. The coefficient of $z^{n-1}$ is $0$, so by Vieta's formulas their **sum is $0$** (for $n \\ge 2$), and their **product is $(-1)^{n+1}$**. Equivalently, $1 + \\omega + \\omega^{2} + \\cdots + \\omega^{n-1} = \\frac{\\omega^{n} - 1}{\\omega - 1} = 0$, so the roots other than $1$ sum to $-1$.\n\nThe $m$th powers of all the roots sum to $n$ when $n$ divides $m$ (every power is $1$), and to $0$ otherwise (they are the same roots in another order, possibly repeated evenly).",
        "$n$ 次单位根是 $z^{n} - 1 = 0$ 的根。$z^{n-1}$ 的系数为 $0$，由韦达定理，它们的**和为 $0$**（$n \\ge 2$），**积为 $(-1)^{n+1}$**。等价地，$1 + \\omega + \\omega^{2} + \\cdots + \\omega^{n-1} = \\frac{\\omega^{n} - 1}{\\omega - 1} = 0$，所以除 $1$ 以外的根之和为 $-1$。\n\n所有根的 $m$ 次幂之和：当 $n$ 整除 $m$ 时为 $n$（每个幂都是 $1$），否则为 $0$（它们是同一组根的均匀重复排列）。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const kind = rng.pick(["sum", "product", "others", "powers", "powers"] as const);
        if (kind === "powers") {
          const m = rng.bool(0.4) ? n * rng.int(1, 4) : rng.int(2, 40);
          const answer = m % n === 0 ? n : 0;
          return numberProblem({
            prompt: t(
              `Let $\\omega_{0}, \\omega_{1}, \\ldots, \\omega_{${n - 1}}$ be the ${ordinal(n)} roots of unity. Find $\\omega_{0}^{${m}} + \\omega_{1}^{${m}} + \\cdots + \\omega_{${n - 1}}^{${m}}$.`,
              `设 $\\omega_{0}, \\omega_{1}, \\ldots, \\omega_{${n - 1}}$ 为 ${n} 次单位根。求 $\\omega_{0}^{${m}} + \\omega_{1}^{${m}} + \\cdots + \\omega_{${n - 1}}^{${m}}$。`,
            ),
            answer,
            form: "integer",
            wrong: [answer === 0 ? n : 0, 1, -1, m],
            solution:
              answer === n
                ? t(
                    `Since $${n}$ divides $${m}$, every $\\omega_{k}^{${m}} = 1$, and the sum is $${n}$.`,
                    `因为 $${n}$ 整除 $${m}$，每个 $\\omega_{k}^{${m}} = 1$，所以和为 $${n}$。`,
                  )
                : t(
                    `With $\\omega = e^{\\frac{2\\pi i}{${n}}}$, the sum is $1 + \\omega^{${m}} + \\omega^{${2 * m}} + \\cdots$, a geometric series with ratio $\\omega^{${m}} \\ne 1$:${steps(`\\frac{\\left(\\omega^{${m}}\\right)^{${n}} - 1}{\\omega^{${m}} - 1} = \\frac{1 - 1}{\\omega^{${m}} - 1} = 0`)}`,
                    `令 $\\omega = e^{\\frac{2\\pi i}{${n}}}$，和为 $1 + \\omega^{${m}} + \\omega^{${2 * m}} + \\cdots$，是公比为 $\\omega^{${m}} \\ne 1$ 的等比数列之和：${steps(`\\frac{\\left(\\omega^{${m}}\\right)^{${n}} - 1}{\\omega^{${m}} - 1} = \\frac{1 - 1}{\\omega^{${m}} - 1} = 0`)}`,
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
            solution: t(
              `The roots of $z^{${n}} - 1 = 0$ have product $(-1)^{${n}} \\cdot (-1) = (-1)^{${n + 1}} = ${answer}$ by Vieta's formulas.`,
              `由韦达定理，$z^{${n}} - 1 = 0$ 的根之积为 $(-1)^{${n}} \\cdot (-1) = (-1)^{${n + 1}} = ${answer}$。`,
            ),
          });
        }
        if (kind === "sum") {
          return numberProblem({
            prompt: t(`Find the sum of all the ${ordinal(n)} roots of unity.`, `求所有 ${n} 次单位根之和。`),
            answer: 0,
            form: "integer",
            wrong: [1, -1, n],
            solution: t(
              `In $z^{${n}} - 1 = 0$ the coefficient of $z^{${n - 1}}$ is $0$, so by Vieta's formulas the roots sum to $0$.`,
              `在 $z^{${n}} - 1 = 0$ 中，$z^{${n - 1}}$ 的系数为 $0$，由韦达定理，根之和为 $0$。`,
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
          solution: t(
            `All ${ordinal(n)} roots of unity sum to $0$:${steps(`1 + \\omega + \\omega^{2} + \\cdots + \\omega^{${n - 1}} = 0`)}so the sum without $1$ is $-1$.`,
            `所有 ${n} 次单位根之和为 $0$：${steps(`1 + \\omega + \\omega^{2} + \\cdots + \\omega^{${n - 1}} = 0`)}所以去掉 $1$ 后的和为 $-1$。`,
          ),
        });
      },
    },
    {
      id: "identities-of-the-cube-roots-of-unity",
      title: t("Use the identities of the cube roots of unity", "运用三次单位根的恒等式"),
      explanation: t(
        "Let $\\omega$ be a nonreal cube root of unity. Then $\\omega^{3} = 1$ and\n\n$$1 + \\omega + \\omega^{2} = 0, \\qquad \\overline{\\omega} = \\omega^{2}$$\n\nThese identities simplify expressions without rectangular forms. For example $3 + 5\\omega + 5\\omega^{2} = 3 + 5(\\omega + \\omega^{2}) = 3 - 5 = -2$, and multiplying out with $\\omega^{3} = 1$:\n\n$$(a + b\\omega + c\\omega^{2})(a + b\\omega^{2} + c\\omega) = a^{2} + b^{2} + c^{2} - ab - bc - ca$$",
        "设 $\\omega$ 是一个非实数的三次单位根，则 $\\omega^{3} = 1$，且\n\n$$1 + \\omega + \\omega^{2} = 0, \\qquad \\overline{\\omega} = \\omega^{2}$$\n\n利用这些恒等式，不必化为代数形式即可化简。例如 $3 + 5\\omega + 5\\omega^{2} = 3 + 5(\\omega + \\omega^{2}) = 3 - 5 = -2$；再利用 $\\omega^{3} = 1$ 展开可得：\n\n$$(a + b\\omega + c\\omega^{2})(a + b\\omega^{2} + c\\omega) = a^{2} + b^{2} + c^{2} - ab - bc - ca$$",
      ),
      generate(rng) {
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
            solution: t(
              `Since $\\omega + \\omega^{2} = -1$:${steps(`${expr} = ${a} + ${b < 0 ? `(${b})` : b}\\left(\\omega + \\omega^{2}\\right) = ${a} - ${b < 0 ? `(${b})` : b} = ${a - b}`)}`,
              `因为 $\\omega + \\omega^{2} = -1$：${steps(`${expr} = ${a} + ${b < 0 ? `(${b})` : b}\\left(\\omega + \\omega^{2}\\right) = ${a} - ${b < 0 ? `(${b})` : b} = ${a - b}`)}`,
            ),
          });
        }
        const [a, b, c] = rng.sample([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 3) as [number, number, number];
        const f1 = poly([a, ""], [b, "\\omega"], [c, "\\omega^{2}"]);
        const f2 = poly([a, ""], [b, "\\omega^{2}"], [c, "\\omega"]);
        const answer = a * a + b * b + c * c - a * b - b * c - c * a;
        return numberProblem({
          prompt: t(
            `Let $\\omega$ be a nonreal cube root of unity. Evaluate $\\left(${f1}\\right)\\left(${f2}\\right)$.`,
            `设 $\\omega$ 是一个非实数的三次单位根。求 $\\left(${f1}\\right)\\left(${f2}\\right)$ 的值。`,
          ),
          answer,
          form: "integer",
          wrong: [a * a + b * b + c * c + a * b + b * c + c * a, a * a + b * b + c * c, (a + b + c) ** 2],
          solution: t(
            `Expand with $\\omega^{3} = 1$, so $\\omega^{4} = \\omega$; the cross terms collect as $(ab + bc + ca)(\\omega + \\omega^{2}) = -(ab + bc + ca)$:${steps(`a^{2} + b^{2} + c^{2} - ab - bc - ca = ${a * a} + ${b * b} + ${c * c} - (${a * b}) - (${b * c}) - (${c * a}) = ${answer}`)}`,
            `利用 $\\omega^{3} = 1$（从而 $\\omega^{4} = \\omega$）展开，交叉项合并为 $(ab + bc + ca)(\\omega + \\omega^{2}) = -(ab + bc + ca)$：${steps(`a^{2} + b^{2} + c^{2} - ab - bc - ca = ${a * a} + ${b * b} + ${c * c} - (${a * b}) - (${b * c}) - (${c * a}) = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "square-roots-by-equating-parts",
      title: t("Find square roots by equating parts", "比较实部与虚部求平方根"),
      explanation: t(
        "To find $\\sqrt{a + bi}$, set $(x + yi)^{2} = a + bi$ with real $x$ and $y$. Expanding gives $x^{2} - y^{2} + 2xyi$, so\n\n$$x^{2} - y^{2} = a, \\qquad 2xy = b$$\n\nAlso $|x + yi|^{2} = |a + bi|$ gives $x^{2} + y^{2} = \\sqrt{a^{2} + b^{2}}$. Adding and subtracting find $x^{2}$ and $y^{2}$; the sign of $b$ tells whether $x$ and $y$ have the same sign. For $-5 + 12i$: $x^{2} - y^{2} = -5$ and $x^{2} + y^{2} = 13$, so $x^{2} = 4$, $y^{2} = 9$, and $2xy = 12 > 0$ gives the roots $2 + 3i$ and $-2 - 3i$.",
        "求 $\\sqrt{a + bi}$ 时，设 $(x + yi)^{2} = a + bi$，其中 $x$、$y$ 为实数。展开得 $x^{2} - y^{2} + 2xyi$，所以\n\n$$x^{2} - y^{2} = a, \\qquad 2xy = b$$\n\n又由 $|x + yi|^{2} = |a + bi|$ 得 $x^{2} + y^{2} = \\sqrt{a^{2} + b^{2}}$。两式相加、相减求出 $x^{2}$ 与 $y^{2}$，再由 $b$ 的符号判断 $x$、$y$ 是否同号。对 $-5 + 12i$：$x^{2} - y^{2} = -5$，$x^{2} + y^{2} = 13$，所以 $x^{2} = 4$，$y^{2} = 9$，又 $2xy = 12 > 0$，两个平方根为 $2 + 3i$ 与 $-2 - 3i$。",
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
        const math = steps(
          `x^{2} - y^{2} = ${a}, \\qquad 2xy = ${b}, \\qquad x^{2} + y^{2} = \\sqrt{${a * a + b * b}} = ${s}`,
          `x^{2} = \\frac{${s} + ${a < 0 ? `(${a})` : a}}{2} = ${x * x}, \\qquad y^{2} = \\frac{${s} - ${a < 0 ? `(${a})` : a}}{2} = ${y * y}`,
        );
        return expressionProblem({
          prompt: t(
            `Find the square root of $${w}$ that has a positive real part. Write it in the form $a + bi$.`,
            `求 $${w}$ 的实部为正的那个平方根，写成 $a + bi$ 的形式。`,
          ),
          answer,
          simplified: true,
          wrong: [cx(-x, -y), cx(x, -y), cx(Math.abs(y), y < 0 ? -x : x), cx(a, 0)],
          solution: t(
            `Set $(x + yi)^{2} = ${w}$ and equate parts:${math}With $x > 0$, $x = ${x}$; since $2xy = ${b}$, $y = ${y}$. The root is $${answer}$ (the other is $${cx(-x, -y)}$).`,
            `设 $(x + yi)^{2} = ${w}$，比较实部与虚部：${math}因为 $x > 0$，$x = ${x}$；又 $2xy = ${b}$，所以 $y = ${y}$。所求平方根为 $${answer}$（另一个是 $${cx(-x, -y)}$）。`,
          ),
        });
      },
    },
    {
      id: "square-roots-in-polar-form",
      figure: precalculusDrawings4["square-roots-of-complex-numbers#square-roots-in-polar-form"],
      title: t("Find square roots in polar form", "在三角形式下求平方根"),
      explanation: t(
        "If $w = r\\,\\text{cis}\\,\\theta$, then by De Moivre's theorem $\\left(\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2}\\right)^{2} = w$. Adding $360^{\\circ}$ to $\\theta$ describes the same $w$ but halves to an angle $180^{\\circ}$ further on, so $w$ has exactly two square roots, which are opposite each other:\n\n$$\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2} \\qquad\\text{and}\\qquad \\sqrt{r}\\,\\text{cis}\\left(\\frac{\\theta}{2} + 180^{\\circ}\\right)$$\n\nFor $w = 9\\,\\text{cis}\\,100^{\\circ}$: $3\\,\\text{cis}\\,50^{\\circ}$ and $3\\,\\text{cis}\\,230^{\\circ}$.",
        "若 $w = r\\,\\text{cis}\\,\\theta$，由棣莫弗定理，$\\left(\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2}\\right)^{2} = w$。给 $\\theta$ 加上 $360^{\\circ}$ 表示的仍是同一个 $w$，但减半后的角多出 $180^{\\circ}$，所以 $w$ 恰有两个平方根，它们互为相反数：\n\n$$\\sqrt{r}\\,\\text{cis}\\frac{\\theta}{2} \\qquad\\text{和}\\qquad \\sqrt{r}\\,\\text{cis}\\left(\\frac{\\theta}{2} + 180^{\\circ}\\right)$$\n\n对 $w = 9\\,\\text{cis}\\,100^{\\circ}$：两个平方根为 $3\\,\\text{cis}\\,50^{\\circ}$ 与 $3\\,\\text{cis}\\,230^{\\circ}$。",
      ),
      generate(rng) {
        const s = rng.int(2, 7);
        const R = s * s;
        const theta = rng.int(1, 179) * 2;
        const h = theta / 2;
        const pairZh = (m1: string, d1: number, m2: string, d2: number) =>
          t(`$${cisDeg(m1, d1)}$ and $${cisDeg(m2, d2)}$`, `$${cisDeg(m1, d1)}$ 和 $${cisDeg(m2, d2)}$`);
        const S = String(s);
        return oneOf(
          rng,
          t(`Find both square roots of $w = ${cisDeg(String(R), theta)}$.`, `求 $w = ${cisDeg(String(R), theta)}$ 的两个平方根。`),
          pairZh(S, h, S, h + 180),
          [
            pairZh(S, h, S, mod360(h + 90)),
            pairZh(S, h, S, mod360(-h)),
            pairZh(String(R), h, String(R), h + 180),
            pairZh(S, theta, S, mod360(theta + 180)),
          ],
          t(
            `Take the square root of the modulus and halve the argument; the second root is $180^{\\circ}$ further on:${steps(`\\sqrt{${R}} = ${s}, \\qquad \\frac{${theta}^{\\circ}}{2} = ${h}^{\\circ}, \\qquad ${h}^{\\circ} + 180^{\\circ} = ${h + 180}^{\\circ}`)}`,
            `模长开平方，辐角减半；第二个根的辐角再加 $180^{\\circ}$：${steps(`\\sqrt{${R}} = ${s}, \\qquad \\frac{${theta}^{\\circ}}{2} = ${h}^{\\circ}, \\qquad ${h}^{\\circ} + 180^{\\circ} = ${h + 180}^{\\circ}`)}`,
          ),
        );
      },
    },
    {
      id: "square-roots-in-rectangular-form",
      figure: precalculusDrawings3["square-roots-of-complex-numbers#square-roots-in-rectangular-form"],
      title: t("Write square roots of special numbers as a + bi", "把特殊复数的平方根写成 a + bi"),
      explanation: t(
        "When the half angle is special, the polar method gives the roots exactly in rectangular form. For $w = -8 + 8i\\sqrt{3} = 16\\,\\text{cis}\\frac{2\\pi}{3}$:\n\n$$\\sqrt{16}\\,\\text{cis}\\frac{\\pi}{3} = 4\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = 2 + 2i\\sqrt{3}$$\n\nand the other square root is its opposite, $-2 - 2i\\sqrt{3}$.",
        "当半角是特殊角时，三角形式的方法可以精确地给出代数形式的平方根。对 $w = -8 + 8i\\sqrt{3} = 16\\,\\text{cis}\\frac{2\\pi}{3}$：\n\n$$\\sqrt{16}\\,\\text{cis}\\frac{\\pi}{3} = 4\\left(\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i\\right) = 2 + 2i\\sqrt{3}$$\n\n另一个平方根是它的相反数 $-2 - 2i\\sqrt{3}$。",
      ),
      generate(rng) {
        const [R, phi] = rng.pick([
          ...[30, 60, -30, -60].flatMap((p) => [[4, p] as const, [16, p] as const, [36, p] as const, [64, p] as const]),
          ...[45, -45].flatMap((p) => [[2, p] as const, [8, p] as const]),
        ]);
        const W = R * R;
        const twice = mod360(2 * phi);
        const polar = rng.bool();
        const w = polar ? polarTex(String(R), radTex(twice)) : rectTex(rect(W, twice));
        const answer = rectTex(rect(R, phi));
        return expressionProblem({
          prompt: t(
            `Find the square root of $${w}$ that has a positive real part. Write it in the form $a + bi$.`,
            `求 $${w}$ 的实部为正的那个平方根，写成 $a + bi$ 的形式。`,
          ),
          answer,
          radical: true,
          wrong: defined([rectTexAt(R, phi + 180), rectTexAt(R, -phi), rectTexAt(R, 90 - phi), rectTexAt(W, phi)]),
          solution: t(
            `In polar form $w = ${polarTex(String(R), radTex(twice))}$. Its square roots have modulus $\\sqrt{${R}} = ${modTex(R)}$ and arguments $${radTex(phi)}$ and $${radTex(phi + 180)}$; the one with a positive real part is${steps(`${polarTex(modTex(R), radTex(phi))} = ${answer}`)}`,
            `化为三角形式 $w = ${polarTex(String(R), radTex(twice))}$。它的平方根模长为 $\\sqrt{${R}} = ${modTex(R)}$，辐角为 $${radTex(phi)}$ 与 $${radTex(phi + 180)}$；实部为正的那个是${steps(`${polarTex(modTex(R), radTex(phi))} = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "recognizing-nth-roots",
      title: t("Recognize the nth roots of a complex number", "识别复数的 n 次方根"),
      explanation: t(
        "The $n$th roots of $w = r(\\cos\\theta + i\\sin\\theta)$ are\n\n$$\\sqrt[n]{r}\\left(\\cos\\frac{\\theta + 2\\pi k}{n} + i\\sin\\frac{\\theta + 2\\pi k}{n}\\right), \\qquad k = 0, 1, \\ldots, n - 1$$\n\nEach has modulus $\\sqrt[n]{r}$, and by De Moivre's theorem its $n$th power has argument $\\theta + 2\\pi k$, the same direction as $w$. Consecutive roots are $\\frac{2\\pi}{n}$ apart. For example, the cube roots of $8\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$ have modulus $2$ and arguments $\\frac{\\pi}{6}$, $\\frac{5\\pi}{6}$ and $\\frac{3\\pi}{2}$.",
        "$w = r(\\cos\\theta + i\\sin\\theta)$ 的 $n$ 次方根为\n\n$$\\sqrt[n]{r}\\left(\\cos\\frac{\\theta + 2\\pi k}{n} + i\\sin\\frac{\\theta + 2\\pi k}{n}\\right), \\qquad k = 0, 1, \\ldots, n - 1$$\n\n每个根的模长都是 $\\sqrt[n]{r}$；由棣莫弗定理，它的 $n$ 次幂的辐角为 $\\theta + 2\\pi k$，与 $w$ 方向相同。相邻两根的辐角相差 $\\frac{2\\pi}{n}$。例如，$8\\left(\\cos\\frac{\\pi}{2} + i\\sin\\frac{\\pi}{2}\\right)$ 的立方根模长为 $2$，辐角为 $\\frac{\\pi}{6}$、$\\frac{5\\pi}{6}$ 与 $\\frac{3\\pi}{2}$。",
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
        const right = polarTex(String(r), piTex(rootAngle(k)));
        const cands: [number, Q][] = [
          [r ** n, rootAngle(k)],
          [r, normPi(theta.div(N).add(Q.of(2 * rng.int(0, n - 1) + 1, n)))],
          [r, normPi(theta.add(Q.of(2 * k, n)))],
          [r, normPi(theta.div(N).add(Q.of(k, 1)).add(Q.of(1, 2)))],
          [r, normPi(theta.mul(N))],
        ];
        const wrong = cands.filter(([mod, a]) => !isRoot(mod, a)).map(([mod, a]) => m$(polarTex(String(mod), piTex(a))));
        const w = polarTex(String(r ** n), piTex(theta));
        const name = ROOT_NAMES[n]!;
        return oneOf(
          rng,
          t(`Which of the following is one of the ${name.en} of $${w}$?`, `下列哪一个是 $${w}$ 的${name["zh-CN"]}之一？`),
          m$(right),
          wrong,
          t(
            `The ${name.en} have modulus $\\sqrt[${n}]{${r ** n}} = ${r}$ and arguments $\\frac{${piTex(theta)} + 2\\pi k}{${n}}$. With $k = ${k}$:${steps(`\\frac{${piTex(theta)} + ${piTex(Q.of(2 * k))}}{${n}} = ${piTex(rootAngle(k))}`)}`,
            `${name["zh-CN"]}的模长为 $\\sqrt[${n}]{${r ** n}} = ${r}$，辐角为 $\\frac{${piTex(theta)} + 2\\pi k}{${n}}$。取 $k = ${k}$：${steps(`\\frac{${piTex(theta)} + ${piTex(Q.of(2 * k))}}{${n}} = ${piTex(rootAngle(k))}`)}`,
          ),
        );
      },
    },
    {
      id: "arguments-of-nth-roots",
      title: t("Find the arguments of the nth roots", "求 n 次方根的辐角"),
      explanation: t(
        "In degrees, the $n$th roots of $r\\,\\text{cis}\\,\\theta$ have arguments\n\n$$\\frac{\\theta}{n}, \\quad \\frac{\\theta}{n} + \\frac{360^{\\circ}}{n}, \\quad \\frac{\\theta}{n} + 2 \\cdot \\frac{360^{\\circ}}{n}, \\quad \\ldots, \\quad \\frac{\\theta}{n} + (n - 1)\\frac{360^{\\circ}}{n}$$\n\nFor the fifth roots of $32\\,\\text{cis}\\,100^{\\circ}$: the smallest argument is $20^{\\circ}$, and the others follow every $72^{\\circ}$: $92^{\\circ}, 164^{\\circ}, 236^{\\circ}, 308^{\\circ}$.",
        "用度表示时，$r\\,\\text{cis}\\,\\theta$ 的 $n$ 次方根的辐角为\n\n$$\\frac{\\theta}{n}, \\quad \\frac{\\theta}{n} + \\frac{360^{\\circ}}{n}, \\quad \\frac{\\theta}{n} + 2 \\cdot \\frac{360^{\\circ}}{n}, \\quad \\ldots, \\quad \\frac{\\theta}{n} + (n - 1)\\frac{360^{\\circ}}{n}$$\n\n对 $32\\,\\text{cis}\\,100^{\\circ}$ 的五次方根：最小辐角为 $20^{\\circ}$，其余每隔 $72^{\\circ}$ 一个：$92^{\\circ}, 164^{\\circ}, 236^{\\circ}, 308^{\\circ}$。",
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
          solution: t(
            `The arguments start at $\\frac{${theta}^{\\circ}}{${n}} = ${b}^{\\circ}$ and increase by $\\frac{360^{\\circ}}{${n}} = ${step}^{\\circ}$:${steps(list)}`,
            `辐角从 $\\frac{${theta}^{\\circ}}{${n}} = ${b}^{\\circ}$ 开始，每次增加 $\\frac{360^{\\circ}}{${n}} = ${step}^{\\circ}$：${steps(list)}`,
          ),
        });
      },
    },
    {
      id: "nth-roots-in-rectangular-form",
      title: t("Write cube and fourth roots as a + bi", "把立方根与四次方根写成 a + bi"),
      explanation: t(
        "Convert $w$ to polar form, find the root in the requested position, and convert it back. The cube roots of $8i = 8\\,\\text{cis}\\frac{\\pi}{2}$ are $2\\,\\text{cis}\\frac{\\pi}{6}$, $2\\,\\text{cis}\\frac{5\\pi}{6}$ and $2\\,\\text{cis}\\frac{3\\pi}{2}$. The one in quadrant II is\n\n$$2\\left(\\cos\\frac{5\\pi}{6} + i\\sin\\frac{5\\pi}{6}\\right) = -\\sqrt{3} + i$$",
        "先把 $w$ 化为三角形式，找出所求位置的根，再化回代数形式。$8i = 8\\,\\text{cis}\\frac{\\pi}{2}$ 的立方根为 $2\\,\\text{cis}\\frac{\\pi}{6}$、$2\\,\\text{cis}\\frac{5\\pi}{6}$ 与 $2\\,\\text{cis}\\frac{3\\pi}{2}$。位于第二象限的是\n\n$$2\\left(\\cos\\frac{5\\pi}{6} + i\\sin\\frac{5\\pi}{6}\\right) = -\\sqrt{3} + i$$",
      ),
      generate(rng) {
        const [n, R, phi] = rng.pick(HIGHER_ROOT_CASES);
        const big = mod360(n * phi);
        const w = rectTex(rect(R ** n, big));
        const quadrant = Math.floor(phi / 90);
        const name = ROOT_NAMES[n]!;
        const answer = rectTex(rect(R, phi));
        const where = QUADRANTS[quadrant]!;
        const roots = Array.from(
          { length: n },
          (_, k) => `${modTex(R)}\\,\\text{cis}\\left(${radTex(mod360(phi + (360 * k) / n))}\\right)`,
        );
        return expressionProblem({
          prompt: t(
            `Find the one of the ${name.en} of $${w}$ that lies in ${where.en}. Write it in the form $a + bi$.`,
            `求 $${w}$ 的${name["zh-CN"]}中位于${where["zh-CN"]}的那一个，写成 $a + bi$ 的形式。`,
          ),
          answer,
          radical: true,
          wrong: defined([rectTexAt(R, phi + 180), rectTexAt(R, -phi), rectTexAt(R, 90 - phi), rectTexAt(R ** n, phi)]),
          solution: t(
            `In polar form $${w} = ${modTex(R ** n)}\\,\\text{cis}\\left(${radTex(big)}\\right)$. Its ${name.en} have modulus $${modTex(R)}$ and are $\\frac{2\\pi}{${n}}$ apart, among them${steps(roots.join(", \\quad "))}The one in ${where.en} is${steps(`${polarTex(modTex(R), radTex(phi))} = ${answer}`)}`,
            `化为三角形式：$${w} = ${modTex(R ** n)}\\,\\text{cis}\\left(${radTex(big)}\\right)$。它的${name["zh-CN"]}模长为 $${modTex(R)}$，辐角相差 $\\frac{2\\pi}{${n}}$，即${steps(roots.join(", \\quad "))}位于${where["zh-CN"]}的是${steps(`${polarTex(modTex(R), radTex(phi))} = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "classifying-the-roots-of-a-quadratic",
      title: t("Classify the roots of a quadratic", "判断二次方程根的类型"),
      explanation: t(
        "The **fundamental theorem of algebra** says that every polynomial of degree $n \\ge 1$ with complex coefficients has exactly $n$ complex roots, counted with multiplicity. A quadratic $ax^{2} + bx + c$ therefore always has two roots, and with real coefficients the discriminant $\\Delta = b^{2} - 4ac$ tells which kind:\n\n- $\\Delta > 0$: two distinct real roots;\n- $\\Delta = 0$: one real root of multiplicity $2$;\n- $\\Delta < 0$: two nonreal roots, which are complex conjugates.\n\nA real quadratic can never have exactly one nonreal root.",
        "**代数基本定理**指出：每个次数 $n \\ge 1$ 的复系数多项式按重数计恰有 $n$ 个复数根。因此二次式 $ax^{2} + bx + c$ 总有两个根；系数为实数时，判别式 $\\Delta = b^{2} - 4ac$ 决定根的类型：\n\n- $\\Delta > 0$：两个不相等的实根；\n- $\\Delta = 0$：一个二重实根；\n- $\\Delta < 0$：两个非实根，且互为共轭复数。\n\n实系数二次式不可能恰好有一个非实根。",
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
        return oneOf(
          rng,
          t(`Describe the roots of $${eq}$.`, `描述方程 $${eq}$ 的根。`),
          options[correct]!,
          options.filter((_, i) => i !== correct),
          t(
            `The discriminant is${steps(`b^{2} - 4ac = ${b * b} - ${4 * a * c < 0 ? `(${4 * a * c})` : 4 * a * c} = ${disc}`)}which is ${disc > 0 ? "positive" : disc === 0 ? "zero" : "negative"}. Counting multiplicity there are always two roots: ${options[correct]!.en.toLowerCase()}.`,
            `判别式为${steps(`b^{2} - 4ac = ${b * b} - ${4 * a * c < 0 ? `(${4 * a * c})` : 4 * a * c} = ${disc}`)}它${disc > 0 ? "大于零" : disc === 0 ? "等于零" : "小于零"}。按重数计总有两个根：${options[correct]!["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "factoring-quadratics-into-complex-linear-factors",
      title: t("Factor a quadratic into complex linear factors", "在复数范围内把二次式分解为一次因式"),
      explanation: t(
        "If $r_{1}$ and $r_{2}$ are the roots of $x^{2} + bx + c$, then $x^{2} + bx + c = (x - r_{1})(x - r_{2})$, even when the roots are not real. For $x^{2} - 4x + 13$ the roots are $2 \\pm 3i$, so\n\n$$x^{2} - 4x + 13 = \\left(x - (2 + 3i)\\right)\\left(x - (2 - 3i)\\right)$$\n\nCheck: the product is $(x - 2)^{2} - (3i)^{2} = x^{2} - 4x + 4 + 9$.",
        "若 $r_{1}$、$r_{2}$ 是 $x^{2} + bx + c$ 的根，则即使根不是实数，也有 $x^{2} + bx + c = (x - r_{1})(x - r_{2})$。对 $x^{2} - 4x + 13$，根为 $2 \\pm 3i$，所以\n\n$$x^{2} - 4x + 13 = \\left(x - (2 + 3i)\\right)\\left(x - (2 - 3i)\\right)$$\n\n验证：乘积为 $(x - 2)^{2} - (3i)^{2} = x^{2} - 4x + 4 + 9$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        let c = rng.int(1, 6);
        if (c === Math.abs(h)) c += 1;
        const p = polyX([1, -2 * h, h * h + c * c]);
        const f = (a: number, b: number) => `\\left(x - (${cx(a, b)})\\right)\\left(x - (${cx(a, -b)})\\right)`;
        const right = f(h, c);
        return oneOf(
          rng,
          t(`Factor $${p}$ into linear factors over the complex numbers.`, `在复数范围内把 $${p}$ 分解为一次因式之积。`),
          m$(right),
          [m$(f(-h, c)), m$(f(c, h)), m$(`\\left(x - (${cx(h, c)})\\right)^{2}`), m$(f(h, c * c))],
          t(
            `Complete the square to find the roots:${steps(`${p} = (${linear(1, -h)})^{2} + ${c * c} = 0 \\quad\\Rightarrow\\quad x = ${h} \\pm ${c === 1 ? "" : c}i`)}So $${p} = ${right}$.`,
            `配方求出两根：${steps(`${p} = (${linear(1, -h)})^{2} + ${c * c} = 0 \\quad\\Rightarrow\\quad x = ${h} \\pm ${c === 1 ? "" : c}i`)}所以 $${p} = ${right}$。`,
          ),
        );
      },
    },
    {
      id: "quadratics-from-a-complex-root",
      title: t("Build a real quadratic from a nonreal root", "由一个非实根构造实系数二次式"),
      explanation: t(
        "A real quadratic with the nonreal root $p + qi$ also has the root $p - qi$, and by the fundamental theorem of algebra these are its only roots. The monic quadratic is\n\n$$\\left(x - (p + qi)\\right)\\left(x - (p - qi)\\right) = x^{2} - 2px + (p^{2} + q^{2})$$\n\nFor the root $-1 + 4i$: $x^{2} + 2x + 17$.",
        "若实系数二次式有非实根 $p + qi$，则它也有根 $p - qi$，由代数基本定理，这就是它全部的根。首项系数为 $1$ 的二次式为\n\n$$\\left(x - (p + qi)\\right)\\left(x - (p - qi)\\right) = x^{2} - 2px + (p^{2} + q^{2})$$\n\n例如根为 $-1 + 4i$ 时：$x^{2} + 2x + 17$。",
      ),
      generate(rng) {
        const p = rng.nonZero(-7, 7);
        const q = rng.nonZero(-7, 7);
        const answer = polyX([1, -2 * p, p * p + q * q]);
        return expressionProblem({
          prompt: t(
            `Find the quadratic $p(x)$ with real coefficients and leading coefficient $1$ that has $${cx(p, q)}$ as a root.`,
            `求首项系数为 $1$ 的实系数二次多项式 $p(x)$，使 $${cx(p, q)}$ 是它的一个根。`,
          ),
          answer,
          simplified: true,
          prefix: "p(x) =",
          wrong: [polyX([1, 2 * p, p * p + q * q]), polyX([1, -2 * p, p * p - q * q]), polyX([1, -p, p * p + q * q])],
          solution: t(
            `The conjugate $${cx(p, -q)}$ is also a root. Their sum is $${2 * p}$ and their product is $${p * p} + ${q * q} = ${p * p + q * q}$:${steps(`p(x) = ${answer}`)}`,
            `共轭复数 $${cx(p, -q)}$ 也是根。两根之和为 $${2 * p}$，之积为 $${p * p} + ${q * q} = ${p * p + q * q}$：${steps(`p(x) = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "counting-the-roots-of-a-cubic",
      title: t("Count the real and nonreal roots of a cubic", "统计三次方程的实根与非实根"),
      explanation: t(
        "A cubic has exactly three complex roots counted with multiplicity. With real coefficients, nonreal roots come in conjugate pairs, so a real cubic has either\n\n- three real roots (some possibly repeated), or\n- one real root and two nonreal conjugate roots.\n\nFor $(x - 2)(x^{2} + 2x + 5)$, the quadratic factor has discriminant $4 - 20 < 0$, so there is one real root, $2$, and two nonreal roots, $-1 \\pm 2i$.",
        "三次式按重数计恰有三个复数根。系数为实数时，非实根成对共轭出现，所以实系数三次式要么\n\n- 有三个实根（可能有重根），要么\n- 有一个实根和两个互为共轭的非实根。\n\n对 $(x - 2)(x^{2} + 2x + 5)$，二次因式的判别式 $4 - 20 < 0$，所以有一个实根 $2$ 和两个非实根 $-1 \\pm 2i$。",
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
        return numberProblem({
          prompt: t(`How many ${what.en} does $${p} = 0$ have?`, `方程 $${p} = 0$ 有多少个${what["zh-CN"]}？`),
          answer,
          form: "integer",
          wrong: [3, 1, 2, 0],
          solution: t(
            `The factor $${linear(1, -r)}$ gives the real root $${r}$. The quadratic factor has discriminant $${q.b * q.b} - ${4 * q.c < 0 ? `(${4 * q.c})` : 4 * q.c} = ${disc}$, so it has ${disc < 0 ? "two nonreal conjugate roots" : disc === 0 ? "one repeated real root" : "two distinct real roots"}. Altogether the equation has $${reals}$ distinct real root${reals === 1 ? "" : "s"} and $${q.nonreal}$ nonreal roots, so the answer is $${answer}$.`,
            `因式 $${linear(1, -r)}$ 给出实根 $${r}$。二次因式的判别式为 $${q.b * q.b} - ${4 * q.c < 0 ? `(${4 * q.c})` : 4 * q.c} = ${disc}$，所以它${disc < 0 ? "有两个互为共轭的非实根" : disc === 0 ? "有一个二重实根" : "有两个不相等的实根"}。整个方程共有 $${reals}$ 个不同的实根和 $${q.nonreal}$ 个非实根，所以答案是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "the-real-root-from-a-nonreal-root",
      title: t("Find the real root from a nonreal root", "由一个非实根求实根"),
      explanation: t(
        "If a real cubic $x^{3} + bx^{2} + cx + d$ has the nonreal root $p + qi$, it also has $p - qi$, and the third root $r$ is real. By Vieta's formulas the three roots sum to $-b$:\n\n$$r + (p + qi) + (p - qi) = -b \\quad\\Rightarrow\\quad r = -b - 2p$$\n\nFor $x^{3} - 5x^{2} + 17x - 13$ with root $2 + 3i$: $r = 5 - 4 = 1$.",
        "若实系数三次式 $x^{3} + bx^{2} + cx + d$ 有非实根 $p + qi$，则它也有根 $p - qi$，第三个根 $r$ 为实数。由韦达定理，三根之和为 $-b$：\n\n$$r + (p + qi) + (p - qi) = -b \\quad\\Rightarrow\\quad r = -b - 2p$$\n\n例如，$x^{3} - 5x^{2} + 17x - 13$ 有根 $2 + 3i$，则 $r = 5 - 4 = 1$。",
      ),
      generate(rng) {
        const r = rng.nonZero(-6, 6);
        const h = rng.int(-4, 4);
        const c = rng.int(1, 5);
        const N = h * h + c * c;
        const coeffs = cubicFrom(r, -2 * h, N);
        const p = polyX(coeffs);
        const b = coeffs[1]!;
        return numberProblem({
          prompt: t(
            `The polynomial $${p}$ has the root $${cx(h, c)}$. Find its real root.`,
            `多项式 $${p}$ 有一个根 $${cx(h, c)}$。求它的实根。`,
          ),
          answer: r,
          form: "integer",
          wrong: [-b, -r, -b + 2 * h, b - 2 * h],
          solution: t(
            `The conjugate $${cx(h, -c)}$ is also a root. The three roots sum to $-(${b}) = ${-b}$:${steps(`r + ${2 * h < 0 ? `(${2 * h})` : 2 * h} = ${-b} \\quad\\Rightarrow\\quad r = ${r}`)}`,
            `共轭复数 $${cx(h, -c)}$ 也是根。三根之和为 $-(${b}) = ${-b}$：${steps(`r + ${2 * h < 0 ? `(${2 * h})` : 2 * h} = ${-b} \\quad\\Rightarrow\\quad r = ${r}`)}`,
          ),
        });
      },
    },
    {
      id: "building-a-real-cubic-from-its-roots",
      title: t("Build a real cubic from given roots", "由已知根构造实系数三次式"),
      explanation: t(
        "A monic cubic with real coefficients and the roots $r$ and $p + qi$ must also have $p - qi$, so\n\n$$p(x) = (x - r)\\left(x^{2} - 2px + p^{2} + q^{2}\\right)$$\n\nFor the roots $3$ and $1 - i$: $(x - 3)(x^{2} - 2x + 2) = x^{3} - 5x^{2} + 8x - 6$.",
        "首项系数为 $1$、有实根 $r$ 与非实根 $p + qi$ 的实系数三次式也必有根 $p - qi$，所以\n\n$$p(x) = (x - r)\\left(x^{2} - 2px + p^{2} + q^{2}\\right)$$\n\n例如根为 $3$ 与 $1 - i$ 时：$(x - 3)(x^{2} - 2x + 2) = x^{3} - 5x^{2} + 8x - 6$。",
      ),
      generate(rng) {
        const r = rng.nonZero(-5, 5);
        const h = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const N = h * h + c * c;
        const answer = polyX(cubicFrom(r, -2 * h, N));
        return expressionProblem({
          prompt: t(
            `Find the cubic $p(x)$ with real coefficients and leading coefficient $1$ whose roots include $${r}$ and $${cx(h, c)}$. Write it in expanded form.`,
            `求首项系数为 $1$ 的实系数三次多项式 $p(x)$，使 $${r}$ 与 $${cx(h, c)}$ 都是它的根，并写成展开式。`,
          ),
          answer,
          simplified: true,
          prefix: "p(x) =",
          wrong: [polyX(cubicFrom(-r, -2 * h, N)), polyX(cubicFrom(r, 2 * h, N)), polyX(cubicFrom(r, -2 * h, h * h - c * c))],
          solution: t(
            `The third root is the conjugate $${cx(h, -c)}$, whose pair gives the factor $${polyX([1, -2 * h, N])}$:${steps(`p(x) = (${linear(1, -r)})(${polyX([1, -2 * h, N])}) = ${answer}`)}`,
            `第三个根是共轭复数 $${cx(h, -c)}$，这一对根给出因式 $${polyX([1, -2 * h, N])}$：${steps(`p(x) = (${linear(1, -r)})(${polyX([1, -2 * h, N])}) = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "cubes-equal-to-a-constant",
      title: t("Solve $x^3 = \\pm k^3$", "解 $x^3 = \\pm k^3$"),
      explanation: t(
        "Factor a difference or sum of cubes and solve the quadratic factor:\n\n$$x^{3} - 8 = (x - 2)(x^{2} + 2x + 4) = 0$$\n\nThe linear factor gives $x = 2$; the quadratic gives\n\n$$x = \\frac{-2 \\pm \\sqrt{4 - 16}}{2} = \\frac{-2 \\pm 2i\\sqrt{3}}{2} = -1 \\pm i\\sqrt{3}$$\n\nSo $x^{3} = 8$ has three solutions, as the fundamental theorem of algebra requires: the three cube roots of $8$.",
        "分解立方差或立方和，再解其中的二次因式：\n\n$$x^{3} - 8 = (x - 2)(x^{2} + 2x + 4) = 0$$\n\n一次因式给出 $x = 2$；二次因式给出\n\n$$x = \\frac{-2 \\pm \\sqrt{4 - 16}}{2} = \\frac{-2 \\pm 2i\\sqrt{3}}{2} = -1 \\pm i\\sqrt{3}$$\n\n所以正如代数基本定理所要求的，$x^{3} = 8$ 有三个解，即 $8$ 的三个立方根。",
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
        return expressionProblem({
          prompt: t(
            `Solve $${eq}$ over the complex numbers. Enter the nonreal solution with a positive imaginary part.`,
            `在复数范围内解方程 $${eq}$。请输入虚部为正的那个非实数解。`,
          ),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [cxr(-s * j, j, 3), cxr(s * j, j, 1), cxr(s * k, k, 3), cxr(0, k, 1)],
          solution: t(
            `Rewrite as $x^{3} ${plus ? "+" : "-"} ${k ** 3} = 0$ and factor the ${plus ? "sum" : "difference"} of cubes:${steps(`(${lin})(${quad}) = 0`, `x = \\frac{${s * k} \\pm \\sqrt{${k * k} - ${4 * k * k}}}{2} = \\frac{${s * k} \\pm ${2 * j === 1 ? "" : 2 * j}i\\sqrt{3}}{2} = ${s * j} \\pm ${j === 1 ? "" : j}i\\sqrt{3}`)}The solutions are $${-s * k}$ and $${s * j} \\pm ${j === 1 ? "" : j}i\\sqrt{3}$.`,
            `化为 $x^{3} ${plus ? "+" : "-"} ${k ** 3} = 0$，分解立方${plus ? "和" : "差"}：${steps(`(${lin})(${quad}) = 0`, `x = \\frac{${s * k} \\pm \\sqrt{${k * k} - ${4 * k * k}}}{2} = \\frac{${s * k} \\pm ${2 * j === 1 ? "" : 2 * j}i\\sqrt{3}}{2} = ${s * j} \\pm ${j === 1 ? "" : j}i\\sqrt{3}`)}解为 $${-s * k}$ 和 $${s * j} \\pm ${j === 1 ? "" : j}i\\sqrt{3}$。`,
          ),
        });
      },
    },
    {
      id: "dividing-out-a-known-root",
      title: t("Divide out a known root", "除去已知根"),
      explanation: t(
        "If $x = r$ is a root, the factor theorem says $x - r$ is a factor. Divide (for example with synthetic division) to get a quadratic, then solve it with the quadratic formula. For $x^{3} - 4x^{2} + 9x - 10 = 0$ with root $x = 2$:\n\n$$x^{3} - 4x^{2} + 9x - 10 = (x - 2)(x^{2} - 2x + 5), \\qquad x = \\frac{2 \\pm \\sqrt{4 - 20}}{2} = 1 \\pm 2i$$",
        "若 $x = r$ 是根，由因式定理，$x - r$ 是因式。做除法（例如综合除法）得到二次式，再用求根公式求解。对 $x^{3} - 4x^{2} + 9x - 10 = 0$，已知根 $x = 2$：\n\n$$x^{3} - 4x^{2} + 9x - 10 = (x - 2)(x^{2} - 2x + 5), \\qquad x = \\frac{2 \\pm \\sqrt{4 - 20}}{2} = 1 \\pm 2i$$",
      ),
      keyPrerequisites: ["factoring-cubic-polynomials-using-the-factor-theorem"],
      generate(rng) {
        const r = rng.nonZero(-5, 5);
        const h = rng.int(-4, 4);
        const [c, m] = rng.pick(IMAG);
        const N = h * h + c * c * m;
        const eq = `${polyX(cubicFrom(r, -2 * h, N))} = 0`;
        const quad = polyX([1, -2 * h, N]);
        const answer = cxr(h, c, m);
        const disc = 4 * h * h - 4 * N;
        const [c2, m2] = simplifyRadical(-disc);
        return expressionProblem({
          prompt: t(
            `One solution of $${eq}$ is $x = ${r}$. Find the nonreal solution with a positive imaginary part.`,
            `方程 $${eq}$ 的一个解是 $x = ${r}$。求虚部为正的那个非实数解。`,
          ),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [cxr(-h, c, m), cxr(h, 2 * c, m), cxr(2 * h, c2, m2)],
          solution: t(
            `Divide by $${linear(1, -r)}$:${steps(`${polyX(cubicFrom(r, -2 * h, N))} = (${linear(1, -r)})(${quad})`, `x = \\frac{${2 * h} \\pm \\sqrt{${disc}}}{2} = \\frac{${2 * h} \\pm ${iTex(c2, m2)}}{2} = ${h} \\pm ${iTex(c, m)}`)}The solution with a positive imaginary part is $${answer}$.`,
            `除以 $${linear(1, -r)}$：${steps(`${polyX(cubicFrom(r, -2 * h, N))} = (${linear(1, -r)})(${quad})`, `x = \\frac{${2 * h} \\pm \\sqrt{${disc}}}{2} = \\frac{${2 * h} \\pm ${iTex(c2, m2)}}{2} = ${h} \\pm ${iTex(c, m)}`)}虚部为正的解是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "solving-cubics-by-grouping",
      title: t("Solve cubics by grouping", "用分组分解法解三次方程"),
      explanation: t(
        "Grouping works when the first two terms and the last two terms share the same binomial factor after taking out their common factors. When the coefficients come in proportional pairs, group them:\n\n$$x^{3} - 3x^{2} + 4x - 12 = x^{2}(x - 3) + 4(x - 3) = (x - 3)(x^{2} + 4)$$\n\nThen $x = 3$ or $x^{2} = -4$, that is $x = \\pm 2i$.",
        "当前两项和后两项各自提出公因式后剩下相同的二项式时，就可以用分组分解法。当系数成比例地两两成组时，分组分解：\n\n$$x^{3} - 3x^{2} + 4x - 12 = x^{2}(x - 3) + 4(x - 3) = (x - 3)(x^{2} + 4)$$\n\n于是 $x = 3$，或 $x^{2} = -4$，即 $x = \\pm 2i$。",
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
          solution: t(
            `Group the terms:${steps(`x^{2}(${linear(1, -r)}) + ${n}(${linear(1, -r)}) = (${linear(1, -r)})(x^{2} + ${n}) = 0`, `x = ${r} \\quad\\text{or}\\quad x^{2} = -${n} \\Rightarrow x = \\pm ${answer}`)}`,
            `分组：${steps(`x^{2}(${linear(1, -r)}) + ${n}(${linear(1, -r)}) = (${linear(1, -r)})(x^{2} + ${n}) = 0`, `x = ${r} \\quad\\text{或}\\quad x^{2} = -${n} \\Rightarrow x = \\pm ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "counting-the-roots-of-a-quartic",
      title: t("Count the real and nonreal roots of a quartic", "统计四次方程的实根与非实根"),
      explanation: t(
        "A quartic has exactly four complex roots counted with multiplicity. With real coefficients the nonreal roots pair up with their conjugates, so there are $0$, $2$ or $4$ nonreal roots, and $4$, $2$ or $0$ real roots counted with multiplicity. When the quartic is a product of two real quadratics, check each discriminant: $(x^{2} - 1)(x^{2} + 2x + 2)$ has the real roots $\\pm 1$ and the nonreal roots $-1 \\pm i$.",
        "四次式按重数计恰有四个复数根。系数为实数时，非实根与其共轭成对出现，所以非实根有 $0$、$2$ 或 $4$ 个，实根（按重数计）有 $4$、$2$ 或 $0$ 个。当四次式是两个实系数二次式之积时，分别检查判别式：$(x^{2} - 1)(x^{2} + 2x + 2)$ 有实根 $\\pm 1$ 和非实根 $-1 \\pm i$。",
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
        return numberProblem({
          prompt: t(`How many ${what.en} does $${p} = 0$ have?`, `方程 $${p} = 0$ 有多少个${what["zh-CN"]}？`),
          answer,
          form: "integer",
          wrong: [4, 2, 0, 3, 1],
          solution: t(
            `The discriminants of the factors are $${d(q1)}$ and $${d(q2)}$. A negative discriminant gives two nonreal roots, zero a repeated real root, positive two distinct real roots. Altogether there are $${nonreal}$ nonreal roots and $${reals}$ distinct real roots, so the answer is $${answer}$.`,
            `两个因式的判别式分别为 $${d(q1)}$ 与 $${d(q2)}$。判别式为负给出两个非实根，为零给出一个二重实根，为正给出两个不相等的实根。共有 $${nonreal}$ 个非实根和 $${reals}$ 个不同的实根，所以答案是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "the-remaining-roots-of-a-quartic",
      title: t("Find the remaining roots of a real quartic", "求实系数四次方程的其余根"),
      explanation: t(
        "If a real quartic has two nonreal roots that are not conjugates of each other, their conjugates are also roots, and these four are all of its roots. A real quartic with roots $1 + 2i$ and $-3i$ has the other roots $1 - 2i$ and $3i$.",
        "若实系数四次式有两个互不共轭的非实根，则它们的共轭也是根，这四个就是它的全部根。若实系数四次式有根 $1 + 2i$ 与 $-3i$，则其余两根为 $1 - 2i$ 与 $3i$。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const b = rng.nonZero(-5, 5);
        let c = rng.int(-5, 5);
        let d = rng.nonZero(-5, 5);
        if (c === a && Math.abs(d) === Math.abs(b)) {
          c = a === 5 ? -5 : a + 1;
          d = b;
        }
        const pair = (x: string, y: string) => t(`$${x}$ and $${y}$`, `$${x}$ 和 $${y}$`);
        return oneOf(
          rng,
          t(
            `A polynomial of degree $4$ with real coefficients has the roots $${cx(a, b)}$ and $${cx(c, d)}$. What are its other two roots?`,
            `一个次数为 $4$ 的实系数多项式有根 $${cx(a, b)}$ 和 $${cx(c, d)}$。它的另外两个根是什么？`,
          ),
          pair(cx(a, -b), cx(c, -d)),
          [pair(cx(-a, b), cx(-c, d)), pair(cx(-a, -b), cx(-c, -d)), pair(cx(b, a), cx(d, c)), pair(cx(a, -b), cx(-c, -d))],
          t(
            `Nonreal roots of a real polynomial come in conjugate pairs, so $${cx(a, -b)}$ and $${cx(c, -d)}$ are roots. These make four roots, all a quartic can have.`,
            `实系数多项式的非实根成对共轭出现，所以 $${cx(a, -b)}$ 与 $${cx(c, -d)}$ 也是根。这样共有四个根，正是四次多项式全部的根。`,
          ),
        );
      },
    },
    {
      id: "coefficients-of-a-quartic-from-its-roots",
      title: t("Find coefficients of a quartic from its roots", "由根求四次式的系数"),
      explanation: t(
        "Pair each nonreal root with its conjugate to get real quadratic factors, then multiply. A monic real quartic with the roots $2i$ and $1 + 3i$ is\n\n$$(x^{2} + 4)(x^{2} - 2x + 10) = x^{4} - 2x^{3} + 14x^{2} - 8x + 40$$\n\nIts constant term is the product of all four roots, $4 \\cdot 10 = 40$, and the coefficient of $x^{3}$ is minus their sum, $-2$.",
        "把每个非实根与其共轭配对，得到实系数二次因式，再相乘。有根 $2i$ 与 $1 + 3i$、首项系数为 $1$ 的实系数四次式为\n\n$$(x^{2} + 4)(x^{2} - 2x + 10) = x^{4} - 2x^{3} + 14x^{2} - 8x + 40$$\n\n常数项是四个根之积 $4 \\cdot 10 = 40$，$x^{3}$ 的系数是四根之和的相反数 $-2$。",
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
        return numberProblem({
          prompt: t(
            `A polynomial of degree $4$ with real coefficients and leading coefficient $1$ has the roots $${iTex(k, 1)}$ and $${cx(h, c)}$. Find its ${what.en}.`,
            `一个首项系数为 $1$、次数为 $4$ 的实系数多项式有根 $${iTex(k, 1)}$ 和 $${cx(h, c)}$。求它的${what["zh-CN"]}。`,
          ),
          answer,
          form: "integer",
          wrong,
          solution: t(
            `The conjugates $${iTex(-k, 1)}$ and $${cx(h, -c)}$ are also roots. Pairing them:${steps(`(${q1})(${q2}) = ${polyX(coeffs)}`)}The ${what.en} is $${answer}$.`,
            `共轭复数 $${iTex(-k, 1)}$ 与 $${cx(h, -c)}$ 也是根。配对相乘：${steps(`(${q1})(${q2}) = ${polyX(coeffs)}`)}所以${what["zh-CN"]}是 $${answer}$。`,
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
  knowledgePoints: [
    {
      id: "biquadratic-equations-with-complex-roots",
      title: t("Solve biquadratic equations with complex roots", "解有复数根的双二次方程"),
      explanation: t(
        "A quartic with only even powers is a quadratic in $u = x^{2}$. Factor it, then take square roots, which are imaginary when $x^{2}$ is negative:\n\n$$x^{4} + 5x^{2} - 36 = (x^{2} - 4)(x^{2} + 9) = 0 \\quad\\Rightarrow\\quad x = \\pm 2 \\ \\text{or}\\ x = \\pm 3i$$",
        "只含偶次幂的四次方程是关于 $u = x^{2}$ 的二次方程。先分解因式，再开平方；当 $x^{2}$ 为负数时，平方根是虚数：\n\n$$x^{4} + 5x^{2} - 36 = (x^{2} - 4)(x^{2} + 9) = 0 \\quad\\Rightarrow\\quad x = \\pm 2 \\ \\text{或}\\ x = \\pm 3i$$",
      ),
      keyPrerequisites: ["solving-biquadratic-equations"],
      generate(rng) {
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
            wrong: [String(a), iTex(a, 1), iTex(n, 1), poly([c, m === 1 ? "" : `\\sqrt{${m}}`])],
            solution: t(
              `Treat it as a quadratic in $x^{2}$ and factor:${steps(`(x^{2} - ${a * a})(x^{2} + ${n}) = 0`, `x = \\pm ${a} \\quad\\text{or}\\quad x = \\pm ${answer}`)}`,
              `把它看作关于 $x^{2}$ 的二次方程并分解：${steps(`(x^{2} - ${a * a})(x^{2} + ${n}) = 0`, `x = \\pm ${a} \\quad\\text{或}\\quad x = \\pm ${answer}`)}`,
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
          solution: t(
            `Treat it as a quadratic in $x^{2}$ and factor:${steps(`(x^{2} + ${p * p})(x^{2} + ${q * q}) = 0`, `x = \\pm ${iTex(p, 1)} \\quad\\text{or}\\quad x = \\pm ${iTex(q, 1)}`)}The greatest imaginary part belongs to $${answer}$.`,
            `把它看作关于 $x^{2}$ 的二次方程并分解：${steps(`(x^{2} + ${p * p})(x^{2} + ${q * q}) = 0`, `x = \\pm ${iTex(p, 1)} \\quad\\text{或}\\quad x = \\pm ${iTex(q, 1)}`)}虚部最大的是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "dividing-out-two-known-roots",
      title: t("Divide out two known roots", "除去两个已知根"),
      explanation: t(
        "If two real roots $r_{1}$ and $r_{2}$ are known, divide by $(x - r_{1})(x - r_{2})$, or divide twice by linear factors, to leave a quadratic. For $x^{4} - 2x^{3} + x^{2} + 2x - 2 = 0$ with roots $1$ and $-1$:\n\n$$x^{4} - 2x^{3} + x^{2} + 2x - 2 = (x^{2} - 1)(x^{2} - 2x + 2), \\qquad x = 1 \\pm i$$",
        "若已知两个实根 $r_{1}$ 与 $r_{2}$，就除以 $(x - r_{1})(x - r_{2})$（或依次除以两个一次因式），剩下一个二次式。对 $x^{4} - 2x^{3} + x^{2} + 2x - 2 = 0$，已知根 $1$ 与 $-1$：\n\n$$x^{4} - 2x^{3} + x^{2} + 2x - 2 = (x^{2} - 1)(x^{2} - 2x + 2), \\qquad x = 1 \\pm i$$",
      ),
      keyPrerequisites: ["factoring-quartic-polynomials-using-the-factor-theorem"],
      generate(rng) {
        const [r1, r2] = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4], 2) as [number, number];
        const h = rng.int(-3, 3);
        const c = rng.int(1, 4);
        const N = h * h + c * c;
        const rr = mulP([1, -r1], [1, -r2]);
        const quad = polyX([1, -2 * h, N]);
        const eq = `${polyX(mulP(rr, [1, -2 * h, N]))} = 0`;
        const answer = cx(h, c);
        return expressionProblem({
          prompt: t(
            `Two solutions of $${eq}$ are $x = ${r1}$ and $x = ${r2}$. Find the nonreal solution with a positive imaginary part.`,
            `方程 $${eq}$ 的两个解是 $x = ${r1}$ 与 $x = ${r2}$。求虚部为正的那个非实数解。`,
          ),
          answer,
          simplified: true,
          prefix: "x =",
          wrong: [cx(-h, c), cx(h, c * c), cx(2 * h, c)],
          solution: t(
            `Divide by $(${linear(1, -r1)})(${linear(1, -r2)}) = ${polyX(rr)}$:${steps(`(${polyX(rr)})(${quad}) = 0`, `x = \\frac{${2 * h} \\pm \\sqrt{${4 * h * h - 4 * N}}}{2} = ${h} \\pm ${iTex(c, 1)}`)}The solution with a positive imaginary part is $${answer}$.`,
            `除以 $(${linear(1, -r1)})(${linear(1, -r2)}) = ${polyX(rr)}$：${steps(`(${polyX(rr)})(${quad}) = 0`, `x = \\frac{${2 * h} \\pm \\sqrt{${4 * h * h - 4 * N}}}{2} = ${h} \\pm ${iTex(c, 1)}`)}虚部为正的解是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "fourth-powers-equal-to-a-constant",
      title: t("Solve x⁴ = ±k⁴", "解 x⁴ = ±k⁴"),
      explanation: t(
        "The four solutions of $x^{4} = w$ are the fourth roots of $w$, $90^{\\circ}$ apart. For $x^{4} = 16$ they are $\\pm 2$ and $\\pm 2i$, from $(x^{2} - 4)(x^{2} + 4) = 0$. For $x^{4} = -16 = 16\\,\\text{cis}\\,\\pi$ they have modulus $2$ and arguments $\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$, one in each quadrant:\n\n$$2\\,\\text{cis}\\frac{\\pi}{4} = \\sqrt{2} + i\\sqrt{2}, \\quad -\\sqrt{2} + i\\sqrt{2}, \\quad -\\sqrt{2} - i\\sqrt{2}, \\quad \\sqrt{2} - i\\sqrt{2}$$",
        "方程 $x^{4} = w$ 的四个解是 $w$ 的四次方根，彼此相差 $90^{\\circ}$。对 $x^{4} = 16$，由 $(x^{2} - 4)(x^{2} + 4) = 0$ 得 $\\pm 2$ 与 $\\pm 2i$。对 $x^{4} = -16 = 16\\,\\text{cis}\\,\\pi$，解的模长为 $2$，辐角为 $\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$，每个象限各一个：\n\n$$2\\,\\text{cis}\\frac{\\pi}{4} = \\sqrt{2} + i\\sqrt{2}, \\quad -\\sqrt{2} + i\\sqrt{2}, \\quad -\\sqrt{2} - i\\sqrt{2}, \\quad \\sqrt{2} - i\\sqrt{2}$$",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3]);
        const lead = a === 1 ? "" : String(a);
        const form = rng.bool();
        if (rng.bool(0.4)) {
          const k = rng.int(1, 9);
          const eq = form ? `${lead}x^{4} - ${a * k ** 4} = 0` : `${lead}x^{4} = ${a * k ** 4}`;
          const answer = iTex(k, 1);
          return expressionProblem({
            prompt: t(
              `Solve $${eq}$ over the complex numbers. Enter the solution with a positive imaginary part.`,
              `在复数范围内解方程 $${eq}$。请输入虚部为正的那个解。`,
            ),
            answer,
            radical: true,
            prefix: "x =",
            wrong: [String(k), iTex(k * k, 1), iTex(-k, 1)],
            solution: t(
              `Write it as $x^{4} - ${k ** 4} = 0$ and factor twice:${steps(`(x^{2} - ${k * k})(x^{2} + ${k * k}) = 0`, `x = \\pm ${k} \\quad\\text{or}\\quad x = \\pm ${answer}`)}`,
              `化为 $x^{4} - ${k ** 4} = 0$，分解两次：${steps(`(x^{2} - ${k * k})(x^{2} + ${k * k}) = 0`, `x = \\pm ${k} \\quad\\text{或}\\quad x = \\pm ${answer}`)}`,
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
        return expressionProblem({
          prompt: t(
            `Solve $${eq}$ over the complex numbers. Enter the solution in ${where.en}.`,
            `在复数范围内解方程 $${eq}$。请输入位于${where["zh-CN"]}的那个解。`,
          ),
          answer,
          radical: true,
          prefix: "x =",
          wrong: defined([rectTexAt(R, phi + 180), rectTexAt(R, -phi), cx(rect(R, phi).re[0], rect(R, phi).im[0]), rectTexAt(R * R, phi)]),
          solution: t(
            `Write it as $x^{4} = -${k ** 4} = ${k ** 4}\\,\\text{cis}\\,\\pi$. The fourth roots have modulus $${k}$ and arguments $\\frac{\\pi}{4} + \\frac{\\pi}{2}m$; the one in ${where.en} is${steps(`${polarTex(String(k), radTex(phi))} = ${answer}`)}`,
            `化为 $x^{4} = -${k ** 4} = ${k ** 4}\\,\\text{cis}\\,\\pi$。四次方根的模长为 $${k}$，辐角为 $\\frac{\\pi}{4} + \\frac{\\pi}{2}m$；位于${where["zh-CN"]}的是${steps(`${polarTex(String(k), radTex(phi))} = ${answer}`)}`,
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
