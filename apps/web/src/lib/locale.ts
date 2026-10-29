import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestHeader } from "@tanstack/react-start/server";

export const LOCALES = ["en", "zh-CN"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "ga-locale";

const isLocale = (s: string | undefined): s is Locale => (LOCALES as readonly (string | undefined)[]).includes(s);

/**
 * getLocale decides the page language on the server, so the first render is
 * already in it: the cookie set by the language switch, else the browser's
 * Accept-Language.
 */
export const getLocale = createServerFn().handler((): Locale => {
  const saved = getCookie(LOCALE_COOKIE);
  if (isLocale(saved)) return saved;
  return /^zh\b/i.test(getRequestHeader("accept-language") ?? "") ? "zh-CN" : "en";
});
