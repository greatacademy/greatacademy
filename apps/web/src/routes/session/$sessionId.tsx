import type { Subject } from "@ga/proto/catalog/v1/catalog_pb";
import type { Feedback, ProblemView, Question, Result, Session } from "@ga/proto/learning/v1/learning_pb";
import { ArrowLeft, ArrowRight, CheckCircle, Lightbulb, XCircle } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

import { CaptionedFigure, Explanation, FigureView } from "../../components/Figure.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Markdown, Tex } from "../../components/Markdown.tsx";
import { MathField } from "../../components/MathField.tsx";
import { OrderField } from "../../components/OrderField.tsx";
import { PlotField } from "../../components/PlotField.tsx";
import { AnswerText, ProblemPrompt } from "../../components/Problem.tsx";
import { Bar, Button, buttonClass, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { JudgedFeedback, WritingFlow } from "../../components/WritingFlow.tsx";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { learning } from "../../lib/rpc.ts";
import { SubjectChip, useShowSubject, useSubjectOfCourse } from "../../lib/subject.tsx";

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
  const subject = useSubjectOfCourse(session?.courseId);
  useShowSubject(subject?.id);

  if (!auth || loaded.isPending || !session || !subject) {
    return loaded.isError ? <LoadError error={loaded.error} onRetry={() => loaded.refetch()} /> : <Spinner label={m.loading} />;
  }
  return (
    <div data-subject={subject.id} className="mx-auto max-w-3xl space-y-6">
      <PlayerHeader session={session} subject={subject} />
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
    case "reading":
      return { label: m.reading, title: <Markdown source={tx(k.value.title)} inline /> };
    case "quiz":
      return { label: m.quiz, title: m.quiz };
    default:
      return { label: m.diagnostic, title: m.diagnostic };
  }
}

function PlayerHeader({ session, subject }: { session: Session; subject: Subject }) {
  const { m, tx } = useI18n();
  const { label, title } = taskTitle(session, m, tx);
  const q = session.step.case === "question" ? session.step.value : undefined;
  const lesson = q?.lesson;
  return (
    <div className="space-y-3">
      <Link to="/$subject" params={{ subject: subject.id }} className={buttonClass("ghost", "-ml-4")}>
        <ArrowLeft size={16} /> <SubjectChip subject={subject} size={22} />
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-medium tracking-wide text-on-subject-soft uppercase">{label}</div>
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
  if (question.problem?.input?.kind.case === "writing") {
    return (
      <div className="space-y-4">
        {question.passage && <PassageCard body={question.passage.body} />}
        <Card className="space-y-6">
          {question.lesson && <div className="text-xs font-medium tracking-wide text-muted uppercase">{m.practice}</div>}
          <ProblemPrompt problem={question.problem} answering />
        </Card>
        {pending ? (
          pending.feedback.criteria.length > 0 && (
            <Card>
              <JudgedFeedback feedback={pending.feedback} text={pending.response} />
            </Card>
          )
        ) : (
          <WritingFlow session={session} question={question} onAnswered={onAnswered} />
        )}
        {pending && <FeedbackView feedback={pending.feedback} problem={question.problem} session={session} onContinue={onContinue} />}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {question.passage && <PassageCard body={question.passage.body} />}
      <Card className="space-y-6">
        {question.lesson && <div className="text-xs font-medium tracking-wide text-muted uppercase">{m.practice}</div>}
        <ProblemPrompt problem={question.problem} answering />
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
      {pending && <FeedbackView feedback={pending.feedback} problem={question.problem} session={session} onContinue={onContinue} />}
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
        <Explanation text={tx(intro.explanation)} figures={intro.figures} />
        <CaptionedFigure figure={intro.figure} />
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
              <FigureView figure={ex.solutionFigure} />
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

/** PassageCard shows a text to read; it stays in view while its questions are answered. */
function PassageCard({ body }: { body: string }) {
  return (
    <Card className="space-y-4">
      {body.split(/\n\s*\n/).map((paragraph) => (
        <p key={paragraph} className="text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
    </Card>
  );
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
        <div className="space-y-2">
          <div role="radiogroup" className={`grid gap-2 ${input.value.figures.length > 0 ? "sm:grid-cols-2" : ""}`}>
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
                  className={`flex gap-3 rounded-xl border-2 px-4 py-3 text-left transition disabled:cursor-default ${input.value.figures[i] ? "items-start" : "items-center"} ${tone}`}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sm font-medium">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {input.value.figures[i] ? (
                    <FigureView figure={input.value.figures[i]} className="min-w-0 flex-1" />
                  ) : (
                    <Markdown source={tx(o)} inline />
                  )}
                </button>
              );
            })}
          </div>
          {!disabled && <p className="text-xs text-muted">{m.choiceHint}</p>}
        </div>
      );
    case "order":
      return (
        <OrderField key={tx(problem?.prompt)} items={input.value.items.map((item) => tx(item))} onChange={onChange} disabled={disabled} />
      );
    case "plot":
      return (
        <PlotField
          key={tx(problem?.prompt)}
          input={input.value}
          figure={problem?.figure}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          disabled={disabled}
          answer={feedback && !feedback.correct ? feedback.answer : undefined}
        />
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

function FeedbackView({
  feedback,
  problem,
  session,
  onContinue,
}: {
  feedback: Feedback;
  problem?: ProblemView;
  session: Session;
  onContinue(): void;
}) {
  const { m, tx } = useI18n();
  const subjectId = useSubjectOfCourse(session.courseId)?.id ?? "";
  const task = session.task?.kind;
  const topicId = task?.case === "lesson" || task?.case === "review" ? task.value.topicId : undefined;
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
          <span className="mr-2 text-muted">{problem?.input?.kind.case === "writing" ? m.modelAnswer : m.correctAnswer}:</span>
          <AnswerText problem={problem} answer={feedback.answer} />
        </div>
      )}
      <details open={!feedback.correct} className="group">
        <summary className="cursor-pointer text-sm font-medium text-muted select-none">{m.solution}</summary>
        <Markdown source={tx(feedback.solution)} className="mt-2" />
        <FigureView figure={feedback.solutionFigure} className="mt-3" />
      </details>
      <div className={`flex items-center gap-3 ${topicId && !feedback.correct ? "justify-between" : "justify-end"}`}>
        {topicId && !feedback.correct && (
          <Link
            to="/$subject/topics/$topicId"
            params={{ subject: subjectId, topicId }}
            target="_blank"
            className="text-sm font-medium text-accent hover:underline"
          >
            {m.rereadLesson}
          </Link>
        )}
        <Button onClick={onContinue} className="px-6">
          {m.next} <ArrowRight size={16} />
        </Button>
      </div>
    </Card>
  );
}

function ResultView({ session, result }: { session: Session; result: Result }) {
  const { m, tx } = useI18n();
  const subjectId = useSubjectOfCourse(session.courseId)?.id ?? "";
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
        {result.xp > 0 && (
          <div>
            <p className="text-2xl font-semibold text-accent">{m.earned(result.xp)}</p>
            {result.fullXp > 0 && (
              <p className="text-sm text-muted">{result.xp > result.fullXp ? m.perfectBonus : m.earnedOf(result.xp, result.fullXp)}</p>
            )}
          </div>
        )}
        {result.xp < 0 && <p className="text-2xl font-semibold text-bad">{m.lostXp(result.xp)}</p>}
        {result.blownOff && (
          <div role="alert" className="mx-auto max-w-lg rounded-xl border border-warn/40 bg-warn-soft px-4 py-3 text-left text-sm">
            <p className="font-medium">{m.blownOffTitle}</p>
            <p className="mt-1 text-muted">{result.xp < 0 ? m.blownOffLost : m.blownOffWarn}</p>
          </div>
        )}
        {kind === "lesson" && !result.passed && !result.blownOff && <p className="mx-auto max-w-lg text-sm text-muted">{m.lessonFailed}</p>}
        {kind === "review" && !result.passed && !result.blownOff && <p className="mx-auto max-w-lg text-sm text-muted">{m.reviewFailed}</p>}
        <div className="pt-2">
          <Link to="/$subject" params={{ subject: subjectId }} className={buttonClass("primary", "px-6")}>
            {m.backToDashboard} <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
      {result.passage && <PassageCard body={result.passage.body} />}
      {result.items.map((item, i) => (
        <Card
          // biome-ignore lint/suspicious/noArrayIndexKey: items are positional
          key={i}
          className="space-y-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-muted">
              {i + 1}.{" "}
              {kind === "reading" ? (
                <Markdown source={tx(item.title)} inline />
              ) : (
                <Link to="/$subject/topics/$topicId" params={{ subject: subjectId, topicId: item.topicId }} className="hover:underline">
                  <Markdown source={tx(item.title)} inline />
                </Link>
              )}
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
              <FigureView figure={item.solutionFigure} className="mt-3" />
            </details>
          )}
        </Card>
      ))}
    </div>
  );
}
