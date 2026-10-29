import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useSession } from "./auth.ts";

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
