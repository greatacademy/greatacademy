import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "../components/AuthForm.tsx";
import { useSignedOutOnly } from "../lib/hooks.ts";
import { sessionHint } from "../lib/session-cookie.ts";

export const Route = createFileRoute("/sign-in")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => (typeof s.next === "string" ? { next: s.next } : {}),
  loader: sessionHint,
  staleTime: Number.POSITIVE_INFINITY,
  component: function Page() {
    const { next } = Route.useSearch();
    const show = useSignedOutOnly(Route.useLoaderData(), next);
    return show ? <AuthForm mode="sign-in" next={next} /> : null;
  },
});
