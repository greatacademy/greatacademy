import { computed, signal, View } from "nsh";
import type { AgeAnswer } from "../lib/auth.ts";
import { errorText, m, regionName } from "../lib/i18n.ts";
import { query } from "../lib/query.ts";
import { privacy } from "../lib/rpc.ts";
import { Action, Choice, ErrorNote, MonthField, type MonthOfYear, Muted, Title } from "../lib/ui.tsx";

/** AgeForm asks for the country and month and year of birth, with no default and no hint of why. */
export function AgeForm(props: { onAnswer: (answer: AgeAnswer) => Promise<void> }) {
  const countries = query(["countries"], ({ signal }) => privacy.listCountries({}, { signal }));
  const country = signal<string | null>(null);
  const born = signal<MonthOfYear | null>(null);
  const busy = signal(false);
  const error = signal("");

  const countryItems = computed(() => [
    ...(countries()?.countries ?? [])
      .map((code) => ({ value: code, title: regionName(code) }))
      .sort((a, b) => a.title.localeCompare(b.title)),
    { value: "other", title: m().otherCountry },
  ]);
  const complete = () => country() !== null && born() !== null;

  async function submit() {
    error.set("");
    busy.set(true);
    try {
      await props.onAnswer({ country: country() ?? "", birthYear: born()?.year ?? 0, birthMonth: born()?.month ?? 0 });
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
      <MonthField label={m().birthMonth} value={born()} onChange={(value) => born.set(value)} />
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
      <Action label={m().continue} disabled={busy() || !complete()} onPress={submit} />
    </View>
  );
}
