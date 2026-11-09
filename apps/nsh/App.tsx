import { AccessStatus } from "@ga/proto/privacy/v1/privacy_pb";
import { computed, effect, mount, platform, untracked, View } from "nsh";
import { NavPage, NavStack } from "nsh/base";

import { access } from "./lib/auth.ts";
import { sidebarRoomy, sidebarShown } from "./lib/chrome.ts";
import { ACCESS, AGE, afterSignUp, ENTRY, HOME, nav, OPEN, tab, WELCOME } from "./lib/nav.ts";
import { comeBack, watchForeground } from "./lib/net.ts";
import { restorePrefs } from "./lib/prefs.ts";
import { watchQueries } from "./lib/query.ts";
import { restoreToken, token } from "./lib/session.ts";
import { settleUnfinished } from "./lib/store.ts";
import { showTray } from "./lib/tray.ts";
import { barSpace, barsAway, colors, followPalette, OfflineNote, tabsShown } from "./lib/ui.tsx";
import { keepWindowLarge } from "./lib/window.ts";
import { Access } from "./screens/Access.tsx";
import { Goals, League, Password, Profile } from "./screens/Account.tsx";
import { Age } from "./screens/Age.tsx";
import { ChooseCourse } from "./screens/ChooseCourse.tsx";
import { CourseMap } from "./screens/CourseMap.tsx";
import { CourseOutline } from "./screens/CourseOutline.tsx";
import { Courses } from "./screens/Courses.tsx";
import { DeleteAccount } from "./screens/DeleteAccount.tsx";
import { ForgotPassword } from "./screens/ForgotPassword.tsx";
import { History } from "./screens/History.tsx";
import { commandHeld, Home, heldCommand, PhoneTabs, Sidebar, SidebarToggle } from "./screens/Home.tsx";
import { Launch, launchLeaving } from "./screens/Launch.tsx";
import { Learn } from "./screens/Learn.tsx";
import { Learner } from "./screens/Learner.tsx";
import { Learners } from "./screens/Learners.tsx";
import { Plans } from "./screens/Plans.tsx";
import { Player } from "./screens/Player.tsx";
import { Privacy } from "./screens/Privacy.tsx";
import { SignIn } from "./screens/SignIn.tsx";
import { SignUp } from "./screens/SignUp.tsx";
import { Welcome } from "./screens/Welcome.tsx";

void restorePrefs();
void restoreToken();
keepWindowLarge();
watchForeground();
watchQueries();
followPalette();

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
    const then = untracked(afterSignUp);
    afterSignUp.set(null);
    nav.setRoutes(then ? [HOME, then] : [HOME]);
  }
});

// App Store purchases StoreKit still holds, as renewals, go to the server once someone is signed in and when the app
// comes back.
effect(() => {
  comeBack();
  if (token()) void settleUnfinished();
});

// The tabs show for an account that may study, everywhere but the pages that lead to an account.
const inTabs = computed(() => {
  const top = nav.routes().at(-1)?.name ?? "launch";
  return !!token() && access()?.status === AccessStatus.OK && !ENTRY.has(top);
});
// The system tab bar would sit over the mark of the launch, so it comes as the mark leaves.
effect(() => tabsShown.set(!platform.desktop && launchLeaving() && inTabs() && nav.routes().at(-1)?.name !== "session"));
effect(() => showTray(inTabs()));
// A page or tab the learner opens starts with the tab bar in sight.
effect(() => {
  nav.routes();
  tab();
  barsAway.set(false);
});

function App() {
  const sidebar = () => platform.desktop && inTabs() && nav.routes().at(-1)?.name !== "session";
  effect(() => sidebarShown.set(sidebar()));
  return (
    <View
      style={{ backgroundColor: colors().page, flex: 1, flexDirection: "row" }}
      onMouseMove={(e) => commandHeld.set(heldCommand(e.modifiers))}
      onMouseLeave={() => commandHeld.set(false)}
    >
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
            case "choose":
              return <ChooseCourse learnerId={route.learnerId} learnerName={route.learnerName} current={route.current} />;
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
            case "goals":
              return <Goals />;
            case "profile":
              return <Profile />;
            case "league":
              return <League />;
            case "password":
              return <Password />;
            case "privacy":
              return <Privacy />;
            case "learners":
              return <Learners />;
            case "plans":
              return <Plans />;
            case "learner":
              return <Learner learnerId={route.learnerId} />;
            case "age":
              return <Age />;
            case "access":
              return <Access />;
          }
        }}
      </NavStack>
      <If when={sidebar() && sidebarRoomy()}>
        <SidebarToggle />
      </If>
      {/* Android's tab bar stays on screen while hidden, so it is only there while the tabs show. */}
      <If when={tabsShown()}>
        <PhoneTabs />
      </If>
      <OfflineNote bottom={24 + barSpace()} />
      <Launch />
    </View>
  );
}

mount(App);
