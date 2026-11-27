import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { numberProblem, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { gcd, mod, modInverse, texChoice } from "./abstract-algebra-common.ts";
import { apart, because, type Decision, decide } from "./abstract-algebra-quotients.ts";
import { polyTex } from "./abstract-algebra-rings.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 8, part 2: polynomial rings, irreducibility, quaternions; and vector spaces over finite fields.

/** Poly is a polynomial as its coefficients, constant term first, with no trailing zeros. */
type Poly = number[];

/** zTex writes ℤₙ. */
const zTex = (n: number) => `\\mathbb{Z}_{${n}}`;

/** xPow writes xᵏ, or x when k = 1. */
const xPow = (k: number) => (k === 1 ? "x" : `x^{${k}}`);

/** pow writes bᵏ, or b when k = 1 and 1 when k = 0. */
const pow = (b: number, k: number) => (k === 0 ? "1" : k === 1 ? `${b}` : `${b}^{${k}}`);

/** paren wraps a negative number in parentheses. */
const paren = (a: number) => (a < 0 ? `(${a})` : `${a}`);

/** trim drops trailing zero coefficients. */
function trim(f: Poly): Poly {
  const g = [...f];
  while (g.length > 0 && g[g.length - 1] === 0) g.pop();
  return g;
}

/** deg is the degree of f, or −1 for the zero polynomial. */
const deg = (f: Poly) => trim(f).length - 1;

/** pAdd adds polynomials modulo n. */
const pAdd = (f: Poly, g: Poly, n: number): Poly =>
  trim(range(0, Math.max(f.length, g.length) - 1).map((i) => mod((f[i] ?? 0) + (g[i] ?? 0), n)));

/** pSub subtracts polynomials modulo n. */
const pSub = (f: Poly, g: Poly, n: number): Poly =>
  trim(range(0, Math.max(f.length, g.length) - 1).map((i) => mod((f[i] ?? 0) - (g[i] ?? 0), n)));

/** pMul multiplies polynomials modulo n. */
function pMul(f: Poly, g: Poly, n: number): Poly {
  if (f.length === 0 || g.length === 0) return [];
  const out = new Array<number>(f.length + g.length - 1).fill(0);
  f.forEach((a, i) => {
    g.forEach((b, j) => {
      out[i + j] = mod(out[i + j]! + a * b, n);
    });
  });
  return trim(out);
}

/** pDivMod divides f by g over ℤₚ, returning the quotient and remainder. */
function pDivMod(f: Poly, g: Poly, p: number): [Poly, Poly] {
  let r = trim(f.map((c) => mod(c, p)));
  const dg = deg(g);
  const lead = modInverse(g[dg]!, p);
  const q = new Array<number>(Math.max(0, deg(r) - dg + 1)).fill(0);
  while (deg(r) >= dg) {
    const shift = deg(r) - dg;
    const c = mod(r[deg(r)]! * lead, p);
    q[shift] = c;
    r = pSub(r, [...new Array<number>(shift).fill(0), ...g.map((x) => mod(x * c, p))], p);
  }
  return [trim(q), r];
}

/** monic scales f over ℤₚ to leading coefficient 1. */
function monic(f: Poly, p: number): Poly {
  const inv = modInverse(f[deg(f)]!, p);
  return f.map((c) => mod(c * inv, p));
}

/** pGcd is the monic greatest common divisor over ℤₚ. */
function pGcd(f: Poly, g: Poly, p: number): Poly {
  let [a, b] = [trim(f), trim(g)];
  while (b.length > 0) [a, b] = [b, pDivMod(a, b, p)[1]];
  return monic(a, p);
}

/** euclidTrail describes the remainders of the Euclidean algorithm on f and g over ℤₚ, as a clause of a sentence. */
function euclidTrail(f: Poly, g: Poly, p: number): Text {
  let [a, b] = f.length >= g.length ? [trim(f), trim(g)] : [trim(g), trim(f)];
  const remainders: string[] = [];
  while (b.length > 0) {
    const r = pDivMod(a, b, p)[1];
    if (r.length > 0) remainders.push(polyTex(r));
    [a, b] = [b, r];
  }
  if (remainders.length === 0) return t("the first division leaves no remainder", "第一次相除就没有余式");
  const list = remainders.map((r) => `$${r}$`);
  return t(`the successive nonzero remainders are ${list.join(", ")}`, `依次的非零余式是 ${list.join("、")}`);
}

/** hasRootMod reports whether f has a root in ℤₚ. */
const hasRootMod = (f: Poly, p: number) => range(0, p - 1).some((x) => mod(evalPoly(f, x), p) === 0);

/** evalPoly evaluates f at x over the integers. */
const evalPoly = (f: Poly, x: number) => f.reduce((s, c, i) => s + c * x ** i, 0);

/** monicPolys lists the monic polynomials of degree d over ℤₚ. */
function monicPolys(d: number, p: number): Poly[] {
  const out: Poly[] = [];
  const total = p ** d;
  for (let k = 0; k < total; k++) {
    const cs = range(0, d - 1).map((i) => Math.floor(k / p ** i) % p);
    out.push([...cs, 1]);
  }
  return out;
}

/** irreducibleMod reports whether f, of degree 2 to 5, is irreducible over ℤₚ. */
function irreducibleMod(f: Poly, p: number): boolean {
  const d = deg(f);
  if (hasRootMod(f, p)) return false;
  if (d <= 3) return true;
  return monicPolys(2, p).every((g) => pDivMod(f, g, p)[1].length > 0);
}

/** randomPoly is a random polynomial of degree d over ℤₚ, monic when asked. */
function randomPoly(rng: Rng, d: number, p: number, isMonic = true): Poly {
  return [...range(0, d - 1).map(() => rng.int(0, p - 1)), isMonic ? 1 : rng.int(1, p - 1)];
}

/** ringsOfPolynomials multiplies polynomials over ℤₙ and finds degrees of products. */
export const ringsOfPolynomials: TopicDef = {
  id: "rings-of-polynomials",
  title: t("Rings of Polynomials", "多项式环"),
  summary: t(
    "For a commutative ring R, R[x] is the ring of polynomials a₀ + a₁x + ⋯ + aₙxⁿ with coefficients in R, added and multiplied as usual with coefficient arithmetic done in R. If R is an integral domain then so is R[x], and deg(fg) = deg f + deg g. Over a ring with zero divisors, such as ℤ₆, the degree of a product can drop.",
    "对交换环 R，R[x] 是系数在 R 中的多项式 a₀ + a₁x + ⋯ + aₙxⁿ 构成的环，按通常方式相加相乘，系数运算在 R 中进行。若 R 是整环，则 R[x] 也是，且 deg(fg) = deg f + deg g。在有零因子的环（如 ℤ₆）上，乘积的次数可能下降。",
  ),
  intro: t(
    "In $\\mathbb{Z}_4[x]$, $(2x + 1)(2x + 3) = 4x^2 + 8x + 3 = 3$: both polynomials have degree $1$, yet their product is a constant.\n\nCheck: $4 \\equiv 0$ and $8 \\equiv 0 \\pmod{4}$, so only the constant term $3$ survives.\n\nIn this lesson we multiply polynomials over $\\mathbb{Z}_n$ and find the degrees of products.",
    "在 $\\mathbb{Z}_4[x]$ 中，$(2x + 1)(2x + 3) = 4x^2 + 8x + 3 = 3$：两个多项式都是一次的，乘积却是常数。\n\n检验：$4 \\equiv 0$，$8 \\equiv 0 \\pmod{4}$，所以只剩常数项 $3$。\n\n本课我们在 $\\mathbb{Z}_n$ 上做多项式乘法，并求乘积的次数。",
  ),
  prerequisites: ["polynomial-quotient-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "multiplying-polynomials-over-zn",
      title: t("Multiplying over $\\mathbb{Z}_n$", "在 $\\mathbb{Z}_n$ 上相乘"),
      explanation: t(
        "Multiply the polynomials as usual and reduce every coefficient modulo the number at the end. In $\\mathbb{Z}_5[x]$, $(3x + 4)(2x^2 + x + 3) = 6x^3 + 11x^2 + 13x + 12 = x^3 + x^2 + 3x + 2$.\n\nIn $\\mathbb{Z}_6[x]$, the coefficient of $x$ in $(4x + 5)(3x + 2)$ collects the two products that give $x$: $(4)(2) + (5)(3) = 23 \\equiv 5$.\n\nCheck: $23 - 5 = 18$ is a multiple of $6$.\n\n> **Watch out.** Add every product $a_j b_{i - j}$ that lands on $x^i$, not only the product of the two coefficients of $x^i$: above, $(4)(3) = 12$ belongs to $x^2$.",
        "照常把多项式相乘，最后把每个系数模这个数约化。在 $\\mathbb{Z}_5[x]$ 中，$(3x + 4)(2x^2 + x + 3) = 6x^3 + 11x^2 + 13x + 12 = x^3 + x^2 + 3x + 2$。\n\n在 $\\mathbb{Z}_6[x]$ 中，$(4x + 5)(3x + 2)$ 中 $x$ 的系数是得到 $x$ 的两个乘积之和：$(4)(2) + (5)(3) = 23 \\equiv 5$。\n\n检验：$23 - 5 = 18$ 是 $6$ 的倍数。\n\n> **注意。** 要把落在 $x^i$ 上的每个乘积 $a_j b_{i - j}$ 都加起来，而不只是两个 $x^i$ 系数之积：上例中 $(4)(3) = 12$ 属于 $x^2$。",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const f = randomPoly(rng, rng.int(1, 2), n, false);
        const g = randomPoly(rng, 2, n, false);
        const prod = pMul(f, g, n);
        const i = rng.int(1, Math.max(1, deg(f) + deg(g) - 1));
        const value = prod[i] ?? 0;
        const raw = range(0, i).reduce((s, j) => s + (f[j] ?? 0) * (g[i - j] ?? 0), 0);
        const terms = range(0, i)
          .filter((j) => (f[j] ?? 0) !== 0 && (g[i - j] ?? 0) !== 0)
          .map((j) => `(${f[j]})(${g[i - j]})`);
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}[x]$, find the coefficient of $${xPow(i)}$ in $(${polyTex(f)})(${polyTex(g)})$, as an element of $\\{0, 1, \\dots, ${n - 1}\\}$.`,
            `在 $${zTex(n)}[x]$ 中，求 $(${polyTex(f)})(${polyTex(g)})$ 中 $${xPow(i)}$ 的系数，用 $\\{0, 1, \\dots, ${n - 1}\\}$ 中的元素表示。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(raw, `$${raw}$ is the coefficient before reducing modulo $${n}$.`, `$${raw}$ 是模 $${n}$ 约化之前的系数。`),
            why(
              mod((f[i] ?? 0) * (g[i] ?? 0), n),
              `That multiplies only the two coefficients of $${xPow(i)}$; the coefficient of $${xPow(i)}$ in the product adds every $a_j b_{${i} - j}$.`,
              `这只把两个 $${xPow(i)}$ 的系数相乘；乘积中 $${xPow(i)}$ 的系数要把每个 $a_j b_{${i} - j}$ 加起来。`,
            ),
            why(mod(raw + 1, n), `The products add up to $${raw}$, not $${raw + 1}$.`, `这些乘积之和是 $${raw}$，不是 $${raw + 1}$。`),
          ]),
          solution: walked(
            [
              [
                ["Collect the products", "收集乘积"],
                terms.length === 0
                  ? t(
                      `Every product $a_j b_{${i} - j}$ that lands on $${xPow(i)}$ is $0$.`,
                      `落在 $${xPow(i)}$ 上的每个乘积 $a_j b_{${i} - j}$ 都是 $0$。`,
                    )
                  : t(
                      `The products that land on $${xPow(i)}$ add up to $${terms.join(" + ")} = ${raw}$.`,
                      `落在 $${xPow(i)}$ 上的乘积之和为 $${terms.join(" + ")} = ${raw}$。`,
                    ),
              ],
              [["Reduce", "约化"], t(`$${raw} \\equiv ${value} \\pmod{${n}}$.`, `$${raw} \\equiv ${value} \\pmod{${n}}$。`)],
            ],
            raw === value
              ? t(`$${value}$ already lies in $\\{0, 1, \\dots, ${n - 1}\\}$.`, `$${value}$ 已经在 $\\{0, 1, \\dots, ${n - 1}\\}$ 中。`)
              : t(
                  `$${raw} - ${value} = ${raw - value}$ is a multiple of $${n}$.`,
                  `$${raw} - ${value} = ${raw - value}$ 是 $${n}$ 的倍数。`,
                ),
          ),
        });
      },
    },
    {
      id: "degrees-of-products-over-zn",
      title: t("Degrees of products", "乘积的次数"),
      explanation: t(
        "When the modulus is not prime, the leading coefficients can multiply to zero, so the degree of a product may drop. In $\\mathbb{Z}_6[x]$, $(2x^2 + 1)(3x + 1) = 6x^3 + 2x^2 + 3x + 1 = 2x^2 + 3x + 1$, which has degree $2$, not $3$: the leading coefficients $2$ and $3$ are zero divisors.\n\nIn $\\mathbb{Z}_8[x]$, $(4x^2 + 1)(2x + 3) = 8x^3 + 12x^2 + 2x + 3 = 4x^2 + 2x + 3$, of degree $2$.\n\nCheck: $(4)(2) = 8 \\equiv 0$ removes $x^3$, while $12 \\equiv 4 \\pmod{8}$ keeps $x^2$.\n\n> **Watch out.** $\\deg(fg) = \\deg f + \\deg g$ needs coefficients in an integral domain; over $\\mathbb{Z}_n$ with $n$ not prime, first check whether the leading coefficients multiply to $0$.",
        "当模不是素数时，首项系数相乘可能为零，所以乘积的次数可能会降低。在 $\\mathbb{Z}_6[x]$ 中，$(2x^2 + 1)(3x + 1) = 6x^3 + 2x^2 + 3x + 1 = 2x^2 + 3x + 1$，次数为 $2$ 而非 $3$：首项系数 $2$ 与 $3$ 是零因子。\n\n在 $\\mathbb{Z}_8[x]$ 中，$(4x^2 + 1)(2x + 3) = 8x^3 + 12x^2 + 2x + 3 = 4x^2 + 2x + 3$，次数为 $2$。\n\n检验：$(4)(2) = 8 \\equiv 0$ 消去了 $x^3$，而 $12 \\equiv 4 \\pmod{8}$ 保留了 $x^2$。\n\n> **注意。** $\\deg(fg) = \\deg f + \\deg g$ 要求系数在整环中；在 $n$ 不是素数的 $\\mathbb{Z}_n$ 上，先检查首项系数之积是否为 $0$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 6, 8, 9, 10, 12, 15, 18]);
        const zd = range(2, n - 1).filter((a) => gcd(a, n) > 1);
        let f: Poly;
        let g: Poly;
        do {
          const a = rng.pick(zd);
          const b = rng.bool(0.75) ? rng.pick(zd.filter((x) => mod(a * x, n) === 0)) : rng.int(1, n - 1);
          f = [...range(0, rng.int(1, 2) - 1).map(() => rng.int(0, n - 1)), rng.int(1, n - 1), a];
          g = [...range(0, rng.int(0, 1)).map(() => rng.int(0, n - 1)), rng.int(1, n - 1), b];
        } while (deg(pMul(f, g, n)) < 0);
        const prod = pMul(f, g, n);
        const value = deg(prod);
        const la = f[deg(f)]!;
        const lb = g[deg(g)]!;
        const top = deg(f) + deg(g);
        const dropped = value < top;
        const lead = polyTex(prod.map((c, j) => (j === value ? c : 0)));
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}[x]$, what is the degree of $(${polyTex(f)})(${polyTex(g)})$?`,
            `在 $${zTex(n)}[x]$ 中，$(${polyTex(f)})(${polyTex(g)})$ 的次数是多少？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              top,
              `That adds the degrees, but the leading coefficients give $(${la})(${lb}) = ${la * lb} \\equiv 0 \\pmod{${n}}$, so the top term vanishes.`,
              `这是把次数相加，但首项系数给出 $(${la})(${lb}) = ${la * lb} \\equiv 0 \\pmod{${n}}$，最高次项消失了。`,
            ),
            why(deg(f) * deg(g), "Degrees add under multiplication; they do not multiply.", "相乘时次数相加，而不是相乘。"),
            why(
              Math.max(deg(f), deg(g)),
              `That is the larger degree; find the highest power whose coefficient in the product is not $0$ modulo $${n}$.`,
              `这是较大的那个次数；要找乘积中系数模 $${n}$ 不为 $0$ 的最高次幂。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply the leading coefficients", "首项系数相乘"],
                dropped
                  ? t(
                      `$(${la})(${lb}) = ${la * lb} \\equiv 0 \\pmod{${n}}$, so the $${xPow(top)}$ term vanishes and the degree drops.`,
                      `$(${la})(${lb}) = ${la * lb} \\equiv 0 \\pmod{${n}}$，所以 $${xPow(top)}$ 项消失，次数下降。`,
                    )
                  : t(
                      `$(${la})(${lb}) = ${la * lb} \\equiv ${mod(la * lb, n)} \\pmod{${n}}$, which is not $0$, so the degree is $${deg(f)} + ${deg(g)} = ${top}$.`,
                      `$(${la})(${lb}) = ${la * lb} \\equiv ${mod(la * lb, n)} \\pmod{${n}}$，不为 $0$，所以次数为 $${deg(f)} + ${deg(g)} = ${top}$。`,
                    ),
              ],
              [
                ["Reduce the product", "约化乘积"],
                t(
                  `Multiplying out and reducing modulo $${n}$ gives $${polyTex(prod)}$, of degree $${value}$.`,
                  `展开并模 $${n}$ 约化得 $${polyTex(prod)}$，次数为 $${value}$。`,
                ),
              ],
            ],
            t(
              `The leading term of $${polyTex(prod)}$ is $${lead}$, whose coefficient is not $0$ modulo $${n}$.`,
              `$${polyTex(prod)}$ 的首项是 $${lead}$，其系数模 $${n}$ 不为 $0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** unitsInPolynomialRings recognizes units of R[x] and inverts unit polynomials over ℤ_{p²}. */
export const unitsInPolynomialRings: TopicDef = {
  id: "units-in-polynomial-rings",
  title: t("Units in Polynomial Rings", "多项式环中的单位"),
  summary: t(
    "If D is an integral domain, the units of D[x] are exactly the units of D, as constant polynomials: degrees add, so a unit must have degree 0. Over a ring with nilpotent elements there are more: in ℤ₄[x], (1 + 2x)² = 1, so 1 + 2x is a unit. In general, f is a unit of R[x] exactly when its constant term is a unit and its other coefficients are nilpotent.",
    "若 D 是整环，则 D[x] 的单位恰为 D 的单位（作为常数多项式）：次数相加，所以单位的次数必为 0。在有幂零元的环上会有更多单位：在 ℤ₄[x] 中 (1 + 2x)² = 1，所以 1 + 2x 是单位。一般地，f 是 R[x] 的单位当且仅当其常数项是单位且其余系数都是幂零元。",
  ),
  intro: t(
    "In $\\mathbb{Z}_4[x]$, $(2x + 1)(2x + 1) = 4x^2 + 4x + 1 = 1$, so $2x + 1$ is a unit, its own inverse, although it has degree $1$.\n\nCheck: $4 \\equiv 0 \\pmod{4}$, so both $4x^2$ and $4x$ vanish.\n\nIn this lesson we recognize the units of polynomial rings and invert unit polynomials over $\\mathbb{Z}_{p^2}$.",
    "在 $\\mathbb{Z}_4[x]$ 中，$(2x + 1)(2x + 1) = 4x^2 + 4x + 1 = 1$，所以 $2x + 1$ 虽是一次多项式，却是单位，而且是自己的逆。\n\n检验：$4 \\equiv 0 \\pmod{4}$，所以 $4x^2$ 与 $4x$ 都消失。\n\n本课我们识别多项式环的单位，并求 $\\mathbb{Z}_{p^2}$ 上单位多项式的逆。",
  ),
  prerequisites: ["rings-of-polynomials", "the-units-of-a-ring"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-units-in-polynomial-rings",
      title: t("Recognizing units", "识别单位"),
      explanation: t(
        "In $\\mathbb{Z}_7[x]$, the units are the nonzero constants, so $3$ is a unit but $1 + x$ is not. In $\\mathbb{Z}_9[x]$, $1 + 3x$ is a unit: $(1 + 3x)(1 - 3x) = 1 - 9x^2 = 1$.\n\nIn $\\mathbb{Z}_{25}[x]$, $2 + 10x$ is a unit, since $2$ is a unit and $10^2 = 100 \\equiv 0$; but $5 + x$ is not, since its constant term $5$ is not a unit.\n\nCheck: $100 = 4 \\cdot 25$, and $\\gcd(5, 25) = 5 \\ne 1$.\n\n> **Watch out.** Over a field such as $\\mathbb{Z}_7$ no nonconstant polynomial is a unit; nilpotent coefficients exist only when the modulus has a repeated prime factor.",
        "在 $\\mathbb{Z}_7[x]$ 中，单位是非零常数，所以 $3$ 是单位而 $1 + x$ 不是。在 $\\mathbb{Z}_9[x]$ 中，$1 + 3x$ 是单位：$(1 + 3x)(1 - 3x) = 1 - 9x^2 = 1$。\n\n在 $\\mathbb{Z}_{25}[x]$ 中，$2 + 10x$ 是单位，因为 $2$ 是单位且 $10^2 = 100 \\equiv 0$；但 $5 + x$ 不是，因为它的常数项 $5$ 不是单位。\n\n检验：$100 = 4 \\cdot 25$，且 $\\gcd(5, 25) = 5 \\ne 1$。\n\n> **注意。** 在 $\\mathbb{Z}_7$ 这样的域上，非常数多项式都不是单位；只有当模含重复的素因子时，才有幂零的系数。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const q = rng.pick([3, 5, 7, 11, 13].filter((x) => x !== p));
        const n = p * p;
        const u = rng.pick(range(1, n - 1).filter((x) => x % p !== 0));
        const a = p * rng.int(1, p - 1);
        const b = rng.pick(range(1, n - 1).filter((x) => x % p !== 0));
        const c = rng.int(1, q - 1);
        const ui = modInverse(u, n);
        const ci = modInverse(c, q);
        const unitConstant = t(
          `$${u}$ is a unit of $${zTex(n)}$, since $${p} \\nmid ${u}$.`,
          `$${u}$ 是 $${zTex(n)}$ 的单位，因为 $${p} \\nmid ${u}$。`,
        );
        const decisions: Decision[] = [
          {
            prompt: t(`Is $${polyTex([u, a])}$ a unit of $${zTex(n)}[x]$?`, `$${polyTex([u, a])}$ 是 $${zTex(n)}[x]$ 的单位吗？`),
            holds: true,
            steps: [
              [["Check the constant term", "检查常数项"], unitConstant],
              [
                ["Check the coefficient of the variable", "检查一次项系数"],
                t(
                  `$${a}^2 = ${a * a} \\equiv 0 \\pmod{${n}}$, so $${a}$ is nilpotent, and the polynomial is a unit.`,
                  `$${a}^2 = ${a * a} \\equiv 0 \\pmod{${n}}$，所以 $${a}$ 是幂零元，该多项式是单位。`,
                ),
              ],
            ],
            check: t(
              `$(${polyTex([u, a])})(${polyTex([ui, mod(-ui * ui * a, n)])}) \\equiv 1 \\pmod{${n}}$.`,
              `$(${polyTex([u, a])})(${polyTex([ui, mod(-ui * ui * a, n)])}) \\equiv 1 \\pmod{${n}}$。`,
            ),
            wrong: t(
              "A polynomial of degree $1$ can still be a unit when its constant term is a unit and its coefficient of $x$ is nilpotent.",
              "常数项是单位、$x$ 的系数是幂零元时，一次多项式仍可以是单位。",
            ),
          },
          {
            prompt: t(`Is $${polyTex([u, b])}$ a unit of $${zTex(n)}[x]$?`, `$${polyTex([u, b])}$ 是 $${zTex(n)}[x]$ 的单位吗？`),
            holds: false,
            steps: [
              [["Check the constant term", "检查常数项"], unitConstant],
              [
                ["Check the coefficient of the variable", "检查一次项系数"],
                t(
                  `The coefficient $${b}$ of $x$ is not nilpotent modulo $${n}$, since $${p} \\nmid ${b}$, so no power of it is divisible by $${n}$.`,
                  `$x$ 的系数 $${b}$ 模 $${n}$ 不是幂零元，因为 $${p} \\nmid ${b}$，它的任何幂都不被 $${n}$ 整除。`,
                ),
              ],
            ],
            check: t(
              `$${b}^2 = ${b * b} \\equiv ${mod(b * b, n)} \\pmod{${n}}$, not $0$.`,
              `$${b}^2 = ${b * b} \\equiv ${mod(b * b, n)} \\pmod{${n}}$，不为 $0$。`,
            ),
            wrong: t(
              "A unit constant term is not enough: the coefficient of $x$ must also be nilpotent.",
              "常数项是单位还不够：$x$ 的系数也必须是幂零元。",
            ),
          },
          {
            prompt: t(`Is $${polyTex([a, u])}$ a unit of $${zTex(n)}[x]$?`, `$${polyTex([a, u])}$ 是 $${zTex(n)}[x]$ 的单位吗？`),
            holds: false,
            steps: [
              [
                ["Check the constant term", "检查常数项"],
                t(`Its constant term $${a}$ is not a unit modulo $${n}$.`, `它的常数项 $${a}$ 模 $${n}$ 不是单位。`),
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  "The constant term of a product is the product of the constant terms, so a unit of the polynomial ring must have a unit constant term.",
                  "乘积的常数项是各常数项之积，所以多项式环的单位的常数项必须是单位。",
                ),
              ],
            ],
            check: t(`$\\gcd(${a}, ${n}) = ${p}$, not $1$.`, `$\\gcd(${a}, ${n}) = ${p}$，不是 $1$。`),
            wrong: t(
              "The coefficient of $x$ being a unit does not help; the constant term must be a unit.",
              "$x$ 的系数是单位并没有用；必须是常数项为单位。",
            ),
          },
          {
            prompt: t(`Is $${polyTex([c, c])}$ a unit of $${zTex(q)}[x]$?`, `$${polyTex([c, c])}$ 是 $${zTex(q)}[x]$ 的单位吗？`),
            holds: false,
            steps: [
              [
                ["Note the coefficient ring", "看系数环"],
                t(`$${zTex(q)}$ is a field, so it is an integral domain.`, `$${zTex(q)}$ 是域，因而是整环。`),
              ],
              [
                ["Compare degrees", "比较次数"],
                t(
                  "Degrees add over an integral domain, so any product with this polynomial has degree at least $1$ and is never $1$.",
                  "在整环上次数相加，所以它与任何多项式的乘积次数至少为 $1$，不可能等于 $1$。",
                ),
              ],
            ],
            check: t(
              `For every nonzero $g$, $\\deg((${polyTex([c, c])})g) = 1 + \\deg g \\ge 1$.`,
              `对每个非零 $g$，$\\deg((${polyTex([c, c])})g) = 1 + \\deg g \\ge 1$。`,
            ),
            wrong: t(
              "Over a field the only nilpotent coefficient is $0$, so a polynomial of degree $1$ is never a unit.",
              "在域上唯一的幂零系数是 $0$，所以一次多项式不可能是单位。",
            ),
          },
          {
            prompt: t(`Is $${c}$ a unit of $${zTex(q)}[x]$?`, `$${c}$ 是 $${zTex(q)}[x]$ 的单位吗？`),
            holds: true,
            steps: [
              [
                ["Find an inverse", "找逆元"],
                t(`$(${c})(${ci}) = ${c * ci} \\equiv 1 \\pmod{${q}}$.`, `$(${c})(${ci}) = ${c * ci} \\equiv 1 \\pmod{${q}}$。`),
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  `The constant polynomial $${ci}$ is its inverse in $${zTex(q)}[x]$, so $${c}$ is a unit.`,
                  `常数多项式 $${ci}$ 是它在 $${zTex(q)}[x]$ 中的逆，所以 $${c}$ 是单位。`,
                ),
              ],
            ],
            check: t(`$${c * ci} - 1 = ${c * ci - 1}$ is a multiple of $${q}$.`, `$${c * ci} - 1 = ${c * ci - 1}$ 是 $${q}$ 的倍数。`),
            wrong: t(
              "A nonzero constant of a field has an inverse, so it is a unit of the polynomial ring too.",
              "域中的非零常数有逆元，所以它也是多项式环的单位。",
            ),
          },
        ];
        return decide(rng.pick(decisions));
      },
    },
    {
      id: "inverting-unit-polynomials",
      title: t("Inverting unit polynomials", "求单位多项式的逆"),
      explanation: t(
        "A polynomial whose constant term is a unit and whose other coefficients are nilpotent is invertible, using a finite geometric series. In $\\mathbb{Z}_{25}[x]$, $f = 2 + 5x$ has $5^2 = 0$, so try $f^{-1} = 2^{-1} - 2^{-2} \\cdot 5x = 13 - 169 \\cdot 5x = 13 - 20x = 13 + 5x$. Check: $(2 + 5x)(13 + 5x) = 26 + 75x + 25x^2 = 1$.\n\nIn $\\mathbb{Z}_9[x]$, invert $4 + 3x$: $4^{-1} = 7$, and the coefficient of $x$ is $-(7)^2(3) = -147 \\equiv 6$, so the inverse is $7 + 6x$.\n\nCheck: $(4 + 3x)(7 + 6x) = 28 + 45x + 18x^2 \\equiv 1 \\pmod{9}$.\n\n> **Watch out.** The coefficient of $x$ in the inverse is $-u^{-2}a$, with $u^{-1}$ squared; $-u^{-1}a$ or $-a$ alone does not give $1$.",
        "常数项是单位、其他系数都是幂零元的多项式是可逆的，可以用有限项的几何级数求出逆。在 $\\mathbb{Z}_{25}[x]$ 中，$f = 2 + 5x$ 满足 $5^2 = 0$，试 $f^{-1} = 2^{-1} - 2^{-2} \\cdot 5x = 13 - 169 \\cdot 5x = 13 - 20x = 13 + 5x$。验证：$(2 + 5x)(13 + 5x) = 26 + 75x + 25x^2 = 1$。\n\n在 $\\mathbb{Z}_9[x]$ 中求 $4 + 3x$ 的逆：$4^{-1} = 7$，$x$ 的系数为 $-(7)^2(3) = -147 \\equiv 6$，所以逆为 $7 + 6x$。\n\n检验：$(4 + 3x)(7 + 6x) = 28 + 45x + 18x^2 \\equiv 1 \\pmod{9}$。\n\n> **注意。** 逆中 $x$ 的系数是 $-u^{-2}a$，$u^{-1}$ 要平方；只用 $-u^{-1}a$ 或 $-a$ 乘不出 $1$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const n = p * p;
        const u = rng.pick(range(1, n - 1).filter((x) => x % p !== 0));
        const a = p * rng.int(1, p - 1);
        const ui = modInverse(u, n);
        const c0 = ui;
        const c1 = mod(-ui * ui * a, n);
        const askX = rng.bool(0.7);
        const value = askX ? c1 : c0;
        const raw = [u * c0, u * c1 + a * c0, a * c1];
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}[x]$, $${polyTex([u, a])}$ is a unit with inverse $r + sx$, where $r, s \\in \\{0, \\dots, ${n - 1}\\}$. Find $${askX ? "s" : "r"}$.`,
            `在 $${zTex(n)}[x]$ 中，$${polyTex([u, a])}$ 是单位，其逆为 $r + sx$，$r, s \\in \\{0, \\dots, ${n - 1}\\}$。求 $${askX ? "s" : "r"}$。`,
          ),
          answer: value,
          mistakes: apart(
            value,
            askX
              ? [
                  why(mod(-a, n), "That is $-a$; it leaves out the factor $u^{-2}$.", "这是 $-a$，漏掉了因子 $u^{-2}$。"),
                  why(a, "That is the coefficient of the given polynomial, not of its inverse.", "这是原多项式的系数，不是其逆的系数。"),
                  why(
                    mod(-ui * a, n),
                    "That uses $u^{-1}$ once; the coefficient needs $u^{-2}$.",
                    "这只用了一次 $u^{-1}$；系数需要 $u^{-2}$。",
                  ),
                ]
              : [
                  why(
                    u,
                    `$${u}$ is the constant term of the given polynomial; the inverse has $${u}^{-1}$.`,
                    `$${u}$ 是原多项式的常数项；逆的常数项是 $${u}^{-1}$。`,
                  ),
                  why(
                    mod(-u, n),
                    `That is $-${u}$, the additive inverse, not the multiplicative one.`,
                    `这是 $-${u}$，即加法逆元，不是乘法逆元。`,
                  ),
                  why(
                    1,
                    `The product has constant term $1$, but the inverse itself has constant term $${u}^{-1}$.`,
                    `乘积的常数项是 $1$，但逆本身的常数项是 $${u}^{-1}$。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Invert the constant term", "求常数项的逆"],
                t(
                  `$${u}^{-1} = ${ui}$ in $${zTex(n)}$, since $(${u})(${ui}) = ${u * ui} \\equiv 1$.`,
                  `在 $${zTex(n)}$ 中 $${u}^{-1} = ${ui}$，因为 $(${u})(${ui}) = ${u * ui} \\equiv 1$。`,
                ),
              ],
              [
                ["Find the coefficient of the variable", "求一次项系数"],
                t(
                  `Since $${a}^2 \\equiv 0$, the coefficient of $x$ is $-(${ui})^2(${a}) = ${-ui * ui * a} \\equiv ${c1}$, so the inverse is $${polyTex([c0, c1])}$.`,
                  `由于 $${a}^2 \\equiv 0$，$x$ 的系数为 $-(${ui})^2(${a}) = ${-ui * ui * a} \\equiv ${c1}$，所以逆为 $${polyTex([c0, c1])}$。`,
                ),
              ],
            ],
            t(
              `$(${polyTex([u, a])})(${polyTex([c0, c1])}) = ${polyTex(raw)} \\equiv 1 \\pmod{${n}}$.`,
              `$(${polyTex([u, a])})(${polyTex([c0, c1])}) = ${polyTex(raw)} \\equiv 1 \\pmod{${n}}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theDivisionAlgorithmInRingsOfPolynomialsOverFiniteFields divides polynomials over ℤₚ. */
export const theDivisionAlgorithmInRingsOfPolynomialsOverFiniteFields: TopicDef = {
  id: "the-division-algorithm-in-rings-of-polynomials-over-finite-fields",
  title: t("The Division Algorithm in Rings of Polynomials Over Finite Fields", "有限域上多项式环中的带余除法"),
  summary: t(
    "Over a field F, for f and nonzero g in F[x] there are unique q and r with f = qg + r and deg r < deg g. Over ℤₚ, long division works as usual, with each step dividing by the leading coefficient of g using inverses modulo p. Dividing by x − c leaves the remainder f(c).",
    "在域 F 上，对 F[x] 中的 f 与非零 g，存在唯一的 q、r 使 f = qg + r 且 deg r < deg g。在 ℤₚ 上，长除法照常进行，每一步用模 p 的逆元除以 g 的首项系数。除以 x − c 的余数为 f(c)。",
  ),
  intro: t(
    "Over $\\mathbb{Z}_5$, $x^2 + 3 = (x + 4)(x + 1) + 4$: indeed $(x + 4)(x + 1) = x^2 + 5x + 4 = x^2 + 4$, and adding $4$ gives $x^2 + 8 = x^2 + 3$.\n\nCheck: $x + 1 = x - 4$ over $\\mathbb{Z}_5$, and $4^2 + 3 = 19 \\equiv 4$, the remainder.\n\nIn this lesson we divide polynomials over $\\mathbb{Z}_p$ and find remainders with the remainder theorem.",
    "在 $\\mathbb{Z}_5$ 上，$x^2 + 3 = (x + 4)(x + 1) + 4$：确实 $(x + 4)(x + 1) = x^2 + 5x + 4 = x^2 + 4$，再加 $4$ 得 $x^2 + 8 = x^2 + 3$。\n\n检验：在 $\\mathbb{Z}_5$ 上 $x + 1 = x - 4$，而 $4^2 + 3 = 19 \\equiv 4$，正是余数。\n\n本课我们在 $\\mathbb{Z}_p$ 上做多项式除法，并用余式定理求余数。",
  ),
  prerequisites: ["units-in-polynomial-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "remainders-on-division-by-linear-polynomials",
      title: t("Dividing by x − c", "除以 x − c"),
      explanation: t(
        "The remainder theorem says that dividing by the variable minus a constant leaves the value of the polynomial at that constant. Over $\\mathbb{Z}_7$, dividing $x^4 + 3x + 2$ by $x - 2$ leaves $2^4 + 3 \\cdot 2 + 2 = 24 \\equiv 3$.\n\nOver $\\mathbb{Z}_5$, dividing $x^3 + 4$ by $x + 2$ uses $c = -2 \\equiv 3$: the remainder is $3^3 + 4 = 31 \\equiv 1$.\n\nCheck: $(-2)^3 + 4 = -4 \\equiv 1 \\pmod{5}$ as well.\n\n> **Watch out.** For $x - c$ evaluate at $c$, not at $-c$: dividing by $x - 2$ uses $f(2)$, while $f(-2)$ is the remainder on division by $x + 2$.",
        "余式定理说，除以变量减去一个常数，余式就是多项式在这个常数处的值。在 $\\mathbb{Z}_7$ 上，$x^4 + 3x + 2$ 除以 $x - 2$ 的余数为 $2^4 + 3 \\cdot 2 + 2 = 24 \\equiv 3$。\n\n在 $\\mathbb{Z}_5$ 上，$x^3 + 4$ 除以 $x + 2$ 时 $c = -2 \\equiv 3$：余数为 $3^3 + 4 = 31 \\equiv 1$。\n\n检验：$(-2)^3 + 4 = -4 \\equiv 1 \\pmod{5}$，结果相同。\n\n> **注意。** 除以 $x - c$ 时代入 $c$，不是 $-c$：除以 $x - 2$ 用 $f(2)$，而 $f(-2)$ 是除以 $x + 2$ 的余数。",
      ),
      generate(rng) {
        const p = rng.pick([5, 7, 11, 13]);
        const f = randomPoly(rng, rng.int(3, 5), p);
        const c = rng.int(1, p - 1);
        const raw = evalPoly(f, c);
        const value = mod(raw, p);
        return numberProblem({
          prompt: t(
            `In $${zTex(p)}[x]$, find the remainder when $${polyTex(f)}$ is divided by $x - ${c}$.`,
            `在 $${zTex(p)}[x]$ 中，求 $${polyTex(f)}$ 除以 $x - ${c}$ 的余数。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              mod(evalPoly(f, -c), p),
              `That is $f(-${c})$, the remainder on division by $x + ${c}$.`,
              `这是 $f(-${c})$，即除以 $x + ${c}$ 的余数。`,
            ),
            why(mod(raw + 1, p), `$f(${c}) = ${raw}$, not $${raw + 1}$.`, `$f(${c}) = ${raw}$，不是 $${raw + 1}$。`),
            why(
              mod(f[0]!, p),
              "That is the constant term $f(0)$, the remainder on division by $x$.",
              "这是常数项 $f(0)$，即除以 $x$ 的余数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the remainder theorem", "用余式定理"],
                t(`The remainder on division by $x - ${c}$ is $f(${c})$.`, `除以 $x - ${c}$ 的余数是 $f(${c})$。`),
              ],
              [
                ["Evaluate and reduce", "求值并约化"],
                t(`$f(${c}) = ${raw} \\equiv ${value} \\pmod{${p}}$.`, `$f(${c}) = ${raw} \\equiv ${value} \\pmod{${p}}$。`),
              ],
            ],
            t(`$${raw} - ${value} = ${raw - value}$ is a multiple of $${p}$.`, `$${raw} - ${value} = ${raw - value}$ 是 $${p}$ 的倍数。`),
          ),
        });
      },
    },
    {
      id: "dividing-polynomials-over-zp",
      title: t("Long division over $\\mathbb{Z}_p$", "在 $\\mathbb{Z}_p$ 上做长除法"),
      explanation: t(
        "Long division works over a prime modulus because the leading coefficient of the divisor has an inverse there. Over $\\mathbb{Z}_5$, divide $x^3 + 2x + 1$ by $2x^2 + 1$: $2^{-1} = 3$, so the first term of the quotient is $3x$; $x^3 + 2x + 1 - 3x(2x^2 + 1) = -x + 1 = 4x + 1$. So $q = 3x$ and $r = 4x + 1$.\n\nOver $\\mathbb{Z}_3$, divide $x^3 + 2$ by $2x + 1$, using $2^{-1} = 2$ at every step: the quotient is $2x^2 + 2x + 2$ and the remainder is $0$.\n\nCheck: $(2x^2 + 2x + 2)(2x + 1) = 4x^3 + 6x^2 + 6x + 2 \\equiv x^3 + 2 \\pmod{3}$.\n\n> **Watch out.** Each quotient term uses the inverse of the divisor's leading coefficient; dividing by the monic divisor instead gives a quotient that is off by that factor.",
        "在素数模下长除法可行，因为除式的首项系数在那里有逆元。在 $\\mathbb{Z}_5$ 上，用 $2x^2 + 1$ 除 $x^3 + 2x + 1$：$2^{-1} = 3$，所以商的首项为 $3x$；$x^3 + 2x + 1 - 3x(2x^2 + 1) = -x + 1 = 4x + 1$。所以 $q = 3x$，$r = 4x + 1$。\n\n在 $\\mathbb{Z}_3$ 上，用 $2x + 1$ 除 $x^3 + 2$，每一步都用 $2^{-1} = 2$：商为 $2x^2 + 2x + 2$，余式为 $0$。\n\n检验：$(2x^2 + 2x + 2)(2x + 1) = 4x^3 + 6x^2 + 6x + 2 \\equiv x^3 + 2 \\pmod{3}$。\n\n> **注意。** 商的每一项都要用除式首项系数的逆；若改用首一化的除式去除，商会差这个因子。",
      ),
      generate(rng) {
        const p = rng.pick([3, 5, 7]);
        let f: Poly;
        let g: Poly;
        let q: Poly;
        let r: Poly;
        do {
          f = randomPoly(rng, rng.int(3, 4), p);
          g = randomPoly(rng, 2, p, false);
          [q, r] = pDivMod(f, g, p);
        } while (r.length === 0 || g[2] === 1);
        const askQ = rng.bool();
        const right = askQ ? q : r;
        const wrongs = askQ
          ? [pDivMod(f, monic(g, p), p)[0], pAdd(q, [1], p), q.map((c) => mod(-c, p))]
          : [pDivMod(f, monic(g, p), p)[1], pAdd(r, [1], p), r.map((c) => mod(-c, p))];
        const [monicWrong, plusOne, negated] = wrongs.map((w) => polyTex(trim(w)));
        const g2 = g[2]!;
        const gi = modInverse(g2, p);
        const reasons: Reason[] = [
          because(
            monicWrong!,
            `That divides by the monic divisor, leaving out the leading coefficient $${g2}$.`,
            `这是用首一化的除式去除，漏掉了首项系数 $${g2}$。`,
          ),
          because(
            plusOne!,
            "That adds $1$ to the constant term; recheck the last subtraction.",
            "这把常数项多加了 $1$；请重算最后一次相减。",
          ),
          because(
            negated!,
            "That has every sign flipped; subtract each multiple of the divisor, do not add it.",
            "这把每个符号都弄反了；要减去除式的倍数，而不是加上。",
          ),
        ];
        return reasoned(
          texChoice(
            rng,
            t(
              `In $${zTex(p)}[x]$, divide $${polyTex(f)}$ by $${polyTex(g)}$. What is the ${askQ ? "quotient" : "remainder"}?`,
              `在 $${zTex(p)}[x]$ 中，用 $${polyTex(g)}$ 除 $${polyTex(f)}$。${askQ ? "商" : "余式"}是什么？`,
            ),
            polyTex(right),
            wrongs.map((w) => polyTex(trim(w))),
            walked(
              [
                [
                  ["Invert the leading coefficient", "求首项系数的逆"],
                  t(
                    `$${g2}^{-1} = ${gi}$ in $${zTex(p)}$, since $(${g2})(${gi}) = ${g2 * gi} \\equiv 1$.`,
                    `在 $${zTex(p)}$ 中 $${g2}^{-1} = ${gi}$，因为 $(${g2})(${gi}) = ${g2 * gi} \\equiv 1$。`,
                  ),
                ],
                [
                  ["Divide", "做除法"],
                  t(
                    `Long division gives the quotient $${polyTex(q)}$ and the remainder $${polyTex(r)}$, of degree less than $2$.`,
                    `长除法得商 $${polyTex(q)}$，余式 $${polyTex(r)}$，其次数小于 $2$。`,
                  ),
                ],
              ],
              t(
                `$(${polyTex(q)})(${polyTex(g)}) + (${polyTex(r)}) \\equiv ${polyTex(f)} \\pmod{${p}}$.`,
                `$(${polyTex(q)})(${polyTex(g)}) + (${polyTex(r)}) \\equiv ${polyTex(f)} \\pmod{${p}}$。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** polyPairWithGcd builds f = d·a and g = d·b over ℤₚ with gcd(a, b) = 1. */
function polyPairWithGcd(rng: Rng, p: number, dDeg: number): [Poly, Poly, Poly] {
  for (;;) {
    const d = randomPoly(rng, dDeg, p);
    const a = randomPoly(rng, rng.int(1, 2), p);
    const b = randomPoly(rng, rng.int(1, 2), p);
    if (deg(pGcd(a, b, p)) !== 0) continue;
    const f = pMul(d, a, p);
    const g = pMul(d, b, p);
    if (deg(f) === deg(g) && rng.bool()) continue;
    return [f, g, d];
  }
}

/** theEuclidianAlgorithmInRingsOfPolynomials finds greatest common divisors over ℤₚ. */
export const theEuclidianAlgorithmInRingsOfPolynomials: TopicDef = {
  id: "the-euclidian-algorithm-in-rings-of-polynomials",
  title: t("The Euclidean Algorithm in Rings of Polynomials", "多项式环中的欧几里得算法"),
  summary: t(
    "Over a field F, repeated division gcd(f, g) = gcd(g, r), where r is the remainder of f on division by g, ends with a last nonzero remainder; made monic, it is the greatest common divisor of f and g. Every common divisor divides it, and f and g are coprime exactly when the gcd is 1.",
    "在域 F 上，反复做除法 gcd(f, g) = gcd(g, r)（r 为 f 除以 g 的余式），最后一个非零余式化为首一后就是 f 与 g 的最大公因式。每个公因式都整除它，f 与 g 互素当且仅当最大公因式为 1。",
  ),
  intro: t(
    "Over $\\mathbb{Z}_5$: $x^2 + 4 = (x^2 + 3x + 2) + (2x + 2)$ and $x^2 + 3x + 2 = (2x + 2)(3x + 1) + 0$. The last nonzero remainder $2x + 2$, made monic, gives $\\gcd(x^2 + 4, x^2 + 3x + 2) = x + 1$.\n\nCheck: over $\\mathbb{Z}_5$, $x^2 + 4 = (x + 1)(x + 4)$ and $x^2 + 3x + 2 = (x + 1)(x + 2)$.\n\nIn this lesson we find greatest common divisors of polynomials over $\\mathbb{Z}_p$ and their degrees.",
    "在 $\\mathbb{Z}_5$ 上：$x^2 + 4 = (x^2 + 3x + 2) + (2x + 2)$，$x^2 + 3x + 2 = (2x + 2)(3x + 1) + 0$。最后一个非零余式 $2x + 2$ 化为首一，得 $\\gcd(x^2 + 4, x^2 + 3x + 2) = x + 1$。\n\n检验：在 $\\mathbb{Z}_5$ 上 $x^2 + 4 = (x + 1)(x + 4)$，$x^2 + 3x + 2 = (x + 1)(x + 2)$。\n\n本课我们求 $\\mathbb{Z}_p$ 上多项式的最大公因式及其次数。",
  ),
  prerequisites: ["the-division-algorithm-in-rings-of-polynomials-over-finite-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "gcds-of-polynomials-over-zp",
      title: t("Finding the gcd", "求最大公因式"),
      explanation: t(
        "The Euclidean algorithm works for polynomials over a field, dividing repeatedly until the remainder is zero. Over $\\mathbb{Z}_3$: $x^3 + x + 2 = x(x^2 + 2) + (2x + 2)$ and $x^2 + 2 = (2x + 2)(2x + 1) + 0$. The last nonzero remainder $2x + 2$, made monic, gives $\\gcd = x + 1$.\n\nOver $\\mathbb{Z}_2$: $x^3 + x + 1 = x(x^2 + 1) + 1$, so the last nonzero remainder is $1$ and the two polynomials are coprime.\n\nCheck: $x^2 + 1 = (x + 1)^2$ over $\\mathbb{Z}_2$, and $x + 1$ does not divide $x^3 + x + 1$, whose value at $1$ is $1 + 1 + 1 = 1$.\n\n> **Watch out.** Make the last nonzero remainder monic: $2x + 2$ and $x + 1$ divide the same polynomials, but the gcd is the monic one.",
        "欧几里得算法对域上的多项式同样适用，反复相除直到余式为零。在 $\\mathbb{Z}_3$ 上：$x^3 + x + 2 = x(x^2 + 2) + (2x + 2)$，$x^2 + 2 = (2x + 2)(2x + 1) + 0$。最后一个非零余式 $2x + 2$ 化为首一，得 $\\gcd = x + 1$。\n\n在 $\\mathbb{Z}_2$ 上：$x^3 + x + 1 = x(x^2 + 1) + 1$，所以最后一个非零余式是 $1$，两个多项式互素。\n\n检验：在 $\\mathbb{Z}_2$ 上 $x^2 + 1 = (x + 1)^2$，而 $x + 1$ 不整除 $x^3 + x + 1$，后者在 $1$ 处的值为 $1 + 1 + 1 = 1$。\n\n> **注意。** 最后一个非零余式要化为首一：$2x + 2$ 与 $x + 1$ 整除同样的多项式，但最大公因式取首一的那个。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const [f, g, d] = polyPairWithGcd(rng, p, rng.int(1, 2));
        const right = pGcd(f, g, p);
        const wrong = [d.length === right.length ? [1] : d, pAdd(right, [1], p), f.length < g.length ? f : g, [1]];
        const trail = euclidTrail(f, g, p);
        const fa = pDivMod(f, right, p)[0];
        const gb = pDivMod(g, right, p)[0];
        const reasons: Reason[] = [
          because(
            "1",
            "$1$ would make the polynomials coprime, but the algorithm ends with a nonconstant remainder.",
            "$1$ 意味着两个多项式互素，但算法最后得到的是非常数的余式。",
          ),
          because(
            polyTex(trim(pAdd(right, [1], p))),
            "That adds $1$ to the constant term of the gcd; it does not divide both polynomials.",
            "这是在最大公因式的常数项上加了 $1$；它不同时整除两个多项式。",
          ),
          because(
            polyTex(trim(f.length < g.length ? f : g)),
            "That is one of the given polynomials, not the last nonzero remainder made monic.",
            "这是所给的多项式之一，不是化为首一的最后一个非零余式。",
          ),
        ];
        return reasoned(
          texChoice(
            rng,
            t(
              `Find the monic greatest common divisor of $${polyTex(f)}$ and $${polyTex(g)}$ in $${zTex(p)}[x]$.`,
              `求 $${zTex(p)}[x]$ 中 $${polyTex(f)}$ 与 $${polyTex(g)}$ 的首一最大公因式。`,
            ),
            polyTex(right),
            wrong.map((w) => polyTex(trim(w))),
            walked(
              [
                [["Divide repeatedly", "反复相除"], t(`In the Euclidean algorithm ${trail.en}.`, `在欧几里得算法中，${trail["zh-CN"]}。`)],
                [
                  ["Make it monic", "化为首一"],
                  t(`The last nonzero divisor, made monic, is $${polyTex(right)}$.`, `最后一个非零除式化为首一后为 $${polyTex(right)}$。`),
                ],
              ],
              t(
                `$${polyTex(f)} = (${polyTex(right)})(${polyTex(fa)})$ and $${polyTex(g)} = (${polyTex(right)})(${polyTex(gb)})$ in $${zTex(p)}[x]$.`,
                `在 $${zTex(p)}[x]$ 中，$${polyTex(f)} = (${polyTex(right)})(${polyTex(fa)})$，$${polyTex(g)} = (${polyTex(right)})(${polyTex(gb)})$。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "degrees-of-gcds-over-zp",
      title: t("Degree of the gcd", "最大公因式的次数"),
      explanation: t(
        "Factoring both polynomials shows their common factors, whose product is the gcd, and its degree follows. Over $\\mathbb{Z}_2$, $x^3 + 1 = (x + 1)(x^2 + x + 1)$ and $x^2 + 1 = (x + 1)^2$, so $\\gcd(x^3 + 1, x^2 + 1) = x + 1$, of degree $1$.\n\nOver $\\mathbb{Z}_3$, $x^2 - 1 = (x - 1)(x + 1)$ and $x^2 + x = x(x + 1)$, so $\\gcd(x^2 - 1, x^2 + x) = x + 1$, of degree $1$.\n\nCheck: $(x + 2)(x + 1) = x^2 + 3x + 2 = x^2 + 2 = x^2 - 1$ in $\\mathbb{Z}_3$.\n\n> **Watch out.** The degree of the gcd comes from the common factors, not from the degrees of the polynomials: two cubics can have a gcd of any degree from $0$ to $3$.",
        "把两个多项式都因式分解，就能看出它们的公因式，公因式的乘积就是最大公因式，次数随之可知。在 $\\mathbb{Z}_2$ 上，$x^3 + 1 = (x + 1)(x^2 + x + 1)$，$x^2 + 1 = (x + 1)^2$，所以 $\\gcd(x^3 + 1, x^2 + 1) = x + 1$，次数为 $1$。\n\n在 $\\mathbb{Z}_3$ 上，$x^2 - 1 = (x - 1)(x + 1)$，$x^2 + x = x(x + 1)$，所以 $\\gcd(x^2 - 1, x^2 + x) = x + 1$，次数为 $1$。\n\n检验：在 $\\mathbb{Z}_3$ 中 $(x + 2)(x + 1) = x^2 + 3x + 2 = x^2 + 2 = x^2 - 1$。\n\n> **注意。** 最大公因式的次数取决于公因式，而不是两个多项式的次数：两个三次多项式的最大公因式可以是 $0$ 到 $3$ 之间的任何次数。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const [f, g] = polyPairWithGcd(rng, p, rng.int(0, 2));
        const right = pGcd(f, g, p);
        const value = deg(right);
        const trail = euclidTrail(f, g, p);
        return numberProblem({
          prompt: t(
            `What is the degree of $\\gcd(${polyTex(f)}, ${polyTex(g)})$ in $${zTex(p)}[x]$?`,
            `在 $${zTex(p)}[x]$ 中，$\\gcd(${polyTex(f)}, ${polyTex(g)})$ 的次数是多少？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Math.min(deg(f), deg(g)),
              "That assumes the polynomial of lower degree divides the other.",
              "这是假定次数较低的多项式整除另一个。",
            ),
            why(value + 1, `The gcd is $${polyTex(right)}$, one degree lower.`, `最大公因式是 $${polyTex(right)}$，低一次。`),
            why(
              Math.abs(deg(f) - deg(g)),
              "The difference of the degrees says nothing about the common factors.",
              "次数之差与公因式无关。",
            ),
          ]),
          solution: walked(
            [
              [["Divide repeatedly", "反复相除"], t(`In the Euclidean algorithm ${trail.en}.`, `在欧几里得算法中，${trail["zh-CN"]}。`)],
              [
                ["Read off the degree", "读出次数"],
                t(
                  `The last nonzero divisor, made monic, gives $\\gcd = ${polyTex(right)}$, of degree $${value}$.`,
                  `最后一个非零除式化为首一后给出 $\\gcd = ${polyTex(right)}$，次数为 $${value}$。`,
                ),
              ],
            ],
            t(
              `Dividing $${polyTex(f)}$ and $${polyTex(g)}$ by $${polyTex(right)}$ leaves remainder $0$ both times.`,
              `用 $${polyTex(right)}$ 除 $${polyTex(f)}$ 与 $${polyTex(g)}$，余式都是 $0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** inverseModPoly is the inverse of g modulo f over ℤₚ, if it exists. */
function inverseModPoly(g: Poly, f: Poly, p: number): Poly | undefined {
  const d = deg(f);
  return range(1, p ** d - 1)
    .map((k) => trim(range(0, d - 1).map((i) => Math.floor(k / p ** i) % p)))
    .find((h) => {
      const r = pDivMod(pMul(g, h, p), f, p)[1];
      return r.length === 1 && r[0] === 1;
    });
}

/** theExtendedEuclidianAlgorithmInRingsOfPolynomials inverts elements of ℤₚ[x]/⟨f⟩. */
export const theExtendedEuclidianAlgorithmInRingsOfPolynomials: TopicDef = {
  id: "the-extended-euclidian-algorithm-in-rings-of-polynomials",
  title: t("The Extended Euclidean Algorithm in Rings of Polynomials", "多项式环中的扩展欧几里得算法"),
  summary: t(
    "Running the Euclidean algorithm backwards writes gcd(f, g) = sf + tg for polynomials s and t. When gcd(f, g) = 1, this makes tg ≡ 1 modulo f, so t is the inverse of g in F[x]/⟨f⟩. In F[x]/⟨x² − c⟩ the inverse of a + bx is (a − bx)/(a² − cb²).",
    "把欧几里得算法倒推，可写成 gcd(f, g) = sf + tg，s、t 为多项式。当 gcd(f, g) = 1 时，tg ≡ 1 (mod f)，所以 t 是 g 在 F[x]/⟨f⟩ 中的逆。在 F[x]/⟨x² − c⟩ 中，a + bx 的逆为 (a − bx)/(a² − cb²)。",
  ),
  intro: t(
    "In $\\mathbb{Z}_5[x]/\\langle x^2 + 2 \\rangle$, $x^2 = -2 = 3$, so $x \\cdot 2x = 2x^2 = 6 = 1$ and $x^{-1} = 2x$.\n\nCheck: $2x^2 - 1 \\equiv 2x^2 + 4 = 2(x^2 + 2) \\pmod{5}$, a multiple of the modulus.\n\nIn this lesson we find inverses in $F[x]/\\langle f \\rangle$ with the extended Euclidean algorithm and with conjugates.",
    "在 $\\mathbb{Z}_5[x]/\\langle x^2 + 2 \\rangle$ 中，$x^2 = -2 = 3$，所以 $x \\cdot 2x = 2x^2 = 6 = 1$，$x^{-1} = 2x$。\n\n检验：$2x^2 - 1 \\equiv 2x^2 + 4 = 2(x^2 + 2) \\pmod{5}$，是模的倍数。\n\n本课我们用扩展欧几里得算法和共轭求 $F[x]/\\langle f \\rangle$ 中的逆。",
  ),
  prerequisites: ["the-euclidian-algorithm-in-rings-of-polynomials"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverses-in-polynomial-quotient-rings",
      title: t("Inverses modulo f", "模 f 的逆"),
      explanation: t(
        "Run the Euclidean algorithm on the polynomial and the modulus, then work backward to write one as a combination of them. In $\\mathbb{Z}_3[x]/\\langle x^2 + 1 \\rangle$: $x^2 + 1 = (x + 1)(x + 2) + 2$, so $1 = 2(x^2 + 1) - 2(x + 1)(x + 2)$, giving $(x + 1)^{-1} = -2(x + 2) = x + 2$. Check: $(x + 1)(x + 2) = x^2 + 2 = 1$.\n\nIn $\\mathbb{Z}_2[x]/\\langle x^3 + x + 1 \\rangle$, $x^3 + x + 1 = x(x^2 + 1) + 1$, so $x(x^2 + 1) = 1$ and $x^{-1} = x^2 + 1$.\n\nCheck: $x^3 + x \\equiv (x + 1) + x = 1$, using $x^3 = x + 1$.\n\n> **Watch out.** The inverse exists only when $\\gcd(g, f) = 1$; when the modulus is irreducible, every nonzero $g$ of lower degree has one.",
        "对这个多项式和模运行欧几里得算法，再倒推，把 1 写成它们的组合。在 $\\mathbb{Z}_3[x]/\\langle x^2 + 1 \\rangle$ 中：$x^2 + 1 = (x + 1)(x + 2) + 2$，所以 $1 = 2(x^2 + 1) - 2(x + 1)(x + 2)$，得 $(x + 1)^{-1} = -2(x + 2) = x + 2$。验证：$(x + 1)(x + 2) = x^2 + 2 = 1$。\n\n在 $\\mathbb{Z}_2[x]/\\langle x^3 + x + 1 \\rangle$ 中，$x^3 + x + 1 = x(x^2 + 1) + 1$，所以 $x(x^2 + 1) = 1$，$x^{-1} = x^2 + 1$。\n\n检验：用 $x^3 = x + 1$，$x^3 + x \\equiv (x + 1) + x = 1$。\n\n> **注意。** 只有 $\\gcd(g, f) = 1$ 时逆才存在；模不可约时，每个次数更低的非零 $g$ 都有逆。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5]);
        const d = p === 2 ? 3 : 2;
        let f: Poly;
        let g: Poly;
        do {
          f = randomPoly(rng, d, p);
          g = randomPoly(rng, rng.int(1, d - 1), p, false);
        } while (!irreducibleMod(f, p) || deg(g) < 1);
        const inv = inverseModPoly(g, f, p)!;
        const wrongs = [pAdd(inv, [1], p), inv.map((c) => mod(-c, p)), pAdd(inv, [0, 1], p), g];
        const off = (w: Poly, en: string, zh: string): Reason => {
          const prod = polyTex(pDivMod(pMul(g, trim(w), p), f, p)[1]);
          return because(
            polyTex(trim(w)),
            `${en} $(${polyTex(g)})(${polyTex(trim(w))}) \\equiv ${prod}$, not $1$.`,
            `${zh}$(${polyTex(g)})(${polyTex(trim(w))}) \\equiv ${prod}$，不是 $1$。`,
          );
        };
        return reasoned(
          texChoice(
            rng,
            t(
              `In $${zTex(p)}[x]/\\langle ${polyTex(f)} \\rangle$, find the inverse of $${polyTex(g)}$.`,
              `在 $${zTex(p)}[x]/\\langle ${polyTex(f)} \\rangle$ 中，求 $${polyTex(g)}$ 的逆。`,
            ),
            polyTex(inv),
            wrongs.map((w) => polyTex(trim(w))),
            walked(
              [
                [
                  ["Run the extended Euclidean algorithm", "运行扩展欧几里得算法"],
                  t(
                    `It writes $s(${polyTex(f)}) + t(${polyTex(g)}) = 1$ with $t = ${polyTex(inv)}$.`,
                    `它写出 $s(${polyTex(f)}) + t(${polyTex(g)}) = 1$，其中 $t = ${polyTex(inv)}$。`,
                  ),
                ],
                [
                  ["Read off the inverse", "读出逆"],
                  t(
                    `Modulo $${polyTex(f)}$ the term with $s$ vanishes, so the inverse of $${polyTex(g)}$ is $${polyTex(inv)}$.`,
                    `模 $${polyTex(f)}$ 时含 $s$ 的项消失，所以 $${polyTex(g)}$ 的逆是 $${polyTex(inv)}$。`,
                  ),
                ],
              ],
              t(
                `$(${polyTex(g)})(${polyTex(inv)}) = ${polyTex(pMul(g, inv, p))}$, which leaves remainder $1$ on division by $${polyTex(f)}$.`,
                `$(${polyTex(g)})(${polyTex(inv)}) = ${polyTex(pMul(g, inv, p))}$，它除以 $${polyTex(f)}$ 余 $1$。`,
              ),
            ),
          ),
          [
            off(wrongs[0]!, "That is one more than the inverse:", "这比逆多了 $1$："),
            off(wrongs[1]!, "That is the negative of the inverse:", "这是逆的相反数："),
            off(wrongs[2]!, "That adds $x$ to the inverse:", "这在逆上多加了 $x$："),
            off(wrongs[3]!, "That is the polynomial itself:", "这是多项式本身："),
          ],
        );
      },
    },
    {
      id: "inverses-modulo-quadratics",
      title: t("Inverses modulo $x^2 - c$", "模 $x^2 - c$ 的逆"),
      explanation: t(
        "Multiplying by the conjugate turns the product into a constant, which is then inverted in the coefficient field. In $\\mathbb{Z}_7[x]/\\langle x^2 - 3 \\rangle$, $(2 + x)(2 - x) = 4 - 3 = 1$, so $(2 + x)^{-1} = 2 - x = 2 + 6x$.\n\nIn $\\mathbb{Z}_5[x]/\\langle x^2 - 2 \\rangle$, $(1 + 2x)(1 - 2x) = 1 - 4 \\cdot 2 = -7 \\equiv 3$, and $3^{-1} = 2$, so $(1 + 2x)^{-1} = 2(1 - 2x) = 2 - 4x = 2 + x$.\n\nCheck: $(1 + 2x)(2 + x) = 2 + 5x + 2x^2 \\equiv 2 + 0 + 4 = 6 \\equiv 1$, using $x^2 = 2$.\n\n> **Watch out.** Divide the conjugate by the norm $a^2 - cb^2$; the conjugate alone is the inverse only when the norm is $1$.",
        "乘以共轭把乘积变成一个常数，再在系数域中对它求逆。在 $\\mathbb{Z}_7[x]/\\langle x^2 - 3 \\rangle$ 中，$(2 + x)(2 - x) = 4 - 3 = 1$，所以 $(2 + x)^{-1} = 2 - x = 2 + 6x$。\n\n在 $\\mathbb{Z}_5[x]/\\langle x^2 - 2 \\rangle$ 中，$(1 + 2x)(1 - 2x) = 1 - 4 \\cdot 2 = -7 \\equiv 3$，而 $3^{-1} = 2$，所以 $(1 + 2x)^{-1} = 2(1 - 2x) = 2 - 4x = 2 + x$。\n\n检验：用 $x^2 = 2$，$(1 + 2x)(2 + x) = 2 + 5x + 2x^2 \\equiv 2 + 0 + 4 = 6 \\equiv 1$。\n\n> **注意。** 要用范数 $a^2 - cb^2$ 去除共轭；只有范数为 $1$ 时，共轭本身才是逆。",
      ),
      generate(rng) {
        const p = rng.pick([7, 11, 13, 17, 19]);
        const squares = new Set(range(1, p - 1).map((x) => mod(x * x, p)));
        const c = rng.pick(range(2, p - 1).filter((x) => !squares.has(x)));
        const a = rng.int(1, p - 1);
        const b = rng.int(1, p - 1);
        const nrm = mod(a * a - c * b * b, p);
        const ni = modInverse(nrm, p);
        const r = mod(a * ni, p);
        const s = mod(-b * ni, p);
        const askS = rng.bool();
        const value = askS ? s : r;
        const conj = polyTex([a, -b]);
        return numberProblem({
          prompt: t(
            `In $${zTex(p)}[x]/\\langle x^2 - ${c} \\rangle$, the inverse of $${polyTex([a, b])}$ is $r + sx$ with $r, s \\in ${zTex(p)}$. Find $${askS ? "s" : "r"}$.`,
            `在 $${zTex(p)}[x]/\\langle x^2 - ${c} \\rangle$ 中，$${polyTex([a, b])}$ 的逆为 $r + sx$，$r, s \\in ${zTex(p)}$。求 $${askS ? "s" : "r"}$。`,
          ),
          answer: value,
          mistakes: apart(
            value,
            askS
              ? [
                  why(mod(-b, p), "That is $-b$ from the conjugate, not yet divided by the norm.", "这是共轭中的 $-b$，还没有除以范数。"),
                  why(
                    mod(b * ni, p),
                    "The conjugate $a - bx$ changes the sign of the coefficient of $x$.",
                    "共轭 $a - bx$ 改变了 $x$ 的系数的符号。",
                  ),
                  why(r, "That is $r$, the constant term of the inverse.", "这是 $r$，即逆的常数项。"),
                ]
              : [
                  why(a, "That is $a$ from the conjugate, not yet divided by the norm.", "这是共轭中的 $a$，还没有除以范数。"),
                  why(mod(a * nrm, p), "That multiplies by the norm instead of dividing by it.", "这是乘以范数，而不是除以范数。"),
                  why(s, "That is $s$, the coefficient of $x$ in the inverse.", "这是 $s$，即逆中 $x$ 的系数。"),
                ],
          ),
          solution: walked(
            [
              [
                ["Multiply by the conjugate", "乘以共轭"],
                t(
                  `With $x^2 = ${c}$, $(${polyTex([a, b])})(${conj}) = ${a}^2 - (${c})(${b})^2 \\equiv ${nrm}$.`,
                  `由 $x^2 = ${c}$，$(${polyTex([a, b])})(${conj}) = ${a}^2 - (${c})(${b})^2 \\equiv ${nrm}$。`,
                ),
              ],
              [
                ["Divide by the norm", "除以范数"],
                ni === 1
                  ? t(
                      `The norm is $1$, so the inverse is the conjugate $${conj} = ${polyTex([r, s])}$.`,
                      `范数为 $1$，所以逆就是共轭 $${conj} = ${polyTex([r, s])}$。`,
                    )
                  : t(
                      `$${nrm}^{-1} = ${ni}$, so the inverse is $${ni}(${conj}) = ${polyTex([r, s])}$.`,
                      `$${nrm}^{-1} = ${ni}$，所以逆为 $${ni}(${conj}) = ${polyTex([r, s])}$。`,
                    ),
              ],
            ],
            t(
              `In $(${polyTex([a, b])})(${polyTex([r, s])})$ the coefficient of $x$ is $${a * s + b * r} \\equiv 0$ and the constant is $${a * r} + (${c})(${b * s}) = ${a * r + c * b * s} \\equiv 1$.`,
              `在 $(${polyTex([a, b])})(${polyTex([r, s])})$ 中，$x$ 的系数为 $${a * s + b * r} \\equiv 0$，常数为 $${a * r} + (${c})(${b * s}) = ${a * r + c * b * s} \\equiv 1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** expandInt multiplies integer polynomials. */
function expandInt(fs: readonly Poly[]): Poly {
  return fs.reduce(
    (acc, f) => {
      const out = new Array<number>(acc.length + f.length - 1).fill(0);
      acc.forEach((a, i) => {
        f.forEach((b, j) => {
          out[i + j] = out[i + j]! + a * b;
        });
      });
      return out;
    },
    [1],
  );
}

/** irreduciblePolynomialsOverTheRealAndComplexNumbers counts irreducible factors over ℝ. */
export const irreduciblePolynomialsOverTheRealAndComplexNumbers: TopicDef = {
  id: "irreducible-polynomials-over-the-real-and-complex-numbers",
  title: t("Irreducible Polynomials Over the Real and Complex Numbers", "实数与复数上的不可约多项式"),
  summary: t(
    "A nonconstant polynomial over a field is irreducible if it is not a product of two polynomials of lower degree. By the fundamental theorem of algebra, the irreducible polynomials over ℂ are exactly the linear ones. Over ℝ, nonreal roots come in conjugate pairs, so the irreducible polynomials are the linear ones and the quadratics with negative discriminant.",
    "域上的非常数多项式若不能写成两个更低次多项式之积，则称为不可约的。由代数基本定理，ℂ 上的不可约多项式恰为一次多项式。在 ℝ 上，非实根成共轭对出现，所以不可约多项式为一次多项式与判别式为负的二次多项式。",
  ),
  intro: t(
    "Over $\\mathbb{R}$, $x^3 + 4x = x(x^2 + 4)$ has $2$ irreducible factors, since $x^2 + 4$ has no real roots. Over $\\mathbb{C}$, $x^2 + 4 = (x - 2i)(x + 2i)$, so there are $3$.\n\nCheck: $(x - 2i)(x + 2i) = x^2 - 4i^2 = x^2 + 4$.\n\nIn this lesson we decide irreducibility over $\\mathbb{R}$ and $\\mathbb{C}$ and count irreducible factors.",
    "在 $\\mathbb{R}$ 上，$x^3 + 4x = x(x^2 + 4)$ 有 $2$ 个不可约因式，因为 $x^2 + 4$ 没有实根。在 $\\mathbb{C}$ 上，$x^2 + 4 = (x - 2i)(x + 2i)$，所以有 $3$ 个。\n\n检验：$(x - 2i)(x + 2i) = x^2 - 4i^2 = x^2 + 4$。\n\n本课我们判断 $\\mathbb{R}$ 与 $\\mathbb{C}$ 上的不可约性，并数不可约因式。",
  ),
  prerequisites: ["rings-of-polynomials", "the-fundamental-theorem-of-algebra-with-quartic-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "irreducibility-over-r-and-c",
      title: t("Irreducible over $\\mathbb{R}$ or $\\mathbb{C}$?", "在 $\\mathbb{R}$ 或 $\\mathbb{C}$ 上不可约吗？"),
      explanation: t(
        "$x^2 + 2x + 5$ has discriminant $-16 < 0$, so it is irreducible over $\\mathbb{R}$; over $\\mathbb{C}$ it factors as $(x + 1 - 2i)(x + 1 + 2i)$. Every real polynomial of odd degree at least $3$ is reducible over $\\mathbb{R}$, since it has a real root.\n\n$x^4 + 4$ has no real roots, yet it is reducible over $\\mathbb{R}$: $x^4 + 4 = (x^2 + 2x + 2)(x^2 - 2x + 2)$.\n\nCheck: $(x^2 + 2)^2 - (2x)^2 = x^4 + 4x^2 + 4 - 4x^2 = x^4 + 4$.\n\n> **Watch out.** Having no real roots proves irreducibility over $\\mathbb{R}$ only for quadratics; a quartic without real roots still splits into two real quadratics.",
        "$x^2 + 2x + 5$ 的判别式为 $-16 < 0$，所以它在 $\\mathbb{R}$ 上不可约；在 $\\mathbb{C}$ 上分解为 $(x + 1 - 2i)(x + 1 + 2i)$。次数至少为 $3$ 的奇次实系数多项式在 $\\mathbb{R}$ 上都可约，因为它有实根。\n\n$x^4 + 4$ 没有实根，但在 $\\mathbb{R}$ 上可约：$x^4 + 4 = (x^2 + 2x + 2)(x^2 - 2x + 2)$。\n\n检验：$(x^2 + 2)^2 - (2x)^2 = x^4 + 4x^2 + 4 - 4x^2 = x^4 + 4$。\n\n> **注意。** 没有实根只对二次多项式说明它在 $\\mathbb{R}$ 上不可约；没有实根的四次多项式仍能分解为两个实二次多项式。",
      ),
      generate(rng) {
        const b = rng.int(-6, 6);
        const c = rng.int(-9, 12);
        const disc = b * b - 4 * c;
        const f = polyTex([c, b, 1]);
        const cubic = polyTex([rng.int(-9, 9), rng.int(-5, 5), rng.int(-3, 3), 1]);
        const k = rng.int(1, 9);
        const r = rng.nonZero(-9, 9);
        const m = Math.abs(c) + 1;
        const roots = `\\frac{${-b} \\pm \\sqrt{${disc}}}{2}`;
        const decisions: Decision[] = [
          {
            prompt: t(
              `Is $${polyTex([k, 0, 1])}$ irreducible over $\\mathbb{R}$?`,
              `$${polyTex([k, 0, 1])}$ 在 $\\mathbb{R}$ 上不可约吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Look for real roots", "找实根"],
                t(
                  `$x^2 + ${k} \\ge ${k} > 0$ for every real $x$, so there are no real roots.`,
                  `对每个实数 $x$ 都有 $x^2 + ${k} \\ge ${k} > 0$，所以没有实根。`,
                ),
              ],
              [
                ["Apply the degree", "考虑次数"],
                t(
                  "A real quadratic that factors has a linear factor, hence a real root; so this one is irreducible over $\\mathbb{R}$.",
                  "可分解的实二次多项式有一次因式，因而有实根；所以这个多项式在 $\\mathbb{R}$ 上不可约。",
                ),
              ],
            ],
            check: t(`Its discriminant is $0 - 4(${k}) = ${-4 * k} < 0$.`, `它的判别式为 $0 - 4(${k}) = ${-4 * k} < 0$。`),
            wrong: t(
              "It factors over $\\mathbb{C}$, but over $\\mathbb{R}$ a quadratic without real roots is irreducible.",
              "它在 $\\mathbb{C}$ 上可分解，但在 $\\mathbb{R}$ 上没有实根的二次多项式不可约。",
            ),
          },
          {
            prompt: t(`Is $${polyTex([r, 1])}$ irreducible over $\\mathbb{C}$?`, `$${polyTex([r, 1])}$ 在 $\\mathbb{C}$ 上不可约吗？`),
            holds: true,
            steps: [
              [["Find the degree", "找次数"], t("It has degree $1$.", "它的次数为 $1$。")],
              [
                ["Apply the definition", "用定义"],
                t(
                  "A product of two polynomials of lower degree would need two constants, whose product is a constant, not a polynomial of degree $1$.",
                  "两个更低次多项式之积只能是两个常数之积，仍是常数，而不是一次多项式。",
                ),
              ],
            ],
            check: t(`Its only root is $${-r}$, and it has degree $1$.`, `它唯一的根是 $${-r}$，次数为 $1$。`),
            wrong: t(
              "A polynomial of degree $1$ is irreducible over every field, $\\mathbb{C}$ included.",
              "一次多项式在任何域上都不可约，$\\mathbb{C}$ 也不例外。",
            ),
          },
          {
            prompt: t(`Is $${f}$ irreducible over $\\mathbb{R}$?`, `$${f}$ 在 $\\mathbb{R}$ 上不可约吗？`),
            holds: disc < 0,
            steps: [
              [["Compute the discriminant", "计算判别式"], t(`$(${b})^2 - 4(${c}) = ${disc}$.`, `$(${b})^2 - 4(${c}) = ${disc}$。`)],
              [
                ["Decide", "判断"],
                disc < 0
                  ? t(
                      "It is negative, so there are no real roots, and a real quadratic without real roots is irreducible over $\\mathbb{R}$.",
                      "它为负，所以没有实根，而没有实根的实二次多项式在 $\\mathbb{R}$ 上不可约。",
                    )
                  : t(
                      "It is not negative, so there are real roots $r_1, r_2$, and the quadratic is $(x - r_1)(x - r_2)$.",
                      "它非负，所以有实根 $r_1, r_2$，二次多项式等于 $(x - r_1)(x - r_2)$。",
                    ),
              ],
            ],
            check:
              disc < 0
                ? t(
                    `$4(${f}) = (${polyTex([b, 2])})^2 + ${-disc}$, which is positive for every real $x$.`,
                    `$4(${f}) = (${polyTex([b, 2])})^2 + ${-disc}$，对每个实数 $x$ 都为正。`,
                  )
                : t(`The roots $${roots}$ are real.`, `根 $${roots}$ 是实数。`),
            wrong:
              disc < 0
                ? t(
                    "A negative discriminant means no real roots, so the quadratic does not factor over $\\mathbb{R}$.",
                    "判别式为负意味着没有实根，所以二次多项式在 $\\mathbb{R}$ 上不能分解。",
                  )
                : t("A quadratic with real roots splits into two real linear factors.", "有实根的二次多项式分解为两个实一次因式之积。"),
          },
          {
            prompt: t(`Is $${f}$ irreducible over $\\mathbb{C}$?`, `$${f}$ 在 $\\mathbb{C}$ 上不可约吗？`),
            holds: false,
            steps: [
              [
                ["Use the fundamental theorem of algebra", "用代数基本定理"],
                t(
                  "Every polynomial of degree at least $1$ over $\\mathbb{C}$ has a root $z_1$.",
                  "$\\mathbb{C}$ 上每个至少一次的多项式都有根 $z_1$。",
                ),
              ],
              [
                ["Split off a factor", "分出因式"],
                t(
                  "So $x - z_1$ divides the quadratic, and the quotient is a second linear factor.",
                  "所以 $x - z_1$ 整除这个二次多项式，商是另一个一次因式。",
                ),
              ],
            ],
            check: t(
              `It equals $(x - z_1)(x - z_2)$ for its two roots, with $z_1 + z_2 = ${-b}$ and $z_1 z_2 = ${c}$.`,
              `它等于 $(x - z_1)(x - z_2)$，$z_1, z_2$ 是它的两个根，$z_1 + z_2 = ${-b}$，$z_1 z_2 = ${c}$。`,
            ),
            wrong: t(
              "Over $\\mathbb{C}$ every quadratic has two roots, so it is a product of two linear factors.",
              "在 $\\mathbb{C}$ 上每个二次多项式都有两个根，所以是两个一次因式之积。",
            ),
          },
          {
            prompt: t(`Is $${cubic}$ irreducible over $\\mathbb{R}$?`, `$${cubic}$ 在 $\\mathbb{R}$ 上不可约吗？`),
            holds: false,
            steps: [
              [
                ["Look at the ends", "看两端"],
                t(
                  "With leading coefficient $1$, the cubic is negative for very negative $x$ and positive for very positive $x$.",
                  "首项系数为 $1$，所以三次多项式在 $x$ 很负时为负，在 $x$ 很正时为正。",
                ),
              ],
              [
                ["Use the intermediate value theorem", "用介值定理"],
                t("So it has a real root $r$, and $x - r$ is a factor.", "所以它有实根 $r$，$x - r$ 是因式。"),
              ],
            ],
            check: t(
              "Dividing by $x - r$ leaves a real quadratic, so the cubic is a product of polynomials of lower degree.",
              "除以 $x - r$ 后剩下一个实二次多项式，所以三次多项式是更低次多项式之积。",
            ),
            wrong: t(
              "Every real polynomial of odd degree has a real root, so a real cubic is reducible over $\\mathbb{R}$.",
              "每个奇次实系数多项式都有实根，所以实三次多项式在 $\\mathbb{R}$ 上可约。",
            ),
          },
          {
            prompt: t(`Is $x^4 + ${m}$ irreducible over $\\mathbb{R}$?`, `$x^4 + ${m}$ 在 $\\mathbb{R}$ 上不可约吗？`),
            holds: false,
            steps: [
              [
                ["Pair the roots", "把根配对"],
                t(
                  "Its four roots are nonreal and come in conjugate pairs $z, \\bar z$.",
                  "它的四个根都不是实数，且成共轭对 $z, \\bar z$ 出现。",
                ),
              ],
              [
                ["Group each pair", "把每对合起来"],
                t(
                  "Each pair gives the real quadratic $(x - z)(x - \\bar z) = x^2 - 2\\operatorname{Re}(z)x + |z|^2$, so the quartic is a product of two real quadratics.",
                  "每对给出实二次多项式 $(x - z)(x - \\bar z) = x^2 - 2\\operatorname{Re}(z)x + |z|^2$，所以四次多项式是两个实二次多项式之积。",
                ),
              ],
            ],
            check: t(
              `With $s = \\sqrt[4]{${m}}$, $(x^2 + \\sqrt{2}sx + s^2)(x^2 - \\sqrt{2}sx + s^2) = x^4 + s^4 = x^4 + ${m}$.`,
              `令 $s = \\sqrt[4]{${m}}$，$(x^2 + \\sqrt{2}sx + s^2)(x^2 - \\sqrt{2}sx + s^2) = x^4 + s^4 = x^4 + ${m}$。`,
            ),
            wrong: t(
              "Having no real roots does not make a quartic irreducible over $\\mathbb{R}$; it splits into two real quadratics.",
              "没有实根并不使四次多项式在 $\\mathbb{R}$ 上不可约；它能分解为两个实二次多项式。",
            ),
          },
        ];
        const holds = rng.bool();
        return decide(rng.pick(decisions.filter((d) => d.holds === holds)));
      },
    },
    {
      id: "counting-irreducible-factors-over-r",
      title: t("Irreducible factors over $\\mathbb{R}$", "$\\mathbb{R}$ 上的不可约因式"),
      explanation: t(
        "Over the reals every polynomial factors into linear factors and quadratics without real roots, so count those pieces. $x^4 - 1 = (x - 1)(x + 1)(x^2 + 1)$ has $3$ irreducible factors over $\\mathbb{R}$ and $4$ over $\\mathbb{C}$.\n\n$x^5 - x = x(x - 1)(x + 1)(x^2 + 1)$ has $4$ irreducible factors over $\\mathbb{R}$ and $5$ over $\\mathbb{C}$.\n\nCheck: the degrees add up, $1 + 1 + 1 + 2 = 5$.\n\n> **Watch out.** Count with multiplicity: $(x - 1)^2(x^2 + 1)$ has $3$ irreducible factors over $\\mathbb{R}$, not $2$.",
        "在实数上，每个多项式都能分解成一次因式和没有实根的二次因式，所以数出这些因式。$x^4 - 1 = (x - 1)(x + 1)(x^2 + 1)$ 在 $\\mathbb{R}$ 上有 $3$ 个不可约因式，在 $\\mathbb{C}$ 上有 $4$ 个。\n\n$x^5 - x = x(x - 1)(x + 1)(x^2 + 1)$ 在 $\\mathbb{R}$ 上有 $4$ 个不可约因式，在 $\\mathbb{C}$ 上有 $5$ 个。\n\n检验：次数相加 $1 + 1 + 1 + 2 = 5$。\n\n> **注意。** 要按重数计：$(x - 1)^2(x^2 + 1)$ 在 $\\mathbb{R}$ 上有 $3$ 个不可约因式，而不是 $2$ 个。",
      ),
      generate(rng) {
        const nQuad = rng.int(1, 2);
        const nLin = rng.int(nQuad === 1 ? 1 : 0, 2);
        const lins = range(1, nLin).map(() => [rng.nonZero(-4, 4), 1]);
        const quads = range(1, nQuad).map(() => {
          const b = rng.int(-3, 3);
          return [Math.floor((b * b) / 4) + rng.int(1, 4), b, 1];
        });
        const f = expandInt([...lins, ...quads]);
        const askC = rng.bool(0.3);
        const value = askC ? nLin + 2 * nQuad : nLin + nQuad;
        const field = askC ? "\\mathbb{C}" : "\\mathbb{R}";
        const degrees = [...lins.map(() => 1), ...quads.map(() => 2)];
        return numberProblem({
          prompt: t(
            `$${polyTex(f)} = ${[...lins, ...quads].map((g) => `(${polyTex(g)})`).join("")}$. Counted with multiplicity, how many monic irreducible factors does it have over $${field}$?`,
            `$${polyTex(f)} = ${[...lins, ...quads].map((g) => `(${polyTex(g)})`).join("")}$。按重数计，它在 $${field}$ 上有多少个首一不可约因式？`,
          ),
          answer: value,
          mistakes: apart(value, [
            askC
              ? why(
                  nLin + nQuad,
                  "That counts each quadratic once, but over $\\mathbb{C}$ each splits into two linear factors.",
                  "这把每个二次因式算一次，但在 $\\mathbb{C}$ 上每个都分解为两个一次因式。",
                )
              : why(
                  nLin + 2 * nQuad,
                  "That splits the quadratics, but their discriminants are negative, so they are irreducible over $\\mathbb{R}$.",
                  "这把二次因式拆开了，但它们的判别式为负，在 $\\mathbb{R}$ 上不可约。",
                ),
            why(nLin, "That leaves out the factors coming from the quadratics.", "这漏掉了来自二次因式的因式。"),
            why(nLin + nQuad + 1, "That counts one factor too many.", "这多数了一个因式。"),
          ]),
          solution: walked(
            [
              [
                ["Classify the factors", "给因式分类"],
                t(
                  `Linear factors: $${nLin}$; quadratic factors, each with negative discriminant: $${nQuad}$.`,
                  `一次因式：$${nLin}$ 个；判别式为负的二次因式：$${nQuad}$ 个。`,
                ),
              ],
              askC
                ? [
                    ["Split the quadratics", "拆开二次因式"],
                    t(
                      `Over $\\mathbb{C}$ each quadratic splits into two linear factors: $${nLin} + ${2 * nQuad} = ${value}$.`,
                      `在 $\\mathbb{C}$ 上每个二次因式分解为两个一次因式：$${nLin} + ${2 * nQuad} = ${value}$。`,
                    ),
                  ]
                : [
                    ["Keep the quadratics", "保留二次因式"],
                    t(
                      `Over $\\mathbb{R}$ the quadratics are irreducible: $${nLin} + ${nQuad} = ${value}$.`,
                      `在 $\\mathbb{R}$ 上二次因式不可约：$${nLin} + ${nQuad} = ${value}$。`,
                    ),
                  ],
            ],
            askC
              ? t(
                  `The degree is $${deg(f)}$, and over $\\mathbb{C}$ there is one linear factor for each root counted with multiplicity: $${value}$.`,
                  `次数为 $${deg(f)}$，在 $\\mathbb{C}$ 上按重数计每个根对应一个一次因式：$${value}$ 个。`,
                )
              : t(`The degrees add up: $${degrees.join(" + ")} = ${deg(f)}$.`, `次数相加：$${degrees.join(" + ")} = ${deg(f)}$。`),
          ),
        });
      },
    },
  ],
};

/** hasRationalRoot reports whether an integer polynomial has a rational root, by the rational roots theorem. */
function hasRationalRoot(f: Poly): boolean {
  const a0 = Math.abs(f[0]!);
  const an = Math.abs(f[f.length - 1]!);
  if (a0 === 0) return true;
  const ds = (n: number) => range(1, n).filter((d) => n % d === 0);
  return ds(a0).some((p) => ds(an).some((q) => [p / q, -p / q].some((r) => Math.abs(evalPoly(f, r)) < 1e-9)));
}

/** irreduciblePolynomialsOverTheIntegersAndRationalNumbers decides irreducibility over ℚ and ℤ. */
export const irreduciblePolynomialsOverTheIntegersAndRationalNumbers: TopicDef = {
  id: "irreducible-polynomials-over-the-integers-and-rational-numbers",
  title: t("Irreducible Polynomials Over the Integers and Rational Numbers", "整数与有理数上的不可约多项式"),
  summary: t(
    "A quadratic or cubic over ℚ is reducible exactly when it has a root in ℚ, and the rational roots theorem lists the candidates. By Gauss's lemma, an integer polynomial that factors over ℚ factors over ℤ with factors of the same degrees. Over ℤ, a nonunit constant factor also counts: 2x + 4 = 2(x + 2) is reducible over ℤ but irreducible over ℚ.",
    "ℚ 上的二次或三次多项式可约当且仅当它在 ℚ 中有根，有理根定理列出了候选根。由高斯引理，在 ℚ 上可分解的整系数多项式也能在 ℤ 上分解为同样次数的因式。在 ℤ 上，非单位的常数因子也算：2x + 4 = 2(x + 2) 在 ℤ 上可约，但在 ℚ 上不可约。",
  ),
  intro: t(
    "$x^2 - 2$ is irreducible over $\\mathbb{Q}$: its candidate rational roots $\\pm 1, \\pm 2$ give the values $-1, -1, 2, 2$. Over $\\mathbb{Z}$, $2x^2 - 4 = 2(x^2 - 2)$ is reducible, since $2$ is not a unit of $\\mathbb{Z}$.\n\nCheck: the roots of $x^2 - 2$ are $\\pm\\sqrt{2}$, which are irrational.\n\nIn this lesson we decide irreducibility over $\\mathbb{Q}$ and over $\\mathbb{Z}$.",
    "$x^2 - 2$ 在 $\\mathbb{Q}$ 上不可约：它的候选有理根 $\\pm 1, \\pm 2$ 给出的值为 $-1, -1, 2, 2$。在 $\\mathbb{Z}$ 上，$2x^2 - 4 = 2(x^2 - 2)$ 可约，因为 $2$ 不是 $\\mathbb{Z}$ 的单位。\n\n检验：$x^2 - 2$ 的根是 $\\pm\\sqrt{2}$，都是无理数。\n\n本课我们判断 $\\mathbb{Q}$ 上与 $\\mathbb{Z}$ 上的不可约性。",
  ),
  prerequisites: ["irreducible-polynomials-over-the-real-and-complex-numbers", "the-rational-roots-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "irreducibility-of-cubics-over-q",
      title: t("Cubics over ℚ", "ℚ 上的三次多项式"),
      explanation: t(
        "$x^3 - 3x + 1$ is irreducible over $\\mathbb{Q}$: the only candidate rational roots are $\\pm 1$, and neither is a root. $2x^3 - x^2 - 2x + 1$ is reducible: $x = \\frac{1}{2}$ is a root.\n\n$x^3 + x + 3$ has the candidates $\\pm 1, \\pm 3$, with values $5, 1, 33, -27$, so it is irreducible over $\\mathbb{Q}$.\n\nCheck: none of $5, 1, 33, -27$ is $0$.\n\n> **Watch out.** The root test settles only degrees $2$ and $3$: $(x^2 + 1)^2$ has no rational root but is reducible.",
        "$x^3 - 3x + 1$ 在 $\\mathbb{Q}$ 上不可约：候选有理根只有 $\\pm 1$，都不是根。$2x^3 - x^2 - 2x + 1$ 可约：$x = \\frac{1}{2}$ 是根。\n\n$x^3 + x + 3$ 的候选根为 $\\pm 1, \\pm 3$，对应的值为 $5, 1, 33, -27$，所以它在 $\\mathbb{Q}$ 上不可约。\n\n检验：$5, 1, 33, -27$ 都不是 $0$。\n\n> **注意。** 求根检验只对二次和三次有效：$(x^2 + 1)^2$ 没有有理根，却是可约的。",
      ),
      generate(rng) {
        let f: Poly;
        let factors: [Poly, Poly] = [[0, 1], [1]];
        if (rng.bool()) {
          const lin = [rng.nonZero(-4, 4), rng.int(1, 3)];
          const quad = [rng.nonZero(-5, 5), rng.int(-4, 4), 1];
          f = expandInt([lin, quad]);
          factors = [lin, quad];
        } else {
          do f = [rng.nonZero(-9, 9), rng.int(-6, 6), rng.int(-5, 5), rng.int(1, 3)];
          while (hasRationalRoot(f));
        }
        const holds = !hasRationalRoot(f);
        const [lin, quad] = factors;
        const root = Q.of(-lin[0]!, lin[1]!).toLatex();
        const candidates = t(
          `A rational root is $\\pm \\frac{p}{q}$ with $p \\mid ${Math.abs(f[0]!)}$ and $q \\mid ${f[3]}$.`,
          `有理根形如 $\\pm \\frac{p}{q}$，其中 $p \\mid ${Math.abs(f[0]!)}$，$q \\mid ${f[3]}$。`,
        );
        return decide({
          prompt: t(`Is $${polyTex(f)}$ irreducible over $\\mathbb{Q}$?`, `$${polyTex(f)}$ 在 $\\mathbb{Q}$ 上不可约吗？`),
          holds,
          steps: [
            [["List the candidates", "列出候选根"], candidates],
            holds
              ? [
                  ["Test them", "逐一检验"],
                  t(
                    "None of them is a root, so the cubic has no linear factor over $\\mathbb{Q}$, and a cubic that factors must have one.",
                    "它们都不是根，所以这个三次多项式在 $\\mathbb{Q}$ 上没有一次因式，而可分解的三次多项式必有一次因式。",
                  ),
                ]
              : [
                  ["Find a root", "找出根"],
                  t(`$x = ${root}$ is a root, so $${polyTex(lin)}$ is a factor.`, `$x = ${root}$ 是根，所以 $${polyTex(lin)}$ 是因式。`),
                ],
          ],
          check: holds
            ? t(
                `For instance $f(1) = ${evalPoly(f, 1)}$ and $f(-1) = ${evalPoly(f, -1)}$ are not $0$.`,
                `例如 $f(1) = ${evalPoly(f, 1)}$，$f(-1) = ${evalPoly(f, -1)}$，都不是 $0$。`,
              )
            : t(`$${polyTex(f)} = (${polyTex(lin)})(${polyTex(quad)})$.`, `$${polyTex(f)} = (${polyTex(lin)})(${polyTex(quad)})$。`),
          wrong: holds
            ? t(
                "A cubic with no rational root has no linear factor over $\\mathbb{Q}$, so it cannot factor.",
                "没有有理根的三次多项式在 $\\mathbb{Q}$ 上没有一次因式，所以不能分解。",
              )
            : t(
                `$x = ${root}$ is a rational root, so the cubic has a linear factor.`,
                `$x = ${root}$ 是有理根，所以这个三次多项式有一次因式。`,
              ),
        });
      },
    },
    {
      id: "irreducibility-over-z-versus-q",
      title: t("Over $\\mathbb{Z}$ versus over $\\mathbb{Q}$", "$\\mathbb{Z}$ 上与 $\\mathbb{Q}$ 上"),
      explanation: t(
        "Over the integers a nonunit constant factor makes a polynomial reducible, while over the rationals constants are units and do not count. $6x + 9 = 3(2x + 3)$ is reducible over $\\mathbb{Z}$, since $3$ is not a unit of $\\mathbb{Z}$, but irreducible over $\\mathbb{Q}$, where $3$ is a unit.\n\n$4x^2 + 8 = 4(x^2 + 2)$ is reducible over $\\mathbb{Z}$ but irreducible over $\\mathbb{Q}$, while $x^2 + 2$ is irreducible over both.\n\nCheck: $x^2 + 2 \\ge 2 > 0$, so it has no rational root, and its coefficients $1, 2$ have no common factor.\n\n> **Watch out.** Over $\\mathbb{Z}$ the only constant units are $\\pm 1$; over $\\mathbb{Q}$ every nonzero constant is a unit.",
        "在整数上，非单位的常数因子会使多项式可约，而在有理数上常数都是单位，不算作因子。$6x + 9 = 3(2x + 3)$ 在 $\\mathbb{Z}$ 上可约，因为 $3$ 不是 $\\mathbb{Z}$ 的单位；但在 $\\mathbb{Q}$ 上不可约，因为 $3$ 在那里是单位。\n\n$4x^2 + 8 = 4(x^2 + 2)$ 在 $\\mathbb{Z}$ 上可约，在 $\\mathbb{Q}$ 上不可约；而 $x^2 + 2$ 在两者上都不可约。\n\n检验：$x^2 + 2 \\ge 2 > 0$，所以没有有理根，且其系数 $1, 2$ 没有公因子。\n\n> **注意。** 在 $\\mathbb{Z}$ 上常数单位只有 $\\pm 1$；在 $\\mathbb{Q}$ 上每个非零常数都是单位。",
      ),
      generate(rng) {
        const c = rng.int(2, 6);
        const a = rng.int(1, 4);
        let b: number;
        do b = rng.nonZero(-7, 7);
        while (gcd(a, Math.abs(b)) !== 1);
        const f = [c * b, c * a];
        const g = [b, a];
        const q = [rng.int(1, 5), 0, 1];
        const cq = q.map((x) => x * c);
        const q0 = q[0]!;
        const notUnit = (h: Poly, k: Poly) =>
          t(
            `$${c}$ is not a unit of $\\mathbb{Z}$, and neither is $${polyTex(k)}$, so $${polyTex(h)}$ is a product of two nonunits.`,
            `$${c}$ 不是 $\\mathbb{Z}$ 的单位，$${polyTex(k)}$ 也不是，所以 $${polyTex(h)}$ 是两个非单位之积。`,
          );
        const decisions: Decision[] = [
          {
            prompt: t(`Is $${polyTex(f)}$ irreducible over $\\mathbb{Z}$?`, `$${polyTex(f)}$ 在 $\\mathbb{Z}$ 上不可约吗？`),
            holds: false,
            steps: [
              [
                ["Factor out the common factor", "提出公因子"],
                t(`$${polyTex(f)} = ${c}(${polyTex(g)})$.`, `$${polyTex(f)} = ${c}(${polyTex(g)})$。`),
              ],
              [["Look at the units", "看单位"], notUnit(f, g)],
            ],
            check: t(`$(${c})(${a}) = ${c * a}$ and $(${c})(${b}) = ${c * b}$.`, `$(${c})(${a}) = ${c * a}$，$(${c})(${b}) = ${c * b}$。`),
            wrong: t(
              "Over $\\mathbb{Z}$ a constant factor other than $\\pm 1$ is a proper factor, so the polynomial is reducible.",
              "在 $\\mathbb{Z}$ 上，$\\pm 1$ 以外的常数因子是真因子，所以该多项式可约。",
            ),
          },
          {
            prompt: t(`Is $${polyTex(f)}$ irreducible over $\\mathbb{Q}$?`, `$${polyTex(f)}$ 在 $\\mathbb{Q}$ 上不可约吗？`),
            holds: true,
            steps: [
              [["Find the degree", "找次数"], t("It has degree $1$.", "它的次数为 $1$。")],
              [
                ["Look at the units", "看单位"],
                t(
                  `$${polyTex(f)} = ${c}(${polyTex(g)})$, but $${c}$ is a unit of $\\mathbb{Q}$, so this is not a factorization into nonunits; every polynomial of degree $1$ over a field is irreducible.`,
                  `$${polyTex(f)} = ${c}(${polyTex(g)})$，但 $${c}$ 是 $\\mathbb{Q}$ 的单位，所以这不是分解成非单位之积；域上每个一次多项式都不可约。`,
                ),
              ],
            ],
            check: t(`$${c} \\cdot \\frac{1}{${c}} = 1$ in $\\mathbb{Q}$.`, `在 $\\mathbb{Q}$ 中 $${c} \\cdot \\frac{1}{${c}} = 1$。`),
            wrong: t(
              `Over $\\mathbb{Q}$ the constant $${c}$ is a unit, so pulling it out does not make the polynomial reducible.`,
              `在 $\\mathbb{Q}$ 上常数 $${c}$ 是单位，提出它并不使多项式可约。`,
            ),
          },
          {
            prompt: t(`Is $${polyTex(cq)}$ irreducible over $\\mathbb{Q}$?`, `$${polyTex(cq)}$ 在 $\\mathbb{Q}$ 上不可约吗？`),
            holds: true,
            steps: [
              [
                ["Look for roots", "找根"],
                t(
                  `$${polyTex(cq)} = ${c}(${polyTex(q)}) > 0$ for every real $x$, so it has no real roots, and no rational ones.`,
                  `对每个实数 $x$ 都有 $${polyTex(cq)} = ${c}(${polyTex(q)}) > 0$，所以没有实根，更没有有理根。`,
                ),
              ],
              [
                ["Decide", "判断"],
                t(
                  "A quadratic without roots in $\\mathbb{Q}$ is irreducible over $\\mathbb{Q}$.",
                  "在 $\\mathbb{Q}$ 中无根的二次多项式在 $\\mathbb{Q}$ 上不可约。",
                ),
              ],
            ],
            check: t(
              `Its discriminant is $0 - 4(${c})(${c * q0}) = ${-4 * c * c * q0} < 0$.`,
              `它的判别式为 $0 - 4(${c})(${c * q0}) = ${-4 * c * c * q0} < 0$。`,
            ),
            wrong: t(
              `The factor $${c}$ is a unit of $\\mathbb{Q}$; what matters is that the quadratic has no rational root.`,
              `因子 $${c}$ 是 $\\mathbb{Q}$ 的单位；关键在于这个二次多项式没有有理根。`,
            ),
          },
          {
            prompt: t(`Is $${polyTex(cq)}$ irreducible over $\\mathbb{Z}$?`, `$${polyTex(cq)}$ 在 $\\mathbb{Z}$ 上不可约吗？`),
            holds: false,
            steps: [
              [
                ["Factor out the common factor", "提出公因子"],
                t(`$${polyTex(cq)} = ${c}(${polyTex(q)})$.`, `$${polyTex(cq)} = ${c}(${polyTex(q)})$。`),
              ],
              [["Look at the units", "看单位"], notUnit(cq, q)],
            ],
            check: t(`$(${c})(${q0}) = ${c * q0}$, the constant term.`, `$(${c})(${q0}) = ${c * q0}$，正是常数项。`),
            wrong: t(
              `It has no rational roots, but over $\\mathbb{Z}$ the constant factor $${c}$ is a proper factor.`,
              `它没有有理根，但在 $\\mathbb{Z}$ 上常数因子 $${c}$ 是真因子。`,
            ),
          },
          {
            prompt: t(`Is $${polyTex(q)}$ irreducible over $\\mathbb{Z}$?`, `$${polyTex(q)}$ 在 $\\mathbb{Z}$ 上不可约吗？`),
            holds: true,
            steps: [
              [
                ["Check that it is primitive", "检查是否本原"],
                t(
                  `Its coefficients $1$ and $${q0}$ have greatest common divisor $1$, so no nonunit constant comes out.`,
                  `它的系数 $1$ 与 $${q0}$ 的最大公因数为 $1$，所以提不出非单位常数。`,
                ),
              ],
              [
                ["Use Gauss's lemma", "用高斯引理"],
                t(
                  "It has no rational roots, so it is irreducible over $\\mathbb{Q}$, and a primitive polynomial irreducible over $\\mathbb{Q}$ is irreducible over $\\mathbb{Z}$.",
                  "它没有有理根，所以在 $\\mathbb{Q}$ 上不可约，而在 $\\mathbb{Q}$ 上不可约的本原多项式在 $\\mathbb{Z}$ 上也不可约。",
                ),
              ],
            ],
            check: t(`$x^2 + ${q0} \\ge ${q0} > 0$ for every real $x$.`, `对每个实数 $x$ 都有 $x^2 + ${q0} \\ge ${q0} > 0$。`),
            wrong: t(
              "It is primitive and has no rational roots, so by Gauss's lemma it does not factor over $\\mathbb{Z}$.",
              "它是本原的且没有有理根，所以由高斯引理它在 $\\mathbb{Z}$ 上不能分解。",
            ),
          },
        ];
        return decide(rng.pick(decisions));
      },
    },
  ],
};

/** irreduciblePolynomialsOverAFiniteField decides irreducibility over ℤₚ and counts irreducible polynomials. */
export const irreduciblePolynomialsOverAFiniteField: TopicDef = {
  id: "irreducible-polynomials-over-a-finite-field",
  title: t("Irreducible Polynomials Over a Finite Field", "有限域上的不可约多项式"),
  summary: t(
    "Over ℤₚ, a quadratic or cubic is irreducible exactly when it has no root, which can be checked by trying all p elements. A quartic with no roots may still be a product of two irreducible quadratics. There are (p² − p)/2 monic irreducible quadratics and (p³ − p)/3 monic irreducible cubics over ℤₚ.",
    "在 ℤₚ 上，二次或三次多项式不可约当且仅当它无根，这可以逐一尝试 p 个元素来检验。无根的四次多项式仍可能是两个不可约二次多项式之积。ℤₚ 上有 (p² − p)/2 个首一不可约二次多项式与 (p³ − p)/3 个首一不可约三次多项式。",
  ),
  intro: t(
    "Over $\\mathbb{Z}_2$, $x^2 + x + 1$ takes the value $1$ at both $0$ and $1$, so it has no root and is irreducible. It is the only monic irreducible quadratic there, since $\\frac{2^2 - 2}{2} = 1$.\n\nCheck: the other monic quadratics factor: $x^2 = x \\cdot x$, $x^2 + 1 = (x + 1)^2$ and $x^2 + x = x(x + 1)$.\n\nIn this lesson we decide irreducibility over $\\mathbb{Z}_p$ and count irreducible polynomials.",
    "在 $\\mathbb{Z}_2$ 上，$x^2 + x + 1$ 在 $0$ 与 $1$ 处的值都是 $1$，所以无根、不可约。它是那里唯一的首一不可约二次多项式，因为 $\\frac{2^2 - 2}{2} = 1$。\n\n检验：其余首一二次多项式都可分解：$x^2 = x \\cdot x$，$x^2 + 1 = (x + 1)^2$，$x^2 + x = x(x + 1)$。\n\n本课我们判断 $\\mathbb{Z}_p$ 上的不可约性，并数不可约多项式。",
  ),
  prerequisites: [
    "irreducible-polynomials-over-the-integers-and-rational-numbers",
    "the-division-algorithm-in-rings-of-polynomials-over-finite-fields",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "irreducibility-over-zp",
      title: t("Irreducible over $\\mathbb{Z}_p$?", "在 $\\mathbb{Z}_p$ 上不可约吗？"),
      explanation: t(
        "Over $\\mathbb{Z}_3$, $x^3 + 2x + 1$ takes the values $1, 1, 1$ at $0, 1, 2$, so it has no root and, being a cubic, is irreducible.\n\nOver $\\mathbb{Z}_5$, $x^2 + 2$ takes the values $2, 3, 1, 1, 3$ at $0, 1, 2, 3, 4$, so it is irreducible.\n\nCheck: the squares in $\\mathbb{Z}_5$ are $0, 1, 4$, and $-2 = 3$ is not one of them.\n\n> **Watch out.** No roots proves irreducibility only up to degree $3$: over $\\mathbb{Z}_2$, $x^4 + x^2 + 1 = (x^2 + x + 1)^2$ has no root.",
        "在 $\\mathbb{Z}_3$ 上，$x^3 + 2x + 1$ 在 $0, 1, 2$ 处的值为 $1, 1, 1$，所以无根，而它是三次多项式，因此不可约。\n\n在 $\\mathbb{Z}_5$ 上，$x^2 + 2$ 在 $0, 1, 2, 3, 4$ 处的值为 $2, 3, 1, 1, 3$，所以不可约。\n\n检验：$\\mathbb{Z}_5$ 中的平方数是 $0, 1, 4$，而 $-2 = 3$ 不在其中。\n\n> **注意。** 无根只对不超过三次的多项式说明不可约：在 $\\mathbb{Z}_2$ 上，$x^4 + x^2 + 1 = (x^2 + x + 1)^2$ 没有根。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const d = p === 2 ? rng.int(2, 4) : rng.int(2, 3);
        const want = rng.bool();
        let f: Poly;
        do f = randomPoly(rng, d, p);
        while (irreducibleMod(f, p) !== want || f[0] === 0);
        const values = range(0, p - 1).map((x) => mod(evalPoly(f, x), p));
        const root = values.indexOf(0);
        const evaluate: [[string, string], Text] = [
          ["Evaluate at every element", "在每个元素处求值"],
          t(
            `Its values at $${range(0, p - 1).join(", ")}$ are $${values.join(", ")}$.`,
            `它在 $${range(0, p - 1).join(", ")}$ 处的值为 $${values.join(", ")}$。`,
          ),
        ];
        const quadratic = monicPolys(2, p).find((g) => irreducibleMod(g, p) && pDivMod(f, g, p)[1].length === 0) ?? [1, 1, 1];
        const linear = polyTex([-root, 1]);
        return decide({
          prompt: t(`Is $${polyTex(f)}$ irreducible over $${zTex(p)}$?`, `$${polyTex(f)}$ 在 $${zTex(p)}$ 上不可约吗？`),
          holds: want,
          steps:
            root >= 0
              ? [
                  evaluate,
                  [
                    ["Find a root", "找出根"],
                    t(`$f(${root}) = 0$, so $${linear}$ is a factor.`, `$f(${root}) = 0$，所以 $${linear}$ 是因式。`),
                  ],
                ]
              : want
                ? [
                    evaluate,
                    [
                      ["Conclude", "得出结论"],
                      d === 4
                        ? t(
                            "There is no root, so no linear factor, and dividing by every irreducible quadratic leaves a remainder, so there is no quadratic factor either.",
                            "没有根，所以没有一次因式；用每个不可约二次多项式去除都有余式，所以也没有二次因式。",
                          )
                        : t(
                            `There is no root, so no linear factor, and a polynomial of degree $${d}$ that factors must have a linear factor.`,
                            `没有根，所以没有一次因式，而可分解的 $${d}$ 次多项式必有一次因式。`,
                          ),
                    ],
                  ]
                : [
                    evaluate,
                    [
                      ["Try quadratic factors", "试二次因式"],
                      t(`There is no root, but $${polyTex(quadratic)}$ divides it.`, `没有根，但 $${polyTex(quadratic)}$ 整除它。`),
                    ],
                  ],
          check:
            root >= 0
              ? t(
                  `$${polyTex(f)} = (${linear})(${polyTex(pDivMod(f, [mod(-root, p), 1], p)[0])})$ in $${zTex(p)}[x]$.`,
                  `在 $${zTex(p)}[x]$ 中，$${polyTex(f)} = (${linear})(${polyTex(pDivMod(f, [mod(-root, p), 1], p)[0])})$。`,
                )
              : want
                ? d === 4
                  ? t(
                      `Dividing by $x^2 + x + 1$, the only irreducible quadratic over $${zTex(2)}$, leaves a nonzero remainder.`,
                      `用 $${zTex(2)}$ 上唯一的不可约二次多项式 $x^2 + x + 1$ 去除，余式不为零。`,
                    )
                  : t(`None of $${values.join(", ")}$ is $0$.`, `$${values.join(", ")}$ 都不是 $0$。`)
                : t(
                    `$${polyTex(f)} = (${polyTex(quadratic)})(${polyTex(pDivMod(f, quadratic, p)[0])})$ in $${zTex(p)}[x]$.`,
                    `在 $${zTex(p)}[x]$ 中，$${polyTex(f)} = (${polyTex(quadratic)})(${polyTex(pDivMod(f, quadratic, p)[0])})$。`,
                  ),
          wrong:
            root >= 0
              ? t(`$f(${root}) = 0$, so it has a linear factor.`, `$f(${root}) = 0$，所以它有一次因式。`)
              : want
                ? t("It has no root and no factor of lower degree, so it is irreducible.", "它没有根，也没有更低次的因式，所以不可约。")
                : t("It has no root, but it is a product of two irreducible quadratics.", "它没有根，但它是两个不可约二次多项式之积。"),
        });
      },
    },
    {
      id: "counting-irreducible-polynomials-over-zp",
      title: t("Counting irreducibles", "数不可约多项式"),
      explanation: t(
        "Count all monic polynomials of the degree and subtract those that split into factors of lower degree. Over $\\mathbb{Z}_5$ there are $25$ monic quadratics; $5$ are squares $(x - a)^2$ and $\\binom{5}{2} = 10$ are $(x - a)(x - b)$ with $a \\ne b$, leaving $25 - 15 = 10 = \\frac{5^2 - 5}{2}$ irreducible ones. A reducible monic cubic is three linear factors, or a linear factor times an irreducible quadratic, and subtracting these leaves $\\frac{p^3 - p}{3}$. For quartics, the same subtraction leaves $\\frac{p^4 - p^2}{4}$.\n\nOver $\\mathbb{Z}_3$, of the $27$ monic cubics, $10$ are three linear factors and $3 \\cdot 3 = 9$ are a linear factor times one of the $3$ irreducible quadratics, leaving $8 = \\frac{27 - 3}{3}$.\n\nCheck: $10 + 9 + 8 = 27$.\n\n> **Watch out.** Divide by the degree: there are $\\frac{p^3 - p}{3}$ irreducible cubics, not $p^3 - p$.",
        "数出该次数的所有首一多项式，再减去那些能分解成更低次因式的多项式。在 $\\mathbb{Z}_5$ 上有 $25$ 个首一二次多项式；其中 $5$ 个是 $(x - a)^2$，$\\binom{5}{2} = 10$ 个是 $(x - a)(x - b)$（$a \\ne b$），余下 $25 - 15 = 10 = \\frac{5^2 - 5}{2}$ 个不可约。可约的首一三次多项式是三个一次因式之积，或一个一次因式与一个不可约二次因式之积，减去这些后余下 $\\frac{p^3 - p}{3}$ 个。对四次多项式，同样相减后余下 $\\frac{p^4 - p^2}{4}$ 个。\n\n在 $\\mathbb{Z}_3$ 上，$27$ 个首一三次多项式中，$10$ 个是三个一次因式之积，$3 \\cdot 3 = 9$ 个是一个一次因式与 $3$ 个不可约二次多项式之一的乘积，余下 $8 = \\frac{27 - 3}{3}$ 个。\n\n检验：$10 + 9 + 8 = 27$。\n\n> **注意。** 要除以次数：不可约三次多项式有 $\\frac{p^3 - p}{3}$ 个，而不是 $p^3 - p$ 个。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41]);
        const d = p <= 7 ? rng.pick([2, 3, 4]) : rng.pick([2, 3]);
        const cubic = d === 3;
        const value = d === 4 ? (p ** 4 - p * p) / 4 : cubic ? (p ** 3 - p) / 3 : (p * p - p) / 2;
        const name = ["", "", "quadratics", "cubics", "quartics"][d];
        const nameZh = ["", "", "二", "三", "四"][d];
        const quadratics = (p * p - p) / 2;
        const threeLinear = (p * (p + 1) * (p + 2)) / 6;
        const linearAndQuadratic = p * quadratics;
        const allLinear = (p * (p + 1) * (p + 2) * (p + 3)) / 24;
        const twoAndQuadratic = ((p * (p + 1)) / 2) * quadratics;
        const twoQuadratics = (quadratics * (quadratics + 1)) / 2;
        const linearAndCubic = (p * (p ** 3 - p)) / 3;
        const total = p ** d;
        const reducible = total - value;
        return numberProblem({
          prompt: t(
            `How many monic irreducible ${name} are there in $${zTex(p)}[x]$?`,
            `$${zTex(p)}[x]$ 中有多少个首一不可约${nameZh}次多项式？`,
          ),
          answer: value,
          mistakes: apart(
            value,
            d === 4
              ? [
                  why(p ** 4 - p * p, "That is $p^4 - p^2$ before dividing by the degree $4$.", "这是除以次数 $4$ 之前的 $p^4 - p^2$。"),
                  why(
                    Math.floor((p ** 4 - p) / 4),
                    "The formula subtracts $p^2$, not $p$: $\\frac{p^4 - p^2}{4}$.",
                    "公式减去的是 $p^2$ 而不是 $p$：$\\frac{p^4 - p^2}{4}$。",
                  ),
                  why(
                    p ** 4 - p ** 3,
                    `There are $${reducible}$ reducible monic quartics, not $${p ** 3}$.`,
                    `可约的首一四次多项式有 $${reducible}$ 个，不是 $${p ** 3}$ 个。`,
                  ),
                ]
              : cubic
                ? [
                    why(p ** 3 - p, "That is $p^3 - p$ before dividing by the degree $3$.", "这是除以次数 $3$ 之前的 $p^3 - p$。"),
                    why((p ** 3 - p) / 2, "Divide by the degree $3$, not by $2$.", "要除以次数 $3$，而不是 $2$。"),
                    why(
                      p ** 3 - p * p,
                      `There are $${reducible}$ reducible monic cubics, not $${p * p}$.`,
                      `可约的首一三次多项式有 $${reducible}$ 个，不是 $${p * p}$ 个。`,
                    ),
                  ]
                : [
                    why(p * p - p, "That is $p^2 - p$ before dividing by the degree $2$.", "这是除以次数 $2$ 之前的 $p^2 - p$。"),
                    why((p * (p + 1)) / 2, "That is the number of reducible monic quadratics.", "这是可约的首一二次多项式的个数。"),
                    why(
                      p * p - 2 * p,
                      `There are $${reducible}$ reducible monic quadratics, not $${2 * p}$.`,
                      `可约的首一二次多项式有 $${reducible}$ 个，不是 $${2 * p}$ 个。`,
                    ),
                  ],
          ),
          solution: walked(
            [
              [
                ["Count the reducible ones", "数可约的"],
                d === 4
                  ? t(
                      `Of the $${total}$ monic quartics, $${allLinear}$ are four linear factors, $${twoAndQuadratic}$ are two linear factors times an irreducible quadratic, $${twoQuadratics}$ are two irreducible quadratics and $${linearAndCubic}$ are a linear factor times an irreducible cubic.`,
                      `$${total}$ 个首一四次多项式中，$${allLinear}$ 个是四个一次因式之积，$${twoAndQuadratic}$ 个是两个一次因式与一个不可约二次因式之积，$${twoQuadratics}$ 个是两个不可约二次因式之积，$${linearAndCubic}$ 个是一个一次因式与一个不可约三次因式之积。`,
                    )
                  : cubic
                    ? t(
                        `Of the $${total}$ monic cubics, $${threeLinear}$ are three linear factors and $${linearAndQuadratic}$ are a linear factor times an irreducible quadratic.`,
                        `$${total}$ 个首一三次多项式中，$${threeLinear}$ 个是三个一次因式之积，$${linearAndQuadratic}$ 个是一个一次因式与一个不可约二次因式之积。`,
                      )
                    : t(
                        `Of the $${total}$ monic quadratics, $${p}$ are $(x - a)^2$ and $${(p * (p - 1)) / 2}$ are $(x - a)(x - b)$ with $a \\ne b$.`,
                        `$${total}$ 个首一二次多项式中，$${p}$ 个是 $(x - a)^2$，$${(p * (p - 1)) / 2}$ 个是 $(x - a)(x - b)$（$a \\ne b$）。`,
                      ),
              ],
              [
                ["Subtract", "相减"],
                t(`That leaves $${total} - ${reducible} = ${value}$.`, `余下 $${total} - ${reducible} = ${value}$ 个。`),
              ],
            ],
            d === 4
              ? t(
                  `$\\frac{${p}^4 - ${p}^2}{4} = \\frac{${p ** 4 - p * p}}{4} = ${value}$.`,
                  `$\\frac{${p}^4 - ${p}^2}{4} = \\frac{${p ** 4 - p * p}}{4} = ${value}$。`,
                )
              : cubic
                ? t(
                    `$\\frac{${p}^3 - ${p}}{3} = \\frac{${p ** 3 - p}}{3} = ${value}$.`,
                    `$\\frac{${p}^3 - ${p}}{3} = \\frac{${p ** 3 - p}}{3} = ${value}$。`,
                  )
                : t(
                    `$\\frac{${p}^2 - ${p}}{2} = \\frac{${p * p - p}}{2} = ${value}$.`,
                    `$\\frac{${p}^2 - ${p}}{2} = \\frac{${p * p - p}}{2} = ${value}$。`,
                  ),
          ),
        });
      },
    },
  ],
};

/** eisensteinPrimes lists the small primes for which Eisenstein's criterion applies to f. */
function eisensteinPrimes(f: Poly): number[] {
  const n = f.length - 1;
  const lead = f[n]!;
  const lower = f.slice(0, n);
  return [2, 3, 5, 7, 11, 13].filter((p) => lead % p !== 0 && lower.every((c) => c % p === 0) && f[0]! % (p * p) !== 0);
}

/** eisensteinFailure says why Eisenstein's criterion fails for f at the prime p. */
function eisensteinFailure(f: Poly, p: number): [string, string] {
  const lead = f[f.length - 1]!;
  if (lead % p === 0) return [`$${p}$ divides the leading coefficient $${lead}$.`, `$${p}$ 整除首项系数 $${lead}$。`];
  const bad = f.slice(0, -1).find((c) => c % p !== 0);
  if (bad !== undefined) return [`$${p}$ does not divide the coefficient $${bad}$.`, `$${p}$ 不整除系数 $${bad}$。`];
  return [`$${p}^2 = ${p * p}$ divides the constant term $${f[0]}$.`, `$${p}^2 = ${p * p}$ 整除常数项 $${f[0]}$。`];
}

/** reducibilityTestsForPolynomialsOverTheIntegersAndRationals applies Eisenstein's criterion and the mod p test. */
export const reducibilityTestsForPolynomialsOverTheIntegersAndRationals: TopicDef = {
  id: "reducibility-tests-for-polynomials-over-the-integers-and-rationals",
  title: t("Reducibility Tests for Polynomials Over the Integers and Rationals", "整数与有理数上多项式的可约性检验"),
  summary: t(
    "Eisenstein's criterion: if a prime p divides every coefficient of f ∈ ℤ[x] except the leading one, and p² does not divide the constant term, then f is irreducible over ℚ. The mod p test: if p does not divide the leading coefficient and f reduced modulo p is irreducible over ℤₚ with the same degree, then f is irreducible over ℚ.",
    "艾森斯坦判别法：若素数 p 整除 f ∈ ℤ[x] 除首项外的每个系数，且 p² 不整除常数项，则 f 在 ℚ 上不可约。模 p 检验：若 p 不整除首项系数，且 f 模 p 约化后在 ℤₚ 上不可约且次数不变，则 f 在 ℚ 上不可约。",
  ),
  intro: t(
    "For $x^3 + 2x + 2$, the prime $2$ divides the coefficients $2$ and $2$, does not divide the leading coefficient $1$, and $4 \\nmid 2$. By Eisenstein's criterion it is irreducible over $\\mathbb{Q}$.\n\nCheck: its candidate rational roots $\\pm 1, \\pm 2$ give $5, -1, 14, -10$, none of them $0$.\n\nIn this lesson we apply Eisenstein's criterion and the mod $p$ test.",
    "对 $x^3 + 2x + 2$，素数 $2$ 整除系数 $2$ 与 $2$，不整除首项系数 $1$，且 $4 \\nmid 2$。由艾森斯坦判别法，它在 $\\mathbb{Q}$ 上不可约。\n\n检验：它的候选有理根 $\\pm 1, \\pm 2$ 给出 $5, -1, 14, -10$，都不是 $0$。\n\n本课我们运用艾森斯坦判别法与模 $p$ 检验。",
  ),
  prerequisites: ["irreducible-polynomials-over-a-finite-field"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-eisensteins-criterion",
      title: t("Eisenstein's criterion", "艾森斯坦判别法"),
      explanation: t(
        "For $x^4 + 6x^2 - 9x + 12$, the prime $3$ divides $6, -9, 12$, does not divide the leading coefficient $1$, and $9 \\nmid 12$. So the polynomial is irreducible over $\\mathbb{Q}$.\n\nFor $2x^3 + 9x^2 - 3x + 6$, the prime $3$ divides $9, -3, 6$, does not divide $2$, and $9 \\nmid 6$; the prime $2$ fails, since it divides the leading coefficient.\n\nCheck: $\\frac{6}{9}$ and $\\frac{2}{3}$ are not whole numbers.\n\n> **Watch out.** The square of the prime must not divide the constant term: $x^2 + 4x + 4$ fails at $2$ because $4 \\mid 4$, and indeed it is $(x + 2)^2$.",
        "对 $x^4 + 6x^2 - 9x + 12$，素数 $3$ 整除 $6, -9, 12$，不整除首项系数 $1$，且 $9 \\nmid 12$。所以该多项式在 $\\mathbb{Q}$ 上不可约。\n\n对 $2x^3 + 9x^2 - 3x + 6$，素数 $3$ 整除 $9, -3, 6$，不整除 $2$，且 $9 \\nmid 6$；素数 $2$ 不行，因为它整除首项系数。\n\n检验：$\\frac{6}{9}$ 与 $\\frac{2}{3}$ 都不是整数。\n\n> **注意。** 素数的平方不能整除常数项：$x^2 + 4x + 4$ 在 $2$ 处失效，因为 $4 \\mid 4$，而它确实等于 $(x + 2)^2$。",
      ),
      generate(rng) {
        let f: Poly;
        let ps: number[];
        do {
          const p = rng.pick([2, 3, 5, 7]);
          const n = rng.int(3, 6);
          const u = rng.pick([1, 2, 3, 4, 5, 6].filter((x) => x % p !== 0));
          const const0 = p * u * rng.sign();
          f = [
            const0,
            ...range(1, n - 1).map(() => (rng.bool(0.4) ? 0 : p * rng.int(-3, 3))),
            rng.pick([1, 1, 2, 3].filter((x) => x % p !== 0)),
          ];
          ps = eisensteinPrimes(f);
        } while (ps.length !== 1);
        const poly = f;
        const value = ps[0]!;
        const lead = poly[poly.length - 1]!;
        const lower = poly.slice(0, -1).filter((c) => c !== 0);
        return numberProblem({
          prompt: t(
            `Eisenstein's criterion shows that $${polyTex(poly)}$ is irreducible over $\\mathbb{Q}$ for exactly one prime $p$. Find $p$.`,
            `艾森斯坦判别法对恰好一个素数 $p$ 说明 $${polyTex(poly)}$ 在 $\\mathbb{Q}$ 上不可约。求 $p$。`,
          ),
          answer: value,
          mistakes: apart(
            value,
            [2, 3, 5, 7].filter((x) => x !== value).map((x) => why(x, ...eisensteinFailure(poly, x))),
          ),
          solution: walked(
            [
              [
                ["Check the lower coefficients", "检查其余系数"],
                t(`$${value}$ divides each of $${lower.join(", ")}$.`, `$${value}$ 整除 $${lower.join(", ")}$ 中的每一个。`),
              ],
              [
                ["Check the ends", "检查首末两项"],
                t(
                  `$${value} \\nmid ${lead}$, and $${value}^2 = ${value * value}$ does not divide the constant term $${poly[0]}$.`,
                  `$${value} \\nmid ${lead}$，且 $${value}^2 = ${value * value}$ 不整除常数项 $${poly[0]}$。`,
                ),
              ],
            ],
            t(
              `$\\frac{${poly[0]}}{${value * value}}$ is not a whole number, while $\\frac{${poly[0]}}{${value}} = ${poly[0]! / value}$ is.`,
              `$\\frac{${poly[0]}}{${value * value}}$ 不是整数，而 $\\frac{${poly[0]}}{${value}} = ${poly[0]! / value}$ 是整数。`,
            ),
          ),
        });
      },
    },
    {
      id: "applying-the-mod-p-irreducibility-test",
      title: t("The mod p test", "模 p 检验"),
      explanation: t(
        "$f = 3x^3 + 5x^2 + 7x + 1$ reduces modulo $2$ to $x^3 + x^2 + x + 1$, which has the root $1$, so the test with $p = 2$ is inconclusive. Modulo $3$ it is $2x^2 + x + 1$, but the degree dropped, so the test does not apply.\n\n$x^3 - 3x + 5$ reduces modulo $2$ to $x^3 + x + 1$, whose values at $0, 1$ are $1, 1$; so it is irreducible over $\\mathbb{Z}_2$, and $x^3 - 3x + 5$ is irreducible over $\\mathbb{Q}$.\n\nCheck: its candidate rational roots $\\pm 1, \\pm 5$ give $3, 7, 115, -105$, none of them $0$.\n\n> **Watch out.** A reducible reduction proves nothing: $x^2 + 1$ is irreducible over $\\mathbb{Q}$, yet modulo $2$ it is $(x + 1)^2$.",
        "$f = 3x^3 + 5x^2 + 7x + 1$ 模 $2$ 约化为 $x^3 + x^2 + x + 1$，它有根 $1$，所以 $p = 2$ 的检验无结论。模 $3$ 得 $2x^2 + x + 1$，但次数下降了，所以检验不适用。\n\n$x^3 - 3x + 5$ 模 $2$ 约化为 $x^3 + x + 1$，它在 $0, 1$ 处的值为 $1, 1$；所以它在 $\\mathbb{Z}_2$ 上不可约，从而 $x^3 - 3x + 5$ 在 $\\mathbb{Q}$ 上不可约。\n\n检验：它的候选有理根 $\\pm 1, \\pm 5$ 给出 $3, 7, 115, -105$，都不是 $0$。\n\n> **注意。** 约化后可约并不能说明任何事：$x^2 + 1$ 在 $\\mathbb{Q}$ 上不可约，但模 $2$ 等于 $(x + 1)^2$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5]);
        const d = rng.int(2, 3);
        let f: Poly;
        do f = [...range(0, d - 1).map(() => rng.int(-9, 9)), rng.pick([1, 2, 3, 5].filter((x) => x % p !== 0))];
        while (f[0] === 0);
        const fbar = f.map((c) => mod(c, p));
        const irr = irreducibleMod(fbar, p);
        const values = range(0, p - 1).map((x) => mod(evalPoly(fbar, x), p));
        const root = values.indexOf(0);
        return decide({
          prompt: t(
            `Reduce $f = ${polyTex(f)}$ modulo $${p}$. Does the mod $${p}$ test prove that $f$ is irreducible over $\\mathbb{Q}$?`,
            `把 $f = ${polyTex(f)}$ 模 $${p}$ 约化。模 $${p}$ 检验能否证明 $f$ 在 $\\mathbb{Q}$ 上不可约？`,
          ),
          holds: irr,
          steps: [
            [
              ["Reduce the coefficients", "约化系数"],
              t(
                `$\\bar f = ${polyTex(fbar)}$, still of degree $${d}$ since $${p} \\nmid ${f[d]}$.`,
                `$\\bar f = ${polyTex(fbar)}$，次数仍为 $${d}$，因为 $${p} \\nmid ${f[d]}$。`,
              ),
            ],
            irr
              ? [
                  ["Test for roots", "检验有无根"],
                  t(
                    `Its values at $${range(0, p - 1).join(", ")}$ are $${values.join(", ")}$: no root, so $\\bar f$ is irreducible over $${zTex(p)}$, and hence $f$ is irreducible over $\\mathbb{Q}$.`,
                    `它在 $${range(0, p - 1).join(", ")}$ 处的值为 $${values.join(", ")}$：无根，所以 $\\bar f$ 在 $${zTex(p)}$ 上不可约，因此 $f$ 在 $\\mathbb{Q}$ 上不可约。`,
                  ),
                ]
              : [
                  ["Test for roots", "检验有无根"],
                  t(
                    `$\\bar f(${root}) = 0$, so $\\bar f$ is reducible over $${zTex(p)}$, and the test proves nothing.`,
                    `$\\bar f(${root}) = 0$，所以 $\\bar f$ 在 $${zTex(p)}$ 上可约，检验得不出结论。`,
                  ),
                ],
          ],
          check: irr
            ? t(`None of $${values.join(", ")}$ is $0$ modulo $${p}$.`, `$${values.join(", ")}$ 模 $${p}$ 都不是 $0$。`)
            : t(
                `$\\bar f(${root}) = ${evalPoly(fbar, root)} \\equiv 0 \\pmod{${p}}$.`,
                `$\\bar f(${root}) = ${evalPoly(fbar, root)} \\equiv 0 \\pmod{${p}}$。`,
              ),
          wrong: irr
            ? t(
                `$\\bar f$ keeps the degree and is irreducible over $${zTex(p)}$, which proves $f$ irreducible over $\\mathbb{Q}$.`,
                `$\\bar f$ 次数不变且在 $${zTex(p)}$ 上不可约，这就证明了 $f$ 在 $\\mathbb{Q}$ 上不可约。`,
              )
            : t(
                "The test needs an irreducible reduction; a reduction with a root proves nothing about $f$.",
                "检验需要约化后不可约；约化后有根，对 $f$ 说明不了什么。",
              ),
        });
      },
    },
  ],
};

/** Quat is a quaternion a + bi + cj + dk. */
type Quat = readonly [number, number, number, number];

/** qMul multiplies quaternions. */
function qMul(x: Quat, y: Quat): Quat {
  const [a1, b1, c1, d1] = x;
  const [a2, b2, c2, d2] = y;
  return [
    a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2,
    a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2,
    a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2,
    a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2,
  ];
}

/** qNorm is a² + b² + c² + d². */
const qNorm = (q: Quat) => q.reduce((s, x) => s + x * x, 0);

/** qConj is the conjugate a − bi − cj − dk. */
const qConj = (q: Quat): Quat => [q[0], -q[1], -q[2], -q[3]];

/** qTex writes a quaternion. */
function qTex(q: readonly (number | string)[]): string {
  const units = ["", "i", "j", "k"];
  const terms: string[] = [];
  q.forEach((c, idx) => {
    if (c === 0 || c === "0") return;
    const neg = typeof c === "number" ? c < 0 : c.startsWith("-");
    const abs = typeof c === "number" ? Math.abs(c) : neg ? c.slice(1) : c;
    const coef = idx > 0 && (abs === 1 || abs === "1") ? "" : `${abs}`;
    terms.push(terms.length === 0 ? `${neg ? "-" : ""}${coef}${units[idx]}` : ` ${neg ? "-" : "+"} ${coef}${units[idx]}`);
  });
  return terms.length === 0 ? "0" : terms.join("");
}

/** squaresTex writes the sum of the squares of the nonzero components of a quaternion. */
const squaresTex = (q: Quat) =>
  q
    .filter((a) => a !== 0)
    .map((a) => `${paren(a)}^2`)
    .join(" + ");

/** PRODUCT_TERMS lists, for each component of xy, the pairs of components of x and y and their signs. */
const PRODUCT_TERMS: readonly (readonly [number, number, number])[][] = [
  [
    [0, 0, 1],
    [1, 1, -1],
    [2, 2, -1],
    [3, 3, -1],
  ],
  [
    [0, 1, 1],
    [1, 0, 1],
    [2, 3, 1],
    [3, 2, -1],
  ],
  [
    [0, 2, 1],
    [1, 3, -1],
    [2, 0, 1],
    [3, 1, 1],
  ],
  [
    [0, 3, 1],
    [1, 2, 1],
    [2, 1, -1],
    [3, 0, 1],
  ],
];

/** productTerms writes component comp of xy as a signed sum of products of components. */
const productTerms = (x: Quat, y: Quat, comp: number) =>
  PRODUCT_TERMS[comp]!.map(([i, j, s], idx) => `${idx === 0 ? (s < 0 ? "-" : "") : s < 0 ? " - " : " + "}(${x[i]})(${y[j]})`).join("");

/** randomQuat is a random quaternion with small integer components. */
function randomQuat(rng: Rng, nonzeroParts = 3): Quat {
  for (;;) {
    const q: Quat = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
    if (q.filter((x) => x !== 0).length >= nonzeroParts) return q;
  }
}

/** compOf names a component of the quaternion expr. */
function compOf(comp: number, expr: string): [string, string] {
  const unit = ["", "i", "j", "k"][comp];
  return comp === 0
    ? [`the real part of $${expr}$`, `$${expr}$ 的实部`]
    : [`the coefficient of $${unit}$ in $${expr}$`, `$${expr}$ 中 $${unit}$ 的系数`];
}

/** theDivisionRingOfQuaternions multiplies quaternion units and quaternions. */
export const theDivisionRingOfQuaternions: TopicDef = {
  id: "the-division-ring-of-quaternions",
  title: t("The Division Ring of Quaternions", "四元数除环"),
  summary: t(
    "The quaternions are a + bi + cj + dk with real a, b, c, d, multiplied using i² = j² = k² = ijk = −1, so ij = k, jk = i, ki = j and ji = −k, kj = −i, ik = −j. They form a division ring: a ring with unity in which every nonzero element has an inverse, but multiplication is not commutative.",
    "四元数为 a + bi + cj + dk（a, b, c, d 为实数），乘法依据 i² = j² = k² = ijk = −1，所以 ij = k、jk = i、ki = j，而 ji = −k、kj = −i、ik = −j。它们构成除环：有幺元且每个非零元素都有逆元的环，但乘法不交换。",
  ),
  intro: t(
    "$ij = k$ but $ji = -k$, so $(i + j)^2 = i^2 + ij + ji + j^2 = -1 + k - k - 1 = -2$.\n\nCheck: $N(i + j) = 1 + 1 = 2$, and the square of a quaternion with zero real part is minus its norm.\n\nIn this lesson we multiply quaternion units and quaternions.",
    "$ij = k$，而 $ji = -k$，所以 $(i + j)^2 = i^2 + ij + ji + j^2 = -1 + k - k - 1 = -2$。\n\n检验：$N(i + j) = 1 + 1 = 2$，而实部为零的四元数的平方等于其范数的相反数。\n\n本课我们做四元数单位与四元数的乘法。",
  ),
  prerequisites: ["introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "multiplying-quaternion-units",
      title: t("Products of i, j, k", "i、j、k 的乘积"),
      explanation: t(
        "The quaternion units square to $-1$ and multiply cyclically, with the order reversed giving a minus sign. $jik = (ji)k = -k \\cdot k = -k^2 = 1$, and $i^3 j = (i^2)(ij) = -k$.\n\n$kji = k(ji) = k(-k) = -k^2 = 1$, and $ijij = (ij)(ij) = k^2 = -1$.\n\nCheck: in $ijij$ each of $i$ and $j$ appears twice, so the result is real, $\\pm 1$.\n\n> **Watch out.** Reversing a product flips its sign: $ji = -k$, not $k$.",
        "四元数单位的平方都等于 $-1$，它们按循环顺序相乘，顺序反过来时会多出一个负号。$jik = (ji)k = -k \\cdot k = -k^2 = 1$，$i^3 j = (i^2)(ij) = -k$。\n\n$kji = k(ji) = k(-k) = -k^2 = 1$，$ijij = (ij)(ij) = k^2 = -1$。\n\n检验：$ijij$ 中 $i$ 与 $j$ 各出现两次，所以结果是实数 $\\pm 1$。\n\n> **注意。** 交换乘积的顺序会改变符号：$ji = -k$，而不是 $k$。",
      ),
      generate(rng) {
        const unitQ: Record<string, Quat> = { i: [0, 1, 0, 0], j: [0, 0, 1, 0], k: [0, 0, 0, 1] };
        const len = rng.int(3, 5);
        const word = range(1, len).map(() => rng.pick(["i", "j", "k"]));
        const prefix = (m: number) => word.slice(0, m).reduce<Quat>((acc, u) => qMul(acc, unitQ[u]!), [1, 0, 0, 0]);
        const value = prefix(len);
        const names = ["1", "-1", "i", "-i", "j", "-j", "k", "-k"];
        const right = qTex(value);
        const neg = qTex(value.map((x) => -x));
        const core = right.replace("-", "");
        const odd = ["i", "j", "k"].filter((u) => word.filter((w) => w === u).length % 2 === 1);
        const partials = range(2, len)
          .map((m) => `$${word.slice(0, m).join("")} = ${qTex(prefix(m))}$`)
          .join(", ");
        const reasons: Reason[] = [
          because(
            neg,
            "That has the wrong sign; each reversed product such as $ji = -k$ brings a minus sign.",
            "符号错了；每个反序乘积（如 $ji = -k$）都会带来负号。",
          ),
          ...names
            .filter((n) => n !== right && n !== neg)
            .map((n) =>
              because(
                n,
                `The letters that appear an odd number of times fix the result up to sign; here that gives $\\pm ${core}$.`,
                `出现奇数次的字母决定了结果（不计符号）；这里得到 $\\pm ${core}$。`,
              ),
            ),
        ];
        return reasoned(
          texChoice(
            rng,
            t(`In the quaternions, simplify $${word.join("")}$.`, `在四元数中化简 $${word.join("")}$。`),
            right,
            [
              neg,
              ...rng.sample(
                names.filter((n) => n !== right && n !== neg),
                3,
              ),
            ],
            walked(
              [
                [
                  ["Recall the rules", "回顾规则"],
                  t(
                    "$ij = k$, $jk = i$, $ki = j$, the reversed products carry a minus sign, and $i^2 = j^2 = k^2 = -1$.",
                    "$ij = k$、$jk = i$、$ki = j$，反序乘积带负号，且 $i^2 = j^2 = k^2 = -1$。",
                  ),
                ],
                [
                  ["Multiply left to right", "从左到右相乘"],
                  t(`${partials}, so the result is $${right}$.`, `${partials}，所以结果为 $${right}$。`),
                ],
              ],
              odd.length === 0
                ? t(
                    "Each letter appears an even number of times, so the result is real, $\\pm 1$.",
                    "每个字母都出现偶数次，所以结果是实数 $\\pm 1$。",
                  )
                : t(
                    `${odd.map((u) => `$${u}$`).join(", ")} appear${odd.length === 1 ? "s" : ""} an odd number of times, which fixes the result as $\\pm ${core}$.`,
                    `${odd.map((u) => `$${u}$`).join("、")} 出现奇数次，这决定了结果为 $\\pm ${core}$。`,
                  ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "multiplying-quaternions",
      title: t("Multiplying quaternions", "四元数相乘"),
      explanation: t(
        "Expand the product term by term, keeping the order of the units because quaternion multiplication does not commute. $(1 + 2i)(3j - k) = 3j - k + 6ij - 2ik = 3j - k + 6k + 2j = 5j + 5k$.\n\n$(i + k)(2 + j) = 2i + ij + 2k + kj = 2i + k + 2k - i = i + 3k$.\n\nCheck: in the other order, $(2 + j)(i + k) = 2i + 2k + ji + jk = 2i + 2k - k + i = 3i + k$, a different quaternion, as noncommutativity allows.\n\n> **Watch out.** Keep each pair of units in its order: $ki = j$ but $ik = -j$.",
        "把乘积逐项展开，要保持各单位的顺序，因为四元数乘法不可交换。$(1 + 2i)(3j - k) = 3j - k + 6ij - 2ik = 3j - k + 6k + 2j = 5j + 5k$。\n\n$(i + k)(2 + j) = 2i + ij + 2k + kj = 2i + k + 2k - i = i + 3k$。\n\n检验：换个顺序，$(2 + j)(i + k) = 2i + 2k + ji + jk = 2i + 2k - k + i = 3i + k$，是另一个四元数，乘法不交换正是如此。\n\n> **注意。** 每对单位都要保持顺序：$ki = j$，但 $ik = -j$。",
      ),
      generate(rng) {
        const x = randomQuat(rng, 2);
        const y = randomQuat(rng, 2);
        const xy = qMul(x, y);
        const yx = qMul(y, x);
        const comp = rng.pick([0, 1, 2, 3].filter((c) => c === 0 || xy[c] !== yx[c]));
        const value = xy[comp]!;
        return numberProblem({
          prompt: t(
            `Let $p = ${qTex(x)}$ and $q = ${qTex(y)}$. Find ${compOf(comp, "pq")[0]}.`,
            `设 $p = ${qTex(x)}$，$q = ${qTex(y)}$。求${compOf(comp, "pq")[1]}。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(yx[comp]!, "That is the component of $qp$; the order of the factors matters.", "这是 $qp$ 的分量；因子的顺序是有影响的。"),
            why(
              x[comp]! * y[comp]!,
              "Multiplying only the matching components leaves out the cross terms.",
              "只把对应分量相乘，漏掉了交叉项。",
            ),
            why(-value, "The sign is flipped; recheck $i^2 = -1$ and the reversed products.", "符号反了；请重查 $i^2 = -1$ 与反序乘积。"),
          ]),
          solution: walked(
            [
              [
                ["Collect the terms of the component", "收集这一分量的各项"],
                t(`It is $${productTerms(x, y, comp)} = ${value}$.`, `它等于 $${productTerms(x, y, comp)} = ${value}$。`),
              ],
              [
                ["Assemble the product", "写出整个乘积"],
                t(`$pq = ${qTex(xy)}$, while $qp = ${qTex(yx)}$.`, `$pq = ${qTex(xy)}$，而 $qp = ${qTex(yx)}$。`),
              ],
            ],
            t(
              `$N(pq) = ${squaresTex(xy)} = ${qNorm(xy)} = ${qNorm(x)} \\cdot ${qNorm(y)} = N(p)N(q)$.`,
              `$N(pq) = ${squaresTex(xy)} = ${qNorm(xy)} = ${qNorm(x)} \\cdot ${qNorm(y)} = N(p)N(q)$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** invertingQuaternions finds norms and inverses of quaternions. */
export const invertingQuaternions: TopicDef = {
  id: "inverting-quaternions",
  title: t("Inverting Quaternions", "求四元数的逆"),
  summary: t(
    "The conjugate of q = a + bi + cj + dk is q̄ = a − bi − cj − dk, and qq̄ = q̄q = a² + b² + c² + d², the norm N(q). So every nonzero q has the inverse q⁻¹ = q̄ / N(q). The norm is multiplicative: N(pq) = N(p)N(q).",
    "q = a + bi + cj + dk 的共轭为 q̄ = a − bi − cj − dk，且 qq̄ = q̄q = a² + b² + c² + d²，即范数 N(q)。所以每个非零 q 都有逆 q⁻¹ = q̄ / N(q)。范数是可乘的：N(pq) = N(p)N(q)。",
  ),
  intro: t(
    "$q = 1 + i + j + k$ has $N(q) = 1 + 1 + 1 + 1 = 4$, so $q^{-1} = \\frac{1 - i - j - k}{4}$.\n\nCheck: $(1 + i + j + k)(1 - i - j - k) = N(q) = 4$, so dividing by $4$ gives $1$.\n\nIn this lesson we find norms and inverses of quaternions.",
    "$q = 1 + i + j + k$ 的范数为 $N(q) = 1 + 1 + 1 + 1 = 4$，所以 $q^{-1} = \\frac{1 - i - j - k}{4}$。\n\n检验：$(1 + i + j + k)(1 - i - j - k) = N(q) = 4$，除以 $4$ 得 $1$。\n\n本课我们求四元数的范数与逆。",
  ),
  prerequisites: ["the-division-ring-of-quaternions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "norms-of-quaternions",
      title: t("Norms", "范数"),
      explanation: t(
        "The norm is the sum of the squares of the four components, and the norm of a product is the product of the norms. $N(2 - i + 3k) = 4 + 1 + 9 = 14$, and $N((1 + i)(2 - i + 3k)) = N(1 + i) \\cdot 14 = 28$.\n\n$N(3 - 4j) = 9 + 16 = 25$ and $N(2i - 2k) = 4 + 4 = 8$, so $N((3 - 4j)(2i - 2k)) = 25 \\cdot 8 = 200$.\n\nCheck: $(3 - 4j)(2i - 2k) = 6i - 6k - 8ji + 8jk = 14i + 2k$, and $196 + 4 = 200$.\n\n> **Watch out.** Square every component, negative ones included: $N(1 - 2i) = 1 + 4 = 5$, not $1 - 4$.",
        "范数是四个分量的平方和，乘积的范数等于范数的乘积。$N(2 - i + 3k) = 4 + 1 + 9 = 14$，$N((1 + i)(2 - i + 3k)) = N(1 + i) \\cdot 14 = 28$。\n\n$N(3 - 4j) = 9 + 16 = 25$，$N(2i - 2k) = 4 + 4 = 8$，所以 $N((3 - 4j)(2i - 2k)) = 25 \\cdot 8 = 200$。\n\n检验：$(3 - 4j)(2i - 2k) = 6i - 6k - 8ji + 8jk = 14i + 2k$，而 $196 + 4 = 200$。\n\n> **注意。** 每个分量都要平方，负的也一样：$N(1 - 2i) = 1 + 4 = 5$，而不是 $1 - 4$。",
      ),
      generate(rng) {
        const x = randomQuat(rng);
        const product = rng.bool(0.4);
        const y = randomQuat(rng, 2);
        const nx = qNorm(x);
        const ny = qNorm(y);
        const value = product ? nx * ny : nx;
        const sum = (q: Quat) => q.reduce((s, a) => s + a, 0);
        return numberProblem({
          prompt: product
            ? t(`Find $N(pq)$ for $p = ${qTex(x)}$ and $q = ${qTex(y)}$.`, `设 $p = ${qTex(x)}$，$q = ${qTex(y)}$，求 $N(pq)$。`)
            : t(`Find the norm $N(q) = q\\bar q$ of $q = ${qTex(x)}$.`, `求 $q = ${qTex(x)}$ 的范数 $N(q) = q\\bar q$。`),
          answer: value,
          mistakes: apart(
            value,
            product
              ? [
                  why(nx + ny, "Norms multiply under multiplication; they do not add.", "相乘时范数相乘，而不是相加。"),
                  why(qNorm(qMul(x, y)) + 1, `$N(pq)$ is $${value}$, one less.`, `$N(pq)$ 是 $${value}$，少 $1$。`),
                  why(
                    sum(x) * sum(y),
                    "That multiplies the sums of the components; the norm adds their squares.",
                    "这是把各分量之和相乘；范数是分量的平方和。",
                  ),
                ]
              : [
                  why(
                    sum(x) ** 2,
                    "That squares the sum of the components instead of adding their squares.",
                    "这是把分量之和平方，而不是把分量的平方相加。",
                  ),
                  why(
                    x[0]! ** 2 - x[1]! ** 2 - x[2]! ** 2 - x[3]! ** 2,
                    "The norm adds all four squares; none is subtracted.",
                    "范数把四个平方都相加，没有一项是减去的。",
                  ),
                  why(value + 1, `The squares add up to $${value}$, not $${value + 1}$.`, `平方和是 $${value}$，不是 $${value + 1}$。`),
                ],
          ),
          solution: product
            ? walked(
                [
                  [
                    ["Find each norm", "求各自的范数"],
                    t(
                      `$N(p) = ${squaresTex(x)} = ${nx}$ and $N(q) = ${squaresTex(y)} = ${ny}$.`,
                      `$N(p) = ${squaresTex(x)} = ${nx}$，$N(q) = ${squaresTex(y)} = ${ny}$。`,
                    ),
                  ],
                  [
                    ["Multiply", "相乘"],
                    t(
                      `The norm is multiplicative: $N(pq) = N(p)N(q) = ${nx} \\cdot ${ny} = ${value}$.`,
                      `范数可乘：$N(pq) = N(p)N(q) = ${nx} \\cdot ${ny} = ${value}$。`,
                    ),
                  ],
                ],
                t(
                  `$pq = ${qTex(qMul(x, y))}$, and $${squaresTex(qMul(x, y))} = ${value}$.`,
                  `$pq = ${qTex(qMul(x, y))}$，且 $${squaresTex(qMul(x, y))} = ${value}$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Square the components", "把各分量平方"],
                    t(
                      `The nonzero components ${x
                        .filter((a) => a !== 0)
                        .map((a) => `$${a}$`)
                        .join(", ")} have squares ${x
                        .filter((a) => a !== 0)
                        .map((a) => `$${a * a}$`)
                        .join(", ")}.`,
                      `非零分量 ${x
                        .filter((a) => a !== 0)
                        .map((a) => `$${a}$`)
                        .join("、")} 的平方为 ${x
                        .filter((a) => a !== 0)
                        .map((a) => `$${a * a}$`)
                        .join("、")}。`,
                    ),
                  ],
                  [["Add the squares", "把平方相加"], t(`$N(q) = ${squaresTex(x)} = ${value}$.`, `$N(q) = ${squaresTex(x)} = ${value}$。`)],
                ],
                t(
                  `$(${qTex(x)})(${qTex(qConj(x))}) = ${qTex(qMul(x, qConj(x)))}$, the conjugate product.`,
                  `$(${qTex(x)})(${qTex(qConj(x))}) = ${qTex(qMul(x, qConj(x)))}$，即与共轭之积。`,
                ),
              ),
        });
      },
    },
    {
      id: "inverses-of-quaternions",
      title: t("Inverses", "逆"),
      explanation: t(
        "A quaternion times its conjugate equals its norm, so the inverse is the conjugate divided by the norm. $(1 + 2j - k)^{-1} = \\frac{1 - 2j + k}{1 + 4 + 1} = \\frac{1}{6} - \\frac{1}{3}j + \\frac{1}{6}k$.\n\n$N(2 - i + 2k) = 4 + 1 + 4 = 9$, so $(2 - i + 2k)^{-1} = \\frac{2 + i - 2k}{9}$, whose coefficient of $k$ is $-\\frac{2}{9}$.\n\nCheck: $(2 - i + 2k)(2 + i - 2k) = 9$, the norm, so multiplying by $\\frac{1}{9}$ gives $1$.\n\n> **Watch out.** Divide by the norm, not by its square root $3$: $(2 - i + 2k) \\cdot \\frac{2 + i - 2k}{3} = 3$, not $1$.",
        "四元数乘以它的共轭等于它的范数，所以逆元就是共轭除以范数。$(1 + 2j - k)^{-1} = \\frac{1 - 2j + k}{1 + 4 + 1} = \\frac{1}{6} - \\frac{1}{3}j + \\frac{1}{6}k$。\n\n$N(2 - i + 2k) = 4 + 1 + 4 = 9$，所以 $(2 - i + 2k)^{-1} = \\frac{2 + i - 2k}{9}$，其中 $k$ 的系数为 $-\\frac{2}{9}$。\n\n检验：$(2 - i + 2k)(2 + i - 2k) = 9$，正是范数，乘以 $\\frac{1}{9}$ 得 $1$。\n\n> **注意。** 要除以范数，而不是它的平方根 $3$：$(2 - i + 2k) \\cdot \\frac{2 + i - 2k}{3} = 3$，不是 $1$。",
      ),
      generate(rng) {
        const x = randomQuat(rng);
        const nrm = qNorm(x);
        // A component that is zero stays zero in the inverse, so it would test nothing.
        const comp = rng.pick([0, 1, 2, 3].filter((i) => x[i] !== 0));
        const c = qConj(x)[comp]!;
        const value = Q.of(c, nrm);
        const unconjugated = t(
          "That forgets to conjugate: the coefficients of $i$, $j$, $k$ change sign in the inverse.",
          "这忘了取共轭：逆中 $i$、$j$、$k$ 的系数要变号。",
        );
        return numberProblem({
          prompt: t(`Find ${compOf(comp, `(${qTex(x)})^{-1}`)[0]}.`, `求${compOf(comp, `(${qTex(x)})^{-1}`)[1]}。`),
          answer: value,
          mistakes: apart(value, [
            comp === 0
              ? why(
                  Q.of(-c, nrm),
                  "The conjugate keeps the real part; only the coefficients of $i$, $j$, $k$ change sign.",
                  "共轭保留实部；只有 $i$、$j$、$k$ 的系数变号。",
                )
              : why(Q.of(-c, nrm), unconjugated.en, unconjugated["zh-CN"]),
            why(Q.of(x[comp]!, nrm), unconjugated.en, unconjugated["zh-CN"]),
            why(
              Q.of(c, Math.round(Math.sqrt(nrm)) || 1),
              `Divide by the norm $${nrm}$ itself, not by about its square root.`,
              `要除以范数 $${nrm}$ 本身，而不是约等于它的平方根的数。`,
            ),
          ]),
          solution: walked(
            [
              [["Find the norm", "求范数"], t(`$N(q) = ${squaresTex(x)} = ${nrm}$.`, `$N(q) = ${squaresTex(x)} = ${nrm}$。`)],
              [
                ["Divide the conjugate by the norm", "共轭除以范数"],
                t(
                  `$q^{-1} = \\frac{\\bar q}{N(q)} = \\frac{${qTex(qConj(x))}}{${nrm}}$, so ${compOf(comp, "q^{-1}")[0]} is $${value.toLatex()}$.`,
                  `$q^{-1} = \\frac{\\bar q}{N(q)} = \\frac{${qTex(qConj(x))}}{${nrm}}$，所以${compOf(comp, "q^{-1}")[1]}为 $${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$(${qTex(x)})(${qTex(qConj(x))}) = ${nrm}$, so dividing by $${nrm}$ gives $1$.`,
              `$(${qTex(x)})(${qTex(qConj(x))}) = ${nrm}$，除以 $${nrm}$ 得 $1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** linearEquationsOverQuaternions solves qx = r and xq = r. */
export const linearEquationsOverQuaternions: TopicDef = {
  id: "linear-equations-over-quaternions",
  title: t("Linear Equations Over Quaternions", "四元数上的线性方程"),
  summary: t(
    "Since quaternion multiplication is not commutative, qx = r and xq = r have different solutions: x = q⁻¹r for the first and x = rq⁻¹ for the second. With q⁻¹ = q̄/N(q), these are x = q̄r/N(q) and x = rq̄/N(q).",
    "由于四元数乘法不交换，qx = r 与 xq = r 的解不同：前者 x = q⁻¹r，后者 x = rq⁻¹。由 q⁻¹ = q̄/N(q)，它们分别为 x = q̄r/N(q) 与 x = rq̄/N(q)。",
  ),
  intro: t(
    "To solve $ix = j$, multiply on the left by $i^{-1} = -i$: $x = -ij = -k$.\n\nCheck: $i(-k) = -ik = j$.\n\nIn this lesson we solve $qx = r$ and $xq = r$ over the quaternions.",
    "解 $ix = j$：在左边乘以 $i^{-1} = -i$，得 $x = -ij = -k$。\n\n检验：$i(-k) = -ik = j$。\n\n本课我们在四元数上解 $qx = r$ 与 $xq = r$。",
  ),
  prerequisites: ["inverting-quaternions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-left-linear-equations-over-quaternions",
      title: t("Solving qx = r", "解 qx = r"),
      explanation: t(
        "When the unknown is on the right of the coefficient, multiply by the inverse of the coefficient on the left side. To solve $(1 + i)x = 2j$: $x = \\frac{(1 - i) \\cdot 2j}{2} = (1 - i)j = j - k$.\n\nTo solve $jx = 1 + k$: $j^{-1} = -j$, so $x = -j(1 + k) = -j - jk = -i - j$.\n\nCheck: $j(-i - j) = -ji - j^2 = k + 1$.\n\n> **Watch out.** For $qx = r$ the inverse goes on the left, $x = q^{-1}r$; the product $rq^{-1}$ solves $xq = r$ instead.",
        "当未知数在系数的右边时，在左边乘以系数的逆元。解 $(1 + i)x = 2j$：$x = \\frac{(1 - i) \\cdot 2j}{2} = (1 - i)j = j - k$。\n\n解 $jx = 1 + k$：$j^{-1} = -j$，所以 $x = -j(1 + k) = -j - jk = -i - j$。\n\n检验：$j(-i - j) = -ji - j^2 = k + 1$。\n\n> **注意。** 对 $qx = r$，逆要乘在左边：$x = q^{-1}r$；$rq^{-1}$ 解的是 $xq = r$。",
      ),
      generate(rng) {
        const q = randomQuat(rng, 2);
        const x = randomQuat(rng, 2);
        const r = qMul(q, x);
        const wrongX = qMul(qMul(r, qConj(q)), [1, 0, 0, 0]).map((v) => v / qNorm(q));
        const comp = rng.pick([0, 1, 2, 3].filter((c) => x[c] !== wrongX[c]).concat([1]));
        const value = x[comp]!;
        const nq = qNorm(q);
        return numberProblem({
          prompt: t(
            `Solve $(${qTex(q)})x = ${qTex(r)}$ over the quaternions. Find ${compOf(comp, "x")[0]}.`,
            `在四元数上解 $(${qTex(q)})x = ${qTex(r)}$。求${compOf(comp, "x")[1]}。`,
          ),
          answer: value,
          mistakes: apart(value, [
            Number.isInteger(wrongX[comp])
              ? why(wrongX[comp]!, "That comes from $rq^{-1}$, with the inverse on the wrong side.", "这来自 $rq^{-1}$，逆乘错了边。")
              : why(-value, "The sign is flipped.", "符号反了。"),
            why(-value, "The sign is flipped.", "符号反了。"),
            why(value + 1, `The component is $${value}$, one less.`, `这个分量是 $${value}$，少 $1$。`),
          ]),
          solution: walked(
            [
              [
                ["Multiply on the left by the inverse", "在左边乘以逆"],
                t(
                  `$q^{-1} = \\frac{${qTex(qConj(q))}}{${nq}}$, and $x = q^{-1}r$.`,
                  `$q^{-1} = \\frac{${qTex(qConj(q))}}{${nq}}$，且 $x = q^{-1}r$。`,
                ),
              ],
              [
                ["Compute", "计算"],
                t(
                  `$x = \\frac{(${qTex(qConj(q))})(${qTex(r)})}{${nq}} = \\frac{${qTex(qMul(qConj(q), r))}}{${nq}} = ${qTex(x)}$.`,
                  `$x = \\frac{(${qTex(qConj(q))})(${qTex(r)})}{${nq}} = \\frac{${qTex(qMul(qConj(q), r))}}{${nq}} = ${qTex(x)}$。`,
                ),
              ],
            ],
            t(`$(${qTex(q)})(${qTex(x)}) = ${qTex(r)}$.`, `$(${qTex(q)})(${qTex(x)}) = ${qTex(r)}$。`),
          ),
        });
      },
    },
    {
      id: "solving-right-linear-equations-over-quaternions",
      title: t("Solving xq = r", "解 xq = r"),
      explanation: t(
        "When the unknown is on the left of the coefficient, multiply by the inverse on the right, which can give a different answer. To solve $x(1 + i) = 2j$: $x = \\frac{2j(1 - i)}{2} = j(1 - i) = j + k$, not $j - k$ as for $(1 + i)x = 2j$.\n\nTo solve $xj = 1 + k$: $x = (1 + k)(-j) = -j - kj = i - j$.\n\nCheck: $(i - j)j = ij - j^2 = k + 1$.\n\n> **Watch out.** For $xq = r$ the inverse goes on the right, $x = rq^{-1}$; the product $q^{-1}r$ solves $qx = r$ and usually differs.",
        "当未知数在系数的左边时，在右边乘以逆元，这可能给出不同的答案。解 $x(1 + i) = 2j$：$x = \\frac{2j(1 - i)}{2} = j(1 - i) = j + k$，而不是 $(1 + i)x = 2j$ 的解 $j - k$。\n\n解 $xj = 1 + k$：$x = (1 + k)(-j) = -j - kj = i - j$。\n\n检验：$(i - j)j = ij - j^2 = k + 1$。\n\n> **注意。** 对 $xq = r$，逆要乘在右边：$x = rq^{-1}$；$q^{-1}r$ 解的是 $qx = r$，通常不同。",
      ),
      generate(rng) {
        const q = randomQuat(rng, 2);
        const x = randomQuat(rng, 2);
        const r = qMul(x, q);
        const wrongX = qMul(qConj(q), r).map((v) => v / qNorm(q));
        const comp = rng.pick([0, 1, 2, 3].filter((c) => x[c] !== wrongX[c]).concat([1]));
        const value = x[comp]!;
        const nq = qNorm(q);
        return numberProblem({
          prompt: t(
            `Solve $x(${qTex(q)}) = ${qTex(r)}$ over the quaternions. Find ${compOf(comp, "x")[0]}.`,
            `在四元数上解 $x(${qTex(q)}) = ${qTex(r)}$。求${compOf(comp, "x")[1]}。`,
          ),
          answer: value,
          mistakes: apart(value, [
            Number.isInteger(wrongX[comp])
              ? why(wrongX[comp]!, "That comes from $q^{-1}r$, with the inverse on the wrong side.", "这来自 $q^{-1}r$，逆乘错了边。")
              : why(-value, "The sign is flipped.", "符号反了。"),
            why(-value, "The sign is flipped.", "符号反了。"),
            why(value + 1, `The component is $${value}$, one less.`, `这个分量是 $${value}$，少 $1$。`),
          ]),
          solution: walked(
            [
              [
                ["Multiply on the right by the inverse", "在右边乘以逆"],
                t(
                  `$q^{-1} = \\frac{${qTex(qConj(q))}}{${nq}}$, and $x = rq^{-1}$.`,
                  `$q^{-1} = \\frac{${qTex(qConj(q))}}{${nq}}$，且 $x = rq^{-1}$。`,
                ),
              ],
              [
                ["Compute", "计算"],
                t(
                  `$x = \\frac{(${qTex(r)})(${qTex(qConj(q))})}{${nq}} = \\frac{${qTex(qMul(r, qConj(q)))}}{${nq}} = ${qTex(x)}$.`,
                  `$x = \\frac{(${qTex(r)})(${qTex(qConj(q))})}{${nq}} = \\frac{${qTex(qMul(r, qConj(q)))}}{${nq}} = ${qTex(x)}$。`,
                ),
              ],
            ],
            t(`$(${qTex(x)})(${qTex(q)}) = ${qTex(r)}$.`, `$(${qTex(x)})(${qTex(q)}) = ${qTex(r)}$。`),
          ),
        });
      },
    },
  ],
};

/** vectorSpacesOverFiniteFields counts vectors, subspaces and bases over ℤₚ. */
export const vectorSpacesOverFiniteFields: TopicDef = {
  id: "vector-spaces-over-finite-fields",
  title: t("Vector Spaces Over Finite Fields", "有限域上的向量空间"),
  summary: t(
    "Vector spaces can be defined over any field, including ℤₚ. A k-dimensional space over ℤₚ has pᵏ vectors, since each vector is a unique combination of k basis vectors with coefficients in ℤₚ. Counting choices of independent vectors, ℤₚⁿ has (pⁿ − 1)(pⁿ − p)⋯(pⁿ − pⁿ⁻¹) ordered bases and (pⁿ − 1)/(p − 1) one-dimensional subspaces.",
    "向量空间可以定义在任意域上，包括 ℤₚ。ℤₚ 上的 k 维空间有 pᵏ 个向量，因为每个向量都唯一地是 k 个基向量以 ℤₚ 中元素为系数的组合。对线性无关向量的选择计数，ℤₚⁿ 有 (pⁿ − 1)(pⁿ − p)⋯(pⁿ − pⁿ⁻¹) 个有序基与 (pⁿ − 1)/(p − 1) 个一维子空间。",
  ),
  intro: t(
    "$\\mathbb{Z}_2^3$ has $2^3 = 8$ vectors, and the span of $(1, 0, 1)$ and $(0, 1, 1)$ has $2^2 = 4$: $0$, $(1, 0, 1)$, $(0, 1, 1)$ and $(1, 1, 0)$.\n\nCheck: $(1, 0, 1) + (0, 1, 1) = (1, 1, 2) = (1, 1, 0)$ in $\\mathbb{Z}_2$.\n\nIn this lesson we count vectors, subspaces and bases over $\\mathbb{Z}_p$.",
    "$\\mathbb{Z}_2^3$ 有 $2^3 = 8$ 个向量，$(1, 0, 1)$ 与 $(0, 1, 1)$ 的张成有 $2^2 = 4$ 个：$0$、$(1, 0, 1)$、$(0, 1, 1)$ 与 $(1, 1, 0)$。\n\n检验：在 $\\mathbb{Z}_2$ 中 $(1, 0, 1) + (0, 1, 1) = (1, 1, 2) = (1, 1, 0)$。\n\n本课我们数 $\\mathbb{Z}_p$ 上的向量、子空间与基。",
  ),
  prerequisites: ["dimension-in-abstract-vector-spaces", "introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-vectors-in-spans-over-zp",
      title: t("Sizes of spans", "张成空间的大小"),
      explanation: t(
        "Each vector in the span is fixed by one choice of coefficient for each basis vector, so a space of a given dimension has that power of the field size. In $\\mathbb{Z}_3^4$, the span of two linearly independent vectors is a $2$-dimensional subspace with $3^2 = 9$ vectors.\n\nIn $\\mathbb{Z}_5^6$, the span of $4$ linearly independent vectors has $5^4 = 625$ vectors.\n\nCheck: $5^4 = 25 \\cdot 25 = 625$, fewer than the $5^6 = 15625$ vectors of the whole space.\n\n> **Watch out.** Independence matters: in $\\mathbb{Z}_5^2$, $(2, 4) = 2(1, 2)$, so the span of $(1, 2)$ and $(2, 4)$ is a line with only $5$ vectors.",
        "张成空间中的每个向量由每个基向量的一个系数选择确定，所以一定维数的空间所含向量数是域大小的相应次幂。在 $\\mathbb{Z}_3^4$ 中，两个线性无关向量的张成空间是 $2$ 维子空间，有 $3^2 = 9$ 个向量。\n\n在 $\\mathbb{Z}_5^6$ 中，$4$ 个线性无关向量的张成有 $5^4 = 625$ 个向量。\n\n检验：$5^4 = 25 \\cdot 25 = 625$，少于整个空间的 $5^6 = 15625$ 个向量。\n\n> **注意。** 线性无关很重要：在 $\\mathbb{Z}_5^2$ 中 $(2, 4) = 2(1, 2)$，所以 $(1, 2)$ 与 $(2, 4)$ 的张成只是一条含 $5$ 个向量的直线。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const n = rng.int(3, 5);
        const k = rng.int(1, n);
        const value = p ** k;
        return numberProblem({
          prompt: t(
            `In $${zTex(p)}^{${n}}$, how many vectors are in the span of ${k} linearly independent vectors?`,
            `在 $${zTex(p)}^{${n}}$ 中，${k} 个线性无关向量的张成空间有多少个向量？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(p ** n, `That is the whole space; the span has dimension $${k}$.`, `这是整个空间；张成的维数是 $${k}$。`),
            why(
              k * p,
              `Choices multiply: $${p}$ choices for each of the $${k}$ coefficients.`,
              `选择数要相乘：$${k}$ 个系数各有 $${p}$ 种选择。`,
            ),
            why(k ** p, "The base and the exponent are swapped.", "底数与指数颠倒了。"),
            why(p ** k - 1, "The span includes the zero vector.", "张成空间包含零向量。"),
          ]),
          solution: walked(
            [
              [
                ["Find the dimension", "求维数"],
                k === 1
                  ? t("A single nonzero vector spans a line, of dimension $1$.", "单个非零向量张成一条直线，维数为 $1$。")
                  : t(
                      `The $${k}$ vectors are a basis of their span, which has dimension $${k}$.`,
                      `这 $${k}$ 个向量是其张成空间的基，维数为 $${k}$。`,
                    ),
              ],
              [
                ["Count the coefficient choices", "数系数的选择"],
                k === 1
                  ? t(
                      `Each vector of the span is $cv_1$ for exactly one of the $${p}$ choices of $c \\in ${zTex(p)}$.`,
                      `张成中的每个向量恰对 $${p}$ 种 $c \\in ${zTex(p)}$ 之一写成 $cv_1$。`,
                    )
                  : t(
                      `Each vector is $c_1v_1 + \\dots + c_{${k}}v_{${k}}$ for a unique choice of $c_i \\in ${zTex(p)}$: $${p}^{${k}} = ${value}$.`,
                      `每个向量对唯一的一组 $c_i \\in ${zTex(p)}$ 写成 $c_1v_1 + \\dots + c_{${k}}v_{${k}}$：$${p}^{${k}} = ${value}$。`,
                    ),
              ],
            ],
            t(
              `$${value}$ is at most $${p}^{${n}} = ${p ** n}$, the size of the whole space, with equality only when $${k} = ${n}$.`,
              `$${value}$ 不超过整个空间的大小 $${p}^{${n}} = ${p ** n}$，仅当 $${k} = ${n}$ 时相等。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-subspaces-and-bases-over-zp",
      title: t("Counting subspaces and bases", "数子空间与基"),
      explanation: t(
        "In $\\mathbb{Z}_3^2$, an ordered basis $(v_1, v_2)$ has $9 - 1 = 8$ choices of $v_1 \\ne 0$ and $9 - 3 = 6$ choices of $v_2$ outside the span of $v_1$: $48$ ordered bases. Each of the $8$ nonzero vectors spans a line with $2$ nonzero vectors, so there are $4$ one-dimensional subspaces.\n\nIn $\\mathbb{Z}_2^3$ there are $7 \\cdot 6 \\cdot 4 = 168$ ordered bases and $\\frac{7}{1} = 7$ one-dimensional subspaces.\n\nCheck: the factors are $8 - 1 = 7$, $8 - 2 = 6$ and $8 - 4 = 4$.\n\n> **Watch out.** At each step the new vector must avoid the span of the earlier ones, which has $p^i$ vectors, not $i$.",
        "在 $\\mathbb{Z}_3^2$ 中，有序基 $(v_1, v_2)$ 中 $v_1 \\ne 0$ 有 $9 - 1 = 8$ 种选法，$v_2$ 不在 $v_1$ 的张成中有 $9 - 3 = 6$ 种：共 $48$ 个有序基。$8$ 个非零向量中每条直线含 $2$ 个，所以有 $4$ 个一维子空间。\n\n在 $\\mathbb{Z}_2^3$ 中有 $7 \\cdot 6 \\cdot 4 = 168$ 个有序基，$\\frac{7}{1} = 7$ 个一维子空间。\n\n检验：各因子为 $8 - 1 = 7$、$8 - 2 = 6$、$8 - 4 = 4$。\n\n> **注意。** 每一步新向量都要避开前面向量的张成，它含 $p^i$ 个向量，而不是 $i$ 个。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7, 11, 13]);
        const askBases = rng.bool();
        const n = askBases ? (p <= 5 ? rng.int(2, 3) : 2) : rng.int(2, 5);
        const factors = range(0, n - 1).map((i) => p ** n - p ** i);
        const value = askBases ? factors.reduce((a, b) => a * b, 1) : (p ** n - 1) / (p - 1);
        return numberProblem({
          prompt: askBases
            ? t(`How many ordered bases does $${zTex(p)}^{${n}}$ have?`, `$${zTex(p)}^{${n}}$ 有多少个有序基？`)
            : t(`How many one-dimensional subspaces does $${zTex(p)}^{${n}}$ have?`, `$${zTex(p)}^{${n}}$ 有多少个一维子空间？`),
          answer: value,
          mistakes: apart(
            value,
            askBases
              ? [
                  why(
                    (p ** n - 1) ** n,
                    "That lets every vector be any nonzero vector; each later vector must avoid the span of the earlier ones.",
                    "这让每个向量都可取任意非零向量；后面的向量必须避开前面向量的张成。",
                  ),
                  why(
                    factors.reduce((a, b) => a * b, 1) / n,
                    "Ordered bases are counted in order; do not divide by the number of vectors.",
                    "有序基按顺序计数；不要除以向量的个数。",
                  ),
                  why(p ** (n * n), "That counts every list of vectors, independent or not.", "这数的是所有向量组，不论是否线性无关。"),
                ]
              : [
                  why(
                    p ** n - 1,
                    `That counts nonzero vectors; each line contains $${p - 1}$ of them.`,
                    `这数的是非零向量；每条直线含其中 $${p - 1}$ 个。`,
                  ),
                  why(
                    p ** (n - 1),
                    `Divide the $${p ** n - 1}$ nonzero vectors by the $${p - 1}$ on each line.`,
                    `要用 $${p ** n - 1}$ 个非零向量除以每条直线上的 $${p - 1}$ 个。`,
                  ),
                  why(
                    n,
                    "There are more lines than coordinate axes: every nonzero vector spans one.",
                    "直线比坐标轴多：每个非零向量都张成一条。",
                  ),
                ],
          ),
          solution: askBases
            ? walked(
                [
                  [
                    ["Count the choices step by step", "逐步数选择"],
                    t(
                      `Each $v_{i + 1}$ is any of the $${p}^{${n}} - ${p}^{i}$ vectors outside the span of $v_1, \\dots, v_i$, which gives $${factors.join(", ")}$.`,
                      `每个 $v_{i + 1}$ 可取 $v_1, \\dots, v_i$ 的张成之外的 $${p}^{${n}} - ${p}^{i}$ 个向量之一，依次为 $${factors.join(", ")}$。`,
                    ),
                  ],
                  [["Multiply", "相乘"], t(`$${factors.join(" \\cdot ")} = ${value}$.`, `$${factors.join(" \\cdot ")} = ${value}$。`)],
                ],
                t(
                  `$\\frac{${value}}{${factors[0]}} = ${value / factors[0]!}$, the number of ways to complete a fixed nonzero $v_1$ to an ordered basis.`,
                  `$\\frac{${value}}{${factors[0]}} = ${value / factors[0]!}$，即把固定的非零 $v_1$ 补成有序基的方法数。`,
                ),
              )
            : walked(
                [
                  [
                    ["Count the nonzero vectors", "数非零向量"],
                    t(`$${p}^{${n}} - 1 = ${p ** n - 1}$.`, `$${p}^{${n}} - 1 = ${p ** n - 1}$。`),
                  ],
                  [
                    ["Divide by the vectors on each line", "除以每条直线上的向量数"],
                    t(
                      `Each nonzero vector lies on exactly one line, and each line has $${p - 1}$ nonzero vectors: $\\frac{${p ** n - 1}}{${p - 1}} = ${value}$.`,
                      `每个非零向量恰在一条直线上，每条直线有 $${p - 1}$ 个非零向量：$\\frac{${p ** n - 1}}{${p - 1}} = ${value}$。`,
                    ),
                  ],
                ],
                t(
                  `$${range(0, n - 1)
                    .map((i) => pow(p, i))
                    .join(" + ")} = ${value}$, the geometric sum that $\\frac{${p}^{${n}} - 1}{${p} - 1}$ equals.`,
                  `$${range(0, n - 1)
                    .map((i) => pow(p, i))
                    .join(" + ")} = ${value}$，正是 $\\frac{${p}^{${n}} - 1}{${p} - 1}$ 所等于的等比数列之和。`,
                ),
              ),
        });
      },
    },
  ],
};

/** abstractAlgebraPolynomialTopics are the topics of Abstract Algebra on polynomial rings, irreducibility, quaternions and vector spaces over finite fields. */
export const abstractAlgebraPolynomialTopics: readonly TopicDef[] = [
  ringsOfPolynomials,
  unitsInPolynomialRings,
  theDivisionAlgorithmInRingsOfPolynomialsOverFiniteFields,
  theEuclidianAlgorithmInRingsOfPolynomials,
  theExtendedEuclidianAlgorithmInRingsOfPolynomials,
  irreduciblePolynomialsOverTheRealAndComplexNumbers,
  irreduciblePolynomialsOverTheIntegersAndRationalNumbers,
  irreduciblePolynomialsOverAFiniteField,
  reducibilityTestsForPolynomialsOverTheIntegersAndRationals,
  theDivisionRingOfQuaternions,
  invertingQuaternions,
  linearEquationsOverQuaternions,
  vectorSpacesOverFiniteFields,
];
