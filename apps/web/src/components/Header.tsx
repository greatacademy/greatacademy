import { Menu } from "@base-ui/react/menu";
import { GraduationCap, Translate, UserCircle } from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

import { authClient, useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { LOCALES, type Locale } from "../lib/locale.ts";
import { account, timeZone } from "../lib/rpc.ts";
import { buttonClass, menuItem, menuPopup } from "./ui.tsx";

const localeNames: Record<Locale, string> = { en: "English", "zh-CN": "简体中文" };

export function Header() {
  const { m, locale, setLocale } = useI18n();
  const { data: session } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const guarded = useQuery({
    queryKey: ["guarded"],
    queryFn: () => account.listGuardedLearners({ timeZone: timeZone() }),
    enabled: !!session,
  });
  const navLink = (active: boolean) =>
    `rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${active ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"}`;
  const learning = pathname === "/" || pathname.startsWith("/learn") || pathname.startsWith("/session");

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-1 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap" aria-label="Great Academy">
            <GraduationCap size={26} weight="duotone" className="text-accent" />
            <span className={session ? "hidden md:inline" : ""}>Great Academy</span>
          </Link>
          {session && (
            <nav className="flex items-center gap-0.5">
              <Link to="/" className={navLink(learning)}>
                {m.navLearn}
              </Link>
              <Link to="/courses" className={navLink(pathname.startsWith("/courses"))}>
                {m.courses}
              </Link>
              {(guarded.data?.learners.length ?? 0) > 0 && (
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
          <Menu.Root>
            <Menu.Trigger className={buttonClass("ghost", "px-2.5")} aria-label={m.language}>
              <Translate size={18} />
              <span className="hidden sm:inline">{localeNames[locale]}</span>
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner sideOffset={6} align="end">
                <Menu.Popup className={menuPopup}>
                  {LOCALES.map((l) => (
                    <Menu.Item key={l} className={menuItem} onClick={() => setLocale(l)}>
                      {localeNames[l]}
                      {l === locale && <span className="text-accent">●</span>}
                    </Menu.Item>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
          {session ? (
            <Menu.Root>
              <Menu.Trigger className={buttonClass("ghost", "px-2.5")}>
                <UserCircle size={20} />
                <span className="hidden max-w-32 truncate sm:inline">{session.user.name}</span>
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={6} align="end">
                  <Menu.Popup className={menuPopup}>
                    <div className="px-3 py-2 text-xs text-muted">{session.user.email}</div>
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
