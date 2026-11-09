import { effect, Image, type JSX, keymap, platform, reduceMotion, safeAreaInsets, signal, Text, untracked, View, windowSize } from "nsh";
import { NavPage } from "nsh/base";
import { TabBar } from "nsh/mobile";

import logo from "../assets/logo.svg";
import panel from "../assets/sidebar.svg";
import courses from "../assets/tabs/courses.svg";
import learn from "../assets/tabs/learn.svg";
import me from "../assets/tabs/me.svg";
import progress from "../assets/tabs/progress.svg";
import gear from "../assets/tabs/settings.svg";
import { sessionUser } from "../lib/auth.ts";
import { m } from "../lib/i18n.ts";
import { nav, openTab, TABS, type TabId, tab } from "../lib/nav.ts";
import { collapseSidebar, sidebarCollapsed } from "../lib/prefs.ts";
import { barStyle, colors, glass, headerStyle, isDark, TopBar } from "../lib/ui.tsx";
import { CourseList } from "./Courses.tsx";
import { LearnTab } from "./LearnTab.tsx";
import { Progress } from "./Progress.tsx";
import { Me } from "./Settings.tsx";

/** tabTitle is a tab's name in the app's language; on a desktop the Me tab is the settings, opened from the sidebar's foot. */
export function tabTitle(id: TabId): string {
  const titles = {
    learn: m().tabLearn,
    progress: m().tabProgress,
    courses: m().tabCourses,
    me: platform.desktop ? m().settingsTab : m().tabMe,
  };
  return titles[id];
}

const icons: Record<TabId, { ios: string; android: string }> = {
  learn: { ios: "graduationcap", android: "android:ic_menu_edit" },
  progress: { ios: "chart.bar", android: "android:ic_menu_sort_by_size" },
  courses: { ios: "books.vertical", android: "android:ic_menu_agenda" },
  me: { ios: "person.crop.circle", android: "android:ic_menu_myplaces" },
};

/** Home is the signed-in app's first page: the tab chosen in the tab bar or the sidebar. */
export function Home() {
  const shown = (id: TabId) => () => tab() === id && nav.routes().at(-1)?.name === "home";
  return (
    <NavPage
      headerStyle={headerStyle()}
      title={tabTitle(tab())}
      // A desktop's sidebar already names the tab, so the page has no header repeating it.
      headerVisible={false}
      statusBar={{ foreground: isDark() ? "light" : "dark" }}
    >
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <If when={tab() === "learn"}>
          <LearnTab visible={shown("learn")} />
        </If>
        <If when={tab() === "progress"}>
          <Progress visible={shown("progress")} />
        </If>
        <If when={tab() === "courses"}>
          <CourseList visible={shown("courses")} />
        </If>
        <If when={tab() === "me"}>
          <Me />
        </If>
        {/* The phones draw their own head, which the pages scroll under. */}
        <If when={!platform.desktop}>
          <TopBar title={tabTitle(tab())} />
        </If>
      </View>
    </NavPage>
  );
}

/** drawn are the icons of the tab bar the app draws itself. */
const drawn: Record<TabId, typeof learn> = { learn, progress, courses, me };

/**
 * PhoneTabs is the tab bar of a phone: on iOS the system's (Liquid Glass from iOS 26); on Android a pill of glass the
 * app draws, floating over the page, which Material's bar cannot be.
 */
export function PhoneTabs() {
  return (
    <View style={barStyle()}>
      {platform.os === "android" ? (
        <GlassTabs />
      ) : (
        <TabBar
          items={TABS.map((id) => ({ title: tabTitle(id), icon: platform.select(icons[id]) ?? null }))}
          selectedIndex={TABS.indexOf(tab())}
          onChange={({ index }) => {
            const id = TABS[index];
            if (id) openTab(id);
          }}
        />
      )}
    </View>
  );
}

/** GlassTabs is the tabs in a pill of glass over the bottom of the page, the chosen one on a lens of the accent. */
function GlassTabs() {
  const insets = safeAreaInsets();
  return (
    <View style={{ paddingBottom: insets().bottom + 8, paddingHorizontal: 16 }}>
      <View
        role="tablist"
        style={{
          ...glass(),
          borderColor: `${colors().line.slice(0, 7)}99`,
          borderRadius: 32,
          borderWidth: 1,
          // No shadow: Android draws it as an elevation's, which shows through the glass and hides the page under it.
          flexDirection: "row",
          height: 64,
          padding: 4,
        }}
      >
        <Each of={[...TABS]}>
          {(id) => {
            const chosen = () => tab() === id();
            return (
              <View
                role="tab"
                accessibilityLabel={tabTitle(id())}
                accessibilityState={{ selected: chosen() }}
                android={{ ripple: { borderless: false, color: `${colors().accent.slice(0, 7)}33` } }}
                onPress={() => openTab(id())}
                style={{
                  alignItems: "center",
                  backgroundColor: chosen() ? `${colors()["accent-soft"].slice(0, 7)}cc` : "transparent",
                  borderRadius: 28,
                  flex: 1,
                  gap: 2,
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Image src={drawn[id()]} style={{ height: 24, tintColor: chosen() ? colors().accent : colors().muted, width: 24 }} />
                <Text style={{ color: chosen() ? colors().accent : colors().muted, fontSize: 11, fontWeight: chosen() ? "600" : "500" }}>
                  {tabTitle(id())}
                </Text>
              </View>
            );
          }}
        </Each>
      </View>
    </View>
  );
}

/** SIDEBAR are the tabs in a desktop's sidebar; the settings (the Me tab) open from its foot instead. */
const SIDEBAR: readonly TabId[] = TABS.filter((id) => id !== "me");

/**
 * commandHeld tells whether the platform's command key (⌘ on macOS, Ctrl elsewhere) is held while the mouse is over
 * the window: the sidebar then shows every tab's key. The window hears it from the mouse's events, which carry the
 * modifiers and come when one changes, so it is false while the mouse is elsewhere.
 */
export const commandHeld = signal(false);

/** heldCommand reads whether the platform's command key is down from a mouse event's modifiers. */
export function heldCommand(modifiers: { platform: boolean; control: boolean }): boolean {
  return platform.os === "macos" ? modifiers.platform : modifiers.control;
}

/** Hint is a tab's key in the sidebar: in full (⌘1) while the mouse is over the tab, the key alone (1) while ⌘ is held. */
function Hint(props: { index: number; hovered: boolean }) {
  const key = String(props.index + 1);
  return (
    <If when={commandHeld() || props.hovered}>
      <Text style={{ color: colors().muted, fontSize: 12 }}>{commandHeld() ? key : keymap.label(`mod+${key}`)}</Text>
    </If>
  );
}

/** SidebarButton is a small square button in the sidebar with an icon: the collapse and settings buttons. */
function SidebarButton(props: { icon: typeof logo; label: string; tooltip?: string; chosen?: boolean; onPress: () => void }) {
  return (
    <View
      role="button"
      accessibilityLabel={props.label}
      accessibilityState={props.chosen === undefined ? undefined : { selected: props.chosen }}
      tooltip={props.tooltip ?? props.label}
      onPress={props.onPress}
      hoverStyle={{ backgroundColor: props.chosen ? colors()["accent-soft"] : colors().line }}
      style={{
        alignItems: "center",
        backgroundColor: props.chosen ? colors()["accent-soft"] : "transparent",
        borderRadius: 8,
        height: 32,
        justifyContent: "center",
        width: 32,
      }}
    >
      <Image src={props.icon} style={{ height: 20, tintColor: props.chosen ? colors().accent : colors().muted, width: 20 }} />
    </View>
  );
}

/** SIDEBAR_WIDE and SIDEBAR_NARROW are the sidebar's widths in full and with only its icons, in points. */
const SIDEBAR_WIDE = 208;
const SIDEBAR_NARROW = 64;

/** SIDEBAR_ROW is the width of a row's content in full, which a narrower sidebar clips rather than lays out again. */
const SIDEBAR_ROW = SIDEBAR_WIDE - 24;

/**
 * sidebarWidth follows the width the sidebar should have, moving to a new one over 200 ms a frame at a time (at once
 * the first time and while the system asks for less motion). Each frame lays the window out again, so the pages
 * beside the sidebar move with it in step.
 */
function sidebarWidth(target: () => number) {
  const width = signal(untracked(target));
  effect(() => {
    const to = target();
    const from = untracked(width);
    if (from === to || untracked(reduceMotion)) {
      width.set(to);
      return;
    }
    let start: number | undefined;
    let frame = requestAnimationFrame(function step(time) {
      start ??= time;
      const t = Math.min(1, (time - start) / 200);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      width.set(Math.round(from + (to - from) * eased));
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  });
  return width;
}

/**
 * Sidebar holds the tabs on a desktop, where a bottom bar does not belong: each with its icon, ⌘1 to ⌘3 (Ctrl on
 * Windows and Linux) switch them, and a tab shows its key while the mouse is over it or ⌘ is held. At its head are
 * the logo and a button that collapses it to its icons (as a narrow window does), leaving out the logo; at its foot who
 * is signed in and the settings button, which ⌘, opens too, and only the settings button while collapsed. Collapsing
 * and expanding move its width, the rows keeping their places and the sidebar's edge clipping them.
 */
export function Sidebar() {
  SIDEBAR.forEach((id, index) => {
    keymap.bind(`mod+${index + 1}`, () => openTab(id));
  });
  keymap.bind("mod+,", () => openTab("me"));
  const roomy = () => windowSize().width >= 760;
  const wide = () => roomy() && !sidebarCollapsed();
  const width = sidebarWidth(() => (wide() ? SIDEBAR_WIDE : SIDEBAR_NARROW));
  // The labels, the logo and the name are there while the sidebar is wider than its icons, the edge clipping them.
  const open = () => width() > SIDEBAR_NARROW;
  const home = () => nav.routes().length === 1;
  const name = () => sessionUser()?.name ?? "";
  const hovered = signal<TabId | null>(null);
  const settings = () => tab() === "me" && home();
  /** Clip holds what a narrower sidebar cuts off at its edge, at the width it has in full. */
  const Clip = (props: { width: number; children: JSX.Element }) => (
    <View style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 8, width: props.width }}>{props.children}</View>
    </View>
  );
  return (
    <View
      role="navigation"
      style={{
        backgroundColor: colors().surface,
        borderColor: colors().line,
        borderRightWidth: 1,
        gap: 4,
        overflow: "hidden",
        paddingHorizontal: 12,
        paddingVertical: 16,
        width: width(),
      }}
    >
      <View style={{ alignItems: "center", flexDirection: "row", height: 32, marginBottom: 12, paddingHorizontal: 4 }}>
        <If when={roomy()} else={<Image src={logo} style={{ height: 28, marginLeft: 2, width: 28 }} accessibilityLabel="Great Academy" />}>
          <Clip width={SIDEBAR_ROW - 8 - 32}>
            <If when={open()}>
              <Image src={logo} style={{ height: 28, marginLeft: 2, width: 28 }} accessibilityLabel="Great Academy" />
            </If>
          </Clip>
          <SidebarButton
            icon={panel}
            label={sidebarCollapsed() ? m().expandSidebar : m().collapseSidebar}
            onPress={() => collapseSidebar(!sidebarCollapsed())}
          />
        </If>
      </View>
      <Each of={[...SIDEBAR]}>
        {(id, index) => {
          const chosen = () => tab() === id();
          return (
            <View
              role="tab"
              accessibilityLabel={tabTitle(id())}
              accessibilityState={{ selected: chosen() }}
              tooltip={wide() ? undefined : `${tabTitle(id())} ${keymap.label(`mod+${index() + 1}`)}`}
              onPress={() => openTab(id())}
              onMouseEnter={() => hovered.set(id())}
              onMouseLeave={() => hovered.set(null)}
              hoverStyle={{ backgroundColor: chosen() && home() ? colors()["accent-soft"] : colors().line }}
              style={{
                backgroundColor: chosen() && home() ? colors()["accent-soft"] : "transparent",
                borderRadius: 8,
                height: 36,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 10,
                  height: 36,
                  paddingHorizontal: 10,
                  width: SIDEBAR_ROW,
                }}
              >
                <Image src={drawn[id()]} style={{ height: 20, tintColor: chosen() ? colors().accent : colors().muted, width: 20 }} />
                <If when={open()}>
                  <Text
                    style={{
                      color: chosen() ? colors().accent : colors().ink,
                      flex: 1,
                      fontSize: 15,
                      fontWeight: chosen() ? "600" : "400",
                    }}
                  >
                    {tabTitle(id())}
                  </Text>
                  <Hint index={index()} hovered={hovered() === id()} />
                </If>
              </View>
            </View>
          );
        }}
      </Each>
      <View style={{ flex: 1 }} />
      <View
        style={{
          alignItems: "center",
          borderColor: colors().line,
          borderTopWidth: 1,
          flexDirection: "row",
          paddingHorizontal: 4,
          paddingTop: 12,
        }}
      >
        <Clip width={SIDEBAR_ROW - 8 - 32}>
          <If when={open()}>
            <View
              accessibilityLabel={name()}
              style={{
                alignItems: "center",
                backgroundColor: colors()["accent-soft"],
                borderRadius: 16,
                height: 32,
                justifyContent: "center",
                width: 32,
              }}
            >
              <Text style={{ color: colors().accent, fontSize: 14, fontWeight: "600" }}>{[...name()][0]?.toUpperCase() ?? ""}</Text>
            </View>
            <Text style={{ color: colors().ink, flex: 1, fontSize: 14, fontWeight: "500" }}>{name()}</Text>
          </If>
        </Clip>
        <SidebarButton
          icon={gear}
          label={m().settingsTab}
          tooltip={`${m().settingsTab} ${keymap.label("mod+,")}`}
          chosen={settings()}
          onPress={() => openTab("me")}
        />
      </View>
    </View>
  );
}
