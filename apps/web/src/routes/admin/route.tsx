import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

import { NotFoundNote } from "../../components/LoadError.tsx";
import { Spinner } from "../../components/ui.tsx";
import { useAccess } from "../../lib/access.ts";
import { useAdminText } from "../../lib/admin-text.ts";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const pages = [
  ["overview", "/admin"],
  ["verifications", "/admin/verifications"],
  ["markets", "/admin/markets"],
  ["ai", "/admin/ai"],
  ["costs", "/admin/costs"],
  ["checks", "/admin/checks"],
  ["register", "/admin/register"],
  ["notices", "/admin/notices"],
  ["admins", "/admin/admins"],
  ["log", "/admin/log"],
] as const;

/** AdminLayout shows the console to administrators and a plain not-found page to anyone else; the server refuses them regardless. */
function AdminLayout() {
  const { m } = useI18n();
  const t = useAdminText();
  const session = useRequireSession();
  const access = useAccess();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!session || !access) return <Spinner label={m.loading} />;
  if (!access.admin) return <NotFoundNote />;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
      <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none]">
        {pages.map(([key, to]) => {
          const active = to === "/admin" ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(to);
          return (
            <Link
              key={key}
              to={to}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${active ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"}`}
            >
              {t.nav[key]}
            </Link>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
}
