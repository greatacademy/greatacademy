import { Code, ConnectError } from "@connectrpc/connect";
import type { BillingEvent, CheckoutRequest, Payments, PlanMeta } from "@ga/api";
import Stripe from "stripe";

/** StripeKeys are the Stripe account's secrets and settings (docs/billing.md §3, §10). */
export interface StripeKeys {
  readonly secret: string;
  readonly webhook: string;
  /** wallet says Alipay and WeChat Pay are turned on in the account. */
  readonly wallet: boolean;
  /** tax turns on Stripe Tax for card plans, once the company is registered somewhere. */
  readonly tax: boolean;
}

const client = (key: string) => new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
const crypto = Stripe.createSubtleCryptoProvider();

const metadata = (m: PlanMeta): Record<string, string> => ({ payer: m.payer, learner: m.learner, scope: m.scope, interval: m.interval });

/** planMeta reads what a plan is for back out of Stripe's metadata; anything else is not ours. */
function planMeta(md: Record<string, string> | null | undefined): PlanMeta | undefined {
  if (!md?.payer || !md.scope || (md.interval !== "month" && md.interval !== "year")) return undefined;
  return { payer: md.payer, learner: md.learner ?? "", scope: md.scope, interval: md.interval };
}

const id = (x: string | { id: string } | null | undefined): string | undefined => (typeof x === "string" ? x : x?.id);

/** stripePayments implements Payments with one Stripe account: cards renew, Alipay and WeChat Pay buy one period. */
export function stripePayments(keys: StripeKeys): Payments {
  const stripe = client(keys.secret);

  return {
    wallet: keys.wallet,

    async checkout(method, req: CheckoutRequest) {
      const md = metadata(req.meta);
      const common = {
        success_url: req.successUrl,
        cancel_url: req.cancelUrl,
        locale: req.locale === "zh" ? ("zh" as const) : ("en" as const),
        metadata: md,
        client_reference_id: req.meta.payer,
      };
      if (method === "wallet" && !keys.wallet) throw new ConnectError("Alipay and WeChat Pay are not set up", Code.FailedPrecondition);
      const product = { name: req.productName };
      const session =
        method === "card"
          ? await stripe.checkout.sessions.create({
              ...common,
              mode: "subscription",
              // Only a card renews, and its funding is what verifies a guardian (docs/billing.md §7).
              allowed_payment_method_types: ["card"],
              line_items: [
                {
                  quantity: 1,
                  price_data: {
                    currency: "usd",
                    unit_amount: req.amount,
                    product_data: product,
                    recurring: { interval: req.meta.interval },
                  },
                },
              ],
              subscription_data: { metadata: md },
              ...(req.customer ? { customer: req.customer } : { customer_email: req.email }),
              ...(keys.tax && {
                automatic_tax: { enabled: true },
                ...(req.customer && { customer_update: { address: "auto" as const } }),
              }),
            })
          : await stripe.checkout.sessions.create({
              ...common,
              mode: "payment",
              customer_email: req.email,
              allowed_payment_method_types: ["alipay", "wechat_pay"],
              payment_method_options: { wechat_pay: { client: "web" } },
              line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: req.amount, product_data: product } }],
              payment_intent_data: { metadata: md },
            });
      if (!session.url) throw new ConnectError("Stripe gave no Checkout page", Code.Unavailable);
      return { id: session.id, url: session.url };
    },

    async setRenewal(subscription, renew) {
      await stripe.subscriptions.update(subscription, { cancel_at_period_end: !renew });
    },

    async endNow(subscription) {
      await stripe.subscriptions.cancel(subscription);
    },

    async refund(paymentIntent) {
      await stripe.refunds.create({ payment_intent: paymentIntent });
    },

    async portal(customer, returnUrl) {
      return (await stripe.billingPortal.sessions.create({ customer, return_url: returnUrl })).url;
    },
  };
}

/** WebhookError is a request that did not come from Stripe. */
export class WebhookError extends Error {}

/**
 * readWebhook checks a webhook request's signature and turns the Stripe event
 * into the billing events it means, asking Stripe for what the event leaves
 * out. Events that are not about our plans become none.
 */
export async function readWebhook(keys: StripeKeys, request: Request): Promise<BillingEvent[]> {
  const signature = request.headers.get("stripe-signature");
  if (!signature) throw new WebhookError("not signed");
  const stripe = client(keys.secret);
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(await request.text(), signature, keys.webhook, undefined, crypto);
  } catch {
    throw new WebhookError("bad signature");
  }
  return events(stripe, event);
}

async function events(stripe: Stripe, event: Stripe.Event): Promise<BillingEvent[]> {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      if (session.mode === "payment") return walletPaid(session);
      if (event.type !== "checkout.session.completed") return [];
      const meta = planMeta(session.metadata);
      const subscription = id(session.subscription);
      const customer = id(session.customer);
      if (session.mode !== "subscription" || !meta || !subscription || !customer) return [];
      const sub = await stripe.subscriptions.retrieve(subscription, { expand: ["default_payment_method"] });
      const method = typeof sub.default_payment_method === "object" ? sub.default_payment_method : null;
      return [
        {
          kind: "card-checkout",
          checkout: session.id,
          meta,
          stripeSubscription: subscription,
          customer,
          paid: session.payment_status === "paid",
          // Only a card we can see is not prepaid counts as proof (docs/billing.md §7).
          prepaid: method?.card?.funding !== "credit" && method?.card?.funding !== "debit",
        },
      ];
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      const details = invoice.parent?.subscription_details;
      const meta = planMeta(details?.metadata);
      const subscription = id(details?.subscription);
      const customer = id(invoice.customer);
      if (!meta || !subscription || !customer || !invoice.id) return [];
      const payments = await stripe.invoicePayments.list({ invoice: invoice.id });
      const paid = payments.data.find((p) => p.status === "paid" && p.payment.payment_intent);
      const periodEnd = Math.max(invoice.period_end, ...invoice.lines.data.map((l) => l.period.end));
      return [
        {
          kind: "invoice-paid",
          meta,
          stripeSubscription: subscription,
          customer,
          // A free invoice has no payment intent; its own id stands in.
          paymentIntent: id(paid?.payment.payment_intent) ?? invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          periodEnd: periodEnd * 1000,
          first: invoice.billing_reason === "subscription_create",
        },
      ];
    }
    case "customer.subscription.updated": {
      const sub = event.data.object;
      return [{ kind: "renewal-changed", stripeSubscription: sub.id, renews: !sub.cancel_at_period_end && !sub.cancel_at }];
    }
    case "customer.subscription.deleted":
      return [{ kind: "subscription-ended", stripeSubscription: event.data.object.id }];
    default:
      return [];
  }
}

function walletPaid(session: Stripe.Checkout.Session): BillingEvent[] {
  const meta = planMeta(session.metadata);
  const paymentIntent = id(session.payment_intent);
  // Alipay and WeChat Pay can finish later; the session completes unpaid, then succeeds.
  if (session.payment_status !== "paid" || !meta || !paymentIntent) return [];
  return [
    {
      kind: "wallet-paid",
      checkout: session.id,
      meta,
      paymentIntent,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
    },
  ];
}
