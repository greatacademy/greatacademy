import { appearanceScript } from "@ga/design";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

import { Header } from "../components/Header.tsx";
import { NotFoundNote } from "../components/LoadError.tsx";
import { followOtherTabs } from "../lib/appearance.ts";
import { I18nProvider } from "../lib/i18n.tsx";
import { getLocale } from "../lib/locale.ts";
import { shouldRetry } from "../lib/rpc.ts";
import css from "../styles.css?url";

const descriptions = {
  en: "Adaptive mathematics from first grade to university: start where you are, learn in small steps, and review just before you would forget.",
  zh: "从小学到大学的自适应数学课程：从你现在的水平开始，小步学习，在快要忘记之前复习。",
};

export const Route = createRootRoute({
  loader: () => getLocale(),
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Great Academy" },
      { name: "description", content: loaderData === "zh-CN" ? descriptions.zh : descriptions.en },
      { property: "og:title", content: "Great Academy" },
      { property: "og:description", content: loaderData === "zh-CN" ? descriptions.zh : descriptions.en },
    ],
    links: [
      { rel: "stylesheet", href: css },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
    scripts: [{ children: appearanceScript() }],
  }),
  shellComponent: Shell,
  component: Root,
  notFoundComponent: NotFoundNote,
});

function Shell({ children }: { children: ReactNode }) {
  const locale = Route.useLoaderData();
  return (
    // The head script sets the appearance attributes before React hydrates.
    <html lang={locale} suppressHydrationWarning>
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
  // The landing page runs edge to edge, and / lays out its own width since it may be the landing page.
  // Matches, not the location: the location changes before the next page is ready, and would move the page still shown.
  const bare = useRouterState({ select: (s) => s.matches.some((r) => r.routeId === "/" || r.routeId === "/landing") });
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: shouldRetry, refetchOnWindowFocus: false } } }),
  );
  useEffect(followOtherTabs, []);
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initial={locale}>
        <Header />
        <main className={bare ? "" : "mx-auto max-w-5xl px-4 pt-8 pb-24"}>
          <Outlet />
        </main>
      </I18nProvider>
    </QueryClientProvider>
  );
}
