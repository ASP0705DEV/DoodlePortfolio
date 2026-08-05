import { useState } from "react";
import {
  Globe,
  Layers,
  ShoppingCart,
  Layout,
  Sparkles,
  Bot,
  Database,
  Zap,
  BarChart3,
  Workflow,
  Palette,
  ShieldCheck,
  Cloud,
  Compass,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { defaultServices, type ServiceItem } from "@/lib/services-data";
import { track } from "@/lib/analytics";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Layers,
  ShoppingCart,
  Layout,
  Sparkles,
  Bot,
  Database,
  Zap,
  BarChart3,
  Workflow,
  Palette,
  ShieldCheck,
  Cloud,
  Compass,
};

import { useServicesCMS } from "@/lib/cms-store";

export function Services() {
  const [filter, setFilter] = useState<string>("all");
  const [activeModal, setActiveModal] = useState<ServiceItem | null>(null);

  const services = useServicesCMS();

  const filtered =
    filter === "all" ? services : services.filter((s) => s.category === filter);

  const handleInquire = (serviceTitle: string) => {
    void track("service_inquiry_click", { label: serviceTitle });
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Section id="services">
      <SectionHeading
        kicker="what I build for you"
        title="Services & Engineering Capabilities"
        subtitle="End-to-end solutions tailored for startups, agencies, and enterprise businesses — built for scale, speed, and aesthetics."
        accent="text-mint"
      />

      <div className="mb-10 flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Services" },
          { id: "web", label: "Web & Full Stack" },
          { id: "ai", label: "AI & Agents" },
          { id: "automation", label: "Automation" },
          { id: "cloud", label: "Cloud & DevOps" },
          { id: "design", label: "UI/UX Design" },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={`rounded-full border-2 border-ink px-4 py-1.5 text-xs font-bold transition-all doodle-shadow-sm hover:-translate-y-0.5 ${
              filter === cat.id ? "bg-ink text-background" : "bg-card"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service, i) => {
          const IconComponent = iconMap[service.iconName] || Globe;

          return (
            <Reveal key={service.id} delay={(i % 6) * 0.05}>
              <div
                className={`group flex h-full flex-col border-2 border-ink p-6 doodle-shadow transition-all hover:-translate-y-1.5 ${service.accentColor}`}
                style={{ borderRadius: "20px 26px 20px 28px" }}
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink bg-card text-ink doodle-shadow-sm">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider opacity-60">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {service.shortDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {service.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-ink bg-card px-2 py-0.5 font-mono text-[10px] font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t-2 border-ink/20 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModal(service)}
                    className="hand text-lg text-ink hover:text-coral transition-colors"
                  >
                    view deliverables →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInquire(service.title)}
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-ink bg-card px-3 py-1.5 text-xs font-bold doodle-shadow-sm hover:bg-ink hover:text-background transition-colors"
                  >
                    Inquire <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Deliverables Modal */}
      {activeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg border-2 border-ink p-6 doodle-shadow ${activeModal.accentColor}`}
            style={{ borderRadius: "22px 30px 22px 32px" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="sticker bg-card">Service Details</span>
                <h3 className="mt-2 font-display text-2xl font-bold">{activeModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-full border-2 border-ink bg-card p-1.5 text-ink hover:bg-ink hover:text-background"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {activeModal.fullDescription}
            </p>

            <div className="mt-5">
              <h4 className="font-display text-base font-bold text-ink">Key Deliverables</h4>
              <ul className="mt-2 space-y-2">
                {activeModal.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-mint" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t-2 border-ink/20 pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl border-2 border-ink bg-card px-4 py-2 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  handleInquire(activeModal.title);
                }}
                className="rounded-xl border-2 border-ink bg-coral text-coral-foreground px-5 py-2 text-xs font-bold doodle-shadow-sm"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
