// The Watch out of an explanation, replaced by one written for a topic.

import { type Text, t } from "@ga/content";

/** watched replaces the Watch out that ends an explanation with a topic's own, when it has one. */
export function watched(explanation: Text, watch: Text | undefined): Text {
  if (!watch) return explanation;
  return t(
    explanation.en.replace(/> \*\*Watch out\.\*\*.*$/su, `> **Watch out.** ${watch.en}`),
    explanation["zh-CN"].replace(/> \*\*注意。\*\*.*$/su, `> **注意。** ${watch["zh-CN"]}`),
  );
}
