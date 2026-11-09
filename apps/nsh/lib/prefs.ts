import { APPEARANCE_STORAGE_KEY, type Appearance, DEFAULT_APPEARANCE, parseAppearance, serializeAppearance } from "@ga/design";
import { Storage, setColorScheme, signal } from "nsh";

const LANGUAGE_KEY = "ga.language";
const SIDEBAR_KEY = "ga.sidebar";
const SUBJECT_KEY = "ga.subject";

/** LanguageChoice is the app's language: the device's, or one the learner chose. */
export type LanguageChoice = "system" | "en" | "zh-CN";

/** languageChoice is the language the learner chose in the app. */
export const languageChoice = signal<LanguageChoice>("system");

/** appearance is how this device shows the app: the theme, the palettes and the contrast, kept on the device only. */
export const appearance = signal<Appearance>(DEFAULT_APPEARANCE);

/** sidebarCollapsed tells whether a desktop's sidebar shows only its icons, as the learner left it on this device. */
export const sidebarCollapsed = signal(false);

/** subjectChoice is the subject last opened on this device, which the tabs show; empty until one is opened. */
export const subjectChoice = signal("");

/** restorePrefs reads the choices kept on the device, when the app starts. */
export async function restorePrefs(): Promise<void> {
  const [language, stored, sidebar, subject] = await Promise.all([
    Storage.getItem(LANGUAGE_KEY),
    Storage.getItem(APPEARANCE_STORAGE_KEY),
    Storage.getItem(SIDEBAR_KEY),
    Storage.getItem(SUBJECT_KEY),
  ]);
  if (subject && !subjectChoice()) subjectChoice.set(subject);
  if (language === "en" || language === "zh-CN") languageChoice.set(language);
  sidebarCollapsed.set(sidebar === "collapsed");
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

/** collapseSidebar shows a desktop's sidebar with only its icons, or in full again, and keeps the choice. */
export function collapseSidebar(collapsed: boolean): void {
  sidebarCollapsed.set(collapsed);
  void (collapsed ? Storage.setItem(SIDEBAR_KEY, "collapsed") : Storage.removeItem(SIDEBAR_KEY));
}

/** chooseSubject shows a subject in the tabs and keeps it for the next start. */
export function chooseSubject(id: string): void {
  subjectChoice.set(id);
  void Storage.setItem(SUBJECT_KEY, id);
}
