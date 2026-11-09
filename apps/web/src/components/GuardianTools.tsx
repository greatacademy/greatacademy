import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { useAccess } from "../lib/access.ts";
import { useBillingText } from "../lib/billing-text.ts";
import { useI18n } from "../lib/i18n.tsx";
import { errorText, usePrivacyText } from "../lib/privacy-text.ts";
import { billing, privacy } from "../lib/rpc.ts";
import { type AgeAnswer, CountrySelect, MonthField } from "./AgeQuestion.tsx";
import { field, NewPassword } from "./AuthForm.tsx";
import { Button, buttonClass, Card, ErrorNote } from "./ui.tsx";

/** BuyForChild sends a guardian to buy the plan a new child needs; a card payment verifies them too. */
function BuyForChild({ alternative }: { alternative?: boolean }) {
  const t = useBillingText();
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">{t.buyForChildBody}</p>
      <Link to="/plans" search={{ child: true }} className={buttonClass()}>
        {t.buyForChild}
      </Link>
      {alternative && <p className="pt-2 text-sm text-muted">{t.orForm}</p>}
    </div>
  );
}

/**
 * GuardianTools lets an adult verify as a guardian, then add a child's
 * account. With billing on, each child needs a plan bought first, and a
 * card payment verifies the guardian (docs/billing.md §2, §7).
 */
export function GuardianTools() {
  const { m, locale } = useI18n();
  const t = usePrivacyText();
  const qc = useQueryClient();
  const access = useAccess();
  const adult = access?.band === Band.ADULT;
  const verification = useQuery({ queryKey: ["verification"], queryFn: () => privacy.getVerification({}), enabled: adult, staleTime: 0 });
  const billingOn = access?.billing === true;
  const subs = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => billing.listSubscriptions({}),
    enabled: adult && billingOn,
    staleTime: 0,
  });
  const upload = useMutation({
    mutationFn: async (file: File) =>
      privacy.submitVerification({ form: new Uint8Array(await file.arrayBuffer()), contentType: file.type }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["verification"] }),
  });
  const [added, setAdded] = useState(false);
  const add = useMutation({
    mutationFn: (a: AgeAnswer & { name: string; username: string; password: string }) => privacy.addChild(a),
    onSuccess: async () => {
      setAdded(true);
      await Promise.all([qc.invalidateQueries({ queryKey: ["guarded"] }), qc.invalidateQueries({ queryKey: ["subscriptions"] })]);
    },
  });
  if (!adult || !verification.data || (billingOn && !subs.data)) return null;
  const { status, reason } = verification.data;
  const now = BigInt(Date.now());
  const waiting = subs.data?.subscriptions.some((p) => p.payer && p.learnerId === "" && !p.refunded && p.paidUntil > now) ?? false;

  function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = new FormData(e.currentTarget).get("form");
    if (file instanceof File && file.size > 0) upload.mutate(file);
  }

  function submitChild(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setAdded(false);
    add.mutate(
      {
        name: String(data.get("name")).trim(),
        username: String(data.get("username")).trim(),
        password: String(data.get("password")),
        country: String(data.get("country")),
        birthYear: Number(data.get("year")),
        birthMonth: Number(data.get("month")),
      },
      { onSuccess: () => form.reset() },
    );
  }

  if (status !== "approved")
    return (
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">{t.verifyTitle}</h2>
        {status === "pending" ? (
          <p role="status" className="text-sm">
            {t.verifyPending}
          </p>
        ) : (
          <form onSubmit={submitForm} className="space-y-3">
            {billingOn && <BuyForChild alternative />}
            {status === "refused" && <p className="text-sm text-warn">{t.verifyRefused(reason)}</p>}
            <p className="text-sm text-muted">{t.verifyBody}</p>
            <Link to="/legal/$page" params={{ page: "guardian-form" }} className="block text-sm font-medium text-accent">
              {t.verifyForm}
            </Link>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>{t.verifyFile}</span>
              <input name="form" type="file" required accept="application/pdf,image/png,image/jpeg" className={field} />
            </label>
            {upload.isError && <ErrorNote message={errorText(upload.error, locale, m.error)} />}
            <Button type="submit" disabled={upload.isPending}>
              {t.upload}
            </Button>
          </form>
        )}
      </Card>
    );

  if (billingOn && !waiting && !added)
    return (
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">{t.addChildTitle}</h2>
        <p className="text-sm text-good">{t.verifyApproved}</p>
        <BuyForChild />
      </Card>
    );

  return (
    <Card className="p-5">
      <form onSubmit={submitChild} className="space-y-3">
        <h2 className="font-semibold">{t.addChildTitle}</h2>
        <p className="text-sm text-good">{t.verifyApproved}</p>
        <p className="text-sm text-muted">{t.addChildBody}</p>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.childName}</span>
          <input name="name" required maxLength={100} autoComplete="off" className={field} />
          <span className="block text-xs font-normal text-muted">{t.childNameHint}</span>
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.childUsername}</span>
          <input name="username" required minLength={3} maxLength={20} autoComplete="off" className={field} />
          <span className="block text-xs font-normal text-muted">{t.childUsernameHint}</span>
        </label>
        <NewPassword label={t.childPassword} />
        <CountrySelect label={t.country} name="country" />
        <MonthField />
        {add.isError && <ErrorNote message={errorText(add.error, locale, m.error)} />}
        {added && (
          <p role="status" className="text-sm text-good">
            {t.childAdded}
          </p>
        )}
        <Button type="submit" disabled={add.isPending}>
          {t.addChild}
        </Button>
      </form>
    </Card>
  );
}
