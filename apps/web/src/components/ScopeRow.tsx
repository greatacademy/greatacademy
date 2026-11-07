import type { Consent, ScopeState } from "@ga/proto/privacy/v1/privacy_pb";

import { useI18n } from "../lib/i18n.tsx";
import { usePrivacyText } from "../lib/privacy-text.ts";
import { Button } from "./ui.tsx";

/** ScopeRow is one purpose on its own, with what it does, whether it is on, and its one action. */
export function ScopeRow({
  state,
  consents,
  busy,
  onGrant,
  onAssent,
  onWithdraw,
}: {
  state: ScopeState;
  consents: readonly Consent[];
  busy: boolean;
  onGrant?: () => void;
  onAssent?: () => void;
  onWithdraw: () => void;
}) {
  const { locale } = useI18n();
  const t = usePrivacyText();
  const text = t.scopes[state.scope] ?? { name: state.scope, body: "" };
  const current = consents.find((c) => c.scope === state.scope && c.withdrawnAt === 0n);
  const expires = state.inForce && current ? t.expires(new Date(Number(current.expiresAt)).toLocaleDateString(locale)) : undefined;
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 text-sm">
      <div className="min-w-0 flex-1 basis-60 space-y-0.5">
        <div className="font-medium">
          {text.name}{" "}
          <span className={state.inForce ? "font-normal text-good" : "font-normal text-muted"}>
            · {state.inForce ? t.on : state.canGrant || state.needsAssent ? t.off : t.notAvailable}
          </span>
        </div>
        <p className="text-muted">{text.body}</p>
        {expires && <p className="text-xs text-muted">{expires}</p>}
        {state.needsAssent && onAssent && <p>{t.assentNote}</p>}
      </div>
      <div className="flex gap-2">
        {state.needsAssent && onAssent && (
          <Button variant="secondary" onClick={onAssent} disabled={busy}>
            {t.agree}
          </Button>
        )}
        {state.inForce || state.needsAssent ? (
          <Button variant="ghost" onClick={onWithdraw} disabled={busy}>
            {t.turnOff}
          </Button>
        ) : (
          state.canGrant &&
          onGrant && (
            <Button variant="secondary" onClick={onGrant} disabled={busy}>
              {t.turnOn}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
