// Grade 7: the batches of words of the first five units, from debate, courts and rules to the deep sea, the
// Renaissance, the empires of West Africa and the fight against disease.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const debate = batch(
  "words-of-debate",
  ["Words of Debate", "辩论的词"],
  ["debate and discussion", "辩论与讨论"],
  `
  stance|a position or opinion that someone takes on a question|立场|Each speaker had to state a clear ___ on school uniforms: for them or against them.|Her ___ on homework changed from against to for after she read the study.|The mayor refused to state his ___, for or against, until the facts were in.|dispute,objection|stances
  compromise|an agreement in which each side gives up part of what it wants|妥协，折中|After an hour of arguing, the two teams reached a fair ___ in which each gave up a little.|A good ___ left both sides partly happy, since neither got everything it wanted.|The class and the teacher agreed on a simple ___: phones allowed at lunch but not in lessons.|objection,dispute|compromises,compromised
  advocate|a person who speaks in support of a cause or another person|倡导者，拥护者|Every student needs one teacher who acts as their ___ and speaks up for them at meetings.|My grandmother had no one to speak for her in the hospital until my aunt became her ___.|The nurse became a tireless ___ for patients who were too sick to speak for themselves.|proponent,moderator|advocates
  deliberate|done on purpose, after careful thought|故意的，深思熟虑的|My little brother knocked the tower down on purpose: it was a ___ act, not an accident.|Before the debate, she made the ___ choice to speak last, after thinking it over for days.|The coach's ___ silence was planned: he wanted the players to find the mistake themselves.|unanimous,mandatory|deliberately
  dispute|a disagreement or argument, often a serious one|争端，争论|The angry ___ between the two shops over the parking lot went on for months.|The two neighbors finally settled their ___ about the fence in a calm meeting.|A loud ___ between the players about the score stopped the game for ten minutes.|objection,compromise|disputes,disputed
  objection|a reason given for not agreeing with something|异议，反对的理由|My main ___ to the plan is its cost: we cannot pay for it.|The teacher listened to each student's ___, every reason against the new seating plan, before deciding.|She stood up to raise one ___: no one had read the plan before the vote.|dispute,stance|objections
  unanimous|agreed on by everyone in a group|一致同意的|Every one of the twenty hands went up, so the vote to add a recycling bin was ___.|All five judges agreed on the winner, so their decision was ___.|Not one member of the club said no, so the choice was ___.|deliberate,mandatory|unanimously
  moderator|a person who runs a debate or discussion and keeps it fair|主持人，仲裁人|The ___ gave each speaker exactly two minutes to answer and took no side.|When the debate grew loud, the ___ asked both teams for quiet so it could go on fairly.|Our teacher acted as ___ for the class discussion, calling on each side in turn.|advocate,proponent|moderators
  proponent|a person who argues in favor of an idea or plan|支持者，提倡者|At the meeting, one ___ of the new bike lanes argued that they would make the streets safer.|He is a strong ___ of a longer lunch break and gives three reasons for it in every debate.|Every ___ of the plan had to explain, in one minute, why it was a good idea.|moderator,sponsor|proponents
  concur|to agree with someone or with an opinion|同意，赞同|I ___ with my partner: the second reason is the strongest.|Most scientists ___ that the climate is warming.|The two judges did not ___ on the winner, so a third judge had to decide.|comply,endorse|concurs,concurred
  `,
  "words-of-argument",
  {
    intro: t(
      "The **moderator** called for quiet, and a **proponent** of the new bus route stated her **stance** before the first **objection** came from the back row. These ten words help you follow a debate and say exactly where people stand.",
      "主持人（**moderator**）请大家安静，一位新公交路线的支持者（**proponent**）先表明了自己的立场（**stance**），随后后排就有人提出了第一条异议（**objection**）。这十个词帮你看懂一场辩论，并说清每个人的立场。",
    ),
    watchOut: {
      meanings: t(
        "Tell **stance** (your whole position, for *or* against) apart from **objection** (one reason *against*) and **dispute** (an argument *between* two sides).",
        "分清 **stance**（整体立场，可赞成也可反对）、**objection**（一条反对的理由）和 **dispute**（双方之间的争执）。",
      ),
      use: t(
        "Tell **advocate** (speaks up for a *person* or a cause) apart from **proponent** (argues for an *idea or plan*) and **moderator** (runs the debate and takes *no* side).",
        "分清 **advocate**（为某人或某项事业说话）、**proponent**（支持某个想法或计划）和 **moderator**（主持辩论、不站任何一边）。",
      ),
      spelling: t(
        "Watch **unanimous** (*-mous* like *famous*), **concur** (one *r*, but *concurred* doubles it), **proponent** (*-ent*) and **moderator** (*-or*, not *-er*).",
        "注意 **unanimous** 的 **-mous**（同 famous）、**concur** 只有一个 **r** 但 concurred 双写、**proponent** 的 **-ent**，以及 **moderator** 的 **-or**（不是 -er）。",
      ),
    },
    notes: `
      stance|a speaker stating whether they are for or against school uniforms|an opinion on homework that switched from against to for|a mayor who would not say whether he was for or against until the facts were in|stance is your whole position, for or against; objection is only a reason against|stance 是整体立场，可赞成可反对；objection 只是反对的理由|dispute is a disagreement between two or more sides, not the position one person takes on a question|dispute 是两方或多方之间的争执，不是一个人对某个问题所持的立场|objection is a reason for being against something, so it cannot also be a position in favor|objection 是反对某事的理由，不可能同时是赞成的立场|st · ance|the -ance ending, not -ence|结尾是 -ance，不是 -ence
      compromise|two teams ending an hour of arguing by each giving up a little|an agreement that left both sides partly happy because neither got everything|a class and a teacher agreeing to allow phones at lunch but not in lessons|compromise is an agreement that ends an argument; dispute is the argument itself|compromise 是结束争执的协议；dispute 是争执本身|objection is a reason one side gives against a plan, not an agreement that both sides accept|objection 是一方反对计划的理由，不是双方都接受的协议|dispute is a disagreement between sides, the opposite of an agreement that settles it|dispute 是双方的分歧，和平息分歧的协议正相反|com · pro · mise|the -mise ending, not -mize|结尾是 -mise，不是 -mize
      advocate|a teacher who speaks up for a student at meetings|an aunt who speaks for her mother in the hospital|a nurse speaking for patients too sick to speak for themselves|advocate speaks up for a person or a cause; proponent argues for an idea or plan|advocate 为人或事业发声；proponent 支持某个想法或计划|proponent is someone who argues for an idea or a plan, not someone who speaks up for another person|proponent 是支持某个想法或计划的人，不是替另一个人说话的人|moderator runs a discussion and stays fair to every side, so does not speak for one person|moderator 主持讨论、对各方保持公正，不会替某一个人说话|ad · vo · cate|the -ate ending (it says /ət/ in the noun)|结尾是 -ate（作名词时读 /ət/）
      deliberate|a little brother knocking a tower down on purpose|a choice to speak last after days of thinking it over|a coach staying silent on purpose so his players would find the mistake|deliberate means done on purpose by choice; mandatory means required by a rule|deliberate 是有意为之；mandatory 是规定必须做|unanimous means agreed on by everyone in a group, which tells how many agreed, not whether an act was done on purpose|unanimous 指全体一致同意，说的是多少人同意，不是某个行为是否有意为之|mandatory means required by a rule, so it says something had to be done, not that someone chose to do it on purpose|mandatory 指规定必须做，说的是不得不做，而不是有人故意选择去做|de · lib · er · ate|the e after d and the -ate ending|d 后面是 e，结尾是 -ate
      dispute|two shops arguing angrily for months over a parking lot|two neighbors settling an argument about a fence|players arguing loudly about the score in the middle of a game|dispute is an argument between sides; objection is one side's reason against|dispute 是双方的争执；objection 是一方提出的反对理由|objection is one side's reason for not agreeing, not an argument that goes on between two sides|objection 是一方不同意的理由，不是双方之间持续的争吵|compromise is an agreement that ends an argument, not the argument itself|compromise 是结束争执的协议，不是争执本身|dis · pute|the -ute ending with a silent e|结尾是 -ute，e 不发音
      objection|a plan that costs more than anyone can pay|students' reasons against a new seating plan|a complaint that no one had read the plan before the vote|objection is one reason against; dispute is a whole argument between sides|objection 是一条反对理由；dispute 是双方的整场争执|dispute is an argument between sides, not one reason someone gives against a plan|dispute 是双方的争执，不是某人对计划提出的一条反对理由|stance is the whole position you take, for or against, not a single reason against something|stance 是你所持的整体立场，可赞成可反对，不是一条反对的理由|ob · jec · tion|the j in -jec- and the -tion ending|-jec- 中的 j 和结尾 -tion
      unanimous|twenty hands going up in a vote for a recycling bin|five judges all agreeing on the winner|a club choice that not one member said no to|unanimous means everyone agreed; deliberate means done on purpose|unanimous 是全体一致；deliberate 是有意为之|deliberate means done on purpose after careful thought, which says nothing about whether everyone agreed|deliberate 指经过思考有意去做，和是否人人同意无关|mandatory means required by a rule, which says nothing about how many people agreed|mandatory 指规定必须做，和多少人同意无关|u · nan · i · mous|one n after u and the -mous ending, as in famous|u 后面只有一个 n，结尾是 -mous，同 famous
      moderator|a person giving each speaker two minutes and taking no side|a person asking both loud teams for quiet so the debate stays fair|a teacher calling on each side of a discussion in turn|moderator runs a debate and takes no side; advocate speaks for one side|moderator 主持辩论、不偏不倚；advocate 为一方说话|advocate speaks in support of one cause or person, not someone who keeps every side fair|advocate 支持某一方或某个人，不是让各方公平发言的人|proponent argues for one idea, while the person who runs a discussion must stay on no side|proponent 支持某一个想法，而主持讨论的人不能站在任何一边|mod · er · a · tor|the -or ending, not -er|结尾是 -or，不是 -er
      proponent|a person arguing that new bike lanes would make streets safer|a student giving three reasons for a longer lunch break in every debate|supporters each explaining why a plan was a good idea|proponent argues for an idea; moderator stays neutral|proponent 支持某个想法；moderator 保持中立|moderator runs a debate and stays fair to both sides, not someone who argues for one idea|moderator 主持辩论、对双方保持公正，不是支持某个想法的人|sponsor pays for an event in return for advertising, not someone who gives reasons in favor of an idea|sponsor 出钱赞助活动以换取广告，不是为某个想法讲理由的人|pro · po · nent|the -ent ending, not -ant|结尾是 -ent，不是 -ant
      concur|a speaker agreeing with a partner about the strongest reason|scientists agreeing that the climate is warming|two judges who could not agree on a winner|concur means to share an opinion; comply means to obey a rule|concur 是意见一致；comply 是服从规定|comply means to do what a rule or an order says, not to share someone's opinion|comply 是照规定或命令去做，不是和别人意见一致|endorse means to say in public that you support a person or a product, not to hold the same opinion as someone|endorse 是公开表示支持某人或某产品，不是和别人持相同看法|con · cur|one r in concur, but double r in concurred|concur 只有一个 r，concurred 双写 r
    `,
  },
);

const courts = batch(
  "words-of-law-and-courts",
  ["Words of Law and Courts", "法律与法庭的词"],
  ["law and courts", "法律与法庭"],
  `
  defendant|the person in a court case who is accused of something|被告|The ___ sat quietly while the charges against him were read.|The jury believed the ___ was telling the truth when he denied taking the money.|As the person accused of the crime, the ___ has the right to a lawyer.|plaintiff,prosecutor|defendants
  prosecutor|the lawyer who tries to prove in court that someone is guilty|检察官，公诉人|The ___ showed the jury a photograph to prove that the accused man was guilty.|Speaking for the state, the ___ asked the witness questions to show the accused had been at the scene.|The ___ had to prove the crime beyond reasonable doubt, or the accused would go free.|defendant,plaintiff|prosecutors
  acquit|to decide officially in court that someone is not guilty|宣判无罪|With no proof that he was there, the jury voted to ___ the man of all charges.|Without stronger evidence that she is guilty, the court will ___ her, and she will go home free.|The judge said that with no evidence of a crime, he had no choice but to ___ the driver.|appeal,abolish|acquitted,acquits
  plaintiff|the person who brings a case against someone in court|原告|The ___ said the company had sold him a broken car and brought a case against it.|The judge listened to the ___, who had started the case, and then to the company being sued.|The ___ asked the court to make the builder pay for the repairs to her own house.|defendant,attorney|plaintiffs
  lawsuit|a case brought to a court by one person or group against another|诉讼|The family filed a large ___ against the builder whose roof had fallen in.|The ___ between the two companies lasted three years before they settled it.|Bringing your own ___ against a big company can cost a lot of money in lawyers' fees.|appeal,bail|lawsuits
  appeal|to ask a higher court to change a decision; also such a request|上诉|The lawyer said she would ___ the decision to a higher court.|The ___ was heard by three judges of a higher court, who changed the first ruling.|If you lose the case, you can ___ to a higher court.|acquit,lawsuit|appeals,appealed
  innocent|not guilty of a crime or wrong|无罪的，清白的|The court decided that the woman had not stolen the money and was ___.|In many countries, a person is ___ until proven guilty.|He kept saying he had not done the crime, and the video proved he was ___.|guilty,nonviolent
  guilty|having done a crime or wrong|有罪的|The jury found him ___ of stealing the bicycle, and he was sent to prison.|She felt ___ for forgetting her friend's birthday and said sorry three times.|No one can be called ___ of a crime without a fair trial.|innocent,indignant
  bail|money paid so that an accused person can leave jail until the trial|保释金|The judge set ___ at five hundred dollars, so he could leave jail until the trial.|His family paid the ___, and he left jail that night.|Because she might run away before the trial, the court refused ___ and kept her in jail.|appeal,lawsuit
  attorney|a lawyer, someone trained to act for people in court|律师|The ___ explained the law to her client before the trial.|Accused of breaking the window, he hired the best ___ in town to defend him.|Each side, the company and the worker, had its own ___ to speak for it in court.|prosecutor,plaintiff|attorneys
  `,
  "context-clues",
  {
    intro: t(
      "The **plaintiff** sat on one side of the courtroom, the **defendant** on the other, and each whispered to an **attorney** while the judge read the **lawsuit**. These ten words help you follow what happens in a court case, from the charges to the verdict.",
      "原告（**plaintiff**）坐在法庭一侧，被告（**defendant**）坐在另一侧，法官宣读诉状（**lawsuit**）时，双方都在和自己的律师（**attorney**）低声交谈。这十个词帮你看懂一场官司从指控到判决的经过。",
    ),
    watchOut: {
      meanings: t(
        "Tell **plaintiff** (the person who *brings* the case) apart from **defendant** (the person *accused* or sued) and **prosecutor** (the lawyer for the state who tries to prove guilt).",
        "分清 **plaintiff**（提起诉讼的人）、**defendant**（被指控或被起诉的人）和 **prosecutor**（代表国家、证明对方有罪的律师）。",
      ),
      use: t(
        "Tell **acquit** (a court finds someone *not guilty*) apart from **appeal** (ask a *higher* court to change a decision); **innocent** describes the person, **acquit** is what the court does.",
        "分清 **acquit**（法庭判某人无罪）和 **appeal**（请求上级法院改判）；**innocent** 形容人本身，**acquit** 是法庭的行为。",
      ),
      spelling: t(
        "Watch **acquit** (*c* before *qu*), **plaintiff** (double *f*), **attorney** (double *t* and *-ey*) and **guilty** (a silent *u* after *g*).",
        "注意 **acquit** 中 **qu** 前面的 **c**、**plaintiff** 双写 **f**、**attorney** 双写 **t** 和结尾 **-ey**，以及 **guilty** 中 **g** 后面不发音的 **u**。",
      ),
    },
    notes: `
      defendant|an accused man listening to the charges against him|a jury believing an accused man who denied taking money|the accused person's right to a lawyer|defendant is the person accused; plaintiff is the person who brings the case|defendant 是被告；plaintiff 是原告|plaintiff is the person who brings a case against someone, not the person who is accused|plaintiff 是起诉别人的人，不是被指控的人|prosecutor is the lawyer trying to prove guilt, not the accused person|prosecutor 是努力证明对方有罪的律师，不是被指控的人|de · fend · ant|the -ant ending, not -ent|结尾是 -ant，不是 -ent
      prosecutor|a lawyer showing a photograph to prove an accused man guilty|a lawyer for the state questioning a witness about the accused|a lawyer who must prove a crime beyond reasonable doubt|prosecutor works to prove someone guilty; defendant is the person accused|prosecutor 努力证明对方有罪；defendant 是被指控的人|defendant is the person accused in a case, not the lawyer trying to prove someone guilty|defendant 是案件中被指控的人，不是努力证明别人有罪的律师|plaintiff is a person who brings a case for themselves, not the lawyer who works for the state to prove a crime|plaintiff 是为自己提起诉讼的人，不是代表国家证明罪行的律师|pros · e · cu · tor|the -or ending and the c saying /k/|结尾是 -or，c 读 /k/
      acquit|a jury freeing a man when there was no proof he was there|a court letting a woman go home free for lack of evidence|a judge with no evidence of a crime against a driver|acquit means the court finds someone not guilty; appeal means asking a higher court to change a decision|acquit 是法庭判无罪；appeal 是请求上级法院改判|appeal means asking a higher court to change a decision, not deciding that someone is not guilty|appeal 是请求上级法院改变判决，不是判定某人无罪|abolish means to end a law or custom officially, not to free a person by finding them not guilty|abolish 是正式废除法律或习俗，不是判某人无罪并释放|ac · quit|c before qu|qu 前面有一个 c
      plaintiff|a man who brought a case against a company over a broken car|the person who started a case against a company|a woman asking a court to make a builder pay for her house|plaintiff brings the case; defendant is the one it is brought against|plaintiff 提起诉讼；defendant 是被起诉的一方|defendant is the person accused or sued, not the one who brings the case|defendant 是被指控或被起诉的人，不是提起诉讼的人|attorney is a lawyer who acts for others in court, not the person who starts a case for themselves|attorney 是在法庭上代表别人的律师，不是为自己提起诉讼的人|plain · tiff|double f at the end|结尾双写 f
      lawsuit|a family going to court against the builder of a fallen roof|a three-year court case between two companies|the cost of lawyers when you take a big company to court|lawsuit is a new case against someone; appeal asks a higher court to change a decision|lawsuit 是对某人提起的新案件；appeal 是请求上级法院改判|appeal is a request to a higher court to change a decision already made, not a new case brought against someone|appeal 是请求上级法院改变已作出的判决，不是对某人提起的新案件|bail is money paid so an accused person can leave jail, not a case brought against someone|bail 是让被告出狱候审的钱，不是对某人提起的案件|law · suit|ui in suit|suit 中的 ui
      appeal|a lawyer taking a decision to a higher court|three judges of a higher court changing a first ruling|a person who lost a case going to a higher court|appeal asks a higher court to change a decision; acquit means a court finds someone not guilty|appeal 是请求上级法院改判；acquit 是法庭判无罪|acquit means to find someone not guilty, not to ask a higher court to change a decision|acquit 是判某人无罪，不是请求上级法院改判|lawsuit is a new case brought against someone, not a request to change a decision already made|lawsuit 是对某人提起的新案件，不是请求改变已有判决|ap · peal|double p and ea|双写 p，再接 ea
      innocent|a court deciding a woman had not stolen the money|a person treated as not guilty until proven guilty|a video proving a man had not done the crime|innocent means not guilty; guilty means having done it|innocent 是无罪；guilty 是有罪|guilty means having done the crime, the opposite of not guilty|guilty 指犯了罪，与无罪正相反|nonviolent means without using force, which tells how something is done, not whether a person did a crime|nonviolent 指不使用暴力，说的是做事的方式，不是有没有犯罪|in · no · cent|double n and the c saying /s/|双写 n，c 读 /s/
      guilty|a jury sending a bicycle thief to prison|a girl saying sorry three times for forgetting a birthday|the need for a fair trial before calling someone a criminal|guilty means having done wrong; innocent means not having done it|guilty 是做了错事；innocent 是没有做|innocent means not guilty of any crime or wrong, the opposite of having done it|innocent 指没有犯罪或过错，与做了错事正相反|indignant means angry because something seems unfair, not having done something wrong yourself|indignant 指因不公平而气愤，不是自己做了错事|guilt · y|a silent u after g|g 后面的 u 不发音
      bail|a judge setting the money that lets a man leave jail before his trial|a family paying so a man could leave jail that night|a court keeping a woman in jail because she might run away|bail is money paid to leave jail before a trial; appeal is a request to change a decision|bail 是候审期间出狱的保释金；appeal 是请求改判|appeal is a request for a higher court to change a decision, not money paid to leave jail before a trial|appeal 是请求上级法院改判，不是为候审出狱而交的钱|lawsuit is a case brought against someone, not money paid to get out of jail|lawsuit 是对某人提起的诉讼，不是为出狱而交的钱|bail|ai in bail (bale is a bundle of hay)|bail 中是 ai（bale 是一捆干草）
      attorney|a lawyer explaining the law to her client|a lawyer hired to defend a man accused of breaking a window|the lawyers who speak for a company and a worker in court|attorney is any lawyer who acts for a client; prosecutor works for the state to prove guilt|attorney 是为委托人办事的律师；prosecutor 代表国家证明有罪|prosecutor works for the state to prove someone guilty, not a lawyer a person hires to act for them|prosecutor 代表国家证明某人有罪，不是个人聘请来替自己办事的律师|plaintiff is the person who brings a case, not the trained lawyer who acts for someone|plaintiff 是提起诉讼的人，不是受过训练、替人办事的律师|at · tor · ney|double t and the -ey ending|双写 t，结尾是 -ey
    `,
  },
);

const rules = batch(
  "words-of-rules-and-policy",
  ["Words of Rules and Policy", "规定与政策的词"],
  ["rules and the policies of schools and towns", "学校和城镇的规定与政策"],
  `
  mandatory|required by a rule; that must be done|强制的，必须的|Wearing a helmet is ___ in the bike race: riders without one cannot start.|The meeting is ___ for every member of the team, so no one may skip it.|Is the science fair ___, or can we choose not to take part?|optional,oppressive
  ban|an official rule that stops something; also to forbid it|禁令；禁止|The town put a ___ on all fireworks during the dry summer.|The school may ___ phones in class next year, so no one will be allowed to use them.|After the ___ on dumping waste, the river grew cleaner.|curfew,permit|bans,banned
  enforce|to make sure that people obey a rule or law|执行，强制实施|Guards were hired to ___ the rules at the pool and send rule-breakers home.|A rule is useless if no one will ___ it and punish those who break it.|The police began to ___ the new speed limit, stopping every car that went too fast.|comply,prohibit|enforced,enforces
  permit|to allow something; also an official paper that allows it|允许；许可证|The park does not ___ dogs on the beach, so leave yours at home.|Anyone who wants to fish in this lake must first buy a fishing ___ from the town office.|The heavy rain did not ___ us to finish the game, so we went home at half time.|ban,exemption|permits,permitted
  curfew|a rule that people must be home or off the streets by a certain time|宵禁，门禁时间|The camp has a ___ of nine o'clock, when everyone must be back in the tents.|During the storm, the city set a ___: everyone had to be off the streets by dark.|She broke her ___ and came home after midnight.|ban,permit|curfews
  exemption|official permission not to follow a rule that others must follow|豁免，免除|With a doctor's note, Sam got his ___ from gym class and was allowed to skip it.|Because it grows food for the town, the farm was given ___ from the water limits that every home must follow.|No one gets ___ from the safety test: every driver must pass it.|permit,ban|exemptions
  optional|that you may choose to do or not to do|可选的，非强制的|The extra reading is ___: you can skip it, but it will help you.|The trip to the museum is ___ for anyone who wants to go.|Is the uniform ___ on Fridays, or must we wear it?|mandatory,deliberate
  prohibit|to forbid something by a rule or law|禁止|The rules ___ running near the pool, because the floor is slippery.|Many cities ___ smoking in parks to keep the air clean for children.|The new law will ___ plastic bags in shops, so shoppers must bring their own.|permit,enforce|prohibited,prohibits
  comply|to do what a rule or an order says|遵守，服从|Every restaurant must ___ with the health code or it will be closed.|The players refused to ___ with the referee's order to leave the field.|If you do not ___ with the rules, you will lose your place on the team.|enforce,revoke|complies,complied
  revoke|to cancel a right or a permission officially|撤销，吊销|The city can ___ a driver's license for unsafe driving and take it away.|The club voted to ___ his membership after he broke the rules again.|If you park in the wrong place, the school will ___ your parking pass.|prohibit,comply|revoked,revokes
  `,
  "context-clues",
  {
    intro: t(
      "The new sign at the pool said that a swim cap is **mandatory**, that diving is **optional**, and that the guards will **enforce** a **ban** on glass bottles. These ten words help you read the rules of schools and towns and say who must do what.",
      "泳池的新告示写着：泳帽是强制的（**mandatory**），跳水是可选的（**optional**），救生员会执行（**enforce**）玻璃瓶禁令（**ban**）。这十个词帮你读懂学校和城镇的规定，说清谁必须做什么。",
    ),
    watchOut: {
      meanings: t(
        "Tell **permit** (anyone may get it to do something allowed) apart from **exemption** (one person is let off a rule that *everyone else* must follow) and **ban** (nobody may do it).",
        "分清 **permit**（任何人都可以申请、去做被允许的事）、**exemption**（某人被免于遵守别人都得遵守的规定）和 **ban**（谁都不许做）。",
      ),
      use: t(
        "Tell **enforce** (make *other people* obey a rule) apart from **comply** (obey it *yourself*); and tell **prohibit** (forbid something) apart from **revoke** (cancel a right someone already has).",
        "分清 **enforce**（让别人遵守规定）和 **comply**（自己遵守规定）；再分清 **prohibit**（禁止某事）和 **revoke**（撤销别人已有的权利）。",
      ),
      spelling: t(
        "Watch **mandatory** (*-ory*, not *-ary*), **exemption** (a *p* before *-tion*), **curfew** (*-ew*) and **permit** (double *t* in *permitted*).",
        "注意 **mandatory** 的 **-ory**（不是 -ary）、**exemption** 中 **-tion** 前的 **p**、**curfew** 的 **-ew**，以及 **permitted** 双写 **t**。",
      ),
    },
    notes: `
      mandatory|a bike race that riders without a helmet cannot start|a team meeting that no member may skip|a science fair that may or may not be a choice|mandatory means you must; optional means you may choose|mandatory 是必须做；optional 是可以选择|optional means you may choose not to do it, the opposite of required|optional 指可以选择不做，与必须做正相反|oppressive means cruel and unfair in using power, not simply required by a rule|oppressive 指滥用权力、残酷不公，不只是规定必须做|man · da · to · ry|the -ory ending, not -ary|结尾是 -ory，不是 -ary
      ban|a town stopping all fireworks in a dry summer|a school planning to stop phone use in class|an end to dumping waste that made a river cleaner|ban forbids something altogether; curfew only sets a time to be home|ban 是完全禁止；curfew 只规定回家的时间|curfew is a rule about the time people must be home, not a rule that stops something altogether|curfew 是规定几点前必须回家，不是完全禁止某事|permit allows something, the opposite of a rule that forbids it|permit 是允许，与禁止正相反|ban|one n, but double n in banned|只有一个 n，banned 双写 n
      enforce|guards sending rule-breakers home from the pool|a rule that means nothing unless rule-breakers are punished|police stopping every car that goes too fast|enforce means making others obey; comply means obeying yourself|enforce 是让别人遵守；comply 是自己遵守|comply means to obey a rule yourself, not to make other people obey it|comply 是自己遵守规定，不是让别人遵守|prohibit means to forbid something, so it names what is banned rather than making people follow a rule|prohibit 是禁止某事，说的是什么被禁止，不是让人遵守规定|en · force|en- at the start and -ce at the end|开头是 en-，结尾是 -ce
      permit|a park that does not allow dogs on its beach|a paper bought from the town office before fishing in a lake|heavy rain that did not let a game finish|permit means to allow; ban means to forbid|permit 是允许；ban 是禁止|ban means to forbid something, the opposite of allowing it|ban 是禁止，与允许正相反|exemption frees one person from a rule that everyone else must follow, not an ordinary permission that anyone may get|exemption 是让某人免于遵守别人都得遵守的规定，不是人人都能申请的普通许可|per · mit|one t, but double t in permitted|只有一个 t，permitted 双写 t
      curfew|a camp where everyone must be back in the tents by nine|a city ordering everyone off the streets by dark during a storm|a girl coming home after midnight against the rule|curfew sets a time to be home; ban stops something altogether|curfew 规定回家时间；ban 是完全禁止|ban stops something altogether, not just after a certain hour|ban 是完全禁止，不只是过了某个时间才禁止|permit is permission to do something, not a time by which people must be home|permit 是做某事的许可，不是必须回家的时间|cur · few|the -ew ending|结尾是 -ew
      exemption|a doctor's note that lets one student skip gym class|a farm let off the water limits that every home must follow|a safety test that every driver must pass, with no one let off|exemption lets one person skip a rule that others must follow; permit lets anyone do something allowed|exemption 是让某人不必遵守别人都要遵守的规定；permit 是允许人去做被允许的事|permit allows you to do something, not to skip a rule that everyone else must follow|permit 是允许你做某事，不是让你免于遵守别人都得遵守的规定|ban is a rule that forbids something, not being let off a rule that others must follow|ban 是禁止某事的规定，不是被免于遵守别人都要遵守的规定|ex · emp · tion|the p before -tion|-tion 前面有 p
      optional|extra reading that you can skip|a museum trip only for those who want to go|a uniform that students may or may not have to wear on Fridays|optional means you may choose; mandatory means you must|optional 是可选；mandatory 是必须|mandatory means required by a rule, the opposite of something you may skip|mandatory 指规定必须做，与可以不做正相反|deliberate means done on purpose by someone, not something you are free to do or not to do|deliberate 指有人有意去做，不是可做可不做|op · tion · al|-tion followed by -al|-tion 后面接 -al
      prohibit|a pool rule against running on a slippery floor|cities forbidding smoking in parks to keep the air clean|a law stopping shops from giving out plastic bags|prohibit means to forbid; permit means to allow|prohibit 是禁止；permit 是允许|permit means to allow something, the opposite of forbidding it|permit 是允许，与禁止正相反|enforce means to make people obey a rule, not to forbid an action|enforce 是让人遵守规定，不是禁止某个行为|pro · hib · it|the h in -hib- and one t|-hib- 中的 h，只有一个 t
      comply|restaurants that must follow the health code or close|players refusing to obey a referee's order|a team member who must follow the rules to keep a place|comply means obeying yourself; enforce means making others obey|comply 是自己遵守；enforce 是让别人遵守|enforce means to make others obey a rule, not to obey it yourself|enforce 是让别人遵守规定，不是自己遵守|revoke means to cancel a right or a permission, not to do what a rule says|revoke 是撤销权利或许可，不是照规定去做|com · ply|the y at the end, which becomes -ies in complies|结尾是 y，complies 变成 -ies
      revoke|a city taking away a driver's license for unsafe driving|a club ending a member's place after he broke the rules|a school cancelling a parking pass|revoke cancels a right someone already has; prohibit forbids an action|revoke 是撤销已有的权利；prohibit 是禁止某个行为|prohibit means to forbid an action, not to cancel a right or a pass someone already has|prohibit 是禁止某个行为，不是撤销某人已有的权利或通行证|comply means to obey a rule, not to cancel a permission|comply 是遵守规定，不是撤销许可|re · voke|the -oke ending with a silent e|结尾是 -oke，e 不发音
    `,
  },
);

const deepSea = batch(
  "words-of-the-deep-sea",
  ["Words of the Deep Sea", "深海的词"],
  ["the deep sea and the creatures that live there", "深海与深海生物"],
  `
  abyss|a very deep space or hole, such as the deepest part of the ocean|深渊|Sunlight never reaches the ___ at the bottom of the ocean, thousands of meters down.|From the edge of the underwater cliff, the divers stared down into the dark, bottomless ___.|Strange fish with huge eyes live in the ___, where the water is deep, cold and black.|shoal,lagoon|abysses
  submersible|a small vessel that can travel deep under water|潜水器|The scientists climbed into the ___ and rode it two kilometers down.|The ___ had thick windows and bright lights for exploring the sea floor.|A robot ___ dived down to the wreck and took pictures of it.|sonar,glider|submersibles
  bioluminescence|light made by a living thing, such as a jellyfish|生物发光|The squid flashed its ___ to confuse its enemies with sudden light.|At night, the waves glowed blue with the ___ of tiny living things.|In the dark deep sea, the ___ of fish and jellyfish is the only light.|sonar,abyss
  sonar|a way of finding things under water by sending sound and listening for echoes|声呐|The ship sent out sound with its ___ and used the echoes to map the sea floor.|Dolphins use a natural kind of ___, clicking and listening for echoes to find fish.|The echoes picked up by the ___ showed a shipwreck far below.|submersible,bioluminescence
  crustacean|an animal with a hard shell and jointed legs, such as a crab or a lobster|甲壳动物|A crab is a ___, and so is a shrimp: both have hard shells and jointed legs.|The ___ shed its hard shell and grew a new one, as crabs and lobsters do.|The lobster, a ___ with ten jointed legs, crept across the sea floor.|mollusk,scavenger|crustaceans
  tentacle|a long, bendable arm of an animal such as an octopus or a jellyfish|触手，触须|The octopus wrapped one ___ around the rock and held on.|Each ___ of the jellyfish can sting a fish that brushes against it.|Each long ___ of the squid is lined with suckers for grabbing prey.|mollusk,crustacean|tentacles
  buoyant|able to float; also cheerful|有浮力的；轻松愉快的|Salt water is more ___ than fresh water, so it is easier to float in the sea.|The ___ float kept the swimmer's head above the water.|Full of air, the ___ ball bobbed on the surface of the pool.|aerodynamic,elated
  scavenger|an animal that eats dead animals or waste|食腐动物|The hagfish, a ___, feeds on the bodies of dead whales.|The gull is a ___ that eats the scraps people leave behind on the beach.|A ___ such as a vulture cleans up the dead animals that others leave.|carcass,crustacean|scavengers
  mollusk|a soft-bodied animal, often with a shell, such as a snail, a clam or an octopus|软体动物|The octopus is a soft-bodied ___ with no shell at all.|The snail, a ___, pulled its soft body back into its shell.|Clams and oysters are each a kind of ___ with a soft body inside two shells.|crustacean,tentacle|mollusks
  carcass|the dead body of an animal|动物尸体|The dead whale's ___ sank to the bottom and fed sea creatures for years.|Sharks gathered around the ___ of the dead seal to tear at it.|Scavengers cleaned the ___ of the dead deer down to the bones.|scavenger,crustacean|carcasses
  `,
  "context-clues",
  {
    intro: t(
      "Lights on, the **submersible** sank into the **abyss**, where a **tentacle** curled past the window and tiny fish blinked with **bioluminescence**. These ten words help you describe the dark deep sea and the strange creatures that live there.",
      "潜水器（**submersible**）亮着灯沉入深渊（**abyss**），一条触手（**tentacle**）从舷窗外卷过，小鱼闪着生物光（**bioluminescence**）。这十个词帮你描写黑暗的深海和生活在那里的奇特生物。",
    ),
    watchOut: {
      meanings: t(
        "Tell **crustacean** (a *hard* shell and jointed legs, like a crab) apart from **mollusk** (a *soft* body, like a snail or an octopus); **scavenger** says what an animal *eats*, not what it looks like.",
        "分清 **crustacean**（硬壳加分节的腿，如螃蟹）和 **mollusk**（身体柔软，如蜗牛、章鱼）；**scavenger** 说的是动物吃什么，不是它长什么样。",
      ),
      use: t(
        "Tell **sonar** (finds things with *sound* and echoes) apart from **bioluminescence** (*light* that living things make); tell **scavenger** (the animal that eats) apart from **carcass** (the dead body it eats).",
        "分清 **sonar**（用声音和回声找东西）和 **bioluminescence**（生物自己发出的光）；再分清 **scavenger**（吃尸体的动物）和 **carcass**（被吃的尸体）。",
      ),
      spelling: t(
        "Watch **buoyant** (*uo* after *b*), **abyss** (*y* and double *s*), **crustacean** (*-cean* as in *ocean*) and **bioluminescence** (*sc* in *-nescence*).",
        "注意 **buoyant** 中 **b** 后面的 **uo**、**abyss** 的 **y** 和双写 **s**、**crustacean** 的 **-cean**（同 ocean），以及 **bioluminescence** 中 **-nescence** 的 **sc**。",
      ),
    },
    notes: `
      abyss|the bottom of the ocean thousands of meters down where sunlight never reaches|a dark, bottomless drop below an underwater cliff|deep, cold, black water where fish with huge eyes live|abyss is a very deep place; shoal is a shallow one|abyss 是极深之处；shoal 是浅滩|shoal is a place where the water is shallow, the opposite of a very deep space|shoal 是水浅的地方，与极深之处正相反|lagoon is a shallow body of water behind sand or a reef, not the deepest part of the ocean|lagoon 是沙洲或礁石后面的浅水，不是大洋最深处|a · byss|y and double s|有 y，结尾双写 s
      submersible|scientists riding a vessel two kilometers down|a vessel with thick windows and lights for exploring the sea floor|a robot vessel diving to a wreck to take pictures|submersible is a vessel that dives; sonar is a way of finding things with sound|submersible 是会下潜的潜水器；sonar 是用声音探测的方法|sonar is a way of finding things with sound, not a vessel that carries people or cameras under water|sonar 是用声音探测物体的方法，不是载人或载相机下潜的潜水器|glider is an aircraft that flies on currents of air, not a vessel that dives under water|glider 是借气流飞行的滑翔机，不是潜入水下的潜水器|sub · mers · i · ble|the -ible ending, not -able|结尾是 -ible，不是 -able
      bioluminescence|a squid confusing its enemies with sudden flashes of light|waves glowing blue with the light of tiny living things|the only light in the dark deep sea, made by fish and jellyfish|bioluminescence is light from living things; sonar uses sound|bioluminescence 是生物发出的光；sonar 用的是声音|sonar uses sound and echoes, not light made by a living thing|sonar 用的是声音和回声，不是生物发出的光|abyss is a very deep place, not light that animals make|abyss 是极深的地方，不是动物发出的光|bi · o · lu · mi · nes · cence|sc in -nescence|-nescence 中的 sc
      sonar|a ship mapping the sea floor from the echoes of its sound|dolphins clicking and listening for echoes to find fish|echoes revealing a shipwreck far below|sonar finds things with sound; submersible is a vessel that goes down|sonar 靠声音找东西；submersible 是下潜的潜水器|submersible is a small vessel that dives deep, not a way of finding things with sound|submersible 是下潜的小型潜水器，不是用声音探测的方法|bioluminescence is light made by living things, not sound sent out to find things|bioluminescence 是生物发出的光，不是用来探测的声波|so · nar|the -ar ending|结尾是 -ar
      crustacean|crabs and shrimps with hard shells and jointed legs|an animal shedding its hard shell as crabs and lobsters do|a lobster with ten jointed legs crossing the sea floor|crustacean has a hard shell and jointed legs; mollusk has a soft body|crustacean 有硬壳和分节的腿；mollusk 身体柔软|mollusk is a soft-bodied animal, such as a snail or an octopus, without jointed legs|mollusk 是身体柔软的动物，如蜗牛、章鱼，没有分节的腿|scavenger names what an animal eats, dead animals or waste, not an animal with a hard shell and jointed legs|scavenger 说的是动物吃尸体或垃圾，不是有硬壳和分节腿的动物|crus · ta · cean|the -cean ending, as in ocean|结尾是 -cean，同 ocean
      tentacle|an octopus holding on to a rock with one long arm|a jellyfish arm that stings a passing fish|a squid's long arm lined with suckers for grabbing prey|tentacle is one arm of an animal; mollusk is the whole animal|tentacle 是动物的一条触手；mollusk 是整只动物|mollusk is a whole soft-bodied animal, not one long arm of it|mollusk 是整只软体动物，不是它的一条长臂|crustacean is a whole animal with a hard shell, such as a crab, not a long, bendable arm|crustacean 是螃蟹之类有硬壳的整只动物，不是一条可弯曲的长臂|ten · ta · cle|the -cle ending|结尾是 -cle
      buoyant|salt water that makes it easier to float|a float keeping a swimmer's head above water|an air-filled ball bobbing on the surface of a pool|buoyant means able to float; aerodynamic means shaped to move through air|buoyant 是能浮起；aerodynamic 是外形便于在空气中运动|aerodynamic means shaped to move easily through air, not able to float on water|aerodynamic 指外形便于在空气中运动，不是能浮在水上|elated means very happy and excited, a feeling of a person, not the power of a thing to float|elated 指人非常高兴兴奋，不是物体浮起来的能力|buoy · ant|uo after b, as in buoy|b 后面是 uo，同 buoy
      scavenger|a hagfish feeding on the bodies of dead whales|a gull eating scraps that people leave on the beach|a vulture cleaning up dead animals|scavenger is the animal that eats the dead; carcass is the dead body|scavenger 是吃尸体的动物；carcass 是尸体|carcass is the dead body itself, not the living animal that eats it|carcass 是尸体本身，不是吃尸体的活动物|crustacean is a hard-shelled animal with jointed legs, which tells what it looks like, not that it eats dead things|crustacean 是有硬壳和分节腿的动物，说的是长相，不是吃死去的东西|scav · en · ger|g saying /dʒ/ before -er|g 读 /dʒ/，后接 -er
      mollusk|an octopus with a soft body and no shell|a snail pulling its soft body into its shell|clams and oysters with soft bodies inside two shells|mollusk has a soft body; crustacean has a hard shell and jointed legs|mollusk 身体柔软；crustacean 有硬壳和分节的腿|crustacean has a hard shell and jointed legs, not a soft body|crustacean 有硬壳和分节的腿，不是柔软的身体|tentacle is one long arm of an animal, not a whole soft-bodied animal|tentacle 是动物的一条长臂，不是整只软体动物|mol · lusk|double l (British English writes mollusc)|双写 l（英式拼作 mollusc）
      carcass|a dead whale feeding sea creatures for years|sharks tearing at a dead seal|scavengers cleaning a dead deer to the bones|carcass is the dead body; scavenger is the animal that eats it|carcass 是尸体；scavenger 是吃尸体的动物|scavenger is a living animal that eats dead ones, not the dead body itself|scavenger 是吃尸体的活动物，不是尸体本身|crustacean is a living animal with a hard shell, not the body of a dead animal|crustacean 是有硬壳的活动物，不是死去动物的尸体|car · cass|double s at the end|结尾双写 s
    `,
  },
);

const tides = batch(
  "words-of-tides-and-currents",
  ["Words of Tides and Currents", "潮汐与洋流的词"],
  ["tides, currents and the shore", "潮汐、洋流与海岸"],
  `
  current|a steady flow of water or air in one direction|水流，气流|A warm ___ flows steadily north along the coast all year.|The steady ___ carried the bottle in one direction, hundreds of kilometers out to sea.|The boat drifted downstream with the steady ___ of the river.|swell,surge|currents
  lagoon|a shallow body of salt water cut off from the sea by sand or a reef|潟湖|The children swam in the calm ___ that the reef had closed off from the waves.|A strip of sand cut the ___ off from the sea, so its shallow water was warm and still.|Birds nest around the shallow ___ that the coral reef has walled off from the ocean.|inlet,shoal|lagoons
  reef|a line of rock or coral just below or above the surface of the sea|礁，暗礁|Thousands of fish live among the coral of the ___.|The ship tore its hull on the jagged coral of the ___ and began to sink.|The ___, a long line of rock and coral, protects the island from big waves.|shoal,lagoon|reefs
  swell|a slow, rolling movement of the sea, with long waves that do not break|涌浪|The boat rose and fell slowly on the gentle ___.|A long, rolling ___ from a distant storm reached the beach without breaking.|Surfers floated, waiting for the next smooth ___ to lift their boards.|surge,current|swells
  undertow|a current under the surface that pulls water back out to sea|回流，底流|Below the breaking waves, the ___ pulled the swimmer's legs back out to sea.|Lifeguards warned that the ___ beneath the surface was dragging people away from the beach.|Even in water up to your knees, the ___ can drag your feet out from under you as a wave runs back.|surge,swell
  ebb|the flowing of the tide away from the shore; also to flow away|退潮；减退|At ___ tide, the water was low and we could walk out to the rocks.|The sea began to ___ in the afternoon, leaving wet sand behind.|As the danger passed, her fear began to ___ away.|surge,swell|ebbs,ebbed
  surge|a sudden, strong rush forward, as of water|涌动，激增|A storm ___ suddenly flooded the streets near the harbor.|The sudden ___ of water swept the boats up onto the land.|After the whales appeared, a sudden ___ of visitors rushed to the beach.|swell,ebb|surges
  inlet|a narrow strip of water that reaches into the land from the sea|小海湾，水湾|The fishing boats sheltered in a narrow ___ that reached into the land.|At high tide, sea water flows up the ___ far into the land.|Seals rested on the rocks along the narrow arm of sea water, the ___ between two hills.|lagoon,reef|inlets
  shoal|a place where the water is shallow; also a large group of fish|浅滩；鱼群|The captain steered around the sandy ___ where the water was only knee-deep.|A huge ___ of silver fish flashed past the diver.|Ships have run aground on this shallow ___ of sand.|reef,inlet|shoals
  upwelling|the rising of cold, deep water full of food toward the surface|上升流|The ___ brings cold, food-rich water up from the deep, so fish gather there.|Winds along the coast push warm water away, causing the ___ of cold water from below.|Some of the richest fishing grounds lie where the ___ lifts deep, cold water to the surface.|undertow,surge
  `,
  "context-clues",
  {
    intro: t(
      "We swam in the calm **lagoon** behind the **reef**, but the lifeguard warned that past the gap a strong **undertow** pulled at your legs on every **ebb** of the waves. These ten words help you describe how the sea moves along the shore.",
      "我们在礁（**reef**）后平静的潟湖（**lagoon**）里游泳，但救生员提醒：缺口外每当浪退（**ebb**），强劲的回流（**undertow**）就会拽人的腿。这十个词帮你描写大海在岸边如何流动。",
    ),
    watchOut: {
      meanings: t(
        "Tell **lagoon** (water *closed off* from the sea) apart from **inlet** (a narrow arm of sea *open* to it) and **shoal** (a shallow spot, or a crowd of fish).",
        "分清 **lagoon**（与海隔开的水域）、**inlet**（伸进陆地、与海相通的狭长水湾）和 **shoal**（浅滩，或一大群鱼）。",
      ),
      use: t(
        "Tell **swell** (slow, rolling waves) apart from **surge** (a *sudden* rush forward) and **undertow** (a pull back out to sea *under* the surface).",
        "分清 **swell**（缓慢起伏的涌浪）、**surge**（突然向前涌）和 **undertow**（水面下把人往海里拉的回流）。",
      ),
      spelling: t(
        "Watch the doubled letters of **ebb**, **swell**, **reef** and **lagoon**, and **current** (double *r*, not *currant*, the fruit).",
        "注意 **ebb**、**swell**、**reef** 和 **lagoon** 中的双写字母，以及 **current** 双写 **r**（不是水果 currant）。",
      ),
    },
    notes: `
      current|warm water flowing steadily north along a coast all year|a bottle carried steadily in one direction far out to sea|a boat drifting downstream with the flow of a river|current is a steady flow in one direction; swell is waves that rise and fall|current 是朝一个方向的稳定水流；swell 是起伏的涌浪|swell is the slow rise and fall of long waves, not a steady flow in one direction|swell 是长浪缓慢起伏，不是朝一个方向的稳定流动|surge is a sudden, strong rush, not a steady flow that keeps going|surge 是突然的猛涌，不是持续稳定的流动|cur · rent|double r and the -ent ending (currant is a fruit)|双写 r，结尾是 -ent（currant 是一种水果）
      lagoon|calm water that a reef has closed off from the waves|warm, still water cut off from the sea by a strip of sand|shallow water walled off from the ocean by a coral reef|lagoon is closed off from the sea; inlet is open to it|lagoon 与海隔开；inlet 与海相通|inlet is a narrow arm of the sea open to it, not water cut off behind sand or a reef|inlet 是与海相通的狭长水湾，不是被沙洲或礁石隔开的水域|shoal is a shallow spot or a crowd of fish, not a body of water closed off from the sea|shoal 是浅滩或鱼群，不是与海隔开的一片水域|la · goon|double o|双写 o
      reef|thousands of fish living among coral|a ship tearing its hull on jagged coral|a long line of rock and coral protecting an island from big waves|reef is a line of rock or coral; shoal is a shallow sandy place|reef 是一道岩石或珊瑚；shoal 是浅浅的沙滩|shoal is a shallow sandy place or a group of fish, not a line of rock or coral|shoal 是浅沙滩或鱼群，不是一道岩石或珊瑚|lagoon is a body of calm water, not the rock or coral that rises near the surface|lagoon 是一片平静的水域，不是靠近水面的岩石或珊瑚|reef|double e|双写 e
      swell|a boat rising and falling slowly on gentle waves|long, rolling waves from a distant storm that did not break|surfers waiting for a smooth wave to lift their boards|swell is slow and rolling; surge is sudden and strong|swell 缓慢起伏；surge 突然猛烈|surge is a sudden, violent rush forward, not a slow and gentle rolling|surge 是突然猛烈地向前冲，不是缓慢轻柔的起伏|current is a steady flow in one direction, not waves that rise and fall|current 是朝一个方向的稳定流动，不是起伏的波浪|swell|double l|双写 l
      undertow|water below breaking waves pulling a swimmer's legs out to sea|a pull beneath the surface dragging people away from a beach|water running back under a wave and dragging your feet away|undertow pulls back out to sea under the surface; surge rushes forward onto land|undertow 在水下往海里拉；surge 向岸上猛冲|surge is a strong rush forward onto the land, not a pull back out to sea under the surface|surge 是向陆地猛冲，不是在水下往海里拉|swell is the slow rise and fall of the sea's surface, not a pull underneath it|swell 是海面缓慢起伏，不是水下的拉力|un · der · tow|-ow saying /oʊ/ as in low|-ow 读 /oʊ/，同 low
      ebb|low water at the hour when you can walk out to the rocks|the sea flowing away and leaving wet sand behind|fear flowing away as danger passes|ebb is water flowing away; surge is water rushing forward|ebb 是水退去；surge 是水涌来|surge is a sudden rush forward, the opposite of flowing away|surge 是突然向前涌，与退去正相反|swell is the rolling rise and fall of the sea, not water flowing back from the shore|swell 是海水的起伏，不是从岸边退去的水|ebb|double b|双写 b
      surge|a storm suddenly flooding streets near a harbor|a sudden rush of water sweeping boats onto land|a sudden rush of visitors to a beach after whales appeared|surge is a sudden rush; swell is a slow roll|surge 是突然猛涌；swell 是缓慢起伏|swell is a slow, gentle rolling of waves, not a sudden rush|swell 是缓慢轻柔的起伏，不是突然的猛涌|ebb is water flowing away from the shore, the opposite of a rush forward|ebb 是水从岸边退去，与向前猛涌正相反|surge|the -ge ending with a silent e|结尾是 -ge，e 不发音
      inlet|fishing boats sheltering in a narrow arm of the sea|sea water flowing far into the land at high tide|a narrow arm of sea water between two hills where seals rest|inlet is a narrow arm of the sea open to it; lagoon is closed off|inlet 与海相通；lagoon 与海隔开|lagoon is shallow water cut off from the sea, not a narrow arm of the sea reaching into the land|lagoon 是与海隔开的浅水，不是伸进陆地的狭长海湾|reef is a line of rock or coral, not a strip of water|reef 是一道岩石或珊瑚，不是一条水域|in · let|in + let|in 加 let
      shoal|knee-deep water over sand that a captain must steer around|a crowd of silver fish flashing past a diver|shallow sand where ships run aground|shoal is shallow water or a crowd of fish; reef is rock or coral|shoal 是浅滩或鱼群；reef 是岩石或珊瑚|reef is a line of rock or coral, not shallow sand or a group of fish|reef 是一道岩石或珊瑚，不是浅沙或鱼群|inlet is a narrow strip of water reaching into the land, not a shallow place or a crowd of fish|inlet 是伸进陆地的狭长水域，不是浅滩或鱼群|shoal|oa saying /oʊ/|oa 读 /oʊ/
      upwelling|cold, food-rich water rising from the deep where fish gather|cold water rising from below when wind pushes warm water away|deep, cold water lifted to the surface under rich fishing grounds|upwelling is deep water rising; undertow is water pulled back out to sea|upwelling 是深层水上升；undertow 是被拉回海里的水|undertow pulls water back out to sea near the beach, not cold water rising from the deep|undertow 是海滩边把水拉回海里的回流，不是深处冷水上升|surge is a sudden rush of water forward, not cold water slowly rising from below|surge 是水突然向前猛涌，不是冷水从下面慢慢升起|up · well · ing|double l|双写 l
    `,
  },
);

const conservation = batch(
  "words-of-conservation",
  ["Words of Conservation", "生态保护的词"],
  ["protecting wild places and living things", "保护自然环境和生物"],
  `
  conservation|the protection of nature, animals and plants|保护，保育|The group works for the ___ of rare sea turtles, protecting their nests on the beach.|Water ___ means saving every drop during a drought.|She studied ___ so she could protect forests and the animals in them.|sanctuary,quota
  extinct|no longer existing anywhere|灭绝的|The dodo has been ___ for more than three hundred years: not one is left anywhere.|Without help, the frog may soon be ___, and no one will ever see one alive again.|Dinosaurs are ___, so we know them only from their bones.|threatened,fatal
  overfishing|catching so many fish that too few are left to breed|过度捕捞|Because of ___, the boats caught so many cod that too few were left to breed.|Years of ___ by huge, legal fishing fleets emptied many once rich seas.|Rules against ___ limited each boat's catch, and the fish slowly returned.|poaching,ecotourism
  restore|to bring something back to how it was before|恢复，修复|Volunteers planted grass to ___ the dunes to how they were before the storm.|The city wants to ___ the old wetland that was drained long ago.|It can take years to ___ a damaged reef to full health.|deplete,refine|restored,restores
  poaching|hunting or fishing animals illegally|偷猎，盗猎|Illegal ___ has killed many elephants for their tusks.|Guards patrol the park at night to stop ___ by hunters who break the law.|The fine for ___, killing a protected deer without permission, is very high.|overfishing,quota
  sanctuary|a safe place, especially one where wild animals are protected|保护区，避难所|The island is a quiet ___ where nesting seabirds are safe from hunters.|Hunting is banned inside the ___, so the deer there are not afraid of people.|The old barn became a quiet ___ for injured horses, a safe place for them to heal.|conservation,ecotourism|sanctuaries
  threatened|in danger of becoming endangered or extinct|受威胁的|The ___ birds, now only a few hundred, nest on just two islands.|Sea grass is ___ by warm water and may disappear if the sea keeps heating up.|The list of ___ animals, those at risk of dying out, grew longer this year.|extinct,fatal
  deplete|to use up most of something|耗尽，大量减少|Catching too many tuna will ___ the stock until few are left.|Long droughts ___ the water in the lake, leaving only mud.|Running all day can ___ your energy until you can hardly walk.|restore,splurge|depleted,depletes
  quota|a fixed amount that is allowed, such as the number of fish a boat may catch|配额，限额|Each boat has its own ___ of five tons of fish a year and may catch no more.|When the ___ is reached, fishing must stop until next year.|The town set a strict ___ of two hundred visitors a day for the cave.|permit,overfishing|quotas
  ecotourism|travel to natural places that tries to protect them and help local people|生态旅游|___ brings money to the villages when visitors come to see the reef.|Good ___ teaches visitors not to touch the coral on their trips.|The forest earns more from ___, with visitors paying to walk its trails, than from logging.|overfishing,sanctuary
  `,
  "context-clues",
  {
    intro: t(
      "Rangers in the turtle **sanctuary** work to **restore** the beach, and a strict **quota** on nearby fishing protects the **threatened** turtles from the boats. These ten words help you talk about protecting wild places and the creatures that live in them.",
      "海龟保护区（**sanctuary**）的护林员努力修复（**restore**）海滩，附近捕鱼的严格配额（**quota**）则保护受威胁的（**threatened**）海龟免受渔船伤害。这十个词帮你谈论如何保护野外环境和生活在那里的生物。",
    ),
    watchOut: {
      meanings: t(
        "Tell **threatened** (still alive but *at risk*) apart from **extinct** (*none* left anywhere); and tell **overfishing** (catching *too many*, even legally) apart from **poaching** (hunting *against the law*).",
        "分清 **threatened**（还活着但有危险）和 **extinct**（一只也不剩）；再分清 **overfishing**（捕得太多，即使合法）和 **poaching**（违法捕猎）。",
      ),
      use: t(
        "Tell **restore** (bring something *back*) apart from **deplete** (use it *up*); tell **sanctuary** (a safe *place*) apart from **conservation** (the *work* of protecting nature).",
        "分清 **restore**（恢复原样）和 **deplete**（耗尽）；再分清 **sanctuary**（安全的地方）和 **conservation**（保护自然的工作）。",
      ),
      spelling: t(
        "Watch **sanctuary** (*-uary*), **extinct** (*-ct*), **quota** (*qu*) and **threatened** (*ea* saying a short *e*).",
        "注意 **sanctuary** 的 **-uary**、**extinct** 的 **-ct**、**quota** 的 **qu**，以及 **threatened** 中读短音 e 的 **ea**。",
      ),
    },
    notes: `
      conservation|a group protecting the beach nests of rare sea turtles|saving every drop of water during a drought|studying how to protect forests and their animals|conservation is the work of protecting nature; sanctuary is one safe place|conservation 是保护自然的工作；sanctuary 是一个安全的地方|sanctuary is one safe place where animals are protected, not the work of protecting nature|sanctuary 是保护动物的一处安全场所，不是保护自然这项工作|quota is a fixed amount that is allowed, not the protection of nature|quota 是规定允许的数量，不是对自然的保护|con · ser · va · tion|the -tion ending|结尾是 -tion
      extinct|a bird with not one left anywhere for three hundred years|a frog that no one may ever see alive again|dinosaurs known only from their bones|extinct means none are left; threatened means at risk but still alive|extinct 是一个不剩；threatened 是有危险但还活着|threatened means in danger of dying out while some are still alive, not gone forever|threatened 指有灭绝危险但还有活着的，不是永远消失|fatal means causing death, not having no living members left anywhere|fatal 指致命的，不是世上再也没有活着的同类|ex · tinct|the -ct ending|结尾是 -ct
      overfishing|boats catching so many cod that too few were left to breed|huge legal fleets emptying once rich seas|limits on each boat's catch that let the fish return|overfishing is catching too many, even legally; poaching is catching against the law|overfishing 是捕捞过量，即使合法；poaching 是违法捕猎|poaching is hunting or fishing that breaks the law, not catching too many fish in general|poaching 是违法打猎或捕鱼，不是泛指捕鱼过量|ecotourism is travel that protects nature, not catching fish at all|ecotourism 是保护自然的旅游，根本不是捕鱼|o · ver · fish · ing|over + fish + ing|over 加 fish 加 ing
      restore|volunteers planting grass to bring dunes back to how they were|a city bringing back a wetland that was drained long ago|years of work to bring a damaged reef back to health|restore means to bring back; deplete means to use up|restore 是恢复；deplete 是耗尽|deplete means to use most of something up, the opposite of bringing it back|deplete 是把东西大量耗掉，与恢复正相反|refine means to improve something with small changes, not to bring it back to how it was before|refine 是通过小改动加以改进，不是恢复原样|re · store|the -ore ending with a silent e|结尾是 -ore，e 不发音
      poaching|elephants killed illegally for their tusks|hunters who break the law in a park at night|killing a protected deer without permission|poaching is hunting against the law; overfishing is catching too many|poaching 是违法捕猎；overfishing 是捕捞过量|overfishing is catching too many fish, even legally, not hunting animals against the law|overfishing 是捕鱼过量，即使合法，也不是违法捕猎|quota is the amount that is allowed, not hunting that breaks the law|quota 是允许的数量，不是违法的捕猎|poach · ing|oa in poach|poach 中的 oa
      sanctuary|an island where nesting seabirds are safe from hunters|a place where hunting is banned so deer are not afraid|a barn where injured horses can safely heal|sanctuary is a safe place; conservation is the work of protecting nature|sanctuary 是安全的场所；conservation 是保护自然的工作|conservation is the work of protecting nature, not a safe place itself|conservation 是保护自然的工作，不是一个安全的地方|ecotourism is travel to natural places, not a safe place where animals are protected|ecotourism 是去自然景区旅游，不是保护动物的安全场所|sanc · tu · ar · y|the -uary ending|结尾是 -uary
      threatened|birds down to a few hundred nesting on two islands|sea grass that may disappear as the sea heats up|a list of animals at risk of dying out|threatened means at risk; extinct means already gone|threatened 是有危险；extinct 是已经灭绝|extinct means none are left alive, while a threatened kind still lives|extinct 指一个也没有活着，而受威胁的物种还活着|fatal means causing death, not being in danger of dying out|fatal 指致命的，不是面临灭绝的危险|threat · ened|ea saying a short e|ea 读短音 e
      deplete|fishing for tuna until few are left|droughts drying a lake down to mud|running all day until you can hardly walk|deplete means to use up; restore means to bring back|deplete 是耗尽；restore 是恢复|restore means to bring something back, the opposite of using it up|restore 是恢复原样，与耗尽正相反|splurge means to spend a lot of money on something you enjoy, not to use up a supply until little is left|splurge 是花大钱享受，不是把某样东西用到所剩无几|de · plete|the -ete ending|结尾是 -ete
      quota|a boat allowed five tons of fish a year and no more|fishing that must stop when the limit is reached|a cave allowed two hundred visitors a day|quota is a fixed amount allowed; permit is a paper that allows something|quota 是限定的数量；permit 是许可证|permit is a paper that allows something, not a fixed amount that may not be passed|permit 是允许做某事的许可证，不是不能超过的固定数量|overfishing is catching too many fish, not the fixed amount that is allowed|overfishing 是捕鱼过量，不是规定允许的数量|quo · ta|qu at the start|开头是 qu
      ecotourism|visitors bringing money to villages near a reef|trips that teach visitors not to touch coral|visitors paying to walk forest trails|ecotourism is travel that protects nature; sanctuary is a protected place|ecotourism 是保护自然的旅游；sanctuary 是受保护的地方|overfishing is catching too many fish, not travel that protects nature|overfishing 是捕鱼过量，不是保护自然的旅游|sanctuary is a protected place, not the travel of visitors who come to see nature|sanctuary 是受保护的地方，不是游客来看自然的旅游|e · co · tour · ism|eco + tour + ism, with ou in tour|eco 加 tour 加 ism，tour 中是 ou
    `,
  },
);

const renaissance = batch(
  "words-of-the-renaissance",
  ["Words of the Renaissance", "文艺复兴的词"],
  ["the Renaissance and its new ideas", "文艺复兴及其新思想"],
  `
  renaissance|a rebirth of learning and art; the period in Europe from about 1300 to 1600|复兴；文艺复兴|The ___, the age of new art and learning, began in the cities of Italy around 1300.|After years of empty theaters, the town is enjoying a ___ of music and plays.|Many famous painters lived during the ___, between about 1300 and 1600.|reformation,humanism
  humanism|a way of thinking that values human learning, ability and the books of ancient Greece and Rome|人文主义|___ taught that people should study history, poetry and good speech, as the Greeks and Romans did.|The spirit of ___, with its love of human learning, spread from Florence to the rest of Europe.|Teachers of ___ read the old Latin writers closely to learn what people can do.|heresy,reformation
  patron|a rich person who pays artists or writers to work|赞助人|The rich Medici family was a great ___ of painters, paying them to work.|With a ___ to pay her bills, the poet could write all day.|Every poor artist hoped to find a generous ___ who would pay for his work.|printer,genius|patrons
  classical|from ancient Greece or Rome, or in their style|古典的|The building has ___ columns like those of an ancient Greek temple.|Students studied ___ languages of ancient Rome, such as Latin.|The poet wrote in a ___ style, copying the poems of ancient Rome.|futuristic,gilded
  revival|a return of something to use or popularity|复兴，复苏|The ___ of old Greek plays brought them back to the stage after a thousand years.|There was a ___ of interest in ancient science, which had long been forgotten.|The festival led to a ___ of the folk music that people had stopped playing.|reformation,movement|revivals
  reformation|a change that tries to correct something; the religious movement in Europe after 1517|改革；宗教改革|The ___ that began in 1517 split the church in western Europe.|Leaders called for a ___ of the old customs to correct what had gone wrong.|Printed pamphlets helped the ___, the great movement to change the church, spread fast.|revival,heresy
  genius|a person with very great skill or intelligence|天才|Leonardo da Vinci was a ___ who was brilliant in both art and science.|It takes a ___ to solve that hard puzzle in a minute.|Amazed by her skill, people called the young painter a ___.|patron,printer|geniuses
  pamphlet|a thin book with a paper cover, often about one question|小册子|The thin printed ___ explained the new idea in a few simple pages.|Printers sold thousands of cheap copies of the ___, which had only eight pages.|She handed out a short, paper-covered ___ about the town meeting.|treatise,manuscript|pamphlets
  heresy|a belief that goes against the official teaching of a religion|异端邪说|In those days, a person could be punished by the church for ___.|The church called his book ___ because it went against official teaching.|Galileo was accused of ___ for an idea that the church said was false.|reformation,humanism|heresies
  printer|a person or business that prints books and papers; also a machine that prints|印刷商；打印机|The ___ set each metal letter by hand before pressing the paper.|A busy ___ could print hundreds of pages a day.|Our ___ ran out of ink in the middle of my report.|patron,pamphlet|printers
  `,
  "context-clues",
  {
    intro: t(
      "In Florence, a rich **patron** paid a young **genius** to paint, while a **printer** down the street turned out copies of a new **pamphlet** every day. These ten words help you tell the story of the Renaissance and the new ideas that spread across Europe.",
      "在佛罗伦萨，一位富有的赞助人（**patron**）出钱请一位年轻天才（**genius**）作画，街那头的印刷商（**printer**）每天都在印一本新的小册子（**pamphlet**）。这十个词帮你讲述文艺复兴和传遍欧洲的新思想。",
    ),
    watchOut: {
      meanings: t(
        "Tell **renaissance** (a *rebirth* of art and learning) apart from **reformation** (a change to *correct* something, such as the church) and **humanism** (a *way of thinking* that values human learning).",
        "分清 **renaissance**（艺术与学问的复兴）、**reformation**（纠正某事的改革，如宗教改革）和 **humanism**（重视人类学问的思想）。",
      ),
      use: t(
        "Tell **patron** (the rich person who *pays*) apart from **genius** (the person with great *skill*); tell **heresy** (one *belief* against church teaching) apart from **reformation** (a whole *movement* of change).",
        "分清 **patron**（出钱的富人）和 **genius**（才华出众的人）；再分清 **heresy**（违背教义的一种信仰）和 **reformation**（一整场改革运动）。",
      ),
      spelling: t(
        "Watch **renaissance** (*ai* and double *s*), **pamphlet** (*ph* saying /f/), **genius** (*-ius*) and **heresy** (*-esy*).",
        "注意 **renaissance** 的 **ai** 和双写 **s**、**pamphlet** 中读 /f/ 的 **ph**、**genius** 的 **-ius**，以及 **heresy** 的 **-esy**。",
      ),
    },
    notes: `
      renaissance|an age of new art and learning that began in Italian cities around 1300|a town filling its empty theaters with music and plays again|the years between about 1300 and 1600 when famous painters lived|renaissance is a rebirth of art and learning; reformation is a change to correct something|renaissance 是艺术与学问的复兴；reformation 是纠正某事的改革|reformation is a change to correct something, or the church movement after 1517, not a rebirth of art and learning|reformation 是纠正某事的改革或 1517 年后的宗教运动，不是艺术与学问的复兴|humanism is a way of thinking that values human learning, not a period of time or a rebirth|humanism 是重视人类学问的思想，不是一个时代或一次复兴|ren · ais · sance|ai and double s|有 ai，并双写 s
      humanism|a teaching that people should study history, poetry and speech like the Greeks and Romans|a love of human learning spreading from Florence across Europe|teachers reading old Latin writers to learn what people can do|humanism values human learning; heresy goes against church teaching|humanism 重视人类学问；heresy 违背教会教义|heresy is a belief against the official teaching of a religion, not a love of human learning and ancient books|heresy 是违背宗教正统教义的信仰，不是对人类学问和古代典籍的热爱|reformation is a change to correct something, such as the church, not a way of thinking that values human learning|reformation 是纠正教会等事物的改革，不是重视人类学问的思想|hu · man · ism|human + ism|human 加 ism
      patron|a rich family paying painters to work|a person who pays a poet's bills so she can write all day|a generous person who would pay for an artist's work|patron pays artists; genius has great skill|patron 出钱资助艺术家；genius 有过人的才华|printer is a person or business that prints books, not someone who pays artists|printer 是印书的人或商家，不是出钱资助艺术家的人|genius is a person of great skill, not a rich person who pays others to work|genius 是才华出众的人，不是出钱请别人工作的富人|pa · tron|the -on ending|结尾是 -on
      classical|columns like those of an ancient Greek temple|the languages of ancient Rome such as Latin|a poet copying the poems of ancient Rome|classical means from ancient Greece or Rome; futuristic means as if from the future|classical 指古希腊罗马的；futuristic 指仿佛来自未来的|futuristic means very modern, as if from the future, the opposite of from ancient Greece or Rome|futuristic 指非常现代、仿佛来自未来，与来自古希腊罗马正相反|gilded means covered with a thin layer of gold, which tells what something is coated with, not where its style comes from|gilded 指镀了一层金，说的是表面涂层，不是风格的来源|clas · si · cal|double s and the -ical ending|双写 s，结尾是 -ical
      revival|old Greek plays coming back to the stage after a thousand years|interest in forgotten ancient science coming back|folk music that people had stopped playing coming back|revival is something old coming back; reformation is a change to correct something|revival 是旧事物重新兴起；reformation 是纠正某事的改革|reformation is a change that corrects something, not something old coming back into use|reformation 是纠正某事的改变，不是旧事物重新流行|movement is a group of people working for a cause, not the return of something forgotten|movement 是为共同事业努力的一群人，不是被遗忘的东西回归|re · vi · val|the -al ending|结尾是 -al
      reformation|a change beginning in 1517 that split the church|leaders calling to correct old customs that had gone wrong|a great movement to change the church spread by pamphlets|reformation is a movement of change; heresy is one belief against church teaching|reformation 是一场改革运动；heresy 是违背教义的一种信仰|revival is the return of something old, not a change that corrects it|revival 是旧事物的回归，不是纠正它的改革|heresy is a single belief against official religious teaching, not a movement of change|heresy 是违背正统教义的一种信仰，不是一场改革运动|ref · or · ma · tion|reform + ation|reform 加 ation
      genius|a man brilliant in both art and science|a person who can solve a hard puzzle in a minute|a young painter whose skill amazed people|genius has great skill; patron pays for others' work|genius 才华出众；patron 出钱资助别人|patron pays artists to work, not a person with very great skill|patron 出钱请艺术家工作，不是才华出众的人|printer prints books, not a person of great skill or intelligence|printer 印书，不是才智超群的人|gen · ius|the -ius ending|结尾是 -ius
      pamphlet|a thin printed booklet explaining a new idea in a few pages|cheap eight-page booklets sold by the thousand|a short paper-covered booklet about a town meeting|pamphlet is thin and printed; treatise is long and serious|pamphlet 薄薄一本、印刷的；treatise 长篇而严肃|treatise is a long, serious piece of writing, not a thin paper booklet|treatise 是长篇严肃的论著，不是薄薄的纸面小册子|manuscript is written by hand, not a thin printed booklet|manuscript 是手写的，不是薄薄的印刷小册子|pam · phlet|ph saying /f/|ph 读 /f/
      heresy|a person punished by the church for a belief|a book the church said went against its teaching|Galileo accused over an idea the church called false|heresy is a belief against church teaching; reformation is a movement to change the church|heresy 是违背教义的信仰；reformation 是改变教会的运动|reformation is a movement to change and correct something, not a single belief against religious teaching|reformation 是纠正某事的改革运动，不是违背教义的一种信仰|humanism is a love of human learning, not a belief that breaks a church's teaching|humanism 是对人类学问的热爱，不是违背教会教义的信仰|her · e · sy|the -esy ending|结尾是 -esy
      printer|a worker setting metal letters by hand before pressing paper|a shop that could print hundreds of pages a day|a machine running out of ink in the middle of a report|printer is the person or machine that prints; pamphlet is what gets printed|printer 是印刷的人或机器；pamphlet 是被印出来的东西|patron pays artists and writers, not someone or something that prints|patron 出钱资助艺术家和作家，不是负责印刷的人或机器|pamphlet is the thin booklet that gets printed, not the person or machine that prints it|pamphlet 是被印出来的小册子，不是印刷它的人或机器|print · er|print + er|print 加 er
    `,
  },
);

const newScience = batch(
  "words-of-science-in-the-renaissance",
  ["Words of Science in the Renaissance", "文艺复兴时期科学的词"],
  ["the new science of the Renaissance", "文艺复兴时期的新科学"],
  `
  anatomy|the study of the body and its parts; also the way a body is built|解剖学；身体结构|Leonardo drew the ___ of the human hand, showing every bone and muscle.|Doctors must study ___, the parts of the body and how they fit together, before they operate.|The light, hollow bones in a bird's ___ help it to fly.|dissection,cosmos
  philosophy|the study of ideas about knowledge, truth and how to live|哲学|She studied ___ and asked what makes an action right or wrong.|The ideas of Greek ___ about truth and how to live were read again in the Renaissance.|His ___ of life was simple: always tell the truth.|astronomy,observation|philosophies
  astronomy|the study of the stars, the planets and space|天文学|Galileo's ___ changed how people understood the planets in the sky.|In ___, a telescope is the most important tool for studying the stars.|The club meets on clear nights to practice ___, mapping the stars.|philosophy,anatomy
  heliocentric|having the sun at the center|以太阳为中心的|Copernicus proposed a new ___ model, with the sun in the middle and the planets around it.|In a ___ system, Earth and the other planets travel around the sun.|The ___ idea, that Earth circles the sun, was slow to be accepted.|classical,futuristic
  observation|the careful watching of something to learn about it|观察|Galileo's ___ of the moon through his telescope showed mountains and craters.|Science begins with careful ___ of what happens, written down day after day.|She wrote each ___ of the birds at the pond in her notebook.|dissection,philosophy|observations
  inventor|a person who makes something new that did not exist before|发明家|Gutenberg was the ___ of a new kind of printing press that no one had built before.|The young ___ built a machine that sorted coins, something never made before.|Every ___ fails many times before a new machine finally works.|scientist,architect|inventors
  cosmos|the whole universe, seen as an ordered system|宇宙|Ancient thinkers believed Earth stood still at the center of the ___, with every star turning around it.|The telescope opened a window onto the whole ___ of stars and planets.|Compared with the huge ___, our whole planet is tiny.|astronomy,abyss
  dissection|cutting up a dead body, plant or animal to study it|解剖|Doctors learned how the body works from the careful ___ of dead bodies, cut open on a table.|The class watched the teacher's ___ of a frog, cutting it open to see its heart.|The ___ of a sheep's heart, sliced open with a knife, showed how its valves work.|anatomy,observation|dissections
  scientist|a person who studies the natural world through experiments and observation|科学家|The ___ tested her idea about plants again and again in the lab.|Galileo, who tested his ideas with experiments, is often called the first modern ___.|Every ___ must report the results of experiments honestly.|inventor,scholar|scientists
  notebook|a book of blank pages for writing notes|笔记本|Leonardo filled the blank pages of his ___ with drawings of machines.|She kept a ___ and jotted down everything she saw at the pond.|My ___ is full of quick notes and ideas for stories.|pamphlet,treatise|notebooks
  `,
  "context-clues",
  {
    intro: t(
      "Night after night, the young woman wrote each **observation** of the planets in her **notebook**, until her **astronomy** led her to a **heliocentric** picture of the sky. These ten words help you follow the new science of the Renaissance and the people who made it.",
      "一夜又一夜，那位年轻女子把对行星的每次观察（**observation**）记在笔记本（**notebook**）里，直到她的天文学（**astronomy**）研究让她得出了以太阳为中心的（**heliocentric**）天空图景。这十个词帮你了解文艺复兴时期的新科学和创造它的人。",
    ),
    watchOut: {
      meanings: t(
        "Tell **anatomy** (the body's *parts*, or the study of them) apart from **dissection** (the *act* of cutting a body open) and **observation** (careful *watching*, with no cutting).",
        "分清 **anatomy**（身体的结构或对它的研究）、**dissection**（把身体切开的行为）和 **observation**（仔细观看，不动刀）。",
      ),
      use: t(
        "Tell **scientist** (tests ideas about *nature*) apart from **inventor** (makes a new *machine*); tell **cosmos** (the universe *itself*) apart from **astronomy** (the *study* of it).",
        "分清 **scientist**（用实验检验关于自然的想法）和 **inventor**（造出新机器）；再分清 **cosmos**（宇宙本身）和 **astronomy**（研究宇宙的学科）。",
      ),
      spelling: t(
        "Watch **philosophy** (two *ph*), **dissection** (double *s*), **scientist** (*sc* at the start) and **heliocentric** (*helio* for the sun).",
        "注意 **philosophy** 的两个 **ph**、**dissection** 双写 **s**、**scientist** 开头的 **sc**，以及 **heliocentric** 中表示太阳的 **helio**。",
      ),
    },
    notes: `
      anatomy|a drawing showing every bone and muscle of a hand|the parts of the body that doctors study before they operate|the light, hollow bones that help a bird fly|anatomy is the body's parts or their study; dissection is the act of cutting a body open|anatomy 是身体结构或对它的研究；dissection 是切开身体的行为|dissection is the act of cutting a body up to study it, not the body's parts or the study of them|dissection 是切开身体来研究的行为，不是身体结构或对它的研究|cosmos is the whole universe, not the parts of a body|cosmos 是整个宇宙，不是身体的各个部分|a · nat · o · my|the -omy ending|结尾是 -omy
      philosophy|a student asking what makes an action right or wrong|Greek ideas about truth and how to live|a simple rule for life about always telling the truth|philosophy studies ideas about truth and how to live; astronomy studies the stars|philosophy 研究真理和人生；astronomy 研究星辰|astronomy is the study of stars and planets, not of ideas about truth and how to live|astronomy 研究星辰和行星，不是研究真理和如何生活|observation is careful watching of something, not ideas about knowledge and right action|observation 是对事物的仔细观看，不是关于知识和是非的思想|phi · los · o · phy|two ph, each saying /f/|两个 ph，都读 /f/
      astronomy|work that changed how people understood the planets|studying the stars with a telescope|a club mapping the stars on clear nights|astronomy studies the stars; philosophy studies ideas about life|astronomy 研究星辰；philosophy 研究人生道理|philosophy is the study of ideas about truth and how to live, not of stars and space|philosophy 研究真理和人生道理，不是研究星辰和太空|anatomy is the study of the body, not of stars and planets|anatomy 研究身体，不是研究星辰和行星|as · tron · o · my|the -omy ending, like anatomy|结尾是 -omy，同 anatomy
      heliocentric|a new model with the sun in the middle and the planets around it|a system in which Earth and the planets travel around the sun|the slowly accepted idea that Earth circles the sun|heliocentric puts the sun at the center; classical thinkers mostly put Earth there|heliocentric 以太阳为中心；古典学者大多以地球为中心|classical means from ancient Greece or Rome, whose thinkers mostly put Earth, not the sun, at the center|classical 指古希腊罗马的，那时的学者大多以地球而不是太阳为中心|futuristic means very modern, as if from the future, which says nothing about the sun being at the center|futuristic 指非常现代、仿佛来自未来，与太阳是否居中无关|he · li · o · cen · tric|helio (sun) + centric|helio（太阳）加 centric
      observation|Galileo watching the moon through a telescope and seeing craters|watching what happens and writing it down day after day|notes on the birds watched at a pond|observation is careful watching; dissection is cutting something open|observation 是仔细观看；dissection 是切开来研究|dissection is cutting a body up, not watching something carefully|dissection 是把身体切开，不是仔细观看|philosophy is the study of ideas, not careful watching of the world|philosophy 是研究思想，不是仔细观察世界|ob · ser · va · tion|observe + ation, dropping the e|observe 去 e 加 ation
      inventor|Gutenberg building a new printing press that no one had built before|a young person building a coin-sorting machine never made before|people who fail many times before a new machine works|inventor makes a new machine; scientist tests ideas about nature|inventor 造出新机器；scientist 检验关于自然的想法|scientist studies the natural world through experiments, not someone who makes a new machine|scientist 用实验研究自然，不是造新机器的人|architect designs buildings, not new machines or tools|architect 设计建筑，不是发明新机器或工具的人|in · ven · tor|the -or ending|结尾是 -or
      cosmos|the whole universe that ancient thinkers thought turned around Earth|the whole universe of stars and planets seen through a telescope|the huge universe that makes our planet look tiny|cosmos is the universe itself; astronomy is the study of it|cosmos 是宇宙本身；astronomy 是研究宇宙的学科|astronomy is the study of space, not the universe itself|astronomy 是研究太空的学科，不是宇宙本身|abyss is a very deep hole, such as the bottom of the ocean, not the whole universe|abyss 是极深的洞穴，如海洋最深处，不是整个宇宙|cos · mos|c at the start and -os at the end|开头是 c，结尾是 -os
      dissection|doctors cutting open dead bodies on a table to learn how they work|a teacher cutting open a frog to see its heart|a sheep's heart sliced open to show its valves|dissection is cutting a body open; anatomy is the body's parts|dissection 是切开身体；anatomy 是身体的结构|anatomy is the body's parts or the study of them, not the act of cutting a body open|anatomy 是身体结构或对它的研究，不是切开身体的行为|observation is careful watching, without cutting anything open|observation 是仔细观看，不切开任何东西|dis · sec · tion|double s|双写 s
      scientist|a woman testing her idea about plants again and again in a lab|Galileo testing his ideas with experiments|a person who must report the results of experiments honestly|scientist tests ideas about nature; inventor makes new machines|scientist 用实验检验关于自然的想法；inventor 造新机器|inventor makes new machines or tools, not someone who tests ideas about nature with experiments|inventor 造新机器或工具，不是用实验检验关于自然的想法的人|scholar studies a subject deeply in books, not the natural world through experiments|scholar 在书本里深入钻研学问，不是用实验研究自然的人|sci · en · tist|sc at the start|开头是 sc
      notebook|blank pages filled with drawings of machines|notes jotted down about everything seen at a pond|quick notes and ideas for stories|notebook has blank pages for your own notes; pamphlet is printed for others to read|notebook 是自己记笔记的空白本子；pamphlet 是印给别人看的|pamphlet is a thin printed booklet for others to read, not a book of blank pages for your own notes|pamphlet 是印给别人看的薄册子，不是自己记笔记的空白本子|treatise is a long, serious piece of writing on one subject, not blank pages for notes|treatise 是长篇严肃的专著，不是记笔记的空白本子|note · book|note (silent e) + book|note（e 不发音）加 book
    `,
  },
);

const workshops = batch(
  "words-of-artists-and-workshops",
  ["Words of Artists and Workshops", "艺术家与作坊的词"],
  ["artists and their workshops", "艺术家及其作坊"],
  `
  workshop|a room or building where things are made or repaired|作坊，工作间|Young painters mixed paints and trained in the master's busy ___.|The ___ smelled of paint and sawdust from the things being made there.|My uncle fixes broken clocks at the bench in his ___.|chapel,altarpiece|workshops
  sculptor|an artist who makes figures from stone, wood, metal or clay|雕塑家|Michelangelo was a great ___ who carved figures from marble as well as a painter.|With hammer and chisel, the ___ carved a lion from a block of stone.|Using only clay and her hands, the ___ shaped a figure of a dancer.|architect,patron|sculptors
  fresco|a picture painted on wet plaster on a wall or ceiling|湿壁画|The ___ on the ceiling was painted onto wet plaster and took four years to finish.|In every ___, the paint soaks into the wet plaster and dries as part of the wall.|Visitors look up at the ___ painted right onto the plaster of the ceiling.|plaster,altarpiece|frescoes
  masterpiece|a work of art made with great skill; one of the best of its kind|杰作|Many people think her first novel is a true ___, the best book she ever wrote.|After years of practice, the young carpenter made a chair so fine that it was a true ___.|The wedding cake was a real ___, the finest the baker had ever made.|fresco,altarpiece|masterpieces
  plaster|a paste that dries hard and smooth on walls|灰泥|The painter worked fast before the wet ___ on the wall dried hard.|Cracks appeared in the old ___ that covered the ceiling.|The ___ was mixed from lime, sand and water and spread smoothly on the wall.|fresco,ink
  gilded|covered with a thin layer of gold|镀金的|The ___ frame looked like solid gold, but under its thin gold skin it was cheap wood.|The cheap wooden angels had ___ wings that shone like real gold.|Each plain wooden chair in the palace was ___ so that it would shine like gold.|precious,classical
  altarpiece|a painting or carving placed behind the altar of a church|祭坛画|Behind the altar stood a painted ___ in three panels.|A rich merchant paid for the new ___ that stands behind the church's altar.|The colors of the ___ above the altar were still bright after five hundred years.|fresco,chapel|altarpieces
  chapel|a small church, or a room for prayer in a larger building|小教堂|People came to pray in the small ___, whose walls were covered with paintings.|The family built a private ___ in their palace so they could pray at home.|Tourists wait in line to see the famous ___ where the pope prays.|workshop,altarpiece|chapels
  architect|a person who designs buildings|建筑师|Brunelleschi was the ___ who designed the great dome in Florence.|The ___ drew plans for a new library with tall windows.|A good ___ must know how to make a building both beautiful and strong.|sculptor,inventor|architects
  commission|an order for a piece of work, such as a painting, and the payment for it|委托，委托费|The artist received a ___ from the pope, an order to paint his portrait for a large fee.|One large ___ to decorate a whole church could keep a workshop busy for years.|The city gave the sculptor a ___ and paid him to make a statue for the square.|patron,masterpiece|commissions,commissioned
  `,
  "context-clues",
  {
    intro: t(
      "In the **workshop**, the apprentices mixed **plaster** while the master planned a **fresco** for the **chapel** of a rich family. These ten words help you describe how Renaissance artists worked and what they made.",
      "作坊（**workshop**）里，学徒们在调灰泥（**plaster**），师傅则在为一个富有家族的小教堂（**chapel**）构思一幅湿壁画（**fresco**）。这十个词帮你描写文艺复兴时期艺术家如何工作、创作了什么。",
    ),
    watchOut: {
      meanings: t(
        "Tell **fresco** (painted *into* the wet plaster of a wall) apart from **altarpiece** (a separate work placed *behind an altar*); **masterpiece** says how *good* a work is, not what kind it is.",
        "分清 **fresco**（画进墙面湿灰泥里的画）和 **altarpiece**（放在祭坛后面的独立作品）；**masterpiece** 说的是作品有多好，不是作品的种类。",
      ),
      use: t(
        "Tell **sculptor** (makes *figures*) apart from **architect** (designs *buildings*); tell **commission** (the *order* for a work) apart from **patron** (the *person* who pays).",
        "分清 **sculptor**（制作雕像）和 **architect**（设计建筑）；再分清 **commission**（作品的委托）和 **patron**（出钱的人）。",
      ),
      spelling: t(
        "Watch **commission** (double *m* and double *s*), **altarpiece** (*altar*, not *alter*), **architect** (*ch* saying /k/) and **gilded** (*gild*, with no *u*).",
        "注意 **commission** 双写 **m** 和 **s**、**altarpiece** 中是 altar（不是 alter）、**architect** 中读 /k/ 的 **ch**，以及 **gilded** 是 gild（没有 u）。",
      ),
    },
    notes: `
      workshop|young painters mixing paints and training in a master's busy room|a room smelling of paint and sawdust from the things made there|an uncle fixing clocks at his bench|workshop is a place where things are made; chapel is a place for prayer|workshop 是制作东西的地方；chapel 是祈祷的地方|chapel is a small church or a room for prayer, not a place where things are made or repaired|chapel 是小教堂或祈祷室，不是制作或修理东西的地方|altarpiece is a painting behind an altar, not a room where work is done|altarpiece 是祭坛后面的画，不是干活的房间|work · shop|work + shop|work 加 shop
      sculptor|Michelangelo carving figures from marble|an artist carving a lion from stone with hammer and chisel|an artist shaping a clay figure of a dancer with her hands|sculptor makes figures; architect designs buildings|sculptor 制作雕像；architect 设计建筑|architect designs buildings, not figures of stone, wood or clay|architect 设计建筑，不是用石头、木头或黏土做雕像|patron pays artists to work, not the artist who makes figures|patron 出钱请艺术家工作，不是动手做雕像的艺术家|sculp · tor|the p before t and the -or ending|t 前面有 p，结尾是 -or
      fresco|a ceiling picture painted onto wet plaster over four years|paint soaking into wet plaster and drying as part of the wall|a picture painted right onto the plaster of a ceiling|fresco is painted into a wall; altarpiece is a separate work behind an altar|fresco 画在墙里；altarpiece 是祭坛后的独立作品|plaster is the paste spread on the wall, not the picture painted on it|plaster 是抹在墙上的灰泥，不是画在上面的画|altarpiece is a painting or carving placed behind an altar, not a picture painted into a wall or ceiling|altarpiece 是放在祭坛后面的画或雕刻，不是画进墙面或天花板的画|fres · co|the -sco ending|结尾是 -sco
      masterpiece|a first novel thought to be the best book a writer ever wrote|a chair so finely made that it stood out from all others|the finest cake a baker had ever made|masterpiece says a work is one of the best; fresco names one kind of wall painting|masterpiece 说明作品是最好的之一；fresco 只是一种壁画|fresco is one kind of wall painting, not a work praised as one of the best of its kind|fresco 是一种壁画，不是被称为同类中最佳的作品|altarpiece is a painting placed behind an altar, not any work of great skill|altarpiece 是放在祭坛后面的画，不是泛指技艺高超的作品|mas · ter · piece|ie in piece|piece 中是 ie
      plaster|wet paste on a wall that a painter must work on before it dries|an old ceiling covering full of cracks|a paste of lime, sand and water spread on a wall|plaster is the paste on the wall; fresco is the picture painted into it|plaster 是墙上的灰泥；fresco 是画进灰泥里的画|fresco is the picture painted on a wall, not the paste the wall is covered with|fresco 是画在墙上的画，不是墙面上的灰泥|ink is a colored liquid for writing, not a paste that dries hard on walls|ink 是写字用的彩色液体，不是在墙上变硬的糊状物|plas · ter|the -er ending|结尾是 -er
      gilded|a cheap wooden frame with a thin skin of gold|cheap wooden angels with wings that shine like gold|plain wooden chairs coated to shine like gold|gilded means coated with thin gold; precious means truly valuable|gilded 是镀了一层薄金；precious 是真正贵重|precious means of great value, but a thin coat of gold can cover something cheap|precious 指价值很高，而一层薄金可以盖在便宜的东西上|classical means in the style of ancient Greece or Rome, not covered with a thin layer of gold|classical 指古希腊罗马风格，不是镀了一层金|gild · ed|gild with no u (a guild is a group of workers)|gild 没有 u（guild 是行会）
      altarpiece|a painting in three panels standing behind an altar|a new work paid for by a merchant to stand behind a church altar|colors still bright above an altar after five hundred years|altarpiece is a separate work behind an altar; fresco is painted into a wall|altarpiece 是祭坛后的独立作品；fresco 画在墙里|fresco is painted into the plaster of a wall or ceiling, not a separate painting placed behind an altar|fresco 是画进墙面或天花板灰泥里的，不是放在祭坛后面的独立画作|chapel is a small church or a room for prayer, not the painting inside it|chapel 是小教堂或祈祷室，不是里面的画|al · tar · piece|altar (not alter) + piece|altar（不是 alter）加 piece
      chapel|people praying in a small church with painted walls|a family praying at home in their palace|a famous place where the pope prays|chapel is a place for prayer; workshop is a place for making things|chapel 是祈祷的地方；workshop 是制作东西的地方|workshop is a place where things are made, not a place for prayer|workshop 是制作东西的地方，不是祈祷的地方|altarpiece is a painting behind an altar, not a building or room where people pray|altarpiece 是祭坛后面的画，不是人们祈祷的建筑或房间|chap · el|the -el ending, not -le|结尾是 -el，不是 -le
      architect|the designer of the great dome in Florence|a person drawing plans for a library with tall windows|a person who must make buildings both beautiful and strong|architect designs buildings; sculptor makes figures|architect 设计建筑；sculptor 制作雕像|sculptor makes figures from stone, wood or clay, not plans for buildings|sculptor 用石头、木头或黏土做雕像，不是画建筑图纸|inventor makes new machines or tools, not designs for buildings|inventor 发明新机器或工具，不是设计建筑|ar · chi · tect|ch saying /k/|ch 读 /k/
      commission|an order from the pope to paint his portrait for a large fee|an order to decorate a whole church that kept a workshop busy|a city paying a sculptor to make a statue for the square|commission is the order for a work; patron is the person who pays|commission 是作品的委托；patron 是出钱的人|patron is the person who pays, not the order for a piece of work|patron 是出钱的人，不是对作品的委托|masterpiece is a finished work of great skill, not an order for work still to be done|masterpiece 是已完成的高超作品，不是尚待完成的委托|com · mis · sion|double m and double s|双写 m，双写 s
    `,
  },
);

const westAfrica = batch(
  "words-of-west-african-empires",
  ["Words of West African Empires", "西非帝国的词"],
  ["the empires of West Africa", "西非的帝国"],
  `
  sultan|a ruler in some Muslim countries|苏丹（君主）|As ruler of the Muslim kingdom, the ___ welcomed the traders to his palace.|After the old ___ died, his son took the throne.|The ___ ordered a new mosque to be built in the capital of his kingdom.|griot,scholar|sultans
  mosque|a building where Muslims pray|清真寺|The great ___ of Djenné, where Muslims pray, is built of mud brick.|Muslims gathered at the ___ for Friday prayers.|Muslim scholars taught in the courtyard of the ___, beside the prayer hall.|chapel,capital|mosques
  griot|a West African storyteller, singer and keeper of history|格里奥（西非说唱艺人、史官）|The ___ sang the story of the empire's founder to the music of the kora.|Each family had its own ___ who sang and remembered its history.|Children listened as the ___ played the kora and sang about their ancestors.|orator,sultan|griots
  pilgrimage|a journey to a holy place for religious reasons|朝圣|Mansa Musa made a famous ___ to the holy city of Mecca.|The ___ to the holy city took more than a year on foot and by camel.|Each year, thousands of people make the ___ to pray at the holy shrine.|march,succession|pilgrimages
  prosperity|the state of being rich and successful|繁荣，兴旺|Trade in gold made the empire rich and brought ___ to its people.|The years of peace were years of ___, when farms and markets did well.|The new road brought ___ to the villages, and families could afford new homes.|inflation,succession
  ruler|a person who controls a country or a people|统治者|As the ___ of Mali, Mansa Musa controlled the gold fields.|A wise ___ listens to the people before giving orders.|Every ___ of the empire was a king who took the title mansa.|griot,regime|rulers
  reign|the time during which a king, queen or emperor rules; also to rule|统治时期；统治|During his long ___, the empire doubled in size.|The young queen will ___ for more than fifty years.|The ___ of Sundiata began about 1235 and lasted twenty years.|succession,capital|reigns,reigned
  succession|the order in which one person follows another into a position|继承，继位|A fight over the ___, about which son would be the next king, weakened the kingdom.|The rules of ___ said that the king's brother would rule next.|The ___ passed peacefully from the old king to his nephew.|reign,prosperity
  oral|spoken rather than written|口头的，口述的|The history of Mali was kept in ___ stories, spoken aloud and never written down.|We stood up and gave our ___ report aloud instead of writing it down.|___ traditions pass from parents to children by word of mouth.|digital,classical
  capital|the city where a government is based|首都，首府|Niani was the ___ city of the empire of Mali, where the king ruled from.|Paris is the ___ of France, the city where its government meets.|Traders traveled for weeks to reach the ___, the city where the king's government sat.|mosque,regime|capitals
  `,
  "context-clues",
  {
    intro: t(
      "When the **ruler** of Mali came home from his **pilgrimage**, a **griot** sang of the journey in the square of the **capital**. These ten words help you tell the story of the great empires of West Africa.",
      "马里的统治者（**ruler**）朝圣（**pilgrimage**）归来时，一位格里奥（**griot**）在首都（**capital**）的广场上歌唱了这段旅程。这十个词帮你讲述西非伟大帝国的故事。",
    ),
    watchOut: {
      meanings: t(
        "Tell **reign** (the *time* one ruler spends on the throne) apart from **succession** (the *order* of who rules next); and tell **ruler** (one *person*) apart from **regime** (a whole *government*).",
        "分清 **reign**（一位君主在位的时期）和 **succession**（谁接着继位的顺序）；再分清 **ruler**（一个人）和 **regime**（整个政府）。",
      ),
      use: t(
        "Tell **griot** (*sings* and keeps a people's history) apart from **orator** (gives *speeches*); tell **mosque** (where *Muslims* pray) apart from **chapel** (a small *Christian* church).",
        "分清 **griot**（歌唱并保存族人的历史）和 **orator**（发表演说）；再分清 **mosque**（穆斯林祈祷的地方）和 **chapel**（基督教的小教堂）。",
      ),
      spelling: t(
        "Watch **reign** (a silent *g*), **mosque** (*-que* saying /k/), **succession** (double *c* and double *s*) and **capital** (*-al* for the city; *capitol* is a building).",
        "注意 **reign** 中不发音的 **g**、**mosque** 中读 /k/ 的 **-que**、**succession** 双写 **c** 和 **s**，以及 **capital**（城市用 -al；capitol 是一栋建筑）。",
      ),
    },
    notes: `
      sultan|the ruler of a Muslim kingdom welcoming traders to his palace|a son taking the throne after an old ruler died|a ruler ordering a new mosque for his capital|sultan is a ruler; griot is a storyteller|sultan 是君主；griot 是说唱艺人|griot is a storyteller and keeper of history, not the ruler of a kingdom|griot 是讲故事、保存历史的人，不是一国之君|scholar studies a subject deeply, not a ruler who sits on a throne|scholar 是深入钻研学问的人，不是坐在王位上的君主|sul · tan|the -an ending|结尾是 -an
      mosque|a mud-brick building in Djenné where Muslims pray|Muslims gathering for Friday prayers|Muslim scholars teaching beside a prayer hall|mosque is where Muslims pray; chapel is a small Christian church|mosque 是穆斯林祈祷的地方；chapel 是基督教小教堂|chapel is a small Christian church or prayer room, not a Muslim place of prayer|chapel 是基督教的小教堂或祈祷室，不是穆斯林祈祷的地方|capital is the city where a government is based, not a building for prayer|capital 是政府所在的城市，不是祈祷的建筑|mosque|the -que ending saying /k/|结尾 -que 读 /k/
      griot|a singer telling the story of an empire's founder to the kora|a family's singer who remembered its history|a singer playing the kora and singing about ancestors|griot sings and keeps history; orator gives speeches|griot 歌唱并保存历史；orator 发表演说|orator is a person who gives speeches, not a singer who keeps a people's history|orator 是发表演说的人，不是保存族人历史的歌者|sultan is a ruler, not a storyteller and singer|sultan 是君主，不是讲故事的歌者|gri · ot|the t at the end is silent|结尾的 t 不发音
      pilgrimage|Mansa Musa's journey to the holy city of Mecca|a journey to a holy city lasting more than a year|thousands traveling each year to pray at a holy shrine|pilgrimage is a journey to a holy place; march is a walk to protest or support a cause|pilgrimage 是去圣地的旅程；march 是为抗议或支持某事的游行|march is an organized walk to protest or support a cause, not a journey made to a holy place|march 是为抗议或支持某事组织的游行，不是前往圣地的旅程|succession is the order in which one ruler follows another, not a journey|succession 是君主继位的顺序，不是一段旅程|pil · grim · age|the -age ending|结尾是 -age
      prosperity|gold trade making an empire and its people rich|years of peace when farms and markets did well|a road that let village families afford new homes|prosperity is being rich and successful; inflation is prices rising|prosperity 是富裕兴旺；inflation 是物价上涨|inflation is a rise in prices so that money buys less, not the state of being rich and successful|inflation 是物价上涨、钱不值钱，不是富裕兴旺|succession is the order in which rulers follow one another, not wealth and success|succession 是君主继位的顺序，不是财富与成功|pros · per · i · ty|the -ity ending|结尾是 -ity
      ruler|Mansa Musa controlling the gold fields of Mali|a wise leader listening to the people before giving orders|the kings of an empire who took the title mansa|ruler is one person who controls a country; regime is a whole government|ruler 是统治国家的一个人；regime 是整个政府|griot is a storyteller and keeper of history, not the person who controls a country|griot 是讲故事、保存历史的人，不是统治国家的人|regime is a whole government, often a strict one, not one person who rules|regime 是整个政府，常指专制政府，不是一位统治者|rul · er|rule drops its silent e before -er|rule 去掉不发音的 e 再加 -er
      reign|the long time of a king in which an empire doubled in size|a young queen ruling for more than fifty years|Sundiata's twenty years on the throne from about 1235|reign is the time one ruler rules; succession is who comes next|reign 是在位时期；succession 是谁来继位|succession is the passing of a throne from one ruler to the next, not the time one ruler spends on it|succession 是王位从一位君主传到下一位，不是一位君主在位的时间|capital is a city where a government is based, not a time of rule|capital 是政府所在的城市，不是统治时期|reign|a silent g|g 不发音
      succession|a fight over which son would be the next king|rules saying the king's brother would rule next|a throne passing from an old king to his nephew|succession is who rules next; reign is how long one rules|succession 是谁接着继位；reign 是在位多久|reign is the time one ruler spends on the throne, not the order of who comes next|reign 是一位君主在位的时期，不是谁接着继位的顺序|prosperity is wealth and success, not who rules next|prosperity 是富裕和成功，不是谁接着统治|suc · ces · sion|double c and double s|双写 c，双写 s
      oral|a history spoken aloud and never written down|a report given aloud instead of written|traditions passed on by word of mouth|oral means spoken; digital means stored by computers|oral 是口头的；digital 是数字化的|digital means stored and shown by computers, not spoken aloud|digital 指用电脑存储和显示，不是口头说出|classical means from ancient Greece or Rome, not spoken rather than written|classical 指古希腊罗马的，不是口头而非书面的|o · ral|the -al ending|结尾是 -al
      capital|Niani, the city the king of Mali ruled from|Paris, the city where the French government meets|the city where a king's government sat, weeks away for traders|capital is the city where a government sits; regime is the government itself|capital 是政府所在的城市；regime 是政府本身|mosque is a building for prayer, not the city where a government is based|mosque 是祈祷的建筑，不是政府所在的城市|regime is a government itself, not the city where it is based|regime 是政府本身，不是政府所在的城市|cap · i · tal|-al for the city (a capitol is a building)|城市用 -al（capitol 是一栋建筑）
    `,
  },
);

const saharan = batch(
  "words-of-the-saharan-trade",
  ["Words of the Saharan Trade", "撒哈拉贸易的词"],
  ["the trade across the Sahara", "穿越撒哈拉的贸易"],
  `
  commodity|a product that is bought and sold, such as gold, salt or grain|商品|Salt was a valuable ___ that merchants bought and sold in the desert trade.|Oil is the most important ___ that the country sells to other nations.|Coffee is one ___ that is bought and sold in markets all over the world.|exchange,nugget|commodities
  precious|of great value; not to be wasted|宝贵的，珍贵的|In the desert, water is so ___ that no one wastes a single drop.|She keeps her grandmother's ___ old letters safe in a box and would never throw them away.|Gold was the most ___ metal in the market, worth more than any other.|gilded,frugal
  exchange|giving one thing and receiving another in return|交换|Traders gave salt in ___ for gold.|The two schools set up a student ___, with each sending ten pupils to the other.|In ___ for his help with my homework, I fixed his bike.|commodity,transport|exchanges,exchanged
  camel|a large animal with one or two humps that can travel far without water|骆驼|A ___ can walk for days across the desert without drinking.|The traders loaded salt onto the ___, which carried it across the sand on its long legs.|The ___ bent its long legs and knelt so the rider could climb on.|saddle,scavenger|camels
  saddle|a seat fastened to the back of an animal for riding|鞍，马鞍|He tied the bags to the leather ___ on the camel's back.|The leather ___ was worn smooth by years of riders.|She climbed into the ___ on the horse's back and rode away.|camel,slab|saddles
  slab|a thick, flat piece of something hard|厚板，平板|A thick, flat ___ of salt could weigh thirty kilograms.|They covered the well with a heavy, flat stone ___.|He cut a thick, flat ___ of cheese for each guest.|nugget,saddle|slabs
  weigh|to measure how heavy something is; also to have a certain weight|称重；重达|Merchants used scales to ___ the gold dust before they paid for it.|A full load of salt can ___ as much as a grown man.|Put the apples on the scale so I can ___ them before you pay.|exchange,transport|weighs,weighed
  nugget|a small lump of gold or another metal as it is found in the earth|金块，矿块|The miner found a small ___ of gold in the river.|A single gold ___, no bigger than a pea, could buy a horse.|He kept the shiny little ___ of gold in a leather bag.|slab,commodity|nuggets
  transport|to carry people or goods from one place to another; also a way of doing so|运输|Camels were used to ___ salt across the desert to the markets.|Boats on the river were the cheapest way to ___ goods to the coast.|Trucks ___ the fruit from the farms to the city every morning.|exchange,weigh|transported,transports
  mine|a deep hole or tunnel from which gold, salt or other minerals are dug|矿，矿井|Workers dug blocks of salt out of the deep ___.|The tunnels of the gold ___ went deep into the hill in every direction.|The ___ closed when there was no more gold to dig.|nugget,workshop|mines
  `,
  "context-clues",
  {
    intro: t(
      "At the edge of the desert, a merchant would **weigh** each **slab** of salt, load it onto a **camel**, and **exchange** it for gold in the markets to the south. These ten words help you follow the great trade across the Sahara.",
      "在沙漠边缘，商人会称（**weigh**）每一块盐板（**slab**）的重量，把它装上骆驼（**camel**），再到南方的集市上用它交换（**exchange**）黄金。这十个词帮你了解横越撒哈拉的大宗贸易。",
    ),
    watchOut: {
      meanings: t(
        "Tell **slab** (a *thick, flat* piece) apart from **nugget** (a *small lump* of metal); **commodity** is any product that is bought and sold, whatever its shape.",
        "分清 **slab**（厚而平的一块）和 **nugget**（一小块天然金属）；**commodity** 泛指买卖的商品，与形状无关。",
      ),
      use: t(
        "Tell **exchange** (give one thing and *get another back*) apart from **transport** (*carry* goods somewhere) and **weigh** (find out how *heavy* something is).",
        "分清 **exchange**（以物换物）、**transport**（把货物运到别处）和 **weigh**（称出有多重）。",
      ),
      spelling: t(
        "Watch **weigh** (*eigh* with a silent *gh*), **saddle** (double *d*), **nugget** (double *g*) and **precious** (*-cious*).",
        "注意 **weigh** 的 **eigh**（gh 不发音）、**saddle** 双写 **d**、**nugget** 双写 **g**，以及 **precious** 的 **-cious**。",
      ),
    },
    notes: `
      commodity|salt bought and sold by merchants in the desert trade|oil, the main product a country sells to other nations|coffee bought and sold in markets around the world|commodity is a product that is traded; exchange is the act of trading|commodity 是被买卖的商品；exchange 是交换这一行为|exchange is the act of giving one thing for another, not a product that is bought and sold|exchange 是以物换物的行为，不是被买卖的商品|nugget is a small lump of metal found in the earth, not any product sold in trade|nugget 是地里找到的一小块金属，不是泛指贸易中的商品|com · mod · i · ty|double m|双写 m
      precious|desert water so valuable that no one wastes a drop|a grandmother's old letters too dear to throw away|gold, worth more than any other metal in the market|precious means truly valuable; gilded means only coated with gold|precious 是真正宝贵；gilded 只是镀了金|gilded means covered with a thin layer of gold, not of great value in itself|gilded 指表面镀了薄金，不是本身价值很高|frugal describes a person careful with money, not a thing of great value|frugal 形容人节俭，不是形容东西珍贵|pre · cious|the -cious ending|结尾是 -cious
      exchange|traders giving salt and getting gold back|two schools each sending pupils to the other|fixing a friend's bike in return for help with homework|exchange is giving and getting back; transport is carrying goods somewhere|exchange 是有给有得；transport 是把货物运走|commodity is the product being traded, not the giving of one thing for another|commodity 是被交易的商品，不是以物换物这一行为|transport is carrying things from place to place, not giving one thing and getting another back|transport 是把东西从一处运到另一处，不是给出一样换回另一样|ex · change|ex + change|ex 加 change
      camel|an animal that walks for days across the desert without drinking|an animal carrying salt across the sand on its long legs|an animal bending its long legs to kneel for a rider|camel is the animal; saddle is the seat on its back|camel 是动物本身；saddle 是背上的鞍|saddle is the seat fastened on an animal, not the animal itself|saddle 是固定在动物背上的座鞍，不是动物本身|scavenger is any animal that eats dead animals or waste, not a humped animal that can go long without water|scavenger 是吃尸体或垃圾的动物，不是长时间不喝水的驼峰动物|cam · el|the -el ending|结尾是 -el
      saddle|a leather seat on a camel's back with bags tied to it|a leather seat worn smooth by years of riders|a seat on a horse's back that a rider climbs into|saddle is the seat; camel is the animal that carries it|saddle 是座鞍；camel 是背鞍的动物|camel is the animal itself, not the seat fastened on its back|camel 是动物本身，不是固定在它背上的座鞍|slab is a thick, flat piece of something hard, not a seat for riding|slab 是厚而平的硬块，不是骑乘的座鞍|sad · dle|double d and the -le ending|双写 d，结尾是 -le
      slab|a thick, flat block of salt weighing thirty kilograms|a heavy, flat stone covering a well|a thick, flat piece of cheese for each guest|slab is thick and flat; nugget is a small lump|slab 又厚又平；nugget 是一小块|nugget is a small lump of metal, not a thick, flat piece|nugget 是一小块金属，不是又厚又平的一块|saddle is a seat for riding, not a flat piece of something hard|saddle 是骑乘的座鞍，不是平平的硬块|slab|one b at the end|结尾只有一个 b
      weigh|merchants using scales on gold dust before paying|a load of salt as heavy as a grown man|apples put on a scale before paying|weigh means to measure how heavy; transport means to carry|weigh 是称重；transport 是运输|exchange means to give one thing and get another back, not to find out how heavy something is|exchange 是以物换物，不是称出东西有多重|transport means to carry goods from place to place, not to measure their weight|transport 是把货物运到别处，不是称它们的重量|weigh|eigh with a silent gh|eigh 中的 gh 不发音
      nugget|a small lump of gold found in a river|a gold lump no bigger than a pea that could buy a horse|a shiny little lump of gold kept in a bag|nugget is a small lump; slab is a thick, flat piece|nugget 是一小块；slab 是厚而平的一块|slab is a thick, flat piece, not a small lump|slab 是厚而平的一块，不是一小块|commodity is any product that is bought and sold, not a small lump of metal|commodity 是泛指买卖的商品，不是一小块金属|nug · get|double g|双写 g
      transport|camels carrying salt across the desert to markets|river boats carrying goods to the coast|trucks carrying fruit from farms to the city|transport means to carry; exchange means to trade one thing for another|transport 是运输；exchange 是交换|exchange means to give one thing and get another back, not to carry goods from one place to another|exchange 是以物换物，不是把货物从一处运到另一处|weigh means to find out how heavy something is, not to carry it somewhere|weigh 是称出有多重，不是把东西运到别处|trans · port|trans + port|trans 加 port
      mine|workers digging blocks of salt out of a deep hole|tunnels dug deep into a hill for gold|a place that closed when there was no more gold to dig|mine is the hole that metal is dug from; nugget is a lump that is found|mine 是挖矿的矿井；nugget 是找到的一小块金属|nugget is a small lump of metal that is found, not the hole it is dug from|nugget 是找到的一小块金属，不是挖它的矿井|workshop is a room where things are made or repaired, not a hole where minerals are dug|workshop 是制作或修理东西的房间，不是挖矿的地方|mine|the silent e that makes the i long|不发音的 e 让 i 读长音
    `,
  },
);

const scholars = batch(
  "words-of-scholars-and-books",
  ["Words of Scholars and Books", "学者与书籍的词"],
  ["scholars, schools and the making of books", "学者、学校与书籍的制作"],
  `
  scholar|a person who studies a subject deeply|学者|The ___ spent forty years studying the stars and writing about them.|Timbuktu drew every ___ who wanted to study law and science deeply.|A good ___ must read carefully and question everything.|copyist,treatise|scholars
  manuscript|a book or document written by hand|手稿，手抄本|The ___ was written by hand in black ink, page after page.|Families in Timbuktu kept each old handwritten ___ in a wooden chest.|Before printing, every book was a ___, written out by hand.|pamphlet,binding|manuscripts
  university|a place of advanced learning where students study for degrees|大学|Sankore was a great center of advanced learning, like a modern ___ where students earn degrees.|She hopes to study medicine at a ___ and earn a degree.|The ___ has teachers for every subject and gives degrees to its students.|library,scholar|universities
  treatise|a long, serious piece of writing on one subject|论文，专著|The doctor wrote a long ___ on the treatment of fever, hundreds of pages long.|His serious ___ on law was studied by judges for centuries.|She read a long, careful ___ on the movement of the planets.|pamphlet,notebook|treatises
  library|a place where books are kept for people to read or borrow|图书馆|The ___ of the mosque held thousands of books for anyone to read.|I return my borrowed books to the ___ on Fridays.|With shelves of books to borrow, a good ___ is a treasure for a town.|university,binding|libraries
  copyist|a person whose job was to copy books by hand|抄写员|By lamplight, the ___ copied the old book word by word.|A skilled ___ could copy a whole book by hand in a month.|Every ___ checked the copy against the original for mistakes.|scholar,manuscript|copyists
  binding|the cover that holds the pages of a book together|装订，封皮|The book had a thick ___ of red leather that held its pages together.|The old ___ cracked when I opened the book, and pages fell out.|Workers sewed the pages together and glued them into the ___.|leather,ink
  memorize|to learn something so well that you can say it without looking|记住，背诵|Students had to ___ long poems so they could say them without looking.|I ___ my lines for the school play so I do not need the script on stage.|It is easier to ___ a list if you sing it until you know it by heart.|iterate,download|memorized,memorizes
  leather|the skin of an animal prepared for making things such as shoes and bags|皮革|The book was covered in soft brown ___ made from goat skin.|Camel ___, made from the animal's skin, was used for bags and saddles.|My ___ shoes, made from cowhide, keep my feet dry.|binding,ink
  ink|a colored liquid used for writing, drawing or printing|墨水|Scribes made black ___ for writing from soot and gum.|The ___ of the old letter had faded from black to brown.|I spilled blue ___ all over my homework.|leather,binding|inks
  `,
  "context-clues",
  {
    intro: t(
      "In a quiet room in Timbuktu, a **copyist** dipped his pen in **ink** while a **scholar** checked each page of the old **manuscript**. These ten words help you describe the schools, scholars and handmade books of the past.",
      "在廷巴克图一间安静的屋子里，一名抄写员（**copyist**）把笔蘸进墨水（**ink**），一位学者（**scholar**）则逐页核对那本古老的手抄本（**manuscript**）。这十个词帮你描写过去的学校、学者和手工制作的书。",
    ),
    watchOut: {
      meanings: t(
        "Tell **manuscript** (written *by hand*) apart from **treatise** (a *long, serious* work) and **pamphlet** (a *thin* printed booklet).",
        "分清 **manuscript**（手写的书）、**treatise**（长篇严肃的论著）和 **pamphlet**（薄薄的印刷小册子）。",
      ),
      use: t(
        "Tell **scholar** (*studies* a subject deeply) apart from **copyist** (*copies* books by hand); tell **library** (books to *borrow*) apart from **university** (study for *degrees*).",
        "分清 **scholar**（深入钻研学问）和 **copyist**（手抄书籍）；再分清 **library**（借书的地方）和 **university**（攻读学位的地方）。",
      ),
      spelling: t(
        "Watch **scholar** (*sch* saying /sk/), **library** (the *r* after *b*), **treatise** (*ea* and *-ise*) and **copyist** (keep the *y*).",
        "注意 **scholar** 中读 /sk/ 的 **sch**、**library** 中 **b** 后面的 **r**、**treatise** 的 **ea** 和 **-ise**，以及 **copyist** 保留 **y**。",
      ),
    },
    notes: `
      scholar|a person who spent forty years studying and writing about the stars|people who came to Timbuktu to study law and science deeply|a person who reads carefully and questions everything|scholar studies a subject deeply; copyist copies books by hand|scholar 深入钻研学问；copyist 手抄书籍|copyist copies books by hand, not someone who studies a subject deeply|copyist 是手抄书籍的人，不是深入钻研学问的人|treatise is a long piece of writing, not a person|treatise 是长篇论著，不是人|schol · ar|sch saying /sk/ and the -ar ending|sch 读 /sk/，结尾是 -ar
      manuscript|a book written by hand in black ink page after page|an old handwritten book kept in a wooden chest|books written out by hand before printing|manuscript is written by hand; pamphlet is printed|manuscript 是手写的；pamphlet 是印刷的|pamphlet is a thin printed booklet, not a book written by hand|pamphlet 是薄薄的印刷小册子，不是手写的书|binding is the cover that holds pages together, not the handwritten book itself|binding 是把书页装在一起的封皮，不是手写的书本身|man · u · script|manu (hand) + script|manu（手）加 script
      university|a center of advanced learning where students earn degrees|a place to study medicine and earn a degree|a place with teachers for every subject that gives degrees|university gives degrees; library lends books|university 授予学位；library 出借图书|library is a place for reading and borrowing books, not a school that gives degrees|library 是读书借书的地方，不是授予学位的学校|scholar is a person, not a place of learning|scholar 是人，不是学习的场所|u · ni · ver · si · ty|the -sity ending|结尾是 -sity
      treatise|a doctor's long book on treating fever|a serious work on law studied by judges for centuries|a long, careful work on the movement of the planets|treatise is long and serious; pamphlet is thin and short|treatise 长篇而严肃；pamphlet 薄而短|pamphlet is a thin, short booklet, not a long and serious work|pamphlet 是又薄又短的小册子，不是长篇严肃的论著|notebook is a book of blank pages for notes, not a finished piece of serious writing|notebook 是记笔记的空白本子，不是完成的严肃论著|trea · tise|ea and the -ise ending|有 ea，结尾是 -ise
      library|a mosque's collection of thousands of books for anyone to read|a place to return borrowed books on Fridays|shelves of books to borrow that are a treasure for a town|library lends books; university gives degrees|library 出借图书；university 授予学位|university is a place where students study for degrees, not a place to borrow books|university 是攻读学位的地方，不是借书的地方|binding is a book's cover, not a building full of books|binding 是书的封皮，不是满是书的建筑|li · brar · y|the r after b, often missed|b 后面的 r 容易漏掉
      copyist|a man copying an old book word by word by lamplight|a person who could copy a whole book by hand in a month|a person checking a copy against the original for mistakes|copyist copies books; scholar studies them|copyist 抄书；scholar 研究学问|scholar studies a subject deeply, not someone paid to copy books|scholar 深入钻研学问，不是受雇抄书的人|manuscript is the handwritten book, not the person who writes it out|manuscript 是手写的书，不是抄写它的人|cop · y · ist|copy keeps its y before -ist|copy 加 -ist 时保留 y
      binding|a red leather cover holding a book's pages together|an old book cover that cracked and let pages fall out|pages sewn and glued into a cover|binding is the cover; leather is one material it can be made of|binding 是封皮；leather 是封皮可能用的材料|leather is a material made from animal skin, not the cover that holds pages together|leather 是用动物皮制成的材料，不是把书页装在一起的封皮|ink is a liquid for writing, not a book's cover|ink 是写字用的液体，不是书的封皮|bind · ing|bind + ing|bind 加 ing
      memorize|students learning long poems to say without looking|an actor learning lines so he needs no script|singing a list until you know it by heart|memorize means to learn by heart; iterate means to repeat and improve|memorize 是背下来；iterate 是反复改进|iterate means to repeat a process and improve it each time, not to learn something by heart|iterate 是重复一个过程并逐次改进，不是把东西背下来|download means to copy a file from the internet to a device, not to learn something in your own memory|download 是把文件从网上下载到设备上，不是记在自己脑子里|mem · o · rize|memory drops its y and adds -ize|memory 去掉 y 加 -ize
      leather|soft brown goat skin covering a book|camel skin made into bags and saddles|shoes made from cowhide that keep feet dry|leather is animal skin; binding is a book's cover|leather 是动物皮；binding 是书的封皮|binding is the cover of a book, not the material made from animal skin|binding 是书的封皮，不是用动物皮制成的材料|ink is a colored liquid, not animal skin|ink 是彩色液体，不是动物皮|leath · er|ea saying a short e|ea 读短音 e
      ink|black writing liquid made from soot and gum|faded writing on an old letter|a blue liquid spilled over homework|ink is the liquid for writing; leather is animal skin|ink 是写字的液体；leather 是动物皮|leather is animal skin, not a liquid for writing|leather 是动物皮，不是写字的液体|binding is the cover of a book, not the liquid it is written in|binding 是书的封皮，不是写字用的液体|ink|n then k, with no c|n 后接 k，没有 c
    `,
  },
);

const infection = batch(
  "words-of-infection",
  ["Words of Infection", "传染的词"],
  ["infections and how they spread", "传染病及其传播"],
  `
  contagious|able to spread from one person to another|传染性的|Measles is very ___, so sick children stay home to keep it from spreading.|Her laugh was ___, and soon everyone around her was laughing too.|The doctor said the rash was not ___, so no one else could catch it.|chronic,fatal
  epidemic|the fast spread of a disease among many people in one area|流行病|A cholera ___ swept through one city in 1854, making thousands of its people sick.|That winter the flu ___ hit only our valley; towns beyond the mountains stayed healthy.|Doctors in the city worked day and night as the ___ spread from street to street.|pandemic,quarantine|epidemics
  antibody|a substance the body makes to fight a particular germ|抗体|After you have had the illness, your blood holds the ___ your body made to fight that germ.|Each ___ the body makes attacks only one kind of germ.|A vaccine helps the body make the right ___ without getting sick first.|symptom,carrier|antibodies
  symptom|a sign of an illness, such as a fever or a cough|症状|A sore throat was the first ___ that told her she was getting ill.|The main ___ of the disease, the sign doctors look for, is a high fever.|Call a doctor if any ___, such as a cough or a fever, lasts more than three days.|antibody,infection|symptoms
  infection|an illness caused by germs entering the body|感染|Wash the cut so germs cannot get in and cause ___.|The ___ spread from his ear to his throat as the germs grew.|She took medicine to kill the germs and fight the ___.|epidemic,symptom|infections
  quarantine|keeping people or animals apart for a time so that a disease does not spread|隔离检疫|The sailors were kept apart on their ship in ___ for forty days before they could land.|The sick puppy was kept away from the other dogs in ___ until it was well.|The town was under ___, and no one could leave until the fever passed.|outbreak,pandemic
  pandemic|a disease that spreads across many countries or the whole world|大流行病|The flu ___ of 1918 spread to every continent and killed millions.|During the ___, people in countries around the world stayed home.|When a disease spreads across the whole world, the ___ can last for years.|epidemic,quarantine|pandemics
  outbreak|a sudden start of a disease or of something unpleasant|爆发，突然发生|A sudden ___ of measles began at the camp when three children fell ill on one day.|Health workers tried to stop the ___ in its first days, before it could spread.|The ___ started suddenly in a crowded market.|quarantine,epidemic|outbreaks
  carrier|a person or animal that carries a germ and can pass it on, sometimes without being sick|携带者，带菌者|The mosquito is the ___ of malaria, passing the germ from person to person.|She was a healthy ___ of the illness: she never felt sick, but she passed it on.|Rats were the main ___ of the fleas that spread the plague.|pathogen,antibody|carriers
  isolation|being kept apart from other people|隔离，孤立|Living alone on the tiny island, the lighthouse keeper grew used to his ___ from other people.|After a month of ___ in a snowed-in cabin with no visitors, he was glad to see his friends.|The shy boy's ___ ended when he joined the chess club and made friends.|quarantine,carrier
  `,
  "context-clues",
  {
    intro: t(
      "The first **symptom** was a fever, and within a week the **outbreak** at the school had become an **epidemic**, so the sick children went into **quarantine**. These ten words help you explain how diseases spread and how people stop them.",
      "最初的症状（**symptom**）是发烧，不到一周，学校里的疫情爆发（**outbreak**）就变成了一场流行病（**epidemic**），生病的孩子都被隔离检疫（**quarantine**）。这十个词帮你解释疾病如何传播、人们如何阻止它。",
    ),
    watchOut: {
      meanings: t(
        "Tell **outbreak** (the sudden *start*) apart from **epidemic** (fast spread in *one area*) and **pandemic** (spread across *many countries*).",
        "分清 **outbreak**（突然爆发的开端）、**epidemic**（在一个地区迅速流行）和 **pandemic**（蔓延到许多国家）。",
      ),
      use: t(
        "Tell **symptom** (a *sign* of illness) apart from **infection** (the illness the germs *cause*) and **antibody** (what the body makes to *fight* a germ); **carrier** passes a germ on, **pathogen** is the germ.",
        "分清 **symptom**（生病的迹象）、**infection**（病菌引起的感染）和 **antibody**（身体制造来对抗病菌的物质）；**carrier** 传播病菌，**pathogen** 是病菌本身。",
      ),
      spelling: t(
        "Watch **contagious** (*-gious*), **quarantine** (*qu* and *-ine*), **symptom** (*y* and a *p* before *t*) and **carrier** (double *r*).",
        "注意 **contagious** 的 **-gious**、**quarantine** 的 **qu** 和 **-ine**、**symptom** 的 **y** 和 **t** 前的 **p**，以及 **carrier** 双写 **r**。",
      ),
    },
    notes: `
      contagious|measles spreading so easily that sick children stay home|a laugh that spread until everyone was laughing|a rash that no one else could catch|contagious means spreading from person to person; chronic means lasting a long time|contagious 是会传染的；chronic 是长期的|chronic means lasting a long time, not spreading from one person to another|chronic 指长期持续，不是在人与人之间传播|fatal means causing death, not passing from person to person|fatal 指致命，不是在人与人之间传播|con · ta · gious|the -gious ending|结尾是 -gious
      epidemic|cholera spreading through one city and making thousands sick|flu that hit only one valley while towns beyond the mountains stayed healthy|a disease spreading from street to street in a city|epidemic spreads through one area; pandemic spreads across many countries|epidemic 在一个地区流行；pandemic 蔓延到许多国家|pandemic spreads across many countries or the world, not through one area|pandemic 蔓延到许多国家甚至全世界，不只在一个地区|quarantine is keeping people apart to stop a disease, not the disease spreading|quarantine 是隔离人群以阻止疾病，不是疾病的传播|ep · i · dem · ic|epi + demic|epi 加 demic
      antibody|a substance left in the blood that fights a germ after an illness|substances the body makes that each attack one kind of germ|a substance a vaccine helps the body make|antibody fights a germ; symptom is a sign of illness|antibody 对抗病菌；symptom 是生病的迹象|symptom is a sign of being ill, such as a fever, not something the body makes to fight a germ|symptom 是发烧之类的生病迹象，不是身体制造来对抗病菌的东西|carrier is a person or animal that spreads a germ, not a substance that fights it|carrier 是传播病菌的人或动物，不是对抗病菌的物质|an · ti · bod · y|anti + body|anti 加 body
      symptom|a sore throat telling a girl she was getting ill|a high fever that doctors look for as a sign of a disease|a cough or a fever lasting more than three days|symptom is a sign of illness; infection is the illness itself|symptom 是生病的迹象；infection 是感染本身|antibody is what the body makes to fight a germ, not a sign of being ill|antibody 是身体制造来对抗病菌的，不是生病的迹象|infection is the illness itself, not a sign of it such as a cough|infection 是疾病本身，不是咳嗽之类的迹象|symp · tom|y and the p before t|有 y，t 前面有 p
      infection|germs getting into a cut|germs spreading from an ear to a throat|medicine killing germs to fight an illness|infection is the illness germs cause; symptom is a sign of it|infection 是病菌引起的疾病；symptom 是它的迹象|epidemic is a disease spreading among many people, not germs inside one body|epidemic 是疾病在许多人中传播，不是一个人体内的病菌|symptom is only a sign of illness, not the germs causing it|symptom 只是生病的迹象，不是引起疾病的病菌|in · fec · tion|the -tion ending|结尾是 -tion
      quarantine|sailors kept apart on their ship for forty days before landing|a sick puppy kept away from other dogs until it was well|a town no one could leave until a fever passed|quarantine keeps people apart to stop a disease; outbreak is a disease starting|quarantine 是隔离以阻止疾病；outbreak 是疾病爆发|outbreak is the sudden start of a disease, not keeping people apart to stop it|outbreak 是疾病突然爆发，不是隔离人群以阻止它|pandemic is a disease spreading around the world, not a time of being kept apart|pandemic 是蔓延全球的疾病，不是被隔离的一段时间|quar · an · tine|qu and the -ine ending|有 qu，结尾是 -ine
      pandemic|the 1918 flu that spread to every continent|countries around the world where people stayed home|a disease spreading across the whole world|pandemic spreads across the world; epidemic stays in one area|pandemic 蔓延全球；epidemic 限于一个地区|epidemic spreads among many people in one area, not across many countries|epidemic 在一个地区的许多人中传播，不是跨越许多国家|quarantine is keeping people apart, not the disease itself|quarantine 是隔离人群，不是疾病本身|pan · dem · ic|pan (all) + demic|pan（全部）加 demic
      outbreak|measles suddenly starting when three children fell ill on one day|a disease in its first days before it could spread|a disease starting suddenly in a crowded market|outbreak is the sudden start; epidemic is the fast spread that may follow|outbreak 是突然爆发；epidemic 是随后的迅速流行|quarantine is keeping people apart, not the sudden start of a disease|quarantine 是隔离人群，不是疾病的突然爆发|epidemic is a disease already spreading fast among many people, not its sudden start|epidemic 是已经在许多人中迅速传播的疾病，不是刚刚爆发|out · break|out + break|out 加 break
      carrier|mosquitoes passing the malaria germ from person to person|a woman who never felt sick but passed an illness on|rats carrying the fleas that spread the plague|carrier passes a germ on; pathogen is the germ itself|carrier 传播病菌；pathogen 是病菌本身|pathogen is the germ itself, not the person or animal that carries it|pathogen 是病菌本身，不是携带它的人或动物|antibody fights a germ, not something that carries it to others|antibody 对抗病菌，不是把病菌带给别人的东西|car · ri · er|double r, and y becomes i in carry → carrier|双写 r，carry 的 y 变成 i
      isolation|a lighthouse keeper living alone on a tiny island|a month in a snowed-in cabin with no visitors|a shy boy alone until he joined a chess club|isolation is any being apart from others; quarantine is being kept apart to stop a disease|isolation 泛指与人隔绝；quarantine 是为防病而隔离|quarantine is keeping people apart for a set time to stop a disease spreading, not simply being alone|quarantine 是为防止疾病传播而隔离一段时间，不只是独自一人|carrier is someone who passes on a germ, not the state of being apart from others|carrier 是传播病菌的人，不是与人隔绝的状态|i · so · la · tion|isolate drops its e and adds -ion|isolate 去掉 e 加 -ion
    `,
  },
);

const medicine = batch(
  "words-of-medicine",
  ["Words of Medicine", "医学的词"],
  ["doctors and medical treatment", "医生与治疗"],
  `
  diagnose|to find out what illness someone has|诊断|The doctor used an X-ray to ___ the broken bone in his wrist.|It is hard to ___ a disease when the patient has only one symptom.|Blood tests helped the doctors ___ the child's illness and find out what it was.|inoculate,disinfect|diagnosed,diagnoses
  chronic|lasting a long time or coming back often|慢性的|Asthma is a ___ illness that can last a whole lifetime.|For years he has had ___ pain in his knee that keeps coming back.|___ diseases, which last for years, need care for a long time.|contagious,fatal
  remedy|something that cures an illness or solves a problem|疗法，补救办法|Honey and lemon is an old ___ that cures a sore throat.|There is no quick ___ that will fix a broken heart.|The best ___ for tiredness is a long night's sleep.|dose,antiseptic|remedies
  surgeon|a doctor who performs operations|外科医生|The ___ cut open the leg and repaired the torn muscle.|Every ___ washes her hands carefully before an operation.|Lister was a ___ who made operations safer by fighting infection.|pharmacist,scientist|surgeons
  antiseptic|a substance that kills germs on skin or tools|消毒剂，防腐剂|The nurse cleaned the cut with ___ to kill the germs.|Lister sprayed ___ in the operating room to kill germs on the tools.|A dab of ___ cream kills the germs and stops a scratch from getting infected.|remedy,dose|antiseptics
  dose|the amount of a medicine taken at one time|剂量|Take one ___ of the medicine every six hours.|The doctor gave the small child a smaller ___ of medicine than the adults.|Too large a ___ of any medicine can be dangerous.|prescription,remedy|doses
  prescription|a doctor's written order for a medicine|处方|The pharmacist read the doctor's ___ and filled the bottle.|You need a ___ written by a doctor to buy this medicine.|The doctor wrote a ___ for eye drops and signed it.|dose,remedy|prescriptions
  therapy|a treatment that helps someone recover over time|疗法，治疗|After the accident, she needed months of ___ to walk again.|Weekly speech ___ helped him say the sounds clearly over time.|Music ___, with songs every afternoon, calms some patients over several weeks.|remedy,prevention|therapies
  inoculate|to put a weak form of a germ into the body so that it learns to fight the disease|接种，预防注射|Jenner was the first to ___ a boy against smallpox with cowpox.|Nurses came to ___ the whole school against measles.|Farmers ___ their cattle against disease with a weak form of the germ.|diagnose,disinfect|inoculated,inoculates
  pharmacist|a person trained to prepare and sell medicines|药剂师|The ___ explained how often to take the pills he had prepared.|Ask the ___ at the drugstore whether the two medicines are safe together.|The ___ filled the bottle with pills and typed the label.|surgeon,scientist|pharmacists
  `,
  "context-clues",
  {
    intro: t(
      "The doctor could **diagnose** the rash in a minute, wrote a **prescription** for cream, and told the **pharmacist** to explain the right **dose**. These ten words help you talk about doctors and the ways they treat illness.",
      "医生一分钟就诊断（**diagnose**）出了皮疹，开了一张药膏处方（**prescription**），并让药剂师（**pharmacist**）讲清正确的剂量（**dose**）。这十个词帮你谈论医生以及他们治病的方法。",
    ),
    watchOut: {
      meanings: t(
        "Tell **remedy** (something that *cures*) apart from **dose** (*how much* medicine you take at once) and **antiseptic** (a substance that kills *germs* on skin or tools).",
        "分清 **remedy**（能治好病的东西）、**dose**（一次吃多少药）和 **antiseptic**（杀死皮肤或器械上病菌的消毒剂）。",
      ),
      use: t(
        "Tell **diagnose** (find out *what* illness someone has) apart from **inoculate** (give a weak germ to *protect* the body) and **disinfect** (kill germs on *things*); tell **surgeon** (operates) apart from **pharmacist** (prepares medicines).",
        "分清 **diagnose**（查出得了什么病）、**inoculate**（接种弱化病菌以保护身体）和 **disinfect**（给物品消毒）；再分清 **surgeon**（做手术）和 **pharmacist**（配药）。",
      ),
      spelling: t(
        "Watch **surgeon** (*-geon*), **pharmacist** (*ph* and *-cist*), **prescription** (*pre-*, not *per-*) and **inoculate** (one *n*, one *c*).",
        "注意 **surgeon** 的 **-geon**、**pharmacist** 的 **ph** 和 **-cist**、**prescription** 开头是 **pre-**（不是 per-），以及 **inoculate** 只有一个 **n**、一个 **c**。",
      ),
    },
    notes: `
      diagnose|a doctor using an X-ray to find a broken bone in a wrist|a disease that is hard to identify from only one symptom|blood tests that showed what a child's illness was|diagnose means to find out what illness someone has; inoculate means to protect against one|diagnose 是查出得了什么病；inoculate 是预防某种病|inoculate means to put a weak germ into the body to protect it, not to find out what illness someone has|inoculate 是把弱化的病菌放进体内来保护身体，不是查出得了什么病|disinfect means to kill germs with a cleaner, not to find out what is wrong with a patient|disinfect 是用消毒剂杀菌，不是查出病人得了什么病|di · ag · nose|di + ag + nose|di 加 ag 加 nose
      chronic|asthma that can last a whole lifetime|knee pain that keeps coming back for years|diseases that need care for years|chronic means long-lasting; contagious means spreading to others|chronic 是长期的；contagious 是会传染的|contagious means spreading from person to person, not lasting a long time|contagious 指在人与人之间传播，不是持续很久|fatal means causing death, not lasting or coming back|fatal 指致命，不是长期持续或反复发作|chron · ic|ch saying /k/|ch 读 /k/
      remedy|honey and lemon that cure a sore throat|a cure that could fix a broken heart|a long sleep that cures tiredness|remedy is what cures; dose is how much medicine you take at once|remedy 是治好病的东西；dose 是一次用药的量|dose is the amount of a medicine taken at one time, not something that cures a problem|dose 是一次服药的量，不是能解决问题的办法|antiseptic kills germs on skin or tools, not a cure for any illness or problem|antiseptic 是给皮肤或器械杀菌的，不是治各种病或问题的办法|rem · e · dy|the -edy ending|结尾是 -edy
      surgeon|a doctor cutting open a leg to repair a torn muscle|a doctor washing her hands before an operation|Lister making operations safer|surgeon performs operations; pharmacist prepares medicines|surgeon 做手术；pharmacist 配药|pharmacist prepares and sells medicines, not a doctor who operates|pharmacist 配制和出售药品，不是做手术的医生|scientist studies nature through experiments, not a doctor who performs operations|scientist 用实验研究自然，不是做手术的医生|sur · geon|the -geon ending|结尾是 -geon
      antiseptic|a nurse killing the germs in a cut|Lister killing germs on the tools in an operating room|a cream that kills germs on a scratch|antiseptic kills germs; remedy cures an illness|antiseptic 杀菌；remedy 治病|remedy cures an illness or a problem, not a substance used to kill germs on skin or tools|remedy 是治病或解决问题的办法，不是给皮肤或器械杀菌的东西|dose is an amount of medicine, not a substance that kills germs|dose 是药量，不是杀菌的物质|an · ti · sep · tic|anti + septic|anti 加 septic
      dose|one amount of medicine every six hours|a smaller amount of medicine for a small child|too large an amount of medicine being dangerous|dose is the amount taken at once; prescription is the doctor's written order|dose 是一次的用量；prescription 是医生的书面处方|prescription is the doctor's written order, not the amount you take at once|prescription 是医生的书面医嘱，不是一次服用的量|remedy is something that cures, not the amount of medicine taken at one time|remedy 是治病的东西，不是一次服药的量|dose|s saying /s/ before a silent e|s 读 /s/，后面的 e 不发音
      prescription|a doctor's order a pharmacist reads before filling a bottle|a doctor's written order needed to buy a medicine|a signed order for eye drops|prescription is a doctor's written order; dose is how much you take|prescription 是医生的书面处方；dose 是服用的量|dose is the amount you take at one time, not the doctor's written order|dose 是一次服用的量，不是医生的书面医嘱|remedy is anything that cures, not a written order from a doctor|remedy 泛指能治病的东西，不是医生开的书面医嘱|pre · scrip · tion|pre- (not per-) and -tion|开头是 pre-（不是 per-），结尾是 -tion
      therapy|months of treatment so a woman could walk again|weekly speech lessons that helped over time|songs every afternoon calming patients over weeks|therapy is treatment over time; remedy is a cure|therapy 是长期治疗；remedy 是治愈的办法|remedy is a cure, often a quick one, not treatment carried out over weeks or months|remedy 是治愈的办法，常常见效快，不是持续几周或几个月的治疗|prevention stops something bad before it happens, not treatment that helps someone recover afterward|prevention 是事先防止坏事发生，不是事后帮人康复的治疗|ther · a · py|th and the -apy ending|有 th，结尾是 -apy
      inoculate|Jenner giving a boy cowpox to protect him from smallpox|nurses protecting a whole school against measles|farmers giving cattle a weak germ to protect them|inoculate protects the body; diagnose finds out what illness someone has|inoculate 是保护身体；diagnose 是查出病因|diagnose means to find out what illness someone has, not to protect them from one|diagnose 是查出得了什么病，不是预防疾病|disinfect means to kill germs on things with a cleaner, not to protect the body by giving it a weak germ|disinfect 是用消毒剂给物品杀菌，不是接种弱化病菌来保护身体|in · oc · u · late|one n and one c|只有一个 n、一个 c
      pharmacist|a person explaining how often to take pills he prepared|a person at a drugstore who knows whether medicines are safe together|a person filling a bottle with pills and typing the label|pharmacist prepares medicines; surgeon performs operations|pharmacist 配药；surgeon 做手术|surgeon performs operations, not someone who prepares and sells medicines|surgeon 做手术，不是配制和出售药品的人|scientist studies the natural world, not someone who prepares medicines for customers|scientist 研究自然界，不是为顾客配药的人|phar · ma · cist|ph and the -cist ending|有 ph，结尾是 -cist
    `,
  },
);

/** batchesA are the batches of words of units 1 to 5 of grade 7. */
export const batchesA: readonly BatchSpec[] = [
  debate,
  courts,
  rules,
  deepSea,
  tides,
  conservation,
  renaissance,
  newScience,
  workshops,
  westAfrica,
  saharan,
  scholars,
  infection,
  medicine,
];
