import { QueryClient, type QueryKey, QueryObserver, type QueryObserverResult } from "@tanstack/query-core";
import { cleanup, effect, type Resource, type ResourceSource, type ResourceState, signal, untracked } from "nsh";

import { nav } from "./nav.ts";
import { token } from "./session.ts";

/**
 * queryClient keeps what the server answered, as the web app's TanStack Query does: a page shows what it read
 * before at once and reads again in the background once that is 30 seconds old; answers no page has shown for ten
 * minutes are dropped.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 10 * 60_000,
      // `Loaded` offers a retry and reads again when the network or the app comes back.
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const IDLE: QueryKey = ["idle"];

/** QueryInfo is what a query's read is given: aborted when no page wants the answer any more. */
export interface QueryInfo {
  signal: AbortSignal;
}

/**
 * query is `resource` read through `queryClient`: pages that read the same key share one answer, and a page opened
 * again shows its answer at once. With a source it reads while the source has a value, as `resource` does, and
 * keeps its last answer while it has none. `refetch` is a reading the learner asked for, the only one shown as
 * "refreshing"; reads in the background leave the page as it is.
 */
export function query<T>(key: QueryKey, read: (info: QueryInfo) => Promise<T>): Resource<T>;
export function query<S, T>(
  source: ResourceSource<S>,
  key: (source: S) => QueryKey,
  read: (source: S, info: QueryInfo) => Promise<T>,
): Resource<T>;
export function query<S, T>(...args: unknown[]): Resource<T> {
  const [source, keyOf, read] = (
    args.length === 2 ? [true, () => args[0], (_: unknown, info: QueryInfo) => (args[1] as (info: QueryInfo) => Promise<T>)(info)] : args
  ) as [ResourceSource<S>, (source: S) => QueryKey, (source: S, info: QueryInfo) => Promise<T>];
  const current = () => (typeof source === "function" ? (source as () => S | false | null | undefined)() : source);
  let last: S | undefined;
  const options = (value: S | false | null | undefined) => {
    const on = value !== false && value !== null && value !== undefined;
    if (on) last = value;
    const kept = last;
    return {
      queryKey: kept === undefined ? IDLE : keyOf(kept),
      queryFn: ({ signal: abort }: { signal: AbortSignal }) => read(kept as S, { signal: abort }),
      enabled: on,
    };
  };
  const observer = new QueryObserver<T, Error, T, T, QueryKey>(queryClient, options(untracked(current)));
  const result = signal<QueryObserverResult<T, Error>>(observer.getCurrentResult());
  const pulling = signal(false);
  cleanup(observer.subscribe((next) => result.set(next)));
  effect(() => {
    const next = options(current());
    untracked(() => {
      observer.setOptions(next);
      result.set(observer.getCurrentResult());
    });
  });

  const state = (): ResourceState => {
    const r = result();
    if (r.status === "pending") return r.fetchStatus === "idle" ? "unresolved" : "pending";
    if (r.status === "error" && !r.isFetching) return "errored";
    return pulling() && r.isFetching ? "refreshing" : "ready";
  };
  return Object.assign(() => result().data, {
    loading: () => result().isFetching,
    error: () => (result().status === "error" ? result().error : undefined),
    state,
    refetch: () => {
      pulling.set(true);
      void observer.refetch().finally(() => pulling.set(false));
    },
    mutate: (value: T) => {
      queryClient.setQueryData(observer.options.queryKey, value);
      return value;
    },
  }) as Resource<T>;
}

/** markChanged marks every answer as old after the learner changed something, so pages read again when shown. */
export function markChanged(): void {
  void queryClient.invalidateQueries({ refetchType: "none" });
}

/**
 * watchQueries drops every answer when the account changes, and reads again what the pages on the stack show once
 * the learner leaves a task or a page where something changed; nothing is read during a task.
 */
export function watchQueries(): void {
  let seen = untracked(token);
  effect(() => {
    const next = token();
    if (next === seen) return;
    if (seen !== undefined) queryClient.clear();
    seen = next;
  });
  effect(() => {
    if (nav.routes().at(-1)?.name === "session") return;
    untracked(() => void queryClient.refetchQueries({ type: "active", predicate: (q) => q.state.isInvalidated }));
  });
}
