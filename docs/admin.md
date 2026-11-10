# Admin Console

> English | [简体中文](admin.zh-CN.md)

The admin console is where platform administrators run what must not need a code change: which AI services are used, which markets are open to minors, and which guardians are verified. It lives at `/admin` in the web app. Its limits come from [Minors' Data](minors-data.md) and [§13.1 of the English design](english-curriculum.md#131-ai-models).

## 1. Principles

1. **Configuration chooses; it does not relax.** The server checks calibration, the vendor register and the market rules on every save and every use. No screen has a way around them.
2. **Learners' text and recordings never appear here.** The console shows counts, not what anyone wrote or said. Impersonation does not exist.
3. **Secrets go in and do not come out.** An API key can be replaced but never read back; screens show its last four characters.
4. **Everything that changes is logged,** with who, when, and what changed, excluding secrets.
5. **The least data about people.** A guardian's email and signed form appear only while the form awaits a decision, and the form is deleted once decided.

## 2. Who Gets In

A platform administrator is a row in `platform_admin`. It is separate from guardians and learners: the role grants nothing else in the product.

- **The first administrator** is granted from the command line: `pnpm nx run db:grant-admin -- <email>`. There is no sign-up route to the role.
- **Later ones** are added and removed on the Administrators page, by the email of an existing adult account. An administrator cannot remove themselves, so the role is never left empty by accident.
- **Every `AdminService` call checks the role on the server.** The pages only hide what the server would refuse. A signed-in non-administrator sees a not-found page, so the console's existence reveals nothing more than this document does.
- **Minors cannot be administrators.** Only an account in the adult band qualifies.

## 3. Pages

| Route | Page | What it does |
| :--- | :--- | :--- |
| `/admin` | Overview | What needs attention: forms waiting, register checks that are stale or close to it, routes that stopped qualifying, cost alarms of the last day, the last retention run, and learners per band as counts |
| `/admin/verifications` | Guardian verifications | The waiting signed forms, oldest first. Open a form, then approve or refuse with a reason. The form is deleted on either decision |
| `/admin/markets` | Markets | One row per market: its rules from the code, whether it is open to minors, the notice languages it needs, and which AI scopes it can offer now |
| `/admin/ai` | AI services | Providers with their budgets, and routes |
| `/admin/costs` | Costs | Each model provider's spend today and this month against its budgets, what an active learner cost this month, the alarms, the price of each model, and the learners who cost most |
| `/admin/register` | Vendor register | For each vendor and market, what was checked and when |
| `/admin/notices` | Notices | Notice versions and the vendors each one names |
| `/admin/admins` | Administrators | Who holds the role; granting a plan without payment for a number of days, for testers, reviewers and the pilot ([Billing](billing.md) §6) |
| `/admin/log` | Change log | Every change, newest first, filterable by kind |

The console follows the product's design tokens and locales, and works at phone width: a form waiting on a guardian should not need a desk.

## 4. Markets

The rules of a market (guardian age, scopes, languages) are code in `libs/api/src/markets.ts`, because changing them is a legal decision that deserves review. What the console holds is the launch switch, because opening is an operating decision.

- **Every market starts closed to minors.** Adults are not affected.
- **Opening needs a record:** who signed off, and when. The console also shows which required notice languages are missing, and refuses to open until they exist or the administrator records that counsel accepted the gap.
- **Mainland China cannot be opened here.** Its rule in the code is closed, so there is no switch. Reopening it is a [separate decision and project](minors-data.md#5-mainland-china).
- **Closing a market** stops new minors at once. Minors already studying keep their account and data, and lose access to study until it reopens, so closing is a serious act and asks for confirmation.

## 5. AI Services

**Providers.** Name, kind (`model`, `speech` or `other`), pi-ai provider or compatible API, base URL, region, API key, enabled. Keys are encrypted with AES-GCM under `AI_KEYS_SECRET`, a Worker secret that the database never sees. A base URL on `gateway.ai.cloudflare.com` sends the calls through Cloudflare AI Gateway: each call carries `cf-aig-collect-log-payload: false`, so the gateway logs its model, tokens, cost, status and duration but no request or response, and `cf-aig-metadata` names its use, criteria and prompt version, never a learner.

**Routes.** For each criterion, and for S6, a primary and a backup: provider, model and prompt version. A route has a draft or live state. A criterion is named by its key, `id@version` (such as `w4-topic-sentence@1`), so a new version of a criterion needs routes and calibrations of its own.

- **Going live needs calibration.** A route can be set live only if a passing calibration exists for that exact criterion, model and prompt version. Calibrations are written by `tools/calibrate` and are read-only here; an administrator cannot enter one. A calibration passes only if the route also resists every injection probe of `libs/judge`: texts made only of attempts to steer the judge, in English and Chinese, which it must find not to meet the criterion.
- **Changing a live route's model or prompt returns it to draft,** since changing the model changes the judge.
- **Disabling a provider** stops its routes at once.

A route that stops qualifying fails closed: judgment waits or moves to the calibrated backup, and the Overview says so.

**Prices and budgets.** Each model has a price in US dollars per million input and output tokens, entered on the Costs page, and each model provider has a daily and a monthly budget, by UTC day and month. Every call to a model, failed or not, is recorded in `ai_call` with its tokens and its cost at that price, calibration runs included, so the record is what the vendor bills.

- **No price or no budget, no learner.** A route whose model has no price, or whose provider lacks either budget, serves no learner, as if it were not calibrated.
- **A spent budget stops new texts.** When a provider has spent its daily or monthly budget, no new text is taken on its routes, and the topics they judge are hidden from learners until the next day or month. A text already taken is always judged to the end, even past the budget, so that no learner is left without a verdict. A spent budget does not make a route broken.

**Limits per learner.** A learner may hand in 30 texts for judgment in any 24 hours, rewrites included, and 5 in a minute; a judgment is tried at most 4 times. A refused text is not recorded, the learner is told when to come back, and other courses go on.

**Alarms.** Every 15 minutes a Cron Trigger checks the costs and raises an alarm when a provider passes 50%, 80% or 100% of a budget, when a model's cost per call is more than twice its mean over the last 7 days, or when more than 30% of a model's calls failed in the day, from 10 calls. Each alarm is written once to the change log and sent by email to every administrator.

## 6. Vendor Register and Notices

**The register** has one entry per vendor and market, holding the conditions of [Minors' Data §12](minors-data.md#12-vendors): serves the market, terms allow minors, no training, retention, data processing agreement, transfer mechanism, region, notes, and the date checked. An entry counts only if every condition is met and the check is under 12 months old (*starting*). It says what a person verified, and the log records who.

**Notices.** A notice version names the vendors that may receive minors' data under consents to it. Publishing a version naming a new vendor does not reach anyone until they consent again. The text of notices lives in the code, with the pages at `/legal`, so that it goes through review.

A market offers an AI scope once its rule allows AI and the current notice names a vendor of that kind with a live route and a valid entry there. Until then nobody is asked to consent to it.

A minor's data reaches a vendor only if all of these hold:

1. The learner's market is open to minors.
2. The learner has a current consent for the scope.
3. The vendor has a current register entry for that market.
4. The consent's notice version names the vendor.
5. The route is live, or is the calibrated backup.

## 7. Outside the Console

- **Reading learners' text, recordings or answers.** Any such tool must be separate, approved and audited ([Minors' Data §13](minors-data.md#13-enforcement-in-code-and-what-comes-when)).
- **Changing a learner's age band,** and any other act that widens what a minor can do.
- **Granting consent.** Only a guardian or the learner can.
- **Editing the log.** It is append-only.
- **Editing market rules.** They are code.
