import type { Price, Provider, ProviderSpend } from "@ga/proto/admin/v1/admin_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useId, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { SelectField } from "../../components/SelectField.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useAdminText } from "../../lib/admin-text.ts";
import { catalogModels, ModelOptions, useCatalog } from "../../lib/catalog.tsx";
import { useI18n } from "../../lib/i18n.tsx";
import { errorText } from "../../lib/privacy-text.ts";
import { admin } from "../../lib/rpc.ts";
import { usd } from "../../lib/usd.ts";

export const Route = createFileRoute("/admin/costs")({ component: Costs });

/** Meter shows a sum spent against a budget, warning from 80% and stopping at 100%. */
function Meter({ label, spent, budget }: { label: string; spent: number; budget: number | undefined }) {
  const t = useAdminText();
  if (budget === undefined)
    return (
      <div className="space-y-1">
        <div className="text-sm text-muted">{label}</div>
        <div className="text-sm text-muted">{t.unbudgeted(usd(spent))}</div>
      </div>
    );
  const share = budget > 0 ? spent / budget : 1;
  const tone = share >= 1 ? "bg-bad" : share >= 0.8 ? "bg-warn" : "bg-accent";
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-muted">{label}</span>
        <span className={share >= 1 ? "font-medium text-bad" : ""}>{t.ofBudget(usd(spent), usd(budget))}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div className={`h-full ${tone}`} style={{ width: `${Math.min(100, share * 100)}%` }} />
      </div>
    </div>
  );
}

function SpendCard({ spend, provider }: { spend: ProviderSpend; provider: Provider | undefined }) {
  const t = useAdminText();
  const out =
    (spend.dailyBudget !== undefined && spend.day >= spend.dailyBudget) ||
    (spend.monthlyBudget !== undefined && spend.month >= spend.monthlyBudget);
  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="min-w-0 truncate font-semibold">{provider?.name ?? spend.providerId}</h3>
        {out && <span className="text-sm text-bad">{t.spent}</span>}
      </div>
      <Meter label={t.today} spent={spend.day} budget={spend.dailyBudget} />
      <Meter label={t.thisMonth} spent={spend.month} budget={spend.monthlyBudget} />
    </Card>
  );
}

function PriceForm({ providers, price, onDone }: { providers: readonly Provider[]; price?: Price; onDone: () => void }) {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const catalog = useCatalog();
  const [providerId, setProviderId] = useState(price?.providerId ?? "");
  const models = catalogModels(catalog.data?.providers, providers, providerId);
  const [model, setModel] = useState(price?.model ?? "");
  const [input, setInput] = useState(price ? String(price.inputPerMillion) : "");
  const [output, setOutput] = useState(price ? String(price.outputPerMillion) : "");
  const [filled, setFilled] = useState(false);
  const listId = useId();
  /** chooseModel fills a new price from the vendor's list price, which the administrator then corrects to what they pay. */
  function chooseModel(id: string) {
    setModel(id);
    const known = models.find((x) => x.id === id);
    if (price || !known) return;
    setInput(String(known.inputPerMillion));
    setOutput(String(known.outputPerMillion));
    setFilled(true);
  }
  const save = useMutation({
    mutationFn: (form: FormData) =>
      admin.savePrice({
        price: {
          providerId: String(form.get("provider")),
          model: String(form.get("model")),
          inputPerMillion: Number(form.get("input")),
          outputPerMillion: Number(form.get("output")),
        },
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin"] });
      onDone();
    },
  });
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    save.mutate(new FormData(e.currentTarget));
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <SelectField
          label={t.provider}
          name="provider"
          required
          placeholder={t.chooseProvider}
          defaultValue={price?.providerId}
          disabled={!!price}
          options={providers.map((p) => ({ value: p.id, label: p.name }))}
          onValueChange={setProviderId}
        />
        {price && <input type="hidden" name="provider" value={price.providerId} />}
      </div>
      <label className="block space-y-1.5 text-sm font-medium">
        <span>{t.model}</span>
        <input
          name="model"
          required
          value={model}
          onChange={(e) => chooseModel(e.target.value)}
          readOnly={!!price}
          list={!price && models.length > 0 ? listId : undefined}
          autoComplete="off"
          className={field}
        />
        {!price && models.length > 0 && <span className="block text-xs font-normal text-muted">{t.modelHint}</span>}
        <ModelOptions id={listId} models={models} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.inputPrice}</span>
          <input
            name="input"
            type="number"
            required
            min="0"
            step="any"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={field}
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.outputPrice}</span>
          <input
            name="output"
            type="number"
            required
            min="0"
            step="any"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className={field}
          />
        </label>
      </div>
      {filled && <p className="text-xs text-muted">{t.priceFilled}</p>}
      {save.isError && <ErrorNote message={errorText(save.error, locale, m.error)} />}
      <div className="flex gap-2">
        <Button type="submit" disabled={save.isPending}>
          {t.save}
        </Button>
        <Button variant="ghost" onClick={onDone}>
          {t.cancel}
        </Button>
      </div>
    </form>
  );
}

function PriceCard({ price, providers }: { price: Price; providers: readonly Provider[] }) {
  const t = useAdminText();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const remove = useMutation({
    mutationFn: () => admin.deletePrice({ providerId: price.providerId, model: price.model }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
  if (editing)
    return (
      <Card className="p-5">
        <PriceForm price={price} providers={providers} onDone={() => setEditing(false)} />
      </Card>
    );
  return (
    <Card className="space-y-2 p-5">
      <h3 className="min-w-0 truncate font-semibold">
        {providers.find((p) => p.id === price.providerId)?.name} · {price.model}
      </h3>
      <p className="text-sm text-muted">{t.pricePer(`$${price.inputPerMillion}`, `$${price.outputPerMillion}`)}</p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setEditing(true)}>
          {t.edit}
        </Button>
        <Button variant="ghost" onClick={() => remove.mutate()} disabled={remove.isPending}>
          {t.remove}
        </Button>
      </div>
    </Card>
  );
}

/** Costs shows what AI vendors cost against their budgets, the prices behind it, what learners cost, and the alarms. */
function Costs() {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const costs = useQuery({ queryKey: ["admin", "costs"], queryFn: () => admin.getCosts({}), staleTime: 0 });
  const priceList = useQuery({ queryKey: ["admin", "prices"], queryFn: () => admin.listPrices({}), staleTime: 0 });
  const providers = useQuery({ queryKey: ["admin", "providers"], queryFn: () => admin.listProviders({}), staleTime: 0 });
  const [adding, setAdding] = useState(false);
  if (costs.isPending || priceList.isPending || providers.isPending) return <Spinner label={m.loading} />;
  if (costs.isError) return <LoadError error={costs.error} onRetry={() => costs.refetch()} />;
  if (priceList.isError) return <LoadError error={priceList.error} onRetry={() => priceList.refetch()} />;
  if (providers.isError) return <LoadError error={providers.error} onRetry={() => providers.refetch()} />;
  const c = costs.data;
  const list = providers.data.providers;
  const kindOf = (detail: string) => t.alarmKinds[detail.split(" ")[0] ?? ""] ?? detail;
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.spending}</h2>
        <p className="text-sm text-muted">{t.budgetHint}</p>
        <div className="grid items-start gap-4 md:grid-cols-2">
          {c.providers.map((s) => (
            <SpendCard key={s.providerId} spend={s} provider={list.find((p) => p.id === s.providerId)} />
          ))}
          <Card className="space-y-2 p-5">
            <h3 className="font-semibold">{t.perLearner}</h3>
            <p className="text-2xl font-semibold">{usd(c.monthLearners > 0 ? c.monthCost / c.monthLearners : 0)}</p>
            <p className="text-sm text-muted">
              {t.perLearnerDetail(c.monthLearners, usd(c.monthCost), usd(c.monthLearners > 0 ? c.monthCost / c.monthLearners : 0))}
            </p>
          </Card>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.alarms}</h2>
        <p className="text-sm text-muted">{t.alarmNote}</p>
        {c.alarms.length === 0 ? (
          <p className="text-muted">{t.noAlarms}</p>
        ) : (
          <Card className="divide-y divide-line p-0">
            {c.alarms.map((a) => (
              <div
                key={`${a.at}-${a.target}-${a.detail}`}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm"
              >
                <span className="min-w-0">
                  <span className="font-medium text-warn">{kindOf(a.detail)}</span> · {a.target} ·{" "}
                  <span className="text-muted">{a.detail}</span>
                </span>
                <span className="text-muted">{new Date(Number(a.at)).toLocaleString(locale)}</span>
              </div>
            ))}
          </Card>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.prices}</h2>
        <p className="text-sm text-muted">{t.priceNote}</p>
        {priceList.data.prices.length === 0 && <p className="text-muted">{t.noPrices}</p>}
        <div className="grid items-start gap-4 md:grid-cols-2">
          {priceList.data.prices.map((p) => (
            <PriceCard key={`${p.providerId}/${p.model}`} price={p} providers={list} />
          ))}
          {adding && (
            <Card className="p-5">
              <PriceForm providers={list} onDone={() => setAdding(false)} />
            </Card>
          )}
        </div>
        {!adding && list.length > 0 && (
          <Button variant="secondary" onClick={() => setAdding(true)}>
            {t.newPrice}
          </Button>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.topLearners}</h2>
        {c.topLearners.length === 0 ? (
          <p className="text-muted">{t.none}</p>
        ) : (
          <Card className="divide-y divide-line p-0">
            {c.topLearners.map((l) => (
              <div key={l.email} className="flex items-baseline justify-between gap-4 px-5 py-3 text-sm">
                <span className="min-w-0 truncate">{l.email}</span>
                <span className="shrink-0 text-muted">
                  {t.calls(l.calls)} · <span className="text-ink">{usd(l.cost)}</span>
                </span>
              </div>
            ))}
          </Card>
        )}
      </section>
    </div>
  );
}
