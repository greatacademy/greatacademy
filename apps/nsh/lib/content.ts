import type { Figure } from "@ga/proto/common/v1/figure_pb";
import katex from "katex";
import { Marked } from "marked";
import markedKatex from "marked-katex-extension";

import { tx } from "./i18n.ts";
import { API_URL } from "./rpc.ts";

// Content is Markdown with TeX between $…$ and $$…$$ (docs/content.md §2), set up as on the web.
const marked = new Marked(markedKatex({ throwOnError: false, nonStandard: true }));

/** isPlain tells whether a content text needs nothing but a native text view: no math and no Markdown. */
export function isPlain(source: string): boolean {
  return !/[$*_`\\#<>|~[\]{}]|^\s*(?:[-+]|\d+[.)])\s/m.test(source);
}

/** figureHtml is a figure as HTML; its SVG is authored content, which the compiler limits to drawing elements. */
export function figureHtml(figure: Figure, caption = false): string {
  const text = tx(figure.alt);
  const below = caption ? `<figcaption>${escapeHtml(text)}</figcaption>` : "";
  return `<figure role="img" aria-label="${escapeHtml(text)}"><div class="figure-ga">${figure.svg}</div>${below}</figure>`;
}

/**
 * contentHtml renders a content text, with its figures in the places its lines
 * "{{figure N}}" give them. Content is authored, so its HTML is not sanitized.
 */
export function contentHtml(source: string, figures: readonly Figure[] = [], inline = false): string {
  if (inline) return marked.parseInline(source) as string;
  return source
    .split(/\{\{figure (\d+)\}\}/)
    .map((part, i) => {
      if (i % 2 === 0) return marked.parse(part) as string;
      const figure = figures[Number(part)];
      return figure ? figureHtml(figure, true) : "";
    })
    .join("");
}

/** texHtml renders a LaTeX string that may come from a learner: KaTeX escapes what it cannot typeset. */
export function texHtml(tex: string): string {
  return katex.renderToString(tex, { throwOnError: false });
}

/** escapeHtml makes a text safe to place in HTML. */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** scriptValue writes a value into an inline script, where it cannot close the script tag. */
export function scriptValue(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Palette is the design tokens a web view needs. */
export interface Palette {
  readonly ink: string;
  readonly muted: string;
  readonly accent: string;
  readonly warn: string;
  readonly good: string;
}

/**
 * pageHtml wraps content in a page for a web view, styled like the app. The page
 * reports its height, since the web view takes the height of what it shows. KaTeX
 * writes each formula twice, as HTML that needs its stylesheet and as MathML that
 * the stylesheet hides, so a page that cannot load the stylesheet keeps the MathML.
 */
export function pageHtml(body: string, palette: Palette, options: { fontSize?: number; script?: string; head?: string } = {}): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${API_URL}/embed/katex.min.css" onerror="document.documentElement.className='no-katex'">
<style>
.no-katex .katex-html{display:none}
html,body{margin:0;padding:0;background:transparent;color:${palette.ink};font:${options.fontSize ?? 16}px/1.6 -apple-system,system-ui,Roboto,"Segoe UI","Noto Sans SC",sans-serif;overflow-wrap:anywhere}
p{margin:0}*+p,ul,ol{margin-top:.75em}ul,ol{margin-bottom:0;padding-left:1.25em}strong{font-weight:600}
.katex-display{margin:.75em 0;overflow-x:auto;overflow-y:hidden}.katex{white-space:normal}
figure{margin:.75em 0 0}figcaption{margin-top:.5em;color:${palette.muted};font-size:.875em}
.figure-ga{display:flex;justify-content:center}.figure-ga svg{width:100%;max-width:28rem;height:auto;max-height:18rem;overflow:visible}
.figure-ga svg text{fill:currentColor;stroke:none;font-family:inherit}
.figure-ga .accent{color:${palette.accent}}.figure-ga .action{color:${palette.warn}}.figure-ga .result{color:${palette.good}}
</style>${options.head ?? ""}</head><body>${body}<script>
function post(m){if(window.nsh)window.nsh.postMessage(JSON.stringify(m))}
function report(){post({height:Math.ceil(document.body.getBoundingClientRect().height)})}
addEventListener("load",report);
if(window.ResizeObserver)new ResizeObserver(report).observe(document.body);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(report);
${options.script ?? ""}
</script></body></html>`;
}
