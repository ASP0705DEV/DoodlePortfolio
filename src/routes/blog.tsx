import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Calendar, Clock, Tag, ArrowRight, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit";
import { useBlogsCMS } from "@/lib/cms-store";
import { usePageTracking } from "@/lib/analytics";
import { DoodleImage } from "@/components/ui/doodle-image";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Technical Blog — Sai Prithvi" },
      { name: "description", content: "Articles on Agentic AI systems, computer vision, full-stack web architectures, and system optimization." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  usePageTracking("/blog");
  const blogs = useBlogsCMS();
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const categories = useMemo(() => {
    const defaultCats = ["all", "AI & Agents", "Computer Vision", "Full Stack", "Architecture"];
    const dynamicCats = blogs.map((b) => b.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...dynamicCats]));
  }, [blogs]);

  const filtered = blogs.filter((b) => {
    if (b.published === false) return false;
    const matchesCat = selectedCat === "all" || b.category === selectedCat;
    const q = query.toLowerCase();
    const summaryText = (b.summary || (b as any).excerpt || "").toLowerCase();
    const titleText = (b.title || "").toLowerCase();
    const tagsArr = b.tags && Array.isArray(b.tags) ? b.tags : [];
    const matchesQuery =
      !q ||
      titleText.includes(q) ||
      summaryText.includes(q) ||
      tagsArr.some((t) => (t || "").toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <>
      <SiteNav />
      <main className="pt-28 pb-20">
        <Section id="blog-header">
          <SectionHeading
            kicker="thoughts & engineering logs"
            title="Technical Articles & Insights"
            subtitle="Deep dives into building autonomous agents, computer vision pipelines, full-stack architectures, and production lessons."
            accent="text-coral"
          />

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles by title, topic, or tech tag..."
                className="w-full rounded-2xl border-2 border-ink bg-card py-2.5 pl-10 pr-4 text-sm doodle-shadow-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCat(c)}
                  className={`rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold doodle-shadow-sm transition-transform hover:-translate-y-0.5 ${
                    selectedCat === c ? "bg-ink text-background" : "bg-card"
                  }`}
                >
                  {c === "all" ? "All Topics" : c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.06}>
                <article
                  className="flex h-full flex-col border-2 border-ink bg-card p-6 doodle-shadow transition-transform hover:-translate-y-1.5"
                  style={{ borderRadius: "22px 28px 22px 30px" }}
                >
                  <div className="h-44 overflow-hidden rounded-xl border-2 border-ink mb-4">
                    <DoodleImage src={post.featuredImage} alt={post.title} className="h-full w-full object-cover" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="sticker bg-sun text-ink">{post.category}</span>
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold hover:text-coral transition-colors">
                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">{post.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {post.tags.map((t) => (
                      <span key={t} className="rounded border border-ink/40 bg-muted/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t-2 border-ink/15 pt-4">
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {post.date}
                    </span>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="hand text-lg text-coral hover:underline inline-flex items-center gap-1"
                    >
                      read article →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
