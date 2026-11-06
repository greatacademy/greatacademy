import type { ProblemView } from "@ga/proto/learning/v1/learning_pb";

import { useI18n } from "../lib/i18n.tsx";
import { FigureView } from "./Figure.tsx";
import { Markdown, Tex } from "./Markdown.tsx";

/** ProblemPrompt shows a problem's prompt and its drawing. */
export function ProblemPrompt({ problem, answering }: { problem?: ProblemView; answering?: boolean }) {
  const { tx } = useI18n();
  // While a plot is being answered, its drawing is the input itself.
  const figure = answering && problem?.input?.kind.case === "plot" ? undefined : problem?.figure;
  return (
    <div className="space-y-4">
      <Markdown source={tx(problem?.prompt)} className="text-lg" />
      <FigureView figure={figure} />
    </div>
  );
}

/** AnswerText shows an answer as the learner would have given it: an option, math or text. */
export function AnswerText({ problem, answer }: { problem?: ProblemView; answer: string }) {
  const { tx, m } = useI18n();
  const input = problem?.input?.kind;
  if (answer === "") return <span className="text-muted italic">{m.skipped}</span>;
  if (input?.case === "choice") {
    const drawn = input.value.figures[Number(answer)];
    return drawn ? (
      <FigureView figure={drawn} className="answer-figure" />
    ) : (
      <Markdown source={tx(input.value.options[Number(answer)])} inline />
    );
  }
  if (input?.case === "order") {
    return (
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        {answer.split(",").map((i) => (
          <li key={i}>
            <Markdown source={tx(input.value.items[Number(i)])} inline />
          </li>
        ))}
      </ol>
    );
  }
  if (input?.case === "math") return <Tex tex={[input.value.prefix, answer, input.value.suffix].filter(Boolean).join(" ")} />;
  if (input?.case === "plot") return <Tex tex={answer.replaceAll(";", ";\\;")} />;
  return <span>{answer}</span>;
}
