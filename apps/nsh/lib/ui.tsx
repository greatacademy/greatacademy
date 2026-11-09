import { resolveColors } from "@ga/design";
import {
  Animated,
  type AnimatedNode,
  Canvas,
  cleanup,
  colorScheme,
  computed,
  createAnimatedValue,
  Easing,
  effect,
  Image,
  type ImageAsset,
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
import { Button, Input, Popover, Select, Sheet, Switch } from "nsh/base";

import caretDown from "../assets/caret-down.svg";
import check from "../assets/check.svg";
import eye from "../assets/eye.svg";
import eyeSlash from "../assets/eye-slash.svg";
import logo from "../assets/logo.svg";
import { b } from "./billing-text.ts";
import { language, m } from "./i18n.ts";
import { nav, WELCOME } from "./nav.ts";
import { comeBack, failureOf, online } from "./net.ts";
import { appearance } from "./prefs.ts";
import { setToken } from "./session.ts";
import { canBuy } from "./store.ts";

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

/** Icon is one of the app's monochrome icons, drawn in a color at a size in points. */
export function Icon(props: { src: ImageAsset; size?: number; color?: string }) {
  const size = () => props.size ?? 18;
  return (
    <Image
      accessibilityElementsHidden
      src={props.src}
      style={{ flexShrink: 0, height: size(), tintColor: props.color ?? colors().muted, width: size() }}
    />
  );
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

/** Field is a labelled text input; a masked one has a button at its end that shows or hides what was typed. */
export function Field(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  masked?: boolean;
  hint?: string;
  keyboardType?: "default" | "email-address" | "number-pad";
  autoComplete?: "email" | "username" | "name" | "current-password" | "new-password" | "off";
}) {
  const shown = signal(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500" }}>{props.label}</Text>
      <View>
        <Input
          accessibilityLabel={props.label}
          value={props.value}
          onChange={({ value }) => props.onChange(value)}
          masked={props.masked && !shown()}
          keyboardType={props.keyboardType}
          autoComplete={props.autoComplete}
          autoCapitalize={props.autoComplete === "name" ? "words" : "none"}
          autoCorrect={false}
          style={{ ...fieldStyle(), paddingRight: props.masked ? 44 : 12 }}
        />
        <If when={props.masked}>
          <View
            role="button"
            accessibilityLabel={shown() ? m().hidePassword : m().showPassword}
            tooltip={shown() ? m().hidePassword : m().showPassword}
            onPress={() => shown.set(!shown())}
            hoverStyle={{ backgroundColor: colors()["accent-soft"] }}
            style={{
              alignItems: "center",
              borderRadius: 6,
              bottom: 5,
              justifyContent: "center",
              position: "absolute",
              right: 6,
              top: 5,
              width: 32,
            }}
          >
            <Image src={shown() ? eyeSlash : eye} style={{ height: 20, tintColor: colors().muted, width: 20 }} />
          </View>
        </If>
      </View>
      <If when={props.hint}>
        <Muted>{props.hint}</Muted>
      </If>
    </View>
  );
}

/** ConfirmField asks for a new password again and says so while it differs from the first. */
export function ConfirmField(props: { value: string; password: string; onChange: (value: string) => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Field label={m().confirmPassword} value={props.value} onChange={props.onChange} masked autoComplete="new-password" />
      <If when={props.value !== "" && props.value !== props.password}>
        <Text style={{ color: colors().bad, fontSize: 14 }}>{m().passwordsDiffer}</Text>
      </If>
    </View>
  );
}

/** Chevron is the arrow at the end of a field that opens a list, the same on every such field and on the web. */
function Chevron() {
  return <Image src={caretDown} style={{ height: 12, tintColor: colors().muted, width: 12 }} />;
}

/** pickerStyle is the field that opens a list: the words, then the arrow at the end. */
const pickerStyle = (): ViewStyle => ({
  ...fieldStyle(),
  alignItems: "center",
  flexDirection: "row",
  gap: 8,
  justifyContent: "space-between",
});

/** Choice picks one value from a list, with no default; the list marks the chosen value as the web's does. */
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
        popupStyle={{
          backgroundColor: colors().surface,
          borderColor: colors().line,
          borderRadius: 12,
          borderWidth: 1,
          maxHeight: 360,
          padding: 4,
          paddingBottom: 4 + insets().bottom,
        }}
        backdropStyle={{ backgroundColor: "#00000066" }}
        itemClass={`focus:bg-[${colors()["accent-soft"].slice(0, 7)}]`}
        itemStyle={{ borderRadius: 8, color: colors().ink, fontSize: 15, paddingHorizontal: 12, paddingVertical: 10 }}
        renderItem={(item) => (
          <View style={{ alignItems: "center", flexDirection: "row", gap: 16, justifyContent: "space-between" }}>
            <Text style={{ color: colors().ink, flexShrink: 1, fontSize: 15 }}>{item.title}</Text>
            <If when={item.value === props.value}>
              <Image src={check} style={{ height: 14, tintColor: colors().accent, width: 14 }} />
            </If>
          </View>
        )}
        trigger={
          <View style={pickerStyle()}>
            <Text style={{ color: title() ? colors().ink : colors().muted, flexShrink: 1, fontSize: 16 }}>{title() ?? m().choose}</Text>
            <Chevron />
          </View>
        }
      />
    </View>
  );
}

/** MonthOfYear is a month of a year, the month counted from 1. */
export interface MonthOfYear {
  readonly year: number;
  readonly month: number;
}

/** YEARS_BACK is how many years before this one `MonthField` offers. */
const YEARS_BACK = 100;

function PickCell(props: { title: string; label?: string; chosen: boolean; onPress: () => void }) {
  return (
    <Text
      role="button"
      accessibilityLabel={props.label ?? props.title}
      onPress={props.onPress}
      hoverStyle={props.chosen ? undefined : { backgroundColor: colors()["accent-soft"] }}
      activeStyle={props.chosen ? undefined : { backgroundColor: colors()["accent-soft"] }}
      style={{
        backgroundColor: props.chosen ? colors().accent : "transparent",
        borderRadius: 8,
        color: props.chosen ? "#ffffff" : colors().ink,
        flexBasis: "22%",
        flexGrow: 1,
        fontSize: platform.desktop ? 14 : 16,
        paddingVertical: platform.desktop ? 8 : 12,
        textAlign: "center",
      }}
    >
      {props.title}
    </Text>
  );
}

/** MONTH_POPUP_WIDTH is the least width of the month picker's popup on the desktops, as the web's. */
const MONTH_POPUP_WIDTH = 256;

/**
 * MonthField picks a month of a year, and no day: a field that opens the years, newest first (soonest with `ahead`), then the months of the
 * year picked, in a popup below the field on the desktops and a sheet on phones and tablets. It starts empty and
 * suggests nothing.
 */
export function MonthField(props: {
  label: string;
  value: MonthOfYear | null;
  onChange: (value: MonthOfYear) => void;
  /** ahead offers this year and the next `ahead` years, soonest first, in place of the years before. */
  ahead?: number;
}) {
  const open = signal(false);
  const year = signal<number | null>(null);
  const width = signal(MONTH_POPUP_WIDTH);
  const thisYear = new Date().getFullYear();
  const years = props.ahead
    ? Array.from({ length: props.ahead + 1 }, (_, i) => thisYear + i)
    : Array.from({ length: YEARS_BACK + 1 }, (_, i) => thisYear - i);
  const locale = () => (language() === "zh-CN" ? "zh-CN" : "en");
  const monthName = (month: number, style: "short" | "long") =>
    new Intl.DateTimeFormat(locale(), { month: style, timeZone: "UTC" }).format(Date.UTC(2000, month - 1, 1));
  const title = () =>
    props.value
      ? new Intl.DateTimeFormat(locale(), { month: "long", year: "numeric", timeZone: "UTC" }).format(
          Date.UTC(props.value.year, props.value.month - 1, 1),
        )
      : undefined;
  const setOpen = (next: boolean) => {
    if (next) year.set(null);
    open.set(next);
  };
  const field = (onPress?: () => void) => (
    <View
      role="button"
      accessibilityLabel={props.label}
      accessibilityValue={{ text: title() ?? m().choose }}
      onPress={onPress}
      onLayout={({ bounds }) => width.set(Math.max(MONTH_POPUP_WIDTH, bounds.size.width))}
      style={pickerStyle()}
    >
      <Text style={{ color: title() ? colors().ink : colors().muted, flexShrink: 1, fontSize: 16 }}>{title() ?? m().choose}</Text>
      <Chevron />
    </View>
  );
  const picker = () => (
    <>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 12, minHeight: platform.desktop ? 24 : 32 }}>
        <If when={year()}>
          {(picked) => (
            <Text role="button" onPress={() => year.set(null)} style={{ color: colors().accent, fontSize: platform.desktop ? 14 : 16 }}>
              {`‹ ${picked()}`}
            </Text>
          )}
        </If>
        <Text style={{ color: colors().ink, flex: 1, fontSize: platform.desktop ? 14 : 17, fontWeight: "600" }}>
          {year() === null ? m().pickYear : m().pickMonth}
        </Text>
      </View>
      <If
        when={year()}
        else={
          <Scroll style={{ flexShrink: 1, maxHeight: platform.desktop ? 256 : undefined }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              <Each of={years}>
                {(each) => <PickCell title={String(each())} chosen={props.value?.year === each()} onPress={() => year.set(each())} />}
              </Each>
            </View>
          </Scroll>
        }
      >
        {(picked) => (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            <Each of={Array.from({ length: 12 }, (_, i) => i + 1)}>
              {(month) => (
                <PickCell
                  title={monthName(month(), "short")}
                  label={monthName(month(), "long")}
                  chosen={props.value?.year === picked() && props.value?.month === month()}
                  onPress={() => {
                    props.onChange({ year: picked(), month: month() });
                    open.set(false);
                  }}
                />
              )}
            </Each>
          </View>
        )}
      </If>
    </>
  );
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500" }}>{props.label}</Text>
      <If
        when={platform.desktop}
        else={
          <>
            {field(() => setOpen(true))}
            <Sheet
              open={open()}
              onOpenChange={({ open: next }) => open.set(next)}
              closeOnSwipe
              popupStyle={{
                backgroundColor: colors().page,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                gap: 12,
                maxHeight: "70%",
                padding: 16,
                paddingBottom: 16 + insets().bottom,
              }}
              backdropStyle={{ backgroundColor: "#00000066" }}
            >
              {picker()}
            </Sheet>
          </>
        }
      >
        <Popover
          open={open()}
          onOpenChange={({ open: next }) => setOpen(next)}
          placement="bottom"
          align="start"
          offset={4}
          margin={8}
          popupStyle={{
            backgroundColor: colors().surface,
            borderColor: colors().line,
            borderRadius: 12,
            borderWidth: 1,
            gap: 12,
            padding: 12,
            width: width(),
          }}
          trigger={field()}
        >
          {picker()}
        </Popover>
      </If>
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

/** Toggle is a setting that is on or off, with its label before the switch; it takes effect at once. */
export function Toggle(props: { label: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) {
  return (
    <View style={{ alignItems: "center", flexDirection: "row", gap: 12, minHeight: 44 }}>
      <Text style={{ color: colors().ink, flex: 1, fontSize: 16, opacity: props.disabled ? 0.5 : 1 }}>{props.label}</Text>
      <Switch
        accessibilityLabel={props.label}
        checked={props.checked}
        disabled={props.disabled}
        onChange={({ checked }) => props.onChange(checked)}
        style={{ opacity: props.disabled ? 0.5 : 1 }}
        trackStyle={{
          backgroundColor: props.checked ? colors().accent : colors().line,
          borderRadius: 16,
          height: 31,
          justifyContent: "center",
          paddingHorizontal: 2,
          transitionDuration: 150,
          transitionProperty: "backgroundColor",
          width: 51,
        }}
        thumbStyle={{
          backgroundColor: "#ffffff",
          borderRadius: 13.5,
          boxShadow: [{ x: 0, y: 1, blur: 3, color: "#00000040" }],
          height: 27,
          transitionDuration: 150,
          transitionProperty: "translate",
          translate: [props.checked ? 20 : 0, 0],
          width: 27,
        }}
      />
    </View>
  );
}

/** Saved says a form's change was saved, in the color of success. */
export function Saved() {
  return <Text style={{ color: colors().good, fontSize: 14 }}>{m().saved}</Text>;
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
      <View style={{ alignSelf: "center", gap: 16, maxWidth: 420, padding: 24, paddingBottom: 24 + barSpace(), width: "100%" }}>
        {props.children}
      </View>
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
        : kind() === "plan"
          ? { glyph: "!", title: m().noPlanTitle, body: m().noPlanBody }
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
      <If when={kind() === "plan" && canBuy()}>
        <Quiet label={b().seePlans} onPress={() => nav.push({ name: "plans" })} />
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

/** TOP_BAR is the height of the phones' top bar under the status bar. */
export const TOP_BAR = 52;

/** topSpace is how much of a tab's page the top bar covers, the status bar with it: none on the desktops, which show the page's `header`. */
export const topSpace = computed(() => (platform.desktop ? 0 : insets().top + TOP_BAR));

/** isDark tells whether the page's color is dark, for the status bar's content over it. */
export const isDark = computed(() => {
  const hex = colors().page.slice(1, 7);
  const [r, g, b] = [0, 2, 4].map((at) => Number.parseInt(hex.slice(at, at + 2), 16) / 255);
  return 0.2126 * (r ?? 1) + 0.7152 * (g ?? 1) + 0.0722 * (b ?? 1) < 0.5;
});

/** GLASS_TINT is how much of the page's color Android's glass keeps over the lightly blurred page. */
const GLASS_TINT = "66";

/** ANDROID_BLUR is the blur of Android's glass, light enough that the page under it stays recognizable. */
const ANDROID_BLUR = "blur(6px)";

/**
 * glass is the look of a bar of glass over the page: on iOS the system's Liquid Glass, as its tab bar's (a blur
 * before iOS 26); on Android the page lightly blurred through a tint of its color.
 */
export function glass(): ViewStyle {
  if (platform.os === "ios") return { backdropFilter: "blur(20px)", glassEffect: "regular" };
  return { backdropFilter: ANDROID_BLUR, backgroundColor: `${colors().page.slice(0, 7)}${GLASS_TINT}` };
}

/** FADE_TINT is how much of the page's color the fade below the top bar starts with. */
const FADE_TINT = platform.os === "ios" ? "66" : GLASS_TINT;

/** TOP_FADE is how far below the top bar its tint fades out, as iOS 26's scroll edge effect does. */
const TOP_FADE = 20;

/**
 * TopBar is the head of a tab on a phone, in place of the system header: it reaches up under the status bar, and the
 * page scrolls under it, blurred as iOS 26 blurs a page under its bars, with a fade below the bar rather than a line.
 * `lead` takes the place of the logo and the title, as the subject switcher does on a subject's tabs.
 */
export function TopBar(props: { title: string; lead?: JSX.Element }) {
  return (
    <View
      style={{
        ...glass(),
        ...(platform.os === "android" ? { borderBottomColor: colors().line, borderBottomWidth: 0.5 } : {}),
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        height: topSpace(),
        left: 0,
        paddingHorizontal: 16,
        paddingTop: insets().top,
        position: "absolute",
        right: 0,
        top: 0,
      }}
    >
      <If
        when={props.lead}
        else={
          <>
            <Image src={logo} style={{ height: 28, width: 28 }} accessibilityLabel="Great Academy" />
            {/* biome-ignore lint/a11y/useValidAriaRole: nsh's roles are the platforms', where a heading is "header". */}
            <Text role="header" style={{ color: colors().ink, flex: 1, fontSize: 24, fontWeight: "700" }}>
              {props.title}
            </Text>
          </>
        }
      >
        {(lead) => <View style={{ alignItems: "flex-start", flex: 1, minWidth: 0 }}>{lead()}</View>}
      </If>
      <View
        style={{
          backgroundImage: `linear-gradient(to bottom, ${colors().page.slice(0, 7)}${FADE_TINT}, ${colors().page.slice(0, 7)}00)`,
          height: TOP_FADE,
          left: 0,
          pointerEvents: "none",
          position: "absolute",
          right: 0,
          top: topSpace(),
        }}
      />
    </View>
  );
}

/** PULL is how far a page is pulled before it reads again, and the room its indicator keeps while it reads. */
const PULL = 60;

/** SETTLED is how long, in milliseconds, a fling must have stopped before a drag at the top counts as a pull: a swipe that stops a fling ends it the moment it starts. */
const SETTLED = 150;

/** SHOWN_FOR is how long the indicator spins at least, so a quick read is still seen to happen. */
const SHOWN_FOR = 600;

/** ring is the indicator's ring, the accent its turning part. */
function ring(): ViewStyle {
  return {
    borderColor: colors().line,
    borderRadius: 9,
    borderTopColor: colors().accent,
    borderWidth: 2.5,
    height: 18,
    position: "absolute",
    width: 18,
  };
}

/** PullIndicator is the indicator of a pull, in the palette's accent: a chip that comes in with the pull and spins while the page reads again. */
function PullIndicator(props: { pull: AnimatedNode; refreshing: boolean; shown: boolean; top: number }) {
  const turn = createAnimatedValue(0);
  const spin = Animated.loop(Animated.timing(turn, { toValue: 1, duration: 800, easing: Easing.linear }));
  effect(() => {
    if (props.refreshing && !reduceMotion()) {
      turn.set(0);
      spin.start();
    } else {
      spin.stop();
    }
  });
  cleanup(() => spin.stop());
  return (
    <View
      style={{
        alignItems: "center",
        height: PULL,
        justifyContent: "center",
        left: 0,
        opacity: props.shown ? 1 : 0,
        pointerEvents: "none",
        position: "absolute",
        right: 0,
        top: props.top,
        transitionDuration: 150,
        transitionProperty: "opacity",
      }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors().surface,
          borderColor: colors().line,
          borderRadius: 18,
          borderWidth: 1,
          height: 36,
          justifyContent: "center",
          // The room kept while it reads is a pull too, so the pull alone places the chip.
          opacity: props.pull.interpolate({ inputRange: [0, 20], outputRange: [0, 1], extrapolate: "clamp" }),
          transform: [
            { translateY: props.pull.interpolate({ inputRange: [0, PULL], outputRange: [-24, 0], extrapolate: "clamp" }) },
            { scale: props.pull.interpolate({ inputRange: [0, PULL], outputRange: [0.6, 1], extrapolate: "clamp" }) },
          ],
          width: 36,
        }}
      >
        {/* The ring turns with the pull, and once released spins while the page reads. */}
        <View
          style={{
            ...ring(),
            opacity: props.refreshing ? 0 : 1,
            transform: [{ rotate: props.pull.interpolate({ inputRange: [0, PULL], outputRange: ["0deg", "270deg"] }) }],
          }}
        />
        <View
          style={{
            ...ring(),
            opacity: props.refreshing ? 1 : 0,
            transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }],
          }}
        />
      </View>
    </View>
  );
}

/**
 * PullScroll is a page's scrolling content that a pull from the top reads again. The indicator spins from the pull
 * until the read ends and at least SHOWN_FOR, so the system always hears the refresh start and end. `underBar` is
 * for a tab's page, which starts below the top bar and scrolls under it.
 */
export function PullScroll(props: {
  onRefresh: () => void;
  refreshing: boolean;
  children: JSX.Element;
  bottom?: number;
  underBar?: boolean;
}) {
  const pull = createAnimatedValue(0);
  const spinning = signal(false);
  const held = signal(false);
  // A pull starts with the page at rest at its top: a scroll that runs past the top, and a swipe that catches the page
  // still moving or bouncing from a fling, are not one. The indicator shows only while a pull lasts or the page reads.
  const dragging = signal(false);
  let moving = false;
  let stoppedAt = 0;
  effect(() => {
    if (spinning() && !held() && !props.refreshing) spinning.set(false);
  });
  const top = () => (props.underBar ? topSpace() : 0);
  return (
    <View style={{ flex: 1 }}>
      <Scroll
        style={{ flex: 1 }}
        onScroll={followScroll()}
        onScrollDragStart={(e) => {
          const y = e.offset.y;
          dragging.set(!moving && Date.now() - stoppedAt > SETTLED && y >= -0.5 && y <= 1);
        }}
        onScrollDragEnd={() => dragging.set(false)}
        onMomentumStart={() => {
          moving = true;
        }}
        onMomentumEnd={() => {
          moving = false;
          stoppedAt = Date.now();
        }}
        scrollEventThrottle={16}
        pullValue={pull}
        refreshIndicator={{ height: PULL }}
        refreshing={spinning()}
        onRefresh={() => {
          // Held first: the effect above would end a refresh that is spinning but not yet held.
          held.set(true);
          spinning.set(true);
          setTimeout(() => held.set(false), SHOWN_FOR);
          props.onRefresh();
        }}
      >
        <View
          style={{
            alignSelf: "center",
            gap: 12,
            maxWidth: 960,
            padding: 16,
            paddingBottom: props.bottom ?? 16 + barSpace(),
            paddingTop: 16 + top(),
            width: "100%",
          }}
        >
          {props.children}
        </View>
      </Scroll>
      <PullIndicator pull={pull} refreshing={spinning()} shown={dragging() || spinning()} top={top()} />
    </View>
  );
}

/** OfflineNote floats over the page while the server cannot be reached. */
export function OfflineNote(props: { bottom: number }) {
  return (
    <If when={!online()}>
      {/* A full-width row centers the note: the page lays its children out in a row, so alignSelf would center it vertically. */}
      <View style={{ alignItems: "center", bottom: props.bottom, pointerEvents: "box-none", left: 0, position: "absolute", right: 0 }}>
        <View
          android={{ accessibilityLiveRegion: "polite" }}
          style={{
            alignItems: "center",
            backgroundColor: colors().ink,
            borderRadius: 20,
            flexDirection: "row",
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: colors().page, fontSize: 14 }}>{m().offlineNote}</Text>
        </View>
      </View>
    </If>
  );
}
