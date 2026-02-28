import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";
import { toArticleView } from "./articleView";

const postFilter = (post: CollectionEntry<"blog">) => {
  const article = toArticleView(post);
  const isPublishTimePassed =
    Date.now() > article.pubDate.getTime() - SITE.scheduledPostMargin;
  return !article.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
