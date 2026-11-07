import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { errorText, usePrivacyText } from "../lib/privacy-text.ts";
import { privacy } from "../lib/rpc.ts";
import { field, NewPassword } from "./AuthForm.tsx";
import { downloadJson } from "./PrivacySettings.tsx";
import { ScopeRow } from "./ScopeRow.tsx";
import { Button, Card, ErrorNote } from "./ui.tsx";

/** LearnerPrivacy is where a guardian agrees, sets a limit, and exports or deletes a learner's data. */
export function LearnerPrivacy({ learnerId, name }: { learnerId: string; name: string }) {
  const { m, locale } = useI18n();
  const t = usePrivacyText();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const consents = useQuery({ queryKey: ["consents", learnerId], queryFn: () => privacy.listConsents({ learnerId }), staleTime: 0 });
  const refresh = () => qc.invalidateQueries({ queryKey: ["consents", learnerId] });
  const [confirmName, setConfirmName] = useState("");
  const [note, setNote] = useState<string>();

  const grant = useMutation({ mutationFn: (scope: string) => privacy.grantConsent({ learnerId, scope }), onSuccess: refresh });
  const withdraw = useMutation({ mutationFn: (scope: string) => privacy.withdrawConsent({ learnerId, scope }), onSuccess: refresh });
  const limit = useMutation({
    mutationFn: (minutes: number) => privacy.setTimeLimit({ learnerId, minutes }),
    onSuccess: async () => {
      setNote(t.saved);
      await refresh();
    },
  });
  const exportData = useMutation({
    mutationFn: () => privacy.exportData({ learnerId }),
    onSuccess: (r) => downloadJson(r.json, "great-academy-data.json"),
  });
  const clear = useMutation({ mutationFn: () => privacy.deleteResponses({ learnerId }), onSuccess: (r) => setNote(t.deleted(r.deleted)) });
  const password = useMutation({
    mutationFn: (value: string) => privacy.resetChildPassword({ learnerId, password: value }),
    onSuccess: () => setNote(t.saved),
  });
  const remove = useMutation({
    mutationFn: () => privacy.deleteChild({ learnerId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["guarded"] });
      await navigate({ to: "/guardian" });
    },
  });

  if (!consents.data) return null;
  const { scopes, managed, dailyMinutes } = consents.data;
  const shown = scopes.filter((s) => s.scope !== "research");
  const failure = [grant, withdraw, limit, exportData, clear, password, remove].find((x) => x.isError)?.error;
  const canGrantNothing = !shown.some((s) => s.canGrant || s.inForce);

  function saveLimit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    limit.mutate(Number(new FormData(e.currentTarget).get("minutes")) || 0);
  }

  function savePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    password.mutate(String(new FormData(form).get("password")), { onSuccess: () => form.reset() });
  }

  return (
    <Card className="space-y-4 p-5">
      <h2 className="font-semibold">{t.guardianControls}</h2>
      {canGrantNothing && <p className="text-sm text-muted">{t.needVerification}</p>}
      {shown.map((s) => (
        <ScopeRow
          key={s.scope}
          state={s}
          consents={consents.data.consents}
          busy={grant.isPending || withdraw.isPending}
          onGrant={() => grant.mutate(s.scope)}
          onWithdraw={() => withdraw.mutate(s.scope)}
        />
      ))}
      <form onSubmit={saveLimit} className="space-y-2 border-t border-line pt-4">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.timeLimit}</span>
          <input
            key={dailyMinutes}
            name="minutes"
            type="number"
            min={0}
            max={1440}
            step={5}
            defaultValue={dailyMinutes || ""}
            placeholder={t.noLimit}
            className={field}
          />
          <span className="block text-xs font-normal text-muted">{t.limitBody}</span>
        </label>
        <Button type="submit" variant="secondary" disabled={limit.isPending}>
          {t.saveLimit}
        </Button>
      </form>
      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
        <Button variant="secondary" onClick={() => exportData.mutate()} disabled={exportData.isPending}>
          {t.export}
        </Button>
        <Button variant="secondary" onClick={() => clear.mutate()} disabled={clear.isPending}>
          {t.guardianDeleteText}
        </Button>
      </div>
      {managed && (
        <>
          <form onSubmit={savePassword} className="space-y-2 border-t border-line pt-4">
            <NewPassword label={t.resetPassword} hint={false} />
            <Button type="submit" variant="secondary" disabled={password.isPending}>
              {m.save}
            </Button>
          </form>
          <div className="space-y-2 border-t border-line pt-4">
            <h3 className="text-sm font-medium text-bad">{t.deleteChild}</h3>
            <p className="text-xs text-muted">{t.deleteChildBody}</p>
            <input
              aria-label={t.confirmName}
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              autoComplete="off"
              className={field}
            />
            <button
              type="button"
              disabled={confirmName !== name || remove.isPending}
              onClick={() => remove.mutate()}
              className="rounded-lg border border-bad/40 px-4 py-2 text-sm font-medium text-bad hover:bg-bad-soft disabled:opacity-50"
            >
              {t.deleteChild}
            </button>
          </div>
        </>
      )}
      {note && (
        <p role="status" className="text-sm text-good">
          {note}
        </p>
      )}
      {failure && <ErrorNote message={errorText(failure, locale, m.error)} />}
    </Card>
  );
}
