import { ArrowRight, Student, UsersThree } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { SubjectMark, useSubjects } from "../lib/subject.tsx";

/** Welcome is the first screen of an account with no course: it asks who the account is for, then which subject to start. */
export function Welcome() {
  const { m, tx } = useI18n();
  const { data: session } = useSession();
  const subjects = useSubjects();
  const [choosing, setChoosing] = useState(false);
  const card = "flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 text-left transition hover:border-accent/50";

  if (choosing) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 pt-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{m.welcomeSubjectTitle}</h1>
          <p className="text-muted">{m.welcomeSubjectBody}</p>
        </div>
        <div className="grid gap-3">
          {subjects.map((s) => (
            <Link key={s.id} to="/$subject" params={{ subject: s.id }} className={card}>
              <SubjectMark subject={s} size={40} />
              <span className="min-w-0 flex-1 self-center text-lg font-semibold">{tx(s.title)}</span>
              <ArrowRight size={18} className="shrink-0 self-center text-muted" />
            </Link>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{m.welcomeTitle(session?.user.name ?? "")}</h1>
        <p className="text-muted">{m.welcomeBody}</p>
      </div>
      <div className="grid gap-3">
        <button type="button" className={card} onClick={() => setChoosing(true)}>
          <Student size={28} weight="duotone" className="shrink-0 text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{m.welcomeLearner}</span>
            <span className="block text-sm text-muted">{m.welcomeLearnerBody}</span>
          </span>
          <ArrowRight size={18} className="mt-1 shrink-0 text-muted" />
        </button>
        <Link to="/guardian" className={card}>
          <UsersThree size={28} weight="duotone" className="shrink-0 text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{m.welcomeGuardian}</span>
            <span className="block text-sm text-muted">{m.welcomeGuardianBody}</span>
          </span>
          <ArrowRight size={18} className="mt-1 shrink-0 text-muted" />
        </Link>
      </div>
    </div>
  );
}
