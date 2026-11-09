import type { Feedback, Question, Result, ResultItem, Session } from "@ga/proto/learning/v1/learning_pb";
import {
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
import { FigureView, Rich } from "./Rich.tsx";

type Answered = { feedback: Feedback; next: Session; response: string };

function taskLabel(session: Session): string {
  switch (session.task?.kind.case) {
    case "lesson":
      return m().lesson;
    case "review":
      return m().review;
    case "reading":
      return m().reading;
    case "quiz":
      return m().quiz;
    default:
      return m().diagnostic;
  }
}

function progressOf(session: Session, question: Question): { label: string; share: number } {
  const lesson = question.lesson;
  const task = session.task?.kind;
  const label = lesson
    ? `${m().step(lesson.knowledgePoint + 1, lesson.knowledgePoints)} · ${m().streak(lesson.streak, lesson.needed)}`
    : task?.case === "diagnostic"
      ? m().questionUpTo(question.index + 1, task.value.maxQuestions)
      : m().question(question.index + 1, question.total);
  const share = lesson
    ? (lesson.knowledgePoint + lesson.streak / lesson.needed) / lesson.knowledgePoints
    : question.total > 0
      ? question.index / question.total
      : task?.case === "diagnostic" && task.value.maxQuestions > 0
        ? question.index / task.value.maxQuestions
        : 0;
  return { label, share: Math.max(0, Math.min(1, share)) };
}

/**
 * FocusBar is the player's only chrome: a way out, and how far the task has come. On a desktop it is the window's
 * title bar's row too, as a page's header is: as tall, dragging the window, and clear of macOS's traffic lights.
 */
function FocusBar(props: { share: number; label: string; onClose: () => void }) {
  return (
    <View
      desktop={{ windowDrag: true }}
      style={{
        alignItems: "center",
        backgroundColor: colors().page,
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 12,
        ...(platform.desktop
          ? { height: HEADER_HEIGHT, paddingLeft: 12 + headerInset() }
          : { paddingBottom: 8, paddingTop: "calc(env(safe-area-inset-top) + 8)" }),
      }}
    >
      <View
        role="button"
        accessibilityLabel={m().close}
        onPress={props.onClose}
        style={{ alignItems: "center", height: 44, justifyContent: "center", width: 44 }}
      >
        <Text style={{ color: colors().muted, fontSize: 22 }}>✕</Text>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View
          role="progressbar"
          accessibilityLabel={props.label}
          accessibilityValue={{ min: 0, max: 100, now: Math.round(props.share * 100) }}
          style={{ backgroundColor: colors().line, borderRadius: 4, height: 8, overflow: "hidden" }}
        >
          <View style={{ backgroundColor: colors().accent, borderRadius: 4, height: 8, width: `${Math.round(props.share * 100)}%` }} />
        </View>
        <Text style={{ color: colors().muted, fontSize: 12 }}>{props.label}</Text>
      </View>
      <View style={{ width: 44 }} />
    </View>
  );
}

/** BottomBar holds a step's actions at the bottom of the screen, above the keyboard and the home indicator. */
function BottomBar(props: { children: JSX.Element; tone?: "good" | "bad" }) {
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
        paddingBottom: 12 + (keyboardFrame().height > 0 ? 0 : insets().bottom),
      }}
    >
      <View style={{ alignSelf: "center", gap: 10, maxWidth: 720, width: "100%" }}>{props.children}</View>
    </View>
  );
}

/** Buttons lays a secondary and a main action side by side, the main one wider. */
function Buttons(props: {
  quiet?: { label: string; onPress: () => void };
  main: { label: string; onPress: () => void };
  disabled?: boolean;
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
        <Action label={props.main.label} disabled={props.disabled} onPress={props.main.onPress} />
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

function Intro(props: { intro: NonNullable<Question["intro"]> }) {
  const shown = signal(false);
  const example = props.intro.example;
  return (
    <View style={{ gap: 12 }}>
      <Card>
        <Rich source={tx(props.intro.title)} inline fontSize={18} bold />
        <Rich source={tx(props.intro.explanation)} figures={props.intro.figures} />
        <If when={props.intro.figure}>{(figure) => <FigureView figure={figure()} caption />}</If>
      </Card>
      <If when={example}>
        {(worked) => (
          <Card>
            <Text style={{ color: colors().accent, fontSize: 14, fontWeight: "600" }}>{m().workedExample}</Text>
            <If when={worked().problem}>{(problem) => <Prompt problem={problem()} />}</If>
            <If when={shown()} else={<Quiet label={m().showSolution} onPress={() => shown.set(true)} />}>
              <View style={{ gap: 8 }}>
                <Rich source={tx(worked().solution)} />
                <If when={worked().solutionFigure}>{(figure) => <FigureView figure={figure()} />}</If>
                <Muted>{m().answer}</Muted>
                <If when={worked().problem}>{(problem) => <AnswerText problem={problem()} answer={worked().answer} />}</If>
              </View>
            </If>
          </Card>
        )}
      </If>
    </View>
  );
}

/** Solution shows how a problem is solved after an answer: open after a wrong one, a tap away after a right one. */
function Solution(props: { answered: Answered; question: Question }) {
  const { feedback } = props.answered;
  const problem = props.question.problem;
  const open = signal(!feedback.correct);
  return (
    <If when={open()} else={<Quiet label={m().showSolution} onPress={() => open.set(true)} />}>
      <Card>
        <If when={!feedback.correct && problem}>
          <Muted>{m().correctAnswer}</Muted>
          {problem ? <AnswerText problem={problem} answer={feedback.answer} /> : null}
        </If>
        <Muted>{m().solution}</Muted>
        <Rich source={tx(feedback.solution)} />
        <If when={feedback.solutionFigure}>{(figure) => <FigureView figure={figure()} />}</If>
      </Card>
    </If>
  );
}

/** Verdict is the colored sheet that says how an answer went, with the way on. */
function Verdict(props: { answered: Answered; onContinue: () => void }) {
  const { feedback } = props.answered;
  const tone = () => (feedback.correct ? colors().good : colors().bad);
  return (
    <BottomBar tone={feedback.correct ? "good" : "bad"}>
      <View role="alert" style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
        <View style={{ alignItems: "center", backgroundColor: tone(), borderRadius: 16, height: 32, justifyContent: "center", width: 32 }}>
          <Text style={{ color: colors().page, fontSize: 18, fontWeight: "700" }}>{feedback.correct ? "✓" : "✗"}</Text>
        </View>
        <Text style={{ color: tone(), flex: 1, fontSize: 18, fontWeight: "700" }}>{feedback.correct ? m().correct : m().incorrect}</Text>
      </View>
      <If when={feedback.message}>{(message) => <Rich source={tx(message())} />}</If>
      <Action label={m().next} onPress={props.onContinue} />
    </BottomBar>
  );
}

function QuestionFlow(props: {
  session: Session;
  question: Question;
  answered: () => Answered | undefined;
  onAnswered: (feedback: Feedback | undefined, next: Session, response: string) => void;
  onContinue: () => void;
}) {
  const question = props.question;
  const practicing = signal(!question.intro);
  const response = signal("");
  const busy = signal(false);
  const error = signal("");
  let scroll: ScrollRef | undefined;
  // Far enough down to show what was added below, the solution or the math keyboard; the view stops at the end.
  const toEnd = () => setTimeout(() => scroll?.scrollTo({ y: 100_000, animated: true }), 50);
  const send = async (skip: boolean) => {
    if (busy() || props.answered() || (!skip && response().trim() === "")) return;
    busy.set(true);
    error.set("");
    try {
      const result = await learning.submitAnswer({
        sessionId: props.session.id,
        index: question.index,
        response: skip ? "" : response(),
        skip,
      });
      if (result.session) props.onAnswered(result.feedback, result.session, skip ? "" : response());
      if (result.feedback && !result.feedback.correct) toEnd();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  // Return moves on on a keyboard, as the main button does: an input in focus submits by itself.
  keymap.bind(
    "enter",
    () => {
      if (!practicing()) practicing.set(true);
      else if (props.answered()) props.onContinue();
      else void send(false);
    },
    { when: "notEditing" },
  );
  return (
    <If
      when={practicing()}
      else={
        <>
          <Body>{question.intro ? <Intro intro={question.intro} /> : null}</Body>
          <BottomBar>
            <Action label={m().gotIt} onPress={() => practicing.set(true)} />
          </BottomBar>
        </>
      }
    >
      <Body ref={(node) => (scroll = node)}>
        <If when={question.passage}>
          {(passage) => (
            <Card>
              <Text style={{ color: colors().ink, fontSize: 18, lineHeight: 28 }}>{passage().body}</Text>
            </Card>
          )}
        </If>
        <If when={question.lesson}>
          <Muted>{m().practice}</Muted>
        </If>
        <If when={question.problem}>
          {(problem) => (
            <View style={{ gap: 16 }}>
              <Prompt problem={problem()} answering />
              <AnswerInput
                problem={problem()}
                value={props.answered()?.response ?? response()}
                onChange={(value) => response.set(value)}
                onSubmit={() => void send(false)}
                onKeyboard={(height) => height > 0 && toEnd()}
                disabled={busy() || !!props.answered()}
                feedback={props.answered()?.feedback}
              />
            </View>
          )}
        </If>
        <If when={error()}>
          <ErrorNote message={error()} />
        </If>
        <If when={props.answered()}>{(answered) => <Solution answered={answered()} question={question} />}</If>
      </Body>
      <If
        when={props.answered()}
        else={
          <BottomBar>
            <Buttons
              quiet={question.canSkip ? { label: m().dontKnow, onPress: () => void send(true) } : undefined}
              main={{ label: m().submit, onPress: () => void send(false) }}
              disabled={busy()}
            />
          </BottomBar>
        }
      >
        {(answered) => <Verdict answered={answered()} onContinue={props.onContinue} />}
      </If>
    </If>
  );
}

function ResultItemCard(props: { item: ResultItem; at: number }) {
  const open = signal(!props.item.correct);
  return (
    <Card>
      <View role="button" onPress={() => open.set(!open())} style={{ flexDirection: "row", gap: 8, justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Muted>{`${props.at + 1}. ${tx(props.item.title)}`}</Muted>
        </View>
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
              <Rich source={tx(props.item.solution)} />
              <If when={props.item.solutionFigure}>{(figure) => <FigureView figure={figure()} />}</If>
            </If>
          </View>
        )}
      </If>
    </Card>
  );
}

function ResultView(props: { session: Session; result: Result }) {
  const { result } = props;
  const kind = props.session.task?.kind.case;
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
            <Text style={{ color: colors().muted, fontSize: 16 }}>{m().score(result.correct, result.asked)}</Text>
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
        </Card>
        <If when={result.passage}>
          {(passage) => (
            <Card>
              <Text style={{ color: colors().ink, fontSize: 18, lineHeight: 28 }}>{passage().body}</Text>
            </Card>
          )}
        </If>
        <Each of={items}>{(entry) => <ResultItemCard item={entry()[1]} at={entry()[0]} />}</Each>
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
 * progress, and the step's actions at the bottom. Lessons step through knowledge
 * points (explanation, worked example, practice with feedback); reviews give
 * feedback per answer; the diagnostic and quizzes give none until the end.
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
  // A new question replaces the whole flow, so that nothing of the last answer stays.
  const steps = computed(() => {
    const current = session();
    return current?.step.case === "question" ? [current] : [];
  });
  const progress = computed(() => {
    const current = session();
    if (current?.step.case === "result") return { label: title(), share: 1 };
    if (current?.step.case === "question") {
      const { label, share } = progressOf(current, current.step.value);
      return { label: `${title()} · ${label}`, share };
    }
    return { label: title(), share: 0 };
  });
  // Work is kept on the server after every answer, so leaving loses nothing; it is asked only to catch a slip.
  const leave = async () => {
    if (session()?.step.case === "result" || !session()) {
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
      <View style={{ flex: 1, backgroundColor: colors().page, paddingBottom: "env(keyboard-inset-height)" }}>
        <FocusBar share={progress().share} label={progress().label} onClose={() => void leave()} />
        <Loaded rpc={loaded}>
          {() => (
            <View style={{ flex: 1 }}>
              <Each of={steps()} key={(current) => (current.step.case === "question" ? current.step.value.index : -1)}>
                {(current) => (
                  <QuestionFlow
                    session={current()}
                    question={current().step.value as Question}
                    answered={answered}
                    onAnswered={(feedback, next, response) => {
                      if (feedback) answered.set({ feedback, next, response });
                      else latest.set(next);
                    }}
                    onContinue={() => {
                      latest.set(answered()?.next);
                      answered.set(undefined);
                    }}
                  />
                )}
              </Each>
              <If when={session()?.step.case === "result" ? (session()?.step.value as Result) : undefined}>
                {(result) => <ResultView session={session() as Session} result={result()} />}
              </If>
            </View>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
