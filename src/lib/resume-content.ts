export type ResumeContent = {
  summary: string;
  services: { title: string; copy: string }[];
  education: { school: string; degree: string; period: string; detail: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  achievements: { title: string; copy: string }[];
  facts: { label: string; value: string }[];
};

export const defaultResume: ResumeContent = {
  summary:
    "Full Stack Developer at Gagellan Global Solutions, based in India. I build production web platforms end to end — React and TypeScript on the front, Node and Python services behind them — and I'm going deep on agentic AI: systems that reason, retrieve, plan and act instead of just answering.",
  services: [
    {
      title: "Full stack product builds",
      copy: "From blank repo to deployed product: UI, API, database, auth, payments, CI.",
    },
    {
      title: "Agentic AI systems",
      copy: "RAG pipelines, tool-using agents, multi-step workflows with guardrails and evals.",
    },
    {
      title: "Intelligent automation",
      copy: "Replacing manual busywork with reliable pipelines and event-driven jobs.",
    },
    {
      title: "Performance & DX rescue",
      copy: "Auditing slow, brittle codebases and turning them into something a team enjoys.",
    },
  ],
  education: [
    {
      school: "Bachelor of Technology — Computer Science",
      degree: "B.Tech, CSE",
      period: "India",
      detail: "Foundations in data structures, algorithms, databases and distributed systems.",
    },
  ],
  certifications: [
    { name: "Full Stack Web Development", issuer: "Self-directed + industry projects", year: "—" },
    { name: "Applied Generative AI & Agents", issuer: "Ongoing specialisation", year: "2025" },
  ],
  achievements: [
    {
      title: "Shipped production platforms",
      copy: "Delivered client-facing web applications used in day-to-day business operations.",
    },
    {
      title: "Automation that pays for itself",
      copy: "Built workflows that removed hours of repetitive manual work each week.",
    },
    {
      title: "Agentic AI exploration",
      copy: "Prototyping autonomous agents that plan, call tools and self-correct.",
    },
  ],
  facts: [
    { label: "Based in", value: "India" },
    { label: "Currently at", value: "Gagellan Global Solutions" },
    { label: "Focus", value: "Full stack + Agentic AI" },
    { label: "Open to", value: "Collaborations & freelance" },
  ],
};
