import type { StrokesInput } from "@ga/proto/learning/v1/learning_pb";
import { type PointerEvent, useEffect, useRef, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { Button } from "./ui.tsx";

/** BOX is the side of the pad in the units of the response. */
const BOX = 1024;

/** MOST_POINTS is how many points of a stroke a response keeps. */
const MOST_POINTS = 48;

type Point = readonly [number, number];
type Stroke = readonly Point[];

/** thin keeps at most MOST_POINTS points of a path, evenly along it, always its first and last. */
function thin(stroke: Stroke): Stroke {
  if (stroke.length <= MOST_POINTS) return stroke;
  return Array.from({ length: MOST_POINTS }, (_, i) => stroke[Math.round((i * (stroke.length - 1)) / (MOST_POINTS - 1))]!);
}

/** writeStrokes is the response for strokes: points as "x,y" joined by spaces, strokes joined by ";". */
const writeStrokes = (strokes: readonly Stroke[]) =>
  strokes.map((s) => s.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(" ")).join(";");

/** readStrokes gives the strokes of a response. */
export function readStrokes(response: string): readonly Stroke[] {
  return response
    .split(";")
    .map((s) =>
      s
        .trim()
        .split(/\s+/)
        .map((p) => p.split(",").map(Number) as unknown as Point)
        .filter((p) => p.length === 2 && p.every(Number.isFinite)),
    )
    .filter((s) => s.length > 0);
}

/** path draws a stroke as an SVG path; a stroke of one point is a dot. */
const path = (s: Stroke) => (s.length === 1 ? `M${s[0]![0]} ${s[0]![1]}h0.1` : `M${s.map(([x, y]) => `${x} ${y}`).join("L")}`);

/** Guide draws the lines of a 田 grid that help place a character in its square. */
function Guide() {
  return (
    <g className="stroke-line" strokeWidth={4} strokeDasharray="16 16" fill="none">
      <line x1={0} y1={BOX / 2} x2={BOX} y2={BOX / 2} />
      <line x1={BOX / 2} y1={0} x2={BOX / 2} y2={BOX} />
    </g>
  );
}

/** StrokesDrawing shows strokes in a small square, as an answer is shown. */
export function StrokesDrawing({ response, className = "" }: { response: string; className?: string }) {
  return (
    <svg viewBox={`0 0 ${BOX} ${BOX}`} className={`inline-block size-24 rounded-lg border border-line bg-surface ${className}`} aria-hidden>
      <Guide />
      <g fill="none" stroke="currentColor" strokeWidth={48} strokeLinecap="round" strokeLinejoin="round">
        {readStrokes(response).map((s, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: strokes are positional
          <path key={i} d={path(s)} />
        ))}
      </g>
    </svg>
  );
}

/**
 * StrokesField asks for a character written by hand on a square pad, by finger, pen or mouse. The response is complete
 * once as many strokes are drawn as the character has; a stroke can be undone.
 */
export function StrokesField({
  input,
  value,
  onChange,
  disabled,
  answer,
}: {
  input: StrokesInput;
  value: string;
  onChange(v: string): void;
  disabled: boolean;
  /** answer is the correct response, drawn beside the pad after a wrong one. */
  answer?: string;
}) {
  const { m } = useI18n();
  const pad = useRef<SVGSVGElement>(null);
  const [strokes, setStrokes] = useState<readonly Stroke[]>(() => readStrokes(value));
  const [drawing, setDrawing] = useState<Stroke | undefined>();

  // The session clears its value for the next question.
  const last = useRef(value);
  useEffect(() => {
    if (value === "" && last.current !== "") setStrokes([]);
    last.current = value;
  }, [value]);

  const update = (next: readonly Stroke[]) => {
    setStrokes(next);
    onChange(next.length === input.strokes ? writeStrokes(next) : "");
  };

  const at = (e: PointerEvent): Point | undefined => {
    const ctm = pad.current?.getScreenCTM();
    if (!ctm) return undefined;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return [Math.min(BOX, Math.max(0, p.x)), Math.min(BOX, Math.max(0, p.y))];
  };

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (disabled || strokes.length >= input.strokes) return;
    const p = at(e);
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrawing([p]);
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!drawing) return;
    const p = at(e);
    const prev = drawing.at(-1)!;
    if (p && Math.hypot(p[0] - prev[0], p[1] - prev[1]) >= 6) setDrawing([...drawing, p]);
  };
  const onPointerUp = () => {
    if (!drawing) return;
    setDrawing(undefined);
    update([...strokes, thin(drawing)]);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-start gap-4">
        <svg
          ref={pad}
          viewBox={`0 0 ${BOX} ${BOX}`}
          role="img"
          aria-label={m.strokesPad}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`aspect-square w-full max-w-80 touch-none select-none rounded-xl border-2 border-line bg-surface ${disabled ? "cursor-default" : "cursor-crosshair"}`}
        >
          <Guide />
          {input.trace && (
            <text
              x={BOX / 2}
              y={BOX / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={BOX * 0.86}
              className="fill-line"
              style={{ fontFamily: '"KaiTi", "STKaiti", "Kaiti SC", serif' }}
            >
              {input.trace}
            </text>
          )}
          <g fill="none" stroke="currentColor" strokeWidth={44} strokeLinecap="round" strokeLinejoin="round">
            {[...strokes, ...(drawing ? [drawing] : [])].map((s, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: strokes are positional
              <path key={i} d={path(s)} />
            ))}
          </g>
        </svg>
        {answer && <StrokesDrawing response={answer} className="text-good" />}
      </div>
      <div className="flex min-h-9 flex-wrap items-center gap-3 text-sm" aria-live="polite">
        <span className="text-muted">
          {m.strokesDrawn}: {strokes.length} / {input.strokes}
        </span>
        {!disabled && strokes.length > 0 && (
          <>
            <Button variant="secondary" onClick={() => update(strokes.slice(0, -1))} className="ml-auto">
              {m.strokesUndo}
            </Button>
            <Button variant="secondary" onClick={() => update([])}>
              {m.plotClear}
            </Button>
          </>
        )}
      </div>
      {!disabled && <p className="text-xs text-muted">{m.strokesHint}</p>}
    </div>
  );
}
