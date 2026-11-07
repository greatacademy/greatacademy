import { useQuery } from "@tanstack/react-query";

import { useSession } from "./auth.ts";
import { privacy } from "./rpc.ts";

/** useAccess is what the signed-in person may do now, and undefined when signed out or still loading. */
export function useAccess() {
  const { data: session } = useSession();
  const query = useQuery({ queryKey: ["access"], queryFn: () => privacy.getAccess({}), enabled: !!session, staleTime: 30_000 });
  return session ? query.data : undefined;
}

/** hasInbox tells a real email address from the placeholder of a child's account. */
export const hasInbox = (email: string) => !email.endsWith(".invalid");
