import { type Appearance, CONTRASTS, type ColorScheme, PALETTES, type Palette, resolveColors, THEMES } from "@ga/design";
import type { Guardian } from "@ga/proto/account/v1/account_pb";
import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { Clipboard, colorScheme, openUrl, Scroll, signal, Text, View } from "nsh";
import { AlertDialog } from "nsh/base";
import { access, sessionUser, signOut } from "../lib/auth.ts";
import { b } from "../lib/billing-text.ts";
import { errorText, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { appearance, chooseAppearance, chooseLanguage, type LanguageChoice, languageChoice } from "../lib/prefs.ts";
import { dateOf, p } from "../lib/privacy-text.ts";
import { query } from "../lib/query.ts";
import { API_URL, account, learning, timeZone } from "../lib/rpc.ts";
import { canBuy } from "../lib/store.ts";
import { barSpace, colors, ErrorNote, followScroll, Muted, Quiet, Row, Section, Segmented, topSpace } from "../lib/ui.tsx";
import { openAccountPage, settingsQuery } from "./Account.tsx";

function Swatch(props: { palette: Palette; scheme: ColorScheme; chosen: boolean; onPress: () => void }) {
  const look = () => resolveColors({ ...appearance(), theme: props.scheme, [props.scheme]: props.palette } as Appearance, props.scheme);
  return (
    <View
      role="radio"
      accessibilityLabel={m().palettes[props.palette]}
      accessibilityState={{ checked: props.chosen }}
      onPress={props.onPress}
      style={{ alignItems: "center", gap: 4, width: 64 }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: look().page,
          borderColor: props.chosen ? colors().accent : colors().line,
          borderRadius: 22,
          borderWidth: props.chosen ? 3 : 1,
          height: 44,
          justifyContent: "center",
          width: 44,
        }}
      >
        <View style={{ backgroundColor: look().accent, borderRadius: 9, height: 18, width: 18 }} />
      </View>
      <Text style={{ color: props.chosen ? colors().ink : colors().muted, fontSize: 11, textAlign: "center" }}>
        {m().palettes[props.palette]}
      </Text>
    </View>
  );
}

/** InviteGuardian makes a code that lets a parent or teacher follow this learner, and shows it. */
export function InviteGuardian() {
  const made = signal<{ code: string; expiresAt: bigint }>();
  const copied = signal(false);
  const busy = signal(false);
  const error = signal("");
  const invite = async () => {
    busy.set(true);
    error.set("");
    try {
      made.set(await account.createGuardianInvite({}));
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <View style={{ gap: 8 }}>
      <If when={made()} else={<Quiet label={p().inviteGuardian} disabled={busy()} onPress={() => void invite()} />}>
        {(invite) => (
          <View style={{ backgroundColor: colors()["accent-soft"], borderRadius: 12, gap: 4, padding: 12 }}>
            <Text style={{ color: colors().ink, fontSize: 14 }}>{p().inviteCode(dateOf(invite().expiresAt))}</Text>
            <Text
              style={{
                color: colors().ink,
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: "700",
                letterSpacing: 2,
                userSelect: "text",
              }}
            >
              {invite().code}
            </Text>
            <Quiet
              label={copied() ? m().copied : m().copy}
              onPress={() => void Clipboard.writeText(invite().code).then(() => copied.set(true))}
            />
          </View>
        )}
      </If>
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
    </View>
  );
}

/** Me is the Me tab: how the app looks and speaks on this device, privacy, signing out and deleting the account. */
export function Me() {
  const settings = settingsQuery();
  const profile = query(["profile"], ({ signal: abort }) => learning.getProfile({ timeZone: timeZone() }, { signal: abort }));
  const set = (change: Partial<Appearance>) => chooseAppearance({ ...appearance(), ...change });
  const confirmSignOut = async () => {
    const { action } = await AlertDialog.show({
      title: m().signOutTitle,
      actions: [
        { id: "cancel", label: m().cancel, role: "cancel" },
        { id: "out", label: m().signOut, role: "destructive" },
      ],
    });
    if (action === "out") await signOut();
  };
  const removeError = signal("");
  const confirmRemove = async (guardian: Guardian) => {
    const { action } = await AlertDialog.show({
      title: m().removeGuardianTitle(guardian.name),
      actions: [
        { id: "cancel", label: m().cancel, role: "cancel" },
        { id: "remove", label: m().remove, role: "destructive" },
      ],
    });
    if (action !== "remove") return;
    removeError.set("");
    try {
      await account.removeGuardian({ userId: guardian.userId });
      settings.refetch();
    } catch (e) {
      removeError.set(errorText(e));
    }
  };
  return (
    <Scroll
      style={{ backgroundColor: colors().page, flex: 1 }}
      contentStyle={{ paddingTop: topSpace() }}
      onScroll={followScroll()}
      scrollEventThrottle={16}
    >
      <SettingsBody
        profile={sessionUser()?.name}
        course={profile()?.enrollments[0]?.courseId}
        league={settings() ? (settings()?.leagues ? m().leagueOn : m().leagueOff) : undefined}
        guardians={settings()?.guardians}
        removeError={removeError()}
        managed={!!access()?.managed}
        scheme={colorScheme()}
        onAppearance={set}
        onRemoveGuardian={(guardian) => void confirmRemove(guardian)}
        onSignOut={() => void confirmSignOut()}
      />
    </Scroll>
  );
}

/** SettingsBody is the content of the settings page, also shown as the Me tab. */
export function SettingsBody(props: {
  profile?: string;
  goals?: string;
  /** course is the learner's most recent current course, marked when changing course. */
  course?: string;
  league?: string;
  guardians?: readonly Guardian[];
  removeError?: string;
  managed: boolean;
  scheme: ColorScheme;
  onAppearance: (change: Partial<Appearance>) => void;
  onRemoveGuardian: (guardian: Guardian) => void;
  onSignOut: () => void;
}) {
  const child = () => access()?.band === Band.CHILD;
  const themes = THEMES.map((value) => ({ value, title: m().themes[value] }));
  const contrasts = CONTRASTS.map((value) => ({ value, title: m().contrasts[value] }));
  const languages: { value: LanguageChoice; title: string }[] = [
    { value: "system", title: m().languageSystem },
    { value: "en", title: "English" },
    { value: "zh-CN", title: "简体中文" },
  ];
  return (
    <View style={{ alignSelf: "center", gap: 24, maxWidth: 640, padding: 16, paddingBottom: 16 + barSpace(), width: "100%" }}>
      <Section title={m().account}>
        <Row title={m().profile} detail={props.profile} onPress={() => openAccountPage("profile")} />
        <Row title={m().goals} detail={props.goals} onPress={() => openAccountPage("goals")} />
        <Row
          title={m().changeCourse}
          detail={child() ? m().guardianChooses : m().changeCourseBody}
          onPress={() => {
            if (!child()) nav.push({ name: "choose", ...(props.course && { current: props.course }) });
          }}
        />
        <If when={!child()}>
          <Row title={m().league} detail={props.league} onPress={() => openAccountPage("league")} />
        </If>
        <If when={access()?.band === Band.ADULT && canBuy()}>
          <Row title={b().plans} detail={b().plansDetail} onPress={() => nav.push({ name: "plans" })} />
        </If>
      </Section>
      <Section title={m().language}>
        <Segmented label={m().language} items={languages} value={languageChoice()} onChange={chooseLanguage} />
      </Section>
      <Section title={m().appearance}>
        <Segmented label={m().theme} items={themes} value={appearance().theme} onChange={(theme) => props.onAppearance({ theme })} />
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500" }}>
            {props.scheme === "dark" ? m().paletteDark : m().paletteLight}
          </Text>
          <View role="radiogroup" style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Each of={[...PALETTES]}>
              {(palette) => (
                <Swatch
                  palette={palette()}
                  scheme={props.scheme}
                  chosen={appearance()[props.scheme] === palette()}
                  onPress={() => props.onAppearance({ [props.scheme]: palette() })}
                />
              )}
            </Each>
          </View>
          <Muted>{m().paletteBody}</Muted>
        </View>
        <Segmented
          label={m().contrast}
          items={contrasts}
          value={appearance().contrast}
          onChange={(contrast) => props.onAppearance({ contrast })}
        />
      </Section>
      <Section title={m().more}>
        <Row title={m().privacy} detail={m().privacyDetail} onPress={() => nav.push({ name: "privacy" })} />
      </Section>
      <Section title={p().guardian}>
        <Muted>{p().guardiansBody}</Muted>
        <If when={(props.guardians ?? []).length > 0} else={<Muted>{p().noGuardians}</Muted>}>
          <Each of={[...(props.guardians ?? [])]} key={(guardian) => guardian.userId}>
            {(guardian) => (
              <View style={{ alignItems: "center", flexDirection: "row", gap: 12, minHeight: 44 }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: colors().ink, fontSize: 15 }}>{guardian().name}</Text>
                  <If when={guardian().email && !guardian().email.endsWith(".invalid")}>
                    <Muted>{guardian().email}</Muted>
                  </If>
                </View>
                <If when={!child()}>
                  <Text
                    role="button"
                    onPress={() => props.onRemoveGuardian(guardian())}
                    style={{ color: colors().bad, fontSize: 15, paddingVertical: 8 }}
                  >
                    {m().remove}
                  </Text>
                </If>
              </View>
            )}
          </Each>
        </If>
        <If when={props.removeError}>
          <ErrorNote message={props.removeError ?? ""} />
        </If>
        <InviteGuardian />
        <If when={access()?.band === Band.ADULT}>
          <Row title={p().guardedTitle} onPress={() => nav.push({ name: "learners" })} />
        </If>
      </Section>
      <Section title={m().security}>
        <Row title={m().changePassword} detail={m().changePasswordDetail} onPress={() => openAccountPage("password")} />
        <Row title={m().signOut} onPress={props.onSignOut} />
        <If when={!props.managed} else={<Muted>{m().childDelete}</Muted>}>
          <Row title={m().deleteAccount} tone="bad" onPress={() => nav.push({ name: "delete-account" })} />
        </If>
      </Section>
    </View>
  );
}

/** openWeb opens a page of the web app in the browser, for what the app does not do itself. */
export async function openWeb(path: string): Promise<void> {
  await openUrl(`${API_URL}${path}`).catch(() => undefined);
}
