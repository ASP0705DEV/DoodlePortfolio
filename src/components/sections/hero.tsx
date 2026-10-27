import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, Download, Github, Linkedin, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui-kit";
import { DoodleArrow, DoodleStar, DoodleSquiggle } from "@/components/doodles";
import { useCMSContent } from "@/lib/cms-store";
import { track } from "@/lib/analytics";
import { DoodleImage } from "@/components/ui/doodle-image";

// Fixed positions to prevent SSR/Client hydration mismatch
const SNIPPET_POSITIONS = [
  { left: "-8%", top: "8%" },
  { left: "72%", top: "4%" },
  { left: "-14%", top: "55%" },
  { left: "78%", top: "62%" },
  { left: "10%", top: "92%" },
  { left: "60%", top: "88%" },
];

function RotatingRoles({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (roles.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2400);
    return () => clearInterval(t);
  }, [roles.length]);

  return (
    <span className="relative inline-block h-[1.25em] overflow-hidden align-bottom">
      <motion.span
        key={mounted ? roles[index] : roles[0]}
        initial={mounted ? { y: "100%", opacity: 0, rotate: 3 } : false}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block text-coral"
      >
        {mounted ? roles[index] : roles[0]}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const cms = useCMSContent();
  const hero = cms.hero;
  const roles = hero.roles?.length ? hero.roles : ["Full Stack Developer"];
  const defaultSnippets = ["const agent = plan(goal)", "const app = build(idea)", "await ship(product)", "status = 200"];

  useEffect(() => {
    setMounted(true);
  }, []);

  const codeSnippets = mounted
    ? (hero.snippets?.length ? hero.snippets : defaultSnippets).slice(0, 6)
    : defaultSnippets;

  return (
    <section id="top" className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-8 sm:pt-44">
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] xl:gap-20">
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticker bg-lime text-lime-foreground inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" /> {hero.status_badge || "Available for collaborations"}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="mt-5 text-4xl leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            Hey, I&apos;m <span className="marker">{hero.name}</span>
            <br />
            <span className="text-2xl sm:text-4xl lg:text-5xl">
              a <RotatingRoles roles={roles} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 mx-auto max-w-xl text-base sm:text-lg text-muted-foreground lg:mx-0"
          >
            {hero.tagline} Currently building at{" "}
            <a
              href={hero.company_url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-foreground marker-mint"
            >
              {hero.company}
            </a>
            , and going deep on agentic systems that reason, plan and act.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-9 flex flex-wrap justify-center items-center gap-3 lg:justify-start"
          >
            <MagneticButton href="#projects" className="bg-coral text-coral-foreground">
              See my work
            </MagneticButton>
            <MagneticButton
              href={cms.about.resume_url || "#contact"}
              target={cms.about.resume_url ? "_blank" : undefined}
              className="bg-sun text-sun-foreground"
              onClick={() => void track("resume_download", { label: "hero" })}
            >
              <Download className="h-4 w-4" /> Resume
            </MagneticButton>
            <a
              href={cms.social_links?.github || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              onClick={() => void track("click_github", { label: "hero" })}
              className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-card doodle-shadow-sm transition-transform hover:-translate-y-1"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={cms.social_links?.linkedin || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              onClick={() => void track("click_linkedin", { label: "hero" })}
              className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-sky text-sky-foreground doodle-shadow-sm transition-transform hover:-translate-y-1"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </motion.div>

          <div className="mt-12 flex justify-center items-center gap-3 text-muted-foreground lg:justify-start">
            <ArrowDown className="h-5 w-5 animate-bounce" />
            <span className="hand text-xl">scroll, there is a lot down here</span>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Doodle Portrait Card ─────────────── */}
        <div className="relative order-first lg:order-last mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto doodle-card p-5 sm:p-6"
          >
            {/* Doodle portrait image */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-ink bg-paper">
              <DoodleImage
                src={hero.hero_image || "/sai-prithvi-doodle.png"}
                fallbackSrc="/sai-prithvi-doodle.png"
                alt="Sai Prithvi — Doodle Portrait"
                className="mx-auto h-52 w-full object-cover object-top sm:h-64"
                loading="eager"
              />
            </div>

            <p className="hand mt-3 text-center text-xl sm:text-2xl">building agents that ship</p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div className="rounded-xl border-2 border-ink bg-mint py-2">Full Stack</div>
              <div className="rounded-xl border-2 border-ink bg-sun py-2">Agentic AI</div>
              <div className="rounded-xl border-2 border-ink bg-bubble py-2">Automation</div>
            </div>

            <DoodleStar className="absolute -right-5 -top-5 h-10 w-10 wobble text-violet" />
          </motion.div>

          {/* Floating code snippets — SSR-safe fixed positions */}
          {codeSnippets.map((snippet, i) => (
            <motion.code
              key={`snippet-${i}`}
              className="absolute hidden rounded-lg border-2 border-ink bg-card px-2 py-1 font-mono text-[11px] doodle-shadow-sm md:block"
              style={SNIPPET_POSITIONS[i] ?? { left: "10%", top: "10%" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              {snippet}
            </motion.code>
          ))}

          <DoodleArrow className="absolute -bottom-8 left-2 hidden h-14 w-24 rotate-12 text-coral lg:block" />
        </div>
      </div>

      <DoodleSquiggle className="mt-16 h-5 w-full text-sky" />
    </section>
  );
}
