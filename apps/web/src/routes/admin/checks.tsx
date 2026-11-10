import type { Check, RouteDrift } from "@ga/proto/admin/v1/admin_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { LoadError } from "../../components/LoadError.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useAdminText } from "../../lib/admin-text.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { errorText } from "../../lib/privacy-text.ts";
import { admin } from "../../lib/rpc.ts";

export const Route = createFileRoute("/admin/checks")({ component: Checks });

function Field({ label, children }: { label: string; children: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted">{label}</div>
      <p className="whitespace-pre-wrap break-words">{children}</p>
    </div>
  );
}

/** CheckCard asks a person the criterion's question on a sampled text, and shows the route's answer only after. */
function CheckCard({ check, onNext }: { check: Check; onNext: () => void }) {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const [mine, setMine] = useState<boolean>();
  const save = useMutation({
    mutationFn: (met: boolean) => admin.saveCheck({ id: check.id, met }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "drift"] }),
  });
  const answer = (met: boolean) => {
    setMine(met);
    save.mutate(met);
  };
  return (
    <Card className="space-y-4 p-5">
      <Field label={t.checkTask}>{check.task}</Field>
      {check.source && <Field label={t.checkSource}>{check.source}</Field>}
      <div className="rounded-lg border border-line bg-page p-4">
        <Field label={t.checkText}>{check.text}</Field>
      </div>
      <Field label={t.checkQuestion}>{check.question}</Field>
      {save.isError && <ErrorNote message={errorText(save.error, locale, m.error)} />}
      {save.data ? (
        <div className="space-y-3">
          <p className="text-sm">
            {t.routeSaid(save.data.routeMet)}{" "}
            <span className={save.data.routeMet === mine ? "text-good" : "font-medium text-warn"}>
              {save.data.routeMet === mine ? t.agreed : t.differed}
            </span>
          </p>
          <Button onClick={onNext}>{t.nextCheck}</Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => answer(true)} disabled={save.isPending}>
            {t.checkYes}
          </Button>
          <Button variant="secondary" onClick={() => answer(false)} disabled={save.isPending}>
            {t.checkNo}
          </Button>
        </div>
      )}
    </Card>
  );
}

function DriftRow({ route, name }: { route: RouteDrift; name: string }) {
  const t = useAdminText();
  const n = (x: number) => x.toFixed(2);
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm">
      <span className="min-w-0">
        <span className="font-medium">{route.criterion}</span> · {name} · {route.model} · {route.promptVersion}
      </span>
      <span className={route.drifting ? "font-medium text-warn" : "text-muted"}>
        {route.drifting && `${t.drifting} · `}
        {t.driftRow(
          route.checks,
          `${Math.round(route.agreement * 100)}%`,
          n(route.kappa),
          route.calibrationKappa === undefined ? "—" : n(route.calibrationKappa),
        )}
      </span>
    </div>
  );
}

/** Checks lets a person check sampled live verdicts blind, and shows how each route's verdicts compare with people's. */
function Checks() {
  const { m } = useI18n();
  const t = useAdminText();
  // A check is fetched only on request: each fetch shows a learner's text and is logged.
  const [round, setRound] = useState(0);
  const check = useQuery({
    queryKey: ["admin", "check", round],
    queryFn: () => admin.getCheck({}),
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  });
  const drift = useQuery({ queryKey: ["admin", "drift"], queryFn: () => admin.listDrift({}), staleTime: 0 });
  const vendors = useQuery({ queryKey: ["admin", "providers"], queryFn: () => admin.listProviders({}), staleTime: 0 });
  if (check.isPending || drift.isPending || vendors.isPending) return <Spinner label={m.loading} />;
  if (check.isError) return <LoadError error={check.error} onRetry={() => check.refetch()} />;
  if (drift.isError) return <LoadError error={drift.error} onRetry={() => drift.refetch()} />;
  if (vendors.isError) return <LoadError error={vendors.error} onRetry={() => vendors.refetch()} />;
  const name = (id: string) => vendors.data.providers.find((p) => p.id === id)?.name ?? id;
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">{t.checking}</h2>
          <span className="text-sm text-muted">{t.waitingChecks(check.data.waiting)}</span>
        </div>
        <p className="text-sm text-muted">{t.checkNote}</p>
        {check.data.check ? (
          <CheckCard key={check.data.check.id} check={check.data.check} onNext={() => setRound((r) => r + 1)} />
        ) : (
          <p className="text-muted">{t.noChecks}</p>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.drift}</h2>
        <p className="text-sm text-muted">{t.driftNote(drift.data.minChecks)}</p>
        {drift.data.routes.length === 0 ? (
          <p className="text-muted">{t.noDrift}</p>
        ) : (
          <Card className="divide-y divide-line p-0">
            {drift.data.routes.map((r) => (
              <DriftRow key={`${r.criterion}|${r.providerId}|${r.model}|${r.promptVersion}`} route={r} name={name(r.providerId)} />
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
