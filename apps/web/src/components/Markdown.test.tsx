import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { breakableTex, renderMarkdown, Tex } from "./Markdown.tsx";

describe("breakableTex", () => {
  it("breaks only after top-level commas", () => {
    expect(breakableTex("\\{(A, B), (C, D)\\}")).toBe("\\{(A, B),\\allowbreak  (C, D)\\}");
    expect(breakableTex("\\left\\{ 1, 2 \\right\\}")).toBe("\\left\\{ 1, 2 \\right\\}");
    expect(breakableTex("\\frac{1, 2}{3}")).toBe("\\frac{1, 2}{3}");
  });
});

describe("renderMarkdown", () => {
  it("lets a long inline formula wrap or scroll, and leaves short ones alone", () => {
    const list = Array.from({ length: 20 }, (_, i) => `a_{${i}}`).join(", ");
    expect(renderMarkdown(`$${list}$`, true)).toContain("katex-wide");
    expect(renderMarkdown("$x + 1$", true)).not.toContain("katex-wide");
  });

  it("typesets inline and display math", () => {
    const html = renderMarkdown("Solve $x + 7 = -2$:\n\n$$x = -9.$$");
    expect(html).toContain('class="katex"');
    expect(html).toContain("katex-display");
    expect(html).not.toContain("$");
  });

  it("typesets math touching CJK text and punctuation", () => {
    const html = renderMarkdown("解方程 $x+1=2$。", true);
    expect(html).toContain('class="katex"');
    expect(html).not.toContain("$");
  });
});

describe("Tex", () => {
  it("escapes a learner's response instead of rendering it as HTML", () => {
    const html = renderToStaticMarkup(<Tex tex={"$<img src=x onerror=alert(1)>$"} />);
    expect(html).not.toContain("<img");
  });
});
