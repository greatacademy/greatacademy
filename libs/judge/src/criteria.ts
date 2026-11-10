import type { CriterionSpec } from "@ga/content";

/** CriterionDef is a criterion as content defines it: one yes-or-no question about a learner's text. */
export type CriterionDef = CriterionSpec;

/** criterionKey is the name a judgment and a calibration report give a criterion: its id and version. */
export function criterionKey(c: Pick<CriterionSpec, "id" | "version">): string {
  return `${c.id}@${c.version}`;
}
