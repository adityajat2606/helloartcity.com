import { CheckCircle2, Image as ImageIcon } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { LoginForm } from '@/components/auth/login-form'
import { LIGHT_PAGE_GRADIENT, LIGHT_PAGE_SURFACE } from '@/lib/light-page-surface'
import { LOGIN_PAGE_OVERRIDE_ENABLED, LoginPageOverride } from '@/overrides/login-page'

const loginConfig = {
  shell: `${LIGHT_PAGE_GRADIENT} min-h-screen antialiased`,
  panel: LIGHT_PAGE_SURFACE.card,
  side: `${LIGHT_PAGE_SURFACE.cardMuted} border border-border`,
  muted: LIGHT_PAGE_SURFACE.muted,
  action: LIGHT_PAGE_SURFACE.action,
  icon: ImageIcon,
  title: 'Sign in to Hello Art City',
  body:
    'Access saved work, gallery tools, and profile features. Your session stays on this device after sign-in—same calm palette and cyan accent as the home page.',
}

const bullets = [
  'Task-aware flows that feel native to this product family',
  'Warm surfaces and primary accents consistent with marketing pages',
  'Fewer generic admin patterns—more focus on what you publish',
]

export default function LoginPage() {
  if (LOGIN_PAGE_OVERRIDE_ENABLED) {
    return <LoginPageOverride />
  }

  const Icon = loginConfig.icon

  return (
    <div className={loginConfig.shell}>
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.07] via-background to-muted/35">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,153,107,0.22),transparent)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Welcome back</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{loginConfig.title}</h1>
            <p className={`mt-4 max-w-2xl text-sm leading-relaxed sm:text-base ${loginConfig.muted}`}>{loginConfig.body}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
            <div className={`rounded-[2rem] p-8 shadow-sm ${loginConfig.side}`}>
              <div className="inline-flex rounded-2xl border border-border bg-background p-3">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-foreground sm:text-2xl">Why sign in here</h2>
              <p className={`mt-3 text-sm leading-relaxed ${loginConfig.muted}`}>
                Authentication is styled like the rest of the site—light cards, soft borders, and a confident primary button.
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

            <div className={`rounded-[2rem] border border-border p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ${loginConfig.panel}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Credentials</p>
              <LoginForm actionClass={loginConfig.action} mutedClass={loginConfig.muted} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
