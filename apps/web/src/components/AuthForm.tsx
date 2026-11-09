import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { type ComponentProps, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";

import { authClient } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { usePrivacyText } from "../lib/privacy-text.ts";
import { Button, Card, ErrorNote } from "./ui.tsx";

/** field styles a form input. */
export const field =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/25";

/** PasswordInput is a password input with a button at its end that shows or hides what was typed. */
export function PasswordInput({ className = field, ...props }: Omit<ComponentProps<"input">, "type">) {
  const { m } = useI18n();
  const [shown, setShown] = useState(false);
  const label = shown ? m.hidePassword : m.showPassword;
  return (
    <span className="relative block">
      <input {...props} type={shown ? "text" : "password"} className={`${className} pr-11`} />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={label}
        title={label}
        className="absolute inset-y-1 right-1 flex w-9 items-center justify-center rounded-md text-muted hover:bg-accent-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        {shown ? <EyeSlash size={18} /> : <Eye size={18} />}
      </button>
    </span>
  );
}

/** PasswordField is a labelled PasswordInput, with an optional note below it. */
export function PasswordField({
  label,
  note,
  ...props
}: Omit<ComponentProps<"input">, "type" | "id"> & { label: string; note?: ReactNode }) {
  const id = useId();
  return (
    <div className="space-y-1.5 text-sm font-medium">
      <label htmlFor={id} className="block">
        {label}
      </label>
      <PasswordInput id={id} {...props} />
      {note}
    </div>
  );
}

/** NewPassword asks for a new password twice; the form will not submit while the two differ. */
export function NewPassword({ label, name = "password", hint = true }: { label: string; name?: string; hint?: boolean }) {
  const { m } = useI18n();
  const first = useRef<HTMLInputElement>(null);
  const again = useRef<HTMLInputElement>(null);
  const [differ, setDiffer] = useState(false);

  const check = () => {
    const a = first.current?.value ?? "";
    const b = again.current?.value ?? "";
    const wrong = b !== "" && a !== b;
    again.current?.setCustomValidity(wrong ? m.passwordsDiffer : "");
    setDiffer(wrong);
  };

  useEffect(() => {
    const form = first.current?.form;
    const reset = () => {
      again.current?.setCustomValidity("");
      setDiffer(false);
    };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, []);

  return (
    <>
      <PasswordField
        label={label}
        ref={first}
        name={name}
        required
        minLength={8}
        autoComplete="new-password"
        onInput={check}
        note={hint && <span className="block text-xs font-normal text-muted">{m.passwordHint}</span>}
      />
      <PasswordField
        label={m.confirmPassword}
        ref={again}
        required
        autoComplete="new-password"
        onInput={check}
        aria-invalid={differ}
        note={differ && <span className="block text-xs font-normal text-bad">{m.passwordsDiffer}</span>}
      />
    </>
  );
}

/** usernameErrors are better-auth's username error codes and what they mean to the person signing up. */
const usernameErrors: Record<string, "usernameTaken" | "usernameInvalid"> = {
  USERNAME_IS_ALREADY_TAKEN: "usernameTaken",
  INVALID_USERNAME: "usernameInvalid",
  USERNAME_TOO_SHORT: "usernameInvalid",
  USERNAME_TOO_LONG: "usernameInvalid",
};

/**
 * AuthForm signs in, with an email address or a username, or signs up with a name, a username, an email address and a
 * password, then goes to next.
 */
export function AuthForm({
  mode,
  next,
  afterSignUp,
}: {
  mode: "sign-in" | "sign-up";
  next?: string;
  /** afterSignUp stores the age answer; if it fails, the account answers again at /age. */
  afterSignUp?: () => Promise<void>;
}) {
  const { m } = useI18n();
  const t = usePrivacyText();
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
    const username = String(form.get("username") ?? "").trim();
    const res =
      mode === "sign-up"
        ? await authClient.signUp.email({ email, password, name: String(form.get("name")).trim(), username, displayUsername: username })
        : email.includes("@")
          ? await authClient.signIn.email({ email, password })
          : await authClient.signIn.username({ username: email.trim(), password });
    if (res.error) {
      setBusy(false);
      const known = usernameErrors[res.error.code ?? ""];
      setError(known ? m[known] : (res.error.message ?? m.error));
      return;
    }
    if (mode === "sign-up") await afterSignUp?.().catch(() => undefined);
    setBusy(false);
    await navigate({ to: next?.startsWith("/") ? next : "/" });
  }

  const title = mode === "sign-up" ? m.signUp : m.signIn;
  return (
    <Card className="mx-auto mt-6 max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
      <form onSubmit={submit} className="space-y-4">
        {mode === "sign-up" && (
          <>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{m.name}</span>
              <input name="name" required maxLength={100} autoComplete="name" className={field} />
              <span className="block text-xs font-normal text-muted">{m.nameHint}</span>
            </label>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{m.username}</span>
              <input name="username" required minLength={3} maxLength={20} autoComplete="username" className={field} />
              <span className="block text-xs font-normal text-muted">{m.usernameHint}</span>
            </label>
          </>
        )}
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{mode === "sign-in" ? t.emailOrUsername : m.email}</span>
          <input
            name="email"
            type={mode === "sign-in" ? "text" : "email"}
            required
            autoComplete={mode === "sign-in" ? "username" : "email"}
            className={field}
          />
        </label>
        {mode === "sign-up" ? (
          <NewPassword label={m.password} />
        ) : (
          <PasswordField label={m.password} name="password" required autoComplete="current-password" />
        )}
        {mode === "sign-in" && (
          <Link to="/forgot-password" className="block text-sm text-accent">
            {m.forgotPassword}
          </Link>
        )}
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
