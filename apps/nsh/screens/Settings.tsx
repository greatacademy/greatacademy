import { type Appearance, CONTRASTS, type ColorScheme, PALETTES, type Palette, resolveColors, THEMES } from "@ga/design";
import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { Clipboard, colorScheme, openUrl, Scroll, signal, Text, View } from "nsh";
import { AlertDialog } from "nsh/base";
import { access, signOut } from "../lib/auth.ts";
import { errorText, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { appearance, chooseAppearance, chooseLanguage, type LanguageChoice, languageChoice } from "../lib/prefs.ts";
import { dateOf, p } from "../lib/privacy-text.ts";
import { query } from "../lib/query.ts";
import { API_URL, account } from "../lib/rpc.ts";
import { barSpace, colors, ErrorNote, Muted, Quiet, Row, Section, Segmented } from "../lib/ui.tsx";

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
  const settings = query(["settings"], ({ signal }) => account.getSettings({}, { signal }));
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
  return (
    <Scroll style={{ backgroundColor: colors().page, flex: 1 }}>
      <SettingsBody
        username={settings()?.username}
        guardians={settings()?.guardians.map((guardian) => guardian.name)}
        managed={!!access()?.managed}
        scheme={colorScheme()}
        onAppearance={set}
        onSignOut={() => void confirmSignOut()}
      />
    </Scroll>
  );
}

/** SettingsBody is the content of the settings page, also shown as the Me tab. */
export function SettingsBody(props: {
  username?: string;
  guardians?: string[];
  managed: boolean;
  scheme: ColorScheme;
  onAppearance: (change: Partial<Appearance>) => void;
  onSignOut: () => void;
}) {
  const themes = THEMES.map((value) => ({ value, title: m().themes[value] }));
  const contrasts = CONTRASTS.map((value) => ({ value, title: m().contrasts[value] }));
  const languages: { value: LanguageChoice; title: string }[] = [
    { value: "system", title: m().languageSystem },
    { value: "en", title: "English" },
    { value: "zh-CN", title: "简体中文" },
  ];
  return (
    <View style={{ alignSelf: "center", gap: 24, maxWidth: 640, padding: 16, paddingBottom: 16 + barSpace(), width: "100%" }}>
      <If when={props.username}>
        <Section title={m().profile}>
          <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{props.username}</Text>
        </Section>
      </If>
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
        <Row title={m().settingsOnWeb} detail={m().settingsOnWebDetail} onPress={() => void openWeb("/settings")} />
      </Section>
      <Section title={p().guardian}>
        <Muted>{p().guardiansBody}</Muted>
        <If when={(props.guardians ?? []).length > 0} else={<Muted>{p().noGuardians}</Muted>}>
          <Each of={props.guardians ?? []}>{(name) => <Text style={{ color: colors().ink, fontSize: 15 }}>{name()}</Text>}</Each>
        </If>
        <InviteGuardian />
        <If when={access()?.band === Band.ADULT}>
          <Row title={p().guardedTitle} onPress={() => nav.push({ name: "learners" })} />
        </If>
      </Section>
      <Section title={m().account}>
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
