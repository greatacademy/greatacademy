import { t } from "./text.ts";
import type { Checker, Json } from "./types.ts";

/** choiceChecker accepts the index of the correct option; expected is that index. */
export const choiceChecker: Checker = {
  id: "choice",
  check(expected, response) {
    return { correct: typeof expected === "number" && response.trim() === String(expected) };
  },
};

/** normalizeText lowercases and collapses whitespace for text answers. */
export function normalizeText(s: string): string {
  return s.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

/** textChecker accepts any of the expected strings, ignoring case and spacing; expected is a string array. */
export const textChecker: Checker = {
  id: "text",
  check(expected, response) {
    const accepted = Array.isArray(expected) ? expected : [expected];
    const r = normalizeText(response);
    return { correct: accepted.some((a: Json) => typeof a === "string" && normalizeText(a) === r) };
  },
};

/** coreCheckers are the checkers every subject has. */
export const coreCheckers: readonly Checker[] = [choiceChecker, textChecker];

/** CheckerRegistry finds checkers by id. */
export class CheckerRegistry {
  readonly #checkers = new Map<string, Checker>();

  constructor(checkers: readonly Checker[]) {
    for (const c of [...coreCheckers, ...checkers]) {
      if (this.#checkers.has(c.id)) throw new Error(`duplicate checker ${c.id}`);
      this.#checkers.set(c.id, c);
    }
  }

  has(id: string): boolean {
    return this.#checkers.has(id);
  }

  /** check judges a response; a response that makes the checker throw is wrong. */
  check(id: string, expected: Json, response: string) {
    const checker = this.#checkers.get(id);
    if (!checker) throw new Error(`unknown checker ${id}`);
    if (response.length > 2000) return { correct: false, feedback: t("The answer is too long.", "答案太长了。") };
    try {
      return checker.check(expected, response);
    } catch {
      return { correct: false };
    }
  }
}
