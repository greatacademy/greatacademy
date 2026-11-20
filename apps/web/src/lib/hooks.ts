import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useSession } from "./auth.ts";
import { isNotCurrent } from "./rpc.ts";

/**
 * useCurrentCourseFirst sends a learner whose query failed because the course is
 * not their current one home, which opens their current course or asks for one.
 * It returns whether it is doing so.
 */
export function useCurrentCourseFirst(error: unknown) {
  const navigate = useNavigate();
  const redirecting = !!error && isNotCurrent(error);
  useEffect(() => {
    if (redirecting) void navigate({ to: "/", replace: true });
  }, [redirecting, navigate]);
  return redirecting;
}

/**
 * useRequireSession sends a signed-out visitor to sign in, then back here.
 * It returns the session once known; null while pending or redirecting.
 */
export function useRequireSession() {
  const { data, isPending } = useSession();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isPending && !data) void navigate({ to: "/sign-in", search: { next: location.pathname } });
  }, [isPending, data, navigate]);
  return data ?? null;
}

/** nextPath is where a page that signs in leads: `next` when it is a path of this site, else home. */
export function nextPath(next: string | undefined): string {
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/";
}

/**
 * useSignedOutOnly sends a visitor who arrives signed in on to `next`, or home: signing in, signing up and recovering a
 * password are for visitors. It decides once, when the session is first known, so a form on the page that signs in
 * still leads where it goes. `hinted` is whether the session cookie was there when the page was served; until the
 * session is known the page then shows nothing rather than a form that is about to go. It returns whether to show the
 * page.
 */
export function useSignedOutOnly(hinted: boolean, next?: string): boolean {
  const { data, isPending } = useSession();
  const navigate = useNavigate();
  const [arrived, setArrived] = useState<"pending" | "in" | "out">(() => (isPending ? "pending" : data ? "in" : "out"));
  useEffect(() => {
    if (arrived === "pending" && !isPending) setArrived(data ? "in" : "out");
  }, [arrived, isPending, data]);
  useEffect(() => {
    if (arrived === "in") void navigate({ to: nextPath(next), replace: true });
  }, [arrived, next, navigate]);
  return arrived === "out" || (arrived === "pending" && !hinted);
}
