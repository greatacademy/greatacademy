import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

import { Landing } from "../components/Landing.tsx";
import { LoadError } from "../components/LoadError.tsx";
import { Spinner } from "../components/ui.tsx";
import { Welcome } from "../components/Welcome.tsx";
import { useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { account, timeZone } from "../lib/rpc.ts";
import { hasSessionCookie } from "../lib/session-cookie.ts";
import { rememberedSubject, useProfile } from "../lib/subject.tsx";

export const Route = createFileRoute("/")({
  // The cookie decides the server's first render. Later the session is known in the browser, so moving here asks the server nothing.
  loader: () => (typeof document === "undefined" ? hasSessionCookie() : true),
  staleTime: Number.POSITIVE_INFINITY,
  component: Index,
});

/** Index is the landing page for a visitor and the learner's home after signing in. */
function Index() {
  const signedIn = Route.useLoaderData();
  const { data: session, isPending } = useSession();
  const { m } = useI18n();
  if (session) return <Home />;
  if (signedIn && isPending) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-8">
        <Spinner label={m.loading} />
      </div>
    );
  }
  return <Landing />;
}

/** Home opens the subject last opened in this browser, else the one most recently worked in, or a first step when there is none. */
function Home() {
  const { m } = useI18n();
  const profile = useProfile();
  const guarded = useQuery({ queryKey: ["guarded"], queryFn: () => account.listGuardedLearners({ timeZone: timeZone() }) });
  const enrolled = profile.data?.enrollments ?? [];
  const remembered = rememberedSubject();
  const subject = enrolled.some((e) => e.subjectId === remembered) ? remembered : enrolled[0]?.subjectId;
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-24">
      {profile.isPending || (!subject && guarded.isPending) ? (
        <Spinner label={m.loading} />
      ) : profile.isError ? (
        <LoadError error={profile.error} onRetry={() => profile.refetch()} />
      ) : subject ? (
        <Navigate to="/$subject" params={{ subject }} replace />
      ) : (guarded.data?.learners.length ?? 0) > 0 ? (
        <Navigate to="/guardian" replace />
      ) : (
        <Welcome />
      )}
    </div>
  );
}
