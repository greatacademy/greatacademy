import { type Mark, type Step, type StepGroup, type StepTarget, sameTarget } from "@ga/design";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import { useI18n } from "../lib/i18n.tsx";

const tone: Record<Mark, string> = {
  right: "bg-good",
  wrong: "bg-bad",
  done: "bg-accent/55",
  current: "bg-accent",
  future: "bg-line",
};

/**
 * StepsBar is a session's steps as a row of segments, a group per knowledge point in a lesson: each step gone through
 * opens to look back at, the step looked at is ringed, and the arrows move one step back or on.
 */
export function StepsBar({
  groups,
  looking,
  onOpen,
  onPrevious,
  onNext,
}: {
  groups: readonly StepGroup[];
  /** looking is the step shown now. */
  looking: StepTarget;
  onOpen(target: StepTarget): void;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const { m } = useI18n();
  const arrow = "flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-line/50 disabled:opacity-30";
  let question = 0;
  const label = (step: Step) => {
    if (step.kind === "intro") return m.stepIntro;
    if (step.kind === "example") return m.workedExample;
    question += 1;
    return m.stepQuestion(question);
  };
  return (
    <nav aria-label={m.stepsBar} className="flex items-center gap-1">
      <button type="button" className={arrow} onClick={onPrevious} disabled={!onPrevious} aria-label={m.previousStep}>
        <CaretLeft size={18} weight="bold" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {groups.map((g, gi) => (
          <fieldset
            // biome-ignore lint/suspicious/noArrayIndexKey: groups are positional
            key={gi}
            aria-label={g.knowledgePoint !== undefined ? m.step(g.knowledgePoint + 1, groups.length) : undefined}
            className="m-0 flex min-w-0 flex-1 items-center gap-1 border-0 p-0"
            style={{ flexGrow: g.steps.length }}
          >
            {g.steps.map((step, si) => {
              const name = label(step);
              const open = step.target;
              const ringed = open && sameTarget(open, looking);
              const now = step.marks.includes("current");
              return (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: steps are positional
                  key={si}
                  type="button"
                  disabled={!open}
                  onClick={() => open && onOpen(open)}
                  title={open ? name : `${name} · ${m.stepFuture}`}
                  aria-label={open ? name : `${name} · ${m.stepFuture}`}
                  aria-current={ringed ? "step" : undefined}
                  className={`group flex h-6 min-w-2 flex-1 items-center rounded-full ${open ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span
                    className={`flex h-2.5 w-full gap-px overflow-hidden rounded-full transition-[height] ${open ? "group-hover:h-3.5" : ""} ${
                      ringed ? "h-3.5 ring-2 ring-ink/70 ring-offset-2 ring-offset-page" : now ? "h-3.5" : ""
                    } ${step.kind === "question" ? "" : "opacity-80"}`}
                  >
                    {step.marks.map((mark, k) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: parts are positional
                      <span key={k} className={`h-full flex-1 ${tone[mark]}`} />
                    ))}
                  </span>
                </button>
              );
            })}
          </fieldset>
        ))}
      </div>
      <button type="button" className={arrow} onClick={onNext} disabled={!onNext} aria-label={m.nextStep}>
        <CaretRight size={18} weight="bold" />
      </button>
    </nav>
  );
}
