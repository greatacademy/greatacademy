import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, paren, plane, poly, Q } from "@ga/subject-math";
import { multivariableDrawings5 } from "../explanation-drawings-multivariable-5.ts";
import { multivariableDrawings6 } from "../explanation-drawings-multivariable-6.ts";
import {
  choiceProblem,
  explainedChoice,
  numberProblem,
  type PointProblem,
  pointLatex,
  pointProblem,
  say,
  vectorLatex,
  why,
  withMistakes,
  yesNo,
} from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** asQ turns a number into a rational number so that values can be compared. */
const asQ = (c: number | Q): Q => (typeof c === "number" ? Q.of(c) : c);

/** distinct drops the mistakes whose value is the answer or repeats an earlier one. */
function distinct<M extends { readonly value: number | Q }>(answer: number | Q, mistakes: readonly M[]): M[] {
  return mistakes.filter((m, i, all) => !asQ(m.value).eq(asQ(answer)) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
}

/** coef writes a coefficient in front of a term, leaving out a 1. */
const coef = (n: number): string => (n === 1 ? "" : n === -1 ? "-" : `${n}`);

/** over writes n/d as a fraction, followed by its lowest terms when they differ. */
function over(n: number, d: number): string {
  const f = `\\frac{${n}}{${d}}`;
  const v = Q.of(n, d).toLatex();
  return v === f ? f : `${f} = ${v}`;
}

/** Pythagorean triples for clean coordinates. */
const pythagoreanTriples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [12, 16, 20],
  [15, 20, 25],
] as const;

/** Wrong is a point or vector that a typical mistake gives, with what to say about it in English and Chinese. */
type Wrong = readonly [values: readonly (number | Q)[], en: string, zh: string];

/** located builds a point or vector problem whose wrong responses say what went wrong; repeats and the answer are dropped. */
function located(p: Omit<PointProblem, "wrong">, mistakes: readonly Wrong[]): Problem {
  const write = p.vector ? vectorLatex : pointLatex;
  const seen = new Set([write(p.answer)]);
  const kept = mistakes.filter(([v]) => !seen.has(write(v)) && Boolean(seen.add(write(v))));
  return withMistakes(
    pointProblem({ ...p, wrong: kept.map(([v]) => v) }),
    kept.map(([v, en, zh]) => say(write(v), en, zh)),
  );
}

/** Helper for multiple-choice problems with shuffled options. */
function _pickChoice(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const all = [right, ...wrong];
  const perm = rng.shuffle(all.map((_, i) => i));
  const options = perm.map((i) => all[i]!);
  const correct = perm.indexOf(0);
  return choiceProblem({ prompt, options, correct, solution });
}

// ---------------------------------------------------------------------------
// 4.18 Line Integrals of Scalar Functions
// ---------------------------------------------------------------------------

/** simpleClosedAndOrientedCurves classifies curve topologies and orientations. */
export const simpleClosedAndOrientedCurves: TopicDef = {
  id: "simple-closed-and-oriented-curves",
  title: t("Simple, Closed, and Oriented Curves", "简单曲线、闭曲线与有向曲线"),
  summary: t(
    "A curve is simple if it does not cross itself, closed if its endpoints coincide, and oriented when endowed with a direction of traversal.",
    "简单曲线不自交，闭曲线起点与终点重合，有向曲线具有指定的遍历行进方向。",
  ),
  intro: t(
    "Classify the curve $\\mathbf{r}(t) = (t^2, t)$ for $-1 \\le t \\le 1$. It starts at $(1, -1)$ and ends at $(1, 1)$, two different points, so it is not closed. Two parameter values with the same point would need the same second coordinate $t$, so they are equal: the curve never crosses itself and is simple. As $t$ increases, $y = t$ increases, so the curve is oriented upward along the parabola $x = y^2$.\n\nCheck: at $t = 0$ the point is the vertex $(0, 0)$, between the two ends, and the curve passes through it once.\n\nIn this lesson we decide whether a curve is simple and whether it is closed, and read the orientation that its parametrization gives it.",
    "判断曲线 $\\mathbf{r}(t) = (t^2, t)$，$-1 \\le t \\le 1$ 的类型。它从 $(1, -1)$ 出发，到 $(1, 1)$ 结束，是两个不同的点，所以不闭合。两个参数值给出同一点时第二个坐标 $t$ 必须相同，于是它们相等：曲线从不自交，是简单曲线。$t$ 增大时 $y = t$ 增大，所以曲线沿抛物线 $x = y^2$ 向上定向。\n\n检验：$t = 0$ 时点是顶点 $(0, 0)$，位于两端之间，曲线只经过它一次。\n\n本课我们判断曲线是否简单、是否闭合，并读出参数化赋予它的定向。",
  ),
  prerequisites: ["the-arc-length-of-a-vector-valued-function"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-curve-topologies-and-orientations",
      figure: multivariableDrawings5["simple-closed-and-oriented-curves#identifying-curve-topologies-and-orientations"],
      title: t("Identifying curve topologies and orientations", "识别曲线的拓扑特征与定向"),
      explanation: t(
        "A curve $\\mathbf{r}(t)$, $a \\le t \\le b$, is **closed** when $\\mathbf{r}(a) = \\mathbf{r}(b)$, and **simple** when no two parameter values other than $a$ and $b$ give the same point. Compare the two ends first, then look for a crossing.\n- **Simple and closed**: a circle, an ellipse, the boundary of a polygon.\n- **Closed but not simple**: a figure eight, which passes through its center twice.\n- **Simple but not closed**: a segment, an arc.\n\nFor example, the half circle $(\\cos t, \\sin t)$, $0 \\le t \\le \\pi$, ends at $(-1, 0)$, not at its start $(1, 0)$, and never crosses itself: it is simple but not closed.\n\n> **Watch out.** The two ends of a closed curve meeting is not a crossing. A curve fails to be simple only when two other parameter values give the same point.",
        "曲线 $\\mathbf{r}(t)$，$a \\le t \\le b$，当 $\\mathbf{r}(a) = \\mathbf{r}(b)$ 时是**闭曲线**；当除 $a$ 和 $b$ 外没有两个参数值给出同一点时是**简单曲线**。先比较两端，再找自交点。\n- **简单闭曲线**：圆周、椭圆、多边形边界。\n- **闭但不简单**：8 字形，两次经过中心。\n- **简单非闭曲线**：线段、圆弧。\n\n例如半圆 $(\\cos t, \\sin t)$，$0 \\le t \\le \\pi$，终点 $(-1, 0)$ 不是起点 $(1, 0)$，且从不自交：它是简单非闭曲线。\n\n> **注意。** 闭曲线的两端重合不算自交。只有另外两个参数值给出同一点时，曲线才不是简单的。",
      ),
      generate(rng: Rng): Problem {
        const type = rng.int(0, 2);
        const r = rng.int(2, 10);
        const sc = t("Simple and closed", "简单闭曲线");
        const cns = t("Closed but not simple", "闭但不简单的曲线");
        const snc = t("Simple but not closed", "简单非闭曲线");
        const nn = t("Neither simple nor closed", "既非简单亦非闭曲线");
        const W = (option: Text, en: string, zh: string) => ({ option, why: t(en, zh) });
        if (type === 0) {
          return explainedChoice(rng, {
            prompt: t(
              `Classify the plane curve $\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$ for $0 \\le t \\le 2\\pi$.`,
              `判断平面曲线 $\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$（$0 \\le t \\le 2\\pi$）的类型。`,
            ),
            correct: sc,
            wrong: [
              W(
                cns,
                "Meeting at the two ends is what makes a curve closed, not a crossing, and no two other parameter values give one point",
                "两端重合使曲线闭合，并不是自交，也没有另外两个参数值给出同一点",
              ),
              W(snc, `The curve ends where it starts, at $(${r}, 0)$, so it is closed`, `曲线终点与起点都是 $(${r}, 0)$，所以它是闭合的`),
              W(nn, "It ends where it starts and never crosses itself", "它回到起点，且从不自交"),
            ],
            solution: walked(
              [
                [
                  ["Compare the ends", "比较两端"],
                  t(
                    `$\\mathbf{r}(0) = \\mathbf{r}(2\\pi) = (${r}, 0)$, so the curve is closed.`,
                    `$\\mathbf{r}(0) = \\mathbf{r}(2\\pi) = (${r}, 0)$，所以曲线闭合。`,
                  ),
                ],
                [
                  ["Look for a crossing", "寻找自交点"],
                  t(
                    "The angle $t$ takes each direction once on $[0, 2\\pi)$, so no two other parameter values give the same point: the curve is simple.",
                    "角 $t$ 在 $[0, 2\\pi)$ 上每个方向只取一次，所以没有另外两个参数值给出同一点：曲线是简单的。",
                  ),
                ],
              ],
              t(
                `Every point satisfies $x^2 + y^2 = ${r * r}$, and the circle is traced exactly once: simple and closed.`,
                `每个点都满足 $x^2 + y^2 = ${r * r}$，圆恰好被描一次：简单且闭合。`,
              ),
            ),
          });
        }
        if (type === 1) {
          return explainedChoice(rng, {
            prompt: t(
              `Classify the plane curve $\\mathbf{r}(t) = (t, ${r}t)$ for $0 \\le t \\le 1$.`,
              `判断平面曲线 $\\mathbf{r}(t) = (t, ${r}t)$（$0 \\le t \\le 1$）的类型。`,
            ),
            correct: snc,
            wrong: [
              W(
                sc,
                `The ends $(0, 0)$ and $(1, ${r})$ are different points, so it is not closed`,
                `端点 $(0, 0)$ 与 $(1, ${r})$ 不同，所以不闭合`,
              ),
              W(cns, "The ends differ, so it is not closed, and it never crosses itself", "两端不同，所以不闭合，而且它从不自交"),
              W(
                nn,
                "The first coordinate $t$ takes each value once, so the segment never crosses itself",
                "第一个坐标 $t$ 每个值只取一次，所以线段从不自交",
              ),
            ],
            solution: walked(
              [
                [
                  ["Compare the ends", "比较两端"],
                  t(
                    `$\\mathbf{r}(0) = (0, 0)$ and $\\mathbf{r}(1) = (1, ${r})$ differ, so the curve is not closed.`,
                    `$\\mathbf{r}(0) = (0, 0)$ 与 $\\mathbf{r}(1) = (1, ${r})$ 不同，所以曲线不闭合。`,
                  ),
                ],
                [
                  ["Look for a crossing", "寻找自交点"],
                  t(
                    "Two parameter values with the same point have the same first coordinate $t$, so they are equal: the curve is simple.",
                    "两个参数值给出同一点时第一个坐标 $t$ 相同，所以它们相等：曲线是简单的。",
                  ),
                ],
              ],
              t(
                `The curve is the piece of the line $y = ${r}x$ between $x = 0$ and $x = 1$, a segment: simple but not closed.`,
                `曲线是直线 $y = ${r}x$ 在 $x = 0$ 与 $x = 1$ 之间的一段，是线段：简单但不闭合。`,
              ),
            ),
          });
        }
        return explainedChoice(rng, {
          prompt: t(
            `Classify the plane curve $\\mathbf{r}(t) = (${r}\\sin t, ${r}\\sin 2t)$ for $0 \\le t \\le 2\\pi$.`,
            `判断平面曲线 $\\mathbf{r}(t) = (${r}\\sin t, ${r}\\sin 2t)$（$0 \\le t \\le 2\\pi$）的类型。`,
          ),
          correct: cns,
          wrong: [
            W(
              sc,
              "It passes through the origin again at $t = \\pi$, in the middle of the parameter interval, so it crosses itself",
              "它在参数区间中间的 $t = \\pi$ 处再次经过原点，所以自交",
            ),
            W(
              snc,
              "$\\mathbf{r}(0) = \\mathbf{r}(2\\pi) = (0, 0)$, so it is closed",
              "$\\mathbf{r}(0) = \\mathbf{r}(2\\pi) = (0, 0)$，所以它是闭合的",
            ),
            W(nn, "It ends where it starts, so it is closed, even though it is not simple", "它回到起点，所以是闭合的，尽管它不是简单的"),
          ],
          solution: walked(
            [
              [
                ["Compare the ends", "比较两端"],
                t(
                  "$\\mathbf{r}(0) = \\mathbf{r}(2\\pi) = (0, 0)$, so the curve is closed.",
                  "$\\mathbf{r}(0) = \\mathbf{r}(2\\pi) = (0, 0)$，所以曲线闭合。",
                ),
              ],
              [
                ["Look for a crossing", "寻找自交点"],
                t(
                  "$\\mathbf{r}(\\pi) = (0, 0)$ as well, and $\\pi$ lies strictly inside $[0, 2\\pi]$, so the curve crosses itself at the origin: it is not simple.",
                  "$\\mathbf{r}(\\pi) = (0, 0)$ 也成立，且 $\\pi$ 严格位于 $[0, 2\\pi]$ 内部，所以曲线在原点自交：不是简单的。",
                ),
              ],
            ],
            t(
              `At $t = \\frac{\\pi}{2}$ the point is $(${r}, 0)$ and at $t = \\frac{3\\pi}{2}$ it is $(-${r}, 0)$: the two loops lie on either side of the origin, where they meet.`,
              `$t = \\frac{\\pi}{2}$ 时点为 $(${r}, 0)$，$t = \\frac{3\\pi}{2}$ 时为 $(-${r}, 0)$：两个环分居原点两侧，在原点相交。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-orientation-of-a-parametrized-ellipse",
      title: t("The orientation of a parametrized ellipse", "参数化椭圆的定向"),
      explanation: t(
        "A parametrization gives a closed curve an orientation, the direction of increasing $t$. To decide it, find where the curve is at $t = 0$ and where its velocity $\\mathbf{r}'(0)$ points. For $\\mathbf{r}(t) = (3\\sin t, -2\\cos t)$ the point starts at the bottom, $(0, -2)$, with velocity $(3, 0)$ to the right, so it runs counterclockwise.\n\n> **Watch out.** The starting point alone does not decide the direction: $(a\\cos t, b\\sin t)$ and $(a\\cos t, -b\\sin t)$ both start at $(a, 0)$ but run opposite ways. Use the velocity at the start.",
        "参数化赋予闭曲线一个定向，即 $t$ 增大的方向。判断方法是求出 $t = 0$ 时曲线的位置以及速度 $\\mathbf{r}'(0)$ 的方向。对 $\\mathbf{r}(t) = (3\\sin t, -2\\cos t)$，点从底部 $(0, -2)$ 出发，速度 $(3, 0)$ 向右，所以逆时针运动。\n\n> **注意。** 仅凭起点无法判断方向：$(a\\cos t, b\\sin t)$ 与 $(a\\cos t, -b\\sin t)$ 都从 $(a, 0)$ 出发，却方向相反。要看起点处的速度。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 7);
        const b = rng.int(1, 7);
        const kind = rng.int(0, 3);
        const x = [`${coef(a)}\\cos t`, `${coef(a)}\\cos t`, `${coef(a)}\\sin t`, `-${coef(a)}\\sin t`][kind]!;
        const y = [`${coef(b)}\\sin t`, `-${coef(b)}\\sin t`, `${coef(b)}\\cos t`, `${coef(b)}\\cos t`][kind]!;
        const ccw = kind === 0 || kind === 3;
        const start = [`(${a}, 0)`, `(${a}, 0)`, `(0, ${b})`, `(0, ${b})`][kind]!;
        const velocity = [`(0, ${b})`, `(0, -${b})`, `(${a}, 0)`, `(-${a}, 0)`][kind]!;
        const quarter = [`(0, ${b})`, `(0, -${b})`, `(${a}, 0)`, `(-${a}, 0)`][kind]!;
        const next = [t("upward", "向上"), t("downward", "向下"), t("to the right", "向右"), t("to the left", "向左")][kind]!;
        const cc = t("Counterclockwise", "逆时针");
        const cw = t("Clockwise", "顺时针");
        const way = ccw ? t("counterclockwise", "逆时针") : t("clockwise", "顺时针");
        return explainedChoice(rng, {
          prompt: t(
            `In which direction does $\\mathbf{r}(t) = (${x}, ${y})$, $0 \\le t \\le 2\\pi$, trace its ellipse?`,
            `$\\mathbf{r}(t) = (${x}, ${y})$，$0 \\le t \\le 2\\pi$，沿哪个方向描出椭圆？`,
          ),
          correct: ccw ? cc : cw,
          wrong: [
            {
              option: ccw ? cw : cc,
              why: t(
                `From $${start}$ the velocity $${velocity}$ points ${next.en}, which goes ${way.en}`,
                `从 $${start}$ 出发，速度 $${velocity}$ ${next["zh-CN"]}，这是${way["zh-CN"]}方向`,
              ),
            },
            {
              option: t("Neither: it moves back and forth", "都不是：它来回移动"),
              why: t(
                "Sine and cosine each run once through their cycle, so the point goes once around the ellipse in one direction",
                "正弦和余弦各走完一个周期，所以点沿一个方向绕椭圆一周",
              ),
            },
          ],
          solution: walked(
            [
              [
                ["Find the start", "求起点"],
                t(`At $t = 0$ the point is $\\mathbf{r}(0) = ${start}$.`, `$t = 0$ 时点为 $\\mathbf{r}(0) = ${start}$。`),
              ],
              [
                ["Find the velocity there", "求该处的速度"],
                t(
                  `$\\mathbf{r}'(0) = ${velocity}$ points ${next.en}, so the orientation is ${way.en}.`,
                  `$\\mathbf{r}'(0) = ${velocity}$ ${next["zh-CN"]}，所以定向为${way["zh-CN"]}。`,
                ),
              ],
            ],
            t(
              `A quarter turn later, at $t = \\frac{\\pi}{2}$, the point is at $${quarter}$, which is where ${way.en} motion from $${start}$ leads.`,
              `四分之一周后，$t = \\frac{\\pi}{2}$ 时点在 $${quarter}$，正是从 $${start}$ 出发${way["zh-CN"]}运动所到之处。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctions evaluates scalar line integrals. */
export const lineIntegralsOfScalarFunctions: TopicDef = {
  id: "line-integrals-of-scalar-functions",
  title: t("Line Integrals of Scalar Functions", "标量函数的第一类曲线积分"),
  summary: t(
    "The scalar line integral $\\int_C f\\,ds$ integrates a function along a curve with respect to arc length $ds = \\|\\mathbf{r}'(t)\\|\\,dt$.",
    "标量函数的曲线积分 $\\int_C f\\,ds$ 沿曲线对弧长微元 $ds = \\|\\mathbf{r}'(t)\\|\\,dt$ 积分。",
  ),
  intro: t(
    "Find $\\int_C x\\,ds$ along the segment $C$ from $(1, 2)$ to $(4, 6)$. Parametrize it by $\\mathbf{r}(t) = (1 + 3t, 2 + 4t)$, $0 \\le t \\le 1$. Then $\\mathbf{r}'(t) = (3, 4)$, so $ds = \\sqrt{3^2 + 4^2}\\,dt = 5\\,dt$, and $\\int_C x\\,ds = \\int_0^1 (1 + 3t) \\cdot 5\\,dt = 5\\left(1 + \\frac{3}{2}\\right) = \\frac{25}{2}$.\n\nCheck: $x$ grows evenly along the segment, so its average is its value $\\frac{5}{2}$ at the midpoint, and the average times the length $5$ is $\\frac{25}{2}$.\n\nIn this lesson we evaluate scalar line integrals $\\int_C f\\,ds = \\int_a^b f(\\mathbf{r}(t))\\,\\|\\mathbf{r}'(t)\\|\\,dt$.",
    "沿从 $(1, 2)$ 到 $(4, 6)$ 的线段 $C$ 求 $\\int_C x\\,ds$。参数化为 $\\mathbf{r}(t) = (1 + 3t, 2 + 4t)$，$0 \\le t \\le 1$。则 $\\mathbf{r}'(t) = (3, 4)$，所以 $ds = \\sqrt{3^2 + 4^2}\\,dt = 5\\,dt$，$\\int_C x\\,ds = \\int_0^1 (1 + 3t) \\cdot 5\\,dt = 5\\left(1 + \\frac{3}{2}\\right) = \\frac{25}{2}$。\n\n检验：$x$ 沿线段均匀增长，所以平均值是中点处的值 $\\frac{5}{2}$，平均值乘以长度 $5$ 得 $\\frac{25}{2}$。\n\n本课我们计算标量线积分 $\\int_C f\\,ds = \\int_a^b f(\\mathbf{r}(t))\\,\\|\\mathbf{r}'(t)\\|\\,dt$。",
  ),
  prerequisites: ["simple-closed-and-oriented-curves"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-scalar-line-integrals-using-arc-length",
      figure: multivariableDrawings5["line-integrals-of-scalar-functions#evaluating-scalar-line-integrals-using-arc-length"],
      title: t("Evaluating scalar line integrals using arc length", "利用弧长微元计算标量曲线积分"),
      explanation: t(
        "A scalar line integral adds up the function's values along the curve weighted by small lengths, so the integrand includes the speed of the parametrization. For a curve parameterized by $\\mathbf{r}(t)$ on $[a, b]$, the line integral is:\n\n$$\\int_C f(x, y)\\,ds = \\int_a^b f(\\mathbf{r}(t))\\,\\|\\mathbf{r}'(t)\\|\\,dt.$$\n\nFor the segment from $(0, 0)$ to $(1, 1)$, $\\mathbf{r}(t) = (t, t)$ has speed $\\sqrt{2}$, so $\\int_C (x + y)\\,ds = \\int_0^1 2t\\sqrt{2}\\,dt = \\sqrt{2}$.\n\n> **Watch out.** $ds$ is not $dt$: it carries the speed $\\|\\mathbf{r}'(t)\\|$, here the length of the segment. And the speed is $\\sqrt{x_1^2 + y_1^2}$, not $x_1 + y_1$.",
        "数量值曲线积分把函数沿曲线的值按小段长度加权相加，所以被积函数中包含参数化的速率。对于由 $\\mathbf{r}(t)$（$t \\in [a, b]$）参数化的曲线，第一类曲线积分为：\n\n$$\\int_C f(x, y)\\,ds = \\int_a^b f(\\mathbf{r}(t))\\,\\|\\mathbf{r}'(t)\\|\\,dt$$\n\n对从 $(0, 0)$ 到 $(1, 1)$ 的线段，$\\mathbf{r}(t) = (t, t)$ 的速率为 $\\sqrt{2}$，所以 $\\int_C (x + y)\\,ds = \\int_0^1 2t\\sqrt{2}\\,dt = \\sqrt{2}$。\n\n> **注意。** $ds$ 不是 $dt$：它带有速率 $\\|\\mathbf{r}'(t)\\|$，这里就是线段的长度。速率是 $\\sqrt{x_1^2 + y_1^2}$，不是 $x_1 + y_1$。",
      ),
      generate(rng: Rng): Problem {
        const [x1_0, y1_0, L0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const x1 = x1_0 * k;
        const y1 = y1_0 * k;
        const L = L0 * k;
        const c = rng.int(1, 6);
        const num = c * (x1 + y1) * L;
        const ans = Q.of(num, 2);
        return numberProblem({
          prompt: t(
            `Evaluate the scalar line integral $\\int_C ${coef(c)}(x + y)\\,ds$ along the straight line segment $C$ from $(0, 0)$ to $(${x1}, ${y1})$.`,
            `计算第一类曲线积分 $\\int_C ${coef(c)}(x + y)\\,ds$ 的值，其中 $C$ 为从 $(0, 0)$ 到 $(${x1}, ${y1})$ 的直线段。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(num, "That forgets the $\\frac{1}{2}$ from $\\int_0^1 t\\,dt$.", "那是漏了 $\\int_0^1 t\\,dt$ 中的 $\\frac{1}{2}$。"),
            why(
              Q.of(c * (x1 + y1), 2),
              `That uses $dt$ for $ds$; here $ds = ${L}\\,dt$.`,
              `那是把 $ds$ 当作 $dt$；这里 $ds = ${L}\\,dt$。`,
            ),
            why(
              Q.of(c * (x1 + y1) * (x1 + y1), 2),
              `That takes the speed to be $${x1} + ${y1}$; it is $\\sqrt{${x1}^2 + ${y1}^2} = ${L}$.`,
              `那是把速率当作 $${x1} + ${y1}$；速率是 $\\sqrt{${x1}^2 + ${y1}^2} = ${L}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(`$\\mathbf{r}(t) = (${x1}t, ${y1}t)$ for $0 \\le t \\le 1$.`, `$\\mathbf{r}(t) = (${x1}t, ${y1}t)$，$0 \\le t \\le 1$。`),
              ],
              [
                ["Find $ds$", "求 $ds$"],
                t(
                  `$\\mathbf{r}'(t) = (${x1}, ${y1})$, so $ds = \\sqrt{${x1}^2 + ${y1}^2}\\,dt = ${L}\\,dt$.`,
                  `$\\mathbf{r}'(t) = (${x1}, ${y1})$，所以 $ds = \\sqrt{${x1}^2 + ${y1}^2}\\,dt = ${L}\\,dt$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `On the segment $x + y = ${x1 + y1}t$, so the integral is $${c * (x1 + y1) * L}\\int_0^1 t\\,dt = ${over(num, 2)}$.`,
                  `在线段上 $x + y = ${x1 + y1}t$，所以积分为 $${c * (x1 + y1) * L}\\int_0^1 t\\,dt = ${over(num, 2)}$。`,
                ),
              ],
            ],
            t(
              `The integrand grows evenly along the segment, so its average is its value $${over(c * (x1 + y1), 2)}$ at the midpoint; times the length $${L}$ this is $${ans.toLatex()}$.`,
              `被积函数沿线段均匀增长，平均值是中点处的值 $${over(c * (x1 + y1), 2)}$；乘以长度 $${L}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-scalar-line-integral-of-xy-along-a-segment",
      figure: multivariableDrawings5["line-integrals-of-scalar-functions#a-scalar-line-integral-of-xy-along-a-segment"],
      title: t("A scalar line integral of $cxy$ along a segment", "沿线段计算 $cxy$ 的标量线积分"),
      explanation: t(
        "A scalar line integral adds up the values of $f$ weighted by arc length, so the first step is always to express both $f$ and $ds$ in terms of one parameter. Parametrize the segment from $(0, 0)$ to $(x_1, y_1)$ by $\\mathbf{r}(t) = (x_1t, y_1t)$ for $0 \\le t \\le 1$. Then $ds = \\|\\mathbf{r}'(t)\\|\\,dt = L\\,dt$ with $L = \\sqrt{x_1^2 + y_1^2}$, and\n\n$$\\int_C c\\,xy\\,ds = \\int_0^1 c\\,x_1y_1t^2 \\cdot L\\,dt = \\frac{c\\,x_1y_1L}{3}.$$\n\nFrom $(0, 0)$ to $(1, 2)$, $L = \\sqrt{5}$ and $\\int_C xy\\,ds = \\frac{2\\sqrt{5}}{3}$.\n\n> **Watch out.** $xy = x_1y_1t^2$ is quadratic in $t$, so its integral brings $\\frac{1}{3}$, not $\\frac{1}{2}$. And the factor $L$ appears once, from $ds$.",
        "标量线积分按弧长加权累加 $f$ 的值，所以第一步总是把 $f$ 和 $ds$ 都用同一个参数表示。把从 $(0, 0)$ 到 $(x_1, y_1)$ 的线段参数化为 $\\mathbf{r}(t) = (x_1t, y_1t)$，$0 \\le t \\le 1$。则 $ds = \\|\\mathbf{r}'(t)\\|\\,dt = L\\,dt$，$L = \\sqrt{x_1^2 + y_1^2}$，且\n\n$$\\int_C c\\,xy\\,ds = \\int_0^1 c\\,x_1y_1t^2 \\cdot L\\,dt = \\frac{c\\,x_1y_1L}{3}$$\n\n从 $(0, 0)$ 到 $(1, 2)$，$L = \\sqrt{5}$，$\\int_C xy\\,ds = \\frac{2\\sqrt{5}}{3}$。\n\n> **注意。** $xy = x_1y_1t^2$ 是 $t$ 的二次式，积分带来 $\\frac{1}{3}$，不是 $\\frac{1}{2}$。因子 $L$ 只出现一次，来自 $ds$。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, L] = rng.pick(pythagoreanTriples.slice(0, 5));
        const [x1, y1] = rng.int(0, 1) === 0 ? [p, q] : [q, p];
        const c = rng.int(1, 3);
        const ans = Q.of(c * x1 * y1 * L, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C ${coef(c)}xy\\,ds$ along the segment $C$ from $(0, 0)$ to $(${x1}, ${y1})$.`,
            `沿从 $(0, 0)$ 到 $(${x1}, ${y1})$ 的线段 $C$ 计算 $\\int_C ${coef(c)}xy\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(Q.of(c * x1 * y1, 3), `That uses $dt$ for $ds$; here $ds = ${L}\\,dt$.`, `那是把 $ds$ 当作 $dt$；这里 $ds = ${L}\\,dt$。`),
            why(
              Q.of(c * x1 * y1 * L, 2),
              "$\\int_0^1 t^2\\,dt = \\frac{1}{3}$, not $\\frac{1}{2}$.",
              "$\\int_0^1 t^2\\,dt = \\frac{1}{3}$，不是 $\\frac{1}{2}$。",
            ),
            why(
              c * x1 * y1 * L,
              "That forgets the $\\frac{1}{3}$ from $\\int_0^1 t^2\\,dt$.",
              "那是漏了 $\\int_0^1 t^2\\,dt$ 中的 $\\frac{1}{3}$。",
            ),
            why(
              Q.of(c * x1 * y1 * L * L, 3),
              `That multiplies by the length twice; $ds = ${L}\\,dt$ brings one factor $${L}$.`,
              `那是乘了两次长度；$ds = ${L}\\,dt$ 只带来一个因子 $${L}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(
                  `$\\mathbf{r}(t) = (${x1}t, ${y1}t)$, $0 \\le t \\le 1$, with $ds = \\sqrt{${x1}^2 + ${y1}^2}\\,dt = ${L}\\,dt$.`,
                  `$\\mathbf{r}(t) = (${x1}t, ${y1}t)$，$0 \\le t \\le 1$，$ds = \\sqrt{${x1}^2 + ${y1}^2}\\,dt = ${L}\\,dt$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^1 ${c * x1 * y1}t^2 \\cdot ${L}\\,dt = ${over(c * x1 * y1 * L, 3)}$.`,
                  `$\\int_0^1 ${c * x1 * y1}t^2 \\cdot ${L}\\,dt = ${over(c * x1 * y1 * L, 3)}$。`,
                ),
              ],
            ],
            t(
              `With $x$ as the parameter instead, $y = ${Q.of(y1, x1).toLatex()}x$ and $ds = ${Q.of(L, x1).toLatex()}\\,dx$, so the integral is $${Q.of(c * y1 * L, x1 * x1).toLatex()}\\int_0^{${x1}} x^2\\,dx = ${ans.toLatex()}$ again.`,
              `改用 $x$ 作参数，$y = ${Q.of(y1, x1).toLatex()}x$，$ds = ${Q.of(L, x1).toLatex()}\\,dx$，积分为 $${Q.of(c * y1 * L, x1 * x1).toLatex()}\\int_0^{${x1}} x^2\\,dx = ${ans.toLatex()}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** propertiesOfLineIntegralsOfScalarFunctions covers orientation invariance. */
export const propertiesOfLineIntegralsOfScalarFunctions: TopicDef = {
  id: "properties-of-line-integrals-of-scalar-functions",
  title: t("Properties of Line Integrals of Scalar Functions", "标量函数曲线积分的性质"),
  summary: t(
    "Scalar line integrals do not depend on the orientation of the curve, $\\int_{-C} f\\,ds = \\int_C f\\,ds$, and are linear in the integrand.",
    "标量曲线积分与曲线方向无关：$\\int_{-C} f\\,ds = \\int_C f\\,ds$，且对被积函数是线性的。",
  ),
  intro: t(
    "Let $C$ be the quarter circle of radius $2$ from $(2, 0)$ to $(0, 2)$, so that $\\int_C x\\,ds = \\int_0^{\\pi/2} 2\\cos t \\cdot 2\\,dt = 4$ and $C$ has length $\\pi$. Then $\\int_{-C} (3x + 1)\\,ds = 3 \\cdot 4 + 1 \\cdot \\pi = 12 + \\pi$: reversing the curve changes nothing, and the constant $1$ contributes the length.\n\nCheck: $-C$ is traced by $(2\\sin t, 2\\cos t)$, $0 \\le t \\le \\frac{\\pi}{2}$, with $ds = 2\\,dt$, and $\\int_0^{\\pi/2} (6\\sin t + 1) \\cdot 2\\,dt = 12 + \\pi$.\n\nIn this lesson we use that scalar line integrals ignore the orientation and are linear in the integrand.",
    "设 $C$ 是半径为 $2$、从 $(2, 0)$ 到 $(0, 2)$ 的四分之一圆，于是 $\\int_C x\\,ds = \\int_0^{\\pi/2} 2\\cos t \\cdot 2\\,dt = 4$，$C$ 的长度为 $\\pi$。则 $\\int_{-C} (3x + 1)\\,ds = 3 \\cdot 4 + 1 \\cdot \\pi = 12 + \\pi$：曲线反向不改变结果，常数 $1$ 贡献长度。\n\n检验：$-C$ 由 $(2\\sin t, 2\\cos t)$，$0 \\le t \\le \\frac{\\pi}{2}$ 描出，$ds = 2\\,dt$，$\\int_0^{\\pi/2} (6\\sin t + 1) \\cdot 2\\,dt = 12 + \\pi$。\n\n本课我们利用标量线积分与定向无关、对被积函数线性这两个性质。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "invariance-under-orientation-reversal",
      figure: multivariableDrawings5["properties-of-line-integrals-of-scalar-functions#invariance-under-orientation-reversal"],
      title: t("Invariance under orientation reversal", "标量曲线积分对定向反转的对称性"),
      explanation: t(
        "Because arc length $ds = \\|\\mathbf{r}'(t)\\|\\,dt$ is always non-negative, reversing the direction of traversal does not change the sign of a scalar line integral:\n\n$$\\int_{-C} f\\,ds = \\int_C f\\,ds.$$\n\nIf $\\int_C f\\,ds = 8$, then $\\int_{-C} 6f\\,ds = 6 \\cdot 8 = 48$.\n\n> **Watch out.** Only integrals of vector fields, and those with respect to $x$ or $y$, change sign when the curve is reversed. A scalar integral with respect to arc length keeps its sign.",
        "因为弧长微元 $ds = \\|\\mathbf{r}'(t)\\|\\,dt$ 始终非负，颠倒曲线的遍历方向不会改变第一类标量曲线积分的符号：\n\n$$\\int_{-C} f\\,ds = \\int_C f\\,ds$$\n\n若 $\\int_C f\\,ds = 8$，则 $\\int_{-C} 6f\\,ds = 6 \\cdot 8 = 48$。\n\n> **注意。** 只有向量场的积分以及对 $x$ 或 $y$ 的积分在曲线反向时变号。对弧长的标量积分保持符号不变。",
      ),
      generate(rng: Rng): Problem {
        const val = rng.int(10, 50);
        const alpha = rng.int(2, 5);
        const ans = alpha * val;
        return numberProblem({
          prompt: t(
            `Suppose $\\int_C f\\,ds = ${val}$. Find the value of $\\int_{-C} ${alpha}f\\,ds$, where $-C$ denotes the same curve traversed in the opposite direction.`,
            `已知 $\\int_C f\\,ds = ${val}$。求 $\\int_{-C} ${alpha}f\\,ds$ 的值，其中 $-C$ 表示沿相反方向遍历的同一曲线。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              -ans,
              "That changes the sign; $ds$ is positive in both directions, so a scalar line integral keeps its sign.",
              "那是改变了符号；两个方向上 $ds$ 都为正，所以标量线积分不变号。",
            ),
            why(
              val,
              `That drops the factor $${alpha}$; by linearity it multiplies the integral.`,
              `那是漏了因子 $${alpha}$；由线性性它要乘到积分上。`,
            ),
            why(-val, `That changes the sign and drops the factor $${alpha}$.`, `那是改变了符号，又漏了因子 $${alpha}$。`),
          ]),
          solution: walked(
            [
              [
                ["Reverse the curve", "曲线反向"],
                t(
                  `$\\int_{-C} f\\,ds = \\int_C f\\,ds = ${val}$, since $ds \\ge 0$ either way.`,
                  `$\\int_{-C} f\\,ds = \\int_C f\\,ds = ${val}$，因为两个方向 $ds \\ge 0$。`,
                ),
              ],
              [
                ["Use linearity", "利用线性性"],
                t(
                  `$\\int_{-C} ${alpha}f\\,ds = ${alpha} \\cdot ${val} = ${ans}$.`,
                  `$\\int_{-C} ${alpha}f\\,ds = ${alpha} \\cdot ${val} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `$-C$ passes through the same points with the same small lengths, only in the other order, so the sum of $${alpha}f$ times length is the same: $${ans}$.`,
              `$-C$ 经过同样的点、同样的小段长度，只是顺序相反，所以 $${alpha}f$ 乘长度之和不变：$${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "linearity-of-scalar-line-integrals",
      title: t("Linearity of scalar line integrals", "标量线积分的线性性"),
      explanation: t(
        "Scalar line integrals are linear in the integrand: $\\int_C (\\alpha f + \\beta g)\\,ds = \\alpha\\int_C f\\,ds + \\beta\\int_C g\\,ds$. A constant term $k$ contributes $k\\int_C ds = kL$, where $L$ is the length of $C$. Unlike line integrals of vector fields, these do not change sign when the curve is reversed, because $ds$ is always positive. If $C$ has length $10$ and $\\int_C f\\,ds = 3$, then $\\int_{-C} (5f - 1)\\,ds = 15 - 10 = 5$.\n\n> **Watch out.** A constant integrates to itself times the length, $kL$, not to $k$. And a value given for another function $g$ plays no part unless $g$ appears in the integrand.",
        "标量线积分关于被积函数是线性的：$\\int_C (\\alpha f + \\beta g)\\,ds = \\alpha\\int_C f\\,ds + \\beta\\int_C g\\,ds$。常数项 $k$ 贡献 $k\\int_C ds = kL$，$L$ 为 $C$ 的长度。与向量场的线积分不同，曲线反向时它们不变号，因为 $ds$ 总是正的。若 $C$ 长 $10$，$\\int_C f\\,ds = 3$，则 $\\int_{-C} (5f - 1)\\,ds = 15 - 10 = 5$。\n\n> **注意。** 常数的积分等于它乘以长度 $kL$，不是 $k$。另一个函数 $g$ 的已知值，只有在 $g$ 出现在被积函数中时才用得上。",
      ),
      generate(rng: Rng): Problem {
        const F = rng.nonZero(-9, 9);
        const G = rng.nonZero(-9, 9);
        const L = rng.int(2, 9);
        const alpha = rng.pick([-3, -2, 2, 3, 4]);
        const k = rng.nonZero(-3, 3);
        const ans = alpha * F + k * L;
        return numberProblem({
          prompt: t(
            `A curve $C$ has length $${L}$, $\\int_C f\\,ds = ${F}$ and $\\int_C g\\,ds = ${G}$. Find $\\int_{-C} (${poly([alpha, "f"], [k, ""])})\\,ds$.`,
            `曲线 $C$ 长为 $${L}$，$\\int_C f\\,ds = ${F}$，$\\int_C g\\,ds = ${G}$。求 $\\int_{-C} (${poly([alpha, "f"], [k, ""])})\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              -ans,
              "That changes the sign for the reversed curve; scalar line integrals keep their sign.",
              "那是因曲线反向而改变了符号；标量线积分不变号。",
            ),
            why(
              alpha * F + k,
              `That integrates the constant $${k}$ to $${k}$; it gives $${k} \\cdot ${L}$, the constant times the length.`,
              `那是把常数 $${k}$ 积成 $${k}$；它应给出 $${k} \\cdot ${L}$，即常数乘以长度。`,
            ),
            why(
              alpha * F + k * G,
              "That uses the integral of $g$, which is not in the integrand.",
              "那是用了 $g$ 的积分，而 $g$ 不在被积函数中。",
            ),
            why(
              alpha * F,
              `That drops the constant term, which contributes $${k} \\cdot ${L}$.`,
              `那是丢掉了常数项，它贡献 $${k} \\cdot ${L}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Reverse the curve", "曲线反向"],
                t("A scalar line integral is the same over $-C$ as over $C$.", "标量线积分在 $-C$ 与 $C$ 上相同。"),
              ],
              [
                ["Split by linearity", "按线性拆开"],
                t(
                  `$${alpha}\\int_C f\\,ds + ${paren(k)}\\int_C ds = ${alpha} \\cdot ${paren(F)} + ${paren(k)} \\cdot ${L} = ${ans}$.`,
                  `$${alpha}\\int_C f\\,ds + ${paren(k)}\\int_C ds = ${alpha} \\cdot ${paren(F)} + ${paren(k)} \\cdot ${L} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Replacing $f$ by its average $${Q.of(F, L).toLatex()}$ along $C$ makes the integrand the constant $${Q.of(alpha * F + k * L, L).toLatex()}$, and times the length $${L}$ that is $${ans}$.`,
              `把 $f$ 换成它沿 $C$ 的平均值 $${Q.of(F, L).toLatex()}$，被积函数变成常数 $${Q.of(alpha * F + k * L, L).toLatex()}$，乘以长度 $${L}$ 得 $${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfX evaluates integrals along y = g(x). */
export const lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfX: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x",
  title: t("Line Integrals of Scalar Functions Over Paths Expressed as Functions of X", "沿 y = g(x) 路径的标量曲线积分"),
  summary: t(
    "When a path is given explicitly by y = g(x), the arc length element is ds = √(1 + [g'(x)]²) dx.",
    "当曲线由显式方程 y = g(x) 给出时，弧长微元为 ds = √(1 + [g'(x)]²) dx。",
  ),
  intro: t(
    "Find $\\int_C x\\,ds$ along the parabola $y = x^2$ from $x = 0$ to $x = 1$. With $x$ as the parameter, $ds = \\sqrt{1 + (2x)^2}\\,dx$, so the integral is $\\int_0^1 x\\sqrt{1 + 4x^2}\\,dx$. Substituting $u = 1 + 4x^2$, $du = 8x\\,dx$, gives $\\frac{1}{8}\\int_1^5 \\sqrt{u}\\,du = \\frac{1}{12}\\left(5\\sqrt{5} - 1\\right)$.\n\nCheck: the derivative of $\\frac{1}{12}(1 + 4x^2)^{3/2}$ is $\\frac{1}{12} \\cdot \\frac{3}{2} \\cdot 8x\\,(1 + 4x^2)^{1/2} = x\\sqrt{1 + 4x^2}$, the integrand.\n\nIn this lesson we evaluate scalar line integrals along graphs $y = g(x)$, with $ds = \\sqrt{1 + g'(x)^2}\\,dx$.",
    "沿抛物线 $y = x^2$ 从 $x = 0$ 到 $x = 1$ 求 $\\int_C x\\,ds$。以 $x$ 为参数，$ds = \\sqrt{1 + (2x)^2}\\,dx$，所以积分为 $\\int_0^1 x\\sqrt{1 + 4x^2}\\,dx$。令 $u = 1 + 4x^2$，$du = 8x\\,dx$，得 $\\frac{1}{8}\\int_1^5 \\sqrt{u}\\,du = \\frac{1}{12}\\left(5\\sqrt{5} - 1\\right)$。\n\n检验：$\\frac{1}{12}(1 + 4x^2)^{3/2}$ 的导数是 $\\frac{1}{12} \\cdot \\frac{3}{2} \\cdot 8x\\,(1 + 4x^2)^{1/2} = x\\sqrt{1 + 4x^2}$，正是被积函数。\n\n本课我们沿函数图像 $y = g(x)$ 计算标量线积分，$ds = \\sqrt{1 + g'(x)^2}\\,dx$。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions"],
  encompasses: [{ topic: "line-integrals-of-scalar-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "line-integrals-along-explicit-curves-y-equals-g-of-x",
      figure:
        multivariableDrawings5[
          "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x#line-integrals-along-explicit-curves-y-equals-g-of-x"
        ],
      title: t("Line integrals along explicit curves y = g(x)", "计算沿显式曲线 y = g(x) 的标量曲线积分"),
      explanation: t(
        "When the curve is a graph, use the horizontal variable as the parameter, and the arc length element includes the square root of one plus the square of the slope. For $y = mx$ with $0 \\le x \\le a$, the arc length differential is $ds = \\sqrt{1 + m^2}\\,dx$. Integrating $kx$ yields:\n\n$$\\int_C kx\\,ds = k\\sqrt{1 + m^2} \\int_0^a x\\,dx = k\\sqrt{1 + m^2}\\frac{a^2}{2}.$$\n\nAlong $y = x$ from $x = 0$ to $x = 2$, $\\int_C 2x\\,ds = 2\\sqrt{2} \\cdot 2 = 4\\sqrt{2}$.\n\n> **Watch out.** The factor is $\\sqrt{1 + m^2}$, not the slope $m$ itself, and without it the integral is taken over $dx$, the shadow of the curve on the $x$-axis, rather than its length.",
        "当曲线是函数图像时，用水平变量作为参数，弧长微元中含有 1 加斜率平方的平方根。对于 $0 \\le x \\le a$ 上的线段 $y = mx$，弧长微元为 $ds = \\sqrt{1 + m^2}\\,dx$。对 $kx$ 积分得到：\n\n$$\\int_C kx\\,ds = k\\sqrt{1 + m^2} \\int_0^a x\\,dx = k\\sqrt{1 + m^2}\\frac{a^2}{2}$$\n\n沿 $y = x$ 从 $x = 0$ 到 $x = 2$，$\\int_C 2x\\,ds = 2\\sqrt{2} \\cdot 2 = 4\\sqrt{2}$。\n\n> **注意。** 因子是 $\\sqrt{1 + m^2}$，不是斜率 $m$ 本身；没有它，积分就是对 $dx$，即曲线在 $x$ 轴上的投影，而不是对曲线长度。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const coeff = 2 * k;
        const ans = k * c * a;
        return numberProblem({
          prompt: t(
            `Evaluate the line integral $\\int_C ${coeff}x\\,ds$ along the line segment $y = ${Q.of(b, a).toLatex()}x$ from $x = 0$ to $x = ${a}$.`,
            `计算第一类曲线积分 $\\int_C ${coeff}x\\,ds$，其中曲线 $C$ 为直线段 $y = ${Q.of(b, a).toLatex()}x$ 从 $x = 0$ 到 $x = ${a}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              k * a * a,
              `That uses $dx$ for $ds$; here $ds = \\frac{${c}}{${a}}\\,dx$.`,
              `那是把 $ds$ 当作 $dx$；这里 $ds = \\frac{${c}}{${a}}\\,dx$。`,
            ),
            why(
              k * b * a,
              `That uses the slope $\\frac{${b}}{${a}}$ as the length factor; it is $\\sqrt{1 + \\frac{${b * b}}{${a * a}}} = \\frac{${c}}{${a}}$.`,
              `那是把斜率 $\\frac{${b}}{${a}}$ 当作长度因子；它应是 $\\sqrt{1 + \\frac{${b * b}}{${a * a}}} = \\frac{${c}}{${a}}$。`,
            ),
            why(
              2 * ans,
              "That forgets the $\\frac{1}{2}$ in $\\int x\\,dx = \\frac{x^2}{2}$.",
              "那是漏了 $\\int x\\,dx = \\frac{x^2}{2}$ 中的 $\\frac{1}{2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find $ds$", "求 $ds$"],
                t(
                  `$y' = \\frac{${b}}{${a}}$, so $ds = \\sqrt{1 + \\frac{${b * b}}{${a * a}}}\\,dx = \\frac{\\sqrt{${a * a + b * b}}}{${a}}\\,dx = \\frac{${c}}{${a}}\\,dx$.`,
                  `$y' = \\frac{${b}}{${a}}$，所以 $ds = \\sqrt{1 + \\frac{${b * b}}{${a * a}}}\\,dx = \\frac{\\sqrt{${a * a + b * b}}}{${a}}\\,dx = \\frac{${c}}{${a}}\\,dx$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{${coeff * c}}{${a}}\\int_0^{${a}} x\\,dx = \\frac{${coeff * c}}{${a}} \\cdot \\frac{${a * a}}{2} = ${ans}$.`,
                  `$\\frac{${coeff * c}}{${a}}\\int_0^{${a}} x\\,dx = \\frac{${coeff * c}}{${a}} \\cdot \\frac{${a * a}}{2} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The segment runs from $(0, 0)$ to $(${a}, ${b})$ and has length $${c}$; the average of $${coeff}x$ along it is its midpoint value $${k * a}$, and $${k * a} \\cdot ${c} = ${ans}$.`,
              `线段从 $(0, 0)$ 到 $(${a}, ${b})$，长度为 $${c}$；$${coeff}x$ 沿它的平均值是中点处的值 $${k * a}$，$${k * a} \\cdot ${c} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-x-squared-along-a-line-through-the-origin",
      figure:
        multivariableDrawings5[
          "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x#integrating-x-squared-along-a-line-through-the-origin"
        ],
      title: t("Integrating $kx^2$ along a line $y = mx$", "沿直线 $y = mx$ 积分 $kx^2$"),
      explanation: t(
        "For a path $y = g(x)$, $a \\le x \\le b$, the arc length element is $ds = \\sqrt{1 + g'(x)^2}\\,dx$. On the line $y = \\frac{q}{p}x$ this is the constant $\\frac{L}{p}\\,dx$ with $L = \\sqrt{p^2 + q^2}$. So\n\n$$\\int_C k\\,x^2\\,ds = \\frac{kL}{p}\\int_0^p x^2\\,dx = \\frac{k\\,p^2L}{3}.$$\n\nAlong $y = x$ from $x = 0$ to $x = 1$, $\\int_C x^2\\,ds = \\sqrt{2} \\cdot \\frac{1}{3} = \\frac{\\sqrt{2}}{3}$.\n\n> **Watch out.** The factor $\\frac{L}{p}$ divides by $p$: $\\int_0^p x^2\\,dx = \\frac{p^3}{3}$, and one power of $p$ cancels, leaving $\\frac{p^2L}{3}$.",
        "对路径 $y = g(x)$，$a \\le x \\le b$，弧长元素为 $ds = \\sqrt{1 + g'(x)^2}\\,dx$。在直线 $y = \\frac{q}{p}x$ 上它是常数 $\\frac{L}{p}\\,dx$，$L = \\sqrt{p^2 + q^2}$。所以\n\n$$\\int_C k\\,x^2\\,ds = \\frac{kL}{p}\\int_0^p x^2\\,dx = \\frac{k\\,p^2L}{3}$$\n\n沿 $y = x$ 从 $x = 0$ 到 $x = 1$，$\\int_C x^2\\,ds = \\sqrt{2} \\cdot \\frac{1}{3} = \\frac{\\sqrt{2}}{3}$。\n\n> **注意。** 因子 $\\frac{L}{p}$ 要除以 $p$：$\\int_0^p x^2\\,dx = \\frac{p^3}{3}$，约去一个 $p$，剩下 $\\frac{p^2L}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const [m, n, L] = rng.pick(pythagoreanTriples.slice(0, 5));
        const [p, q] = rng.int(0, 1) === 0 ? [m, n] : [n, m];
        const k = rng.int(1, 3);
        const ans = Q.of(k * p * p * L, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C ${coef(k)}x^2\\,ds$ along $y = \\frac{${q}}{${p}}x$ from $x = 0$ to $x = ${p}$.`,
            `沿 $y = \\frac{${q}}{${p}}x$ 从 $x = 0$ 到 $x = ${p}$ 计算 $\\int_C ${coef(k)}x^2\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(k * p ** 3, 3),
              `That uses $dx$ for $ds$; here $ds = \\frac{${L}}{${p}}\\,dx$.`,
              `那是把 $ds$ 当作 $dx$；这里 $ds = \\frac{${L}}{${p}}\\,dx$。`,
            ),
            why(
              Q.of(k * p * p * q, 3),
              `That uses the slope $\\frac{${q}}{${p}}$ as the length factor; it is $\\frac{${L}}{${p}}$.`,
              `那是把斜率 $\\frac{${q}}{${p}}$ 当作长度因子；它应是 $\\frac{${L}}{${p}}$。`,
            ),
            why(
              Q.of(k * p * p * L, 2),
              "$\\int x^2\\,dx = \\frac{x^3}{3}$, not $\\frac{x^3}{2}$.",
              "$\\int x^2\\,dx = \\frac{x^3}{3}$，不是 $\\frac{x^3}{2}$。",
            ),
            why(
              Q.of(k * p ** 3 * L, 3),
              `That multiplies by $${L}$ without dividing by $${p}$; the factor is $\\frac{${L}}{${p}}$.`,
              `那是乘了 $${L}$ 却没除以 $${p}$；因子是 $\\frac{${L}}{${p}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find $ds$", "求 $ds$"],
                t(
                  `$ds = \\sqrt{1 + \\frac{${q * q}}{${p * p}}}\\,dx = \\frac{${L}}{${p}}\\,dx$.`,
                  `$ds = \\sqrt{1 + \\frac{${q * q}}{${p * p}}}\\,dx = \\frac{${L}}{${p}}\\,dx$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{${k * L}}{${p}}\\int_0^{${p}} x^2\\,dx = \\frac{${k * L}}{${p}} \\cdot \\frac{${p ** 3}}{3} = ${ans.toLatex()}$.`,
                  `$\\frac{${k * L}}{${p}}\\int_0^{${p}} x^2\\,dx = \\frac{${k * L}}{${p}} \\cdot \\frac{${p ** 3}}{3} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `With $\\mathbf{r}(t) = (${p}t, ${q}t)$ instead, $ds = ${L}\\,dt$ and $\\int_0^1 ${k * p * p}t^2 \\cdot ${L}\\,dt = ${ans.toLatex()}$, the same value.`,
              `改用 $\\mathbf{r}(t) = (${p}t, ${q}t)$，$ds = ${L}\\,dt$，$\\int_0^1 ${k * p * p}t^2 \\cdot ${L}\\,dt = ${ans.toLatex()}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfY evaluates integrals along x = h(y). */
export const lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfY: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-y",
  title: t("Line Integrals of Scalar Functions Over Paths Expressed as Functions of Y", "沿 x = h(y) 路径的标量曲线积分"),
  summary: t(
    "When a path is given explicitly by x = h(y), the arc length element is ds = √(1 + [h'(y)]²) dy.",
    "当曲线由显式方程 x = h(y) 给出时，弧长微元为 ds = √(1 + [h'(y)]²) dy。",
  ),
  intro: t(
    "Find $\\int_C y\\,ds$ along $x = \\frac{y^2}{2}$ from $y = 0$ to $y = 1$. With $y$ as the parameter, $\\frac{dx}{dy} = y$, so $ds = \\sqrt{1 + y^2}\\,dy$ and the integral is $\\int_0^1 y\\sqrt{1 + y^2}\\,dy = \\frac{1}{3}\\left[(1 + y^2)^{3/2}\\right]_0^1 = \\frac{1}{3}\\left(2\\sqrt{2} - 1\\right)$.\n\nCheck: the derivative of $\\frac{1}{3}(1 + y^2)^{3/2}$ is $\\frac{1}{3} \\cdot \\frac{3}{2} \\cdot 2y\\,(1 + y^2)^{1/2} = y\\sqrt{1 + y^2}$, the integrand.\n\nIn this lesson we evaluate scalar line integrals along curves $x = h(y)$, with $ds = \\sqrt{1 + h'(y)^2}\\,dy$.",
    "沿 $x = \\frac{y^2}{2}$ 从 $y = 0$ 到 $y = 1$ 求 $\\int_C y\\,ds$。以 $y$ 为参数，$\\frac{dx}{dy} = y$，所以 $ds = \\sqrt{1 + y^2}\\,dy$，积分为 $\\int_0^1 y\\sqrt{1 + y^2}\\,dy = \\frac{1}{3}\\left[(1 + y^2)^{3/2}\\right]_0^1 = \\frac{1}{3}\\left(2\\sqrt{2} - 1\\right)$。\n\n检验：$\\frac{1}{3}(1 + y^2)^{3/2}$ 的导数是 $\\frac{1}{3} \\cdot \\frac{3}{2} \\cdot 2y\\,(1 + y^2)^{1/2} = y\\sqrt{1 + y^2}$，正是被积函数。\n\n本课我们沿曲线 $x = h(y)$ 计算标量线积分，$ds = \\sqrt{1 + h'(y)^2}\\,dy$。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x"],
  encompasses: [
    {
      topic: "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "line-integrals-along-explicit-curves-x-equals-h-of-y",
      title: t("Line integrals along explicit curves x = h(y)", "计算沿显式曲线 x = h(y) 的标量曲线积分"),
      explanation: t(
        "When the curve gives the horizontal coordinate as a function of the vertical one, use the vertical variable as the parameter instead. For $x = \\frac{a}{b}y$ with $0 \\le y \\le b$, $ds = \\frac{\\sqrt{a^2 + b^2}}{b}\\,dy = \\frac{c}{b}\\,dy$. Then $\\int_C ky\\,ds = \\frac{kcb}{2}$. Along $x = y$ from $y = 0$ to $y = 3$, $\\int_C 2y\\,ds = \\sqrt{2} \\cdot 9 = 9\\sqrt{2}$.\n\n> **Watch out.** The derivative is taken in $y$, and $ds$ needs the factor $\\sqrt{1 + h'(y)^2}$: integrating over $dy$ alone measures the shadow of the curve on the $y$-axis.",
        "当曲线把水平坐标表示为竖直坐标的函数时，改用竖直变量作为参数。对于 $0 \\le y \\le b$ 上的线段 $x = \\frac{a}{b}y$，$ds = \\frac{\\sqrt{a^2 + b^2}}{b}\\,dy = \\frac{c}{b}\\,dy$。则 $\\int_C ky\\,ds = \\frac{kcb}{2}$。沿 $x = y$ 从 $y = 0$ 到 $y = 3$，$\\int_C 2y\\,ds = \\sqrt{2} \\cdot 9 = 9\\sqrt{2}$。\n\n> **注意。** 导数对 $y$ 求，$ds$ 需要因子 $\\sqrt{1 + h'(y)^2}$：只对 $dy$ 积分，量的是曲线在 $y$ 轴上的投影。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const coeff = 2 * k;
        const ans = k * c * b;
        return numberProblem({
          prompt: t(
            `Evaluate the line integral $\\int_C ${coeff}y\\,ds$ along the curve $x = ${Q.of(a, b).toLatex()}y$ from $y = 0$ to $y = ${b}$.`,
            `计算第一类曲线积分 $\\int_C ${coeff}y\\,ds$，其中曲线 $C$ 为直线段 $x = ${Q.of(a, b).toLatex()}y$ 从 $y = 0$ 到 $y = ${b}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              k * b * b,
              `That uses $dy$ for $ds$; here $ds = \\frac{${c}}{${b}}\\,dy$.`,
              `那是把 $ds$ 当作 $dy$；这里 $ds = \\frac{${c}}{${b}}\\,dy$。`,
            ),
            why(
              k * a * b,
              `That uses the slope $\\frac{${a}}{${b}}$ as the length factor; it is $\\frac{${c}}{${b}}$.`,
              `那是把斜率 $\\frac{${a}}{${b}}$ 当作长度因子；它应是 $\\frac{${c}}{${b}}$。`,
            ),
            why(
              2 * ans,
              "That forgets the $\\frac{1}{2}$ in $\\int y\\,dy = \\frac{y^2}{2}$.",
              "那是漏了 $\\int y\\,dy = \\frac{y^2}{2}$ 中的 $\\frac{1}{2}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find $ds$", "求 $ds$"],
                t(
                  `$\\frac{dx}{dy} = \\frac{${a}}{${b}}$, so $ds = \\sqrt{1 + \\frac{${a * a}}{${b * b}}}\\,dy = \\frac{${c}}{${b}}\\,dy$.`,
                  `$\\frac{dx}{dy} = \\frac{${a}}{${b}}$，所以 $ds = \\sqrt{1 + \\frac{${a * a}}{${b * b}}}\\,dy = \\frac{${c}}{${b}}\\,dy$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{${coeff * c}}{${b}}\\int_0^{${b}} y\\,dy = \\frac{${coeff * c}}{${b}} \\cdot \\frac{${b * b}}{2} = ${ans}$.`,
                  `$\\frac{${coeff * c}}{${b}}\\int_0^{${b}} y\\,dy = \\frac{${coeff * c}}{${b}} \\cdot \\frac{${b * b}}{2} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The segment runs from $(0, 0)$ to $(${a}, ${b})$ and has length $${c}$; the average of $${coeff}y$ along it is its midpoint value $${k * b}$, and $${k * b} \\cdot ${c} = ${ans}$.`,
              `线段从 $(0, 0)$ 到 $(${a}, ${b})$，长度为 $${c}$；$${coeff}y$ 沿它的平均值是中点处的值 $${k * b}$，$${k * b} \\cdot ${c} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-y-squared-along-a-line-x-equals-my",
      figure:
        multivariableDrawings5[
          "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-y#integrating-y-squared-along-a-line-x-equals-my"
        ],
      title: t("Integrating $ky^2$ along a line $x = my$", "沿直线 $x = my$ 积分 $ky^2$"),
      explanation: t(
        "For a path $x = h(y)$, $c \\le y \\le d$, the arc length element is $ds = \\sqrt{1 + h'(y)^2}\\,dy$, and the integral is taken in $y$. On the line $x = \\frac{p}{q}y$ this is $\\frac{L}{q}\\,dy$ with $L = \\sqrt{p^2 + q^2}$, so\n\n$$\\int_C k\\,y^2\\,ds = \\frac{kL}{q}\\int_0^q y^2\\,dy = \\frac{k\\,q^2L}{3}.$$\n\nAlong $x = y$ from $y = 0$ to $y = 1$, $\\int_C y^2\\,ds = \\frac{\\sqrt{2}}{3}$.\n\n> **Watch out.** The factor $\\frac{L}{q}$ divides by $q$, the length of the $y$-range: $\\int_0^q y^2\\,dy = \\frac{q^3}{3}$ loses one power of $q$ to it.",
        "对路径 $x = h(y)$，$c \\le y \\le d$，弧长元素为 $ds = \\sqrt{1 + h'(y)^2}\\,dy$，积分对 $y$ 进行。在直线 $x = \\frac{p}{q}y$ 上它是 $\\frac{L}{q}\\,dy$，$L = \\sqrt{p^2 + q^2}$，所以\n\n$$\\int_C k\\,y^2\\,ds = \\frac{kL}{q}\\int_0^q y^2\\,dy = \\frac{k\\,q^2L}{3}$$\n\n沿 $x = y$ 从 $y = 0$ 到 $y = 1$，$\\int_C y^2\\,ds = \\frac{\\sqrt{2}}{3}$。\n\n> **注意。** 因子 $\\frac{L}{q}$ 要除以 $q$，即 $y$ 的范围长度：$\\int_0^q y^2\\,dy = \\frac{q^3}{3}$ 因此约去一个 $q$。",
      ),
      generate(rng: Rng): Problem {
        const [m, n, L] = rng.pick(pythagoreanTriples.slice(0, 5));
        const [p, q] = rng.int(0, 1) === 0 ? [m, n] : [n, m];
        const k = rng.int(1, 3);
        const ans = Q.of(k * q * q * L, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C ${coef(k)}y^2\\,ds$ along $x = \\frac{${p}}{${q}}y$ from $y = 0$ to $y = ${q}$.`,
            `沿 $x = \\frac{${p}}{${q}}y$ 从 $y = 0$ 到 $y = ${q}$ 计算 $\\int_C ${coef(k)}y^2\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(k * q ** 3, 3),
              `That uses $dy$ for $ds$; here $ds = \\frac{${L}}{${q}}\\,dy$.`,
              `那是把 $ds$ 当作 $dy$；这里 $ds = \\frac{${L}}{${q}}\\,dy$。`,
            ),
            why(
              Q.of(k * q * q * p, 3),
              `That uses the slope $\\frac{${p}}{${q}}$ as the length factor; it is $\\frac{${L}}{${q}}$.`,
              `那是把斜率 $\\frac{${p}}{${q}}$ 当作长度因子；它应是 $\\frac{${L}}{${q}}$。`,
            ),
            why(
              Q.of(k * q * q * L, 2),
              "$\\int y^2\\,dy = \\frac{y^3}{3}$, not $\\frac{y^3}{2}$.",
              "$\\int y^2\\,dy = \\frac{y^3}{3}$，不是 $\\frac{y^3}{2}$。",
            ),
            why(
              Q.of(k * q ** 3 * L, 3),
              `That multiplies by $${L}$ without dividing by $${q}$; the factor is $\\frac{${L}}{${q}}$.`,
              `那是乘了 $${L}$ 却没除以 $${q}$；因子是 $\\frac{${L}}{${q}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find $ds$", "求 $ds$"],
                t(
                  `$ds = \\sqrt{1 + \\frac{${p * p}}{${q * q}}}\\,dy = \\frac{${L}}{${q}}\\,dy$.`,
                  `$ds = \\sqrt{1 + \\frac{${p * p}}{${q * q}}}\\,dy = \\frac{${L}}{${q}}\\,dy$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{${k * L}}{${q}}\\int_0^{${q}} y^2\\,dy = \\frac{${k * L}}{${q}} \\cdot \\frac{${q ** 3}}{3} = ${ans.toLatex()}$.`,
                  `$\\frac{${k * L}}{${q}}\\int_0^{${q}} y^2\\,dy = \\frac{${k * L}}{${q}} \\cdot \\frac{${q ** 3}}{3} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `With $\\mathbf{r}(t) = (${p}t, ${q}t)$ instead, $ds = ${L}\\,dt$ and $\\int_0^1 ${k * q * q}t^2 \\cdot ${L}\\,dt = ${ans.toLatex()}$, the same value.`,
              `改用 $\\mathbf{r}(t) = (${p}t, ${q}t)$，$ds = ${L}\\,dt$，$\\int_0^1 ${k * q * q}t^2 \\cdot ${L}\\,dt = ${ans.toLatex()}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.19 Line Integrals of Scalar Functions Over Parametric Curves
// ---------------------------------------------------------------------------

/** lineIntegralsOfScalarFunctionsOverLineSegments integrates scalar functions over 3D line segments. */
export const lineIntegralsOfScalarFunctionsOverLineSegments: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-line-segments",
  title: t("Line Integrals of Scalar Functions Over Line Segments", "线段上的标量曲线积分"),
  summary: t(
    "Line segments parameterized by r(t) = P0 + t(P1 - P0) for t in [0, 1] have constant speed ||r'(t)|| = |P1 - P0|.",
    "由 r(t) = P0 + t(P1 - P0)（t in [0, 1]）参数化的线段具有恒定切向速度 ||r'(t)|| = |P1 - P0|。",
  ),
  intro: t(
    "Find $\\int_C (x + z)\\,ds$ along the segment from $(1, 0, 2)$ to $(3, 2, 3)$. The direction is $(2, 2, 1)$, so $\\mathbf{r}(t) = (1 + 2t, 2t, 2 + t)$, $0 \\le t \\le 1$, with $ds = \\sqrt{4 + 4 + 1}\\,dt = 3\\,dt$. On the segment $x + z = 3 + 3t$, and $\\int_0^1 (3 + 3t) \\cdot 3\\,dt = 3\\left(3 + \\frac{3}{2}\\right) = \\frac{27}{2}$.\n\nCheck: $x + z$ is linear, so its average along the segment is its value at the midpoint $\\left(2, 1, \\frac{5}{2}\\right)$, which is $\\frac{9}{2}$, and $\\frac{9}{2} \\cdot 3 = \\frac{27}{2}$.\n\nIn this lesson we integrate along segments, parametrized by $\\mathbf{r}(t) = P + t(Q - P)$ with $ds = |Q - P|\\,dt$.",
    "沿从 $(1, 0, 2)$ 到 $(3, 2, 3)$ 的线段求 $\\int_C (x + z)\\,ds$。方向为 $(2, 2, 1)$，所以 $\\mathbf{r}(t) = (1 + 2t, 2t, 2 + t)$，$0 \\le t \\le 1$，$ds = \\sqrt{4 + 4 + 1}\\,dt = 3\\,dt$。在线段上 $x + z = 3 + 3t$，$\\int_0^1 (3 + 3t) \\cdot 3\\,dt = 3\\left(3 + \\frac{3}{2}\\right) = \\frac{27}{2}$。\n\n检验：$x + z$ 是线性的，所以沿线段的平均值是中点 $\\left(2, 1, \\frac{5}{2}\\right)$ 处的值 $\\frac{9}{2}$，$\\frac{9}{2} \\cdot 3 = \\frac{27}{2}$。\n\n本课我们沿线段积分，参数化为 $\\mathbf{r}(t) = P + t(Q - P)$，$ds = |Q - P|\\,dt$。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions"],
  encompasses: [{ topic: "line-integrals-of-scalar-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-linear-functions-over-line-segments",
      title: t("Integrating linear functions over line segments", "在线段上积分线性标量函数"),
      explanation: t(
        "Parametrize the segment from one endpoint to the other; the speed is then the constant length of the segment, which comes out of the integral. For a line segment connecting $(0, 0)$ to $(x_1, y_1)$ with length $L = \\sqrt{x_1^2 + y_1^2}$, $\\int_C k\\,ds = kL$. From $(0, 0)$ to $(1, 1)$, $\\int_C 9\\,ds = 9\\sqrt{2}$.\n\n> **Watch out.** The length is $\\sqrt{x_1^2 + y_1^2}$, not $x_1 + y_1$ and not $x_1^2 + y_1^2$: the segment is the hypotenuse of a right triangle.",
        "从一个端点到另一个端点参数化线段，速率就是线段的固定长度，可以提到积分号外面。对于连接 $(0, 0)$ 到 $(x_1, y_1)$、长度为 $L = \\sqrt{x_1^2 + y_1^2}$ 的线段，$\\int_C k\\,ds = kL$。从 $(0, 0)$ 到 $(1, 1)$，$\\int_C 9\\,ds = 9\\sqrt{2}$。\n\n> **注意。** 长度是 $\\sqrt{x_1^2 + y_1^2}$，不是 $x_1 + y_1$，也不是 $x_1^2 + y_1^2$：线段是直角三角形的斜边。",
      ),
      generate(rng: Rng): Problem {
        const [x0, y0, L0] = rng.pick(pythagoreanTriples);
        const k = rng.int(1, 4);
        const x1 = x0 * k;
        const y1 = y0 * k;
        const L = L0 * k;
        const c = rng.int(2, 8);
        const ans = c * L;
        return numberProblem({
          prompt: t(
            `Find the value of the line integral $\\int_C ${c}\\,ds$ along the straight line segment $C$ from $(0, 0)$ to $(${x1}, ${y1})$.`,
            `求第一类曲线积分 $\\int_C ${c}\\,ds$ 的值，其中 $C$ 为从 $(0, 0)$ 到 $(${x1}, ${y1})$ 的直线段。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c * (x1 + y1),
              `That adds the legs $${x1} + ${y1}$; the length is $\\sqrt{${x1}^2 + ${y1}^2} = ${L}$.`,
              `那是把两条直角边相加 $${x1} + ${y1}$；长度是 $\\sqrt{${x1}^2 + ${y1}^2} = ${L}$。`,
            ),
            why(
              c * L * L,
              `That uses $${x1}^2 + ${y1}^2 = ${L * L}$ without the square root.`,
              `那是用了 $${x1}^2 + ${y1}^2 = ${L * L}$，没开平方。`,
            ),
            why(L, `That is the length alone; the constant $${c}$ multiplies it.`, `那只是长度；还要乘以常数 $${c}$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the length", "求长度"],
                t(
                  `$L = \\sqrt{${x1}^2 + ${y1}^2} = \\sqrt{${x1 * x1 + y1 * y1}} = ${L}$.`,
                  `$L = \\sqrt{${x1}^2 + ${y1}^2} = \\sqrt{${x1 * x1 + y1 * y1}} = ${L}$。`,
                ),
              ],
              [
                ["Integrate the constant", "积分常数"],
                t(
                  `With $\\mathbf{r}(t) = (${x1}t, ${y1}t)$, $ds = ${L}\\,dt$, so $\\int_0^1 ${c} \\cdot ${L}\\,dt = ${ans}$.`,
                  `取 $\\mathbf{r}(t) = (${x1}t, ${y1}t)$，$ds = ${L}\\,dt$，所以 $\\int_0^1 ${c} \\cdot ${L}\\,dt = ${ans}$。`,
                ),
              ],
            ],
            t(
              `$${L}^2 = ${L * L} = ${x1 * x1} + ${y1 * y1}$, so the length is right, and a constant integrates to itself times the length: $${c} \\cdot ${L} = ${ans}$.`,
              `$${L}^2 = ${L * L} = ${x1 * x1} + ${y1 * y1}$，长度正确，而常数的积分等于它乘以长度：$${c} \\cdot ${L} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-linear-function-along-a-segment-by-its-average-value",
      title: t("A linear function along a segment by its average", "用平均值求线段上一次函数的积分"),
      explanation: t(
        "A linear function $f(x, y) = x + y$ changes at a constant rate along a straight segment, so its average value on the segment is its value at the midpoint. Hence\n\n$$\\int_C (x + y)\\,ds = f(\\text{midpoint}) \\cdot L,$$\n\nwhere $L$ is the length of the segment. This agrees with parametrizing $\\mathbf{r}(t) = P + t(Q - P)$ and integrating directly. From $(1, 1)$ to $(2, 3)$ the midpoint value is $\\frac{7}{2}$ and $L = \\sqrt{5}$, so the integral is $\\frac{7\\sqrt{5}}{2}$.\n\n> **Watch out.** Use the value at the midpoint, not at either end, and multiply it by the length $\\sqrt{\\Delta x^2 + \\Delta y^2}$.",
        "一次函数 $f(x, y) = x + y$ 沿直线段以恒定速率变化，所以它在线段上的平均值就是中点处的值。因此\n\n$$\\int_C (x + y)\\,ds = f(\\text{中点}) \\cdot L,$$\n\n其中 $L$ 是线段长度。这与参数化 $\\mathbf{r}(t) = P + t(Q - P)$ 后直接积分的结果一致。从 $(1, 1)$ 到 $(2, 3)$，中点处的值为 $\\frac{7}{2}$，$L = \\sqrt{5}$，所以积分为 $\\frac{7\\sqrt{5}}{2}$。\n\n> **注意。** 要用中点处的值，不是任一端点的值，再乘以长度 $\\sqrt{\\Delta x^2 + \\Delta y^2}$。",
      ),
      generate(rng: Rng): Problem {
        const [m, n, L] = rng.pick(pythagoreanTriples.slice(0, 5));
        const [dx, dy] = rng.int(0, 1) === 0 ? [m, n] : [n, m];
        const sx = rng.pick([-1, 1]);
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const x1 = x0 + sx * dx;
        const y1 = y0 + dy;
        const mid = Q.of(x0 + x1 + y0 + y1, 2);
        const ans = mid.mul(Q.of(L));
        const rate = sx * dx + dy;
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C (x + y)\\,ds$ along the segment $C$ from $(${x0}, ${y0})$ to $(${x1}, ${y1})$.`,
            `沿从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的线段 $C$ 计算 $\\int_C (x + y)\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(mid, `That is the average value; it has to be multiplied by the length $${L}$.`, `那是平均值；还要乘以长度 $${L}$。`),
            why(
              Q.of((x1 + y1) * L),
              "That uses the value at the end of the segment; the average is at the midpoint.",
              "那是用了终点处的值；平均值在中点处。",
            ),
            why(
              Q.of((x0 + y0) * L),
              "That uses the value at the start of the segment; the average is at the midpoint.",
              "那是用了起点处的值；平均值在中点处。",
            ),
            why(
              mid.mul(Q.of(dx + dy)),
              `That takes the length to be $${dx} + ${dy}$; it is $\\sqrt{${dx}^2 + ${dy}^2} = ${L}$.`,
              `那是把长度当作 $${dx} + ${dy}$；它是 $\\sqrt{${dx}^2 + ${dy}^2} = ${L}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the length", "求长度"],
                t(`$L = \\sqrt{${dx * dx} + ${dy * dy}} = ${L}$.`, `$L = \\sqrt{${dx * dx} + ${dy * dy}} = ${L}$。`),
              ],
              [
                ["Find the average", "求平均值"],
                t(
                  `$x + y$ is $${x0 + y0}$ at the start and $${x1 + y1}$ at the end, so at the midpoint it is $${mid.toLatex()}$.`,
                  `$x + y$ 在起点为 $${x0 + y0}$，在终点为 $${x1 + y1}$，所以在中点为 $${mid.toLatex()}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(`$${mid.toLatex()} \\cdot ${L} = ${ans.toLatex()}$.`, `$${mid.toLatex()} \\cdot ${L} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `Directly, $x + y = ${poly([x0 + y0, ""], [rate, "t"]) || "0"}$ on $\\mathbf{r}(t) = (${poly([x0, ""], [sx * dx, "t"])}, ${poly([y0, ""], [dy, "t"])})$, and $\\int_0^1 (${poly([x0 + y0, ""], [rate, "t"]) || "0"}) \\cdot ${L}\\,dt = ${L}\\left(${x0 + y0} + ${paren(Q.of(rate, 2))}\\right) = ${ans.toLatex()}$.`,
              `直接计算：在 $\\mathbf{r}(t) = (${poly([x0, ""], [sx * dx, "t"])}, ${poly([y0, ""], [dy, "t"])})$ 上 $x + y = ${poly([x0 + y0, ""], [rate, "t"]) || "0"}$，$\\int_0^1 (${poly([x0 + y0, ""], [rate, "t"]) || "0"}) \\cdot ${L}\\,dt = ${L}\\left(${x0 + y0} + ${paren(Q.of(rate, 2))}\\right) = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

const wireView = { xMin: -5, xMax: 5, yMin: -5, yMax: 5, labelEvery: 1 } as const;
const onWire = (d: number, r = 3): readonly [number, number] => [r * Math.cos((d * Math.PI) / 180), r * Math.sin((d * Math.PI) / 180)];

/** circularWireFigure shows a wire along the circle of radius R and one short piece of it, of length ds. */
const circularWireFigure: Figure = {
  svg: plane(wireView, [
    { kind: "circle", center: [0, 0], r: 3 },
    { kind: "segment", a: [0, 0], b: onWire(40) },
    { kind: "segment", a: [0, 0], b: onWire(60), dashed: true },
    { kind: "curve", f: (x) => Math.sqrt(9 - x * x), from: onWire(60)[0], to: onWire(40)[0], accent: true },
    { kind: "point", at: onWire(40) },
    { kind: "point", at: onWire(60) },
    { kind: "label", at: [1.15, 0.95], text: "R", dir: "se" },
    { kind: "label", at: onWire(50, 3.1), text: "ds", dir: "ne" },
  ] satisfies PlaneMark[]),
  alt: t(
    "A circular wire of radius R centered at the origin, with one short piece of arc of length ds marked between two radii; adding ρ₀ ds around the circle gives ρ₀ times the circumference 2πR.",
    "以原点为圆心、半径为 R 的圆形细丝，两条半径之间标出一小段长为 ds 的弧；沿圆周累加 ρ₀ ds，得到 ρ₀ 乘以周长 2πR。",
  ),
};
/** lineIntegralsOfScalarFunctionsOverCircles integrates scalar functions over circular paths. */
export const lineIntegralsOfScalarFunctionsOverCircles: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-circles",
  title: t("Line Integrals of Scalar Functions Over Circles", "圆周上的标量曲线积分"),
  summary: t(
    "On a circle of radius R, ds = R dθ, reducing scalar line integrals to standard single integrals from 0 to 2π.",
    "在半径为 R 的圆周上，弧长微元 ds = R dθ，将标量曲线积分化为 0 到 2π 的一元定积分。",
  ),
  intro: t(
    "Find $\\oint_C y^2\\,ds$ around the circle $x^2 + y^2 = 4$. With $\\mathbf{r}(t) = (2\\cos t, 2\\sin t)$, $ds = 2\\,dt$ and $y^2 = 4\\sin^2 t$, so the integral is $\\int_0^{2\\pi} 4\\sin^2 t \\cdot 2\\,dt = 8 \\cdot \\pi = 8\\pi$.\n\nCheck: by symmetry $\\oint_C x^2\\,ds = \\oint_C y^2\\,ds$, and their sum is $\\oint_C 4\\,ds = 4 \\cdot 4\\pi = 16\\pi$, so each is $8\\pi$.\n\nIn this lesson we evaluate scalar line integrals over circles, with $\\mathbf{r}(t) = (R\\cos t, R\\sin t)$ and $ds = R\\,dt$.",
    "沿圆 $x^2 + y^2 = 4$ 求 $\\oint_C y^2\\,ds$。取 $\\mathbf{r}(t) = (2\\cos t, 2\\sin t)$，$ds = 2\\,dt$，$y^2 = 4\\sin^2 t$，所以积分为 $\\int_0^{2\\pi} 4\\sin^2 t \\cdot 2\\,dt = 8 \\cdot \\pi = 8\\pi$。\n\n检验：由对称性 $\\oint_C x^2\\,ds = \\oint_C y^2\\,ds$，两者之和是 $\\oint_C 4\\,ds = 4 \\cdot 4\\pi = 16\\pi$，所以各为 $8\\pi$。\n\n本课我们在圆上计算标量线积分，$\\mathbf{r}(t) = (R\\cos t, R\\sin t)$，$ds = R\\,dt$。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-line-segments"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-constant-density-over-circular-wire",
      title: t("Integrating constant density over circular wire", "在圆形细丝上计算恒定线密度的质量积分"),
      explanation: t(
        "For a full circle $C$ of radius $R$ centered at the origin, the line integral of a constant density $\\rho_0$ divided by $\\pi$ is:\n\n$$\\frac{1}{\\pi}\\int_C \\rho_0\\,ds = \\frac{\\rho_0}{\\pi}(2\\pi R) = 2\\rho_0 R.$$\n\nA wire of density $10$ on the unit circle gives $\\frac{1}{\\pi}\\int_C 10\\,ds = 20$.\n\n> **Watch out.** A line integral measures length, so the circle contributes its circumference $2\\pi R$, not its area $\\pi R^2$.",
        "对于以原点为中心、半径为 $R$ 的完整圆周 $C$，恒定密度 $\\rho_0$ 的曲线积分除以 $\\pi$ 为：\n\n$$\\frac{1}{\\pi}\\int_C \\rho_0\\,ds = \\frac{\\rho_0}{\\pi}(2\\pi R) = 2\\rho_0 R$$\n\n单位圆上密度为 $10$ 的导线给出 $\\frac{1}{\\pi}\\int_C 10\\,ds = 20$。\n\n> **注意。** 线积分度量的是长度，所以圆贡献的是周长 $2\\pi R$，不是面积 $\\pi R^2$。",
      ),
      figure: circularWireFigure,
      generate(rng: Rng): Problem {
        const R = rng.int(2, 12);
        const rho = rng.int(1, 8);
        const ans = 2 * rho * R;
        return numberProblem({
          prompt: t(
            `Find the value of $\\frac{1}{\\pi} \\int_C ${rho}\\,ds$, where $C$ is the circle $x^2 + y^2 = ${R * R}$ traversed once.`,
            `计算 $\\frac{1}{\\pi} \\int_C ${rho}\\,ds$ 的值，其中 $C$ 为圆周 $x^2 + y^2 = ${R * R}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              rho * R * R,
              `That uses the area $\\pi R^2$; the integral needs the circumference $2\\pi \\cdot ${R}$.`,
              `那是用了面积 $\\pi R^2$；积分需要的是周长 $2\\pi \\cdot ${R}$。`,
            ),
            why(rho * R, "That uses $\\pi R$ for the circumference; it is $2\\pi R$.", "那是把周长当作 $\\pi R$；它是 $2\\pi R$。"),
            why(
              2 * rho * R * R,
              `That takes the radius to be $${R * R}$; the circle $x^2 + y^2 = ${R * R}$ has radius $${R}$.`,
              `那是把半径当作 $${R * R}$；圆 $x^2 + y^2 = ${R * R}$ 的半径是 $${R}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the length", "求周长"],
                t(
                  `The circle has radius $${R}$, so its length is $2\\pi \\cdot ${R} = ${2 * R}\\pi$.`,
                  `圆的半径为 $${R}$，周长为 $2\\pi \\cdot ${R} = ${2 * R}\\pi$。`,
                ),
              ],
              [
                ["Integrate the constant", "积分常数"],
                t(
                  `$\\int_C ${rho}\\,ds = ${rho} \\cdot ${2 * R}\\pi = ${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                  `$\\int_C ${rho}\\,ds = ${rho} \\cdot ${2 * R}\\pi = ${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
                ),
              ],
            ],
            t(
              `With $\\mathbf{r}(t) = (${R}\\cos t, ${R}\\sin t)$, $ds = ${R}\\,dt$ and $\\int_0^{2\\pi} ${rho} \\cdot ${R}\\,dt = ${ans}\\pi$, the same.`,
              `取 $\\mathbf{r}(t) = (${R}\\cos t, ${R}\\sin t)$，$ds = ${R}\\,dt$，$\\int_0^{2\\pi} ${rho} \\cdot ${R}\\,dt = ${ans}\\pi$，结果相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-a-quadratic-density-around-a-circle",
      figure: multivariableDrawings5["line-integrals-of-scalar-functions-over-circles#integrating-a-quadratic-density-around-a-circle"],
      title: t("Integrating $a + bx^2$ around a circle", "绕圆积分 $a + bx^2$"),
      explanation: t(
        "On a circle the arc length element is especially simple, because the speed of the standard parametrization is constant and equal to the radius. Parametrize the circle of radius $R$ by $(R\\cos t, R\\sin t)$, so $ds = R\\,dt$. A constant $a$ gives $a \\cdot 2\\pi R$. For $x^2$ use $\\int_0^{2\\pi} \\cos^2 t\\,dt = \\pi$:\n\n$$\\int_C x^2\\,ds = \\int_0^{2\\pi} R^2\\cos^2 t \\cdot R\\,dt = \\pi R^3.$$\n\nSo $\\int_C (a + bx^2)\\,ds = \\pi(2aR + bR^3)$. On $x^2 + y^2 = 25$, $\\oint_C x^2\\,ds = 125\\pi$.\n\n> **Watch out.** $x^2$ is not $R^2$ on the circle; it averages $\\frac{R^2}{2}$, because $\\cos^2 t$ averages $\\frac{1}{2}$. And $ds = R\\,dt$ brings a factor $R$ to every term.",
        "在圆上弧长元素特别简单，因为标准参数化的速率是常数，等于半径。把半径为 $R$ 的圆参数化为 $(R\\cos t, R\\sin t)$，则 $ds = R\\,dt$。常数 $a$ 贡献 $a \\cdot 2\\pi R$。对 $x^2$，利用 $\\int_0^{2\\pi} \\cos^2 t\\,dt = \\pi$：\n\n$$\\int_C x^2\\,ds = \\int_0^{2\\pi} R^2\\cos^2 t \\cdot R\\,dt = \\pi R^3$$\n\n所以 $\\int_C (a + bx^2)\\,ds = \\pi(2aR + bR^3)$。在 $x^2 + y^2 = 25$ 上，$\\oint_C x^2\\,ds = 125\\pi$。\n\n> **注意。** 在圆上 $x^2$ 不等于 $R^2$；它的平均值是 $\\frac{R^2}{2}$，因为 $\\cos^2 t$ 的平均值是 $\\frac{1}{2}$。$ds = R\\,dt$ 给每一项都带来因子 $R$。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 4);
        const a = rng.int(1, 5);
        const b = rng.int(1, 4);
        const ans = 2 * a * R + b * R ** 3;
        return numberProblem({
          prompt: t(
            `$C$ is the circle $x^2 + y^2 = ${R * R}$. Find $\\frac{1}{\\pi}\\int_C (${poly([a, ""], [b, "x^2"])})\\,ds$.`,
            `$C$ 是圆 $x^2 + y^2 = ${R * R}$。求 $\\frac{1}{\\pi}\\int_C (${poly([a, ""], [b, "x^2"])})\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * a * R + 2 * b * R ** 3,
              "That takes $\\int_0^{2\\pi} \\cos^2 t\\,dt$ to be $2\\pi$; it is $\\pi$.",
              "那是把 $\\int_0^{2\\pi} \\cos^2 t\\,dt$ 当作 $2\\pi$；它是 $\\pi$。",
            ),
            why(
              2 * (a + b * R * R) * R,
              `That replaces $x^2$ by $R^2 = ${R * R}$ everywhere; on the circle $x^2 = ${R * R}\\cos^2 t$.`,
              `那是处处把 $x^2$ 换成 $R^2 = ${R * R}$；在圆上 $x^2 = ${R * R}\\cos^2 t$。`,
            ),
            why(
              2 * a * R + b * R * R,
              "That leaves the factor $R$ of $ds$ out of the $x^2$ term.",
              "那是在 $x^2$ 项中漏了 $ds$ 的因子 $R$。",
            ),
            why(
              a * R + b * R ** 3,
              "That uses $\\pi R$ for the length of the circle; it is $2\\pi R$.",
              "那是把圆的周长当作 $\\pi R$；它是 $2\\pi R$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(
                  `$\\mathbf{r}(t) = (${R}\\cos t, ${R}\\sin t)$, so $ds = ${R}\\,dt$ and $x^2 = ${R * R}\\cos^2 t$.`,
                  `$\\mathbf{r}(t) = (${R}\\cos t, ${R}\\sin t)$，所以 $ds = ${R}\\,dt$，$x^2 = ${R * R}\\cos^2 t$。`,
                ),
              ],
              [
                ["Integrate each term", "逐项积分"],
                t(
                  `$\\int_C ${a}\\,ds = ${a} \\cdot 2\\pi \\cdot ${R} = ${2 * a * R}\\pi$ and $\\int_C ${coef(b)}x^2\\,ds = ${b * R ** 3}\\int_0^{2\\pi} \\cos^2 t\\,dt = ${b * R ** 3}\\pi$.`,
                  `$\\int_C ${a}\\,ds = ${a} \\cdot 2\\pi \\cdot ${R} = ${2 * a * R}\\pi$，$\\int_C ${coef(b)}x^2\\,ds = ${b * R ** 3}\\int_0^{2\\pi} \\cos^2 t\\,dt = ${b * R ** 3}\\pi$。`,
                ),
              ],
              [
                ["Add", "相加"],
                t(
                  `Dividing by $\\pi$ gives $${2 * a * R} + ${b * R ** 3} = ${ans}$.`,
                  `除以 $\\pi$ 得 $${2 * a * R} + ${b * R ** 3} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `By symmetry $\\oint_C x^2\\,ds = \\oint_C y^2\\,ds$, and their sum is $\\oint_C ${R * R}\\,ds = ${2 * R ** 3}\\pi$, so $\\oint_C x^2\\,ds = ${R ** 3}\\pi$, as used.`,
              `由对称性 $\\oint_C x^2\\,ds = \\oint_C y^2\\,ds$，两者之和为 $\\oint_C ${R * R}\\,ds = ${2 * R ** 3}\\pi$，所以 $\\oint_C x^2\\,ds = ${R ** 3}\\pi$，与所用一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** ellipseSymmetryFigure pairs points (x, y) and (−x, y) of an ellipse, where cx takes opposite values. */
const ellipseSymmetryFigure: Figure = {
  svg: plane(wireView, [
    { kind: "curve", f: (x) => 2.5 * Math.sqrt(Math.max(0, 1 - (x * x) / 16)), from: -4, to: 4 },
    { kind: "curve", f: (x) => -2.5 * Math.sqrt(Math.max(0, 1 - (x * x) / 16)), from: -4, to: 4 },
    { kind: "segment", a: [-2.4, 2], b: [2.4, 2], dashed: true },
    { kind: "segment", a: [-3.2, -1.5], b: [3.2, -1.5], dashed: true },
    { kind: "point", at: [2.4, 2], label: "cx", dir: "ne" },
    { kind: "point", at: [-2.4, 2], label: "−cx", dir: "nw" },
    { kind: "point", at: [3.2, -1.5], label: "cx", dir: "se" },
    { kind: "point", at: [-3.2, -1.5], label: "−cx", dir: "sw" },
  ]),
  alt: t(
    "An ellipse symmetric about the y-axis, with points paired across it; at each pair cx takes opposite values, so the cx parts of the integral cancel.",
    "关于 y 轴对称的椭圆，其上的点关于 y 轴两两配对；每一对点处 cx 的值互为相反数，所以积分中 cx 的部分相互抵消。",
  ),
};
/** lineIntegralsOfScalarFunctionsOverEllipses uses symmetry over elliptical paths. */
export const lineIntegralsOfScalarFunctionsOverEllipses: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-ellipses",
  title: t("Line Integrals of Scalar Functions Over Ellipses", "椭圆上的标量曲线积分与对称性"),
  summary: t(
    "Odd integrand components cancel over symmetric elliptical paths, simplifying line integrals to symmetric quarters.",
    "奇函数被积项在对称椭圆路径上的积分为零，利用对称性可极大简化积分计算。",
  ),
  intro: t(
    "Find $\\oint_C (x + y^3)\\,ds$ around the ellipse $\\frac{x^2}{9} + \\frac{y^2}{4} = 1$. The arc length of an ellipse has no elementary formula, but none is needed: the ellipse is unchanged by $(x, y) \\mapsto (-x, -y)$, this reflection keeps lengths, and it changes the sign of $x + y^3$. So the contributions of opposite points cancel, and the integral is $0$.\n\nCheck: with $x = 3\\cos t$, $y = 2\\sin t$, the points at $t$ and $t + \\pi$ are opposite, the speed $\\sqrt{9\\sin^2 t + 4\\cos^2 t}$ is the same at both, and the integrand changes sign.\n\nIn this lesson we use the symmetry of an ellipse to evaluate line integrals over it, and a substitution where symmetry is not enough.",
    "沿椭圆 $\\frac{x^2}{9} + \\frac{y^2}{4} = 1$ 求 $\\oint_C (x + y^3)\\,ds$。椭圆弧长没有初等公式，但这里不需要：椭圆在 $(x, y) \\mapsto (-x, -y)$ 下不变，这个变换保持长度，却改变 $x + y^3$ 的符号。所以相对的点的贡献相互抵消，积分为 $0$。\n\n检验：取 $x = 3\\cos t$，$y = 2\\sin t$，$t$ 与 $t + \\pi$ 处的点相对，两处的速率 $\\sqrt{9\\sin^2 t + 4\\cos^2 t}$ 相同，被积函数变号。\n\n本课我们利用椭圆的对称性计算其上的线积分，对称性不够时用换元。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-circles"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-over-symmetric-quadrants-of-ellipses",
      title: t("Integrating over symmetric quadrants of ellipses", "利用椭圆对称性计算曲线积分"),
      explanation: t(
        "When both the curve and the function are symmetric, the integral over the whole curve is a multiple of the integral over one quarter. By symmetry across the coordinate axes, for the ellipse $C: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$:\n\n$$\\oint_C (cx + k)\\,ds = \\oint_C cx\\,ds + k\\oint_C 1\\,ds = 0 + k\\,\\text{Length}(C).$$\n\nFor instance $\\oint_C 7x^5\\,ds = 0$ on $\\frac{x^2}{9} + y^2 = 1$.\n\n> **Watch out.** A term odd in $x$ cancels because the mirror points $(x, y)$ and $(-x, y)$ both lie on the ellipse, with the same $ds$. A term that is never negative, like $x^2$, does not cancel.",
        "当曲线和函数都对称时，整条曲线上的积分是四分之一曲线上积分的倍数。由关于坐标轴的对称性，对于椭圆 $C: \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$：\n\n$$\\oint_C (cx + k)\\,ds = \\oint_C cx\\,ds + k\\oint_C 1\\,ds = 0 + k\\,\\text{Length}(C)$$\n\n例如在 $\\frac{x^2}{9} + y^2 = 1$ 上 $\\oint_C 7x^5\\,ds = 0$。\n\n> **注意。** 关于 $x$ 的奇函数项相消，是因为镜像点 $(x, y)$ 与 $(-x, y)$ 都在椭圆上且 $ds$ 相同。像 $x^2$ 这样从不为负的项不会相消。",
      ),
      figure: ellipseSymmetryFigure,
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const c = rng.nonZero(-6, 6);
        const f = poly([c, "x^3"]);
        return numberProblem({
          prompt: t(
            `Evaluate the line integral $\\oint_C (${f})\\,ds$ around the complete ellipse $C: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$.`,
            `计算沿完整椭圆 $C: \\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$ 的曲线积分 $\\oint_C (${f})\\,ds$。`,
          ),
          answer: 0,
          mistakes: distinct(0, [
            why(
              c * a * b,
              `That treats the integral like $${c}$ times an area $ab$; but $${f}$ takes opposite values at $(x, y)$ and $(-x, y)$.`,
              `那是把积分当作 $${c}$ 乘以面积 $ab$；但 $${f}$ 在 $(x, y)$ 与 $(-x, y)$ 处取相反的值。`,
            ),
            why(
              c * a ** 3,
              `That uses the value of $${f}$ at $x = ${a}$ only; the negative values on the left half cancel the positive ones on the right.`,
              `那是只用了 $${f}$ 在 $x = ${a}$ 处的值；左半边的负值与右半边的正值相互抵消。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the symmetry of the curve", "利用曲线的对称性"],
                t(
                  "The ellipse is symmetric about the $y$-axis: $(x, y)$ is on it exactly when $(-x, y)$ is, and the mirror image of a small arc has the same length $ds$.",
                  "椭圆关于 $y$ 轴对称：$(x, y)$ 在椭圆上当且仅当 $(-x, y)$ 在其上，小段弧的镜像长度 $ds$ 相同。",
                ),
              ],
              [
                ["Use the oddness of the integrand", "利用被积函数的奇性"],
                t(
                  `$f(x, y) = ${f}$ satisfies $f(-x, y) = -f(x, y)$, so mirror pieces cancel and $\\oint_C ${f}\\,ds = 0$.`,
                  `$f(x, y) = ${f}$ 满足 $f(-x, y) = -f(x, y)$，所以镜像小段相消，$\\oint_C ${f}\\,ds = 0$。`,
                ),
              ],
            ],
            t(
              `With $x = ${a}\\cos t$, $y = ${b}\\sin t$, the points at $t$ and $\\pi - t$ are mirror images: $\\cos^3 t$ changes sign, while the speed $\\sqrt{${a * a}\\sin^2 t + ${b * b}\\cos^2 t}$ is the same.`,
              `取 $x = ${a}\\cos t$，$y = ${b}\\sin t$，$t$ 与 $\\pi - t$ 处的点互为镜像：$\\cos^3 t$ 变号，而速率 $\\sqrt{${a * a}\\sin^2 t + ${b * b}\\cos^2 t}$ 相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "spotting-a-zero-line-integral-on-an-ellipse-by-symmetry",
      figure:
        multivariableDrawings5["line-integrals-of-scalar-functions-over-ellipses#spotting-a-zero-line-integral-on-an-ellipse-by-symmetry"],
      title: t("Spotting a zero integral on an ellipse by symmetry", "利用对称性识别椭圆上为零的积分"),
      explanation: t(
        "The arc length of an ellipse has no elementary formula, but symmetry can still decide some integrals. The ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ is symmetric under $x \\mapsto -x$ and under $y \\mapsto -y$, and $ds$ is unchanged by these reflections. So $\\oint_C f\\,ds = 0$ whenever $f$ is odd in $x$ or odd in $y$, such as $x$, $xy^2$ or $y^3$, and also for a sum of such terms, like $x^5 + y^5$. Functions like $x^2$ or $x^2 + y^4$ are positive and give a positive integral.\n\n> **Watch out.** Each term must be odd in $x$ or in $y$. A term even in both, like $x^2y^2$, is never negative, so it does not cancel.",
        "椭圆弧长没有初等公式，但对称性仍能确定某些积分。椭圆 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ 关于 $x \\mapsto -x$ 和 $y \\mapsto -y$ 对称，且这些反射不改变 $ds$。所以只要 $f$ 关于 $x$ 或关于 $y$ 为奇函数，如 $x$、$xy^2$ 或 $y^3$，就有 $\\oint_C f\\,ds = 0$，这样的项之和也一样，如 $x^5 + y^5$。像 $x^2$ 或 $x^2 + y^4$ 这样的正函数给出正的积分。\n\n> **注意。** 每一项都必须关于 $x$ 或关于 $y$ 为奇函数。像 $x^2y^2$ 这样关于两者都是偶函数的项从不为负，不会相消。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        let b = rng.int(2, 8);
        if (b === a) b += 1;
        const c = rng.int(2, 5);
        const odd = rng.pick([`${c}xy^2`, `${c}x^3`, `${c}y^3`, `${c}x^2y`, `${c}xy^4`, `x^3 + ${c}y`]);
        const even = rng.shuffle([`${c}x^2`, `${c}y^2 + 1`, `x^2y^2`, `${c} + x^4`, `${c}x^2 + y^2`]).slice(0, 3);
        const o = (s: string) => t(`$f(x, y) = ${s}$`, `$f(x, y) = ${s}$`);
        return explainedChoice(rng, {
          prompt: t(
            `$C$ is the ellipse $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$. For which function is $\\oint_C f\\,ds = 0$?`,
            `$C$ 是椭圆 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$。对哪个函数有 $\\oint_C f\\,ds = 0$？`,
          ),
          correct: o(odd),
          wrong: even.map((s) => ({
            option: o(s),
            why: t(
              `$${s}$ is never negative on the ellipse and is positive at most of its points, so its integral is positive`,
              `$${s}$ 在椭圆上从不为负，且在大多数点为正，所以积分为正`,
            ),
          })),
          solution: walked(
            [
              [
                ["Check each term for oddness", "检查每一项的奇偶性"],
                t(
                  `Each term of $${odd}$ has an odd power of $x$ or an odd power of $y$, so it changes sign under $x \\mapsto -x$ or under $y \\mapsto -y$.`,
                  `$${odd}$ 的每一项都含 $x$ 或 $y$ 的奇次幂，所以在 $x \\mapsto -x$ 或 $y \\mapsto -y$ 下变号。`,
                ),
              ],
              [
                ["Use the symmetry of the ellipse", "利用椭圆的对称性"],
                t(
                  "The ellipse and $ds$ are unchanged by both reflections, so each term's values on mirror halves cancel, and the integral is $0$.",
                  "椭圆和 $ds$ 在两种反射下都不变，所以每一项在镜像两半上的值相消，积分为 $0$。",
                ),
              ],
            ],
            t(
              `The other three functions have only even powers of $x$ and of $y$, and each is never negative, so none of them can integrate to $0$.`,
              `其余三个函数只含 $x$ 和 $y$ 的偶次幂，且都不为负，所以它们的积分都不可能为 $0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** furtherPropertiesOfLineIntegralsOfScalarFunctions covers piecewise additivity. */
export const furtherPropertiesOfLineIntegralsOfScalarFunctions: TopicDef = {
  id: "further-properties-of-line-integrals-of-scalar-functions",
  title: t("Further Properties of Line Integrals of Scalar Functions", "标量函数曲线积分的进一步性质"),
  summary: t(
    "A line integral over a piecewise-smooth curve is the sum of the integrals over its smooth pieces: $\\int_{C_1 + C_2} f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds$.",
    "分段光滑曲线上的曲线积分等于各光滑段上积分之和：$\\int_{C_1 + C_2} f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds$。",
  ),
  intro: t(
    "Find $\\int_C x\\,ds$ around the boundary of the triangle with corners $(0, 0)$, $(4, 0)$ and $(4, 3)$. Take the three sides one at a time. Along the bottom, $ds = dx$ and $\\int_0^4 x\\,dx = 8$. Along the right side $x = 4$ and $ds = dy$, so $\\int_0^3 4\\,dy = 12$. The hypotenuse has length $5$ and $x$ averages $2$ along it, giving $10$. The total is $8 + 12 + 10 = 30$.\n\nCheck: each side contributes its length times the value of $x$ at its midpoint: $4 \\cdot 2 + 3 \\cdot 4 + 5 \\cdot 2 = 30$.\n\nIn this lesson we split piecewise smooth curves into smooth pieces and add the integrals over them.",
    "沿以 $(0, 0)$、$(4, 0)$、$(4, 3)$ 为顶点的三角形边界求 $\\int_C x\\,ds$。三条边逐一处理。底边上 $ds = dx$，$\\int_0^4 x\\,dx = 8$。右边上 $x = 4$，$ds = dy$，$\\int_0^3 4\\,dy = 12$。斜边长 $5$，$x$ 在其上的平均值为 $2$，贡献 $10$。合计 $8 + 12 + 10 = 30$。\n\n检验：每条边贡献其长度乘以 $x$ 在中点的值：$4 \\cdot 2 + 3 \\cdot 4 + 5 \\cdot 2 = 30$。\n\n本课我们把分段光滑曲线分成光滑段，再把各段上的积分相加。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-circles"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "additivity-over-piecewise-smooth-paths",
      title: t("Additivity over piecewise-smooth paths", "分段光滑路径上的可加性"),
      explanation: t(
        "A path made of several smooth pieces is handled one piece at a time, with a convenient parametrization for each, and the results are added. If a path $C$ consists of $k$ smooth components $C_1, C_2, \\dots, C_k$ joined end-to-end:\n\n$$\\int_C f\\,ds = \\sum_{i=1}^k \\int_{C_i} f\\,ds.$$\n\nPieces contributing $4$, $7$ and $12$ give $23$.\n\n> **Watch out.** Every piece counts, and each with a plus sign: the direction in which a piece is traced does not change a scalar line integral.",
        "由几段光滑曲线组成的路径要逐段处理，每段用方便的参数化，再把结果相加。若路径 $C$ 由首尾相接的 $k$ 个光滑子段 $C_1, C_2, \\dots, C_k$ 构成：\n\n$$\\int_C f\\,ds = \\sum_{i=1}^k \\int_{C_i} f\\,ds$$\n\n贡献为 $4$、$7$、$12$ 的三段合计 $23$。\n\n> **注意。** 每一段都要算，而且都取正号：标量线积分不随一段的描画方向改变。",
      ),
      generate(rng: Rng): Problem {
        const i1 = rng.int(5, 30);
        const i2 = rng.int(5, 30);
        const i3 = rng.int(5, 30);
        const ans = i1 + i2 + i3;
        return numberProblem({
          prompt: t(
            `A piecewise-smooth curve $C$ is the union of three smooth segments $C_1$, $C_2$, and $C_3$. If $\\int_{C_1} f\\,ds = ${i1}$, $\\int_{C_2} f\\,ds = ${i2}$, and $\\int_{C_3} f\\,ds = ${i3}$, find $\\int_C f\\,ds$.`,
            `分段光滑曲线 $C$ 由三个光滑子段 $C_1$、$C_2$ 与 $C_3$ 顺次连接而成。若 $\\int_{C_1} f\\,ds = ${i1}$、$\\int_{C_2} f\\,ds = ${i2}$ 且 $\\int_{C_3} f\\,ds = ${i3}$，求 $\\int_C f\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(i1 + i2, "That leaves out the piece $C_3$; every piece of $C$ counts.", "那是漏了 $C_3$ 这一段；$C$ 的每一段都要算。"),
            why(i2 + i3, "That leaves out the piece $C_1$; every piece of $C$ counts.", "那是漏了 $C_1$ 这一段；$C$ 的每一段都要算。"),
            why(
              i1 + i2 - i3,
              "That subtracts the last piece; scalar line integrals over the pieces are all added.",
              "那是减去了最后一段；各段上的标量线积分都是相加的。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Split the curve", "拆分曲线"],
                t(
                  "$\\int_C f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds + \\int_{C_3} f\\,ds$.",
                  "$\\int_C f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds + \\int_{C_3} f\\,ds$。",
                ),
              ],
              [["Add", "相加"], t(`$${i1} + ${i2} + ${i3} = ${ans}$.`, `$${i1} + ${i2} + ${i3} = ${ans}$。`)],
            ],
            t(
              `Adding in another order, $${i3} + ${i1} + ${i2} = ${ans}$: the order in which the pieces are joined does not matter.`,
              `换个顺序相加，$${i3} + ${i1} + ${i2} = ${ans}$：各段连接的顺序无关紧要。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-scalar-line-integral-over-an-l-shaped-path",
      title: t("A scalar line integral over an L-shaped path", "沿 L 形路径的标量线积分"),
      explanation: t(
        "A piecewise smooth path is integrated one smooth piece at a time: $\\int_{C_1 \\cup C_2} f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds$. On a horizontal piece $ds = dx$ with $y$ fixed, and on a vertical piece $ds = dy$ with $x$ fixed. Each piece is parametrized in its own variable, and the pieces' contributions are added at the end. From $(0, 0)$ to $(2, 0)$ and then to $(2, 9)$, $\\int_C (x + y)\\,ds = 2 + \\left(18 + \\frac{81}{2}\\right) = \\frac{121}{2}$.\n\n> **Watch out.** On the vertical piece $x$ keeps its value at the corner; it is not $0$. Setting $x = 0$ there loses the term $x \\cdot (\\text{height})$.",
        "分段光滑路径按光滑段逐段积分：$\\int_{C_1 \\cup C_2} f\\,ds = \\int_{C_1} f\\,ds + \\int_{C_2} f\\,ds$。在水平段上 $ds = dx$ 且 $y$ 固定，在竖直段上 $ds = dy$ 且 $x$ 固定。每一段用各自的变量参数化，最后把各段的贡献相加。从 $(0, 0)$ 到 $(2, 0)$ 再到 $(2, 9)$，$\\int_C (x + y)\\,ds = 2 + \\left(18 + \\frac{81}{2}\\right) = \\frac{121}{2}$。\n\n> **注意。** 在竖直段上 $x$ 保持拐角处的值，不是 $0$。在那里令 $x = 0$ 会丢掉 $x \\cdot (\\text{高度})$ 这一项。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 8);
        const b = rng.int(1, 8);
        const k = rng.int(1, 3);
        const c1 = Q.of(k * a * a, 2);
        const c2 = Q.of(2 * k * a * b + k * b * b, 2);
        const ans = c1.add(c2);
        const f = k === 1 ? "x + y" : `${k}(x + y)`;
        return numberProblem({
          prompt: t(
            `$C$ runs along the segment from $(0, 0)$ to $(${a}, 0)$ and then along the segment from $(${a}, 0)$ to $(${a}, ${b})$. Evaluate $\\int_C ${f}\\,ds$.`,
            `$C$ 先沿从 $(0, 0)$ 到 $(${a}, 0)$ 的线段，再沿从 $(${a}, 0)$ 到 $(${a}, ${b})$ 的线段。计算 $\\int_C ${f}\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              c1,
              "That is the horizontal piece alone; the vertical piece adds its own integral.",
              "那只是水平段；竖直段还要加上它自己的积分。",
            ),
            why(
              c2,
              "That is the vertical piece alone; the horizontal piece adds its own integral.",
              "那只是竖直段；水平段还要加上它自己的积分。",
            ),
            why(
              Q.of(k * (a * a + b * b), 2),
              `That sets $x = 0$ on the vertical piece; there $x = ${a}$.`,
              `那是在竖直段上令 $x = 0$；那里 $x = ${a}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["The horizontal piece", "水平段"],
                t(
                  `$y = 0$ and $ds = dx$: $\\int_0^{${a}} ${coef(k)}x\\,dx = ${c1.toLatex()}$.`,
                  `$y = 0$，$ds = dx$：$\\int_0^{${a}} ${coef(k)}x\\,dx = ${c1.toLatex()}$。`,
                ),
              ],
              [
                ["The vertical piece", "竖直段"],
                t(
                  `$x = ${a}$ and $ds = dy$: $\\int_0^{${b}} ${coef(k)}(${a} + y)\\,dy = ${c2.toLatex()}$.`,
                  `$x = ${a}$，$ds = dy$：$\\int_0^{${b}} ${coef(k)}(${a} + y)\\,dy = ${c2.toLatex()}$。`,
                ),
              ],
              [
                ["Add", "相加"],
                t(`$${c1.toLatex()} + ${c2.toLatex()} = ${ans.toLatex()}$.`, `$${c1.toLatex()} + ${c2.toLatex()} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `Each piece is a segment, so it contributes its length times the value of $${f}$ at its midpoint: $${a} \\cdot ${Q.of(k * a, 2).toLatex()} + ${b} \\cdot ${Q.of(k * (2 * a + b), 2).toLatex()} = ${ans.toLatex()}$.`,
              `每一段都是线段，贡献其长度乘以 $${f}$ 在中点的值：$${a} \\cdot ${Q.of(k * a, 2).toLatex()} + ${b} \\cdot ${Q.of(k * (2 * a + b), 2).toLatex()} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lineIntegralsOfScalarFunctionsOverPolarCurves integrates in polar coordinates. */
export const lineIntegralsOfScalarFunctionsOverPolarCurves: TopicDef = {
  id: "line-integrals-of-scalar-functions-over-polar-curves",
  title: t("Line Integrals of Scalar Functions Over Polar Curves", "极坐标曲线上的标量曲线积分"),
  summary: t(
    "Along polar curves r = g(θ), the arc length differential is ds = √(r² + [r'(θ)]²) dθ.",
    "沿极坐标曲线 r = g(θ)，弧长微元为 ds = √(r² + [r'(θ)]²) dθ。",
  ),
  intro: t(
    "Find $\\int_C y\\,ds$ along the circle $r = 4\\sin\\theta$, $0 \\le \\theta \\le \\pi$. Here $r' = 4\\cos\\theta$, so $r^2 + r'^2 = 16$ and $ds = 4\\,d\\theta$. On the curve $y = r\\sin\\theta = 4\\sin^2\\theta$, so $\\int_C y\\,ds = \\int_0^{\\pi} 4\\sin^2\\theta \\cdot 4\\,d\\theta = 16 \\cdot \\frac{\\pi}{2} = 8\\pi$.\n\nCheck: $r = 4\\sin\\theta$ is the circle of radius $2$ centered at $(0, 2)$. Its length is $4\\pi$, and $y$ averages $2$, its value at the center, so the integral is $2 \\cdot 4\\pi = 8\\pi$.\n\nIn this lesson we evaluate line integrals along polar curves $r = g(\\theta)$, with $ds = \\sqrt{r^2 + r'^2}\\,d\\theta$.",
    "沿圆 $r = 4\\sin\\theta$，$0 \\le \\theta \\le \\pi$，求 $\\int_C y\\,ds$。这里 $r' = 4\\cos\\theta$，所以 $r^2 + r'^2 = 16$，$ds = 4\\,d\\theta$。曲线上 $y = r\\sin\\theta = 4\\sin^2\\theta$，所以 $\\int_C y\\,ds = \\int_0^{\\pi} 4\\sin^2\\theta \\cdot 4\\,d\\theta = 16 \\cdot \\frac{\\pi}{2} = 8\\pi$。\n\n检验：$r = 4\\sin\\theta$ 是以 $(0, 2)$ 为圆心、半径 $2$ 的圆。它的长度为 $4\\pi$，$y$ 的平均值是圆心处的值 $2$，所以积分为 $2 \\cdot 4\\pi = 8\\pi$。\n\n本课我们沿极坐标曲线 $r = g(\\theta)$ 计算线积分，$ds = \\sqrt{r^2 + r'^2}\\,d\\theta$。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-circles"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "arc-length-element-in-polar-coordinates",
      figure: multivariableDrawings5["line-integrals-of-scalar-functions-over-polar-curves#arc-length-element-in-polar-coordinates"],
      title: t("Arc length element in polar coordinates", "极坐标下的弧长微元计算"),
      explanation: t(
        "For a polar curve the arc length element combines the change in radius with the sideways motion, which is the radius times the change in angle. For a curve given by $r = g(\\theta)$ on $[\\alpha, \\beta]$, the line integral is:\n\n$$\\int_C f(r, \\theta)\\,ds = \\int_\\alpha^\\beta f(g(\\theta), \\theta)\\sqrt{[g(\\theta)]^2 + [g'(\\theta)]^2}\\,d\\theta.$$\n\nOn the arc $r = 12$, $0 \\le \\theta \\le \\frac{\\pi}{5}$, $ds = 12\\,d\\theta$ and the length is $\\frac{12\\pi}{5}$.\n\n> **Watch out.** $ds$ is not $d\\theta$, and it is not the area element $\\frac{1}{2}r^2\\,d\\theta$: on a circle of radius $a$ it is $a\\,d\\theta$.",
        "对于极坐标曲线，弧长微元结合了半径的变化和侧向的运动，后者等于半径乘以角度的变化。对于由 $r = g(\\theta)$（$\\theta \\in [\\alpha, \\beta]$）给出的曲线，第一类曲线积分为：\n\n$$\\int_C f(r, \\theta)\\,ds = \\int_\\alpha^\\beta f(g(\\theta), \\theta)\\sqrt{[g(\\theta)]^2 + [g'(\\theta)]^2}\\,d\\theta$$\n\n在圆弧 $r = 12$，$0 \\le \\theta \\le \\frac{\\pi}{5}$ 上，$ds = 12\\,d\\theta$，长度为 $\\frac{12\\pi}{5}$。\n\n> **注意。** $ds$ 不是 $d\\theta$，也不是面积元 $\\frac{1}{2}r^2\\,d\\theta$：在半径为 $a$ 的圆上它是 $a\\,d\\theta$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 10);
        const k = rng.pick([2, 3, 4, 6]);
        const ans = Q.of(a, k);
        return numberProblem({
          prompt: t(
            `Find the value of $\\frac{1}{\\pi} \\int_C 1\\,ds$ along the polar arc $r = ${a}$ for $0 \\le \\theta \\le \\frac{\\pi}{${k}}$.`,
            `计算 $\\frac{1}{\\pi} \\int_C 1\\,ds$ 的值，其中曲线 $C$ 为极坐标弧 $r = ${a}$（$0 \\le \\theta \\le \\frac{\\pi}{${k}}$）。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(1, k),
              `That uses $d\\theta$ for $ds$; here $ds = ${a}\\,d\\theta$.`,
              `那是把 $ds$ 当作 $d\\theta$；这里 $ds = ${a}\\,d\\theta$。`,
            ),
            why(
              Q.of(a * a, 2 * k),
              "That is the area of the sector, $\\frac{1}{2}r^2\\theta$; the length of the arc is $r\\theta$.",
              "那是扇形面积 $\\frac{1}{2}r^2\\theta$；弧长是 $r\\theta$。",
            ),
            why(
              a,
              `That runs $\\theta$ over $\\pi$; the arc ends at $\\frac{\\pi}{${k}}$.`,
              `那是让 $\\theta$ 走了 $\\pi$；圆弧止于 $\\frac{\\pi}{${k}}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find $ds$", "求 $ds$"],
                t(
                  `For $r = ${a}$, $r' = 0$, so $ds = \\sqrt{${a * a} + 0}\\,d\\theta = ${a}\\,d\\theta$.`,
                  `对 $r = ${a}$，$r' = 0$，所以 $ds = \\sqrt{${a * a} + 0}\\,d\\theta = ${a}\\,d\\theta$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{\\pi/${k}} ${a}\\,d\\theta = \\frac{${a}\\pi}{${k}}$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$\\int_0^{\\pi/${k}} ${a}\\,d\\theta = \\frac{${a}\\pi}{${k}}$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The arc is $\\frac{1}{${2 * k}}$ of the circle of radius $${a}$, whose length is $${2 * a}\\pi$, and $\\frac{${2 * a}\\pi}{${2 * k}} = ${ans.toLatex()}\\pi$.`,
              `这段弧是半径 $${a}$ 的圆的 $\\frac{1}{${2 * k}}$，圆周长为 $${2 * a}\\pi$，$\\frac{${2 * a}\\pi}{${2 * k}} = ${ans.toLatex()}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-mass-of-a-cardioid-wire",
      figure: multivariableDrawings5["line-integrals-of-scalar-functions-over-polar-curves#the-mass-of-a-cardioid-wire"],
      title: t("The mass of a cardioid-shaped wire", "心形线导线的质量"),
      explanation: t(
        "For a polar curve $r = r(\\theta)$, $ds = \\sqrt{r^2 + (dr/d\\theta)^2}\\,d\\theta$. For the cardioid $r = a(1 + \\cos\\theta)$,\n\n$$r^2 + r'^2 = a^2(2 + 2\\cos\\theta) = 4a^2\\cos^2\\tfrac{\\theta}{2},$$\n\nso $ds = 2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta$ and the whole curve has length $\\int_0^{2\\pi} 2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta = 8a$. The same holds for $a(1 - \\cos\\theta)$ and $a(1 \\pm \\sin\\theta)$, which are rotations of it. A wire of constant density $k$ along it has mass $8ak$. The cardioid $r = 10(1 - \\sin\\theta)$ has length $80$.\n\n> **Watch out.** Keep the absolute value: $\\cos\\frac{\\theta}{2}$ is negative for $\\pi < \\theta < 2\\pi$, and dropping $|\\cdot|$ gives $0$. The square root of $4a^2\\cos^2\\frac{\\theta}{2}$ is $2a\\left|\\cos\\frac{\\theta}{2}\\right|$, with the factor $2$.",
        "对极坐标曲线 $r = r(\\theta)$，$ds = \\sqrt{r^2 + (dr/d\\theta)^2}\\,d\\theta$。对心形线 $r = a(1 + \\cos\\theta)$，\n\n$$r^2 + r'^2 = a^2(2 + 2\\cos\\theta) = 4a^2\\cos^2\\tfrac{\\theta}{2},$$\n\n所以 $ds = 2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta$，整条曲线长 $\\int_0^{2\\pi} 2a\\left|\\cos\\tfrac{\\theta}{2}\\right|d\\theta = 8a$。$a(1 - \\cos\\theta)$ 与 $a(1 \\pm \\sin\\theta)$ 是它的旋转，结论相同。沿它的常密度 $k$ 导线质量为 $8ak$。心形线 $r = 10(1 - \\sin\\theta)$ 的长度是 $80$。\n\n> **注意。** 绝对值要保留：当 $\\pi < \\theta < 2\\pi$ 时 $\\cos\\frac{\\theta}{2}$ 为负，去掉 $|\\cdot|$ 会得到 $0$。$4a^2\\cos^2\\frac{\\theta}{2}$ 的平方根是 $2a\\left|\\cos\\frac{\\theta}{2}\\right|$，带因子 $2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const k = rng.int(1, 4);
        const form = rng.pick(["1 + \\cos\\theta", "1 - \\cos\\theta", "1 + \\sin\\theta", "1 - \\sin\\theta"]);
        const ans = 8 * a * k;
        const sum = `${a === 1 ? "" : a * a}(2 ${form[2]} 2${form.slice(4)})`;
        return numberProblem({
          prompt: t(
            `A wire of constant density $${k}$ lies along the cardioid $r = ${coef(a)}(${form})$, $0 \\le \\theta \\le 2\\pi$. Find its mass $\\int_C ${k}\\,ds$.`,
            `常密度为 $${k}$ 的导线沿心形线 $r = ${coef(a)}(${form})$，$0 \\le \\theta \\le 2\\pi$。求其质量 $\\int_C ${k}\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              4 * a * k,
              `That is half the length, as if $ds = ${coef(a)}\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta$; the root of $4a^2\\cos^2\\frac{\\theta}{2}$ is $2a\\left|\\cos\\frac{\\theta}{2}\\right|$.`,
              `那是长度的一半，仿佛 $ds = ${coef(a)}\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta$；$4a^2\\cos^2\\frac{\\theta}{2}$ 的平方根是 $2a\\left|\\cos\\frac{\\theta}{2}\\right|$。`,
            ),
            why(
              8 * a,
              `That is the length of the wire; the mass multiplies it by the density $${k}$.`,
              `那是导线的长度；质量还要乘以密度 $${k}$。`,
            ),
            ...(form === "1 + \\cos\\theta"
              ? [
                  why(
                    0,
                    "That drops the absolute value in $ds = 2a\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta$; a length is never negative.",
                    "那是去掉了 $ds = 2a\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta$ 中的绝对值；长度不会为负。",
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              [["Find $r^2 + r'^2$", "求 $r^2 + r'^2$"], t(`$r^2 + r'^2 = ${sum}$.`, `$r^2 + r'^2 = ${sum}$。`)],
              [
                ["Find the length", "求长度"],
                form === "1 + \\cos\\theta"
                  ? t(
                      `That is $${4 * a * a}\\cos^2\\frac{\\theta}{2}$, so $ds = ${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta$ and the length is $\\int_0^{2\\pi} ${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta = ${8 * a}$.`,
                      `它等于 $${4 * a * a}\\cos^2\\frac{\\theta}{2}$，所以 $ds = ${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta$，长度为 $\\int_0^{2\\pi} ${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta = ${8 * a}$。`,
                    )
                  : t(
                      `This curve is the cardioid $${coef(a)}(1 + \\cos\\theta)$ turned about the pole, so it has the same length: $\\int_0^{2\\pi} ${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta = ${8 * a}$.`,
                      `这条曲线是心形线 $${coef(a)}(1 + \\cos\\theta)$ 绕极点旋转所得，长度相同：$\\int_0^{2\\pi} ${2 * a}\\left|\\cos\\frac{\\theta}{2}\\right|d\\theta = ${8 * a}$。`,
                    ),
              ],
              [
                ["Multiply by the density", "乘以密度"],
                t(`The mass is $${k} \\cdot ${8 * a} = ${ans}$.`, `质量为 $${k} \\cdot ${8 * a} = ${ans}$。`),
              ],
            ],
            t(
              `Over a full turn $\\left|\\cos\\frac{\\theta}{2}\\right|$ averages $\\frac{2}{\\pi}$, so the length is $${2 * a} \\cdot 2\\pi \\cdot \\frac{2}{\\pi} = ${8 * a}$, and the mass is $${k} \\cdot ${8 * a} = ${ans}$.`,
              `在一整圈上 $\\left|\\cos\\frac{\\theta}{2}\\right|$ 的平均值是 $\\frac{2}{\\pi}$，所以长度为 $${2 * a} \\cdot 2\\pi \\cdot \\frac{2}{\\pi} = ${8 * a}$，质量为 $${k} \\cdot ${8 * a} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.20 Line Integrals With Respect to X and Y
// ---------------------------------------------------------------------------

/** lineIntegralsWithRespectToXAndY integrates with respect to x and y along curves. */
export const lineIntegralsWithRespectToXAndY: TopicDef = {
  id: "line-integrals-with-respect-to-x-and-y",
  title: t("Line Integrals With Respect to X and Y", "对坐标 x 与 y 的第二类曲线积分"),
  summary: t(
    "The line integrals $\\int_C P\\,dx$ and $\\int_C Q\\,dy$ integrate along an oriented curve with respect to the change in $x$ or in $y$.",
    "对坐标的曲线积分 $\\int_C P\\,dx$ 与 $\\int_C Q\\,dy$ 沿有向曲线对 $x$ 或 $y$ 的变化量积分。",
  ),
  intro: t(
    "Find $\\int_C y\\,dx$ and $\\int_C x\\,dy$ along $y = x^3$ from $(0, 0)$ to $(2, 8)$. Take $x = t$, $y = t^3$, $0 \\le t \\le 2$, so $dx = dt$ and $dy = 3t^2\\,dt$. Then $\\int_C y\\,dx = \\int_0^2 t^3\\,dt = 4$ and $\\int_C x\\,dy = \\int_0^2 t \\cdot 3t^2\\,dt = 12$.\n\nCheck: $y\\,dx + x\\,dy$ is the change in $xy$, and $xy$ goes from $0$ to $16$; indeed $4 + 12 = 16$.\n\nIn this lesson we integrate with respect to $x$ or $y$ along a curve, replacing $dx$ by $x'(t)\\,dt$ and $dy$ by $y'(t)\\,dt$.",
    "沿 $y = x^3$ 从 $(0, 0)$ 到 $(2, 8)$ 求 $\\int_C y\\,dx$ 与 $\\int_C x\\,dy$。取 $x = t$，$y = t^3$，$0 \\le t \\le 2$，则 $dx = dt$，$dy = 3t^2\\,dt$。于是 $\\int_C y\\,dx = \\int_0^2 t^3\\,dt = 4$，$\\int_C x\\,dy = \\int_0^2 t \\cdot 3t^2\\,dt = 12$。\n\n检验：$y\\,dx + x\\,dy$ 是 $xy$ 的改变量，$xy$ 从 $0$ 变到 $16$；确实 $4 + 12 = 16$。\n\n本课我们沿曲线对 $x$ 或 $y$ 积分，把 $dx$ 换成 $x'(t)\\,dt$，把 $dy$ 换成 $y'(t)\\,dt$。",
  ),
  prerequisites: ["line-integrals-of-scalar-functions-over-line-segments"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "differential-line-integrals-along-curves",
      title: t("Differential line integrals along curves", "计算沿曲线的坐标微分积分"),
      explanation: t(
        "Integrating with respect to one coordinate measures the function against changes in that coordinate only, so replace the differential by the derivative of that coordinate times the parameter's differential. For a curve parameterized by $\\mathbf{r}(t) = (x(t), y(t))$ on $[a, b]$:\n\n$$\\int_C P(x, y)\\,dx = \\int_a^b P(x(t), y(t))\\,x'(t)\\,dt, \\quad \\int_C Q(x, y)\\,dy = \\int_a^b Q(x(t), y(t))\\,y'(t)\\,dt.$$\n\nAlong $y = x^2$ from $(0, 0)$ to $(1, 1)$, $\\int_C 6y\\,dx = \\int_0^1 6t^2\\,dt = 2$.\n\n> **Watch out.** $dx$ is $x'(t)\\,dt$, not the arc length $ds$. And $y$ must be written in terms of the parameter, here $y = t^2$; it does not stay as $x$ or $t$.",
        "对一个坐标积分只衡量函数相对于该坐标变化的累积，所以把微分换成该坐标的导数乘以参数的微分。对于由 $\\mathbf{r}(t) = (x(t), y(t))$（$t \\in [a, b]$）参数化的曲线：\n\n$$\\int_C P(x, y)\\,dx = \\int_a^b P(x(t), y(t))\\,x'(t)\\,dt, \\quad \\int_C Q(x, y)\\,dy = \\int_a^b Q(x(t), y(t))\\,y'(t)\\,dt$$\n\n沿 $y = x^2$ 从 $(0, 0)$ 到 $(1, 1)$，$\\int_C 6y\\,dx = \\int_0^1 6t^2\\,dt = 2$。\n\n> **注意。** $dx$ 是 $x'(t)\\,dt$，不是弧长 $ds$。$y$ 要用参数表示，这里 $y = t^2$；它不能保留为 $x$ 或 $t$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(1, 5);
        const num = a * b * b * b;
        const ans = Q.of(num, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C ${poly([a, "y"])}\\,dx$ along the parabolic arc $y = x^2$ from $(0, 0)$ to $(${b}, ${b * b})$.`,
            `计算 $\\int_C ${poly([a, "y"])}\\,dx$ 的值，其中曲线 $C$ 为抛物线弧 $y = x^2$ 从 $(0, 0)$ 到 $(${b}, ${b * b})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              num,
              "That leaves out the $\\frac{1}{3}$ from $\\int t^2\\,dt = \\frac{t^3}{3}$.",
              "那是漏了 $\\int t^2\\,dt = \\frac{t^3}{3}$ 中的 $\\frac{1}{3}$。",
            ),
            why(
              Q.of(a * b * b, 2),
              "That replaces $y$ by $x$; on the parabola $y = x^2$.",
              "那是把 $y$ 换成了 $x$；在抛物线上 $y = x^2$。",
            ),
            why(
              Q.of(a * b ** 4, 2),
              `That integrates with respect to $y$, $\\int_0^{${b * b}} ${poly([a, "y"])}\\,dy$; the differential is $dx$.`,
              `那是对 $y$ 积分 $\\int_0^{${b * b}} ${poly([a, "y"])}\\,dy$；微分是 $dx$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(
                  `$x = t$, $y = t^2$ for $0 \\le t \\le ${b}$, so $dx = dt$.`,
                  `$x = t$，$y = t^2$，$0 \\le t \\le ${b}$，所以 $dx = dt$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{${b}} ${poly([a, "t^2"])}\\,dt = ${coef(a)}\\frac{${b ** 3}}{3} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${b}} ${poly([a, "t^2"])}\\,dt = ${coef(a)}\\frac{${b ** 3}}{3} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Moving right along the parabola, $\\int_C y\\,dx$ is the area under $y = x^2$ from $0$ to $${b}$, which is $\\frac{${b ** 3}}{3}$; times $${a}$ it is $${ans.toLatex()}$.`,
              `沿抛物线向右走，$\\int_C y\\,dx$ 就是 $y = x^2$ 在 $0$ 到 $${b}$ 之间下方的面积 $\\frac{${b ** 3}}{3}$；乘以 $${a}$ 得 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "x-dy-versus-y-dx-on-a-parametric-parabola",
      figure: multivariableDrawings5["line-integrals-with-respect-to-x-and-y#x-dy-versus-y-dx-on-a-parametric-parabola"],
      title: t("$\\int x\\,dy$ versus $\\int y\\,dx$ on a parabola", "抛物线上的 $\\int x\\,dy$ 与 $\\int y\\,dx$"),
      explanation: t(
        "On a parametric curve $x = x(t)$, $y = y(t)$, replace $dx$ by $x'(t)\\,dt$ and $dy$ by $y'(t)\\,dt$. For $x = pt$, $y = qt^2$, $0 \\le t \\le 1$:\n\n$$\\int_C y\\,dx = \\int_0^1 qt^2 \\cdot p\\,dt = \\frac{pq}{3}, \\qquad \\int_C x\\,dy = \\int_0^1 pt \\cdot 2qt\\,dt = \\frac{2pq}{3}.$$\n\nThe two are different integrals; which differential appears matters. For $x = 2t$, $y = 7t^2$ they are $\\frac{14}{3}$ and $\\frac{28}{3}$.\n\n> **Watch out.** $dy = 2qt\\,dt$ carries the factor $2$ from differentiating $t^2$. Do not swap the roles: in $\\int y\\,dx$ the integrand is $y$ and the differential comes from $x$.",
        "在参数曲线 $x = x(t)$，$y = y(t)$ 上，把 $dx$ 换成 $x'(t)\\,dt$，把 $dy$ 换成 $y'(t)\\,dt$。对 $x = pt$，$y = qt^2$，$0 \\le t \\le 1$：\n\n$$\\int_C y\\,dx = \\int_0^1 qt^2 \\cdot p\\,dt = \\frac{pq}{3}, \\qquad \\int_C x\\,dy = \\int_0^1 pt \\cdot 2qt\\,dt = \\frac{2pq}{3}$$\n\n二者是不同的积分，出现的是哪个微分很重要。对 $x = 2t$，$y = 7t^2$，它们分别为 $\\frac{14}{3}$ 和 $\\frac{28}{3}$。\n\n> **注意。** $dy = 2qt\\,dt$ 带有对 $t^2$ 求导得到的因子 $2$。不要把角色弄反：在 $\\int y\\,dx$ 中被积函数是 $y$，微分来自 $x$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-5, 5);
        const q = rng.nonZero(-5, 5);
        const xdy = rng.int(0, 1) === 1;
        const ans = Q.of(xdy ? 2 * p * q : p * q, 3);
        const xt = poly([p, "t"]);
        const yt = poly([q, "t^2"]);
        const lead = xdy ? 2 * p * q : p * q;
        return numberProblem({
          prompt: t(
            `$C$ is $x = ${xt}$, $y = ${yt}$, $0 \\le t \\le 1$. Evaluate $\\int_C ${xdy ? "x\\,dy" : "y\\,dx"}$.`,
            `$C$ 为 $x = ${xt}$，$y = ${yt}$，$0 \\le t \\le 1$。计算 $\\int_C ${xdy ? "x\\,dy" : "y\\,dx"}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(xdy ? p * q : 2 * p * q, 3),
              xdy
                ? "That is $\\int_C y\\,dx$, or $dy$ without the factor $2$ from $t^2$."
                : "That is $\\int_C x\\,dy$; here the integrand is $y$ and the differential is $dx$.",
              xdy
                ? "那是 $\\int_C y\\,dx$，或是 $dy$ 漏了 $t^2$ 求导的因子 $2$。"
                : "那是 $\\int_C x\\,dy$；这里被积函数是 $y$，微分是 $dx$。",
            ),
            why(
              Q.of(lead, 2),
              "That takes $\\int_0^1 t^2\\,dt$ to be $\\frac{1}{2}$; it is $\\frac{1}{3}$.",
              "那是把 $\\int_0^1 t^2\\,dt$ 当作 $\\frac{1}{2}$；它是 $\\frac{1}{3}$。",
            ),
            why(
              lead,
              "That leaves out the $\\frac{1}{3}$ from $\\int_0^1 t^2\\,dt$.",
              "那是漏了 $\\int_0^1 t^2\\,dt$ 中的 $\\frac{1}{3}$。",
            ),
          ]),
          solution: walked(
            [
              [
                [xdy ? "Find $dy$" : "Find $dx$", xdy ? "求 $dy$" : "求 $dx$"],
                xdy ? t(`$dy = ${2 * q}t\\,dt$.`, `$dy = ${2 * q}t\\,dt$。`) : t(`$dx = ${p}\\,dt$.`, `$dx = ${p}\\,dt$。`),
              ],
              [
                ["Integrate", "积分"],
                xdy
                  ? t(
                      `$\\int_0^1 (${xt})(${poly([2 * q, "t"])})\\,dt = \\int_0^1 ${poly([lead, "t^2"])}\\,dt = ${ans.toLatex()}$.`,
                      `$\\int_0^1 (${xt})(${poly([2 * q, "t"])})\\,dt = \\int_0^1 ${poly([lead, "t^2"])}\\,dt = ${ans.toLatex()}$。`,
                    )
                  : t(
                      `$\\int_0^1 (${yt}) \\cdot ${paren(p)}\\,dt = \\int_0^1 ${poly([lead, "t^2"])}\\,dt = ${ans.toLatex()}$.`,
                      `$\\int_0^1 (${yt}) \\cdot ${paren(p)}\\,dt = \\int_0^1 ${poly([lead, "t^2"])}\\,dt = ${ans.toLatex()}$。`,
                    ),
              ],
            ],
            t(
              `$\\int_C y\\,dx + \\int_C x\\,dy$ is the change in $xy$, which goes from $0$ to $${p * q}$ at $t = 1$, and $${Q.of(p * q, 3).toLatex()} + ${paren(Q.of(2 * p * q, 3))} = ${p * q}$.`,
              `$\\int_C y\\,dx + \\int_C x\\,dy$ 是 $xy$ 的改变量，在 $t = 1$ 时 $xy$ 从 $0$ 变到 $${p * q}$，而 $${Q.of(p * q, 3).toLatex()} + ${paren(Q.of(2 * p * q, 3))} = ${p * q}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** propertiesOfLineIntegralsWithRespectToXAndY covers orientation reversal of coordinate integrals. */
export const propertiesOfLineIntegralsWithRespectToXAndY: TopicDef = {
  id: "properties-of-line-integrals-with-respect-to-x-and-y",
  title: t("Properties of Line Integrals With Respect to X and Y", "对坐标的第二类曲线积分的性质"),
  summary: t(
    "Unlike scalar line integrals, reversing the orientation changes the sign of a line integral with respect to a coordinate: $\\int_{-C} P\\,dx = -\\int_C P\\,dx$.",
    "与标量曲线积分不同，反转方向会使对坐标的曲线积分变号：$\\int_{-C} P\\,dx = -\\int_C P\\,dx$。",
  ),
  intro: t(
    "Let $C$ be $x = t$, $y = t^3$, $0 \\le t \\le 1$. Then $\\int_C y\\,dx = \\int_0^1 t^3\\,dt = \\frac{1}{4}$. Traced backwards, $-C$ is $x = 1 - t$, $y = (1 - t)^3$, with $dx = -dt$, so $\\int_{-C} y\\,dx = -\\int_0^1 (1 - t)^3\\,dt = -\\frac{1}{4}$.\n\nCheck: $\\int_C y\\,ds$ would not change sign, because $ds$ is always positive; $dx$ is negative wherever the curve moves left, and $-C$ moves left all the way.\n\nIn this lesson we use the rules for these integrals: reversing the curve changes their sign, and constant coefficients make them depend only on the endpoints.",
    "设 $C$ 为 $x = t$，$y = t^3$，$0 \\le t \\le 1$。则 $\\int_C y\\,dx = \\int_0^1 t^3\\,dt = \\frac{1}{4}$。反向描画时，$-C$ 为 $x = 1 - t$，$y = (1 - t)^3$，$dx = -dt$，所以 $\\int_{-C} y\\,dx = -\\int_0^1 (1 - t)^3\\,dt = -\\frac{1}{4}$。\n\n检验：$\\int_C y\\,ds$ 不会变号，因为 $ds$ 总为正；而曲线向左走时 $dx$ 为负，$-C$ 一路向左。\n\n本课我们使用这类积分的规则：曲线反向则积分变号，系数为常数时积分只取决于端点。",
  ),
  prerequisites: ["line-integrals-with-respect-to-x-and-y"],
  encompasses: [{ topic: "line-integrals-with-respect-to-x-and-y", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "orientation-reversal-for-differential-integrals",
      figure:
        multivariableDrawings5["properties-of-line-integrals-with-respect-to-x-and-y#orientation-reversal-for-differential-integrals"],
      title: t("Orientation reversal for differential integrals", "坐标微分积分在定向反转下的变号法则"),
      explanation: t(
        "Unlike integrals with respect to arc length, these integrals depend on direction, so travelling the curve backwards changes the sign of the result. Reversing the curve's direction negates coordinate differentials $dx \\to -dx$ and $dy \\to -dy$, so:\n\n$$\\int_{-C} (P\\,dx + Q\\,dy) = -\\int_C (P\\,dx + Q\\,dy).$$\n\nIf $\\int_C P\\,dx = 4$ and $\\int_C Q\\,dy = -1$, then $\\int_{-C} (6P\\,dx + Q\\,dy) = -(24 - 1) = -23$.\n\n> **Watch out.** Both terms change sign, not just one, and a constant coefficient stays as a factor.",
        "与对弧长的积分不同，这些积分依赖于方向，所以沿曲线反向走会改变结果的符号。反转曲线遍历方向会导致坐标微分变号 $dx \\to -dx$ 与 $dy \\to -dy$，因此：\n\n$$\\int_{-C} (P\\,dx + Q\\,dy) = -\\int_C (P\\,dx + Q\\,dy)$$\n\n若 $\\int_C P\\,dx = 4$，$\\int_C Q\\,dy = -1$，则 $\\int_{-C} (6P\\,dx + Q\\,dy) = -(24 - 1) = -23$。\n\n> **注意。** 两项都变号，不是只变一项；常数系数仍作为因子保留。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 5);
        const m = rng.nonZero(-9, 9);
        const drawn = rng.nonZero(-9, 9);
        const n = k * m + drawn === 0 ? drawn + 1 : drawn;
        const forward = k * m + n;
        const ans = -forward;
        return numberProblem({
          prompt: t(
            `If $\\int_C P\\,dx = ${m}$ and $\\int_C Q\\,dy = ${n}$, find the value of $\\int_{-C} (${k}P\\,dx + Q\\,dy)$.`,
            `若 $\\int_C P\\,dx = ${m}$，$\\int_C Q\\,dy = ${n}$，求 $\\int_{-C} (${k}P\\,dx + Q\\,dy)$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(forward, "That is the value along $C$; along $-C$ the sign changes.", "那是沿 $C$ 的值；沿 $-C$ 要变号。"),
            why(
              -k * m + n,
              "That changes the sign of the $P\\,dx$ term only; the $Q\\,dy$ term changes sign too.",
              "那是只让 $P\\,dx$ 项变号；$Q\\,dy$ 项也要变号。",
            ),
            why(
              k * m - n,
              "That changes the sign of the $Q\\,dy$ term only; the $P\\,dx$ term changes sign too.",
              "那是只让 $Q\\,dy$ 项变号；$P\\,dx$ 项也要变号。",
            ),
            why(-(m + n), `That drops the coefficient $${k}$ of $P\\,dx$.`, `那是丢了 $P\\,dx$ 的系数 $${k}$。`),
          ]),
          solution: walked(
            [
              [
                ["Evaluate along $C$", "沿 $C$ 计算"],
                t(
                  `$\\int_C (${k}P\\,dx + Q\\,dy) = ${k} \\cdot ${paren(m)} + ${paren(n)} = ${forward}$.`,
                  `$\\int_C (${k}P\\,dx + Q\\,dy) = ${k} \\cdot ${paren(m)} + ${paren(n)} = ${forward}$。`,
                ),
              ],
              [
                ["Reverse", "反向"],
                t(
                  `Reversing the curve changes the sign, so the value along $-C$ is $${ans}$.`,
                  `曲线反向使积分变号，所以沿 $-C$ 的值为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `Term by term, $\\int_{-C} ${k}P\\,dx = ${-k * m}$ and $\\int_{-C} Q\\,dy = ${-n}$, and $${-k * m} + ${paren(-n)} = ${ans}$.`,
              `逐项计算，$\\int_{-C} ${k}P\\,dx = ${-k * m}$，$\\int_{-C} Q\\,dy = ${-n}$，$${-k * m} + ${paren(-n)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "constant-coefficient-differentials-depend-only-on-endpoints",
      title: t("$\\int_C k\\,dx + m\\,dy$ depends only on the endpoints", "$\\int_C k\\,dx + m\\,dy$ 只取决于端点"),
      explanation: t(
        "With constant coefficients, $\\int_C k\\,dx = k\\int_a^b x'(t)\\,dt = k\\,(x_B - x_A)$ for any path from $A$ to $B$, and similarly $\\int_C m\\,dy = m\\,(y_B - y_A)$. So\n\n$$\\int_C k\\,dx + m\\,dy = k\\,\\Delta x + m\\,\\Delta y,$$\n\nwhatever the shape of the path. Reversing the path changes the sign. From $(1, 1)$ to $(3, -2)$, $\\int_C 7\\,dx - 2\\,dy = 7 \\cdot 2 - 2 \\cdot (-3) = 20$.\n\n> **Watch out.** Use the changes $\\Delta x$ and $\\Delta y$, end minus start, not the coordinates of the end point; and $k$ goes with $\\Delta x$, $m$ with $\\Delta y$.",
        "系数为常数时，对从 $A$ 到 $B$ 的任意路径，$\\int_C k\\,dx = k\\int_a^b x'(t)\\,dt = k\\,(x_B - x_A)$，同理 $\\int_C m\\,dy = m\\,(y_B - y_A)$。所以\n\n$$\\int_C k\\,dx + m\\,dy = k\\,\\Delta x + m\\,\\Delta y,$$\n\n与路径形状无关。路径反向则变号。从 $(1, 1)$ 到 $(3, -2)$，$\\int_C 7\\,dx - 2\\,dy = 7 \\cdot 2 - 2 \\cdot (-3) = 20$。\n\n> **注意。** 要用变化量 $\\Delta x$、$\\Delta y$，即终点减起点，不是终点的坐标；$k$ 配 $\\Delta x$，$m$ 配 $\\Delta y$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-6, 6);
        const m = rng.nonZero(-6, 6);
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        let x1 = rng.int(-4, 4);
        const y1 = rng.int(-4, 4);
        if (x1 === x0) x1 += 2;
        const ans = k * (x1 - x0) + m * (y1 - y0);
        return numberProblem({
          prompt: t(
            `$C$ is an arc of a parabola from $(${x0}, ${y0})$ to $(${x1}, ${y1})$. Evaluate $\\int_C ${poly([k, "\\,dx"], [m, "\\,dy"])}$.`,
            `$C$ 是从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的一段抛物线弧。计算 $\\int_C ${poly([k, "\\,dx"], [m, "\\,dy"])}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(-ans, "That uses start minus end; the changes are end minus start.", "那是用了起点减终点；变化量是终点减起点。"),
            why(
              k * (y1 - y0) + m * (x1 - x0),
              `That pairs $${k}$ with $\\Delta y$ and $${m}$ with $\\Delta x$; $${k}$ multiplies $dx$.`,
              `那是把 $${k}$ 配给了 $\\Delta y$，把 $${m}$ 配给了 $\\Delta x$；$${k}$ 乘的是 $dx$。`,
            ),
            why(
              k * x1 + m * y1,
              "That uses the coordinates of the end point; the integral needs the changes from start to end.",
              "那是用了终点的坐标；积分需要的是从起点到终点的变化量。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the changes", "求变化量"],
                t(
                  `$\\Delta x = ${x1} - ${paren(x0)} = ${x1 - x0}$ and $\\Delta y = ${y1} - ${paren(y0)} = ${y1 - y0}$.`,
                  `$\\Delta x = ${x1} - ${paren(x0)} = ${x1 - x0}$，$\\Delta y = ${y1} - ${paren(y0)} = ${y1 - y0}$。`,
                ),
              ],
              [
                ["Combine", "组合"],
                t(
                  `$${k} \\cdot ${paren(x1 - x0)} + ${paren(m)} \\cdot ${paren(y1 - y0)} = ${ans}$, whatever the shape of the arc.`,
                  `$${k} \\cdot ${paren(x1 - x0)} + ${paren(m)} \\cdot ${paren(y1 - y0)} = ${ans}$，与弧的形状无关。`,
                ),
              ],
            ],
            t(
              `Along the straight segment between the same points, $x' = ${x1 - x0}$ and $y' = ${y1 - y0}$ are constant, and $\\int_0^1 (${k} \\cdot ${paren(x1 - x0)} + ${paren(m)} \\cdot ${paren(y1 - y0)})\\,dt = ${ans}$ as well.`,
              `沿同样两点之间的直线段，$x' = ${x1 - x0}$、$y' = ${y1 - y0}$ 为常数，$\\int_0^1 (${k} \\cdot ${paren(x1 - x0)} + ${paren(m)} \\cdot ${paren(y1 - y0)})\\,dt = ${ans}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** sumsOfLineIntegralsWithRespectToXAndYOverParametricCurves integrates P dx + Q dy along parametric curves. */
export const sumsOfLineIntegralsWithRespectToXAndYOverParametricCurves: TopicDef = {
  id: "sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves",
  title: t("Sums of Line Integrals With Respect to X and Y Over Parametric Curves", "参数曲线上 P dx + Q dy 的曲线积分"),
  summary: t(
    "Along a parametric curve, $\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x, y)\\,x'(t) + Q(x, y)\\,y'(t)\\right] dt$.",
    "沿参数曲线，$\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x, y)\\,x'(t) + Q(x, y)\\,y'(t)\\right] dt$。",
  ),
  intro: t(
    "Find $\\int_C y\\,dx + x\\,dy$ along $x = t$, $y = t^3$, $0 \\le t \\le 1$. Here $dx = dt$ and $dy = 3t^2\\,dt$, so the integrand becomes $t^3 + t \\cdot 3t^2 = 4t^3$, and $\\int_0^1 4t^3\\,dt = 1$.\n\nCheck: $y\\,dx + x\\,dy$ is the change in $xy$, which goes from $0$ at $(0, 0)$ to $1$ at $(1, 1)$.\n\nIn this lesson we evaluate $\\int_C P\\,dx + Q\\,dy$ along parametric curves by substituting into both terms and adding before integrating.",
    "沿 $x = t$，$y = t^3$，$0 \\le t \\le 1$ 求 $\\int_C y\\,dx + x\\,dy$。这里 $dx = dt$，$dy = 3t^2\\,dt$，被积式变为 $t^3 + t \\cdot 3t^2 = 4t^3$，$\\int_0^1 4t^3\\,dt = 1$。\n\n检验：$y\\,dx + x\\,dy$ 是 $xy$ 的改变量，$xy$ 在 $(0, 0)$ 处为 $0$，在 $(1, 1)$ 处为 $1$。\n\n本课我们沿参数曲线计算 $\\int_C P\\,dx + Q\\,dy$：代入两项，相加后再积分。",
  ),
  prerequisites: ["properties-of-line-integrals-with-respect-to-x-and-y"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-p-dx-plus-q-dy-along-parametric-paths",
      title: t("Evaluating P dx + Q dy along parametric paths", "在参数路径上计算 P dx + Q dy 的曲线积分"),
      explanation: t(
        "Substitute the parametrization into both component functions and both differentials, which turns the line integral into an ordinary integral in the parameter. Substitute $x = x(t), dx = x'(t)dt$ and $y = y(t), dy = y'(t)dt$:\n\n$$\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x(t), y(t))x'(t) + Q(x(t), y(t))y'(t)\\right]dt.$$\n\nAlong the segment from $(0, 0)$ to $(1, 2)$, $x = t$, $y = 2t$, and $\\int_C 5y\\,dx + x\\,dy = \\int_0^1 (10t + 2t)\\,dt = 6$.\n\n> **Watch out.** Keep both terms: $P\\,dx$ uses $x'(t)$ and $Q\\,dy$ uses $y'(t)$. And $\\int_0^1 t\\,dt = \\frac{1}{2}$.",
        "把参数化代入两个分量函数和两个微分，就把曲线积分变成关于参数的普通积分。代入 $x = x(t), dx = x'(t)dt$ 与 $y = y(t), dy = y'(t)dt$：\n\n$$\\int_C (P\\,dx + Q\\,dy) = \\int_a^b \\left[P(x(t), y(t))x'(t) + Q(x(t), y(t))y'(t)\\right]dt$$\n\n沿从 $(0, 0)$ 到 $(1, 2)$ 的线段，$x = t$，$y = 2t$，$\\int_C 5y\\,dx + x\\,dy = \\int_0^1 (10t + 2t)\\,dt = 6$。\n\n> **注意。** 两项都要保留：$P\\,dx$ 用 $x'(t)$，$Q\\,dy$ 用 $y'(t)$。而 $\\int_0^1 t\\,dt = \\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        let b = rng.nonZero(-4, 4);
        while (a + b === 0) b = rng.nonZero(-4, 4);
        const xEnd = rng.int(1, 4);
        const yEnd = rng.int(1, 4);
        const num = (a + b) * xEnd * yEnd;
        const ans = Q.of(num, 2);
        const xy = xEnd * yEnd;
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C (${poly([a, "y\\,dx"], [b, "x\\,dy"])})$ along the segment from $(0, 0)$ to $(${xEnd}, ${yEnd})$.`,
            `计算曲线积分 $\\int_C (${poly([a, "y\\,dx"], [b, "x\\,dy"])})$，其中 $C$ 为从 $(0, 0)$ 到 $(${xEnd}, ${yEnd})$ 的线段。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(num, "That leaves out the $\\frac{1}{2}$ from $\\int_0^1 t\\,dt$.", "那是漏了 $\\int_0^1 t\\,dt$ 中的 $\\frac{1}{2}$。"),
            why(
              Q.of(a * xy, 2),
              "That keeps only the $y\\,dx$ term; the $x\\,dy$ term contributes too.",
              "那是只保留了 $y\\,dx$ 项；$x\\,dy$ 项也有贡献。",
            ),
            why(
              Q.of(b * xy, 2),
              "That keeps only the $x\\,dy$ term; the $y\\,dx$ term contributes too.",
              "那是只保留了 $x\\,dy$ 项；$y\\,dx$ 项也有贡献。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(
                  `$x = ${poly([xEnd, "t"])}$, $y = ${poly([yEnd, "t"])}$, $0 \\le t \\le 1$, so $dx = ${xEnd}\\,dt$ and $dy = ${yEnd}\\,dt$.`,
                  `$x = ${poly([xEnd, "t"])}$，$y = ${poly([yEnd, "t"])}$，$0 \\le t \\le 1$，所以 $dx = ${xEnd}\\,dt$，$dy = ${yEnd}\\,dt$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `$${poly([a, "y\\,dx"])}$ becomes $${poly([a * xy, "t"])}\\,dt$ and $${poly([b, "x\\,dy"])}$ becomes $${poly([b * xy, "t"])}\\,dt$, a total of $${poly([num, "t"])}\\,dt$.`,
                  `$${poly([a, "y\\,dx"])}$ 变为 $${poly([a * xy, "t"])}\\,dt$，$${poly([b, "x\\,dy"])}$ 变为 $${poly([b * xy, "t"])}\\,dt$，合计 $${poly([num, "t"])}\\,dt$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(`$\\int_0^1 ${poly([num, "t"])}\\,dt = ${ans.toLatex()}$.`, `$\\int_0^1 ${poly([num, "t"])}\\,dt = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `On a segment from the origin, $y$ averages $\\frac{${yEnd}}{2}$ while $x$ changes by $${xEnd}$, and $x$ averages $\\frac{${xEnd}}{2}$ while $y$ changes by $${yEnd}$, so each of $\\int_C y\\,dx$ and $\\int_C x\\,dy$ is $${Q.of(xy, 2).toLatex()}$, and $${a} \\cdot ${Q.of(xy, 2).toLatex()} + ${paren(b)} \\cdot ${Q.of(xy, 2).toLatex()} = ${ans.toLatex()}$.`,
              `在从原点出发的线段上，$x$ 变化 $${xEnd}$ 时 $y$ 的平均值为 $\\frac{${yEnd}}{2}$，$y$ 变化 $${yEnd}$ 时 $x$ 的平均值为 $\\frac{${xEnd}}{2}$，所以 $\\int_C y\\,dx$ 与 $\\int_C x\\,dy$ 都是 $${Q.of(xy, 2).toLatex()}$，$${a} \\cdot ${Q.of(xy, 2).toLatex()} + ${paren(b)} \\cdot ${Q.of(xy, 2).toLatex()} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "p-dx-plus-q-dy-along-a-sideways-parabola",
      title: t("$P\\,dx + Q\\,dy$ along $x = t^2$, $y = t$", "沿 $x = t^2$，$y = t$ 计算 $P\\,dx + Q\\,dy$"),
      explanation: t(
        "Substitute the parametrization into both terms and add before integrating. For $x = t^2$, $y = t$ we have $dx = 2t\\,dt$ and $dy = dt$, so\n\n$$\\int_C a\\,y^2\\,dx + b\\,x\\,dy = \\int_0^c (2a t^3 + b t^2)\\,dt = \\frac{ac^4}{2} + \\frac{bc^3}{3}.$$\n\nWith $a = 6$, $b = 1$ and $c = 1$ this is $3 + \\frac{1}{3} = \\frac{10}{3}$.\n\n> **Watch out.** $dx = 2t\\,dt$, not $dt$: $x = t^2$ is the coordinate that is squared. Dropping $2t$, or keeping $t$ but losing the $2$, gives a wrong first term.",
        "把参数化代入两项，相加后再积分。对 $x = t^2$，$y = t$，有 $dx = 2t\\,dt$，$dy = dt$，所以\n\n$$\\int_C a\\,y^2\\,dx + b\\,x\\,dy = \\int_0^c (2a t^3 + b t^2)\\,dt = \\frac{ac^4}{2} + \\frac{bc^3}{3}$$\n\n取 $a = 6$，$b = 1$，$c = 1$，得 $3 + \\frac{1}{3} = \\frac{10}{3}$。\n\n> **注意。** $dx = 2t\\,dt$，不是 $dt$：平方的是坐标 $x = t^2$。丢掉 $2t$，或保留 $t$ 却丢了 $2$，第一项都会出错。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.int(1, 3);
        const first = Q.of(a * c ** 4, 2);
        const second = Q.of(b * c ** 3, 3);
        const ans = first.add(second);
        return numberProblem({
          prompt: t(
            `$C$ is $x = t^2$, $y = t$, $0 \\le t \\le ${c}$. Evaluate $\\int_C ${poly([a, "y^2\\,dx"], [b, "x\\,dy"])}$.`,
            `$C$ 为 $x = t^2$，$y = t$，$0 \\le t \\le ${c}$。计算 $\\int_C ${poly([a, "y^2\\,dx"], [b, "x\\,dy"])}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a * c ** 3, 3).add(second),
              "That uses $dx = dt$; with $x = t^2$, $dx = 2t\\,dt$.",
              "那是用了 $dx = dt$；由 $x = t^2$，$dx = 2t\\,dt$。",
            ),
            why(
              Q.of(a * c ** 4, 4).add(second),
              "That uses $dx = t\\,dt$, losing the $2$ in $dx = 2t\\,dt$.",
              "那是用了 $dx = t\\,dt$，丢了 $dx = 2t\\,dt$ 中的 $2$。",
            ),
            why(
              first,
              "That keeps only the $y^2\\,dx$ term; the $x\\,dy$ term contributes too.",
              "那是只保留了 $y^2\\,dx$ 项；$x\\,dy$ 项也有贡献。",
            ),
          ]),
          solution: walked(
            [
              [["Find the differentials", "求微分"], t("$dx = 2t\\,dt$ and $dy = dt$.", "$dx = 2t\\,dt$，$dy = dt$。")],
              [
                ["Substitute", "代入"],
                t(
                  `$${poly([a, "y^2\\,dx"])} = ${poly([a, "t^2"])} \\cdot 2t\\,dt$ and $${poly([b, "x\\,dy"])} = ${poly([b, "t^2"])}\\,dt$, so the integrand is $${poly([2 * a, "t^3"], [b, "t^2"])}$.`,
                  `$${poly([a, "y^2\\,dx"])} = ${poly([a, "t^2"])} \\cdot 2t\\,dt$，$${poly([b, "x\\,dy"])} = ${poly([b, "t^2"])}\\,dt$，所以被积式为 $${poly([2 * a, "t^3"], [b, "t^2"])}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `From $0$ to $${c}$: $${first.toLatex()} + ${paren(second)} = ${ans.toLatex()}$.`,
                  `从 $0$ 积到 $${c}$：$${first.toLatex()} + ${paren(second)} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Term by term without $t$: on $y = \\sqrt{x}$, $\\int_0^{${c * c}} ${poly([a, "x"])}\\,dx = ${first.toLatex()}$, and on $x = y^2$, $\\int_0^{${c}} ${poly([b, "y^2"])}\\,dy = ${second.toLatex()}$.`,
              `不用 $t$ 逐项计算：在 $y = \\sqrt{x}$ 上 $\\int_0^{${c * c}} ${poly([a, "x"])}\\,dx = ${first.toLatex()}$，在 $x = y^2$ 上 $\\int_0^{${c}} ${poly([b, "y^2"])}\\,dy = ${second.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** sumsOfLineIntegralsWithRespectToXAndY integrates general differential forms. */
export const sumsOfLineIntegralsWithRespectToXAndY: TopicDef = {
  id: "sums-of-line-integrals-with-respect-to-x-and-y",
  title: t("Sums of Line Integrals With Respect to X and Y", "一般的 P dx + Q dy 曲线积分"),
  summary: t(
    "The sum $\\int_C P\\,dx + Q\\,dy$ measures the circulation, or tangential effect, of a plane force field along a curve.",
    "曲线积分 $\\int_C P\\,dx + Q\\,dy$ 度量平面力场沿曲线的环量，即切向作用。",
  ),
  intro: t(
    "Find $\\int_C y^2\\,dx + x\\,dy$ along the path from $(0, 0)$ to $(2, 0)$ and then to $(2, 3)$. On the horizontal piece $y = 0$ and $dy = 0$, so the integrand $y^2\\,dx$ is $0$. On the vertical piece $x = 2$ and $dx = 0$, leaving $\\int_0^3 2\\,dy = 6$. The total is $6$.\n\nCheck: parametrize the vertical piece as $(2, 3t)$, $0 \\le t \\le 1$; then $dx = 0$, $dy = 3\\,dt$ and $\\int_0^1 2 \\cdot 3\\,dt = 6$.\n\nIn this lesson we evaluate $\\int_C P\\,dx + Q\\,dy$ along paths made of segments, using $dy = 0$ on horizontal pieces and $dx = 0$ on vertical ones.",
    "沿从 $(0, 0)$ 到 $(2, 0)$ 再到 $(2, 3)$ 的路径求 $\\int_C y^2\\,dx + x\\,dy$。水平段上 $y = 0$，$dy = 0$，被积式 $y^2\\,dx$ 为 $0$。竖直段上 $x = 2$，$dx = 0$，剩下 $\\int_0^3 2\\,dy = 6$。合计 $6$。\n\n检验：把竖直段参数化为 $(2, 3t)$，$0 \\le t \\le 1$；则 $dx = 0$，$dy = 3\\,dt$，$\\int_0^1 2 \\cdot 3\\,dt = 6$。\n\n本课我们沿由线段组成的路径计算 $\\int_C P\\,dx + Q\\,dy$，在水平段上用 $dy = 0$，在竖直段上用 $dx = 0$。",
  ),
  prerequisites: ["sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves"],
  encompasses: [
    {
      topic: "sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-differential-forms-along-line-segments",
      title: t("Integrating differential forms along line segments", "在线段上积分微分形式"),
      explanation: t(
        "On a horizontal segment the vertical coordinate does not change, so that part of the integral vanishes, and similarly for vertical segments. Along horizontal segments $y = c$, $dy = 0$, so $\\int_C (P\\,dx + Q\\,dy) = \\int P(x, c)\\,dx$. Along vertical segments $x = c$, $dx = 0$, so $\\int_C (P\\,dx + Q\\,dy) = \\int Q(c, y)\\,dy$. Along $y = 2$ from $(1, 2)$ to $(7, 2)$, $\\int_C 4x\\,dx = 2(49 - 1) = 96$.\n\n> **Watch out.** The antiderivative of $x$ is $\\frac{x^2}{2}$, evaluated as $\\frac{x_2^2 - x_1^2}{2}$; this is not $\\frac{(x_2 - x_1)^2}{2}$.",
        "在水平线段上竖直坐标不变，所以积分中相应的部分为零；竖直线段也是如此。在水平线段 $y = c$ 上，$dy = 0$，故 $\\int_C (P\\,dx + Q\\,dy) = \\int P(x, c)\\,dx$。在垂直线段 $x = c$ 上，$dx = 0$，故 $\\int_C (P\\,dx + Q\\,dy) = \\int Q(c, y)\\,dy$。沿 $y = 2$ 从 $(1, 2)$ 到 $(7, 2)$，$\\int_C 4x\\,dx = 2(49 - 1) = 96$。\n\n> **注意。** $x$ 的原函数是 $\\frac{x^2}{2}$，代值得 $\\frac{x_2^2 - x_1^2}{2}$；它不是 $\\frac{(x_2 - x_1)^2}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const x1 = rng.int(0, 3);
        const x2 = x1 + rng.int(1, 5);
        const y0 = rng.int(1, 5);
        const a = rng.nonZero(-3, 3);
        const num = a * (x2 * x2 - x1 * x1);
        const ans = Q.of(num, 2);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C ${poly([a, "x"])}\\,dx$ along the horizontal line segment $C$ from $(${x1}, ${y0})$ to $(${x2}, ${y0})$.`,
            `计算 $\\int_C ${poly([a, "x"])}\\,dx$ 的值，其中 $C$ 为从 $(${x1}, ${y0})$ 到 $(${x2}, ${y0})$ 的水平线段。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              num,
              "That leaves out the $\\frac{1}{2}$ of the antiderivative $\\frac{x^2}{2}$.",
              "那是漏了原函数 $\\frac{x^2}{2}$ 中的 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(a * (x2 - x1) ** 2, 2),
              `That uses $\\frac{(${x2} - ${x1})^2}{2}$; the antiderivative gives $\\frac{${x2}^2 - ${x1}^2}{2}$.`,
              `那是用了 $\\frac{(${x2} - ${x1})^2}{2}$；原函数给出 $\\frac{${x2}^2 - ${x1}^2}{2}$。`,
            ),
            why(
              a * y0 * (x2 - x1),
              `That puts $y = ${y0}$ in place of $x$; the integrand is $${poly([a, "x"])}$, and $x$ varies along the segment.`,
              `那是用 $y = ${y0}$ 代替了 $x$；被积函数是 $${poly([a, "x"])}$，$x$ 沿线段变化。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Use $y$ constant", "利用 $y$ 为常数"],
                t(
                  `On $y = ${y0}$, $dy = 0$ and $x$ runs from $${x1}$ to $${x2}$.`,
                  `在 $y = ${y0}$ 上，$dy = 0$，$x$ 从 $${x1}$ 变到 $${x2}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_{${x1}}^{${x2}} ${poly([a, "x"])}\\,dx = ${coef(a)}\\frac{${x2 * x2} - ${x1 * x1}}{2} = ${ans.toLatex()}$.`,
                  `$\\int_{${x1}}^{${x2}} ${poly([a, "x"])}\\,dx = ${coef(a)}\\frac{${x2 * x2} - ${x1 * x1}}{2} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$x$ averages $${Q.of(x1 + x2, 2).toLatex()}$ along the segment and changes by $${x2 - x1}$, so the integral is $${a} \\cdot ${Q.of(x1 + x2, 2).toLatex()} \\cdot ${x2 - x1} = ${ans.toLatex()}$.`,
              `$x$ 沿线段的平均值为 $${Q.of(x1 + x2, 2).toLatex()}$，变化量为 $${x2 - x1}$，所以积分为 $${a} \\cdot ${Q.of(x1 + x2, 2).toLatex()} \\cdot ${x2 - x1} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "p-dx-plus-q-dy-along-a-two-segment-path",
      figure: multivariableDrawings5["sums-of-line-integrals-with-respect-to-x-and-y#p-dx-plus-q-dy-along-a-two-segment-path"],
      title: t("$P\\,dx + Q\\,dy$ along a two-segment path", "沿两段折线计算 $P\\,dx + Q\\,dy$"),
      explanation: t(
        "Split a polygonal path into segments. On a horizontal segment $dy = 0$, so only the $P\\,dx$ term survives, with $y$ held fixed. On a vertical segment $dx = 0$, so only $Q\\,dy$ survives, with $x$ held fixed. For $\\int_C p\\,y\\,dx + q\\,x\\,dy$ two paths between the same points can give different values, because the field $\\langle py, qx \\rangle$ is conservative only when $p = q$. From $(0, 0)$ to $(3, 0)$ to $(3, 1)$, $\\int_C 7y\\,dx + 2x\\,dy = 0 + \\int_0^1 6\\,dy = 6$.\n\n> **Watch out.** On each piece, put in the value of the fixed coordinate there. On a vertical piece at $x = a$, $x$ is $a$, not $0$, and a piece along an axis can contribute $0$.",
        "把折线路径拆成线段。水平线段上 $dy = 0$，只剩 $P\\,dx$ 项且 $y$ 固定；竖直线段上 $dx = 0$，只剩 $Q\\,dy$ 项且 $x$ 固定。对 $\\int_C p\\,y\\,dx + q\\,x\\,dy$，同样端点之间的两条路径可能给出不同的值，因为场 $\\langle py, qx \\rangle$ 只有在 $p = q$ 时才是保守的。从 $(0, 0)$ 到 $(3, 0)$ 再到 $(3, 1)$，$\\int_C 7y\\,dx + 2x\\,dy = 0 + \\int_0^1 6\\,dy = 6$。\n\n> **注意。** 每一段都要代入该段上固定坐标的值。在 $x = a$ 的竖直段上 $x$ 等于 $a$，不是 $0$；沿坐标轴的一段可能贡献 $0$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-5, 5);
        let q = rng.nonZero(-5, 5);
        if (q === p) q = -p;
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const rightFirst = rng.int(0, 1) === 0;
        const ans = rightFirst ? q * a * b : p * a * b;
        const mid = rightFirst ? `(${a}, 0)` : `(0, ${b})`;
        return numberProblem({
          prompt: t(
            `$C$ goes along segments from $(0, 0)$ to $${mid}$ to $(${a}, ${b})$. Evaluate $\\int_C ${poly([p, "y\\,dx"], [q, "x\\,dy"])}$.`,
            `$C$ 沿线段从 $(0, 0)$ 到 $${mid}$ 再到 $(${a}, ${b})$。计算 $\\int_C ${poly([p, "y\\,dx"], [q, "x\\,dy"])}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              rightFirst ? p * a * b : q * a * b,
              "That is the value along the other path, through the other corner; the field is not conservative, so the path matters.",
              "那是沿另一条经过另一个拐角的路径的值；这个场不是保守场，路径有关系。",
            ),
            why(
              (p + q) * a * b,
              "That counts both terms on the second piece; there only one of $dx$, $dy$ is nonzero.",
              "那是在第二段上把两项都算了；那里 $dx$、$dy$ 只有一个不为零。",
            ),
            why(
              0,
              rightFirst
                ? `That sets $x = 0$ on the vertical piece; there $x = ${a}$.`
                : `That sets $y = 0$ on the horizontal piece; there $y = ${b}$.`,
              rightFirst ? `那是在竖直段上令 $x = 0$；那里 $x = ${a}$。` : `那是在水平段上令 $y = 0$；那里 $y = ${b}$。`,
            ),
          ]),
          solution: rightFirst
            ? walked(
                [
                  [["The horizontal piece", "水平段"], t("$y = 0$ and $dy = 0$, so it contributes $0$.", "$y = 0$，$dy = 0$，贡献 $0$。")],
                  [
                    ["The vertical piece", "竖直段"],
                    t(
                      `$x = ${a}$ and $dx = 0$: $\\int_0^{${b}} ${paren(q)} \\cdot ${a}\\,dy = ${ans}$.`,
                      `$x = ${a}$，$dx = 0$：$\\int_0^{${b}} ${paren(q)} \\cdot ${a}\\,dy = ${ans}$。`,
                    ),
                  ],
                ],
                t(
                  `With $\\mathbf{r}(t) = (${a}, ${poly([b, "t"])})$ on the vertical piece, $dx = 0$, $dy = ${b}\\,dt$, and $\\int_0^1 ${paren(q)} \\cdot ${a} \\cdot ${b}\\,dt = ${ans}$.`,
                  `竖直段取 $\\mathbf{r}(t) = (${a}, ${poly([b, "t"])})$，$dx = 0$，$dy = ${b}\\,dt$，$\\int_0^1 ${paren(q)} \\cdot ${a} \\cdot ${b}\\,dt = ${ans}$。`,
                ),
              )
            : walked(
                [
                  [["The vertical piece", "竖直段"], t("$x = 0$ and $dx = 0$, so it contributes $0$.", "$x = 0$，$dx = 0$，贡献 $0$。")],
                  [
                    ["The horizontal piece", "水平段"],
                    t(
                      `$y = ${b}$ and $dy = 0$: $\\int_0^{${a}} ${paren(p)} \\cdot ${b}\\,dx = ${ans}$.`,
                      `$y = ${b}$，$dy = 0$：$\\int_0^{${a}} ${paren(p)} \\cdot ${b}\\,dx = ${ans}$。`,
                    ),
                  ],
                ],
                t(
                  `With $\\mathbf{r}(t) = (${poly([a, "t"])}, ${b})$ on the horizontal piece, $dy = 0$, $dx = ${a}\\,dt$, and $\\int_0^1 ${paren(p)} \\cdot ${b} \\cdot ${a}\\,dt = ${ans}$.`,
                  `水平段取 $\\mathbf{r}(t) = (${poly([a, "t"])}, ${b})$，$dy = 0$，$dx = ${a}\\,dt$，$\\int_0^1 ${paren(p)} \\cdot ${b} \\cdot ${a}\\,dt = ${ans}$。`,
                ),
              ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.21 Line Integrals of Vector-Valued Functions
// ---------------------------------------------------------------------------

/** piText writes a rational multiple of pi: "\pi", "-3\pi", "\frac{3\pi}{2}". */
const piText = (q: Q): string => {
  const sign = q.sign() < 0 ? "-" : "";
  const n = q.n < 0n ? -q.n : q.n;
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  return q.d === 1n ? `${sign}${top}` : `${sign}\\frac{${top}}{${q.d}}`;
};

/** parenQ puts a negative rational number in parentheses, for use inside a sum or product. */
const parenQ = (q: Q): string => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** lineIntegralsOfVectorValuedFunctionsOverParametricCurves computes work integrals ∫ F · dr. */
export const lineIntegralsOfVectorValuedFunctionsOverParametricCurves: TopicDef = {
  id: "line-integrals-of-vector-valued-functions-over-parametric-curves",
  title: t("Line Integrals of Vector-Valued Functions Over Parametric Curves", "参数曲线上的向量线积分"),
  summary: t(
    "The line integral of a vector field $\\mathbf{F}$ along a curve $\\mathbf{r}(t)$ is $\\int_a^b \\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\,dt$.",
    "向量场 $\\mathbf{F}$ 沿参数曲线 $\\mathbf{r}(t)$ 的线积分为 $\\int_a^b \\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\,dt$。",
  ),
  intro: t(
    "Find $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle y, x \\rangle$ along $\\mathbf{r}(t) = \\langle t^2, t^3 \\rangle$, $0 \\le t \\le 1$. The velocity is $\\mathbf{r}'(t) = \\langle 2t, 3t^2 \\rangle$, and on the curve $\\mathbf{F}(\\mathbf{r}(t)) = \\langle t^3, t^2 \\rangle$. Their dot product is $t^3 \\cdot 2t + t^2 \\cdot 3t^2 = 5t^4$, and $\\int_0^1 5t^4\\,dt = 1$.\n\nCheck: the integrand $y\\,dx + x\\,dy$ is the differential of $xy$, which rises from $0$ at $(0, 0)$ to $1$ at $(1, 1)$, so the integral is $1$.\n\nIn this lesson we evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ by substituting the parametrization into $\\mathbf{F}$, taking the dot product with $\\mathbf{r}'(t)$ and integrating in $t$.",
    "对 $\\mathbf{F} = \\langle y, x \\rangle$，沿 $\\mathbf{r}(t) = \\langle t^2, t^3 \\rangle$，$0 \\le t \\le 1$，求 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。速度为 $\\mathbf{r}'(t) = \\langle 2t, 3t^2 \\rangle$，在曲线上 $\\mathbf{F}(\\mathbf{r}(t)) = \\langle t^3, t^2 \\rangle$。两者的点积是 $t^3 \\cdot 2t + t^2 \\cdot 3t^2 = 5t^4$，而 $\\int_0^1 5t^4\\,dt = 1$。\n\n检验：被积式 $y\\,dx + x\\,dy$ 是 $xy$ 的微分，$xy$ 从 $(0, 0)$ 处的 $0$ 增加到 $(1, 1)$ 处的 $1$，所以积分是 $1$。\n\n本课我们计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$：把参数化代入 $\\mathbf{F}$，与 $\\mathbf{r}'(t)$ 作点积，再对 $t$ 积分。",
  ),
  prerequisites: ["vector-fields", "sums-of-line-integrals-with-respect-to-x-and-y"],
  encompasses: [
    { topic: "vector-fields", weight: 0.3 },
    {
      topic: "sums-of-line-integrals-with-respect-to-x-and-y",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "vector-line-integral-as-dot-product-with-velocity",
      title: t("Vector line integral as dot product with velocity", "向量场与速度向量的点积线积分"),
      explanation: t(
        "The integral adds up how much the field pushes along the direction of motion, which is its dot product with the velocity of the curve. To evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$, compute the velocity $\\mathbf{r}'(t)$, evaluate $\\mathbf{F}(\\mathbf{r}(t))$, and integrate the scalar product:\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\left[\\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\right]dt.$$\n\nFor $\\mathbf{F} = \\langle x, y \\rangle$ along $\\mathbf{r}(t) = \\langle t, t^2 \\rangle$, $0 \\le t \\le 2$: $\\mathbf{r}'(t) = \\langle 1, 2t \\rangle$, the integrand is $t \\cdot 1 + t^2 \\cdot 2t = t + 2t^3$, and the integral is $2 + 8 = 10$.\n\n> **Watch out.** Each component of $\\mathbf{F}$ multiplies the matching component of $\\mathbf{r}'(t)$: the second component goes with $y' = 2t$, not with $1$. Integrating $\\mathbf{F}(\\mathbf{r}(t))$ without the velocity is the usual error.",
        "这个积分累加向量场沿运动方向推动的程度，也就是它与曲线速度的点积。计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 时，先求速度向量 $\\mathbf{r}'(t)$，代入 $\\mathbf{F}(\\mathbf{r}(t))$ 并对两者的点积求定积分：\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_a^b \\left[\\mathbf{F}(\\mathbf{r}(t)) \\cdot \\mathbf{r}'(t)\\right]dt$$\n\n对 $\\mathbf{F} = \\langle x, y \\rangle$，沿 $\\mathbf{r}(t) = \\langle t, t^2 \\rangle$，$0 \\le t \\le 2$：$\\mathbf{r}'(t) = \\langle 1, 2t \\rangle$，被积函数是 $t \\cdot 1 + t^2 \\cdot 2t = t + 2t^3$，积分为 $2 + 8 = 10$。\n\n> **注意。** $\\mathbf{F}$ 的每个分量乘以 $\\mathbf{r}'(t)$ 的对应分量：第二个分量配 $y' = 2t$，不是配 $1$。不乘速度就直接积分 $\\mathbf{F}(\\mathbf{r}(t))$ 是常见错误。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const T = rng.int(1, 4);

        // Path: r(t) = (t, t^2) for 0 <= t <= T, r'(t) = (1, 2t).
        // F(r(t)) = (a t^2, b t), so F · r' = (a + 2b) t^2 and the integral is (a + 2b) T^3 / 3.
        const num = (a + 2 * b) * T ** 3;
        const ans = Q.of(num, 3);
        const integrand = poly([a + 2 * b, "t^2"]);
        const first = Q.of(a * T ** 3, 3);
        const second = Q.of(2 * b * T ** 3, 3);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F}(x, y) = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ along the parabola $\\mathbf{r}(t) = \\langle t, t^2 \\rangle$ for $0 \\le t \\le ${T}$.`,
            `计算向量线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F}(x, y) = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$，曲线为抛物线 $\\mathbf{r}(t) = \\langle t, t^2 \\rangle$（$0 \\le t \\le ${T}$）。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a * T ** 3, 3).add(Q.of(b * T * T, 2)),
              "That integrates the components of $\\mathbf{F}(\\mathbf{r}(t))$ without the velocity; the second one must be multiplied by $y' = 2t$.",
              "那是没有乘速度就积分 $\\mathbf{F}(\\mathbf{r}(t))$ 的分量；第二个分量要乘以 $y' = 2t$。",
            ),
            why(
              Q.of((a + b) * T ** 3, 3),
              "That uses $y' = t$; the derivative of $t^2$ is $2t$.",
              "那是用了 $y' = t$；$t^2$ 的导数是 $2t$。",
            ),
            why(
              num,
              "That takes $t^3$ as the antiderivative of $t^2$; it is $\\frac{t^3}{3}$.",
              "那是把 $t^3$ 当成 $t^2$ 的原函数；应为 $\\frac{t^3}{3}$。",
            ),
            why(
              ans.neg(),
              `That has the sign reversed; the curve runs from $t = 0$ up to $t = ${T}$.`,
              `那是符号反了；曲线从 $t = 0$ 走到 $t = ${T}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the velocity", "求速度"],
                t("$\\mathbf{r}'(t) = \\langle 1, 2t \\rangle$.", "$\\mathbf{r}'(t) = \\langle 1, 2t \\rangle$。"),
              ],
              [
                ["Substitute into the field", "代入向量场"],
                t(
                  `$\\mathbf{F}(\\mathbf{r}(t)) = \\langle ${poly([a, "t^2"])}, ${poly([b, "t"])} \\rangle$.`,
                  `$\\mathbf{F}(\\mathbf{r}(t)) = \\langle ${poly([a, "t^2"])}, ${poly([b, "t"])} \\rangle$。`,
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                t(
                  `$(${poly([a, "t^2"])}) \\cdot 1 + (${poly([b, "t"])}) \\cdot 2t = ${integrand}$.`,
                  `$(${poly([a, "t^2"])}) \\cdot 1 + (${poly([b, "t"])}) \\cdot 2t = ${integrand}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{${T}} ${integrand}\\,dt = \\frac{${a + 2 * b} \\cdot ${T ** 3}}{3} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${T}} ${integrand}\\,dt = \\frac{${a + 2 * b} \\cdot ${T ** 3}}{3} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Split it as $\\int_C ${poly([a, "y\\,dx"], [b, "x\\,dy"])}$ with $x = t$, $y = t^2$: the first part is $\\int_0^{${T}} ${poly([a, "t^2"])}\\,dt = ${first.toLatex()}$, the second is $\\int_0^{${T}} ${poly([2 * b, "t^2"])}\\,dt = ${second.toLatex()}$, and $${first.toLatex()} + ${parenQ(second)} = ${ans.toLatex()}$.`,
              `拆成 $\\int_C ${poly([a, "y\\,dx"], [b, "x\\,dy"])}$，其中 $x = t$，$y = t^2$：第一部分是 $\\int_0^{${T}} ${poly([a, "t^2"])}\\,dt = ${first.toLatex()}$，第二部分是 $\\int_0^{${T}} ${poly([2 * b, "t^2"])}\\,dt = ${second.toLatex()}$，而 $${first.toLatex()} + ${parenQ(second)} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-rotational-field-along-a-circular-arc",
      figure:
        multivariableDrawings6["line-integrals-of-vector-valued-functions-over-parametric-curves#a-rotational-field-along-a-circular-arc"],
      title: t("A rotational field along a circular arc", "旋转场沿圆弧的线积分"),
      explanation: t(
        "To evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$, substitute the parametrization into the field, take the dot product with the velocity, and integrate in $t$. For $\\mathbf{r}(t) = (R\\cos t, R\\sin t)$, $\\mathbf{r}'(t) = (-R\\sin t, R\\cos t)$. The field $\\mathbf{F} = \\langle -ay, ax \\rangle$ at $\\mathbf{r}(t)$ is $(-aR\\sin t, aR\\cos t)$, so\n\n$$\\mathbf{F} \\cdot \\mathbf{r}'(t) = aR^2(\\sin^2 t + \\cos^2 t) = aR^2,$$\n\na constant. Over $0 \\le t \\le \\theta$ the integral is $aR^2\\theta$. For $\\mathbf{F} = \\langle -2y, 2x \\rangle$ on the circle of radius $3$ from $t = 0$ to $t = \\frac{\\pi}{4}$, the integrand is $2 \\cdot 9 = 18$ and the integral is $18 \\cdot \\frac{\\pi}{4} = \\frac{9\\pi}{2}$.\n\n> **Watch out.** The radius is squared: one factor $R$ comes from the field and one from the velocity. The first product $(-aR\\sin t)(-R\\sin t)$ is positive, so for $a > 0$ the integral is positive.",
        "计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 时，把参数化代入场，与速度作点积，再对 $t$ 积分。对 $\\mathbf{r}(t) = (R\\cos t, R\\sin t)$，$\\mathbf{r}'(t) = (-R\\sin t, R\\cos t)$。场 $\\mathbf{F} = \\langle -ay, ax \\rangle$ 在 $\\mathbf{r}(t)$ 处为 $(-aR\\sin t, aR\\cos t)$，所以\n\n$$\\mathbf{F} \\cdot \\mathbf{r}'(t) = aR^2(\\sin^2 t + \\cos^2 t) = aR^2,$$\n\n为常数。在 $0 \\le t \\le \\theta$ 上积分为 $aR^2\\theta$。对 $\\mathbf{F} = \\langle -2y, 2x \\rangle$，在半径为 $3$ 的圆上从 $t = 0$ 到 $t = \\frac{\\pi}{4}$，被积函数是 $2 \\cdot 9 = 18$，积分为 $18 \\cdot \\frac{\\pi}{4} = \\frac{9\\pi}{2}$。\n\n> **注意。** 半径要平方：一个因子 $R$ 来自场，另一个来自速度。第一个乘积 $(-aR\\sin t)(-R\\sin t)$ 是正的，所以 $a > 0$ 时积分为正。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const R = rng.int(1, 4);
        const [num, den] = rng.pick([
          [1, 2],
          [1, 1],
          [3, 2],
          [2, 1],
          [1, 3],
          [2, 3],
        ] as const);
        const theta =
          num === 1 && den === 1 ? "\\pi" : num === 1 ? `\\frac{\\pi}{${den}}` : den === 1 ? `${num}\\pi` : `\\frac{${num}\\pi}{${den}}`;
        const ans = Q.of(a * R * R * num, den);
        const F = `\\langle ${poly([-a, "y"])}, ${poly([a, "x"])} \\rangle`;
        const r = R === 1 ? "" : `${R}`;
        const aR2 = a * R * R;
        return numberProblem({
          prompt: t(
            `Let $\\mathbf{F} = ${F}$ and $\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$, $0 \\le t \\le ${theta}$. Find $\\frac{1}{\\pi}\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$.`,
            `设 $\\mathbf{F} = ${F}$，$\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$，$0 \\le t \\le ${theta}$。求 $\\frac{1}{\\pi}\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(a * R * num, den),
              "That uses $R$ instead of $R^2$; one factor $R$ comes from the field and one from the velocity.",
              "那是用了 $R$ 而不是 $R^2$；一个因子 $R$ 来自场，另一个来自速度。",
            ),
            why(
              ans.neg(),
              "That loses the sign of $(-aR\\sin t)(-R\\sin t)$, which is a product of two negatives.",
              "那是弄错了 $(-aR\\sin t)(-R\\sin t)$ 的符号，它是两个负因子的乘积。",
            ),
            why(
              Q.of(aR2),
              `That is the integrand $aR^2$ alone; it must be multiplied by the length of the interval, $${theta}$.`,
              `那只是被积函数 $aR^2$；还要乘以区间长度 $${theta}$。`,
            ),
            why(
              Q.of(2 * aR2 * num, den),
              "That counts $\\sin^2 t + \\cos^2 t$ as $2$; it equals $1$.",
              "那是把 $\\sin^2 t + \\cos^2 t$ 当成了 $2$；它等于 $1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the velocity", "求速度"],
                t(`$\\mathbf{r}'(t) = (-${r}\\sin t, ${r}\\cos t)$.`, `$\\mathbf{r}'(t) = (-${r}\\sin t, ${r}\\cos t)$。`),
              ],
              [
                ["Substitute into the field", "代入向量场"],
                t(
                  `$\\mathbf{F}(\\mathbf{r}(t)) = (${poly([-a * R, "\\sin t"])}, ${poly([a * R, "\\cos t"])})$.`,
                  `$\\mathbf{F}(\\mathbf{r}(t)) = (${poly([-a * R, "\\sin t"])}, ${poly([a * R, "\\cos t"])})$。`,
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                t(
                  `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${coef(aR2)}(\\sin^2 t + \\cos^2 t) = ${aR2}$, a constant.`,
                  `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${coef(aR2)}(\\sin^2 t + \\cos^2 t) = ${aR2}$，是常数。`,
                ),
              ],
              [
                ["Integrate and divide by π", "积分后除以 π"],
                t(
                  `$\\int_0^{${theta}} ${paren(aR2)}\\,dt = ${piText(ans)}$, and dividing by $\\pi$ gives $${ans.toLatex()}$.`,
                  `$\\int_0^{${theta}} ${paren(aR2)}\\,dt = ${piText(ans)}$，除以 $\\pi$ 得 $${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `On the circle the field has length $${Math.abs(a * R)}$ and is tangent to it, so $\\mathbf{F} \\cdot \\mathbf{T} = ${a * R}$; the arc has length ${R === 1 ? `$${theta}$` : `$${R} \\cdot ${theta}$`}, and the product is again $${piText(ans)}$.`,
              `在圆上场的长度为 $${Math.abs(a * R)}$ 且与圆相切，所以 $\\mathbf{F} \\cdot \\mathbf{T} = ${a * R}$；弧长为 ${R === 1 ? `$${theta}$` : `$${R} \\cdot ${theta}$`}，乘积同样是 $${piText(ans)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lineIntegralsOfVectorValuedFunctionsOverGeneralCurves integrates over curves like line segments and parabolas. */
export const lineIntegralsOfVectorValuedFunctionsOverGeneralCurves: TopicDef = {
  id: "line-integrals-of-vector-valued-functions-over-general-curves",
  title: t("Line Integrals of Vector-Valued Functions Over General Curves", "一般曲线上的第二类向量线积分"),
  summary: t(
    "Vector line integrals over explicit Cartesian curves y = g(x) use parametrization r(x) = ⟨x, g(x)⟩ with dr = ⟨1, g'(x)⟩ dx.",
    "显式平面曲线 y = g(x) 上的向量线积分采用标准参数化 r(x) = ⟨x, g(x)⟩ 与 dr = ⟨1, g'(x)⟩ dx 进行计算。",
  ),
  intro: t(
    "Find $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle x^2, y \\rangle$ along $y = x^3$ from $(0, 0)$ to $(1, 1)$. Use $x$ as the parameter: $dy = 3x^2\\,dx$, so the integrand is $x^2 + x^3 \\cdot 3x^2 = x^2 + 3x^5$. Then $\\int_0^1 (x^2 + 3x^5)\\,dx = \\frac{1}{3} + \\frac{1}{2} = \\frac{5}{6}$.\n\nCheck: $x^2\\,dx + y\\,dy$ is the differential of $\\frac{x^3}{3} + \\frac{y^2}{2}$, which goes from $0$ to $\\frac{1}{3} + \\frac{1}{2} = \\frac{5}{6}$.\n\nIn this lesson we evaluate vector line integrals along graphs, using one coordinate as the parameter and writing the other coordinate and its differential in terms of it.",
    "对 $\\mathbf{F} = \\langle x^2, y \\rangle$，沿 $y = x^3$ 从 $(0, 0)$ 到 $(1, 1)$，求 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。以 $x$ 为参数：$dy = 3x^2\\,dx$，所以被积式是 $x^2 + x^3 \\cdot 3x^2 = x^2 + 3x^5$。于是 $\\int_0^1 (x^2 + 3x^5)\\,dx = \\frac{1}{3} + \\frac{1}{2} = \\frac{5}{6}$。\n\n检验：$x^2\\,dx + y\\,dy$ 是 $\\frac{x^3}{3} + \\frac{y^2}{2}$ 的微分，它从 $0$ 变到 $\\frac{1}{3} + \\frac{1}{2} = \\frac{5}{6}$。\n\n本课我们沿函数图像计算向量线积分：用一个坐标作参数，把另一个坐标及其微分用它表示。",
  ),
  prerequisites: ["line-integrals-of-vector-valued-functions-over-parametric-curves"],
  encompasses: [
    {
      topic: "line-integrals-of-vector-valued-functions-over-parametric-curves",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-vector-line-integrals-over-parabolic-paths",
      title: t("Evaluating vector line integrals over parabolic paths", "在抛物线路径上计算向量线积分"),
      explanation: t(
        "Use the horizontal variable as the parameter, write the vertical coordinate and its differential in terms of it, and integrate the resulting single variable function. Along $y = cx^2$ from $x = 0$ to $x = a$, with $\\mathbf{F} = \\langle y, x \\rangle$:\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^a \\left[cx^2(1) + x(2cx)\\right]dx = \\int_0^a 3cx^2\\,dx = ca^3.$$\n\nAlong $y = 7x^2$ from $(0, 0)$ to $(1, 7)$, the integrand is $7x^2 + x \\cdot 14x = 21x^2$, and the integral is $7$.\n\n> **Watch out.** On $y = cx^2$, $dy = 2cx\\,dx$, with the factor $c$, and the $y$ in the first component becomes $cx^2$. The limits are values of $x$.",
        "用水平变量作为参数，把竖直坐标及其微分用它表示，再积分所得的一元函数。沿抛物线 $y = cx^2$ 从 $x = 0$ 到 $x = a$，对于 $\\mathbf{F} = \\langle y, x \\rangle$：\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^a \\left[cx^2(1) + x(2cx)\\right]dx = \\int_0^a 3cx^2\\,dx = ca^3$$\n\n沿 $y = 7x^2$ 从 $(0, 0)$ 到 $(1, 7)$，被积式是 $7x^2 + x \\cdot 14x = 21x^2$，积分为 $7$。\n\n> **注意。** 在 $y = cx^2$ 上，$dy = 2cx\\,dx$，带有因子 $c$；第一个分量中的 $y$ 变成 $cx^2$。积分限是 $x$ 的值。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 6);
        const a = rng.int(1, 6);
        const ans = c * a * a * a;
        return numberProblem({
          prompt: t(
            `Evaluate the line integral $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F}(x, y) = \\langle y, x \\rangle$ along the parabola $y = ${poly([c, "x^2"])}$ from $(0, 0)$ to $(${a}, ${c * a * a})$.`,
            `计算向量线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$，其中 $\\mathbf{F}(x, y) = \\langle y, x \\rangle$，路径 $C$ 为抛物线 $y = ${poly([c, "x^2"])}$ 从 $(0, 0)$ 到 $(${a}, ${c * a * a})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(c * a ** 3, 3),
              "That keeps only the $y\\,dx$ term; along the parabola $dy$ is not $0$, so $x\\,dy$ contributes too.",
              "那是只保留了 $y\\,dx$ 项；沿抛物线 $dy$ 不为 $0$，$x\\,dy$ 也有贡献。",
            ),
            why(
              Q.of((c + 2) * a ** 3, 3),
              `That uses $dy = 2x\\,dx$; on $y = ${poly([c, "x^2"])}$, $dy = ${poly([2 * c, "x"])}\\,dx$.`,
              `那是用了 $dy = 2x\\,dx$；在 $y = ${poly([c, "x^2"])}$ 上，$dy = ${poly([2 * c, "x"])}\\,dx$。`,
            ),
            why(
              Q.of(c * a ** 3, 3).add(Q.of(a * a, 2)),
              "That writes $dy$ as $dx$; the derivative of the curve must be included.",
              "那是把 $dy$ 写成了 $dx$；要乘上曲线的导数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize by x", "以 x 为参数"],
                t(
                  `$\\mathbf{r}(x) = \\langle x, ${poly([c, "x^2"])} \\rangle$, so $d\\mathbf{r} = \\langle 1, ${poly([2 * c, "x"])} \\rangle\\,dx$.`,
                  `$\\mathbf{r}(x) = \\langle x, ${poly([c, "x^2"])} \\rangle$，所以 $d\\mathbf{r} = \\langle 1, ${poly([2 * c, "x"])} \\rangle\\,dx$。`,
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                t(
                  `$${poly([c, "x^2"])} \\cdot 1 + x \\cdot ${poly([2 * c, "x"])} = ${poly([3 * c, "x^2"])}$.`,
                  `$${poly([c, "x^2"])} \\cdot 1 + x \\cdot ${poly([2 * c, "x"])} = ${poly([3 * c, "x^2"])}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{${a}} ${poly([3 * c, "x^2"])}\\,dx = ${coef(c)}x^3 \\Big|_0^{${a}} = ${ans}$.`,
                  `$\\int_0^{${a}} ${poly([3 * c, "x^2"])}\\,dx = ${coef(c)}x^3 \\Big|_0^{${a}} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `$y\\,dx + x\\,dy$ is the differential of $xy$, so the integral is $xy$ at the end: $${a} \\cdot ${c * a * a} = ${ans}$.`,
              `$y\\,dx + x\\,dy$ 是 $xy$ 的微分，所以积分等于终点处的 $xy$：$${a} \\cdot ${c * a * a} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-vector-line-integral-along-a-graph-y-equals-x-squared",
      figure:
        multivariableDrawings6[
          "line-integrals-of-vector-valued-functions-over-general-curves#a-vector-line-integral-along-a-graph-y-equals-x-squared"
        ],
      title: t("A vector line integral along $y = x^2$", "沿 $y = x^2$ 的向量线积分"),
      explanation: t(
        "A curve given as a graph needs no new parameter, and the whole integral becomes an ordinary integral in $x$. A graph $y = g(x)$ is parametrized by $x$ itself: $\\mathbf{r}(x) = (x, g(x))$, so $dy = g'(x)\\,dx$. For $\\mathbf{F} = \\langle a\\,xy, b \\rangle$ along $y = x^2$ from $x = 0$ to $x = c$:\n\n$$\\int_C a\\,xy\\,dx + b\\,dy = \\int_0^c (a x^3 + 2b x)\\,dx = \\frac{ac^4}{4} + bc^2.$$\n\nFor $\\mathbf{F} = \\langle 5xy, 1 \\rangle$ from $(0, 0)$ to $(2, 4)$, the integrand is $5x^3 + 2x$ and the integral is $20 + 4 = 24$.\n\n> **Watch out.** The constant $b$ becomes $2bx\\,dx$, which integrates to $bc^2$: the change in $y$ times $b$, not $bc$. And on the curve $xy$ is $x^3$, not $x^2$.",
        "以图像给出的曲线不需要新参数，整个积分化为关于 $x$ 的普通积分。图像 $y = g(x)$ 以 $x$ 本身为参数：$\\mathbf{r}(x) = (x, g(x))$，于是 $dy = g'(x)\\,dx$。对 $\\mathbf{F} = \\langle a\\,xy, b \\rangle$ 沿 $y = x^2$ 从 $x = 0$ 到 $x = c$：\n\n$$\\int_C a\\,xy\\,dx + b\\,dy = \\int_0^c (a x^3 + 2b x)\\,dx = \\frac{ac^4}{4} + bc^2$$\n\n对 $\\mathbf{F} = \\langle 5xy, 1 \\rangle$，从 $(0, 0)$ 到 $(2, 4)$，被积式是 $5x^3 + 2x$，积分为 $20 + 4 = 24$。\n\n> **注意。** 常数 $b$ 变成 $2bx\\,dx$，积分得 $bc^2$，即 $b$ 乘以 $y$ 的变化量，而不是 $bc$。在曲线上 $xy$ 是 $x^3$，不是 $x^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-5, 5);
        const c = rng.int(1, 3);
        const first = Q.of(a * c ** 4, 4);
        const ans = first.add(Q.of(b * c * c));
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle ${poly([a, "xy"])}, ${b} \\rangle$ along $y = x^2$ from $(0, 0)$ to $(${c}, ${c * c})$.`,
            `沿 $y = x^2$ 从 $(0, 0)$ 到 $(${c}, ${c * c})$，对 $\\mathbf{F} = \\langle ${poly([a, "xy"])}, ${b} \\rangle$ 计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              first.add(Q.of(b * c)),
              `That lets $y$ run only to $${c}$; it runs from $0$ to $${c * c}$, so $\\int ${b}\\,dy = ${b * c * c}$.`,
              `那是让 $y$ 只到 $${c}$；它从 $0$ 变到 $${c * c}$，所以 $\\int ${b}\\,dy = ${b * c * c}$。`,
            ),
            why(
              Q.of(a * c ** 3, 3).add(Q.of(b * c * c)),
              "That replaces $xy$ with $x^2$; on $y = x^2$, $xy = x^3$.",
              "那是把 $xy$ 换成了 $x^2$；在 $y = x^2$ 上 $xy = x^3$。",
            ),
            why(
              first,
              `That drops the $${b}\\,dy$ term; along the parabola $dy = 2x\\,dx$ is not $0$.`,
              `那是漏掉了 $${b}\\,dy$ 项；沿抛物线 $dy = 2x\\,dx$ 不为 $0$。`,
            ),
            why(
              first.add(Q.of(2 * b * c * c)),
              `That takes $${poly([2 * b, "x^2"])}$ as the antiderivative of $${poly([2 * b, "x"])}$; it is $${poly([b, "x^2"])}$.`,
              `那是把 $${poly([2 * b, "x^2"])}$ 当成 $${poly([2 * b, "x"])}$ 的原函数；应为 $${poly([b, "x^2"])}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Parametrize by x", "以 x 为参数"], t("On $y = x^2$, $dy = 2x\\,dx$.", "在 $y = x^2$ 上，$dy = 2x\\,dx$。")],
              [
                ["Write the integrand in x", "把被积式写成 x 的式子"],
                t(
                  `$${paren(a)}x \\cdot x^2 + ${paren(b)} \\cdot 2x = ${poly([a, "x^3"], [2 * b, "x"])}$.`,
                  `$${paren(a)}x \\cdot x^2 + ${paren(b)} \\cdot 2x = ${poly([a, "x^3"], [2 * b, "x"])}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{${c}} (${poly([a, "x^3"], [2 * b, "x"])})\\,dx = ${first.toLatex()} + ${paren(b * c * c)} = ${ans.toLatex()}$.`,
                  `$\\int_0^{${c}} (${poly([a, "x^3"], [2 * b, "x"])})\\,dx = ${first.toLatex()} + ${paren(b * c * c)} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Integrate the second term in $y$ directly: $\\int_0^{${c * c}} ${b}\\,dy = ${b * c * c}$, and the first is $\\int_0^{${c}} ${poly([a, "x^3"])}\\,dx = ${first.toLatex()}$; together $${ans.toLatex()}$.`,
              `第二项直接对 $y$ 积分：$\\int_0^{${c * c}} ${b}\\,dy = ${b * c * c}$，第一项是 $\\int_0^{${c}} ${poly([a, "x^3"])}\\,dx = ${first.toLatex()}$；合计 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** interpretingLineIntegralsOfVectorValuedFunctions relates line integrals to circulation and work. */
export const interpretingLineIntegralsOfVectorValuedFunctions: TopicDef = {
  id: "interpreting-line-integrals-of-vector-valued-functions",
  title: t("Interpreting Line Integrals of Vector-Valued Functions", "向量线积分的几何与物理意义"),
  summary: t(
    "The line integral $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds$ accumulates the tangential component of $\\mathbf{F}$ along $C$ (circulation or work).",
    "线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds$ 累积 $\\mathbf{F}$ 沿 $C$ 的切向分量（环量或功）。",
  ),
  intro: t(
    "Find $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for the constant field $\\mathbf{F} = \\langle 0, 3 \\rangle$ along the segment from $(1, 1)$ to $(5, 4)$. The segment has length $5$ and unit tangent $\\mathbf{T} = \\left\\langle \\frac{4}{5}, \\frac{3}{5} \\right\\rangle$, so the tangential component is $\\mathbf{F} \\cdot \\mathbf{T} = \\frac{9}{5}$ at every point. Then $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds = \\frac{9}{5} \\cdot 5 = 9$.\n\nCheck: for a constant field the integral is the dot product with the displacement $\\langle 4, 3 \\rangle$, and $\\langle 0, 3 \\rangle \\cdot \\langle 4, 3 \\rangle = 9$.\n\nIn this lesson we read $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ as the accumulated tangential component $\\mathbf{F} \\cdot \\mathbf{T}$, which gives its size from lengths and its sign from directions.",
    "对常力场 $\\mathbf{F} = \\langle 0, 3 \\rangle$，沿从 $(1, 1)$ 到 $(5, 4)$ 的线段求 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。线段长为 $5$，单位切向量为 $\\mathbf{T} = \\left\\langle \\frac{4}{5}, \\frac{3}{5} \\right\\rangle$，所以切向分量处处是 $\\mathbf{F} \\cdot \\mathbf{T} = \\frac{9}{5}$。于是 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds = \\frac{9}{5} \\cdot 5 = 9$。\n\n检验：对常力场，积分等于它与位移 $\\langle 4, 3 \\rangle$ 的点积，而 $\\langle 0, 3 \\rangle \\cdot \\langle 4, 3 \\rangle = 9$。\n\n本课我们把 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 理解为切向分量 $\\mathbf{F} \\cdot \\mathbf{T}$ 的累积：由长度得出它的大小，由方向得出它的符号。",
  ),
  prerequisites: ["line-integrals-of-vector-valued-functions-over-general-curves"],
  encompasses: [
    {
      topic: "line-integrals-of-vector-valued-functions-over-general-curves",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "circulation-and-tangential-component-interpretation",
      title: t("Circulation and tangential component interpretation", "切向分量与环量的几何解释"),
      explanation: t(
        "Because $d\\mathbf{r} = \\mathbf{T}\\,ds$, the vector line integral equates to the scalar line integral of the tangential component:\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds.$$\n\nWhen $\\mathbf{F} \\cdot \\mathbf{T}$ is the same at every point, it comes out of the integral, and $\\int_C ds$ is the length. If $\\mathbf{F} \\cdot \\mathbf{T} = \\frac{5}{2}$ all along a curve of length $6$, the integral is $\\frac{5}{2} \\cdot 6 = 15$.\n\n> **Watch out.** Multiply the tangential component by the length; adding them, or taking either one alone, is not the integral.",
        "因为 $d\\mathbf{r} = \\mathbf{T}\\,ds$，向量线积分等同于切向分量对弧长的标量积分：\n\n$$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds$$\n\n当 $\\mathbf{F} \\cdot \\mathbf{T}$ 处处相同时，它可以提到积分外，而 $\\int_C ds$ 就是长度。如果沿长度为 $6$ 的曲线处处有 $\\mathbf{F} \\cdot \\mathbf{T} = \\frac{5}{2}$，积分就是 $\\frac{5}{2} \\cdot 6 = 15$。\n\n> **注意。** 要用切向分量乘以长度；把两者相加，或只取其中一个，都不是积分。",
      ),
      generate(rng: Rng): Problem {
        const val = rng.int(2, 8);
        const L = rng.int(3, 10);
        const ans = val * L;
        return numberProblem({
          prompt: t(
            `A vector field $\\mathbf{F}$ has a constant tangential component $\\mathbf{F} \\cdot \\mathbf{T} = ${val}$ along a curve $C$ of total arc length $L = ${L}$. Find $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$.`,
            `已知向量场 $\\mathbf{F}$ 沿总弧长为 $L = ${L}$ 的曲线 $C$ 具有恒定的切向分量 $\\mathbf{F} \\cdot \\mathbf{T} = ${val}$。求线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              val + L,
              "That adds the tangential component and the length; the integral of a constant over arc length is their product.",
              "那是把切向分量和长度相加；常数对弧长的积分是两者的乘积。",
            ),
            why(
              val,
              "That is the tangential component alone; it must be accumulated over the whole length.",
              "那只是切向分量；还要沿整个长度累积。",
            ),
            why(
              L,
              "That is the length alone, $\\int_C ds$; the integrand $\\mathbf{F} \\cdot \\mathbf{T}$ multiplies it.",
              "那只是长度 $\\int_C ds$；还要乘以被积函数 $\\mathbf{F} \\cdot \\mathbf{T}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the tangential component", "利用切向分量"],
                t(
                  `$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds = \\int_C ${val}\\,ds$.`,
                  `$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C (\\mathbf{F} \\cdot \\mathbf{T})\\,ds = \\int_C ${val}\\,ds$。`,
                ),
              ],
              [
                ["Take out the constant", "提出常数"],
                t(
                  `$${val}\\int_C ds = ${val} \\cdot ${L} = ${ans}$, since $\\int_C ds$ is the length.`,
                  `$${val}\\int_C ds = ${val} \\cdot ${L} = ${ans}$，因为 $\\int_C ds$ 就是长度。`,
                ),
              ],
            ],
            t(
              `Cut $C$ into small pieces of length $\\Delta s$; each contributes $${val}\\,\\Delta s$, and the pieces have total length $${L}$, so they add to $${ans}$.`,
              `把 $C$ 切成长度为 $\\Delta s$ 的小段；每段贡献 $${val}\\,\\Delta s$，各段总长为 $${L}$，所以加起来是 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-sign-of-a-vector-line-integral",
      figure: multivariableDrawings6["interpreting-line-integrals-of-vector-valued-functions#the-sign-of-a-vector-line-integral"],
      title: t("The sign of a vector line integral", "向量线积分的符号"),
      explanation: t(
        "$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds$ adds up the component of $\\mathbf{F}$ along the direction of motion. It is positive when the field mostly pushes along the path, negative when it mostly pushes against it, and zero when the field is perpendicular to the path everywhere. A radial field $\\langle x, y \\rangle$ is perpendicular to every circle centered at the origin, and a rotational field $\\langle -y, x \\rangle$ is perpendicular to every ray from the origin. Along the segment from $(0, 2)$ to $(-3, 2)$, the field $\\langle y, 0 \\rangle$ points right while the motion goes left, and the integral is $2 \\cdot (-3) = -6$, negative.\n\n> **Watch out.** A strong field can still give $0$ if it is perpendicular to the path at every point. And reversing the direction of travel reverses the sign.",
        "$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds$ 累加 $\\mathbf{F}$ 沿运动方向的分量。场主要顺着路径推动时为正，主要逆着路径时为负，处处垂直于路径时为零。径向场 $\\langle x, y \\rangle$ 垂直于以原点为中心的每个圆，旋转场 $\\langle -y, x \\rangle$ 垂直于从原点出发的每条射线。沿从 $(0, 2)$ 到 $(-3, 2)$ 的线段，场 $\\langle y, 0 \\rangle$ 指向右而运动向左，积分为 $2 \\cdot (-3) = -6$，是负的。\n\n> **注意。** 很强的场如果处处垂直于路径，积分仍然是 $0$。运动方向反过来，符号也随之反过来。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 3);
        const k = rng.nonZero(-5, 5);
        const R = rng.int(1, 6);
        const pos = t("Positive", "正");
        const neg = t("Negative", "负");
        const zero = t("Zero", "零");
        const question = (p: Text): Text =>
          t(
            `${p.en} Is $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ positive, negative or zero?`,
            `${p["zh-CN"]}$\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 为正、负还是零？`,
          );
        const choose = (prompt: Text, sign: number, whyFor: (option: Text) => Text, solution: Text): Problem => {
          const correct = sign > 0 ? pos : sign < 0 ? neg : zero;
          return explainedChoice(rng, {
            prompt: question(prompt),
            correct,
            wrong: [pos, neg, zero].filter((o) => o !== correct).map((option) => ({ option, why: whyFor(option) })),
            solution,
          });
        };
        const field = `\\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle`;
        if (kind === 0) {
          const d = rng.nonZero(-6, 6);
          const y0 = rng.int(-3, 3);
          const y1 = y0 + rng.int(-3, 3);
          const value = k * d;
          const along = value > 0;
          const fieldWay = k > 0 ? ["right", "右"] : ["left", "左"];
          const moveWay = d > 0 ? ["right", "右"] : ["left", "左"];
          return choose(
            t(
              `$\\mathbf{F} = \\langle ${k}, 0 \\rangle$ and $C$ is the segment from $(0, ${y0})$ to $(${d}, ${y1})$.`,
              `$\\mathbf{F} = \\langle ${k}, 0 \\rangle$，$C$ 为从 $(0, ${y0})$ 到 $(${d}, ${y1})$ 的线段。`,
            ),
            value,
            (option) =>
              option === zero
                ? t(
                    `The field is horizontal and the particle moves ${moveWay[0]} by $${Math.abs(d)}$, so the field has a component along the motion and the integral is $${value}$`,
                    `力场是水平的，质点向${moveWay[1]}移动了 $${Math.abs(d)}$，所以力场有沿运动方向的分量，积分为 $${value}$`,
                  )
                : t(
                    `The field points ${fieldWay[0]} and the particle moves ${moveWay[0]}, so the field ${along ? "helps" : "opposes"} the motion: the integral is $${value}$`,
                    `力场指向${fieldWay[1]}，质点向${moveWay[1]}运动，所以力场${along ? "顺着" : "阻碍"}运动：积分为 $${value}$`,
                  ),
            walked(
              [
                [
                  ["Find the displacement", "求位移"],
                  t(
                    `$\\Delta\\mathbf{r} = \\langle ${d}, ${y1 - y0} \\rangle$.`,
                    `$\\Delta\\mathbf{r} = \\langle ${d}, ${y1 - y0} \\rangle$。`,
                  ),
                ],
                [
                  ["Dot with the constant field", "与常力场作点积"],
                  t(
                    `$\\langle ${k}, 0 \\rangle \\cdot \\langle ${d}, ${y1 - y0} \\rangle = ${k} \\cdot ${paren(d)} = ${value}$, which is ${along ? "positive" : "negative"}.`,
                    `$\\langle ${k}, 0 \\rangle \\cdot \\langle ${d}, ${y1 - y0} \\rangle = ${k} \\cdot ${paren(d)} = ${value}$，是${along ? "正" : "负"}的。`,
                  ),
                ],
              ],
              t(
                `The field points ${fieldWay[0]} and the particle moves ${moveWay[0]}, so the field ${along ? "helps" : "opposes"} the motion, as the sign says.`,
                `力场指向${fieldWay[1]}，质点向${moveWay[1]}运动，所以力场${along ? "顺着" : "阻碍"}运动，与符号一致。`,
              ),
            ),
          );
        }
        if (kind === 1) {
          const r2 = R === 1 ? "" : `${R * R}`;
          return choose(
            t(
              `$\\mathbf{F} = \\langle ${poly([k, "x"])}, ${poly([k, "y"])} \\rangle$ and $C$ is the circle $x^2 + y^2 = ${R * R}$ traversed counterclockwise.`,
              `$\\mathbf{F} = \\langle ${poly([k, "x"])}, ${poly([k, "y"])} \\rangle$，$C$ 为逆时针方向的圆 $x^2 + y^2 = ${R * R}$。`,
            ),
            0,
            (option) =>
              option === pos
                ? t(
                    "The radial field is perpendicular to the circle at every point, so it never pushes along the motion: $\\mathbf{F} \\cdot \\mathbf{T} = 0$",
                    "径向场在圆上每点都垂直于圆，所以它从不顺着运动方向推动：$\\mathbf{F} \\cdot \\mathbf{T} = 0$",
                  )
                : t(
                    "The radial field is perpendicular to the circle at every point, so it never pushes against the motion either: $\\mathbf{F} \\cdot \\mathbf{T} = 0$",
                    "径向场在圆上每点都垂直于圆，所以它也从不逆着运动方向推动：$\\mathbf{F} \\cdot \\mathbf{T} = 0$",
                  ),
            walked(
              [
                [
                  ["Compare the directions", "比较方向"],
                  t(
                    `On the circle $\\mathbf{F} = ${coef(k)}\\langle x, y \\rangle$ points along the radius, and the tangent $\\mathbf{T}$ is perpendicular to the radius.`,
                    `在圆上 $\\mathbf{F} = ${coef(k)}\\langle x, y \\rangle$ 沿半径方向，而切向量 $\\mathbf{T}$ 垂直于半径。`,
                  ),
                ],
                [
                  ["Conclude", "得出结论"],
                  t(
                    "$\\mathbf{F} \\cdot \\mathbf{T} = 0$ at every point, so the integral is $0$.",
                    "每点都有 $\\mathbf{F} \\cdot \\mathbf{T} = 0$，所以积分为 $0$。",
                  ),
                ],
              ],
              t(
                `With $\\mathbf{r}(t) = (${R === 1 ? "" : R}\\cos t, ${R === 1 ? "" : R}\\sin t)$, $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${coef(k)}(-${r2}\\cos t \\sin t + ${r2}\\sin t \\cos t) = 0$.`,
                `取 $\\mathbf{r}(t) = (${R === 1 ? "" : R}\\cos t, ${R === 1 ? "" : R}\\sin t)$，$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${coef(k)}(-${r2}\\cos t \\sin t + ${r2}\\sin t \\cos t) = 0$。`,
              ),
            ),
          );
        }
        if (kind === 2) {
          const cw = rng.int(0, 1) === 1;
          const s = cw ? -1 : 1;
          const tangential = k * s * R;
          const along = tangential > 0;
          return choose(
            t(
              `$\\mathbf{F} = ${field}$ and $C$ is the circle $x^2 + y^2 = ${R * R}$ traversed ${cw ? "clockwise" : "counterclockwise"}.`,
              `$\\mathbf{F} = ${field}$，$C$ 为${cw ? "顺时针" : "逆时针"}方向的圆 $x^2 + y^2 = ${R * R}$。`,
            ),
            tangential,
            (option) =>
              option === zero
                ? t(
                    `The rotational field is tangent to the circle, not perpendicular to it, so $\\mathbf{F} \\cdot \\mathbf{T} = ${tangential}$ is never $0$`,
                    `旋转场与圆相切，而不是垂直于圆，所以 $\\mathbf{F} \\cdot \\mathbf{T} = ${tangential}$ 从不为 $0$`,
                  )
                : t(
                    `$\\langle -y, x \\rangle$ points counterclockwise along the circle, so this field pushes ${along ? "along" : "against"} the ${cw ? "clockwise" : "counterclockwise"} motion: $\\mathbf{F} \\cdot \\mathbf{T} = ${tangential}$`,
                    `$\\langle -y, x \\rangle$ 沿圆逆时针指向，所以这个场${along ? "顺着" : "逆着"}${cw ? "顺时针" : "逆时针"}的运动推动：$\\mathbf{F} \\cdot \\mathbf{T} = ${tangential}$`,
                  ),
            walked(
              [
                [
                  ["Compare the directions", "比较方向"],
                  t(
                    `$\\langle -y, x \\rangle$ is tangent to the circle, points counterclockwise and has length $${R}$ there. Here $\\mathbf{F} = ${coef(k)}\\langle -y, x \\rangle$ and the motion is ${cw ? "clockwise" : "counterclockwise"}, so $\\mathbf{F} \\cdot \\mathbf{T} = ${tangential}$.`,
                    `$\\langle -y, x \\rangle$ 与圆相切，逆时针指向，在圆上长度为 $${R}$。这里 $\\mathbf{F} = ${coef(k)}\\langle -y, x \\rangle$，运动为${cw ? "顺时针" : "逆时针"}，所以 $\\mathbf{F} \\cdot \\mathbf{T} = ${tangential}$。`,
                  ),
                ],
                [
                  ["Multiply by the length", "乘以长度"],
                  t(
                    `The circle has length $${2 * R}\\pi$, so the integral is $${tangential} \\cdot ${2 * R}\\pi = ${2 * tangential * R}\\pi$, which is ${along ? "positive" : "negative"}.`,
                    `圆周长为 $${2 * R}\\pi$，所以积分为 $${tangential} \\cdot ${2 * R}\\pi = ${2 * tangential * R}\\pi$，是${along ? "正" : "负"}的。`,
                  ),
                ],
              ],
              t(
                `Parametrized counterclockwise, $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${k * R * R}$, so the integral over $0 \\le t \\le 2\\pi$ is $${2 * k * R * R}\\pi$${cw ? ", and going clockwise reverses the sign" : ""}.`,
                `按逆时针参数化，$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${k * R * R}$，在 $0 \\le t \\le 2\\pi$ 上积分为 $${2 * k * R * R}\\pi$${cw ? "，顺时针走则符号相反" : ""}。`,
              ),
            ),
          );
        }
        const end = R * rng.pick([1, 2, -1]);
        return choose(
          t(
            `$\\mathbf{F} = ${field}$ and $C$ is the segment from $(0, 0)$ to $(${R}, ${end})$.`,
            `$\\mathbf{F} = ${field}$，$C$ 为从 $(0, 0)$ 到 $(${R}, ${end})$ 的线段。`,
          ),
          0,
          (option) =>
            t(
              `The segment lies on a ray from the origin, and the rotational field is perpendicular to every such ray, so it never pushes ${option === pos ? "along" : "against"} the motion`,
              `线段位于从原点出发的射线上，旋转场垂直于每条这样的射线，所以它从不${option === pos ? "顺着" : "逆着"}运动方向推动`,
            ),
          walked(
            [
              [
                ["Compare the directions", "比较方向"],
                t(
                  `Every point of the segment is a multiple of $(${R}, ${end})$, and there $\\langle -y, x \\rangle$ is a multiple of $\\langle ${-end}, ${R} \\rangle$, which is perpendicular to the direction $\\langle ${R}, ${end} \\rangle$.`,
                  `线段上每一点都是 $(${R}, ${end})$ 的倍数，在那里 $\\langle -y, x \\rangle$ 是 $\\langle ${-end}, ${R} \\rangle$ 的倍数，它垂直于方向 $\\langle ${R}, ${end} \\rangle$。`,
                ),
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  "So $\\mathbf{F} \\cdot \\mathbf{T} = 0$ at every point, and the integral is $0$.",
                  "所以每点都有 $\\mathbf{F} \\cdot \\mathbf{T} = 0$，积分为 $0$。",
                ),
              ],
            ],
            t(
              `With $\\mathbf{r}(t) = (${poly([R, "t"])}, ${poly([end, "t"])})$, $0 \\le t \\le 1$: $\\mathbf{F} \\cdot \\mathbf{r}'(t) = (${poly([-k * end, "t"])}) \\cdot ${R} + (${poly([k * R, "t"])}) \\cdot ${paren(end)} = 0$.`,
              `取 $\\mathbf{r}(t) = (${poly([R, "t"])}, ${poly([end, "t"])})$，$0 \\le t \\le 1$：$\\mathbf{F} \\cdot \\mathbf{r}'(t) = (${poly([-k * end, "t"])}) \\cdot ${R} + (${poly([k * R, "t"])}) \\cdot ${paren(end)} = 0$。`,
            ),
          ),
        );
      },
    },
  ],
};

/** propertiesOfLineIntegralsOfVectorValuedFunctions covers linearity and sign flip on orientation reversal. */
export const propertiesOfLineIntegralsOfVectorValuedFunctions: TopicDef = {
  id: "properties-of-line-integrals-of-vector-valued-functions",
  title: t("Properties of Line Integrals of Vector-Valued Functions", "向量线积分的代数与几何性质"),
  summary: t(
    "Vector line integrals satisfy $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$, are linear in the field, and add over joined paths.",
    "向量线积分满足 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$，对向量场是线性的，并对相接的路径可加。",
  ),
  intro: t(
    "Suppose $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = 4$ and $\\int_C \\mathbf{G} \\cdot d\\mathbf{r} = -7$. Find $\\int_{-C} (2\\mathbf{F} - \\mathbf{G}) \\cdot d\\mathbf{r}$. By linearity, on $C$ the integral of $2\\mathbf{F} - \\mathbf{G}$ is $2 \\cdot 4 - (-7) = 15$. Reversing the curve changes the sign, so the answer is $-15$.\n\nCheck: reverse first. Then $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -4$ and $\\int_{-C} \\mathbf{G} \\cdot d\\mathbf{r} = 7$, and $2 \\cdot (-4) - 7 = -15$.\n\nIn this lesson we combine three rules: reversing a curve changes the sign, joined curves add, and constants and sums of fields come out of the integral.",
    "设 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = 4$，$\\int_C \\mathbf{G} \\cdot d\\mathbf{r} = -7$。求 $\\int_{-C} (2\\mathbf{F} - \\mathbf{G}) \\cdot d\\mathbf{r}$。由线性，在 $C$ 上 $2\\mathbf{F} - \\mathbf{G}$ 的积分是 $2 \\cdot 4 - (-7) = 15$。曲线反向时符号改变，所以答案是 $-15$。\n\n检验：先反向。则 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -4$，$\\int_{-C} \\mathbf{G} \\cdot d\\mathbf{r} = 7$，而 $2 \\cdot (-4) - 7 = -15$。\n\n本课我们综合运用三条规则：曲线反向则变号，相接的曲线积分相加，常数和场的和可以提出积分号。",
  ),
  prerequisites: ["interpreting-line-integrals-of-vector-valued-functions"],
  encompasses: [
    {
      topic: "interpreting-line-integrals-of-vector-valued-functions",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "orientation-reversal-of-vector-line-integrals",
      title: t("Orientation reversal of vector line integrals", "向量线积分在反向遍历下的变号法则"),
      explanation: t(
        "Going the other way along the curve reverses the direction of every small displacement, so the work done by the field changes sign. Reversing the direction of traversal negates the tangent displacement vector $d\\mathbf{r}$, hence:\n\n$$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}.$$\n\nIf $C$ is $C_1$ followed by $C_2$, with integrals $20$ and $-3$, then $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = 17$ and $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -17$.\n\n> **Watch out.** Reversing $C$ reverses both pieces, so the whole sum changes sign, not just one term. $-C$ alone gives $-\\int_C$; only $C$ followed by $-C$ gives $0$.",
        "沿曲线反方向走会使每一小段位移反向，所以向量场做的功改变符号。反转遍历方向会导致切向微元向量变号 $d\\mathbf{r} \\to -d\\mathbf{r}$，因此：\n\n$$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$$\n\n如果 $C$ 由 $C_1$ 接 $C_2$ 组成，两段的积分分别为 $20$ 和 $-3$，那么 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = 17$，$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -17$。\n\n> **注意。** 把 $C$ 反向会把两段都反向，所以整个和变号，而不只是其中一项变号。单独的 $-C$ 给出 $-\\int_C$；只有 $C$ 接上 $-C$ 才得 $0$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-15, 15);
        const drawn = rng.nonZero(-15, 15);
        const q = p + drawn === 0 ? drawn + 1 || 1 : drawn;
        const forward = p + q;
        const ans = -forward;
        return numberProblem({
          prompt: t(
            `The curve $C$ is $C_1$ followed by $C_2$, with $\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = ${p}$ and $\\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${q}$. Determine the value of $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$, where $-C$ is the same curve traversed in reverse.`,
            `曲线 $C$ 由 $C_1$ 接 $C_2$ 组成，$\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = ${p}$，$\\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${q}$。求 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r}$ 的值，其中 $-C$ 为反向遍历的同一曲线。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(forward, "That is the integral over $C$; reversing the curve changes its sign.", "那是沿 $C$ 的积分；曲线反向时它要变号。"),
            why(q - p, "That reverses only $C_1$; $-C$ runs both pieces backward.", "那是只把 $C_1$ 反向了；$-C$ 把两段都反向。"),
            why(p - q, "That reverses only $C_2$; $-C$ runs both pieces backward.", "那是只把 $C_2$ 反向了；$-C$ 把两段都反向。"),
            why(
              0,
              "That treats the reversed curve as cancelling the original; $-C$ alone gives the negative of the integral over $C$, not $0$.",
              "那是把反向曲线当成与原曲线抵消了；单独的 $-C$ 给出沿 $C$ 积分的相反数，而不是 $0$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Add the pieces", "分段相加"],
                t(
                  `$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = ${p} + ${paren(q)} = ${forward}$.`,
                  `$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = ${p} + ${paren(q)} = ${forward}$。`,
                ),
              ],
              [
                ["Reverse the curve", "曲线反向"],
                t(
                  `Reversing negates $d\\mathbf{r}$, so $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = ${ans}$.`,
                  `反向使 $d\\mathbf{r}$ 变号，所以 $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `$-C$ is $-C_2$ followed by $-C_1$, with integrals $${-q}$ and $${-p}$, and $${-q} + ${paren(-p)} = ${ans}$.`,
              `$-C$ 是 $-C_2$ 接 $-C_1$，积分分别为 $${-q}$ 和 $${-p}$，而 $${-q} + ${paren(-p)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "combining-reversal-additivity-and-linearity",
      title: t("Combining reversal, additivity and linearity", "综合运用反向、可加性与线性"),
      explanation: t(
        "Three rules handle vector line integrals over combined paths: reversing a path changes the sign, $\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$; joining paths adds the integrals; and constants come out, $\\int_C \\alpha\\mathbf{F} \\cdot d\\mathbf{r} = \\alpha\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$. So\n\n$$\\int_{C_1 \\cup (-C_2)} \\alpha\\mathbf{F} \\cdot d\\mathbf{r} = \\alpha\\left(\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r}\\right).$$\n\nWith integrals $3$ over $C_1$ and $-1$ over $C_2$, the integral of $6\\mathbf{F}$ over $C_1 \\cup (-C_2)$ is $6(3 - (-1)) = 24$.\n\n> **Watch out.** The reversed piece is subtracted; adding it gives $\\alpha(A + B)$. And the factor $\\alpha$ multiplies both pieces, not only the first.",
        "三条规则处理组合路径上的向量线积分：路径反向则变号，$\\int_{-C} \\mathbf{F} \\cdot d\\mathbf{r} = -\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$；路径相接则积分相加；常数可以提出，$\\int_C \\alpha\\mathbf{F} \\cdot d\\mathbf{r} = \\alpha\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。所以\n\n$$\\int_{C_1 \\cup (-C_2)} \\alpha\\mathbf{F} \\cdot d\\mathbf{r} = \\alpha\\left(\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r}\\right)$$\n\n若沿 $C_1$ 的积分为 $3$，沿 $C_2$ 的积分为 $-1$，则 $6\\mathbf{F}$ 沿 $C_1 \\cup (-C_2)$ 的积分为 $6(3 - (-1)) = 24$。\n\n> **注意。** 反向的那一段要减去；把它加上就得到 $\\alpha(A + B)$。因子 $\\alpha$ 乘以两段，而不只是第一段。",
      ),
      generate(rng: Rng): Problem {
        const A = rng.nonZero(-9, 9);
        let B = rng.nonZero(-9, 9);
        if (B === A) B += 1;
        const alpha = rng.pick([-3, -2, 2, 3, 4, 5]);
        const ans = alpha * (A - B);
        return numberProblem({
          prompt: t(
            `$\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = ${A}$ and $\\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${B}$, where $C_1$ ends where $C_2$ ends. Find $\\int_{C_1 \\cup (-C_2)} ${alpha}\\mathbf{F} \\cdot d\\mathbf{r}$.`,
            `$\\int_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = ${A}$，$\\int_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${B}$，$C_1$ 与 $C_2$ 终点相同。求 $\\int_{C_1 \\cup (-C_2)} ${alpha}\\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              alpha * (A + B),
              "That adds the integral over $C_2$; the path runs $C_2$ backward, so it is subtracted.",
              "那是加上了沿 $C_2$ 的积分；路径是反向走 $C_2$，所以要减去。",
            ),
            why(-ans, "That reverses $C_1$ instead of $C_2$.", "那是把 $C_1$ 反向了，而不是 $C_2$。"),
            why(
              A - B,
              `That leaves out the factor $${alpha}$ in front of $\\mathbf{F}$.`,
              `那是漏掉了 $\\mathbf{F}$ 前的因子 $${alpha}$。`,
            ),
            why(
              alpha * A - B,
              `That multiplies only the first piece by $${alpha}$; the factor applies to the whole path.`,
              `那是只把第一段乘以 $${alpha}$；这个因子作用于整条路径。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Reverse $C_2$", "把 $C_2$ 反向"],
                t(`$\\int_{-C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${-B}$.`, `$\\int_{-C_2} \\mathbf{F} \\cdot d\\mathbf{r} = ${-B}$。`),
              ],
              [["Join the paths", "连接路径"], t(`$${A} + ${paren(-B)} = ${A - B}$.`, `$${A} + ${paren(-B)} = ${A - B}$。`)],
              [
                ["Take out the constant", "提出常数"],
                t(`$${alpha} \\cdot ${paren(A - B)} = ${ans}$.`, `$${alpha} \\cdot ${paren(A - B)} = ${ans}$。`),
              ],
            ],
            t(
              `Scale first: the integrals of $${alpha}\\mathbf{F}$ are $${alpha * A}$ over $C_1$ and $${alpha * B}$ over $C_2$, and $${alpha * A} - ${paren(alpha * B)} = ${ans}$.`,
              `先乘常数：$${alpha}\\mathbf{F}$ 沿 $C_1$ 的积分为 $${alpha * A}$，沿 $C_2$ 为 $${alpha * B}$，而 $${alpha * A} - ${paren(alpha * B)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** workDoneByAForceField calculates work done by a force field along a trajectory. */
export const workDoneByAForceField: TopicDef = {
  id: "work-done-by-a-force-field",
  title: t("Work Done by a Force Field", "力场做功的计算"),
  summary: t(
    "The work done by a force field $\\mathbf{F}$ moving a particle along a curve $C$ is $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$.",
    "力场 $\\mathbf{F}$ 推动质点沿曲线 $C$ 运动所做的功为 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。",
  ),
  intro: t(
    "A force $\\mathbf{F} = \\langle 0, x \\rangle$ moves a particle along the segment from $(0, 0)$ to $(2, 4)$. With $\\mathbf{r}(t) = (2t, 4t)$, $0 \\le t \\le 1$, we have $\\mathbf{r}'(t) = \\langle 2, 4 \\rangle$ and $\\mathbf{F}(\\mathbf{r}(t)) = \\langle 0, 2t \\rangle$, so the work is $W = \\int_0^1 8t\\,dt = 4$.\n\nCheck: only the term $x\\,dy$ counts. Along the segment $x$ averages $1$ while $y$ rises by $4$, giving $1 \\cdot 4 = 4$.\n\nIn this lesson we compute the work $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$: as a dot product with the displacement for a constant force, and by parametrizing the path when the force varies.",
    "力 $\\mathbf{F} = \\langle 0, x \\rangle$ 推动质点沿从 $(0, 0)$ 到 $(2, 4)$ 的线段运动。取 $\\mathbf{r}(t) = (2t, 4t)$，$0 \\le t \\le 1$，则 $\\mathbf{r}'(t) = \\langle 2, 4 \\rangle$，$\\mathbf{F}(\\mathbf{r}(t)) = \\langle 0, 2t \\rangle$，所以功为 $W = \\int_0^1 8t\\,dt = 4$。\n\n检验：只有 $x\\,dy$ 项起作用。沿线段 $x$ 的平均值为 $1$，$y$ 增加 $4$，得 $1 \\cdot 4 = 4$。\n\n本课我们计算功 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$：恒力时用它与位移的点积，力变化时把路径参数化。",
  ),
  prerequisites: ["properties-of-line-integrals-of-vector-valued-functions"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-work-done-along-paths",
      title: t("Calculating work done along paths", "计算质点沿路径所做的功"),
      explanation: t(
        "Work is the vector line integral of force over displacement: $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$. For a constant force $\\mathbf{F} = \\langle F_x, F_y \\rangle$ acting over displacement $\\Delta \\mathbf{r} = \\langle \\Delta x, \\Delta y \\rangle$, $W = \\mathbf{F} \\cdot \\Delta \\mathbf{r}$. For $\\mathbf{F} = \\langle 7, -2 \\rangle$ from $(1, 0)$ to $(4, 5)$, $\\Delta \\mathbf{r} = \\langle 3, 5 \\rangle$ and $W = 21 - 10 = 11$.\n\n> **Watch out.** Use the displacement, end minus start, not the end point itself, and pair matching components: $F_x\\,\\Delta x + F_y\\,\\Delta y$.",
        "功是力场沿位移路径的向量线积分：$W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。恒力 $\\mathbf{F} = \\langle F_x, F_y \\rangle$ 沿直线位移 $\\Delta \\mathbf{r} = \\langle \\Delta x, \\Delta y \\rangle$ 做功为 $W = \\mathbf{F} \\cdot \\Delta \\mathbf{r}$。对 $\\mathbf{F} = \\langle 7, -2 \\rangle$，从 $(1, 0)$ 到 $(4, 5)$，$\\Delta \\mathbf{r} = \\langle 3, 5 \\rangle$，$W = 21 - 10 = 11$。\n\n> **注意。** 要用位移，即终点减起点，而不是终点本身；并且对应分量相乘：$F_x\\,\\Delta x + F_y\\,\\Delta y$。",
      ),
      generate(rng: Rng): Problem {
        const fx = rng.nonZero(-6, 6);
        const fy = rng.nonZero(-6, 6);
        const x1 = rng.int(-4, 4);
        const y1 = rng.int(-4, 4);
        const dx = rng.nonZero(-5, 5);
        const dy = rng.nonZero(-5, 5);
        const x2 = x1 + dx;
        const y2 = y1 + dy;
        const ans = fx * dx + fy * dy;
        return numberProblem({
          prompt: t(
            `Find the work done by the constant force field $\\mathbf{F} = \\langle ${fx}, ${fy} \\rangle$ on a particle moving along the line segment from $(${x1}, ${y1})$ to $(${x2}, ${y2})$.`,
            `求恒力场 $\\mathbf{F} = \\langle ${fx}, ${fy} \\rangle$ 将质点沿直线段从 $(${x1}, ${y1})$ 移动到 $(${x2}, ${y2})$ 所做的功。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              fx * dy + fy * dx,
              "That pairs $F_x$ with $\\Delta y$ and $F_y$ with $\\Delta x$; each component goes with its own coordinate.",
              "那是把 $F_x$ 配给了 $\\Delta y$，$F_y$ 配给了 $\\Delta x$；每个分量要配自己的坐标。",
            ),
            why(
              -ans,
              "That uses start minus end for the displacement; it is end minus start.",
              "那是用起点减终点作位移；位移是终点减起点。",
            ),
            why(
              fx * x2 + fy * y2,
              `That dots $\\mathbf{F}$ with the end point $(${x2}, ${y2})$; the work uses the displacement $\\langle ${dx}, ${dy} \\rangle$.`,
              `那是用 $\\mathbf{F}$ 点乘终点 $(${x2}, ${y2})$；功要用位移 $\\langle ${dx}, ${dy} \\rangle$。`,
            ),
            why(
              fx * dx,
              "That keeps only the $x$-components; the $y$-components contribute $F_y\\,\\Delta y$ as well.",
              "那是只保留了 $x$ 分量；$y$ 分量也贡献 $F_y\\,\\Delta y$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the displacement", "求位移"],
                t(
                  `$\\Delta \\mathbf{r} = \\langle ${x2} - ${paren(x1)}, ${y2} - ${paren(y1)} \\rangle = \\langle ${dx}, ${dy} \\rangle$.`,
                  `$\\Delta \\mathbf{r} = \\langle ${x2} - ${paren(x1)}, ${y2} - ${paren(y1)} \\rangle = \\langle ${dx}, ${dy} \\rangle$。`,
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                t(
                  `$W = ${fx} \\cdot ${paren(dx)} + ${paren(fy)} \\cdot ${paren(dy)} = ${fx * dx} + ${paren(fy * dy)} = ${ans}$.`,
                  `$W = ${fx} \\cdot ${paren(dx)} + ${paren(fy)} \\cdot ${paren(dy)} = ${fx * dx} + ${paren(fy * dy)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `With $\\mathbf{r}(t) = (${poly([x1, ""], [dx, "t"])}, ${poly([y1, ""], [dy, "t"])})$, $0 \\le t \\le 1$, $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${ans}$ at every $t$, and integrating over an interval of length $1$ gives $${ans}$.`,
              `取 $\\mathbf{r}(t) = (${poly([x1, ""], [dx, "t"])}, ${poly([y1, ""], [dy, "t"])})$，$0 \\le t \\le 1$，对每个 $t$ 都有 $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${ans}$，在长度为 $1$ 的区间上积分得 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "work-by-a-shear-force-along-a-segment",
      title: t("Work by the force $\\langle ay, 0 \\rangle$ along a segment", "力 $\\langle ay, 0 \\rangle$ 沿线段做的功"),
      explanation: t(
        "Work is $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$. For $\\mathbf{F} = \\langle ay, 0 \\rangle$ only the $dx$ term counts: $W = \\int_C a\\,y\\,dx$. On the segment $\\mathbf{r}(t) = (x_0 + t\\Delta x, y_0 + t\\Delta y)$, $0 \\le t \\le 1$,\n\n$$W = \\int_0^1 a(y_0 + t\\Delta y)\\,\\Delta x\\,dt = a\\,\\Delta x\\,\\frac{y_0 + y_1}{2}.$$\n\nThis field is not conservative, so another path between the same points can do different work. For $\\mathbf{F} = \\langle 2y, 0 \\rangle$ from $(0, 1)$ to $(3, 7)$, $y$ averages $4$ and $\\Delta x = 3$, so $W = 2 \\cdot 3 \\cdot 4 = 24$.\n\n> **Watch out.** $y$ changes along the segment, so use its average, not its value at either end. Only $\\Delta x$ enters, not $\\Delta y$.",
        "功为 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。对 $\\mathbf{F} = \\langle ay, 0 \\rangle$，只有 $dx$ 项起作用：$W = \\int_C a\\,y\\,dx$。在线段 $\\mathbf{r}(t) = (x_0 + t\\Delta x, y_0 + t\\Delta y)$，$0 \\le t \\le 1$ 上，\n\n$$W = \\int_0^1 a(y_0 + t\\Delta y)\\,\\Delta x\\,dt = a\\,\\Delta x\\,\\frac{y_0 + y_1}{2}$$\n\n这个场不是保守的，同样两点之间的另一条路径做的功可能不同。对 $\\mathbf{F} = \\langle 2y, 0 \\rangle$，从 $(0, 1)$ 到 $(3, 7)$，$y$ 的平均值为 $4$，$\\Delta x = 3$，所以 $W = 2 \\cdot 3 \\cdot 4 = 24$。\n\n> **注意。** $y$ 沿线段变化，所以要用它的平均值，而不是某一端的值。只有 $\\Delta x$ 进入计算，$\\Delta y$ 不进入。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 4);
        const dx = rng.nonZero(-5, 5);
        let y1 = rng.int(-3, 5);
        while (y0 === 0 && y1 === 0) y1 = rng.int(-3, 5);
        const x1 = x0 + dx;
        const ans = Q.of(a * dx * (y0 + y1), 2);
        const mean = Q.of(y0 + y1, 2);
        return numberProblem({
          prompt: t(
            `Find the work done by $\\mathbf{F} = \\langle ${poly([a, "y"])}, 0 \\rangle$ on a particle moving along the segment from $(${x0}, ${y0})$ to $(${x1}, ${y1})$.`,
            `求 $\\mathbf{F} = \\langle ${poly([a, "y"])}, 0 \\rangle$ 对沿从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的线段运动的质点所做的功。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * dx * y1,
              `That uses the end value $y = ${y1}$ throughout; $y$ changes along the segment, so use its average.`,
              `那是全程都用终点的值 $y = ${y1}$；$y$ 沿线段变化，要用平均值。`,
            ),
            why(
              a * dx * y0,
              `That uses the start value $y = ${y0}$ throughout; $y$ changes along the segment, so use its average.`,
              `那是全程都用起点的值 $y = ${y0}$；$y$ 沿线段变化，要用平均值。`,
            ),
            why(
              Q.of(a * (y1 - y0) * (x0 + x1), 2),
              "That uses the average of $x$ times $\\Delta y$; for $\\langle ay, 0 \\rangle$ the work is $a$ times the average of $y$ times $\\Delta x$.",
              "那是用了 $x$ 的平均值乘 $\\Delta y$；对 $\\langle ay, 0 \\rangle$，功是 $a$ 乘 $y$ 的平均值再乘 $\\Delta x$。",
            ),
            why(
              a * dx * (y0 + y1),
              "That adds the end values of $y$ without halving; the average is half their sum.",
              "那是把 $y$ 的两端值相加后没有除以 $2$；平均值是和的一半。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Keep the dx term", "保留 dx 项"],
                t(
                  `$W = \\int_C ${poly([a, "y"])}\\,dx$, since the second component is $0$.`,
                  `$W = \\int_C ${poly([a, "y"])}\\,dx$，因为第二个分量是 $0$。`,
                ),
              ],
              [
                ["Average y", "求 y 的平均值"],
                t(
                  `$y$ changes steadily from $${y0}$ to $${y1}$, so it averages $\\frac{${y0} + ${paren(y1)}}{2} = ${mean.toLatex()}$, while $\\Delta x = ${dx}$.`,
                  `$y$ 从 $${y0}$ 匀速变到 $${y1}$，平均值为 $\\frac{${y0} + ${paren(y1)}}{2} = ${mean.toLatex()}$，而 $\\Delta x = ${dx}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `$W = ${a} \\cdot ${paren(dx)} \\cdot ${parenQ(mean)} = ${ans.toLatex()}$.`,
                  `$W = ${a} \\cdot ${paren(dx)} \\cdot ${parenQ(mean)} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `With $\\mathbf{r}(t) = (${poly([x0, ""], [dx, "t"])}, ${poly([y0, ""], [y1 - y0, "t"])})$, $0 \\le t \\le 1$: $\\int_0^1 ${paren(a)}(${poly([y0, ""], [y1 - y0, "t"])}) \\cdot ${paren(dx)}\\,dt = ${ans.toLatex()}$, as found.`,
              `取 $\\mathbf{r}(t) = (${poly([x0, ""], [dx, "t"])}, ${poly([y0, ""], [y1 - y0, "t"])})$，$0 \\le t \\le 1$：$\\int_0^1 ${paren(a)}(${poly([y0, ""], [y1 - y0, "t"])}) \\cdot ${paren(dx)}\\,dt = ${ans.toLatex()}$，与上面一致。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.22 The Fundamental Theorem of Line Integrals
// ---------------------------------------------------------------------------

/** theFundamentalTheoremOfLineIntegrals evaluates line integrals of gradient fields. */
export const theFundamentalTheoremOfLineIntegrals: TopicDef = {
  id: "the-fundamental-theorem-of-line-integrals",
  title: t("The Fundamental Theorem for Line Integrals", "曲线积分基本定理"),
  summary: t(
    "If $\\mathbf{F} = \\nabla f$ is conservative, then $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(\\mathbf{r}(b)) - f(\\mathbf{r}(a))$, which depends only on the endpoints of $C$.",
    "若 $\\mathbf{F} = \\nabla f$ 为保守场，则 $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(\\mathbf{r}(b)) - f(\\mathbf{r}(a))$，只取决于 $C$ 的端点。",
  ),
  intro: t(
    "Find $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle y, x \\rangle$ along any path from $(1, 2)$ to $(3, 5)$. The field is the gradient of $f(x, y) = xy$, so the integral is $f(3, 5) - f(1, 2) = 15 - 2 = 13$.\n\nCheck: along the straight segment $\\mathbf{r}(t) = (1 + 2t, 2 + 3t)$, $0 \\le t \\le 1$, the integrand is $(2 + 3t) \\cdot 2 + (1 + 2t) \\cdot 3 = 7 + 12t$, and $\\int_0^1 (7 + 12t)\\,dt = 13$.\n\nIn this lesson we evaluate line integrals of gradient fields from the values of a potential at the two ends, with no parametrization at all.",
    "对 $\\mathbf{F} = \\langle y, x \\rangle$，沿从 $(1, 2)$ 到 $(3, 5)$ 的任意路径求 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。这个场是 $f(x, y) = xy$ 的梯度，所以积分是 $f(3, 5) - f(1, 2) = 15 - 2 = 13$。\n\n检验：沿直线段 $\\mathbf{r}(t) = (1 + 2t, 2 + 3t)$，$0 \\le t \\le 1$，被积函数是 $(2 + 3t) \\cdot 2 + (1 + 2t) \\cdot 3 = 7 + 12t$，而 $\\int_0^1 (7 + 12t)\\,dt = 13$。\n\n本课我们由势函数在两端的值计算梯度场的线积分，完全不需要参数化。",
  ),
  prerequisites: ["gradient-vector-fields", "line-integrals-of-vector-valued-functions-over-parametric-curves"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-gradient-line-integrals-by-potential-endpoints",
      title: t("Evaluating gradient line integrals by potential endpoints", "通过势函数端点差计算梯度线积分"),
      explanation: t(
        "By the Fundamental Theorem of Line Integrals, if $\\mathbf{F} = \\nabla f$, then:\n\n$$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A),$$ where $A$ and $B$ are the initial and terminal points of $C$. For $f(x, y) = 4x^2 - y^2$ from $(1, 2)$ to $(3, 1)$: $f(3, 1) = 35$ and $f(1, 2) = 0$, so the integral is $35$.\n\n> **Watch out.** Take the value at the end minus the value at the start. Squares of negative coordinates are positive: $(-2)^2 = 4$.",
        "由曲线积分基本定理，若 $\\mathbf{F} = \\nabla f$，则：\n\n$$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A),$$ 其中 $A$ 与 $B$ 为曲线 $C$ 的起点与终点。对 $f(x, y) = 4x^2 - y^2$，从 $(1, 2)$ 到 $(3, 1)$：$f(3, 1) = 35$，$f(1, 2) = 0$，所以积分为 $35$。\n\n> **注意。** 用终点的值减起点的值。负坐标的平方是正的：$(-2)^2 = 4$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const x1 = rng.int(-2, 2);
        const y1 = rng.int(-2, 2);
        const x2Drawn = rng.int(-2, 2);
        const y2 = rng.int(-2, 2);
        const f = (x: number, y: number) => a * x * x + b * y * y;
        const fA = f(x1, y1);
        // When the drawn end has the same value as the start, moving x2 to 3 usually separates them.
        const x2 = f(x2Drawn, y2) === fA ? 3 : x2Drawn;
        const fB = f(x2, y2);
        const ans = fB - fA;
        const signedSquare = (v: number) => v * Math.abs(v);
        const at = (x: number, y: number) => `${a} \\cdot ${x * x} + ${paren(b)} \\cdot ${y * y}`;
        const xPart = a * (x2 * x2 - x1 * x1);
        const yPart = b * (y2 * y2 - y1 * y1);
        return numberProblem({
          prompt: t(
            `Find $\\int_C \\nabla f \\cdot d\\mathbf{r}$ for $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ along any smooth curve $C$ starting at $A(${x1}, ${y1})$ and ending at $B(${x2}, ${y2})$.`,
            `求势函数 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ 的梯度场沿任意以 $A(${x1}, ${y1})$ 为起点、$B(${x2}, ${y2})$ 为终点的光滑曲线 $C$ 的积分 $\\int_C \\nabla f \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              fA - fB,
              "That is the start value minus the end value; the theorem gives $f(B) - f(A)$.",
              "那是起点的值减终点的值；定理给出 $f(B) - f(A)$。",
            ),
            why(fB, "That is $f(B)$ alone; the value at the start must be subtracted.", "那只是 $f(B)$；还要减去起点处的值。"),
            why(fB + fA, "That adds the two values; the integral is their difference.", "那是把两个值相加；积分是它们的差。"),
            why(
              a * (signedSquare(x2) - signedSquare(x1)) + b * (signedSquare(y2) - signedSquare(y1)),
              "That keeps the sign of a negative coordinate when squaring it; a square is never negative.",
              "那是平方时保留了负坐标的符号；平方不会是负数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the theorem", "利用基本定理"],
                t(
                  "$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$, whatever the path.",
                  "无论路径如何，$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$。",
                ),
              ],
              [
                ["Evaluate at the end", "求终点处的值"],
                t(`$f(${x2}, ${y2}) = ${at(x2, y2)} = ${fB}$.`, `$f(${x2}, ${y2}) = ${at(x2, y2)} = ${fB}$。`),
              ],
              [
                ["Evaluate at the start", "求起点处的值"],
                t(`$f(${x1}, ${y1}) = ${at(x1, y1)} = ${fA}$.`, `$f(${x1}, ${y1}) = ${at(x1, y1)} = ${fA}$。`),
              ],
              [["Subtract", "相减"], t(`$${fB} - ${paren(fA)} = ${ans}$.`, `$${fB} - ${paren(fA)} = ${ans}$。`)],
            ],
            t(
              `Term by term: the $x^2$ part changes by $${a} \\cdot (${x2 * x2} - ${x1 * x1}) = ${xPart}$ and the $y^2$ part by $${paren(b)} \\cdot (${y2 * y2} - ${y1 * y1}) = ${yPart}$, and $${xPart} + ${paren(yPart)} = ${ans}$.`,
              `逐项计算：$x^2$ 部分改变 $${a} \\cdot (${x2 * x2} - ${x1 * x1}) = ${xPart}$，$y^2$ 部分改变 $${paren(b)} \\cdot (${y2 * y2} - ${y1 * y1}) = ${yPart}$，而 $${xPart} + ${paren(yPart)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "evaluating-a-gradient-integral-with-a-mixed-term",
      title: t("A gradient integral with a mixed term", "含交叉项的梯度场积分"),
      explanation: t(
        "If $\\mathbf{F} = \\nabla f$ and $C$ runs from $A$ to $B$, then $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(B) - f(A)$, whatever the path. When $\\mathbf{F}$ is given by its components, first recognize the potential. For $f = ax^2y + by$ the gradient is $\\langle 2axy, ax^2 + b \\rangle$, so the integral of that field is a difference of two values of $ax^2y + by$. For $\\mathbf{F} = \\langle 2xy, x^2 + 7 \\rangle = \\nabla(x^2y + 7y)$ from $(0, 0)$ to $(2, 1)$, the integral is $4 + 7 = 11$.\n\n> **Watch out.** The constant $b$ in the second component comes from the term $by$ in $f$; leaving it out loses $b$ times the change in $y$.",
        "若 $\\mathbf{F} = \\nabla f$ 且 $C$ 从 $A$ 到 $B$，则无论路径如何，$\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(B) - f(A)$。当 $\\mathbf{F}$ 以分量给出时，先认出势函数。对 $f = ax^2y + by$，梯度为 $\\langle 2axy, ax^2 + b \\rangle$，所以该场的积分是 $ax^2y + by$ 两个值之差。对 $\\mathbf{F} = \\langle 2xy, x^2 + 7 \\rangle = \\nabla(x^2y + 7y)$，从 $(0, 0)$ 到 $(2, 1)$，积分为 $4 + 7 = 11$。\n\n> **注意。** 第二个分量中的常数 $b$ 来自 $f$ 中的项 $by$；漏掉它就少了 $b$ 乘以 $y$ 的变化量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-5, 5);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        const f = (x: number, y: number) => a * x * x * y + b * y;
        const fA = f(x0, y0);
        let x1 = rng.int(-3, 3);
        let y1 = rng.int(-3, 3);
        while (f(x1, y1) === fA) {
          x1 = rng.int(-3, 3);
          y1 = rng.int(-3, 3);
        }
        const fB = f(x1, y1);
        const ans = fB - fA;
        const leg1 = a * y0 * (x1 * x1 - x0 * x0);
        const leg2 = (a * x1 * x1 + b) * (y1 - y0);
        return numberProblem({
          prompt: t(
            `$\\mathbf{F} = \\nabla f$ with $f(x, y) = ${poly([a, "x^2y"], [b, "y"])}$, so $\\mathbf{F} = \\langle ${poly([2 * a, "xy"])}, ${poly([a, "x^2"], [b, ""])} \\rangle$. Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ along any path from $(${x0}, ${y0})$ to $(${x1}, ${y1})$.`,
            `$\\mathbf{F} = \\nabla f$，$f(x, y) = ${poly([a, "x^2y"], [b, "y"])}$，即 $\\mathbf{F} = \\langle ${poly([2 * a, "xy"])}, ${poly([a, "x^2"], [b, ""])} \\rangle$。沿从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的任意路径计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              -ans,
              "That is the start value minus the end value; the integral is $f(B) - f(A)$.",
              "那是起点的值减终点的值；积分是 $f(B) - f(A)$。",
            ),
            why(fB, "That is $f$ at the end alone; the value at the start must be subtracted.", "那只是终点处的 $f$；还要减去起点处的值。"),
            why(fB + fA, "That adds the two values of $f$; the integral is their difference.", "那是把 $f$ 的两个值相加；积分是它们的差。"),
            why(
              ans - b * (y1 - y0),
              `That leaves out the term $${poly([b, "y"])}$ of $f$, which gives the constant $${b}$ in the second component.`,
              `那是漏掉了 $f$ 中的项 $${poly([b, "y"])}$，第二个分量中的常数 $${b}$ 正来自它。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Confirm the potential", "确认势函数"],
                t(
                  `$\\frac{\\partial f}{\\partial x} = ${poly([2 * a, "xy"])}$ and $\\frac{\\partial f}{\\partial y} = ${poly([a, "x^2"], [b, ""])}$, the two components of $\\mathbf{F}$.`,
                  `$\\frac{\\partial f}{\\partial x} = ${poly([2 * a, "xy"])}$，$\\frac{\\partial f}{\\partial y} = ${poly([a, "x^2"], [b, ""])}$，正是 $\\mathbf{F}$ 的两个分量。`,
                ),
              ],
              [
                ["Evaluate at the ends", "求两端的值"],
                t(`$f(${x1}, ${y1}) = ${fB}$ and $f(${x0}, ${y0}) = ${fA}$.`, `$f(${x1}, ${y1}) = ${fB}$，$f(${x0}, ${y0}) = ${fA}$。`),
              ],
              [["Subtract", "相减"], t(`$${fB} - ${paren(fA)} = ${ans}$.`, `$${fB} - ${paren(fA)} = ${ans}$。`)],
            ],
            t(
              `Take the path that first moves along $y = ${y0}$ to $x = ${x1}$, then along $x = ${x1}$ to $y = ${y1}$. The first leg gives $\\int ${poly([2 * a * y0, "x"])}\\,dx = ${leg1}$, the second gives $\\int (${poly([a * x1 * x1 + b, ""])})\\,dy = ${leg2}$, and $${leg1} + ${paren(leg2)} = ${ans}$.`,
              `取先沿 $y = ${y0}$ 走到 $x = ${x1}$、再沿 $x = ${x1}$ 走到 $y = ${y1}$ 的路径。第一段给出 $\\int ${poly([2 * a * y0, "x"])}\\,dx = ${leg1}$，第二段给出 $\\int (${poly([a * x1 * x1 + b, ""])})\\,dy = ${leg2}$，而 $${leg1} + ${paren(leg2)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** pathIndependenceOfLineIntegrals characterizes conservative vector fields. */
export const pathIndependenceOfLineIntegrals: TopicDef = {
  id: "path-independence-of-line-integrals",
  title: t("Path Independence of Line Integrals", "曲线积分的路径无关性"),
  summary: t(
    "On a connected domain $D$, the line integral $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ is independent of path if and only if $\\mathbf{F} = \\nabla f$ is a gradient field on $D$.",
    "在连通区域 $D$ 上，线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 与路径无关，当且仅当 $\\mathbf{F} = \\nabla f$ 是 $D$ 上的梯度场。",
  ),
  intro: t(
    "Compare two paths from $(0, 0)$ to $(2, 3)$ for $\\mathbf{F} = \\langle 2xy, x^2 \\rangle$. Along the straight segment $\\mathbf{r}(t) = (2t, 3t)$, the integrand is $12t^2 \\cdot 2 + 4t^2 \\cdot 3 = 36t^2$, and $\\int_0^1 36t^2\\,dt = 12$. Along the $x$-axis to $(2, 0)$ and then up, the first leg gives $0$ since $y = 0$ and $dy = 0$, and the second gives $\\int_0^3 4\\,dy = 12$. Both paths give $12$.\n\nCheck: $\\mathbf{F} = \\nabla(x^2y)$, and $x^2y$ is $12$ at $(2, 3)$ and $0$ at $(0, 0)$.\n\nIn this lesson we see that a line integral is independent of path exactly when the field has a potential, and test a field for this with $P_y = Q_x$.",
    "对 $\\mathbf{F} = \\langle 2xy, x^2 \\rangle$，比较从 $(0, 0)$ 到 $(2, 3)$ 的两条路径。沿直线段 $\\mathbf{r}(t) = (2t, 3t)$，被积函数是 $12t^2 \\cdot 2 + 4t^2 \\cdot 3 = 36t^2$，而 $\\int_0^1 36t^2\\,dt = 12$。先沿 $x$ 轴到 $(2, 0)$ 再向上，第一段因 $y = 0$、$dy = 0$ 给出 $0$，第二段给出 $\\int_0^3 4\\,dy = 12$。两条路径都得 $12$。\n\n检验：$\\mathbf{F} = \\nabla(x^2y)$，而 $x^2y$ 在 $(2, 3)$ 处为 $12$，在 $(0, 0)$ 处为 $0$。\n\n本课我们看到：线积分与路径无关恰好当场有势函数时成立，并用 $P_y = Q_x$ 来检验。",
  ),
  prerequisites: ["the-fundamental-theorem-of-line-integrals"],
  encompasses: [{ topic: "the-fundamental-theorem-of-line-integrals", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "equivalence-of-path-independence-and-conservative-fields",
      title: t("Equivalence of path independence and conservative fields", "路径无关性与保守场的等价性"),
      explanation: t(
        "On an open connected region $D$, the following statements are logically equivalent:\n1. $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ is path independent.\n2. $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = 0$ for every closed loop.\n3. $\\mathbf{F} = \\nabla f$ for some potential function $f$.\n\nFor $\\mathbf{F} = \\nabla(x^2 + 9y^2)$, every path from $(0, 0)$ to $(2, 1)$ gives $4 + 9 = 13$, and every closed loop gives $0$.\n\n> **Watch out.** Path independence lets any path be used, but the value is still $f(B) - f(A)$, the end minus the start; it equals $f(B)$ only when $f(A) = 0$.",
        "在开连通区域 $D$ 上，下列命题等价：\n1. 曲线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 与路径无关。\n2. 沿任意闭曲线的环量 $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = 0$。\n3. 存在标量势函数 $f$ 使得 $\\mathbf{F} = \\nabla f$。\n\n对 $\\mathbf{F} = \\nabla(x^2 + 9y^2)$，从 $(0, 0)$ 到 $(2, 1)$ 的每条路径都给出 $4 + 9 = 13$，每条闭路都给出 $0$。\n\n> **注意。** 路径无关允许任选路径，但值仍是 $f(B) - f(A)$，即终点减起点；只有 $f(A) = 0$ 时它才等于 $f(B)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const x1 = rng.int(0, 3);
        const y1 = rng.int(0, 3);
        const x2 = rng.int(1, 5);
        const y2 = rng.int(1, 5);
        const fA = a * x1 * x1 + b * y1 * y1;
        const fB = a * x2 * x2 + b * y2 * y2;
        const ans = fB - fA;
        const xPart = a * (x2 * x2 - x1 * x1);
        const yPart = b * (y2 * y2 - y1 * y1);
        return numberProblem({
          prompt: t(
            `Since $\\mathbf{F} = \\nabla (${poly([a, "x^2"], [b, "y^2"])})$ is conservative, the line integral $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ is path independent. Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ along any path starting at $A(${x1}, ${y1})$ and ending at $B(${x2}, ${y2})$.`,
            `已知 $\\mathbf{F} = \\nabla (${poly([a, "x^2"], [b, "y^2"])})$ 为保守场，曲线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 具有路径无关性。求沿任意起点为 $A(${x1}, ${y1})$、终点为 $B(${x2}, ${y2})$ 的路径积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              fA - fB,
              "That is the start value minus the end value; the integral is $f(B) - f(A)$.",
              "那是起点的值减终点的值；积分是 $f(B) - f(A)$。",
            ),
            why(fB, "That is $f(B)$ alone; the value at the start must be subtracted.", "那只是 $f(B)$；还要减去起点处的值。"),
            why(fB + fA, "That adds the two values; the integral is their difference.", "那是把两个值相加；积分是它们的差。"),
            why(
              xPart,
              "That keeps only the change in the $x^2$ term; the $y^2$ term changes too.",
              "那是只算了 $x^2$ 项的改变量；$y^2$ 项也在变。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the potential", "利用势函数"],
                t(
                  `$\\mathbf{F} = \\nabla f$ with $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$, so $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(B) - f(A)$ for every path.`,
                  `$\\mathbf{F} = \\nabla f$，其中 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$，所以对每条路径 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r} = f(B) - f(A)$。`,
                ),
              ],
              [
                ["Evaluate at the ends", "求两端的值"],
                t(
                  `$f(${x2}, ${y2}) = ${a} \\cdot ${x2 * x2} + ${b} \\cdot ${y2 * y2} = ${fB}$ and $f(${x1}, ${y1}) = ${a} \\cdot ${x1 * x1} + ${b} \\cdot ${y1 * y1} = ${fA}$.`,
                  `$f(${x2}, ${y2}) = ${a} \\cdot ${x2 * x2} + ${b} \\cdot ${y2 * y2} = ${fB}$，$f(${x1}, ${y1}) = ${a} \\cdot ${x1 * x1} + ${b} \\cdot ${y1 * y1} = ${fA}$。`,
                ),
              ],
              [["Subtract", "相减"], t(`$${fB} - ${fA} = ${ans}$.`, `$${fB} - ${fA} = ${ans}$。`)],
            ],
            t(
              `Term by term: the $x^2$ part changes by $${a} \\cdot (${x2 * x2} - ${x1 * x1}) = ${xPart}$ and the $y^2$ part by $${b} \\cdot (${y2 * y2} - ${y1 * y1}) = ${yPart}$, which add to $${ans}$.`,
              `逐项计算：$x^2$ 部分改变 $${a} \\cdot (${x2 * x2} - ${x1 * x1}) = ${xPart}$，$y^2$ 部分改变 $${b} \\cdot (${y2 * y2} - ${y1 * y1}) = ${yPart}$，合计 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "testing-a-linear-field-for-path-independence",
      title: t("Testing a field for path independence", "检验向量场的路径无关性"),
      explanation: t(
        "On the whole plane, which is simply connected, $\\int_C P\\,dx + Q\\,dy$ is path independent exactly when $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$ everywhere. For $\\mathbf{F} = \\langle ay + bx^2, cx + dy^3 \\rangle$ this means $a = c$: the terms $bx^2$ and $dy^3$ depend on one variable only and never affect the test. For $\\langle 2y + x^4, 7x + y^5 \\rangle$, $P_y = 2$ and $Q_x = 7$, so its integrals depend on the path.\n\n> **Watch out.** Differentiate $P$ with respect to $y$ and $Q$ with respect to $x$, not $P_x$ and $Q_y$.",
        "在整个平面（单连通）上，$\\int_C P\\,dx + Q\\,dy$ 与路径无关当且仅当处处 $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$。对 $\\mathbf{F} = \\langle ay + bx^2, cx + dy^3 \\rangle$，这意味着 $a = c$：项 $bx^2$ 与 $dy^3$ 只依赖一个变量，从不影响检验。对 $\\langle 2y + x^4, 7x + y^5 \\rangle$，$P_y = 2$，$Q_x = 7$，所以它的积分依赖于路径。\n\n> **注意。** 要对 $P$ 关于 $y$ 求导、对 $Q$ 关于 $x$ 求导，而不是求 $P_x$ 和 $Q_y$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const indep = rng.int(0, 1) === 0;
        let c = indep ? a : rng.nonZero(-5, 5);
        if (!indep && c === a) c = -a;
        const b = rng.nonZero(-4, 4);
        const d = rng.nonZero(-4, 4);
        const yes = yesNo[0] as Text;
        const no = yesNo[1] as Text;
        const viaX = Q.of(b, 3).add(Q.of(c)).add(Q.of(d, 4));
        const viaY = Q.of(d, 4).add(Q.of(a)).add(Q.of(b, 3));
        return explainedChoice(rng, {
          prompt: t(
            `Is $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ independent of path in the plane for $\\mathbf{F} = \\langle ${poly([a, "y"], [b, "x^2"])}, ${poly([c, "x"], [d, "y^3"])} \\rangle$?`,
            `对 $\\mathbf{F} = \\langle ${poly([a, "y"], [b, "x^2"])}, ${poly([c, "x"], [d, "y^3"])} \\rangle$，$\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 在平面上与路径无关吗？`,
          ),
          correct: indep ? yes : no,
          wrong: [
            indep
              ? {
                  option: no,
                  why: t(
                    `$P_y = ${a}$ and $Q_x = ${c}$ agree everywhere; the terms $${poly([b, "x^2"])}$ and $${poly([d, "y^3"])}$ play no part in the test`,
                    `$P_y = ${a}$ 与 $Q_x = ${c}$ 处处相等；项 $${poly([b, "x^2"])}$ 和 $${poly([d, "y^3"])}$ 与检验无关`,
                  ),
                }
              : {
                  option: yes,
                  why: t(
                    `$P_y = ${a}$ but $Q_x = ${c}$; they differ, so the field has no potential`,
                    `$P_y = ${a}$，而 $Q_x = ${c}$；二者不等，所以场没有势函数`,
                  ),
                },
          ],
          solution: walked(
            [
              [
                ["Differentiate P in y", "对 P 关于 y 求导"],
                t(
                  `$\\frac{\\partial P}{\\partial y} = ${a}$, since $${poly([b, "x^2"])}$ does not involve $y$.`,
                  `$\\frac{\\partial P}{\\partial y} = ${a}$，因为 $${poly([b, "x^2"])}$ 不含 $y$。`,
                ),
              ],
              [
                ["Differentiate Q in x", "对 Q 关于 x 求导"],
                t(
                  `$\\frac{\\partial Q}{\\partial x} = ${c}$, since $${poly([d, "y^3"])}$ does not involve $x$.`,
                  `$\\frac{\\partial Q}{\\partial x} = ${c}$，因为 $${poly([d, "y^3"])}$ 不含 $x$。`,
                ),
              ],
              [
                ["Compare", "比较"],
                t(
                  indep
                    ? "They agree on the whole plane, so the field is conservative and the integral is path independent."
                    : "They differ, so the field is not conservative and the integral depends on the path.",
                  indep ? "二者在整个平面上相等，所以场是保守的，积分与路径无关。" : "二者不等，所以场不是保守的，积分依赖于路径。",
                ),
              ],
            ],
            indep
              ? t(
                  `A potential is $f = ${poly([a, "xy"], [Q.of(b, 3), "x^3"], [Q.of(d, 4), "y^4"])}$: its partial derivatives are $${poly([a, "y"], [b, "x^2"])}$ and $${poly([a, "x"], [d, "y^3"])}$.`,
                  `势函数为 $f = ${poly([a, "xy"], [Q.of(b, 3), "x^3"], [Q.of(d, 4), "y^4"])}$：它的偏导数是 $${poly([a, "y"], [b, "x^2"])}$ 和 $${poly([a, "x"], [d, "y^3"])}$。`,
                )
              : t(
                  `From $(0, 0)$ to $(1, 1)$, going along the $x$-axis first gives $${viaX.toLatex()}$, while going up the $y$-axis first gives $${viaY.toLatex()}$: two different values.`,
                  `从 $(0, 0)$ 到 $(1, 1)$，先沿 $x$ 轴走得 $${viaX.toLatex()}$，先沿 $y$ 轴走得 $${viaY.toLatex()}$：两个值不同。`,
                ),
          ),
        });
      },
    },
  ],
};

/** conservativeVectorFieldsAndClosedPaths establishes vanishing circulation around closed loops. */
export const conservativeVectorFieldsAndClosedPaths: TopicDef = {
  id: "conservative-vector-fields-and-closed-paths",
  title: t("Conservative Vector Fields and Closed Paths", "保守向量场与闭路径环量"),
  summary: t(
    "The circulation of a conservative vector field around every closed curve $C$ is zero: $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = 0$.",
    "保守向量场沿任意闭曲线 $C$ 的环量为零：$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = 0$。",
  ),
  intro: t(
    "Find $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle 0, x \\rangle$ counterclockwise around the square with corners $(0, 0)$, $(1, 0)$, $(1, 1)$ and $(0, 1)$. Only $x\\,dy$ counts. The bottom and top have $dy = 0$, the left side has $x = 0$, and the right side gives $\\int_0^1 1\\,dy = 1$. The circulation is $1$, not $0$, so $\\mathbf{F}$ is not conservative.\n\nCheck: $P = 0$ and $Q = x$, so $P_y = 0$ while $Q_x = 1$; the test for a potential fails as well.\n\nIn this lesson we use closed paths: a conservative field has circulation $0$ around every one, so a single nonzero circulation rules out a potential.",
    "对 $\\mathbf{F} = \\langle 0, x \\rangle$，沿顶点为 $(0, 0)$、$(1, 0)$、$(1, 1)$、$(0, 1)$ 的正方形逆时针求 $\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。只有 $x\\,dy$ 起作用。底边和顶边上 $dy = 0$，左边上 $x = 0$，右边给出 $\\int_0^1 1\\,dy = 1$。环量是 $1$ 而不是 $0$，所以 $\\mathbf{F}$ 不是保守场。\n\n检验：$P = 0$，$Q = x$，所以 $P_y = 0$ 而 $Q_x = 1$；势函数的检验同样不成立。\n\n本课我们利用闭路径：保守场沿每条闭路径的环量都是 $0$，所以只要有一个环量不为零，就排除了势函数。",
  ),
  prerequisites: ["path-independence-of-line-integrals"],
  encompasses: [{ topic: "path-independence-of-line-integrals", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "vanishing-of-circulation-in-conservative-fields",
      title: t("Vanishing of circulation in conservative fields", "保守场沿闭路径环量的消失性"),
      explanation: t(
        "For any closed path $C$, the starting point $A$ and ending point $B$ coincide ($B = A$). By the Fundamental Theorem:\n\n$$\\oint_C \\nabla f \\cdot d\\mathbf{r} = f(A) - f(A) = 0.$$\n\nSo $\\nabla(x^4y)$ has circulation $0$ around the square with corners $(0, 0)$, $(1, 0)$, $(1, 1)$, $(0, 1)$, with no edge-by-edge work needed.\n\n> **Watch out.** The answer is a difference of two equal values, so it is $0$; it is not the value of $f$ at the starting point.",
        "对于任意闭路径 $C$，起点 $A$ 与终点 $B$ 重合（$B = A$）。由基本定理：\n\n$$\\oint_C \\nabla f \\cdot d\\mathbf{r} = f(A) - f(A) = 0$$\n\n所以 $\\nabla(x^4y)$ 沿顶点为 $(0, 0)$、$(1, 0)$、$(1, 1)$、$(0, 1)$ 的正方形的环量是 $0$，无需逐边计算。\n\n> **注意。** 结果是两个相等的值之差，所以是 $0$；它不是 $f$ 在起点处的值。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const R = rng.int(2, 10);
        const ans = 0;
        const r = `${R}`;
        return numberProblem({
          prompt: t(
            `Evaluate the closed line integral $\\oint_C \\nabla f \\cdot d\\mathbf{r}$ for $f(x, y) = ${poly([a, "x^3"], [b, "y^3"])}$ around the circle $C: x^2 + y^2 = ${R * R}$ traversed counterclockwise.`,
            `计算闭曲线积分 $\\oint_C \\nabla f \\cdot d\\mathbf{r}$ 的值，其中 $f(x, y) = ${poly([a, "x^3"], [b, "y^3"])}$，曲线 $C$ 为沿逆时针方向遍历的圆周 $x^2 + y^2 = ${R * R}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * R ** 3,
              `That is $f(${r}, 0)$, the value at a point of the circle; the integral is the difference of $f$ at the two ends, which coincide.`,
              `那是 $f(${r}, 0)$，即圆上一点处的值；积分是 $f$ 在两端的值之差，而两端重合。`,
            ),
            why(
              b * R ** 3,
              `That is $f(0, ${r})$, the value at a point of the circle; the integral is the difference of $f$ at the two ends, which coincide.`,
              `那是 $f(0, ${r})$，即圆上一点处的值；积分是 $f$ 在两端的值之差，而两端重合。`,
            ),
            why(
              3 * a * R * R,
              `That is $\\frac{\\partial f}{\\partial x}$ at $(${r}, 0)$; the integral of a gradient around a closed path is $0$.`,
              `那是 $\\frac{\\partial f}{\\partial x}$ 在 $(${r}, 0)$ 处的值；梯度沿闭路径的积分是 $0$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Note the ends", "注意两端"],
                t("$C$ is closed, so it starts and ends at the same point $A$.", "$C$ 是闭合的，所以起点和终点是同一点 $A$。"),
              ],
              [
                ["Apply the theorem", "应用基本定理"],
                t(
                  "$\\oint_C \\nabla f \\cdot d\\mathbf{r} = f(A) - f(A) = 0$.",
                  "$\\oint_C \\nabla f \\cdot d\\mathbf{r} = f(A) - f(A) = 0$。",
                ),
              ],
            ],
            t(
              `With $\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$ the integrand is $\\frac{d}{dt} f(\\mathbf{r}(t))$, so the integral over $0 \\le t \\le 2\\pi$ is $f(\\mathbf{r}(2\\pi)) - f(\\mathbf{r}(0)) = f(${r}, 0) - f(${r}, 0) = 0$.`,
              `取 $\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$，被积函数是 $\\frac{d}{dt} f(\\mathbf{r}(t))$，所以在 $0 \\le t \\le 2\\pi$ 上的积分是 $f(\\mathbf{r}(2\\pi)) - f(\\mathbf{r}(0)) = f(${r}, 0) - f(${r}, 0) = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-nonzero-circulation-rules-out-a-potential",
      figure: multivariableDrawings6["conservative-vector-fields-and-closed-paths#a-nonzero-circulation-rules-out-a-potential"],
      title: t("A nonzero circulation rules out a potential", "非零环量说明不存在势函数"),
      explanation: t(
        "If $\\mathbf{F}$ is conservative, its circulation around every closed curve is $0$. So a single closed curve with nonzero circulation proves that $\\mathbf{F}$ has no potential. For $\\mathbf{F} = \\langle -ay, bx \\rangle$ around the counterclockwise circle of radius $R$, with $\\mathbf{r}(t) = (R\\cos t, R\\sin t)$,\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi} (aR^2\\sin^2 t + bR^2\\cos^2 t)\\,dt = (a + b)\\pi R^2.$$\n\nThis is nonzero unless $b = -a$, and $\\langle -ay, -ax \\rangle = \\nabla(-axy)$ is indeed conservative. For $\\langle -5y, 2x \\rangle$ around the unit circle the circulation is $7\\pi$.\n\n> **Watch out.** Over a full turn, $\\sin^2 t$ and $\\cos^2 t$ each integrate to $\\pi$, not $2\\pi$. A nonzero circulation proves there is no potential, but a zero circulation on one loop proves nothing.",
        "若 $\\mathbf{F}$ 是保守的，它沿每条闭曲线的环量都是 $0$。所以只要有一条闭曲线的环量不为零，就证明了 $\\mathbf{F}$ 没有势函数。对 $\\mathbf{F} = \\langle -ay, bx \\rangle$ 沿半径为 $R$ 的逆时针圆，$\\mathbf{r}(t) = (R\\cos t, R\\sin t)$，\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi} (aR^2\\sin^2 t + bR^2\\cos^2 t)\\,dt = (a + b)\\pi R^2$$\n\n除非 $b = -a$，这都不为零；而 $\\langle -ay, -ax \\rangle = \\nabla(-axy)$ 确实是保守的。对 $\\langle -5y, 2x \\rangle$ 沿单位圆，环量为 $7\\pi$。\n\n> **注意。** 在一整圈上，$\\sin^2 t$ 与 $\\cos^2 t$ 的积分各为 $\\pi$，不是 $2\\pi$。非零环量证明没有势函数，但一条闭路上环量为零什么也证明不了。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        let b = rng.nonZero(-4, 4);
        if (b === -a) b = a;
        const R = rng.int(1, 4);
        const ans = (a + b) * R * R;
        const r = R === 1 ? "" : `${R}`;
        return numberProblem({
          prompt: t(
            `Find $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle ${poly([-a, "y"])}, ${poly([b, "x"])} \\rangle$ around the circle $x^2 + y^2 = ${R * R}$, counterclockwise. A nonzero answer shows $\\mathbf{F}$ is not conservative.`,
            `沿逆时针方向的圆 $x^2 + y^2 = ${R * R}$，对 $\\mathbf{F} = \\langle ${poly([-a, "y"])}, ${poly([b, "x"])} \\rangle$ 求 $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。非零的结果说明 $\\mathbf{F}$ 不是保守的。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              0,
              "That assumes the field is conservative, which is what the circulation tests; here it is not $0$.",
              "那是假设场是保守的，而这正是环量要检验的；这里它不为 $0$。",
            ),
            why(
              (b - a) * R * R,
              "That takes the first product as negative; $(-aR\\sin t)(-R\\sin t) = aR^2\\sin^2 t$.",
              "那是把第一个乘积当成了负的；$(-aR\\sin t)(-R\\sin t) = aR^2\\sin^2 t$。",
            ),
            why(
              2 * (a + b) * R * R,
              "That integrates $\\sin^2 t$ and $\\cos^2 t$ to $2\\pi$ over a full turn; each gives $\\pi$.",
              "那是把 $\\sin^2 t$ 与 $\\cos^2 t$ 在一整圈上的积分算成 $2\\pi$；它们各为 $\\pi$。",
            ),
            why(
              (a + b) * R,
              "That uses $R$ instead of $R^2$; one factor $R$ comes from the field and one from the velocity.",
              "那是用了 $R$ 而不是 $R^2$；一个因子 $R$ 来自场，另一个来自速度。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(
                  `$\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$ and $\\mathbf{r}'(t) = (-${r}\\sin t, ${r}\\cos t)$, $0 \\le t \\le 2\\pi$.`,
                  `$\\mathbf{r}(t) = (${r}\\cos t, ${r}\\sin t)$，$\\mathbf{r}'(t) = (-${r}\\sin t, ${r}\\cos t)$，$0 \\le t \\le 2\\pi$。`,
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                t(
                  `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${poly([a * R * R, "\\sin^2 t"], [b * R * R, "\\cos^2 t"])}$.`,
                  `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${poly([a * R * R, "\\sin^2 t"], [b * R * R, "\\cos^2 t"])}$。`,
                ),
              ],
              [
                ["Integrate over a full turn", "在一整圈上积分"],
                t(
                  `Each of $\\sin^2 t$ and $\\cos^2 t$ integrates to $\\pi$, so the circulation is $(${a * R * R} + ${paren(b * R * R)})\\pi = ${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                  `$\\sin^2 t$ 与 $\\cos^2 t$ 的积分各为 $\\pi$，所以环量为 $(${a * R * R} + ${paren(b * R * R)})\\pi = ${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
                ),
              ],
            ],
            t(
              `Over a full turn $\\sin^2 t$ and $\\cos^2 t$ both average $\\frac{1}{2}$, so the integrand averages $\\frac{${ans}}{2}$; times the length $2\\pi$ of the interval this is $${ans}\\pi$.`,
              `在一整圈上 $\\sin^2 t$ 与 $\\cos^2 t$ 的平均值都是 $\\frac{1}{2}$，所以被积函数的平均值是 $\\frac{${ans}}{2}$；乘以区间长度 $2\\pi$ 得 $${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingPotentialFunctionsForLineIntegrals finds potentials by partial integration and evaluates line integrals with them. */
export const calculatingPotentialFunctionsForLineIntegrals: TopicDef = {
  id: "calculating-potential-functions-for-line-integrals",
  title: t("Calculating Potential Functions for Line Integrals", "求用于计算曲线积分的势函数"),
  summary: t(
    "To integrate a conservative field, determine the potential function f by partial integration and evaluate f(end) - f(start).",
    "对于保守向量场，先通过逐次偏积分确定势函数 f，再通过计算 f(终点) - f(起点) 快速求出曲线积分值。",
  ),
  intro: t(
    "Find $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle 8x + 5y, 5x \\rangle$ along any path from $(0, 0)$ to $(1, 2)$. Integrating the first component in $x$ gives $f = 4x^2 + 5xy + g(y)$. Then $f_y = 5x + g'(y)$ must equal $5x$, so $g'(y) = 0$ and $f = 4x^2 + 5xy$. The integral is $f(1, 2) - f(0, 0) = 4 + 10 = 14$.\n\nCheck: along $\\mathbf{r}(t) = (t, 2t)$, $0 \\le t \\le 1$, the integrand is $18t \\cdot 1 + 5t \\cdot 2 = 28t$, and $\\int_0^1 28t\\,dt = 14$.\n\nIn this lesson we build a potential from the components of a conservative field, one variable at a time, and use it to evaluate line integrals.",
    "对 $\\mathbf{F} = \\langle 8x + 5y, 5x \\rangle$，沿从 $(0, 0)$ 到 $(1, 2)$ 的任意路径求 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。把第一个分量对 $x$ 积分得 $f = 4x^2 + 5xy + g(y)$。于是 $f_y = 5x + g'(y)$ 必须等于 $5x$，所以 $g'(y) = 0$，$f = 4x^2 + 5xy$。积分为 $f(1, 2) - f(0, 0) = 4 + 10 = 14$。\n\n检验：沿 $\\mathbf{r}(t) = (t, 2t)$，$0 \\le t \\le 1$，被积函数是 $18t \\cdot 1 + 5t \\cdot 2 = 28t$，而 $\\int_0^1 28t\\,dt = 14$。\n\n本课我们由保守场的分量逐个变量地构造势函数，并用它计算线积分。",
  ),
  prerequisites: ["conservative-vector-fields-in-the-cartesian-plane", "the-fundamental-theorem-of-line-integrals"],
  encompasses: [
    {
      topic: "conservative-vector-fields-in-the-cartesian-plane",
      weight: 0.3,
    },
    { topic: "the-fundamental-theorem-of-line-integrals", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "recovering-potential-function-from-gradient-components",
      title: t("Recovering potential function from gradient components", "从梯度分量还原势函数并求积分"),
      explanation: t(
        "Integrate the first component with respect to its variable, then choose the leftover function of the other variable so that its partial derivative matches the second component. For $\\mathbf{F} = \\langle 2ax + by, bx + 2cy \\rangle$, the potential function is $f(x, y) = ax^2 + bxy + cy^2$. For $\\langle 10x + y, x - 6y \\rangle$ this gives $f = 5x^2 + xy - 3y^2$, and the integral from $(0, 0)$ to $(1, 1)$ is $5 + 1 - 3 = 3$.\n\n> **Watch out.** The term $bxy$ from the first integration already accounts for $bx$ in the second component, so $g'(y)$ is only $2cy$; counting $bxy$ twice is a common slip. Integrating also halves the coefficients: $2ax$ becomes $ax^2$.",
        "把第一个分量对其变量积分，再选择剩下的另一变量的函数，使它的偏导数与第二个分量一致。对于 $\\mathbf{F} = \\langle 2ax + by, bx + 2cy \\rangle$，其势函数为 $f(x, y) = ax^2 + bxy + cy^2$。对 $\\langle 10x + y, x - 6y \\rangle$，得 $f = 5x^2 + xy - 3y^2$，从 $(0, 0)$ 到 $(1, 1)$ 的积分为 $5 + 1 - 3 = 3$。\n\n> **注意。** 第一次积分得到的项 $bxy$ 已经给出了第二个分量中的 $bx$，所以 $g'(y)$ 只有 $2cy$；把 $bxy$ 算两次是常见错误。积分还会使系数减半：$2ax$ 变成 $ax^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const x0 = rng.int(1, 4);
        const y0 = rng.int(1, 4);
        const P = poly([2 * a, "x"], [b, "y"]);
        const Qc = poly([b, "x"], [2 * c, "y"]);
        const ans = a * x0 * x0 + b * x0 * y0 + c * y0 * y0;
        const f = poly([a, "x^2"], [b, "xy"], [c, "y^2"]);
        return numberProblem({
          prompt: t(
            `Find a potential function for $\\mathbf{F}(x, y) = \\langle ${P}, ${Qc} \\rangle$ and evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ along any path from $(0, 0)$ to $(${x0}, ${y0})$.`,
            `为向量场 $\\mathbf{F}(x, y) = \\langle ${P}, ${Qc} \\rangle$ 求势函数，并计算沿从 $(0, 0)$ 到 $(${x0}, ${y0})$ 任意路径的曲线积分 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              ans + b * x0 * y0,
              `That counts the term $${poly([b, "xy"])}$ twice; it comes once from integrating $P$ and already gives the $${poly([b, "x"])}$ in $Q$.`,
              `那是把项 $${poly([b, "xy"])}$ 算了两次；它由积分 $P$ 得到一次，并且已经给出了 $Q$ 中的 $${poly([b, "x"])}$。`,
            ),
            why(
              ans - c * y0 * y0,
              `That leaves out $g(y) = ${poly([c, "y^2"])}$, the part of $f$ found from the second component.`,
              `那是漏掉了 $g(y) = ${poly([c, "y^2"])}$，即由第二个分量求出的那部分 $f$。`,
            ),
            why(
              2 * a * x0 * x0 + b * x0 * y0 + 2 * c * y0 * y0,
              "That keeps the coefficients $2a$ and $2c$ of the field; integrating $2ax$ gives $ax^2$, not $2ax^2$.",
              "那是保留了场的系数 $2a$ 与 $2c$；$2ax$ 积分得 $ax^2$，不是 $2ax^2$。",
            ),
            why(
              -ans,
              "That is the start value minus the end value; the integral is $f(B) - f(A)$.",
              "那是起点的值减终点的值；积分是 $f(B) - f(A)$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate P in x", "对 P 关于 x 积分"],
                t(
                  `$f = \\int (${P})\\,dx = ${poly([a, "x^2"], [b, "xy"])} + g(y)$.`,
                  `$f = \\int (${P})\\,dx = ${poly([a, "x^2"], [b, "xy"])} + g(y)$。`,
                ),
              ],
              [
                ["Match Q", "与 Q 比较"],
                t(
                  `$f_y = ${poly([b, "x"])} + g'(y)$ must equal $${Qc}$, so $g'(y) = ${poly([2 * c, "y"])}$ and $g(y) = ${poly([c, "y^2"])}$.`,
                  `$f_y = ${poly([b, "x"])} + g'(y)$ 必须等于 $${Qc}$，所以 $g'(y) = ${poly([2 * c, "y"])}$，$g(y) = ${poly([c, "y^2"])}$。`,
                ),
              ],
              [["Write the potential", "写出势函数"], t(`$f(x, y) = ${f}$.`, `$f(x, y) = ${f}$。`)],
              [
                ["Evaluate at the ends", "代入两端"],
                t(
                  `$f(${x0}, ${y0}) - f(0, 0) = ${a} \\cdot ${x0 * x0} + ${paren(b)} \\cdot ${x0 * y0} + ${paren(c)} \\cdot ${y0 * y0} - 0 = ${ans}$.`,
                  `$f(${x0}, ${y0}) - f(0, 0) = ${a} \\cdot ${x0 * x0} + ${paren(b)} \\cdot ${x0 * y0} + ${paren(c)} \\cdot ${y0 * y0} - 0 = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Along the segment $\\mathbf{r}(t) = (${poly([x0, "t"])}, ${poly([y0, "t"])})$, $0 \\le t \\le 1$, the integrand is $${poly([2 * ans, "t"])}$, and its integral from $0$ to $1$ is half of $${2 * ans}$, which is $${ans}$.`,
              `沿线段 $\\mathbf{r}(t) = (${poly([x0, "t"])}, ${poly([y0, "t"])})$，$0 \\le t \\le 1$，被积函数是 $${poly([2 * ans, "t"])}$，它从 $0$ 到 $1$ 的积分是 $${2 * ans}$ 的一半，即 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-potential-function-with-a-cubic-term",
      title: t("A potential function with a cubic term", "含三次项的势函数"),
      explanation: t(
        "To find $f$ with $\\nabla f = \\langle P, Q \\rangle$, integrate $P$ in $x$, which leaves an unknown $g(y)$, then match $f_y$ with $Q$. For $\\mathbf{F} = \\langle 3ax^2y + b, ax^3 + 2cy \\rangle$:\n\n$$f = \\int (3ax^2y + b)\\,dx = ax^3y + bx + g(y), \\qquad f_y = ax^3 + g'(y) = ax^3 + 2cy,$$\n\nso $g(y) = cy^2$ and $f = ax^3y + bx + cy^2$. The line integral from $A$ to $B$ is $f(B) - f(A)$. For $\\langle 12x^2y + 1, 4x^3 + 2y \\rangle$, $f = 4x^3y + x + y^2$, and from $(0, 0)$ to $(1, 1)$ the integral is $6$.\n\n> **Watch out.** The constant $b$ in $P$ integrates to $bx$, and $g(y)$ comes only from $Q$; leaving out either term changes the answer.",
        "要求 $f$ 使 $\\nabla f = \\langle P, Q \\rangle$，先把 $P$ 对 $x$ 积分，留下未知的 $g(y)$，再让 $f_y$ 与 $Q$ 一致。对 $\\mathbf{F} = \\langle 3ax^2y + b, ax^3 + 2cy \\rangle$：\n\n$$f = \\int (3ax^2y + b)\\,dx = ax^3y + bx + g(y), \\qquad f_y = ax^3 + g'(y) = ax^3 + 2cy,$$\n\n所以 $g(y) = cy^2$，$f = ax^3y + bx + cy^2$。从 $A$ 到 $B$ 的线积分为 $f(B) - f(A)$。对 $\\langle 12x^2y + 1, 4x^3 + 2y \\rangle$，$f = 4x^3y + x + y^2$，从 $(0, 0)$ 到 $(1, 1)$ 的积分为 $6$。\n\n> **注意。** $P$ 中的常数 $b$ 积分得 $bx$，而 $g(y)$ 只来自 $Q$；漏掉任何一项都会改变结果。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-2, 2);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-3, 3);
        const x0 = rng.int(-2, 2);
        const y0 = rng.int(-2, 2);
        const x1 = rng.int(-2, 2);
        let y1 = rng.int(-2, 3);
        if (x1 === x0 && y1 === y0) y1 += 1;
        const f = (x: number, y: number) => a * x ** 3 * y + b * x + c * y * y;
        // f is quadratic in y, so at most two values of y repeat f(x0, y0), and this stops.
        while (f(x1, y1) === f(x0, y0)) y1 += 1;
        const fB = f(x1, y1);
        const fA = f(x0, y0);
        const ans = fB - fA;
        const cubic = a * (x1 ** 3 * y1 - x0 ** 3 * y0);
        const linear = b * (x1 - x0);
        const square = c * (y1 * y1 - y0 * y0);
        return numberProblem({
          prompt: t(
            `$\\mathbf{F} = \\langle ${poly([3 * a, "x^2y"], [b, ""])}, ${poly([a, "x^3"], [2 * c, "y"])} \\rangle$. Find a potential function and evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ along any path from $(${x0}, ${y0})$ to $(${x1}, ${y1})$.`,
            `$\\mathbf{F} = \\langle ${poly([3 * a, "x^2y"], [b, ""])}, ${poly([a, "x^3"], [2 * c, "y"])} \\rangle$。求势函数，并沿从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的任意路径计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              -ans,
              "That is the start value minus the end value; the integral is $f(B) - f(A)$.",
              "那是起点的值减终点的值；积分是 $f(B) - f(A)$。",
            ),
            why(
              ans - linear,
              `That leaves out $${poly([b, "x"])}$, which comes from integrating the constant $${b}$ in $P$.`,
              `那是漏掉了 $${poly([b, "x"])}$，它由 $P$ 中的常数 $${b}$ 积分得到。`,
            ),
            why(
              ans - square,
              `That leaves out $g(y) = ${poly([c, "y^2"])}$, which is found by matching $f_y$ with $Q$.`,
              `那是漏掉了 $g(y) = ${poly([c, "y^2"])}$，它由 $f_y$ 与 $Q$ 比较得出。`,
            ),
            why(fB + fA, "That adds the two values of $f$; the integral is their difference.", "那是把 $f$ 的两个值相加；积分是它们的差。"),
          ]),
          solution: walked(
            [
              [
                ["Integrate P in x", "对 P 关于 x 积分"],
                t(`$f = ${poly([a, "x^3y"], [b, "x"])} + g(y)$.`, `$f = ${poly([a, "x^3y"], [b, "x"])} + g(y)$。`),
              ],
              [
                ["Match Q", "与 Q 比较"],
                t(
                  `$f_y = ${poly([a, "x^3"])} + g'(y)$ must equal $${poly([a, "x^3"], [2 * c, "y"])}$, so $g(y) = ${poly([c, "y^2"])}$ and $f = ${poly([a, "x^3y"], [b, "x"], [c, "y^2"])}$.`,
                  `$f_y = ${poly([a, "x^3"])} + g'(y)$ 必须等于 $${poly([a, "x^3"], [2 * c, "y"])}$，所以 $g(y) = ${poly([c, "y^2"])}$，$f = ${poly([a, "x^3y"], [b, "x"], [c, "y^2"])}$。`,
                ),
              ],
              [
                ["Evaluate at the ends", "求两端的值"],
                t(`$f(${x1}, ${y1}) = ${fB}$ and $f(${x0}, ${y0}) = ${fA}$.`, `$f(${x1}, ${y1}) = ${fB}$，$f(${x0}, ${y0}) = ${fA}$。`),
              ],
              [["Subtract", "相减"], t(`$${fB} - ${paren(fA)} = ${ans}$.`, `$${fB} - ${paren(fA)} = ${ans}$。`)],
            ],
            t(
              `Term by term: $${poly([a, "x^3y"])}$ changes by $${cubic}$, $${poly([b, "x"])}$ by $${linear}$ and $${poly([c, "y^2"])}$ by $${square}$, and $${cubic} + ${paren(linear)} + ${paren(square)} = ${ans}$.`,
              `逐项计算：$${poly([a, "x^3y"])}$ 改变 $${cubic}$，$${poly([b, "x"])}$ 改变 $${linear}$，$${poly([c, "y^2"])}$ 改变 $${square}$，而 $${cubic} + ${paren(linear)} + ${paren(square)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** lineIntegralsOfConservativeVectorFieldsInThreeDimensions evaluates 3D conservative line integrals. */
export const lineIntegralsOfConservativeVectorFieldsInThreeDimensions: TopicDef = {
  id: "line-integrals-of-conservative-vector-fields-in-three-dimensions",
  title: t("Line Integrals of Conservative Vector Fields in Three Dimensions", "三维保守向量场的曲线积分"),
  summary: t(
    "In $\\mathbb{R}^3$, a conservative line integral $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(P_2) - f(P_1)$ depends only on the endpoints.",
    "在 $\\mathbb{R}^3$ 中，保守场的线积分 $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(P_2) - f(P_1)$ 只取决于端点。",
  ),
  intro: t(
    "Find $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle y, x, 6z \\rangle$ along any path from $(0, 0, 0)$ to $(2, 1, 1)$. The field is the gradient of $f = xy + 3z^2$, so the integral is $f(2, 1, 1) - f(0, 0, 0) = 2 + 3 = 5$.\n\nCheck: along $\\mathbf{r}(t) = (2t, t, t)$, $0 \\le t \\le 1$, the integrand is $t \\cdot 2 + 2t \\cdot 1 + 6t \\cdot 1 = 10t$, and $\\int_0^1 10t\\,dt = 5$.\n\nIn this lesson we carry the fundamental theorem into space: a gradient field in three variables is integrated from the values of its potential at the two ends.",
    "对 $\\mathbf{F} = \\langle y, x, 6z \\rangle$，沿从 $(0, 0, 0)$ 到 $(2, 1, 1)$ 的任意路径求 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。这个场是 $f = xy + 3z^2$ 的梯度，所以积分为 $f(2, 1, 1) - f(0, 0, 0) = 2 + 3 = 5$。\n\n检验：沿 $\\mathbf{r}(t) = (2t, t, t)$，$0 \\le t \\le 1$，被积函数是 $t \\cdot 2 + 2t \\cdot 1 + 6t \\cdot 1 = 10t$，而 $\\int_0^1 10t\\,dt = 5$。\n\n本课我们把基本定理推广到空间：三元梯度场的积分由势函数在两端的值求得。",
  ),
  prerequisites: ["calculating-potential-functions-for-line-integrals"],
  encompasses: [
    {
      topic: "calculating-potential-functions-for-line-integrals",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "three-dimensional-gradient-theorem",
      title: t("Three-dimensional gradient theorem", "三维梯度定理计算曲线积分"),
      explanation: t(
        "The line integral of a gradient field depends only on the endpoints, so evaluate the potential at the end and the start and subtract. For $f(x, y, z) = ax^2 + by^2 + cz^2$, $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(x_2, y_2, z_2) - f(x_1, y_1, z_1)$. For $f = 4x^2 - y^2 + z^2$ from $(1, 0, 1)$ to $(2, 1, 0)$: $f(2, 1, 0) = 15$ and $f(1, 0, 1) = 5$, so the integral is $10$.\n\n> **Watch out.** There are now three terms at each end; evaluate all of them, and remember that a negative coordinate squared is positive.",
        "梯度场的曲线积分只取决于端点，所以在终点和起点分别计算势函数再相减。对于势函数 $f(x, y, z) = ax^2 + by^2 + cz^2$，$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(x_2, y_2, z_2) - f(x_1, y_1, z_1)$。对 $f = 4x^2 - y^2 + z^2$，从 $(1, 0, 1)$ 到 $(2, 1, 0)$：$f(2, 1, 0) = 15$，$f(1, 0, 1) = 5$，所以积分为 $10$。\n\n> **注意。** 现在每一端都有三项，要全部算出；负坐标的平方是正的。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const x1 = rng.int(-2, 2);
        const y1 = rng.int(-2, 2);
        const z1 = rng.int(-2, 2);
        const x2 = rng.int(-2, 2);
        const y2 = rng.int(-2, 2);
        const z2 = rng.int(-2, 2);
        const fA = a * x1 * x1 + b * y1 * y1 + c * z1 * z1;
        const fB = a * x2 * x2 + b * y2 * y2 + c * z2 * z2;
        const ans = fB - fA;
        const signedSquare = (v: number) => v * Math.abs(v);
        const xPart = a * (x2 * x2 - x1 * x1);
        const yPart = b * (y2 * y2 - y1 * y1);
        const zPart = c * (z2 * z2 - z1 * z1);
        return numberProblem({
          prompt: t(
            `Find $\\int_C \\nabla f \\cdot d\\mathbf{r}$ for $f(x, y, z) = ${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])}$ along any curve $C$ from $A(${x1}, ${y1}, ${z1})$ to $B(${x2}, ${y2}, ${z2})$.`,
            `求三维势函数 $f(x, y, z) = ${poly([a, "x^2"], [b, "y^2"], [c, "z^2"])}$ 的梯度场沿从 $A(${x1}, ${y1}, ${z1})$ 到 $B(${x2}, ${y2}, ${z2})$ 的曲线积分 $\\int_C \\nabla f \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              fA - fB,
              "That is the start value minus the end value; the theorem gives $f(B) - f(A)$.",
              "那是起点的值减终点的值；定理给出 $f(B) - f(A)$。",
            ),
            why(fB, "That is $f(B)$ alone; the value at the start must be subtracted.", "那只是 $f(B)$；还要减去起点处的值。"),
            why(fB + fA, "That adds the two values; the integral is their difference.", "那是把两个值相加；积分是它们的差。"),
            why(
              a * (signedSquare(x2) - signedSquare(x1)) +
                b * (signedSquare(y2) - signedSquare(y1)) +
                c * (signedSquare(z2) - signedSquare(z1)),
              "That keeps the sign of a negative coordinate when squaring it; a square is never negative.",
              "那是平方时保留了负坐标的符号；平方不会是负数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the theorem", "利用基本定理"],
                t(
                  "$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$ in space as in the plane.",
                  "在空间中与在平面上一样，$\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$。",
                ),
              ],
              [
                ["Evaluate at the end", "求终点处的值"],
                t(
                  `$f(${x2}, ${y2}, ${z2}) = ${a} \\cdot ${x2 * x2} + ${paren(b)} \\cdot ${y2 * y2} + ${paren(c)} \\cdot ${z2 * z2} = ${fB}$.`,
                  `$f(${x2}, ${y2}, ${z2}) = ${a} \\cdot ${x2 * x2} + ${paren(b)} \\cdot ${y2 * y2} + ${paren(c)} \\cdot ${z2 * z2} = ${fB}$。`,
                ),
              ],
              [
                ["Evaluate at the start", "求起点处的值"],
                t(
                  `$f(${x1}, ${y1}, ${z1}) = ${a} \\cdot ${x1 * x1} + ${paren(b)} \\cdot ${y1 * y1} + ${paren(c)} \\cdot ${z1 * z1} = ${fA}$.`,
                  `$f(${x1}, ${y1}, ${z1}) = ${a} \\cdot ${x1 * x1} + ${paren(b)} \\cdot ${y1 * y1} + ${paren(c)} \\cdot ${z1 * z1} = ${fA}$。`,
                ),
              ],
              [["Subtract", "相减"], t(`$${fB} - ${paren(fA)} = ${ans}$.`, `$${fB} - ${paren(fA)} = ${ans}$。`)],
            ],
            t(
              `Term by term: the $x^2$, $y^2$ and $z^2$ parts change by $${xPart}$, $${yPart}$ and $${zPart}$, and $${xPart} + ${paren(yPart)} + ${paren(zPart)} = ${ans}$.`,
              `逐项计算：$x^2$、$y^2$、$z^2$ 部分分别改变 $${xPart}$、$${yPart}$、$${zPart}$，而 $${xPart} + ${paren(yPart)} + ${paren(zPart)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-three-dimensional-potential-with-a-product-term",
      title: t("A three-dimensional potential with a product term", "含乘积项的三维势函数"),
      explanation: t(
        "In space, $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$ just as in the plane. The field $\\mathbf{F} = \\langle ayz, axz, axy + 2bz \\rangle$ is the gradient of $f = axyz + bz^2$: differentiating $axyz$ gives $ayz$, $axz$ and $axy$, and $bz^2$ adds $2bz$ to the last component. So its line integral is a difference of two values of $axyz + bz^2$. For $\\langle 5yz, 5xz, 5xy + 2z \\rangle = \\nabla(5xyz + z^2)$ from $(0, 0, 0)$ to $(1, 1, 2)$, the integral is $10 + 4 = 14$.\n\n> **Watch out.** The last component holds two pieces: $axy$ from the product and $2bz$ from $bz^2$. The term $bz^2$ belongs in $f$; leaving it out loses $b$ times the change in $z^2$.",
        "在空间中同样有 $\\int_C \\nabla f \\cdot d\\mathbf{r} = f(B) - f(A)$。场 $\\mathbf{F} = \\langle ayz, axz, axy + 2bz \\rangle$ 是 $f = axyz + bz^2$ 的梯度：$axyz$ 的偏导为 $ayz$、$axz$ 与 $axy$，$bz^2$ 给最后一个分量加上 $2bz$。所以其线积分是 $axyz + bz^2$ 两个值之差。对 $\\langle 5yz, 5xz, 5xy + 2z \\rangle = \\nabla(5xyz + z^2)$，从 $(0, 0, 0)$ 到 $(1, 1, 2)$，积分为 $10 + 4 = 14$。\n\n> **注意。** 最后一个分量包含两部分：乘积项给出的 $axy$ 与 $bz^2$ 给出的 $2bz$。$bz^2$ 属于 $f$；漏掉它就少了 $b$ 乘以 $z^2$ 的变化量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const P0 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)] as const;
        const P1 = [rng.int(-2, 3), rng.int(-2, 3), rng.int(1, 3)] as const;
        const f = (p: readonly [number, number, number]) => a * p[0] * p[1] * p[2] + b * p[2] * p[2];
        const ans = f(P1) - f(P0);
        const pt = (p: readonly [number, number, number]) => `(${p[0]}, ${p[1]}, ${p[2]})`;
        const product = a * (P1[0] * P1[1] * P1[2] - P0[0] * P0[1] * P0[2]);
        const square = b * (P1[2] * P1[2] - P0[2] * P0[2]);
        return numberProblem({
          prompt: t(
            `Evaluate $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for $\\mathbf{F} = \\langle ${poly([a, "yz"])}, ${poly([a, "xz"])}, ${poly([a, "xy"], [2 * b, "z"])} \\rangle$ along any path from $${pt(P0)}$ to $${pt(P1)}$.`,
            `沿从 $${pt(P0)}$ 到 $${pt(P1)}$ 的任意路径，对 $\\mathbf{F} = \\langle ${poly([a, "yz"])}, ${poly([a, "xz"])}, ${poly([a, "xy"], [2 * b, "z"])} \\rangle$ 计算 $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              -ans,
              "That is the start value minus the end value; the integral is $f(B) - f(A)$.",
              "那是起点的值减终点的值；积分是 $f(B) - f(A)$。",
            ),
            why(
              f(P1),
              "That is $f$ at the end alone; the value at the start must be subtracted.",
              "那只是终点处的 $f$；还要减去起点处的值。",
            ),
            why(
              f(P1) + f(P0),
              "That adds the two values of $f$; the integral is their difference.",
              "那是把 $f$ 的两个值相加；积分是它们的差。",
            ),
            why(
              product,
              `That leaves out the term $${poly([b, "z^2"])}$ of $f$, which gives the $${poly([2 * b, "z"])}$ in the last component.`,
              `那是漏掉了 $f$ 中的项 $${poly([b, "z^2"])}$，最后一个分量中的 $${poly([2 * b, "z"])}$ 正来自它。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Name the potential", "写出势函数"],
                t(
                  `$\\mathbf{F} = \\nabla f$ with $f = ${poly([a, "xyz"], [b, "z^2"])}$: its partial derivatives are the three components.`,
                  `$\\mathbf{F} = \\nabla f$，$f = ${poly([a, "xyz"], [b, "z^2"])}$：它的三个偏导数正是三个分量。`,
                ),
              ],
              [
                ["Evaluate at the ends", "求两端的值"],
                t(`$f${pt(P1)} = ${f(P1)}$ and $f${pt(P0)} = ${f(P0)}$.`, `$f${pt(P1)} = ${f(P1)}$，$f${pt(P0)} = ${f(P0)}$。`),
              ],
              [["Subtract", "相减"], t(`$${f(P1)} - ${paren(f(P0))} = ${ans}$.`, `$${f(P1)} - ${paren(f(P0))} = ${ans}$。`)],
            ],
            t(
              `Term by term: $${poly([a, "xyz"])}$ changes by $${product}$ and $${poly([b, "z^2"])}$ by $${square}$, and $${product} + ${paren(square)} = ${ans}$.`,
              `逐项计算：$${poly([a, "xyz"])}$ 改变 $${product}$，$${poly([b, "z^2"])}$ 改变 $${square}$，而 $${product} + ${paren(square)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** conservationOfMechanicalEnergy links work by conservative forces to potential energy. */
export const conservationOfMechanicalEnergy: TopicDef = {
  id: "conservation-of-mechanical-energy",
  title: t("Conservation of Mechanical Energy", "机械能守恒定律"),
  summary: t(
    "Work done by a conservative force F = -∇U equals negative change in potential energy, ensuring total mechanical energy E = K + U remains constant.",
    "保守力 F = -∇U 所做的功等于势能增量的相反数，保证了系统总机械能 E = K + U 保持守恒。",
  ),
  intro: t(
    "A particle moving under a conservative force has kinetic energy $70\\text{ J}$ and potential energy $25\\text{ J}$ at $A$. At $B$ its potential energy is $10\\text{ J}$. The total $K + U = 95\\text{ J}$ stays the same, so its kinetic energy at $B$ is $95 - 10 = 85\\text{ J}$.\n\nCheck: the force does work $U(A) - U(B) = 15\\text{ J}$, and the kinetic energy rises by $85 - 70 = 15\\text{ J}$.\n\nIn this lesson we see why the fundamental theorem makes $K + U$ constant for a force $\\mathbf{F} = -\\nabla U$, and use it to find energies and speeds.",
    "一个在保守力作用下运动的质点，在 $A$ 处动能为 $70\\text{ J}$，势能为 $25\\text{ J}$。在 $B$ 处它的势能为 $10\\text{ J}$。总量 $K + U = 95\\text{ J}$ 保持不变，所以它在 $B$ 处的动能为 $95 - 10 = 85\\text{ J}$。\n\n检验：力做的功为 $U(A) - U(B) = 15\\text{ J}$，而动能增加了 $85 - 70 = 15\\text{ J}$。\n\n本课我们看到：对力 $\\mathbf{F} = -\\nabla U$，基本定理为什么使 $K + U$ 保持不变，并用它求能量与速率。",
  ),
  prerequisites: ["the-fundamental-theorem-of-line-integrals"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "kinetic-and-potential-energy-along-trajectories",
      title: t("Kinetic and potential energy along trajectories", "运动轨迹上的动能与势能转化"),
      explanation: t(
        "For a conservative force $\\mathbf{F} = -\\nabla U$, work relates to potential energy by $W = -\\Delta U = U_1 - U_2$. By the work-energy theorem, $W = \\Delta K = K_2 - K_1$, yielding conservation: $K_1 + U_1 = K_2 + U_2$. With $K_A = 5\\text{ J}$, $U_A = 90\\text{ J}$ and $U_B = 40\\text{ J}$, the particle has $K_B = 95 - 40 = 55\\text{ J}$.\n\n> **Watch out.** It is the total $K + U$ that stays fixed, so $K_B = K_A + U_A - U_B$. The potential energy that is lost becomes kinetic energy; adding $U_B$ instead gets the direction wrong.",
        "对于保守力 $\\mathbf{F} = -\\nabla U$，做功满足 $W = -\\Delta U = U_1 - U_2$。由动能定理 $W = \\Delta K = K_2 - K_1$，得到机械能守恒：$K_1 + U_1 = K_2 + U_2$。若 $K_A = 5\\text{ J}$，$U_A = 90\\text{ J}$，$U_B = 40\\text{ J}$，则质点的 $K_B = 95 - 40 = 55\\text{ J}$。\n\n> **注意。** 保持不变的是总量 $K + U$，所以 $K_B = K_A + U_A - U_B$。失去的势能变成动能；改为加上 $U_B$ 就把方向弄反了。",
      ),
      generate(rng: Rng): Problem {
        const K1 = rng.int(10, 60);
        const U1 = rng.int(20, 80);
        const U2 = rng.int(5, U1);
        const ans = K1 + U1 - U2;
        const E = K1 + U1;
        return numberProblem({
          prompt: t(
            `A particle moves in a conservative force field with potential energy $U$. At point $A$, it has kinetic energy $K_A = ${K1}\\text{ J}$ and potential energy $U_A = ${U1}\\text{ J}$. At point $B$, its potential energy is $U_B = ${U2}\\text{ J}$. Assuming no non-conservative forces act, find its kinetic energy $K_B$.`,
            `质点在势能为 $U$ 的保守力场中运动。在点 $A$ 处，其动能为 $K_A = ${K1}\\text{ J}$，势能为 $U_A = ${U1}\\text{ J}$。运动至点 $B$ 处时，其势能变为 $U_B = ${U2}\\text{ J}$。在无非保守力做功的情况下，求其在 $B$ 点处的动能 $K_B$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              K1 + U2,
              "That adds $U_B$ to $K_A$; the kinetic energy grows by the potential energy lost, $U_A - U_B$.",
              "那是把 $U_B$ 加到 $K_A$ 上；动能增加的是失去的势能 $U_A - U_B$。",
            ),
            why(U1 - U2, "That is only the change in kinetic energy; $K_A$ must be added to it.", "那只是动能的变化量；还要加上 $K_A$。"),
            why(
              E,
              "That is the total energy $K_A + U_A$; part of it is still potential energy at $B$.",
              "那是总能量 $K_A + U_A$；其中一部分在 $B$ 处仍是势能。",
            ),
            why(
              K1 - U1 + U2,
              "That has the energy flowing the wrong way; falling potential energy raises the kinetic energy.",
              "那是把能量转化的方向弄反了；势能下降，动能才增加。",
            ),
          ]),
          solution: walked(
            [
              [["Use conservation", "利用守恒"], t("$K_A + U_A = K_B + U_B$.", "$K_A + U_A = K_B + U_B$。")],
              [["Find the total", "求总能量"], t(`$E = ${K1} + ${U1} = ${E}\\text{ J}$.`, `$E = ${K1} + ${U1} = ${E}\\text{ J}$。`)],
              [
                ["Solve for the kinetic energy", "解出动能"],
                t(`$K_B = ${E} - ${U2} = ${ans}\\text{ J}$.`, `$K_B = ${E} - ${U2} = ${ans}\\text{ J}$。`),
              ],
            ],
            t(
              `The force does work $U_A - U_B = ${U1 - U2}\\text{ J}$, and the kinetic energy rises by $${ans} - ${K1} = ${ans - K1}\\text{ J}$, the same amount.`,
              `力做的功为 $U_A - U_B = ${U1 - U2}\\text{ J}$，而动能增加了 $${ans} - ${K1} = ${ans - K1}\\text{ J}$，二者相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "kinetic-energy-after-moving-through-a-conservative-field",
      title: t("Kinetic energy after moving through a conservative field", "在保守场中运动后的动能"),
      explanation: t(
        "If the only force is $\\mathbf{F} = -\\nabla U$, its work from $A$ to $B$ is $U(A) - U(B)$, and by the work–energy theorem this equals the change in kinetic energy. So $K + U$ stays constant:\n\n$$K_B = K_A + U(A) - U(B), \\qquad K_A = \\tfrac12 m v_A^2.$$\n\nMoving to lower potential energy speeds the particle up. A particle of mass $3$ with speed $4$ has $K_A = 24$; if $U(A) = 5$ and $U(B) = -7$, then $K_B = 24 + 12 = 36$.\n\n> **Watch out.** Kinetic energy is $\\tfrac12 mv^2$; leaving out the $\\tfrac12$ doubles it. The work is $U(A) - U(B)$, start minus end, because the force is the negative gradient.",
        "若唯一的力是 $\\mathbf{F} = -\\nabla U$，它从 $A$ 到 $B$ 做的功为 $U(A) - U(B)$，由动能定理这等于动能的变化。所以 $K + U$ 保持不变：\n\n$$K_B = K_A + U(A) - U(B), \\qquad K_A = \\tfrac12 m v_A^2$$\n\n移向较低势能时质点加速。质量为 $3$、速率为 $4$ 的质点有 $K_A = 24$；若 $U(A) = 5$，$U(B) = -7$，则 $K_B = 24 + 12 = 36$。\n\n> **注意。** 动能是 $\\tfrac12 mv^2$；漏掉 $\\tfrac12$ 会使它加倍。功是 $U(A) - U(B)$，起点减终点，因为力是负梯度。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.pick([2, 4, 6]);
        const v = rng.int(1, 5);
        const KA = (m * v * v) / 2;
        const UA = rng.int(-10, 20);
        const UB = UA + rng.int(-15, KA - 1);
        const ans = KA + UA - UB;
        return numberProblem({
          prompt: t(
            `A particle of mass $${m}$ moves under a force $\\mathbf{F} = -\\nabla U$ alone. At $A$ its speed is $${v}$ and $U(A) = ${UA}$; at $B$, $U(B) = ${UB}$. Find its kinetic energy at $B$.`,
            `质量为 $${m}$ 的质点仅受力 $\\mathbf{F} = -\\nabla U$ 作用。在 $A$ 处速率为 $${v}$，$U(A) = ${UA}$；在 $B$ 处 $U(B) = ${UB}$。求它在 $B$ 处的动能。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              KA + UB - UA,
              "That takes the work as $U(B) - U(A)$; for $\\mathbf{F} = -\\nabla U$ the work is $U(A) - U(B)$.",
              "那是把功当成 $U(B) - U(A)$；对 $\\mathbf{F} = -\\nabla U$，功是 $U(A) - U(B)$。",
            ),
            why(UA - UB, "That is only the work done; the kinetic energy at $A$ must be added.", "那只是力做的功；还要加上 $A$ 处的动能。"),
            why(
              KA,
              "That keeps the kinetic energy unchanged; the force does work on the particle.",
              "那是让动能保持不变；力对质点做了功。",
            ),
            why(
              m * v * v + UA - UB,
              "That takes the kinetic energy as $mv^2$; it is $\\tfrac12 mv^2$.",
              "那是把动能当成 $mv^2$；动能是 $\\tfrac12 mv^2$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Kinetic energy at A", "A 处的动能"],
                t(`$K_A = \\frac12 \\cdot ${m} \\cdot ${v}^2 = ${KA}$.`, `$K_A = \\frac12 \\cdot ${m} \\cdot ${v}^2 = ${KA}$。`),
              ],
              [
                ["Work done", "力做的功"],
                t(`$U(A) - U(B) = ${UA} - ${paren(UB)} = ${UA - UB}$.`, `$U(A) - U(B) = ${UA} - ${paren(UB)} = ${UA - UB}$。`),
              ],
              [["Add", "相加"], t(`$K_B = ${KA} + ${paren(UA - UB)} = ${ans}$.`, `$K_B = ${KA} + ${paren(UA - UB)} = ${ans}$。`)],
            ],
            t(
              `The total energy is the same at both points: $K_A + U(A) = ${KA} + ${paren(UA)} = ${KA + UA}$ and $K_B + U(B) = ${ans} + ${paren(UB)} = ${ans + UB}$.`,
              `两点处的总能量相同：$K_A + U(A) = ${KA} + ${paren(UA)} = ${KA + UA}$，$K_B + U(B) = ${ans} + ${paren(UB)} = ${ans + UB}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Circulation and Flux
// ---------------------------------------------------------------------------

/** outwardPointingUnitNormalVectorsIn2D turns the tangent of a counterclockwise curve into its outward normal. */
export const outwardPointingUnitNormalVectorsIn2D: TopicDef = {
  id: "outward-pointing-unit-normal-vectors-in-2d",
  title: t("Outward-Pointing Unit Normal Vectors in 2D", "平面上指向外侧的单位法向量"),
  summary: t(
    "For a simple closed curve traversed counterclockwise with tangent $\\mathbf{r}'(t) = \\langle x'(t), y'(t) \\rangle$, the outward unit normal is $\\mathbf{n} = \\dfrac{\\langle y'(t), -x'(t) \\rangle}{\\lVert \\mathbf{r}'(t) \\rVert}$.",
    "对于沿逆时针方向遍历、切向量为 $\\mathbf{r}'(t) = \\langle x'(t), y'(t) \\rangle$ 的简单闭曲线，向外的单位法向量为 $\\mathbf{n} = \\dfrac{\\langle y'(t), -x'(t) \\rangle}{\\lVert \\mathbf{r}'(t) \\rVert}$。",
  ),
  intro: t(
    "Find the outward unit normal on the long side of the triangle with corners $(0, 0)$, $(2, 0)$ and $(0, 2)$, traversed counterclockwise. That side runs from $(2, 0)$ to $(0, 2)$, so its direction is $\\langle -2, 2 \\rangle$. Turning it a quarter turn clockwise gives $\\langle 2, 2 \\rangle$, of length $2\\sqrt{2}$, so $\\mathbf{n} = \\left\\langle \\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}} \\right\\rangle$.\n\nCheck: $\\mathbf{n} \\cdot \\langle -2, 2 \\rangle = 0$, so $\\mathbf{n}$ is perpendicular to the side; and from the midpoint $(1, 1)$ it leads to points with $x + y > 2$, outside the triangle.\n\nIn this lesson we find outward unit normals on closed curves traversed counterclockwise by turning the tangent clockwise.",
    "求沿逆时针方向遍历、顶点为 $(0, 0)$、$(2, 0)$、$(0, 2)$ 的三角形长边上的外单位法向量。这条边从 $(2, 0)$ 到 $(0, 2)$，方向为 $\\langle -2, 2 \\rangle$。把它顺时针旋转四分之一圈得 $\\langle 2, 2 \\rangle$，长度为 $2\\sqrt{2}$，所以 $\\mathbf{n} = \\left\\langle \\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}} \\right\\rangle$。\n\n检验：$\\mathbf{n} \\cdot \\langle -2, 2 \\rangle = 0$，所以 $\\mathbf{n}$ 与这条边垂直；从中点 $(1, 1)$ 沿它走，到达 $x + y > 2$ 的点，在三角形之外。\n\n本课我们对逆时针遍历的闭曲线，把切向量顺时针旋转来求外单位法向量。",
  ),
  prerequisites: ["unit-tangent-vectors", "simple-closed-and-oriented-curves"],
  encompasses: [{ topic: "unit-tangent-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "outward-normals-on-a-circle",
      figure: multivariableDrawings6["outward-pointing-unit-normal-vectors-in-2d#outward-normals-on-a-circle"],
      title: t("Outward normals on a circle", "圆上的外法向量"),
      explanation: t(
        "When a closed curve is traversed counterclockwise, the region it encloses is always on the left, so turning the tangent a quarter turn clockwise makes it point away from the region. Turning $\\langle x', y' \\rangle$ clockwise gives $\\langle y', -x' \\rangle$; dividing by its length makes it a unit vector. For the circle $\\mathbf{r}(t) = \\langle R\\cos t, R\\sin t \\rangle$, $\\mathbf{r}'(t) = \\langle -R\\sin t, R\\cos t \\rangle$, so\n\n$$\\mathbf{n} = \\frac{\\langle R\\cos t, R\\sin t \\rangle}{R} = \\left\\langle \\frac{x}{R}, \\frac{y}{R} \\right\\rangle,$$\n\nthe position vector divided by the radius. On $x^2 + y^2 = 2$ at $(1, 1)$ this is $\\left\\langle \\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}} \\right\\rangle$.\n\n> **Watch out.** Turning the tangent counterclockwise gives the inward normal, and the tangent itself is not a normal at all. A unit normal also has length $1$, so divide by the radius.",
        "沿逆时针方向遍历闭曲线时，它所围的区域总在左侧，所以把切向量顺时针旋转四分之一圈，就使它指向远离区域的方向。把 $\\langle x', y' \\rangle$ 顺时针旋转得到 $\\langle y', -x' \\rangle$，再除以它的长度就得到单位向量。对于圆 $\\mathbf{r}(t) = \\langle R\\cos t, R\\sin t \\rangle$，$\\mathbf{r}'(t) = \\langle -R\\sin t, R\\cos t \\rangle$，所以\n\n$$\\mathbf{n} = \\frac{\\langle R\\cos t, R\\sin t \\rangle}{R} = \\left\\langle \\frac{x}{R}, \\frac{y}{R} \\right\\rangle,$$\n\n即位置向量除以半径。在 $x^2 + y^2 = 2$ 上的点 $(1, 1)$ 处，它是 $\\left\\langle \\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}} \\right\\rangle$。\n\n> **注意。** 把切向量逆时针旋转得到的是内法向量，切向量本身根本不是法向量。单位法向量的长度为 $1$，所以要除以半径。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, c] = rng.pick(pythagoreanTriples);
        const x = rng.sign() * p;
        const y = rng.sign() * q;
        const n = `\\left\\langle ${Q.of(x, c).toLatex()}, ${Q.of(y, c).toLatex()} \\right\\rangle`;
        return located(
          {
            prompt: t(
              `The circle $x^2 + y^2 = ${c * c}$ is traversed counterclockwise. Find the outward-pointing unit normal vector at the point $(${x}, ${y})$.`,
              `圆 $x^2 + y^2 = ${c * c}$ 沿逆时针方向遍历。求它在点 $(${x}, ${y})$ 处指向外侧的单位法向量。`,
            ),
            answer: [Q.of(x, c), Q.of(y, c)],
            vector: true,
            solution: walked(
              [
                [
                  ["Find the tangent", "求切向量"],
                  t(
                    `With $\\mathbf{r}(t) = \\langle ${c}\\cos t, ${c}\\sin t \\rangle$, the tangent is $\\langle -${c}\\sin t, ${c}\\cos t \\rangle = \\langle -y, x \\rangle = \\langle ${-y}, ${x} \\rangle$.`,
                    `取 $\\mathbf{r}(t) = \\langle ${c}\\cos t, ${c}\\sin t \\rangle$，切向量为 $\\langle -${c}\\sin t, ${c}\\cos t \\rangle = \\langle -y, x \\rangle = \\langle ${-y}, ${x} \\rangle$。`,
                  ),
                ],
                [
                  ["Turn it clockwise", "顺时针旋转"],
                  t(
                    `$\\langle y', -x' \\rangle = \\langle ${x}, ${y} \\rangle$.`,
                    `$\\langle y', -x' \\rangle = \\langle ${x}, ${y} \\rangle$。`,
                  ),
                ],
                [
                  ["Divide by the length", "除以长度"],
                  t(`Its length is $${c}$, so $\\mathbf{n} = ${n}$.`, `它的长度为 $${c}$，所以 $\\mathbf{n} = ${n}$。`),
                ],
              ],
              t(
                `$\\left(${Q.of(x, c).toLatex()}\\right)^2 + \\left(${Q.of(y, c).toLatex()}\\right)^2 = \\frac{${p * p} + ${q * q}}{${c * c}} = 1$, and $\\mathbf{n}$ is a positive multiple of the position vector $\\langle ${x}, ${y} \\rangle$, so it points away from the center.`,
                `$\\left(${Q.of(x, c).toLatex()}\\right)^2 + \\left(${Q.of(y, c).toLatex()}\\right)^2 = \\frac{${p * p} + ${q * q}}{${c * c}} = 1$，且 $\\mathbf{n}$ 是位置向量 $\\langle ${x}, ${y} \\rangle$ 的正倍数，所以它背离圆心。`,
              ),
            ),
          },
          [
            [
              [Q.of(-x, c), Q.of(-y, c)],
              "That points toward the center: it is the inward normal, from turning the tangent counterclockwise.",
              "那指向圆心：它是内法向量，是把切向量逆时针旋转得到的。",
            ],
            [
              [Q.of(-y, c), Q.of(x, c)],
              "That is the unit tangent; the normal is the tangent turned a quarter turn clockwise.",
              "那是单位切向量；法向量是把切向量顺时针旋转四分之一圈。",
            ],
            [[x, y], `That has length $${c}$; divide by the radius to get a unit vector.`, `它的长度是 $${c}$；要除以半径才是单位向量。`],
          ],
        );
      },
    },
    {
      id: "outward-normals-on-a-polygon",
      figure: multivariableDrawings6["outward-pointing-unit-normal-vectors-in-2d#outward-normals-on-a-polygon"],
      title: t("Outward normals on a polygon side", "多边形边上的外法向量"),
      explanation: t(
        "On a side of a polygon traversed counterclockwise, the tangent direction is the vector from the start of the side to its end. If that vector is $\\langle d_x, d_y \\rangle$, the outward unit normal is\n\n$$\\mathbf{n} = \\frac{\\langle d_y, -d_x \\rangle}{\\sqrt{d_x^2 + d_y^2}},$$\n\nthe same along the whole side, because a straight side never changes direction. On a bottom side from $(-1, 0)$ to $(1, 0)$ the direction is $\\langle 2, 0 \\rangle$, so $\\mathbf{n} = \\frac{\\langle 0, -2 \\rangle}{2} = \\langle 0, -1 \\rangle$, pointing down and out.\n\n> **Watch out.** Only the direction of the side matters, not where it lies. Turn clockwise, to $\\langle d_y, -d_x \\rangle$; the other quarter turn $\\langle -d_y, d_x \\rangle$ points into the polygon.",
        "沿逆时针方向遍历多边形时，一条边上的切线方向就是从该边起点指向终点的向量。若这个向量为 $\\langle d_x, d_y \\rangle$，则向外的单位法向量为\n\n$$\\mathbf{n} = \\frac{\\langle d_y, -d_x \\rangle}{\\sqrt{d_x^2 + d_y^2}},$$\n\n它在整条边上都相同，因为直边的方向从不改变。对从 $(-1, 0)$ 到 $(1, 0)$ 的底边，方向为 $\\langle 2, 0 \\rangle$，所以 $\\mathbf{n} = \\frac{\\langle 0, -2 \\rangle}{2} = \\langle 0, -1 \\rangle$，向下指向外侧。\n\n> **注意。** 只有边的方向有关，与边的位置无关。要顺时针旋转，得到 $\\langle d_y, -d_x \\rangle$；另一个四分之一圈 $\\langle -d_y, d_x \\rangle$ 指向多边形内部。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, c] = rng.pick(pythagoreanTriples);
        const dx = rng.sign() * p;
        const dy = rng.sign() * q;
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const n = `\\left\\langle ${Q.of(dy, c).toLatex()}, ${Q.of(-dx, c).toLatex()} \\right\\rangle`;
        return located(
          {
            prompt: t(
              `The boundary of a polygon is traversed counterclockwise, and one of its sides runs from $(${x0}, ${y0})$ to $(${x0 + dx}, ${y0 + dy})$. Find the outward-pointing unit normal vector on that side.`,
              `沿逆时针方向遍历一个多边形的边界，其中一条边从 $(${x0}, ${y0})$ 到 $(${x0 + dx}, ${y0 + dy})$。求这条边上指向外侧的单位法向量。`,
            ),
            answer: [Q.of(dy, c), Q.of(-dx, c)],
            vector: true,
            solution: walked(
              [
                [
                  ["Find the direction", "求方向"],
                  t(
                    `End minus start: $\\langle ${dx}, ${dy} \\rangle$, of length $\\sqrt{${dx * dx} + ${dy * dy}} = ${c}$.`,
                    `终点减起点：$\\langle ${dx}, ${dy} \\rangle$，长度为 $\\sqrt{${dx * dx} + ${dy * dy}} = ${c}$。`,
                  ),
                ],
                [
                  ["Turn it clockwise", "顺时针旋转"],
                  t(
                    `$\\langle d_y, -d_x \\rangle = \\langle ${dy}, ${-dx} \\rangle$.`,
                    `$\\langle d_y, -d_x \\rangle = \\langle ${dy}, ${-dx} \\rangle$。`,
                  ),
                ],
                [["Divide by the length", "除以长度"], t(`$\\mathbf{n} = ${n}$.`, `$\\mathbf{n} = ${n}$。`)],
              ],
              t(
                `$\\mathbf{n} \\cdot \\langle ${dx}, ${dy} \\rangle = \\frac{${dy} \\cdot ${paren(dx)} + ${paren(-dx)} \\cdot ${paren(dy)}}{${c}} = 0$, so $\\mathbf{n}$ is perpendicular to the side, and its length is $\\frac{\\sqrt{${dy * dy} + ${dx * dx}}}{${c}} = 1$.`,
                `$\\mathbf{n} \\cdot \\langle ${dx}, ${dy} \\rangle = \\frac{${dy} \\cdot ${paren(dx)} + ${paren(-dx)} \\cdot ${paren(dy)}}{${c}} = 0$，所以 $\\mathbf{n}$ 与这条边垂直，且长度为 $\\frac{\\sqrt{${dy * dy} + ${dx * dx}}}{${c}} = 1$。`,
              ),
            ),
          },
          [
            [
              [Q.of(-dy, c), Q.of(dx, c)],
              "That turns the direction counterclockwise, which points into the polygon.",
              "那是把方向逆时针旋转，指向多边形内部。",
            ],
            [
              [Q.of(dx, c), Q.of(dy, c)],
              "That is the unit direction of the side, which runs along it, not across it.",
              "那是这条边的单位方向，它沿着边而不是横穿边。",
            ],
            [
              [dy, -dx],
              `That has length $${c}$; divide by the length of the side to get a unit vector.`,
              `它的长度是 $${c}$；要除以边长才是单位向量。`,
            ],
          ],
        );
      },
    },
  ],
};

/** circulation measures how much a plane field flows along a closed curve. */
export const circulation: TopicDef = {
  id: "circulation",
  title: t("Circulation", "环量"),
  summary: t(
    "The circulation of $\\mathbf{F} = \\langle P, Q \\rangle$ around a closed curve $C$ is $\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$: the net flow along the curve.",
    "向量场 $\\mathbf{F} = \\langle P, Q \\rangle$ 沿闭曲线 $C$ 的环量为 $\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$，即沿曲线方向的净流动。",
  ),
  intro: t(
    "Find the circulation of $\\mathbf{F} = \\langle -y, 0 \\rangle$ counterclockwise around the square $[0, 1] \\times [0, 1]$. Only $-y\\,dx$ counts. The two vertical sides have $dx = 0$, and the bottom has $y = 0$. Along the top, $y = 1$ and $x$ runs from $1$ to $0$, giving $\\int_1^0 (-1)\\,dx = 1$. The circulation is $1$.\n\nCheck: on the top the field $\\langle -1, 0 \\rangle$ points left, the way a counterclockwise traveller goes there, so a positive value is right.\n\nIn this lesson we measure circulation, the net push of a field along a closed curve, around rectangles and circles, and read its sign.",
    "求 $\\mathbf{F} = \\langle -y, 0 \\rangle$ 沿正方形 $[0, 1] \\times [0, 1]$ 逆时针方向的环量。只有 $-y\\,dx$ 起作用。两条竖直边上 $dx = 0$，底边上 $y = 0$。在顶边上 $y = 1$，$x$ 从 $1$ 到 $0$，得 $\\int_1^0 (-1)\\,dx = 1$。环量为 $1$。\n\n检验：在顶边上场 $\\langle -1, 0 \\rangle$ 指向左，正是逆时针行进在那里的方向，所以结果为正是对的。\n\n本课我们计算环量，即场沿闭曲线的净推动，对象是矩形和圆，并判断它的符号。",
  ),
  prerequisites: ["line-integrals-of-vector-valued-functions-over-general-curves"],
  encompasses: [{ topic: "line-integrals-of-vector-valued-functions-over-general-curves", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "circulation-around-a-rectangle",
      figure: multivariableDrawings6["circulation#circulation-around-a-rectangle"],
      title: t("Circulation around a rectangle", "沿矩形的环量"),
      explanation: t(
        "Circulation is the line integral of the tangential component of the field around a closed curve, so it measures how strongly the field pushes along the curve. Around a rectangle, add the four sides: on a horizontal side only $P\\,dx$ contributes, and on a vertical side only $Q\\,dy$, with $dx < 0$ along the top and $dy < 0$ along the left side when traversing counterclockwise. For $\\langle 2y, 7x \\rangle$ around $[0, 1] \\times [0, 1]$, the right side gives $7$, the top gives $-2$, and the circulation is $5$.\n\n> **Watch out.** The top is traversed from right to left, so its integral runs from the larger $x$ to the smaller and changes sign. Treating it as left to right adds the two contributions instead of subtracting them.",
        "环量是场的切向分量沿闭曲线的曲线积分，所以它衡量场沿曲线推动的强弱。沿矩形计算时把四条边相加：在水平边上只有 $P\\,dx$ 有贡献，在竖直边上只有 $Q\\,dy$ 有贡献；逆时针遍历时，顶边上 $dx < 0$，左边上 $dy < 0$。对 $\\langle 2y, 7x \\rangle$ 沿 $[0, 1] \\times [0, 1]$，右边给出 $7$，顶边给出 $-2$，环量为 $5$。\n\n> **注意。** 顶边是从右向左走的，所以它的积分从较大的 $x$ 积到较小的 $x$，会变号。把它当成从左向右，就把两部分相加而不是相减了。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        let b = rng.nonZero(-6, 6);
        if (b === a) b = a + 1;
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const ans = (b - a) * W * H;
        return numberProblem({
          prompt: t(
            `Find the circulation of $\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ around the boundary of the rectangle $[0, ${W}] \\times [0, ${H}]$, traversed counterclockwise.`,
            `求 $\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ 沿矩形 $[0, ${W}] \\times [0, ${H}]$ 的边界逆时针方向的环量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              (a + b) * W * H,
              "That runs along the top from left to right; counterclockwise it goes from right to left, which changes the sign of its integral.",
              "那是把顶边当成从左向右走；逆时针时它从右向左，积分要变号。",
            ),
            why(
              (a - b) * W * H,
              "That is the clockwise circulation, the negative of the counterclockwise one.",
              "那是顺时针方向的环量，是逆时针环量的相反数。",
            ),
            why(b * W * H, "That counts only the right side; the top contributes too.", "那是只算了右边；顶边也有贡献。"),
          ]),
          solution: walked(
            [
              [["Bottom side", "底边"], t(`$y = 0$, so $P = 0$ and the bottom gives $0$.`, `$y = 0$，所以 $P = 0$，底边给出 $0$。`)],
              [
                ["Right side", "右边"],
                t(
                  `$x = ${W}$, $y$ from $0$ to $${H}$: $\\int_0^{${H}} ${b * W}\\,dy = ${b * W * H}$.`,
                  `$x = ${W}$，$y$ 从 $0$ 到 $${H}$：$\\int_0^{${H}} ${b * W}\\,dy = ${b * W * H}$。`,
                ),
              ],
              [
                ["Top side", "顶边"],
                t(
                  `$y = ${H}$, $x$ from $${W}$ to $0$: $\\int_{${W}}^0 ${a * H}\\,dx = ${-a * H * W}$.`,
                  `$y = ${H}$，$x$ 从 $${W}$ 到 $0$：$\\int_{${W}}^0 ${a * H}\\,dx = ${-a * H * W}$。`,
                ),
              ],
              [
                ["Left side and total", "左边与总和"],
                t(
                  `$x = 0$, so $Q = 0$ there; the circulation is $${b * W * H} + ${paren(-a * H * W)} = ${ans}$.`,
                  `$x = 0$，那里 $Q = 0$；环量为 $${b * W * H} + ${paren(-a * H * W)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Clockwise the right side would run down and the top left to right, giving $${-b * W * H} + ${paren(a * H * W)} = ${-ans}$, the negative of $${ans}$, as reversing a curve must.`,
              `顺时针时右边向下走、顶边从左向右走，得 $${-b * W * H} + ${paren(a * H * W)} = ${-ans}$，正是 $${ans}$ 的相反数，与曲线反向应有的结果一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "circulation-around-a-circle",
      figure: multivariableDrawings6["circulation#circulation-around-a-circle"],
      title: t("Circulation around a circle", "沿圆的环量"),
      explanation: t(
        "For a rotating field $\\mathbf{F} = \\langle -ky, kx \\rangle$ on the circle of radius $R$, the field is tangent to the circle with constant length $kR$, so $\\mathbf{F} \\cdot \\mathbf{T} = kR$ everywhere. The circulation is that constant times the length of the circle:\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = kR \\cdot 2\\pi R = 2\\pi k R^2.$$\n\nFor $\\langle -3y, 3x \\rangle$ on the unit circle, the circulation is $3 \\cdot 2\\pi = 6\\pi$.\n\n> **Watch out.** Both the length of the field, $kR$, and the length of the circle, $2\\pi R$, carry a factor $R$, so the result has $R^2$. The full turn has length $2\\pi R$, not $\\pi R$.",
        "对于旋转场 $\\mathbf{F} = \\langle -ky, kx \\rangle$，在半径为 $R$ 的圆上，场与圆相切且长度恒为 $kR$，所以处处有 $\\mathbf{F} \\cdot \\mathbf{T} = kR$。环量就是这个常数乘以圆周长：\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = kR \\cdot 2\\pi R = 2\\pi k R^2$$\n\n对单位圆上的 $\\langle -3y, 3x \\rangle$，环量为 $3 \\cdot 2\\pi = 6\\pi$。\n\n> **注意。** 场的长度 $kR$ 和圆的周长 $2\\pi R$ 都带有因子 $R$，所以结果含 $R^2$。一整圈的长度是 $2\\pi R$，不是 $\\pi R$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-5, 5);
        const R = rng.int(2, 6);
        const ans = 2 * k * R * R;
        const field = `\\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle`;
        return numberProblem({
          prompt: t(
            `The circulation of $\\mathbf{F} = ${field}$ around the circle $x^2 + y^2 = ${R * R}$, traversed counterclockwise, equals $c\\pi$. Find $c$.`,
            `$\\mathbf{F} = ${field}$ 沿圆 $x^2 + y^2 = ${R * R}$ 逆时针方向的环量等于 $c\\pi$。求 $c$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              k * R * R,
              "That uses $\\pi R$ for the length of the circle; a full turn has length $2\\pi R$.",
              "那是把圆周长当成 $\\pi R$；一整圈的长度是 $2\\pi R$。",
            ),
            why(
              2 * k * R,
              "That leaves out a factor $R$; the field has length $kR$ on the circle, and the circle has length $2\\pi R$.",
              "那是漏掉了一个因子 $R$；场在圆上的长度是 $kR$，圆周长是 $2\\pi R$。",
            ),
            why(
              -ans,
              "That has the sign reversed; this field turns the same way as the counterclockwise traversal when $k > 0$.",
              "那是符号反了；$k > 0$ 时这个场与逆时针行进方向一致。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(
                  `$\\mathbf{r}(t) = \\langle ${R}\\cos t, ${R}\\sin t \\rangle$: $\\mathbf{F} = \\langle ${-k * R}\\sin t, ${k * R}\\cos t \\rangle$ and $\\mathbf{r}'(t) = \\langle -${R}\\sin t, ${R}\\cos t \\rangle$.`,
                  `$\\mathbf{r}(t) = \\langle ${R}\\cos t, ${R}\\sin t \\rangle$：$\\mathbf{F} = \\langle ${-k * R}\\sin t, ${k * R}\\cos t \\rangle$，$\\mathbf{r}'(t) = \\langle -${R}\\sin t, ${R}\\cos t \\rangle$。`,
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                t(
                  `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${k * R * R}\\sin^2 t + ${paren(k * R * R)}\\cos^2 t = ${k * R * R}$.`,
                  `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${k * R * R}\\sin^2 t + ${paren(k * R * R)}\\cos^2 t = ${k * R * R}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{2\\pi} ${k * R * R}\\,dt = ${ans}\\pi$, so $c = ${ans}$.`,
                  `$\\int_0^{2\\pi} ${k * R * R}\\,dt = ${ans}\\pi$，所以 $c = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The tangential component is $kR = ${k * R}$ at every point and the circle has length $2\\pi \\cdot ${R} = ${2 * R}\\pi$; their product is $${ans}\\pi$.`,
              `切向分量处处为 $kR = ${k * R}$，圆周长为 $2\\pi \\cdot ${R} = ${2 * R}\\pi$；二者之积为 $${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-sign-of-the-circulation",
      title: t("The sign of the circulation", "环量的符号"),
      explanation: t(
        "Positive circulation around a counterclockwise curve means the field flows mostly with the direction of travel, negative means mostly against it, and zero means the flow along the curve cancels out, as it does for every gradient field. For $\\langle -y, 0 \\rangle$ around the unit circle, $\\oint -y\\,dx = \\int_0^{2\\pi} \\sin^2 t\\,dt = \\pi$: positive.\n\n> **Watch out.** A field that points straight out of the circle crosses it without pushing along it, so its circulation is zero, however strong it is.",
        "沿逆时针曲线的环量为正，表示场大体顺着行进方向流动；为负表示大体逆着行进方向；为零表示沿曲线的流动相互抵消，每个梯度场都是如此。对 $\\langle -y, 0 \\rangle$ 沿单位圆，$\\oint -y\\,dx = \\int_0^{2\\pi} \\sin^2 t\\,dt = \\pi$：为正。\n\n> **注意。** 垂直指向圆外的场只是穿过圆，并不沿圆推动，所以无论多强，它的环量都是零。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.pick(["positive", "negative", "zero"] as const);
        const k = rng.int(1, 5);
        const R = rng.int(1, 5);
        const field =
          kind === "positive"
            ? `\\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle`
            : kind === "negative"
              ? `\\langle ${poly([k, "y"])}, ${poly([-k, "x"])} \\rangle`
              : `\\langle ${poly([2 * k, "x"])}, ${poly([2 * k, "y"])} \\rangle`;
        const positive = t("Positive", "正");
        const negative = t("Negative", "负");
        const zero = t("Zero", "零");
        const dot = kind === "positive" ? k * R * R : kind === "negative" ? -k * R * R : 0;
        const notPositive = {
          option: positive,
          why:
            kind === "negative"
              ? t("The field turns clockwise, against the counterclockwise direction of travel", "场顺时针旋转，与逆时针行进方向相反")
              : t("The field points straight out of the circle, so it has no component along it", "场垂直指向圆外，沿圆的分量为零"),
        };
        const notNegative = {
          option: negative,
          why:
            kind === "positive"
              ? t("The field turns counterclockwise, with the direction of travel", "场逆时针旋转，与行进方向一致")
              : t(
                  "Pointing outward is not flowing backward; the field has no component along the circle",
                  "指向外侧并不是逆向流动；场沿圆的分量为零",
                ),
        };
        const notZero = {
          option: zero,
          why: t(
            `The field is tangent to the circle, with $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${dot}$ everywhere, so nothing cancels`,
            `场与圆相切，处处 $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${dot}$，没有抵消`,
          ),
        };
        return explainedChoice(rng, {
          prompt: t(
            `Is the circulation of $\\mathbf{F} = ${field}$ around the circle $x^2 + y^2 = ${R * R}$, traversed counterclockwise, positive, negative or zero?`,
            `$\\mathbf{F} = ${field}$ 沿圆 $x^2 + y^2 = ${R * R}$ 逆时针方向的环量是正、负还是零？`,
          ),
          correct: kind === "positive" ? positive : kind === "negative" ? negative : zero,
          wrong: kind === "positive" ? [notNegative, notZero] : kind === "negative" ? [notPositive, notZero] : [notPositive, notNegative],
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(
                  `$\\mathbf{r}(t) = \\langle ${R === 1 ? "" : R}\\cos t, ${R === 1 ? "" : R}\\sin t \\rangle$, $\\mathbf{r}'(t) = \\langle -${R === 1 ? "" : R}\\sin t, ${R === 1 ? "" : R}\\cos t \\rangle$.`,
                  `$\\mathbf{r}(t) = \\langle ${R === 1 ? "" : R}\\cos t, ${R === 1 ? "" : R}\\sin t \\rangle$，$\\mathbf{r}'(t) = \\langle -${R === 1 ? "" : R}\\sin t, ${R === 1 ? "" : R}\\cos t \\rangle$。`,
                ),
              ],
              [
                ["Take the dot product", "求点积"],
                kind === "zero"
                  ? t(
                      `The field is $${2 * k}$ times the position vector, so $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${2 * k * R * R}(-\\cos t\\sin t + \\sin t\\cos t) = 0$.`,
                      `这个场是位置向量的 $${2 * k}$ 倍，所以 $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${2 * k * R * R}(-\\cos t\\sin t + \\sin t\\cos t) = 0$。`,
                    )
                  : t(
                      `$\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${dot}(\\sin^2 t + \\cos^2 t) = ${dot}$ at every point.`,
                      `每一点处 $\\mathbf{F} \\cdot \\mathbf{r}'(t) = ${dot}(\\sin^2 t + \\cos^2 t) = ${dot}$。`,
                    ),
              ],
              [
                ["Read the sign", "判断符号"],
                t(
                  `The circulation is $\\int_0^{2\\pi} ${dot}\\,dt = ${dot === 0 ? "0" : `${2 * dot}\\pi`}$, which is ${kind}.`,
                  `环量为 $\\int_0^{2\\pi} ${dot}\\,dt = ${dot === 0 ? "0" : `${2 * dot}\\pi`}$，${kind === "positive" ? "为正" : kind === "negative" ? "为负" : "为零"}。`,
                ),
              ],
            ],
            kind === "zero"
              ? t(
                  `The field is the gradient of $${k}(x^2 + y^2)$, and the circulation of a gradient around a closed curve is $0$.`,
                  `这个场是 $${k}(x^2 + y^2)$ 的梯度，而梯度场沿闭曲线的环量为 $0$。`,
                )
              : t(
                  `At $(${R}, 0)$ the field is $\\langle 0, ${kind === "positive" ? k * R : -k * R} \\rangle$, pointing ${kind === "positive" ? "up, the way" : "down, against the way"} a counterclockwise traveller moves there.`,
                  `在 $(${R}, 0)$ 处场为 $\\langle 0, ${kind === "positive" ? k * R : -k * R} \\rangle$，指向${kind === "positive" ? "上方，正是" : "下方，与"}逆时针行进在那里的方向${kind === "positive" ? "" : "相反"}。`,
                ),
          ),
        });
      },
    },
  ],
};

/** fluxInTwoDimensionalVectorFields defines the flux of a plane field across a curve. */
export const fluxInTwoDimensionalVectorFields: TopicDef = {
  id: "flux-in-two-dimensional-vector-fields",
  title: t("Flux in Two-Dimensional Vector Fields", "二维向量场的通量"),
  summary: t(
    "The flux of $\\mathbf{F}$ across a curve $C$ is $\\int_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds$, the rate at which the field crosses the curve in the direction of the normal $\\mathbf{n}$.",
    "$\\mathbf{F}$ 穿过曲线 $C$ 的通量为 $\\int_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds$，即场沿法向量 $\\mathbf{n}$ 方向穿过曲线的速率。",
  ),
  intro: t(
    "Find the flux of the constant field $\\mathbf{F} = \\langle 3, 0 \\rangle$ across the segment from $(0, 0)$ to $(0, 2)$, with the normal on the right of the direction of travel. Travelling up, the right is $\\mathbf{n} = \\langle 1, 0 \\rangle$, so $\\mathbf{F} \\cdot \\mathbf{n} = 3$ at every point, and the segment has length $2$. The flux is $3 \\cdot 2 = 6$.\n\nCheck: with $\\mathbf{n}\\,ds = \\langle dy, -dx \\rangle$, the flux is $\\int (P\\,dy - Q\\,dx) = \\int_0^2 3\\,dy = 6$.\n\nIn this lesson we measure flux, the rate at which a field crosses a curve, using the component of the field along the normal.",
    "求常向量场 $\\mathbf{F} = \\langle 3, 0 \\rangle$ 穿过从 $(0, 0)$ 到 $(0, 2)$ 的线段的通量，法向量取在行进方向的右侧。向上走时右侧是 $\\mathbf{n} = \\langle 1, 0 \\rangle$，所以每一点处 $\\mathbf{F} \\cdot \\mathbf{n} = 3$，线段长度为 $2$。通量为 $3 \\cdot 2 = 6$。\n\n检验：由 $\\mathbf{n}\\,ds = \\langle dy, -dx \\rangle$，通量为 $\\int (P\\,dy - Q\\,dx) = \\int_0^2 3\\,dy = 6$。\n\n本课我们用场沿法向的分量来计算通量，即场穿过曲线的速率。",
  ),
  prerequisites: ["outward-pointing-unit-normal-vectors-in-2d", "line-integrals-of-scalar-functions-over-line-segments"],
  encompasses: [{ topic: "outward-pointing-unit-normal-vectors-in-2d", weight: 0.4 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "flux-of-a-constant-field-across-a-segment",
      title: t("Flux of a constant field across a segment", "常向量场穿过线段的通量"),
      explanation: t(
        "Flux measures how much of the field crosses the curve rather than running along it, so it uses the normal component $\\mathbf{F} \\cdot \\mathbf{n}$. For a constant field and a straight segment both $\\mathbf{F}$ and $\\mathbf{n}$ are constant, so the flux is $\\mathbf{F} \\cdot \\mathbf{n}$ times the length. With direction $\\langle d_x, d_y \\rangle$ and $\\mathbf{n}$ on its right, this is $P\\,d_y - Q\\,d_x$. For $\\langle 1, 4 \\rangle$ across the segment from $(0, 0)$ to $(2, 0)$, $\\mathbf{n} = \\langle 0, -1 \\rangle$ and the flux is $-4 \\cdot 2 = -8$.\n\n> **Watch out.** $P\\,d_x + Q\\,d_y$ is the tangential part, which belongs to circulation; flux uses $P\\,d_y - Q\\,d_x$. And the length cancels the $\\frac{1}{\\text{length}}$ in $\\mathbf{n}$, so do not leave it out.",
        "通量衡量的是场穿过曲线而不是沿曲线流动的部分，所以它使用法向分量 $\\mathbf{F} \\cdot \\mathbf{n}$。对于常向量场和直线段，$\\mathbf{F}$ 和 $\\mathbf{n}$ 都是常量，所以通量等于 $\\mathbf{F} \\cdot \\mathbf{n}$ 乘以长度。若方向为 $\\langle d_x, d_y \\rangle$ 且 $\\mathbf{n}$ 在其右侧，结果就是 $P\\,d_y - Q\\,d_x$。对 $\\langle 1, 4 \\rangle$ 穿过从 $(0, 0)$ 到 $(2, 0)$ 的线段，$\\mathbf{n} = \\langle 0, -1 \\rangle$，通量为 $-4 \\cdot 2 = -8$。\n\n> **注意。** $P\\,d_x + Q\\,d_y$ 是切向部分，属于环量；通量用的是 $P\\,d_y - Q\\,d_x$。长度正好抵消 $\\mathbf{n}$ 中的 $\\frac{1}{\\text{长度}}$，不要漏乘。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, c] = rng.pick(pythagoreanTriples);
        const dx = rng.sign() * p;
        const dy = rng.sign() * q;
        const P = rng.nonZero(-6, 6);
        const Qc = rng.nonZero(-6, 6);
        const ans = P * dy - Qc * dx;
        return numberProblem({
          prompt: t(
            `Find the flux of the constant field $\\mathbf{F} = \\langle ${P}, ${Qc} \\rangle$ across the segment from $(0, 0)$ to $(${dx}, ${dy})$, with $\\mathbf{n} = \\frac{1}{${c}}\\langle ${dy}, ${-dx} \\rangle$, the unit normal on the right of the direction of travel.`,
            `求常向量场 $\\mathbf{F} = \\langle ${P}, ${Qc} \\rangle$ 穿过从 $(0, 0)$ 到 $(${dx}, ${dy})$ 的线段的通量，其中 $\\mathbf{n} = \\frac{1}{${c}}\\langle ${dy}, ${-dx} \\rangle$ 是行进方向右侧的单位法向量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              P * dx + Qc * dy,
              "That dots the field with the direction of the segment, the tangential part; flux uses the normal.",
              "那是用场点乘线段的方向，即切向部分；通量用的是法向量。",
            ),
            why(
              -ans,
              "That uses the normal on the left of the direction of travel; the given $\\mathbf{n}$ is on the right.",
              "那是用了行进方向左侧的法向量；给定的 $\\mathbf{n}$ 在右侧。",
            ),
            why(
              Q.of(ans, c),
              "That is $\\mathbf{F} \\cdot \\mathbf{n}$ alone; it must be multiplied by the length of the segment.",
              "那只是 $\\mathbf{F} \\cdot \\mathbf{n}$；还要乘以线段的长度。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the normal component", "求法向分量"],
                t(
                  `$\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${P} \\cdot ${paren(dy)} + ${paren(Qc)} \\cdot ${paren(-dx)}}{${c}} = ${Q.of(ans, c).toLatex()}$.`,
                  `$\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${P} \\cdot ${paren(dy)} + ${paren(Qc)} \\cdot ${paren(-dx)}}{${c}} = ${Q.of(ans, c).toLatex()}$。`,
                ),
              ],
              [
                ["Multiply by the length", "乘以长度"],
                t(
                  `The segment has length $\\sqrt{${dx * dx} + ${dy * dy}} = ${c}$, so the flux is $${Q.of(ans, c).toLatex()} \\cdot ${c} = ${ans}$.`,
                  `线段长度为 $\\sqrt{${dx * dx} + ${dy * dy}} = ${c}$，所以通量为 $${Q.of(ans, c).toLatex()} \\cdot ${c} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `With $\\mathbf{n}\\,ds = \\langle dy, -dx \\rangle$, the flux is $P\\,d_y - Q\\,d_x = ${P} \\cdot ${paren(dy)} - ${paren(Qc)} \\cdot ${paren(dx)} = ${ans}$.`,
              `由 $\\mathbf{n}\\,ds = \\langle dy, -dx \\rangle$，通量为 $P\\,d_y - Q\\,d_x = ${P} \\cdot ${paren(dy)} - ${paren(Qc)} \\cdot ${paren(dx)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-sign-of-the-flux",
      title: t("The sign of the outward flux", "外法向通量的符号"),
      explanation: t(
        "Positive outward flux across a closed curve means more of the field leaves the region than enters it, negative means more enters than leaves, and zero means the flow in and the flow out balance exactly. For $\\langle x, 0 \\rangle$ across the unit circle, $\\mathbf{F} \\cdot \\mathbf{n} = x^2 \\ge 0$ everywhere, so the outward flux is positive.\n\n> **Watch out.** A field that circles around the origin runs along the circle and never crosses it, so its flux is zero even though it is never zero itself.",
        "穿过闭曲线的外法向通量为正，表示离开区域的场多于进入的；为负表示进入的多于离开的；为零表示流入与流出恰好平衡。对 $\\langle x, 0 \\rangle$ 穿过单位圆，处处 $\\mathbf{F} \\cdot \\mathbf{n} = x^2 \\ge 0$，所以外法向通量为正。\n\n> **注意。** 绕原点旋转的场沿着圆流动，从不穿过它，所以虽然场本身处处不为零，它的通量却是零。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.pick(["positive", "negative", "zero"] as const);
        const k = rng.int(1, 5);
        const R = rng.int(1, 5);
        const field =
          kind === "positive"
            ? `\\langle ${poly([k, "x"])}, ${poly([k, "y"])} \\rangle`
            : kind === "negative"
              ? `\\langle ${poly([-k, "x"])}, ${poly([-k, "y"])} \\rangle`
              : `\\langle ${poly([-k, "y"])}, ${poly([k, "x"])} \\rangle`;
        const positive = t("Positive", "正");
        const negative = t("Negative", "负");
        const zero = t("Zero", "零");
        const normal = kind === "positive" ? k * R : kind === "negative" ? -k * R : 0;
        const notPositive = {
          option: positive,
          why:
            kind === "negative"
              ? t("The field points toward the origin, into the disk, so more enters than leaves", "场指向原点，进入圆盘，所以流入多于流出")
              : t(
                  "Turning around the origin is not leaving the disk; the field runs along the circle",
                  "绕原点旋转并不是离开圆盘；场沿着圆流动",
                ),
        };
        const notNegative = {
          option: negative,
          why:
            kind === "positive"
              ? t("The field points away from the origin, out of the disk", "场背离原点，指向圆盘外")
              : t("The field runs along the circle, so none of it enters the disk", "场沿着圆流动，没有一点进入圆盘"),
        };
        const notZero = {
          option: zero,
          why: t(
            `The field points straight ${kind === "positive" ? "out" : "in"}, with $\\mathbf{F} \\cdot \\mathbf{n} = ${normal}$ at every point, so nothing balances`,
            `场垂直指向${kind === "positive" ? "外" : "内"}，处处 $\\mathbf{F} \\cdot \\mathbf{n} = ${normal}$，没有相互抵消`,
          ),
        };
        return explainedChoice(rng, {
          prompt: t(
            `Is the outward flux of $\\mathbf{F} = ${field}$ across the circle $x^2 + y^2 = ${R * R}$ positive, negative or zero?`,
            `$\\mathbf{F} = ${field}$ 穿过圆 $x^2 + y^2 = ${R * R}$ 的外法向通量是正、负还是零？`,
          ),
          correct: kind === "positive" ? positive : kind === "negative" ? negative : zero,
          wrong: kind === "positive" ? [notNegative, notZero] : kind === "negative" ? [notPositive, notZero] : [notPositive, notNegative],
          solution: walked(
            [
              [
                ["Write the outward normal", "写出外法向量"],
                t(
                  `$\\mathbf{n} = \\frac{1}{${R}}\\langle x, y \\rangle$ on the circle.`,
                  `在圆上 $\\mathbf{n} = \\frac{1}{${R}}\\langle x, y \\rangle$。`,
                ),
              ],
              [
                ["Take the normal component", "求法向分量"],
                kind === "zero"
                  ? t(
                      `$\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${k}(-yx + xy)}{${R}} = 0$ at every point.`,
                      `每一点处 $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${k}(-yx + xy)}{${R}} = 0$。`,
                    )
                  : t(
                      `$\\mathbf{F} \\cdot \\mathbf{n} = ${kind === "positive" ? "" : "-"}\\frac{${k}(x^2 + y^2)}{${R}} = ${normal}$ at every point.`,
                      `每一点处 $\\mathbf{F} \\cdot \\mathbf{n} = ${kind === "positive" ? "" : "-"}\\frac{${k}(x^2 + y^2)}{${R}} = ${normal}$。`,
                    ),
              ],
              [
                ["Read the sign", "判断符号"],
                t(
                  `The flux is $${normal}$ times the length $${2 * R}\\pi$, which is ${kind === "zero" ? "$0$" : `$${normal * 2 * R}\\pi$`}: ${kind}.`,
                  `通量是 $${normal}$ 乘以周长 $${2 * R}\\pi$，即 ${kind === "zero" ? "$0$" : `$${normal * 2 * R}\\pi$`}：${kind === "positive" ? "为正" : kind === "negative" ? "为负" : "为零"}。`,
                ),
              ],
            ],
            kind === "zero"
              ? t(
                  `At $(${R}, 0)$ the field is $\\langle 0, ${k * R} \\rangle$, along the circle, and at $(0, ${R})$ it is $\\langle ${-k * R}, 0 \\rangle$, along the circle again.`,
                  `在 $(${R}, 0)$ 处场为 $\\langle 0, ${k * R} \\rangle$，沿着圆；在 $(0, ${R})$ 处场为 $\\langle ${-k * R}, 0 \\rangle$，同样沿着圆。`,
                )
              : t(
                  `At $(${R}, 0)$ the field is $\\langle ${normal}, 0 \\rangle$, pointing ${kind === "positive" ? "out of" : "into"} the disk.`,
                  `在 $(${R}, 0)$ 处场为 $\\langle ${normal}, 0 \\rangle$，指向圆盘${kind === "positive" ? "外" : "内"}。`,
                ),
          ),
        });
      },
    },
  ],
};

/** calculatingFluxInTwoDimensionalVectorFields computes outward flux across closed plane curves. */
export const calculatingFluxInTwoDimensionalVectorFields: TopicDef = {
  id: "calculating-flux-in-two-dimensional-vector-fields",
  title: t("Calculating Flux in Two-Dimensional Vector Fields", "计算二维向量场的通量"),
  summary: t(
    "With $\\mathbf{n}\\,ds = \\langle dy, -dx \\rangle$ on a counterclockwise curve, the outward flux of $\\mathbf{F} = \\langle P, Q \\rangle$ is $\\oint_C (P\\,dy - Q\\,dx)$.",
    "在逆时针曲线上 $\\mathbf{n}\\,ds = \\langle dy, -dx \\rangle$，所以 $\\mathbf{F} = \\langle P, Q \\rangle$ 的外法向通量为 $\\oint_C (P\\,dy - Q\\,dx)$。",
  ),
  intro: t(
    "Find the outward flux of $\\mathbf{F} = \\langle x, 0 \\rangle$ across the boundary of the square $[0, 1] \\times [0, 1]$. On the top and bottom the normal is vertical and $Q = 0$, so they give nothing. On the left, $x = 0$, so the field is zero there. On the right, $x = 1$ and $\\mathbf{n} = \\langle 1, 0 \\rangle$, so $\\mathbf{F} \\cdot \\mathbf{n} = 1$ along a side of length $1$. The flux is $1$.\n\nCheck: $\\oint (P\\,dy - Q\\,dx) = \\oint x\\,dy$, and only the right side, going up from $y = 0$ to $y = 1$ at $x = 1$, contributes $\\int_0^1 1\\,dy = 1$.\n\nIn this lesson we compute outward flux across closed curves as $\\oint (P\\,dy - Q\\,dx)$, side by side on rectangles and by parametrization on circles.",
    "求 $\\mathbf{F} = \\langle x, 0 \\rangle$ 穿过正方形 $[0, 1] \\times [0, 1]$ 边界的外法向通量。在顶边和底边上法向量竖直且 $Q = 0$，所以没有贡献。在左边 $x = 0$，场为零。在右边 $x = 1$，$\\mathbf{n} = \\langle 1, 0 \\rangle$，所以沿长度为 $1$ 的边 $\\mathbf{F} \\cdot \\mathbf{n} = 1$。通量为 $1$。\n\n检验：$\\oint (P\\,dy - Q\\,dx) = \\oint x\\,dy$，只有右边（$x = 1$，$y$ 从 $0$ 向上到 $1$）有贡献 $\\int_0^1 1\\,dy = 1$。\n\n本课我们把穿过闭曲线的外法向通量算作 $\\oint (P\\,dy - Q\\,dx)$：在矩形上逐边计算，在圆上用参数化计算。",
  ),
  prerequisites: ["flux-in-two-dimensional-vector-fields", "line-integrals-with-respect-to-x-and-y"],
  encompasses: [{ topic: "flux-in-two-dimensional-vector-fields", weight: 0.5 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "outward-flux-across-a-rectangle",
      figure: multivariableDrawings6["calculating-flux-in-two-dimensional-vector-fields#outward-flux-across-a-rectangle"],
      title: t("Outward flux across a rectangle", "穿过矩形的外法向通量"),
      explanation: t(
        "Since $\\mathbf{n}\\,ds = \\langle y'(t), -x'(t) \\rangle\\,dt = \\langle dy, -dx \\rangle$, the outward flux is $\\oint_C (P\\,dy - Q\\,dx)$. Around a rectangle, compute it side by side: the outward normal is $\\langle 1, 0 \\rangle$ on the right side, $\\langle -1, 0 \\rangle$ on the left, $\\langle 0, 1 \\rangle$ on top and $\\langle 0, -1 \\rangle$ on the bottom. For $\\langle 3x + y, 2y \\rangle$ across $[0, 1] \\times [0, 1]$, the flux is $3 + 2 = 5$: the $y$ part of $P$ enters on the left exactly as much as it leaves on the right.\n\n> **Watch out.** The left side counts too, with normal $\\langle -1, 0 \\rangle$. A part of $P$ that does not depend on $x$ cancels between the left and right sides, but only if both are included.",
        "由于 $\\mathbf{n}\\,ds = \\langle y'(t), -x'(t) \\rangle\\,dt = \\langle dy, -dx \\rangle$，外法向通量为 $\\oint_C (P\\,dy - Q\\,dx)$。沿矩形逐边计算：外法向量在右边为 $\\langle 1, 0 \\rangle$，左边为 $\\langle -1, 0 \\rangle$，顶边为 $\\langle 0, 1 \\rangle$，底边为 $\\langle 0, -1 \\rangle$。对 $\\langle 3x + y, 2y \\rangle$ 穿过 $[0, 1] \\times [0, 1]$，通量为 $3 + 2 = 5$：$P$ 中的 $y$ 部分从左边流入多少，就从右边流出多少。\n\n> **注意。** 左边也要算，它的法向量是 $\\langle -1, 0 \\rangle$。$P$ 中与 $x$ 无关的部分在左右两边相互抵消，但前提是两边都算进去。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-4, 4);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const ans = (a + b) * W * H;
        const field = `\\langle ${poly([a, "x"], [c, "y"])}, ${poly([b, "y"])} \\rangle`;
        const right = Q.of(2 * a * W * H + c * H * H, 2);
        const left = Q.of(-c * H * H, 2);
        return numberProblem({
          prompt: t(
            `Find the outward flux of $\\mathbf{F} = ${field}$ across the boundary of the rectangle $[0, ${W}] \\times [0, ${H}]$.`,
            `求 $\\mathbf{F} = ${field}$ 穿过矩形 $[0, ${W}] \\times [0, ${H}]$ 边界的外法向通量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              right.add(Q.of(b * H * W)),
              "That leaves out the left side, where the normal is $\\langle -1, 0 \\rangle$ and the $y$ part of $P$ flows in.",
              "那是漏掉了左边，那里法向量为 $\\langle -1, 0 \\rangle$，$P$ 的 $y$ 部分从那里流入。",
            ),
            why(
              (a - b) * W * H,
              "That takes the normal on the top as $\\langle 0, -1 \\rangle$; on the top it points up.",
              "那是把顶边的法向量当成 $\\langle 0, -1 \\rangle$；顶边上它指向上方。",
            ),
            why(a * W * H, "That counts only the left and right sides; the top contributes as well.", "那是只算了左右两边；顶边也有贡献。"),
          ]),
          solution: walked(
            [
              [
                ["Right side", "右边"],
                t(
                  `$x = ${W}$, $\\mathbf{n} = \\langle 1, 0 \\rangle$: $\\int_0^{${H}} (${poly([a * W, ""], [c, "y"])})\\,dy = ${right.toLatex()}$.`,
                  `$x = ${W}$，$\\mathbf{n} = \\langle 1, 0 \\rangle$：$\\int_0^{${H}} (${poly([a * W, ""], [c, "y"])})\\,dy = ${right.toLatex()}$。`,
                ),
              ],
              [
                ["Left side", "左边"],
                t(
                  `$x = 0$, $\\mathbf{n} = \\langle -1, 0 \\rangle$: $\\int_0^{${H}} ${poly([-c, "y"])}\\,dy = ${left.toLatex()}$.`,
                  `$x = 0$，$\\mathbf{n} = \\langle -1, 0 \\rangle$：$\\int_0^{${H}} ${poly([-c, "y"])}\\,dy = ${left.toLatex()}$。`,
                ),
              ],
              [
                ["Top and bottom", "顶边与底边"],
                t(
                  `Top, $y = ${H}$, $\\mathbf{n} = \\langle 0, 1 \\rangle$: $\\int_0^{${W}} ${b * H}\\,dx = ${b * H * W}$. Bottom, $y = 0$: $Q = 0$, so $0$.`,
                  `顶边 $y = ${H}$，$\\mathbf{n} = \\langle 0, 1 \\rangle$：$\\int_0^{${W}} ${b * H}\\,dx = ${b * H * W}$。底边 $y = 0$：$Q = 0$，结果为 $0$。`,
                ),
              ],
              [
                ["Add", "相加"],
                t(
                  `$${right.toLatex()} + ${paren(left)} + ${paren(b * H * W)} = ${ans}$.`,
                  `$${right.toLatex()} + ${paren(left)} + ${paren(b * H * W)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The $${poly([c, "y"])}$ part of $P$ gives the same amount on the right and the left with opposite signs, so the flux is $${a} \\cdot ${W} \\cdot ${H} + ${paren(b)} \\cdot ${W} \\cdot ${H} = ${ans}$.`,
              `$P$ 中 $${poly([c, "y"])}$ 部分在右边和左边给出等量而异号的结果，所以通量为 $${a} \\cdot ${W} \\cdot ${H} + ${paren(b)} \\cdot ${W} \\cdot ${H} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "outward-flux-across-a-circle",
      figure: multivariableDrawings6["calculating-flux-in-two-dimensional-vector-fields#outward-flux-across-a-circle"],
      title: t("Outward flux across a circle", "穿过圆的外法向通量"),
      explanation: t(
        "On a circle, parametrize with $x = R\\cos t$, $y = R\\sin t$ for $0 \\le t \\le 2\\pi$, substitute into $\\oint_C (P\\,dy - Q\\,dx)$, and integrate in $t$. The averages $\\int_0^{2\\pi} \\cos^2 t\\,dt = \\int_0^{2\\pi} \\sin^2 t\\,dt = \\pi$ and $\\int_0^{2\\pi} \\sin t \\cos t\\,dt = 0$ do most of the work. For $\\langle 6x, y \\rangle$ across the unit circle, the flux is $6\\pi + \\pi = 7\\pi$.\n\n> **Watch out.** $-Q\\,dx = -bR\\sin t \\cdot (-R\\sin t)\\,dt = bR^2\\sin^2 t\\,dt$, with a plus sign. Each of $\\cos^2 t$ and $\\sin^2 t$ integrates to $\\pi$ over a full turn, not $2\\pi$.",
        "在圆上，用 $x = R\\cos t$、$y = R\\sin t$（$0 \\le t \\le 2\\pi$）参数化，代入 $\\oint_C (P\\,dy - Q\\,dx)$ 后对 $t$ 积分。$\\int_0^{2\\pi} \\cos^2 t\\,dt = \\int_0^{2\\pi} \\sin^2 t\\,dt = \\pi$ 和 $\\int_0^{2\\pi} \\sin t \\cos t\\,dt = 0$ 这两个结果完成了大部分计算。对 $\\langle 6x, y \\rangle$ 穿过单位圆，通量为 $6\\pi + \\pi = 7\\pi$。\n\n> **注意。** $-Q\\,dx = -bR\\sin t \\cdot (-R\\sin t)\\,dt = bR^2\\sin^2 t\\,dt$，是加号。在一整圈上 $\\cos^2 t$ 与 $\\sin^2 t$ 的积分各为 $\\pi$，不是 $2\\pi$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const R = rng.int(1, 5);
        const ans = (a + b) * R * R;
        const field = `\\langle ${poly([a, "x"])}, ${poly([b, "y"])} \\rangle`;
        const r = R === 1 ? "" : `${R}`;
        return numberProblem({
          prompt: t(
            `The outward flux of $\\mathbf{F} = ${field}$ across the circle $x^2 + y^2 = ${R * R}$ equals $c\\pi$. Find $c$.`,
            `$\\mathbf{F} = ${field}$ 穿过圆 $x^2 + y^2 = ${R * R}$ 的外法向通量等于 $c\\pi$。求 $c$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * ans,
              "That integrates $\\cos^2 t$ and $\\sin^2 t$ to $2\\pi$ over a full turn; each gives $\\pi$.",
              "那是把 $\\cos^2 t$ 与 $\\sin^2 t$ 在一整圈上的积分算成 $2\\pi$；它们各为 $\\pi$。",
            ),
            why(
              (a - b) * R * R,
              "That gives $-Q\\,dx$ a minus sign; with $dx = -R\\sin t\\,dt$ it is $+bR^2\\sin^2 t\\,dt$.",
              "那是给 $-Q\\,dx$ 带了负号；由 $dx = -R\\sin t\\,dt$，它是 $+bR^2\\sin^2 t\\,dt$。",
            ),
            why(
              (a + b) * R,
              "That uses $R$ instead of $R^2$; one factor $R$ comes from the field and one from $dx$ or $dy$.",
              "那是用了 $R$ 而不是 $R^2$；一个因子 $R$ 来自场，另一个来自 $dx$ 或 $dy$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Parametrize", "参数化"],
                t(
                  `$x = ${r}\\cos t$, $y = ${r}\\sin t$, so $dx = -${r}\\sin t\\,dt$ and $dy = ${r}\\cos t\\,dt$.`,
                  `$x = ${r}\\cos t$，$y = ${r}\\sin t$，所以 $dx = -${r}\\sin t\\,dt$，$dy = ${r}\\cos t\\,dt$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `$P\\,dy - Q\\,dx = (${poly([a * R * R, "\\cos^2 t"], [b * R * R, "\\sin^2 t"])})\\,dt$.`,
                  `$P\\,dy - Q\\,dx = (${poly([a * R * R, "\\cos^2 t"], [b * R * R, "\\sin^2 t"])})\\,dt$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$${a * R * R}\\pi + ${paren(b * R * R)}\\pi = ${ans}\\pi$, so $c = ${ans}$.`,
                  `$${a * R * R}\\pi + ${paren(b * R * R)}\\pi = ${ans}\\pi$，所以 $c = ${ans}$。`,
                ),
              ],
            ],
            t(
              `On the circle $\\mathbf{n} = \\frac{1}{${R}}\\langle x, y \\rangle$, so $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${poly([a, "x^2"], [b, "y^2"])}}{${R}}$; its average over the circle is $\\frac{${a + b} \\cdot ${R * R}}{2 \\cdot ${R}}$, and times the length $${2 * R}\\pi$ this is $${ans}\\pi$.`,
              `在圆上 $\\mathbf{n} = \\frac{1}{${R}}\\langle x, y \\rangle$，所以 $\\mathbf{F} \\cdot \\mathbf{n} = \\frac{${poly([a, "x^2"], [b, "y^2"])}}{${R}}$；它在圆上的平均值是 $\\frac{${a + b} \\cdot ${R * R}}{2 \\cdot ${R}}$，乘以周长 $${2 * R}\\pi$ 得 $${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** sourceFreeVectorFields identifies plane fields with zero divergence. */
export const sourceFreeVectorFields: TopicDef = {
  id: "source-free-vector-fields",
  title: t("Source-Free Vector Fields", "无源向量场"),
  summary: t(
    "A plane field $\\mathbf{F} = \\langle P, Q \\rangle$ is source-free when $\\nabla \\cdot \\mathbf{F} = P_x + Q_y = 0$; its outward flux across every simple closed curve is then zero.",
    "当 $\\nabla \\cdot \\mathbf{F} = P_x + Q_y = 0$ 时，平面向量场 $\\mathbf{F} = \\langle P, Q \\rangle$ 是无源的；这时它穿过每条简单闭曲线的外法向通量都为零。",
  ),
  intro: t(
    "Is $\\mathbf{F} = \\langle x + y^2, -y \\rangle$ source-free? Its divergence is $P_x + Q_y = 1 + (-1) = 0$ at every point, so it is.\n\nCheck: across the square $[0, 1] \\times [0, 1]$ the outward fluxes are $\\int_0^1 (1 + y^2)\\,dy = \\frac{4}{3}$ on the right, $-\\int_0^1 y^2\\,dy = -\\frac{1}{3}$ on the left, $\\int_0^1 (-1)\\,dx = -1$ on the top and $0$ on the bottom, and they add to $0$.\n\nIn this lesson we recognize source-free fields by their divergence, choose constants that make a field source-free, and use the balance of their flux.",
    "$\\mathbf{F} = \\langle x + y^2, -y \\rangle$ 是无源场吗？它的散度处处为 $P_x + Q_y = 1 + (-1) = 0$，所以是。\n\n检验：穿过正方形 $[0, 1] \\times [0, 1]$ 的外法向通量，右边为 $\\int_0^1 (1 + y^2)\\,dy = \\frac{4}{3}$，左边为 $-\\int_0^1 y^2\\,dy = -\\frac{1}{3}$，顶边为 $\\int_0^1 (-1)\\,dx = -1$，底边为 $0$，合计 $0$。\n\n本课我们由散度识别无源场，选取常数使场无源，并利用其通量的平衡。",
  ),
  prerequisites: ["the-divergence-of-a-vector-field", "calculating-flux-in-two-dimensional-vector-fields"],
  encompasses: [{ topic: "the-divergence-of-a-vector-field", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "recognizing-source-free-fields",
      title: t("Recognizing source-free fields", "识别无源场"),
      explanation: t(
        "The divergence measures how much a field spreads out from a point, so a field with zero divergence everywhere has no sources or sinks: whatever flows into a region also flows out. To test a field, compute $P_x + Q_y$ and check whether it is identically zero. For $\\langle 7x + y^3, -7y + x^5 \\rangle$, $P_x + Q_y = 7 - 7 = 0$, so it is source-free.\n\n> **Watch out.** Differentiate $P$ in $x$ and $Q$ in $y$. A term of $P$ in $y$ alone, or of $Q$ in $x$ alone, never affects the divergence.",
        "散度衡量场从一点向外发散的程度，所以处处散度为零的场没有源也没有汇：流入一个区域的量也同样流出。要检验一个场，计算 $P_x + Q_y$，看它是否恒等于零。对 $\\langle 7x + y^3, -7y + x^5 \\rangle$，$P_x + Q_y = 7 - 7 = 0$，所以它是无源的。\n\n> **注意。** 要对 $P$ 关于 $x$ 求导、对 $Q$ 关于 $y$ 求导。$P$ 中只含 $y$ 的项、$Q$ 中只含 $x$ 的项从不影响散度。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);
        const d = rng.nonZero(-5, 5);
        const free = rng.bool();
        const b = free ? -a : rng.pick([a, 2 * a, -2 * a]);
        const field = `\\langle ${poly([a, "x"], [c, "y^2"])}, ${poly([b, "y"], [d, "x^2"])} \\rangle`;
        const yes = yesNo[0] as Text;
        const no = yesNo[1] as Text;
        return explainedChoice(rng, {
          prompt: t(`Is $\\mathbf{F} = ${field}$ source-free?`, `$\\mathbf{F} = ${field}$ 是无源场吗？`),
          correct: free ? yes : no,
          wrong: [
            free
              ? {
                  option: no,
                  why: t(
                    `$P_x = ${a}$ and $Q_y = ${b}$ add to $0$; the terms $${poly([c, "y^2"])}$ and $${poly([d, "x^2"])}$ do not enter the divergence`,
                    `$P_x = ${a}$ 与 $Q_y = ${b}$ 之和为 $0$；项 $${poly([c, "y^2"])}$ 和 $${poly([d, "x^2"])}$ 不进入散度`,
                  ),
                }
              : {
                  option: yes,
                  why: t(
                    `$P_x + Q_y = ${a} + ${paren(b)} = ${a + b}$, which is not $0$`,
                    `$P_x + Q_y = ${a} + ${paren(b)} = ${a + b}$，不为 $0$`,
                  ),
                },
          ],
          solution: walked(
            [
              [
                ["Differentiate P in x", "对 P 关于 x 求导"],
                t(`$P_x = ${a}$, since $${poly([c, "y^2"])}$ does not involve $x$.`, `$P_x = ${a}$，因为 $${poly([c, "y^2"])}$ 不含 $x$。`),
              ],
              [
                ["Differentiate Q in y", "对 Q 关于 y 求导"],
                t(`$Q_y = ${b}$, since $${poly([d, "x^2"])}$ does not involve $y$.`, `$Q_y = ${b}$，因为 $${poly([d, "x^2"])}$ 不含 $y$。`),
              ],
              [
                ["Add", "相加"],
                t(
                  free
                    ? `$${a} + ${paren(b)} = 0$ everywhere, so the field is source-free.`
                    : `$${a} + ${paren(b)} = ${a + b} \\ne 0$, so the field is not source-free.`,
                  free
                    ? `处处 $${a} + ${paren(b)} = 0$，所以这个场是无源的。`
                    : `$${a} + ${paren(b)} = ${a + b} \\ne 0$，所以这个场不是无源的。`,
                ),
              ],
            ],
            t(
              `Across the square $[0, 1] \\times [0, 1]$ the $y^2$ terms cancel between the right and left sides, which together give $${a}$, and the $x^2$ terms cancel between the top and bottom, which give $${b}$; the net outward flux is $${a + b}$, ${free ? "zero as it must be" : "not zero"}.`,
              `穿过正方形 $[0, 1] \\times [0, 1]$，右边与左边的 $y^2$ 项相互抵消，两边合计 $${a}$；顶边与底边的 $x^2$ 项相互抵消，合计 $${b}$；净外法向通量为 $${a + b}$，${free ? "正应为零" : "不为零"}。`,
            ),
          ),
        });
      },
    },
    {
      id: "making-a-field-source-free",
      title: t("Making a field source-free", "使向量场无源"),
      explanation: t(
        "To choose a constant that makes a field source-free, write the divergence $P_x + Q_y$ in terms of the constant and pick the value that makes it vanish for every point $(x, y)$. For $\\langle 6x^2 + y, kxy \\rangle$, $P_x + Q_y = 12x + kx = (12 + k)x$, which vanishes everywhere only for $k = -12$.\n\n> **Watch out.** $\\frac{\\partial}{\\partial x}(ax^2) = 2ax$, so the factor $2$ must be kept; and the divergence must vanish for every $x$, which fixes $k$ completely.",
        "要选取一个常数使向量场无源，就把散度 $P_x + Q_y$ 用这个常数表示出来，再选出使它对每个点 $(x, y)$ 都为零的值。对 $\\langle 6x^2 + y, kxy \\rangle$，$P_x + Q_y = 12x + kx = (12 + k)x$，它处处为零当且仅当 $k = -12$。\n\n> **注意。** $\\frac{\\partial}{\\partial x}(ax^2) = 2ax$，因子 $2$ 必须保留；散度要对每个 $x$ 都为零，这就完全确定了 $k$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);
        const ans = -2 * a;
        const field = `\\langle ${poly([a, "x^2"], [c, "y"])}, kxy \\rangle`;
        return numberProblem({
          prompt: t(
            `Find the constant $k$ for which $\\mathbf{F} = ${field}$ is source-free.`,
            `求常数 $k$，使 $\\mathbf{F} = ${field}$ 为无源场。`,
          ),
          answer: ans,
          solveFor: "k",
          mistakes: distinct(ans, [
            why(2 * a, "That has the wrong sign; $k$ must cancel $P_x$, not equal it.", "那是符号错了；$k$ 要抵消 $P_x$，而不是等于它。"),
            why(
              -a,
              `That drops the factor $2$ from $\\frac{\\partial}{\\partial x}(${poly([a, "x^2"])}) = ${poly([2 * a, "x"])}$.`,
              `那是漏掉了 $\\frac{\\partial}{\\partial x}(${poly([a, "x^2"])}) = ${poly([2 * a, "x"])}$ 中的因子 $2$。`,
            ),
            why(a, "That drops both the factor $2$ and the minus sign.", "那是既漏掉了因子 $2$，又漏掉了负号。"),
          ]),
          solution: walked(
            [
              [
                ["Differentiate P in x", "对 P 关于 x 求导"],
                t(
                  `$P_x = ${poly([2 * a, "x"])}$; the term $${poly([c, "y"])}$ drops out.`,
                  `$P_x = ${poly([2 * a, "x"])}$；项 $${poly([c, "y"])}$ 消失。`,
                ),
              ],
              [["Differentiate Q in y", "对 Q 关于 y 求导"], t("$Q_y = kx$.", "$Q_y = kx$。")],
              [
                ["Make the sum vanish", "令和为零"],
                t(
                  `$(${2 * a} + k)x = 0$ for every $x$ exactly when $k = ${ans}$.`,
                  `$(${2 * a} + k)x = 0$ 对每个 $x$ 成立，当且仅当 $k = ${ans}$。`,
                ),
              ],
            ],
            t(
              `With $k = ${ans}$, $\\mathbf{F} = \\langle ${poly([a, "x^2"], [c, "y"])}, ${poly([ans, "xy"])} \\rangle$ and $P_x + Q_y = ${poly([2 * a, "x"], [ans, "x"])} = 0$.`,
              `取 $k = ${ans}$，$\\mathbf{F} = \\langle ${poly([a, "x^2"], [c, "y"])}, ${poly([ans, "xy"])} \\rangle$，而 $P_x + Q_y = ${poly([2 * a, "x"], [ans, "x"])} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "balanced-flux-of-source-free-fields",
      figure: multivariableDrawings6["source-free-vector-fields#balanced-flux-of-source-free-fields"],
      title: t("Balanced flux of a source-free field", "无源场的通量平衡"),
      explanation: t(
        "A source-free field creates and destroys nothing inside a region, so its net outward flux across a simple closed curve is zero, a fact Green's theorem will prove. If the boundary is made of several pieces, the outward fluxes across the pieces add up to zero, which lets you find a missing one. If three sides of a square have outward fluxes $15$, $-4$ and $6$, the fourth has $-17$.\n\n> **Watch out.** The four fluxes add to zero, so the missing one is the negative of the sum of the other three, not the sum itself.",
        "无源场在区域内既不产生也不消灭任何东西，所以它穿过简单闭曲线的净外法向通量为零，这一事实将由格林公式证明。如果边界由若干段组成，各段的外法向通量之和为零，由此可以求出缺少的那一段。若正方形三条边的外法向通量为 $15$、$-4$、$6$，则第四条边为 $-17$。\n\n> **注意。** 四个通量之和为零，所以缺少的那个是其余三个之和的相反数，而不是这个和本身。",
      ),
      generate(rng: Rng): Problem {
        const f1 = rng.nonZero(-12, 12);
        const f2 = rng.nonZero(-12, 12);
        const f3 = rng.nonZero(-12, 12);
        const ans = -(f1 + f2 + f3);
        const sum = f1 + f2 + f3;
        return numberProblem({
          prompt: t(
            `A source-free field $\\mathbf{F}$ has outward fluxes $${f1}$, $${f2}$ and $${f3}$ across three sides of a square. Find its outward flux across the fourth side.`,
            `无源场 $\\mathbf{F}$ 穿过一个正方形三条边的外法向通量分别为 $${f1}$、$${f2}$ 和 $${f3}$。求它穿过第四条边的外法向通量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              sum,
              "That is the sum of the three known fluxes; the fourth must cancel it, so it is the negative.",
              "那是三个已知通量之和；第四个要抵消它，所以是它的相反数。",
            ),
            why(
              0,
              "That makes the fourth side alone zero; it is the total across all four sides that is zero.",
              "那是让第四条边单独为零；为零的是四条边的总通量。",
            ),
            why(-(f1 + f2), "That leaves out one of the three known fluxes.", "那是漏掉了三个已知通量中的一个。"),
          ]),
          solution: walked(
            [
              [
                ["Use the balance", "利用平衡"],
                t("A source-free field has net outward flux $0$ across the boundary.", "无源场穿过边界的净外法向通量为 $0$。"),
              ],
              [
                ["Add the known sides", "把已知各边相加"],
                t(`$${f1} + ${paren(f2)} + ${paren(f3)} = ${sum}$.`, `$${f1} + ${paren(f2)} + ${paren(f3)} = ${sum}$。`),
              ],
              [["Solve for the fourth", "求第四条边"], t(`$${sum} + x = 0$, so $x = ${ans}$.`, `$${sum} + x = 0$，所以 $x = ${ans}$。`)],
            ],
            t(`$${f1} + ${paren(f2)} + ${paren(f3)} + ${paren(ans)} = 0$.`, `$${f1} + ${paren(f2)} + ${paren(f3)} + ${paren(ans)} = 0$。`),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.23 Green's Theorem
// ---------------------------------------------------------------------------

/** circulationAndFluxAcrossSimpleClosedPlaneCurves contrasts circulation and flux. */
export const circulationAndFluxAcrossSimpleClosedPlaneCurves: TopicDef = {
  id: "circulation-and-flux-across-simple-closed-plane-curves",
  title: t("Circulation and Flux Across Simple Closed Plane Curves", "简单闭曲线上的环量与通量"),
  summary: t(
    "Circulation $\\oint_C (P\\,dx + Q\\,dy)$ accumulates the field along the tangent $\\mathbf{T}$, while flux $\\oint_C (P\\,dy - Q\\,dx)$ accumulates it across the outward normal $\\mathbf{n}$.",
    "环量 $\\oint_C (P\\,dx + Q\\,dy)$ 沿切向量 $\\mathbf{T}$ 累积场，通量 $\\oint_C (P\\,dy - Q\\,dx)$ 沿向外法向量 $\\mathbf{n}$ 累积场。",
  ),
  intro: t(
    "Take $\\mathbf{F} = \\langle 0, x \\rangle$ on the boundary of $[0, 2] \\times [0, 1]$, counterclockwise. Its circulation is $\\oint x\\,dy$: only the right side, at $x = 2$, counts, giving $\\int_0^1 2\\,dy = 2$. Its outward flux is $\\oint (P\\,dy - Q\\,dx) = -\\oint x\\,dx$: the top, run from $x = 2$ to $x = 0$, gives $-\\int_2^0 x\\,dx = 2$, and the bottom, run from $0$ to $2$, gives $-\\int_0^2 x\\,dx = -2$, so the flux is $0$.\n\nCheck: $-x\\,dx$ is the differential of $-\\frac{x^2}{2}$, so its integral around any closed curve is $0$.\n\nIn this lesson we compute both quantities for the same field and curve: circulation along the tangent, flux across the normal.",
    "取 $\\mathbf{F} = \\langle 0, x \\rangle$，沿 $[0, 2] \\times [0, 1]$ 的边界逆时针方向。它的环量是 $\\oint x\\,dy$：只有右边（$x = 2$）起作用，得 $\\int_0^1 2\\,dy = 2$。它的外法向通量是 $\\oint (P\\,dy - Q\\,dx) = -\\oint x\\,dx$：顶边从 $x = 2$ 走到 $x = 0$，给出 $-\\int_2^0 x\\,dx = 2$；底边从 $0$ 走到 $2$，给出 $-\\int_0^2 x\\,dx = -2$；所以通量为 $0$。\n\n检验：$-x\\,dx$ 是 $-\\frac{x^2}{2}$ 的微分，所以它沿任意闭曲线的积分为 $0$。\n\n本课我们对同一个场和同一条曲线计算两个量：沿切向的环量和穿过法向的通量。",
  ),
  prerequisites: ["circulation", "calculating-flux-in-two-dimensional-vector-fields"],
  encompasses: [
    { topic: "circulation", weight: 0.3 },
    { topic: "calculating-flux-in-two-dimensional-vector-fields", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "circulation-form-vs-flux-form",
      title: t("Circulation form vs flux form", "环量形式与通量形式的线积分表达式"),
      explanation: t(
        "Circulation measures flow along the curve using the tangent direction, while flux measures flow across the curve using the outward normal direction. For $\\mathbf{F} = \\langle P, Q \\rangle$:\n- **Circulation**: $\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$.\n- **Outward Flux**: $\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx)$.\n\nFor $\\langle x, 4y \\rangle$ across the boundary of $[0, 1] \\times [0, 3]$, the flux is $(1 + 4) \\cdot 3 = 15$, while the circulation is $0$.\n\n> **Watch out.** The flux of a field like $\\langle ax, by \\rangle$ comes from both $a$ and $b$; its circulation is a different number, here $0$, because the field has no rotation.",
        "环量用切线方向衡量沿曲线的流动，通量则用外法线方向衡量穿过曲线的流动。对于平面向量场 $\\mathbf{F} = \\langle P, Q \\rangle$：\n- **环量**：$\\oint_C \\mathbf{F} \\cdot \\mathbf{T}\\,ds = \\oint_C (P\\,dx + Q\\,dy)$。\n- **外法向通量**：$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx)$。\n\n对 $\\langle x, 4y \\rangle$ 穿过 $[0, 1] \\times [0, 3]$ 的边界，通量为 $(1 + 4) \\cdot 3 = 15$，而环量为 $0$。\n\n> **注意。** 像 $\\langle ax, by \\rangle$ 这样的场，其通量同时来自 $a$ 和 $b$；它的环量是另一个数，这里为 $0$，因为这个场没有旋转。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const W = rng.int(2, 8);
        const H = rng.int(2, 8);
        const ans = (a + b) * W * H;
        return numberProblem({
          prompt: t(
            `Calculate the outward flux $\\oint_C (P\\,dy - Q\\,dx)$ of the vector field $\\mathbf{F} = \\langle ${a}x, ${b}y \\rangle$ across the boundary $C$ of the rectangle $[0, ${W}] \\times [0, ${H}]$, oriented counterclockwise.`,
            `计算向量场 $\\mathbf{F} = \\langle ${a}x, ${b}y \\rangle$ 穿过逆时针定向的矩形区域 $[0, ${W}] \\times [0, ${H}]$ 边界 $C$ 的外法向通量 $\\oint_C (P\\,dy - Q\\,dx)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * W * H,
              "That counts only the flow out through the right side; $Q$ carries flow out through the top as well.",
              "那是只算了从右边流出的部分；$Q$ 也会从顶边带出流量。",
            ),
            why(
              b * W * H,
              "That counts only the flow out through the top; $P$ carries flow out through the right side as well.",
              "那是只算了从顶边流出的部分；$P$ 也会从右边带出流量。",
            ),
            why(
              0,
              "That is the circulation $\\oint (P\\,dx + Q\\,dy)$; the flux uses $P\\,dy - Q\\,dx$.",
              "那是环量 $\\oint (P\\,dx + Q\\,dy)$；通量用的是 $P\\,dy - Q\\,dx$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the flux form", "用通量形式"],
                t(
                  "By the flux form of Green's theorem, $\\oint_C (P\\,dy - Q\\,dx) = \\iint_D (P_x + Q_y)\\,dA$.",
                  "由格林公式通量形式，$\\oint_C (P\\,dy - Q\\,dx) = \\iint_D (P_x + Q_y)\\,dA$。",
                ),
              ],
              [["Find the divergence", "求散度"], t(`$P_x + Q_y = ${a} + ${b} = ${a + b}$.`, `$P_x + Q_y = ${a} + ${b} = ${a + b}$。`)],
              [
                ["Multiply by the area", "乘以面积"],
                t(`$${a + b} \\cdot ${W} \\cdot ${H} = ${ans}$.`, `$${a + b} \\cdot ${W} \\cdot ${H} = ${ans}$。`),
              ],
            ],
            t(
              `Edge by edge: the right side gives $\\int_0^{${H}} ${a * W}\\,dy = ${a * W * H}$, the top gives $\\int_0^{${W}} ${b * H}\\,dx = ${b * H * W}$, and the left and bottom give $0$ because $P = 0$ at $x = 0$ and $Q = 0$ at $y = 0$; the total is $${ans}$.`,
              `逐边计算：右边给出 $\\int_0^{${H}} ${a * W}\\,dy = ${a * W * H}$，顶边给出 $\\int_0^{${W}} ${b * H}\\,dx = ${b * H * W}$，左边和底边因 $x = 0$ 处 $P = 0$、$y = 0$ 处 $Q = 0$ 而给出 $0$；合计 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "circulation-around-a-rectangle-edge-by-edge",
      figure: multivariableDrawings6["circulation-and-flux-across-simple-closed-plane-curves#circulation-around-a-rectangle-edge-by-edge"],
      title: t("Circulation around a rectangle edge by edge", "逐边计算绕矩形的环量"),
      explanation: t(
        "The counterclockwise circulation $\\oint_C P\\,dx + Q\\,dy$ around the rectangle $[0, w] \\times [0, h]$ is the sum over its four edges. For $\\mathbf{F} = \\langle ay, bx \\rangle$: the bottom edge has $y = 0$ and the left edge has $x = 0$, so both give $0$. The right edge, going up at $x = w$, gives $\\int_0^h bw\\,dy = bwh$. The top edge, going left at $y = h$, gives $\\int_w^0 ah\\,dx = -awh$. The circulation is $(b - a)wh$. For $\\langle -y, 6x \\rangle$ around $[0, 2] \\times [0, 1]$, the edges give $12$ and $2$, so the circulation is $14$.\n\n> **Watch out.** The answer multiplies by the area $wh$, because each edge integral is a height times a length; adding $w + h$ instead mixes up the two.",
        "绕矩形 $[0, w] \\times [0, h]$ 的逆时针环量 $\\oint_C P\\,dx + Q\\,dy$ 是四条边之和。对 $\\mathbf{F} = \\langle ay, bx \\rangle$：底边 $y = 0$，左边 $x = 0$，都贡献 $0$。右边在 $x = w$ 向上，贡献 $\\int_0^h bw\\,dy = bwh$。顶边在 $y = h$ 向左，贡献 $\\int_w^0 ah\\,dx = -awh$。环量为 $(b - a)wh$。对 $\\langle -y, 6x \\rangle$ 绕 $[0, 2] \\times [0, 1]$，两条边分别给出 $12$ 和 $2$，环量为 $14$。\n\n> **注意。** 结果乘的是面积 $wh$，因为每条边的积分都是一个值乘以一个长度；改成加 $w + h$ 就把二者混淆了。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        let b = rng.nonZero(-5, 5);
        if (b === a) b = -a;
        const w = rng.int(1, 6);
        const h = rng.int(1, 6);
        const ans = (b - a) * w * h;
        return numberProblem({
          prompt: t(
            `Find the counterclockwise circulation of $\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ around the boundary of the rectangle $0 \\le x \\le ${w}$, $0 \\le y \\le ${h}$.`,
            `求 $\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "x"])} \\rangle$ 绕矩形 $0 \\le x \\le ${w}$，$0 \\le y \\le ${h}$ 边界的逆时针环量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              (a + b) * w * h,
              "That runs along the top from left to right; counterclockwise it goes leftward, which changes the sign.",
              "那是把顶边当成从左向右；逆时针时它向左走，要变号。",
            ),
            why(
              (a - b) * w * h,
              "That is the clockwise circulation, the negative of the counterclockwise one.",
              "那是顺时针方向的环量，是逆时针环量的相反数。",
            ),
            why(b * w * h, "That counts only the right edge; the top edge contributes too.", "那是只算了右边；顶边也有贡献。"),
            why(
              (b - a) * (w + h),
              "That adds the sides $w + h$ where each edge integral is a value times a length, giving the area $wh$.",
              "那是把边长相加成 $w + h$；每条边的积分是一个值乘以一个长度，结果是面积 $wh$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Bottom and left edges", "底边与左边"],
                t(
                  "$y = 0$ on the bottom makes $P = 0$, and $x = 0$ on the left makes $Q = 0$, so both give $0$.",
                  "底边 $y = 0$ 使 $P = 0$，左边 $x = 0$ 使 $Q = 0$，所以都给出 $0$。",
                ),
              ],
              [
                ["Right edge", "右边"],
                t(
                  `Going up at $x = ${w}$: $\\int_0^{${h}} ${b * w}\\,dy = ${b * w * h}$.`,
                  `在 $x = ${w}$ 向上：$\\int_0^{${h}} ${b * w}\\,dy = ${b * w * h}$。`,
                ),
              ],
              [
                ["Top edge", "顶边"],
                t(
                  `Going left at $y = ${h}$: $\\int_{${w}}^0 ${a * h}\\,dx = ${-a * w * h}$.`,
                  `在 $y = ${h}$ 向左：$\\int_{${w}}^0 ${a * h}\\,dx = ${-a * w * h}$。`,
                ),
              ],
              [["Add", "相加"], t(`$${b * w * h} + ${paren(-a * w * h)} = ${ans}$.`, `$${b * w * h} + ${paren(-a * w * h)} = ${ans}$。`)],
            ],
            t(
              `Clockwise, the right edge runs down and the top runs right, giving $${-b * w * h} + ${paren(a * w * h)} = ${-ans}$, the negative of $${ans}$, as reversing the curve must.`,
              `顺时针时右边向下、顶边向右，得 $${-b * w * h} + ${paren(a * w * h)} = ${-ans}$，正是 $${ans}$ 的相反数，与曲线反向应有的结果一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** greensTheoremInCirculationCurlForm connects circulation to the curl double integral. */
export const greensTheoremInCirculationCurlForm: TopicDef = {
  id: "greens-theorem-in-circulation-curl-form",
  title: t("Introduction to Green's Theorem", "格林公式简介"),
  summary: t(
    "Green's theorem equates the counterclockwise circulation to the double integral of the curl: $\\oint_C (P\\,dx + Q\\,dy) = \\iint_D (Q_x - P_y)\\,dA$.",
    "格林公式把逆时针方向的环量与旋度的二重积分联系起来：$\\oint_C (P\\,dx + Q\\,dy) = \\iint_D (Q_x - P_y)\\,dA$。",
  ),
  intro: t(
    "Find the counterclockwise circulation of $\\mathbf{F} = \\langle -y, x \\rangle$ around the unit circle by Green's theorem. The curl is $Q_x - P_y = 1 - (-1) = 2$, a constant, so the circulation is $2$ times the area $\\pi$ of the disk: $2\\pi$.\n\nCheck: with $\\mathbf{r}(t) = (\\cos t, \\sin t)$, the integrand is $\\sin^2 t + \\cos^2 t = 1$, and $\\int_0^{2\\pi} 1\\,dt = 2\\pi$.\n\nIn this lesson we use Green's theorem to turn a circulation around a closed curve into a double integral of $Q_x - P_y$ over the region inside.",
    "用格林定理求 $\\mathbf{F} = \\langle -y, x \\rangle$ 绕单位圆的逆时针环量。旋度为 $Q_x - P_y = 1 - (-1) = 2$，是常数，所以环量是 $2$ 乘以圆盘面积 $\\pi$：$2\\pi$。\n\n检验：取 $\\mathbf{r}(t) = (\\cos t, \\sin t)$，被积函数为 $\\sin^2 t + \\cos^2 t = 1$，而 $\\int_0^{2\\pi} 1\\,dt = 2\\pi$。\n\n本课我们用格林定理把沿闭曲线的环量化为 $Q_x - P_y$ 在内部区域上的二重积分。",
  ),
  prerequisites: ["circulation-and-flux-across-simple-closed-plane-curves", "double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "applying-greens-theorem-for-circulation",
      figure: multivariableDrawings6["greens-theorem-in-circulation-curl-form#applying-greens-theorem-for-circulation"],
      title: t("Applying Green's theorem for circulation", "应用格林公式计算环量积分"),
      explanation: t(
        "Green's theorem trades the circulation around a closed curve for a double integral of the curl over the region inside it, which is often easier. By Green's theorem:\n\n$$\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA.$$ For $P = 0, Q = kx$ over a rectangle of area $A$, $\\oint_C kx\\,dy = kA$. Around $[0, 1] \\times [0, 2]$, $\\oint 7x\\,dy = 7 \\cdot 2 = 14$.\n\n> **Watch out.** The curl is $Q_x - P_y$, in that order. A constant curl multiplies the area of the region, not the length of its boundary.",
        "格林公式把沿闭曲线的环量换成在其内部区域上旋度的二重积分，后者往往更容易计算。由格林公式：\n\n$$\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA$$ 当 $P = 0, Q = kx$ 且区域为面积为 $A$ 的矩形时，$\\oint_C kx\\,dy = kA$。绕 $[0, 1] \\times [0, 2]$，$\\oint 7x\\,dy = 7 \\cdot 2 = 14$。\n\n> **注意。** 旋度是 $Q_x - P_y$，次序不能颠倒。常数旋度乘的是区域的面积，不是边界的长度。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 6);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const area = W * H;
        const ans = k * area;
        return numberProblem({
          prompt: t(
            `Use Green's Theorem to evaluate $\\oint_C ${k}x\\,dy$ around the boundary $C$ of the rectangle $D = [0, ${W}] \\times [0, ${H}]$ oriented counterclockwise.`,
            `应用格林公式计算逆时针沿矩形 $D = [0, ${W}] \\times [0, ${H}]$ 边界 $C$ 的曲线积分 $\\oint_C ${k}x\\,dy$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(area, `That is the area alone; the curl $${k}$ multiplies it.`, `那只是面积；还要乘以旋度 $${k}$。`),
            why(
              k * (W + H),
              "That multiplies the curl by half the perimeter; Green's theorem integrates the curl over the area.",
              "那是用旋度乘以半周长；格林定理是在面积上对旋度积分。",
            ),
            why(-ans, "That takes the curl as $P_y - Q_x$; it is $Q_x - P_y$.", "那是把旋度当成 $P_y - Q_x$；它是 $Q_x - P_y$。"),
          ]),
          solution: walked(
            [
              [["Identify the components", "确定分量"], t(`$P = 0$ and $Q = ${k}x$.`, `$P = 0$，$Q = ${k}x$。`)],
              [["Compute the curl", "计算旋度"], t(`$Q_x - P_y = ${k} - 0 = ${k}$.`, `$Q_x - P_y = ${k} - 0 = ${k}$。`)],
              [
                ["Integrate over the rectangle", "在矩形上积分"],
                t(
                  `$\\iint_D ${k}\\,dA = ${k} \\cdot ${W} \\cdot ${H} = ${ans}$.`,
                  `$\\iint_D ${k}\\,dA = ${k} \\cdot ${W} \\cdot ${H} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Directly, only the right edge counts: $dy = 0$ on the horizontal edges and $x = 0$ on the left, and the right edge gives $\\int_0^{${H}} ${k * W}\\,dy = ${ans}$.`,
              `直接计算，只有右边起作用：水平边上 $dy = 0$，左边上 $x = 0$，右边给出 $\\int_0^{${H}} ${k * W}\\,dy = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "circulation-around-a-circle-by-greens-theorem",
      figure: multivariableDrawings6["greens-theorem-in-circulation-curl-form#circulation-around-a-circle-by-greens-theorem"],
      title: t("Circulation around a circle by Green's theorem", "用格林定理求绕圆的环量"),
      explanation: t(
        "Green's theorem turns a counterclockwise circulation into a double integral of the scalar curl:\n\n$$\\oint_C P\\,dx + Q\\,dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA.$$\n\nTerms such as $x^2$ in $P$ or $y^3$ in $Q$ drop out of the curl. For $P = -ay + x^2$, $Q = bx + y^3$ the curl is the constant $a + b$, so the circulation around a circle of radius $R$ is $(a + b)\\pi R^2$. For $P = -6y + x^2$, $Q = 2x + y^3$ around the unit circle this is $8\\pi$.\n\n> **Watch out.** $P_y = -a$, so $Q_x - P_y = b + a$, not $b - a$. And the area of the disk is $\\pi R^2$, with $R$ squared.",
        "格林定理把逆时针环量化为标量旋度的二重积分：\n\n$$\\oint_C P\\,dx + Q\\,dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$$\n\n$P$ 中的 $x^2$ 或 $Q$ 中的 $y^3$ 这类项在旋度中消失。对 $P = -ay + x^2$，$Q = bx + y^3$，旋度为常数 $a + b$，所以绕半径 $R$ 的圆的环量为 $(a + b)\\pi R^2$。对 $P = -6y + x^2$，$Q = 2x + y^3$ 绕单位圆，结果为 $8\\pi$。\n\n> **注意。** $P_y = -a$，所以 $Q_x - P_y = b + a$，不是 $b - a$。圆盘面积是 $\\pi R^2$，$R$ 要平方。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const R = rng.int(1, 4);
        const ans = (a + b) * R * R;
        return numberProblem({
          prompt: t(
            `Use Green's theorem to find $\\frac{1}{\\pi}\\oint_C (${poly([-a, "y"], [1, "x^2"])})\\,dx + (${poly([b, "x"], [1, "y^3"])})\\,dy$, where $C$ is the circle $x^2 + y^2 = ${R * R}$ counterclockwise.`,
            `用格林定理求 $\\frac{1}{\\pi}\\oint_C (${poly([-a, "y"], [1, "x^2"])})\\,dx + (${poly([b, "x"], [1, "y^3"])})\\,dy$，$C$ 为逆时针方向的圆 $x^2 + y^2 = ${R * R}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              (b - a) * R * R,
              `That takes $P_y$ as $${a}$; it is $${-a}$, so subtracting it adds $${a}$.`,
              `那是把 $P_y$ 当成 $${a}$；它是 $${-a}$，减去它就是加上 $${a}$。`,
            ),
            why(
              (a + b) * R,
              "That uses $\\pi R$ for the area of the disk; it is $\\pi R^2$.",
              "那是把圆盘面积当成 $\\pi R$；它是 $\\pi R^2$。",
            ),
            why(
              2 * (a + b) * R * R,
              "That uses $2\\pi R^2$ for the area; the disk has area $\\pi R^2$.",
              "那是把面积当成 $2\\pi R^2$；圆盘面积是 $\\pi R^2$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Compute the curl", "计算旋度"],
                t(
                  `$Q_x - P_y = ${b} - (-${a}) = ${a + b}$; the terms $x^2$ and $y^3$ drop out.`,
                  `$Q_x - P_y = ${b} - (-${a}) = ${a + b}$；$x^2$ 与 $y^3$ 两项消失。`,
                ),
              ],
              [
                ["Find the area", "求面积"],
                t(
                  `The disk of radius $${R}$ has area $${R === 1 ? "" : R * R}\\pi$.`,
                  `半径为 $${R}$ 的圆盘面积为 $${R === 1 ? "" : R * R}\\pi$。`,
                ),
              ],
              [
                ["Multiply and divide by π", "相乘再除以 π"],
                t(
                  `The circulation is $${a + b} \\cdot ${R === 1 ? "" : R * R}\\pi = ${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                  `环量为 $${a + b} \\cdot ${R === 1 ? "" : R * R}\\pi = ${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
                ),
              ],
            ],
            t(
              `Directly, $x^2\\,dx$ and $y^3\\,dy$ are differentials of $\\frac{x^3}{3}$ and $\\frac{y^4}{4}$, so they give $0$ around the circle; the rest, $\\langle ${poly([-a, "y"])}, ${poly([b, "x"])} \\rangle$, has integrand $${poly([a * R * R, "\\sin^2 t"], [b * R * R, "\\cos^2 t"])}$, which integrates to $${ans}\\pi$.`,
              `直接计算，$x^2\\,dx$ 与 $y^3\\,dy$ 分别是 $\\frac{x^3}{3}$ 和 $\\frac{y^4}{4}$ 的微分，绕圆积分为 $0$；其余部分 $\\langle ${poly([-a, "y"])}, ${poly([b, "x"])} \\rangle$ 的被积函数是 $${poly([a * R * R, "\\sin^2 t"], [b * R * R, "\\cos^2 t"])}$，积分得 $${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** greensTheoremInPolarCoordinates evaluates the curl double integral of Green's theorem in polar coordinates. */
export const greensTheoremInPolarCoordinates: TopicDef = {
  id: "greens-theorem-in-polar-coordinates",
  title: t("Green's Theorem in Polar Coordinates", "极坐标下的格林公式"),
  summary: t(
    "When $D$ is a disk or an annulus, the double integral in Green's theorem is easiest in polar coordinates: $\\oint_C (P\\,dx + Q\\,dy) = \\int_0^{2\\pi}\\int (Q_x - P_y)\\,r\\,dr\\,d\\theta$.",
    "当 $D$ 是圆盘或圆环时，格林公式中的二重积分用极坐标计算最方便：$\\oint_C (P\\,dx + Q\\,dy) = \\int_0^{2\\pi}\\int (Q_x - P_y)\\,r\\,dr\\,d\\theta$。",
  ),
  intro: t(
    "Find the counterclockwise circulation of $\\mathbf{F} = \\langle -y^3, x^3 \\rangle$ around the unit circle. Green's theorem gives the curl $Q_x - P_y = 3x^2 + 3y^2 = 3r^2$, and in polar coordinates\n\n$$\\int_0^{2\\pi}\\int_0^1 3r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{3}{4} = \\frac{3\\pi}{2}.$$\n\nCheck: along $\\mathbf{r}(t) = (\\cos t, \\sin t)$ the integrand is $\\sin^4 t + \\cos^4 t$, and each of $\\sin^4 t$ and $\\cos^4 t$ integrates to $\\frac{3\\pi}{4}$ over a full turn, giving $\\frac{3\\pi}{2}$.\n\nIn this lesson we evaluate the double integral in Green's theorem in polar coordinates when the region is a disk or an annulus.",
    "求 $\\mathbf{F} = \\langle -y^3, x^3 \\rangle$ 绕单位圆的逆时针环量。格林定理给出旋度 $Q_x - P_y = 3x^2 + 3y^2 = 3r^2$，用极坐标\n\n$$\\int_0^{2\\pi}\\int_0^1 3r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{3}{4} = \\frac{3\\pi}{2}$$\n\n检验：沿 $\\mathbf{r}(t) = (\\cos t, \\sin t)$，被积函数为 $\\sin^4 t + \\cos^4 t$，在一整圈上 $\\sin^4 t$ 与 $\\cos^4 t$ 的积分各为 $\\frac{3\\pi}{4}$，合计 $\\frac{3\\pi}{2}$。\n\n本课我们在区域为圆盘或圆环时，用极坐标计算格林定理中的二重积分。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form", "double-integrals-in-plane-polar-coordinates"],
  encompasses: [
    { topic: "greens-theorem-in-circulation-curl-form", weight: 0.5 },
    { topic: "double-integrals-in-plane-polar-coordinates", weight: 0.4 },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "greens-theorem-over-a-disk-in-polar-coordinates",
      figure: multivariableDrawings6["greens-theorem-in-polar-coordinates#greens-theorem-over-a-disk-in-polar-coordinates"],
      title: t("Circulation around a circle", "沿圆周的环量"),
      explanation: t(
        "Once Green's theorem turns the circulation into a double integral, polar coordinates make the integral over the disk straightforward. For $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$ the curl integrand is $Q_x - P_y = 3a x^2 + 3a y^2 = 3a r^2$. Over the disk of radius $R$, remember the factor $r$ in $dA = r\\,dr\\,d\\theta$:\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_0^R 3a r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{3a R^4}{4} = \\frac{3a\\pi R^4}{2}.$$\n\nFor $\\langle -8y^3, 8x^3 \\rangle$ around the unit circle this is $12\\pi$.\n\n> **Watch out.** Leaving out the factor $r$ in $dA$ gives $r^2$ instead of $r^3$ in the integrand. And $P_y = -3ay^2$, so subtracting it adds $3ay^2$.",
        "格林公式把环量化为二重积分后，用极坐标计算圆盘上的积分就很直接。对 $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$，旋度被积函数为 $Q_x - P_y = 3a x^2 + 3a y^2 = 3a r^2$。在半径为 $R$ 的圆盘上积分时，别忘了 $dA = r\\,dr\\,d\\theta$ 中的因子 $r$：\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_0^R 3a r^2 \\cdot r\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{3a R^4}{4} = \\frac{3a\\pi R^4}{2}$$\n\n对 $\\langle -8y^3, 8x^3 \\rangle$ 绕单位圆，结果为 $12\\pi$。\n\n> **注意。** 漏掉 $dA$ 中的因子 $r$，被积函数就成了 $r^2$ 而不是 $r^3$。$P_y = -3ay^2$，减去它就是加上 $3ay^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = 2 * rng.int(1, 3);
        const p = rng.int(2, 6);
        const q = rng.int(2, 6);
        const R = rng.int(1, 3);
        const ans = (3 * a * R ** 4) / 2;
        return numberProblem({
          prompt: t(
            `Let $C$ be the circle $x^2 + y^2 = ${R * R}$, oriented counterclockwise, and $\\mathbf{F}(x, y) = \\langle ${p}x - ${a}y^3, ${a}x^3 + ${q}y \\rangle$. Use Green's theorem and polar coordinates to find $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$.`,
            `设 $C$ 为逆时针方向的圆周 $x^2 + y^2 = ${R * R}$，$\\mathbf{F}(x, y) = \\langle ${p}x - ${a}y^3, ${a}x^3 + ${q}y \\rangle$。利用格林公式和极坐标求 $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * a * R ** 3,
              "That leaves out the factor $r$ in $dA = r\\,dr\\,d\\theta$, integrating $r^2$ instead of $r^3$.",
              "那是漏掉了 $dA = r\\,dr\\,d\\theta$ 中的因子 $r$，积的是 $r^2$ 而不是 $r^3$。",
            ),
            why(
              0,
              "That uses $Q_x + P_y$, in which the two terms cancel; the curl is $Q_x - P_y$.",
              "那是用了 $Q_x + P_y$，两项相互抵消；旋度是 $Q_x - P_y$。",
            ),
            why(
              6 * a * R ** 4,
              "That drops the $\\frac{1}{4}$ from $\\int_0^R r^3\\,dr = \\frac{R^4}{4}$.",
              "那是漏掉了 $\\int_0^R r^3\\,dr = \\frac{R^4}{4}$ 中的 $\\frac{1}{4}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Compute the curl", "计算旋度"],
                t(
                  `$Q_x - P_y = ${3 * a}x^2 + ${3 * a}y^2 = ${3 * a}r^2$; the terms $${p}x$ and $${q}y$ contribute nothing.`,
                  `$Q_x - P_y = ${3 * a}x^2 + ${3 * a}y^2 = ${3 * a}r^2$；$${p}x$ 与 $${q}y$ 两项不起作用。`,
                ),
              ],
              [
                ["Set up in polar coordinates", "用极坐标表示"],
                t(
                  `The disk is $0 \\le r \\le ${R}$, $0 \\le \\theta \\le 2\\pi$, with $dA = r\\,dr\\,d\\theta$.`,
                  `圆盘为 $0 \\le r \\le ${R}$，$0 \\le \\theta \\le 2\\pi$，且 $dA = r\\,dr\\,d\\theta$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{2\\pi}\\int_0^{${R}} ${3 * a}r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${3 * a} \\cdot ${R ** 4}}{4} = ${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                  `$\\int_0^{2\\pi}\\int_0^{${R}} ${3 * a}r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${3 * a} \\cdot ${R ** 4}}{4} = ${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
                ),
              ],
            ],
            t(
              `Directly, the terms $${p}x\\,dx$ and $${q}y\\,dy$ are exact and give $0$, and the rest has integrand $${a * R ** 4}(\\sin^4 t + \\cos^4 t)$; since $\\sin^4 t$ and $\\cos^4 t$ each integrate to $\\frac{3\\pi}{4}$, the circulation is $${a * R ** 4} \\cdot \\frac{3\\pi}{2} = ${ans}\\pi$.`,
              `直接计算，$${p}x\\,dx$ 与 $${q}y\\,dy$ 是全微分，积分为 $0$；其余部分的被积函数为 $${a * R ** 4}(\\sin^4 t + \\cos^4 t)$，由于 $\\sin^4 t$ 与 $\\cos^4 t$ 的积分各为 $\\frac{3\\pi}{4}$，环量为 $${a * R ** 4} \\cdot \\frac{3\\pi}{2} = ${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "greens-theorem-over-an-annulus-in-polar-coordinates",
      figure: multivariableDrawings6["greens-theorem-in-polar-coordinates#greens-theorem-over-an-annulus-in-polar-coordinates"],
      title: t("Circulation around the boundary of an annulus", "沿圆环边界的环量"),
      explanation: t(
        "The positively oriented boundary of the annulus $r_1 \\le r \\le r_2$ is the outer circle counterclockwise together with the inner circle clockwise. Green's theorem still applies, with $r$ running from $r_1$ to $r_2$:\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_{r_1}^{r_2} (Q_x - P_y)\\,r\\,dr\\,d\\theta.$$ For $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$ this is $\\frac{3a\\pi}{2}(r_2^4 - r_1^4)$. For $\\langle -8y^3, 8x^3 \\rangle$ on $1 \\le r \\le 2$, it is $12\\pi \\cdot 15 = 180\\pi$.\n\n> **Watch out.** The inner circle is traversed clockwise, so its part is subtracted: the result has $r_2^4 - r_1^4$, not $r_2^4$ alone and not $r_2^4 + r_1^4$.",
        "圆环 $r_1 \\le r \\le r_2$ 的正向边界由逆时针方向的外圆和顺时针方向的内圆组成。格林公式依然成立，只是 $r$ 从 $r_1$ 积到 $r_2$：\n\n$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\int_0^{2\\pi}\\int_{r_1}^{r_2} (Q_x - P_y)\\,r\\,dr\\,d\\theta$$ 对 $\\mathbf{F} = \\langle -a y^3, a x^3 \\rangle$，结果为 $\\frac{3a\\pi}{2}(r_2^4 - r_1^4)$。对 $\\langle -8y^3, 8x^3 \\rangle$ 在 $1 \\le r \\le 2$ 上，结果为 $12\\pi \\cdot 15 = 180\\pi$。\n\n> **注意。** 内圆是顺时针走的，所以它那部分要减去：结果含 $r_2^4 - r_1^4$，既不是只有 $r_2^4$，也不是 $r_2^4 + r_1^4$。",
      ),
      generate(rng: Rng): Problem {
        const a = 2 * rng.int(1, 2);
        const p = rng.int(2, 6);
        const q = rng.int(2, 6);
        const r1 = rng.int(1, 2);
        const r2 = rng.int(r1 + 1, 3);
        const diff = r2 ** 4 - r1 ** 4;
        const ans = (3 * a * diff) / 2;
        const outer = (3 * a * r2 ** 4) / 2;
        const inner = (3 * a * r1 ** 4) / 2;
        return numberProblem({
          prompt: t(
            `Let $D$ be the annulus $${r1 * r1} \\le x^2 + y^2 \\le ${r2 * r2}$ and $C$ its positively oriented boundary. For $\\mathbf{F}(x, y) = \\langle ${p}x - ${a}y^3, ${a}x^3 + ${q}y \\rangle$, use Green's theorem and polar coordinates to find $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$.`,
            `设 $D$ 为圆环 $${r1 * r1} \\le x^2 + y^2 \\le ${r2 * r2}$，$C$ 为它的正向边界。对 $\\mathbf{F}(x, y) = \\langle ${p}x - ${a}y^3, ${a}x^3 + ${q}y \\rangle$，利用格林公式和极坐标求 $\\frac{1}{\\pi}\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              outer,
              "That uses the whole disk inside the outer circle; the hole is not part of the region.",
              "那是用了外圆内的整个圆盘；中间的洞不属于区域。",
            ),
            why(
              outer + inner,
              "That adds the inner circle; it is traversed clockwise, so its part is subtracted.",
              "那是加上了内圆部分；内圆顺时针走，它那部分要减去。",
            ),
            why(
              2 * a * (r2 ** 3 - r1 ** 3),
              "That leaves out the factor $r$ in $dA = r\\,dr\\,d\\theta$.",
              "那是漏掉了 $dA = r\\,dr\\,d\\theta$ 中的因子 $r$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Compute the curl", "计算旋度"],
                t(
                  `$Q_x - P_y = ${3 * a}x^2 + ${3 * a}y^2 = ${3 * a}r^2$; the terms $${p}x$ and $${q}y$ contribute nothing.`,
                  `$Q_x - P_y = ${3 * a}x^2 + ${3 * a}y^2 = ${3 * a}r^2$；$${p}x$ 与 $${q}y$ 两项不起作用。`,
                ),
              ],
              [
                ["Set up in polar coordinates", "用极坐标表示"],
                t(
                  `The annulus is $${r1} \\le r \\le ${r2}$, $0 \\le \\theta \\le 2\\pi$, with $dA = r\\,dr\\,d\\theta$.`,
                  `圆环为 $${r1} \\le r \\le ${r2}$，$0 \\le \\theta \\le 2\\pi$，且 $dA = r\\,dr\\,d\\theta$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\int_0^{2\\pi}\\int_{${r1}}^{${r2}} ${3 * a}r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${3 * a}(${r2 ** 4} - ${r1 ** 4})}{4} = ${ans}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                  `$\\int_0^{2\\pi}\\int_{${r1}}^{${r2}} ${3 * a}r^3\\,dr\\,d\\theta = 2\\pi \\cdot \\frac{${3 * a}(${r2 ** 4} - ${r1 ** 4})}{4} = ${ans}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
                ),
              ],
            ],
            t(
              `Circle by circle: counterclockwise, the outer circle alone gives $${outer}\\pi$ and the inner circle $${inner}\\pi$; the boundary takes the inner one clockwise, so the total is $${outer}\\pi - ${inner}\\pi = ${ans}\\pi$.`,
              `逐个圆计算：逆时针时，外圆单独给出 $${outer}\\pi$，内圆给出 $${inner}\\pi$；边界上内圆是顺时针走的，所以合计 $${outer}\\pi - ${inner}\\pi = ${ans}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingAreasUsingGreensTheorem evaluates areas via boundary line integrals. */
export const calculatingAreasUsingGreensTheorem: TopicDef = {
  id: "calculating-areas-using-greens-theorem",
  title: t("Using Green's Theorem to Calculate Area", "应用格林公式计算平面区域面积"),
  summary: t(
    "Green's theorem gives area as a boundary integral: $\\operatorname{Area}(D) = \\oint_C x\\,dy = -\\oint_C y\\,dx = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$.",
    "格林公式把面积写成边界上的曲线积分：$\\operatorname{Area}(D) = \\oint_C x\\,dy = -\\oint_C y\\,dx = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$。",
  ),
  intro: t(
    "Find the area of the rectangle $[0, 3] \\times [0, 2]$ from $\\oint_C x\\,dy$, counterclockwise. The field $\\langle 0, x \\rangle$ has curl $1$, so this integral is the area. On the top and bottom $dy = 0$, on the left $x = 0$, and the right edge gives $\\int_0^2 3\\,dy = 6$.\n\nCheck: the rectangle is $3$ by $2$, and $3 \\cdot 2 = 6$.\n\nIn this lesson we compute areas from integrals around the boundary, using fields whose curl is $1$.",
    "用逆时针方向的 $\\oint_C x\\,dy$ 求矩形 $[0, 3] \\times [0, 2]$ 的面积。场 $\\langle 0, x \\rangle$ 的旋度为 $1$，所以这个积分就是面积。顶边和底边上 $dy = 0$，左边上 $x = 0$，右边给出 $\\int_0^2 3\\,dy = 6$。\n\n检验：矩形长 $3$、宽 $2$，而 $3 \\cdot 2 = 6$。\n\n本课我们利用旋度为 $1$ 的场，由沿边界的积分计算面积。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form"],
  encompasses: [{ topic: "greens-theorem-in-circulation-curl-form", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "area-formulas-from-boundary-integrals",
      title: t("Area formulas from boundary integrals", "由边界曲线积分求解平面区域面积"),
      explanation: t(
        "Choosing a field whose curl is one makes the double integral equal to the area, so the area can be computed from a line integral around the boundary. Setting $P = -\\frac{y}{2}$ and $Q = \\frac{x}{2}$ yields $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 1$, giving the area formula:\n\n$$\\text{Area}(D) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx).$$\n\nFor the ellipse $\\mathbf{r}(t) = (10\\cos t, \\sin t)$, $x\\,dy - y\\,dx = 10\\cos^2 t\\,dt + 10\\sin^2 t\\,dt = 10\\,dt$, so the area is $\\frac{1}{2} \\cdot 10 \\cdot 2\\pi = 10\\pi$.\n\n> **Watch out.** Keep the factor $\\frac{1}{2}$: the field $\\langle -y, x \\rangle$ has curl $2$, so $\\oint_C (x\\,dy - y\\,dx)$ is twice the area.",
        "选择旋度为 1 的向量场，使二重积分等于面积，这样就能由沿边界的曲线积分算出面积。取 $P = -\\frac{y}{2}$ 与 $Q = \\frac{x}{2}$ 可得 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 1$，从而得到面积公式：\n\n$$\\text{Area}(D) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$$\n\n对椭圆 $\\mathbf{r}(t) = (10\\cos t, \\sin t)$，$x\\,dy - y\\,dx = 10\\cos^2 t\\,dt + 10\\sin^2 t\\,dt = 10\\,dt$，所以面积为 $\\frac{1}{2} \\cdot 10 \\cdot 2\\pi = 10\\pi$。\n\n> **注意。** 因子 $\\frac{1}{2}$ 不能丢：场 $\\langle -y, x \\rangle$ 的旋度为 $2$，所以 $\\oint_C (x\\,dy - y\\,dx)$ 是面积的两倍。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const b = rng.int(2, 8);
        const ans = a * b;
        return numberProblem({
          prompt: t(
            `For the ellipse with parametrization $\\mathbf{r}(t) = (${a}\\cos t, ${b}\\sin t)$ for $0 \\le t \\le 2\\pi$, find $\\frac{\\text{Area}(E)}{\\pi}$ using Green's area formula $\\text{Area}(E) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$.`,
            `对于由参数方程 $\\mathbf{r}(t) = (${a}\\cos t, ${b}\\sin t)$（$0 \\le t \\le 2\\pi$）定义的椭圆，利用格林面积公式 $\\text{Area}(E) = \\frac{1}{2}\\oint_C (x\\,dy - y\\,dx)$ 计算 $\\frac{\\text{Area}(E)}{\\pi}$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(2 * ans, "That drops the factor $\\frac{1}{2}$ in the area formula.", "那是漏掉了面积公式中的因子 $\\frac{1}{2}$。"),
            why(a + b, "That adds the semi-axes; the integrand is their product.", "那是把两个半轴相加；被积式是它们的乘积。"),
            why(
              Math.max(a, b) ** 2,
              "That treats the ellipse as a circle with the longer semi-axis as radius.",
              "那是把椭圆当成以较长半轴为半径的圆。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the differentials", "求微分"],
                t(`$dx = -${a}\\sin t\\,dt$ and $dy = ${b}\\cos t\\,dt$.`, `$dx = -${a}\\sin t\\,dt$，$dy = ${b}\\cos t\\,dt$。`),
              ],
              [
                ["Simplify the integrand", "化简被积式"],
                t(
                  `$x\\,dy - y\\,dx = ${a * b}\\cos^2 t\\,dt + ${a * b}\\sin^2 t\\,dt = ${a * b}\\,dt$.`,
                  `$x\\,dy - y\\,dx = ${a * b}\\cos^2 t\\,dt + ${a * b}\\sin^2 t\\,dt = ${a * b}\\,dt$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{1}{2}\\int_0^{2\\pi} ${a * b}\\,dt = ${a * b}\\pi$, and dividing by $\\pi$ gives $${ans}$.`,
                  `$\\frac{1}{2}\\int_0^{2\\pi} ${a * b}\\,dt = ${a * b}\\pi$，除以 $\\pi$ 得 $${ans}$。`,
                ),
              ],
            ],
            t(
              `The other formula agrees: $\\oint_C x\\,dy = \\int_0^{2\\pi} ${a * b}\\cos^2 t\\,dt = ${a * b}\\pi$.`,
              `另一个公式给出相同结果：$\\oint_C x\\,dy = \\int_0^{2\\pi} ${a * b}\\cos^2 t\\,dt = ${a * b}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-area-of-a-triangle-from-a-boundary-integral",
      figure: multivariableDrawings6["calculating-areas-using-greens-theorem#the-area-of-a-triangle-from-a-boundary-integral"],
      title: t("The area of a triangle from a boundary integral", "用边界积分求三角形面积"),
      explanation: t(
        "Green's theorem gives the area of a region as $A = \\frac12\\oint_C x\\,dy - y\\,dx$ around its counterclockwise boundary. Along a segment through the origin, $x\\,dy - y\\,dx = 0$, because the point moves straight away from or toward the origin. For the triangle with vertices $(0, 0)$, $(a, b)$, $(c, d)$ only the edge from $(a, b)$ to $(c, d)$ contributes, and it gives $ad - bc$. So\n\n$$A = \\tfrac12(ad - bc)$$\n\nwhen the vertices are in counterclockwise order. For $(0, 0)$, $(9, 2)$, $(1, 4)$ this is $\\frac{1}{2}(36 - 2) = 17$.\n\n> **Watch out.** The product $bc$ is subtracted, and the result is halved; $ad - bc$ alone is the area of the parallelogram on the two edges.",
        "格林定理给出区域面积 $A = \\frac12\\oint_C x\\,dy - y\\,dx$，沿逆时针边界积分。沿过原点的线段，$x\\,dy - y\\,dx = 0$，因为点径直远离或接近原点。对顶点为 $(0, 0)$、$(a, b)$、$(c, d)$ 的三角形，只有从 $(a, b)$ 到 $(c, d)$ 的边有贡献，其值为 $ad - bc$。所以当顶点为逆时针顺序时\n\n$$A = \\tfrac12(ad - bc)$$\n\n对 $(0, 0)$、$(9, 2)$、$(1, 4)$，结果为 $\\frac{1}{2}(36 - 2) = 17$。\n\n> **注意。** 乘积 $bc$ 要减去，结果还要减半；单独的 $ad - bc$ 是以两条边为邻边的平行四边形的面积。",
      ),
      generate(rng: Rng): Problem {
        let a = rng.int(1, 6);
        let b = rng.int(-3, 3);
        let c = rng.int(-3, 4);
        let d = rng.int(1, 6);
        if (a * d - b * c <= 0) {
          [a, b, c, d] = [a + 2, b, c, d + 2];
          if (a * d - b * c <= 0) [b, c] = [0, 0];
        }
        const det = a * d - b * c;
        const ans = Q.of(det, 2);
        const first = Q.of(a * b, 2);
        const middle = Q.of((a + c) * (d - b), 2);
        const last = Q.of(-c * d, 2);
        return numberProblem({
          prompt: t(
            `Use $A = \\frac12\\oint_C x\\,dy - y\\,dx$ to find the area of the triangle with vertices $(0, 0)$, $(${a}, ${b})$ and $(${c}, ${d})$.`,
            `用 $A = \\frac12\\oint_C x\\,dy - y\\,dx$ 求顶点为 $(0, 0)$、$(${a}, ${b})$、$(${c}, ${d})$ 的三角形面积。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(det),
              "That drops the factor $\\frac{1}{2}$; $ad - bc$ is the area of the parallelogram.",
              "那是漏掉了因子 $\\frac{1}{2}$；$ad - bc$ 是平行四边形的面积。",
            ),
            why(Q.of(a * d + b * c, 2), "That adds $bc$; the edge gives $ad - bc$.", "那是加上了 $bc$；这条边给出的是 $ad - bc$。"),
            why(
              Q.of(a * c + b * d, 2),
              "That uses the dot product $ac + bd$ of the two vertices instead of $ad - bc$.",
              "那是用了两个顶点的点积 $ac + bd$，而不是 $ad - bc$。",
            ),
            why(Q.of(a * d, 2), "That leaves out the term $bc$.", "那是漏掉了 $bc$ 项。"),
          ]),
          solution: walked(
            [
              [
                ["Edges through the origin", "过原点的边"],
                t(
                  "On the edges to and from $(0, 0)$ the point moves along a ray, so $x\\,dy - y\\,dx = 0$.",
                  "在通向和离开 $(0, 0)$ 的边上，点沿射线运动，所以 $x\\,dy - y\\,dx = 0$。",
                ),
              ],
              [
                ["The third edge", "第三条边"],
                t(
                  `From $(${a}, ${b})$ to $(${c}, ${d})$ it gives $${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$.`,
                  `从 $(${a}, ${b})$ 到 $(${c}, ${d})$ 给出 $${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$。`,
                ),
              ],
              [
                ["Halve", "减半"],
                t(`$A = \\frac{1}{2} \\cdot ${det} = ${ans.toLatex()}$.`, `$A = \\frac{1}{2} \\cdot ${det} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `With $\\oint_C x\\,dy$ alone, the three edges give $${first.toLatex()}$, $${middle.toLatex()}$ and $${last.toLatex()}$, which add to $${ans.toLatex()}$.`,
              `只用 $\\oint_C x\\,dy$，三条边分别给出 $${first.toLatex()}$、$${middle.toLatex()}$、$${last.toLatex()}$，合计 $${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** greensTheoremInFluxDivergenceForm connects outward flux to the divergence double integral. */
export const greensTheoremInFluxDivergenceForm: TopicDef = {
  id: "greens-theorem-in-flux-divergence-form",
  title: t("Green's Theorem in Flux Form", "格林公式的通量形式"),
  summary: t(
    "The flux form of Green's theorem equates the outward flux across $C$ to the double integral of the divergence: $\\oint_C (P\\,dy - Q\\,dx) = \\iint_D (P_x + Q_y)\\,dA$.",
    "格林公式的通量形式把穿过 $C$ 的向外通量与散度的二重积分联系起来：$\\oint_C (P\\,dy - Q\\,dx) = \\iint_D (P_x + Q_y)\\,dA$。",
  ),
  intro: t(
    "Find the outward flux of $\\mathbf{F} = \\langle x, y \\rangle$ across the unit circle. The divergence is $P_x + Q_y = 1 + 1 = 2$, so by Green's theorem in flux form the flux is $2$ times the area $\\pi$: $2\\pi$.\n\nCheck: on the unit circle $\\mathbf{F}$ is the outward unit normal itself, so $\\mathbf{F} \\cdot \\mathbf{n} = 1$, and the flux is the length $2\\pi$ of the circle.\n\nIn this lesson we compute outward flux across a closed curve as the double integral of the divergence over the region inside.",
    "求 $\\mathbf{F} = \\langle x, y \\rangle$ 穿过单位圆的外法向通量。散度为 $P_x + Q_y = 1 + 1 = 2$，所以由通量形式的格林公式，通量是 $2$ 乘以面积 $\\pi$：$2\\pi$。\n\n检验：在单位圆上 $\\mathbf{F}$ 就是向外的单位法向量，所以 $\\mathbf{F} \\cdot \\mathbf{n} = 1$，通量就是圆周长 $2\\pi$。\n\n本课我们把穿过闭曲线的外法向通量化为散度在内部区域上的二重积分来计算。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form", "the-divergence-of-a-vector-field"],
  encompasses: [{ topic: "the-divergence-of-a-vector-field", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "two-dimensional-divergence-theorem",
      figure: multivariableDrawings6["greens-theorem-in-flux-divergence-form#two-dimensional-divergence-theorem"],
      title: t("Two-dimensional divergence theorem", "应用二维散度定理计算通量"),
      explanation: t(
        "The flux form of Green's theorem says that the net flow out through the boundary equals the total divergence inside the region. Green's theorem in flux form states:\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx) = \\iint_D \\text{div}\\,\\mathbf{F}\\,dA = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right)dA.$$\n\nFor $\\langle 6x, y \\rangle$ across the boundary of $[0, 1] \\times [0, 2]$ the divergence is $7$ and the area $2$, so the flux is $14$.\n\n> **Watch out.** The divergence adds $P_x$ and $Q_y$, and a constant divergence multiplies the area, not the perimeter.",
        "格林公式的通量形式说明，穿过边界向外的净流量等于区域内散度的总和。通量形式的格林公式（平面散度定理）表明：\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\oint_C (P\\,dy - Q\\,dx) = \\iint_D \\text{div}\\,\\mathbf{F}\\,dA = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right)dA$$\n\n对 $\\langle 6x, y \\rangle$ 穿过 $[0, 1] \\times [0, 2]$ 的边界，散度为 $7$，面积为 $2$，所以通量为 $14$。\n\n> **注意。** 散度是 $P_x$ 与 $Q_y$ 之和；常数散度乘的是面积，不是周长。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const W = rng.int(2, 6);
        const H = rng.int(2, 6);
        const div = a + b;
        const area = W * H;
        const ans = div * area;
        return numberProblem({
          prompt: t(
            `Find the outward flux $\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds$ of $\\mathbf{F}(x, y) = \\langle ${poly([a, "x"])}, ${poly([b, "y"])} \\rangle$ across the boundary of the rectangle $D = [0, ${W}] \\times [0, ${H}]$.`,
            `计算向量场 $\\mathbf{F}(x, y) = \\langle ${poly([a, "x"])}, ${poly([b, "y"])} \\rangle$ 穿过矩形 $D = [0, ${W}] \\times [0, ${H}]$ 边界向外的总通量 $\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(area, `That is the area alone; the divergence $${div}$ multiplies it.`, `那只是面积；还要乘以散度 $${div}$。`),
            why(
              div * (W + H),
              "That multiplies the divergence by half the perimeter; it is integrated over the area.",
              "那是用散度乘以半周长；散度是在面积上积分的。",
            ),
            why(a * area, "That uses only $P_x$; the divergence also includes $Q_y$.", "那是只用了 $P_x$；散度还包括 $Q_y$。"),
            why(b * area, "That uses only $Q_y$; the divergence also includes $P_x$.", "那是只用了 $Q_y$；散度还包括 $P_x$。"),
          ]),
          solution: walked(
            [
              [
                ["Compute the divergence", "计算散度"],
                t(`$\\text{div}\\,\\mathbf{F} = ${a} + ${b} = ${div}$.`, `$\\text{div}\\,\\mathbf{F} = ${a} + ${b} = ${div}$。`),
              ],
              [
                ["Apply the flux form", "应用通量形式"],
                t(
                  `The flux is $\\iint_D ${div}\\,dA = ${div} \\cdot \\text{Area}(D)$.`,
                  `通量为 $\\iint_D ${div}\\,dA = ${div} \\cdot \\text{Area}(D)$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `The area is $${W} \\cdot ${H} = ${area}$, so the flux is $${div} \\cdot ${area} = ${ans}$.`,
                  `面积为 $${W} \\cdot ${H} = ${area}$，所以通量为 $${div} \\cdot ${area} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Edge by edge, the right side gives $${a * W} \\cdot ${H} = ${a * W * H}$, the top $${b * H} \\cdot ${W} = ${b * H * W}$, and the left and bottom $0$; the total is $${ans}$.`,
              `逐边计算，右边给出 $${a * W} \\cdot ${H} = ${a * W * H}$，顶边 $${b * H} \\cdot ${W} = ${b * H * W}$，左边与底边为 $0$；合计 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "outward-flux-with-a-variable-divergence",
      title: t("Outward flux with a variable divergence", "散度不为常数时的向外通量"),
      explanation: t(
        "In flux form, Green's theorem says the outward flux across a closed curve equals the integral of the divergence over the enclosed region:\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right) dA.$$\n\nWhen the divergence is not constant, evaluate the double integral as an iterated integral. For $\\mathbf{F} = \\langle x^2, ky \\rangle$ on $[0, w] \\times [0, h]$ the divergence is $2x + k$, and\n\n$$\\int_0^h \\int_0^w (2x + k)\\,dx\\,dy = w^2h + kwh.$$\n\nFor $\\langle x^2, 6y \\rangle$ on $[0, 2] \\times [0, 1]$ this is $4 + 12 = 16$.\n\n> **Watch out.** $\\int_0^w 2x\\,dx = w^2$, not $2w^2$; and a variable divergence cannot be evaluated at one point and multiplied by the area.",
        "通量形式的格林定理说，穿过闭曲线的向外通量等于散度在所围区域上的积分：\n\n$$\\oint_C \\mathbf{F} \\cdot \\mathbf{n}\\,ds = \\iint_D \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}\\right) dA$$\n\n散度不是常数时，把二重积分化为累次积分。对 $\\mathbf{F} = \\langle x^2, ky \\rangle$ 在 $[0, w] \\times [0, h]$ 上，散度为 $2x + k$，\n\n$$\\int_0^h \\int_0^w (2x + k)\\,dx\\,dy = w^2h + kwh$$\n\n对 $\\langle x^2, 6y \\rangle$ 在 $[0, 2] \\times [0, 1]$ 上，结果为 $4 + 12 = 16$。\n\n> **注意。** $\\int_0^w 2x\\,dx = w^2$，不是 $2w^2$；可变的散度不能只在一点取值再乘以面积。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-4, 5);
        const w = rng.int(1, 5);
        const h = rng.int(1, 5);
        const ans = w * w * h + k * w * h;
        return numberProblem({
          prompt: t(
            `Find the outward flux of $\\mathbf{F} = \\langle x^2, ${poly([k, "y"])} \\rangle$ across the boundary of the rectangle $0 \\le x \\le ${w}$, $0 \\le y \\le ${h}$.`,
            `求 $\\mathbf{F} = \\langle x^2, ${poly([k, "y"])} \\rangle$ 穿过矩形 $0 \\le x \\le ${w}$，$0 \\le y \\le ${h}$ 边界的向外通量。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              k * w * h,
              "That leaves out the part $2x$ of the divergence that comes from $x^2$.",
              "那是漏掉了散度中来自 $x^2$ 的 $2x$ 部分。",
            ),
            why(
              2 * w * w * h + k * w * h,
              "That integrates $2x$ to $2x^2$; its antiderivative is $x^2$.",
              "那是把 $2x$ 积成了 $2x^2$；它的原函数是 $x^2$。",
            ),
            why(
              (2 * w + k) * w * h,
              `That evaluates the divergence at $x = ${w}$ and multiplies by the area; it varies across the rectangle.`,
              `那是在 $x = ${w}$ 处取散度再乘以面积；散度在矩形上是变化的。`,
            ),
            why(w * w * h - k * w * h, `That takes $Q_y$ as $${-k}$; it is $${k}$.`, `那是把 $Q_y$ 当成 $${-k}$；它是 $${k}$。`),
          ]),
          solution: walked(
            [
              [
                ["Compute the divergence", "计算散度"],
                t(
                  `$\\nabla \\cdot \\mathbf{F} = ${poly([2, "x"], [k, ""])}$.`,
                  `$\\nabla \\cdot \\mathbf{F} = ${poly([2, "x"], [k, ""])}$。`,
                ),
              ],
              [
                ["Integrate in x", "对 x 积分"],
                t(
                  `$\\int_0^{${w}} (${poly([2, "x"], [k, ""])})\\,dx = ${w * w} + ${paren(k * w)} = ${w * w + k * w}$.`,
                  `$\\int_0^{${w}} (${poly([2, "x"], [k, ""])})\\,dx = ${w * w} + ${paren(k * w)} = ${w * w + k * w}$。`,
                ),
              ],
              [
                ["Integrate in y", "对 y 积分"],
                t(`$\\int_0^{${h}} ${paren(w * w + k * w)}\\,dy = ${ans}$.`, `$\\int_0^{${h}} ${paren(w * w + k * w)}\\,dy = ${ans}$。`),
              ],
            ],
            t(
              `Edge by edge, the right side has $P = ${w * w}$ and gives $${w * w * h}$, the top has $Q = ${k * h}$ and gives $${k * h * w}$, and the left and bottom give $0$; the total is $${ans}$.`,
              `逐边计算，右边 $P = ${w * w}$，给出 $${w * w * h}$；顶边 $Q = ${k * h}$，给出 $${k * h * w}$；左边与底边为 $0$；合计 $${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** greensTheoremOnRegionsWithHoles extends Green's theorem to multiply-connected domains. */
export const greensTheoremOnRegionsWithHoles: TopicDef = {
  id: "greens-theorem-on-regions-with-holes",
  title: t("Extending Green's Theorem", "格林公式的推广：复连通区域"),
  summary: t(
    "For a region with a hole, the outer boundary $C_1$ is traversed counterclockwise and the inner boundary $C_2$ clockwise: $\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D (Q_x - P_y)\\,dA$, with both $\\oint$ taken counterclockwise.",
    "对于含孔的区域，外边界 $C_1$ 取逆时针、内边界 $C_2$ 取顺时针：$\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D (Q_x - P_y)\\,dA$，其中两个 $\\oint$ 都按逆时针计算。",
  ),
  intro: t(
    "The field $\\mathbf{F} = \\left\\langle \\frac{-y}{x^2 + y^2}, \\frac{x}{x^2 + y^2} \\right\\rangle$ is undefined at the origin and has curl $0$ everywhere else. Its counterclockwise circulation around the unit circle is $2\\pi$. Around the circle of radius $5$, Green's theorem on the annulus between them gives $\\oint_{C_5} - \\oint_{C_1} = \\iint 0\\,dA = 0$, so it is also $2\\pi$.\n\nCheck: on the circle of radius $5$, $\\mathbf{r}(t) = (5\\cos t, 5\\sin t)$ gives the integrand $\\frac{25\\sin^2 t + 25\\cos^2 t}{25} = 1$, and $\\int_0^{2\\pi} 1\\,dt = 2\\pi$.\n\nIn this lesson we apply Green's theorem to regions with holes, taking the inner boundaries clockwise.",
    "场 $\\mathbf{F} = \\left\\langle \\frac{-y}{x^2 + y^2}, \\frac{x}{x^2 + y^2} \\right\\rangle$ 在原点无定义，在其他各处旋度为 $0$。它绕单位圆的逆时针环量为 $2\\pi$。绕半径为 $5$ 的圆，对二者之间的圆环用格林定理得 $\\oint_{C_5} - \\oint_{C_1} = \\iint 0\\,dA = 0$，所以也是 $2\\pi$。\n\n检验：在半径为 $5$ 的圆上，取 $\\mathbf{r}(t) = (5\\cos t, 5\\sin t)$，被积函数为 $\\frac{25\\sin^2 t + 25\\cos^2 t}{25} = 1$，而 $\\int_0^{2\\pi} 1\\,dt = 2\\pi$。\n\n本课我们把格林定理用于有洞的区域，内边界取顺时针方向。",
  ),
  prerequisites: ["greens-theorem-in-circulation-curl-form"],
  encompasses: [{ topic: "greens-theorem-in-circulation-curl-form", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "greens-theorem-on-multiply-connected-domains",
      title: t("Green's theorem on multiply-connected domains", "复连通区域上格林公式的环量关系"),
      explanation: t(
        "For a region with a hole, the boundary has two parts, and the inner one is traversed in the opposite direction so that the region stays on the left. For an annular region $D$ between outer boundary $C_1$ and inner boundary $C_2$ (both oriented counterclockwise):\n\n$$\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA.$$\n\nIf the curl is $0$ on $D$, the two circulations are equal: an inner circulation of $40$ means an outer one of $40$, whatever the radii.\n\n> **Watch out.** A zero curl on $D$ does not make the circulations zero, because the hole may contain a point where $\\mathbf{F}$ is undefined; and the circulation does not grow with the area enclosed.",
        "对于有洞的区域，边界有两部分，内边界要反向绕行，使区域始终在左侧。对于由外边界 $C_1$ 与内边界 $C_2$（均按逆时针定向）围成的环形区域 $D$：\n\n$$\\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA$$\n\n若 $D$ 上旋度为 $0$，两个环量相等：内环量为 $40$，外环量就是 $40$，与半径无关。\n\n> **注意。** $D$ 上旋度为零并不使环量为零，因为洞里可能有 $\\mathbf{F}$ 无定义的点；环量也不随所围面积增大。",
      ),
      generate(rng: Rng): Problem {
        const R1 = rng.int(3, 8);
        const R2 = rng.int(1, R1 - 1);
        const innerCirc = rng.int(5, 30);
        const ans = innerCirc;
        return numberProblem({
          prompt: t(
            `Suppose $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$ throughout the annular region $D$ between two concentric counterclockwise circles $C_1$ (outer, radius ${R1}) and $C_2$ (inner, radius ${R2}). If $\\oint_{C_2} (P\\,dx + Q\\,dy) = ${innerCirc}$, find $\\oint_{C_1} (P\\,dx + Q\\,dy)$.`,
            `设在两个同心逆时针圆周 $C_1$（外圆，半径 ${R1}）与 $C_2$（内圆，半径 ${R2}）之间的环形区域 $D$ 内处处满足 $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$。若内圆周积分 $\\oint_{C_2} (P\\,dx + Q\\,dy) = ${innerCirc}$，求外圆周积分 $\\oint_{C_1} (P\\,dx + Q\\,dy)$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              0,
              "That applies Green's theorem as if there were no hole; the curl is zero only on the annulus, and the hole can hold a singularity.",
              "那是把格林定理当成没有洞来用；旋度只在圆环上为零，洞里可能有奇点。",
            ),
            why(
              -ans,
              "That reverses the sign; both circles are counterclockwise, and their circulations are equal.",
              "那是符号反了；两个圆都是逆时针的，环量相等。",
            ),
            why(
              Q.of(ans * R1 * R1, R2 * R2),
              "That scales the circulation by the ratio of the areas; with zero curl on the annulus it does not change.",
              "那是按面积之比放大了环量；圆环上旋度为零时它不变。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply Green's theorem on the annulus", "在圆环上应用格林定理"],
                t(
                  "$\\oint_{C_1} (P\\,dx + Q\\,dy) - \\oint_{C_2} (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA$.",
                  "$\\oint_{C_1} (P\\,dx + Q\\,dy) - \\oint_{C_2} (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA$。",
                ),
              ],
              [
                ["Use the zero curl", "利用旋度为零"],
                t("The integrand is $0$ on $D$, so the right side is $0$.", "被积函数在 $D$ 上为 $0$，所以右边为 $0$。"),
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  `$\\oint_{C_1} (P\\,dx + Q\\,dy) = \\oint_{C_2} (P\\,dx + Q\\,dy) = ${ans}$.`,
                  `$\\oint_{C_1} (P\\,dx + Q\\,dy) = \\oint_{C_2} (P\\,dx + Q\\,dy) = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The difference of the two circulations is $${ans} - ${ans} = 0$, which is the integral of the zero curl over the annulus of area $${R1 * R1 - R2 * R2}\\pi$.`,
              `两个环量之差为 $${ans} - ${ans} = 0$，正是零旋度在面积为 $${R1 * R1 - R2 * R2}\\pi$ 的圆环上的积分。`,
            ),
          ),
        });
      },
    },
    {
      id: "an-outer-circulation-from-an-inner-one",
      figure: multivariableDrawings6["greens-theorem-on-regions-with-holes#an-outer-circulation-from-an-inner-one"],
      title: t("Finding an outer circulation from an inner one", "由内边界环量求外边界环量"),
      explanation: t(
        "On an annulus $D$ between an inner circle $C_1$ and an outer circle $C_2$, both counterclockwise, Green's theorem reads\n\n$$\\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA,$$\n\nbecause the inner circle must be traversed clockwise to keep $D$ on the left. Even if $\\mathbf{F}$ is not defined at the origin, knowing the inner circulation and the curl on $D$ determines the outer one. With constant curl $c$ the right side is $c\\pi(r_2^2 - r_1^2)$. With curl $5$, an inner circulation of $2\\pi$ around $x^2 + y^2 = 1$ gives $2\\pi + 5 \\cdot 3\\pi = 17\\pi$ around $x^2 + y^2 = 4$.\n\n> **Watch out.** The curl is integrated over the annulus only, with area $\\pi(r_2^2 - r_1^2)$, and that integral is added to the inner circulation.",
        "在内圆 $C_1$ 与外圆 $C_2$（都取逆时针）之间的圆环 $D$ 上，格林定理为\n\n$$\\oint_{C_2} \\mathbf{F} \\cdot d\\mathbf{r} - \\oint_{C_1} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA,$$\n\n因为内圆必须顺时针遍历才能使 $D$ 在左侧。即使 $\\mathbf{F}$ 在原点无定义，已知内环量和 $D$ 上的旋度就能确定外环量。旋度为常数 $c$ 时右边为 $c\\pi(r_2^2 - r_1^2)$。旋度为 $5$ 时，绕 $x^2 + y^2 = 1$ 的内环量 $2\\pi$ 给出绕 $x^2 + y^2 = 4$ 的环量 $2\\pi + 5 \\cdot 3\\pi = 17\\pi$。\n\n> **注意。** 旋度只在圆环上积分，面积为 $\\pi(r_2^2 - r_1^2)$，这个积分要加到内环量上。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(1, 3);
        const r2 = r1 + rng.int(1, 3);
        const c = rng.nonZero(-3, 4);
        const m = rng.nonZero(-6, 6);
        const ring = c * (r2 * r2 - r1 * r1);
        const ans = m + ring;
        const pi = (n: number) => (n === 0 ? "0" : n === 1 ? "\\pi" : n === -1 ? "-\\pi" : `${n}\\pi`);
        return numberProblem({
          prompt: t(
            `$\\mathbf{F}$ is not defined at the origin, and $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${c}$ everywhere else. Its counterclockwise circulation around $x^2 + y^2 = ${r1 * r1}$ is $${pi(m)}$. Find $\\frac{1}{\\pi}$ times its counterclockwise circulation around $x^2 + y^2 = ${r2 * r2}$.`,
            `$\\mathbf{F}$ 在原点无定义，在其他地方 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${c}$。它绕 $x^2 + y^2 = ${r1 * r1}$ 的逆时针环量为 $${pi(m)}$。求它绕 $x^2 + y^2 = ${r2 * r2}$ 的逆时针环量的 $\\frac{1}{\\pi}$ 倍。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              ring,
              "That leaves out the inner circulation, as if $\\mathbf{F}$ were defined at the origin.",
              "那是漏掉了内环量，好像 $\\mathbf{F}$ 在原点有定义一样。",
            ),
            why(
              m - ring,
              "That subtracts the annulus term; the outer circulation is the inner one plus it.",
              "那是减去了圆环项；外环量是内环量加上它。",
            ),
            why(
              m + c * r2 * r2,
              "That integrates the curl over the whole disk; the hole is not part of the annulus.",
              "那是在整个圆盘上对旋度积分；洞不属于圆环。",
            ),
            why(
              m + c * (r2 * r2 + r1 * r1),
              "That adds the areas of the two disks; the annulus has area $\\pi(r_2^2 - r_1^2)$.",
              "那是把两个圆盘的面积相加；圆环面积是 $\\pi(r_2^2 - r_1^2)$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the area of the annulus", "求圆环面积"],
                t(
                  `$(${r2 * r2} - ${r1 * r1})\\pi = ${r2 * r2 - r1 * r1}\\pi$.`,
                  `$(${r2 * r2} - ${r1 * r1})\\pi = ${r2 * r2 - r1 * r1}\\pi$。`,
                ),
              ],
              [
                ["Apply Green's theorem", "应用格林定理"],
                t(
                  `$\\oint_{C_2} - \\oint_{C_1} = ${c} \\cdot ${r2 * r2 - r1 * r1}\\pi = ${pi(ring)}$.`,
                  `$\\oint_{C_2} - \\oint_{C_1} = ${c} \\cdot ${r2 * r2 - r1 * r1}\\pi = ${pi(ring)}$。`,
                ),
              ],
              [
                ["Add the inner circulation", "加上内环量"],
                t(
                  `$\\oint_{C_2} = (${m} + ${paren(ring)})\\pi = ${pi(ans)}$, so the answer is $${ans}$.`,
                  `$\\oint_{C_2} = (${m} + ${paren(ring)})\\pi = ${pi(ans)}$，所以答案为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `The outer minus the inner circulation is $(${ans} - ${paren(m)})\\pi = ${pi(ring)}$, which is the curl $${c}$ times the area $${r2 * r2 - r1 * r1}\\pi$.`,
              `外环量减内环量为 $(${ans} - ${paren(m)})\\pi = ${pi(ring)}$，正是旋度 $${c}$ 乘以面积 $${r2 * r2 - r1 * r1}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export all Unit 4 topics
// ---------------------------------------------------------------------------

export const multivariableCalculusLineIntegralTopics: readonly TopicDef[] = [
  // 4.18 Line Integrals of Scalar Functions
  simpleClosedAndOrientedCurves,
  lineIntegralsOfScalarFunctions,
  propertiesOfLineIntegralsOfScalarFunctions,
  lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfX,
  lineIntegralsOfScalarFunctionsOverPathsExpressedAsFunctionsOfY,

  // 4.19 Line Integrals of Scalar Functions Over Parametric Curves
  lineIntegralsOfScalarFunctionsOverLineSegments,
  lineIntegralsOfScalarFunctionsOverCircles,
  lineIntegralsOfScalarFunctionsOverEllipses,
  furtherPropertiesOfLineIntegralsOfScalarFunctions,
  lineIntegralsOfScalarFunctionsOverPolarCurves,

  // 4.20 Line Integrals With Respect to X and Y
  lineIntegralsWithRespectToXAndY,
  propertiesOfLineIntegralsWithRespectToXAndY,
  sumsOfLineIntegralsWithRespectToXAndYOverParametricCurves,
  sumsOfLineIntegralsWithRespectToXAndY,

  // 4.21 Line Integrals of Vector-Valued Functions
  lineIntegralsOfVectorValuedFunctionsOverParametricCurves,
  lineIntegralsOfVectorValuedFunctionsOverGeneralCurves,
  interpretingLineIntegralsOfVectorValuedFunctions,
  propertiesOfLineIntegralsOfVectorValuedFunctions,
  workDoneByAForceField,

  // 4.22 The Fundamental Theorem of Line Integrals
  theFundamentalTheoremOfLineIntegrals,
  pathIndependenceOfLineIntegrals,
  conservativeVectorFieldsAndClosedPaths,
  calculatingPotentialFunctionsForLineIntegrals,
  lineIntegralsOfConservativeVectorFieldsInThreeDimensions,
  conservationOfMechanicalEnergy,

  // Circulation and Flux
  outwardPointingUnitNormalVectorsIn2D,
  circulation,
  fluxInTwoDimensionalVectorFields,
  calculatingFluxInTwoDimensionalVectorFields,
  sourceFreeVectorFields,

  // 4.23 Green's Theorem
  circulationAndFluxAcrossSimpleClosedPlaneCurves,
  greensTheoremInCirculationCurlForm,
  greensTheoremInPolarCoordinates,
  calculatingAreasUsingGreensTheorem,
  greensTheoremInFluxDivergenceForm,
  greensTheoremOnRegionsWithHoles,
];
