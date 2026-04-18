import Link from 'next/link'
import { CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { LIGHT_PAGE_GRADIENT, LIGHT_PAGE_SURFACE } from '@/lib/light-page-surface'
import { REGISTER_PAGE_OVERRIDE_ENABLED, RegisterPageOverride } from '@/overrides/register-page'

const registerConfig = {
  shell: `${LIGHT_PAGE_GRADIENT} min-h-screen antialiased`,
  panel: LIGHT_PAGE_SURFACE.card,
  side: `${LIGHT_PAGE_SURFACE.cardMuted} border border-border`,
  muted: LIGHT_PAGE_SURFACE.muted,
  action: LIGHT_PAGE_SURFACE.action,
  icon: ImageIcon,
  title: 'Create your Hello Art City account',
  body:
    'Set up a visual-first profile with gallery publishing, identity surfaces, and profile-led discovery—wrapped in the same warm theme as the home page.',
}

const bullets = [
  'Onboarding tuned to visual publishing—not a generic template',
  'Profile, gallery, and discovery aligned in one coherent shell',
  'Marketing and app chrome that share one color system',
]

export default function RegisterPage() {
  if (REGISTER_PAGE_OVERRIDE_ENABLED) {
    return <RegisterPageOverride />
  }

  const Icon = registerConfig.icon

  return (
    <div className={registerConfig.shell}>
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.07] via-background to-muted/35">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,153,107,0.22),transparent)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Join the community</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{registerConfig.title}</h1>
            <p className={`mt-4 max-w-2xl text-sm leading-relaxed sm:text-base ${registerConfig.muted}`}>{registerConfig.body}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <div className={`rounded-[2rem] p-8 shadow-sm ${registerConfig.side}`}>
              <div className="inline-flex rounded-2xl border border-border bg-background p-3">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-foreground sm:text-2xl">What you unlock</h2>
              <p className={`mt-3 text-sm leading-relaxed ${registerConfig.muted}`}>
                Registration uses the same surfaces you see across marketing pages—rounded cards, soft borders, and a crisp
                primary call-to-action.
              </p>
              <div className="mt-8 grid gap-3">
                {bullets.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-[1.5rem] border border-border bg-card px-4 py-4 text-sm text-foreground shadow-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-[2rem] border border-border p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ${registerConfig.panel}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Create account</p>
              <form className="mt-6 grid gap-4">
                <input className={`h-12 rounded-xl px-4 text-sm ${LIGHT_PAGE_SURFACE.input}`} placeholder="Full name" />
                <input className={`h-12 rounded-xl px-4 text-sm ${LIGHT_PAGE_SURFACE.input}`} placeholder="Email address" />
                <input className={`h-12 rounded-xl px-4 text-sm ${LIGHT_PAGE_SURFACE.input}`} placeholder="Password" type="password" />
                <input
                  className={`h-12 rounded-xl px-4 text-sm ${LIGHT_PAGE_SURFACE.input}`}
                  placeholder="What are you creating or publishing?"
                />
                <button type="submit" className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold ${registerConfig.action}`}>
                  Create account
                </button>
              </form>
              <div className={`mt-6 flex items-center justify-between text-sm ${registerConfig.muted}`}>
                <span>Already have an account?</span>
                <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                  <Sparkles className="h-4 w-4" />
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
