import {
  ArrowRight,
  BookOpenText,
  CaretDown,
  CheckCircle,
  GraduationCap,
  type Icon,
  Student,
  UsersThree,
  XCircle,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";

import { useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { catalog } from "../lib/rpc.ts";
import { PlacementArt, QuizArt, ReviewArt, StepsArt } from "./LandingArt.tsx";
import { Markdown } from "./Markdown.tsx";
import { Button, buttonClass } from "./ui.tsx";

const inner = "mx-auto max-w-5xl px-4";
const large = "px-5 py-2.5 text-base";

/** StartLink is the main action of the page: creating an account, or going back to learning once signed in. */
function StartLink({ className = "" }: { className?: string }) {
  const { m } = useI18n();
  const { data: session } = useSession();
  return session ? (
    <Link to="/" className={buttonClass("primary", `${large} ${className}`)}>
      {m.landing.goToLearning} <ArrowRight size={18} />
    </Link>
  ) : (
    <Link to="/sign-up" className={buttonClass("primary", `${large} ${className}`)}>
      {m.signUp} <ArrowRight size={18} />
    </Link>
  );
}

/** TryProblem lets a visitor answer a real kind of question and see how the course responds to each answer. */
function TryProblem() {
  const { m } = useI18n();
  const t = m.landing.tryIt;
  const [picked, setPicked] = useState<number>();
  const [checked, setChecked] = useState(false);
  const correct = picked === t.correct;
  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-lg shadow-accent/5 sm:p-6">
      <div className="text-xs font-medium tracking-wide text-accent uppercase">{t.label}</div>
      <Markdown source={t.prompt} className="text-lg font-medium" />
      <div role="radiogroup" aria-label={t.label} className="grid gap-2">
        {t.options.map((option, i) => {
          const tone = !checked
            ? picked === i
              ? "border-accent bg-accent-soft"
              : "border-line hover:border-accent/50"
            : i === t.correct
              ? "border-good bg-good-soft"
              : picked === i
                ? "border-bad bg-bad-soft"
                : "border-line";
          return (
            // biome-ignore lint/a11y/useSemanticElements: a styled option card with radio semantics, as in the session player
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={picked === i}
              disabled={checked}
              onClick={() => setPicked(i)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left transition disabled:cursor-default ${tone}`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sm font-medium">
                {String.fromCharCode(65 + i)}
              </span>
              <Markdown source={option} inline />
            </button>
          );
        })}
      </div>
      {!checked ? (
        <Button onClick={() => setChecked(true)} disabled={picked === undefined} className="px-6">
          {m.submit}
        </Button>
      ) : (
        <div className="space-y-3" aria-live="polite">
          <div className={`flex items-center gap-2 font-semibold ${correct ? "text-good" : "text-bad"}`}>
            {correct ? <CheckCircle size={20} weight="fill" /> : <XCircle size={20} weight="fill" />}
            {correct ? t.right : t.wrong}
          </div>
          <Markdown source={t.why[picked ?? 0] ?? ""} className="text-sm" />
          <Markdown source={t.solution} className="rounded-xl bg-page px-4 py-3 text-sm" />
          <p className="text-sm text-muted">{correct ? t.nextRight : t.nextWrong}</p>
          <Button
            variant="secondary"
            onClick={() => {
              setPicked(undefined);
              setChecked(false);
            }}
          >
            {t.again}
          </Button>
        </div>
      )}
    </div>
  );
}

function Section({
  id,
  tint,
  title,
  intro,
  children,
}: {
  id?: string;
  tint?: boolean;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-16 py-16 sm:py-20 ${tint ? "border-y border-line bg-surface" : ""}`}>
      <div className={`${inner} space-y-10`}>
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">{title}</h2>
          {intro && <p className="text-lg text-muted">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Shelves shows what can be learned from the live catalog, so its numbers are always true. */
function Shelves() {
  const { m, tx } = useI18n();
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  const shelves = new Map<string, string[]>();
  for (const c of courses.data?.courses ?? []) {
    const title = tx(c.group) || m.otherCourses;
    shelves.set(title, [...(shelves.get(title) ?? []), tx(c.title)]);
  }
  return (
    <div className="space-y-6">
      <div className="grid min-h-40 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...shelves].map(([title, list]) => (
          <div key={title} className="space-y-1.5 rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{title}</h3>
              <span className="shrink-0 text-xs text-muted">{m.landing.courseCount(list.length)}</span>
            </div>
            <p className="line-clamp-2 text-sm text-muted">{list.join(m.landing.listSeparator)}</p>
          </div>
        ))}
      </div>
      <Link to="/courses" className={buttonClass("secondary")}>
        {m.landing.seeCourses} <ArrowRight size={16} />
      </Link>
    </div>
  );
}

/** Landing introduces Great Academy to someone who has not used it, and lets them try it before signing up. */
export function Landing() {
  const { m } = useI18n();
  const { data: session } = useSession();
  const l = m.landing;
  const art = [PlacementArt, StepsArt, ReviewArt, QuizArt];
  const audienceIcons: readonly Icon[] = [BookOpenText, Student, UsersThree];
  return (
    <>
      <section className={`${inner} grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-[1.15fr_1fr]`}>
        <div className="space-y-6">
          <p className="text-sm font-medium text-accent">{l.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{l.title}</h1>
          <p className="max-w-xl text-lg text-muted">{l.body}</p>
          <div className="flex flex-wrap items-center gap-3">
            <StartLink />
            <a href="#how" className={buttonClass("secondary", large)}>
              {l.seeHow}
            </a>
          </div>
          <p className="text-sm text-muted">{l.facts}</p>
        </div>
        <TryProblem />
      </section>

      <Section id="how" tint title={l.howTitle} intro={l.howIntro}>
        <ol className="space-y-14">
          {l.steps.map((step, i) => {
            const Art = art[i] ?? PlacementArt;
            return (
              <li key={step.title} className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
                <div className={`space-y-3 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted">{step.body}</p>
                </div>
                <div className={`flex justify-center rounded-2xl bg-page p-6 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <Art />
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section title={l.audienceTitle}>
        <div className="grid gap-4 md:grid-cols-3">
          {l.audiences.map((a, i) => {
            const AudienceIcon = audienceIcons[i] ?? Student;
            return (
              <div key={a.title} className="space-y-3 rounded-2xl border border-line bg-surface p-6">
                <AudienceIcon size={28} weight="duotone" className="text-accent" />
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-muted">{a.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tint title={l.pathTitle} intro={l.pathIntro}>
        <Shelves />
      </Section>

      <Section title={l.faqTitle}>
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {l.faq.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <CaretDown size={16} className="shrink-0 text-muted transition group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="bg-accent py-16 text-white">
        <div className={`${inner} flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between`}>
          <div className="max-w-xl space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">{l.endTitle}</h2>
            <p className="text-white/85">{l.endBody}</p>
          </div>
          <Link to={session ? "/" : "/sign-up"} className={`${buttonClass("secondary", large)} shrink-0 border-transparent`}>
            {session ? l.goToLearning : m.signUp} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className={`${inner} flex flex-wrap items-center justify-between gap-3 py-8 text-sm text-muted`}>
        <span className="flex items-center gap-2 font-medium text-ink">
          <GraduationCap size={20} weight="duotone" className="text-accent" /> Great Academy
        </span>
        <span className="flex gap-4">
          <Link to="/courses">{m.courses}</Link>
          {!session && <Link to="/sign-in">{m.signIn}</Link>}
        </span>
      </footer>
    </>
  );
}
