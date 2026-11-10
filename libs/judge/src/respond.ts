import type { Tool } from "@earendil-works/pi-ai";
import { arr, bool, obj, str } from "@earendil-works/pi-schema";

/** RESPOND_TOOL is the one tool a judge answers with: a verdict per criterion and at most two points of feedback. */
export const RESPOND_TOOL: Tool = {
  name: "respond",
  description: "Give the verdict on the learner's text: one entry per criterion, and at most two short points of feedback.",
  parameters: obj({
    criteria: arr(
      obj({
        id: str({ description: "The criterion id, exactly as given." }),
        met: bool({ description: "Whether the text meets the criterion." }),
        quotation: str({
          description:
            "Words copied exactly from the learner's text that show the verdict, or an empty string when there is nothing to quote.",
        }),
        note: str({ description: "One short sentence for the learner explaining the verdict." }),
      }),
    ),
    feedback: arr(
      obj({
        point: str({ description: "One thing the learner should do next, in one or two short sentences." }),
        quotation: str({ description: "Words copied exactly from the learner's text that the point is about, or an empty string." }),
      }),
      { maxItems: 2 },
    ),
  }),
  constrainedSampling: { type: "json_schema", strict: "prefer" },
};

/** RespondCriterion is the judge's answer for one criterion. */
export interface RespondCriterion {
  readonly id: string;
  readonly met: boolean;
  readonly quotation: string;
  readonly note: string;
}

/** RespondPoint is one point of feedback. */
export interface RespondPoint {
  readonly point: string;
  readonly quotation: string;
}

/** RespondArgs are the arguments of a call to RESPOND_TOOL. */
export interface RespondArgs {
  readonly criteria: readonly RespondCriterion[];
  readonly feedback: readonly RespondPoint[];
}
