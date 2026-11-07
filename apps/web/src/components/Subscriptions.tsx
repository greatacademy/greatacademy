import { Account, Interval, type Subscription } from "@ga/proto/billing/v1/billing_pb";
import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { useAccess } from "../lib/access.ts";
import { useBillingText } from "../lib/billing-text.ts";
import { useI18n } from "../lib/i18n.tsx";
import { errorText } from "../lib/privacy-text.ts";
import { billing } from "../lib/rpc.ts";
import { Button, buttonClass, Card, ErrorNote } from "./ui.tsx";

function Row({ s, title }: { s: Subscription; title: string }) {
  const { m, locale } = useI18n();
  const t = useBillingText();
  const qc = useQueryClient();
  const [asking, setAsking] = useState(false);
  const refresh = () =>
    Promise.all([qc.invalidateQueries({ queryKey: ["subscriptions"] }), qc.invalidateQueries({ queryKey: ["access"] })]);
  const cancel = useMutation({ mutationFn: (resume: boolean) => billing.cancelSubscription({ id: s.id, resume }), onSuccess: refresh });
  const refund = useMutation({ mutationFn: () => billing.refundSubscription({ id: s.id }), onSuccess: refresh });
  const date = (ms: bigint) => new Date(Number(ms)).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  const now = BigInt(Date.now());
  const running = s.paidUntil > now && !s.refunded;
  const card = s.account === Account.CARD;
  const when = !running
    ? s.refunded
      ? t.refunded
      : t.endedOn(date(s.paidUntil))
    : card && !s.cancelled
      ? t.renewsOn(date(s.paidUntil))
      : t.endsOn(date(s.paidUntil));
  const whose = !s.payer ? t.coveredBy : s.learnerId === "" ? t.waitingChild : s.learnerName || "";
  const failure = cancel.error ?? refund.error;
  return (
    <div className="space-y-2 border-t border-line pt-3 first:border-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-medium">
          {title} · {s.interval === Interval.YEAR ? t.yearly : t.monthly}
          {s.account === Account.GRANT ? ` · ${t.grant}` : s.account === Account.WALLET ? ` · ${t.wallet}` : ""}
        </span>
        <span className="text-sm text-muted">{when}</span>
      </div>
      {whose && <p className="text-sm text-muted">{whose}</p>}
      {s.payer && running && (
        <div className="flex flex-wrap items-center gap-2">
          {card && (
            <Button variant="secondary" disabled={cancel.isPending} onClick={() => cancel.mutate(s.cancelled)}>
              {s.cancelled ? t.resume : t.cancel}
            </Button>
          )}
          {s.refundableUntil > 0n &&
            (asking ? (
              <>
                <span className="text-sm">{t.refundConfirm}</span>
                <Button variant="secondary" disabled={refund.isPending} onClick={() => refund.mutate()}>
                  {t.confirm}
                </Button>
                <Button variant="ghost" onClick={() => setAsking(false)}>
                  {t.keep}
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => setAsking(true)}>
                {t.refund} · {t.refundUntil(date(s.refundableUntil))}
              </Button>
            ))}
        </div>
      )}
      {failure && <ErrorNote message={errorText(failure, locale, m.error)} />}
    </div>
  );
}

/** Subscriptions lists the plans a person pays for or is covered by, with cancelling, refunds and the card portal. */
export function Subscriptions() {
  const { m, locale, tx } = useI18n();
  const t = useBillingText();
  const access = useAccess();
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => billing.listPlans({}), enabled: !!access });
  const subs = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => billing.listSubscriptions({}),
    enabled: !!access && plans.data?.required === true,
    staleTime: 0,
  });
  const portal = useMutation({
    mutationFn: () => billing.openPortal({ returnUrl: `${window.location.origin}/settings` }),
    onSuccess: ({ url }) => window.location.assign(url),
  });
  if (!access || !plans.data?.required || !subs.data) return null;
  const adult = access.band === Band.ADULT;
  const list = subs.data.subscriptions;
  if (!adult && list.length === 0) return null;
  const titles = new Map(plans.data.plans.map((p) => [p.scope, p.title ? tx(p.title) : p.scope]));
  const hasCard = list.some((s) => s.payer && s.account === Account.CARD);
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">{t.subscriptions}</h2>
      {list.length === 0 ? (
        <p className="text-sm text-muted">{t.noSubscriptions}</p>
      ) : (
        <div className="space-y-3">
          {list.map((s) => (
            <Row key={s.id} s={s} title={titles.get(s.scope) ?? s.scope} />
          ))}
        </div>
      )}
      {adult && (
        <div className="flex flex-wrap gap-2">
          <Link to="/plans" className={buttonClass()}>
            {t.buyPlan}
          </Link>
          {hasCard && (
            <Button variant="secondary" disabled={portal.isPending} onClick={() => portal.mutate()}>
              {t.portal}
            </Button>
          )}
        </div>
      )}
      {portal.isError && <ErrorNote message={errorText(portal.error, locale, m.error)} />}
    </Card>
  );
}
