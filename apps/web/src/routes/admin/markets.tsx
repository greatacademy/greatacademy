import type { Market } from "@ga/proto/admin/v1/admin_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Button, Card, ErrorNote, Spinner } from "../../components/ui.tsx";
import { useAdminText } from "../../lib/admin-text.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { errorText, regionName, usePrivacyText } from "../../lib/privacy-text.ts";
import { admin } from "../../lib/rpc.ts";

export const Route = createFileRoute("/admin/markets")({ component: Markets });

function MarketCard({ market }: { market: Market }) {
  const { m, locale } = useI18n();
  const t = useAdminText();
  const p = usePrivacyText();
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const set = useMutation({
    mutationFn: (req: { open: boolean; signedOffBy: string; signedOffOn: string; languageGapAccepted: boolean }) =>
      admin.setMarketOpen({ country: market.country, ...req }),
    onSuccess: () => {
      setConfirming(false);
      return qc.invalidateQueries({ queryKey: ["admin", "markets"] });
    },
  });

  function open(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    set.mutate({
      open: true,
      signedOffBy: String(data.get("by")),
      signedOffOn: String(data.get("on")),
      languageGapAccepted: data.get("gap") === "on",
    });
  }

  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold">{regionName(market.country, locale)}</h2>
        <span className={`text-sm ${market.minorsOpen ? "text-good" : "text-muted"}`}>
          {market.minorsOpen ? t.openToMinors : t.closedToMinors}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-muted">{t.rule}</dt>
          <dd>{t.ruleNames[market.status] ?? market.status}</dd>
        </div>
        <div>
          <dt className="text-muted">{t.guardianBelow}</dt>
          <dd>{market.guardianBelow}</dd>
        </div>
        <div>
          <dt className="text-muted">{t.languages}</dt>
          <dd>{market.languages.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-muted">{t.aiScopes}</dt>
          <dd>{market.aiScopes.length ? market.aiScopes.map((s) => p.scopes[s]?.name ?? s).join(", ") : t.none}</dd>
        </div>
      </dl>
      {market.missingLanguages.length > 0 && (
        <p className="text-sm text-warn">
          {t.missing}: {market.missingLanguages.join(", ")}
        </p>
      )}
      {market.status === "closed" ? (
        <p className="text-sm text-muted">{t.noSwitch}</p>
      ) : market.minorsOpen ? (
        <>
          <p className="text-sm text-muted">
            {market.signedOffBy} · {market.signedOffOn}
          </p>
          {confirming ? (
            <div className="space-y-2">
              <p className="text-sm">{t.closeConfirm}</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={set.isPending}
                  onClick={() =>
                    set.mutate({
                      open: false,
                      signedOffBy: market.signedOffBy,
                      signedOffOn: market.signedOffOn,
                      languageGapAccepted: market.languageGapAccepted,
                    })
                  }
                >
                  {t.confirmClose}
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(false)}>
                  {t.cancel}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setConfirming(true)}>
              {t.closeMarket}
            </Button>
          )}
        </>
      ) : (
        <form onSubmit={open} className="space-y-3 border-t border-line pt-3">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.signedOffBy}</span>
            <input name="by" required defaultValue={market.signedOffBy} className={field} />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.signedOffOn}</span>
            <input name="on" type="date" required defaultValue={market.signedOffOn} className={field} />
          </label>
          {market.missingLanguages.length > 0 && (
            <label className="flex items-center gap-2 text-sm">
              <input name="gap" type="checkbox" defaultChecked={market.languageGapAccepted} />
              {t.gapAccepted}
            </label>
          )}
          <Button type="submit" disabled={set.isPending}>
            {t.openMarket}
          </Button>
        </form>
      )}
      {set.isError && <ErrorNote message={errorText(set.error, locale, m.error)} />}
    </Card>
  );
}

function Markets() {
  const { m } = useI18n();
  const q = useQuery({ queryKey: ["admin", "markets"], queryFn: () => admin.listMarkets({}), staleTime: 0 });
  if (q.isPending) return <Spinner label={m.loading} />;
  if (q.isError) return <LoadError error={q.error} onRetry={() => q.refetch()} />;
  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      {q.data.markets.map((market) => (
        <MarketCard key={market.country} market={market} />
      ))}
    </div>
  );
}
