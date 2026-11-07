import { DEFAULT_APPEARANCE, resolveColors } from "@ga/design";
import { colorScheme, computed, effect, type JSX, type Resource, Scroll, signal, Text, untracked, View } from "nsh";
import { Button, Input, Select } from "nsh/base";

import { m } from "./i18n.ts";
import { nav, WELCOME } from "./nav.ts";
import { comeBack, failureOf, online } from "./net.ts";
import { setToken } from "./session.ts";

/** colors gives the design tokens as hex for the device's color scheme and the default appearance. */
export const colors = computed(() => resolveColors(DEFAULT_APPEARANCE, colorScheme()));

/** headerStyle colors the system header on iOS and Android, which on Android would otherwise stay light in the dark. */
export const headerStyle = computed(() => ({
  backgroundColor: colors().surface,
  color: colors().ink,
  tintColor: colors().accent,
}));

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

/** Skeleton stands in for content while it loads: blocks the size of what is coming, so the page does not jump. */
export function Skeleton(props: { rows?: number }) {
  return (
    <View accessibilityLabel={m().loading} style={{ gap: 12, padding: 16 }}>
      <View style={{ backgroundColor: colors().line, borderRadius: 6, height: 20, opacity: 0.6, width: "40%" }} />
      <Each of={Array.from({ length: props.rows ?? 3 }, (_, i) => i)}>
        {() => (
          <View
            style={{
              backgroundColor: colors().surface,
              borderColor: colors().line,
              borderRadius: 12,
              borderWidth: 1,
              gap: 10,
              padding: 16,
            }}
          >
            <View style={{ backgroundColor: colors().line, borderRadius: 4, height: 12, opacity: 0.6, width: "30%" }} />
            <View style={{ backgroundColor: colors().line, borderRadius: 4, height: 16, opacity: 0.6, width: "70%" }} />
            <View style={{ backgroundColor: colors().line, borderRadius: 4, height: 12, opacity: 0.6, width: "50%" }} />
          </View>
        )}
      </Each>
    </View>
  );
}

/** Problem says why a page could not load and offers the way out that fits: try again, or sign in again. */
export function Problem(props: { error: unknown; onRetry: () => void }) {
  const kind = () => failureOf(props.error);
  const text = () =>
    kind() === "offline"
      ? { glyph: "↯", title: m().offlineTitle, body: m().offlineBody }
      : kind() === "auth"
        ? { glyph: "→", title: m().authTitle, body: m().authBody }
        : { glyph: "!", title: m().serverTitle, body: m().serverBody };
  const signInAgain = () => {
    setToken(null);
    nav.setRoutes([WELCOME, { name: "sign-in" }]);
  };
  return (
    <View role="alert" style={{ alignItems: "center", flex: 1, gap: 12, justifyContent: "center", padding: 24 }}>
      <View
        style={{
          alignItems: "center",
          backgroundColor: kind() === "offline" ? colors().line : colors()["bad-soft"],
          borderRadius: 28,
          height: 56,
          justifyContent: "center",
          width: 56,
        }}
      >
        <Text style={{ color: kind() === "offline" ? colors().ink : colors().bad, fontSize: 26, fontWeight: "700" }}>{text().glyph}</Text>
      </View>
      <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600", textAlign: "center" }}>{text().title}</Text>
      <Text style={{ color: colors().muted, fontSize: 15, maxWidth: 360, textAlign: "center" }}>{text().body}</Text>
      <If when={kind() === "auth"} else={<Action label={m().retry} onPress={props.onRetry} />}>
        <Action label={m().signInAgain} onPress={signInAgain} />
      </If>
    </View>
  );
}

/** Loaded shows a call's result once it has one, a skeleton until then, or why it failed; it reads again when the app or the connection comes back. */
export function Loaded<T extends object>(props: { rpc: Resource<T>; skeleton?: JSX.Element; children: (data: () => T) => JSX.Element }) {
  let first = true;
  effect(() => {
    comeBack();
    const back = online();
    if (first) {
      first = false;
      return;
    }
    untracked(() => {
      if (back && props.rpc.state() !== "pending") props.rpc.refetch();
    });
  });
  return (
    <If
      when={props.rpc()}
      else={
        <If when={props.rpc.error()} else={props.skeleton ?? <Skeleton />}>
          {(error) => <Problem error={error()} onRetry={() => props.rpc.refetch()} />}
        </If>
      }
    >
      {(data) => props.children(data)}
    </If>
  );
}

/** PullScroll is a page's scrolling content that a pull from the top reads again. */
export function PullScroll(props: { onRefresh: () => void; refreshing: boolean; children: JSX.Element; bottom?: number }) {
  const pulled = signal(false);
  effect(() => {
    if (!props.refreshing) pulled.set(false);
  });
  return (
    <Scroll
      style={{ flex: 1 }}
      refreshing={pulled() && props.refreshing}
      onRefresh={() => {
        pulled.set(true);
        props.onRefresh();
      }}
    >
      <View style={{ alignSelf: "center", gap: 12, maxWidth: 960, padding: 16, paddingBottom: props.bottom ?? 16, width: "100%" }}>
        {props.children}
      </View>
    </Scroll>
  );
}

/** OfflineNote floats over the page while the server cannot be reached. */
export function OfflineNote(props: { bottom: number }) {
  return (
    <If when={!online()}>
      <View
        android={{ accessibilityLiveRegion: "polite" }}
        style={{
          alignItems: "center",
          alignSelf: "center",
          backgroundColor: colors().ink,
          borderRadius: 20,
          bottom: props.bottom,
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 8,
          position: "absolute",
        }}
      >
        <Text style={{ color: colors().page, fontSize: 14 }}>{m().offlineNote}</Text>
      </View>
    </If>
  );
}
