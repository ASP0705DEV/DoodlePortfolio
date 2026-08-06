import { Sparkles, Code2 } from "lucide-react";

export function DoodleLogo({ className = "", textClassName = "" }: { className?: string; textClassName?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Modern Badge Icon */}
      <div className="relative grid h-9 w-9 place-items-center rounded-2xl border-2 border-ink bg-sun doodle-shadow-sm transition-transform group-hover:-translate-y-0.5 group-hover:rotate-3">
        <Code2 className="h-5 w-5 text-ink stroke-[2.5]" />
        <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-coral animate-pulse" />
      </div>

      {/* Brand Identity Typography */}
      <div className={`flex flex-col ${textClassName}`}>
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground flex items-center gap-1">
          ASP0705<span className="text-coral">DEV</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground -mt-1 font-mono">
          Studio &amp; Lab
        </span>
      </div>
    </div>
  );
}
