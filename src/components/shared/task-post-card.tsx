import Link from "next/link";
import { ArrowUpRight, FileText, Mail, MapPin, Tag } from "lucide-react";
import { ContentImage } from "@/components/shared/content-image";
import { CATEGORY_OPTIONS, normalizeCategory } from "@/lib/categories";
import type { SitePost } from "@/lib/site-connector";
import type { TaskKey } from "@/lib/site-config";
import { SITE_CONFIG } from "@/lib/site-config";
import { getSiteExperience } from "@/lib/site-experience";

type ListingContent = {
  location?: string;
  category?: string;
  description?: string;
  email?: string;
};

const stripHtml = (value?: string | null) =>
  (value || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getExcerpt = (value?: string | null, maxLength = 140) => {
  const text = stripHtml(value);
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
};

const getContent = (post: SitePost): ListingContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as ListingContent;
};

const getImageUrl = (post: SitePost, content: ListingContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaUrl = media[0]?.url;
  if (mediaUrl) return mediaUrl;

  const contentAny = content as Record<string, unknown>;
  const contentImage = typeof contentAny.image === "string" ? contentAny.image : null;
  if (contentImage) return contentImage;

  const contentImages = Array.isArray(contentAny.images) ? contentAny.images : [];
  const firstImage = contentImages.find((value) => typeof value === "string");
  if (firstImage) return firstImage as string;

  const contentLogo = typeof contentAny.logo === "string" ? contentAny.logo : null;
  if (contentLogo) return contentLogo;

  return "/placeholder.svg?height=640&width=960";
};

function MetaRow({
  category,
  location,
  email,
  mutedClass,
}: {
  category: string;
  location?: string;
  email?: string;
  mutedClass: string;
}) {
  return (
    <div className={`mt-4 flex flex-wrap gap-3 text-xs ${mutedClass}`}>
      <span className="inline-flex items-center gap-1">
        <Tag className="h-3.5 w-3.5" />
        {category}
      </span>
      {location ? (
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {location}
        </span>
      ) : null}
      {email ? (
        <span className="inline-flex items-center gap-1">
          <Mail className="h-3.5 w-3.5" />
          {email}
        </span>
      ) : null}
    </div>
  );
}

export function TaskPostCard({
  post,
  href,
  taskKey,
  compact,
}: {
  post: SitePost;
  href: string;
  taskKey?: TaskKey;
  compact?: boolean;
}) {
  const content = getContent(post);
  const image = getImageUrl(post, content);
  const rawCategory = content.category || post.tags?.[0] || "Post";
  const normalizedCategory = normalizeCategory(rawCategory);
  const category =
    CATEGORY_OPTIONS.find((item) => item.slug === normalizedCategory)?.name || rawCategory;
  const excerpt = getExcerpt(content.description || post.summary, compact ? 110 : 170) || "Explore this post.";
  const location = content.location;
  const experience = getSiteExperience(SITE_CONFIG.baseUrl);
  const variant = taskKey || "listing";
  const useHelloArtCityGalleryLayout = variant === "image" || variant === "profile";
  const imageAspect =
    variant === "image"
      ? "aspect-[4/5]"
      : variant === "article"
        ? "aspect-[16/10]"
        : variant === "profile"
          ? "aspect-[4/3]"
          : "aspect-[16/11]";
  const altText = `${post.title} ${category}`;

  if (experience.key === "tynewebdesign") {
    return (
      <Link
        href={href}
        className={`group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] p-3 transition ${experience.panelClass}`}
      >
        <div className={`relative overflow-hidden rounded-[1.5rem] ${imageAspect}`}>
          <ContentImage src={image} alt={altText} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${experience.badgeClass}`}>
            {category}
          </span>
        </div>
        <div className="p-3 pb-2">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">{post.title}</h3>
          <p className={`mt-3 text-sm leading-7 ${experience.mutedClass}`}>{excerpt}</p>
          <MetaRow category={category} location={location} email={content.email} mutedClass={experience.mutedClass} />
        </div>
      </Link>
    );
  }

  if (experience.key === "codepixelmedia") {
    return (
      <Link href={href} className="group relative overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-slate-950 text-slate-50">
        <div className="relative aspect-square overflow-hidden">
          <ContentImage src={image} alt={altText} fill className="object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/10" />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <span className={`mb-3 inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${experience.badgeClass}`}>
              {category}
            </span>
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">{excerpt}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-slate-300">
              <span>{location || "Direct profile access"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (experience.key === "radianpark") {
    return (
      <Link href={href} className="group grid gap-4 overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white p-4 shadow-[0_18px_50px_rgba(24,24,27,0.08)] lg:grid-cols-[160px_1fr]">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-zinc-100">
          <div className="absolute left-3 top-3 z-10 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-950 shadow-sm">
            {category}
          </div>
          <div className="relative aspect-[3/4]">
            <ContentImage src={image} alt={altText} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Magazine file</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">{variant}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-zinc-950">{post.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{excerpt}</p>
          </div>
          <MetaRow category={category} location={location} email={content.email} mutedClass="text-zinc-500" />
        </div>
      </Link>
    );
  }

  if (experience.key === "lashisking") {
    return (
      <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-rose-200/70 bg-white shadow-[0_28px_80px_rgba(190,24,93,0.11)]">
        <div className={`relative overflow-hidden ${imageAspect}`}>
          <ContentImage src={image} alt={altText} fill className="object-cover transition duration-500 group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/70 via-transparent to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <span className={`rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${experience.badgeClass}`}>
              {category}
            </span>
            <span className="text-xs uppercase tracking-[0.22em] text-rose-500">Featured</span>
          </div>
          <h3 className="mt-4 text-[1.6rem] font-semibold leading-tight text-rose-950">{post.title}</h3>
          <p className={`mt-3 text-sm leading-7 ${experience.mutedClass}`}>{excerpt}</p>
          <MetaRow category={category} location={location} email={content.email} mutedClass={experience.mutedClass} />
        </div>
      </Link>
    );
  }

  if (experience.key === "scoreminers") {
    return (
      <Link href={href} className="group flex h-full flex-col overflow-hidden border-[3px] border-slate-950 bg-white shadow-[10px_10px_0_rgba(15,23,42,0.9)] transition hover:translate-x-[-2px] hover:translate-y-[-2px]">
        <div className={`relative ${imageAspect} border-b-[3px] border-slate-950 bg-[#fff5b4]`}>
          <ContentImage src={image} alt={altText} fill className="object-cover mix-blend-multiply transition duration-500 group-hover:scale-[1.04]" />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span className={`px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] ${experience.badgeClass}`}>{category}</span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-950">{variant}</span>
          </div>
          <h3 className="mt-4 text-2xl font-black uppercase leading-tight text-slate-950">{post.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">{excerpt}</p>
          <MetaRow category={category} location={location} email={content.email} mutedClass="text-slate-700" />
        </div>
      </Link>
    );
  }

  if (experience.key === "linedesing") {
    return (
      <Link href={href} className="group grid gap-5 overflow-hidden rounded-[1.6rem] border border-sky-200 bg-white p-5 shadow-[0_18px_55px_rgba(14,116,144,0.08)] md:grid-cols-[1fr_220px]">
        <div className="order-2 md:order-1">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
            <span className={`rounded-full px-3 py-1 ${experience.badgeClass}`}>{category}</span>
            <span>Blueprint note</span>
          </div>
          <h3 className="mt-4 text-[1.7rem] font-semibold leading-tight text-slate-950">{post.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{excerpt}</p>
          <MetaRow category={category} location={location} email={content.email} mutedClass="text-slate-500" />
        </div>
        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.3rem] border border-sky-100 bg-sky-50">
            <ContentImage src={image} alt={altText} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
          </div>
        </div>
      </Link>
    );
  }

  if (useHelloArtCityGalleryLayout) {
    const isProfile = variant === "profile";
    return (
      <Link 
        href={href} 
        className={`group relative block overflow-hidden bg-white transition-all duration-500 hover:shadow-2xl ${
          isProfile 
            ? "rounded-3xl aspect-[4/3]" 
            : "rounded-[2rem] aspect-[3/4]"
        }`}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <ContentImage 
            src={image} 
            alt={altText} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
        
        {/* Gradient Overlay - always visible but intensifies on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
        
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          {/* Top Section - Category Tag */}
          <div className="flex justify-between items-start">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md ${
              isProfile ? "bg-indigo-500/80" : "bg-rose-500/80"
            }`}>
              {category}
            </span>
            <div className={`rounded-full p-2 text-white backdrop-blur-md transition-all duration-300 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
              isProfile ? "bg-indigo-500/60" : "bg-rose-500/60"
            }`}>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          
          {/* Bottom Section - Title & Meta */}
          <div className="space-y-3">
            <h3 className={`font-bold leading-tight text-white line-clamp-2 ${
              isProfile ? "text-xl" : "text-2xl"
            }`}>
              {post.title}
            </h3>
            
            {/* Excerpt - slides up on hover */}
            <div className="overflow-hidden">
              <p className="text-sm text-white/80 line-clamp-2 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {excerpt}
              </p>
            </div>
            
            {/* Meta Row */}
            <div className="flex items-center gap-4 pt-2 border-t border-white/20">
              {location && (
                <span className="flex items-center gap-1 text-xs text-white/70">
                  <MapPin className="h-3 w-3" />
                  {location.slice(0, 25)}
                </span>
              )}
              <span className={`ml-auto text-[10px] font-semibold uppercase tracking-wider text-white/60 px-2 py-1 rounded bg-white/10 ${
                isProfile ? "hidden" : ""
              }`}>
                {isProfile ? "Profile" : "View"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Hover Border Effect */}
        <div className={`absolute inset-0 rounded-[inherit] transition-all duration-500 pointer-events-none ${
          isProfile 
            ? "group-hover:ring-4 group-hover:ring-indigo-400/30" 
            : "group-hover:ring-4 group-hover:ring-rose-400/30"
        }`} />
      </Link>
    );
  }

  if (experience.key === "housesdecors") {
    return (
      <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-amber-200 bg-[#fffdf8] shadow-[0_24px_70px_rgba(120,53,15,0.09)]">
        <div className="grid gap-0 md:grid-cols-[1fr_0.9fr]">
          <div className="p-6">
            <span className={`rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${experience.badgeClass}`}>
              {category}
            </span>
            <h3 className="mt-4 text-[1.55rem] font-semibold leading-tight text-amber-950">{post.title}</h3>
            <p className={`mt-3 text-sm leading-7 ${experience.mutedClass}`}>{excerpt}</p>
            <MetaRow category={category} location={location} email={content.email} mutedClass={experience.mutedClass} />
          </div>
          <div className="relative min-h-[220px] overflow-hidden bg-amber-50">
            <ContentImage src={image} alt={altText} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
          </div>
        </div>
      </Link>
    );
  }

  if (experience.key === "aporiakennels") {
    return (
      <Link href={href} className="group grid gap-4 overflow-hidden rounded-[1.75rem] border border-emerald-200 bg-white p-4 shadow-[0_18px_50px_rgba(22,101,52,0.1)] md:grid-cols-[140px_1fr]">
        <div className="relative overflow-hidden rounded-[1.25rem] bg-emerald-50">
          <div className="relative aspect-square">
            <ContentImage src={image} alt={altText} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3 border-b border-emerald-100 pb-3">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${experience.badgeClass}`}>
              {category}
            </span>
            <span className="text-xs uppercase tracking-[0.22em] text-emerald-700">Kennel log</span>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-emerald-950">{post.title}</h3>
          <p className={`mt-2 text-sm leading-7 ${experience.mutedClass}`}>{excerpt}</p>
          <MetaRow category={category} location={location} email={content.email} mutedClass={experience.mutedClass} />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-teal-200 bg-white/90 p-4 shadow-[0_24px_70px_rgba(13,148,136,0.12)] backdrop-blur">
      <div className={`relative overflow-hidden rounded-[1.5rem] ${imageAspect}`}>
        <ContentImage src={image} alt={altText} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-teal-950/60 to-transparent" />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <span className={`rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${experience.badgeClass}`}>
            {category}
          </span>
          {variant === "pdf" ? (
            <span className="inline-flex items-center gap-1 text-xs text-teal-800">
              <FileText className="h-3.5 w-3.5" />
              PDF
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 text-[1.55rem] font-semibold leading-tight text-slate-950">{post.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{excerpt}</p>
        <MetaRow category={category} location={location} email={content.email} mutedClass="text-slate-500" />
      </div>
    </Link>
  );
}
