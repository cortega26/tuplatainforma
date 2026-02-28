import type { CollectionEntry } from "astro:content";
import { toArticleView } from "./articleView";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort((a, b) => {
      const aArticle = toArticleView(a);
      const bArticle = toArticleView(b);
      const aTime = (aArticle.updatedDate ?? aArticle.pubDate).getTime();
      const bTime = (bArticle.updatedDate ?? bArticle.pubDate).getTime();
      return bTime - aTime;
    });
};

export default getSortedPosts;
