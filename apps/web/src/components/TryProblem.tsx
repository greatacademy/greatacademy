import type { Feedback } from "@ga/proto/learning/v1/learning_pb";
import { ArrowsClockwise, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useAdminText } from "../lib/admin-text.ts";
import { useI18n } from "../lib/i18n.tsx";
import { admin } from "../lib/rpc.ts";
import { AnswerInput } from "./AnswerInput.tsx";
import { Explanation, FigureView } from "./Figure.tsx";
import { LoadError } from "./LoadError.tsx";
import { Markdown } from "./Markdown.tsx";
import { AnswerText, ProblemPrompt } from "./Problem.tsx";
import { Sounds } from "./Sounds.tsx";
import { Button, Card, ErrorNote, Spinner } from "./ui.tsx";

/** Solution shows an answer with its worked solution, as the feedback on an answer shows them. */
function Solution({ feedback, problem }: { feedback: Feedback; problem: Parameters<typeof AnswerText>[0]["problem"] }) {
  const { m, tx } = useI18n();
  return (
    <div className="space-y-3">
      <div className="text-sm">
        <span className="mr-2 text-muted">{m.correctAnswer}:</span>
        <AnswerText problem={problem} answer={feedback.answer} />
      </div>
      <Explanation text={tx(feedback.solution)} figures={feedback.solutionFigures} />
      <FigureView figure={feedback.solutionFigure} />
      <Sounds sounds={feedback.solutionSounds} />
    </div>
  );
}

/**
 * TryProblem lets an administrator try the problems of one knowledge point, or one question of a passage, as a learner
 * meets them: answer, check, see the solution, and ask for another. Nothing is recorded.
 */
export function TryProblem({ courseId, topicId, kp, title }: { courseId: string; topicId: string; kp: number; title: string }) {
  const { m, tx } = useI18n();
  const t = useAdminText();
  const [seed, setSeed] = useState(1);
  const [value, setValue] = useState("");
  const [shown, setShown] = useState(false);
  const ref = { courseId, topicId, kp, seed };
  const tried = useQuery({
    queryKey: ["admin", "try", courseId, topicId, kp, seed],
    queryFn: () => admin.tryProblem({ ref }),
    staleTime: Infinity,
  });
  const check = useMutation({ mutationFn: (response: string) => admin.checkTry({ ref, response }) });
  const next = () => {
    setSeed((s) => s + 1);
    setValue("");
    setShown(false);
    check.reset();
  };
  const feedback = check.data?.feedback;
  const problem = tried.data?.problem;

  return (
    <Card className="space-y-4 border-dashed">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <Button variant="ghost" onClick={next}>
          <ArrowsClockwise size={16} /> {t.newProblem}
        </Button>
      </div>
      {tried.isPending && <Spinner label={m.loading} />}
      {tried.isError && <LoadError error={tried.error} onRetry={() => tried.refetch()} />}
      {tried.data && (
        <>
          <ProblemPrompt problem={problem} answering />
          {tried.data.checkable ? (
            <>
              <AnswerInput
                key={seed}
                problem={problem}
                value={value}
                onChange={setValue}
                onSubmit={() => value !== "" && !feedback && check.mutate(value)}
                disabled={!!feedback || check.isPending}
                feedback={feedback}
              />
              {!feedback && (
                <Button onClick={() => check.mutate(value)} disabled={value === "" || check.isPending}>
                  {t.check}
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">{t.notCheckable}</p>
          )}
          {check.isError && <ErrorNote message={String(check.error.message)} />}
          {feedback && (
            <div
              className={`space-y-3 rounded-xl border p-4 ${feedback.correct ? "border-good/40 bg-good-soft/50" : "border-bad/40 bg-bad-soft/50"}`}
            >
              <div className={`flex items-center gap-2 font-semibold ${feedback.correct ? "text-good" : "text-bad"}`}>
                {feedback.correct ? <CheckCircle size={20} weight="fill" /> : <XCircle size={20} weight="fill" />}
                {feedback.correct ? m.correct : m.incorrect}
              </div>
              {feedback.message && <Markdown source={tx(feedback.message)} className="text-sm" />}
              <Solution feedback={feedback} problem={problem} />
            </div>
          )}
          {!feedback && tried.data.answer && (
            <div className="space-y-3">
              <Button variant="secondary" onClick={() => setShown((s) => !s)}>
                {shown ? t.hideAnswer : t.showAnswer}
              </Button>
              {shown && <Solution feedback={tried.data.answer} problem={problem} />}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
