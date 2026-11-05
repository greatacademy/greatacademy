import { t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { polishText } from "./polish.ts";

const en = (text: string) => polishText(t(text, "中")).en;
const zh = (text: string) => polishText(t("a", text))["zh-CN"];

describe("polishText", () => {
  it("drops coefficients of 1 in math", () => {
    expect(en("Find $a_n = -1a_{n-1} + 1x^{2}$.")).toBe("Find $a_n = -a_{n-1} + x^{2}$.");
    expect(en("$D(t) = 5 + 1\\cos t$ and $\\frac{4}{1\\pi}$")).toBe("$D(t) = 5 + \\cos t$ and $\\frac{4}{\\pi}$");
    expect(zh("$e^{1t} - 1i$")).toBe("$e^{t} - i$");
  });

  it("separates the thousands of long numbers in math", () => {
    expect(en("$12345 + 678 = 13023$ and $1234567$")).toBe("$12{,}345 + 678 = 13{,}023$ and $1{,}234{,}567$");
    expect(en("$1764 + 20736 = 22500$")).toBe("$1{,}764 + 20{,}736 = 22{,}500$");
    expect(zh("$27(1{,}000) = 27000$")).toBe("$27(1{,}000) = 27{,}000$");
  });

  it("keeps digits that are not long whole numbers", () => {
    for (const text of [
      "$2024$",
      "$3.14159$",
      "$10.00001$",
      "$69517_{14}$",
      "$0.\\overline{769230}$",
      "$00110$",
      "$x_{12345}$",
      "$\\text{12345}$",
      "12345",
    ])
      expect(en(text)).toBe(text);
  });

  it("keeps the strings of symbols of a topic", () => {
    const of = (text: string, topic: string) => polishText(t(text, "中"), topic).en;
    expect(of("$101001$", "regular-expressions")).toBe("$101001$");
    expect(of("$101001$ and $21870$", "regular-expressions")).toBe("$101001$ and $21{,}870$");
    expect(of("$11000r$", "calculating-simple-interest")).toBe("$11{,}000r$");
    expect(of("$761904$", "periods-of-repeating-decimals")).toBe("$761904$");
  });

  it("keeps a 1 that is not a coefficient", () => {
    for (const text of [
      "$\\mathrm{1E0}_{16}$",
      "$x_{1i}$",
      "$11x + 21y$",
      "$1.1x$",
      "$1 + x$",
      "$1e5$",
      "$\\frac{1}{x}$",
      "$1\\text{ m}$",
      "1x",
    ])
      expect(en(text)).toBe(text);
  });

  it("drops a value repeated in a chain of equalities", () => {
    expect(en("$k = \\frac{7}{3} = \\frac{7}{3}$")).toBe("$k = \\frac{7}{3}$");
    expect(en("$16.95 = 16.95$")).toBe("$16.95 = 16.95$");
  });

  it("makes nouns agree with a count of one", () => {
    expect(en("Both have $1$ parts, $5 - 4 = 1$ inches and 1 hours.")).toBe("Both have $1$ part, $5 - 4 = 1$ inch and 1 hour.");
    expect(en("There are $1$ boxes and $1$ feet.")).toBe("There is $1$ box and $1$ foot.");
  });

  it("leaves other counts and expressions alone", () => {
    for (const text of ["$2$ parts", "$h = t + 1$ meters", "$1$ times itself", "21 hours", "cost \\$1 parts"]) expect(en(text)).toBe(text);
  });

  it("uses an before the sound of a number", () => {
    expect(en("a $11$ in by a 8-inch and A 18 and a 89-dollar fee")).toBe("an $11$ in by an 8-inch and An 18 and an 89-dollar fee");
    expect(en("a 12 and a 110")).toBe("a 12 and a 110");
  });

  it("puts negative numbers outside math into math", () => {
    const polished = (en: string) => polishText({ en, "zh-CN": en }).en;
    expect(polished("around the point -2?")).toBe("around the point $-2$?");
    expect(polished("values 5, -1.5, 3")).toBe("values 5, $-1.5$, 3");
    expect(polished("$x = -2$ and 3-4 and x-2 and -3x and -5% and \\$-5")).toBe("$x = -2$ and 3-4 and x-2 and -3x and -5% and \\$-5");
  });
});
