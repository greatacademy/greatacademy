import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { resource, Storage, signal, Text, View } from "nsh";
import { Link, NavPage } from "nsh/base";

import { type AgeAnswer, signUp } from "../lib/auth.ts";
import { errorText, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { API_URL, privacy } from "../lib/rpc.ts";
import { Action, colors, ErrorNote, Field, FormPage, Muted, Title } from "../lib/ui.tsx";
import { AgeForm } from "./AgeForm.tsx";
import { Header } from "./Header.tsx";

// Remembers on this device that sign-up stopped, so that trying again does not change the answer. It holds no answer.
const STOP_KEY = "ga.sign-up-stopped";

function Stop() {
  return (
    <FormPage>
      <Title>{m().stopTitle}</Title>
      <Text style={{ color: colors().ink, fontSize: 15 }}>{m().stopBody}</Text>
      <Muted>{m().stopClosed}</Muted>
      <Muted>{m().stopNote}</Muted>
    </FormPage>
  );
}

function AccountForm(props: { age: AgeAnswer; teen: boolean }) {
  const name = signal("");
  const email = signal("");
  const password = signal("");
  const busy = signal(false);
  const error = signal("");
  const complete = () => (props.teen || name().trim() !== "") && email().includes("@") && password().length >= 8;

  async function submit() {
    error.set("");
    busy.set(true);
    try {
      // A minor gives no real name.
      await signUp(props.teen ? "Learner" : name().trim(), email(), password(), props.age);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  }

  return (
    <FormPage>
      <If when={!props.teen}>
        <Field label={m().name} value={name()} onChange={(v) => name.set(v)} autoComplete="name" />
      </If>
      <Field label={m().email} value={email()} onChange={(v) => email.set(v)} keyboardType="email-address" autoComplete="email" />
      <Field
        label={m().password}
        value={password()}
        onChange={(v) => password.set(v)}
        masked
        autoComplete="new-password"
        hint={m().passwordHint}
      />
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
      <Action label={m().signUp} disabled={busy() || !complete()} onPress={submit} />
      <View style={{ alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
        <Muted>{m().signUpNotice}</Muted>
        <Link href={`${API_URL}/legal/privacy`}>
          <Text style={{ color: colors().accent, fontSize: 14 }}>{m().legalPrivacy}</Text>
        </Link>
      </View>
    </FormPage>
  );
}

/** SignUp asks the age question first, keeps nothing if it stops there, and only then asks for an account. */
export function SignUp() {
  const stoppedBefore = resource(async () => ({ stopped: (await Storage.getItem(STOP_KEY)) !== null }));
  const stopped = signal(false);
  const answer = signal<{ age: AgeAnswer; teen: boolean } | null>(null);

  async function check(age: AgeAnswer) {
    const result = await privacy.checkAge(age);
    if (result.closed || result.band === Band.CHILD) {
      await Storage.setItem(STOP_KEY, "1");
      stopped.set(true);
      return;
    }
    answer.set({ age, teen: result.band === Band.TEEN });
  }

  return (
    <NavPage title={m().signUp} header={<Header title={m().signUp} />}>
      <If when={stoppedBefore()}>
        {(before) => (
          <If when={!before().stopped && !stopped()} else={<Stop />}>
            <If
              when={answer()}
              else={
                <FormPage>
                  <AgeForm onAnswer={check} />
                  <View style={{ alignItems: "center", flexDirection: "row", gap: 6, justifyContent: "center" }}>
                    <Muted>{m().haveAccount}</Muted>
                    <Text role="button" onPress={() => nav.replace({ name: "sign-in" })} style={{ color: colors().accent, fontSize: 14 }}>
                      {m().signIn}
                    </Text>
                  </View>
                </FormPage>
              }
            >
              {(chosen) => <AccountForm age={chosen().age} teen={chosen().teen} />}
            </If>
          </If>
        )}
      </If>
    </NavPage>
  );
}
