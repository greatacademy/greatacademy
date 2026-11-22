import { type Stage, type StepTarget, sameTarget, sessionSteps, stepTargets } from "@ga/design";
import {
  type AnsweredPart,
  type AnsweredQuestion,
  type Feedback,
  type KnowledgePointIntro,
  type ProblemView,
  type Question,
  type Result,
  type ResultItem,
  type Session,
  type Submitted,
  type TopicLink,
  TopicStatus,
} from "@ga/proto/learning/v1/learning_pb";
import {
  cleanup,
  computed,
  type JSX,
  keyboardFrame,
  keymap,
  platform,
  resource,
  Scroll,
  type ScrollRef,
  safeAreaInsets,
  signal,
  Text,
  View,
} from "nsh";
import { AlertDialog, NavPage } from "nsh/base";

import { HEADER_HEIGHT, headerInset } from "../lib/chrome.ts";
import { errorText, m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { learning, timeZone } from "../lib/rpc.ts";
import { Action, Card, colors, ErrorNote, headerStyle, Loaded, Muted, Quiet } from "../lib/ui.tsx";
import { AnswerInput, AnswerText, Prompt } from "./Answer.tsx";
import { Illustration } from "./Illustration.tsx";
import { Listen } from "./Listen.tsx";
import { MathKeyboard, mathKeyboardHeight } from "./MathKeyboard.tsx";
import { FigureView, Rich } from "./Rich.tsx";
import { Sounds } from "./Sounds.tsx";
import { SpeechFlow } from "./Speech.tsx";
import { StepArrow, StepsBar } from "./Steps.tsx";
import { JudgedFeedback, WritingFlow } from "./Writing.tsx";

type Answered = { feedback: Feedback; next: Session; response: string };
type OnAnswered = (feedback: Feedback | undefined, next: Session, response: string) => void;

function taskLabel(session: Session): string {
  switch (session.task?.kind.case) {
    case "lesson":
      return m().lesson;
    case "review":
      return m().review;
    case "reading":
      return m().reading;
    case "quiz":
      return session.task.kind.value.retake ? m().quizRetake : m().quiz;
    case "diagnostic":
      return session.task.kind.value.supplemental ? m().supplemental : m().diagnostic;
    default:
      return m().diagnostic;
  }
}

/** clock formats a number of milliseconds as minutes and seconds. */
function clock(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/** stepLabel names the task and where in it the question asked now is. */
function stepLabel(session: Session, question: Question): string {
  const lesson = question.lesson;
  const task = session.task?.kind;
  const at = lesson
    ? m().step(lesson.knowledgePoint + 1, lesson.knowledgePoints)
    : task?.case === "diagnostic"
      ? m().questionUpTo(question.index + 1, task.value.maxQuestions)
      : m().question(question.index + 1, question.total);
  return `${taskLabel(session)} · ${at}`;
}

/**
 * FocusBar is the player's only chrome: a way out, and the task's steps under it. On a desktop it is the window's
 * title bar's row too, as a page's header is: as tall, dragging the window, and clear of macOS's traffic lights, with
 * the way out at its right and a button as large as the sidebar's, which a pointer needs rather than a finger.
 */
function FocusBar(props: { label: string; onClose: () => void; children?: JSX.Element }) {
  return (
    <View
      desktop={{ windowDrag: true }}
      style={{
        alignItems: "center",
        backgroundColor: colors().page,
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 12,
        ...(platform.desktop
          ? { height: HEADER_HEIGHT, paddingLeft: 12 + headerInset() }
          : { paddingBottom: 6, paddingTop: "calc(env(safe-area-inset-top) + 6)" }),
      }}
    >
      <If when={!platform.desktop}>
        <CloseButton size={44} onPress={props.onClose} />
      </If>
      {/* On a desktop the steps and the words share the row, level with the traffic lights; on a phone the words go under. */}
      <View
        style={
          platform.desktop
            ? { alignItems: "center", alignSelf: "stretch", flex: 1, flexDirection: "row", gap: 12 }
            : { flex: 1, gap: 0, justifyContent: "center" }
        }
      >
        <View style={{ flex: platform.desktop ? 1 : 0 }}>{props.children}</View>
        <Text style={{ color: colors().muted, fontSize: 12, textAlign: platform.desktop ? "right" : "center" }}>{props.label}</Text>
      </View>
      {/* A phone keeps the bar centered; a desktop's button is at the right, away from the window's own close button. */}
      <If when={platform.desktop} else={<View style={{ width: 8 }} />}>
        <CloseButton size={36} onPress={props.onClose} />
      </If>
    </View>
  );
}

/** CloseButton leaves the task: at the bar's left on a phone, at its right on a desktop, where the traffic lights are at the left. */
function CloseButton(props: { size: number; onPress: () => void }) {
  return (
    <View
      role="button"
      accessibilityLabel={m().close}
      onPress={props.onPress}
      hoverStyle={{ backgroundColor: colors().line }}
      style={{ alignItems: "center", borderRadius: 8, height: props.size, justifyContent: "center", width: props.size }}
    >
      <Text style={{ color: colors().muted, fontSize: 22 }}>✕</Text>
    </View>
  );
}

/** BottomBar holds a step's actions at the bottom of the screen, above the keyboard and the home indicator. */
function BottomBar(props: { children: JSX.Element; tone?: "good" | "bad" | undefined }) {
  const insets = safeAreaInsets();
  const background = () => (props.tone === "good" ? colors()["good-soft"] : props.tone === "bad" ? colors()["bad-soft"] : colors().surface);
  return (
    <View
      style={{
        backgroundColor: background(),
        borderColor: props.tone ? background() : colors().line,
        borderTopWidth: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12 + (keyboardFrame().height > 0 || mathKeyboardHeight() > 0 ? 0 : insets().bottom),
      }}
    >
      <View style={{ alignSelf: "center", gap: 10, maxWidth: 720, width: "100%" }}>{props.children}</View>
    </View>
  );
}

/** AnswerActions are the actions under an answer, as on the web: as wide as their labels, the main one first. */
function AnswerActions(props: {
  main: { label: string; onPress: () => void };
  quiet?: { label: string; onPress: () => void } | undefined;
  disabled?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      <View style={{ minWidth: 96 }}>
        <Action label={props.main.label} disabled={props.disabled} onPress={props.main.onPress} />
      </View>
      <If when={props.quiet}>{(quiet) => <Quiet label={quiet().label} disabled={props.disabled} onPress={quiet().onPress} />}</If>
    </View>
  );
}

/** Buttons lays a secondary and a main action side by side, the main one wider. */
function Buttons(props: {
  quiet?: { label: string; onPress: () => void };
  main: { label: string; onPress: () => void };
  disabled?: boolean;
  mainDisabled?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      <If when={props.quiet}>
        {(quiet) => (
          <View style={{ flex: 1 }}>
            <Quiet label={quiet().label} disabled={props.disabled} onPress={quiet().onPress} />
          </View>
        )}
      </If>
      <View style={{ flex: 2 }}>
        <Action label={props.main.label} disabled={props.disabled || props.mainDisabled} onPress={props.main.onPress} />
      </View>
    </View>
  );
}

/** Body is the scrolling content of a step, as wide as reads well. */
function Body(props: { children: JSX.Element; ref?: (scroll: ScrollRef) => void }) {
  return (
    <Scroll ref={props.ref} style={{ flex: 1 }} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
      <View style={{ alignSelf: "center", gap: 16, maxWidth: 720, padding: 16, paddingBottom: 32, width: "100%" }}>{props.children}</View>
    </Scroll>
  );
}

/** reachedIntros lists the lessons of the knowledge points reached: the trail's, and the one asked now where the trail has not it yet. */
function reachedIntros(session: Session, question: Question): KnowledgePointIntro[] {
  const intros = session.trail?.intros ?? [];
  const now = question.intro;
  return now && !intros.some((i) => i.index === now.index) ? [...intros, now] : intros;
}

/** introOf finds the lesson of a knowledge point reached, from the trail or the question asked now. */
function introOf(session: Session, question: Question, knowledgePoint: number): KnowledgePointIntro | undefined {
  return (
    session.trail?.intros.find((i) => i.index === knowledgePoint) ?? (question.intro?.index === knowledgePoint ? question.intro : undefined)
  );
}

/** IntroCard, after the topic's introduction for the first knowledge point, is a knowledge point's explanation and its drawings. */
function IntroCard(props: { intro: KnowledgePointIntro }) {
  return (
    <View style={{ gap: 16 }}>
      <TopicIntro intro={props.intro} />
      <Card>
        <Rich source={tx(props.intro.title)} inline fontSize={18} bold />
        <Rich source={tx(props.intro.explanation)} figures={props.intro.figures} />
        <If when={props.intro.figure}>{(figure) => <FigureView figure={figure()} caption />}</If>
      </Card>
    </View>
  );
}

/** TopicIntro is the introduction of a topic, which comes before its first knowledge point, or nothing. */
function TopicIntro(props: { intro: KnowledgePointIntro }) {
  return (
    <If when={props.intro.topicIntro}>
      {(intro) => (
        <Card>
          <Text style={{ color: colors().muted, fontSize: 14, fontWeight: "600" }}>{m().topicIntro}</Text>
          <Rich source={tx(intro())} figures={props.intro.topicIntroFigures} />
        </Card>
      )}
    </If>
  );
}

/** ExampleCard is a knowledge point's worked example, its solution shown in full. */
function ExampleCard(props: { intro: KnowledgePointIntro }) {
  return (
    <If when={props.intro.example}>
      {(worked) => (
        <Card tone="accent">
          <Text style={{ color: colors().accent, fontSize: 14, fontWeight: "600" }}>{m().workedExample}</Text>
          <If when={worked().problem?.scenario}>{(scenario) => <Rich source={tx(scenario())} />}</If>
          <If when={worked().problem}>{(problem) => <Prompt problem={problem()} apart={!!problem().scenario} />}</If>
          <View style={{ borderColor: colors().line, borderTopWidth: 1, gap: 8, paddingTop: 12 }}>
            <Muted>{m().solution}</Muted>
            <Rich source={tx(worked().solution)} figures={worked().solutionFigures} />
            <If when={worked().solutionFigure}>{(figure) => <FigureView figure={figure()} />}</If>
            <Sounds sounds={worked().solutionSounds} />
            <Muted>{m().answer}</Muted>
            <If when={worked().problem}>{(problem) => <AnswerText problem={problem()} answer={worked().answer} />}</If>
          </View>
        </Card>
      )}
    </If>
  );
}

/** ScenarioCard keeps a multistep problem's scenario in view above its parts, folded away on a tap. */
function ScenarioCard(props: { scenario: NonNullable<ProblemView["scenario"]> }) {
  const open = signal(true);
  return (
    <View style={{ alignSelf: "center", maxWidth: 720, paddingHorizontal: 16, paddingTop: 4, width: "100%" }}>
      <View
        style={{ backgroundColor: colors().surface, borderColor: colors().line, borderRadius: 12, borderWidth: 1, gap: 6, padding: 12 }}
      >
        <View
          role="button"
          accessibilityLabel={m().scenario}
          accessibilityState={{ expanded: open() }}
          onPress={() => open.set(!open())}
          style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text style={{ color: colors().muted, fontSize: 13, fontWeight: "600" }}>{m().scenario}</Text>
          <Text style={{ color: colors().muted, fontSize: 14 }}>{open() ? "▾" : "▸"}</Text>
        </View>
        <If when={open()}>
          <Scroll style={{ maxHeight: 220 }}>
            <Rich source={tx(props.scenario)} />
          </Scroll>
        </If>
      </View>
    </View>
  );
}

/** Mark is the ✓ or ✗ of a verdict. */
function Mark(props: { correct: boolean; size?: number }) {
  const size = props.size ?? 22;
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: props.correct ? colors().good : colors().bad,
        borderRadius: size / 2,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      <Text style={{ color: colors().page, fontSize: size * 0.55, fontWeight: "700" }}>{props.correct ? "✓" : "✗"}</Text>
    </View>
  );
}

/** EarlierParts lists the parts of a multistep problem answered before the one asked now, each with its answer. */
function EarlierParts(props: { parts: readonly AnsweredPart[] }) {
  return (
    <If when={props.parts.length > 0}>
      <Card>
        <Muted>{m().answeredParts}</Muted>
        <Each of={[...props.parts.entries()]}>
          {(entry) => {
            const [i, part] = entry();
            return (
              <View style={{ alignItems: "flex-start", flexDirection: "row", gap: 10 }}>
                <Text style={{ color: colors().muted, fontWeight: "600" }}>{`${i + 1}.`}</Text>
                <View style={{ flex: 1, gap: 4 }}>
                  <Rich source={tx(part.problem?.ask ?? part.problem?.prompt)} />
                  <If when={part.problem}>
                    {(problem) => (
                      <View style={{ alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                        <Muted>{`${m().yourAnswer}:`}</Muted>
                        <AnswerText problem={problem()} answer={part.response} />
                      </View>
                    )}
                  </If>
                </View>
                <If when={part.feedback}>{(feedback) => <Mark correct={feedback().correct} size={20} />}</If>
              </View>
            );
          }}
        </Each>
      </Card>
    </If>
  );
}

/** VerdictBody is the verdict on an answer: right or wrong, the message, the right answer and the solution, open after a wrong answer. */
function VerdictBody(props: { feedback: Feedback; problem?: ProblemView | undefined }) {
  const feedback = props.feedback;
  const judged = feedback.criteria.length > 0;
  const open = signal(!feedback.correct || judged);
  const solved = !!tx(feedback.solution) || !!feedback.solutionFigure || feedback.solutionSounds.length > 0;
  return (
    <View style={{ gap: 10 }}>
      <View role="alert" style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
        <Mark correct={feedback.correct} size={28} />
        <Text style={{ color: feedback.correct ? colors().good : colors().bad, flex: 1, fontSize: 18, fontWeight: "700" }}>
          {feedback.correct ? m().correct : m().incorrect}
        </Text>
      </View>
      <If when={feedback.message}>{(message) => <Rich source={tx(message())} />}</If>
      <If when={judged}>
        <JudgedFeedback feedback={feedback} />
      </If>
      <If when={!feedback.correct && !judged ? props.problem : undefined}>
        {(problem) => (
          <View style={{ gap: 4 }}>
            <Muted>{m().correctAnswer}</Muted>
            <AnswerText problem={problem()} answer={feedback.answer} />
          </View>
        )}
      </If>
      <If when={solved}>
        <If when={open()} else={<Quiet label={m().showSolution} onPress={() => open.set(true)} />}>
          <View style={{ gap: 8 }}>
            <Muted>{judged ? m().modelAnswer : m().solution}</Muted>
            <Rich source={tx(feedback.solution)} figures={feedback.solutionFigures} />
            <If when={feedback.solutionFigure}>{(figure) => <FigureView figure={figure()} />}</If>
            <Sounds sounds={feedback.solutionSounds} />
          </View>
        </If>
      </If>
    </View>
  );
}

const toneOf = (feedback: Feedback | undefined) => (!feedback ? undefined : feedback.correct ? ("good" as const) : ("bad" as const));

/** AnsweredView shows a question answered earlier, read only: each part with the answer given and its verdict. */
function AnsweredView(props: { answered: AnsweredQuestion }) {
  const parts = props.answered.parts;
  const first = parts[0]?.problem;
  const multistep = parts.length > 1 || (first?.parts ?? 0) > 1;
  return (
    <Card tone={toneOf(parts.at(-1)?.feedback)}>
      <If when={props.answered.referenced}>
        <Text style={{ color: colors().warn, fontSize: 13, fontWeight: "600" }}>{m().reference}</Text>
      </If>
      <If when={multistep ? first?.scenario : undefined}>{(scenario) => <Rich source={tx(scenario())} />}</If>
      <Each of={[...parts.entries()]}>
        {(entry) => {
          const [i, part] = entry();
          return (
            <View style={{ borderColor: colors().line, borderTopWidth: i > 0 ? 1 : 0, gap: 12, paddingTop: i > 0 ? 12 : 0 }}>
              <If when={part.problem}>
                {(problem) => (
                  <View style={{ gap: 12 }}>
                    <Prompt problem={problem()} apart={multistep} />
                    <If
                      when={problem().input?.kind.case === "choice"}
                      else={
                        <View style={{ gap: 4 }}>
                          <Muted>{m().yourAnswer}</Muted>
                          <AnswerText problem={problem()} answer={part.response} />
                        </View>
                      }
                    >
                      <AnswerInput
                        problem={problem()}
                        value={part.response}
                        onChange={() => {}}
                        onSubmit={() => {}}
                        disabled
                        feedback={part.feedback}
                      />
                    </If>
                  </View>
                )}
              </If>
              <If when={part.feedback}>{(feedback) => <VerdictBody feedback={feedback()} problem={part.problem} />}</If>
            </View>
          );
        }}
      </Each>
    </Card>
  );
}

/** LookBack shows a step gone through, read only, with the way back to the step now. */
function LookBack(props: { session: Session; question: Question; target: StepTarget; onBack: () => void }) {
  const target = props.target;
  const seen =
    target.kind === "intro" || target.kind === "example" ? introOf(props.session, props.question, target.knowledgePoint) : undefined;
  const answered = target.kind === "answered" ? props.session.trail?.answered.find((a) => a.index === target.index) : undefined;
  return (
    <>
      <Body>
        <View style={{ backgroundColor: colors().surface, borderColor: colors().line, borderRadius: 10, borderWidth: 1, padding: 10 }}>
          <Muted>{target.kind === "answered" ? m().lookingBack : target.kind === "example" ? m().workedExample : m().stepIntro}</Muted>
        </View>
        <If when={seen}>{(intro) => (target.kind === "intro" ? <IntroCard intro={intro()} /> : <ExampleCard intro={intro()} />)}</If>
        <If when={answered}>{(shown) => <AnsweredView answered={shown()} />}</If>
      </Body>
      <BottomBar>
        <Action label={m().backToCurrent} onPress={props.onBack} />
      </BottomBar>
    </>
  );
}

/**
 * StepsFlow is a session answered a question at a time, under its bar of steps, as on the web: a lesson's knowledge
 * point opens with its explanation and worked example, one step each, and the steps gone through may be looked at
 * again, read only, with the bar, its arrows or ← and →, while the step now keeps what was written.
 */
function StepsFlow(props: {
  session: Session;
  question: Question;
  answered: () => Answered | undefined;
  onAnswered: OnAnswered;
  onContinue: () => void;
  onClose: () => void;
}) {
  const { session, question } = props;
  const lesson = question.lesson;
  const intro = question.intro && question.earlier.length === 0 && !question.judging ? question.intro : undefined;
  const stage = signal<Stage>(intro ? "intro" : "question");
  const viewing = signal<StepTarget | undefined>(undefined);
  const task = session.task?.kind;
  const parts = (question.problem?.parts ?? 0) > 1 ? (question.problem?.parts ?? 1) : 1;
  const groups = computed(() => {
    const pending = props.answered();
    return sessionSteps({
      kind: task?.case ?? "diagnostic",
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
      intros: reachedIntros(session, question).map((i) => ({ knowledgePoint: i.index, example: !!i.example })),
      stage: stage(),
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
  });
  const live = computed((): StepTarget => {
    const now = stage();
    return now === "question" || !lesson ? { kind: "current" } : { kind: now, knowledgePoint: lesson.knowledgePoint };
  });
  const looking = computed(() => viewing() ?? live());
  const targets = computed(() => stepTargets(groups()));
  const at = computed(() => targets().findIndex((t) => sameTarget(t, looking())));
  const open = (t: StepTarget | undefined) => {
    if (t) viewing.set(sameTarget(t, live()) ? undefined : t);
  };
  const previous = () => (at() > 0 ? open(targets()[at() - 1]) : undefined);
  const next = () => (at() >= 0 && at() < targets().length - 1 ? open(targets()[at() + 1]) : undefined);
  keymap.bind("left", previous, { when: "notEditing" });
  keymap.bind("right", next, { when: "notEditing" });
  const advance = () => {
    const now = stage();
    if (now === "intro") stage.set(intro?.example ? "example" : "question");
    else if (now === "example") stage.set("question");
  };
  // Return moves on on a keyboard, as the main button does: an input in focus submits by itself.
  let answer: (() => void) | undefined;
  keymap.bind(
    "enter",
    () => {
      if (viewing()) viewing.set(undefined);
      else if (stage() !== "question") advance();
      else answer?.();
    },
    { when: "notEditing" },
  );
  return (
    <>
      <FocusBar label={stepLabel(session, question)} onClose={props.onClose}>
        <StepsBar
          groups={groups()}
          looking={looking()}
          onOpen={open}
          onPrevious={at() > 0 ? previous : undefined}
          onNext={at() >= 0 && at() < targets().length - 1 ? next : undefined}
        />
      </FocusBar>
      {/* A step looked back at replaces the view, keyed so that each opens afresh. */}
      <Each of={viewing() ? [viewing() as StepTarget] : []} key={(t) => JSON.stringify(t)}>
        {(target) => <LookBack session={session} question={question} target={target()} onBack={() => viewing.set(undefined)} />}
      </Each>
      {/* The step now stays as it was, hidden, while another is looked at. */}
      <View style={{ display: viewing() ? "none" : "flex", flex: 1 }}>
        <If when={intro && stage() === "intro" ? intro : undefined}>
          {(shown) => (
            <>
              <Body>
                <IntroCard intro={shown()} />
              </Body>
              <BottomBar>
                <Action label={shown().example ? m().next : m().gotIt} onPress={advance} />
              </BottomBar>
            </>
          )}
        </If>
        <If when={intro?.example && stage() === "example" ? intro : undefined}>
          {(shown) => (
            <>
              <Body>
                <ExampleCard intro={shown()} />
              </Body>
              <BottomBar>
                <Action label={m().gotIt} onPress={advance} />
              </BottomBar>
            </>
          )}
        </If>
        <If when={stage() === "question"}>
          <QuestionFlow
            session={session}
            question={question}
            answered={props.answered}
            onAnswered={props.onAnswered}
            onContinue={props.onContinue}
            paused={() => !!viewing()}
            onEnter={(run) => {
              answer = run;
            }}
          />
        </If>
      </View>
    </>
  );
}

/** ReferenceAsk is the "?" of a review question: it says what looking at the lesson costs, and opens it on request. */
function ReferenceAsk(props: { asking: boolean; onToggle: () => void }) {
  return (
    <View
      role="button"
      accessibilityLabel={m().reference}
      accessibilityState={{ expanded: props.asking }}
      onPress={props.onToggle}
      hoverStyle={{ borderColor: colors().warn }}
      style={{
        alignItems: "center",
        borderColor: props.asking ? colors().warn : colors().line,
        borderRadius: 16,
        borderWidth: 1,
        height: 32,
        justifyContent: "center",
        width: 32,
      }}
    >
      <Text style={{ color: props.asking ? colors().warn : colors().muted, fontSize: 16, fontWeight: "700" }}>?</Text>
    </View>
  );
}

function QuestionFlow(props: {
  session: Session;
  question: Question;
  answered: () => Answered | undefined;
  onAnswered: OnAnswered;
  onContinue: () => void;
  /** paused is true while another step is looked at: the answer then takes no keys. */
  paused: () => boolean;
  /** onEnter hands the flow's way on by Return, to the flow of steps, which binds the key. */
  onEnter: (run: () => void) => void;
}) {
  const question = props.question;
  const problem = question.problem;
  const kind = problem?.input?.kind;
  const writing = kind?.case === "writing";
  const speech = kind?.case === "speech" ? kind.value : undefined;
  const scenario = (problem?.parts ?? 0) > 1 ? problem?.scenario : undefined;
  const response = signal("");
  const busy = signal(false);
  const error = signal("");
  const asking = signal(false);
  // A review may show the lesson of the step asked; the server marks the question, which then earns part of the credit.
  const reference = signal(question.reference);
  const look = async () => {
    if (busy()) return;
    busy.set(true);
    error.set("");
    try {
      const result = await learning.openReference({ sessionId: props.session.id, index: question.index });
      const step = result.session?.step;
      if (step?.case === "question") reference.set(step.value.reference);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  let scroll: ScrollRef | undefined;
  // Far enough down to show what was added below, the verdict or the math keyboard; the view stops at the end.
  const toEnd = () => setTimeout(() => scroll?.scrollTo({ y: 100_000, animated: true }), 50);
  const answered: OnAnswered = (feedback, next, given) => {
    props.onAnswered(feedback, next, given);
    if (feedback) toEnd();
  };
  // timeUp sends what is written when a quiz's time runs out, even nothing, and the quiz ends.
  const send = async (skip: boolean, timeUp = false) => {
    if (writing || speech || busy() || props.answered() || (!skip && !timeUp && response().trim() === "")) return;
    busy.set(true);
    error.set("");
    try {
      const result = await learning.submitAnswer({
        sessionId: props.session.id,
        index: question.index,
        response: skip ? "" : response(),
        skip,
      });
      if (result.session) answered(result.feedback, result.session, skip ? "" : response());
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  const deadline = Number(question.deadline);
  if (deadline > 0) {
    const timer = setTimeout(() => void send(false, true), Math.max(0, deadline - Date.now()));
    cleanup(() => clearTimeout(timer));
  }
  props.onEnter(() => {
    if (props.answered()) props.onContinue();
    else void send(false);
  });
  return (
    <>
      <If when={scenario}>{(shown) => <ScenarioCard scenario={shown()} />}</If>
      <Body ref={(node) => (scroll = node)}>
        <If when={question.passage}>
          {(passage) => (
            <Card>
              <Illustration path={passage().illustration} />
              <If when={passage().audio}>{(path) => <Listen path={path()} accent={tx(passage().accent)} />}</If>
              <Text style={{ color: colors().ink, fontSize: 18, lineHeight: 28 }}>{passage().body}</Text>
            </Card>
          )}
        </If>
        <EarlierParts parts={question.earlier} />
        <If when={reference()}>
          {(shown) => (
            <Card tone="warn">
              <Text style={{ color: colors().warn, fontSize: 13, fontWeight: "600" }}>{m().reference}</Text>
              <Rich source={tx(shown().title)} inline bold />
              <Rich source={tx(shown().explanation)} figures={shown().figures} />
              <If when={shown().figure}>{(drawn) => <FigureView figure={drawn()} />}</If>
            </Card>
          )}
        </If>
        {/* The question's card holds the answer and, once given, its verdict, as on the web. */}
        <Card tone={toneOf(props.answered()?.feedback)}>
          <View style={{ alignItems: "flex-start", flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, gap: 8 }}>
              <If when={question.lesson}>
                <Muted>{m().practice}</Muted>
              </If>
              <If when={problem}>{(shown) => <Prompt problem={shown()} answering apart={!!scenario} />}</If>
            </View>
            <If when={question.canReference && !reference() && !props.answered()}>
              <ReferenceAsk asking={asking()} onToggle={() => asking.set(!asking())} />
            </If>
          </View>
          <If when={asking() && question.canReference && !reference() && !props.answered()}>
            <View style={{ backgroundColor: colors()["warn-soft"], borderRadius: 8, gap: 8, padding: 12 }}>
              <Muted>{m().referenceNote(question.referenceCredit)}</Muted>
              <Quiet label={m().reference} disabled={busy()} onPress={() => void look()} />
            </View>
          </If>
          <If when={speech && !props.answered() ? speech : undefined}>
            {(input) => <SpeechFlow session={props.session} question={question} input={input()} onAnswered={answered} />}
          </If>
          <If when={problem && ((!writing && !speech) || props.answered()) ? problem : undefined}>
            {(shown) => (
              <AnswerInput
                problem={shown()}
                value={props.answered()?.response ?? response()}
                onChange={(value) => response.set(value)}
                onSubmit={() => void send(false)}
                onKeyboard={(height) => height > 0 && toEnd()}
                disabled={busy() || !!props.answered() || props.paused()}
                feedback={props.answered()?.feedback}
              />
            )}
          </If>
          <If when={error()}>
            <ErrorNote message={error()} />
          </If>
          <If when={!props.answered() && !writing && !speech}>
            <AnswerActions
              main={{ label: m().submit, onPress: () => void send(false) }}
              quiet={question.canSkip ? { label: m().dontKnow, onPress: () => void send(true) } : undefined}
              disabled={busy()}
            />
          </If>
          <If when={props.answered()}>
            {(shown) => (
              <View style={{ borderColor: colors().line, borderTopWidth: 1, paddingTop: 12 }}>
                <VerdictBody feedback={shown().feedback} problem={problem} />
              </View>
            )}
          </If>
        </Card>
        <If when={writing && !props.answered()}>
          <WritingFlow session={props.session} question={question} onAnswered={answered} />
        </If>
      </Body>
      {/* The way on stays at the bottom, in the verdict's color, where a thumb finds it. */}
      <If when={props.answered()}>
        {(shown) => (
          <BottomBar tone={toneOf(shown().feedback)}>
            <Action label={m().next} onPress={props.onContinue} />
          </BottomBar>
        )}
      </If>
    </>
  );
}

/**
 * QuizFlow is a quiz as an exam, as on the web: a numbered sheet of its questions, any of which may be opened and
 * answered or its answer changed, the time left and the count answered; nothing is judged until it is handed in, or
 * the time runs out.
 */
function QuizFlow(props: { session: Session; question: Question; onSession: (next: Session) => void; onClose: () => void }) {
  const { session, question } = props;
  const slots = question.sheet?.slots ?? [];
  const here = slots[question.index];
  const final = !!here?.locked && !!here.answered;
  const response = signal(question.saved);
  const busy = signal(false);
  const error = signal("");
  let handedIn = false;
  const problem = question.problem;
  const parts = problem?.parts ?? 0;
  const partBefore = parts > 1 && (problem?.part ?? 0) < parts;
  const scenario = parts > 1 ? problem?.scenario : undefined;
  const dirty = () => !final && response().trim() !== "" && response() !== question.saved;
  const go = async (to: number | "stay" | "finish") => {
    if (busy() || handedIn) return;
    busy.set(true);
    error.set("");
    try {
      let next: Session | undefined = session;
      if (dirty()) {
        const open = typeof to === "number" && !partBefore ? to : undefined;
        next = (await learning.submitAnswer({ sessionId: session.id, index: question.index, response: response(), skip: false, open }))
          .session;
      }
      const step = next?.step;
      if (step?.case === "question" && typeof to === "number" && step.value.index !== to)
        next = (await learning.openQuestion({ sessionId: session.id, index: to })).session;
      if (to === "finish" && next?.step.case === "question") next = (await learning.finishQuiz({ sessionId: session.id })).session;
      if (to === "finish") handedIn = true;
      if (next) props.onSession(next);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  const count = slots.length;
  const answeredCount = () => slots.filter((s) => s.answered).length + (dirty() && !here?.answered ? 1 : 0);
  const onward = (() => {
    if (question.index + 1 < count) return question.index + 1;
    const open = slots.findIndex((s, i) => !s.answered && i !== question.index);
    return open >= 0 ? open : undefined;
  })();
  const save = () => void (partBefore ? go("stay") : onward !== undefined ? go(onward) : go("stay"));
  const previous = question.index > 0 ? () => void go(question.index - 1) : undefined;
  const next = question.index + 1 < count ? () => void go(question.index + 1) : undefined;
  keymap.bind("left", () => previous?.(), { when: "notEditing" });
  keymap.bind("right", () => next?.(), { when: "notEditing" });
  keymap.bind("enter", save, { when: "notEditing" });
  // The clock ticks every second; when the time runs out, what is written is saved and the quiz handed in.
  const deadline = Number(question.deadline);
  const now = signal(Date.now());
  if (deadline > 0) {
    const ticker = setInterval(() => now.set(Date.now()), 1000);
    const timer = setTimeout(() => void go("finish"), Math.max(0, deadline - Date.now()));
    cleanup(() => {
      clearInterval(ticker);
      clearTimeout(timer);
    });
  }
  const timeUp = () => deadline > 0 && now() >= deadline;
  const handIn = async () => {
    const unanswered = count - answeredCount();
    const left = deadline > 0 ? deadline - Date.now() : 0;
    const { action } = await AlertDialog.show({
      title: m().handInTitle,
      description: [
        unanswered > 0 ? m().handInUnanswered(unanswered) : m().handInAllAnswered,
        left > 0 ? m().handInTimeLeft(clock(left)) : "",
      ]
        .filter(Boolean)
        .join("\n"),
      actions: [
        { id: "stay", label: m().keepWorking, role: "cancel" },
        { id: "hand-in", label: m().handIn },
      ],
    });
    if (action === "hand-in") void go("finish");
  };
  return (
    <>
      <FocusBar label={taskLabel(session)} onClose={props.onClose}>
        <View
          role="progressbar"
          accessibilityLabel={m().quizAnswered(answeredCount(), count)}
          accessibilityValue={{ min: 0, max: count, now: answeredCount() }}
          style={{ backgroundColor: colors().line, borderRadius: 4, height: 8, marginVertical: 6, overflow: "hidden" }}
        >
          <View
            style={{
              backgroundColor: colors().accent,
              borderRadius: 4,
              height: 8,
              width: `${count > 0 ? Math.round((answeredCount() / count) * 100) : 0}%`,
            }}
          />
        </View>
      </FocusBar>
      <If when={scenario}>{(shown) => <ScenarioCard scenario={shown()} />}</If>
      <Body>
        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>{m().quizAnswered(answeredCount(), count)}</Text>
          <If when={deadline > 0}>
            <Text
              role="timer"
              style={{
                color: deadline - now() < 60_000 ? colors().bad : colors().muted,
                fontSize: 15,
                fontVariant: ["tabular-nums"],
                fontWeight: "600",
              }}
            >
              {deadline > now() ? m().timeLeft(clock(deadline - now())) : m().timeUp}
            </Text>
          </If>
        </View>
        <View role="navigation" accessibilityLabel={m().quizNavigator} style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
          <StepArrow glyph="‹" label={m().previousStep} onPress={busy() ? undefined : previous} />
          <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            <Each of={[...slots.entries()]}>
              {(entry) => {
                const [i, slot] = entry();
                const current = i === question.index;
                const done = () => slot.answered || (current && dirty());
                return (
                  <View
                    role="button"
                    accessibilityLabel={m().quizSlot(i + 1, done())}
                    accessibilityState={{ current: current ? "step" : false, disabled: busy() }}
                    onPress={() => !current && void go(i)}
                    style={{
                      alignItems: "center",
                      backgroundColor: current ? colors().accent : done() ? colors()["accent-soft"] : colors().surface,
                      borderColor: current || done() ? colors().accent : colors().line,
                      borderRadius: 10,
                      borderWidth: 2,
                      height: 40,
                      justifyContent: "center",
                      width: 40,
                    }}
                  >
                    <Text
                      style={{
                        color: current ? colors()["on-accent"] : done() ? colors().accent : colors().muted,
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {String(i + 1)}
                    </Text>
                  </View>
                );
              }}
            </Each>
          </View>
          <StepArrow glyph="›" label={m().nextStep} onPress={busy() ? undefined : next} />
        </View>
        <Text style={{ color: colors().muted, fontSize: 13, textAlign: "center" }}>{m().quizNoFeedback}</Text>
        <EarlierParts parts={question.earlier} />
        <Card>
          <Muted>{m().stepQuestion(question.index + 1)}</Muted>
          <If when={problem}>
            {(shown) => (
              <View style={{ gap: 16 }}>
                <Prompt problem={shown()} answering apart={!!scenario} />
                <AnswerInput
                  problem={shown()}
                  value={response()}
                  onChange={(value) => response.set(value)}
                  onSubmit={save}
                  disabled={final || busy() || timeUp()}
                />
              </View>
            )}
          </If>
          <If when={final}>
            <Muted>{m().answerFinal}</Muted>
          </If>
          <If when={error()}>
            <ErrorNote message={error()} />
          </If>
        </Card>
      </Body>
      <BottomBar>
        <Buttons
          quiet={{ label: m().handIn, onPress: () => void handIn() }}
          main={{ label: partBefore || onward === undefined ? m().saveAnswer : m().saveAndNext, onPress: save }}
          disabled={busy() || timeUp()}
          mainDisabled={!dirty() && (partBefore || onward === undefined)}
        />
      </BottomBar>
    </>
  );
}

function ResultItemCard(props: { item: ResultItem; at: number }) {
  const open = signal(!props.item.correct);
  return (
    <Card>
      <View role="button" onPress={() => open.set(!open())} style={{ flexDirection: "row", gap: 8, justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Muted>{`${props.at + 1}. ${tx(props.item.title)}`}</Muted>
          <If when={props.item.knowledgePointTitle}>{(kp) => <Muted>{`${props.item.knowledgePoint + 1}. ${tx(kp())}`}</Muted>}</If>
        </View>
        <If when={props.item.late}>
          <Text style={{ color: colors().warn, fontSize: 13, fontWeight: "600" }}>{m().late}</Text>
        </If>
        <If when={props.item.elapsedMs > 0n}>
          <Muted>{m().elapsed(Number(props.item.elapsedMs))}</Muted>
        </If>
        <Text style={{ color: props.item.correct ? colors().good : colors().bad, fontWeight: "700" }}>
          {props.item.correct ? "✓" : "✗"}
        </Text>
      </View>
      <If when={open() ? props.item.problem : undefined}>
        {(problem) => (
          <View style={{ gap: 8 }}>
            <Prompt problem={problem()} />
            <Muted>{m().yourAnswer}</Muted>
            <AnswerText problem={problem()} answer={props.item.response} />
            <If when={!props.item.correct}>
              <Muted>{m().correctAnswer}</Muted>
              <AnswerText problem={problem()} answer={props.item.answer} />
              <Muted>{m().solution}</Muted>
              <Rich source={tx(props.item.solution)} figures={props.item.solutionFigures} />
              <If when={props.item.solutionFigure}>{(figure) => <FigureView figure={figure()} />}</If>
              <Sounds sounds={props.item.solutionSounds} />
            </If>
          </View>
        )}
      </If>
    </Card>
  );
}

/** TopicLinks lists topics, each marked known (learned or assumed) or not. */
function TopicLinks(props: { links: readonly TopicLink[] }) {
  const known = (l: TopicLink) => l.status === TopicStatus.LEARNED || l.status === TopicStatus.ASSUMED || l.status === TopicStatus.DUE;
  return (
    <View style={{ gap: 4 }}>
      <Each of={[...props.links]}>
        {(l) => (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ color: known(l()) ? colors().good : colors().muted, fontWeight: "700" }}>{known(l()) ? "✓" : "○"}</Text>
            <Text style={{ color: colors().ink, flex: 1 }}>{tx(l().title)}</Text>
          </View>
        )}
      </Each>
    </View>
  );
}

/** ESSAY_POLL_MS is how often a submitted essay's page asks for its verdict, and ESSAY_WAIT_MS how long it keeps asking. */
const ESSAY_POLL_MS = 5_000;
const ESSAY_WAIT_MS = 10 * 60_000;

/**
 * SubmittedView shows an essay handed in and waiting for its verdict, as on the
 * web: while the screen stays open it asks every few seconds; the verdict also
 * appears on Learn, so the learner may leave.
 */
function SubmittedView(props: { session: Session; submitted: Submitted; onJudged: (next: Session) => void }) {
  const since = Date.now();
  const waiting = signal(!props.submitted.failed);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let gone = false;
  cleanup(() => {
    gone = true;
    clearTimeout(timer);
  });
  const poll = async () => {
    if (gone) return;
    try {
      const res = await learning.getJudgment({ sessionId: props.session.id, index: 0 });
      if (gone) return;
      if (!res.pending && res.session) {
        waiting.set(false);
        props.onJudged(res.session);
        return;
      }
    } catch {
      // The verdict is asked for again; it is also kept for the Learn tab.
    }
    if (Date.now() - since < ESSAY_WAIT_MS) timer = setTimeout(() => void poll(), ESSAY_POLL_MS);
    else waiting.set(false);
  };
  if (waiting()) timer = setTimeout(() => void poll(), 0);
  return (
    <>
      <Body>
        <Card>
          <Text style={{ color: colors().ink, fontSize: 22, fontWeight: "700" }}>{m().essaySubmittedTitle}</Text>
          <Muted>{props.submitted.failed ? m().essayFailed : m().essaySubmitted}</Muted>
          <If when={waiting()}>
            <Muted>{m().judging}</Muted>
          </If>
        </Card>
        <Card>
          <Text style={{ color: colors().ink, fontSize: 16, lineHeight: 24 }}>{props.submitted.response}</Text>
        </Card>
      </Body>
      <BottomBar>
        <Action label={m().backToDashboard} onPress={() => nav.pop()} />
      </BottomBar>
    </>
  );
}

/** EssayVerdict shows the verdict on an essay with the text it judged and a model essay. */
function EssayVerdict(props: { feedback: Feedback; item: ResultItem }) {
  const shown = signal(false);
  return (
    <>
      <If when={props.item.problem}>
        {(problem) => (
          <Card>
            <Prompt problem={problem()} />
          </Card>
        )}
      </If>
      <Card>
        <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "700" }}>{m().essayVerdict}</Text>
        <Text style={{ color: colors().ink, fontSize: 16, lineHeight: 24 }}>{props.item.response}</Text>
        <JudgedFeedback feedback={props.feedback} />
        <If when={props.feedback.answer}>
          <If when={shown()} else={<Quiet label={m().modelAnswer} onPress={() => shown.set(true)} />}>
            <Muted>{m().modelAnswer}</Muted>
            <Text style={{ color: colors().ink, fontSize: 16, lineHeight: 24 }}>{props.feedback.answer}</Text>
          </If>
        </If>
      </Card>
    </>
  );
}

function ResultView(props: { session: Session; result: Result }) {
  const { result } = props;
  const kind = props.session.task?.kind.case;
  const task = props.session.task?.kind;
  // A quiz with misses, not a retake, is followed by their reviews.
  const quizMissed = task?.case === "quiz" && !task.value.retake && result.correct < result.asked + result.unanswered;
  const busy = signal(false);
  const error = signal("");
  const headline =
    kind === "diagnostic"
      ? m().placedResult(result.placed)
      : kind === "lesson" && result.passed
        ? m().lessonPassed
        : result.passed
          ? m().passed
          : m().failed;
  // The wrong answers first, open, since they are what is worth a second look.
  const items = [...result.items.entries()].sort(([, a], [, b]) => Number(a.correct) - Number(b.correct));
  const next = async () => {
    busy.set(true);
    error.set("");
    try {
      const courseId = props.session.courseId;
      const dash = await learning.getDashboard({ courseId, timeZone: timeZone() });
      if (dash.active) {
        nav.replace({ name: "session", sessionId: dash.active.id });
        return;
      }
      const task = dash.tasks[0];
      if (!task) {
        error.set(m().nothingToDo);
        return;
      }
      const { session } = await learning.startTask({ courseId, task, timeZone: timeZone() });
      if (session) nav.replace({ name: "session", sessionId: session.id });
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  keymap.bind("enter", () => void next(), { when: "notEditing" });
  return (
    <>
      <Body>
        <Card>
          <Text style={{ color: colors().ink, fontSize: 22, fontWeight: "700" }}>{headline}</Text>
          <If when={kind !== "diagnostic"}>
            <Text style={{ color: colors().muted, fontSize: 16 }}>{m().score(result.correct, result.asked + result.unanswered)}</Text>
          </If>
          <If when={result.xp > 0}>
            <Text style={{ color: colors().accent, fontSize: 28, fontWeight: "700" }}>{m().earned(result.xp)}</Text>
            <If when={result.fullXp > 0}>
              <Muted>{result.xp > result.fullXp ? m().perfectBonus : m().earnedOf(result.xp, result.fullXp)}</Muted>
            </If>
          </If>
          <If when={result.xp < 0}>
            <Text style={{ color: colors().bad, fontSize: 28, fontWeight: "700" }}>{m().lostXp(result.xp)}</Text>
          </If>
          <If when={result.blownOff}>
            <Text style={{ color: colors().warn, fontWeight: "600" }}>{m().blownOffTitle}</Text>
            <Muted>{result.xp < 0 ? m().blownOffLost : m().blownOffWarn}</Muted>
          </If>
          <If when={kind === "lesson" && !result.passed && !result.blownOff}>
            <Muted>{m().lessonFailed}</Muted>
          </If>
          <If when={kind === "review" && !result.passed && !result.blownOff}>
            <Muted>{m().reviewFailed}</Muted>
          </If>
          <If when={result.unanswered > 0}>
            <Muted>{m().unanswered(result.unanswered)}</Muted>
          </If>
          <If when={quizMissed}>
            <Muted>{m().quizFollowUps}</Muted>
          </If>
        </Card>
        <If when={result.remedial.length > 0}>
          <Card>
            <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "700" }}>{m().remedialTitle}</Text>
            <Muted>{m().remedialBody}</Muted>
            <TopicLinks links={result.remedial} />
          </Card>
        </If>
        <If when={result.prerequisites.length > 0}>
          <Card>
            <Muted>{m().buildsOn}</Muted>
            <TopicLinks links={result.prerequisites} />
          </Card>
        </If>
        <If when={result.passage}>
          {(passage) => (
            <Card>
              <Illustration path={passage().illustration} />
              <If when={passage().audio}>{(path) => <Listen path={path()} accent={tx(passage().accent)} />}</If>
              <Text style={{ color: colors().ink, fontSize: 18, lineHeight: 28 }}>{passage().body}</Text>
            </Card>
          )}
        </If>
        <If
          when={result.feedback && result.items[0] ? { feedback: result.feedback, item: result.items[0] } : undefined}
          else={<Each of={items}>{(entry) => <ResultItemCard item={entry()[1]} at={entry()[0]} />}</Each>}
        >
          {(essay) => <EssayVerdict feedback={essay().feedback} item={essay().item} />}
        </If>
      </Body>
      <BottomBar>
        <If when={error()}>
          <ErrorNote message={error()} />
        </If>
        <Buttons
          quiet={{ label: m().backToDashboard, onPress: () => nav.pop() }}
          main={{ label: m().nextTask, onPress: () => void next() }}
          disabled={busy()}
        />
      </BottomBar>
    </>
  );
}

/**
 * Player runs a session in focus: no navigation, a bar with the way out and the
 * steps, and the step's actions at the bottom. Lessons step through knowledge
 * points (explanation, worked example, practice with feedback); reviews give
 * feedback per answer; the diagnostic gives none until the end, and a quiz is
 * answered as an exam, in any order, and judged once handed in.
 */
export function Player(props: { sessionId: string }) {
  const loaded = resource(({ signal: abort }) => learning.getSession({ id: props.sessionId }, { signal: abort }));
  // The session as of the last answer; feedback is shown before moving on to it.
  const latest = signal<Session | undefined>(undefined);
  const answered = signal<Answered | undefined>(undefined);
  const session = computed(() => latest() ?? loaded()?.session);
  const title = computed(() => {
    const current = session();
    return current ? taskLabel(current) : "";
  });
  // A new question replaces the whole flow, so that nothing of the last answer stays; a quiz's question also when its answer is saved.
  const steps = computed(() => {
    const current = session();
    return current?.step.case === "question" ? [current] : [];
  });
  // Work is kept on the server after every answer, so leaving loses nothing; it is asked only to catch a slip.
  const leave = async () => {
    if (session()?.step.case === "result" || session()?.step.case === "submitted" || !session()) {
      nav.pop();
      return;
    }
    const { action } = await AlertDialog.show({
      title: m().leaveTitle,
      description: m().leaveBody,
      actions: [
        { id: "stay", label: m().keepGoing, role: "cancel" },
        { id: "leave", label: m().leave, role: "destructive" },
      ],
    });
    if (action === "leave") nav.pop();
  };
  keymap.bind("escape", () => void leave());
  return (
    <NavPage
      headerStyle={headerStyle()}
      title={title()}
      headerVisible={false}
      hidesBottomBarWhenPushed
      popOnBack={false}
      onBackPress={() => void leave()}
      statusBar={{ foreground: "auto" }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors().page,
          // The math keyboard, like the system's, keeps the step's actions in sight above it.
          paddingBottom: mathKeyboardHeight() > 0 ? mathKeyboardHeight() : "env(keyboard-inset-height)",
        }}
      >
        {/* A question's flow draws its own bar, with its steps; the rest have the way out and the task's name. */}
        <If when={session()?.step.case !== "question"}>
          <FocusBar label={title()} onClose={() => void leave()} />
        </If>
        <Loaded rpc={loaded}>
          {() => (
            <View style={{ flex: 1 }}>
              <Each
                of={steps()}
                key={(current) => {
                  const q = current.step.case === "question" ? current.step.value : undefined;
                  return q ? `${q.index}:${q.problem?.part ?? 0}:${q.sheet ? q.saved : ""}` : "-";
                }}
              >
                {(current) => {
                  const question = current().step.value as Question;
                  return (
                    <If
                      when={question.sheet}
                      else={
                        <StepsFlow
                          session={current()}
                          question={question}
                          answered={answered}
                          onAnswered={(feedback, next, response) => {
                            if (feedback) answered.set({ feedback, next, response });
                            else latest.set(next);
                          }}
                          onContinue={() => {
                            latest.set(answered()?.next);
                            answered.set(undefined);
                          }}
                          onClose={() => void leave()}
                        />
                      }
                    >
                      <QuizFlow
                        session={current()}
                        question={question}
                        onSession={(next) => latest.set(next)}
                        onClose={() => void leave()}
                      />
                    </If>
                  );
                }}
              </Each>
              <If when={session()?.step.case === "submitted" ? (session()?.step.value as Submitted) : undefined}>
                {(submitted) => (
                  <SubmittedView session={session() as Session} submitted={submitted()} onJudged={(next) => latest.set(next)} />
                )}
              </If>
              <If when={session()?.step.case === "result" ? (session()?.step.value as Result) : undefined}>
                {(result) => <ResultView session={session() as Session} result={result()} />}
              </If>
            </View>
          )}
        </Loaded>
        <MathKeyboard />
      </View>
    </NavPage>
  );
}
