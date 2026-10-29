import { ArrowRight } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Markdown } from "../../components/Markdown.tsx";
import { Button, buttonClass, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useSession } from "../../lib/auth.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { catalog, learning, timeZone } from "../../lib/rpc.ts";

export const Route = createFileRoute("/courses/$courseId")({ component: CoursePage });

function CoursePage() {
  const { courseId } = Route.useParams();
  const { m, tx } = useI18n();
  const { data: session } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const course = useQuery({ queryKey: ["course", courseId], queryFn: () => catalog.getCourse({ courseId }) });
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => learning.getProfile({ timeZone: timeZone() }),
    enabled: !!session,
  });
  const enrolled = profile.data?.enrollments.some((e) => e.courseId === courseId);
  const enroll = useMutation({
    mutationFn: () => learning.enroll({ courseId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["profile"] });
      await navigate({ to: "/learn/$courseId", params: { courseId } });
    },
  });

  if (course.isPending) return <Spinner label={m.loading} />;
  if (course.isError || !course.data.course) return <ErrorNote message={m.error} />;
  const c = course.data.course;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="text-xs font-medium tracking-wide text-accent uppercase">{tx(c.subjectTitle)}</div>
        <h1 className="text-3xl font-semibold tracking-tight">{tx(c.title)}</h1>
        <Markdown source={tx(c.description)} className="max-w-2xl text-muted" />
        <div className="text-sm text-muted">
          {c.topicCount} {m.topics} · {c.xp} XP
        </div>
        <div className="pt-2">
          {!session ? (
            <div className="flex items-center gap-3">
              <Link to="/sign-in" search={{ next: `/courses/${courseId}` }} className={buttonClass("primary")}>
                {m.signIn}
              </Link>
              <span className="text-sm text-muted">{m.signInToLearn}</span>
            </div>
          ) : enrolled ? (
            <Link to="/learn/$courseId" params={{ courseId }} className={buttonClass("primary")}>
              {m.continueLearning} <ArrowRight size={16} />
            </Link>
          ) : (
            <Button onClick={() => enroll.mutate()} disabled={enroll.isPending || profile.isPending}>
              {m.enroll} <ArrowRight size={16} />
            </Button>
          )}
          {enroll.isError && <ErrorNote message={m.error} />}
        </div>
      </div>

      <div className="space-y-6">
        {c.units.map((u, ui) => (
          <Card key={tx(u.title)}>
            <h2 className="mb-4 text-lg font-semibold">
              <span className="mr-2 text-muted">{ui + 1}.</span>
              {tx(u.title)}
            </h2>
            <div className="space-y-5">
              {u.modules.map((mod) => (
                <div key={tx(mod.title)} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted">{tx(mod.title)}</h3>
                  <ul className="divide-y divide-line rounded-xl border border-line">
                    {mod.topics.map((t) => (
                      <li key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
                        <div className="space-y-0.5">
                          <div className="font-medium">{tx(t.title)}</div>
                          <Markdown source={tx(t.summary)} className="text-sm text-muted" />
                        </div>
                        <span className="shrink-0 text-xs text-muted">{t.xp} XP</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
