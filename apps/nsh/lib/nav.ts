import { signal } from "nsh";
import { createNavStack } from "nsh/base";

/** Route is a page of the app. */
export type Route =
  | { name: "launch" }
  | { name: "welcome" }
  | { name: "home" }
  | { name: "courses" }
  | { name: "course"; courseId: string }
  | { name: "learn"; courseId: string }
  | { name: "map"; courseId: string }
  | { name: "history"; courseId: string }
  | { name: "session"; sessionId: string }
  | { name: "sign-in" }
  | { name: "sign-up" }
  | { name: "forgot-password" }
  | { name: "delete-account" }
  | { name: "goals" }
  | { name: "profile" }
  | { name: "league" }
  | { name: "password" }
  | { name: "privacy" }
  | { name: "learners" }
  | { name: "plans" }
  | { name: "learner"; learnerId: string }
  | { name: "age" }
  | { name: "access" };

/** LAUNCH is the blank first page, shown while the app reads whether someone is signed in. */
export const LAUNCH: Route = { name: "launch" };

/** WELCOME is the first page of someone signed out. */
export const WELCOME: Route = { name: "welcome" };

/** HOME is the first page of someone signed in: the tabs. */
export const HOME: Route = { name: "home" };

/** COURSES is the course list of someone signed out. */
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

/** afterSignUp is a page to open over the first page once a new account may study: a guardian's learners. */
export const afterSignUp = signal<Route | null>(null);

/** nav is the app's navigation stack. */
export const nav = createNavStack<Route>([LAUNCH]);

/** TabId names a tab of the signed-in app. */
export type TabId = "learn" | "progress" | "courses" | "me";

/** TABS lists the tabs in their order. */
export const TABS: readonly TabId[] = ["learn", "progress", "courses", "me"];

/** tab is the tab shown on the home page. */
export const tab = signal<TabId>("learn");

/** openTab shows a tab, going back to the home page from wherever the stack is. */
export function openTab(id: TabId): void {
  tab.set(id);
  if (nav.routes().length !== 1 || nav.routes()[0]?.name !== "home") nav.setRoutes([HOME]);
}
