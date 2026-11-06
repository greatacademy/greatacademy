import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useSession } from "./auth.ts";
import { isNotEnrolled } from "./rpc.ts";

/**
 * useEnrollFirst sends a learner whose query failed for lack of an enrollment to
 * the course page, which has the enroll button. It returns whether it is doing so.
 */
export function useEnrollFirst(courseId: string, error: unknown) {
  const navigate = useNavigate();
  const redirecting = !!error && isNotEnrolled(error);
  useEffect(() => {
    if (redirecting) void navigate({ to: "/courses/$courseId", params: { courseId }, replace: true });
  }, [redirecting, navigate, courseId]);
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
