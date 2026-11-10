import { and, asc, desc, eq, sql } from "drizzle-orm";

import type { Db } from "./db.ts";
import { user } from "./schema/auth.ts";
import { learner } from "./schema/learning.ts";
import {
  adminLog,
  aiProvider,
  aiRoute,
  calibration,
  guardianVerification,
  marketLaunch,
  notice,
  platformAdmin,
  type RoutePosition,
  type RouteUse,
  vendorCheck,
} from "./schema/privacy.ts";

/** isPlatformAdmin tells whether a user holds the admin role. */
export async function isPlatformAdmin(db: Db, userId: string): Promise<boolean> {
  const rows = await db.select({ id: platformAdmin.userId }).from(platformAdmin).where(eq(platformAdmin.userId, userId));
  return rows.length > 0;
}

/** platformAdmins lists who holds the role. */
export async function platformAdmins(db: Db): Promise<{ userId: string; email: string; grantedAt: Date }[]> {
  return db
    .select({ userId: platformAdmin.userId, email: user.email, grantedAt: platformAdmin.grantedAt })
    .from(platformAdmin)
    .innerJoin(user, eq(user.id, platformAdmin.userId))
    .orderBy(asc(user.email));
}

/** grantAdmin gives a user the role. */
export async function grantAdmin(db: Db, userId: string, by: string | null, at: Date): Promise<void> {
  await db.insert(platformAdmin).values({ userId, grantedBy: by, grantedAt: at }).onConflictDoNothing();
}

/** revokeAdmin takes the role away. */
export async function revokeAdmin(db: Db, userId: string): Promise<void> {
  await db.delete(platformAdmin).where(eq(platformAdmin.userId, userId));
}

/** userByEmail finds an account, with its band when it has a learner. */
export async function userByEmail(db: Db, email: string): Promise<{ id: string; band: string | null } | undefined> {
  const [row] = await db
    .select({ id: user.id, band: learner.band })
    .from(user)
    .leftJoin(learner, eq(learner.userId, user.id))
    .where(eq(sql`lower(${user.email})`, email.trim().toLowerCase()));
  return row;
}

/** logChange appends to the change log. */
export async function logChange(
  db: Db,
  entry: { actor: string; action: string; target?: string; detail?: string; at: Date },
): Promise<void> {
  await db.insert(adminLog).values(entry);
}

/** changeLog lists the newest changes, of one kind when given. */
export async function changeLog(db: Db, prefix: string, limit: number) {
  return db
    .select()
    .from(adminLog)
    .where(prefix ? sql`${adminLog.action} like ${`${prefix}%`}` : undefined)
    .orderBy(desc(adminLog.at), desc(adminLog.id))
    .limit(limit);
}

/** lastLogged returns the newest entry of an action. */
export async function lastLogged(db: Db, action: string) {
  const [row] = await db.select().from(adminLog).where(eq(adminLog.action, action)).orderBy(desc(adminLog.at)).limit(1);
  return row;
}

/** bandCounts counts learners per band, with null for those who have not answered. */
export async function bandCounts(db: Db): Promise<{ band: string | null; count: number }[]> {
  const rows = await db.select({ band: learner.band, count: sql<string>`count(*)` }).from(learner).groupBy(learner.band);
  return rows.map((r) => ({ band: r.band, count: Number(r.count) }));
}

/** waitingVerifications lists the forms awaiting a decision, oldest first, with the person's email. */
export async function waitingVerifications(db: Db) {
  return db
    .select({
      id: guardianVerification.id,
      email: user.email,
      method: guardianVerification.method,
      formType: guardianVerification.formType,
      submittedAt: guardianVerification.submittedAt,
    })
    .from(guardianVerification)
    .innerJoin(user, eq(user.id, guardianVerification.userId))
    .where(eq(guardianVerification.status, "pending"))
    .orderBy(asc(guardianVerification.submittedAt));
}

/** waitingForm locates the scan of a waiting verification. */
export async function waitingForm(db: Db, id: string): Promise<{ key: string; type: string } | undefined> {
  const [row] = await db
    .select({ key: guardianVerification.formKey, type: guardianVerification.formType })
    .from(guardianVerification)
    .where(and(eq(guardianVerification.id, id), eq(guardianVerification.status, "pending")));
  return row?.key ? { key: row.key, type: row.type ?? "application/octet-stream" } : undefined;
}

/** decideVerification settles a waiting verification and forgets its form; it returns the person's id and the key to delete, or nothing if it was not waiting. */
export async function decideVerification(db: Db, id: string, status: "approved" | "refused", by: string, reason: string, at: Date) {
  const form = await waitingForm(db, id);
  const [row] = await db
    .update(guardianVerification)
    .set({ status, decidedBy: by, decidedAt: at, reason, formKey: null, formType: null })
    .where(and(eq(guardianVerification.id, id), eq(guardianVerification.status, "pending")))
    .returning({ userId: guardianVerification.userId });
  return row && { userId: row.userId, formKey: form?.key };
}

/** marketLaunches lists the launch records. */
export async function marketLaunches(db: Db) {
  return db.select().from(marketLaunch);
}

/** marketLaunchOf reads a market's launch record. */
export async function marketLaunchOf(db: Db, country: string) {
  const [row] = await db.select().from(marketLaunch).where(eq(marketLaunch.country, country));
  return row;
}

/** setMarketLaunch writes a market's launch record. */
export async function setMarketLaunch(db: Db, row: typeof marketLaunch.$inferInsert): Promise<void> {
  await db.insert(marketLaunch).values(row).onConflictDoUpdate({ target: marketLaunch.country, set: row });
}

/** ProviderRow is a stored vendor, with its encrypted key. */
export type ProviderRow = typeof aiProvider.$inferSelect;

/** providers lists the vendors. */
export async function providers(db: Db): Promise<ProviderRow[]> {
  return db.select().from(aiProvider).orderBy(asc(aiProvider.name));
}

/** createProvider adds a vendor, disabled unless told otherwise. */
export async function createProvider(db: Db, row: typeof aiProvider.$inferInsert): Promise<string> {
  const [created] = await db.insert(aiProvider).values(row).returning({ id: aiProvider.id });
  return created!.id;
}

/** updateProvider changes a vendor; a key left out stays as it is. */
export async function updateProvider(db: Db, id: string, changes: Partial<typeof aiProvider.$inferInsert>): Promise<void> {
  await db.update(aiProvider).set(changes).where(eq(aiProvider.id, id));
}

/** deleteProvider removes a vendor with its register entries; a vendor with routes must lose them first. */
export async function deleteProvider(db: Db, id: string): Promise<void> {
  await db.delete(aiProvider).where(eq(aiProvider.id, id));
}

/** VendorCheckRow is a register entry. */
export type VendorCheckRow = typeof vendorCheck.$inferSelect;

/** vendorChecks lists the register. */
export async function vendorChecks(db: Db): Promise<VendorCheckRow[]> {
  return db.select().from(vendorCheck);
}

/** setVendorCheck writes a register entry. */
export async function setVendorCheck(db: Db, row: typeof vendorCheck.$inferInsert): Promise<void> {
  await db
    .insert(vendorCheck)
    .values(row)
    .onConflictDoUpdate({ target: [vendorCheck.providerId, vendorCheck.country], set: row });
}

/** RouteRow is a stored route. */
export type RouteRow = typeof aiRoute.$inferSelect;

/** routes lists the routes. */
export async function routes(db: Db): Promise<RouteRow[]> {
  return db.select().from(aiRoute).orderBy(asc(aiRoute.use), asc(aiRoute.target), asc(aiRoute.position));
}

/** setRoute writes a route. */
export async function setRoute(db: Db, row: typeof aiRoute.$inferInsert): Promise<void> {
  await db
    .insert(aiRoute)
    .values(row)
    .onConflictDoUpdate({ target: [aiRoute.use, aiRoute.target, aiRoute.position], set: row });
}

/** deleteRoute removes a route. */
export async function deleteRoute(db: Db, use: RouteUse, target: string, position: RoutePosition): Promise<void> {
  await db.delete(aiRoute).where(and(eq(aiRoute.use, use), eq(aiRoute.target, target), eq(aiRoute.position, position)));
}

/** recordCalibration stores a measured calibration; only tools/calibrate calls it. */
export async function recordCalibration(db: Db, row: typeof calibration.$inferInsert): Promise<void> {
  await db.insert(calibration).values(row);
}

/** calibrationPassed tells whether the newest calibration of exactly this criterion, model and prompt version passed. */
export async function calibrationPassed(
  db: Db,
  r: { criterion: string; providerId: string; model: string; promptVersion: string },
): Promise<boolean> {
  const [row] = await db
    .select({ passed: calibration.passed })
    .from(calibration)
    .where(
      and(
        eq(calibration.criterion, r.criterion),
        eq(calibration.providerId, r.providerId),
        eq(calibration.model, r.model),
        eq(calibration.promptVersion, r.promptVersion),
      ),
    )
    .orderBy(desc(calibration.at))
    .limit(1);
  return row?.passed ?? false;
}

/**
 * routeCalibrated tells whether a route has a passing calibration. Only
 * judgment is calibrated so far, against its criterion; a route of any other
 * use has none, so it stays a draft.
 */
export async function routeCalibrated(
  db: Db,
  r: { use: RouteUse; target: string; providerId: string; model: string; promptVersion: string },
): Promise<boolean> {
  return r.use === "judgment" && calibrationPassed(db, { ...r, criterion: r.target });
}

/** NoticeRow is a stored notice version. */
export type NoticeRow = typeof notice.$inferSelect;

/** notices lists the notice versions, newest first. */
export async function notices(db: Db): Promise<NoticeRow[]> {
  return db.select().from(notice).orderBy(desc(notice.publishedAt));
}

/** publishNotice adds a notice version. */
export async function publishNotice(db: Db, row: typeof notice.$inferInsert): Promise<void> {
  await db.insert(notice).values(row);
}
