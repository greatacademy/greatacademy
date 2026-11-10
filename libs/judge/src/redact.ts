/** Placeholder is what redact puts in place of a piece of personal data. */
export type Placeholder = "[email]" | "[link]" | "[handle]" | "[phone]" | "[address]" | "[name]";

const STREET = "Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Boulevard|Blvd|Way|Court|Ct|Place|Pl|Close|Crescent|Terrace";

// Order matters: an email holds an @ and a link may hold one, so both go before handles.
const RULES: readonly (readonly [RegExp, string])[] = [
  [/[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+/gu, "[email]"],
  [/\b(?:https?:\/\/|www\.)[^\s<>]*[^\s<>.,;:!?)]/giu, "[link]"],
  [/(^|[^\p{L}\p{N}_])@[A-Za-z0-9_][A-Za-z0-9_.]*[A-Za-z0-9_]/gu, "$1[handle]"],
  [new RegExp(`\\b\\d{1,5}\\s+(?:[A-Z][a-z]+\\s+){1,3}(?:${STREET})\\b\\.?`, "gu"), "[address]"],
  // Chinese has no spaces to find where a street name starts, so the street is kept and its number goes.
  [/(路|街|大道|巷|弄)\d+号(?:[\d\p{Script=Han}]{0,8}?(?:室|楼|栋|单元))?/gu, "$1[address]"],
  [/(?<![\p{L}\p{N}])\+?\d(?:[\s().-]?\d){6,14}(?![\p{L}\p{N}])/gu, "[phone]"],
  [
    /\b([Mm]y name is|[Mm]y name's|[Cc]all me|I am called|I'm called|named|called)(\s+)[A-Z][\p{L}'-]+(?:\s+[A-Z][\p{L}'-]+)?/gu,
    "$1$2[name]",
  ],
  [/(我叫|我的名字是|我名叫)(\s*)\p{Script=Han}{2,4}/gu, "$1$2[name]"],
];

/**
 * redact replaces personal data in a learner's text with placeholders before
 * the text leaves the platform or reaches a person: emails, links, handles,
 * phone numbers, street addresses, and names that a phrase such as "my name
 * is" or 我叫 introduces. It is a filter, not a guarantee; a name with no such
 * phrase before it is kept, so a miss is not treated as harmless.
 */
export function redact(text: string): string {
  let out = text;
  for (const [pattern, to] of RULES) out = out.replace(pattern, to);
  return out;
}
