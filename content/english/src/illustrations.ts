// The illustrations of English, made by the agent of docs/english-illustrations.md: the covers of reading units and the
// scenes of conversations, matched to their content by name. The web app serves the files of
// content/english/illustrations at /illustrations/english/.

import type { ConversationDef, ReadingUnitDef } from "@ga/content";

/** illustrations are the names of the illustrations in content/english/illustrations; a test checks them against the files. */
export const illustrations: readonly string[] = [
  "conversation-egyptian-gallery-guide",
  "conversation-fable-for-a-younger-cousin",
  "conversation-garden-center-plant-advice",
  "conversation-great-wall-guide",
  "conversation-hiking-trip-weather-check",
  "conversation-library-help-desk",
  "conversation-lost-visitor-directions",
  "conversation-music-shop-first-instrument",
  "conversation-poem-for-a-grandparent",
  "conversation-toy-car-ramp-test",
  "conversation-zookeeper-interview",
  "reading-along-the-yellow-river",
  "reading-how-animals-survive",
  "reading-how-plants-live",
  "reading-life-on-the-nile",
  "reading-our-world-on-a-map",
  "reading-poems-for-all-seasons",
  "reading-pushes-pulls-and-magnets",
  "reading-stories-and-fables",
  "reading-the-world-of-music",
  "reading-weather-and-climate",
];

const known = new Set(illustrations);

/** withCovers gives each reading unit that has a cover, `reading-<id>`, its illustration. */
export const withCovers = (units: readonly ReadingUnitDef[]): ReadingUnitDef[] =>
  units.map((u) => (known.has(`reading-${u.id}`) ? { ...u, illustration: `reading-${u.id}` } : u));

/** withScenes gives each conversation that has a scene, `conversation-<id>`, its illustration. */
export const withScenes = (conversations: readonly ConversationDef[]): ConversationDef[] =>
  conversations.map((c) => (known.has(`conversation-${c.id}`) ? { ...c, illustration: `conversation-${c.id}` } : c));
