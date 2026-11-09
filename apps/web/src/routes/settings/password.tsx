import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { NewPassword, PasswordField } from "../../components/AuthForm.tsx";
import { SecurityPage } from "../../components/SecurityPage.tsx";
import { Button, ErrorNote, Spinner } from "../../components/ui.tsx";
import { authClient } from "../../lib/auth.ts";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";

export const Route = createFileRoute("/settings/password")({ component: ChangePassword });

/** ChangePassword changes the password, which signs the other devices out; Account security opens it. */
function ChangePassword() {
  const { m } = useI18n();
  const session = useRequireSession();
  const [state, setState] = useState<"idle" | "saved" | "failed">("idle");
  if (!session) return <Spinner label={m.loading} />;

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const res = await authClient.changePassword({
      currentPassword: String(data.get("current")),
      newPassword: String(data.get("next")),
      revokeOtherSessions: true,
    });
    setState(res.error ? "failed" : "saved");
    if (!res.error) form.reset();
  }

  return (
    <SecurityPage title={m.changePassword}>
      <p className="text-sm text-muted">{m.changePasswordDetail}</p>
      <form onSubmit={save} className="space-y-3">
        <PasswordField label={m.currentPassword} name="current" required autoComplete="current-password" />
        <NewPassword label={m.newPassword} name="next" />
        {state === "failed" && <ErrorNote message={m.error} />}
        <div className="flex items-center gap-3">
          <Button type="submit">{m.changePassword}</Button>
          {state === "saved" && (
            <span role="status" className="text-sm text-good">
              {m.saved}
            </span>
          )}
        </div>
      </form>
    </SecurityPage>
  );
}
