/** STOP_KEY remembers in this browser when sign-up last stopped. It holds the time only, never an answer. */
export const STOP_KEY = "ga.sign-up-stopped";

/** STOP_FOR is how long, in milliseconds, a stop keeps a learner's own sign-up from being tried again: a day. */
export const STOP_FOR = 24 * 60 * 60 * 1000;

/** stopActive says whether a stop stored as `stored` still holds at `now`; a stored value that is not a time has run out. */
export function stopActive(stored: string | null, now: number): boolean {
  if (stored === null) return false;
  const at = Number(stored);
  return Number.isFinite(at) && at > 1_000_000_000_000 && now - at < STOP_FOR;
}

/** stoppedBefore says whether sign-up stopped in this browser within the last day. */
export function stoppedBefore(now: number): boolean {
  try {
    return stopActive(localStorage.getItem(STOP_KEY), now);
  } catch {
    return false;
  }
}

/** rememberStop stores the time sign-up stopped in this browser. */
export function rememberStop(now: number): void {
  try {
    localStorage.setItem(STOP_KEY, String(now));
  } catch {
    // Without storage the page still stops; only a retry escapes it.
  }
}
