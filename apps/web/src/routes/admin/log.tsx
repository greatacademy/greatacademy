import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { LoadError } from "../../components/LoadError.tsx";
import { Card, Spinner } from "../../components/ui.tsx";
import { useAdminText } from "../../lib/admin-text.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { admin } from "../../lib/rpc.ts";

export const Route = createFileRoute("/admin/log")({ component: Log });

function Log() {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const [kind, setKind] = useState("");
  const q = useQuery({ queryKey: ["admin", "log", kind], queryFn: () => admin.listLog({ kind }), staleTime: 0 });
  const chip = (value: string, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => setKind(value)}
      className={`shrink-0 rounded-lg px-2.5 py-1 text-sm ${kind === value ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"}`}
    >
      {label}
    </button>
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {chip("", t.allKinds)}
        {Object.entries(t.logKinds).map(([k, label]) => chip(k, label))}
      </div>
      {q.isPending ? (
        <Spinner label={m.loading} />
      ) : q.isError ? (
        <LoadError error={q.error} onRetry={() => q.refetch()} />
      ) : q.data.entries.length === 0 ? (
        <p className="text-muted">{t.noLog}</p>
      ) : (
        <Card className="divide-y divide-line p-0">
          {q.data.entries.map((e) => (
            <div key={`${e.at}-${e.action}-${e.target}`} className="space-y-0.5 px-5 py-3 text-sm">
              <div className="flex flex-wrap justify-between gap-x-4">
                <span className="font-mono text-xs">{e.action}</span>
                <span className="text-muted">{new Date(Number(e.at)).toLocaleString(locale)}</span>
              </div>
              <div className="break-all text-muted">
                {e.target}
                {e.detail && ` · ${e.detail}`}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
