import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import {
  addPlan,
  bandCounts,
  calibrationPassed,
  changeLog,
  createProvider,
  type Db,
  decideVerification,
  deletePrice,
  deleteProvider,
  deleteRoute,
  grantAdmin,
  isPlatformAdmin,
  lastLogged,
  learnerFor,
  learnerSpend,
  logChange,
  marketLaunches,
  nextCheck,
  notices,
  type PriceRow,
  type ProviderKind,
  type ProviderRow,
  platformAdmins,
  prices,
  providers,
  publishNotice,
  type RoutePosition,
  type RouteRow,
  revokeAdmin,
  routes,
  saveCheck,
  setMarketLaunch,
  setPrice,
  setRoute,
  setVendorCheck,
  topSpenders,
  updateProvider,
  userByEmail,
  vendorChecks,
  waitingChecks,
  waitingForm,
  waitingVerifications,
} from "@ga/db";
import { redact } from "@ga/judge";
import type { AdminService } from "@ga/proto/admin/v1/admin_pb";

import { CHECK_VALID_MS, checkValid, scopeOffered } from "./capabilities.ts";
import { CHECK_READ_ACTION, CHECK_SAVE_ACTION, driftOf, MIN_DRIFT_CHECKS } from "./checks.ts";
import { dbKey, userIdKey } from "./context.ts";
import { ALARM_ACTION, budgeted, monthStart, providerSpend } from "./costs.ts";
import { AI_SCOPES, MARKETS, marketOf, missingLanguages } from "./markets.ts";
import type { FormStore, Notify } from "./privacy.ts";
import { RETENTION_ACTION } from "./retention.ts";
import { encryptSecret } from "./secrets.ts";

/** AdminDeps are the admin service's dependencies besides the request context. */
export interface AdminDeps {
  /** now is the clock, in milliseconds since the epoch. */
  now(): number;
  readonly forms: FormStore;
  readonly notify: Notify;
  /** aiKeysSecret encrypts vendors' API keys; the database never sees it. */
  readonly aiKeysSecret: string;
}

const STALE_WARNING = 30 * 24 * 3600_000;
const logLength = 200;
const kinds: readonly ProviderKind[] = ["model", "speech", "other"];

function need(ok: unknown, message: string): asserts ok {
  if (!ok) throw new ConnectError(message, Code.InvalidArgument);
}

/**
 * routeQualifies tells whether a route could serve at all: its vendor on with
 * both budgets, its model priced, calibrated, and live unless it is the backup.
 * A spent budget does not count here: it pauses the route only until the period ends.
 */
async function routeQualifies(
  db: Db,
  r: RouteRow,
  list: readonly ProviderRow[],
  priceList: readonly PriceRow[],
): Promise<{ calibrated: boolean; priced: boolean; qualifies: boolean }> {
  const calibrated = await calibrationPassed(db, r);
  const priced = priceList.some((x) => x.providerId === r.providerId && x.model === r.model);
  const vendor = list.find((p) => p.id === r.providerId && p.enabled);
  return { calibrated, priced, qualifies: !!vendor && budgeted(vendor) && priced && calibrated && (r.live || r.position === "backup") };
}

/** COSTS_TOP is how many learners the costs page lists. */
const COSTS_TOP = 20;

/** budgetOf turns a budget from the console into a stored one: unset when absent, and never negative. */
function budgetOf(value: number | undefined): number | null {
  if (value === undefined) return null;
  need(Number.isFinite(value) && value >= 0, "a budget is a sum of US dollars, zero or more");
  return value;
}

/** adminService implements AdminService; anyone without the role gets not found. */
export function adminService(deps: AdminDeps): ServiceImpl<typeof AdminService> {
  const admin = async (ctx: HandlerContext): Promise<{ db: Db; userId: string; at: Date }> => {
    const db = ctx.values.get(dbKey);
    if (!db) throw new ConnectError("no database", Code.Internal);
    const userId = ctx.values.get(userIdKey);
    if (!userId || !(await isPlatformAdmin(db, userId))) throw new ConnectError("not found", Code.NotFound);
    return { db, userId, at: new Date(deps.now()) };
  };

  return {
    async getOverview(_req, ctx) {
      const { db, at } = await admin(ctx);
      const [waiting, checks, list, all, last, bands, priceList, alarms] = await Promise.all([
        waitingVerifications(db),
        vendorChecks(db),
        providers(db),
        routes(db),
        lastLogged(db, RETENTION_ACTION),
        bandCounts(db),
        prices(db),
        changeLog(db, ALARM_ACTION, logLength),
      ]);
      const broken: string[] = [];
      for (const r of all)
        if (r.live && !(await routeQualifies(db, r, list, priceList)).qualifies) broken.push(`${r.criterion}/${r.position}`);
      return {
        waitingForms: waiting.length,
        staleChecks: checks.filter((c) => at.getTime() - c.checkedAt.getTime() > CHECK_VALID_MS - STALE_WARNING).length,
        brokenRoutes: broken,
        lastRetentionAt: BigInt(last?.at.getTime() ?? 0),
        lastRetentionDetail: last?.detail ?? "",
        bands: bands.map((b) => ({ band: b.band ?? "", count: b.count })),
        recentAlarms: alarms.filter((a) => at.getTime() - a.at.getTime() < 24 * 3600_000).length,
      };
    },

    async listVerifications(_req, ctx) {
      const { db } = await admin(ctx);
      const rows = await waitingVerifications(db);
      return {
        verifications: rows.map((v) => ({ id: v.id, email: v.email, method: v.method, submittedAt: BigInt(v.submittedAt.getTime()) })),
      };
    },

    async getVerificationForm(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const located = await waitingForm(db, req.id);
      const form = located && (await deps.forms.get(located.key));
      if (!located || !form) throw new ConnectError("no such form", Code.NotFound);
      await logChange(db, { actor: userId, action: "verification.open", target: req.id, at });
      return { form, contentType: located.type };
    },

    async decideVerification(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      if (!req.approve) need(req.reason.trim(), "a refusal needs a reason");
      const status = req.approve ? "approved" : "refused";
      const decided = await decideVerification(db, req.id, status, userId, req.reason.trim(), at);
      if (!decided) throw new ConnectError("no such form", Code.NotFound);
      if (decided.formKey) await deps.forms.delete(decided.formKey);
      await logChange(db, { actor: userId, action: `verification.${status}`, target: req.id, at });
      const [person] = await db.query.user.findMany({ where: (u, { eq }) => eq(u.id, decided.userId), columns: { email: true } });
      if (person) await deps.notify(person.email, "verification-decided");
      return {};
    },

    async listMarkets(_req, ctx) {
      const { db, at } = await admin(ctx);
      const launches = await marketLaunches(db);
      return {
        markets: await Promise.all(
          MARKETS.map(async (m) => {
            const l = launches.find((x) => x.country === m.country);
            const offered = await Promise.all(
              AI_SCOPES.map(async (s) => ((await scopeOffered(db, m.country, s, at.getTime())) ? [s] : [])),
            );
            return {
              country: m.country,
              status: m.status,
              guardianBelow: m.guardianBelow,
              languages: [...m.languages],
              missingLanguages: missingLanguages(m),
              minorsOpen: m.status !== "closed" && (l?.minorsOpen ?? false),
              signedOffBy: l?.signedOffBy ?? "",
              signedOffOn: l?.signedOffOn ?? "",
              languageGapAccepted: l?.languageGapAccepted ?? false,
              aiScopes: offered.flat(),
            };
          }),
        ),
      };
    },

    async setMarketOpen(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const market = marketOf(req.country);
      if (!market) throw new ConnectError("no such market", Code.NotFound);
      if (market.status === "closed") throw new ConnectError("this market is closed by a rule in the code", Code.FailedPrecondition);
      if (req.open) {
        need(req.signedOffBy.trim() && /^\d{4}-\d{2}-\d{2}$/.test(req.signedOffOn), "opening needs who signed off, and when");
        if (missingLanguages(market).length > 0 && !req.languageGapAccepted)
          throw new ConnectError("required notice languages are missing", Code.FailedPrecondition);
      }
      await setMarketLaunch(db, {
        country: market.country,
        minorsOpen: req.open,
        signedOffBy: req.signedOffBy.trim(),
        signedOffOn: req.signedOffOn,
        languageGapAccepted: req.languageGapAccepted,
        updatedAt: at,
        updatedBy: userId,
      });
      await logChange(db, {
        actor: userId,
        action: req.open ? "market.open" : "market.close",
        target: market.country,
        detail: req.open
          ? `signed off by ${req.signedOffBy.trim()} on ${req.signedOffOn}${req.languageGapAccepted ? "; language gap accepted" : ""}`
          : "",
        at,
      });
      return {};
    },

    async listProviders(_req, ctx) {
      const { db } = await admin(ctx);
      return {
        providers: (await providers(db)).map((p) => ({
          id: p.id,
          name: p.name,
          kind: p.kind,
          api: p.api,
          baseUrl: p.baseUrl,
          region: p.region,
          keyHint: p.keyHint ?? "",
          enabled: p.enabled,
          ...(p.dailyBudget !== null && { dailyBudget: p.dailyBudget }),
          ...(p.monthlyBudget !== null && { monthlyBudget: p.monthlyBudget }),
        })),
      };
    },

    async saveProvider(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const p = req.provider;
      const name = p?.name.trim();
      const kind = kinds.find((k) => k === p?.kind);
      const api = p?.api.trim();
      need(p && name && kind && api, "a provider needs a name, a kind and an API");
      const base = p.baseUrl.trim();
      if (base) need(/^https:\/\//.test(base), "the base URL must use https");
      const fields = {
        name,
        kind,
        api,
        baseUrl: base,
        region: p.region.trim(),
        enabled: p.enabled,
        dailyBudget: budgetOf(p.dailyBudget),
        monthlyBudget: budgetOf(p.monthlyBudget),
        updatedAt: at,
        ...(req.apiKey && { keyCipher: await encryptSecret(deps.aiKeysSecret, req.apiKey), keyHint: req.apiKey.slice(-4) }),
      };
      const id = p.id || (await createProvider(db, { ...fields, createdAt: at }));
      if (p.id) await updateProvider(db, p.id, fields);
      await logChange(db, {
        actor: userId,
        action: p.id ? "ai.provider.update" : "ai.provider.create",
        target: name,
        detail: `kind=${kind} api=${api} enabled=${p.enabled} budgets=${p.dailyBudget ?? "-"}/${p.monthlyBudget ?? "-"}${req.apiKey ? " key replaced" : ""}`,
        at,
      });
      return { id };
    },

    async deleteProvider(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      if ((await routes(db)).some((r) => r.providerId === req.id))
        throw new ConnectError("this vendor still has routes", Code.FailedPrecondition);
      await deleteProvider(db, req.id);
      await logChange(db, { actor: userId, action: "ai.provider.delete", target: req.id, at });
      return {};
    },

    async listRoutes(_req, ctx) {
      const { db } = await admin(ctx);
      const [list, priceList] = await Promise.all([providers(db), prices(db)]);
      return {
        routes: await Promise.all(
          (await routes(db)).map(async (r) => ({
            criterion: r.criterion,
            position: r.position,
            providerId: r.providerId,
            model: r.model,
            promptVersion: r.promptVersion,
            live: r.live,
            ...(await routeQualifies(db, r, list, priceList)),
          })),
        ),
      };
    },

    async saveRoute(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const r = req.route;
      need(
        r && /^[a-z0-9-]{1,64}(@[a-z0-9.-]{1,16})?$/.test(r.criterion) && r.model.trim() && r.promptVersion.trim(),
        "a route needs a criterion (id@version), a model and a prompt version",
      );
      need(r.position === "primary" || r.position === "backup", "a route is primary or backup");
      const position: RoutePosition = r.position;
      need(
        (await providers(db)).some((p) => p.id === r.providerId),
        "no such vendor",
      );
      const fields = { criterion: r.criterion, providerId: r.providerId, model: r.model.trim(), promptVersion: r.promptVersion.trim() };
      const before = (await routes(db)).find((x) => x.criterion === r.criterion && x.position === position);
      const changed =
        before !== undefined &&
        (before.providerId !== fields.providerId || before.model !== fields.model || before.promptVersion !== fields.promptVersion);
      const live = r.live && !(before?.live && changed);
      if (live && !(await calibrationPassed(db, fields)))
        throw new ConnectError("no passing calibration for this exact route", Code.FailedPrecondition);
      await setRoute(db, { ...fields, position, live, updatedAt: at });
      await logChange(db, {
        actor: userId,
        action: "ai.route.save",
        target: `${r.criterion}/${position}`,
        detail: `model=${fields.model} prompt=${fields.promptVersion} live=${live}`,
        at,
      });
      return { live };
    },

    async deleteRoute(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      need(req.position === "primary" || req.position === "backup", "a route is primary or backup");
      await deleteRoute(db, req.criterion, req.position);
      await logChange(db, { actor: userId, action: "ai.route.delete", target: `${req.criterion}/${req.position}`, at });
      return {};
    },

    async listRegister(_req, ctx) {
      const { db, at } = await admin(ctx);
      return {
        entries: (await vendorChecks(db)).map((c) => ({
          providerId: c.providerId,
          country: c.country,
          servesMarket: c.servesMarket,
          minorsAllowed: c.minorsAllowed,
          noTraining: c.noTraining,
          shortRetention: c.shortRetention,
          processingAgreement: c.processingAgreement,
          transferMechanism: c.transferMechanism,
          region: c.region,
          notes: c.notes,
          checkedAt: BigInt(c.checkedAt.getTime()),
          valid: checkValid(c, at.getTime()),
        })),
      };
    },

    async saveRegisterEntry(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const e = req.entry;
      need(e && marketOf(e.country), "no such market");
      need(
        (await providers(db)).some((p) => p.id === e.providerId),
        "no such vendor",
      );
      await setVendorCheck(db, {
        providerId: e.providerId,
        country: e.country,
        servesMarket: e.servesMarket,
        minorsAllowed: e.minorsAllowed,
        noTraining: e.noTraining,
        shortRetention: e.shortRetention,
        processingAgreement: e.processingAgreement,
        transferMechanism: e.transferMechanism,
        region: e.region.trim(),
        notes: e.notes.trim(),
        checkedAt: at,
        checkedBy: userId,
      });
      await logChange(db, { actor: userId, action: "register.save", target: `${e.providerId}/${e.country}`, at });
      return {};
    },

    async listNotices(_req, ctx) {
      const { db } = await admin(ctx);
      return {
        notices: (await notices(db)).map((n) => ({
          version: n.version,
          vendors: [...n.vendors],
          publishedAt: BigInt(n.publishedAt.getTime()),
        })),
      };
    },

    async publishNotice(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const version = req.version.trim();
      need(/^[0-9a-zA-Z.-]{1,32}$/.test(version), "that version is not valid");
      if ((await notices(db)).some((n) => n.version === version)) throw new ConnectError("that version exists", Code.AlreadyExists);
      const list = await providers(db);
      need(
        req.vendors.every((v) => list.some((p) => p.id === v)),
        "no such vendor",
      );
      await publishNotice(db, { version, vendors: [...req.vendors], publishedAt: at, publishedBy: userId });
      await logChange(db, { actor: userId, action: "notice.publish", target: version, detail: `${req.vendors.length} vendors`, at });
      return {};
    },

    async listAdmins(_req, ctx) {
      const { db, userId } = await admin(ctx);
      return {
        admins: (await platformAdmins(db)).map((a) => ({
          userId: a.userId,
          email: a.email,
          grantedAt: BigInt(a.grantedAt.getTime()),
          me: a.userId === userId,
        })),
      };
    },

    async addAdmin(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const found = await userByEmail(db, req.email);
      if (!found) throw new ConnectError("no account with that email", Code.NotFound);
      if (found.band !== "adult")
        throw new ConnectError("only an account in the adult band can be an administrator", Code.FailedPrecondition);
      await grantAdmin(db, found.id, userId, at);
      await logChange(db, { actor: userId, action: "admin.grant", target: found.id, at });
      return {};
    },

    async grantPlan(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      need(/^[a-z0-9-]+$/.test(req.scope), "name a subject id or all");
      need(Number.isInteger(req.days) && req.days >= 1 && req.days <= 366, "give between 1 and 366 days");
      const found = await userByEmail(db, req.email);
      if (!found) throw new ConnectError("no account with that email", Code.NotFound);
      const learnerId = await learnerFor(db, found.id);
      await addPlan(db, {
        payerId: found.id,
        learnerId,
        scope: req.scope,
        interval: "month",
        account: "grant",
        paidUntil: new Date(at.getTime() + req.days * 86_400_000),
        at,
      });
      await logChange(db, { actor: userId, action: "plan.grant", target: found.id, detail: `${req.scope} ${req.days}d`, at });
      return {};
    },

    async removeAdmin(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      if (req.userId === userId) throw new ConnectError("you cannot remove yourself", Code.FailedPrecondition);
      await revokeAdmin(db, req.userId);
      await logChange(db, { actor: userId, action: "admin.revoke", target: req.userId, at });
      return {};
    },

    async listLog(req, ctx) {
      const { db } = await admin(ctx);
      const rows = await changeLog(db, req.kind, logLength);
      return {
        entries: rows.map((e) => ({ actor: e.actor, action: e.action, target: e.target, detail: e.detail, at: BigInt(e.at.getTime()) })),
      };
    },

    async listPrices(_req, ctx) {
      const { db } = await admin(ctx);
      return {
        prices: (await prices(db)).map((p) => ({
          providerId: p.providerId,
          model: p.model,
          inputPerMillion: p.inputPerMillion,
          outputPerMillion: p.outputPerMillion,
        })),
      };
    },

    async savePrice(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const p = req.price;
      const model = p?.model.trim();
      need(p && model, "a price needs a vendor and a model");
      need(
        [p.inputPerMillion, p.outputPerMillion].every((n) => Number.isFinite(n) && n >= 0),
        "a price is US dollars per million tokens, zero or more",
      );
      const vendor = (await providers(db)).find((x) => x.id === p.providerId);
      need(vendor, "no such vendor");
      await setPrice(db, {
        providerId: p.providerId,
        model,
        inputPerMillion: p.inputPerMillion,
        outputPerMillion: p.outputPerMillion,
        updatedAt: at,
      });
      await logChange(db, {
        actor: userId,
        action: "ai.price.save",
        target: `${vendor.name}/${model}`,
        detail: `input=${p.inputPerMillion} output=${p.outputPerMillion}`,
        at,
      });
      return {};
    },

    async deletePrice(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      await deletePrice(db, req.providerId, req.model);
      await logChange(db, { actor: userId, action: "ai.price.delete", target: `${req.providerId}/${req.model}`, at });
      return {};
    },

    async getCosts(_req, ctx) {
      const { db, at } = await admin(ctx);
      const since = new Date(monthStart(at.getTime()));
      const [list, spend, month, top, alarms] = await Promise.all([
        providers(db),
        providerSpend(db, at.getTime()),
        learnerSpend(db, since),
        topSpenders(db, since, COSTS_TOP),
        changeLog(db, ALARM_ACTION, logLength),
      ]);
      return {
        providers: list
          .filter((p) => p.kind === "model")
          .map((p) => ({
            providerId: p.id,
            day: spend.get(p.id)?.day ?? 0,
            month: spend.get(p.id)?.month ?? 0,
            ...(p.dailyBudget !== null && { dailyBudget: p.dailyBudget }),
            ...(p.monthlyBudget !== null && { monthlyBudget: p.monthlyBudget }),
          })),
        monthLearners: month.learners,
        monthCost: month.cost,
        topLearners: top.map((l) => ({ email: l.email, calls: l.calls, cost: l.cost })),
        alarms: alarms.map((a) => ({ at: BigInt(a.at.getTime()), target: a.target, detail: a.detail })),
      };
    },

    async getCheck(_req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const [next, waiting] = await Promise.all([nextCheck(db), waitingChecks(db)]);
      if (!next) return { waiting };
      // Reading a learner's text is staff access, so it is logged, by the sample's id and never with the text.
      await logChange(db, { actor: userId, action: CHECK_READ_ACTION, target: next.check.id, detail: next.check.criterion, at });
      return {
        waiting,
        check: {
          id: next.check.id,
          task: next.check.task.prompt,
          source: next.check.task.source ?? "",
          question: next.check.question,
          text: redact(next.text),
        },
      };
    },

    async saveCheck(req, ctx) {
      const { db, userId, at } = await admin(ctx);
      const row = await saveCheck(db, req.id, req.met, userId, at);
      if (!row) throw new ConnectError("that sample was already checked or is gone", Code.FailedPrecondition);
      await logChange(db, {
        actor: userId,
        action: CHECK_SAVE_ACTION,
        target: row.id,
        detail: `${row.criterion} route=${row.met} person=${req.met}`,
        at,
      });
      return { routeMet: row.met };
    },

    async listDrift(_req, ctx) {
      const { db, at } = await admin(ctx);
      const [drift, waiting] = await Promise.all([driftOf(db, at.getTime()), waitingChecks(db)]);
      return {
        waiting,
        minChecks: MIN_DRIFT_CHECKS,
        routes: drift.map((d) => ({
          criterion: d.criterion,
          providerId: d.providerId,
          model: d.model,
          promptVersion: d.promptVersion,
          checks: d.checks,
          agreement: d.agreement,
          kappa: d.kappa,
          ...(d.calibrationKappa !== undefined && { calibrationKappa: d.calibrationKappa }),
          drifting: d.drifting,
        })),
      };
    },
  };
}
