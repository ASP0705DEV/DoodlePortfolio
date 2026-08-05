import { Building2, MapPin } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { DoodleBrain, DoodleStar } from "@/components/doodles";
import { useCMSContent, useResumeCMS } from "@/lib/cms-store";

export function About() {
  const cms = useCMSContent();
  const resume = useResumeCMS();
  const about = cms.about;

  const stats = [
    { label: "Studio", value: "ASP0705DEV", bg: "bg-sun" },
    { label: "Company", value: "Gagellan Global Solutions", bg: "bg-mint" },
    { label: "Focus Stack", value: "Web + AI", bg: "bg-bubble" },
    { label: "Status", value: "Available", bg: "bg-lime" },
  ];

  return (
    <Section id="about">
      <SectionHeading
        kicker="the human behind the commits"
        title="About me"
        subtitle="Full Stack Developer, Agentic AI enthusiast, and founder of ASP0705DEV Software Studio."
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal className="doodle-card p-7">
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {(about.bio || "").split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="sticker bg-sky text-sky-foreground">
              <Building2 className="h-3.5 w-3.5" /> ASP0705DEV & Gagellan Global Solutions
            </span>
            <span className="sticker bg-sun">
              <MapPin className="h-3.5 w-3.5" /> {about.location}
            </span>
          </div>
        </Reveal>

        <div className="grid gap-4">
          <Reveal delay={0.1} className="relative doodle-card p-6">
            <DoodleBrain className="h-20 w-24 text-violet" />
            <h3 className="mt-3 text-xl">Where I&apos;m heading</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Autonomous agents, LLM orchestration and intelligent automation — software that
              does not just answer, but decides and acts.
            </p>
            <DoodleStar className="absolute -right-4 -top-4 h-9 w-9 wobble text-sun" />
          </Reveal>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.05 * i}>
                <div
                  className={`${s.bg} h-full rounded-2xl border-2 border-ink p-4 doodle-shadow-sm`}
                >
                  <div className="font-display font-bold text-lg">{s.value}</div>
                  <div className="text-xs font-semibold">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="hand mb-6 text-3xl">the journey so far →</h3>
        <div className="relative border-l-2 border-dashed border-ink pl-8">
          {resume.experience.map((job, i) => (
            <Reveal key={job.id || job.role} delay={i * 0.08} className="relative mb-8">
              <span className="absolute -left-[41px] top-2 grid h-5 w-5 place-items-center rounded-full border-2 border-ink bg-coral" />
              <div className="doodle-card doodle-card-hover p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-xl">{job.role}</h4>
                  <span className="sticker bg-lime text-lime-foreground">
                    {job.start_date} — {job.end_date || "Present"}
                  </span>
                </div>
                <div className="font-semibold marker-mint">
                  {job.company}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{job.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
