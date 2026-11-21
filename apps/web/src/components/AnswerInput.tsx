import type { Feedback, ProblemView } from "@ga/proto/learning/v1/learning_pb";
import { useEffect } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { FigureView } from "./Figure.tsx";
import { Markdown, Tex } from "./Markdown.tsx";
import { MathField } from "./MathField.tsx";
import { OrderField } from "./OrderField.tsx";
import { PlotField } from "./PlotField.tsx";
import { StrokesField } from "./StrokesField.tsx";

/** AnswerInput is the field a problem is answered in, by its kind of input; with feedback it marks the right choice. */
export function AnswerInput({
  problem,
  value,
  onChange,
  onSubmit,
  disabled,
  feedback,
}: {
  problem?: ProblemView;
  value: string;
  onChange(v: string): void;
  onSubmit(): void;
  disabled: boolean;
  feedback?: Feedback;
}) {
  const { m, tx } = useI18n();
  const input = problem?.input?.kind;
  const options = input?.case === "choice" ? input.value.options.length : 0;

  // Choices are keyboard-friendly too: A, B, C… or 1, 2, 3… select, Enter checks.
  useEffect(() => {
    if (options === 0 || disabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const i = /^[1-9]$/.test(k) ? Number(k) - 1 : /^[a-z]$/.test(k) ? k.charCodeAt(0) - 97 : -1;
      if (i >= 0 && i < options) onChange(String(i));
      else if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options, disabled, onChange, onSubmit]);

  switch (input?.case) {
    case "choice":
      return (
        <div className="space-y-2">
          <div role="radiogroup" className={`grid gap-2 ${input.value.figures.length > 0 ? "sm:grid-cols-2" : ""}`}>
            {input.value.options.map((o, i) => {
              const selected = value === String(i);
              const verdict =
                feedback && selected ? (feedback.correct ? "good" : "bad") : feedback && feedback.answer === String(i) ? "good" : undefined;
              const tone =
                verdict === "good"
                  ? "border-good bg-good-soft"
                  : verdict === "bad"
                    ? "border-bad bg-bad-soft"
                    : selected
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:border-accent/50";
              return (
                // biome-ignore lint/a11y/useSemanticElements: a styled option card with radio semantics; the keyboard handler above selects
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: options are positional
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={disabled}
                  onClick={() => onChange(String(i))}
                  onDoubleClick={() => {
                    onChange(String(i));
                    onSubmit();
                  }}
                  className={`flex gap-3 rounded-xl border-2 px-4 py-3 text-left transition disabled:cursor-default ${input.value.figures[i] ? "items-start" : "items-center"} ${tone}`}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sm font-medium">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {input.value.figures[i] ? (
                    <FigureView figure={input.value.figures[i]} className="min-w-0 flex-1" />
                  ) : (
                    <Markdown source={tx(o)} inline />
                  )}
                </button>
              );
            })}
          </div>
          {!disabled && <p className="text-xs text-muted">{m.choiceHint}</p>}
        </div>
      );
    case "order":
      return (
        <OrderField key={tx(problem?.prompt)} items={input.value.items.map((item) => tx(item))} onChange={onChange} disabled={disabled} />
      );
    case "plot":
      return (
        <PlotField
          key={tx(problem?.prompt)}
          input={input.value}
          figure={problem?.figure}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          disabled={disabled}
          answer={feedback && !feedback.correct ? feedback.answer : undefined}
        />
      );
    case "strokes":
      return (
        <StrokesField
          key={tx(problem?.prompt)}
          input={input.value}
          value={value}
          onChange={onChange}
          disabled={disabled}
          answer={feedback && !feedback.correct ? feedback.answer : undefined}
        />
      );
    case "math":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {input.value.prefix && <Tex tex={input.value.prefix} className="shrink-0 text-xl" />}
            <div className="flex-1">
              <MathField value={value} onChange={onChange} onSubmit={onSubmit} disabled={disabled} label={m.yourAnswer} />
            </div>
            {input.value.suffix && <Tex tex={input.value.suffix} className="shrink-0 text-xl" />}
          </div>
          {!disabled && <p className="text-xs text-muted">{m.mathHint}</p>}
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          <input
            aria-label={m.yourAnswer}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
          {input?.case === "text" && input.value.hint && !disabled && <p className="text-xs text-muted">{tx(input.value.hint)}</p>}
        </div>
      );
  }
}
