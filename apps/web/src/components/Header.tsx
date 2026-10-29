import { Menu } from "@base-ui/react/menu";
import { GraduationCap, Translate, UserCircle } from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";

import { authClient, useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { LOCALES, type Locale } from "../lib/locale.ts";
import { buttonClass } from "./ui.tsx";

const localeNames: Record<Locale, string> = { en: "English", "zh-CN": "简体中文" };

const menuPopup = "min-w-40 rounded-xl border border-line bg-surface p-1 text-sm shadow-lg outline-none";
const menuItem =
  "flex cursor-default items-center justify-between gap-4 rounded-lg px-3 py-2 outline-none select-none data-[highlighted]:bg-accent-soft";

export function Header() {
  const { m, locale, setLocale } = useI18n();
  const { data: session } = useSession();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <GraduationCap size={26} weight="duotone" className="text-accent" />
          Great Academy
        </Link>
        <nav className="flex items-center gap-1">
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
                    <Menu.Item
                      className={menuItem}
                      onClick={async () => {
                        await authClient.signOut();
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
              <Link to="/sign-up" className={buttonClass("primary", "hidden sm:inline-flex")}>
                {m.signUp}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
