import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { describe, expect, it } from "vitest";

import { numberProblem } from "./problems.ts";

const canonical = (answer: string, solution: string, form?: "fraction") =>
  numberProblem({ prompt: t("Find it.", "求它。"), answer: Q.parse(answer), solution: t(solution, solution), ...(form && { form }) })
    .canonical;

describe("numberProblem", () => {
  it("shows the answer as a decimal when the solution works in decimals", () => {
    expect(canonical("0.54", "$1 - 0.46 = 0.54$")).toBe("0.54");
    expect(canonical("-2.5", "$\\frac{-5}{2} = -2.5$")).toBe("-2.5");
  });

  it("shows the answer as a fraction when the solution does, or says nothing of the decimal", () => {
    expect(canonical("0.5", "$\\frac{1}{2} = 0.5$")).toBe("\\frac{1}{2}");
    expect(canonical("0.5", "Half of it.")).toBe("\\frac{1}{2}");
  });

  it("does not take a longer number for the decimal", () => {
    expect(canonical("0.5", "$0.54 - 0.04$")).toBe("\\frac{1}{2}");
    expect(canonical("1.5", "$11.5 - 10$")).toBe("\\frac{3}{2}");
  });

  it("keeps a form the problem asks for", () => {
    expect(canonical("0.54", "$1 - 0.46 = 0.54$", "fraction")).toBe("\\frac{27}{50}");
  });
});
