import { NavPage } from "nsh/base";
import { m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { markChanged } from "../lib/query.ts";
import { headerStyle } from "../lib/ui.tsx";
import { CourseList } from "./Courses.tsx";
import { Header } from "./Header.tsx";

/**
 * ChooseCourse makes a course the current one of its subject, for the learner or
 * for a learner the caller is a guardian of. Progress stays with the subject, so
 * changing course loses nothing.
 */
export function ChooseCourse(props: { learnerId?: string; learnerName?: string; current?: string }) {
  const title = () => (props.learnerName ? m().chooseForChild(props.learnerName) : props.current ? m().changeCourse : m().chooseCourse);
  const intro = () => (props.current ? m().changeCourseBody : props.learnerName ? m().chooseForChildBody : m().chooseBody);
  const chosen = (courseId: string) => {
    markChanged();
    if (props.learnerId) nav.pop();
    else nav.setRoutes([...nav.routes().slice(0, 1), { name: "learn", courseId }]);
  };
  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />}>
      <CourseList
        visible={() => nav.routes().at(-1)?.name === "choose"}
        intro={intro()}
        choose={{
          ...(props.learnerId && { learnerId: props.learnerId }),
          ...(props.current && { current: props.current }),
          onChosen: chosen,
        }}
      />
    </NavPage>
  );
}
