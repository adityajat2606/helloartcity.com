import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'

const sections = [
  {
    title: 'Agreement',
    body:
      'By accessing or using the service, you agree to these terms and our policies referenced here (including the privacy policy). If you do not agree, do not use the service.',
  },
  {
    title: 'Eligibility & accounts',
    body:
      'You must provide accurate information, keep credentials secure, and promptly notify us of unauthorized access. You are responsible for activity under your account except where required otherwise by law.',
  },
  {
    title: 'Content & license',
    body:
      'You retain rights to content you create, and you grant the platform a license to host, display, distribute, and adapt that content as needed to operate features you use—consistent with how the product works (for example, rendering pages, thumbnails, and search).',
  },
  {
    title: 'Acceptable use',
    body:
      'Do not misuse the service: no illegal activity, harassment, spam, malware, scraping that harms stability, attempts to bypass security, or interference with other users. We may investigate and take action, including removal or suspension.',
  },
  {
    title: 'Third parties',
    body:
      'The service may link to third-party sites or integrate third-party tools. Those services have their own terms; we are not responsible for their content or practices.',
  },
  {
    title: 'Disclaimers',
    body:
      'The service is provided “as available.” To the fullest extent permitted by law, we disclaim warranties not expressly stated here, including implied warranties of merchantability or fitness for a particular purpose.',
  },
  {
    title: 'Limitation of liability',
    body:
      'To the fullest extent permitted by law, our total liability for claims arising from these terms or the service is limited to the greater of amounts you paid us in the prior twelve months for the service (if any) or fifty dollars, except where liability cannot be limited by law.',
  },
  {
    title: 'Indemnity',
    body:
      'You agree to indemnify and hold harmless the platform and its team from claims arising from your content, your use of the service, or your violation of these terms—subject to applicable law.',
  },
  {
    title: 'Termination',
    body:
      'You may stop using the service at any time. We may suspend or terminate access for violations, risk, legal reasons, or operational needs, with notice where appropriate.',
  },
  {
    title: 'Changes',
    body:
      'We may update these terms. Continued use after changes become effective constitutes acceptance of the revised terms, except where additional consent is required.',
  },
  {
    title: 'Contact',
    body:
      'For questions about these terms, contact us through the site’s contact options.',
  },
]

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of service"
      description={`The rules for using ${SITE_CONFIG.name}—aligned with the same visual system as the home page for a consistent reading experience.`}
      actions={
        <Button variant="outline" asChild className="rounded-full border-border bg-card shadow-sm">
          <Link href="/contact">Questions? Contact us</Link>
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
              <p className="text-xs text-muted-foreground">Governs use of {SITE_CONFIG.name}</p>
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
