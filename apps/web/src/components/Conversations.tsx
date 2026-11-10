import { Microphone } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { useI18n } from "../lib/i18n.tsx";
import { conversation } from "../lib/rpc.ts";
import { buttonClass, Card } from "./ui.tsx";

/** conversationsQuery is the conversations of a course, which the card and the player share. */
export const conversationsQuery = (courseId: string) => ({
  queryKey: ["conversations", courseId],
  queryFn: () => conversation.listConversations({ courseId }),
  staleTime: 0,
});

/** ConversationsCard lists the spoken conversations of the current course (S6), when it offers any. */
export function ConversationsCard({ courseId, subjectId }: { courseId: string; subjectId: string }) {
  const { m, tx } = useI18n();
  const list = useQuery(conversationsQuery(courseId));
  const d = list.data;
  if (!d || d.conversations.length === 0) return null;
  const note = d.unavailable === "voice-off" ? m.conversationsOff : d.unavailable === "daily-limit" ? m.conversationsDailyLimit : "";
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Microphone size={20} /> {m.conversations}
        </h2>
        <p className="text-sm text-muted">{note || m.conversationsHint}</p>
      </div>
      {d.conversations.map((c) => (
        <Card key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0 space-y-1">
            <div className="font-medium">{tx(c.title)}</div>
            <div className="text-sm text-muted">{c.available || note ? m.aboutMinutes(c.minutes) : m.conversationNotOffered}</div>
          </div>
          {c.available ? (
            <Link
              to="/$subject/talk/$conversationId"
              params={{ subject: subjectId, conversationId: c.id }}
              className={buttonClass("secondary")}
            >
              {m.talk}
            </Link>
          ) : null}
        </Card>
      ))}
    </section>
  );
}
