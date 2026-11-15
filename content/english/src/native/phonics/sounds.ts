// Phonics: the sounds of the picture words, so that a solution can say a word one sound at a time and then whole. Each
// row is a word, the letters of each of its sounds joined by "-", and the sounds in IPA as General American says
// them; a silent final e has no sound of its own.

import type { Sound } from "@ga/content";
import { type Phoneme, sounded, spoken } from "../../audio.ts";

const rows = `
cat c-a-t k æ t
hat h-a-t h æ t
cap c-a-p k æ p
map m-a-p m æ p
fan f-a-n f æ n
van v-a-n v æ n
pan p-a-n p æ n
bag b-a-g b æ ɡ
can c-a-n k æ n
rat r-a-t ɹ æ t
bed b-e-d b ɛ d
hen h-e-n h ɛ n
pen p-e-n p ɛ n
net n-e-t n ɛ t
web w-e-b w ɛ b
jet j-e-t dʒ ɛ t
leg l-e-g l ɛ ɡ
ten t-e-n t ɛ n
pig p-i-g p ɪ ɡ
pin p-i-n p ɪ n
six s-i-x s ɪ ks
fin f-i-n f ɪ n
bin b-i-n b ɪ n
bib b-i-b b ɪ b
fig f-i-g f ɪ ɡ
dog d-o-g d ɑ ɡ
pot p-o-t p ɑ t
box b-o-x b ɑ ks
fox f-o-x f ɑ ks
mop m-o-p m ɑ p
log l-o-g l ɑ ɡ
top t-o-p t ɑ p
bus b-u-s b ʌ s
cup c-u-p k ʌ p
sun s-u-n s ʌ n
bug b-u-g b ʌ ɡ
tub t-u-b t ʌ b
rug r-u-g ɹ ʌ ɡ
hut h-u-t h ʌ t
ship sh-i-p ʃ ɪ p
shell sh-e-ll ʃ ɛ l
fish f-i-sh f ɪ ʃ
dish d-i-sh d ɪ ʃ
shed sh-e-d ʃ ɛ d
shelf sh-e-l-f ʃ ɛ l f
brush b-r-u-sh b ɹ ʌ ʃ
shop sh-o-p ʃ ɑ p
chick ch-i-ck tʃ ɪ k
chin ch-i-n tʃ ɪ n
chips ch-i-p-s tʃ ɪ p s
bench b-e-n-ch b ɛ n tʃ
chest ch-e-s-t tʃ ɛ s t
chimp ch-i-m-p tʃ ɪ m p
bunch b-u-n-ch b ʌ n tʃ
bath b-a-th b æ θ
moth m-o-th m ɑ θ
path p-a-th p æ θ
cloth c-l-o-th k l ɑ θ
duck d-u-ck d ʌ k
sock s-o-ck s ɑ k
rock r-o-ck ɹ ɑ k
lock l-o-ck l ɑ k
neck n-e-ck n ɛ k
sack s-a-ck s æ k
tick t-i-ck t ɪ k
clock c-l-o-ck k l ɑ k
truck t-r-u-ck t ɹ ʌ k
brick b-r-i-ck b ɹ ɪ k
kick k-i-ck k ɪ k
frog f-r-o-g f ɹ ɑ ɡ
crab c-r-a-b k ɹ æ b
drum d-r-u-m d ɹ ʌ m
flag f-l-a-g f l æ ɡ
sled s-l-e-d s l ɛ d
plug p-l-u-g p l ʌ ɡ
plum p-l-u-m p l ʌ m
clam c-l-a-m k l æ m
slug s-l-u-g s l ʌ ɡ
twig t-w-i-g t w ɪ ɡ
crib c-r-i-b k ɹ ɪ b
dress d-r-e-ss d ɹ ɛ s
glass g-l-a-ss ɡ l æ s
cliff c-l-i-ff k l ɪ f
stamp s-t-a-m-p s t æ m p
nest n-e-s-t n ɛ s t
tent t-e-n-t t ɛ n t
hand h-a-n-d h æ n d
lamp l-a-m-p l æ m p
pond p-o-n-d p ɑ n d
desk d-e-s-k d ɛ s k
milk m-i-l-k m ɪ l k
belt b-e-l-t b ɛ l t
gift g-i-f-t ɡ ɪ f t
raft r-a-f-t ɹ æ f t
mask m-a-s-k m æ s k
vest v-e-s-t v ɛ s t
ant a-n-t æ n t
pump p-u-m-p p ʌ m p
plant p-l-a-n-t p l æ n t
cake c-a-k-e k eɪ k
cape c-a-p-e k eɪ p
cane c-a-n-e k eɪ n
gate g-a-t-e ɡ eɪ t
vase v-a-s-e v eɪ s
wave w-a-v-e w eɪ v
rake r-a-k-e ɹ eɪ k
tape t-a-p-e t eɪ p
cave c-a-v-e k eɪ v
kite k-i-t-e k aɪ t
bike b-i-k-e b aɪ k
hive h-i-v-e h aɪ v
pine p-i-n-e p aɪ n
pipe p-i-p-e p aɪ p
vine v-i-n-e v aɪ n
mice m-i-c-e m aɪ s
dice d-i-c-e d aɪ s
rice r-i-c-e ɹ aɪ s
rope r-o-p-e ɹ oʊ p
rose r-o-s-e ɹ oʊ z
nose n-o-s-e n oʊ z
bone b-o-n-e b oʊ n
cone c-o-n-e k oʊ n
robe r-o-b-e ɹ oʊ b
hole h-o-l-e h oʊ l
mole m-o-l-e m oʊ l
note n-o-t-e n oʊ t
cube c-u-b-e k ju b
tube t-u-b-e t u b
mule m-u-l-e m ju l
bee b-ee b i
feet f-ee-t f i t
seed s-ee-d s i d
tree t-r-ee t ɹ i
sheep sh-ee-p ʃ i p
queen qu-ee-n kw i n
wheel wh-ee-l w i l
teeth t-ee-th t i θ
leaf l-ea-f l i f
seal s-ea-l s i l
peach p-ea-ch p i tʃ
bead b-ea-d b i d
rain r-ai-n ɹ eɪ n
snail s-n-ai-l s n eɪ l
mail m-ai-l m eɪ l
nail n-ai-l n eɪ l
train t-r-ai-n t ɹ eɪ n
paint p-ai-n-t p eɪ n t
chain ch-ai-n tʃ eɪ n
sail s-ai-l s eɪ l
hay h-ay h eɪ
tray t-r-ay t ɹ eɪ
jay j-ay dʒ eɪ
boat b-oa-t b oʊ t
goat g-oa-t ɡ oʊ t
coat c-oa-t k oʊ t
road r-oa-d ɹ oʊ d
toad t-oa-d t oʊ d
soap s-oa-p s oʊ p
loaf l-oa-f l oʊ f
`;

/** soundsOf maps each picture word to its sounds. */
const soundsOf = new Map<string, readonly Phoneme[]>(
  rows
    .trim()
    .split("\n")
    .map((line) => {
      const [word = "", spelled = "", ...ipa] = line.split(" ");
      const parts = spelled.split("-");
      if (parts.join("") !== word) throw new Error(`the letters ${spelled} do not spell ${word}`);
      const silent = parts.length === ipa.length + 1 && parts.at(-1) === "e";
      if (parts.length !== ipa.length && !silent) throw new Error(`${word} has ${parts.length} spellings for ${ipa.length} sounds`);
      return [word, parts.map((letters, i) => ({ letters, ipa: ipa[i] ?? "" }))] as const;
    }),
);

/** wordSounds are the recordings of a phonics word: the word, and, for a picture word, its sounds one at a time. */
export function wordSounds(word: string): readonly (Sound | undefined)[] {
  const sounds = soundsOf.get(word);
  return [spoken(word), sounds && sounded(word, sounds)];
}

/** pictureWordsWithSounds are the words whose sounds are listed. */
export const pictureWordsWithSounds: ReadonlySet<string> = new Set(soundsOf.keys());
