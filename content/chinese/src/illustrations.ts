// The illustrations of Chinese, drawn by the agent of docs/chinese-illustrations.md: the four pictures of each story of
// the HSK 5 writing paper, one image of four panels a task, matched to its task by its place. The web app serves the
// files of content/chinese/illustrations at /illustrations/chinese/.

import type { WritingItem } from "@ga/subject-chinese";

/** illustrations are the names of the illustrations in content/chinese/illustrations; a test checks them against the files. */
export const illustrations: readonly string[] = [
  "hsk-5-story-01",
  "hsk-5-story-02",
  "hsk-5-story-03",
  "hsk-5-story-04",
  "hsk-5-story-05",
  "hsk-5-story-06",
  "hsk-5-story-07",
  "hsk-5-story-08",
  "hsk-5-story-09",
  "hsk-5-story-10",
  "hsk-5-story-11",
  "hsk-5-story-12",
  "hsk-5-story-13",
  "hsk-5-story-14",
  "hsk-5-story-15",
  "hsk-5-story-16",
];

/** storyPicture is the name of the picture of the HSK 5 story at a place in sceneStories, counted from 0. */
export const storyPicture = (place: number): string => `hsk-5-story-${String(place + 1).padStart(2, "0")}`;

/** withPictures gives each story whose picture is among names its picture, by its place; the others keep their words alone. */
export function withPictures(stories: readonly WritingItem[], names: readonly string[] = illustrations): WritingItem[] {
  const known = new Set(names);
  return stories.map((s, i) => (known.has(storyPicture(i)) ? { ...s, picture: `illustrations/chinese/${storyPicture(i)}` } : s));
}
