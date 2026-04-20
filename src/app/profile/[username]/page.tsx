import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Globe, Sparkles, User } from "lucide-react";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { LIGHT_PAGE_GRADIENT, LIGHT_PAGE_SURFACE } from "@/lib/light-page-surface";

export const revalidate = 3;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

const formatRichHtml = (raw?: string | null, fallback = "Profile details will appear here once available.") => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return `<p>${escapeHtml(fallback)}</p>`;
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeRichHtml(source);
  return source
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`)
    .join("");
};

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }
  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profiles",
        item: `${baseUrl}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${baseUrl}/profile/${post.slug}`,
      },
    ],
  };

  return (
    <div className={`min-h-screen ${LIGHT_PAGE_GRADIENT} text-foreground antialiased`}>
      <NavbarShell />
      <main className="pb-20">
        <SchemaJsonLd data={breadcrumbData} />

        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.08] via-background to-muted/40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,153,107,0.22),transparent)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <span aria-hidden className="text-border">
                /
              </span>
              <Link href="/profile" className="transition-colors hover:text-primary">
                Profiles
              </Link>
              <span aria-hidden className="text-border">
                /
              </span>
              <span className="font-medium text-foreground">{brandName}</span>
            </nav>
            <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-start">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/40 via-primary/10 to-transparent opacity-80 blur-sm" />
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-card bg-muted shadow-[0_20px_60px_rgba(15,23,42,0.15)] ring-4 ring-primary/15 sm:h-44 sm:w-44">
                  {logoUrl ? (
                    <ContentImage
                      src={logoUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="176px"
                      intrinsicWidth={176}
                      intrinsicHeight={176}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-card">
                      <User className="h-16 w-16 text-muted-foreground" strokeWidth={1.25} />
                    </div>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Public profile
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{brandName}</h1>
                {domain ? (
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Globe className="h-4 w-4 shrink-0 text-primary" />
                    {domain}
                  </p>
                ) : null}
                {website ? (
                  <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-primary px-8 text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
                    >
                      <Link href={website} target="_blank" rel="noopener noreferrer">
                        Visit official site
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full border-border bg-card shadow-sm">
                      <Link href="/profile">
                        More profiles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 flex justify-center lg:justify-start">
                    <Button asChild variant="outline" size="lg" className="rounded-full border-border bg-card shadow-sm">
                      <Link href="/profile">
                        Browse profiles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <Card className="rounded-3xl border-border bg-card shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
              <CardContent className="p-8 sm:p-10">
                <h2 className="text-lg font-semibold text-foreground">About</h2>
                <p className="mt-1 text-sm text-muted-foreground">Story, positioning, and details—formatted for comfortable reading.</p>
                <article
                  className="article-content prose prose-slate mt-8 max-w-none text-base leading-relaxed prose-p:my-4 prose-a:text-primary prose-strong:font-semibold"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </CardContent>
            </Card>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <Card className="rounded-3xl border-border bg-gradient-to-br from-card to-muted/40 shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">On this profile</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Warm card surfaces match the home page palette.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Outbound links open in a clear primary call-to-action.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Suggested reading keeps visitors in your ecosystem.
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border border-dashed border-primary/25 bg-primary/[0.03] shadow-inner">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-foreground">Looking for someone else?</p>
                  <p className="mt-2 text-sm text-muted-foreground">Search across tasks or browse the full profile index.</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href="/search"
                      className={`inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold ${LIGHT_PAGE_SURFACE.action}`}
                    >
                      Open search
                    </Link>
                    <Link
                      href="/profile"
                      className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card text-sm font-medium text-foreground shadow-sm hover:bg-muted/50"
                    >
                      All profiles
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>

        {suggestedArticles.length ? (
          <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Suggested articles</h2>
                <p className="mt-1 text-sm text-muted-foreground">Editorial picks that pair well with this profile.</p>
              </div>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                View all stories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestedArticles.slice(0, 3).map((article) => (
                <TaskPostCard
                  key={article.id}
                  post={article}
                  href={buildPostUrl("article", article.slug)}
                  compact
                />
              ))}
            </div>
            <Card className="mt-10 rounded-3xl border-border bg-muted/30">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Related links</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {suggestedArticles.slice(0, 3).map((article) => (
                    <li key={`related-${article.id}`}>
                      <Link
                        href={buildPostUrl("article", article.slug)}
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/profile" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                      Browse all profiles
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
