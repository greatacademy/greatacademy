import { Code, ConnectError } from "@connectrpc/connect";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AgeQuestion } from "../components/AgeQuestion.tsx";
import { Card, Spinner } from "../components/ui.tsx";
import { useRequireSession } from "../lib/hooks.ts";
import { useI18n } from "../lib/i18n.tsx";
import { errorText, usePrivacyText } from "../lib/privacy-text.ts";
import { privacy } from "../lib/rpc.ts";

export const Route = createFileRoute("/age")({ component: Age });

/** Age asks an account that has not answered the age question, such as one from before it existed. */
function Age() {
  const { m, locale } = useI18n();
  const t = usePrivacyText();
  const session = useRequireSession();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  if (!session) return <Spinner label={m.loading} />;
  return (
    <Card className="mx-auto mt-6 max-w-sm">
      <h1 className="mb-2 text-2xl font-semibold">{t.ageTitle}</h1>
      <p className="mb-6 text-sm text-muted">{t.ageBody}</p>
      <AgeQuestion
        error={error}
        onAnswer={async (a) => {
          setError(undefined);
          try {
            await privacy.setAge(a);
          } catch (e) {
            // Answered already, as on another device or a page shown from stale access: carry on rather than fail.
            if (!(e instanceof ConnectError && e.code === Code.FailedPrecondition)) {
              setError(errorText(e, locale, m.error));
              return;
            }
          }
          await qc.invalidateQueries({ queryKey: ["access"] });
          await navigate({ to: "/" });
        }}
      />
    </Card>
  );
}
