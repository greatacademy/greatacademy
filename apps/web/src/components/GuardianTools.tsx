import { Band } from "@ga/proto/privacy/v1/privacy_pb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

import { useAccess } from "../lib/access.ts";
import { useI18n } from "../lib/i18n.tsx";
import { errorText, usePrivacyText } from "../lib/privacy-text.ts";
import { privacy } from "../lib/rpc.ts";
import { type AgeAnswer, CountrySelect } from "./AgeQuestion.tsx";
import { field } from "./AuthForm.tsx";
import { Button, Card, ErrorNote } from "./ui.tsx";

/** GuardianTools lets an adult verify as a guardian, then add a child's account. */
export function GuardianTools() {
  const { m, locale } = useI18n();
  const t = usePrivacyText();
  const qc = useQueryClient();
  const access = useAccess();
  const adult = access?.band === Band.ADULT;
  const verification = useQuery({ queryKey: ["verification"], queryFn: () => privacy.getVerification({}), enabled: adult, staleTime: 0 });
  const upload = useMutation({
    mutationFn: async (file: File) =>
      privacy.submitVerification({ form: new Uint8Array(await file.arrayBuffer()), contentType: file.type }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["verification"] }),
  });
  const [added, setAdded] = useState(false);
  const add = useMutation({
    mutationFn: (a: AgeAnswer & { username: string; password: string }) => privacy.addChild(a),
    onSuccess: async () => {
      setAdded(true);
      await qc.invalidateQueries({ queryKey: ["guarded"] });
    },
  });
  if (!adult || !verification.data) return null;
  const { status, reason } = verification.data;

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
        username: String(data.get("username")),
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

  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(Date.UTC(2000, i, 1)),
  );
  return (
    <Card className="p-5">
      <form onSubmit={submitChild} className="space-y-3">
        <h2 className="font-semibold">{t.addChildTitle}</h2>
        <p className="text-sm text-good">{t.verifyApproved}</p>
        <p className="text-sm text-muted">{t.addChildBody}</p>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.childUsername}</span>
          <input name="username" required minLength={3} maxLength={20} pattern="[a-z0-9_\-]+" autoComplete="off" className={field} />
          <span className="block text-xs font-normal text-muted">{t.childUsernameHint}</span>
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>{t.childPassword}</span>
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={field} />
        </label>
        <label htmlFor="child-country" className="block space-y-1.5 text-sm font-medium">
          <span>{t.country}</span>
          <CountrySelect id="child-country" name="country" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.birthMonth}</span>
            <select name="month" required defaultValue="" className={field}>
              <option value="" disabled>
                {t.choose}
              </option>
              {months.map((label, i) => (
                <option key={label} value={i + 1}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>{t.birthYear}</span>
            <input name="year" type="number" required min={1900} max={2100} autoComplete="off" className={field} />
          </label>
        </div>
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
