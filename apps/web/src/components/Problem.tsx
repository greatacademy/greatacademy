import type { ProblemView } from "@ga/proto/learning/v1/learning_pb";

import { useI18n } from "../lib/i18n.tsx";
import { FigureView } from "./Figure.tsx";
import { Illustration } from "./Illustration.tsx";
import { Markdown, Tex } from "./Markdown.tsx";
import { Sounds } from "./Sounds.tsx";
import { heardText } from "./SpeechFlow.tsx";
import { StrokesDrawing } from "./StrokesField.tsx";

/** listenTo labels the recordings a problem plays to answer, numbered when there are several, without what they say. */
export const listenTo = (paths: readonly string[], label: string) =>
  paths.map((audio, i) => ({ audio, text: paths.length > 1 ? `${label} ${i + 1}` : label }));

/** ProblemPrompt shows a problem's picture, its prompt, the recordings it plays and its drawing. */
export function ProblemPrompt({ problem, answering }: { problem?: ProblemView; answering?: boolean }) {
  const { tx, m } = useI18n();
  // While a plot is being answered, its drawing is the input itself.
  const figure = answering && problem?.input?.kind.case === "plot" ? undefined : problem?.figure;
  // While an order is being answered, its sentences are the input itself.
  const input = problem?.input?.kind;
  const items = !answering && input?.case === "order" ? input.value.items : [];
  return (
    <div className="space-y-4">
      <DifficultyBadge difficulty={problem?.difficulty ?? ""} />
      <Illustration path={problem?.picture ?? ""} className="w-full" />
      <Markdown source={tx(problem?.prompt)} className="text-lg" />
      <Sounds sounds={listenTo(problem?.listen ?? [], m.listen)} />
      <FigureView figure={figure} />
      {items.length > 0 && (
        <ul className="list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li key={tx(item)}>
              <Markdown source={tx(item)} inline />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** DifficultyBadge names the tier of a tiered problem: easy, medium or hard. */
export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const { m } = useI18n();
  const label = m.difficulty(difficulty);
  if (!label) return null;
  const tone = difficulty === "hard" ? "bg-bad-soft text-bad" : difficulty === "easy" ? "bg-good-soft text-good" : "bg-warn-soft text-warn";
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{label}</span>;
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
  if (input?.case === "strokes") return <StrokesDrawing response={answer} />;
  if (input?.case === "speech") return <span>“{heardText(answer)}”</span>;
  return <span>{answer}</span>;
}
