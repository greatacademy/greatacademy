import { Popover } from "@base-ui/react/popover";
import { Select } from "@base-ui/react/select";
import { CaretDown, Check } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { regionName, usePrivacyText } from "../lib/privacy-text.ts";
import { privacy } from "../lib/rpc.ts";
import { field } from "./AuthForm.tsx";
import { Button, ErrorNote, menuItem, menuPopup } from "./ui.tsx";

/** AgeAnswer is what the age question collects; it is sent to the server, which keeps only the band. */
export interface AgeAnswer {
  readonly country: string;
  readonly birthYear: number;
  readonly birthMonth: number;
}

/** Chevron is the arrow at the right of a field that opens a list, the same on every such field. */
function Chevron() {
  return (
    <span aria-hidden className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 text-muted">
      <CaretDown size={12} weight="bold" />
    </span>
  );
}

/** CountrySelect picks a market or "other", with no default, in a list like the language's that opens below it. */
export function CountrySelect({ id, name, defaultValue }: { id: string; name: string; defaultValue?: string }) {
  const { locale } = useI18n();
  const t = usePrivacyText();
  const countries = useQuery({ queryKey: ["countries"], queryFn: () => privacy.listCountries({}), staleTime: Number.POSITIVE_INFINITY });
  const names = [
    ...(countries.data?.countries ?? [])
      .map((code) => ({ value: code, label: regionName(code, locale) }))
      .sort((a, b) => a.label.localeCompare(b.label, locale)),
    { value: "other", label: t.otherCountry },
  ];
  return (
    <Select.Root modal={false} id={id} name={name} required items={names} defaultValue={defaultValue ?? null}>
      <Select.Trigger className={`${field} relative cursor-default pr-8 text-left font-normal`}>
        <Select.Value placeholder={t.choose} className={(state) => (state.placeholder ? "text-muted" : "")} />
        <Chevron />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner alignItemWithTrigger={false} side="bottom" align="start" sideOffset={4} className="z-30">
          <Select.Popup className={`${menuPopup} !max-h-72 w-[var(--anchor-width)]`}>
            {names.map((n) => (
              <Select.Item key={n.value} value={n.value} className={menuItem}>
                <Select.ItemText>{n.label}</Select.ItemText>
                <Select.ItemIndicator className="flex text-accent">
                  <Check size={14} weight="bold" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

/** YEARS_BACK is how many years before this one `MonthField` offers. */
const YEARS_BACK = 100;

const cell = "rounded-lg py-2 text-center hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent";
const chosenCell = "bg-accent text-white hover:bg-accent";

/**
 * MonthField picks a month of a year, and no day: a field that opens the years, newest first, then the months of the
 * year picked. It starts empty, suggests nothing, and submits `year` and `month` with its form, which it keeps from
 * being sent empty.
 */
export function MonthField() {
  const { locale } = useI18n();
  const t = usePrivacyText();
  const labelId = useId();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const [value, setValue] = useState<{ year: number; month: number } | null>(null);
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: YEARS_BACK + 1 }, (_, i) => thisYear - i);
  const monthName = (month: number, style: "short" | "long") =>
    new Intl.DateTimeFormat(locale, { month: style, timeZone: "UTC" }).format(Date.UTC(2000, month - 1, 1));
  const title = value
    ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(value.year, value.month - 1, 1))
    : undefined;
  return (
    <div className="space-y-1.5 text-sm font-medium">
      <span id={labelId}>{t.birthMonth}</span>
      <div className="relative">
        <Popover.Root
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) setYear(null);
          }}
        >
          <Popover.Trigger aria-labelledby={labelId} className={`${field} relative pr-8 text-left font-normal`}>
            <span className={title ? "" : "text-muted"}>{title ?? t.choose}</span>
            <Chevron />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="bottom" align="start" sideOffset={4} className="z-30">
              <Popover.Popup className="w-[var(--anchor-width)] min-w-64 space-y-3 rounded-xl border border-line bg-surface p-3 text-sm shadow-lg outline-none">
                <div className="flex items-center gap-3">
                  {year !== null && (
                    <button type="button" onClick={() => setYear(null)} className="font-medium text-accent">
                      ‹ {year}
                    </button>
                  )}
                  <Popover.Title className="font-semibold">{year === null ? t.pickYear : t.pickMonth}</Popover.Title>
                </div>
                {year === null ? (
                  <div className="grid max-h-64 grid-cols-4 gap-1 overflow-y-auto">
                    {years.map((y) => (
                      <button key={y} type="button" onClick={() => setYear(y)} className={`${cell} ${value?.year === y ? chosenCell : ""}`}>
                        {y}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <button
                        key={month}
                        type="button"
                        aria-label={monthName(month, "long")}
                        onClick={() => {
                          setValue({ year, month });
                          setOpen(false);
                        }}
                        className={`${cell} ${value?.year === year && value.month === month ? chosenCell : ""}`}
                      >
                        {monthName(month, "short")}
                      </button>
                    ))}
                  </div>
                )}
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        {/* The browser's own check keeps the form from being sent before a month is picked, pointing at the field. */}
        <input
          aria-hidden
          tabIndex={-1}
          required
          name="month"
          value={value?.month ?? ""}
          onChange={() => undefined}
          className="pointer-events-none absolute inset-0 opacity-0"
        />
        <input type="hidden" name="year" value={value?.year ?? ""} />
      </div>
    </div>
  );
}

/** AgeQuestion asks for the country and month and year of birth, with no default and no hint of why. */
export function AgeQuestion({ onAnswer, error }: { onAnswer: (a: AgeAnswer) => Promise<void> | void; error?: string }) {
  const t = usePrivacyText();
  const [busy, setBusy] = useState(false);

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
      <MonthField />
      {error && <ErrorNote message={error} />}
      <Button type="submit" disabled={busy} className="w-full py-2.5">
        {t.continue}
      </Button>
    </form>
  );
}
