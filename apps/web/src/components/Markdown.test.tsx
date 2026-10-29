import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { renderMarkdown, Tex } from "./Markdown.tsx";

describe("renderMarkdown", () => {
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
