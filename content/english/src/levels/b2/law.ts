// B2, unit 9: Law, Rights and Justice. The law, the court, crime, punishment, rights, justice, policing, government,
// protest, formal verbs, and certainty and doubt; although, despite and however; the letter to an editor. Its other
// topic, misplaced modifiers, already exists.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const law = vocabularyTopic({
  id: "b2-words-law",
  title: t("The Law", "法律"),
  summary: t(
    "Legal and illegal, lawful and unlawful acts; statutes, constitutions and clauses; constitutional rights; legalizing, prohibiting and permitting; prohibition.",
    "合法的和非法的、合法的和违法的行为；成文法、宪法和条款；宪法权利；使合法化、禁止和允许；禁令。",
  ),
  intro: t(
    "The **constitution** is the highest law, each **statute** adds a written rule, and a single **clause** can **prohibit** what another country has **legalized**. These words help you talk about what the law allows, what it forbids and where it is written.",
    "**constitution**（宪法）是最高法律，每部 **statute**（成文法）增加一条书面规定，一项 **clause**（条款）就可能 **prohibit**（禁止）另一个国家已经 **legalized**（合法化）的事。这些词帮你谈论法律允许什么、禁止什么，以及写在哪里。",
  ),
  prerequisites: ["b1-words-crime"],
  words: [
    word(
      "legal",
      "allowed by the law; connected with the law",
      "合法的；法律的",
      "Is it {legal} to ride a bike on the sidewalk here, or will I get a fine? | She asked a lawyer for {legal} advice. | In some US states, teenagers can get a license because it is {legal} to drive at sixteen.",
      "illegal regal",
      "lawful",
    ),
    word(
      "illegal",
      "not allowed by the law",
      "非法的；违法的",
      "It is {illegal} to drive without a license. | The police found {illegal} drugs in the car and arrested the driver. | Selling cigarettes to children is {illegal} in most countries.",
      "legal eligible",
      "unlawful",
    ),
    word(
      "lawful",
      "allowed by the law, especially in formal or legal language",
      "合法的",
      "The judge ruled that the arrest was {lawful}, so the evidence could be used. | He is the {lawful} owner of the land, as the court has confirmed. | Protest is {lawful} in a democracy, as long as it is peaceful.",
      "unlawful awful",
      "legal",
    ),
    word(
      "unlawful",
      "not allowed by the law, especially in formal or legal language",
      "违法的；非法的",
      "The court decided that his dismissal was {unlawful}, and he got his job back. | {Unlawful} entry into a building is a crime. | The police were accused of {unlawful} arrest, holding him without any reason.",
      "lawful unruly",
      "illegal",
    ),
    word(
      "statute statutes",
      "a law that has been formally written down and passed by a parliament",
      "成文法；法规",
      "The {statute} was passed by parliament in 1998. | Old {statutes} that no court uses any more are being removed from the law books.|statues statures | The punishment is set out in the {statute}.",
      "statue stature",
      "clause",
    ),
    word(
      "constitution constitutions",
      "the set of basic laws and principles of a country",
      "宪法",
      "Freedom of speech is written into the {constitution}. | Some countries do not have a written {constitution}. | The new {constitution} was approved by voters and became the country's highest law.",
      "institution contribution",
      "statute",
    ),
    word(
      "constitutional",
      "connected with or allowed by a country's constitution",
      "宪法的；符合宪法的",
      "The court must decide whether the new law is {constitutional} or breaks the constitution. | Freedom of religion is one of the {constitutional} rights that every citizen has. | In {constitutional} monarchies, a king or queen shares power with a parliament.",
      "unconstitutional conventional",
    ),
    word(
      "clause clauses",
      "a section of a legal document or a contract",
      "条款",
      "A {clause} in the contract lets either side end it with a month's notice. | Read every {clause} of the contract before you sign. | The new {clauses} in the contract protect workers' rights.|causes claws",
      "cause claws",
      "statute",
    ),
    word(
      "legalize legalizes legalized legalizing",
      "to make something legal",
      "使合法化",
      "Same-sex marriage is now allowed in many countries that have {legalized} it.|prohibited localized | Gambling is illegal here, but some want the government to {legalize} it. | The new law {legalizes} the drug for medical use, so doctors can now prescribe it.|prohibits localizes",
      "prohibit localize",
      "permit",
    ),
    word(
      "prohibit prohibits prohibited prohibiting",
      "to officially stop something from being done, especially by law",
      "禁止",
      "Smoking is {prohibited} in all restaurants; you must go outside.|permitted exhibited | The rules {prohibit} the use of phones during the exam, so leave yours at the door. | A new law {prohibits} selling knives to children to keep them safe.|permits exhibits",
      "permit exhibit",
      "prohibition",
    ),
    word(
      "prohibition",
      "a law or rule that stops something from being done; the period when alcohol was illegal in the US",
      "禁令；（美国）禁酒令",
      "The {prohibition} on fishing in the lake means nobody may fish there. | During {Prohibition}, alcohol was illegal in the United States.|Permission Exhibition | The {prohibition} of plastic bags reduced litter.",
      "permission exhibition",
      "prohibit",
    ),
    word(
      "permit permits permitted permitting",
      "to allow something; a document that allows you to do something",
      "允许；许可证",
      "Photography is not {permitted} in the museum, so please put your camera away.|prohibited permeated | You need a {permit} to fish here.|ban fine | Weather {permitting}, the match will start at noon.|prohibiting permeating",
      "prohibit permeate",
      "legalize",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Legalize* and *prohibit* are opposites: to *legalize* something is to make it allowed, to *prohibit* it is to ban it. Ask whether the sentence shows the thing becoming allowed or being stopped.",
        "*legalize* 和 *prohibit* 意思相反：*legalize* 是使其合法，*prohibit* 是禁止它。想想句子表明这件事是变得允许，还是被禁止。",
      ),
      meaning: t(
        "A *statute* is one written law passed by a parliament, while a *constitution* is the whole set of a country's basic laws. Check whether the meaning names one law or the basic framework.",
        "*statute* 是议会通过的一部成文法，*constitution* 是一个国家全部基本法律的总和。看释义说的是一部法律，还是根本法框架。",
      ),
      spell: t(
        "*Statute* has a t before the u, unlike *statue*, *illegal* doubles the l, and *legalize* ends in -ize.",
        "*statute* 的 u 前多一个 t，和 *statue* 不同，*illegal* 双写 l，*legalize* 以 -ize 结尾。",
      ),
    },
    notes: `
      legal|riding a bike without getting a fine;advice from a lawyer;driving at sixteen in some US states|legal means allowed by law; illegal means not allowed|legal 是合法的、法律的；illegal 是违法的|illegal=illegal means not allowed by law, the opposite of riding without a fine or being allowed to drive at sixteen=illegal 是违法的，和不被罚款、十六岁可以开车正相反;regal=regal means like a king or queen, not allowed by or connected with the law=regal 是帝王般的，不是合法的或法律的|le · gal|le + gal|le + gal
      illegal|driving without a license;drugs that got a driver arrested;selling cigarettes to children|illegal means not allowed by law; legal means allowed|illegal 是违法的；legal 是合法的|legal=legal means allowed by law, the opposite of something that gets you arrested or is banned in most countries=legal 是合法的，和会被逮捕、多数国家禁止的事正相反;eligible=eligible means having the right to do or get something, not forbidden by law=eligible 是有资格的，不是法律禁止的|il · le · gal|il + legal, with a double l|il + legal，双写 l
      lawful|an arrest whose evidence could be used;the owner of land confirmed by a court;peaceful protest in a democracy|lawful means allowed by law; unlawful means against it|lawful 是合法的；unlawful 是违法的|unlawful=unlawful means against the law, the opposite of evidence that could be used or an owner confirmed by a court=unlawful 是违法的，和证据可用、法院确认的所有者正相反;awful=awful means very bad, not allowed by law=awful 是糟糕的，不是合法的|law · ful|law + ful, with a single l at the end|law + ful，结尾只有一个 l
      unlawful|a dismissal that got a man his job back;entry into a building that is a crime;holding someone without any reason|unlawful means against the law; lawful means allowed by it|unlawful 是违法的；lawful 是合法的|lawful=lawful means allowed by law, the opposite of a crime or holding someone without reason=lawful 是合法的，和犯罪、无故拘押正相反;unruly=unruly means wild and hard to control, not against the law=unruly 是难以管束的，不是违法的|un · law · ful|un + lawful|un + lawful
      statute|a law passed by parliament in 1998;old written laws no court uses;the law that sets out a punishment|a statute is a written law; a statue is a figure made of stone or metal|statute 是成文法；statue 是雕像|statue/statues=a statue is a figure of stone or metal, not a law passed by parliament or used by courts=statue 是雕像，不是议会通过、法院使用的法律;stature/statures=stature is a person's height or importance, not a written law=stature 是身高或声望，不是成文法|stat · ute|stat + ute, with a t before the u|stat + ute，u 前有 t
      constitution|freedom of speech written into the basic law;a written set of basic laws;a country's highest law approved by voters|a constitution is a country's basic laws; an institution is an organization such as a bank or school|constitution 是宪法；institution 是机构|institution=an institution is an organization such as a university or bank, not a country's basic set of laws=institution 是机构，不是国家的基本法;contribution=a contribution is something you give to help, not a country's highest law=contribution 是贡献，不是国家最高法律|con · sti · tu · tion|con + stitut + ion|con + stitut + ion
      constitutional|a law that might break the constitution;rights every citizen has by the constitution;monarchies where a king shares power with parliament|constitutional means allowed by or about the constitution; unconstitutional means against it|constitutional 是符合宪法的；unconstitutional 是违宪的|unconstitutional=unconstitutional means against the constitution, the opposite of rights every citizen has or the choice set against breaking it=unconstitutional 是违宪的，和公民应有的权利、与违宪相对的选项正相反;conventional=conventional means usual or traditional, not about a constitution or rights it gives=conventional 是传统的、常规的，不是关于宪法或宪法权利的|con · sti · tu · tion · al|constitution + al|constitution + al
      clause|a part of a contract about ending it;every part of a contract to read before signing;new parts of a contract that protect rights|a clause is a section of a legal document; a cause is a reason|clause 是条款；cause 是原因|cause/causes=a cause is a reason something happens or an aim people support, not a section of a contract=cause 是原因或事业，不是合同条款;claws=claws are the sharp nails of an animal, not parts of a contract=claws 是动物的爪子，不是合同条款|clause|cl + ause, not *claws*|cl + ause，别写成 *claws*
      legalize|same-sex marriage now allowed;gambling that some want allowed;a drug doctors can now prescribe|to legalize is to make something allowed; to prohibit is to ban it|legalize 是使合法化；prohibit 是禁止|prohibit/prohibited/prohibits=prohibit means to ban something, the opposite of making marriage, gambling or a drug allowed=prohibit 是禁止，和使婚姻、赌博或药物合法正相反;localize/localized/localizes=localize means to limit something to one place or adapt it to a local market, not to make it legal=localize 是局限于某处或本地化，不是使合法|le · gal · ize|legal + ize|legal + ize
      prohibit|smoking that must be done outside;phones left at the door during an exam;knives that may not be sold to children|to prohibit is to ban; to permit is to allow|prohibit 是禁止；permit 是允许|permit/permitted/permits=permit means to allow, the opposite of having to go outside, leaving phones at the door or keeping knives from children=permit 是允许，和必须出去、手机留在门口、不卖刀给孩子正相反;exhibit/exhibited/exhibits=exhibit means to show something in public, not to ban it=exhibit 是展出，不是禁止|pro · hib · it|pro + hibit, with h after o|pro + hibit，o 后是 h
      prohibition|a ban so nobody may fish;the years when alcohol was illegal in the US;a ban on plastic bags that reduced litter|a prohibition is a rule that stops something; permission is being allowed to do it|prohibition 是禁令；permission 是许可|permission/Permission=permission is being allowed, the opposite of nobody may fish or alcohol being illegal=permission 是许可，和禁止钓鱼、酒类违法正相反;exhibition/Exhibition=an exhibition is a public show of art or objects, not a rule that stops something=exhibition 是展览，不是禁令|pro · hi · bi · tion|prohibit + ion|prohibit + ion
      permit|photography not allowed so cameras go away;a document needed to fish;a match that starts if the weather allows|to permit is to allow, and a permit is a paper that allows you; to prohibit is to ban|permit 是允许、许可证；prohibit 是禁止|prohibit/prohibited/prohibiting=prohibit means to ban, but not banned would not make you put your camera away, and bad weather is what stops a match=prohibit 是禁止，不被禁止就不必收起相机，而能阻止比赛的是坏天气;permeate/permeated/permeating=permeate means to spread through every part of something, not to allow it=permeate 是渗透，不是允许;ban=a ban stops you from fishing, it does not let you fish=ban 是禁令，不会让你可以钓鱼;fine=a fine is money you pay for breaking a rule, not a paper that lets you fish=fine 是罚款，不是允许你钓鱼的证件|per · mit|per + mit, doubling the t in *permitted*|per + mit，*permitted* 里双写 t
    `,
  },
});

const court = vocabularyTopic({
  id: "b2-words-court",
  title: t("The Court", "法庭"),
  summary: t(
    "Defendants and plaintiffs; prosecutors prosecuting and attorneys defending; juries and verdicts; guilty and innocent; testifying and testimony; lawsuits.",
    "被告和原告；起诉的检察官和辩护的律师；陪审团和裁决；有罪的和无罪的；作证和证词；诉讼。",
  ),
  intro: t(
    "In court the **prosecutor** tried to prove the **defendant** was guilty, a witness gave her **testimony**, and the **jury** reached its **verdict**. These words help you follow what happens in a trial and who does what.",
    "法庭上，**prosecutor**（检察官）努力证明 **defendant**（被告）有罪，一名证人提供了 **testimony**（证词），**jury**（陪审团）作出了 **verdict**（裁决）。这些词帮你看懂审判过程中谁做什么。",
  ),
  prerequisites: ["b2-words-law"],
  words: [
    word(
      "defendant defendants",
      "the person in a court case who is accused of a crime or is being sued",
      "被告",
      "The {defendant} said he was at home on the night of the crime. | The {defendants} were found not guilty and walked free.|prosecutors plaintiffs | The judge asked the {defendant} to stand while she read the sentence.",
      "prosecutor plaintiff",
      "plaintiff",
    ),
    word(
      "prosecutor prosecutors",
      "a lawyer who tries to prove in court that someone is guilty",
      "检察官；公诉人",
      "The {prosecutor} showed the jury a video of the robbery to prove the man was guilty. | {Prosecutors} say the man stole over a million dollars.|Defendants Persecutors | The {prosecutor} asked for a ten-year sentence.",
      "defendant persecutor",
      "attorney",
    ),
    word(
      "prosecute prosecutes prosecuted prosecuting",
      "to officially accuse someone of a crime in a court of law",
      "起诉；检控",
      "Shoplifters will be {prosecuted}: we always call the police.|defended persecuted | The state decided not to {prosecute} him because of his age. | She was {prosecuted} for fraud and sent to prison.|defended persecuted",
      "defend persecute",
    ),
    word(
      "plaintiff plaintiffs",
      "a person who takes someone else to court in a non-criminal case",
      "原告",
      "The {plaintiff} claims that the company damaged her house. | The {plaintiffs} want compensation for their injuries.|defendants prosecutors | The judge ruled in favor of the {plaintiff} and ordered the company to pay her.",
      "defendant prosecutor",
      "defendant",
    ),
    word(
      "jury juries",
      "a group of ordinary people who decide in court whether someone is guilty",
      "陪审团",
      "The {jury} found him guilty after two days. | Twelve ordinary people sit on the {jury} and decide the case. | {Juries} must ignore what they read in the newspapers.|Verdicts Injuries",
      "verdict injury",
    ),
    word(
      "verdict verdicts",
      "the decision of a jury or a judge about whether someone is guilty",
      "裁决；判决",
      "The jury reached its {verdict} after six hours: not guilty. | The family cried when the {verdict}, guilty, was read. | The {verdicts} were announced on the same day: guilty for one man, not guilty for the other.|testimonies juries",
      "testimony jury",
      "testimony",
    ),
    word(
      "guilty",
      "having done something wrong or illegal; feeling bad about something you have done",
      "有罪的；内疚的",
      "The jury found her {guilty} of theft, and she went to prison. | I feel {guilty} about forgetting her birthday. | He pleaded {guilty} and said he was sorry.",
      "innocent grateful",
      "innocent",
    ),
    word(
      "innocent",
      "not guilty of a crime; not harmful or bad",
      "无辜的；无罪的",
      "She was {innocent}: another woman had stolen the money. | Everyone is {innocent} until proven guilty. | Many {innocent} people, who had done nothing wrong, died in the war.",
      "guilty corrupt",
      "guilty",
    ),
    word(
      "testify testifies testified testifying",
      "to make a formal statement in court about something you saw or know",
      "作证",
      "Three witnesses {testified} under oath in court that they saw him run away.|certified pretended | She agreed to {testify} at her former boss's trial and tell the court what she saw. | He is {testifying} today, so the courtroom is full.|certifying pretending",
      "certify pretend",
      "testimony",
    ),
    word(
      "testimony testimonies",
      "a formal statement that a witness makes in court",
      "证词；证言",
      "Her {testimony} in court helped convict the killer. | The jury did not believe his {testimony}: they thought he was lying. | The {testimonies} of the two witnesses were different.|testaments matrimonies",
      "testament matrimony",
      "verdict",
    ),
    word(
      "lawsuit lawsuits",
      "a case in a court of law between two people or organizations, not about a crime",
      "诉讼",
      "The family filed a {lawsuit} against the hospital. | The company faces dozens of {lawsuits} over its faulty cars.|verdicts swimsuits | The {lawsuit} was settled out of court for a large sum.",
      "verdict swimsuit",
    ),
    word(
      "attorney attorneys",
      "a lawyer, especially in the US",
      "律师（美式英语）",
      "His {attorney} advised him to say nothing to the police. | She hired the best {attorney} in town to defend her. | The {attorneys} for both sides made their closing speeches.|defendants juries",
      "defendant jury",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "The *prosecutor* tries to prove the *defendant* guilty, while the *defendant* is the one accused. Ask whether the person in the sentence accuses or is accused.",
        "*prosecutor* 努力证明 *defendant* 有罪，*defendant* 是被指控的人。想想句子里的人是在指控别人，还是被指控。",
      ),
      meaning: t(
        "A *verdict* is the final decision on guilt, while *testimony* is what a witness says before it. Check whether the meaning is the decision or the evidence.",
        "*verdict* 是关于是否有罪的最终裁决，*testimony* 是此前证人所说的话。看释义说的是裁决，还是证据。",
      ),
      spell: t(
        "*Attorney* has a double t and ends in -ey, *plaintiff* ends in a double f, and *defendant* ends in -ant.",
        "*attorney* 双写 t，以 -ey 结尾，*plaintiff* 结尾双写 f，*defendant* 以 -ant 结尾。",
      ),
    },
    notes: `
      defendant|a man who says he was at home on the night of the crime;people found not guilty who walked free;the person standing while the sentence is read|the defendant is the person accused; the prosecutor is the lawyer who accuses|defendant 是被告；prosecutor 是检察官|prosecutor/prosecutors=a prosecutor is the lawyer who tries to prove guilt, not the person accused, found not guilty or sentenced=prosecutor 是检察官，不是被指控、被判无罪或被宣判的人;plaintiff/plaintiffs=a plaintiff takes someone to court in a non-criminal case, not the person accused of a crime=plaintiff 是民事案的原告，不是被控犯罪的人|de · fend · ant|defend + ant, ending in -ant|defend + ant，以 -ant 结尾
      prosecutor|a video shown to prove guilt;a claim that a man stole a million;a ten-year sentence asked for|a prosecutor tries to prove someone guilty; a defendant is the one accused|prosecutor 是检察官；defendant 是被告|defendant/Defendants=a defendant is the person accused, not the lawyer who shows evidence and asks for a sentence=defendant 是被告，不是出示证据、要求判刑的律师;persecutor/Persecutors=a persecutor treats people cruelly because of who they are, not a lawyer in court=persecutor 是迫害者，不是法庭上的律师|pros · e · cu · tor|prosecute with the e dropped, then -or|prosecute 去掉 e，再加 -or
      prosecute|shoplifters reported to the police;a young man the state did not take to court;fraud that led to prison|to prosecute is to accuse someone in court; to defend is to argue for them|prosecute 是起诉；defend 是辩护|defend/defended=defend means to argue for someone in court, not what happens to shoplifters or what the state does to accuse=defend 是辩护，不是对店铺小偷或国家所做的指控;persecute/persecuted=persecute means to treat people cruelly for who they are, not to accuse them of a crime in court=persecute 是迫害，不是在法庭上起诉|pros · e · cute|pros + e + cute|pros + e + cute
      plaintiff|a woman claiming a company damaged her house;people wanting compensation for injuries;the side a company was ordered to pay|a plaintiff takes someone to court; a defendant is the one taken to court|plaintiff 是原告；defendant 是被告|defendant/defendants=a defendant is the one taken to court, not the one who claims damage and wins money=defendant 是被告，不是索赔并获赔的一方;prosecutor/prosecutors=a prosecutor accuses people of crimes for the state, not a person who wants compensation=prosecutor 是代表国家起诉犯罪的人，不是要求赔偿的人|plain · tiff|plain + tiff, with a double f|plain + tiff，双写 f
      jury|a group that found a man guilty after two days;twelve ordinary people deciding a case;people who must ignore the newspapers|a jury is a group of ordinary people who decide; a verdict is the decision itself|jury 是陪审团；verdict 是裁决|verdict/Verdicts=a verdict is the decision itself, not the people who sit, read and decide=verdict 是裁决本身，不是坐着读报、作决定的人;injury/Injuries=an injury is damage to the body, not a group of people in court=injury 是伤，不是法庭上的一群人|ju · ry|ju + ry|ju + ry
      verdict|not guilty after six hours;a decision of guilty read to a family;guilty for one man and not guilty for the other|a verdict is the decision on guilt; testimony is what a witness says|verdict 是裁决；testimony 是证词|testimony/testimonies=testimony is what a witness says, not the final decision of guilty or not guilty=testimony 是证人的陈述，不是有罪与否的最终裁决;jury/juries=a jury is the group that decides, not the decision that is reached and read=jury 是作决定的陪审团，不是作出并宣读的裁决|ver · dict|ver + dict|ver + dict
      guilty|a thief who went to prison;feeling bad about forgetting a birthday;saying sorry while pleading|guilty means having done wrong or feeling bad about it; innocent means not guilty|guilty 是有罪的、内疚的；innocent 是无辜的|innocent=innocent means not guilty, the opposite of going to prison, feeling bad or saying sorry=innocent 是无辜的，和入狱、内疚、道歉正相反;grateful=grateful means thankful, not having done wrong or feeling bad about it=grateful 是感激的，不是有罪或内疚的|guilt · y|guilt + y, with a silent u|guilt + y，u 不发音
      innocent|a woman whose money was stolen by another;everyone until proven guilty;people who had done nothing wrong|innocent means not guilty; guilty means having done wrong|innocent 是无辜的；guilty 是有罪的|guilty=guilty means having done wrong, the opposite of someone else stealing or having done nothing wrong=guilty 是有罪的，和别人偷了钱、什么都没做错正相反;corrupt=corrupt means dishonest for money, the opposite of having done nothing wrong=corrupt 是腐败的，和没做错事正相反|in · no · cent|in + no + cent, with a double n|in + no + cent，双写 n
      testify|witnesses speaking under oath in court;telling a trial what she saw;a full courtroom for a witness|to testify is to make a formal statement in court; to pretend is to act as if something were true|testify 是作证；pretend 是假装|certify/certified/certifying=certify means to state officially in writing, such as on a document, not to speak as a witness in court=certify 是书面证明，不是出庭作证;pretend/pretended/pretending=pretend means to act as if something false were true, the opposite of speaking under oath and telling what you saw=pretend 是假装，和宣誓陈述、说出所见正相反|tes · ti · fy|testi + fy|testi + fy
      testimony|a statement in court that convicted a killer;a statement the jury thought was a lie;two witnesses' differing statements|testimony is what a witness says in court; a testament is a will or proof|testimony 是证词；testament 是遗嘱或证明|testament/testaments=a testament is a will or proof of something, not what a witness says in court=testament 是遗嘱或证明，不是证人在法庭上的陈述;matrimony/matrimonies=matrimony is marriage, not a statement in court=matrimony 是婚姻，不是法庭陈述|tes · ti · mo · ny|testi + mony|testi + mony
      lawsuit|a case filed against a hospital;dozens of cases over faulty cars;a case settled out of court|a lawsuit is a court case between two sides; a verdict is the decision in it|lawsuit 是诉讼；verdict 是裁决|verdict/verdicts=a verdict is the decision at the end, not a case that a family files or that is settled out of court=verdict 是最终裁决，不是家属提起或庭外和解的案子;swimsuit/swimsuits=a swimsuit is clothing for swimming, not a court case=swimsuit 是泳衣，不是诉讼|law · suit|law + suit, one word|law + suit，连写成一个词
      attorney|a lawyer advising silence with the police;the best lawyer hired to defend her;lawyers making closing speeches for both sides|an attorney is a lawyer; a defendant is the person accused|attorney 是律师；defendant 是被告|defendant/defendants=a defendant is the person accused, not the lawyer who advises, defends or speaks for a side=defendant 是被告，不是提建议、辩护或代表一方发言的律师;jury/juries=a jury is the group that decides, not a lawyer hired to defend someone=jury 是陪审团，不是被雇来辩护的律师|at · tor · ney|at + tor + ney, with a double t|at + tor + ney，双写 t
    `,
  },
});

const crime = vocabularyTopic({
  id: "b2-words-crime-2",
  title: t("Crime", "犯罪"),
  summary: t(
    "Offenses and offenders; criminals; fraud; burglary and burglars; assault; kidnapping; smuggling; bribes and bribery; arson.",
    "罪行和罪犯；罪犯；诈骗；入室盗窃和窃贼；袭击；绑架；走私；贿赂和行贿；纵火。",
  ),
  intro: t(
    "A **burglar** broke into the house, a gang tried to **smuggle** drugs through the port, and a fire turned out to be **arson**. These words help you name crimes and the people who commit them.",
    "一名 **burglar**（入室窃贼）闯进了房子，一伙人想通过港口 **smuggle**（走私）毒品，一场火原来是 **arson**（纵火）。这些词帮你说出各种罪行和犯罪的人。",
  ),
  prerequisites: ["b1-words-crime"],
  words: [
    word(
      "offense offenses",
      "a crime; something that upsets people",
      "罪行；冒犯",
      "Driving without insurance is a serious {offense}, and you can be fined. | It was his first {offense}, so he was not sent to prison. | No {offense}, but I think you're wrong.",
      "defense fence",
    ),
    word(
      "offender offenders",
      "a person who has committed a crime",
      "罪犯；违法者",
      "Young {offenders} are sent to a special center, not to an adult prison.|victims defenders | The program helps {offenders} find work after prison.|victims defenders | He is a repeat {offender} who has been arrested ten times.",
      "victim defender",
      "criminal",
    ),
    word(
      "criminal",
      "a person who commits crimes; connected with crime",
      "罪犯；犯罪的",
      "The police caught him at the airport and found he had a long {criminal} history. | Theft is a {criminal} offense that can send you to prison. | She has no {criminal} record: she has never broken the law.",
      "civil critical",
      "offender",
    ),
    word(
      "fraud",
      "the crime of cheating people to get money; a person who pretends to be what they are not",
      "诈骗；骗子",
      "He was jailed for tax {fraud}, hiding millions from the government. | Credit card {fraud} costs banks billions every year. | The doctor turned out to be a {fraud} who had faked his qualifications.|feud burglar",
      "arson feud",
    ),
    word(
      "burglary burglaries",
      "the crime of entering a building to steal things",
      "入室盗窃",
      "There has been a rise in {burglaries} in the area, so lock your doors.|briberies burials | The {burglary} happened while the family was on vacation. | He was arrested for {burglary} after his fingerprints were found on the window.",
      "bribery burial",
      "burglar",
    ),
    word(
      "burglar burglars",
      "a person who enters a building to steal things",
      "窃贼；入室盗贼",
      "The {burglar} broke in through the kitchen window and stole a laptop. | {Burglars} broke in and stole the TV and the jewelry.|Victims Burgers | A dog is a good way to keep {burglars} away from your house.|victims burgers",
      "victim burger",
      "burglary",
    ),
    word(
      "assault assaults assaulted assaulting",
      "to attack someone violently; a violent attack",
      "袭击；殴打",
      "He was arrested for {assaulting} a police officer, hitting him in the face.|insulting protecting | The {assault} left the victim with a broken arm.|insult rescue | She was {assaulted} on her way home and badly hurt.|insulted protected",
      "insult protect",
    ),
    word(
      "kidnap kidnaps kidnapped kidnapping",
      "to take someone away by force and keep them prisoner, often to get money",
      "绑架",
      "The businessman was {kidnapped} and held for a week until his family paid.|rescued released | The gang {kidnaps} rich tourists and asks their families for money.|rescues releases | Police are investigating the {kidnapping} of a child taken from a park.|rescuing releasing",
      "rescue release",
    ),
    word(
      "smuggle smuggles smuggled smuggling",
      "to take things or people secretly and illegally into or out of a country",
      "走私；偷运",
      "They tried to {smuggle} drugs through the airport, hidden in their suitcases. | He was caught {smuggling} cigarettes across the border without paying tax.|declaring snuggling | The gang {smuggles} people across the sea in small boats, secretly and illegally.|declares snuggles",
      "declare snuggle",
    ),
    word(
      "bribe bribes",
      "money or a gift given to someone to persuade them to do something dishonest",
      "贿赂",
      "The official accepted a {bribe} to approve the building. | He offered the police officer a {bribe} to avoid a fine. | Paying {bribes} is a crime in most countries.|fines brides",
      "fine bride",
      "bribery",
    ),
    word(
      "bribery",
      "the crime of giving or taking bribes",
      "行贿；受贿",
      "The minister was charged with {bribery} for taking money from a company. | {Bribery} is common where officials are badly paid and take money for favors. | The company was fined for {bribery} of foreign officials.",
      "bravery brewery",
      "bribe",
    ),
    word(
      "arson",
      "the crime of deliberately setting fire to a building",
      "纵火（罪）",
      "The fire was not an accident: it was {arson}. | He was jailed for {arson} after he set fire to his neighbor's car. | Police suspect {arson} because they found gasoline near the burned door.",
      "burglary parson",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *burglar* is the person, while *burglary* is the crime: the *burglar* commits a *burglary*. Ask whether the gap needs someone who steals or the act of breaking in.",
        "*burglar* 是人，*burglary* 是罪行：*burglar* 犯下 *burglary*。想想空格需要的是偷东西的人，还是入室盗窃这件事。",
      ),
      meaning: t(
        "A *bribe* is the money or gift itself, while *bribery* is the crime of giving or taking it. Check whether the meaning names the thing handed over or the crime.",
        "*bribe* 是贿赂的钱物本身，*bribery* 是行贿受贿的罪行。看释义说的是递过去的东西，还是这种罪行。",
      ),
      spell: t(
        "*Kidnapped* doubles the p, *offense* ends in -se in American English, and *burglar* ends in -ar.",
        "*kidnapped* 双写 p，*offense* 在美式英语里以 -se 结尾，*burglar* 以 -ar 结尾。",
      ),
    },
    notes: `
      offense|driving without insurance that can bring a fine;a first crime that did not mean prison;something said that might upset you|an offense is a crime or something that upsets people; a defense is protection or the case for the accused|offense 是罪行、冒犯；defense 是防御、辩护|defense=a defense is protection or arguing for the accused, not a crime you can be fined for=defense 是防御或辩护，不是会被罚款的罪行;fence=a fence is a wooden or metal wall around land, not a crime=fence 是篱笆，不是罪行|of · fense|of + fense, ending in -se|of + fense，以 -se 结尾
      offender|young people sent to a special center instead of prison;people looking for work after prison;a man arrested ten times|an offender commits a crime; a victim is hurt by one|offender 是罪犯；victim 是受害者|victim/victims=a victim is the person hurt by a crime, not someone sent to a center, leaving prison or arrested=victim 是受害者，不是被送去管教、出狱或被捕的人;defender/defenders=a defender protects someone or plays in defense, not a person who commits crimes=defender 是保护者或后卫，不是犯罪的人|of · fend · er|offend + er|offend + er
      criminal|a long history found by police at the airport;theft that can send you to prison;never having broken the law|criminal means connected with crime; civil means about private cases or citizens, not crime|criminal 是犯罪的；civil 是民事的、公民的|civil=civil means about citizens or private cases, not crimes that send you to prison or police records=civil 是公民的或民事的，不是会坐牢的犯罪或警方记录;critical=critical means very important or saying what is wrong, not connected with breaking the law=critical 是关键的或批评的，不是和违法有关的|crim · i · nal|crim + inal|crim + inal
      fraud|millions hidden from the government;card crime that costs banks billions;a doctor with faked qualifications|fraud is cheating for money; arson is setting fire on purpose|fraud 是诈骗；arson 是纵火|arson=arson is setting fire on purpose, not hiding money or cheating with cards=arson 是纵火，不是藏钱或盗刷;feud=a feud is a long, bitter quarrel, not cheating people for money or faking qualifications=feud 是长期不和，不是诈骗或伪造资历;burglar=a burglar breaks into buildings to steal, not someone who fakes qualifications to work as a doctor=burglar 是入室窃贼，不是伪造资历当医生的人|fraud|fr + aud|fr + aud
      burglary|break-ins that mean you should lock your doors;a break-in while the family was on vacation;fingerprints found on a window|burglary is breaking into a building to steal; bribery is giving money to get dishonest help|burglary 是入室盗窃；bribery 是行贿受贿|bribery/briberies=bribery is paying someone to act dishonestly, not breaking in through windows while people are away=bribery 是贿赂，不是趁人不在破窗而入;burial/burials=a burial is putting a dead body in the ground, not a crime of stealing=burial 是埋葬，不是盗窃罪|bur · glar · y|burglar + y|burglar + y
      burglar|someone who broke in through a kitchen window;people who stole a TV and jewelry;people a dog keeps away from your house|a burglar breaks in to steal; a victim is the one stolen from|burglar 是入室窃贼；victim 是受害者|victim/victims/Victims=a victim is the person who suffers a crime, not the one who breaks in, steals or is kept away by a dog=victim 是受害者，不是破门偷窃、被狗吓走的人;burger/burgers/Burgers=a burger is a kind of food, not a person who breaks in to steal=burger 是汉堡，不是入室盗窃的人|bur · glar|burg + lar, ending in -ar|burg + lar，以 -ar 结尾
      assault|hitting a police officer in the face;an attack that broke a victim's arm;being badly hurt on the way home|to assault is to attack violently; to insult is to say rude things|assault 是袭击；insult 是侮辱|insult/insulting/insulted=insult means to say something rude, not to hit someone or break their arm=insult 是辱骂，不是打人或打断手臂;protect/protecting/protected=protect means to keep someone safe, the opposite of hitting or hurting them=protect 是保护，和打人、伤人正相反;rescue=a rescue saves someone from danger, the opposite of an attack that hurts them=rescue 是营救，和伤人的袭击正相反|as · sault|as + sault, with a double s|as + sault，双写 s
      kidnap|a man held for a week until his family paid;tourists taken for money;a child taken from a park|to kidnap is to take someone away by force; to rescue is to save them|kidnap 是绑架；rescue 是营救|rescue/rescued/rescues/rescuing=rescue means to save someone, the opposite of holding them for money or taking a child away=rescue 是营救，和扣人勒索、掳走孩子正相反;release/released/releases/releasing=release means to set someone free, the opposite of holding them or taking them by force=release 是释放，和扣押或强行带走正相反|kid · nap|kid + nap, doubling the p in *kidnapped*|kid + nap，*kidnapped* 里双写 p
      smuggle|drugs hidden in suitcases at an airport;cigarettes taken across a border without tax;people moved across the sea secretly and illegally|to smuggle is to move things secretly and illegally; to declare is to tell customs about them|smuggle 是走私；declare 是申报|declare/declaring/declares=declare means to tell customs officers what you are carrying, the opposite of hiding it or moving it secretly=declare 是向海关申报，和藏匿、偷运正相反;snuggle/snuggling/snuggles=snuggle means to lie close to someone for warmth, not to move goods illegally=snuggle 是依偎，不是非法运货|smug · gle|smug + gle, with a double g|smug + gle，双写 g
      bribe|money taken to approve a building;money offered to avoid a fine;payments that are a crime in most countries|a bribe is money given to get dishonest help; a fine is money paid as a punishment|bribe 是贿赂；fine 是罚款|fine/fines=a fine is a punishment paid to the state, not money an official takes or that you pay to avoid a fine=fine 是罚款，不是官员收的钱或用来逃避罚款的钱;bride/brides=a bride is a woman getting married, not money given to someone=bride 是新娘，不是给人的钱|bribe|bri + be, not *bride*|bri + be，别写成 *bride*
      bribery|a minister charged for taking money from a company;officials taking money for favors;a company fined over payments to foreign officials|bribery is the crime of giving or taking bribes; bravery is courage|bribery 是贿赂罪；bravery 是勇敢|bravery=bravery is courage, not a crime that gets a minister charged or a company fined=bravery 是勇敢，不是让部长被起诉、公司被罚的罪行;brewery=a brewery is a place where beer is made, not a crime=brewery 是啤酒厂，不是罪行|brib · er · y|bribe with the e dropped, then -ery|bribe 去掉 e，再加 -ery
      arson|a fire that was no accident;setting fire to a neighbor's car;gasoline near a burned door|arson is setting fire on purpose; burglary is breaking in to steal|arson 是纵火；burglary 是入室盗窃|burglary=burglary is breaking in to steal, not setting fire to a building or car=burglary 是入室盗窃，不是放火烧房或车;parson=a parson is a priest, not a crime=parson 是牧师，不是罪行|ar · son|ar + son|ar + son
    `,
  },
});

const punishment = vocabularyTopic({
  id: "b2-words-punishment",
  title: t("Punishment", "惩罚"),
  summary: t(
    "Punishing crime and the punishments it brings; penalties; imprisoning offenders and imprisonment; parole and probation; rehabilitating offenders; deterring crime and deterrents; executions; custody.",
    "惩罚犯罪及其刑罚；处罚；监禁罪犯；假释和缓刑；使罪犯改过自新；威慑犯罪和威慑手段；处决；拘留。",
  ),
  intro: t(
    "The judge chose **probation** instead of **imprisonment**, hoping the course would **rehabilitate** him and the threat of prison would **deter** him. These words help you talk about how a society punishes crime and tries to prevent it.",
    "法官选择了 **probation**（缓刑）而不是 **imprisonment**（监禁），希望课程能 **rehabilitate**（使改过自新）他，坐牢的威胁能 **deter**（威慑）他。这些词帮你谈论社会如何惩罚和预防犯罪。",
  ),
  prerequisites: ["b2-words-crime-2"],
  words: [
    word(
      "punish punishes punished punishing",
      "to make someone suffer because they have done something wrong",
      "惩罚",
      "The teacher {punished} the boys for lying, keeping them in at break.|rewarded polished | Should parents {punish} children by taking away their phones? | The law {punishes} drunk drivers severely, with prison.|rewards polishes",
      "reward polish",
      "punishment",
    ),
    word(
      "punishment punishments",
      "a way of making someone suffer for doing something wrong",
      "惩罚；刑罚",
      "The {punishment} for stealing was a large fine. | {Punishments} should fit the crime.|Rewards Paroles | As a {punishment}, she had to stay in her room.",
      "reward parole",
      "penalty",
    ),
    word(
      "penalty penalties",
      "a punishment for breaking a law or a rule; a free kick at goal in football",
      "处罚；点球",
      "The {penalty} for parking here is a fine of 100 dollars. | The death {penalty} has been abolished in many countries. | He scored from a {penalty} in the last minute.",
      "reward poverty",
      "punishment",
    ),
    word(
      "imprison imprisons imprisoned imprisoning",
      "to put someone in prison",
      "监禁；关押",
      "He was {imprisoned} for ten years for robbery.|released impressed | The government {imprisons} journalists who criticize it.|releases impresses | Is {imprisoning} young offenders, locking them up with adult criminals, the best answer?|releasing impressing",
      "release impress",
      "imprisonment",
    ),
    word(
      "imprisonment",
      "the state of being in prison",
      "监禁；徒刑",
      "She was sentenced to five years' {imprisonment}. | Life {imprisonment} means that the prisoner may never be released. | {Imprisonment} costs taxpayers a lot, because every prisoner needs a guard, a bed and food.",
      "release improvement",
      "imprison",
    ),
    word(
      "parole",
      "letting a prisoner leave prison early if they promise to behave well",
      "假释",
      "He was released on {parole} after serving half his sentence. | She broke the rules of her {parole} and went back to prison. | The board will decide whether he gets {parole} next month.",
      "patrol payroll",
      "probation",
    ),
    word(
      "probation",
      "a period when an offender is not sent to prison but must behave well and be watched; a trial period at a new job",
      "缓刑；试用期",
      "Instead of prison, the judge gave him two years' {probation}. | She must see her {probation} officer every week. | New staff are on {probation} for three months.",
      "prohibition execution",
      "parole",
    ),
    word(
      "rehabilitate rehabilitates rehabilitated rehabilitating",
      "to help someone return to a normal life, for example after prison or an illness",
      "使改过自新；使康复",
      "Prisons should try to {rehabilitate} offenders, not just lock them up. | The program has {rehabilitated} hundreds of young people, who now have jobs.|imprisoned rehearsed | After the accident, she spent months {rehabilitating} her injured knee.|imprisoning rehearsing",
      "imprison rehearse",
    ),
    word(
      "deter deters deterred deterring",
      "to make someone decide not to do something by making them afraid of what will happen",
      "威慑；阻止",
      "High fines {deter} people who might drop litter: they are afraid to do it. | Cameras have {deterred} thieves, who now stay away from the car park.|encouraged protected | The danger did not {deter} the climbers: they went up anyway.",
      "encourage protect",
      "deterrent",
    ),
    word(
      "deterrent deterrents",
      "something that makes people decide not to do something",
      "威慑因素；威慑力量",
      "Are long prison sentences real {deterrents}, stopping people from committing crimes?|incentives detergents | Locks are a good {deterrent} against thieves. | Heavy fines are among the best {deterrents}: people are afraid to break the rule.|incentives detergents",
      "incentive detergent",
      "deter",
    ),
    word(
      "execution executions",
      "killing someone as a legal punishment; doing a plan or an action",
      "处决；执行",
      "The {execution} of prisoners, killing them as punishment, is still legal in some countries. | Crowds used to watch public {executions} in the town square.|pardons exceptions | The plan was good, but the {execution} was poor.",
      "pardon exception",
    ),
    word(
      "custody",
      "being kept in prison until a trial; the legal right to look after a child",
      "拘留；监护权",
      "The suspect is being held in police {custody} until his trial. | After the divorce, the mother got {custody} of the children. | Two men were taken into {custody} after the fight.",
      "freedom custom",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Parole* comes after part of a prison sentence, while *probation* is given instead of prison. Ask whether the person in the sentence has already been in prison.",
        "*parole* 是服完部分刑期后的假释，*probation* 是代替坐牢的缓刑。想想句子里的人是否已经坐过牢。",
      ),
      meaning: t(
        "To *deter* is to stop a crime before it happens by making people afraid, while to *rehabilitate* is to help an offender back to a normal life after it. Check whether the meaning is about before or after the crime.",
        "*deter* 是通过让人害怕而在犯罪前阻止它，*rehabilitate* 是在犯罪后帮助罪犯回归正常生活。看释义说的是犯罪之前还是之后。",
      ),
      spell: t(
        "*Deterrent* doubles the r, *imprison* is in + prison, and *penalty* ends in -alty.",
        "*deterrent* 双写 r，*imprison* 是 im + prison，*penalty* 以 -alty 结尾。",
      ),
    },
    notes: `
      punish|boys kept in at break for lying;phones taken away from children;prison for drunk drivers|to punish is to make someone suffer for a wrong; to reward is to give them something for doing well|punish 是惩罚；reward 是奖励|reward/rewarded/rewards=reward means to give something for doing well, the opposite of keeping boys in, taking phones away or prison=reward 是奖励，和留堂、没收手机、坐牢正相反;polish/polished/polishes=polish means to rub something until it shines, not to make someone suffer for a wrong=polish 是擦亮，不是惩罚|pun · ish|pun + ish|pun + ish
      punishment|a large fine for stealing;what should fit the crime;staying in your room|a punishment makes someone suffer for a wrong; a reward is given for doing well|punishment 是惩罚；reward 是奖励|reward/Rewards=a reward is given for doing well, the opposite of a fine for stealing or being kept in your room=reward 是奖励，和偷窃罚款、关在房里正相反;parole/Paroles=parole is leaving prison early, not a fine or being kept in your room=parole 是假释，不是罚款或关在房间里|pun · ish · ment|punish + ment|punish + ment
      penalty|a 100-dollar fine for parking;death as a punishment;a free kick that scored in the last minute|a penalty is a punishment or a free kick at goal; a reward is something given for doing well|penalty 是处罚、点球；reward 是奖励|reward=a reward is given for doing well, the opposite of a parking fine or the death punishment, and you do not score from one=reward 是奖励，和停车罚款、死刑正相反，也不能用来进球;poverty=poverty is being very poor, not a punishment or a free kick=poverty 是贫困，不是处罚或点球|pen · al · ty|penal + ty, ending in -alty|penal + ty，以 -alty 结尾
      imprison|ten years for robbery;journalists jailed for criticism;young offenders locked up with adults|to imprison is to put someone in prison; to release is to let them out|imprison 是监禁；release 是释放|release/released/releases/releasing=release means to let someone go free, the opposite of ten years for robbery or locking people up=release 是释放，和因抢劫坐十年牢、把人关起来正相反;impress/impressed/impresses/impressing=impress means to make people admire you, not to put someone in prison=impress 是给人留下深刻印象，不是关进监狱|im · pris · on|im + prison|im + prison
      imprisonment|five years in prison as a sentence;a life sentence with no release;the cost of guards, beds and food for prisoners|imprisonment is being in prison; release is being let out|imprisonment 是监禁；release 是释放|release/Release=release is being let out, the opposite of a prison sentence, never being freed or the cost of keeping prisoners=release 是释放，和判刑坐牢、永不获释、关押开销正相反;improvement/Improvement=an improvement is a change for the better, not being kept in prison=improvement 是改善，不是被关在监狱里|im · pris · on · ment|imprison + ment|imprison + ment
      parole|release after half a sentence;rules broken that meant going back to prison;early release a board will decide on|parole is leaving prison early under rules; a patrol is a group that moves around guarding an area|parole 是假释；patrol 是巡逻|patrol=a patrol is a group moving around to guard an area, not early release from prison=patrol 是巡逻，不是提前出狱;payroll=a payroll is a list of workers and their pay, not early release from prison=payroll 是工资名单，不是提前出狱|pa · role|pa + role|pa + role
      probation|two years watched instead of prison;an officer to see every week;a trial period for new staff|probation is being watched instead of going to prison; prohibition is a ban|probation 是缓刑、试用期；prohibition 是禁令|prohibition=a prohibition is a ban, not a period of being watched instead of prison or a trial period at work=prohibition 是禁令，不是代替坐牢的考察期或试用期;execution=an execution is killing someone as a punishment, the opposite of being kept out of prison or starting a new job=execution 是处决，和免于坐牢、开始新工作正相反|pro · ba · tion|pro + bation|pro + bation
      rehabilitate|offenders helped instead of just locked up;young people who now have jobs;months spent getting an injured knee working|to rehabilitate is to help someone back to normal life; to imprison is to lock them up|rehabilitate 是使恢复正常生活；imprison 是监禁|imprison/imprisoned/imprisoning=imprison means to lock someone up, not to help them get jobs or heal a knee=imprison 是关押，不是帮人找到工作或治好膝盖;rehearse/rehearsed/rehearsing=rehearse means to practice a play or a speech, not to help someone back to normal life=rehearse 是排练，不是帮人回归正常生活|re · ha · bil · i · tate|re + habilit + ate|re + habilit + ate
      deter|people afraid to drop litter;thieves who now stay away;climbers who went up anyway|to deter is to make people decide not to act; to encourage is to make them want to act|deter 是威慑、阻止；encourage 是鼓励|encourage/encouraged=encourage means to make people want to do something, the opposite of making them afraid or keeping them away=encourage 是鼓励，和使人害怕、使人远离正相反;protect/protected=protect means to keep someone safe, not to make them afraid to do something=protect 是保护，不是使人害怕而不敢做|de · ter|de + ter, doubling the r in *deterred*|de + ter，*deterred* 里双写 r
      deterrent|long sentences that might stop crimes;locks against thieves;fines that make people afraid to break a rule|a deterrent makes people decide not to act; an incentive makes them want to act|deterrent 是威慑因素；incentive 是激励|incentive/incentives=an incentive makes people want to do something, the opposite of stopping them or making them afraid=incentive 是激励，和阻止或使人害怕正相反;detergent/detergents=a detergent is soap for washing clothes or dishes, not something that stops people from acting=detergent 是洗涤剂，不是阻止人行动的东西|de · ter · rent|deter + r + ent, with a double r|deter + r + ent，双写 r
      execution|killing prisoners as a legal punishment;public killings crowds watched;the way a good plan was carried out|an execution is killing as a punishment or carrying out a plan; a pardon is official forgiveness|execution 是处决、执行；pardon 是赦免|pardon/pardons=a pardon is official forgiveness that frees someone, the opposite of killing them or carrying out a plan=pardon 是赦免，和处死或执行计划正相反;exception/exceptions=an exception is something that does not follow the rule, not killing as a punishment=exception 是例外，不是作为惩罚的处死|ex · e · cu · tion|execute with the e dropped, then -ion|execute 去掉 e，再加 -ion
      custody|a suspect held by police until trial;the right to look after children after a divorce;men taken by police after a fight|custody is being held by police or the right to look after a child; freedom is being free|custody 是拘留、监护权；freedom 是自由|freedom=freedom is being free, the opposite of being held by police or taken in after a fight=freedom 是自由，和被警方关押、打架后被带走正相反;custom=a custom is a traditional way of doing things, not being held by police or caring for children=custom 是习俗，不是拘留或监护|cus · to · dy|custo + dy|custo + dy
    `,
  },
});

const rights = vocabularyTopic({
  id: "b2-words-rights",
  title: t("Rights", "权利"),
  summary: t(
    "Freedoms and liberties; oppressing people and oppression; persecuting minorities and persecution; asylum; rights; civil and humanitarian rights; violating rights and violations; entitlements.",
    "自由；压迫；迫害少数群体；庇护；权利；公民权利和人道主义；侵犯权利；应得的权利。",
  ),
  intro: t(
    "She fled years of **oppression** at home and asked for **asylum** abroad, where her **freedom** and **civil** rights were protected. These words help you talk about the rights people have and what happens when those rights are taken away.",
    "她逃离了家乡多年的 **oppression**（压迫），到国外申请 **asylum**（庇护），在那里她的 **freedom**（自由）和 **civil**（公民的）权利受到保护。这些词帮你谈论人们拥有的权利，以及权利被剥夺时会发生什么。",
  ),
  prerequisites: ["b2-words-politics"],
  words: [
    word(
      "freedom freedoms",
      "the right to do or say what you want without being controlled or stopped",
      "自由",
      "Newspapers must have the {freedom} to criticize the government. | We take our {freedoms} for granted until we lose them.|oppressions kingdoms | After twenty years in prison, he finally won his {freedom}.",
      "oppression kingdom",
      "liberty",
    ),
    word(
      "liberty liberties",
      "the freedom to live as you choose, without too many rules; a basic right",
      "自由；权利",
      "The Statue of {Liberty} stands in New York harbor. | New security laws threaten our civil {liberties}.|libraries liabilities | Prisoners lose their {liberty} but keep their human rights.",
      "library liability",
      "freedom",
    ),
    word(
      "oppress oppresses oppressed oppressing",
      "to treat a group of people cruelly and unfairly, and take away their freedom",
      "压迫；压制",
      "The dictator {oppressed} anyone who disagreed with him, putting them in prison.|liberated impressed | For centuries, the empire {oppressed} the people it ruled, taking their land.|liberated impressed | Women in the country still feel {oppressed} by the old laws that limit their lives.|liberated impressed",
      "liberate impress",
      "persecute",
    ),
    word(
      "oppression",
      "cruel and unfair treatment of a group of people",
      "压迫",
      "The people rose up against years of {oppression} by a cruel king. | The film shows the {oppression} of workers in the 1900s, who were beaten and underpaid. | They escaped from {oppression} under a cruel government and built new lives abroad.",
      "freedom depression",
      "persecution",
    ),
    word(
      "persecute persecutes persecuted persecuting",
      "to treat someone cruelly or unfairly, especially because of their race, religion or beliefs",
      "迫害",
      "The group was {persecuted} for its religious beliefs, and many members were killed.|protected persuaded | The regime {persecutes} journalists who tell the truth, beating and jailing them.|protects persuades | They fled the country because they were being {persecuted}.|protected persuaded",
      "protect persuade",
      "oppress",
    ),
    word(
      "persecution",
      "cruel and unfair treatment, especially because of race, religion or beliefs",
      "迫害",
      "Many refugees are escaping {persecution} in their home countries. | The {persecution} of the minority lasted for decades. | Fear of {persecution} drove thousands to leave.",
      "protection perspiration",
      "oppression",
    ),
    word(
      "asylum",
      "protection that a country gives to someone who has escaped danger in their own country",
      "（政治）庇护",
      "The journalist asked for {asylum} in Germany after he was threatened at home. | Thousands of people fleeing danger apply for {asylum} every year. | She was granted {asylum} and allowed to stay.",
      "museum asset",
    ),
    word(
      "civil",
      "connected with the people of a country and their rights, not with the army or the church",
      "公民的；民事的",
      "Martin Luther King fought for {civil} rights, equal rights for all citizens. | The country was torn apart when {civil} war broke out between its own people. | {Civil} weddings take place at the town hall, not in a church.",
      "military evil",
    ),
    word(
      "humanitarian",
      "connected with helping people who are suffering",
      "人道主义的",
      "The UN is sending {humanitarian} aid, food and medicine, to the flood victims. | The war has caused a {humanitarian} crisis, with millions hungry. | She received an award for her {humanitarian} work with refugees.",
      "military vegetarian",
    ),
    word(
      "violate violates violated violating",
      "to break a law, a rule or an agreement; to fail to respect someone's rights",
      "违反；侵犯",
      "The company {violated} safety rules, and three workers were injured.|respected ventilated | Torture {violates} human rights.|respects ventilates | Reading other people's emails is {violating} their privacy.|respecting ventilating",
      "respect ventilate",
    ),
    word(
      "violation violations",
      "breaking a law, a rule or an agreement",
      "违反行为；侵犯",
      "The arrest was a {violation} of his rights, made without any reason. | The factory was fined for safety {violations}.|protections vibrations | Human rights {violations}, including torture, were reported in the region.|protections vibrations",
      "protection vibration",
    ),
    word(
      "entitlement entitlements",
      "a legal right to have or receive something; the feeling that you deserve special treatment",
      "应得的权利；特权感",
      "All workers have the same {entitlement} to four weeks' paid vacation. | Pensions are a legal {entitlement} that people have earned, not a gift. | His sense of {entitlement}, expecting special treatment, annoyed his colleagues.",
      "obligation enlightenment",
    ),
    word(
      "rights",
      "the things that the law or a fair society says every person may have or do (a right, rights)",
      "权利",
      "Everyone should have equal {rights}, such as free speech and a fair trial. | The law protects the {rights} of workers. | She has spent her life fighting for human {rights}.",
      "duties rites",
      "entitlement",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Persecute* and *prosecute* look almost the same: to *persecute* is to treat people cruelly for who they are, to *prosecute* is to accuse them in court. Ask whether the sentence is about cruelty or about a trial.",
        "*persecute* 和 *prosecute* 长得几乎一样：*persecute* 是因身份而残酷对待人，*prosecute* 是在法庭上起诉。想想句子说的是迫害还是审判。",
      ),
      meaning: t(
        "To *violate* a right is to break it, while to *oppress* people is to keep them down cruelly over a long time. Check whether the meaning is about breaking a rule or about cruel control of a group.",
        "*violate* 权利是侵犯、违反它，*oppress* 是长期残酷地压制一群人。看释义说的是违反规定，还是对一个群体的残酷控制。",
      ),
      spell: t(
        "*Asylum* has a y after the s, *liberty* ends in -erty, and *humanitarian* has -itar- in the middle.",
        "*asylum* 的 s 后是 y，*liberty* 以 -erty 结尾，*humanitarian* 中间是 -itar-。",
      ),
    },
    notes: `
      freedom|newspapers criticizing the government;something we lose and then miss;release after twenty years in prison|freedom is being able to act without control; oppression is cruel control|freedom 是自由；oppression 是压迫|oppression/oppressions=oppression is cruel control, the opposite of criticizing freely or winning release=oppression 是压迫，和自由批评、获得自由正相反;kingdom/kingdoms=a kingdom is a country ruled by a king, not the right to act as you want=kingdom 是王国，不是随心行事的权利|free · dom|free + dom|free + dom
      liberty|a famous statue in New York harbor;civil rights threatened by security laws;what prisoners lose while keeping human rights|liberty is freedom to live as you choose; liability is legal responsibility|liberty 是自由；liability 是法律责任|library/libraries=a library is a place full of books to borrow, not freedom or a basic right=library 是图书馆，不是自由或基本权利;liability/liabilities=a liability is legal responsibility for something, not the freedom to live as you choose=liability 是法律责任，不是自由生活的权利|lib · er · ty|liber + ty, ending in -erty|liber + ty，以 -erty 结尾
      oppress|a dictator jailing anyone who disagreed;an empire taking its people's land;women limited by old laws|to oppress is to treat a group cruelly and unfairly; to liberate is to set them free|oppress 是压迫；liberate 是解放|liberate/liberated=liberate means to set people free, the opposite of jailing them, taking their land or limiting their lives=liberate 是解放，和关押、夺地、限制生活正相反;impress/impressed=impress means to make people admire you, not to treat them cruelly=impress 是给人留下好印象，不是残酷对待|op · press|op + press, with a double p|op + press，双写 p
      oppression|years under a cruel king;workers beaten and underpaid;life under a cruel government|oppression is cruel and unfair treatment; freedom is the right to act as you choose|oppression 是压迫；freedom 是自由|freedom=freedom is being free, the opposite of a cruel king, beatings or a cruel government=freedom 是自由，和暴君、殴打、残暴政府正相反;depression=depression is deep sadness or a bad time for the economy, not cruel treatment by rulers=depression 是抑郁或经济萧条，不是统治者的残酷对待|op · pres · sion|oppress + ion|oppress + ion
      persecute|a group killed for its religious beliefs;journalists beaten and jailed for the truth;people who fled the country|to persecute is to treat people cruelly for who they are; to protect is to keep them safe|persecute 是迫害；protect 是保护|protect/protected/protects=protect means to keep people safe, the opposite of killing, beating or making them flee=protect 是保护，和杀害、殴打、逼人逃亡正相反;persuade/persuaded/persuades=persuade means to make someone agree by giving reasons, not to treat them cruelly=persuade 是说服，不是残酷迫害|per · se · cute|per + secute, starting per-|per + secute，以 per- 开头
      persecution|cruel treatment refugees escape;cruelty to a minority lasting decades;fear that drove thousands to leave|persecution is cruel treatment for who people are; protection is keeping them safe|persecution 是迫害；protection 是保护|protection=protection is keeping people safe, not something refugees escape or fear=protection 是保护，不是难民要逃离或害怕的东西;perspiration=perspiration is sweat, not cruel treatment of people=perspiration 是汗水，不是对人的迫害|per · se · cu · tion|persecute with the e dropped, then -ion|persecute 去掉 e，再加 -ion
      asylum|safety in Germany after threats at home;protection that people fleeing danger apply for;being allowed to stay|asylum is protection a country gives to someone fleeing danger; a museum is a building with collections|asylum 是庇护；museum 是博物馆|museum=a museum is a building where objects are shown, not protection for people fleeing danger=museum 是博物馆，不是给逃难者的庇护;asset=an asset is something valuable you own, not protection that lets you stay in a country=asset 是资产，不是让你留下的庇护|a · sy · lum|a + sy + lum, with y after s|a + sy + lum，s 后是 y
      civil|equal rights for all citizens;a war between a country's own people;a wedding at the town hall, not in a church|civil means about citizens, not the army or the church; military means about the army|civil 是公民的、民间的；military 是军事的|military/Military=military means about the army, the opposite of a citizens' rights or a town hall wedding, and a war between a country's own people is a civil war=military 是军事的，和公民权利、市政厅婚礼正相反，而本国人民之间的战争叫 civil war;evil/Evil=evil means very bad and cruel, not about citizens and their rights=evil 是邪恶的，不是关于公民及其权利的|civ · il|civ + il|civ + il
      humanitarian|food and medicine for flood victims;millions hungry because of a war;work with refugees that won an award|humanitarian means helping people who suffer; military means about armies|humanitarian 是人道主义的；military 是军事的|military=military means about soldiers and weapons, not food, medicine or helping refugees=military 是军事的，不是食物、药品或帮助难民;vegetarian=vegetarian means eating no meat, not helping people who suffer=vegetarian 是素食的，不是帮助受苦的人|hu · man · i · tar · i · an|human + itarian|human + itarian
      violate|safety rules broken so workers were injured;torture against human rights;reading other people's emails|to violate is to break a rule or fail to respect a right; to respect is to keep it|violate 是违反、侵犯；respect 是尊重|respect/respected/respects/respecting=respect means to keep a rule or honor a right, the opposite of injuring workers, torture or reading private emails=respect 是遵守、尊重，和致工人受伤、酷刑、偷看邮件正相反;ventilate/ventilated/ventilates/ventilating=ventilate means to let fresh air into a room, not to break a rule or a right=ventilate 是通风，不是违反规定或权利|vi · o · late|vio + late|vio + late
      violation|an arrest made without any reason;safety failures a factory was fined for;rights abuses including torture|a violation is the breaking of a rule or a right; protection keeps it safe|violation 是违反、侵犯；protection 是保护|protection/protections=protection keeps rights safe, the opposite of an arrest without reason, a fine or torture=protection 是保护，和无故逮捕、罚款、酷刑正相反;vibration/vibrations=a vibration is a fast shaking movement, not the breaking of a rule or a right=vibration 是振动，不是违反规定或权利|vi · o · la · tion|violate with the e dropped, then -ion|violate 去掉 e，再加 -ion
      entitlement|four weeks of paid vacation for all workers;pensions people have earned;expecting special treatment|an entitlement is a right to receive something; an obligation is a duty you must do|entitlement 是应得的权利；obligation 是义务|obligation=an obligation is something you must do, not something you receive such as vacation, a pension or special treatment=obligation 是必须履行的义务，不是假期、养老金或特殊待遇这类可得之物;enlightenment=enlightenment is deep understanding, not a right to receive something=enlightenment 是启蒙、领悟，不是享有某物的权利|en · ti · tle · ment|entitle + ment|entitle + ment
      rights|free speech and a fair trial for everyone;what the law protects for workers;what a lifelong fight for humans is about|rights are what every person may have or do; duties are what they must do|rights 是权利；duties 是义务|duties=duties are things you must do, not free speech, a fair trial or what the law protects for you=duties 是义务，不是言论自由、公平审判或法律保护的权益;rites=rites are religious or traditional ceremonies, not what every person may have or do=rites 是仪式，不是人人享有的权利|rights|r + ights, with a silent gh|r + ights，gh 不发音
    `,
  },
});

const justice = vocabularyTopic({
  id: "b2-words-justice",
  title: t("Justice", "公正"),
  summary: t(
    "Justice and injustice; unfair and corrupt systems; compensating victims; grievances; upholding and overturning decisions; retribution; wrongful arrests; equitable and impartial treatment.",
    "公正和不公正；不公平的和腐败的制度；赔偿受害者；不满；维持和推翻判决；报复；错误的逮捕；公平的和公正无私的对待。",
  ),
  intro: t(
    "After a **wrongful** conviction, the higher court **overturned** the verdict, and the state agreed to **compensate** him for the **injustice**. These words help you talk about fairness, unfairness and how the law puts things right.",
    "在一次 **wrongful**（错误的）定罪之后，上级法院 **overturned**（推翻）了判决，政府同意为这一 **injustice**（不公）**compensate**（赔偿）他。这些词帮你谈论公平、不公，以及法律如何纠正错误。",
  ),
  prerequisites: ["b2-words-law"],
  words: [
    word(
      "justice",
      "fair treatment of people; the system of law courts and punishment",
      "公正；司法",
      "The victims' families are still waiting for {justice}, for the killer to be tried. | The criminal {justice} system is too slow. | She has a strong sense of {justice} and always defends the weak.",
      "injustice juice",
    ),
    word(
      "injustice",
      "a situation in which people are treated unfairly",
      "不公正；不公平",
      "He spent his life fighting {injustice} and helping people treated unfairly. | It is a terrible {injustice} that she went to prison for a crime she didn't commit. | The report describes the {injustice} suffered by poor families, who are treated unfairly by the courts.",
      "justice injury",
    ),
    word(
      "unfair",
      "not treating people equally or in the right way",
      "不公平的",
      "Women are paid less than men for the same job, which is {unfair}. | The referee's decision was {unfair}, and the fans booed. | The rules are {unfair} to small businesses, which cannot afford the fees.",
      "fair just",
    ),
    word(
      "corrupt",
      "using power dishonestly, for example by taking money",
      "腐败的；贪污的",
      "The {corrupt} official took money from builders in return for permits. | The whole police force was {corrupt} and took bribes. | Voters are tired of {corrupt} politicians who take bribes.",
      "honest correct",
    ),
    word(
      "compensate compensates compensated compensating",
      "to pay someone money because they have suffered loss or injury",
      "赔偿；补偿",
      "The airline {compensated} passengers for the delay, paying each one 200 euros.|punished contemplated | No amount of money can {compensate} the family for the loss of their child. | The company is {compensating} workers who were hurt, paying their medical bills.|punishing contemplating",
      "punish contemplate",
    ),
    word(
      "grievance grievances",
      "a complaint about being treated unfairly",
      "不满；冤情",
      "Workers have a long list of {grievances} about pay.|compliments griefs | If you have a {grievance} about unfair treatment, speak to your manager. | The minister promised to listen to the farmers' {grievances} about low prices.|compliments griefs",
      "compliment grief",
    ),
    word(
      "uphold upholds upheld upholding",
      "to support a decision or a law and make sure it continues",
      "维持；支持",
      "The higher court {upheld} the verdict, so he stayed in prison.|overturned withheld | Judges must {uphold} the law and make sure it is followed. | The police are there to {uphold} order and keep the peace.",
      "overturn withhold",
      "overturn",
    ),
    word(
      "overturn overturns overturned overturning",
      "to change a legal decision to the opposite; to turn something upside down",
      "推翻；翻转",
      "The court {overturned} the verdict, and she was freed.|upheld overtook | New evidence could {overturn} his conviction and set him free. | The car hit a wall and {overturned}, landing on its roof.|upheld overtook",
      "uphold overtake",
      "uphold",
    ),
    word(
      "retribution",
      "severe punishment for something very bad",
      "报应；惩罚",
      "The victim's family wanted {retribution}, not forgiveness. | Many people fear {retribution}, punishment by the gang, if they speak out against it. | Is prison about {retribution}, punishing criminals, or rehabilitation?",
      "forgiveness contribution",
    ),
    word(
      "wrongful",
      "not fair, legal or morally right",
      "错误的；不正当的",
      "He was paid compensation for {wrongful} arrest. | She sued her employer for {wrongful} dismissal. | After the {wrongful} conviction, he spent ten years in prison for nothing.",
      "rightful lawful",
      "unfair",
    ),
    word(
      "equitable",
      "fair and reasonable, treating everyone equally",
      "公平的；公正的",
      "We need a more {equitable} way to share the money. | The new tax system is more {equitable}, because the rich pay more. | The {equitable} solution gave each side half.",
      "unequal equable",
    ),
    word(
      "impartiality",
      "not supporting one side more than the other",
      "公正；不偏不倚",
      "Judges must show complete {impartiality}, favoring neither side. | The BBC is known for its {impartiality} in news reports. | Critics questioned the {impartiality} of the investigation, saying it favored the police.",
      "partiality bias",
      "justice",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Uphold* and *overturn* are opposites: a higher court *upholds* a verdict to keep it and *overturns* it to change it. Ask whether the person stays in prison or goes free.",
        "*uphold* 和 *overturn* 意思相反：上级法院 *upholds* 判决就是维持原判，*overturns* 就是推翻它。想想句子里的人是继续坐牢，还是获释。",
      ),
      meaning: t(
        "*Retribution* is severe punishment as payback, while *compensation* is money paid to someone who has suffered. Check whether the meaning is about hurting the wrongdoer or helping the victim.",
        "*retribution* 是作为报应的严厉惩罚，*compensation* 是付给受害者的钱。看释义说的是惩罚做错的人，还是帮助受害者。",
      ),
      spell: t(
        "*Grievance* has ie and ends in -ance, *equitable* ends in -table, and *impartiality* is im + partiality.",
        "*grievance* 里是 ie，以 -ance 结尾，*equitable* 以 -table 结尾，*impartiality* 是 im + partiality。",
      ),
    },
    notes: `
      justice|a killer tried for the victims' families;the system of courts that is too slow;defending the weak|justice is fair treatment and the law courts; injustice is unfair treatment|justice 是公正、司法；injustice 是不公|injustice=injustice is unfair treatment, not what families wait for or what someone who defends the weak believes in=injustice 是不公，不是家属期待或保护弱者的人所信奉的;juice=juice is a drink made from fruit, not fair treatment or the courts=juice 是果汁，不是公正或法院|jus · tice|jus + tice|jus + tice
      injustice|people treated unfairly;prison for a crime she didn't commit;poor families treated unfairly by courts|injustice is unfair treatment; justice is fair treatment|injustice 是不公；justice 是公正|justice=justice is fair treatment, the opposite of unfair treatment or prison for a crime she didn't commit=justice 是公正，和不公对待、无辜入狱正相反;injury=an injury is damage to the body, not unfair treatment by courts=injury 是身体受伤，不是法院的不公对待|in · jus · tice|in + justice|in + justice
      unfair|less pay for the same job;a decision the fans booed;rules small businesses cannot afford|unfair means not treating people equally; fair means treating them equally|unfair 是不公平的；fair 是公平的|fair=fair means treating people equally, the opposite of less pay for the same work, booing or rules people can't afford=fair 是公平的，和同工不同酬、被嘘、负担不起的规定正相反;just=just means fair and right, the opposite of what fans boo or what hurts small businesses=just 是公正的，和被嘘、伤害小企业正相反|un · fair|un + fair|un + fair
      corrupt|an official taking money for permits;a police force that took bribes;politicians who take bribes|corrupt means using power dishonestly; honest means telling the truth and not cheating|corrupt 是腐败的；honest 是诚实的|honest=honest means not cheating, the opposite of taking money or bribes=honest 是诚实的，和收钱受贿正相反;correct=correct means right or without mistakes, not using power dishonestly=correct 是正确的，不是滥用权力的|cor · rupt|cor + rupt, with a double r|cor + rupt，双写 r
      compensate|200 euros for each delayed passenger;money for the loss of a child;medical bills paid for hurt workers|to compensate is to pay someone for a loss or injury; to punish is to make them suffer|compensate 是赔偿；punish 是惩罚|punish/punished/punishing=punish means to make someone suffer, the opposite of paying passengers, a family or hurt workers=punish 是惩罚，和赔钱给乘客、家属或受伤工人正相反;contemplate/contemplated/contemplating=contemplate means to think about something carefully, not to pay someone for a loss=contemplate 是深思，不是为损失付钱|com · pen · sate|com + pen + sate|com + pen + sate
      grievance|complaints from workers about pay;a complaint about unfair treatment;farmers' complaints about low prices|a grievance is a complaint about unfair treatment; a compliment is praise|grievance 是不满、冤情；compliment 是赞美|compliment/compliments=a compliment is praise, the opposite of a complaint about pay, unfair treatment or low prices=compliment 是赞美，和对工资、不公、低价的抱怨正相反;grief/griefs=grief is deep sadness after a death, not a complaint about unfair treatment=grief 是丧亲之痛，不是对不公的抱怨|griev · ance|grieve with the e dropped, then -ance|grieve 去掉 e，再加 -ance
      uphold|a verdict kept so he stayed in prison;the law that must be followed;order and peace kept by police|to uphold is to support a decision or a law so it continues; to overturn is to change it to the opposite|uphold 是维持、支持；overturn 是推翻|overturn/overturned=overturn means to change a decision to the opposite, which would free him, not keep him in prison or keep the law followed=overturn 是推翻，会让他获释，而不是让他继续坐牢或确保法律被遵守;withhold/withheld=withhold means to refuse to give something, not to support a decision or keep order=withhold 是扣留，不是维持判决或秩序|up · hold|up + hold|up + hold
      overturn|a verdict changed so she was freed;new evidence that could set him free;a car landing on its roof|to overturn is to change a decision or turn something over; to uphold is to keep a decision|overturn 是推翻、翻转；uphold 是维持|uphold/upheld=uphold means to keep a decision, the opposite of freeing someone, and a car cannot uphold=uphold 是维持原判，和使人获释正相反，车也不能 uphold;overtake/overtook=overtake means to pass a car ahead of you, not to change a verdict or land upside down=overtake 是超车，不是推翻判决或翻车|o · ver · turn|over + turn|over + turn
      retribution|what a family wanted instead of forgiveness;punishment by a gang for speaking out;punishing criminals rather than helping them|retribution is severe punishment as payback; forgiveness is letting a wrong go|retribution 是报应、惩罚；forgiveness 是宽恕|forgiveness=forgiveness is letting go of anger at a wrong, the opposite of punishment by a gang or punishing criminals=forgiveness 是宽恕，和黑帮报复、惩罚罪犯正相反;contribution=a contribution is something you give to help, not severe punishment=contribution 是贡献，不是严厉的惩罚|ret · ri · bu · tion|re + tribut + ion|re + tribut + ion
      wrongful|an arrest that earned compensation;a dismissal she sued her employer for;a conviction that cost ten years for nothing|wrongful means not fair or legal; rightful means fair and legal|wrongful 是错误的、不正当的；rightful 是合法正当的|rightful=rightful means fair and legal, the opposite of something you are paid compensation for or sue over=rightful 是正当的，和获赔、起诉的事正相反;lawful=lawful means allowed by law, the opposite of an arrest, dismissal or conviction that was wrong=lawful 是合法的，和错误的逮捕、解雇或定罪正相反|wrong · ful|wrong + ful, with a single l|wrong + ful，只有一个 l
      equitable|a way to share money so everyone gets a fair part;a tax system where the rich pay more;a solution that gave each side half|equitable means fair and equal for everyone; unequal means not the same for all|equitable 是公平的；unequal 是不平等的|unequal=unequal means not the same for everyone, the opposite of a fair part or each side getting half=unequal 是不平等的，和每人公平一份、各得一半正相反;equable=equable means calm and even-tempered, not fair in sharing=equable 是性情平和的，不是分配公平的|eq · ui · ta · ble|equit + able|equit + able
      impartiality|judges favoring neither side;fair news reports;an investigation said to favor the police|impartiality is not supporting one side; partiality is favoring one side|impartiality 是公正无私；partiality 是偏袒|partiality=partiality is favoring one side, the opposite of favoring neither side or fair reports=partiality 是偏袒，和不偏向任何一方、公正报道正相反;bias=bias is unfairly favoring one side, the opposite of what judges and news reports must show=bias 是偏见，和法官、新闻应有的态度正相反|im · par · ti · al · i · ty|im + partial + ity|im + partial + ity
    `,
  },
});

const policing = vocabularyTopic({
  id: "b2-words-policing",
  title: t("Policing", "警务"),
  summary: t(
    "Patrolling the streets; investigations and detectives; suspects and suspecting; forensic evidence and fingerprints; interrogating suspects; warrants and raids; informants; alibis and motives.",
    "巡逻街道；调查和侦探；嫌疑人和怀疑；法医证据和指纹；审问嫌疑人；搜查令和突击搜查；线人；不在场证明和动机。",
  ),
  intro: t(
    "A **detective** found a **fingerprint** on the glass, a judge signed a **warrant**, and at dawn the police carried out a **raid** on the house. These words help you talk about how police find out who committed a crime.",
    "一名 **detective**（警探）在玻璃上发现了 **fingerprint**（指纹），法官签发了 **warrant**（搜查令），黎明时警察对那所房子进行了 **raid**（突击搜查）。这些词帮你谈论警察如何查出罪犯。",
  ),
  prerequisites: ["b2-words-crime-2"],
  words: [
    word(
      "patrol patrols patrolled patrolling",
      "to go around an area regularly to check that there is no trouble; a group that does this",
      "巡逻",
      "Police officers {patrol} the streets at night, looking for trouble. | Soldiers {patrolled} the border, walking along it day and night.|avoided paroled | A {patrol} found the missing hikers in the forest.|parole petrol",
      "avoid parole",
    ),
    word(
      "investigation investigations",
      "an official attempt to find out the truth about a crime or an event",
      "调查",
      "The police have opened an {investigation} into the fire to find out how it started. | The {investigation} took two years, and the detectives finally found the truth. | Several {investigations} into the bank are still going on.|invitations instigations",
      "invitation instigation",
      "detective",
    ),
    word(
      "detective detectives",
      "a police officer whose job is to find out who committed crimes",
      "侦探；警探",
      "A {detective} questioned the neighbors about the murder. | Sherlock Holmes is the most famous {detective} in fiction, solving crime after crime. | {Detectives} investigating the theft found the stolen car in a garage.|Suspects Detectors",
      "suspect detector",
    ),
    word(
      "suspect suspects suspected suspecting",
      "a person the police think may have committed a crime; to think that something is probably true",
      "嫌疑人；怀疑",
      "The police arrested two {suspects} near the bank they thought had robbed it.|detectives witnesses | I {suspect} that he's lying, but I can't prove it.|respect regret | She was {suspected} of stealing from her employer, but nobody could prove it.|convicted cleared",
      "detective witness",
    ),
    word(
      "forensic",
      "using science to find out about a crime",
      "法医的；刑侦的",
      "{Forensic} scientists examined the blood on the knife. | The {forensic} evidence, DNA from the scene, proved that he had been in the room. | She studies {forensic} medicine to help police find out how people died.",
      "political fictional",
    ),
    word(
      "fingerprint fingerprints",
      "the mark that the skin of a finger leaves on a surface",
      "指纹",
      "The thief's {fingerprints} were on the glass he had held.|footprints blueprints | You can unlock the phone with your {fingerprint}. | The police took his {fingerprints}, pressing each finger onto paper, after the arrest.|footprints blueprints",
      "footprint blueprint",
    ),
    word(
      "interrogate interrogates interrogated interrogating",
      "to ask someone a lot of questions for a long time, often aggressively",
      "审问；讯问",
      "The police {interrogated} the suspect for six hours, asking question after question.|interrupted integrated | They {interrogate} prisoners in a small room with no windows, asking about their plans. | Soldiers were {interrogating} everyone who crossed the border about why they had come.|interrupting integrating",
      "interrupt integrate",
    ),
    word(
      "warrant warrants",
      "an official document that allows the police to do something, such as search a house or arrest someone",
      "（逮捕或搜查）令状",
      "The police need a {warrant} from a judge to search your home. | A judge issued a {warrant} for his arrest. | They arrived with search {warrants} signed by a judge.|warranties verdicts",
      "warranty verdict",
    ),
    word(
      "raid raids",
      "a sudden visit by the police to search for people or things",
      "突击搜查",
      "Police found drugs and weapons in a {raid} on the house at dawn. | Dawn {raids} were carried out across the city, with police breaking down doors.|Patrols Rains | The surprise {raid} on the factory led to twelve arrests.",
      "patrol rain",
    ),
    word(
      "informant informants",
      "a person who secretly gives the police information about criminals",
      "线人；告密者",
      "An {informant}, paid in secret by the police, told them where the drugs were hidden. | The gang discovered that one of its members was a police {informant}, secretly passing on its plans. | {Informants} are paid for the secrets they tell the police.|Alibis Inhabitants",
      "alibi inhabitant",
    ),
    word(
      "alibi alibis",
      "proof that you were somewhere else when a crime happened",
      "不在场证明",
      "He has an {alibi}: he was at work all evening. | Her {alibi}, that she was at the cinema, was checked and turned out to be false. | Both suspects have strong {alibis}: they were miles away that night.|albums accomplices",
      "album accomplice",
    ),
    word(
      "motive motives",
      "a reason for doing something, especially a crime",
      "动机",
      "What was the {motive} for the murder? Money? | Police believe the {motive} was jealousy: he hated her new boyfriend. | Her {motives} for helping were not entirely selfless.|motions motifs",
      "motion motif",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "An *alibi* is proof you were somewhere else, while a *motive* is a reason for committing the crime. Ask whether the sentence helps or harms the suspect.",
        "*alibi* 是证明你当时在别处的证据，*motive* 是犯罪的动机。想想句子是在帮嫌疑人开脱，还是对他不利。",
      ),
      meaning: t(
        "To *interrogate* is to ask someone many questions for a long time, while to *patrol* is to go around an area checking for trouble. Check whether the meaning is about questioning a person or watching a place.",
        "*interrogate* 是长时间反复盘问某人，*patrol* 是在一片区域巡查有无异常。看释义说的是审问人，还是巡视地方。",
      ),
      spell: t(
        "*Patrol* has a single l in *patrol* but doubles it in *patrolled*, *forensic* ends in -sic, and *alibi* ends in i.",
        "*patrol* 只有一个 l，但 *patrolled* 双写 l，*forensic* 以 -sic 结尾，*alibi* 以 i 结尾。",
      ),
    },
    notes: `
      patrol|officers checking the streets at night;soldiers walking the border day and night;a group that found hikers in a forest|to patrol is to go around an area checking for trouble; to avoid is to keep away|patrol 是巡逻；avoid 是避开|avoid/avoided=avoid means to keep away from a place, the opposite of walking along it or checking it all night=avoid 是避开，和整夜巡查、来回走动正相反;parole/paroled=parole is letting a prisoner out early, not going around an area or a group that finds people=parole 是假释，不是巡逻或找人的小队;petrol=petrol is fuel for cars, not a group that searches a forest=petrol 是汽油，不是搜索森林的小队|pa · trol|pa + trol, doubling the l in *patrolled*|pa + trol，*patrolled* 里双写 l
      investigation|police finding out how a fire started;two years of work to find the truth;inquiries into a bank still going on|an investigation is an attempt to find the truth; an invitation asks someone to come|investigation 是调查；invitation 是邀请|invitation/invitations=an invitation asks someone to come to an event, not an attempt to find out the truth=invitation 是邀请，不是查明真相的工作;instigation/instigations=instigation is causing something to start, not finding out what happened=instigation 是煽动、发起，不是查明发生了什么|in · ves · ti · ga · tion|investigate with the e dropped, then -ion|investigate 去掉 e，再加 -ion
      detective|neighbors questioned about a murder;Sherlock Holmes solving crimes;officers investigating a theft who found a stolen car|a detective finds out who committed crimes; a suspect may have committed one|detective 是警探；suspect 是嫌疑人|suspect/Suspects=a suspect is someone thought to have done the crime, not the one who questions people or solves crimes=suspect 是嫌疑人，不是盘问别人或破案的人;detector/Detectors=a detector is a machine that finds metal or smoke, not a person who questions neighbors=detector 是探测器，不是盘问邻居的人|de · tec · tive|detect + ive|detect + ive
      suspect|two people arrested and thought to have robbed a bank;thinking he's lying without proof;stealing that nobody could prove|a suspect is someone the police think did a crime, and to suspect is to think something is probably true; a witness saw what happened|suspect 是嫌疑人、怀疑；witness 是证人|detective/detectives=a detective catches criminals, not someone arrested for robbing a bank=detective 是警探，不是因抢劫被捕的人;witness/witnesses=a witness saw a crime, not someone thought to have done it=witness 是目击者，不是被认为作案的人;respect=respect means to admire someone, not to think a lie is probably being told=respect 是尊重，不是怀疑有人说谎;regret=regret means to feel sorry about something you know happened, but here it cannot be proved=regret 是为确知发生的事感到遗憾，而这里的事无法证明;convicted=convicted means proven guilty in court, the opposite of nobody being able to prove it=convicted 是被定罪，和无人能证明正相反;cleared=cleared means shown to be innocent, not thought to be guilty without proof=cleared 是被证明清白，不是无证据地被怀疑|sus · pect|sus + pect|sus + pect
      forensic|scientists examining blood on a knife;DNA from the scene;medicine that shows how people died|forensic means using science to solve crimes; political means about government|forensic 是法医的、刑侦的；political 是政治的|political=political means about government and parties, not examining blood, DNA or causes of death=political 是政治的，不是检验血迹、DNA 或死因;fictional=fictional means from a story and not real, not real evidence that proves where someone was=fictional 是虚构的，不是证明行踪的真实证据|fo · ren · sic|foren + sic, ending in -sic|foren + sic，以 -sic 结尾
      fingerprint|marks on a glass a thief had held;a way to unlock a phone;marks taken by pressing each finger onto paper|a fingerprint is the mark of a finger; a footprint is the mark of a foot|fingerprint 是指纹；footprint 是脚印|footprint/footprints=a footprint is a mark made by a foot or shoe, not on a glass, a phone or pressed from a finger=footprint 是脚印，不会留在杯子、手机上或用手指按出;blueprint/blueprints=a blueprint is a plan for a building or machine, not a mark made by skin=blueprint 是蓝图，不是皮肤留下的印记|fin · ger · print|finger + print, one word|finger + print，连写成一个词
      interrogate|six hours of question after question;prisoners asked about their plans;everyone crossing a border asked why they came|to interrogate is to question someone hard and long; to interrupt is to stop someone speaking|interrogate 是审问；interrupt 是打断|interrupt/interrupted/interrupting=interrupt means to stop someone speaking, not to ask them question after question=interrupt 是打断，不是一个接一个地提问;integrate/integrated/integrating=integrate means to join people or things into a whole, not to question them=integrate 是融合，不是盘问|in · ter · ro · gate|inter + rogate, with a double r|inter + rogate，双写 r
      warrant|a judge's paper to search your home;a paper issued for someone's arrest;search papers signed by a judge|a warrant lets the police search or arrest; a warranty is a promise to repair a product|warrant 是令状；warranty 是保修单|warranty/warranties=a warranty is a promise to repair a product, not a judge's paper to search or arrest=warranty 是保修承诺，不是法官的搜查或逮捕令;verdict/verdicts=a verdict decides whether someone is guilty after a trial, not a paper that lets police search a home or make an arrest=verdict 是审判后的裁决，不是允许警方搜查或逮捕的文件|war · rant|war + rant, with a double r|war + rant，双写 r
      raid|drugs found at a house at dawn;doors broken down across the city;a surprise visit that led to twelve arrests|a raid is a sudden police visit to search; a patrol is regular checking of an area|raid 是突击搜查；patrol 是巡逻|patrol/Patrols=a patrol goes around an area regularly, not a sudden search of a house that breaks down doors=patrol 是例行巡逻，不是破门而入的突击搜查;rain/Rains=rain is water falling from clouds, not a police search=rain 是雨，不是警方搜查|raid|r + aid|r + aid
      informant|a person paid in secret who told police where drugs were;a gang member passing on its plans;people paid for the secrets they tell police|an informant secretly gives the police information; an inhabitant simply lives in a place|informant 是线人；inhabitant 是居民|alibi/Alibis=an alibi is proof you were elsewhere, not a person who tells police secrets=alibi 是不在场证明，不是向警察透露秘密的人;inhabitant/Inhabitants=an inhabitant simply lives in a place, not someone paid in secret to pass on a gang's plans=inhabitant 是居民，不是被秘密收买、通风报信的人|in · for · mant|inform + ant|inform + ant
      alibi|being at work all evening;a claim of being at the cinema that proved false;being miles away that night|an alibi is proof you were elsewhere; an accomplice helps with the crime|alibi 是不在场证明；accomplice 是同谋|album/albums=an album is a book of photos or a set of songs, not proof of where you were=album 是相册或专辑，不是行踪证明;accomplice/accomplices=an accomplice helps commit the crime, the opposite of proof that you were somewhere else=accomplice 是同谋，和证明你在别处正相反|al · i · bi|ali + bi, ending in i|ali + bi，以 i 结尾
      motive|money as the reason for a murder;jealousy of a new boyfriend;reasons for helping that were not selfless|a motive is the reason for doing something; a motion is a movement or a proposal|motive 是动机；motion 是动作、动议|motion/motions=a motion is a movement or a proposal at a meeting, not the reason for a crime or for helping=motion 是动作或动议，不是犯罪或帮忙的原因;motif/motifs=a motif is a pattern or repeated idea in art, not a reason for doing something=motif 是图案或主题，不是做事的原因|mo · tive|mot + ive|mot + ive
    `,
  },
});

const government = vocabularyTopic({
  id: "b2-words-government",
  title: t("Government", "政府"),
  summary: t(
    "Governing a country and governance; federal and municipal government; bureaucracies and bureaucratic rules; civil servants; the administration and administrative work; jurisdiction; decrees and vetoes.",
    "治理国家和治理方式；联邦政府和市政府；官僚机构和官僚的规定；公务员；行政当局和行政工作；管辖权；法令和否决。",
  ),
  intro: t(
    "The **federal** government passed the law, but the president's **veto** stopped it, and **municipal** offices drowned in **bureaucracy**. These words help you talk about who runs a country or a city and how.",
    "**federal**（联邦）政府通过了法律，但总统的 **veto**（否决）拦下了它，而 **municipal**（市政）部门则淹没在 **bureaucracy**（官僚作风）里。这些词帮你谈论谁在管理国家或城市，以及如何管理。",
  ),
  prerequisites: ["b2-words-politics"],
  words: [
    word(
      "govern governs governed governing",
      "to officially control a country, a city or an organization",
      "治理；统治",
      "The party has {governed} the country for twenty years, winning every election.|opposed abandoned | Who will {govern} the country after the election and lead the government? | Strict rules {govern} how the money is spent, saying exactly what it can buy.",
      "oppose abandon",
      "governance",
    ),
    word(
      "governance",
      "the way that a country or an organization is controlled",
      "治理；管理",
      "Good {governance} reduces corruption. | The company has improved its {governance}, the way it is run, since the scandal. | The report criticizes the {governance} of the city's schools: nobody knows who decides what.",
      "governess grievance",
    ),
    word(
      "federal",
      "connected with the central government of a country made of states, such as the US",
      "联邦的",
      "The {federal} government in Washington sets taxes for the whole country. | Germany and the US are {federal} countries, made up of states. | It is a {federal} crime to rob a bank in the US, tried in national courts.",
      "municipal funeral",
      "municipal",
    ),
    word(
      "municipal",
      "connected with the government of a town or a city",
      "市政的；市立的",
      "The {municipal} swimming pool is run by the city council. | {Municipal} elections choose the mayor and the city council. | The {municipal} library is free for residents of the town.",
      "federal multiple",
      "federal",
    ),
    word(
      "bureaucracy bureaucracies",
      "a system of government with many rules and officials; too many rules that make things slow",
      "官僚体制；官僚作风",
      "There's so much {bureaucracy}: I had to fill in ten forms to open a café. | The EU is often accused of {bureaucracy}, with too many rules and officials. | Large {bureaucracies}, full of forms and officials, move slowly.|democracies aristocracies",
      "democracy aristocracy",
      "bureaucratic",
    ),
    word(
      "bureaucratic",
      "having too many complicated rules and processes",
      "官僚的；繁文缛节的",
      "Getting a visa is a long, {bureaucratic} process with many forms. | The {bureaucratic} rules, with forms for everything, made it hard to start a business. | The system is too {bureaucratic}, so nothing gets done.",
      "democratic diplomatic",
      "bureaucracy",
    ),
    word(
      "servant servants",
      "a person who works in another person's house; a person who works for the government",
      "仆人；公务员",
      "Civil {servants} work for the government, not for a political party.|serpents sergeants | In the past, rich families had many {servants} to cook and clean.|serpents sergeants | A police officer is a public {servant}.",
      "serpent sergeant",
    ),
    word(
      "administration",
      "the work of managing a business or an organization; a government in power",
      "管理；行政；政府",
      "She works in hospital {administration}, managing staff and budgets. | The new {administration} promised to cut taxes. | {Administration} costs, for offices and managers, take a large part of the budget.",
      "admiration legislation",
    ),
    word(
      "administrative",
      "connected with managing an organization or a government",
      "管理的；行政的",
      "She has a well-paid {administrative} job, managing the office of a large company. | Teachers complain about {administrative} work, such as filling in forms. | The city is the {administrative} center of the region, where its government offices are.",
      "authoritative creative",
    ),
    word(
      "jurisdiction",
      "the official power to make legal decisions; the area where this power applies",
      "管辖权；管辖范围",
      "The case is outside the court's {jurisdiction}, so it must go to another court. | Each state has {jurisdiction} over its own schools and makes their rules. | The crime happened in another country's {jurisdiction}, where our police have no power.",
      "prediction contradiction",
    ),
    word(
      "decree decrees",
      "an official order from a leader or a government that has the power of law",
      "法令",
      "The president issued a {decree} closing all schools. | The king ruled by {decree}, ignoring parliament. | Under the new {decree}, protests are banned.",
      "degree debate",
    ),
    word(
      "veto vetoes vetoed vetoing",
      "to officially refuse to allow a law or a plan; the right to do this",
      "否决；否决权",
      "The president {vetoed} the bill, so it did not become law.|approved signed | Five countries can {veto} decisions in the UN Security Council, blocking them alone. | Mom always {vetoes} our plans to get a dog, saying no.|approves signs",
      "approve sign",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Federal* is about the central government of a whole country made of states, while *municipal* is about the government of one town or city. Ask whether the sentence is about the whole country or one city.",
        "*federal* 指由各州组成的整个国家的中央政府，*municipal* 指一个城镇的政府。想想句子说的是整个国家，还是一座城市。",
      ),
      meaning: t(
        "A *decree* is an order from a leader with the power of law, while a *veto* is the right to refuse a law. Check whether the meaning is about giving an order or blocking one.",
        "*decree* 是领导人发布、具有法律效力的命令，*veto* 是拒绝通过法律的权力。看释义说的是下令，还是否决。",
      ),
      spell: t(
        "*Bureaucracy* begins with bureau-, *jurisdiction* has -dic- in the middle, and *veto* adds -es in *vetoes*.",
        "*bureaucracy* 以 bureau- 开头，*jurisdiction* 中间是 -dic-，*veto* 的复数和三单是 *vetoes*。",
      ),
    },
    notes: `
      govern|a party in power for twenty years;whoever leads the country after an election;rules saying exactly what money can buy|to govern is to officially control a country or how something is done; to oppose is to be against it|govern 是治理、支配；oppose 是反对|oppose/opposed=oppose means to be against something, not to run a country for twenty years or set out what money can buy=oppose 是反对，不是执政二十年或规定钱怎么花;abandon/abandoned=abandon means to leave something for good, the opposite of running a country or controlling spending=abandon 是抛弃，和治理国家、控制开支正相反|gov · ern|gov + ern|gov + ern
      governance|good control that reduces corruption;the way a company is run;who decides what in a city's schools|governance is the way an organization is controlled; a governess is a woman who teaches children at home|governance 是治理；governess 是家庭女教师|governess=a governess teaches children in a family's home, not the way a company or schools are run=governess 是家庭女教师，不是公司或学校的管理方式;grievance=a grievance is a complaint about unfair treatment, not the way an organization is controlled=grievance 是对不公的抱怨，不是组织的治理方式|gov · ern · ance|govern + ance|govern + ance
      federal|the government in Washington setting taxes for the whole country;countries made up of states;a crime tried in national courts|federal means about the central government of a country of states; municipal means about one city|federal 是联邦的；municipal 是市政的|municipal=municipal means about a town or city, not taxes for a whole country, countries of states or national courts=municipal 是市政的，不是全国税收、由州组成的国家或全国性法院;funeral=a funeral is a ceremony after a death, not a kind of government=funeral 是葬礼，不是一种政府|fed · er · al|feder + al|feder + al
      municipal|a pool run by the city council;elections for a mayor and city council;a library for residents of the town|municipal means about a town or city government; federal means about the whole country|municipal 是市政的；federal 是联邦的|federal=federal means about the central government of the whole country, not a city council, a mayor or a town's library=federal 是联邦的，不是市议会、市长或镇图书馆;multiple=multiple means many, not run by a town or city government=multiple 是多个的，不是由市政府管理的|mu · nic · i · pal|munici + pal|munici + pal
      bureaucracy|ten forms to open a café;too many rules and officials in the EU;large systems full of forms that move slowly|bureaucracy is too many rules and officials; democracy is government by the people|bureaucracy 是官僚体制；democracy 是民主|democracy/democracies=democracy is government chosen by the people, not ten forms, too many officials or slow systems full of forms=democracy 是民主，不是一堆表格、过多官员或慢吞吞的体制;aristocracy/aristocracies=aristocracy is the class of nobles, not too many rules and forms=aristocracy 是贵族阶层，不是繁多的规定和表格|bu · reau · cra · cy|bureau + cracy|bureau + cracy
      bureaucratic|a long visa process with many forms;rules with forms for everything;a system where nothing gets done|bureaucratic means having too many rules and forms; democratic means run by the people's votes|bureaucratic 是官僚的；democratic 是民主的|democratic=democratic means decided by people's votes, not full of forms or so slow that nothing gets done=democratic 是民主的，不是表格繁多或慢得一事无成;diplomatic=diplomatic means about relations between countries or tactful, not having too many forms=diplomatic 是外交的或圆滑的，不是表格繁多|bu · reau · crat · ic|bureaucrat + ic|bureaucrat + ic
      servant|civil workers for the government;people who cooked and cleaned for rich families;a police officer working for the public|a servant works for others, in a house or for the state; a sergeant is a rank in the army or police|servant 是仆人、公务员；sergeant 是中士、警佐|serpent/serpents=a serpent is a large snake, not a person who works for a family or the state=serpent 是大蛇，不是为家庭或国家工作的人;sergeant/sergeants=a sergeant is a rank in the army or police, not someone who cooks and cleans or a civil worker=sergeant 是军衔或警衔，不是做饭打扫的人或公务员|ser · vant|serv + ant|serv + ant
      administration|managing staff and budgets in a hospital;a new government promising tax cuts;costs for offices and managers|administration is managing an organization, or a government; admiration is liking and respect|administration 是行政、管理、政府；admiration 是钦佩|admiration=admiration is a feeling of respect, not managing budgets or a government that makes promises=admiration 是钦佩之情，不是管理预算或作出承诺的政府;legislation=legislation is laws, not managing staff or a government that promises things=legislation 是法律，不是管理员工或作出承诺的政府|ad · min · is · tra · tion|administrate with the e dropped, then -ion|administrate 去掉 e，再加 -ion
      administrative|a job managing an office;work such as filling in forms;the center with a region's government offices|administrative means about managing an organization; creative means about making new things|administrative 是行政的；creative 是创造性的|authoritative=authoritative means trusted or giving orders with confidence, not about managing an office or forms=authoritative 是权威的，不是管理办公室或填表的;creative=creative means about making art or new ideas, not managing an office or filling in forms=creative 是有创意的，不是管理办公室或填表的|ad · min · is · tra · tive|administrate with the e dropped, then -ive|administrate 去掉 e，再加 -ive
      jurisdiction|a case that must go to another court;each state's power over its own schools;a crime where our police have no power|jurisdiction is the official power to make legal decisions; a prediction says what will happen|jurisdiction 是管辖权；prediction 是预测|prediction=a prediction says what will happen, not the power of a court or a state over cases and schools=prediction 是预测，不是法院或州对案件、学校的权力;contradiction=a contradiction is a statement against another, not legal power over an area=contradiction 是矛盾，不是对某地的法律管辖|ju · ris · dic · tion|juris + diction|juris + diction
      decree|an order closing all schools;ruling while ignoring parliament;an order banning protests|a decree is an official order with the power of law; a degree is a university qualification|decree 是法令；degree 是学位|degree=a degree is a university qualification, not an order that closes schools or bans protests=degree 是学位，不是关闭学校或禁止抗议的命令;debate=a debate is a discussion between sides, the opposite of ruling while ignoring parliament=debate 是辩论，和无视议会独断统治正相反|de · cree|de + cree, with a double e|de + cree，双写 e
      veto|a bill stopped so it did not become law;countries blocking decisions alone;a mom saying no to a dog|to veto is to officially refuse a law or a plan; to approve is to accept it|veto 是否决；approve 是批准|approve/approved/approves=approve means to accept a plan, the opposite of stopping a bill, blocking decisions or saying no=approve 是批准，和否决法案、阻止决定、说不正相反;sign/signed/signs=sign means to write your name to accept a bill, which would make it law, not stop it=sign 是签署通过，会让法案成为法律，而不是阻止它|ve · to|ve + to, adding -es in *vetoes*|ve + to，*vetoes* 要加 -es
    `,
  },
});

const protest = vocabularyTopic({
  id: "b2-words-protest",
  title: t("Protest", "抗议"),
  summary: t(
    "Activism; demonstrations and demonstrators; rallies; boycotting products; civil disobedience; resistance and resisting; uprisings and riots; mobilizing people; grassroots movements.",
    "社会运动；示威和示威者；集会；抵制产品；公民不服从；抵抗；起义和暴乱；动员民众；草根运动。",
  ),
  intro: t(
    "Thousands joined a peaceful **rally**, others called for a **boycott** of the company, and one night the protest turned into a **riot**. These words help you talk about how people fight for change and how protests can go.",
    "数千人参加了和平的 **rally**（集会），另一些人号召 **boycott**（抵制）这家公司，而一天夜里抗议演变成了 **riot**（暴乱）。这些词帮你谈论人们如何争取改变，以及抗议可能走向何方。",
  ),
  prerequisites: ["b2-words-social-issues"],
  words: [
    word(
      "activism",
      "taking action to bring about political or social change",
      "（政治或社会）行动主义；积极行动",
      "Her {activism} began at fifteen, when she joined a climate group to fight for change. | Online {activism}, such as petitions shared by millions, has pushed governments to change laws. | He was sent to prison for his {activism} after leading protests against the government.",
      "apathy atheism",
    ),
    word(
      "demonstration demonstrations",
      "a public event at which people march or gather to show that they support or oppose something",
      "示威；游行",
      "Thousands of people took part in the {demonstration} against the war. | Peaceful {demonstrations} are allowed in a democracy.|dominations determinations | The {demonstration} marched through the city and ended in front of parliament.",
      "domination determination",
      "rally",
    ),
    word(
      "demonstrator demonstrators",
      "a person who takes part in a demonstration",
      "示威者",
      "{Demonstrators} carried signs against the closing of the hospital as they marched to the town hall.|Dominators Decorators | The police arrested twenty {demonstrators} during the protest outside the embassy.|dominators decorators | One {demonstrator} climbed onto the roof of parliament with a banner against the new law.",
      "dominator decorator",
    ),
    word(
      "rally rallies",
      "a large public meeting to support a cause or a politician",
      "集会；大会",
      "The candidate spoke to thousands of supporters at the {rally} in the city square. | Huge {rallies} were held to support the strike.|allies alleys | The {rally} ended with music and speeches from the stage.",
      "ally alley",
      "demonstration",
    ),
    word(
      "boycott boycotts boycotted boycotting",
      "to refuse to buy, use or take part in something as a protest",
      "抵制",
      "Customers {boycotted} the company after the scandal, refusing to buy its products.|supported sponsored | Several countries {boycotted} the Olympic Games, refusing to send any athletes.|supported sponsored | We should {boycott} shops that sell fur and never spend money there.",
      "support sponsor",
    ),
    word(
      "disobedience",
      "refusing to do what a person or a rule tells you to do",
      "不服从；违抗",
      "Civil {disobedience} means breaking unfair laws peacefully. | The child was punished for {disobedience} after refusing again and again to go to bed. | Gandhi led acts of {disobedience}, such as breaking the salt law, against British rule.",
      "obedience independence",
    ),
    word(
      "resistance",
      "fighting against something or refusing to accept it",
      "抵抗；反抗",
      "There was strong {resistance} to the new tax, and thousands refused to pay it. | The {resistance} fought against the invading army for five years. | The body's {resistance} to disease weakens with age.",
      "assistance persistence",
      "resist",
    ),
    word(
      "resist resists resisted resisting",
      "to fight against something or refuse to accept it; to stop yourself from doing something you want to do",
      "抵抗；忍住",
      "The villagers {resisted} the invading soldiers for weeks, fighting them in the hills.|assisted obeyed | The cake looked so good that I couldn't {resist} it and took another piece. | He was charged with {resisting} arrest after he fought the officers.|assisting obeying",
      "assist obey",
      "resistance",
    ),
    word(
      "uprising uprisings",
      "an attempt by a group of people to defeat the people in power, often violently",
      "起义",
      "The {uprising} against the king was crushed by the army. | There were {uprisings} across the region in 2011, as people fought to remove their rulers.|upbringings sunrises | The {uprising} began in the poorest part of the city and soon brought down the government.",
      "upbringing sunrise",
      "riot",
    ),
    word(
      "riot riots",
      "a violent protest by a crowd of people",
      "暴乱；骚乱",
      "The protest turned into a {riot}, and shops were burned. | Police in {riot} gear lined the streets. | The {riots} lasted for three nights and left the city center in ruins.|rallies riddles",
      "rally riddle",
      "uprising",
    ),
    word(
      "mobilize mobilizes mobilized mobilizing",
      "to organize people for a purpose; to prepare an army for war",
      "动员",
      "The group {mobilized} thousands of volunteers in a week to clean the beaches.|modernized immobilized | Social media helps activists {mobilize} supporters and bring them onto the streets. | When war seemed near, the country began {mobilizing} its army, calling up every reserve soldier within days.|modernizing immobilizing",
      "modernize immobilize",
    ),
    word(
      "grassroots",
      "the ordinary people in an organization or a society, not the leaders",
      "草根；基层",
      "The campaign began with {grassroots} groups of local parents, not with any politician. | The party needs support from the {grassroots}, the ordinary members in every town.|leadership elite | {Grassroots} groups of neighbors, with no money from the government, planted trees all over the city.|Federal Elite",
      "federal elite",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *rally* is a large, usually peaceful meeting to support a cause, while a *riot* is a violent crowd that burns and breaks things. Ask whether the sentence shows speeches and music or fire and damage.",
        "*rally* 是支持某项事业的大型集会，通常是和平的，*riot* 是打砸焚烧的暴乱人群。看句子里是演讲和音乐，还是火灾和破坏。",
      ),
      meaning: t(
        "To *boycott* is to refuse to buy or take part in something as a protest, while to *mobilize* is to organize many people for a cause. Check whether the meaning is about staying away or bringing people together.",
        "*boycott* 是以拒绝购买或参加来表示抗议，*mobilize* 是把很多人组织起来为某事出力。看释义说的是远离，还是把人聚到一起。",
      ),
      spell: t(
        "*Disobedience* ends in -ience, *rally* changes y to i in *rallies*, and *grassroots* is one word with a double s.",
        "*disobedience* 以 -ience 结尾，*rally* 的复数 *rallies* 把 y 变成 i，*grassroots* 连写成一个词，有两个 s。",
      ),
    },
    notes: `
      activism|joining a climate group at fifteen to fight for change;petitions shared by millions;prison after leading protests|activism is taking action for political or social change; apathy is not caring at all|activism 是积极行动；apathy 是冷漠|apathy=apathy means not caring at all, the opposite of fighting for change, sharing petitions or leading protests=apathy 是冷漠，和争取改变、转发请愿、领导抗议正相反;atheism=atheism is not believing in God, not campaigning through groups, petitions or protests=atheism 是无神论，不是通过团体、请愿或抗议去争取改变|ac · tiv · ism|activ + ism|activ + ism
      demonstration|thousands taking part against a war;peaceful marches allowed in a democracy;a march through the city to parliament|a demonstration is a public march or gathering to show support or opposition; determination is a strong will|demonstration 是示威游行；determination 是决心|domination/dominations=domination is control over others, not an event people take part in or march in=domination 是统治、控制，不是人们参加的游行;determination/determinations=determination is a strong will to do something, not a public march against a war=determination 是决心，不是反战的公众游行|dem · on · stra · tion|demonstrate with the e dropped, then -ion|demonstrate 去掉 e，再加 -ion
      demonstrator|people marching to save a hospital;twenty arrested during a protest;someone on the roof with a banner against a law|a demonstrator takes part in a protest; a decorator paints and papers rooms|demonstrator 是示威者；decorator 是装修工|dominator/Dominators/dominators=a dominator controls others, not a person who marches or protests against a law=dominator 是控制别人的人，不是游行抗议的人;decorator/Decorators/decorators=a decorator paints rooms, not someone who marches with signs or protests outside an embassy=decorator 是装修工，不是举牌游行或在使馆外抗议的人|dem · on · stra · tor|demonstrate with the e dropped, then -or|demonstrate 去掉 e，再加 -or
      rally|a candidate speaking to thousands in a square;huge meetings held to support a strike;an event ending with music and speeches|a rally is a large public meeting for a cause; a riot is a violent crowd|rally 是集会；riot 是暴乱|ally/allies=an ally is a person or country on your side, not a meeting where thousands gather and listen to speeches=ally 是盟友，不是成千上万人聚集听演讲的集会;alley/alleys=an alley is a narrow street, not a public meeting that is held and ends with speeches=alley 是小巷，不是举行并以演讲结束的集会|ral · ly|r + ally, becoming *rallies*|r + ally，复数是 *rallies*
      boycott|customers refusing to buy after a scandal;countries refusing to send athletes;never spending money in shops that sell fur|to boycott is to refuse to buy or take part as a protest; to support is to help|boycott 是抵制；support 是支持|support/supported=support means to help or be on the side of something, the opposite of refusing to buy, take part or spend money=support 是支持，和拒绝购买、参加或花钱正相反;sponsor/sponsored=sponsor means to pay for an event or product, the opposite of refusing to spend money on it=sponsor 是赞助出钱，和拒绝花钱正相反|boy · cott|boy + cott, with a double t|boy + cott，双写 t
      disobedience|breaking unfair laws peacefully;refusing again and again to go to bed;acts such as breaking the salt law|disobedience is refusing to obey; obedience is doing what you are told|disobedience 是不服从；obedience 是服从|obedience=obedience is doing what you are told, the opposite of breaking laws or refusing to go to bed=obedience 是服从，和违法、拒不睡觉正相反;independence=independence is a country's freedom from other rule, not the act of breaking laws or refusing an order=independence 是独立，不是违法或拒绝服从的行为|dis · o · be · di · ence|dis + obedience, ending in -ience|dis + obedience，以 -ience 结尾
      resistance|thousands refusing to pay a new tax;fighters against an invading army;the body's power against disease|resistance is fighting against or refusing to accept something; assistance is help|resistance 是抵抗；assistance 是帮助|assistance=assistance is help, the opposite of refusing to pay a tax or fighting an army=assistance 是帮助，和拒绝纳税、对抗军队正相反;persistence=persistence is continuing to try, not fighting an army or the body's defense against disease=persistence 是坚持不懈，不是对抗军队或身体对疾病的抵抗力|re · sist · ance|resist + ance, ending in -ance|resist + ance，以 -ance 结尾
      resist|villagers fighting soldiers in the hills;a cake so good I took another piece;fighting officers during an arrest|to resist is to fight against something or stop yourself from wanting it; to assist is to help|resist 是抵抗、忍住；assist 是帮助|assist/assisted/assisting=assist means to help, the opposite of fighting soldiers or officers or holding back from cake=assist 是帮助，和与士兵或警察对抗、忍住不吃蛋糕正相反;obey/obeyed/obeying=obey means to do what you are told, the opposite of fighting soldiers or an arrest, and you cannot obey a cake=obey 是服从，和对抗士兵或拒捕正相反，蛋糕也谈不上服从|re · sist|re + sist|re + sist
      uprising|people against a king, crushed by the army;people across a region fighting to remove rulers;a revolt that brought down a government|an uprising is an attempt by people to defeat those in power; an upbringing is how a child is raised|uprising 是起义；upbringing 是成长教养|upbringing/upbringings=an upbringing is the way a child is raised, not a revolt against a king or rulers=upbringing 是教养，不是反抗国王或统治者的起义;sunrise/sunrises=a sunrise is the sun coming up, not people fighting those in power=sunrise 是日出，不是人们反抗当权者|up · ris · ing|up + rising|up + rising
      riot|a protest where shops were burned;police in protective gear;three nights that left a city in ruins|a riot is a violent crowd; a rally is a peaceful meeting|riot 是暴乱；rally 是集会|rally/rallies=a rally is a peaceful meeting with speeches, not burning shops or leaving a city in ruins=rally 是和平集会，不会焚烧商店或让城市变成废墟;riddle/riddles=a riddle is a puzzling question, not violence in the streets=riddle 是谜语，不是街头暴力|ri · ot|ri + ot|ri + ot
      mobilize|thousands of volunteers organized to clean beaches;bringing supporters onto the streets;calling up reserve soldiers for war|to mobilize is to organize people for a purpose; to immobilize is to stop something from moving|mobilize 是动员；immobilize 是使不能动|modernize/modernized/modernizing=modernize means to make something up to date, not to gather volunteers or call up soldiers=modernize 是现代化，不是召集志愿者或征召士兵;immobilize/immobilized/immobilizing=immobilize means to stop people moving, the opposite of bringing them onto the streets or into action=immobilize 是使不能动，和把人们召集起来行动正相反|mo · bi · lize|mobile with the e dropped, then -ize|mobile 去掉 e，再加 -ize
      grassroots|groups of local parents with no politician;ordinary members in every town;neighbors' groups with no government money|grassroots means the ordinary people, not the leaders; the elite are the powerful few at the top|grassroots 是草根、基层；elite 是精英|federal/Federal=federal means about a national government, not local parents or neighbors with no government money=federal 是联邦的，不是本地家长或没拿政府钱的邻居;elite/Elite=the elite are the powerful few at the top, the opposite of ordinary members, local parents or neighbors=elite 是少数上层精英，和普通成员、本地家长、邻居正相反;leadership=the leadership are the people at the top, the opposite of ordinary members in every town=leadership 是领导层，和各地普通成员正相反|grass · roots|grass + roots, one word|grass + roots，连写成一个词
    `,
  },
});

const formal = vocabularyTopic({
  id: "b2-words-formal-verbs",
  title: t("Formal Verbs", "正式动词"),
  summary: t(
    "Formal verbs for official writing: obtain, provide, include, ensure, constitute, exceed, comply and compliance, terminate, commence, endeavor, facilitate and undertake.",
    "用于正式文本的动词：获得、提供、包括、确保、构成、超过、遵守和合规、终止、开始、努力、促进和承担。",
  ),
  intro: t(
    "Formal letters ask you to **obtain** a permit, **ensure** that the doors are locked, and **comply** with the rules. These words help you read and write official English, where everyday verbs like *get* and *make sure* are replaced.",
    "正式信函会要求你 **obtain**（获得）许可证、**ensure**（确保）门已锁好，并 **comply**（遵守）规定。这些词帮你读写正式英语，在那里 *get*、*make sure* 这类日常动词会被替换掉。",
  ),
  prerequisites: ["b1-words-work-verbs"],
  words: [
    word(
      "obtain obtains obtained obtaining",
      "to get something, especially by effort (formal)",
      "获得；取得",
      "You must {obtain} a visa by applying at the embassy before you travel. | She {obtained} a degree in law after four years of study.|contained retained | Tickets can be {obtained} from the box office.|contained retained",
      "contain retain",
    ),
    word(
      "provide provides provided providing",
      "to give something that people need or want",
      "提供",
      "The hotel {provides} free breakfast for every guest.|divides denies | The company will {provide} training for new staff so they can learn the job. | Water was {provided} for the runners so nobody would get thirsty.|divided denied",
      "divide deny",
    ),
    word(
      "include includes included including",
      "to have something as one part of a whole; to make someone or something part of a group",
      "包括；包含",
      "The price {includes} breakfast and dinner, so you pay nothing extra for meals.|concludes excludes | The team {included} two players from Brazil among its eleven.|concluded excluded | Ten people were hurt, {including} two children, so eight adults were hurt.|concluding excluding",
      "conclude exclude",
    ),
    word(
      "ensure ensures ensured ensuring",
      "to make certain that something happens (formal)",
      "确保",
      "Please {ensure} that all doors are locked before you leave, so no one can get in. | The new rules {ensure} that everyone is treated fairly, so no one is left out.|doubts denies | Teachers are responsible for {ensuring} students' safety.|doubting denying",
      "doubt deny",
    ),
    word(
      "constitute constitutes constituted constituting",
      "to form or be something (formal)",
      "构成",
      "Women {constitute} half of the workforce, so there are as many women as men. | Does this {constitute} a breach of contract? | Students {constituted} the majority of the audience, filling most of the seats.|instituted substituted",
      "institute substitute",
    ),
    word(
      "exceed exceeds exceeded exceeding",
      "to be more than a number or an amount; to go beyond a limit",
      "超过；超出",
      "Do not {exceed} the speed limit; you'll be fined for driving too fast. | The cost {exceeded} our budget by 20 percent, so we had to borrow money.|reached succeeded | Sales {exceeded} all expectations this year, rising far higher than forecast.|reached succeeded",
      "reach succeed",
    ),
    word(
      "comply complies complied complying",
      "to obey a rule, a law or a request (formal)",
      "遵守；服从",
      "All products must {comply} with safety standards, or they cannot be sold. | Failure to {comply} with the rules will lead to a fine. | The company {complied} with the court order and paid the fine at once.|conflicted competed",
      "conflict compete",
      "compliance",
    ),
    word(
      "compliance",
      "the practice of obeying rules or laws (formal)",
      "遵守；合规",
      "The factory was inspected to confirm its {compliance} with environmental laws, and it passed. | {Compliance} with the new rules is required by law.|Conflict Competition | The bank's {compliance} team checks every large payment to make sure it follows the law.",
      "conflict competition",
      "comply",
    ),
    word(
      "terminate terminates terminated terminating",
      "to end something, especially a contract or an agreement (formal)",
      "终止；结束",
      "The company {terminated} his contract after one month, so he lost his job.|commenced determined | This train {terminates} here; all passengers must leave.|commences determines | Either side may {terminate} the agreement with 30 days' notice and stop working together.",
      "commence determine",
    ),
    word(
      "commence commences commenced commencing",
      "to begin (formal)",
      "开始",
      "The ceremony will {commence} at ten o'clock, so please be in your seats before then. | Work on the bridge {commenced} in May and finished two years later.|concluded commented | The trial is {commencing} next week, and the first witness will speak on Monday.|concluding commenting",
      "conclude comment",
    ),
    word(
      "endeavor endeavors endeavored endeavoring",
      "to try very hard to do something (formal)",
      "努力；尽力",
      "We will {endeavor} to reply to all letters within a week, so please be patient. | She {endeavored} to finish the work on time, working late every night.|refused pretended | The hospital {endeavors} to treat every patient within an hour, and usually succeeds.|refuses pretends",
      "refuse pretend",
      "undertake",
    ),
    word(
      "facilitate facilitates facilitated facilitating",
      "to make something easier or possible (formal)",
      "促进；使便利",
      "The new road will {facilitate} trade between the two cities by cutting the journey time in half. | Her job is to {facilitate} discussions in the group, helping everyone take part. | Technology has {facilitated} communication, making it fast and cheap.|obstructed fabricated",
      "obstruct fabricate",
      "ensure",
    ),
    word(
      "undertake undertakes undertook undertaken undertaking",
      "to agree to do something and be responsible for it; to begin a piece of work",
      "承担；着手进行",
      "The university will {undertake} a study of the problem, and the results will be ready next year. | She {undertook} the long journey alone, walking across the desert.|overtook abandoned | The work was {undertaken} by a team of experts, who finished it in a month.|overtaken abandoned",
      "overtake abandon",
      "endeavor",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Commence* means to begin and *terminate* means to end. Ask whether the sentence is about a start or a finish.",
        "*commence* 是开始，*terminate* 是结束。想想句子说的是开头，还是收尾。",
      ),
      meaning: t(
        "To *comply* is to obey a rule or an order, while to *constitute* is to form or make up a whole. Check whether the meaning is about following a rule or being part of something.",
        "*comply* 是遵守规定或命令，*constitute* 是构成一个整体。看释义说的是遵守规则，还是组成某物。",
      ),
      spell: t(
        "*Endeavor* ends in -or in American English and -our in British English, *undertake* becomes *undertook* and *undertaken*, and *facilitate* is built as facil + itate, like *facility*.",
        "*endeavor* 美式以 -or 结尾，英式以 -our 结尾，*undertake* 的过去式和过去分词是 *undertook*、*undertaken*，*facilitate* 由 facil + itate 构成，和 *facility* 同源。",
      ),
    },
    notes: `
      obtain|a visa got by applying at an embassy;a degree after four years of study;tickets from the box office|to obtain is to get something, often with effort; to retain is to keep what you already have|obtain 是获得；retain 是保留|contain/contained=contain means to have something inside, not to get a visa, a degree or tickets=contain 是包含，不是取得签证、学位或门票;retain/retained=retain means to keep what you already have, not to get something new by applying, studying or buying=retain 是保留已有的东西，不是通过申请、学习或购买得到新东西|ob · tain|ob + tain|ob + tain
      provide|free breakfast for every guest;training so new staff learn the job;water so runners don't get thirsty|to provide is to give people what they need; to deny is to refuse to give it|provide 是提供；deny 是拒绝给予|divide/divides/divided=divide means to split into parts, not to give breakfast, training or water to people=divide 是分开，不是给人提供早餐、培训或水;deny/denies/denied=deny means to refuse to give something, the opposite of free breakfast or water so nobody gets thirsty=deny 是拒绝给予，和免费早餐、让人不口渴的水正相反|pro · vide|pro + vide|pro + vide
      include|meals with nothing extra to pay;two players among a team's eleven;children counted among ten people hurt|to include is to have something as part of a whole; to exclude is to leave it out|include 是包括；exclude 是排除|conclude/concludes/concluded/concluding=conclude means to end or decide, not to have meals, players or children as part of a whole=conclude 是结束或得出结论，不是把餐食、球员或孩子包括在内;exclude/excludes/excluded/excluding=exclude means to leave something out, but the meals cost nothing extra, the players were among the eleven, and the children were counted among the ten=exclude 是排除在外，但餐费不另收、球员在十一人之中、孩子也算在十人里|in · clude|in + clude|in + clude
      ensure|doors locked so no one gets in;fair treatment so no one is left out;teachers keeping students safe|to ensure is to make certain something happens; to doubt is to think it may not be true|ensure 是确保；doubt 是怀疑|doubt/doubts/doubting=doubt means to think something may not be true, not to make certain that doors are locked or people are treated fairly=doubt 是怀疑，不是确保门锁好或人人受到公平对待;deny/denies/denying=deny means to say something is not true, the opposite of making sure it happens=deny 是否认，和确保某事发生正相反|en · sure|en + sure|en + sure
      constitute|women as half the workforce;whether an act counts as a breach of contract;students as most of the audience|to constitute is to form or be part of a whole; to substitute is to put one thing in place of another|constitute 是构成；substitute 是替代|institute/instituted=institute means to start a rule or a system, not to make up half of a workforce or most of an audience=institute 是设立制度，不是构成一半劳动力或大部分观众;substitute/substituted=substitute means to put one thing in place of another, not to be the people who fill most of the seats=substitute 是替换，不是坐满大部分座位的那些人|con · sti · tute|con + stitute|con + stitute
      exceed|being fined for driving too fast;a cost 20 percent over a budget;sales rising far higher than forecast|to exceed is to be more than a limit or an amount; to reach is to get exactly to it|exceed 是超过；reach 是达到|reach/reached=reach means to get exactly to a limit, not to go over it by 20 percent or rise far higher=reach 是达到，不是超出 20% 或远远高于预期;succeed/succeeded=succeed means to do well or come after someone, not to be more than a limit or an amount=succeed 是成功或继任，不是超过某个限额或数量|ex · ceed|ex + ceed, ending in -ceed|ex + ceed，以 -ceed 结尾
      comply|products that cannot be sold otherwise;failure that leads to a fine;a court order followed by paying at once|to comply is to obey a rule or an order; to conflict is to be against it|comply 是遵守；conflict 是冲突|conflict/conflicted=conflict with means to go against a rule, the opposite of what must happen for products to be sold or what avoids a fine=conflict with 是与之相抵触，和产品能出售、避免罚款所需要的正相反;compete/competed=compete with means to try to beat someone, not to obey safety standards or a court order=compete with 是与之竞争，不是遵守安全标准或法院命令|com · ply|com + ply, becoming *complies*|com + ply，三单是 *complies*
      compliance|an inspected factory that passed;following new rules required by law;a bank team checking payments follow the law|compliance is obeying rules or laws; conflict is going against them|compliance 是合规；conflict 是冲突|conflict/Conflict=conflict with the law means breaking it, the opposite of a factory that passed an inspection or a team making sure payments follow the law=与法律冲突就是违法，和通过检查、确保付款合法正相反;competition/Competition=competition is trying to beat others, not obeying environmental laws or new rules=competition 是竞争，不是遵守环保法规或新规定|com · pli · ance|comply with y changed to i, then -ance|comply 把 y 变成 i，再加 -ance
      terminate|a contract ended so he lost his job;a train where all passengers must leave;an agreement ended with 30 days' notice|to terminate is to end something; to commence is to begin it|terminate 是终止；commence 是开始|commence/commenced/commences=commence means to begin, the opposite of a contract that made him lose his job or a train where everyone must get off=commence 是开始，和让他失业的合同、所有乘客必须下车的终点站正相反;determine/determined/determines=determine means to decide or find out, not to end a contract or a train journey=determine 是决定或查明，不是终止合同或列车行程|ter · mi · nate|termin + ate|termin + ate
      commence|being in your seats before ten;work in May that finished two years later;a trial whose first witness speaks on Monday|to commence is to begin; to conclude is to end|commence 是开始；conclude 是结束|conclude/concluded/concluding=conclude means to end, but you sit down before a ceremony starts, the work finished later, and a first witness comes at the start=conclude 是结束，但入座是在仪式开始前，工程是后来才完成的，第一位证人出现在开头;comment/commented/commenting=comment means to give an opinion, not for a ceremony, work or a trial to begin=comment 是发表评论，不是仪式、工程或审判开始|com · mence|com + mence, with a double m|com + mence，双写 m
      endeavor|replying within a week, so be patient;working late every night to finish on time;treating patients within an hour and usually succeeding|to endeavor is to try very hard; to refuse is to say you will not|endeavor 是努力；refuse 是拒绝|refuse/refused/refuses=refuse means to say you will not do something, the opposite of working late or usually succeeding=refuse 是拒绝，和熬夜工作、通常都能做到正相反;pretend/pretended/pretends=pretend means to act as if, not to try hard and really succeed=pretend 是假装，不是认真努力并真正做到|en · deav · or|en + deavor, -our in British English|en + deavor，英式拼作 -our
      facilitate|a road cutting journey time in half;helping everyone take part in a discussion;fast, cheap communication|to facilitate is to make something easier; to obstruct is to block it|facilitate 是促进、使便利；obstruct 是阻碍|obstruct/obstructed=obstruct means to block, the opposite of cutting journey time, helping everyone take part or making things fast and cheap=obstruct 是阻碍，和缩短行程、帮助大家参与、让沟通又快又便宜正相反;fabricate/fabricated=fabricate means to invent something false or to build it, not to make trade or communication easier=fabricate 是捏造或制造，不是让贸易或沟通更容易|fa · cil · i · tate|facil + itate, like *facility*|facil + itate，和 *facility* 同源
      undertake|a study with results ready next year;a long journey walked across a desert;work a team of experts finished in a month|to undertake is to take on and do a piece of work; to abandon is to give it up|undertake 是承担、着手；abandon 是放弃|overtake/overtook/overtaken=overtake means to pass a moving car or person, not to carry out a study, a journey or a piece of work=overtake 是超车、超过，不是开展研究、旅程或工作;abandon/abandoned=abandon means to give up, the opposite of results being ready, walking across a desert or finishing the work=abandon 是放弃，和得出结果、走过沙漠、完成工作正相反|un · der · take|under + take, becoming *undertook*|under + take，过去式是 *undertook*
    `,
  },
});

const certainty = vocabularyTopic({
  id: "b2-words-certainty",
  title: t("Certainty and Doubt", "确定与怀疑"),
  summary: t(
    "Undeniable and indisputable facts; questionable, doubtful and debatable claims; allegedly, supposedly, reportedly and seemingly; obviously, certainly and surely.",
    "无可否认的和无可争辩的事实；可疑的、不确定的和有争议的说法；据称、据说、据报道和表面上；显然、当然和必定。",
  ),
  intro: t(
    "Some facts are **undeniable**, some claims are **questionable**, and news often says a man **allegedly** did something. These words help you show how sure you are that something is true.",
    "有些事实 **undeniable**（无可否认），有些说法 **questionable**（值得怀疑），新闻也常说某人 **allegedly**（据称）做了某事。这些词帮你表达你对某事是否属实有多确定。",
  ),
  prerequisites: ["b1-words-truth"],
  words: [
    word(
      "undeniable",
      "certainly true; impossible to deny",
      "无可否认的",
      "Her talent is {undeniable}: she has won every competition. | The evidence was {undeniable}, so he confessed. | It is {undeniable} that the climate is warming; the data are clear.",
      "questionable doubtful",
      "indisputable",
    ),
    word(
      "indisputable",
      "so obviously true that no one can argue about it",
      "无可争辩的",
      "The video provided {indisputable} proof that he was there. | It is {indisputable} that smoking causes cancer; every study shows it. | The champion's skill is {indisputable}: she has never lost a match.",
      "questionable debatable",
      "undeniable",
    ),
    word(
      "questionable",
      "not certainly true or honest; possibly wrong",
      "可疑的；有问题的",
      "The study's results are {questionable} because only ten people took part. | He made some {questionable} decisions as a manager, and the company lost money. | The plan's success is {questionable}: nobody knows whether it will work.",
      "undeniable indisputable",
      "debatable doubtful",
    ),
    word(
      "doubtful",
      "not sure; probably not true or not likely",
      "怀疑的；不大可能的",
      "It's {doubtful} that he'll come; he's very ill. | I'm {doubtful} about the plan because it has failed before, but I'll try it.|confident certain | The match is {doubtful} because of the rain, and it may be cancelled.",
      "undeniable indisputable",
      "questionable",
    ),
    word(
      "debatable",
      "not certain, because people have different opinions about it",
      "有争议的；值得商榷的",
      "Whether money makes people happy is {debatable}; people have argued about it for centuries. | The claim that the law has reduced crime is {debatable}, since the numbers can be read in two ways. | That point is {debatable}; many experts disagree.",
      "undeniable indisputable",
      "questionable",
    ),
    word(
      "allegedly",
      "according to what people say, without proof",
      "据称；据说",
      "The man {allegedly} stole a car, but he says he is innocent. | She was {allegedly} seen at the scene of the crime, according to one witness. | The company {allegedly} paid bribes to officials, although no proof has been found.",
      "obviously certainly",
      "supposedly reportedly",
    ),
    word(
      "supposedly",
      "according to what people believe, although you may not believe it",
      "据说；按理说",
      "The film is {supposedly} based on a true story, but I doubt it. | This cream {supposedly} makes you look younger, but I don't see any difference. | The bridge was {supposedly} safe, but it fell down.",
      "obviously certainly",
      "allegedly",
    ),
    word(
      "reportedly",
      "according to what has been said or reported in the news",
      "据报道",
      "The singer is {reportedly} planning to retire, according to a magazine. | The president {reportedly} met the rebel leaders in secret. | Three people were {reportedly} injured, though the police have not confirmed it.",
      "obviously certainly",
      "allegedly",
    ),
    word(
      "seemingly",
      "appearing to be true, although it may not be",
      "表面上；看似",
      "The {seemingly} simple puzzle took me an hour. | She was {seemingly} calm, but inside she was terrified. | The problem is {seemingly} impossible, but there is a simple trick.",
      "certainly obviously",
    ),
    word(
      "obviously",
      "in a way that is easy to see or understand",
      "显然；明显地",
      "He was {obviously} tired: he kept yawning. | {Obviously}, you can't drive after drinking; everyone knows that. | She was {obviously} upset, because she was crying.",
      "allegedly supposedly",
      "certainly",
    ),
    word(
      "certainly",
      "without any doubt; used to agree politely",
      "当然；肯定",
      "I {certainly} didn't take your phone; I've been in the garden all day! | Don't worry about the meeting; I'll {certainly} be there. | This is {certainly} the best pizza I've ever eaten.",
      "allegedly reportedly",
      "surely",
    ),
    word(
      "surely",
      "used to show that you think something must be true and are surprised if it isn't",
      "想必；肯定",
      "{Surely} you don't believe that story! It's clearly made up.|Allegedly Reportedly | You've {surely} heard of Shakespeare; everyone has. | {Surely} it's too late to call him now; it's midnight.|Allegedly Reportedly",
      "allegedly reportedly",
      "certainly",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Undeniable* means nobody can say it is not true, while *questionable* means it may well be wrong. Ask whether the sentence gives proof or a reason for doubt.",
        "*undeniable* 是没人能否认，*questionable* 是很可能有问题。看句子给出的是证据，还是怀疑的理由。",
      ),
      meaning: t(
        "*Allegedly* means people say something without proof, while *obviously* means anyone can see it is true. Check whether the meaning is about a claim or something plain to see.",
        "*allegedly* 是有人这样说但没有证据，*obviously* 是谁都看得出来。看释义说的是一种说法，还是显而易见的事。",
      ),
      spell: t(
        "*Debatable* drops the e of *debate*, *undeniable* changes the y of *deny* to i, and *allegedly* keeps the e of *alleged* before -ly.",
        "*debatable* 去掉了 *debate* 的 e，*undeniable* 把 *deny* 的 y 变成 i，*allegedly* 保留 *alleged* 的 e 再加 -ly。",
      ),
    },
    notes: `
      undeniable|winning every competition;evidence that made him confess;clear data on warming|undeniable means certainly true; questionable means possibly wrong|undeniable 是无可否认的；questionable 是可疑的|questionable=questionable means possibly wrong, but winning every competition, a confession and clear data leave no doubt=questionable 是可能有问题，但每场都赢、对方认罪、数据清楚都不容置疑;doubtful=doubtful means probably not true, the opposite of proof that made him confess or data that are clear=doubtful 是不太可能属实，和让他认罪的证据、清楚的数据正相反|un · de · ni · a · ble|un + deny with y changed to i + able|un + deny 把 y 变 i + able
      indisputable|a video as proof he was there;what every study shows about smoking;a champion who has never lost|indisputable means no one can argue against it; debatable means people disagree|indisputable 是无可争辩的；debatable 是有争议的|questionable=questionable means possibly wrong, not a video as proof or what every study shows=questionable 是可能有问题，不是录像证据或所有研究都证明的事;debatable=debatable means people disagree about it, but every study agrees and the champion has never lost=debatable 是有争议，但所有研究一致，冠军也从未输过|in · dis · put · a · ble|in + dispute with the e dropped + able|in + dispute 去掉 e + able
      questionable|a study with only ten people;decisions that lost the company money;a plan nobody knows will work|questionable means possibly wrong or dishonest; undeniable means certainly true|questionable 是可疑的；undeniable 是无可否认的|undeniable=undeniable means certainly true, but ten people is too few, the decisions lost money, and nobody knows whether the plan will work=undeniable 是无可否认，但十个人太少、决策导致亏损、没人知道计划能否成功;indisputable=indisputable means no one can argue, the opposite of results, decisions or a plan that are in doubt=indisputable 是无可争辩，和令人怀疑的结果、决策或计划正相反|ques · tion · a · ble|question + able|question + able
      doubtful|someone very ill who may not come;a plan that has failed before;a match that may be cancelled for rain|doubtful means not likely or not sure; certain means sure|doubtful 是不大可能的、怀疑的；certain 是确定的|undeniable=undeniable means certainly true, but he is very ill and the match may be cancelled=undeniable 是无可否认，但他病得很重，比赛也可能取消;indisputable=indisputable means no one can argue, not something that is unlikely to happen=indisputable 是无可争辩，不是不太可能发生的事;confident=confident means sure it will go well, the opposite of feeling unsure because a plan failed before=confident 是有信心，和因计划失败过而心存疑虑正相反;certain=certain means sure, but the plan has failed before, which is a reason to doubt it=certain 是确定，但计划失败过，正是怀疑的理由|doubt · ful|doubt + ful, with a silent b|doubt + ful，b 不发音
      debatable|centuries of argument about money and happiness;numbers that can be read in two ways;a point many experts disagree on|debatable means people have different opinions about it; undeniable means nobody can disagree|debatable 是有争议的；undeniable 是无可否认的|undeniable=undeniable means nobody can disagree, but people have argued for centuries and many experts disagree=undeniable 是无人能否认，但人们争论了几个世纪，许多专家也不同意;indisputable=indisputable means no one can argue, the opposite of numbers that can be read in two ways=indisputable 是无可争辩，和能有两种解读的数字正相反|de · bat · a · ble|debate with the e dropped + able|debate 去掉 e + able
      allegedly|a man who says he is innocent;a claim from only one witness;bribes with no proof found|allegedly means people say it without proof; obviously means it is easy to see|allegedly 是据称；obviously 是显然|obviously=obviously means anyone can see it, but he says he is innocent, only one witness said it, and no proof has been found=obviously 是谁都看得出，但他说自己清白、只有一位证人、也没找到证据;certainly/surely=certainly means without any doubt, the opposite of a claim with no proof that he denies=certainly 是毫无疑问，和他否认、又没有证据的说法正相反|al · leg · ed · ly|alleged + ly|alleged + ly
      supposedly|a true story I doubt;cream that makes no difference I can see;a safe bridge that fell down|supposedly means people say or believe it, though it may not be true; certainly means without doubt|supposedly 是据说、按理说；certainly 是肯定|obviously=obviously means easy to see, but I doubt the story, I see no difference, and the bridge fell down=obviously 是显而易见，但我怀疑这个故事、看不出区别、桥也塌了;certainly=certainly means without doubt, the opposite of a claim the facts then show to be false=certainly 是毫无疑问，和被事实推翻的说法正相反|sup · pos · ed · ly|supposed + ly|supposed + ly
      reportedly|retirement news from a magazine;a secret meeting with rebel leaders;injuries the police have not confirmed|reportedly means according to reports; obviously means plain to see|reportedly 是据报道；obviously 是显然|obviously=obviously means anyone can see it, but this comes from a magazine, a secret meeting, or reports the police have not confirmed=obviously 是谁都看得出，但消息来自杂志、秘密会面或警方未证实的报道;certainly=certainly means without doubt, the opposite of news the police have not confirmed=certainly 是毫无疑问，和警方尚未证实的消息正相反|re · port · ed · ly|reported + ly|reported + ly
      seemingly|a simple puzzle that took an hour;calm outside but terrified inside;an impossible problem with a simple trick|seemingly means it appears true but may not be; certainly means it is surely true|seemingly 是看似；certainly 是肯定|certainly=certainly means without doubt, but the puzzle took an hour, she was terrified, and there is a trick=certainly 是毫无疑问，但谜题花了一小时、她其实很害怕、问题有窍门可解;obviously=obviously means plain to see, the opposite of something that only looks one way but is really another=obviously 是显而易见，和表面一套、实际另一回事正相反|seem · ing · ly|seeming + ly|seeming + ly
      obviously|someone who kept yawning;something everyone knows about drinking and driving;someone who was crying|obviously means easy to see or understand; allegedly means only claimed|obviously 是显然；allegedly 是据称|allegedly=allegedly means someone claims it without proof, but yawning and crying are plain to see and everyone knows it=allegedly 是有人声称而无证据，但打哈欠、哭泣看得见，这件事也人人都知道;supposedly=supposedly means people say it though it may be false, not something you can see for yourself=supposedly 是据说但可能不实，不是亲眼看得到的事|ob · vi · ous · ly|obvious + ly|obvious + ly
      certainly|not taking a phone while in the garden all day;promising to be at a meeting;the best pizza ever eaten|certainly means without any doubt; allegedly means people say it without proof|certainly 是肯定；allegedly 是据称|allegedly=allegedly means others claim it without proof, not something you say firmly about yourself=allegedly 是别人无证据的说法，不是你对自己坚定的表态;reportedly=reportedly means according to reports, not your own firm promise or your own opinion of a pizza=reportedly 是据报道，不是你自己的承诺或你对披萨的看法|cer · tain · ly|certain + ly|certain + ly
      surely|a story that is clearly made up;Shakespeare, whom everyone has heard of;calling someone at midnight|surely shows you think something must be true and are surprised if not; allegedly means someone claims it|surely 是想必、肯定；allegedly 是据称|allegedly/Allegedly=allegedly reports someone else's claim, not your own surprise that someone believes a made-up story or calls at midnight=allegedly 是转述别人的说法，不是你对相信假故事或半夜打电话的惊讶;reportedly/Reportedly=reportedly means according to the news, not your own strong belief that everyone has heard of Shakespeare=reportedly 是据报道，不是你坚信人人都听说过莎士比亚|sure · ly|sure + ly, keeping the e|sure + ly，保留 e
    `,
  },
});

// Although, despite and however.

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * contrasts are two facts that contrast: the first as a clause, the second as a clause, and the first as a noun phrase
 * or an -ing form that can follow despite.
 */
const handContrasts: readonly (readonly [string, string, string])[] = [
  ["it was raining", "we went for a walk", "the rain"],
  ["he was tired", "he finished the report", "being tired"],
  ["the law was passed", "the protests continued", "the new law"],
  ["the evidence was weak", "the jury found him guilty", "the weak evidence"],
  ["she is very young", "she was elected mayor", "her age"],
  ["the tickets were expensive", "the concert sold out", "the high price of the tickets"],
  ["they had a map", "they got lost", "having a map"],
  ["the police warned drivers", "many of them ignored the speed limit", "the police warnings"],
  ["the company made a profit", "it closed two factories", "making a profit"],
  ["he had an alibi", "he was arrested", "his alibi"],
  ["the city spent millions on roads", "traffic got worse", "the millions spent on roads"],
  ["the test was difficult", "most students passed", "the difficulty of the test"],
  ["she apologized", "he was still angry", "her apology"],
  ["the team played well", "they lost the match", "playing well"],
  ["the judge was experienced", "she made a serious mistake", "her experience"],
  ["the bridge was new", "it had to be closed", "being new"],
  ["the government promised reforms", "nothing changed", "the government's promises"],
  ["I studied hard", "I failed the exam", "studying hard"],
  ["the defendant denied the charges", "he was found guilty", "his denial"],
  ["the hotel was cheap", "it was very clean", "its low price"],
  ["protests were banned", "thousands marched", "the ban on protests"],
  ["the weather was terrible", "the flight left on time", "the terrible weather"],
  ["he earns a lot", "he never has any money", "his high salary"],
  ["the medicine has side effects", "doctors recommend it", "its side effects"],
  ["the workers went on strike", "the factory stayed open", "the strike"],
  ["the film got bad reviews", "it was a huge success", "the bad reviews"],
  ["she was ill", "she came to work", "being ill"],
  ["the plan was risky", "the council approved it", "the risks"],
  ["the road was icy", "he drove fast", "the icy road"],
  ["the law protects free speech", "journalists are often arrested", "the law on free speech"],
];

/** contrastPeople are a name and its pronoun for the generated contrasts. */
const contrastPeople: readonly (readonly [string, string])[] = [
  ["Tom", "he"],
  ["Anna", "she"],
  ["my uncle", "he"],
  ["the old woman", "she"],
  ["our coach", "he"],
  ["Lucy", "she"],
];

/** contrastActs are the first fact after the subject, the contrasting fact after the pronoun, and the -ing form of the first. */
const contrastActs: readonly (readonly [string, string, string])[] = [
  ["was very tired", "kept working", "being very tired"],
  ["had a bad cold", "ran the race", "having a bad cold"],
  ["felt nervous", "gave a great speech", "feeling nervous"],
  ["knew the risks", "climbed the mountain alone", "knowing the risks"],
  ["had little money", "helped everyone in the village", "having little money"],
  ["was afraid of dogs", "looked after the neighbor's puppy", "being afraid of dogs"],
  ["lived next to the school", "was often late", "living next to the school"],
  ["trained every day", "didn't win a medal", "training every day"],
  ["had never cooked before", "made a delicious dinner", "never having cooked before"],
  ["was the youngest player", "scored three goals", "being the youngest player"],
  ["read the manual twice", "couldn't fix the printer", "reading the manual twice"],
  ["had a broken arm", "finished the exam", "having a broken arm"],
  ["was born in Spain", "didn't speak Spanish", "being born in Spain"],
  ["slept for ten hours", "still felt tired", "sleeping for ten hours"],
];

/** contrasts are the hand-written contrasts, then those from people and acts. */
const contrasts: readonly (readonly [string, string, string])[] = [
  ...handContrasts,
  ...contrastActs.flatMap(([first, second, ing]) =>
    contrastPeople.map(([name, pronoun]) => [`${name} ${first}`, `${pronoun} ${second}`, ing] as const),
  ),
];

const contrastChoice: readonly ChoiceItem[] = interleave([
  contrasts.map(([a, b]): ChoiceItem => [`___ ${a}, ${b}.`, "Although", ["Despite", "However"]]),
  contrasts.map(([, b, n]): ChoiceItem => [`___ ${n}, ${b}.`, "Despite", ["Although", "However"]]),
  contrasts.map(([a, b]): ChoiceItem => [`${capital(a)}; ___, ${b}.`, "however", ["although", "despite"]]),
]);

/** contrastRight is one of the three right ways to join a contrast, chosen by its place in the list. */
function contrastRight(i: number, [a, b, n]: readonly [string, string, string]): string {
  if (i % 3 === 0) return `Although ${a}, ${b}.`;
  if (i % 3 === 1) return `Despite ${n}, ${b}.`;
  return `${capital(a)}; however, ${b}.`;
}

const sentenceChoice: readonly ChoiceItem[] = contrasts.map(
  (c, i): ChoiceItem => [
    `${c[0]} / ${c[1]}`,
    contrastRight(i, c),
    [`Although ${c[0]}, but ${c[1]}.`, i % 2 === 0 ? `Despite ${c[0]}, ${c[1]}.` : `${capital(c[0])}, however ${c[1]}.`],
  ],
);

const linkers = ["although", "despite", "however"] as const;

const contrastTyped: readonly TypedItem[] = contrasts.map(([a, b, n], i): TypedItem => {
  const linker = linkers[i % 3] ?? "although";
  const shown = `${capital(a)}. ${capital(b)}. (${linker})`;
  if (linker === "although")
    return {
      shown,
      accepted: [`[Although|Even though|Though] ${a}, ${b}.`, `${capital(b)} [although|even though|though] ${a}.`],
      canonical: `Although ${a}, ${b}.`,
      wrong: [`Although ${a}, but ${b}.`, `Despite ${a}, ${b}.`],
    };
  if (linker === "despite")
    return {
      shown,
      accepted: [`[Despite|In spite of] ${n}, ${b}.`, `${capital(b)} [despite|in spite of] ${n}.`],
      canonical: `Despite ${n}, ${b}.`,
      wrong: [`Despite ${a}, ${b}.`, `Despite of ${n}, ${b}.`],
    };
  return {
    shown,
    accepted: [`${capital(a)}[; however|. However], ${b}.`],
    canonical: `${capital(a)}; however, ${b}.`,
    wrong: [`${capital(a)}, however ${b}.`, `However ${a}, ${b}.`],
  };
});

/** Linker is one of the three linking words of contrast. */
type Linker = "although" | "despite" | "however";

/** linkerOf finds which linking word of contrast a sentence or an option uses. */
const linkerOf = (s: string): Linker => {
  const lower = s.toLowerCase();
  if (/^(although|even though|though)\b/u.test(lower)) return "although";
  if (/^(despite|in spite of)\b/u.test(lower)) return "despite";
  return "however";
};

/** linkerRule says what follows each linking word of contrast. */
const linkerRule: Record<Linker, Text> = {
  although: t("*although* is followed by a clause with a subject and a verb", "*although* 后面接带主语和谓语的从句"),
  despite: t(
    "*despite* is followed by a noun phrase or an *-ing* form, never a clause",
    "*despite* 后面接名词短语或 *-ing* 形式，不接从句",
  ),
  however: t(
    "*however* joins two whole sentences, with a semicolon or a full stop before it and a comma after it",
    "*however* 连接两个完整的句子，前面用分号或句号，后面用逗号",
  ),
};

/** sentenceCase capitalizes the first letter of a rule, past any opening asterisk. */
const sentenceCase = (s: string) => s.replace(/^(\*?)(\p{L})/u, (_, mark: string, letter: string) => `${mark}${letter.toUpperCase()}`);

/** gapNeeds says
 what the words around a gap ask for, by the linking word that fits it. */
const gapNeeds: Record<Linker, Text> = {
  although: t("a clause with a verb follows the gap", "空格后面是带动词的从句"),
  despite: t("only a noun phrase or an *-ing* form follows the gap", "空格后面只有名词短语或 *-ing* 形式"),
  however: t("the gap stands between two whole sentences", "空格位于两个完整的句子之间"),
};

/** contrastWhy names the rule of the linking word and applies it to the sentence. */
const contrastWhy = (right: string, shown: string): Text => {
  const kind = linkerOf(right);
  const rule = linkerRule[kind];
  const needs = gapNeeds[kind];
  return t(
    `${sentenceCase(rule.en)}: ${fill(shown, right)}\n\n**Check.** Inspect what sits around the gap: ${needs.en}, which matches *${right}*.`,
    `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 检查空格前后的结构：${needs["zh-CN"]}，正好匹配 *${right}*。`,
  );
};

/** whyNotContrast explains a linking word whose structure does not match the words around the gap. */
const whyNotContrast = (wrong: string, right: string): Text => {
  const rule = linkerRule[linkerOf(wrong)];
  const needs = gapNeeds[linkerOf(right)];
  return t(`${sentenceCase(rule.en)}, whereas here ${needs.en}.`, `${rule["zh-CN"]}，而这里${needs["zh-CN"]}。`);
};

/** joinedWhy names the rule of the linking word a joined sentence uses. */
const joinedWhy = (right: string): Text => {
  const kind = linkerOf(right);
  const rule = linkerRule[kind];
  const check =
    kind === "although"
      ? t(
          "**Check.** Confirm there is a clause after *although* and no extra *but* in the main clause.",
          "**检验。** 确认 *although* 后接完整从句，且主句里没有多余的 *but*。",
        )
      : kind === "despite"
        ? t(
            "**Check.** Confirm *despite* is followed by a noun phrase or *-ing* (not a clause, and never *despite of*).",
            "**检验。** 确认 *despite* 后接名词短语或 *-ing*（不接从句，也不写 *despite of*）。",
          )
        : t(
            "**Check.** Confirm *however* sits after a semicolon or full stop and is followed by a comma.",
            "**检验。** 确认 *however* 前面是分号或句号，后面有逗号。",
          );
  return t(`${sentenceCase(rule.en)}: ${right}\n\n${check.en}`, `${rule["zh-CN"]}：${right}\n\n${check["zh-CN"]}`);
};

/** whyNotJoined explains although with but, despite with a clause, or however after a comma. */
const whyNotJoined = (wrong: string, _right: string, _shown: string, position: number): Text => {
  if (position === 0)
    return t(
      "English uses one linking word for one contrast, so *although* and *but* never go together.",
      "英语一个对比只用一个连接词，所以 *although* 和 *but* 不能同时用。",
    );
  if (linkerOf(wrong) === "despite")
    return t(
      "*despite* cannot take a clause with a verb; it needs a noun phrase or an *-ing* form.",
      "*despite* 后面不能接带动词的从句，要接名词短语或 *-ing* 形式。",
    );
  return t(
    "*however* cannot join two sentences with a comma; it needs a semicolon or a full stop before it and a comma after it.",
    "*however* 不能只用逗号连接两个句子，前面要用分号或句号，后面要用逗号。",
  );
};

const linkingWordsOfContrast: TopicDef = {
  id: "linking-words-of-contrast",
  title: t("Although, Despite and However", "although、despite 和 however"),
  summary: t(
    "Although it was legal, it was unfair. Despite the law, it continued. It was legal; however, it was unfair. Each linking word of contrast takes a different structure.",
    "Although it was legal, it was unfair. Despite the law, it continued. It was legal; however, it was unfair. 每个表示对比的连接词后面接不同的结构。",
  ),
  intro: t(
    "*Although the fine was steep*, *despite the steep fine*, and *The fine was steep; however, ...* all express contrast—yet each demands its own grammar and punctuation.",
    "*Although the fine was steep*、*despite the steep fine* 和 *The fine was steep; however, ...* 都在表达转折，但各自的语法结构和标点完全不同。",
  ),
  prerequisites: ["subordinating-conjunctions", "b2-words-linking-1"],
  encompasses: [{ topic: "subordinating-conjunctions", weight: 0.3 }],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "structure",
      t("What follows each word", "每个词后面接什么"),
      t(
        "Three words show contrast, and each is followed by a different structure:\n\n- *Although* (or *even though*, *though*) + a **clause** with a subject and a verb: *Although it was raining, we went for a walk.*\n- *Despite* (or *in spite of*) + a **noun phrase** or an **-ing form**: *Despite the rain, we went for a walk. Despite being tired, he finished the report.*\n- *However* joins two **separate sentences**. It comes after a full stop or a semicolon and is followed by a comma: *It was raining; however, we went for a walk.*\n\n> **Watch out.** Never write *despite of* (it is *despite* alone, or *in spite of*) and never put a subject + verb clause directly after *despite* (*Despite it was raining* is wrong).",
        "三个词都表示对比，但后面接的结构不同：\n\n- *Although*（或 *even though*、*though*）后面接有主语和谓语的**从句**：*Although it was raining, we went for a walk.*\n- *Despite*（或 *in spite of*）后面接**名词短语**或 **-ing 形式**：*Despite the rain, we went for a walk. Despite being tired, he finished the report.*\n- *However* 连接两个**独立的句子**，前面用句号或分号，后面用逗号：*It was raining; however, we went for a walk.*\n\n> **注意。** 绝不要写成 *despite of*（只用 *despite*，或用 *in spite of*），也不要在 *despite* 后面直接接主谓从句（*Despite it was raining* 是错的）。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), contrastChoice, contrastWhy, whyNotContrast),
    ),
    point(
      "no-but",
      t("Although without but", "although 不和 but 连用"),
      t(
        "Chinese pairs *suīrán* with *dànshì* (虽然……但是……), but English uses only **one** linking word for one contrast. Choose *although* **or** *but*, never both:\n\n- *Although it was legal, it was unfair.* ✓\n- *It was legal, but it was unfair.* ✓\n- *Although it was legal, but it was unfair.* ✗\n\n> **Watch out.** Check every contrast sentence for three classic traps: *although ... but* (double linker), *despite* + clause, and *however* joined by only a comma.",
        "中文说“虽然……但是……”，英语一个对比只用**一个**连接词：*although* 和 *but* 只能选一个，不能同时用：\n\n- *Although it was legal, it was unfair.* ✓\n- *It was legal, but it was unfair.* ✓\n- *Although it was legal, but it was unfair.* ✗\n\n这是中国学生最常见的错误之一。\n\n> **注意。** 检查转折句时盯紧三个高频陷阱：*although ... but* 连用、*despite* 后接从句，以及只用逗号连接 *however*。",
      ),
      choiceGenerator(t("Choose the correct sentence.", "选出正确的句子。"), sentenceChoice, joinedWhy, whyNotJoined),
    ),
    point(
      "write",
      t("Joining contrasts", "连接对比的句子"),
      t(
        "Join the two sentences with the word in brackets:\n\n- *although*: *Although he was tired, he finished the report.* You may also put the *although* clause second: *He finished the report although he was tired.*\n- *despite*: turn the first sentence into a noun phrase or an *-ing* form: *Despite being tired, he finished the report.*\n- *however*: keep two sentences: *He was tired; however, he finished the report.*\n\nYou may write *even though* or *though* for *although*, and *in spite of* for *despite*.\n\n> **Watch out.** With *however*, always place a semicolon (`;`) or period before it and a comma after it—a comma before *however* creates a comma splice.",
        "用括号里的词把两个句子连起来：\n\n- *although*：*Although he was tired, he finished the report.* 也可以把 *although* 从句放在后面：*He finished the report although he was tired.*\n- *despite*：把第一句改成名词短语或 *-ing* 形式：*Despite being tired, he finished the report.*\n- *however*：保留两个句子：*He was tired; however, he finished the report.*\n\n*although* 也可以写成 *even though* 或 *though*，*despite* 也可以写成 *in spite of*。\n\n> **注意。** 用 *however* 时，前面必须是分号（`;`）或句号、后面加逗号——在 *however* 前只用逗号属于逗号拼接错误。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Join the two sentences with the word in brackets.", "用括号里的词把两个句子连起来。"),
        contrastTyped,
        joinedWhy,
      ),
    ),
  ],
};

// Writing a letter to an editor.

const editorBank: readonly WritingItem[] = [
  {
    task: "Your local newspaper published an article saying that the city council plans to close the public library on Sundays to save money. Write a letter to the editor in response.",
    model:
      "Dear Editor,\n\nI am writing in response to your article of 12 May, \"Library to close on Sundays\", which reported the council's plan to save money by shutting the central library at weekends.\n\nIn my view, this would be a serious mistake. Sunday is the only day on which many working families can visit the library together. For students who share small apartments, it is also the only quiet place to study before Monday's classes. According to the library's own figures, more than 600 people use it every Sunday, more than on any weekday.\n\nThe council argues that the closure would save 40,000 dollars a year. However, this is a tiny part of the city's budget, and the cost to the community would be far greater. Libraries offer free internet, help with job applications, reading groups for young children and a warm, friendly place for elderly residents who live alone and have few other places to go.\n\nI would therefore urge the council to look for savings elsewhere. If money must be saved, the library could open later on Sundays, or volunteers could help staff it, as they do successfully in several nearby towns. Closing the doors completely should be the very last option.\n\nYours faithfully,\nDaniel Brooks",
  },
  {
    task: "A newspaper article argues that teenagers who commit minor crimes, such as shoplifting, should be sent to prison so that they learn a lesson. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nI read with concern your article "Lock them up" (3 March), which argued that teenagers who commit minor crimes such as shoplifting should be sent to prison.\n\nAlthough I understand the frustration of shopkeepers, I believe that this policy would make our streets less safe, not safer. Research in several countries shows that young people who spend time in prison are more likely to reoffend than those who are given community sentences. In prison, a fifteen-year-old who stole a phone meets older, more serious criminals, and may leave with new skills of the wrong kind.\n\nFurthermore, a prison record makes it much harder to find a job or a place at college. A teenager who cannot find honest work is far more likely to return to crime. Prison is also extremely expensive: keeping one young offender locked up costs more than a year at a good university.\n\nInstead, I would suggest that young offenders should repair the harm they have caused. They could work in the shop they stole from, meet their victims and attend programs that help them return to school. Such schemes have reduced reoffending in my own town by almost a third.\n\nPunishment matters, but it must also prevent the next crime.\n\nYours faithfully,\nGrace Okafor',
  },
  {
    task: "A newspaper article reports that the city plans to install hundreds of surveillance cameras with face recognition in the city center to reduce crime. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nI am writing about your report of 20 June, "Cameras to watch every street", on the city\'s plan to install hundreds of face recognition cameras in the center.\n\nNobody disputes that crime is a problem, but I am convinced that this plan goes too far. Face recognition does not simply record what happens; it identifies every person who walks past, whether they have done anything wrong or not. Our movements to a doctor, a place of worship or a political meeting could all be stored by the authorities.\n\nMoreover, the technology is far from perfect. Studies have found that some systems are more likely to misidentify women and people with darker skin, which could lead to innocent citizens being stopped and questioned. In one American city, a man was wrongfully arrested because of exactly such an error.\n\nThere are better ways to reduce crime. The money could pay for more police officers on foot patrol, better street lighting and youth centers, all of which have been shown to make neighborhoods safer without watching everyone.\n\nIf the council still wishes to use cameras, it should at least hold a public consultation and pass clear rules on who can see the data and for how long it is kept.\n\nYours faithfully,\nMarta Silva',
  },
  {
    task: "A newspaper article claims that homework in primary schools is a waste of time and should be banned. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nI would like to respond to your article "Ban homework now" (8 October), which claimed that homework in primary schools is a waste of time.\n\nAs a primary school teacher with fifteen years\' experience, I partly agree with the writer. Long, repetitive worksheets often cause stress at home and teach children very little. Young children also need time to play, read for pleasure and sleep.\n\nHowever, I do not believe that homework should be banned. A small amount of the right kind of homework can be extremely valuable. When a child reads aloud to a parent for fifteen minutes, both of them benefit, and the parent learns what their child is studying. Practicing times tables at home also helps children remember what they learned in class, which saves time for more interesting lessons the next day.\n\nThe real problem is not homework itself but how much is set and what it involves. I would therefore propose that each school agree on a clear limit, for example no more than twenty minutes a night for younger pupils, and that tasks should be short, practical and connected to family life.\n\nA ban would remove a useful link between home and school. Better rules would keep the benefits and remove the stress.\n\nYours faithfully,\nHelen Zhang',
  },
  {
    task: "A newspaper article reports that the government wants to raise the age at which people can get a driving license from 17 to 19 to reduce accidents. Write a letter to the editor in response.",
    model:
      "Dear Editor,\n\nI am writing in response to your article of 2 April, \"Driving age to rise to 19\", about the government's plan to stop seventeen- and eighteen-year-olds from learning to drive.\n\nI fully support the aim of making our roads safer. Young drivers are involved in a high number of serious accidents, and every one of them is a tragedy. Nevertheless, I do not think this plan is the right answer.\n\nFirst, the problem is not age alone but lack of experience. A nineteen-year-old who has just passed the test is still a new driver and will still make beginners' mistakes. Secondly, the plan would be very unfair to young people in the countryside, where there are few buses. Many of them need a car to get to college or to their first job.\n\nA better solution would be a graduated license, which has worked well in countries such as New Zealand. New drivers would be allowed to drive alone, but for their first year they could not drive late at night or carry several young passengers. These are exactly the situations in which most crashes happen.\n\nI would urge the government to consider this approach, which protects young drivers without taking away their independence.\n\nYours faithfully,\nTom Hughes",
  },
  {
    task: "A newspaper article argues that peaceful protesters who block roads should face heavy fines, because they make other people late for work and hospital appointments. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nYour article "Make road blockers pay" (15 September) argued that peaceful protesters who block roads should face heavy fines. I would like to offer a different view.\n\nI accept that road blockades cause real problems. An ambulance delayed by a protest is a serious matter, and people who lose a day\'s pay because they cannot reach work have every right to be angry.\n\nHowever, the right to protest is a basic freedom in any democracy, and it is protected by our constitution. Many of the rights we now enjoy, from votes for women to the eight-hour working day, were won by protesters who were described as a nuisance at the time. Heavy fines would not only punish people who block roads; they would also frighten ordinary citizens away from protesting at all, especially those on low incomes.\n\nInstead of fines, I would suggest that the police and protest groups agree on routes and times in advance, so that roads to hospitals always stay open. Protesters who deliberately block emergency vehicles could still be prosecuted under existing laws.\n\nSociety can protect both the right to protest and the right to get to hospital. We do not need to choose one or the other.\n\nYours faithfully,\nPriya Nair',
  },
  {
    task: "A newspaper article reports that a local factory has been fined for polluting the river, but the fine is so small that the company says it will simply pay it and continue. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nI was shocked to read your report of 9 July, "Factory fined for river pollution", which revealed that the company has been fined only 5,000 dollars and intends to pay and carry on as before.\n\nThis is a clear example of a law that does not work. A fine is supposed to deter. If it costs a company less to pay the penalty than to clean up its waste, then polluting simply becomes part of its business plan. Meanwhile, the people of this town pay the real price: fish have disappeared from the river, children can no longer swim in it, and farmers downstream worry about the water they use.\n\nI am not against the factory, which employs hundreds of local people. However, every business must follow the same rules, and the law must be strong enough to make them do so.\n\nI would therefore call on our representatives to support three changes. Fines should be linked to a company\'s profits rather than fixed at a low amount. Repeat offenders should be required to pay for the river to be cleaned. Finally, the results of water tests should be published online every month, so that residents can see whether the situation is improving.\n\nYours faithfully,\nAhmed Hassan',
  },
  {
    task: "A newspaper article suggests that the city should ban cars from the old town center completely and turn the streets into pedestrian areas. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nI am writing about your article of 25 November, "A car-free old town?", which suggested banning cars from the historic center.\n\nAs someone who lives in the old town, I strongly support the idea. At present, our narrow streets are full of traffic and fumes, and the sidewalks are so narrow that parents with strollers must walk in the road. The beautiful buildings that attract tourists are being damaged by vibration and pollution.\n\nExperience from other cities is encouraging. When Pontevedra in Spain removed cars from its center, the number of residents grew, local shops did more business and road deaths fell to almost zero. People who walk or cycle spend more time in shops than drivers who park and leave.\n\nI understand the concerns of shopkeepers and of elderly or disabled residents. That is why I would propose a careful plan rather than an overnight ban. Deliveries could be allowed early in the morning, residents with disabilities could keep permits, and a free electric shuttle bus could connect the center to parking lots on the edge of town.\n\nIf it is introduced gradually and with care, a car-free center would make the old town a better place to live, to work and to visit.\n\nYours faithfully,\nSofia Rossi',
  },
  {
    task: "A newspaper article reports that the police now use an algorithm to predict which neighborhoods are most likely to have crime, and send more officers there. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nYour report "Computer tells police where to go" (4 February) described the new algorithm that predicts where crimes are likely to happen. I believe the public should be more concerned about this system than your article suggested.\n\nThe algorithm learns from past arrest records. However, those records show where the police have looked for crime, not only where crime happens. If officers have always patrolled poorer neighborhoods more often, they will have made more arrests there, and the computer will send even more officers to the same streets. This creates a circle that could be discriminatory, even if nobody intends it.\n\nFurthermore, residents of these areas have not been told how the system works, and they have no way to question its decisions. In a democracy, people should be able to understand the rules that affect their lives.\n\nI am not suggesting that the police should ignore technology. Nevertheless, before the algorithm is used any further, I would ask for three things: an independent review of whether it treats all communities fairly, public information about the data it uses, and regular reports to the city council.\n\nTechnology can help the police, but only if it is transparent and accountable.\n\nYours faithfully,\nJames Carter',
  },
  {
    task: "A newspaper article argues that the school leaving age should be raised to 18, so that every young person stays in education or training until then. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nI would like to comment on your article of 30 January, "Keep them in school until 18", which argued that every young person should stay in education or training until that age.\n\nI agree with the main idea of the article. Young people who leave school at sixteen with no qualifications often find only poorly paid, insecure work, and many become unemployed in their twenties. Two more years of learning could give them the skills that modern jobs require.\n\nHowever, I am worried that the plan treats all young people as if they were the same. Some sixteen-year-olds are bored and unhappy in the classroom, and forcing them to sit at a desk for two more years could make them hate learning for the rest of their lives. For these students, the right kind of training matters more than the number of years.\n\nI would therefore propose that the new rule should include a wide range of options. Apprenticeships, part-time college courses combined with work, and practical training in trades such as building or cooking should all count as education. Each student should also have an adviser to help them choose.\n\nIf the choices are broad enough, raising the age could change many lives for the better.\n\nYours faithfully,\nLaura Kim',
  },
  {
    task: "A newspaper article reports that many refugees in your city wait more than two years for a decision on their asylum applications, and are not allowed to work while they wait. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nI am writing in response to your moving report of 18 August, "Waiting in limbo", about refugees in our city who wait more than two years for a decision on their asylum applications.\n\nThe situation your reporter described is both unfair and wasteful. People who have escaped persecution and war are left without income, without purpose and without knowing whether they will be allowed to stay. Many are doctors, engineers or teachers whose skills our city badly needs, yet the law prevents them from working. As a result, they depend completely on state support, which costs taxpayers more than if they were allowed to earn a living.\n\nI recognize that every application must be checked carefully, and that the officials who do this work are under great pressure. However, a delay of two years serves nobody.\n\nI would urge the government to take two simple steps. First, it should employ more staff to deal with applications, so that most decisions are made within six months. Secondly, asylum seekers should be allowed to work if they have waited more than six months, as is already the case in several other European countries.\n\nThese changes would help refugees rebuild their lives and allow them to contribute to the community that has welcomed them.\n\nYours faithfully,\nElena Petrova',
  },
  {
    task: "A newspaper article claims that online shopping is destroying the shopping streets of town centers, and suggests a special tax on online sales to protect small shops. Write a letter to the editor in response.",
    model:
      'Dear Editor,\n\nI read your article "Save our town center" (11 March) with great interest. The writer argued that online shopping is destroying local shops and proposed a special tax on online sales.\n\nI share the writer\'s sadness at the empty shops in our town center. Local businesses do far more than sell goods: they give our town its character, provide jobs for young people and offer elderly residents a place to meet and talk. When a shop closes, something valuable is lost.\n\nNevertheless, I doubt that a tax on online sales is the answer. Such a tax would raise prices for everyone, including people who cannot easily reach the shops, such as the disabled and residents of remote villages. It would also hurt the many small local businesses that now sell part of their goods online.\n\nA better approach, in my view, would be to make the town center more attractive. The council could lower business rents for small shops, offer free parking for the first hour and organize regular markets and events. Empty shops could be rented cheaply to young people starting new businesses.\n\nCustomers will return to the town center if it offers something the internet cannot: atmosphere, personal service and a sense of community.\n\nYours faithfully,\nRobert Mensah',
  },
];

const letterToAnEditor = judgedTopic({
  id: "writing-a-letter-to-an-editor",
  title: t("Writing a Letter to an Editor", "写给编辑的信"),
  summary: t(
    "Write a letter of 200 to 250 words to a newspaper in response to an article the task summarizes: state your view, support it, and propose what should be done.",
    "针对题目概述的一篇报纸文章，给报社写一封 200 到 250 词的信：表明观点，加以支持，并提出应该怎么做。",
  ),
  intro: t(
    "When a local paper proposes shutting down a neighborhood park for parking, a persuasive letter to the editor names the article right away, states a reasoned stance with concrete evidence, and proposes a practical alternative in formal, measured English.",
    "当本地报纸提议把社区公园改建成停车场时，一封有说服力的读者来信会先点明回应的文章，再用具体论据亮明立场，最后以正式克制的语气提出可行替代方案。",
  ),
  prerequisites: ["writing-a-letter-of-complaint", "writing-an-evidence-paragraph"],
  encompasses: [
    { topic: "writing-a-letter-of-complaint", weight: 0.3 },
    { topic: "writing-an-evidence-paragraph", weight: 0.3 },
  ],
  criteria: ["b2-editor-response", "b2-editor-view", "b2-editor-support", "b2-editor-action", "b2-neutral-register"],
  point: {
    id: "letter-to-an-editor",
    title: t("Respond, argue, propose", "回应、论证、建议"),
    explanation: t(
      "A letter to an editor answers an article for the newspaper's readers. Plan four or five paragraphs:\n\n1. **The article**: name it and say what it claimed: *I am writing in response to your article of 12 May, \"Library to close on Sundays\", which reported ...*\n2. **Your view**: say clearly whether you agree, and admit what is true on the other side: *Although I understand the frustration of shopkeepers, I believe that ...*\n3. **Your support**: reasons with evidence, such as figures, examples from other places or your own experience: *According to the library's own figures, ...*\n4. **Your proposal**: what should be done, and by whom: *I would therefore urge the council to ...*\n\nOpen with *Dear Editor,* and close with *Yours faithfully,* and your name. Write formally and firmly, without contractions or insults.\n\n> **Watch out.** Remember that you are persuading public readers, not venting—open by referencing the article directly, avoid contractions or personal attacks, and close with a concrete call to action.",
      '写给编辑的信是面向报纸读者回应一篇文章。安排四到五段：\n\n1. **文章**：说出文章的标题和日期，概述它的观点：*I am writing in response to your article of 12 May, "Library to close on Sundays", which reported ...*\n2. **你的观点**：明确表示是否同意，并承认对方观点中合理的地方：*Although I understand the frustration of shopkeepers, I believe that ...*\n3. **你的论据**：理由加证据，例如数字、其他地方的例子或亲身经历：*According to the library\'s own figures, ...*\n4. **你的建议**：应该做什么、由谁来做：*I would therefore urge the council to ...*\n\n以 *Dear Editor,* 开头，以 *Yours faithfully,* 和你的名字结尾。语气正式而坚定，不用缩写，不攻击别人。\n\n> **注意。** 你是在说服广大读者而不是发泄情绪——开头要直接点明回应的文章，不用缩写或人身攻击，结尾给出具体可行的行动建议。',
    ),
  },
  question: t(
    "Write a letter of 200 to 250 words in English to the newspaper in response to the article. State your view, support it with reasons and evidence, and propose what should be done.",
    "用英语给报社写一封 200 到 250 词的信，回应这篇文章。表明你的观点，用理由和证据加以支持，并提出应该怎么做。",
  ),
  bank: editorBank,
  limits: { minWords: 180, maxChars: 2800 },
  what: t("letter to an editor", "写给编辑的信"),
});

/** topics are the topics of the unit Law, Rights and Justice. */
export const topics: readonly TopicDef[] = [
  law.topic,
  court.topic,
  crime.topic,
  punishment.topic,
  rights.topic,
  justice.topic,
  policing.topic,
  government.topic,
  protest.topic,
  formal.topic,
  certainty.topic,
  linkingWordsOfContrast,
  letterToAnEditor,
];

/** vocabulary are the word batches of the unit Law, Rights and Justice. */
export const vocabulary: readonly WordBatch[] = [
  law.batch,
  court.batch,
  crime.batch,
  punishment.batch,
  rights.batch,
  justice.batch,
  policing.batch,
  government.batch,
  protest.batch,
  formal.batch,
  certainty.batch,
];
