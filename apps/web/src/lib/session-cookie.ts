import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

/**
 * hasSessionCookie tells on the server whether the visitor holds a session cookie,
 * so that the first render of / is already the landing page or the learner's home.
 * The cookie may have expired; the client confirms it with useSession.
 */
export const hasSessionCookie = createServerFn().handler(
  (): boolean => !!(getCookie("better-auth.session_token") ?? getCookie("__Secure-better-auth.session_token")),
);
