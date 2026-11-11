// Grade 4: what the judged writing topics share.

import { type CriterionSpec, t } from "@ga/content";
import { criterionById } from "@ga/subject-english";

/** criterion finds a criterion by its id, failing when there is none. */
export const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** quoted quotes every line of a model, so that a model of several paragraphs stays one quotation. */
const quoted = (model: string) =>
  model
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

/** onePiece shows the model of a task after a verdict. */
export const onePiece = (model: string) => t(`One good answer:\n\n${quoted(model)}`, `一个好的答案：\n\n${quoted(model)}`);
