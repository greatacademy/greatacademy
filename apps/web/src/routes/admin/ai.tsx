import type { Route as AiRoute, Provider } from "@ga/proto/admin/v1/admin_pb";
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

export const Route = createFileRoute("/admin/ai")({ component: AiServices });

/** USES are the uses of a route, in the order the page groups them. */
const USES = ["judgment", "conversation", "stt", "tts", "pronunciation"] as const;

/** TEXT_USES are the uses served by a text model through pi-ai, with a prompt version. */
const TEXT_USES: readonly string[] = ["judgment", "conversation"];

/** NO_API stands for a vendor set up by hand without a text API, since a list cannot hold an empty value. */
const NO_API = "none";

/** budgetField reads an optional budget from a form: empty leaves it unset. */
function budgetField(form: FormData, name: string): number | undefined {
  const value = String(form.get(name) ?? "").trim();
  return value === "" ? undefined : Number(value);
}

function ProviderForm({ provider, onDone }: { provider?: Provider; onDone: () => void }) {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const catalog = useCatalog();
  const [picked, setPicked] = useState(provider ? provider.catalog : undefined);
  const vendor = catalog.data?.providers.find((c) => c.id === picked);
  const save = useMutation({
    mutationFn: (form: FormData) =>
      admin.saveProvider({
        provider: {
          id: provider?.id ?? "",
          name: String(form.get("name")),
          catalog: picked ?? "",
          api: form.get("api") === NO_API ? "" : String(form.get("api") ?? ""),
          baseUrl: String(form.get("baseUrl")),
          enabled: form.get("enabled") === "on",
          dailyBudget: budgetField(form, "dailyBudget"),
          monthlyBudget: budgetField(form, "monthlyBudget"),
        },
        apiKey: String(form.get("apiKey")),
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
  const CUSTOM = "custom";
  // A new vendor starts with a choice from the catalog; the fields below appear once it is made.
  if (catalog.isPending) return <Spinner label={m.loading} />;
  const options = [
    ...(catalog.data?.providers ?? []).map((c) => ({ value: c.id, label: c.name })),
    { value: CUSTOM, label: t.customVendor },
  ];
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5">
        <SelectField
          label={t.vendor}
          name="vendor"
          required
          placeholder={t.chooseProvider}
          defaultValue={picked === undefined ? undefined : picked || CUSTOM}
          disabled={!!provider}
          options={options}
          onValueChange={(v) => setPicked(v === CUSTOM ? "" : v)}
        />
        {!provider && <p className="text-xs text-muted">{t.vendorHint}</p>}
      </div>
      {picked !== undefined && (
        <div key={picked} className="space-y-3">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.name}</span>
            <input name="name" required defaultValue={provider?.name ?? vendor?.name} className={field} />
          </label>
          {vendor ? (
            <>
              <input type="hidden" name="api" value={vendor.api} />
              <p className="text-sm text-muted">{t.apiOf(t.apis[vendor.api] ?? vendor.api)}</p>
            </>
          ) : (
            <div className="space-y-1.5">
              <SelectField
                label={t.api}
                name="api"
                required
                placeholder={t.chooseProvider}
                defaultValue={provider ? provider.api || NO_API : undefined}
                options={[...Object.entries(t.apis).map(([value, label]) => ({ value, label })), { value: NO_API, label: t.noApi }]}
              />
              <p className="text-xs text-muted">{t.apiHint}</p>
            </div>
          )}
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.baseUrl}</span>
            <input
              name="baseUrl"
              type="url"
              defaultValue={provider ? provider.baseUrl : vendor?.baseUrl}
              placeholder={vendor?.baseUrl}
              autoComplete="off"
              className={field}
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.apiKey}</span>
            <input name="apiKey" type="password" autoComplete="new-password" className={field} />
            <span className="block text-xs font-normal text-muted">{t.apiKeyHint}</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{t.dailyBudget}</span>
              <input name="dailyBudget" type="number" min="0" step="0.01" defaultValue={provider?.dailyBudget} className={field} />
            </label>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{t.monthlyBudget}</span>
              <input name="monthlyBudget" type="number" min="0" step="0.01" defaultValue={provider?.monthlyBudget} className={field} />
            </label>
          </div>
          <p className="text-xs text-muted">{t.budgetHint}</p>
          <label className="flex items-center gap-2 text-sm">
            <input name="enabled" type="checkbox" defaultChecked={provider?.enabled} />
            {t.enabled}
          </label>
        </div>
      )}
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

function ProviderCard({ provider, uses }: { provider: Provider; uses: readonly string[] }) {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const remove = useMutation({
    mutationFn: () => admin.deleteProvider({ id: provider.id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
  return (
    <Card className="space-y-2 p-5">
      {editing ? (
        <ProviderForm provider={provider} onDone={() => setEditing(false)} />
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="min-w-0 truncate font-semibold">{provider.name}</h3>
            <span className={`text-sm ${provider.enabled ? "text-good" : "text-muted"}`}>{provider.enabled ? t.enabled : t.disabled}</span>
          </div>
          <p className="text-sm text-muted">{uses.length > 0 ? uses.map((u) => t.uses[u] ?? u).join(" · ") : t.noUses}</p>
          {provider.api && <p className="text-sm text-muted">{t.apiOf(t.apis[provider.api] ?? provider.api)}</p>}
          <p className="text-sm text-muted">{provider.keyHint ? t.keyEnds(provider.keyHint) : t.noKey}</p>
          {provider.dailyBudget !== undefined || provider.monthlyBudget !== undefined ? (
            <p className="text-sm text-muted">
              {t.budgets(
                provider.dailyBudget === undefined ? t.noLimit : usd(provider.dailyBudget),
                provider.monthlyBudget === undefined ? t.noLimit : usd(provider.monthlyBudget),
              )}
            </p>
          ) : (
            <p className="text-sm text-muted">{t.noBudgets}</p>
          )}
          {remove.isError && <ErrorNote message={errorText(remove.error, locale, m.error)} />}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              {t.edit}
            </Button>
            <Button variant="ghost" onClick={() => remove.mutate()} disabled={remove.isPending}>
              {t.remove}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

function RouteForm({ providers, route, onDone }: { providers: readonly Provider[]; route?: AiRoute; onDone: () => void }) {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const [draftNote, setDraftNote] = useState(false);
  const catalog = useCatalog();
  const [use, setUse] = useState<string>(route?.use ?? "judgment");
  const text = TEXT_USES.includes(use);
  const [providerId, setProviderId] = useState(route?.providerId ?? "");
  const models = catalogModels(catalog.data?.providers, providers, providerId);
  const [modelId, setModelId] = useState(route?.model ?? "");
  const known = models.find((x) => x.id === modelId);
  const listId = useId();
  const save = useMutation({
    mutationFn: (form: FormData) => {
      const live = form.get("live") === "on";
      return admin
        .saveRoute({
          route: {
            use,
            target: String(form.get("target")),
            position: String(form.get("position")),
            providerId: String(form.get("provider")),
            model: String(form.get("model")),
            promptVersion: String(form.get("prompt") ?? ""),
            voice: String(form.get("voice") ?? ""),
            live,
          },
        })
        .then((r) => ({ asked: live, live: r.live }));
    },
    onSuccess: async ({ asked, live }) => {
      await qc.invalidateQueries({ queryKey: ["admin"] });
      if (asked && !live) setDraftNote(true);
      else onDone();
    },
  });
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDraftNote(false);
    save.mutate(new FormData(e.currentTarget));
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <SelectField
        label={t.use}
        name="use"
        required
        defaultValue={use}
        disabled={!!route}
        options={USES.map((value) => ({ value, label: t.uses[value] ?? value }))}
        onValueChange={setUse}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.targets[use]}</span>
          <input name="target" required defaultValue={route?.target} readOnly={!!route} autoComplete="off" className={field} />
        </label>
        <div>
          <SelectField
            label={t.position}
            name="position"
            defaultValue={route?.position ?? "primary"}
            disabled={!!route}
            options={Object.entries(t.positions).map(([value, label]) => ({ value, label }))}
          />
          {route && <input type="hidden" name="position" value={route.position} />}
        </div>
      </div>
      <SelectField
        label={t.provider}
        name="provider"
        required
        placeholder={t.chooseProvider}
        defaultValue={route?.providerId}
        options={providers.filter((p) => !text || p.api).map((p) => ({ value: p.id, label: p.name }))}
        onValueChange={setProviderId}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.model}</span>
          <input
            name="model"
            required
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            list={models.length > 0 ? listId : undefined}
            autoComplete="off"
            className={field}
          />
          {models.length > 0 && (
            <span className="block text-xs font-normal text-muted">
              {known ? t.listPrice(usd(known.inputPerMillion), usd(known.outputPerMillion)) : t.modelHint}
            </span>
          )}
          <ModelOptions id={listId} models={models} />
        </label>
        {text && (
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.promptVersion}</span>
            <input name="prompt" required defaultValue={route?.promptVersion} autoComplete="off" className={field} />
          </label>
        )}
        {use === "tts" && (
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.voice}</span>
            <input name="voice" required defaultValue={route?.voice} autoComplete="off" className={field} />
          </label>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input name="live" type="checkbox" defaultChecked={route?.live} />
        {t.setLive}
      </label>
      {draftNote && <p className="text-sm text-warn">{t.backToDraft}</p>}
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

function RouteCard({ route, providers }: { route: AiRoute; providers: readonly Provider[] }) {
  const t = useAdminText();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const remove = useMutation({
    mutationFn: () => admin.deleteRoute({ use: route.use, target: route.target, position: route.position }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
  if (editing)
    return (
      <Card className="p-5">
        <RouteForm route={route} providers={providers} onDone={() => setEditing(false)} />
      </Card>
    );
  return (
    <Card className="space-y-2 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="min-w-0 truncate font-semibold">
          {route.target} · {t.positions[route.position] ?? route.position}
        </h3>
        <span className={`text-sm ${route.live ? "text-good" : "text-muted"}`}>{route.live ? t.live : t.draft}</span>
      </div>
      <p className="text-sm text-muted">
        {[providers.find((p) => p.id === route.providerId)?.name, route.model, route.promptVersion || route.voice]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <p className="text-sm">
        <span className={route.calibrated ? "text-good" : "text-warn"}>{route.calibrated ? t.calibrated : t.notCalibrated}</span>
        {" · "}
        <span className={route.priced ? "text-good" : "text-warn"}>{route.priced ? t.priced : t.notPriced}</span>
        {" · "}
        <span className={route.qualifies ? "text-good" : "text-warn"}>{route.qualifies ? t.qualifies : t.notQualifies}</span>
      </p>
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

function AiServices() {
  const { m } = useI18n();
  const t = useAdminText();
  const providers = useQuery({ queryKey: ["admin", "providers"], queryFn: () => admin.listProviders({}), staleTime: 0 });
  const routes = useQuery({ queryKey: ["admin", "routes"], queryFn: () => admin.listRoutes({}), staleTime: 0 });
  const [addingProvider, setAddingProvider] = useState(false);
  const [addingRoute, setAddingRoute] = useState(false);
  if (providers.isPending || routes.isPending) return <Spinner label={m.loading} />;
  if (providers.isError) return <LoadError error={providers.error} onRetry={() => providers.refetch()} />;
  if (routes.isError) return <LoadError error={routes.error} onRetry={() => routes.refetch()} />;
  const list = providers.data.providers;
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.providers}</h2>
        {list.length === 0 && <p className="text-muted">{t.noProviders}</p>}
        <div className="grid items-start gap-4 md:grid-cols-2">
          {list.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              uses={USES.filter((u) => routes.data.routes.some((r) => r.providerId === p.id && r.use === u))}
            />
          ))}
          {addingProvider && (
            <Card className="p-5">
              <ProviderForm onDone={() => setAddingProvider(false)} />
            </Card>
          )}
        </div>
        {!addingProvider && (
          <Button variant="secondary" onClick={() => setAddingProvider(true)}>
            {t.newProvider}
          </Button>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.routes}</h2>
        <p className="text-sm text-muted">
          {t.routesNote} {t.calibrationNote}
        </p>
        {routes.data.routes.length === 0 && <p className="text-muted">{t.noRoutes}</p>}
        {USES.map((u) => {
          const group = routes.data.routes.filter((r) => r.use === u);
          if (group.length === 0) return null;
          return (
            <div key={u} className="space-y-3">
              <h3 className="font-semibold">{t.uses[u]}</h3>
              <div className="grid items-start gap-4 md:grid-cols-2">
                {group.map((r) => (
                  <RouteCard key={`${r.target}/${r.position}`} route={r} providers={list} />
                ))}
              </div>
            </div>
          );
        })}
        {addingRoute && (
          <Card className="p-5 md:max-w-[calc(50%-0.5rem)]">
            <RouteForm providers={list} onDone={() => setAddingRoute(false)} />
          </Card>
        )}
        {!addingRoute && list.length > 0 && (
          <Button variant="secondary" onClick={() => setAddingRoute(true)}>
            {t.newRoute}
          </Button>
        )}
      </section>
    </div>
  );
}
