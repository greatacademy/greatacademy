import type { Subject } from "@ga/proto/catalog/v1/catalog_pb";
import {
  type Feedback,
  type ProblemView,
  type Question,
  type Result,
  type Session,
  type Submitted,
  type TopicLink,
  TopicStatus,
} from "@ga/proto/learning/v1/learning_pb";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Circle, Clock, Lightbulb, PaperPlaneTilt, XCircle } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

import { AnswerInput } from "../../components/AnswerInput.tsx";
import { CaptionedFigure, Explanation, FigureView } from "../../components/Figure.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Markdown } from "../../components/Markdown.tsx";
import { PassageCard } from "../../components/PassageCard.tsx";
import { AnswerText, ProblemPrompt } from "../../components/Problem.tsx";
import { Sounds } from "../../components/Sounds.tsx";
import { SpeechFlow } from "../../components/SpeechFlow.tsx";
import { Bar, Button, buttonClass, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
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
      ) : session.step.case === "submitted" ? (
        <SubmittedView session={session} submitted={session.step.value} onJudged={setSession} />
      ) : session.step.case === "question" ? (
        <QuestionFlow
          key={`${session.id}:${session.step.value.index}:${session.step.value.problem?.part ?? 0}`}
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
        {q && !lesson && (
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>
              {session.task?.kind.case === "diagnostic"
                ? m.questionUpTo(q.index + 1, session.task.kind.value.maxQuestions)
                : m.question(q.index + 1, q.total)}
            </span>
            {q.deadline > 0n && <Countdown deadline={Number(q.deadline)} />}
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
  // When a quiz's time runs out, what is written so far is sent, and the quiz ends.
  const deadline = Number(question.deadline);
  const now = useNow(deadline > 0);
  const timeUp = deadline > 0 && now >= deadline;
  useEffect(() => {
    if (timeUp && !submit.isPending && !submit.isSuccess && !answered) submit.mutate(false);
  }, [timeUp, submit, answered]);

  if (question.intro && !practicing) {
    const intro = question.intro;
    return <IntroView intro={intro} onDone={() => setPracticing(true)} />;
  }
  const spoken = question.problem?.input?.kind;
  if (spoken?.case === "speech") {
    return (
      <div className="space-y-4">
        <Card className="space-y-6">
          {question.lesson && <div className="text-xs font-medium tracking-wide text-muted uppercase">{m.practice}</div>}
          <ProblemPrompt problem={question.problem} answering />
          {pending ? (
            <div className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
              <span className="mr-2 text-muted">{m.weHeard}:</span>“{pending.response}”
            </div>
          ) : (
            <SpeechFlow session={session} question={question} input={spoken.value} onAnswered={onAnswered} />
          )}
        </Card>
        {pending && <FeedbackView feedback={pending.feedback} problem={question.problem} session={session} onContinue={onContinue} />}
      </div>
    );
  }
  if (question.problem?.input?.kind.case === "writing") {
    return (
      <div className="space-y-4">
        {question.passage && <PassageCard passage={question.passage} />}
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
      {question.passage && <PassageCard passage={question.passage} />}
      {reference && <ReferenceCard reference={reference} />}
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
            {question.canReference && !reference && (
              <Button
                variant="ghost"
                onClick={() => look.mutate()}
                disabled={look.isPending}
                title={m.referenceNote(question.referenceCredit)}
              >
                <BookOpen size={16} /> {m.reference}
              </Button>
            )}
          </div>
        )}
        {question.canReference && !reference && !answered && (
          <p className="text-xs text-muted">{m.referenceNote(question.referenceCredit)}</p>
        )}
      </Card>
      {pending && <FeedbackView feedback={pending.feedback} problem={question.problem} session={session} onContinue={onContinue} />}
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
              <Sounds sounds={ex.solutionSounds} />
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

/** PassageCard shows a text to read, under its reading unit's cover; it stays in view while its questions are answered. */
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
        <Sounds sounds={feedback.solutionSounds} className="mt-3" />
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
