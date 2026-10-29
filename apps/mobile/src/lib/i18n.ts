import type { Text } from "@ga/proto/common/v1/text_pb";

/** locale is the device's language, narrowed to the ones the content is written in. */
export const locale: "en" | "zh-CN" = Intl.DateTimeFormat().resolvedOptions().locale.startsWith("zh") ? "zh-CN" : "en";

/** tx picks the device's language from a localized text, falling back to English. */
export function tx(text: Text | undefined): string {
  return text?.values[locale] ?? text?.values.en ?? "";
}

const messages = {
  en: { courses: "Courses", topics: (n: number) => `${n} topics`, retry: "Retry", soon: "Lessons on mobile are coming soon." },
  "zh-CN": { courses: "课程", topics: (n: number) => `${n} 个知识点`, retry: "重试", soon: "移动端课程即将推出。" },
} as const;

export const m = messages[locale];
