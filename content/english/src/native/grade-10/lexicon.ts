// Grade 10: the words the passages of the course use that the lexicon of the earlier packs does not list. Each
// spelling is an entry of its own, so that a spelling another pack already lists does not hide the others.

import type { LexiconEntry } from "@ga/content";

const words = `
advisers afterlife aimed ammunition amnesty amused announcement apologetic apparent apricot archbishop arnold's aspen
aspens atlantic atomic auction austin's badge baggy bald bankruptcy barbed barber bat-people beavers beef beg
billionaire birdsong birthplace bison blindfolded boast bomb bomb's bombing bowler breeders britain brother-in-law
brutality brutally budgeted businesslike caesar's callers cameraman canada caption carols carpenter cartoon cartoonist
cascade cashier's cathedral's centimeter chamberlains chambers chaplain charm chief christmas clearing clergyman
clutching coastline coating collector comedians commander comparable consecrated conspirators continuing convicted
copper-colored coronation cost-cutting councillor councillors courthouse crane crawling crazier criminals crosswords d
darkening dean debated deflation demolished deputy detention devoured diamond directories disappearance disapproved
distorted dressing dual duke ecologists economist eight-hour electronics eliminated elk emperor's endures enemy's
england enlarge enthusiastically equivalent euro eve everyone's evils executives explosion explosives fabulously
fascinated fashionable female fiercest firestorm first-class fish-eating five-dollar flagpole flattered foolishly
forcing fragment france freshly furnish gash gassed generosity glorious graphic graphs grave grieve half-forgotten
handing handwriting harshness hatred hearings heather hectares heights hinted hood hopelessly horrifies horrifying
hostility ides illustrations illustrators indifference individuals inedible infinite inflated inn insane jail john
journalism julius lacquer larks lenders leo's leukemia liberators life-sized london macbeth's machine-gunned mailed
marcus mat mathematicians mayor's meltwater memorable memorial mercury metaphor mid military mockery month's moralists
motorway murdering murders napoleon's nickname noticeable occasion oddly ospreys outfit overlooked overtake pardoned
paris pasted perpetrator pests poisoned politicians polling poppies poppy posted preparations presenter president's
presidential principal's productivity protocol provost quarrelsome questioning ranches rarest ravens re-election
rebels rebuild reburied refers reflections refresh remarkably remarry repaid represented reprinted resemblance
retreated rewind robe romance roofless rubbing rubbings ruling russia russians sanely satirists scissors screaming
sensibly shaded shakespeare's shelling ship's shipwrecked shop's shrubs sickened signifying sinking slapped slot
sniper's songbirds soybean soybeans spaghetti spain spain's specially spire splintered spoiled spraying sprig spying
squashed st stabbed stagnated stammer stares startlingly stillness stonemasons strand strands stubs stumps substitutes
survivorship swans swindlers sympathized teasing telephoned thermometers third-rate thoroughly three-quarters tidy
tightrope tipping tortured tossing tractors traitor trophic truthfully tubs tulips twenty-three-year-old unarmed
unavoidable undercover unexplained unexploded unfit unfriendly unhurt unidentified unlocked unscientific unto
untroubled unveiled unworthy user's vice viewed waists wales warship weevil wife's willows wrongs
`;

/** lexicon10 are the words of the passages of grade 10 outside the shared lexicon. */
export const lexicon10: readonly LexiconEntry[] = words
  .split(/\s+/)
  .filter((word) => word !== "")
  .map((word) => ({ word }));
