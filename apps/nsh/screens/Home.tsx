import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { Image, type JSX, keymap, platform, safeAreaInsets, signal, Text, View } from "nsh";
import { NavPage, Popover } from "nsh/base";
import { TabBar } from "nsh/mobile";

import caretDown from "../assets/icons/caret-down.svg";
import panel from "../assets/sidebar.svg";
import course from "../assets/tabs/courses.svg";
import learn from "../assets/tabs/learn.svg";
import me from "../assets/tabs/me.svg";
import progress from "../assets/tabs/progress.svg";
import gear from "../assets/tabs/settings.svg";
import { access, sessionUser } from "../lib/auth.ts";
import { HEADER_HEIGHT, SIDEBAR_NARROW, SIDEBAR_WIDE, sidebarToggleLeft, sidebarWide, sidebarWidth } from "../lib/chrome.ts";
import { m } from "../lib/i18n.ts";
import { nav, openTab, TABS, type TabId, tab } from "../lib/nav.ts";
import { collapseSidebar, sidebarCollapsed } from "../lib/prefs.ts";
import { p } from "../lib/privacy-text.ts";
import { SubjectSwitcher, usePlace } from "../lib/subject.tsx";
import { barStyle, colors, glass, headerStyle, isDark, TopBar } from "../lib/ui.tsx";
import { CourseTab } from "./CourseTab.tsx";
import { Header } from "./Header.tsx";
import { LearnTab } from "./LearnTab.tsx";
import { Progress } from "./Progress.tsx";
import { confirmSignOut, Me } from "./Settings.tsx";

/** tabTitle is a tab's name in the app's language; on a desktop the Me tab is the settings, opened from the sidebar's foot. */
export function tabTitle(id: TabId): string {
  const titles = {
    learn: m().tabLearn,
    progress: m().tabProgress,
    course: m().tabCourse,
    me: platform.desktop ? m().settingsTab : m().tabMe,
  };
  return titles[id];
}

const icons: Record<TabId, { ios: string; android: string }> = {
  learn: { ios: "graduationcap", android: "android:ic_menu_edit" },
  progress: { ios: "chart.bar", android: "android:ic_menu_sort_by_size" },
  course: { ios: "books.vertical", android: "android:ic_menu_agenda" },
  me: { ios: "person.crop.circle", android: "android:ic_menu_myplaces" },
};

/**
 * Home is the signed-in app's first page: the tab chosen in the tab bar or the sidebar. Learn, Progress and Course
 * are the pages of the subject shown, which a phone's top bar names and switches (docs/experience.md §4).
 */
export function Home() {
  const shown = (id: TabId) => () => tab() === id && nav.routes().at(-1)?.name === "home";
  const { place } = usePlace(() => !platform.desktop && nav.routes().at(-1)?.name === "home");
  return (
    <NavPage
      headerStyle={headerStyle()}
      title={tabTitle(tab())}
      // The phones draw their own head (`TopBar`); a desktop's header is the window's title bar, naming the tab.
      headerVisible={platform.desktop}
      header={<Header title={tabTitle(tab())} />}
      statusBar={{ foreground: isDark() ? "light" : "dark" }}
    >
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <If when={tab() === "learn"}>
          <LearnTab visible={shown("learn")} />
        </If>
        <If when={tab() === "progress"}>
          <Progress visible={shown("progress")} />
        </If>
        <If when={tab() === "course"}>
          <CourseTab visible={shown("course")} />
        </If>
        <If when={tab() === "me"}>
          <Me />
        </If>
        {/* The phones draw their own head, which the pages scroll under. */}
        <If when={!platform.desktop}>
          <TopBar title={tabTitle(tab())} lead={tab() === "me" ? undefined : <SubjectSwitcher place={place()} size={22} />} />
        </If>
      </View>
    </NavPage>
  );
}

/** drawn are the icons of the tab bar the app draws itself. */
const drawn: Record<TabId, typeof learn> = { learn, progress, course, me };

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
function SidebarButton(props: { icon: typeof gear; label: string; tooltip?: string; chosen?: boolean; onPress: () => void }) {
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

/** SIDEBAR_ROW is the width of a row's content in full, which a narrower sidebar clips rather than lays out again. */
const SIDEBAR_ROW = SIDEBAR_WIDE - 24;

/**
 * SidebarToggle collapses the sidebar to its icons and expands it again. It stands over the window's top row, which
 * on macOS is the title bar: at the sidebar's right end in full, and right of the traffic lights when collapsed.
 */
export function SidebarToggle() {
  return (
    <View style={{ left: sidebarToggleLeft(), position: "absolute", top: (HEADER_HEIGHT - 32) / 2 }}>
      <SidebarButton
        icon={panel}
        label={sidebarCollapsed() ? m().expandSidebar : m().collapseSidebar}
        onPress={() => collapseSidebar(!sidebarCollapsed())}
      />
    </View>
  );
}

/** CORNER is the radius of the pages' top left corner beside the sidebar, in points. */
const CORNER = 10;

/**
 * ContentCorner rounds the pages' top left corner, where the sidebar's edge meets the header's line under the title
 * bar's row: it stands over that corner, taking no presses, and moves with the sidebar.
 */
export function ContentCorner() {
  return (
    <View
      style={{
        backgroundColor: colors().surface,
        height: CORNER + 1,
        left: sidebarWidth() - 1,
        pointerEvents: "none",
        position: "absolute",
        top: HEADER_HEIGHT - 1,
        width: CORNER + 1,
      }}
    >
      <View
        style={{
          backgroundColor: colors().page,
          borderColor: colors().line,
          borderLeftWidth: 1,
          borderTopLeftRadius: CORNER,
          borderTopWidth: 1,
          flex: 1,
        }}
      />
    </View>
  );
}

/** MenuItem is one line of the account menu; choosing it closes the menu first. */
function MenuItem(props: { label: string; tone?: "bad"; onPress: () => void }) {
  return (
    <Text
      role="menuitem"
      onPress={props.onPress}
      hoverStyle={{ backgroundColor: colors().line }}
      style={{
        borderRadius: 8,
        color: props.tone === "bad" ? colors().bad : colors().ink,
        fontSize: 14,
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}
    >
      {props.label}
    </Text>
  );
}

/**
 * AccountMenu is who is signed in at the sidebar's foot, which opens a menu above it as the web's account menu does:
 * the name and email, then the course catalog, the league, the learners followed, the settings and signing out.
 */
function AccountMenu(props: { name: string; width: number }) {
  const shown = signal(false);
  const email = () => sessionUser()?.email ?? "";
  const go = (run: () => void) => () => {
    shown.set(false);
    run();
  };
  return (
    <Popover
      open={shown()}
      onOpenChange={({ open }) => shown.set(open)}
      placement="top"
      align="start"
      offset={6}
      margin={8}
      popupStyle={{
        backgroundColor: colors().surface,
        borderColor: colors().line,
        borderRadius: 12,
        borderWidth: 1,
        gap: 2,
        padding: 6,
        width: 260,
      }}
      trigger={
        <View
          role="button"
          accessibilityLabel={m().accountMenu(props.name)}
          hoverStyle={{ backgroundColor: colors().line }}
          style={{
            alignItems: "center",
            alignSelf: "flex-start",
            borderRadius: 10,
            flexDirection: "row",
            gap: 8,
            marginLeft: -6,
            maxWidth: props.width,
            paddingLeft: 6,
            paddingRight: 10,
            paddingVertical: 6,
          }}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: colors()["accent-soft"],
              borderRadius: 16,
              height: 32,
              justifyContent: "center",
              width: 32,
            }}
          >
            <Text style={{ color: colors().accent, fontSize: 14, fontWeight: "600" }}>{[...props.name][0]?.toUpperCase() ?? ""}</Text>
          </View>
          <Text style={{ color: colors().ink, flexShrink: 1, fontSize: 14, fontWeight: "500", numberOfLines: 1 }}>{props.name}</Text>
          <Image src={caretDown} style={{ height: 12, tintColor: colors().muted, width: 12 }} />
        </View>
      }
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: colors().line,
          gap: 2,
          marginBottom: 4,
          paddingBottom: 8,
          paddingHorizontal: 10,
          paddingTop: 4,
        }}
      >
        <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "600", numberOfLines: 1 }}>{props.name}</Text>
        <If when={email() && !email().endsWith(".invalid")}>
          <Text style={{ color: colors().muted, fontSize: 12, numberOfLines: 1 }}>{email()}</Text>
        </If>
      </View>
      <MenuItem label={m().courses} onPress={go(() => nav.push({ name: "courses" }))} />
      <If when={access()?.band !== Band.CHILD}>
        <MenuItem label={m().league} onPress={go(() => nav.push({ name: "standings" }))} />
      </If>
      <If when={access()?.band === Band.ADULT}>
        <MenuItem label={p().guardedTitle} onPress={go(() => nav.push({ name: "learners" }))} />
      </If>
      <MenuItem label={m().settingsTab} onPress={go(() => openTab("me"))} />
      <View style={{ backgroundColor: colors().line, height: 1, marginVertical: 4 }} />
      <MenuItem label={m().signOut} onPress={go(() => void confirmSignOut())} />
    </Popover>
  );
}

/**
 * Sidebar holds the tabs on a desktop, where a bottom bar does not belong: first the subject shown, which opens the
 * switch to another, then the subject's tabs, each with its icon, ⌘1 to ⌘3 (Ctrl on
 * Windows and Linux) switch them, and a tab shows its key while the mouse is over it or ⌘ is held. Its top row is
 * the window's title bar, with the window controls and `SidebarToggle` over it, which collapses it to its icons (as a
 * narrow window does); at its foot who is signed in and the settings button, which ⌘, opens too, and only the settings
 * button while collapsed. Collapsing and expanding move its width, the rows keeping their places and the sidebar's
 * edge clipping them.
 */
export function Sidebar() {
  SIDEBAR.forEach((id, index) => {
    keymap.bind(`mod+${index + 1}`, () => openTab(id));
  });
  keymap.bind("mod+,", () => openTab("me"));
  const wide = sidebarWide;
  const width = sidebarWidth;
  // The labels and the name are there while the sidebar is wider than its icons, the edge clipping them.
  const open = () => width() > SIDEBAR_NARROW;
  const home = () => nav.routes().length === 1;
  const name = () => sessionUser()?.name ?? "";
  const hovered = signal<TabId | null>(null);
  const settings = () => tab() === "me" && home();
  const { place } = usePlace(() => true);
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
        gap: 4,
        overflow: "hidden",
        paddingBottom: 16,
        paddingHorizontal: 12,
        width: width(),
      }}
    >
      {/* The edge beside the pages, below the title bar's row, which runs on into the header without a line. */}
      <View style={{ backgroundColor: colors().line, bottom: 0, position: "absolute", right: 0, top: HEADER_HEIGHT, width: 1 }} />
      {/* The title bar's row: it drags the window, under the window controls and the collapse button. */}
      <View desktop={{ windowDrag: true }} style={{ height: HEADER_HEIGHT + 8, marginHorizontal: -12 }} />
      <View style={{ marginBottom: 8, paddingHorizontal: 8, width: SIDEBAR_ROW }}>
        <SubjectSwitcher place={place()} size={16} compact={!open()} />
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
          <AccountMenu name={name()} width={SIDEBAR_ROW - 8 - 32} />
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
