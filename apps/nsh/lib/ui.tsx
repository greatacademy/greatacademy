import { DEFAULT_APPEARANCE, resolveColors } from "@ga/design";
import { colorScheme, computed, type Resource, Text, View } from "nsh";
import { Button } from "nsh/base";
import type { JSX } from "nsh/jsx-runtime";

import { m } from "./i18n.ts";

/** colors gives the design tokens as hex for the device's color scheme and the default appearance. */
export const colors = computed(() => resolveColors(DEFAULT_APPEARANCE, colorScheme()));

/** Muted is secondary text. */
export function Muted(props: { children: JSX.Element }) {
  return <Text style={{ color: colors().muted, fontSize: 14 }}>{props.children}</Text>;
}

/** Loaded shows a call's result once it has one, and until then its progress or its error with a retry. */
export function Loaded<T extends object>(props: { rpc: Resource<T>; children: (data: () => T) => JSX.Element }) {
  return (
    <If
      when={props.rpc()}
      else={
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <Muted>{props.rpc.error() ? String(props.rpc.error()) : m().loading}</Muted>
          <If when={props.rpc.error()}>
            <Button
              onPress={() => props.rpc.refetch()}
              style={{ backgroundColor: colors().accent, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 }}
            >
              <Text style={{ color: colors()["on-accent"], fontWeight: "600" }}>{m().retry}</Text>
            </Button>
          </If>
        </View>
      }
    >
      {(data) => props.children(data)}
    </If>
  );
}
