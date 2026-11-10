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

/** fromCourse names the earlier course a foundation task comes from, as Math Academy labels such tasks. */
export function fromCourse(task: Task): string {
  const k = task.kind;
  return k.case === "lesson" || k.case === "review" ? tx(k.value.fromCourse) : "";
}

/** TaskCard offers a task: what it is, its course if a foundation, its XP, and a button to start it (and, for the diagnostic, to skip it). */
export function TaskCard(props: { task: Task; action: string; busy?: boolean; onStart: () => void; extra?: () => void }) {
  // The card follows its task: a page that keeps the card, as the Learn tab does across subjects, gives it another.
  const about = () => describeTask(props.task);
  return (
    <If when={about()}>
      {(a) => (
        <Card>
          <Muted>{[a().label, fromCourse(props.task), a().xp > 0 ? `${a().xp} XP` : ""].filter(Boolean).join(" · ")}</Muted>
          <Rich source={a().title} inline bold fontSize={17} />
          <If when={a().detail}>
            <Muted>{a().detail}</Muted>
          </If>
          <Action label={props.action} disabled={props.busy} onPress={props.onStart} />
          <If when={props.extra}>
            <Quiet label={m().skipDiagnostic} disabled={props.busy} onPress={() => props.extra?.()} />
          </If>
        </Card>
      )}
    </If>
  );
}
