import type { Route as AiRoute, Provider } from "@ga/proto/admin/v1/admin_pb";
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
import { admin } from "../../lib/rpc.ts";

export const Route = createFileRoute("/admin/ai")({ component: AiServices });

function ProviderForm({ provider, onDone }: { provider?: Provider; onDone: () => void }) {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const qc = useQueryClient();
  const save = useMutation({
    mutationFn: (form: FormData) =>
      admin.saveProvider({
        provider: {
          id: provider?.id ?? "",
          name: String(form.get("name")),
          kind: String(form.get("kind")),
          api: String(form.get("api")),
          baseUrl: String(form.get("baseUrl")),
          region: String(form.get("region")),
          enabled: form.get("enabled") === "on",
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
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block space-y-1.5 text-sm font-medium">
        <span>{t.name}</span>
        <input name="name" required defaultValue={provider?.name} className={field} />
      </label>
      <SelectField
        label={t.kind}
        name="kind"
        required
        defaultValue={provider?.kind ?? "model"}
        options={Object.entries(t.kinds).map(([value, label]) => ({ value, label }))}
      />
      <label className="block space-y-1.5 text-sm font-medium">
        <span>{t.api}</span>
        <input name="api" required defaultValue={provider?.api} autoComplete="off" className={field} />
      </label>
      <label className="block space-y-1.5 text-sm font-medium">
        <span>{t.baseUrl}</span>
        <input name="baseUrl" type="url" defaultValue={provider?.baseUrl} autoComplete="off" className={field} />
      </label>
      <label className="block space-y-1.5 text-sm font-medium">
        <span>{t.region}</span>
        <input name="region" defaultValue={provider?.region} autoComplete="off" className={field} />
      </label>
      <label className="block space-y-1.5 text-sm font-medium">
        <span>{t.apiKey}</span>
        <input name="apiKey" type="password" autoComplete="new-password" className={field} />
        <span className="block text-xs font-normal text-muted">{t.apiKeyHint}</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="enabled" type="checkbox" defaultChecked={provider?.enabled} />
        {t.enabled}
      </label>
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

function ProviderCard({ provider }: { provider: Provider }) {
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
          <p className="text-sm text-muted">
            {t.kinds[provider.kind] ?? provider.kind} · {provider.api}
            {provider.region && ` · ${provider.region}`}
          </p>
          <p className="text-sm text-muted">{provider.keyHint ? t.keyEnds(provider.keyHint) : t.noKey}</p>
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
  const save = useMutation({
    mutationFn: (form: FormData) => {
      const live = form.get("live") === "on";
      return admin
        .saveRoute({
          route: {
            criterion: String(form.get("criterion")),
            position: String(form.get("position")),
            providerId: String(form.get("provider")),
            model: String(form.get("model")),
            promptVersion: String(form.get("prompt")),
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
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.criterion}</span>
          <input
            name="criterion"
            required
            pattern="[a-z0-9\-]+"
            defaultValue={route?.criterion}
            readOnly={!!route}
            autoComplete="off"
            className={field}
          />
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
        options={providers.map((p) => ({ value: p.id, label: p.name }))}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.model}</span>
          <input name="model" required defaultValue={route?.model} autoComplete="off" className={field} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.promptVersion}</span>
          <input name="prompt" required defaultValue={route?.promptVersion} autoComplete="off" className={field} />
        </label>
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
    mutationFn: () => admin.deleteRoute({ criterion: route.criterion, position: route.position }),
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
          {route.criterion} · {t.positions[route.position] ?? route.position}
        </h3>
        <span className={`text-sm ${route.live ? "text-good" : "text-muted"}`}>{route.live ? t.live : t.draft}</span>
      </div>
      <p className="text-sm text-muted">
        {providers.find((p) => p.id === route.providerId)?.name} · {route.model} · {route.promptVersion}
      </p>
      <p className="text-sm">
        <span className={route.calibrated ? "text-good" : "text-warn"}>{route.calibrated ? t.calibrated : t.notCalibrated}</span>
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
            <ProviderCard key={p.id} provider={p} />
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
        <p className="text-sm text-muted">{t.calibrationNote}</p>
        {routes.data.routes.length === 0 && <p className="text-muted">{t.noRoutes}</p>}
        <div className="grid items-start gap-4 md:grid-cols-2">
          {routes.data.routes.map((r) => (
            <RouteCard key={`${r.criterion}/${r.position}`} route={r} providers={list} />
          ))}
          {addingRoute && (
            <Card className="p-5">
              <RouteForm providers={list} onDone={() => setAddingRoute(false)} />
            </Card>
          )}
        </div>
        {!addingRoute && list.length > 0 && (
          <Button variant="secondary" onClick={() => setAddingRoute(true)}>
            {t.newRoute}
          </Button>
        )}
      </section>
    </div>
  );
}
