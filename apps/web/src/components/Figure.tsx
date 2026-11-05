import type { Figure } from "@ga/proto/common/v1/figure_pb";

import { useI18n } from "../lib/i18n.tsx";
import { Markdown } from "./Markdown.tsx";

/**
 * FigureView shows a content figure. The SVG is authored content, checked by
 * the compiler to hold only drawing elements, so it is inlined: drawn in
 * currentColor, it follows the text color, and its "accent" parts the accent.
 */
export function FigureView({ figure, className }: { figure?: Figure; className?: string }) {
  const { tx } = useI18n();
  if (!figure) return null;
  return (
    <div
      role="img"
      aria-label={tx(figure.alt)}
      className={`figure-ga ${className ?? ""}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: authored SVG limited to drawing elements by the compiler
      dangerouslySetInnerHTML={{ __html: figure.svg }}
    />
  );
}

/** figureLine matches the line of an explanation that places a figure. */
const figureLine = /\{\{figure (\d+)\}\}/;

/** Explanation shows an explanation with its figures in the places its text gives them. */
export function Explanation({ text, figures }: { text: string; figures: readonly Figure[] }) {
  return (
    <>
      {text.split(figureLine).map((part, i) =>
        i % 2 === 1 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: the parts of an explanation are positional
          <FigureView key={i} figure={figures[Number(part)]} />
        ) : part.trim() === "" ? null : (
          // biome-ignore lint/suspicious/noArrayIndexKey: the parts of an explanation are positional
          <Markdown key={i} source={part} />
        ),
      )}
    </>
  );
}
