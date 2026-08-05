import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { StoryScene } from "@/components/sections/story";
import { TechStack } from "@/components/sections/tech-stack";
import { Resume } from "@/components/sections/resume";
import { Services } from "@/components/sections/services";
import { CompanySection } from "@/components/sections/company";
import { Projects } from "@/components/sections/projects";
import { DeploymentShowcase } from "@/components/sections/deployments";
import { AgenticAI } from "@/components/sections/agentic-ai";
import { GithubSection } from "@/components/sections/github-section";
import { Collaboration } from "@/components/sections/collaboration";
import { Contact, Newsletter } from "@/components/sections/engage";
import { PlaygroundTeaser } from "@/components/sections/playground-teaser";
import { DoodleChatbot } from "@/components/chatbot/doodle-chatbot";
import { CookieConsent } from "@/components/cookie-consent";
import { usePageTracking } from "@/lib/analytics";
import { useCMSContent } from "@/lib/cms-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sai Prithvi — Full Stack & Agentic AI Developer | ASP0705DEV" },
      {
        name: "description",
        content:
          "Portfolio & Software Studio of Adapa Sai Prithvi (ASP0705DEV), Full Stack Developer & AI Systems Architect building modern web platforms, autonomous agents, and business software.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  usePageTracking("/");
  const cms = useCMSContent();
  const vis = cms.section_visibility || {
    hero: true,
    about: true,
    stack: true,
    projects: true,
    services: true,
    company: true,
    deployments: true,
    github: true,
    blog: true,
    playground: true,
    newsletter: true,
    contact: true,
  };

  return (
    <>
      <SiteNav />
      <main>
        {vis.hero !== false ? <Hero /> : null}
        {vis.about !== false ? <About /> : null}
        <StoryScene />

        {vis.services !== false ? <Services /> : null}
        {vis.company !== false ? <CompanySection /> : null}

        {vis.stack !== false ? <TechStack /> : null}
        <Resume />
        {vis.projects !== false ? <Projects /> : null}
        {vis.deployments !== false ? <DeploymentShowcase /> : null}

        <AgenticAI />
        {vis.github !== false ? <GithubSection /> : null}
        {vis.playground !== false ? <PlaygroundTeaser /> : null}
        <Collaboration />
        {vis.newsletter !== false ? <Newsletter /> : null}
        {vis.contact !== false ? <Contact /> : null}
      </main>
      <SiteFooter />
      <DoodleChatbot />
      <CookieConsent />
    </>
  );
}
