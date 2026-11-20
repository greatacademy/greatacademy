import type { KnowledgePointIntro } from "@ga/proto/learning/v1/learning_pb";
import { Lightbulb } from "@phosphor-icons/react";
import { useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { CaptionedFigure, Explanation, FigureView } from "./Figure.tsx";
import { Markdown } from "./Markdown.tsx";
import { AnswerText, ProblemPrompt } from "./Problem.tsx";
import { Sounds } from "./Sounds.tsx";
import { Button, Card } from "./ui.tsx";

/** LessonStep shows a knowledge point of a lesson to reread: its explanation, then a worked example whose solution is shown on request. */
export function LessonStep({ step }: { step: KnowledgePointIntro }) {
  const { m, tx } = useI18n();
  const [shown, setShown] = useState(false);
  const ex = step.example;
  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">
          <Markdown source={tx(step.title)} inline />
        </h2>
        <Explanation text={tx(step.explanation)} figures={step.figures} />
        <CaptionedFigure figure={step.figure} />
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
    </div>
  );
}
