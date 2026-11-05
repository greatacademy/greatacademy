import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { type Fact, factProblem, gcd, mod, modInverse, texChoice } from "./abstract-algebra-common.ts";
import { polyTex } from "./abstract-algebra-rings.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 8, part 2: polynomial rings, irreducibility, quaternions; and vector spaces over finite fields.

/** Poly is a polynomial as its coefficients, constant term first, with no trailing zeros. */
type Poly = number[];

/** zTex writes ℤₙ. */
const zTex = (n: number) => `\\mathbb{Z}_{${n}}`;

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
  prerequisites: ["polynomial-quotient-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "multiplying-polynomials-over-zn",
      title: t("Multiplying over $\\mathbb{Z}_n$", "在 $\\mathbb{Z}_n$ 上相乘"),
      explanation: t(
        "Multiply the polynomials as usual and reduce every coefficient modulo the number at the end. In $\\mathbb{Z}_5[x]$, $(3x + 4)(2x^2 + x + 3) = 6x^3 + 11x^2 + 13x + 12 = x^3 + x^2 + 3x + 2$.",
        "照常把多项式相乘，最后把每个系数模这个数约化。在 $\\mathbb{Z}_5[x]$ 中，$(3x + 4)(2x^2 + x + 3) = 6x^3 + 11x^2 + 13x + 12 = x^3 + x^2 + 3x + 2$。",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const f = randomPoly(rng, rng.int(1, 2), n, false);
        const g = randomPoly(rng, 2, n, false);
        const prod = pMul(f, g, n);
        const i = rng.int(1, Math.max(1, deg(f) + deg(g) - 1));
        const value = prod[i] ?? 0;
        const raw = range(0, i).reduce((s, j) => s + (f[j] ?? 0) * (g[i - j] ?? 0), 0);
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}[x]$, find the coefficient of $x^{${i}}$ in $(${polyTex(f)})(${polyTex(g)})$, as an element of $\\{0, 1, \\dots, ${n - 1}\\}$.`,
            `在 $${zTex(n)}[x]$ 中，求 $(${polyTex(f)})(${polyTex(g)})$ 中 $x^{${i}}$ 的系数，用 $\\{0, 1, \\dots, ${n - 1}\\}$ 中的元素表示。`,
          ),
          answer: value,
          wrong: [raw, mod((f[i] ?? 0) * (g[i] ?? 0), n), mod(raw + 1, n)],
          solution: t(
            `The coefficient of $x^{${i}}$ is $\\sum_{j} a_j b_{${i} - j} = ${raw} \\equiv ${value} \\pmod{${n}}$.`,
            `$x^{${i}}$ 的系数为 $\\sum_{j} a_j b_{${i} - j} = ${raw} \\equiv ${value} \\pmod{${n}}$。`,
          ),
        });
      },
    },
    {
      id: "degrees-of-products-over-zn",
      title: t("Degrees of products", "乘积的次数"),
      explanation: t(
        "When the modulus is not prime, the leading coefficients can multiply to zero, so the degree of a product may drop. In $\\mathbb{Z}_6[x]$, $(2x^2 + 1)(3x + 1) = 6x^3 + 2x^2 + 3x + 1 = 2x^2 + 3x + 1$, which has degree $2$, not $3$: the leading coefficients $2$ and $3$ are zero divisors.",
        "当模不是素数时，首项系数相乘可能为零，所以乘积的次数可能会降低。在 $\\mathbb{Z}_6[x]$ 中，$(2x^2 + 1)(3x + 1) = 6x^3 + 2x^2 + 3x + 1 = 2x^2 + 3x + 1$，次数为 $2$ 而非 $3$：首项系数 $2$ 与 $3$ 是零因子。",
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
        const value = deg(pMul(f, g, n));
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}[x]$, what is the degree of $(${polyTex(f)})(${polyTex(g)})$?`,
            `在 $${zTex(n)}[x]$ 中，$(${polyTex(f)})(${polyTex(g)})$ 的次数是多少？`,
          ),
          answer: value,
          wrong: [deg(f) + deg(g), deg(f) * deg(g), Math.max(deg(f), deg(g))],
          solution: t(
            `Multiplying out and reducing modulo $${n}$ gives $${polyTex(pMul(f, g, n))}$, of degree $${value}$.`,
            `展开并模 $${n}$ 约化得 $${polyTex(pMul(f, g, n))}$，次数为 $${value}$。`,
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
  prerequisites: ["rings-of-polynomials", "the-units-of-a-ring"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-units-in-polynomial-rings",
      title: t("Recognizing units", "识别单位"),
      explanation: t(
        "In $\\mathbb{Z}_7[x]$, the units are the nonzero constants, so $3$ is a unit but $1 + x$ is not. In $\\mathbb{Z}_9[x]$, $1 + 3x$ is a unit: $(1 + 3x)(1 - 3x) = 1 - 9x^2 = 1$.",
        "在 $\\mathbb{Z}_7[x]$ 中，单位是非零常数，所以 $3$ 是单位而 $1 + x$ 不是。在 $\\mathbb{Z}_9[x]$ 中，$1 + 3x$ 是单位：$(1 + 3x)(1 - 3x) = 1 - 9x^2 = 1$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const q = rng.pick([3, 5, 7, 11, 13].filter((x) => x !== p));
        const n = p * p;
        const u = rng.pick(range(1, n - 1).filter((x) => x % p !== 0));
        const a = p * rng.int(1, p - 1);
        const b = rng.pick(range(1, n - 1).filter((x) => x % p !== 0));
        const c = rng.int(1, q - 1);
        const facts: Fact[] = [
          {
            prompt: t(`Is $${polyTex([u, a])}$ a unit of $${zTex(n)}[x]$?`, `$${polyTex([u, a])}$ 是 $${zTex(n)}[x]$ 的单位吗？`),
            holds: true,
            reason: t(
              `$${u}$ is a unit and $${a}$ is nilpotent: $${a}^2 = ${a * a} \\equiv 0 \\pmod{${n}}$.`,
              `$${u}$ 是单位且 $${a}$ 是幂零元：$${a}^2 = ${a * a} \\equiv 0 \\pmod{${n}}$。`,
            ),
          },
          {
            prompt: t(`Is $${polyTex([u, b])}$ a unit of $${zTex(n)}[x]$?`, `$${polyTex([u, b])}$ 是 $${zTex(n)}[x]$ 的单位吗？`),
            holds: false,
            reason: t(
              `The coefficient $${b}$ of $x$ is not nilpotent modulo $${n}$, since $${p} \\nmid ${b}$.`,
              `$x$ 的系数 $${b}$ 模 $${n}$ 不是幂零元，因为 $${p} \\nmid ${b}$。`,
            ),
          },
          {
            prompt: t(`Is $${polyTex([a, u])}$ a unit of $${zTex(n)}[x]$?`, `$${polyTex([a, u])}$ 是 $${zTex(n)}[x]$ 的单位吗？`),
            holds: false,
            reason: t(`Its constant term $${a}$ is not a unit modulo $${n}$.`, `它的常数项 $${a}$ 模 $${n}$ 不是单位。`),
          },
          {
            prompt: t(`Is $${polyTex([c, c])}$ a unit of $${zTex(q)}[x]$?`, `$${polyTex([c, c])}$ 是 $${zTex(q)}[x]$ 的单位吗？`),
            holds: false,
            reason: t(
              `$${zTex(q)}$ is a field, so the units of $${zTex(q)}[x]$ are the nonzero constants; this polynomial has degree $1$.`,
              `$${zTex(q)}$ 是域，所以 $${zTex(q)}[x]$ 的单位是非零常数；此多项式次数为 $1$。`,
            ),
          },
          {
            prompt: t(`Is $${c}$ a unit of $${zTex(q)}[x]$?`, `$${c}$ 是 $${zTex(q)}[x]$ 的单位吗？`),
            holds: true,
            reason: t(
              `$${c} \\cdot ${modInverse(c, q)} = 1$ in $${zTex(q)}$.`,
              `在 $${zTex(q)}$ 中 $${c} \\cdot ${modInverse(c, q)} = 1$。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "inverting-unit-polynomials",
      title: t("Inverting unit polynomials", "求单位多项式的逆"),
      explanation: t(
        "A polynomial whose constant term is a unit and whose other coefficients are nilpotent is invertible, using a finite geometric series. In $\\mathbb{Z}_{25}[x]$, $f = 2 + 5x$ has $5^2 = 0$, so try $f^{-1} = 2^{-1} - 2^{-2} \\cdot 5x = 13 - 169 \\cdot 5x = 13 - 20x = 13 + 5x$. Check: $(2 + 5x)(13 + 5x) = 26 + 75x + 25x^2 = 1$.",
        "常数项是单位、其他系数都是幂零元的多项式是可逆的，可以用有限项的几何级数求出逆。在 $\\mathbb{Z}_{25}[x]$ 中，$f = 2 + 5x$ 满足 $5^2 = 0$，试 $f^{-1} = 2^{-1} - 2^{-2} \\cdot 5x = 13 - 169 \\cdot 5x = 13 - 20x = 13 + 5x$。验证：$(2 + 5x)(13 + 5x) = 26 + 75x + 25x^2 = 1$。",
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
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}[x]$, $${polyTex([u, a])}$ is a unit with inverse $r + sx$, where $r, s \\in \\{0, \\dots, ${n - 1}\\}$. Find $${askX ? "s" : "r"}$.`,
            `在 $${zTex(n)}[x]$ 中，$${polyTex([u, a])}$ 是单位，其逆为 $r + sx$，$r, s \\in \\{0, \\dots, ${n - 1}\\}$。求 $${askX ? "s" : "r"}$。`,
          ),
          answer: askX ? c1 : c0,
          wrong: askX ? [mod(-a, n), a, mod(-ui * a, n)] : [u, mod(-u, n), 1],
          solution: t(
            `Since $${a}^2 \\equiv 0$, the inverse is $${u}^{-1} - ${u}^{-2} \\cdot ${a}x = ${c0} + ${c1}x$: $(${polyTex([u, a])})(${polyTex([c0, c1])}) \\equiv 1 \\pmod{${n}}$.`,
            `由于 $${a}^2 \\equiv 0$，逆为 $${u}^{-1} - ${u}^{-2} \\cdot ${a}x = ${c0} + ${c1}x$：$(${polyTex([u, a])})(${polyTex([c0, c1])}) \\equiv 1 \\pmod{${n}}$。`,
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
  prerequisites: ["units-in-polynomial-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "remainders-on-division-by-linear-polynomials",
      title: t("Dividing by x − c", "除以 x − c"),
      explanation: t(
        "The remainder theorem says that dividing by the variable minus a constant leaves the value of the polynomial at that constant. Over $\\mathbb{Z}_7$, dividing $x^4 + 3x + 2$ by $x - 2$ leaves $2^4 + 3 \\cdot 2 + 2 = 24 \\equiv 3$.",
        "余式定理说，除以变量减去一个常数，余式就是多项式在这个常数处的值。在 $\\mathbb{Z}_7$ 上，$x^4 + 3x + 2$ 除以 $x - 2$ 的余数为 $2^4 + 3 \\cdot 2 + 2 = 24 \\equiv 3$。",
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
          wrong: [mod(evalPoly(f, -c), p), mod(raw + 1, p), mod(f[0]!, p)],
          solution: t(
            `By the remainder theorem the remainder is $f(${c}) = ${raw} \\equiv ${value} \\pmod{${p}}$.`,
            `由余数定理，余数为 $f(${c}) = ${raw} \\equiv ${value} \\pmod{${p}}$。`,
          ),
        });
      },
    },
    {
      id: "dividing-polynomials-over-zp",
      title: t("Long division over $\\mathbb{Z}_p$", "在 $\\mathbb{Z}_p$ 上做长除法"),
      explanation: t(
        "Long division works over a prime modulus because the leading coefficient of the divisor has an inverse there. Over $\\mathbb{Z}_5$, divide $x^3 + 2x + 1$ by $2x^2 + 1$: $2^{-1} = 3$, so the first term of the quotient is $3x$; $x^3 + 2x + 1 - 3x(2x^2 + 1) = -x + 1 = 4x + 1$. So $q = 3x$ and $r = 4x + 1$.",
        "在素数模下长除法可行，因为除式的首项系数在那里有逆元。在 $\\mathbb{Z}_5$ 上，用 $2x^2 + 1$ 除 $x^3 + 2x + 1$：$2^{-1} = 3$，所以商的首项为 $3x$；$x^3 + 2x + 1 - 3x(2x^2 + 1) = -x + 1 = 4x + 1$。所以 $q = 3x$，$r = 4x + 1$。",
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
        return texChoice(
          rng,
          t(
            `In $${zTex(p)}[x]$, divide $${polyTex(f)}$ by $${polyTex(g)}$. What is the ${askQ ? "quotient" : "remainder"}?`,
            `在 $${zTex(p)}[x]$ 中，用 $${polyTex(g)}$ 除 $${polyTex(f)}$。${askQ ? "商" : "余式"}是什么？`,
          ),
          polyTex(right),
          wrongs.map((w) => polyTex(trim(w))),
          t(
            `Long division with $${g[2]}^{-1} = ${modInverse(g[2]!, p)}$ in $${zTex(p)}$ gives $${polyTex(f)} = (${polyTex(q)})(${polyTex(g)}) + ${r.length === 0 ? "0" : `(${polyTex(r)})`}$.`,
            `用 $${zTex(p)}$ 中的 $${g[2]}^{-1} = ${modInverse(g[2]!, p)}$ 做长除法，得 $${polyTex(f)} = (${polyTex(q)})(${polyTex(g)}) + ${r.length === 0 ? "0" : `(${polyTex(r)})`}$。`,
          ),
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
  prerequisites: ["the-division-algorithm-in-rings-of-polynomials-over-finite-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "gcds-of-polynomials-over-zp",
      title: t("Finding the gcd", "求最大公因式"),
      explanation: t(
        "The Euclidean algorithm works for polynomials over a field, dividing repeatedly until the remainder is zero. Over $\\mathbb{Z}_3$: $x^3 + x + 2 = x(x^2 + 2) + (2x + 2)$ and $x^2 + 2 = (2x + 2)(2x + 1) + 0$. The last nonzero remainder $2x + 2$, made monic, gives $\\gcd = x + 1$.",
        "欧几里得算法对域上的多项式同样适用，反复相除直到余式为零。在 $\\mathbb{Z}_3$ 上：$x^3 + x + 2 = x(x^2 + 2) + (2x + 2)$，$x^2 + 2 = (2x + 2)(2x + 1) + 0$。最后一个非零余式 $2x + 2$ 化为首一，得 $\\gcd = x + 1$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const [f, g, d] = polyPairWithGcd(rng, p, rng.int(1, 2));
        const right = pGcd(f, g, p);
        const wrong = [d.length === right.length ? [1] : d, pAdd(right, [1], p), f.length < g.length ? f : g, [1]];
        return texChoice(
          rng,
          t(
            `Find the monic greatest common divisor of $${polyTex(f)}$ and $${polyTex(g)}$ in $${zTex(p)}[x]$.`,
            `求 $${zTex(p)}[x]$ 中 $${polyTex(f)}$ 与 $${polyTex(g)}$ 的首一最大公因式。`,
          ),
          polyTex(right),
          wrong.map((w) => polyTex(trim(w))),
          t(
            `In the Euclidean algorithm ${euclidTrail(f, g, p).en}. The last nonzero divisor, made monic, is $${polyTex(right)}$.`,
            `在欧几里得算法中，${euclidTrail(f, g, p)["zh-CN"]}。最后一个非零除式化为首一后为 $${polyTex(right)}$。`,
          ),
        );
      },
    },
    {
      id: "degrees-of-gcds-over-zp",
      title: t("Degree of the gcd", "最大公因式的次数"),
      explanation: t(
        "Factoring both polynomials shows their common factors, whose product is the gcd, and its degree follows. Over $\\mathbb{Z}_2$, $x^3 + 1 = (x + 1)(x^2 + x + 1)$ and $x^2 + 1 = (x + 1)^2$, so $\\gcd(x^3 + 1, x^2 + 1) = x + 1$, of degree $1$.",
        "把两个多项式都因式分解，就能看出它们的公因式，公因式的乘积就是最大公因式，次数随之可知。在 $\\mathbb{Z}_2$ 上，$x^3 + 1 = (x + 1)(x^2 + x + 1)$，$x^2 + 1 = (x + 1)^2$，所以 $\\gcd(x^3 + 1, x^2 + 1) = x + 1$，次数为 $1$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const [f, g] = polyPairWithGcd(rng, p, rng.int(0, 2));
        const right = pGcd(f, g, p);
        return numberProblem({
          prompt: t(
            `What is the degree of $\\gcd(${polyTex(f)}, ${polyTex(g)})$ in $${zTex(p)}[x]$?`,
            `在 $${zTex(p)}[x]$ 中，$\\gcd(${polyTex(f)}, ${polyTex(g)})$ 的次数是多少？`,
          ),
          answer: deg(right),
          wrong: [Math.min(deg(f), deg(g)), deg(right) + 1, Math.abs(deg(f) - deg(g))],
          solution: t(
            `In the Euclidean algorithm ${euclidTrail(f, g, p).en}. The last nonzero divisor, made monic, gives $\\gcd = ${polyTex(right)}$, of degree $${deg(right)}$.`,
            `在欧几里得算法中，${euclidTrail(f, g, p)["zh-CN"]}。最后一个非零除式化为首一后给出 $\\gcd = ${polyTex(right)}$，次数为 $${deg(right)}$。`,
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
  prerequisites: ["the-euclidian-algorithm-in-rings-of-polynomials"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverses-in-polynomial-quotient-rings",
      title: t("Inverses modulo f", "模 f 的逆"),
      explanation: t(
        "Run the Euclidean algorithm on the polynomial and the modulus, then work backward to write one as a combination of them. In $\\mathbb{Z}_3[x]/\\langle x^2 + 1 \\rangle$: $x^2 + 1 = (x + 1)(x + 2) + 2$, so $1 = 2(x^2 + 1) - 2(x + 1)(x + 2)$, giving $(x + 1)^{-1} = -2(x + 2) = x + 2$. Check: $(x + 1)(x + 2) = x^2 + 2 = 1$.",
        "对这个多项式和模运行欧几里得算法，再倒推，把 1 写成它们的组合。在 $\\mathbb{Z}_3[x]/\\langle x^2 + 1 \\rangle$ 中：$x^2 + 1 = (x + 1)(x + 2) + 2$，所以 $1 = 2(x^2 + 1) - 2(x + 1)(x + 2)$，得 $(x + 1)^{-1} = -2(x + 2) = x + 2$。验证：$(x + 1)(x + 2) = x^2 + 2 = 1$。",
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
        return texChoice(
          rng,
          t(
            `In $${zTex(p)}[x]/\\langle ${polyTex(f)} \\rangle$, find the inverse of $${polyTex(g)}$.`,
            `在 $${zTex(p)}[x]/\\langle ${polyTex(f)} \\rangle$ 中，求 $${polyTex(g)}$ 的逆。`,
          ),
          polyTex(inv),
          wrongs.map((w) => polyTex(trim(w))),
          t(
            `The extended Euclidean algorithm gives $s(${polyTex(f)}) + t(${polyTex(g)}) = 1$ with $t = ${polyTex(inv)}$; indeed $(${polyTex(g)})(${polyTex(inv)}) \\equiv 1$.`,
            `扩展欧几里得算法给出 $s(${polyTex(f)}) + t(${polyTex(g)}) = 1$，其中 $t = ${polyTex(inv)}$；确实 $(${polyTex(g)})(${polyTex(inv)}) \\equiv 1$。`,
          ),
        );
      },
    },
    {
      id: "inverses-modulo-quadratics",
      title: t("Inverses modulo $x^2 - c$", "模 $x^2 - c$ 的逆"),
      explanation: t(
        "Multiplying by the conjugate turns the product into a constant, which is then inverted in the coefficient field. In $\\mathbb{Z}_7[x]/\\langle x^2 - 3 \\rangle$, $(2 + x)(2 - x) = 4 - 3 = 1$, so $(2 + x)^{-1} = 2 - x = 2 + 6x$.",
        "乘以共轭把乘积变成一个常数，再在系数域中对它求逆。在 $\\mathbb{Z}_7[x]/\\langle x^2 - 3 \\rangle$ 中，$(2 + x)(2 - x) = 4 - 3 = 1$，所以 $(2 + x)^{-1} = 2 - x = 2 + 6x$。",
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
        return numberProblem({
          prompt: t(
            `In $${zTex(p)}[x]/\\langle x^2 - ${c} \\rangle$, the inverse of $${polyTex([a, b])}$ is $r + sx$ with $r, s \\in ${zTex(p)}$. Find $${askS ? "s" : "r"}$.`,
            `在 $${zTex(p)}[x]/\\langle x^2 - ${c} \\rangle$ 中，$${polyTex([a, b])}$ 的逆为 $r + sx$，$r, s \\in ${zTex(p)}$。求 $${askS ? "s" : "r"}$。`,
          ),
          answer: askS ? s : r,
          wrong: askS ? [mod(-b, p), mod(b * ni, p), r] : [a, mod(a * nrm, p), s],
          solution: t(
            `$(${polyTex([a, b])})(${a} - ${b}x) = ${a}^2 - ${c} \\cdot ${b}^2 \\equiv ${nrm}$, and $${nrm}^{-1} = ${ni}$, so the inverse is $${ni}(${a} - ${b}x) = ${polyTex([r, s])}$.`,
            `$(${polyTex([a, b])})(${a} - ${b}x) = ${a}^2 - ${c} \\cdot ${b}^2 \\equiv ${nrm}$，且 $${nrm}^{-1} = ${ni}$，所以逆为 $${ni}(${a} - ${b}x) = ${polyTex([r, s])}$。`,
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
  prerequisites: ["rings-of-polynomials", "the-fundamental-theorem-of-algebra-with-quartic-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "irreducibility-over-r-and-c",
      title: t("Irreducible over $\\mathbb{R}$ or $\\mathbb{C}$?", "在 $\\mathbb{R}$ 或 $\\mathbb{C}$ 上不可约吗？"),
      explanation: t(
        "$x^2 + 2x + 5$ has discriminant $-16 < 0$, so it is irreducible over $\\mathbb{R}$; over $\\mathbb{C}$ it factors as $(x + 1 - 2i)(x + 1 + 2i)$. Every real polynomial of odd degree at least $3$ is reducible over $\\mathbb{R}$, since it has a real root.",
        "$x^2 + 2x + 5$ 的判别式为 $-16 < 0$，所以它在 $\\mathbb{R}$ 上不可约；在 $\\mathbb{C}$ 上分解为 $(x + 1 - 2i)(x + 1 + 2i)$。次数至少为 $3$ 的奇次实系数多项式在 $\\mathbb{R}$ 上都可约，因为它有实根。",
      ),
      generate(rng) {
        const b = rng.int(-6, 6);
        const c = rng.int(-9, 12);
        const disc = b * b - 4 * c;
        const f = polyTex([c, b, 1]);
        const cubic = polyTex([rng.int(-9, 9), rng.int(-5, 5), rng.int(-3, 3), 1]);
        const k = rng.int(1, 9);
        const r = rng.nonZero(-9, 9);
        const facts: Fact[] = [
          {
            prompt: t(
              `Is $${polyTex([k, 0, 1])}$ irreducible over $\\mathbb{R}$?`,
              `$${polyTex([k, 0, 1])}$ 在 $\\mathbb{R}$ 上不可约吗？`,
            ),
            holds: true,
            reason: t(
              `$x^2 + ${k} > 0$ for every real $x$, so it has no real roots, and a real quadratic without real roots is irreducible over $\\mathbb{R}$.`,
              `对每个实数 $x$ 都有 $x^2 + ${k} > 0$，所以它没有实根，而没有实根的实系数二次多项式在 $\\mathbb{R}$ 上不可约。`,
            ),
          },
          {
            prompt: t(`Is $${polyTex([r, 1])}$ irreducible over $\\mathbb{C}$?`, `$${polyTex([r, 1])}$ 在 $\\mathbb{C}$ 上不可约吗？`),
            holds: true,
            reason: t("A polynomial of degree $1$ is irreducible over every field.", "一次多项式在任何域上都不可约。"),
          },
          {
            prompt: t(`Is $${f}$ irreducible over $\\mathbb{R}$?`, `$${f}$ 在 $\\mathbb{R}$ 上不可约吗？`),
            holds: disc < 0,
            reason: t(
              `Its discriminant is $${b}^2 - 4 \\cdot ${c} = ${disc}$, which is ${disc < 0 ? "negative, so it has no real roots" : "not negative, so it has real roots"}.`,
              `它的判别式为 $${b}^2 - 4 \\cdot ${c} = ${disc}$，${disc < 0 ? "为负，所以没有实根" : "非负，所以有实根"}。`,
            ),
          },
          {
            prompt: t(`Is $${f}$ irreducible over $\\mathbb{C}$?`, `$${f}$ 在 $\\mathbb{C}$ 上不可约吗？`),
            holds: false,
            reason: t(
              "Over $\\mathbb{C}$ every polynomial of degree at least $2$ has a root, so it splits into linear factors.",
              "在 $\\mathbb{C}$ 上每个至少二次的多项式都有根，所以分解为一次因式之积。",
            ),
          },
          {
            prompt: t(`Is $${cubic}$ irreducible over $\\mathbb{R}$?`, `$${cubic}$ 在 $\\mathbb{R}$ 上不可约吗？`),
            holds: false,
            reason: t("A real cubic has a real root $r$, so $x - r$ is a factor.", "实系数三次多项式有实根 $r$，所以 $x - r$ 是因式。"),
          },
          {
            prompt: t(
              `Is $x^4 + ${Math.abs(c) + 1}$ irreducible over $\\mathbb{R}$?`,
              `$x^4 + ${Math.abs(c) + 1}$ 在 $\\mathbb{R}$ 上不可约吗？`,
            ),
            holds: false,
            reason: t(
              "Over $\\mathbb{R}$ the irreducible polynomials have degree at most $2$; this quartic is a product of two real quadratics.",
              "在 $\\mathbb{R}$ 上不可约多项式的次数至多为 $2$；这个四次多项式是两个实二次多项式之积。",
            ),
          },
        ];
        const holds = rng.bool();
        return factProblem(rng.pick(facts.filter((fact) => fact.holds === holds)));
      },
    },
    {
      id: "counting-irreducible-factors-over-r",
      title: t("Irreducible factors over $\\mathbb{R}$", "$\\mathbb{R}$ 上的不可约因式"),
      explanation: t(
        "Over the reals every polynomial factors into linear factors and quadratics without real roots, so count those pieces. $x^4 - 1 = (x - 1)(x + 1)(x^2 + 1)$ has $3$ irreducible factors over $\\mathbb{R}$ and $4$ over $\\mathbb{C}$.",
        "在实数上，每个多项式都能分解成一次因式和没有实根的二次因式，所以数出这些因式。$x^4 - 1 = (x - 1)(x + 1)(x^2 + 1)$ 在 $\\mathbb{R}$ 上有 $3$ 个不可约因式，在 $\\mathbb{C}$ 上有 $4$ 个。",
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
        return numberProblem({
          prompt: t(
            `$${polyTex(f)} = ${[...lins, ...quads].map((g) => `(${polyTex(g)})`).join("")}$. Counted with multiplicity, how many monic irreducible factors does it have over $${askC ? "\\mathbb{C}" : "\\mathbb{R}"}$?`,
            `$${polyTex(f)} = ${[...lins, ...quads].map((g) => `(${polyTex(g)})`).join("")}$。按重数计，它在 $${askC ? "\\mathbb{C}" : "\\mathbb{R}"}$ 上有多少个首一不可约因式？`,
          ),
          answer: value,
          wrong: [askC ? nLin + nQuad : nLin + 2 * nQuad, nLin, nLin + nQuad + 1],
          solution: t(
            askC
              ? `Over $\\mathbb{C}$ every factor splits into linear factors: $${nLin} + 2 \\cdot ${nQuad} = ${value}$.`
              : `The quadratic factors have negative discriminants, so they are irreducible over $\\mathbb{R}$: $${nLin} + ${nQuad} = ${value}$.`,
            askC
              ? `在 $\\mathbb{C}$ 上每个因式都分解为一次因式：$${nLin} + 2 \\cdot ${nQuad} = ${value}$。`
              : `二次因式的判别式为负，在 $\\mathbb{R}$ 上不可约：$${nLin} + ${nQuad} = ${value}$。`,
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
  prerequisites: ["irreducible-polynomials-over-the-real-and-complex-numbers", "the-rational-roots-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "irreducibility-of-cubics-over-q",
      title: t("Cubics over ℚ", "ℚ 上的三次多项式"),
      explanation: t(
        "$x^3 - 3x + 1$ is irreducible over $\\mathbb{Q}$: the only candidate rational roots are $\\pm 1$, and neither is a root. $2x^3 - x^2 - 2x + 1$ is reducible: $x = \\frac{1}{2}$ is a root.",
        "$x^3 - 3x + 1$ 在 $\\mathbb{Q}$ 上不可约：候选有理根只有 $\\pm 1$，都不是根。$2x^3 - x^2 - 2x + 1$ 可约：$x = \\frac{1}{2}$ 是根。",
      ),
      generate(rng) {
        let f: Poly;
        if (rng.bool()) {
          const lin = [rng.nonZero(-4, 4), rng.int(1, 3)];
          const quad = [rng.nonZero(-5, 5), rng.int(-4, 4), 1];
          f = expandInt([lin, quad]);
        } else {
          do f = [rng.nonZero(-9, 9), rng.int(-6, 6), rng.int(-5, 5), rng.int(1, 3)];
          while (hasRationalRoot(f));
        }
        const holds = !hasRationalRoot(f);
        return factProblem({
          prompt: t(`Is $${polyTex(f)}$ irreducible over $\\mathbb{Q}$?`, `$${polyTex(f)}$ 在 $\\mathbb{Q}$ 上不可约吗？`),
          holds,
          reason: holds
            ? t(
                `A cubic is reducible over $\\mathbb{Q}$ only if it has a rational root, and none of the candidates $\\pm \\frac{p}{q}$ with $p \\mid ${Math.abs(f[0]!)}$ and $q \\mid ${f[3]}$ is a root.`,
                `三次多项式在 $\\mathbb{Q}$ 上可约仅当它有有理根，而满足 $p \\mid ${Math.abs(f[0]!)}$、$q \\mid ${f[3]}$ 的候选 $\\pm \\frac{p}{q}$ 都不是根。`,
              )
            : t(
                "It has a rational root among the candidates of the rational roots theorem, which gives a linear factor.",
                "它在有理根定理的候选中有一个根，这给出一个一次因式。",
              ),
        });
      },
    },
    {
      id: "irreducibility-over-z-versus-q",
      title: t("Over $\\mathbb{Z}$ versus over $\\mathbb{Q}$", "$\\mathbb{Z}$ 上与 $\\mathbb{Q}$ 上"),
      explanation: t(
        "Over the integers a nonunit constant factor makes a polynomial reducible, while over the rationals constants are units and do not count. $6x + 9 = 3(2x + 3)$ is reducible over $\\mathbb{Z}$, since $3$ is not a unit of $\\mathbb{Z}$, but irreducible over $\\mathbb{Q}$, where $3$ is a unit.",
        "在整数上，非单位的常数因子会使多项式可约，而在有理数上常数都是单位，不算作因子。$6x + 9 = 3(2x + 3)$ 在 $\\mathbb{Z}$ 上可约，因为 $3$ 不是 $\\mathbb{Z}$ 的单位；但在 $\\mathbb{Q}$ 上不可约，因为 $3$ 在那里是单位。",
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
        const facts: Fact[] = [
          {
            prompt: t(`Is $${polyTex(f)}$ irreducible over $\\mathbb{Z}$?`, `$${polyTex(f)}$ 在 $\\mathbb{Z}$ 上不可约吗？`),
            holds: false,
            reason: t(
              `$${polyTex(f)} = ${c}(${polyTex(g)})$, and $${c}$ is not a unit of $\\mathbb{Z}$.`,
              `$${polyTex(f)} = ${c}(${polyTex(g)})$，而 $${c}$ 不是 $\\mathbb{Z}$ 的单位。`,
            ),
          },
          {
            prompt: t(`Is $${polyTex(f)}$ irreducible over $\\mathbb{Q}$?`, `$${polyTex(f)}$ 在 $\\mathbb{Q}$ 上不可约吗？`),
            holds: true,
            reason: t("Every polynomial of degree $1$ over a field is irreducible.", "域上每个一次多项式都不可约。"),
          },
          {
            prompt: t(`Is $${polyTex(cq)}$ irreducible over $\\mathbb{Q}$?`, `$${polyTex(cq)}$ 在 $\\mathbb{Q}$ 上不可约吗？`),
            holds: true,
            reason: t(
              "It has no real roots, so no rational roots, and a quadratic without roots in $\\mathbb{Q}$ is irreducible.",
              "它没有实根，因而没有有理根，而在 $\\mathbb{Q}$ 中无根的二次多项式不可约。",
            ),
          },
          {
            prompt: t(`Is $${polyTex(cq)}$ irreducible over $\\mathbb{Z}$?`, `$${polyTex(cq)}$ 在 $\\mathbb{Z}$ 上不可约吗？`),
            holds: false,
            reason: t(
              `$${polyTex(cq)} = ${c}(${polyTex(q)})$, and $${c}$ is not a unit of $\\mathbb{Z}$.`,
              `$${polyTex(cq)} = ${c}(${polyTex(q)})$，而 $${c}$ 不是 $\\mathbb{Z}$ 的单位。`,
            ),
          },
          {
            prompt: t(`Is $${polyTex(q)}$ irreducible over $\\mathbb{Z}$?`, `$${polyTex(q)}$ 在 $\\mathbb{Z}$ 上不可约吗？`),
            holds: true,
            reason: t(
              "It is primitive and irreducible over $\\mathbb{Q}$, so by Gauss's lemma it is irreducible over $\\mathbb{Z}$.",
              "它是本原多项式且在 $\\mathbb{Q}$ 上不可约，所以由高斯引理在 $\\mathbb{Z}$ 上不可约。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
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
        "Over $\\mathbb{Z}_3$, $x^3 + 2x + 1$ takes the values $1, 1, 1$ at $0, 1, 2$, so it has no root and, being a cubic, is irreducible.",
        "在 $\\mathbb{Z}_3$ 上，$x^3 + 2x + 1$ 在 $0, 1, 2$ 处的值为 $1, 1, 1$，所以无根，而它是三次多项式，因此不可约。",
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
        return factProblem({
          prompt: t(`Is $${polyTex(f)}$ irreducible over $${zTex(p)}$?`, `$${polyTex(f)}$ 在 $${zTex(p)}$ 上不可约吗？`),
          holds: want,
          reason:
            root >= 0
              ? t(`$f(${root}) = 0$, so $x - ${root}$ is a factor.`, `$f(${root}) = 0$，所以 $x - ${root}$ 是因式。`)
              : want
                ? t(
                    `Its values at $${range(0, p - 1).join(", ")}$ are $${values.join(", ")}$: no root${d === 4 ? ", and it is not divisible by any irreducible quadratic" : `, and a polynomial of degree $${d}$ without roots is irreducible`}.`,
                    `它在 $${range(0, p - 1).join(", ")}$ 处的值为 $${values.join(", ")}$：无根${d === 4 ? "，且不被任何不可约二次多项式整除" : `，而无根的 $${d}$ 次多项式不可约`}。`,
                  )
                : t("It has no root but is the product of two irreducible quadratics.", "它无根，但是两个不可约二次多项式之积。"),
        });
      },
    },
    {
      id: "counting-irreducible-polynomials-over-zp",
      title: t("Counting irreducibles", "数不可约多项式"),
      explanation: t(
        "Count all monic polynomials of the degree and subtract those that split into factors of lower degree. Over $\\mathbb{Z}_5$ there are $25$ monic quadratics; $5$ are squares $(x - a)^2$ and $\\binom{5}{2} = 10$ are $(x - a)(x - b)$ with $a \\ne b$, leaving $25 - 15 = 10 = \\frac{5^2 - 5}{2}$ irreducible ones. A reducible monic cubic is three linear factors, or a linear factor times an irreducible quadratic, and subtracting these leaves $\\frac{p^3 - p}{3}$. For quartics, the same subtraction leaves $\\frac{p^4 - p^2}{4}$.",
        "数出该次数的所有首一多项式，再减去那些能分解成更低次因式的多项式。在 $\\mathbb{Z}_5$ 上有 $25$ 个首一二次多项式；其中 $5$ 个是 $(x - a)^2$，$\\binom{5}{2} = 10$ 个是 $(x - a)(x - b)$（$a \\ne b$），余下 $25 - 15 = 10 = \\frac{5^2 - 5}{2}$ 个不可约。可约的首一三次多项式是三个一次因式之积，或一个一次因式与一个不可约二次因式之积，减去这些后余下 $\\frac{p^3 - p}{3}$ 个。对四次多项式，同样相减后余下 $\\frac{p^4 - p^2}{4}$ 个。",
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
        return numberProblem({
          prompt: t(
            `How many monic irreducible ${name} are there in $${zTex(p)}[x]$?`,
            `$${zTex(p)}[x]$ 中有多少个首一不可约${nameZh}次多项式？`,
          ),
          answer: value,
          wrong:
            d === 4
              ? [p ** 4 - p * p, Math.floor((p ** 4 - p) / 4), p ** 4 - p ** 3]
              : cubic
                ? [p ** 3 - p, (p ** 3 - p) / 2, p ** 3 - p * p]
                : [p * p - p, (p * (p + 1)) / 2, p * p - 2 * p],
          solution:
            d === 4
              ? t(
                  `Of the $${p ** 4}$ monic quartics, $${allLinear}$ are four linear factors, $${twoAndQuadratic}$ are two linear factors times an irreducible quadratic, $${twoQuadratics}$ are two irreducible quadratics and $${linearAndCubic}$ are a linear factor times an irreducible cubic. That leaves $${value}$.`,
                  `$${p ** 4}$ 个首一四次多项式中，$${allLinear}$ 个是四个一次因式之积，$${twoAndQuadratic}$ 个是两个一次因式与一个不可约二次因式之积，$${twoQuadratics}$ 个是两个不可约二次因式之积，$${linearAndCubic}$ 个是一个一次因式与一个不可约三次因式之积。余下 $${value}$ 个。`,
                )
              : cubic
                ? t(
                    `Of the $${p ** 3}$ monic cubics, $${threeLinear}$ are three linear factors and $${linearAndQuadratic}$ are a linear factor times an irreducible quadratic. That leaves $${value}$.`,
                    `$${p ** 3}$ 个首一三次多项式中，$${threeLinear}$ 个是三个一次因式之积，$${linearAndQuadratic}$ 个是一个一次因式与一个不可约二次因式之积。余下 $${value}$ 个。`,
                  )
                : t(
                    `Of the $${p * p}$ monic quadratics, $${p}$ are $(x - a)^2$ and $${(p * (p - 1)) / 2}$ are $(x - a)(x - b)$ with $a \\ne b$, leaving $${value}$.`,
                    `$${p * p}$ 个首一二次多项式中，$${p}$ 个是 $(x - a)^2$，$${(p * (p - 1)) / 2}$ 个是 $(x - a)(x - b)$（$a \\ne b$），余下 $${value}$ 个。`,
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

/** reducibilityTestsForPolynomialsOverTheIntegersAndRationals applies Eisenstein's criterion and the mod p test. */
export const reducibilityTestsForPolynomialsOverTheIntegersAndRationals: TopicDef = {
  id: "reducibility-tests-for-polynomials-over-the-integers-and-rationals",
  title: t("Reducibility Tests for Polynomials Over the Integers and Rationals", "整数与有理数上多项式的可约性检验"),
  summary: t(
    "Eisenstein's criterion: if a prime p divides every coefficient of f ∈ ℤ[x] except the leading one, and p² does not divide the constant term, then f is irreducible over ℚ. The mod p test: if p does not divide the leading coefficient and f reduced modulo p is irreducible over ℤₚ with the same degree, then f is irreducible over ℚ.",
    "艾森斯坦判别法：若素数 p 整除 f ∈ ℤ[x] 除首项外的每个系数，且 p² 不整除常数项，则 f 在 ℚ 上不可约。模 p 检验：若 p 不整除首项系数，且 f 模 p 约化后在 ℤₚ 上不可约且次数不变，则 f 在 ℚ 上不可约。",
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
        "For $x^4 + 6x^2 - 9x + 12$, the prime $3$ divides $6, -9, 12$, does not divide the leading coefficient $1$, and $9 \\nmid 12$. So the polynomial is irreducible over $\\mathbb{Q}$.",
        "对 $x^4 + 6x^2 - 9x + 12$，素数 $3$ 整除 $6, -9, 12$，不整除首项系数 $1$，且 $9 \\nmid 12$。所以该多项式在 $\\mathbb{Q}$ 上不可约。",
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
        const value = ps[0]!;
        return numberProblem({
          prompt: t(
            `Eisenstein's criterion shows that $${polyTex(f)}$ is irreducible over $\\mathbb{Q}$ for exactly one prime $p$. Find $p$.`,
            `艾森斯坦判别法对恰好一个素数 $p$ 说明 $${polyTex(f)}$ 在 $\\mathbb{Q}$ 上不可约。求 $p$。`,
          ),
          answer: value,
          wrong: [2, 3, 5, 7].filter((x) => x !== value),
          solution: t(
            `$${value}$ divides every coefficient except the leading one $${f[f.length - 1]}$, and $${value}^2 = ${value * value}$ does not divide the constant term $${f[0]}$.`,
            `$${value}$ 整除除首项系数 $${f[f.length - 1]}$ 外的每个系数，且 $${value}^2 = ${value * value}$ 不整除常数项 $${f[0]}$。`,
          ),
        });
      },
    },
    {
      id: "applying-the-mod-p-irreducibility-test",
      title: t("The mod p test", "模 p 检验"),
      explanation: t(
        "$f = 3x^3 + 5x^2 + 7x + 1$ reduces modulo $2$ to $x^3 + x^2 + x + 1$, which has the root $1$, so the test with $p = 2$ is inconclusive. Modulo $3$ it is $2x^2 + x + 1$, but the degree dropped, so the test does not apply.",
        "$f = 3x^3 + 5x^2 + 7x + 1$ 模 $2$ 约化为 $x^3 + x^2 + x + 1$，它有根 $1$，所以 $p = 2$ 的检验无结论。模 $3$ 得 $2x^2 + x + 1$，但次数下降了，所以检验不适用。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5]);
        const d = rng.int(2, 3);
        let f: Poly;
        do f = [...range(0, d - 1).map(() => rng.int(-9, 9)), rng.pick([1, 2, 3, 5].filter((x) => x % p !== 0))];
        while (f[0] === 0);
        const fbar = f.map((c) => mod(c, p));
        const irr = irreducibleMod(fbar, p);
        return factProblem({
          prompt: t(
            `Reduce $f = ${polyTex(f)}$ modulo $${p}$. Does the mod $${p}$ test prove that $f$ is irreducible over $\\mathbb{Q}$?`,
            `把 $f = ${polyTex(f)}$ 模 $${p}$ 约化。模 $${p}$ 检验能否证明 $f$ 在 $\\mathbb{Q}$ 上不可约？`,
          ),
          holds: irr,
          reason: irr
            ? t(
                `$\\bar f = ${polyTex(fbar)}$ has the same degree and no roots in $${zTex(p)}$, so it is irreducible there, and hence $f$ is irreducible over $\\mathbb{Q}$.`,
                `$\\bar f = ${polyTex(fbar)}$ 次数不变且在 $${zTex(p)}$ 中无根，所以在那里不可约，因此 $f$ 在 $\\mathbb{Q}$ 上不可约。`,
              )
            : t(
                `$\\bar f = ${polyTex(fbar)}$ has a root in $${zTex(p)}$, so the test proves nothing.`,
                `$\\bar f = ${polyTex(fbar)}$ 在 $${zTex(p)}$ 中有根，所以检验得不出结论。`,
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
  prerequisites: ["introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "multiplying-quaternion-units",
      title: t("Products of i, j, k", "i、j、k 的乘积"),
      explanation: t(
        "The quaternion units square to $-1$ and multiply cyclically, with the order reversed giving a minus sign. $jik = (ji)k = -k \\cdot k = -k^2 = 1$, and $i^3 j = (i^2)(ij) = -k$.",
        "四元数单位的平方都等于 $-1$，它们按循环顺序相乘，顺序反过来时会多出一个负号。$jik = (ji)k = -k \\cdot k = -k^2 = 1$，$i^3 j = (i^2)(ij) = -k$。",
      ),
      generate(rng) {
        const unitQ: Record<string, Quat> = { i: [0, 1, 0, 0], j: [0, 0, 1, 0], k: [0, 0, 0, 1] };
        const len = rng.int(3, 5);
        const word = range(1, len).map(() => rng.pick(["i", "j", "k"]));
        const value = word.reduce<Quat>((acc, u) => qMul(acc, unitQ[u]!), [1, 0, 0, 0]);
        const names = ["1", "-1", "i", "-i", "j", "-j", "k", "-k"];
        const right = qTex(value);
        const neg = qTex(value.map((x) => -x));
        return texChoice(
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
          t(
            `Multiply left to right using $ij = k$, $jk = i$, $ki = j$, the reversed products with a minus sign, and $i^2 = j^2 = k^2 = -1$: the result is $${right}$.`,
            `用 $ij = k$、$jk = i$、$ki = j$（反序乘积带负号）及 $i^2 = j^2 = k^2 = -1$ 从左到右相乘：结果为 $${right}$。`,
          ),
        );
      },
    },
    {
      id: "multiplying-quaternions",
      title: t("Multiplying quaternions", "四元数相乘"),
      explanation: t(
        "Expand the product term by term, keeping the order of the units because quaternion multiplication does not commute. $(1 + 2i)(3j - k) = 3j - k + 6ij - 2ik = 3j - k + 6k + 2j = 5j + 5k$.",
        "把乘积逐项展开，要保持各单位的顺序，因为四元数乘法不可交换。$(1 + 2i)(3j - k) = 3j - k + 6ij - 2ik = 3j - k + 6k + 2j = 5j + 5k$。",
      ),
      generate(rng) {
        const x = randomQuat(rng, 2);
        const y = randomQuat(rng, 2);
        const xy = qMul(x, y);
        const yx = qMul(y, x);
        const comp = rng.pick([0, 1, 2, 3].filter((c) => c === 0 || xy[c] !== yx[c]));
        return numberProblem({
          prompt: t(
            `Let $p = ${qTex(x)}$ and $q = ${qTex(y)}$. Find ${compOf(comp, "pq")[0]}.`,
            `设 $p = ${qTex(x)}$，$q = ${qTex(y)}$。求${compOf(comp, "pq")[1]}。`,
          ),
          answer: xy[comp]!,
          wrong: [yx[comp]!, x[comp]! * y[comp]!, -xy[comp]!],
          solution: t(`$pq = ${qTex(xy)}$ (while $qp = ${qTex(yx)}$).`, `$pq = ${qTex(xy)}$（而 $qp = ${qTex(yx)}$）。`),
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
  prerequisites: ["the-division-ring-of-quaternions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "norms-of-quaternions",
      title: t("Norms", "范数"),
      explanation: t(
        "The norm is the sum of the squares of the four components, and the norm of a product is the product of the norms. $N(2 - i + 3k) = 4 + 1 + 9 = 14$, and $N((1 + i)(2 - i + 3k)) = N(1 + i) \\cdot 14 = 28$.",
        "范数是四个分量的平方和，乘积的范数等于范数的乘积。$N(2 - i + 3k) = 4 + 1 + 9 = 14$，$N((1 + i)(2 - i + 3k)) = N(1 + i) \\cdot 14 = 28$。",
      ),
      generate(rng) {
        const x = randomQuat(rng);
        const product = rng.bool(0.4);
        const y = randomQuat(rng, 2);
        const value = product ? qNorm(x) * qNorm(y) : qNorm(x);
        return numberProblem({
          prompt: product
            ? t(`Find $N(pq)$ for $p = ${qTex(x)}$ and $q = ${qTex(y)}$.`, `设 $p = ${qTex(x)}$，$q = ${qTex(y)}$，求 $N(pq)$。`)
            : t(`Find the norm $N(q) = q\\bar q$ of $q = ${qTex(x)}$.`, `求 $q = ${qTex(x)}$ 的范数 $N(q) = q\\bar q$。`),
          answer: value,
          wrong: product
            ? [qNorm(x) + qNorm(y), qNorm(qMul(x, y)) + 1, x.reduce((s, a) => s + a, 0) * y.reduce((s, a) => s + a, 0)]
            : [x.reduce((s, a) => s + a, 0) ** 2, x[0]! ** 2 - x[1]! ** 2 - x[2]! ** 2 - x[3]! ** 2, value + 1],
          solution: product
            ? t(
                `The norm is multiplicative: $N(p)N(q) = ${qNorm(x)} \\cdot ${qNorm(y)} = ${value}$.`,
                `范数可乘：$N(p)N(q) = ${qNorm(x)} \\cdot ${qNorm(y)} = ${value}$。`,
              )
            : t(
                `$N(q) = ${x.map((a) => `${a < 0 ? `(${a})` : a}^2`).join(" + ")} = ${value}$.`,
                `$N(q) = ${x.map((a) => `${a < 0 ? `(${a})` : a}^2`).join(" + ")} = ${value}$。`,
              ),
        });
      },
    },
    {
      id: "inverses-of-quaternions",
      title: t("Inverses", "逆"),
      explanation: t(
        "A quaternion times its conjugate equals its norm, so the inverse is the conjugate divided by the norm. $(1 + 2j - k)^{-1} = \\frac{1 - 2j + k}{1 + 4 + 1} = \\frac{1}{6} - \\frac{1}{3}j + \\frac{1}{6}k$.",
        "四元数乘以它的共轭等于它的范数，所以逆元就是共轭除以范数。$(1 + 2j - k)^{-1} = \\frac{1 - 2j + k}{1 + 4 + 1} = \\frac{1}{6} - \\frac{1}{3}j + \\frac{1}{6}k$。",
      ),
      generate(rng) {
        const x = randomQuat(rng);
        const nrm = qNorm(x);
        // A component that is zero stays zero in the inverse, so it would test nothing.
        const comp = rng.pick([0, 1, 2, 3].filter((i) => x[i] !== 0));
        const c = qConj(x)[comp]!;
        return numberProblem({
          prompt: t(`Find ${compOf(comp, `(${qTex(x)})^{-1}`)[0]}.`, `求${compOf(comp, `(${qTex(x)})^{-1}`)[1]}。`),
          answer: Q.of(c, nrm),
          wrong: [Q.of(-c, nrm), Q.of(x[comp]!, nrm), Q.of(c, Math.round(Math.sqrt(nrm)) || 1)],
          solution: t(
            `$q^{-1} = \\frac{\\bar q}{N(q)} = \\frac{${qTex(qConj(x))}}{${nrm}}$, so ${compOf(comp, "q^{-1}")[0]} is $${Q.of(c, nrm).toLatex()}$.`,
            `$q^{-1} = \\frac{\\bar q}{N(q)} = \\frac{${qTex(qConj(x))}}{${nrm}}$，所以${compOf(comp, "q^{-1}")[1]}为 $${Q.of(c, nrm).toLatex()}$。`,
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
  prerequisites: ["inverting-quaternions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-left-linear-equations-over-quaternions",
      title: t("Solving qx = r", "解 qx = r"),
      explanation: t(
        "When the unknown is on the right of the coefficient, multiply by the inverse of the coefficient on the left side. To solve $(1 + i)x = 2j$: $x = \\frac{(1 - i) \\cdot 2j}{2} = (1 - i)j = j - k$.",
        "当未知数在系数的右边时，在左边乘以系数的逆元。解 $(1 + i)x = 2j$：$x = \\frac{(1 - i) \\cdot 2j}{2} = (1 - i)j = j - k$。",
      ),
      generate(rng) {
        const q = randomQuat(rng, 2);
        const x = randomQuat(rng, 2);
        const r = qMul(q, x);
        const wrongX = qMul(qMul(r, qConj(q)), [1, 0, 0, 0]).map((v) => v / qNorm(q));
        const comp = rng.pick([0, 1, 2, 3].filter((c) => x[c] !== wrongX[c]).concat([1]));
        return numberProblem({
          prompt: t(
            `Solve $(${qTex(q)})x = ${qTex(r)}$ over the quaternions. Find ${compOf(comp, "x")[0]}.`,
            `在四元数上解 $(${qTex(q)})x = ${qTex(r)}$。求${compOf(comp, "x")[1]}。`,
          ),
          answer: x[comp]!,
          wrong: [Number.isInteger(wrongX[comp]) ? wrongX[comp]! : -x[comp]!, -x[comp]!, x[comp]! + 1],
          solution: t(
            `$x = q^{-1}r = \\frac{(${qTex(qConj(q))})(${qTex(r)})}{${qNorm(q)}} = ${qTex(x)}$.`,
            `$x = q^{-1}r = \\frac{(${qTex(qConj(q))})(${qTex(r)})}{${qNorm(q)}} = ${qTex(x)}$。`,
          ),
        });
      },
    },
    {
      id: "solving-right-linear-equations-over-quaternions",
      title: t("Solving xq = r", "解 xq = r"),
      explanation: t(
        "When the unknown is on the left of the coefficient, multiply by the inverse on the right, which can give a different answer. To solve $x(1 + i) = 2j$: $x = \\frac{2j(1 - i)}{2} = j(1 - i) = j + k$, not $j - k$ as for $(1 + i)x = 2j$.",
        "当未知数在系数的左边时，在右边乘以逆元，这可能给出不同的答案。解 $x(1 + i) = 2j$：$x = \\frac{2j(1 - i)}{2} = j(1 - i) = j + k$，而不是 $(1 + i)x = 2j$ 的解 $j - k$。",
      ),
      generate(rng) {
        const q = randomQuat(rng, 2);
        const x = randomQuat(rng, 2);
        const r = qMul(x, q);
        const wrongX = qMul(qConj(q), r).map((v) => v / qNorm(q));
        const comp = rng.pick([0, 1, 2, 3].filter((c) => x[c] !== wrongX[c]).concat([1]));
        return numberProblem({
          prompt: t(
            `Solve $x(${qTex(q)}) = ${qTex(r)}$ over the quaternions. Find ${compOf(comp, "x")[0]}.`,
            `在四元数上解 $x(${qTex(q)}) = ${qTex(r)}$。求${compOf(comp, "x")[1]}。`,
          ),
          answer: x[comp]!,
          wrong: [Number.isInteger(wrongX[comp]) ? wrongX[comp]! : -x[comp]!, -x[comp]!, x[comp]! + 1],
          solution: t(
            `$x = rq^{-1} = \\frac{(${qTex(r)})(${qTex(qConj(q))})}{${qNorm(q)}} = ${qTex(x)}$.`,
            `$x = rq^{-1} = \\frac{(${qTex(r)})(${qTex(qConj(q))})}{${qNorm(q)}} = ${qTex(x)}$。`,
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
  prerequisites: ["dimension-in-abstract-vector-spaces", "introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-vectors-in-spans-over-zp",
      title: t("Sizes of spans", "张成空间的大小"),
      explanation: t(
        "Each vector in the span is fixed by one choice of coefficient for each basis vector, so a space of a given dimension has that power of the field size. In $\\mathbb{Z}_3^4$, the span of two linearly independent vectors is a $2$-dimensional subspace with $3^2 = 9$ vectors.",
        "张成空间中的每个向量由每个基向量的一个系数选择确定，所以一定维数的空间所含向量数是域大小的相应次幂。在 $\\mathbb{Z}_3^4$ 中，两个线性无关向量的张成空间是 $2$ 维子空间，有 $3^2 = 9$ 个向量。",
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
          wrong: [p ** n, k * p, k ** p, p ** k - 1].filter((x) => x !== value),
          solution: t(
            `The span has dimension $${k}$, and each vector is $c_1v_1 + \\dots + c_{${k}}v_{${k}}$ for a unique choice of $c_i \\in ${zTex(p)}$: $${p}^{${k}} = ${value}$.`,
            `张成空间维数为 $${k}$，每个向量对唯一的一组 $c_i \\in ${zTex(p)}$ 写成 $c_1v_1 + \\dots + c_{${k}}v_{${k}}$：$${p}^{${k}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "counting-subspaces-and-bases-over-zp",
      title: t("Counting subspaces and bases", "数子空间与基"),
      explanation: t(
        "In $\\mathbb{Z}_3^2$, an ordered basis $(v_1, v_2)$ has $9 - 1 = 8$ choices of $v_1 \\ne 0$ and $9 - 3 = 6$ choices of $v_2$ outside the span of $v_1$: $48$ ordered bases. Each of the $8$ nonzero vectors spans a line with $2$ nonzero vectors, so there are $4$ one-dimensional subspaces.",
        "在 $\\mathbb{Z}_3^2$ 中，有序基 $(v_1, v_2)$ 中 $v_1 \\ne 0$ 有 $9 - 1 = 8$ 种选法，$v_2$ 不在 $v_1$ 的张成中有 $9 - 3 = 6$ 种：共 $48$ 个有序基。$8$ 个非零向量中每条直线含 $2$ 个，所以有 $4$ 个一维子空间。",
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
          wrong: askBases ? [(p ** n - 1) ** n, factors.reduce((a, b) => a * b, 1) / n, p ** (n * n)] : [p ** n - 1, p ** (n - 1), n],
          solution: askBases
            ? t(
                `Each $v_{i + 1}$ is any of the $${p}^{${n}} - ${p}^{i}$ vectors outside the span of $v_1, \\dots, v_i$: $${factors.join(" \\cdot ")} = ${value}$.`,
                `每个 $v_{i + 1}$ 可取 $v_1, \\dots, v_i$ 的张成之外的 $${p}^{${n}} - ${p}^{i}$ 个向量之一：$${factors.join(" \\cdot ")} = ${value}$。`,
              )
            : t(
                `Each of the $${p ** n - 1}$ nonzero vectors lies on exactly one line, and each line has $${p - 1}$ nonzero vectors: $\\frac{${p ** n - 1}}{${p - 1}} = ${value}$.`,
                `$${p ** n - 1}$ 个非零向量中每个恰在一条直线上，每条直线有 $${p - 1}$ 个非零向量：$\\frac{${p ** n - 1}}{${p - 1}} = ${value}$。`,
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
