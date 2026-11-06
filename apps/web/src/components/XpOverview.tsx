import type { XpSummary } from "@ga/proto/learning/v1/learning_pb";

import { useI18n } from "../lib/i18n.tsx";
import { Bar } from "./ui.tsx";

function GoalBar({ label, value, goal, done }: { label: string; value: number; goal: number; done: string }) {
  const met = goal > 0 && value >= goal;
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 text-sm">
        <span>{label}</span>
        <span className={met ? "font-medium text-good" : "text-muted"}>
          {value} / {goal} XP{met ? ` · ${done}` : ""}
        </span>
      </div>
      <Bar value={goal > 0 ? value / goal : 0} className={met ? "bg-good" : "bg-accent"} />
    </div>
  );
}

/** XpOverview shows today and this week against the goals, and the XP of the last 14 days. */
export function XpOverview({ xp }: { xp: XpSummary }) {
  const { m, locale } = useI18n();
  const maxDay = Math.max(1, ...xp.days);
  const today = new Date();
  const dayLabel = (i: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (xp.days.length - 1 - i));
    return date.toLocaleDateString(locale, { month: "numeric", day: "numeric" });
  };
  return (
    <>
      {xp.goalWeek > 0 ? (
        <div className="space-y-3">
          <GoalBar label={m.goalToday} value={xp.today} goal={xp.goalToday} done={m.goalDone} />
          <GoalBar label={m.goalWeek} value={xp.week} goal={xp.goalWeek} done={m.goalDone} />
        </div>
      ) : (
        <p className="text-sm text-muted">{m.goalNone}</p>
      )}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted">
          <span>{m.last14}</span>
          <span>
            {m.total} {xp.total} XP
          </span>
        </div>
        <div className="flex h-12 items-end gap-1" role="img" aria-label={m.last14}>
          {xp.days.map((v, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed 14-day window
              key={i}
              title={`${dayLabel(i)}: ${v} XP`}
              className={`flex-1 rounded-sm ${v < 0 ? "bg-bad" : i === xp.days.length - 1 ? "bg-accent" : "bg-accent/35"}`}
              style={{ height: `${Math.max(4, (Math.abs(v) / maxDay) * 100)}%` }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
