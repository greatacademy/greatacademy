import handler from "@tanstack/react-start/server-entry";

/**
 * API_UPSTREAM is the API server's origin host (apps/server on the cluster), which only Cloudflare reaches. The site's
 * pages and the apps call the API under the site's own /api, so a page's calls need no CORS preflight; in development
 * Vite proxies /api to the server instead.
 */
const API_UPSTREAM = "https://api.greatacademy.dev";

/** API_PREFIX is the part of the site the API serves. */
const API_PREFIX = "/api/";

/**
 * toApi forwards a request to the API server as it came, body streamed, and its answer back as it went, redirects
 * included. The host is in the same zone, so the server still sees the learner's address in CF-Connecting-IP.
 */
function toApi(request: Request, url: URL): Promise<Response> {
  return fetch(new Request(`${API_UPSTREAM}${url.pathname}${url.search}`, request), { redirect: "manual" });
}

/** The Worker: the API under /api/, and TanStack Start for the pages, the static files and the recordings. */
export default {
  fetch(...args: Parameters<typeof handler.fetch>) {
    const [request] = args;
    const url = new URL(request.url);
    if (import.meta.env.PROD && url.pathname.startsWith(API_PREFIX)) return toApi(request, url);
    return handler.fetch(...args);
  },
};
