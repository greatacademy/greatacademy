/** The locales every user-visible text is written in. */
export const locales = ["en", "zh-CN"] as const;

/** Locale is one of the supported locales. */
export type Locale = (typeof locales)[number];

/**
 * Text is a user-visible string in every locale. Its format is Markdown with
 * TeX between `$…$` (inline) and `$$…$$` (display), rendered by the clients.
 */
export type Text = Readonly<Record<Locale, string>>;

/** t builds a Text from its English and Chinese forms. */
export function t(en: string, zh: string): Text {
  return { en, "zh-CN": zh };
}

/** same builds a Text that reads the same in every locale, such as a formula. */
export function same(s: string): Text {
  return { en: s, "zh-CN": s };
}

/** joinText joins texts locale by locale. */
export function joinText(parts: readonly Text[], separator = "\n\n"): Text {
  return { en: parts.map((p) => p.en).join(separator), "zh-CN": parts.map((p) => p["zh-CN"]).join(separator) };
}

/** inLocale copies a value with every Text in it reading as its form in locale, for a course that teaches in that language. */
export function inLocale<T>(value: T, locale: Locale): T {
  if (Array.isArray(value)) return value.map((v) => inLocale(v, locale)) as T;
  if (typeof value !== "object" || value === null) return value;
  if (isText(value)) return Object.fromEntries(locales.map((l) => [l, (value as Text)[locale]])) as T;
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, inLocale(v, locale)])) as T;
}

/** isText tells whether value is a Text with a non-empty string in every locale. */
export function isText(value: unknown): value is Text {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return locales.every((l) => typeof record[l] === "string" && (record[l] as string).trim() !== "");
}
