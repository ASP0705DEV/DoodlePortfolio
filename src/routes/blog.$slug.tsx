import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, FileQuestion } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section, Reveal } from "@/components/ui-kit";
import { useBlogsCMS } from "@/lib/cms-store";
import { usePageTracking } from "@/lib/analytics";

import { DoodleImage } from "@/components/ui/doodle-image";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostDetail,
});

function BlogPostDetail() {
  const { slug } = Route.useParams();
  usePageTracking(`/blog/${slug}`);

  const blogs = useBlogsCMS();
  const post = blogs.find((b) => b.slug === slug || b.id === slug);

  if (!post) {
    return (
      <>
        <SiteNav />
        <main className="pt-28 pb-20">
          <Section id="blog-not-found" className="max-w-2xl text-center py-16">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border-2 border-ink bg-coral/20 text-coral doodle-shadow">
              <FileQuestion className="h-10 w-10" />
            </div>
            <h1 className="font-display text-3xl font-bold">Article Not Found</h1>
            <p className="mt-3 text-muted-foreground">
              The requested article could not be located or may have been unpublished.
            </p>
            <div className="mt-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-ink px-6 py-3 font-bold text-background doodle-shadow transition-transform hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Articles
              </Link>
            </div>
          </Section>
        </main>
        <SiteFooter />
      </>
    );
  }

  const featuredImg = post.featuredImage || post.coverImage || "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80";

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
              <DoodleImage src={featuredImg} alt={post.title} className="h-full w-full object-cover" />
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
                    <div className="font-bold text-sm">{post.author || "Adapa Sai Prithvi"}</div>
                    <div className="text-xs text-muted-foreground">Full Stack Developer & Agentic AI Architect</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(post.tags || []).map((t) => (
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
