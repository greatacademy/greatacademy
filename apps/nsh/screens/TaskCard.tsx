import type { Task } from "@ga/proto/learning/v1/learning_pb";

import { m, tx } from "../lib/i18n.ts";
import { Action, Card, Muted, Quiet } from "../lib/ui.tsx";
import { Rich } from "./Rich.tsx";

/** describeTask is what a task card says about a task, or nothing for a task the app does not know. */
export function describeTask(task: Task): { label: string; title: string; detail: string; xp: number } | undefined {
  const k = task.kind;
  switch (k.case) {
    case "diagnostic":
      return { label: m().diagnostic, title: m().diagnostic, detail: m().diagnosticBody(k.value.maxQuestions), xp: 0 };
    case "lesson":
      return { label: m().lesson, title: tx(k.value.title), detail: m().kps(k.value.knowledgePoints), xp: k.value.xp };
    case "review": {
      const others = k.value.covers.filter((c) => c !== k.value.topicId).length;
      return { label: m().review, title: tx(k.value.title), detail: others > 0 ? m().reviewCovers(others) : "", xp: k.value.xp };
    }
    case "reading":
      return { label: m().reading, title: tx(k.value.title), detail: m().readingBody(k.value.words, k.value.questions), xp: k.value.xp };
    case "quiz":
      return { label: m().quiz, title: m().quiz, detail: m().quizBody(k.value.questions), xp: k.value.xp };
    default:
      return undefined;
  }
}

/** TaskCard offers a task: what it is, its XP, and a button to start it (and, for the diagnostic, to skip it). */
export function TaskCard(props: { task: Task; action: string; busy?: boolean; onStart: () => void; extra?: () => void }) {
  const about = describeTask(props.task);
  if (!about) return null;
  return (
    <Card>
      <Muted>{about.xp > 0 ? `${about.label} · ${about.xp} XP` : about.label}</Muted>
      <Rich source={about.title} inline bold fontSize={17} />
      <If when={about.detail}>
        <Muted>{about.detail}</Muted>
      </If>
      <Action label={props.action} disabled={props.busy} onPress={props.onStart} />
      <If when={props.extra}>
        <Quiet label={m().skipDiagnostic} disabled={props.busy} onPress={() => props.extra?.()} />
      </If>
    </Card>
  );
}
