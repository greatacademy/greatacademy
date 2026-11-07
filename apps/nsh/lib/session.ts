import { Storage, signal } from "nsh";

const TOKEN_KEY = "ga.session";

/** token is the session's bearer token: undefined until restored from the device, null when signed out. */
export const token = signal<string | null | undefined>(undefined);

/** restoreToken reads the token kept on the device, when the app starts. */
export async function restoreToken(): Promise<void> {
  token.set(await Storage.getItem(TOKEN_KEY));
}

/** setToken keeps a new token on the device, or removes it with null. */
export function setToken(next: string | null): void {
  token.set(next);
  void (next === null ? Storage.removeItem(TOKEN_KEY) : Storage.setItem(TOKEN_KEY, next));
}
