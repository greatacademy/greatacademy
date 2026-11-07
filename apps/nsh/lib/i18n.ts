import type { Text } from "@ga/proto/common/v1/text_pb";
import { locale } from "nsh";

const language = (): "en" | "zh-CN" => (locale().startsWith("zh") ? "zh-CN" : "en");

/** tx picks the device's language from a localized text, falling back to English. */
export function tx(text: Text | undefined): string {
  return text?.values[language()] ?? text?.values.en ?? "";
}

const messages = {
  en: {
    back: "Back",
    courses: "Courses",
    loading: "Loading…",
    retry: "Retry",
    soon: "Lessons in the app are coming soon.",
    topics: (n: number) => `${n} topics`,
  },
  "zh-CN": {
    back: "返回",
    courses: "课程",
    loading: "加载中…",
    retry: "重试",
    soon: "应用内课程即将推出。",
    topics: (n: number) => `${n} 个知识点`,
  },
} as const;

/** m gives the app's own messages in the device's language. */
export const m = () => messages[language()];
