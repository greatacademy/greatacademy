// Grade 10: the batches of words of fear and wonder, of shame and blame, of pity and mercy, of anger and
// bluntness, of raids and rumors, of slips and scrambles, of spectacle and splendor and of daring and promises.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const fear = batch(
  "words-of-fear-and-wonder",
  ["Words of Fear and Wonder", "恐惧与惊奇的词"],
  ["being scared, shocked, amazed and overcome", "害怕、震惊、惊叹与不知所措"],
  `
  frighten|to make someone afraid|使害怕|Don't ___ the baby by shouting so close to her.|The barking dog can ___ small children, who run away crying.|Ghost stories ___ my little brother so much that he sleeps with the light on.|marvel,gasp|frightening
  horrify|to fill with horror; to shock greatly|使恐惧，使震惊|Pictures of the starving children will ___ anyone who sees them.|The cruel way the animals were kept would ___ any visitor to the farm.|News of the attack on the school is sure to ___ the whole country.|marvel,gasp|horrified,horrifying
  terror|extreme fear|恐惧|The villagers ran in ___ as the volcano began to pour out fire and smoke.|She screamed in ___ when she found the snake curled up in her bed.|The small boy froze with ___ as the huge dog ran at him, barking.|rage,misery|terrify,terrified,terrible
  astonish|to surprise greatly|使惊讶|The magician's tricks never fail to ___ the audience.|Her quick progress will ___ her teachers, who expected her to fail the course.|It may ___ you to learn that some snails can sleep for three years.|marvel,shiver|astonished,astonishment
  marvel|to be filled with wonder; a wonderful thing|惊叹；奇迹|Visitors ___ at the size of the ancient pyramids, built without any machines.|We could only ___ at how quickly the spider spun its perfect web.|Scientists still ___ at the way birds find their way home across thousands of miles.|astonish,paralyze|marveled,marvelous
  gasp|to breathe in suddenly in shock; such a breath|倒吸气|People in the crowd began to ___ as the tightrope walker slipped.|Coming up from the deep water, the diver had to ___ for air.|When she saw the price of the dress, she couldn't help but ___ in shock.|paralyze,overwhelm|gasped
  shiver|to shake slightly from cold or fear|颤抖|Without our coats, we began to ___ in the icy wind.|The thought of walking through the graveyard alone at night made her ___.|Wet and cold, the puppy started to ___ on the doorstep.|paralyze,overwhelm|shivered,shivery
  faint|to lose consciousness briefly; not clear or strong|昏倒；微弱的|If you stand in the hot sun too long, you may ___ and fall to the ground.|At the sight of blood he would always ___, and someone had to catch him before he hit the floor.|She felt dizzy and thought she might ___, so she lay down with her feet up.|shiver,paralyze|fainted,faintly
  paralyze|to make unable to move|使瘫痪|A fall from a horse can ___ a rider for life if the back is broken.|Fear can ___ you, so that you cannot move a single muscle.|The strike threatened to ___ the whole city, with no buses or trains running.|faint,marvel|paralyzed,paralysis
  overwhelm|to have a strong emotional effect on; to defeat completely|使不知所措；压倒|The kindness of strangers after the fire seemed to ___ her, and she burst into tears.|Don't let your homework ___ you; do one small piece at a time.|The larger army was able to ___ the town's few defenders in less than an hour.|faint,marvel|overwhelmed,overwhelming
  `,
  "context-clues",
  {
    intro: t(
      "As the cave roof cracked, **terror** seemed to **paralyze** the explorers; then, safe outside, they could only **gasp** and **marvel** at the glowing crystals they had seen. These ten words help you talk about being scared, shocked, amazed and overcome by feeling.",
      "洞顶裂开时，恐惧（**terror**）仿佛让探险者们动弹不得（**paralyze**）；等到安全出了洞，他们只能倒吸一口气（**gasp**），惊叹（**marvel**）刚才见到的那些闪光的水晶。这十个词帮你谈论害怕、震惊、惊叹以及被情绪压倒。",
    ),
    watchOut: {
      meanings: t(
        "To **horrify** is to shock someone with something dreadful, while to **astonish** is to surprise them greatly, often in a good way.",
        "**horrify** 是用可怕的事让人震惊；**astonish** 是让人大吃一惊，常常是好的意外。",
      ),
      use: t(
        "You **marvel at** something, always with at, but you **astonish** or **frighten** someone, with no at.",
        "**marvel** 后面要接 **at**；**astonish** 和 **frighten** 后面直接接人，不加 at。",
      ),
      spelling: t(
        "**Paralyze** ends in -yze in American spelling, and **overwhelm** has wh after over.",
        "美式拼写的 **paralyze** 以 -yze 结尾；**overwhelm** 在 over 后是 wh。",
      ),
    },
    notes: `
      frighten|a baby shouted at from close by|small children running away crying from a dog|ghost stories that make a boy sleep with the light on|frighten means to make someone afraid; horrify means to shock them with something dreadful|frighten 是使人害怕；horrify 是用可怕的事使人震惊|marvel means to feel wonder at something, and it cannot take a baby, children or a brother after it|marvel 是对某事惊叹，后面不能直接接婴儿、孩子或弟弟|gasp means to breathe in suddenly, and it cannot take a person after it|gasp 是猛吸一口气，后面不能直接接人|fright · en|fright plus -en, with a silent gh|fright 加 -en，gh 不发音
      horrify|pictures of starving children|a cruel way of keeping farm animals|news of an attack on a school|horrify means to shock someone deeply with something dreadful; frighten means to make someone afraid|horrify 是用可怕的事使人深感震惊；frighten 是使人害怕|marvel means to feel wonder, not to shock people with starving children or cruelty|marvel 是惊叹，不是用饥饿的孩子或残忍之事使人震惊|gasp means to breathe in suddenly, and it cannot take anyone or a country after it|gasp 是猛吸一口气，后面不能接人或国家|hor · ri · fy|the double r and the -ify ending|双写 r，结尾是 -ify
      terror|villagers running from a volcano|a woman screaming at a snake in her bed|a boy frozen as a huge dog runs at him|terror is extreme fear; rage is violent anger|terror 是极度恐惧；rage 是暴怒|rage is violent anger, not the fear that makes people run, scream or freeze|rage 是暴怒，不是让人逃跑、尖叫或僵住的恐惧|misery is long, deep unhappiness, not sudden fear of a volcano, a snake or a dog|misery 是长久深切的痛苦，不是对火山、蛇或狗的突然恐惧|ter · ror|the double r in the middle and the -or ending|中间双写 r，结尾是 -or
      astonish|a magician's tricks amazing an audience|a pupil's quick progress surprising her teachers|the fact that snails can sleep for three years|astonish means to surprise someone greatly; marvel means to feel wonder yourself|astonish 是使别人大吃一惊；marvel 是自己感到惊叹|marvel means to feel wonder at something, and it needs at, so it cannot take an audience, teachers or you after it|marvel 是惊叹，要接 at，不能直接接观众、老师或你|shiver means to shake from cold or fear, and it takes no person after it|shiver 是因冷或怕而发抖，后面不接人|as · ton · ish|the -ish ending|结尾是 -ish
      marvel|visitors wondering at the size of the pyramids|a spider spinning a perfect web quickly|birds finding their way home across thousands of miles|marvel at means to be filled with wonder at something; astonish means to surprise someone else|marvel at 是对某事惊叹；astonish 是使别人吃惊|astonish takes a person straight after it and is never followed by at|astonish 后面直接接人，从不接 at|paralyze means to make someone unable to move, and it is never followed by at|paralyze 是使人无法动弹，后面从不接 at|mar · vel|the -el ending|结尾是 -el
      gasp|a crowd breathing in sharply as a tightrope walker slips|a diver coming up from deep water for air|a woman shocked by the price of a dress|gasp means to breathe in suddenly from shock or for air; shiver means to shake|gasp 是因震惊或缺氧猛吸一口气；shiver 是发抖|paralyze means to make someone unable to move, and it needs someone after it, not for air or in shock|paralyze 是使人无法动弹，后面要接人，不接 for air 或 in shock|overwhelm means to have a strong effect on someone, and it needs someone after it|overwhelm 是给人强烈冲击，后面要接人|gasp|the sp at the end|结尾是 sp
      shiver|people without coats in an icy wind|a girl thinking of a graveyard at night|a wet, cold puppy on a doorstep|shiver means to shake a little from cold or fear; faint means to pass out|shiver 是因冷或怕微微发抖；faint 是昏倒|paralyze means to make someone unable to move, and it needs someone after it|paralyze 是使人无法动弹，后面要接人|overwhelm means to have a strong effect on someone, and it needs someone after it|overwhelm 是给人强烈冲击，后面要接人|shiv · er|the -er ending|结尾是 -er
      faint|someone falling to the ground after too long in hot sun|a man who passes out at the sight of blood|a dizzy woman lying down with her feet up|faint means to lose consciousness for a short time; shiver means to shake|faint 是短暂昏迷；shiver 是发抖|shiver means to shake from cold or fear, not to pass out and fall to the ground|shiver 是因冷或怕发抖，不是昏倒在地|paralyze means to make someone else unable to move, and it needs someone after it|paralyze 是使别人无法动弹，后面要接人|faint|the ai, as in *paint*|ai 读音同 *paint*
      paralyze|a rider unable to move after breaking his back|fear that stops every muscle|a strike that stops all buses and trains in a city|paralyze means to make someone or something unable to move or work; overwhelm means to have too strong an effect|paralyze 是使人或物无法动弹或运转；overwhelm 是冲击太强|faint means to pass out yourself, and it takes no rider, person or city after it|faint 是自己昏倒，后面不接骑手、人或城市|marvel means to feel wonder at something, and it does not stop anyone moving|marvel 是惊叹，不会让人无法动弹|par · a · lyze|the -yze ending in American spelling|美式拼写结尾是 -yze
      overwhelm|a woman bursting into tears at strangers' kindness|homework that feels too much at once|a large army beating a few defenders in an hour|overwhelm means to have too strong an effect on someone or to defeat them completely; paralyze means to stop them moving|overwhelm 是使人不知所措或彻底击败；paralyze 是使人无法动弹|faint means to pass out yourself, and it takes no person after it|faint 是自己昏倒，后面不接人|marvel means to feel wonder at something, and it needs at, not a person straight after it|marvel 是惊叹，要接 at，不能直接接人|o · ver · whelm|wh after over, and the -elm ending|over 后是 wh，结尾是 -elm
    `,
  },
);

const shame = batch(
  "words-of-shame-and-blame",
  ["Words of Shame and Blame", "羞愧与责备的词"],
  ["feeling bad, saying sorry, praise, insults and telling off", "愧疚、道歉、恭维、侮辱与训斥"],
  `
  embarrass|to make someone feel awkward or ashamed|使尴尬|Please don't ___ me by showing my baby photos to my friends.|His father would ___ him by dancing badly at every school party.|It would ___ the minister if anyone found out that she had failed her driving test five times.|blush,flatter|embarrassing,embarrassment
  blush|to become red in the face from shyness or shame|脸红|She began to ___ when he said he liked her, and her cheeks turned bright pink.|Shy children often ___ when the teacher praises them in front of the class.|He would ___ as red as a tomato whenever anyone mentioned his girlfriend.|embarrass,confess|blushed
  guilt|the feeling of having done wrong; the fact of having done wrong|内疚；有罪|She felt great ___ for breaking her sister's phone and not owning up.|The jury found no proof of his ___, so he was set free.|Eaten up by ___ over his lie, he finally told his parents the truth.|pity,mercy|
  confess|to admit a wrongdoing|坦白|The boy had to ___ that he had eaten all the cookies himself.|I must ___ that I have never read the book, though I said I had.|After hours of questioning, the man began to ___ to the robbery.|apologize,flatter|confessed,confession
  apologize|to say sorry|道歉|You must ___ to your sister for breaking her toy and tell her you are sorry.|Let me ___ for being late; the bus broke down on the way.|The company had to ___ to its customers for the long delays to their parcels.|flatter,tease|apologized,apology
  modest|not boastful; not large|谦虚的；适度的|Despite winning three gold medals, she stayed ___ and said she had just been lucky.|Their ___ little house has just two small bedrooms and a tiny garden.|He was too ___ to talk about his own bravery in the fire.|extravagant,obnoxious|modestly,modesty
  flatter|to praise too much in order to please|奉承|He tried to ___ the teacher, telling her she was the cleverest person he had ever met, so that she would give him a better grade.|Stop trying to ___ me with all that praise; I know my singing is not that good.|Salesmen often ___ their customers, praising their good taste to make them buy.|tease,scold|flattered,flattery
  tease|to make fun of playfully or unkindly|取笑|The older boys would ___ him about his big ears until he cried.|My brother loves to ___ me by hiding my shoes and laughing as I search for them.|Grandpa likes to ___ us playfully, pretending that he has forgotten our birthdays.|flatter,confess|teased,teasing
  insult|to speak to or treat with disrespect; such a remark|侮辱|He did not mean to ___ the cook, but he said her soup tasted like dishwater.|How dare you ___ my mother by calling her a liar!|The fans began to ___ the referee with rude chants after every decision.|flatter,apologize|insulted,insulting
  scold|to angrily tell someone off|责骂|Mum will ___ you if you come home late again, so be back by nine.|The teacher had to ___ the boys for running in the corridor.|The old woman began to ___ the children angrily for kicking their ball into her roses.|tease,flatter|scolded
  `,
  "context-clues",
  {
    intro: t(
      "Filled with **guilt**, Tom decided to **confess** that he had broken the window; he began to **blush** as the head teacher started to **scold** him, and he promised to **apologize** to the neighbours. These ten words help you talk about feeling bad, saying sorry, praise, insults and being told off.",
      "汤姆满心愧疚（**guilt**），决定坦白（**confess**）是自己打破了窗户；校长开始训斥（**scold**）他时，他的脸红了（**blush**），并答应向邻居道歉（**apologize**）。这十个词帮你谈论愧疚、道歉、恭维、侮辱和挨骂。",
    ),
    watchOut: {
      meanings: t(
        "**Guilt** is the feeling of having done wrong, while to **confess** is to admit it out loud, and to **apologize** is to say sorry for it.",
        "**guilt** 是做错事后的内疚感；**confess** 是把错事说出来；**apologize** 是为此道歉。",
      ),
      use: t(
        "You **apologize to** someone **for** something, and you **confess to** a crime or **confess that** you did it.",
        "**apologize** 用 to 接人、for 接事；**confess** 用 to 接罪行，或用 that 接所做的事。",
      ),
      spelling: t(
        "**Embarrass** has a double r and a double s, and **apologize** ends in -ize in American spelling.",
        "**embarrass** 双写 r，也双写 s；美式拼写的 **apologize** 以 -ize 结尾。",
      ),
    },
    notes: `
      embarrass|baby photos shown to a teenager's friends|a father dancing badly at school parties|a minister's five failed driving tests coming out|embarrass means to make someone feel awkward or ashamed; blush means to go red in the face yourself|embarrass 是使别人尴尬；blush 是自己脸红|blush means to go red in the face yourself, and it takes no person after it|blush 是自己脸红，后面不接人|flatter means to praise someone too much, not to make them feel awkward with photos, dancing or failed tests|flatter 是过分夸奖，不是用照片、跳舞或考试失败让人难堪|em · bar · rass|the double r and the double s|双写 r，也双写 s
      blush|a girl's cheeks turning pink when a boy says he likes her|shy children praised in front of the class|a man going red as a tomato when his girlfriend is mentioned|blush means to go red in the face from shyness or shame; embarrass means to make someone else feel awkward|blush 是因害羞或羞愧脸红；embarrass 是使别人尴尬|embarrass needs a person after it, and it is not your own face going red|embarrass 后面要接人，不是自己脸红|confess means to admit doing wrong, not to go pink when praised or liked|confess 是承认错事，不是被夸或被喜欢时脸红|blush|the sh at the end|结尾是 sh
      guilt|a girl who broke her sister's phone and did not own up|a jury finding no proof that a man did the crime|a boy eaten up by his lie until he tells the truth|guilt is the feeling or the fact of having done wrong; pity is feeling sorry for someone else|guilt 是做错事的内疚或有罪的事实；pity 是同情别人|pity means feeling sorry for someone else's suffering, not the feeling of having done wrong yourself|pity 是同情别人的苦难，不是自己做错事的内疚|mercy means kindness to someone you could punish, not the proof or feeling of having done wrong|mercy 是对可惩罚之人的宽恕，不是有罪的证据或内疚|guilt|the silent u after g|g 后的 u 不发音
      confess|a boy admitting he ate all the cookies|someone admitting they never read a book they said they had|a man admitting to a robbery after questioning|confess means to admit that you did something wrong; apologize means to say sorry for it|confess 是承认做错事；apologize 是为此道歉|apologize means to say sorry, and it is not followed by that or by to a robbery|apologize 是道歉，后面不接 that 从句，也不接 to a robbery|flatter means to praise someone too much, not to admit a wrong|flatter 是过分夸奖，不是承认错事|con · fess|the double s at the end|结尾双写 s
      apologize|a boy saying sorry to his sister for breaking her toy|someone saying sorry for being late because of the bus|a company saying sorry to customers for late parcels|apologize means to say sorry, with to for the person and for the wrong; confess means to admit what you did|apologize 是道歉，to 接人，for 接事；confess 是承认所做的事|flatter means to praise someone too much, not to say sorry for breaking, lateness or delays|flatter 是过分夸奖，不是为弄坏东西、迟到或延误道歉|tease means to make fun of someone, not to say sorry to them|tease 是取笑别人，不是向人道歉|a · pol · o · gize|the -ize ending in American spelling|美式拼写结尾是 -ize
      modest|a champion with three gold medals who says she was just lucky|a little house with two small bedrooms|a hero who will not talk about his own bravery|modest means not boasting, or not large; extravagant means showy and spending too much|modest 是谦虚的或不大的；extravagant 是奢侈张扬的|extravagant means spending too much or showy, the opposite of saying you were lucky or living in a small house|extravagant 是奢侈张扬的，和自称运气好或住小房子正好相反|obnoxious means rude and unpleasant, not quiet about your own success or bravery|obnoxious 是粗鲁讨厌的，不是对自己的成就或勇敢保持低调|mod · est|the -est ending|结尾是 -est
      flatter|a pupil praising his teacher to get a better grade|too much praise for someone's not very good singing|salesmen praising customers' good taste to make them buy|flatter means to praise someone too much to please them or get something; tease means to make fun of them|flatter 是为讨好或得利而过分夸奖；tease 是取笑|tease means to make fun of someone, not to praise them|tease 是取笑别人，不是夸奖|scold means to tell someone off angrily, the opposite of praising them|scold 是生气地训斥，和夸奖正好相反|flat · ter|the double t|双写 t
      tease|older boys making fun of a boy's big ears|a brother hiding shoes and laughing|a grandfather pretending to forget birthdays|tease means to make fun of someone, playfully or unkindly; insult means to be rude to them|tease 是开玩笑地或不友好地取笑；insult 是侮辱|flatter means to praise someone too much, not to make fun of them|flatter 是过分夸奖，不是取笑|confess means to admit a wrong, not to make fun of someone|confess 是承认错事，不是取笑别人|tease|the ea and the -se ending|中间是 ea，结尾是 -se
      insult|a guest saying a cook's soup tastes like dishwater|someone calling a mother a liar|fans chanting rudely at a referee|insult means to be rude to someone and hurt their pride; tease means to make fun of them, often playfully|insult 是出言不逊、伤人自尊；tease 常是开玩笑地取笑|flatter means to praise someone too much, the opposite of rude words|flatter 是过分夸奖，和出言不逊正好相反|apologize means to say sorry and is used with to, not rude words aimed at someone|apologize 是道歉，要接 to，不是对人出言不逊|in · sult|the -ult ending|结尾是 -ult
      scold|a mother telling a child off for coming home late|a teacher telling boys off for running in the corridor|an old woman angrily telling children off for kicking a ball into her roses|scold means to tell someone off angrily for something they did; insult means to be rude to them|scold 是因某事生气地训斥；insult 是侮辱|tease means to make fun of someone, not to tell them off angrily for what they did|tease 是取笑别人，不是因所做的事生气训斥|flatter means to praise someone too much, the opposite of telling them off|flatter 是过分夸奖，和训斥正好相反|scold|the -old ending|结尾是 -old
    `,
  },
);

const pity = batch(
  "words-of-pity-and-mercy",
  ["Words of Pity and Mercy", "怜悯与宽恕的词"],
  ["feeling for others, sadness, begging and being poor", "同情他人、悲伤、恳求与贫穷"],
  `
  pity|sorrow for the suffering of others; to feel this|怜悯|We felt ___ for the lost puppy shivering in the rain.|She took ___ on the hungry boy and gave him half of her lunch.|It's a real ___ that it rained on your wedding day after all that planning.|guilt,poverty|pitied,pitiful
  sympathy|feelings of pity and sorrow for someone's misfortune|同情|We sent a card to show our ___ when her grandmother died.|The whole town felt ___ for the family who had lost their home in the fire.|I have little ___ for people who drop litter and then complain about dirty streets.|guilt,reluctance|sympathize
  mercy|kindness shown to someone one could punish|宽恕|The prisoners begged the king for ___, hoping he would spare their lives.|The winning team showed no ___, scoring ten goals against the weakest side in the league.|The soldier fell to his knees and cried for ___ as the enemy raised their swords.|guilt,poverty|merciful
  grateful|feeling thanks|感激的|I am very ___ for your help; I could not have moved house without you.|We are ___ to the firefighters who saved our home from the flames.|The ___ villagers thanked the doctor again and again for saving the child's life.|modest,heartless|gratefully
  deserve|to be worthy of|应得|After all your hard work this year, you ___ a long holiday.|Does a hungry man ___ to go to prison for stealing one loaf of bread?|The players ___ to win the cup after playing so well all season.|tolerate,plead|deserved,deserving
  plead|to beg; to state in court whether one is guilty|恳求；申辩|All evening the children would ___ with their mother to let them keep the stray kitten.|In court tomorrow, the man will ___ not guilty to the robbery.|She fell to her knees to ___ for her son's life.|deserve,mourn|pleaded,plea
  mourn|to feel or show deep sorrow after a death|哀悼|The whole nation will ___ the death of the old queen.|It is normal to ___ for months after someone you love has died.|Villagers gathered at the church to ___ the fishermen lost at sea.|plead,tolerate|mourned,mourning,mourner
  misery|great suffering of mind or body|痛苦|The war brought ___ to millions, who lost their homes and their families.|The pain of his toothache made the whole week pure ___ for him.|Living in the cold, damp cellar all winter was ___ for the family.|sympathy,mercy|
  poverty|the state of being very poor|贫穷|Many families in the city live in ___, without enough money for food or rent.|She grew up in ___ and wore shoes with holes in them until she was twelve.|The charity works to end ___ by giving poor farmers seeds and tools.|mercy,sympathy|
  tolerate|to allow something one dislikes; to endure|容忍|I will not ___ rudeness in my classroom; anyone who is rude will be sent out.|Camels can ___ great heat and go for days without water.|She could no longer ___ the noise from the flat upstairs, so she called the landlord.|deserve,plead|tolerated,tolerant
  `,
  "context-clues",
  {
    intro: t(
      "The old woman had lived in **poverty** and **misery** for years, so when the judge showed her **mercy**, she was so **grateful** that she wept and thanked him for his **sympathy**. These ten words help you talk about feeling for others, sadness, begging and being poor.",
      "这位老妇人多年来生活在贫穷（**poverty**）和痛苦（**misery**）之中，所以当法官宽恕（**mercy**）了她时，她感激（**grateful**）得哭了出来，感谢他的同情（**sympathy**）。这十个词帮你谈论同情他人、悲伤、恳求和贫穷。",
    ),
    watchOut: {
      meanings: t(
        "**Sympathy** is feeling sorry for someone's bad luck, while **mercy** is choosing not to punish or hurt someone you could.",
        "**sympathy** 是为别人的不幸感到难过；**mercy** 是本可以惩罚或伤害某人却选择宽恕。",
      ),
      use: t(
        "You **plead with** someone **for** something, and in court you **plead guilty** or **plead not guilty**.",
        "**plead** 用 with 接人、for 接所求之事；在法庭上说 **plead guilty** 或 **plead not guilty**。",
      ),
      spelling: t(
        "**Grateful** starts with grate-, not great-, and **sympathy** has a y after the s and ph before the y at the end.",
        "**grateful** 以 grate- 开头，不是 great-；**sympathy** 在 s 后是 y，结尾前是 ph。",
      ),
    },
    notes: `
      pity|a lost puppy shivering in the rain|a hungry boy given half a lunch|rain on a wedding day after all the planning|pity is feeling sorry for someone's suffering, and "it's a pity" means it is sad; sympathy is sharing someone's sorrow|pity 是同情他人的苦难，“it's a pity” 指可惜；sympathy 是对他人的不幸感同身受|guilt is the feeling of having done wrong yourself, not feeling sorry for a puppy or a hungry boy|guilt 是自己做错事的内疚，不是同情小狗或饿孩子|poverty is being very poor, not a feeling of sorrow for others|poverty 是贫穷，不是同情他人的感受|pit · y|the y changes to i in pitied|pitied 中 y 变 i
      sympathy|a card sent when a grandmother dies|a town sharing the sorrow of a family burned out of their home|little feeling for people who drop litter and complain|sympathy is sharing someone's sorrow at their bad luck; pity can look down on them a little|sympathy 是为他人的不幸感同身受；pity 有时带点居高临下|guilt is the feeling of having done wrong yourself, not sorrow for someone else's loss|guilt 是自己做错事的内疚，不是为别人的损失难过|reluctance is not wanting to do something, not sharing someone's sorrow|reluctance 是不情愿，不是分担别人的悲伤|sym · pa · thy|y after s, and ph before the last y|s 后是 y，最后的 y 前是 ph
      mercy|prisoners begging a king to spare their lives|a team showing no kindness to the weakest side|a soldier crying out as swords are raised|mercy is choosing not to punish or hurt someone you could; sympathy is feeling sorry for them|mercy 是本可惩罚却选择宽恕；sympathy 是为对方难过|guilt is the feeling of having done wrong, not kindness to someone in your power|guilt 是内疚，不是对受制于你的人手下留情|poverty is being very poor, not sparing someone's life|poverty 是贫穷，不是饶人性命|mer · cy|the -cy ending|结尾是 -cy
      grateful|someone thankful for help moving house|a family thankful to firefighters|villagers thanking a doctor for saving a child|grateful means feeling thanks; modest means not boasting|grateful 是心存感激的；modest 是谦虚的|modest means not boasting about yourself, not thankful to someone else|modest 是不夸耀自己，不是感谢别人|heartless means showing no pity, the opposite of villagers thanking a doctor again and again|heartless 是冷酷无情的，和村民再三感谢医生正好相反|grate · ful|grate-, not great-, and one l at the end|是 grate- 不是 great-，结尾只有一个 l
      deserve|a long holiday after a year of hard work|prison for a hungry man who stole bread|a cup for players who played well all season|deserve means to have earned something, good or bad; tolerate means to put up with it|deserve 是应得（好坏皆可）；tolerate 是忍受|tolerate means to put up with something you dislike, not to have earned a holiday, prison or a cup|tolerate 是忍受不喜欢的事，不是应得假期、牢狱或奖杯|plead means to beg, and it is used with for or with, not with a holiday or to go to prison|plead 是恳求，要接 for 或 with，不直接接假期或 to go to prison|de · serve|the -erve ending|结尾是 -erve
      plead|children begging their mother to keep a kitten|a man telling a court he is not guilty|a mother on her knees begging for her son's life|plead means to beg hard, or to say in court whether you are guilty; deserve means to have earned something|plead 是苦苦恳求，或在法庭上申辩是否有罪；deserve 是应得|deserve means to have earned something, and it is never used with with a mother, not guilty or for a life|deserve 是应得，不和 with 某人、not guilty 或 for 某人的生命连用|mourn means to feel deep sorrow after a death, not to beg or speak in court|mourn 是为死者哀悼，不是恳求或在法庭申辩|plead|the ea, said like *ee*|ea 读作 ee
      mourn|a nation sorrowing over an old queen's death|months of sorrow after a loved one dies|villagers at church for fishermen lost at sea|mourn means to feel or show deep sorrow after a death; plead means to beg|mourn 是为逝者哀悼；plead 是恳求|plead means to beg or to answer in court, not to sorrow over someone who has died|plead 是恳求或在法庭申辩，不是为逝者哀伤|tolerate means to put up with something you dislike, not to sorrow over the dead|tolerate 是忍受不喜欢的事，不是哀悼逝者|mourn|the our, said like *or*|our 读作 or
      misery|a war that takes millions of homes and families|a week of toothache|a winter in a cold, damp cellar|misery is great suffering of mind or body; poverty is being poor, which may cause it|misery 是身心的巨大痛苦；poverty 是贫穷，可能导致痛苦|sympathy is feeling sorry for someone else, not the suffering itself|sympathy 是为别人难过，不是痛苦本身|mercy is kindness to someone you could punish, not suffering from war, toothache or cold|mercy 是宽恕，不是战争、牙痛或寒冷带来的痛苦|mis · er · y|miser plus -y|miser 加 -y
      poverty|families without enough money for food or rent|a girl wearing shoes with holes until she was twelve|a charity giving poor farmers seeds and tools|poverty is the state of being very poor; misery is great suffering of any kind|poverty 是贫穷；misery 是各种巨大的痛苦|mercy is kindness to someone you could punish, not a lack of money|mercy 是宽恕，不是缺钱|sympathy is feeling sorry for someone, not having no money for food or shoes|sympathy 是同情，不是没钱买食物或鞋子|pov · er · ty|the -ty ending|结尾是 -ty
      tolerate|a teacher who will not put up with rudeness|camels that can stand great heat|a woman who can no longer stand the noise upstairs|tolerate means to put up with something you dislike or that is hard; deserve means to have earned it|tolerate 是忍受不喜欢或艰难的事；deserve 是应得|deserve means to have earned something, not to put up with rudeness, heat or noise|deserve 是应得，不是忍受粗鲁、炎热或噪音|plead means to beg, not to put up with something you dislike|plead 是恳求，不是忍受不喜欢的事|tol · er · ate|the -ate ending|结尾是 -ate
    `,
  },
);

const anger = batch(
  "words-of-anger-and-bluntness",
  ["Words of Anger and Bluntness", "愤怒与直率的词"],
  ["fury, stirring it up, facing people, complaining and plain speech", "暴怒、挑起、对质、抱怨与直言"],
  `
  rage|violent anger; to be violently angry|狂怒；肆虐|Shaking with ___, he threw his phone at the wall and smashed it.|In fits of ___, she would slam the door so hard that the glass rattled.|Red with ___, the giant stamped his feet and roared until the castle shook.|outrage,disgust|raged,raging
  outrage|extreme anger at something unjust; to cause it|愤慨；激怒|There was public ___ when the judge let the rich driver go free after he had killed a child.|The plan to close the hospital caused ___ across the town, and thousands marched in protest.|Villagers wrote to the newspaper to show their ___ at the plan to cut down the ancient forest.|nuisance,sympathy|outraged,outrageous
  provoke|to stir up anger or a reaction|激怒；引起|Don't ___ the dog by pulling its tail, or it may bite you.|His rude remarks were meant to ___ a fight with the other team.|The new tax is sure to ___ angry protests across the country.|confront,grumble|provoked,provocative,provocation
  confront|to face someone in a challenging way; to deal with a problem|对质；面对|She decided to ___ her friend about the lies he had been telling behind her back.|The police had to ___ the gunman face to face in the bank.|We must ___ the problem of litter instead of pretending that it isn't there.|provoke,grumble|confronted
  aggressive|ready to attack; forceful|好斗的；积极进取的|The ___ dog growled and leapt at anyone who came near the gate.|The salesman was so ___, pushing and shouting at us to buy, that we left the shop.|The player was sent off for his ___ tackles, which hurt two opponents.|abrupt,frank|aggressively,aggression
  grumble|to complain in a bad-tempered way|发牢骚|The old man likes to ___ about the weather, the prices and the noisy children next door.|Workers began to ___ about the long hours, but none of them dared to complain to the boss.|Don't ___ about the food; just eat it and say thank you.|provoke,confront|grumbled
  nuisance|a person or thing causing annoyance|讨厌的人或事|The barking dog next door is a real ___, keeping us awake every night.|Flies are a ___ in summer, buzzing round the food on the table.|My little brother can be a ___ when I am trying to do my homework.|disgust,rage|nuisances
  disgust|a strong feeling of dislike; to cause it|厌恶；使厌恶|She wrinkled her nose in ___ at the smell of the rotten fish.|To my ___, there was a long hair in my soup.|He turned away in ___ when he saw the man kicking the dog.|nuisance,sympathy|disgusted,disgusting
  abrupt|sudden and unexpected; rudely brief|突然的；唐突的|The film's ending was so ___ that we thought the DVD had broken.|The car's ___ stop threw us all forward in our seats.|The change in the weather was ___: one minute it was sunny, the next it was snowing.|frank,modest|abruptly
  frank|open, honest and direct in speech|坦率的|To be ___, I didn't enjoy the film at all.|Doctors must be ___ with patients, calmly telling them the plain truth about their illness.|Let's have a ___ talk about your grades; I want the honest truth.|vehement,modest|frankly
  `,
  "context-clues",
  {
    intro: t(
      "The neighbour's loud music was a **nuisance**, but instead of shouting in **rage**, Mum chose to **confront** him calmly and be **frank** about the problem, careful not to **provoke** a fight. These ten words help you talk about anger, stirring it up, facing people, complaining and plain speech.",
      "邻居的大声音乐真是讨厌（**nuisance**），可妈妈没有暴怒（**rage**）地大喊，而是选择心平气和地当面找他（**confront**），坦率地（**frank**）说明问题，小心不去挑起（**provoke**）争吵。这十个词帮你谈论愤怒、挑衅、当面对质、抱怨和直言不讳。",
    ),
    watchOut: {
      meanings: t(
        "**Rage** is violent anger of any kind, while **outrage** is anger at something unfair or shocking, such as a judge letting a guilty man go.",
        "**rage** 是任何原因引起的暴怒；**outrage** 是对不公或骇人之事的愤慨，比如法官放走了罪犯。",
      ),
      use: t(
        "You **provoke** a fight or a reaction, but you **confront** a person or a problem face to face.",
        "**provoke** 的对象是争吵或反应；**confront** 的对象是要当面面对的人或问题。",
      ),
      spelling: t(
        "**Nuisance** has ui after the n, and **aggressive** has a double g and a double s.",
        "**nuisance** 在 n 后是 ui；**aggressive** 双写 g，也双写 s。",
      ),
    },
    notes: `
      rage|a man throwing his phone at a wall|a woman slamming the door so hard the glass rattles|a giant stamping and roaring until a castle shakes|rage is violent, wild anger; outrage is anger at something unjust|rage 是失控的暴怒；outrage 是对不公之事的愤慨|outrage is anger at something unfair, not wild fury that makes you throw things or stamp|outrage 是对不公之事的愤慨，不是让人摔东西、跺脚的狂怒|disgust is strong dislike of something nasty, not violent anger|disgust 是对恶心之物的强烈厌恶，不是暴怒|rage|the -age ending, said like *page*|结尾 -age 读音同 *page*
      outrage|a judge letting a rich driver go free after he killed a child|a town marching against closing its hospital|villagers writing in against cutting down an ancient forest|outrage is strong public anger at something unjust; rage is violent anger of any kind|outrage 是公众对不公之事的强烈愤慨；rage 是任何原因的暴怒|a nuisance is something that annoys you, not deep anger at a killing or at closing a hospital|nuisance 是让人烦的事，不是对杀人或关闭医院的愤慨|sympathy is feeling sorry for someone, not anger that makes people march in protest|sympathy 是同情，不是让人上街抗议的愤怒|out · rage|out plus rage|out 加 rage
      provoke|a dog's tail pulled until it may bite|rude remarks meant to start a fight|a new tax that will cause angry protests|provoke means to stir up anger or cause a reaction; confront means to face someone directly|provoke 是激怒或引起反应；confront 是当面对质|confront means to face someone or a problem directly, not to stir up a dog, a fight or protests|confront 是当面面对人或问题，不是激怒狗、挑起打斗或引发抗议|grumble means to complain, and it takes no dog, fight or protests after it|grumble 是发牢骚，后面不接狗、打斗或抗议|pro · voke|the -oke ending, as in *joke*|结尾是 -oke，同 *joke*
      confront|a woman facing her friend about his lies|police facing a gunman in a bank|a town dealing with its litter instead of ignoring it|confront means to face a person or problem directly; provoke means to stir up anger|confront 是当面面对人或问题；provoke 是激怒|provoke means to stir up anger or a reaction, not to face a friend, a gunman or a problem directly|provoke 是激怒或引起反应，不是当面面对朋友、持枪者或问题|grumble means to complain under your breath, and it takes no person or problem straight after it|grumble 是嘀咕抱怨，后面不直接接人或问题|con · front|con plus front|con 加 front
      aggressive|a dog growling and leaping at anyone near the gate|a salesman pushing and shouting at customers|tackles that hurt two opponents|aggressive means ready to attack or very forceful; abrupt means sudden or rudely short|aggressive 是好斗的或咄咄逼人的；abrupt 是突然的或唐突的|abrupt means sudden or short, not growling, pushing, shouting or hurting people|abrupt 是突然或简短的，不是咆哮、推搡、喊叫或伤人|frank means honest and direct in speech, not ready to attack or hurt|frank 是说话坦率的，不是好斗伤人的|ag · gres · sive|the double g and the double s|双写 g，也双写 s
      grumble|an old man complaining about weather, prices and children|workers complaining quietly about long hours|someone complaining about the food|grumble means to complain in a low, bad-tempered way; confront means to face someone directly|grumble 是低声发牢骚；confront 是当面对质|provoke means to stir up anger and needs something after it, not about the weather or the food|provoke 是激怒，后面要接对象，不接 about the weather 或 about the food|confront means to face someone directly, and it is not used with about straight after it|confront 是当面对质，后面不直接接 about|grum · ble|the -ble ending|结尾是 -ble
      nuisance|a neighbour's dog barking every night|flies buzzing round food in summer|a little brother bothering someone doing homework|a nuisance is a person or thing that annoys you; disgust is a strong feeling of dislike|nuisance 是让人烦的人或事；disgust 是强烈的厌恶感|disgust is a feeling of strong dislike, not the dog, the flies or the brother that annoy you|disgust 是厌恶感，不是让人烦的狗、苍蝇或弟弟本身|rage is violent anger, not a person or thing that annoys you|rage 是暴怒，不是让人烦的人或事|nui · sance|ui after the n, and the -ance ending|n 后是 ui，结尾是 -ance
      disgust|a woman wrinkling her nose at rotten fish|a long hair found in soup|a man turning away from someone kicking a dog|disgust is a strong feeling of dislike for something nasty; a nuisance is something that annoys you|disgust 是对恶心之物的强烈厌恶；nuisance 是让人烦的事|a nuisance is a thing that annoys you, not the feeling you have at rotten fish or a hair in soup|nuisance 是让人烦的事物，不是闻到臭鱼或看到汤里头发时的感受|sympathy is feeling sorry for someone, not turning away from something nasty|sympathy 是同情，不是对恶心之事扭头不看|dis · gust|dis plus gust|dis 加 gust
      abrupt|a film ending so suddenly the DVD seems broken|a car stopping so suddenly that people are thrown forward|sunshine turning to snow in a minute|abrupt means sudden and unexpected, or rudely short; aggressive means ready to attack|abrupt 是突然的或唐突的；aggressive 是好斗的|frank means honest and direct in speech, not a sudden ending, stop or change|frank 是说话坦率的，不形容突然的结尾、刹车或变化|modest means not boasting or not large, not sudden or unexpected|modest 是谦虚的或不大的，不是突然的|ab · rupt|the -upt ending|结尾是 -upt
      frank|someone honestly saying they did not enjoy a film|doctors calmly telling patients the plain truth|a talk about grades where the honest truth is wanted|frank means honest and direct in what you say; abrupt means rudely short|frank 是说话坦率直接的；abrupt 是生硬唐突的|vehement means full of strong, angry feeling, not calm, plain and honest|vehement 是情绪激烈的，不是平静、直白、诚实的|modest means not boasting, not honest and direct about the plain truth|modest 是谦虚的，不是直白地说出实情|frank|the -nk ending|结尾是 -nk
    `,
  },
);

const raids = batch(
  "words-of-raids-and-rumors",
  ["Words of Raids and Rumors", "突袭与谣言的词"],
  ["attacks, taking people and things, running away and spreading secrets", "袭击、劫掠、逃跑与散布秘密"],
  `
  raid|a sudden attack; to attack suddenly|突袭|Police carried out a dawn ___ on the house, breaking down the front door at six o'clock.|The Vikings' ___ on the village left the houses burning and the cattle gone.|During the air ___, bombs fell on the city all night long.|ambush,rumor|raided,raider
  ambush|a surprise attack from a hidden place; to attack this way|伏击|The soldiers hid in the trees for hours, then attacked the passing trucks in a surprise ___.|The bandits lay hidden beside the road, and the travellers rode straight into their ___.|Hiding behind the rocks, the rebels waited all day to spring their ___ on the passing soldiers.|bribe,rumor|ambushed
  kidnap|to take someone away illegally by force|绑架|The gang planned to ___ the rich man's daughter and ask for a million dollars to set her free.|Masked men tried to ___ the reporter, dragging her towards a waiting van.|Police believe someone tried to ___ the child from outside the school gates.|flee,bribe|kidnapped,kidnapper
  snatch|to grab quickly; a short part|抢夺；片段|A thief on a motorbike tried to ___ her bag as she walked to the bus stop.|The goalkeeper leapt high to ___ the ball out of the air.|The hungry dog tried to ___ the sausage from my plate when I looked away.|flee,leak|snatched
  flee|to run away from danger|逃离|Thousands of people had to ___ their homes when the river burst its banks.|After the robbery, the gang tried to ___ in a stolen car, but the police caught them.|As the fire spread, the animals began to ___ the burning forest.|snatch,leak|fled,fleeing
  bribe|money or a gift given to persuade someone to act dishonestly; to give one|贿赂|The minister was caught taking a ___ of fifty thousand dollars to give the contract to a friend's firm.|The prisoner offered the guard a ___ to leave his cell door unlocked.|The referee was sacked for accepting a ___ to help one team win the match.|rumor,torture|bribed,bribery
  poison|a substance that causes illness or death; to give it|毒药；毒害|Keep the rat ___ on a high shelf, well away from children and pets.|The queen died after someone slipped ___ into her wine at the feast.|The berries on that bush contain a deadly ___, so never eat them.|torture,bribe|poisoned,poisonous
  torture|severe pain inflicted as a punishment or to force someone to speak; to inflict it|酷刑；折磨|The prisoner was put through days of ___ until he told them the secret.|Standing all day in shoes two sizes too small was pure ___ for my feet.|International law forbids the ___ of prisoners of war.|poison,rumor|tortured
  leak|a hole letting liquid or gas escape; to reveal secret information|漏洞；泄露|Someone in the office decided to ___ the secret plans to a newspaper.|If you ___ this report to reporters, you will lose your job.|The spy promised to ___ the enemy's battle plans to our side.|snatch,flee|leaked,leakage,leaky
  rumor|a story passed around that may not be true|谣言|The ___ going round is that the school will close, but nobody knows whether it is true.|Don't believe every ___ you hear in the playground.|The ___ that the star was seriously ill turned out to be false.|bribe,ambush|rumors,rumored
  `,
  "context-clues",
  {
    intro: t(
      "After the pirates' **raid** on the port, a **rumor** spread that they meant to **kidnap** the governor, so many families chose to **flee** inland before the pirates could **snatch** anything else. These ten words help you talk about attacks, taking people and things, running away and spreading secrets.",
      "海盗突袭（**raid**）港口之后，一则谣言（**rumor**）传开了，说他们打算绑架（**kidnap**）总督，于是许多家庭赶在海盗再抢走（**snatch**）别的东西之前逃往（**flee**）内地。这十个词帮你谈论袭击、劫持人和抢夺财物、逃跑以及散布秘密。",
    ),
    watchOut: {
      meanings: t(
        "A **raid** is a sudden attack on a place, while an **ambush** is an attack from a hiding place on people passing by.",
        "**raid** 是对某地的突然袭击；**ambush** 是埋伏在暗处袭击路过的人。",
      ),
      use: t(
        "You **flee** a place or **flee from** danger, and the past is *fled*; you **leak** a secret **to** someone.",
        "**flee** 可直接接地点或用 flee from 接危险，过去式是 *fled*；泄露秘密给某人说 **leak** something **to** someone。",
      ),
      spelling: t(
        "**Kidnap** doubles its p in *kidnapped*, and **rumor** ends in -or in American spelling.",
        "**kidnap** 变 *kidnapped* 时双写 p；美式拼写的 **rumor** 以 -or 结尾。",
      ),
    },
    notes: `
      raid|police breaking down a front door at dawn|Vikings leaving a village burning and its cattle gone|bombs falling on a city all night|a raid is a sudden attack on a place; an ambush is an attack from hiding on people passing by|raid 是对某地的突然袭击；ambush 是从暗处袭击路过的人|an ambush is an attack from a hiding place on people passing by, not an attack on a house, a village or a city|ambush 是从暗处袭击路过的人，不是攻击房屋、村庄或城市|a rumor is a story passed around, not an attack|rumor 是流传的说法，不是袭击|raid|the ai, as in *paid*|ai 读音同 *paid*
      ambush|soldiers hidden in trees attacking passing trucks|travellers riding into hidden bandits|rebels behind rocks waiting all day for soldiers to pass|an ambush is an attack from a hiding place; a raid is a sudden attack on a place|ambush 是埋伏袭击；raid 是对某地的突袭|a bribe is money given to make someone act dishonestly, not an attack from hiding|bribe 是让人做不正当事的贿赂，不是埋伏袭击|a rumor is a story passed around, not something soldiers or bandits spring on travellers|rumor 是流传的说法，不是士兵或强盗对路人发动的袭击|am · bush|am plus bush|am 加 bush
      kidnap|a gang taking a rich man's daughter for a million dollars|masked men dragging a reporter towards a van|someone trying to take a child from outside a school|kidnap means to take a person away by force and hold them; snatch means to grab something quickly|kidnap 是强行劫走并扣押某人；snatch 是迅速抢夺东西|flee means to run away from danger, not to take a person away by force|flee 是逃离危险，不是强行带走某人|bribe means to give money to make someone act dishonestly, not to drag a person away|bribe 是行贿，不是把人拖走|kid · nap|kid plus nap, with a double p in kidnapped|kid 加 nap，kidnapped 中双写 p
      snatch|a thief on a motorbike grabbing a bag|a goalkeeper grabbing a ball out of the air|a dog grabbing a sausage from a plate|snatch means to grab something quickly; kidnap means to take a person away by force|snatch 是迅速抢夺东西；kidnap 是强行劫走人|flee means to run away from danger, not to grab a bag, a ball or a sausage|flee 是逃离危险，不是抢包、接球或抢香肠|leak means to let out a secret or a liquid, not to grab something quickly|leak 是泄露秘密或漏出液体，不是迅速抢东西|snatch|the tch at the end|结尾是 tch
      flee|people leaving their homes as a river floods|a gang trying to get away in a stolen car|animals running from a burning forest|flee means to run away from danger; snatch means to grab quickly|flee 是逃离危险；snatch 是迅速抢夺|snatch means to grab something quickly, not to run away from homes, the police or a fire|snatch 是迅速抢东西，不是逃离家园、警察或火灾|leak means to let out a secret or a liquid, not to run away|leak 是泄露秘密或漏出液体，不是逃跑|flee|the double e; the past is fled|双写 e；过去式是 fled
      bribe|a minister taking fifty thousand dollars to give a contract to a friend|a prisoner offering a guard money to leave a door unlocked|a referee paid to help one team win|a bribe is money or a gift given to make someone act dishonestly; a rumor is a story passed around|bribe 是让人做不正当事的钱物；rumor 是流传的说法|a rumor is a story passed around, not money paid to a minister, a guard or a referee|rumor 是流传的说法，不是付给部长、看守或裁判的钱|torture is severe pain caused on purpose, not money offered to get help|torture 是故意施加的剧痛，不是为求帮忙而给的钱|bribe|the long i and the silent e|长音 i，结尾 e 不发音
      poison|rat killer kept on a high shelf|something slipped into a queen's wine|deadly berries on a bush|poison is a substance that causes illness or death; torture is pain caused on purpose|poison 是致病致死的物质；torture 是故意施加的痛苦|torture is severe pain caused on purpose, not a substance kept on a shelf, put in wine or found in berries|torture 是故意施加的剧痛，不是放在架上、下在酒里或长在浆果里的物质|a bribe is money given to make someone dishonest, not something deadly to eat|bribe 是贿赂，不是有毒的吃食|poi · son|the oi, as in *coin*|oi 读音同 *coin*
      torture|a prisoner hurt for days until he tells a secret|shoes two sizes too small worn all day|a law that forbids hurting prisoners of war|torture is severe pain caused on purpose, or something very painful; poison is a substance that harms|torture 是故意施加的剧痛或极大的折磨；poison 是有毒物质|poison is a substance that causes illness or death, not days of pain until someone talks or tight shoes|poison 是致病致死的物质，不是逼人开口的连日折磨或挤脚的鞋子|a rumor is a story passed around, not severe pain|rumor 是流传的说法，不是剧痛|tor · ture|the -ture ending|结尾是 -ture
      leak|an office worker giving secret plans to a newspaper|a report given to reporters at the cost of a job|a spy passing enemy battle plans to our side|leak means to let secret information out; snatch means to grab quickly|leak 是泄露秘密信息；snatch 是迅速抢夺|snatch means to grab something quickly, and it is not used with to a newspaper or to reporters|snatch 是迅速抢东西，不和“给报社”或“给记者”连用|flee means to run away from danger, not to pass secrets to someone|flee 是逃离危险，不是把秘密透露给别人|leak|the ea, said like *ee*|ea 读作 ee
      rumor|a story that a school will close that nobody knows is true|stories heard in the playground that should not all be believed|a false story that a star was seriously ill|a rumor is a story passed around that may not be true; a leak is secret information let out|rumor 是可能不实的流言；leak 是泄露出来的秘密|a bribe is money given to make someone dishonest, not a story going round|bribe 是贿赂，不是流传的说法|an ambush is an attack from a hiding place, not a story that may be false|ambush 是埋伏袭击，不是可能不实的说法|ru · mor|the -or ending in American spelling|美式拼写结尾是 -or
    `,
  },
);

const slips = batch(
  "words-of-slips-and-scrambles",
  ["Words of Slips and Scrambles", "滑倒与攀爬的词"],
  ["falling, climbing, squeezing, spilling, breaking and rushing", "跌倒、攀爬、挤压、洒出、打碎与匆忙"],
  `
  stumble|to trip and nearly fall; to make a mistake|绊倒；结巴|Be careful not to ___ over the tree roots on the forest path.|He began to ___ over the hard words as he read aloud, and the class giggled.|In the dark she would often ___ on the stairs and only just stop herself from falling.|soar,squeeze|stumbled
  tumble|to fall suddenly and helplessly; to drop fast|跌倒；暴跌|After the heavy rain, rocks began to ___ down the hillside onto the road.|Share prices may ___ by half if the company loses the court case.|The toddler would ___ off the sofa and land on the rug, laughing.|stumble,soar|tumbled
  slippery|hard to hold or stand on because smooth or wet|滑的|The ice made the road so ___ that cars slid into each other.|Wet soap is ___ and hard to hold.|The fish was too ___ to hold, and it slid out of his hands back into the water.|grimy,sloppy|
  crouch|to bend low with knees bent|蹲伏|The cat would ___ low in the grass, ready to spring at the bird.|We had to ___ behind the wall so the guards would not see us.|He had to ___ down to talk to the small child face to face.|soar,spill|crouched
  scramble|to climb quickly using hands; to move hurriedly; to mix eggs while cooking|攀爬；争抢；炒(蛋)|We had to ___ up the rocks on our hands and knees to reach the top.|Fans began to ___ for the ball when it flew into the crowd.|Dad likes to ___ eggs with butter and a little milk for breakfast.|crouch,spill|scrambled
  soar|to fly high; to rise quickly|翱翔；飞涨|The eagle began to ___ high above the mountains on the warm air.|House prices may ___ to twice what they are now if the new railway is built.|Watch the kite ___ into the sky as the wind catches it.|tumble,smash|soared,soaring
  squeeze|to press firmly; to force into a small space|挤压；挤进|She had to ___ the lemon hard to get the last drops of juice out.|Ten of us tried to ___ into the tiny car, sitting on each other's laps.|Gently ___ the tube to get a little toothpaste onto your brush.|crouch,spill|squeezed
  spill|to let liquid run over the edge; an amount spilled|洒出|Be careful not to ___ your milk on the new carpet.|The waiter tripped and managed to ___ soup all over the guest's dress.|If you fill the glass right to the top, you will ___ some as you carry it.|squeeze,smash|spilled,spilt
  smash|to break violently; a big hit|打碎；轰动|The thieves had to ___ the shop window with a hammer to get in.|He was so angry that he wanted to ___ every plate in the kitchen.|The car went off the icy road and seemed sure to ___ into the tree.|spill,soar|smashed,smashing
  haste|excessive speed or urgency|匆忙|In his ___ to catch the train, he left his bag on the platform.|She packed in such ___ that she forgot her passport.|The letter had clearly been written in ___, with words crossed out and ink blots everywhere.|reluctance,nuisance|hasten,hasty,hastily
  `,
  "context-clues",
  {
    intro: t(
      "On the **slippery** rocks, Mia began to **stumble**, then **tumble**, and in her **haste** to get up she had to **scramble** over a boulder while the gulls began to **soar** above her. These ten words help you talk about falling, climbing, squeezing, spilling, breaking and rushing.",
      "在滑溜溜的（**slippery**）岩石上，米娅先是绊了一下（**stumble**），接着摔倒了（**tumble**）；她匆忙（**haste**）中想爬起来，不得不手脚并用地爬过（**scramble**）一块大石头，海鸥则在她头顶翱翔（**soar**）。这十个词帮你谈论跌倒、攀爬、挤压、洒出、打碎和匆忙。",
    ),
    watchOut: {
      meanings: t(
        "To **stumble** is to trip and nearly fall, while to **tumble** is to actually fall, often over and over.",
        "**stumble** 是绊了一下、差点摔倒；**tumble** 是真的摔下去，常常还翻滚。",
      ),
      use: t(
        "You **squeeze** a lemon or **squeeze into** a small space, and you **spill** a liquid **on** or **over** something.",
        "挤柠檬说 **squeeze** a lemon，挤进小空间说 **squeeze into**；把液体洒到某物上说 **spill** something **on/over**。",
      ),
      spelling: t(
        "**Slippery** has a double p, and **squeeze** has ee and ends in -ze.",
        "**slippery** 双写 p；**squeeze** 中间是 ee，以 -ze 结尾。",
      ),
    },
    notes: `
      stumble|tree roots on a forest path|hard words read aloud with mistakes|stairs in the dark where someone only just stops falling|stumble means to trip and nearly fall, or to make mistakes; tumble means to fall right down|stumble 是绊一下差点摔倒或说话磕绊；tumble 是真的摔倒|soar means to fly high or rise fast, not to trip over roots, words or stairs|soar 是高飞或飞涨，不是被树根、字词或楼梯绊住|squeeze means to press hard or push into a small space, not to trip|squeeze 是用力挤压或挤进去，不是绊倒|stum · ble|the -ble ending|结尾是 -ble
      tumble|rocks rolling down a hillside after rain|share prices dropping by half|a toddler falling off a sofa onto a rug|tumble means to fall suddenly and helplessly, or to drop fast; stumble means to trip and nearly fall|tumble 是突然无助地跌落或暴跌；stumble 是绊一下差点摔倒|stumble means a person tripping and nearly falling, not rocks rolling, prices dropping or a child falling right off|stumble 是人绊一下差点摔倒，不是石头滚落、价格暴跌或孩子摔下来|soar means to rise high or fast, the opposite of falling down or dropping|soar 是高飞或飞涨，和跌落正好相反|tum · ble|the -ble ending|结尾是 -ble
      slippery|an icy road on which cars slide|wet soap that is hard to hold|a fish that slides out of someone's hands|slippery means hard to hold or stand on because smooth or wet; grimy means covered in dirt|slippery 是因光滑或潮湿而难以抓牢或站稳的；grimy 是满是污垢的|grimy means covered in dirt, not smooth or wet enough to slide|grimy 是满是污垢的，不是光滑潮湿得会打滑|sloppy means careless or loose, not making cars or a fish slide|sloppy 是马虎或松垮的，不是让车或鱼打滑|slip · per · y|the double p|双写 p
      crouch|a cat bending low in grass ready to spring|people bending down behind a wall to hide|a man bending down to talk to a small child|crouch means to bend low with your knees bent; scramble means to climb or move in a hurry|crouch 是屈膝蹲低；scramble 是匆忙攀爬或移动|soar means to fly high, the opposite of bending low|soar 是高飞，和蹲低正好相反|spill means to let liquid run over, not to bend down low|spill 是把液体洒出，不是蹲低|crouch|the ou and the -ch ending|中间是 ou，结尾是 -ch
      scramble|climbing rocks on hands and knees|fans rushing for a ball in the crowd|eggs mixed in a pan with butter and milk|scramble means to climb or move quickly and roughly, or to mix eggs while cooking; crouch means to bend low|scramble 是手脚并用地爬、争抢或炒蛋；crouch 是蹲低|crouch means to bend low and stay still, not to climb, rush for a ball or cook eggs|crouch 是蹲低不动，不是攀爬、抢球或炒蛋|spill means to let liquid run over the edge, not to climb rocks or mix eggs in a pan|spill 是把液体洒出，不是攀岩或在锅里炒蛋|scram · ble|the scr at the start and the -ble ending|开头是 scr，结尾是 -ble
      soar|an eagle flying high above mountains|house prices rising to twice what they are|a kite rising into the sky in the wind|soar means to fly high or rise quickly; tumble means to fall or drop fast|soar 是高飞或飞涨；tumble 是跌落或暴跌|tumble means to fall or drop fast, the opposite of rising high into the sky or to twice the price|tumble 是跌落或暴跌，和升上高空或涨到两倍正好相反|smash means to break violently, not to fly or rise high|smash 是猛地打碎，不是高飞或上涨|soar|the oar, as in *roar*|oar 读音同 *roar*
      squeeze|a lemon pressed hard for its last drops|ten people pushing into a tiny car|a tube pressed gently for toothpaste|squeeze means to press something firmly or to push into a small space; crouch means to bend low|squeeze 是用力挤压或挤进小空间；crouch 是蹲低|crouch means to bend low, not to press a lemon or a tube or push into a car|crouch 是蹲低，不是挤柠檬、挤牙膏或挤进车里|spill means to let liquid run over by accident, not to press it out on purpose or push into a space|spill 是不小心把液体洒出，不是有意挤出或挤进空间|squeeze|ee in the middle and the -ze ending|中间是 ee，结尾是 -ze
      spill|milk dropped on a new carpet|a waiter tripping and covering a dress in soup|a glass filled too full to carry|spill means to let a liquid run over the edge by accident; squeeze means to press something firmly|spill 是不小心把液体洒出；squeeze 是用力挤压|squeeze means to press something firmly on purpose, not to let milk or soup run over by accident|squeeze 是有意用力挤压，不是不小心洒出牛奶或汤|smash means to break something violently, not to let a liquid run over|smash 是猛地打碎，不是让液体洒出|spill|the double l; the past is spilled or spilt|双写 l；过去式是 spilled 或 spilt
      smash|thieves breaking a shop window with a hammer|an angry man wanting to break every plate|a car about to crash into a tree|smash means to break or hit something violently; spill means to let liquid run over|smash 是猛烈打碎或撞击；spill 是洒出液体|spill means to let liquid run over the edge, not to break a window, plates or a car|spill 是洒出液体，不是打碎窗户、盘子或撞毁汽车|soar means to fly high or rise quickly, not to break or crash|soar 是高飞或飞涨，不是打碎或撞击|smash|the sh at the end|结尾是 sh
      haste|a man leaving his bag behind as he rushes for a train|a woman packing so fast she forgets her passport|a letter full of crossings-out written too fast|haste is too much speed or hurry; reluctance is not wanting to do something|haste 是过于匆忙；reluctance 是不情愿|reluctance is not wanting to do something, the opposite of rushing to catch a train or to pack|reluctance 是不情愿，和匆忙赶火车或收拾行李正好相反|a nuisance is a person or thing that annoys you, not too much speed|nuisance 是让人烦的人或事，不是过于匆忙|haste|the long a and the silent e|长音 a，结尾 e 不发音
    `,
  },
);

const splendor = batch(
  "words-of-spectacle-and-splendor",
  ["Words of Spectacle and Splendor", "壮观与辉煌的词"],
  ["shows, beauty, foreign wonders, legends and excitement", "表演、美丽、异域奇观、传说与兴奋"],
  `
  parade|a public procession; to walk in one|游行|The ___ marched down the main street, with bands playing and flags waving.|Thousands lined the streets to cheer the victory ___ of the winning team as their open bus drove by.|The children's lantern ___ wound slowly through the old town at night.|gesture,myth|paraded
  spectacle|a visually striking show|壮观场面|The fireworks over the harbour were a wonderful ___, lighting up the whole sky.|The huge waves crashing on the rocks made an amazing ___ for the tourists on the cliff.|The opening of the Olympics was a ___ of light, music and dance watched by billions.|myth,miracle|spectacles,spectacular
  splendid|magnificent; very good|壮丽的；极好的|The painters have done ___ work on the fence; it looks better than ever.|The palace had ___ halls with gold ceilings and marble floors.|Thank you for the party; we all had ___ fun and stayed until midnight.|sloppy,obnoxious|splendidly,splendor
  gorgeous|beautiful; very attractive|极好看的|She looked ___ in her long blue dress at the wedding.|What ___ weather—blue sky and sunshine all day long!|The view from the top of the hill was ___, with green valleys and a sparkling lake below.|grubby,sloppy|gorgeously
  glamour|attractive and exciting charm|魅力|She loved the ___ of the fashion world: the beautiful clothes, the parties and the famous faces.|Film stars bring ___ to the festival, arriving in fine gowns and long shining cars.|Behind all the ___ of the stage, an actor's life is often hard and badly paid.|poverty,misery|glamorous
  exotic|from or like a distant foreign country|异国的|The market sells ___ fruits from faraway lands, like mangoes and passion fruit.|She dreamed of travelling to ___ places like Tahiti and Zanzibar.|The zoo keeps ___ animals from distant jungles, such as tigers and parrots.|suburban,virtual|
  myth|a traditional story; a false belief|神话；谬论|The ancient ___ tells how Zeus, king of the gods, threw thunderbolts from the sky.|The ___ of the dragon guarding its gold has been told for a thousand years.|In the old Norse ___, Thor fights giants with his mighty hammer.|miracle,gesture|myths,mythical,mythology
  miracle|an amazing event that cannot be explained by nature|奇迹|It is a ___ that the baby survived a fall from the third floor without a scratch.|Doctors called her recovery a ___, since they had given up all hope.|Only a ___ could save the team now; they were losing five to nil with a minute left.|spectacle,gesture|miracles,miraculous
  thrill|a sudden feeling of excitement; to excite|激动；使激动|Riding the roller coaster for the first time gave her a ___ she would never forget.|I still remember the ___ of scoring my first goal for the school team.|For the climbers, reaching the top of Everest was the ___ of a lifetime.|glamour,gesture|thrilling,thriller
  gesture|a movement to express an idea; an action showing feeling|手势；姿态|He made a rude ___ with his finger at the other driver.|Sending flowers to our sick neighbour was a kind ___ that cheered her up.|She waved her hand in a ___ that meant "come here".|thrill,parade|gestured,gestures
  `,
  "context-clues",
  {
    intro: t(
      "The festival was a **spectacle**: a **parade** of dancers in **gorgeous** costumes, **exotic** music from faraway lands, and fireworks that gave every child a **thrill**. These ten words help you talk about shows, beauty, foreign wonders, legends and excitement.",
      "这场节日真是壮观（**spectacle**）：舞者们穿着华美的（**gorgeous**）服装列队游行（**parade**），远方传来异国的（**exotic**）音乐，烟花让每个孩子都激动不已（**thrill**）。这十个词帮你谈论表演、美丽、异域奇观、传说和兴奋。",
    ),
    watchOut: {
      meanings: t(
        "A **myth** is an old traditional story or a false belief, while a **miracle** is an amazing event that seems impossible.",
        "**myth** 是古老的传说或错误的观念；**miracle** 是看似不可能发生的奇迹。",
      ),
      use: t(
        "You **make a gesture** with your hands, you **get a thrill** from something, and you **watch a parade** go by.",
        "用手做手势说 **make a gesture**；从某事中感到激动说 **get a thrill**；看游行队伍经过说 **watch a parade**。",
      ),
      spelling: t(
        "**Gorgeous** ends in -geous, and **glamour** keeps -our, but *glamorous* drops the u.",
        "**gorgeous** 以 -geous 结尾；**glamour** 保留 -our，*glamorous* 却去掉了 u。",
      ),
    },
    notes: `
      parade|bands and flags marching down a main street|a winning team cheered from an open bus|children carrying lanterns through an old town at night|a parade is a line of people moving through the streets for the public to watch; a spectacle is any striking show|parade 是沿街行进供人观看的队伍；spectacle 是任何壮观的场面|a gesture is a movement of the hands or a kind act, not people marching or driving through streets|gesture 是手势或表示心意的举动，不是沿街行进的队伍|a myth is an old story or a false belief, not people moving through a town|myth 是古老传说或错误观念，不是在城里行进的人群|pa · rade|the -ade ending, as in *made*|结尾是 -ade，同 *made*
      spectacle|fireworks lighting up a whole harbour sky|huge waves crashing on rocks watched by tourists|an Olympic opening of light, music and dance|a spectacle is a show that is striking to look at; a parade is a procession|spectacle 是令人瞩目的壮观场面；parade 是游行队伍|a myth is an old story, not something people watch light up the sky or crash on rocks|myth 是古老传说，不是人们观看的照亮天空或拍打岩石的景象|a miracle is an event that cannot be explained, not fireworks, waves or a planned show|miracle 是无法解释的奇事，不是烟花、海浪或精心安排的表演|spec · ta · cle|the -cle ending|结尾是 -cle
      splendid|painters' work that makes a fence look better than ever|palace halls with gold ceilings and marble floors|a party enjoyed until midnight|splendid means magnificent or very good; gorgeous means very beautiful|splendid 是壮丽的或极好的；gorgeous 是非常美丽的|sloppy means careless and messy, the opposite of work that looks better than ever or golden halls|sloppy 是马虎凌乱的，和焕然一新的活计或金碧辉煌的大厅正好相反|obnoxious means rude and unpleasant, not grand or very good|obnoxious 是粗鲁讨厌的，不是壮丽或极好的|splen · did|the -did ending|结尾是 -did
      gorgeous|a woman in a long blue dress at a wedding|a day of blue sky and sunshine|a hilltop view of green valleys and a sparkling lake|gorgeous means very beautiful; splendid means grand or very good|gorgeous 是非常美丽的；splendid 是壮丽的或极好的|grubby means rather dirty, the opposite of a fine dress, sunshine or a sparkling view|grubby 是脏兮兮的，和漂亮的裙子、阳光或闪亮的美景正好相反|sloppy means careless or loose, not beautiful|sloppy 是马虎或松垮的，不是美丽的|gor · geous|the -geous ending|结尾是 -geous
      glamour|beautiful clothes, parties and famous faces in fashion|film stars in fine gowns and long cars|the exciting side of the stage that hides hard work|glamour is exciting, attractive charm, often of fame and fashion; a thrill is a sudden feeling of excitement|glamour 是名利和时尚带来的迷人魅力；thrill 是一阵激动|poverty is being very poor, the opposite of fine gowns, parties and famous faces|poverty 是贫穷，和华服、派对与名人正好相反|misery is great suffering, not the attractive charm of fame and fashion|misery 是巨大的痛苦，不是名利和时尚的魅力|glam · our|the -our ending; glamorous drops the u|结尾是 -our；glamorous 去掉 u
      exotic|mangoes and passion fruit from faraway lands|dreams of Tahiti and Zanzibar|tigers and parrots from distant jungles|exotic means coming from or like a distant foreign country; splendid means grand|exotic 是来自远方异国的；splendid 是壮丽的|suburban means of the quiet outer parts of a town, not from faraway lands or distant jungles|suburban 是城郊的，不是来自远方或遥远丛林的|virtual means existing only on a computer, not real fruit, real places or real animals from far away|virtual 是只存在于电脑中的，不是来自远方的真实水果、地方或动物|ex · ot · ic|the x and the -ic ending|中间是 x，结尾是 -ic
      myth|an ancient story of Zeus throwing thunderbolts|a dragon guarding gold in a tale told for a thousand years|Thor fighting giants with his hammer|a myth is a traditional story, often about gods and heroes, or a false belief; a miracle is an amazing real event|myth 是关于神和英雄的传说或错误观念；miracle 是真实发生的奇迹|a miracle is an amazing event, not an old story of gods, dragons or giants that is told and retold|miracle 是惊人的事件，不是代代相传的关于神、龙或巨人的古老故事|a gesture is a movement of the hands, not a story|gesture 是手势，不是故事|myth|the y, said like a short i, and the th|y 读短音 i，结尾是 th
      miracle|a baby surviving a fall from the third floor|a recovery after doctors gave up hope|a team needing to score many goals in a minute|a miracle is an amazing event that seems impossible; a spectacle is a striking show to watch|miracle 是看似不可能的奇事；spectacle 是壮观的场面|a spectacle is a show to look at, not a survival or recovery that seems impossible|spectacle 是供观看的场面，不是看似不可能的生还或康复|a gesture is a movement of the hands or a kind act, not an impossible event|gesture 是手势或善意的举动，不是不可能发生的事|mir · a · cle|the -cle ending|结尾是 -cle
      thrill|a first ride on a roller coaster|scoring a first goal for the school team|reaching the top of Everest|a thrill is a sudden strong feeling of excitement; glamour is exciting charm that others see|thrill 是一阵强烈的激动；glamour 是别人眼中的迷人魅力|glamour is the attractive charm of fame or fashion, not the feeling from a ride, a goal or a climb|glamour 是名利或时尚的魅力，不是坐过山车、进球或登顶时的感受|a gesture is a movement of the hands, not a feeling of excitement|gesture 是手势，不是激动的感觉|thrill|the thr at the start and the double l|开头是 thr，结尾双写 l
      gesture|a rude finger shown to another driver|flowers sent to cheer a sick neighbour|a wave of the hand meaning "come here"|a gesture is a movement that shows meaning, or a kind act; a thrill is a feeling of excitement|gesture 是表达意思的动作或表示心意的举动；thrill 是激动的感觉|a thrill is a feeling of excitement, not a movement of the hand or a kind act|thrill 是激动的感觉，不是手的动作或善意的举动|a parade is a line of people marching through streets, not one hand movement or a kind act|parade 是沿街行进的队伍，不是一个手势或善意的举动|ges · ture|the soft g and the -ture ending|g 发软音，结尾是 -ture
    `,
  },
);

const daring = batch(
  "words-of-daring-and-promises",
  ["Words of Daring and Promises", "冒险与承诺的词"],
  ["taking risks, temptation, vows, pretending and managing", "冒险、诱惑、誓言、假装与应对"],
  `
  dare|to have the courage to do something; to challenge|敢；激(某人)做|Nobody would ___ to speak back to the strict headmaster.|How ___ you read my diary without asking me first!|Don't you ___ touch my cake while I'm out!|tempt,cope|dared
  venture|a risky journey or business; to go somewhere risky|冒险(事业)；冒险前往|Only the bravest sailors would ___ out into such a storm.|We decided to ___ deep into the jungle, though we knew it was dangerous.|Few people ___ into the old mine after dark.|swap,cope|ventured
  tempt|to try to persuade someone to do something wrong or unwise|诱惑|The smell of fresh bread can ___ you to break your diet.|Don't ___ me with chocolate; I'm trying to eat less sugar.|Thieves are less likely to break in if you don't ___ them by leaving windows open.|swap,cope|tempted,tempting
  impulse|a sudden urge to act|冲动|On a sudden ___, she bought a puppy at the market without thinking.|He felt a strong ___ to laugh in the middle of the serious speech.|Shoppers often buy sweets on ___ while waiting at the checkout.|burden,pledge|impulses
  pledge|a solemn promise; to promise|誓言；保证|The mayor kept his ___ to build a new hospital, and it opened within five years.|Every new soldier takes a solemn ___ to serve the country.|The singer's ___ of ten thousand dollars to the charity was paid this morning.|burden,impulse|pledged
  swear|to make a solemn promise; to use rude words|发誓；咒骂|Knights would kneel and ___ to serve their king until death.|Witnesses in court must ___ to tell the truth.|Please don't ___ in front of the children; those words are rude.|cope,pretend|swore,sworn,swearing
  pretend|to act as if something is true when it is not|假装|He would ___ to be asleep whenever his mum came to wake him for school.|Let's ___ the floor is lava and jump from chair to chair!|Don't ___ you didn't see me; I saw you look right at me!|swap,cope|pretended
  swap|to exchange|交换|Shall we ___ seats so that you can sit by the window?|The boys used to ___ football cards in the playground at lunch.|I'll ___ my apple for your banana, if you like.|pretend,tempt|swapped
  cope|to deal with something difficult|应对|Nurses must ___ with long hours and very sick patients.|How will you ___ with three small children and a full-time job?|The old bridge cannot ___ with so many heavy trucks crossing it every day.|venture,pretend|coped
  burden|a heavy load; a duty or worry|负担|The donkey staggered under its heavy ___ of firewood.|Caring for her sick father alone was a great ___ on her.|The new tax will be a heavy ___ for poor families.|pledge,impulse|burdened,burdensome
  `,
  "context-clues",
  {
    intro: t(
      "The young explorer made a **pledge** to his village: he would **venture** across the desert, never let thirst **tempt** him to turn back, and **cope** with whatever **burden** the journey brought. These ten words help you talk about taking risks, temptation, promises, pretending and managing hard things.",
      "年轻的探险者向村子立下誓言（**pledge**）：他要冒险（**venture**）穿越沙漠，绝不让口渴诱使（**tempt**）他回头，并应对（**cope**）旅途带来的一切负担（**burden**）。这十个词帮你谈论冒险、诱惑、承诺、假装和应对难事。",
    ),
    watchOut: {
      meanings: t(
        "To **swear** is to make a solemn promise or to use rude words, while a **pledge** is a solemn promise, often of money or help.",
        "**swear** 是郑重发誓，也可指说脏话；**pledge** 是郑重的承诺，常指捐款或援助的承诺。",
      ),
      use: t(
        "You **cope with** a problem, always with with, and you **venture into** or **out into** a dangerous place.",
        "**cope** 后面一定接 **with**；冒险进入危险的地方说 **venture into** 或 **venture out into**。",
      ),
      spelling: t(
        "**Swap** is spelt with a but sounds like *swop*, and the past forms of **swear** are *swore* and *sworn*.",
        "**swap** 拼作 a，读音却像 *swop*；**swear** 的过去式和过去分词是 *swore* 和 *sworn*。",
      ),
    },
    notes: `
      dare|pupils too scared to speak back to a strict headmaster|someone shocked that their diary was read|a warning not to touch a cake|dare means to be brave or bold enough to do something; venture means to go somewhere risky|dare 是敢于做某事；venture 是冒险前往|tempt means to make someone want to do something wrong, not to be brave enough to speak back, read a diary or touch a cake|tempt 是诱惑别人做错事，不是有胆量顶嘴、偷看日记或碰蛋糕|cope means to deal with something hard, and it is always followed by with|cope 是应对难事，后面总接 with|dare|the -are ending, as in *care*|结尾是 -are，同 *care*
      venture|sailors going out into a storm|explorers going deep into a dangerous jungle|people going into an old mine after dark|venture means to go somewhere risky; dare means to be brave enough to do anything|venture 是冒险前往某处；dare 是敢于做任何事|swap means to exchange one thing for another, not to go out into a storm or into a jungle|swap 是交换，不是冒险进入风暴或丛林|cope means to deal with something hard, and it is followed by with, not by out into or deep into|cope 是应对难事，后接 with，不接 out into 或 deep into|ven · ture|the -ture ending|结尾是 -ture
      tempt|the smell of fresh bread making someone break a diet|chocolate offered to someone eating less sugar|open windows that invite thieves in|tempt means to make someone want to do something wrong or unwise; dare means to be brave enough to act|tempt 是诱惑人去做错事或不明智的事；dare 是敢于行动|swap means to exchange, not to make someone want to break a diet or break in|swap 是交换，不是诱使人破戒或闯入|cope means to deal with something hard and is followed by with, not by a person|cope 是应对难事，后接 with，不直接接人|tempt|the mpt at the end|结尾是 mpt
      impulse|buying a puppy without thinking|a strong urge to laugh during a serious speech|sweets bought at the checkout without planning|an impulse is a sudden urge to act; a pledge is a solemn promise|impulse 是突然的冲动；pledge 是郑重的承诺|a burden is a heavy load or worry, not a sudden urge to buy or laugh|burden 是沉重的负担或忧虑，不是突然想买东西或想笑的冲动|a pledge is a solemn promise made with thought, the opposite of acting without thinking|pledge 是深思熟虑后的郑重承诺，和不假思索地行动正好相反|im · pulse|the -se ending|结尾是 -se
      pledge|a mayor keeping his promise to build a hospital|a soldier's solemn promise to serve|a singer's promised gift of money to a charity|a pledge is a solemn promise, often of money or help; an impulse is a sudden urge|pledge 是郑重的承诺，常指捐款或援助；impulse 是突然的冲动|a burden is a heavy load or worry, not a promise you keep, take or pay|burden 是负担，不是要信守、立下或兑现的承诺|an impulse is a sudden urge, not a solemn promise that is kept or paid|impulse 是突然的冲动，不是要信守或兑现的郑重承诺|pledge|the dge at the end|结尾是 dge
      swear|knights kneeling to promise to serve their king|witnesses promising in court to tell the truth|rude words not to be used in front of children|swear means to make a solemn promise, or to use rude words; pretend means to act as if something is true|swear 是郑重发誓或说脏话；pretend 是假装|cope means to deal with something hard, not to promise or to use rude words|cope 是应对难事，不是发誓或说脏话|pretend means to act as if something is true, not to make a solemn promise or use rude words|pretend 是假装，不是郑重发誓或说脏话|swear|the ear, said like *air*|ear 读作 air
      pretend|a boy acting asleep when his mum comes in|children playing that the floor is lava|someone acting as if they did not see a friend|pretend means to act as if something is true when it is not; swear means to promise solemnly|pretend 是假装；swear 是郑重发誓|swap means to exchange, not to act as if you are asleep or did not see someone|swap 是交换，不是装睡或装没看见|cope means to deal with something hard and needs with, not to act out something untrue|cope 是应对难事，要接 with，不是假装|pre · tend|pre- plus tend|pre- 加 tend
      swap|two people changing seats so one sits by the window|boys trading football cards|an apple traded for a banana|swap means to exchange one thing for another; pretend means to act as if something is true|swap 是交换；pretend 是假装|pretend means to act as if something is true, not to exchange seats, cards or fruit|pretend 是假装，不是交换座位、卡片或水果|tempt means to make someone want to do something wrong, not to exchange things|tempt 是诱惑，不是交换东西|swap|spelt with a but said like *swop*|拼作 a，读音像 *swop*
      cope|nurses dealing with long hours and very sick patients|a parent dealing with three children and a full-time job|an old bridge struggling with heavy trucks|cope with means to deal with something hard; venture means to go somewhere risky|cope with 是应对难事；venture 是冒险前往|venture means to go somewhere risky, and it is not used with with|venture 是冒险前往，不和 with 连用|pretend means to act as if something is true, and it is not used with with|pretend 是假装，不和 with 连用|cope|the long o and the silent e|长音 o，结尾 e 不发音
      burden|a donkey staggering under firewood|a daughter caring for her sick father alone|a new tax that weighs on poor families|a burden is a heavy load, duty or worry; a pledge is a promise|burden 是沉重的负担、责任或忧虑；pledge 是承诺|a pledge is a promise, not a heavy load or a weight on someone|pledge 是承诺，不是重担或压在人身上的分量|an impulse is a sudden urge, not a load to carry or a worry that weighs on you|impulse 是突然的冲动，不是要背的重物或压在心头的忧虑|bur · den|the -den ending|结尾是 -den
    `,
  },
);

/** batchesH are the batches of fear, shame, pity, anger, raids, slips, splendor and daring. */
export const batchesH: readonly BatchSpec[] = [fear, shame, pity, anger, raids, slips, splendor, daring];
