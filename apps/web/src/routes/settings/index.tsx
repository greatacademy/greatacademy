import { Code } from "@connectrpc/connect";
import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, type ReactNode, useState } from "react";

import { field, NewPassword, PasswordField } from "../../components/AuthForm.tsx";
import { GoalsEditor } from "../../components/GoalsEditor.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { PrivacySettings } from "../../components/PrivacySettings.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { hasInbox, useAccess } from "../../lib/access.ts";
import { authClient } from "../../lib/auth.ts";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { usePrivacyText } from "../../lib/privacy-text.ts";
import { account, failureCode } from "../../lib/rpc.ts";

export const Route = createFileRoute("/settings/")({ component: Settings });

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </Card>
  );
}

function Settings() {
  const { m, locale } = useI18n();
  const t = usePrivacyText();
  const session = useRequireSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const access = useAccess();
  const child = access?.band === Band.CHILD;
  const adult = access?.band === Band.ADULT;
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => account.getSettings({}), enabled: !!session, staleTime: 0 });
  const refresh = () => qc.invalidateQueries({ queryKey: ["settings"] });

  const [nameState, setNameState] = useState<"idle" | "saved" | "failed">("idle");
  const [usernameError, setUsernameError] = useState<string>();
  const [verification, setVerification] = useState(false);
  const [passwordState, setPasswordState] = useState<"idle" | "saved" | "failed">("idle");
  const [deleteError, setDeleteError] = useState(false);

  const leagues = useMutation({ mutationFn: (enabled: boolean) => account.setLeagues({ enabled }), onSuccess: refresh });
  const invite = useMutation({ mutationFn: () => account.createGuardianInvite({}) });
  const removeGuardian = useMutation({ mutationFn: (userId: string) => account.removeGuardian({ userId }), onSuccess: refresh });

  if (!session || settings.isPending) return <Spinner label={m.loading} />;
  if (settings.isError) return <LoadError error={settings.error} onRetry={() => settings.refetch()} />;
  const s = settings.data;

  async function saveName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await authClient.updateUser({ name: String(new FormData(e.currentTarget).get("name")) });
    setNameState(res.error ? "failed" : "saved");
  }

  async function saveUsername(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUsernameError(undefined);
    try {
      await account.setUsername({ username: String(new FormData(e.currentTarget).get("username")) });
      await refresh();
    } catch (err) {
      const code = failureCode(err);
      setUsernameError(code === Code.AlreadyExists ? m.usernameTaken : code === Code.InvalidArgument ? m.usernameInvalid : m.error);
    }
  }

  async function savePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const res = await authClient.changePassword({
      currentPassword: String(data.get("current")),
      newPassword: String(data.get("next")),
      revokeOtherSessions: true,
    });
    setPasswordState(res.error ? "failed" : "saved");
    if (!res.error) form.reset();
  }

  async function deleteAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await authClient.deleteUser({ password: String(new FormData(e.currentTarget).get("password")) });
    if (res.error) {
      setDeleteError(true);
      return;
    }
    qc.clear();
    await navigate({ to: "/" });
  }

  return (
    <div className="space-y-6">
      <Section title={m.profile}>
        {adult && (
          <form onSubmit={saveName} className="space-y-3">
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{m.name}</span>
              <input name="name" required defaultValue={session.user.name} autoComplete="name" className={field} />
            </label>
            {nameState === "failed" && <ErrorNote message={m.error} />}
            <div className="flex items-center gap-3">
              <Button type="submit" variant="secondary">
                {m.save}
              </Button>
              {nameState === "saved" && <span className="text-sm text-good">{m.saved}</span>}
            </div>
          </form>
        )}
        {hasInbox(session.user.email) ? (
          <div className="space-y-1 text-sm">
            <div className="font-medium">{m.email}</div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{session.user.email}</span>
              {session.user.emailVerified ? (
                <span className="text-good">{m.emailVerified}</span>
              ) : verification ? (
                <span className="text-muted">{m.verificationSent}</span>
              ) : (
                <>
                  <span className="text-warn">{m.emailNotVerified}</span>
                  <button
                    type="button"
                    className="font-medium text-accent"
                    onClick={async () => {
                      const res = await authClient.sendVerificationEmail({ email: session.user.email, callbackURL: "/settings" });
                      if (!res.error) setVerification(true);
                    }}
                  >
                    {m.resendVerification}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm">{session.user.name}</p>
        )}
      </Section>

      <PrivacySettings />

      <Section title={m.goals}>
        <p className="text-sm text-muted">{m.goalsBody}</p>
        <GoalsEditor
          initial={{ weekdays: s.goals?.weekdays ?? [], paused: s.goals?.paused ?? false }}
          onSave={async (goals) => {
            await account.setGoals({ goals: { weekdays: [...goals.weekdays], paused: goals.paused } });
            await qc.invalidateQueries({ queryKey: ["dashboard"] });
          }}
        />
      </Section>

      {!child && (
        <Section title={m.league}>
          <p className="text-sm text-muted">{m.leagueIntro}</p>
          <form onSubmit={saveUsername} className="space-y-2">
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{m.username}</span>
              <input name="username" required minLength={3} maxLength={20} defaultValue={s.username} autoComplete="off" className={field} />
              <span className="block text-xs font-normal text-muted">{m.usernameHint}</span>
            </label>
            {usernameError && <ErrorNote message={usernameError} />}
            <Button type="submit" variant="secondary">
              {m.save}
            </Button>
          </form>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.leagues}
              disabled={leagues.isPending || !s.username}
              onChange={(e) => leagues.mutate(e.target.checked)}
            />
            {m.leagueJoin}
          </label>
          {!s.username && <p className="text-xs text-muted">{m.usernameFirst}</p>}
          {leagues.isError && <ErrorNote message={m.error} />}
        </Section>
      )}

      <Section title={m.guardian}>
        <p className="text-sm text-muted">{m.guardiansBody}</p>
        {s.guardians.length === 0 && <p className="text-sm">{m.noGuardians}</p>}
        {s.guardians.map((g) => (
          <div key={g.userId} className="flex items-center justify-between gap-3 text-sm">
            <div className="min-w-0">
              <div className="truncate font-medium">{g.name}</div>
              <div className="truncate text-muted">{g.email}</div>
            </div>
            {!child && (
              <Button variant="secondary" onClick={() => removeGuardian.mutate(g.userId)} disabled={removeGuardian.isPending}>
                {m.remove}
              </Button>
            )}
          </div>
        ))}
        {invite.data ? (
          <p role="status" className="rounded-xl bg-accent-soft px-4 py-3 text-sm">
            {m.inviteCode(invite.data.code, new Date(Number(invite.data.expiresAt)).toLocaleDateString(locale))}
          </p>
        ) : (
          <Button variant="secondary" onClick={() => invite.mutate()} disabled={invite.isPending}>
            {m.inviteGuardian}
          </Button>
        )}
        {invite.isError && <ErrorNote message={m.error} />}
      </Section>

      <Section title={m.changePassword}>
        <form onSubmit={savePassword} className="space-y-3">
          <PasswordField label={m.currentPassword} name="current" required autoComplete="current-password" />
          <NewPassword label={m.newPassword} name="next" />
          {passwordState === "failed" && <ErrorNote message={m.error} />}
          <div className="flex items-center gap-3">
            <Button type="submit" variant="secondary">
              {m.changePassword}
            </Button>
            {passwordState === "saved" && <span className="text-sm text-good">{m.saved}</span>}
          </div>
        </form>
      </Section>

      <Section title={m.dangerZone}>
        {access?.managed ? (
          <p className="text-sm text-muted">{t.childDelete}</p>
        ) : (
          <form onSubmit={deleteAccount} className="space-y-3">
            <p className="text-sm text-muted">{m.deleteBody}</p>
            <PasswordField label={m.password} name="password" required autoComplete="current-password" />
            {deleteError && <ErrorNote message={m.error} />}
            <button type="submit" className="rounded-lg border border-bad/40 px-4 py-2 text-sm font-medium text-bad hover:bg-bad-soft">
              {m.deleteAccount}
            </button>
          </form>
        )}
      </Section>
    </div>
  );
}
