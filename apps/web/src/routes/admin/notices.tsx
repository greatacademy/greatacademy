import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";

import { field } from "../../components/AuthForm.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useAdminText } from "../../lib/admin-text.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { errorText } from "../../lib/privacy-text.ts";
import { admin } from "../../lib/rpc.ts";

export const Route = createFileRoute("/admin/notices")({ component: Notices });

function Notices() {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const notices = useQuery({ queryKey: ["admin", "notices"], queryFn: () => admin.listNotices({}), staleTime: 0 });
  const providers = useQuery({ queryKey: ["admin", "providers"], queryFn: () => admin.listProviders({}), staleTime: 0 });
  const publish = useMutation({
    mutationFn: (req: { version: string; vendors: string[] }) => admin.publishNotice(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
  if (notices.isPending || providers.isPending) return <Spinner label={m.loading} />;
  if (notices.isError) return <LoadError error={notices.error} onRetry={() => notices.refetch()} />;
  if (providers.isError) return <LoadError error={providers.error} onRetry={() => providers.refetch()} />;
  const name = (id: string) => providers.data.providers.find((p) => p.id === id)?.name ?? id;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    publish.mutate({ version: String(data.get("version")), vendors: data.getAll("vendor").map(String) }, { onSuccess: () => form.reset() });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{t.noticeNote}</p>
      {notices.data.notices.length === 0 && <p className="text-muted">{t.noNotices}</p>}
      {notices.data.notices.map((n) => (
        <Card key={n.version} className="space-y-1 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-semibold">{n.version}</h2>
            <span className="text-sm text-muted">{new Date(Number(n.publishedAt)).toLocaleDateString(locale)}</span>
          </div>
          <p className="text-sm text-muted">
            {t.vendorsNamed}: {n.vendors.length ? n.vendors.map(name).join(", ") : t.none}
          </p>
        </Card>
      ))}
      <Card className="p-5">
        <form onSubmit={submit} className="space-y-3">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.version}</span>
            <input name="version" required pattern="[0-9a-zA-Z.\-]+" autoComplete="off" className={field} />
          </label>
          <fieldset className="space-y-1.5 text-sm">
            <legend className="font-medium">{t.vendorsNamed}</legend>
            {providers.data.providers.map((p) => (
              <label key={p.id} className="flex items-center gap-2">
                <input name="vendor" type="checkbox" value={p.id} />
                {p.name}
              </label>
            ))}
          </fieldset>
          {publish.isError && <ErrorNote message={errorText(publish.error, locale, m.error)} />}
          <Button type="submit" disabled={publish.isPending}>
            {t.publish}
          </Button>
        </form>
      </Card>
    </div>
  );
}
