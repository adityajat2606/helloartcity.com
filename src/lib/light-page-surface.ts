/**
 * Surfaces aligned with the About page: warm canvas (`--background` / `--card`),
 * `border-border`, bronze primary (`--primary` ~#C9996B), generous radius.
 */
export const LIGHT_PAGE_SURFACE = {
  shell: 'min-h-screen bg-background text-foreground antialiased',
  canvas: 'bg-background',
  headerBand: 'border-b border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
  /** Main content panels — soft beige card from theme */
  card: 'rounded-3xl border border-border bg-card text-card-foreground shadow-sm',
  cardMuted: 'rounded-2xl border border-border bg-muted/70',
  muted: 'text-muted-foreground',
  /** Primary CTA — matches Contact Us / Create */
  action: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  panel: 'rounded-3xl border border-border bg-card shadow-sm',
  panelSoft: 'rounded-2xl border border-border bg-muted/50',
  input: 'border border-input bg-background text-foreground rounded-xl',
} as const

export const LIGHT_PAGE_GRADIENT =
  'bg-[linear-gradient(180deg,#f5f3f1_0%,#ede9e6_45%,#dde5e2_100%)] text-foreground'

/**
 * Marketing / home helpers — same family as About.
 */
export const LIGHT_ABOUT = {
  canvas: 'bg-background text-foreground antialiased',
  heroWash:
    'bg-[linear-gradient(180deg,#faf8f6_0%,#ede9e6_48%,#d8e4e0_100%)]',
  panel: 'rounded-3xl border border-border bg-card shadow-sm',
  soft: 'rounded-2xl border border-border bg-muted/60',
  muted: 'text-muted-foreground',
  title: 'text-foreground',
  badge: 'border border-primary/25 bg-primary/10 text-primary shadow-sm',
  badgeNeutral: 'border border-border bg-card text-foreground shadow-sm',
  action: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  actionOutline: 'border border-border bg-background text-foreground hover:bg-muted',
  link: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline',
  border: 'border-border',
} as const
