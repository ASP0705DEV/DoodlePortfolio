import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Section, SectionHeading } from "@/components/ui-kit";

const steps = [
  { title: "The desk", copy: "Every build starts at an empty desk and a stubborn idea." },
  { title: "The laptop", copy: "First lines of code. Small commits, fast feedback loops." },
  { title: "The big screen", copy: "Architecture, APIs, data models — the system takes shape." },
  { title: "Shipping code", copy: "Tests, CI, containers. Green pipelines and clean deploys." },
  { title: "The stack", copy: "React, Node, Python, Postgres, Docker — the daily toolkit." },
  { title: "Agentic AI", copy: "Agents that reason, retrieve, plan and act on real workflows." },
  { title: "Ideas → products", copy: "Sticky notes become roadmaps, roadmaps become products." },
  { title: "Results", copy: "Faster teams, automated busywork, happier users." },
  { title: "Let's collaborate", copy: "The best part of the desk is who pulls up a chair." },
];

function Layer({
  progress,
  start,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  children: ReactNode;
}) {
  const span = 0.06;
  const opacity = useTransform(progress, [start, Math.min(1, start + span)], start === 0 ? [1, 1] : [0, 1]);
  const scale = useTransform(progress, [start, Math.min(1, start + span)], start === 0 ? [1, 1] : [0.92, 1]);
  const y = useTransform(progress, [start, Math.min(1, start + span)], start === 0 ? [0, 0] : [14, 0]);
  return (
    <motion.g style={{ opacity, scale, y, transformOrigin: "center" }}>{children}</motion.g>
  );
}

/** Enhanced colorful & realistic hand-drawn workspace that assembles as you scroll. */
export function StoryScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <Section id="story" className="py-16 sm:py-24">
      <SectionHeading
        kicker="scroll with me"
        title="My workspace, drawn one piece at a time"
        subtitle="Keep scrolling — the desk builds itself in full vivid color, and so does the story of how I work."
        accent="text-violet"
      />

      <div ref={ref} className="relative h-[420vh]">
        <div className="sticky top-20 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div
            className="relative overflow-hidden border-2 border-ink bg-card paper-grid doodle-shadow p-2 sm:p-4"
            style={{ borderRadius: "22px 30px 22px 32px" }}
          >
            <svg
              viewBox="0 0 800 520"
              className="h-full w-full text-ink"
              role="img"
              aria-label="Hand-drawn illustration of a developer desk with laptop, monitor, technology icons and AI elements assembling as you scroll"
            >
              <defs>
                <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="monitorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
                </linearGradient>
                <filter id="doodleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* 1 — desk */}
                <Layer progress={scrollYProgress} start={0}>
                  {/* Desk top fill */}
                  <path d="M70 400 h660" strokeWidth="4" />
                  <path d="M70 400 q330 18 660 0 l-14 18 h-632 z" fill="url(#deskGrad)" stroke="none" />
                  {/* Desk legs */}
                  <path d="M120 400 l-14 92" strokeWidth="4.5" />
                  <path d="M680 400 l14 92" strokeWidth="4.5" />
                  <path d="M70 400 q330 18 660 0" strokeWidth="3" />
                  {/* Floor Shadow */}
                  <ellipse cx="400" cy="475" rx="260" ry="16" fill="#000000" fillOpacity="0.06" stroke="none" />
                  <ellipse cx="400" cy="475" rx="260" ry="16" strokeDasharray="6 10" opacity="0.3" strokeWidth="2" />
                </Layer>

                {/* 2 — laptop */}
                <Layer progress={scrollYProgress} start={0.09}>
                  {/* Laptop base */}
                  <path d="M250 400 h300 l22 -18 h-344 z" fill="#E2E8F0" fillOpacity="0.9" />
                  {/* Laptop trackpad */}
                  <rect x="360" y="386" width="64" height="12" rx="3" fill="#94A3B8" fillOpacity="0.4" strokeWidth="1.5" />
                  {/* Laptop screen */}
                  <rect x="258" y="286" width="284" height="96" rx="8" fill="url(#laptopGrad)" />
                  {/* Laptop code highlights */}
                  <path d="M272 306 h70" stroke="#3B82F6" strokeWidth="3.5" />
                  <path d="M272 322 h110" stroke="#22C55E" strokeWidth="3.5" />
                  <path d="M272 338 h52" stroke="#EC4899" strokeWidth="3.5" />
                  <path d="M272 354 h96" stroke="#EAB308" strokeWidth="3.5" />
                </Layer>

                {/* 3 — monitor */}
                <Layer progress={scrollYProgress} start={0.18}>
                  {/* Monitor Stand */}
                  <path d="M235 300 v26 M198 328 h74" strokeWidth="4" />
                  {/* Monitor Body */}
                  <rect x="120" y="150" width="230" height="150" rx="12" fill="url(#monitorGrad)" strokeWidth="3.5" />
                  {/* Monitor Inner Screen Display */}
                  <rect x="128" y="158" width="214" height="134" rx="8" fill="#0F172A" stroke="none" />
                </Layer>

                {/* 4 — code windows & shipping */}
                <Layer progress={scrollYProgress} start={0.27}>
                  {/* Title bar line */}
                  <path d="M128 178 h214" stroke="#334155" strokeWidth="2" />
                  {/* Window Control Dots */}
                  <circle cx="142" cy="168" r="4" fill="#EF4444" stroke="none" />
                  <circle cx="156" cy="168" r="4" fill="#EAB308" stroke="none" />
                  <circle cx="170" cy="168" r="4" fill="#22C55E" stroke="none" />
                  {/* Code Lines on Main Monitor */}
                  <path d="M140 196 h60" stroke="#38BDF8" strokeWidth="3" />
                  <path d="M140 212 h110" stroke="#A855F7" strokeWidth="3" />
                  <path d="M154 228 h84" stroke="#22C55E" strokeWidth="3" />
                  <path d="M154 244 h56" stroke="#F43F5E" strokeWidth="3" />
                  <path d="M140 260 h124" stroke="#F59E0B" strokeWidth="3" />
                  <path d="M140 276 h72" stroke="#38BDF8" strokeWidth="3" />

                  {/* Deploy Shipping Arrow */}
                  <path d="M580 196 l24 20 -24 20" stroke="#EF4444" strokeWidth="4" />
                  <path d="M620 240 h34" stroke="#EF4444" strokeWidth="4" />
                </Layer>

                {/* 5 — the stack / servers */}
                <Layer progress={scrollYProgress} start={0.36}>
                  <rect x="600" y="286" width="110" height="26" rx="8" fill="#10B981" fillOpacity="0.25" strokeWidth="2.5" />
                  <rect x="600" y="318" width="110" height="26" rx="8" fill="#F59E0B" fillOpacity="0.25" strokeWidth="2.5" />
                  <rect x="600" y="350" width="110" height="26" rx="8" fill="#3B82F6" fillOpacity="0.25" strokeWidth="2.5" />
                  {/* Status LEDs */}
                  <circle cx="618" cy="299" r="4" fill="#10B981" stroke="#10B981" />
                  <circle cx="618" cy="331" r="4" fill="#F59E0B" stroke="#F59E0B" />
                  <circle cx="618" cy="363" r="4" fill="#3B82F6" stroke="#3B82F6" />
                  {/* Server text indicators */}
                  <path d="M632 299 h60" stroke="#10B981" strokeWidth="2" />
                  <path d="M632 331 h60" stroke="#F59E0B" strokeWidth="2" />
                  <path d="M632 363 h60" stroke="#3B82F6" strokeWidth="2" />

                  {/* Cable Connection */}
                  <path d="M120 330 q-30 26 -6 54 M96 384 l18 -6 M96 384 l6 -18" stroke="#F43F5E" opacity="0.8" strokeWidth="2.5" />
                </Layer>

                {/* 6 — agentic AI robot */}
                <Layer progress={scrollYProgress} start={0.45}>
                  {/* Head */}
                  <rect x="420" y="150" width="130" height="106" rx="18" fill="url(#aiGrad)" strokeWidth="3.5" />
                  {/* Glowing Eyes */}
                  <circle cx="455" cy="196" r="10" fill="#FBBF24" stroke="currentColor" strokeWidth="3" />
                  <circle cx="515" cy="196" r="10" fill="#FBBF24" stroke="currentColor" strokeWidth="3" />
                  <circle cx="455" cy="196" r="4" fill="#1E293B" stroke="none" />
                  <circle cx="515" cy="196" r="4" fill="#1E293B" stroke="none" />
                  {/* Smile */}
                  <path d="M455 224 q30 20 60 0" strokeWidth="3" />
                  {/* Antenna */}
                  <path d="M485 150 v-24" strokeWidth="3" />
                  <circle cx="485" cy="120" r="8" fill="#EF4444" stroke="currentColor" strokeWidth="3" />
                  {/* Side ears */}
                  <path d="M420 196 h-18 M550 196 h18" strokeWidth="3" />
                  {/* Thought Rays */}
                  <path d="M560 176 l26 -22 M560 216 l26 22" stroke="#EC4899" strokeWidth="3" strokeDasharray="5 7" />
                </Layer>

                {/* 7 — ideas (sticky notes) */}
                <Layer progress={scrollYProgress} start={0.54}>
                  {/* Yellow Sticky */}
                  <g transform="rotate(-6 108 96)">
                    <rect x="70" y="60" width="76" height="72" rx="6" fill="#FDE047" fillOpacity="0.9" strokeWidth="2.5" />
                    <path d="M82 82 h52 M82 98 h36" stroke="#854D0E" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                  {/* Green Sticky */}
                  <g transform="rotate(4 202 88)">
                    <rect x="164" y="52" width="76" height="72" rx="6" fill="#A3E635" fillOpacity="0.9" strokeWidth="2.5" />
                    <path d="M176 74 h52 M176 90 h32" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                  {/* Pink Sticky */}
                  <g transform="rotate(-3 296 102)">
                    <rect x="258" y="66" width="76" height="72" rx="6" fill="#F472B6" fillOpacity="0.9" strokeWidth="2.5" />
                    <path d="M270 88 h52 M270 104 h40" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                </Layer>

                {/* 8 — results (trophy & star) */}
                <Layer progress={scrollYProgress} start={0.63}>
                  {/* Golden Trophy */}
                  <path d="M636 92 h56 v30 a28 28 0 0 1 -56 0 z" fill="#F59E0B" fillOpacity="0.85" strokeWidth="3" />
                  <path d="M636 100 h-16 a14 14 0 0 0 16 16" stroke="#F59E0B" strokeWidth="3" />
                  <path d="M692 100 h16 a14 14 0 0 1 -16 16" stroke="#F59E0B" strokeWidth="3" />
                  <path d="M652 150 h24 M646 164 h36" strokeWidth="3.5" />
                  {/* Star Badge */}
                  <path
                    d="M400 92 l8 18 20 3 -14 14 3 20 -17 -10 -17 10 3 -20 -14 -14 20 -3 z"
                    fill="#A855F7"
                    fillOpacity="0.8"
                    strokeWidth="3"
                  />
                </Layer>

                {/* 9 — collaboration */}
                <Layer progress={scrollYProgress} start={0.72}>
                  {/* User 1 */}
                  <path d="M420 400 a34 34 0 0 1 68 0" fill="#34D399" fillOpacity="0.4" strokeWidth="3" />
                  <circle cx="454" cy="348" r="20" fill="#34D399" fillOpacity="0.6" strokeWidth="3" />
                  {/* User 2 */}
                  <path d="M520 400 a30 30 0 0 1 60 0" fill="#FBBF24" fillOpacity="0.4" strokeWidth="3" />
                  <circle cx="550" cy="356" r="17" fill="#FBBF24" fillOpacity="0.6" strokeWidth="3" />
                  {/* Speech Bubble */}
                  <path
                    d="M300 118 h96 a12 12 0 0 1 12 12 v40 a12 12 0 0 1 -12 12 h-58 l-22 20 v-20 h-16 a12 12 0 0 1 -12 -12 v-40 a12 12 0 0 1 12 -12 z"
                    fill="#38BDF8"
                    fillOpacity="0.2"
                    strokeWidth="3"
                  />
                  <path d="M318 142 h60 M318 158 h38" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
                </Layer>
              </g>
            </svg>
          </div>

          <ol className="grid content-start gap-2">
            {steps.map((s, i) => {
              const start = i * 0.09;
              return (
                <StepRow
                  key={s.title}
                  progress={scrollYProgress}
                  start={start}
                  index={i}
                  title={s.title}
                  copy={s.copy}
                />
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}

const stepColors = [
  "bg-sun text-ink",
  "bg-mint text-ink",
  "bg-coral text-coral-foreground",
  "bg-sky text-sky-foreground",
  "bg-lime text-ink",
  "bg-violet text-violet-foreground",
  "bg-bubble text-ink",
  "bg-sun text-ink",
  "bg-mint text-ink",
];

function StepRow({
  progress,
  start,
  index,
  title,
  copy,
}: {
  progress: MotionValue<number>;
  start: number;
  index: number;
  title: string;
  copy: string;
}) {
  const safeStart = Math.max(0, start - 0.05);
  const safeEnd = Math.min(1, start + 0.03);
  const opacity = useTransform(progress, [safeStart, safeEnd], [0.65, 1]);
  const x = useTransform(progress, [safeStart, safeEnd], [6, 0]);

  return (
    <motion.li style={{ opacity, x }} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3.5 p-2 rounded-xl transition-colors">
      <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink text-xs font-bold doodle-shadow-sm ${stepColors[index % stepColors.length]}`}>
        {index + 1}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-base font-bold text-foreground">{title}</span>
        <span className="block text-sm text-foreground/90 font-medium leading-relaxed mt-0.5">{copy}</span>
      </span>
    </motion.li>
  );
}
