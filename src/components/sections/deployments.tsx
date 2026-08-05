import { ExternalLink, CheckCircle, Server, Cloud, Cpu, Globe2, ShieldCheck, Box } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { useDeploymentsCMS, type DeploymentPlatformCMS } from "@/lib/cms-store";
import { track } from "@/lib/analytics";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe2,
  Server,
  Cpu,
  Cloud,
  ShieldCheck,
};

export function DeploymentShowcase() {
  const platforms = useDeploymentsCMS();

  return (
    <Section id="deployments">
      <SectionHeading
        kicker="where my code lives"
        title="Deployment & Infrastructure Showcase"
        subtitle="Production platforms, edge networks, cloud providers, and container environments hosting my live applications."
        accent="text-coral"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((plat, i) => {
          const IconComponent = iconMap[plat.iconName] || Box;

          return (
            <Reveal key={plat.id || plat.name} delay={(i % 6) * 0.06}>
              <div
                className="flex h-full flex-col border-2 border-ink bg-card p-6 doodle-shadow transition-transform hover:-translate-y-1"
                style={{ borderRadius: "20px 26px 20px 28px" }}
              >
                <div className="flex items-center justify-between">
                  <span className={`sticker ${plat.badgeColor}`}>
                    <CheckCircle className="h-3.5 w-3.5" /> {plat.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-muted-foreground">{plat.category}</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-background doodle-shadow-sm overflow-hidden">
                    {plat.iconUrl ? (
                      <img src={plat.iconUrl} alt={plat.name} className="h-6 w-6 object-contain" />
                    ) : (
                      <IconComponent className="h-5 w-5 text-ink" />
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold">{plat.name}</h3>
                </div>

                <p className="mt-3 text-xs text-muted-foreground leading-relaxed flex-1">
                  {plat.description}
                </p>

                <div className="mt-4 border-t-2 border-ink/15 pt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Hosted Builds:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {plat.hostedBuilds.map((hb, hidx) => {
                      if (hb.url) {
                        return (
                          <a
                            key={`${hb.name}-${hidx}`}
                            href={hb.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => void track("click_hosted_build", { platform: plat.name, build: hb.name })}
                            className="inline-flex items-center gap-1 rounded-md border border-ink bg-sun/30 hover:bg-sun px-2 py-0.5 font-mono text-[10px] font-bold transition-colors cursor-pointer"
                            title={`Redirect to ${hb.url}`}
                          >
                            {hb.name} <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                          </a>
                        );
                      }
                      return (
                        <span
                          key={`${hb.name}-${hidx}`}
                          className="rounded-md border border-ink bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-bold"
                        >
                          {hb.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {plat.link ? (
                  <a
                    href={plat.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => void track("click_deployment_link", { label: plat.name })}
                    className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-coral hover:underline"
                  >
                    Explore Platform <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
