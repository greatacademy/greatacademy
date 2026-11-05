import { TopicStatus } from "@ga/proto/learning/v1/learning_pb";

import type { Messages } from "./i18n.tsx";

/** statusStyle gives each standing on a topic its name and its colors. */
export const statusStyle: Record<TopicStatus, { key: keyof Messages["status"]; dot: string; chip: string }> = {
  [TopicStatus.UNSPECIFIED]: { key: "locked", dot: "bg-line", chip: "bg-page text-muted" },
  [TopicStatus.LOCKED]: { key: "locked", dot: "bg-line", chip: "bg-page text-muted" },
  [TopicStatus.AVAILABLE]: { key: "available", dot: "bg-accent", chip: "bg-accent-soft text-accent" },
  [TopicStatus.FAILED]: { key: "failed", dot: "bg-bad", chip: "bg-bad-soft text-bad" },
  [TopicStatus.LEARNED]: { key: "learned", dot: "bg-good", chip: "bg-good-soft text-good" },
  [TopicStatus.DUE]: { key: "due", dot: "bg-warn", chip: "bg-warn-soft text-warn" },
  [TopicStatus.ASSUMED]: { key: "assumed", dot: "bg-muted", chip: "bg-page text-muted" },
};
