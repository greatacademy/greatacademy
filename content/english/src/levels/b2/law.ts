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
  prerequisites: ["b1-words-crime"],
  words: [
    word(
      "legal",
      "allowed by the law; connected with the law",
      "合法的；法律的",
      "Is it {legal} to ride a bike on the sidewalk here, or will I get a fine?|innocent guilty | She asked a lawyer for {legal} advice.|prohibited guilty | In some US states, teenagers can get a license because it is {legal} to drive at sixteen.|prohibited unlawful",
      "regal legible",
      "lawful",
    ),
    word(
      "illegal",
      "not allowed by the law",
      "非法的；违法的",
      "It is {illegal} to drive without a license.|legal lawful | The police found {illegal} drugs in the car and arrested the driver.|legal lawful | Selling cigarettes to children is {illegal} in most countries.|legal lawful",
      "ill-legible eligible",
      "unlawful",
    ),
    word(
      "lawful",
      "allowed by the law, especially in formal or legal language",
      "合法的",
      "The judge ruled that the arrest was {lawful}, so the evidence could be used.|unlawful illegal | He is the {lawful} owner of the land.|unlawful illegal | Protest is {lawful} in a democracy, as long as it is peaceful.|unlawful illegal",
      "lawyer awful",
      "legal",
    ),
    word(
      "unlawful",
      "not allowed by the law, especially in formal or legal language",
      "违法的；非法的",
      "The court decided that his dismissal was {unlawful}, and he got his job back.|lawful legal | {Unlawful} entry into a building is a crime.|Lawful Legal | The police were accused of {unlawful} arrest.|lawful legal",
      "awful unruly",
      "illegal",
    ),
    word(
      "statute statutes",
      "a law that has been formally written down and passed by a parliament",
      "成文法；法规",
      "The {statute} was passed by parliament in 1998.|verdict jury | Old {statutes} that nobody uses are being removed.|verdicts juries | The punishment is set out in the {statute}.|prohibition permit",
      "statue stature",
      "clause",
    ),
    word(
      "constitution constitutions",
      "the set of basic laws and principles of a country",
      "宪法",
      "The {constitution} protects freedom of speech.|verdict permit | Some countries do not have a written {constitution}.|verdict jury | The new {constitution} was approved by voters.|verdict jury",
      "institution constipation",
      "statute",
    ),
    word(
      "constitutional",
      "connected with or allowed by a country's constitution",
      "宪法的；符合宪法的",
      "The court must decide whether the law is {constitutional}.|prohibited guilty | Freedom of religion is a {constitutional} right.|prohibited illegal | The country is a {constitutional} monarchy, with a king and a parliament.|prohibited illegal",
      "conventional constructional",
    ),
    word(
      "clause clauses",
      "a section of a legal document or a contract",
      "条款",
      "A {clause} in the contract lets either side end it with a month's notice.|constitution statute | Read every {clause} before you sign.|constitution prohibition | The new {clauses} protect workers' rights.|verdicts juries",
      "claws cause",
      "statute",
    ),
    word(
      "legalize legalizes legalized legalizing",
      "to make something legal",
      "使合法化",
      "Same-sex marriage is now allowed in many countries that have {legalized} it.|prohibited testified | Gambling is illegal here, but some want the government to {legalize} it.|prohibit testify | The new law {legalizes} the drug for medical use, so doctors can now prescribe it.|prohibits testifies",
      "localize legitimize",
      "permit",
    ),
    word(
      "prohibit prohibits prohibited prohibiting",
      "to officially stop something from being done, especially by law",
      "禁止",
      "Smoking is {prohibited} in all restaurants; you must go outside.|legalized permitted | The rules {prohibit} the use of phones during the exam, so leave yours at the door.|legalize permit | A new law {prohibits} selling knives to children to keep them safe.|legalizes permits",
      "inhibit exhibit",
      "prohibition",
    ),
    word(
      "prohibition",
      "a law or rule that stops something from being done; the period when alcohol was illegal in the US",
      "禁令；（美国）禁酒令",
      "There is a {prohibition} on fishing in the lake.|permit constitution | During {Prohibition}, alcohol was illegal in the United States.|Constitution Clause | The {prohibition} of plastic bags reduced litter.|permit clause",
      "probation exhibition",
      "prohibit",
    ),
    word(
      "permit permits permitted permitting",
      "to allow something; a document that allows you to do something",
      "允许；许可证",
      "Photography is not {permitted} in the museum, so please put your camera away.|prohibited legalized | You need a {permit} to fish here.|clause statute | Weather {permitting}, the match will start at noon.|prohibiting legalizing",
      "permeate emit",
      "legalize",
    ),
  ],
});

const court = vocabularyTopic({
  id: "b2-words-court",
  title: t("The Court", "法庭"),
  summary: t(
    "Defendants and plaintiffs; prosecutors prosecuting and attorneys defending; juries and verdicts; guilty and innocent; testifying and testimony; lawsuits.",
    "被告和原告；起诉的检察官和辩护的律师；陪审团和裁决；有罪的和无罪的；作证和证词；诉讼。",
  ),
  prerequisites: ["b2-words-law"],
  words: [
    word(
      "defendant defendants",
      "the person in a court case who is accused of a crime or is being sued",
      "被告",
      "The {defendant} said he was at home on the night of the crime.|prosecutor plaintiff | The {defendants} were found not guilty and walked free.|prosecutors attorneys | The judge asked the {defendant} to stand while she read the sentence.|jury prosecutor",
      "dependant defender",
      "plaintiff",
    ),
    word(
      "prosecutor prosecutors",
      "a lawyer who tries to prove in court that someone is guilty",
      "检察官；公诉人",
      "The {prosecutor} showed the jury a video of the robbery.|verdict testimony | {Prosecutors} say the man stole over a million dollars.|Verdicts Juries | The {prosecutor} asked for a ten-year sentence.|defendant plaintiff",
      "persecutor protector",
      "attorney",
    ),
    word(
      "prosecute prosecutes prosecuted prosecuting",
      "to officially accuse someone of a crime in a court of law",
      "起诉；检控",
      "Shoplifters will be {prosecuted}.|testified compensated | The state decided not to {prosecute} him because of his age.|testify overturn | She was {prosecuted} for fraud and sent to prison.|testified testifying",
      "persecute prosper",
    ),
    word(
      "plaintiff plaintiffs",
      "a person who takes someone else to court in a non-criminal case",
      "原告",
      "The {plaintiff} claims that the company damaged her house.|defendant prosecutor | The {plaintiffs} want compensation for their injuries.|defendants prosecutors | The judge ruled in favor of the {plaintiff} and ordered the company to pay.|defendant jury",
      "plaintive playoff",
      "defendant",
    ),
    word(
      "jury juries",
      "a group of ordinary people who decide in court whether someone is guilty",
      "陪审团",
      "The {jury} found him guilty after two days.|verdict testimony | Twelve people sit on a {jury}.|verdict lawsuit | {Juries} must ignore what they read in the newspapers.|Verdicts Testimonies",
      "jewelry injury",
    ),
    word(
      "verdict verdicts",
      "the decision of a jury or a judge about whether someone is guilty",
      "裁决；判决",
      "The jury reached its {verdict} after six hours: not guilty.|testimony lawsuit | The family cried when the {verdict} was read.|jury testimony | The {verdicts} were announced on the same day.|juries testimonies",
      "verdant edict",
      "testimony",
    ),
    word(
      "guilty",
      "having done something wrong or illegal; feeling bad about something you have done",
      "有罪的；内疚的",
      "The jury found her {guilty} of theft, and she went to prison.|innocent wrongful | I feel {guilty} about forgetting her birthday.|innocent equitable | He pleaded {guilty} and said he was sorry.|innocent wrongful",
      "guilt gutsy",
      "innocent",
    ),
    word(
      "innocent",
      "not guilty of a crime; not harmful or bad",
      "无辜的；无罪的",
      "She was {innocent}: another woman had stolen the money.|guilty corrupt | Everyone is {innocent} until proven guilty.|guilty corrupt | Many {innocent} people died in the war.|guilty corrupt",
      "innovative ignorant",
      "guilty",
    ),
    word(
      "testify testifies testified testifying",
      "to make a formal statement in court about something you saw or know",
      "作证",
      "Three witnesses {testified} that they saw him run away.|prosecuted overturned | She agreed to {testify} against her former boss.|prosecute overturn | He is {testifying} today, so the courtroom is full.|prosecuting overturning",
      "terrify certify",
      "testimony",
    ),
    word(
      "testimony testimonies",
      "a formal statement that a witness makes in court",
      "证词；证言",
      "Her {testimony} helped convict the killer.|verdict lawsuit | The jury did not believe his {testimony}.|verdict lawsuit | The {testimonies} of the two witnesses were different.|verdicts lawsuits",
      "testament matrimony",
      "verdict",
    ),
    word(
      "lawsuit lawsuits",
      "a case in a court of law between two people or organizations, not about a crime",
      "诉讼",
      "The family filed a {lawsuit} against the hospital.|verdict testimony | The company faces dozens of {lawsuits} over its faulty cars.|verdicts juries | The {lawsuit} was settled out of court for a large sum.|jury testimony",
      "lawyer swimsuit",
    ),
    word(
      "attorney attorneys",
      "a lawyer, especially in the US",
      "律师（美式英语）",
      "His {attorney} advised him to say nothing to the police.|defendant plaintiff | She hired the best {attorney} in town.|defendant jury | The {attorneys} for both sides made their closing speeches.|defendants juries",
      "tourney atrophy",
    ),
  ],
});

const crime = vocabularyTopic({
  id: "b2-words-crime-2",
  title: t("Crime", "犯罪"),
  summary: t(
    "Offenses and offenders; criminals; fraud; burglary and burglars; assault; kidnapping; smuggling; bribes and bribery; arson.",
    "罪行和罪犯；罪犯；诈骗；入室盗窃和窃贼；袭击；绑架；走私；贿赂和行贿；纵火。",
  ),
  prerequisites: ["b1-words-crime"],
  words: [
    word(
      "offense offenses",
      "a crime; something that upsets people",
      "罪行；冒犯",
      "Driving without insurance is a serious {offense}.|burglar bribe | It was his first {offense}, so he was not sent to prison.|burglar bribe | No {offense}, but I think you're wrong.|burglar bribery",
      "defense fence",
    ),
    word(
      "offender offenders",
      "a person who has committed a crime",
      "罪犯；违法者",
      "Young {offenders} are sent to a special center, not to an adult prison.|burglaries bribes | The program helps {offenders} find work after prison.|burglaries bribes | He is a repeat {offender} who has been arrested ten times.|bribe fraud",
      "offering defender",
      "criminal",
    ),
    word(
      "criminal",
      "a person who commits crimes; connected with crime",
      "罪犯；犯罪的",
      "The police caught the {criminal} at the airport.|arson bribery | Theft is a {criminal} offense.|fraud arson | She has no {criminal} record.|fraud arson",
      "critical criminology",
      "offender",
    ),
    word(
      "fraud",
      "the crime of cheating people to get money; a person who pretends to be what they are not",
      "诈骗；骗子",
      "He was jailed for tax {fraud}.|arson assault | Credit card {fraud} costs banks billions every year.|arson assault | The doctor turned out to be a {fraud} with no qualifications.|burglary arson",
      "feud fraught",
    ),
    word(
      "burglary burglaries",
      "the crime of entering a building to steal things",
      "入室盗窃",
      "There has been a rise in {burglaries} in the area, so lock your doors.|bribes kidnaps | The {burglary} happened while the family was on vacation.|bribery arson | He was arrested for {burglary} after his fingerprints were found on the window.|bribery fraud",
      "bakery burial",
      "burglar",
    ),
    word(
      "burglar burglars",
      "a person who enters a building to steal things",
      "窃贼；入室盗贼",
      "The {burglar} broke in through the kitchen window.|bribe fraud | {Burglars} stole the TV and the jewelry.|Bribes Frauds | A dog is a good way to keep {burglars} away.|bribes frauds",
      "burger bugler",
      "burglary",
    ),
    word(
      "assault assaults assaulted assaulting",
      "to attack someone violently; a violent attack",
      "袭击；殴打",
      "He was arrested for {assaulting} a police officer.|smuggling bribing | The {assault} left the victim with a broken arm.|bribe fraud | She was {assaulted} on her way home.|smuggled bribed",
      "insult salt",
    ),
    word(
      "kidnap kidnaps kidnapped kidnapping",
      "to take someone away by force and keep them prisoner, often to get money",
      "绑架",
      "The businessman was {kidnapped} and held for a week.|smuggled bribed | The gang {kidnaps} rich tourists and asks for money.|smuggles bribes | Police are investigating the {kidnapping} of a child.|smuggling bribery",
      "catnap kidney",
    ),
    word(
      "smuggle smuggles smuggled smuggling",
      "to take things or people secretly and illegally into or out of a country",
      "走私；偷运",
      "They tried to {smuggle} drugs through the airport in their suitcases.|kidnap assault | He was caught {smuggling} cigarettes across the border.|kidnapping assaulting | The gang {smuggles} people across the sea in small boats.|assaults bribes",
      "snuggle struggle",
    ),
    word(
      "bribe bribes",
      "money or a gift given to someone to persuade them to do something dishonest",
      "贿赂",
      "The official accepted a {bribe} to approve the building.|burglary fraud | He offered the police officer a {bribe} to avoid a fine.|burglary arson | Paying {bribes} is a crime in most countries.|burglaries arsons",
      "bride tribe",
      "bribery",
    ),
    word(
      "bribery",
      "the crime of giving or taking bribes",
      "行贿；受贿",
      "The minister was charged with {bribery} and corruption.|burglary arson | {Bribery} is common where officials are badly paid.|Burglary Arson | The company was fined for {bribery} of foreign officials.|burglary arson",
      "bravery brewery",
      "bribe",
    ),
    word(
      "arson",
      "the crime of deliberately setting fire to a building",
      "纵火（罪）",
      "The fire was not an accident: it was {arson}.|burglary bribery | He was jailed for {arson} after he set fire to his neighbor's car.|burglary bribery | Police suspect {arson} because they found gasoline near the door.|burglary bribery",
      "arsenal parson",
    ),
  ],
});

const punishment = vocabularyTopic({
  id: "b2-words-punishment",
  title: t("Punishment", "惩罚"),
  summary: t(
    "Punishing crime and the punishments it brings; penalties; imprisoning offenders and imprisonment; parole and probation; rehabilitating offenders; deterring crime and deterrents; executions; custody.",
    "惩罚犯罪及其刑罚；处罚；监禁罪犯；假释和缓刑；使罪犯改过自新；威慑犯罪和威慑手段；处决；拘留。",
  ),
  prerequisites: ["b2-words-crime-2"],
  words: [
    word(
      "punish punishes punished punishing",
      "to make someone suffer because they have done something wrong",
      "惩罚",
      "The teacher {punished} the boys for lying.|rehabilitated deterred | Should parents {punish} children by taking away their phones?|rehabilitate imprison | The law {punishes} drunk drivers severely.|deters rehabilitates",
      "polish publish",
      "punishment",
    ),
    word(
      "punishment punishments",
      "a way of making someone suffer for doing something wrong",
      "惩罚；刑罚",
      "The {punishment} for stealing was a large fine.|parole probation | {Punishments} should fit the crime.|Paroles Custodies | As a {punishment}, she had to stay in her room.|parole custody",
      "publishment pushiness",
      "penalty",
    ),
    word(
      "penalty penalties",
      "a punishment for breaking a law or a rule; a free kick at goal in football",
      "处罚；点球",
      "The {penalty} for parking here is a fine of 100 dollars.|probation custody | The death {penalty} has been abolished in many countries.|probation custody | He scored from a {penalty} in the last minute.|probation custody",
      "penalize poverty",
      "punishment",
    ),
    word(
      "imprison imprisons imprisoned imprisoning",
      "to put someone in prison",
      "监禁；关押",
      "He was {imprisoned} for ten years for robbery.|deterred rehabilitated | The government {imprisons} journalists who criticize it.|deters rehabilitates | Is {imprisoning} young offenders the best answer?|deterring rehabilitating",
      "impress poison",
      "imprisonment",
    ),
    word(
      "imprisonment",
      "the state of being in prison",
      "监禁；徒刑",
      "She was sentenced to five years' {imprisonment}.|execution deterrent | Life {imprisonment} means that the prisoner may never be released.|probation parole | {Imprisonment} costs taxpayers a lot, because every prisoner needs a guard, a bed and food.|Probation Parole",
      "impressionism improvement",
      "imprison",
    ),
    word(
      "parole",
      "letting a prisoner leave prison early if they promise to behave well",
      "假释",
      "He was released on {parole} after serving half his sentence.|custody execution | She broke the rules of her {parole} and went back to prison.|custody execution | The board will decide whether he gets {parole} next month.|custody execution",
      "payroll patrol",
      "probation",
    ),
    word(
      "probation",
      "a period when an offender is not sent to prison but must behave well and be watched; a trial period at a new job",
      "缓刑；试用期",
      "Instead of prison, the judge gave him two years' {probation}.|execution custody | She must see her {probation} officer every week.|execution custody | New staff are on {probation} for three months.|execution custody",
      "prohibition probability",
      "parole",
    ),
    word(
      "rehabilitate rehabilitates rehabilitated rehabilitating",
      "to help someone return to a normal life, for example after prison or an illness",
      "使改过自新；使康复",
      "Prisons should try to {rehabilitate} offenders, not just lock them up.|imprison punish | The program has {rehabilitated} hundreds of young people.|imprisoned executed | After the accident, she spent months {rehabilitating} her injured knee.|imprisoning executing",
      "rehearse habituate",
    ),
    word(
      "deter deters deterred deterring",
      "to make someone decide not to do something by making them afraid of what will happen",
      "威慑；阻止",
      "High fines {deter} people from dropping litter.|rehabilitate parole | Cameras have {deterred} thieves from stealing cars.|rehabilitated imprisoned | The rain didn't {deter} the fans, who stayed until the end.|rehabilitate imprison",
      "defer detour",
      "deterrent",
    ),
    word(
      "deterrent deterrents",
      "something that makes people decide not to do something",
      "威慑因素；威慑力量",
      "Does the death penalty act as a {deterrent}?|custody probation | Locks are a good {deterrent} against thieves.|custody probation | Heavy fines are an effective {deterrent}.|execution imprisonment",
      "detergent determinant",
      "deter",
    ),
    word(
      "execution executions",
      "killing someone as a legal punishment; doing a plan or an action",
      "处决；执行",
      "The {execution} of prisoners is still legal in some countries.|probation parole | Crowds used to watch public {executions}.|probations paroles | The plan was good, but the {execution} was poor.|probation parole",
      "exception expedition",
    ),
    word(
      "custody",
      "being kept in prison until a trial; the legal right to look after a child",
      "拘留；监护权",
      "The suspect is being held in police {custody}.|probation parole | After the divorce, the mother got {custody} of the children.|probation parole | Two men were taken into {custody} after the fight.|probation execution",
      "custom cushy",
    ),
  ],
});

const rights = vocabularyTopic({
  id: "b2-words-rights",
  title: t("Rights", "权利"),
  summary: t(
    "Freedoms and liberties; oppressing people and oppression; persecuting minorities and persecution; asylum; rights; civil and humanitarian rights; violating rights and violations; entitlements.",
    "自由；压迫；迫害少数群体；庇护；权利；公民权利和人道主义；侵犯权利；应得的权利。",
  ),
  prerequisites: ["b2-words-politics"],
  words: [
    word(
      "freedom freedoms",
      "the right to do or say what you want without being controlled or stopped",
      "自由",
      "Newspapers must have the {freedom} to criticize the government.|asylum oppression | We take our {freedoms} for granted until we lose them.|violations grievances | After twenty years in prison, he finally won his {freedom}.|oppression persecution",
      "freedman kingdom",
      "liberty",
    ),
    word(
      "liberty liberties",
      "the freedom to live as you choose, without too many rules; a basic right",
      "自由；权利",
      "The Statue of {Liberty} stands in New York harbor.|Asylum Oppression | New security laws threaten our civil {liberties}.|violations oppressions | Prisoners lose their {liberty} but keep their human rights.|asylum oppression",
      "library liability",
      "freedom",
    ),
    word(
      "oppress oppresses oppressed oppressing",
      "to treat a group of people cruelly and unfairly, and take away their freedom",
      "压迫；压制",
      "The dictator {oppressed} anyone who disagreed with him.|violated upheld | For centuries, the empire {oppressed} the people it ruled.|upheld compensated | Women in the country still feel {oppressed} by the old laws.|upheld compensated",
      "suppress depress",
      "persecute",
    ),
    word(
      "oppression",
      "cruel and unfair treatment of a group of people",
      "压迫",
      "The people rose up against years of {oppression}.|asylum entitlement | The film shows the {oppression} of workers in the 1900s.|asylum entitlement | They escaped from {oppression} and built new lives abroad.|entitlement liberty",
      "depression opposition",
      "persecution",
    ),
    word(
      "persecute persecutes persecuted persecuting",
      "to treat someone cruelly or unfairly, especially because of their race, religion or beliefs",
      "迫害",
      "The group was {persecuted} for its religious beliefs.|upheld compensated | The regime {persecutes} journalists who tell the truth.|upholds compensates | They fled the country because they were being {persecuted}.|upheld compensated",
      "prosecute persuade",
      "oppress",
    ),
    word(
      "persecution",
      "cruel and unfair treatment, especially because of race, religion or beliefs",
      "迫害",
      "Many refugees are escaping {persecution} in their home countries.|entitlement liberty | The {persecution} of the minority lasted for decades.|entitlement asylum | Fear of {persecution} drove thousands to leave.|entitlement asylum",
      "prosecution perspiration",
      "oppression",
    ),
    word(
      "asylum",
      "protection that a country gives to someone who has escaped danger in their own country",
      "（政治）庇护",
      "The journalist asked for {asylum} in Germany after he was threatened at home.|oppression persecution | Thousands of people apply for {asylum} every year.|oppression violation | She was granted {asylum} and allowed to stay.|oppression persecution",
      "museum asset",
    ),
    word(
      "civil",
      "connected with the people of a country and their rights, not with the army or the church",
      "公民的；民事的",
      "Martin Luther King fought for {civil} rights.|oppressed wrongful | The country was torn apart by a {civil} war.|humanitarian equitable | They had a {civil} wedding at the town hall, not in a church.|humanitarian wrongful",
      "civic evil",
    ),
    word(
      "humanitarian",
      "connected with helping people who are suffering",
      "人道主义的",
      "The UN is sending {humanitarian} aid to the flood victims.|civil oppressed | The war has caused a {humanitarian} crisis.|oppressed wrongful | She received an award for her {humanitarian} work with refugees.|civil wrongful",
      "humanity vegetarian",
    ),
    word(
      "violate violates violated violating",
      "to break a law, a rule or an agreement; to fail to respect someone's rights",
      "违反；侵犯",
      "The company {violated} safety rules, and three workers were injured.|upheld compensated | Torture {violates} human rights.|upholds compensates | Reading other people's emails is {violating} their privacy.|upholding compensating",
      "violent ventilate",
    ),
    word(
      "violation violations",
      "breaking a law, a rule or an agreement",
      "违反；侵犯",
      "The arrest was a {violation} of his rights.|entitlement asylum | The factory was fined for safety {violations}.|entitlements liberties | Human rights {violations} were reported in the region.|entitlements freedoms",
      "violin vibration",
    ),
    word(
      "entitlement entitlements",
      "a legal right to have or receive something; the feeling that you deserve special treatment",
      "应得的权利；特权感",
      "Workers have an {entitlement} to four weeks' paid vacation.|oppression violation | Pensions are an {entitlement}, not a gift.|oppression asylum | His sense of {entitlement} annoyed his colleagues.|oppression asylum",
      "settlement enlightenment",
    ),
    word(
      "rights",
      "the things that the law or a fair society says every person may have or do (a right, rights)",
      "权利",
      "Everyone should have equal {rights}.|oppress violate | The law protects the {rights} of workers.|oppress persecute | She has spent her life fighting for human {rights}.|violate oppress",
      "rites writes",
      "entitlement",
    ),
  ],
});

const justice = vocabularyTopic({
  id: "b2-words-justice",
  title: t("Justice", "公正"),
  summary: t(
    "Justice and injustice; unfair and corrupt systems; compensating victims; grievances; upholding and overturning decisions; retribution; wrongful arrests; equitable and impartial treatment.",
    "公正和不公正；不公平的和腐败的制度；赔偿受害者；不满；维持和推翻判决；报复；错误的逮捕；公平的和公正无私的对待。",
  ),
  prerequisites: ["b2-words-law"],
  words: [
    word(
      "justice",
      "fair treatment of people; the system of law courts and punishment",
      "公正；司法",
      "The victims' families are still waiting for {justice}.|retribution impartiality | The criminal {justice} system is too slow.|retribution grievance | She has a strong sense of {justice} and always defends the weak.|retribution grievance",
      "juice justify",
    ),
    word(
      "injustice",
      "a situation in which people are treated unfairly",
      "不公正；不公平",
      "He spent his life fighting {injustice}.|impartiality retribution | It is a terrible {injustice} that she went to prison for a crime she didn't commit.|impartiality compensation | The report describes the {injustice} suffered by poor families.|impartiality retribution",
      "injury instance",
    ),
    word(
      "unfair",
      "not treating people equally or in the right way",
      "不公平的",
      "It's {unfair} that women are paid less than men for the same job.|equitable impartial | The referee made an {unfair} decision, and the fans booed.|equitable impartial | The rules are {unfair} to small businesses, which cannot afford the fees.|equitable impartial",
      "unclear unfit",
    ),
    word(
      "corrupt",
      "using power dishonestly, for example by taking money",
      "腐败的；贪污的",
      "The {corrupt} official took money from builders in return for permits.|equitable impartial | The whole police force was {corrupt} and took bribes.|equitable impartial | Voters are tired of {corrupt} politicians.|equitable impartial",
      "correct erupt",
    ),
    word(
      "compensate compensates compensated compensating",
      "to pay someone money because they have suffered loss or injury",
      "赔偿；补偿",
      "The airline {compensated} passengers for the delay.|upheld overturned | Nothing can {compensate} for the loss of a child.|uphold overturn | The company is {compensating} workers who were hurt.|upholding overturning",
      "complicate contemplate",
    ),
    word(
      "grievance grievances",
      "a complaint about being treated unfairly",
      "不满；冤情",
      "Workers have a long list of {grievances} about pay.|retributions impartialities | If you have a {grievance}, speak to your manager.|retribution justice | The minister promised to listen to the farmers' {grievances}.|retributions impartialities",
      "grief grievous",
    ),
    word(
      "uphold upholds upheld upholding",
      "to support a decision or a law and make sure it continues",
      "维持；支持",
      "The higher court {upheld} the verdict, so he stayed in prison.|overturned compensated | Judges must {uphold} the law.|overturn compensate | The police are there to {uphold} order.|overturn compensate",
      "upload withhold",
      "overturn",
    ),
    word(
      "overturn overturns overturned overturning",
      "to change a legal decision to the opposite; to turn something upside down",
      "推翻；翻转",
      "The court {overturned} the verdict, and she was freed.|upheld compensated | New evidence could {overturn} his conviction.|compensate oppress | The car hit a wall and {overturned}.|upheld compensated",
      "overtake return",
      "uphold",
    ),
    word(
      "retribution",
      "severe punishment for something very bad",
      "报应；惩罚",
      "The victim's family wanted {retribution}, not forgiveness.|impartiality grievance | Many people fear {retribution} if they speak out against the gang.|impartiality grievance | Is prison about {retribution} or rehabilitation?|impartiality grievance",
      "contribution distribution",
    ),
    word(
      "wrongful",
      "not fair, legal or morally right",
      "错误的；不正当的",
      "He was paid compensation for {wrongful} arrest.|equitable impartial | She sued her employer for {wrongful} dismissal.|equitable impartial | After the {wrongful} conviction, he spent ten years in prison for nothing.|equitable impartial",
      "wrongly rightful",
      "unfair",
    ),
    word(
      "equitable",
      "fair and reasonable, treating everyone equally",
      "公平的；公正的",
      "We need a more {equitable} way to share the money.|corrupt wrongful | The new tax system is more {equitable}, because the rich pay more.|corrupt wrongful | The {equitable} solution gave each side half.|corrupt wrongful",
      "equable equatable",
    ),
    word(
      "impartiality",
      "not supporting one side more than the other",
      "公正；不偏不倚",
      "Judges must show complete {impartiality}.|retribution grievance | The BBC is known for its {impartiality} in news reports.|retribution grievance | Critics questioned the {impartiality} of the investigation.|retribution grievance",
      "impatience partiality",
      "justice",
    ),
  ],
});

const policing = vocabularyTopic({
  id: "b2-words-policing",
  title: t("Policing", "警务"),
  summary: t(
    "Patrolling the streets; investigations and detectives; suspects and suspecting; forensic evidence and fingerprints; interrogating suspects; warrants and raids; informants; alibis and motives.",
    "巡逻街道；调查和侦探；嫌疑人和怀疑；法医证据和指纹；审问嫌疑人；搜查令和突击搜查；线人；不在场证明和动机。",
  ),
  prerequisites: ["b2-words-crime-2"],
  words: [
    word(
      "patrol patrols patrolled patrolling",
      "to go around an area regularly to check that there is no trouble; a group that does this",
      "巡逻",
      "Police officers {patrol} the streets at night.|interrogate raid | Soldiers {patrolled} the border.|interrogated suspected | A {patrol} found the missing hikers in the forest.|warrant motive",
      "petrol parole",
    ),
    word(
      "investigation investigations",
      "an official attempt to find out the truth about a crime or an event",
      "调查",
      "The police have opened an {investigation} into the fire.|alibi informant | The {investigation} took two years.|alibi informant | Several {investigations} are still going on.|alibis informants",
      "invitation instigation",
      "detective",
    ),
    word(
      "detective detectives",
      "a police officer whose job is to find out who committed crimes",
      "侦探；警探",
      "A {detective} questioned the neighbors.|suspect motive | Sherlock Holmes is the most famous {detective} in fiction.|suspect informant | {Detectives} found the stolen car in a garage.|Suspects Motives",
      "detector defective",
    ),
    word(
      "suspect suspects suspected suspecting",
      "a person the police think may have committed a crime; to think that something is probably true",
      "嫌疑人；怀疑",
      "The police arrested two {suspects} near the bank.|warrants alibis | I {suspect} that he's lying, but I can't prove it.|interrogate patrol | She was {suspected} of stealing from her employer.|interrogated patrolled",
      "respect expect",
    ),
    word(
      "forensic",
      "using science to find out about a crime",
      "法医的；刑侦的",
      "{Forensic} scientists examined the blood on the knife.|Federal Municipal | The {forensic} evidence proved that he had been in the room.|municipal federal | She studies {forensic} medicine.|municipal administrative",
      "foreign fantastic",
    ),
    word(
      "fingerprint fingerprints",
      "the mark that the skin of a finger leaves on a surface",
      "指纹",
      "The thief's {fingerprints} were on the glass.|alibis motives | You can unlock the phone with your {fingerprint}.|alibi warrant | The police took his {fingerprints} after the arrest.|alibis warrants",
      "footprint blueprint",
    ),
    word(
      "interrogate interrogates interrogated interrogating",
      "to ask someone a lot of questions for a long time, often aggressively",
      "审问；讯问",
      "The police {interrogated} the suspect for six hours.|patrolled raided | They {interrogate} prisoners in a small room with no windows.|patrol raid | Soldiers were {interrogating} everyone who crossed the border.|patrolling raiding",
      "interrupt integrate",
    ),
    word(
      "warrant warrants",
      "an official document that allows the police to do something, such as search a house or arrest someone",
      "（逮捕或搜查）令状",
      "The police need a {warrant} to search your home.|motive alibi | A judge issued a {warrant} for his arrest.|motive alibi | They arrived with search {warrants}.|motives alibis",
      "warranty warren",
    ),
    word(
      "raid raids",
      "a sudden visit by the police to search for people or things",
      "突击搜查",
      "Police found drugs and weapons in a {raid} on the house.|patrol motive | Dawn {raids} were carried out across the city.|Alibis Motives | The {raid} led to twelve arrests.|alibi motive",
      "rain rapid",
    ),
    word(
      "informant informants",
      "a person who secretly gives the police information about criminals",
      "线人；告密者",
      "An {informant} told the police where the drugs were hidden.|alibi motive | The gang discovered that one of its members was a police {informant}.|alibi motive | {Informants} are paid for their information.|Alibis Motives",
      "informal inhabitant",
    ),
    word(
      "alibi alibis",
      "proof that you were somewhere else when a crime happened",
      "不在场证明",
      "He has an {alibi}: he was at work all evening.|informant investigation | Her {alibi} was checked and turned out to be false.|motive warrant | Both suspects have strong {alibis}.|motives warrants",
      "album lullaby",
    ),
    word(
      "motive motives",
      "a reason for doing something, especially a crime",
      "动机",
      "What was the {motive} for the murder? Money?|alibi warrant | Police believe the {motive} was jealousy.|alibi warrant | Her {motives} for helping were not entirely selfless.|alibis warrants",
      "motif motion",
    ),
  ],
});

const government = vocabularyTopic({
  id: "b2-words-government",
  title: t("Government", "政府"),
  summary: t(
    "Governing a country and governance; federal and municipal government; bureaucracies and bureaucratic rules; civil servants; the administration and administrative work; jurisdiction; decrees and vetoes.",
    "治理国家和治理方式；联邦政府和市政府；官僚机构和官僚的规定；公务员；行政当局和行政工作；管辖权；法令和否决。",
  ),
  prerequisites: ["b2-words-politics"],
  words: [
    word(
      "govern governs governed governing",
      "to officially control a country, a city or an organization",
      "治理；统治",
      "The party has {governed} the country for twenty years.|vetoed decreed | Who will {govern} the country after the election?|veto decree | Strict rules {govern} how the money is spent.|veto decree",
      "governor garden",
      "governance",
    ),
    word(
      "governance",
      "the way that a country or an organization is controlled",
      "治理；管理",
      "Good {governance} reduces corruption.|jurisdiction bureaucracy | The company has improved its {governance} since the scandal.|jurisdiction decree | The report criticizes the {governance} of the city's schools.|jurisdiction decree",
      "government governess",
    ),
    word(
      "federal",
      "connected with the central government of a country made of states, such as the US",
      "联邦的",
      "The {federal} government in Washington sets taxes for the whole country.|municipal bureaucratic | Germany and the US are {federal} countries.|municipal administrative | It is a {federal} crime to rob a bank in the US.|municipal bureaucratic",
      "funeral feral",
      "municipal",
    ),
    word(
      "municipal",
      "connected with the government of a town or a city",
      "市政的；市立的",
      "The {municipal} swimming pool is run by the city council.|federal bureaucratic | {Municipal} elections choose the mayor and the city council.|Federal Bureaucratic | The {municipal} library is free for residents of the town.|federal bureaucratic",
      "principal multiple",
      "federal",
    ),
    word(
      "bureaucracy bureaucracies",
      "a system of government with many rules and officials; too many rules that make things slow",
      "官僚体制；官僚作风",
      "There's so much {bureaucracy}: I had to fill in ten forms to open a café.|jurisdiction governance | The EU is often accused of {bureaucracy}.|jurisdiction veto | Large {bureaucracies} move slowly.|jurisdictions decrees",
      "democracy aristocracy",
      "bureaucratic",
    ),
    word(
      "bureaucratic",
      "having too many complicated rules and processes",
      "官僚的；繁文缛节的",
      "Getting a visa is a long, {bureaucratic} process.|federal municipal | The {bureaucratic} rules made it hard to start a business.|federal municipal | The system is too {bureaucratic}, so nothing gets done.|federal municipal",
      "democratic diplomatic",
      "bureaucracy",
    ),
    word(
      "servant servants",
      "a person who works in another person's house; a person who works for the government",
      "仆人；公务员",
      "Civil {servants} work for the government, not for a political party.|decrees vetoes | In the past, rich families had many {servants}.|decrees vetoes | A police officer is a public {servant}.|decree veto",
      "serpent sergeant",
    ),
    word(
      "administration",
      "the work of managing a business or an organization; a government in power",
      "管理；行政；政府",
      "She works in hospital {administration}.|jurisdiction veto | The new {administration} promised to cut taxes.|jurisdiction veto | {Administration} costs take a large part of the budget.|Jurisdiction Veto",
      "admiration ministration",
    ),
    word(
      "administrative",
      "connected with managing an organization or a government",
      "管理的；行政的",
      "She has a well-paid {administrative} job in a large company.|federal forensic | Teachers complain about {administrative} work, such as filling in forms.|forensic federal | The city is the {administrative} center of the region.|forensic federal",
      "administrator authoritative",
    ),
    word(
      "jurisdiction",
      "the official power to make legal decisions; the area where this power applies",
      "管辖权；管辖范围",
      "The case is outside the court's {jurisdiction}.|bureaucracy veto | Each state has {jurisdiction} over its own schools.|bureaucracy veto | The crime happened in another country's {jurisdiction}.|bureaucracy veto",
      "jurisprudence prediction",
    ),
    word(
      "decree decrees",
      "an official order from a leader or a government that has the power of law",
      "法令",
      "The president issued a {decree} closing all schools.|jurisdiction governance | The king ruled by {decree}, ignoring parliament.|jurisdiction governance | Under the new {decree}, protests are banned.|jurisdiction governance",
      "degree agree",
    ),
    word(
      "veto vetoes vetoed vetoing",
      "to officially refuse to allow a law or a plan; the right to do this",
      "否决；否决权",
      "The president {vetoed} the bill.|governed decreed | Five countries can {veto} decisions in the UN Security Council.|govern decree | Mom always {vetoes} our plans to get a dog.|governs decrees",
      "vote ditto",
    ),
  ],
});

const protest = vocabularyTopic({
  id: "b2-words-protest",
  title: t("Protest", "抗议"),
  summary: t(
    "Activism; demonstrations and demonstrators; rallies; boycotting products; civil disobedience; resistance and resisting; uprisings and riots; mobilizing people; grassroots movements.",
    "社会运动；示威和示威者；集会；抵制产品；公民不服从；抵抗；起义和暴乱；动员民众；草根运动。",
  ),
  prerequisites: ["b2-words-social-issues"],
  words: [
    word(
      "activism",
      "taking action to bring about political or social change",
      "（政治或社会）行动主义；积极行动",
      "Her {activism} began when she was fifteen and joined a climate group.|disobedience resistance | Online {activism} can reach millions of people quickly.|disobedience uprising | He was sent to prison for his {activism}.|riot rally",
      "activity atheism",
    ),
    word(
      "demonstration demonstrations",
      "a public event at which people march or gather to show that they support or oppose something",
      "示威；游行",
      "Thousands of people took part in the {demonstration} against the war.|activism grassroots | Peaceful {demonstrations} are allowed in a democracy.|riots grassroots | The {demonstration} ended in front of parliament.|activism grassroots",
      "domination determination",
      "rally",
    ),
    word(
      "demonstrator demonstrators",
      "a person who takes part in a demonstration",
      "示威者",
      '{Demonstrators} carried signs saying "Save our hospital".|Uprisings Boycotts | The police arrested twenty {demonstrators}.|uprisings riots | One {demonstrator} climbed onto the roof.|uprising riot',
      "dominator decorator",
    ),
    word(
      "rally rallies",
      "a large public meeting to support a cause or a politician",
      "集会；大会",
      "The candidate spoke at a {rally} in the city square.|riot boycott | Huge {rallies} were held to support the strike.|riots boycotts | The {rally} ended with music and speeches.|riot uprising",
      "ally alley",
      "demonstration",
    ),
    word(
      "boycott boycotts boycotted boycotting",
      "to refuse to buy, use or take part in something as a protest",
      "抵制",
      "Customers {boycotted} the company after the scandal.|mobilized resisted | Several countries {boycotted} the Olympic Games.|mobilized resisted | We should {boycott} shops that sell fur.|mobilize resist",
      "boy scout bycatch",
    ),
    word(
      "disobedience",
      "refusing to do what a person or a rule tells you to do",
      "不服从；违抗",
      "Civil {disobedience} means breaking unfair laws peacefully.|activism grassroots | The child was punished for {disobedience}.|demonstration grassroots | Gandhi used {disobedience} as a weapon against British rule.|demonstrator rally",
      "obedience disobeying",
    ),
    word(
      "resistance",
      "fighting against something or refusing to accept it",
      "抵抗；反抗",
      "There was strong {resistance} to the new tax.|disobedience activism | The {resistance} fought against the invading army for five years.|disobedience activism | The body's {resistance} to disease weakens with age.|disobedience activism",
      "assistance persistence",
      "resist",
    ),
    word(
      "resist resists resisted resisting",
      "to fight against something or refuse to accept it; to stop yourself from doing something you want to do",
      "抵抗；忍住",
      "The villagers {resisted} the soldiers for weeks.|boycotted mobilized | I couldn't {resist} another piece of cake.|boycott mobilize | He was charged with {resisting} arrest.|boycotting mobilizing",
      "insist assist",
      "resistance",
    ),
    word(
      "uprising uprisings",
      "an attempt by a group of people to defeat the people in power, often violently",
      "起义",
      "The {uprising} against the king was crushed by the army.|activism grassroots | There were {uprisings} across the region in 2011.|activisms grassroots | The {uprising} began in the poorest part of the city and soon brought down the government.|demonstrator grassroots",
      "upraising sunrise",
      "riot",
    ),
    word(
      "riot riots",
      "a violent protest by a crowd of people",
      "暴乱；骚乱",
      "The protest turned into a {riot}, and shops were burned.|rally boycott | Police in {riot} gear lined the streets.|rally boycott | The {riots} lasted for three nights and left the city center in ruins.|rallies boycotts",
      "riddle diet",
      "uprising",
    ),
    word(
      "mobilize mobilizes mobilized mobilizing",
      "to organize people for a purpose; to prepare an army for war",
      "动员",
      "The group {mobilized} thousands of volunteers in a week.|boycotted resisted | Social media helps activists {mobilize} supporters.|boycott resist | The country began {mobilizing} its army.|boycotting resisting",
      "modernize immobilize",
    ),
    word(
      "grassroots",
      "the ordinary people in an organization or a society, not the leaders",
      "草根；基层",
      "It started as a {grassroots} movement of local parents.|federal municipal | The party needs support at the {grassroots}.|uprising riot | {Grassroots} groups planted trees all over the city.|Federal Municipal",
      "grasshopper roots",
    ),
  ],
});

const formal = vocabularyTopic({
  id: "b2-words-formal-verbs",
  title: t("Formal Verbs", "正式动词"),
  summary: t(
    "Formal verbs for official writing: obtain, provide, include, ensure, constitute, exceed, comply and compliance, terminate, commence, endeavor, facilitate and undertake.",
    "用于正式文本的动词：获得、提供、包括、确保、构成、超过、遵守和合规、终止、开始、努力、促进和承担。",
  ),
  prerequisites: ["b1-words-work-verbs"],
  words: [
    word(
      "obtain obtains obtained obtaining",
      "to get something, especially by effort (formal)",
      "获得；取得",
      "You must {obtain} a visa before you travel.|exceed terminate | She {obtained} a degree in law.|exceeded terminated | Tickets can be {obtained} from the box office.|exceeded terminated",
      "contain retain",
    ),
    word(
      "provide provides provided providing",
      "to give something that people need or want",
      "提供",
      "The hotel {provides} free breakfast.|exceeds commences | The company will {provide} training for new staff.|exceed terminate | Water was {provided} for the runners.|exceeded terminated",
      "divide pride",
    ),
    word(
      "include includes included including",
      "to have something as one part of a whole; to make someone or something part of a group",
      "包括；包含",
      "The price {includes} breakfast and dinner.|exceeds terminates | The team {included} two players from Brazil.|exceeded terminated | Ten people were hurt, {including} two children.|exceeding terminating",
      "conclude exclude",
    ),
    word(
      "ensure ensures ensured ensuring",
      "to make certain that something happens (formal)",
      "确保",
      "Please {ensure} that all doors are locked.|commence exceed | The new rules {ensure} that everyone is treated fairly.|exceed commence | Teachers are responsible for {ensuring} students' safety.|exceeding commencing",
      "insure assure",
    ),
    word(
      "constitute constitutes constituted constituting",
      "to form or be something (formal)",
      "构成",
      "Women {constitute} half of the workforce.|comply endeavor | Does this {constitute} a breach of contract?|comply endeavor | Students {constituted} the majority of the audience.|complied endeavored",
      "institute substitute",
    ),
    word(
      "exceed exceeds exceeded exceeding",
      "to be more than a number or an amount; to go beyond a limit",
      "超过；超出",
      "Do not {exceed} the speed limit.|commence comply | The cost {exceeded} our budget by 20 percent.|complied commenced | Sales {exceeded} all expectations this year.|complied terminated",
      "succeed excel",
    ),
    word(
      "comply complies complied complying",
      "to obey a rule, a law or a request (formal)",
      "遵守；服从",
      "All products must {comply} with safety standards.|constitute exceed | Failure to {comply} with the rules will lead to a fine.|exceed constitute | The company {complied} with the court order.|exceeded constituted",
      "supply imply",
      "compliance",
    ),
    word(
      "compliance",
      "the practice of obeying rules or laws (formal)",
      "遵守；合规",
      "The factory was checked for {compliance} with environmental laws.|endeavor facilitation | {Compliance} with the new rules is required by law.|Endeavor Undertaking | The bank's {compliance} team checks every large payment.|endeavor undertaking",
      "complaint compliment",
      "comply",
    ),
    word(
      "terminate terminates terminated terminating",
      "to end something, especially a contract or an agreement (formal)",
      "终止；结束",
      "The company {terminated} his contract after one month.|commenced obtained | This train {terminates} here; all passengers must leave.|commences obtains | Either side may {terminate} the agreement with 30 days' notice.|commence obtain",
      "determine exterminate",
    ),
    word(
      "commence commences commenced commencing",
      "to begin (formal)",
      "开始",
      "The ceremony will {commence} at ten o'clock.|terminate obtain | Work on the bridge {commenced} in May.|terminated obtained | The trial is {commencing} next week.|terminating obtaining",
      "commerce comment",
    ),
    word(
      "endeavor endeavors endeavored endeavoring",
      "to try very hard to do something (formal)",
      "努力；尽力",
      "We will {endeavor} to reply to all letters within a week.|constitute comply | She {endeavored} to finish the work on time.|constituted complied | The hospital {endeavors} to treat every patient within an hour.|constitutes complies",
      "endanger encounter",
      "undertake",
    ),
    word(
      "facilitate facilitates facilitated facilitating",
      "to make something easier or possible (formal)",
      "促进；使便利",
      "The new road will {facilitate} trade between the two cities.|terminate constitute | Her job is to {facilitate} discussions in the group.|exceed constitute | Technology has {facilitated} communication.|terminated exceeded",
      "felicitate facility",
      "ensure",
    ),
    word(
      "undertake undertakes undertook undertaken undertaking",
      "to agree to do something and be responsible for it; to begin a piece of work",
      "承担；着手进行",
      "The university will {undertake} a study of the problem.|exceed comply | She {undertook} the long journey alone.|exceeded complied | The work was {undertaken} by a team of experts.|exceeded complied",
      "overtake undertaker",
      "endeavor",
    ),
  ],
});

const certainty = vocabularyTopic({
  id: "b2-words-certainty",
  title: t("Certainty and Doubt", "确定与怀疑"),
  summary: t(
    "Undeniable and indisputable facts; questionable, doubtful and debatable claims; allegedly, supposedly, reportedly and seemingly; obviously, certainly and surely.",
    "无可否认的和无可争辩的事实；可疑的、不确定的和有争议的说法；据称、据说、据报道和表面上；显然、当然和必定。",
  ),
  prerequisites: ["b1-words-truth"],
  words: [
    word(
      "undeniable",
      "certainly true; impossible to deny",
      "无可否认的",
      "Her talent is {undeniable}: she has won every competition.|questionable doubtful | The evidence was {undeniable}, so he confessed.|questionable doubtful | It is {undeniable} that the climate is warming; the data are clear.|questionable debatable",
      "undesirable unreliable",
      "indisputable",
    ),
    word(
      "indisputable",
      "so obviously true that no one can argue about it",
      "无可争辩的",
      "The video provided {indisputable} proof that he was there.|questionable debatable | It is {indisputable} that smoking causes cancer.|questionable debatable | The champion's skill is {indisputable}.|questionable doubtful",
      "indispensable disputed",
      "undeniable",
    ),
    word(
      "questionable",
      "not certainly true or honest; possibly wrong",
      "可疑的；有问题的",
      "The study's results are {questionable} because only ten people took part.|undeniable indisputable | He made some {questionable} decisions as a manager.|undeniable indisputable | It is {questionable} whether the plan will work.|undeniable indisputable",
      "questionnaire fashionable",
      "debatable doubtful",
    ),
    word(
      "doubtful",
      "not sure; probably not true or not likely",
      "怀疑的；不大可能的",
      "It's {doubtful} that he'll come; he's very ill.|undeniable indisputable | I'm {doubtful} about the plan, but I'll try it.|undeniable indisputable | The match is {doubtful} because of the rain.|undeniable indisputable",
      "doubtless dutiful",
      "questionable",
    ),
    word(
      "debatable",
      "not certain, because people have different opinions about it",
      "有争议的；值得商榷的",
      "Whether money makes people happy is {debatable}.|undeniable indisputable | It is {debatable} whether the law has reduced crime.|undeniable indisputable | That's a {debatable} point; many experts disagree.|undeniable indisputable",
      "debited detectable",
      "questionable",
    ),
    word(
      "allegedly",
      "according to what people say, without proof",
      "据称；据说",
      "The man {allegedly} stole a car, but he says he is innocent.|obviously certainly | She was {allegedly} seen at the scene of the crime, according to one witness.|obviously certainly | The company {allegedly} paid bribes to officials, although no proof has been found.|obviously surely",
      "allergic alleviate",
      "supposedly reportedly",
    ),
    word(
      "supposedly",
      "according to what people believe, although you may not believe it",
      "据说；按理说",
      "The film is {supposedly} based on a true story, but I doubt it.|undeniably certainly | This cream {supposedly} makes you look younger, but I don't see any difference.|obviously certainly | The bridge was {supposedly} safe, but it fell down.|obviously certainly",
      "supposed supportively",
      "allegedly",
    ),
    word(
      "reportedly",
      "according to what has been said or reported in the news",
      "据报道",
      "The singer is {reportedly} planning to retire, according to a magazine.|obviously certainly | The president {reportedly} met the rebel leaders in secret.|obviously certainly | Three people were {reportedly} injured, though the police have not confirmed it.|obviously certainly",
      "repeatedly reportable",
      "allegedly",
    ),
    word(
      "seemingly",
      "appearing to be true, although it may not be",
      "表面上；看似",
      "The {seemingly} simple puzzle took me an hour.|certainly obviously | She was {seemingly} calm, but inside she was terrified.|certainly obviously | The problem is {seemingly} impossible, but there is a simple trick.|certainly obviously",
      "seamlessly seemly",
    ),
    word(
      "obviously",
      "in a way that is easy to see or understand",
      "显然；明显地",
      "He was {obviously} tired: he kept yawning.|allegedly supposedly | {Obviously}, you can't drive if you've been drinking.|Allegedly Supposedly | She was {obviously} upset, because she was crying.|allegedly reportedly",
      "previously oblivious",
      "certainly",
    ),
    word(
      "certainly",
      "without any doubt; used to agree politely",
      "当然；肯定",
      "I {certainly} didn't take your phone; I've been in the garden all day!|allegedly reportedly | Don't worry about the meeting; I'll {certainly} be there.|allegedly supposedly | This is {certainly} the best pizza I've ever eaten.|allegedly reportedly",
      "certified curtly",
      "surely",
    ),
    word(
      "surely",
      "used to show that you think something must be true and are surprised if it isn't",
      "想必；肯定",
      "{Surely} you don't believe that story!|Allegedly Reportedly | You've {surely} heard of Shakespeare.|allegedly reportedly | {Surely} it's too late to call him now; it's midnight.|Allegedly Reportedly",
      "sorely purely",
      "certainly",
    ),
  ],
});

// Although, despite and however.

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * contrasts are two facts that contrast: the first as a clause, the second as a clause, and the first as a noun phrase
 * or an -ing form that can follow despite.
 */
const contrasts: readonly (readonly [string, string, string])[] = [
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
  const rule = linkerRule[linkerOf(right)];
  return t(`${sentenceCase(rule.en)}: ${fill(shown, right)}`, `${rule["zh-CN"]}：${fill(shown, right)}`);
};

/** whyNotContrast explains a linking word whose structure does not match the words around the gap. */
const whyNotContrast = (wrong: string, right: string): Text => {
  const rule = linkerRule[linkerOf(wrong)];
  const needs = gapNeeds[linkerOf(right)];
  return t(
    `${sentenceCase(rule.en)}, but here ${needs.en}. So the gap takes *${right}*.`,
    `${rule["zh-CN"]}，而这里${needs["zh-CN"]}，所以要用 *${right}*。`,
  );
};

/** joinedWhy names the rule of the linking word a joined sentence uses. */
const joinedWhy = (right: string): Text => {
  const rule = linkerRule[linkerOf(right)];
  return t(`${sentenceCase(rule.en)}: ${right}`, `${rule["zh-CN"]}：${right}`);
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
  prerequisites: ["subordinating-conjunctions", "b2-words-linking-1"],
  encompasses: [{ topic: "subordinating-conjunctions", weight: 0.3 }],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "structure",
      t("What follows each word", "每个词后面接什么"),
      t(
        "Three words show contrast, and each is followed by a different structure:\n\n- *Although* (or *even though*, *though*) + a **clause** with a subject and a verb: *Although it was raining, we went for a walk.*\n- *Despite* (or *in spite of*) + a **noun phrase** or an **-ing form**: *Despite the rain, we went for a walk. Despite being tired, he finished the report.*\n- *However* joins two **separate sentences**. It comes after a full stop or a semicolon and is followed by a comma: *It was raining; however, we went for a walk.*\n\n*Despite it was raining* and *despite of the rain* are both wrong.",
        "三个词都表示对比，但后面接的结构不同：\n\n- *Although*（或 *even though*、*though*）后面接有主语和谓语的**从句**：*Although it was raining, we went for a walk.*\n- *Despite*（或 *in spite of*）后面接**名词短语**或 **-ing 形式**：*Despite the rain, we went for a walk. Despite being tired, he finished the report.*\n- *However* 连接两个**独立的句子**，前面用句号或分号，后面用逗号：*It was raining; however, we went for a walk.*\n\n*Despite it was raining* 和 *despite of the rain* 都是错的。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), contrastChoice, contrastWhy, whyNotContrast),
    ),
    point(
      "no-but",
      t("Although without but", "although 不和 but 连用"),
      t(
        "Chinese pairs *suīrán* with *dànshì* (虽然……但是……), but English uses only **one** linking word for one contrast. Choose *although* **or** *but*, never both:\n\n- *Although it was legal, it was unfair.* ✓\n- *It was legal, but it was unfair.* ✓\n- *Although it was legal, but it was unfair.* ✗\n\nAlso check the structure: *despite* never takes a clause, and *however* cannot join two clauses with only a comma.",
        "中文说“虽然……但是……”，英语一个对比只用**一个**连接词：*although* 和 *but* 只能选一个，不能同时用：\n\n- *Although it was legal, it was unfair.* ✓\n- *It was legal, but it was unfair.* ✓\n- *Although it was legal, but it was unfair.* ✗\n\n还要检查结构：*despite* 后面不接从句，*however* 也不能只用逗号连接两个分句。这是中国学生最常见的错误之一。",
      ),
      choiceGenerator(t("Choose the correct sentence.", "选出正确的句子。"), sentenceChoice, joinedWhy, whyNotJoined),
    ),
    point(
      "write",
      t("Joining contrasts", "连接对比的句子"),
      t(
        "Join the two sentences with the word in brackets:\n\n- *although*: *Although he was tired, he finished the report.* You may also put the *although* clause second: *He finished the report although he was tired.*\n- *despite*: turn the first sentence into a noun phrase or an *-ing* form: *Despite being tired, he finished the report.*\n- *however*: keep two sentences: *He was tired; however, he finished the report.*\n\nYou may write *even though* or *though* for *although*, and *in spite of* for *despite*.",
        "用括号里的词把两个句子连起来：\n\n- *although*：*Although he was tired, he finished the report.* 也可以把 *although* 从句放在后面：*He finished the report although he was tired.*\n- *despite*：把第一句改成名词短语或 *-ing* 形式：*Despite being tired, he finished the report.*\n- *however*：保留两个句子：*He was tired; however, he finished the report.*\n\n*although* 也可以写成 *even though* 或 *though*，*despite* 也可以写成 *in spite of*。",
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
      "A letter to an editor answers an article for the newspaper's readers. Plan four or five paragraphs:\n\n1. **The article**: name it and say what it claimed: *I am writing in response to your article of 12 May, \"Library to close on Sundays\", which reported ...*\n2. **Your view**: say clearly whether you agree, and admit what is true on the other side: *Although I understand the frustration of shopkeepers, I believe that ...*\n3. **Your support**: reasons with evidence, such as figures, examples from other places or your own experience: *According to the library's own figures, ...*\n4. **Your proposal**: what should be done, and by whom: *I would therefore urge the council to ...*\n\nOpen with *Dear Editor,* and close with *Yours faithfully,* and your name. Write formally and firmly, without contractions or insults: you are trying to persuade other readers, not to win a fight.",
      '写给编辑的信是面向报纸读者回应一篇文章。安排四到五段：\n\n1. **文章**：说出文章的标题和日期，概述它的观点：*I am writing in response to your article of 12 May, "Library to close on Sundays", which reported ...*\n2. **你的观点**：明确表示是否同意，并承认对方观点中合理的地方：*Although I understand the frustration of shopkeepers, I believe that ...*\n3. **你的论据**：理由加证据，例如数字、其他地方的例子或亲身经历：*According to the library\'s own figures, ...*\n4. **你的建议**：应该做什么、由谁来做：*I would therefore urge the council to ...*\n\n以 *Dear Editor,* 开头，以 *Yours faithfully,* 和你的名字结尾。语气正式而坚定，不用缩写，不攻击别人：你的目的是说服其他读者，而不是吵赢一场架。',
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
