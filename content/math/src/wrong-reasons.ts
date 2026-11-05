// Reasons for the wrong options of choices whose options are built by helpers of their own.

import { type Problem, t } from "@ga/content";

import { withMistakes } from "./problems.ts";

/** Reason names a wrong option by its English text, and says what is wrong with it in English and Chinese. */
export type Reason = readonly [response: string, en: string, zh: string];

/** unreasoned is what is said about a wrong option with no reason of its own. */
const unreasoned = t("Working the problem through does not give this.", "按步骤算下来，得不到这个结果。");

/**
 * reasoned tells a learner who picks a wrong option what is wrong with it, and adds the same to the solution, in the order the
 * options are shown. An option the problem does not list, the correct one, and a repeat of an earlier reason are skipped, so a
 * reason may be given for an option that coincides with another for some draws. A wrong option with no reason of its own, such
 * as one filled in when others coincide, gets the general `unreasoned`.
 */
export function reasoned(problem: Problem, reasons: readonly Reason[]): Problem {
  const { input } = problem.answer;
  const shown = input.kind === "choice" ? input.options : [];
  const right = shown[Number(problem.answer.expected)]?.en;
  const by = new Map<string, Reason>();
  for (const r of reasons) if (r[0] !== right && !by.has(r[0])) by.set(r[0], r);
  for (const o of shown) if (o.en !== right && !by.has(o.en)) by.set(o.en, [o.en, unreasoned.en, unreasoned["zh-CN"]]);
  const lines = (locale: "en" | "zh-CN", heading: string, why: (r: Reason) => string) => {
    const items = shown.flatMap((o) => {
      const r = by.get(o.en);
      return r ? [`- ${o[locale]} ${why(r)}`] : [];
    });
    return items.length > 0 ? `${problem.solution[locale]}\n\n${heading}\n\n${items.join("\n")}` : problem.solution[locale];
  };
  return withMistakes(
    {
      ...problem,
      solution: t(
        lines("en", "The other options:", (r) => r[1]),
        lines("zh-CN", "其他选项：", (r) => r[2]),
      ),
    },
    [...by.values()].map((r) => ({ response: r[0], why: t(r[1], r[2]) })),
  );
}
