import { AccessStatus, Band } from "@ga/proto/privacy/v1/privacy_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { useAccess } from "../lib/access.ts";
import { useI18n } from "../lib/i18n.tsx";
import { errorText, regionName, usePrivacyText } from "../lib/privacy-text.ts";
import { privacy } from "../lib/rpc.ts";
import { CountrySelect } from "./AgeQuestion.tsx";
import { ScopeRow } from "./ScopeRow.tsx";
import { Button, Card, ErrorNote } from "./ui.tsx";

/** downloadJson saves a learner's export as a file. */
export function downloadJson(json: string, name: string) {
  const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/** PrivacySettings shows a learner their age group, what is on, and lets them turn things off and delete what they typed. */
export function PrivacySettings() {
  const { m, locale } = useI18n();
  const t = usePrivacyText();
  const qc = useQueryClient();
  const access = useAccess();
  const consents = useQuery({ queryKey: ["consents", ""], queryFn: () => privacy.listConsents({}), enabled: !!access, staleTime: 0 });
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ["access"] }), qc.invalidateQueries({ queryKey: ["consents"] })]);
  const [saved, setSaved] = useState(false);

  const move = useMutation({
    mutationFn: (country: string) => privacy.setCountry({ country }),
    onSuccess: async () => {
      setSaved(true);
      await refresh();
    },
  });
  const confirm = useMutation({ mutationFn: () => privacy.confirmBand({}), onSuccess: refresh });
  const grant = useMutation({ mutationFn: (scope: string) => privacy.grantConsent({ scope }), onSuccess: refresh });
  const assent = useMutation({ mutationFn: (scope: string) => privacy.assentConsent({ scope }), onSuccess: refresh });
  const withdraw = useMutation({ mutationFn: (scope: string) => privacy.withdrawConsent({ scope }), onSuccess: refresh });
  const exportData = useMutation({
    mutationFn: () => privacy.exportData({}),
    onSuccess: (r) => downloadJson(r.json, "great-academy-data.json"),
  });
  const clear = useMutation({ mutationFn: () => privacy.deleteResponses({}) });

  if (!access || access.status === AccessStatus.NEEDS_AGE) return null;
  const bandName = access.band === Band.CHILD ? t.bandChild : access.band === Band.TEEN ? t.bandTeen : t.bandAdult;
  const failure = [move, confirm, grant, assent, withdraw, exportData, clear].find((x) => x.isError)?.error;
  // Adults need no consent; basic is always on for teens.
  const scopes =
    access.band === Band.ADULT
      ? []
      : (consents.data?.scopes ?? []).filter((s) => s.scope !== "research" && (access.band === Band.CHILD || s.scope !== "basic"));

  function saveCountry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    move.mutate(String(new FormData(e.currentTarget).get("country")));
  }

  return (
    <Card className="space-y-5">
      <h2 className="text-lg font-semibold">{t.privacyTitle}</h2>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">{t.ageBand}</dt>
          <dd className="font-medium">{bandName}</dd>
        </div>
        <div>
          <dt className="text-muted">{t.country}</dt>
          <dd className="font-medium">{access.country === "other" ? t.otherCountry : regionName(access.country, locale)}</dd>
        </div>
        {access.dailyMinutes > 0 && (
          <div>
            <dt className="text-muted">{t.timeLimit}</dt>
            <dd className="font-medium">{t.minutes(access.dailyMinutes)}</dd>
          </div>
        )}
      </dl>
      {access.nextBand !== Band.UNSPECIFIED && (
        <div className="space-y-2 rounded-xl bg-accent-soft px-4 py-3 text-sm">
          <p>{t.bandEnded}</p>
          <Button variant="secondary" onClick={() => confirm.mutate()} disabled={confirm.isPending}>
            {t.confirmBand}
          </Button>
        </div>
      )}
      <form onSubmit={saveCountry} className="space-y-2">
        <label htmlFor="my-country" className="block space-y-1.5 text-sm font-medium">
          <span>{t.country}</span>
          <CountrySelect id="my-country" name="country" defaultValue={access.country} />
        </label>
        <p className="text-xs text-muted">{t.movedNote}</p>
        <div className="flex items-center gap-3">
          <Button type="submit" variant="secondary" disabled={move.isPending}>
            {m.save}
          </Button>
          {saved && <span className="text-sm text-good">{t.countrySaved}</span>}
        </div>
      </form>
      {scopes.length > 0 && (
        <div className="space-y-3 border-t border-line pt-4">
          {access.band === Band.CHILD && <p className="text-sm text-muted">{t.childNote}</p>}
          {scopes.map((s) => (
            <ScopeRow
              key={s.scope}
              state={s}
              consents={consents.data?.consents ?? []}
              busy={grant.isPending || assent.isPending || withdraw.isPending}
              onGrant={() => grant.mutate(s.scope)}
              onAssent={() => assent.mutate(s.scope)}
              onWithdraw={() => withdraw.mutate(s.scope)}
            />
          ))}
          <p className="text-xs text-muted">{t.aiJudged}</p>
        </div>
      )}
      <div className="space-y-3 border-t border-line pt-4">
        <h3 className="font-medium">{t.yourData}</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => exportData.mutate()} disabled={exportData.isPending}>
            {t.export}
          </Button>
          <Button variant="secondary" onClick={() => clear.mutate()} disabled={clear.isPending}>
            {t.deleteText}
          </Button>
        </div>
        <p className="text-xs text-muted">{t.deleteTextBody}</p>
        {clear.data && (
          <p role="status" className="text-sm text-good">
            {t.deleted(clear.data.deleted)}
          </p>
        )}
      </div>
      {failure && <ErrorNote message={errorText(failure, locale, m.error)} />}
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-4 text-sm">
        {(["privacy", "children", "retention"] as const).map((page) => (
          <Link key={page} to="/legal/$page" params={{ page }} className="text-accent">
            {page === "privacy" ? t.legalPrivacy : page === "children" ? t.legalChildren : t.legalRetention}
          </Link>
        ))}
      </div>
    </Card>
  );
}
