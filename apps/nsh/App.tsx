import { AccessStatus } from "@ga/proto/privacy/v1/privacy_pb";
import { effect, mount } from "nsh";
import { NavStack } from "nsh/base";

import { access } from "./lib/auth.ts";
import { ACCESS, AGE, COURSES, nav } from "./lib/nav.ts";
import { restoreToken, token } from "./lib/session.ts";
import { keepWindowLarge } from "./lib/window.ts";
import { Access } from "./screens/Access.tsx";
import { Account } from "./screens/Account.tsx";
import { Age } from "./screens/Age.tsx";
import { CourseOutline } from "./screens/CourseOutline.tsx";
import { Courses } from "./screens/Courses.tsx";
import { Learn } from "./screens/Learn.tsx";
import { Player } from "./screens/Player.tsx";
import { SignIn } from "./screens/SignIn.tsx";
import { SignUp } from "./screens/SignUp.tsx";

void restoreToken();
keepWindowLarge();

// Keeps the stack on what the account may see: the age question and the access page have no way past them.
effect(() => {
  const top = nav.routes().at(-1)?.name;
  if (token() === null) {
    if (top === "age" || top === "access" || top === "account" || top === "learn" || top === "session") nav.setRoutes([COURSES]);
    return;
  }
  if (access.loading()) return;
  const status = access()?.status;
  if (status === AccessStatus.NEEDS_AGE) {
    if (top !== "age") nav.setRoutes([AGE]);
  } else if (status === AccessStatus.MARKET_CLOSED || status === AccessStatus.NEEDS_GUARDIAN) {
    if (top !== "access") nav.setRoutes([ACCESS]);
  } else if (status === AccessStatus.OK && (top === "age" || top === "access" || top === "sign-in" || top === "sign-up")) {
    nav.setRoutes([COURSES]);
  }
});

function App() {
  return (
    <NavStack state={nav} style={{ flex: 1 }}>
      {(route) => {
        switch (route.name) {
          case "courses":
            return <Courses />;
          case "course":
            return <CourseOutline courseId={route.courseId} />;
          case "learn":
            return <Learn courseId={route.courseId} />;
          case "session":
            return <Player sessionId={route.sessionId} />;
          case "sign-in":
            return <SignIn />;
          case "sign-up":
            return <SignUp />;
          case "account":
            return <Account />;
          case "age":
            return <Age />;
          case "access":
            return <Access />;
        }
      }}
    </NavStack>
  );
}

mount(App);
