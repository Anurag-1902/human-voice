import { Link } from "react-router-dom";

/**
 * Brand signature: a quill nib that doubles as a soundwave — the act of a
 * machine voice being rewritten by a human hand.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="hsl(var(--ember-500))" />
      {/* nib */}
      <path
        d="M16 6.5c-2 3.4-4 6-4 9.4 0 2.6 1.8 4.6 4 4.6s4-2 4-4.6c0-3.4-2-6-4-9.4Z"
        fill="hsl(var(--primary-foreground))"
      />
      <circle cx="16" cy="15.4" r="1.5" fill="hsl(var(--ember-500))" />
      {/* ink tail / soundwave */}
      <path
        d="M12.4 23.5c1 .9 2.3 1.3 3.6 1.3s2.6-.4 3.6-1.3"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ to = "/", className = "" }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={`group inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="font-display text-2xl leading-none tracking-tight text-foreground">
        Human<span className="text-primary">Voice</span>
      </span>
    </Link>
  );
}
