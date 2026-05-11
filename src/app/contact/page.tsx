import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'
import { LIGHT_PAGE_GRADIENT, LIGHT_PAGE_SURFACE } from '@/lib/light-page-surface'

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'hello@helloartcity.com'
  const mailtoHref = `mailto:${contactEmail}`
  const tone = {
    shell: `${LIGHT_PAGE_GRADIENT} min-h-screen antialiased`,
    panel: LIGHT_PAGE_SURFACE.card,
    soft: LIGHT_PAGE_SURFACE.cardMuted,
    muted: LIGHT_PAGE_SURFACE.muted,
    action: LIGHT_PAGE_SURFACE.action,
  }
  const lanes =
    productKind === 'directory'
      ? [
          {
            icon: Building2,
            title: 'Business onboarding',
            body: 'Add listings, verify operational details, and bring your business surface live quickly.',
          },
          {
            icon: Phone,
            title: 'Partnership support',
            body: 'Talk through bulk publishing, local growth, and operational setup questions.',
          },
          {
            icon: MapPin,
            title: 'Coverage requests',
            body: 'Need a new geography or category lane? We can shape the directory around it.',
          },
        ]
      : productKind === 'editorial'
        ? [
            {
              icon: FileText,
              title: 'Editorial submissions',
              body: 'Pitch essays, columns, and long-form ideas that fit the publication.',
            },
            {
              icon: Mail,
              title: 'Newsletter partnerships',
              body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.',
            },
            {
              icon: Sparkles,
              title: 'Contributor support',
              body: 'Get help with voice, formatting, and publication workflow questions.',
            },
          ]
        : productKind === 'visual'
          ? [
              {
                icon: ImageIcon,
                title: 'Creator collaborations',
                body: 'Discuss gallery launches, creator features, and visual campaigns.',
              },
              {
                icon: Sparkles,
                title: 'Licensing and use',
                body: 'Reach out about usage rights, commercial requests, and visual partnerships.',
              },
              {
                icon: Mail,
                title: 'Media kits',
                body: 'Request creator decks, editorial support, or visual feature placement.',
              },
            ]
          : [
              {
                icon: Bookmark,
                title: 'Collection submissions',
                body: 'Suggest resources, boards, and links that deserve a place in the library.',
              },
              {
                icon: Mail,
                title: 'Resource partnerships',
                body: 'Coordinate curation projects, reference pages, and link programs.',
              },
              {
                icon: Sparkles,
                title: 'Curator support',
                body: 'Need help organizing shelves, collections, or profile-connected boards?',
              },
            ]

  return (
    <div className={tone.shell}>
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.07] via-background to-muted/35">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,153,107,0.22),transparent)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Contact {SITE_CONFIG.name}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Routing that matches your goal—not a one-size-fits-all queue.
            </h1>
            <p className={`mt-5 max-w-2xl text-base leading-relaxed ${tone.muted}`}>
              Tell us what you are trying to publish, fix, or launch. We will steer your note to the right lane with the same
              warm layout and primary accent as the home page.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {['Fast first response', 'Clear next steps', 'Product-aware routing'].map((label) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-card/90 px-4 py-3 text-sm font-medium text-foreground shadow-sm"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-5">
              {lanes.map((lane) => (
                <div key={lane.title} className={`rounded-[1.6rem] border border-border p-6 shadow-sm ${tone.soft}`}>
                  <lane.icon className="h-5 w-5 text-primary" />
                  <h2 className="mt-3 text-xl font-semibold text-foreground">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-relaxed ${tone.muted}`}>{lane.body}</p>
                </div>
              ))}
            </div>

            <div className={`rounded-[2rem] border border-border p-7 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ${tone.panel}`}>
              <h2 className="text-2xl font-semibold text-foreground">Send a message</h2>
              <p className={`mt-2 text-sm ${tone.muted}`}>
                Add enough context for us to reply with a concrete next step—links, screenshots, and timelines help.
              </p>
              <div className={`mt-4 rounded-2xl border border-border px-4 py-3 text-sm ${tone.soft}`}>
                Prefer email? Write to{' '}
                <a href={mailtoHref} className="font-semibold text-foreground underline-offset-4 hover:underline">
                  {contactEmail}
                </a>
                .
              </div>
              <form className="mt-6 grid gap-4">
                <input className={`h-12 rounded-xl px-4 text-sm ${LIGHT_PAGE_SURFACE.input}`} placeholder="Your name" />
                <input className={`h-12 rounded-xl px-4 text-sm ${LIGHT_PAGE_SURFACE.input}`} placeholder="Email address" />
                <input className={`h-12 rounded-xl px-4 text-sm ${LIGHT_PAGE_SURFACE.input}`} placeholder="What do you need help with?" />
                <textarea
                  className={`min-h-[180px] rounded-2xl px-4 py-3 text-sm ${LIGHT_PAGE_SURFACE.input}`}
                  placeholder="Share the full context so we can respond with the right next step."
                />
                <button type="submit" className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold ${tone.action}`}>
                  Send message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
