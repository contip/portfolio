import { cn } from "@/lib/utils";

interface LogoFullProps {
  className?: string;
}

/**
 * Full wide logo with icon + text - theme-aware with CSS variables
 * Used in navigation bar
 */
export const LogoFull = ({ className }: LogoFullProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 80"
      className={cn("h-16 w-auto", className)}
      aria-label="Peter T Conti - Software Engineering & Cloud Solutions"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="[stop-color:var(--logo-bg-start)]" />
          <stop offset="100%" className="[stop-color:var(--logo-bg-end)]" />
        </linearGradient>
        <linearGradient id="logoAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" className="[stop-color:var(--logo-accent-start)]" />
          <stop offset="100%" className="[stop-color:var(--logo-accent-end)]" />
        </linearGradient>
      </defs>

      {/* Icon portion */}
      <g transform="translate(0, 5)">
        <rect width="70" height="70" rx="10" fill="url(#logoGradient)" />

        {/* Circuit lines */}
        <path
          d="M0 50 L14 50 L18 46 L26 46"
          className="stroke-[var(--logo-accent-start)]"
          strokeWidth="1.2"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M70 20 L56 20 L52 24 L44 24"
          className="stroke-[var(--logo-accent-end)]"
          strokeWidth="1.2"
          fill="none"
          opacity="0.3"
        />
        <circle cx="26" cy="46" r="1.5" className="fill-[var(--logo-accent-start)]" opacity="0.4" />
        <circle cx="44" cy="24" r="1.5" className="fill-[var(--logo-accent-end)]" opacity="0.4" />

        {/* P letterform */}
        <g transform="translate(15, 14)">
          <rect x="0" y="0" width="7" height="42" rx="1.5" className="fill-[var(--logo-text)]" />
          <path
            d="M7 0 L28 0 Q38 0 38 10 L38 14 Q38 24 28 24 L7 24 L7 17 L26 17 Q29 17 29 14 L29 10 Q29 7 26 7 L7 7 Z"
            className="fill-[var(--logo-text)]"
          />
          <rect x="31" y="9" width="9" height="3" rx="1.5" fill="url(#logoAccent)" />
        </g>

        {/* Corner brackets */}
        <path
          d="M6 6 L6 14 M6 6 L14 6"
          stroke="url(#logoAccent)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M64 64 L64 56 M64 64 L56 64"
          stroke="url(#logoAccent)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Text portion */}
      <g transform="translate(85, 0)">
        {/* Name */}
        <text
          x="0"
          y="38"
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            fill: "var(--logo-name)",
            letterSpacing: "-0.4px",
          }}
        >
          Peter T Conti
        </text>

        {/* Tagline */}
        <text
          x="0"
          y="60"
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            fill: "var(--logo-tagline)",
            letterSpacing: "1.6px",
          }}
        >
          SOFTWARE ENGINEERING | CLOUD SOLUTIONS
        </text>

        {/* Accent line */}
        <rect x="0" y="66" width="80" height="2" rx="1" fill="url(#logoAccent)" />
      </g>
    </svg>
  );
};

export default LogoFull;
