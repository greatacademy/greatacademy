// Grade 11: the batches of words of attack and defense, of fakes and lies, of arrest and mercy, of mockery, of decline
// and prevailing, of the senses, of truth and denial, of energy and inertia, of money and greed, of praise and blame,
// of awkward fixes and of hard and costly tasks.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const attack = batch(
  "words-of-attack-and-defense",
  ["Words of Attack and Defense", "进攻与防御的词"],
  ["assaults, walls, revenge and destruction", "攻击、壁垒、报复与毁灭"],
  `
  assail|to attack violently; to criticize strongly|猛烈攻击；抨击|Critics were quick to ___ the new law, attacking it fiercely in every newspaper.|Enemy troops began to ___ the fort from all sides at dawn, firing arrows over the walls.|Doubts began to ___ her as the exam drew near, attacking her confidence every night.|oust,retaliate|assailed,assailant
  barrage|a heavy, continuous attack of guns; a great number of questions or complaints|弹幕；连珠炮|The army opened a ___ of gunfire that went on all night.|The minister faced a ___ of questions from reporters as soon as she stepped outside.|A ___ of complaints poured in after the show, hundreds in the first hour.|barricade,snare|barrages
  barricade|a barrier put up to block a road or entrance; to block|路障；设障阻挡|Protesters built a ___ of cars and old furniture across the street to stop the police.|Police put up a ___ to block the road while the bomb was made safe.|The rebels hid behind a ___ of sandbags piled across the entrance.|barrage,snare|barricaded,barricades
  fortify|to strengthen against attack; to make stronger|设防；加强|The king ordered his men to ___ the castle, adding thicker walls and taller towers.|To ___ the town against attack, the people built a high stone wall around it.|She drank hot soup to ___ herself against the bitter cold.|subdue,raze|fortified,fortification
  subdue|to overcome and bring under control|制服；抑制|It took three police officers to ___ the angry man and put handcuffs on him.|The army moved in to ___ the rebels and bring the region back under control.|Firefighters worked all night to ___ the flames.|retaliate,avenge|subdued
  retaliate|to make an attack in return|报复|When the other player fouled him, he did not ___; he just walked away.|If one country raises taxes on imports, the other is likely to ___ with taxes of its own.|The army will ___ against any attack on its bases.|avenge,subdue|retaliated,retaliation
  avenge|to inflict harm in return for a wrong|为…报仇|He swore to ___ his father's death by hunting down the killer.|The hero set out to ___ the wrong done to his village.|She wanted to ___ her brother, who had been cheated out of his farm.|retaliate,raze|avenged,avenger
  oust|to drive out from a position|驱逐，罢免|The members voted to ___ the club's president and choose a new one.|The generals tried to ___ the king from power and rule the country themselves.|A younger player may soon ___ him from his place in the team.|assail,ravage|ousted
  raze|to completely destroy a building or town|夷为平地|The invaders set out to ___ the city, leaving not a single building standing.|The council plans to ___ the old factory to the ground and build homes there.|The fire threatened to ___ the whole village, burning every house to ashes.|fortify,avenge|razed
  ravage|to cause severe damage to|毁坏，破坏|The storm will ___ the coast, tearing roofs off houses and flooding farms.|Years of war continued to ___ the country, ruining its farms and towns.|A disease began to ___ the forest, killing tree after tree.|avenge,fortify|ravaged
  `,
  "context-clues",
  {
    intro: t(
      "When the enemy began to **assail** the town with a **barrage** of arrows, the people hurried to **fortify** the walls and build a **barricade** at the gate. These ten words help you talk about attacks, defence, striking back, driving people out and destruction.",
      "敌军用一阵密集的（**barrage**）箭雨猛攻（**assail**）小镇时，居民们赶紧加固（**fortify**）城墙，并在城门口筑起路障（**barricade**）。这十个词帮你谈论进攻、防御、反击、驱逐和毁灭。",
    ),
    watchOut: {
      meanings: t(
        "To **raze** a town is to destroy it completely, leaving nothing standing, while to **ravage** it is to damage it badly; a storm ravages, but an army razes a city to the ground.",
        "**raze** 是彻底夷平、片瓦不留；**ravage** 是严重破坏；风暴 ravage 海岸，军队则 raze a city to the ground。",
      ),
      use: t(
        "You **avenge** a wrong or a person, as in avenge his father's death, but you **retaliate** against an attack without an object straight after the verb.",
        "**avenge** 后直接接冤屈或人，如 avenge his father's death；**retaliate** 后不直接接宾语，要说 retaliate against an attack。",
      ),
      spelling: t(
        "**Barricade** has a double r and ends in -ade, **barrage** has a double r and ends in -age, and **assail** has a double s.",
        "**barricade** 双写 r，结尾是 -ade；**barrage** 双写 r，结尾是 -age；**assail** 双写 s。",
      ),
    },
    notes: `
      assail|critics attacking a new law in every newspaper|enemy troops attacking a fort from all sides|doubts attacking a student's confidence before an exam|assail means to attack violently or criticize strongly; oust means to drive someone out of a position|assail 是猛攻或痛斥；oust 是驱逐|oust means to force someone out of a job or position, not to attack a law, a fort or someone's confidence|oust 是把人赶下台，不是攻击法律、堡垒或信心|retaliate means to strike back, and it takes no direct object, so it cannot attack a law or a fort|retaliate 是反击，不直接接宾语，不能用来攻击法律或堡垒|as · sail|the double s and the -ail ending|双写 s，结尾是 -ail
      barrage|gunfire that goes on all night|a flood of questions from reporters|hundreds of complaints in the first hour|a barrage is a heavy, continuous attack or a great flood of questions; a barricade is a barrier that blocks the way|barrage 是密集炮火或连珠炮似的问题；barricade 是路障|a barricade is a barrier blocking a road, not a heavy stream of gunfire or questions|barricade 是堵路的障碍物，不是密集的炮火或提问|a snare is a trap for catching animals, not a heavy stream of fire or questions|snare 是捕兽的陷阱，不是密集的炮火或提问|bar · rage|the double r and the -age ending|双写 r，结尾是 -age
      barricade|cars and old furniture piled across a street|a barrier blocking a road near a bomb|sandbags piled across an entrance|a barricade is a barrier put up to block the way; a barrage is a heavy, continuous attack|barricade 是路障；barrage 是密集的攻击|a barrage is a heavy stream of gunfire or questions, not a barrier built across a street|barrage 是密集的炮火或提问，不是横在街上的障碍物|a snare is a small trap for animals, not a barrier that blocks a road or entrance|snare 是捕兽的小陷阱，不是堵住道路或入口的障碍物|bar · ri · cade|the double r and the -ade ending|双写 r，结尾是 -ade
      fortify|a king adding thicker walls and taller towers to a castle|townspeople building a stone wall against attack|hot soup making someone strong against the cold|fortify means to strengthen against attack; subdue means to overcome and bring under control|fortify 是加固；subdue 是制服|subdue means to overcome and control someone, not to make walls or a body stronger|subdue 是制服、控制，不是加固城墙或增强体力|raze means to destroy a building or town completely, the opposite of making it stronger|raze 是彻底摧毁，和加固正好相反|for · ti · fy|the -ify ending|结尾是 -ify
      subdue|three officers holding down an angry man and handcuffing him|an army bringing rebels back under control|firefighters bringing flames under control|subdue means to overcome and bring under control; retaliate means to strike back|subdue 是制服；retaliate 是反击|retaliate means to strike back after being attacked, and it takes no object such as a man, rebels or flames|retaliate 是遭到攻击后反击，后面不直接接人、叛军或火焰|avenge means to pay back a wrong, not to bring a person or a fire under control|avenge 是报仇，不是制服某人或控制火势|sub · due|the -due ending, as in *due*|结尾 -due，同 *due*
      retaliate|a player who does not hit back after a foul|a country answering a tax with taxes of its own|an army striking back against any attack|retaliate means to strike back after an attack; avenge means to punish someone for a wrong done|retaliate 是反击；avenge 是报仇|avenge needs the wrong or the person straight after it, so it cannot stand alone after did not or likely to|avenge 后要直接接冤屈或人，不能单独用在 did not 或 likely to 后面|subdue means to bring someone under control, and it needs an object, so it cannot stand alone|subdue 是制服，必须接宾语，不能单独使用|re · tal · i · ate|the -iate ending|结尾是 -iate
      avenge|a son hunting down his father's killer|a hero paying back a wrong done to his village|a sister paying back those who cheated her brother|avenge means to punish someone in return for a wrong; retaliate means to strike back at once|avenge 是报仇雪恨；retaliate 是还击|retaliate means to strike back, and it takes against, not a death or a wrong straight after it|retaliate 是还击，后接 against，不直接接死亡或冤屈|raze means to destroy a building or town completely, not to pay back a wrong|raze 是彻底摧毁建筑或城镇，不是报仇|a · venge|the soft g and the silent e|g 发软音，结尾 e 不发音
      oust|club members voting out their president|generals forcing a king from power|a younger player taking someone's place in a team|oust means to drive someone out of a position; assail means to attack|oust 是驱逐、罢免；assail 是攻击|assail means to attack violently, not to force someone out of a job or position|assail 是猛攻，不是把人赶出职位|ravage means to cause severe damage to a place, not to force a person out of a position|ravage 是严重破坏某地，不是把人赶下台|oust|the ou, as in *out*|ou 读音同 *out*
      raze|invaders leaving not one building standing|a council knocking an old factory to the ground|a fire threatening to burn every house to ashes|raze means to destroy completely, leaving nothing standing; fortify means to make stronger|raze 是彻底摧毁；fortify 是加固|fortify means to make a place stronger against attack, the opposite of destroying it completely|fortify 是加固，和彻底摧毁正好相反|avenge means to pay back a wrong, not to knock buildings to the ground|avenge 是报仇，不是把建筑夷为平地|raze|the long a and the silent e|长音 a，结尾 e 不发音
      ravage|a storm tearing off roofs and flooding farms|years of war ruining a country's farms and towns|a disease killing tree after tree|ravage means to cause severe damage; raze means to destroy completely, leaving nothing|ravage 是严重破坏；raze 是夷为平地|avenge means to pay back a wrong, not to damage a coast or a forest|avenge 是报仇，不是破坏海岸或森林|fortify means to make stronger, the opposite of causing severe damage|fortify 是加固，和严重破坏正好相反|rav · age|the -age ending that sounds like *ij*|-age 结尾读作 *ij*
    `,
  },
);

const fakes = batch(
  "words-of-fakes-and-lies",
  ["Words of Fakes and Lies", "伪造与谎言的词"],
  ["false things, pretending and traps", "假货、假装与圈套"],
  `
  counterfeit|made in exact imitation of something valuable in order to deceive|伪造的；假冒品|The police found a box of ___ banknotes, printed so well that shops had taken them as real.|Customs officers seized thousands of ___ watches, cheap copies bearing a famous brand name.|Selling ___ medicine, made to look exactly like the real brand, can kill people.|covert,apocryphal|counterfeiter
  fabricate|to invent in order to deceive; to make or build|捏造；制造|The officer was sacked for trying to ___ evidence, inventing a fingerprint report that never existed.|The witnesses admitted they had helped ___ the whole story, making up every detail to protect a friend.|The factory can ___ steel parts to any design, cutting and welding them in a day.|feign,insinuate|fabricated,fabrication
  feign|to pretend to be affected by a feeling or illness|假装|To miss the test, he decided to ___ a headache, groaning and holding his head though he felt fine.|Too proud to show how hurt she was, she tried to ___ indifference, shrugging and smiling.|The bird will ___ a broken wing, dragging it along the ground to lead foxes away from its nest.|fabricate,delude|feigned
  hoax|a trick or deception|骗局，恶作剧|The bomb threat turned out to be a ___; a bored teenager had phoned it in as a joke.|The famous photo of the lake monster was a ___: years later the man who took it admitted he had used a toy.|Thousands fell for the ___, sharing the made-up news of a free concert, though the prank cost no one a penny and hid no other aim.|pretext,swindle|hoaxes
  swindle|to cheat someone out of money; a scheme to cheat|诈骗|The gang used fake phone calls from "the bank" to ___ old people out of their savings.|He tried to ___ investors out of millions by selling shares in a gold mine that did not exist.|Dishonest taxi drivers ___ tourists out of their money by charging ten times the real fare.|delude,insinuate|swindled,swindler
  delude|to make someone believe something false|欺骗，迷惑|Don't ___ yourself that the exam will be easy; you have not opened a book all term.|The leader tried to ___ the voters into believing the war was already won.|We only ___ ourselves if we insist the river is clean while the fish in it are dying.|feign,disabuse|deluded,delusion
  covert|not openly acknowledged; secret|秘密的，隐蔽的|The spy ran the ___ operation so secretly that even the minister did not know of it.|She shot him one ___ glance across the table, careful that no one else noticed.|The army kept its ___ plan hidden from everyone until the night of the attack.|counterfeit,apparent|covertly
  insinuate|to suggest something bad in an indirect way|暗示，含沙射影地说|Are you trying to ___ that I lied? Then say it plainly instead of dropping hints.|Without ever saying it outright, the article seems to ___ that the mayor took bribes.|He would smile and ___ that she had cheated, dropping sly hints rather than making a charge.|aver,impugn|insinuated,insinuation
  pretext|a false reason given to hide the real one|借口|He called round on the ___ of borrowing a book, but really he wanted to see her sister.|The government used the riot as a ___ to close the border, which it had wanted to do for years anyway.|Under the ___ of checking the gas meter, the thief talked his way into the flat.|hoax,snare|pretexts
  snare|a trap for catching animals; to catch in a trap|陷阱；诱捕|The hunter set a ___ of thin wire on the path to catch rabbits.|The fox's leg was caught in a ___ hidden in the long grass.|Easy money is often a ___ that traps the greedy and holds them fast.|barricade,pretext|snared
  `,
  "context-clues",
  {
    intro: t(
      "The gang sold **counterfeit** watches, used the **pretext** of a charity to knock on doors, and tried to **swindle** old people out of their savings. These ten words help you talk about fakes, pretending, false reasons, tricks and traps.",
      "这伙人卖假冒的（**counterfeit**）手表，以慈善为借口（**pretext**）挨家敲门，还想骗走（**swindle**）老人的积蓄。这十个词帮你谈论假货、假装、借口、骗局和圈套。",
    ),
    watchOut: {
      meanings: t(
        "A **hoax** is a trick played to fool people, often as a joke, while a **pretext** is a false reason given to hide your real one; a hoax fools for its own sake, a pretext covers another aim.",
        "**hoax** 是愚弄人的骗局或恶作剧；**pretext** 是用来掩盖真实目的的借口；hoax 本身就是骗人，pretext 是为了掩护别的目的。",
      ),
      use: t(
        "You **insinuate** that something is true by hinting, but you **feign** a feeling or an illness by acting it out: insinuate that he lied, feign a headache.",
        "**insinuate** 后接 that 从句，表示暗示；**feign** 后接感情或疾病，表示假装：insinuate that he lied，feign a headache。",
      ),
      spelling: t(
        "**Feign** has a silent g after ei, as in *reign*, and **counterfeit** ends in -feit, not -fiet.",
        "**feign** 在 ei 后有不发音的 g，同 *reign*；**counterfeit** 结尾是 -feit，不是 -fiet。",
      ),
    },
    notes: `
      counterfeit|banknotes printed so well that shops took them as real|cheap copies bearing a famous brand name|medicine made to look exactly like the real brand|counterfeit means made as an exact copy in order to deceive; covert means secret and hidden|counterfeit 是仿造来骗人的；covert 是秘密的|covert means secret, not copied to pass as real, so it does not describe fake banknotes, watches or medicine|covert 是秘密的，不是仿冒的，不能形容假钞、假表或假药|apocryphal describes a story that is probably untrue, not a copied object such as money, a watch or medicine|apocryphal 形容可能不真实的传说，不能形容钞票、手表或药品这类仿制品|coun · ter · feit|the -feit ending|结尾是 -feit
      fabricate|an officer inventing a fingerprint report|witnesses making up every detail of a story|a factory cutting and welding steel parts|fabricate means to invent something false, or to make or build something; feign means to pretend to have a feeling|fabricate 是捏造或制造；feign 是假装有某种感受|feign means to pretend to have a feeling or illness, not to invent evidence, a story or steel parts|feign 是假装有某种感受或病，不是捏造证据、编故事或制造钢件|insinuate means to hint at something bad, not to invent evidence, make up a story or build parts|insinuate 是暗示坏事，不是捏造证据、编故事或制造零件|fab · ri · cate|the -cate ending|结尾是 -cate
      feign|a boy groaning and holding his head though he felt fine|a hurt girl shrugging and smiling|a bird dragging a wing as if it were broken|feign means to pretend to have a feeling or illness; fabricate means to invent a false story|feign 是假装；fabricate 是捏造|fabricate means to invent evidence or a story, not to act out a headache, indifference or a broken wing|fabricate 是捏造证据或故事，不是装出头痛、冷漠或断翅|delude means to make someone believe something false, and it needs a person after it, not a headache or a wing|delude 是蒙骗某人，后面接人，不接头痛或翅膀|feign|the silent g, as in *reign*|g 不发音，同 *reign*
      hoax|a teenager phoning in a bomb threat as a joke|a man faking a monster photo with a toy|a made-up free concert shared as a prank|a hoax is a trick to fool people, often a joke; a pretext is a false reason that hides a real aim|hoax 是骗局、恶作剧；pretext 是掩盖真实目的的借口|a pretext is a false reason hiding a real aim, but these tricks were jokes with no other aim|pretext 是掩盖真实目的的借口，而这些恶作剧并没有别的目的|a swindle is a scheme to cheat people out of money, but none of these jokes took anyone's money|swindle 是骗钱的勾当，而这些恶作剧没骗走任何人的钱|hoax|the oa, as in *coat*|oa 读音同 *coat*
      swindle|fake bank calls taking old people's savings|shares sold in a gold mine that did not exist|taxi drivers charging ten times the real fare|swindle means to cheat someone out of money; delude means to make someone believe something false|swindle 是诈骗钱财；delude 是蒙骗|delude means to fool someone into a false belief, and it does not go with out of their savings or their money|delude 是让人信以为真，不和 out of their savings 或 out of their money 连用|insinuate means to hint at something bad, and it cannot take people followed by out of their money|insinuate 是暗示坏事，后面不能接人再接 out of their money|swin · dle|the -dle ending|结尾是 -dle
      delude|a student telling herself an unread exam will be easy|a leader making voters believe a war was won|people insisting a dying river is clean|delude means to make someone, often yourself, believe something false; feign means to pretend to have a feeling|delude 是蒙骗，常指自欺；feign 是假装|feign means to pretend to have a feeling, and it takes a feeling, not yourself, voters or ourselves|feign 后接假装出的感受，不接 yourself、选民或 ourselves|disabuse means to free someone from a false belief, the opposite of making them believe it, and it needs of|disabuse 是让人摆脱错误想法，和蒙骗相反，而且要接 of|de · lude|the -lude ending|结尾是 -lude
      covert|a spy operation hidden even from the minister|a glance that no one else noticed|an army plan kept hidden until the attack|covert means secret and hidden; counterfeit means copied in order to deceive|covert 是秘密的；counterfeit 是仿冒的|counterfeit means a fake copy of something real, not a secret operation, glance or plan|counterfeit 是假冒品，不是秘密的行动、目光或计划|apparent means easy to see, the opposite of something no one is meant to notice|apparent 是显而易见的，和不让人察觉正好相反|co · vert|the co- start and the -vert ending|开头 co-，结尾 -vert
      insinuate|a speaker dropping hints instead of saying it plainly|an article suggesting bribery without saying it outright|a man dropping sly hints rather than making a charge|insinuate means to hint at something bad indirectly; aver means to state something firmly and directly|insinuate 是含沙射影；aver 是明确断言|aver means to state something plainly and firmly, the opposite of hinting without saying it outright|aver 是直截了当地断言，和暗示正好相反|impugn means to challenge someone's honesty, and it takes a noun such as his motives, not a that clause|impugn 是质疑诚信，后接名词如 his motives，不接 that 从句|in · sin · u · ate|the -uate ending|结尾是 -uate
      pretext|borrowing a book as the excuse for a visit|a riot used as the reason to close a border|checking the gas meter as a cover for theft|a pretext is a false reason that hides the real one; a hoax is a trick to fool people|pretext 是借口；hoax 是骗局|a hoax is a trick or a joke, not the false reason a person gives for a visit, a border closing or getting into a flat|hoax 是骗局或恶作剧，不是来访、封锁边境或进门的借口|a snare is a trap that catches animals, not a false reason given for an action|snare 是捕兽的陷阱，不是给某个行为找的借口|pre · text|the pre- start and the word *text*|开头 pre-，后面是 *text*
      snare|thin wire set on a path to catch rabbits|a fox's leg caught in the grass|easy money that traps the greedy|a snare is a trap for catching animals; a barricade is a barrier that blocks the way|snare 是陷阱；barricade 是路障|a barricade blocks a road but does not catch and hold an animal or a person|barricade 是堵路的障碍，不会把动物或人抓住困住|a pretext is a false reason, not a wire trap that catches an animal|pretext 是借口，不是捕捉动物的绳套|snare|the -are ending, as in *care*|结尾 -are，同 *care*
    `,
  },
);

const arrest = batch(
  "words-of-arrest-and-mercy",
  ["Words of Arrest and Mercy", "逮捕与宽恕的词"],
  ["catching, questioning, sentencing and pardoning", "抓捕、审讯、判决与宽恕"],
  `
  accomplice|a person who helps another commit a crime|共犯|The robber's ___, who had planned the raid with him, waited in the car with the engine running.|Police believe the thief had help from a bank clerk, his ___, who left the back door open on purpose.|Charged with knowingly helping the killer escape, she was tried as the man's ___.|convict,dupe|accomplices
  apprehend|to arrest; to understand|逮捕；领会|Police managed to ___ the thief at the airport, grabbing him just as he reached the plane.|Officers chased the robber for a mile before they could ___ him and put him in the van.|The guards failed to ___ the prisoner who escaped, and he is still on the run.|convict,confiscate|apprehended,apprehension
  convict|to declare someone guilty; a person in prison|判…有罪；囚犯|After two days the jury voted to ___ him of murder, and the judge sent him to prison for life.|The court needs proof beyond doubt to ___ someone of a crime and send them to jail.|Once the jury finds them guilty, the court will ___ the men of fraud and fix their sentence.|exculpate,apprehend|convicted
  detain|to keep someone in custody; to delay|拘留；耽搁|Police may ___ a suspect in a cell for up to a day before charging him.|Border guards will ___ any traveller without a passport, locking them in a room until officials arrive.|The soldiers decided to ___ the reporters at the camp overnight and free them in the morning.|confiscate,exempt|detained,detention,detainee
  interrogate|to question closely, often aggressively|审问|Detectives spent six hours trying to ___ the suspect, firing question after question at him.|In court the lawyers will ___ the witness closely, asking about every minute of that night.|The officer began to ___ the prisoner about where the guns were hidden.|detain,attest|interrogated,interrogation
  confiscate|to take away someone's property with authority|没收|The teacher will ___ any phone she sees in class and keep it in her desk until the end of the day.|Customs officers have the power to ___ fake goods at the border and burn them.|The court ordered the police to ___ the gang's cars and houses, which had been bought with stolen money.|detain,exempt|confiscated,confiscation
  attest|to provide or serve as clear evidence of|证明，证实|Her many medals ___ to her courage in battle.|The neat rows of healthy crops ___ to the farmer's hard work.|Ruins scattered across the hills still ___ to the power of the old empire.|aver,impugn|attested
  clemency|mercy, especially in punishing|宽恕，仁慈|The prisoner begged the king for ___, and his life was spared.|The judge showed ___, giving the young thief a light sentence instead of prison.|The president has the power to grant ___ to people sentenced to death.|largesse,approbation|
  lenient|more merciful or tolerant than expected|宽大的|The judge was ___ with the boy, letting him off with a warning instead of a fine.|Some parents are too ___ with their children, never punishing them whatever they do.|The new head teacher is less ___ than the old one, and pupils who are late now stay after school.|obtuse,laudatory|leniency
  exempt|free from a duty or payment; to free from|免除的；豁免|Children under five are ___ from the entry fee and get in free.|Because of his bad back, he was ___ from sports lessons all year.|Food is ___ from the tax, so its price stays the same.|lenient,impecunious|
  `,
  "context-clues",
  {
    intro: t(
      "The police set out to **apprehend** the thief and his **accomplice**, **detain** them overnight and **confiscate** the stolen jewels. These ten words help you talk about catching, questioning, judging and showing mercy.",
      "警方要逮捕（**apprehend**）小偷和他的同伙（**accomplice**），把他们拘留（**detain**）一夜，并没收（**confiscate**）被盗的珠宝。这十个词帮你谈论抓捕、审问、定罪和宽恕。",
    ),
    watchOut: {
      meanings: t(
        "To **detain** someone is to keep them in a place, while to **confiscate** something is to take it away by authority; you detain people but confiscate their phones and cars.",
        "**detain** 是扣留人；**confiscate** 是依法没收东西；扣留的是人，没收的是手机、汽车等财物。",
      ),
      use: t(
        "You **convict** someone of a crime, but things **attest** to a quality, and a person is **exempt** from a fee or a duty.",
        "**convict** 某人 of 某罪；某物 **attest** to 某种品质；某人 **exempt** from 费用或义务。",
      ),
      spelling: t(
        "**Clemency** ends in -ency, **lenient** ends in -ient, and **accomplice** ends in -ice, not -iss.",
        "**clemency** 结尾是 -ency；**lenient** 结尾是 -ient；**accomplice** 结尾是 -ice，不是 -iss。",
      ),
    },
    notes: `
      accomplice|a partner who planned the raid and waited in the car|a bank clerk who left the door open on purpose|a woman tried for knowingly helping a killer|an accomplice is a person who knowingly helps someone commit a crime; a convict is a person in prison for a crime|accomplice 是同谋；convict 是服刑的犯人|a convict is a person already in prison, not a partner waiting in a car, leaving a door open or helping a killer escape|convict 是已在服刑的犯人，不是在车里等候、故意开门或帮凶手逃跑的人|a dupe is fooled into helping without knowing, but these helpers planned and acted on purpose|dupe 是不知情被利用的人，而这些人是有意参与的|ac · com · plice|the double c and the -ice ending|双写 c，结尾是 -ice
      apprehend|police grabbing a thief at an airport|officers catching a robber after a chase|guards failing to catch an escaped prisoner|apprehend means to arrest or catch; convict means to declare someone guilty in court|apprehend 是逮捕；convict 是判定有罪|convict means to find someone guilty in court, not to grab a thief at an airport or catch a runaway|convict 是法庭定罪，不是在机场抓人或追捕逃犯|confiscate means to take away property, not to catch a person|confiscate 是没收财物，不是抓人|ap · pre · hend|the double p and the -hend ending|双写 p，结尾是 -hend
      convict|a jury finding a man guilty of murder|proof beyond doubt before jail|a court finding men guilty of fraud|convict means to declare someone guilty of a crime; exculpate means to show someone is not guilty|convict 是定罪；exculpate 是证明无罪|exculpate means to clear someone of blame, the opposite of finding them guilty and sending them to prison|exculpate 是证明无罪，和定罪入狱正好相反|apprehend means to catch someone, and it does not go with of murder or of a crime|apprehend 是抓捕，不和 of murder 或 of a crime 连用|con · vict|the stress on the second part for the verb|作动词时重音在后
      detain|a suspect held in a cell for a day|a traveller without a passport locked in a room|reporters kept at a camp overnight|detain means to keep a person in a place; confiscate means to take away someone's property|detain 是扣留人；confiscate 是没收财物|confiscate is for taking things away, not for keeping a suspect, a traveller or reporters somewhere|confiscate 用于没收东西，不用于扣留嫌犯、旅客或记者|exempt describes someone freed from a duty, and as a verb it frees people rather than holding them|exempt 是免除义务，是放过人，不是扣留人|de · tain|the -ain ending, as in *rain*|结尾 -ain，同 *rain*
      interrogate|detectives firing questions for six hours|lawyers asking about every minute of a night|an officer asking where guns were hidden|interrogate means to question closely; detain means to keep someone in custody|interrogate 是审问；detain 是拘留|detain means to keep someone somewhere, not to fire questions at them or ask about every minute|detain 是扣留，不是连珠炮似地提问|attest means to serve as evidence of something, and it cannot take a suspect or a prisoner as its object|attest 是证明，不能以嫌犯或犯人作宾语|in · ter · ro · gate|the double r and the -gate ending|双写 r，结尾是 -gate
      confiscate|a teacher taking phones and keeping them in a desk|customs officers taking fake goods to burn|police taking a gang's cars and houses|confiscate means to take away property by authority; detain means to keep a person in custody|confiscate 是没收；detain 是拘留|detain is for keeping people in custody, not for taking phones, goods, cars or houses|detain 用于扣留人，不用于拿走手机、货物、汽车或房子|exempt means to free from a duty, not to take property away|exempt 是免除义务，不是拿走财物|con · fis · cate|the -cate ending|结尾是 -cate
      attest|medals showing a soldier's courage|healthy crops showing a farmer's hard work|ruins showing the power of an old empire|attest to means to be clear evidence of something; aver means for a person to state something firmly|attest to 是证明；aver 是断言|aver is something a person does when stating a fact, and it does not take to, so medals, crops and ruins cannot aver|aver 是人作出断言，不接 to，奖章、庄稼或废墟不能 aver|impugn means to challenge the truth of something, the opposite of being evidence for it, and it does not take to|impugn 是质疑，和证明相反，也不接 to|at · test|the double t|双写 t
      clemency|a prisoner whose life was spared by a king|a judge giving a light sentence instead of prison|a president's power over death sentences|clemency means mercy in punishing; largesse means generosity in giving money or gifts|clemency 是宽恕；largesse 是慷慨施舍|largesse is generous giving of money or gifts, not mercy that spares a life or lightens a sentence|largesse 是慷慨赠予钱财，不是饶命或减刑的宽恕|approbation is approval or praise, not mercy shown to a person being punished|approbation 是赞许，不是对受罚者的宽恕|clem · en · cy|the -ency ending|结尾是 -ency
      lenient|a judge letting a boy off with a warning|parents who never punish their children|a head teacher less ready to let late pupils off|lenient means more merciful or tolerant than expected; obtuse means slow to understand|lenient 是宽大的；obtuse 是迟钝的|obtuse means slow to understand, not merciful about punishing a boy, children or late pupils|obtuse 是理解迟钝，不是对惩罚宽大|laudatory means full of praise, and it describes words, not a person who lets wrongdoers off|laudatory 形容赞美的言辞，不形容放过犯错者的人|le · ni · ent|the -ient ending|结尾是 -ient
      exempt|children under five who get in free|a boy with a bad back excused from sport|food on which no tax is paid|exempt means free from a duty or payment; lenient means merciful when punishing|exempt 是被免除的；lenient 是宽大的|lenient describes a person who punishes gently, and it does not go with from a fee, a lesson or a tax|lenient 形容惩罚宽大的人，不和 from 费用、课程或税连用|impecunious means having no money, and it does not go with from, so it cannot mean freed from a fee or tax|impecunious 是没钱的，不和 from 连用，不能表示免除费用或税|ex · empt|the silent p before t|t 前的 p 几乎不发音
    `,
  },
);

const mockery = batch(
  "words-of-mockery-and-rebuke",
  ["Words of Mockery and Rebuke", "嘲笑与责备的词"],
  ["laughing at others, turning them away and telling them off", "嘲笑他人、拒人于外与训斥"],
  `
  scoff|to speak about something in a scornfully mocking way|嘲笑|Experts used to ___ at the idea of electric cars, laughing it off as a silly dream.|Don't ___ at her plan just because it sounds strange; it may work.|The crowd began to ___ at the tiny boat, jeering that it would never cross the sea.|gloat,shun|scoffed
  sneer|a scornful smile or remark; to make one|冷笑；嘲笑|The rich boy would ___ at the others' cheap shoes, curling his lip in contempt.|He tends to ___ at anyone who has not been to a famous university, with a scornful twist of the mouth.|The guards would ___ at the prisoners' requests, their lips curled in disgust.|gloat,spurn|sneered,sneering
  taunt|a remark made to anger or provoke; to make such remarks|嘲弄|The older boys would ___ him about his height, calling him names to make him cry.|Fans of the other team began to ___ the goalkeeper, chanting rude songs to rattle him.|She tried to ___ her brother into a fight by mocking his fear of the dark.|reproach,gloat|taunted,taunts
  gloat|to dwell on one's own success or another's misfortune with smug pleasure|幸灾乐祸，沾沾自喜|It is unkind to ___ over a rival's defeat, smirking at the pain of someone who has lost.|He couldn't help but ___ about his high marks, smugly pleased while his friend had failed.|The winners stayed behind to ___, telling the losers again and again how easily they had won.|sneer,spurn|gloated,gloating
  mock|to tease or laugh at in a scornful way; not authentic|嘲笑；模拟的|Cruel classmates would ___ her accent, copying the way she spoke and laughing.|Comedians love to ___ politicians, copying their voices and making fun of their speeches on TV.|The cartoon set out to ___ the king, drawing him as a fat, foolish baby.|gloat,shun|mocked,mockery
  scorn|the feeling that something is worthless; to reject with contempt|蔑视；鄙视|Serious scientists ___ the claim as nonsense, refusing even to discuss it.|Proud and stubborn, he would ___ any offer of help as beneath him.|Many critics ___ the novel as worthless when it first came out, though it is now a classic.|gloat,reprimand|scorned,scornful
  spurn|to reject with disdain|轻蔑地拒绝|She chose to ___ his offer of marriage, turning him down coldly.|Do not ___ the help of people who wish you well; you may need it one day.|The proud king would ___ every gift from his enemies, sending each one back unopened.|gloat,reprimand|spurned
  shun|to persistently avoid|避开，回避|After the scandal, the villagers began to ___ the family, crossing the street to avoid them.|She tends to ___ parties and stays at home with a book.|Most cats ___ water, keeping well away from the bath and the rain.|gloat,reprimand|shunned
  reproach|an expression of disapproval; to express disapproval to|责备|His mother did not shout but gently began to ___ him for forgetting his sister's birthday.|You cannot ___ yourself forever for one mistake made years ago.|The coach went on to ___ the players for their lazy defending, telling them how disappointed he was.|gloat,taunt|reproached
  reprimand|a formal expression of disapproval; to give one|训斥|The head teacher called him into her office to ___ him formally for cheating.|The army will ___ the soldier in writing for leaving his post.|The manager had to ___ the staff officially after the safety rules were broken.|taunt,gloat|reprimanded
  `,
  "context-clues",
  {
    intro: t(
      "The bullies would **taunt** the new boy and **mock** his accent, and when he won the race they could only **scoff** while he tried not to **gloat**. These ten words help you talk about mockery, contempt, avoiding people and telling them off.",
      "那些小霸王常嘲弄（**taunt**）新来的男孩，模仿（**mock**）他的口音；他赢了赛跑后，他们只能嗤之以鼻（**scoff**），而他努力不去幸灾乐祸地炫耀（**gloat**）。这十个词帮你谈论嘲笑、轻蔑、回避和训斥。",
    ),
    watchOut: {
      meanings: t(
        "To **spurn** something is to turn it down with contempt, while to **shun** someone is to keep avoiding them; you spurn an offer once, but you shun a person day after day.",
        "**spurn** 是轻蔑地拒绝；**shun** 是一直回避；spurn 一个提议，shun 一个人。",
      ),
      use: t(
        "You **scoff** at or **sneer** at something, you **gloat** over or about your success, but you **taunt** and **mock** someone with no word between.",
        "**scoff** 和 **sneer** 后接 at；**gloat** 后接 over 或 about；**taunt** 和 **mock** 直接接人。",
      ),
      spelling: t(
        "**Reprimand** ends in -mand, as in *command*, **reproach** ends in -oach, as in *coach*, and **gloat** has oa, as in *boat*.",
        "**reprimand** 结尾 -mand，同 *command*；**reproach** 结尾 -oach，同 *coach*；**gloat** 中是 oa，同 *boat*。",
      ),
    },
    notes: `
      scoff|experts laughing off electric cars as a silly dream|a strange plan dismissed too quickly|a crowd jeering at a tiny boat|scoff means to mock something as foolish; gloat means to take smug pleasure in your success|scoff 是嗤之以鼻；gloat 是得意洋洋|gloat means to take smug pleasure in your own success or another's failure, not to laugh off an idea, a plan or a boat|gloat 是幸灾乐祸或自鸣得意，不是嘲笑某个想法、计划或小船|shun means to keep avoiding someone, and it does not take at|shun 是回避，不接 at|scoff|the double f|双写 f
      sneer|a rich boy curling his lip at cheap shoes|a scornful twist of the mouth at other people|guards with lips curled at prisoners' requests|sneer means to show contempt with a curled lip or a scornful remark; gloat means to take smug pleasure in success|sneer 是冷笑、讥讽；gloat 是得意洋洋|gloat means to delight in a win or a loss, and it takes over or about, not at shoes, people or requests|gloat 是对胜负沾沾自喜，接 over 或 about，不接 at|spurn means to turn something down, and it does not take at|spurn 是拒绝，不接 at|sneer|the ee, as in *seen*|ee 读音同 *seen*
      taunt|older boys calling a boy names to make him cry|fans chanting rude songs at a goalkeeper|mocking a brother into a fight|taunt means to provoke someone with cruel remarks; reproach means to express disapproval to someone|taunt 是挑衅、嘲弄；reproach 是责备|reproach means to tell someone you are disappointed in them, not to call them names or chant to provoke them|reproach 是表达失望和责备，不是骂人或起哄挑衅|gloat means to take smug pleasure in success, and it takes no person after it|gloat 是得意洋洋，后面不直接接人|taunt|the au, as in *haunt*|au 读音同 *haunt*
      gloat|smirking at a rival's defeat|smugly pleased with high marks while a friend failed|winners repeating how easily they won|gloat means to take smug pleasure in your success or another's failure; sneer means to show contempt with a curled lip|gloat 是得意洋洋；sneer 是冷笑|sneer means to show contempt for someone, not smug pleasure over a defeat or about your own marks|sneer 是蔑视别人，不是为对手失败或自己成绩而自鸣得意|spurn means to turn down an offer, not to take pleasure in winning|spurn 是拒绝提议，不是为胜利得意|gloat|the oa, as in *boat*|oa 读音同 *boat*
      mock|classmates copying a girl's accent and laughing|comedians copying politicians' voices on TV|a cartoon drawing a king as a foolish baby|mock means to make fun of someone, often by copying them; gloat means to take smug pleasure in success|mock 是嘲笑、模仿取笑；gloat 是得意洋洋|gloat takes no person after it and is about delighting in success, not copying an accent or a voice|gloat 不直接接人，是对成功的得意，不是模仿口音或声音|shun means to avoid someone, not to copy or make fun of them|shun 是回避某人，不是模仿取笑|mock|the -ck ending|结尾是 -ck
      scorn|scientists refusing even to discuss a claim|a proud man treating help as beneath him|critics calling a novel worthless|scorn means to treat something as worthless and reject it; gloat means to take smug pleasure in success|scorn 是蔑视；gloat 是得意洋洋|gloat takes over or about and is about delight in success, not treating a claim, an offer or a novel as worthless|gloat 接 over 或 about，是得意，不是视主张、提议或小说为无用|reprimand means to tell off a person formally, not to treat a claim, an offer or a book as worthless|reprimand 是正式训斥人，不是看不起主张、提议或书|scorn|the -orn ending, as in *born*|结尾 -orn，同 *born*
      spurn|a woman coldly turning down a marriage offer|refusing the help of people who wish you well|a king sending gifts back unopened|spurn means to reject with contempt; gloat means to take smug pleasure in success|spurn 是轻蔑地拒绝；gloat 是得意洋洋|gloat is about delight in winning and takes no object, so it cannot turn down an offer, help or a gift|gloat 是得意，不接宾语，不能拒绝提议、帮助或礼物|reprimand means to tell off a person, not to refuse an offer, help or a gift|reprimand 是训斥人，不是拒绝提议、帮助或礼物|spurn|the -urn ending, as in *burn*|结尾 -urn，同 *burn*
      shun|villagers crossing the street to avoid a family|a girl who stays at home instead of going to parties|cats keeping away from water|shun means to keep avoiding someone or something; gloat means to take smug pleasure in success|shun 是回避；gloat 是得意洋洋|gloat takes no object and means delight in success, not keeping away from a family, parties or water|gloat 不接宾语，是得意，不是远离一家人、聚会或水|reprimand means to tell someone off, which needs speaking to them, not keeping away from them|reprimand 是训斥，要当面说，不是躲开|shun|the u, as in *sun*|u 读音同 *sun*
      reproach|a mother gently telling off her son for a forgotten birthday|blaming yourself for an old mistake|a coach telling players he is disappointed|reproach means to express disappointment or disapproval to someone; taunt means to provoke someone with cruel remarks|reproach 是责备；taunt 是挑衅、嘲弄|gloat takes no person after it, so it cannot be done to a son, yourself or players|gloat 不直接接人，不能用于儿子、自己或球员|taunt means to provoke someone cruelly, not to gently or sadly show disappointment|taunt 是恶意挑衅，不是温和或失望地责备|re · proach|the -oach ending, as in *coach*|结尾 -oach，同 *coach*
      reprimand|a head teacher formally telling off a cheat|an army warning a soldier in writing|a manager officially telling off staff|reprimand means to tell someone off formally, as a person in charge; taunt means to provoke someone with cruel remarks|reprimand 是正式训斥；taunt 是挑衅|taunt means to provoke someone with cruel jokes, not to give a formal, written or official warning|taunt 是恶意嘲弄，不是正式、书面或官方的警告|gloat takes no person after it and means delight in success, not a formal warning|gloat 不直接接人，是得意，不是正式警告|rep · ri · mand|the -mand ending, as in *command*|结尾 -mand，同 *command*
    `,
  },
);

const decline = batch(
  "words-of-decline-and-prevailing",
  ["Words of Decline and Prevailing", "衰退与胜出的词"],
  ["things that shrink and fade, give in, and win out", "缩小、消退、屈服与胜出之物"],
  `
  deteriorate|to become progressively worse|恶化|Left out in the rain for years, the old wooden house began to ___, its paint peeling and its roof rotting.|Without treatment, a simple cold can ___ into a serious chest illness.|Relations between the two countries continued to ___, going from cool to openly hostile.|dwindle,surpass|deteriorated,deterioration
  dwindle|to diminish gradually|逐渐减少|Our savings began to ___ as month after month we spent more than we earned.|Once there were thousands of tigers here, but their numbers continue to ___ year by year.|The crowd began to ___ from hundreds to a few dozen as the rain came down.|recede,teem|dwindled,dwindling
  wane|of the moon, to show less light; to decrease in strength|(月)亏；衰落|After the full moon, the moon begins to ___, showing a thinner slice of light each night.|His popularity began to ___ after the scandal, and fewer people came to his talks.|Her enthusiasm for the piano started to ___ when the lessons became hard.|prevail,teem|waned,waning
  recede|to go or move back; to become more distant|后退；减弱|When the tide began to ___, the boats were left lying on the wet sand.|As the train pulled away, the town seemed to ___ into the distance behind us.|Slowly the sound of the band began to ___ as it marched away down the road.|surpass,teem|receded
  subside|to become less intense or severe|减弱，平息|After an hour the storm began to ___, and the howling wind dropped to a gentle breeze.|Take the medicine, rest your ankle and wait for the swelling to ___.|Her anger slowly began to ___ once he said he was sorry.|surpass,teem|subsided
  succumb|to fail to resist pressure or temptation; to die from|屈服；死于|On a strict diet, she tried hard not to ___ to the chocolate cake on the table.|The old soldier was badly wounded and was expected to ___ to his injuries within hours.|The town had held out for months but had to ___ to the siege when the food ran out.|relent,prevail|succumbed
  relent|to abandon a harsh intention; to become less severe|变温和；减弱|The teacher refused at first but finally began to ___, softening her rule and letting us go home early.|Her parents would not ___ until she promised to be home by ten.|The rain did not ___ all day, falling just as hard at night as in the morning.|succumb,surpass|relented
  prevail|to prove more powerful; to be widespread|胜过；盛行|In the end, common sense will ___ and the foolish plan will be dropped.|After a long battle, the smaller army managed to ___ over the larger one.|Calm heads must ___ if we are to avoid a war.|surpass,succumb|prevailed,prevailing
  surpass|to exceed; to be greater or better than|超过|Her exam results ___ all expectations, beating even her teacher's highest hopes.|The new bridge will ___ the old one in length by half a mile.|He trained hard all winter to ___ his own record from last year.|prevail,teem|surpassed
  teem|to be full of or swarming with|充满|In spring the pond starts to ___ with frogs, thousands of them hopping in the reeds.|On market day the narrow streets ___ with buyers and sellers.|The old house seemed to ___ with mice, which ran out of every corner.|dwindle,surpass|teemed,teeming
  `,
  "context-clues",
  {
    intro: t(
      "As the floods began to **recede** and the storm to **subside**, the town's hopes, which had started to **dwindle**, rose again, and its people vowed that courage would **prevail**. These ten words help you talk about things getting worse or smaller, giving in, and winning through.",
      "随着洪水退去（**recede**）、风暴减弱（**subside**），镇上本已渐渐消退（**dwindle**）的希望又燃起，人们发誓勇气终将获胜（**prevail**）。这十个词帮你谈论变坏、变少、屈服和胜出。",
    ),
    watchOut: {
      meanings: t(
        "To **succumb** is to give in to pressure, illness or temptation, while to **relent** is to give up a harsh plan and become softer; an army succumbs to a siege, but a strict parent relents.",
        "**succumb** 是屈服于压力、疾病或诱惑；**relent** 是放弃严厉的打算、变得宽容；被围的城 succumb，严厉的家长 relent。",
      ),
      use: t(
        "You **succumb** to something and **prevail** over someone, and a place can **teem** with life, but you **surpass** a record with no word between.",
        "**succumb** 接 to；**prevail** 接 over；某地 **teem** with 生物；**surpass** 直接接宾语，如 surpass a record。",
      ),
      spelling: t(
        "**Succumb** has a double c and a silent b, **recede** ends in -cede, and **deteriorate** has -rior- in the middle.",
        "**succumb** 双写 c，结尾 b 不发音；**recede** 结尾是 -cede；**deteriorate** 中间是 -rior-。",
      ),
    },
    notes: `
      deteriorate|a house with peeling paint and a rotting roof|a cold turning into a serious chest illness|relations going from cool to hostile|deteriorate means to become worse; dwindle means to become fewer or smaller|deteriorate 是恶化；dwindle 是逐渐减少|dwindle means to grow smaller in number or size, not to become worse in condition, as a house, an illness or relations do|dwindle 是数量或规模减少，不是房屋、病情或关系变糟|surpass means to be better than something and needs an object, so it cannot stand alone after began to or continued to|surpass 是超过，需要宾语，不能单独用在 began to 或 continued to 后面|de · te · ri · or · ate|the -rior- in the middle|中间是 -rior-
      dwindle|savings shrinking month after month|tiger numbers falling year by year|a crowd shrinking from hundreds to dozens|dwindle means to become gradually fewer or smaller; recede means to move back or away|dwindle 是逐渐减少；recede 是后退、远去|recede means to move back, as a tide or a sound does, not to shrink in number like savings, tigers or a crowd|recede 是后退，如潮水或声音，不是积蓄、老虎或人群的数量减少|teem means to be full of living things, the opposite of becoming fewer|teem 是充满生物，和逐渐减少正好相反|dwin · dle|the -dle ending|结尾是 -dle
      wane|the moon showing a thinner slice each night|a man's popularity falling after a scandal|a girl's enthusiasm fading as lessons grow hard|wane means to grow smaller or weaker, as the moon does; prevail means to win through|wane 是月亏或减弱；prevail 是获胜|prevail means to win or to prove stronger, the opposite of growing thinner or weaker|prevail 是获胜、占上风，和变弱正好相反|teem means to be full of living things, not to grow thinner or weaker|teem 是充满生物，不是变弱|wane|the long a and the silent e|长音 a，结尾 e 不发音
      recede|a tide going out and leaving boats on the sand|a town shrinking into the distance behind a train|the sound of a band marching away|recede means to move back or away; surpass means to be greater or better than something|recede 是后退、远去；surpass 是超过|surpass needs an object and means to beat something, not to go back or fade into the distance|surpass 需要宾语，是超过，不是后退或远去|teem means to be full of living things, not to move back or away|teem 是充满生物，不是后退|re · cede|the -cede ending|结尾是 -cede
      subside|a howling wind dropping to a breeze|a swollen ankle going down|anger fading after an apology|subside means to become less strong or severe; surpass means to be better than something|subside 是平息、消退；surpass 是超过|surpass needs an object and means to beat something, not to calm down like a storm, swelling or anger|surpass 需要宾语，是超过，不是风暴、肿胀或怒气平息|teem means to be full of living things, not to calm down|teem 是充满生物，不是平息|sub · side|the -side ending, as in *side*|结尾 -side，同 *side*
      succumb|a dieter giving in to cake|a wounded soldier dying of his injuries|a town giving in to a siege|succumb means to give in to pressure, temptation or illness; relent means to give up a harsh plan|succumb 是屈服；relent 是心软、让步|relent means to give up being harsh, and it does not take to cake, injuries or a siege|relent 是不再严厉，不接 to 加蛋糕、伤势或围困|prevail means to win, the opposite of giving in, and it does not take to|prevail 是获胜，和屈服相反，也不接 to|suc · cumb|the double c and the silent b|双写 c，结尾 b 不发音
      relent|a teacher softening her rule|parents giving way once a promise is made|rain that did not ease all day|relent means to give up a harsh plan or to become less severe; succumb means to give in to pressure or illness|relent 是心软、减弱；succumb 是屈服|succumb needs to and the thing given in to, so it cannot stand alone for a teacher, parents or the rain|succumb 要接 to 和屈服的对象，不能单独用于老师、父母或雨|surpass means to be better than something and needs an object|surpass 是超过，需要宾语|re · lent|the word *lent* at the end|结尾是单词 *lent*
      prevail|common sense winning in the end|a small army winning over a larger one|calm heads winning out to avoid war|prevail means to win or prove stronger; surpass means to be greater or better than something|prevail 是获胜；surpass 是超过|surpass needs a direct object, so it cannot stand alone or take over|surpass 需要直接宾语，不能单独用，也不接 over|succumb means to give in, the opposite of winning out|succumb 是屈服，和获胜正好相反|pre · vail|the -ail ending, as in *sail*|结尾 -ail，同 *sail*
      surpass|exam results beating a teacher's highest hopes|a new bridge longer than the old one|a runner beating his own record|surpass means to be greater or better than something; prevail means to win in a struggle|surpass 是超过；prevail 是获胜|prevail takes no direct object, so it cannot take expectations, a bridge or a record straight after it|prevail 不接直接宾语，后面不能直接接期望、桥或纪录|teem means to be full of living things, not to be better than something|teem 是充满生物，不是超过|sur · pass|the double s at the end|结尾双写 s
      teem|a pond full of hopping frogs|narrow streets full of buyers and sellers|a house full of mice|teem means to be full of moving living things; dwindle means to become fewer|teem 是充满；dwindle 是减少|dwindle means to become fewer, the opposite of being full of frogs, people or mice|dwindle 是减少，和充满青蛙、人或老鼠正好相反|surpass means to be better than something and does not take with|surpass 是超过，不接 with|teem|the ee, as in *team*'s sound|ee 读音同 *team*
    `,
  },
);

const senses = batch(
  "words-of-smell-taste-and-touch",
  ["Words of Smell, Taste and Touch", "嗅觉、味觉与触觉的词"],
  ["appetites, soothing, sweetness and stench", "胃口、舒缓、甜腻与恶臭"],
  `
  whet|to sharpen; to stimulate an appetite or interest|磨快；激起|The smell of baking bread drifted out to ___ our appetites, making us even hungrier before dinner.|The first chapter is meant to ___ the reader's interest so that she wants to read on.|He used a stone to ___ the knife until its edge was sharp again.|satiate,palliate|whetted
  satiate|to satisfy fully|使饱足|The huge meal was enough to ___ even the hungriest guest, who could not eat another bite.|One small biscuit will not ___ a teenager who has missed lunch and is starving.|The long drink of cold water was enough to ___ her thirst completely.|whet,palliate|satiated,satiety
  palliate|to make a disease less severe without curing it; to make an offense seem less serious|减轻(病痛)；掩饰|The drugs can ___ the pain of the illness, though they cannot cure it.|Doctors could only ___ his symptoms, making his last weeks more comfortable.|No excuse can ___ the cruelty of what he did, or make it seem any less serious.|satiate,whet|
  emollient|having the quality of softening the skin; calming|润肤的；缓和的|Rub this ___ cream into dry, cracked hands each night to soften them.|His soothing, ___ words calmed the angry crowd, and they went home quietly.|Olive oil makes a good ___ lotion for sunburn, softening and soothing the skin.|cloying,fetid|
  cloying|unpleasantly sweet or sentimental|甜腻的|The cake was so ___ that I felt sick after one bite of the sugary icing.|The film's ___ ending, all tears and hugs and syrupy music, made the critics groan.|The ___ perfume, sweet enough to choke on, filled the lift.|redolent,emollient|cloyingly
  redolent|strongly reminiscent; smelling strongly of|使人联想的；有…气味的|The kitchen was ___ of garlic and fresh bread.|The old streets are ___ of the city's past, full of reminders of centuries ago.|Her letters, ___ of a happier time, made him long for the summers of his youth.|cloying,noisome|
  fetid|smelling extremely unpleasant|恶臭的|The ___ smell of rotting fish rose from the drain.|The prisoners were kept in ___ cells, stinking of sewage.|The ___ water of the swamp smelled of rotten eggs.|cloying,variegated|
  noisome|having an extremely offensive smell; disagreeable|恶臭的；令人讨厌的|The ___ smoke from the burning tyres made everyone cough and hold their noses.|The rubbish heap gave off ___ fumes in the summer heat.|Rats crawled through the ___ tunnels, foul with waste.|emollient,variegated|
  viscous|thick and sticky, between solid and liquid|黏稠的|Honey is a thick, ___ liquid that pours slowly from the jar.|The engine oil had turned ___ in the cold, thick and sticky as syrup.|Lava is so ___ that it creeps slowly down the hill rather than flowing.|emollient,variegated|viscosity
  variegated|having patches or streaks of different colors|杂色的|The ___ leaves of the plant were striped green and cream.|Butterflies with ___ wings, patched in orange and black, filled the garden.|The ___ marble floor was streaked with grey, white and pink.|viscous,redolent|
  `,
  "context-clues",
  {
    intro: t(
      "The market stall was **redolent** of spices, the honey was thick and **viscous**, and the smell from the drain behind it was **fetid**. These ten words help you talk about smells, tastes, textures, colours and soothing things.",
      "那个市场摊位散发着（**redolent**）香料味，蜂蜜又稠又黏（**viscous**），摊位后面排水沟的气味却恶臭难闻（**fetid**）。这十个词帮你谈论气味、味道、质地、颜色和起舒缓作用的东西。",
    ),
    watchOut: {
      meanings: t(
        "To **whet** your appetite is to make you hungrier, while to **satiate** it is to fill you completely; a starter whets, a feast satiates.",
        "**whet** 是激起食欲，让人更饿；**satiate** 是使人完全满足；开胃菜 whet，大餐 satiate。",
      ),
      use: t(
        "**Redolent** is followed by of, as in redolent of garlic, while **fetid** and **noisome** come straight before a noun, as in fetid water.",
        "**redolent** 后接 of，如 redolent of garlic；**fetid** 和 **noisome** 直接放在名词前，如 fetid water。",
      ),
      spelling: t(
        "**Variegated** has an e after the i, **viscous** ends in -ous, and **emollient** has a double l.",
        "**variegated** 在 i 后有 e；**viscous** 结尾是 -ous；**emollient** 双写 l。",
      ),
    },
    notes: `
      whet|a bread smell making people hungrier before dinner|a first chapter making a reader want more|a stone sharpening a knife|whet means to sharpen, or to make an appetite or interest stronger; satiate means to satisfy fully|whet 是磨快，或激起食欲、兴趣；satiate 是满足|satiate means to fill up completely, the opposite of making someone hungrier or keener to read, and it cannot sharpen a knife|satiate 是完全满足，和激起食欲或兴趣相反，也不能磨刀|palliate means to ease pain or illness, not to sharpen a knife or make someone hungrier|palliate 是减轻病痛，不是磨刀或激起食欲|whet|the wh, as in *when*|wh 读音同 *when*
      satiate|a guest who could not eat another bite|a starving teenager who needs more than a biscuit|a thirst filled completely|satiate means to satisfy hunger or thirst fully; whet means to make an appetite stronger|satiate 是使饱足；whet 是激起食欲|whet means to make hunger stronger, the opposite of filling a guest, a teenager or a thirst|whet 是激起饥饿感，和使人饱足相反|palliate means to ease pain without curing it, not to fill a hungry or thirsty person|palliate 是减轻病痛，不是让饥渴的人吃饱喝足|sa · ti · ate|the t that sounds like *sh*|t 读作 *sh*
      palliate|drugs easing pain without curing the illness|doctors making a dying man more comfortable|an excuse that cannot make cruelty seem less serious|palliate means to make pain or a wrong seem less severe without removing it; satiate means to satisfy fully|palliate 是减轻、掩饰；satiate 是满足|satiate means to fill hunger, not to ease pain, symptoms or the seriousness of cruelty|satiate 是填饱，不是减轻疼痛、症状或罪行的严重性|whet means to sharpen or to make an appetite stronger, not to ease pain or excuse cruelty|whet 是磨快或激起食欲，不是减轻疼痛或开脱罪行|pal · li · ate|the double l and the -iate ending|双写 l，结尾是 -iate
      emollient|a cream that softens cracked hands|soothing words that calm a crowd|a lotion soothing sunburn|emollient means softening and soothing; cloying means too sweet|emollient 是润肤的、安抚的；cloying 是甜得发腻的|cloying means sickly sweet, not softening skin or calming a crowd|cloying 是甜得发腻，不是润肤或平息众怒|fetid means stinking, not soft and soothing|fetid 是恶臭的，不是柔润舒缓的|e · mol · li · ent|the double l and the -ient ending|双写 l，结尾是 -ient
      cloying|sugary icing that makes you feel sick|a film ending of tears and syrupy music|a perfume sweet enough to choke on|cloying means so sweet that it becomes unpleasant; redolent means smelling of or calling to mind something|cloying 是甜得发腻；redolent 是散发某种气味或令人联想|redolent must be followed by of, so it cannot stand alone before a cake, an ending or a perfume|redolent 后面要接 of，不能单独形容蛋糕、结局或香水|emollient means softening and soothing, not sickly sweet|emollient 是柔润舒缓的，不是甜得发腻|cloy · ing|the oy, as in *toy*|oy 读音同 *toy*
      redolent|a kitchen smelling of garlic and bread|streets full of reminders of the past|letters calling a happier time to mind|redolent of means smelling of or bringing something to mind; cloying means unpleasantly sweet|redolent of 是散发着、令人联想；cloying 是甜得发腻|cloying does not take of and means too sweet, not smelling of garlic or calling the past to mind|cloying 不接 of，是太甜，不是散发蒜香或令人怀旧|noisome means foul and offensive, and it does not take of to call up the past or a happy time|noisome 是恶臭的，不接 of，不能用来唤起往事或快乐时光|red · o · lent|the -lent ending|结尾是 -lent
      fetid|rotting fish smelling from a drain|cells stinking of sewage|swamp water smelling of rotten eggs|fetid means smelling very bad; cloying means sickly sweet|fetid 是恶臭的；cloying 是甜腻的|cloying means too sweet, not the stink of rotting fish, sewage or rotten eggs|cloying 是太甜，不是腐鱼、污水或臭蛋的臭味|variegated means patched with colours, not stinking|variegated 是杂色斑驳的，不是发臭的|fet · id|the short e, as in *bet*|短音 e，同 *bet*
      noisome|smoke from burning tyres that makes people cough|a rubbish heap giving off fumes in the heat|tunnels foul with waste|noisome means foul and offensive, especially in smell; emollient means soothing and softening|noisome 是恶臭的、令人厌恶的；emollient 是舒缓的|emollient means softening and soothing, the opposite of foul smoke, fumes or waste|emollient 是柔润舒缓的，和恶臭的烟雾或污物正好相反|variegated means streaked with colours, not foul and offensive to the nose|variegated 是杂色的，不是刺鼻难闻的|noi · some|the word *noise* inside, though it has nothing to do with noise|里面有 *noise*，但与噪音无关
      viscous|honey pouring slowly from a jar|engine oil thick as syrup in the cold|lava creeping slowly down a hill|viscous means thick and sticky, flowing slowly; emollient means softening the skin|viscous 是黏稠的；emollient 是润肤的|emollient means soothing to the skin, not thick and slow to pour like honey, oil or lava|emollient 是润肤的，不是像蜂蜜、机油或熔岩那样黏稠|variegated means patched with colours, not thick and slow-flowing|variegated 是杂色的，不是黏稠难流的|vis · cous|the -cous ending, said *kus*|结尾 -cous 读作 *kus*
      variegated|leaves striped green and cream|wings patched in orange and black|marble streaked with grey, white and pink|variegated means marked with patches or streaks of different colours; viscous means thick and sticky|variegated 是杂色斑驳的；viscous 是黏稠的|viscous means thick and sticky, not striped or patched with colours|viscous 是黏稠的，不是带条纹或色斑的|redolent needs of and is about smell or memory, not patches of colour|redolent 要接 of，指气味或联想，不是色斑|var · ie · gat · ed|the e after the i|i 后有 e
    `,
  },
);

const truth = batch(
  "words-of-truth-and-denial",
  ["Words of Truth and Denial", "真相与否认的词"],
  ["claiming, contradicting, dodging and clearing names", "主张、反驳、回避与澄清"],
  `
  belie|to fail to give a true idea of; to show something to be false|掩饰；证明…为假|His calm smile seemed to ___ the panic he felt inside.|Her youthful face and quick step ___ her eighty years.|The tiny cottage seems to ___ the great wealth of the family who live in it.|aver,impugn|belied
  aver|to state or assert to be the case|断言|Under oath, the witness was willing to ___ that she had seen the driver run the red light, and she said it firmly.|He continues to ___ his innocence, insisting that he was at home all night.|The report goes so far as to ___ that the bridge is safe, stating it plainly and without doubt.|belie,gainsay|averred
  gainsay|to deny or contradict|否认，反驳|No one could ___ the fact that she was the best player, so the prize was hers.|The evidence is so strong that even his own lawyers do not try to ___ it.|It is hard to ___ a man who has all the figures in front of him and can prove each one.|aver,demur|
  impugn|to dispute the truth or honesty of|对…表示怀疑，质疑|The lawyer tried to ___ the witness's honesty, suggesting she had been paid to lie.|How dare you ___ my motives when you know I only wanted to help?|The newspaper set out to ___ the scientist's results, claiming the data were faked.|aver,exculpate|impugned
  prevaricate|to speak or act evasively|支吾其词|When asked where the money had gone, he began to ___, giving long answers that said nothing.|Stop trying to ___ and give me a straight yes or no.|The minister would ___ for an hour, dodging every question, rather than admit the plan had failed.|remonstrate,exculpate|prevaricated,prevarication
  dissemble|to hide one's true motives or feelings|掩饰|She was too honest to ___; her face always showed exactly what she felt.|He tried to ___, hiding his fear behind a cheerful grin.|A good poker player learns to ___, never letting the others see what he is thinking.|disabuse,exculpate|dissembled
  disabuse|to persuade someone that an idea is mistaken|纠正，使省悟|Someone needs to ___ him of the idea that money buys happiness.|Her teacher tried to ___ her of the belief that she was bad at maths.|A single visit to the farm was enough to ___ the children of the notion that milk comes from shops.|exculpate,delude|disabused
  exculpate|to show that someone is not guilty|开脱，证明无罪|The new DNA test helped to ___ the man who had spent ten years in prison for a crime he did not commit.|The video was enough to ___ the driver, proving he had stopped at the red light.|Her diary may ___ her, since it shows she was in another city on the day of the theft.|disabuse,impugn|exculpated
  remonstrate|to make a forcefully reproachful protest|抗议，规劝|Fans began to ___ with the referee, shouting angrily about the goal.|She went to ___ with the council about the noise, angrily demanding that it stop.|He chose to ___ against the unfair rule, protesting loudly at every meeting.|demur,prevaricate|remonstrated
  demur|to raise doubts or objections|表示异议|When asked to work on Sunday, she started to ___, saying politely that she had other plans.|He did not ___ at the high price but paid it at once.|The committee chose to ___ at the plan, raising a few mild doubts before agreeing.|remonstrate,gainsay|demurred
  `,
  "context-clues",
  {
    intro: t(
      "The suspect began to **prevaricate**, but his lawyer went on to **aver** his innocence, and a video soon helped **exculpate** him. These ten words help you talk about stating, denying, dodging, hiding and protesting.",
      "嫌疑人开始支吾其词（**prevaricate**），但他的律师断言（**aver**）他无罪，一段视频很快帮他洗清了罪名（**exculpate**）。这十个词帮你谈论断言、否认、回避、掩饰和抗议。",
    ),
    watchOut: {
      meanings: t(
        "To **prevaricate** is to dodge a question with vague answers, while to **dissemble** is to hide your true feelings; a minister prevaricates in an interview, a poker player dissembles at the table.",
        "**prevaricate** 是含糊其词、回避问题；**dissemble** 是掩饰真实感受；部长在采访中 prevaricate，牌手在桌前 dissemble。",
      ),
      use: t(
        "You **disabuse** someone of an idea and **remonstrate** with someone, but you **demur** at a plan, and you **impugn** someone's honesty with no word between.",
        "**disabuse** 某人 of 某想法；**remonstrate** with 某人；**demur** at 某计划；**impugn** 直接接宾语，如 impugn his honesty。",
      ),
      spelling: t(
        "**Belie** ends in -ie, **gainsay** joins *gain* and *say*, and **exculpate** has the -cul- of *culprit*.",
        "**belie** 结尾是 -ie；**gainsay** 由 *gain* 和 *say* 组成；**exculpate** 中间是 *culprit* 的 -cul-。",
      ),
    },
    notes: `
      belie|a calm smile hiding inner panic|a young face and quick step hiding great age|a tiny cottage hiding great wealth|belie means to give a false picture of something; aver means to state something firmly|belie 是给人假象、掩盖；aver 是断言|aver is something a person does when stating a fact, not what a smile, a face or a cottage does|aver 是人作出断言，不是微笑、面容或小屋的作用|impugn means to challenge someone's honesty, not to give a false picture of panic, age or wealth|impugn 是质疑诚信，不是掩盖恐慌、年龄或财富|be · lie|the -ie ending, as in *lie*|结尾 -ie，同 *lie*
      aver|a witness stating firmly what she saw|a man insisting he is innocent|a report stating plainly that a bridge is safe|aver means to state firmly that something is true; belie means to give a false picture|aver 是断言；belie 是给人假象|belie means to hide the truth behind a false picture, not to state something plainly and firmly|belie 是用假象掩盖，不是明确地断言|gainsay means to deny, the opposite of insisting that something is true|gainsay 是否认，和坚称属实正好相反|a · ver|the stress on -ver|重音在 -ver
      gainsay|a fact that made the prize hers|evidence too strong even for lawyers to deny|a man who can prove every figure|gainsay means to deny or contradict; aver means to state firmly|gainsay 是否认；aver 是断言|aver means to state firmly, so saying no one could aver a proven fact makes no sense|aver 是断言，说没人能断言一个已证实的事实说不通|demur means to raise mild doubts, and it takes at, not a fact, evidence or a man|demur 是提出异议，接 at，不直接接事实、证据或人|gain · say|*gain* and *say* joined|*gain* 和 *say* 合成
      impugn|a lawyer suggesting a witness was paid to lie|someone doubting good motives|a newspaper claiming data were faked|impugn means to challenge the honesty or truth of something; aver means to state that something is true|impugn 是质疑；aver 是断言|aver means to state that something is true, the opposite of suggesting honesty, motives or results are false|aver 是断言属实，和质疑诚信、动机或结果正好相反|exculpate means to clear someone of blame, not to attack their honesty, motives or results|exculpate 是证明无罪，不是攻击诚信、动机或结果|im · pugn|the silent g, as in *sign*|g 不发音，同 *sign*
      prevaricate|long answers that said nothing|someone avoiding a straight yes or no|a minister dodging every question for an hour|prevaricate means to avoid giving a direct answer; remonstrate means to protest angrily|prevaricate 是支吾其词；remonstrate 是抗议|remonstrate means to protest angrily, not to dodge questions with vague answers|remonstrate 是愤怒地抗议，不是用含糊的话回避问题|exculpate means to clear someone of blame, and it needs an object|exculpate 是证明无罪，需要宾语|pre · var · i · cate|the -cate ending|结尾是 -cate
      dissemble|an honest face that always showed her feelings|fear hidden behind a cheerful grin|a poker player hiding his thoughts|dissemble means to hide your true feelings or aims; disabuse means to free someone from a false idea|dissemble 是掩饰；disabuse 是使人醒悟|disabuse needs a person and of, so it cannot stand alone for hiding feelings or thoughts|disabuse 要接人和 of，不能单独表示掩饰感受或想法|exculpate means to clear someone of blame and needs an object|exculpate 是证明无罪，需要宾语|dis · sem · ble|the double s and the -ble ending|双写 s，结尾是 -ble
      disabuse|freeing a man from the idea that money buys happiness|freeing a girl from the belief she is bad at maths|freeing children from a notion about milk|disabuse means to free someone from a false idea; delude means to make someone believe a false idea|disabuse 是纠正错误想法；delude 是蒙骗|exculpate means to clear someone of blame, and it does not take of an idea|exculpate 是证明无罪，不接 of 加想法|delude means to lead someone into a false idea, the opposite of freeing them from it, and it does not take of|delude 是使人陷入错误想法，和纠正相反，也不接 of|dis · a · buse|the dis- start before *abuse*|*abuse* 前加 dis-
      exculpate|a DNA test freeing a man jailed for ten years|a video proving a driver stopped|a diary showing a woman was in another city|exculpate means to show that someone is not guilty; disabuse means to free someone from a false idea|exculpate 是证明无罪；disabuse 是纠正错误想法|disabuse needs of and an idea, not a wrongly jailed man, a driver or a suspect|disabuse 要接 of 加想法，不能直接用于被冤的人、司机或嫌疑人|impugn means to attack someone's honesty, the opposite of proving them innocent|impugn 是质疑诚信，和证明清白正好相反|ex · cul · pate|the -cul- of *culprit*|中间是 *culprit* 的 -cul-
      remonstrate|fans shouting angrily at a referee|a woman angrily demanding the council stop noise|a man protesting loudly at every meeting|remonstrate means to protest forcefully; demur means to raise mild doubts|remonstrate 是强烈抗议；demur 是提出异议|demur means to object mildly and politely, not to shout angrily or protest loudly|demur 是温和地提出异议，不是愤怒叫喊或大声抗议|prevaricate means to dodge questions, not to protest angrily|prevaricate 是回避问题，不是愤怒抗议|re · mon · strate|the -strate ending|结尾是 -strate
      demur|a woman politely saying she had other plans|a man not objecting to a high price|a committee raising a few mild doubts|demur means to raise mild doubts or objections; remonstrate means to protest forcefully|demur 是温和地提出异议；remonstrate 是强烈抗议|remonstrate means to protest angrily, not to object politely or mildly|remonstrate 是愤怒抗议，不是礼貌或温和地异议|gainsay means to deny something, and it does not take at a price or a plan|gainsay 是否认，不接 at 加价格或计划|de · mur|the -ur ending, as in *fur*|结尾 -ur，同 *fur*
    `,
  },
);

const energy = batch(
  "words-of-drive-and-inertia",
  ["Words of Drive and Inertia", "干劲与惰性的词"],
  ["the persistent, the useless, the rigid, the changeable and the sleepy", "坚持者、无能者、僵化者、多变者与昏沉者"],
  `
  dogged|showing tenacity and grim persistence|顽强的|Through ___ effort, practising every day for years despite every setback, he became a champion.|The detective's ___ search, which she refused to give up for months, finally found the missing girl.|Her ___ refusal to give up, however long it took, won her the case.|feckless,quiescent|doggedly
  pertinacious|holding firmly to a purpose; persistent|执着的，坚持的|The ___ salesman would not leave the doorstep until we had bought something.|She was ___ in her search for the truth, refusing to drop it for twenty years.|A ___ fly kept landing on my nose however often I waved it away.|protean,somnolent|pertinacity
  feckless|lacking initiative or strength of character; irresponsible|无能的，不负责任的|Her ___ brother never kept a job for more than a week and always borrowed money he never paid back.|The ___ young king spent his days hunting while the country fell into ruin.|Parents worry that their ___ son will never settle down or take charge of his life.|dogged,peripatetic|
  fatuous|silly and pointless|愚蠢的|He made a ___ remark about the weather during the funeral, and everyone stared at him.|It was a ___ question with an obvious answer, and the class laughed.|The film's ___ plot, full of silly jokes, made no sense at all.|feckless,hidebound|fatuously
  hidebound|unwilling or unable to change because of tradition|墨守成规的|The ___ old club refused to let women join, saying it had always been for men only.|Teachers fought against the ___ rules that had not changed in a hundred years.|He is too ___ to try new ideas, always saying things should be done the old way.|protean,quiescent|
  protean|tending or able to change frequently or easily|多变的|The ___ actor could play a king one night and a beggar the next.|The virus is ___, changing its form so quickly that vaccines struggle to keep up.|Her ___ talents ranged from painting to music to science.|hidebound,peripatetic|
  peripatetic|traveling from place to place, especially for work|巡回的，流动的|As a ___ music teacher, she drives to five different schools each week.|His ___ childhood, moving from town to town with his father's job, left him without close friends.|The ___ judges of old travelled from county to county hearing cases.|protean,somnolent|
  somnolent|sleepy; drowsy|昏昏欲睡的|The warm room and the dull lecture left the students ___, their eyes half shut.|The ___ cat dozed by the fire all afternoon, too drowsy to move.|After the big lunch, the ___ guests nodded off in their chairs.|feckless,peripatetic|
  lassitude|a state of physical or mental weariness; lack of energy|倦怠|After the fever, a deep ___ kept her in bed for a week, too tired to do anything.|The heat brought on such ___ that even walking to the shop feel like hard work.|His ___ was so great that he could not find the strength to lift his pen.|alacrity,quandary|
  quiescent|in a state of inactivity or dormancy|静止的，沉寂的|The volcano has been ___ for centuries, but scientists warn that it could erupt again.|The disease can remain ___ in the body for years before any symptoms appear.|The market was ___ over the holiday, with almost no trading at all.|somnolent,hidebound|quiescence
  `,
  "context-clues",
  {
    intro: t(
      "The **dogged** coach worked on while her **feckless** assistant napped, leaving the **somnolent** players to fight off a deep **lassitude** in the heat. These ten words help you talk about persistence, carelessness, change, travel, sleepiness and stillness.",
      "坚韧的（**dogged**）教练一直在工作，而她那不负责任的（**feckless**）助手却在打盹，留下昏昏欲睡的（**somnolent**）球员们在高温中抵抗深深的倦怠（**lassitude**）。这十个词帮你谈论坚持、懒散、多变、奔波、困倦和静止。",
    ),
    watchOut: {
      meanings: t(
        "**Somnolent** means sleepy, as a person or animal is, while **quiescent** means inactive for now, as a volcano or a disease is; a cat is somnolent, a volcano is quiescent.",
        "**somnolent** 是困倦的，用于人或动物；**quiescent** 是暂时不活跃的，用于火山或疾病；猫 somnolent，火山 quiescent。",
      ),
      use: t(
        "**Lassitude** is a noun, as in a deep lassitude, while the other nine words are adjectives that describe a person or a thing, as in a dogged search.",
        "**lassitude** 是名词，如 a deep lassitude；其余九个词是形容词，用来修饰人或事物，如 a dogged search。",
      ),
      spelling: t(
        "**Pertinacious** ends in -acious, **peripatetic** has three short i and e sounds, and **lassitude** has a double s.",
        "**pertinacious** 结尾是 -acious；**peripatetic** 有几个短元音 i 和 e；**lassitude** 双写 s。",
      ),
    },
    notes: `
      dogged|years of daily practice despite setbacks|a search kept up for months|a refusal to give up however long it took|dogged means grimly persistent; feckless means lazy and irresponsible|dogged 是顽强的；feckless 是懒散不负责的|feckless means lazy and lacking drive, the opposite of effort, a long search or refusing to give up|feckless 是懒散无为，和努力、坚持搜寻或不放弃正好相反|quiescent means inactive and still, not persistent and hard-working|quiescent 是静止不活跃的，不是坚持不懈的|dog · ged|the double g|双写 g
      pertinacious|a salesman who would not leave the doorstep|a woman who searched for the truth for twenty years|a fly that kept coming back|pertinacious means holding on stubbornly to a purpose; protean means changing easily|pertinacious 是执着的；protean 是多变的|protean means changing form easily, not refusing to give up or go away|protean 是多变的，不是不肯放弃或不肯离开|somnolent means sleepy, not stubbornly refusing to leave or give up|somnolent 是困倦的，不是执着不走或不放弃|per · ti · na · cious|the -acious ending|结尾是 -acious
      feckless|a brother who never kept a job and never paid back money|a king hunting while his country fell into ruin|a son who never takes charge of his life|feckless means lazy, weak and irresponsible; dogged means grimly persistent|feckless 是懒散不负责的；dogged 是顽强的|dogged means hard-working and persistent, the opposite of a man who never keeps a job or takes charge|dogged 是勤勉坚持，和不保住工作、不负责任正好相反|peripatetic means moving from place to place for work, not lazy and irresponsible|peripatetic 是四处奔波工作，不是懒散不负责|feck · less|the -less ending|结尾是 -less
      fatuous|a silly remark at a funeral|a question with an obvious answer|a plot full of silly jokes|fatuous means silly and pointless; feckless means lazy and irresponsible|fatuous 是愚蠢无聊的；feckless 是懒散不负责的|feckless describes a person who lacks drive, not a remark, a question or a plot|feckless 形容缺乏干劲的人，不形容话语、问题或情节|hidebound means stuck in old ways, not silly and pointless|hidebound 是守旧的，不是愚蠢无聊的|fat · u · ous|the -uous ending|结尾是 -uous
      hidebound|a club that kept women out because of tradition|rules unchanged for a hundred years|a man who insists on the old way|hidebound means unwilling to change because of tradition; protean means changing easily|hidebound 是守旧的；protean 是多变的|protean means changing often, the opposite of a club, rules or a man that never change|protean 是多变的，和从不改变的俱乐部、规定或人正好相反|quiescent means inactive for now, not stuck in old traditions|quiescent 是暂时不活跃的，不是因循守旧|hide · bound|*hide* and *bound* joined|*hide* 和 *bound* 合成
      protean|an actor playing a king one night and a beggar the next|a virus that keeps changing its form|talents ranging from painting to science|protean means able to change often or do many things; hidebound means unwilling to change|protean 是多变的、多才的；hidebound 是守旧的|hidebound means refusing to change, the opposite of an actor, a virus or talents that change and vary|hidebound 是拒绝改变，和多变的演员、病毒或才能正好相反|peripatetic means travelling from place to place, not changing roles or forms|peripatetic 是四处奔走，不是变换角色或形态|pro · te · an|the -ean ending|结尾是 -ean
      peripatetic|a teacher driving to five schools a week|a childhood of moving from town to town|judges travelling between counties|peripatetic means travelling from place to place; protean means changing easily|peripatetic 是四处奔波的；protean 是多变的|protean means changing form, not travelling between schools, towns or counties|protean 是形态多变，不是在学校、城镇或郡县间奔波|somnolent means sleepy, not moving from place to place|somnolent 是困倦的，不是四处走动|per · i · pa · tet · ic|the -tetic ending|结尾是 -tetic
      somnolent|students with half-shut eyes in a dull lecture|a cat dozing by a fire|guests nodding off after lunch|somnolent means sleepy and drowsy; feckless means lazy and irresponsible|somnolent 是困倦的；feckless 是懒散不负责的|feckless means lacking drive over a lifetime, not drowsy with half-shut eyes or dozing|feckless 是长期缺乏干劲，不是眼皮打架或打瞌睡|peripatetic means travelling from place to place, not drowsy and still|peripatetic 是四处奔走，不是昏昏欲睡|som · no · lent|the -lent ending|结尾是 -lent
      lassitude|a deep tiredness after a fever|heat that makes walking feel like hard work|no strength left to lift a pen|lassitude means tiredness and lack of energy; alacrity means eager readiness|lassitude 是倦怠；alacrity 是欣然、敏捷|alacrity means eager readiness, the opposite of being too tired to do anything|alacrity 是欣然积极，和累得什么都做不了正好相反|a quandary is uncertainty about what to do, not a lack of energy|quandary 是进退两难，不是缺乏精力|las · si · tude|the double s and the -tude ending|双写 s，结尾是 -tude
      quiescent|a volcano inactive for centuries|a disease hidden in the body for years|a market with almost no trading|quiescent means inactive or dormant for now; somnolent means sleepy|quiescent 是静止的、蛰伏的；somnolent 是困倦的|somnolent describes a person or animal that feels sleepy, not a volcano, a disease or a market|somnolent 形容困倦的人或动物，不形容火山、疾病或市场|hidebound means stuck in old ways, not inactive for now|hidebound 是守旧的，不是暂时静止|qui · es · cent|the -scent ending|结尾是 -scent
    `,
  },
);

const greed = batch(
  "words-of-money-and-greed",
  ["Words of Money and Greed", "金钱与贪婪的词"],
  ["the poor, the bribed, the greedy and the generous", "贫者、受贿者、贪婪者与慷慨者"],
  `
  impecunious|having little or no money|身无分文的|The ___ young artist could not even pay his rent and lived on bread and tea.|Poor and ___, the family had to sell their furniture to buy food.|He was too ___ to buy his own books, so he read them for free in the library.|pecuniary,venal|
  pecuniary|relating to money|金钱的|The bank's ___ reward of five hundred pounds for finding the stolen money went to a schoolboy.|The court will settle all ___ matters, such as debts, fees and unpaid wages.|He had no ___ interest in the company, so he would not gain a penny if its shares rose.|impecunious,venal|
  lucre|money, especially when gained dishonestly|钱财，不义之财|He betrayed his friends for filthy ___, taking money from their enemies.|The gang's ill-gotten ___, stolen from the bank, was hidden under the floor.|Lured by dishonest ___, he sold fake medicine to the sick.|largesse,cupidity|
  venal|open to bribery|唯利是图的，贪赃的|The ___ judge took bribes to set criminals free.|The police there were so ___ that any crime could be forgotten for a fee.|Only ___ officials would sell building permits to whoever paid them the most under the table.|impecunious,pecuniary|venality
  cupidity|greed for money or possessions|贪婪|His ___ knew no limits; the more money he had, the more he wanted.|Swindlers played on the buyers' ___, promising them easy riches.|It was ___, not need, that drove the rich man to steal from his own workers.|largesse,lucre|
  largesse|generosity in giving money or gifts|慷慨的赠予|Thanks to the ___ of a rich donor, who gave millions, the school built a new library.|The king was famous for his ___, giving gold to every poor person he met.|The village lived on the ___ of its wealthy lord, who paid for its school and its well.|cupidity,lucre|
  mendicant|a beggar; living by begging|乞丐；行乞的|A ___ sat by the temple gate, holding out a bowl for coins.|The old monk lived as a ___, begging his food from door to door.|Dressed in rags, the ___ asked every passer-by for a coin.|dupe,convict|mendicants
  bilk|to obtain money fraudulently from; to cheat|诈骗|The builder tried to ___ the old woman out of thousands by charging for work he never did.|The firm managed to ___ its investors out of their savings with false accounts.|The con man planned to ___ the hotel out of a week's bill by slipping away without paying.|abscond,aggrandize|bilked
  abscond|to leave hurriedly and secretly, often to avoid arrest|潜逃|The treasurer chose to ___ with the club's money, leaving town in the night.|Three prisoners managed to ___ from the camp under cover of darkness.|He was arrested at the airport as he tried to ___ to another country with the stolen gold.|bilk,aggrandize|absconded
  aggrandize|to increase the power, status or wealth of|扩大，增强(权势)|The dictator built huge statues of himself to ___ himself and his rule.|The company tried to ___ itself by buying up every rival in the market.|She used her position to ___ her family, giving them land, titles and power.|abscond,bilk|aggrandized,aggrandizement
  `,
  "context-clues",
  {
    intro: t(
      "The **venal** official took bribes, his **cupidity** grew with every deal, and when he was found out he tried to **abscond** with the town's money. These ten words help you talk about money, poverty, greed, generosity and cheating.",
      "那个贪赃枉法的（**venal**）官员收受贿赂，他的贪欲（**cupidity**）随每笔交易增长，事情败露后他企图卷走（**abscond**）镇上的钱潜逃。这十个词帮你谈论金钱、贫穷、贪婪、慷慨和欺诈。",
    ),
    watchOut: {
      meanings: t(
        "**Impecunious** means having no money, while **pecuniary** means having to do with money; an impecunious student is poor, but a pecuniary reward is a reward paid in money.",
        "**impecunious** 是身无分文的；**pecuniary** 是与金钱有关的；impecunious student 是穷学生，pecuniary reward 是金钱奖励。",
      ),
      use: t(
        "You **bilk** someone out of money and **abscond** with money or from a place, but you **aggrandize** yourself or your family with no word between.",
        "**bilk** 某人 out of 钱；**abscond** with 钱或 from 某地；**aggrandize** 直接接宾语，如 aggrandize himself。",
      ),
      spelling: t(
        "**Largesse** ends in -esse, **mendicant** ends in -ant, and **aggrandize** has a double g.",
        "**largesse** 结尾是 -esse；**mendicant** 结尾是 -ant；**aggrandize** 双写 g。",
      ),
    },
    notes: `
      impecunious|an artist unable to pay his rent|a family selling furniture to buy food|a reader too poor to buy books|impecunious means having little or no money; pecuniary means having to do with money|impecunious 是贫穷的；pecuniary 是金钱上的|pecuniary describes things to do with money, such as a reward, not a person too poor to pay rent or buy books|pecuniary 形容与钱有关的事物，如奖励，不形容付不起房租或买不起书的人|venal means open to bribery, not too poor to buy food or books|venal 是贪赃的，不是穷得买不起食物或书|im · pe · cu · ni · ous|the -nious ending|结尾是 -nious
      pecuniary|a reward of five hundred pounds|debts, fees and unpaid wages|a share in a company's money|pecuniary means having to do with money; impecunious means having no money|pecuniary 是金钱上的；impecunious 是贫穷的|impecunious describes a poor person, not a reward, matters such as debts or an interest in a company|impecunious 形容穷人，不形容奖励、债务之类的事务或公司利益|venal describes a person open to bribery, not a reward, debts or an interest in a company|venal 形容受贿的人，不形容奖励、债务或公司利益|pe · cu · ni · ar · y|the -iary ending|结尾是 -iary
      lucre|money taken from a friend's enemies|money stolen from a bank|money made from fake medicine|lucre means money, especially money gained dishonestly; largesse means generous giving|lucre 是不义之财；largesse 是慷慨施舍|largesse means generous gifts, not money taken in betrayal, theft or fraud|largesse 是慷慨的赠予，不是出卖、偷窃或诈骗得来的钱|cupidity is greed itself, not the money that is stolen or hidden|cupidity 是贪欲本身，不是偷来或藏起来的钱|lu · cre|the -cre ending, said *ker*|结尾 -cre 读作 *ker*
      venal|a judge taking bribes|police letting crimes go for a fee|an official selling permits under the table|venal means open to bribery; impecunious means having no money|venal 是贪赃的；impecunious 是贫穷的|impecunious means poor, not willing to take bribes or sell favours|impecunious 是贫穷，不是愿意受贿或出卖权力|pecuniary describes things to do with money, not a person who takes bribes|pecuniary 形容与钱有关的事物，不形容受贿的人|ve · nal|the long e, as in *venus*|长音 e，同 *venus*
      cupidity|a man who always wanted more money|buyers tempted by promises of easy riches|a rich man stealing out of greed, not need|cupidity means greed for money or possessions; largesse means generosity in giving|cupidity 是贪婪；largesse 是慷慨|largesse means generous giving, the opposite of always wanting more or stealing from workers|largesse 是慷慨施舍，和贪得无厌、克扣工人正好相反|lucre is money itself, not the greed that wants it|lucre 是钱本身，不是想要钱的贪欲|cu · pid · i · ty|the word *cupid* inside|里面有 *cupid*
      largesse|a donor giving millions for a library|a king giving gold to the poor|a lord paying for a school and a well|largesse means generosity in giving money or gifts; cupidity means greed|largesse 是慷慨；cupidity 是贪婪|cupidity means greed, the opposite of giving millions, gold or a school away|cupidity 是贪婪，和捐出巨款、黄金或学校正好相反|lucre means dishonest money, not the generosity of a donor, a king or a lord|lucre 是不义之财，不是捐赠者、国王或领主的慷慨|lar · gesse|the -esse ending|结尾是 -esse
      mendicant|a man holding out a bowl at a temple gate|a monk begging from door to door|a man in rags asking for coins|a mendicant is a beggar; a dupe is a person who is easily fooled|mendicant 是乞丐；dupe 是易受骗的人|a dupe is someone who has been fooled, not someone who begs for coins or food|dupe 是被骗的人，不是乞讨硬币或食物的人|a convict is a person in prison for a crime, not someone who begs for coins or food at a gate or door|convict 是服刑的犯人，不是在门口乞讨硬币或食物的人|men · di · cant|the -ant ending|结尾是 -ant
      bilk|a builder charging for work he never did|a firm taking investors' savings with false accounts|a con man slipping away without paying|bilk means to cheat someone out of money; abscond means to run away secretly|bilk 是诈骗钱财；abscond 是潜逃|abscond means to run away, and it cannot take a woman, investors or a hotel followed by out of their money|abscond 是潜逃，后面不能接人或酒店再加 out of 钱|aggrandize means to make more powerful, not to cheat someone out of money|aggrandize 是扩大权势，不是骗人钱财|bilk|the -ilk ending, as in *milk*|结尾 -ilk，同 *milk*
      abscond|a treasurer leaving town with the club's money|prisoners slipping out of a camp at night|a man fleeing abroad with stolen gold|abscond means to leave secretly, often with money or to avoid arrest; bilk means to cheat someone out of money|abscond 是潜逃；bilk 是诈骗|bilk needs a person after it, and it does not take with the money or from the camp|bilk 后要接人，不接 with 钱或 from 营地|aggrandize needs an object and means to make more powerful, not to flee|aggrandize 需要宾语，是扩大权势，不是逃跑|ab · scond|the -scond ending|结尾是 -scond
      aggrandize|a dictator building statues of himself|a company buying up every rival|a woman giving her family land and titles|aggrandize means to increase the power or wealth of; abscond means to run away secretly|aggrandize 是扩大权势、财富；abscond 是潜逃|abscond means to run away and takes no object, so it cannot take himself, itself or her family|abscond 是潜逃，不接宾语，不能接 himself、itself 或 her family|bilk means to cheat someone, not to make them more powerful|bilk 是骗人，不是使人更有权势|ag · gran · dize|the double g|双写 g
    `,
  },
);

const praiseBlame = batch(
  "words-of-acclaim-and-abuse",
  ["Words of Acclaim and Abuse", "赞誉与辱骂的词"],
  ["approval and honor, insult and public shame", "赞许与荣誉、侮辱与公开羞辱"],
  `
  approbation|approval or praise|认可，赞许|The plan won the ___ of the whole council, who voted for it as one.|She looked to her father for ___, hoping he would be proud of her.|The new law met with public ___, and crowds cheered in the streets.|obloquy,calumny|
  plaudit|an expression of praise or approval|赞扬，喝彩|The best ___ the young chef ever received was a note from her old teacher that said simply "Perfect".|Each ___ from the critics made the young writer prouder.|The goalkeeper's save earned the highest ___ of the season from the coach.|calumny,obloquy|plaudits
  encomium|a speech or piece of writing that praises highly|赞词|At the funeral, his oldest friend delivered a moving ___ praising his kindness.|The book opens with a long ___ to the author's teacher, full of warm praise.|The poet wrote a famous ___ in honour of the queen, praising her wisdom.|calumny,obloquy|encomiums
  laudatory|expressing praise and commendation|赞美的|The reviews were so ___ that the tickets sold out in a day.|He gave a ___ speech, praising the volunteers for their hard work.|Her teacher wrote a ___ letter of recommendation, full of praise.|reprehensible,fatuous|
  obloquy|strong public criticism or verbal abuse|辱骂，恶名|After the scandal he faced public ___, attacked in every newspaper.|She endured years of ___ for her unpopular views, insulted wherever she went.|The traitor's name became a word of ___, spoken only with contempt.|approbation,encomium|
  opprobrium|harsh criticism or censure; public disgrace|斥责；耻辱|The cruel act brought ___ on the whole family, who were disgraced in the town.|The company faced international ___ after the oil spill.|Despite public ___ and calls to resign, the minister stayed in his job.|approbation,encomium|
  calumny|the making of false statements to damage someone's reputation|诽谤|He sued the paper for ___, saying its story about him was a pack of lies.|She was the victim of vile ___, false rumours spread to ruin her name.|No amount of ___ could destroy his good name, because people knew the stories were untrue.|encomium,plaudit|calumnies
  pillory|to attack or ridicule publicly|公开羞辱|The newspapers began to ___ the minister, mocking him on every front page.|Comedians love to ___ the rich and famous, holding them up to public ridicule on TV.|The crowd gathered as if to ___ the captured thief in the square, jeering and throwing rotten fruit.|lionize,exculpate|pilloried
  vituperate|to blame or insult in strong or violent language|辱骂|Instead of explaining, he would ___ his critics, calling them fools and liars.|The coach began to ___ the referee in language too rude to print.|She would ___ anyone who disagreed with her, heaping insults on them.|lionize,exculpate|vituperative,vituperation
  fulminate|to express vehement protest|大声斥责|The old senator would ___ against the new tax in long, furious speeches.|Readers wrote in to ___ against the paper's decision, their letters full of rage.|He liked to ___ about the young people of today, shouting angrily at the TV.|vituperate,demur|fulminated
  `,
  "context-clues",
  {
    intro: t(
      "The singer's first album won **approbation** from the critics and every **plaudit** going, but a year later the papers began to **pillory** her and she faced public **obloquy**. These ten words help you talk about praise, approval, public abuse, lies and angry attacks.",
      "这位歌手的首张专辑赢得了评论界的赞许（**approbation**）和各种赞誉（**plaudit**），可一年后报纸开始公开嘲讽（**pillory**）她，她遭到公众的辱骂（**obloquy**）。这十个词帮你谈论赞扬、认可、公开辱骂、诽谤和愤怒抨击。",
    ),
    watchOut: {
      meanings: t(
        "**Calumny** is a false statement made to damage someone, while **obloquy** is harsh public criticism, true or not; calumny is a lie, obloquy is abuse.",
        "**calumny** 是为了毁人名誉而编造的谎言；**obloquy** 是公众的严厉谴责，不论真假；calumny 是谎言，obloquy 是辱骂。",
      ),
      use: t(
        "You **fulminate** against something, but you **vituperate** and **pillory** a person with no word between, and you win the **approbation** of someone.",
        "**fulminate** 后接 against；**vituperate** 和 **pillory** 直接接人；win the **approbation** of 某人。",
      ),
      spelling: t(
        "**Opprobrium** has a double p, **pillory** has a double l, and **laudatory** ends in -atory.",
        "**opprobrium** 双写 p；**pillory** 双写 l；**laudatory** 结尾是 -atory。",
      ),
    },
    notes: `
      approbation|a council voting for a plan as one|a daughter hoping her father will be proud|crowds cheering a new law|approbation means approval or praise; obloquy means strong public criticism|approbation 是赞许；obloquy 是公开辱骂|obloquy means public abuse, the opposite of votes, pride or cheering crowds|obloquy 是公开辱骂，和投票支持、骄傲或欢呼正好相反|calumny means false statements that damage a name, not the approval of a council, a father or a crowd|calumny 是诽谤，不是议会、父亲或民众的赞许|ap · pro · ba · tion|the -tion ending|结尾是 -tion
      plaudit|a teacher's note that said "Perfect"|praise from critics that made a writer proud|a coach praising a save|a plaudit is an expression of praise; a calumny is a lie told to damage someone|plaudit 是赞扬；calumny 是诽谤|calumny means lies that damage a name, not a note, praise or a coach's admiration|calumny 是毁坏名誉的谎言，不是赞美的便条或教练的称赞|obloquy means public abuse, not praise that makes someone proud|obloquy 是公开辱骂，不是令人骄傲的赞扬|plau · dit|the au, as in *applaud*|au 读音同 *applaud*
      encomium|a moving speech praising a friend's kindness|a long piece of warm praise for a teacher|a poem praising a queen's wisdom|an encomium is a speech or piece of writing full of high praise; a calumny is a false statement made to damage someone|encomium 是颂词；calumny 是诽谤|calumny means damaging lies, not a speech, a book opening or a poem full of praise|calumny 是毁人名誉的谎言，不是满是赞美的悼词、序言或诗|obloquy means abuse, not a moving speech or poem of praise|obloquy 是辱骂，不是感人的颂词或赞美诗|en · co · mi · um|the -ium ending|结尾是 -ium
      laudatory|reviews so good the tickets sold out|a speech praising volunteers|a letter full of praise|laudatory means full of praise; reprehensible means deserving blame|laudatory 是赞美的；reprehensible 是该受谴责的|reprehensible means deserving blame, the opposite of reviews, a speech or a letter full of praise|reprehensible 是应受谴责的，和满含赞美的评论、讲话或信件正好相反|fatuous means silly, and silly reviews or letters would not be full of praise and sell out a show|fatuous 是愚蠢的，愚蠢的评论或信件不会满是赞美、令票卖光|lau · da · to · ry|the -atory ending|结尾是 -atory
      obloquy|a man attacked in every newspaper|a woman insulted for her views|a name spoken only with contempt|obloquy means strong public criticism or abuse; approbation means approval|obloquy 是公开辱骂；approbation 是赞许|approbation means approval, the opposite of being attacked, insulted or spoken of with contempt|approbation 是赞许，和受攻击、被辱骂或遭鄙视正好相反|an encomium is a speech of praise, not attacks and insults|encomium 是颂词，不是攻击和辱骂|ob · lo · quy|the -quy ending, said *kwee*|结尾 -quy 读作 *kwee*
      opprobrium|a family disgraced by a cruel act|worldwide anger after an oil spill|public calls for a minister to resign|opprobrium means public disgrace and harsh blame; approbation means approval|opprobrium 是公众谴责与耻辱；approbation 是赞许|approbation means approval, the opposite of disgrace, anger or calls to resign|approbation 是赞许，和耻辱、愤怒或要求辞职正好相反|an encomium is a speech of praise, not disgrace and blame|encomium 是颂词，不是耻辱与谴责|op · pro · bri · um|the double p and the -ium ending|双写 p，结尾是 -ium
      calumny|a newspaper story that was a pack of lies|false rumours spread to ruin a name|untrue stories that could not destroy a good name|calumny means false statements made to damage someone's name; an encomium is a speech of high praise|calumny 是诽谤；encomium 是颂词|an encomium is praise, and no one sues over praise or is a victim of it|encomium 是赞美，没人会因赞美而起诉或受害|a plaudit is an expression of praise, not lies that ruin a name|plaudit 是赞扬，不是毁人名誉的谎言|cal · um · ny|the -ny ending|结尾是 -ny
      pillory|newspapers mocking a minister on every front page|comedians holding the famous up to public ridicule|a crowd jeering at a captured thief|pillory means to attack or mock someone in public; lionize means to treat someone as a celebrity|pillory 是公开嘲讽；lionize 是捧为名人|lionize means to praise and celebrate someone, the opposite of mocking or jeering at them|lionize 是追捧，和嘲讽或起哄正好相反|exculpate means to clear someone of blame, not to mock them in public|exculpate 是证明无罪，不是公开嘲讽|pil · lo · ry|the double l|双写 l
      vituperate|a man calling his critics fools and liars|a coach using language too rude to print|a woman heaping insults on anyone who disagrees|vituperate means to attack someone with violent insults; lionize means to treat someone as a celebrity|vituperate 是痛骂；lionize 是追捧|lionize means to celebrate someone, the opposite of calling them fools or heaping insults on them|lionize 是追捧，和骂人是傻瓜或辱骂正好相反|exculpate means to clear someone of blame, not to insult them|exculpate 是证明无罪，不是辱骂|vi · tu · per · ate|the -perate ending|结尾是 -perate
      fulminate|a senator making furious speeches against a tax|readers writing letters full of rage|a man shouting angrily at the TV|fulminate means to protest with great anger; vituperate means to insult a person violently|fulminate 是怒斥抗议；vituperate 是痛骂某人|vituperate needs a person after it and does not take against or about|vituperate 后要直接接人，不接 against 或 about|demur means to raise mild doubts, not to protest in rage|demur 是温和地提出异议，不是愤怒抗议|ful · mi · nate|the -nate ending|结尾是 -nate
    `,
  },
);

const awkward = batch(
  "words-of-awkward-fixes",
  ["Words of Awkward Fixes", "尴尬处境的词"],
  ["dilemmas, blunders, shame and anxious care", "两难、笨拙、可耻与焦虑的关切"],
  `
  adverse|preventing success; harmful|不利的|The flight was delayed by ___ weather, with strong winds and thick fog.|The drug can have ___ effects, such as headaches and sickness, so read the label.|The long drought had a seriously ___ impact on the harvest, and many farmers lost their crops.|reprehensible,obtuse|adversely
  obtuse|slow to understand; of an angle, more than 90 degrees|迟钝的；钝角的|He was being deliberately ___, pretending not to understand the simple question.|Any angle wider than ninety degrees but less than one hundred and eighty is called ___.|How can you be so ___? I have explained it three times, and you still do not see it!|adverse,ignoble|obtuseness
  quandary|a state of uncertainty about what to do|困惑，窘境|Torn between two good job offers, she was in a real ___ about which to accept.|The vote left the party in a terrible ___: whichever choice it made, it would lose voters.|Faced with the ___ of whether to tell his friend the truth, he lay awake all night.|imbroglio,stupor|quandaries
  reprehensible|deserving censure or condemnation|应受谴责的|Cheating old people out of their savings is ___ behaviour that deserves severe punishment.|It was ___ of him to lie to his own mother about where the money had gone.|The judge called the attack on the nurse ___ and gave the man a long sentence.|solicitous,laudatory|
  solicitous|showing interest or concern|关切的|The nurse was ___ of her patients, asking each morning how they had slept.|He was very ___ about his grandmother's health, phoning her every day to check on her.|The ___ waiter kept checking that we had everything we needed.|obtuse,lenient|solicitously,solicitude
  stupor|a state of near-unconsciousness|昏迷，恍惚|After drinking far too much, he fell into a ___ and could not be woken.|The injured man lay in a ___, barely conscious and unable to answer when spoken to.|Stunned by the news, she sat in a ___, staring at nothing for hours, deaf to everyone who spoke to her.|quandary,lassitude|
  imbroglio|an extremely confused or embarrassing situation|纠葛，尴尬局面|The diplomatic ___ began when the ambassador's driver crashed into a police car and both countries blamed each other.|The minister's lies dragged the government into an embarrassing ___ that filled the papers for months.|Their wedding plans turned into a comic ___ of lost rings, double bookings and two angry families.|quandary,stupor|imbroglios
  discomfit|to make someone feel uneasy or embarrassed|使困惑，使难堪|The sudden question seemed to ___ the speaker, who blushed and lost his place.|Her steady stare was meant to ___ him, and he shifted nervously in his seat.|Nothing could ___ the calm old teacher, not even the noisiest class.|disabuse,delude|discomfited,discomfiture
  ignoble|not honorable in character or purpose|卑鄙的，不光彩的|He reached power by ___ means, lying and betraying his friends.|Running away and leaving his men to die was a deeply ___ act.|She was ashamed of her ___ motives for helping, since she only wanted praise.|adverse,obtuse|ignobly
  turpitude|depraved or wicked behavior|卑鄙，邪恶|The officer was dismissed for moral ___ after stealing from the dead.|Stories of the king's ___, his cruelty and his greed, shocked the nation.|The novel shows a city sunk in ___, full of crime and vice.|calumny,opprobrium|
  `,
  "context-clues",
  {
    intro: t(
      "The minister's lies landed him in an **imbroglio**, his advisers were in a **quandary**, and even his **solicitous** secretary could not hide how **reprehensible** it all was. These ten words help you talk about tricky situations, bad conduct, concern and confusion.",
      "部长的谎言让他陷入了一场尴尬的乱局（**imbroglio**），顾问们进退两难（**quandary**），连他那体贴的（**solicitous**）秘书也无法掩饰这一切有多么应受谴责（**reprehensible**）。这十个词帮你谈论棘手局面、恶劣行为、关切和迷乱。",
    ),
    watchOut: {
      meanings: t(
        "A **quandary** is uncertainty about which choice to make, while an **imbroglio** is a messy, embarrassing situation that many people are tangled in; you are in a quandary alone, but an imbroglio drags others in.",
        "**quandary** 是不知如何选择的困惑；**imbroglio** 是牵扯多方的混乱尴尬局面；quandary 是自己左右为难，imbroglio 会把别人卷进来。",
      ),
      use: t(
        "**Discomfit** is a verb, as in discomfit the speaker, while **solicitous** is an adjective that takes of or about, as in solicitous of her patients.",
        "**discomfit** 是动词，如 discomfit the speaker；**solicitous** 是形容词，后接 of 或 about，如 solicitous of her patients。",
      ),
      spelling: t(
        "**Imbroglio** has a silent g, **turpitude** ends in -tude, and **reprehensible** ends in -ible, not -able.",
        "**imbroglio** 中的 g 不发音；**turpitude** 结尾是 -tude；**reprehensible** 结尾是 -ible，不是 -able。",
      ),
    },
    notes: `
      adverse|strong winds and fog delaying a flight|a drug causing headaches and sickness|a drought ruining a harvest|adverse means harmful or working against success; reprehensible means deserving blame|adverse 是不利的、有害的；reprehensible 是应受谴责的|reprehensible describes wrong behaviour that people are blamed for, not weather, side effects or a drought|reprehensible 形容该受谴责的行为，不形容天气、副作用或干旱|obtuse means slow to understand, not harmful weather, effects or impact|obtuse 是迟钝的，不形容有害的天气、作用或影响|ad · verse|the -verse ending, as in *verse*|结尾 -verse，同 *verse*
      obtuse|a man pretending not to understand a simple question|an angle wider than ninety degrees|someone who still does not see after three explanations|obtuse means slow to understand, or of an angle, wider than ninety degrees; adverse means harmful|obtuse 是迟钝的，也指钝角；adverse 是不利的|adverse means harmful, not slow to understand or wider than a right angle|adverse 是有害的，不是迟钝或钝角|ignoble means dishonourable, not slow to understand or wider than a right angle|ignoble 是卑鄙的，不是迟钝或钝角|ob · tuse|the -tuse ending|结尾是 -tuse
      quandary|a woman torn between two job offers|a party that loses whichever way it votes|a man lying awake over whether to tell the truth|a quandary is uncertainty about what to do; an imbroglio is a confused, embarrassing mess|quandary 是进退两难；imbroglio 是混乱尴尬的局面|an imbroglio is a tangled mess involving many people, not one person's uncertainty about which choice to make|imbroglio 是牵扯多方的混乱局面，不是某人不知该如何选择|a stupor is a state of near-unconsciousness, not uncertainty about a choice|stupor 是神志不清，不是不知如何选择|quan · da · ry|the -ary ending|结尾是 -ary
      reprehensible|cheating old people of their savings|lying to one's own mother|an attack on a nurse that earned a long sentence|reprehensible means deserving blame; solicitous means caring and concerned|reprehensible 是应受谴责的；solicitous 是关切的|solicitous means caring and concerned, not cheating, lying or attacking|solicitous 是关切体贴的，不是欺诈、撒谎或袭击|laudatory means full of praise, the opposite of deserving punishment|laudatory 是赞美的，和应受惩罚正好相反|rep · re · hen · si · ble|the -ible ending|结尾是 -ible
      solicitous|a nurse asking patients how they slept|a grandson phoning his grandmother every day|a waiter checking that diners have everything|solicitous means showing care and concern; obtuse means slow to understand|solicitous 是关切的；obtuse 是迟钝的|obtuse means slow to understand, not caring about patients, a grandmother or diners|obtuse 是迟钝的，不是关心病人、祖母或食客|lenient means gentle in punishing, and it does not go with of or about someone's health|lenient 是惩罚宽大，不和 of 或 about 健康连用|so · lic · i · tous|the -itous ending|结尾是 -itous
      stupor|a drunk man who could not be woken|an injured man barely conscious and unable to answer|a stunned woman staring at nothing for hours|a stupor is a state of near-unconsciousness; a quandary is uncertainty about what to do|stupor 是神志不清；quandary 是进退两难|a quandary is a choice you cannot settle, not being unable to wake or barely aware|quandary 是难以抉择，不是叫不醒或神志不清|lassitude is tiredness, but a tired person can still be woken, answer and hear others|lassitude 是疲倦，疲倦的人仍能被叫醒、能回答、能听见别人|stu · por|the -or ending|结尾是 -or
      imbroglio|a crash that set two countries blaming each other|lies that filled the papers for months|a wedding of lost rings and angry families|an imbroglio is a confused, embarrassing situation; a quandary is uncertainty about what to do|imbroglio 是混乱尴尬的局面；quandary 是进退两难|a quandary is one person's uncertainty, not a tangled public mess that drags in countries, a government or families|quandary 是个人的犹豫，不是把国家、政府或家庭卷进去的乱局|a stupor is near-unconsciousness, not a mess of events|stupor 是神志不清，不是一团乱的事情|im · bro · glio|the silent g|g 不发音
      discomfit|a speaker blushing at a sudden question|a stare making a man shift nervously|a calm teacher nothing could unsettle|discomfit means to make someone uneasy or embarrassed; disabuse means to free someone from a false idea|discomfit 是使人不安、窘迫；disabuse 是纠正错误想法|disabuse needs of and an idea after the person, so it cannot mean making a speaker blush or a man nervous|disabuse 要在人后接 of 加想法，不能表示让人脸红或紧张|delude means to make someone believe something false, not to make them uneasy|delude 是蒙骗，不是使人不安|dis · com · fit|the -fit ending|结尾是 -fit
      ignoble|lying and betraying friends to reach power|running away and leaving one's men to die|helping only to win praise|ignoble means dishonourable; adverse means harmful|ignoble 是卑鄙的；adverse 是不利的|adverse means harmful, as weather or effects are, not dishonourable means, acts or motives|adverse 是不利的，如天气或副作用，不形容卑鄙的手段、行为或动机|obtuse means slow to understand, not dishonourable|obtuse 是迟钝的，不是卑鄙的|ig · no · ble|the ig- before *noble*|*noble* 前加 ig-
      turpitude|an officer stealing from the dead|a king's cruelty and greed|a city full of crime and vice|turpitude means wicked behaviour; calumny means lies told to damage someone|turpitude 是堕落邪恶的行为；calumny 是诽谤|calumny means damaging lies, not stealing, cruelty, greed or vice|calumny 是诽谤，不是偷窃、残暴、贪婪或罪恶|opprobrium means the public blame that follows wrongdoing, not the wicked acts themselves|opprobrium 是恶行招来的公众谴责，不是恶行本身|tur · pi · tude|the -tude ending|结尾是 -tude
    `,
  },
);

const hardTasks = batch(
  "words-of-hard-and-costly-tasks",
  ["Words of Hard and Costly Tasks", "艰巨与昂贵任务的词"],
  ["the complex, the heavy, the exhausting and the overpriced", "复杂、笨重、累人与昂贵"],
  `
  intricate|very complicated or detailed|错综复杂的|The old watch's ___ workings had hundreds of tiny parts, each fitted by hand.|Persian carpets have ___ patterns of knots, flowers and birds.|The plot of the novel is so ___ that you need a chart to follow all its twists.|cumbersome,paltry|intricately,intricacy
  cumbersome|large or heavy and therefore difficult to carry or use|笨重的；繁琐的|The ___ old suitcase was so big and heavy that he could barely lift it.|Early computers were ___ machines, so huge and heavy that moving one took six men.|Weighed down by ___ armour, the knight could hardly climb onto his horse.|intricate,paltry|
  elaborate|involving many carefully arranged parts; to add more detail|精心制作的；详细阐述|They planned the most ___ wedding, with fireworks, three bands and a carriage pulled by white horses.|The thieves came up with a very ___ plan, with every step carefully worked out in advance.|She cooked a highly ___ meal of twelve courses, each with its own sauce.|paltry,cumbersome|elaborately,elaboration
  grueling|extremely tiring and demanding|累人的|After a ___ climb of twelve hours, they reached the top, too exhausted to speak.|The soldiers faced a ___ march of forty miles through the desert heat.|Nurses work ___ shifts that leave them worn out by morning.|paltry,cumbersome|
  strenuous|requiring or using great effort|费力的|Avoid ___ exercise, such as running or lifting, for a week after the operation.|Despite ___ efforts by hundreds of firefighters, they could not save the building.|Digging the garden is ___ work that leaves you sweating and out of breath.|paltry,exorbitant|strenuously
  formidable|inspiring fear or respect through power or size|令人敬畏的；艰巨的|The champion is a ___ opponent whom other boxers fear to face.|The army faced the ___ task of crossing the mountains in winter.|She has a ___ memory that frightens her rivals in every quiz.|paltry,cumbersome|formidably
  stupendous|extremely impressive|惊人的|The view from the top was ___, the most amazing sight they had ever seen.|He made a ___ effort in the last lap and won the race by a mile.|The film was a ___ success, earning billions around the world.|paltry,cumbersome|stupendously
  outlandish|looking or sounding bizarre or unfamiliar|稀奇古怪的|She turned up in the most ___ hat, a bizarre thing shaped like a fish.|His ___ story of being carried off by aliens made everyone laugh.|The ___ costumes of the foreign dancers looked strange to the villagers, who had never seen anything like them.|exorbitant,paltry|
  exorbitant|unreasonably high, of a price|过高的|The hotel charged ___ prices for bottled water, ten times more than in the shops.|Rents in the city centre have become ___, far more than most workers can pay.|The bank's ___ fees ate up most of the money he had saved.|paltry,stupendous|exorbitantly
  paltry|small or meaningless|微不足道的|He was paid the ___ sum of two pounds, hardly enough for a cup of coffee.|Their ___ offer of ten pounds for the car was an insult.|The ___ crowd of a dozen fans looked lost in the huge stadium.|exorbitant,cumbersome|
  `,
  "context-clues",
  {
    intro: t(
      "The climb was **grueling**, the gear was **cumbersome**, the guide's fee was **exorbitant**, and yet the view from the top was **stupendous**. These ten words help you talk about how complex, heavy, hard, impressive, strange or costly a task can be.",
      "攀登令人筋疲力尽（**grueling**），装备笨重（**cumbersome**），向导费贵得离谱（**exorbitant**），但山顶的风景壮观极了（**stupendous**）。这十个词帮你谈论一项任务有多复杂、笨重、艰苦、惊人、怪异或昂贵。",
    ),
    watchOut: {
      meanings: t(
        "**Intricate** means having many small parts that fit together, while **elaborate** means carefully planned with many added details; a watch's workings are intricate, a wedding is elaborate.",
        "**intricate** 是由许多小部件精密组成的；**elaborate** 是精心策划、细节繁多的；手表机芯 intricate，婚礼 elaborate。",
      ),
      use: t(
        "**Exorbitant** describes a price, fee or rent that is too high, and **paltry** describes a sum or an amount that is too small, so you say exorbitant fees and a paltry sum.",
        "**exorbitant** 形容价格、费用或房租太高；**paltry** 形容金额或数量太少；说 exorbitant fees 和 a paltry sum。",
      ),
      spelling: t(
        "**Grueling** is spelled with one l in American English and **gruelling** with two in British English, and **exorbitant** has no h after the x.",
        "美式拼作 **grueling**，一个 l；英式拼作 gruelling，两个 l；**exorbitant** 在 x 后没有 h。",
      ),
    },
    notes: `
      intricate|a watch with hundreds of tiny hand-fitted parts|carpet patterns of knots, flowers and birds|a plot that needs a chart to follow|intricate means having many small parts or details; cumbersome means large and heavy|intricate 是错综复杂的；cumbersome 是笨重的|cumbersome means big and heavy to carry, not full of tiny parts, patterns or twists|cumbersome 是又大又重，不是满是小零件、花纹或曲折|paltry means small and meaningless, not complicated and detailed|paltry 是微不足道的，不是复杂精细的|in · tri · cate|the -cate ending|结尾是 -cate
      cumbersome|a suitcase too big and heavy to lift|computers so heavy that moving one took six men|armour that kept a knight from climbing on his horse|cumbersome means large or heavy and hard to carry or use; intricate means complicated in detail|cumbersome 是笨重的；intricate 是复杂精细的|intricate means detailed and complicated, not too big and heavy to lift or move|intricate 是复杂精细，不是太大太重搬不动|paltry means small, the opposite of huge and heavy|paltry 是微小的，和又大又重正好相反|cum · ber · some|the -some ending|结尾是 -some
      elaborate|a wedding with fireworks, three bands and a carriage|a theft planned step by step|a twelve-course meal with a sauce for each|elaborate means carefully planned with many parts or details; paltry means small and meaningless|elaborate 是精心的、繁复的；paltry 是微不足道的|paltry means small and poor, the opposite of a wedding, plan or meal with many careful parts|paltry 是寒酸微小的，和精心繁复的婚礼、计划或大餐正好相反|cumbersome means heavy and hard to carry, not carefully planned in detail|cumbersome 是笨重难搬的，不是精心策划的|e · lab · o · rate|the -orate ending|结尾是 -orate
      grueling|a twelve-hour climb that left people too tired to speak|a forty-mile march in desert heat|shifts that wear nurses out|grueling means extremely tiring and demanding; paltry means small and meaningless|grueling 是累垮人的；paltry 是微不足道的|paltry means small, not a climb, a march or shifts that exhaust people|paltry 是微小的，不形容累垮人的攀登、行军或轮班|cumbersome describes a heavy, awkward object, not a climb, a march or a shift that wears people out|cumbersome 形容笨重的物件，不形容累人的攀登、行军或轮班|gru · el · ing|the word *gruel* inside|里面有 *gruel*
      strenuous|exercise such as running or lifting after an operation|great efforts by hundreds of firefighters|digging that leaves you out of breath|strenuous means needing great effort; paltry means small and meaningless|strenuous 是费力的；paltry 是微不足道的|paltry means small and poor, not exercise, efforts or work that take great effort|paltry 是微小的，不形容费力的运动、努力或劳动|exorbitant describes a price that is too high, not effort or work|exorbitant 形容价格太高，不形容努力或劳动|stren · u · ous|the -uous ending|结尾是 -uous
      formidable|a boxer whom others fear to face|crossing mountains in winter|a memory that frightens rivals|formidable means inspiring fear or respect through power or difficulty; paltry means small and meaningless|formidable 是令人生畏的；paltry 是微不足道的|paltry means small and weak, the opposite of an opponent, task or memory that frightens people|paltry 是微不足道的，和令人生畏的对手、任务或记忆正好相反|cumbersome describes a heavy object that is hard to carry, not an opponent, a task or a memory that people fear|cumbersome 形容难搬的笨重物件，不形容令人生畏的对手、任务或记忆|for · mi · da · ble|the -able ending|结尾是 -able
      stupendous|the most amazing sight ever seen|a last-lap effort that won by a mile|a film earning billions|stupendous means amazingly great or impressive; paltry means small and meaningless|stupendous 是惊人的、了不起的；paltry 是微不足道的|paltry means small and meaningless, the opposite of an amazing view, a winning effort or a huge success|paltry 是微不足道的，和壮观的景色、制胜的努力或巨大的成功正好相反|cumbersome means heavy and awkward, not amazing|cumbersome 是笨重的，不是惊人的|stu · pen · dous|the -dous ending|结尾是 -dous
      outlandish|a bizarre hat shaped like a fish|a story of being carried off by aliens|costumes unlike anything villagers had seen|outlandish means strange and bizarre; exorbitant means too high in price|outlandish 是古怪的；exorbitant 是贵得离谱的|exorbitant describes prices that are too high, not a hat, a story or costumes that look strange|exorbitant 形容价格太高，不形容古怪的帽子、故事或服装|paltry means small and meaningless, not strange and bizarre|paltry 是微不足道的，不是古怪的|out · land · ish|*out*, *land* and -ish|*out*、*land* 加 -ish
      exorbitant|water prices ten times the shop price|rents more than most workers can pay|fees that ate up a man's savings|exorbitant means far too high, of a price; paltry means too small|exorbitant 是贵得离谱的；paltry 是少得可怜的|paltry means too small, the opposite of prices, rents or fees that are far too high|paltry 是太少，和过高的价格、房租或费用正好相反|stupendous means amazing, and people do not complain about amazing prices that eat up savings|stupendous 是惊人的，不会用来抱怨吞掉积蓄的费用|ex · or · bi · tant|no h after the x|x 后没有 h
      paltry|a sum hardly enough for a coffee|an offer of ten pounds for a car|a crowd of a dozen in a huge stadium|paltry means small or meaningless; exorbitant means far too high|paltry 是少得可怜的；exorbitant 是过高的|exorbitant means far too high, the opposite of a tiny sum, a low offer or a small crowd|exorbitant 是过高的，和少得可怜的金额、出价或人群正好相反|cumbersome means large and heavy, not small and meaningless|cumbersome 是笨重的，不是微不足道的|pal · try|the -try ending|结尾是 -try
    `,
  },
);

/** batchesI are the batches of attack, fakes, arrest, mockery, decline, the senses, truth, drive, greed, acclaim, awkward fixes and hard tasks. */
export const batchesI: readonly BatchSpec[] = [
  attack,
  fakes,
  arrest,
  mockery,
  decline,
  senses,
  truth,
  energy,
  greed,
  praiseBlame,
  awkward,
  hardTasks,
];
