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
- In the iOS app the same plans are App Store subscriptions at about 15% more, since Apple keeps a share: one subject $22.99 a month or $229.99 a year, all subjects $57.99 or $579.99 (§8).
- The bundle costs more than two subjects; it is meant for a catalog of three or more, which comes before launch. When it rises, subscribers keep the price they started with.
- A learner may hold several plans; any plan that covers a subject lets them study it.
- A learner with subject plans moves to the bundle by upgrading (§5). Moving down, and discounts for several children, come later.

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
| **App Store**, in the iOS app | Automatic, by Apple, until turned off in the Apple account's subscriptions |

Stripe's Checkout cannot renew Alipay or WeChat Pay, so they buy periods. Seven days before a period ends, the payer gets an email: for a card, that it will renew and how to cancel; for a wallet, that access ends unless they pay again.

Apple charges and renews App Store plans and sends its own reminders; Stripe has no part in them.

Prices are sent to Checkout as amounts, not as Stripe price ids, so the table above is the only source. Sales tax is computed by Stripe Tax where the company is registered; turning it on is a deployment setting.

## 4. Signing Up

Sign-up asks who will learn ([Minors' Data](minors-data.md) §6), then the age, then the account. Then it shows the plans, with a switch between monthly and yearly and a choice between card and Alipay or WeChat Pay. Paying needs three boxes ticked, each a separate statement in our own words:

1. I am an adult and agree to the Terms of Service.
2. I authorize Great Academy to renew the plan and charge my card until I cancel, which I can do online at any time. A wallet payment shows instead that it does not renew.
3. I ask for the plan to start now and understand that I lose any legal right to withdraw once it starts; only my first payment, if monthly, can be refunded within 30 days. When the payment cannot be refunded, the statement says so instead.

The button stays off until all three are ticked. Above the plans the page says whether this account still has its refund; with yearly chosen, that yearly plans cannot be refunded and that a first month can be. A subject the learner already has, alone or in all subjects, shows as already theirs and cannot be chosen; choosing all subjects beside subject plans the payer pays for shows the upgrade: the price, the credit for their unused time, what is paid today, and that they end (§5). Settings offers the upgrade on each running subject plan. Checkout runs on Stripe's page and returns to the plans page, which waits for the payment to arrive.

## 5. Cancelling and Refunds

- **Cancel.** A card plan stops renewing and lasts to the end of the period that was paid. A wallet plan has nothing to cancel.
- **Refund.** Each account gets one refund: the first payment it ever makes, if it buys a month (one subject or all of them, by card or wallet), is refunded in full on request within 30 days of it, from the account's settings; access ends at once. Yearly payments, renewals and every later payment are not refunded, and nothing is prorated. One refund per payer caps what a refund can cost, the fees Stripe keeps and a month of use, and leaves no way to study free by buying and refunding again.
- **Upgrade.** Buying all subjects for a learner with running subject plans the same payer pays for (not grants, not refunded) is an upgrade. Each such plan is worth the price of its last period times the share of that period still to come; the sum comes off the first payment, as a one-off Stripe coupon on a card subscription or straight off the amount of a wallet payment, and renewals cost the full price. When the payment arrives the old plans end: card subscriptions are cancelled at Stripe without proration, wallet plans end at once. An ended plan can no longer be refunded, so the preview says when an upgrade gives up the account's refund. When the credit leaves less than Stripe's least charge of $0.50, as with a yearly subject plan moving to a monthly bundle, the server refuses and the page asks for yearly. The credit is the only value given for the old plans.
- **App Store.** Apple cancels and refunds App Store plans; Settings shows them as managed through the Apple account, and the one refund per account above does not apply to them. Buying all subjects in the app for a learner with subject plans the same payer pays on the web ends those plans and refunds their unused value, as an upgrade's credit, to the card or wallet that paid. A purchase on the web never ends an App Store plan, and an App Store subject plan moves to all subjects only in the App Store, where Apple prorates.
- **Withdrawal.** The plan starts at the payer's request as soon as it is paid, and the third statement records that any legal period to withdraw ends then. The Terms keep every right that the payer's law does not allow them to give up; counsel reviews the wording per market before launch.
- **Duplicates.** The server refuses a plan for a subject the learner already has, by itself or in all subjects.
- Payment details and card changes go through Stripe's customer portal.

## 6. Access

A learner may study a subject while a plan covering it is paid until a time after now. Every request that studies checks this beside the age and consent rules of `accessOf`; a guardian viewing a child's progress needs no plan. Billing applies only once the account's secret key is set: locally, without it, everyone may study as before.

Administrators can grant a plan for a set time without payment, for testers, reviewers and the English pilot ([Admin Console](admin.md)).

## 7. Guardian Verification

The card transaction is the method [Minors' Data](minors-data.md) §6 prefers: the issuer notifies the holder of each charge. A guardian's first paid card payment approves their verification, unless the card is prepaid, which a child could hold. A wallet payment, a prepaid card or a grant does not verify; such a guardian sends the signed form, which stays the fallback. A later refund does not undo the verification, since the charge was made and notified; counsel is asked to confirm this.

## 8. Mobile Apps

The iOS app sells plans as auto-renewing App Store subscriptions, as the App Store asks of apps that sell digital services. The Android app sells nothing and shows no prices or links to pay, which Google Play allows for apps where people use what they bought elsewhere. A learner without a plan sees that the account has no plan for the subject; on iOS the notice opens the plans page.

- **Products.** One subscription group, Great Academy: all subjects at level 1, each subject at level 2, so moving from a subject to all subjects is an upgrade Apple prorates. Product ids are `ga.<scope>.<interval>`: `ga.all.month`, `ga.math.year` and so on, for the app `dev.greatacademy.app`.
- **The plans page** (Me, then Plans; adults only) asks whom the plan is for, the payer, a learner they guard or the next child they add, and monthly or yearly, and shows the App Store's prices. It asks for three statements: the Terms of Service; that the plan renews until it is cancelled in the Apple account; that refunds are asked of Apple. It offers Restore Purchases, links to the Terms and the privacy notice, and the App Store's page for managing subscriptions.
- **One subscription per Apple account.** An Apple account holds one subscription here. It stays with the learner it was first bought for, through renewals and upgrades; the server refuses a second for another learner, and an App Store subject plan can only move to all subjects.
- **Buying.** `StartApplePurchase` checks the payer, the learner, duplicates and the rule above, records whom the purchase is for, and returns the product id and the payer's account token, a UUID kept per payer. The app buys with StoreKit, passing the token, which Apple reports as the transaction's `appAccountToken`; it sends the transaction id to `ConfirmApplePurchase`, then finishes the transaction. Transactions left unfinished, such as renewals, are sent when the app starts or comes back.
- **Trust.** The server takes only transaction ids from the app and from App Store Server Notifications, which arrive at `/api/apple`. It asks the App Store Server API for each, production first and then the sandbox, with a token signed by the in-app purchase key, and records what Apple answers if the bundle and the account token match: the plan for the transaction's product, its payment, the expiry or grace period, a renewal turned off, an upgrade that ends the earlier product's plan, and a refund.
- StoreKit is called from the app's Rust crate, `apps/nsh/native/store` ([Development](development.md) §6).

## 9. Data

| Table | Holds |
| :--- | :--- |
| `subscription` | One row per plan: payer, learner (empty while waiting for a child), scope (a subject id or `all`), interval, how it is paid (card, wallet, App Store or grant), Stripe subscription id, or the App Store's original transaction and product, paid-until time, cancellation, refund, last reminder |
| `payment` | One row per charge: plan, how it was paid, Stripe payment intent or App Store transaction id, amount, currency, time, whether it was the plan's first, refund time |
| `apple_account` | One row per payer who started an App Store purchase: their account token, and the learner their last purchase was for |

We store no card details. Stripe's events reach one webhook, whose signatures are checked before anything is read.

## 10. Setting Up

The Worker reads these secrets (`apps/web/cloudflare.config.ts`):

| Secret | What it is |
| :--- | :--- |
| `STRIPE_SECRET_KEY` | The account's secret key. Billing is on only when it and the webhook secret are set |
| `STRIPE_WEBHOOK_SECRET` | The signing secret of the endpoint `https://greatacademy.dev/api/stripe` |
| `STRIPE_WALLET` | `on` once Alipay and WeChat Pay are turned on in the account; until then the plans page offers cards only |
| `STRIPE_TAX` | `on` turns on Stripe Tax for card plans |
| `APPLE_IAP_KEY_ID` | The id of the App Store Connect in-app purchase key. The app sells only once the three Apple secrets are set |
| `APPLE_IAP_ISSUER_ID` | The issuer id shown with the key |
| `APPLE_IAP_KEY` | The key's `.p8` file, as text |

The endpoint listens for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `customer.subscription.updated` and `customer.subscription.deleted`. The customer portal allows updating the card and viewing invoices; cancelling and refunds go through Settings, which keeps the 30-day rule. Turn on Alipay and WeChat Pay in the account's payment methods before setting `STRIPE_WALLET`. The Terms of Service are at `/legal/terms`. Deleting an account ends the card plans it pays for at once.

In App Store Connect: sign the Paid Applications agreement with banking and tax; make the app record for `dev.greatacademy.app`; make the subscription group and its six products at the prices of §1; make the in-app purchase key; and set the App Store Server Notifications V2 URL, for production and the sandbox, to `https://greatacademy.dev/api/apple`. Sandbox testers buy on a device signed in to a sandbox account.
