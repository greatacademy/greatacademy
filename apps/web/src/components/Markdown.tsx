import katex from "katex";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import { memo } from "react";

// An inline formula of about this many TeX characters may not fit a phone's line:
// it may then wrap at its commas, and scrolls if it still is too wide.
const wideInlineTex = 40;

/**
 * breakableTex lets a long inline formula wrap after its top-level commas, which
 * KaTeX never does by itself, so that a list of edges or pairs reads on a phone.
 * Commas inside braces, parentheses, brackets, \left…\right and environments stay.
 */
export function breakableTex(tex: string): string {
  let depth = 0;
  return tex.replace(/\\[a-zA-Z]+|\\.|[{}()[\],]/g, (token) => {
    if (token === "\\left" || token === "\\begin" || "{([".includes(token)) depth++;
    else if (token === "\\right" || token === "\\end" || "})]".includes(token)) depth--;
    return token === "," && depth === 0 ? ",\\allowbreak " : token;
  });
}

// Content is Markdown with TeX between $…$ and $$…$$ (docs/content.md §2).
// nonStandard lets inline math touch CJK text and punctuation without spaces.
const marked = new Marked(markedKatex({ throwOnError: false, nonStandard: true }), {
  extensions: [
    {
      name: "inlineKatex",
      level: "inline",
      renderer(token) {
        const tex = token.text as string;
        if (token.displayMode || tex.length < wideInlineTex) return false;
        const html = katex.renderToString(breakableTex(tex), { throwOnError: false });
        return `<span class="katex-wide">${html}</span>`;
      },
    },
  ],
});

/** renderMarkdown renders authored content; it is trusted, so HTML is not sanitized. */
export function renderMarkdown(source: string, inline = false): string {
  return (inline ? marked.parseInline(source) : marked.parse(source)) as string;
}

/** Markdown shows a content text (or a TeX answer, with tex) as rendered HTML. */
export const Markdown = memo(function Markdown({
  source,
  inline = false,
  className,
}: {
  source: string;
  inline?: boolean;
  className?: string;
}) {
  const html = renderMarkdown(source, inline);
  return inline ? (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: authored content rendered by marked and KaTeX
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: authored content rendered by marked and KaTeX
    <div className={`prose-ga ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
});

/**
 * Tex shows a LaTeX string, such as an answer, as inline math. It goes to
 * KaTeX directly, never through Markdown: a learner's response is not
 * trusted, and KaTeX escapes whatever it cannot typeset.
 */
export function Tex({ tex, className }: { tex: string; className?: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, output: "html" });
  const classes = tex.length < wideInlineTex ? className : `katex-wide ${className ?? ""}`;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX output, which escapes its input
  return <span className={classes} dangerouslySetInnerHTML={{ __html: html }} />;
}
