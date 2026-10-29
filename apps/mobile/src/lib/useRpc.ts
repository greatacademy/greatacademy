import { useCallback, useEffect, useState } from "react";

/** RpcState is the state of one call: loading, failed, or its result. */
export type RpcState<T> = { data?: T; error?: Error; loading: boolean; reload: () => void };

/**
 * useRpc runs a call when the screen mounts. It is a stand-in until the app
 * shares TanStack Query with the web app (roadmap P6).
 */
export function useRpc<T>(call: () => Promise<T>): RpcState<T> {
  const [state, setState] = useState<Omit<RpcState<T>, "reload">>({ loading: true });
  const [attempt, setAttempt] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: the call runs once per attempt, not when its closure changes.
  useEffect(() => {
    let live = true;
    setState({ loading: true });
    call().then(
      (data) => live && setState({ data, loading: false }),
      (error: unknown) => live && setState({ error: error instanceof Error ? error : new Error(String(error)), loading: false }),
    );
    return () => {
      live = false;
    };
  }, [attempt]);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
