// Grade 9: the words the passages of the course use that the lexicon of the earlier packs does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
abort academies accelerator acceptable accompany acid admirable admiration adult's adulthood adventurous agony angers
anthem astonished astonishingly astonishment avenge awakens backgrounds ballet bathes beggar beginnings begs behaviors
blurred boasts boldest bombed bombers bombs bookcase boomed borne brain's break-in brilliance brotherhood bull cedar
cemeteries cheaply childish cider citrus claw-like clinging coming-of-age composing concentration conditioned cramped
crawls credited crest crumbles culture's day's deafness declares delinquents demon demons departs descends
dictatorships diluted dips disappointments divine drowns dully eagerly ease educated electrical eleven-year-old
embroidered endings eternal exclaims experimented explosive eyebrows fatally fearing feuding fireman firemen fisherman
flattened flees flesh folklorists follow-up foreground formation forties founds frog's gazes gears gentlemen's girl's
glares governess graduation graves grazes grimms grips guiding gums gunman half-sister handrail happiness heartbroken
helplessness hero's highly humanity immediate inaction industry-funded inflammation insults internal intestine
laziness leisurely listener long-distance longs loosened lure magician makers marries matures mead mid-twenties
middle-class miracle missionaries mocking mocks monk's monkey's mound much-traveled mustache mystery naval
nineteenth-century novel's observers offend one-eyed one-third orphan outlived outspoken outweighs outwitted
overloaded overshadowed oxide painting's paradise parting paste physically pierced pilgrims pistols ploughs plug
powerless privately processed puppet radiation red-and-white rewrites richness rocket's rowers saints saturated savage
scanned scent scolds screams scriptures secrecy self-portraits selfishness seventies shabby skulls sleeve slipper
smoother snow-capped soaring sociologists soldier's soloists somersault souls sounding splashing spool steering
stepmothers storyteller streetcar strengthen strengths stringed submarines tailor's temper tender thoughts threshold
ties token tormenting toured translator truest tumor tumors turtle's twenties two-thirds unclean unsmiling unsuitable
unwilling vain vanity w wall-sized warplanes well-balanced well-read widen yogurts
`;

/** lexicon9 are the words of the passages of grade 9 outside the shared lexicon. */
export const lexicon9: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
