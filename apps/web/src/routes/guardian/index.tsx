import type { GuardedLearner } from "@ga/proto/account/v1/account_pb";
import { Warning } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { GuardianTools } from "../../components/GuardianTools.tsx";
import { ActiveLine, signText } from "../../components/LearnerStatus.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Bar, Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { signsOf } from "../../lib/guardian.ts";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { account, catalog, timeZone } from "../../lib/rpc.ts";

export const Route = createFileRoute("/guardian/")({ component: Guardian });

function LearnerCard({ learner }: { learner: GuardedLearner }) {
  const { m, tx } = useI18n();
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  const title = courses.data?.courses.find((c) => c.id === learner.courseId)?.title;
  const stats = learner.courseStats;
  const xp = learner.xp;
  const share = stats?.total ? stats.learned / stats.total : 0;
  const signs = signsOf(learner, Date.now());
  return (
    <Link to="/guardian/$learnerId" params={{ learnerId: learner.learnerId }} className="block min-w-0">
      <Card className="h-full space-y-4 p-5 transition hover:border-accent/50">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold">{learner.name}</div>
          <ActiveLine learner={learner} />
        </div>
        {learner.courseId ? (
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-3">
              <span className="min-w-0 truncate">{title ? tx(title) : ""}</span>
              <span className="shrink-0 text-muted">{Math.round(share * 100)}%</span>
            </div>
            <Bar value={share} />
          </div>
        ) : (
          <p className="text-sm text-muted">{m.noCourseYet}</p>
        )}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-3">
            <span>{m.today}</span>
            <span className="text-muted">
              {xp?.today ?? 0}
              {xp?.goalToday ? ` / ${xp.goalToday}` : ""} XP · {m.goalWeek} {xp?.week ?? 0} XP
            </span>
          </div>
          <Bar
            value={xp?.goalToday ? xp.today / xp.goalToday : 0}
            className={xp?.goalToday && xp.today >= xp.goalToday ? "bg-good" : "bg-accent"}
          />
        </div>
        {signs.length > 0 && (
          <ul className="space-y-1 text-sm text-warn">
            {signs.map((s) => (
              <li key={s.kind} className="flex gap-2">
                <Warning size={18} className="shrink-0" /> {signText(s, m)}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Link>
  );
}

function Guardian() {
  const { m } = useI18n();
  const session = useRequireSession();
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const learners = useQuery({
    queryKey: ["guarded"],
    queryFn: () => account.listGuardedLearners({ timeZone: timeZone() }),
    enabled: !!session,
    staleTime: 0,
  });
  const accept = useMutation({
    mutationFn: () => account.acceptGuardianInvite({ code }),
    onSuccess: () => {
      setCode("");
      return qc.invalidateQueries({ queryKey: ["guarded"] });
    },
  });

  if (!session || learners.isPending) return <Spinner label={m.loading} />;
  if (learners.isError) return <LoadError error={learners.error} onRetry={() => learners.refetch()} />;

  function submit(e: FormEvent) {
    e.preventDefault();
    accept.mutate();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{m.guardedTitle}</h1>
        {learners.data.learners.length === 0 && <p className="text-muted">{m.guardedNone}</p>}
      </div>
      <div className="grid items-start gap-4 md:grid-cols-2">
        {learners.data.learners.map((l) => (
          <LearnerCard key={l.learnerId} learner={l} />
        ))}
        <GuardianTools />
        <Card className="p-5">
          <form onSubmit={submit} className="space-y-3">
            <h2 className="font-semibold">{m.addLearner}</h2>
            <p className="text-sm text-muted">{m.guardedBody}</p>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{m.enterCode}</span>
              <input value={code} onChange={(e) => setCode(e.target.value)} required autoComplete="off" className={field} />
            </label>
            {accept.isError && <ErrorNote message={m.codeInvalid} />}
            <Button type="submit" disabled={accept.isPending}>
              {m.accept}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
