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

/**
 * ProblemPrompt shows a problem's picture, its prompt, the recordings it plays and its drawing. With apart, a part of a
 * multistep problem shows only its own question, its scenario and the parts before it being shown apart.
 */
export function ProblemPrompt({ problem, answering, apart }: { problem?: ProblemView; answering?: boolean; apart?: boolean }) {
  const { tx, m } = useI18n();
  // While a plot is being answered, its drawing is the input itself.
  const figure = answering && problem?.input?.kind.case === "plot" ? undefined : problem?.figure;
  // While an order is being answered, its sentences are the input itself.
  const input = problem?.input?.kind;
  const items = !answering && input?.case === "order" ? input.value.items : [];
  // While a spoken problem is answered, the recorder shows what to say; elsewhere, as in a worked example, it shows here.
  const spoken = !answering && input?.case === "speech" ? input.value : undefined;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(problem?.parts ?? 0) > 1 && (
          <span className="inline-block rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
            {m.partOf(problem?.part ?? 0, problem?.parts ?? 0)}
          </span>
        )}
        <DifficultyBadge difficulty={problem?.difficulty ?? ""} />
      </div>
      <Illustration path={problem?.picture ?? ""} className="w-full" />
      <Markdown source={tx(apart && problem?.ask ? problem.ask : problem?.prompt)} className="text-lg" />
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
      {spoken?.text && (
        <div className="rounded-xl border border-line bg-surface px-4 py-3">
          <div className="text-xs font-medium tracking-wide text-muted uppercase">
            {spoken.mode === "read" ? m.readAloudThis : m.repeatThis}
          </div>
          <p className="mt-1 text-xl leading-relaxed">{spoken.text}</p>
        </div>
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
