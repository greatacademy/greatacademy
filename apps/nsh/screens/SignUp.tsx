import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { Image, resource, Storage, signal, Text, View } from "nsh";
import { Link, NavPage } from "nsh/base";

import both from "../assets/who/both.svg";
import children from "../assets/who/children.svg";
import self from "../assets/who/self.svg";

import { type AgeAnswer, signUp } from "../lib/auth.ts";
import { errorText, m } from "../lib/i18n.ts";
import { afterSignUp, nav } from "../lib/nav.ts";
import { API_URL, privacy } from "../lib/rpc.ts";
import { Action, colors, ErrorNote, Field, FormPage, headerStyle, Muted, Quiet, Title } from "../lib/ui.tsx";
import { AgeForm } from "./AgeForm.tsx";
import { Header } from "./Header.tsx";

// Remembers on this device when sign-up last stopped, so that trying again within a day does not change the answer.
// It holds the time only, never an answer.
const STOP_KEY = "ga.sign-up-stopped";

/** STOP_FOR is how long, in milliseconds, a stop keeps a learner's own sign-up from being tried again: a day. */
const STOP_FOR = 24 * 60 * 60 * 1000;

/** stopActive says whether a stop stored as `stored` still holds at `now`; a stored value that is not a time has run out. */
export function stopActive(stored: string | null, now: number): boolean {
  if (stored === null) return false;
  const at = Number(stored);
  return Number.isFinite(at) && at > 1_000_000_000_000 && now - at < STOP_FOR;
}

/** Who is who sign-up is for: the one signing up alone, their children, or both. */
type Who = "self" | "children" | "both";

const WHO_ICONS: Record<Who, typeof self> = { self, children, both };

function WhoChoice(props: { who: Who; title: string; body: string; onPress: () => void }) {
  return (
    <View
      role="button"
      accessibilityLabel={props.title}
      onPress={props.onPress}
      hoverStyle={{ backgroundColor: colors()["accent-soft"] }}
      activeStyle={{ backgroundColor: colors()["accent-soft"] }}
      style={{
        alignItems: "center",
        backgroundColor: colors().surface,
        borderColor: colors().line,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: "row",
        gap: 14,
        padding: 16,
      }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors()["accent-soft"],
          borderRadius: 20,
          height: 40,
          justifyContent: "center",
          width: 40,
        }}
      >
        <Image src={WHO_ICONS[props.who]} style={{ height: 22, tintColor: colors().accent, width: 22 }} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: colors().ink, fontSize: 16, fontWeight: "600" }}>{props.title}</Text>
        <Text style={{ color: colors().muted, fontSize: 14 }}>{props.body}</Text>
      </View>
      <Text style={{ color: colors().muted, fontSize: 18 }}>›</Text>
    </View>
  );
}

function WhoQuestion(props: { onChoose: (who: Who) => void }) {
  return (
    <FormPage>
      <Title>{m().whoTitle}</Title>
      <View style={{ gap: 12 }}>
        <WhoChoice who="self" title={m().whoSelf} body={m().whoSelfBody} onPress={() => props.onChoose("self")} />
        <WhoChoice who="children" title={m().whoChildren} body={m().whoChildrenBody} onPress={() => props.onChoose("children")} />
        <WhoChoice who="both" title={m().whoBoth} body={m().whoBothBody} onPress={() => props.onChoose("both")} />
      </View>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 6, justifyContent: "center" }}>
        <Muted>{m().haveAccount}</Muted>
        <Text role="button" onPress={() => nav.replace({ name: "sign-in" })} style={{ color: colors().accent, fontSize: 14 }}>
          {m().signIn}
        </Text>
      </View>
    </FormPage>
  );
}

function BackLink(props: { onPress: () => void }) {
  return (
    <Text role="button" onPress={props.onPress} style={{ alignSelf: "flex-start", color: colors().accent, fontSize: 15 }}>
      {`‹ ${m().back}`}
    </Text>
  );
}

function Stop(props: { onParent: () => void }) {
  return (
    <FormPage>
      <Title>{m().stopTitle}</Title>
      <Text style={{ color: colors().ink, fontSize: 15 }}>{m().stopBody}</Text>
      <Muted>{m().stopClosed}</Muted>
      <Muted>{m().stopNote}</Muted>
      <Quiet label={m().stopParent} onPress={props.onParent} />
    </FormPage>
  );
}

function AccountForm(props: { age: AgeAnswer; teen: boolean; parent: boolean; onBack: () => void }) {
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
      // A parent or guardian goes on to their learners once the account may study.
      if (props.parent) afterSignUp.set({ name: "learners" });
      // A minor gives no real name.
      await signUp(props.teen ? "Learner" : name().trim(), email(), password(), props.age);
    } catch (e) {
      afterSignUp.set(null);
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  }

  return (
    <FormPage>
      <BackLink onPress={props.onBack} />
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

/**
 * SignUp asks who will learn first. A learner signing up alone answers the age question for themselves and stops below
 * the age, which this device then keeps for a day; a parent or guardian answers it for themselves, must be an adult,
 * and goes on to their learners to add their children.
 */
export function SignUp() {
  const stopStored = resource(async () => ({ stored: await Storage.getItem(STOP_KEY) }));
  const who = signal<Who | null>(null);
  const stopped = signal(false);
  const answer = signal<{ age: AgeAnswer; teen: boolean } | null>(null);
  const parent = () => who() === "children" || who() === "both";
  const stoppedNow = () => stopped() || (who() === "self" && stopActive(stopStored()?.stored ?? null, Date.now()));

  const choose = (next: Who | null) => {
    who.set(next);
    stopped.set(false);
    answer.set(null);
  };

  async function check(age: AgeAnswer) {
    const result = await privacy.checkAge(age);
    // A parent or guardian must be an adult; anyone else stops as a child would.
    if (result.closed || result.band === Band.CHILD || (parent() && result.band !== Band.ADULT)) {
      const now = String(Date.now());
      await Storage.setItem(STOP_KEY, now);
      stopStored.mutate({ stored: now });
      who.set("self");
      stopped.set(true);
      return;
    }
    answer.set({ age, teen: result.band === Band.TEEN });
  }

  return (
    <NavPage headerStyle={headerStyle()} title={m().signUp} header={<Header title={m().signUp} />}>
      <If when={stopStored()}>
        <If when={who()} else={<WhoQuestion onChoose={choose} />}>
          <If when={!stoppedNow()} else={<Stop onParent={() => choose("children")} />}>
            <If
              when={answer()}
              else={
                <FormPage>
                  <BackLink onPress={() => choose(null)} />
                  <AgeForm
                    onAnswer={check}
                    title={parent() ? m().parentAgeTitle : undefined}
                    body={parent() ? m().parentAgeBody : undefined}
                  />
                </FormPage>
              }
            >
              {(chosen) => <AccountForm age={chosen().age} teen={chosen().teen} parent={parent()} onBack={() => answer.set(null)} />}
            </If>
          </If>
        </If>
      </If>
    </NavPage>
  );
}
