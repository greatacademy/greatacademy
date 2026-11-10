import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { SelectField } from "../../components/SelectField.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useAdminText } from "../../lib/admin-text.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { errorText } from "../../lib/privacy-text.ts";
import { admin, billing } from "../../lib/rpc.ts";

export const Route = createFileRoute("/admin/admins")({ component: Admins });

function Admins() {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "admins"], queryFn: () => admin.listAdmins({}), staleTime: 0 });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "admins"] });
  const add = useMutation({ mutationFn: (email: string) => admin.addAdmin({ email }), onSuccess: refresh });
  const remove = useMutation({ mutationFn: (userId: string) => admin.removeAdmin({ userId }), onSuccess: refresh });
  if (q.isPending) return <Spinner label={m.loading} />;
  if (q.isError) return <LoadError error={q.error} onRetry={() => q.refetch()} />;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    add.mutate(String(new FormData(form).get("email")), { onSuccess: () => form.reset() });
  }

  const failure = add.error ?? remove.error;
  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <Card className="space-y-3 p-5">
        {q.data.admins.map((a) => (
          <div key={a.userId} className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{a.email}</span>
            {a.me ? (
              <span className="shrink-0 text-muted">{t.you}</span>
            ) : (
              <Button variant="ghost" onClick={() => remove.mutate(a.userId)} disabled={remove.isPending}>
                {t.remove}
              </Button>
            )}
          </div>
        ))}
      </Card>
      <Card className="p-5">
        <form onSubmit={submit} className="space-y-3">
          <h2 className="font-semibold">{t.addAdmin}</h2>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.email}</span>
            <input name="email" type="email" required autoComplete="off" className={field} />
          </label>
          {failure && <ErrorNote message={errorText(failure, locale, m.error)} />}
          <Button type="submit" disabled={add.isPending}>
            {t.add}
          </Button>
        </form>
      </Card>
      <GrantPlan />
    </div>
  );
}

/** GrantPlan gives an account a plan without payment, for testers, reviewers and the pilot (docs/billing.md §6). */
function GrantPlan() {
  const { m, locale, tx } = useI18n();
  const t = useAdminText();
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => billing.listPlans({}) });
  const [granted, setGranted] = useState(false);
  const grant = useMutation({
    mutationFn: (r: { email: string; scope: string; days: number }) => admin.grantPlan(r),
    onSuccess: () => setGranted(true),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setGranted(false);
    grant.mutate(
      { email: String(data.get("email")), scope: String(data.get("scope")), days: Number(data.get("days")) },
      { onSuccess: () => form.reset() },
    );
  }

  return (
    <Card className="p-5">
      <form onSubmit={submit} className="space-y-3">
        <h2 className="font-semibold">{t.grantPlan}</h2>
        <p className="text-sm text-muted">{t.grantNote}</p>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.email}</span>
          <input name="email" type="email" required autoComplete="off" className={field} />
        </label>
        <SelectField
          label={t.grantScope}
          name="scope"
          required
          placeholder={t.choosePlan}
          options={(plans.data?.plans ?? []).map((p) => ({ value: p.scope, label: p.title ? tx(p.title) : p.scope }))}
        />
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.grantDays}</span>
          <input name="days" type="number" required min={1} max={366} defaultValue={30} className={field} />
        </label>
        {grant.isError && <ErrorNote message={errorText(grant.error, locale, m.error)} />}
        {granted && (
          <p role="status" className="text-sm text-good">
            {t.granted}
          </p>
        )}
        <Button type="submit" disabled={grant.isPending}>
          {t.grantPlan}
        </Button>
      </form>
    </Card>
  );
}
