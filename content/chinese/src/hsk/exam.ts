// The exam choice and the shelf of the Chinese exam courses, apart from the HSK courses' data so that the Gaokao topics
// can use them without loading the HSK topics.

import { type Generator, joinText, type Problem, type Rng, type Text, t } from "@ga/content";
import { quote } from "@ga/subject-chinese";

/** examGroup is the shelf of the Chinese exam courses. */
export const examGroup = t("Chinese Exams", "中文考试");

/** Ask is one item of an exam choice: what is shown, the right option, the wrong ones and the solution. */
export interface Ask {
  readonly shown: Text;
  readonly right: Text;
  readonly wrong: readonly Text[];
  readonly solution: Text;
  /** reasons say why each wrong option is wrong, in the order of wrong: told to a learner who picks it, and listed after the solution. */
  readonly reasons?: readonly Text[];
}

/** withReasons ends a solution with why each wrong option is wrong, one line an option. */
function withReasons(solution: Text, reasons: readonly Text[]): Text {
  const list = (locale: "en" | "zh-CN") => reasons.map((r) => `- ${r[locale]}`).join("\n");
  return t(`${solution.en}\n\nThe other options:\n\n${list("en")}`, `${solution["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`);
}

/** quoted sets a text as a block quote in each locale. */
const quoted = (s: Text): Text => t(quote(s.en), quote(s["zh-CN"]));

/** examChoice asks the items in turn, one a seed, with all their wrong options, shuffled by seed. */
export function examChoice(question: Text, items: readonly Ask[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    return {
      prompt: joinText([question, quoted(item.shown)]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options } },
      solution: item.reasons ? withReasons(item.solution, item.reasons) : item.solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      ...(item.reasons && {
        mistakes: item.wrong.map((w, k) => ({ response: String(options.indexOf(w)), feedback: item.reasons![k]! })),
      }),
    };
  };
}
