/**
 * API_ORIGIN is where the browser calls the API (apps/server): its own host, api.greatacademy.dev, in a build; in
 * development nothing, the page's origin, whose Vite server proxies /api to the local server (vite.config.ts).
 */
export const API_ORIGIN: string = import.meta.env.PROD ? "https://api.greatacademy.dev" : "";
