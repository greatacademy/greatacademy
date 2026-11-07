import { NavPage } from "nsh/base";

import { access } from "../lib/auth.ts";
import { m } from "../lib/i18n.ts";
import { privacy } from "../lib/rpc.ts";
import { FormPage } from "../lib/ui.tsx";
import { AgeForm } from "./AgeForm.tsx";
import { Header } from "./Header.tsx";

/** Age asks an account that has not answered the age question, such as one from before it existed. */
export function Age() {
  return (
    <NavPage title={m().ageTitle} header={<Header title={m().ageTitle} />} headerBackVisible={false}>
      <FormPage>
        <AgeForm
          onAnswer={async (answer) => {
            await privacy.setAge(answer);
            await access.refetch();
          }}
        />
      </FormPage>
    </NavPage>
  );
}
