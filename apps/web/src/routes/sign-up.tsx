import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { type AgeAnswer, AgeQuestion } from "../components/AgeQuestion.tsx";
import { AuthForm } from "../components/AuthForm.tsx";
import { Card } from "../components/ui.tsx";
import { useI18n } from "../lib/i18n.tsx";
import { errorText, usePrivacyText } from "../lib/privacy-text.ts";
import { privacy } from "../lib/rpc.ts";

export const Route = createFileRoute("/sign-up")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => (typeof s.next === "string" ? { next: s.next } : {}),
  component: SignUp,
});

/** STOP_KEY remembers in this browser that sign-up stopped, so that trying again does not change the answer. It holds no answer. */
const STOP_KEY = "ga.sign-up-stopped";

function stoppedBefore(): boolean {
  try {
    return localStorage.getItem(STOP_KEY) !== null;
  } catch {
    return false;
  }
}

function rememberStop() {
  try {
    localStorage.setItem(STOP_KEY, "1");
  } catch {
    // Without storage the page still stops; only a retry escapes it.
  }
}

function Stop() {
  const t = usePrivacyText();
  return (
    <Card className="mx-auto mt-6 max-w-md space-y-3">
      <h1 className="text-2xl font-semibold">{t.stopTitle}</h1>
      <p>{t.stopBody}</p>
      <p className="text-muted">{t.stopClosed}</p>
      <p className="text-sm text-muted">{t.stopNote}</p>
    </Card>
  );
}

function SignUp() {
  const { m, locale } = useI18n();
  const t = usePrivacyText();
  const { next } = Route.useSearch();
  const [stopped, setStopped] = useState(false);
  const [answer, setAnswer] = useState<{ age: AgeAnswer; teen: boolean }>();
  const [error, setError] = useState<string>();
  useEffect(() => setStopped(stoppedBefore()), []);

  if (stopped) return <Stop />;
  if (answer)
    return (
      <>
        <AuthForm mode="sign-up" next={next} askName={!answer.teen} afterSignUp={() => privacy.setAge(answer.age).then(() => undefined)} />
        <p className="mx-auto mt-4 max-w-sm text-center text-xs text-muted">
          {t.signUpNotice}{" "}
          <Link to="/legal/$page" params={{ page: "privacy" }} className="text-accent">
            {t.legalPrivacy}
          </Link>
        </p>
      </>
    );
  return (
    <Card className="mx-auto mt-6 max-w-sm">
      <h1 className="mb-2 text-2xl font-semibold">{t.ageTitle}</h1>
      <p className="mb-6 text-sm text-muted">{t.ageBody}</p>
      <AgeQuestion
        error={error}
        onAnswer={async (age) => {
          setError(undefined);
          try {
            const res = await privacy.checkAge(age);
            if (res.closed || res.band === Band.CHILD) {
              rememberStop();
              setStopped(true);
              return;
            }
            setAnswer({ age, teen: res.band === Band.TEEN });
          } catch (e) {
            setError(errorText(e, locale, m.error));
          }
        }}
      />
    </Card>
  );
}
