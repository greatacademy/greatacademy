import { isText, type Text } from "./text.ts";

/**
 * Figure is a static drawing shown with a problem or an explanation. svg is
 * a self-contained SVG document drawn in `currentColor`, so that it follows
 * the client's text color in light and dark themes; class "accent" marks the
 * parts the client may draw in its accent color. Text inside the drawing is
 * language-neutral (numbers, letters, units); alt describes the figure in
 * every locale for screen readers.
 */
export interface Figure {
  readonly svg: string;
  readonly alt: Text;
}

const elements = new Set([
  "svg",
  "g",
  "line",
  "polyline",
  "polygon",
  "path",
  "circle",
  "ellipse",
  "rect",
  "text",
  "tspan",
  "title",
  "defs",
  "marker",
]);
const forbiddenAttribute = /^(on|href$|xlink:|style$)/i;

/**
 * figureIssue tells what is wrong with a figure, or undefined. Clients
 * inline figures, so the SVG is held to a small vocabulary of drawing
 * elements with a viewBox and no scripts, event handlers, styles or links.
 */
export function figureIssue(f: Figure): string | undefined {
  if (!isText(f.alt)) return "figure alt must be non-empty in every locale";
  const svg = f.svg.trim();
  if (!/^<svg\s[^>]*\bviewBox="[\d.\s-]+"/.test(svg) || !svg.endsWith("</svg>")) return "figure must be one <svg> element with a viewBox";
  for (const [, name = "", attributes = ""] of svg.matchAll(/<\/?([a-zA-Z][\w:-]*)([^>]*)>/g)) {
    if (!elements.has(name)) return `figure element <${name}> is not allowed`;
    for (const [, attribute = ""] of attributes.matchAll(/([\w:-]+)\s*=/g)) {
      if (forbiddenAttribute.test(attribute)) return `figure attribute ${attribute} is not allowed`;
    }
  }
  if (/url\(|<!|<\?/.test(svg)) return "figure must not contain url(), comments, CDATA or processing instructions";
  return undefined;
}
