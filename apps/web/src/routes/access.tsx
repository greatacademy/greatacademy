import { AccessStatus } from "@ga/proto/privacy/v1/privacy_pb";
import { createFileRoute, Link } from "@tanstack/react-router";

import { buttonClass, Card, Spinner } from "../components/ui.tsx";
import { useAccess } from "../lib/access.ts";
import { useRequireSession } from "../lib/hooks.ts";
import { useI18n } from "../lib/i18n.tsx";
import { usePrivacyText } from "../lib/privacy-text.ts";

export const Route = createFileRoute("/access")({ component: Access });

/** Access explains why study is not available to this account, without losing anything. */
function Access() {
  const { m } = useI18n();
  const t = usePrivacyText();
  const session = useRequireSession();
  const access = useAccess();
  if (!session || !access) return <Spinner label={m.loading} />;
  const closed = access.status === AccessStatus.MARKET_CLOSED;
  return (
    <Card className="mx-auto mt-6 max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">{closed ? t.closedTitle : t.guardianTitle}</h1>
      <p className="text-muted">{closed ? t.closedBody : t.guardianBody}</p>
      <Link to="/settings" hash={closed ? "privacy" : "guardian"} className={buttonClass("secondary")}>
        {t.toSettings}
      </Link>
    </Card>
  );
}
