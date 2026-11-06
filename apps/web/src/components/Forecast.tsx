import { useI18n } from "../lib/i18n.tsx";

const DAY = 86_400_000;

/** comparePaces are the XP per day a learner can compare, from gentle to intense. */
const comparePaces = [15, 30, 50, 70, 100];

/** Forecast shows when a course may be finished, at the learner's own pace and at others; guardians read it about the learner. */
export function Forecast({
  remaining,
  pace,
  goalPace,
  guardian,
}: {
  remaining: number;
  pace: number;
  goalPace: number;
  guardian?: boolean;
}) {
  const { m, locale } = useI18n();
  const dateAt = (xpPerDay: number) =>
    new Date(Date.now() + Math.ceil(remaining / xpPerDay) * DAY).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  if (remaining <= 0) return <p className="text-sm text-muted">{m.forecastDone}</p>;
  const own = Math.round(pace);
  const goal = Math.round(goalPace);
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">
        {own > 0
          ? (guardian ? m.forecastTheirPace : m.forecastAtPace)(own, dateAt(pace))
          : guardian
            ? m.forecastTheirNoPace
            : m.forecastNoPace}
      </p>
      <p className="text-muted">{m.forecastRemaining(remaining)}</p>
      <details>
        <summary className="cursor-pointer text-accent">{m.forecastCompare}</summary>
        <table className="mt-2 w-full">
          <tbody>
            {goal > 0 && (
              <tr className="font-medium">
                <td className="py-0.5">{(guardian ? m.forecastTheirGoal : m.forecastGoal)(goal)}</td>
                <td className="text-right">{dateAt(goalPace)}</td>
              </tr>
            )}
            {comparePaces.map((p) => (
              <tr key={p}>
                <td className="py-0.5">{m.forecastRow(p)}</td>
                <td className="text-right text-muted">{dateAt(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
