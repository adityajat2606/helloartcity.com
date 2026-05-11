import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, Compass, FileText, Globe2, Image as ImageIcon, LayoutGrid, MapPin, Search, ShieldCheck, Sparkles, Tag, User, Users } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchTaskPosts } from '@/lib/task-data'
import { siteContent } from '@/config/site.content'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind, type ProductKind } from '@/design/factory/get-product-kind'
import type { SitePost } from '@/lib/site-connector'
import { HOME_PAGE_OVERRIDE_ENABLED, HomePageOverride } from '@/overrides/home-page'
import { LIGHT_ABOUT, LIGHT_PAGE_GRADIENT, LIGHT_PAGE_SURFACE } from '@/lib/light-page-surface'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: siteContent.home.metadata.title,
    description: siteContent.home.metadata.description,
    openGraphTitle: siteContent.home.metadata.openGraphTitle,
    openGraphDescription: siteContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...siteContent.home.metadata.keywords],
  })
}

type EnabledTask = (typeof SITE_CONFIG.tasks)[number]
type TaskFeedItem = { task: EnabledTask; posts: SitePost[] }

/** Feed items may include a task hint from the connector; not always present on the base type. */
type PostWithTaskHint = SitePost & { task?: string }

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: Bookmark,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (value === 'listing' || value === 'classified' || value === 'article' || value === 'image' || value === 'profile' || value === 'sbm') return value
  return fallback
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage = typeof post?.content === 'object' && post?.content && Array.isArray((post.content as any).images)
    ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)
    : null
  const logo = typeof post?.content === 'object' && post?.content && typeof (post.content as any).logo === 'string'
    ? (post.content as any).logo
    : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

function getPostMeta(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return { location: '', category: '' }
  const content = post.content as Record<string, unknown>
  return {
    location: typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : '',
    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',
  }
}

/** Directory / listing home — same light shell as About. */
function getDirectoryTone(_brandPack: string) {
  return {
    shell: LIGHT_ABOUT.canvas,
    hero: LIGHT_ABOUT.heroWash,
    panel: LIGHT_ABOUT.panel,
    soft: LIGHT_ABOUT.soft,
    muted: LIGHT_ABOUT.muted,
    title: LIGHT_ABOUT.title,
    badge: LIGHT_ABOUT.badgeNeutral,
    action: LIGHT_ABOUT.action,
    actionAlt: LIGHT_ABOUT.actionOutline,
  }
}

function getEditorialTone() {
  return {
    shell: `${LIGHT_PAGE_SURFACE.shell}`,
    panel: LIGHT_ABOUT.panel,
    soft: LIGHT_ABOUT.soft,
    muted: LIGHT_ABOUT.muted,
    title: LIGHT_ABOUT.title,
    badge: LIGHT_ABOUT.badge,
    action: LIGHT_ABOUT.action,
    actionAlt: LIGHT_ABOUT.actionOutline,
  }
}

/** Gallery-forward home — same warm shell + primary accent as About. */
function getVisualTone() {
  return {
    shell: `${LIGHT_PAGE_GRADIENT} antialiased`,
    heroBand:
      'relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.06] via-background to-muted/30',
    panel: `${LIGHT_PAGE_SURFACE.card} shadow-[0_8px_40px_rgba(15,23,42,0.06)]`,
    soft: LIGHT_PAGE_SURFACE.cardMuted,
    muted: 'text-muted-foreground',
    title: 'text-foreground',
    badge: LIGHT_ABOUT.badge,
    action: `${LIGHT_PAGE_SURFACE.action} shadow-md shadow-primary/20`,
    actionAlt: `${LIGHT_ABOUT.actionOutline} rounded-full`,
    ctaBand: 'border-y border-border bg-gradient-to-r from-primary/[0.06] via-background to-muted/40',
    quoteCard: 'border border-border bg-card bg-gradient-to-br from-card to-muted/30 shadow-[0_20px_50px_rgba(15,23,42,0.05)]',
  }
}

function getCurationTone() {
  return {
    shell: `${LIGHT_PAGE_GRADIENT} min-h-screen`,
    panel: LIGHT_ABOUT.panel,
    soft: LIGHT_ABOUT.soft,
    muted: LIGHT_ABOUT.muted,
    title: LIGHT_ABOUT.title,
    badge: LIGHT_ABOUT.badge,
    action: LIGHT_ABOUT.action,
    actionAlt: LIGHT_ABOUT.actionOutline,
  }
}

function DirectoryHome({ primaryTask, enabledTasks, listingPosts, classifiedPosts, profilePosts, brandPack }: {
  primaryTask?: EnabledTask
  enabledTasks: EnabledTask[]
  listingPosts: SitePost[]
  classifiedPosts: SitePost[]
  profilePosts: SitePost[]
  brandPack: string
}) {
  const tone = getDirectoryTone(brandPack)
  const featuredListings = (listingPosts.length ? listingPosts : classifiedPosts).slice(0, 3)
  const featuredTaskKey: TaskKey = listingPosts.length ? 'listing' : 'classified'
  const quickRoutes = enabledTasks.slice(0, 4)

  return (
    <main>
      <section className={tone.hero}>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
                <Compass className="h-3.5 w-3.5" />
                Local discovery product
              </span>
              <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
                Search businesses, compare options, and act fast without digging through generic feeds.
              </h1>
              <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>

              <div className={`mt-8 grid gap-3 rounded-[2rem] p-4 ${tone.panel} md:grid-cols-[1.25fr_0.8fr_auto]`}>
                <div className="rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-600">What do you need today?</div>
                <div className="rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-600">Choose area or city</div>
                <Link href={primaryTask?.route || '/listings'} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                  Browse now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Verified businesses', `${featuredListings.length || 3}+ highlighted surfaces`],
                  ['Fast scan rhythm', 'More utility, less filler'],
                  ['Action first', 'Call, visit, shortlist, compare'],
                ].map(([label, value]) => (
                  <div key={label} className={`rounded-[1.4rem] p-4 ${tone.soft}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">{label}</p>
                    <p className="mt-2 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className={`rounded-[2rem] p-6 ${tone.panel}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">Primary lane</p>
                    <h2 className="mt-2 text-3xl font-semibold">{primaryTask?.label || 'Listings'}</h2>
                  </div>
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className={`mt-4 text-sm leading-7 ${tone.muted}`}>{primaryTask?.description || 'Structured discovery for services, offers, and business surfaces.'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {quickRoutes.map((task) => {
                  const Icon = taskIcons[task.key as TaskKey] || LayoutGrid
                  return (
                    <Link key={task.key} href={task.route} className={`rounded-[1.6rem] p-5 ${tone.soft}`}>
                      <Icon className="h-5 w-5" />
                      <h3 className="mt-4 text-lg font-semibold">{task.label}</h3>
                      <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{task.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Featured businesses</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Strong listings with clearer trust cues.</h2>
          </div>
          <Link href="/listings" className="text-sm font-semibold text-sky-700 hover:text-sky-800">Open listings</Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredListings.map((post) => (
            <TaskPostCard key={post.id} post={post} href={getTaskHref(featuredTaskKey, post.slug)} taskKey={featuredTaskKey} />
          ))}
        </div>
      </section>

      <section className={`${tone.shell}`}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">What makes this different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Built like a business directory, not a recolored content site.</h2>
            <ul className={`mt-6 space-y-3 text-sm leading-7 ${tone.muted}`}>
              <li>Search-first hero instead of a magazine headline.</li>
              <li>Action-oriented listing cards with trust metadata.</li>
              <li>Support lanes for offers, businesses, and profiles.</li>
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(profilePosts.length ? profilePosts : classifiedPosts).slice(0, 4).map((post) => {
              const meta = getPostMeta(post)
              const taskKey = resolveTaskKey((post as PostWithTaskHint).task, profilePosts.length ? 'profile' : 'classified')
              return (
                <Link key={post.id} href={getTaskHref(taskKey, post.slug)} className={`overflow-hidden rounded-[1.8rem] ${tone.panel}`}>
                  <div className="relative h-44 overflow-hidden">
                    <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">{meta.category || (post as PostWithTaskHint).task || 'Profile'}</p>
                    <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                    <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Quick access to local information and related surfaces.'}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

function EditorialHome({ primaryTask, articlePosts }: { primaryTask?: EnabledTask; articlePosts: SitePost[] }) {
  const tone = getEditorialTone()
  const lead = articlePosts[0]
  const side = articlePosts.slice(1, 5)
  const grid = articlePosts.slice(1, 7)
  const browseCategories = CATEGORY_OPTIONS.slice(0, 10)
  const supportStrip = siteContent.home.supportStrip

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <aside className={`hidden overflow-hidden rounded-2xl lg:block ${tone.panel}`}>
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">Browse topics</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Article categories</p>
            </div>
            <nav className="max-h-[420px] space-y-0.5 overflow-y-auto px-2 py-3">
              <Link
                href="/articles"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-sky-50"
              >
                All stories
                <ArrowRight className="h-4 w-4 text-sky-700" />
              </Link>
              {browseCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/articles?category=${encodeURIComponent(cat.slug)}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  {cat.name}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-200 px-5 py-4">
              <p className="text-xs text-slate-600">Need another format? Use search or the footer—routes stay the same.</p>
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${tone.badge}`}>
                  <FileText className="h-3.5 w-3.5" />
                  {siteContent.hero.badge}
                </span>
                <h1 className={`mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-[3.15rem] ${tone.title}`}>
                  {siteContent.hero.title[0]}
                </h1>
                <p className={`mt-5 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={primaryTask?.route || '/articles'} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-transform duration-200 hover:-translate-y-0.5 ${tone.action}`}>
                  Open library
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/search" className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                  Search archive
                </Link>
              </div>
            </div>

            <div className={`mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between`}>
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Globe2 className="h-5 w-5 shrink-0 text-sky-700" />
                <span className="truncate text-sm text-slate-600">{siteContent.hero.searchPlaceholder}</span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/articles"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 sm:flex-none"
                >
                  Grid
                </Link>
                <Link
                  href="/articles"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-800 sm:flex-none"
                >
                  List
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className={`rounded-2xl p-6 ${tone.soft}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">In this week&apos;s file</p>
                <div className="mt-4 space-y-4">
                  {side.map((post) => (
                    <Link key={post.id} href={`/articles/${post.slug}`} className="group block border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Story</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-sky-700">{post.title}</h3>
                      <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Essay-length reporting with room for context and art direction.'}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className={`flex flex-col justify-between rounded-2xl p-6 ${tone.panel}`}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">Desk notes</p>
                  <p className={`mt-4 text-sm leading-7 ${tone.muted}`}>
                    {siteContent.home.introParagraphs[0]}
                  </p>
                </div>
                <Link href="/about" className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:underline`}>
                  How we publish
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {lead ? (
          <div className={`mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_32px_90px_rgba(15,23,42,0.1)]`}>
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[300px] overflow-hidden sm:min-h-[380px]">
                <ContentImage src={getPostImage(lead)} alt={lead.title} fill className="object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-900/25 via-transparent to-transparent" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">Cover story</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">{lead.title}</h2>
                <p className={`mt-4 text-sm leading-8 ${tone.muted}`}>{lead.summary || 'A slower lead with space for photography, captions, and pull quotes.'}</p>
                <Link href={`/articles/${lead.slug}`} className={`mt-8 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${tone.action}`}>
                  Read full story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-12">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">Latest filings</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Fresh articles</h2>
            </div>
            <Link href="/articles" className="text-sm font-semibold text-sky-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {grid.map((post) => (
              <Link
                key={post.id}
                href={`/articles/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-200 group-hover:bg-slate-900/15" />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Article</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-sky-700">{post.title}</h3>
                  <p className={`mt-2 line-clamp-2 text-sm leading-relaxed ${tone.muted}`}>{post.summary || 'Editorial summary and deck notes appear here.'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {supportStrip.map((item) => (
            <Link key={item.href} href={item.href} className={`rounded-2xl p-6 transition-colors duration-200 ${tone.soft} hover:border-sky-200`}>
              <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
              <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

const visualPillarIcons = [Sparkles, Users, LayoutGrid] as const

function VisualHome({ primaryTask, imagePosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; imagePosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getVisualTone()
  const gallery = imagePosts.length ? imagePosts.slice(0, 6) : articlePosts.slice(0, 6)
  const creators = profilePosts.slice(0, 4)
  const supportStrip = siteContent.home.supportStrip
  const vh = siteContent.home.visualHome

  return (
    <main className={tone.shell}>
      <div className={tone.heroBand}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-40 h-[min(520px,80vw)] w-[min(520px,80vw)] rounded-full bg-sky-300/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-28 h-[420px] w-[420px] rounded-full bg-violet-300/20 blur-3xl" />
          <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-cyan-200/20 blur-2xl" />
        </div>

        <section className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${tone.badge}`}>
                <ImageIcon className="h-3.5 w-3.5 text-sky-600" />
                {siteContent.hero.badge}
              </span>
              <h1 className={`mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-[3.15rem] ${tone.title}`}>
                {siteContent.hero.title[0]}
              </h1>
              <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-slate-700">{siteContent.hero.title[1]}</p>
              <p className={`mt-5 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={primaryTask?.route || '/images'}
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 ${tone.action}`}
                >
                  {siteContent.hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <dl className="mt-10 grid gap-3 sm:grid-cols-3">
                {vh.statStrip.map((row) => (
                  <div key={row.label} className={`rounded-2xl px-4 py-4 ${tone.soft}`}>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{row.label}</dt>
                    <dd className="mt-1 text-lg font-semibold text-slate-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
              {gallery.length
                ? gallery.slice(0, 6).map((post, index) => (
                    <Link
                      key={post.id}
                      href={getTaskHref(resolveTaskKey((post as PostWithTaskHint).task, 'image'), post.slug)}
                      className={
                        index === 0
                          ? `group relative col-span-2 row-span-2 overflow-hidden rounded-3xl ${tone.panel} transition duration-300 hover:-translate-y-1`
                          : `group relative overflow-hidden rounded-2xl ${tone.panel} transition duration-300 hover:-translate-y-0.5`
                      }
                    >
                      <div className={index === 0 ? 'relative aspect-[4/3] min-h-[240px] sm:min-h-[300px]' : 'relative aspect-square min-h-[120px] sm:min-h-[140px]'}>
                        <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-90 transition group-hover:opacity-100" />
                        <div className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white drop-shadow md:bottom-4 md:left-4">
                          <span className="line-clamp-2">{post.title}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                : Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`ph-${index}`}
                      className={
                        index === 0
                          ? `col-span-2 row-span-2 flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50/50 sm:min-h-[300px]`
                          : `flex aspect-square min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 sm:min-h-[140px]`
                      }
                    >
                      <span className="px-4 text-center text-xs font-medium text-slate-500">{index === 0 ? 'Image posts will appear here' : '…'}</span>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className={`flex flex-col gap-4 rounded-[1.75rem] p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 ${tone.panel}`}>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">{vh.searchBand.eyebrow}</p>
            <p className={`mt-2 text-sm leading-relaxed ${tone.muted}`}>{vh.searchBand.hint}</p>
          </div>
          <Link
            href="/search"
            className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3.5 text-sm text-slate-500 shadow-inner transition hover:border-sky-200 hover:bg-white sm:max-w-md"
          >
            <Search className="h-5 w-5 shrink-0 text-sky-600" />
            <span className="truncate text-left">{vh.searchBand.placeholder}</span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-600" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {vh.pillars.map((pillar, i) => {
            const Icon = visualPillarIcons[i] ?? Sparkles
            return (
              <div key={pillar.title} className={`rounded-[1.5rem] p-7 ${tone.panel}`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-800">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{pillar.title}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${tone.muted}`}>{pillar.body}</p>
              </div>
            )
          })}
        </div>
      </section>


      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <blockquote className={`rounded-[1.75rem] p-8 lg:p-10 ${tone.quoteCard}`}>
            <p className="font-serif text-2xl leading-snug text-slate-800 sm:text-[1.65rem]">&ldquo;{vh.quote.text}&rdquo;</p>
            <footer className="mt-6 text-sm font-semibold text-sky-800">— {vh.quote.attribution}</footer>
          </blockquote>
          <div className="grid gap-6">
            <div className={`rounded-[1.75rem] p-8 ${tone.panel}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">{vh.richness.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-900">{vh.richness.title}</h2>
              <p className={`mt-4 text-sm leading-8 ${tone.muted}`}>{vh.richness.lead}</p>
              <ul className={`mt-6 space-y-3 text-sm leading-relaxed ${tone.muted}`}>
                {vh.richness.bullets.map((line) => (
                  <li key={line.slice(0, 48)} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {vh.spotlightBullets.map((line) => (
                <div key={line} className={`rounded-2xl px-4 py-4 text-sm leading-relaxed text-slate-700 ${tone.soft}`}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={tone.ctaBand}>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">{siteContent.cta.badge}</p>
            <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-[-0.03em] text-slate-900">{siteContent.cta.title}</h2>
            <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${tone.muted}`}>{siteContent.cta.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={siteContent.cta.primaryCta.href} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${tone.action}`}>
              {siteContent.cta.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={siteContent.cta.secondaryCta.href} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${tone.actionAlt}`}>
              {siteContent.cta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {supportStrip.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${tone.muted}`}>{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 opacity-0 transition group-hover:opacity-100">
                Open
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function CurationHome({ primaryTask, bookmarkPosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; bookmarkPosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getCurationTone()
  const collections = bookmarkPosts.length ? bookmarkPosts.slice(0, 4) : articlePosts.slice(0, 4)
  const people = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <Bookmark className="h-3.5 w-3.5" />
              Curated collections
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Save, organize, and revisit resources through shelves, boards, and curated collections.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/sbm'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Explore curators
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {collections.map((post) => (
              <Link key={post.id} href={getTaskHref(resolveTaskKey((post as PostWithTaskHint).task, 'sbm'), post.slug)} className={`rounded-[1.8rem] p-6 ${tone.panel}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Collection</p>
                <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                <p className={`mt-3 text-sm leading-8 ${tone.muted}`}>{post.summary || 'A calmer bookmark surface with room for context and grouping.'}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Why this feels different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">More like saved boards and reading shelves than a generic post feed.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>The structure is calmer, the cards are less noisy, and the page encourages collecting and returning instead of forcing everything into a fast-scrolling list.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-32 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>Curator profile, saved resources, and collection notes.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function HomePage() {
  if (HOME_PAGE_OVERRIDE_ENABLED) {
    return <HomePageOverride />
  }

  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const taskFeed: TaskFeedItem[] = (
    await Promise.all(
      enabledTasks.map(async (task) => ({
        task,
        posts: await fetchTaskPosts(task.key, 8, { allowMockFallback: false, fresh: true }),
      }))
    )
  ).filter(({ posts }) => posts.length)

  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]
  const listingPosts = taskFeed.find(({ task }) => task.key === 'listing')?.posts || []
  const classifiedPosts = taskFeed.find(({ task }) => task.key === 'classified')?.posts || []
  const articlePosts = taskFeed.find(({ task }) => task.key === 'article')?.posts || []
  const imagePosts = taskFeed.find(({ task }) => task.key === 'image')?.posts || []
  const profilePosts = taskFeed.find(({ task }) => task.key === 'profile')?.posts || []
  const bookmarkPosts = taskFeed.find(({ task }) => task.key === 'sbm')?.posts || []

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className={LIGHT_PAGE_SURFACE.shell}>
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />
      {productKind === 'directory' ? (
        <DirectoryHome
          primaryTask={primaryTask}
          enabledTasks={enabledTasks}
          listingPosts={listingPosts}
          classifiedPosts={classifiedPosts}
          profilePosts={profilePosts}
          brandPack={recipe.brandPack}
        />
      ) : null}
      {productKind === 'editorial' ? (
        <EditorialHome primaryTask={primaryTask} articlePosts={articlePosts} />
      ) : null}
      {productKind === 'visual' ? (
        <VisualHome primaryTask={primaryTask} imagePosts={imagePosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      {productKind === 'curation' ? (
        <CurationHome primaryTask={primaryTask} bookmarkPosts={bookmarkPosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      <Footer />
    </div>
  )
}
