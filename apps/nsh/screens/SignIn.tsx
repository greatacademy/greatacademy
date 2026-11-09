import { signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { signIn } from "../lib/auth.ts";
import { errorText, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { Action, colors, ErrorNote, Field, FormPage, headerStyle, Muted } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** SignIn starts a session with an email address or a username. */
export function SignIn() {
  const login = signal("");
  const password = signal("");
  const busy = signal(false);
  const error = signal("");

  async function submit() {
    error.set("");
    busy.set(true);
    try {
      await signIn(login(), password());
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  }

  return (
    <NavPage headerStyle={headerStyle()} title={m().signIn} header={<Header title={m().signIn} />}>
      <FormPage>
        <Field
          label={m().emailOrUsername}
          value={login()}
          onChange={(v) => login.set(v)}
          keyboardType="email-address"
          autoComplete="username"
        />
        <Field label={m().password} value={password()} onChange={(v) => password.set(v)} masked autoComplete="current-password" />
        <Text role="button" onPress={() => nav.push({ name: "forgot-password" })} style={{ color: colors().accent, fontSize: 14 }}>
          {m().forgotPassword}
        </Text>
        <If when={error()}>
          <ErrorNote message={error()} />
        </If>
        <Action label={m().signIn} disabled={busy() || !login().trim() || !password()} onPress={submit} />
        <View style={{ alignItems: "center", flexDirection: "row", gap: 6, justifyContent: "center" }}>
          <Muted>{m().noAccount}</Muted>
          <Text role="button" onPress={() => nav.replace({ name: "sign-up" })} style={{ color: colors().accent, fontSize: 14 }}>
            {m().signUp}
          </Text>
        </View>
      </FormPage>
    </NavPage>
  );
}
