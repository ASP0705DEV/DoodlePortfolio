import { useEffect, useRef, useState } from "react";

/** Ink-dot cursor with a trailing sketch ring. Desktop / fine-pointer only. */
export function DoodleCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = e.target as HTMLElement | null;
      setActive(!!el?.closest("a,button,[data-cursor]"));
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`;
      }
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x - 20}px, ${ringPos.y - 20}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ring}
        className={`absolute left-0 top-0 h-10 w-10 rounded-full border-2 border-ink transition-[width,height,opacity,background-color] duration-200 ${
          active ? "bg-sun/40 opacity-100" : "opacity-60"
        }`}
        style={{ borderRadius: "48% 52% 55% 45%" }}
      />
      <div ref={dot} className="absolute left-0 top-0 h-2 w-2 rounded-full bg-coral" />
    </div>
  );
}

/** Top-of-page scribbled scroll progress bar. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[90] h-1.5 bg-transparent">
      <div
        className="h-full bg-coral transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
