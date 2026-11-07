import { Band, type Consent, type ScopeState } from "@ga/proto/privacy/v1/privacy_pb";
import { signal, Text, View } from "nsh";
import { AlertDialog, NavPage } from "nsh/base";
import { access } from "../lib/auth.ts";
import { errorText, m } from "../lib/i18n.ts";
import { dateOf, p } from "../lib/privacy-text.ts";
import { query } from "../lib/query.ts";
import { privacy } from "../lib/rpc.ts";
import { Card, colors, ErrorNote, headerStyle, Loaded, Muted, PullScroll, Quiet, Row, Section, Skeleton } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";
import { openWeb } from "./Settings.tsx";

/** bandName names an age band. */
export function bandName(band: Band): string {
  return band === Band.CHILD ? p().bandChild : band === Band.TEEN ? p().bandTeen : p().bandAdult;
}

/** confirm asks before a step that deletes something, and says whether to go on. */
export async function confirm(title: string, body: string, yes: string): Promise<boolean> {
  const { action } = await AlertDialog.show({
    title,
    description: body,
    actions: [
      { id: "cancel", label: m().cancel, role: "cancel" },
      { id: "yes", label: yes, role: "destructive" },
    ],
  });
  return action === "yes";
}

/** ScopeRow is one purpose on its own: what it does, whether it is on, and its one action. */
export function ScopeRow(props: {
  state: ScopeState;
  consents: readonly Consent[];
  busy: boolean;
  onGrant?: () => void;
  onAssent?: () => void;
  onWithdraw: () => void;
}) {
  const text = () => p().scopes[props.state.scope] ?? { name: props.state.scope, body: "" };
  const current = () => props.consents.find((c) => c.scope === props.state.scope && c.withdrawnAt === 0n);
  const status = () => (props.state.inForce ? p().on : props.state.canGrant || props.state.needsAssent ? p().off : p().notAvailable);
  const withdraw = async () => {
    if (await confirm(p().confirmTurnOff, p().confirmTurnOffBody, p().turnOff)) props.onWithdraw();
  };
  return (
    <View style={{ borderColor: colors().line, borderTopWidth: 1, gap: 6, paddingTop: 12 }}>
      <View style={{ alignItems: "baseline", flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>{text().name}</Text>
        <Text style={{ color: props.state.inForce ? colors().good : colors().muted, fontSize: 14 }}>{`· ${status()}`}</Text>
      </View>
      <Muted>{text().body}</Muted>
      <If when={props.state.inForce ? current() : undefined}>{(consent) => <Muted>{p().expires(dateOf(consent().expiresAt))}</Muted>}</If>
      <If when={props.state.needsAssent && props.onAssent}>
        <Text style={{ color: colors().ink, fontSize: 14 }}>{p().assentNote}</Text>
      </If>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <If when={props.state.needsAssent && props.onAssent}>
          <Quiet label={p().agree} disabled={props.busy} onPress={() => props.onAssent?.()} />
        </If>
        <If
          when={props.state.inForce || props.state.needsAssent}
          else={
            <If when={props.state.canGrant && props.onGrant}>
              <Quiet label={p().turnOn} disabled={props.busy} onPress={() => props.onGrant?.()} />
            </If>
          }
        >
          <Quiet label={p().turnOff} disabled={props.busy} onPress={() => void withdraw()} />
        </If>
      </View>
    </View>
  );
}

/** Privacy is the learner's own privacy page: the age group, each purpose with its consent, and their data. */
export function Privacy() {
  const consents = query(["consents"], ({ signal: abort }) => privacy.listConsents({}, { signal: abort }));
  const busy = signal(false);
  const note = signal("");
  const error = signal("");
  const act = async (run: () => Promise<unknown>, done?: string) => {
    busy.set(true);
    error.set("");
    note.set("");
    try {
      await run();
      if (done) note.set(done);
      consents.refetch();
      access.refetch();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  const clearText = async () => {
    if (!(await confirm(p().confirmDeleteText, p().deleteTextBody, p().deleteText))) return;
    await act(async () => {
      const { deleted } = await privacy.deleteResponses({});
      note.set(p().deleted(deleted));
    });
  };

  return (
    <NavPage headerStyle={headerStyle()} title={p().privacyTitle} header={<Header title={p().privacyTitle} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={consents} skeleton={<Skeleton rows={4} />}>
          {(data) => (
            <PullScroll onRefresh={consents.refetch} refreshing={consents.state() === "refreshing"}>
              <View style={{ gap: 20 }}>
                <Section title={p().ageBand}>
                  <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{bandName(data().band)}</Text>
                  <If when={(access()?.nextBand ?? Band.UNSPECIFIED) !== Band.UNSPECIFIED}>
                    <Muted>{p().bandEnded}</Muted>
                    <Quiet label={p().confirmBand} disabled={busy()} onPress={() => void act(() => privacy.confirmBand({}))} />
                  </If>
                  <If when={(data().dailyMinutes ?? 0) > 0}>
                    <Muted>{`${p().timeLimit}: ${p().minutes(data().dailyMinutes)}`}</Muted>
                  </If>
                </Section>
                <Card>
                  <Muted>{p().aiJudged}</Muted>
                  <Each of={data().scopes.filter((s) => s.scope !== "research")} key={(s) => s.scope}>
                    {(state) => (
                      <ScopeRow
                        state={state()}
                        consents={data().consents}
                        busy={busy()}
                        onGrant={() => void act(() => privacy.grantConsent({ scope: state().scope }))}
                        onAssent={() => void act(() => privacy.assentConsent({ scope: state().scope }))}
                        onWithdraw={() => void act(() => privacy.withdrawConsent({ scope: state().scope }))}
                      />
                    )}
                  </Each>
                  <If when={data().band === Band.CHILD}>
                    <Muted>{p().childNote}</Muted>
                  </If>
                </Card>
                <Section title={p().yourData}>
                  <Row title={p().deleteText} detail={p().deleteTextBody} tone="bad" onPress={() => void clearText()} />
                  <Row title={p().export} onPress={() => void openWeb("/settings")} />
                </Section>
                <If when={note()}>
                  <Text android={{ accessibilityLiveRegion: "polite" }} style={{ color: colors().good, fontSize: 14 }}>
                    {note()}
                  </Text>
                </If>
                <If when={error()}>
                  <ErrorNote message={error()} />
                </If>
                <Section title={m().more}>
                  <Row title={p().legalPrivacy} onPress={() => void openWeb("/legal/privacy")} />
                  <Row title={p().legalChildren} onPress={() => void openWeb("/legal/children")} />
                  <Row title={p().legalRetention} onPress={() => void openWeb("/legal/retention")} />
                </Section>
              </View>
            </PullScroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
