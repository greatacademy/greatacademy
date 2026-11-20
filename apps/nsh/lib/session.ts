import { Storage, signal } from "nsh";

import { subjectChoice } from "./prefs.ts";

const TOKEN_KEY = "ga.session";

/** token is the session's bearer token: undefined until restored from the device, null when signed out. */
export const token = signal<string | null | undefined>(undefined);

/** restoreToken reads the token kept on the device, when the app starts. */
export async function restoreToken(): Promise<void> {
  token.set(await Storage.getItem(TOKEN_KEY));
}

/**
 * setToken keeps a new token on the device, or removes it with null. Signing out forgets the subject opened, so the
 * next session opens on the subject last studied.
 */
export function setToken(next: string | null): void {
  if (next === null) subjectChoice.set("");
  token.set(next);
  void (next === null ? Storage.removeItem(TOKEN_KEY) : Storage.setItem(TOKEN_KEY, next));
}
