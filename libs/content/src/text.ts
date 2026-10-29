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

/** isText tells whether value is a Text with a non-empty string in every locale. */
export function isText(value: unknown): value is Text {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return locales.every((l) => typeof record[l] === "string" && (record[l] as string).trim() !== "");
}
