import { Account, Interval, type Plan } from "@ga/proto/billing/v1/billing_pb";
import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { CheckCircle } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

import { LoadError } from "../components/LoadError.tsx";
import { Button, buttonClass, Card, ErrorNote, Spinner } from "../components/ui.tsx";
import { useAccess } from "../lib/access.ts";
import { type BillingText, useBillingText } from "../lib/billing-text.ts";
import { useRequireSession } from "../lib/hooks.ts";
import { useI18n } from "../lib/i18n.tsx";
import { errorText } from "../lib/privacy-text.ts";
import { account, billing, timeZone } from "../lib/rpc.ts";

/** PlansSearch says whom a plan is for, which plan to start on, and which Checkout session just came back. */
interface PlansSearch {
  readonly child?: boolean;
  readonly learner?: string;
  readonly scope?: string;
  readonly checkout?: string;
}

export const Route = createFileRoute("/plans")({
  validateSearch: (s: Record<string, unknown>): PlansSearch => ({
    ...(s.child === true || s.child === "1" || s.child === 1 ? { child: true } : {}),
    ...(typeof s.learner === "string" && s.learner ? { learner: s.learner } : {}),
    ...(typeof s.scope === "string" && s.scope ? { scope: s.scope } : {}),
    ...(typeof s.checkout === "string" && s.checkout ? { checkout: s.checkout } : {}),
  }),
  component: Plans,
});

/** dollars writes a price in US cents. */
export const dollars = (cents: number) => `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;

function Toggle<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="inline-flex rounded-lg border border-line bg-page p-1">
      <legend className="sr-only">{label}</legend>
      {options.map((o) => (
        <label
          key={o.value}
          className={`relative cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${value === o.value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
        >
          <input type="radio" name={name} className="sr-only" checked={value === o.value} onChange={() => onChange(o.value)} />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}

function Statement({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-accent"
      />
      <span>{children}</span>
    </label>
  );
}

/** Returned waits on a Checkout session that came back until its payment is recorded. */
function Returned({ checkout, child, t }: { checkout: string; child: boolean; t: BillingText }) {
  const qc = useQueryClient();
  const [tries, setTries] = useState(0);
  const q = useQuery({
    queryKey: ["checkout", checkout, tries],
    queryFn: () => billing.getCheckout({ checkoutId: checkout }),
    staleTime: Number.POSITIVE_INFINITY,
  });
  const done = q.data?.done === true;
  useEffect(() => {
    if (done) {
      void qc.invalidateQueries({ queryKey: ["access"] });
      void qc.invalidateQueries({ queryKey: ["subscriptions"] });
      void qc.invalidateQueries({ queryKey: ["plans"] });
      return;
    }
    if (!q.isFetched || tries >= 30) return;
    const timer = setTimeout(() => setTries((n) => n + 1), 2000);
    return () => clearTimeout(timer);
  }, [done, q.isFetched, tries, qc]);
  return (
    <Card className="mx-auto mt-6 max-w-md space-y-4">
      {done ? (
        <>
          <p role="status" className="flex items-center gap-2 text-lg font-semibold text-good">
            <CheckCircle size={24} weight="fill" /> {t.paid}
          </p>
          <Link to={child ? "/guardian" : "/"} className={buttonClass()}>
            {child ? t.toLearners : t.start}
          </Link>
        </>
      ) : tries >= 30 ? (
        <p role="status">{t.paidSlow}</p>
      ) : (
        <Spinner label={t.waiting} />
      )}
    </Card>
  );
}

/**
 * Plans sells a plan: one subject or all of them, monthly or yearly, by card
 * or by Alipay and WeChat Pay, after the payer ticks three statements
 * (docs/billing.md §4). Only an adult pays; a teen is sent to a guardian.
 */
function Plans() {
  const { m, locale, tx } = useI18n();
  const t = useBillingText();
  const session = useRequireSession();
  const access = useAccess();
  const { child = false, learner, scope: initial, checkout } = Route.useSearch();
  const plans = useQuery({
    queryKey: ["plans", learner ?? "", child],
    queryFn: () => billing.listPlans({ ...(learner && { learnerId: learner }), forNewChild: child }),
    enabled: !!session,
  });
  const guarded = useQuery({
    queryKey: ["guarded"],
    queryFn: () => account.listGuardedLearners({ timeZone: timeZone() }),
    enabled: !!session && !!learner,
  });
  const [interval, setPeriod] = useState<"month" | "year">("month");
  const [pay, setPay] = useState<"card" | "wallet">("card");
  const [scope, setScope] = useState<string | undefined>(initial);
  const [terms, setTerms] = useState(false);
  const [renewal, setRenewal] = useState(false);
  const [refund, setRefund] = useState(false);
  const start = useMutation({
    mutationFn: (s: string) => {
      const back = new URL("/plans", window.location.origin);
      if (child) back.searchParams.set("child", "1");
      if (learner) back.searchParams.set("learner", learner);
      return billing.startCheckout({
        scope: s,
        interval: interval === "year" ? Interval.YEAR : Interval.MONTH,
        account: pay === "card" ? Account.CARD : Account.WALLET,
        ...(learner && { learnerId: learner }),
        forNewChild: child,
        agreedTerms: terms,
        agreedRenewal: renewal,
        agreedRefund: refund,
        returnUrl: back.toString(),
        locale,
      });
    },
    onSuccess: ({ url }) => window.location.assign(url),
  });

  if (checkout) return <Returned checkout={checkout} child={child} t={t} />;
  if (!session || !access || plans.isPending) return <Spinner label={m.loading} />;
  if (plans.isError) return <LoadError error={plans.error} onRetry={() => plans.refetch()} />;
  if (!plans.data.required)
    return (
      <Card className="mx-auto mt-6 max-w-md">
        <p>{t.billingOff}</p>
      </Card>
    );
  if (access.band !== Band.ADULT)
    return (
      <Card className="mx-auto mt-6 max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">{t.teenTitle}</h1>
        <p className="text-muted">{t.teenBody}</p>
        <Link to="/settings" hash="guardian" className={buttonClass("secondary")}>
          {t.toInvite}
        </Link>
      </Card>
    );

  const name = learner && guarded.data?.learners.find((l) => l.learnerId === learner)?.name;
  const wallet = pay === "wallet";
  const price = (p: Plan) => (interval === "year" ? p.yearCents : p.monthCents);
  // What the learner has now is known only when buying for oneself (docs/billing.md §5).
  const covered = !child && !learner ? access.covered : [];
  const owns = (s: string) => covered.includes("all") || covered.includes(s);
  // Buying all subjects beside the payer's subject plans is an upgrade: their unused time comes off.
  const credit = plans.data.upgradeCreditCents;
  const allPlan = plans.data.plans.find((p) => p.scope === "all");
  const upgrading = scope === "all" && credit > 0 && allPlan !== undefined;
  const net = allPlan ? price(allPlan) - credit : 0;
  const tooMuch = upgrading && net < 50;
  const others = covered.filter((s) => s !== "all" && !plans.data.upgradeScopes.includes(s));
  const ready = scope !== undefined && !owns(scope) && !tooMuch && terms && renewal && refund;
  const refundable = plans.data.firstRefund && interval === "month";
  const titleOf = (s: string) => {
    const p = plans.data.plans.find((x) => x.scope === s);
    return p?.title ? tx(p.title) : s;
  };
  const sorted = [...plans.data.plans].sort((a, b) => Number(a.scope === "all") - Number(b.scope === "all"));

  return (
    <div className="mx-auto mt-6 max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t.plansTitle}</h1>
        <p className="text-sm font-medium text-accent">{child ? t.forChild : name ? t.forLearner(name) : t.forSelf}</p>
        <p className="text-sm text-muted">
          {t.plansBody} {plans.data.firstRefund ? t.refundFirst : t.refundUsed}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Toggle
          label={t.yearly}
          name="interval"
          value={interval}
          onChange={(v) => {
            setPeriod(v);
            setRefund(false);
          }}
          options={[
            { value: "month", label: t.monthly },
            { value: "year", label: `${t.yearly} · ${t.yearlySaving}` },
          ]}
        />
        {plans.data.wallet && (
          <Toggle
            label={t.payWith}
            name="pay"
            value={pay}
            onChange={(v) => {
              setPay(v);
              setRenewal(false);
            }}
            options={[
              { value: "card", label: t.card },
              { value: "wallet", label: t.wallet },
            ]}
          />
        )}
      </div>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">{t.plansTitle}</legend>
        {sorted.map((p) => (
          <label
            key={p.scope}
            className={`relative rounded-2xl border bg-surface p-5 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${owns(p.scope) ? "cursor-not-allowed border-line opacity-60" : scope === p.scope ? "cursor-pointer border-accent ring-2 ring-accent/30" : "cursor-pointer border-line hover:border-accent/50"}`}
          >
            <input
              type="radio"
              name="plan"
              className="sr-only"
              disabled={owns(p.scope)}
              checked={scope === p.scope}
              onChange={() => setScope(p.scope)}
            />
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-semibold">{p.title ? tx(p.title) : p.scope}</span>
              {owns(p.scope) && <span className="text-xs font-medium text-good">{t.owned}</span>}
            </span>
            <span className="block text-sm text-muted">{p.scope === "all" ? t.allSubjects : t.oneSubject}</span>
            <span className="mt-3 block text-2xl font-semibold">
              {dollars(price(p))} <span className="text-sm font-normal text-muted">{interval === "year" ? t.perYear : t.perMonth}</span>
            </span>
          </label>
        ))}
      </fieldset>
      {wallet && <p className="text-sm text-muted">{t.walletNote}</p>}
      {plans.data.firstRefund && interval === "year" && <p className="text-sm text-muted">{t.yearNoRefund}</p>}
      {upgrading && allPlan && (
        <Card className="space-y-2 p-5 text-sm">
          <p className="font-semibold">{t.upgradeFrom(plans.data.upgradeScopes.map(titleOf))}</p>
          {tooMuch ? (
            <p>{interval === "month" ? t.upgradeTooMuchMonth : t.upgradeTooMuchYear}</p>
          ) : (
            <>
              <dl className="space-y-1">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{titleOf("all")}</dt>
                  <dd>{dollars(price(allPlan))}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.upgradeCredit}</dt>
                  <dd>−{dollars(credit)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-1 font-semibold">
                  <dt>{t.upgradeToday}</dt>
                  <dd>{dollars(net)}</dd>
                </div>
              </dl>
              {!wallet && (
                <p className="text-muted">{t.upgradeThen(dollars(price(allPlan)), interval === "year" ? t.perYear : t.perMonth)}</p>
              )}
              <p className="text-muted">
                {t.upgradeEnds(plans.data.upgradeScopes.map(titleOf))} {plans.data.upgradeEndsRefund && t.upgradeEndsRefund}
              </p>
            </>
          )}
        </Card>
      )}
      {scope === "all" && others.length > 0 && <p className="text-sm text-muted">{t.alsoAll(others.map(titleOf))}</p>}
      <Card className="space-y-3 p-5">
        <Statement checked={terms} onChange={setTerms}>
          {t.agreeTerms}{" "}
          <Link to="/legal/$page" params={{ page: "terms" }} target="_blank" className="text-accent">
            {t.terms}
          </Link>
        </Statement>
        <Statement checked={renewal} onChange={setRenewal}>
          {wallet ? t.agreeNoRenewal : t.agreeRenewal}
        </Statement>
        <Statement checked={refund} onChange={setRefund}>
          {refundable ? t.agreeRefund : t.agreeNoRefund}
        </Statement>
        {start.isError && <ErrorNote message={errorText(start.error, locale, m.error)} />}
        <Button disabled={!ready || start.isPending} onClick={() => scope && start.mutate(scope)}>
          {t.toPayment}
        </Button>
      </Card>
    </div>
  );
}
