import type { Feedback, ProblemView, Question, Result, Session } from "@ga/proto/learning/v1/learning_pb";
import { ArrowLeft, ArrowRight, CheckCircle, Lightbulb, XCircle } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

import { FigureView } from "../../components/Figure.tsx";
import { Markdown, Tex } from "../../components/Markdown.tsx";
import { MathField } from "../../components/MathField.tsx";
import { Bar, Button, buttonClass, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { learning } from "../../lib/rpc.ts";

export const Route = createFileRoute("/session/$sessionId")({ component: Player });

/**
 * Player runs a session: lessons step through knowledge points (explanation,
 * worked example, practice with feedback); reviews give feedback per answer;
 * the diagnostic and quizzes give none until the end.
 */
function Player() {
  const { sessionId } = Route.useParams();
  const { m } = useI18n();
  const auth = useRequireSession();
  const loaded = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => learning.getSession({ id: sessionId }),
    enabled: !!auth,
    staleTime: Number.POSITIVE_INFINITY,
  });
  // The session as of the last answer; feedback is shown before moving on to it.
  const [session, setSession] = useState<Session>();
  const [pending, setPending] = useState<{ feedback: Feedback; next: Session; response: string }>();

  useEffect(() => {
    if (loaded.data?.session && !session) setSession(loaded.data.session);
  }, [loaded.data, session]);

  if (!auth || loaded.isPending || !session) {
    return loaded.isError ? (
      <ErrorNote message={m.error} retry={m.retry} onRetry={() => loaded.refetch()} />
    ) : (
      <Spinner label={m.loading} />
    );
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PlayerHeader session={session} />
      {session.step.case === "result" ? (
        <ResultView session={session} result={session.step.value} />
      ) : session.step.case === "question" ? (
        <QuestionFlow
          key={`${session.id}:${session.step.value.index}`}
          session={session}
          question={session.step.value}
          pending={pending}
          onAnswered={(feedback, next, response) => {
            if (feedback) setPending({ feedback, next, response });
            else setSession(next);
          }}
          onContinue={() => {
            if (!pending) return;
            setSession(pending.next);
            setPending(undefined);
          }}
        />
      ) : null}
    </div>
  );
}

function taskTitle(
  session: Session,
  m: ReturnType<typeof useI18n>["m"],
  tx: ReturnType<typeof useI18n>["tx"],
): { label: string; title: ReactNode } {
  const k = session.task?.kind;
  switch (k?.case) {
    case "lesson":
      return { label: m.lesson, title: <Markdown source={tx(k.value.title)} inline /> };
    case "review":
      return { label: m.review, title: <Markdown source={tx(k.value.title)} inline /> };
    case "quiz":
      return { label: m.quiz, title: m.quiz };
    default:
      return { label: m.diagnostic, title: m.diagnostic };
  }
}

function PlayerHeader({ session }: { session: Session }) {
  const { m, tx } = useI18n();
  const { label, title } = taskTitle(session, m, tx);
  const q = session.step.case === "question" ? session.step.value : undefined;
  const lesson = q?.lesson;
  return (
    <div className="space-y-3">
      <Link to="/learn/$courseId" params={{ courseId: session.courseId }} className={buttonClass("ghost", "-ml-4")}>
        <ArrowLeft size={16} /> {m.dashboard}
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium tracking-wide text-accent uppercase">{label}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        {q && !lesson && (
          <div className="text-sm text-muted">
            {session.task?.kind.case === "diagnostic"
              ? m.questionUpTo(q.index + 1, session.task.kind.value.maxQuestions)
              : m.question(q.index + 1, q.total)}
          </div>
        )}
      </div>
      {lesson && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>{m.step(lesson.knowledgePoint + 1, lesson.knowledgePoints)}</span>
            <span className="flex items-center gap-2">
              {m.streak(lesson.streak, lesson.needed)}
              <span className="flex gap-1">
                {Array.from({ length: lesson.needed }, (_, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length streak dots
                    key={i}
                    className={`size-2.5 rounded-full ${i < lesson.streak ? "bg-good" : "bg-line"}`}
                  />
                ))}
              </span>
            </span>
          </div>
          <Bar value={(lesson.knowledgePoint + lesson.streak / lesson.needed) / lesson.knowledgePoints} />
        </div>
      )}
      {q && !lesson && q.total > 0 && <Bar value={q.index / q.total} />}
    </div>
  );
}

function QuestionFlow({
  session,
  question,
  pending,
  onAnswered,
  onContinue,
}: {
  session: Session;
  question: Question;
  pending?: { feedback: Feedback; response: string };
  onAnswered(feedback: Feedback | undefined, next: Session, response: string): void;
  onContinue(): void;
}) {
  const { m } = useI18n();
  const qc = useQueryClient();
  const [practicing, setPracticing] = useState(!question.intro);
  const [response, setResponse] = useState("");
  const submit = useMutation({
    mutationFn: (skip: boolean) =>
      learning.submitAnswer({ sessionId: session.id, index: question.index, response: skip ? "" : response, skip }),
    onSuccess: (res, skip) => {
      const next = res.session!;
      if (next.step.case === "result") {
        void qc.invalidateQueries({ queryKey: ["dashboard", session.courseId] });
        void qc.invalidateQueries({ queryKey: ["progress", session.courseId] });
        void qc.invalidateQueries({ queryKey: ["profile"] });
      }
      onAnswered(res.feedback, next, skip ? "" : response);
    },
  });
  const answered = !!pending;
  const canSubmit = response.trim() !== "" && !submit.isPending && !answered;
  const send = () => canSubmit && submit.mutate(false);

  if (question.intro && !practicing) {
    const intro = question.intro;
    return <IntroView intro={intro} onDone={() => setPracticing(true)} />;
  }
  return (
    <div className="space-y-4">
      <Card className="space-y-6">
        {question.lesson && <div className="text-xs font-medium tracking-wide text-muted uppercase">{m.practice}</div>}
        <ProblemPrompt problem={question.problem} />
        <AnswerInput
          problem={question.problem}
          value={pending ? pending.response : response}
          onChange={setResponse}
          onSubmit={send}
          disabled={answered || submit.isPending}
          feedback={pending?.feedback}
        />
        {submit.isError && <ErrorNote message={m.error} />}
        {!answered && (
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={send} disabled={!canSubmit} className="px-6">
              {m.submit}
            </Button>
            {question.canSkip && (
              <Button variant="secondary" onClick={() => submit.mutate(true)} disabled={submit.isPending}>
                {m.dontKnow}
              </Button>
            )}
          </div>
        )}
      </Card>
      {pending && <FeedbackView feedback={pending.feedback} problem={question.problem} onContinue={onContinue} />}
    </div>
  );
}

function IntroView({ intro, onDone }: { intro: NonNullable<Question["intro"]>; onDone(): void }) {
  const { m, tx } = useI18n();
  const [shown, setShown] = useState(false);
  const ex = intro.example;
  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">
          <Markdown source={tx(intro.title)} inline />
        </h2>
        <Markdown source={tx(intro.explanation)} />
        <FigureView figure={intro.figure} />
      </Card>
      {ex && (
        <Card className="space-y-4 border-accent/25 bg-accent-soft/40">
          <div className="flex items-center gap-2 text-sm font-semibold text-accent">
            <Lightbulb size={18} weight="duotone" /> {m.workedExample}
          </div>
          <ProblemPrompt problem={ex.problem} />
          {shown ? (
            <div className="space-y-3 border-t border-accent/20 pt-4">
              <Markdown source={tx(ex.solution)} />
              <div className="text-sm">
                <span className="mr-2 text-muted">{m.answer}:</span>
                <AnswerText problem={ex.problem} answer={ex.answer} />
              </div>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setShown(true)}>
              {m.showSolution}
            </Button>
          )}
        </Card>
      )}
      <div className="flex justify-end">
        <Button onClick={onDone} className="px-6" autoFocus={shown}>
          {m.gotIt} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function ProblemPrompt({ problem }: { problem?: ProblemView }) {
  const { tx } = useI18n();
  return (
    <div className="space-y-4">
      <Markdown source={tx(problem?.prompt)} className="text-lg" />
      <FigureView figure={problem?.figure} />
    </div>
  );
}

/** AnswerText shows an answer as the learner would have given it: an option, math or text. */
function AnswerText({ problem, answer }: { problem?: ProblemView; answer: string }) {
  const { tx, m } = useI18n();
  const input = problem?.input?.kind;
  if (answer === "") return <span className="text-muted italic">{m.skipped}</span>;
  if (input?.case === "choice") return <Markdown source={tx(input.value.options[Number(answer)])} inline />;
  if (input?.case === "math") return <Tex tex={[input.value.prefix, answer, input.value.suffix].filter(Boolean).join(" ")} />;
  return <span>{answer}</span>;
}

function AnswerInput({
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
        <div role="radiogroup" className="grid gap-2">
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
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition disabled:cursor-default ${tone}`}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sm font-medium">
                  {String.fromCharCode(65 + i)}
                </span>
                <Markdown source={tx(o)} inline />
              </button>
            );
          })}
          {!disabled && <p className="text-xs text-muted">{m.choiceHint}</p>}
        </div>
      );
    case "math":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {input.value.prefix && <Tex tex={input.value.prefix} className="shrink-0 text-xl" />}
            <div className="flex-1">
              <MathField value={value} onChange={onChange} onSubmit={onSubmit} disabled={disabled} label={m.yourAnswer} autoFocus />
            </div>
            {input.value.suffix && <Tex tex={input.value.suffix} className="shrink-0 text-xl" />}
          </div>
          {!disabled && <p className="text-xs text-muted">{m.mathHint}</p>}
        </div>
      );
    default:
      return (
        <input
          aria-label={m.yourAnswer}
          value={value}
          disabled={disabled}
          // biome-ignore lint/a11y/noAutofocus: the answer field is the point of the page
          autoFocus
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
      );
  }
}

function FeedbackView({ feedback, problem, onContinue }: { feedback: Feedback; problem?: ProblemView; onContinue(): void }) {
  const { m, tx } = useI18n();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onContinue();
      }
    };
    // Registered after the Enter that submitted the answer has been handled.
    const id = setTimeout(() => window.addEventListener("keydown", onKey), 0);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [onContinue]);
  return (
    <Card className={`space-y-4 ${feedback.correct ? "border-good/40 bg-good-soft/50" : "border-bad/40 bg-bad-soft/50"}`}>
      <div className={`flex items-center gap-2 text-lg font-semibold ${feedback.correct ? "text-good" : "text-bad"}`}>
        {feedback.correct ? <CheckCircle size={24} weight="fill" /> : <XCircle size={24} weight="fill" />}
        {feedback.correct ? m.correct : m.incorrect}
      </div>
      {feedback.message && <Markdown source={tx(feedback.message)} className="text-sm" />}
      {!feedback.correct && (
        <div className="text-sm">
          <span className="mr-2 text-muted">{m.correctAnswer}:</span>
          <AnswerText problem={problem} answer={feedback.answer} />
        </div>
      )}
      <details open={!feedback.correct} className="group">
        <summary className="cursor-pointer text-sm font-medium text-muted select-none">{m.solution}</summary>
        <Markdown source={tx(feedback.solution)} className="mt-2" />
      </details>
      <div className="flex justify-end">
        <Button onClick={onContinue} className="px-6">
          {m.next} <ArrowRight size={16} />
        </Button>
      </div>
    </Card>
  );
}

function ResultView({ session, result }: { session: Session; result: Result }) {
  const { m, tx } = useI18n();
  const kind = session.task?.kind.case;
  const headline =
    kind === "diagnostic"
      ? m.placedResult(result.placed)
      : kind === "lesson"
        ? result.passed
          ? m.lessonPassed
          : m.failed
        : result.passed
          ? m.passed
          : m.failed;
  return (
    <div className="space-y-4">
      <Card className="space-y-3 text-center">
        <div
          className={`mx-auto flex size-14 items-center justify-center rounded-full ${result.passed ? "bg-good-soft text-good" : "bg-warn-soft text-warn"}`}
        >
          {result.passed ? <CheckCircle size={32} weight="fill" /> : <Lightbulb size={32} weight="fill" />}
        </div>
        <h2 className="text-xl font-semibold">{headline}</h2>
        {kind !== "diagnostic" && <p className="text-muted">{m.score(result.correct, result.asked)}</p>}
        {result.xp > 0 && <p className="text-2xl font-semibold text-accent">{m.earned(result.xp)}</p>}
        {kind === "lesson" && !result.passed && <p className="mx-auto max-w-lg text-sm text-muted">{m.lessonFailed}</p>}
        {kind === "review" && !result.passed && <p className="mx-auto max-w-lg text-sm text-muted">{m.reviewFailed}</p>}
        <div className="pt-2">
          <Link to="/learn/$courseId" params={{ courseId: session.courseId }} className={buttonClass("primary", "px-6")}>
            {m.backToDashboard} <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
      {result.items.map((item, i) => (
        <Card
          // biome-ignore lint/suspicious/noArrayIndexKey: items are positional
          key={i}
          className="space-y-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-muted">
              {i + 1}. <Markdown source={tx(item.title)} inline />
            </div>
            {item.correct ? (
              <CheckCircle size={22} weight="fill" className="text-good" />
            ) : (
              <XCircle size={22} weight="fill" className="text-bad" />
            )}
          </div>
          <ProblemPrompt problem={item.problem} />
          <div className="grid gap-1 text-sm sm:grid-cols-2">
            <div>
              <span className="mr-2 text-muted">{m.yourAnswer}:</span>
              <AnswerText problem={item.problem} answer={item.response} />
            </div>
            {!item.correct && (
              <div>
                <span className="mr-2 text-muted">{m.correctAnswer}:</span>
                <AnswerText problem={item.problem} answer={item.answer} />
              </div>
            )}
          </div>
          {!item.correct && (
            <details>
              <summary className="cursor-pointer text-sm font-medium text-muted select-none">{m.solution}</summary>
              <Markdown source={tx(item.solution)} className="mt-2" />
            </details>
          )}
        </Card>
      ))}
    </div>
  );
}
