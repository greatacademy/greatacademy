import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { PasswordField } from "../../components/AuthForm.tsx";
import { SecurityPage } from "../../components/SecurityPage.tsx";
import { ErrorNote, Spinner } from "../../components/ui.tsx";
import { useAccess } from "../../lib/access.ts";
import { authClient } from "../../lib/auth.ts";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { usePrivacyText } from "../../lib/privacy-text.ts";

export const Route = createFileRoute("/settings/delete")({ component: DeleteAccount });

/** DeleteAccount deletes the account once the password confirms it; a guardian's learner is told who can. */
function DeleteAccount() {
  const { m } = useI18n();
  const t = usePrivacyText();
  const session = useRequireSession();
  const access = useAccess();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  if (!session) return <Spinner label={m.loading} />;

  async function remove(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await authClient.deleteUser({ password: String(new FormData(e.currentTarget).get("password")) });
    if (res.error) {
      setFailed(true);
      return;
    }
    qc.clear();
    await navigate({ to: "/" });
  }

  return (
    <SecurityPage title={m.deleteAccount}>
      {access?.managed ? (
        <p className="text-sm text-muted">{t.childDelete}</p>
      ) : (
        <form onSubmit={remove} className="space-y-3">
          <p className="text-sm text-muted">{m.deleteBody}</p>
          <PasswordField label={m.password} name="password" required autoComplete="current-password" />
          {failed && <ErrorNote message={m.error} />}
          <button type="submit" className="rounded-lg border border-bad/40 px-4 py-2 text-sm font-medium text-bad hover:bg-bad-soft">
            {m.deleteAccount}
          </button>
        </form>
      )}
    </SecurityPage>
  );
}
