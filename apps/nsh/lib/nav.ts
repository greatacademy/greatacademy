import { createNavStack } from "nsh/base";

/** Route is a page of the app. */
export type Route =
  | { name: "courses" }
  | { name: "course"; courseId: string }
  | { name: "learn"; courseId: string }
  | { name: "session"; sessionId: string }
  | { name: "sign-in" }
  | { name: "sign-up" }
  | { name: "account" }
  | { name: "age" }
  | { name: "access" };

/** COURSES is the first page. */
export const COURSES: Route = { name: "courses" };

/** WELCOME is the first page of someone signed out. */
export const WELCOME: Route = COURSES;

/** AGE is the page of the age question. */
export const AGE: Route = { name: "age" };

/** ACCESS is the page that says why study is not available. */
export const ACCESS: Route = { name: "access" };

/** nav is the app's navigation stack. */
export const nav = createNavStack<Route>([COURSES]);
