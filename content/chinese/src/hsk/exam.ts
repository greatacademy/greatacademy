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
      solution: item.solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
    };
  };
}
