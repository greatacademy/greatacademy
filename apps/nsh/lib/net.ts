import { Code, ConnectError } from "@connectrpc/connect";
import { effect, lifecycle, signal, untracked } from "nsh";

/** OfflineError is a request that never reached the server: no network, or the server could not be reached. */
export class OfflineError extends Error {
  constructor(cause: unknown) {
    super("offline", { cause });
  }
}

/** online is false from a request that could not reach the server until one that does. */
export const online = signal(true);

/** netFetch is `fetch` that keeps `online` current and marks requests that never reached the server. */
export async function netFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(input, init);
    online.set(true);
    return response;
  } catch (error) {
    if (init?.signal?.aborted) throw error;
    online.set(false);
    throw new OfflineError(error);
  }
}

/** Failure is what kind of trouble a call ran into, which decides what the learner is offered. */
export type Failure = "offline" | "auth" | "plan" | "server";

function causes(error: unknown): unknown[] {
  const found: unknown[] = [];
  for (let at: unknown = error; at && found.length < 8; at = (at as { cause?: unknown }).cause) found.push(at);
  return found;
}

/** failureOf sorts an error: no connection, a session the server no longer accepts, no plan covering the subject, or anything else the server said. */
export function failureOf(error: unknown): Failure {
  if (causes(error).some((cause) => cause instanceof OfflineError)) return "offline";
  if (error instanceof ConnectError && error.code === Code.Unauthenticated) return "auth";
  // The app sells nothing and links to no purchase (docs/billing.md §8); it only says so.
  if (error instanceof ConnectError && error.code === Code.PermissionDenied && error.rawMessage.startsWith("no plan covers")) return "plan";
  return "server";
}

/** comeBack counts the times the app came back to the foreground, so pages can read again what may have changed meanwhile. */
export const comeBack = signal(0);

/** watchForeground keeps `comeBack` counting. */
export function watchForeground(): void {
  let away = false;
  effect(() => {
    const state = lifecycle();
    if (state === "background") away = true;
    else if (state === "active" && away) {
      away = false;
      comeBack.set(untracked(() => comeBack()) + 1);
    }
  });
}
