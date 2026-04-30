"use client";

import { useMemo } from "react";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { buildPostUrl } from "@/lib/task-data";
import { normalizeCategory, isValidCategory } from "@/lib/categories";
import type { TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { getLocalPostsForTask } from "@/lib/local-posts";
import { SITE_CONFIG } from "@/lib/site-config";
import { getSiteExperience } from "@/lib/site-experience";

type Props = {
  task: TaskKey;
  initialPosts: SitePost[];
  category?: string;
};

function getLayoutClass(task: TaskKey, siteKey: ReturnType<typeof getSiteExperience>["key"]) {
  if (siteKey === "tynewebdesign") {
    return task === "image"
      ? "columns-1 gap-5 sm:columns-2 xl:columns-3 [column-fill:_balance]"
      : "grid gap-6 md:grid-cols-2 xl:grid-cols-3";
  }

  if (siteKey === "codepixelmedia") {
    return "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  }

  if (siteKey === "radianpark") {
    return "grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]";
  }

  if (siteKey === "lashisking") {
    return "grid gap-7 md:grid-cols-2 xl:grid-cols-3";
  }

  if (siteKey === "scoreminers") {
    return "grid gap-5 md:grid-cols-2 xl:grid-cols-4";
  }

  if (siteKey === "linedesing") {
    return "grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]";
  }

  if (siteKey === "helloartcity") {
    return "columns-1 gap-6 md:columns-2 xl:columns-3 [column-fill:_balance]";
  }

  if (siteKey === "housesdecors") {
    return "grid gap-8 md:grid-cols-2 xl:grid-cols-3";
  }

  if (siteKey === "aporiakennels") {
    return "grid gap-6 lg:grid-cols-2";
  }

  return "grid gap-6 md:grid-cols-2 xl:grid-cols-3";
}

export function TaskListClient({ task, initialPosts, category }: Props) {
  const localPosts = getLocalPostsForTask(task);
  const experience = getSiteExperience(SITE_CONFIG.baseUrl);
  const useHelloArtCityGalleryLayout = task === "image" || task === "profile";

  const merged = useMemo(() => {
    const bySlug = new Set<string>();
    const combined: Array<SitePost & { localOnly?: boolean; task?: TaskKey }> = [];

    localPosts.forEach((post) => {
      if (post.slug) bySlug.add(post.slug);
      combined.push(post);
    });

    initialPosts.forEach((post) => {
      if (post.slug && bySlug.has(post.slug)) return;
      combined.push(post);
    });

    const normalizedCategory = category ? normalizeCategory(category) : "all";
    if (normalizedCategory === "all") {
      return combined.filter((post) => {
        const content = post.content && typeof post.content === "object" ? post.content : {};
        const value = typeof (content as any).category === "string" ? (content as any).category : "";
        return !value || isValidCategory(value);
      });
    }

    return combined.filter((post) => {
      const content = post.content && typeof post.content === "object" ? post.content : {};
      const value =
        typeof (content as any).category === "string"
          ? normalizeCategory((content as any).category)
          : "";
      return value === normalizedCategory;
    });
  }, [category, initialPosts, localPosts]);

  if (!merged.length) {
    return (
      <div className={`rounded-[2rem] p-12 text-center ${experience.panelClass}`}>
        <p className="text-base font-semibold text-foreground">Nothing here yet</p>
        <p className={`mt-2 text-sm ${experience.mutedClass}`}>
          New posts will appear in this collection as soon as they are published.
        </p>
      </div>
    );
  }

  const layoutClass = getLayoutClass(task, experience.key);

  if (useHelloArtCityGalleryLayout) {
    return (
      <section className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            task === "image" ? "Print-ready browsing" : "Identity-first presentation",
            "Cleaner card spacing",
            "Reference-style visual hierarchy",
            "Faster scan across collections",
          ].map((item, index) => (
            <div
              key={item}
              className={`rounded-[1.6rem] border px-5 py-4 shadow-sm ${
                index === 0
                  ? "border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_100%)] text-stone-950"
                  : "border-stone-200 bg-white text-stone-700"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Surface note</p>
              <p className="mt-2 text-sm font-semibold">{item}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-fr">
          {merged.map((post, index) => {
            const localOnly = (post as any).localOnly;
            const href = localOnly ? `/local/${task}/${post.slug}` : buildPostUrl(task, post.slug);
            const wrapperClass =
              index === 0
                ? "md:col-span-2 xl:col-span-2 xl:row-span-2"
                : index === 1 || index === 2
                  ? "xl:col-span-1"
                  : "";

            return (
              <div key={post.id} className={wrapperClass}>
                <TaskPostCard post={post} href={href} taskKey={task} />
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className={layoutClass}>
      {merged.map((post) => {
        const localOnly = (post as any).localOnly;
        const href = localOnly ? `/local/${task}/${post.slug}` : buildPostUrl(task, post.slug);
        return <TaskPostCard key={post.id} post={post} href={href} taskKey={task} />;
      })}
    </div>
  );
}
