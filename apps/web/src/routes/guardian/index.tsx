import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { account, timeZone } from "../../lib/rpc.ts";

export const Route = createFileRoute("/guardian/")({ component: Guardian });

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
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{m.guardedTitle}</h1>
      {learners.data.learners.length === 0 && <p className="text-muted">{m.guardedNone}</p>}
      <div className="grid gap-2">
        {learners.data.learners.map((l) => (
          <Link key={l.learnerId} to="/guardian/$learnerId" params={{ learnerId: l.learnerId }} className="block min-w-0">
            <Card className="flex items-center justify-between gap-3 p-4 transition hover:border-accent/50">
              <span className="truncate font-medium">{l.name}</span>
              <span className="shrink-0 text-sm text-muted">
                {m.today}: {l.xp?.today ?? 0} XP · {m.goalWeek}: {l.xp?.week ?? 0}
                {l.xp?.goalWeek ? ` / ${l.xp.goalWeek}` : ""} XP
              </span>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <form onSubmit={submit} className="space-y-3">
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
  );
}
