import { type JSX, Text, View } from "nsh";

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
        <Text role="button" onPress={() => nav.pop()} style={{ color: colors().accent }}>
          {m().back}
        </Text>
      </If>
      <Text style={{ flex: 1, color: colors().ink, fontSize: 17, fontWeight: "600" }}>{props.title}</Text>
      {props.right}
    </View>
  );
}
