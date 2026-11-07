import { platform } from "nsh";
import type { MenuItem } from "nsh/desktop";
import * as desktop from "nsh/desktop";

import icon from "../assets/tray.svg";
import { m } from "./i18n.ts";
import { openTab, TABS, type TabId } from "./nav.ts";

interface TrayOptions {
  icon?: typeof icon;
  tooltip?: string;
  menu?: readonly (MenuItem | null | undefined | false)[];
  onClick?: () => void;
}

interface TrayModule {
  set(options: TrayOptions | null): void;
}

// Native Shell added the tray after 0.4.0, so it is looked up rather than imported: the app runs without it until then.
const tray = (desktop as unknown as { Tray?: TrayModule }).Tray;

/** hasTray says whether this Native Shell shows an icon in the system tray. */
export const hasTray = !!tray && desktop.isAvailable;

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
  if (!tray || !desktop.isAvailable) return;
  const front = () => desktop.Window.orderFront();
  tray.set({
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
