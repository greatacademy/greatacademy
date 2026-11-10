import { t } from "./text.ts";
import type { Checker, Json, Problem, Verdict } from "./types.ts";

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

/** orderIndexes reads a response to an order input: the indexes, separated by commas. */
export function orderIndexes(response: string): readonly number[] {
  return response.split(",").map((s) => (/^\s*\d+\s*$/.test(s) ? Number(s) : Number.NaN));
}

/** orderChecker accepts one of the listed orders; expected is an array of them, each an array of item indexes. */
export const orderChecker: Checker = {
  id: "order",
  check(expected, response) {
    const given = orderIndexes(response).join();
    return { correct: Array.isArray(expected) && expected.some((o: Json) => Array.isArray(o) && o.join() === given) };
  },
  same(_expected, response, mistake) {
    return orderIndexes(response).join() === orderIndexes(mistake).join();
  },
};

/** MAX_WRITING_CHARS is the longest text a writing response may be, whatever its problem allows. */
export const MAX_WRITING_CHARS = 8000;

/** wordCount counts the words of a text: runs without spaces that hold a letter or a digit. */
export function wordCount(text: string): number {
  return text.split(/\s+/u).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/**
 * writingChecker accepts a text of the length a judged problem asks for, the
 * check before a model judges it; expected is { minWords, maxChars }.
 */
export const writingChecker: Checker = {
  id: "writing",
  maxLength: MAX_WRITING_CHARS,
  check(expected, response) {
    const { minWords, maxChars } = expected as { minWords: number; maxChars: number };
    if (response.length > maxChars)
      return { correct: false, feedback: t(`Keep it under ${maxChars} characters.`, `请控制在 ${maxChars} 个字符以内。`) };
    if (wordCount(response) < minWords)
      return { correct: false, feedback: t(`Write at least ${minWords} words.`, `请至少写 ${minWords} 个词。`) };
    return { correct: true };
  },
};

/** coreCheckers are the checkers every subject has. */
export const coreCheckers: readonly Checker[] = [choiceChecker, textChecker, orderChecker, writingChecker];

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
    if (response.length > (checker.maxLength ?? 2000)) return { correct: false, feedback: t("The answer is too long.", "答案太长了。") };
    try {
      return checker.check(expected, response);
    } catch {
      return { correct: false };
    }
  }

  /** same tells whether a response means the same as a listed mistake; a response that makes the checker throw does not. */
  same(id: string, expected: Json, response: string, mistake: string): boolean {
    const checker = this.#checkers.get(id);
    if (!checker) throw new Error(`unknown checker ${id}`);
    if (response.length > (checker.maxLength ?? 2000)) return false;
    try {
      return checker.same ? checker.same(expected, response, mistake) : response.replace(/\s+/g, "") === mistake.replace(/\s+/g, "");
    } catch {
      return false;
    }
  }

  /** judge checks a response to a problem; a wrong one that matches a listed mistake gets the mistake's feedback. */
  judge(problem: Problem, response: string): Verdict {
    const { checker, expected } = problem.answer;
    const verdict = this.check(checker, expected, response);
    if (verdict.correct) return verdict;
    const mistake = problem.mistakes?.find((m) => this.same(checker, expected, response, m.response));
    return mistake ? { correct: false, feedback: mistake.feedback } : verdict;
  }
}
