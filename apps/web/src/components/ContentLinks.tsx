import type { ContentLink } from "@ga/proto/admin/v1/admin_pb";
import { Link } from "@tanstack/react-router";

import { useI18n } from "../lib/i18n.tsx";
import { Markdown } from "./Markdown.tsx";
import { Card } from "./ui.tsx";

/** ContentLinks lists topics to open in the admin console, in the same course. */
export function ContentLinks({ title, courseId, topics }: { title: string; courseId: string; topics: readonly ContentLink[] }) {
  const { tx } = useI18n();
  if (topics.length === 0) return null;
  return (
    <Card className="space-y-2 p-4">
      <h2 className="text-sm font-semibold text-muted">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {topics.map((x) => (
          <Link
            key={x.topicId}
            to="/admin/content/$courseId/$topicId"
            params={{ courseId, topicId: x.topicId }}
            className="rounded-lg border border-line px-3 py-1.5 text-sm transition hover:border-accent/50"
          >
            <Markdown source={tx(x.title)} inline />
          </Link>
        ))}
      </div>
    </Card>
  );
}
