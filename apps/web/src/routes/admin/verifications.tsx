import type { Verification } from "@ga/proto/admin/v1/admin_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useAdminText } from "../../lib/admin-text.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { errorText } from "../../lib/privacy-text.ts";
import { admin } from "../../lib/rpc.ts";

export const Route = createFileRoute("/admin/verifications")({ component: Verifications });

/** FormView shows an uploaded form. The server checked its first bytes and the Blob's type is one of PDF, PNG or JPEG, so the browser never treats it as a page. */
function FormView({ id }: { id: string }) {
  const { m } = useI18n();
  const t = useAdminText();
  const form = useQuery({ queryKey: ["admin", "form", id], queryFn: () => admin.getVerificationForm({ id }), gcTime: 0, staleTime: 0 });
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!form.data) return;
    const u = URL.createObjectURL(new Blob([new Uint8Array(form.data.form)], { type: form.data.contentType }));
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [form.data]);
  if (form.isError) return <LoadError error={form.error} onRetry={() => form.refetch()} />;
  if (!url || !form.data) return <Spinner label={m.loading} />;
  return form.data.contentType === "application/pdf" ? (
    <div className="space-y-2">
      <iframe title={t.formTitle} src={url} className="h-[70vh] w-full rounded-lg border border-line" />
      <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-accent">
        {t.openInTab}
      </a>
    </div>
  ) : (
    <img alt={t.formTitle} src={url} className="max-h-[70vh] rounded-lg border border-line" />
  );
}

function Row({ v }: { v: Verification }) {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const decide = useMutation({
    mutationFn: (approve: boolean) => admin.decideVerification({ id: v.id, approve, reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
  return (
    <Card className="space-y-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium">{v.email}</div>
          <div className="text-sm text-muted">
            {t.submitted} {new Date(Number(v.submittedAt)).toLocaleString(locale)}
          </div>
        </div>
        {!open && (
          <Button variant="secondary" onClick={() => setOpen(true)}>
            {t.openForm}
          </Button>
        )}
      </div>
      {open && (
        <>
          <FormView id={v.id} />
          <p className="text-sm text-muted">{t.formDeleted}</p>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.reason}</span>
            <input value={reason} onChange={(e) => setReason(e.target.value)} className={field} />
          </label>
          {decide.isError && <ErrorNote message={errorText(decide.error, locale, m.error)} />}
          <div className="flex gap-2">
            <Button onClick={() => decide.mutate(true)} disabled={decide.isPending}>
              {t.approve}
            </Button>
            <Button variant="secondary" onClick={() => decide.mutate(false)} disabled={decide.isPending}>
              {t.refuse}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

function Verifications() {
  const { m } = useI18n();
  const t = useAdminText();
  const q = useQuery({ queryKey: ["admin", "verifications"], queryFn: () => admin.listVerifications({}), staleTime: 0 });
  if (q.isPending) return <Spinner label={m.loading} />;
  if (q.isError) return <LoadError error={q.error} onRetry={() => q.refetch()} />;
  if (q.data.verifications.length === 0) return <p className="text-muted">{t.noForms}</p>;
  return (
    <div className="space-y-4">
      {q.data.verifications.map((v) => (
        <Row key={v.id} v={v} />
      ))}
    </div>
  );
}
