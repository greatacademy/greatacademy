import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { regionName, usePrivacyText } from "../lib/privacy-text.ts";
import { privacy } from "../lib/rpc.ts";
import { field } from "./AuthForm.tsx";
import { Button, ErrorNote } from "./ui.tsx";

/** AgeAnswer is what the age question collects; it is sent to the server, which keeps only the band. */
export interface AgeAnswer {
  readonly country: string;
  readonly birthYear: number;
  readonly birthMonth: number;
}

/** CountrySelect picks a market or "other", with no default. */
export function CountrySelect({ id, name, defaultValue = "" }: { id: string; name: string; defaultValue?: string }) {
  const { locale } = useI18n();
  const t = usePrivacyText();
  const countries = useQuery({ queryKey: ["countries"], queryFn: () => privacy.listCountries({}), staleTime: Number.POSITIVE_INFINITY });
  const names = (countries.data?.countries ?? [])
    .map((code) => ({ code, label: regionName(code, locale) }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
  return (
    <select key={names.length} id={id} name={name} required defaultValue={defaultValue} className={field}>
      <option value="" disabled>
        {t.choose}
      </option>
      {names.map((n) => (
        <option key={n.code} value={n.code}>
          {n.label}
        </option>
      ))}
      <option value="other">{t.otherCountry}</option>
    </select>
  );
}

/** AgeQuestion asks for the country and month and year of birth, with no default and no hint of why. */
export function AgeQuestion({ onAnswer, error }: { onAnswer: (a: AgeAnswer) => Promise<void> | void; error?: string }) {
  const { locale } = useI18n();
  const t = usePrivacyText();
  const [busy, setBusy] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(Date.UTC(2000, i, 1)),
  );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await onAnswer({ country: String(form.get("country")), birthYear: Number(form.get("year")), birthMonth: Number(form.get("month")) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label htmlFor="age-country" className="block space-y-1.5 text-sm font-medium">
        <span>{t.country}</span>
        <CountrySelect id="age-country" name="country" />
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
          <input name="year" type="number" inputMode="numeric" required min={1900} max={2100} autoComplete="off" className={field} />
        </label>
      </div>
      {error && <ErrorNote message={error} />}
      <Button type="submit" disabled={busy} className="w-full py-2.5">
        {t.continue}
      </Button>
    </form>
  );
}
