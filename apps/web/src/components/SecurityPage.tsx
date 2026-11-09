import { CaretLeft } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { Card } from "./ui.tsx";

/**
 * SecurityPage is a page a row of the settings' Account security opens, as the apps push one: the way back to the
 * section, then the page's title and what it holds.
 */
export function SecurityPage({ title, children }: { title: string; children: ReactNode }) {
  const { m } = useI18n();
  return (
    <div className="space-y-4">
      <Link to="/settings" hash="security" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
        <CaretLeft size={14} />
        {m.security}
      </Link>
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
      </Card>
    </div>
  );
}
