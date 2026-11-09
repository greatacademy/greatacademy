import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { CaretLeft, CaretRight, type Icon, Student, User, UsersThree } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { type AgeAnswer, AgeQuestion } from "../components/AgeQuestion.tsx";
import { AuthForm } from "../components/AuthForm.tsx";
import { Button, Card } from "../components/ui.tsx";
import { useI18n } from "../lib/i18n.tsx";
import { errorText, usePrivacyText } from "../lib/privacy-text.ts";
import { privacy } from "../lib/rpc.ts";
import { rememberStop, stoppedBefore } from "../lib/sign-up-stop.ts";

export const Route = createFileRoute("/sign-up")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => (typeof s.next === "string" ? { next: s.next } : {}),
  component: SignUp,
});

/** Who is who sign-up is for: the one signing up alone, their children, or both. */
type Who = "self" | "children" | "both";

const WHO_ICONS: Record<Who, Icon> = { self: User, children: Student, both: UsersThree };

function BackButton({ onPress }: { onPress: () => void }) {
  const t = usePrivacyText();
  return (
    <button type="button" onClick={onPress} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
      <CaretLeft size={14} weight="bold" />
      {t.back}
    </button>
  );
}

function WhoQuestion({ onChoose }: { onChoose: (who: Who) => void }) {
  const t = usePrivacyText();
  const choices: { who: Who; title: string; body: string }[] = [
    { who: "self", title: t.whoSelf, body: t.whoSelfBody },
    { who: "children", title: t.whoChildren, body: t.whoChildrenBody },
    { who: "both", title: t.whoBoth, body: t.whoBothBody },
  ];
  return (
    <Card className="mx-auto mt-6 max-w-md">
      <h1 className="mb-6 text-2xl font-semibold">{t.whoTitle}</h1>
      <div className="space-y-3">
        {choices.map(({ who, title, body }) => {
          const Glyph = WHO_ICONS[who];
          return (
            <button
              key={who}
              type="button"
              onClick={() => onChoose(who)}
              className="flex w-full items-center gap-4 rounded-xl border border-line bg-surface p-4 text-left transition hover:border-accent/50 hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Glyph size={22} weight="fill" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{title}</span>
                <span className="block text-sm text-muted">{body}</span>
              </span>
              <CaretRight size={14} weight="bold" className="shrink-0 text-muted" />
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function Stop({ onParent }: { onParent: () => void }) {
  const t = usePrivacyText();
  return (
    <Card className="mx-auto mt-6 max-w-md space-y-3">
      <h1 className="text-2xl font-semibold">{t.stopTitle}</h1>
      <p>{t.stopBody}</p>
      <p className="text-muted">{t.stopClosed}</p>
      <p className="text-sm text-muted">{t.stopNote}</p>
      <Button variant="secondary" onClick={onParent}>
        {t.stopParent}
      </Button>
    </Card>
  );
}

/**
 * SignUp asks who will learn first. A learner signing up alone answers the age question for themselves and stops below
 * the age, which this browser then keeps for a day; a parent or guardian answers it for themselves, must be an adult,
 * and goes on to add their children.
 */
function SignUp() {
  const { m, locale } = useI18n();
  const t = usePrivacyText();
  const { next } = Route.useSearch();
  const [who, setWho] = useState<Who>();
  const [stopped, setStopped] = useState(false);
  const [answer, setAnswer] = useState<{ age: AgeAnswer; teen: boolean }>();
  const [error, setError] = useState<string>();
  const parent = who === "children" || who === "both";

  useEffect(() => {
    if (who === "self") setStopped(stoppedBefore(Date.now()));
  }, [who]);

  const choose = (next: Who | undefined) => {
    setWho(next);
    setStopped(false);
    setAnswer(undefined);
    setError(undefined);
  };

  if (!who) return <WhoQuestion onChoose={choose} />;
  if (stopped) return <Stop onParent={() => choose("children")} />;
  if (answer)
    return (
      <div className="mx-auto mt-6 max-w-sm">
        <BackButton onPress={() => setAnswer(undefined)} />
        <AuthForm mode="sign-up" next={parent ? "/guardian" : next} afterSignUp={() => privacy.setAge(answer.age).then(() => undefined)} />
        <p className="mx-auto mt-4 max-w-sm text-center text-xs text-muted">
          {t.signUpNotice}{" "}
          <Link to="/legal/$page" params={{ page: "privacy" }} className="text-accent">
            {t.legalPrivacy}
          </Link>
        </p>
      </div>
    );
  return (
    <Card className="mx-auto mt-6 max-w-sm">
      <BackButton onPress={() => choose(undefined)} />
      <h1 className="mb-2 text-2xl font-semibold">{parent ? t.parentAgeTitle : t.ageTitle}</h1>
      <p className="mb-6 text-sm text-muted">{parent ? t.parentAgeBody : t.ageBody}</p>
      <AgeQuestion
        error={error}
        onAnswer={async (age) => {
          setError(undefined);
          try {
            const res = await privacy.checkAge(age);
            // A parent or guardian must be an adult; anyone else stops as a child would.
            if (res.closed || res.band === Band.CHILD || (parent && res.band !== Band.ADULT)) {
              rememberStop(Date.now());
              setWho("self");
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
