import type { GetDashboardResponse } from "@ga/proto/learning/v1/learning_pb";
import { ArrowCounterClockwise, CalendarCheck, Flag } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { learning } from "../lib/rpc.ts";
import { Forecast } from "./Forecast.tsx";
import { GoalsEditor } from "./GoalsEditor.tsx";
import { Button, Card, ErrorNote } from "./ui.tsx";
import { XpOverview } from "./XpOverview.tsx";

const DAY = 86_400_000;

/** DecidedBy says that a learner's supervisor makes a decision, in place of its control (docs/experience.md §5). */
export function DecidedBy() {
  const { m } = useI18n();
  return <p className="text-sm text-muted">{m.guardianDecides}</p>;
}

/** GoalsCard shows a subject's XP against its weekly goals, and lets the supervisor change the goals. */
export function GoalsCard({ d, learnerId }: { d: GetDashboardResponse; learnerId?: string }) {
  const { m } = useI18n();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between gap-2 text-sm text-muted">
        <span className="flex items-center gap-2">
          <Flag size={18} /> {m.goals}
        </span>
        {d.canDecide && !editing && (
          <button type="button" className="text-accent" onClick={() => setEditing(true)}>
            {m.setGoals}
          </button>
        )}
      </div>
      {d.xp && <XpOverview xp={d.xp} />}
      {editing ? (
        <div className="space-y-2 border-t border-line pt-4">
          <p className="text-sm text-muted">{m.goalsBody}</p>
          <GoalsEditor
            initial={{ weekdays: d.goals?.weekdays ?? [], paused: d.goals?.paused ?? false }}
            onSave={async (goals) => {
              await learning.setGoals({
                subjectId: d.subjectId,
                learnerId: learnerId ?? "",
                goals: { weekdays: [...goals.weekdays], paused: goals.paused },
              });
              await qc.invalidateQueries();
            }}
          />
          <Button variant="ghost" className="-ml-4" onClick={() => setEditing(false)}>
            {m.close}
          </Button>
        </div>
      ) : (
        !d.canDecide && <DecidedBy />
      )}
    </Card>
  );
}

/** daysUntil counts the days from today to a "YYYY-MM-DD" date in the browser's time zone, at least 1. */
function daysUntil(date: string, now: number): number {
  const [y, mo, day] = date.split("-").map(Number);
  const end = new Date(y ?? 1970, (mo ?? 1) - 1, day ?? 1).getTime();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.max(1, Math.round((end - today.getTime()) / DAY));
}

/** ForecastCard shows when the course may be finished, and against the end date the supervisor set, what it takes. */
export function ForecastCard({ d, learnerId }: { d: GetDashboardResponse; learnerId?: string }) {
  const { m, locale } = useI18n();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(d.endDate);
  const [failed, setFailed] = useState(false);
  const needed = d.endDate ? Math.ceil(d.remainingXp / daysUntil(d.endDate, Date.now())) : 0;
  const ends = d.endDate ? new Date(`${d.endDate}T00:00`).toLocaleDateString(locale, { dateStyle: "medium" }) : "";
  const save = async (endDate: string) => {
    setFailed(false);
    try {
      await learning.setEndDate({ subjectId: d.subjectId, endDate, learnerId: learnerId ?? "" });
      await qc.invalidateQueries();
      setEditing(false);
    } catch {
      setFailed(true);
    }
  };
  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-center justify-between gap-2 text-sm text-muted">
        <span className="flex items-center gap-2">
          <CalendarCheck size={18} /> {m.forecast}
        </span>
        {d.canDecide && !editing && !d.finished && (
          <button type="button" className="text-accent" onClick={() => setEditing(true)}>
            {d.endDate ? m.endDateChange : m.endDateSet}
          </button>
        )}
      </div>
      {d.finished ? (
        <p className="text-sm text-good">{m.forecastDone}</p>
      ) : (
        <>
          {d.endDate && (
            <div className="space-y-1 rounded-xl bg-subject-soft p-3 text-sm text-on-subject-soft">
              <div className="font-medium">{m.endDateIs(ends)}</div>
              <div>{d.pace >= needed ? m.endDateOnPace(needed) : m.endDateBehind(needed)}</div>
            </div>
          )}
          <Forecast remaining={d.remainingXp} pace={d.pace} goalPace={(d.xp?.goalWeek ?? 0) / 7} guardian={!!learnerId} />
        </>
      )}
      {editing && (
        <form
          className="space-y-2 border-t border-line pt-3"
          onSubmit={(e) => {
            e.preventDefault();
            void save(value);
          }}
        >
          <label className="block space-y-1 text-sm">
            <span className="text-muted">{m.endDateBody}</span>
            <input
              type="date"
              value={value}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={(e) => setValue(e.target.value)}
              className="block rounded-lg border border-line bg-surface px-3 py-2"
            />
          </label>
          {failed && <ErrorNote message={m.error} />}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!value}>
              {m.save}
            </Button>
            {d.endDate && (
              <Button type="button" variant="ghost" onClick={() => void save("")}>
                {m.endDateClear}
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
              {m.cancel}
            </Button>
          </div>
        </form>
      )}
      {!d.canDecide && !d.finished && <DecidedBy />}
    </Card>
  );
}

/**
 * StartOverCard lets the supervisor start a subject over (docs/experience.md §3): retake the course's diagnostic,
 * which asks again what it placed, or reset the subject's knowledge profile, which forgets every topic. Each asks
 * first; XP and history stay either way.
 */
export function StartOverCard({ d, learnerId }: { d: GetDashboardResponse; learnerId?: string }) {
  const { m } = useI18n();
  const qc = useQueryClient();
  const [asked, setAsked] = useState<"retake" | "reset">();
  const run = useMutation({
    mutationFn: async (what: "retake" | "reset") => {
      if (what === "retake") await learning.retakeDiagnostic({ courseId: d.courseId, learnerId: learnerId ?? "" });
      else await learning.resetKnowledge({ subjectId: d.subjectId, learnerId: learnerId ?? "" });
    },
    onSuccess: async () => {
      setAsked(undefined);
      await qc.invalidateQueries();
    },
  });
  if (!d.canDecide) return null;
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-2 text-sm text-muted">
        <ArrowCounterClockwise size={18} /> {m.startOver}
      </div>
      {run.isError && <ErrorNote message={m.error} />}
      {asked ? (
        <div className="space-y-3">
          <h3 className="font-semibold">{asked === "retake" ? m.retakeConfirmTitle : m.resetConfirmTitle}</h3>
          <p className="text-sm text-muted">{asked === "retake" ? m.retakeConfirmBody : m.resetConfirmBody}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => run.mutate(asked)} disabled={run.isPending}>
              {asked === "retake" ? m.retakeDiagnostic : m.resetKnowledge}
            </Button>
            <Button variant="ghost" onClick={() => setAsked(undefined)}>
              {m.cancel}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {d.diagnosed && (
            <div className="space-y-2">
              <p className="text-sm text-muted">{m.retakeBody}</p>
              <Button variant="secondary" onClick={() => setAsked("retake")}>
                {m.retakeDiagnostic}
              </Button>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm text-muted">{m.resetBody}</p>
            <Button variant="secondary" onClick={() => setAsked("reset")}>
              {m.resetKnowledge}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
