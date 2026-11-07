import { resolveColors } from "@ga/design";
import {
  Canvas,
  colorScheme,
  computed,
  effect,
  type JSX,
  platform,
  type Resource,
  reduceMotion,
  Scroll,
  type ScrollEvent,
  safeAreaInsets,
  setTheme,
  signal,
  Text,
  untracked,
  View,
  type ViewStyle,
} from "nsh";
import { Button, Input, Select } from "nsh/base";

import { m } from "./i18n.ts";
import { nav, WELCOME } from "./nav.ts";
import { comeBack, failureOf, online } from "./net.ts";
import { appearance } from "./prefs.ts";
import { setToken } from "./session.ts";

/** colors gives the design tokens as hex for the scheme shown and the appearance chosen on this device. */
export const colors = computed(() => resolveColors(appearance(), colorScheme()));

/**
 * followPalette makes the chosen palette's accent nsh's `primary` in both appearances, which the system's own
 * controls take: the tab bar's selected tab, Android's dialog buttons. It replaces `nsh.json`'s theme, which only sets
 * `primary`.
 */
export function followPalette(): void {
  effect(() => {
    const chosen = { ...appearance(), theme: "system" as const };
    const light = resolveColors(chosen, "light");
    const dark = resolveColors(chosen, "dark");
    setTheme({
      cssVars: {
        light: { primary: light.accent, "primary-foreground": light["on-accent"] },
        dark: { primary: dark.accent, "primary-foreground": dark["on-accent"] },
      },
    });
  });
}

/** headerStyle colors the system header on iOS and Android, which on Android would otherwise stay light in the dark. */
export const headerStyle = computed(() => ({
  backgroundColor: colors().surface,
  color: colors().ink,
  tintColor: colors().accent,
}));

/** tabsShown is true while the system tab bar is on screen, which pages leave room for at their bottom. */
export const tabsShown = signal(false);

const insets = safeAreaInsets();

/** barSpace is the room the system tab bar takes at the bottom of a page, with the safe area under it: none on the desktops. */
export const barSpace = computed(() => {
  if (platform.desktop || !tabsShown()) return 0;
  return (platform.os === "ios" ? 64 : 80) + insets().bottom;
});

/** barsAway is true while the learner scrolls down a page, which slides the tab bar out of sight; scrolling up, reaching the top or leaving the page brings it back. */
export const barsAway = signal(false);

/** BAR_STEP is how far a page scrolls one way before the tab bar follows, so a finger's wobble moves nothing. */
const BAR_STEP = 12;

/** followScroll makes a scroll view's `onScroll` hide the tab bar while its page scrolls down and show it as it scrolls up. Pages that fit on the screen keep it. */
export function followScroll(): (event: ScrollEvent) => void {
  let from = 0;
  return ({ offset, contentSize, size }) => {
    const y = offset.y;
    if (y <= BAR_STEP) {
      barsAway.set(false);
      from = y;
      return;
    }
    // Past the end the page bounces back: that is not the learner scrolling up.
    if (y > contentSize.height - size.height) return;
    if (Math.abs(y - from) < BAR_STEP) return;
    barsAway.set(y > from);
    from = y;
  };
}

/** barStyle places the tab bar at the bottom, sliding it out of sight while `barsAway`, at once when the system asks for less motion. */
export function barStyle(): ViewStyle {
  return {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    transitionDuration: reduceMotion() ? 0 : 250,
    transitionProperty: "translate",
    transitionTimingFunction: "ease-out",
    translate: [0, barsAway() ? barSpace() : 0],
  };
}

/** Ring draws a share (0 to 1) as an arc on a track, around its children. */
export function Ring(props: { share: number; size: number; color: string; children?: JSX.Element }) {
  const width = () => Math.max(6, props.size / 10);
  return (
    <View style={{ alignItems: "center", height: props.size, justifyContent: "center", width: props.size }}>
      <Canvas
        style={{ height: props.size, left: 0, position: "absolute", top: 0, width: props.size }}
        draw={(cx, size) => {
          const r = Math.min(size.width, size.height) / 2 - width() / 2;
          const x = size.width / 2;
          const y = size.height / 2;
          cx.lineWidth = width();
          cx.lineCap = "round";
          cx.strokeStyle = colors().line;
          cx.beginPath();
          cx.arc(x, y, r, 0, Math.PI * 2);
          cx.stroke();
          const share = Math.min(1, Math.max(0, props.share));
          if (share <= 0) return;
          cx.strokeStyle = props.color;
          cx.beginPath();
          cx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + share * Math.PI * 2);
          cx.stroke();
        }}
      />
      {props.children}
    </View>
  );
}

/** Grid lays its `Cell`s out in as many columns as fit: one on a phone, two in a wide window. */
export function Grid(props: { children: JSX.Element }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>{props.children}</View>;
}

/** cellStyle sizes a view as one item of a `Grid`. */
export const cellStyle = { flexBasis: 320, flexGrow: 1, flexShrink: 1, minWidth: 0 } as const;

/** Cell is one item of a `Grid`, at least 320 points wide. */
export function Cell(props: { children: JSX.Element }) {
  return <View style={cellStyle}>{props.children}</View>;
}

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

/** Segmented picks one of a few values, all in view. */
export function Segmented<T extends string>(props: {
  label: string;
  items: { value: T; title: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500" }}>{props.label}</Text>
      <View
        role="radiogroup"
        accessibilityLabel={props.label}
        style={{ backgroundColor: colors().line, borderRadius: 10, flexDirection: "row", gap: 2, padding: 2 }}
      >
        <Each of={props.items}>
          {(item) => (
            <View
              role="radio"
              accessibilityState={{ checked: item().value === props.value }}
              onPress={() => props.onChange(item().value)}
              style={{
                alignItems: "center",
                backgroundColor: item().value === props.value ? colors().surface : "transparent",
                borderRadius: 8,
                flex: 1,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: colors().ink, fontSize: 14, fontWeight: item().value === props.value ? "600" : "400" }}>
                {item().title}
              </Text>
            </View>
          )}
        </Each>
      </View>
    </View>
  );
}

/** Row is a line in a settings list that leads somewhere or does something. */
export function Row(props: { title: string; detail?: string; tone?: "bad"; onPress: () => void }) {
  return (
    <View
      role="button"
      onPress={props.onPress}
      style={{ alignItems: "center", flexDirection: "row", gap: 12, minHeight: 44, paddingVertical: 10 }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: props.tone === "bad" ? colors().bad : colors().ink, fontSize: 16 }}>{props.title}</Text>
        <If when={props.detail}>
          <Muted>{props.detail}</Muted>
        </If>
      </View>
      <Text style={{ color: colors().muted, fontSize: 18 }}>›</Text>
    </View>
  );
}

/** Section is a titled group of a settings page. */
export function Section(props: { title: string; children: JSX.Element }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors().muted, fontSize: 13, fontWeight: "600" }}>{props.title}</Text>
      <View
        style={{ backgroundColor: colors().surface, borderColor: colors().line, borderRadius: 12, borderWidth: 1, gap: 12, padding: 16 }}
      >
        {props.children}
      </View>
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
      onScroll={followScroll()}
      scrollEventThrottle={16}
      refreshing={pulled() && props.refreshing}
      onRefresh={() => {
        pulled.set(true);
        props.onRefresh();
      }}
    >
      <View
        style={{ alignSelf: "center", gap: 12, maxWidth: 960, padding: 16, paddingBottom: props.bottom ?? 16 + barSpace(), width: "100%" }}
      >
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
