// The illustrations of Chinese, drawn by the agent of docs/chinese-illustrations.md: the four pictures of each story of
// the HSK 5 writing paper, one image of four panels a task, matched to its task by its place. The web app serves the
// files of content/chinese/illustrations at /illustrations/chinese/.

import type { WritingItem } from "@ga/subject-chinese";

/** illustrations are the names of the illustrations in content/chinese/illustrations; a test checks them against the files. */
export const illustrations: readonly string[] = [];

/** storyPicture is the name of the picture of the HSK 5 story at a place in sceneStories, counted from 0. */
export const storyPicture = (place: number): string => `hsk-5-story-${String(place + 1).padStart(2, "0")}`;

/** withPictures gives each story whose picture is among names its picture, by its place; the others keep their words alone. */
export function withPictures(stories: readonly WritingItem[], names: readonly string[] = illustrations): WritingItem[] {
  const known = new Set(names);
  return stories.map((s, i) => (known.has(storyPicture(i)) ? { ...s, picture: `illustrations/chinese/${storyPicture(i)}` } : s));
}
