import { type Api, type Model, type Models, validateToolCall } from "@earendil-works/pi-ai";
import type { TelemetrySpan } from "@earendil-works/pi-telemetry";
import type { CriterionDef } from "./criteria.ts";
import type { JudgeTask } from "./prompt.ts";
import { promptFor } from "./prompt.ts";
import { RESPOND_TOOL, type RespondArgs } from "./respond.ts";

/** MAX_TEXT_CHARS is the longest learner text sent to a judge; longer text is refused before any call. */
export const MAX_TEXT_CHARS = 8_000;

/** CriterionVerdict is the verdict on one criterion, with a quotation checked against the learner's text. */
export interface CriterionVerdict {
  readonly id: string;
  readonly version: string;
  readonly met: boolean;
  readonly quotation: string;
  readonly note: string;
}

/** Verdict is a checked judgment: what was met, the score in [0, 1], feedback, and what produced it. */
export interface Verdict {
  readonly criteria: readonly CriterionVerdict[];
  readonly feedback: readonly { readonly point: string; readonly quotation: string }[];
  /** score is the fraction of criteria met, the repetition's result for the engine. */
  readonly score: number;
  readonly model: string;
  readonly promptVersion: string;
  readonly usage: { readonly input: number; readonly output: number; readonly cost: number };
}

/** RejectReason says why a judge's answer was not accepted; a rejected answer never becomes a verdict. */
export type RejectReason = "provider-error" | "no-respond" | "invalid-arguments" | "criteria-mismatch" | "quotation-not-found";

/** JudgeRejected is thrown when a judgment fails; `retryable` tells whether trying again, or the backup route, may help. */
export class JudgeRejected extends Error {
  readonly reason: RejectReason;
  readonly retryable: boolean;
  constructor(reason: RejectReason, message: string, retryable: boolean) {
    super(message);
    this.name = "JudgeRejected";
    this.reason = reason;
    this.retryable = retryable;
  }
}

/** JudgeRequest is one learner text to judge against criteria for a task. */
export interface JudgeRequest {
  readonly task: JudgeTask;
  readonly criteria: readonly CriterionDef[];
  readonly text: string;
  readonly promptVersion: string;
}

/** JudgeOptions are the call's limits and observers. */
export interface JudgeOptions {
  readonly signal?: AbortSignal;
  readonly telemetry?: TelemetrySpan;
  readonly maxTokens?: number;
}

/** normalize makes quotations comparable: curly quotes become straight, dashes plain, and runs of space one space. */
export function normalize(text: string): string {
  return text
    .replace(/[‘’‛′]/gu, "'")
    .replace(/[“”‟″]/gu, '"')
    .replace(/[–—]/gu, "-")
    .replace(/\s+/gu, " ")
    .trim()
    .toLowerCase();
}

/** quotationFound tells whether a quotation appears in a text; an empty quotation is always found. */
export function quotationFound(quotation: string, text: string): boolean {
  const q = normalize(quotation);
  return q === "" || normalize(text).includes(q);
}

/** checkArgs turns the respond tool's arguments into a verdict, or throws JudgeRejected if they do not fit the request. */
export function checkArgs(args: RespondArgs, request: JudgeRequest): Pick<Verdict, "criteria" | "feedback" | "score"> {
  const byId = new Map(args.criteria.map((c) => [c.id, c]));
  if (byId.size !== args.criteria.length || byId.size !== request.criteria.length)
    throw new JudgeRejected("criteria-mismatch", "the answer does not give exactly one entry per criterion", true);
  const criteria = request.criteria.map((def) => {
    const answer = byId.get(def.id);
    if (!answer) throw new JudgeRejected("criteria-mismatch", `the answer leaves out ${def.id}`, true);
    if (!quotationFound(answer.quotation, request.text))
      throw new JudgeRejected("quotation-not-found", `a quotation for ${def.id} is not in the learner's text`, true);
    return { id: def.id, version: def.version, met: answer.met, quotation: answer.quotation.trim(), note: answer.note.trim() };
  });
  if (args.feedback.length > 2) throw new JudgeRejected("invalid-arguments", "more than two points of feedback", true);
  for (const p of args.feedback)
    if (!quotationFound(p.quotation, request.text))
      throw new JudgeRejected("quotation-not-found", "a feedback quotation is not in the learner's text", true);
  const feedback = args.feedback.map((p) => ({ point: p.point.trim(), quotation: p.quotation.trim() }));
  const met = criteria.filter((c) => c.met).length;
  return { criteria, feedback, score: criteria.length === 0 ? 0 : met / criteria.length };
}

/**
 * judge asks one model for a verdict through pi-ai and checks it. The learner's
 * text goes in a fenced block of the user message, never in the system prompt.
 * Every quotation must be found in the text, or the answer is rejected, so a
 * judge cannot show a learner words they never wrote.
 */
export async function judge(models: Models, model: Model<Api>, request: JudgeRequest, options: JudgeOptions = {}): Promise<Verdict> {
  if (request.criteria.length === 0) throw new Error("no criteria to judge");
  if (request.text.length > MAX_TEXT_CHARS) throw new Error("the text is too long to judge");
  const built = promptFor(request.promptVersion)(request.task, request.criteria, request.text);
  const message = await models.complete(
    model,
    {
      systemPrompt: built.system,
      messages: [{ role: "user", content: built.user, timestamp: 0 }],
      tools: [RESPOND_TOOL],
    },
    {
      temperature: 0,
      maxTokens: options.maxTokens ?? 1_500,
      ...(options.signal ? { signal: options.signal } : {}),
      ...(options.telemetry ? { telemetry: options.telemetry } : {}),
    },
  );
  if (message.stopReason === "error" || message.stopReason === "aborted")
    throw new JudgeRejected("provider-error", message.errorMessage ?? "the provider failed", true);
  const call = message.content.find((block) => block.type === "toolCall" && block.name === RESPOND_TOOL.name);
  if (call?.type !== "toolCall") throw new JudgeRejected("no-respond", "the model did not call respond", true);
  let args: RespondArgs;
  try {
    args = validateToolCall([RESPOND_TOOL], call) as RespondArgs;
  } catch {
    // The validation message repeats the arguments, which may quote the learner, so it is not kept.
    throw new JudgeRejected("invalid-arguments", "the respond arguments do not fit the schema", true);
  }
  return {
    ...checkArgs(args, request),
    model: model.id,
    promptVersion: request.promptVersion,
    usage: { input: message.usage.input, output: message.usage.output, cost: message.usage.cost.total },
  };
}
