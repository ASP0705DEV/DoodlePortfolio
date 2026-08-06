import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, PhoneCall } from "lucide-react";
import { DoodleHeart, DoodleSquiggle } from "@/components/doodles";
import { useProfile } from "@/lib/portfolio";
import { track } from "@/lib/analytics";

export function SiteFooter() {
  const { data: profile } = useProfile();
  return (
    <footer className="relative mt-16 border-t-2 border-ink bg-card/80">
      <DoodleSquiggle className="absolute -top-3 left-0 h-6 w-full text-violet" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-12 text-center sm:px-8">
        <div className="flex items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            onClick={() => void track("click_github", { label: "footer" })}
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-mint doodle-shadow-sm transition-transform hover:-translate-y-1"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            onClick={() => void track("click_linkedin", { label: "footer" })}
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-sky text-sky-foreground doodle-shadow-sm transition-transform hover:-translate-y-1"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://wa.me/917070362117"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            onClick={() => void track("click_whatsapp", { label: "footer" })}
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-lime doodle-shadow-sm transition-transform hover:-translate-y-1"
          >
            <PhoneCall className="h-5 w-5" />
          </a>
          <a
            href="/#contact"
            aria-label="Contact"
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-sun doodle-shadow-sm transition-transform hover:-translate-y-1"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>

        <div className="space-y-1">
          <p className="hand flex flex-wrap items-center justify-center gap-2 text-xl sm:text-2xl text-foreground font-bold">
            Designed, Developed &amp; Crafted with <DoodleHeart className="inline h-5 w-5 text-coral animate-bounce" /> by{" "}
            <span className="sticker bg-sun text-ink font-mono font-bold">ASP0705DEV</span>
          </p>
          <p className="text-xs text-muted-foreground">Full Stack Architecture • Agentic AI • Cloud Systems</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-semibold border-t border-ink/15 pt-6 w-full max-w-2xl">
          <Link to="/" className="underline-offset-4 hover:underline hover:text-foreground">
            Home
          </Link>
          <a href="/#services" className="underline-offset-4 hover:underline hover:text-foreground">
            Services
          </a>
          <a href="/#company" className="underline-offset-4 hover:underline hover:text-foreground">
            Studio
          </a>
          <a href="/#deployments" className="underline-offset-4 hover:underline hover:text-foreground">
            Deployments
          </a>
          <Link to="/blog" className="underline-offset-4 hover:underline hover:text-foreground">
            Blog
          </Link>
          <Link to="/playground" className="underline-offset-4 hover:underline hover:text-foreground">
            Playground
          </Link>
          <Link to="/docs" className="underline-offset-4 hover:underline hover:text-foreground">
            Docs
          </Link>
          <span className="w-full sm:w-auto text-[11px] font-mono text-muted-foreground mt-1 sm:mt-0">
            © {new Date().getFullYear()} ASP0705DEV. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
