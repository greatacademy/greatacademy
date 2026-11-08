import { AppStore, type StoreTransaction } from "ga/store";
import { platform } from "nsh";

import { markChanged } from "./query.ts";
import { billing } from "./rpc.ts";

/** canBuy says whether this device sells plans: iOS, through the App Store, with purchases allowed. */
export function canBuy(): boolean {
  return platform.os === "ios" && AppStore.available();
}

/**
 * settle sends a paid transaction to the server, which asks Apple about it and records the plan for the
 * payer its account token names, then finishes it. Unsent, it stays with StoreKit for the next try.
 */
export async function settle(transaction: StoreTransaction): Promise<boolean> {
  const { done } = await billing.confirmApplePurchase({ transactionId: transaction.confirmId });
  await AppStore.finish(transaction.id);
  markChanged();
  return done;
}

/** settleUnfinished settles what StoreKit still holds: renewals, and purchases the app did not get to send. */
export async function settleUnfinished(): Promise<void> {
  if (!canBuy()) return;
  try {
    for (const transaction of await AppStore.unfinished()) await settle(transaction);
  } catch {
    // Offline or signed out: StoreKit keeps them for the next launch.
  }
}
