import { Menu } from "@base-ui/react/menu";
import { Select } from "@base-ui/react/select";
import { THEMES, type Theme } from "@ga/design";
import type { Subject } from "@ga/proto/catalog/v1/catalog_pb";
import {
  BookOpen,
  CaretDown,
  ChartLineUp,
  Check,
  type Icon,
  Monitor,
  Moon,
  PlayCircle,
  Sun,
  Trophy,
  UserCircle,
  UsersThree,
} from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { hasInbox, useAccess } from "../lib/access.ts";
import { setAppearance, useAppearance } from "../lib/appearance.ts";
import { authClient, useSession } from "../lib/auth.ts";
import { type Messages, useI18n } from "../lib/i18n.tsx";
import { LOCALES, type Locale } from "../lib/locale.ts";
import { account, timeZone } from "../lib/rpc.ts";
import { SubjectChip, SubjectMark, useCatalog, useProfile, useShownSubject, useSubjects } from "../lib/subject.tsx";
import { Logo } from "./Logo.tsx";
import { buttonClass, menuItem, menuPopup } from "./ui.tsx";

const localeNames: Record<Locale, string> = { en: "English", "zh-CN": "简体中文" };
const themeIcons: Record<Theme, Icon> = { system: Monitor, light: Sun, dark: Moon };

/** The language, as a select box that names each language in that language and opens below itself. */
function LanguageSelect() {
  const { m, locale, setLocale } = useI18n();
  return (
    <Select.Root modal={false} items={localeNames} value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <Select.Trigger
        aria-label={m.language}
        className="inline-flex cursor-default items-center gap-1.5 rounded-lg border border-line bg-surface py-1 pr-2 pl-2.5 text-sm font-medium whitespace-nowrap outline-none transition select-none hover:border-accent/50 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
      >
        <Select.Value />
        <Select.Icon className="flex text-muted">
          <CaretDown size={12} weight="bold" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner alignItemWithTrigger={false} side="bottom" align="end" sideOffset={4} className="z-30">
          <Select.Popup className={`${menuPopup} !min-w-28`}>
            {LOCALES.map((l) => (
              <Select.Item key={l} value={l} lang={l} className={menuItem}>
                <Select.ItemText>{localeNames[l]}</Select.ItemText>
                <Select.ItemIndicator className="flex text-accent">
                  <Check size={14} weight="bold" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

/** The theme as a group of icons, for the top of the account menu. It leaves the menu open, to show the result. */
function ThemeButtons() {
  const { m } = useI18n();
  const { theme } = useAppearance();
  const names: Record<Theme, string> = { system: m.themeSystem, light: m.themeLight, dark: m.themeDark };
  return (
    <Menu.RadioGroup
      aria-label={m.theme}
      value={theme}
      onValueChange={(value: Theme) => setAppearance({ theme: value })}
      className="flex shrink-0 rounded-lg border border-line bg-page p-0.5"
    >
      {THEMES.map((t) => {
        const Glyph = themeIcons[t];
        return (
          <Menu.RadioItem
            key={t}
            value={t}
            aria-label={names[t]}
            title={names[t]}
            className="cursor-default rounded-md p-1.5 text-muted outline-none transition select-none data-[checked]:bg-surface data-[checked]:text-ink data-[checked]:shadow-sm data-[highlighted]:text-ink data-[highlighted]:ring-2 data-[highlighted]:ring-accent/25"
          >
            <Glyph size={16} />
          </Menu.RadioItem>
        );
      })}
    </Menu.RadioGroup>
  );
}

/** SubjectSwitcher is the subject chip of the header, which opens the list of subjects (docs/experience.md §3). */
function SubjectSwitcher({ subject }: { subject: Subject }) {
  const { m, tx } = useI18n();
  const navigate = useNavigate();
  const subjects = useSubjects();
  const list = useCatalog();
  const profile = useProfile();
  const enrolled = new Map(profile.data?.enrollments.map((e) => [e.subjectId, e]));
  const courseTitle = (id: string) => tx(list.data?.courses.find((c) => c.id === id)?.title);
  const started = subjects.filter((s) => enrolled.has(s.id));
  const fresh = subjects.filter((s) => !enrolled.has(s.id));
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`${m.subjects}: ${tx(subject.title)}`}
        className="flex min-w-0 shrink-0 items-center gap-1.5 rounded-lg py-1 pr-1.5 pl-1 outline-none transition hover:bg-line/50 focus-visible:ring-2 focus-visible:ring-accent/25"
      >
        <SubjectChip subject={subject} size={28} className="[&>span:last-child]:max-sm:hidden" />
        <CaretDown size={12} weight="bold" className="shrink-0 text-muted" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="start" className="z-30">
          <Menu.Popup className={`${menuPopup} w-80 max-w-[calc(100vw-2rem)]`}>
            {started.map((s) => {
              const e = enrolled.get(s.id);
              return (
                <Menu.Item
                  key={s.id}
                  className={`${menuItem} !items-start`}
                  onClick={() => navigate({ to: "/$subject", params: { subject: s.id } })}
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <SubjectMark subject={s} size={32} />
                    <span className="min-w-0">
                      <span className="block font-medium">{tx(s.title)}</span>
                      <span className="block truncate text-xs text-muted">{e && courseTitle(e.courseId)}</span>
                      <span className="block text-xs text-muted">{m.subjectToday(e?.xp?.today ?? 0, e?.xp?.goalToday ?? 0)}</span>
                    </span>
                  </span>
                  {s.id === subject.id && <Check size={14} weight="bold" className="mt-1 shrink-0 text-accent" />}
                </Menu.Item>
              );
            })}
            {fresh.length > 0 && (
              <>
                <div className="mt-1 border-t border-line px-3 pt-2 pb-1 text-xs font-medium text-muted">{m.subjectNotStarted}</div>
                {fresh.map((s) => (
                  <Menu.Item key={s.id} className={menuItem} onClick={() => navigate({ to: "/$subject", params: { subject: s.id } })}>
                    <span className="flex items-center gap-3">
                      <SubjectMark subject={s} size={24} />
                      {tx(s.title)}
                    </span>
                  </Menu.Item>
                ))}
              </>
            )}
            <div className="mt-1 border-t border-line pt-1">
              <Menu.Item className={menuItem} onClick={() => navigate({ to: "/courses", search: { subject: subject.id } })}>
                {m.courses}
              </Menu.Item>
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

/** placeName names a page outside every subject, which the header shows in place of the subject chip. */
function placeName(pathname: string, m: Messages): string {
  if (pathname.startsWith("/courses")) return m.courses;
  if (pathname.startsWith("/settings")) return m.settings;
  if (pathname.startsWith("/league")) return m.league;
  if (pathname.startsWith("/guardian")) return m.navLearners;
  return "";
}

/** Header is the bar atop every page: the logo, the subject chip and its pages, and the account (docs/experience.md §4). */
export function Header() {
  const { m } = useI18n();
  const { data: session } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routeSubject = useRouterState({
    select: (s) => s.matches.find((r) => r.routeId === "/$subject")?.params as { subject?: string } | undefined,
  })?.subject;
  const shownSubject = useShownSubject();
  const guarded = useQuery({
    queryKey: ["guarded"],
    queryFn: () => account.listGuardedLearners({ timeZone: timeZone() }),
    enabled: !!session,
  });
  const subjects = useSubjects();
  const access = useAccess();
  const guards = (guarded.data?.learners.length ?? 0) > 0;
  // A page of a subject, or a task, which belongs to the subject last shown.
  const subjectId = routeSubject ?? (pathname.startsWith("/session") ? shownSubject : undefined);
  const subject = session ? subjects.find((s) => s.id === subjectId) : undefined;
  const place = session && !subject ? placeName(pathname, m) : "";
  const navLink = (active: boolean) =>
    `flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition ${active ? "bg-subject-soft text-on-subject-soft" : "text-muted hover:text-ink"}`;
  const base = subject ? `/${subject.id}` : "";
  const onLearn = pathname === base || pathname.startsWith("/session");
  const onProgress =
    pathname.startsWith(`${base}/progress`) || pathname.startsWith(`${base}/history`) || pathname.startsWith(`${base}/topics`);
  const onCourse = pathname.startsWith(`${base}/course`);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 font-semibold tracking-tight whitespace-nowrap"
            aria-label="Great Academy"
          >
            <Logo size={26} />
            <span className={session ? "hidden lg:inline" : ""}>Great Academy</span>
          </Link>
          {subject && (
            <div data-subject={subject.id} className="flex min-w-0 items-center gap-1 sm:gap-2">
              <span className="h-5 w-px shrink-0 bg-line max-sm:hidden" aria-hidden />
              <SubjectSwitcher subject={subject} />
              <nav className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none]">
                <Link to="/$subject" params={{ subject: subject.id }} className={navLink(onLearn)} aria-label={m.navLearn}>
                  <PlayCircle size={18} className="sm:hidden" />
                  <span className="max-sm:hidden">{m.navLearn}</span>
                </Link>
                <Link to="/$subject/progress" params={{ subject: subject.id }} className={navLink(onProgress)} aria-label={m.navProgress}>
                  <ChartLineUp size={18} className="sm:hidden" />
                  <span className="max-sm:hidden">{m.navProgress}</span>
                </Link>
                <Link to="/$subject/course" params={{ subject: subject.id }} className={navLink(onCourse)} aria-label={m.navCourse}>
                  <BookOpen size={18} className="sm:hidden" />
                  <span className="max-sm:hidden">{m.navCourse}</span>
                </Link>
              </nav>
            </div>
          )}
          {place && (
            <>
              <span className="h-5 w-px shrink-0 bg-line" aria-hidden />
              <span className="truncate text-sm font-semibold">{place}</span>
            </>
          )}
        </div>
        <nav className="flex shrink-0 items-center gap-1">
          {!session && (
            <Link to="/courses" className={buttonClass("ghost", "max-sm:hidden")}>
              {m.courses}
            </Link>
          )}
          {session && guards && (
            <Link to="/guardian" className={buttonClass("ghost", "!p-2")} aria-label={m.navLearners} title={m.navLearners}>
              <UsersThree size={20} />
            </Link>
          )}
          {session && (
            <Link to="/league" className={buttonClass("ghost", "!p-2")} aria-label={m.league} title={m.league}>
              <Trophy size={20} />
            </Link>
          )}
          <span className={session ? "max-md:hidden" : ""}>
            <LanguageSelect />
          </span>
          {session ? (
            <Menu.Root>
              <Menu.Trigger className={buttonClass("ghost", "!p-2")} aria-label={m.settings}>
                <UserCircle size={20} />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={4} align="end" className="z-30">
                  <Menu.Popup className={`${menuPopup} w-72 max-w-[calc(100vw-2rem)]`}>
                    <div className="mb-1 flex items-center justify-between gap-3 border-b border-line px-3 pt-1.5 pb-2.5">
                      <div className="min-w-0">
                        <div className="truncate font-medium" title={session.user.name}>
                          {session.user.name}
                        </div>
                        {hasInbox(session.user.email) && (
                          <div className="truncate text-xs text-muted" title={session.user.email}>
                            {session.user.email}
                          </div>
                        )}
                      </div>
                      <ThemeButtons />
                    </div>
                    <Menu.Item className={menuItem} onClick={() => navigate({ to: "/courses" })}>
                      {m.courses}
                    </Menu.Item>
                    <Menu.Item className={menuItem} onClick={() => navigate({ to: "/guardian" })}>
                      {m.guardedTitle}
                    </Menu.Item>
                    <Menu.Item className={menuItem} onClick={() => navigate({ to: "/settings" })}>
                      {m.settings}
                    </Menu.Item>
                    {access?.admin && (
                      <Menu.Item className={menuItem} onClick={() => navigate({ to: "/admin" })}>
                        {m.navAdmin}
                      </Menu.Item>
                    )}
                    <Menu.Item className={menuItem} onClick={() => navigate({ to: "/landing" })}>
                      {m.navAbout}
                    </Menu.Item>
                    <Menu.Item
                      className={menuItem}
                      onClick={async () => {
                        await authClient.signOut();
                        qc.clear();
                        await navigate({ to: "/" });
                      }}
                    >
                      {m.signOut}
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          ) : (
            <Link to="/sign-in" className={buttonClass("ghost")}>
              {m.signIn}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
