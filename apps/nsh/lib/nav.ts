import { createNavStack } from "nsh/base";

/** Route is a page of the app. */
export type Route = { name: "courses" } | { name: "course"; courseId: string };

/** nav is the app's navigation stack. */
export const nav = createNavStack<Route>([{ name: "courses" }]);
