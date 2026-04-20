"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Image as ImageIcon, Search, User } from "lucide-react";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { buildPostUrl } from "@/lib/task-data";
import { normalizeCategory, isValidCategory } from "@/lib/categories";
import type { TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { getLocalPostsForTask } from "@/lib/local-posts";

type Props = {
  task: TaskKey;
  initialPosts: SitePost[];
  category?: string;
};

export function TaskListClient({ task, initialPosts, category }: Props) {
  const localPosts = getLocalPostsForTask(task);

  const merged = useMemo(() => {
    const bySlug = new Set<string>();
    const combined: Array<SitePost & { localOnly?: boolean; task?: TaskKey }> = [];

    localPosts.forEach((post) => {
      if (post.slug) {
        bySlug.add(post.slug);
      }
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
    if (task === "image") {
      return (
        <div className="rounded-[2rem] border border-dashed border-border bg-gradient-to-br from-primary/[0.04] via-card to-muted/30 p-10 text-center shadow-inner sm:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <ImageIcon className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">No visual posts yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            When imagery lands in this lane, it will appear here in large, scannable cards—same warm shell as the rest of
            the site.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/search">Search the site</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-border">
              <Link href="/contact">Pitch a feature</Link>
            </Button>
          </div>
        </div>
      );
    }
    if (task === "profile") {
      return (
        <div className="rounded-[2rem] border border-dashed border-border bg-gradient-to-br from-muted/40 via-card to-primary/[0.05] p-10 text-center shadow-inner sm:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <User className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">No public profiles yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Profiles show logos, bios, and outbound links on a polished surface. Check back soon—or explore stories and
            search in the meantime.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/articles">Browse articles</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-border">
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Open search
              </Link>
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No posts yet for this section.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {merged.map((post) => {
        const localOnly = (post as any).localOnly;
        const href = localOnly
          ? `/local/${task}/${post.slug}`
          : buildPostUrl(task, post.slug);
        return <TaskPostCard key={post.id} post={post} href={href} taskKey={task} />;
      })}
    </div>
  );
}
