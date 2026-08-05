import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siTailwindcss,
  siHtml5,
  siVite,
  siRedux,
  siNodedotjs,
  siExpress,
  siPython,
  siFastapi,
  siDjango,
  siGraphql,
  siSocketdotio,
  siPostgresql,
  siMongodb,
  siMysql,
  siRedis,
  siSupabase,
  siFirebase,
  siPrisma,
  siDocker,
  siKubernetes,
  siCloudflare,
  siVercel,
  siGithubactions,
  siNginx,
  siLinux,
  siAnthropic,
  siLangchain,
  siHuggingface,
  siPytorch,
  siTensorflow,
  siOllama,
  siN8n,
  siGit,
  siGithub,
  siPostman,
  siFigma,
  siNotion,
} from "simple-icons";

export type TechIcon = { title: string; hex: string; path: string };

export type TechGroup = {
  id: string;
  label: string;
  blurb: string;
  accent: string;
  items: TechIcon[];
};

const pick = (i: { title: string; hex: string; path: string }): TechIcon => ({
  title: i.title,
  hex: i.hex,
  path: i.path,
});

export const techGroups: TechGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Interfaces that feel alive",
    accent: "bg-sun",
    items: [
      siReact,
      siNextdotjs,
      siTypescript,
      siJavascript,
      siTailwindcss,
      siVite,
      siRedux,
      siHtml5,
    ].map(pick),
  },
  {
    id: "backend",
    label: "Backend",
    blurb: "APIs, services, realtime",
    accent: "bg-mint",
    items: [siNodedotjs, siExpress, siPython, siFastapi, siDjango, siGraphql, siSocketdotio].map(
      pick,
    ),
  },
  {
    id: "data",
    label: "Data",
    blurb: "Modelling and persistence",
    accent: "bg-sky text-sky-foreground",
    items: [siPostgresql, siMongodb, siMysql, siRedis, siSupabase, siFirebase, siPrisma].map(pick),
  },
  {
    id: "ai",
    label: "AI & Agents",
    blurb: "Reasoning, RAG, automation",
    accent: "bg-violet text-violet-foreground",
    items: [siAnthropic, siLangchain, siHuggingface, siPytorch, siTensorflow, siOllama, siN8n].map(
      pick,
    ),
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    blurb: "Ship it, keep it up",
    accent: "bg-coral text-coral-foreground",
    items: [siDocker, siKubernetes, siCloudflare, siVercel, siGithubactions, siNginx, siLinux].map(
      pick,
    ),
  },
  {
    id: "tools",
    label: "Tools",
    blurb: "The daily workbench",
    accent: "bg-lime",
    items: [siGit, siGithub, siPostman, siFigma, siNotion].map(pick),
  },
];
