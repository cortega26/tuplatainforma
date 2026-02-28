import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getCanonicalPathFromSlug } from "@/domain/content/path";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";
import { toArticleView } from "@/utils/articleView";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(post => {
      const article = toArticleView(post);
      return {
        link: getCanonicalPathFromSlug(article.slug),
        title: article.title,
        description: article.description,
        pubDate: article.updatedDate ?? article.pubDate,
      };
    }),
  });
}
