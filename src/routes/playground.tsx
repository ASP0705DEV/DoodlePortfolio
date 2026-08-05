import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section, SectionHeading, Reveal } from "@/components/ui-kit";
import {
  MemoryMatch,
  Snake,
  TicTacToe,
  TypingSpeed,
  submitScore,
  useHighScores,
} from "@/components/games";
import { usePageTracking } from "@/lib/analytics";

const title = "Playground — Sai Prithvi";
const description =
  "Four hand-doodled browser games built from scratch: Tic Tac Toe, Snake, Memory Match and Typing Speed.";

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
  { key: "tictactoe", label: "Tic Tac Toe", tint: "bg-sun" },
  { key: "snake", label: "Snake", tint: "bg-mint" },
  { key: "memory", label: "Memory Match", tint: "bg-bubble" },
  { key: "typing", label: "Typing Speed", tint: "bg-lime" },
] as const;

function PlaygroundPage() {
  usePageTracking("/playground");
  const [active, setActive] = useState<(typeof games)[number]["key"]>("tictactoe");
  const [reload, setReload] = useState(0);
  const scores = useHighScores(active, reload);

  const handleScore = (score: number) => {
    void submitScore(active, score).then(() => setReload((r) => r + 1));
  };

  return (
    <>
      <SiteNav />
      <main>
        <Section id="games" className="pt-28">
          <SectionHeading
            kicker="take a break"
            title="Playground"
            subtitle="Small games, no libraries — just canvas-free React, doodles and a bit of logic."
            accent="text-lime"
          />

          <div className="mb-8 flex flex-wrap gap-2">
            {games.map((g) => (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={`rounded-2xl border-2 border-ink px-4 py-2 text-sm font-bold doodle-shadow-sm transition-transform hover:-translate-y-0.5 ${
                  active === g.key ? g.tint : "bg-card"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
            <Reveal className="doodle-card grid place-items-center p-8">
              {active === "tictactoe" ? <TicTacToe onScore={handleScore} /> : null}
              {active === "snake" ? <Snake onScore={handleScore} /> : null}
              {active === "memory" ? <MemoryMatch onScore={handleScore} /> : null}
              {active === "typing" ? <TypingSpeed onScore={handleScore} /> : null}
            </Reveal>

            <Reveal delay={0.1} className="h-fit rounded-2xl border-2 border-ink bg-card p-6 doodle-shadow">
              <h3 className="text-xl">Top scores</h3>
              <ol className="mt-3 grid gap-2 text-sm font-semibold">
                {scores.length ? (
                  scores.map((s, i) => (
                    <li key={i} className="flex justify-between border-b border-dashed border-ink/30 pb-1">
                      <span>#{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <li className="hand text-xl text-muted-foreground">be the first to score</li>
                )}
              </ol>
            </Reveal>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
