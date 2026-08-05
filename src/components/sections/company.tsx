import { Rocket, ShieldCheck, Building2, Code2, Users, ArrowUpRight, Cpu, Sparkles } from "lucide-react";
import { Reveal, Section, SectionHeading, MagneticButton } from "@/components/ui-kit";
import { track } from "@/lib/analytics";
import { useCMSContent } from "@/lib/cms-store";

export function CompanySection() {
  const cms = useCMSContent();
  const company = cms.company;

  const capabilities = [
    {
      icon: Code2,
      title: "Full Stack Web Software",
      desc: "Custom high-performance web applications built from scratch with modern React, TypeScript & Node.js frameworks.",
    },
    {
      icon: Cpu,
      title: "Agentic AI & Generative Models",
      desc: "Architecting autonomous AI agents, RAG vector search, LLM integrations, and generative model pipelines.",
    },
    {
      icon: Building2,
      title: "Business Software & Dashboards",
      desc: "Custom internal CRM systems, telemetry control panels, analytics dashboards, and operational software.",
    },
    {
      icon: Rocket,
      title: "SaaS Platform Engineering",
      desc: "Architecting multi-tenant cloud software products from MVP prototype to production readiness.",
    },
    {
      icon: ShieldCheck,
      title: "Security & Code Quality",
      desc: "Clean architecture, automated testing, security audits, and continuous performance optimization.",
    },
    {
      icon: Users,
      title: "Engineering Collaboration",
      desc: "Dedicated software engineering and AI partnership for founders, startups, and growing technical teams.",
    },
  ];

  return (
    <Section id="company" className="py-20">
      <SectionHeading
        kicker="software studio & ai lab"
        title={company.title || "ASP0705DEV"}
        subtitle="My personal software studio dedicated to engineering modern full stack web platforms, agentic AI workflows, generative AI tools, and custom business software."
        accent="text-violet"
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div
            className="flex h-full flex-col border-2 border-ink bg-card p-8 doodle-shadow"
            style={{ borderRadius: "24px 32px 24px 34px" }}
          >
            <span className="sticker bg-sun text-sun-foreground flex items-center gap-1.5 w-fit">
              <Sparkles className="h-3.5 w-3.5" /> ASP0705DEV Software Studio
            </span>

            <h3 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
              {company.subtitle || "Software engineering meets autonomous intelligence."}
            </h3>

            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              At <strong className="text-foreground">ASP0705DEV</strong>, I partner with founders, business owners, and tech leaders to design, build, and deploy custom full-stack web software, autonomous agentic AI workflows, and generative AI systems.
            </p>

            <p className="mt-3 text-xs text-muted-foreground leading-relaxed border-l-2 border-mint pl-3 py-0.5 font-semibold">
              Alongside running ASP0705DEV, I also work as a Software Developer at <strong className="text-foreground">Gagellan Global Solutions</strong>.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border-2 border-ink bg-mint/30 p-4 doodle-shadow-sm">
                <div className="font-display text-3xl font-bold text-ink">100%</div>
                <div className="text-xs font-semibold text-muted-foreground mt-1">Custom Architecture</div>
              </div>
              <div className="rounded-2xl border-2 border-ink bg-sky/30 p-4 doodle-shadow-sm">
                <div className="font-display text-3xl font-bold text-ink">Full Stack</div>
                <div className="text-xs font-semibold text-muted-foreground mt-1">Web & Agentic AI</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton
                href="#contact"
                className="bg-coral text-coral-foreground"
                onClick={() => void track("company_cta_click", { label: "asp0705dev_partner" })}
              >
                Work with ASP0705DEV <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-card px-6 py-3 text-sm font-bold doodle-shadow hover:bg-ink hover:text-background transition-colors"
              >
                Get Project Quote
              </a>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 0.05}>
              <div
                className="flex h-full flex-col border-2 border-ink bg-card p-5 doodle-shadow-sm transition-transform hover:-translate-y-1"
                style={{ borderRadius: "18px 24px 18px 26px" }}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-lime text-ink">
                  <cap.icon className="h-5 w-5" />
                </div>
                <h4 className="mt-3 font-display text-base font-bold">{cap.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
