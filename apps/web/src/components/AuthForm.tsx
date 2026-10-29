import { Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { authClient } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { Button, Card, ErrorNote } from "./ui.tsx";

const field =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/25";

/** AuthForm signs in or signs up with email and password, then goes to next. */
export function AuthForm({ mode, next }: { mode: "sign-in" | "sign-up"; next?: string }) {
  const { m } = useI18n();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setBusy(true);
    setError(undefined);
    const res =
      mode === "sign-up"
        ? await authClient.signUp.email({ email, password, name: String(form.get("name")) })
        : await authClient.signIn.email({ email, password });
    setBusy(false);
    if (res.error) {
      setError(res.error.message ?? m.error);
      return;
    }
    await navigate({ to: next?.startsWith("/") ? next : "/" });
  }

  const title = mode === "sign-up" ? m.signUp : m.signIn;
  return (
    <Card className="mx-auto mt-6 max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
      <form onSubmit={submit} className="space-y-4">
        {mode === "sign-up" && (
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{m.name}</span>
            <input name="name" required autoComplete="name" className={field} />
          </label>
        )}
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{m.email}</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{m.password}</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            className={field}
          />
          {mode === "sign-up" && <span className="text-xs font-normal text-muted">{m.passwordHint}</span>}
        </label>
        {error && <ErrorNote message={error} />}
        <Button type="submit" disabled={busy} className="w-full py-2.5">
          {title}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {mode === "sign-up" ? m.haveAccount : m.noAccount}{" "}
        <Link to={mode === "sign-up" ? "/sign-in" : "/sign-up"} search={{ next }} className="font-medium text-accent">
          {mode === "sign-up" ? m.signIn : m.signUp}
        </Link>
      </p>
    </Card>
  );
}
