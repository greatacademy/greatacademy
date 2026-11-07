# Minors' Data

> English | [简体中文](minors-data.zh-CN.md)

This document specifies how Great Academy handles what minors write and say: who may use which feature, whose consent it takes, what is kept and for how long, and who receives it. It is based on what Duolingo publishes and on the laws read in November 2026.

**Status.** None of this is built, and no lawyer has reviewed it. It is the engineering position that [E0.3](english-development-plan.md#2-stage-0-preparation) takes to counsel. It is not legal advice. The numbers marked *starting* are ours, not the law's.

## 1. Principles

1. **Do not collect what the lesson does not need.** Data never collected needs no consent, retention rule or deletion.
2. **Consent before collection, from the guardian, per purpose.** Declining an optional feature never costs the basic course.
3. **Deny by default on the server.** A feature runs only with a consent on record for this learner, in this market.
4. **Every kind of data has a deletion date,** including derived data: transcripts, feedback that quotes a learner, and copies at vendors.
5. **Minors' data teaches that minor and nothing else.** It trains no model, ours or a vendor's, and it is never used for advertising.

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
- **Retention until account deletion.** It is hard to square with the COPPA retention rule and the two FTC cases in §3.
- **Training on learners' speech,** even with an opt-out.
- **Asking learners not to submit personal information** as the safeguard. A child will write a name anyway, so the system filters it.

Common Sense rates Duolingo "Warning", on [an undated evaluation](https://privacy.commonsense.org/evaluation/duolingo). We could not read a school's impact assessment that search results cite, and we did not confirm whether children can use Video Call.

## 3. What the Law Requires

| Regime | What matters to us |
| :--- | :--- |
| **COPPA** (US, under 13), amended rule in force since April 22, 2026 | Verifiable parental consent before collecting. [Voiceprints are personal information](https://www.law.cornell.edu/cfr/text/16/312.2). A child-directed service with a mixed audience must ask age neutrally, with no default, before collecting anything. [Separate consent for non-integral disclosure](https://www.law.cornell.edu/cfr/text/16/312.5), and email or text "plus" only when nothing is disclosed. [A written retention policy, published, with deletion timeframes; no indefinite retention](https://www.law.cornell.edu/cfr/text/16/312.10). The FTC [says](https://www.dataprotectionreport.com/2025/06/ftcs-coppa-rule-changes-include-ai-training-consent-requirement/) that disclosure to train AI is not integral |
| **FTC voice policy** (2017) | [No enforcement](https://www.ftc.gov/news-events/news/press-releases/2017/10/ftc-provides-additional-guidance-coppa-voice-recordings) for audio used only to replace written words, held briefly and for no other use. Scoring pronunciation or fluency is another use, so we do not rely on it (our reading; for counsel) |
| **FTC v. Amazon (Alexa, 2023)** | [Alleged](https://www.ftc.gov/news-events/news/press-releases/2023/05/ftc-doj-charge-amazon-violating-childrens-privacy-law-keeping-kids-alexa-voice-recordings-forever): recordings kept indefinitely and used to train speech recognition; deletion requests that left transcripts behind. Proposed penalty of $25 million |
| **FTC v. Edmodo (2023)** | [An edtech order](https://www.insideprivacy.com/childrens-privacy/ftc-announces-coppa-settlement-against-ed-tech-provider-including-strict-data-minimization-and-data-retention-requirements/): a retention schedule with a one-year maximum, after two years of inactivity was found unjustified. [Schools could not consent](https://thejournal.com/articles/2023/06/15/ftc-fines-edmodo-for-illegal-use-of-student-data-and-outsourcing-compliance-to-schools.aspx) for advertising or machine learning |
| **US states** | [Many now protect all under-18s](https://www.onetrust.com/blog/us-childrens-data-laws-and-consent-what-businesses-need-to-know-in-2026), with [assessments for minors' data](https://www.insideprivacy.com/childrens-privacy/state-and-federal-developments-in-minors-privacy-in-2026/) in places such as Virginia. Not checked state by state; Illinois' biometric law was not checked at all |
| **GDPR** | Consent age [between 13 and 16 by country](https://sota.io/blog/gdpr-art-8-childrens-consent-age-verification-parental-authorization-digital-services-developer-guide-2026), which we did not confirm from a complete official table. A voiceprint is special-category data [when used to identify someone](https://www.pearlcohen.com/edpb-issues-draft-guidance-on-virtual-voice-assistants/) (draft guidance); we never identify anyone by voice. An impact assessment and an EU representative are expected (from memory; for counsel) |
| **UK Children's Code** | [15 standards for all under-18s](https://www.taylorwessing.com/en/insights-and-events/insights/2020/02/ico-publishes-age-appropriate-design-code-of-practice) on services likely to be accessed by them, with high-privacy defaults. Read through secondary sources from 2020 and 2021; the ICO's page could not be fetched, so check for later changes |
| **EU AI Act** | [Annex III](https://artificialintelligenceact.eu/annex/3/) lists AI that evaluates learning outcomes, including when results steer learning, as high-risk. So AI verdicts that gate mastery probably are. [Reported](https://pasqualepillitteri.it/en/news/5190/digital-omnibus-ai-act-eu-parliament) to apply from December 2027; final adoption not confirmed. Inferring emotions in education is prohibited (from memory; for counsel) |
| **China** | PIPL: [all data of an under-14 is sensitive, and needs guardian consent and dedicated rules](https://www.mofo.com/pdf/resources/insights/210908-chinas-personal-information-protection-law). [Regulations on Minors' Online Protection](https://www.gov.cn/zhengce/content/202310/content_6911288.htm), under 18: no refusing basic functions over optional consent (Art. 32), guardian access and deletion (Art. 34), breach reporting (Art. 35), approved and logged staff access (Art. 36), a yearly compliance audit (Art. 37). Mainland China is not a target market, but these apply if we offer the service there |

Not researched yet: Hong Kong, Taiwan, Singapore, Canada, Australia, Japan, Korea and Brazil. Several matter because many of our learners speak Chinese. Learners are governed by where they live, not by their language.

**Our service counts as directed to children.** It has courses from the early grades, and English's first slice is for grades 3 to 8. An age question alone does not take it outside COPPA.

## 4. Age Bands

| Band | Who | Account |
| :--- | :--- | :--- |
| **Child** | Below the market's consent age (`markets` table): 13 in the US and UK, up to 16 in the EU, 14 in China | Created by a guardian; no email or real name |
| **Teen** | From that age to 17 | Own account, with protective defaults (§6) |
| **Adult** | 18 or older | As today |

- **Asking.** Sign-up first asks for month and year of birth, with no default and no hint of why, and for the country, preset from the connection. A learner below consent age is sent to the guardian flow, and a retry from that browser does not change the answer.
- **Storing.** We keep the band, the date it ends and the country, not the birth date.
- **Unknown country:** consent age 16.
- **Turning older.** A band that ends never widens anything by itself. The learner gets a notice and chooses again.
- **No verification by documents.** Collecting IDs from children would create the risk we are avoiding. Guardians prove who they are; children do not.

## 5. Accounts and Consent

**The guardian comes first.** An adult creates their own account and adds a child's profile with a username and password. The child never gives an email or a name. This reverses today's guardian link, where a learner invites a guardian, which remains for teens.

**Each purpose has its own consent:**

| Scope | Enables | Goes to vendors | Method |
| :--- | :--- | :--- | :--- |
| `basic` | Lessons and rule-judged answers | No, beyond hosting and email | Email plus; a signed form in the pilot |
| `writing` | AI-judged writing (E3) | AI model | Signed form or a payment-card transaction |
| `speech` | Recording, S2 to S5 (E4, E5.1) | Speech services, AI model | The same |
| `conversation` | S6 (E5) | Speech services, AI model | The same; off for children unless counsel agrees |
| `research` | Calibration sets rated by people | Raters | Signed form, per collection |

- Consent records are append-only: learner, scope, guardian, method, notice version, country, granted and withdrawn times.
- A guardian may refuse or withdraw any scope but `basic` and keep the course. A task that needs a missing scope is not offered, and the learner continues around it, as [the design](english-curriculum.md) already requires for speech.
- Withdrawing also deletes what that scope produced.
- A new vendor or purpose means a new notice version and new consent.
- Teens consent for themselves, and `speech` and `conversation` stay off until they turn them on. Where a market needs a guardian for a teen, its row says so.

**Schools.** A school cannot consent to anything beyond its educational purpose, and we have no agreements with schools. Classes and teacher roles are not offered to minors until counsel has reviewed them.

## 6. Features by Band

| Feature | Child | Teen |
| :--- | :--- | :--- |
| Lessons, reviews, quizzes, reading | With `basic` | On |
| AI-judged writing | With `writing`, topics that do not ask about oneself | On, after a notice |
| Recorded speech | With `speech` | Off until turned on |
| Conversation | Off | Off until turned on |
| Leagues | Off; if opened later, a random name and no profile | Off until turned on, username only |
| Free text between users | Never | Never |
| Advertising, third-party trackers, session replay | Never | Never |
| Training any model, voiceprints, voice cloning, emotion or personality inference | Never | Never |

We tell learners in their own words when an AI is judging or talking to them.

## 7. Text

- **Prompts avoid personal topics.** Items ask about the given text or a made-up situation, not "describe your family".
- **Filter first.** Before text leaves the platform, or reaches a person, emails, phone numbers, addresses, handles and likely names are replaced with placeholders. The filter is checked on samples before each launch, and a miss must not be treated as harmless, since it does not catch everything.
- **Model calls.** Only vendors of §10, no gateway logging of the text, no caching. The prompt holds the filtered text and no account data.
- **Events hold no text.** Replay needs scores, so the event log stores ids and scores. The response lives in `answer`, or a writing table, where it can expire without touching the learner's state.
- **People who read text.** Pilot reports aggregate responses with no learner identity. Staff access is approved and logged.
- **Signs of harm** in writing or speech go to a defined review path. Who is told, and when, depends on the market, and is a question for counsel (§12).

## 8. Speech

1. **Local first.** Where the device can recognize speech itself, audio does not leave it, as in Duolingo ABC.
2. **Otherwise streamed, not stored.** Prefer real-time services that keep nothing. [Microsoft states](https://learn.microsoft.com/legal/cognitive-services/speech-service/speech-to-text/data-privacy-security) that real-time recognition and pronunciation assessment retain no customer data.
3. **When a file is needed,** it goes to R2 by a short-lived URL, is deleted as soon as it is judged, and a lifecycle rule removes anything left within a day. The voice service keeps no audio, as designed.
4. **Before recording:** the learner sees a recording indicator and can skip without penalty. Nothing records in the background, and prompts do not ask for names.
5. **Never:** a voice stored as a profile, recognition of who is speaking, or inference of emotion, health or age.
6. **Calibration.** Clips of children (E4.6) are collected only under `research`, with a separate form saying who rates them and when they are destroyed, and are never mixed with learners' recordings.

## 9. Retention and Deletion

| Data | Child | Teen | After that |
| :--- | :--- | :--- | :--- |
| Audio | Until judged, at most 1 day | The same | Deleted |
| Transcripts | 30 days *starting* | 30 days *starting* | Scores remain |
| Conversation transcripts | Not kept | 30 days *starting* | Deleted |
| Free text in `answer.response` | 90 days *starting* | 1 year *starting* | Emptied; correct or not remains |
| Essays and feedback quoting them | 1 year *starting* | 1 year *starting* | Deleted; scores remain |
| Progress: events, state, whether answers were right | While active | While active | Deleted with the account |
| IP addresses in logs | 30 days | 30 days | Deleted |
| Consent records | Account's life, plus a period counsel sets | The same | Deleted |
| Inactive account | 12 months *starting*, then a notice, then 30 days | The same | Deleted |

- **Deleting means everywhere.** One function covers database tables, transcripts, feedback, R2 and vendor copies, and a test checks that nothing of a deleted learner remains. Backups age out within a stated window. The Alexa case is why transcripts are named here.
- **Guardians can act themselves.** They can see, export and delete by kind of data, and delete the whole profile, with no email needed. A refusal is written, with reasons.
- **Anonymized does not mean exempt.** Text and voice are hard to anonymize, so neither is kept as "anonymous data". Only aggregate counts are.
- A published retention policy states purposes, business need and these timeframes, as COPPA requires.

## 10. Vendors

A vendor receives minors' data only if its contract and settings give all of these, recorded in a register with the date checked:

- Its terms allow minors' data, and we meet its conditions.
- Zero retention, or a stated short period, with no training.
- A data processing agreement and a lawful transfer mechanism.
- A named region.

| Vendor type | What we know | To check |
| :--- | :--- | :--- |
| OpenAI API | [Requires zero data retention](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance) for under-13s or the consent age, and age-appropriate safeguards | Contract |
| Anthropic API | [Allows organizations to serve minors](https://support.claude.com/en/articles/9307344) with age assurance, moderation, monitoring, AI disclosure and a public statement of compliance | Whether zero retention is available to us |
| Azure AI Speech | See §8 | Contract, region |
| Other speech and AI vendors, pi-ai routes, AI Gateway | Not checked | Each one, before use; a route may change the vendor, so routes are pinned for minors |
| Cloudflare, PostgreSQL host, Resend | Not checked | Agreements, regions |

## 11. Enforcement in Code

- **`learner`** gains band, band end and country. A new append-only **`consent`** table holds §5.
- **`markets`**, a pure data table in `libs/api`, gives each country its consent age, which features are allowed, and whether it is served. An unlisted country takes the strictest row.
- **One gate.** `StartTask` and every call that accepts text or audio ask `libs/api` for the learner's capabilities and refuse otherwise. `nextTasks` receives the allowed task kinds as data, so that the engine stays pure and subject-agnostic.
- **Retention** runs from a daily Cron Trigger and is testable with an explicit time.
- **Logs** hold ids, never responses or transcripts. A test feeds marked text through a task and asserts that it appears in no log or event.
- **Staff access** to minors' text goes through an audited tool, not direct SQL in production.

**Gaps today.** Sign-up has no age question and needs a real name and email. There is no privacy notice or terms page. `answer.response` is kept forever, as plain text. Guardians are invited by the learner, and cannot delete. Account deletion does cascade to learner data, which is a good base.

## 12. What Must Exist, and When

| Before | Needed | Size |
| :--- | :--- | :--- |
| **English pilot (E1.6)** | Signed guardian forms stating purpose, access and deletion date; accounts made by the team, with pseudonyms; the notice in both languages; reports read only by named people; data deleted at the stated date. No new code beyond the deletion | S |
| **Public sign-up (any subject)** | §4, §5 for `basic`, guardian view, export and delete, §9 for existing data, published notice and retention policy, the impact assessment, leagues rules | L |
| **AI writing (E3)** | `writing` consent, §7, vendor register, the EU AI Act decision | M |
| **Recording (E4)** | `speech` consent, §8, deletion test across R2 and transcripts, `research` form for E4.6 | M |
| **Conversation (E5)** | `conversation` consent, safety review path, end-to-end test of no retention | M |

**Questions for counsel:**

1. Which markets come first, and what is each market's row? This decides the size of the rest.
2. Is the design's use of speech and AI vendors "integral" under COPPA, and which consent method does it then need?
3. Does the 2017 voice policy still stand, and does any of our speech fall under it?
4. Are recordings without any voiceprint biometric data in each market, including Illinois?
5. Are the retention periods in §9 defensible?
6. In which markets must a teen's guardian consent?
7. Are AI verdicts that gate mastery high-risk in the EU, and do we limit them there?
8. What must we do when a child's text shows possible harm?
9. Do we exclude mainland China, and how, or comply with its rules?
10. What do schools need before they can be offered?
