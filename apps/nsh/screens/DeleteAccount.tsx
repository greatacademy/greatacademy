import { signal, Text } from "nsh";
import { AlertDialog, NavPage } from "nsh/base";

import { deleteAccount } from "../lib/auth.ts";
import { errorText, m } from "../lib/i18n.ts";
import { colors, ErrorNote, Field, FormPage, headerStyle, Muted, Title } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** DeleteAccount deletes the account for good, after its password and a last confirmation. */
export function DeleteAccount() {
  const password = signal("");
  const busy = signal(false);
  const error = signal("");

  async function submit() {
    const { action } = await AlertDialog.show({
      title: m().deleteConfirmTitle,
      description: m().deleteConfirmBody,
      actions: [
        { id: "cancel", label: m().cancel, role: "cancel" },
        { id: "delete", label: m().deleteAccount, role: "destructive" },
      ],
    });
    if (action !== "delete") return;
    busy.set(true);
    error.set("");
    try {
      await deleteAccount(password());
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  }

  return (
    <NavPage headerStyle={headerStyle()} title={m().deleteAccount} header={<Header title={m().deleteAccount} />}>
      <FormPage>
        <Title>{m().deleteAccount}</Title>
        <Muted>{m().deleteBody}</Muted>
        <Field label={m().password} value={password()} onChange={(v) => password.set(v)} masked autoComplete="current-password" />
        <If when={error()}>
          <ErrorNote message={error()} />
        </If>
        <Text
          role="button"
          onPress={() => !busy() && password() && void submit()}
          style={{
            borderColor: colors().bad,
            borderRadius: 8,
            borderWidth: 1,
            color: colors().bad,
            fontWeight: "600",
            opacity: busy() || !password() ? 0.5 : 1,
            paddingVertical: 12,
            textAlign: "center",
          }}
        >
          {m().deleteAccount}
        </Text>
      </FormPage>
    </NavPage>
  );
}
