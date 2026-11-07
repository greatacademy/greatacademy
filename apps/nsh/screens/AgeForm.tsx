import { computed, signal, View } from "nsh";
import type { AgeAnswer } from "../lib/auth.ts";
import { errorText, m, regionName } from "../lib/i18n.ts";
import { query } from "../lib/query.ts";
import { privacy } from "../lib/rpc.ts";
import { Action, Choice, ErrorNote, Field, Muted, Title } from "../lib/ui.tsx";

/** AgeForm asks for the country and month and year of birth, with no default and no hint of why. */
export function AgeForm(props: { onAnswer: (answer: AgeAnswer) => Promise<void> }) {
  const countries = query(["countries"], ({ signal }) => privacy.listCountries({}, { signal }));
  const country = signal<string | null>(null);
  const month = signal<string | null>(null);
  const year = signal("");
  const busy = signal(false);
  const error = signal("");

  const countryItems = computed(() => [
    ...(countries()?.countries ?? [])
      .map((code) => ({ value: code, title: regionName(code) }))
      .sort((a, b) => a.title.localeCompare(b.title)),
    { value: "other", title: m().otherCountry },
  ]);
  const monthItems = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    title: new Intl.DateTimeFormat(undefined, { month: "long", timeZone: "UTC" }).format(Date.UTC(2000, i, 1)),
  }));
  const complete = () => country() !== null && month() !== null && /^\d{4}$/.test(year());

  async function submit() {
    error.set("");
    busy.set(true);
    try {
      await props.onAnswer({ country: country() ?? "", birthYear: Number(year()), birthMonth: Number(month()) });
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  }

  return (
    <View style={{ gap: 16 }}>
      <Title>{m().ageTitle}</Title>
      <Muted>{m().ageBody}</Muted>
      <Choice label={m().country} items={countryItems()} value={country()} onChange={(value) => country.set(value)} />
      <Choice label={m().birthMonth} items={monthItems} value={month()} onChange={(value) => month.set(value)} />
      <Field label={m().birthYear} value={year()} onChange={(value) => year.set(value)} keyboardType="number-pad" autoComplete="off" />
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
      <Action label={m().continue} disabled={busy() || !complete()} onPress={submit} />
    </View>
  );
}
