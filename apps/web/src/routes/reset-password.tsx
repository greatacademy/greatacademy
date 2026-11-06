import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { field } from "../components/AuthForm.tsx";
import { Button, Card, ErrorNote } from "../components/ui.tsx";
import { authClient } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>): { token?: string } => (typeof s.token === "string" ? { token: s.token } : {}),
  component: ResetPassword,
});

function ResetPassword() {
  const { m } = useI18n();
  const { token } = Route.useSearch();
  const [state, setState] = useState<"idle" | "busy" | "done" | "invalid">(token ? "idle" : "invalid");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const newPassword = String(new FormData(e.currentTarget).get("password"));
    const res = await authClient.resetPassword({ newPassword, token: token ?? "" });
    setState(res.error ? "invalid" : "done");
  }

  return (
    <Card className="mx-auto mt-6 max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">{m.resetTitle}</h1>
      {state === "done" && <p role="status">{m.resetDone}</p>}
      {state === "invalid" && <ErrorNote message={m.resetInvalid} />}
      {(state === "idle" || state === "busy") && (
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{m.newPassword}</span>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className={field} />
            <span className="text-xs font-normal text-muted">{m.passwordHint}</span>
          </label>
          <Button type="submit" disabled={state === "busy"} className="w-full py-2.5">
            {m.saveNewPassword}
          </Button>
        </form>
      )}
      <Link to={state === "invalid" ? "/forgot-password" : "/sign-in"} className="block text-center text-sm font-medium text-accent">
        {state === "invalid" ? m.forgotTitle : m.backToSignIn}
      </Link>
    </Card>
  );
}
