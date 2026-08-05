import { useEffect, useRef } from "react";
import {
  DoodleBolt,
  DoodleCloud,
  DoodleHeart,
  DoodleSpiral,
  DoodleStar,
  DoodleRocket,
  DoodleLightbulb,
  DoodleCoffee,
  DoodleCodeTag,
  DoodleSparkle,
  DoodlePlanet,
} from "@/components/doodles";

/** Floating doodles + lightweight ink-particle canvas that reacts to the pointer. */
export function DoodleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const pointer = { x: -999, y: -999 };
    const dots = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = (e.clientY - r.top) / r.height;
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(30,32,44,0.18)";
      ctx.fillStyle = "rgba(30,32,44,0.35)";
      ctx.lineWidth = 1 * devicePixelRatio;

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;

        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.18) {
          ctx.beginPath();
          ctx.moveTo(d.x * w, d.y * h);
          ctx.lineTo(pointer.x * w, pointer.y * h);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />
      <div className="absolute inset-0 paper-grid opacity-60" />

      {/* Floating Doodle Icons Layer (Matching User Design) */}
      <DoodleStar className="float-slow absolute left-[4%] top-[12%] h-9 w-9 text-sun opacity-85" />
      <DoodleHeart className="float-slow absolute right-[32%] top-[4%] h-8 w-8 text-coral opacity-80" />
      <DoodleSpiral className="wobble absolute right-[7%] top-[20%] h-12 w-12 text-sky opacity-85" />
      <DoodleCloud className="float-slow absolute left-[8%] top-[55%] h-14 w-20 text-mint opacity-80" />
      <DoodleBolt className="wobble absolute right-[10%] top-[68%] h-10 w-8 text-violet opacity-85" />
      <DoodleRocket className="float-slow absolute left-[2%] top-[38%] h-11 w-9 text-coral opacity-85" />
      <DoodleLightbulb className="wobble absolute right-[3%] top-[42%] h-10 w-8 text-sun opacity-85" />
      <DoodleCoffee className="float-slow absolute left-[85%] top-[88%] h-9 w-10 text-sky opacity-80" />
      <DoodleCodeTag className="wobble absolute left-[14%] top-[82%] h-8 w-11 text-lime opacity-85" />
      <DoodleSparkle className="float-slow absolute right-[22%] top-[82%] h-7 w-7 text-bubble opacity-80" />
      <DoodlePlanet className="wobble absolute left-[22%] top-[30%] h-9 w-11 text-bubble opacity-75" />
    </div>
  );
}
