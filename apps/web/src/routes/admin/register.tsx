import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { SelectField } from "../../components/SelectField.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { type AdminText, useAdminText } from "../../lib/admin-text.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { errorText, regionName } from "../../lib/privacy-text.ts";
import { admin } from "../../lib/rpc.ts";

/** DATA_REGIONS are the places a vendor may process a market's data in: the European Union and the countries vendors host in. */
const DATA_REGIONS = ["US", "EU", "GB", "CH", "CA", "AU", "JP", "KR", "SG", "HK", "TW", "IN", "BR", "CN"] as const;

export const Route = createFileRoute("/admin/register")({ component: Register });

const conditions = [
  "servesMarket",
  "minorsAllowed",
  "noTraining",
  "shortRetention",
  "processingAgreement",
  "transferMechanism",
] as const satisfies readonly (keyof AdminText["conditions"])[];

function Register() {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const entries = useQuery({ queryKey: ["admin", "register"], queryFn: () => admin.listRegister({}), staleTime: 0 });
  const providers = useQuery({ queryKey: ["admin", "providers"], queryFn: () => admin.listProviders({}), staleTime: 0 });
  const markets = useQuery({ queryKey: ["admin", "markets"], queryFn: () => admin.listMarkets({}), staleTime: 0 });
  const [adding, setAdding] = useState(false);
  const save = useMutation({
    mutationFn: (form: FormData) =>
      admin.saveRegisterEntry({
        entry: {
          providerId: String(form.get("provider")),
          country: String(form.get("country")),
          region: String(form.get("region")),
          notes: String(form.get("notes")),
          ...Object.fromEntries(conditions.map((c) => [c, form.get(c) === "on"])),
        },
      }),
    onSuccess: async () => {
      setAdding(false);
      await qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
  if (entries.isPending || providers.isPending || markets.isPending) return <Spinner label={m.loading} />;
  if (entries.isError) return <LoadError error={entries.error} onRetry={() => entries.refetch()} />;
  if (providers.isError) return <LoadError error={providers.error} onRetry={() => providers.refetch()} />;
  if (markets.isError) return <LoadError error={markets.error} onRetry={() => markets.refetch()} />;
  const name = (id: string) => providers.data.providers.find((p) => p.id === id)?.name ?? id;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    save.mutate(new FormData(e.currentTarget));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{t.registerNote}</p>
      {entries.data.entries.length === 0 && <p className="text-muted">{t.noEntries}</p>}
      <div className="grid items-start gap-4 md:grid-cols-2">
        {entries.data.entries.map((e) => (
          <Card key={`${e.providerId}/${e.country}`} className="space-y-2 p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="min-w-0 truncate font-semibold">
                {name(e.providerId)} · {regionName(e.country, locale)}
              </h2>
              <span className={`text-sm ${e.valid ? "text-good" : "text-warn"}`}>{e.valid ? t.valid : t.invalid}</span>
            </div>
            <ul className="space-y-0.5 text-sm">
              {conditions.map((c) => (
                <li key={c} className={e[c] ? "" : "text-warn"}>
                  {e[c] ? "✓" : "✗"} {t.conditions[c]}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">
              {t.checkedOn(new Date(Number(e.checkedAt)).toLocaleDateString(locale))}
              {e.region && ` · ${e.region}`}
            </p>
            {e.notes && <p className="text-sm text-muted">{e.notes}</p>}
          </Card>
        ))}
      </div>
      {adding ? (
        <Card className="p-5">
          <form onSubmit={submit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label={t.provider}
                name="provider"
                required
                placeholder={t.chooseProvider}
                options={providers.data.providers.map((p) => ({ value: p.id, label: p.name }))}
              />
              <SelectField
                label={t.country}
                name="country"
                required
                placeholder={t.chooseMarket}
                options={markets.data.markets.map((x) => ({ value: x.country, label: regionName(x.country, locale) }))}
              />
            </div>
            {conditions.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input name={c} type="checkbox" />
                {t.conditions[c]}
              </label>
            ))}
            <div className="space-y-1.5">
              <SelectField
                label={t.region}
                name="region"
                required
                placeholder={t.chooseRegion}
                options={DATA_REGIONS.map((code) => ({ value: code, label: `${regionName(code, locale)} · ${code}` }))}
              />
              <p className="text-xs text-muted">{t.regionHint}</p>
            </div>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{t.notes}</span>
              <textarea name="notes" rows={2} className={field} />
            </label>
            {save.isError && <ErrorNote message={errorText(save.error, locale, m.error)} />}
            <div className="flex gap-2">
              <Button type="submit" disabled={save.isPending}>
                {t.save}
              </Button>
              <Button variant="ghost" onClick={() => setAdding(false)}>
                {t.cancel}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        providers.data.providers.length > 0 && (
          <Button variant="secondary" onClick={() => setAdding(true)}>
            {t.newEntry}
          </Button>
        )
      )}
    </div>
  );
}
