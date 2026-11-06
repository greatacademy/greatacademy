import { useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { Button, ErrorNote } from "./ui.tsx";

/** GoalValues are a week's goals as they are edited. */
export interface GoalValues {
  readonly weekdays: readonly number[];
  readonly paused: boolean;
}

const suggested = [30, 30, 30, 30, 30, 0, 0];

/** GoalsEditor edits the XP goal of each weekday; an empty list starts from a suggestion. */
export function GoalsEditor({ initial, onSave }: { initial: GoalValues; onSave: (goals: GoalValues) => Promise<unknown> }) {
  const { m } = useI18n();
  const [days, setDays] = useState<number[]>(initial.weekdays.length === 7 ? [...initial.weekdays] : suggested);
  const [paused, setPaused] = useState(initial.paused);
  const [state, setState] = useState<"idle" | "busy" | "saved" | "failed">("idle");
  const total = days.reduce((a, b) => a + b, 0);

  async function save() {
    setState("busy");
    try {
      await onSave({ weekdays: days, paused });
      setState("saved");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1.5">
        {m.weekdays.map((name, i) => (
          <label key={name} className="space-y-1 text-center text-xs text-muted">
            <span>{name}</span>
            <input
              type="number"
              min={0}
              max={1000}
              step={5}
              value={days[i]}
              aria-label={name}
              onChange={(e) => {
                setState("idle");
                setDays(days.map((d, j) => (j === i ? Math.max(0, Math.min(1000, Math.floor(Number(e.target.value) || 0))) : d)));
              }}
              className="w-full rounded-lg border border-line bg-surface px-0.5 py-2 text-center text-sm text-ink outline-none focus:border-accent"
            />
          </label>
        ))}
      </div>
      <div className="text-sm text-muted">{m.goalsWeekTotal(total)}</div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={paused}
          onChange={(e) => {
            setState("idle");
            setPaused(e.target.checked);
          }}
        />
        {m.goalsPaused}
      </label>
      {state === "failed" && <ErrorNote message={m.error} />}
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={state === "busy"}>
          {m.save}
        </Button>
        {state === "saved" && <span className="text-sm text-good">{m.saved}</span>}
      </div>
    </div>
  );
}
