'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { LIGHT_PAGE_GRADIENT } from '@/lib/light-page-surface'

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className={`min-h-screen ${LIGHT_PAGE_GRADIENT} antialiased`}>
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/[0.07] via-background to-muted/35">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,153,107,0.22),transparent)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
                {description && (
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
                )}
              </div>
              {actions && (
                <div className="flex flex-shrink-0 flex-wrap gap-3 [&_a]:rounded-full [&_button]:rounded-full">{actions}</div>
              )}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          {children}
        </section>
      </main>
      <Footer />
    </div>
  )
}
