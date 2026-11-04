import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { numberProblem, steps } from "../problems.ts";

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
  prerequisites: ["tangent-planes-to-surfaces"],
  encompasses: [{ topic: "tangent-planes-to-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-and-identifying-parametric-surfaces",
      title: t("Evaluating and identifying parametric surfaces", "计算并识别参数曲面"),
      explanation: t(
        "A parametric surface assigns a point in space to each pair of parameters, and eliminating the parameters often reveals a familiar equation. A parametric surface $\\mathbf{r}(u, v) = \\langle x(u, v), y(u, v), z(u, v) \\rangle$ maps pairs $(u, v) \\in D$ to points in $\\mathbb{R}^3$. For example, $\\mathbf{r}(u, v) = \\langle a u, b v, c u + d v \\rangle$ describes a plane.",
        "参数曲面给每一对参数指定空间中的一个点，消去参数常常能得到熟悉的方程。参数曲面 $\\mathbf{r}(u, v) = \\langle x(u, v), y(u, v), z(u, v) \\rangle$ 将参数对 $(u, v) \\in D$ 映射到 $\\mathbb{R}^3$ 中的空间点。例如 $\\mathbf{r}(u, v) = \\langle a u, b v, c u + d v \\rangle$ 描述一个平面。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const d = rng.int(2, 9);
        const u0 = rng.int(1, 6);
        const v0 = rng.int(1, 6);
        const z = c * u0 + d * v0;

        const prompt = t(
          `Find the $z$-coordinate of the point on the parametric surface $\\mathbf{r}(u, v) = \\langle ${a}u, ${b}v, ${c}u + ${d}v \\rangle$ corresponding to $(u, v) = (${u0}, ${v0})$.`,
          `求参数曲面 $\\mathbf{r}(u, v) = \\langle ${a}u, ${b}v, ${c}u + ${d}v \\rangle$ 在参数 $(u, v) = (${u0}, ${v0})$ 处对应空间点的 $z$ 坐标。`,
        );
        const solution = t(
          steps(
            `Substitute $u = ${u0}$ and $v = ${v0}$ into the $z$-component: $z(u, v) = ${c}u + ${d}v$.`,
            `Calculate: $z(${u0}, ${v0}) = ${c}(${u0}) + ${d}(${v0}) = ${c * u0} + ${d * v0} = ${z}$.`,
          ),
          steps(
            `将 $u = ${u0}$ 和 $v = ${v0}$ 代入 $z$ 分量函数：$z(u, v) = ${c}u + ${d}v$。`,
            `计算得：$z(${u0}, ${v0}) = ${c}(${u0}) + ${d}(${v0}) = ${c * u0} + ${d * v0} = ${z}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: z,
          wrong: [z + c, z - d, c * u0 * d * v0],
        });
      },
    },
    {
      id: "locating-a-point-by-inverting-the-parametrization",
      title: t("Locating a point by inverting the parametrization", "反解参数确定点的位置"),
      explanation: t(
        "To find the point of a parametric surface above a given $(x, y)$, solve the first two coordinate equations for the parameters and substitute them into the third. For $\\mathbf{r}(u, v) = \\langle au, bv, u^2 + v^2 \\rangle$, the point above $(X, Y)$ has $u = \\frac{X}{a}$ and $v = \\frac{Y}{b}$, so its height is $z = \\left(\\frac{X}{a}\\right)^2 + \\left(\\frac{Y}{b}\\right)^2$. This is also how a parametrization is turned into a Cartesian equation.",
        "要求参数曲面在给定 $(x, y)$ 上方的点，先由前两个坐标方程解出参数，再代入第三个。对 $\\mathbf{r}(u, v) = \\langle au, bv, u^2 + v^2 \\rangle$，$(X, Y)$ 上方的点有 $u = \\frac{X}{a}$，$v = \\frac{Y}{b}$，所以高度为 $z = \\left(\\frac{X}{a}\\right)^2 + \\left(\\frac{Y}{b}\\right)^2$。这也是把参数化转化为直角坐标方程的方法。",
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
          wrong: [X * X + Y * Y, a * u0 * u0 + b * v0 * v0, Math.abs(u0) + Math.abs(v0)],
          solution: t(
            `$${a}u = ${X}$ and $${b}v = ${Y}$ give $u = ${u0}$ and $v = ${v0}$, so $z = (${u0})^2 + (${v0})^2 = ${ans}$.`,
            `由 $${a}u = ${X}$ 与 $${b}v = ${Y}$ 得 $u = ${u0}$，$v = ${v0}$，所以 $z = (${u0})^2 + (${v0})^2 = ${ans}$。`,
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
  prerequisites: ["parametric-surfaces"],
  encompasses: [{ topic: "parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-normal-vectors-and-tangent-planes-for-parametric-surfaces",
      title: t("Finding normal vectors and tangent planes for parametric surfaces", "求参数曲面的法向量与切平面"),
      explanation: t(
        "The partial derivatives with respect to the two parameters are tangent to the surface, so their cross product is a normal vector. For $\\mathbf{r}(u, v) = \\langle u, v, a u^2 + b v^2 \\rangle$, the tangent vectors are $\\mathbf{r}_u = \\langle 1, 0, 2au \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, 2bv \\rangle$. The normal vector is $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -2au, -2bv, 1 \\rangle$.",
        "对两个参数的偏导数都与曲面相切，所以它们的叉积是一个法向量。对于 $\\mathbf{r}(u, v) = \\langle u, v, a u^2 + b v^2 \\rangle$，切向量为 $\\mathbf{r}_u = \\langle 1, 0, 2au \\rangle$ 和 $\\mathbf{r}_v = \\langle 0, 1, 2bv \\rangle$。其法向量为 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -2au, -2bv, 1 \\rangle$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const u0 = rng.int(1, 5);
        const v0 = rng.int(1, 5);
        const nx = -2 * a * u0;

        const prompt = t(
          `For the parametric surface $\\mathbf{r}(u, v) = \\langle u, v, ${a}u^2 + ${b}v^2 \\rangle$, find the $x$-component of the normal vector $\\mathbf{n} = \\mathbf{r}_u \\times \\mathbf{r}_v$ at the point where $(u, v) = (${u0}, ${v0})$.`,
          `对于参数曲面 $\\mathbf{r}(u, v) = \\langle u, v, ${a}u^2 + ${b}v^2 \\rangle$，求在 $(u, v) = (${u0}, ${v0})$ 处法向量 $\\mathbf{n} = \\mathbf{r}_u \\times \\mathbf{r}_v$ 的 $x$ 分量。`,
        );
        const solution = t(
          steps(
            `Compute the tangent vectors: $\\mathbf{r}_u = \\langle 1, 0, 2(${a})u \\rangle = \\langle 1, 0, ${2 * a}u \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, 2(${b})v \\rangle = \\langle 0, 1, ${2 * b}v \\rangle$.`,
            `Compute their cross product: $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -${2 * a}u, -${2 * b}v, 1 \\rangle$.`,
            `Evaluate at $u = ${u0}$: the $x$-component is $-${2 * a}(${u0}) = ${nx}$.`,
          ),
          steps(
            `计算偏导切向量：$\\mathbf{r}_u = \\langle 1, 0, 2(${a})u \\rangle = \\langle 1, 0, ${2 * a}u \\rangle$，$\\mathbf{r}_v = \\langle 0, 1, 2(${b})v \\rangle = \\langle 0, 1, ${2 * b}v \\rangle$。`,
            `计算叉积法向量：$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -${2 * a}u, -${2 * b}v, 1 \\rangle$。`,
            `在 $u = ${u0}$ 处求值：$x$ 分量为 $-${2 * a}(${u0}) = ${nx}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: nx,
          wrong: [-nx, nx - 2 * a, nx + 2],
        });
      },
    },
    {
      id: "where-a-tangent-plane-meets-the-z-axis",
      title: t("Where a tangent plane meets the $z$-axis", "切平面与 $z$ 轴的交点"),
      explanation: t(
        "The tangent plane at $\\mathbf{r}(u_0, v_0)$ has normal $\\mathbf{n} = \\mathbf{r}_u \\times \\mathbf{r}_v$ and equation $\\mathbf{n} \\cdot (\\langle x, y, z \\rangle - \\mathbf{r}(u_0, v_0)) = 0$. For $\\mathbf{r}(u, v) = \\langle u + v, u - v, uv \\rangle$, $\\mathbf{r}_u = \\langle 1, 1, v \\rangle$ and $\\mathbf{r}_v = \\langle 1, -1, u \\rangle$, so\n\n$$\\mathbf{n} = \\langle u + v,\\ v - u,\\ -2 \\rangle.$$\n\nSetting $x = y = 0$ in the plane's equation gives the height at which it crosses the $z$-axis.",
        "在 $\\mathbf{r}(u_0, v_0)$ 处的切平面法向量为 $\\mathbf{n} = \\mathbf{r}_u \\times \\mathbf{r}_v$，方程为 $\\mathbf{n} \\cdot (\\langle x, y, z \\rangle - \\mathbf{r}(u_0, v_0)) = 0$。对 $\\mathbf{r}(u, v) = \\langle u + v, u - v, uv \\rangle$，$\\mathbf{r}_u = \\langle 1, 1, v \\rangle$，$\\mathbf{r}_v = \\langle 1, -1, u \\rangle$，所以\n\n$$\\mathbf{n} = \\langle u + v,\\ v - u,\\ -2 \\rangle。$$\n\n在平面方程中令 $x = y = 0$，就得到它与 $z$ 轴相交的高度。",
      ),
      generate(rng: Rng): Problem {
        const u0 = rng.nonZero(-4, 4);
        const v0 = rng.nonZero(-4, 4);
        const P = [u0 + v0, u0 - v0, u0 * v0];
        const n = [u0 + v0, v0 - u0, -2];
        const ans = -u0 * v0;
        return numberProblem({
          prompt: t(
            `Find the $z$-coordinate where the tangent plane to $\\mathbf{r}(u, v) = \\langle u + v, u - v, uv \\rangle$ at $(u, v) = (${u0}, ${v0})$ crosses the $z$-axis.`,
            `求 $\\mathbf{r}(u, v) = \\langle u + v, u - v, uv \\rangle$ 在 $(u, v) = (${u0}, ${v0})$ 处的切平面与 $z$ 轴交点的 $z$ 坐标。`,
          ),
          answer: ans,
          wrong: [u0 * v0, 2 * u0 * v0, -2 * u0 * v0],
          solution: t(
            `The point is $(${P.join(", ")})$ and $\\mathbf{n} = \\langle ${n.join(", ")} \\rangle$. With $x = y = 0$: $${n[0]}(0 - ${P[0]! < 0 ? `(${P[0]})` : P[0]}) + ${n[1]! < 0 ? `(${n[1]})` : n[1]}(0 - ${P[1]! < 0 ? `(${P[1]})` : P[1]}) - 2(z - ${P[2]! < 0 ? `(${P[2]})` : P[2]}) = 0$, so $z = ${ans}$.`,
            `该点为 $(${P.join(", ")})$，$\\mathbf{n} = \\langle ${n.join(", ")} \\rangle$。令 $x = y = 0$：$${n[0]}(0 - ${P[0]! < 0 ? `(${P[0]})` : P[0]}) + ${n[1]! < 0 ? `(${n[1]})` : n[1]}(0 - ${P[1]! < 0 ? `(${P[1]})` : P[1]}) - 2(z - ${P[2]! < 0 ? `(${P[2]})` : P[2]}) = 0$，所以 $z = ${ans}$。`,
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
  prerequisites: ["parametric-surfaces"],
  encompasses: [{ topic: "parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "parameterizing-ellipsoidal-and-conical-surfaces",
      title: t("Parameterizing ellipsoidal and conical surfaces", "椭球面与锥面的参数方程表示"),
      explanation: t(
        "Use polar style parameters for the horizontal position, then express the height from the equation of the surface. A cone $z^2 = k^2(x^2 + y^2)$ can be parameterized by $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, k u \\rangle$ where $u \\ge 0$ is the radial distance and $v \\in [0, 2\\pi)$ is the angle.",
        "用类似极坐标的参数表示水平位置，再由曲面方程表示出高度。圆锥面 $z^2 = k^2(x^2 + y^2)$ 可参数化为 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, k u \\rangle$，其中 $u \\ge 0$ 为径向距离，$v \\in [0, 2\\pi)$ 为方位角。",
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
            wrong: [k * u, u * u, p + q, Math.abs(x + y)],
            solution: t(
              `The horizontal part of $\\mathbf{r}$ gives $x^2 + y^2 = u^2(\\cos^2 v + \\sin^2 v) = u^2$, so $u$ is the distance from the $z$-axis:${steps(`u = \\sqrt{${x * x} + ${y * y}} = ${u}`)}`,
              `$\\mathbf{r}$ 的水平部分给出 $x^2 + y^2 = u^2(\\cos^2 v + \\sin^2 v) = u^2$，所以 $u$ 是到 $z$ 轴的距离：${steps(`u = \\sqrt{${x * x} + ${y * y}} = ${u}`)}`,
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
          wrong: [m, c, k * c, k + m],
          solution: t(
            `Substitute the parametrization into the equation of the cone. Here $x^2 + y^2 = ${k * k}u^2$, so $z^2 = ${c} \\cdot ${k * k}u^2$, and $z \\ge 0$ gives $z = ${m} \\cdot ${k}u = ${k * m}u$. So $C = ${k * m}$.`,
            `把参数方程代入锥面方程。这里 $x^2 + y^2 = ${k * k}u^2$，所以 $z^2 = ${c} \\cdot ${k * k}u^2$，由 $z \\ge 0$ 得 $z = ${m} \\cdot ${k}u = ${k * m}u$。所以 $C = ${k * m}$。`,
          ),
        });
      },
    },
    {
      id: "a-point-on-a-parametrized-ellipsoid",
      title: t("A point on a parametrized ellipsoid", "参数化椭球面上的点"),
      explanation: t(
        "The ellipsoid $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ is parametrized by stretching spherical coordinates:\n\n$$\\mathbf{r}(\\phi, \\theta) = \\langle a\\sin\\phi\\cos\\theta,\\ b\\sin\\phi\\sin\\theta,\\ c\\cos\\phi \\rangle, \\quad 0 \\le \\phi \\le \\pi,\\ 0 \\le \\theta \\le 2\\pi.$$\n\nHere $\\phi$ is measured down from the positive $z$-axis, so $\\phi = 0$ is the top, $\\phi = \\frac{\\pi}{2}$ the equator and $\\phi = \\pi$ the bottom.",
        "椭球面 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ 由拉伸球坐标来参数化：\n\n$$\\mathbf{r}(\\phi, \\theta) = \\langle a\\sin\\phi\\cos\\theta,\\ b\\sin\\phi\\sin\\theta,\\ c\\cos\\phi \\rangle, \\quad 0 \\le \\phi \\le \\pi,\\ 0 \\le \\theta \\le 2\\pi。$$\n\n这里 $\\phi$ 从正 $z$ 轴向下量起，所以 $\\phi = 0$ 是顶点，$\\phi = \\frac{\\pi}{2}$ 是赤道，$\\phi = \\pi$ 是底点。",
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
        const line = askZ ? `z = ${c}\\cos ${lab} = ${ans.toLatex()}` : `x = ${a}\\sin ${lab}\\cos ${th} = ${ans.toLatex()}`;
        const sym = askZ ? "z" : "x";
        return numberProblem({
          prompt: t(
            `The ellipsoid $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ is parametrized by $\\langle ${a}\\sin\\phi\\cos\\theta, ${b}\\sin\\phi\\sin\\theta, ${c}\\cos\\phi \\rangle$. Find the $${sym}$-coordinate of the point with $\\phi = ${lab}$, $\\theta = ${th}$.`,
            `椭球面 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1$ 的参数化为 $\\langle ${a}\\sin\\phi\\cos\\theta, ${b}\\sin\\phi\\sin\\theta, ${c}\\cos\\phi \\rangle$。求 $\\phi = ${lab}$、$\\theta = ${th}$ 对应点的 $${sym}$ 坐标。`,
          ),
          answer: ans,
          wrong: [ans.neg(), Q.of(askZ ? c : a), Q.of(b * num, den), Q.of(askZ ? a * num : c * num, den)],
          solution: t(
            `Substitute $\\phi = ${lab}$ and $\\theta = ${th}$ into the $${sym}$-component, $${askZ ? `${c}\\cos\\phi` : `${a}\\sin\\phi\\cos\\theta`}$: $${line}$.`,
            `把 $\\phi = ${lab}$、$\\theta = ${th}$ 代入 $${sym}$ 分量 $${askZ ? `${c}\\cos\\phi` : `${a}\\sin\\phi\\cos\\theta`}$：$${line}$。`,
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
  prerequisites: ["parametric-surfaces"],
  encompasses: [{ topic: "parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "parameterizing-paraboloids-and-hyperbolic-surfaces",
      title: t("Parameterizing paraboloids and hyperbolic surfaces", "抛物面与双曲面的极坐标参数化"),
      explanation: t(
        "Writing the horizontal coordinates in polar form makes the sum of their squares a single parameter squared, which simplifies the height. For a paraboloid $z = a(x^2 + y^2)$, setting $x = u \\cos v$ and $y = u \\sin v$ yields $z = a u^2$. The surface is $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, a u^2 \\rangle$.",
        "把水平坐标写成极坐标形式，使它们的平方和变成一个参数的平方，从而化简高度。对于抛物面 $z = a(x^2 + y^2)$，令 $x = u \\cos v$，$y = u \\sin v$，可得 $z = a u^2$。参数方程为 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, a u^2 \\rangle$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const u = rng.int(2, 9);
        const z = a * u * u;

        const prompt = t(
          `For the paraboloid $z = ${a}(x^2 + y^2)$ parametrized by $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, ${a}u^2 \\rangle$, find the height $z$ when the radial parameter is $u = ${u}$.`,
          `对于由 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, ${a}u^2 \\rangle$ 参数化的抛物面 $z = ${a}(x^2 + y^2)$，当径向参数 $u = ${u}$ 时，求高度 $z$ 的值。`,
        );
        const solution = t(
          steps(
            `Substitute $u = ${u}$ into the $z$-coordinate formula $z = ${a}u^2$.`,
            `Calculate: $z = ${a}(${u})^2 = ${a}(${u * u}) = ${z}$.`,
          ),
          steps(`将 $u = ${u}$ 代入高度公式 $z = ${a}u^2$。`, `计算得：$z = ${a}(${u})^2 = ${a}(${u * u}) = ${z}$。`),
        );
        return numberProblem({
          prompt,
          solution,
          answer: z,
          wrong: [a * u, z + a, 2 * a * u * u],
        });
      },
    },
    {
      id: "cross-sections-of-a-hyperboloid-of-one-sheet",
      title: t("Cross-sections of a hyperboloid of one sheet", "单叶双曲面的截面"),
      explanation: t(
        "The hyperboloid of one sheet $\\frac{x^2 + y^2}{a^2} - \\frac{z^2}{c^2} = 1$ is parametrized by\n\n$$\\mathbf{r}(u, v) = \\left\\langle a\\sqrt{1 + u^2}\\cos v,\\ a\\sqrt{1 + u^2}\\sin v,\\ cu \\right\\rangle.$$\n\nFixing $u$ fixes the height $z = cu$, and the cross-section there is a circle of radius $a\\sqrt{1 + u^2}$. The narrowest circle, of radius $a$, is the waist at $z = 0$, and the circles widen in both directions.",
        "单叶双曲面 $\\frac{x^2 + y^2}{a^2} - \\frac{z^2}{c^2} = 1$ 的参数化为\n\n$$\\mathbf{r}(u, v) = \\left\\langle a\\sqrt{1 + u^2}\\cos v,\\ a\\sqrt{1 + u^2}\\sin v,\\ cu \\right\\rangle。$$\n\n固定 $u$ 就固定了高度 $z = cu$，那里的截面是半径为 $a\\sqrt{1 + u^2}$ 的圆。最窄的圆半径为 $a$，是 $z = 0$ 处的腰部，圆向上下两个方向逐渐变宽。",
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
          wrong: [a * a * (m * m - 1) || a * a + 1, a * a + h * h, a * a],
          solution: t(
            `At $z = ${h}$, $u = \\frac{${h}}{${c}} = ${m}$, so the radius squared is $${a * a}(1 + ${m * m}) = ${ans}$.`,
            `在 $z = ${h}$ 处 $u = \\frac{${h}}{${c}} = ${m}$，所以半径的平方为 $${a * a}(1 + ${m * m}) = ${ans}$。`,
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
  prerequisites: ["parametric-surfaces"],
  encompasses: [{ topic: "parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "parameterizing-cylindrical-surfaces",
      title: t("Parameterizing cylindrical surfaces", "圆柱面的柱坐标参数化"),
      explanation: t(
        "A cylinder keeps a fixed distance from its axis, so one parameter is the angle around the axis and the other is the height along it. For $\\mathbf{r}(u, v) = \\langle R \\cos u, R \\sin u, v \\rangle$, the tangent vectors are $\\mathbf{r}_u = \\langle -R \\sin u, R \\cos u, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$. The normal vector is $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R \\cos u, R \\sin u, 0 \\rangle$ with magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = R$.",
        "圆柱面到轴的距离固定，所以一个参数是绕轴的角度，另一个是沿轴的高度。对于 $\\mathbf{r}(u, v) = \\langle R \\cos u, R \\sin u, v \\rangle$，切向量为 $\\mathbf{r}_u = \\langle -R \\sin u, R \\cos u, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$。其法向量为 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R \\cos u, R \\sin u, 0 \\rangle$，模长恒为 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = R$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 15);
        const H = rng.int(2, 15);
        const ans = R;

        const prompt = t(
          `For the cylinder $x^2 + y^2 = ${R * R}$ parametrized by $\\mathbf{r}(u, v) = \\langle ${R} \\cos u, ${R} \\sin u, v \\rangle$ with $v \\in [0, ${H}]$, find the magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ of the normal vector.`,
          `对于由 $\\mathbf{r}(u, v) = \\langle ${R} \\cos u, ${R} \\sin u, v \\rangle$（$v \\in [0, ${H}]$）参数化的圆柱面 $x^2 + y^2 = ${R * R}$，求法向量的模长 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$。`,
        );
        const solution = t(
          steps(
            `Calculate tangent vectors: $\\mathbf{r}_u = \\langle -${R} \\sin u, ${R} \\cos u, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$.`,
            `Compute the cross product: $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${R} \\cos u, ${R} \\sin u, 0 \\rangle$.`,
            `Find the magnitude: $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = \\sqrt{(${R} \\cos u)^2 + (${R} \\sin u)^2 + 0^2} = \\sqrt{${R * R}(\\cos^2 u + \\sin^2 u)} = ${R}$.`,
          ),
          steps(
            `计算切向量：$\\mathbf{r}_u = \\langle -${R} \\sin u, ${R} \\cos u, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$。`,
            `计算叉积法向量：$\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle ${R} \\cos u, ${R} \\sin u, 0 \\rangle$。`,
            `计算其模长：$\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = \\sqrt{(${R} \\cos u)^2 + (${R} \\sin u)^2 + 0^2} = ${R}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * ans, 2 * ans, ans + H],
        });
      },
    },
    {
      id: "the-area-element-of-an-elliptic-cylinder",
      title: t("The area element of an elliptic cylinder", "椭圆柱面的面积元"),
      explanation: t(
        "The elliptic cylinder $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ is parametrized by $\\mathbf{r}(u, v) = \\langle a\\cos u, b\\sin u, v \\rangle$. Then $\\mathbf{r}_u = \\langle -a\\sin u, b\\cos u, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$, so\n\n$$\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = \\sqrt{a^2\\sin^2 u + b^2\\cos^2 u}.$$\n\nUnlike a circular cylinder, the area element changes around the cylinder: it equals $b$ where $u = 0$ and $a$ where $u = \\frac{\\pi}{2}$.",
        "椭圆柱面 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ 的参数化为 $\\mathbf{r}(u, v) = \\langle a\\cos u, b\\sin u, v \\rangle$。于是 $\\mathbf{r}_u = \\langle -a\\sin u, b\\cos u, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$，所以\n\n$$\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = \\sqrt{a^2\\sin^2 u + b^2\\cos^2 u}。$$\n\n与圆柱面不同，面积元沿柱面变化：在 $u = 0$ 处等于 $b$，在 $u = \\frac{\\pi}{2}$ 处等于 $a$。",
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
        return numberProblem({
          prompt: t(
            `For $\\mathbf{r}(u, v) = \\langle ${a}\\cos u, ${b}\\sin u, v \\rangle$, find $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$ at $u = ${lab}$.`,
            `对 $\\mathbf{r}(u, v) = \\langle ${a}\\cos u, ${b}\\sin u, v \\rangle$，求 $u = ${lab}$ 处的 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|$。`,
          ),
          answer: ans,
          wrong: [ans === a ? b : a, a * b, a + b],
          solution: t(
            `$\\mathbf{r}_u = \\langle ${-a * s}, ${b * c}, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$ at $u = ${lab}$, so the length of their cross product is $${ans}$.`,
            `在 $u = ${lab}$ 处 $\\mathbf{r}_u = \\langle ${-a * s}, ${b * c}, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$，所以叉积的长度为 $${ans}$。`,
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
  prerequisites: ["tangent-planes-to-parametric-surfaces", "double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "tangent-planes-to-parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-area-of-parametric-surfaces",
      title: t("Evaluating area of parametric surfaces", "计算参数曲面的面积"),
      explanation: t(
        "For a surface patch where the normal magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = c$ is constant over a rectangular parameter domain $[0, U] \\times [0, V]$, the surface area is $\\iint_D c\\,du\\,dv = c U V$.",
        "若参数曲面上法向量模长 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = c$ 为常数，且参数区域为矩形 $[0, U] \\times [0, V]$，则曲面面积为 $\\iint_D c\\,du\\,dv = c U V$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 9);
        const U = rng.int(2, 9);
        const V = rng.int(2, 9);
        const area = c * U * V;

        const prompt = t(
          `Find the surface area of a smooth parametric surface $\\mathbf{r}(u, v)$ over the rectangular domain $D = [0, ${U}] \\times [0, ${V}]$, given that $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${c}$ throughout $D$.`,
          `已知光滑参数曲面 $\\mathbf{r}(u, v)$ 在矩形参数域 $D = [0, ${U}] \\times [0, ${V}]$ 上处处满足 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${c}$，求该曲面的面积。`,
        );
        const solution = t(
          steps(
            `The formula for the area of a parametric surface is $A(S) = \\iint_D \\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv$.`,
            `Since $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${c}$ is constant, factor it out: $A(S) = ${c} \\iint_D 1\\,du\\,dv$.`,
            `The area of parameter domain $D$ is $U \\times V = ${U} \\times ${V} = ${U * V}$.`,
            `Multiply: $A(S) = ${c} \\times ${U * V} = ${area}$.`,
          ),
          steps(
            `参数曲面面积公式为 $A(S) = \\iint_D \\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv$。`,
            `由于 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${c}$ 为常数，提至积分号外：$A(S) = ${c} \\iint_D 1\\,du\\,dv$。`,
            `参数区域 $D$ 的面积为 $U \\times V = ${U} \\times ${V} = ${U * V}$。\`,
            \`相乘得：$A(S) = ${c} \\times ${U * V} = ${area}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: area,
          wrong: [U * V, c * (U + V), area + c],
        });
      },
    },
    {
      id: "the-lateral-area-of-a-cone",
      title: t("The lateral area of a cone", "圆锥的侧面积"),
      explanation: t(
        "The cone $z = k\\sqrt{x^2 + y^2}$ is parametrized by $\\mathbf{r}(u, v) = \\langle u\\cos v, u\\sin v, ku \\rangle$. Then $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -ku\\cos v, -ku\\sin v, u \\rangle$, whose length is $u\\sqrt{1 + k^2}$. Over $0 \\le u \\le R$, $0 \\le v \\le 2\\pi$,\n\n$$A = \\int_0^{2\\pi}\\int_0^R u\\sqrt{1 + k^2}\\,du\\,dv = \\pi R^2\\sqrt{1 + k^2},$$\n\nwhich matches the familiar formula $\\pi R \\ell$ with slant height $\\ell = R\\sqrt{1 + k^2}$.",
        "圆锥面 $z = k\\sqrt{x^2 + y^2}$ 的参数化为 $\\mathbf{r}(u, v) = \\langle u\\cos v, u\\sin v, ku \\rangle$。于是 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -ku\\cos v, -ku\\sin v, u \\rangle$，其长度为 $u\\sqrt{1 + k^2}$。在 $0 \\le u \\le R$，$0 \\le v \\le 2\\pi$ 上，\n\n$$A = \\int_0^{2\\pi}\\int_0^R u\\sqrt{1 + k^2}\\,du\\,dv = \\pi R^2\\sqrt{1 + k^2},$$\n\n与熟悉的公式 $\\pi R \\ell$（母线长 $\\ell = R\\sqrt{1 + k^2}$）一致。",
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
        return numberProblem({
          prompt: t(
            `Find the area of the cone $z = \\frac{${p}}{${q}}\\sqrt{x^2 + y^2}$ for $x^2 + y^2 \\le ${R * R}$, divided by $\\pi$.`,
            `求圆锥面 $z = \\frac{${p}}{${q}}\\sqrt{x^2 + y^2}$（$x^2 + y^2 \\le ${R * R}$）的面积除以 $\\pi$。`,
          ),
          answer: ans,
          wrong: [Q.of(R * R), Q.of(2 * R * R * h, q), Q.of(R * R * p, q)],
          solution: t(
            `$\\sqrt{1 + k^2} = \\sqrt{1 + \\frac{${p * p}}{${q * q}}} = \\frac{${h}}{${q}}$, so $A = \\pi \\cdot ${R * R} \\cdot \\frac{${h}}{${q}}$ and $\\frac{A}{\\pi} = ${ans.toLatex()}$.`,
            `$\\sqrt{1 + k^2} = \\sqrt{1 + \\frac{${p * p}}{${q * q}}} = \\frac{${h}}{${q}}$，所以 $A = \\pi \\cdot ${R * R} \\cdot \\frac{${h}}{${q}}$，$\\frac{A}{\\pi} = ${ans.toLatex()}$。`,
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
  prerequisites: ["surface-areas-of-revolution-rotation-about-the-x-axis", "parametric-surfaces"],
  encompasses: [{ topic: "surface-areas-of-revolution-rotation-about-the-x-axis", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-of-general-surfaces-of-revolution",
      title: t("Area of general surfaces of revolution", "一般旋转曲面的面积计算"),
      explanation: t(
        "When the horizontal line segment $y = R$ ($0 \\le x \\le H$) is rotated about the $x$-axis, it forms a right circular cylinder of radius $R$ and height $H$. The lateral surface area is $2\\pi R H$. When divided by $\\pi$, the value is $2 R H$.",
        "当水平线段 $y = R$（$0 \\le x \\le H$）绕 $x$ 轴旋转时，生成半径为 $R$、高为 $H$ 的圆柱面。其侧面积为 $2\\pi R H$。除去因数 $\\pi$ 后的值为 $2 R H$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 12);
        const H = rng.int(2, 15);
        const ans = 2 * R * H;

        const prompt = t(
          `Find the surface area divided by $\\pi$ of the circular cylinder formed by revolving the line segment $y = ${R}$ ($0 \\le x \\le ${H}$) about the $x$-axis.`,
          `将线段 $y = ${R}$（$0 \\le x \\le ${H}$）绕 $x$ 轴旋转得到圆柱侧面，求其侧面积除以 $\\pi$ 的值。`,
        );
        const solution = t(
          steps(
            `The surface area of revolution about the $x$-axis is given by $A = 2\\pi \\int_a^b y \\sqrt{1 + (y')^2}\\,dx$.`,
            `Here $y = ${R}$, so $y' = 0$ and the speed factor is $\\sqrt{1 + 0^2} = 1$.`,
            `Integrate: $A = 2\\pi \\int_0^{${H}} ${R}\\,dx = 2\\pi (${R})(${H}) = ${ans}\\pi$.`,
            `Dividing by $\\pi$ yields $A / \\pi = ${ans}$.`,
          ),
          steps(
            `绕 $x$ 轴旋转曲面的面积公式为 $A = 2\\pi \\int_a^b y \\sqrt{1 + (y')^2}\\,dx$。`,
            `此处 $y = ${R}$，导数 $y' = 0$，微元系数 $\\sqrt{1 + 0^2} = 1$。`,
            `定积分计算：$A = 2\\pi \\int_0^{${H}} ${R}\\,dx = 2\\pi (${R})(${H}) = ${ans}\\pi$。`,
            `除以 $\\pi$ 即得 $A / \\pi = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [R * H, ans + 2 * R, 4 * R * H],
        });
      },
    },
    {
      id: "the-area-of-a-spherical-zone",
      title: t("The area of a spherical zone", "球带的面积"),
      explanation: t(
        "Revolving $y = \\sqrt{R^2 - x^2}$ for $a \\le x \\le b$ about the $x$-axis gives a zone of a sphere. Here $y\\sqrt{1 + y'^2} = \\sqrt{R^2 - x^2} \\cdot \\frac{R}{\\sqrt{R^2 - x^2}} = R$, so\n\n$$S = 2\\pi\\int_a^b R\\,dx = 2\\pi R(b - a).$$\n\nRemarkably, the area depends only on the width $b - a$ of the slab, not on where the slab sits along the sphere.",
        "把 $y = \\sqrt{R^2 - x^2}$（$a \\le x \\le b$）绕 $x$ 轴旋转得到一个球带。这里 $y\\sqrt{1 + y'^2} = \\sqrt{R^2 - x^2} \\cdot \\frac{R}{\\sqrt{R^2 - x^2}} = R$，所以\n\n$$S = 2\\pi\\int_a^b R\\,dx = 2\\pi R(b - a)。$$\n\n值得注意的是，面积只取决于夹层的宽度 $b - a$，与夹层在球上的位置无关。",
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
          wrong: [R * (b - a), 2 * R * R * (b - a), 4 * R * R],
          solution: t(
            `$y\\sqrt{1 + y'^2} = ${R}$, so $S = 2\\pi \\cdot ${R}(${b} - ${a < 0 ? `(${a})` : a}) = ${ans}\\pi$.`,
            `$y\\sqrt{1 + y'^2} = ${R}$，所以 $S = 2\\pi \\cdot ${R}(${b} - ${a < 0 ? `(${a})` : a}) = ${ans}\\pi$。`,
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
  prerequisites: ["double-integrals-over-rectangular-domains", "tangent-planes-to-surfaces"],
  encompasses: [{ topic: "tangent-planes-to-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-surface-area-for-graphs-z-equals-f-of-x-y",
      title: t("Computing surface area for graphs z = f(x, y)", "计算显式函数图像 z = f(x, y) 的曲面面积"),
      explanation: t(
        "For a plane $z = ax + by + c$, the partial derivatives are constant: $f_x = a$ and $f_y = b$. The area element is $dS = \\sqrt{1 + a^2 + b^2}\\,dA$. Over a rectangle $D = [0, W] \\times [0, H]$, the surface area is $W H \\sqrt{1 + a^2 + b^2}$. When $(a, b) = (2, 2)$, $\\sqrt{1 + 2^2 + 2^2} = \\sqrt{9} = 3$.",
        "对于平面 $z = ax + by + c$，偏导数为常数：$f_x = a$，$f_y = b$。面积微元为 $dS = \\sqrt{1 + a^2 + b^2}\\,dA$。在矩形区域 $D = [0, W] \\times [0, H]$ 上，曲面面积为 $W H \\sqrt{1 + a^2 + b^2}$。例如当 $(a, b) = (2, 2)$ 时，根式为 $\\sqrt{1 + 4 + 4} = 3$。",
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

        const prompt = t(
          `Find the area of the portion of the plane $z = ${pick.a}x + ${pick.b}y + ${c}$ lying above the rectangle $[0, ${W}] \\times [0, ${H}]$ in the $xy$-plane.`,
          `求平面 $z = ${pick.a}x + ${pick.b}y + ${c}$ 位于 $xy$ 平面上矩形 $[0, ${W}] \\times [0, ${H}]$ 上方的部分的面积。`,
        );
        const solution = t(
          steps(
            `The surface area formula for $z = f(x, y)$ is $A(S) = \\iint_D \\sqrt{1 + f_x^2 + f_y^2}\\,dA$.`,
            `Calculate partial derivatives: $f_x = ${pick.a}$ and $f_y = ${pick.b}$.`,
            `Compute the integrand factor: $\\sqrt{1 + (${pick.a})^2 + (${pick.b})^2} = \\sqrt{${1 + pick.a * pick.a + pick.b * pick.b}} = ${pick.rad}$.`,
            `The area of rectangle $D$ is $W \\times H = ${W} \\times ${H} = ${W * H}$.`,
            `Multiply: $A(S) = ${pick.rad} \\times ${W * H} = ${ans}$.`,
          ),
          steps(
            `显式曲面面积计算公式为 $A(S) = \\iint_D \\sqrt{1 + f_x^2 + f_y^2}\\,dA$。`,
            `求偏导数：$f_x = ${pick.a}$，$f_y = ${pick.b}$。`,
            `计算微元系数：$\\sqrt{1 + (${pick.a})^2 + (${pick.b})^2} = \\sqrt{${1 + pick.a * pick.a + pick.b * pick.b}} = ${pick.rad}$。`,
            `底面矩形面积为 $W \\times H = ${W} \\times ${H} = ${W * H}$。`,
            `相乘得到面积：$A(S) = ${pick.rad} \\times ${W * H} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [W * H, (pick.rad + 1) * W * H, ans + pick.rad],
        });
      },
    },
    {
      id: "area-of-a-curved-graph-over-a-rectangle",
      title: t("The area of a curved graph over a rectangle", "矩形上方曲面图形的面积"),
      explanation: t(
        "The area of the graph $z = f(x, y)$ over $D$ is $\\iint_D \\sqrt{1 + f_x^2 + f_y^2}\\,dA$. For $f = \\frac{2}{3}x^{3/2}$, $f_x = x^{1/2}$ and $f_y = 0$, so the integrand is $\\sqrt{1 + x}$ and over $[0, a] \\times [0, b]$\n\n$$A = b\\int_0^a \\sqrt{1 + x}\\,dx = \\frac{2b}{3}\\left[(1 + a)^{3/2} - 1\\right].$$",
        "图形 $z = f(x, y)$ 在 $D$ 上方的面积为 $\\iint_D \\sqrt{1 + f_x^2 + f_y^2}\\,dA$。对 $f = \\frac{2}{3}x^{3/2}$，$f_x = x^{1/2}$，$f_y = 0$，所以被积函数为 $\\sqrt{1 + x}$，在 $[0, a] \\times [0, b]$ 上\n\n$$A = b\\int_0^a \\sqrt{1 + x}\\,dx = \\frac{2b}{3}\\left[(1 + a)^{3/2} - 1\\right]。$$",
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
          wrong: [Q.of(a * b), Q.of(2 * b * n ** 3, 3), Q.of(2 * (n ** 3 - 1), 3)],
          solution: t(
            `$\\sqrt{1 + f_x^2} = \\sqrt{1 + x}$, so $A = ${b} \\cdot \\frac{2}{3}\\left[${n * n}^{3/2} - 1\\right] = ${b} \\cdot \\frac{2}{3}(${n ** 3} - 1) = ${ans.toLatex()}$.`,
            `$\\sqrt{1 + f_x^2} = \\sqrt{1 + x}$，所以 $A = ${b} \\cdot \\frac{2}{3}\\left[${n * n}^{3/2} - 1\\right] = ${b} \\cdot \\frac{2}{3}(${n ** 3} - 1) = ${ans.toLatex()}$。`,
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
  prerequisites: ["areas-of-parametric-surfaces"],
  encompasses: [{ topic: "areas-of-parametric-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-scalar-surface-integrals-over-parametric-surfaces",
      title: t("Evaluating scalar surface integrals over parametric surfaces", "计算参数曲面上的标量函数曲面积分"),
      explanation: t(
        "The surface integral weights the function by small pieces of area, which is the length of the cross product of the two tangent vectors. For a constant function $g(x, y, z) = k$, the surface integral $\\iint_S k\\,dS$ simply equals $k \\times \\text{Area}(S)$.",
        "曲面积分用小块面积对函数加权，小块面积等于两个切向量叉积的长度。对于常数函数 $g(x, y, z) = k$，第一型曲面积分 $\\iint_S k\\,dS$ 等于 $k \\times \\text{Area}(S)$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 8);
        const norm = rng.int(2, 6);
        const U = rng.int(2, 8);
        const V = rng.int(2, 8);
        const area = norm * U * V;
        const ans = k * area;

        const prompt = t(
          `Evaluate the scalar surface integral $\\iint_S ${k}\\,dS$ over a parametric surface patch $\\mathbf{r}(u, v)$ defined on $[0, ${U}] \\times [0, ${V}]$ with constant normal magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${norm}$.`,
          `计算标量第一型曲面积分 $\\iint_S ${k}\\,dS$，其中参数曲面片 $\\mathbf{r}(u, v)$ 定义在 $[0, ${U}] \\times [0, ${V}]$ 上，法向量模长恒为 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${norm}$。`,
        );
        const solution = t(
          steps(
            `Convert the surface integral to a double integral: $\\iint_S ${k}\\,dS = \\iint_D ${k} \\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv$.`,
            `Since $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${norm}$, the integrand is constant: $${k} \\times ${norm} = ${k * norm}$.`,
            `Multiply by the parameter area $U \\times V = ${U} \\times ${V} = ${U * V}$: $(${k * norm}) \\times ${U * V} = ${ans}$.`,
          ),
          steps(
            `将曲面积分转化为二重积分：$\\iint_S ${k}\\,dS = \\iint_D ${k} \\|\\mathbf{r}_u \\times \\mathbf{r}_v\\|\\,du\\,dv$。`,
            `由 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = ${norm}$，被积函数为常数：$${k} \\times ${norm} = ${k * norm}$。`,
            `乘以参数域面积 $U \\times V = ${U} \\times ${V} = ${U * V}$：$(${k * norm}) \\times ${U * V} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [area, k * U * V, ans + k * norm],
        });
      },
    },
    {
      id: "a-surface-integral-over-a-cylinder",
      title: t("A surface integral over a cylinder", "圆柱面上的曲面积分"),
      explanation: t(
        "On the cylinder $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$, $0 \\le u \\le 2\\pi$, $0 \\le v \\le H$, the area element is $dS = R\\,du\\,dv$. Write the integrand in terms of $u$ and $v$ and integrate over the parameter rectangle:\n\n$$\\iint_S (x^2 + y^2)\\,dS = \\int_0^H\\int_0^{2\\pi} R^2 \\cdot R\\,du\\,dv = 2\\pi R^3H, \\qquad \\iint_S z\\,dS = \\int_0^H\\int_0^{2\\pi} vR\\,du\\,dv = \\pi RH^2.$$",
        "在圆柱面 $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$（$0 \\le u \\le 2\\pi$，$0 \\le v \\le H$）上，面积元为 $dS = R\\,du\\,dv$。把被积函数用 $u$、$v$ 表示，再在参数矩形上积分：\n\n$$\\iint_S (x^2 + y^2)\\,dS = \\int_0^H\\int_0^{2\\pi} R^2 \\cdot R\\,du\\,dv = 2\\pi R^3H, \\qquad \\iint_S z\\,dS = \\int_0^H\\int_0^{2\\pi} vR\\,du\\,dv = \\pi RH^2。$$",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 5);
        const H = rng.int(1, 6);
        const radial = rng.int(0, 1) === 0;
        const ans = radial ? 2 * R ** 3 * H : R * H * H;
        const f = radial ? "(x^2 + y^2)" : "z";
        return numberProblem({
          prompt: t(
            `$S$ is the cylinder $x^2 + y^2 = ${R * R}$, $0 \\le z \\le ${H}$. Find $\\frac{1}{\\pi}\\iint_S ${f}\\,dS$.`,
            `$S$ 是圆柱面 $x^2 + y^2 = ${R * R}$，$0 \\le z \\le ${H}$。求 $\\frac{1}{\\pi}\\iint_S ${f}\\,dS$。`,
          ),
          answer: ans,
          wrong: radial ? [2 * R * R * H, R ** 3 * H, 2 * R ** 4 * H] : [2 * R * H * H, R * H, H * H],
          solution: radial
            ? t(
                `$x^2 + y^2 = ${R * R}$ on $S$ and $dS = ${R}\\,du\\,dv$, so the integral is $${R * R} \\cdot ${R} \\cdot 2\\pi \\cdot ${H} = ${ans}\\pi$.`,
                `在 $S$ 上 $x^2 + y^2 = ${R * R}$，$dS = ${R}\\,du\\,dv$，所以积分为 $${R * R} \\cdot ${R} \\cdot 2\\pi \\cdot ${H} = ${ans}\\pi$。`,
              )
            : t(
                `$\\int_0^{${H}}\\int_0^{2\\pi} v \\cdot ${R}\\,du\\,dv = 2\\pi \\cdot ${R} \\cdot \\frac{${H * H}}{2} = ${ans}\\pi$.`,
                `$\\int_0^{${H}}\\int_0^{2\\pi} v \\cdot ${R}\\,du\\,dv = 2\\pi \\cdot ${R} \\cdot \\frac{${H * H}}{2} = ${ans}\\pi$。`,
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
  prerequisites: ["areas-of-surfaces"],
  encompasses: [{ topic: "areas-of-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-scalar-functions-over-graphs-z-equals-g-of-x-y",
      title: t("Integrating scalar functions over graphs z = g(x, y)", "在显式图像曲面上计算标量函数积分"),
      explanation: t(
        "For a graph, the area element is the area in the horizontal plane times the square root of one plus the squares of the two partial derivatives. When integrating $f(x, y, z) = c$ over a planar surface $z = 2x + 2y$ where $\\sqrt{1 + g_x^2 + g_y^2} = 3$, the integral is $\\iint_S c\\,dS = 3c \\times \\text{Area}(D)$.",
        "对于函数图像，面积微元等于水平面上的面积乘以 1 加两个偏导数平方和的平方根。在平面 $z = 2x + 2y$（根式系数 $\\sqrt{1 + g_x^2 + g_y^2} = 3$）上积分常数 $f(x, y, z) = c$ 时，积分值为 $\\iint_S c\\,dS = 3c \\times \\text{Area}(D)$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 9);
        const W = rng.int(2, 8);
        const H = rng.int(2, 8);
        const factor = 3;
        const ans = c * factor * W * H;

        const prompt = t(
          `Evaluate the surface integral $\\iint_S ${c}\\,dS$ where $S$ is the plane $z = 2x + 2y$ lying over the rectangle $D = [0, ${W}] \\times [0, ${H}]$.`,
          `计算第一型曲面积分 $\\iint_S ${c}\\,dS$，其中曲面 $S$ 为平面 $z = 2x + 2y$ 位于矩形 $D = [0, ${W}] \\times [0, ${H}]$ 上方的部分。`,
        );
        const solution = t(
          steps(
            `The surface element is $dS = \\sqrt{1 + z_x^2 + z_y^2}\\,dA = \\sqrt{1 + 2^2 + 2^2}\\,dA = 3\\,dA$.`,
            `Convert to double integral: $\\iint_S ${c}\\,dS = \\iint_D ${c}(3)\\,dA = ${3 * c} \\iint_D 1\\,dA$.`,
            `The domain area is $\\text{Area}(D) = ${W} \\times ${H} = ${W * H}$.`,
            `Compute the integral: $${3 * c} \\times ${W * H} = ${ans}$.`,
          ),
          steps(
            `曲面面积微元为 $dS = \\sqrt{1 + z_x^2 + z_y^2}\\,dA = \\sqrt{1 + 2^2 + 2^2}\\,dA = 3\\,dA$。`,
            `转化为二重积分：$\\iint_S ${c}\\,dS = \\iint_D ${c}(3)\\,dA = ${3 * c} \\iint_D 1\\,dA$。`,
            `投影区域面积为 $\\text{Area}(D) = ${W} \\times ${H} = ${W * H}$。`,
            `计算得：$${3 * c} \\times ${W * H} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c * W * H, ans + 3 * c, 2 * ans],
        });
      },
    },
    {
      id: "integrating-a-nonconstant-function-over-a-plane",
      title: t("Integrating a nonconstant function over a tilted plane", "在倾斜平面上积分非常数函数"),
      explanation: t(
        "For $S$ the graph of $z = px + qy$ over $D$, $dS = \\sqrt{1 + p^2 + q^2}\\,dA$ is a constant multiple of $dA$. So\n\n$$\\iint_S f\\,dS = \\sqrt{1 + p^2 + q^2}\\iint_D f(x, y, px + qy)\\,dA.$$\n\nFor $f = x$ over $[0, W] \\times [0, H]$ the remaining double integral is $\\frac{W^2H}{2}$.",
        "若 $S$ 是 $z = px + qy$ 在 $D$ 上方的图形，则 $dS = \\sqrt{1 + p^2 + q^2}\\,dA$ 是 $dA$ 的常数倍。所以\n\n$$\\iint_S f\\,dS = \\sqrt{1 + p^2 + q^2}\\iint_D f(x, y, px + qy)\\,dA。$$\n\n对 $[0, W] \\times [0, H]$ 上的 $f = x$，剩下的二重积分为 $\\frac{W^2H}{2}$。",
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
        return numberProblem({
          prompt: t(
            `Evaluate $\\iint_S ${v}\\,dS$, where $S$ is the part of the plane $z = ${poly([p, "x"], [q, "y"])}$ above $[0, ${W}] \\times [0, ${H}]$.`,
            `计算 $\\iint_S ${v}\\,dS$，其中 $S$ 是平面 $z = ${poly([p, "x"], [q, "y"])}$ 在 $[0, ${W}] \\times [0, ${H}]$ 上方的部分。`,
          ),
          answer: ans,
          wrong: [ans.div(Q.of(k)), useY ? Q.of(k * W * W * H, 2) : Q.of(k * W * H * H, 2), Q.of(k * W * H)],
          solution: t(
            `$\\sqrt{1 + ${p * p} + ${q * q}} = ${k}$ and $\\iint_D ${v}\\,dA = ${(useY ? Q.of(W * H * H, 2) : Q.of(W * W * H, 2)).toLatex()}$, so the integral is $${ans.toLatex()}$.`,
            `$\\sqrt{1 + ${p * p} + ${q * q}} = ${k}$，$\\iint_D ${v}\\,dA = ${(useY ? Q.of(W * H * H, 2) : Q.of(W * W * H, 2)).toLatex()}$，所以积分为 $${ans.toLatex()}$。`,
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
  prerequisites: ["surface-integrals-over-cartesian-surfaces"],
  encompasses: [{ topic: "surface-integrals-over-cartesian-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "definition-and-orientation-of-vector-flux",
      title: t("Definition and orientation of vector flux", "向量通量与曲面定向的定义"),
      explanation: t(
        "For a constant vector field $\\mathbf{F} = \\langle a, b, c \\rangle$ crossing a horizontal flat surface $S$ in the $xy$-plane with upward unit normal $\\mathbf{n} = \\mathbf{k}$, the flux is $\\iint_S \\mathbf{F} \\cdot \\mathbf{k}\\,dS = c \\times \\text{Area}(S)$.",
        "对于常向量场 $\\mathbf{F} = \\langle a, b, c \\rangle$ 穿过 $xy$ 平面上具有向上单位法向量 $\\mathbf{n} = \\mathbf{k}$ 的平面曲面片 $S$，其通量为 $\\iint_S \\mathbf{F} \\cdot \\mathbf{k}\\,dS = c \\times \\text{Area}(S)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const W = rng.int(2, 9);
        const H = rng.int(2, 9);
        const area = W * H;
        const flux = c * area;

        const prompt = t(
          `Calculate the upward flux of the uniform vector field $\\mathbf{F} = \\langle ${a}, ${b}, ${c} \\rangle$ through the rectangle $S = [0, ${W}] \\times [0, ${H}]$ in the $xy$-plane (oriented with normal $\\mathbf{n} = \\mathbf{k}$).`,
          `计算均匀向量场 $\\mathbf{F} = \\langle ${a}, ${b}, ${c} \\rangle$ 穿过位于 $xy$ 平面内的矩形区域 $S = [0, ${W}] \\times [0, ${H}]$（定向为向上法向 $\\mathbf{n} = \\mathbf{k}$）的向上通量。`,
        );
        const solution = t(
          steps(
            `The upward unit normal to the $xy$-plane is $\\mathbf{n} = \\langle 0, 0, 1 \\rangle = \\mathbf{k}$.`,
            `Compute the dot product: $\\mathbf{F} \\cdot \\mathbf{n} = \\langle ${a}, ${b}, ${c} \\rangle \\cdot \\langle 0, 0, 1 \\rangle = ${c}$.`,
            `The flux is $\\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dS = ${c} \\iint_S 1\\,dS = ${c} \\times \\text{Area}(S)$.`,
            `The area is $W \\times H = ${W} \\times ${H} = ${area}$, so the flux is $${c} \\times ${area} = ${flux}$.`,
          ),
          steps(
            `$xy$ 平面的向上单位法向量为 $\\mathbf{n} = \\langle 0, 0, 1 \\rangle = \\mathbf{k}$。`,
            `计算点积：$\\mathbf{F} \\cdot \\mathbf{n} = \\langle ${a}, ${b}, ${c} \\rangle \\cdot \\langle 0, 0, 1 \\rangle = ${c}$。`,
            `通量公式：$\\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dS = ${c} \\iint_S 1\\,dS = ${c} \\times \\text{Area}(S)$。`,
            `矩形面积为 $W \\times H = ${W} \\times ${H} = ${area}$，故通量为 $${c} \\times ${area} = ${flux}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: flux,
          wrong: [a * area, b * area, flux + area],
        });
      },
    },
    {
      id: "flux-of-a-position-field-through-a-horizontal-square",
      title: t("Flux of a nonuniform field through a horizontal square", "非均匀场穿过水平正方形的通量"),
      explanation: t(
        "Flux adds up the normal component of the field over the surface: $\\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dS$. On the horizontal rectangle at height $z = h$ with upward normal $\\mathbf{n} = \\mathbf{k}$, only the $z$-component counts. For $\\mathbf{F} = \\langle x, y, z \\rangle$ that component is the constant $h$, so the flux is $h$ times the area, even though the field itself varies across the rectangle.",
        "通量把场的法向分量在曲面上累加：$\\iint_S \\mathbf{F} \\cdot \\mathbf{n}\\,dS$。在高度 $z = h$、法向向上 $\\mathbf{n} = \\mathbf{k}$ 的水平矩形上，只有 $z$ 分量起作用。对 $\\mathbf{F} = \\langle x, y, z \\rangle$，该分量是常数 $h$，所以通量是 $h$ 乘以面积，尽管场本身在矩形上是变化的。",
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
          wrong: [k * W * H, k * h * (W + H), Q.of(k * W * W * H * H, 4)],
          solution: t(
            `$\\mathbf{F} \\cdot \\mathbf{k} = ${k * h}$ on the rectangle, whose area is $${W * H}$, so the flux is $${ans}$.`,
            `在矩形上 $\\mathbf{F} \\cdot \\mathbf{k} = ${k * h}$，矩形面积为 $${W * H}$，所以通量为 $${ans}$。`,
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
  prerequisites: ["flux-in-three-dimensional-vector-fields"],
  encompasses: [{ topic: "flux-in-three-dimensional-vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "outward-orientation-and-net-flux-through-closed-surfaces",
      title: t("Outward orientation and net flux through closed surfaces", "闭合曲面的外向定向与净外法向通量"),
      explanation: t(
        "For any uniform (constant) vector field $\\mathbf{F} = \\mathbf{C}$ through any closed surface $S$ bounding a solid region $E$, whatever flows in through one side leaves through the opposite side. The net outward flux is identically zero: $\\oiint_S \\mathbf{C} \\cdot d\\mathbf{S} = 0$.",
        "对于任意常向量场 $\\mathbf{F} = \\mathbf{C}$ 穿过包围有界区域 $E$ 的任意闭合曲面 $S$，流入量与流出量处处相互抵消。净外向通量恒等于零：$\\oiint_S \\mathbf{C} \\cdot d\\mathbf{S} = 0$。",
      ),
      generate(rng: Rng): Problem {
        const cx = rng.int(2, 9);
        const cy = rng.int(2, 9);
        const cz = rng.int(2, 9);
        const L = rng.int(2, 8);
        const W = rng.int(2, 8);
        const H = rng.int(2, 8);
        const vol = L * W * H;

        const prompt = t(
          `Find the net outward flux $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of the constant vector field $\\mathbf{F} = \\langle ${cx}, ${cy}, ${cz} \\rangle$ across the closed surface of the rectangular box $[0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$.`,
          `求常向量场 $\\mathbf{F} = \\langle ${cx}, ${cy}, ${cz} \\rangle$ 穿过长方体 $[0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$ 闭合外表面的净外向通量 $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
        );
        const solution = t(
          steps(
            `For a constant vector field $\\mathbf{F} = \\langle ${cx}, ${cy}, ${cz} \\rangle$, the divergence is $\\text{div}\\,\\mathbf{F} = 0 + 0 + 0 = 0$.`,
            `By the Divergence Theorem (or direct cancellation of opposite faces), the net outward flux is $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E 0\\,dV = 0$.`,
          ),
          steps(
            `对于常向量场 $\\mathbf{F} = \\langle ${cx}, ${cy}, ${cz} \\rangle$，其散度为 $\\text{div}\\,\\mathbf{F} = 0 + 0 + 0 = 0$。`,
            `由散度定理（或对面法向量反向直接抵消），净外向通量为 $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E 0\\,dV = 0$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: 0,
          wrong: [vol, cx * W * H, cy * L * H],
        });
      },
    },
    {
      id: "outward-flux-of-a-radial-field-through-a-sphere",
      title: t("Outward flux of a radial field through a sphere", "径向场穿过球面的向外通量"),
      explanation: t(
        "On the sphere $x^2 + y^2 + z^2 = R^2$ the outward unit normal is $\\mathbf{n} = \\frac{\\langle x, y, z \\rangle}{R}$. For the radial field $\\mathbf{F} = k\\langle x, y, z \\rangle$, $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{k(x^2 + y^2 + z^2)}{R} = kR$ is constant on the sphere. So the net outward flux is $kR$ times the area $4\\pi R^2$, that is $4\\pi kR^3$.",
        "在球面 $x^2 + y^2 + z^2 = R^2$ 上，向外单位法向量为 $\\mathbf{n} = \\frac{\\langle x, y, z \\rangle}{R}$。对径向场 $\\mathbf{F} = k\\langle x, y, z \\rangle$，$\\mathbf{F} \\cdot \\mathbf{n} = \\frac{k(x^2 + y^2 + z^2)}{R} = kR$ 在球面上为常数。所以净向外通量是 $kR$ 乘以面积 $4\\pi R^2$，即 $4\\pi kR^3$。",
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
          wrong: [4 * k * R * R, Q.of(4 * k * R ** 3, 3), 0],
          solution: t(
            `$\\mathbf{F} \\cdot \\mathbf{n} = ${k}(${R}) = ${k * R}$ everywhere on the sphere, and the area is $${4 * R * R}\\pi$, so the flux is $${ans}\\pi$.`,
            `在球面上处处 $\\mathbf{F} \\cdot \\mathbf{n} = ${k}(${R}) = ${k * R}$，面积为 $${4 * R * R}\\pi$，所以通量为 $${ans}\\pi$。`,
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
  prerequisites: ["flux-in-three-dimensional-vector-fields", "tangent-planes-to-parametric-surfaces"],
  encompasses: [{ topic: "flux-in-three-dimensional-vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "flux-computations-using-surface-parametrizations",
      title: t("Flux computations using surface parametrizations", "利用曲面参数方程计算向量通量"),
      explanation: t(
        "For a planar surface $\\mathbf{r}(u, v) = \\langle u, v, c u + d v \\rangle$ with normal $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -c, -d, 1 \\rangle$ and vector field $\\mathbf{F} = \\langle P, Q, R \\rangle$, the integrand is the constant dot product $-c P - d Q + R$.",
        "对于参数平面 $\\mathbf{r}(u, v) = \\langle u, v, c u + d v \\rangle$（法向量 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -c, -d, 1 \\rangle$）及向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$，被积函数为常数点积 $-c P - d Q + R$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 4);
        const d = rng.int(1, 4);
        const P = rng.int(1, 5);
        const Q = rng.int(1, 5);
        const R = rng.int(20, 40);
        const U = rng.int(2, 6);
        const V = rng.int(2, 6);
        const dot = -c * P - d * Q + R;
        const flux = dot * U * V;

        const prompt = t(
          `Find the upward flux $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of $\\mathbf{F} = \\langle ${P}, ${Q}, ${R} \\rangle$ across the parametric surface $\\mathbf{r}(u, v) = \\langle u, v, ${c}u + ${d}v \\rangle$ over $D = [0, ${U}] \\times [0, ${V}]$.`,
          `计算向量场 $\\mathbf{F} = \\langle ${P}, ${Q}, ${R} \\rangle$ 穿过参数曲面 $\\mathbf{r}(u, v) = \\langle u, v, ${c}u + ${d}v \\rangle$（定义在 $D = [0, ${U}] \\times [0, ${V}]$，定向取向上）的通量 $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
        );
        const solution = t(
          steps(
            `Compute tangent vectors: $\\mathbf{r}_u = \\langle 1, 0, ${c} \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, ${d} \\rangle$.`,
            `Their upward cross product is $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -${c}, -${d}, 1 \\rangle$.`,
            `Take the dot product with $\\mathbf{F}$: $\\mathbf{F} \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v) = (${P})(-${c}) + (${Q})(-${d}) + (${R})(1) = -${c * P} - ${d * Q} + ${R} = ${dot}$.`,
            `Integrate over $D$: $\\iint_D ${dot}\\,du\\,dv = ${dot} \\times (${U} \\times ${V}) = ${flux}$.`,
          ),
          steps(
            `计算切向量：$\\mathbf{r}_u = \\langle 1, 0, ${c} \\rangle$，$\\mathbf{r}_v = \\langle 0, 1, ${d} \\rangle$。`,
            `向上法向叉积为 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -${c}, -${d}, 1 \\rangle$。`,
            `与向量场 $\\mathbf{F}$ 做点积：$\\mathbf{F} \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v) = (${P})(-${c}) + (${Q})(-${d}) + (${R})(1) = ${dot}$。`,
            `在区域 $D$ 上积分：$\\iint_D ${dot}\\,du\\,dv = ${dot} \\times (${U} \\times ${V}) = ${flux}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: flux,
          wrong: [R * U * V, (P + Q + R) * U * V, flux + dot],
        });
      },
    },
    {
      id: "outward-flux-through-a-cylinder",
      title: t("Outward flux through the side of a cylinder", "穿过圆柱侧面的向外通量"),
      explanation: t(
        "For the cylinder $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$, the cross product $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R\\cos u, R\\sin u, 0 \\rangle$ points outward. The flux is $\\iint_D \\mathbf{F}(\\mathbf{r}(u, v)) \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v)\\,du\\,dv$. For $\\mathbf{F} = \\langle kx, ky, g(z) \\rangle$ the dot product is $kR^2$, and the $z$-component never contributes because the side's normal is horizontal.",
        "对圆柱面 $\\mathbf{r}(u, v) = \\langle R\\cos u, R\\sin u, v \\rangle$，叉积 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R\\cos u, R\\sin u, 0 \\rangle$ 指向外侧。通量为 $\\iint_D \\mathbf{F}(\\mathbf{r}(u, v)) \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v)\\,du\\,dv$。对 $\\mathbf{F} = \\langle kx, ky, g(z) \\rangle$，点积为 $kR^2$，而 $z$ 分量从不起作用，因为侧面的法向量是水平的。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-3, 4);
        const R = rng.int(1, 5);
        const H = rng.int(1, 6);
        const c = rng.int(1, 5);
        const ans = 2 * k * R * R * H;
        const third = rng.pick([`${c}z`, `z^2`, `${c}`]);
        return numberProblem({
          prompt: t(
            `Find the outward flux of $\\mathbf{F} = \\langle ${poly([k, "x"])}, ${poly([k, "y"])}, ${third} \\rangle$ through the side $x^2 + y^2 = ${R * R}$, $0 \\le z \\le ${H}$, of a cylinder, divided by $\\pi$.`,
            `求 $\\mathbf{F} = \\langle ${poly([k, "x"])}, ${poly([k, "y"])}, ${third} \\rangle$ 穿过圆柱侧面 $x^2 + y^2 = ${R * R}$（$0 \\le z \\le ${H}$）的向外通量除以 $\\pi$。`,
          ),
          answer: ans,
          wrong: [k * R * R * H, 2 * k * R * H, 2 * k * R ** 3 * H],
          solution: t(
            `$\\mathbf{F} \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v) = ${k}(${R * R}\\cos^2 u + ${R * R}\\sin^2 u) = ${k * R * R}$, so the flux is $${k * R * R} \\cdot 2\\pi \\cdot ${H} = ${ans}\\pi$.`,
            `$\\mathbf{F} \\cdot (\\mathbf{r}_u \\times \\mathbf{r}_v) = ${k}(${R * R}\\cos^2 u + ${R * R}\\sin^2 u) = ${k * R * R}$，所以通量为 $${k * R * R} \\cdot 2\\pi \\cdot ${H} = ${ans}\\pi$。`,
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
  prerequisites: ["flux-in-three-dimensional-vector-fields"],
  encompasses: [{ topic: "surface-integrals-over-cartesian-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "flux-through-explicit-surfaces-z-equals-g-of-x-y",
      title: t("Flux through explicit surfaces z = g(x, y)", "显式曲面 z = g(x, y) 上的通量计算公式"),
      explanation: t(
        "For an upward oriented graph, the normal vector comes from the partial derivatives, and the flux is the double integral of the field dotted with it. For $\\mathbf{F} = \\langle P, Q, R \\rangle$ and surface $z = g(x, y)$ oriented upward, the normal differential is $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle dA$. Thus $\\mathbf{F} \\cdot d\\mathbf{S} = (-P g_x - Q g_y + R)\\,dA$.",
        "对于向上定向的函数图像，法向量来自偏导数，通量就是向量场与它点积的二重积分。对于向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$ 与向上定向的曲面 $z = g(x, y)$，法向向量微元为 $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle dA$。因此 $\\mathbf{F} \\cdot d\\mathbf{S} = (-P g_x - Q g_y + R)\\,dA$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const P = rng.int(1, 6);
        const Q = rng.int(1, 6);
        const R = rng.int(25, 50);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const dot = -P * a - Q * b + R;
        const flux = dot * W * H;

        const prompt = t(
          `Find the upward flux $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of $\\mathbf{F} = \\langle ${P}, ${Q}, ${R} \\rangle$ through the plane $z = ${poly([a, "x"])} + ${poly([b, "y"])}$ above the rectangle $[0, ${W}] \\times [0, ${H}]$.`,
          `计算向量场 $\\mathbf{F} = \\langle ${P}, ${Q}, ${R} \\rangle$ 穿过位于矩形 $[0, ${W}] \\times [0, ${H}]$ 上方的平面 $z = ${poly([a, "x"])} + ${poly([b, "y"])}$（向上定向）的通量 $\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
        );
        const solution = t(
          steps(
            `For $z = g(x, y) = ${poly([a, "x"])} + ${poly([b, "y"])}$, the partials are $g_x = ${a}$ and $g_y = ${b}$.`,
            `The upward normal differential is $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle dA = \\langle -${a}, -${b}, 1 \\rangle dA$.`,
            `Compute the dot product: $\\mathbf{F} \\cdot d\\mathbf{S} = [(${P})(-${a}) + (${Q})(-${b}) + (${R})(1)] dA = (${-P * a - Q * b + R}) dA = ${dot} dA$.`,
            `Integrate over the rectangle of area $W \\times H = ${W * H}$: $\\text{Flux} = ${dot} \\times ${W * H} = ${flux}$.`,
          ),
          steps(
            `对于平面 $z = g(x, y) = ${poly([a, "x"])} + ${poly([b, "y"])}$，偏导数为 $g_x = ${a}$，$g_y = ${b}$。`,
            `向上向量微元为 $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle dA = \\langle -${a}, -${b}, 1 \\rangle dA$。`,
            `做点积运算：$\\mathbf{F} \\cdot d\\mathbf{S} = [(${P})(-${a}) + (${Q})(-${b}) + (${R})(1)] dA = ${dot} dA$。`,
            `在面积为 $W \\times H = ${W * H}$ 的矩形上积分：通量为 $${dot} \\times ${W * H} = ${flux}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: flux,
          wrong: [R * W * H, flux + dot, flux - dot],
        });
      },
    },
    {
      id: "upward-flux-through-a-paraboloid-over-a-rectangle",
      title: t("Upward flux through a curved graph", "穿过曲面图形的向上通量"),
      explanation: t(
        "For the graph $z = g(x, y)$ with upward orientation, $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle\\,dA$, so\n\n$$\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_D \\left(-Pg_x - Qg_y + R\\right)dA,$$\n\nwith $P$, $Q$, $R$ evaluated at $z = g(x, y)$. For $\\mathbf{F} = \\langle x, y, z \\rangle$ and $g = x^2 + y^2$ the integrand is $-2x^2 - 2y^2 + (x^2 + y^2) = -(x^2 + y^2)$: the field points outward, mostly against the upward normal.",
        "对向上定向的图形 $z = g(x, y)$，$d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle\\,dA$，所以\n\n$$\\iint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iint_D \\left(-Pg_x - Qg_y + R\\right)dA,$$\n\n其中 $P$、$Q$、$R$ 在 $z = g(x, y)$ 处取值。对 $\\mathbf{F} = \\langle x, y, z \\rangle$ 与 $g = x^2 + y^2$，被积函数为 $-2x^2 - 2y^2 + (x^2 + y^2) = -(x^2 + y^2)$：场向外指，大体与向上的法向量相反。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(1, 4);
        const H = rng.int(1, 4);
        const k = rng.int(1, 3);
        // F = <x, y, k z>: integrand -2x^2 - 2y^2 + k(x^2 + y^2) = (k - 2)(x^2 + y^2).
        const base = Q.of(W ** 3 * H + W * H ** 3, 3);
        const ans = base.mul(Q.of(k - 2));
        const R = k === 1 ? "z" : `${k}z`;
        return numberProblem({
          prompt: t(
            `Find the upward flux of $\\mathbf{F} = \\langle x, y, ${R} \\rangle$ through the surface $z = x^2 + y^2$ above $[0, ${W}] \\times [0, ${H}]$.`,
            `求 $\\mathbf{F} = \\langle x, y, ${R} \\rangle$ 穿过曲面 $z = x^2 + y^2$ 在 $[0, ${W}] \\times [0, ${H}]$ 上方部分的向上通量。`,
          ),
          answer: ans,
          wrong: [base.mul(Q.of(k + 2)), base.mul(Q.of(k)), ans.neg()],
          solution: t(
            `The integrand is $-2x^2 - 2y^2 + ${k === 1 ? "" : k}(x^2 + y^2) = ${poly([k - 2, "(x^2 + y^2)"]) || "0"}$, and $\\iint_D (x^2 + y^2)\\,dA = ${base.toLatex()}$, so the flux is $${ans.toLatex()}$.`,
            `被积函数为 $-2x^2 - 2y^2 + ${k === 1 ? "" : k}(x^2 + y^2) = ${poly([k - 2, "(x^2 + y^2)"]) || "0"}$，$\\iint_D (x^2 + y^2)\\,dA = ${base.toLatex()}$，所以通量为 $${ans.toLatex()}$。`,
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
  prerequisites: ["flux-through-closed-surfaces", "calculating-flux-through-cartesian-surfaces"],
  encompasses: [{ topic: "flux-through-closed-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "summing-flux-over-piecewise-smooth-boundaries",
      title: t("Summing flux over piecewise-smooth boundaries", "分块累加求闭合曲面外向通量"),
      explanation: t(
        "For $\\mathbf{F} = \\langle a x, b y, c z \\rangle$ across a box $[0, L] \\times [0, W] \\times [0, H]$, the pairs of faces along each axis contribute $a L W H$, $b L W H$, and $c L W H$. The total outward flux is $(a + b + c) L W H$.",
        "对于向量场 $\\mathbf{F} = \\langle a x, b y, c z \\rangle$ 穿过长方体 $[0, L] \\times [0, W] \\times [0, H]$，三个坐标轴向的对面分别贡献 $a L W H$、$b L W H$ 与 $c L W H$。总外向通量为 $(a + b + c) L W H$。",
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

        const prompt = t(
          `Find the total outward flux $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of $\\mathbf{F} = \\langle ${poly([a, "x"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$ across the closed surface of the box $[0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$.`,
          `计算向量场 $\\mathbf{F} = \\langle ${poly([a, "x"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$ 穿过长方体 $[0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$ 闭合外表面的总外向通量 $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
        );
        const solution = t(
          steps(
            `On each pair of parallel faces, evaluate the flux:\`,
            \`At $x = ${L}$, $\\mathbf{n} = \\mathbf{i}$, flux is $(${a} \\times ${L}) \\times (${W} \\times ${H}) = ${a * vol}$. At $x = 0$, $x = 0$ so flux is $0$.`,
            `Similarly, the $y$-faces give $b \\times \\text{Vol} = ${b * vol}$, and the $z$-faces give $c \\times \\text{Vol} = ${c * vol}$.`,
            `Summing the six faces: $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = (${a} + ${b} + ${c}) \\times ${vol} = ${flux}$.`,
          ),
          steps(
            `分别计算三对相对的面上的外向通量：`,
            `在 $x = ${L}$ 面上，外法向 $\\mathbf{n} = \\mathbf{i}$，通量为 $(${a} \\times ${L}) \\times (${W} \\times ${H}) = ${a * vol}$；在 $x = 0$ 面上，$x = 0$ 故通量为 $0$。`,
            `同理，$y$ 方向两面净通量为 $b \\times \\text{Vol} = ${b * vol}$，$z$ 方向两面净通量为 $c \\times \\text{Vol} = ${c * vol}$。`,
            `六个面通量求和：$\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = (${a} + ${b} + ${c}) \\times ${vol} = ${flux}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: flux,
          wrong: [vol, (a + b) * vol, flux + vol],
        });
      },
    },
    {
      id: "face-by-face-flux-of-a-quadratic-field",
      title: t("Face-by-face flux of a quadratic field", "逐面计算二次场的通量"),
      explanation: t(
        "To find the flux out of a box face by face, note that on each face only one component of $\\mathbf{F}$ is normal. For $\\mathbf{F} = \\langle px^2, qy^2, rz^2 \\rangle$ on $[0, A] \\times [0, B] \\times [0, C]$, the faces through the origin contribute nothing, because there the normal component is $0$. On the face $x = A$ the normal component is $pA^2$ over area $BC$, and similarly for the other two, so the total is\n\n$$pA^2BC + qB^2AC + rC^2AB.$$",
        "逐面计算长方体的通量时，注意每个面上只有 $\\mathbf{F}$ 的一个分量是法向的。对 $[0, A] \\times [0, B] \\times [0, C]$ 上的 $\\mathbf{F} = \\langle px^2, qy^2, rz^2 \\rangle$，过原点的三个面没有贡献，因为那里法向分量为 $0$。在面 $x = A$ 上法向分量为 $pA^2$，面积为 $BC$，另两个面同理，所以总量为\n\n$$pA^2BC + qB^2AC + rC^2AB。$$",
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
        return numberProblem({
          prompt: t(
            `Find the net outward flux of $\\mathbf{F} = \\langle ${poly([p, "x^2"])}, ${poly([q, "y^2"])}, ${poly([r, "z^2"])} \\rangle$ out of the box $[0, ${A}] \\times [0, ${B}] \\times [0, ${C}]$.`,
            `求 $\\mathbf{F} = \\langle ${poly([p, "x^2"])}, ${poly([q, "y^2"])}, ${poly([r, "z^2"])} \\rangle$ 从长方体 $[0, ${A}] \\times [0, ${B}] \\times [0, ${C}]$ 流出的净通量。`,
          ),
          answer: ans,
          wrong: [2 * ans, (p + q + r) * A * B * C, parts[0]! - parts[1]! + parts[2]!],
          solution: t(
            `Only the faces $x = ${A}$, $y = ${B}$, $z = ${C}$ contribute: $${parts.map((x) => (x < 0 ? `(${x})` : `${x}`)).join(" + ")} = ${ans}$.`,
            `只有面 $x = ${A}$、$y = ${B}$、$z = ${C}$ 有贡献：$${parts.map((x) => (x < 0 ? `(${x})` : `${x}`)).join(" + ")} = ${ans}$。`,
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
  prerequisites: [
    "calculating-flux-through-closed-surfaces",
    "the-divergence-of-a-vector-field",
    "triple-integrals-over-rectangular-domains",
  ],
  encompasses: [{ topic: "calculating-flux-through-closed-surfaces", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-the-divergence-theorem-in-three-dimensions",
      title: t("Applying the Divergence Theorem in three dimensions", "在三维空间中应用高斯散度定理"),
      explanation: t(
        "The total flow out through a closed surface equals the total divergence inside, so a hard surface integral can become an easier triple integral. The Divergence Theorem converts a closed surface flux integral into a triple integral: $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\text{div}\\,\\mathbf{F}\\,dV$.",
        "穿过闭曲面向外的总流量等于内部散度的总和，所以困难的曲面积分可以化为更容易的三重积分。高斯散度定理将闭合曲面的通量积分转化为区域上的三重积分：$\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\text{div}\\,\\mathbf{F}\\,dV$。",
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

        const prompt = t(
          `Use the Divergence Theorem to find the outward flux $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$ of $\\mathbf{F} = \\langle ${poly([a, "x"])} + y^2, ${poly([b, "y"])} + z^2, ${poly([c, "z"])} + x^2 \\rangle$ across the boundary of the box $E = [0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$.`,
          `利用高斯散度定理求向量场 $\\mathbf{F} = \\langle ${poly([a, "x"])} + y^2, ${poly([b, "y"])} + z^2, ${poly([c, "z"])} + x^2 \\rangle$ 穿过长方体 $E = [0, ${L}] \\times [0, ${W}] \\times [0, ${H}]$ 闭合边界的外向通量 $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S}$。`,
        );
        const solution = t(
          steps(
            `Calculate the divergence: $\\text{div}\\,\\mathbf{F} = \\frac{\\partial}{\\partial x}(${poly([a, "x"])} + y^2) + \\frac{\\partial}{\\partial y}(${poly([b, "y"])} + z^2) + \\frac{\\partial}{\\partial z}(${poly([c, "z"])} + x^2) = ${a} + ${b} + ${c} = ${div}$.`,
            `By the Divergence Theorem, $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\text{div}\\,\\mathbf{F}\\,dV = \\iiint_E ${div}\\,dV$.`,
            `The volume of the box is $L \\times W \\times H = ${L} \\times ${W} \\times ${H} = ${vol}$.`,
            `Compute the integral: $${div} \\times ${vol} = ${ans}$.`,
          ),
          steps(
            `计算向量场的散度：$\\text{div}\\,\\mathbf{F} = \\frac{\\partial}{\\partial x}(${poly([a, "x"])} + y^2) + \\frac{\\partial}{\\partial y}(${poly([b, "y"])} + z^2) + \\frac{\\partial}{\\partial z}(${poly([c, "z"])} + x^2) = ${a} + ${b} + ${c} = ${div}$。`,
            `由高斯散度定理，$\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\text{div}\\,\\mathbf{F}\\,dV = ${div} \\iiint_E 1\\,dV$。`,
            `长方体体积为 $L \\times W \\times H = ${L} \\times ${W} \\times ${H} = ${vol}$。`,
            `相乘得：$${div} \\times ${vol} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [vol, div * (L + W + H), ans + div],
        });
      },
    },
    {
      id: "divergence-theorem-on-a-sphere-or-cylinder",
      title: t("The divergence theorem on a sphere or a cylinder", "球体或圆柱体上的散度定理"),
      explanation: t(
        "When the divergence is constant, the divergence theorem reduces the flux to divergence times volume: $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = (\\nabla \\cdot \\mathbf{F})\\,V$. For $\\mathbf{F} = \\langle ax, by, cz \\rangle$, $\\nabla \\cdot \\mathbf{F} = a + b + c$. A ball of radius $R$ has volume $\\frac{4}{3}\\pi R^3$, and a solid cylinder of radius $R$ and height $H$ has volume $\\pi R^2H$, so no surface parametrization is needed at all.",
        "当散度为常数时，散度定理把通量化为散度乘以体积：$\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = (\\nabla \\cdot \\mathbf{F})\\,V$。对 $\\mathbf{F} = \\langle ax, by, cz \\rangle$，$\\nabla \\cdot \\mathbf{F} = a + b + c$。半径为 $R$ 的球体体积为 $\\frac{4}{3}\\pi R^3$，半径 $R$、高 $H$ 的实心圆柱体积为 $\\pi R^2H$，所以根本不需要参数化曲面。",
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
        return numberProblem({
          prompt: t(
            `Find the outward flux of $\\mathbf{F} = \\langle ${poly([a, "x"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$ through ${region.en}, divided by $\\pi$.`,
            `求 $\\mathbf{F} = \\langle ${poly([a, "x"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$ 穿过${region["zh-CN"]}的向外通量除以 $\\pi$。`,
          ),
          answer: ans,
          wrong: ball
            ? [Q.of(d * R ** 3), Q.of(4 * d * R * R), Q.of(4 * a * b * c * R ** 3, 3)]
            : [Q.of(d * R * H), Q.of(2 * d * R * R * H), Q.of(a * b * c * R * R * H)],
          solution: t(
            `$\\nabla \\cdot \\mathbf{F} = ${d}$ and the volume is $${ball ? `\\frac{4}{3}\\pi \\cdot ${R ** 3}` : `\\pi \\cdot ${R * R} \\cdot ${H}`}$, so the flux divided by $\\pi$ is $${ans.toLatex()}$.`,
            `$\\nabla \\cdot \\mathbf{F} = ${d}$，体积为 $${ball ? `\\frac{4}{3}\\pi \\cdot ${R ** 3}` : `\\pi \\cdot ${R * R} \\cdot ${H}`}$，所以通量除以 $\\pi$ 为 $${ans.toLatex()}$。`,
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
  prerequisites: ["greens-theorem-in-circulation-curl-form", "the-curl-of-a-vector-field", "calculating-flux-through-cartesian-surfaces"],
  encompasses: [{ topic: "greens-theorem-in-circulation-curl-form", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-line-and-surface-integrals-via-stokes-theorem",
      title: t("Evaluating line and surface integrals via Stokes' Theorem", "利用斯托克斯定理计算环量与旋度通量"),
      explanation: t(
        "Stokes' theorem says the circulation around a boundary curve equals the flux of the curl through any surface it bounds, so choose the easier one. For $\\mathbf{F} = \\langle -a y, a x, 0 \\rangle$, the curl is $\\text{curl}\\,\\mathbf{F} = \\langle 0, 0, 2a \\rangle$. For a flat surface $S$ in the $xy$-plane with upward normal $\\mathbf{k}$, $\\iint_S (\\text{curl}\\,\\mathbf{F}) \\cdot d\\mathbf{S} = 2a \\times \\text{Area}(S)$.",
        "斯托克斯公式说明，沿边界曲线的环量等于旋度穿过它所围任意曲面的通量，所以选择更容易计算的一个。对于向量场 $\\mathbf{F} = \\langle -a y, a x, 0 \\rangle$，其旋度为 $\\text{curl}\\,\\mathbf{F} = \\langle 0, 0, 2a \\rangle$。对于 $xy$ 平面内向上定向的平面片 $S$，$\\iint_S (\\text{curl}\\,\\mathbf{F}) \\cdot d\\mathbf{S} = 2a \\times \\text{Area}(S)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const W = rng.int(2, 8);
        const H = rng.int(2, 8);
        const area = W * H;
        const curlZ = 2 * a;
        const ans = curlZ * area;

        const prompt = t(
          `Use Stokes' Theorem to evaluate $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle -${poly([a, "y"])}, ${poly([a, "x"])}, 0 \\rangle$ along the counterclockwise boundary $C$ of the rectangle $[0, ${W}] \\times [0, ${H}]$ in the $xy$-plane.`,
          `利用斯托克斯定理计算 $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F} = \\langle -${poly([a, "y"])}, ${poly([a, "x"])}, 0 \\rangle$，$C$ 为 $xy$ 平面内矩形 $[0, ${W}] \\times [0, ${H}]$ 的逆时针边界。`,
        );
        const solution = t(
          steps(
            `Calculate the curl of $\\mathbf{F}$: $\\text{curl}\\,\\mathbf{F} = \\nabla \\times \\mathbf{F} = \\langle 0, 0, \\frac{\\partial}{\\partial x}(${poly([a, "x"])}) - \\frac{\\partial}{\\partial y}(-${poly([a, "y"])}) \\rangle = \\langle 0, 0, ${a} - (-${a}) \\rangle = \\langle 0, 0, ${curlZ} \\rangle$.`,
            `By Stokes' Theorem, $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\text{curl}\\,\\mathbf{F}) \\cdot \\mathbf{k}\\,dS$.`,
            `Since the normal is $\\mathbf{k}$, $(\\text{curl}\\,\\mathbf{F}) \\cdot \\mathbf{k} = ${curlZ}$.`,
            `Multiply by the area of the rectangle $W \\times H = ${W} \\times ${H} = ${area}$: $${curlZ} \\times ${area} = ${ans}$.`,
          ),
          steps(
            `计算向量场的旋度：$\\text{curl}\\,\\mathbf{F} = \\nabla \\times \\mathbf{F} = \\langle 0, 0, \\frac{\\partial}{\\partial x}(${poly([a, "x"])}) - \\frac{\\partial}{\\partial y}(-${poly([a, "y"])}) \\rangle = \\langle 0, 0, ${curlZ} \\rangle$。`,
            `由斯托克斯定理，$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\text{curl}\\,\\mathbf{F}) \\cdot \\mathbf{k}\\,dS$。`,
            `平面向上的法向为 $\\mathbf{k}$，点积为 $(\\text{curl}\\,\\mathbf{F}) \\cdot \\mathbf{k} = ${curlZ}$。`,
            `乘以矩形面积 $W \\times H = ${W} \\times ${H} = ${area}$：$${curlZ} \\times ${area} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * area, ans + area, curlZ * (W + H)],
        });
      },
    },
    {
      id: "stokes-theorem-on-a-tilted-triangle",
      title: t("Stokes' theorem on a tilted triangle", "倾斜三角形上的斯托克斯定理"),
      explanation: t(
        "Stokes' theorem replaces the circulation around $C$ by the flux of $\\nabla \\times \\mathbf{F}$ through any surface bounded by $C$. For $\\mathbf{F} = \\langle pz, qx, ry \\rangle$ the curl is the constant $\\langle r, p, q \\rangle$. Take the triangle with vertices $(a, 0, 0)$, $(0, a, 0)$, $(0, 0, a)$, oriented with normal pointing away from the origin. Its projections onto the three coordinate planes each have area $\\frac{a^2}{2}$, so the flux of a constant vector $\\langle A, B, C \\rangle$ through it is $(A + B + C)\\frac{a^2}{2}$.",
        "斯托克斯定理把沿 $C$ 的环量换成 $\\nabla \\times \\mathbf{F}$ 穿过任一以 $C$ 为边界的曲面的通量。对 $\\mathbf{F} = \\langle pz, qx, ry \\rangle$，旋度是常向量 $\\langle r, p, q \\rangle$。取顶点为 $(a, 0, 0)$、$(0, a, 0)$、$(0, 0, a)$ 的三角形，法向量背离原点。它在三个坐标平面上的投影面积都是 $\\frac{a^2}{2}$，所以常向量 $\\langle A, B, C \\rangle$ 穿过它的通量为 $(A + B + C)\\frac{a^2}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-3, 4);
        const q = rng.nonZero(-3, 4);
        const r = rng.nonZero(-3, 4);
        const a = rng.int(1, 5);
        const ans = Q.of((p + q + r) * a * a, 2);
        return numberProblem({
          prompt: t(
            `$C$ is the boundary of the triangle with vertices $(${a}, 0, 0)$, $(0, ${a}, 0)$, $(0, 0, ${a})$, traversed in that order. Use Stokes' theorem to find $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle ${poly([p, "z"])}, ${poly([q, "x"])}, ${poly([r, "y"])} \\rangle$.`,
            `$C$ 是顶点为 $(${a}, 0, 0)$、$(0, ${a}, 0)$、$(0, 0, ${a})$ 的三角形边界，按此顺序绕行。用斯托克斯定理求 $\\mathbf{F} = \\langle ${poly([p, "z"])}, ${poly([q, "x"])}, ${poly([r, "y"])} \\rangle$ 的 $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          wrong: [ans.neg(), Q.of((p + q + r) * a * a), Q.of((p + q + r) * a * a, 6)],
          solution: t(
            `$\\nabla \\times \\mathbf{F} = \\langle ${r}, ${p}, ${q} \\rangle$. The triangle's normal $\\langle 1, 1, 1 \\rangle$ matches the orientation, and each projection has area $${Q.of(a * a, 2).toLatex()}$, so the circulation is $(${[r, p, q].map((x) => (x < 0 ? `(${x})` : `${x}`)).join(" + ")}) \\cdot ${Q.of(a * a, 2).toLatex()} = ${ans.toLatex()}$.`,
            `$\\nabla \\times \\mathbf{F} = \\langle ${r}, ${p}, ${q} \\rangle$。三角形的法向量 $\\langle 1, 1, 1 \\rangle$ 与定向一致，每个投影面积为 $${Q.of(a * a, 2).toLatex()}$，所以环量为 $(${[r, p, q].map((x) => (x < 0 ? `(${x})` : `${x}`)).join(" + ")}) \\cdot ${Q.of(a * a, 2).toLatex()} = ${ans.toLatex()}$。`,
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
