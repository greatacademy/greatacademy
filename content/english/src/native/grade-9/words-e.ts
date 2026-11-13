// Grade 9: the batches of phrasal verbs: of starting and stopping, of solving problems, of people, of more and
// less, of breaking and building, of meeting and arriving, of coping and of papers and things.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const starting = batch(
  "phrasal-verbs-of-starting-and-stopping",
  ["Phrasal Verbs of Starting and Stopping", "开始与停止的短语动词"],
  ["beginning, leaving, delaying, cancelling and quitting", "开始、出发、推迟、取消与放弃"],
  `
  set off|to begin a journey; to cause to go off|出发；引发|We ___ at dawn.|Smoke may ___ the alarm.|They ___ for the coast.|put off,give in|setting off
  kick off|to start a football game; to begin|开球；开始|The match will ___ at three.|Let's ___ the meeting.|We ___ the year with a party.|set off,take off|kicked off,kicking off
  take off|to leave the ground; to remove clothes; to succeed suddenly|起飞；脱下；走红|The plane will ___ soon.|___ your shoes.|Her career began to ___.|kick off,drop out|took off,taken off,taking off
  put off|to delay; to make someone dislike|推迟；使反感|Don't ___ your homework.|The smell may ___ diners.|We had to ___ the trip.|give in,step down|putting off
  call off|to cancel|取消|They had to ___ the game.|Don't ___ the wedding.|Rain made us ___ the picnic.|back down,step down|called off,calling off
  give up|to stop trying; to stop a habit|放弃；戒除|Never ___.|He chose to ___ smoking.|Don't ___ on your dreams.|kick off,call off|gave up,given up,giving up
  give in|to stop resisting; to hand in work|屈服；交上|We will never ___.|Don't ___ to their demands.|Please ___ your essays.|kick off,call off|gave in,given in,giving in
  drop out|to leave school or a race before the end|退学；退出|He chose to ___ of college.|Two runners had to ___.|Don't ___ now.|put off,call off|dropped out,dropping out
  step down|to resign from a job or position|辞职，下台|The mayor chose to ___.|She will ___ as captain.|He refused to ___.|kick off,put off|stepped down,stepping down
  back down|to give up a claim or argument|让步|Neither side would ___.|The boss had to ___.|Don't ___ now.|kick off,take off|backed down,backing down
  `,
);

const solving = batch(
  "phrasal-verbs-of-solving-problems",
  ["Phrasal Verbs of Solving Problems", "解决问题的短语动词"],
  ["understanding, finding, checking and thinking up", "弄懂、发现、调查与想出"],
  `
  figure out|to come to understand; to solve|弄清楚|I can't ___ this puzzle.|Let's ___ a plan.|She tried to ___ what he meant.|point out,rule out|figured out,figuring out
  work out|to solve; to exercise; to turn out well|解决；锻炼；进展顺利|___ the answer to the sum in your head.|He likes to ___ at the gym.|I hope it will ___.|point out,rule out|worked out,working out
  sort out|to organize; to resolve a problem|整理；解决|We need to ___ this mess.|___ your desk.|Let's ___ the quarrel.|point out,rule out|sorted out,sorting out
  deal with|to take action to solve; to handle|处理|We must ___ the problem.|How do you ___ stress?|I'll ___ it later.|rule out,come up with|dealt with,dealing with
  find out|to discover a fact|查明，发现|Did you ___ his name?|We'll soon ___.|___ when the bus leaves.|rule out,think over|found out,finding out
  look into|to investigate|调查|Police will ___ the case.|I'll ___ it for you.|We need to ___ the cost.|point out,come up with|looked into,looking into
  rule out|to exclude as a possibility|排除|We can't ___ rain.|Doctors were able to ___ cancer.|Don't ___ anything yet.|come up with,think over|ruled out,ruling out
  point out|to draw attention to|指出|She was quick to ___ the error.|Let me ___ one thing you missed.|He tried to ___ the danger.|come up with,think over|pointed out,pointing out
  think over|to consider carefully|仔细考虑|Let me ___ the offer.|___ what I said.|She asked for time to ___ it.|come up with,figure out|thought over,thinking over
  come up with|to produce an idea or plan|想出|Can you ___ a better idea?|She tried to ___ the money.|We must ___ a name.|think over,find out|came up with,coming up with
  `,
);

const people = batch(
  "phrasal-verbs-of-people",
  ["Phrasal Verbs of People", "人际关系的短语动词"],
  ["caring, resembling, raising, trusting and quarrelling", "照顾、相像、抚养、信赖与争吵"],
  `
  get along|to have a friendly relationship|相处融洽|Do you ___ with your sister?|The two dogs ___ well.|We ___ fine.|make up,count on|got along,getting along
  look after|to take care of|照顾|Can you ___ my cat?|She has to ___ her brother while Mom is at work.|___ yourself.|bring up,take after|looked after,looking after
  take after|to resemble a parent or relative|长得像|You ___ your father.|She seems to ___ her aunt.|Which parent do you ___?|look after,bring up|took after,taking after
  bring up|to raise a child; to mention a subject|抚养；提出|Her grandmother had to ___ her.|Don't ___ politics.|It is hard to ___ twins.|take after,get along|brought up,bringing up
  let down|to disappoint; to fail to support|使失望|Don't ___ your team.|I won't ___ you.|He would never ___ a friend.|get along,take after|letting down
  count on|to rely on|依靠|You can ___ me.|Don't ___ good weather.|We ___ your help.|stand up for,let down|counted on,counting on
  stand up for|to defend or support|维护|___ your rights.|She chose to ___ her friend.|He would always ___ the weak.|count on,look down on|stood up for,standing up for
  look down on|to think oneself better than|看不起|Don't ___ others.|They tend to ___ the poor.|She would never ___ anyone.|get along,take after|looked down on,looking down on
  tell off|to scold|责骂|Mom had to ___ me.|The coach began to ___ the team.|Don't ___ the child.|get along,take after|told off,telling off
  make up|to become friends again after a quarrel; to invent|和好；编造|Let's kiss and ___.|Don't ___ stories.|She tried to ___ an excuse.|get along,let down|made up,making up
  `,
);

const less = batch(
  "phrasal-verbs-of-more-and-less",
  ["Phrasal Verbs of More and Less", "增减的短语动词"],
  ["using up, running short, wearing out, dying out and keeping pace", "用完、短缺、磨损、灭绝与跟上"],
  `
  cut down|to reduce; to fell a tree|削减；砍倒|Try to ___ on sugar.|They chose to ___ the old oak.|We must ___ costs.|use up,wipe out|cutting down
  use up|to finish a supply of something|用完|Don't ___ all the milk.|We may ___ our savings.|She began to ___ the paper.|run out,fill up|used up,using up
  run out|to have no more left|耗尽|We'll ___ of time.|Don't let the gas ___.|Food may ___ soon.|fill up,keep up|ran out,running out
  sell out|to sell all of something; to betray|售罄；出卖|Tickets will ___ fast.|He chose to ___ his friends.|The shop may ___ of bread.|die out,wipe out|sold out,selling out
  wear out|to become useless from use; to exhaust|磨损；使筋疲力尽|My shoes began to ___.|The kids may ___ their mom.|Batteries ___.|die out,use up|wore out,worn out,wearing out
  die out|to disappear completely|灭绝|Many species ___.|The custom began to ___.|The fire began to ___.|wipe out,wear out|died out,dying out
  wipe out|to destroy completely|彻底摧毁|The flood may ___ the village.|Disease began to ___ the herd.|We hope to ___ hunger.|die out,cut down|wiped out,wiping out
  fill up|to make or become full|装满|___ the tank.|The room began to ___.|___ your glass.|use up,keep up|filled up,filling up
  catch up|to reach someone ahead; to do work one has missed|赶上|Wait for me to ___.|I need to ___ on my reading.|She ran to ___ with us.|sell out,fill up|caught up,catching up
  keep up|to move at the same speed; to continue|跟上；保持|Try to ___ with the class.|___ the good work.|I can't ___.|die out,wipe out|kept up,keeping up
  `,
);

const breaking = batch(
  "phrasal-verbs-of-breaking-and-building",
  ["Phrasal Verbs of Breaking and Building", "破坏与建立的短语动词"],
  ["breaking, exploding, knocking down, setting up and turning into", "坏掉、爆炸、拆除、建立与变成"],
  `
  break down|to stop working; to lose control of one's feelings|出故障；情绪崩溃|Our car may ___.|She began to ___ in tears.|Talks may ___.|tear down,turn into|broke down,broken down,breaking down
  break out|to start suddenly; to escape|爆发；逃脱|War may ___.|Two men tried to ___ of jail.|A fire may ___.|break into,blow up|broke out,breaking out
  break into|to enter by force; to suddenly start|闯入；突然开始|Thieves tried to ___ the house.|She began to ___ song.|Don't ___ my car.|break out,tear down|broke into,breaking into
  blow up|to explode; to fill with air; to become angry|爆炸；充气；发怒|The bomb may ___.|___ the balloons.|Dad began to ___ at us.|break down,put out|blew up,blown up,blowing up
  tear down|to demolish|拆毁|They will ___ the old mall.|Don't ___ the poster.|They chose to ___ the wall.|set up,break into|tore down,torn down,tearing down
  fall apart|to break into pieces; to stop working well|散架；崩溃|The old book began to ___.|Their marriage may ___.|My shoes ___.|turn into,put out|fell apart,fallen apart,falling apart
  set up|to establish; to arrange; to trick|建立；安排；陷害|They chose to ___ a business.|___ the chairs.|I was ___!|tear down,turn into|setting up
  put out|to extinguish; to inconvenience|扑灭；给…添麻烦|Firemen tried to ___ the blaze.|I don't want to ___ you.|___ the candles.|blow up,set up|putting out
  turn into|to change into|变成|Water may ___ ice.|The caterpillar will ___ a butterfly.|Don't let a quarrel ___ a fight.|turn out,set up|turned into,turning into
  turn out|to happen in the end; to come to an event; to switch off|结果是；出席；关掉|Things may ___ well.|Thousands ___ to vote.|___ the lights.|turn into,fall apart|turned out,turning out
  `,
);

const meeting = batch(
  "phrasal-verbs-of-meeting-and-arriving",
  ["Phrasal Verbs of Meeting and Arriving", "相遇与到达的短语动词"],
  ["arriving, finding by chance, spending time, waking and calls", "到场、偶遇、闲逛、醒来与电话"],
  `
  show up|to arrive; to be seen clearly|出现；显现|He didn't ___ for class.|The stain may ___ in the light.|Guests began to ___.|hang up,hold on|showed up,shown up,showing up
  turn up|to arrive, often unexpectedly; to increase volume; to be found|露面；调大；找到|She may ___ late.|___ the music.|The keys will ___.|hang up,hold on|turned up,turning up
  come across|to find or meet by chance; to seem|偶然发现；给人印象|I may ___ an old photo.|She tends to ___ as shy.|Did you ___ my keys?|run into,show up|came across,coming across
  run into|to meet by chance; to crash into; to meet a problem|偶遇；撞上；遭遇|I hope to ___ her at the mall.|The car may ___ a tree.|We may ___ trouble.|hang out,wake up|ran into,running into
  hang out|to spend time relaxing|闲逛|We ___ at the mall.|Let's ___ this weekend.|They like to ___ together.|hang up,run into|hung out,hanging out
  hang up|to end a phone call; to put on a hook|挂电话；挂起|Don't ___ on me.|___ your coat.|She chose to ___ the phone and end the call.|hang out,hold on|hung up,hanging up
  hold on|to wait; to grip tightly|稍等；抓紧|___ a minute.|___ to the rail.|Please ___ while I check.|hang up,wake up|held on,holding on
  wake up|to stop sleeping|醒来|I ___ at seven.|___; it's late!|The noise may ___ the baby.|hold on,check in|woke up,woken up,waking up
  check in|to register at a hotel or airport|登记入住；办理登机|We ___ at the hotel desk at noon.|___ two hours before your flight.|Where do we ___?|show up,pick up|checked in,checking in
  pick up|to lift; to collect; to learn without trying|捡起；接；学会|___ your toys.|I'll ___ you at six.|Kids ___ languages fast.|turn up,check in|picked up,picking up
  `,
);

const coping = batch(
  "phrasal-verbs-of-coping",
  ["Phrasal Verbs of Coping", "应对的短语动词"],
  ["recovering, managing, tolerating, calming and admitting", "康复、勉强维持、忍受、平静与承认"],
  `
  get over|to recover from|从…中恢复|It took months to ___ the flu.|She can't ___ her loss.|You'll ___ it.|pull through,get by|got over,gotten over,getting over
  pull through|to survive a serious illness or difficulty|渡过难关|Doctors say he will ___.|We'll ___ somehow.|The firm may ___.|get over,live up to|pulled through,pulling through
  get by|to manage with difficulty|勉强维持|We ___ on little money.|I can ___ in French.|How do they ___?|do without,put up with|got by,getting by
  do without|to manage without something|没有…也行|We can ___ a car.|I can't ___ coffee.|There's no milk, so you'll have to ___ it.|get by,own up|did without,done without,doing without
  put up with|to tolerate|忍受|I can't ___ the noise.|She has to ___ a lot.|Why ___ his rudeness?|do without,calm down|putting up with
  calm down|to become quiet and relaxed|冷静下来|___; it's okay.|The sea began to ___.|Try to ___ before you speak.|get by,live up to|calmed down,calming down
  cheer up|to become or make happier|振作起来|___; it's not so bad.|The gift may ___ her.|Flowers ___ a room.|live up to,own up|cheered up,cheering up
  settle down|to become calm; to start a quiet stable life|安静下来；安顿下来|Class, ___!|They hope to ___ and have kids.|The baby began to ___.|get by,own up|settled down,settling down
  live up to|to be as good as expected|不辜负|The film did not ___ the hype.|Try to ___ your name.|It's hard to ___ such praise.|settle down,pull through|lived up to,living up to
  own up|to admit to a wrongdoing|坦白承认|He chose to ___ to the theft.|Nobody would ___.|You should ___.|cheer up,put up with|owned up,owning up
  `,
);

const papers = batch(
  "phrasal-verbs-of-papers-and-things",
  ["Phrasal Verbs of Papers and Things", "文件与物品的短语动词"],
  ["handing in, filling in, getting rid of, saving and giving", "上交、填写、丢掉、保存与赠送"],
  `
  hand in|to give work to a teacher or official|上交|___ your essays by Friday.|She chose to ___ her notice.|Please ___ the forms at the desk when you finish.|fill in,give away|handed in,handing in
  fill in|to complete a form; to substitute|填写；代替|___ the blanks.|Can you ___ for me today?|___ your name here.|hand in,cross out|filled in,filling in
  cross out|to draw a line through words|划掉|___ the wrong answer.|She chose to ___ his name.|Don't ___ too much.|fill in,look up|crossed out,crossing out
  look up|to search for a word or fact; to improve|查找；好转|___ the word in a dictionary.|Things began to ___.|I'll ___ his number.|cross out,back up|looked up,looking up
  back up|to support; to make a copy of computer data; to reverse|支持；备份；倒车|My friends will ___ me.|___ your files.|___ the car slowly.|look up,set aside|backed up,backing up
  set aside|to save for a purpose; to ignore|留出；搁置|___ some money each week.|Let's ___ our differences.|She chose to ___ time to read.|back up,chip in|setting aside
  give away|to give for free; to reveal a secret|赠送；泄露|They ___ free samples.|Don't ___ the ending.|She chose to ___ her old toys to poor children.|throw away,get rid of|gave away,given away,giving away
  throw away|to put in the trash; to waste|扔掉；浪费|Don't ___ the box.|Don't ___ your chance.|___ the old milk.|chip in,look up|threw away,thrown away,throwing away
  get rid of|to remove or throw away something unwanted|除掉|We must ___ the mice.|___ that old sofa.|I can't ___ this cold.|chip in,look up|got rid of,getting rid of
  chip in|to contribute money or help|凑钱；插话|We all ___ for the gift.|Can you ___ five dollars?|Everyone will ___.|set aside,hand in|chipped in,chipping in
  `,
);

/** batchesE are the batches of phrasal verbs of starting, solving, people, more and less, breaking, meeting, coping and papers. */
export const batchesE: readonly BatchSpec[] = [starting, solving, people, less, breaking, meeting, coping, papers];
