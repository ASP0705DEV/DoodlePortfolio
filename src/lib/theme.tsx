import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export const THEMES = [
  { id: "doodle", label: "Doodle Paper", hint: "Playful hand-drawn light", dark: false },
  { id: "neo", label: "Neo Brutalism", hint: "Loud blocks, hard shadows", dark: false },
  { id: "pro", label: "Dark Professional", hint: "Calm, premium, focused", dark: true },
  { id: "cyber", label: "Cyberpunk", hint: "Neon grid, night city", dark: true },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const STORAGE_KEY = "sp_theme";
const DEFAULT: ThemeId = "doodle";

function isTheme(v: string | null): v is ThemeId {
  return !!v && THEMES.some((t) => t.id === v);
}

function apply(id: ThemeId) {
  const root = document.documentElement;
  root.setAttribute("data-theme", id);
  const isDark = THEMES.find((t) => t.id === id)?.dark ?? false;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
}

type Ctx = { theme: ThemeId; setTheme: (id: ThemeId) => void };

const ThemeContext = createContext<Ctx>({ theme: DEFAULT, setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const next = isTheme(stored) ? stored : DEFAULT;
    setThemeState(next);
    apply(next);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    apply(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
