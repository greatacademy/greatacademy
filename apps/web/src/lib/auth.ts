import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({ basePath: "/api/auth" });

/** useSession is the signed-in session, or null; isPending until it is known. */
export const useSession = authClient.useSession;
