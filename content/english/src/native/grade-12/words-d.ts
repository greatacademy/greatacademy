// Grade 12: the batches of words of rhetoric and logic, temperament and character, and belief and worship.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const rhetoric = batch(
  "words-of-rhetoric-and-oratory",
  ["Words of Rhetoric and Oratory", "修辞与演说的词"],
  ["the art of moving an audience", "打动听众的艺术"],
  `
  ethos|the appeal a speaker makes through his or her character and trustworthiness|人格诉求，信誉|The doctor's ___, the trust she had earned in thirty years of practice, made every patient believe her.|A speaker with no ___, whose honesty no one trusts, is hard to believe however well she talks.|She built her ___ by admitting her own mistakes, so that listeners came to trust her character.|pathos,oratory|
  pathos|the quality in a speech or story that makes people feel pity or sadness|感染力，哀婉|The ___ of the last scene, where the old dog waits for a master who never returns, made the audience cry.|His speech relied on ___ more than on facts, moving the crowd to pity with stories of hungry children.|There is real ___ in her letters from the war, which still make readers weep.|ethos,eulogy|
  antithesis|the placing of opposite ideas side by side; the exact opposite|对照，对偶；对立面|"Ask not what your country can do for you, but what you can do for your country" sets opposites side by side in a famous ___.|Hate is the ___ of love, its exact opposite.|The speech was built on ___, pairing opposites again and again: war and peace, fear and hope.|litotes,invective|antitheses,antithetical
  litotes|understatement that says something by denying its opposite, as in "not bad"|曲言法，反叙法|"She is no fool," meaning she is very clever, is an example of ___.|The British love ___, calling a terrible storm "not the best of days".|By ___, saying "not small" means very large, a meaning made by denying the opposite.|antithesis,harangue|
  invective|harsh, insulting language|谩骂，抨击|The letter was full of ___ against the judge, calling him a fool, a liar and a thief.|He met criticism with a stream of ___, insulting every reporter who questioned him.|Her ___, rude names and insults hurled at her rival, shocked even her supporters.|pathos,eulogy|
  diatribe|a long, angry attack in speech or writing|长篇抨击|The column was a ___ against modern art, three angry pages attacking every painter alive.|At dinner he launched into a ___ about taxes, raging for half an hour.|Her long, furious ___ attacked everyone in the room one by one.|litotes,panegyric|diatribes
  harangue|a long, loud, scolding speech|长篇训斥|At half time the coach gave his team a furious ___, shouting at them for twenty minutes.|We sat through the headmaster's ___ about manners, an hour of loud scolding.|The angry general's ___ at the troops, a long and loud scolding, lasted an hour.|eulogy,litotes|harangued
  eulogy|a speech that praises someone, especially one who has died|颂词，悼词|Her son gave the ___ at the funeral, praising his mother's courage.|The ___, spoken beside the grave, recalled his kindness to strangers.|The article was written as a fond ___ to the old cinema, praising it in the week it was pulled down.|invective,litotes|eulogies
  panegyric|a speech or piece of writing full of praise|颂文，赞词|The biography is a ___, not an honest study, since it praises its hero on every page.|The poet wrote a ___ to the emperor, a hundred lines of praise for his wisdom and glory.|The review was close to a ___, praising every song on the album.|diatribe,harangue|
  oratory|the art of public speaking, or speaking of great skill|演说术，雄辩|Churchill's ___, the skill and power of his speeches, lifted the nation's hopes.|She studied ___ at college, learning the art of speaking in public.|The debate was won by ___, by skill in speaking, not by evidence.|ethos,harangue|
  `,
  "context-clues",
  {
    intro: t(
      "A great speaker earns trust through **ethos**, moves listeners with **pathos**, and can shift from a warm **eulogy** to a furious **diatribe**. These ten words help you describe how speeches persuade, praise, attack and scold.",
      "优秀的演说者靠人格（**ethos**）赢得信任，用感染力（**pathos**）打动听众，既能发表温情的悼词（**eulogy**），也能发出愤怒的长篇抨击（**diatribe**）。这十个词帮你描述演说如何说服、赞美、攻击和训斥。",
    ),
    watchOut: {
      meanings: t(
        "**Ethos** persuades through the speaker's character, **pathos** through the listeners' feelings; a doctor with thirty years of practice has ethos, a story of hungry children has pathos.",
        "**ethos** 靠演说者的人格说服人，**pathos** 靠听众的情感打动人；行医三十年的医生有 ethos，饥饿儿童的故事有 pathos。",
      ),
      use: t(
        "A **eulogy** and a **panegyric** both praise, but a eulogy is usually spoken for someone who has died, while a **diatribe** and a **harangue** attack or scold.",
        "**eulogy** 和 **panegyric** 都是赞美，但 eulogy 通常是为逝者而说；**diatribe** 和 **harangue** 则是攻击或训斥。",
      ),
      spelling: t(
        "**Litotes** ends in -es though it is singular, **eulogy** begins with eu-, and **harangue** ends in -gue.",
        "**litotes** 虽以 -es 结尾却是单数；**eulogy** 以 eu- 开头；**harangue** 结尾是 -gue。",
      ),
    },
    notes: `
      ethos|trust earned in thirty years of practice|a speaker whose honesty no one trusts|listeners coming to trust a character through honesty|ethos is the appeal of a speaker's character; pathos is the appeal to listeners' feelings|ethos 是人格诉求；pathos 是情感诉求|pathos stirs pity in listeners, not the trust a speaker earns through character and honesty|pathos 激起听众的怜悯，不是演说者凭人格和诚实赢得的信任|oratory is skill in speaking, which a speaker can have without being trusted, but this is trust in a person's character|oratory 是演说技巧，可以有技巧却不被信任，而这里说的是对人格的信任|e · thos|the th in the middle|中间是 th
      pathos|a dog waiting for a master who never returns|a crowd moved to pity by stories of hungry children|wartime letters that still make readers weep|pathos is the quality that stirs pity; ethos is the appeal of a speaker's character|pathos 是感染力；ethos 是人格诉求|ethos is the trust a speaker's character earns, not a scene or a letter that makes people weep with pity|ethos 是人格赢得的信任，不是让人哀怜落泪的场景或书信|a eulogy is a speech praising someone, not the sadness found in a scene, a speech or letters|eulogy 是赞颂某人的演说，不是场景、演讲或书信中的哀婉|pa · thos|the th near the end|靠近结尾是 th
      antithesis|a famous line setting opposites side by side|hate as the exact opposite of love|a speech pairing war and peace, fear and hope|antithesis places opposites side by side; litotes is understatement by denying the opposite|antithesis 是对照；litotes 是反叙|litotes is understatement such as "not bad", not setting two opposite ideas side by side|litotes 是“不坏”之类的含蓄说法，不是把两个相反的观点并列|invective is insulting language, not opposites placed side by side|invective 是辱骂的言辞，不是把相反的观点并列|an · tith · e · sis|the -thesis ending|结尾是 -thesis
      litotes|"no fool" meaning very clever|a terrible storm called "not the best of days"|"not small" meaning very large|litotes is understatement by denying the opposite; antithesis places opposites side by side|litotes 是反叙；antithesis 是对照|antithesis sets two opposites side by side, but this says one thing by denying its opposite|antithesis 把两个对立面并列，而这里是通过否定反面来表达|a harangue is a long scolding speech, not a short understatement|harangue 是长篇训斥，不是简短的含蓄说法|li · to · tes|the -es ending, though it is singular|结尾 -es，却是单数
      invective|a letter calling a judge a fool, a liar and a thief|insults hurled at every reporter|rude names hurled at a rival|invective is harsh, insulting language; pathos is the quality that stirs pity|invective 是谩骂；pathos 是感染力|pathos stirs pity and sadness, not insults hurled at a judge, reporters or a rival|pathos 激起怜悯哀伤，不是向法官、记者或对手抛出的辱骂|a eulogy praises someone, the opposite of calling people liars and fools|eulogy 是赞颂，和骂人骗子、蠢货正好相反|in · vec · tive|the -ive ending|结尾是 -ive
      diatribe|three angry pages attacking every painter alive|half an hour of raging about taxes|a furious attack on everyone in a room|a diatribe is a long, angry attack; a panegyric is a speech full of praise|diatribe 是长篇抨击；panegyric 是颂文|litotes is a mild understatement, the opposite of a long, angry, raging attack|litotes 是温和的含蓄说法，和冗长愤怒的抨击正好相反|a panegyric is full of praise, the opposite of an angry attack|panegyric 满是赞美，和愤怒的抨击正好相反|di · a · tribe|the word *tribe* at the end|结尾是 *tribe*
      harangue|a coach shouting at his team for twenty minutes|a headmaster scolding loudly for an hour|a general's long, loud scolding of his troops|a harangue is a long, loud, scolding speech; a eulogy is a speech of praise|harangue 是长篇训斥；eulogy 是颂词|a eulogy praises someone, the opposite of shouting at a team, pupils or troops|eulogy 是赞美，和对球队、学生或士兵大声训斥正好相反|litotes is a quiet understatement, not a long, loud scolding|litotes 是轻描淡写，不是又长又响的训斥|ha · rangue|the -gue ending|结尾是 -gue
      eulogy|a son praising his mother's courage at her funeral|words beside a grave recalling kindness|a fond article praising a cinema pulled down|a eulogy praises someone, especially the dead; invective is insulting language|eulogy 是颂词、悼词；invective 是谩骂|invective insults people, the opposite of praising a mother, a kind man or a beloved cinema|invective 是辱骂，和赞美母亲、善人或心爱的影院正好相反|litotes is understatement, not a whole speech or article of praise|litotes 是含蓄说法，不是整篇赞颂的演说或文章|eu · lo · gy|the eu- start|开头是 eu-
      panegyric|a biography praising its hero on every page|a hundred lines praising an emperor|a review praising every song|a panegyric is full of praise; a diatribe is a long, angry attack|panegyric 是颂文；diatribe 是长篇抨击|a diatribe attacks angrily, the opposite of praising a hero, an emperor or an album|diatribe 是愤怒抨击，和赞美英雄、皇帝或专辑正好相反|a harangue scolds loudly, not praises on every page or in every line|harangue 是大声训斥，不是满篇赞美|pan · e · gyr · ic|the y in -gyr-|-gyr- 中是 y
      oratory|the skill and power of Churchill's speeches|the art of speaking in public studied at college|skill in speaking winning a debate|oratory is the art or skill of public speaking; ethos is the trust a speaker's character earns|oratory 是演说术；ethos 是人格诉求|ethos is trust in a speaker's character, not skill in speaking that is studied or that wins a debate without evidence|ethos 是对人格的信任，不是可以学习、无需证据就能赢得辩论的演说技巧|a harangue is one scolding speech, not the art of speaking that lifts hopes or is studied at college|harangue 是一次训斥，不是鼓舞人心、可在大学学习的演说艺术|or · a · to · ry|the -tory ending|结尾是 -tory
    `,
  },
);

const logic = batch(
  "words-of-logic-and-error",
  ["Words of Logic and Error", "逻辑与谬误的词"],
  ["good and bad reasoning", "好的推理与坏的推理"],
  `
  fallacy|a mistaken belief, or a mistake in reasoning that makes an argument invalid|谬误，谬论|It is a ___ that money buys happiness, a mistaken belief that study after study has shown to be false.|The argument rests on a simple ___, a mistake in reasoning that makes the whole conclusion invalid.|She spotted the ___ in his reasoning, the faulty step that made his argument collapse.|tautology,paradox|fallacies
  tautology|saying the same thing twice in different words, so that nothing is added|同义反复|"A free gift" is a ___, since every gift is already free and the word adds nothing.|"It is what it is" is a kind of ___, saying the same thing twice and telling us nothing new.|The definition, "a widow is a woman whose husband has died and who is a widow", was a ___ and explained nothing.|fallacy,contradiction|tautological
  sophistry|clever but false reasoning meant to deceive|诡辩|The lawyer's ___, clever arguments that were false but sounded true, confused the jury.|His defense was pure ___, a web of clever, misleading reasoning meant to fool his listeners.|Students learned to spot the ___ in advertising, the clever but dishonest arguments made to trick buyers.|tautology,counterexample|sophist
  casuistry|clever but dishonest reasoning about moral questions|诡辩(尤指道德问题)|By some ___, he persuaded himself that stealing from the rich was a moral duty.|Her excuses were pure ___, clever arguments that turned every wrong she had done into a right.|The essay exposes the ___ of the tobacco firms, who argued that selling cigarettes was a kind of freedom worth defending.|counterexample,tautology|
  counterexample|a single case that shows a general claim is false|反例|One black swan is enough of a ___ to prove "all swans are white" false.|To disprove the claim that all primes are odd, give the ___ 2, a single even prime.|A single ___, one patient the drug did not help, was enough to sink the theory that it always works.|contradiction,non sequitur|counterexamples
  contradiction|a statement that says the opposite of another, or of itself|矛盾|"A round square" is a ___, since nothing can be both round and square.|There is a ___ between what he says and what he does: he preaches honesty but tells lies.|Her two answers were in ___, the first saying yes and the second no.|tautology,counterexample|contradictions,contradictory
  paradox|a statement that seems absurd or self-contradictory but may be true|悖论，似非而是的说法|It is a ___, absurd at first but true, that the more we know, the more we know we don't know.|The ___ of thrift, strange as it sounds, says that if everyone saves more, everyone can end up poorer.|Zeno's ___ about a race that can never end seems absurd, yet no one could easily say what was wrong with it.|contradiction,fallacy|paradoxes,paradoxical
  plausible|seeming reasonable or likely to be true|貌似合理的|His excuse was ___ but false: it sounded believable, yet he had made it up.|The theory is ___, reasonable enough to be true, but it still needs testing.|She gave the police her ___ account of the night, a story so likely that they believed it.|ad hominem,cryptic|plausibly
  non sequitur|a statement that does not follow from what was said before|不合逻辑的推论|"It's raining, so I must be right" is a ___, since the second part has nothing to do with the first.|His answer was a ___: asked about the budget, he talked about his dog.|Every reply in the debate was a ___ that had nothing to do with the question before it.|tautology,counterexample|non sequiturs
  ad hominem|attacking the person who makes an argument rather than the argument itself|人身攻击的|His attack was ___: it went after her clothes and her family, not her ideas.|The debate sank into ___ insults, each speaker mocking the other's looks instead of answering his points.|Keep personal and ___ remarks out of your essay, and argue against the ideas, not the writer.|plausible,dogmatic|
  `,
  "context-clues",
  {
    intro: t(
      "His argument rested on a **fallacy**, her reply was a **non sequitur**, and the debate sank into **ad hominem** insults until one **counterexample** settled the matter. These ten words help you name good and bad reasoning, and the tricks that make a false argument sound true.",
      "他的论证建立在谬误（**fallacy**）之上，她的回答是不合逻辑的推论（**non sequitur**），辩论沦为人身攻击（**ad hominem**），直到一个反例（**counterexample**）解决了问题。这十个词帮你说出推理的好坏，以及让错误论证听起来正确的伎俩。",
    ),
    watchOut: {
      meanings: t(
        "A **contradiction** cannot be true, as in a round square, while a **paradox** only seems absurd and may be true, as in the more we know, the more we know we don't know.",
        "**contradiction** 不可能为真，如“圆的方形”；**paradox** 只是看似荒谬，却可能为真，如“知道得越多，越知道自己无知”。",
      ),
      use: t(
        "**Sophistry** is any clever, false reasoning, while **casuistry** is clever, false reasoning about right and wrong; a lawyer's tricks are sophistry, excusing a theft as a moral duty is casuistry.",
        "**sophistry** 泛指巧妙的错误推理，**casuistry** 专指在是非道德上的诡辩；律师的花招是 sophistry，把偷窃说成道德义务是 casuistry。",
      ),
      spelling: t(
        "**Non sequitur** and **ad hominem** are two words each, from Latin, **tautology** has the au twice, and **sophistry** begins with soph-.",
        "**non sequitur** 和 **ad hominem** 都是来自拉丁语的两个词；**tautology** 两处都是 au；**sophistry** 以 soph- 开头。",
      ),
    },
    notes: `
      fallacy|a belief that money buys happiness|a simple mistake making a conclusion invalid|a faulty step that made an argument collapse|a fallacy is a mistaken belief or a mistake in reasoning; a tautology says the same thing twice|fallacy 是谬误；tautology 是同义反复|a tautology repeats itself but is not false, while this belief is shown false and this step makes the argument fail|tautology 只是重复而不为假，而这里的观念被证明是错的，推理步骤使论证失败|a paradox seems absurd but may be true, while this belief and this step are simply wrong|paradox 看似荒谬却可能为真，而这里的观念和推理步骤就是错的|fal · la · cy|the double l and the -acy ending|双写 l，结尾 -acy
      tautology|"a free gift", since every gift is free|"it is what it is", saying nothing new|a definition of a widow that used the word widow|a tautology says the same thing twice; a fallacy is a mistake in reasoning|tautology 是同义反复；fallacy 是谬误|a fallacy is a false belief or faulty reasoning, but these phrases are not false, only empty repetition|fallacy 是错误观念或推理，而这些说法并不错，只是空洞重复|a contradiction says two opposite things, but these phrases say the same thing twice|contradiction 是说出两件相反的事，而这些说法是把同一件事说两遍|tau · tol · o · gy|the au at the start and the -logy ending|开头 au，结尾 -logy
      sophistry|clever false arguments that confused a jury|a web of misleading reasoning meant to fool listeners|dishonest arguments in advertising meant to trick buyers|sophistry is clever but false reasoning meant to deceive; a tautology is saying the same thing twice|sophistry 是诡辩；tautology 是同义反复|a tautology is harmless repetition, not clever reasoning meant to fool a jury, listeners or buyers|tautology 是无害的重复，不是用来蒙骗陪审团、听众或顾客的巧辩|a counterexample is one case that honestly disproves a claim, the opposite of tricking people|counterexample 是诚实地推翻一个主张的个例，和欺骗人正好相反|soph · is · try|the soph- start|开头是 soph-
      casuistry|persuading oneself that stealing from the rich is a duty|turning every wrong one has done into a right|arguing that selling cigarettes is a freedom worth defending|casuistry is dishonest reasoning about right and wrong; a counterexample is a case that disproves a claim|casuistry 是道德诡辩；counterexample 是反例|a counterexample is one honest case that disproves a claim, not clever excuses that turn wrongs into rights|counterexample 是推翻主张的诚实个例，不是把错说成对的巧妙借口|a tautology just repeats itself, not twists arguments about stealing, wrongs or cigarettes|tautology 只是重复，不是在偷窃、过错或香烟问题上歪曲论证|cas · u · is · try|the u after cas-|cas- 后是 u
      counterexample|one black swan disproving a rule about swans|the even prime 2 disproving a claim about primes|one patient the drug did not help|a counterexample is one case that shows a general claim false; a contradiction says the opposite of itself|counterexample 是反例；contradiction 是矛盾|a contradiction is a statement opposing itself, not one real swan, number or patient that disproves a rule|contradiction 是自相矛盾的陈述，不是推翻规则的一只天鹅、一个数或一位病人|a non sequitur is a statement that does not follow, not one case that proves a general claim false|non sequitur 是不相连贯的陈述，不是推翻普遍主张的个例|coun · ter · ex · am · ple|*counter* plus *example*, written as one word|*counter* 加 *example*，合写成一个词
      contradiction|a round square, which nothing can be|preaching honesty but telling lies|a first answer of yes and a second of no|a contradiction says the opposite of another statement or itself; a tautology says the same thing twice|contradiction 是矛盾；tautology 是同义反复|a tautology says the same thing twice, but these pairs say two opposite things|tautology 是把同一件事说两遍，而这里是两件相反的事|a counterexample is one case disproving a rule, not two statements that clash with each other|counterexample 是推翻规则的个例，不是两个相互冲突的说法|con · tra · dic · tion|contra- plus *diction*|contra- 加 *diction*
      paradox|the more we know, the more we know we don't know|everyone saving more and ending up poorer|a race that can never end, though no one could say what was wrong|a paradox seems absurd but may be true; a contradiction cannot be true at all|paradox 是似非而是；contradiction 是矛盾|a contradiction cannot be true, but these sayings, absurd at first, turn out to be true or hard to refute|contradiction 不可能为真，而这些说法乍看荒谬，却是真的或难以驳倒|a fallacy is plainly a mistake, but these sayings are true or so strong that no one could find the mistake|fallacy 显然是错误，而这些说法是真的，或强到无人能找出错处|par · a · dox|the -dox ending|结尾是 -dox
      plausible|a made-up excuse that sounded believable|a theory reasonable enough to be true|a story so likely that the police believed it|plausible means seeming reasonable or likely; ad hominem means attacking the person|plausible 是貌似合理的；ad hominem 是人身攻击的|ad hominem describes an attack on a person, not an excuse, a theory or a story that sounds believable|ad hominem 形容针对人的攻击，不形容听起来可信的借口、理论或故事|cryptic means hard to understand, the opposite of an excuse, theory or story that seems easy to believe|cryptic 是晦涩难懂的，和听起来令人信服的借口、理论或故事正好相反|plau · si · ble|the au and the -ible ending|含 au，结尾 -ible
      non sequitur|"it's raining, so I must be right"|a budget question answered with talk about a dog|replies with nothing to do with the question|a non sequitur is a statement that does not follow; a tautology says the same thing twice|non sequitur 是不合逻辑的推论；tautology 是同义反复|a tautology repeats the same idea, but these replies jump to something completely unrelated|tautology 是重复同一个意思，而这些回答跳到了毫不相干的事情上|a counterexample is a case that disproves a claim, not a reply with nothing to do with the question|counterexample 是推翻主张的个例，不是答非所问的回复|non se · qui · tur|two words, the second with qu|两个词，第二个词含 qu
      ad hominem|an attack on her clothes and family, not her ideas|speakers mocking looks instead of answering points|remarks against the writer instead of the ideas|ad hominem means attacking the person instead of the argument; plausible means seeming likely|ad hominem 是人身攻击的；plausible 是貌似合理的|plausible means seeming believable, not aimed at a person's clothes, looks or character instead of their ideas|plausible 是听起来可信的，不是针对人的衣着、相貌或品格而非观点|dogmatic means stubbornly sure of one's own beliefs, not attacking a speaker instead of the ideas|dogmatic 是固执己见，不是攻击说话者本人而非其观点|ad hom · i · nem|two words: *ad* and *hominem*|两个词：*ad* 和 *hominem*
    `,
  },
);

const temperament = batch(
  "words-of-the-four-temperaments",
  ["Words of the Four Temperaments", "四种气质的词"],
  ["moods and dispositions", "情绪与性情"],
  `
  phlegmatic|calm and not easily excited or upset|冷静的，迟钝的|The ___ captain did not panic in the storm; he gave his orders in the same slow, flat voice as ever.|Even the ___ judge, who never showed any feeling, raised an eyebrow at the strange story.|He has a slow, ___ nature and rarely shows excitement, anger or joy.|sanguine,mercurial|
  choleric|easily made angry|易怒的|The ___ old man shouted at the children the moment their ball touched his fence.|Her ___ temper, flaring into rage over the smallest mistake, scared her staff.|The ___ customer, red in the face with fury, demanded to see the manager.|placid,sanguine|
  sanguine|cheerful and hopeful, even in a difficult situation|乐观的|She is ___ about her chances of winning, cheerfully sure that things will go her way.|The minister gave a hopeful, ___ view of the economy, promising better days ahead.|Despite the bad news, he remained ___, smiling and certain that all would turn out well.|melancholic,petulant|
  melancholic|sad and gloomy by nature|忧郁的|The ___ poet, gloomy all his life, wrote mostly about death and loss.|A slow, ___ tune drifted from the window, so sad that passers-by stopped to listen.|He grew ___ as winter came, sinking into a gloom that lasted until spring.|sanguine,petulant|
  mercurial|changing mood or mind quickly and without warning|善变的，反复无常的|The ___ singer, cheerful one hour and furious the next, canceled the show at the last minute.|Her ___ moods, which swung from joy to rage without warning, made her hard to work with.|The ___ weather of the mountains, sunny one minute and stormy the next, can kill.|equable,stolid|
  placid|calm and peaceful, not easily disturbed|平静的，温和的|The ___ lake, without a ripple, mirrored the trees.|The ___ cow kept chewing peacefully while the dogs barked around her.|He has a ___ temper, and nothing seems to disturb his calm.|choleric,mercurial|placidly
  stolid|calm and showing little emotion or interest|迟钝的，不易激动的|The ___ guard stared straight ahead, showing no interest at all in the tourists' jokes.|Her ___ face, blank and still, gave nothing away.|The ___ farmers, unmoved by the speeches, did not join the protest.|mercurial,irascible|stolidly
  equable|calm and even-tempered; steady, not extreme|平和的；稳定的|Her ___ manner, calm and steady, soothed the angry crowd.|The island's ___ climate, never too hot and never too cold, draws visitors all year.|He remained ___ through the long trial, never losing his temper.|mercurial,choleric|
  irascible|quick to lose one's temper over small things|易怒的，暴躁的|The ___ editor tore up the article in a rage over a single misspelled word.|He became ___ when he was tired, snapping at anyone who spoke to him.|Our ___ neighbor, quick to lose his temper, complained angrily about every noise.|stolid,sanguine|
  petulant|childishly bad-tempered and sulky|任性的，闹脾气的|The ___ child, sulking because he could not have a sweet, refused to eat his dinner.|He gave his ___ reply, sulky as a spoiled child, and stormed out of the room.|The star's ___ demands, like a spoiled child's, annoyed the whole crew.|phlegmatic,equable|petulance,petulantly
  `,
  "context-clues",
  {
    intro: t(
      "The old doctors said every person is **sanguine**, **choleric**, **melancholic** or **phlegmatic**: hopeful, quick to anger, gloomy or calm. These ten words help you describe people's moods and tempers, from steady and peaceful to sulky and changeable.",
      "古代医生认为，每个人不是乐观的（**sanguine**）、易怒的（**choleric**）、忧郁的（**melancholic**），就是冷静的（**phlegmatic**）。这十个词帮你描述人的情绪和脾气，从沉稳平和到任性多变。",
    ),
    watchOut: {
      meanings: t(
        "A **mercurial** person changes mood quickly and without warning, while an **equable** one stays steady and even; the singer was mercurial, the judge equable.",
        "**mercurial** 的人情绪变化快且毫无预兆，**equable** 的人始终沉稳平和；歌手 mercurial，法官 equable。",
      ),
      use: t(
        "**Choleric** and **irascible** describe adults quick to anger, while **petulant** describes childish sulking; an irascible editor rages, a petulant child sulks.",
        "**choleric** 和 **irascible** 形容容易发怒的成年人，**petulant** 形容孩子气的赌气；irascible editor 会暴怒，petulant child 会赌气。",
      ),
      spelling: t(
        "**Phlegmatic** begins with ph and keeps the g of *phlegm*, **sanguine** has -guine, and **irascible** ends in -cible.",
        "**phlegmatic** 以 ph 开头，保留 *phlegm* 中的 g；**sanguine** 含 -guine；**irascible** 结尾是 -cible。",
      ),
    },
    notes: `
      phlegmatic|a captain giving orders in the same flat voice in a storm|a judge who never showed any feeling|a slow nature rarely showing excitement, anger or joy|phlegmatic means calm and not easily excited; sanguine means cheerfully hopeful|phlegmatic 是冷静迟缓的；sanguine 是乐观的|sanguine means cheerful and hopeful, but this calm shows no feeling at all, cheerful or otherwise|sanguine 是乐观开朗的，而这里的冷静不流露任何情绪，开心也不例外|mercurial means changing mood quickly, the opposite of a slow, flat, unexcited nature|mercurial 是情绪多变的，和迟缓平淡、不易激动的性情正好相反|phleg · mat · ic|the ph and the g in phleg-|含 ph，phleg- 中有 g
      choleric|an old man shouting the moment a ball touched his fence|a temper flaring into rage over small mistakes|a customer red with fury|choleric means easily made angry; placid means calm and peaceful|choleric 是易怒的；placid 是平静的|placid means calm and peaceful, the opposite of shouting, flaring rage and fury|placid 是平静温和的，和大喊大叫、怒火爆发正好相反|sanguine means cheerful and hopeful, not quick to rage and fury|sanguine 是乐观的，不是动辄暴怒|chol · er · ic|the ch sounding like k|ch 读作 k
      sanguine|a woman cheerfully sure that things will go her way|a minister promising better days ahead|a man smiling and certain all will be well despite bad news|sanguine means cheerful and hopeful; melancholic means sad and gloomy|sanguine 是乐观的；melancholic 是忧郁的|melancholic means sad and gloomy, the opposite of cheerful hope about winning, the economy or bad news|melancholic 是忧郁悲观的，和对胜算、经济或坏消息抱乐观希望正好相反|petulant means childishly sulky, not cheerful and hopeful|petulant 是孩子气地赌气，不是乐观开朗|san · guine|the -guine ending|结尾是 -guine
      melancholic|a poet gloomy all his life writing about death|a tune so sad that passers-by stopped|a gloom lasting from winter until spring|melancholic means sad and gloomy by nature; sanguine means cheerful and hopeful|melancholic 是忧郁的；sanguine 是乐观的|sanguine means cheerful and hopeful, the opposite of gloom, sad tunes and writing about death|sanguine 是乐观开朗，和忧郁、悲伤的曲调和写死亡正好相反|petulant means childishly sulky, not deeply sad and gloomy|petulant 是孩子气地赌气，不是深沉的忧郁|mel · an · chol · ic|the ch sounding like k|ch 读作 k
      mercurial|a singer cheerful one hour and furious the next|moods swinging from joy to rage without warning|mountain weather sunny one minute and stormy the next|mercurial means changing quickly without warning; equable means steady and even|mercurial 是善变的；equable 是平稳的|equable means steady and even, the opposite of a singer, moods or weather that swing without warning|equable 是平稳的，和毫无预兆地剧变的歌手、情绪或天气正好相反|stolid means showing little emotion, the opposite of swinging between joy and rage|stolid 是不动声色的，和在狂喜与暴怒间摇摆正好相反|mer · cu · ri · al|*Mercury* turned into -ial|由 *Mercury* 变为 -ial
      placid|a lake without a ripple mirroring trees|a cow chewing peacefully while dogs barked|a temper nothing seems to disturb|placid means calm and not easily disturbed; choleric means easily made angry|placid 是平静的；choleric 是易怒的|choleric means easily made angry, the opposite of a still lake, a peaceful cow or an untroubled temper|choleric 是易怒的，和平静的湖面、安详的牛或不受打扰的脾气正好相反|mercurial means changing quickly, the opposite of a lake without a ripple or a calm nothing disturbs|mercurial 是多变的，和无波的湖面或不受打扰的平静正好相反|plac · id|the c sounding like s|c 读作 s
      stolid|a guard showing no interest in tourists' jokes|a blank, still face giving nothing away|farmers unmoved by speeches|stolid means showing little emotion or interest; mercurial means changing quickly|stolid 是不动声色的；mercurial 是善变的|mercurial means swinging quickly between moods, the opposite of a blank face that shows nothing|mercurial 是情绪快速变换，和面无表情、毫无反应正好相反|irascible means quick to anger, not showing no feeling at all|irascible 是易怒的，不是毫无情绪|stol · id|the -id ending, as in *solid*|结尾 -id，同 *solid*
      equable|a calm, steady manner soothing a crowd|a climate never too hot and never too cold|a man never losing his temper through a long trial|equable means calm and steady; mercurial means changing quickly|equable 是平和稳定的；mercurial 是多变的|mercurial means changing quickly and without warning, the opposite of a steady manner, climate or temper|mercurial 是多变无常的，和平稳的举止、气候或脾气正好相反|choleric means easily made angry, the opposite of never losing one's temper|choleric 是易怒的，和从不发脾气正好相反|eq · ua · ble|the qu and the -able ending|含 qu，结尾 -able
      irascible|an editor raging over one misspelled word|a tired man snapping at anyone|a neighbor complaining angrily about every noise|irascible means quick to lose one's temper; stolid means showing little emotion|irascible 是暴躁的；stolid 是不动声色的|stolid means showing little feeling, the opposite of raging, snapping and complaining angrily|stolid 是不动声色的，和暴怒、厉声斥人、怒气冲冲地抱怨正好相反|sanguine means cheerful and hopeful, not quick to lose one's temper|sanguine 是乐观的，不是动辄发火|i · ras · ci · ble|the sc and the -ible ending|含 sc，结尾 -ible
      petulant|a child sulking over a sweet and refusing dinner|a sulky reply before storming out|demands like a spoiled child's|petulant means childishly sulky; phlegmatic means calm and unexcited|petulant 是任性赌气的；phlegmatic 是冷静的|phlegmatic means calm and not easily upset, the opposite of sulking and storming out|phlegmatic 是冷静不易激动的，和赌气、怒冲冲离开正好相反|equable means calm and even-tempered, the opposite of spoiled, sulky demands|equable 是平和的，和被宠坏的、赌气的要求正好相反|pet · u · lant|the -ulant ending|结尾是 -ulant
    `,
  },
);

const sociability = batch(
  "words-of-company-and-solitude",
  ["Words of Company and Solitude", "合群与孤僻的词"],
  ["how people behave with others", "人与他人相处的方式"],
  `
  gregarious|enjoying the company of others|爱交际的，合群的|The ___ host, who loved nothing more than a crowded house, knew every guest by name.|Sheep are ___ animals, always staying close together in a flock.|She is so ___ that she never eats alone, always inviting friends to join her.|taciturn,reticent|
  affable|friendly and easy to talk to|和蔼可亲的|The ___ waiter, chatting easily with every table, remembered our order from last week.|He was ___ even to his rivals, always greeting them with a friendly word.|Her friendly, ___ manner, which made strangers feel at ease, helped her win votes.|dour,morose|affably
  genial|friendly and cheerful|亲切的，友好的|Our ___ landlord, always smiling, brought us a cake on our first day.|The ___ old doctor joked cheerfully with every patient.|The meeting was ___ and short, full of friendly smiles and easy laughter.|dour,diffident|genially
  jovial|cheerful and full of good humor|快活的，愉快的|The ___ uncle told jokes all evening, laughing louder than anyone.|The guests were in a ___ mood, laughing and singing late into the night.|His ___ laugh, full of good humor, filled the room.|morose,taciturn|
  congenial|pleasant because suited to one's tastes; friendly|意气相投的；宜人的|She found the quiet village a ___ place to write, so well suited to her that she stayed ten years.|The noisy work in the city was not ___ to him, since he loved quiet and the countryside.|The team was a ___ group, friendly people who all liked the same books and jokes.|dour,reticent|
  taciturn|saying very little|沉默寡言的|The ___ farmer answered every question with a nod, hardly saying a word.|He was ___ at dinner, speaking only twice, and left early.|Though he barely spoke a word aloud, the ___ old man wrote long letters.|gregarious,jovial|
  reticent|not willing to say much about one's feelings or private life|沉默寡言的，有保留的|She was ___ about her past, changing the subject whenever anyone asked about her childhood.|The ___ witness, unwilling to say what she had seen, had to be pressed for details.|He is ___ in public, keeping his feelings to himself, but warm and open at home.|gregarious,affable|reticence
  diffident|shy and lacking confidence|羞怯的，缺乏自信的|The ___ student rarely spoke in class, too unsure of herself to raise her hand.|He gave a ___ smile, nervous and uncertain, and looked at the floor.|Her shy, ___ manner, which made her doubt every answer, hid a sharp mind.|genial,jovial|diffidence
  morose|gloomy and bad-tempered|闷闷不乐的，阴郁的|He sat ___ in the corner, sulking and snapping at anyone who came near.|The ___ guard, scowling and silent, ignored our questions.|After the loss, the team was ___, gloomy and short-tempered for days.|jovial,affable|morosely
  dour|stern, gloomy and unfriendly|冷峻的，阴沉的|The ___ landlady, stern and cold, never once smiled at her lodgers.|The grim, ___ gray town, with its unfriendly streets, matched his mood.|With a stern, unsmiling face, the ___ judge read out the sentence.|genial,congenial|
  `,
  "context-clues",
  {
    intro: t(
      "The **gregarious** host and his **jovial** uncle laughed all evening, while the **taciturn** farmer nodded and his **dour** wife never smiled. These ten words help you describe how people behave in company, from friendly and talkative to quiet, shy and stern.",
      "爱交际的（**gregarious**）主人和他快活的（**jovial**）叔叔笑了一整晚，而沉默寡言的（**taciturn**）农夫只是点头，他那冷峻的（**dour**）妻子从未露出笑容。这十个词帮你描述人们在社交场合的表现，从友好健谈到沉默、羞怯和严厉。",
    ),
    watchOut: {
      meanings: t(
        "A **taciturn** person says very little about anything, while a **reticent** one keeps quiet about feelings and private life, and a **diffident** one is quiet from lack of confidence.",
        "**taciturn** 的人什么话都很少说，**reticent** 的人对感受和私事闭口不谈，**diffident** 的人则因缺乏自信而沉默。",
      ),
      use: t(
        "A **congenial** place or job suits your tastes, while a **genial** person is friendly and cheerful; a congenial village, a genial landlord.",
        "**congenial** 的地方或工作合你的口味，**genial** 的人友好开朗：a congenial village，a genial landlord。",
      ),
      spelling: t(
        "**Gregarious** has -ar- and -ious, **diffident** has a double f, and **dour** ends in -our.",
        "**gregarious** 含 -ar- 和 -ious；**diffident** 双写 f；**dour** 结尾是 -our。",
      ),
    },
    notes: `
      gregarious|a host who loved a crowded house|sheep staying close together in a flock|a woman who always invites friends to eat with her|gregarious means enjoying others' company; taciturn means saying very little|gregarious 是爱交际的；taciturn 是沉默寡言的|taciturn means saying very little, not loving crowds, flocks and company at every meal|taciturn 是寡言少语，不是喜欢人群、成群结队或每餐都要人陪|reticent means keeping one's feelings private, not loving the company of crowds and friends|reticent 是不愿袒露心事，不是喜欢人群和朋友相伴|gre · gar · i · ous|the -ar- and the -ious ending|含 -ar-，结尾 -ious
      affable|a waiter chatting easily with every table|a friendly word for every rival|a manner that put strangers at ease|affable means friendly and easy to talk to; dour means stern and unfriendly|affable 是和蔼可亲的；dour 是冷峻的|dour means stern and unfriendly, the opposite of chatting easily and greeting rivals kindly|dour 是冷峻不友好，和随和聊天、友善问候对手正好相反|morose means gloomy and bad-tempered, the opposite of a friendly manner that puts people at ease|morose 是阴郁暴躁，和让人自在的友善举止正好相反|af · fa · ble|the double f and the -able ending|双写 f，结尾 -able
      genial|a smiling landlord bringing a cake|a cheerful doctor joking with patients|a meeting full of friendly smiles and laughter|genial means friendly and cheerful; dour means stern and gloomy|genial 是亲切友好的；dour 是阴沉的|dour means stern and gloomy, the opposite of smiling, joking and easy laughter|dour 是冷峻阴沉，和微笑、说笑、轻松的笑声正好相反|diffident means shy and unsure, not cheerfully joking and smiling at everyone|diffident 是羞怯不自信，不是愉快地与人说笑|ge · ni · al|the soft g and the -ial ending|g 发软音，结尾 -ial
      jovial|an uncle telling jokes and laughing loudest|guests laughing and singing late into the night|a laugh full of good humor|jovial means cheerful and full of good humor; morose means gloomy|jovial 是快活的；morose 是闷闷不乐的|morose means gloomy and bad-tempered, the opposite of jokes, singing and a hearty laugh|morose 是阴郁暴躁，和说笑、唱歌、开怀大笑正好相反|taciturn means saying very little, the opposite of telling jokes all evening and laughing loudly|taciturn 是寡言少语，和整晚讲笑话、大声笑正好相反|jo · vi · al|the -ial ending|结尾是 -ial
      congenial|a village so well suited that a writer stayed ten years|city work that did not suit a lover of quiet|friendly people who liked the same books and jokes|congenial means pleasant because suited to one's tastes; dour means stern and gloomy|congenial 是意气相投的、宜人的；dour 是阴沉的|dour means stern and gloomy, not a place, work or group pleasantly suited to someone's tastes|dour 是阴沉严厉，不是合人口味的地方、工作或团体|reticent describes a person who keeps feelings private, not a place, work or group that suits someone|reticent 形容不愿表露的人，不形容合人心意的地方、工作或团体|con · gen · ial|con- plus *genial*|con- 加 *genial*
      taciturn|a farmer answering with a nod|a man speaking only twice at dinner|an old man who barely spoke but wrote long letters|taciturn means saying very little; gregarious means enjoying company|taciturn 是寡言的；gregarious 是爱交际的|gregarious means enjoying company and talk, the opposite of nodding, speaking twice and barely saying a word|gregarious 是爱交际爱聊天，和只点头、只说两句、几乎不开口正好相反|jovial means cheerful and full of jokes, the opposite of hardly saying a word|jovial 是快活爱说笑，和几乎一言不发正好相反|tac · i · turn|the word *turn* at the end|结尾是 *turn*
      reticent|a woman changing the subject whenever asked about her childhood|a witness unwilling to say what she saw|a man keeping his feelings to himself in public|reticent means unwilling to talk about feelings or private matters; gregarious means enjoying company|reticent 是有保留的；gregarious 是爱交际的|gregarious means loving company, which says nothing about telling or hiding one's past, what one saw or one's feelings|gregarious 是爱交际，并不涉及是否说出往事、所见或感受|affable means friendly and easy to talk to, the opposite of avoiding questions and hiding one's feelings|affable 是和蔼易谈，和回避问题、隐藏感受正好相反|ret · i · cent|the -cent ending|结尾是 -cent
      diffident|a student too unsure of herself to raise her hand|a nervous, uncertain smile|a shy manner that made her doubt every answer|diffident means shy and lacking confidence; genial means friendly and cheerful|diffident 是羞怯的；genial 是亲切的|genial means friendly and cheerful, not too unsure, nervous or doubtful to speak|genial 是友好开朗，不是不自信、紧张或怀疑自己|jovial means full of good humor, the opposite of a nervous, uncertain manner|jovial 是快活幽默，和紧张不安的样子正好相反|dif · fi · dent|the double f and the -dent ending|双写 f，结尾 -dent
      morose|a man sulking and snapping in a corner|a scowling, silent guard|a team gloomy and short-tempered after a loss|morose means gloomy and bad-tempered; jovial means cheerful|morose 是阴郁的；jovial 是快活的|jovial means cheerful and full of good humor, the opposite of sulking, scowling and gloom|jovial 是快活幽默，和赌气、皱眉、阴郁正好相反|affable means friendly and easy to talk to, the opposite of snapping at people and ignoring questions|affable 是和蔼易谈，和对人发火、不理问题正好相反|mo · rose|the -rose ending, as in *rose*|结尾 -rose，同 *rose*
      dour|a landlady who never smiled at her lodgers|a grim town with unfriendly streets|a judge with a stern, unsmiling face|dour means stern, gloomy and unfriendly; genial means friendly and cheerful|dour 是冷峻阴沉的；genial 是亲切友好的|genial means friendly and cheerful, the opposite of a cold landlady, a grim town or a stern judge|genial 是友好开朗，和冷漠的房东、阴沉的小镇或严厉的法官正好相反|congenial means pleasantly suited to one's tastes, the opposite of grim, unfriendly and stern|congenial 是宜人合意的，和阴沉、不友好、严厉正好相反|dour|the -our ending|结尾是 -our
    `,
  },
);

const pride = batch(
  "words-of-pride-and-humility",
  ["Words of Pride and Humility", "骄傲与谦卑的词"],
  ["thinking too much or too little of oneself", "自视过高或过低"],
  `
  haughty|proud and unfriendly, looking down on others|傲慢的|The ___ duchess, nose in the air, ignored the servants as if they were beneath her.|She gave him a cold, ___ look, as though he were not worth her time.|His proud, ___ manner, looking down on everyone around him, lost him friends.|unassuming,deferential|haughtily
  supercilious|behaving as if one is better than others|目中无人的，傲慢的|The ___ waiter sneered at our clothes, as if we were not good enough for his restaurant.|She raised a ___ eyebrow, showing that she thought herself far above the question.|His ___ tone, the tone of a man who thinks himself superior, annoyed the panel.|deferential,self-effacing|
  condescending|showing that one thinks oneself better or cleverer than others|居高临下的|His ___ explanation, slow and simple as if they were children, insulted the experts.|Don't be ___ to new members, talking down to them as though they knew nothing.|She spoke in her ___ voice, as if explaining something obvious to a small child.|self-effacing,unassuming|condescend,condescension
  conceited|too proud of oneself and one's abilities|自负的|The ___ actor talked only about himself and his own brilliant performances.|He is clever but ___, never missing a chance to tell you how clever he is.|Her ___ letter, boasting of her many talents, listed all her prizes.|unassuming,self-effacing|conceit
  arrogant|proud in an unpleasant way, thinking one is more important than others|傲慢的，自大的|The ___ manager never listened to his staff, sure that he alone knew best.|It was ___ to ignore the experts' warnings, as if he knew better than all of them.|Her ___ reply, dismissing the other side as fools, ended the talks.|servile,self-effacing|arrogance,arrogantly
  self-effacing|not drawing attention to oneself|谦逊的，不出风头的|The ___ scientist gave all the credit to her team and stayed out of the photographs.|His ___ humor, always making fun of himself, charmed the audience.|She is ___ about her medals, never mentioning them unless she is asked.|haughty,conceited|
  unassuming|modest and not wanting to be noticed|谦逊的，不装腔作势的|The ___ hero refused all interviews, saying he had only done his job.|The restaurant is plain and ___, with no sign outside, but the food is excellent.|In his small town he lived a quiet, ___ life, and few neighbors knew he had once been famous.|conceited,arrogant|
  deferential|showing respect, especially by accepting another's opinion|恭敬的，顺从的|The young clerk bowed and was always ___ to the manager, agreeing with every word he said.|She spoke in a quiet, ___ tone, respectfully accepting the judge's view.|His ___ manner, always yielding politely to his elders, hid his own views.|arrogant,haughty|deference
  servile|too eager to please or obey others|奴性的，卑躬屈膝的|The ___ courtiers, desperate to please, praised every word the king spoke.|He hated the ___ tone of his own letters, which begged and bowed like a slave's.|The press was ___ to the government, printing whatever it was told without a question.|arrogant,haughty|servility
  fawning|trying to please someone by flattering them too much|奉承的，巴结的|Crowds of ___ reporters, gushing with praise, surrounded the star.|Her ___ praise, far too sweet and too much, embarrassed the author.|He wrote a ___ letter to the boss, flattering him in every line.|supercilious,haughty|fawn
  `,
  "context-clues",
  {
    intro: t(
      "The **haughty** duchess looked down on everyone, the **fawning** courtiers flattered the king, and the **self-effacing** scientist gave all the credit to her team. These ten words help you describe people who think too much of themselves, too little, or bow too low to others.",
      "傲慢的（**haughty**）公爵夫人看不起所有人，奉承的（**fawning**）朝臣讨好国王，而谦逊的（**self-effacing**）科学家把功劳全归于团队。这十个词帮你描述自视过高、自视过低或对人过分卑躬屈膝的人。",
    ),
    watchOut: {
      meanings: t(
        "**Deferential** means showing proper respect, while **servile** means bowing far too low; a clerk is deferential to the manager, courtiers who praise every word are servile.",
        "**deferential** 是恰当的恭敬，**servile** 是过分的卑躬屈膝；职员对经理 deferential，对每句话都吹捧的朝臣是 servile。",
      ),
      use: t(
        "You are **condescending** to someone, talking down to them, but **conceited** about yourself, proud of your own talents.",
        "**condescending** 是对别人居高临下（condescending to someone），**conceited** 是对自己过分自负。",
      ),
      spelling: t(
        "**Supercilious** has -cil- and -ious, **self-effacing** keeps its hyphen and a double f, and **haughty** has -augh-.",
        "**supercilious** 含 -cil- 和 -ious；**self-effacing** 保留连字符并双写 f；**haughty** 含 -augh-。",
      ),
    },
    notes: `
      haughty|a duchess with her nose in the air ignoring servants|a cold look as though someone were not worth her time|a proud manner looking down on everyone|haughty means proud and looking down on others; unassuming means modest|haughty 是傲慢的；unassuming 是谦逊的|unassuming means modest and quiet, the opposite of a nose in the air and looking down on others|unassuming 是谦逊低调，和鼻孔朝天、看不起人正好相反|deferential means showing respect to others, the opposite of treating them as beneath one|deferential 是对人恭敬，和视人如草芥正好相反|haugh · ty|the -augh- in the middle|中间是 -augh-
      supercilious|a waiter sneering at customers' clothes|an eyebrow raised as if far above a question|the tone of a man who thinks himself superior|supercilious means behaving as if better than others; deferential means respectful|supercilious 是目中无人的；deferential 是恭敬的|deferential means showing respect, the opposite of sneering and raising an eyebrow from above|deferential 是恭敬的，和冷笑、居高临下地挑眉正好相反|self-effacing means not drawing attention to oneself, the opposite of acting superior|self-effacing 是不出风头，和自命不凡正好相反|su · per · cil · i · ous|the -cil- and the -ious ending|含 -cil-，结尾 -ious
      condescending|an explanation to experts as if they were children|talking down to new members|a voice explaining the obvious to a small child|condescending means treating others as less clever; self-effacing means modest|condescending 是居高临下的；self-effacing 是谦逊的|self-effacing means modestly staying in the background, not talking down to experts, members or anyone|self-effacing 是谦逊地退居幕后，不是对专家、新成员或任何人居高临下|unassuming means modest and plain, the opposite of talking down to people|unassuming 是谦逊朴实，和对人居高临下正好相反|con · de · scend · ing|the -sc- in *descend*|含 *descend* 中的 -sc-
      conceited|an actor talking only about his brilliant performances|a man always telling you how clever he is|a letter boasting of many talents|conceited means too proud of oneself; unassuming means modest|conceited 是自负的；unassuming 是谦逊的|unassuming means modest and not wanting notice, the opposite of boasting of talents and performances|unassuming 是谦逊不张扬，和夸耀才华与表演正好相反|self-effacing means keeping oneself in the background, the opposite of always boasting|self-effacing 是不出风头，和总在自夸正好相反|con · ceit · ed|the ei after c|c 后是 ei
      arrogant|a manager sure he alone knew best|ignoring experts' warnings as if knowing better|a reply dismissing the other side as fools|arrogant means proud and thinking oneself more important; servile means too eager to obey|arrogant 是傲慢的；servile 是奴性的|servile means too eager to please and obey, the opposite of never listening and dismissing others as fools|servile 是过分讨好顺从，和从不听人意见、视人为蠢货正好相反|self-effacing means modestly keeping in the background, the opposite of thinking one knows best|self-effacing 是谦逊低调，和自以为最懂正好相反|ar · ro · gant|the double r and the -ant ending|双写 r，结尾 -ant
      self-effacing|a scientist giving credit to her team and staying out of photos|humor that makes fun of oneself|never mentioning one's medals unless asked|self-effacing means not drawing attention to oneself; haughty means proud and looking down on others|self-effacing 是谦逊的；haughty 是傲慢的|haughty means proud and looking down on others, the opposite of giving away credit and making fun of oneself|haughty 是傲慢看不起人，和让出功劳、自嘲正好相反|conceited means too proud of oneself, the opposite of never mentioning one's medals|conceited 是自负的，和从不提自己的奖牌正好相反|self-ef · fac · ing|the hyphen and the double f|有连字符，双写 f
      unassuming|a hero refusing interviews|a plain restaurant with no sign|a quiet life in which few knew of past fame|unassuming means modest and not wanting notice; conceited means too proud of oneself|unassuming 是谦逊的；conceited 是自负的|conceited means too proud and boastful, the opposite of refusing interviews and living quietly|conceited 是自负爱炫耀，和拒绝采访、低调生活正好相反|arrogant means thinking oneself more important than others, the opposite of plain and modest|arrogant 是妄自尊大，和朴实谦逊正好相反|un · as · sum · ing|un- plus *assuming*|un- 加 *assuming*
      deferential|a clerk bowing and agreeing with a manager|a tone respectfully accepting a judge's view|a manner always yielding politely to elders|deferential means showing respect by accepting another's view; arrogant means thinking oneself more important|deferential 是恭敬的；arrogant 是傲慢的|arrogant means thinking oneself more important, the opposite of bowing, accepting and yielding to others|arrogant 是自以为是，和鞠躬、接受、礼让他人正好相反|haughty means looking down on others, the opposite of respectfully accepting their views|haughty 是看不起人，和恭敬地接受他人观点正好相反|def · er · en · tial|the -tial ending|结尾是 -tial
      servile|courtiers praising every word of a king|letters that begged and bowed like a slave's|a press printing whatever it was told|servile means too eager to please or obey; arrogant means thinking oneself more important|servile 是奴性的；arrogant 是傲慢的|arrogant means proud and dismissive, the opposite of begging, bowing and printing whatever one is told|arrogant 是傲慢轻视，和乞求、鞠躬、言听计从正好相反|haughty means looking down on others, the opposite of desperately trying to please them|haughty 是看不起人，和拼命讨好正好相反|ser · vile|the -vile ending|结尾是 -vile
      fawning|reporters gushing with praise around a star|praise far too sweet that embarrassed an author|a letter flattering a boss in every line|fawning means flattering someone too much; supercilious means acting superior|fawning 是奉承的；supercilious 是目中无人的|supercilious means acting as if better than others, the opposite of gushing praise and flattery|supercilious 是自视高人一等，和滔滔不绝地吹捧奉承正好相反|haughty means looking down on others, not flattering them in every line|haughty 是看不起人，不是句句奉承|fawn · ing|*fawn* plus -ing|*fawn* 加 -ing
    `,
  },
);

const giving = batch(
  "words-of-generosity-and-greed",
  ["Words of Generosity and Greed", "慷慨与贪婪的词"],
  ["giving, keeping and wasting money", "给予、守财和挥霍"],
  `
  munificent|extremely generous|慷慨的，大方的|One former student's ___ gift, ten million dollars given freely, paid for the whole library.|The ___ king, generous beyond measure, gave land to every soldier who had served him.|Her ___ support, gift after huge gift, kept the theater open for twenty years.|parsimonious,avaricious|munificence
  philanthropic|helping people, especially by giving money to good causes|慈善的|The ___ foundation, set up to do good with a rich man's fortune, built three hospitals.|He spent his last years on ___ work, giving away his money to schools and the poor.|Charitable, ___ giving rose sharply after the earthquake, as people sent money to help.|avaricious,miserly|philanthropist,philanthropy
  altruistic|caring about others' welfare more than one's own|利他的，无私的|Her ___ act, diving into the freezing river with no thought for herself, saved a stranger's life.|Not every gift is ___: some people give only to win praise for themselves.|Some animals show ___ behavior, risking their own lives to warn the rest of the herd.|miserly,avaricious|
  avaricious|having an extreme desire for wealth|贪婪的|The ___ landlord, never satisfied with his profits, raised the rent every year.|Greedy, ___ traders hoarded the grain, waiting for prices to rise so they could grow richer.|He was ___ and never satisfied, always hungry for more money however much he had.|munificent,altruistic|avarice
  miserly|hating to spend money|吝啬的|The ___ old man lived in one cold room, too mean to pay for heating though he was rich.|A ___ tip of ten cents, from a man who hated parting with a penny, insulted the waiter.|The company is ___ with pay rises, giving its workers as little as it possibly can.|prodigal,munificent|miser
  parsimonious|unwilling to spend money or use resources|过度节俭的，吝啬的|The ___ council, refusing to spend a penny more than it had to, cut every budget.|He was ___ with praise as well as money, giving out a kind word as rarely as a coin.|The poet's ___ use of words, never one more than she needed, made the poem sharp.|profligate,munificent|parsimony
  stingy|unwilling to give or spend|小气的|Don't be ___ with the sugar: put in a whole spoonful, not a few grains.|The ___ boss, who hated giving away money, gave no bonuses even in a record year.|The airline is ___ with legroom, squeezing in as many seats as it can.|munificent,prodigal|stinginess
  prodigal|spending money or resources too freely; a person who does so|挥霍的；浪子|The ___ son spent his whole inheritance on parties within a year.|Years of ___ use of water, wasted on lawns and fountains, dried up the lake.|The ___ heir, having wasted every coin of his fortune, returned home poor and sorry.|parsimonious,stingy|
  profligate|wildly and shamelessly wasteful|挥霍无度的|The ___ government, wasting money without shame, ran up huge debts.|His ___ lifestyle, with its yachts, casinos and endless parties, ended in ruin.|The club's ___ spending on parties, wild and wasteful, emptied the fund in a month.|stingy,parsimonious|profligacy
  spendthrift|a person who spends money carelessly|挥霍者，败家子|The ___, who wasted every paycheck on clothes and dinners, had spent his salary by the fifth of the month.|She married a charming ___ who spent every penny they had on fast cars.|The ___, wasting everything he borrowed on parties, owed money to every friend.|creditor,beneficiary|spendthrifts
  `,
  "context-clues",
  {
    intro: t(
      "The **munificent** donor gave away millions, the **miserly** landlord would not pay for heating, and the **prodigal** heir wasted his fortune in a year. These ten words help you describe how people give, keep and waste money.",
      "慷慨的（**munificent**）捐赠者捐出数百万，吝啬的（**miserly**）房东连暖气钱都不肯出，而挥霍的（**prodigal**）继承人一年就败光了家产。这十个词帮你描述人们如何给予、守财和挥霍金钱。",
    ),
    watchOut: {
      meanings: t(
        "An **avaricious** person wants more and more wealth, while a **miserly** one hates to spend what he already has; the avaricious landlord raises rents, the miserly old man will not pay for heat.",
        "**avaricious** 的人贪图越来越多的财富，**miserly** 的人舍不得花已有的钱；avaricious 的房东年年涨租，miserly 的老人连暖气都不开。",
      ),
      use: t(
        "**Spendthrift** is a noun for a person, as in she married a spendthrift, while **profligate** and **prodigal** are mostly adjectives, as in a profligate government.",
        "**spendthrift** 是指人的名词，如 she married a spendthrift；**profligate** 和 **prodigal** 多作形容词，如 a profligate government。",
      ),
      spelling: t(
        "**Parsimonious** ends in -monious, **munificent** has -nif-, and **philanthropic** begins with phil-.",
        "**parsimonious** 结尾是 -monious；**munificent** 含 -nif-；**philanthropic** 以 phil- 开头。",
      ),
    },
    notes: `
      munificent|ten million dollars given freely for a library|a king giving land to every soldier|gift after huge gift keeping a theater open|munificent means extremely generous; parsimonious means unwilling to spend|munificent 是慷慨的；parsimonious 是吝啬的|parsimonious means unwilling to spend, the opposite of giving millions, land and gift after gift|parsimonious 是不肯花钱，和捐出数百万、赐予土地、一次次慷慨相助正好相反|avaricious means greedy for wealth, the opposite of giving it away so freely|avaricious 是贪财，和如此大方地送出钱财正好相反|mu · nif · i · cent|the -nif- in the middle|中间是 -nif-
      philanthropic|a foundation doing good with a rich man's fortune|giving money to schools and the poor|charitable giving after an earthquake|philanthropic means helping people by giving to good causes; avaricious means greedy for wealth|philanthropic 是慈善的；avaricious 是贪婪的|avaricious means greedy for more wealth, the opposite of building hospitals and giving money away|avaricious 是贪求财富，和建医院、捐钱正好相反|miserly means hating to spend money, the opposite of giving money to schools, the poor and the needy|miserly 是吝啬，和给学校、穷人和灾民捐钱正好相反|phil · an · throp · ic|the phil- start|开头是 phil-
      altruistic|diving into a freezing river with no thought for oneself|giving without wanting praise|animals risking their lives to warn the herd|altruistic means caring about others more than oneself; miserly means hating to spend|altruistic 是利他的；miserly 是吝啬的|miserly is about hating to spend money, not diving into a river, giving freely or risking one's life for others|miserly 是舍不得花钱，不是跳河救人、慷慨给予或舍命护群|avaricious means greedy for oneself, the opposite of putting others' welfare first|avaricious 是为自己贪财，和把他人福祉放在首位正好相反|al · tru · is · tic|the -tru- and the -istic ending|含 -tru-，结尾 -istic
      avaricious|a landlord never satisfied, raising rent every year|traders hoarding grain to grow richer|a man always hungry for more money|avaricious means greedy for wealth; munificent means extremely generous|avaricious 是贪婪的；munificent 是慷慨的|munificent means extremely generous, the opposite of raising rents, hoarding grain and hungering for more|munificent 是极其慷慨，和涨租、囤粮、贪得无厌正好相反|altruistic means putting others first, the opposite of a hunger for one's own wealth|altruistic 是先人后己，和贪求自己的财富正好相反|av · a · ri · cious|the -cious ending|结尾是 -cious
      miserly|a rich man too mean to pay for heating|a ten-cent tip from a man who hated parting with a penny|a company giving workers as little as possible|miserly means hating to spend money; prodigal means spending too freely|miserly 是吝啬的；prodigal 是挥霍的|prodigal means spending too freely, the opposite of refusing to pay for heat, a tip or a pay rise|prodigal 是大手大脚，和舍不得付暖气、小费或加薪正好相反|munificent means extremely generous, the opposite of a ten-cent tip and the smallest pay rises|munificent 是极其慷慨，和十美分小费、最少的加薪正好相反|mi · ser · ly|*miser* plus -ly|*miser* 加 -ly
      parsimonious|a council refusing to spend a penny more|kind words given as rarely as coins|a poem using never one word more than needed|parsimonious means unwilling to spend or use resources; profligate means wildly wasteful|parsimonious 是吝啬节俭的；profligate 是挥霍无度的|profligate means wildly wasteful, the opposite of cutting every budget and using words sparingly|profligate 是挥霍无度，和削减所有预算、惜字如金正好相反|munificent means extremely generous, the opposite of giving out praise or money as rarely as possible|munificent 是极其慷慨，和尽量少给赞美或钱正好相反|par · si · mo · ni · ous|the -monious ending|结尾是 -monious
      stingy|a few grains of sugar instead of a spoonful|a boss giving no bonuses in a record year|an airline squeezing in as many seats as it can|stingy means unwilling to give or spend; munificent means extremely generous|stingy 是小气的；munificent 是慷慨的|munificent means extremely generous, the opposite of a few grains, no bonuses and squeezed seats|munificent 是极其慷慨，和只给几粒糖、不发奖金、座位拥挤正好相反|prodigal means spending far too freely, the opposite of holding back sugar, bonuses or legroom|prodigal 是挥霍无度，和吝惜糖、奖金或腿部空间正好相反|stin · gy|the soft g sounding like j|g 读作 j
      prodigal|a son spending his inheritance on parties in a year|water wasted on lawns and fountains|an heir who wasted every coin of his fortune|prodigal means spending too freely; parsimonious means unwilling to spend|prodigal 是挥霍的；parsimonious 是吝啬的|parsimonious means unwilling to spend, the opposite of wasting an inheritance, water or a fortune|parsimonious 是不肯花钱，和挥霍遗产、浪费水或败光家财正好相反|stingy means unwilling to give or spend, the opposite of spending everything|stingy 是小气，和花光一切正好相反|prod · i · gal|the -gal ending|结尾是 -gal
      profligate|a government wasting money without shame|a life of yachts, casinos and endless parties|wild spending that emptied a fund in a month|profligate means wildly wasteful; stingy means unwilling to spend|profligate 是挥霍无度的；stingy 是小气的|stingy means unwilling to spend, the opposite of shameless waste, yachts and endless parties|stingy 是小气不肯花钱，和无耻浪费、游艇和无尽的派对正好相反|parsimonious means spending as little as possible, the opposite of emptying a fund in a month|parsimonious 是尽量少花钱，和一个月花光基金正好相反|prof · li · gate|the -gate ending|结尾是 -gate
      spendthrift|a man who spent his salary on clothes by the fifth|a husband spending every penny on fast cars|a man wasting borrowed money on parties|a spendthrift is a person who spends carelessly; a creditor is someone owed money|spendthrift 是挥霍者；creditor 是债权人|a creditor is the one who lends and is owed money, not the person who wastes salary, savings and loans|creditor 是借出钱、被欠钱的人，不是挥霍工资、积蓄和借款的人|a beneficiary is someone who receives money from a will or a policy, not someone who wastes all he has|beneficiary 是从遗嘱或保单中得到钱的人，不是挥霍一切的人|spend · thrift|*spend* and *thrift* joined as one word|*spend* 和 *thrift* 合写成一个词
    `,
  },
);

const temper = batch(
  "words-of-anger-and-calm",
  ["Words of Anger and Calm", "愤怒与平静的词"],
  ["losing one's temper and keeping it", "发脾气和保持冷静"],
  `
  irate|very angry|极其愤怒的|One furious, ___ passenger shouted at the pilot until security led him away.|The phone rang with ___ calls all day, each caller angrier than the last.|The ___ parents, furious about the cancelled trip, demanded a meeting.|unflappable,imperturbable|
  incensed|very angry because of something unfair|被激怒的|Villagers were ___ by the new tax, which they thought deeply unfair.|She was ___ at the insult, red with anger at being treated so unjustly.|The ___ crowd, furious at the unfair verdict, marched to the town hall.|imperturbable,unflappable|incense
  livid|extremely angry; dark bluish in color|大怒的；青紫色的|Dad was ___ when he saw the dented car, so angry he could hardly speak.|His arm was covered by an ugly ___ bruise, dark purple-blue.|She was ___ with herself for forgetting, furious at her own mistake.|unflappable,imperturbable|
  wrathful|full of great anger|愤怒的，暴怒的|The ___ gods, furious at the people's crimes, sent a flood.|He gave her a dark, ___ look, burning with fury.|His ___ letter, full of rage, arrived the next day.|unflappable,imperturbable|
  vexed|annoyed or worried; much discussed and difficult|恼火的；棘手的|She was ___ by the constant noise, which annoyed her all afternoon.|The ___ question of the border, argued about for fifty years, remains unsolved.|He sounded ___ on the phone, irritated and worried about the delay.|imperturbable,unflappable|vex,vexing,vexation
  unflappable|staying calm in a crisis|处变不惊的|The ___ pilot calmly landed the plane on one engine, as if nothing were wrong.|Our ___ teacher, calm as ever, ignored the fire alarm prank and went on with the lesson.|She stayed ___ under hours of hard questioning, never once losing her cool.|livid,irate|
  imperturbable|unable to be upset or excited|沉着的，泰然自若的|The butler remained ___ as the guests fought, calmly pouring the tea.|His ___ calm, which no insult could disturb, annoyed his rivals.|At cards, the ___ player, whose face nothing can disturb, gives nothing away.|irate,livid|
  equanimity|calmness, especially in a difficult situation|镇定，沉着|She accepted the bad news with ___, calmly and without a tear.|Meditation helped him keep his ___, staying calm through the hardest months.|They faced the storm with ___, quietly tying down the boats as the wind rose.|pandemonium,euphoria|
  placate|to make someone less angry by doing or giving something|安抚|The manager offered a free meal to ___ the angry customer and calm him down.|Nothing could ___ the angry fans, not even an apology from the owner.|He bought flowers to ___ his wife after forgetting her birthday.|berate,escalate|placated,placating
  mollify|to calm someone's anger or reduce their worry|平息，缓和|The apology did not ___ her; she stayed just as angry.|They tried to ___ the strikers with a small raise, hoping to calm their anger.|A gentle word may ___ a quarrel, softening the anger on both sides.|escalate,castigate|mollified
  `,
  "context-clues",
  {
    intro: t(
      "The **irate** customer was **incensed** by the bill, but the **unflappable** manager kept her **equanimity** and offered a free meal to **placate** him. These ten words help you describe anger, calm, and the ways people soothe each other.",
      "愤怒的（**irate**）顾客被账单激怒（**incensed**），但处变不惊的（**unflappable**）经理保持镇定（**equanimity**），送上一顿免费餐来安抚（**placate**）他。这十个词帮你描述愤怒、平静，以及人们如何互相安抚。",
    ),
    watchOut: {
      meanings: t(
        "**Incensed** means angry at something unfair, as villagers at a new tax, while **vexed** means only annoyed or worried, as by constant noise; incensed is much stronger.",
        "**incensed** 是因不公而愤怒，如村民对新税；**vexed** 只是恼火或担忧，如被噪音烦扰；incensed 程度强得多。",
      ),
      use: t(
        "You **placate** or **mollify** a person who is angry, but you keep or lose your **equanimity**; placate the customer, keep one's equanimity.",
        "**placate** 和 **mollify** 的对象是生气的人；**equanimity** 则是自己保持或失去的：placate the customer，keep one's equanimity。",
      ),
      spelling: t(
        "**Imperturbable** ends in -able, **unflappable** doubles the p, and **equanimity** has qu and -nim-.",
        "**imperturbable** 结尾是 -able；**unflappable** 双写 p；**equanimity** 含 qu 和 -nim-。",
      ),
    },
    notes: `
      irate|a passenger shouting until security led him away|calls each angrier than the last|parents furious about a cancelled trip|irate means very angry; unflappable means staying calm in a crisis|irate 是暴怒的；unflappable 是处变不惊的|unflappable means staying calm, the opposite of shouting, angry calls and furious parents|unflappable 是保持冷静，和大喊大叫、愤怒来电和气急的家长正好相反|imperturbable means unable to be upset, the opposite of very angry|imperturbable 是泰然自若，和暴怒正好相反|i · rate|the -rate ending|结尾是 -rate
      incensed|villagers angry at an unfair tax|a woman red with anger at an unjust insult|a crowd furious at an unfair verdict|incensed means very angry at something unfair; imperturbable means unable to be upset|incensed 是被激怒的；imperturbable 是沉着的|imperturbable means nothing can upset one, the opposite of anger at a tax, an insult or a verdict|imperturbable 是不为所动，和对税收、侮辱或判决的愤怒正好相反|unflappable means calm in a crisis, not red with anger and marching in fury|unflappable 是处变不惊，不是气得满脸通红、怒气冲冲地游行|in · censed|the c sounding like s and the -ed ending|c 读作 s，结尾 -ed
      livid|a father too angry to speak about a dented car|a dark purple-blue bruise|a woman furious at her own mistake|livid means extremely angry or bluish in color; unflappable means calm in a crisis|livid 是大怒的、青紫的；unflappable 是处变不惊的|unflappable means calm, the opposite of being too angry to speak or furious with oneself, and it is no color|unflappable 是冷静的，和气得说不出话或生自己的气正好相反，也不是颜色|imperturbable means calm and undisturbed, not furious and not the color of a bruise|imperturbable 是沉着的，不是暴怒，也不是淤青的颜色|liv · id|the -id ending|结尾是 -id
      wrathful|gods furious at crimes sending a flood|a look burning with fury|a letter full of rage|wrathful means full of great anger; unflappable means calm in a crisis|wrathful 是暴怒的；unflappable 是处变不惊的|unflappable means calm, the opposite of gods, looks and letters full of fury|unflappable 是冷静的，和满怀怒火的神、眼神和信件正好相反|imperturbable means undisturbed, the opposite of burning with rage|imperturbable 是泰然自若，和怒火中烧正好相反|wrath · ful|the wr- start and the -ful ending|开头 wr-，结尾 -ful
      vexed|a woman annoyed all afternoon by noise|a border question argued about for fifty years|a man irritated and worried about a delay|vexed means annoyed or worried, or hard and much discussed; imperturbable means unable to be upset|vexed 是恼火的、棘手的；imperturbable 是沉着的|imperturbable means nothing can upset one, the opposite of being annoyed, worried or a long-argued question|imperturbable 是不为所动，和恼火、担忧或争论多年的难题正好相反|unflappable means calm in a crisis, not annoyed by noise, worried by a delay or argued about for years|unflappable 是处变不惊，不是被噪音烦扰、为延误担心或争论多年|vexed|the x and the -ed ending|含 x，结尾 -ed
      unflappable|a pilot calmly landing on one engine|a teacher calm as ever through a prank|a woman never losing her cool under questioning|unflappable means staying calm in a crisis; livid means extremely angry|unflappable 是处变不惊的；livid 是大怒的|livid means extremely angry, the opposite of landing calmly, carrying on with a lesson or keeping cool|livid 是大怒，和沉着降落、继续上课、保持冷静正好相反|irate means very angry, the opposite of staying calm as ever|irate 是暴怒，和一如既往地冷静正好相反|un · flap · pa · ble|the double p and the -able ending|双写 p，结尾 -able
      imperturbable|a butler calmly pouring tea as guests fought|a calm no insult could disturb|a card player whose face nothing can disturb|imperturbable means unable to be upset; irate means very angry|imperturbable 是泰然自若的；irate 是暴怒的|irate means very angry, the opposite of calmly pouring tea or a calm no insult disturbs|irate 是暴怒，和从容倒茶、任何侮辱都扰不乱的平静正好相反|livid means extremely angry, the opposite of a face nothing can disturb|livid 是大怒，和不为所动的面孔正好相反|im · per · turb · a · ble|the -turb- and the -able ending|中间 -turb-，结尾 -able
      equanimity|bad news accepted calmly and without a tear|staying calm through the hardest months|tying down boats quietly as the wind rose|equanimity is calmness in difficulty; pandemonium is wild noise and confusion|equanimity 是镇定；pandemonium 是混乱喧嚣|pandemonium is wild noise and chaos, the opposite of calm acceptance and quiet work in a storm|pandemonium 是一片混乱喧嚣，和平静接受、在风暴中从容做事正好相反|euphoria is wild joy, not calm in the face of bad news or a storm|euphoria 是狂喜，不是面对坏消息或风暴时的镇定|eq · ua · nim · i · ty|the qu and the -nim-|含 qu 和 -nim-
      placate|a free meal offered to calm an angry customer|an apology that could not calm angry fans|flowers bought after forgetting a birthday|placate means to make someone less angry; berate means to scold angrily|placate 是安抚；berate 是责骂|berate means to scold someone angrily, the opposite of calming a customer, fans or a wife|berate 是怒斥，和安抚顾客、球迷或妻子正好相反|escalate means to make something worse, the opposite of calming someone down|escalate 是使事态加剧，和让人平静下来正好相反|pla · cate|the -cate ending|结尾是 -cate
      mollify|an apology that left a woman just as angry|a small raise meant to calm strikers|a gentle word softening a quarrel|mollify means to calm someone's anger; escalate means to make something worse|mollify 是平息；escalate 是使加剧|escalate means to make anger or a quarrel worse, the opposite of calming and softening it|escalate 是使怒气或争吵加剧，和平息缓和正好相反|castigate means to scold severely, the opposite of an apology, a raise or a gentle word|castigate 是严厉斥责，和道歉、加薪或温和的话语正好相反|mol · li · fy|the double l and the -ify ending|双写 l，结尾 -ify
    `,
  },
);

const candor = batch(
  "words-of-deceit-and-candor",
  ["Words of Deceit and Candor", "欺骗与坦率的词"],
  ["lying, cheating and honesty", "说谎、欺骗与诚实"],
  `
  mendacious|not telling the truth; lying|撒谎的，虚假的|The ___ report hid the losses, telling shareholders that the firm had made a profit.|The ___ witness lied to the jury about where he had been that night.|The ad made ___ claims about health, promising cures that the pills could never give.|ingenuous,guileless|mendacity
  disingenuous|pretending to know less or to be more honest than one really is|不真诚的，虚伪的|It is ___ to say you never saw the email, when you replied to it the same day.|Her surprise seemed ___, since she had known about the party for weeks.|The ___ apology, which pretended he had not known the rules, fooled nobody.|artless,guileless|disingenuously
  guileful|clever in a sly way that tricks people|狡诈的|The ___ fox, flattering the crow's singing, tricked it into dropping the cheese.|The ___ salesman, with clever, sly patter, tricked him into buying the broken car.|Her ___ smile, sly and sweet, hid her plan to cheat them.|guileless,ingenuous|guile
  wily|skilled at gaining an advantage by cunning|诡计多端的|The ___ old general fooled the enemy with fake campfires and empty tents.|The ___ lawyer, cunning as ever, found a loophole that set his client free.|The ___ cat waited until the cook turned away, then cleverly stole the fish.|ingenuous,artless|
  deceitful|trying to make people believe what is not true|欺骗的，欺诈的|The ___ servant, smiling to his master's face, stole from him for years.|It was ___ to hide the damage, letting the buyer believe the car had never crashed.|One ___ friend, who lies to you while pretending to care, is worse than an enemy.|guileless,artless|deceit
  ingenuous|innocent, trusting and open, sometimes too much so|天真的，坦率的|The ___ girl, trusting everyone she met, believed every story she was told.|His ___ question, asked in complete innocence, made the room laugh.|Her open, ___ face showed every feeling she had, hiding nothing.|disingenuous,wily|
  guileless|without any wish to trick or deceive|不狡诈的，天真无邪的|The ___ child told the truth at once, with no thought of hiding anything.|He had a ___ smile, open and honest, without a trace of trickery.|Her ___ letters, simple and sincere, charmed the judges.|guileful,deceitful|
  artless|natural and simple, not trying to deceive|天真自然的，朴实的|Her ___ charm, natural and unforced, won everyone over.|The child's ___ drawing, simple and honest, was more moving than any painting in the show.|His plain, ___ manner, with no tricks or pretense, put people at ease.|disingenuous,guileful|artlessly
  impostor|a person who pretends to be someone else to trick others|冒名顶替者|The ___ claiming to be a doctor had a fake name and no medical training at all.|The so-called prince, really a stable boy who had stolen the real prince's name, was the boldest ___ of the age.|In her new job she felt she was the office ___, only pretending to be the expert they had hired.|heretic,pilgrim|impostors
  fraud|the crime of deceiving people to get money; a person who does this|欺诈；骗子|He went to prison for ___, having sold fake shares to thousands of savers.|The psychic's ___, taking money for fake messages from the dead, cost widows their savings.|Banks use software to detect ___, such as stolen cards used to buy goods.|perjury,extortion|frauds,fraudulent
  `,
  "context-clues",
  {
    intro: t(
      "The **wily** salesman made **mendacious** claims, the **ingenuous** buyer believed every word, and in the end the whole scheme was exposed as **fraud**. These ten words help you describe lying, cheating and trickery, and the honest, trusting people they fool.",
      "诡计多端的（**wily**）推销员说着虚假的（**mendacious**）话，天真的（**ingenuous**）买主句句都信，最后整个骗局被揭穿为欺诈（**fraud**）。这十个词帮你描述说谎、欺骗和诡计，以及被它们蒙骗的诚实而轻信的人。",
    ),
    watchOut: {
      meanings: t(
        "**Ingenuous** means innocent and trusting, while **disingenuous** means pretending to be innocent or honest; the ingenuous girl believes every story, the disingenuous man pretends he never saw the email.",
        "**ingenuous** 是天真轻信，**disingenuous** 是假装天真或诚实；ingenuous 的女孩什么都信，disingenuous 的人假装没看过邮件。",
      ),
      use: t(
        "**Guileful** and **guileless** are opposites built on *guile*, cunning: -ful means full of it, -less means without it.",
        "**guileful** 和 **guileless** 都源自 *guile*（狡诈），意思相反：-ful 表示充满，-less 表示没有。",
      ),
      spelling: t(
        "**Impostor** ends in -or, not -er, **mendacious** ends in -cious, and **deceitful** has ei after c.",
        "**impostor** 结尾是 -or 而不是 -er；**mendacious** 结尾是 -cious；**deceitful** 在 c 后是 ei。",
      ),
    },
    notes: `
      mendacious|a report telling shareholders of a profit that hid losses|a witness lying to a jury|an ad promising cures the pills could never give|mendacious means lying; ingenuous means innocent and open|mendacious 是撒谎的；ingenuous 是天真坦率的|ingenuous means innocent and open, the opposite of a report, a witness or an ad that lies|ingenuous 是天真坦率，和撒谎的报告、证人或广告正好相反|guileless means without any wish to deceive, the opposite of hiding losses and lying to a jury|guileless 是毫无欺骗之心，和隐瞒亏损、对陪审团撒谎正好相反|men · da · cious|the -cious ending|结尾是 -cious
      disingenuous|claiming never to have seen an email one replied to|surprise at a party known about for weeks|an apology pretending ignorance of the rules|disingenuous means pretending to be more honest or less knowing; artless means natural and not deceiving|disingenuous 是不真诚的；artless 是天真自然的|artless means natural and without pretense, the opposite of pretending not to know about an email, a party or the rules|artless 是自然不做作，和假装不知道邮件、聚会或规则正好相反|guileless means without any wish to trick, the opposite of a pretended surprise or a false apology|guileless 是毫无欺骗之心，和装出的惊讶或虚伪的道歉正好相反|dis · in · gen · u · ous|dis- plus *ingenuous*|dis- 加 *ingenuous*
      guileful|a fox flattering a crow out of its cheese|a salesman tricking a buyer with sly patter|a sly, sweet smile hiding a plan to cheat|guileful means slyly tricking people; guileless means without any wish to trick|guileful 是狡诈的；guileless 是天真无邪的|guileless means without any trickery, the opposite of a sly fox, salesman or smile|guileless 是毫无诡计，和狡猾的狐狸、推销员或笑容正好相反|ingenuous means innocent and trusting, the opposite of tricking and cheating others|ingenuous 是天真轻信，和欺骗他人正好相反|guile · ful|*guile* plus -ful|*guile* 加 -ful
      wily|a general fooling the enemy with fake campfires|a cunning lawyer finding a loophole|a cat waiting for the cook to turn away|wily means skilled at cunning; ingenuous means innocent and trusting|wily 是诡计多端的；ingenuous 是天真的|ingenuous means innocent and trusting, the opposite of fooling an enemy, finding loopholes and stealing cleverly|ingenuous 是天真轻信，和骗敌、钻空子、巧偷正好相反|artless means natural and simple, the opposite of cunning tricks|artless 是朴实自然，和狡猾的诡计正好相反|wi · ly|the -ly ending after *wile*, dropping the e|*wile* 去 e 加 -ly
      deceitful|a smiling servant stealing for years|hiding a crash so a buyer believes otherwise|a friend who lies while pretending to care|deceitful means trying to make people believe what is untrue; guileless means without any wish to deceive|deceitful 是欺骗的；guileless 是天真无邪的|guileless means without any wish to deceive, the opposite of stealing, hiding damage and lying|guileless 是毫无欺骗之心，和偷窃、隐瞒损伤、撒谎正好相反|artless means natural and simple, the opposite of smiling to someone's face while stealing or lying|artless 是天真自然，和当面笑、背后偷或撒谎正好相反|de · ceit · ful|the ei after c|c 后是 ei
      ingenuous|a girl trusting everyone and believing every story|a question asked in complete innocence|an open face hiding nothing|ingenuous means innocent and trusting; disingenuous means pretending to be innocent|ingenuous 是天真的；disingenuous 是假装天真的|disingenuous means pretending innocence, but this girl, question and face are truly innocent and open|disingenuous 是假装天真，而这里的女孩、问题和面孔是真正天真坦率的|wily means cunning, the opposite of trusting, innocent and hiding nothing|wily 是狡猾的，和轻信、天真、毫无隐藏正好相反|in · gen · u · ous|the -uous ending|结尾是 -uous
      guileless|a child telling the truth with no thought of hiding|an open, honest smile without trickery|simple, sincere letters|guileless means without any wish to deceive; guileful means slyly tricking people|guileless 是天真无邪的；guileful 是狡诈的|guileful means slyly tricking people, the opposite of telling the truth and an honest smile|guileful 是狡诈骗人，和说真话、真诚的微笑正好相反|deceitful means trying to make people believe untruths, the opposite of simple, sincere honesty|deceitful 是欺骗的，和单纯真诚正好相反|guile · less|*guile* plus -less|*guile* 加 -less
      artless|natural, unforced charm|a child's simple, honest drawing|a plain manner with no tricks or pretense|artless means natural and simple, not deceiving; disingenuous means pretending|artless 是天真自然的；disingenuous 是虚伪的|disingenuous means pretending, the opposite of natural charm, an honest drawing and a manner without pretense|disingenuous 是假装的，和自然的魅力、真诚的画作、不做作的举止正好相反|guileful means slyly tricking people, the opposite of a manner with no tricks|guileful 是狡诈骗人，和毫无花招的举止正好相反|art · less|*art* plus -less|*art* 加 -less
      impostor|a fake doctor with no medical training|a stable boy using a prince's name|feeling like someone only pretending to be an expert|an impostor pretends to be someone else; a heretic holds beliefs against a church|impostor 是冒名顶替者；heretic 是异端者|a heretic openly holds beliefs against a church, not someone pretending to be a doctor, a prince or an expert|heretic 公开持有违背教会的信仰，不是假扮医生、王子或专家的人|a pilgrim travels to a holy place, not someone pretending to be another person|pilgrim 是去圣地朝拜的人，不是冒充他人的人|im · pos · tor|the -or ending, not -er|结尾 -or，不是 -er
      fraud|fake shares sold to thousands of savers|fake messages from the dead sold to widows|stolen cards used to buy goods|fraud is deceiving people to get money; perjury is lying under oath|fraud 是欺诈；perjury 是伪证|perjury is lying in court under oath, not selling fake shares, fake messages or using stolen cards|perjury 是在法庭宣誓后撒谎，不是出售假股票、假口信或盗刷信用卡|extortion is getting money by threats, but these people were tricked, not threatened|extortion 是以威胁勒索钱财，而这些人是被骗，不是被威胁|fraud|the au in the middle|中间是 au
    `,
  },
);

const worship = batch(
  "words-of-worship-and-belief",
  ["Words of Worship and Belief", "崇拜与信仰的词"],
  ["religion and the sacred", "宗教与神圣之物"],
  `
  sacred|holy, or connected with a god; deeply respected|神圣的|The river is ___ to the people of the valley, who believe a goddess lives in its waters.|A promise was ___ to her, something so deeply respected that she would never break it.|Holy, ___ music, hymns to the gods, was played in the temple.|profane,secular|
  profane|not holy; showing disrespect for holy things|世俗的；亵渎的|Rude, ___ language that mocks holy things is not allowed in the temple hall.|The novel mixes the holy and the ___, prayers on one page and drunken jokes about the gods on the next.|The priests saw the dance as ___, an insult to the holy shrine where it was performed.|sacred,pious|profanity
  secular|not connected with religion|世俗的，非宗教的|France is a ___ state, where the government has no ties to any church.|The school teaches ___ subjects such as maths and history, with no religious lessons at all.|Love songs and other ___ music, with no religious words, grew popular at the court.|sacred,pious|secularism
  pious|deeply religious|虔诚的|The ___ woman prayed every morning and never missed a service.|He made ___ speeches full of prayers and talk of God, but cheated his workers.|Devout, ___ pilgrims walked barefoot to the temple, praying all the way.|secular,profane|piety,piously
  pilgrim|a person who travels to a holy place|朝圣者|Each ___ on the long road to the holy city carried a staff and a small bag.|The ___ walked for three months to reach the tomb of the saint.|Every ___ who makes the journey to the holy mountain visits the shrine at least once.|heretic,zealot|pilgrims
  shrine|a holy place connected with a saint or god; a place honoring someone|圣地，神龛|Flowers and candles covered the little ___ by the road, built where the girl had died.|The poet's house became a ___ to him, a place where his admirers come to honor his memory.|The holy ___ of the saint is visited by millions of believers every year.|sect,doctrine|shrines
  heretic|a person whose beliefs go against those of a church or group|异教徒，持异端者|The church burned the ___ at the stake for denying its teachings.|In art, she was a ___ who broke every rule the academy taught.|He was called a ___ for doubting the theory that every other scientist accepted.|pilgrim,sect|heretics,heretical
  doctrine|a belief or set of beliefs taught by a church, party or school|教义，学说|The ___ of the church, the teaching every priest had to accept, forbade divorce.|The president announced a new ___, a set of beliefs that would guide the country's foreign policy.|For centuries the bishops argued over ___, the exact teachings the church should hold.|sect,shrine|doctrines
  sect|a small group with beliefs that differ from those of a larger group|教派，派别|The ___, a small group with its own strange beliefs, lived apart in the hills.|A new ___ broke away from the church, a few hundred believers who rejected its teachings.|Members of the small ___, who believed the world would end soon, dressed in white.|doctrine,clergy|sects
  clergy|the people trained for religious duties, such as priests|神职人员|The ___, priests and ministers from every church in the city, led the march for peace.|Members of the ___, trained for religious duties, do not pay the tax.|Priests, bishops and other ___ wore black robes.|sect,pilgrim|clerical
  `,
  "context-clues",
  {
    intro: t(
      "The **pious** **pilgrim** walked for months to the **sacred** **shrine**, while the **heretic** was punished for doubting the church's **doctrine**. These ten words help you talk about religion, its holy places and people, and the line between the holy and the everyday.",
      "虔诚的（**pious**）朝圣者（**pilgrim**）走了几个月去往神圣的（**sacred**）圣地（**shrine**），而异端者（**heretic**）因怀疑教会的教义（**doctrine**）而受罚。这十个词帮你谈论宗教、圣地与信徒，以及神圣与世俗的界线。",
    ),
    watchOut: {
      meanings: t(
        "**Secular** simply means not religious, as in a secular state, while **profane** means disrespectful of holy things, as in profane jokes about the gods.",
        "**secular** 只是非宗教的，如 a secular state；**profane** 是亵渎神圣的，如 profane jokes about the gods。",
      ),
      use: t(
        "**Clergy** is a plural group word, as in the clergy led the march, while a **sect** is one small group that breaks away from a larger church.",
        "**clergy** 是集合名词，如 the clergy led the march；**sect** 是从大教会分裂出的一个小团体。",
      ),
      spelling: t(
        "**Pious** has -ious, **heretic** has one r and ends in -ic, and **doctrine** ends in -ine.",
        "**pious** 含 -ious；**heretic** 只有一个 r，结尾是 -ic；**doctrine** 结尾是 -ine。",
      ),
    },
    notes: `
      sacred|a river where a goddess is believed to live|a promise so respected it was never broken|hymns to the gods played in a temple|sacred means holy or deeply respected; profane means disrespectful of holy things|sacred 是神圣的；profane 是亵渎的|profane means mocking holy things, the opposite of a river, a promise or hymns held holy|profane 是亵渎神圣，和被奉为神圣的河流、承诺或圣歌正好相反|secular means not religious, the opposite of a goddess's river and hymns to the gods|secular 是非宗教的，和女神栖居的河流、献给神的圣歌正好相反|sa · cred|the -cred ending|结尾是 -cred
      profane|language mocking holy things in a temple hall|drunken jokes about the gods in a novel|a dance seen as an insult to a holy shrine|profane means disrespectful of holy things; sacred means holy|profane 是亵渎的；sacred 是神圣的|sacred means holy, the opposite of language, jokes or a dance that mocks and insults holy things|sacred 是神圣的，和嘲弄、冒犯神圣的言语、笑话或舞蹈正好相反|pious means deeply religious, the opposite of mocking the gods|pious 是虔诚的，和嘲弄神明正好相反|pro · fane|the -fane ending|结尾是 -fane
      secular|a state with no ties to any church|schools teaching maths and history with no religious lessons|love songs with no religious words|secular means not connected with religion; sacred means holy|secular 是世俗的；sacred 是神圣的|sacred means holy and religious, the opposite of a state, lessons or songs with no religion in them|sacred 是神圣宗教的，和不含宗教的国家、课程或歌曲正好相反|pious means deeply religious, the opposite of things with no religious ties|pious 是虔诚的，和与宗教无关的事物正好相反|sec · u · lar|the -ular ending|结尾是 -ular
      pious|a woman praying every morning|speeches full of prayers and talk of God|pilgrims praying all the way to a temple|pious means deeply religious; secular means not religious|pious 是虔诚的；secular 是非宗教的|secular means having nothing to do with religion, the opposite of praying, services and talk of God|secular 是与宗教无关，和祈祷、礼拜、谈论上帝正好相反|profane means mocking holy things, the opposite of prayer and devotion|profane 是亵渎神圣，和祈祷与虔诚正好相反|pi · ous|the -ious ending|结尾是 -ious
      pilgrim|a traveler with a staff on the road to a holy city|a three-month walk to a saint's tomb|a journey to a holy mountain|a pilgrim travels to a holy place; a heretic holds beliefs against a church|pilgrim 是朝圣者；heretic 是异端者|a heretic is punished for beliefs against a church, not a traveler walking to a holy city, tomb or mountain|heretic 因违背教会的信仰而受罚，不是步行去圣城、圣墓或圣山的人|a zealot is a fanatic for a cause, which says nothing about a long journey to a holy place|zealot 是狂热分子，并不说明是否长途跋涉去往圣地|pil · grim|the -grim ending|结尾是 -grim
      shrine|flowers and candles where a girl had died|a poet's house where admirers honor him|a saint's holy place visited by millions|a shrine is a holy place or a place honoring someone; a sect is a small group of believers|shrine 是圣地、神龛；sect 是教派|a sect is a group of people, not a place where flowers are laid or millions come to visit|sect 是一群人，不是摆放鲜花或数百万人前来朝拜的地方|a doctrine is a set of beliefs, not a place that people visit|doctrine 是一套信仰，不是人们前往的地方|shrine|the shr- start|开头是 shr-
      heretic|a man burned for denying a church's teachings|an artist breaking every rule of the academy|a scientist doubting a theory everyone accepted|a heretic holds beliefs against those of a group; a pilgrim travels to a holy place|heretic 是异端者；pilgrim 是朝圣者|a pilgrim faithfully travels to a holy place, not someone who denies teachings, breaks rules or doubts what all accept|pilgrim 是虔诚地去往圣地的人，不是否认教义、打破规则或怀疑公认理论的人|a sect is a whole group, not one person punished or blamed for going against accepted beliefs|sect 是一个团体，不是因违背公认信仰而受罚或受责的个人|her · e · tic|one r and the -ic ending|只有一个 r，结尾 -ic
      doctrine|a teaching every priest had to accept|beliefs guiding a country's foreign policy|the exact teachings bishops argued over|a doctrine is a set of beliefs taught by a group; a sect is a small breakaway group|doctrine 是教义、学说；sect 是教派|a sect is a group of people, not the teaching a church, a president or bishops hold|sect 是一群人，不是教会、总统或主教所持的学说|a shrine is a holy place, not a belief that is taught or argued over|shrine 是圣地，不是被传授或争论的信条|doc · trine|the -trine ending|结尾是 -trine
      sect|a small group with strange beliefs living in the hills|a few hundred believers breaking away from a church|a small group sure the world would end soon|a sect is a small group with different beliefs; a doctrine is a set of beliefs|sect 是教派；doctrine 是教义|a doctrine is a set of beliefs, not a group of people who live, break away or dress in white|doctrine 是一套信仰，不是一群居住、分裂或穿白衣的人|the clergy are the trained priests of a church, not a small group that breaks away from it|clergy 是教会受训的神职人员，不是从中分裂出去的小团体|sect|the -ect ending|结尾是 -ect
      clergy|priests and ministers leading a march|people trained for religious duties|priests, bishops and others in black robes|the clergy are people trained for religious duties; a sect is a small breakaway group|clergy 是神职人员；sect 是教派|a sect is a small group of believers with different views, not the trained priests and ministers of the churches|sect 是观点不同的小信徒团体，不是各教会受过训练的牧师和神父|a pilgrim is one traveler to a holy place, not the priests trained for religious duties|pilgrim 是去圣地的旅人，不是受训履行宗教职务的神职人员|cler · gy|the -gy ending|结尾是 -gy
    `,
  },
);

/** batchesD are the batches of rhetoric and logic, temperament and character, and belief. */
export const batchesD: readonly BatchSpec[] = [rhetoric, logic, temperament, sociability, pride, giving, temper, candor, worship];
