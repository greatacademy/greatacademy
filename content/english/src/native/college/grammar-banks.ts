// College writing: the item banks of the style and mechanics topics. Some are hand-written line by line; others are
// built from hand-written cores by templates that vary the source, the style, the form or the numbers, so each
// knowledge point has thirty or more items, built the same way on every run.

import type { ChoiceItem } from "@ga/subject-english";

/** pick takes an element of a list by an index that may run past its end. */
const pick = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** rows splits hand-written lines of fields separated by bars. */
const rows = (lines: string): string[][] =>
  lines
    .trim()
    .split("\n")
    .map((line) => line.trim().split("|"));

/** threeWay turns lines of a shown text, the right option and two wrong ones into items. */
const threeWay = (lines: string): ChoiceItem[] =>
  rows(lines).map(([shown, right, a, b]): ChoiceItem => [shown ?? "", right ?? "", [a ?? "", b ?? ""]]);

// Hedging and qualification.

/** hedgingBank gives the evidence for a claim and asks which claim is as strong as that evidence, no more and no less. */
export const hedgingBank: readonly ChoiceItem[] = threeWay(`
  One survey of 30 older adults found that those who walked daily reported better memory.|Daily walking may be linked to better memory in older adults.|Daily walking improves the memory of every older adult.|This survey proves that walking prevents memory loss.
  Over forty controlled trials with thousands of older adults found that those assigned to regular exercise scored higher on memory tests.|Regular exercise improves memory test scores in older adults.|Exercise might possibly have some small effect on memory, perhaps.|Exercise cures memory loss in people of every age.
  In one classroom of 25 pupils, the children who read aloud each day improved their spelling more than the others.|Reading aloud every day may help some children's spelling.|Reading aloud is the best way for any child to learn to spell.|Children who do not read aloud every day cannot learn to spell well at any age.
  National records over thirty years show that road deaths fell sharply and stayed low after wearing seat belts became the law.|Seat belt laws were followed by a large and lasting fall in road deaths.|It is just conceivable that seat belts could perhaps matter somewhat.|Seat belts make every crash survivable, so road deaths will soon disappear altogether.
  A small study of 12 volunteers found that those who drank green tea slept slightly longer.|Green tea might help some people sleep a little longer, though larger studies are needed.|Green tea cures sleeplessness.|Everyone who has trouble sleeping should drink green tea every night to sleep longer and better.
  Studies in twenty countries over fifty years, with millions of people, consistently find that smokers develop lung cancer far more often than non-smokers.|Smoking greatly raises the risk of lung cancer.|Smoking may perhaps be associated with lung cancer in some cases.|Every smoker will develop lung cancer.
  Interviews with eight shop owners on one street found that most felt the new bike lane had hurt business.|Some shop owners on that street believe the bike lane hurt their business.|Bike lanes hurt business in every city.|The interviews prove that the new bike lane caused sales to fall in every shop on the street.
  Sales records from 500 shops on streets with new bike lanes show no fall in sales over three years.|Across these 500 shops, new bike lanes did not reduce sales.|Bike lanes might maybe, in some way, not be entirely bad for sales.|Bike lanes increase sales everywhere.
  A single year of data from one city shows crime falling after more street lights were installed.|More street lighting may have helped reduce crime in that city, but one year is not enough to be sure.|Street lights end crime, so every city should light all its streets at night.|Every city that adds lights will see crime fall.
  An online poll answered by 300 readers of a gaming website found that most thought video games improved their reflexes.|Many players who answered the poll believe that games improve their reflexes.|Video games improve everyone's reflexes.|Science has shown that gaming sharpens the reflexes of everyone who plays regularly.
  Thirty controlled trials found that students who tested themselves remembered more a week later than students who only reread the material.|Testing yourself helps you remember material better than rereading it.|Self-testing could conceivably be slightly useful for a few students.|Students who reread their notes forget everything.
  A study at one school found that students with phones in class had slightly lower grades.|Phones in class may be linked to lower grades at that school.|Phones destroy students' ability to learn.|Banning phones would raise grades in every school.
  In a laboratory, the drug killed cancer cells in a dish.|The drug kills cancer cells in the laboratory, but it has not yet been shown to work in patients.|The drug is a cure for cancer.|Cancer patients should start taking the drug at once, since it destroys cancer wherever it grows.
  Large trials with thousands of patients showed that the vaccine cut cases of the disease by about 90 percent.|The vaccine greatly reduces the risk of catching the disease.|The vaccine might have some small effect, perhaps.|The vaccine makes it impossible to catch the disease.
  Researchers watched one family of crows use sticks to reach food.|At least some crows can use sticks as tools.|All birds use tools.|Crows are as intelligent as humans and can solve any problem that people can solve.
  Hundreds of observations across many years show the crows of one region shaping and using sticks to reach food.|The crows of that region regularly make and use tools.|It is possible, though uncertain, that these crows may sometimes touch sticks.|Every kind of bird can make tools.
  A survey of 50 adults found that those who owned dogs reported feeling less lonely.|Owning a dog may be associated with feeling less lonely.|Dogs cure loneliness.|Lonely people should be required to own dogs, because dogs are proven to end loneliness.
  Temperature records from thousands of stations over more than a century show the planet's average temperature rising.|The planet's average temperature has risen.|The planet may, possibly, be warming in a few places.|Every place on Earth is warmer every single year.
  In one town, reading scores in local schools rose in the year the new library opened.|The new library may have helped raise reading scores, though other causes are possible.|The library caused reading scores to rise.|Opening a new library will raise reading scores in any town, whatever else changes in its schools.
  A study followed 10,000 children for twenty years and found that those from homes with many books did better at school, even after family income was taken into account.|Growing up with books at home is linked to doing better at school, even among families with similar incomes.|Books in the home might matter a little, or perhaps not.|Buying books guarantees that a child will do well at school.
  One teacher reported that her class behaved better after she moved the desks into a circle.|Arranging the desks in a circle may have helped behavior in her class.|Circular seating ends bad behavior in schools.|Research proves that the arrangement of desks controls how pupils behave in every classroom.
  A fossil of one feathered dinosaur was found in a single bed of rock.|At least one kind of dinosaur had feathers.|All dinosaurs were covered in feathers.|Birds and dinosaurs are exactly the same animals.
  Satellites have measured the Arctic ice cover every year since 1979, and it has shrunk in most years.|The Arctic ice cover has shrunk over the past four decades.|Arctic ice might perhaps have changed a little, though no one can say.|The Arctic will have no ice at all next year.
  Twenty volunteers who meditated for a week said they felt calmer.|A week of meditation may help some people feel calmer.|Meditation cures anxiety.|Everyone who meditates becomes calm within a week, however anxious they were to begin with.
  A survey of one company's staff found that people who worked from home said they got more done.|Staff at that company who worked from home felt more productive.|Working from home makes every worker more productive.|The survey proves that offices waste time.
  Experiments repeated in hundreds of laboratories show that water boils at a lower temperature at high altitude.|Water boils at a lower temperature at high altitude.|Water may possibly boil slightly differently on mountains, perhaps.|Water does not boil at all on high mountains.
  A news story described one man who lived to 105 and ate an onion every day.|One case like this says almost nothing about whether onions affect how long people live.|Eating onions makes people live longer.|Doctors should tell every patient to eat onions.
  A study of 200 bilingual and 200 monolingual children in one city found the bilingual children slightly better at switching between tasks.|The bilingual children in this city were slightly better at switching tasks, a finding that other studies should test.|Learning two languages makes children smarter.|Every bilingual person is better at every mental task.
  Studies of more than a million people in many countries found that those who were more active lived longer on average.|Physical activity is strongly associated with a longer life.|Being active might perhaps have something to do with how long people live, maybe.|Exercise guarantees that you will live to old age.
  One experiment with mice found that a diet low in sugar slowed the growth of tumors.|A low-sugar diet slowed tumor growth in mice; whether it does so in people is unknown.|Cutting sugar stops cancer in people.|Sugar causes all cancers, so anyone who stops eating it will never get the disease.
  In one season, a football team that changed its training won more games.|The new training may have helped, but one season is too short to tell.|The new training made the team champions.|Any team that adopts this new training will win more games, whatever league it plays in.
  Census records of every household over a century show that average family size in the country fell from about five people to about three.|Average family size in the country fell from about five to about three over the century.|Family size might possibly have changed somewhat, though it is hard to say.|Families everywhere in the world now have exactly three members.
`);

// Verbs for citing sources.

const citingVerbs = ["argues", "concedes", "refutes", "observes", "suggests", "doubts", "warns", "denies"] as const;

/** citingBank describes what a source does and asks which verb reports it. */
export const citingBank: readonly ChoiceItem[] = rows(`
  Ito gives three reasons for her position and defends it against objections. Ito ___ that cities should ban cars from their centers.|argues
  Throughout the book, Mensah builds a case for one view with evidence. Mensah ___ that the empire fell because of its debts, not its enemies.|argues
  Rossi takes a side in the debate and supports it with data from ten schools. Rossi ___ that homework should be optional before the age of twelve.|argues
  The whole essay aims to persuade readers of one claim, step by step. Novak ___ that zoos do more harm than good.|argues
  Patel admits a point that weakens her own case before answering it. Patel ___ that her survey included only one city.|concedes
  Though Ortiz supports the new law, he grants that his opponents are partly right. Ortiz ___ that the law will raise prices for a time.|concedes
  Kim accepts, reluctantly, a fact her critics have pointed out. Kim ___ that the early results were never repeated.|concedes
  Before defending the plan, Haddad admits its main weakness. Haddad ___ that the plan will cost more than first expected.|concedes
  Bauer shows with new evidence that a common belief is false. Bauer ___ the claim that the Vikings never reached North America.|refutes
  Lin proves an earlier study wrong by finding the error in its numbers. Lin ___ the earlier finding that the drug lowered blood pressure.|refutes
  Using records from the time, Dubois disproves a popular story about the king. Dubois ___ the story that the king burned the city himself.|refutes
  Sato demonstrates with an experiment that a widely held idea is wrong. Sato ___ the idea that goldfish remember things for only three seconds.|refutes
  Garcia simply points out a fact, without arguing about it. Garcia ___ that the city's population doubled between 1950 and 1990.|observes
  In passing, and without taking a side, Weber mentions a detail of the records. Weber ___ that most of the letters were written in winter.|observes
  Moreau reports, as a plain matter of fact, what the survey shows. Moreau ___ that two thirds of the replies came from women.|observes
  Without drawing any conclusion, Hussain remarks on a pattern in the data. Hussain ___ that sales rise every December.|observes
  Cohen offers a possible explanation, cautiously, without claiming to be sure. Cohen ___ that the birds may be following the warmer currents.|suggests
  Nakamura tentatively proposes an idea that later studies could test. Nakamura ___ that the illness could be spread by insects.|suggests
  Rather than state it firmly, Fischer puts forward a possible reading of the poem. Fischer ___ that the poem may be about the poet's brother.|suggests
  Amoah hints at a cause but admits she cannot prove it. Amoah ___ that the drought might explain the fall in harvests.|suggests
  Silva is not convinced by a popular claim and says so. Silva ___ that the new test can predict who will succeed at college.|doubts
  Keller expresses uncertainty about whether the official figures are right. Keller ___ that the official figures count every worker.|doubts
  Unconvinced by the evidence offered, Jensen hesitates to accept the conclusion. Jensen ___ that one summer of data can show a long-term trend.|doubts
  Park is skeptical of the company's promise and explains why. Park ___ that the factory can be built in a single year.|doubts
  Ali alerts readers to a danger if nothing changes. Ali ___ that the river will flood the town within ten years.|warns
  Romero cautions that a common habit carries a risk. Romero ___ that cheap batteries can catch fire when charged overnight.|warns
  Brown alerts doctors to a harm they may be overlooking. Brown ___ that the drug can damage the liver when taken for many months.|warns
  Kowalski cautions the board about the danger of delay. Kowalski ___ that waiting another year will double the cost.|warns
  Accused of copying, the author states flatly that the charge is false. The author ___ that she copied any part of the book.|denies
  Asked about the leak, the minister says it never happened. The minister ___ that the report was ever shared with the press.|denies
  Haas firmly rejects a claim made about his own earlier work. Haas ___ that his study was paid for by the company.|denies
  The company says that an accusation against it is untrue. The company ___ that it knew about the fault before the recall.|denies
`).map(([shown, right], i): ChoiceItem => {
  const others = citingVerbs.filter((v) => v !== right);
  return [shown ?? "", right ?? "", [pick(others, i), pick(others, i + 3)]];
});

// Quoting and paraphrasing.

/** quote, paraphrase and plagiarism are the three verdicts on a writer's use of a source. */
export const quoteVerdict = "an acceptable quotation";
export const paraphraseVerdict = "an acceptable paraphrase";
export const plagiarismVerdict = "plagiarism";

/** sourceCores are a source's author, year, page, sentence, a true paraphrase of it, and a near copy with a few words swapped. */
const sourceCores: readonly (readonly [author: string, year: number, page: number, source: string, paraphrase: string, patch: string])[] = [
  [
    "Okafor",
    2019,
    12,
    "Students who explained a lesson to a classmate remembered more of it a week later than students who simply reviewed their notes.",
    "reviewing notes alone helped learners remember less, a week on, than teaching the material to a peer did.",
    "students who described a lesson to a classmate recalled more of it a week afterward than students who merely reviewed their notes.",
  ],
  [
    "Lindqvist",
    2021,
    88,
    "Cities that planted trees along their busiest streets saw summer temperatures at street level fall by as much as three degrees.",
    "street-level heat in summer dropped by up to three degrees where trees were planted along the most crowded roads.",
    "towns that planted trees along their busiest roads saw summer temperatures at street level drop by as much as three degrees.",
  ],
  [
    "Haddad",
    2018,
    203,
    "The printing press did not create the desire to read; it met a hunger that had been growing for a century.",
    "a demand for reading had built up over a hundred years, and the printing press satisfied it rather than causing it.",
    "the printing press did not produce the wish to read; it answered a hunger that had been growing for a hundred years.",
  ],
  [
    "Moreno",
    2020,
    41,
    "Most people who abandon a new language do so not because it is too hard but because they stop finding time to practice.",
    "a lack of time to practice, rather than the difficulty of the language, is the usual reason learners give up.",
    "most people who quit a new language do so not because it is too difficult but because they stop finding time to practice.",
  ],
  [
    "Chen",
    2017,
    5,
    "Bees that were exposed to small amounts of the pesticide took longer to find their way back to the hive.",
    "even a little of the pesticide slowed the bees on their journeys home.",
    "bees that were exposed to small doses of the pesticide needed longer to find their route back to the hive.",
  ],
  [
    "Abara",
    2022,
    130,
    "Patients who were given clear written instructions when they left the hospital were half as likely to return within a month.",
    "the share of patients back in the hospital within a month was cut in half when they went home with plain instructions on paper.",
    "patients who were handed clear written directions when they left the hospital were half as likely to come back within a month.",
  ],
  [
    "Kowalczyk",
    2016,
    77,
    "The railway turned small market towns into suburbs, as workers could now live in one place and work in another.",
    "once trains let people work in one town and sleep in another, many small market towns became suburbs.",
    "the railway changed small market towns into suburbs, as workers could now live in one town and work in another.",
  ],
  [
    "Yamamoto",
    2023,
    19,
    "Children who spent more time outdoors were less likely to become short-sighted, whatever activity they did outside.",
    "time outside, no matter what children did there, went with a lower chance of short sight.",
    "children who spent more hours outdoors were less likely to become near-sighted, whatever activity they did outside.",
  ],
];

/** quotingBank shows a source and a writer's use of it, and asks whether the use is a quotation, a paraphrase or plagiarism. */
export const quotingBank: readonly ChoiceItem[] = sourceCores.flatMap(([author, year, page, source, paraphrase, patch], i) => {
  const shown = (use: string) => `Source (${author}, ${year}, p. ${page}): "${source}"\n\nA student writes: ${use}`;
  const bare = source.slice(0, -1);
  const items: ChoiceItem[] = [
    [shown(`As ${author} (${year}) puts it, "${lower(bare)}" (p. ${page}).`), quoteVerdict, [paraphraseVerdict, plagiarismVerdict]],
    [shown(`According to ${author} (${year}), ${paraphrase}`), paraphraseVerdict, [quoteVerdict, plagiarismVerdict]],
    [shown(capital(paraphrase)), plagiarismVerdict, [paraphraseVerdict, quoteVerdict]],
    [shown(`According to ${author} (${year}), ${patch}`), plagiarismVerdict, [paraphraseVerdict, quoteVerdict]],
    [shown(`${author} (${year}) writes that ${lower(source)}`), plagiarismVerdict, [quoteVerdict, paraphraseVerdict]],
  ];
  // Rotate the order so that consecutive items differ in their verdict.
  return items.map((_, k) => items[(k + i) % items.length] as ChoiceItem);
});

// Citing in MLA and APA.

interface Person {
  readonly last: string;
  readonly first: string;
}

const people: readonly Person[] = [
  { last: "Rivera", first: "Maria" },
  { last: "Okafor", first: "Ada" },
  { last: "Lindqvist", first: "Ingrid" },
  { last: "Haddad", first: "Samir" },
  { last: "Moreno", first: "Lucia" },
  { last: "Chen", first: "Li" },
  { last: "Abara", first: "Grace" },
  { last: "Novak", first: "Tomas" },
  { last: "Park", first: "Jun" },
  { last: "Silva", first: "Rosa" },
];

/** inTextBank asks for the in-text citation of a page in the style named, for one, two or three authors. */
export const inTextBank: readonly ChoiceItem[] = [0, 1, 2, 3, 4, 5].flatMap((round) =>
  (["APA", "MLA"] as const).flatMap((style) =>
    ([1, 2, 3] as const).map((count, c): ChoiceItem => {
      const k = round * 3 + c;
      const a = pick(people, k);
      const b = pick(people, k + 3);
      const d = pick(people, k + 6);
      const year = 2012 + ((k * 5) % 12);
      const page = 7 + ((k * 17) % 190);
      const who =
        count === 1
          ? `${a.first} ${a.last}`
          : count === 2
            ? `${a.first} ${a.last} and ${b.first} ${b.last}`
            : `${a.first} ${a.last}, ${b.first} ${b.last} and ${d.first} ${d.last}`;
      const shown = `${style} style. You quote page ${page} of a ${year} article by ${who}. Which in-text citation is correct?`;
      const apa =
        count === 1
          ? `(${a.last}, ${year}, p. ${page})`
          : count === 2
            ? `(${a.last} & ${b.last}, ${year}, p. ${page})`
            : `(${a.last} et al., ${year}, p. ${page})`;
      const mla = count === 1 ? `(${a.last} ${page})` : count === 2 ? `(${a.last} and ${b.last} ${page})` : `(${a.last} et al. ${page})`;
      const badApa =
        count === 1
          ? `(${a.last}, p. ${page}, ${year})`
          : count === 2
            ? `(${a.last}, ${b.last}, ${year}, p. ${page})`
            : `(${a.last}, ${b.last}, & ${d.last} ${year} ${page})`;
      const badMla =
        count === 1
          ? `(${a.last}, ${page})`
          : count === 2
            ? `(${a.last} and ${b.last}, p. ${page})`
            : `(${a.last}, ${b.last} and ${d.last}, ${page})`;
      return style === "APA" ? [shown, apa, [mla, badApa]] : [shown, mla, [apa, badMla]];
    }),
  ),
);

interface Book {
  readonly author: Person;
  readonly year: number;
  /** title is in sentence case, as APA writes it; titled is in title case, as MLA writes it. */
  readonly title: string;
  readonly titled: string;
  readonly publisher: string;
}

interface Article {
  readonly authors: readonly [Person, Person];
  readonly year: number;
  readonly title: string;
  readonly titled: string;
  readonly journal: string;
  readonly volume: number;
  readonly issue: number;
  readonly pages: string;
}

const books: readonly Book[] = [
  {
    author: { last: "Rivera", first: "Maria" },
    year: 2019,
    title: "The quiet city: Noise and health in urban life",
    titled: "The Quiet City: Noise and Health in Urban Life",
    publisher: "Harbor Press",
  },
  {
    author: { last: "Mensah", first: "Kwame" },
    year: 2015,
    title: "Debt and empire: Why Rome could not pay",
    titled: "Debt and Empire: Why Rome Could Not Pay",
    publisher: "Northfield University Press",
  },
  {
    author: { last: "Lindqvist", first: "Ingrid" },
    year: 2021,
    title: "Shade: Trees and the future of cities",
    titled: "Shade: Trees and the Future of Cities",
    publisher: "Greenway Books",
  },
  {
    author: { last: "Haddad", first: "Samir" },
    year: 2018,
    title: "The hungry reader: Print and its public",
    titled: "The Hungry Reader: Print and Its Public",
    publisher: "Lantern Press",
  },
  {
    author: { last: "Moreno", first: "Lucia" },
    year: 2020,
    title: "Why we quit: Adults and new languages",
    titled: "Why We Quit: Adults and New Languages",
    publisher: "Westbrook",
  },
  {
    author: { last: "Yamamoto", first: "Hana" },
    year: 2023,
    title: "Outside light: Children, play and eyesight",
    titled: "Outside Light: Children, Play and Eyesight",
    publisher: "Cedar House",
  },
  {
    author: { last: "Kowalczyk", first: "Piotr" },
    year: 2016,
    title: "Tracks to the suburbs: The railway and the modern town",
    titled: "Tracks to the Suburbs: The Railway and the Modern Town",
    publisher: "Ridgeline Press",
  },
  {
    author: { last: "Abara", first: "Grace" },
    year: 2022,
    title: "Going home: What patients need to know",
    titled: "Going Home: What Patients Need to Know",
    publisher: "Meridian Health Press",
  },
];

const articles: readonly Article[] = [
  {
    authors: [
      { last: "Chen", first: "Li" },
      { last: "Okafor", first: "Ada" },
    ],
    year: 2021,
    title: "Sleep and memory in teenagers",
    titled: "Sleep and Memory in Teenagers",
    journal: "Journal of Youth Studies",
    volume: 14,
    issue: 2,
    pages: "45–60",
  },
  {
    authors: [
      { last: "Novak", first: "Tomas" },
      { last: "Rossi", first: "Eva" },
    ],
    year: 2019,
    title: "Homework and achievement in primary school",
    titled: "Homework and Achievement in Primary School",
    journal: "Education Review",
    volume: 31,
    issue: 4,
    pages: "210–228",
  },
  {
    authors: [
      { last: "Hussain", first: "Amira" },
      { last: "Park", first: "Jun" },
    ],
    year: 2020,
    title: "Bike lanes and local business",
    titled: "Bike Lanes and Local Business",
    journal: "Urban Studies Quarterly",
    volume: 8,
    issue: 1,
    pages: "12–29",
  },
  {
    authors: [
      { last: "Silva", first: "Rosa" },
      { last: "Keller", first: "David" },
    ],
    year: 2018,
    title: "Pesticides and the homing of bees",
    titled: "Pesticides and the Homing of Bees",
    journal: "Insect Science",
    volume: 22,
    issue: 3,
    pages: "301–315",
  },
  {
    authors: [
      { last: "Ali", first: "Omar" },
      { last: "Weber", first: "Nina" },
    ],
    year: 2022,
    title: "Written instructions and hospital readmission",
    titled: "Written Instructions and Hospital Readmission",
    journal: "Journal of Patient Care",
    volume: 40,
    issue: 6,
    pages: "88–97",
  },
  {
    authors: [
      { last: "Sato", first: "Kenji" },
      { last: "Lin", first: "Mei" },
    ],
    year: 2017,
    title: "Memory in goldfish revisited",
    titled: "Memory in Goldfish Revisited",
    journal: "Animal Behavior Letters",
    volume: 5,
    issue: 2,
    pages: "77–84",
  },
  {
    authors: [
      { last: "Patel", first: "Priya" },
      { last: "Brown", first: "Leo" },
    ],
    year: 2023,
    title: "Screen time and sleep in adolescents",
    titled: "Screen Time and Sleep in Adolescents",
    journal: "Sleep and Health",
    volume: 12,
    issue: 1,
    pages: "1–15",
  },
  {
    authors: [
      { last: "Romero", first: "Ana" },
      { last: "Amoah", first: "Kofi" },
    ],
    year: 2016,
    title: "Drought and harvests in the dry belt of West Africa",
    titled: "Drought and Harvests in the Dry Belt of West Africa",
    journal: "Journal of Climate and Society",
    volume: 9,
    issue: 3,
    pages: "140–162",
  },
];

const initial = (p: Person) => `${p.last}, ${p.first.charAt(0)}.`;

/** referenceBank asks for the correct APA or MLA entry for a book or an article in a list of references. */
export const referenceBank: readonly ChoiceItem[] = [
  ...books.flatMap((b, i): ChoiceItem[] => {
    const apa = `${initial(b.author)} (${b.year}). ${b.title}. ${b.publisher}.`;
    const mla = `${b.author.last}, ${b.author.first}. ${b.titled}. ${b.publisher}, ${b.year}.`;
    const badApa = `${b.author.first.charAt(0)}. ${b.author.last}. ${b.title}. ${b.publisher}, ${b.year}.`;
    const badMla = `${initial(b.author)} (${b.year}). "${b.titled}." ${b.publisher}.`;
    const shown = (style: string) =>
      `Which is the correct ${style} entry for this book in a list of references? ${b.author.first} ${b.author.last}, ${b.titled}, published by ${b.publisher} in ${b.year}.`;
    const items: ChoiceItem[] = [
      [shown("APA"), apa, [mla, badApa]],
      [shown("MLA"), mla, [apa, badMla]],
    ];
    return i % 2 === 0 ? items : items.reverse();
  }),
  ...articles.flatMap((a, i): ChoiceItem[] => {
    const [x, y] = a.authors;
    const apa = `${initial(x)}, & ${initial(y)} (${a.year}). ${a.title}. ${a.journal}, ${a.volume}(${a.issue}), ${a.pages}.`;
    const mla = `${x.last}, ${x.first}, and ${y.first} ${y.last}. "${a.titled}." ${a.journal}, vol. ${a.volume}, no. ${a.issue}, ${a.year}, pp. ${a.pages}.`;
    const badApa = `${x.last}, ${x.first}, and ${y.last}, ${y.first}. ${a.title}. ${a.journal}, ${a.volume}(${a.issue}), ${a.pages}, ${a.year}.`;
    const badMla = `${x.last}, ${x.first}, and ${y.first} ${y.last} (${a.year}). ${a.titled}. ${a.journal} ${a.volume}.${a.issue}: ${a.pages}.`;
    const shown = (style: string) =>
      `Which is the correct ${style} entry for this article in a list of references? "${a.titled}" by ${x.first} ${x.last} and ${y.first} ${y.last}, in ${a.journal}, volume ${a.volume}, issue ${a.issue}, ${a.year}, pages ${a.pages}.`;
    const items: ChoiceItem[] = [
      [shown("APA"), apa, [mla, badApa]],
      [shown("MLA"), mla, [apa, badMla]],
    ];
    return i % 2 === 0 ? items : items.reverse();
  }),
];

// Cohesion: old before new.

/** cohesionBank gives a sentence and asks which next sentence begins with what the reader already knows. */
export const cohesionBank: readonly ChoiceItem[] = threeWay(`
  Last year the city built a new bridge over the river.|The bridge was designed by a young engineer from the university.|A young engineer from the university designed the bridge.|There was a young engineer from the university who designed the bridge.
  Every cell in the body contains DNA.|This DNA carries the instructions for building proteins.|The instructions for building proteins are carried by this DNA.|Proteins are built from instructions that this DNA carries.
  Last spring, the school opened a garden behind the gym.|The garden is now looked after by students from every grade.|Students from every grade now look after the garden.|Now students from every grade are looking after the garden.
  Many early maps showed California as an island.|This error was copied from one map to the next for more than a century.|Mapmakers copied this error from one map to the next for more than a century.|For more than a century, mapmakers copied this error from map to map.
  The researchers collected samples of water from forty wells.|Each sample was then tested for lead and arsenic.|Tests for lead and arsenic were then run on each sample.|Lead and arsenic were then tested for in each sample.
  The city council proposed a tax on sugary drinks.|The tax was opposed by shop owners, who feared losing customers.|Shop owners, who feared losing customers, opposed the tax.|Fearing the loss of customers, shop owners opposed the tax.
  Most of the world's chocolate begins as cacao beans grown in West Africa.|These beans are picked by hand, often on small family farms.|Small family farms often pick these beans by hand.|By hand, often on small family farms, these beans are picked.
  The novel is narrated by a girl of twelve.|Her voice gives the book both its humor and its sadness.|Both its humor and its sadness come to the book from her voice.|Humor and sadness are both given to the book by her voice.
  In 2010, the town replaced its street lights with LED lamps.|These lamps use less than half the electricity of the old ones.|Less than half the electricity of the old ones is used by these lamps.|Half the electricity of the old ones, or less, is what these lamps use.
  The survey asked parents how many hours their children spent on screens.|Their answers ranged from one hour a day to more than eight.|From one hour a day to more than eight was the range of their answers.|One hour a day to more than eight hours was how their answers ranged.
  The Great Wall was built over many centuries by different dynasties.|Its oldest sections date from more than two thousand years ago.|More than two thousand years ago is the date of its oldest sections.|Two thousand years and more is the age of its oldest sections.
  Honeybees communicate through a kind of dance.|This dance tells other bees the direction and distance of food.|The direction and distance of food are told to other bees by this dance.|Other bees learn the direction and distance of food from this dance.
  Last year the museum received a collection of four hundred letters.|The letters were written by soldiers to their families during the war.|Soldiers wrote the letters to their families during the war.|During the war, soldiers wrote the letters to their families.
  Our first experiment tested the effect of light on how plants grow.|Its results surprised us: the plants grew fastest in dim light.|The plants grew fastest in dim light, a result of the experiment that surprised us.|Fastest growth in dim light was what surprised us in the results.
  Many students struggle with fractions.|This difficulty often begins when they first learn to divide.|Learning to divide for the first time is often where this difficulty begins.|When they first learn to divide is often when this difficulty begins.
  The company launched a cheaper version of its phone in March.|The cheaper phone sold twice as many units as expected.|Twice as many units as expected were sold of the cheaper phone.|Buyers bought twice as many units as expected of the cheaper phone.
  Volcanic eruptions throw huge amounts of ash into the air.|This ash can block sunlight and cool the planet for a year or more.|Sunlight can be blocked, and the planet cooled for a year or more, by this ash.|The planet can be cooled for a year or more when sunlight is blocked by this ash.
  The article's main claim is that working from home increases productivity.|This claim rests on a survey of only one company.|A survey of only one company is what this claim rests on.|Only one company was surveyed for this claim.
  The river carries silt down from the mountains.|The silt settles on the plain each spring and makes the soil rich.|Each spring the plain receives the silt, which settles and makes the soil rich.|Rich soil is made each spring on the plain as the silt settles.
  In the first chapter, the author describes her grandmother's kitchen.|That kitchen becomes a symbol of safety throughout the book.|A symbol of safety throughout the book is what that kitchen becomes.|Throughout the book, safety is symbolized by that kitchen.
  The hospital introduced a checklist for every surgery.|The checklist reduced errors by a third in its first year.|Errors fell by a third in the first year because of the checklist.|In its first year, a third fewer errors were made thanks to the checklist.
  The library's oldest book is a prayer book printed in 1480.|This book was given to the library by a local family in 1902.|A local family gave this book to the library in 1902.|In 1902 a local family gave the library this book.
  Researchers asked volunteers to memorize a list of words.|Half of the volunteers then slept for eight hours, while the other half stayed awake.|Eight hours of sleep was then given to half the volunteers, while the other half stayed awake.|Sleeping for eight hours was then what half the volunteers did, while the other half stayed awake.
  The first railway in the region opened in 1850.|It connected the port with the coal mines inland.|The port and the coal mines inland were connected by it.|The coal mines inland and the port were what it connected.
  Coral reefs cover less than one percent of the ocean floor.|Yet these reefs are home to about a quarter of all ocean species.|Yet about a quarter of all ocean species live on these reefs.|About a quarter of all ocean species, however, make their home on these reefs.
  The new law required every restaurant to post its inspection grade in the window.|These grades quickly changed where people chose to eat.|Where people chose to eat was quickly changed by these grades.|People quickly changed where they chose to eat because of these grades.
  The poem is written in the form of a letter.|This form lets the speaker address her absent son directly.|Her absent son can be addressed directly by the speaker because of this form.|The speaker can address her absent son directly through this form.
  Prices rose sharply in the spring.|This rise pushed the central bank to raise interest rates.|The central bank was pushed to raise interest rates by this rise.|Interest rates were raised by the central bank because of this rise.
  The study's participants were all university students.|Such a narrow group may not represent adults in general.|Adults in general may not be represented by such a narrow group.|Whether adults in general are represented by such a narrow group is doubtful.
  Many birds fly thousands of kilometers each year.|To find their way, these birds use the sun, the stars and the earth's magnetic field.|The sun, the stars and the earth's magnetic field are used by these birds to find their way.|The earth's magnetic field, the sun and the stars guide these birds on their way.
  The town's population doubled between 1990 and 2010.|This growth put pressure on its schools and roads.|Schools and roads came under pressure from this growth.|Pressure on schools and roads was put there by this growth.
  The first prototype of the team's robot was too heavy to carry.|This problem was solved by building the second prototype from aluminum instead of steel.|Aluminum instead of steel was used in the second prototype to solve this problem.|Building the second prototype from aluminum instead of steel solved this problem.
`);

// Clear sentences: characters and actions.

/** clarityBank gives a sentence thick with abstract nouns and asks which revision is clearest and still means the same. */
export const clarityBank: readonly ChoiceItem[] = threeWay(`
  The committee's decision was the postponement of the vote until a review of the costs had been carried out.|The committee decided to postpone the vote until it had reviewed the costs.|A decision for postponement of the vote was made by the committee pending a cost review.|The committee voted after reviewing the costs.
  There was a failure on the part of the city to provide an explanation of the increase in fares.|The city failed to explain why fares had increased.|An explanation of the fare increase was not provided by the city, which was a failure.|The city explained why fares had increased.
  The analysis of the data by the researchers led to the discovery of an error in the measurement of temperature.|When the researchers analyzed the data, they discovered that the temperature had been measured wrongly.|An error in temperature measurement was discovered through the analysis of the data by the researchers.|The researchers measured the temperature and analyzed the data.
  Our expectation is that there will be an improvement in attendance following the introduction of the new schedule.|We expect attendance to improve once the new schedule is introduced.|An improvement in attendance is our expectation following the new schedule's introduction.|We expect the new schedule to be introduced after attendance improves.
  The intention of the author is the persuasion of readers of the necessity of reform.|The author intends to persuade readers that reform is necessary.|Persuasion of readers regarding the necessity of reform is the author's intention.|The author persuades readers that reform has already happened.
  Consideration of the proposal by the board will take place at its next meeting.|The board will consider the proposal at its next meeting.|At its next meeting, the proposal will undergo consideration by the board.|The board considered the proposal at its last meeting.
  There is a need for students to have an understanding of the causes of the war.|Students need to understand what caused the war.|An understanding of the war's causes is a need that students have.|Students need to understand how the war ended.
  The reduction of costs was achieved by the company through the elimination of paper forms.|The company reduced costs by eliminating paper forms.|Cost reduction through the elimination of paper forms was achieved by the company.|The company eliminated its costs and its paper forms.
  The failure of the bridge was the result of the corrosion of its steel cables.|The bridge failed because its steel cables had corroded.|The result of the corrosion of its steel cables was the failure of the bridge.|The bridge's steel cables failed because the bridge had corroded.
  The provision of training to new staff is the responsibility of the manager.|The manager is responsible for training new staff.|Responsibility for the provision of training to new staff lies with the manager.|New staff are responsible for training the manager.
  An investigation into the causes of the fire was conducted by the police.|The police investigated what caused the fire.|The causes of the fire were the subject of an investigation conducted by the police.|The police caused the fire during an investigation.
  Our recommendation is the adoption of a later start time by the school.|We recommend that the school start later.|The adoption of a later start time is recommended by us for the school.|We recommend that the school end earlier.
  The completion of the report by the team occurred two days before the deadline.|The team completed the report two days before the deadline.|Completion of the report was achieved by the team two days ahead of the deadline.|The team began the report two days before the deadline.
  There was an agreement among the scientists that further testing was a necessity.|The scientists agreed that they needed to test further.|Agreement on the necessity of further testing was reached among the scientists.|The scientists disagreed about further testing.
  The cause of the decline in sales was a rise in prices.|Sales declined because prices rose.|A rise in prices was the cause of the decline in sales.|Prices rose because sales declined.
  A discussion of the budget by the council will occur on Monday.|The council will discuss the budget on Monday.|On Monday, the budget will be the subject of discussion by the council.|The council discussed the budget last Monday.
  The government's response to the flood was the evacuation of three villages.|The government responded to the flood by evacuating three villages.|The evacuation of three villages was the response of the government to the flood.|The flood forced the government to respond.
  Our assessment of the effectiveness of the program involved a comparison of test scores.|We assessed how well the program worked by comparing test scores.|A comparison of test scores was involved in our assessment of the program's effectiveness.|We compared the program with its test scores.
  The prevention of injuries is the purpose of the new rules.|The new rules are meant to prevent injuries.|Prevention of injuries constitutes the purpose of the new rules.|The new rules caused injuries.
  The examination of the patient by the doctor resulted in a diagnosis of a broken wrist.|The doctor examined the patient and found that her wrist was broken.|A diagnosis of a broken wrist was the result of the examination of the patient by the doctor.|The doctor broke the patient's wrist during the examination.
  There was a disagreement between the two historians about the interpretation of the letter.|The two historians disagreed about how to interpret the letter.|Disagreement about the interpretation of the letter existed between the two historians.|The two historians wrote the letter together.
  The achievement of the goal will require cooperation between departments.|To achieve the goal, the departments will have to cooperate.|Cooperation between departments is a requirement for the achievement of the goal.|The departments achieved the goal without cooperating.
  The arrival of the shipment was later than expected, which caused a delay in production.|The shipment arrived later than expected, so production was delayed.|A delay in production was caused by the arrival of the shipment later than expected.|Production was delayed, so the shipment arrived late.
  A recommendation was made by the reviewers for the inclusion of more recent sources.|The reviewers recommended including more recent sources.|The inclusion of more recent sources was the subject of a recommendation by the reviewers.|The reviewers included more recent sources.
  The measurement of the students' progress is accomplished through weekly quizzes.|Teachers measure the students' progress with weekly quizzes.|Measurement of the progress of the students is accomplished by means of weekly quizzes.|The students measure their teachers' progress every week.
  Our hope is for the expansion of the program to other schools next year.|We hope to expand the program to other schools next year.|Expansion of the program to other schools next year is the object of our hope.|We hope to end the program at other schools next year.
  The refusal of the landlord to make repairs led to the tenants' decision to withhold rent.|Because the landlord refused to make repairs, the tenants decided to withhold rent.|The decision of the tenants to withhold rent followed the refusal of the landlord to make repairs.|The tenants refused to make repairs, so the landlord withheld rent.
  The establishment of a link between diet and disease was the result of the study.|The study established that diet and disease are linked.|The result of the study was the establishment of a link between diet and disease.|The study found no link between diet and disease.
  There has been a significant improvement in the reliability of the trains since the replacement of the signals.|The trains have become much more reliable since the signals were replaced.|The reliability of the trains has undergone significant improvement following the replacement of the signals.|The signals have become more reliable since the trains were replaced.
  The objection of the residents to the new road was based on a concern about noise.|The residents objected to the new road because they were concerned about noise.|Concern about noise formed the basis of the objection of the residents to the new road.|The residents objected to the noise of the old road.
  The use of simple language by the writer makes the explanation of difficult ideas possible.|Because the writer uses simple language, she can explain difficult ideas.|Explanation of difficult ideas is made possible by the use of simple language by the writer.|The writer uses difficult language to explain simple ideas.
  The approval of the plan by the council depends on the submission of a revised budget.|The council will approve the plan only if a revised budget is submitted.|Approval of the plan by the council is dependent on the submission of a revised budget.|The council approved both the plan and the revised budget.
`);

// Numbers in writing.

const numberWords: Readonly<Record<number, string>> = {
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  12: "twelve",
  15: "fifteen",
  24: "twenty-four",
  36: "thirty-six",
  48: "forty-eight",
  60: "sixty",
  85: "eighty-five",
};

const word = (n: number) => numberWords[n] ?? String(n);

/** numberKind names the rule an item of the numbers bank tests, for its explanation. */
export type NumberRule = "small" | "large" | "start" | "percent" | "unit" | "range";

const countFrames = [
  "The study followed ___ families for a year.",
  "The team interviewed ___ teachers in the district.",
  "Researchers visited ___ villages along the coast.",
  "The survey reached ___ schools in the region.",
  "The clinic treated ___ patients on the first day.",
  "The museum holds ___ letters from the war.",
  "We ran ___ experiments before the result held.",
];

/** numberBank asks how a number is written in academic prose, by the rules of APA style. */
export const numberBank: readonly (readonly [item: ChoiceItem, rule: NumberRule])[] = [
  ...countFrames.flatMap((frame, i): (readonly [ChoiceItem, NumberRule])[] => {
    const small = pick([3, 4, 5, 6, 7, 8, 9], i);
    const large = pick([12, 15, 24, 36, 48, 60, 85], i + 2);
    return [
      [[frame, word(small), [String(small), `${word(small)} (${small})`]], "small"],
      [[frame, String(large), [word(large), `${capital(word(large))}`]], "large"],
    ];
  }),
  ...[
    ["___ students took part in the survey.", 48],
    ["___ percent of the replies were incomplete.", 12],
    ["___ villages were flooded that spring.", 24],
    ["___ patients completed the full course of treatment.", 85],
    ["___ schools agreed to join the study.", 36],
    ["___ volunteers came on the first day.", 60],
    ["___ articles met all of our criteria.", 15],
  ].map(([frame, n]): readonly [ChoiceItem, NumberRule] => [
    [String(frame), capital(word(Number(n))), [String(n), `${capital(word(Number(n)))} (${n})`]],
    "start",
  ]),
  ...[
    ["Prices rose by ___ last year.", 6],
    ["The share of students who walk to school fell to ___.", 15],
    ["About ___ of the patients reported side effects.", 4],
    ["The new lamps use ___ less electricity.", 60],
    ["Turnout rose by ___ in the second election.", 9],
    ["Only ___ of the forests remained by 1900.", 24],
    ["The error rate fell to ___ after the checklist was introduced.", 3],
  ].map(([frame, n]): readonly [ChoiceItem, NumberRule] => [
    [String(frame), `${n}%`, [`${word(Number(n))} percent`, `${n} per cent`]],
    "percent",
  ]),
  ...[
    ["Each sample weighed ___.", 5, "kg"],
    ["The new road is ___ long.", 8, "km"],
    ["The seedlings grew ___ in the first week.", 4, "cm"],
    ["Each patient received ___ of the solution.", 6, "ml"],
    ["The trail climbs ___ above the valley floor.", 9, "m"],
    ["The fish were kept in tanks holding ___ of water.", 3, "L"],
    ["The rope broke under a load of ___.", 7, "kg"],
  ].map(([frame, n, unit]): readonly [ChoiceItem, NumberRule] => [
    [String(frame), `${n} ${unit}`, [`${word(Number(n))} ${unit}`, `${n}${unit}`]],
    "unit",
  ]),
  ...[
    ["Scores on the test ranged ___.", 12, 18],
    ["The participants' ages ranged ___.", 15, 24],
    ["Class sizes in the district ranged ___.", 24, 36],
    ["The temperature in the greenhouse varied ___ degrees.", 15, 36],
    ["The shops in the study had ___ employees each.", 3, 12],
    ["Each interview lasted ___ minutes.", 36, 60],
    ["The villages had ___ houses each.", 48, 85],
  ].map(([frame, a, b], i): readonly [ChoiceItem, NumberRule] => {
    const between = i % 2 === 1;
    const right = between ? `between ${a} and ${b}` : `from ${a} to ${b}`;
    const wrongs = between ? [`between ${a}-${b}`, `between ${a} to ${b}`] : [`from ${a}-${b}`, `between ${a}-${b}`];
    return [[String(frame), right, wrongs], "range"];
  }),
];

// Tone and register at work.

/** toneBank describes a situation at work and asks which sentence suits its reader and purpose. */
export const toneBank: readonly ChoiceItem[] = threeWay(`
  Asking your manager, whom you know only slightly, for next Friday off.|Would it be possible for me to take next Friday off? I have finished the report, and Sam has agreed to cover my calls.|hey can i grab next friday off? thx|I am taking next Friday off. I have finished the report, and Sam will cover my calls, so there is nothing further to discuss.
  Declining a colleague's request to take over her project, because your schedule is full.|Thank you for thinking of me. I can't take on the project this month, since I'm committed to the audit until the 30th, but I'd be glad to help after that.|lol no way, I'm swamped|I refuse to take on your project. My schedule is already full with the audit until the 30th, and it is not my job to fix your workload for you.
  Reminding a client that an invoice is two weeks overdue.|I'm writing about invoice 2041, which was due on 3 May. Could you let me know when we can expect payment?|Hey, you still owe us money!|You have failed to pay invoice 2041, which was due on 3 May, two weeks ago. We demand payment immediately, or we will take further action.
  Thanking an interviewer after a job interview.|Thank you for taking the time to speak with me yesterday. I enjoyed learning about the team's plans for the new clinic.|thx for the chat, it was cool!|I hereby express my most profound and humble gratitude for the honor of the interview.
  Telling your team that a meeting has moved.|Please note that Thursday's meeting has moved to 2 p.m. in Room 4.|meeting moved lol, see u whenever|It is hereby communicated that the temporal location of the meeting has been altered.
  Asking a professor you have never met for a copy of a paper.|Dear Professor Lin, I am a first-year student researching river pollution. Would you be willing to share a copy of your 2021 paper on the subject?|Hi prof!! can u send me ur paper?|I am a first-year student researching river pollution, and I need your 2021 paper. Send me a copy of it.
  Turning down a supplier's offer.|Thank you for your offer. After comparing quotes, we have decided to work with another supplier this year, but we will keep your details on file.|nah we're good, thanks anyway|Your offer is rejected. We compared all the quotes and found a better supplier for this year, so there is no point contacting us again.
  Asking a coworker to stop playing music at their desk.|Would you mind using headphones for your music? I'm finding it hard to concentrate on calls.|dude turn that off|Your music is unacceptable and must cease. I cannot concentrate on my calls while you play it at your desk.
  Apologizing to a customer for a late delivery.|I'm sorry your order arrived three days late. We have refunded the shipping cost, and your next delivery will be free.|sorry about that, stuff happens!|The delivery was three days late, but the delay was not our fault. We will not refund the shipping cost or discuss the matter any further.
  Asking your manager for more time on a report.|Would it be possible to move the deadline for the sales report to Wednesday? The final figures from the regional office arrive on Monday.|gonna need a couple more days on that report|The sales report will be late because the regional office is slow to send its figures. I will send it to you when I can, so please stop asking.
  Introducing yourself by email to a team you have just joined.|Hello everyone, I'm Ana, the new data analyst. I'll be working with you on the customer survey, and I look forward to meeting you this week.|hiii it's ana!!! new here :)|Greetings. Let it be known that I, Ana, have commenced employment as an analyst.
  Telling an applicant that they did not get the job.|Thank you for applying for the position of office manager. We were impressed by your experience, but we have offered the role to another candidate.|sorry, you didn't get it|You were not good enough for the position of office manager, so we have given the job to another candidate.
  Asking a senior colleague for comments on a draft.|When you have a moment this week, could you look over my draft of the proposal? I'd especially value your view on the budget section.|can u look at my thing?|Review my draft of the proposal by tomorrow, especially the budget section, because I need your comments before I send it.
  Correcting a mistake you made in an earlier email to clients.|Please note a correction to yesterday's email: the workshop is on 14 June, not 4 June. I apologize for the error.|oops wrong date lol, it's the 14th|It has come to our attention that an inaccuracy pertaining to the date of the workshop may possibly have been inadvertently included in prior correspondence.
  Declining an invitation to speak at a conference.|Thank you for inviting me to speak at the conference. Unfortunately, I am already committed to another event that week, but I hope to attend next year.|can't make it, sorry|I will not speak at your conference. I already have another event that week, and I do not plan to attend next year.
  Asking the technology team to fix your laptop.|My laptop has not connected to the office network since this morning's update. Could someone take a look today? I have a client call at 3 p.m.|laptop broken again ugh, fix pls|You must fix my laptop immediately. It has not connected to the office network since your update this morning, and I have a client call at 3 p.m.
  Following up on an email that has gone unanswered for a week.|I'm following up on my email of 2 March about the training dates. Could you let me know which week suits your team?|hello?? did u see my email??|You have ignored my email of 2 March about the training dates for a whole week now. Tell me today which week suits your team.
  Telling your manager that you made an error in a report.|I found an error in last week's sales report: the March total should be \\$42,000, not \\$48,000. I've attached a corrected version.|messed up the report, my bad|An error, the origin of which shall not be attributed to any individual, was located in last week's sales report, and a corrected version is hereby supplied.
  Asking a colleague to cover your shift.|Would you be able to cover my shift on Saturday morning? I'd be happy to take one of yours in return.|cover me sat? thx|You will cover my shift on Saturday morning, and I may take one of yours another time if I have a free day.
  Answering a customer's complaint about rude service.|Thank you for letting us know about your experience. I'm sorry you were treated that way; I have shared your message with the store manager.|whatever, staff have bad days|We do not accept that our staff were rude to you, and we will not be passing your message on to the store manager.
  Refusing a request for a discount your company cannot give.|I understand why you asked. We are unable to offer a discount on this order, but we can offer free delivery.|no discounts sorry not sorry|Discounts are not given on any order, whatever the reason for asking. Do not ask again, as the answer will be the same.
  Asking a client to confirm the time of a meeting.|Could you confirm whether Tuesday at 10 a.m. still works for our meeting?|we still on for tues?|Confirm immediately whether Tuesday at 10 a.m. still works for our meeting, because I cannot wait any longer.
  Writing to a new client after your first meeting.|Thank you for meeting with us today. As agreed, we will send a draft plan by Friday, 12 April.|great meeting! talk soon!!|Pursuant to our meeting of this date, a draft plan shall be forthcoming no later than Friday, 12 April.
  Announcing that the office will close early before a holiday.|The office will close at 3 p.m. on Friday, 22 December. Please make sure all urgent work is finished by then.|we're out early friday woo|Staff are required to vacate the premises at 15:00 hours on Friday, 22 December, without exception, and all urgent work must be concluded prior to that time.
  Asking a busy expert for a short interview for your research.|Would you be willing to speak with me for twenty minutes about your work on city parks? I can call at any time that suits you next week.|can i pick ur brain for a bit?|I require twenty minutes of your time next week to discuss your work on city parks for my research.
  Saying no to your manager's request for weekend work, because of a family commitment.|I'm afraid I can't work this weekend because of a family commitment. I could stay late on Thursday or Friday to help finish the work.|no can do this weekend lol|I do not work weekends, and family commitments come first. Find someone else to finish the work.
  Reporting a safety problem to the building manager.|The handrail on the second-floor stairs is loose. Could it be repaired soon? Someone could be hurt if it gives way.|that stair rail is wobbly fyi|You are endangering everyone in the building with that loose handrail on the second-floor stairs. Repair it at once, before someone is hurt.
  Welcoming a new employee to your team.|Welcome to the team, Omar! We're glad to have you. Your first week's schedule is attached, and I'll meet you at reception at 9 on Monday.|yo omar welcome lol|Your employment commences on Monday. Report to reception at 9 a.m. sharp, read the attached schedule for your first week, and do not be late.
  Telling a client that a project will cost more than estimated.|I'm writing to let you know that the project will cost about 10% more than our estimate, because steel prices have risen. I've attached a revised budget.|bad news, it's gonna cost more|The price has gone up by about 10% because steel is more expensive, and that is final. The revised budget is attached.
  Asking a former teacher for a reference.|Dear Ms. Reyes, I am applying for a summer job at the city library. Would you be willing to write a reference for me? The deadline is 1 May.|hey can u write me a reference real quick?|I am applying for a summer job at the city library, and I need a reference from you. Write the letter for me and send it before the deadline of 1 May.
  Replying to a colleague who has thanked you for your help.|You're very welcome. I'm glad the figures were useful, and I'm happy to help again next quarter.|np!!|Your gratitude is noted and acknowledged. Assistance with the figures may be requested again next quarter if required.
  Asking your manager to explain an unclear instruction.|Could you tell me whether the report should cover only this quarter or the whole year? I want to be sure I include the right figures.|what do u mean by report?|Your instructions are unclear. Tell me whether the report covers this quarter or the whole year, or I cannot include the right figures.
`);

// Parallel lists and headings.

/** listForm names the three forms a list may keep: the -ing form, the command and the to-form. */
export type ListForm = "the -ing form" | "the command form" | "the to-form";

const listCores: readonly (readonly [topic: string, items: readonly (readonly [base: string, ing: string, rest: string])[]])[] = [
  [
    "opening a community garden",
    [
      ["choose", "choosing", "a site"],
      ["raise", "raising", "the money"],
      ["recruit", "recruiting", "volunteers"],
      ["plan", "planning", "the first planting"],
    ],
  ],
  [
    "starting a school newspaper",
    [
      ["form", "forming", "an editorial team"],
      ["set", "setting", "a schedule"],
      ["find", "finding", "a printer"],
      ["sell", "selling", "advertising"],
    ],
  ],
  [
    "a safer bicycle route",
    [
      ["map", "mapping", "the current routes"],
      ["survey", "surveying", "cyclists"],
      ["design", "designing", "the new lanes"],
      ["test", "testing", "the signals"],
    ],
  ],
  [
    "a training program for staff",
    [
      ["assess", "assessing", "current skills"],
      ["hire", "hiring", "trainers"],
      ["write", "writing", "the course materials"],
      ["evaluate", "evaluating", "the results"],
    ],
  ],
  [
    "moving the office",
    [
      ["find", "finding", "a new building"],
      ["pack", "packing", "the files"],
      ["move", "moving", "the computers"],
      ["inform", "informing", "our clients"],
    ],
  ],
  [
    "a concert to raise funds",
    [
      ["book", "booking", "a hall"],
      ["invite", "inviting", "performers"],
      ["print", "printing", "tickets"],
      ["thank", "thanking", "the sponsors"],
    ],
  ],
  [
    "reducing waste in the cafeteria",
    [
      ["measure", "measuring", "food waste"],
      ["replace", "replacing", "plastic trays"],
      ["compost", "composting", "leftovers"],
      ["report", "reporting", "the savings"],
    ],
  ],
  [
    "a research project on sleep",
    [
      ["review", "reviewing", "earlier studies"],
      ["recruit", "recruiting", "participants"],
      ["collect", "collecting", "sleep diaries"],
      ["analyze", "analyzing", "the data"],
    ],
  ],
  [
    "launching a website",
    [
      ["choose", "choosing", "a design"],
      ["write", "writing", "the content"],
      ["test", "testing", "every page"],
      ["train", "training", "the editors"],
    ],
  ],
  [
    "improving the library",
    [
      ["extend", "extending", "opening hours"],
      ["add", "adding", "study rooms"],
      ["buy", "buying", "new books"],
      ["survey", "surveying", "readers"],
    ],
  ],
  [
    "a youth soccer league",
    [
      ["register", "registering", "players"],
      ["train", "training", "coaches"],
      ["schedule", "scheduling", "matches"],
      ["rent", "renting", "fields"],
    ],
  ],
  [
    "an emergency plan for the school",
    [
      ["mark", "marking", "exit routes"],
      ["assign", "assigning", "team leaders"],
      ["practice", "practicing", "fire drills"],
      ["stock", "stocking", "first-aid kits"],
    ],
  ],
];

const forms: readonly ListForm[] = ["the -ing form", "the command form", "the to-form"];

const inForm = (form: ListForm, [base, ing, rest]: readonly [string, string, string]) =>
  form === "the -ing form" ? `${capital(ing)} ${rest}` : form === "the command form" ? `${capital(base)} ${rest}` : `To ${base} ${rest}`;

const listIntro: Readonly<Record<ListForm, string>> = {
  "the -ing form": "The headings of a report on",
  "the command form": "The steps of a guide to",
  "the to-form": "The objectives of a plan for",
};

/** listBank shows a list or set of headings with one gap and asks which item keeps the list parallel. */
export const listBank: readonly (readonly [item: ChoiceItem, form: ListForm])[] = listCores.flatMap(([topic, items], i) =>
  forms.map((form, f): readonly [ChoiceItem, ListForm] => {
    const gap = (i + f) % items.length;
    const lines = items.map((item, k) => `- ${k === gap ? "___" : inForm(form, item)}`).join("\n");
    const target = items[gap] as readonly [string, string, string];
    return [
      [`${listIntro[form]} ${topic}:\n\n${lines}`, inForm(form, target), forms.filter((o) => o !== form).map((o) => inForm(o, target))],
      form,
    ];
  }),
);
