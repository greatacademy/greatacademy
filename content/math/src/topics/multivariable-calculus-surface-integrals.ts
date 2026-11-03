import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";
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
        "A parametric surface $\\mathbf{r}(u, v) = \\langle x(u, v), y(u, v), z(u, v) \\rangle$ maps pairs $(u, v) \\in D$ to points in $\\mathbb{R}^3$. For example, $\\mathbf{r}(u, v) = \\langle a u, b v, c u + d v \\rangle$ describes a plane.",
        "参数曲面 $\\mathbf{r}(u, v) = \\langle x(u, v), y(u, v), z(u, v) \\rangle$ 将参数对 $(u, v) \\in D$ 映射到 $\\mathbb{R}^3$ 中的空间点。例如 $\\mathbf{r}(u, v) = \\langle a u, b v, c u + d v \\rangle$ 描述一个平面。",
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
        "For $\\mathbf{r}(u, v) = \\langle u, v, a u^2 + b v^2 \\rangle$, the tangent vectors are $\\mathbf{r}_u = \\langle 1, 0, 2au \\rangle$ and $\\mathbf{r}_v = \\langle 0, 1, 2bv \\rangle$. The normal vector is $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -2au, -2bv, 1 \\rangle$.",
        "对于 $\\mathbf{r}(u, v) = \\langle u, v, a u^2 + b v^2 \\rangle$，切向量为 $\\mathbf{r}_u = \\langle 1, 0, 2au \\rangle$ 和 $\\mathbf{r}_v = \\langle 0, 1, 2bv \\rangle$。其法向量为 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle -2au, -2bv, 1 \\rangle$。",
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
        "A cone $z^2 = k^2(x^2 + y^2)$ can be parameterized by $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, k u \\rangle$ where $u \\ge 0$ is the radial distance and $v \\in [0, 2\\pi)$ is the angle.",
        "圆锥面 $z^2 = k^2(x^2 + y^2)$ 可参数化为 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, k u \\rangle$，其中 $u \\ge 0$ 为径向距离，$v \\in [0, 2\\pi)$ 为方位角。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        const u = rng.int(2, 12);
        const z = k * u;

        const prompt = t(
          `In the standard parametrization of the cone $z = ${k}\\sqrt{x^2 + y^2}$ given by $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, ${k}u \\rangle$, find the value of $z$ when $u = ${u}$.`,
          `在锥面 $z = ${k}\\sqrt{x^2 + y^2}$ 的标准参数化 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, ${k}u \\rangle$ 中，当参数 $u = ${u}$ 时，求 $z$ 的值。`,
        );
        const solution = t(
          steps(`From the parametrization, $z(u, v) = ${k}u$.`, `Substitute $u = ${u}$: $z = ${k}(${u}) = ${z}$.`),
          steps(`由参数方程可知，$z(u, v) = ${k}u$。`, `代入 $u = ${u}$：$z = ${k}(${u}) = ${z}$。`),
        );
        return numberProblem({
          prompt,
          solution,
          answer: z,
          wrong: [z + k, z - k, k * k * u],
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
        "For a paraboloid $z = a(x^2 + y^2)$, setting $x = u \\cos v$ and $y = u \\sin v$ yields $z = a u^2$. The surface is $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, a u^2 \\rangle$.",
        "对于抛物面 $z = a(x^2 + y^2)$，令 $x = u \\cos v$，$y = u \\sin v$，可得 $z = a u^2$。参数方程为 $\\mathbf{r}(u, v) = \\langle u \\cos v, u \\sin v, a u^2 \\rangle$。",
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
        "For $\\mathbf{r}(u, v) = \\langle R \\cos u, R \\sin u, v \\rangle$, the tangent vectors are $\\mathbf{r}_u = \\langle -R \\sin u, R \\cos u, 0 \\rangle$ and $\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$. The normal vector is $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R \\cos u, R \\sin u, 0 \\rangle$ with magnitude $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = R$.",
        "对于 $\\mathbf{r}(u, v) = \\langle R \\cos u, R \\sin u, v \\rangle$，切向量为 $\\mathbf{r}_u = \\langle -R \\sin u, R \\cos u, 0 \\rangle$，$\\mathbf{r}_v = \\langle 0, 0, 1 \\rangle$。其法向量为 $\\mathbf{r}_u \\times \\mathbf{r}_v = \\langle R \\cos u, R \\sin u, 0 \\rangle$，模长恒为 $\\|\\mathbf{r}_u \\times \\mathbf{r}_v\\| = R$。",
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
        "For a constant function $g(x, y, z) = k$, the surface integral $\\iint_S k\\,dS$ simply equals $k \\times \\text{Area}(S)$.",
        "对于常数函数 $g(x, y, z) = k$，第一型曲面积分 $\\iint_S k\\,dS$ 等于 $k \\times \\text{Area}(S)$。",
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
        "When integrating $f(x, y, z) = c$ over a planar surface $z = 2x + 2y$ where $\\sqrt{1 + g_x^2 + g_y^2} = 3$, the integral is $\\iint_S c\\,dS = 3c \\times \\text{Area}(D)$.",
        "在平面 $z = 2x + 2y$（根式系数 $\\sqrt{1 + g_x^2 + g_y^2} = 3$）上积分常数 $f(x, y, z) = c$ 时，积分值为 $\\iint_S c\\,dS = 3c \\times \\text{Area}(D)$。",
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
        "For $\\mathbf{F} = \\langle P, Q, R \\rangle$ and surface $z = g(x, y)$ oriented upward, the normal differential is $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle dA$. Thus $\\mathbf{F} \\cdot d\\mathbf{S} = (-P g_x - Q g_y + R)\\,dA$.",
        "对于向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$ 与向上定向的曲面 $z = g(x, y)$，法向向量微元为 $d\\mathbf{S} = \\langle -g_x, -g_y, 1 \\rangle dA$。因此 $\\mathbf{F} \\cdot d\\mathbf{S} = (-P g_x - Q g_y + R)\\,dA$。",
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
        "The Divergence Theorem converts a closed surface flux integral into a triple integral: $\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\text{div}\\,\\mathbf{F}\\,dV$.",
        "高斯散度定理将闭合曲面的通量积分转化为区域上的三重积分：$\\oiint_S \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_E \\text{div}\\,\\mathbf{F}\\,dV$。",
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
        "For $\\mathbf{F} = \\langle -a y, a x, 0 \\rangle$, the curl is $\\text{curl}\\,\\mathbf{F} = \\langle 0, 0, 2a \\rangle$. For a flat surface $S$ in the $xy$-plane with upward normal $\\mathbf{k}$, $\\iint_S (\\text{curl}\\,\\mathbf{F}) \\cdot d\\mathbf{S} = 2a \\times \\text{Area}(S)$.",
        "对于向量场 $\\mathbf{F} = \\langle -a y, a x, 0 \\rangle$，其旋度为 $\\text{curl}\\,\\mathbf{F} = \\langle 0, 0, 2a \\rangle$。对于 $xy$ 平面内向上定向的平面片 $S$，$\\iint_S (\\text{curl}\\,\\mathbf{F}) \\cdot d\\mathbf{S} = 2a \\times \\text{Area}(S)$。",
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
