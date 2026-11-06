import {
  APPEARANCE_STORAGE_KEY,
  type Appearance,
  appearanceAttributes,
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

function show(appearance: Appearance) {
  current = appearance;
  for (const [name, value] of Object.entries(appearanceAttributes(appearance))) {
    if (value === null) document.documentElement.removeAttribute(name);
    else document.documentElement.setAttribute(name, value);
  }
  for (const listener of listeners) listener();
}

/** setAppearance changes settings of this browser, and shows and stores the result at once. */
export function setAppearance(change: Partial<Appearance>) {
  const next = { ...getAppearance(), ...change };
  show(next);
  try {
    const value = serializeAppearance(next);
    if (value) localStorage.setItem(APPEARANCE_STORAGE_KEY, value);
    else localStorage.removeItem(APPEARANCE_STORAGE_KEY);
  } catch {
    // See stored().
  }
}

/** followOtherTabs shows a change made in another tab of this browser; it returns how to stop. */
export function followOtherTabs() {
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
