import { motion } from "motion/react";
import { Download, GraduationCap, Briefcase, Zap, Award } from "lucide-react";
import { Reveal, Section, SectionHeading, MagneticButton } from "@/components/ui-kit";
import { useResumeCMS, useCMSContent } from "@/lib/cms-store";
import { track } from "@/lib/analytics";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-2 border-ink bg-card p-5 doodle-shadow ${className}`}
      style={{ borderRadius: "20px 26px 20px 28px" }}
    >
      {children}
    </div>
  );
}

export function Resume() {
  const r = useResumeCMS();
  const cms = useCMSContent();

  return (
    <Section id="resume">
      <SectionHeading
        kicker="the short version"
        title="Resume at a glance"
        subtitle="Who I am, what I do and what I've shipped — visual, manageable, and structured."
        accent="text-coral"
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <Reveal>
          <Card className="h-full">
            <span className="sticker bg-sun text-sun-foreground inline-flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" /> Profile Overview
            </span>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {r.profile?.summary || r.summary}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(r.facts || [
                { label: "Based in", value: r.profile?.location || "India" },
                { label: "Availability", value: r.profile?.availability || "Available" },
                { label: "Open to", value: r.profile?.open_to || "Projects" },
                { label: "Focus", value: "Full Stack + AI" },
              ]).map((f) => (
                <div
                  key={f.label}
                  className="border-2 border-ink bg-background p-3 doodle-shadow-sm"
                  style={{ borderRadius: "14px 18px 14px 20px" }}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wide opacity-60">
                    {f.label}
                  </div>
                  <div className="mt-1 text-sm font-bold truncate">{f.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <MagneticButton
                href={r.profile?.resume_url || cms.about.resume_url || "#contact"}
                target={r.profile?.resume_url || cms.about.resume_url ? "_blank" : undefined}
                className="bg-coral text-coral-foreground"
                onClick={() => void track("resume_download", { label: "resume_section" })}
              >
                <Download className="h-4 w-4" /> Download Resume
              </MagneticButton>
              <MagneticButton href="#contact" className="bg-card">
                Work with me
              </MagneticButton>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.08}>
          <Card className="h-full bg-mint">
            <span className="sticker bg-card">
              <Briefcase className="h-3.5 w-3.5" /> Key Capabilities
            </span>
            <ul className="mt-4 grid gap-3">
              {((r.capabilities && r.capabilities.length > 0)
                ? r.capabilities.map((c) => ({ title: c.title, copy: `${c.category} (${c.level}% proficiency)` }))
                : (r.services || [])
              ).map((s, i) => (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-2"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ink" />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{s.title}</span>
                    <span className="block text-xs opacity-75">{s.copy}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Reveal>
          <Card className="h-full">
            <span className="sticker bg-sky text-sky-foreground">
              <Briefcase className="h-3.5 w-3.5" /> Experience
            </span>
            <ul className="mt-4 grid gap-4">
              {(r.experience || []).map((e) => (
                <li key={e.id || e.role} className="border-l-2 border-ink pl-3">
                  <div className="text-sm font-bold">{e.role}</div>
                  <div className="text-xs font-semibold opacity-70">
                    {e.company} · {e.start_date} — {e.end_date || "Present"}
                  </div>
                  {e.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{e.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={0.06}>
          <Card className="h-full">
            <span className="sticker bg-lime">
              <GraduationCap className="h-3.5 w-3.5" /> Education
            </span>
            <ul className="mt-4 grid gap-4">
              {(r.education || []).map((e) => (
                <li key={e.school} className="border-l-2 border-ink pl-3">
                  <div className="text-sm font-bold">{e.school}</div>
                  <div className="text-xs font-semibold opacity-70">{e.period}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{e.detail}</p>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={0.12}>
          <Card className="h-full bg-sun">
            <span className="sticker bg-card inline-flex items-center gap-1"><Award className="h-3.5 w-3.5" /> Certifications &amp; Achievements</span>
            <ul className="mt-4 grid gap-3">
              {(r.certifications || []).map((c) => (
                <li key={c.name} className="border-b border-ink/20 pb-2">
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="text-xs opacity-75">{c.issuer} · {c.year}</div>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
