import Link from 'next/link'
import { Compass, HeartHandshake, Layers, Sparkles, Target } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockTeamMembers } from '@/data/mock-data'
import { SITE_CONFIG } from '@/lib/site-config'

const highlights = [
  { label: 'Creators onboarded', value: '12k+' },
  { label: 'Bookmarks shared', value: '180k' },
  { label: 'Listings published', value: '8.6k' },
]

const pillars = [
  {
    title: 'Curated by people',
    description:
      'Trusted recommendations and human judgment sit ahead of endless algorithmic feeds—so the signal stays high.',
    icon: HeartHandshake,
  },
  {
    title: 'Designed for focus',
    description:
      'A calm, legible interface helps you scan fast, compare options, and move to the next step without friction.',
    icon: Target,
  },
  {
    title: 'Built to share',
    description:
      'Collections, profiles, and publishing tools work together so teams can ship surfaces and keep them fresh.',
    icon: Layers,
  },
]

const milestones = [
  { phase: '01', title: 'Discover', copy: 'Browse listings, articles, and visual work in one warm, consistent shell.' },
  { phase: '02', title: 'Save & organize', copy: 'Bookmark what matters, group it cleanly, and revisit without digging.' },
  { phase: '03', title: 'Publish & grow', copy: 'Ship updates, manage presence, and connect with the right audience.' },
]

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a modern platform for creators, communities, and curated business discovery—built with the same calm palette and cyan accent as the home experience.`}
      actions={
        <>
          <Button variant="outline" asChild className="rounded-full border-border bg-card shadow-sm">
            <Link href="/team">Meet the team</Link>
          </Button>
          <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            <Link href="/contact">Contact us</Link>
          </Button>
        </>
      }
    >
      <div className="space-y-12">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <Card className="rounded-3xl border-border bg-card shadow-sm">
            <CardContent className="space-y-6 px-6 py-8 sm:px-8">
              <Badge variant="secondary" className="rounded-full border border-primary/25 bg-primary/10 text-primary shadow-sm">
                <Compass className="mr-1.5 h-3.5 w-3.5" />
                Our story
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                One home for knowledge, discovery, and community.
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {SITE_CONFIG.name} brings together publishing, listings, and social bookmarking so teams can move faster
                and keep their best resources close. We obsess over clarity: fewer noisy patterns, more room for your work
                to breathe.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
                  >
                    <div className="text-2xl font-semibold text-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-gradient-to-br from-primary/[0.06] via-card to-muted/30 shadow-sm">
            <CardContent className="flex h-full flex-col justify-between px-6 py-8 sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Why we exist</p>
                <h3 className="mt-3 text-xl font-semibold text-foreground">Make serious work feel approachable.</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Whether you run a studio, a storefront, or a newsletter, you deserve tooling that respects your brand and
                  your visitors’ time—without looking like generic admin chrome.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-background/80 p-4">
                <Sparkles className="h-8 w-8 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  The same warm background, card surfaces, and primary accent you see on the home page carry through here—so
                  every page feels like part of one product.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">What we optimize for</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Three principles guide product decisions, content design, and how we support teams on the platform.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="rounded-3xl border-border bg-card shadow-sm transition-transform hover:-translate-y-0.5">
                <CardContent className="px-6 py-6">
                  <div className="inline-flex rounded-2xl border border-border bg-muted/60 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">How people use {SITE_CONFIG.name}</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            A simple rhythm—whether you are exploring, saving, or publishing—keeps momentum high without extra noise.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {milestones.map((m) => (
              <div key={m.phase} className="relative rounded-2xl border border-dashed border-border/80 bg-muted/30 p-5">
                <span className="text-xs font-bold tracking-widest text-primary">{m.phase}</span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">People behind the product</h2>
            <p className="mt-1 text-sm text-muted-foreground">A snapshot of the team building the experience you see today.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {mockTeamMembers.map((member) => (
              <Card
                key={member.id}
                className="rounded-3xl border-border bg-card shadow-sm transition-transform hover:-translate-y-1"
              >
                <CardContent className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                  <p className="mt-3 text-xs text-muted-foreground/90">{member.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
