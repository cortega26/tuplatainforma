import type { CollectionEntry } from "astro:content";
import {
  GUIDE_HUB_ORDER,
  GUIDE_HUBS,
  type GuideHubMeta,
  type HubCluster,
} from "@/config/clusters";
import { toArticleView } from "@/utils/articleView";

type BlogEntry = CollectionEntry<"blog">;

export type HomepageHub = GuideHubMeta & {
  slug: HubCluster;
};

function getPostSortTime(post: BlogEntry): number {
  const article = toArticleView(post);
  return (article.updatedDate ?? article.pubDate).getTime();
}

function getNormalizedSlug(post: BlogEntry): string {
  return toArticleView(post).slug;
}

function getCluster(post: BlogEntry): string {
  return toArticleView(post).cluster ?? "general";
}

export function getHomepageLeadPost(posts: BlogEntry[]): BlogEntry | undefined {
  const priorityPosts = posts.filter(
    post => (post.data.homepagePriority ?? 0) > 0
  );

  if (priorityPosts.length > 0) {
    return [...priorityPosts].sort((a, b) => {
      const priorityDelta =
        (b.data.homepagePriority ?? 0) - (a.data.homepagePriority ?? 0);
      if (priorityDelta !== 0) return priorityDelta;
      return getPostSortTime(b) - getPostSortTime(a);
    })[0];
  }

  const featuredPosts = posts.filter(post => post.data.featured);
  return featuredPosts[0] ?? posts[0];
}

export function getBalancedHomepagePosts(
  posts: BlogEntry[],
  options: {
    heroSlug?: string | null;
    heroCluster?: string | null;
    richCount: number;
    totalCount: number;
  }
): { richPosts: BlogEntry[]; compactPosts: BlogEntry[] } {
  const {
    heroSlug = null,
    heroCluster = null,
    richCount,
    totalCount,
  } = options;
  const remainingPosts = heroSlug
    ? posts.filter(post => getNormalizedSlug(post) !== heroSlug)
    : posts;

  const selectedPosts: BlogEntry[] = [];
  const selectedSlugs = new Set<string>();
  const selectedClusters = new Set<string>();

  const addPost = (post: BlogEntry) => {
    const slug = getNormalizedSlug(post);
    if (selectedSlugs.has(slug) || selectedPosts.length >= richCount) return;

    selectedPosts.push(post);
    selectedSlugs.add(slug);
    selectedClusters.add(getCluster(post));
  };

  for (const post of remainingPosts) {
    const cluster = getCluster(post);
    if (cluster === heroCluster || selectedClusters.has(cluster)) continue;
    addPost(post);
  }

  for (const post of remainingPosts) {
    const cluster = getCluster(post);
    if (selectedClusters.has(cluster)) continue;
    addPost(post);
  }

  for (const post of remainingPosts) {
    addPost(post);
  }

  const compactPosts = remainingPosts
    .filter(post => !selectedSlugs.has(getNormalizedSlug(post)))
    .slice(0, Math.max(totalCount - selectedPosts.length, 0));

  return {
    richPosts: selectedPosts,
    compactPosts,
  };
}

export function getHomepageHubRail(
  heroCluster: string | null | undefined,
  recentPosts: BlogEntry[],
  maxItems = 5
): HomepageHub[] {
  const clusterSequence = [
    heroCluster,
    ...recentPosts.map(post => getCluster(post)),
    ...GUIDE_HUB_ORDER,
  ];
  const seen = new Set<string>();
  const rail: HomepageHub[] = [];

  for (const cluster of clusterSequence) {
    if (!cluster || seen.has(cluster) || !(cluster in GUIDE_HUBS)) continue;

    seen.add(cluster);
    const slug = cluster as HubCluster;
    rail.push({ slug, ...GUIDE_HUBS[slug] });

    if (rail.length === maxItems) break;
  }

  return rail;
}
