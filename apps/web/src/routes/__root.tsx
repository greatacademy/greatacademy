import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";

import { Header } from "../components/Header.tsx";
import { I18nProvider } from "../lib/i18n.tsx";
import { getLocale } from "../lib/locale.ts";
import css from "../styles.css?url";

export const Route = createRootRoute({
  loader: () => getLocale(),
  staleTime: Number.POSITIVE_INFINITY,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Great Academy" },
      { name: "description", content: "Adaptive mathematics courses with spaced review." },
    ],
    links: [{ rel: "stylesheet", href: css }],
  }),
  shellComponent: Shell,
  component: Root,
});

function Shell({ children }: { children: ReactNode }) {
  const locale = Route.useLoaderData();
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Root() {
  const locale = Route.useLoaderData();
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: 1, refetchOnWindowFocus: false } } }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initial={locale}>
        <Header />
        <main className="mx-auto max-w-5xl px-4 pt-8 pb-24">
          <Outlet />
        </main>
      </I18nProvider>
    </QueryClientProvider>
  );
}
