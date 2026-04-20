import Link from 'next/link'
import { BookOpen, LifeBuoy, MessageCircle, Search, Zap } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { mockFaqs } from '@/data/mock-data'

const topics = [
  {
    title: 'Getting started',
    description: 'Create your account, set up your profile, and publish your first post with a guided flow.',
    icon: Zap,
  },
  {
    title: 'Bookmarks & collections',
    description: 'Save links, organize folders, share boards, and keep reference material one click away.',
    icon: BookOpen,
  },
  {
    title: 'Listings & classifieds',
    description: 'Manage business surfaces, categories, and updates with clear, structured fields.',
    icon: Search,
  },
  {
    title: 'Account & billing',
    description: 'Understand sign-in, session basics, and where to go when something looks off.',
    icon: LifeBuoy,
  },
]

const quickLinks = [
  { label: 'Search the site', href: '/search', hint: 'Query across tasks' },
  { label: 'Contact support', href: '/contact', hint: 'We route by intent' },
  { label: 'Privacy overview', href: '/privacy', hint: 'Data & choices' },
]

export default function HelpPage() {
  return (
    <PageShell
      title="Help center"
      description="Guides, FAQs, and shortcuts—styled like the rest of the site so help never feels like a separate product."
      actions={
        <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
          <Link href="/contact">Contact support</Link>
        </Button>
      }
    >
      <div className="space-y-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => {
            const Icon = topic.icon
            return (
              <Card
                key={topic.title}
                className="rounded-3xl border-border bg-card shadow-sm transition-transform hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="inline-flex rounded-2xl border border-border bg-muted/60 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-foreground">{topic.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <Card className="rounded-3xl border-border bg-gradient-to-br from-primary/[0.05] via-card to-muted/30 shadow-sm">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <MessageCircle className="h-3.5 w-3.5" />
                Quick paths
              </div>
              <h3 className="text-lg font-semibold text-foreground sm:text-xl">Jump to the right place</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                These entry points mirror the home page palette—warm surfaces, crisp borders, and cyan accents—so navigation
                stays familiar.
              </p>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary">{item.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-card shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-foreground">Frequently asked questions</h3>
              <p className="mt-1 text-sm text-muted-foreground">Straight answers to common setup and workflow questions.</p>
              <Accordion type="single" collapsible className="mt-6">
                {mockFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-border">
                    <AccordionTrigger className="text-left text-foreground hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
