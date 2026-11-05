import type { Figure } from "@ga/proto/common/v1/figure_pb";
import type { PlotInput } from "@ga/proto/learning/v1/learning_pb";
import { type KeyboardEvent, type MouseEvent, useEffect, useRef, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { Tex } from "./Markdown.tsx";
import { Button } from "./ui.tsx";

/** Mark is a point of the grid. */
type Mark = readonly [number, number];

/** write is the response to a plot for its points. */
const write = (marks: readonly Mark[]) => marks.map(([x, y]) => `(${x}, ${y})`).join("; ");

/** read gives the points of a response to a plot. */
function read(response: string): readonly Mark[] {
  return [...response.matchAll(/\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
}

/** snap is the point of the grid nearest to a position, kept inside the grid. */
function snap(g: PlotInput, x: number, y: number): Mark {
  const along = (v: number, min: number, max: number) => {
    const steps = Math.round((v - min) / g.step);
    return Math.min(max, Math.max(min, Number((min + steps * g.step).toFixed(6))));
  };
  return [along(x, g.xMin, g.xMax), along(y, g.yMin, g.yMax)];
}

/** dot draws a point on the figure in the figure's coordinates. */
function dot(g: PlotInput, [x, y]: Mark, kind: "marked" | "answer" | "cursor"): string {
  const [cx, cy] = [g.left + (x - g.xMin) * g.scale, g.top + (g.yMax - y) * g.scale];
  if (kind === "cursor") return `<circle cx="${cx}" cy="${cy}" r="7" fill="none" stroke-width="1.5" class="accent"/>`;
  const tone = kind === "answer" ? "result" : "accent";
  return `<circle cx="${cx}" cy="${cy}" r="4.5" stroke="none" fill="currentColor" class="${tone}"/>`;
}

/** PlotField asks for points marked on a figure: by pointer, or by the arrow keys and Space. The response is complete once all are marked. */
export function PlotField({
  input,
  figure,
  value,
  onChange,
  onSubmit,
  disabled,
  answer,
}: {
  input: PlotInput;
  figure?: Figure;
  value: string;
  onChange(v: string): void;
  onSubmit(): void;
  disabled: boolean;
  /** answer is the correct response, drawn after a wrong one. */
  answer?: string;
}) {
  const { m, tx } = useI18n();
  const area = useRef<HTMLButtonElement>(null);
  const [marks, setMarks] = useState<readonly Mark[]>(() => read(value));
  const [cursor, setCursor] = useState<Mark | undefined>();

  // The session clears its value for the next question.
  const last = useRef(value);
  useEffect(() => {
    if (value === "" && last.current !== "") setMarks([]);
    last.current = value;
  }, [value]);

  const update = (next: readonly Mark[]) => {
    setMarks(next);
    onChange(next.length === input.points ? write(next) : "");
  };

  /** toggle removes a marked point, or marks it, replacing the last point when all are marked. */
  const toggle = (p: Mark) => {
    if (disabled) return;
    const kept = marks.filter(([x, y]) => x !== p[0] || y !== p[1]);
    if (kept.length < marks.length) update(kept);
    else update([...(marks.length === input.points ? marks.slice(0, -1) : marks), p]);
  };

  const onClick = (e: MouseEvent) => {
    // A key press on the button arrives as a click at no position; onKeyDown has handled it.
    if (e.detail === 0) return;
    const svg = area.current?.querySelector("svg");
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const at = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const p = snap(input, input.xMin + (at.x - input.left) / input.scale, input.yMax - (at.y - input.top) / input.scale);
    setCursor(undefined);
    toggle(p);
  };

  const moves: Record<string, Mark> = {
    ArrowLeft: [-input.step, 0],
    ArrowRight: [input.step, 0],
    ArrowUp: [0, input.step],
    ArrowDown: [0, -input.step],
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    const move = moves[e.key];
    const from = cursor ?? snap(input, Math.max(input.xMin, Math.min(0, input.xMax)), Math.max(input.yMin, Math.min(0, input.yMax)));
    if (move) {
      e.preventDefault();
      setCursor(cursor ? snap(input, from[0] + move[0], from[1] + move[1]) : from);
    } else if (e.key === " ") {
      e.preventDefault();
      setCursor(from);
      toggle(from);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (marks.length === input.points) onSubmit();
    }
  };

  const drawn = [
    ...(answer ? read(answer).map((p) => dot(input, p, "answer")) : []),
    ...marks.map((p) => dot(input, p, "marked")),
    ...(cursor && !disabled ? [dot(input, cursor, "cursor")] : []),
  ].join("");
  const svg = (figure?.svg ?? "").replace(/<\/svg>\s*$/, `${drawn}</svg>`);

  return (
    <div className="space-y-2">
      <button
        ref={area}
        type="button"
        disabled={disabled}
        aria-label={tx(figure?.alt)}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={`figure-ga w-full rounded-xl border-2 border-line p-2 outline-none focus-visible:border-accent ${disabled ? "cursor-default" : "cursor-crosshair"}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: authored SVG limited to drawing elements by the compiler, and points computed here
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="flex min-h-9 flex-wrap items-center gap-3 text-sm" aria-live="polite">
        <span className="text-muted">
          {m.plotMarked}: {marks.length} / {input.points}
        </span>
        {marks.length > 0 && <Tex tex={write(marks).replaceAll(";", ";\\;")} />}
        {!disabled && marks.length > 0 && (
          <Button variant="secondary" onClick={() => update([])} className="ml-auto">
            {m.plotClear}
          </Button>
        )}
      </div>
      {!disabled && <p className="text-xs text-muted">{m.plotHint}</p>}
    </div>
  );
}
