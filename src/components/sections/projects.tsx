import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Github, Search, CheckCircle2, Layers, Cpu, Wrench } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProjectsCMS } from "@/lib/cms-store";
import { type ShowcaseProject } from "@/lib/projects-data";
import { track } from "@/lib/analytics";

const categoryLabels: Record<string, string> = {
  ai: "AI & Agents",
  fullstack: "Full Stack",
  automation: "Automation",
  ecommerce: "E-Commerce",
  opensource: "Open Source",
};

const cardTints = ["bg-sun", "bg-mint", "bg-bubble", "bg-lime", "bg-sky/40", "bg-violet/30"];

export function Projects() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [openProject, setOpenProject] = useState<ShowcaseProject | null>(null);
  const [sliderPos, setSliderPos] = useState(50); // For Before/After slider

  const projects = useProjectsCMS();

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects],
  );

  const filtered = projects.filter((p) => {
    const matchesCat = category === "all" || p.category === category;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tech_stack.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const openModal = (p: ShowcaseProject) => {
    setOpenProject(p);
    setSliderPos(50);
    void track("project_view", { label: p.slug });
  };

  return (
    <Section id="projects">
      <SectionHeading
        kicker="things I built & shipped"
        title="Featured Projects & Case Studies"
        subtitle="Search, filter, and inspect the architecture, challenges, and live deployments behind each build."
        accent="text-violet"
      />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name or stack (React, Python, OpenCV, RAG)..."
            className="w-full rounded-2xl border-2 border-ink bg-card py-2.5 pl-10 pr-4 text-sm doodle-shadow-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold doodle-shadow-sm transition-transform hover:-translate-y-0.5 ${
                category === c ? "bg-ink text-background" : "bg-card"
              }`}
            >
              {c === "all" ? "All Projects" : (categoryLabels[c] ?? c)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={(i % 6) * 0.06}>
            <motion.article
              whileHover={{ rotateX: 2, rotateY: -2, y: -6 }}
              style={{ transformPerspective: 800 }}
              className="group flex h-full cursor-pointer flex-col doodle-card p-5"
              onClick={() => openModal(p)}
            >
              <div
                className={`relative mb-4 grid h-36 place-items-center overflow-hidden rounded-xl border-2 border-ink ${cardTints[i % cardTints.length]}`}
              >
                {p.cover_image ? (
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="hand text-4xl">{p.title.slice(0, 2).toUpperCase()}</span>
                )}
                <span className="absolute bottom-2 right-2 rounded-md border border-ink bg-card/90 px-2 py-0.5 text-[10px] font-mono font-bold">
                  {p.deployment_platform.split("/")[0]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {p.featured ? <span className="sticker bg-coral text-coral-foreground">★ Featured</span> : null}
                <span className="sticker bg-card">{categoryLabels[p.category] ?? p.category}</span>
              </div>

              <h3 className="mt-3 text-xl font-bold font-display">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">{p.summary}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech_stack.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-ink bg-background px-2 py-0.5 font-mono text-[10px] font-bold"
                  >
                    {t}
                  </span>
                ))}
                {p.tech_stack.length > 4 ? (
                  <span className="rounded-md border border-ink bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    +{p.tech_stack.length - 4}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-ink/20 pt-3">
                <span className="hand text-lg text-coral transition-colors group-hover:underline">
                  open case study →
                </span>
                <span className="text-[11px] font-mono font-semibold text-muted-foreground">{p.status}</span>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="hand mt-10 text-center text-2xl text-muted-foreground">
          no projects match that search filter…
        </p>
      ) : null}

      {/* Case Study Modal Viewer */}
      <Dialog open={!!openProject} onOpenChange={(o) => !o && setOpenProject(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto no-scrollbar border-2 border-ink bg-card sm:max-w-3xl" style={{ borderRadius: "24px" }}>
          {openProject ? (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="sticker bg-sun font-bold">{openProject.status}</span>
                  <span className="sticker bg-mint font-bold">{openProject.timeline}</span>
                  <span className="sticker bg-bubble font-bold">
                    {categoryLabels[openProject.category] ?? openProject.category}
                  </span>
                </div>
                <DialogTitle className="font-display text-3xl sm:text-4xl font-bold">{openProject.title}</DialogTitle>
                <div className="text-xs sm:text-sm font-mono text-foreground/90 font-bold mt-1">
                  Role: <span className="text-foreground underline decoration-coral decoration-2">{openProject.role}</span> · Platform: <span className="text-foreground underline decoration-sky decoration-2">{openProject.deployment_platform}</span>
                </div>
              </DialogHeader>

              {/* Before & After Interactive Slider (if Pixmate or images available) */}
              {openProject.before_image && openProject.after_image ? (
                <div className="relative border-2 border-ink rounded-2xl overflow-hidden doodle-shadow select-none h-64 sm:h-80">
                  <div className="absolute inset-0">
                    <img src={openProject.after_image} alt="After AI Enhancement" className="h-full w-full object-cover" />
                    <span className="absolute bottom-3 right-3 sticker bg-mint text-ink font-mono text-xs font-bold">
                      After AI Background Removal & Enhancement
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img src={openProject.before_image} alt="Before Raw Input" className="h-full w-full object-cover max-w-none" style={{ width: "100%", height: "100%" }} />
                    <span className="absolute bottom-3 left-3 sticker bg-coral text-coral-foreground font-mono text-xs font-bold">
                      Before (Raw Upload)
                    </span>
                  </div>
                  {/* Slider Control Bar */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-ink pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full border-2 border-ink bg-sun text-ink font-bold grid place-items-center text-xs doodle-shadow-sm">
                      ↔
                    </div>
                  </div>
                </div>
              ) : openProject.cover_image ? (
                <div className="h-60 sm:h-72 border-2 border-ink rounded-2xl overflow-hidden doodle-shadow">
                  <img src={openProject.cover_image} alt={openProject.title} className="h-full w-full object-cover" />
                </div>
              ) : null}

              <div>
                <h4 className="font-display text-xl font-bold">Overview</h4>
                <p className="mt-2 text-base text-foreground/90 leading-relaxed font-sans">{openProject.description}</p>
              </div>

              {/* Features List */}
              {openProject.features?.length ? (
                <div>
                  <h4 className="font-display text-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-mint" /> Key Features
                  </h4>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {openProject.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-sm font-semibold border-2 border-ink/20 bg-muted/40 p-3 rounded-xl text-foreground">
                        <span className="h-2.5 w-2.5 rounded-full bg-ink mt-1 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Challenges & Solutions */}
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailBlock icon={Wrench} title="Engineering Challenge" body={openProject.challenges} tint="bg-coral/20" />
                <DetailBlock icon={CheckCircle2} title="Architectural Solution" body={openProject.solutions} tint="bg-mint/40" />
              </div>

              {/* Architecture Overview */}
              {openProject.architecture ? (
                <DetailBlock icon={Layers} title="System Architecture Flow" body={openProject.architecture} tint="bg-sky/20" />
              ) : null}

              {/* Technology Stack */}
              <div>
                <h4 className="font-display text-lg font-bold mb-2">Technologies & Libraries</h4>
                <div className="flex flex-wrap gap-2">
                  {openProject.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-xl border-2 border-ink bg-card px-3.5 py-1.5 font-mono text-xs font-bold doodle-shadow-sm text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Call-To-Buttons */}
              <div className="flex flex-wrap gap-3 pt-3 border-t-2 border-ink/20">
                {openProject.live_url ? (
                  <a
                    href={openProject.live_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => void track("click_live_demo", { label: openProject.slug })}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-lime px-5 py-2.5 text-sm font-bold doodle-shadow hover:-translate-y-0.5 transition-transform"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Application Demo
                  </a>
                ) : null}
                {openProject.repo_url ? (
                  <a
                    href={openProject.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => void track("click_github_repo", { label: openProject.slug })}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-card px-5 py-2.5 text-sm font-bold doodle-shadow hover:-translate-y-0.5 transition-transform"
                  >
                    <Github className="h-4 w-4" /> GitHub Repository
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Section>
  );
}

function DetailBlock({
  icon: Icon,
  title,
  body,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tint: string;
}) {
  if (!body) return null;
  return (
    <div className={`rounded-2xl border-2 border-ink p-4.5 ${tint}`}>
      <div className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
        <Icon className="h-5 w-5 text-ink" /> {title}
      </div>
      <p className="mt-2 text-sm text-foreground/90 font-medium leading-relaxed">{body}</p>
    </div>
  );
}
