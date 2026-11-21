import { type Stage, type StepTarget, sameTarget, sessionSteps, stepTargets } from "@ga/design";
import type { Subject } from "@ga/proto/catalog/v1/catalog_pb";
import {
  type AnsweredPart,
  type AnsweredQuestion,
  type Feedback,
  type KnowledgePointIntro,
  type ProblemView,
  type Question,
  type Result,
  type Session,
  type Submitted,
  type TopicLink,
  TopicStatus,
} from "@ga/proto/learning/v1/learning_pb";
import {
  ArrowArcLeft,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Circle,
  Clock,
  Lightbulb,
  Lock,
  PaperPlaneTilt,
  Question as QuestionMark,
  XCircle,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { AnswerInput } from "../../components/AnswerInput.tsx";
import { CaptionedFigure, Explanation, FigureView } from "../../components/Figure.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Markdown } from "../../components/Markdown.tsx";
import { PassageCard } from "../../components/PassageCard.tsx";
import { AnswerText, ProblemPrompt } from "../../components/Problem.tsx";
import { Sounds } from "../../components/Sounds.tsx";
import { SpeechFlow } from "../../components/SpeechFlow.tsx";
import { StepsBar } from "../../components/StepsBar.tsx";
import { Button, buttonClass, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { JudgedFeedback, WritingFlow } from "../../components/WritingFlow.tsx";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { learning } from "../../lib/rpc.ts";
import { SubjectChip, useShowSubject, useSubjectOfCourse } from "../../lib/subject.tsx";

export const Route = createFileRoute("/session/$sessionId")({ component: Player });

/** useNow is the time, updated every second while ticking. */
function useNow(ticking: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!ticking) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [ticking]);
  return now;
}

/** clock formats a number of milliseconds as minutes and seconds. */
function clock(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/** Countdown shows the time left before a quiz's deadline, warning in its last minute. */
function Countdown({ deadline }: { deadline: number }) {
  const { m } = useI18n();
  const now = useNow(true);
  const left = deadline - now;
  return (
    <span role="timer" className={`tabular-nums ${left <= 60_000 ? "font-medium text-bad" : ""}`}>
      {left > 0 ? m.timeLeft(clock(left)) : m.timeUp}
    </span>
  );
}

/** editing is true when a key goes to a field being typed in, which keeps the arrow keys. */
function editing(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "MATH-FIELD" || el.isContentEditable;
}

/** useArrowKeys moves back and on with ← and →, except while typing or with a modifier held. */
function useArrowKeys(onPrevious: (() => void) | undefined, onNext: (() => void) | undefined) {
  const keys = useRef({ onPrevious, onNext });
  keys.current = { onPrevious, onNext };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || editing(e)) return;
      const go = e.key === "ArrowLeft" ? keys.current.onPrevious : e.key === "ArrowRight" ? keys.current.onNext : undefined;
      if (!go) return;
      e.preventDefault();
      go();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/** Pending is an answer judged at once, shown with its verdict before the session moves on. */
interface Pending {
  feedback: Feedback;
  next: Session;
  response: string;
}

/**
 * Player runs a session: lessons step through knowledge points (explanation, worked example, practice with
 * feedback) and reviews give feedback per answer, both with a bar of steps to look back along; quizzes are answered
 * in any order and handed in; the diagnostic gives no feedback until the end.
 */
function Player() {
  const { sessionId } = Route.useParams();
  const { m } = useI18n();
  const qc = useQueryClient();
  const auth = useRequireSession();
  const loaded = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => learning.getSession({ id: sessionId }),
    enabled: !!auth,
    staleTime: Number.POSITIVE_INFINITY,
  });
  // The session as of the last answer; feedback is shown before moving on to it.
  const [session, setSession] = useState<Session>();
  const [pending, setPending] = useState<Pending>();

  useEffect(() => {
    if (loaded.data?.session && !session) setSession(loaded.data.session);
  }, [loaded.data, session]);
  const subject = useSubjectOfCourse(session?.courseId);
  useShowSubject(subject?.id);

  if (!auth || loaded.isPending || !session || !subject) {
    return loaded.isError ? <LoadError error={loaded.error} onRetry={() => loaded.refetch()} /> : <Spinner label={m.loading} />;
  }
  const moveTo = (next: Session) => {
    if (next.step.case === "result") {
      void qc.invalidateQueries({ queryKey: ["dashboard", session.courseId] });
      void qc.invalidateQueries({ queryKey: ["progress", session.courseId] });
      void qc.invalidateQueries({ queryKey: ["profile"] });
    }
    setSession(next);
  };
  const question = session.step.case === "question" ? session.step.value : undefined;
  const key = question ? `${session.id}:${question.index}:${question.problem?.part ?? 0}` : session.id;
  return (
    <div data-subject={subject.id} className="mx-auto max-w-3xl space-y-6">
      <PlayerHeader session={session} subject={subject} />
      {session.step.case === "result" ? (
        <ResultView session={session} result={session.step.value} />
      ) : session.step.case === "submitted" ? (
        <SubmittedView session={session} submitted={session.step.value} onJudged={moveTo} />
      ) : question?.sheet ? (
        <QuizFlow key={key} session={session} question={question} onSession={moveTo} />
      ) : question ? (
        <StepsFlow
          key={key}
          session={session}
          question={question}
          pending={pending}
          onAnswered={(feedback, next, response) => {
            if (feedback) setPending({ feedback, next, response });
            else moveTo(next);
          }}
          onContinue={() => {
            if (!pending) return;
            moveTo(pending.next);
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
      return { label: m.quiz, title: k.value.retake ? m.quizRetake : m.quiz };
    default:
      return { label: m.diagnostic, title: k?.case === "diagnostic" && k.value.supplemental ? m.supplemental : m.diagnostic };
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
        {q && !q.sheet && (
          <div className="text-sm text-muted">
            {lesson
              ? m.step(lesson.knowledgePoint + 1, lesson.knowledgePoints)
              : session.task?.kind.case === "diagnostic"
                ? m.questionUpTo(q.index + 1, session.task.kind.value.maxQuestions)
                : m.question(q.index + 1, q.total)}
          </div>
        )}
      </div>
    </div>
  );
}

/** introOf finds the lesson of a knowledge point reached, from the trail or the question asked now. */
function introOf(session: Session, question: Question, knowledgePoint: number): KnowledgePointIntro | undefined {
  return (
    session.trail?.intros.find((i) => i.index === knowledgePoint) ?? (question.intro?.index === knowledgePoint ? question.intro : undefined)
  );
}

/**
 * StepsFlow is a session answered a question at a time, under its bar of steps: the steps gone through may be looked
 * at again, read only, with the arrows, the bar or ← and →.
 */
function StepsFlow({
  session,
  question,
  pending,
  onAnswered,
  onContinue,
}: {
  session: Session;
  question: Question;
  pending?: Pending;
  onAnswered(feedback: Feedback | undefined, next: Session, response: string): void;
  onContinue(): void;
}) {
  const { m } = useI18n();
  const lesson = question.lesson;
  const intro = question.intro && question.earlier.length === 0 ? question.intro : undefined;
  const [stage, setStage] = useState<Stage>(intro ? "intro" : "question");
  const [viewing, setViewing] = useState<StepTarget>();
  const task = session.task?.kind;
  const kind = task?.case ?? "diagnostic";
  const parts = (question.problem?.parts ?? 0) > 1 ? (question.problem?.parts ?? 1) : 1;
  const groups = sessionSteps({
    kind,
    index: question.index,
    total: task?.case === "diagnostic" ? task.value.maxQuestions : question.total,
    ...(lesson && {
      lesson: {
        knowledgePoint: lesson.knowledgePoint,
        knowledgePoints: lesson.knowledgePoints,
        streak: lesson.streak,
        needed: lesson.needed,
        practice: lesson.practice,
        pass: lesson.pass || 2,
      },
    }),
    intros: (session.trail?.intros ?? []).map((i) => ({ knowledgePoint: i.index, example: !!i.example })),
    stage,
    answered: (session.trail?.answered ?? []).map((a) => ({
      index: a.index,
      knowledgePoint: a.knowledgePoint,
      parts: a.parts.map((p) => p.feedback?.correct),
    })),
    current: {
      parts,
      earlier: question.earlier.map((p) => p.feedback?.correct),
      ...(pending && { verdict: pending.feedback.correct }),
    },
  });
  const live: StepTarget = stage === "question" || !lesson ? { kind: "current" } : { kind: stage, knowledgePoint: lesson.knowledgePoint };
  const looking = viewing ?? live;
  const targets = stepTargets(groups);
  const at = targets.findIndex((t) => sameTarget(t, looking));
  const open = (t: StepTarget | undefined) => t && setViewing(sameTarget(t, live) ? undefined : t);
  const previous = at > 0 ? () => open(targets[at - 1]) : undefined;
  const next = at >= 0 && at < targets.length - 1 ? () => open(targets[at + 1]) : undefined;
  useArrowKeys(previous, next);
  const back = () => setViewing(undefined);
  // Each step starts at the top of the page, its bar in view.
  // biome-ignore lint/correctness/useExhaustiveDependencies: on each step shown
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage, viewing]);

  let body: ReactNode;
  if (viewing?.kind === "intro" || viewing?.kind === "example") {
    const seen = introOf(session, question, viewing.knowledgePoint);
    body = seen && (viewing.kind === "intro" ? <IntroCard intro={seen} /> : seen.example && <ExampleCard intro={seen} />);
  } else if (viewing?.kind === "answered") {
    const seen = session.trail?.answered.find((a) => a.index === viewing.index);
    body = seen && <AnsweredView answered={seen} />;
  } else if (intro && stage === "intro") {
    body = (
      <>
        <IntroCard intro={intro} />
        <div className="flex justify-end">
          <Button onClick={() => setStage(intro.example ? "example" : "question")} className="px-6">
            {intro.example ? m.next : m.gotIt} <ArrowRight size={16} />
          </Button>
        </div>
      </>
    );
  } else if (intro?.example && stage === "example") {
    body = (
      <>
        <ExampleCard intro={intro} />
        <div className="flex justify-end">
          <Button onClick={() => setStage("question")} className="px-6">
            {m.gotIt} <ArrowRight size={16} />
          </Button>
        </div>
      </>
    );
  } else {
    body = <QuestionFlow session={session} question={question} pending={pending} onAnswered={onAnswered} onContinue={onContinue} />;
  }
  return (
    <div className="space-y-4">
      <StepsBar groups={groups} looking={looking} onOpen={open} onPrevious={previous} onNext={next} />
      {viewing && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-2 text-sm">
          <span className="text-muted">
            {viewing.kind === "answered" ? m.lookingBack : viewing.kind === "example" ? m.workedExample : m.stepIntro}
          </span>
          <Button variant="secondary" onClick={back}>
            <ArrowArcLeft size={16} /> {m.backToCurrent}
          </Button>
        </div>
      )}
      {body}
    </div>
  );
}

/** IntroCard is a knowledge point's explanation and its drawings. */
function IntroCard({ intro }: { intro: KnowledgePointIntro }) {
  const { tx } = useI18n();
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">
        <Markdown source={tx(intro.title)} inline />
      </h2>
      <Explanation text={tx(intro.explanation)} figures={intro.figures} />
      <CaptionedFigure figure={intro.figure} />
    </Card>
  );
}

/** ExampleCard is a knowledge point's worked example, its solution shown in full. */
function ExampleCard({ intro }: { intro: KnowledgePointIntro }) {
  const { m, tx } = useI18n();
  const ex = intro.example;
  if (!ex) return null;
  return (
    <Card className="space-y-4 border-accent/25 bg-accent-soft/40">
      <div className="flex items-center gap-2 text-sm font-semibold text-accent">
        <Lightbulb size={18} weight="duotone" /> {m.workedExample}
      </div>
      {ex.problem?.scenario && (
        <div className="rounded-xl bg-surface/70 px-4 py-3">
          <Markdown source={tx(ex.problem.scenario)} />
        </div>
      )}
      <ProblemPrompt problem={ex.problem} apart={!!ex.problem?.scenario} />
      <div className="space-y-3 border-t border-accent/20 pt-4">
        <div className="text-sm font-semibold text-muted">{m.solution}</div>
        <Markdown source={tx(ex.solution)} />
        <FigureView figure={ex.solutionFigure} />
        <Sounds sounds={ex.solutionSounds} />
        <div className="text-sm">
          <span className="mr-2 text-muted">{m.answer}:</span>
          <AnswerText problem={ex.problem} answer={ex.answer} />
        </div>
      </div>
    </Card>
  );
}

/** ScenarioCard keeps a multistep problem's scenario in view above its parts, folded away on request. */
function ScenarioCard({ scenario }: { scenario: NonNullable<ProblemView["scenario"]> }) {
  const { m, tx } = useI18n();
  return (
    <details
      open
      className="sticky top-16 z-10 max-h-[40vh] overflow-auto rounded-2xl border border-line bg-surface/95 p-4 shadow-sm backdrop-blur sm:p-5"
    >
      <summary className="cursor-pointer text-xs font-medium tracking-wide text-muted uppercase select-none">{m.scenario}</summary>
      <Markdown source={tx(scenario)} className="mt-2" />
    </details>
  );
}

/** EarlierParts lists the parts of a multistep problem answered before the one asked now, each with its answer. */
function EarlierParts({ parts }: { parts: readonly AnsweredPart[] }) {
  const { m, tx } = useI18n();
  if (parts.length === 0) return null;
  return (
    <div className="space-y-2 rounded-2xl border border-line px-4 py-3">
      <div className="text-xs font-medium tracking-wide text-muted uppercase">{m.answeredParts}</div>
      <ol className="space-y-2">
        {parts.map((p, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: parts are positional
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="font-semibold text-muted">{i + 1}.</span>
            <div className="min-w-0 flex-1 space-y-1">
              <Markdown source={tx(p.problem?.ask ?? p.problem?.prompt)} />
              <div>
                <span className="mr-2 text-muted">{m.yourAnswer}:</span>
                <AnswerText problem={p.problem} answer={p.response} />
              </div>
            </div>
            {p.feedback &&
              (p.feedback.correct ? (
                <CheckCircle size={20} weight="fill" className="shrink-0 text-good" />
              ) : (
                <XCircle size={20} weight="fill" className="shrink-0 text-bad" />
              ))}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** VerdictBody is the verdict on an answer: right or wrong, the message, the right answer and the solution. */
function VerdictBody({ feedback, problem }: { feedback: Feedback; problem?: ProblemView }) {
  const { m, tx } = useI18n();
  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 text-lg font-semibold ${feedback.correct ? "text-good" : "text-bad"}`}>
        {feedback.correct ? <CheckCircle size={24} weight="fill" /> : <XCircle size={24} weight="fill" />}
        {feedback.correct ? m.correct : m.incorrect}
      </div>
      {feedback.message && <Markdown source={tx(feedback.message)} className="text-sm" />}
      {!feedback.correct && feedback.answer && (
        <div className="text-sm">
          <span className="mr-2 text-muted">{problem?.input?.kind.case === "writing" ? m.modelAnswer : m.correctAnswer}:</span>
          <AnswerText problem={problem} answer={feedback.answer} />
        </div>
      )}
      {(tx(feedback.solution) || feedback.solutionFigure || feedback.solutionSounds.length > 0) && (
        <details open={!feedback.correct} className="group">
          <summary className="cursor-pointer text-sm font-medium text-muted select-none">{m.solution}</summary>
          <Markdown source={tx(feedback.solution)} className="mt-2" />
          <FigureView figure={feedback.solutionFigure} className="mt-3" />
          <Sounds sounds={feedback.solutionSounds} className="mt-3" />
        </details>
      )}
    </div>
  );
}

const verdictTone = (feedback?: Feedback) => (!feedback ? "" : feedback.correct ? "border-good/50" : "border-bad/50");

/**
 * LiveVerdict is the verdict on the answer just given, inside its question's card, with the way on: Continue, or
 * Enter, and after a wrong answer the lesson to reread. On a small screen Continue stays at the bottom of the view.
 */
function LiveVerdict({
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
  const { m } = useI18n();
  const subjectId = useSubjectOfCourse(session.courseId)?.id ?? "";
  const task = session.task?.kind;
  const topicId = task?.case === "lesson" || task?.case === "review" ? task.value.topicId : undefined;
  const here = useRef<HTMLDivElement>(null);
  useEffect(() => {
    here.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
    <div ref={here} className={`space-y-4 border-t pt-5 max-sm:pb-16 ${feedback.correct ? "border-good/30" : "border-bad/30"}`}>
      <VerdictBody feedback={feedback} problem={problem} />
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
        <div className="max-sm:fixed max-sm:inset-x-4 max-sm:bottom-4 max-sm:z-20 sm:contents">
          <Button onClick={onContinue} className="px-6 max-sm:w-full max-sm:shadow-lg">
            {m.next} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** AnsweredView shows a question answered earlier, read only: each part with the answer given and its verdict. */
function AnsweredView({ answered }: { answered: AnsweredQuestion }) {
  const { m, tx } = useI18n();
  const first = answered.parts[0]?.problem;
  const multistep = answered.parts.length > 1 || (first?.parts ?? 0) > 1;
  const last = answered.parts.at(-1)?.feedback;
  return (
    <Card className={`space-y-5 ${verdictTone(last)}`}>
      {answered.referenced && (
        <span className="inline-flex items-center gap-1 rounded-full bg-warn-soft px-2 py-0.5 text-xs font-medium text-warn">
          <BookOpen size={14} /> {m.reference}
        </span>
      )}
      {multistep && first?.scenario && (
        <div className="rounded-xl bg-page px-4 py-3">
          <Markdown source={tx(first.scenario)} />
        </div>
      )}
      {answered.parts.map((p, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: parts are positional
        <div key={i} className="space-y-4 border-line not-first:border-t not-first:pt-5">
          <ProblemPrompt problem={p.problem} apart={multistep} />
          {p.problem?.input?.kind.case === "choice" ? (
            <AnswerInput problem={p.problem} value={p.response} onChange={() => {}} onSubmit={() => {}} disabled feedback={p.feedback} />
          ) : (
            <div className="rounded-xl border border-line bg-page px-4 py-3 text-sm">
              <span className="mr-2 text-muted">{m.yourAnswer}:</span>
              <AnswerText problem={p.problem} answer={p.response} />
            </div>
          )}
          {p.feedback && <VerdictBody feedback={p.feedback} problem={p.problem} />}
        </div>
      ))}
    </Card>
  );
}

/** ReferenceAsk is the "?" of a review question: it says what looking at the lesson costs, and opens it on request. */
function ReferenceAsk({ credit, busy, onOpen }: { credit: number; busy: boolean; onOpen(): void }) {
  const { m } = useI18n();
  const [asking, setAsking] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAsking((a) => !a)}
        aria-expanded={asking}
        aria-label={m.reference}
        title={m.reference}
        className="flex size-8 items-center justify-center rounded-full border border-line text-muted hover:border-warn hover:text-warn"
      >
        <QuestionMark size={18} weight="bold" />
      </button>
      {asking && (
        <div className="absolute top-10 right-0 z-20 w-72 space-y-3 rounded-xl border border-line bg-surface p-4 text-sm shadow-lg">
          <p className="text-muted">{m.referenceNote(credit)}</p>
          <Button variant="secondary" onClick={onOpen} disabled={busy}>
            <BookOpen size={16} /> {m.reference}
          </Button>
        </div>
      )}
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
  pending?: Pending;
  onAnswered(feedback: Feedback | undefined, next: Session, response: string): void;
  onContinue(): void;
}) {
  const { m } = useI18n();
  const [response, setResponse] = useState("");
  // A review may show the lesson of the step asked; the server marks the question, which then earns part of the credit.
  const [reference, setReference] = useState(question.reference);
  const look = useMutation({
    mutationFn: () => learning.openReference({ sessionId: session.id, index: question.index }),
    onSuccess: (res) => {
      const step = res.session?.step;
      if (step?.case === "question") setReference(step.value.reference);
    },
  });
  const submit = useMutation({
    mutationFn: (skip: boolean) =>
      learning.submitAnswer({ sessionId: session.id, index: question.index, response: skip ? "" : response, skip }),
    onSuccess: (res, skip) => onAnswered(res.feedback, res.session!, skip ? "" : response),
  });
  const answered = !!pending;
  const canSubmit = response.trim() !== "" && !submit.isPending && !answered;
  const send = () => canSubmit && submit.mutate(false);
  const problem = question.problem;
  const scenario = (problem?.parts ?? 0) > 1 ? problem?.scenario : undefined;
  const label = question.lesson && <div className="text-xs font-medium tracking-wide text-muted uppercase">{m.practice}</div>;
  const above = (
    <>
      {question.passage && <PassageCard passage={question.passage} />}
      {scenario && <ScenarioCard scenario={scenario} />}
      <EarlierParts parts={question.earlier} />
    </>
  );
  const verdict = pending && <LiveVerdict feedback={pending.feedback} problem={problem} session={session} onContinue={onContinue} />;

  const spoken = problem?.input?.kind;
  if (spoken?.case === "speech") {
    return (
      <div className="space-y-4">
        {above}
        <Card className={`space-y-6 ${verdictTone(pending?.feedback)}`}>
          {label}
          <ProblemPrompt problem={problem} answering apart={!!scenario} />
          {pending ? (
            <div className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
              <span className="mr-2 text-muted">{m.weHeard}:</span>“{pending.response}”
            </div>
          ) : (
            <SpeechFlow session={session} question={question} input={spoken.value} onAnswered={onAnswered} />
          )}
          {verdict}
        </Card>
      </div>
    );
  }
  if (spoken?.case === "writing") {
    return (
      <div className="space-y-4">
        {above}
        <Card className="space-y-6">
          {label}
          <ProblemPrompt problem={problem} answering apart={!!scenario} />
        </Card>
        {pending ? (
          <Card className={`space-y-5 ${verdictTone(pending.feedback)}`}>
            {pending.feedback.criteria.length > 0 && <JudgedFeedback feedback={pending.feedback} text={pending.response} />}
            {verdict}
          </Card>
        ) : (
          <WritingFlow session={session} question={question} onAnswered={onAnswered} />
        )}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {above}
      {reference && <ReferenceCard reference={reference} />}
      <Card className={`space-y-6 ${verdictTone(pending?.feedback)}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {label}
            <ProblemPrompt problem={problem} answering apart={!!scenario} />
          </div>
          {question.canReference && !reference && !answered && (
            <ReferenceAsk credit={question.referenceCredit} busy={look.isPending} onOpen={() => look.mutate()} />
          )}
        </div>
        <AnswerInput
          problem={problem}
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
        {verdict}
      </Card>
    </div>
  );
}

/** ReferenceCard is the lesson of the step a review asks, once looked at: its explanation and drawings, folded away on request. */
function ReferenceCard({ reference }: { reference: NonNullable<Question["reference"]> }) {
  const { m, tx } = useI18n();
  return (
    <details open className="group rounded-2xl border border-warn/30 bg-warn-soft/30 p-4 sm:p-5">
      <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-warn">
        <BookOpen size={18} weight="duotone" /> {m.reference}: <Markdown source={tx(reference.title)} inline />
      </summary>
      <div className="mt-4 space-y-4">
        <Explanation text={tx(reference.explanation)} figures={reference.figures} />
        <CaptionedFigure figure={reference.figure} />
      </div>
    </details>
  );
}

/**
 * QuizFlow is a quiz as an exam: a numbered sheet of its questions, any of which may be opened and answered or its
 * answer changed, the time left and the count answered; nothing is judged until it is handed in, or the time runs out.
 */
function QuizFlow({ session, question, onSession }: { session: Session; question: Question; onSession(next: Session): void }) {
  const { m } = useI18n();
  const slots = question.sheet?.slots ?? [];
  const here = slots[question.index];
  const final = !!here?.locked && !!here.answered;
  const [response, setResponse] = useState(question.saved);
  const [confirming, setConfirming] = useState(false);
  const problem = question.problem;
  const parts = problem?.parts ?? 0;
  const partBefore = parts > 1 && (problem?.part ?? 0) < parts;
  const dirty = !final && response.trim() !== "" && response !== question.saved;
  const move = useMutation({
    mutationFn: async (to: number | "stay" | "finish") => {
      let next: Session | undefined = session;
      if (dirty) {
        const open = typeof to === "number" && !partBefore ? to : undefined;
        next = (await learning.submitAnswer({ sessionId: session.id, index: question.index, response, skip: false, open })).session;
      }
      const step = next?.step;
      if (step?.case === "question" && typeof to === "number" && step.value.index !== to)
        next = (await learning.openQuestion({ sessionId: session.id, index: to })).session;
      if (to === "finish" && next?.step.case === "question") next = (await learning.finishQuiz({ sessionId: session.id })).session;
      return next;
    },
    onSuccess: (next) => next && onSession(next),
  });
  const go = (to: number | "stay" | "finish") => !move.isPending && move.mutate(to);
  const count = slots.length;
  const answeredCount = slots.filter((s) => s.answered).length + (dirty && !here?.answered ? 1 : 0);
  const unanswered = count - answeredCount;
  const onward = (() => {
    if (question.index + 1 < count) return question.index + 1;
    const open = slots.findIndex((s, i) => !s.answered && i !== question.index);
    return open >= 0 ? open : undefined;
  })();
  const save = () => (partBefore ? go("stay") : onward !== undefined ? go(onward) : go("stay"));
  const previous = question.index > 0 ? () => go(question.index - 1) : undefined;
  const next = question.index + 1 < count ? () => go(question.index + 1) : undefined;
  useArrowKeys(confirming ? undefined : previous, confirming ? undefined : next);
  // When the time runs out, what is written is saved and the quiz handed in.
  const deadline = Number(question.deadline);
  const now = useNow(deadline > 0);
  const timeUp = deadline > 0 && now >= deadline;
  // biome-ignore lint/correctness/useExhaustiveDependencies: handed in once, when the time runs out
  useEffect(() => {
    if (timeUp && !move.isPending && !move.isSuccess) move.mutate("finish");
  }, [timeUp]);
  const scenario = parts > 1 ? problem?.scenario : undefined;
  const arrow = "flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-line/50 disabled:opacity-30";
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="font-medium">{m.quizAnswered(answeredCount, count)}</span>
        {deadline > 0 && <Countdown deadline={deadline} />}
      </div>
      <nav aria-label={m.quizNavigator} className="flex items-center gap-1">
        <button type="button" className={arrow} onClick={previous} disabled={!previous || move.isPending} aria-label={m.previousStep}>
          <CaretLeft size={18} weight="bold" />
        </button>
        <div className="flex flex-1 flex-wrap justify-center gap-2">
          {slots.map((s, i) => {
            const now = i === question.index;
            const done = s.answered || (now && dirty);
            return (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: slots are positional
                key={i}
                type="button"
                onClick={() => !now && go(i)}
                disabled={move.isPending}
                aria-current={now ? "step" : undefined}
                aria-label={m.quizSlot(i + 1, done)}
                className={`relative flex size-10 items-center justify-center rounded-xl border-2 text-sm font-semibold tabular-nums transition ${
                  now
                    ? "border-accent bg-accent text-on-accent"
                    : done
                      ? "border-accent/40 bg-accent-soft text-accent hover:border-accent"
                      : "border-line text-muted hover:border-accent/60"
                }`}
              >
                {i + 1}
                {s.locked && s.answered && <Lock size={10} weight="fill" className="absolute top-0.5 right-0.5 opacity-70" />}
              </button>
            );
          })}
        </div>
        <button type="button" className={arrow} onClick={next} disabled={!next || move.isPending} aria-label={m.nextStep}>
          <CaretRight size={18} weight="bold" />
        </button>
      </nav>
      <p className="text-center text-xs text-muted">{m.quizNoFeedback}</p>
      {scenario && <ScenarioCard scenario={scenario} />}
      <EarlierParts parts={question.earlier} />
      <Card className="space-y-6">
        <div className="text-xs font-medium tracking-wide text-muted uppercase">{m.stepQuestion(question.index + 1)}</div>
        <ProblemPrompt problem={problem} answering apart={!!scenario} />
        <AnswerInput
          problem={problem}
          value={response}
          onChange={setResponse}
          onSubmit={save}
          disabled={final || move.isPending || timeUp}
        />
        {final && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Lock size={16} /> {m.answerFinal}
          </p>
        )}
        {move.isError && <ErrorNote message={m.error} />}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button onClick={save} disabled={move.isPending || timeUp || (!dirty && (partBefore || onward === undefined))} className="px-6">
            {partBefore || onward === undefined ? m.saveAnswer : m.saveAndNext} <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" onClick={() => setConfirming(true)} disabled={move.isPending}>
            <PaperPlaneTilt size={16} /> {m.handIn}
          </Button>
        </div>
      </Card>
      {confirming && (
        <HandInDialog
          unanswered={unanswered}
          deadline={deadline}
          busy={move.isPending}
          onCancel={() => setConfirming(false)}
          onConfirm={() => go("finish")}
        />
      )}
    </div>
  );
}

/** HandInDialog asks before a quiz is handed in, saying how many questions have no answer and how much time is left. */
function HandInDialog({
  unanswered,
  deadline,
  busy,
  onCancel,
  onConfirm,
}: {
  unanswered: number;
  deadline: number;
  busy: boolean;
  onCancel(): void;
  onConfirm(): void;
}) {
  const { m } = useI18n();
  const now = useNow(deadline > 0);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby="hand-in-title"
      onClose={onCancel}
      className="m-auto w-[calc(100%-2rem)] max-w-md space-y-4 rounded-2xl border border-line bg-surface p-6 text-ink shadow-xl backdrop:bg-ink/40"
    >
      <h2 id="hand-in-title" className="text-lg font-semibold">
        {m.handInTitle}
      </h2>
      <p className={unanswered > 0 ? "font-medium text-bad" : "text-muted"}>
        {unanswered > 0 ? m.handInUnanswered(unanswered) : m.handInAllAnswered}
      </p>
      {deadline > now && (
        <p className="flex items-center gap-2 text-sm text-muted">
          <Clock size={16} /> {m.handInTimeLeft(clock(deadline - now))}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          {m.keepWorking}
        </Button>
        {/* biome-ignore lint/a11y/noAutofocus: the dialog's answer to hand in */}
        <button autoFocus type="button" onClick={onConfirm} disabled={busy} className={buttonClass("primary", "px-6")}>
          <PaperPlaneTilt size={16} /> {m.handIn}
        </button>
      </div>
    </dialog>
  );
}

/** ESSAY_WAIT_MS bounds how long a learner left on a submitted essay's page waits there for its verdict. */
const ESSAY_WAIT_MS = 10 * 60_000;

/**
 * SubmittedView shows an essay handed in and waiting for its verdict. While
 * the page stays open it asks every few seconds; the verdict also appears on
 * the dashboard, so the learner may leave.
 */
function SubmittedView({ session, submitted, onJudged }: { session: Session; submitted: Submitted; onJudged(next: Session): void }) {
  const { m } = useI18n();
  const qc = useQueryClient();
  const subjectId = useSubjectOfCourse(session.courseId)?.id ?? "";
  const [since] = useState(() => Date.now());
  const poll = useQuery({
    queryKey: ["essay", session.id],
    queryFn: () => learning.getJudgment({ sessionId: session.id, index: 0 }),
    enabled: !submitted.failed,
    refetchInterval: (q) => ((q.state.data && !q.state.data.pending) || Date.now() - since > ESSAY_WAIT_MS ? false : 5_000),
    gcTime: 0,
  });
  // onJudged changes on every render; the verdict is acted on once, when it arrives.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    const res = poll.data;
    if (!res || res.pending || !res.session) return;
    void qc.invalidateQueries({ queryKey: ["dashboard", session.courseId] });
    void qc.invalidateQueries({ queryKey: ["progress", session.courseId] });
    void qc.invalidateQueries({ queryKey: ["profile"] });
    onJudged(res.session);
  }, [poll.data]);
  const waiting = poll.data?.pending !== false && (poll.data?.pending === undefined || poll.dataUpdatedAt - since < ESSAY_WAIT_MS);
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <PaperPlaneTilt size={22} weight="fill" className="text-accent" /> {m.essaySubmittedTitle}
      </div>
      {submitted.failed ? (
        <p role="alert" className="text-sm text-muted">
          {m.essayFailed}
        </p>
      ) : (
        <>
          <p className="text-sm text-muted">{m.essaySubmitted}</p>
          {waiting && <Spinner label={m.judging} />}
        </>
      )}
      <div className="rounded-xl border border-line bg-surface px-4 py-3">
        <p className="whitespace-pre-wrap leading-relaxed">{submitted.response}</p>
      </div>
      <Link to="/$subject" params={{ subject: subjectId }} className={buttonClass("primary", "px-6")}>
        {m.backToDashboard} <ArrowRight size={16} />
      </Link>
    </Card>
  );
}

/** EssayVerdict shows the verdict on an essay with the text it judged and a model essay. */
function EssayVerdict({ feedback, text, problem }: { feedback: Feedback; text: string; problem?: ProblemView }) {
  const { m } = useI18n();
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">{m.essayVerdict}</h3>
      <JudgedFeedback feedback={feedback} text={text} />
      {feedback.answer && (
        <details>
          <summary className="cursor-pointer text-sm font-medium text-muted select-none">{m.modelAnswer}</summary>
          <div className="mt-2">
            <AnswerText problem={problem} answer={feedback.answer} />
          </div>
        </details>
      )}
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
        {kind !== "diagnostic" && <p className="text-muted">{m.score(result.correct, result.asked + result.unanswered)}</p>}
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
        {result.unanswered > 0 && <p className="mx-auto max-w-lg text-sm text-muted">{m.unanswered(result.unanswered)}</p>}
        {kind === "quiz" &&
          session.task?.kind.case === "quiz" &&
          !session.task.kind.value.retake &&
          result.correct < result.asked + result.unanswered && <p className="mx-auto max-w-lg text-sm text-muted">{m.quizFollowUps}</p>}
        <div className="pt-2">
          <Link to="/$subject" params={{ subject: subjectId }} className={buttonClass("primary", "px-6")}>
            {m.backToDashboard} <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
      {result.remedial.length > 0 && (
        <Card className="space-y-2 border-warn/40">
          <h3 className="font-semibold">{m.remedialTitle}</h3>
          <p className="text-sm text-muted">{m.remedialBody}</p>
          <TopicLinks subject={subjectId} links={result.remedial} />
        </Card>
      )}
      {result.prerequisites.length > 0 && (
        <Card className="space-y-2">
          <h3 className="text-sm font-medium text-muted">{m.buildsOn}</h3>
          <TopicLinks subject={subjectId} links={result.prerequisites} />
        </Card>
      )}
      {result.passage && <PassageCard passage={result.passage} />}
      {result.feedback && result.items[0] && (
        <>
          <Card>
            <ProblemPrompt problem={result.items[0].problem} />
          </Card>
          <EssayVerdict feedback={result.feedback} text={result.items[0].response} problem={result.items[0].problem} />
        </>
      )}
      {!result.feedback &&
        result.items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: items are positional
          <div key={i} className="space-y-2">
            {item.knowledgePointTitle && result.items[i - 1]?.knowledgePoint !== item.knowledgePoint && (
              <h3 className="px-1 pt-2 text-sm font-semibold">
                {item.knowledgePoint + 1}. <Markdown source={tx(item.knowledgePointTitle)} inline />
              </h3>
            )}
            <Card className="space-y-3">
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
                <div className="flex shrink-0 items-center gap-2">
                  {item.late && <span className="rounded-full bg-warn-soft px-2 py-0.5 text-xs font-medium text-warn">{m.late}</span>}
                  {item.elapsedMs > 0n && (
                    <span className="flex items-center gap-1 text-xs text-muted tabular-nums">
                      <Clock size={14} /> {m.elapsed(Number(item.elapsedMs))}
                    </span>
                  )}
                  {item.correct ? (
                    <CheckCircle size={22} weight="fill" className="text-good" />
                  ) : (
                    <XCircle size={22} weight="fill" className="text-bad" />
                  )}
                </div>
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
                  <Sounds sounds={item.solutionSounds} className="mt-3" />
                </details>
              )}
            </Card>
          </div>
        ))}
    </div>
  );
}

/** TopicLinks lists topics as links, each marked known (learned or assumed) or not. */
function TopicLinks({ subject, links }: { subject: string; links: readonly TopicLink[] }) {
  const { tx } = useI18n();
  return (
    <ul className="space-y-1">
      {links.map((l) => {
        const known = l.status === TopicStatus.LEARNED || l.status === TopicStatus.ASSUMED || l.status === TopicStatus.DUE;
        return (
          <li key={l.topicId} className="flex items-center gap-2 text-sm">
            {known ? <CheckCircle size={18} weight="fill" className="text-good" /> : <Circle size={18} className="text-muted" />}
            <Link to="/$subject/topics/$topicId" params={{ subject, topicId: l.topicId }} className="hover:underline">
              <Markdown source={tx(l.title)} inline />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
