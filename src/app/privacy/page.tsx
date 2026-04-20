import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'

const sections = [
  {
    title: 'Overview',
    body:
      'This policy explains how we collect, use, and protect information when you use the site. We aim for plain language and practical detail so you know what to expect.',
  },
  {
    title: 'Data we collect',
    body:
      'We may collect account details you provide (such as name and email), content you submit, usage signals that help us improve performance and discovery, and technical data like device type and approximate region to keep the service reliable.',
  },
  {
    title: 'How we use data',
    body:
      'We use data to operate features, personalize relevant parts of the experience, improve search and recommendations, communicate about your account, detect abuse, and meet legal obligations. We do not sell your personal information.',
  },
  {
    title: 'Cookies & similar tech',
    body:
      'We may use cookies or local storage for sign-in sessions, preferences, and measurement. You can control many cookies through your browser settings; some features may not work if essential cookies are disabled.',
  },
  {
    title: 'Sharing',
    body:
      'We share information with service providers who help us host, analyze, or secure the platform—under contracts that limit use to providing those services. We may disclose information if required by law or to protect users and the service.',
  },
  {
    title: 'Retention',
    body:
      'We keep information only as long as needed for the purposes described here, unless a longer period is required for legal, security, or operational reasons.',
  },
  {
    title: 'Your choices',
    body:
      'You can update certain account information, manage email preferences where available, and request deletion of your account subject to applicable law and legitimate business needs (such as fraud prevention or legal holds).',
  },
  {
    title: 'Security',
    body:
      'We use reasonable administrative, technical, and organizational safeguards designed to protect information. No method of transmission or storage is perfectly secure; please use strong passwords and protect your credentials.',
  },
  {
    title: 'Children',
    body:
      'The service is not directed to children under the age where parental consent is required in your region. If you believe we have collected information from a child improperly, contact us so we can take appropriate steps.',
  },
  {
    title: 'International users',
    body:
      'If you access the service from outside your home region, your information may be processed in countries with different data protection laws. We take steps designed to provide appropriate protections consistent with this policy.',
  },
  {
    title: 'Changes',
    body:
      'We may update this policy from time to time. When we make material changes, we will provide notice as appropriate—such as posting the new date and, where required, additional notice.',
  },
  {
    title: 'Contact',
    body:
      'Questions about privacy? Reach us through the contact options on the site. Please include enough detail for us to help quickly.',
  },
]

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy policy"
      description={`How ${SITE_CONFIG.name} collects, uses, and protects information—presented in the same calm layout as the rest of the product.`}
      actions={
        <Button variant="outline" asChild className="rounded-full border-border bg-card shadow-sm">
          <Link href="/contact">Contact privacy</Link>
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <Card className="rounded-3xl border-border bg-card shadow-sm">
            <CardContent className="space-y-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">On this page</p>
              <nav className="flex flex-col gap-2 text-sm">
                {sections.map((section) => (
                  <a
                    key={section.title}
                    href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">Last updated: April 18, 2026</p>
              <p className="text-xs text-muted-foreground">Applies to visitors and account holders of {SITE_CONFIG.name}</p>
            </div>
            {sections.map((section) => (
              <section
                key={section.title}
                id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                className="scroll-mt-28 rounded-2xl border border-border bg-muted/30 p-5 sm:p-6"
              >
                <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
