import { motion } from "motion/react";
import { Bot, Brain, GitBranch, Layers, Workflow, Zap } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/ui-kit";
import { DoodleArrow, DoodleRobot } from "@/components/doodles";

const pillars = [
  {
    icon: Bot,
    title: "Autonomous agents",
    body: "Goal-driven agents with tool access, step budgets and self-critique loops.",
    tint: "bg-violet/25",
  },
  {
    icon: Layers,
    title: "RAG pipelines",
    body: "Semantic chunking, hybrid retrieval and reranking for grounded, cited answers.",
    tint: "bg-mint",
  },
  {
    icon: Workflow,
    title: "Multi-agent systems",
    body: "Planner, retriever, critic and writer agents collaborating over shared memory.",
    tint: "bg-sun",
  },
  {
    icon: Zap,
    title: "Intelligent automation",
    body: "LLM steps embedded in durable queues, retries and observable run timelines.",
    tint: "bg-bubble",
  },
  {
    icon: Brain,
    title: "LLM integrations",
    body: "Structured outputs, function calling and evaluation harnesses in production apps.",
    tint: "bg-lime",
  },
  {
    icon: GitBranch,
    title: "Experiments",
    body: "Ongoing research into planning strategies, memory design and agent evaluation.",
    tint: "bg-sky/30",
  },
];

const flow = ["Goal", "Plan", "Retrieve", "Act", "Critique", "Deliver"];

export function AgenticAI() {
  return (
    <Section id="ai">
      <SectionHeading
        kicker="the next chapter"
        title="AI & Agentic systems"
        subtitle="Where full stack engineering meets systems that reason, plan and act on their own."
        accent="text-violet"
      />

      <Reveal className="relative mb-12 overflow-hidden doodle-card p-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {flow.map((step, i) => (
            <motion.div
              key={step}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <span className="rounded-2xl border-2 border-ink bg-card px-4 py-2 text-sm font-bold doodle-shadow-sm">
                {step}
              </span>
              {i < flow.length - 1 ? (
                <DoodleArrow className="h-6 w-10 text-coral" />
              ) : null}
            </motion.div>
          ))}
        </div>
        <p className="hand mt-6 text-center text-2xl text-muted-foreground">
          every agent loop I build follows this sketch
        </p>
        <DoodleRobot className="absolute -bottom-6 -right-4 h-28 w-24 rotate-6 text-ink/10" />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <motion.div
              whileHover={{ y: -6, rotate: i % 2 ? 1 : -1 }}
              className={`h-full rounded-2xl border-2 border-ink p-6 doodle-shadow ${p.tint}`}
            >
              <p.icon className="h-8 w-8" />
              <h3 className="mt-3 text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
