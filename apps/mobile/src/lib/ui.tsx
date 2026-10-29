import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { m } from "./i18n.ts";
import type { RpcState } from "./useRpc.ts";

// The palette of the web app's @theme tokens (apps/web/src/styles.css).
export const colors = { ink: "#1c2333", muted: "#5f6b7d", line: "#e3e7ee", page: "#f6f7fa", surface: "#ffffff", accent: "#3b5bdb" };

/** Loaded renders a call's result, or its spinner or error with a retry. */
export function Loaded<T>({ rpc, children }: { rpc: RpcState<T>; children: (data: T) => ReactNode }) {
  if (rpc.loading) return <ActivityIndicator style={styles.center} color={colors.accent} />;
  if (rpc.error || rpc.data === undefined)
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>{rpc.error?.message}</Text>
        <Pressable onPress={rpc.reload} style={styles.button}>
          <Text style={styles.buttonText}>{m.retry}</Text>
        </Pressable>
      </View>
    );
  return children(rpc.data);
}

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.page },
  list: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  card: { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 12, padding: 16, gap: 6 },
  title: { color: colors.ink, fontSize: 17, fontWeight: "600" },
  heading: { color: colors.ink, fontSize: 15, fontWeight: "600", marginTop: 8 },
  body: { color: colors.ink, fontSize: 15 },
  muted: { color: colors.muted, fontSize: 14 },
  button: { backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  buttonText: { color: "#fff", fontWeight: "600" },
});
