// Grade 9: the batches of words of housework and of phrasal verbs of work and choices.

import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const housework = batch(
  "words-of-housework",
  ["Words of Housework", "家务的词"],
  ["cleaning the house and the things used for it", "打扫房子与清洁用品"],
  `
  sweep|to clean with a brush; to move quickly over an area|扫；席卷|___ the floor with a broom.|A storm may ___ across the plains.|She chose to ___ the leaves.|mop,dust|swept,sweeping
  mop|a sponge or cloth on a long stick for washing floors; to wash with one|拖把；拖地|___ the kitchen floor.|Rinse the ___.|He used a ___ with a long handle to wash the floor.|sweep,sponge|mopped
  dust|fine dry powder; to wipe it off|灰尘；掸灰|Wipe the ___ off the shelves.|The ___ made me sneeze.|The books were covered in ___.|polish,sweep|dusty,dusted
  polish|to make shiny by rubbing; a substance used for this|擦亮；上光剂|___ your shoes until they shine.|She bought nail ___.|His speech needs ___.|dust,bleach|polished
  broom|a brush with a long handle for sweeping|扫帚|Get the ___ and sweep up.|The witch flew on a ___.|A new ___ sweeps clean.|mop,bucket|brooms
  bucket|a round open container with a handle|水桶|Fill the ___ with water.|Carry the ___ of water carefully.|A ___ of sand.|broom,sponge|buckets
  sponge|a soft object for washing that soaks up water; a light cake|海绵；松糕|Wipe the plate with a soft ___.|She baked a ___.|Kids' minds are like a ___.|mop,bucket|sponges,spongy
  laundry|clothes to be washed; a place where they are washed|待洗衣物；洗衣房|Do the ___.|Hang the ___ to dry.|Take it to the ___.|detergent,sweep|
  detergent|a liquid or powder for washing|洗涤剂|Add ___ to the machine.|This ___ smells fresh.|Use less ___.|sweep,broom|detergents
  bleach|a chemical that whitens and cleans; to whiten|漂白剂；漂白|Don't mix ___ with other cleaners.|The sun may ___ the curtains.|She chose to ___ her hair.|sponge,broom|bleached
  `,
);

const work = batch(
  "phrasal-verbs-of-work-and-choices",
  ["Phrasal Verbs of Work and Choices", "工作与选择的短语动词"],
  ["taking control, starting hobbies, refusing, cutting jobs and keeping to plans", "接管、培养爱好、拒绝、裁员与坚持计划"],
  `
  take over|to take control of|接管|A big firm may ___ the shop.|Can you ___ while I rest?|Weeds began to ___ the garden.|take up,carry out|took over,taken over,taking over
  take up|to start a hobby; to fill space or time|开始从事；占据|She chose to ___ the piano.|The bed may ___ the room.|Don't ___ my time.|take over,stick to|took up,taken up,taking up
  turn down|to refuse; to lower the volume|拒绝；调低|She chose to ___ the job.|___ the radio.|Don't ___ his offer.|lay off,stand out|turned down,turning down
  lay off|to dismiss workers because there is no work; to stop doing|解雇；停止|The factory may ___ workers.|___ the sweets.|They had to ___ fifty staff.|turn down,take over|laid off,laying off
  carry out|to perform or complete a task|执行|We must ___ the plan.|They ___ tests.|Soldiers ___ orders.|bring about,go on|carried out,carrying out
  bring about|to cause to happen|导致|The law may ___ change.|What will ___ peace?|Storms ___ floods.|carry out,stand out|brought about,bringing about
  go on|to continue; to happen|继续；发生|Please ___.|Let the party ___ until ten.|The show must ___.|slow down,stick to|went on,gone on,going on
  slow down|to reduce speed|放慢|___ near the school.|Business may ___.|You need to ___ and rest.|go on,stand out|slowed down,slowing down
  stick to|to keep to a plan or promise|坚持|___ the plan.|We must ___ the rules.|She tends to ___ her word.|go on,take up|stuck to,sticking to
  stand out|to be easy to see; to be better than others|显眼；出众|Her red coat made her ___.|He tends to ___ in class.|Bright colors ___.|slow down,bring about|stood out,standing out
  `,
);

/** batchesF are the batches of housework and of phrasal verbs of work and choices. */
export const batchesF: readonly BatchSpec[] = [housework, work];
