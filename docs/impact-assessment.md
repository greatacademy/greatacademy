# Impact Assessment

> English | [简体中文](impact-assessment.zh-CN.md)

This is the data protection impact assessment of Great Academy for learners under 18, the one document that [Minors' Data](minors-data.md) §11 asks for. One body covers every market; §9 adds what each market's law asks of an assessment. It assesses the design of [Minors' Data](minors-data.md) as built, at the state recorded in its §13.

**Status.** Draft of November 19, 2026, written from the repository and the [AI legal review](../legal-review/opinion.md). Nobody has approved it, and counsel in each market has not read it. Text in square brackets is filled in by the owner. It must be approved (§10) before any market opens to minors.

## 1. Scope

| | |
| :--- | :--- |
| Controller | [legal name of the operator], [registered postal address] |
| Assessed by | [name], with the help of an AI agent working in the repository |
| Approved by | [the operator's highest authority, and the privacy officer] |
| Covers | Accounts, consent, study, AI-judged writing (`writing`), recorded speech (`speech`), conversation (`conversation`), research recordings (`research`), billing and the admin console, for children and teens in the markets of [Minors' Data](minors-data.md) §4 |
| Does not cover | Mainland China, closed to minors (§5 there); schools and classes, not offered to minors; adults, except as payers and guardians |
| Reviewed again | Before a new scope, purpose, vendor or market; after a breach; and at least every 12 months |

## 2. What Is Processed

| Data | From whom | Purpose | Ground | Kept where | Who receives it | How long |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Name, username, password hash | Child (set by the guardian), teen | Sign in; the name shown to the child and their guardians | `basic` consent; the contract | PostgreSQL, Oregon | Hosting | Life of the account |
| Guardian's email, name | Guardian | Account, notices, verification | Contract | PostgreSQL | Hosting, email providers | Life of the account |
| Age band, its end, country | Learner or guardian | Which rules apply | Legal duty | PostgreSQL | Hosting | Life of the account; no birth date kept |
| Answers right or wrong, events, XP, progress | Learner | Teaching: what to study next | `basic` | PostgreSQL | Hosting | Life of the account |
| Text of answers, AI feedback | Learner | Checking and feedback | `basic`, `writing` | PostgreSQL | Hosting; AI vendor named in the notice, only with `writing` | Child 90 days, teen 1 year |
| Audio of spoken answers | Learner | Turning speech into words | `speech` | Not kept: within the request | Speech vendor named in the notice | Not kept |
| Words heard | Learner | Checking, showing what was heard | `speech` | PostgreSQL | Hosting | 30 days |
| Conversation transcripts | Teen | The conversation feature | `conversation` | PostgreSQL | Hosting; AI and speech vendors named in the notice | Child: not offered; teen 30 days |
| Research recordings | Speaker, with a signed form | Testing speech services | `research` form | Apart from accounts, under a number | The raters and speech service on the form | Date on the form, at most 12 months |
| Signed guardian form | Guardian | Verifying the guardian | Legal duty | R2 (`GUARDIAN_FORMS`) | Staff who decide | Until decided |
| Card payment | Guardian or adult | Payment, verifying a guardian | Contract | Stripe; we keep no card number | Stripe | Stripe's terms |
| Sign-in address and browser | Everyone | Security | Legitimate interest, legal duty | PostgreSQL | Hosting | 30 days |
| Consent records, what a payer agreed to | Guardian, teen, payer | Proof of consent | Legal duty | PostgreSQL (`consent`, `admin_log`) | Hosting | Life of the account, plus what the market requires |

Nothing else is collected: no child's email, no photo, no location, no contacts, no advertising identifier, no third-party tracker.

## 3. Necessity and Proportionality

- **Each item is needed for the course.** The table above has no item without a purpose that the learner or guardian asked for. The birth date is asked once and reduced to a band.
- **Optional is optional.** `writing`, `speech`, `conversation` and `research` are separate consents. Refusing them keeps the course, and the engine chooses only task kinds the learner's consents allow.
- **The shortest retention that serves the learner.** Text is emptied after 90 days or 1 year, words heard after 30 days; audio is never stored. Withdrawing a scope, or its lapse after 12 months, empties what it covered at once (`clearScope`, `runRetention`).
- **No secondary use.** No advertising, no sale, no training of any model on minors' text or voice, no voiceprint, no inference of emotion or personality ([Minors' Data](minors-data.md) §1).
- **Less intrusive options considered.** On-device recognition would keep audio on the device; it is used where the device offers it, and the server route is the fallback. AI judging is replaceable by rule-checked work, so a child's mastery never rests on AI alone (§8 there).

## 4. Risks and Measures

Likelihood and severity are rated low, medium or high, before and after the measures.

| Risk to the learner | Before | Measures | After |
| :--- | :--- | :--- | :--- |
| A child signs up as an adult or teen | High, medium | Neutral age question with no default; a day's block after a stop; guardian path needs a verified card or form per child; store age signals [to build] | Medium, medium |
| A child's free text reveals personal details or harm | Medium, high | Topics that do not ask about oneself; text emptied after 90 days; redaction before an AI vendor; the harm path asked of counsel (question 6) | Low, medium |
| An AI vendor keeps or trains on text | Medium, high | Vendor register: zero or short retention, no training, contract, region, market; consent names the vendor; stale entries switch the feature off | Low, high |
| Audio used as biometric data | Low, high | Audio never stored; no voiceprint or speaker recognition; written `speech` consent naming the vendor | Low, medium |
| An AI grade is wrong or biased and holds a learner back | Medium, medium | Reasons in words; a person's review on request [in-app entry to build]; calibration against texts scored by people; rule-checked items can establish mastery | Low, medium |
| Unauthorised access to the database | Low, high | No public database port (Cloudflare Tunnel to Hyperdrive); vendor keys encrypted; the admin role checked on the server; append-only admin log; [encryption at rest of volumes and backups to confirm] | Low, high |
| A staff member reads minors' text | Low, medium | No production SQL by hand; an audited tool [to build]; least privilege | Low, medium |
| Data kept after it should be gone | Medium, medium | Daily retention run, tested with explicit times; deletion of an account at once; backups expire within [30] days | Low, low |
| Engagement features push a minor to overuse | Medium, medium | Leagues, streaks and nudges off by default; guardian time limit; no random rewards; no nudges at night | Low, low |
| Transfer to the United States exposes data to access by US authorities | Low, medium | Data minimised; DPAs and standard clauses; notices say so | Low, medium |
| The session token on a phone is stolen | Medium, medium | [Move the native app's token from a plain file to the system keychain or keystore before release] | Low, medium |

## 5. Transfers

All data is kept in Oregon, United States. For a learner outside the United States this is a transfer, assessed as Quebec's s. 17 and Australia's APP 8 ask:

- **Sensitivity.** Minors' data; text may reveal more than intended; audio is not stored.
- **Purpose.** Teaching; nothing is sold or used for advertising.
- **Protection.** Data processing agreements with each processor (§7); standard contractual clauses where the market requires them, Brazil's of ANPD Resolution 19/2024 included; zero retention and no training for AI vendors; the database reachable only through a tunnel.
- **The law of the United States.** Federal and state privacy law differ from the learner's, and US authorities may demand access by lawful process. The notice says so.
- **Conclusion.** [To be confirmed by Quebec counsel: whether the protection is adequate in the sense of s. 17.]

## 6. AI Grading and Automated Decisions

AI grades writing and speech only with `writing` or `speech`. South Korea's AI Basic Act lists student evaluation in schools as high-impact; Quebec, Australia (from December 10, 2026) and Brazil require that automated decisions be disclosed and open to review. The measures are those of [Minors' Data](minors-data.md) §8: every verdict logged with model, rubric version and score; reasons shown; a person's review that overrides; bias checked by language background before launch; children's mastery not gated by AI alone. [Whether Great Academy is a high-impact operator in Korea, and what it must file, is for Korean counsel.]

## 7. Processors

| Processor | Role | Agreement | Region |
| :--- | :--- | :--- | :--- |
| Hetzner | Database, voice service | DPA concluded November 10, 2026 | Oregon |
| Cloudflare | Pages, Workers, R2, Tunnel, email | Customer DPA in its terms [copy to file] | Global edge; storage in [region to confirm] |
| Resend | Email | [DPA to accept and file] | [to confirm] |
| Stripe | Payments, card verification | DPA in its services agreement [copy to file] | [to confirm] |
| Microsoft Azure AI Speech | Speech, only with `speech` | Products and Services DPA [copy to file] | [region of the resource] |
| AI vendors | Writing and conversation | None chosen; each enters the register first | Per vendor |
| Apple | App Store purchases | Apple sells as merchant of record | Apple's |

## 8. Rights

Guardians and learners see, download and delete data in Settings, at once. Correction and other requests by email to [privacy@greatacademy.dev], answered within 30 days. A child can turn features off and delete what they typed, and the guardian is told. Complaints to the regulator are named in the privacy notice.

## 9. Market Annexes

| Market | What the law asks of an assessment | Covered by | Left |
| :--- | :--- | :--- | :--- |
| United States | COPPA's written security program; state assessments for minors where thresholds are met | §2–§4 | Whether state thresholds apply to a company our size |
| Canada | Quebec s. 3.3 assessment of systems and s. 17 before a transfer; the OPC's expectation for minors | §4, §5 | Quebec counsel on §5; French version |
| Australia | Children's Online Privacy Code (draft) s. 38 assessment; APP 1.7–1.9 on automated decisions | §4, §6 | The code as registered |
| Singapore | PDPC's advisory guidelines on children: an assessment before launch | §2–§4 | None known |
| Japan | No duty to assess; APPI Art. 28 information on the receiving country | §5 | Japanese version |
| South Korea | PIPA risk measures; AI Basic Act impact assessment if high-impact | §4, §6 | Korean counsel on §6 |
| Taiwan | No duty to assess; security measures of Art. 27 | §4 | None known |
| Hong Kong | No duty; the PCPD recommends one | All | AI scopes stay closed until a vendor serves Hong Kong |
| Brazil | LGPD Art. 38 report (RIPD) on request; ECA Digital Art. 16 impact report | All | Portuguese version; the representative |

## 10. Decision and Sign-off

| | |
| :--- | :--- |
| Residual risk | Acceptable once the items in square brackets are done, in the assessor's view |
| Before any market opens | Store age signals and a keychain token in the native app; the in-app request for review; the audited staff tool; the DPAs filed; this document confirmed by counsel in that market |
| Approved | [name, role, date] |
| Register of assessments | This document's git history; each approval is a commit naming the approver |
