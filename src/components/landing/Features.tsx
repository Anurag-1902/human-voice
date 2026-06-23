import { ShieldCheck, Sliders, Scissors, RefreshCw, Gauge, Lock } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/shared/primitives";

const FEATURES = [
  {
    icon: Gauge,
    title: "Built-in AI detector",
    body: "Every rewrite is scored against 100+ machine-writing tells — formulaic transitions, uniform sentences, low contractions — so you see exactly how human it reads.",
    span: "sm:col-span-2",
  },
  {
    icon: Sliders,
    title: "Four tone presets",
    body: "Casual, professional, academic, or creative. Each one shifts voice and rhythm, not the facts.",
  },
  {
    icon: ShieldCheck,
    title: "Facts stay locked",
    body: "Names, numbers, dates, and claims are preserved exactly. It's a mirror, never a commentator.",
  },
  {
    icon: RefreshCw,
    title: "Re-humanize on demand",
    body: "Not natural enough? One click feeds the detected patterns back in for a more aggressive second rewrite.",
  },
  {
    icon: Scissors,
    title: "Condense mode",
    body: "Trim filler to a tight ~250 words while keeping every core argument and detail intact.",
  },
  {
    icon: Lock,
    title: "Your text, your control",
    body: "Paste, rewrite, copy, clear. Nothing is published or shared — the workspace is just yours.",
    span: "sm:col-span-2",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title={<>Everything you need to <em className="text-gradient-primary not-italic">de-robotize</em> a draft</>}
            description="A focused toolkit built around one job: turning detectable AI prose into writing that sounds like you."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} className={f.span ?? ""}>
              <article className="group h-full rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl leading-tight text-foreground">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
