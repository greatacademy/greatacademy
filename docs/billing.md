# Billing

> English | [简体中文](billing.zh-CN.md)

Great Academy is paid only: a learner studies a subject while a subscription covers it. There is no free tier and no trial; instead, each account's first payment, if monthly, can be refunded in full for 30 days. Billing is phase P9 of the [roadmap](roadmap.md). It also proves that a guardian is an adult, as [Minors' Data](minors-data.md) §6 requires.

## 1. Plans and Prices

Prices are per learner, in US dollars:

| Plan | Covers | Monthly | Yearly |
| :--- | :--- | :--- | :--- |
| One subject | One subject, such as mathematics | $19 | $199 |
| All subjects | Every subject, including those added later | $49 | $499 |

- The yearly price is about 15% below twelve months.
- The bundle costs more than two subjects; it is meant for a catalog of three or more, which comes before launch. When it rises, subscribers keep the price they started with.
- A learner may hold several plans; any plan that covers a subject lets them study it.
- Changing a plan in place, and discounts for several children, come later. A learner who moves to the bundle buys it and cancels the old plan.

## 2. Who Pays

- **Only adults pay.** An adult pays for themselves, for children they add, and for teens who follow them.
- **Children.** A guardian buys a plan for a child before adding the child; the plan waits unassigned and goes to the next child they add.
- **Teens.** A teen signs up alone, as before, and cannot pay. Their account shows a code that invites a guardian ([Minors' Data](minors-data.md) §6). The guardian follows the teen with it and buys a plan for them.
- The payer manages the plan: cancels it, asks for the refund, sees receipts. The learner sees only whether they are covered.

## 3. Account and Methods

Payments go through one Stripe account, named Great Academy, in the Stripe organization of the US company. Its own name gives payers the right name on Checkout, receipts and statements, and keeps its payments apart from the company's other products.

| Method | Renewal |
| :--- | :--- |
| **Card**, including the wallets Stripe offers with cards | Automatic, at the end of each month or year, until cancelled |
| **Alipay or WeChat Pay** | None: the payment buys one month or one year, and paying again before it ends adds another |

Stripe's Checkout cannot renew Alipay or WeChat Pay, so they buy periods. Seven days before a period ends, the payer gets an email: for a card, that it will renew and how to cancel; for a wallet, that access ends unless they pay again.

Prices are sent to Checkout as amounts, not as Stripe price ids, so the table above is the only source. Sales tax is computed by Stripe Tax where the company is registered; turning it on is a deployment setting.

## 4. Signing Up

Sign-up asks who will learn ([Minors' Data](minors-data.md) §6), then the age, then the account. Then it shows the plans, with a switch between monthly and yearly and a choice between card and Alipay or WeChat Pay. Paying needs three boxes ticked, each a separate statement in our own words:

1. I am an adult and agree to the Terms of Service.
2. I authorize Great Academy to renew the plan and charge my card until I cancel, which I can do online at any time. A wallet payment shows instead that it does not renew.
3. I ask for the plan to start now and understand that I lose any legal right to withdraw once it starts; only my first payment, if monthly, can be refunded within 30 days. When the payment cannot be refunded, the statement says so instead.

The button stays off until all three are ticked. Above the plans the page says whether this account still has its refund; with yearly chosen, that yearly plans cannot be refunded and that a first month can be. A subject the learner already has, alone or in all subjects, shows as already theirs and cannot be chosen; choosing all subjects beside a subject plan says that the two are billed separately. Checkout runs on Stripe's page and returns to the plans page, which waits for the payment to arrive.

## 5. Cancelling and Refunds

- **Cancel.** A card plan stops renewing and lasts to the end of the period that was paid. A wallet plan has nothing to cancel.
- **Refund.** Each account gets one refund: the first payment it ever makes, if it buys a month (one subject or all of them, by card or wallet), is refunded in full on request within 30 days of it, from the account's settings; access ends at once. Yearly payments, renewals and every later payment are not refunded, and nothing is prorated. One refund per payer caps what a refund can cost, the fees Stripe keeps and a month of use, and leaves no way to study free by buying and refunding again.
- **Withdrawal.** The plan starts at the payer's request as soon as it is paid, and the third statement records that any legal period to withdraw ends then. The Terms keep every right that the payer's law does not allow them to give up; counsel reviews the wording per market before launch.
- **Duplicates.** The server refuses a plan for a subject the learner already has, by itself or in all subjects.
- Payment details and card changes go through Stripe's customer portal.

## 6. Access

A learner may study a subject while a plan covering it is paid until a time after now. Every request that studies checks this beside the age and consent rules of `accessOf`; a guardian viewing a child's progress needs no plan. Billing applies only once the account's secret key is set: locally, without it, everyone may study as before.

Administrators can grant a plan for a set time without payment, for testers, reviewers and the English pilot ([Admin Console](admin.md)).

## 7. Guardian Verification

The card transaction is the method [Minors' Data](minors-data.md) §6 prefers: the issuer notifies the holder of each charge. A guardian's first paid card payment approves their verification, unless the card is prepaid, which a child could hold. A wallet payment, a prepaid card or a grant does not verify; such a guardian sends the signed form, which stays the fallback. A later refund does not undo the verification, since the charge was made and notified; counsel is asked to confirm this.

## 8. Mobile Apps

The apps sell nothing and show no prices or links to pay. A learner without a plan sees that the account has no plan for the subject. The stores' rules for apps that let people use what they bought elsewhere may require in-app purchase; that is decided before the apps are released.

## 9. Data

| Table | Holds |
| :--- | :--- |
| `subscription` | One row per plan: payer, learner (empty while waiting for a child), scope (a subject id or `all`), interval, how it is paid (card, wallet or grant), Stripe subscription id, paid-until time, cancellation, refund, last reminder |
| `payment` | One row per charge: plan, how it was paid, Stripe payment intent, amount, currency, time, whether it was the plan's first, refund time |

We store no card details. Stripe's events reach one webhook, whose signatures are checked before anything is read.

## 10. Setting Up

The Worker reads four secrets (`apps/web/cloudflare.config.ts`):

| Secret | What it is |
| :--- | :--- |
| `STRIPE_SECRET_KEY` | The account's secret key. Billing is on only when it and the webhook secret are set |
| `STRIPE_WEBHOOK_SECRET` | The signing secret of the endpoint `https://greatacademy.dev/api/stripe` |
| `STRIPE_WALLET` | `on` once Alipay and WeChat Pay are turned on in the account; until then the plans page offers cards only |
| `STRIPE_TAX` | `on` turns on Stripe Tax for card plans |

The endpoint listens for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `customer.subscription.updated` and `customer.subscription.deleted`. The customer portal allows updating the card and viewing invoices; cancelling and refunds go through Settings, which keeps the 30-day rule. Turn on Alipay and WeChat Pay in the account's payment methods before setting `STRIPE_WALLET`. The Terms of Service are at `/legal/terms`. Deleting an account ends the card plans it pays for at once.
