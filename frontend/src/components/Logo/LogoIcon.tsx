import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
}

/**
 * Square logo icon - theme-aware with CSS variables
 * Used for favicon, mobile nav, and small logo placements
 */
export const LogoIcon = ({ className }: LogoIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("h-10 w-10", className)}
      aria-label="Peter T Conti Logo"
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="[stop-color:var(--logo-bg-start)]" />
          <stop offset="100%" className="[stop-color:var(--logo-bg-end)]" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" className="[stop-color:var(--logo-accent-start)]" />
          <stop offset="100%" className="[stop-color:var(--logo-accent-end)]" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="100" height="100" rx="12" fill="url(#iconGradient)" />

      {/* Tech circuit lines */}
      <path
        d="M0 70 L20 70 L25 65 L35 65"
        className="stroke-[var(--logo-accent-start)]"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M100 30 L80 30 L75 35 L65 35"
        className="stroke-[var(--logo-accent-end)]"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
      <circle cx="35" cy="65" r="2" className="fill-[var(--logo-accent-start)]" opacity="0.4" />
      <circle cx="65" cy="35" r="2" className="fill-[var(--logo-accent-end)]" opacity="0.4" />

      {/* Main "P" letterform */}
      <g transform="translate(22, 20)">
        {/* Vertical stem of P */}
        <rect x="0" y="0" width="10" height="60" rx="2" className="fill-[var(--logo-text)]" />

        {/* Bowl of P */}
        <path
          d="M10 0 L40 0 Q55 0 55 15 L55 20 Q55 35 40 35 L10 35 L10 25 L38 25 Q42 25 42 20 L42 15 Q42 10 38 10 L10 10 Z"
          className="fill-[var(--logo-text)]"
        />

        {/* Tech accent - data flow indicator */}
        <rect x="45" y="13" width="12" height="4" rx="2" fill="url(#accentGradient)" />
      </g>

      {/* Corner bracket accents */}
      <path
        d="M8 8 L8 20 M8 8 L20 8"
        stroke="url(#accentGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 92 L92 80 M92 92 L80 92"
        stroke="url(#accentGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default LogoIcon;
