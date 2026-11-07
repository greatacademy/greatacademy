import { APPEARANCE_STORAGE_KEY, type Appearance, DEFAULT_APPEARANCE, parseAppearance, serializeAppearance } from "@ga/design";
import { Storage, setColorScheme, signal } from "nsh";

const LANGUAGE_KEY = "ga.language";

/** LanguageChoice is the app's language: the device's, or one the learner chose. */
export type LanguageChoice = "system" | "en" | "zh-CN";

/** languageChoice is the language the learner chose in the app. */
export const languageChoice = signal<LanguageChoice>("system");

/** appearance is how this device shows the app: the theme, the palettes and the contrast, kept on the device only. */
export const appearance = signal<Appearance>(DEFAULT_APPEARANCE);

/** restorePrefs reads the choices kept on the device, when the app starts. */
export async function restorePrefs(): Promise<void> {
  const [language, stored] = await Promise.all([Storage.getItem(LANGUAGE_KEY), Storage.getItem(APPEARANCE_STORAGE_KEY)]);
  if (language === "en" || language === "zh-CN") languageChoice.set(language);
  const restored = parseAppearance(stored);
  appearance.set(restored);
  setColorScheme(restored.theme);
}

/** chooseLanguage switches the app's language and keeps the choice. */
export function chooseLanguage(choice: LanguageChoice): void {
  languageChoice.set(choice);
  void (choice === "system" ? Storage.removeItem(LANGUAGE_KEY) : Storage.setItem(LANGUAGE_KEY, choice));
}

/** chooseAppearance shows the app in a new appearance and keeps it. */
export function chooseAppearance(next: Appearance): void {
  appearance.set(next);
  setColorScheme(next.theme);
  void Storage.setItem(APPEARANCE_STORAGE_KEY, serializeAppearance(next));
}
