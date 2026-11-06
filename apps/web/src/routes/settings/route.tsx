import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { useSession } from "../../lib/auth.ts";
import { useI18n } from "../../lib/i18n.tsx";

export const Route = createFileRoute("/settings")({ component: SettingsLayout });

const tab = "border-b-2 px-1 pb-2.5 text-sm font-medium transition";

function SettingsLayout() {
  const { m } = useI18n();
  const { data: session } = useSession();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{m.settings}</h1>
      {/* Appearance belongs to the browser and needs no account, so a signed-out visitor has only that page. */}
      {session && (
        <nav className="flex gap-5 border-b border-line">
          <Link
            to="/settings"
            activeOptions={{ exact: true }}
            className={`${tab} -mb-px`}
            activeProps={{ className: "border-accent text-ink" }}
            inactiveProps={{ className: "border-transparent text-muted hover:text-ink" }}
          >
            {m.settingsAccount}
          </Link>
          <Link
            to="/settings/appearance"
            className={`${tab} -mb-px`}
            activeProps={{ className: "border-accent text-ink" }}
            inactiveProps={{ className: "border-transparent text-muted hover:text-ink" }}
          >
            {m.appearance}
          </Link>
        </nav>
      )}
      <Outlet />
    </div>
  );
}
