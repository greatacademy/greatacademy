import type { Feedback, Question, Session } from "@ga/proto/learning/v1/learning_pb";
import { cleanup, effect, Storage, signal, Text, View } from "nsh";
import { Input } from "nsh/base";

import { errorText, m, tx } from "../lib/i18n.ts";
import { learning } from "../lib/rpc.ts";
import { Action, Card, colors, ErrorNote, fieldStyle, Muted, Quiet } from "../lib/ui.tsx";
import { Rich } from "./Rich.tsx";

/** POLL_MS is how often the app asks whether a text has been judged, as the web app does. */
const POLL_MS = 2_000;

/** countWords counts words as the server does: runs without spaces holding a letter or a digit. */
export function countWords(text: string): number {
  return text.split(/\s+/u).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/** JudgedFeedback lists a judge's verdict: the criteria met, with the words quoted, those missed, and at most two points to work on. */
export function JudgedFeedback(props: { feedback: Feedback }) {
  const met = props.feedback.criteria.filter((c) => c.met);
  const missed = props.feedback.criteria.filter((c) => !c.met);
  const line = (mark: string, color: string, note: string, quotation: string) => (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Text style={{ color, fontWeight: "700" }}>{mark}</Text>
      <Text style={{ color: colors().ink, flex: 1, fontSize: 15 }}>{quotation ? `${note} — “${quotation}”` : note}</Text>
    </View>
  );
  return (
    <View style={{ gap: 10 }}>
      <If when={met.length > 0}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: colors().good, fontSize: 14, fontWeight: "600" }}>{m().criteriaMet}</Text>
          <Each of={met}>{(c) => line("✓", colors().good, c().note, c().quotation)}</Each>
        </View>
      </If>
      <If when={missed.length > 0}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: colors().bad, fontSize: 14, fontWeight: "600" }}>{m().criteriaMissed}</Text>
          <Each of={missed}>{(c) => line("○", colors().bad, c().note, "")}</Each>
        </View>
      </If>
      <If when={props.feedback.points.length > 0}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "600" }}>{m().nextSteps}</Text>
          <Each of={props.feedback.points}>{(p, i) => line(`${i() + 1}.`, colors().muted, p().point, p().quotation)}</Each>
        </View>
      </If>
    </View>
  );
}

/**
 * WritingFlow is the player of a question judged by a model: a long text field
 * whose draft is kept on the device, a wait while the text is judged, and a
 * rewrite when the feedback sends it back. A verdict that counts goes to
 * onAnswered, like any other answer; a judgment that failed for good lets the
 * learner skip with no result.
 */
export function WritingFlow(props: {
  session: Session;
  question: Question;
  onAnswered: (feedback: Feedback | undefined, next: Session, response: string) => void;
}) {
  const { session, question } = props;
  const input = question.problem?.input?.kind;
  const limits = input?.case === "writing" ? input.value : { minWords: 1, maxChars: 2000 };
  const key = `ga.draft.${session.id}.${question.index}`;
  const text = signal(question.judging?.response ?? "");
  const sent = signal(question.judging?.response ?? "");
  const waiting = signal(!!question.judging);
  const judging = signal(question.judging);
  const revise = signal<Feedback | undefined>(undefined);
  const busy = signal(false);
  const error = signal("");
  if (!question.judging)
    void Storage.getItem(key).then((draft) => {
      if (draft && !text()) text.set(draft);
    });
  effect(() => {
    const draft = text();
    void (draft ? Storage.setItem(key, draft) : Storage.removeItem(key));
  });

  let timer: ReturnType<typeof setTimeout> | undefined;
  let gone = false;
  cleanup(() => {
    gone = true;
    clearTimeout(timer);
  });
  const finish = (feedback: Feedback | undefined, next: Session, response: string) => {
    void Storage.removeItem(key);
    props.onAnswered(feedback, next, response);
  };
  const judgingOf = (next: Session) => (next.step.case === "question" ? next.step.value.judging : undefined);
  const poll = async () => {
    if (gone || !waiting()) return;
    try {
      const res = await learning.getJudgment({ sessionId: session.id, index: question.index });
      if (gone || !waiting() || !res.session) return;
      if (res.pending) {
        judging.set(judgingOf(res.session));
        timer = setTimeout(() => void poll(), POLL_MS);
        return;
      }
      waiting.set(false);
      if (res.feedback?.revise) revise.set(res.feedback);
      else finish(res.feedback, res.session, sent());
    } catch (e) {
      error.set(errorText(e));
      timer = setTimeout(() => void poll(), POLL_MS * 2);
    }
  };
  if (waiting()) timer = setTimeout(() => void poll(), 0);

  const submit = async (skip: boolean) => {
    if (busy()) return;
    busy.set(true);
    error.set("");
    try {
      const response = skip ? "" : text();
      const res = await learning.submitAnswer({ sessionId: session.id, index: question.index, response, skip });
      const next = res.session;
      if (!next) return;
      if (res.pending) {
        sent.set(response);
        revise.set(undefined);
        judging.set(judgingOf(next));
        waiting.set(true);
        clearTimeout(timer);
        timer = setTimeout(() => void poll(), POLL_MS);
      } else if (skip || next.step.case !== "question" || next.step.value.index !== question.index) finish(res.feedback, next, response);
      else revise.set(res.feedback);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };

  const words = () => countWords(text());
  const canSend = () => words() >= limits.minWords && text().length <= limits.maxChars && !busy();
  return (
    <View style={{ gap: 16 }}>
      <If when={revise()}>
        {(feedback) => (
          <View
            style={{
              backgroundColor: colors()["warn-soft"],
              borderColor: colors().warn,
              borderRadius: 12,
              borderWidth: 1,
              gap: 10,
              padding: 16,
            }}
          >
            <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "700" }}>{m().reviseTitle}</Text>
            <If when={feedback().message}>{(message) => <Rich source={tx(message())} />}</If>
            <If when={feedback().criteria.length > 0}>
              <Text style={{ color: colors().muted, fontSize: 15 }}>{sent()}</Text>
              <JudgedFeedback feedback={feedback()} />
            </If>
          </View>
        )}
      </If>
      <If
        when={waiting()}
        else={
          <Card>
            <Input
              accessibilityLabel={m().yourAnswer}
              value={text()}
              multiline
              maxLength={limits.maxChars}
              autoCapitalize="sentences"
              disabled={busy()}
              onChange={({ value }) => text.set(value)}
              style={{ ...fieldStyle(), minHeight: 180, textAlignVertical: "top" }}
            />
            <Text style={{ color: words() >= limits.minWords ? colors().muted : colors().warn, fontSize: 14 }}>
              {m().writingWords(words(), limits.minWords)}
            </Text>
            <Action label={revise() ? m().rewrite : m().sendWriting} disabled={!canSend()} onPress={() => void submit(false)} />
          </Card>
        }
      >
        <Card>
          <Text style={{ color: colors().ink, fontSize: 16, lineHeight: 24 }}>{sent() || text()}</Text>
          <If
            when={judging()?.failed}
            else={
              <View style={{ gap: 10 }}>
                <Muted>{m().judging}</Muted>
                <If when={judging()?.delayed}>
                  <Muted>{m().judgingDelayed}</Muted>
                  <Quiet label={m().rewrite} onPress={() => waiting.set(false)} />
                </If>
              </View>
            }
          >
            <Muted>{m().judgingFailed}</Muted>
            <Quiet label={m().skipQuestion} disabled={busy()} onPress={() => void submit(true)} />
          </If>
        </Card>
      </If>
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
    </View>
  );
}
