import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskListClient } from "@/components/tasks/task-list-client";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import { CATEGORY_OPTIONS, normalizeCategory } from "@/lib/categories";
import { taskIntroCopy } from "@/config/site.content";
import { getSiteExperience } from "@/lib/site-experience";

function renderHero(
  experience: ReturnType<typeof getSiteExperience>,
  task: TaskKey,
  taskLabel: string,
  description: string,
  normalizedCategory: string,
  route: string
) {
  const useHelloArtCityGalleryLayout = task === "image" || task === "profile";
  const filterForm = (
    <form action={route} className={`grid gap-3 rounded-[1.75rem] p-5 ${experience.softPanelClass}`}>
      <label className={`text-xs font-semibold uppercase tracking-[0.24em] ${experience.mutedClass}`}>
        Category
      </label>
      <select
        name="category"
        defaultValue={normalizedCategory}
        className="h-11 rounded-xl border border-border bg-white/80 px-3 text-sm text-foreground"
      >
        <option value="all">All categories</option>
        {CATEGORY_OPTIONS.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      <button type="submit" className={`h-11 rounded-xl text-sm font-semibold ${experience.buttonClass}`}>
        Apply filter
      </button>
    </form>
  );

  if (experience.key === "tynewebdesign") {
    return (
      <section className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className={`rounded-[2.25rem] p-8 ${experience.panelClass}`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">{description}</h1>
          <p className={`mt-5 max-w-2xl text-sm leading-8 ${experience.mutedClass}`}>{experience.heroDescription}</p>
        </div>
        {filterForm}
      </section>
    );
  }

  if (experience.key === "codepixelmedia") {
    return (
      <section className="mb-12 grid gap-0 overflow-hidden rounded-[2rem] lg:grid-cols-[1fr_1fr]">
        <div className={`p-8 ${experience.panelClass}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">{taskLabel}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">{description}</h1>
          <p className="mt-5 max-w-xl text-sm leading-8 text-slate-300">{experience.heroDescription}</p>
        </div>
        <div className="bg-[#eef3ff] p-8">{filterForm}</div>
      </section>
    );
  }

  if (experience.key === "radianpark") {
    return (
      <section className={`mb-12 rounded-[2rem] p-6 ${experience.panelClass}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">{description}</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Tasks", "Success", "Level"].map((item, index) => (
              <div key={item} className="rounded-[1.25rem] border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{item}</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-950">{["148", "94%", "Expert"][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (experience.key === "lashisking") {
    return (
      <section className={`mb-12 rounded-[2.5rem] p-8 ${experience.panelClass}`}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-rose-950">{description}</h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 ${experience.mutedClass}`}>{experience.heroDescription}</p>
          </div>
          {filterForm}
        </div>
      </section>
    );
  }

  if (experience.key === "scoreminers") {
    return (
      <section className="mb-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className={`p-6 ${experience.panelClass}`}>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-950">{experience.heroEyebrow}</p>
          <h1 className="mt-4 text-4xl font-black uppercase text-slate-950">{description}</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {["142", "96%", "19"].map((item, index) => (
            <div key={item} className={`p-6 ${experience.softPanelClass}`}>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-950">{["Total tasks", "Success rate", "Level"][index]}</p>
              <p className="mt-3 text-4xl font-black text-slate-950">{item}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (experience.key === "linedesing") {
    return (
      <section className={`mb-12 rounded-[2rem] p-6 ${experience.panelClass}`}>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr_300px]">
          <div className="border-b border-sky-200 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Mode</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">Blueprint</p>
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950">{description}</h1>
          </div>
          {filterForm}
        </div>
      </section>
    );
  }

  if (useHelloArtCityGalleryLayout) {
    return (
      <section className="mb-12 grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_55%,#ffedd5_100%)] p-8 shadow-[0_26px_90px_rgba(249,115,22,0.14)]">
          <div className="absolute right-6 top-6 rotate-[8deg] rounded-full bg-orange-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">Curated prints</div>
          <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-700">{experience.heroEyebrow}</p>
              <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em] text-stone-950">{description}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-700">{experience.heroDescription}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Framed layouts", "Creator-first cards", "Fast visual scanning"].map((item) => (
                  <span key={item} className="rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[1.6rem] border border-orange-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Popular format</p>
                <p className="mt-2 text-xl font-semibold text-stone-950">{taskLabel}</p>
              </div>
              <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Collection mode</p>
                <p className="mt-2 text-xl font-semibold text-stone-950">Shop-style grid</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {filterForm}
          <div className="rounded-[1.9rem] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(120,53,15,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Browse faster</p>
            <div className="mt-4 grid gap-3">
              {["Clean thumbnail hierarchy", "Stronger category labels", "More breathing room on cards"].map((item) => (
                <div key={item} className="rounded-[1rem] bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (experience.key === "housesdecors") {
    return (
      <section className={`mb-12 rounded-[2rem] p-8 ${experience.panelClass}`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-amber-950">{description}</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`rounded-[1.5rem] p-5 ${experience.softPanelClass}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-900/60">Task style</p>
              <p className="mt-2 text-xl font-semibold text-amber-950">Material panels</p>
            </div>
            {filterForm}
          </div>
        </div>
      </section>
    );
  }

  if (experience.key === "aporiakennels") {
    return (
      <section className={`mb-12 rounded-[2rem] p-8 ${experience.panelClass}`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-emerald-950">{description}</h1>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Champion lines", "Daily field notes", "Image-backed trust"].map((item) => (
                <span key={item} className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-950">
                  {item}
                </span>
              ))}
            </div>
          </div>
          {filterForm}
        </div>
      </section>
    );
  }

  return (
    <section className={`mb-12 rounded-[2.25rem] p-8 ${experience.panelClass}`}>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${experience.mutedClass}`}>{experience.heroEyebrow}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-slate-950">{description}</h1>
          <p className={`mt-5 max-w-2xl text-sm leading-8 ${experience.mutedClass}`}>{experience.heroDescription}</p>
        </div>
        {filterForm}
      </div>
    </section>
  );
}

export async function TaskListPage({ task, category }: { task: TaskKey; category?: string }) {
  const taskConfig = getTaskConfig(task);
  const posts = await fetchTaskPosts(task, 30);
  const normalizedCategory = category ? normalizeCategory(category) : "all";
  const intro = taskIntroCopy[task];
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const experience = getSiteExperience(SITE_CONFIG.baseUrl);
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || "/posts"}/${post.slug}`,
    name: post.title,
  }));
  const useHelloArtCityGalleryLayout = task === "image" || task === "profile";

  const simpleFilter = (route: string, categoryValue: string) => (
    <form action={route} className="flex items-center gap-2">
      <select
        name="category"
        defaultValue={categoryValue}
        className="h-10 rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-700"
      >
        <option value="all">All categories</option>
        {CATEGORY_OPTIONS.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      <button type="submit" className="h-10 rounded-lg bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800">
        Filter
      </button>
    </form>
  );

  const imageSurfaceSection = (
    <section className="mb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Images</h1>
          <p className="mt-2 text-stone-500">A curated collection of visual content.</p>
        </div>
        {simpleFilter(taskConfig?.route || "/images", normalizedCategory)}
      </div>
    </section>
  );

  const profileSurfaceSection = (
    <section className="mb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Profiles</h1>
          <p className="mt-2 text-stone-500">Discover creators, businesses, and public profiles.</p>
        </div>
        {simpleFilter(taskConfig?.route || "/profile", normalizedCategory)}
      </div>
    </section>
  );

  return (
    <div className={`min-h-screen ${experience.pageClass} ${experience.fontClass}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SchemaJsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
            url: `${baseUrl}${taskConfig?.route || ""}`,
            hasPart: schemaItems,
          }}
        />

        {useHelloArtCityGalleryLayout && task === "image" ? imageSurfaceSection : null}
        {useHelloArtCityGalleryLayout && task === "profile" ? profileSurfaceSection : null}

        {!useHelloArtCityGalleryLayout ? renderHero(
          experience,
          task,
          taskConfig?.label || task,
          taskConfig?.description || "Latest posts",
          normalizedCategory,
          taskConfig?.route || "#"
        ) : null}

        {intro && !useHelloArtCityGalleryLayout ? (
          <section className={`mb-10 rounded-[2rem] p-6 ${experience.panelClass}`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${experience.mutedClass}`}>{intro.title}</p>
                {intro.paragraphs.slice(0, 2).map((paragraph) => (
                  <p key={paragraph.slice(0, 30)} className={`mt-4 max-w-3xl text-sm leading-8 ${experience.mutedClass}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className={`rounded-[1.5rem] p-5 ${experience.softPanelClass}`}>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <LayoutGrid className="h-4 w-4" />
                  Surface notes
                </div>
                <div className="mt-4 flex flex-col gap-3 text-sm">
                  <Link href={taskConfig?.route || "#"} className={`inline-flex items-center gap-2 ${experience.mutedClass}`}>
                    Open current collection <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/search" className={`inline-flex items-center gap-2 ${experience.mutedClass}`}>
                    Search across tasks <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
      </main>
      <Footer />
    </div>
  );
}
