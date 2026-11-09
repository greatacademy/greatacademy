import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

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
