import { LeagueOutcome } from "@ga/proto/account/v1/account_pb";
import { Trophy } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { LoadError } from "../components/LoadError.tsx";
import { buttonClass, Card, Spinner } from "../components/ui.tsx";
import { useRequireSession } from "../lib/hooks.ts";
import { useI18n } from "../lib/i18n.tsx";
import { account } from "../lib/rpc.ts";

export const Route = createFileRoute("/league")({ component: League });

function League() {
  const { m, locale } = useI18n();
  const session = useRequireSession();
  const league = useQuery({ queryKey: ["league"], queryFn: () => account.getLeague({}), enabled: !!session, staleTime: 0 });

  if (!session || league.isPending) return <Spinner label={m.loading} />;
  if (league.isError) return <LoadError error={league.error} onRetry={() => league.refetch()} />;
  const l = league.data;
  const ends = new Date(Number(l.endsAt)).toLocaleString(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const size = l.rows.length;
  const last = l.last;
  const tierName = (tier: number) => m.tiers[tier] ?? "";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm text-muted">{m.league}</div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Trophy size={26} weight="duotone" className="text-accent" /> {tierName(l.tier)}
          </h1>
        </div>
        <div className="text-sm text-muted">{m.leagueEnds(ends)}</div>
      </div>

      {!l.enabled && (
        <Card className="space-y-3">
          <p>{m.leagueIntro}</p>
          <p className="text-sm text-muted">{m.leagueOff}</p>
          <Link to="/settings" className={buttonClass("primary")}>
            {m.leagueGoToSettings}
          </Link>
        </Card>
      )}

      {l.enabled && last && last.outcome !== LeagueOutcome.UNSPECIFIED && (
        <p className="text-sm text-muted">
          {last.outcome === LeagueOutcome.PROMOTED
            ? m.leagueLast.promoted(last.rank, tierName(last.tier))
            : last.outcome === LeagueOutcome.DEMOTED
              ? m.leagueLast.demoted(last.rank, tierName(last.tier))
              : m.leagueLast.stayed(last.rank, tierName(last.tier))}{" "}
          {last.missedWeeks > 0 && m.leagueMissed(last.missedWeeks)}
        </p>
      )}

      {l.enabled && size === 0 && <Card className="text-muted">{m.leagueNoXp}</Card>}

      {size > 0 && (
        <Card className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted">
              <tr>
                <th scope="col" className="w-16 px-4 py-3 font-medium">
                  {m.leagueRank}
                </th>
                <th scope="col" className="px-2 py-3 font-medium">
                  {m.leagueLearner}
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  {m.leagueWeekXp}
                </th>
              </tr>
            </thead>
            <tbody>
              {l.rows.map((r) => {
                const up = r.rank <= l.promote;
                const down = r.rank > size - l.demote;
                return (
                  <tr key={r.username} className={`border-t border-line ${r.me ? "bg-accent-soft font-medium" : ""}`}>
                    <td className="px-4 py-2.5">{r.rank}</td>
                    <td className="px-2 py-2.5">
                      <span className="break-all">{r.username}</span>
                      {r.me && <span className="text-muted"> ({m.leagueYou})</span>}
                      {up && <span className="ml-2 text-xs font-normal text-good">{m.leaguePromote}</span>}
                      {down && <span className="ml-2 text-xs font-normal text-warn">{m.leagueDemote}</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right">{r.xp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
