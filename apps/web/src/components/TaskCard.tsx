import type { Task } from "@ga/proto/learning/v1/learning_pb";
import { ArrowsClockwise, BookOpen, Compass, Exam } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { Markdown } from "./Markdown.tsx";
import { Button } from "./ui.tsx";

const tone = {
  diagnostic: "bg-accent-soft text-accent",
  lesson: "bg-accent-soft text-accent",
  review: "bg-warn-soft text-warn",
  quiz: "bg-good-soft text-good",
} as const;

/** TaskCard shows a task offered on the dashboard. */
export function TaskCard({
  task,
  primary,
  action,
  onStart,
  busy,
  extra,
}: {
  task: Task;
  primary?: boolean;
  action: string;
  onStart(): void;
  busy?: boolean;
  extra?: ReactNode;
}) {
  const { m, tx } = useI18n();
  const k = task.kind;
  if (!k.case) return null;
  let icon: ReactNode;
  let label: string;
  let title: ReactNode;
  let detail: string;
  let xp = 0;
  switch (k.case) {
    case "diagnostic":
      icon = <Compass size={22} weight="duotone" />;
      label = m.diagnostic;
      title = m.diagnostic;
      detail = m.diagnosticBody(k.value.maxQuestions);
      break;
    case "lesson":
      icon = <BookOpen size={22} weight="duotone" />;
      label = m.lesson;
      title = <Markdown source={tx(k.value.title)} inline />;
      detail = m.kps(k.value.knowledgePoints);
      xp = k.value.xp;
      break;
    case "review":
      icon = <ArrowsClockwise size={22} weight="duotone" />;
      label = m.review;
      title = <Markdown source={tx(k.value.title)} inline />;
      detail =
        k.value.covers.filter((c) => c !== k.value.topicId).length > 0
          ? m.reviewCovers(k.value.covers.filter((c) => c !== k.value.topicId).length)
          : "";
      xp = k.value.xp;
      break;
    case "quiz":
      icon = <Exam size={22} weight="duotone" />;
      label = m.quiz;
      title = m.quiz;
      detail = m.quizBody(k.value.questions);
      xp = k.value.xp;
      break;
  }
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border bg-surface p-5 sm:flex-row sm:items-center ${primary ? "border-accent/40 shadow-md shadow-accent/5" : "border-line"}`}
    >
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone[k.case]}`}>{icon}</div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-xs font-medium tracking-wide text-muted uppercase">
          {label}
          {xp > 0 && <span className="ml-2 text-accent">{xp} XP</span>}
        </div>
        <div className="font-semibold">{title}</div>
        {detail && <p className="text-sm text-muted">{detail}</p>}
        {extra}
      </div>
      <Button variant={primary ? "primary" : "secondary"} onClick={onStart} disabled={busy} className="shrink-0">
        {action}
      </Button>
    </div>
  );
}
