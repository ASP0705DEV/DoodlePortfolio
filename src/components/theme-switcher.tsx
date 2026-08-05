import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { THEMES, useTheme } from "@/lib/theme";
import { track } from "@/lib/analytics";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Change theme"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-card transition-transform doodle-shadow-sm hover:-translate-y-0.5"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open ? (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 z-20 mt-2 w-60 border-2 border-ink bg-card p-2 doodle-shadow"
            style={{ borderRadius: "16px 22px 16px 24px" }}
          >
            <p className="px-2 pb-1 hand text-xl text-muted-foreground">pick a vibe</p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                  void track("theme_change", { label: t.id });
                }}
                className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-accent/40"
              >
                <span className="mt-0.5 h-4 w-4 shrink-0">
                  {theme === t.id ? <Check className="h-4 w-4" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{t.label}</span>
                  <span className="block text-xs text-muted-foreground">{t.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
