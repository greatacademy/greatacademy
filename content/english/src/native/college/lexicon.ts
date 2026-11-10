// College writing: the words the passages of the course use that the lexicon of the skill courses and the earlier
// bands does not list. Each spelling is an entry of its own, so that a spelling another pack already lists does not
// hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
academic accelerated accusation acquire affection alarmed approach approached approaching arson assumes baker's
blackbirds bolder boldness breed broader built-in caution ceased circulate coincides comparisons concludes consistent
contents contrast contributes contribution decline declines deliberate deliberately desires despite destruction differ
directed discomfort discussion disprove dispute distinguish distraction dominated economic economists emphasized
employment examination exceptions exclusive existence extracted factors familiar fiercely fragments gaps generally
genuinely goed grammar gun heavily hiring historical hourly illusion illustrates inborn incomplete indeed indirect
inherited input insecurity interestingly interpreter issue learner lifetime lightly limitations lowest-paid meaningful
merely mind's misfortune modest mouses mutually narrower neighboring noted occupied odd opposition overlook overstate
patterns philosophers pitch plausible plural pointing policy port principles produces productive provoked puzzling
questioned readiness recall reconcile reconstructed rejects relatively resolved rethink retrieve reveals robber
roughly scrolling secondary session sessions settle shame single-session sobering somewhat southwest spaced spacing
stated strengthens survival tendency tolerance tolerate tolerating tourism unrelated unskilled unusually warehouses
weekly well-being
`;

/** researchWords are the words of the reading unit research-in-practice that the lexicons lacked. */
const researchWords = `
abandon abandoned accurately advance advantage adviser agriculture aid analysis anthropologist archivists arose
assigned attempt aware basement beams beginners briefly catalogue chemist cited clerk collection collections combining
commit complements compound concerned concluded confined confirm conflicted corridor dated description detailed detect
detecting differed differs difficulties dignity disagreement dissolve distrust downstairs eldest entries existing
exists extend failure famine former foundation fund funded headings honesty index informants instance intending
interpretation interviewed items keywords labeled library's listing membership merged misunderstood narrowed neutral
notebooks noting oneself onset participant participants payroll permission photographs political possibilities precise
procedure proposal psychologist purposes reaction readable reconstruct regard regarded register reliably reluctant
reshaped resisted resulting rewarding selected sensors sociology sought speculated standards struck subgroup
substantial supplier suspicion technical teller's temptation textile timed timetable trace trivial unaffected
uncatalogued unfamiliar uninteresting union unique unlikely unopened unprocessed unread usable vague vocabulary well-known width willingness worded wording worker's
`;

/** ethicsWords are the words of the reading unit the-ethics-of-knowledge that the lexicons lacked. */
const ethicsWords = `
acceptance accuracy achieve alarming alphabetical alteration alters altogether appearance appropriate arise assuming
author's authoritative authorship blurs carelessly citation cite cites cleanness closures collaborators commentaries
committees commonly competition conceived conducts confirmed confirms consulted contradict contribute contributed
contributions contributors conventions core correction criteria criterion critically deceive decimal definition
descendants detection disagreements dishonest display distinguishes distracting documented draft duty edit else's
encyclopedia encyclopedias ensure ethicist expertise expression factual faith faithfully features figures flawed
fooled footnote footnotes forbids forgery fraud frequently funding gatekeeper handful hired humanities imbalance
incorrectly independently inference inflates investigation issues journal's judgments loops mathematics misconduct
misread normally objected obscure obtained occasionally offending omissions origin origins overview paper's paragraph
parentheses patchwrite patchwriting peer plagiarism plagiarized plainly prediction previous profession qualify
quotation quote readership reasoned reproduce request requested requirement restate restates retract retracted
retraction retractions reviewer reviewer's reviewers revisions revisit rewarded scientist's seriously shoppers
statements statistics storytelling submission succinctly suitable supervisor suspected systematic textbooks theft
traceable tracing troubling truly unable undetected unknown unpaid unravel unsure upon usefully vary zombie
`;

/** paperWords are the words of the reading unit inside-a-research-paper that the lexicons lacked. */
const paperWords = `
accounted accumulated alert amounted analyses anticipates apology assign attentive attrition automatically basis
behalf belong benefited capture category commentary consent consisted containing context courtesy critic crude
departed deprives discipline distort encounter establish establishes exposed exposure extended finer funnel geographer
greatly greener grouped identically identifies identifying importantly impression improvisation indoors introduction
limitation loosely matching meaningless middle-income misleads modesty observational obviously orderly outdoors
overestimated overreached phrased possibility reanalysis reanalyzed reception refined registered registration
regrettable relates repays representative restating ritual specifically stable statistician storage strength strictly
study's surroundings suspicious synthesize tiring typically underestimated underrepresented unimportant unmeasured
varied
`;

/** styleWords are the words of the reading unit essays-on-writing that the lexicons lacked. */
const styleWords = `
abundance addition attaches bequeath blindly burden clause combine commas commits committee competencies conceals
confidently confusing consciously consequence consist content convention crucial defeat dense devise digression
disorganized distract drafting drafts drug editor's educational effective escapes examinations explicitly flooded
forbidding foregoing format fracture government's group's guided habitually harshly hereinafter imitation impartial
imposes impress intact item jargon legitimate lessee leverage liberating lifeless manuscript meanings measurable
medium mismatch models moderate naive near-synonyms nouns novelist obligation offense omission omitted optimize
organization overall paragraphs paramedics passive performer phrases polishing prepositions proceed pronoun proofread
proofreading provides refer reformers relation reliability remedy remit represents reputation reread resulted revision
rewrite rewriting rewritten rewrote satisfaction scan scanning scatters second's second-language sections shifted
shorthand shrinking solutions specialized sums tenant thesis tradition's traditionally unclear uninterested unlimited
unreadable variation verb virtue virtuous warnings well-supported wordiness
`;

/** numbersWords are the words of the reading unit numbers-in-the-news that the lexicons lacked. */
const numbersWords = `
absolute actual additional agencies agency alongside annual another's arisen associated attempted baseline bothered
brief bunched burglaries burglary buyer candidate's certainty chances chart classified combination composition
conducted consistently declared defensive distinction distinguished downward experiencing fright garages ignores
impressions informative intake involved league leagues lean listings long-term magnify ministry minus mislead
newspaper's notably occasional opponent overestimate overlap painkiller plausibly player's plus poll polls poorly
prone puzzled quadrupling quantities randomly range ranges rank ranked ranking rankings ratio reactions regression
repeatedly report's reprint resemble reversed sampling scorer select sensible sheds shooter shots sites sleepless
statistically statisticians strokes successful surged surveyed symmetrical team's teammates thefts undecided
underestimate underlying unguarded unstable vertical voters website's
`;

/** workWords are the words of the reading unit writing-at-work that the lexicons lacked. */
const workWords = `
absurdly adjectives after-school alternative apologies applicant applicants arbitrary arises believable boasting
bothering café cancelled circumstances citing commitment communication compensates consideration constantly convenient
coordinator corrections deeply descriptions disappointment durations dwelling employee's employer's ensures
exaggeration excellent extension finance flattery frustrating frustration headed identification impatient impersonal
imposed inbox inclined inconvenience informally instructs interviewers involves layout limiting manager's marketing
naming numbered option organizer posting preferences preparation presenting pressing program's prohibition project's
 recur refunded refusal regards remaining removes reopened reorganized replacement requirements resentment resolves
restrict retaken shortness sincerely soften specificity summaries supplement tone two-year unambiguous unkind
unqualified unresolved unwise vaguely warehouse
`;

/** plansWords are the words of the reading unit plans-that-worked that the lexicons lacked. */
const plansWords = `
accounting activity aims arrangement association association's attractive better-paid biologist blunt bookkeeper bound
chiefly childbirth clinic's committing commuters conservatively contested cooperative corridors costly curriculum
department's desirable devoted diarrhea doubted enthusiasm enthusiastic entire equip expand explicit fifths financed
flooding formalities foundation's fund's funders generously governors hindsight holder holders initial integrate
interactive loading logged lorries maternal narrowly nominal objections one-page openly oversee owner's ownership
panel parallel pastries placing pollination posts potential pregnancy preliminary proposal's qualified questionnaires
quotes rebuilt referred rejection respectful rubbish schemes secured selectively sorted suited thirds timeline tripled
uncertainty users workshop workshops worthy yields
`;

/** lexiconCollege are the words of the passages of the college writing course outside the shared lexicon. */
export const lexiconCollege: readonly LexiconEntry[] = [
  words,
  plansWords,
  workWords,
  researchWords,
  ethicsWords,
  paperWords,
  styleWords,
  numbersWords,
]
  .join(" ")
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
