# Minors' Data

> English | [简体中文](minors-data.zh-CN.md)

This document specifies how Great Academy handles what minors write and say in its first markets: the United States, Canada, Australia, Singapore, Japan, South Korea, Taiwan, Hong Kong, Brazil and mainland China. It says who may use which feature, whose consent it takes, what is kept and for how long, and who receives it. Laws were read in November 2026.

**Status.** The age question, consent, guardian verification, deletion and retention are built for `basic`, and every market stays closed to minors until an administrator opens it ([Admin Console](admin.md)). No lawyer has reviewed any of this, and §13 lists what is still missing. It is the engineering position that [E0.3](english-development-plan.md#2-stage-0-preparation) takes to counsel in each market. It is not legal advice. The numbers marked *starting* are ours, not the law's.

**Two markets differ from the rest.** Mainland China is closed to minors, by the owner's decision, because of legal and structural blocks (§5). Hong Kong opens without AI until a vendor that serves it is registered (§12).

## 1. Principles

1. **Do not collect what the lesson does not need.** Data never collected needs no consent, retention rule or deletion.
2. **Consent before collection, from the guardian, per purpose.** Declining an optional feature never costs the basic course.
3. **Deny by default on the server.** A feature runs only with a current consent on record for this learner, in a market where it is allowed.
4. **One baseline everywhere, the law's differences as data.** Ten markets cannot mean ten products. The baseline takes the strictest common rule wherever that costs little, and market rows change only ages, methods, languages and availability.
5. **Every kind of data has a deletion date,** including transcripts, feedback that quotes a learner, and copies at vendors.
6. **Minors' data teaches that minor and nothing else.** It trains no model and is never used for advertising.
7. **The child can always do less.** A child can turn off a feature, withdraw or ask for deletion alone. Only a guardian can turn on more.

## 2. What Duolingo Does

Read from [its privacy policy](https://www.duolingo.com/privacy), last revised May 26, 2026. This is what the policy says, not what we observed in the app, and doing it at Duolingo's size does not show that it is lawful.

| Area | Duolingo's practice |
| :--- | :--- |
| Who counts as a child | Under 13 in the United States, or the age of digital consent elsewhere. Age is asked at registration; the policy describes no verification |
| Child's account | A username not tied to a real name; no name, email or phone. A parent's email is asked the first time the child logs out, and the parent then gets a notice with how to access, change or delete data |
| COPPA position | Children's data is collected only for internal operations of the service |
| Child's speech | Not used for product improvement. The general rule still applies as written: audio may go to a recognition provider such as Google, Apple or AWS. Speaking activities can be skipped |
| Everyone else's speech | Used for product improvement unless turned off in settings. Never for voice cloning |
| AI features | Text and audio may go to vendors such as OpenAI and Google, which by contract may not use them for their own purposes. Duolingo may store recordings and transcripts and train its own models on them. Users are told not to submit personal information. The policy does not say whether children can use these features |
| Math Tutor | Audio goes only to Apple for recognition and is then deleted at once; the transcript is kept |
| Duolingo ABC, for young children | Set up by a parent, who chooses whether to enable speaking. Speech data stays on the phone, with Apple's recognition; none reaches Duolingo |
| Text between users | Children can send only canned comments. In leaderboards they appear under a random fake name |
| Under 16 | No personalized ads, third-party behavioral tracking or third-party analytics. Session replay is also off for children |
| Retention | Generally until the account is deleted, with no stated period for audio or transcripts; anonymous data indefinitely |
| Schools | A teacher can see a student's name and email and can log in as the student; the student can leave the classroom |

**What we take:** the account with no identity, canned text instead of free text between users, fake names in leagues, skippable speech, the rule against voice cloning, and above all Duolingo ABC's parent-enabled speech and Math Tutor's delete-at-once.

**What we do not take:**

- **A notice after the fact.** Duolingo's account works because it claims to collect almost nothing. We cannot claim that: writing and pronunciation go to vendors and build a record of the learner, so consent comes first.
- **Retention until account deletion.** It is hard to square with the COPPA retention rule and the FTC cases in §3.
- **Training on learners' speech,** even with an opt-out.
- **Asking learners not to submit personal information** as the safeguard. A child will write a name anyway, so the system filters it.

Common Sense rates Duolingo "Warning", on [an undated evaluation](https://privacy.commonsense.org/evaluation/duolingo). We did not confirm whether children can use Video Call.

## 3. What Each Market's Law Requires

"Primary" means we read the law, regulation or regulator's text. "Secondary" means law-firm or press summaries, which counsel must check.

| Market | What matters to us | Read from |
| :--- | :--- | :--- |
| **United States, federal** | COPPA, under 13, amended rule fully in force since April 22, 2026. Parental consent before collecting. [Voiceprints are personal information; a mixed-audience service must ask age neutrally before collecting](https://www.law.cornell.edu/cfr/text/16/312.2). [Separate consent for non-integral disclosure; email or text "plus" only when nothing is disclosed](https://www.law.cornell.edu/cfr/text/16/312.5). [A published retention policy; no indefinite retention](https://www.law.cornell.edu/cfr/text/16/312.10). The [audio exception](https://www.law.cornell.edu/cfr/text/16/312.5) needs no other personal information and deletion immediately after responding, which a logged-in pronunciation task does not meet, so we do not rely on it. [Disclosure to train AI is not integral](https://www.dataprotectionreport.com/2025/06/ftcs-coppa-rule-changes-include-ai-training-consent-requirement/) | Primary |
| **FTC cases** | [Amazon (Alexa)](https://www.ftc.gov/news-events/news/press-releases/2023/05/ftc-doj-charge-amazon-violating-childrens-privacy-law-keeping-kids-alexa-voice-recordings-forever): recordings kept indefinitely, and deletion that left transcripts. [Edmodo](https://www.insideprivacy.com/childrens-privacy/ftc-announces-coppa-settlement-against-ed-tech-provider-including-strict-data-minimization-and-data-retention-requirements/): a retention schedule capped at one year, and [schools cannot consent](https://thejournal.com/articles/2023/06/15/ftc-fines-edmodo-for-illegal-use-of-student-data-and-outsourcing-compliance-to-schools.aspx) for advertising or machine learning | Primary, secondary |
| **United States, states** | [New York](https://ag.ny.gov/sites/default/files/2025-05/nycdpa-guidance.pdf), under 18, since June 20, 2025: for ages 13 to 17, processing needs informed consent unless strictly necessary for the requested service, and the consent screen must say the user can decline and keep the service. [Many other states](https://www.onetrust.com/blog/us-childrens-data-laws-and-consent-what-businesses-need-to-know-in-2026) protect under-18s. [Texas](https://www.ashurstperkinscoie.com/en/insights/supreme-court-green-lights-the-texas-age-verification-law-for-app-stores/) requires app stores to verify age and developers to use the signal; [Utah and California](https://www.recordinglaw.com/us-laws/age-verification-laws/app-store-age-verification-laws/) follow in 2027. Illinois: [a 2026 court](https://www.courthousenews.com/wp-content/uploads/2026/06/delgado-v-meta-unsealed-summary-judgment-order.pdf) left open where a recording becomes a voiceprint and rejected any need for an enrollment step | New York primary; others secondary |
| **Canada** | Quebec: [parents consent under 14](https://www.dialoginsight.com/en/blog/law-25-en/impact-of-law-25-on-consents). Federal: the [Children's Privacy Code](https://www.bennettjones.com/Insights/Blogs/2026/11/The-New-Canadian-Childrens-Privacy-Code) of October 20, 2026 is guidance, open for comment until January 20, 2027: parents consent under 13, capacity assessed from 13 to 18, opt-in for non-essential uses, protective defaults, no inferring emotions. [British Columbia](https://www.osler.com/en/insights/updates/insights-into-canadas-development-of-childrens-privacy-framework/?pdf=1) says the usual age is 12 | Secondary; the OPC's page could not be read |
| **Australia** | [Exposure draft](https://www.oaic.gov.au/__data/assets/pdf_file/0020/262631/Exposure-Draft-Childrens-Online-Privacy-Code.pdf) of the Children's Online Privacy Code, under 18, [due by December 10, 2026](https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code), not yet registered, no education exemption. Ascertain age before collecting, or apply the code to everyone (s 8). Only what is strictly necessary by default (s 9). Best interests (ss 10, 11). Parents consent under 15 and the child gets a notice (s 13); no bundled consent (s 14); consent has a stated period and expires (s 16); child assent for sensitive information (s 20). Deletion at the request of the child or parent (s 32). Tell the child about parental monitoring (s 33). Mandatory impact assessment (s 38). [AI that can generate restricted material must check age](https://www.esafety.gov.au/sites/default/files/2026-03/Age-Restricted-Material-Codes-fact-sheet-March2026.pdf) | Primary for the draft |
| **Singapore** | [PDPC guidelines](https://www.nortonrosefulbright.com/en/knowledge/publications/9a61f19c/the-protection-of-childrens-personal-data-in-the-digital-environment), under 18: parents consent under 13; from 13 a child can consent if they understand. Accounts not public by default; no national IDs for age assurance; impact assessment encouraged; a breach is notified to the child and, where known, the parent. [Not binding, but the PDPC is likely to read the law this way](https://www.zwillgen.com/privacy/singapore-issues-childrens-privacy-guidelines/) | Secondary; the PDF could not be read |
| **Japan** | The [amended privacy act](https://japancyberwatch.com/articles/japan-appi-amendment-2026) was promulgated on July 17, 2026, with these rules by July 2028: under 16, consent and notices go to the legal representative; deletion or stopping without showing a violation; the child's best interests come first. Current [guidance](https://childreninthedigitalworld.twobirds.com/home/japan) treats ages of about 12 to 15 as generally needing the representative. Its new biometric rules are described in terms of face data; voice is not confirmed | Secondary |
| **South Korea** | Privacy act [Art. 22-2](https://prighter.com/resources/laws/korean-pipa/main/articles/article-22-2): under 14, the legal representative consents and the operator confirms it; plain notices. [Decree Art. 17-2](https://prighter.com/resources/laws/korean-pipa/enforcement-decree/articles/article-17-2) lists the methods: a site request with a text message, card, mobile identity check, signed document, email, phone. The [AI Basic Act](https://securiti.ai/south-korea-basic-act-on-development-of-ai/), since January 22, 2026, lists student evaluation as high-impact, and [requires explanation, human oversight and notice of AI use](https://www.cooley.com/news/insight/2026/2026-01-27-south-koreas-ai-basic-act-overview-and-key-takeaways), with a one-year grace on fines. Its local-agent duty starts at thresholds far above ours; the privacy act's is unconfirmed | Secondary, from search excerpts of the articles |
| **Taiwan** | The [privacy act](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=I0050021), amended November 11, 2025, does not address minors; breach notice and reporting (Art. 12); it reaches agencies abroad handling nationals' data (Art. 51). The [Civil Code](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000001): adult at 18; ages 7 to 17 generally need approval for legal acts (Arts. 12, 13, 77). Whether a child can consent [is contested](https://lawreview.law.nycu.edu.tw/en/legal-study-on-childrens-data-protection-legislation-under-digital-environment-from-the-perspective-of-us-childrens-online-privacy-protection-act/). [Children's welfare amendments](https://www.taipeitimes.com/News/taiwan/archives/2026/03/26/2003854497) are pending | Primary for the acts |
| **Hong Kong** | [No statute on children's consent](https://childreninthedigitalworld.twobirds.com/home/hong-kong). Where the ordinance needs consent, a person under 18 cannot give it; a parent does. Children can exercise rights and complain on their own. Regulator guidance recommends parental approval and child-friendly notices | Secondary |
| **Brazil** | The [Digital ECA](https://www.unicef.org/brazil/estatuto-digital-da-crianca-e-do-adolescente-eca-digital), since March 2026, applies to services likely to be accessed by minors, wherever operated. Most protective defaults (Art. 7); take age signals from stores and keep own mechanisms (Art. 14); impact report (Art. 16); parental tools, a visible notice while supervision is on, time limits (Art. 17); settings and usage visible to parents, in Portuguese (Art. 18); no profiling for ads or emotion analysis for that purpose (Arts. 22, 26); under-16 linking for social networks (Art. 24); a legal representative in Brazil (Art. 40). The self-declaration ban covers improper content (Art. 9), which we do not have. [Fines to BRL 50 million](https://digitalpolicyalert.org/event/34356-national-data-protection-authority-outlined-regulatory-and-supervisory-measures-for-implementing-law-no-152112025). The [LGPD's Art. 14](https://confidata.com.br/blog/lgpd-comentada-10-criancas-adolescentes): best interests; under 12, specific parental consent with reasonable efforts to confirm it; no access conditioned on data beyond what is strictly necessary | UNICEF Brazil's copy of the text; the official site blocked us |
| **Mainland China** | See §5 | Primary in part |

Not checked: other US states one by one, Quebec's rules beyond consent age, each market's breach deadlines and cross-border transfer rules in detail, and whether Korea's age of majority or Canadian provinces' differ from the 18 used here.

**Our service counts as directed to children.** It has courses from the early grades, and English's first slice is for grades 3 to 8. An age question alone does not take it outside these laws.

## 4. Market Rows

`guardian below` is the age under which a guardian must consent. We take the highest age that a market's law or regulator's text may require, because the error costs little: a guardian's click. Where we go above the law, the row says so.

| Market | Status | Guardian below | Why this age | Needed before launch, beyond the baseline |
| :--- | :--- | :--- | :--- | :--- |
| United States | Open | 13 | COPPA | Illinois treated as if biometric law applies (§9); New York wording for teens' consent; store age signals |
| Canada | Open | 14 | Quebec; federal 13. We do not ask for the province | French for notices in Quebec (to confirm) |
| Australia | Open | 15 | Draft s 13 | Registered code checked against this document; child's assent and notice |
| Singapore | Open | 13 | PDPC guidelines; from 13 only if the notice is understood | None known |
| Japan | Open | 16 | Amended act; today's guidance is lower | Japanese notices |
| South Korea | Open | 14 | Art. 22-2 | Korean notices; a Decree Art. 17-2 method; AI explanation and human review (§8) |
| Taiwan | Open | 18 | Civil Code and contested capacity; our cautious reading | Traditional Chinese notices |
| Hong Kong | Open without AI | 18 | Bird & Bird's reading of the ordinance | Traditional Chinese notices; `writing`, `speech` with AI, `conversation` wait for a vendor (§12) |
| Brazil | Open | 16 | Parents consent under 12 by law. 16 matches the Digital ECA's linking age and is above the law | Portuguese notices and guardian pages; a legal representative |
| Mainland China | **Not open to minors** | 14; all under-18s protected | PIPL | §5 |
| Anywhere else | Closed for minors | Not applicable | Not researched | A row, after research |

A market not listed is closed to minors. The European Union and the United Kingdom need rows of their own before opening. Age bands are:

| Band | Who | Account |
| :--- | :--- | :--- |
| **Child** | Below `guardian below` | Created by a guardian; no email or real name |
| **Teen** | From that age to 17 | Own account, with the protective defaults of §7 |
| **Adult** | 18 or older | As today |

- **Asking.** Sign-up asks for the country and for month and year of birth, with no default and no hint of why. Below the age, sign-up stops and shows a page to hand to an adult. We take no email or other contact from the child, which is simpler than the exceptions some laws allow. A retry from that browser does not change the answer.
- **Other signals.** Age signals from app stores and operating systems, where the law provides them, are also inputs; the younger answer wins. A guardian's statement or a teacher's report can move a learner to a younger band, never older.
- **Storing.** We keep the band, the date it ends and the country, not the birth date, and we delete store signals after use.
- **Turning older.** A band that ends widens nothing by itself. The learner gets a notice and chooses again.
- **Moving.** A learner who moves country takes the stricter of the two rows until the next consent.
- **No documents from children.** Collecting IDs from children would create the risk we are avoiding, and Singapore advises against it. Guardians prove who they are; children do not.

## 5. Mainland China

**Decision: not open to minors.** The owner chose this on November 6, 2026. On what we could read, the current product and company cannot lawfully serve minors there. That needs Chinese counsel to confirm, but privacy mechanisms do not fix it.

| Block | What we read |
| :--- | :--- |
| Subject tutoring | The [2021 "double reduction" opinion](https://www.gov.cn/zhengce/2021-07/24/content_5627132.htm): no new subject-tutoring institutions for grades 1 to 9, existing ones are non-profit; online ones need approval; no new ones for senior high; no online training for preschool children; online lessons at most 30 minutes, ending by 21:00. [Mathematics and foreign languages count as subjects](https://www.chinanews.com.cn/gn/2021/11-21/9613283.shtml). A [2024 draft regulation](https://edu.sh.gov.cn/mbjy_xwzx/20240218/88f7bf4c154142a6ae45ea0c466bc3c3.html) is still all we found, so the opinion stands |
| Foreign capital | The same opinion bars foreign capital from controlling or holding shares in these institutions, including through VIE structures. [Compulsory education is closed to foreign investment](https://www.kingandwood.com/cn/en/insights/latest-thinking/china-tightens-regulation-for-online-education.html) (2019 article) |
| Apps | [Beijing's filing rules](https://www.jiemian.com/article/7443536.html) stop preschool training apps; a draft required subject-tutoring app providers to be non-profit. Whether an adaptive self-study app is "training" is the open question for counsel |
| Licence | A commercial ICP licence normally needs a [Chinese partner, with foreign ownership capped at 50%](https://www.china-briefing.com/news/china-internet-business-licenses-foreign-companies/). [Cloudflare's China Network needs an ICP number per domain and runs through JD Cloud](https://developers.cloudflare.com/china-network/concepts/icp/index.md); whether Workers run there is unconfirmed |
| Vendors | [OpenAI](https://developers.openai.com/api/docs/supported-countries) and [Anthropic](https://www.anthropic.com/supported-countries) do not serve China. Generative AI there needs domestic models, and filings we did not confirm for 2026. [Azure operated by 21Vianet lists pronunciation assessment](https://docs.azure.cn/en-us/ai-services/speech-service/regions) |
| Data | All data of [an under-14 is sensitive and needs guardian consent](https://www.mofo.com/pdf/resources/insights/210908-chinas-personal-information-protection-law). [Sending sensitive data abroad](https://www.hankunlaw.com/portal/article/index/cid/8/id/14064.html) needs a standard contract or certification, and a security assessment from 10,000 people. The [Minors' Online Protection Regulations](https://www.gov.cn/zhengce/content/202310/content_6911288.htm) add Arts. 32, 34 to 38: no refusing basics over optional consent; access, copy, correct, delete; breach reports; approved and logged staff access; a yearly audit reported to regulators; police report if private information suggests harm |
| AI conversation | The [2026 measures on human-like AI](https://www.lw.com/en/insights/china-introduces-rules-for-ai-companion-and-emotional-interaction-services) exclude education with no ongoing emotional interaction, so S6 must not have a companion persona; they ban virtual-intimate services for minors. A [further draft](https://www.caixinglobal.com/2026-09-21/china-seeks-to-protect-minors-with-proposed-ai-rules-102487250.html) was published in September 2026 |

**Option A is in force. B and C record what reopening the question would take; none of them is a setting:**

| Option | What it takes | Reach |
| :--- | :--- | :--- |
| **A. Do not open to minors** (adopted) | No listing in Chinese app stores, no Chinese payment, no marketing there; country "China" closes sign-up for under-18s | Chinese speakers elsewhere are served normally |
| **B. Adults only** | A Chinese entity or partner, ICP, generative AI filings, a separate deployment and vendors. Under-18s stay blocked by a real age check | Adults in China |
| **C. Licensed partner for minors** | A Chinese non-profit-qualified institution operates its own service with our content, if counsel finds a lawful form. Data stays there; we receive none | Minors, at most in non-subject content, or in provinces that approve |

Hosting abroad and serving minors anyway is not an option: it leaves the rules above in place and adds cross-border transfer of sensitive data, and [regulators' reach over Chinese consumers remains](https://www.kingandwood.com/cn/en/insights/latest-thinking/china-tightens-regulation-for-online-education.html). A separate Chinese deployment would also duplicate the stack, since `markets` cannot carry a different vendor set, region, regulator reporting and retention law across the same database.

**Company ownership.** Anthropic [may refuse entities majority-owned from unsupported regions](https://anthropic.com/supported-countries). Any structure with a Chinese parent must be checked against this before it is adopted.

## 6. Accounts and Consent

**The guardian comes first.** An adult creates their own account, proves they are an adult who can consent, and adds a child's profile with a username and password. The child never gives an email or a name. This reverses today's guardian link, where a learner invites a guardian, which remains as an optional view for teens.

**Proving it once.** One method is accepted in every open market, so that we build one flow:

| Method | Works for | Note |
| :--- | :--- | :--- |
| **Card or wallet transaction that notifies the holder** | US, Korea listed; "reasonable" elsewhere | The intended default, once a payment processor is chosen. It handles the card; we store only the result |
| **Signed form, scanned or mailed** | US, Korea listed; "reasonable" elsewhere | The fallback, the method for the pilot, and the only method built so far. A person reviews the upload, which is deleted once decided |
| **Mobile identity check** | Korea | Added only if Korean guardians need it |

Email plus is not used: it fails in the US once anything is disclosed, and two flows cost more than one. Whether one verification can cover scopes added later by the same signed-in guardian is a question for counsel.

**Each purpose has its own consent:**

| Scope | Enables | Goes to vendors | Default for a child |
| :--- | :--- | :--- | :--- |
| `basic` | Lessons and rule-judged answers | Hosting and email only | Off until consent |
| `writing` | AI-judged writing (E3) | AI model | Off |
| `speech` | Recording, S2 to S5 (E4, E5.1) | Speech services, AI model | Off |
| `conversation` | S6 (E5) | Speech services, AI model | Off, and not offered until counsel agrees |
| `research` | Calibration sets rated by people | Raters | Off; signed form per collection |

- **The record.** Consent is append-only: learner, scope, guardian, method, notice version, country, granted, expires and withdrawn times.
- **Separate choices.** Every scope is its own screen, never bundled, and says what happens if refused. Refusing any scope but `basic` keeps the course: a task that needs a missing scope is not offered, and the learner continues around it, as [the design](english-curriculum.md) already requires for speech.
- **Expiry.** A consent states its period: 12 months *starting*, with a reminder, then the feature stops and its data is deleted. This follows Australia's draft s 16, and also catches guardians who forget.
- **Withdrawal** is as easy as granting, by the guardian or the child, and deletes what that scope produced.
- **New vendor or purpose:** a new notice version and new consent.
- **The child's own notice.** An age-appropriate notice tells the child what is on, why, for how long and how to turn it off, and that a guardian can see their progress. Before `speech`, `writing` or `research` starts, the child is asked too, since Australia's draft s 20 requires assent and it is right everywhere. If the child says no, the feature stays off.
- **Teens** consent for themselves, on a screen that says the service continues if they decline, as New York requires. `speech` and `conversation` stay off until they turn them on. They get an optional guardian view only if they invite one, and see when it is on.
- **Schools** cannot consent beyond their educational purpose, and we have no agreements with them. Classes and teacher roles are not offered to minors until counsel has reviewed each market.

**Languages.** Notices, consent screens and guardian pages must be understood by the people reading them: Traditional Chinese, Japanese, Korean and Portuguese at least, and French to confirm. The product's locales are English and Simplified Chinese, so this is new work. Human-translated legal text ships ahead of any course translation. Whether the course itself must be offered in those languages depends on who it is sold to, and a child who cannot read the notice cannot assent.

## 7. Features by Band

| Feature | Child | Teen |
| :--- | :--- | :--- |
| Lessons, reviews, quizzes, reading | With `basic` | On |
| AI-judged writing | With `writing`, topics that do not ask about oneself | On, after a notice |
| Recorded speech | With `speech` | Off until turned on |
| Conversation | Off | Off until turned on |
| Leagues | Off; if opened later, a random name and no profile | Off until turned on, username only |
| Streak reminders and other nudges | Off | Off until turned on; never at night |
| Guardian time limit | Available | With a guardian view |
| Free text between users | Never | Never |
| Advertising, third-party trackers, session replay | Never | Never |
| Training any model, voiceprints, voice cloning, emotion or personality inference | Never | Never |

The learning engine profiles a learner, but in the learner's interest: choosing what to study is the service they asked for. Using it to keep them in the app longer is not, as Canada's code says, so engagement features start off for minors. Brazil's Art. 17 requires the time limit. No random rewards are sold.

We tell learners in their own words when an AI is judging or talking to them, which Korea requires as well.

## 8. AI Verdicts

Korea lists student evaluation as high-impact. The same logic is why AI that scores a learner must stay reviewable everywhere:

- An AI verdict that changes mastery is logged with its model, rubric version and score.
- The learner can see the reasons in words and ask for a person to review. A person's decision overrides.
- Consistent bias is checked before launch by language background, as the English plan already requires.
- A summary of the training data of the models we use, and their purposes, is available on request, to the extent the vendor gives it.
- Children's mastery is not gated by AI alone until counsel has answered question 5 in §13. Rule-judged items can establish it, and AI verdicts add to it.

## 9. Text and Speech

**Text.**

- **Prompts avoid personal topics.** Items ask about the given text or a made-up situation, not "describe your family".
- **Filter first.** Before text leaves the platform or reaches a person, emails, phone numbers, addresses, handles and likely names are replaced with placeholders. The filter is checked on samples in each language before launch. It will miss some, so a miss is not treated as harmless.
- **Model calls.** Only vendors of §12, no gateway logging of the text, no caching. The prompt holds the filtered text and no account data.
- **Events hold no text.** Replay needs scores, so the event log stores ids and scores. The response lives in `answer`, or a writing table, where it can expire without touching the learner's state.
- **People who read text.** Pilot reports aggregate responses with no learner identity. Staff access is approved and logged.

**Speech.**

1. **Local first.** Where the device can recognize speech itself, audio does not leave it, as in Duolingo ABC.
2. **Otherwise streamed, not stored.** Prefer real-time services that keep nothing. [Microsoft states](https://learn.microsoft.com/legal/cognitive-services/speech-service/speech-to-text/data-privacy-security) that real-time recognition and pronunciation assessment retain no customer data.
3. **When a file is needed,** it goes to R2 by a short-lived URL, is deleted as soon as it is judged, and a lifecycle rule removes anything left within a day. The voice service keeps no audio, as designed.
4. **Before recording:** the learner sees a recording indicator and can skip without penalty. Nothing records in the background, and prompts do not ask for names.
5. **Never:** a voice stored as a profile, recognition of who is speaking, speaker embeddings kept by us or a vendor, or inference of emotion, health or age. A vendor's contract must say this.
6. **As if biometric.** The Illinois question is open and penalties there are private suits, so in every market the `speech` consent is written, names the vendor, and links the published retention schedule. This costs almost nothing.
7. **Calibration.** Clips of children (E4.6) are collected only under `research`, with a separate form saying who rates them and when they are destroyed, and are never mixed with learners' recordings.

**Signs of harm** in writing or speech go to a review path. It must exist before E3. Duties differ: China's Art. 38 requires reporting to police in some cases, and others are unknown (§13).

## 10. Retention and Deletion

| Data | Child | Teen | After that |
| :--- | :--- | :--- | :--- |
| Audio | Until judged, at most 1 day | The same | Deleted |
| Transcripts | 30 days *starting* | 30 days *starting* | Scores remain |
| Conversation transcripts | Not kept | 30 days *starting* | Deleted |
| Free text in `answer.response` | 90 days *starting* | 1 year *starting* | Emptied; correct or not remains |
| Essays and feedback quoting them | 1 year *starting* | 1 year *starting* | Deleted; scores remain |
| Progress: events, state, whether answers were right | While active | While active | Deleted with the account |
| IP addresses in logs | 30 days | 30 days | Deleted |
| Consent records | Account's life, plus a period counsel sets per market | The same | Deleted |
| Inactive account | 12 months *starting*, then a notice, then 30 days | The same | Deleted |

- **Deleting means everywhere.** One function covers database tables, transcripts, feedback, R2 and vendor copies, and a test checks that nothing of a deleted learner remains. Backups age out within a stated window. The Alexa case is why transcripts are named here.
- **Who can act, without email.** A guardian can see, export and delete by kind of data, and delete the whole profile. A child can delete their own account's optional data, as Australia's draft, Japan's amendment and Hong Kong's rights allow, and the guardian is told. Self-service takes effect at once; a written reply, with reasons if refused, within 30 days.
- **After 18.** Data gathered while a minor keeps these limits unless the adult consents anew, as New York requires.
- **Anonymized does not mean exempt.** Text and voice are hard to anonymize, so neither is kept as "anonymous data". Only aggregate counts are.
- A published retention policy states purposes, business need and these timeframes, as COPPA requires.

## 11. Duties Regardless of Features

- **Impact assessment** before launch and before each new scope. One document covers Australia's s 38, Brazil's Art. 16, US state assessments and Canada's expectation, with market annexes, and a register of assessments.
- **Breach playbook.** Named owner, a table of each market's regulator and shortest deadline, and notice to child and guardian in their language. The deadlines must be collected first; only Taiwan's and Singapore's duties were read.
- **Staff access.** Least privilege, approval and logs, as China's Art. 36 requires and which we apply everywhere. An annual internal audit.
- **Representatives.** Brazil requires one. Korea's privacy act and others are to be confirmed. Each is a contract, not code.
- **Published pages.** Privacy notice, children's notice, retention policy, vendor list with countries, and a contact, in each market's languages. A child-friendly way to ask and complain, as Australia's draft requires.
- **The legal entity.** Which company contracts with learners decides the vendor terms, the transfer rules and who is responsible. This is undecided.

## 12. Vendors

**No vendor is chosen.** Model calls go through pi-ai, and a platform administrator configures providers and routes in an [admin console](english-curriculum.md#131-ai-models). Configuration chooses among vendors; it does not relax these rules.

A vendor receives minors' data only if its contract and settings give all of these, recorded in a register with the date checked:

- It serves the market where the learner is.
- Its terms allow minors' data, and we meet its conditions.
- Zero retention, or a stated short period, with no training.
- A data processing agreement and a lawful transfer mechanism for that market.
- A named region.

The server enforces the register whenever it uses a route, including a backup:

- **Unregistered or stale.** A vendor with no entry for the learner's market, or whose check has expired (12 months *starting*), gets no minor's data. The feature is off for that learner, and the course continues.
- **Consent names the vendor.** A minor's data goes only to vendors named in the notice version that the consent covers, so a backup must be named as well. Configuring a new vendor does not reach minors until the notice changes and consent is given again (§6).
- **Logged.** Every change to the register is logged, with who made it.

These are candidates we have read about, not choices:

| Candidate | What we know | To check |
| :--- | :--- | :--- |
| OpenAI API | [Serves all open markets but Hong Kong](https://developers.openai.com/api/docs/supported-countries). [Requires zero data retention](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance) for under-13s or the consent age | Contract |
| Anthropic API | [Serves all open markets but Hong Kong](https://www.anthropic.com/supported-countries), policy effective November 12, 2026. [Allows organizations to serve minors](https://support.claude.com/en/articles/9307344) with age assurance, moderation, monitoring, AI disclosure and a public statement of compliance | Whether zero retention is available to us |
| Azure AI Speech | See §9 | Contract, regions per market |
| Azure OpenAI in Hong Kong | [Microsoft said it served eligible customers there](https://sg.finance.yahoo.com/news/microsoft-maintains-ai-services-hong-093000823.html); undated, and terms not read | Whether it still does, and for minors |
| Other speech and AI vendors, pi-ai routes, AI Gateway | Not checked | Each one, before use |
| Cloudflare, PostgreSQL host, Resend, payment processor | Not checked | Agreements, regions |

**Hong Kong.** A vendor's region policy looks at where the user is. Routing a Hong Kong learner through our servers elsewhere would break it, so we do not. Hong Kong opens with `basic` and rule-judged work; AI scopes open when a vendor that serves Hong Kong and accepts minors' data is in the register.

## 13. Enforcement in Code, and What Comes When

- **`learner`** gains band, band end and country. A new append-only **`consent`** table holds §6.
- **`markets`**, a pure data table in `libs/api`, gives each country its status, guardian age, allowed scopes and required notice languages. An unlisted country is closed to minors. Vendors are not in it: they are in the register of §12, which administrators maintain.
- **One gate.** `StartTask` and every call that accepts text or audio ask `libs/api` for the learner's capabilities and refuse otherwise. A market's status is a rule in the code; whether it is open to minors is a switch in the [admin console](admin.md#4-markets). `nextTasks` receives the allowed task kinds as data, so that the engine stays pure and subject-agnostic, from E3 on: until then every task kind needs only `basic`.
- **Retention and consent expiry** run from a daily Cron Trigger and are testable with an explicit time.
- **Logs** hold ids, never responses or transcripts. A test feeds marked text through a task and asserts that it appears in no log or event.
- **Staff access** to minors' text goes through an audited tool, not direct SQL in production.
- **Withdrawing `basic`** stops study and empties the text of past answers. Progress stays until the account is deleted, or until the inactivity rule of §10 deletes it.

**Gaps today.** Card verification is not built, and the native app (`apps/nsh`) asks the age question and stops where the rules stop, but has no consent screens or settings, so those still happen on the web; it also keeps the session token in a plain file, which must change before release. The `/legal` pages are drafts that counsel has not read, in English and Simplified Chinese only, so the other notice languages are missing. Store age signals, the impact assessment and the marked-text log test do not exist yet, nor does the audited staff tool. AI scopes can be consented to only once a vendor has a live route, and no code calls a vendor yet: pi-ai and `tools/calibrate` arrive with E3.

| Before | Needed | Size |
| :--- | :--- | :--- |
| **English pilot (E1.6)** | In one open market, not China: signed guardian forms stating purpose, access and deletion date; accounts made by the team, with pseudonyms; the notice in the market's language; reports read only by named people; data deleted at the stated date. No new code beyond the deletion | S |
| **Public sign-up to minors (any subject)** | Counsel's review of the pages and rows, the impact assessment, translated legal text per market, representatives, card verification where wanted, the age flow in the native app; then each market's switch | L |
| **AI writing (E3)** | `writing` consent, §8, §9, vendor register, per-market check | M |
| **Recording (E4)** | `speech` consent, §9, deletion test across R2 and transcripts, `research` form for E4.6 | M |
| **Conversation (E5)** | `conversation` consent, safety review path, end-to-end test of no retention | M |
| **Reopening mainland China** | A new decision by the owner on §5, with Chinese counsel | Separate project |

Markets need not open together. The baseline is shared, so each opens when its row is met: its notices translated and counsel's sign-off given.

**Questions for counsel, in each market:**

1. Is our row correct, including the age of majority? Korea and some Canadian provinces may differ from 18.
2. Is using speech and AI vendors "integral" under COPPA, and is card or signed form sufficient everywhere? Does one verification cover scopes added later?
3. Are recordings with no voiceprint biometric data, including in Illinois and under Japan's new category?
4. Are the retention periods in §10 defensible? How long must consent records be kept?
5. Does AI judging make us high-impact in Korea, and what does it take there? Do similar rules apply elsewhere?
6. What must we do when a child's text shows possible harm?
7. Must the course itself, and not only the notices, be in the local language?
8. What do schools need before they can be offered?
9. Which representatives, registrations and breach deadlines apply to a company of our size, from where the legal entity is?
10. **China:** is a self-study adaptive app "subject training"? Is any option in §5 lawful, for which ages and subjects? How do we show we are not offering services there under option A?
