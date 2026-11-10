import type { Feedback, Question, Session } from "@ga/proto/learning/v1/learning_pb";
import { CheckCircle, Circle, PencilSimple } from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { learning } from "../lib/rpc.ts";
import { Markdown } from "./Markdown.tsx";
import { Button, Card, ErrorNote, Spinner } from "./ui.tsx";

/** countWords counts words as the server does: runs without spaces holding a letter or a digit. */
export function countWords(text: string): number {
  return text.split(/\s+/u).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

const draftKey = (session: Session, question: Question) => `draft:${session.id}:${question.index}`;

function loadDraft(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function saveDraft(key: string, text: string): void {
  try {
    if (text) localStorage.setItem(key, text);
    else localStorage.removeItem(key);
  } catch {
    // A draft is a convenience; without storage the text lives only in the page.
  }
}

/** Marked shows a learner's text with the words a judge quoted highlighted. */
export function Marked({ text, quotations }: { text: string; quotations: readonly string[] }) {
  const lower = text.toLowerCase();
  const spans: [number, number][] = [];
  for (const q of quotations) {
    const at = q.trim() ? lower.indexOf(q.trim().toLowerCase()) : -1;
    if (at >= 0) spans.push([at, at + q.trim().length]);
  }
  spans.sort((a, b) => a[0] - b[0]);
  const parts: ReactNode[] = [];
  let from = 0;
  for (const [start, end] of spans) {
    if (start < from) continue;
    parts.push(text.slice(from, start));
    parts.push(
      <mark key={start} className="rounded bg-accent-soft px-0.5 text-inherit">
        {text.slice(start, end)}
      </mark>,
    );
    from = end;
  }
  parts.push(text.slice(from));
  return <p className="whitespace-pre-wrap leading-relaxed">{parts}</p>;
}

/** JudgedFeedback lists a judge's verdict: the criteria met and missed, with quotations, and at most two points to work on. */
export function JudgedFeedback({ feedback, text }: { feedback: Feedback; text: string }) {
  const { m } = useI18n();
  const met = feedback.criteria.filter((c) => c.met);
  const missed = feedback.criteria.filter((c) => !c.met);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-surface px-4 py-3">
        <Marked text={text} quotations={[...feedback.criteria.map((c) => c.quotation), ...feedback.points.map((p) => p.quotation)]} />
      </div>
      {met.length > 0 && (
        <section className="space-y-1">
          <h3 className="text-sm font-semibold text-good">{m.criteriaMet}</h3>
          {met.map((c) => (
            <p key={c.id} className="flex gap-2 text-sm">
              <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-good" />
              <span>
                {c.note}
                {c.quotation && <span className="text-muted"> — “{c.quotation}”</span>}
              </span>
            </p>
          ))}
        </section>
      )}
      {missed.length > 0 && (
        <section className="space-y-1">
          <h3 className="text-sm font-semibold text-bad">{m.criteriaMissed}</h3>
          {missed.map((c) => (
            <p key={c.id} className="flex gap-2 text-sm">
              <Circle size={18} className="mt-0.5 shrink-0 text-bad" />
              <span>{c.note}</span>
            </p>
          ))}
        </section>
      )}
      {feedback.points.length > 0 && (
        <section className="space-y-1">
          <h3 className="text-sm font-semibold">{m.nextSteps}</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {feedback.points.map((p) => (
              <li key={p.point}>
                {p.point}
                {p.quotation && <span className="text-muted"> — “{p.quotation}”</span>}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

/**
 * WritingFlow is the player of a question judged by a model: a long text field
 * whose draft is kept in the browser, a wait while the text is judged, and a
 * rewrite when the feedback sends it back. A verdict that counts goes to
 * onAnswered, like any other answer.
 */
export function WritingFlow({
  session,
  question,
  onAnswered,
}: {
  session: Session;
  question: Question;
  onAnswered(feedback: Feedback | undefined, next: Session, response: string): void;
}) {
  const { m, tx } = useI18n();
  const input = question.problem?.input?.kind;
  const limits = input?.case === "writing" ? input.value : { minWords: 1, maxChars: 2000 };
  const key = draftKey(session, question);
  const [text, setText] = useState(() => question.judging?.response || loadDraft(key));
  const [waiting, setWaiting] = useState(!!question.judging);
  const [judging, setJudging] = useState(question.judging);
  const [revise, setRevise] = useState<Feedback>();
  const [sent, setSent] = useState("");
  useEffect(() => saveDraft(key, text), [key, text]);

  const finish = (feedback: Feedback | undefined, next: Session, response: string) => {
    saveDraft(key, "");
    onAnswered(feedback, next, response);
  };
  const submit = useMutation({
    mutationFn: (skip: boolean) =>
      learning.submitAnswer({ sessionId: session.id, index: question.index, response: skip ? "" : text, skip }),
    onSuccess: (res, skip) => {
      const next = res.session!;
      if (res.pending) {
        setSent(text);
        setRevise(undefined);
        setJudging(next.step.case === "question" ? next.step.value.judging : undefined);
        setWaiting(true);
      } else if (skip || next.step.case !== "question" || next.step.value.index !== question.index) finish(res.feedback, next, text);
      else setRevise(res.feedback);
    },
  });
  const poll = useQuery({
    queryKey: ["judgment", session.id, question.index, sent],
    queryFn: () => learning.getJudgment({ sessionId: session.id, index: question.index }),
    enabled: waiting,
    refetchInterval: (q) => (q.state.data && !q.state.data.pending ? false : 2_000),
    gcTime: 0,
  });
  // finish and the texts change on every render; the verdict is acted on once, when it arrives.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    const res = poll.data;
    if (!res) return;
    const next = res.session!;
    if (res.pending) {
      setJudging(next.step.case === "question" ? next.step.value.judging : undefined);
      return;
    }
    setWaiting(false);
    if (res.feedback?.revise) setRevise(res.feedback);
    else finish(res.feedback, next, sent || text);
  }, [poll.data]);

  const words = countWords(text);
  const canSend = words >= limits.minWords && text.length <= limits.maxChars && !submit.isPending;

  if (waiting) {
    return (
      <Card className="space-y-4">
        <div className="rounded-xl border border-line bg-surface px-4 py-3">
          <p className="whitespace-pre-wrap leading-relaxed">{sent || text}</p>
        </div>
        {judging?.failed ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">{m.judgingFailed}</p>
            <Button variant="secondary" onClick={() => submit.mutate(true)} disabled={submit.isPending}>
              {m.skipQuestion}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Spinner label={m.judging} />
            {judging?.delayed && (
              <>
                <p className="text-sm text-muted">{m.judgingDelayed}</p>
                <Button variant="secondary" onClick={() => setWaiting(false)}>
                  <PencilSimple size={16} /> {m.rewrite}
                </Button>
              </>
            )}
          </div>
        )}
        {(poll.isError || submit.isError) && <ErrorNote message={m.error} />}
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {revise && (
        <Card className="space-y-3 border-warn/40 bg-warn-soft/50">
          <div className="text-lg font-semibold">{m.reviseTitle}</div>
          {revise.message && <Markdown source={tx(revise.message)} className="text-sm" />}
          {revise.criteria.length > 0 && <JudgedFeedback feedback={revise} text={sent} />}
        </Card>
      )}
      <Card className="space-y-3">
        <textarea
          aria-label={m.yourAnswer}
          value={text}
          // biome-ignore lint/a11y/noAutofocus: the text field is the point of the page
          autoFocus
          maxLength={limits.maxChars}
          rows={8}
          onChange={(e) => setText(e.target.value)}
          className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-lg leading-relaxed outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={`text-sm ${words >= limits.minWords ? "text-muted" : "text-warn"}`}>
            {m.writingWords(words, limits.minWords)}
          </span>
          <Button onClick={() => canSend && submit.mutate(false)} disabled={!canSend} className="px-6">
            {revise ? m.rewrite : m.sendWriting}
          </Button>
        </div>
        {submit.isError && <ErrorNote message={m.error} />}
      </Card>
    </div>
  );
}
