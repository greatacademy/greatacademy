import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { multivariableDrawings7 } from "../explanation-drawings-multivariable-7.ts";
import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** asQ turns a number into a rational number so that values can be compared. */
const asQ = (c: number | Q): Q => (typeof c === "number" ? Q.of(c) : c);

/** times writes a factor followed by a multiplication sign, leaving out a factor of 1. */
const times = (k: number): string => (k === 1 ? "" : `${k} \\cdot `);

/** distinct drops the mistakes whose value is the answer or repeats an earlier one. */
function distinct<M extends { readonly value: number | Q }>(answer: number | Q, mistakes: readonly M[]): M[] {
  return mistakes.filter((m, i, all) => !asQ(m.value).eq(asQ(answer)) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
}

// ---------------------------------------------------------------------------
// 5.24 Parametric Surfaces
// ---------------------------------------------------------------------------

/** parametricSurfaces introduces vector equations for 2D surfaces in 3D space. */
export const parametricSurfaces: TopicDef = {
  id: "parametric-surfaces",
  title: t("Parametric Surfaces", "参数曲面"),
  summary: t(
    "A parametric surface in space is described by r(u, v) = ⟨x(u, v), y(u, v), z(u, v)⟩ as (u, v) varies over a domain D.",
    "空间中的参数曲面由向量函数 r(u, v) = ⟨x(u, v), y(u, v), z(u, v)⟩ 在参数区域 D 上的变动所描述。",
  ),
  intro: t(
    "Which point of the surface $\\mathbf{r}(u, v) = \\langle u + v, u - v, 2u \\rangle$ has parameters $(u, v) = (1, 2)$? Substituting gives $x = 1 + 2 = 3$, $y = 1 - 2 = -1$ and $z = 2$, so the point is $(3, -1, 2)$.\n\nCheck: $x + y = 2u = z$ for every $(u, v)$, so the surface is the plane $z = x + y$, and indeed $3 + (-1) = 2$.\n\nIn this lesson we evaluate parametric surfaces at given parameters, go back from a point to its parameters, and recognize the surface a parametrization describes.",
    "曲面 $\\mathbf{r}(u, v) = \\langle u + v, u - v, 2u \\rangle$ 上参数为 $(u, v) = (1, 2)$ 的点是哪个？代入得 $x = 1 + 2 = 3$，$y = 1 - 2 = -1$，$z = 2$，所以该点为 $(3, -1, 2)$。\n\n检验：对每个 $(u, v)$ 都有 $x + y = 2u = z$，所以曲面是平面 $z = x + y$，而 $3 + (-1) = 2$ 确实成立。\n\n本课我们在给定参数处计算参数曲面上的点，由点反求参数，并识别参数化所描述的曲面。",
  ),
  prerequisites: ["tangent-planes-to-surfaces"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-and-identifying-parametric-surfaces",
      title: t("Evaluating and identifying parametric surfaces", "计算并识别参数曲面"),
      explanation: t(
        "A parametric surface assigns a point in space to each pair of parameters, and eliminating the parameters often reveals a familiar equation. A parametric surface $\\mathbf{r}(u, v) = \\langle x(u, v), y(u, v), z(u, v) \\rangle$ maps pairs $(u, v) \\in D$ to points in $\\mathbb{R}^3$. For example, $\\mathbf{r}(u, v) = \\langle a u, b v, c u + d v \\rangle$ describes a plane. For $\\langle 10u, v, u + 11v \\rangle$ at $(u, v) = (1, 1)$, the point is $(10, 1, 12)$.\n\n> **Watch out.** Each coordinate has its own formula: the $z$-coordinate comes from the third component alone, with $u$ and $v$ each in its own place, and its two terms are added.",
        "参数曲面给每一对参数指定空间中的一个点，消去参数常常能得到熟悉的方程。参数曲面 $\\mathbf{r}(u, v) = \\langle x(u, v), y(u, v), z(u, v) \\rangle$ 将参数对 $(u, v) \\in D$ 映射到 $\\mathbb{R}^3$ 中的空间点。例如 $\\mathbf{r}(u, v) = \\langle a u, b v, c u + d v \\rangle$ 描述一个平面。对 $\\langle 10u, v, u + 11v \\rangle$，在 $(u, v) = (1, 1)$ 处的点为 $(10, 1, 12)$。\n\n> **注意。** 每个坐标有自己的公式：$z$ 坐标只来自第三个分量，$u$ 与 $v$ 各在自己的位置上，两项要相加。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const d = rng.int(2, 9);
        const u0 = rng.int(1, 6);
        const v0 = rng.int(1, 6);
        const z = c * u0 + d * v0;
        return numberProblem({
          prompt: t(
            `Find the $z$-coordinate of the point on the parametric surface $\\mathbf{r}(u, v) = \\langle ${a}u, ${b}v, ${c}u + ${d}v \\rangle$ corresponding to $(u, v) = (${u0}, ${v0})$.`,
            `求参数曲面 $\\mathbf{r}(u, v) = \\langle ${a}u, ${b}v, ${c}u + ${d}v \\rangle$ 在参数 $(u, v) = (${u0}, ${v0})$ 处对应空间点的 $z$ 坐标。`,
          ),
          answer: z,
          mistakes: distinct(z, [
            why(
              a * u0,
              "That is the $x$-coordinate; the $z$-coordinate comes from the third component.",
              "那是 $x$ 坐标；$z$ 坐标来自第三个分量。",
            ),
            why(
              b * v0,
              "That is the $y$-coordinate; the $z$-coordinate comes from the third component.",
              "那是 $y$ 坐标；$z$ 坐标来自第三个分量。",
            ),
            why(c * v0 + d * u0, "That swaps $u$ and $v$ in the third component.", "那是在第三个分量中把 $u$ 和 $v$ 对调了。"),
            why(
              c * u0 * d * v0,
              "That multiplies the two terms of the third component; they are added.",
              "那是把第三个分量的两项相乘；它们应相加。",
            ),
          ]),
          solution: walked(
            [
              [["Take the third component", "取第三个分量"], t(`$z(u, v) = ${c}u + ${d}v$.`, `$z(u, v) = ${c}u + ${d}v$。`)],
              [
                ["Substitute", "代入"],
                t(
                  `$z(${u0}, ${v0}) = ${c} \\cdot ${u0} + ${d} \\cdot ${v0} = ${c * u0} + ${d * v0} = ${z}$.`,
                  `$z(${u0}, ${v0}) = ${c} \\cdot ${u0} + ${d} \\cdot ${v0} = ${c * u0} + ${d * v0} = ${z}$。`,
                ),
              ],
            ],
            t(
              `The point is $(${a * u0}, ${b * v0}, ${z})$. Since $u = \\frac{x}{${a}}$ and $v = \\frac{y}{${b}}$, the surface is the plane $z = \\frac{${c}}{${a}}x + \\frac{${d}}{${b}}y$, and $\\frac{${c}}{${a}} \\cdot ${a * u0} + \\frac{${d}}{${b}} \\cdot ${b * v0} = ${z}$.`,
              `该点为 $(${a * u0}, ${b * v0}, ${z})$。由于 $u = \\frac{x}{${a}}$，$v = \\frac{y}{${b}}$，曲面是平面 $z = \\frac{${c}}{${a}}x + \\frac{${d}}{${b}}y$，而 $\\frac{${c}}{${a}} \\cdot ${a * u0} + \\frac{${d}}{${b}} \\cdot ${b * v0} = ${z}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "locating-a-point-by-inverting-the-parametrization",
      title: t("Locating a point by inverting the parametrization", "反解参数确定点的位置"),
      explanation: t(
        "To find the point of a parametric surface above a given $(x, y)$, solve the first two coordinate equations for the parameters and substitute them into the third. For $\\mathbf{r}(u, v) = \\langle au, bv, u^2 + v^2 \\rangle$, the point above $(X, Y)$ has $u = \\frac{X}{a}$ and $v = \\frac{Y}{b}$, so its height is $z = \\left(\\frac{X}{a}\\right)^2 + \\left(\\frac{Y}{b}\\right)^2$. This is also how a parametrization is turned into a Cartesian equation. For $\\langle 6u, 7v, u^2 + v^2 \\rangle$ above $(12, -7)$, $u = 2$ and $v = -1$, so $z = 4 + 1 = 5$.\n\n> **Watch out.** The third component is written in $u$ and $v$, not in $x$ and $y$: find the parameters first, and only then square them.",
        "要求参数曲面在给定 $(x, y)$ 上方的点，先由前两个坐标方程解出参数，再代入第三个。对 $\\mathbf{r}(u, v) = \\langle au, bv, u^2 + v^2 \\rangle$，$(X, Y)$ 上方的点有 $u = \\frac{X}{a}$，$v = \\frac{Y}{b}$，所以高度为 $z = \\left(\\frac{X}{a}\\right)^2 + \\left(\\frac{Y}{b}\\right)^2$。这也是把参数化转化为直角坐标方程的方法。对 $\\langle 6u, 7v, u^2 + v^2 \\rangle$ 在 $(12, -7)$ 上方，$u = 2$，$v = -1$，所以 $z = 4 + 1 = 5$。\n\n> **注意。** 第三个分量是用 $u$ 和 $v$ 写的，而不是 $x$ 和 $y$：先求出参数，再把它们平方。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 5);
        const b = rng.int(2, 5);
        const u0 = rng.nonZero(-3, 3);
        const v0 = rng.int(-3, 3);
        const X = a * u0;
        const Y = b * v0;
        const ans = u0 * u0 + v0 * v0;
        return numberProblem({
          prompt: t(
            `The surface $\\mathbf{r}(u, v) = \\langle ${a}u, ${b}v, u^2 + v^2 \\rangle$ passes over the point $(${X}, ${Y})$ of the $xy$-plane. Find the height $z$ of the surface there.`,
            `曲面 $\\mathbf{r}(u, v) = \\langle ${a}u, ${b}v, u^2 + v^2 \\rangle$ 经过 $xy$ 平面上点 $(${X}, ${Y})$ 的上方。求曲面在那里的高度 $z$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              X * X + Y * Y,
              "That squares $x$ and $y$ themselves; the third component uses the parameters $u$ and $v$.",
              "那是把 $x$ 和 $y$ 本身平方；第三个分量用的是参数 $u$ 和 $v$。",
            ),
            why(
              a * u0 * u0 + b * v0 * v0,
              `That keeps the coefficients $${a}$ and $${b}$ on the squares; the height is $u^2 + v^2$.`,
              `那是在平方项上保留了系数 $${a}$ 和 $${b}$；高度是 $u^2 + v^2$。`,
            ),
            why(
              Math.abs(u0) + Math.abs(v0),
              "That adds the sizes of $u$ and $v$ without squaring them.",
              "那是把 $u$ 与 $v$ 的大小相加而没有平方。",
            ),
          ]),
          solution: walked(
            [
              [["Solve for u", "求 u"], t(`$${a}u = ${X}$ gives $u = ${u0}$.`, `$${a}u = ${X}$ 给出 $u = ${u0}$。`)],
              [["Solve for v", "求 v"], t(`$${b}v = ${Y}$ gives $v = ${v0}$.`, `$${b}v = ${Y}$ 给出 $v = ${v0}$。`)],
              [
                ["Substitute", "代入"],
                t(`$z = ${paren(u0)}^2 + ${paren(v0)}^2 = ${ans}$.`, `$z = ${paren(u0)}^2 + ${paren(v0)}^2 = ${ans}$。`),
              ],
            ],
            t(
              `In Cartesian form the surface is $z = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$, and at $(${X}, ${Y})$ this is $\\frac{${X * X}}{${a * a}} + \\frac{${Y * Y}}{${b * b}} = ${u0 * u0} + ${v0 * v0} = ${ans}$.`,
              `化为直角坐标方程，曲面为 $z = \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}}$，在 $(${X}, ${Y})$ 处为 $\\frac{${X * X}}{${a * a}} + \\frac{${Y * Y}}{${b * b}} = ${u0 * u0} + ${v0 * v0} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tangentPlanesToParametricSurfaces finds tangent vectors and the surface normal. */
export const tangentPlanesToParametricSurfaces: TopicDef = {
  id: "tangent-planes-to-parametric-surfaces",
  title: t("Tangent Planes to Parametric Surfaces", "参数曲面的切平面"),
  summary: t(
    "The tangent vectors $\\mathbf{r}_u$ and $\\mathbf{r}_v$ span the tangent plane to a parametric surface; their cross product $\\mathbf{r}_u \\times \\mathbf{r}_v$ is a (not necessarily unit) normal vector.",
    "切向量 $\\mathbf{r}_u$ 与 $\\mathbf{r}_v$ 张成参数曲面的切平面；它们的叉积 $\\mathbf{r}_u \\times \\mathbf{r}_v$ 是一个（不一定是单位的）法向量。",
  ),
  intro: t(
    "Find a normal vector to $\\mathbf{r}(u, v) = \\langle u, v, uv \\rangle$ at $(u, v) = (1, 2)$. The tangent vectors are $\\mathbf{r}_u = \\langle 1, 0, v \\rangle = \\langle 1, 0, 2 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, u \\rangle = \\langle 0, 1, 1 \\rangle$, and their cross product is $\\mathbf{n} = \\langle -2, -1, 1 \\rangle$.\n\nCheck: $\\mathbf{n} \\cdot \\mathbf{r}_u = -2 + 0 + 2 = 0$ and $\\mathbf{n} \\cdot \\mathbf{r}_v = 0 - 1 + 1 = 0$, so $\\mathbf{n}$ is perpendicular to both tangent vectors.\n\nIn this lesson we find tangent vectors and normal vectors of parametric surfaces, and use them to write tangent planes.",
    "求 $\\mathbf{r}(u, v) = \\langle u, v, uv \\rangle$ 在 $(u, v) = (1, 2)$ 处的一个法向量。切向量为 $\\mathbf{r}_u = \\langle 1, 0, v \\rangle = \\langle 1, 0, 2 \\rangle$ 与 $\\mathbf{r}_v = \\langle 0, 1, u \\rangle = \\langle 0, 1, 1 \\rangle$，它们的叉积为 $\\mathbf{n} = \\langle -2, -1, 1 \\rangle$。\n\n检验：$\\mathbf{n} \\cdot \\mathbf{r}_u = -2 + 0 + 2 = 0$，$\\mathbf{n} \\cdot \\mathbf{r}_v = 0 - 1 + 1 = 0$，所以 $\\mathbf{n}$ 与两个切向量都垂直。\n\n本课我们求参数曲面的切向量与法向量，并用它们写出切平面。",
  ),
  prerequisites: ["parametric-surfaces"],
  encompasses: [{ topic: "parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-normal-vectors-and-tangent-planes-for-parametric-surfaces",
      figure:
        multivariableDrawings7["tangent-planes-to-parametric-surfaces#finding-normal-vectors-and-tangent-planes-for-parametric-surfaces"],
      title: t("Finding normal vectors and tangent planes for parametric surfaces", "求参数曲面的法向量与切平面"),
      explanation: t(
        "The partial derivatives with respect to the two parameters are tangent to the surface, so their cross product is a normal vector. For $\\mathbf{r}(u, v) = \\langle u, v, a u^2 + b v^2 \\rangle$, the tangent vectors are $\\mathbf{r}_u = \\langle 1, 0, 2au \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, 2bv \\rangle$. The normal vector is $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -2au, -2bv, 1 \\rangle$. For $\\langle u, v, 7u^2 + v^2 \\rangle$ at $u = 1$, the $x$-component is $-14$.\n\n> **Watch out.** The $x$-component carries a minus sign and the factor $2$ from differentiating $u^2$; it depends on $u$ only, while the $y$-component depends on $v$.",
        "对两个参数的偏导数都与曲面相切，所以它们的叉积是一个法向量。对于 $\\mathbf{r}(u, v) = \\langle u, v, a u^2 + b v^2 \\rangle$，切向量为 $\\mathbf{r}_u = \\langle 1, 0, 2au \\rangle$ 和 $\\mathbf{r}_v = \\langle 0, 1, 2bv \\rangle$。其法向量为 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -2au, -2bv, 1 \\rangle$。对 $\\langle u, v, 7u^2 + v^2 \\rangle$ 在 $u = 1$ 处，$x$ 分量为 $-14$。\n\n> **注意。** $x$ 分量带负号，还有对 $u^2$ 求导得到的因子 $2$；它只依赖 $u$，而 $y$ 分量依赖 $v$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const u0 = rng.int(1, 5);
        const v0 = rng.int(1, 5);
        const nx = -2 * a * u0;
        const ca = a === 1 ? "" : `${a}`;
        const cb = b === 1 ? "" : `${b}`;
        return numberProblem({
          prompt: t(
            `For the parametric surface $\\mathbf{r}(u, v) = \\langle u, v, ${ca}u^2 + ${cb}v^2 \\rangle$, find the $x$-component of the normal vector $\\mathbf{n} = \\mathbf{r}_u \\times \\mathbf{r}_v$ at the point where $(u, v) = (${u0}, ${v0})$.`,
            `对于参数曲面 $\\mathbf{r}(u, v) = \\langle u, v, ${ca}u^2 + ${cb}v^2 \\rangle$，求在 $(u, v) = (${u0}, ${v0})$ 处法向量 $\\mathbf{n} = \\mathbf{r}_u \\times \\mathbf{r}_v$ 的 $x$ 分量。`,
          ),
          answer: nx,
          mistakes: distinct(nx, [
            why(
              -nx,
              "That has the wrong sign; the first component of $\\mathbf{r}_u \\times \\mathbf{r}_v$ is $0 \\cdot 2bv - 2au \\cdot 1$.",
              "那是符号错了；$\\mathbf{r}_u \\times \\mathbf{r}_v$ 的第一个分量是 $0 \\cdot 2bv - 2au \\cdot 1$。",
            ),
            why(-a * u0, "That drops the factor $2$ from the derivative of $u^2$.", "那是漏掉了 $u^2$ 求导得到的因子 $2$。"),
            why(-2 * b * v0, "That is the $y$-component, which comes from the $v^2$ term.", "那是 $y$ 分量，它来自 $v^2$ 项。"),
          ]),
          solution: walked(
            [
              [
                ["Find the tangent vectors", "求切向量"],
                t(
                  `$\\mathbf{r}_u = \\langle 1, 0, ${2 * a}u \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, ${2 * b}v \\rangle$.`,
                  `$\\mathbf{r}_u = \\langle 1, 0, ${2 * a}u \\rangle$，$\\mathbf{r}_v = \\langle 0, 1, ${2 * b}v \\rangle$。`,
                ),
              ],
              [
                ["Take the cross product", "求叉积"],
                t(
                  `$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -${2 * a}u, -${2 * b}v, 1 \\rangle$.`,
                  `$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -${2 * a}u, -${2 * b}v, 1 \\rangle$。`,
                ),
              ],
              [
                ["Evaluate", "求值"],
                t(
                  `At $u = ${u0}$ the $x$-component is $-${2 * a} \\cdot ${u0} = ${nx}$.`,
                  `在 $u = ${u0}$ 处，$x$ 分量为 $-${2 * a} \\cdot ${u0} = ${nx}$。`,
                ),
              ],
            ],
            t(
              `At $(${u0}, ${v0})$, $\\mathbf{n} = \\langle ${nx}, ${-2 * b * v0}, 1 \\rangle$ and $\\mathbf{r}_u = \\langle 1, 0, ${2 * a * u0} \\rangle$, so $\\mathbf{n} \\cdot \\mathbf{r}_u = ${nx} + ${2 * a * u0} = 0$.`,
              `在 $(${u0}, ${v0})$ 处，$\\mathbf{n} = \\langle ${nx}, ${-2 * b * v0}, 1 \\rangle$，$\\mathbf{r}_u = \\langle 1, 0, ${2 * a * u0} \\rangle$，所以 $\\mathbf{n} \\cdot \\mathbf{r}_u = ${nx} + ${2 * a * u0} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "where-a-tangent-plane-meets-the-z-axis",
      title: t("Where a tangent plane meets the $z$-axis", "切平面与 $z$ 轴的交点"),
      explanation: t(
        "The tangent plane at $\\mathbf{r}(u_0, v_0)$ has normal $\\mathbf{n} = \\mathbf{r}_u \\times \\mathbf{r}_v$ and equation $\\mathbf{n} \\cdot (\\langle x, y, z \\rangle - \\mathbf{r}(u_0, v_0)) = 0$. For $\\mathbf{r}(u, v) = \\langle u + v, u - v, uv \\rangle$, $\\mathbf{r}_u = \\langle 1, 1, v \\rangle$ and $\\mathbf{r}_v = \\langle 1, -1, u \\rangle$, so\n\n$$\\mathbf{n} = \\langle u + v,\\ v - u,\\ -2 \\rangle.$$\n\nSetting $x = y = 0$ in the plane's equation gives the height at which it crosses the $z$-axis. At $(u, v) = (5, 1)$ the point is $(6, 4, 5)$ and $\\mathbf{n} = \\langle 6, -4, -2 \\rangle$, so $-36 + 16 - 2(z - 5) = 0$ and $z = -5$.\n\n> **Watch out.** The plane is tilted, so it does not cross the axis at the height $u_0v_0$ of the point; and after collecting terms, divide by the coefficient $-2$ of $z$.",
        "在 $\\mathbf{r}(u_0, v_0)$ 处的切平面法向量为 $\\mathbf{n} = \\mathbf{r}_u \\times \\mathbf{r}_v$，方程为 $\\mathbf{n} \\cdot (\\langle x, y, z \\rangle - \\mathbf{r}(u_0, v_0)) = 0$。对 $\\mathbf{r}(u, v) = \\langle u + v, u - v, uv \\rangle$，$\\mathbf{r}_u = \\langle 1, 1, v \\rangle$，$\\mathbf{r}_v = \\langle 1, -1, u \\rangle$，所以\n\n$$\\mathbf{n} = \\langle u + v,\\ v - u,\\ -2 \\rangle$$\n\n在平面方程中令 $x = y = 0$，就得到它与 $z$ 轴相交的高度。在 $(u, v) = (5, 1)$ 处，点为 $(6, 4, 5)$，$\\mathbf{n} = \\langle 6, -4, -2 \\rangle$，所以 $-36 + 16 - 2(z - 5) = 0$，$z = -5$。\n\n> **注意。** 平面是倾斜的，所以它与 $z$ 轴的交点不在切点的高度 $u_0v_0$；合并同类项之后，还要除以 $z$ 的系数 $-2$。",
      ),
      generate(rng: Rng): Problem {
        const u0 = rng.nonZero(-4, 4);
        const v0 = rng.nonZero(-4, 4);
        const P = [u0 + v0, u0 - v0, u0 * v0] as const;
        const n = [u0 + v0, v0 - u0, -2] as const;
        const ans = -u0 * v0;
        const first = -n[0] * P[0];
        const second = -n[1] * P[1];
        const pn = (k: number) => paren(k);
        return numberProblem({
          prompt: t(
            `Find the $z$-coordinate where the tangent plane to $\\mathbf{r}(u, v) = \\langle u + v, u - v, uv \\rangle$ at $(u, v) = (${u0}, ${v0})$ crosses the $z$-axis.`,
            `求 $\\mathbf{r}(u, v) = \\langle u + v, u - v, uv \\rangle$ 在 $(u, v) = (${u0}, ${v0})$ 处的切平面与 $z$ 轴交点的 $z$ 坐标。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              u0 * v0,
              "That is the height of the point of tangency; the tilted plane crosses the axis somewhere else.",
              "那是切点的高度；倾斜的平面与 $z$ 轴交于别处。",
            ),
            why(
              -2 * u0 * v0,
              "That forgets to divide by the coefficient of $z$ after collecting terms.",
              "那是合并同类项后忘了除以 $z$ 的系数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the point", "求切点"],
                t(`$\\mathbf{r}(${u0}, ${v0}) = (${P.join(", ")})$.`, `$\\mathbf{r}(${u0}, ${v0}) = (${P.join(", ")})$。`),
              ],
              [
                ["Find the normal", "求法向量"],
                t(`$\\mathbf{n} = \\langle ${n.join(", ")} \\rangle$.`, `$\\mathbf{n} = \\langle ${n.join(", ")} \\rangle$。`),
              ],
              [
                ["Set x = y = 0", "令 x = y = 0"],
                t(
                  `$${n[0]}(0 - ${pn(P[0])}) + ${pn(n[1])}(0 - ${pn(P[1])}) - 2(z - ${pn(P[2])}) = 0$, that is $${first} + ${pn(second)} - 2z + ${pn(2 * P[2])} = 0$.`,
                  `$${n[0]}(0 - ${pn(P[0])}) + ${pn(n[1])}(0 - ${pn(P[1])}) - 2(z - ${pn(P[2])}) = 0$，即 $${first} + ${pn(second)} - 2z + ${pn(2 * P[2])} = 0$。`,
                ),
              ],
              [
                ["Solve", "求解"],
                t(`$2z = ${first + second + 2 * P[2]}$, so $z = ${ans}$.`, `$2z = ${first + second + 2 * P[2]}$，所以 $z = ${ans}$。`),
              ],
            ],
            t(
              `Since $x^2 - y^2 = 4uv$, the surface is the graph $z = \\frac{x^2 - y^2}{4}$. Its tangent plane at $(${P[0]}, ${P[1]})$ meets the axis at $z_0 - x_0 f_x - y_0 f_y = ${P[2]} - \\frac{${P[0] * P[0]}}{2} + \\frac{${P[1] * P[1]}}{2} = ${ans}$.`,
              `由于 $x^2 - y^2 = 4uv$，曲面就是图像 $z = \\frac{x^2 - y^2}{4}$。它在 $(${P[0]}, ${P[1]})$ 处的切平面与 $z$ 轴交于 $z_0 - x_0 f_x - y_0 f_y = ${P[2]} - \\frac{${P[0] * P[0]}}{2} + \\frac{${P[1] * P[1]}}{2} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** parametrizationsOfEllipsoidsAndCones parameterizes quadric surfaces with angles. */
export const parametrizationsOfEllipsoidsAndCones: TopicDef = {
  id: "parametrizations-of-ellipsoids-and-cones",
  title: t("Parametrizations of Ellipsoids and Cones", "椭球面与锥面的参数化"),
  summary: t(
    "Ellipsoids are parametrized by generalized spherical coordinates, while cones are parametrized using radial distance and azimuth.",
    "椭球面通过推广的球坐标进行参数化，而锥面则使用径向距离与方位角参数化。",
  ),
  intro: t(
    "The ellipsoid $\\frac{x^2}{4} + \\frac{y^2}{9} + z^2 = 1$ is parametrized by $\\langle 2\\sin\\phi\\cos\\theta, 3\\sin\\phi\\sin\\theta, \\cos\\phi \\rangle$. At $\\phi = \\frac{\\pi}{2}$, $\\theta = \\frac{\\pi}{2}$ the point is $(0, 3, 0)$, the end of the longest axis.\n\nCheck: $\\frac{0}{4} + \\frac{9}{9} + 0 = 1$, so the point lies on the ellipsoid.\n\nIn this lesson we parametrize ellipsoids with stretched spherical coordinates and cones with a radius and an angle, and move between points and parameters.",
    "椭球面 $\\frac{x^2}{4} + \\frac{y^2}{9} + z^2 = 1$ 的参数化为 $\\langle 2\\sin\\phi\\cos\\theta, 3\\sin\\phi\\sin\\theta, \\cos\\phi \\rangle$。在 $\\phi = \\frac{\\pi}{2}$、$\\theta = \\frac{\\pi}{2}$ 处，点为 $(0, 3, 0)$，即最长轴的端点。\n\n检验：$\\frac{0}{4} + \\frac{9}{9} + 0 = 1$，所以该点在椭球面上。\n\n本课我们用拉伸的球坐标参数化椭球面，用半径和角度参数化锥面，并在点与参数之间来回转换。",
  ),
  prerequisites: ["parametric-surfaces"],
  encompasses: [{ topic: "parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "parameterizing-ellipsoidal-and-conical-surfaces",
      figure: multivariableDrawings7["parametrizations-of-ellipsoids-and-cones#parameterizing-ellipsoidal-and-conical-surfaces"],
      title: t("Parameterizing ellipsoidal and conical surfaces", "椭球面与锥面的参数方程表示"),
      explanation: t(
        "Use polar style parameters for the horizontal position, then express the height from the equation of the surface. A cone $z^2 = k^2(x^2 + y^2)$ can be parameterized by $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, k u \\rangle$ where $u \\ge 0$ is the radial distance and $v \\in [0, 2\\pi)$ is the angle. For $z = 10\\sqrt{x^2 + y^2}$, the point above $(7, 24)$ has $u = \\sqrt{49 + 576} = 25$ and height $250$.\n\n> **Watch out.** $u$ is the distance from the $z$-axis, not the height $ku$. If the horizontal part is stretched to $\\langle ku\\cos v, ku\\sin v \\rangle$, the height coefficient must absorb that factor $k$ too.",
        "用类似极坐标的参数表示水平位置，再由曲面方程表示出高度。圆锥面 $z^2 = k^2(x^2 + y^2)$ 可参数化为 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, k u \\rangle$，其中 $u \\ge 0$ 为径向距离，$v \\in [0, 2\\pi)$ 为方位角。对 $z = 10\\sqrt{x^2 + y^2}$，$(7, 24)$ 上方的点有 $u = \\sqrt{49 + 576} = 25$，高度为 $250$。\n\n> **注意。** $u$ 是到 $z$ 轴的距离，不是高度 $ku$。若水平部分拉伸为 $\\langle ku\\cos v, ku\\sin v \\rangle$，高度的系数也必须吸收这个因子 $k$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        if (rng.bool()) {
          // From a horizontal position to a height: u has to be recovered from x and y first.
          const [p, q, u] = rng.pick([
            [3, 4, 5],
            [5, 12, 13],
            [6, 8, 10],
            [8, 15, 17],
          ] as const);
          const x = p * rng.pick([1, -1]);
          const y = q * rng.pick([1, -1]);
          return numberProblem({
            prompt: t(
              `The cone $z = ${k}\\sqrt{x^2 + y^2}$ is parametrized by $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, ${k}u \\rangle$ with $u \\ge 0$. Which value of $u$ reaches the point of the cone above $(x, y) = (${x}, ${y})$?`,
              `锥面 $z = ${k}\\sqrt{x^2 + y^2}$ 的参数化为 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, ${k}u \\rangle$，其中 $u \\ge 0$。锥面上位于 $(x, y) = (${x}, ${y})$ 上方的点对应哪个 $u$ 值？`,
            ),
            answer: u,
            mistakes: distinct(u, [
              why(
                k * u,
                "That is the height $z = ku$ of the point; $u$ is its distance from the $z$-axis.",
                "那是该点的高度 $z = ku$；$u$ 是它到 $z$ 轴的距离。",
              ),
              why(u * u, "That is $x^2 + y^2 = u^2$; take the square root.", "那是 $x^2 + y^2 = u^2$；还要开平方。"),
              why(
                p + q,
                "That adds $|x|$ and $|y|$; the distance is $\\sqrt{x^2 + y^2}$.",
                "那是把 $|x|$ 与 $|y|$ 相加；距离是 $\\sqrt{x^2 + y^2}$。",
              ),
              why(
                Math.abs(x + y),
                "That adds the coordinates; the distance is $\\sqrt{x^2 + y^2}$.",
                "那是把坐标相加；距离是 $\\sqrt{x^2 + y^2}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Use the horizontal part", "用水平部分"],
                  t(
                    "$x^2 + y^2 = u^2(\\cos^2 v + \\sin^2 v) = u^2$, so $u$ is the distance from the $z$-axis.",
                    "$x^2 + y^2 = u^2(\\cos^2 v + \\sin^2 v) = u^2$，所以 $u$ 是到 $z$ 轴的距离。",
                  ),
                ],
                [["Compute", "计算"], t(`$u = \\sqrt{${x * x} + ${y * y}} = ${u}$.`, `$u = \\sqrt{${x * x} + ${y * y}} = ${u}$。`)],
              ],
              t(
                `With $u = ${u}$ the height is $${k} \\cdot ${u} = ${k * u}$, and $${k}\\sqrt{${x * x} + ${y * y}} = ${k * u}$ too, so the point is on the cone.`,
                `取 $u = ${u}$，高度为 $${k} \\cdot ${u} = ${k * u}$，而 $${k}\\sqrt{${x * x} + ${y * y}} = ${k * u}$ 也成立，所以该点在锥面上。`,
              ),
            ),
          });
        }
        // From the equation of the cone to the coefficient in the parametrization.
        const m = rng.int(2, 7);
        const c = m * m;
        return numberProblem({
          prompt: t(
            `The upper half of the cone $z^2 = ${c}(x^2 + y^2)$ is parametrized by $\\mathbf{r}(u, v) = \\langle ${k}u \\cos v, ${k}u \\sin v, Cu \\rangle$ with $u \\ge 0$. Find $C$.`,
            `锥面 $z^2 = ${c}(x^2 + y^2)$ 的上半部分的参数化为 $\\mathbf{r}(u, v) = \\langle ${k}u \\cos v, ${k}u \\sin v, Cu \\rangle$，其中 $u \\ge 0$。求 $C$。`,
          ),
          answer: k * m,
          solveFor: "C",
          mistakes: distinct(k * m, [
            why(
              m,
              `That ignores the factor $${k}$ in the horizontal part; the distance from the axis is $${k}u$.`,
              `那是忽略了水平部分中的因子 $${k}$；到轴的距离是 $${k}u$。`,
            ),
            why(
              c,
              `That uses $${c}$ without the square root; $z = \\sqrt{${c}} \\cdot ${k}u$.`,
              `那是没有对 $${c}$ 开平方；$z = \\sqrt{${c}} \\cdot ${k}u$。`,
            ),
            why(
              k * c,
              `That multiplies $${k}$ by $${c}$ instead of by its square root.`,
              `那是用 $${k}$ 乘以 $${c}$，而不是乘以它的平方根。`,
            ),
            why(k + m, "That adds the two factors; they multiply.", "那是把两个因子相加；它们应相乘。"),
          ]),
          solution: walked(
            [
              [["Horizontal part", "水平部分"], t(`$x^2 + y^2 = ${k * k}u^2$.`, `$x^2 + y^2 = ${k * k}u^2$。`)],
              [["Substitute", "代入"], t(`$z^2 = ${c} \\cdot ${k * k}u^2$.`, `$z^2 = ${c} \\cdot ${k * k}u^2$。`)],
              [
                ["Take the upper root", "取上半部分"],
                t(
                  `$z \\ge 0$ gives $z = ${m} \\cdot ${k}u = ${k * m}u$, so $C = ${k * m}$.`,
                  `由 $z \\ge 0$ 得 $z = ${m} \\cdot ${k}u = ${k * m}u$，所以 $C = ${k * m}$。`,
                ),
              ],
            ],
            t(
              `With $C = ${k * m}$, $z^2 = ${k * k * m * m}u^2$ and $${c}(x^2 + y^2) = ${c} \\cdot ${k * k}u^2 = ${k * k * m * m}u^2$.`,
              `取 $C = ${k * m}$，$z^2 = ${k * k * m * m}u^2$，而 $${c}(x^2 + y^2) = ${c} \\cdot ${k * k}u^2 = ${k * k * m * m}u^2$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-point-on-a-parametrized-ellipsoid",
      title: t("A point on a parametrized ellipsoid", "参数化椭球面上的点"),
      explanation: t(
        "The ellipsoid $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ is parametrized by stretching spherical coordinates:\n\n$$\\mathbf{r}(\\phi, \\theta) = \\langle a\\sin\\phi\\cos\\theta,\\ b\\sin\\phi\\sin\\theta,\\ c\\cos\\phi \\rangle, \\quad 0 \\le \\phi \\le \\pi,\\ 0 \\le \\theta \\le 2\\pi.$$\n\nHere $\\phi$ is measured down from the positive $z$-axis, so $\\phi = 0$ is the top, $\\phi = \\frac{\\pi}{2}$ the equator and $\\phi = \\pi$ the bottom. For $a = 7$, the point with $\\phi = \\frac{\\pi}{6}$, $\\theta = 0$ has $x = 7 \\cdot \\frac{1}{2} = \\frac{7}{2}$.\n\n> **Watch out.** Use the semi-axis that belongs to the coordinate, $a$ for $x$ and $c$ for $z$; and $\\cos\\theta = -1$ at $\\theta = \\pi$ turns the sign of $x$.",
        "椭球面 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ 由拉伸球坐标来参数化：\n\n$$\\mathbf{r}(\\phi, \\theta) = \\langle a\\sin\\phi\\cos\\theta,\\ b\\sin\\phi\\sin\\theta,\\ c\\cos\\phi \\rangle, \\quad 0 \\le \\phi \\le \\pi,\\ 0 \\le \\theta \\le 2\\pi$$\n\n这里 $\\phi$ 从正 $z$ 轴向下量起，所以 $\\phi = 0$ 是顶点，$\\phi = \\frac{\\pi}{2}$ 是赤道，$\\phi = \\pi$ 是底点。对 $a = 7$，$\\phi = \\frac{\\pi}{6}$、$\\theta = 0$ 的点有 $x = 7 \\cdot \\frac{1}{2} = \\frac{7}{2}$。\n\n> **注意。** 要用与坐标对应的半轴：$x$ 用 $a$，$z$ 用 $c$；在 $\\theta = \\pi$ 处 $\\cos\\theta = -1$，会使 $x$ 变号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 6);
        const c = rng.int(2, 6);
        const askZ = rng.int(0, 1) === 0;
        // Angles whose sine or cosine is rational: [label, value numerator, value denominator].
        const phis: [string, number, number][] = askZ
          ? [
              ["\\frac{\\pi}{3}", 1, 2],
              ["\\frac{2\\pi}{3}", -1, 2],
              ["\\frac{\\pi}{2}", 0, 1],
              ["\\pi", -1, 1],
            ]
          : [
              ["\\frac{\\pi}{6}", 1, 2],
              ["\\frac{5\\pi}{6}", 1, 2],
              ["\\frac{\\pi}{2}", 1, 1],
            ];
        const [lab, num, den] = rng.pick(phis);
        const back = !askZ && rng.int(0, 1) === 1;
        const th = back ? "\\pi" : "0";
        const ans = askZ ? Q.of(c * num, den) : Q.of((back ? -a : a) * num, den);
        const value = Q.of(num, den);
        const square = value.mul(value);
        const rest = Q.of(1).sub(square);
        const sym = askZ ? "z" : "x";
        const own = askZ ? c : a;
        return numberProblem({
          prompt: t(
            `The ellipsoid $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ is parametrized by $\\langle ${a}\\sin\\phi\\cos\\theta, ${b}\\sin\\phi\\sin\\theta, ${c}\\cos\\phi \\rangle$. Find the $${sym}$-coordinate of the point with $\\phi = ${lab}$, $\\theta = ${th}$.`,
            `椭球面 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ 的参数化为 $\\langle ${a}\\sin\\phi\\cos\\theta, ${b}\\sin\\phi\\sin\\theta, ${c}\\cos\\phi \\rangle$。求 $\\phi = ${lab}$、$\\theta = ${th}$ 对应点的 $${sym}$ 坐标。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              ans.neg(),
              askZ
                ? "That has the wrong sign; read the sign of $\\cos\\phi$ for this angle."
                : "That has the wrong sign; $\\cos 0 = 1$ and $\\cos\\pi = -1$.",
              askZ ? "那是符号错了；要看这个角的 $\\cos\\phi$ 的符号。" : "那是符号错了；$\\cos 0 = 1$，$\\cos\\pi = -1$。",
            ),
            why(
              Q.of(own),
              `That is the semi-axis $${own}$ alone; it is multiplied by the trigonometric factor.`,
              `那只是半轴 $${own}$；还要乘以三角函数因子。`,
            ),
            why(
              Q.of(b * num, den),
              `That uses the semi-axis $${b}$ of $y$; the $${sym}$-component uses $${own}$.`,
              `那是用了 $y$ 的半轴 $${b}$；$${sym}$ 分量用的是 $${own}$。`,
            ),
            why(
              Q.of((askZ ? a : c) * num, den),
              `That uses the semi-axis $${askZ ? a : c}$ of $${askZ ? "x" : "z"}$; the $${sym}$-component uses $${own}$.`,
              `那是用了 $${askZ ? "x" : "z"}$ 的半轴 $${askZ ? a : c}$；$${sym}$ 分量用的是 $${own}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Pick the component", "选取分量"],
                t(
                  `The $${sym}$-component is $${askZ ? `${c}\\cos\\phi` : `${a}\\sin\\phi\\cos\\theta`}$.`,
                  `$${sym}$ 分量为 $${askZ ? `${c}\\cos\\phi` : `${a}\\sin\\phi\\cos\\theta`}$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(
                  askZ
                    ? `$z = ${c}\\cos ${lab} = ${c} \\cdot ${paren(value)} = ${ans.toLatex()}$.`
                    : `$x = ${a}\\sin ${lab}\\cos ${th} = ${a} \\cdot ${value.toLatex()} \\cdot ${back ? "(-1)" : "1"} = ${ans.toLatex()}$.`,
                  askZ
                    ? `$z = ${c}\\cos ${lab} = ${c} \\cdot ${paren(value)} = ${ans.toLatex()}$。`
                    : `$x = ${a}\\sin ${lab}\\cos ${th} = ${a} \\cdot ${value.toLatex()} \\cdot ${back ? "(-1)" : "1"} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              askZ
                ? `With $\\theta = 0$ the point has $y = 0$, $\\left(\\frac{z}{${c}}\\right)^2 = ${square.toLatex()}$ and $\\left(\\frac{x}{${a}}\\right)^2 = \\sin^2 ${lab} = ${rest.toLatex()}$, which add to $1$, so it lies on the ellipsoid.`
                : `With $\\theta = ${th}$ the point has $y = 0$, $\\left(\\frac{x}{${a}}\\right)^2 = ${square.toLatex()}$ and $\\left(\\frac{z}{${c}}\\right)^2 = \\cos^2 ${lab} = ${rest.toLatex()}$, which add to $1$, so it lies on the ellipsoid.`,
              askZ
                ? `$\\theta = 0$ 时该点 $y = 0$，$\\left(\\frac{z}{${c}}\\right)^2 = ${square.toLatex()}$，$\\left(\\frac{x}{${a}}\\right)^2 = \\sin^2 ${lab} = ${rest.toLatex()}$，二者之和为 $1$，所以它在椭球面上。`
                : `$\\theta = ${th}$ 时该点 $y = 0$，$\\left(\\frac{x}{${a}}\\right)^2 = ${square.toLatex()}$，$\\left(\\frac{z}{${c}}\\right)^2 = \\cos^2 ${lab} = ${rest.toLatex()}$，二者之和为 $1$，所以它在椭球面上。`,
            ),
          ),
        });
      },
    },
  ],
};

/** parametrizationsOfParaboloidsAndHyperboloids parameterizes paraboloids and hyperboloids. */
export const parametrizationsOfParaboloidsAndHyperboloids: TopicDef = {
  id: "parametrizations-of-paraboloids-and-hyperboloids",
  title: t("Parametrizations of Paraboloids and Hyperboloids", "抛物面与双曲面的参数化"),
  summary: t(
    "A paraboloid $z = a(x^2 + y^2)$ is parametrized with polar coordinates as $\\mathbf{r}(u, v) = \\langle u\\cos v, u\\sin v, au^2 \\rangle$.",
    "旋转抛物面 $z = a(x^2 + y^2)$ 借助极坐标参数化为 $\\mathbf{r}(u, v) = \\langle u\\cos v, u\\sin v, au^2 \\rangle$。",
  ),
  intro: t(
    "Parametrize the paraboloid $z = x^2 + y^2$ and find its height at radius $3$. With $x = u\\cos v$ and $y = u\\sin v$, $x^2 + y^2 = u^2$, so $\\mathbf{r}(u, v) = \\langle u\\cos v, u\\sin v, u^2 \\rangle$, and at $u = 3$ the height is $9$.\n\nCheck: at $v = 0$ the point is $(3, 0, 9)$, and $3^2 + 0^2 = 9$.\n\nIn this lesson we parametrize paraboloids and hyperboloids with polar coordinates and read off heights and cross-sections.",
    "参数化抛物面 $z = x^2 + y^2$，并求它在半径 $3$ 处的高度。令 $x = u\\cos v$，$y = u\\sin v$，则 $x^2 + y^2 = u^2$，所以 $\\mathbf{r}(u, v) = \\langle u\\cos v, u\\sin v, u^2 \\rangle$，在 $u = 3$ 处高度为 $9$。\n\n检验：$v = 0$ 时点为 $(3, 0, 9)$，而 $3^2 + 0^2 = 9$。\n\n本课我们用极坐标参数化抛物面和双曲面，并读出高度与截面。",
  ),
  prerequisites: ["parametric-surfaces"],
  encompasses: [{ topic: "parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "parameterizing-paraboloids-and-hyperbolic-surfaces",
      title: t("Parameterizing paraboloids and hyperbolic surfaces", "抛物面与双曲面的极坐标参数化"),
      explanation: t(
        "Writing the horizontal coordinates in polar form makes the sum of their squares a single parameter squared, which simplifies the height. For a paraboloid $z = a(x^2 + y^2)$, setting $x = u \\cos v$ and $y = u \\sin v$ yields $z = a u^2$. The surface is $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, a u^2 \\rangle$. For $z = \\frac{1}{2}(x^2 + y^2)$ at $u = 4$, the height is $\\frac{1}{2} \\cdot 16 = 8$.\n\n> **Watch out.** Square $u$ but not $a$: the height is $a \\cdot u^2$, not $au$ and not $(au)^2$.",
        "把水平坐标写成极坐标形式，使它们的平方和变成一个参数的平方，从而化简高度。对于抛物面 $z = a(x^2 + y^2)$，令 $x = u \\cos v$，$y = u \\sin v$，可得 $z = a u^2$。参数方程为 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, a u^2 \\rangle$。对 $z = \\frac{1}{2}(x^2 + y^2)$ 在 $u = 4$ 处，高度为 $\\frac{1}{2} \\cdot 16 = 8$。\n\n> **注意。** 只把 $u$ 平方，不把 $a$ 平方：高度是 $a \\cdot u^2$，不是 $au$，也不是 $(au)^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const u = rng.int(2, 9);
        const z = a * u * u;
        return numberProblem({
          prompt: t(
            `For the paraboloid $z = ${a}(x^2 + y^2)$ parametrized by $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, ${a}u^2 \\rangle$, find the height $z$ when the radial parameter is $u = ${u}$.`,
            `对于由 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, ${a}u^2 \\rangle$ 参数化的抛物面 $z = ${a}(x^2 + y^2)$，当径向参数 $u = ${u}$ 时，求高度 $z$ 的值。`,
          ),
          answer: z,
          mistakes: distinct(z, [
            why(a * u, "That leaves $u$ unsquared; the height is $au^2$.", "那是没有把 $u$ 平方；高度是 $au^2$。"),
            why(a * a * u * u, `That squares $${a}$ as well; only $u$ is squared.`, `那是把 $${a}$ 也平方了；只有 $u$ 要平方。`),
            why(2 * a * u, "That is the slope $\\frac{dz}{du} = 2au$, not the height.", "那是斜率 $\\frac{dz}{du} = 2au$，不是高度。"),
          ]),
          solution: walked(
            [
              [["Take the third component", "取第三个分量"], t(`$z = ${a}u^2$.`, `$z = ${a}u^2$。`)],
              [
                ["Substitute", "代入"],
                t(`$z = ${a} \\cdot ${u}^2 = ${a} \\cdot ${u * u} = ${z}$.`, `$z = ${a} \\cdot ${u}^2 = ${a} \\cdot ${u * u} = ${z}$。`),
              ],
            ],
            t(
              `The point $(${u}\\cos v, ${u}\\sin v, ${z})$ has $x^2 + y^2 = ${u * u}$, and $${a} \\cdot ${u * u} = ${z}$, so it is on the paraboloid for every $v$.`,
              `点 $(${u}\\cos v, ${u}\\sin v, ${z})$ 满足 $x^2 + y^2 = ${u * u}$，而 $${a} \\cdot ${u * u} = ${z}$，所以对每个 $v$ 它都在抛物面上。`,
            ),
          ),
        });
      },
    },
    {
      id: "cross-sections-of-a-hyperboloid-of-one-sheet",
      figure: multivariableDrawings7["parametrizations-of-paraboloids-and-hyperboloids#cross-sections-of-a-hyperboloid-of-one-sheet"],
      title: t("Cross-sections of a hyperboloid of one sheet", "单叶双曲面的截面"),
      explanation: t(
        "The hyperboloid of one sheet $\\frac{x^2 + y^2}{a^2} - \\frac{z^2}{c^2} = 1$ is parametrized by\n\n$$\\mathbf{r}(u, v) = \\left\\langle a\\sqrt{1 + u^2}\\cos v,\\ a\\sqrt{1 + u^2}\\sin v,\\ cu \\right\\rangle.$$\n\nFixing $u$ fixes the height $z = cu$, and the cross-section there is a circle of radius $a\\sqrt{1 + u^2}$. The narrowest circle, of radius $a$, is the waist at $z = 0$, and the circles widen in both directions. For $\\frac{x^2 + y^2}{36} - \\frac{z^2}{4} = 1$ at $z = 2$, $u = 1$ and the radius squared is $36 \\cdot 2 = 72$.\n\n> **Watch out.** First find $u = \\frac{z}{c}$; the radius squared is $a^2(1 + u^2)$, larger than at the waist, not $a^2(u^2 - 1)$.",
        "单叶双曲面 $\\frac{x^2 + y^2}{a^2} - \\frac{z^2}{c^2} = 1$ 的参数化为\n\n$$\\mathbf{r}(u, v) = \\left\\langle a\\sqrt{1 + u^2}\\cos v,\\ a\\sqrt{1 + u^2}\\sin v,\\ cu \\right\\rangle$$\n\n固定 $u$ 就固定了高度 $z = cu$，那里的截面是半径为 $a\\sqrt{1 + u^2}$ 的圆。最窄的圆半径为 $a$，是 $z = 0$ 处的腰部，圆向上下两个方向逐渐变宽。对 $\\frac{x^2 + y^2}{36} - \\frac{z^2}{4} = 1$ 在 $z = 2$ 处，$u = 1$，半径的平方为 $36 \\cdot 2 = 72$。\n\n> **注意。** 先求 $u = \\frac{z}{c}$；半径的平方是 $a^2(1 + u^2)$，比腰部大，而不是 $a^2(u^2 - 1)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const c = rng.int(1, 4);
        const m = rng.nonZero(-3, 3);
        const h = m * c;
        const ans = a * a * (1 + m * m);
        return numberProblem({
          prompt: t(
            `The hyperboloid $\\frac{x^2 + y^2}{${a * a}} - \\frac{z^2}{${c * c}} = 1$ meets the plane $z = ${h}$ in a circle. Find the square of its radius.`,
            `双曲面 $\\frac{x^2 + y^2}{${a * a}} - \\frac{z^2}{${c * c}} = 1$ 与平面 $z = ${h}$ 相交于一个圆。求其半径的平方。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * a * (m * m - 1),
              "That subtracts the $1$; moving $\\frac{z^2}{c^2}$ across gives $1 + u^2$.",
              "那是减去了 $1$；把 $\\frac{z^2}{c^2}$ 移到另一边得到的是 $1 + u^2$。",
            ),
            why(
              a * a + h * h,
              `That adds $z^2 = ${h * h}$ directly; it must first be divided by $${c * c}$ and the result multiplied by $${a * a}$.`,
              `那是直接加上了 $z^2 = ${h * h}$；它要先除以 $${c * c}$，结果再乘以 $${a * a}$。`,
            ),
            why(
              a * a,
              "That is the waist at $z = 0$; the circles are wider at other heights.",
              "那是 $z = 0$ 处的腰部；在其他高度圆更宽。",
            ),
            why(
              a * a * (1 + h * h),
              `That uses $z = ${h}$ in place of $u = \\frac{z}{${c}}$.`,
              `那是用 $z = ${h}$ 代替了 $u = \\frac{z}{${c}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find u", "求 u"],
                t(`$z = ${c === 1 ? "" : c}u = ${h}$ gives $u = ${m}$.`, `由 $z = ${c === 1 ? "" : c}u = ${h}$ 得 $u = ${m}$。`),
              ],
              [
                ["Square the radius", "求半径的平方"],
                t(
                  `$x^2 + y^2 = ${a * a}(1 + u^2) = ${a * a}(1 + ${m * m}) = ${ans}$.`,
                  `$x^2 + y^2 = ${a * a}(1 + u^2) = ${a * a}(1 + ${m * m}) = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Substituting into the equation: $\\frac{${ans}}{${a * a}} - \\frac{${h * h}}{${c * c}} = ${1 + m * m} - ${m * m} = 1$.`,
              `代入方程：$\\frac{${ans}}{${a * a}} - \\frac{${h * h}}{${c * c}} = ${1 + m * m} - ${m * m} = 1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** parametrizationsOfCylinders parameterizes cylindrical surfaces. */
export const parametrizationsOfCylinders: TopicDef = {
  id: "parametrizations-of-cylinders",
  title: t("Parametrizations of Cylinders", "柱面的参数化"),
  summary: t(
    "A cylinder $x^2 + y^2 = R^2$ of height $H$ is parametrized by $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$ with $u \\in [0, 2\\pi]$ and $v \\in [0, H]$.",
    "半径为 $R$、高为 $H$ 的圆柱面 $x^2 + y^2 = R^2$ 可参数化为 $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$，其中 $u \\in [0, 2\\pi]$，$v \\in [0, H]$。",
  ),
  intro: t(
    "Parametrize the cylinder $x^2 + y^2 = 400$ between $z = 0$ and $z = 3$ and find its lateral area. Take $\\mathbf{r}(u, v) = \\langle 20\\cos u, 20\\sin u, v \\rangle$ with $0 \\le u \\le 2\\pi$, $0 \\le v \\le 3$. Then $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = 20$, and the area is $20 \\cdot 2\\pi \\cdot 3 = 120\\pi$.\n\nCheck: unrolled, the cylinder is a rectangle with sides the circumference $40\\pi$ and the height $3$, of area $120\\pi$.\n\nIn this lesson we parametrize circular and elliptic cylinders by an angle and a height, and find the stretch factor $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ of each.",
    "参数化圆柱面 $x^2 + y^2 = 400$ 在 $z = 0$ 与 $z = 3$ 之间的部分，并求其侧面积。取 $\\mathbf{r}(u, v) = \\langle 20\\cos u, 20\\sin u, v \\rangle$，$0 \\le u \\le 2\\pi$，$0 \\le v \\le 3$。于是 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = 20$，面积为 $20 \\cdot 2\\pi \\cdot 3 = 120\\pi$。\n\n检验：把柱面展开，是一个边长为周长 $40\\pi$ 和高 $3$ 的矩形，面积为 $120\\pi$。\n\n本课我们用角度和高度参数化圆柱面与椭圆柱面，并求各自的伸缩因子 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$。",
  ),
  prerequisites: ["parametric-surfaces"],
  encompasses: [{ topic: "parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "parameterizing-cylindrical-surfaces",
      figure: multivariableDrawings7["parametrizations-of-cylinders#parameterizing-cylindrical-surfaces"],
      title: t("Parameterizing cylindrical surfaces", "圆柱面的柱坐标参数化"),
      explanation: t(
        "A cylinder keeps a fixed distance from its axis, so one parameter is the angle around the axis and the other is the height along it. For $\\mathbf{r}(u, v) = \\langle R \\cos u, R \\sin u, v \\rangle$, the tangent vectors are $\\mathbf{r}_u = \\langle -R \\sin u, R \\cos u, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$. The normal vector is $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R \\cos u, R \\sin u, 0 \\rangle$ with magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = R$. For $x^2 + y^2 = 256$ the magnitude is $16$.\n\n> **Watch out.** The magnitude is $\\sqrt{R^2(\\cos^2 u + \\sin^2 u)} = R$, not $R^2$; and it does not depend on the height of the cylinder.",
        "圆柱面到轴的距离固定，所以一个参数是绕轴的角度，另一个是沿轴的高度。对于 $\\mathbf{r}(u, v) = \\langle R \\cos u, R \\sin u, v \\rangle$，切向量为 $\\mathbf{r}_u = \\langle -R \\sin u, R \\cos u, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$。其法向量为 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R \\cos u, R \\sin u, 0 \\rangle$，模长恒为 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = R$。对 $x^2 + y^2 = 256$，模长为 $16$。\n\n> **注意。** 模长是 $\\sqrt{R^2(\\cos^2 u + \\sin^2 u)} = R$，不是 $R^2$；它也与柱面的高度无关。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 15);
        const H = rng.int(2, 15);
        const ans = R;
        return numberProblem({
          prompt: t(
            `For the cylinder $x^2 + y^2 = ${R * R}$ parametrized by $\\mathbf{r}(u, v) = \\langle ${R} \\cos u, ${R} \\sin u, v \\rangle$ with $v \\in [0, ${H}]$, find the magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ of the normal vector.`,
            `对于由 $\\mathbf{r}(u, v) = \\langle ${R} \\cos u, ${R} \\sin u, v \\rangle$（$v \\in [0, ${H}]$）参数化的圆柱面 $x^2 + y^2 = ${R * R}$，求法向量的模长 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(R * R, "That is the square of the magnitude; take the square root.", "那是模长的平方；还要开平方。"),
            why(2 * R, "That is the diameter; the magnitude of the normal is the radius.", "那是直径；法向量的模长等于半径。"),
            why(
              R + H,
              "That adds the height; the magnitude does not depend on how tall the cylinder is.",
              "那是加上了高度；模长与柱面的高度无关。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the tangent vectors", "求切向量"],
                t(
                  `$\\mathbf{r}_u = \\langle -${R} \\sin u, ${R} \\cos u, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$.`,
                  `$\\mathbf{r}_u = \\langle -${R} \\sin u, ${R} \\cos u, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$。`,
                ),
              ],
              [
                ["Take the cross product", "求叉积"],
                t(
                  `$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${R} \\cos u, ${R} \\sin u, 0 \\rangle$.`,
                  `$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${R} \\cos u, ${R} \\sin u, 0 \\rangle$。`,
                ),
              ],
              [
                ["Find its length", "求其长度"],
                t(
                  `$\\sqrt{${R * R}\\cos^2 u + ${R * R}\\sin^2 u} = \\sqrt{${R * R}} = ${R}$.`,
                  `$\\sqrt{${R * R}\\cos^2 u + ${R * R}\\sin^2 u} = \\sqrt{${R * R}} = ${R}$。`,
                ),
              ],
            ],
            t(
              `Integrating $${R}$ over $[0, 2\\pi] \\times [0, ${H}]$ gives $${2 * R * H}\\pi$, which is the lateral area $2\\pi R H = 2\\pi \\cdot ${R} \\cdot ${H}$ of the cylinder.`,
              `把 $${R}$ 在 $[0, 2\\pi] \\times [0, ${H}]$ 上积分得 $${2 * R * H}\\pi$，正是柱面的侧面积 $2\\pi R H = 2\\pi \\cdot ${R} \\cdot ${H}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-area-element-of-an-elliptic-cylinder",
      figure: multivariableDrawings7["parametrizations-of-cylinders#the-area-element-of-an-elliptic-cylinder"],
      title: t("The area element of an elliptic cylinder", "椭圆柱面的面积元"),
      explanation: t(
        "The elliptic cylinder $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ is parametrized by $\\mathbf{r}(u, v) = \\langle a\\cos u, b\\sin u, v \\rangle$. Then $\\mathbf{r}_u = \\langle -a\\sin u, b\\cos u, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$, so\n\n$$\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = \\sqrt{a^2\\sin^2 u + b^2\\cos^2 u}.$$\n\nUnlike a circular cylinder, the area element changes around the cylinder: it equals $b$ where $u = 0$ and $a$ where $u = \\frac{\\pi}{2}$. For $\\langle 9\\cos u, 10\\sin u, v \\rangle$ at $u = \\frac{\\pi}{2}$ it is $9$.\n\n> **Watch out.** The semi-axis $a$ is multiplied by $\\sin u$, so it shows up where $\\sin u = \\pm 1$, at $u = \\frac{\\pi}{2}$ and $\\frac{3\\pi}{2}$; at $u = 0$ and $\\pi$ the element is $b$.",
        "椭圆柱面 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ 的参数化为 $\\mathbf{r}(u, v) = \\langle a\\cos u, b\\sin u, v \\rangle$。于是 $\\mathbf{r}_u = \\langle -a\\sin u, b\\cos u, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$，所以\n\n$$\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = \\sqrt{a^2\\sin^2 u + b^2\\cos^2 u}$$\n\n与圆柱面不同，面积元沿柱面变化：在 $u = 0$ 处等于 $b$，在 $u = \\frac{\\pi}{2}$ 处等于 $a$。对 $\\langle 9\\cos u, 10\\sin u, v \\rangle$ 在 $u = \\frac{\\pi}{2}$ 处，它等于 $9$。\n\n> **注意。** 半轴 $a$ 乘的是 $\\sin u$，所以它出现在 $\\sin u = \\pm 1$ 处，即 $u = \\frac{\\pi}{2}$ 与 $\\frac{3\\pi}{2}$；在 $u = 0$ 与 $\\pi$ 处面积元为 $b$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 7);
        let b = rng.int(1, 7);
        if (b === a) b += 1;
        const at = rng.pick([
          ["0", 0, 1],
          ["\\frac{\\pi}{2}", 1, 0],
          ["\\pi", 0, -1],
          ["\\frac{3\\pi}{2}", -1, 0],
        ] as const);
        const [lab, s, c] = at;
        const ans = Math.abs(s) === 1 ? a : b;
        const ca = a === 1 ? "" : `${a}`;
        const cb = b === 1 ? "" : `${b}`;
        return numberProblem({
          prompt: t(
            `For $\\mathbf{r}(u, v) = \\langle ${ca}\\cos u, ${cb}\\sin u, v \\rangle$, find $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ at $u = ${lab}$.`,
            `对 $\\mathbf{r}(u, v) = \\langle ${ca}\\cos u, ${cb}\\sin u, v \\rangle$，求 $u = ${lab}$ 处的 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              ans === a ? b : a,
              "That is the other semi-axis; check whether $\\sin u$ or $\\cos u$ is $\\pm 1$ here.",
              "那是另一个半轴；要看这里是 $\\sin u$ 还是 $\\cos u$ 等于 $\\pm 1$。",
            ),
            why(
              a * b,
              "That multiplies the two semi-axes; at this angle only one of them survives.",
              "那是把两个半轴相乘；在这个角度只有一个半轴留下。",
            ),
            why(
              a + b,
              "That adds the two semi-axes; at this angle one of the two terms is zero.",
              "那是把两个半轴相加；在这个角度其中一项为零。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Evaluate the tangent vectors", "计算切向量"],
                t(
                  `At $u = ${lab}$, $\\mathbf{r}_u = \\langle ${-a * s}, ${b * c}, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$.`,
                  `在 $u = ${lab}$ 处，$\\mathbf{r}_u = \\langle ${-a * s}, ${b * c}, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$。`,
                ),
              ],
              [
                ["Take the cross product", "求叉积"],
                t(
                  `$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${b * c}, ${a * s}, 0 \\rangle$, of length $${ans}$.`,
                  `$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${b * c}, ${a * s}, 0 \\rangle$，长度为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `The general formula gives $\\sqrt{${a === 1 ? "" : a * a}\\sin^2 u + ${b === 1 ? "" : b * b}\\cos^2 u} = \\sqrt{${a * a * s * s} + ${b * b * c * c}} = ${ans}$.`,
              `一般公式给出 $\\sqrt{${a === 1 ? "" : a * a}\\sin^2 u + ${b === 1 ? "" : b * b}\\cos^2 u} = \\sqrt{${a * a * s * s} + ${b * b * c * c}} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 5.25 Surface Area
// ---------------------------------------------------------------------------

/** areasOfParametricSurfaces calculates surface area from the fundamental vector cross product. */
export const areasOfParametricSurfaces: TopicDef = {
  id: "areas-of-parametric-surfaces",
  title: t("Areas of Parametric Surfaces", "参数曲面的面积"),
  summary: t(
    "The area of a parametric surface is the double integral of $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ over the parameter domain $D$.",
    "参数曲面的面积等于 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ 在参数区域 $D$ 上的二重积分。",
  ),
  intro: t(
    "Find the area of the surface $\\mathbf{r}(u, v) = \\langle u + v, u - v, 0 \\rangle$ for $0 \\le u \\le 1$, $0 \\le v \\le 1$. Here $\\mathbf{r}_u = \\langle 1, 1, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 1, -1, 0 \\rangle$, so $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle 0, 0, -2 \\rangle$ has length $2$, and the area is $\\iint_D 2\\,du\\,dv = 2$.\n\nCheck: the surface is the square with corners $(0, 0)$, $(1, 1)$, $(2, 0)$ and $(1, -1)$, whose sides are $\\sqrt{2}$ long, so its area is $2$.\n\nIn this lesson we find the area of a parametric surface by integrating $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ over the parameter domain.",
    "求曲面 $\\mathbf{r}(u, v) = \\langle u + v, u - v, 0 \\rangle$（$0 \\le u \\le 1$，$0 \\le v \\le 1$）的面积。这里 $\\mathbf{r}_u = \\langle 1, 1, 0 \\rangle$，$\\mathbf{r}_v = \\langle 1, -1, 0 \\rangle$，所以 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle 0, 0, -2 \\rangle$ 的长度为 $2$，面积为 $\\iint_D 2\\,du\\,dv = 2$。\n\n检验：该曲面是顶点为 $(0, 0)$、$(1, 1)$、$(2, 0)$、$(1, -1)$ 的正方形，边长为 $\\sqrt{2}$，所以面积为 $2$。\n\n本课我们把 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ 在参数区域上积分，求参数曲面的面积。",
  ),
  prerequisites: ["tangent-planes-to-parametric-surfaces", "double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "tangent-planes-to-parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-area-of-parametric-surfaces",
      title: t("Evaluating area of parametric surfaces", "计算参数曲面的面积"),
      explanation: t(
        "For a surface patch where the normal magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = c$ is constant over a rectangular parameter domain $[0, U] \\times [0, V]$, the surface area is $\\iint_D c\\,du\\,dv = c U V$. With $c = 10$ over $[0, 1] \\times [0, 3]$, the area is $30$.\n\n> **Watch out.** The magnitude $c$ is a stretch factor for area: it multiplies the area $UV$ of the parameter rectangle, not its perimeter, and it cannot be left out.",
        "若参数曲面上法向量模长 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = c$ 为常数，且参数区域为矩形 $[0, U] \\times [0, V]$，则曲面面积为 $\\iint_D c\\,du\\,dv = c U V$。若 $c = 10$，区域为 $[0, 1] \\times [0, 3]$，面积为 $30$。\n\n> **注意。** 模长 $c$ 是面积的伸缩因子：它乘的是参数矩形的面积 $UV$，而不是周长，也不能省掉。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 9);
        const U = rng.int(2, 9);
        const V = rng.int(2, 9);
        const area = c * U * V;
        return numberProblem({
          prompt: t(
            `Find the surface area of a smooth parametric surface $\\mathbf{r}(u, v)$ over the rectangular domain $D = [0, ${U}] \\times [0, ${V}]$, given that $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${c}$ throughout $D$.`,
            `已知光滑参数曲面 $\\mathbf{r}(u, v)$ 在矩形参数域 $D = [0, ${U}] \\times [0, ${V}]$ 上处处满足 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${c}$，求该曲面的面积。`,
          ),
          answer: area,
          mistakes: distinct(area, [
            why(
              U * V,
              `That is the area of the parameter rectangle; multiply it by the stretch factor $${c}$.`,
              `那是参数矩形的面积；还要乘以伸缩因子 $${c}$。`,
            ),
            why(
              c * (U + V),
              "That multiplies the stretch factor by $U + V$; it multiplies the area $UV$.",
              "那是用伸缩因子乘以 $U + V$；它应乘以面积 $UV$。",
            ),
            why(
              c + U * V,
              "That adds the stretch factor; it multiplies the area of the parameter rectangle.",
              "那是把伸缩因子相加；它应乘以参数矩形的面积。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the area integral", "写出面积积分"],
                t(
                  `$A = \\iint_D \\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv = \\iint_D ${c}\\,du\\,dv$.`,
                  `$A = \\iint_D \\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv = \\iint_D ${c}\\,du\\,dv$。`,
                ),
              ],
              [["Find the area of D", "求 D 的面积"], t(`$${U} \\cdot ${V} = ${U * V}$.`, `$${U} \\cdot ${V} = ${U * V}$。`)],
              [["Multiply", "相乘"], t(`$A = ${c} \\cdot ${U * V} = ${area}$.`, `$A = ${c} \\cdot ${U * V} = ${area}$。`)],
            ],
            t(
              `Integrating in turn, $\\int_0^{${U}} ${c}\\,du = ${c * U}$ and $\\int_0^{${V}} ${c * U}\\,dv = ${area}$.`,
              `逐次积分，$\\int_0^{${U}} ${c}\\,du = ${c * U}$，$\\int_0^{${V}} ${c * U}\\,dv = ${area}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-lateral-area-of-a-cone",
      figure: multivariableDrawings7["areas-of-parametric-surfaces#the-lateral-area-of-a-cone"],
      title: t("The lateral area of a cone", "圆锥的侧面积"),
      explanation: t(
        "The cone $z = k\\sqrt{x^2 + y^2}$ is parametrized by $\\mathbf{r}(u, v) = \\langle u\\cos v, u\\sin v, ku \\rangle$. Then $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -ku\\cos v, -ku\\sin v, u \\rangle$, whose length is $u\\sqrt{1 + k^2}$. Over $0 \\le u \\le R$, $0 \\le v \\le 2\\pi$,\n\n$$A = \\int_0^{2\\pi}\\int_0^R u\\sqrt{1 + k^2}\\,du\\,dv = \\pi R^2\\sqrt{1 + k^2},$$\n\nwhich matches the familiar formula $\\pi R \\ell$ with slant height $\\ell = R\\sqrt{1 + k^2}$. For $z = \\frac{7}{24}\\sqrt{x^2 + y^2}$ over $x^2 + y^2 \\le 576$, $\\sqrt{1 + k^2} = \\frac{25}{24}$ and $\\frac{A}{\\pi} = 576 \\cdot \\frac{25}{24} = 600$.\n\n> **Watch out.** The factor is $\\sqrt{1 + k^2}$, not the slope $k$; and $\\int_0^R u\\,du = \\frac{R^2}{2}$, which the $2\\pi$ from $v$ turns into $\\pi R^2$, not $2\\pi R^2$.",
        "圆锥面 $z = k\\sqrt{x^2 + y^2}$ 的参数化为 $\\mathbf{r}(u, v) = \\langle u\\cos v, u\\sin v, ku \\rangle$。于是 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -ku\\cos v, -ku\\sin v, u \\rangle$，其长度为 $u\\sqrt{1 + k^2}$。在 $0 \\le u \\le R$，$0 \\le v \\le 2\\pi$ 上，\n\n$$A = \\int_0^{2\\pi}\\int_0^R u\\sqrt{1 + k^2}\\,du\\,dv = \\pi R^2\\sqrt{1 + k^2},$$\n\n与熟悉的公式 $\\pi R \\ell$（母线长 $\\ell = R\\sqrt{1 + k^2}$）一致。对 $z = \\frac{7}{24}\\sqrt{x^2 + y^2}$ 在 $x^2 + y^2 \\le 576$ 上，$\\sqrt{1 + k^2} = \\frac{25}{24}$，$\\frac{A}{\\pi} = 576 \\cdot \\frac{25}{24} = 600$。\n\n> **注意。** 因子是 $\\sqrt{1 + k^2}$，不是斜率 $k$；而 $\\int_0^R u\\,du = \\frac{R^2}{2}$，乘以来自 $v$ 的 $2\\pi$ 得 $\\pi R^2$，不是 $2\\pi R^2$。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, h] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
        ] as const);
        const R = rng.int(1, 6);
        const ans = Q.of(R * R * h, q);
        const slant = Q.of(R * h, q);
        return numberProblem({
          prompt: t(
            `Find the area of the cone $z = \\frac{${p}}{${q}}\\sqrt{x^2 + y^2}$ for $x^2 + y^2 \\le ${R * R}$, divided by $\\pi$.`,
            `求圆锥面 $z = \\frac{${p}}{${q}}\\sqrt{x^2 + y^2}$（$x^2 + y^2 \\le ${R * R}$）的面积除以 $\\pi$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(R * R),
              "That is the area of the disk below; the slanted cone is larger by the factor $\\sqrt{1 + k^2}$.",
              "那是下方圆盘的面积；倾斜的锥面要大一个因子 $\\sqrt{1 + k^2}$。",
            ),
            why(
              Q.of(2 * R * R * h, q),
              "That forgets the $\\frac{1}{2}$ from $\\int_0^R u\\,du = \\frac{R^2}{2}$.",
              "那是漏掉了 $\\int_0^R u\\,du = \\frac{R^2}{2}$ 中的 $\\frac{1}{2}$。",
            ),
            why(Q.of(R * R * p, q), "That uses the slope $k$ in place of $\\sqrt{1 + k^2}$.", "那是用斜率 $k$ 代替了 $\\sqrt{1 + k^2}$。"),
          ]),
          solution: walked(
            [
              [
                ["Find the stretch factor", "求伸缩因子"],
                t(
                  `$\\sqrt{1 + k^2} = \\sqrt{1 + \\frac{${p * p}}{${q * q}}} = \\sqrt{\\frac{${h * h}}{${q * q}}} = \\frac{${h}}{${q}}$.`,
                  `$\\sqrt{1 + k^2} = \\sqrt{1 + \\frac{${p * p}}{${q * q}}} = \\sqrt{\\frac{${h * h}}{${q * q}}} = \\frac{${h}}{${q}}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$A = \\pi R^2\\sqrt{1 + k^2} = \\pi \\cdot ${times(R * R)}\\frac{${h}}{${q}}$, so $\\frac{A}{\\pi} = ${ans.toLatex()}$.`,
                  `$A = \\pi R^2\\sqrt{1 + k^2} = \\pi \\cdot ${times(R * R)}\\frac{${h}}{${q}}$，所以 $\\frac{A}{\\pi} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The rim has radius $${R}$ and the tip is at height $${Q.of(p * R, q).toLatex()}$ above it, so the slant height is $\\ell = ${slant.toLatex()}$, and $\\pi R \\ell = \\pi \\cdot ${times(R)}${slant.toLatex()}$ gives $\\frac{A}{\\pi} = ${ans.toLatex()}$ again.`,
              `底边半径为 $${R}$，顶点与底边的高度差为 $${Q.of(p * R, q).toLatex()}$，所以母线长 $\\ell = ${slant.toLatex()}$，而 $\\pi R \\ell = \\pi \\cdot ${times(R)}${slant.toLatex()}$ 同样给出 $\\frac{A}{\\pi} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** surfacesOfRevolution formulates surfaces generated by revolving plane curves. */
export const surfacesOfRevolution: TopicDef = {
  id: "surfaces-of-revolution",
  title: t("Surfaces of Revolution", "旋转曲面的参数化与面积"),
  summary: t(
    "Revolving y = f(x) about an axis produces a surface whose area element integrates circular circumferences 2π y ds along the profile curve.",
    "将平面曲线 y = f(x) 绕轴旋转生成旋转曲面，其面积微元沿母线曲线积分圆周长 2π y ds。",
  ),
  intro: t(
    "Revolve $y = x$, $0 \\le x \\le 3$, about the $x$-axis. The surface is a cone, and since $\\sqrt{1 + y'^2} = \\sqrt{2}$, its area is $2\\pi\\int_0^3 x\\sqrt{2}\\,dx = 2\\pi\\sqrt{2} \\cdot \\frac{9}{2} = 9\\sqrt{2}\\pi$.\n\nCheck: the cone has base radius $3$ and slant height $3\\sqrt{2}$, and $\\pi R \\ell = \\pi \\cdot 3 \\cdot 3\\sqrt{2} = 9\\sqrt{2}\\pi$.\n\nIn this lesson we find the areas of surfaces of revolution by adding up the circles traced by each point of the profile curve.",
    "把 $y = x$（$0 \\le x \\le 3$）绕 $x$ 轴旋转。所得曲面是圆锥面，由于 $\\sqrt{1 + y'^2} = \\sqrt{2}$，其面积为 $2\\pi\\int_0^3 x\\sqrt{2}\\,dx = 2\\pi\\sqrt{2} \\cdot \\frac{9}{2} = 9\\sqrt{2}\\pi$。\n\n检验：圆锥底面半径为 $3$，母线长为 $3\\sqrt{2}$，而 $\\pi R \\ell = \\pi \\cdot 3 \\cdot 3\\sqrt{2} = 9\\sqrt{2}\\pi$。\n\n本课我们把母线上每一点画出的圆加起来，求旋转曲面的面积。",
  ),
  prerequisites: ["surface-areas-of-revolution-rotation-about-the-x-axis", "parametric-surfaces"],
  encompasses: [{ topic: "surface-areas-of-revolution-rotation-about-the-x-axis", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-of-general-surfaces-of-revolution",
      figure: multivariableDrawings7["surfaces-of-revolution#area-of-general-surfaces-of-revolution"],
      title: t("Area of general surfaces of revolution", "一般旋转曲面的面积计算"),
      explanation: t(
        "When the horizontal line segment $y = R$ ($0 \\le x \\le H$) is rotated about the $x$-axis, it forms a right circular cylinder of radius $R$ and height $H$. The lateral surface area is $2\\pi R H$. When divided by $\\pi$, the value is $2 R H$. For $y = 1$, $0 \\le x \\le 5$, it is $10$.\n\n> **Watch out.** Each point travels a circle of circumference $2\\pi R$, so the factor $2$ stays; and revolving the segment alone gives no end disks, so do not add $2\\pi R^2$.",
        "当水平线段 $y = R$（$0 \\le x \\le H$）绕 $x$ 轴旋转时，生成半径为 $R$、高为 $H$ 的圆柱面。其侧面积为 $2\\pi R H$。除去因数 $\\pi$ 后的值为 $2 R H$。对 $y = 1$，$0 \\le x \\le 5$，该值为 $10$。\n\n> **注意。** 每一点画出周长为 $2\\pi R$ 的圆，所以因子 $2$ 要保留；只旋转线段不会产生两端的圆盘，所以不要加上 $2\\pi R^2$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 12);
        const H = rng.int(2, 15);
        const ans = 2 * R * H;
        return numberProblem({
          prompt: t(
            `Find the surface area divided by $\\pi$ of the circular cylinder formed by revolving the line segment $y = ${R}$ ($0 \\le x \\le ${H}$) about the $x$-axis.`,
            `将线段 $y = ${R}$（$0 \\le x \\le ${H}$）绕 $x$ 轴旋转得到圆柱侧面，求其侧面积除以 $\\pi$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(R * H, "That drops the $2$ in the circumference $2\\pi R$.", "那是漏掉了周长 $2\\pi R$ 中的 $2$。"),
            why(4 * R * H, "That uses the diameter in place of the radius.", "那是用直径代替了半径。"),
            why(
              2 * R * H + 2 * R * R,
              "That adds the two end disks, which revolving the segment does not produce.",
              "那是加上了两端的圆盘，而旋转线段不会产生它们。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the formula", "写出公式"],
                t("$A = 2\\pi\\int_a^b y\\sqrt{1 + (y')^2}\\,dx$.", "$A = 2\\pi\\int_a^b y\\sqrt{1 + (y')^2}\\,dx$。"),
              ],
              [
                ["Simplify", "化简"],
                t(`$y = ${R}$ gives $y' = 0$, so $\\sqrt{1 + 0^2} = 1$.`, `$y = ${R}$ 给出 $y' = 0$，所以 $\\sqrt{1 + 0^2} = 1$。`),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$A = 2\\pi\\int_0^{${H}} ${R}\\,dx = ${ans}\\pi$, so $\\frac{A}{\\pi} = ${ans}$.`,
                  `$A = 2\\pi\\int_0^{${H}} ${R}\\,dx = ${ans}\\pi$，所以 $\\frac{A}{\\pi} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Unrolled, the cylinder is a rectangle of width $2\\pi \\cdot ${R} = ${2 * R}\\pi$ and height $${H}$, of area $${ans}\\pi$.`,
              `把柱面展开，是宽 $2\\pi \\cdot ${R} = ${2 * R}\\pi$、高 $${H}$ 的矩形，面积为 $${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-area-of-a-spherical-zone",
      figure: multivariableDrawings7["surfaces-of-revolution#the-area-of-a-spherical-zone"],
      title: t("The area of a spherical zone", "球带的面积"),
      explanation: t(
        "Revolving $y = \\sqrt{R^2 - x^2}$ for $a \\le x \\le b$ about the $x$-axis gives a zone of a sphere. Here $y\\sqrt{1 + y'^2} = \\sqrt{R^2 - x^2} \\cdot \\frac{R}{\\sqrt{R^2 - x^2}} = R$, so\n\n$$S = 2\\pi\\int_a^b R\\,dx = 2\\pi R(b - a).$$\n\nRemarkably, the area depends only on the width $b - a$ of the slab, not on where the slab sits along the sphere. For $R = 10$ and $-3 \\le x \\le 5$, $\\frac{S}{\\pi} = 2 \\cdot 10 \\cdot 8 = 160$.\n\n> **Watch out.** The integrand is the constant $R$, not $R^2$, and the factor $2$ from $2\\pi$ stays; the whole sphere, $4\\pi R^2$, appears only when the slab is the full width $2R$.",
        "把 $y = \\sqrt{R^2 - x^2}$（$a \\le x \\le b$）绕 $x$ 轴旋转得到一个球带。这里 $y\\sqrt{1 + y'^2} = \\sqrt{R^2 - x^2} \\cdot \\frac{R}{\\sqrt{R^2 - x^2}} = R$，所以\n\n$$S = 2\\pi\\int_a^b R\\,dx = 2\\pi R(b - a)$$\n\n值得注意的是，面积只取决于夹层的宽度 $b - a$，与夹层在球上的位置无关。对 $R = 10$，$-3 \\le x \\le 5$，$\\frac{S}{\\pi} = 2 \\cdot 10 \\cdot 8 = 160$。\n\n> **注意。** 被积函数是常数 $R$，不是 $R^2$，$2\\pi$ 中的因子 $2$ 也要保留；只有当夹层宽度为整个 $2R$ 时，才得到整个球面 $4\\pi R^2$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 9);
        const a = rng.int(-R, R - 1);
        const b = rng.int(a + 1, R);
        const ans = 2 * R * (b - a);
        return numberProblem({
          prompt: t(
            `The arc $y = \\sqrt{${R * R} - x^2}$, $${a} \\le x \\le ${b}$, is revolved about the $x$-axis. Find the area of the resulting surface divided by $\\pi$.`,
            `把弧 $y = \\sqrt{${R * R} - x^2}$（$${a} \\le x \\le ${b}$）绕 $x$ 轴旋转。求所得曲面的面积除以 $\\pi$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(R * (b - a), "That drops the $2$ in $2\\pi$.", "那是漏掉了 $2\\pi$ 中的 $2$。"),
            why(
              2 * R * R * (b - a),
              `That integrates $R^2$; the integrand $y\\sqrt{1 + y'^2}$ simplifies to $R = ${R}$.`,
              `那是对 $R^2$ 积分；被积函数 $y\\sqrt{1 + y'^2}$ 化简为 $R = ${R}$。`,
            ),
            why(
              4 * R * R,
              "That is the whole sphere; the zone covers only the slab from $a$ to $b$.",
              "那是整个球面；球带只覆盖从 $a$ 到 $b$ 的夹层。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Simplify the integrand", "化简被积函数"],
                t(`$y\\sqrt{1 + y'^2} = ${R}$ for every $x$.`, `对每个 $x$ 都有 $y\\sqrt{1 + y'^2} = ${R}$。`),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$S = 2\\pi \\cdot ${R}(${b} - ${paren(a)}) = 2\\pi \\cdot ${R} \\cdot ${b - a} = ${ans}\\pi$.`,
                  `$S = 2\\pi \\cdot ${R}(${b} - ${paren(a)}) = 2\\pi \\cdot ${R} \\cdot ${b - a} = ${ans}\\pi$。`,
                ),
              ],
            ],
            t(
              `The whole sphere, of width $${2 * R}$, has area $${4 * R * R}\\pi$; a slab of width $${b - a}$ takes the fraction $\\frac{${b - a}}{${2 * R}}$ of it, and $${4 * R * R} \\cdot \\frac{${b - a}}{${2 * R}} = ${ans}$.`,
              `宽度为 $${2 * R}$ 的整个球面面积为 $${4 * R * R}\\pi$；宽度为 $${b - a}$ 的夹层占其中的 $\\frac{${b - a}}{${2 * R}}$，而 $${4 * R * R} \\cdot \\frac{${b - a}}{${2 * R}} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** areasOfSurfaces computes surface area for Cartesian graphs z = f(x, y). */
export const areasOfSurfaces: TopicDef = {
  id: "areas-of-surfaces",
  title: t("Areas of Surfaces", "显式笛卡尔曲面的面积"),
  summary: t(
    "For a surface $z = f(x, y)$, the area element is $dS = \\sqrt{1 + f_x^2 + f_y^2}\\,dA$.",
    "对于曲面 $z = f(x, y)$，面积微元为 $dS = \\sqrt{1 + f_x^2 + f_y^2}\\,dA$。",
  ),
  intro: t(
    "Find the area of the plane $z = 12x + 12y$ above the unit square $[0, 1] \\times [0, 1]$. Here $f_x = f_y = 12$, so $dS = \\sqrt{1 + 144 + 144}\\,dA = 17\\,dA$, and the area is $17$.\n\nCheck: the piece is the parallelogram spanned by $\\langle 1, 0, 12 \\rangle$ and $\\langle 0, 1, 12 \\rangle$; their cross product $\\langle -12, -12, 1 \\rangle$ has length $\\sqrt{289} = 17$.\n\nIn this lesson we find the areas of graphs $z = f(x, y)$ by integrating $\\sqrt{1 + f_x^2 + f_y^2}$ over the region below them.",
    "求平面 $z = 12x + 12y$ 在单位正方形 $[0, 1] \\times [0, 1]$ 上方部分的面积。这里 $f_x = f_y = 12$，所以 $dS = \\sqrt{1 + 144 + 144}\\,dA = 17\\,dA$，面积为 $17$。\n\n检验：这一部分是由 $\\langle 1, 0, 12 \\rangle$ 与 $\\langle 0, 1, 12 \\rangle$ 张成的平行四边形；它们的叉积 $\\langle -12, -12, 1 \\rangle$ 的长度为 $\\sqrt{289} = 17$。\n\n本课我们把 $\\sqrt{1 + f_x^2 + f_y^2}$ 在下方区域上积分，求图像 $z = f(x, y)$ 的面积。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains", "tangent-planes-to-surfaces"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-surface-area-for-graphs-z-equals-f-of-x-y",
      figure: multivariableDrawings7["areas-of-surfaces#computing-surface-area-for-graphs-z-equals-f-of-x-y"],
      title: t("Computing surface area for graphs z = f(x, y)", "计算显式函数图像 z = f(x, y) 的曲面面积"),
      explanation: t(
        "For a plane $z = ax + by + c$, the partial derivatives are constant: $f_x = a$ and $f_y = b$. The area element is $dS = \\sqrt{1 + a^2 + b^2}\\,dA$. Over a rectangle $D = [0, W] \\times [0, H]$, the surface area is $W H \\sqrt{1 + a^2 + b^2}$. When $(a, b) = (6, 18)$, $\\sqrt{1 + 36 + 324} = \\sqrt{361} = 19$.\n\n> **Watch out.** Square the slopes, add $1$, and take the square root; the constant $c$ only lifts the plane and does not change its area.",
        "对于平面 $z = ax + by + c$，偏导数为常数：$f_x = a$，$f_y = b$。面积微元为 $dS = \\sqrt{1 + a^2 + b^2}\\,dA$。在矩形区域 $D = [0, W] \\times [0, H]$ 上，曲面面积为 $W H \\sqrt{1 + a^2 + b^2}$。例如当 $(a, b) = (6, 18)$ 时，$\\sqrt{1 + 36 + 324} = \\sqrt{361} = 19$。\n\n> **注意。** 把斜率平方、加 $1$、再开平方；常数 $c$ 只是把平面抬高，不改变面积。",
      ),
      generate(rng: Rng): Problem {
        const choices = [
          { a: 2, b: 2, rad: 3 },
          { a: 4, b: 8, rad: 9 },
          { a: 8, b: 4, rad: 9 },
        ];
        const pick = rng.pick(choices);
        const W = rng.int(2, 9);
        const H = rng.int(2, 9);
        const c = rng.int(1, 10);
        const ans = pick.rad * W * H;
        const sq = 1 + pick.a * pick.a + pick.b * pick.b;
        return numberProblem({
          prompt: t(
            `Find the area of the portion of the plane $z = ${pick.a}x + ${pick.b}y + ${c}$ lying above the rectangle $[0, ${W}] \\times [0, ${H}]$ in the $xy$-plane.`,
            `求平面 $z = ${pick.a}x + ${pick.b}y + ${c}$ 位于 $xy$ 平面上矩形 $[0, ${W}] \\times [0, ${H}]$ 上方的部分的面积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              W * H,
              "That is the area of the rectangle below; the tilted plane is larger by $\\sqrt{1 + a^2 + b^2}$.",
              "那是下方矩形的面积；倾斜的平面要大一个因子 $\\sqrt{1 + a^2 + b^2}$。",
            ),
            why(sq * W * H, `That leaves out the square root of $${sq}$.`, `那是没有对 $${sq}$ 开平方。`),
            why(
              (pick.a + pick.b) * W * H,
              "That adds the slopes in place of $\\sqrt{1 + a^2 + b^2}$.",
              "那是用斜率之和代替了 $\\sqrt{1 + a^2 + b^2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the partial derivatives", "求偏导数"],
                t(`$f_x = ${pick.a}$ and $f_y = ${pick.b}$.`, `$f_x = ${pick.a}$，$f_y = ${pick.b}$。`),
              ],
              [
                ["Find the area element", "求面积元"],
                t(
                  `$\\sqrt{1 + ${pick.a}^2 + ${pick.b}^2} = \\sqrt{${sq}} = ${pick.rad}$.`,
                  `$\\sqrt{1 + ${pick.a}^2 + ${pick.b}^2} = \\sqrt{${sq}} = ${pick.rad}$。`,
                ),
              ],
              [
                ["Multiply by the area below", "乘以下方面积"],
                t(`$A = ${pick.rad} \\cdot ${W} \\cdot ${H} = ${ans}$.`, `$A = ${pick.rad} \\cdot ${W} \\cdot ${H} = ${ans}$。`),
              ],
            ],
            t(
              `The piece is the parallelogram spanned by $\\langle ${W}, 0, ${pick.a * W} \\rangle$ and $\\langle 0, ${H}, ${pick.b * H} \\rangle$. Their cross product is $\\langle ${-pick.a * W * H}, ${-pick.b * W * H}, ${W * H} \\rangle = ${W * H}\\langle ${-pick.a}, ${-pick.b}, 1 \\rangle$, of length $${W * H} \\cdot ${pick.rad} = ${ans}$.`,
              `这一部分是由 $\\langle ${W}, 0, ${pick.a * W} \\rangle$ 与 $\\langle 0, ${H}, ${pick.b * H} \\rangle$ 张成的平行四边形。它们的叉积为 $\\langle ${-pick.a * W * H}, ${-pick.b * W * H}, ${W * H} \\rangle = ${W * H}\\langle ${-pick.a}, ${-pick.b}, 1 \\rangle$，长度为 $${W * H} \\cdot ${pick.rad} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "area-of-a-curved-graph-over-a-rectangle",
      figure: multivariableDrawings7["areas-of-surfaces#area-of-a-curved-graph-over-a-rectangle"],
      title: t("The area of a curved graph over a rectangle", "矩形上方曲面图形的面积"),
      explanation: t(
        "The area of the graph $z = f(x, y)$ over $D$ is $\\iint_D \\sqrt{1 + f_x^2 + f_y^2}\\,dA$. For $f = \\frac{2}{3}x^{3/2}$, $f_x = x^{1/2}$ and $f_y = 0$, so the integrand is $\\sqrt{1 + x}$ and over $[0, a] \\times [0, b]$\n\n$$A = b\\int_0^a \\sqrt{1 + x}\\,dx = \\frac{2b}{3}\\left[(1 + a)^{3/2} - 1\\right].$$\n\nOver $[0, 99] \\times [0, 3]$ this is $2\\left[100^{3/2} - 1\\right] = 2 \\cdot 999 = 1998$.\n\n> **Watch out.** The antiderivative $\\frac{2}{3}(1 + x)^{3/2}$ is $\\frac{2}{3}$ at $x = 0$, not $0$, so subtract it; and the width $b$ in $y$ multiplies the whole result.",
        "图形 $z = f(x, y)$ 在 $D$ 上方的面积为 $\\iint_D \\sqrt{1 + f_x^2 + f_y^2}\\,dA$。对 $f = \\frac{2}{3}x^{3/2}$，$f_x = x^{1/2}$，$f_y = 0$，所以被积函数为 $\\sqrt{1 + x}$，在 $[0, a] \\times [0, b]$ 上\n\n$$A = b\\int_0^a \\sqrt{1 + x}\\,dx = \\frac{2b}{3}\\left[(1 + a)^{3/2} - 1\\right]$$\n\n在 $[0, 99] \\times [0, 3]$ 上，它等于 $2\\left[100^{3/2} - 1\\right] = 2 \\cdot 999 = 1998$。\n\n> **注意。** 原函数 $\\frac{2}{3}(1 + x)^{3/2}$ 在 $x = 0$ 处等于 $\\frac{2}{3}$，不是 $0$，所以要减去它；$y$ 方向的宽度 $b$ 乘以整个结果。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(2, 5);
        const a = n * n - 1;
        const b = rng.int(1, 8);
        const ans = Q.of(2 * b * (n ** 3 - 1), 3);
        return numberProblem({
          prompt: t(
            `Find the area of the surface $z = \\frac{2}{3}x^{3/2}$ above the rectangle $[0, ${a}] \\times [0, ${b}]$.`,
            `求曲面 $z = \\frac{2}{3}x^{3/2}$ 在矩形 $[0, ${a}] \\times [0, ${b}]$ 上方的面积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a * b),
              "That is the area of the flat rectangle below; the curved surface is larger.",
              "那是下方平面矩形的面积；弯曲的曲面更大。",
            ),
            why(
              Q.of(2 * b * n ** 3, 3),
              "That forgets to subtract the value $\\frac{2}{3}$ of the antiderivative at $x = 0$.",
              "那是忘了减去原函数在 $x = 0$ 处的值 $\\frac{2}{3}$。",
            ),
            why(
              Q.of(2 * (n ** 3 - 1), 3),
              `That leaves out the width $${b}$ of the rectangle in $y$.`,
              `那是漏掉了矩形在 $y$ 方向的宽度 $${b}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the area element", "求面积元"],
                t(
                  "$f_x = x^{1/2}$ and $f_y = 0$, so $\\sqrt{1 + f_x^2 + f_y^2} = \\sqrt{1 + x}$.",
                  "$f_x = x^{1/2}$，$f_y = 0$，所以 $\\sqrt{1 + f_x^2 + f_y^2} = \\sqrt{1 + x}$。",
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${a}} \\sqrt{1 + x}\\,dx = \\frac{2}{3}\\left[${n * n}^{3/2} - 1\\right] = \\frac{2}{3}(${n ** 3} - 1) = ${Q.of(2 * (n ** 3 - 1), 3).toLatex()}$.`,
                  `$\\int_0^{${a}} \\sqrt{1 + x}\\,dx = \\frac{2}{3}\\left[${n * n}^{3/2} - 1\\right] = \\frac{2}{3}(${n ** 3} - 1) = ${Q.of(2 * (n ** 3 - 1), 3).toLatex()}$。`,
                ),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(
                  `$A = ${times(b)}${Q.of(2 * (n ** 3 - 1), 3).toLatex()} = ${ans.toLatex()}$.`,
                  `$A = ${times(b)}${Q.of(2 * (n ** 3 - 1), 3).toLatex()} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Since $1 \\le \\sqrt{1 + x} \\le ${n}$ on $[0, ${a}]$, the area lies between $${a * b}$ and $${n * a * b}$, and indeed $${a * b} < ${ans.toLatex()} < ${n * a * b}$.`,
              `由于在 $[0, ${a}]$ 上 $1 \\le \\sqrt{1 + x} \\le ${n}$，面积介于 $${a * b}$ 与 $${n * a * b}$ 之间，而确实 $${a * b} < ${ans.toLatex()} < ${n * a * b}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 5.26 Surface Integrals
// ---------------------------------------------------------------------------

/** surfaceIntegralsOverParametricSurfaces integrates scalar functions over parametric surfaces. */
export const surfaceIntegralsOverParametricSurfaces: TopicDef = {
  id: "surface-integrals-over-parametric-surfaces",
  title: t("Surface Integrals Over Parametric Surfaces", "参数曲面上的第一型曲面积分"),
  summary: t(
    "A scalar surface integral becomes a double integral: $\\iint_S g\\,dS = \\iint_D g(\\mathbf{r}(u, v))\\,\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv$.",
    "标量曲面积分化为二重积分：$\\iint_S g\\,dS = \\iint_D g(\\mathbf{r}(u, v))\\,\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv$。",
  ),
  intro: t(
    "Evaluate $\\iint_S 3\\,dS$ for $\\mathbf{r}(u, v) = \\langle 2u, 2v, 7 \\rangle$, $0 \\le u, v \\le 1$. Here $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle 2, 0, 0 \\rangle \\times \\langle 0, 2, 0 \\rangle = \\langle 0, 0, 4 \\rangle$, so $dS = 4\\,du\\,dv$ and the integral is $\\int_0^1\\int_0^1 3 \\cdot 4\\,du\\,dv = 12$.\n\nCheck: $S$ is the square $[0, 2] \\times [0, 2]$ at height $7$, of area $4$, and $3 \\cdot 4 = 12$.\n\nIn this lesson we turn scalar surface integrals over parametric surfaces into double integrals over the parameter domain.",
    "计算 $\\iint_S 3\\,dS$，其中 $\\mathbf{r}(u, v) = \\langle 2u, 2v, 7 \\rangle$，$0 \\le u, v \\le 1$。这里 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle 2, 0, 0 \\rangle \\times \\langle 0, 2, 0 \\rangle = \\langle 0, 0, 4 \\rangle$，所以 $dS = 4\\,du\\,dv$，积分为 $\\int_0^1\\int_0^1 3 \\cdot 4\\,du\\,dv = 12$。\n\n检验：$S$ 是高度 $7$ 处的正方形 $[0, 2] \\times [0, 2]$，面积为 $4$，而 $3 \\cdot 4 = 12$。\n\n本课我们把参数曲面上的标量曲面积分化为参数区域上的二重积分。",
  ),
  prerequisites: ["areas-of-parametric-surfaces"],
  encompasses: [{ topic: "areas-of-parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-scalar-surface-integrals-over-parametric-surfaces",
      title: t("Evaluating scalar surface integrals over parametric surfaces", "计算参数曲面上的标量函数曲面积分"),
      explanation: t(
        "The surface integral weights the function by small pieces of area, which is the length of the cross product of the two tangent vectors. For a constant function $g(x, y, z) = k$, the surface integral $\\iint_S k\\,dS$ simply equals $k \\times \\text{Area}(S)$. With $k = 10$, $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = 7$ and the domain $[0, 1] \\times [0, 2]$, the area is $14$ and the integral is $140$.\n\n> **Watch out.** Three numbers multiply: the value $k$, the stretch factor $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ and the area of the parameter domain; leaving out any one of them gives a wrong result.",
        "曲面积分用小块面积对函数加权，小块面积等于两个切向量叉积的长度。对于常数函数 $g(x, y, z) = k$，第一型曲面积分 $\\iint_S k\\,dS$ 等于 $k \\times \\text{Area}(S)$。若 $k = 10$，$\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = 7$，参数区域为 $[0, 1] \\times [0, 2]$，则面积为 $14$，积分为 $140$。\n\n> **注意。** 三个数相乘：函数值 $k$、伸缩因子 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ 和参数区域的面积；漏掉任何一个都会出错。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 8);
        const norm = rng.int(2, 6);
        const U = rng.int(2, 8);
        const V = rng.int(2, 8);
        const area = norm * U * V;
        const ans = k * area;
        return numberProblem({
          prompt: t(
            `Evaluate the scalar surface integral $\\iint_S ${k}\\,dS$ over a parametric surface patch $\\mathbf{r}(u, v)$ defined on $[0, ${U}] \\times [0, ${V}]$ with constant normal magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${norm}$.`,
            `计算标量第一型曲面积分 $\\iint_S ${k}\\,dS$，其中参数曲面片 $\\mathbf{r}(u, v)$ 定义在 $[0, ${U}] \\times [0, ${V}]$ 上，法向量模长恒为 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${norm}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              area,
              `That is the area of $S$; multiply it by the value $${k}$ of the function.`,
              `那是 $S$ 的面积；还要乘以函数值 $${k}$。`,
            ),
            why(
              k * U * V,
              `That leaves out the stretch factor $${norm}$, so it integrates over the parameter rectangle instead of the surface.`,
              `那是漏掉了伸缩因子 $${norm}$，于是积分的是参数矩形而不是曲面。`,
            ),
            why(k * norm, `That leaves out the area $${U * V}$ of the parameter domain.`, `那是漏掉了参数区域的面积 $${U * V}$。`),
          ]),
          solution: walked(
            [
              [
                ["Convert to a double integral", "化为二重积分"],
                t(
                  `$\\iint_S ${k}\\,dS = \\iint_D ${k} \\cdot ${norm}\\,du\\,dv = \\iint_D ${k * norm}\\,du\\,dv$.`,
                  `$\\iint_S ${k}\\,dS = \\iint_D ${k} \\cdot ${norm}\\,du\\,dv = \\iint_D ${k * norm}\\,du\\,dv$。`,
                ),
              ],
              [
                ["Multiply by the area of D", "乘以 D 的面积"],
                t(`$${k * norm} \\cdot ${U} \\cdot ${V} = ${ans}$.`, `$${k * norm} \\cdot ${U} \\cdot ${V} = ${ans}$。`),
              ],
            ],
            t(
              `The surface has area $${norm} \\cdot ${U * V} = ${area}$, and a constant $${k}$ over it integrates to $${k} \\cdot ${area} = ${ans}$.`,
              `曲面面积为 $${norm} \\cdot ${U * V} = ${area}$，常数 $${k}$ 在其上的积分为 $${k} \\cdot ${area} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-surface-integral-over-a-cylinder",
      figure: multivariableDrawings7["surface-integrals-over-parametric-surfaces#a-surface-integral-over-a-cylinder"],
      title: t("A surface integral over a cylinder", "圆柱面上的曲面积分"),
      explanation: t(
        "On the cylinder $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$, $0 \\le u \\le 2\\pi$, $0 \\le v \\le H$, the area element is $dS = R\\,du\\,dv$. Write the integrand in terms of $u$ and $v$ and integrate over the parameter rectangle:\n\n$$\\iint_S (x^2 + y^2)\\,dS = \\int_0^H\\int_0^{2\\pi} R^2 \\cdot R\\,du\\,dv = 2\\pi R^3H, \\qquad \\iint_S z\\,dS = \\int_0^H\\int_0^{2\\pi} vR\\,du\\,dv = \\pi RH^2.$$\n\nFor $R = 6$ and $H = 7$ these are $3024\\pi$ and $294\\pi$.\n\n> **Watch out.** $x^2 + y^2 = R^2$ on the cylinder, but $dS$ brings one more factor $R$, so the first integral has $R^3$; in the second, $\\int_0^H v\\,dv = \\frac{H^2}{2}$ halves the $2\\pi$.",
        "在圆柱面 $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$（$0 \\le u \\le 2\\pi$，$0 \\le v \\le H$）上，面积元为 $dS = R\\,du\\,dv$。把被积函数用 $u$、$v$ 表示，再在参数矩形上积分：\n\n$$\\iint_S (x^2 + y^2)\\,dS = \\int_0^H\\int_0^{2\\pi} R^2 \\cdot R\\,du\\,dv = 2\\pi R^3H, \\qquad \\iint_S z\\,dS = \\int_0^H\\int_0^{2\\pi} vR\\,du\\,dv = \\pi RH^2$$\n\n对 $R = 6$、$H = 7$，二者分别为 $3024\\pi$ 与 $294\\pi$。\n\n> **注意。** 在柱面上 $x^2 + y^2 = R^2$，但 $dS$ 还带来一个因子 $R$，所以第一个积分是 $R^3$；第二个积分中 $\\int_0^H v\\,dv = \\frac{H^2}{2}$ 把 $2\\pi$ 减半。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 5);
        const H = rng.int(1, 6);
        const radial = rng.int(0, 1) === 0;
        const ans = radial ? 2 * R ** 3 * H : R * H * H;
        const f = radial ? "(x^2 + y^2)" : "z";
        const dS = R === 1 ? "du\\,dv" : `${R}\\,du\\,dv`;
        return numberProblem({
          prompt: t(
            `$S$ is the cylinder $x^2 + y^2 = ${R * R}$, $0 \\le z \\le ${H}$. Find $\\frac{1}{\\pi}\\iint_S ${f}\\,dS$.`,
            `$S$ 是圆柱面 $x^2 + y^2 = ${R * R}$，$0 \\le z \\le ${H}$。求 $\\frac{1}{\\pi}\\iint_S ${f}\\,dS$。`,
          ),
          answer: ans,
          mistakes: distinct(
            ans,
            radial
              ? [
                  why(
                    2 * R * R * H,
                    `That leaves out the factor $R$ in $dS = ${R}\\,du\\,dv$.`,
                    `那是漏掉了 $dS = ${R}\\,du\\,dv$ 中的因子 $R$。`,
                  ),
                  why(
                    R ** 3 * H,
                    "That drops the $2$ in the $2\\pi$ from going around the cylinder.",
                    "那是漏掉了绕柱面一周得到的 $2\\pi$ 中的 $2$。",
                  ),
                  why(
                    2 * R ** 4 * H,
                    "That uses $R^2$ twice; $dS$ carries $R$, not $R^2$.",
                    "那是两次用了 $R^2$；$dS$ 带的是 $R$，不是 $R^2$。",
                  ),
                ]
              : [
                  why(
                    2 * R * H * H,
                    "That forgets the $\\frac{1}{2}$ in $\\int_0^H v\\,dv = \\frac{H^2}{2}$.",
                    "那是漏掉了 $\\int_0^H v\\,dv = \\frac{H^2}{2}$ 中的 $\\frac{1}{2}$。",
                  ),
                  why(
                    2 * R * H,
                    "That integrates $1$ in place of $z$, which gives the area.",
                    "那是对 $1$ 而不是对 $z$ 积分，得到的是面积。",
                  ),
                  why(H * H, `That leaves out the factor $R$ in $dS = ${R}\\,du\\,dv$.`, `那是漏掉了 $dS = ${R}\\,du\\,dv$ 中的因子 $R$。`),
                ],
          ),
          solution: walked(
            radial
              ? [
                  [
                    ["Find the area element", "求面积元"],
                    t(`On $S$, $dS = ${dS}$ and $x^2 + y^2 = ${R * R}$.`, `在 $S$ 上，$dS = ${dS}$，$x^2 + y^2 = ${R * R}$。`),
                  ],
                  [
                    ["Integrate", "积分"],
                    t(
                      `$\\int_0^{${H}}\\int_0^{2\\pi} ${R ** 3}\\,du\\,dv = ${ans}\\pi$, since the parameter rectangle has area $${2 * H}\\pi$.`,
                      `$\\int_0^{${H}}\\int_0^{2\\pi} ${R ** 3}\\,du\\,dv = ${ans}\\pi$，因为参数矩形的面积为 $${2 * H}\\pi$。`,
                    ),
                  ],
                ]
              : [
                  [["Find the area element", "求面积元"], t(`On $S$, $dS = ${dS}$ and $z = v$.`, `在 $S$ 上，$dS = ${dS}$，$z = v$。`)],
                  [
                    ["Integrate", "积分"],
                    t(
                      `$\\int_0^{${H}}\\int_0^{2\\pi} ${R === 1 ? "" : R}v\\,du\\,dv = 2\\pi \\cdot ${Q.of(R * H * H, 2).toLatex()} = ${ans}\\pi$.`,
                      `$\\int_0^{${H}}\\int_0^{2\\pi} ${R === 1 ? "" : R}v\\,du\\,dv = 2\\pi \\cdot ${Q.of(R * H * H, 2).toLatex()} = ${ans}\\pi$。`,
                    ),
                  ],
                ],
            radial
              ? t(
                  `The cylinder has area $${2 * R * H}\\pi$ and $x^2 + y^2$ is the constant $${R * R}$ on it, and $${times(R * R)}${2 * R * H} = ${ans}$.`,
                  `柱面面积为 $${2 * R * H}\\pi$，$x^2 + y^2$ 在其上恒为 $${R * R}$，而 $${times(R * R)}${2 * R * H} = ${ans}$。`,
                )
              : t(
                  `The cylinder has area $${2 * R * H}\\pi$ and the average height on it is $${Q.of(H, 2).toLatex()}$, and $${2 * R * H} \\cdot ${Q.of(H, 2).toLatex()} = ${ans}$.`,
                  `柱面面积为 $${2 * R * H}\\pi$，其上的平均高度为 $${Q.of(H, 2).toLatex()}$，而 $${2 * R * H} \\cdot ${Q.of(H, 2).toLatex()} = ${ans}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** surfaceIntegralsOverCartesianSurfaces integrates scalar functions over explicit graphs. */
export const surfaceIntegralsOverCartesianSurfaces: TopicDef = {
  id: "surface-integrals-over-cartesian-surfaces",
  title: t("Surface Integrals Over Cartesian Surfaces", "笛卡尔显式曲面上的第一型曲面积分"),
  summary: t(
    "For $z = g(x, y)$, $\\iint_S f(x, y, z)\\,dS = \\iint_D f(x, y, g(x, y))\\sqrt{1 + g_x^2 + g_y^2}\\,dA$.",
    "对于 $z = g(x, y)$，$\\iint_S f(x, y, z)\\,dS = \\iint_D f(x, y, g(x, y))\\sqrt{1 + g_x^2 + g_y^2}\\,dA$。",
  ),
  intro: t(
    "Evaluate $\\iint_S 2\\,dS$ over the part of the plane $z = 8x + 32y$ above the unit square $[0, 1] \\times [0, 1]$. Here $dS = \\sqrt{1 + 64 + 1024}\\,dA = 33\\,dA$, so the integral is $2 \\cdot 33 \\cdot 1 = 66$.\n\nCheck: the piece is the parallelogram spanned by $\\langle 1, 0, 8 \\rangle$ and $\\langle 0, 1, 32 \\rangle$, whose cross product $\\langle -8, -32, 1 \\rangle$ has length $\\sqrt{1089} = 33$; twice that area is $66$.\n\nIn this lesson we integrate functions over graphs $z = g(x, y)$ by writing $dS$ in terms of $dA$.",
    "计算 $\\iint_S 2\\,dS$，其中 $S$ 是平面 $z = 8x + 32y$ 在单位正方形 $[0, 1] \\times [0, 1]$ 上方的部分。这里 $dS = \\sqrt{1 + 64 + 1024}\\,dA = 33\\,dA$，所以积分为 $2 \\cdot 33 \\cdot 1 = 66$。\n\n检验：这一部分是由 $\\langle 1, 0, 8 \\rangle$ 与 $\\langle 0, 1, 32 \\rangle$ 张成的平行四边形，叉积 $\\langle -8, -32, 1 \\rangle$ 的长度为 $\\sqrt{1089} = 33$；该面积的两倍为 $66$。\n\n本课我们把 $dS$ 用 $dA$ 表示，在图像 $z = g(x, y)$ 上积分函数。",
  ),
  prerequisites: ["areas-of-surfaces"],
  encompasses: [{ topic: "areas-of-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-scalar-functions-over-graphs-z-equals-g-of-x-y",
      figure:
        multivariableDrawings7["surface-integrals-over-cartesian-surfaces#integrating-scalar-functions-over-graphs-z-equals-g-of-x-y"],
      title: t("Integrating scalar functions over graphs z = g(x, y)", "在显式图像曲面上计算标量函数积分"),
      explanation: t(
        "For a graph, the area element is the area in the horizontal plane times the square root of one plus the squares of the two partial derivatives. When integrating $f(x, y, z) = c$ over a planar surface $z = 2x + 2y$ where $\\sqrt{1 + g_x^2 + g_y^2} = 3$, the integral is $\\iint_S c\\,dS = 3c \\times \\text{Area}(D)$. With $c = 10$ over the unit square, it is $30$.\n\n> **Watch out.** The factor is $\\sqrt{1 + 2^2 + 2^2} = 3$: square the slopes and take the root, and do not drop it, since the tilted plane is larger than the rectangle below it.",
        "对于函数图像，面积微元等于水平面上的面积乘以 1 加两个偏导数平方和的平方根。在平面 $z = 2x + 2y$（根式系数 $\\sqrt{1 + g_x^2 + g_y^2} = 3$）上积分常数 $f(x, y, z) = c$ 时，积分值为 $\\iint_S c\\,dS = 3c \\times \\text{Area}(D)$。若 $c = 10$，区域为单位正方形，结果为 $30$。\n\n> **注意。** 因子是 $\\sqrt{1 + 2^2 + 2^2} = 3$：要把斜率平方再开平方，也不能省掉它，因为倾斜的平面比下方的矩形大。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 9);
        const W = rng.int(2, 8);
        const H = rng.int(2, 8);
        const factor = 3;
        const ans = c * factor * W * H;
        return numberProblem({
          prompt: t(
            `Evaluate the surface integral $\\iint_S ${c}\\,dS$ where $S$ is the plane $z = 2x + 2y$ lying over the rectangle $D = [0, ${W}] \\times [0, ${H}]$.`,
            `计算第一型曲面积分 $\\iint_S ${c}\\,dS$，其中曲面 $S$ 为平面 $z = 2x + 2y$ 位于矩形 $D = [0, ${W}] \\times [0, ${H}]$ 上方的部分。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * W * H,
              "That leaves out the factor $3$; the tilted plane is larger than the rectangle below.",
              "那是漏掉了因子 $3$；倾斜的平面比下方矩形大。",
            ),
            why(9 * c * W * H, "That uses $1 + 2^2 + 2^2 = 9$ without the square root.", "那是用了 $1 + 2^2 + 2^2 = 9$ 而没有开平方。"),
            why(
              5 * c * W * H,
              "That uses $1 + 2 + 2 = 5$; the slopes are squared and the root taken.",
              "那是用了 $1 + 2 + 2 = 5$；斜率要平方再开平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the area element", "求面积元"],
                t("$dS = \\sqrt{1 + 2^2 + 2^2}\\,dA = 3\\,dA$.", "$dS = \\sqrt{1 + 2^2 + 2^2}\\,dA = 3\\,dA$。"),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\iint_D ${c} \\cdot 3\\,dA = ${3 * c} \\cdot ${W} \\cdot ${H} = ${ans}$.`,
                  `$\\iint_D ${c} \\cdot 3\\,dA = ${3 * c} \\cdot ${W} \\cdot ${H} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The piece is spanned by $\\langle ${W}, 0, ${2 * W} \\rangle$ and $\\langle 0, ${H}, ${2 * H} \\rangle$, whose cross product $\\langle ${-2 * W * H}, ${-2 * W * H}, ${W * H} \\rangle$ has length $3 \\cdot ${W * H} = ${3 * W * H}$; and $${c} \\cdot ${3 * W * H} = ${ans}$.`,
              `这一部分由 $\\langle ${W}, 0, ${2 * W} \\rangle$ 与 $\\langle 0, ${H}, ${2 * H} \\rangle$ 张成，叉积 $\\langle ${-2 * W * H}, ${-2 * W * H}, ${W * H} \\rangle$ 的长度为 $3 \\cdot ${W * H} = ${3 * W * H}$；而 $${c} \\cdot ${3 * W * H} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-a-nonconstant-function-over-a-plane",
      figure: multivariableDrawings7["surface-integrals-over-cartesian-surfaces#integrating-a-nonconstant-function-over-a-plane"],
      title: t("Integrating a nonconstant function over a tilted plane", "在倾斜平面上积分非常数函数"),
      explanation: t(
        "For $S$ the graph of $z = px + qy$ over $D$, $dS = \\sqrt{1 + p^2 + q^2}\\,dA$ is a constant multiple of $dA$. So\n\n$$\\iint_S f\\,dS = \\sqrt{1 + p^2 + q^2}\\iint_D f(x, y, px + qy)\\,dA.$$\n\nFor $f = x$ over $[0, W] \\times [0, H]$ the remaining double integral is $\\frac{W^2H}{2}$. On $z = 12x + 12y$ over $[0, 2] \\times [0, 1]$, the factor is $17$ and $\\iint_S x\\,dS = 17 \\cdot 2 = 34$.\n\n> **Watch out.** Integrating $x$ squares and halves the side along $x$, not the side along $y$; and the factor $\\sqrt{1 + p^2 + q^2}$ still multiplies the result.",
        "若 $S$ 是 $z = px + qy$ 在 $D$ 上方的图形，则 $dS = \\sqrt{1 + p^2 + q^2}\\,dA$ 是 $dA$ 的常数倍。所以\n\n$$\\iint_S f\\,dS = \\sqrt{1 + p^2 + q^2}\\iint_D f(x, y, px + qy)\\,dA$$\n\n对 $[0, W] \\times [0, H]$ 上的 $f = x$，剩下的二重积分为 $\\frac{W^2H}{2}$。在 $z = 12x + 12y$ 上、$[0, 2] \\times [0, 1]$ 上方，因子为 $17$，$\\iint_S x\\,dS = 17 \\cdot 2 = 34$。\n\n> **注意。** 对 $x$ 积分时，平方并减半的是沿 $x$ 方向的边，而不是沿 $y$ 方向的边；因子 $\\sqrt{1 + p^2 + q^2}$ 仍要乘上去。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, k] = rng.pick([
          [2, 2, 3],
          [2, -2, 3],
          [-2, 2, 3],
          [4, 8, 9],
          [8, 4, 9],
          [-4, 8, 9],
        ] as const);
        const W = rng.int(1, 5);
        const H = rng.int(1, 5);
        const useY = rng.int(0, 1) === 1;
        const ans = useY ? Q.of(k * W * H * H, 2) : Q.of(k * W * W * H, 2);
        const v = useY ? "y" : "x";
        const flat = useY ? Q.of(W * H * H, 2) : Q.of(W * W * H, 2);
        const average = useY ? Q.of(H, 2) : Q.of(W, 2);
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_S ${v}\\,dS$, where $S$ is the part of the plane $z = ${poly([p, "x"], [q, "y"])}$ above $[0, ${W}] \\times [0, ${H}]$.`,
            `计算 $\\iint_S ${v}\\,dS$，其中 $S$ 是平面 $z = ${poly([p, "x"], [q, "y"])}$ 在 $[0, ${W}] \\times [0, ${H}]$ 上方的部分。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(flat, `That leaves out the factor $\\sqrt{1 + p^2 + q^2} = ${k}$.`, `那是漏掉了因子 $\\sqrt{1 + p^2 + q^2} = ${k}$。`),
            why(
              useY ? Q.of(k * W * W * H, 2) : Q.of(k * W * H * H, 2),
              `That squares the side along the other variable; integrating $${v}$ squares the side along $${v}$.`,
              `那是把另一个变量方向的边平方了；对 $${v}$ 积分时平方的是沿 $${v}$ 方向的边。`,
            ),
            why(
              Q.of(k * W * H),
              `That integrates $1$ in place of $${v}$, which gives the area of $S$.`,
              `那是对 $1$ 而不是对 $${v}$ 积分，得到的是 $S$ 的面积。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the area element", "求面积元"],
                t(`$dS = \\sqrt{1 + ${p * p} + ${q * q}}\\,dA = ${k}\\,dA$.`, `$dS = \\sqrt{1 + ${p * p} + ${q * q}}\\,dA = ${k}\\,dA$。`),
              ],
              [
                ["Integrate over D", "在 D 上积分"],
                t(`$\\iint_D ${v}\\,dA = ${flat.toLatex()}$.`, `$\\iint_D ${v}\\,dA = ${flat.toLatex()}$。`),
              ],
              [
                ["Multiply", "相乘"],
                t(`$${k} \\cdot ${flat.toLatex()} = ${ans.toLatex()}$.`, `$${k} \\cdot ${flat.toLatex()} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `$S$ has area $${k * W * H}$ and the average of $${v}$ over it is $${average.toLatex()}$, and $${k * W * H} \\cdot ${average.toLatex()} = ${ans.toLatex()}$.`,
              `$S$ 的面积为 $${k * W * H}$，$${v}$ 在其上的平均值为 $${average.toLatex()}$，而 $${k * W * H} \\cdot ${average.toLatex()} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** fluxInThreeDimensionalVectorFields introduces flux through oriented surfaces. */
export const fluxInThreeDimensionalVectorFields: TopicDef = {
  id: "flux-in-three-dimensional-vector-fields",
  title: t("Flux in Three-Dimensional Vector Fields", "三维向量场的通量概念"),
  summary: t(
    "The flux of a vector field $\\mathbf{F}$ across an oriented surface $S$ is $\\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dS = \\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$.",
    "向量场 $\\mathbf{F}$ 穿过有向曲面 $S$ 的通量为 $\\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dS = \\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$。",
  ),
  intro: t(
    "Find the upward flux of $\\mathbf{F} = \\langle 3, 1, 2 \\rangle$ through the disk $x^2 + y^2 \\le 4$ in the plane $z = 0$. With $\\mathbf{n} = \\mathbf{k}$, $\\mathbf{F} \\cdot \\mathbf{n} = 2$ at every point, and the disk has area $4\\pi$, so the flux is $8\\pi$.\n\nCheck: in one unit of time the fluid that crosses the disk fills a slanted cylinder with base area $4\\pi$ and height $2$, the vertical speed, whose volume is $8\\pi$.\n\nIn this lesson we compute the flux of a field through a flat oriented surface from the normal component of the field.",
    "求 $\\mathbf{F} = \\langle 3, 1, 2 \\rangle$ 穿过平面 $z = 0$ 内圆盘 $x^2 + y^2 \\le 4$ 的向上通量。取 $\\mathbf{n} = \\mathbf{k}$，处处 $\\mathbf{F} \\cdot \\mathbf{n} = 2$，圆盘面积为 $4\\pi$，所以通量为 $8\\pi$。\n\n检验：单位时间内穿过圆盘的流体填满一个底面积为 $4\\pi$、高为竖直速度 $2$ 的斜柱体，其体积为 $8\\pi$。\n\n本课我们由场的法向分量计算场穿过平坦有向曲面的通量。",
  ),
  prerequisites: ["surface-integrals-over-cartesian-surfaces"],
  encompasses: [{ topic: "surface-integrals-over-cartesian-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "definition-and-orientation-of-vector-flux",
      title: t("Definition and orientation of vector flux", "向量通量与曲面定向的定义"),
      explanation: t(
        "For a constant vector field $\\mathbf{F} = \\langle a, b, c \\rangle$ crossing a horizontal flat surface $S$ in the $xy$-plane with upward unit normal $\\mathbf{n} = \\mathbf{k}$, the flux is $\\iint_S \\mathbf{F} \\cdot \\mathbf{k}\\,dS = c \\times \\text{Area}(S)$. For $\\langle 1, 1, 10 \\rangle$ through the unit square, the flux is $10$.\n\n> **Watch out.** Only the component along the normal crosses the surface: $a$ and $b$ run parallel to the $xy$-plane and add nothing, so do not add them to $c$.",
        "对于常向量场 $\\mathbf{F} = \\langle a, b, c \\rangle$ 穿过 $xy$ 平面上具有向上单位法向量 $\\mathbf{n} = \\mathbf{k}$ 的平面曲面片 $S$，其通量为 $\\iint_S \\mathbf{F} \\cdot \\mathbf{k}\\,dS = c \\times \\text{Area}(S)$。对 $\\langle 1, 1, 10 \\rangle$ 穿过单位正方形，通量为 $10$。\n\n> **注意。** 只有沿法向的分量穿过曲面：$a$ 与 $b$ 平行于 $xy$ 平面，不起作用，所以不要把它们加到 $c$ 上。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const W = rng.int(2, 9);
        const H = rng.int(2, 9);
        const area = W * H;
        const flux = c * area;
        return numberProblem({
          prompt: t(
            `Calculate the upward flux of the uniform vector field $\\mathbf{F} = \\langle ${a}, ${b}, ${c} \\rangle$ through the rectangle $S = [0, ${W}] \\times [0, ${H}]$ in the $xy$-plane (oriented with normal $\\mathbf{n} = \\mathbf{k}$).`,
            `计算均匀向量场 $\\mathbf{F} = \\langle ${a}, ${b}, ${c} \\rangle$ 穿过位于 $xy$ 平面内的矩形区域 $S = [0, ${W}] \\times [0, ${H}]$（定向为向上法向 $\\mathbf{n} = \\mathbf{k}$）的向上通量。`,
          ),
          answer: flux,
          mistakes: distinct(flux, [
            why(
              a * area,
              "That uses the $x$-component, which runs along the rectangle; the normal is $\\mathbf{k}$.",
              "那是用了 $x$ 分量，它沿矩形方向；法向量是 $\\mathbf{k}$。",
            ),
            why(
              b * area,
              "That uses the $y$-component, which runs along the rectangle; the normal is $\\mathbf{k}$.",
              "那是用了 $y$ 分量，它沿矩形方向；法向量是 $\\mathbf{k}$。",
            ),
            why(
              (a + b + c) * area,
              "That adds all three components; only the one along the normal counts.",
              "那是把三个分量都加起来；只有沿法向的分量起作用。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the normal component", "取法向分量"],
                t(
                  `$\\mathbf{F} \\cdot \\mathbf{k} = \\langle ${a}, ${b}, ${c} \\rangle \\cdot \\langle 0, 0, 1 \\rangle = ${c}$.`,
                  `$\\mathbf{F} \\cdot \\mathbf{k} = \\langle ${a}, ${b}, ${c} \\rangle \\cdot \\langle 0, 0, 1 \\rangle = ${c}$。`,
                ),
              ],
              [
                ["Multiply by the area", "乘以面积"],
                t(`$${c} \\cdot ${W} \\cdot ${H} = ${flux}$.`, `$${c} \\cdot ${W} \\cdot ${H} = ${flux}$。`),
              ],
            ],
            t(
              `In one unit of time the fluid crossing $S$ fills a slanted box with base area $${area}$ and height $${c}$, the vertical speed, whose volume is $${flux}$.`,
              `单位时间内穿过 $S$ 的流体填满一个底面积为 $${area}$、高为竖直速度 $${c}$ 的斜长方体，其体积为 $${flux}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "flux-of-a-position-field-through-a-horizontal-square",
      figure: multivariableDrawings7["flux-in-three-dimensional-vector-fields#flux-of-a-position-field-through-a-horizontal-square"],
      title: t("Flux of a nonuniform field through a horizontal square", "非均匀场穿过水平正方形的通量"),
      explanation: t(
        "Flux adds up the normal component of the field over the surface: $\\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dS$. On the horizontal rectangle at height $z = h$ with upward normal $\\mathbf{n} = \\mathbf{k}$, only the $z$-component counts. For $\\mathbf{F} = \\langle x, y, z \\rangle$ that component is the constant $h$, so the flux is $h$ times the area, even though the field itself varies across the rectangle. At $z = 6$ over $[0, 2] \\times [0, 3]$, the flux is $36$.\n\n> **Watch out.** The height $h$ is the normal component, so it must multiply the area; and below the $xy$-plane, where $h < 0$, the upward flux is negative.",
        "通量把场的法向分量在曲面上累加：$\\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dS$。在高度 $z = h$、法向向上 $\\mathbf{n} = \\mathbf{k}$ 的水平矩形上，只有 $z$ 分量起作用。对 $\\mathbf{F} = \\langle x, y, z \\rangle$，该分量是常数 $h$，所以通量是 $h$ 乘以面积，尽管场本身在矩形上是变化的。在 $z = 6$ 处、$[0, 2] \\times [0, 3]$ 上，通量为 $36$。\n\n> **注意。** 高度 $h$ 就是法向分量，必须乘到面积上；在 $xy$ 平面下方 $h < 0$，向上的通量为负。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(1, 5);
        const H = rng.int(1, 5);
        const h = rng.nonZero(-4, 5);
        const k = rng.int(1, 3);
        const ans = k * h * W * H;
        const F = k === 1 ? "\\langle x, y, z \\rangle" : `${k}\\langle x, y, z \\rangle`;
        return numberProblem({
          prompt: t(
            `Find the upward flux of $\\mathbf{F} = ${F}$ through the rectangle $[0, ${W}] \\times [0, ${H}]$ in the plane $z = ${h}$.`,
            `求 $\\mathbf{F} = ${F}$ 穿过平面 $z = ${h}$ 内矩形 $[0, ${W}] \\times [0, ${H}]$ 的向上通量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              k * W * H,
              `That leaves out the height; on the rectangle the normal component is $${k * h}$.`,
              `那是漏掉了高度；在矩形上法向分量为 $${k * h}$。`,
            ),
            why(k * h * (W + H), "That multiplies by the sum of the sides; the flux uses the area.", "那是乘以两边之和；通量用的是面积。"),
            why(
              -ans,
              "That has the wrong sign; the normal points up, and the $z$-component is $kh$ itself.",
              "那是符号错了；法向量向上，$z$ 分量就是 $kh$ 本身。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the normal component", "取法向分量"],
                t(
                  `On $z = ${h}$, $\\mathbf{F} \\cdot \\mathbf{k} = ${k === 1 ? "" : `${k}`}z = ${k * h}$.`,
                  `在 $z = ${h}$ 上，$\\mathbf{F} \\cdot \\mathbf{k} = ${k === 1 ? "" : `${k}`}z = ${k * h}$。`,
                ),
              ],
              [
                ["Multiply by the area", "乘以面积"],
                t(`The rectangle has area $${W * H}$, so the flux is $${ans}$.`, `矩形面积为 $${W * H}$，所以通量为 $${ans}$。`),
              ],
            ],
            t(
              `With $\\mathbf{r}(u, v) = \\langle u, v, ${h} \\rangle$, $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$ points up and $\\mathbf{F} \\cdot \\langle 0, 0, 1 \\rangle = ${k * h}$, so $\\int_0^{${H}}\\int_0^{${W}} ${paren(k * h)}\\,du\\,dv = ${ans}$.`,
              `取 $\\mathbf{r}(u, v) = \\langle u, v, ${h} \\rangle$，$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$ 向上，$\\mathbf{F} \\cdot \\langle 0, 0, 1 \\rangle = ${k * h}$，所以 $\\int_0^{${H}}\\int_0^{${W}} ${paren(k * h)}\\,du\\,dv = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** fluxThroughClosedSurfaces discusses net outward flux through closed boundaries. */
export const fluxThroughClosedSurfaces: TopicDef = {
  id: "flux-through-closed-surfaces",
  title: t("Flux Through Closed Surfaces", "闭合曲面的通量与外法向"),
  summary: t(
    "For closed surfaces, the standard orientation uses outward-pointing normal vectors to measure net fluid flow leaving the enclosed region.",
    "对于闭合曲面，标准定向采用向外指向的法向量，用以度量流出所围几何区域的净流量。",
  ),
  intro: t(
    "Find the net outward flux of $\\mathbf{F} = \\langle 0, 0, z \\rangle$ through the surface of the unit cube $[0, 1]^3$. On the top, $z = 1$ and $\\mathbf{n} = \\mathbf{k}$, so the flux is $1$; on the bottom $z = 0$, so the flux is $0$; on the four sides $\\mathbf{F} \\cdot \\mathbf{n} = 0$. The net outward flux is $1$.\n\nCheck: $\\operatorname{div} \\mathbf{F} = 1$ and the cube has volume $1$, which agrees with the divergence theorem.\n\nIn this lesson we orient closed surfaces outward and add up the flux through all their pieces.",
    "求 $\\mathbf{F} = \\langle 0, 0, z \\rangle$ 穿过单位立方体 $[0, 1]^3$ 表面的净向外通量。在顶面 $z = 1$，$\\mathbf{n} = \\mathbf{k}$，通量为 $1$；在底面 $z = 0$，通量为 $0$；在四个侧面上 $\\mathbf{F} \\cdot \\mathbf{n} = 0$。净向外通量为 $1$。\n\n检验：$\\operatorname{div} \\mathbf{F} = 1$，立方体体积为 $1$，与散度定理一致。\n\n本课我们给闭合曲面取向外的定向，并把穿过各部分的通量加起来。",
  ),
  prerequisites: ["flux-in-three-dimensional-vector-fields"],
  encompasses: [{ topic: "flux-in-three-dimensional-vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "outward-orientation-and-net-flux-through-closed-surfaces",
      figure: multivariableDrawings7["flux-through-closed-surfaces#outward-orientation-and-net-flux-through-closed-surfaces"],
      title: t("Outward orientation and net flux through closed surfaces", "闭合曲面的外向定向与净外法向通量"),
      explanation: t(
        "For any uniform (constant) vector field $\\mathbf{F} = \\mathbf{C}$ through any closed surface $S$ bounding a solid region $E$, whatever flows in through one side leaves through the opposite side. The net outward flux is identically zero: $\\oiint_S \\mathbf{C} \\cdot d\\mathbf{S} = 0$. So $\\langle 1, 1, 1 \\rangle$ has zero net flux out of the unit sphere.\n\n> **Watch out.** Opposite faces have opposite outward normals, so their fluxes cancel in pairs; adding the face fluxes without their signs, or using the volume, is wrong.",
        "对于任意常向量场 $\\mathbf{F} = \\mathbf{C}$ 穿过包围有界区域 $E$ 的任意闭合曲面 $S$，流入量与流出量处处相互抵消。净外向通量恒等于零：$\\oiint_S \\mathbf{C} \\cdot d\\mathbf{S} = 0$。所以 $\\langle 1, 1, 1 \\rangle$ 穿出单位球面的净通量为零。\n\n> **注意。** 相对的两个面外法向相反，所以它们的通量成对抵消；不计符号地把各面通量相加，或者用体积，都是错的。",
      ),
      generate(rng: Rng): Problem {
        const cx = rng.int(2, 9);
        const cy = rng.int(2, 9);
        const cz = rng.int(2, 9);
        const L = rng.int(2, 8);
        const W = rng.int(2, 8);
        const H = rng.int(2, 8);
        const vol = L * W * H;
        return numberProblem({
          prompt: t(
            `Find the net outward flux $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of the constant vector field $\\mathbf{F} = \\langle ${cx}, ${cy}, ${cz} \\rangle$ across the closed surface of the rectangular box $[0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$.`,
            `求常向量场 $\\mathbf{F} = \\langle ${cx}, ${cy}, ${cz} \\rangle$ 穿过长方体 $[0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$ 闭合外表面的净外向通量 $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
          ),
          answer: 0,
          mistakes: distinct(0, [
            why(
              vol,
              "That is the volume of the box; a constant field has no net flux out of it.",
              "那是长方体的体积；常向量场穿出它的净通量为零。",
            ),
            why(
              cx * W * H,
              `That counts only the face $x = ${L}$; the opposite face $x = 0$ cancels it.`,
              `那是只算了面 $x = ${L}$；相对的面 $x = 0$ 把它抵消了。`,
            ),
            why(
              cx * W * H + cy * L * H + cz * L * W,
              "That adds the flux out of three faces and forgets the three opposite faces, where the field flows in.",
              "那是只加了三个面的流出量，忘了场从相对的三个面流入。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Pair the faces x = 0 and x = L", "配对面 x = 0 与 x = L"],
                t(
                  `Through $x = ${L}$ the flux is $${cx} \\cdot ${W * H} = ${cx * W * H}$, and through $x = 0$, with normal $-\\mathbf{i}$, it is $${-cx * W * H}$.`,
                  `穿过 $x = ${L}$ 的通量为 $${cx} \\cdot ${W * H} = ${cx * W * H}$，穿过法向为 $-\\mathbf{i}$ 的 $x = 0$ 的通量为 $${-cx * W * H}$。`,
                ),
              ],
              [
                ["Pair the other faces", "配对其余各面"],
                t(
                  `In the same way $${cy * L * H}$ and $${-cy * L * H}$ cancel on the $y$-faces, and $${cz * L * W}$ and $${-cz * L * W}$ on the $z$-faces, so the net flux is $0$.`,
                  `同样，$y$ 面上 $${cy * L * H}$ 与 $${-cy * L * H}$ 抵消，$z$ 面上 $${cz * L * W}$ 与 $${-cz * L * W}$ 抵消，所以净通量为 $0$。`,
                ),
              ],
            ],
            t(
              `A constant field has $\\operatorname{div} \\mathbf{F} = 0$, and the divergence theorem gives $\\iiint_E 0\\,dV = 0$ as well.`,
              `常向量场的 $\\operatorname{div} \\mathbf{F} = 0$，散度定理同样给出 $\\iiint_E 0\\,dV = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "outward-flux-of-a-radial-field-through-a-sphere",
      figure: multivariableDrawings7["flux-through-closed-surfaces#outward-flux-of-a-radial-field-through-a-sphere"],
      title: t("Outward flux of a radial field through a sphere", "径向场穿过球面的向外通量"),
      explanation: t(
        "On the sphere $x^2 + y^2 + z^2 = R^2$ the outward unit normal is $\\mathbf{n} = \\frac{\\langle x, y, z \\rangle}{R}$. For the radial field $\\mathbf{F} = k\\langle x, y, z \\rangle$, $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{k(x^2 + y^2 + z^2)}{R} = kR$ is constant on the sphere. So the net outward flux is $kR$ times the area $4\\pi R^2$, that is $4\\pi kR^3$. For $k = 7$ through the unit sphere, the flux is $28\\pi$.\n\n> **Watch out.** The normal component is $kR$, not $k$, so the result has $R^3$; and it is the area $4\\pi R^2$ of the sphere that multiplies it, not the volume of the ball.",
        "在球面 $x^2 + y^2 + z^2 = R^2$ 上，向外单位法向量为 $\\mathbf{n} = \\frac{\\langle x, y, z \\rangle}{R}$。对径向场 $\\mathbf{F} = k\\langle x, y, z \\rangle$，$\\mathbf{F} \\cdot \\mathbf{n} = \\frac{k(x^2 + y^2 + z^2)}{R} = kR$ 在球面上为常数。所以净向外通量是 $kR$ 乘以面积 $4\\pi R^2$，即 $4\\pi kR^3$。对 $k = 7$ 穿过单位球面，通量为 $28\\pi$。\n\n> **注意。** 法向分量是 $kR$，不是 $k$，所以结果中是 $R^3$；乘上去的是球面面积 $4\\pi R^2$，而不是球体的体积。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-4, 6);
        const R = rng.int(1, 5);
        const ans = 4 * k * R ** 3;
        const F = k === 1 ? "\\langle x, y, z \\rangle" : k === -1 ? "-\\langle x, y, z \\rangle" : `${k}\\langle x, y, z \\rangle`;
        return numberProblem({
          prompt: t(
            `Find the net outward flux of $\\mathbf{F} = ${F}$ through the sphere $x^2 + y^2 + z^2 = ${R * R}$, divided by $\\pi$.`,
            `求 $\\mathbf{F} = ${F}$ 穿过球面 $x^2 + y^2 + z^2 = ${R * R}$ 的净向外通量除以 $\\pi$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              4 * k * R * R,
              `That uses $\\mathbf{F} \\cdot \\mathbf{n} = ${k}$; on the sphere it is $kR = ${k * R}$.`,
              `那是用了 $\\mathbf{F} \\cdot \\mathbf{n} = ${k}$；在球面上它是 $kR = ${k * R}$。`,
            ),
            why(
              Q.of(4 * k * R ** 3, 3),
              "That multiplies $k$ by the volume of the ball; the flux uses $kR$ times the area.",
              "那是用 $k$ 乘以球体体积；通量是 $kR$ 乘以面积。",
            ),
            why(
              0,
              "That treats the field as constant; a radial field points outward everywhere on the sphere.",
              "那是把场当作常向量场；径向场在球面上处处向外。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the normal component", "取法向分量"],
                t(
                  `$\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${k === 1 ? "" : k === -1 ? "-" : k}(x^2 + y^2 + z^2)}{${R}} = ${k * R}$ on the sphere.`,
                  `在球面上 $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${k === 1 ? "" : k === -1 ? "-" : k}(x^2 + y^2 + z^2)}{${R}} = ${k * R}$。`,
                ),
              ],
              [
                ["Multiply by the area", "乘以面积"],
                t(
                  `The sphere has area $${4 * R * R}\\pi$, so the flux is $${times(k * R)}${4 * R * R}\\pi = ${ans}\\pi$.`,
                  `球面面积为 $${4 * R * R}\\pi$，所以通量为 $${times(k * R)}${4 * R * R}\\pi = ${ans}\\pi$。`,
                ),
              ],
            ],
            t(
              `$\\operatorname{div} \\mathbf{F} = ${3 * k}$ and the ball has volume $${Q.of(4 * R ** 3, 3).toLatex()}\\pi$; their product is $${ans}\\pi$, as the divergence theorem requires.`,
              `$\\operatorname{div} \\mathbf{F} = ${3 * k}$，球体体积为 $${Q.of(4 * R ** 3, 3).toLatex()}\\pi$；两者之积为 $${ans}\\pi$，与散度定理一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingFluxThroughParametricSurfaces calculates flux using parametric cross products. */
export const calculatingFluxThroughParametricSurfaces: TopicDef = {
  id: "calculating-flux-through-parametric-surfaces",
  title: t("Calculating Flux Through Parametric Surfaces", "计算参数曲面的通量"),
  summary: t(
    "Flux through a parametric surface is $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_D \\mathbf{F}(\\mathbf{r}(u, v)) \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v)\\,du\\,dv$.",
    "穿过参数曲面的通量为 $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_D \\mathbf{F}(\\mathbf{r}(u, v)) \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v)\\,du\\,dv$。",
  ),
  intro: t(
    "Find the upward flux of $\\mathbf{F} = \\langle 0, 0, 5 \\rangle$ through $\\mathbf{r}(u, v) = \\langle u, v, 2u + 3v \\rangle$, $0 \\le u, v \\le 1$. Here $\\mathbf{r}_u = \\langle 1, 0, 2 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, 3 \\rangle$, so $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -2, -3, 1 \\rangle$, which points up. Then $\\mathbf{F} \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v) = 5$, and the flux is $\\int_0^1\\int_0^1 5\\,du\\,dv = 5$.\n\nCheck: a vertical field only sees the shadow of the surface on the $xy$-plane, here the unit square, so the flux is $5 \\cdot 1 = 5$.\n\nIn this lesson we compute flux through a parametric surface by dotting the field with $\\mathbf{r}_u \\times \\mathbf{r}_v$ and integrating over the parameter domain.",
    "求 $\\mathbf{F} = \\langle 0, 0, 5 \\rangle$ 穿过 $\\mathbf{r}(u, v) = \\langle u, v, 2u + 3v \\rangle$（$0 \\le u, v \\le 1$）的向上通量。这里 $\\mathbf{r}_u = \\langle 1, 0, 2 \\rangle$，$\\mathbf{r}_v = \\langle 0, 1, 3 \\rangle$，所以 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -2, -3, 1 \\rangle$，它指向上方。于是 $\\mathbf{F} \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v) = 5$，通量为 $\\int_0^1\\int_0^1 5\\,du\\,dv = 5$。\n\n检验：竖直的场只看曲面在 $xy$ 平面上的投影，这里是单位正方形，所以通量为 $5 \\cdot 1 = 5$。\n\n本课我们把场与 $\\mathbf{r}_u \\times \\mathbf{r}_v$ 作点积，再在参数区域上积分，求穿过参数曲面的通量。",
  ),
  prerequisites: ["flux-in-three-dimensional-vector-fields", "tangent-planes-to-parametric-surfaces"],
  encompasses: [{ topic: "flux-in-three-dimensional-vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "flux-computations-using-surface-parametrizations",
      title: t("Flux computations using surface parametrizations", "利用曲面参数方程计算向量通量"),
      explanation: t(
        "For a planar surface $\\mathbf{r}(u, v) = \\langle u, v, c u + d v \\rangle$ with normal $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -c, -d, 1 \\rangle$ and vector field $\\mathbf{F} = \\langle P, Q, R \\rangle$, the integrand is the constant dot product $-c P - d Q + R$. For $c = 5$, $d = 1$ and $\\mathbf{F} = \\langle 1, 1, 10 \\rangle$, it is $-5 - 1 + 10 = 4$, and over $[0, 1] \\times [0, 1]$ the flux is $4$.\n\n> **Watch out.** The normal has $-c$ and $-d$ in it, so $P$ and $Q$ are subtracted, not added; and the dot product is the flux per unit of parameter area, so it still has to be multiplied by the area of $D$.",
        "对于参数平面 $\\mathbf{r}(u, v) = \\langle u, v, c u + d v \\rangle$（法向量 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -c, -d, 1 \\rangle$）及向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$，被积函数为常数点积 $-c P - d Q + R$。当 $c = 5$、$d = 1$、$\\mathbf{F} = \\langle 1, 1, 10 \\rangle$ 时，它等于 $-5 - 1 + 10 = 4$，在 $[0, 1] \\times [0, 1]$ 上通量为 $4$。\n\n> **注意。** 法向量中是 $-c$ 与 $-d$，所以 $P$ 与 $Q$ 要减去而不是加上；点积是单位参数面积上的通量，还要乘以 $D$ 的面积。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 4);
        const d = rng.int(1, 4);
        const P = rng.int(1, 5);
        const Qy = rng.int(1, 5);
        const R = rng.int(20, 40);
        const U = rng.int(2, 6);
        const V = rng.int(2, 6);
        const dot = -c * P - d * Qy + R;
        const flux = dot * U * V;
        const plane = `${poly([c, "u"])} + ${poly([d, "v"])}`;
        return numberProblem({
          prompt: t(
            `Find the upward flux $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of $\\mathbf{F} = \\langle ${P}, ${Qy}, ${R} \\rangle$ across the parametric surface $\\mathbf{r}(u, v) = \\langle u, v, ${plane} \\rangle$ over $D = [0, ${U}] \\times [0, ${V}]$.`,
            `计算向量场 $\\mathbf{F} = \\langle ${P}, ${Qy}, ${R} \\rangle$ 穿过参数曲面 $\\mathbf{r}(u, v) = \\langle u, v, ${plane} \\rangle$（定义在 $D = [0, ${U}] \\times [0, ${V}]$，定向取向上）的通量 $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
          ),
          answer: flux,
          mistakes: distinct(flux, [
            why(
              R * U * V,
              "That keeps only the vertical component of $\\mathbf{F}$; the tilted normal also has $x$- and $y$-components.",
              "那是只保留了 $\\mathbf{F}$ 的竖直分量；倾斜的法向量还有 $x$ 与 $y$ 分量。",
            ),
            why(
              (c * P + d * Qy + R) * U * V,
              `That drops the minus signs in the normal $\\langle ${-c}, ${-d}, 1 \\rangle$, so $P$ and $Q$ are added instead of subtracted.`,
              `那是漏了法向量 $\\langle ${-c}, ${-d}, 1 \\rangle$ 中的负号，把 $P$ 与 $Q$ 加上而不是减去。`,
            ),
            why(
              dot,
              `That is the dot product alone; it must be multiplied by the area $${U * V}$ of $D$.`,
              `那只是点积；还要乘以 $D$ 的面积 $${U * V}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the tangent vectors", "求切向量"],
                t(
                  `$\\mathbf{r}_u = \\langle 1, 0, ${c} \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, ${d} \\rangle$.`,
                  `$\\mathbf{r}_u = \\langle 1, 0, ${c} \\rangle$，$\\mathbf{r}_v = \\langle 0, 1, ${d} \\rangle$。`,
                ),
              ],
              [
                ["Take the cross product", "作叉积"],
                t(
                  `$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${-c}, ${-d}, 1 \\rangle$, which points up.`,
                  `$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${-c}, ${-d}, 1 \\rangle$，它指向上方。`,
                ),
              ],
              [["Dot with F", "与 F 作点积"], t(`$${-c * P} - ${d * Qy} + ${R} = ${dot}$.`, `$${-c * P} - ${d * Qy} + ${R} = ${dot}$。`)],
              [
                ["Integrate over D", "在 D 上积分"],
                t(
                  `$\\iint_D ${dot}\\,du\\,dv = ${dot} \\cdot ${U * V} = ${flux}$.`,
                  `$\\iint_D ${dot}\\,du\\,dv = ${dot} \\cdot ${U * V} = ${flux}$。`,
                ),
              ],
            ],
            t(
              `The normal is perpendicular to both tangent vectors: $${-c} + ${c} = 0$ and $${-d} + ${d} = 0$.`,
              `法向量与两个切向量都垂直：$${-c} + ${c} = 0$，$${-d} + ${d} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "outward-flux-through-a-cylinder",
      figure: multivariableDrawings7["calculating-flux-through-parametric-surfaces#outward-flux-through-a-cylinder"],
      title: t("Outward flux through the side of a cylinder", "穿过圆柱侧面的向外通量"),
      explanation: t(
        "For the cylinder $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$, the cross product $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R\\cos u, R\\sin u, 0 \\rangle$ points outward. The flux is $\\iint_D \\mathbf{F}(\\mathbf{r}(u, v)) \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v)\\,du\\,dv$. For $\\mathbf{F} = \\langle kx, ky, g(z) \\rangle$ the dot product is $kR^2$, and the $z$-component never contributes because the side's normal is horizontal. For $k = 1$, $R = 6$ and height $1$, the dot product is $36$ and the flux is $36 \\cdot 2\\pi = 72\\pi$.\n\n> **Watch out.** The field contributes $kR$ and the cross product another $R$, so the integrand is $kR^2$; and $u$ runs over $2\\pi$, so do not forget the $2$.",
        "对圆柱面 $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$，叉积 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R\\cos u, R\\sin u, 0 \\rangle$ 指向外侧。通量为 $\\iint_D \\mathbf{F}(\\mathbf{r}(u, v)) \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v)\\,du\\,dv$。对 $\\mathbf{F} = \\langle kx, ky, g(z) \\rangle$，点积为 $kR^2$，而 $z$ 分量从不起作用，因为侧面的法向量是水平的。当 $k = 1$、$R = 6$、高为 $1$ 时，点积为 $36$，通量为 $36 \\cdot 2\\pi = 72\\pi$。\n\n> **注意。** 场贡献 $kR$，叉积再贡献一个 $R$，所以被积函数是 $kR^2$；$u$ 走过 $2\\pi$，不要漏掉 $2$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-3, 4);
        const R = rng.int(1, 5);
        const H = rng.int(1, 6);
        const c = rng.int(1, 5);
        const ans = 2 * k * R * R * H;
        const third = rng.pick([`${c === 1 ? "" : c}z`, `z^2`, `${c}`]);
        return numberProblem({
          prompt: t(
            `Find the outward flux of $\\mathbf{F} = \\langle ${poly([k, "x"])}, ${poly([k, "y"])}, ${third} \\rangle$ through the side $x^2 + y^2 = ${R * R}$, $0 \\le z \\le ${H}$, of a cylinder, divided by $\\pi$.`,
            `求 $\\mathbf{F} = \\langle ${poly([k, "x"])}, ${poly([k, "y"])}, ${third} \\rangle$ 穿过圆柱侧面 $x^2 + y^2 = ${R * R}$（$0 \\le z \\le ${H}$）的向外通量除以 $\\pi$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              k * R * R * H,
              "That integrates $u$ over $\\pi$; it runs around the whole circle, over $2\\pi$.",
              "那是让 $u$ 只走过 $\\pi$；它绕整个圆走过 $2\\pi$。",
            ),
            why(
              2 * k * R * H,
              `That takes the integrand to be $${k * R}$, the normal component alone; the cross product has length $${R}$ as well.`,
              `那是把被积函数当成法向分量 $${k * R}$；叉积还有长度 $${R}$。`,
            ),
            why(
              2 * k * R ** 3 * H,
              `That counts the radius three times; the integrand is $${k}$ times $${R}^2$.`,
              `那是把半径算了三次；被积函数是 $${k}$ 乘以 $${R}^2$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize the side", "参数化侧面"],
                t(
                  `$\\mathbf{r}(u, v) = \\langle ${R === 1 ? "" : R}\\cos u, ${R === 1 ? "" : R}\\sin u, v \\rangle$ with $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${R === 1 ? "" : R}\\cos u, ${R === 1 ? "" : R}\\sin u, 0 \\rangle$.`,
                  `$\\mathbf{r}(u, v) = \\langle ${R === 1 ? "" : R}\\cos u, ${R === 1 ? "" : R}\\sin u, v \\rangle$，$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${R === 1 ? "" : R}\\cos u, ${R === 1 ? "" : R}\\sin u, 0 \\rangle$。`,
                ),
              ],
              [
                ["Dot with F", "与 F 作点积"],
                t(
                  `The $z$-component meets a $0$, so the dot product is $${k * R * R === 1 ? "" : k * R * R === -1 ? "-" : k * R * R}(\\cos^2 u + \\sin^2 u) = ${k * R * R}$.`,
                  `$z$ 分量与 $0$ 相乘，所以点积为 $${k * R * R === 1 ? "" : k * R * R === -1 ? "-" : k * R * R}(\\cos^2 u + \\sin^2 u) = ${k * R * R}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{${H}}\\int_0^{2\\pi} ${k * R * R}\\,du\\,dv = ${ans}\\pi$, so the answer is $${ans}$.`,
                  `$\\int_0^{${H}}\\int_0^{2\\pi} ${k * R * R}\\,du\\,dv = ${ans}\\pi$，所以答案为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `On the side, $\\mathbf{F} \\cdot \\mathbf{n} = ${k * R}$ and the area is $${2 * R * H}\\pi$; their product is $${ans}\\pi$.`,
              `在侧面上 $\\mathbf{F} \\cdot \\mathbf{n} = ${k * R}$，面积为 $${2 * R * H}\\pi$；两者之积为 $${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingFluxThroughCartesianSurfaces calculates flux across explicit graphs z = g(x, y). */
export const calculatingFluxThroughCartesianSurfaces: TopicDef = {
  id: "calculating-flux-through-cartesian-surfaces",
  title: t("Calculating Flux Through Cartesian Surfaces", "计算笛卡尔曲面的通量"),
  summary: t(
    "For $z = g(x, y)$ oriented upward and $\\mathbf{F} = \\langle P, Q, R \\rangle$, $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_D (-Pg_x - Qg_y + R)\\,dA$.",
    "对于向上定向的曲面 $z = g(x, y)$ 与 $\\mathbf{F} = \\langle P, Q, R \\rangle$，$\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_D (-Pg_x - Qg_y + R)\\,dA$。",
  ),
  intro: t(
    "Find the upward flux of $\\mathbf{F} = \\langle 1, 0, 0 \\rangle$ through the plane $z = 3x + y$ above $[0, 1] \\times [0, 1]$. Here $g_x = 3$ and $g_y = 1$, so $d\\mathbf{S} = \\langle -3, -1, 1 \\rangle\\,dA$ and $\\mathbf{F} \\cdot d\\mathbf{S} = -3\\,dA$. The flux is $-3 \\cdot 1 = -3$.\n\nCheck: the plane rises toward $+x$, so its upward normal leans toward $-x$, against the field; a negative flux is what we expect.\n\nIn this lesson we compute flux through graphs $z = g(x, y)$ with the upward normal $\\langle -g_x, -g_y, 1 \\rangle$.",
    "求 $\\mathbf{F} = \\langle 1, 0, 0 \\rangle$ 穿过平面 $z = 3x + y$ 在 $[0, 1] \\times [0, 1]$ 上方部分的向上通量。这里 $g_x = 3$，$g_y = 1$，所以 $d\\mathbf{S} = \\langle -3, -1, 1 \\rangle\\,dA$，$\\mathbf{F} \\cdot d\\mathbf{S} = -3\\,dA$。通量为 $-3 \\cdot 1 = -3$。\n\n检验：平面向 $+x$ 方向升高，所以它向上的法向量偏向 $-x$，与场方向相反；所以通量为负，符合预期。\n\n本课我们用向上的法向量 $\\langle -g_x, -g_y, 1 \\rangle$ 计算穿过图像 $z = g(x, y)$ 的通量。",
  ),
  prerequisites: ["flux-in-three-dimensional-vector-fields"],
  encompasses: [{ topic: "surface-integrals-over-cartesian-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "flux-through-explicit-surfaces-z-equals-g-of-x-y",
      figure: multivariableDrawings7["calculating-flux-through-cartesian-surfaces#flux-through-explicit-surfaces-z-equals-g-of-x-y"],
      title: t("Flux through explicit surfaces z = g(x, y)", "显式曲面 z = g(x, y) 上的通量计算公式"),
      explanation: t(
        "For an upward oriented graph, the normal vector comes from the partial derivatives, and the flux is the double integral of the field dotted with it. For $\\mathbf{F} = \\langle P, Q, R \\rangle$ and surface $z = g(x, y)$ oriented upward, the normal differential is $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle dA$. Thus $\\mathbf{F} \\cdot d\\mathbf{S} = (-P g_x - Q g_y + R)\\,dA$. For $z = 2x + 3y$ and $\\mathbf{F} = \\langle 2, 1, 10 \\rangle$, this is $(-4 - 3 + 10)\\,dA = 3\\,dA$, and above $[0, 1] \\times [0, 2]$ the flux is $6$.\n\n> **Watch out.** The slopes enter the normal with minus signs, so $Pg_x$ and $Qg_y$ are subtracted; and the integral is over the shadow $D$, whose area multiplies the constant integrand.",
        "对于向上定向的函数图像，法向量来自偏导数，通量就是向量场与它点积的二重积分。对于向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$ 与向上定向的曲面 $z = g(x, y)$，法向向量微元为 $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle dA$。因此 $\\mathbf{F} \\cdot d\\mathbf{S} = (-P g_x - Q g_y + R)\\,dA$。对 $z = 2x + 3y$ 与 $\\mathbf{F} = \\langle 2, 1, 10 \\rangle$，它等于 $(-4 - 3 + 10)\\,dA = 3\\,dA$，在 $[0, 1] \\times [0, 2]$ 上方通量为 $6$。\n\n> **注意。** 斜率带着负号进入法向量，所以 $Pg_x$ 与 $Qg_y$ 要减去；积分区域是投影 $D$，常数被积函数要乘以它的面积。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const P = rng.int(1, 6);
        const Qy = rng.int(1, 6);
        const R = rng.int(25, 50);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const dot = -P * a - Qy * b + R;
        const flux = dot * W * H;
        const plane = `${poly([a, "x"])} + ${poly([b, "y"])}`;
        return numberProblem({
          prompt: t(
            `Find the upward flux $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of $\\mathbf{F} = \\langle ${P}, ${Qy}, ${R} \\rangle$ through the plane $z = ${plane}$ above the rectangle $[0, ${W}] \\times [0, ${H}]$.`,
            `计算向量场 $\\mathbf{F} = \\langle ${P}, ${Qy}, ${R} \\rangle$ 穿过位于矩形 $[0, ${W}] \\times [0, ${H}]$ 上方的平面 $z = ${plane}$（向上定向）的通量 $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
          ),
          answer: flux,
          mistakes: distinct(flux, [
            why(
              R * W * H,
              "That keeps only the $R$ term, as if the plane were flat; its slopes tilt the normal.",
              "那是只保留了 $R$ 项，好像平面是水平的；它的斜率使法向量倾斜。",
            ),
            why(
              (P * a + Qy * b + R) * W * H,
              "That drops the minus signs of $-g_x$ and $-g_y$ in the upward normal.",
              "那是漏了向上法向量中 $-g_x$ 与 $-g_y$ 的负号。",
            ),
            why(
              dot,
              `That is the integrand alone; it must be multiplied by the area $${W * H}$ of the rectangle.`,
              `那只是被积函数；还要乘以矩形的面积 $${W * H}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the slopes", "求斜率"],
                t(
                  `$g_x = ${a}$ and $g_y = ${b}$, so $d\\mathbf{S} = \\langle ${-a}, ${-b}, 1 \\rangle\\,dA$.`,
                  `$g_x = ${a}$，$g_y = ${b}$，所以 $d\\mathbf{S} = \\langle ${-a}, ${-b}, 1 \\rangle\\,dA$。`,
                ),
              ],
              [["Dot with F", "与 F 作点积"], t(`$${-P * a} - ${Qy * b} + ${R} = ${dot}$.`, `$${-P * a} - ${Qy * b} + ${R} = ${dot}$。`)],
              [
                ["Integrate over the rectangle", "在矩形上积分"],
                t(`$${dot} \\cdot ${W * H} = ${flux}$.`, `$${dot} \\cdot ${W * H} = ${flux}$。`),
              ],
            ],
            t(
              `The normal $\\langle ${-a}, ${-b}, 1 \\rangle$ is perpendicular to the plane's direction $\\langle 1, 0, ${a} \\rangle$: $${-a} + ${a} = 0$; and its $z$-component is positive, so it points up.`,
              `法向量 $\\langle ${-a}, ${-b}, 1 \\rangle$ 与平面的方向 $\\langle 1, 0, ${a} \\rangle$ 垂直：$${-a} + ${a} = 0$；它的 $z$ 分量为正，所以指向上方。`,
            ),
          ),
        });
      },
    },
    {
      id: "upward-flux-through-a-paraboloid-over-a-rectangle",
      figure: multivariableDrawings7["calculating-flux-through-cartesian-surfaces#upward-flux-through-a-paraboloid-over-a-rectangle"],
      title: t("Upward flux through a curved graph", "穿过曲面图形的向上通量"),
      explanation: t(
        "For the graph $z = g(x, y)$ with upward orientation, $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle\\,dA$, so\n\n$$\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_D \\left(-Pg_x - Qg_y + R\\right)dA,$$\n\nwith $P$, $Q$, $R$ evaluated at $z = g(x, y)$. For $\\mathbf{F} = \\langle x, y, 4z \\rangle$ and $g = x^2 + y^2$ the integrand is $-2x^2 - 2y^2 + 4(x^2 + y^2) = 2(x^2 + y^2)$, and over $[0, 1] \\times [0, 1]$ the flux is $2 \\cdot \\frac{2}{3} = \\frac{4}{3}$.\n\n> **Watch out.** The slopes $g_x = 2x$ and $g_y = 2y$ vary, so $-Pg_x = -2x^2$, not $-2x$; and $R$ must be evaluated on the surface, where $z = x^2 + y^2$.",
        "对向上定向的图形 $z = g(x, y)$，$d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle\\,dA$，所以\n\n$$\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_D \\left(-Pg_x - Qg_y + R\\right)dA,$$\n\n其中 $P$、$Q$、$R$ 在 $z = g(x, y)$ 处取值。对 $\\mathbf{F} = \\langle x, y, 4z \\rangle$ 与 $g = x^2 + y^2$，被积函数为 $-2x^2 - 2y^2 + 4(x^2 + y^2) = 2(x^2 + y^2)$，在 $[0, 1] \\times [0, 1]$ 上通量为 $2 \\cdot \\frac{2}{3} = \\frac{4}{3}$。\n\n> **注意。** 斜率 $g_x = 2x$、$g_y = 2y$ 是变化的，所以 $-Pg_x = -2x^2$ 而不是 $-2x$；$R$ 要在曲面上取值，那里 $z = x^2 + y^2$。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(1, 4);
        const H = rng.int(1, 4);
        const k = rng.int(1, 3);
        // F = <x, y, k z>: integrand -2x^2 - 2y^2 + k(x^2 + y^2) = (k - 2)(x^2 + y^2).
        const base = Q.of(W ** 3 * H + W * H ** 3, 3);
        const ans = base.mul(Q.of(k - 2));
        const R = k === 1 ? "z" : `${k}z`;
        const last = k === 2 ? "\\iint_D 0\\,dA = 0" : `${k === 1 ? "-" : ""}\\iint_D (x^2 + y^2)\\,dA = ${ans.toLatex()}`;
        return numberProblem({
          prompt: t(
            `Find the upward flux of $\\mathbf{F} = \\langle x, y, ${R} \\rangle$ through the surface $z = x^2 + y^2$ above $[0, ${W}] \\times [0, ${H}]$.`,
            `求 $\\mathbf{F} = \\langle x, y, ${R} \\rangle$ 穿过曲面 $z = x^2 + y^2$ 在 $[0, ${W}] \\times [0, ${H}]$ 上方部分的向上通量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              base.mul(Q.of(k + 2)),
              "That drops the minus signs in $\\langle -g_x, -g_y, 1 \\rangle$, so the terms $2x^2$ and $2y^2$ are added.",
              "那是漏了 $\\langle -g_x, -g_y, 1 \\rangle$ 中的负号，把 $2x^2$ 与 $2y^2$ 加上了。",
            ),
            why(
              base.mul(Q.of(k)),
              "That keeps only the $R$ term; the slopes $2x$ and $2y$ tilt the normal and bring in $P$ and $Q$.",
              "那是只保留了 $R$ 项；斜率 $2x$ 与 $2y$ 使法向量倾斜，把 $P$ 与 $Q$ 也带了进来。",
            ),
            why(
              ans.neg(),
              "That uses the downward normal; the upward normal has $z$-component $+1$.",
              "那是用了向下的法向量；向上的法向量 $z$ 分量为 $+1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the slopes", "求斜率"],
                t(
                  "$g_x = 2x$ and $g_y = 2y$, so $d\\mathbf{S} = \\langle -2x, -2y, 1 \\rangle\\,dA$.",
                  "$g_x = 2x$，$g_y = 2y$，所以 $d\\mathbf{S} = \\langle -2x, -2y, 1 \\rangle\\,dA$。",
                ),
              ],
              [
                ["Form the integrand", "写出被积函数"],
                t(
                  `On the surface $${R} = ${k === 1 ? "" : k}(x^2 + y^2)$, so the integrand is $-2x^2 - 2y^2 + ${k === 1 ? "" : k}(x^2 + y^2) = ${poly([k - 2, "(x^2 + y^2)"]) || "0"}$.`,
                  `在曲面上 $${R} = ${k === 1 ? "" : k}(x^2 + y^2)$，所以被积函数为 $-2x^2 - 2y^2 + ${k === 1 ? "" : k}(x^2 + y^2) = ${poly([k - 2, "(x^2 + y^2)"]) || "0"}$。`,
                ),
              ],
              [
                ["Integrate over the rectangle", "在矩形上积分"],
                t(
                  `$\\iint_D (x^2 + y^2)\\,dA = \\frac{${W ** 3 * H} + ${W * H ** 3}}{3} = ${base.toLatex()}$, so the flux is $${last}$.`,
                  `$\\iint_D (x^2 + y^2)\\,dA = \\frac{${W ** 3 * H} + ${W * H ** 3}}{3} = ${base.toLatex()}$，所以通量为 $${last}$。`,
                ),
              ],
            ],
            t(
              `The average of $x^2 + y^2$ over $D$ is $\\frac{${W * W} + ${H * H}}{3}$ and $D$ has area $${W * H}$; their product is $${base.toLatex()}$, as found.`,
              `$x^2 + y^2$ 在 $D$ 上的平均值为 $\\frac{${W * W} + ${H * H}}{3}$，$D$ 的面积为 $${W * H}$；两者之积为 $${base.toLatex()}$，与所得一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingFluxThroughClosedSurfaces sums flux contributions across boundary faces. */
export const calculatingFluxThroughClosedSurfaces: TopicDef = {
  id: "calculating-flux-through-closed-surfaces",
  title: t("Calculating Flux Through Closed Surfaces", "分块计算闭合曲面的总通量"),
  summary: t(
    "The total outward flux across a piecewise-smooth closed surface is found by summing the individual flux integrals across each constituent face.",
    "穿过分片光滑闭合曲面的总外向通量等于穿过各个组成侧面的通量积分之和。",
  ),
  intro: t(
    "Find the outward flux of $\\mathbf{F} = \\langle x, 0, 0 \\rangle$ out of the cube $[0, 2]^3$. On the face $x = 2$, $\\mathbf{F} \\cdot \\mathbf{i} = 2$ over area $4$, giving $8$. On $x = 0$ the field is $\\mathbf{0}$, and on the other four faces $\\mathbf{F}$ is parallel to the face, so they give $0$. The total is $8$.\n\nCheck: $\\operatorname{div} \\mathbf{F} = 1$ and the cube has volume $8$.\n\nIn this lesson we find the flux out of a closed surface made of pieces by adding the flux through each piece with its outward normal.",
    "求 $\\mathbf{F} = \\langle x, 0, 0 \\rangle$ 从立方体 $[0, 2]^3$ 流出的通量。在面 $x = 2$ 上，$\\mathbf{F} \\cdot \\mathbf{i} = 2$，面积为 $4$，得 $8$。在 $x = 0$ 上场为 $\\mathbf{0}$，在其余四个面上 $\\mathbf{F}$ 平行于面，所以都得 $0$。总和为 $8$。\n\n检验：$\\operatorname{div} \\mathbf{F} = 1$，立方体体积为 $8$。\n\n本课我们用各块的外法向量求出穿过每一块的通量，再相加，得到穿出分块闭合曲面的通量。",
  ),
  prerequisites: ["flux-through-closed-surfaces", "calculating-flux-through-cartesian-surfaces"],
  encompasses: [{ topic: "flux-through-closed-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "summing-flux-over-piecewise-smooth-boundaries",
      title: t("Summing flux over piecewise-smooth boundaries", "分块累加求闭合曲面外向通量"),
      explanation: t(
        "For $\\mathbf{F} = \\langle a x, b y, c z \\rangle$ across a box $[0, L] \\times [0, W] \\times [0, H]$, the pairs of faces along each axis contribute $a L W H$, $b L W H$, and $c L W H$. The total outward flux is $(a + b + c) L W H$. For $\\mathbf{F} = \\langle x, 2y, 6z \\rangle$ out of the unit cube, the total is $1 + 2 + 6 = 9$.\n\n> **Watch out.** The faces through the origin give $0$ because the normal component of the field vanishes there, not because they cancel the far faces; so all three far faces count once each.",
        "对于向量场 $\\mathbf{F} = \\langle a x, b y, c z \\rangle$ 穿过长方体 $[0, L] \\times [0, W] \\times [0, H]$，三个坐标轴向的对面分别贡献 $a L W H$、$b L W H$ 与 $c L W H$。总外向通量为 $(a + b + c) L W H$。对 $\\mathbf{F} = \\langle x, 2y, 6z \\rangle$ 从单位立方体流出，总量为 $1 + 2 + 6 = 9$。\n\n> **注意。** 过原点的三个面给出 $0$，是因为那里场的法向分量为零，而不是因为它们抵消了远端的面；所以远端三个面各算一次。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 5);
        const L = rng.int(2, 6);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const vol = L * W * H;
        const flux = (a + b + c) * vol;
        return numberProblem({
          prompt: t(
            `Find the total outward flux $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of $\\mathbf{F} = \\langle ${poly([a, "x"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$ across the closed surface of the box $[0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$.`,
            `计算向量场 $\\mathbf{F} = \\langle ${poly([a, "x"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$ 穿过长方体 $[0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$ 闭合外表面的总外向通量 $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
          ),
          answer: flux,
          mistakes: distinct(flux, [
            why(
              vol,
              "That is the volume of the box; each pair of faces adds its coefficient times the volume.",
              "那是长方体的体积；每对面贡献的是系数乘以体积。",
            ),
            why(
              (a + b) * vol,
              `That forgets the face $z = ${H}$, which adds $${c * vol}$.`,
              `那是漏了面 $z = ${H}$，它贡献 $${c * vol}$。`,
            ),
            why(
              2 * flux,
              "That counts the faces through the origin like the far faces; the field has normal component $0$ there.",
              "那是把过原点的面当成与远端的面一样；场在那里的法向分量为 $0$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["The faces x = 0 and x = L", "面 x = 0 与 x = L"],
                t(
                  `On $x = ${L}$ the normal component is $${a * L}$ over area $${W * H}$, giving $${a * vol}$; on $x = 0$ it is $0$.`,
                  `在 $x = ${L}$ 上法向分量为 $${a * L}$，面积为 $${W * H}$，得 $${a * vol}$；在 $x = 0$ 上为 $0$。`,
                ),
              ],
              [
                ["The other faces", "其余各面"],
                t(
                  `In the same way $y = ${W}$ gives $${b * vol}$ and $z = ${H}$ gives $${c * vol}$, while the faces through the origin give $0$.`,
                  `同样，$y = ${W}$ 得 $${b * vol}$，$z = ${H}$ 得 $${c * vol}$，过原点的面都得 $0$。`,
                ),
              ],
              [
                ["Add", "相加"],
                t(`$${a * vol} + ${b * vol} + ${c * vol} = ${flux}$.`, `$${a * vol} + ${b * vol} + ${c * vol} = ${flux}$。`),
              ],
            ],
            t(
              `$\\operatorname{div} \\mathbf{F} = ${a + b + c}$ and the box has volume $${vol}$; their product is $${flux}$, as the divergence theorem requires.`,
              `$\\operatorname{div} \\mathbf{F} = ${a + b + c}$，长方体体积为 $${vol}$；两者之积为 $${flux}$，与散度定理一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "face-by-face-flux-of-a-quadratic-field",
      title: t("Face-by-face flux of a quadratic field", "逐面计算二次场的通量"),
      explanation: t(
        "To find the flux out of a box face by face, note that on each face only one component of $\\mathbf{F}$ is normal. For $\\mathbf{F} = \\langle px^2, qy^2, rz^2 \\rangle$ on $[0, A] \\times [0, B] \\times [0, C]$, the faces through the origin contribute nothing, because there the normal component is $0$. On the face $x = A$ the normal component is $pA^2$ over area $BC$, and similarly for the other two, so the total is\n\n$$pA^2BC + qB^2AC + rC^2AB.$$\n\nFor $\\mathbf{F} = \\langle x^2, y^2, z^2 \\rangle$ out of $[0, 4]^3$, each far face gives $16 \\cdot 16 = 256$, and the total is $768$.\n\n> **Watch out.** On the face $x = A$ the normal component is $pA^2$, not $pA$; and its area is $BC$, the product of the other two sides.",
        "逐面计算长方体的通量时，注意每个面上只有 $\\mathbf{F}$ 的一个分量是法向的。对 $[0, A] \\times [0, B] \\times [0, C]$ 上的 $\\mathbf{F} = \\langle px^2, qy^2, rz^2 \\rangle$，过原点的三个面没有贡献，因为那里法向分量为 $0$。在面 $x = A$ 上法向分量为 $pA^2$，面积为 $BC$，另两个面同理，所以总量为\n\n$$pA^2BC + qB^2AC + rC^2AB$$\n\n对 $\\mathbf{F} = \\langle x^2, y^2, z^2 \\rangle$ 从 $[0, 4]^3$ 流出，每个远端面得 $16 \\cdot 16 = 256$，总量为 $768$。\n\n> **注意。** 在面 $x = A$ 上法向分量是 $pA^2$ 而不是 $pA$；它的面积是 $BC$，即另外两条边之积。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-3, 3);
        const q = rng.nonZero(-3, 3);
        const r = rng.nonZero(-3, 3);
        const A = rng.int(1, 3);
        const B = rng.int(1, 3);
        const C = rng.int(1, 3);
        const parts = [p * A * A * B * C, q * B * B * A * C, r * C * C * A * B];
        const ans = parts[0]! + parts[1]! + parts[2]!;
        const sum = parts.map((x) => paren(x)).join(" + ");
        return numberProblem({
          prompt: t(
            `Find the net outward flux of $\\mathbf{F} = \\langle ${poly([p, "x^2"])}, ${poly([q, "y^2"])}, ${poly([r, "z^2"])} \\rangle$ out of the box $[0, ${A}] \\times [0, ${B}] \\times [0, ${C}]$.`,
            `求 $\\mathbf{F} = \\langle ${poly([p, "x^2"])}, ${poly([q, "y^2"])}, ${poly([r, "z^2"])} \\rangle$ 从长方体 $[0, ${A}] \\times [0, ${B}] \\times [0, ${C}]$ 流出的净通量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * ans,
              "That counts the faces through the origin like the far faces; the normal component is $0$ there.",
              "那是把过原点的面当成与远端的面一样；那里法向分量为 $0$。",
            ),
            why(
              (p + q + r) * A * B * C,
              `That uses $pA$ for the normal component on $x = ${A}$; it is $pA^2$.`,
              `那是把 $x = ${A}$ 上的法向分量当成 $pA$；它是 $pA^2$。`,
            ),
            why(
              parts[0]! - parts[1]! + parts[2]!,
              `That gives the face $y = ${B}$ the inward normal; its outward normal is $+\\mathbf{j}$.`,
              `那是给面 $y = ${B}$ 取了向内的法向；它的外法向是 $+\\mathbf{j}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["The faces through the origin", "过原点的面"],
                t(
                  "On $x = 0$, $y = 0$ and $z = 0$ the normal component is $0$, so they give nothing.",
                  "在 $x = 0$、$y = 0$、$z = 0$ 上法向分量为 $0$，所以没有贡献。",
                ),
              ],
              [
                ["The far faces", "远端的面"],
                t(
                  `On $x = ${A}$ the normal component is $${p * A * A}$ over area $${B * C}$, giving $${parts[0]}$; likewise $y = ${B}$ gives $${parts[1]}$ and $z = ${C}$ gives $${parts[2]}$.`,
                  `在 $x = ${A}$ 上法向分量为 $${p * A * A}$，面积为 $${B * C}$，得 $${parts[0]}$；同样 $y = ${B}$ 得 $${parts[1]}$，$z = ${C}$ 得 $${parts[2]}$。`,
                ),
              ],
              [["Add", "相加"], t(`$${sum} = ${ans}$.`, `$${sum} = ${ans}$。`)],
            ],
            t(
              `$\\operatorname{div} \\mathbf{F} = ${poly([2 * p, "x"], [2 * q, "y"], [2 * r, "z"])}$, and $\\iiint_E ${poly([2 * p, "x"])}\\,dV = ${parts[0]}$ with the other two terms giving $${parts[1]}$ and $${parts[2]}$, the same sum.`,
              `$\\operatorname{div} \\mathbf{F} = ${poly([2 * p, "x"], [2 * q, "y"], [2 * r, "z"])}$，$\\iiint_E ${poly([2 * p, "x"])}\\,dV = ${parts[0]}$，另两项给出 $${parts[1]}$ 与 $${parts[2]}$，和相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theDivergenceTheorem relates outward flux across closed surfaces to volume divergence. */
export const theDivergenceTheorem: TopicDef = {
  id: "the-divergence-theorem",
  title: t("The Divergence Theorem", "高斯散度定理"),
  summary: t(
    "The divergence theorem (Gauss's theorem) states that $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\operatorname{div}\\mathbf{F}\\,dV$ for a closed surface $S$ bounding a solid $E$.",
    "散度定理（高斯定理）指出：对围成立体 $E$ 的闭曲面 $S$，向外通量等于散度的三重积分：$\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\operatorname{div}\\mathbf{F}\\,dV$。",
  ),
  intro: t(
    "Find the outward flux of $\\mathbf{F} = \\langle xy, yz, zx \\rangle$ out of the unit cube $[0, 1]^3$. Here $\\operatorname{div} \\mathbf{F} = y + z + x$, and $\\iiint_E (x + y + z)\\,dV = \\frac{1}{2} + \\frac{1}{2} + \\frac{1}{2} = \\frac{3}{2}$.\n\nCheck: on the face $x = 1$, $\\mathbf{F} \\cdot \\mathbf{i} = y$, whose integral over the face is $\\frac{1}{2}$; the faces $y = 1$ and $z = 1$ also give $\\frac{1}{2}$, and the faces through the origin give $0$, for a total of $\\frac{3}{2}$.\n\nIn this lesson we use the divergence theorem to replace the flux out of a closed surface by a triple integral of the divergence.",
    "求 $\\mathbf{F} = \\langle xy, yz, zx \\rangle$ 从单位立方体 $[0, 1]^3$ 流出的通量。这里 $\\operatorname{div} \\mathbf{F} = y + z + x$，$\\iiint_E (x + y + z)\\,dV = \\frac{1}{2} + \\frac{1}{2} + \\frac{1}{2} = \\frac{3}{2}$。\n\n检验：在面 $x = 1$ 上 $\\mathbf{F} \\cdot \\mathbf{i} = y$，它在该面上的积分为 $\\frac{1}{2}$；面 $y = 1$、$z = 1$ 也各得 $\\frac{1}{2}$，过原点的面得 $0$，总和为 $\\frac{3}{2}$。\n\n本课我们用散度定理把穿出闭合曲面的通量换成散度的三重积分。",
  ),
  prerequisites: [
    "calculating-flux-through-closed-surfaces",
    "the-divergence-of-a-vector-field",
    "triple-integrals-over-rectangular-domains",
  ],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-the-divergence-theorem-in-three-dimensions",
      title: t("Applying the Divergence Theorem in three dimensions", "在三维空间中应用高斯散度定理"),
      explanation: t(
        "The total flow out through a closed surface equals the total divergence inside, so a hard surface integral can become an easier triple integral. The Divergence Theorem converts a closed surface flux integral into a triple integral: $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\text{div}\\,\\mathbf{F}\\,dV$. For $\\mathbf{F} = \\langle 6x + y^2, y + z^2, z + x^2 \\rangle$ the divergence is $6 + 1 + 1 = 8$, so the flux out of the unit cube is $8$.\n\n> **Watch out.** A term such as $y^2$ in the first component does not depend on $x$, so it adds nothing to the divergence; and the constant divergence multiplies the volume of the box, not its surface area.",
        "穿过闭曲面向外的总流量等于内部散度的总和，所以困难的曲面积分可以化为更容易的三重积分。高斯散度定理将闭合曲面的通量积分转化为区域上的三重积分：$\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\text{div}\\,\\mathbf{F}\\,dV$。对 $\\mathbf{F} = \\langle 6x + y^2, y + z^2, z + x^2 \\rangle$，散度为 $6 + 1 + 1 = 8$，所以从单位立方体流出的通量为 $8$。\n\n> **注意。** 第一个分量中的 $y^2$ 这类项与 $x$ 无关，对散度没有贡献；常数散度乘的是长方体的体积，而不是它的表面积。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const c = rng.int(1, 5);
        const L = rng.int(2, 6);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const div = a + b + c;
        const vol = L * W * H;
        const ans = div * vol;
        const field = `\\langle ${poly([a, "x"])} + y^2, ${poly([b, "y"])} + z^2, ${poly([c, "z"])} + x^2 \\rangle`;
        return numberProblem({
          prompt: t(
            `Use the Divergence Theorem to find the outward flux $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of $\\mathbf{F} = ${field}$ across the boundary of the box $E = [0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$.`,
            `利用高斯散度定理求向量场 $\\mathbf{F} = ${field}$ 穿过长方体 $E = [0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$ 闭合边界的外向通量 $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(vol, `That is the volume alone; it must be multiplied by the divergence $${div}$.`, `那只是体积；还要乘以散度 $${div}$。`),
            why(
              div * 2 * (L * W + W * H + L * H),
              "That multiplies the divergence by the surface area of the box; the theorem integrates over its volume.",
              "那是用散度乘以长方体的表面积；定理是在体积上积分。",
            ),
            why(
              div * (L + W + H),
              "That multiplies the divergence by the sum of the side lengths; the theorem integrates over the volume.",
              "那是用散度乘以三条边长之和；定理是在体积上积分。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the divergence", "求散度"],
                t(
                  `$\\frac{\\partial}{\\partial x}(${poly([a, "x"])} + y^2) + \\frac{\\partial}{\\partial y}(${poly([b, "y"])} + z^2) + \\frac{\\partial}{\\partial z}(${poly([c, "z"])} + x^2) = ${a} + ${b} + ${c} = ${div}$.`,
                  `$\\frac{\\partial}{\\partial x}(${poly([a, "x"])} + y^2) + \\frac{\\partial}{\\partial y}(${poly([b, "y"])} + z^2) + \\frac{\\partial}{\\partial z}(${poly([c, "z"])} + x^2) = ${a} + ${b} + ${c} = ${div}$。`,
                ),
              ],
              [
                ["Find the volume", "求体积"],
                t(`The box has volume $${L} \\cdot ${W} \\cdot ${H} = ${vol}$.`, `长方体体积为 $${L} \\cdot ${W} \\cdot ${H} = ${vol}$。`),
              ],
              [
                ["Apply the theorem", "应用定理"],
                t(`$\\iiint_E ${div}\\,dV = ${div} \\cdot ${vol} = ${ans}$.`, `$\\iiint_E ${div}\\,dV = ${div} \\cdot ${vol} = ${ans}$。`),
              ],
            ],
            t(
              `Face by face: on $x = ${L}$ and $x = 0$ the term $y^2$ appears with opposite normals and cancels, leaving $${a * L} \\cdot ${W * H} = ${a * vol}$; the other pairs give $${b * vol}$ and $${c * vol}$, and $${a * vol} + ${b * vol} + ${c * vol} = ${ans}$.`,
              `逐面计算：在 $x = ${L}$ 与 $x = 0$ 上，$y^2$ 项的法向相反而抵消，剩下 $${a * L} \\cdot ${W * H} = ${a * vol}$；另两对面给出 $${b * vol}$ 与 $${c * vol}$，而 $${a * vol} + ${b * vol} + ${c * vol} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "divergence-theorem-on-a-sphere-or-cylinder",
      figure: multivariableDrawings7["the-divergence-theorem#divergence-theorem-on-a-sphere-or-cylinder"],
      title: t("The divergence theorem on a sphere or a cylinder", "球体或圆柱体上的散度定理"),
      explanation: t(
        "When the divergence is constant, the divergence theorem reduces the flux to divergence times volume: $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = (\\nabla \\cdot \\mathbf{F})\\,V$. For $\\mathbf{F} = \\langle ax, by, cz \\rangle$, $\\nabla \\cdot \\mathbf{F} = a + b + c$. A ball of radius $R$ has volume $\\frac{4}{3}\\pi R^3$, and a solid cylinder of radius $R$ and height $H$ has volume $\\pi R^2H$, so no surface parametrization is needed at all. For $\\mathbf{F} = \\langle 5x, 5y, 5z \\rangle$ and the unit sphere, the divergence is $15$ and the flux is $15 \\cdot \\frac{4}{3}\\pi = 20\\pi$.\n\n> **Watch out.** Use the volume of the solid, not the area of its surface: $\\frac{4}{3}\\pi R^3$ for the ball, not $4\\pi R^2$; and the divergence is the sum $a + b + c$, not the product.",
        "当散度为常数时，散度定理把通量化为散度乘以体积：$\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = (\\nabla \\cdot \\mathbf{F})\\,V$。对 $\\mathbf{F} = \\langle ax, by, cz \\rangle$，$\\nabla \\cdot \\mathbf{F} = a + b + c$。半径为 $R$ 的球体体积为 $\\frac{4}{3}\\pi R^3$，半径 $R$、高 $H$ 的实心圆柱体积为 $\\pi R^2H$，所以根本不需要参数化曲面。对 $\\mathbf{F} = \\langle 5x, 5y, 5z \\rangle$ 与单位球面，散度为 $15$，通量为 $15 \\cdot \\frac{4}{3}\\pi = 20\\pi$。\n\n> **注意。** 用的是立体的体积，而不是表面的面积：球体是 $\\frac{4}{3}\\pi R^3$ 而不是 $4\\pi R^2$；散度是和 $a + b + c$，而不是积。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 4);
        const b = rng.nonZero(-3, 4);
        let c = rng.nonZero(-3, 4);
        if (a + b + c === 0) c += 1;
        if (c === 0) c = 2;
        const d = a + b + c;
        const R = rng.int(1, 4);
        const ball = rng.int(0, 1) === 0;
        const H = rng.int(1, 5);
        const ans = ball ? Q.of(4 * d * R ** 3, 3) : Q.of(d * R * R * H);
        const region = ball
          ? t(`the sphere $x^2 + y^2 + z^2 = ${R * R}$`, `球面 $x^2 + y^2 + z^2 = ${R * R}$`)
          : t(
              `the closed cylinder $x^2 + y^2 \\le ${R * R}$, $0 \\le z \\le ${H}$ (side, top and bottom)`,
              `封闭圆柱面 $x^2 + y^2 \\le ${R * R}$，$0 \\le z \\le ${H}$（侧面、顶面与底面）`,
            );
        const volume = ball ? Q.of(4 * R ** 3, 3) : Q.of(R * R * H);
        const sum = `${a} + ${paren(b)} + ${paren(c)}`;
        const squares = poly([a, "x^2"], [b, "y^2"], [c, "z^2"]);
        const normal = R === 1 ? squares : `\\frac{${squares}}{${R}}`;
        return numberProblem({
          prompt: t(
            `Find the outward flux of $\\mathbf{F} = \\langle ${poly([a, "x"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$ through ${region.en}, divided by $\\pi$.`,
            `求 $\\mathbf{F} = \\langle ${poly([a, "x"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$ 穿过${region["zh-CN"]}的向外通量除以 $\\pi$。`,
          ),
          answer: ans,
          mistakes: distinct(
            ans,
            ball
              ? [
                  why(
                    Q.of(d * R ** 3),
                    "That forgets the factor $\\frac{4}{3}$ in the volume $\\frac{4}{3}\\pi R^3$ of the ball.",
                    "那是漏了球体体积 $\\frac{4}{3}\\pi R^3$ 中的因子 $\\frac{4}{3}$。",
                  ),
                  why(
                    Q.of(4 * d * R * R),
                    "That uses the area $4\\pi R^2$ of the sphere; the theorem integrates over the volume of the ball.",
                    "那是用了球面面积 $4\\pi R^2$；定理是在球体的体积上积分。",
                  ),
                  why(
                    Q.of(4 * a * b * c * R ** 3, 3),
                    "That multiplies the coefficients; the divergence is their sum.",
                    "那是把系数相乘；散度是它们的和。",
                  ),
                ]
              : [
                  why(
                    Q.of(d * R * H),
                    "That uses $\\pi R H$; the base of the cylinder has area $\\pi R^2$.",
                    "那是用了 $\\pi R H$；圆柱底面积是 $\\pi R^2$。",
                  ),
                  why(
                    Q.of(2 * d * R * R * H),
                    "That doubles the volume; a solid cylinder has volume $\\pi R^2 H$.",
                    "那是把体积加倍了；实心圆柱的体积是 $\\pi R^2 H$。",
                  ),
                  why(
                    Q.of(a * b * c * R * R * H),
                    "That multiplies the coefficients; the divergence is their sum.",
                    "那是把系数相乘；散度是它们的和。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Find the divergence", "求散度"],
                t(`$\\nabla \\cdot \\mathbf{F} = ${sum} = ${d}$.`, `$\\nabla \\cdot \\mathbf{F} = ${sum} = ${d}$。`),
              ],
              [
                ["Find the volume", "求体积"],
                ball
                  ? t(
                      `The ball has volume $\\frac{4}{3}\\pi \\cdot ${R}^3 = ${volume.toLatex()}\\pi$.`,
                      `球体体积为 $\\frac{4}{3}\\pi \\cdot ${R}^3 = ${volume.toLatex()}\\pi$。`,
                    )
                  : t(
                      `The cylinder has volume $\\pi \\cdot ${R}^2 \\cdot ${H} = ${volume.toLatex()}\\pi$.`,
                      `圆柱体积为 $\\pi \\cdot ${R}^2 \\cdot ${H} = ${volume.toLatex()}\\pi$。`,
                    ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `The flux is $${d} \\cdot ${volume.toLatex()}\\pi = ${ans.toLatex()}\\pi$, so the answer is $${ans.toLatex()}$.`,
                  `通量为 $${d} \\cdot ${volume.toLatex()}\\pi = ${ans.toLatex()}\\pi$，所以答案为 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            ball
              ? t(
                  `Directly: on the sphere $\\mathbf{F} \\cdot \\mathbf{n} = ${normal}$, and each of $x^2$, $y^2$, $z^2$ averages $${Q.of(R * R, 3).toLatex()}$ over it, so $\\mathbf{F} \\cdot \\mathbf{n}$ averages $${Q.of(d * R, 3).toLatex()}$; times the area $${4 * R * R}\\pi$ this is $${ans.toLatex()}\\pi$.`,
                  `直接计算：在球面上 $\\mathbf{F} \\cdot \\mathbf{n} = ${normal}$，$x^2$、$y^2$、$z^2$ 在其上的平均值都是 $${Q.of(R * R, 3).toLatex()}$，所以 $\\mathbf{F} \\cdot \\mathbf{n}$ 的平均值为 $${Q.of(d * R, 3).toLatex()}$；乘以面积 $${4 * R * R}\\pi$ 得 $${ans.toLatex()}\\pi$。`,
                )
              : t(
                  `Directly: the top gives $${c * H * R * R}\\pi$, the bottom $0$, and the side $${(a + b) * R * R * H}\\pi$; together $${d * R * R * H}\\pi$.`,
                  `直接计算：顶面得 $${c * H * R * R}\\pi$，底面得 $0$，侧面得 $${(a + b) * R * R * H}\\pi$；合计 $${d * R * R * H}\\pi$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** stokesTheorem equates circulation along a boundary curve to curl flux across the surface. */
export const stokesTheorem: TopicDef = {
  id: "stokes-theorem",
  title: t("Stokes' Theorem", "斯托克斯定理"),
  summary: t(
    "Stokes' theorem relates the circulation of a vector field around a boundary curve $C$ to the flux of its curl across the surface $S$: $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\operatorname{curl}\\mathbf{F}) \\cdot d\\mathbf{S}$.",
    "斯托克斯定理把向量场沿边界曲线 $C$ 的环量与其旋度穿过曲面 $S$ 的通量联系起来：$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\operatorname{curl}\\mathbf{F}) \\cdot d\\mathbf{S}$。",
  ),
  intro: t(
    "Find the circulation of $\\mathbf{F} = \\langle -y, x, 0 \\rangle$ counterclockwise around the unit circle in the $xy$-plane. Its curl is $\\langle 0, 0, 2 \\rangle$, and the unit disk, with upward normal, has area $\\pi$, so by Stokes' theorem the circulation is $2\\pi$.\n\nCheck: with $\\mathbf{r}(t) = \\langle \\cos t, \\sin t, 0 \\rangle$, $\\mathbf{F} \\cdot \\mathbf{r}'(t) = \\sin^2 t + \\cos^2 t = 1$, and $\\int_0^{2\\pi} 1\\,dt = 2\\pi$.\n\nIn this lesson we use Stokes' theorem to trade a circulation around a curve for the flux of the curl through a surface it bounds.",
    "求 $\\mathbf{F} = \\langle -y, x, 0 \\rangle$ 沿 $xy$ 平面内单位圆逆时针的环量。它的旋度为 $\\langle 0, 0, 2 \\rangle$，单位圆盘取向上的法向，面积为 $\\pi$，所以由斯托克斯定理环量为 $2\\pi$。\n\n检验：取 $\\mathbf{r}(t) = \\langle \\cos t, \\sin t, 0 \\rangle$，$\\mathbf{F} \\cdot \\mathbf{r}'(t) = \\sin^2 t + \\cos^2 t = 1$，而 $\\int_0^{2\\pi} 1\\,dt = 2\\pi$。\n\n本课我们用斯托克斯定理，把沿曲线的环量换成旋度穿过它所围曲面的通量。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form", "the-curl-of-a-vector-field", "calculating-flux-through-cartesian-surfaces"],
  encompasses: [{ topic: "greens-theorem-in-circulation-curl-form", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-line-and-surface-integrals-via-stokes-theorem",
      title: t("Evaluating line and surface integrals via Stokes' Theorem", "利用斯托克斯定理计算环量与旋度通量"),
      explanation: t(
        "Stokes' theorem says the circulation around a boundary curve equals the flux of the curl through any surface it bounds, so choose the easier one. For $\\mathbf{F} = \\langle -a y, a x, 0 \\rangle$, the curl is $\\text{curl}\\,\\mathbf{F} = \\langle 0, 0, 2a \\rangle$. For a flat surface $S$ in the $xy$-plane with upward normal $\\mathbf{k}$, $\\iint_S (\\text{curl}\\,\\mathbf{F}) \\cdot d\\mathbf{S} = 2a \\times \\text{Area}(S)$. For $a = 7$ and the unit square, the circulation is $14$.\n\n> **Watch out.** The $z$-component of the curl is $\\frac{\\partial}{\\partial x}(ax) - \\frac{\\partial}{\\partial y}(-ay) = a - (-a) = 2a$, not $a$ or $0$; and a counterclockwise boundary goes with the upward normal.",
        "斯托克斯公式说明，沿边界曲线的环量等于旋度穿过它所围任意曲面的通量，所以选择更容易计算的一个。对于向量场 $\\mathbf{F} = \\langle -a y, a x, 0 \\rangle$，其旋度为 $\\text{curl}\\,\\mathbf{F} = \\langle 0, 0, 2a \\rangle$。对于 $xy$ 平面内向上定向的平面片 $S$，$\\iint_S (\\text{curl}\\,\\mathbf{F}) \\cdot d\\mathbf{S} = 2a \\times \\text{Area}(S)$。当 $a = 7$、$S$ 为单位正方形时，环量为 $14$。\n\n> **注意。** 旋度的 $z$ 分量是 $\\frac{\\partial}{\\partial x}(ax) - \\frac{\\partial}{\\partial y}(-ay) = a - (-a) = 2a$，不是 $a$ 也不是 $0$；逆时针的边界对应向上的法向量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const W = rng.int(2, 8);
        const H = rng.int(2, 8);
        const area = W * H;
        const curlZ = 2 * a;
        const ans = curlZ * area;
        const F = `\\langle -${poly([a, "y"])}, ${poly([a, "x"])}, 0 \\rangle`;
        return numberProblem({
          prompt: t(
            `Use Stokes' Theorem to evaluate $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = ${F}$ along the counterclockwise boundary $C$ of the rectangle $[0, ${W}] \\times [0, ${H}]$ in the $xy$-plane.`,
            `利用斯托克斯定理计算 $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F} = ${F}$，$C$ 为 $xy$ 平面内矩形 $[0, ${W}] \\times [0, ${H}]$ 的逆时针边界。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * area,
              `That takes the curl to be $${a}$; it is $${a} - (${-a}) = ${curlZ}$.`,
              `那是把旋度当成 $${a}$；它是 $${a} - (${-a}) = ${curlZ}$。`,
            ),
            why(
              0,
              `That computes $${a} - ${a}$; the derivative of $-${poly([a, "y"])}$ in $y$ is $${-a}$, and subtracting it adds $${a}$.`,
              `那是算成了 $${a} - ${a}$；$-${poly([a, "y"])}$ 对 $y$ 的导数是 $${-a}$，减去它就是加上 $${a}$。`,
            ),
            why(
              curlZ * 2 * (W + H),
              "That multiplies the curl by the perimeter; the curl is integrated over the area of the rectangle.",
              "那是用旋度乘以周长；旋度要在矩形的面积上积分。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the curl", "求旋度"],
                t(
                  `$\\frac{\\partial}{\\partial x}(${poly([a, "x"])}) - \\frac{\\partial}{\\partial y}(-${poly([a, "y"])}) = ${a} - (${-a}) = ${curlZ}$, so $\\nabla \\times \\mathbf{F} = \\langle 0, 0, ${curlZ} \\rangle$.`,
                  `$\\frac{\\partial}{\\partial x}(${poly([a, "x"])}) - \\frac{\\partial}{\\partial y}(-${poly([a, "y"])}) = ${a} - (${-a}) = ${curlZ}$，所以 $\\nabla \\times \\mathbf{F} = \\langle 0, 0, ${curlZ} \\rangle$。`,
                ),
              ],
              [
                ["Choose the surface", "选取曲面"],
                t(
                  "Take the rectangle itself with normal $\\mathbf{k}$, which matches the counterclockwise boundary.",
                  "取矩形本身，法向为 $\\mathbf{k}$，与逆时针的边界一致。",
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\iint_S ${curlZ}\\,dA = ${curlZ} \\cdot ${area} = ${ans}$.`,
                  `$\\iint_S ${curlZ}\\,dA = ${curlZ} \\cdot ${area} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Directly: the bottom and left sides give $0$, the right side $x = ${W}$ gives $${a * W} \\cdot ${H} = ${a * area}$, and the top $y = ${H}$, traversed leftward, gives $${a * H} \\cdot ${W} = ${a * area}$; the total is $${ans}$.`,
              `直接计算：底边与左边得 $0$，右边 $x = ${W}$ 得 $${a * W} \\cdot ${H} = ${a * area}$，顶边 $y = ${H}$ 向左走，得 $${a * H} \\cdot ${W} = ${a * area}$；合计 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "stokes-theorem-on-a-tilted-triangle",
      figure: multivariableDrawings7["stokes-theorem#stokes-theorem-on-a-tilted-triangle"],
      title: t("Stokes' theorem on a tilted triangle", "倾斜三角形上的斯托克斯定理"),
      explanation: t(
        "Stokes' theorem replaces the circulation around $C$ by the flux of $\\nabla \\times \\mathbf{F}$ through any surface bounded by $C$. For $\\mathbf{F} = \\langle pz, qx, ry \\rangle$ the curl is the constant $\\langle r, p, q \\rangle$. Take the triangle with vertices $(a, 0, 0)$, $(0, a, 0)$, $(0, 0, a)$, oriented with normal pointing away from the origin. Its projections onto the three coordinate planes each have area $\\frac{a^2}{2}$, so the flux of a constant vector $\\langle A, B, C \\rangle$ through it is $(A + B + C)\\frac{a^2}{2}$. For $\\mathbf{F} = \\langle z, x, y \\rangle$ and $a = 6$, the curl is $\\langle 1, 1, 1 \\rangle$ and the circulation is $3 \\cdot 18 = 54$.\n\n> **Watch out.** Each projection is a right triangle of area $\\frac{a^2}{2}$, half of the square; and going from $(a, 0, 0)$ to $(0, a, 0)$ to $(0, 0, a)$ is counterclockwise seen from the first octant, so the normal is $\\langle 1, 1, 1 \\rangle$, not its negative.",
        "斯托克斯定理把沿 $C$ 的环量换成 $\\nabla \\times \\mathbf{F}$ 穿过任一以 $C$ 为边界的曲面的通量。对 $\\mathbf{F} = \\langle pz, qx, ry \\rangle$，旋度是常向量 $\\langle r, p, q \\rangle$。取顶点为 $(a, 0, 0)$、$(0, a, 0)$、$(0, 0, a)$ 的三角形，法向量背离原点。它在三个坐标平面上的投影面积都是 $\\frac{a^2}{2}$，所以常向量 $\\langle A, B, C \\rangle$ 穿过它的通量为 $(A + B + C)\\frac{a^2}{2}$。对 $\\mathbf{F} = \\langle z, x, y \\rangle$ 与 $a = 6$，旋度为 $\\langle 1, 1, 1 \\rangle$，环量为 $3 \\cdot 18 = 54$。\n\n> **注意。** 每个投影都是面积为 $\\frac{a^2}{2}$ 的直角三角形，是正方形的一半；从 $(a, 0, 0)$ 到 $(0, a, 0)$ 再到 $(0, 0, a)$，从第一卦限看是逆时针，所以法向量是 $\\langle 1, 1, 1 \\rangle$，而不是它的相反向量。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-3, 4);
        const q = rng.nonZero(-3, 4);
        const r = rng.nonZero(-3, 4);
        const a = rng.int(1, 5);
        const ans = Q.of((p + q + r) * a * a, 2);
        const half = Q.of(a * a, 2).toLatex();
        const side = `${a === 1 ? "" : a}\\sqrt{2}`;
        return numberProblem({
          prompt: t(
            `$C$ is the boundary of the triangle with vertices $(${a}, 0, 0)$, $(0, ${a}, 0)$, $(0, 0, ${a})$, traversed in that order. Use Stokes' theorem to find $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle ${poly([p, "z"])}, ${poly([q, "x"])}, ${poly([r, "y"])} \\rangle$.`,
            `$C$ 是顶点为 $(${a}, 0, 0)$、$(0, ${a}, 0)$、$(0, 0, ${a})$ 的三角形边界，按此顺序绕行。用斯托克斯定理求 $\\mathbf{F} = \\langle ${poly([p, "z"])}, ${poly([q, "x"])}, ${poly([r, "y"])} \\rangle$ 的 $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              ans.neg(),
              "That uses the normal pointing toward the origin; this order of the vertices goes with the normal pointing away from it.",
              "那是用了指向原点的法向量；这样的顶点顺序对应背离原点的法向量。",
            ),
            why(
              Q.of((p + q + r) * a * a),
              "That uses the whole cross product of two edges; the triangle is half the parallelogram, so each projection has area $\\frac{a^2}{2}$.",
              "那是用了两条边的整个叉积；三角形是平行四边形的一半，所以每个投影面积为 $\\frac{a^2}{2}$。",
            ),
            why(
              Q.of((p + q + r) * a * a, 6),
              "That divides by $6$ as for the volume of the tetrahedron; the projections are triangles of area $\\frac{a^2}{2}$.",
              "那是像四面体体积那样除以 $6$；投影是面积为 $\\frac{a^2}{2}$ 的三角形。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the curl", "求旋度"],
                t(
                  `$\\nabla \\times \\mathbf{F} = \\langle ${r}, ${p}, ${q} \\rangle$.`,
                  `$\\nabla \\times \\mathbf{F} = \\langle ${r}, ${p}, ${q} \\rangle$。`,
                ),
              ],
              [
                ["Find the area vector", "求面积向量"],
                t(
                  `Half the cross product of the edges $\\langle ${-a}, ${a}, 0 \\rangle$ and $\\langle ${-a}, 0, ${a} \\rangle$ is $\\langle ${half}, ${half}, ${half} \\rangle$, pointing away from the origin.`,
                  `两条边 $\\langle ${-a}, ${a}, 0 \\rangle$ 与 $\\langle ${-a}, 0, ${a} \\rangle$ 叉积的一半为 $\\langle ${half}, ${half}, ${half} \\rangle$，背离原点。`,
                ),
              ],
              [
                ["Dot the two", "作点积"],
                t(
                  `$(${r} + ${paren(p)} + ${paren(q)}) \\cdot ${half} = ${ans.toLatex()}$.`,
                  `$(${r} + ${paren(p)} + ${paren(q)}) \\cdot ${half} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The area vector has length $${half}\\sqrt{3}$, which is the area $\\frac{\\sqrt{3}}{4}(${side})^2$ of the triangle, an equilateral triangle with side $${side}$.`,
              `面积向量的长度为 $${half}\\sqrt{3}$，正是这个三角形的面积 $\\frac{\\sqrt{3}}{4}(${side})^2$，它是边长为 $${side}$ 的正三角形。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export Array
// ---------------------------------------------------------------------------

export const multivariableCalculusSurfaceIntegralTopics: readonly TopicDef[] = [
  // 5.24 Parametric Surfaces
  parametricSurfaces,
  tangentPlanesToParametricSurfaces,
  parametrizationsOfEllipsoidsAndCones,
  parametrizationsOfParaboloidsAndHyperboloids,
  parametrizationsOfCylinders,

  // 5.25 Surface Area (newly authored topics; 3 are reused from earlier calculus)
  areasOfParametricSurfaces,
  surfacesOfRevolution,
  areasOfSurfaces,

  // 5.26 Surface Integrals
  surfaceIntegralsOverParametricSurfaces,
  surfaceIntegralsOverCartesianSurfaces,
  fluxInThreeDimensionalVectorFields,
  fluxThroughClosedSurfaces,
  calculatingFluxThroughParametricSurfaces,
  calculatingFluxThroughCartesianSurfaces,
  calculatingFluxThroughClosedSurfaces,
  theDivergenceTheorem,
  stokesTheorem,
];
