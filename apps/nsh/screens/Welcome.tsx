import { Image, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import logo from "../assets/logo.svg";
import { m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { Action, colors, headerStyle, Quiet } from "../lib/ui.tsx";

/** Welcome is the first page of someone signed out: what the app is, and the ways in. */
export function Welcome() {
  return (
    <NavPage headerStyle={headerStyle()} title="Great Academy" headerVisible={false}>
      <View
        style={{
          backgroundColor: colors().page,
          flex: 1,
          paddingBottom: "calc(env(safe-area-inset-bottom) + 24)",
          paddingHorizontal: 24,
          paddingTop: "calc(env(safe-area-inset-top) + 24)",
        }}
      >
        <View
          style={{ alignItems: "center", alignSelf: "center", flex: 1, gap: 16, justifyContent: "center", maxWidth: 460, width: "100%" }}
        >
          <Image src={logo} accessibilityLabel="Great Academy" style={{ height: 120, marginBottom: 8, width: 120 }} />
          <Text style={{ color: colors().muted, fontSize: 15, textAlign: "center" }}>{m().welcomeEyebrow}</Text>
          <Text style={{ color: colors().ink, fontSize: 30, fontWeight: "700", lineHeight: 38, textAlign: "center" }}>
            {m().welcomeTitle}
          </Text>
          <Text style={{ color: colors().ink, fontSize: 17, lineHeight: 25, textAlign: "center" }}>{m().welcomeBody}</Text>
        </View>
        <View style={{ alignSelf: "center", gap: 12, maxWidth: 460, width: "100%" }}>
          <Action label={m().getStarted} onPress={() => nav.push({ name: "sign-up" })} />
          <Quiet label={m().haveAccountSignIn} onPress={() => nav.push({ name: "sign-in" })} />
          <Text
            role="button"
            onPress={() => nav.push({ name: "courses" })}
            style={{ color: colors().accent, fontSize: 15, paddingVertical: 8, textAlign: "center" }}
          >
            {m().browseCourses}
          </Text>
        </View>
      </View>
    </NavPage>
  );
}
