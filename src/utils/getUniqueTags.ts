import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Tag {
  tag: string;
  tagName: string;
}

interface TagWithCount extends Tag {
  count: number;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const tags: Tag[] = posts
    .filter(postFilter)
    .flatMap(post => post.data.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex(tag => tag.tag === value.tag) === index
    )
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
  return tags;
};

export const getUniqueTagsWithCount = (posts: CollectionEntry<"blog">[]) => {
  const tagMap = new Map<string, TagWithCount>();

  posts
    .filter(postFilter)
    .flatMap(post => post.data.tags)
    .forEach(tagName => {
      const tag = slugifyStr(tagName);
      const existingTag = tagMap.get(tag);

      if (existingTag) {
        existingTag.count += 1;
        return;
      }

      tagMap.set(tag, { tag, tagName, count: 1 });
    });

  return Array.from(tagMap.values()).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag)
  );
};

export default getUniqueTags;
