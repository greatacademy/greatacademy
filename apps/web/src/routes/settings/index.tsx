import { Code } from "@connectrpc/connect";
import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { CaretRight } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { PrivacySettings } from "../../components/PrivacySettings.tsx";
import { Subscriptions } from "../../components/Subscriptions.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { hasInbox, useAccess } from "../../lib/access.ts";
import { authClient } from "../../lib/auth.ts";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { usePrivacyText } from "../../lib/privacy-text.ts";
import { account, failureCode } from "../../lib/rpc.ts";

export const Route = createFileRoute("/settings/")({ component: Settings });

/** SettingsSection names the sections of the settings page, each reachable by its anchor, as `/settings#league`. */
export type SettingsSection = "profile" | "plan" | "privacy" | "league" | "guardian" | "security";

function Section({ id, title, children }: { id: SettingsSection; title: string; children: ReactNode }) {
  return (
    <Card id={id} className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </Card>
  );
}

/** SecurityRow is a line of the Account security section, as in the apps: an action, or the page it opens. */
function SecurityRow({
  title,
  detail,
  tone,
  to,
  onPress,
}: {
  title: string;
  detail?: string;
  tone?: "bad";
  to?: "/settings/password" | "/settings/delete";
  onPress?: () => void;
}) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className={`block ${tone === "bad" ? "text-bad" : ""}`}>{title}</span>
        {detail && <span className="block text-sm text-muted">{detail}</span>}
      </span>
      {to && <CaretRight size={16} className="shrink-0 text-muted" />}
    </>
  );
  const row = "flex w-full items-center gap-3 py-3 text-left first:pt-0 last:pb-0 hover:text-accent";
  return to ? (
    <Link to={to} className={row}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onPress} className={row}>
      {body}
    </button>
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
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => account.getSettings({}), enabled: !!session, staleTime: 0 });
  // A link to a section (`/settings#league`) lands on it once the page has its data.
  const hash = useLocation({ select: (l) => l.hash });
  const loaded = settings.data !== undefined;
  useEffect(() => {
    if (loaded && hash) document.getElementById(hash)?.scrollIntoView({ block: "start" });
  }, [loaded, hash]);
  const refresh = () => qc.invalidateQueries({ queryKey: ["settings"] });

  const [profileError, setProfileError] = useState<string>();
  const [profileSaved, setProfileSaved] = useState(false);
  const [verification, setVerification] = useState(false);

  const leagues = useMutation({ mutationFn: (enabled: boolean) => account.setLeagues({ enabled }), onSuccess: refresh });
  const invite = useMutation({ mutationFn: () => account.createGuardianInvite({}) });
  const removeGuardian = useMutation({ mutationFn: (userId: string) => account.removeGuardian({ userId }), onSuccess: refresh });

  if (!session || settings.isPending) return <Spinner label={m.loading} />;
  if (settings.isError) return <LoadError error={settings.error} onRetry={() => settings.refetch()} />;
  const s = settings.data;

  const currentName = session.user.name;

  /** saveProfile saves the name and the username, each when it changed. */
  async function saveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setProfileError(undefined);
    setProfileSaved(false);
    const name = String(form.get("name")).trim();
    const username = String(form.get("username")).trim();
    if (name !== currentName) {
      const res = await authClient.updateUser({ name });
      if (res.error) return setProfileError(m.error);
    }
    if (username !== s.username) {
      try {
        await account.setUsername({ username });
      } catch (err) {
        const code = failureCode(err);
        return setProfileError(code === Code.AlreadyExists ? m.usernameTaken : code === Code.InvalidArgument ? m.usernameInvalid : m.error);
      }
    }
    await refresh();
    setProfileSaved(true);
  }

  async function signOut() {
    await authClient.signOut();
    qc.clear();
    await navigate({ to: "/" });
  }

  return (
    <div className="space-y-6">
      <Section id="profile" title={m.profile}>
        <form onSubmit={saveProfile} className="space-y-3">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{m.name}</span>
            <input name="name" required maxLength={100} defaultValue={session.user.name} autoComplete="name" className={field} />
            <span className="block text-xs font-normal text-muted">{m.nameHint}</span>
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{m.username}</span>
            <input
              name="username"
              required
              minLength={3}
              maxLength={20}
              defaultValue={s.username}
              autoComplete="username"
              className={field}
            />
            <span className="block text-xs font-normal text-muted">{m.usernameHint}</span>
          </label>
          {profileError && <ErrorNote message={profileError} />}
          <div className="flex items-center gap-3">
            <Button type="submit" variant="secondary">
              {m.save}
            </Button>
            {profileSaved && <span className="text-sm text-good">{m.saved}</span>}
          </div>
        </form>
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
        ) : null}
      </Section>

      <Subscriptions />

      <PrivacySettings />

      <Section id="league" title={m.league}>
        <p className="text-sm text-muted">{m.leagueIntro}</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={s.leagues} disabled={leagues.isPending} onChange={(e) => leagues.mutate(e.target.checked)} />
          {m.leagueJoin}
        </label>
        {leagues.isError && <ErrorNote message={m.error} />}
      </Section>

      <Section id="guardian" title={m.guardian}>
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

      <Section id="security" title={m.security}>
        <div className="divide-y divide-line">
          <SecurityRow title={m.changePassword} detail={m.changePasswordDetail} to="/settings/password" />
          <SecurityRow title={m.signOut} onPress={() => void signOut()} />
          {access?.managed ? (
            <p className="py-3 text-sm text-muted">{t.childDelete}</p>
          ) : (
            <SecurityRow title={m.deleteAccount} tone="bad" to="/settings/delete" />
          )}
        </div>
      </Section>
    </div>
  );
}
