import type { Figure, Problem, Rng } from "@ga/content";
import { t } from "@ga/content";

import { mc, mcExact, type Option, type Worked } from "../exam.ts";

// The short forms of ACT Math Prep questions, from English and Chinese strings, with a solution worked in steps.

/** ask builds a four-option question from English and Chinese strings and a worked solution; see mc in exam.ts. */
export function ask(
  rng: Rng,
  en: string,
  zh: string,
  correct: Option,
  wrong: readonly Option[],
  solution: Worked,
  figure?: Figure,
): Problem {
  return mc(rng, t(en, zh), correct, wrong, solution, figure);
}

/** askExact is ask for a question whose distractors must stay exactly as given; see mcExact in exam.ts. */
export function askExact(
  rng: Rng,
  en: string,
  zh: string,
  correct: Option,
  wrong: readonly Option[],
  solution: Worked,
  figure?: Figure,
): Problem {
  return mcExact(rng, t(en, zh), correct, wrong, solution, figure);
}
