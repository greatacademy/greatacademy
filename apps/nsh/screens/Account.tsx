import { Text } from "nsh";
import { Link, NavPage } from "nsh/base";

import { signOut } from "../lib/auth.ts";
import { m } from "../lib/i18n.ts";
import { API_URL } from "../lib/rpc.ts";
import { Action, colors, FormPage, headerStyle } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** Account leads to what stays on the web for now, and signs out. */
export function Account() {
  return (
    <NavPage headerStyle={headerStyle()} title={m().account} header={<Header title={m().account} />}>
      <FormPage>
        <Link href={`${API_URL}/settings`}>
          <Text style={{ color: colors().accent }}>{m().settingsOnWeb}</Text>
        </Link>
        <Action label={m().signOut} onPress={signOut} />
      </FormPage>
    </NavPage>
  );
}
