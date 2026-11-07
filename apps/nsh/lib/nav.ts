import { createNavStack } from "nsh/base";

/** Route is a page of the app. */
export type Route =
  | { name: "launch" }
  | { name: "welcome" }
  | { name: "courses" }
  | { name: "course"; courseId: string }
  | { name: "learn"; courseId: string }
  | { name: "session"; sessionId: string }
  | { name: "sign-in" }
  | { name: "sign-up" }
  | { name: "forgot-password" }
  | { name: "account" }
  | { name: "delete-account" }
  | { name: "age" }
  | { name: "access" };

/** LAUNCH is the blank first page, shown while the app reads whether someone is signed in. */
export const LAUNCH: Route = { name: "launch" };

/** WELCOME is the first page of someone signed out. */
export const WELCOME: Route = { name: "welcome" };

/** COURSES is the first page of someone signed in. */
export const COURSES: Route = { name: "courses" };

/** AGE is the page of the age question. */
export const AGE: Route = { name: "age" };

/** ACCESS is the page that says why study is not available. */
export const ACCESS: Route = { name: "access" };

/** OPEN lists the pages someone signed out may see. */
export const OPEN: ReadonlySet<Route["name"]> = new Set([
  "launch",
  "welcome",
  "courses",
  "course",
  "sign-in",
  "sign-up",
  "forgot-password",
]);

/** ENTRY lists the pages that lead to an account, which a signed-in account leaves for its first page. */
export const ENTRY: ReadonlySet<Route["name"]> = new Set(["launch", "welcome", "sign-in", "sign-up", "forgot-password", "age", "access"]);

/** nav is the app's navigation stack. */
export const nav = createNavStack<Route>([LAUNCH]);
