import { mount } from "nsh";
import { NavStack } from "nsh/base";

import { nav } from "./lib/nav.ts";
import { CourseOutline } from "./screens/CourseOutline.tsx";
import { Courses } from "./screens/Courses.tsx";

function App() {
  return (
    <NavStack state={nav} style={{ flex: 1 }}>
      {(route) => {
        switch (route.name) {
          case "courses":
            return <Courses />;
          case "course":
            return <CourseOutline courseId={route.courseId} />;
        }
      }}
    </NavStack>
  );
}

mount(App);
