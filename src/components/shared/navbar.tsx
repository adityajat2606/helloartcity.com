'use client'

import { Fragment, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, User, FileText, Building2, LayoutGrid, Tag, Image as ImageIcon, ChevronRight, MapPin, Plus, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { NAVBAR_OVERRIDE_ENABLED, NavbarOverride } from '@/overrides/navbar'

const NavbarAuthControls = dynamic(() => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls), {
  ssr: false,
  loading: () => null,
})

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

/** Light header aligned with About / PageShell: white bar, slate text, sky CTAs. */
const aboutLikeNav = {
  shell:
    'border-b border-border bg-white/95 text-foreground shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl',
  logo: 'rounded-[1.35rem] border border-border bg-muted/50 shadow-sm',
  active: 'bg-primary text-primary-foreground shadow-sm',
  idle: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  cta: 'rounded-full bg-primary text-primary-foreground hover:bg-primary/90',
  mobile: 'border-t border-border bg-background',
} as const

const variantClasses = {
  'compact-bar': aboutLikeNav,
  'editorial-bar': aboutLikeNav,
  'floating-bar': aboutLikeNav,
  'utility-bar': aboutLikeNav,
} as const

const directoryPalette = {
  'directory-clean': {
    shell: 'border-b border-border bg-white/94 text-foreground shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl',
    logo: 'rounded-2xl border border-border bg-muted/50',
    nav: 'text-muted-foreground hover:text-foreground',
    search: 'border border-border bg-muted/50 text-muted-foreground',
    cta: 'bg-primary text-primary-foreground hover:bg-primary/90',
    post: 'border border-border bg-card text-foreground hover:bg-muted/50',
    mobile: 'border-t border-border bg-background',
  },
  'market-utility': {
    shell: 'border-b border-border bg-white/94 text-foreground shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl',
    logo: 'rounded-2xl border border-border bg-muted/50',
    nav: 'text-muted-foreground hover:text-foreground',
    search: 'border border-border bg-muted/50 text-muted-foreground',
    cta: 'bg-primary text-primary-foreground hover:bg-primary/90',
    post: 'border border-border bg-card text-foreground hover:bg-muted/50',
    mobile: 'border-t border-border bg-background',
  },
} as const

export function Navbar() {
  if (NAVBAR_OVERRIDE_ENABLED) {
    return <NavbarOverride />
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const { recipe } = getFactoryState()

  const emphasis = useMemo(() => new Set<TaskKey>(Array.from(siteContent.navbar.emphasizeTaskKeys as readonly TaskKey[])), [])
  const navigation = useMemo(() => {
    return SITE_CONFIG.tasks.filter((task) => {
      if (!task.enabled) return false
      if (task.key === 'profile' && !emphasis.has('profile')) return false
      return true
    })
  }, [emphasis])
  const primaryNavigation = useMemo(() => {
    const emphasized = navigation.filter((t) => emphasis.has(t.key))
    return emphasized.length ? emphasized : navigation.slice(0, 1)
  }, [navigation, emphasis])
  const overflowTaskNav = useMemo(
    () => navigation.filter((t) => !emphasis.has(t.key)),
    [navigation, emphasis]
  )
  const mobileNavigation = useMemo(
    () => [
      ...primaryNavigation.map((task) => ({
        name: task.label,
        href: task.route,
        icon: taskIcons[task.key] || LayoutGrid,
        tier: 'primary' as const,
      })),
      ...siteContent.navbar.secondaryNavLinks.map((link) => ({
        name: link.label,
        href: link.href,
        icon: FileText,
        tier: 'secondary' as const,
      })),
      ...overflowTaskNav.map((task) => ({
        name: task.label,
        href: task.route,
        icon: taskIcons[task.key] || LayoutGrid,
        tier: 'more' as const,
      })),
    ],
    [primaryNavigation, overflowTaskNav]
  )
  const primaryTask = SITE_CONFIG.tasks.find((task) => task.key === recipe.primaryTask && task.enabled) || primaryNavigation[0]
  const isDirectoryProduct = recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'
  const showDeskRail = !isDirectoryProduct && (recipe.primaryTask === 'image' || recipe.primaryTask === 'profile')

  if (isDirectoryProduct) {
    const palette = directoryPalette[(recipe.brandPack === 'market-utility' ? 'market-utility' : 'directory-clean') as keyof typeof directoryPalette]

    return (
      <header className={cn('sticky top-0 z-50 w-full', palette.shell)}>
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className={cn('flex h-16 w-16 items-center justify-center overflow-hidden p-1', palette.logo)}>
                <img
                  src="/favicon.png?v=202604182"
                  alt={`${SITE_CONFIG.name} logo`}
                  width={64}
                  height={64}
                  className="h-full w-full origin-center scale-[1.2] object-contain"
                />
              </div>
              <div className="min-w-0 hidden sm:block">
                <span className="block truncate text-xl font-semibold">{SITE_CONFIG.name}</span>
                <span className="block text-[10px] uppercase tracking-[0.24em] opacity-60">{siteContent.navbar.tagline}</span>
              </div>
            </Link>

            <div className="hidden items-center gap-5 xl:flex">
              {primaryNavigation.map((task) => {
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('text-sm font-semibold transition-colors', isActive ? 'text-foreground' : palette.nav)}>
                    {task.label}
                  </Link>
                )
              })}
              {siteContent.navbar.secondaryNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link key={link.href} href={link.href} className={cn('text-sm font-semibold transition-colors', isActive ? 'text-foreground' : palette.nav)}>
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className={cn('flex w-full max-w-xl items-center gap-3 rounded-full px-4 py-3', palette.search)}>
              <Search className="h-4 w-4" />
              <span className="text-sm">Find businesses, spaces, and local services</span>
              <div className="ml-auto hidden items-center gap-1 text-xs opacity-75 md:flex">
                <MapPin className="h-3.5 w-3.5" />
                Local discovery
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <NavbarAuthControls />
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" size="sm" asChild className="rounded-full px-4">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className={cn('rounded-full', palette.cta)}>
                  <Link href="/register">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Listing
                  </Link>
                </Button>
              </div>
            )}

            <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className={palette.mobile}>
            <div className="space-y-2 px-4 py-4">
              <div className={cn('mb-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium', palette.search)}>
                <Search className="h-4 w-4" />
                Find businesses, spaces, and services
              </div>
              {mobileNavigation.map((item, idx) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Fragment key={`${item.tier}-${item.href}-${item.name}`}>
                    {item.tier === 'more' && mobileNavigation[idx - 1]?.tier !== 'more' ? (
                      <p className="px-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Also on this platform</p>
                    ) : null}
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? 'bg-foreground text-background' : palette.post)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </Fragment>
                )
              })}
            </div>
          </div>
        )}
      </header>
    )
  }

  const style = variantClasses[recipe.navbar]
  const isFloating = recipe.navbar === 'floating-bar'
  const isEditorial = recipe.navbar === 'editorial-bar'
  const isUtility = recipe.navbar === 'utility-bar'

  return (
    <div className="sticky top-0 z-50 flex w-full">
      {showDeskRail ? (
        <aside className="hidden w-[56px] shrink-0 flex-col items-center gap-5 border-r border-border bg-muted/40 py-5 md:flex" aria-label="Quick navigation">
          <Link
            href="/"
            className={cn(
              'rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary',
              pathname === '/' && 'bg-primary/15 text-primary'
            )}
          >
            <Home className="h-5 w-5" />
          </Link>
          <Link
            href="/images"
            className={cn(
              'rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary',
              pathname.startsWith('/images') && 'bg-primary/15 text-primary'
            )}
          >
            <ImageIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/profile"
            className={cn(
              'rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary',
              pathname.startsWith('/profile') && 'bg-primary/15 text-primary'
            )}
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/search"
            className={cn(
              'rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary',
              pathname.startsWith('/search') && 'bg-primary/15 text-primary'
            )}
          >
            <Search className="h-5 w-5" />
          </Link>
        </aside>
      ) : null}
      <header className={cn('min-w-0 flex-1', style.shell)}>
      <nav className={cn('mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8', isFloating ? 'h-24 pt-4' : 'h-20')}>
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-7">
          <Link href="/" className="flex shrink-0 items-center gap-3 whitespace-nowrap pr-2">
            <div className={cn('flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden p-1', style.logo)}>
              <img
                src="/favicon.png?v=202604182"
                alt={`${SITE_CONFIG.name} logo`}
                width={64}
                height={64}
                className="h-full w-full origin-center scale-[1.2] object-contain"
              />
            </div>
            <div className="min-w-0 hidden sm:block">
              <span className="block truncate text-xl font-semibold text-slate-900">{SITE_CONFIG.name}</span>
              <span className="hidden text-[10px] uppercase tracking-[0.28em] text-slate-500 sm:block">{siteContent.navbar.tagline}</span>
            </div>
          </Link>

          {isEditorial ? (
            <div className="hidden min-w-0 flex-1 items-center gap-4 xl:flex">
              <div className="h-px flex-1 bg-slate-200" />
              {primaryNavigation.map((task) => {
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('text-sm font-semibold uppercase tracking-[0.18em] transition-colors', isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900')}>
                    {task.label}
                  </Link>
                )
              })}
              {siteContent.navbar.secondaryNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link key={link.href} href={link.href} className={cn('text-sm font-semibold uppercase tracking-[0.18em] transition-colors', isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900')}>
                    {link.label}
                  </Link>
                )
              })}
              <div className="h-px flex-1 bg-slate-200" />
            </div>
          ) : isFloating ? (
            <div className="hidden min-w-0 flex-1 items-center gap-2 overflow-hidden xl:flex">
              {primaryNavigation.map((task) => {
                const Icon = taskIcons[task.key] || LayoutGrid
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                    <Icon className="h-4 w-4" />
                    <span>{task.label}</span>
                  </Link>
                )
              })}
              <span className="mx-1 hidden h-6 w-px bg-slate-200 2xl:inline" aria-hidden />
              {siteContent.navbar.secondaryNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link key={link.href} href={link.href} className={cn('rounded-full px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap', isActive ? style.active : style.idle)}>
                    {link.label}
                  </Link>
                )
              })}
            </div>
          ) : isUtility ? (
            <div className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
              {primaryNavigation.map((task) => {
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('rounded-lg px-3 py-2 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                    {task.label}
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="hidden min-w-0 flex-1 items-center gap-1 overflow-hidden xl:flex">
              {primaryNavigation.map((task) => {
                const Icon = taskIcons[task.key] || LayoutGrid
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap', isActive ? style.active : style.idle)}>
                    <Icon className="h-4 w-4" />
                    <span>{task.label}</span>
                  </Link>
                )
              })}
              <span className="mx-1 hidden h-6 w-px bg-slate-200 2xl:inline" aria-hidden />
              {siteContent.navbar.secondaryNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link key={link.href} href={link.href} className={cn('rounded-full px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap', isActive ? style.active : style.idle)}>
                    {link.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" asChild className={cn('hidden rounded-full md:flex', isFloating && 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')}>
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <NavbarAuthControls />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild className={cn('rounded-full px-4', isFloating && 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')}>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className={style.cta}>
                <Link href="/register">{isEditorial ? 'Subscribe' : isUtility ? 'Post Now' : 'Join'}</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={cn('rounded-full lg:hidden', isFloating && 'text-slate-800 hover:bg-slate-100')}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {isFloating && primaryTask ? (
        <div className="mx-auto hidden max-w-7xl px-4 pb-3 sm:px-6 lg:block lg:px-8">
          <Link
            href={primaryTask.route}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900"
          >
            Featured surface
            <span className="text-slate-900">{primaryTask.label}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </Link>
        </div>
      ) : null}

      {isMobileMenuOpen && (
        <div className={style.mobile}>
          <div className="space-y-2 px-4 py-4">
            <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="mb-3 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground">
              <Search className="h-4 w-4" />
              Search the site
            </Link>
            {mobileNavigation.map((item, idx) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Fragment key={`${item.tier}-${item.href}-${item.name}`}>
                  {item.tier === 'more' && mobileNavigation[idx - 1]?.tier !== 'more' ? (
                    <p className="px-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Also on this platform</p>
                  ) : null}
                  <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </Fragment>
              )
            })}
          </div>
        </div>
      )}
    </header>
    </div>
  )
}
