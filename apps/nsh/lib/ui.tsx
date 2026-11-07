import { DEFAULT_APPEARANCE, resolveColors } from "@ga/design";
import { colorScheme, computed, type JSX, type Resource, Scroll, Text, View } from "nsh";
import { Button, Input, Select } from "nsh/base";

import { m } from "./i18n.ts";

/** colors gives the design tokens as hex for the device's color scheme and the default appearance. */
export const colors = computed(() => resolveColors(DEFAULT_APPEARANCE, colorScheme()));

/** Muted is secondary text. */
export function Muted(props: { children: JSX.Element }) {
  return <Text style={{ color: colors().muted, fontSize: 14 }}>{props.children}</Text>;
}

/** Title is a form's or a notice's heading. */
export function Title(props: { children: JSX.Element }) {
  return <Text style={{ color: colors().ink, fontSize: 24, fontWeight: "600" }}>{props.children}</Text>;
}

/** Action is the page's main button. */
export function Action(props: { label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Button
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        alignItems: "center",
        backgroundColor: colors().accent,
        borderRadius: 8,
        opacity: props.disabled ? 0.6 : 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: colors()["on-accent"], fontWeight: "600" }}>{props.label}</Text>
    </Button>
  );
}

/** Quiet is a secondary action. */
export function Quiet(props: { label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Button
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        alignItems: "center",
        borderColor: colors().line,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: colors().ink, fontWeight: "500" }}>{props.label}</Text>
    </Button>
  );
}

/** Card is a raised group of content. */
export function Card(props: { children: JSX.Element }) {
  return (
    <View style={{ backgroundColor: colors().surface, borderColor: colors().line, borderRadius: 12, borderWidth: 1, gap: 10, padding: 16 }}>
      {props.children}
    </View>
  );
}

/** ErrorNote says what went wrong with a form. */
export function ErrorNote(props: { message: string }) {
  return (
    <View role="alert" style={{ backgroundColor: colors()["bad-soft"], borderRadius: 8, padding: 12 }}>
      <Text style={{ color: colors().bad, fontSize: 14 }}>{props.message}</Text>
    </View>
  );
}

/** fieldStyle is the look of a text input. */
export const fieldStyle = () => ({
  backgroundColor: colors().surface,
  borderColor: colors().line,
  borderRadius: 8,
  borderWidth: 1,
  color: colors().ink,
  fontSize: 16,
  paddingHorizontal: 12,
  paddingVertical: 10,
});

/** Field is a labelled text input; props beyond these pass to the native field. */
export function Field(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  masked?: boolean;
  hint?: string;
  keyboardType?: "default" | "email-address" | "number-pad";
  autoComplete?: "email" | "username" | "name" | "current-password" | "new-password" | "off";
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500" }}>{props.label}</Text>
      <Input
        accessibilityLabel={props.label}
        value={props.value}
        onChange={({ value }) => props.onChange(value)}
        masked={props.masked}
        keyboardType={props.keyboardType}
        autoComplete={props.autoComplete}
        autoCapitalize={props.autoComplete === "name" ? "words" : "none"}
        autoCorrect={false}
        style={fieldStyle()}
      />
      <If when={props.hint}>
        <Muted>{props.hint}</Muted>
      </If>
    </View>
  );
}

/** Choice picks one value from a list, with no default. */
export function Choice(props: {
  label: string;
  items: { value: string; title: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const title = () => props.items.find((item) => item.value === props.value)?.title;
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500" }}>{props.label}</Text>
      <Select
        items={props.items}
        value={props.value}
        onChange={({ value }) => props.onChange(value)}
        accessibilityLabel={props.label}
        offset={4}
        popupStyle={{ backgroundColor: colors().surface, borderColor: colors().line, borderRadius: 8, borderWidth: 1, padding: 4 }}
        itemStyle={{ borderRadius: 6, color: colors().ink, paddingHorizontal: 8, paddingVertical: 8 }}
        trigger={
          <View style={{ ...fieldStyle(), flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: title() ? colors().ink : colors().muted, fontSize: 16 }}>{title() ?? m().choose}</Text>
            <Text style={{ color: colors().muted }}>▾</Text>
          </View>
        }
      />
    </View>
  );
}

/** FormPage is a scrolling, narrow column that keeps its fields clear of the keyboard. */
export function FormPage(props: { children: JSX.Element }) {
  return (
    <Scroll style={{ flex: 1, backgroundColor: colors().page }} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
      <View style={{ alignSelf: "center", gap: 16, maxWidth: 420, padding: 24, width: "100%" }}>{props.children}</View>
    </Scroll>
  );
}

/** Loaded shows a call's result once it has one, and until then its progress or its error with a retry. */
export function Loaded<T extends object>(props: { rpc: Resource<T>; children: (data: () => T) => JSX.Element }) {
  return (
    <If
      when={props.rpc()}
      else={
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <Muted>{props.rpc.error() ? m().error : m().loading}</Muted>
          <If when={props.rpc.error()}>
            <Action label={m().retry} onPress={() => props.rpc.refetch()} />
          </If>
        </View>
      }
    >
      {(data) => props.children(data)}
    </If>
  );
}
