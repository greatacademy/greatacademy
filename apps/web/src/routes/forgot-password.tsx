import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { field } from "../components/AuthForm.tsx";
import { Button, Card, ErrorNote } from "../components/ui.tsx";
import { authClient } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });

function ForgotPassword() {
  const { m } = useI18n();
  const [state, setState] = useState<"idle" | "busy" | "sent" | "failed">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const email = String(new FormData(e.currentTarget).get("email"));
    const res = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setState(res.error ? "failed" : "sent");
  }

  return (
    <Card className="mx-auto mt-6 max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">{m.forgotTitle}</h1>
      {state === "sent" ? (
        <p role="status">{m.linkSent}</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-muted">{m.forgotBody}</p>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{m.email}</span>
            <input name="email" type="email" required autoComplete="email" className={field} />
          </label>
          {state === "failed" && <ErrorNote message={m.error} />}
          <Button type="submit" disabled={state === "busy"} className="w-full py-2.5">
            {m.sendLink}
          </Button>
        </form>
      )}
      <Link to="/sign-in" className="block text-center text-sm font-medium text-accent">
        {m.backToSignIn}
      </Link>
    </Card>
  );
}
