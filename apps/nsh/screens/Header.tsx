import { Image, type JSX, Text, View } from "nsh";

import back from "../assets/caret-left.svg";

import { m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { colors } from "../lib/ui.tsx";

/** Header is a page's header on the desktops and the web; iOS and Android draw their own from the page's title. */
export function Header(props: { title: string; right?: JSX.Element }) {
  return (
    <View
      style={{
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: colors().line,
        backgroundColor: colors().surface,
      }}
    >
      <If when={nav.routes().length > 1}>
        <View
          role="button"
          accessibilityLabel={m().back}
          tooltip={m().back}
          onPress={() => nav.pop()}
          hoverStyle={{ backgroundColor: colors()["accent-soft"] }}
          style={{ alignItems: "center", borderRadius: 8, height: 32, justifyContent: "center", marginLeft: -6, width: 32 }}
        >
          <Image src={back} style={{ height: 18, tintColor: colors().accent, width: 18 }} />
        </View>
      </If>
      <Text style={{ flex: 1, color: colors().ink, fontSize: 17, fontWeight: "600" }}>{props.title}</Text>
      {props.right}
    </View>
  );
}
