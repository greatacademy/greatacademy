import { signal, Text } from "nsh";
import { NavPage } from "nsh/base";

import { requestPasswordReset } from "../lib/auth.ts";
import { errorText, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { Action, Card, colors, ErrorNote, Field, FormPage, headerStyle, Muted, Title } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** ForgotPassword sends a link to choose a new password; the link opens on the web, and then the app signs in with it. */
export function ForgotPassword() {
  const email = signal("");
  const busy = signal(false);
  const sent = signal(false);
  const error = signal("");

  async function submit() {
    busy.set(true);
    error.set("");
    try {
      await requestPasswordReset(email());
      sent.set(true);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  }

  return (
    <NavPage headerStyle={headerStyle()} title={m().forgotTitle} header={<Header title={m().forgotTitle} />}>
      <FormPage>
        <If
          when={sent()}
          else={
            <>
              <Muted>{m().forgotBody}</Muted>
              <Field label={m().email} value={email()} onChange={(v) => email.set(v)} keyboardType="email-address" autoComplete="email" />
              <If when={error()}>
                <ErrorNote message={error()} />
              </If>
              <Action label={m().sendLink} disabled={busy() || !email().includes("@")} onPress={() => void submit()} />
            </>
          }
        >
          <Card>
            <Title>{m().checkEmail}</Title>
            <Text style={{ color: colors().ink, fontSize: 15 }}>{m().linkSent}</Text>
          </Card>
        </If>
        <Text role="button" onPress={() => nav.pop()} style={{ color: colors().accent, fontSize: 15, textAlign: "center" }}>
          {m().backToSignIn}
        </Text>
      </FormPage>
    </NavPage>
  );
}
