import type { Feedback, ProblemView } from "@ga/proto/learning/v1/learning_pb";
import { effect, keymap, signal, Text, View } from "nsh";
import { Input } from "nsh/base";

import { m, tx } from "../lib/i18n.ts";
import { colors, fieldStyle, Muted } from "../lib/ui.tsx";
import { MathField } from "./MathField.tsx";
import { PlotField } from "./PlotField.tsx";
import { FigureView, Rich, Tex } from "./Rich.tsx";

/** Prompt shows a problem's prompt and its drawing; while a plot is answered, the drawing is the input itself. */
export function Prompt(props: { problem: ProblemView; answering?: boolean }) {
  const input = props.problem.input?.kind;
  const figure = props.answering && input?.case === "plot" ? undefined : props.problem.figure;
  return (
    <View style={{ gap: 12 }}>
      <Rich source={tx(props.problem.prompt)} fontSize={18} />
      <If when={figure}>{(drawn) => <FigureView figure={drawn()} />}</If>
      <If when={!props.answering && input?.case === "order"}>
        <View style={{ gap: 4 }}>
          <Each of={input?.case === "order" ? input.value.items : []}>{(item) => <Rich source={`· ${tx(item())}`} />}</Each>
        </View>
      </If>
    </View>
  );
}

/** AnswerText shows an answer as the learner would have given it: an option, math or text. */
export function AnswerText(props: { problem: ProblemView; answer: string }) {
  const input = props.problem.input?.kind;
  if (props.answer === "") return <Muted>{m().skipped}</Muted>;
  switch (input?.case) {
    case "choice": {
      const drawn = input.value.figures[Number(props.answer)];
      return drawn ? <FigureView figure={drawn} /> : <Rich source={tx(input.value.options[Number(props.answer)])} />;
    }
    case "order":
      return (
        <View style={{ gap: 4 }}>
          <Each of={props.answer.split(",")}>{(at, i) => <Rich source={`${i() + 1}. ${tx(input.value.items[Number(at())])}`} />}</Each>
        </View>
      );
    case "math":
      return <Tex tex={[input.value.prefix, props.answer, input.value.suffix].filter(Boolean).join(" ")} />;
    case "plot":
      return <Text style={{ color: colors().ink }}>{props.answer}</Text>;
    default:
      return <Text style={{ color: colors().ink }}>{props.answer}</Text>;
  }
}

function OrderField(props: { items: readonly string[]; onChange: (value: string) => void; disabled: boolean }) {
  const order = signal(props.items.map((_, i) => i));
  // The list as first shown counts as an answer too, since leaving it as it is can be the right order.
  effect(() => props.onChange(order().join(",")));
  const move = (at: number, by: number) => {
    const next = [...order()];
    [next[at], next[at + by]] = [next[at + by] as number, next[at] as number];
    order.set(next);
  };
  return (
    <View style={{ gap: 8 }}>
      <Each of={order()} key={(item) => item}>
        {(item, at) => (
          <View
            style={{
              alignItems: "center",
              borderColor: colors().line,
              borderRadius: 12,
              borderWidth: 1,
              flexDirection: "row",
              gap: 8,
              padding: 12,
            }}
          >
            <Muted>{`${at() + 1}`}</Muted>
            <View style={{ flex: 1 }}>
              <Rich source={props.items[item()] ?? ""} />
            </View>
            <If when={!props.disabled}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Text
                  role="button"
                  accessibilityLabel={m().moveUp}
                  onPress={() => at() > 0 && move(at(), -1)}
                  style={{ color: at() > 0 ? colors().accent : colors().line, fontSize: 18, padding: 4 }}
                >
                  ↑
                </Text>
                <Text
                  role="button"
                  accessibilityLabel={m().moveDown}
                  onPress={() => at() < order().length - 1 && move(at(), 1)}
                  style={{ color: at() < order().length - 1 ? colors().accent : colors().line, fontSize: 18, padding: 4 }}
                >
                  ↓
                </Text>
              </View>
            </If>
          </View>
        )}
      </Each>
    </View>
  );
}

function ChoiceField(props: {
  problem: ProblemView;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  feedback?: Feedback;
}) {
  const input = props.problem.input?.kind;
  const options = input?.case === "choice" ? input.value : undefined;
  // On a keyboard, 1 to 9 or A to I pick an option, as the letters beside them say.
  for (let i = 0; i < Math.min(options?.options.length ?? 0, 9); i++) {
    const pick = () => {
      if (!props.disabled) props.onChange(String(i));
    };
    keymap.bind(String(i + 1), pick, { when: "notEditing" });
    keymap.bind(String.fromCharCode(97 + i), pick, { when: "notEditing" });
  }
  const border = (i: number) => {
    const selected = props.value === String(i);
    if (props.feedback && (props.feedback.answer === String(i) || (selected && props.feedback.correct))) return colors().good;
    if (props.feedback && selected) return colors().bad;
    return selected ? colors().accent : colors().line;
  };
  return (
    <View role="radiogroup" style={{ gap: 8 }}>
      <Each of={options?.options ?? []}>
        {(option, i) => {
          const press = () => {
            if (!props.disabled) props.onChange(String(i()));
          };
          const drawn = options?.figures[i()];
          return (
            <View
              role="radio"
              accessibilityState={{ checked: props.value === String(i()) }}
              onPress={press}
              style={{
                alignItems: "center",
                borderColor: border(i()),
                borderRadius: 12,
                borderWidth: 2,
                flexDirection: "row",
                gap: 12,
                padding: 12,
              }}
            >
              <Text style={{ color: colors().muted, fontWeight: "600" }}>{String.fromCharCode(65 + i())}</Text>
              <View style={{ flex: 1 }}>
                <If when={drawn} else={<Rich source={tx(option())} inline onPress={press} />}>
                  {(figure) => <FigureView figure={figure()} onPress={press} />}
                </If>
              </View>
            </View>
          );
        }}
      </Each>
    </View>
  );
}

/** AnswerInput takes the response to a problem, in the way its input asks for. */
export function AnswerInput(props: {
  problem: ProblemView;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyboard?: (height: number) => void;
  disabled: boolean;
  feedback?: Feedback;
}) {
  const input = props.problem.input?.kind;
  switch (input?.case) {
    case "choice":
      return (
        <ChoiceField
          problem={props.problem}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          feedback={props.feedback}
        />
      );
    case "order":
      return <OrderField items={input.value.items.map((item) => tx(item))} onChange={props.onChange} disabled={props.disabled} />;
    case "plot":
      return props.problem.figure ? (
        <PlotField
          input={input.value}
          figure={props.problem.figure}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          answer={props.feedback && !props.feedback.correct ? props.feedback.answer : undefined}
        />
      ) : null;
    case "math":
      return (
        <View style={{ gap: 6 }}>
          <If when={input.value.prefix}>{(tex) => <Tex tex={tex()} fontSize={20} />}</If>
          <MathField
            value={props.value}
            onChange={props.onChange}
            onSubmit={props.onSubmit}
            onKeyboard={props.onKeyboard}
            disabled={props.disabled}
          />
          <If when={input.value.suffix}>{(tex) => <Tex tex={tex()} fontSize={20} />}</If>
        </View>
      );
    case "writing":
      return (
        <Input accessibilityLabel={m().yourAnswer} value={props.value} multiline readonly style={{ ...fieldStyle(), minHeight: 120 }} />
      );
    default:
      return (
        <Input
          accessibilityLabel={m().yourAnswer}
          value={props.value}
          disabled={props.disabled}
          autoCorrect={false}
          onChange={({ value }) => props.onChange(value)}
          onSubmit={props.onSubmit}
          returnKeyType="done"
          style={fieldStyle()}
        />
      );
  }
}
