import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { API_ORIGIN } from "./origin.ts";

/** authClient is better-auth's client, on the API's origin with credentials, so that its cookies are kept. */
export const authClient = createAuthClient({
  ...(API_ORIGIN && { baseURL: API_ORIGIN }),
  basePath: "/api/auth",
  fetchOptions: { credentials: "include" },
  plugins: [usernameClient()],
});

/** useSession is the signed-in session, or null; isPending until it is known. */
export const useSession = authClient.useSession;
