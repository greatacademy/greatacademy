import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "../components/AuthForm.tsx";

export const Route = createFileRoute("/sign-in")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => (typeof s.next === "string" ? { next: s.next } : {}),
  component: function Page() {
    const { next } = Route.useSearch();
    return <AuthForm mode="sign-in" next={next} />;
  },
});
