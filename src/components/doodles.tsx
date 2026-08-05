import type { SVGProps } from "react";

/** Hand-drawn SVG doodle set. All strokes use currentColor so they inherit text color. */

export function DoodleArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 60" fill="none" {...props}>
      <path
        d="M4 42c22-30 54-38 88-22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M78 8l16 12-18 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M24 4l5 13 14 2-10 9 3 14-12-7-12 7 3-14-10-9 14-2z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleSpiral(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" {...props}>
      <path
        d="M30 30c0-6 8-6 8 0s-10 10-16 4-4-20 8-22 24 10 22 26"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoodleBolt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 60" fill="none" {...props}>
      <path
        d="M24 4L8 32h12L14 56l20-30H21z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleBrain(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 70" fill="none" {...props}>
      <path
        d="M40 12c-6-8-22-6-24 4-8 2-10 14-3 18-4 8 3 17 11 15 3 7 13 8 16 2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M40 12c6-8 22-6 24 4 8 2 10 14 3 18 4 8-3 17-11 15-3 7-13 8-16 2z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M40 12v40M28 26h8M52 34h-8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoodleCloud(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 56" fill="none" {...props}>
      <path
        d="M24 46c-11 0-18-8-18-16S14 14 24 15c3-8 12-13 21-10s13 10 13 16c9-3 18 3 18 12s-8 13-16 13z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleRobot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 70 80" fill="none" {...props}>
      <path d="M35 6v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="35" cy="5" r="4" stroke="currentColor" strokeWidth="3" />
      <rect
        x="10"
        y="18"
        width="50"
        height="40"
        rx="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="26" cy="36" r="4" fill="currentColor" />
      <circle cx="45" cy="36" r="4" fill="currentColor" />
      <path
        d="M26 48h19M4 32v14M66 32v14M22 58v14M48 58v14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoodleSquiggle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 20" fill="none" preserveAspectRatio="none" {...props}>
      <path
        d="M2 12c14-12 26 8 40-2s26 10 40 0 26 10 40 0 26 8 36 2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoodleHeart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 44" fill="none" {...props}>
      <path
        d="M24 40S4 28 4 16C4 9 9 4 16 4c4 0 7 2 8 5 1-3 4-5 8-5 7 0 12 5 12 12 0 12-20 24-20 24z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleGamepad(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 60" fill="none" {...props}>
      <path
        d="M22 16h46c10 0 18 9 18 20s-10 16-16 10l-7-7H27l-7 7c-6 6-16 1-16-10s8-20 18-20z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M22 28h10M27 23v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="62" cy="26" r="3" fill="currentColor" />
      <circle cx="70" cy="33" r="3" fill="currentColor" />
    </svg>
  );
}

export function DoodleBlobUnderline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 220 16" fill="none" preserveAspectRatio="none" {...props}>
      <path
        d="M4 10c40-8 90-9 132-4 26 3 52 1 80-3"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoodleRocket(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 50 60" fill="none" {...props}>
      <path
        d="M25 4c-9 10-13 22-13 32h26C38 26 34 14 25 4z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="22" r="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 36l-8 8v6l8-4M38 36l8 8v6l-8-4M20 36v10l5 8 5-8V36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoodleLightbulb(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 56" fill="none" {...props}>
      <path
        d="M22 6C13 6 6 13 6 22c0 6 3 11 8 14v6h16v-6c5-3 8-8 8-14 0-9-7-16-16-16z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M16 48h12M18 53h8M22 2c0-2 0-2 0-2M38 10l3-3M6 10l-3-3M42 22h3M2 22h3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleCoffee(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 54 48" fill="none" {...props}>
      <path d="M8 12h32v20c0 6-5 10-11 10H19c-6 0-11-4-11-10V12z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M40 16h6c4 0 6 3 6 6s-2 6-6 6h-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M4 46h40M16 4c0-3 3-3 3-6M24 4c0-3 3-3 3-6M32 4c0-3 3-3 3-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleCodeTag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 40" fill="none" {...props}>
      <path d="M18 10L6 20l12 10M42 10l12 10-12 10M33 8l-6 24" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoodleSparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" {...props}>
      <path d="M20 2v36M2 20h36M8 8l24 24M32 8L8 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DoodlePlanet(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 50" fill="none" {...props}>
      <circle cx="30" cy="25" r="14" stroke="currentColor" strokeWidth="3" />
      <path d="M6 32c6 6 22 10 36 6s14-12 6-16-24-4-36 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ASPLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 52" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Background hand-drawn doodle pill frame */}
      <rect
        x="3"
        y="3"
        width="154"
        height="46"
        rx="16"
        className="fill-sun/30 stroke-ink"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Marker color underline highlight behind letters */}
      <path
        d="M16 32c22-6 50-8 82-4 20 3 38 1 48-2"
        stroke="var(--coral)"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Letter 'A' hand-drawn doodle */}
      <path
        d="M20 38L34 12L48 38M26 28h16"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Letter 'S' hand-drawn doodle */}
      <path
        d="M84 15c-7-4-18-3-18 4 0 10 18 5 18 14 0 8-11 9-18 4"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Letter 'P' hand-drawn doodle */}
      <path
        d="M104 38V12h16c7 0 11 3 11 9s-4 9-11 9h-16"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Doodle Sparkle Star Accent */}
      <path
        d="M144 14l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"
        fill="var(--mint)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
