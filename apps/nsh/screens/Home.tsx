import { Image, keymap, platform, Text, View, windowSize } from "nsh";
import { NavPage } from "nsh/base";
import { TabBar } from "nsh/mobile";

import logo from "../assets/logo.svg";
import { m } from "../lib/i18n.ts";
import { nav, openTab, TABS, type TabId, tab } from "../lib/nav.ts";
import { colors, headerStyle } from "../lib/ui.tsx";
import { CourseList } from "./Courses.tsx";
import { Header } from "./Header.tsx";
import { Progress } from "./Progress.tsx";
import { Me } from "./Settings.tsx";
import { Today } from "./Today.tsx";

/** tabTitle is a tab's name in the app's language. */
export function tabTitle(id: TabId): string {
  const titles = { today: m().tabToday, progress: m().tabProgress, courses: m().tabCourses, me: m().tabMe };
  return titles[id];
}

const icons: Record<TabId, { ios: string; android: string }> = {
  today: { ios: "sun.max", android: "android:ic_menu_today" },
  progress: { ios: "chart.bar", android: "android:ic_menu_sort_by_size" },
  courses: { ios: "books.vertical", android: "android:ic_menu_agenda" },
  me: { ios: "person.crop.circle", android: "android:ic_menu_myplaces" },
};

/** Home is the signed-in app's first page: the tab chosen in the tab bar or the sidebar. */
export function Home() {
  const shown = (id: TabId) => () => tab() === id && nav.routes().at(-1)?.name === "home";
  return (
    <NavPage headerStyle={headerStyle()} title={tabTitle(tab())} header={<Header title={tabTitle(tab())} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <If when={tab() === "today"}>
          <Today visible={shown("today")} />
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
      </View>
    </NavPage>
  );
}

/** PhoneTabs is the system tab bar along the bottom of a phone: Liquid Glass on iOS 26, Material on Android. */
export function PhoneTabs(props: { hidden: boolean }) {
  return (
    <TabBar
      hidden={props.hidden}
      items={TABS.map((id) => ({ title: tabTitle(id), icon: platform.select(icons[id]) ?? null }))}
      selectedIndex={TABS.indexOf(tab())}
      onChange={({ index }) => {
        const id = TABS[index];
        if (id) openTab(id);
      }}
      style={{ bottom: 0, left: 0, position: "absolute", right: 0 }}
    />
  );
}

/** Sidebar holds the tabs on a desktop, where a bottom bar does not belong; ⌘1 to ⌘4 (Ctrl on Windows and Linux) switch them. */
export function Sidebar() {
  TABS.forEach((id, index) => {
    keymap.bind(`mod+${index + 1}`, () => openTab(id));
  });
  const wide = () => windowSize().width >= 760;
  return (
    <View
      role="navigation"
      style={{
        backgroundColor: colors().surface,
        borderColor: colors().line,
        borderRightWidth: 1,
        gap: 4,
        paddingHorizontal: wide() ? 12 : 6,
        paddingVertical: 16,
        width: wide() ? 208 : 84,
      }}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
          justifyContent: wide() ? "flex-start" : "center",
          marginBottom: 12,
          paddingHorizontal: 8,
        }}
      >
        <Image src={logo} style={{ height: 28, width: 28 }} accessibilityLabel="Great Academy" />
        <If when={wide()}>
          <Text style={{ color: colors().ink, fontSize: 16, fontWeight: "700" }}>Great Academy</Text>
        </If>
      </View>
      <Each of={[...TABS]}>
        {(id, index) => (
          <View
            role="tab"
            accessibilityState={{ selected: tab() === id() }}
            onPress={() => openTab(id())}
            style={{
              alignItems: wide() ? "flex-start" : "center",
              backgroundColor: tab() === id() && nav.routes().length === 1 ? colors()["accent-soft"] : "transparent",
              borderRadius: 8,
              flexDirection: "row",
              gap: 8,
              justifyContent: wide() ? "flex-start" : "center",
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                color: tab() === id() ? colors().accent : colors().ink,
                flex: wide() ? 1 : undefined,
                fontSize: wide() ? 15 : 13,
                fontWeight: tab() === id() ? "600" : "400",
              }}
            >
              {tabTitle(id())}
            </Text>
            <If when={wide()}>
              <Text style={{ color: colors().muted, fontSize: 12 }}>{`${platform.os === "macos" ? "⌘" : "Ctrl+"}${index() + 1}`}</Text>
            </If>
          </View>
        )}
      </Each>
    </View>
  );
}
