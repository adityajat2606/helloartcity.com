import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  FileText,
  Building2,
  LayoutGrid,
  Tag,
  Github,
  Twitter,
  Linkedin,
  Image as ImageIcon,
  User,
  ArrowRight,
  Sparkles,
  Mail,
  Compass,
} from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { FOOTER_OVERRIDE_ENABLED, FooterOverride } from '@/overrides/footer'

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const footerLinks = {
  company: [
    { name: 'About', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Press', href: '/press' },
  ],
  resources: [
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Developers', href: '/developers' },
    { name: 'Status', href: '/status' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Licenses', href: '/licenses' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
]

function LinkColumn({
  title,
  titleHref,
  children,
}: {
  title: string
  /** When set, the column heading links here (e.g. Company → about). */
  titleHref?: string
  children: ReactNode
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {titleHref ? (
          <Link href={titleHref} className="transition-colors hover:text-primary">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <ul className="mt-4 space-y-3 text-sm">{children}</ul>
    </div>
  )
}

export function Footer() {
  if (FOOTER_OVERRIDE_ENABLED) {
    return <FooterOverride />
  }

  const { recipe } = getFactoryState()
  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]
  const navEmphasis = new Set<TaskKey>(Array.from(siteContent.navbar.emphasizeTaskKeys as readonly TaskKey[]))
  const emphasizedFooterTasks = enabledTasks.filter((task) => navEmphasis.has(task.key))

  if (recipe.footer === 'minimal-footer') {
    return (
      <footer className="border-t border-border bg-background text-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-1">
                <img
                  src="/favicon.png?v=202604182"
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full origin-center scale-[1.18] object-contain"
                />
              </span>
              {SITE_CONFIG.name}
            </Link>
            <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
            <p className="max-w-md text-sm text-muted-foreground">{SITE_CONFIG.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {emphasizedFooterTasks.map((task) => {
              const TaskIcon = taskIcons[task.key] || LayoutGrid
              return (
                <Link
                  key={task.key}
                  href={task.route}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <TaskIcon className="h-3.5 w-3.5 text-primary" />
                  {task.label}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Contact
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.name}
        </div>
      </footer>
    )
  }

  if (recipe.footer === 'dense-footer') {
    return (
      <footer className="border-t border-border bg-background text-foreground">
        <div className="border-b border-border bg-gradient-to-r from-primary/[0.07] via-background to-muted/40">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Start here</p>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                Jump into the lanes your community uses most—then search or browse the rest when you need it.
              </p>
            </div>
            {primaryTask ? (
              <Link
                href={primaryTask.route}
                className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:self-center"
              >
                Open {primaryTask.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-sm">
                <img
                  src="/favicon.png?v=202604182"
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full origin-center scale-[1.18] object-contain"
                />
              </div>
              <div>
                <span className="font-semibold">{SITE_CONFIG.name}</span>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{siteContent.footer.tagline}</p>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{SITE_CONFIG.description}</p>
          </div>
          <LinkColumn title="Explore">
            {emphasizedFooterTasks.map((task) => {
              const Icon = taskIcons[task.key] || LayoutGrid
              return (
                <li key={task.key}>
                  <Link href={task.route} className="flex items-center gap-2 text-foreground transition-colors hover:text-primary">
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    {task.label}
                  </Link>
                </li>
              )
            })}
          </LinkColumn>
          <LinkColumn title="Company" titleHref="/about">
            {footerLinks.company.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {item.name}
                </Link>
              </li>
            ))}
          </LinkColumn>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Connect</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-card p-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label={item.name}
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <Mail className="h-4 w-4" />
              Message us
            </Link>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </footer>
    )
  }

  if (recipe.footer === 'editorial-footer') {
    return (
      <footer className="border-t border-border bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Editorial desk
              </div>
              <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">{SITE_CONFIG.name}</h3>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">{SITE_CONFIG.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"
                >
                  Latest stories
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                  Search archive
                </Link>
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <LinkColumn title="Primary">
                {emphasizedFooterTasks.map((task) => (
                  <li key={task.key}>
                    <Link href={task.route} className="font-medium text-foreground hover:text-primary">
                      {task.label}
                    </Link>
                  </li>
                ))}
              </LinkColumn>
              <LinkColumn title="Company" titleHref="/about">
                {footerLinks.company.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </LinkColumn>
            </div>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.name}
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="border-b border-border bg-gradient-to-br from-primary/[0.08] via-background to-muted/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <Compass className="h-3.5 w-3.5" />
              Explore the surface
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Images, profiles, and search—organized like the home page, ready from the footer.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Same calm palette everywhere: soft cards, clear type, and cyan accents for the actions that matter.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
            {emphasizedFooterTasks.map((task) => {
              const Icon = taskIcons[task.key] || LayoutGrid
              return (
                <Link
                  key={task.key}
                  href={task.route}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-primary/35 hover:shadow-md"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {task.label}
                </Link>
              )
            })}
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" />
              Search
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-start gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-sm">
                <img
                  src="/favicon.png?v=202604182"
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full origin-center scale-[1.18] object-contain"
                />
              </div>
              <div>
                <span className="block text-lg font-semibold leading-tight">{SITE_CONFIG.name}</span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{siteContent.footer.tagline}</span>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">{SITE_CONFIG.description}</p>
            {primaryTask ? (
              <Link
                href={primaryTask.route}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted/50"
              >
                Go to {primaryTask.label}
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            ) : null}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <LinkColumn title="Platform">
              {emphasizedFooterTasks.map((task) => {
                const Icon = taskIcons[task.key] || LayoutGrid
                return (
                  <li key={task.key}>
                    <Link href={task.route} className="flex items-center gap-2 text-foreground transition-colors hover:text-primary">
                      <Icon className="h-4 w-4 opacity-80" />
                      {task.label}
                    </Link>
                  </li>
                )
              })}
            </LinkColumn>
            <LinkColumn title="Company" titleHref="/about">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {item.name}
                  </Link>
                </li>
              ))}
            </LinkColumn>
            <LinkColumn title="Resources">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-primary transition-colors hover:text-primary/80">
                    {item.name}
                  </Link>
                </li>
              ))}
            </LinkColumn>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Legal & social</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="hover:text-foreground">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2">
                {socialLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-card p-2.5 text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                    aria-label={item.name}
                  >
                    <item.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Crafted for clarity—no clutter in the chrome.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <span className="text-border">·</span>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <span className="text-border">·</span>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
