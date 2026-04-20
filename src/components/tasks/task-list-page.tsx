import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Camera,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Palette,
  Sparkles,
  Tag,
  User,
  Users,
} from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { LIGHT_PAGE_GRADIENT, LIGHT_PAGE_SURFACE } from '@/lib/light-page-surface'
import { TASK_LIST_PAGE_OVERRIDE_ENABLED, TaskListPageOverride } from '@/overrides/task-list-page'

const taskIcons: Record<TaskKey, any> = {
  listing: Building2,
  article: FileText,
  image: ImageIcon,
  profile: User,
  classified: Tag,
  sbm: LayoutGrid,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

export async function TaskListPage({ task, category }: { task: TaskKey; category?: string }) {
  if (TASK_LIST_PAGE_OVERRIDE_ENABLED) {
    return await TaskListPageOverride({ task, category })
  }

  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))
  const { recipe } = getFactoryState()
  const layoutKey = recipe.taskLayouts[task as keyof typeof recipe.taskLayouts] || `${task}-${task === 'listing' ? 'directory' : 'editorial'}`
  const shellClass = LIGHT_PAGE_GRADIENT
  const Icon = taskIcons[task] || LayoutGrid

  const ui = {
    muted: LIGHT_PAGE_SURFACE.muted,
    panel: LIGHT_PAGE_SURFACE.panel,
    soft: LIGHT_PAGE_SURFACE.panelSoft,
    input: LIGHT_PAGE_SURFACE.input,
    button: LIGHT_PAGE_SURFACE.action,
  }

  return (
    <div className={`min-h-screen ${shellClass}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {task === 'listing' ? (
          <SchemaJsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Business Directory Listings',
                itemListElement: schemaItems,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: SITE_CONFIG.name,
                url: `${baseUrl}/listings`,
                areaServed: 'Worldwide',
              },
            ]}
          />
        ) : null}
        {task === 'article' || task === 'classified' ? (
          <SchemaJsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ''}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        {layoutKey === 'listing-directory' || layoutKey === 'listing-showcase' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className={`rounded-[2rem] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] ${ui.panel}`}>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] opacity-70"><Icon className="h-4 w-4" /> {taskConfig?.label || task}</div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-4 max-w-2xl text-sm leading-7 ${ui.muted}`}>Built with a cleaner scan rhythm, stronger metadata grouping, and a structure designed for business discovery rather than editorial reading.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={taskConfig?.route || '#'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.button}`}>Explore results <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/search" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.soft}`}>Open search</Link>
              </div>
            </div>
            <form className={`grid gap-3 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${ui.soft}`} action={taskConfig?.route || '#'}>
              <div>
                <label className={`text-xs uppercase tracking-[0.2em] ${ui.muted}`}>Category</label>
                <select name="category" defaultValue={normalizedCategory} className={`mt-2 h-11 w-full rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`h-11 rounded-xl text-sm font-medium ${ui.button}`}>Apply filters</button>
            </form>
          </section>
        ) : null}

        {layoutKey === 'article-editorial' || layoutKey === 'article-journal' ? (
          <section className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This reading surface uses slower pacing, stronger typographic hierarchy, and more breathing room so long-form content feels intentional rather than squeezed into a generic feed.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${ui.muted}`}>Reading note</p>
              <p className={`mt-4 text-sm leading-7 ${ui.muted}`}>Use category filters to jump between topics without collapsing the page into the same repeated card rhythm used by other task types.</p>
              <form className="mt-5 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {task === 'image' ? (
          <section className="mb-12 space-y-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/[0.08] via-background to-muted/40 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(201,153,107,0.26),transparent)]"
              />
              <div className="relative grid gap-8 p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-10">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    <Camera className="h-3.5 w-3.5" />
                    Gallery &amp; visuals
                  </div>
                  <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {taskConfig?.description || 'Visual work, curated for scan and delight.'}
                  </h1>
                  <p className={`mt-4 max-w-2xl text-sm leading-relaxed sm:text-base ${ui.muted}`}>
                    Larger tiles, calmer typography, and cyan-accent actions—so photography, renders, and brand imagery read
                    like a gallery, not a generic feed.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/search"
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.button}`}
                    >
                      Search visuals
                      <Sparkles className="h-4 w-4" />
                    </Link>
                    <Link href="/contact" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.soft}`}>
                      Collaborate
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: 'Color-safe', sub: 'Consistent borders & cards', icon: Palette },
                      { label: 'Full-bleed hero', sub: 'Detail pages spotlight media', icon: ImageIcon },
                      { label: 'Fast scan', sub: 'Metadata stays light', icon: Sparkles },
                    ].map(({ label, sub, icon: G }) => (
                      <div key={label} className={`rounded-2xl border border-border bg-card/90 p-4 shadow-sm`}>
                        <G className="h-5 w-5 text-primary" />
                        <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
                        <p className={`mt-1 text-xs ${ui.muted}`}>{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div
                    className={`flex min-h-[200px] flex-col justify-end rounded-[1.75rem] border border-border bg-gradient-to-br from-card to-muted/50 p-5 shadow-inner ${ui.panel}`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Featured</span>
                    <p className="mt-2 text-lg font-semibold text-foreground">High-impact frames</p>
                  </div>
                  <div
                    className={`flex min-h-[200px] flex-col justify-end rounded-[1.75rem] border border-dashed border-primary/25 bg-primary/[0.04] p-5 ${ui.soft}`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Carousel</span>
                    <p className="mt-2 text-lg font-semibold text-foreground">Swipe-ready sets</p>
                  </div>
                  <div
                    className={`col-span-2 flex min-h-[120px] items-center justify-between rounded-[1.75rem] border border-border bg-card/95 px-6 py-4 shadow-sm`}
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Filter by mood</p>
                      <p className="text-sm font-medium text-foreground">Category tags keep sets organized.</p>
                    </div>
                    <ImageIcon className="h-10 w-10 text-primary/80" />
                  </div>
                </div>
              </div>
            </div>
            <form
              className={`flex flex-col gap-4 rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between`}
              action={taskConfig?.route || '/images'}
            >
              <div className="flex-1">
                <label className={`text-xs font-semibold uppercase tracking-[0.18em] ${ui.muted}`}>Category</label>
                <select
                  name="category"
                  defaultValue={normalizedCategory}
                  className={`mt-2 h-11 w-full max-w-md rounded-xl px-3 text-sm ${ui.input}`}
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`h-11 rounded-xl px-8 text-sm font-semibold ${ui.button}`}>
                Apply filters
              </button>
            </form>
          </section>
        ) : null}

        {task === 'profile' ? (
          <section className="mb-12 space-y-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/[0.07] via-card to-muted/35 shadow-[0_28px_90px_rgba(15,23,42,0.09)]">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              />
              <div className="relative grid gap-10 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    People &amp; brands
                  </div>
                  <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {taskConfig?.description || 'Profiles that feel intentional—not borrowed from a directory template.'}
                  </h1>
                  <p className={`mt-4 max-w-2xl text-sm leading-relaxed sm:text-base ${ui.muted}`}>
                    Avatars, bios, and outbound links sit on the same warm canvas as the home page: soft cards, clear type,
                    and primary accents only where they earn attention.
                  </p>
                  <ul className="mt-8 space-y-3 text-sm">
                    {[
                      'Identity-first layout with room for logos and long-form bios',
                      'Suggested stories keep readers in your ecosystem',
                      'Detail pages mirror marketing polish—not admin chrome',
                    ].map((line) => (
                      <li key={line} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className={`${ui.muted}`}>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/articles" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.button}`}>
                      Read stories
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/search" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.soft}`}>
                      Search people
                    </Link>
                  </div>
                </div>
                <div className={`rounded-[1.75rem] border border-border bg-gradient-to-b from-background to-muted/40 p-6 shadow-inner`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Surface checklist</p>
                  <div className="mt-5 grid gap-4">
                    {[
                      { t: 'Clear headline & domain', d: 'Visitors know who they are meeting in seconds.' },
                      { t: 'Structured bio', d: 'Rich text keeps long introductions readable.' },
                      { t: 'Outbound CTA', d: 'Official sites open in a confident primary button.' },
                    ].map((item) => (
                      <div key={item.t} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <p className="font-semibold text-foreground">{item.t}</p>
                        <p className={`mt-1 text-sm ${ui.muted}`}>{item.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <form
              className={`flex flex-col gap-4 rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between`}
              action={taskConfig?.route || '/profile'}
            >
              <div className="flex-1">
                <label className={`text-xs font-semibold uppercase tracking-[0.18em] ${ui.muted}`}>Focus</label>
                <select
                  name="category"
                  defaultValue={normalizedCategory}
                  className={`mt-2 h-11 w-full max-w-md rounded-xl px-3 text-sm ${ui.input}`}
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`h-11 rounded-xl px-8 text-sm font-semibold ${ui.button}`}>
                Refine profiles
              </button>
            </form>
          </section>
        ) : null}

        {layoutKey === 'classified-bulletin' || layoutKey === 'classified-market' ? (
          <section className="mb-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className={`rounded-[1.8rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Fast-moving notices, offers, and responses in a compact board format.</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {['Quick to scan', 'Shorter response path', 'Clearer urgency cues'].map((item) => (
                <div key={item} className={`rounded-[1.5rem] p-5 ${ui.soft}`}>
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {layoutKey === 'sbm-curation' || layoutKey === 'sbm-library' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Curated resources arranged more like collections than a generic post feed.</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Bookmarks, saved resources, and reference-style items need calmer grouping and lighter metadata. This variant gives them that separation.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.24em] ${ui.muted}`}>Collection filter</p>
              <form className="mt-4 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {intro ? (
          <section className={`mb-12 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 ${ui.panel}`}>
            <h2 className="text-2xl font-semibold text-foreground">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className={`mt-4 text-sm leading-7 ${ui.muted}`}>{paragraph}</p>
            ))}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {intro.links.map((link) => (
                <a key={link.href} href={link.href} className="font-semibold text-foreground hover:underline">{link.label}</a>
              ))}
            </div>
          </section>
        ) : null}

        <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
      </main>
      <Footer />
    </div>
  )
}
