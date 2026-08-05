import { useState } from "react";
import { motion } from "motion/react";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { useTechStackCMS, type TechItemCMS } from "@/lib/cms-store";
import { track } from "@/lib/analytics";

function IconTile({ item, index }: { item: TechItemCMS; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.85, rotate: index % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 10) * 0.035, duration: 0.35, ease: "easeOut" }}
      className="group relative"
    >
      <button
        type="button"
        aria-label={item.title}
        onMouseEnter={() => void track("tech_hover", { label: item.title })}
        className="grid h-16 w-16 place-items-center border-2 border-ink bg-card transition-all duration-200 doodle-shadow-sm hover:-translate-y-1.5 hover:rotate-3 hover:doodle-shadow focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-20 sm:w-20 overflow-hidden p-2"
        style={{ borderRadius: "16px 20px 16px 22px" }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9"
          />
        ) : item.path ? (
          <svg
            role="img"
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-7 w-7 transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9"
            fill={`#${item.hex || "000000"}`}
          >
            <path d={item.path} />
          </svg>
        ) : (
          <span className="font-bold text-xs font-mono">{item.title.slice(0, 3)}</span>
        )}
      </button>

      <span
        className="pointer-events-none absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 translate-y-1 whitespace-nowrap border-2 border-ink bg-ink px-2 py-0.5 text-[11px] font-bold text-background opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{ borderRadius: "10px 14px 10px 16px" }}
      >
        {item.title}
      </span>
    </motion.li>
  );
}

export function TechStack() {
  const [active, setActive] = useState<string>("all");
  const techGroups = useTechStackCMS();

  const groups = active === "all" ? techGroups : techGroups.filter((g) => g.id === active);

  return (
    <Section id="stack">
      <SectionHeading
        kicker="my toolbox"
        title="Technology stack"
        subtitle="Hover any icon to name it. Everything here is managed via CMS and actively built with."
        accent="text-sky"
      />

      <div className="mb-10 flex flex-wrap gap-2">
        {[{ id: "all", label: "Everything" }, ...techGroups].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActive(g.id)}
            aria-pressed={active === g.id}
            className={`rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold transition-all doodle-shadow-sm hover:-translate-y-0.5 ${
              active === g.id ? "bg-ink text-background" : "bg-card"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((g, gi) => (
          <Reveal key={g.id} delay={gi * 0.05}>
            <div
              className="h-full border-2 border-ink bg-card p-5 doodle-shadow"
              style={{ borderRadius: "20px 26px 20px 28px" }}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-xl font-bold">{g.label}</h3>
                  <p className="truncate text-xs text-muted-foreground">{g.blurb}</p>
                </div>
                <span className={`sticker shrink-0 ${g.accent}`}>{g.items.length}</span>
              </div>

              <ul className="mt-6 flex flex-wrap gap-3 pb-6">
                {g.items.map((item, i) => (
                  <IconTile key={item.id || item.title} item={item} index={i} />
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 overflow-hidden border-y-2 border-ink py-3">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[...techGroups.flatMap((g) => g.items), ...techGroups.flatMap((g) => g.items)].map(
            (s, i) => (
              <span key={`${s.title}-${i}`} className="hand text-2xl text-muted-foreground">
                {s.title} ✦
              </span>
            ),
          )}
        </div>
      </Reveal>
    </Section>
  );
}
