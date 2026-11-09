import { LeagueOutcome } from "@ga/proto/account/v1/account_pb";
import { Text, View } from "nsh";
import { NavPage } from "nsh/base";
import trophy from "../assets/icons/trophy.svg";
import { momentText } from "../lib/dates.ts";
import { language, m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { account } from "../lib/rpc.ts";
import { Action, Card, colors, headerStyle, Icon, Loaded, Muted, PullScroll, Skeleton } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/**
 * Standings is the League page, laid out as the web's: the tier, when the week ends, how last week went, and every
 * learner of the group by rank with who moves up and who moves down; a learner not taking part is sent to the settings.
 */
export function Standings() {
  const rpc = query(["league"], ({ signal }) => account.getLeague({}, { signal }));
  const tierName = (tier: number) => m().tiers[tier] ?? "";
  return (
    <NavPage headerStyle={headerStyle()} title={m().league} header={<Header title={m().league} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={rpc} skeleton={<Skeleton rows={5} />}>
          {(l) => {
            const ends = () => momentText(new Date(Number(l().endsAt)), language());
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
                <View style={{ alignSelf: "center", gap: 24, maxWidth: 672, width: "100%" }}>
                  <View style={{ alignItems: "flex-end", flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Muted>{m().league}</Muted>
                      <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
                        <Icon src={trophy} size={26} color={colors().accent} />
                        <Text style={{ color: colors().ink, fontSize: 24, fontWeight: "600" }}>{tierName(l().tier)}</Text>
                      </View>
                    </View>
                    <Muted>{m().leagueEnds(ends())}</Muted>
                  </View>
                  <If when={!l().enabled}>
                    <Card>
                      <Text style={{ color: colors().ink, fontSize: 15, lineHeight: 22 }}>{m().leagueIntro}</Text>
                      <Muted>{m().leagueOff}</Muted>
                      <View style={{ alignSelf: "flex-start" }}>
                        <Action label={m().leagueGoToSettings} onPress={() => nav.push({ name: "league" })} />
                      </View>
                    </Card>
                  </If>
                  <If when={l().enabled && lastText()}>
                    <Muted>{lastText()}</Muted>
                  </If>
                  <If when={l().enabled && size() === 0}>
                    <Card>
                      <Muted>{m().leagueNoXp}</Muted>
                    </Card>
                  </If>
                  <If when={size() > 0}>
                    <View
                      style={{
                        backgroundColor: colors().surface,
                        borderColor: colors().line,
                        borderRadius: 16,
                        borderWidth: 1,
                        overflow: "hidden",
                      }}
                    >
                      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12 }}>
                        <Text style={{ color: colors().muted, fontSize: 12, fontWeight: "500", width: 56 }}>{m().leagueRank}</Text>
                        <Text style={{ color: colors().muted, flex: 1, fontSize: 12, fontWeight: "500" }}>{m().leagueLearner}</Text>
                        <Text style={{ color: colors().muted, fontSize: 12, fontWeight: "500" }}>{m().leagueWeekXp}</Text>
                      </View>
                      <Each of={l().rows} key={(r) => r.username}>
                        {(r) => {
                          const up = () => r().rank <= l().promote;
                          const down = () => r().rank > size() - l().demote;
                          const weight = () => (r().me ? "500" : "400");
                          return (
                            <View
                              style={{
                                alignItems: "center",
                                backgroundColor: r().me ? colors()["accent-soft"] : "transparent",
                                borderColor: colors().line,
                                borderTopWidth: 1,
                                flexDirection: "row",
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                              }}
                            >
                              <Text style={{ color: colors().ink, fontSize: 14, fontWeight: weight(), width: 56 }}>{String(r().rank)}</Text>
                              <View style={{ alignItems: "baseline", flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                <Text style={{ color: colors().ink, fontSize: 14, fontWeight: weight() }}>{r().username}</Text>
                                <If when={r().me}>
                                  <Text style={{ color: colors().muted, fontSize: 14, marginLeft: -4 }}>{`(${m().leagueYou})`}</Text>
                                </If>
                                <If when={up() || down()}>
                                  <Text style={{ color: up() ? colors().good : colors().warn, fontSize: 12 }}>
                                    {up() ? m().leaguePromote : m().leagueDemote}
                                  </Text>
                                </If>
                              </View>
                              <Text style={{ color: colors().ink, fontSize: 14, fontWeight: weight() }}>{String(r().xp)}</Text>
                            </View>
                          );
                        }}
                      </Each>
                    </View>
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
