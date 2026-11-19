import {
  clearInactiveNotices,
  clearOldConversationLines,
  clearOldHeard,
  clearOldResponses,
  clearOldSessionTraces,
  contactsOf,
  type Db,
  deleteUserData,
  expiringConsents,
  inactiveMinors,
  lapsedConsents,
  logChange,
  markConsentReminded,
  markInactiveNotice,
  noticedBefore,
} from "@ga/db";
import { DAY } from "@ga/engine";

import { clearScope, type FormStore, type Notify } from "./privacy.ts";

/** RETENTION holds the periods of docs/minors-data.md §10; the ones marked there as starting values are ours, not the law's. */
export const RETENTION = {
  childResponses: 90 * DAY,
  teenResponses: 365 * DAY,
  sessionTraces: 30 * DAY,
  conversationLines: 30 * DAY,
  /** heard is how long the words heard in a recording are kept; the recording is never kept. */
  heard: 30 * DAY,
  consentReminder: 30 * DAY,
  inactive: 365 * DAY,
  inactiveNotice: 30 * DAY,
  /** lapseWindow is how far back a run looks for consents that ran out, so that runs missed for a while still clear them. */
  lapseWindow: 30 * DAY,
} as const;

/** RETENTION_ACTION is the action a retention run logs, which the admin overview reads. */
export const RETENTION_ACTION = "retention.run";

/** RetentionResult counts what a run did; it holds nothing about any person. */
export interface RetentionResult {
  readonly responses: number;
  readonly traces: number;
  readonly transcripts: number;
  /** heard counts the spoken answers whose heard words were emptied. */
  readonly heard: number;
  readonly reminders: number;
  /** lapsed counts the scopes whose consent ran out unrenewed and whose data was cleared. */
  readonly lapsed: number;
  readonly notices: number;
  readonly deleted: number;
}

/** runRetention applies the retention rules at a time; running it twice in a day changes nothing further. */
export async function runRetention(db: Db, at: number, deps: { forms: FormStore; notify: Notify }): Promise<RetentionResult> {
  const date = new Date(at);
  const child = await clearOldResponses(db, "child", new Date(at - RETENTION.childResponses));
  const teen = await clearOldResponses(db, "teen", new Date(at - RETENTION.teenResponses));
  const traces = await clearOldSessionTraces(db, new Date(at - RETENTION.sessionTraces));
  const transcripts = await clearOldConversationLines(db, new Date(at - RETENTION.conversationLines));
  const heard = await clearOldHeard(db, new Date(at - RETENTION.heard));

  const expiring = await expiringConsents(db, date, new Date(at + RETENTION.consentReminder));
  for (const c of expiring) {
    await Promise.all((await contactsOf(db, c.learnerId)).map((to) => deps.notify(to, "consent-expiring")));
    await markConsentReminded(db, c.id, date);
  }

  const lapsed = await lapsedConsents(db, new Date(at - RETENTION.lapseWindow), date);
  for (const l of lapsed) await clearScope(db, l.learnerId, l.scope);

  await clearInactiveNotices(db);
  const due = await noticedBefore(db, new Date(at - RETENTION.inactiveNotice));
  for (const userId of due) {
    const keys = await deleteUserData(db, userId);
    await Promise.all(keys.map((k) => deps.forms.delete(k)));
  }
  const inactive = await inactiveMinors(db, new Date(at - RETENTION.inactive));
  for (const learnerId of inactive) {
    await Promise.all((await contactsOf(db, learnerId)).map((to) => deps.notify(to, "account-inactive")));
    await markInactiveNotice(db, learnerId, date);
  }

  const result = {
    responses: child + teen,
    traces,
    transcripts,
    heard,
    reminders: expiring.length,
    lapsed: lapsed.length,
    notices: inactive.length,
    deleted: due.length,
  };
  await logChange(db, { actor: "system", action: RETENTION_ACTION, detail: JSON.stringify(result), at: date });
  return result;
}
