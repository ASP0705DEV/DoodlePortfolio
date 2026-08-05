import { Link } from "@tanstack/react-router";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { DoodleGamepad } from "@/components/doodles";

const games = [
  { name: "Tic Tac Toe", tint: "bg-sun", note: "beat my little AI" },
  { name: "Snake", tint: "bg-mint", note: "doodle edition" },
  { name: "Memory Match", tint: "bg-bubble", note: "flip the tech logos" },
  { name: "Typing Speed", tint: "bg-lime", note: "type real code" },
];

export function PlaygroundTeaser() {
  return (
    <Section id="playground">
      <SectionHeading
        kicker="stay a while"
        title="Playground"
        subtitle="Four tiny browser games, doodled and built from scratch. High scores are saved."
        accent="text-lime"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((g, i) => (
          <Reveal key={g.name} delay={i * 0.07}>
            <Link
              to="/playground"
              className={`flex h-full flex-col items-start rounded-2xl border-2 border-ink p-6 doodle-shadow transition-transform hover:-translate-y-1.5 ${g.tint}`}
            >
              <DoodleGamepad className="h-10 w-14" />
              <h3 className="mt-3 text-lg">{g.name}</h3>
              <span className="hand text-xl opacity-70">{g.note}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
