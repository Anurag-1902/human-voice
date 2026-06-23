import { Reveal } from "@/components/shared/primitives";

const STATS = [
  { value: "2-pass", label: "Rewrite pipeline" },
  { value: "100+", label: "AI tells removed" },
  { value: "4", label: "Tone presets" },
  { value: "0", label: "Facts changed" },
];

const LOGOS = ["Notion", "Substack", "Medium", "Ghost", "WordPress", "LinkedIn"];

export function SocialProof() {
  return (
    <section className="border-y border-border bg-card/40 py-12">
      <div className="container">
        <Reveal className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl text-foreground sm:text-5xl">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Writing that fits in everywhere you publish
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {LOGOS.map((logo) => (
              <span key={logo} className="font-display text-2xl text-muted-foreground">
                {logo}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
