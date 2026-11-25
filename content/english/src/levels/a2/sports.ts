// A2, unit 5: Sports and Games. Sports, competition, movement, games and how we do things; adverbs of manner and
// could; a past event judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { combos, fill, judgedTopic } from "./kit.ts";

const sports = vocabularyTopic({
  id: "a2-words-sports",
  title: t("Sports", "体育运动"),
  summary: t(
    "Tennis, volleyball, badminton, ping-pong and baseball; skating and skiing; races, matches, players, coaches and scores.",
    "网球、排球、羽毛球、乒乓球和棒球；滑冰和滑雪；比赛、选手、教练和比分。",
  ),
  intro: t(
    "At the sports center, some children play **tennis** and **badminton**, a team plays **volleyball**, and the **coach** writes the **score** on the board. These words help you name sports and talk about games and races.",
    "在体育中心，一些孩子在打 **tennis**（网球）和 **badminton**（羽毛球），一支队在打 **volleyball**（排球），**coach**（教练）把 **score**（比分）写在板上。这些词帮你说出体育项目，谈论比赛和赛跑。",
  ),
  prerequisites: ["a1-words-sports-and-music"],
  words: [
    word(
      "tennis",
      "a game where two or four players hit a ball over a net with rackets",
      "网球",
      "Let's play {tennis}. I have two rackets and some yellow balls. | Wimbledon in London is the most famous {tennis} competition, played on grass. | She hit the yellow {tennis} ball over the net with her racket.",
      "badminton ping-pong",
    ),
    word(
      "volleyball",
      "a game where two teams hit a big ball over a high net with their hands",
      "排球",
      "We play {volleyball} on the beach, two teams hitting a big ball with their hands. | A {volleyball} team has six players on the court. | Jump high and hit the big {volleyball} over the net with your hands!",
      "tennis badminton",
    ),
    word(
      "badminton",
      "a game where players hit a light thing with feathers over a net",
      "羽毛球",
      "{Badminton}, with its light shuttlecock, is very popular in China and Indonesia.|Tennis Volleyball | You hit a shuttlecock, not a ball, in {badminton}. | We played {badminton} in the park, but the wind blew the light shuttlecock away.",
      "tennis volleyball",
    ),
    word(
      "ping-pong",
      "a game where players hit a small light ball over a net on a table",
      "乒乓球",
      "We play {ping-pong} on a green table. | A {ping-pong} ball is small, white and very light, and it bounces on a table. | China has many {ping-pong} champions, the best players at the table.",
      "tennis badminton",
    ),
    word(
      "baseball",
      "an American game where players hit a ball with a bat and run around four bases",
      "棒球",
      "In {baseball}, you hit the ball with a bat and run around four bases. | He wears the cap of his {baseball} team, which plays with bats and four bases. | {Baseball}, with its bats and four bases, is very popular in Japan and the US.|Tennis Ping-pong",
      "tennis ping-pong",
    ),
    word(
      "skate skates skated skating",
      "to move over ice or the ground on special shoes with blades or wheels",
      "滑冰；溜冰",
      "We went {skating} on the frozen lake in shoes with blades.|skiing racing | Can you {skate} backwards on the ice rink? | My new {skates} have pink wheels.|skis races",
      "ski race",
    ),
    word(
      "ski skis skied skiing",
      "to move over snow on two long narrow boards",
      "滑雪",
      "We go {skiing} on two long boards down the snowy mountains every winter.|skating racing | I {skied} down the snowy hill on my new boards and fell.|skated raced | You need a lot of snow to {ski}.",
      "skate race",
    ),
    word(
      "race races",
      "a competition to see who is the fastest",
      "赛跑；比赛",
      "Who won the {race}? — Anna. She was the fastest. | The horse {race} starts at two o'clock. | I came last in the {race}, but I finished it.",
      "match score",
    ),
    word(
      "match matches",
      "a game between two players or two teams",
      "比赛",
      "Our team won the football {match} 3 to 1. | Did you watch the tennis {match} on TV? | The football {match} between our two teams was canceled because of the rain.",
      "race score",
    ),
    word(
      "player players",
      "a person who plays a game or a sport",
      "选手；运动员",
      "There are eleven {players} in a football team.|coaches fans | Messi is a famous football {player} who has scored hundreds of goals. | Each {player} on the field has a number on her shirt.",
      "coach fan",
    ),
    word(
      "coach coaches",
      "a person who trains a team or a player",
      "教练",
      'Our {coach} makes us run ten laps before every game. | The {coach} shouted to the players from the side, "Pass the ball!" | She is a swimming {coach} at the sports center.',
      "player fan",
    ),
    word(
      "score scores scored scoring",
      "to win a point or a goal; the number of points in a game",
      "得分；比分",
      "What's the {score}? — It's 2 to 2. | She {scored} two goals in the first half.|won cheered | The final {score} was 21 to 15.",
      "point goal",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Race* and *match* are both competitions: in a *race*, everyone tries to be the fastest, and in a *match*, two players or two teams play against each other. Look for *fastest* or *came last*, or for a score like *3 to 1*.",
        "*race* 和 *match* 都是比赛：*race* 是大家比谁最快，*match* 是两名选手或两支队伍对抗。找找句子里有没有 *fastest*、*came last*，或者 *3 to 1* 这样的比分。",
      ),
      meaning: t(
        "*Player* and *coach* both belong to a team, but the *player* plays in the game, and the *coach* trains the team and tells the players what to do from the side.",
        "*player* 和 *coach* 都属于一支队伍，但 *player* 上场比赛，*coach* 训练队伍，在场边告诉队员怎么做。",
      ),
      spell: t(
        "*Ski* keeps its i before -ing: *skiing* has a double i. *Skate* drops its e: *skating*. *Ping-pong* has a hyphen.",
        "*ski* 加 -ing 时保留 i：*skiing* 有两个 i。*skate* 去掉 e：*skating*。*ping-pong* 中间有连字符。",
      ),
    },
    notes: `
      tennis|two rackets and some yellow balls;Wimbledon in London on grass;a yellow ball hit over a net with a racket|in tennis you hit a ball with a racket; in badminton you hit a shuttlecock|tennis 用球拍打球；badminton 打的是羽毛球|badminton=badminton uses a light shuttlecock with feathers, not yellow balls, and is not played at Wimbledon=badminton 打的是带羽毛的轻球，不是黄色的球，也不在温布尔登比赛;ping-pong=ping-pong is played on a table with a small white ball, not on grass with yellow balls=ping-pong 在桌上打白色小球，不在草地上打黄色的球|ten · nis|the double n, and -is at the end|双写 n，结尾是 -is
      volleyball|two teams on a beach hitting a big ball with their hands;six players on a court;a big ball hit over a net with the hands|in volleyball, teams hit a big ball with their hands; in tennis, players use rackets|volleyball 是两队用手击大球；tennis 用球拍|tennis=tennis is played with rackets by two or four players, not by teams of six hitting a big ball with their hands=tennis 是两人或四人用球拍打，不是六人一队用手击大球;badminton=badminton is played with rackets and a shuttlecock, not by teams hitting a big ball with their hands=badminton 用球拍打羽毛球，不是两队用手击大球|vol · ley · ball|volley + ball, one word, with a double l twice|volley + ball 合成一个词，两处双写 l
      badminton|a light shuttlecock popular in China and Indonesia;hitting a shuttlecock, not a ball;wind blowing a light shuttlecock away|in badminton you hit a shuttlecock; in tennis you hit a ball|badminton 打羽毛球；tennis 打网球|tennis/Tennis=tennis uses a ball, not a shuttlecock with feathers=tennis 打的是球，不是带羽毛的羽毛球;volleyball/Volleyball=volleyball uses a big ball hit with the hands, not a light shuttlecock=volleyball 用手击大球，不是打轻轻的羽毛球|bad · min · ton|bad + min + ton|bad + min + ton
      ping-pong|a green table;a small white light ball that bounces on a table;the best players at the table in China|ping-pong is played on a table; tennis is played on a court|ping-pong 在球桌上打；tennis 在球场上打|tennis=tennis is played on a big court with yellow balls, not on a table=tennis 在大球场上打黄色的球，不在桌上打;badminton=badminton uses a shuttlecock with feathers, not a small white ball on a table=badminton 打带羽毛的球，不在桌上打白色小球|ping-pong|a hyphen between *ping* and *pong*|*ping* 和 *pong* 中间有连字符
      baseball|hitting with a bat and running around four bases;the cap of a team with bats and bases;bats and bases popular in Japan and the US|in baseball you hit with a bat and run around bases; in tennis you hit with a racket over a net|baseball 用球棒击球、绕垒跑；tennis 用球拍隔网击球|tennis/Tennis=tennis is played with rackets over a net, not with a bat and four bases=tennis 隔网用球拍打，没有球棒，也没有四个垒;ping-pong/Ping-pong=ping-pong is played on a table, with no bases to run around=ping-pong 在桌上打，没有要绕着跑的垒|base · ball|base + ball, one word|base + ball，合成一个词
      skate|a frozen lake and shoes with blades;going backwards on an ice rink;new ones with pink wheels|you skate on blades or wheels; you ski on long boards on snow|skate 是穿冰刀或轮子滑；ski 是踩长板在雪上滑|ski/skiing/skis=ski means moving over snow on two long boards, not on blades or wheels=ski 是踩两块长板在雪上滑，不是穿冰刀或轮子;race/racing/races=race means trying to be the fastest, not moving on blades or wheels=race 是比谁最快，不是穿冰刀或轮子滑|skate|drop the e before -ing: *skating*|加 -ing 时去掉 e：*skating*
      ski|two long boards down snowy mountains;falling on a snowy hill on new boards;needing a lot of snow|you ski on long boards on snow; you skate on blades or wheels|ski 是踩长板在雪上滑；skate 是穿冰刀或轮子滑|skate/skating/skated=skate means moving on blades or wheels, not on two long boards on snow=skate 是穿冰刀或轮子滑，不是踩两块长板在雪上滑;race/racing/raced=race means trying to be the fastest, not moving on long boards=race 是比谁最快，不是踩长板滑行|ski|*skiing* has a double i, and the past is *skied*|*skiing* 有两个 i，过去式是 *skied*
      race|Anna being the fastest;horses at two o'clock;coming last but finishing|a race is about who is the fastest; a match is two sides playing against each other|race 比谁最快；match 是两方对抗|match=match is a game between two players or teams, not a competition to see who is the fastest=match 是两名选手或两支队伍之间的比赛，不是比谁最快;score=score is the number of points, not a competition you can win or finish=score 是得分数，不是可以赢或跑完的比赛|race|a that says its name, and -ce said like s|a 读字母本音，-ce 读作 s
      match|a football game won 3 to 1;tennis on TV;a football game between two teams canceled for rain|a match is two sides playing each other; a race is about who is the fastest|match 是两方对抗；race 比谁最快|race=race is about who is the fastest, not a game between two teams or two players=race 比谁最快，不是两队或两人之间的对抗;score=score is the number of points, not a game you watch or win=score 是得分数，不是可以观看或赢下的比赛|match|-tch at the end|结尾是 -tch
      player|eleven in a football team;Messi scoring hundreds of goals;a number on a shirt on the field|a player plays in the game; a coach trains the team|player 上场比赛；coach 训练队伍|coach/coaches=coach trains the team from the side, not someone who plays on the field and scores=coach 在场边训练队伍，不是上场得分的人;fan/fans=fan watches and loves a team, not someone who plays in it=fan 是观看、喜爱球队的人，不是上场比赛的人|play · er|play + -er|play 加 -er
      coach|running ten laps before a game;shouting to players from the side;swimming at a sports center|a coach trains a team or a player; a player plays in the game|coach 训练队伍或运动员；player 上场比赛|player=player plays in the game, not the person who trains the team or tells the players what to do=player 上场比赛，不是训练队伍、指挥队员的人;fan=fan watches and loves a team, not the person who trains it=fan 是观看、喜爱球队的人，不是训练它的人|coach|oa, as in *boat*, and ch at the end|oa 和 *boat* 里的一样，结尾是 ch
      score|a game at 2 to 2;two goals in the first half;a final 21 to 15|the score is all the points together; a point is one of them|score 是全部得分；point 是其中一分|point=point is one number in the score, not the whole result like 2 to 2=point 是比分里的一分，不是 2 比 2 这样的整个结果;goal=goal is one point in football, not the whole result like 21 to 15=goal 是足球里的一个进球，不是 21 比 15 这样的整个结果;win/won=you win a game or a prize, not goals=win 的对象是比赛或奖品，不是进球;cheer/cheered=cheer means shouting for your team, not putting a ball in the goal=cheer 是为队伍欢呼，不是把球踢进球门|score|-ore, as in *more*|-ore 和 *more* 一样
    `,
  },
});

const competition = vocabularyTopic({
  id: "a2-words-competition",
  title: t("Competition", "竞赛"),
  summary: t(
    "Winners, prizes, medals and champions; goals and points; playing against, beating, practicing; fans who cheer; the final.",
    "获胜者、奖品、奖牌和冠军；进球和分数；对抗、打败、练习；欢呼的球迷；决赛。",
  ),
  intro: t(
    "In the **final**, our team **beat** the red team 3 to 1, the **fans** **cheered**, and every player got a gold **medal**. These words help you talk about winning, losing and getting better at a sport.",
    "在 **final**（决赛）中，我们队以 3 比 1 **beat**（打败）了红队，**fans**（球迷）**cheered**（欢呼），每名队员都得到一枚金 **medal**（奖牌）。这些词帮你谈论输赢，以及怎样在运动中进步。",
  ),
  prerequisites: ["a2-words-sports"],
  words: [
    word(
      "winner winners",
      "the person or team that wins",
      "获胜者",
      "The {winner} of today's race gets a gold medal. | And the {winner} is... Lucy Chen! | There can only be one {winner} in a race.",
      "fan player",
    ),
    word(
      "prize prizes",
      "something you get for winning",
      "奖品；奖",
      "She won first {prize} in the drawing competition. | The {prize} for the winner is a new bike. | He has won many {prizes}, like books and money, for his poems.|medals goals",
      "medal goal",
    ),
    word(
      "medal medals",
      "a round piece of metal you get for winning or doing well",
      "奖牌",
      "She won a round gold {medal} at the Olympics. | The winners wear their {medals} around their necks. | He came third and got a round bronze {medal}.",
      "prize goal",
    ),
    word(
      "champion champions",
      "the best player or team in a competition",
      "冠军",
      "He is the world {champion} in ping-pong. | Who are this year's {champions}, the best team in the whole competition?|fans players | She was the swimming {champion} three years in a row.",
      "fan player",
    ),
    word(
      "goal goals",
      "the net where you try to put the ball; a point in football",
      "球门；进球",
      "He kicked the ball into the {goal}. | Our football team kicked three {goals} into the net.|points prizes | Wow, what a {goal}! The ball flew into the net.",
      "point prize",
    ),
    word(
      "point points",
      "one number in the score of a game",
      "分；得分",
      "You get one {point} for each right answer. | We won the basketball game by two {points}.|goals scores | In basketball, a long shot is worth three {points}.|goals scores",
      "goal score",
    ),
    word(
      "against",
      "on the other side in a game or fight",
      "对抗；反对",
      "Our team is playing {against} the red team, and we want to beat them. | It's China {against} Brazil in the final. | Don't lean {against} the wet wall.",
      "with for",
    ),
    word(
      "beat beats beaten beating",
      "to win against someone",
      "打败；战胜",
      "We {beat} the blue team 3 to 0.|won cheered | Nobody can {beat} her at chess. | They have never {beaten} us at home.|won cheered",
      "win cheer",
    ),
    word(
      "practice practices practiced practicing",
      "to do something again and again to get better at it",
      "练习",
      "I {practice} the piano every day. | Football {practice} is on Tuesday and Thursday.|final fan | She {practiced} her serve for hours.|beat cheered",
      "beat cheer",
    ),
    word(
      "fan fans",
      "a person who loves a team, a sport or a famous person",
      "迷；粉丝",
      "The {fans} in the stands sang and waved flags for their team.|winners champions | I'm a big {fan} of that singer. | Thousands of {fans} came to watch the match.|winners champions",
      "winner champion",
    ),
    word(
      "cheer cheers cheered cheering",
      "to shout because you are happy or want someone to win",
      "欢呼；喝彩",
      "The crowd {cheered} when she scored.|beat practiced | Let's {cheer} for our team! | We heard happy {cheering} from the stadium.|beating practicing",
      "beat practice",
    ),
    word(
      "final finals",
      "the last game, which decides the winner; last",
      "决赛；最后的",
      "Our team is in the {final}! We play on Sunday. | This is the {final} question, number ten of ten. Good luck!|first fan | Two teams reached the {finals}.|fans goals",
      "fan goal",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Beat* and *win* are easy to mix up: you *beat* a person or a team, but you *win* a game, a race or a prize. Say *We beat the blue team*, never *We won the blue team*.",
        "*beat* 和 *win* 容易混：*beat* 的对象是人或队伍，*win* 的对象是比赛或奖品。要说 *We beat the blue team*，不能说 *We won the blue team*。",
      ),
      meaning: t(
        "A *goal* and a *point* both count in the score, but a *goal* is what you get in football when the ball goes into the net, and *points* are counted in basketball, quizzes and many other games.",
        "*goal* 和 *point* 都计入比分，但 *goal* 是足球里球进网得到的，*point* 用于篮球、知识问答和许多其他比赛。",
      ),
      spell: t(
        "*Beat* stays *beat* in the past, but its past participle is *beaten*: *They have never beaten us*. *Champion* ends in -ion.",
        "*beat* 的过去式还是 *beat*，过去分词是 *beaten*：*They have never beaten us*。*champion* 以 -ion 结尾。",
      ),
    },
    notes: `
      winner|today's race and a gold medal;Lucy Chen being named;only one in a race|the winner is the one who wins; a fan watches and cheers|winner 是获胜的人；fan 是观看、欢呼的人|fan=fan loves a team or a sport and watches it, not the person who wins=fan 喜爱某支队伍或某项运动，观看比赛，不是获胜的人;player=player is anyone who plays, not only the one who wins=player 是所有参赛的人，不只是获胜的那个|win · ner|win + -ner, with a double n|win 加 -ner，双写 n
      prize|first place in a drawing competition;a new bike for the winner;books and money for poems|a prize is something you get for winning; a medal is a round piece of metal|prize 是获胜得到的奖品；medal 是圆形金属奖牌|medal/medals=medal is a round piece of metal, not a bike, books or money=medal 是圆形金属奖牌，不是自行车、书或钱;goal/goals=goal is a net or a point in football, not something you get for drawing or poems=goal 是球门或足球进球，不是画画或写诗得的奖|prize|z, not s: p-r-i-z-e|写 z，不是 s：p-r-i-z-e
      medal|a round gold one at the Olympics;something winners wear around their necks;a round bronze one for coming third|a medal is a round piece of metal you wear; a prize can be anything you win|medal 是挂在身上的圆形金属奖牌；prize 可以是任何奖品|prize=prize can be anything you win, like a bike, not a round piece of metal worn around the neck=prize 可以是任何奖品，比如自行车，不是挂在脖子上的圆形金属牌;goal=goal is a net or a point in football, not something you wear=goal 是球门或足球进球，不能戴在身上|med · al|-al at the end, not *metal*|结尾是 -al，别和 *metal* 弄混
      champion|the world's best at ping-pong;the best team in the whole competition this year;the best swimmer three years in a row|a champion is the best in a competition; a fan loves and watches|champion 是比赛中最好的；fan 是喜爱和观看的人|fan/fans=fan loves and watches a team or a player, not the best one in a competition=fan 喜爱并观看队伍或选手，不是比赛中最好的;player/players=player is anyone who plays, not only the best in the competition=player 是所有参赛的人，不只是最好的那个|cham · pi · on|-ion at the end|结尾是 -ion
      goal|a ball kicked into the net;three kicked into the net by a team;a ball that flew into the net|a goal is the net or a point in football; a point is one number in any score|goal 是球门或足球进球；point 是任何比分里的一分|point/points=point is one number in a score in many games, not the net or a ball kicked into it=point 是许多比赛里的一分，不是球门，也不是踢进网的球;prize/prizes=prize is something you get for winning, not a ball kicked into the net=prize 是获胜得到的奖品，不是踢进网的球|goal|oa, as in *boat*|oa 和 *boat* 里的一样
      point|one for each right answer;winning a basketball game by two;a long shot in basketball|a point is one number in a score; a goal is a point in football|point 是比分里的一分；goal 是足球进球|goal/goals=goal is a point in football when the ball goes into the net, not a point in basketball or a quiz=goal 是足球里球进网得的分，不是篮球或问答的分;score/scores=score is all the points together, and you get points one by one, not scores=score 是所有分数加在一起，一次得的是 point，不是 score|point|oi, as in *boy*|oi 和 *boy* 里的一样
      against|playing the red team to beat them;China and Brazil in the final;leaning on a wet wall|against means on the other side, or pressing on something; with means together|against 是对抗，或靠着某物；with 是一起|with=with means together on the same side, not on the other side or pressing on something=with 是一起、同一边，不是对抗，也不是靠着;for=for shows who you play or do something for, not the other side or something you press on=for 表示为谁效力或为谁做事，不是对抗，也不是靠着|a · gainst|ai said like short e: a-gainst|ai 读短元音 e：a-gainst
      beat|the blue team 3 to 0;nobody at chess;losing to someone at home|you beat a person or a team; you win a game or a prize|beat 的对象是人或队伍；win 的对象是比赛或奖品|win/won=you win a game, a race or a prize, but you beat a person or a team=win 的对象是比赛或奖品，人或队伍要用 beat;cheer/cheered=cheer means shouting for someone, not winning against them=cheer 是为人欢呼，不是战胜他们|beat|ea, as in *eat*, and the past is also *beat*|ea 和 *eat* 一样，过去式也是 *beat*
      practice|playing the piano every day;football on Tuesday and Thursday;a serve done for hours|practice means doing something again and again to get better; beat means winning against someone|practice 是反复练习；beat 是战胜别人|beat=beat means winning against someone, not doing something again and again to get better=beat 是战胜别人，不是反复练习;cheer/cheered=cheer means shouting for someone, not doing something again and again=cheer 是为人欢呼，不是反复练习;final=final is the last game, not something done every Tuesday and Thursday=final 是最后一场比赛，不是每周二周四都有的;fan=fan is a person who loves a team, not a time to get better at football=fan 是喜爱队伍的人，不是练球的时间|prac · tice|-ice at the end; British English writes the verb *practise*|结尾是 -ice；英式英语动词写作 *practise*
      fan|people in the stands singing and waving flags;someone who loves a singer;thousands watching a match|a fan loves a team or a famous person; a winner wins|fan 是喜爱某队或名人的人；winner 是获胜者|winner/winners=winner is the one who wins, not a person who watches and loves a team or a singer=winner 是获胜的人，不是观看、喜爱队伍或歌手的人;champion/champions=champion is the best player or team, not someone who watches and loves them=champion 是最好的选手或队伍，不是观看、喜爱他们的人|fan|a short a|短元音 a
      cheer|a crowd when she scored;shouting for our team;happy sounds from a stadium|cheer means shouting because you are happy or want someone to win; beat means winning against someone|cheer 是欢呼；beat 是战胜|beat/beating=beat means winning against someone, not happy shouting=beat 是战胜别人，不是开心地喊;practice/practiced/practicing=practice means doing something again and again, not shouting because you are happy=practice 是反复练习，不是开心地欢呼|cheer|the double e, and -er at the end|两个 e，结尾是 -er
      final|a team that plays on Sunday;the tenth of ten questions;two teams that reached it|the final is the last game; a fan is a person who loves a team|final 是最后一场比赛；fan 是喜爱队伍的人|fan/fans=fan is a person who loves a team, not the last game or the last one=fan 是喜爱队伍的人，不是最后一场比赛或最后一个;goal/goals=goal is a net or a point, not the last game that decides the winner=goal 是球门或进球，不是决定冠军的最后一场;first=first comes before all the others, not at the end=first 是排在最前面的，不是最后的|fi · nal|-al at the end|结尾是 -al
    `,
  },
});

const movement = vocabularyTopic({
  id: "a2-words-movement",
  title: t("Movement", "动作"),
  summary: t(
    "Throwing, kicking, hitting, climbing, pushing, pulling, lifting, rolling, slipping, holding, shouting and fighting.",
    "扔、踢、击打、爬、推、拉、举、滚、滑倒、握住、喊叫和打架。",
  ),
  intro: t(
    "In the park, Max **threw** a ball, his dog **rolled** in the grass, and his sister **climbed** a tree, then **slipped** and **shouted** for help. These words help you describe how people and things move.",
    "在公园里，马克斯 **threw**（扔）出一个球，他的狗在草地上 **rolled**（打滚），他妹妹 **climbed**（爬）上一棵树，接着 **slipped**（滑了一下），**shouted**（大喊）求救。这些词帮你描述人和东西怎样移动。",
  ),
  prerequisites: ["a2-words-competition"],
  words: [
    word(
      "throw throws threw thrown throwing",
      "to send something through the air with your hand",
      "扔；投",
      "{Throw} the ball to me with your hand!|Kick Catch | He picked up the ball and {threw} it over the fence with his hand.|kicked caught | Don't pick up stones and {throw} them at the birds.",
      "kick catch",
    ),
    word(
      "kick kicks kicked kicking",
      "to hit something with your foot",
      "踢",
      "He {kicked} the ball into the goal with his left foot.|threw lifted | My little brother {kicks} me with his feet under the table.|throws lifts | Don't {kick} the door. Use your hand.",
      "throw lift",
    ),
    word(
      "hit hits hitting",
      "to touch something hard and fast, with your hand or a bat",
      "击打；撞",
      "{Hit} the ball with the bat.|Kick Push | The car {hit} a tree hard and fast, but nobody was hurt.|kicked pushed | She is good at {hitting} the ball over the net with her racket.|kicking pushing",
      "kick push",
    ),
    word(
      "climb climbs climbed climbing",
      "to go up something using your hands and feet",
      "爬；攀登",
      "The cat {climbed} up the tree, holding on with its claws.|jumped fell | We {climbed} the mountain in five hours.|jumped fell | {Climbing} up walls with my hands and feet is my favorite sport.|Jumping Falling",
      "jump fall",
    ),
    word(
      "push pushes pushed pushing",
      "to move something away from you with your hands",
      "推",
      "{Push} the door away from you to open it.|Pull Lift | He {pushed} me away from him with both hands, and I fell!|pulled lifted | The car stopped, so we got behind it and {pushed} it to the garage.|pulled lifted",
      "pull lift",
    ),
    word(
      "pull pulls pulled pulling",
      "to move something toward you",
      "拉",
      "{Pull} the rope toward you as hard as you can!|Push Lift | Don't {pull} the cat's tail toward you! | The horse in front {pulled} the cart behind it up the hill.|pushed lifted",
      "push lift",
    ),
    word(
      "lift lifts lifted lifting",
      "to move something up",
      "举起；抬起",
      "Can you help me {lift} this heavy box up onto the table? | He {lifted} the baby up onto his shoulders.|pulled dropped | {Lift} your arms up over your head.|Pull Drop",
      "pull drop",
    ),
    word(
      "roll rolls rolled rolling",
      "to move by turning over and over",
      "滚动",
      "The ball {rolled} over and over under the car.|slipped lifted | {Roll} the dice so they turn over and over, and then move your piece.|Slip Lift | The dog {rolled} over and over in the grass.|slipped lifted",
      "slip lift",
    ),
    word(
      "slip slips slipped slipping",
      "to slide by accident and fall",
      "滑倒；打滑",
      "Be careful! Don't {slip} by accident on the ice and fall. | I {slipped} on the wet floor and hurt my knee.|rolled lifted | The wet cup {slipped} out of my hand by accident.|rolled lifted",
      "roll lift",
    ),
    word(
      "hold holds held holding",
      "to have something in your hands",
      "拿着；握住",
      "{Hold} my hand in yours when we cross the road.|Lift Pull | She {held} the baby carefully in her arms for an hour.|lifted pulled | He's sitting still, {holding} a cup of hot tea in his hands.|lifting pulling",
      "lift pull",
    ),
    word(
      "shout shouts shouted shouting",
      "to say something very loudly",
      "喊叫",
      'Don\'t {shout}! I can hear you. | The angry coach {shouted} at the players.|cheered whispered | "Help!" she {shouted}.|cheered whispered',
      "cheer whisper",
    ),
    word(
      "fight fights fought fighting",
      "to use your body or weapons against someone; to argue",
      "打架；战斗；争吵",
      "My brother and I often {fight} about the TV. | Dogs sometimes {fight} over food. | The doctors are {fighting} to save her life.|hitting pushing | The two cats {fought} in the garden all night.|hit pushed",
      "hit push",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Push* and *pull* go in opposite directions: you *push* something away from you, and you *pull* it toward you. Look for *away from*, *toward* or *behind* in the sentence.",
        "*push* 和 *pull* 方向相反：*push* 是把东西推离自己，*pull* 是把东西拉向自己。找找句子里的 *away from*、*toward* 或 *behind*。",
      ),
      meaning: t(
        "*Throw* and *kick* both send a ball away, but you *throw* with your hand and *kick* with your foot; *hit* means touching something hard and fast, often with a bat or a racket.",
        "*throw* 和 *kick* 都能把球弄走，但 *throw* 用手，*kick* 用脚；*hit* 是快速用力地碰击，常用球棒或球拍。",
      ),
      spell: t(
        "Several of these verbs have irregular pasts: *throw, threw, thrown*; *hold, held*; *fight, fought*; *hit, hit*. *Slip* doubles its p: *slipped*.",
        "这些动词有几个过去式不规则：*throw, threw, thrown*；*hold, held*；*fight, fought*；*hit, hit*。*slip* 要双写 p：*slipped*。",
      ),
    },
    notes: `
      throw|a ball sent with the hand;a ball picked up and sent over a fence;stones picked up and sent at birds|you throw with your hand; you kick with your foot|throw 用手扔；kick 用脚踢|kick/kicked=kick means hitting with your foot, not sending something with your hand=kick 是用脚踢，不是用手扔;catch/caught=catch means taking something that comes to you through the air, not sending it away=catch 是接住飞来的东西，不是把东西扔出去|throw|past *threw*, past participle *thrown*|过去式 *threw*，过去分词 *thrown*
      kick|a ball into the goal with a left foot;a little brother's feet under the table;a door that should be opened by hand|you kick with your foot; you throw with your hand|kick 用脚；throw 用手|throw/threw/throws=throw means sending something with your hand, not hitting it with your foot=throw 是用手扔，不是用脚踢;lift/lifted/lifts=lift means moving something up, not hitting it with your foot=lift 是往上抬，不是用脚踢|kick|ck at the end|结尾是 ck
      hit|a ball and a bat;a car and a tree;a ball over a net with a racket|hit means touching something hard and fast; kick is only with the foot|hit 是快速用力地碰击；kick 只用脚|kick/Kick/kicked/kicking=kick means hitting with your foot, not with a bat, a racket or a car=kick 是用脚踢，不是用球棒、球拍或汽车撞;push/Push/pushed/pushing=push means moving something slowly away from you, not touching it hard and fast=push 是慢慢地把东西推开，不是快速用力地碰击|hit|*hit* stays the same in the past, and *hitting* has a double t|过去式不变，*hitting* 双写 t
      climb|a cat going up a tree with its claws;going up a mountain in five hours;going up walls with hands and feet|climb means going up using hands and feet; jump means going into the air|climb 是手脚并用往上爬；jump 是跳起来|jump/jumped/Jumping=jump means pushing off with your legs into the air, not going up slowly with hands and feet=jump 是用腿蹬地跳到空中，不是手脚并用慢慢往上爬;fall/fell/Falling=fall means going down without wanting to, not going up=fall 是不小心往下掉，不是往上爬|climb|a silent b at the end|结尾的 b 不发音
      push|a door moved away from you;someone moved away with both hands;a car moved from behind|push means moving something away from you; pull means moving it toward you|push 是推离自己；pull 是拉向自己|pull/Pull/pulled=pull means moving something toward you, not away from you or from behind=pull 是拉向自己，不是推离自己，也不是从后面推;lift/Lift/lifted=lift means moving something up, not away from you=lift 是往上抬，不是推离自己|push|u as in *put*, and sh at the end|u 和 *put* 里的一样，结尾是 sh
      pull|a rope toward you;a cat's tail toward you;a cart behind a horse up a hill|pull means moving something toward you; push means moving it away|pull 是拉向自己；push 是推开|push/Push/pushed=push means moving something away from you, not toward you or behind you=push 是推离自己，不是拉向自己，也不是拖在身后;lift/Lift/lifted=lift means moving something up, not toward you or behind you=lift 是往上抬，不是拉向自己或拖在身后|pull|the double l, and u as in *put*|双写 l，u 和 *put* 里的一样
      lift|a heavy box up onto a table;a baby up onto shoulders;arms up over the head|lift means moving something up; drop means letting it fall|lift 是往上抬；drop 是让它掉下|pull/pulled/Pull=pull means moving something toward you, not up=pull 是拉向自己，不是往上抬;drop/dropped/Drop=drop means letting something fall down, the opposite of moving it up=drop 是让东西掉下去，和往上抬正相反|lift|-ft at the end|结尾是 -ft
      roll|a ball turning over and over under a car;dice turning over and over;a dog turning over and over in the grass|roll means turning over and over; slip means sliding by accident|roll 是翻滚；slip 是不小心滑倒|slip/slipped/Slip=slip means sliding by accident, not turning over and over=slip 是不小心滑，不是翻滚;lift/lifted/Lift=lift means moving something up, not turning over and over=lift 是往上抬，不是翻滚|roll|the double l, and o that says its name|双写 l，o 读字母本音
      slip|ice and a fall by accident;a wet floor and a hurt knee;a wet cup leaving a hand by accident|slip means sliding by accident; roll means turning over and over|slip 是不小心滑；roll 是翻滚|roll/rolled=roll means turning over and over, not sliding by accident=roll 是翻滚，不是不小心滑;lift/lifted=lift means moving something up on purpose, not sliding by accident=lift 是有意往上抬，不是不小心滑|slip|double the p: *slipped*, *slipping*|双写 p：*slipped*、*slipping*
      hold|a hand in yours when crossing a road;a baby in arms for an hour;a cup of hot tea in the hands while sitting still|hold means having something in your hands; lift means moving it up|hold 是拿着、握着；lift 是往上抬|lift/Lift/lifted/lifting=lift means moving something up, not keeping it in your hands for a long time=lift 是往上抬，不是一直拿在手里;pull/Pull/pulled/pulling=pull means moving something toward you, not keeping it still in your hands=pull 是拉向自己，不是稳稳地拿在手里|hold|past *held*|过去式是 *held*
      shout|someone who can be heard without it;an angry coach and the players;"Help!"|shout means saying something very loudly; whisper means saying it very quietly|shout 是大声喊；whisper 是小声说|cheer/cheered=cheer means shouting because you are happy for someone, not saying something angry or asking for help=cheer 是因为高兴而欢呼，不是生气地喊或喊救命;whisper/whispered=whisper means saying something very quietly, the opposite of very loudly=whisper 是小声说，和大声喊正相反|shout|ou, as in *out*|ou 和 *out* 里的一样
      fight|a brother and sister and the TV;dogs and food;doctors saving a life;two cats in a garden all night|fight means using your body against someone, or arguing; hit is one hard touch|fight 是打架或争吵；hit 是一次用力的碰击|hit/hitting=hit means touching something hard once, and it needs something you hit, not two sides against each other=hit 是用力碰一下，后面要接被打的东西，不是两方互相对抗;push/pushing/pushed=push means moving something away from you, and it needs something you push, not two sides against each other=push 是把东西推开，后面要接被推的东西，不是两方互相对抗|fight|igh said like *eye*, past *fought*|igh 读作 *eye*，过去式是 *fought*
    `,
  },
});

const games = vocabularyTopic({
  id: "a2-words-games",
  title: t("Games", "游戏"),
  summary: t(
    "Puzzles, rules, dice and boards; partners and levels; online games and videos; cheating; chances; fair and lucky.",
    "拼图、规则、骰子和棋盘；搭档和关卡；网络游戏和视频；作弊；机会；公平的和幸运的。",
  ),
  intro: t(
    "On game night, we put the **board** on the table, read the **rules**, and my **partner** and I took turns to roll the **dice**. These words help you play games, follow the rules and talk about luck.",
    "游戏之夜，我们把 **board**（棋盘）摆在桌上，读了 **rules**（规则），我和 **partner**（搭档）轮流掷 **dice**（骰子）。这些词帮你玩游戏、遵守规则，以及谈论运气。",
  ),
  prerequisites: ["a2-words-movement"],
  words: [
    word(
      "puzzle puzzles",
      "a game or a question that you have to think hard about",
      "拼图；谜题",
      "This {puzzle} has a thousand pieces. | I can't finish this {puzzle}: I can't find where the last pieces go. | He loves crossword {puzzles}.|rules levels",
      "rule level",
    ),
    word(
      "rule rules",
      "what you must or must not do in a game or a place",
      "规则",
      "Do you know the {rules} of chess?|levels partners | It's against the {rules} to touch the ball with your hand.|levels partners | The first {rule} is: no running by the pool.",
      "level partner",
    ),
    word(
      "dice",
      "small cubes with one to six dots, used in games",
      "骰子",
      "Throw the {dice}. You got a six! | You need two {dice}, each with six sides, to play this game.|boards puzzles | It's your turn. Roll the {dice}.",
      "board puzzle",
    ),
    word(
      "board boards",
      "a flat piece of wood or card on which you play a game",
      "棋盘；板",
      "Put the chess pieces on the black and white squares of the {board}. | My family plays {board} games, moving pieces on a flat card, on Sunday. | The teacher wrote on the {board} on the classroom wall.",
      "dice table",
    ),
    word(
      "partner partners",
      "a person you do something with",
      "搭档；伙伴",
      "Find a {partner} and practice the dialogue. | My tennis {partner}, who plays on my side of the net, is my sister. | Work with your {partner} on this puzzle.",
      "player fan",
    ),
    word(
      "level levels",
      "one stage of a game, each harder than the one before",
      "关卡；级别",
      "I've finished eleven stages, so I'm on {level} 12 of the game. | Each {level} is harder than the last one. | This book is for students at {level} A2.",
      "rule board",
    ),
    word(
      "online",
      "on the internet",
      "在线的；网上",
      "I play chess {online} on my computer with my cousin in Canada. | You can buy tickets {online} on the cinema's website. | Many people shop {online} now, on their phones and computers.",
      "outside inside",
    ),
    word(
      "video videos",
      "a recording of moving pictures",
      "视频",
      "Let's watch a {video} of the match. | He makes funny {videos} of his cat jumping and running.|photos puzzles | I play {video} games for one hour on Saturday.",
      "photo puzzle",
    ),
    word(
      "cheat cheats cheated cheating",
      "to do something that is against the rules to win",
      "作弊",
      "Don't look at my cards! That's {cheating}.|beating practicing | He {cheated} in the test and the teacher saw him.|beat practiced | If you {cheat}, you can't play with us.",
      "beat practice",
    ),
    word(
      "fair fairer fairest",
      "right for everyone; following the rules",
      "公平的",
      "That's not {fair}! He has more cake than me. | Each team has five players, the same number: that's {fair}. | The judge wasn't {fair} to us.",
      "lucky easy",
    ),
    word(
      "lucky luckier luckiest",
      "having good things happen by chance",
      "幸运的",
      "You found money in the street by chance? You're {lucky}! | Seven is my {lucky} number. | We were {lucky}: the rain stopped just before the match.",
      "fair careful",
    ),
    word(
      "chance chances",
      "a time when you can do something; how possible it is that something will happen",
      "机会；可能性",
      "Do you think we have a {chance} of winning? | I didn't get a {chance} to play today. | There's a good {chance} it will rain tomorrow. | She had two {chances} to score, but she missed both.|changes charges",
      "change charge",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Dice* is already plural: say *two dice* and *roll the dice*, and *a die* is the old word for just one. Do not add -s to *dice*.",
        "*dice* 本身就是复数：说 *two dice*、*roll the dice*，一个骰子的旧说法是 *a die*。不要在 *dice* 后面再加 -s。",
      ),
      meaning: t(
        "*Fair* and *lucky* are both good, but for different reasons: something is *fair* when it is right for everyone and follows the rules, and you are *lucky* when something good happens to you by chance.",
        "*fair* 和 *lucky* 都是好事，但原因不同：*fair* 是对大家都公平、合乎规则，*lucky* 是碰巧遇到好事。",
      ),
      spell: t(
        "*Chance* has a in the middle, not *change* with g: c · h · a · n · c · e. *Puzzle* has a double z.",
        "*chance* 中间是 a，结尾 -nce，别写成有 g 的 *change*：c · h · a · n · c · e。*puzzle* 双写 z。",
      ),
    },
    notes: `
      puzzle|a thousand pieces;the last pieces that won't fit;crossword games|a puzzle is a game you have to think hard about; a rule says what you must do|puzzle 是要动脑的游戏或谜题；rule 规定你必须做什么|rule/rules=rule says what you must or must not do, and it has no pieces or crosswords=rule 规定该做和不该做的事，没有拼块，也不是填字游戏;level/levels=level is one stage of a game, not something with pieces you put together=level 是游戏的一关，不是要拼起来的拼块|puz · zle|the double z, and -le at the end|双写 z，结尾是 -le
      rule|chess;touching the ball with a hand;no running by the pool|a rule says what you must or must not do; a level is one stage of a game|rule 规定该做和不该做的事；level 是游戏的一关|level/levels=level is one stage of a game, not what you must or must not do=level 是游戏的一关，不是该做或不该做的事;partner/partners=partner is a person you do something with, not what you must or must not do=partner 是一起做事的人，不是该做或不该做的事|rule|u that says *oo*, and the silent e|u 读作 *oo*，结尾 e 不发音
      dice|getting a six;two with six sides for a game;rolling on your turn|dice are small cubes with dots; a board is the flat thing you play on|dice 是带点数的小方块；board 是在上面玩的平板|board/boards=board is a flat piece of wood or card, and you cannot throw it and get a six=board 是平平的木板或纸板，不能掷出六点;puzzle/puzzles=puzzle is a game you think hard about, not small cubes you throw or roll=puzzle 是要动脑的游戏，不是掷来掷去的小方块|dice|already plural: *two dice*, not *dices*|本身就是复数：*two dice*，不是 *dices*
      board|chess pieces on black and white squares;games with pieces moved on a flat card;writing on a classroom wall|a board is a flat piece of wood or card; a table is furniture you sit at|board 是平平的木板或纸板；table 是坐在旁边的桌子|dice=dice are small cubes you roll, not a flat thing with squares that you write on or move pieces on=dice 是掷的小方块，不是有方格、能写字或放棋子的平板;table=table is furniture you sit at, not a flat card with squares or a thing on a wall=table 是坐着用的桌子，不是有方格的纸板，也不在墙上|board|oa said like *or*|oa 读作 *or*
      partner|practicing a dialogue together;a sister on the same side of the net;working together on a puzzle|a partner is a person you do something with; a player is anyone in a game|partner 是一起做事的搭档；player 是比赛中的任何人|player=player is anyone who plays a game, not the one person who works or plays with you=player 是所有参赛的人，不是和你一起做事或一起打球的那个人;fan=fan watches and loves a team, not a person who does something with you=fan 是观看、喜爱队伍的人，不是和你一起做事的人|part · ner|part + -ner|part 加 -ner
      level|number 12 after eleven stages;each one harder than the last;a book for students at A2|a level is one stage, each harder than the one before; a rule says what you must do|level 是一关或一个级别，一关比一关难；rule 规定该做什么|rule=rule says what you must or must not do, not a stage that is harder than the one before=rule 规定该做和不该做的事，不是一关比一关难的关卡;board=board is a flat piece of wood or card, not a stage of a game or a book=board 是平平的木板或纸板，不是游戏的关卡或书的级别|lev · el|e-v-e-l, with -el at the end|e-v-e-l，结尾是 -el
      online|chess on a computer with a cousin in Canada;tickets on a cinema's website;shopping on phones and computers|online means on the internet; outside means out of a building|online 是在网上；outside 是在户外|outside=outside means out of a building, not on the internet=outside 是在户外，不是在网上;inside=inside means in a building, not on the internet=inside 是在室内，不是在网上|on · line|on + line, one word|on + line，合成一个词
      video|watching a match;a cat jumping and running;games on a screen|a video has moving pictures; a photo is one picture that does not move|video 是动态画面；photo 是不动的一张照片|photo/photos=photo is one picture that does not move, and you cannot watch it or play its games=photo 是不会动的一张照片，不能观看播放，也没有游戏;puzzle/puzzles=puzzle is a game you think hard about, not moving pictures you watch=puzzle 是要动脑的游戏，不是可以观看的动态画面|vid · e · o|i, e, o: three vowels after the d|d 后面是 i、e、o 三个元音
      cheat|looking at someone's cards;a test and a teacher who saw;not being allowed to play with us|cheat means doing something against the rules to win; beat means winning fairly against someone|cheat 是违反规则去赢；beat 是战胜对手|beat/beating=beat means winning against someone, not breaking the rules=beat 是战胜别人，不是违反规则;practice/practiced/practicing=practice means doing something again and again to get better, not breaking the rules=practice 是反复练习，不是违反规则|cheat|ea, as in *eat*|ea 和 *eat* 一样
      fair|someone having more cake;five players on each team;a judge|fair means right for everyone; lucky means good things happen by chance|fair 是对大家公平；lucky 是碰巧走运|lucky=lucky means having good things happen by chance, not being right for everyone=lucky 是碰巧走运，不是对大家公平;easy=easy means not difficult, not right for everyone or following the rules=easy 是不难，不是公平或合乎规则|fair|-air, as in *hair*|-air 和 *hair* 一样
      lucky|money found in the street by chance;the number seven;rain stopping just before a match|lucky means having good things happen by chance; fair means right for everyone|lucky 是碰巧走运；fair 是公平|fair=fair means right for everyone, not good things happening by chance=fair 是对大家公平，不是碰巧走运;careful=careful means paying attention to avoid mistakes, not good things happening by chance=careful 是小心不出错，不是碰巧走运|luck · y|luck + -y; y to i in *luckier*|luck 加 -y；*luckier* 里 y 改 i
      chance|winning;getting to play today;rain tomorrow;two tries to score|a chance is a time when you can do something, or how possible something is|chance 是机会，或某事发生的可能性|change/changes=change is money you get back or something becoming different, not a time to do something or how possible something is=change 是找零或变化，不是机会或可能性;charge/charges=charge is putting power into a battery, not a time to do something or how possible something is=charge 是给电池充电，不是机会或可能性|chance|a in the middle, not *change*|中间是 a，别和 *change* 弄混
    `,
  },
});

const adverbWords = vocabularyTopic({
  id: "a2-words-adverbs",
  title: t("How We Do Things", "做事的方式"),
  summary: t(
    "Quickly, slowly, carefully, quietly, loudly, easily, badly and hard; loud; almost and quite.",
    "快速地、慢慢地、仔细地、安静地、大声地、容易地、糟糕地和努力地；大声的；几乎和相当。",
  ),
  intro: t(
    "The old man walked **slowly** and **carefully** across the ice, while the children ran **quickly** and shouted **loudly**. These words help you say how someone does something.",
    "老人在冰上走得 **slowly**（慢慢地）又 **carefully**（小心地），孩子们则跑得 **quickly**（飞快），喊得 **loudly**（大声）。这些词帮你说出一个人是怎样做事的。",
  ),
  prerequisites: ["a2-words-games"],
  words: [
    word(
      "quickly",
      "fast",
      "快速地",
      "Come {quickly}! The bus is here. | She ate her breakfast {quickly} and ran to school. | The time went {quickly}: the two hours felt like ten minutes.",
      "slowly easily",
    ),
    word(
      "slowly",
      "not fast",
      "慢慢地",
      "Please speak more {slowly}: you're talking too fast for me. | The old man walked {slowly} up the hill, and it took him an hour. | Drive {slowly}, not fast, near the school.",
      "quickly loudly",
      "carefully quietly",
    ),
    word(
      "carefully",
      "paying attention so that you don't make mistakes or break something",
      "仔细地；小心地",
      "Read the questions {carefully} so you make no mistakes. | Carry the glasses {carefully} so you don't break them. | Listen {carefully} to the rules so you don't make mistakes.",
      "badly easily",
      "slowly quietly",
    ),
    word(
      "quietly",
      "making very little noise",
      "安静地；轻声地",
      "Talk {quietly}. The baby is sleeping. | He closed the door {quietly} so he wouldn't wake anyone. | The cat walked {quietly} behind the bird, so the bird didn't hear it.",
      "loudly quickly",
      "slowly carefully",
    ),
    word(
      "loudly",
      "making a lot of noise",
      "大声地",
      "The fans cheered {loudly}: you could hear them a kilometer away. | Don't talk so {loudly}: everyone in the library can hear you. | The dog barked {loudly} all night, and nobody could sleep.",
      "quietly slowly",
      "loud",
    ),
    word(
      "easily",
      "without difficulty",
      "容易地；轻松地",
      "She won the race {easily}: the others were far behind her. | I can {easily} carry this bag. It's light. | He gets angry very {easily}: even small things make him shout.",
      "badly quietly",
    ),
    word(
      "badly",
      "not well",
      "糟糕地；严重地",
      "We played {badly} and lost 5 to 0. | He was {badly} hurt in the accident and stayed in hospital for a month. | I slept {badly} because of the noise.",
      "easily well",
    ),
    word(
      "hard harder hardest",
      "with a lot of effort; not soft",
      "努力地；硬的",
      "She studied {hard} for many weeks and passed the test. | It's raining {hard}. Take an umbrella. | This bed is as {hard} as a rock, so I can't sleep.|soft easy",
      "easily badly",
    ),
    word(
      "loud louder loudest",
      "making a lot of noise",
      "大声的；响亮的",
      "The music is too {loud}! Turn it down. | There was a {loud} noise in the night that woke everyone up. | Can you speak {louder}? I can't hear you.|quieter softer",
      "quiet soft",
      "loudly",
    ),
    word(
      "almost",
      "nearly; not quite",
      "几乎；差不多",
      "Hurry up! It's {almost} eight o'clock: only two minutes to go. | I {almost} fell, but I held the rail. | We're {almost} there. Just five more minutes.",
      "already most",
      "quite",
    ),
    word(
      "quite",
      "fairly; more than a little",
      "相当；颇",
      "The test was {quite} easy. | It's {quite} cold today. Wear a coat. | She speaks English {quite} well.",
      "quiet quietly",
      "almost",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Loud* describes a thing and *loudly* describes how someone does something: *loud music*, but *the dog barked loudly*. *Hard* is different: it is the same word in both jobs, so say *study hard*, not *study hardly*.",
        "*loud* 形容事物，*loudly* 说明怎样做事：*loud music*，但 *the dog barked loudly*。*hard* 不一样，两种用法都是同一个词，所以说 *study hard*，不说 *study hardly*。",
      ),
      meaning: t(
        "*Almost* and *quite* both soften a word: *almost* means not completely, as in *almost eight o'clock*, and *quite* means more than a little, as in *quite cold*.",
        "*almost* 和 *quite* 都能修饰程度：*almost* 是还差一点，如 *almost eight o'clock*；*quite* 是相当、不止一点，如 *quite cold*。",
      ),
      spell: t(
        "*Easy* becomes *easily*, with y changed to i, and *careful* becomes *carefully*, with a double l. Do not mix up *quite* (q-u-i-t-e) and *quiet* (q-u-i-e-t).",
        "*easy* 变成 *easily*，y 改成 i；*careful* 变成 *carefully*，双写 l。别把 *quite*（q-u-i-t-e）和 *quiet*（q-u-i-e-t）弄混。",
      ),
    },
    notes: `
      quickly|running for a bus that is here;eating breakfast and running to school;two hours that felt like ten minutes|quickly means fast; slowly means not fast|quickly 是快；slowly 是慢|slowly=slowly means not fast, the opposite of quickly=slowly 是慢，和 quickly 意思相反;easily=easily means without difficulty, not fast=easily 是轻松，不是快|quick · ly|quick + -ly|quick 加 -ly
      slowly|speech that is too fast;an old man taking an hour up a hill;driving near a school|slowly means not fast; quickly means fast|slowly 是慢；quickly 是快|quickly=quickly means fast, the opposite of slowly=quickly 是快，和 slowly 意思相反;loudly=loudly means making a lot of noise, not about speed=loudly 是大声，和速度无关|slow · ly|slow + -ly|slow 加 -ly
      carefully|reading questions to make no mistakes;carrying glasses so they don't break;listening to the rules to make no mistakes|carefully means paying attention to avoid mistakes; badly means not well|carefully 是小心仔细；badly 是糟糕|badly=badly means not well, the opposite of paying attention to avoid mistakes=badly 是做得不好，和小心不出错正相反;easily=easily means without difficulty, not paying attention to avoid mistakes=easily 是轻松，不是小心仔细|care · ful · ly|careful + -ly, with a double l|careful 加 -ly，双写 l
      quietly|talking while a baby sleeps;closing a door so no one wakes;a cat behind a bird that didn't hear|quietly means making very little noise; loudly means making a lot|quietly 是轻声；loudly 是大声|loudly=loudly means making a lot of noise, the opposite of quietly=loudly 是大声，和 quietly 意思相反;quickly=quickly means fast, not making very little noise=quickly 是快，不是轻声|qui · et · ly|quiet + -ly: i before e|quiet 加 -ly：i 在 e 前面
      loudly|fans heard a kilometer away;talking everyone in a library can hear;a dog barking so nobody could sleep|loudly means making a lot of noise; quietly means making very little|loudly 是大声；quietly 是轻声|quietly=quietly means making very little noise, the opposite of loudly=quietly 是轻声，和 loudly 意思相反;slowly=slowly means not fast, not making a lot of noise=slowly 是慢，不是大声|loud · ly|loud + -ly|loud 加 -ly
      easily|a race won with others far behind;a light bag;getting angry at small things|easily means without difficulty; badly means not well|easily 是轻松；badly 是糟糕|badly=badly means not well, not without difficulty=badly 是做得不好，不是轻松;quietly=quietly means making very little noise, not without difficulty=quietly 是轻声，不是轻松|eas · i · ly|easy changes y to i: easi + -ly|easy 把 y 改成 i：easi + -ly
      badly|losing 5 to 0;a month in hospital after an accident;sleep lost to noise|badly means not well; well means in a good way|badly 是糟糕；well 是好|easily=easily means without difficulty, not in a bad way=easily 是轻松，不是糟糕;well=well means in a good way, the opposite of badly=well 是好，和 badly 意思相反|bad · ly|bad + -ly|bad 加 -ly
      hard|studying for many weeks before a test;rain that needs an umbrella;a bed like a rock|hard means with a lot of effort, or not soft; easily means without difficulty|hard 是努力地，或硬的；easily 是轻松地|easily=easily means without difficulty, not with a lot of effort or strong rain=easily 是轻松，不是努力，也不是雨下得大;badly=badly means not well, not with a lot of effort or strong rain=badly 是糟糕，不是努力，也不是雨下得大;soft=soft means not hard, the opposite of a rock=soft 是软的，和石头一样硬正相反;easy=easy means not difficult, not hard like a rock=easy 是容易，不是像石头一样硬|hard|the same word as an adverb: *study hard*, not *hardly*|作副词时不变：*study hard*，不是 *hardly*
      loud|music to turn down;a noise that woke everyone;speaking so someone can hear|loud means making a lot of noise; quiet means with little sound|loud 是响亮；quiet 是安静|quiet/quieter=quiet means with little sound, the opposite of loud=quiet 是声音小，和 loud 意思相反;soft/softer=soft here means gentle and quiet, not making a lot of noise=soft 在这里是轻柔安静，不是响亮|loud|ou, as in *out*|ou 和 *out* 里的一样
      almost|only two minutes before eight;nearly falling but holding a rail;five more minutes to get there|almost means not completely; already means sooner than expected|almost 是差一点；already 是已经|already=already means something has happened, not that it is very close to happening=already 是已经发生了，不是差一点就发生;most=most means the biggest part, as in *most people*, and cannot come before a time or a verb like this=most 是大部分，如 *most people*，不能这样放在时间或动词前|al · most|one l: al- + most|只有一个 l：al- + most
      quite|an easy test;a cold day that needs a coat;English spoken well|quite means more than a little; quiet means with little sound|quite 是相当；quiet 是安静|quiet=quiet means with little sound, and it cannot come before words like *easy*, *cold* or *well*=quiet 是安静，不能放在 *easy*、*cold*、*well* 这类词前面;quietly=quietly means making very little noise, and it cannot come before words like *easy*, *cold* or *well*=quietly 是轻声地，不能放在 *easy*、*cold*、*well* 这类词前面|quite|q-u-i-t-e, with the e at the end, not *quiet*|q-u-i-t-e，e 在最后，不是 *quiet*
    `,
  },
});

// Adverbs of manner.

/** manners are an adjective, its adverb, a person who does it, the verb for that person, and two wrong adverbs. */
const manners: readonly (readonly [string, string, string, string, string])[] = [
  ["quick", "quickly", "runner", "runs", "quickely"],
  ["slow", "slowly", "eater", "eats", "slowley"],
  ["careful", "carefully", "driver", "drives", "carefuly"],
  ["quiet", "quietly", "speaker", "speaks", "quietely"],
  ["loud", "loudly", "singer", "sings", "loudy"],
  ["bad", "badly", "player", "plays", "badely"],
  ["good", "well", "swimmer", "swims", "goodly"],
  ["beautiful", "beautifully", "dancer", "dances", "beautifuly"],
];

const mannerSubjects: readonly string[] = [
  "Tom",
  "My sister",
  "Our coach",
  "Mr. Li",
  "Anna",
  "My uncle",
  "Lucy",
  "Our neighbor",
  "Sam",
  "My cousin",
  "Mrs. Wang",
  "Ben",
  "Her brother",
];

const mannerRows = everyPair(manners, mannerSubjects);

const mannerChoiceBank: readonly ChoiceItem[] = interleave([
  mannerRows.map(
    ([[adjective, adverb, , verb, misspelt], subject]): ChoiceItem => [
      `${subject} ${verb} ___. (${adjective})`,
      adverb,
      [adjective, misspelt],
    ],
  ),
  mannerRows.map(
    ([[adjective, adverb, person, , misspelt], subject]): ChoiceItem => [
      `${subject} is a ___ ${person}. (${adjective})`,
      adjective,
      [adverb, misspelt],
    ],
  ),
]);

const mannerTypedBank: readonly TypedItem[] = mannerRows.map(
  ([[adjective, adverb, person, verb, misspelt], subject]): TypedItem => ({
    shown: `${subject} is a ${adjective} ${person}.`,
    instruction: t(`Use: ${subject} ${verb} …`, `使用：${subject} ${verb} …`),
    accepted: [`${subject} ${verb} ${adverb}.`],
    wrong: [`${subject} ${verb} ${adjective}.`, `${subject} ${verb} ${misspelt}.`],
  }),
);

/** mannerOf finds the row of manners for an adjective. */
const mannerOf = (adjective: string) => manners.find(([a]) => a === adjective);

/** adverbRule says how an adjective becomes its adverb. */
const adverbRule = (adjective: string, adverb: string): Text =>
  adjective === "good"
    ? t("*good* has an adverb of its own, *well*", "*good* 有自己的副词 *well*")
    : t(`*${adjective}* just adds *-ly* to make *${adverb}*`, `*${adjective}* 直接加 *-ly* 变成 *${adverb}*`);

/** mannerWhy explains an adjective before a noun or an adverb after a verb. */
const mannerWhy = (right: string, shown: string): Text => {
  const adjective = /\((\w+)\)$/u.exec(shown)?.[1] ?? "";
  const [, adverb = "", person = "", verb = ""] = mannerOf(adjective) ?? [];
  if (/ is a ___/u.test(shown))
    return t(
      `The gap comes before the noun *${person}* and says what the person is like, so it needs the adjective: ${fill(shown, right)}\n\n**Check.** Look directly after the gap: the noun *${person}* follows, so the adjective *${right}*—not the adverb—is required.`,
      `空白在名词 *${person}* 前面，说明这个人是什么样的，所以用形容词：${fill(shown, right)}\n\n**检验。** 看空白后面：紧跟名词 *${person}*，所以必须用形容词 *${right}*，不用副词。`,
    );
  const rule = adverbRule(adjective, adverb);
  return t(
    `The gap comes after the verb *${verb}* and says how, so it needs the adverb; ${rule.en}: ${fill(shown, right)}\n\n**Check.** Ask what the gap describes: it tells *how* someone ${verb}, so the adverb *${right}* fits.`,
    `空白在动词 *${verb}* 后面，说明动作怎样做，所以用副词；${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 看空白修饰什么：它说明动作 *${verb}* 是怎样进行的，因此要用副词 *${right}*。`,
  );
};

/** whyNotManner explains an adjective after a verb, an adverb before a noun, or a misspelt adverb. */
const whyNotManner = (wrong: string, _right: string, shown: string): Text => {
  const adjective = /\((\w+)\)$/u.exec(shown)?.[1] ?? "";
  const [, adverb = ""] = mannerOf(adjective) ?? [];
  if (wrong === adjective)
    return t(
      `*${wrong}* is an adjective for describing a noun. Here the gap comes after a verb and tells how the action is done.`,
      `*${wrong}* 是修饰名词的形容词。这里空白在动词后面，说明动作怎样做，不能用形容词。`,
    );
  if (wrong === adverb)
    return t(
      `*${wrong}* is an adverb for a verb, but here a noun follows the gap, so an adjective is needed.`,
      `*${wrong}* 是修饰动词的副词，但这里空白后面有名词，需要用形容词。`,
    );
  return t(
    `*${wrong}* is not a valid English form${/ is a ___/u.test(shown) ? ", and before a noun you need the adjective form anyway" : " of this adverb"}.`,
    `*${wrong}* 不是正确的英语词形${/ is a ___/u.test(shown) ? "，而且名词前本来就需要用形容词" : ""}。`,
  );
};

const adverbsOfManner: TopicDef = {
  id: "adverbs-of-manner",
  title: t("Quickly and Carefully", "quickly 和 carefully"),
  summary: t(
    "She runs quickly. He plays well. A word that says how goes after the verb and usually ends in -ly.",
    "She runs quickly. He plays well. 说明“怎样做”的词放在动词后面，通常以 -ly 结尾。",
  ),
  intro: t(
    "Compare *He is a careful driver* (adjective before a noun) with *He drives carefully* (adverb after a verb). When a word tells *how* an action happens, English switches from the adjective to the adverb.",
    "比较 *He is a careful driver*（名词前用形容词）和 *He drives carefully*（动词后用副词）。说明动作“怎样做”时，英语要从形容词切换成副词。",
  ),
  prerequisites: ["adjectives-before-nouns", "a2-words-adverbs"],
  encompasses: [
    { topic: "adjectives-before-nouns", weight: 0.2 },
    { topic: "a2-words-adverbs", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adjective or adverb", "形容词还是副词"),
      t(
        "An adjective says what a person or thing is like, and goes before a noun: *a quick runner*. An adverb says how someone does something, and goes after the verb: *She runs quickly.*\n\n- Most adverbs add *-ly*: *quick → quickly*, *careful → carefully*, *loud → loudly*.\n- *-y* becomes *-ily*: *easy → easily*.\n- *good* becomes *well*: *a good swimmer → She swims well.*\n- *fast* and *hard* do not change: *He runs fast. She works hard.*\n\n> **Watch out.** Do not use *good* after a verb (*She swims good* or *goodly* is wrong—use *well*), and do not put an *-ly* adverb directly before a noun (*a quickly runner* is wrong).",
        "形容词说明人或事物是什么样的，放在名词前：*a quick runner*。副词说明动作怎样做，放在动词后：*She runs quickly.*\n\n- 大多数副词加 *-ly*：*quick → quickly*、*careful → carefully*、*loud → loudly*。\n- 以 *-y* 结尾的变成 *-ily*：*easy → easily*。\n- *good* 变成 *well*：*a good swimmer → She swims well.*\n- *fast* 和 *hard* 不变：*He runs fast. She works hard.*\n\n> **注意。** 动词后面不能用 *good* 或 *goodly*（要说 *She swims well*），名词前面也不要误用 *-ly* 副词（*a quickly runner* 是错的）。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), mannerChoiceBank, mannerWhy, whyNotManner),
    ),
    point(
      "write",
      t("Saying it with an adverb", "用副词表达"),
      t(
        "Say the same thing with the verb and an adverb: *Tom is a careful driver.* → *Tom drives carefully.* Remember *good → well* (*Lin is a good swimmer.* → *Lin swims well.*).\n\n> **Watch out.** Place the adverb after the verb (or after the verb + object) and check the spelling of *-ly* (e.g., *careful* → *carefully*, with two *l*s).",
        "用动词加副词表达同样的意思：*Tom is a careful driver.* → *Tom drives carefully.* 注意 *good → well*（*Lin is a good swimmer.* → *Lin swims well.*）。\n\n> **注意。** 副词放在动词（或动词+宾语）后面，并留意拼写（例如 *careful* → *carefully* 有两个 *l*）。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again, starting with the person and the verb shown.", "用所给的动词改写句子，以人开头。"),
        mannerTypedBank,
        (right, shown) => {
          const adjective = manners.find(([a, , person]) => shown.includes(` ${a} ${person}`))?.[0] ?? "";
          const [, adverb = ""] = mannerOf(adjective) ?? [];
          const rule = adverbRule(adjective, adverb);
          return t(
            `With the verb, the word that says how is an adverb, and it goes after the verb; ${rule.en}: ${right}\n\n**Check.** Verify that the noun phrase (*a ${adjective} ...*) is replaced by the verb followed by the adverb *${adverb}*.`,
            `用动词表达时，说明怎样做的词是副词，放在动词后面；${rule["zh-CN"]}：${right}\n\n**检验。** 确认原句的名词短语（*a ${adjective} ...*）已完整改写成“动词 + 副词 *${adverb}*”。`,
          );
        },
      ),
    ),
  ],
};

// Could for past ability.

const couldLeads: readonly (readonly [string, string])[] = [
  ["I", "I was"],
  ["Lin", "she was"],
  ["My brother", "he was"],
  ["Tom", "he was"],
  ["We", "we were"],
  ["My grandma", "she was"],
];
const couldActs: readonly string[] = [
  "swim across the lake",
  "ride a bike",
  "skate on the ice",
  "climb trees",
  "read English books",
  "play the piano",
  "count to a hundred",
];
const couldAges: readonly string[] = ["four", "five", "six", "seven", "ten"];

const couldName = (subject: string) => (/^(I|Lin|Tom)$/u.test(subject) ? subject : subject.toLowerCase());

// Six leads, seven actions and five ages have no common factor, so 210 rows give every combination once.
const couldRows = combos(210, couldLeads, couldActs, couldAges);

const couldNegatives: readonly string[] = [
  "It was very foggy, so we ___ see the ball.",
  "The music was too loud, so I ___ hear you.",
  "Ana was sick last week, so she ___ play in the match.",
  "The box was too heavy. Tom ___ lift it.",
  "The door was locked, so they ___ get in.",
  "I ___ find my keys this morning, so I was late.",
  "It was dark, and we ___ see the path.",
  "He hurt his leg, so he ___ run in the race.",
  "The test was too hard. I ___ answer the last question.",
  "We ___ go skiing last winter because there was no snow.",
  "The shop was closed, so I ___ buy any milk.",
  "She lost her glasses and ___ read the menu.",
  "The water was too cold. We ___ swim.",
  "My phone was dead, so I ___ call you.",
  "The ice was very thin, so we ___ skate on the lake.",
  "There were no tickets left, so they ___ watch the final.",
];

const couldChoiceBank: readonly ChoiceItem[] = interleave([
  couldRows.map(
    ([[subject, was], act, age]): ChoiceItem => [`When ${was} ${age}, ${couldName(subject)} ___ ${act}.`, "could", ["can", "could to"]],
  ),
  couldNegatives.map((s): ChoiceItem => [s, "couldn't", ["can't", "didn't could"]]),
]);

const couldTypedBank: readonly TypedItem[] = couldRows.map(([[subject, was], act, age], k): TypedItem => {
  const not = k % 4 >= 2;
  const when = `when ${was} ${age}`;
  return {
    shown: `${subject} / ${not ? "not " : ""}${act} / ${when}`,
    accepted: [`${subject} ${not ? "[couldn't|could not]" : "could"} ${act} ${when}.`],
    canonical: `${subject} ${not ? "couldn't" : "could"} ${act} ${when}.`,
    wrong: not
      ? [`${subject} can't ${act} ${when}.`, `${subject} didn't could ${act} ${when}.`]
      : [`${subject} can ${act} ${when}.`, `${subject} could ${act.replace(/^(\w+)/u, "$1ed")} ${when}.`],
  };
});

/** couldWhy explains could or couldn't for an ability in the past. */
const couldWhy = (sentence: string): Text =>
  /couldn't|could not/u.test(sentence)
    ? t(
        `This happened in the past, so *can't* becomes *couldn't*, with the plain verb after it: ${sentence}\n\n**Check.** Verify two things: the past time clue calls for *couldn't* (not *can't* or *didn't could*), and the verb right after it is plain.`,
        `这是过去的事，所以 *can't* 变成 *couldn't*，后面接动词原形：${sentence}\n\n**检验。** 核对两处：过去语境要用 *couldn't*（不用 *can't* 或 *didn't could*），后面紧接动词原形。`,
      )
    : t(
        `This is about the past, so *can* becomes *could*, with the plain verb after it: ${sentence}\n\n**Check.** Verify two things: the past time clue calls for *could* (not *can*), and the verb right after it is plain with no *to*.`,
        `这是过去的事，所以 *can* 变成 *could*，后面接动词原形：${sentence}\n\n**检验。** 核对两处：过去语境要用 *could*（不用 *can*），后面直接接动词原形、不加 *to*。`,
      );

/** whyNotCould explains can for the past, to after could, or did with could. */
const whyNotCould = (wrong: string): Text => {
  if (wrong === "can" || wrong === "can't")
    return t(`*${wrong}* is for the present, but the sentence is about the past.`, `*${wrong}* 用于现在，可这个句子说的是过去的事。`);
  if (wrong === "could to")
    return t("*could* takes the plain verb straight after it, with no *to*.", "*could* 后面直接接动词原形，不加 *to*。");
  return t("*could* makes its own negative directly and never takes *did*.", "*could* 自己直接构成否定，从不和 *did* 连用。");
};

const couldForPastAbility: TopicDef = {
  id: "could-for-past-ability",
  title: t("Could and Couldn't", "could 和 couldn't"),
  summary: t(
    "I could swim when I was five. We couldn't see the ball. Could is can in the past.",
    "I could swim when I was five. We couldn't see the ball. could 是 can 的过去式。",
  ),
  intro: t(
    "Compare *Now I can skate* with *When I was six, I couldn't skate at all*. To talk about what someone was or was not able to do in the past, *can / can't* becomes *could / couldn't*.",
    "比较 *Now I can skate* 和 *When I was six, I couldn't skate at all*。说过去能做或不能做某事时，*can / can't* 变成 *could / couldn't*。",
  ),
  prerequisites: ["can-for-ability", "past-simple-irregular"],
  encompasses: [{ topic: "can-for-ability", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Could or couldn't", "could 还是 couldn't"),
      t(
        "*Could* is the past of *can*: *I can swim now. I could swim when I was five.* The negative is *couldn't* (*could not*): *We couldn't see the ball.*\n\nThe verb after *could* stays in its first form, with no *to*: *She could ride a bike.*\n\n> **Watch out.** Never write *could to* (*could to ride*), never put a past verb after *could* (*could rode*), and never use *didn't* with *could* (*didn't could* is wrong).",
        "*could* 是 *can* 的过去式：*I can swim now. I could swim when I was five.* 否定是 *couldn't*（*could not*）：*We couldn't see the ball.*\n\n*could* 后面的动词用原形，不加 *to*：*She could ride a bike.*\n\n> **注意。** 不要写 *could to*（*could to ride*），不要在 *could* 后面再把动词变过去式（*could rode*），也绝不能把 *didn't* 和 *could* 连用（*didn't could* 是错的）。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        couldChoiceBank,
        (right, shown) => couldWhy(fill(shown, right)),
        whyNotCould,
      ),
    ),
    point(
      "write",
      t("Writing with could", "用 could 写句子"),
      t(
        "Write a sentence from the note with *could* or *couldn't*, and the verb in its first form: *Tom / ride a bike / when he was five* → *Tom could ride a bike when he was five.* *not* in the note means *couldn't*.\n\n> **Watch out.** Keep the action verb plain after *could / couldn't* (no *-ed* and no *to*), and end with a period.",
        "根据笔记用 *could* 或 *couldn't* 写句子，动词用原形：*Tom / ride a bike / when he was five* → *Tom could ride a bike when he was five.* 笔记里有 *not* 就用 *couldn't*。\n\n> **注意。** *could / couldn't* 后面的动词保持原形（不加 *-ed* 也不加 *to*），句末加句号。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), couldTypedBank, couldWhy),
    ),
  ],
};

// Writing about a past event.

const eventBank: readonly WritingItem[] = [
  {
    task: "Write about a football match you played or watched.",
    model:
      'Last Saturday our school team played against Green Park School. It was cold and windy. In the first half, they scored quickly, and we were 1 to 0 behind. Then our coach shouted, "Pass the ball!" After that we played much better. Lily scored a great goal, and Tom scored another one just before the end. We won 2 to 1, and our fans cheered loudly. I was tired but very happy.',
  },
  {
    task: "Write about a race you ran or watched.",
    model:
      "Last month I ran in a 5 km race in the park. There were about two hundred runners. At first I ran too quickly, and I was tired after one kilometer. Then I ran more slowly and carefully. Near the end it started to rain, and I almost slipped on the wet path. Finally I crossed the line. I wasn't the winner, but I finished in thirty minutes. I got a small medal.",
  },
  {
    task: "Write about a game of ping-pong or badminton you played.",
    model:
      "Yesterday I played ping-pong with my cousin Max after school. He is a good player, and he usually beats me. In the first game he played very well and won easily. In the second game I practiced my serve and hit the ball harder. I won 11 to 9. The last game was very close, and we were 10 to 10. Then Max hit the ball into the net. I won the match!",
  },
  {
    task: "Write about a basketball game you played or watched.",
    model:
      "Last Friday I watched my sister's basketball match. Her team played against the best team in the city. At half time her team was 10 points behind. Then my sister scored three baskets quickly. The fans cheered loudly. In the last minute the score was 40 to 40. Finally her friend threw the ball from far away, and it went in. They won 43 to 40.",
  },
  {
    task: "Write about a day you went skating or skiing.",
    model:
      "Last winter my family went skiing in the mountains. It was my first time, and I couldn't stand up at first. A teacher showed me how to move slowly and carefully. I fell many times, but I tried again. In the afternoon I skied down a small hill without falling. My dad took a video of me. In the evening we drank hot chocolate. I was tired but proud.",
  },
  {
    task: "Write about a sports day at your school.",
    model:
      "We had our sports day last Wednesday. In the morning there were races. I ran in the 100 meters, and I came second. Then my class played tug of war against class 5B. We pulled very hard, but they won. After lunch there was a long jump competition. My friend Jack jumped the farthest and won a gold medal. At the end of the day our class got a prize for the most points.",
  },
  {
    task: "Write about a board game you played with your family.",
    model:
      "Last Sunday it rained all day, so my family played a board game. We played in teams: my mom and I against my dad and my brother. We rolled the dice and moved our pieces around the board. At first my dad's team was lucky and moved quickly. Then we got two sixes and caught up. My brother wanted to cheat, but Mom saw him! Finally we won by one point.",
  },
  {
    task: "Write about a swimming competition.",
    model:
      "Last summer I swam in a competition at the city pool. I was very nervous before my race. When the race started, I jumped into the water quickly. I swam as hard as I could. After the turn, I was in third place. In the last few meters I passed one girl. I finished second and got a silver medal. My parents cheered loudly from the seats.",
  },
  {
    task: "Write about a tennis match you played or watched.",
    model:
      "Two weeks ago I watched a tennis final on TV with my grandpa. The players were from Spain and Italy. The Spanish player won the first set easily. Then the Italian player started to play much better. He hit the ball very hard and ran quickly. The match was almost four hours long. Finally the Italian player won. He cried and held the cup over his head.",
  },
  {
    task: "Write about a time your team lost a game.",
    model:
      'Last month our volleyball team played in the school final. We practiced hard for two weeks before the match. But on the day, we played badly. The other team was taller, and they hit the ball very hard. We lost the first set 25 to 15. We played better in the second set, but we lost again. After the match, our coach said, "You can be proud. You tried hard." We are going to practice more.',
  },
  {
    task: "Write about a video game or online game you played with a friend.",
    model:
      'Last Saturday I played an online game with my friend Ken. We were partners, and we played against two other players. First we had to find a key in a castle. Ken found it quickly. Then we had to climb a tall tower. I slipped and fell twice! Finally we reached the top and beat the last level. We shouted with joy. We played for two hours, and then my mom said, "Stop!"',
  },
  {
    task: "Write about a match you saw at a stadium.",
    model:
      "Last year my uncle took me to a baseball game at the stadium. There were thousands of fans, and they were very loud. We bought hot dogs and sat near the field. In the third inning, a player hit the ball out of the stadium. Everyone jumped up and cheered. In the end, our team won 5 to 3. On the way home, I held my new cap and smiled.",
  },
];

const writingAboutAPastEvent = judgedTopic({
  id: "writing-about-a-past-event",
  title: t("Writing About a Past Event", "写过去的一件事"),
  summary: t(
    "Write six to eight sentences about a game, a race or a match: what happened, in order, and how it ended.",
    "写六到八句话，讲一场游戏、赛跑或比赛：按顺序讲发生了什么，以及结果如何。",
  ),
  intro: t(
    "A lively match report takes the reader from kickoff to the final whistle: *Last Friday our class ran a relay race. At first we fell behind, then Maya ran quickly and passed two runners. Finally we finished first.*",
    "精彩的比赛记叙会带读者从开场走到终场：*Last Friday our class ran a relay race. At first we fell behind, then Maya ran quickly and passed two runners. Finally we finished first.*",
  ),
  prerequisites: ["writing-sentences-in-the-past", "adverbs-of-manner"],
  encompasses: [
    { topic: "writing-sentences-in-the-past", weight: 0.3 },
    { topic: "adverbs-of-manner", weight: 0.2 },
  ],
  criteria: ["a2-past-simple", "a2-events-in-order", "a2-event-ending", "a1-sentences"],
  point: {
    id: "event",
    title: t("What happened and how it ended", "发生了什么，结果如何"),
    explanation: t(
      "Tell the story in the past simple, in order:\n\n- When and where it was, and who played: *Last Saturday our team played against Green Park School.*\n- What happened, step by step, with *then*, *after that*, *finally*: *Then our coach shouted. After that we played better.*\n- How it ended: *We won 2 to 1.* *I came second.*\n\nWords like *quickly*, *loudly* and *hard* say how things happened.\n\n> **Watch out.** Keep every event verb in the past simple and make sure you clearly state how the game or race ended.",
      "用一般过去时按顺序讲故事：\n\n- 什么时候、在哪里、谁参加：*Last Saturday our team played against Green Park School.*\n- 按顺序讲发生了什么，用 *then*、*after that*、*finally*：*Then our coach shouted. After that we played better.*\n- 结果如何：*We won 2 to 1.* *I came second.*\n\n用 *quickly*、*loudly*、*hard* 等副词说明事情是怎样发生的。\n\n> **注意。** 全文叙事动词保持一般过去时，并务必清楚交代比赛或活动的最终结果。",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the event the task names: what happened, in order, and how it ended.",
    "根据题目用英语写六到八句话：按顺序讲发生了什么，以及结果如何。",
  ),
  bank: eventBank,
  limits: { minWords: 45, maxChars: 900 },
  what: t("story", "记叙"),
});

/** topics are the topics of the unit Sports and Games. */
export const topics: readonly TopicDef[] = [
  sports.topic,
  competition.topic,
  movement.topic,
  games.topic,
  adverbWords.topic,
  adverbsOfManner,
  couldForPastAbility,
  writingAboutAPastEvent,
];

/** vocabulary are the words the unit Sports and Games teaches. */
export const vocabulary: readonly WordBatch[] = [sports.batch, competition.batch, movement.batch, games.batch, adverbWords.batch];
