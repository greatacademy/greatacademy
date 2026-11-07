import { Code, ConnectError } from "@connectrpc/connect";
import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { type JSX, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { access, changeName, changePassword, sendVerification, sessionUser } from "../lib/auth.ts";
import { errorText, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { markChanged, query } from "../lib/query.ts";
import { account } from "../lib/rpc.ts";
import { Action, colors, ErrorNote, Field, FormPage, headerStyle, Muted, Saved, Skeleton, Title, Toggle } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** SUGGESTED_GOALS is the week a learner without goals starts from: 30 XP on weekdays, the weekend free. */
const SUGGESTED_GOALS = [30, 30, 30, 30, 30, 0, 0];

/** GOAL_STEP is how much one press changes a day's goal by; GOAL_MAX is the largest goal of a day. */
const GOAL_STEP = 5;
const GOAL_MAX = 1000;

/** hasInbox says whether an email address reaches someone: a child signed up by a guardian has a placeholder. */
export function hasInbox(email: string): boolean {
  return !email.endsWith(".invalid");
}

/** settingsQuery reads the account's settings, shared by the Me tab and the pages it opens. */
export function settingsQuery() {
  return query(["settings"], ({ signal: abort }) => account.getSettings({}, { signal: abort }));
}

function Page(props: { title: string; children: JSX.Element }) {
  return (
    <NavPage headerStyle={headerStyle()} title={props.title} header={<Header title={props.title} />}>
      <FormPage>
        <Title>{props.title}</Title>
        {props.children}
      </FormPage>
    </NavPage>
  );
}

function Step(props: { glyph: string; label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Text
      role="button"
      accessibilityLabel={props.label}
      onPress={() => !props.disabled && props.onPress()}
      style={{
        backgroundColor: colors()["accent-soft"],
        borderRadius: 18,
        color: colors().accent,
        fontSize: 20,
        fontWeight: "600",
        height: 36,
        lineHeight: 36,
        opacity: props.disabled ? 0.4 : 1,
        textAlign: "center",
        width: 36,
      }}
    >
      {props.glyph}
    </Text>
  );
}

/** Goals sets how much XP to earn on each weekday, and pauses the goals. */
export function Goals() {
  const settings = settingsQuery();
  const days = signal<number[] | undefined>(undefined);
  const paused = signal<boolean | undefined>(undefined);
  const busy = signal(false);
  const error = signal("");
  const saved = signal(false);
  const week = () => {
    const goals = settings()?.goals;
    return days() ?? (goals && goals.weekdays.length === 7 ? [...goals.weekdays] : SUGGESTED_GOALS);
  };
  const isPaused = () => paused() ?? settings()?.goals?.paused ?? false;
  const change = (day: number, by: number) => {
    const next = [...week()];
    next[day] = Math.min(GOAL_MAX, Math.max(0, (next[day] ?? 0) + by));
    days.set(next);
    saved.set(false);
  };
  const save = async () => {
    busy.set(true);
    error.set("");
    try {
      await account.setGoals({ goals: { weekdays: week(), paused: isPaused() } });
      settings.refetch();
      markChanged();
      saved.set(true);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <Page title={m().goals}>
      <Muted>{m().goalsBody}</Muted>
      <If when={settings()} else={<Skeleton rows={1} />}>
        <View style={{ gap: 4 }}>
          <Each of={m().weekdays.map((_, i) => i)}>
            {(day) => (
              <View style={{ alignItems: "center", flexDirection: "row", gap: 12, minHeight: 48 }}>
                <Text style={{ color: colors().ink, flex: 1, fontSize: 16 }}>{m().weekdays[day()]}</Text>
                <Step
                  glyph="−"
                  label={m().goalLess(m().weekdays[day()] ?? "")}
                  disabled={(week()[day()] ?? 0) <= 0}
                  onPress={() => change(day(), -GOAL_STEP)}
                />
                <Text style={{ color: colors().ink, fontSize: 16, fontVariant: ["tabular-nums"], textAlign: "center", width: 72 }}>
                  {`${week()[day()] ?? 0} XP`}
                </Text>
                <Step
                  glyph="+"
                  label={m().goalMore(m().weekdays[day()] ?? "")}
                  disabled={(week()[day()] ?? 0) >= GOAL_MAX}
                  onPress={() => change(day(), GOAL_STEP)}
                />
              </View>
            )}
          </Each>
        </View>
        <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>
          {m().goalsWeekTotal(week().reduce((sum, xp) => sum + xp, 0))}
        </Text>
        <Toggle
          label={m().goalsPaused}
          checked={isPaused()}
          onChange={(checked) => {
            paused.set(checked);
            saved.set(false);
          }}
        />
        <If when={error()}>
          <ErrorNote message={error()} />
        </If>
        <Action label={m().save} disabled={busy()} onPress={() => void save()} />
        <If when={saved()}>
          <Saved />
        </If>
      </If>
    </Page>
  );
}

/** Profile changes an adult's name and shows the email address, with a way to verify it. */
export function Profile() {
  const name = signal<string | undefined>(undefined);
  const busy = signal(false);
  const error = signal("");
  const saved = signal(false);
  const sent = signal(false);
  const user = () => sessionUser();
  const save = async () => {
    busy.set(true);
    error.set("");
    try {
      await changeName(name() ?? "");
      saved.set(true);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  const verify = async (email: string) => {
    error.set("");
    try {
      await sendVerification(email);
      sent.set(true);
    } catch (e) {
      error.set(errorText(e));
    }
  };
  return (
    <Page title={m().profile}>
      <If when={user()} else={<Skeleton rows={1} />}>
        {(person) => (
          <View style={{ gap: 16 }}>
            <If
              when={access()?.band === Band.ADULT}
              else={
                <View style={{ gap: 4 }}>
                  <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500" }}>{m().name}</Text>
                  <Text style={{ color: colors().ink, fontSize: 16 }}>{person().name}</Text>
                </View>
              }
            >
              <Field
                label={m().name}
                value={name() ?? person().name}
                onChange={(value) => {
                  name.set(value);
                  saved.set(false);
                }}
                autoComplete="name"
              />
              <Action label={m().save} disabled={busy() || !(name() ?? "").trim()} onPress={() => void save()} />
              <If when={saved()}>
                <Saved />
              </If>
            </If>
            <If when={hasInbox(person().email)}>
              <View style={{ gap: 4 }}>
                <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500" }}>{m().email}</Text>
                <Text style={{ color: colors().ink, fontSize: 16, userSelect: "text" }}>{person().email}</Text>
                <If
                  when={person().emailVerified}
                  else={
                    <If when={!sent()} else={<Muted>{m().verificationSent}</Muted>}>
                      <Text style={{ color: colors().warn, fontSize: 14 }}>{m().emailNotVerified}</Text>
                      <Text
                        role="button"
                        onPress={() => void verify(person().email)}
                        style={{ color: colors().accent, fontSize: 15, fontWeight: "600", paddingVertical: 6 }}
                      >
                        {m().resendVerification}
                      </Text>
                    </If>
                  }
                >
                  <Text style={{ color: colors().good, fontSize: 14 }}>{m().emailVerified}</Text>
                </If>
              </View>
            </If>
            <If when={error()}>
              <ErrorNote message={error()} />
            </If>
          </View>
        )}
      </If>
    </Page>
  );
}

/** League chooses the username others see in leagues, and whether the learner takes part. */
export function League() {
  const settings = settingsQuery();
  const username = signal<string | undefined>(undefined);
  const busy = signal(false);
  const error = signal("");
  const saved = signal(false);
  const saveUsername = async () => {
    busy.set(true);
    error.set("");
    try {
      await account.setUsername({ username: (username() ?? "").trim() });
      settings.refetch();
      saved.set(true);
    } catch (e) {
      const code = ConnectError.from(e).code;
      error.set(code === Code.AlreadyExists ? m().usernameTaken : code === Code.InvalidArgument ? m().usernameInvalid : errorText(e));
    } finally {
      busy.set(false);
    }
  };
  const join = async (enabled: boolean) => {
    busy.set(true);
    error.set("");
    try {
      await account.setLeagues({ enabled });
      settings.refetch();
      markChanged();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <Page title={m().league}>
      <Muted>{m().leagueIntro}</Muted>
      <If when={settings()} else={<Skeleton rows={1} />}>
        {(s) => (
          <View style={{ gap: 16 }}>
            <Field
              label={m().username}
              value={username() ?? s().username}
              onChange={(value) => {
                username.set(value);
                saved.set(false);
              }}
              hint={m().usernameHint}
              autoComplete="off"
            />
            <Action
              label={m().save}
              disabled={busy() || (username() ?? s().username).trim().length < 3}
              onPress={() => void saveUsername()}
            />
            <If when={saved()}>
              <Saved />
            </If>
            <Toggle label={m().leagueJoin} checked={s().leagues} disabled={busy() || !s().username} onChange={(on) => void join(on)} />
            <If when={!s().username}>
              <Muted>{m().usernameFirst}</Muted>
            </If>
            <If when={error()}>
              <ErrorNote message={error()} />
            </If>
          </View>
        )}
      </If>
    </Page>
  );
}

/** Password changes the password once the current one is confirmed. */
export function Password() {
  const current = signal("");
  const next = signal("");
  const busy = signal(false);
  const error = signal("");
  const saved = signal(false);
  const save = async () => {
    busy.set(true);
    error.set("");
    saved.set(false);
    try {
      await changePassword(current(), next());
      current.set("");
      next.set("");
      saved.set(true);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <Page title={m().changePassword}>
      <Muted>{m().changePasswordDetail}</Muted>
      <Field label={m().currentPassword} value={current()} onChange={(v) => current.set(v)} masked autoComplete="current-password" />
      <Field
        label={m().newPassword}
        value={next()}
        onChange={(v) => next.set(v)}
        masked
        hint={m().passwordHint}
        autoComplete="new-password"
      />
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
      <Action label={m().changePassword} disabled={busy() || !current() || !next()} onPress={() => void save()} />
      <If when={saved()}>
        <Saved />
      </If>
    </Page>
  );
}

/** openAccountPage opens one of the account's pages from the Me tab. */
export function openAccountPage(name: "goals" | "profile" | "league" | "password"): void {
  nav.push({ name });
}
