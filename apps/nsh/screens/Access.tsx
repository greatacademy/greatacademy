import { AccessStatus } from "@ga/proto/privacy/v1/privacy_pb";
import { Text } from "nsh";
import { Link, NavPage } from "nsh/base";

import { access, signOut } from "../lib/auth.ts";
import { m } from "../lib/i18n.ts";
import { API_URL } from "../lib/rpc.ts";
import { Action, colors, FormPage, headerStyle, Muted, Title } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** Access explains why study is not available to this account, without losing anything. */
export function Access() {
  const closed = () => access()?.status === AccessStatus.MARKET_CLOSED;
  const title = () => (closed() ? m().closedTitle : m().guardianTitle);
  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />} headerBackVisible={false}>
      <FormPage>
        <Title>{title()}</Title>
        <Muted>{closed() ? m().closedBody : m().guardianBody}</Muted>
        <Link href={`${API_URL}/settings`}>
          <Text style={{ color: colors().accent }}>{m().settingsOnWeb}</Text>
        </Link>
        <Action label={m().signOut} onPress={signOut} />
      </FormPage>
    </NavPage>
  );
}
