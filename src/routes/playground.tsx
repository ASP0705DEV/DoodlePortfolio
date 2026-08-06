import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section, Reveal, TypewriterText } from "@/components/ui-kit";
import { DoodleCloud, DoodleStar } from "@/components/doodles";
import {
  MemoryMatch,
  Snake,
  TicTacToe,
  TypingSpeed,
  ReactionTime,
  WhackAMole,
  SimonSays,
  WordGuess,
  submitScore,
  useHighScores,
} from "@/components/games";
import { usePageTracking } from "@/lib/analytics";
import { Gamepad2, Trophy, Sparkles } from "lucide-react";

const title = "Playground — ASP0705DEV";
const description =
  "Interactive hand-doodled mini-game collection built from scratch: Snake, Tic-Tac-Toe, Memory Match, Typing Speed, Reaction Test, Whack-a-Mole, Simon Says & Wordle.";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlaygroundPage,
});

const games = [
  { key: "tictactoe", label: "Tic Tac Toe", icon: "❌", tint: "bg-sun" },
  { key: "snake", label: "Snake (Fixed)", icon: "🐍", tint: "bg-mint" },
  { key: "memory", label: "Memory Match", icon: "🧩", tint: "bg-bubble" },
  { key: "typing", label: "Typing Speed", icon: "⌨️", tint: "bg-lime" },
  { key: "reaction", label: "Reaction Test", icon: "⚡", tint: "bg-coral text-coral-foreground" },
  { key: "whack", label: "Whack-a-Mole", icon: "🦔", tint: "bg-sky text-sky-foreground" },
  { key: "simon", label: "Simon Says", icon: "🎨", tint: "bg-sun" },
  { key: "wordle", label: "Word Guess", icon: "🔤", tint: "bg-mint" },
] as const;

function PlaygroundPage() {
  usePageTracking("/playground");
  const [active, setActive] = useState<(typeof games)[number]["key"]>("snake");
  const [reload, setReload] = useState(0);
  const scores = useHighScores(active, reload);

  const handleScore = (score: number) => {
    void submitScore(active, score).then(() => setReload((r) => r + 1));
  };

  return (
    <>
      <SiteNav />
      <main>
        <Section id="games" className="pt-28 pb-20">
          {/* REDESIGNED PLAYGROUND HERO HEADER */}
          <Reveal className="relative overflow-hidden rounded-3xl border-2 border-ink bg-sun/30 p-6 sm:p-10 doodle-shadow-lg mb-8">
            <DoodleCloud className="absolute -right-6 -top-6 h-28 w-40 text-ink/10" />
            <DoodleStar className="wobble absolute bottom-4 right-8 h-10 w-10 text-ink/15" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-3 py-1 text-xs font-bold doodle-shadow-sm mb-3">
                  <Gamepad2 className="h-4 w-4 text-ink" /> ASP0705 Arcade Studio
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                  Doodle <TypewriterText text="Playground" />
                </h1>
                <p className="mt-2 text-xs sm:text-sm max-w-xl text-muted-foreground font-medium">
                  8 hand-crafted canvas-free mini-games with local & global high scores. Tested for mobile, iPad touch screens, and desktop keyboards!
                </p>
              </div>

              <div className="rounded-2xl border-2 border-ink bg-card p-4 doodle-shadow flex items-center gap-3">
                <div className="rounded-xl border-2 border-ink bg-mint p-2.5">
                  <Trophy className="h-6 w-6 text-ink" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Active Game</div>
                  <div className="font-display text-base font-bold">
                    {games.find((g) => g.key === active)?.icon} {games.find((g) => g.key === active)?.label}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* GAME SELECTOR RIBBON */}
          <div className="mb-8 flex overflow-x-auto gap-2.5 pb-2 no-scrollbar">
            {games.map((g) => (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border-2 border-ink px-4 py-2.5 text-xs font-bold doodle-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
                  active === g.key ? g.tint : "bg-card hover:bg-muted"
                }`}
              >
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>

          {/* MAIN GAME CONTAINER & LEADERBOARD GRID */}
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <Reveal className="doodle-card grid place-items-center p-6 sm:p-10 min-h-[420px] relative">
              {active === "tictactoe" ? <TicTacToe onScore={handleScore} /> : null}
              {active === "snake" ? <Snake onScore={handleScore} /> : null}
              {active === "memory" ? <MemoryMatch onScore={handleScore} /> : null}
              {active === "typing" ? <TypingSpeed onScore={handleScore} /> : null}
              {active === "reaction" ? <ReactionTime onScore={handleScore} /> : null}
              {active === "whack" ? <WhackAMole onScore={handleScore} /> : null}
              {active === "simon" ? <SimonSays onScore={handleScore} /> : null}
              {active === "wordle" ? <WordGuess onScore={handleScore} /> : null}
            </Reveal>

            {/* HIGH SCORES LEADERBOARD PANEL */}
            <Reveal delay={0.1} className="h-fit rounded-2xl border-2 border-ink bg-card p-6 doodle-shadow">
              <div className="flex items-center justify-between border-b-2 border-ink/15 pb-3 mb-4">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-sun" /> Top Scores
                </h3>
                <Sparkles className="h-4 w-4 text-coral animate-spin" />
              </div>
              
              <ol className="grid gap-2.5 text-xs font-semibold">
                {scores.length ? (
                  scores.map((s, i) => (
                    <li key={i} className="flex justify-between items-center rounded-xl border border-ink/20 bg-muted/30 px-3 py-2">
                      <span className="font-mono font-bold text-ink">#{i + 1} Player</span>
                      <span className="sticker bg-mint font-mono font-bold">{s} pts</span>
                    </li>
                  ))
                ) : (
                  <li className="hand text-lg text-muted-foreground text-center py-4">
                    Be the first to set a high score!
                  </li>
                )}
              </ol>

              <div className="mt-6 pt-4 border-t border-dashed border-ink/30 text-[11px] text-muted-foreground text-center">
                Scores sync in real-time with Supabase database.
              </div>
            </Reveal>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
