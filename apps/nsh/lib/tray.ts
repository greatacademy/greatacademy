import { platform } from "nsh";
import { isAvailable, Tray, Window } from "nsh/desktop";

import icon from "../assets/tray.svg";
import { m } from "./i18n.ts";
import { openTab, TABS, type TabId } from "./nav.ts";

function tabTitle(id: TabId): string {
  const by: Record<TabId, string> = { today: m().tabToday, progress: m().tabProgress, courses: m().tabCourses, me: m().tabMe };
  return by[id];
}

/**
 * showTray puts the app's icon in the system tray on desktops, with a menu that opens the window or one of its tabs
 * and quits. The tabs are there while the account may study (`inTabs`). On macOS and Linux a click opens the menu, as
 * their tray icons do; on Windows a click brings the window forward and the secondary click opens the menu. Calling
 * it inside an effect keeps the menu in the app's language.
 */
export function showTray(inTabs: boolean): void {
  if (!isAvailable) return;
  const front = () => Window.get("main")?.focus();
  Tray.set({
    icon,
    tooltip: "Great Academy",
    onClick: platform.os === "windows" ? front : undefined,
    menu: [
      { label: m().trayOpen, onSelect: front },
      inTabs && { type: "separator" },
      ...TABS.map(
        (id) =>
          inTabs && {
            label: tabTitle(id),
            onSelect: () => {
              openTab(id);
              front();
            },
          },
      ),
      { type: "separator" },
      { label: m().trayQuit, role: "quit" },
    ],
  });
}
