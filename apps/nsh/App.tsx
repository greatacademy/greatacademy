import { AccessStatus } from "@ga/proto/privacy/v1/privacy_pb";
import { computed, effect, mount, platform, View } from "nsh";
import { NavPage, NavStack } from "nsh/base";

import { access } from "./lib/auth.ts";
import { ACCESS, AGE, ENTRY, HOME, nav, OPEN, WELCOME } from "./lib/nav.ts";
import { comeBack, watchForeground } from "./lib/net.ts";
import { restorePrefs } from "./lib/prefs.ts";
import { restoreToken, token } from "./lib/session.ts";
import { barSpace, colors, OfflineNote, tabsShown } from "./lib/ui.tsx";
import { keepWindowLarge } from "./lib/window.ts";
import { Access } from "./screens/Access.tsx";
import { Age } from "./screens/Age.tsx";
import { CourseMap } from "./screens/CourseMap.tsx";
import { CourseOutline } from "./screens/CourseOutline.tsx";
import { Courses } from "./screens/Courses.tsx";
import { DeleteAccount } from "./screens/DeleteAccount.tsx";
import { ForgotPassword } from "./screens/ForgotPassword.tsx";
import { History } from "./screens/History.tsx";
import { Home, PhoneTabs, Sidebar } from "./screens/Home.tsx";
import { Learn } from "./screens/Learn.tsx";
import { Player } from "./screens/Player.tsx";
import { SignIn } from "./screens/SignIn.tsx";
import { SignUp } from "./screens/SignUp.tsx";
import { Welcome } from "./screens/Welcome.tsx";

void restorePrefs();
void restoreToken();
keepWindowLarge();
watchForeground();

// What the account may do can change while the app is away, as when a guardian agrees.
effect(() => {
  if (comeBack() > 0) access.refetch();
});

// Keeps the stack on what the account may see: someone signed out starts at the welcome page, someone signed in at
// their learning, and the age question and the access page have no way past them.
effect(() => {
  const top = nav.routes().at(-1)?.name ?? "launch";
  const signedIn = token();
  if (signedIn === undefined) return;
  if (signedIn === null) {
    if (top === "launch" || !OPEN.has(top)) nav.setRoutes([WELCOME]);
    return;
  }
  if (access.loading() && !access()) return;
  const status = access()?.status;
  if (status === AccessStatus.NEEDS_AGE) {
    if (top !== "age") nav.setRoutes([AGE]);
  } else if (status === AccessStatus.MARKET_CLOSED || status === AccessStatus.NEEDS_GUARDIAN) {
    if (top !== "access") nav.setRoutes([ACCESS]);
  } else if (status === AccessStatus.OK && ENTRY.has(top)) {
    nav.setRoutes([HOME]);
  }
});

// The tabs show for an account that may study, everywhere but the pages that lead to an account.
const inTabs = computed(() => {
  const top = nav.routes().at(-1)?.name ?? "launch";
  return !!token() && access()?.status === AccessStatus.OK && !ENTRY.has(top);
});
effect(() => tabsShown.set(!platform.desktop && inTabs() && nav.routes().at(-1)?.name !== "session"));

function App() {
  const sidebar = () => platform.desktop && inTabs() && nav.routes().at(-1)?.name !== "session";
  return (
    <View style={{ backgroundColor: colors().page, flex: 1, flexDirection: "row" }}>
      <If when={sidebar()}>
        <Sidebar />
      </If>
      <NavStack state={nav} style={{ flex: 1 }}>
        {(route) => {
          switch (route.name) {
            case "launch":
              return (
                <NavPage headerVisible={false}>
                  <View style={{ backgroundColor: colors().page, flex: 1 }} />
                </NavPage>
              );
            case "welcome":
              return <Welcome />;
            case "home":
              return <Home />;
            case "courses":
              return <Courses />;
            case "course":
              return <CourseOutline courseId={route.courseId} />;
            case "learn":
              return <Learn courseId={route.courseId} />;
            case "map":
              return <CourseMap courseId={route.courseId} />;
            case "history":
              return <History courseId={route.courseId} />;
            case "session":
              return <Player sessionId={route.sessionId} />;
            case "sign-in":
              return <SignIn />;
            case "sign-up":
              return <SignUp />;
            case "forgot-password":
              return <ForgotPassword />;
            case "delete-account":
              return <DeleteAccount />;
            case "age":
              return <Age />;
            case "access":
              return <Access />;
          }
        }}
      </NavStack>
      <If when={!platform.desktop}>
        <PhoneTabs hidden={!inTabs()} />
      </If>
      <OfflineNote bottom={24 + barSpace()} />
    </View>
  );
}

mount(App);
