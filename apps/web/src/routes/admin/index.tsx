import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { LoadError } from "../../components/LoadError.tsx";
import { Card, Spinner } from "../../components/ui.tsx";
import { useAdminText } from "../../lib/admin-text.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { admin } from "../../lib/rpc.ts";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const q = useQuery({ queryKey: ["admin", "overview"], queryFn: () => admin.getOverview({}), staleTime: 0 });
  if (q.isPending) return <Spinner label={m.loading} />;
  if (q.isError) return <LoadError error={q.error} onRetry={() => q.refetch()} />;
  const o = q.data;
  const stat = (label: string, value: number, to: "/admin/verifications" | "/admin/register" | "/admin/costs") => (
    <Link to={to} className="block">
      <Card className="h-full p-5 transition hover:border-accent/50">
        <div className="text-sm text-muted">{label}</div>
        <div className={`text-3xl font-semibold ${value > 0 ? "text-warn" : ""}`}>{value}</div>
      </Card>
    </Link>
  );
  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      {stat(t.waitingForms, o.waitingForms, "/admin/verifications")}
      {stat(t.staleChecks, o.staleChecks, "/admin/register")}
      {stat(t.recentAlarms, o.recentAlarms, "/admin/costs")}
      <Card className="space-y-2 p-5">
        <h2 className="font-semibold">{t.brokenRoutes}</h2>
        {o.brokenRoutes.length === 0 ? (
          <p className="text-sm text-muted">{t.none}</p>
        ) : (
          <ul className="space-y-1 text-sm text-warn">
            {o.brokenRoutes.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
      </Card>
      <Card className="space-y-2 p-5">
        <h2 className="font-semibold">{t.lastRetention}</h2>
        <p className="text-sm">{o.lastRetentionAt === 0n ? t.never : new Date(Number(o.lastRetentionAt)).toLocaleString(locale)}</p>
        {o.lastRetentionDetail && <p className="text-sm text-muted">{t.retentionDetail(JSON.parse(o.lastRetentionDetail))}</p>}
      </Card>
      <Card className="space-y-2 p-5 md:col-span-2">
        <h2 className="font-semibold">{t.learners}</h2>
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          {o.bands.map((b) => (
            <div key={b.band}>
              <dt className="text-sm text-muted">{t.bands[b.band] ?? b.band}</dt>
              <dd className="text-xl font-semibold">{b.count}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
