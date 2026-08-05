import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section, Reveal } from "@/components/ui-kit";
import { fetchAllBlogs } from "@/lib/cms-store";
import { usePageTracking } from "@/lib/analytics";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostDetail,
});

function BlogPostDetail() {
  const { slug } = Route.useParams();
  usePageTracking(`/blog/${slug}`);

  const blogs = fetchAllBlogs();
  const post = blogs.find((b) => b.slug === slug) || blogs[0];

  return (
    <>
      <SiteNav />
      <main className="pt-28 pb-20">
        <Section id="blog-detail" className="max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-card px-4 py-2 text-xs font-bold doodle-shadow-sm hover:bg-ink hover:text-background transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>

          <Reveal>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="sticker bg-sun text-ink font-bold">{post.category}</span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {post.date}
              </span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readTime}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">{post.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.summary}</p>

            <div className="my-8 h-72 sm:h-96 overflow-hidden rounded-2xl border-2 border-ink doodle-shadow">
              <img src={post.featuredImage} alt={post.title} className="h-full w-full object-cover" />
            </div>

            {/* Article Content Render */}
            <div
              className="prose dark:prose-invert max-w-none text-foreground border-2 border-ink bg-card p-8 doodle-shadow space-y-6 text-sm leading-relaxed"
              style={{ borderRadius: "24px 30px 24px 32px" }}
            >
              <div className="whitespace-pre-line font-sans">{post.content}</div>

              <div className="border-t-2 border-ink/20 pt-6 mt-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-mint text-ink font-bold font-display">
                    SP
                  </div>
                  <div>
                    <div className="font-bold text-sm">{post.author}</div>
                    <div className="text-xs text-muted-foreground">Full Stack Developer & Agentic AI Architect</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="sticker bg-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
