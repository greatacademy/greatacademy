import { Menu } from "@base-ui/react/menu";
import { THEMES, type Theme } from "@ga/design";
import { CaretDown, GraduationCap, type Icon, Monitor, Moon, Sun, UserCircle } from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

import { setAppearance, useAppearance } from "../lib/appearance.ts";
import { authClient, useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { LOCALES, type Locale } from "../lib/locale.ts";
import { account, learning, timeZone } from "../lib/rpc.ts";
import { buttonClass, menuItem, menuPopup } from "./ui.tsx";

const localeNames: Record<Locale, string> = { en: "English", "zh-CN": "简体中文" };
const themeIcons: Record<Theme, Icon> = { system: Monitor, light: Sun, dark: Moon };

/** The language, as a select box that names each language in that language. */
function LanguageSelect() {
  const { m, locale, setLocale } = useI18n();
  return (
    <span className="relative flex items-center">
      <select
        aria-label={m.language}
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="appearance-none rounded-lg border border-line bg-surface py-1 pr-7 pl-2.5 text-sm font-medium outline-none transition hover:border-accent/50 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} lang={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
      <CaretDown size={12} weight="bold" className="pointer-events-none absolute right-2.5 text-muted" />
    </span>
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

export function Header() {
  const { m } = useI18n();
  const { data: session } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const guarded = useQuery({
    queryKey: ["guarded"],
    queryFn: () => account.listGuardedLearners({ timeZone: timeZone() }),
    enabled: !!session,
  });
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => learning.getProfile({ timeZone: timeZone() }),
    enabled: !!session,
  });
  const guards = (guarded.data?.learners.length ?? 0) > 0;
  // An account that only follows others has nothing of its own to learn yet.
  const learns = !guards || (profile.data?.enrollments.length ?? 0) > 0;
  const navLink = (active: boolean) =>
    `shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition ${active ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"}`;
  const onLearning = pathname === "/" || pathname.startsWith("/learn") || pathname.startsWith("/session");

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-1 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap" aria-label="Great Academy">
            <GraduationCap size={26} weight="duotone" className="text-accent" />
            <span className={session ? "hidden md:inline" : ""}>Great Academy</span>
          </Link>
          {session && (
            <nav className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none]">
              {learns && (
                <Link to="/" className={navLink(onLearning)}>
                  {m.navLearn}
                </Link>
              )}
              <Link to="/courses" className={navLink(pathname.startsWith("/courses"))}>
                {m.courses}
              </Link>
              {guards && (
                <Link to="/guardian" className={navLink(pathname.startsWith("/guardian"))}>
                  {m.navLearners}
                </Link>
              )}
            </nav>
          )}
        </div>
        <nav className="flex shrink-0 items-center gap-1">
          {!session && (
            <Link to="/courses" className={buttonClass("ghost", "max-sm:hidden")}>
              {m.courses}
            </Link>
          )}
          <LanguageSelect />
          {session ? (
            <Menu.Root>
              <Menu.Trigger className={buttonClass("ghost", "px-2")} aria-label={m.settings}>
                <UserCircle size={20} />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={6} align="end">
                  <Menu.Popup className={`${menuPopup} w-72 max-w-[calc(100vw-2rem)]`}>
                    <div className="mb-1 flex items-center justify-between gap-3 border-b border-line px-3 pt-1.5 pb-2.5">
                      <div className="min-w-0">
                        <div className="truncate font-medium" title={session.user.name}>
                          {session.user.name}
                        </div>
                        <div className="truncate text-xs text-muted" title={session.user.email}>
                          {session.user.email}
                        </div>
                      </div>
                      <ThemeButtons />
                    </div>
                    <Menu.Item className={menuItem} onClick={() => navigate({ to: "/league" })}>
                      {m.league}
                    </Menu.Item>
                    <Menu.Item className={menuItem} onClick={() => navigate({ to: "/guardian" })}>
                      {m.guardedTitle}
                    </Menu.Item>
                    <Menu.Item className={menuItem} onClick={() => navigate({ to: "/settings" })}>
                      {m.settings}
                    </Menu.Item>
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
            <>
              <Link to="/sign-in" className={buttonClass("ghost")}>
                {m.signIn}
              </Link>
              <Link to="/sign-up" className={buttonClass("primary", "max-sm:hidden")}>
                {m.signUp}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
