import { useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue, AnimatePresence } from "motion/react";
import { Section, SectionHeading } from "@/components/ui-kit";
import { Sparkles, Terminal, Code2, Cpu, Rocket, ShieldCheck, Database, Laptop, Monitor, Smartphone, Layers, CheckCircle2, Info } from "lucide-react";

const steps = [
  {
    title: "1. The Solid Foundation",
    copy: "Every great architecture starts at an empty desk and a clear, focused mind.",
    tag: "Desk Setup",
    accent: "bg-sun text-ink",
  },
  {
    title: "2. Ergonomic Workspace",
    copy: "Pulling up an ergonomic chair built for long coding sessions and deep flow.",
    tag: "Ergonomics",
    accent: "bg-mint text-ink",
  },
  {
    title: "3. Portable Workstation",
    copy: "Opening the laptop for fast iteration, local prototyping, and quick commits.",
    tag: "MacBook Pro",
    accent: "bg-sky text-sky-foreground",
  },
  {
    title: "4. Ultrawide Canvas",
    copy: "Expanding to an ultrawide curved monitor for multi-window architecture views.",
    tag: "4K Monitor",
    accent: "bg-coral text-coral-foreground",
  },
  {
    title: "5. Tactile Controls",
    copy: "Mechanical keyboard and precision mouse for lightning-fast shortcut execution.",
    tag: "Hardware",
    accent: "bg-violet text-violet-foreground",
  },
  {
    title: "6. Fueling Creativity",
    copy: "A freshly brewed cup of coffee — turning caffeine into elegant algorithms.",
    tag: "Coffee Brew",
    accent: "bg-sun text-ink",
  },
  {
    title: "7. Brainstorming Notes",
    copy: "Color-coded sticky notes capturing feature roadmaps and API schemas.",
    tag: "Ideas",
    accent: "bg-bubble text-ink",
  },
  {
    title: "8. Agentic AI Partner",
    copy: "An autonomous AI assistant reasoning alongside, reviewing PRs and drafting code.",
    tag: "Agentic AI",
    accent: "bg-lime text-ink",
  },
  {
    title: "9. IDE & Terminal",
    copy: "VS Code with custom themes and integrated terminal running hot-reload dev servers.",
    tag: "VS Code",
    accent: "bg-sky text-sky-foreground",
  },
  {
    title: "10. Core Technology Stack",
    copy: "Official ecosystem badges: React, Next.js, Node, Supabase, Postgres, Docker, Vercel & AWS.",
    tag: "Tech Stack",
    accent: "bg-coral text-coral-foreground",
  },
  {
    title: "11. Multi-Device Testing",
    copy: "Responsive tablet and mobile previews ensuring pixel-perfect experience everywhere.",
    tag: "Responsive",
    accent: "bg-mint text-ink",
  },
  {
    title: "12. Live Code Rendering",
    copy: "Syntax highlighted functions compiling and rendering UI state in real-time.",
    tag: "Compilation",
    accent: "bg-violet text-violet-foreground",
  },
  {
    title: "13. Git Version Control",
    copy: "Feature branches merging smoothly into main with automated commit hooks.",
    tag: "Git Flow",
    accent: "bg-sun text-ink",
  },
  {
    title: "14. CI/CD Pipeline",
    copy: "Containerized builds, green unit tests, and automated edge network deployment.",
    tag: "Deployment",
    accent: "bg-lime text-ink",
  },
  {
    title: "15. Production Launch!",
    copy: "The full-stack workspace complete and operational — shipping software to the world.",
    tag: "Complete",
    accent: "bg-coral text-coral-foreground",
  },
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
  const span = 0.055;
  const opacity = useTransform(progress, [start, Math.min(1, start + span)], start === 0 ? [1, 1] : [0, 1]);
  const scale = useTransform(progress, [start, Math.min(1, start + span)], start === 0 ? [1, 1] : [0.94, 1]);
  const y = useTransform(progress, [start, Math.min(1, start + span)], start === 0 ? [0, 0] : [16, 0]);
  return (
    <motion.g style={{ opacity, scale, y, transformOrigin: "400px 300px" }}>{children}</motion.g>
  );
}

/** Premium Hand-Drawn Vector Doodle Developer Workspace Scene */
export function StoryScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [selectedElement, setSelectedElement] = useState<{ title: string; desc: string; category: string } | null>(null);

  return (
    <Section id="story" className="py-16 sm:py-24">
      <SectionHeading
        kicker="scroll with me"
        title="My Workspace — Built One Piece at a Time"
        subtitle="Keep scrolling to watch the modern Full-Stack & Agentic AI workspace assemble layer by layer in hand-drawn vector art."
        accent="text-violet"
      />

      <div ref={ref} className="relative h-[650vh]">
        <div className="sticky top-20 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] items-start">
          {/* SVG Canvas & Interactive Container */}
          <div
            className="relative overflow-hidden border-2 border-ink bg-card paper-grid doodle-shadow p-2 sm:p-5 transition-all"
            style={{ borderRadius: "24px 32px 24px 34px" }}
          >
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border-2 border-ink bg-background/95 px-3 py-1 text-xs font-bold doodle-shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-sun fill-sun" />
              <span>Interactive Storyboard • Hover & Click Elements</span>
            </div>

            <svg
              viewBox="0 0 840 540"
              className="h-full w-full text-ink select-none"
              role="img"
              aria-label="Hand-drawn vector illustration of a full-stack developer workspace assembling progressively"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="deskWood" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.18" />
                </linearGradient>
                <linearGradient id="screenDisplay" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.98" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.98" />
                </linearGradient>
                <linearGradient id="laptopGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="aiGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#F472B6" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="chairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#64748B" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="codeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              <g stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                {/* 1 — Desk & Floor Shadow */}
                <Layer progress={scrollYProgress} start={0.0}>
                  {/* Floor Shadow */}
                  <ellipse cx="420" cy="485" rx="310" ry="18" fill="#000000" fillOpacity="0.07" stroke="none" />
                  <ellipse cx="420" cy="485" rx="310" ry="18" strokeDasharray="6 8" opacity="0.35" strokeWidth="2" />
                  {/* Desk Surface */}
                  <path d="M70 410 h700" strokeWidth="4.5" />
                  <path d="M70 410 q350 20 700 0 l-16 22 h-668 z" fill="url(#deskWood)" stroke="none" />
                  {/* Desk Front Bevel & Legs */}
                  <path d="M120 432 l-16 54 M720 432 l16 54" strokeWidth="4" />
                  <path d="M140 432 v54 M700 432 v54" strokeWidth="3" opacity="0.6" />
                  <path d="M70 410 q350 20 700 0" strokeWidth="3.5" />
                </Layer>

                {/* 2 — Ergonomic Chair */}
                <Layer progress={scrollYProgress} start={0.065}>
                  <g
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() =>
                      setSelectedElement({
                        title: "Ergonomic Chair",
                        desc: "Custom ergonomic lumbar support chair configured for multi-hour deep focus sessions.",
                        category: "Ergonomics",
                      })
                    }
                  >
                    {/* Chair Base Wheels */}
                    <path d="M380 478 h80 M390 478 l-20 10 M450 478 l20 10" strokeWidth="3" />
                    <circle cx="370" cy="488" r="4" fill="currentColor" />
                    <circle cx="470" cy="488" r="4" fill="currentColor" />
                    <circle cx="420" cy="488" r="4" fill="currentColor" />
                    {/* Chair Stand Column */}
                    <path d="M420 430 v48" strokeWidth="4" />
                    {/* Seat Cushion */}
                    <path d="M365 425 q55 -6 110 0 l-6 12 h-98 z" fill="url(#chairGrad)" strokeWidth="3" />
                    {/* Armrests */}
                    <path d="M360 380 v25 h15 M480 380 v25 h-15" strokeWidth="3" />
                    {/* Curved Mesh Backrest */}
                    <path d="M380 340 q40 -8 80 0 v65 q-40 8 -80 0 z" fill="#94A3B8" fillOpacity="0.25" strokeWidth="3" />
                    <path d="M390 352 h60 M390 366 h60 M390 380 h60 M390 394 h60" stroke="#64748B" strokeWidth="1.5" opacity="0.6" />
                  </g>
                </Layer>

                {/* 3 — Developer Laptop */}
                <Layer progress={scrollYProgress} start={0.13}>
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() =>
                      setSelectedElement({
                        title: "MacBook Pro 16-inch",
                        desc: "Primary development machine running macOS, Vite, TanStack Router, Docker containers, and Node.js microservices.",
                        category: "Workstation",
                      })
                    }
                  >
                    {/* Base */}
                    <path d="M260 410 h220 l20 -16 h-260 z" fill="#E2E8F0" fillOpacity="0.95" strokeWidth="3" />
                    {/* Trackpad */}
                    <rect x="345" y="398" width="50" height="10" rx="3" fill="#94A3B8" fillOpacity="0.4" strokeWidth="1.5" />
                    {/* Display Screen */}
                    <rect x="270" y="300" width="200" height="94" rx="7" fill="url(#laptopGlow)" strokeWidth="3" />
                    <rect x="276" y="306" width="188" height="82" rx="4" fill="#0F172A" stroke="none" />
                    {/* Code lines preview on laptop */}
                    <path d="M286 322 h50" stroke="#38BDF8" strokeWidth="3" />
                    <path d="M286 334 h85" stroke="#A855F7" strokeWidth="3" />
                    <path d="M286 346 h40" stroke="#22C55E" strokeWidth="3" />
                    <path d="M286 358 h70" stroke="#F59E0B" strokeWidth="3" />
                    <path d="M286 370 h95" stroke="#EC4899" strokeWidth="3" />
                  </g>
                </Layer>

                {/* 4 — Ultrawide Monitor */}
                <Layer progress={scrollYProgress} start={0.195}>
                  <g
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() =>
                      setSelectedElement({
                        title: "4K Curved Ultrawide Display",
                        desc: "Primary high-resolution canvas used for split-screen coding, architecture diagrams, and live preview rendering.",
                        category: "Display",
                      })
                    }
                  >
                    {/* Stand Base & Arm */}
                    <path d="M175 300 v110 M145 410 h60" strokeWidth="4" />
                    <path d="M160 410 l15 -14 l15 14" strokeWidth="2.5" />
                    {/* Curved Outer Bezel */}
                    <path d="M60 140 q230 -12 460 0 v160 q-230 12 -460 0 z" fill="url(#screenDisplay)" strokeWidth="4" />
                    {/* Inner Display Area */}
                    <path d="M68 148 q222 -10 444 0 v144 q-222 10 -444 0 z" fill="#090D16" stroke="none" />
                  </g>
                </Layer>

                {/* 5 — Mechanical Keyboard & Precision Mouse */}
                <Layer progress={scrollYProgress} start={0.26}>
                  {/* Keyboard Body */}
                  <rect x="290" y="402" width="120" height="14" rx="4" fill="#1E293B" strokeWidth="2" />
                  {/* RGB Keycaps */}
                  <path d="M296 405 h108" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 3" />
                  <path d="M296 409 h108" stroke="#F472B6" strokeWidth="2.5" strokeDasharray="5 3" />
                  {/* Precision Wireless Mouse */}
                  <ellipse cx="495" cy="406" rx="14" ry="9" fill="#334155" strokeWidth="2" />
                  <path d="M495 397 v6 M488 406 h14" stroke="#94A3B8" strokeWidth="1.5" />
                </Layer>

                {/* 6 — Coffee Mug */}
                <Layer progress={scrollYProgress} start={0.325}>
                  <g
                    className="cursor-pointer transition-transform hover:rotate-6"
                    onClick={() =>
                      setSelectedElement({
                        title: "Fresh Coffee Brew",
                        desc: "Handcrafted coffee keeping energy high during intense problem solving.",
                        category: "Fuel",
                      })
                    }
                  >
                    {/* Mug Body */}
                    <rect x="535" y="380" width="28" height="30" rx="6" fill="#F59E0B" fillOpacity="0.85" strokeWidth="2.5" />
                    {/* Handle */}
                    <path d="M563 386 q10 0 10 9 q0 9 -10 9" strokeWidth="2.5" fill="none" />
                    {/* Steam Vector Lines */}
                    <path d="M542 374 q4 -6 0 -12 M550 372 q-4 -6 0 -12 M558 374 q4 -6 0 -12" stroke="#F59E0B" strokeWidth="2" fill="none" />
                  </g>
                </Layer>

                {/* 7 — Sticky Notes */}
                <Layer progress={scrollYProgress} start={0.39}>
                  <g
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() =>
                      setSelectedElement({
                        title: "Idea & Architecture Notes",
                        desc: "Yellow: Supabase RLS policies. Green: Agentic RAG Memory logic. Pink: UI animation feedback loops.",
                        category: "Roadmap",
                      })
                    }
                  >
                    {/* Yellow Note */}
                    <g transform="rotate(-6 100 80)">
                      <rect x="70" y="50" width="70" height="66" rx="5" fill="#FDE047" fillOpacity="0.9" strokeWidth="2" />
                      <path d="M80 70 h50 M80 84 h35 M80 98 h42" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* Green Note */}
                    <g transform="rotate(4 190 75)">
                      <rect x="155" y="45" width="70" height="66" rx="5" fill="#A3E635" fillOpacity="0.9" strokeWidth="2" />
                      <path d="M165 65 h50 M165 79 h30 M165 93 h45" stroke="#365314" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* Pink Note */}
                    <g transform="rotate(-3 280 85)">
                      <rect x="245" y="55" width="70" height="66" rx="5" fill="#F472B6" fillOpacity="0.9" strokeWidth="2" />
                      <path d="M255 75 h50 M255 89 h40 M255 103 h32" stroke="#831843" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                    </g>
                  </g>
                </Layer>

                {/* 8 — Autonomous AI Assistant */}
                <Layer progress={scrollYProgress} start={0.455}>
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() =>
                      setSelectedElement({
                        title: "Agentic AI Assistant",
                        desc: "Goal-driven AI bot evaluating code snippets, automating database migrations, and suggesting optimizations.",
                        category: "AI Partner",
                      })
                    }
                  >
                    {/* Robot Head */}
                    <rect x="580" y="140" width="130" height="104" rx="20" fill="url(#aiGlow)" strokeWidth="3.5" />
                    {/* Glowing Sensors */}
                    <circle cx="615" cy="184" r="12" fill="#FBBF24" stroke="currentColor" strokeWidth="3" />
                    <circle cx="675" cy="184" r="12" fill="#FBBF24" stroke="currentColor" strokeWidth="3" />
                    <circle cx="615" cy="184" r="5" fill="#0F172A" stroke="none" />
                    <circle cx="675" cy="184" r="5" fill="#0F172A" stroke="none" />
                    {/* Expressive Smile */}
                    <path d="M615 214 q30 18 60 0" strokeWidth="3.5" />
                    {/* Antenna */}
                    <path d="M645 140 v-22" strokeWidth="3" />
                    <circle cx="645" cy="112" r="8" fill="#EF4444" stroke="currentColor" strokeWidth="3" />
                    {/* Side ears */}
                    <path d="M580 184 h-16 M710 184 h16" strokeWidth="3" />
                    {/* AI Thought Aura */}
                    <circle cx="730" cy="130" r="14" fill="#A855F7" fillOpacity="0.2" stroke="#A855F7" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="724" y="135" fontSize="13" fontWeight="bold" fill="#A855F7">AI</text>
                  </g>
                </Layer>

                {/* 9 — VS Code & Terminal */}
                <Layer progress={scrollYProgress} start={0.52}>
                  {/* IDE Main Window Header */}
                  <path d="M78 162 h424" stroke="#334155" strokeWidth="2" />
                  {/* Window Control Buttons */}
                  <circle cx="92" cy="155" r="4.5" fill="#EF4444" stroke="none" />
                  <circle cx="106" cy="155" r="4.5" fill="#EAB308" stroke="none" />
                  <circle cx="120" cy="155" r="4.5" fill="#22C55E" stroke="none" />
                  {/* Editor Tab */}
                  <rect x="136" y="148" width="70" height="14" rx="3" fill="#1E293B" strokeWidth="1" />
                  <text x="142" y="158" fontSize="9" fontFamily="monospace" fill="#38BDF8">index.tsx</text>

                  {/* Terminal Sub-Window */}
                  <rect x="340" y="210" width="170" height="75" rx="6" fill="#090D16" fillOpacity="0.9" strokeWidth="2" />
                  <path d="M340 224 h170" stroke="#334155" strokeWidth="1.5" />
                  <text x="348" y="238" fontSize="9" fontFamily="monospace" fill="#22C55E">$ npm run dev</text>
                  <text x="348" y="252" fontSize="8" fontFamily="monospace" fill="#94A3B8">Vite v8.1.5 ready in 180ms</text>
                  <text x="348" y="266" fontSize="8" fontFamily="monospace" fill="#38BDF8">➜ Local: http://localhost:3000</text>
                </Layer>

                {/* 10 — Official Tech Stack Brand Badges */}
                <Layer progress={scrollYProgress} start={0.585}>
                  <g>
                    {/* React Atom Badge */}
                    <g transform="translate(560, 270)">
                      <rect x="0" y="0" width="64" height="28" rx="8" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="2" />
                      <text x="10" y="18" fontSize="11" fontWeight="bold" fill="#38BDF8">React</text>
                    </g>
                    {/* Node.js Badge */}
                    <g transform="translate(635, 270)">
                      <rect x="0" y="0" width="64" height="28" rx="8" fill="#22C55E" fillOpacity="0.2" stroke="#22C55E" strokeWidth="2" />
                      <text x="12" y="18" fontSize="11" fontWeight="bold" fill="#22C55E">Node</text>
                    </g>
                    {/* Supabase Badge */}
                    <g transform="translate(710, 270)">
                      <rect x="0" y="0" width="75" height="28" rx="8" fill="#3ECF8E" fillOpacity="0.25" stroke="#3ECF8E" strokeWidth="2" />
                      <text x="8" y="18" fontSize="11" fontWeight="bold" fill="#3ECF8E">Supabase</text>
                    </g>

                    {/* Docker Badge */}
                    <g transform="translate(560, 310)">
                      <rect x="0" y="0" width="64" height="28" rx="8" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="2" />
                      <text x="8" y="18" fontSize="11" fontWeight="bold" fill="#0284C7">Docker</text>
                    </g>
                    {/* Postgres Badge */}
                    <g transform="translate(635, 310)">
                      <rect x="0" y="0" width="72" height="28" rx="8" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeWidth="2" />
                      <text x="8" y="18" fontSize="11" fontWeight="bold" fill="#3B82F6">Postgres</text>
                    </g>
                    {/* Vercel Badge */}
                    <g transform="translate(718, 310)">
                      <rect x="0" y="0" width="66" height="28" rx="8" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="2" />
                      <text x="10" y="18" fontSize="11" fontWeight="bold" fill="#F59E0B">Vercel</text>
                    </g>

                    {/* Python & OpenAI Badges */}
                    <g transform="translate(560, 350)">
                      <rect x="0" y="0" width="64" height="28" rx="8" fill="#EAB308" fillOpacity="0.2" stroke="#EAB308" strokeWidth="2" />
                      <text x="8" y="18" fontSize="11" fontWeight="bold" fill="#EAB308">Python</text>
                    </g>
                    <g transform="translate(635, 350)">
                      <rect x="0" y="0" width="68" height="28" rx="8" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2" />
                      <text x="8" y="18" fontSize="11" fontWeight="bold" fill="#EC4899">OpenAI</text>
                    </g>
                    <g transform="translate(714, 350)">
                      <rect x="0" y="0" width="70" height="28" rx="8" fill="#A855F7" fillOpacity="0.2" stroke="#A855F7" strokeWidth="2" />
                      <text x="14" y="18" fontSize="11" fontWeight="bold" fill="#A855F7">AWS</text>
                    </g>
                  </g>
                </Layer>

                {/* 11 — Tablet & Mobile Previews */}
                <Layer progress={scrollYProgress} start={0.65}>
                  {/* Tablet Device Frame */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() =>
                      setSelectedElement({
                        title: "Tablet Device Preview",
                        desc: "Responsive tablet interface rendering smooth touch gestures and adaptive navigation drawers.",
                        category: "Mobile",
                      })
                    }
                  >
                    <rect x="100" y="325" width="80" height="78" rx="10" fill="#1E293B" strokeWidth="2.5" />
                    <rect x="106" y="331" width="68" height="66" rx="6" fill="#0F172A" stroke="none" />
                    <circle cx="140" cy="392" r="2.5" fill="#64748B" stroke="none" />
                    <path d="M112 345 h30 M112 355 h50 M112 365 h25 M112 375 h42" stroke="#38BDF8" strokeWidth="2" />
                  </g>

                  {/* Smartphone Device Frame */}
                  <g
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() =>
                      setSelectedElement({
                        title: "Smartphone Device Preview",
                        desc: "Ultra-compact mobile viewport tested across iOS Safari and Android Chrome.",
                        category: "Mobile",
                      })
                    }
                  >
                    <rect x="50" y="340" width="42" height="70" rx="8" fill="#1E293B" strokeWidth="2.5" />
                    <rect x="54" y="346" width="34" height="58" rx="5" fill="#0F172A" stroke="none" />
                    <path d="M58 358 h20 M58 368 h26 M58 378 h15" stroke="#F472B6" strokeWidth="2" />
                  </g>
                </Layer>

                {/* 12 — Live Code Lines Rendering */}
                <Layer progress={scrollYProgress} start={0.715}>
                  <path d="M96 178 h140" stroke="url(#codeHighlight)" strokeWidth="3" strokeLinecap="round" />
                  <path d="M96 192 h200" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                  <path d="M116 206 h160" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
                  <path d="M116 220 h120" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
                  <path d="M96 234 h220" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M96 248 h180" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
                </Layer>

                {/* 13 — Git Branch Graph Animation */}
                <Layer progress={scrollYProgress} start={0.78}>
                  <g transform="translate(60, 430)">
                    {/* Main Branch Line */}
                    <path d="M0 25 h220" stroke="#22C55E" strokeWidth="3" />
                    <circle cx="30" cy="25" r="5" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
                    <circle cx="100" cy="25" r="5" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
                    <circle cx="190" cy="25" r="5" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
                    {/* Feature Branch Curve */}
                    <path d="M30 25 q20 -20 40 -20 h60 q20 0 40 20" stroke="#A855F7" strokeWidth="2.5" fill="none" strokeDasharray="4 4" />
                    <circle cx="90" cy="5" r="4.5" fill="#A855F7" stroke="#0F172A" strokeWidth="2" />
                    <text x="80" y="-3" fontSize="8" fontFamily="monospace" fill="#A855F7">feat/ai-rag</text>
                  </g>
                </Layer>

                {/* 14 — Continuous Deployment Pipeline & Rocket */}
                <Layer progress={scrollYProgress} start={0.845}>
                  <g
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() =>
                      setSelectedElement({
                        title: "CI/CD Pipeline & Deployment",
                        desc: "Automated test suite passing -> Docker build -> Cloudflare Pages CDN instant sync.",
                        category: "DevOps",
                      })
                    }
                  >
                    {/* Pipeline Status Container */}
                    <rect x="680" y="45" width="130" height="42" rx="10" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" />
                    <circle cx="700" cy="66" r="6" fill="#10B981" />
                    <text x="715" y="70" fontSize="11" fontWeight="bold" fill="#10B981">Build Passing</text>

                    {/* Flying Rocket Icon Doodle */}
                    <g transform="translate(620, 40) rotate(-25)">
                      <path d="M20 0 q15 10 15 30 h-30 q0 -20 15 -30 z" fill="#EF4444" stroke="currentColor" strokeWidth="2.5" />
                      <circle cx="20" cy="18" r="4" fill="#38BDF8" stroke="currentColor" />
                      <path d="M5 30 l-10 12 h10 z M35 30 l10 12 h-10 z" fill="#F59E0B" stroke="currentColor" />
                      {/* Exhaust Flame */}
                      <path d="M12 30 q8 18 16 0" fill="#F59E0B" stroke="#EF4444" strokeWidth="2" />
                    </g>
                  </g>
                </Layer>

                {/* 15 — Full Assembly Synergy & Trophy */}
                <Layer progress={scrollYProgress} start={0.91}>
                  <g
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() =>
                      setSelectedElement({
                        title: "Full Stack Developer Mastery",
                        desc: "The complete workspace in harmony — bringing ideas to life with high quality & performance.",
                        category: "Achievement",
                      })
                    }
                  >
                    {/* Golden Trophy */}
                    <g transform="translate(740, 140)">
                      <path d="M10 0 h40 v24 a20 20 0 0 1 -40 0 z" fill="#F59E0B" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M10 8 h-10 a10 10 0 0 0 10 10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                      <path d="M50 8 h10 a10 10 0 0 1 -10 10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                      <path d="M22 36 h16 M18 46 h24" stroke="currentColor" strokeWidth="3" />
                      <path d="M30 24 v12" stroke="currentColor" strokeWidth="3" />
                    </g>
                  </g>
                </Layer>
              </g>
            </svg>

            {/* Floating Detail Inspector Modal */}
            <AnimatePresence>
              {selectedElement && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border-2 border-ink bg-card p-4 doodle-shadow-sm backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="sticker bg-sun text-ink text-xs font-bold">{selectedElement.category}</span>
                      <h4 className="font-display text-base font-bold text-foreground">{selectedElement.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedElement(null)}
                      className="rounded-full border border-ink/40 p-1 text-xs hover:bg-muted font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{selectedElement.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Step Progression (Scrollbar-Free & Responsive Tablet 2-Col Grid) */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {steps.map((s, i) => {
              const start = i * 0.062;
              return (
                <StepRow
                  key={s.title}
                  progress={scrollYProgress}
                  start={start}
                  index={i}
                  title={s.title}
                  copy={s.copy}
                  tag={s.tag}
                  accent={s.accent}
                  onSelect={() =>
                    setSelectedElement({
                      title: s.title,
                      desc: s.copy,
                      category: s.tag,
                    })
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

function StepRow({
  progress,
  start,
  index,
  title,
  copy,
  tag,
  accent,
  onSelect,
}: {
  progress: MotionValue<number>;
  start: number;
  index: number;
  title: string;
  copy: string;
  tag: string;
  accent: string;
  onSelect?: () => void;
}) {
  const safeStart = Math.max(0, start - 0.04);
  const safeEnd = Math.min(1, start + 0.03);
  const opacity = useTransform(progress, [safeStart, safeEnd], [0.55, 1]);
  const scale = useTransform(progress, [safeStart, safeEnd], [0.97, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      onClick={onSelect}
      className="group relative flex items-start gap-3 rounded-2xl border-2 border-ink/30 bg-card p-3 doodle-shadow-sm transition-all hover:border-ink cursor-pointer hover:doodle-shadow"
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink text-xs font-bold ${accent}`}>
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display text-sm font-bold text-foreground leading-tight">{title}</h4>
          <span className="sticker bg-muted/60 text-[10px] font-mono shrink-0">{tag}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{copy}</p>
      </div>
    </motion.div>
  );
}
