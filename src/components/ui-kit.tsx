import { motion, useInView } from "motion/react";
import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { DoodleBlobUnderline } from "@/components/doodles";

/** Scroll-triggered reveal. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 26,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Button that leans toward the pointer and ripples on click. */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  target,
  type = "button",
}: {
  children: ReactNode;
  className?: string;
  href?: string | undefined;
  onClick?: (() => void) | undefined;
  target?: string | undefined;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const handleClick = (e: MouseEvent) => {
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const id = Date.now();
      setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
      setTimeout(() => setRipples((p) => p.filter((rp) => rp.id !== id)), 600);
    }
    onClick?.();
  };

  const classes = cn(
    "relative inline-flex select-none items-center justify-center gap-2 overflow-hidden border-2 border-ink px-6 py-3 text-sm font-bold transition-shadow duration-200",
    "doodle-shadow hover:doodle-shadow-lg",
    className,
  );

  const inner = (
    <>
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute h-4 w-4 animate-[ping_0.6s_ease-out] rounded-full bg-ink/25"
          style={{ left: r.x - 8, top: r.y - 8 }}
        />
      ))}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
        className={classes}
        style={{ borderRadius: "14px 20px 14px 22px" }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={handleClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      className={classes}
      style={{ borderRadius: "14px 20px 14px 22px" }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={handleClick}
    >
      {inner}
    </button>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  accent = "text-coral",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <Reveal className="mb-12 max-w-3xl">
      <span className="hand text-xl sm:text-2xl text-muted-foreground">{kicker}</span>
      <h2 className="relative mt-1 inline-block text-3xl sm:text-4xl lg:text-5xl">
        {title}
        <DoodleBlobUnderline className={cn("absolute -bottom-3 left-0 h-3 w-full", accent)} />
      </h2>
      {subtitle ? <p className="mt-6 text-sm sm:text-base text-muted-foreground max-w-2xl">{subtitle}</p> : null}
    </Reveal>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24", className)}>
      {children}
    </section>
  );
}

/** Typewriter effect displaying text letter-by-letter with a blinking doodle cursor */
export function TypewriterText({
  text,
  speed = 50,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {displayedText}
      <span className="ml-1 inline-block h-[1em] w-0.5 animate-pulse bg-coral" />
    </span>
  );
}
