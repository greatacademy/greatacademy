import { type Appearance, CONTRASTS, type ColorScheme, PALETTES, type Palette, resolveColors, THEMES } from "@ga/design";
import { colorScheme, openUrl, resource, Scroll, Text, View } from "nsh";
import { AlertDialog, NavPage } from "nsh/base";

import { access, signOut } from "../lib/auth.ts";
import { m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { appearance, chooseAppearance, chooseLanguage, type LanguageChoice, languageChoice } from "../lib/prefs.ts";
import { API_URL, account } from "../lib/rpc.ts";
import { colors, headerStyle, Muted, Row, Section, Segmented } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

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

/** Settings is the account's page: how the app looks and speaks on this device, privacy, signing out and deleting the account. */
export function Settings() {
  const settings = resource(({ signal }) => account.getSettings({}, { signal }));
  const scheme = () => colorScheme();
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
    <NavPage headerStyle={headerStyle()} title={m().account} header={<Header title={m().account} />}>
      <Scroll style={{ backgroundColor: colors().page, flex: 1 }}>
        <SettingsBody
          username={settings()?.username}
          managed={!!access()?.managed}
          scheme={scheme()}
          onAppearance={set}
          onSignOut={() => void confirmSignOut()}
        />
      </Scroll>
    </NavPage>
  );
}

/** SettingsBody is the content of the settings page, also shown as the Me tab. */
export function SettingsBody(props: {
  username?: string;
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
    <View style={{ alignSelf: "center", gap: 24, maxWidth: 640, padding: 16, width: "100%" }}>
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
        <Row title={m().privacy} detail={m().privacyDetail} onPress={() => void openWeb("/settings")} />
        <Row title={m().settingsOnWeb} detail={m().settingsOnWebDetail} onPress={() => void openWeb("/settings")} />
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
