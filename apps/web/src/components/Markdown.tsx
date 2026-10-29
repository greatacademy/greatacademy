import katex from "katex";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import { memo } from "react";

// Content is Markdown with TeX between $…$ and $$…$$ (docs/content.md §2).
// nonStandard lets inline math touch CJK text and punctuation without spaces.
const marked = new Marked(markedKatex({ throwOnError: false, nonStandard: true }));

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
  // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX output, which escapes its input
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
