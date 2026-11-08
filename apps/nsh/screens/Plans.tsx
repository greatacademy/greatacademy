import { Account, Interval, type Plan, type Subscription } from "@ga/proto/billing/v1/billing_pb";
import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { AppStore } from "ga/store";
import { openUrl, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { access } from "../lib/auth.ts";
import { b, billingError } from "../lib/billing-text.ts";
import { m, tx } from "../lib/i18n.ts";
import { dateOf } from "../lib/privacy-text.ts";
import { markChanged, query } from "../lib/query.ts";
import { account, billing, timeZone } from "../lib/rpc.ts";
import { canBuy, settle } from "../lib/store.ts";
import {
  Action,
  Card,
  Choice,
  colors,
  ErrorNote,
  FormPage,
  headerStyle,
  Muted,
  Quiet,
  Segmented,
  Skeleton,
  Title,
  Toggle,
} from "../lib/ui.tsx";
import { Header } from "./Header.tsx";
import { openWeb } from "./Settings.tsx";

/** MANAGE is where an Apple account's subscriptions are changed and turned off. */
const MANAGE = "https://apps.apple.com/account/subscriptions";

/** SELF and CHILD are the choices of whom a plan is for, beside the learners the payer guards. */
const SELF = "self";
const CHILD = "child";

function PlanCard(props: { plan: Plan; price?: string; per: string; chosen: boolean; owned: boolean; onPress: () => void }) {
  return (
    <View
      role="radio"
      accessibilityLabel={tx(props.plan.title)}
      accessibilityState={{ checked: props.chosen, disabled: props.owned }}
      onPress={() => !props.owned && props.onPress()}
      style={{
        backgroundColor: colors().surface,
        borderColor: props.chosen ? colors().accent : colors().line,
        borderRadius: 12,
        borderWidth: props.chosen ? 2 : 1,
        gap: 4,
        opacity: props.owned ? 0.6 : 1,
        padding: 16,
      }}
    >
      <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>{tx(props.plan.title) || props.plan.scope}</Text>
        <If when={props.owned}>
          <Text style={{ color: colors().good, fontSize: 13, fontWeight: "500" }}>{b().owned}</Text>
        </If>
      </View>
      <Muted>{props.plan.scope === "all" ? b().allSubjects : b().oneSubject}</Muted>
      <Text style={{ color: colors().ink, fontSize: 22, fontWeight: "600" }}>
        {props.price ?? "…"} <Text style={{ color: colors().muted, fontSize: 14, fontWeight: "400" }}>{props.per}</Text>
      </Text>
    </View>
  );
}

/** Current shows the payer's App Store subscription and where to manage it. */
function Current(props: { subscription: Subscription; title: string }) {
  const s = () => props.subscription;
  const when = () => dateOf(s().paidUntil);
  return (
    <Card>
      <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>{b().current}</Text>
      <Text style={{ color: colors().ink, fontSize: 15 }}>
        {props.title} · {s().interval === Interval.YEAR ? b().yearly : b().monthly} · {s().learnerName || b().waitingChild}
      </Text>
      <Muted>{s().cancelled ? b().ends(when()) : b().renews(when())}</Muted>
      <Quiet label={b().manage} onPress={() => void openUrl(MANAGE).catch(() => undefined)} />
    </Card>
  );
}

/**
 * Plans sells a plan through the App Store on iOS: one subject or all of them, monthly or yearly, for the
 * payer, a learner they guard or the next child they add, after the three statements (docs/billing.md §8).
 * An Apple account holds one subscription, which stays with its learner; the server refuses a second.
 */
export function Plans() {
  const plans = query(["plans"], ({ signal: abort }) => billing.listPlans({}, { signal: abort }));
  const subscriptions = query(["subscriptions"], ({ signal: abort }) => billing.listSubscriptions({}, { signal: abort }));
  const learners = query(["learners"], ({ signal: abort }) => account.listGuardedLearners({ timeZone: timeZone() }, { signal: abort }));
  const interval = signal<"month" | "year">("month");
  const products = query(
    () => {
      const list = plans()?.plans;
      return list && canBuy() ? list.flatMap((p) => [p.appleMonth, p.appleYear]).join(",") : undefined;
    },
    (ids) => ["apple-products", ids],
    (ids) => AppStore.products(ids.split(",")),
  );
  const who = signal(SELF);
  const scope = signal<string | undefined>(undefined);
  const terms = signal(false);
  const renewal = signal(false);
  const refund = signal(false);
  const busy = signal(false);
  const error = signal("");
  const note = signal("");

  const adult = () => access()?.band === Band.ADULT;
  const price = (plan: Plan) => {
    const id = interval() === "year" ? plan.appleYear : plan.appleMonth;
    return products()?.find((p) => p.id === id)?.price;
  };
  const owned = (s: string) => {
    if (who() !== SELF) return false;
    const covered = access()?.covered ?? [];
    return covered.includes("all") || covered.includes(s);
  };
  const titleOf = (s: string) => {
    const plan = plans()?.plans.find((p) => p.scope === s);
    return plan ? tx(plan.title) || s : s;
  };
  const apple = () =>
    subscriptions()?.subscriptions.find((s) => s.account === Account.APPLE && s.payer && !s.refunded && Number(s.paidUntil) > Date.now());
  const sorted = () => [...(plans()?.plans ?? [])].sort((a, c) => Number(a.scope === "all") - Number(c.scope === "all"));
  const whom = () => [
    { value: SELF, title: b().forSelf },
    ...(learners()?.learners ?? []).map((l) => ({ value: l.learnerId, title: l.name })),
    { value: CHILD, title: b().forChild },
  ];
  const ready = () => {
    const s = scope();
    return !!s && !owned(s) && terms() && renewal() && refund() && !busy() && !!products();
  };
  const refreshed = () => {
    markChanged();
    subscriptions.refetch();
  };

  const buy = async () => {
    const s = scope();
    if (!s) return;
    busy.set(true);
    error.set("");
    note.set("");
    try {
      const target = who();
      const start = await billing.startApplePurchase({
        scope: s,
        interval: interval() === "year" ? Interval.YEAR : Interval.MONTH,
        agreedTerms: terms(),
        agreedRenewal: renewal(),
        agreedRefund: refund(),
        ...(target === CHILD ? { forNewChild: true } : target !== SELF ? { learnerId: target } : {}),
      });
      const result = await AppStore.purchase(start.productId, start.accountToken);
      if (result.state === "purchased" && result.transaction) {
        await settle(result.transaction);
        note.set(target === CHILD ? b().doneChild : b().done);
        refreshed();
      } else if (result.state === "pending") {
        note.set(b().pending);
      } else if (result.state === "failed") {
        error.set(result.message || m().error);
      }
    } catch (e) {
      error.set(billingError(e));
    } finally {
      busy.set(false);
    }
  };

  const restore = async () => {
    busy.set(true);
    error.set("");
    note.set("");
    try {
      const restored = await AppStore.restore();
      for (const transaction of restored) await settle(transaction);
      note.set(restored.length > 0 ? b().restored(restored.length) : b().nothingRestored);
      refreshed();
    } catch (e) {
      error.set(billingError(e));
    } finally {
      busy.set(false);
    }
  };

  const body = () => {
    if (!adult()) return <Muted>{b().adultOnly}</Muted>;
    if (!canBuy()) return <Muted>{b().unavailable}</Muted>;
    return undefined;
  };

  return (
    <NavPage headerStyle={headerStyle()} title={b().plans} header={<Header title={b().plans} />}>
      <FormPage>
        <Title>{b().plans}</Title>
        <If when={plans()} else={<Skeleton rows={3} />}>
          {(data) => (
            <If when={data().required} else={<Muted>{b().free}</Muted>}>
              <If when={!body()} else={body()}>
                <Muted>{b().plansBody}</Muted>
                <If when={apple()}>{(s) => <Current subscription={s()} title={titleOf(s().scope)} />}</If>
                <Choice label={b().forWhom} items={whom()} value={who()} onChange={(v) => who.set(v ?? SELF)} />
                <Muted>{b().oneApple}</Muted>
                <Segmented
                  label={b().interval}
                  items={[
                    { value: "month", title: b().monthly },
                    { value: "year", title: b().yearly },
                  ]}
                  value={interval()}
                  onChange={(v) => interval.set(v)}
                />
                <View role="radiogroup" accessibilityLabel={b().plans} style={{ gap: 10 }}>
                  <Each of={sorted()} key={(plan) => plan.scope}>
                    {(plan) => (
                      <PlanCard
                        plan={plan()}
                        price={price(plan())}
                        per={interval() === "year" ? b().perYear : b().perMonth}
                        chosen={scope() === plan().scope}
                        owned={owned(plan().scope)}
                        onPress={() => scope.set(plan().scope)}
                      />
                    )}
                  </Each>
                </View>
                <Card>
                  <Toggle label={b().agreeTerms} checked={terms()} onChange={(v) => terms.set(v)} />
                  <Toggle label={b().agreeRenewal} checked={renewal()} onChange={(v) => renewal.set(v)} />
                  <Toggle label={b().agreeRefund} checked={refund()} onChange={(v) => refund.set(v)} />
                </Card>
                <If when={error()}>
                  <ErrorNote message={error()} />
                </If>
                <If when={note()}>
                  <Text style={{ color: colors().good, fontSize: 15 }}>{note()}</Text>
                </If>
                <Action label={b().subscribe} disabled={!ready()} onPress={() => void buy()} />
                <Quiet label={b().restore} disabled={busy()} onPress={() => void restore()} />
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
                  <Text role="link" onPress={() => void openWeb("/legal/terms")} style={{ color: colors().accent, fontSize: 14 }}>
                    {b().terms}
                  </Text>
                  <Text role="link" onPress={() => void openWeb("/legal/privacy")} style={{ color: colors().accent, fontSize: 14 }}>
                    {b().privacy}
                  </Text>
                </View>
              </If>
            </If>
          )}
        </If>
      </FormPage>
    </NavPage>
  );
}
