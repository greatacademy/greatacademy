# Breach Response

> English | [简体中文](breach-response.zh-CN.md)

This is the plan for a personal data breach at Great Academy, the playbook that [Minors' Data](minors-data.md) §11 asks for. It says who acts, what they do in the first hours, how to decide whom to notify, and by when in each market.

**Status.** Draft of November 19, 2026. The deadlines in §6 come from the [AI legal review](../legal-review/opinion.md) and published guidance; those marked *to confirm* are not yet checked, and counsel in each market must confirm all of them. Text in square brackets is filled in by the owner. It is rehearsed once before any market opens to minors (§9).

## 1. What Counts

A breach is any event that destroys, loses, changes, discloses or gives access to personal data without authority, whether by attack, mistake or a processor's failure. Examples:

- Someone reads the database, a backup, R2 or the logs who should not.
- A secret leaks: `BETTER_AUTH_SECRET`, `AI_KEYS_SECRET`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, the Tunnel's token, a database password, an AI or speech vendor's key.
- A bug shows one learner's data to another, or a guardian sees a child who is not theirs.
- An email goes to the wrong person with someone's data.
- A processor (Hetzner, Cloudflare, Resend, Stripe, Microsoft, an AI vendor) tells us of a breach affecting our data.
- A phone with a signed-in learner is lost, when the session token is readable from the app's files.

When unsure, treat it as a breach and record it; the assessment (§4) decides whether it must be notified.

## 2. Who Acts

| Role | Who | Does |
| :--- | :--- | :--- |
| Incident lead | [name, phone, email] | Runs the response, decides, keeps the timeline |
| Privacy officer | [name, privacy@greatacademy.dev] | Assesses harm, writes and sends notices, talks to regulators |
| Technical lead | [name] | Contains, investigates, restores |
| Counsel | [per market: firm, contact] | Confirms whether and how to notify |
| Deputy | [name] | Takes over when the lead cannot be reached within an hour |

Anyone who suspects a breach writes at once to [security@greatacademy.dev] and calls the incident lead. Nobody waits to be sure.

## 3. The First Hours

The clock of most deadlines starts when we become aware, so the time of the first report is written down first.

1. **Record.** Open an entry in the incident register (§8): time, who reported, what is known.
2. **Contain**, by what the breach touched:
   - **A leaked secret:** rotate it with `wrangler secret put` and redeploy. Rotating `BETTER_AUTH_SECRET` signs everyone out; rotating `AI_KEYS_SECRET` needs the vendor keys entered again in the admin console; rotate the vendor's key at the vendor too.
   - **Sessions:** delete rows from `session` for the accounts affected, or all of them.
   - **The database:** change the passwords of the CloudNativePG roles; stop the Tunnel if access goes through it.
   - **A feature leaking data:** turn the market's switch off in the admin console, or the vendor's route, or deploy the previous version.
   - **An administrator's account:** remove the role on the Administrators page and reset the password.
3. **Preserve.** Keep logs, the `admin_log`, database snapshots and the vendor's messages. Do not delete evidence while containing.
4. **Escalate.** Within 24 hours the incident lead, the privacy officer and the technical lead meet and start the assessment.

## 4. Assessment

Within 48 hours of awareness, answer and record:

- What data: which tables or files, whether text of answers, words heard, transcripts, signed forms, emails or payment data.
- Whose: how many accounts, how many children and teens, which markets (`learner.country`).
- How: attack, mistake or processor; still ongoing or stopped.
- Whether the data was protected: encrypted, emptied by retention, or only ids.
- The harm: identity or contact data, minors' text that may reveal personal matters, embarrassment, fraud. A breach of a minor's data is presumed serious unless shown otherwise.

The result is one of: **notify** regulators and people (§6, §7), **notify people only**, or **record only**, with the reason.

## 5. The Rule for Deadlines

The shortest deadline among the markets affected governs. As a house rule: **regulators within 72 hours of awareness, and the people affected within the same 72 hours**, wherever notification is required, unless the authorities ask for a delay. A notice can be sent with what is known and completed later.

## 6. Market Table

| Market | Regulator | When it must be notified | Deadline to the regulator | The people affected |
| :--- | :--- | :--- | :--- | :--- |
| United States | State attorneys general, by state; the FTC for unfair practices | State laws differ: usually unencrypted identifiers with account credentials; some states also need the attorney general | "Without unreasonable delay", 30 to 60 days in many states *to confirm* | Same as the regulator; children through their parents |
| Canada | OPC; in Quebec the CAI | Real risk of significant harm (federal); risk of serious injury (Quebec) | As soon as feasible | As soon as feasible; records of every breach kept 24 months |
| Australia | OAIC | Eligible data breach: likely serious harm | Assess within 30 days, then notify as soon as practicable | As soon as practicable |
| Singapore | PDPC | Significant harm, or 500 people or more | 3 calendar days after deciding it is notifiable | At the same time or soon after, if significant harm |
| Japan | PPC | Sensitive data, possible financial loss, malicious act, or more than 1,000 people | Preliminary report promptly (3 to 5 days), final within 30 days, 60 for a malicious act | Promptly |
| South Korea | PIPC, or KISA | 1,000 people or more, sensitive data, or an outside attack | 72 hours | 72 hours |
| Taiwan | The authority for personal data | Breach of personal data | Per the 2025 amendment *to confirm* | After investigation, promptly |
| Hong Kong | PCPD | No duty; notifying is recommended | Voluntary, promptly | Recommended |
| Brazil | ANPD | Relevant risk or harm | 3 working days | 3 working days |

## 7. Telling People

- **A child's account** has no email. The guardian is told by email and on the guardian pages; the child sees a notice in the app in plain words, and the guardian is asked to explain it.
- **A teen** is told in the app and by email, and a linked guardian too.
- **An adult or payer** by email.
- **Language:** the person's language (`user.locale`), and the market's notice language where it has one. Templates exist in English and Simplified Chinese; the others are translated with the legal pages.
- **What a notice says:** what happened and when; what data; what we have done; what they can do (change a password, watch for suspicious email); whom to contact, [privacy@greatacademy.dev]; their right to complain to the regulator.
- Emails go through the usual providers (`apps/web/src/server/email.ts`). If an email provider is the one breached, use the other.

## 8. Register

Every breach and suspected breach, notified or not, gets an entry: time of awareness, facts, data and people affected, markets, assessment and reason, actions, notices sent with their times, and lessons. It is kept for at least 24 months, as Canada requires, or longer where a market requires. [Where the register lives: a private document, not this repository.]

## 9. After, and Rehearsal

- Within two weeks of closing, a review: cause, what worked, what changes in code, in this plan or in the [impact assessment](impact-assessment.md).
- A rehearsal before any market opens to minors and then once a year: a made-up breach, run through §3 to §7 with the clock, ending with the notices written but not sent.
- This plan is reviewed with the impact assessment, at least every 12 months.
