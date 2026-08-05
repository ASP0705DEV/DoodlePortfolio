import { motion } from "motion/react";
import { Briefcase, CalendarDays, Coffee, Rocket, ArrowRight } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { useProfile } from "@/lib/portfolio";
import { track } from "@/lib/analytics";

export const COLLAB_EVENT = "collab-intent";

const intents = [
  {
    id: "hire",
    icon: Briefcase,
    title: "Hire me",
    copy: "Full-time or contract — full stack builds and agentic AI systems.",
    subject: "Hiring enquiry",
    tone: "bg-sun",
  },
  {
    id: "project",
    icon: Rocket,
    title: "Build a project",
    copy: "Got an idea or an internal tool that needs shipping? Let's scope it.",
    subject: "Project enquiry",
    tone: "bg-mint",
  },
  {
    id: "meeting",
    icon: CalendarDays,
    title: "Schedule a meeting",
    copy: "A 30-minute call to talk architecture, automation or agents.",
    subject: "Schedule a meeting",
    tone: "bg-sky text-sky-foreground",
  },
  {
    id: "coffee",
    icon: Coffee,
    title: "Just say hi",
    copy: "Virtual coffee, feedback, or a good technical conversation.",
    subject: "Coffee chat",
    tone: "bg-bubble",
  },
];

export function Collaboration() {
  const { data: profile } = useProfile();

  const choose = (id: string, subject: string) => {
    void track("collab_intent", { label: id });
    window.dispatchEvent(new CustomEvent(COLLAB_EVENT, { detail: subject }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Section id="collaborate">
      <SectionHeading
        kicker="pull up a chair"
        title="Let's collaborate"
        subtitle="Pick the reason you're here — it'll prefill the message below so you can skip the awkward first line."
        accent="text-mint"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {intents.map((it, i) => (
          <Reveal key={it.id} delay={i * 0.06}>
            <motion.button
              type="button"
              onClick={() => choose(it.id, it.subject)}
              whileHover={{ y: -6, rotate: i % 2 ? 1.4 : -1.4 }}
              whileTap={{ scale: 0.97 }}
              className={`group grid h-full w-full content-start gap-3 border-2 border-ink p-5 text-left doodle-shadow ${it.tone}`}
              style={{ borderRadius: "20px 26px 20px 28px" }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-background text-foreground">
                <it.icon className="h-5 w-5" />
              </span>

              <span className="font-display text-lg font-bold">{it.title}</span>
              <span className="text-sm opacity-80">{it.copy}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold">
                Start here
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-6">
        <div
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-2 border-ink bg-card p-5 doodle-shadow sm:flex sm:justify-between"
          style={{ borderRadius: "20px 26px 20px 28px" }}
        >
          <p className="min-w-0 text-sm">
            <span className="font-bold">Prefer email or LinkedIn?</span>{" "}
            <span className="text-muted-foreground">Both inboxes are open.</span>
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border-2 border-ink bg-background px-4 py-1.5 text-xs font-bold doodle-shadow-sm"
              >
                Email
              </a>
            ) : null}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-2 border-ink bg-background px-4 py-1.5 text-xs font-bold doodle-shadow-sm"
            >
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-2 border-ink bg-background px-4 py-1.5 text-xs font-bold doodle-shadow-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
