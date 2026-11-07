import type { Feedback, Question, Result, Session } from "@ga/proto/learning/v1/learning_pb";
import { computed, resource, Scroll, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { errorText, m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { learning } from "../lib/rpc.ts";
import { Action, Card, colors, ErrorNote, Loaded, Muted, Quiet } from "../lib/ui.tsx";
import { AnswerInput, AnswerText, Prompt } from "./Answer.tsx";
import { Header } from "./Header.tsx";
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

function Progress(props: { session: Session; question: Question }) {
  const lesson = props.question.lesson;
  const task = props.session.task?.kind;
  const text = lesson
    ? `${m().step(lesson.knowledgePoint + 1, lesson.knowledgePoints)} · ${m().streak(lesson.streak, lesson.needed)}`
    : task?.case === "diagnostic"
      ? m().questionUpTo(props.question.index + 1, task.value.maxQuestions)
      : m().question(props.question.index + 1, props.question.total);
  const share = lesson
    ? (lesson.knowledgePoint + lesson.streak / lesson.needed) / lesson.knowledgePoints
    : props.question.total > 0
      ? props.question.index / props.question.total
      : 0;
  return (
    <View style={{ gap: 6 }}>
      <Muted>{text}</Muted>
      <View style={{ backgroundColor: colors().line, borderRadius: 3, height: 6 }}>
        <View style={{ backgroundColor: colors().accent, borderRadius: 3, height: 6, width: `${Math.round(share * 100)}%` }} />
      </View>
    </View>
  );
}

function Intro(props: { intro: NonNullable<Question["intro"]>; onDone: () => void }) {
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
      <Action label={m().gotIt} onPress={props.onDone} />
    </View>
  );
}

function FeedbackCard(props: { answered: Answered; question: Question; onContinue: () => void }) {
  const { feedback } = props.answered;
  const problem = props.question.problem;
  return (
    <Card>
      <Text style={{ color: feedback.correct ? colors().good : colors().bad, fontSize: 18, fontWeight: "600" }}>
        {feedback.correct ? m().correct : m().incorrect}
      </Text>
      <If when={feedback.message}>{(message) => <Rich source={tx(message())} />}</If>
      <If when={!feedback.correct && problem}>
        <Muted>{m().correctAnswer}</Muted>
        {problem ? <AnswerText problem={problem} answer={feedback.answer} /> : null}
      </If>
      <Muted>{m().solution}</Muted>
      <Rich source={tx(feedback.solution)} />
      <If when={feedback.solutionFigure}>{(figure) => <FigureView figure={figure()} />}</If>
      <Action label={m().next} onPress={props.onContinue} />
    </Card>
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
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <If when={practicing()} else={question.intro ? <Intro intro={question.intro} onDone={() => practicing.set(true)} /> : null}>
      <View style={{ gap: 12 }}>
        <If when={question.passage}>
          {(passage) => (
            <Card>
              <Text style={{ color: colors().ink, fontSize: 18, lineHeight: 28 }}>{passage().body}</Text>
            </Card>
          )}
        </If>
        <Card>
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
                  disabled={busy() || !!props.answered()}
                  feedback={props.answered()?.feedback}
                />
              </View>
            )}
          </If>
          <If when={error()}>
            <ErrorNote message={error()} />
          </If>
          <If when={!props.answered()}>
            <Action label={m().submit} disabled={busy() || response().trim() === ""} onPress={() => void send(false)} />
            <If when={question.canSkip}>
              <Quiet label={m().dontKnow} disabled={busy()} onPress={() => void send(true)} />
            </If>
          </If>
        </Card>
        <If when={props.answered()}>
          {(answered) => <FeedbackCard answered={answered()} question={question} onContinue={props.onContinue} />}
        </If>
      </View>
    </If>
  );
}

function ResultView(props: { session: Session; result: Result }) {
  const { result } = props;
  const kind = props.session.task?.kind.case;
  const headline =
    kind === "diagnostic"
      ? m().placedResult(result.placed)
      : kind === "lesson" && result.passed
        ? m().lessonPassed
        : result.passed
          ? m().passed
          : m().failed;
  return (
    <View style={{ gap: 12 }}>
      <Card>
        <Text style={{ color: colors().ink, fontSize: 20, fontWeight: "600" }}>{headline}</Text>
        <If when={kind !== "diagnostic"}>
          <Muted>{m().score(result.correct, result.asked)}</Muted>
        </If>
        <If when={result.xp > 0}>
          <Text style={{ color: colors().accent, fontSize: 22, fontWeight: "600" }}>{m().earned(result.xp)}</Text>
          <If when={result.fullXp > 0}>
            <Muted>{result.xp > result.fullXp ? m().perfectBonus : m().earnedOf(result.xp, result.fullXp)}</Muted>
          </If>
        </If>
        <If when={result.xp < 0}>
          <Text style={{ color: colors().bad, fontSize: 22, fontWeight: "600" }}>{m().lostXp(result.xp)}</Text>
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
        <Action label={m().backToDashboard} onPress={() => nav.pop()} />
      </Card>
      <If when={result.passage}>
        {(passage) => (
          <Card>
            <Text style={{ color: colors().ink, fontSize: 18, lineHeight: 28 }}>{passage().body}</Text>
          </Card>
        )}
      </If>
      <Each of={result.items}>
        {(item, i) => (
          <Card>
            <View style={{ flexDirection: "row", gap: 8, justifyContent: "space-between" }}>
              <Muted>{`${i() + 1}. ${tx(item().title)}`}</Muted>
              <Text style={{ color: item().correct ? colors().good : colors().bad }}>{item().correct ? "✓" : "✗"}</Text>
            </View>
            <If when={item().problem}>
              {(problem) => (
                <View style={{ gap: 8 }}>
                  <Prompt problem={problem()} />
                  <Muted>{m().yourAnswer}</Muted>
                  <AnswerText problem={problem()} answer={item().response} />
                  <If when={!item().correct}>
                    <Muted>{m().correctAnswer}</Muted>
                    <AnswerText problem={problem()} answer={item().answer} />
                    <Muted>{m().solution}</Muted>
                    <Rich source={tx(item().solution)} />
                    <If when={item().solutionFigure}>{(figure) => <FigureView figure={figure()} />}</If>
                  </If>
                </View>
              )}
            </If>
          </Card>
        )}
      </Each>
    </View>
  );
}

/**
 * Player runs a session: lessons step through knowledge points (explanation,
 * worked example, practice with feedback); reviews give feedback per answer; the
 * diagnostic and quizzes give none until the end.
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
  return (
    <NavPage title={title()} header={<Header title={title()} />}>
      <View style={{ flex: 1, backgroundColor: colors().page }}>
        <Loaded rpc={loaded}>
          {() => (
            <Scroll style={{ flex: 1 }} keyboardDismissMode="on-drag">
              <View style={{ gap: 16, padding: 16, paddingBottom: 48 }}>
                <Each of={steps()} key={(current) => (current.step.case === "question" ? current.step.value.index : -1)}>
                  {(current) => {
                    const question = current().step.value as Question;
                    return (
                      <View style={{ gap: 16 }}>
                        <Progress session={current()} question={question} />
                        <QuestionFlow
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
                        />
                      </View>
                    );
                  }}
                </Each>
                <If when={session()?.step.case === "result" ? (session()?.step.value as Result) : undefined}>
                  {(result) => <ResultView session={session() as Session} result={result()} />}
                </If>
              </View>
            </Scroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
