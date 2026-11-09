import { LeagueOutcome } from "@ga/proto/account/v1/account_pb";
import { Text, View } from "nsh";
import { NavPage } from "nsh/base";
import trophy from "../assets/icons/trophy.svg";
import { language, m } from "../lib/i18n.ts";
import { query } from "../lib/query.ts";
import { account } from "../lib/rpc.ts";
import { Card, colors, headerStyle, Icon, Loaded, Muted, PullScroll, Skeleton } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/**
 * Standings is this week's league, as on the web: the tier, when the week ends, how last week went, and every learner
 * of the group by rank with who moves up and who moves down.
 */
export function Standings() {
  const rpc = query(["league"], ({ signal }) => account.getLeague({}, { signal }));
  const tierName = (tier: number) => m().tiers[tier] ?? "";
  return (
    <NavPage headerStyle={headerStyle()} title={m().league} header={<Header title={m().league} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={rpc} skeleton={<Skeleton rows={5} />}>
          {(l) => {
            const ends = () =>
              new Date(Number(l().endsAt)).toLocaleString(language(), {
                weekday: "long",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });
            const size = () => l().rows.length;
            const last = () => l().last;
            const lastText = () => {
              const was = last();
              if (!was || was.outcome === LeagueOutcome.UNSPECIFIED) return "";
              const said =
                was.outcome === LeagueOutcome.PROMOTED
                  ? m().leagueLast.promoted(was.rank, tierName(was.tier))
                  : was.outcome === LeagueOutcome.DEMOTED
                    ? m().leagueLast.demoted(was.rank, tierName(was.tier))
                    : m().leagueLast.stayed(was.rank, tierName(was.tier));
              return was.missedWeeks > 0 ? `${said} ${m().leagueMissed(was.missedWeeks)}` : said;
            };
            return (
              <PullScroll onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"}>
                <View style={{ gap: 16 }}>
                  <View style={{ alignItems: "flex-end", flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                    <View style={{ alignItems: "center", flex: 1, flexDirection: "row", gap: 8 }}>
                      <Icon src={trophy} size={26} color={colors().accent} />
                      <Text style={{ color: colors().ink, fontSize: 24, fontWeight: "700" }}>{tierName(l().tier)}</Text>
                    </View>
                    <Muted>{m().leagueEnds(ends())}</Muted>
                  </View>
                  <If when={l().enabled && lastText()}>
                    <Muted>{lastText()}</Muted>
                  </If>
                  <If when={l().enabled && size() === 0}>
                    <Card>
                      <Muted>{m().leagueNoXp}</Muted>
                    </Card>
                  </If>
                  <If when={size() > 0}>
                    <Card>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <Text style={{ color: colors().muted, fontSize: 12, width: 44 }}>{m().leagueRank}</Text>
                        <Text style={{ color: colors().muted, flex: 1, fontSize: 12 }}>{m().leagueLearner}</Text>
                        <Text style={{ color: colors().muted, fontSize: 12 }}>{m().leagueWeekXp}</Text>
                      </View>
                      <Each of={l().rows} key={(r) => r.username}>
                        {(r) => {
                          const up = () => r().rank <= l().promote;
                          const down = () => r().rank > size() - l().demote;
                          const weight = () => (r().me ? "600" : "400");
                          return (
                            <View
                              style={{
                                alignItems: "center",
                                backgroundColor: r().me ? colors()["accent-soft"] : "transparent",
                                borderColor: colors().line,
                                borderTopWidth: 1,
                                flexDirection: "row",
                                gap: 8,
                                paddingVertical: 8,
                              }}
                            >
                              <Text style={{ color: colors().ink, fontSize: 14, fontWeight: weight(), width: 44 }}>{String(r().rank)}</Text>
                              <Text style={{ color: colors().ink, flex: 1, fontSize: 14, fontWeight: weight() }}>
                                {r().me ? `${r().username} (${m().leagueYou})` : r().username}
                              </Text>
                              <If when={up() || down()}>
                                <Text style={{ color: up() ? colors().good : colors().warn, fontSize: 12 }}>
                                  {up() ? m().leaguePromote : m().leagueDemote}
                                </Text>
                              </If>
                              <Text style={{ color: colors().ink, fontSize: 14, fontWeight: weight() }}>{String(r().xp)}</Text>
                            </View>
                          );
                        }}
                      </Each>
                    </Card>
                  </If>
                </View>
              </PullScroll>
            );
          }}
        </Loaded>
      </View>
    </NavPage>
  );
}
