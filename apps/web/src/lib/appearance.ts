import {
  APPEARANCE_STORAGE_KEY,
  type Appearance,
  appearanceAttributes,
  CUSTOM_PALETTE_CSS_KEY,
  CUSTOM_PALETTE_STYLE_ID,
  customPaletteCss,
  DEFAULT_APPEARANCE,
  parseAppearance,
  serializeAppearance,
} from "@ga/design";
import { useSyncExternalStore } from "react";

let current: Appearance | undefined;
const listeners = new Set<() => void>();

function stored(): string | null {
  try {
    return localStorage.getItem(APPEARANCE_STORAGE_KEY);
  } catch {
    return null; // Storage can be blocked; the choice then lasts as long as the page.
  }
}

function getAppearance(): Appearance {
  current ??= parseAppearance(stored());
  return current;
}

function showCustomPalettes(css: string) {
  let style = document.getElementById(CUSTOM_PALETTE_STYLE_ID);
  if (!style && css) {
    style = document.createElement("style");
    style.id = CUSTOM_PALETTE_STYLE_ID;
    document.head.appendChild(style);
  }
  if (style) style.textContent = css;
}

function show(appearance: Appearance) {
  current = appearance;
  for (const [name, value] of Object.entries(appearanceAttributes(appearance))) {
    if (value === null) document.documentElement.removeAttribute(name);
    else document.documentElement.setAttribute(name, value);
  }
  showCustomPalettes(customPaletteCss(appearance));
  for (const listener of listeners) listener();
}

function store(key: string, value: string) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // See stored().
  }
}

/** setAppearance changes settings of this browser, and shows and stores the result at once. */
export function setAppearance(change: Partial<Appearance>) {
  const next = { ...getAppearance(), ...change };
  show(next);
  store(APPEARANCE_STORAGE_KEY, serializeAppearance(next));
  store(CUSTOM_PALETTE_CSS_KEY, customPaletteCss(next));
}

/**
 * keepAppearanceCurrent shows a change made in another tab of this browser, and
 * rebuilds the stored stylesheet, which an older version of the app may have
 * written. It returns how to stop.
 */
export function keepAppearanceCurrent() {
  const appearance = getAppearance();
  showCustomPalettes(customPaletteCss(appearance));
  store(CUSTOM_PALETTE_CSS_KEY, customPaletteCss(appearance));
  const onStorage = (e: StorageEvent) => {
    if (e.key === APPEARANCE_STORAGE_KEY || e.key === null) show(parseAppearance(e.newValue));
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** useAppearance reads the settings of this browser; the server, which never knows them, renders the defaults. */
export function useAppearance(): Appearance {
  return useSyncExternalStore(subscribe, getAppearance, () => DEFAULT_APPEARANCE);
}
