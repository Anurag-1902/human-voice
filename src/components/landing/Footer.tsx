import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Benefits", href: "#benefits" },
      { label: "Open app", href: "/app" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Newsletters", href: "/app" },
      { label: "Essays", href: "/app" },
      { label: "Marketing copy", href: "/app" },
      { label: "Academic drafts", href: "/app" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Reviews", href: "#reviews" },
      { label: "AI score guide", href: "#features" },
      { label: "Writing tips", href: "#benefits" },
    ],
  },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  const isHash = href.startsWith("#");
  const cls = "text-sm text-muted-foreground transition-colors hover:text-foreground";
  return isHash ? (
    <a href={href} className={cls}>
      {label}
    </a>
  ) : (
    <Link to={href} className={cls}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Turn AI-generated text into natural, human-sounding writing — without changing what it says.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HumanVoice. Crafted for writing with a pulse.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
