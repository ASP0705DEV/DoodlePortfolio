import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Shield, BookOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ASPLogo } from "@/components/doodles";
import { ThemeSwitcher } from "@/components/theme-switcher";

const links = [
  { label: "Services", to: "/", hash: "services" },
  { label: "Company", to: "/", hash: "company" },
  { label: "Projects", to: "/", hash: "projects" },
  { label: "Deployments", to: "/", hash: "deployments" },
  { label: "Agentic AI", to: "/", hash: "ai" },
  { label: "Contact", to: "/", hash: "collaborate" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-3 z-50 mx-auto w-[min(1180px,96%)] transition-all duration-300",
        scrolled ? "translate-y-0" : "translate-y-1",
      )}
    >
      <nav
        className="flex items-center justify-between border-2 border-ink bg-card/90 px-4 py-2.5 backdrop-blur doodle-shadow"
        style={{ borderRadius: "18px 24px 18px 26px" }}
      >
        <Link to="/" className="group flex items-center gap-2 transition-transform hover:scale-105" aria-label="ASP Home">
          <ASPLogo className="h-9 w-auto text-ink" />
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <a
              key={l.hash}
              href={pathname === "/" ? `#${l.hash}` : `/#${l.hash}`}
              className="relative rounded-full px-2.5 py-1 text-xs font-bold transition-colors hover:bg-sun/50"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/blog"
            className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-xs font-bold text-ink doodle-shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Blog
          </Link>
          <Link
            to="/playground"
            className="rounded-full border-2 border-ink bg-lime px-3 py-1 text-xs font-bold text-lime-foreground doodle-shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Playground
          </Link>
          <ThemeSwitcher />
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          <ThemeSwitcher />
          <button aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          className="mt-2 grid gap-1 border-2 border-ink bg-card p-3 doodle-shadow xl:hidden"
          style={{ borderRadius: "18px 24px 18px 26px" }}
        >
          {links.map((l) => (
            <a
              key={l.hash}
              href={pathname === "/" ? `#${l.hash}` : `/#${l.hash}`}
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-sun/40"
            >
              {l.label}
            </a>
          ))}
          <Link to="/blog" className="rounded-xl bg-sun px-3 py-2 text-sm font-bold">
            Blog Articles
          </Link>
          <Link to="/playground" className="rounded-xl bg-lime px-3 py-2 text-sm font-bold text-lime-foreground">
            Playground Games
          </Link>
          <Link to="/docs" className="rounded-xl bg-bubble px-3 py-2 text-sm font-bold">
            Documentation
          </Link>
        </div>
      ) : null}
    </header>
  );
}
