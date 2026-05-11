import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Sparkles } from 'lucide-react'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG } from '@/lib/site-config'
import { TaskPostCard } from '@/components/shared/task-post-card'

export const revalidate = 3

const matchText = (value: string, query: string) => value.toLowerCase().includes(query)

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')

const compactText = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase()
}

const tips = [
  'Try neighborhood names, categories, or a business type.',
  'Use a few precise words—titles and summaries rank highly.',
  'Filters in the URL (`category`, `task`) refine the feed before search.',
]

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.flatMap((task) => getMockPostsForTask(task.key))

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === 'object' ? post.content : {}
    const typeText = compactText((content as any).type)
    if (typeText === 'comment') return false
    if (typeText === 'profile') return false
    const description = compactText((content as any).description)
    const body = compactText((content as any).body)
    const excerpt = compactText((content as any).excerpt)
    const categoryText = compactText((content as any).category)
    const tags = Array.isArray(post.tags) ? post.tags.join(' ') : ''
    const tagsText = compactText(tags)
    const derivedCategory = categoryText || tagsText
    if (category && !derivedCategory.includes(category)) return false
    if (typeText === 'profile') return false
    if (task && typeText && typeText !== task) return false
    if (!normalized.length) return true
    return (
      matchText(compactText(post.title || ''), normalized) ||
      matchText(compactText(post.summary || ''), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    )
  })

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24)

  return (
    <PageShell
      title="Search"
      description={
        query
          ? `Showing matches for “${query}” across enabled tasks.`
          : 'Scan the latest posts across every task—same warm surfaces and primary accent as the home page.'
      }
      actions={
        <form action="/search" className="flex w-full gap-2 sm:w-auto">
          <input type="hidden" name="master" value="1" />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {task ? <input type="hidden" name="task" value={task} /> : null}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={query} placeholder="Search across tasks…" className="h-11 border-border pl-9 shadow-sm" />
          </div>
          <Button type="submit" className="h-11 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            Search
          </Button>
        </form>
      }
    >
      <div className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-border bg-gradient-to-br from-primary/[0.05] via-card to-muted/30 shadow-sm">
            <CardContent className="space-y-3 p-6 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Search tips
              </div>
              <h2 className="text-lg font-semibold text-foreground">Get better results, faster</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {tips.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-card shadow-sm">
            <CardContent className="space-y-3 p-6 sm:p-7">
              <h2 className="text-lg font-semibold text-foreground">Need a human?</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                If you are trying to list a business, pitch editorial work, or resolve an account issue, the contact page routes
                your note to the right lane.
              </p>
              <Button asChild variant="outline" className="rounded-full border-border bg-background shadow-sm">
                <Link href="/contact">Go to contact</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {category || task ? (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Active refinements:</span>
            {category ? (
              <span className="rounded-full border border-border bg-muted/60 px-3 py-1">category: {category}</span>
            ) : null}
            {task ? <span className="rounded-full border border-border bg-muted/60 px-3 py-1">task: {task}</span> : null}
            <Link href="/search" className="text-primary underline-offset-4 hover:underline">
              Clear URL filters
            </Link>
          </div>
        ) : null}

        {results.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => {
              const taskKey = getPostTaskKey(post)
              const href = taskKey ? buildPostUrl(taskKey, post.slug) : `/posts/${post.slug}`
              return <TaskPostCard key={post.id} post={post} href={href} />
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-10 text-center shadow-inner">
            <p className="text-base font-medium text-foreground">No matching posts yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a shorter query, remove filters, or browse the home page for fresh entries.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline" className="rounded-full border-border">
                <Link href="/">Back to home</Link>
              </Button>
              <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/help">Visit help center</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
