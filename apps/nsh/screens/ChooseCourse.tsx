import { NavPage } from "nsh/base";
import { m } from "../lib/i18n.ts";
import { HOME, nav, tab } from "../lib/nav.ts";
import { chooseSubject } from "../lib/prefs.ts";
import { markChanged } from "../lib/query.ts";
import { headerStyle } from "../lib/ui.tsx";
import { CourseList } from "./Courses.tsx";
import { Header } from "./Header.tsx";

/**
 * ChooseCourse makes a course of a subject its current one, for the learner or for a learner the caller is a
 * guardian of. Progress stays with the subject, so changing course loses nothing; replacing a current course asks
 * first. The learner's own choice opens the subject's Learn tab.
 */
export function ChooseCourse(props: { subjectId?: string; learnerId?: string; learnerName?: string; current?: string }) {
  const title = () => (props.learnerName ? m().chooseForChild(props.learnerName) : props.current ? m().changeCourse : m().chooseCourse);
  const intro = () => (props.current ? m().changeCourseWhen : props.learnerName ? m().chooseForChildBody : m().chooseBody);
  const chosen = (_: string, subjectId: string) => {
    markChanged();
    if (props.learnerId) {
      nav.pop();
      return;
    }
    if (subjectId) chooseSubject(subjectId);
    tab.set("learn");
    nav.setRoutes([HOME]);
  };
  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />}>
      <CourseList
        visible={() => nav.routes().at(-1)?.name === "choose"}
        intro={intro()}
        subject={props.subjectId}
        choose={{
          ...(props.learnerId && { learnerId: props.learnerId }),
          ...(props.current && { current: props.current }),
          onChosen: chosen,
        }}
      />
    </NavPage>
  );
}
