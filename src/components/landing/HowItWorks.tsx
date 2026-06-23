import { ClipboardPaste, Wand2, CopyCheck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/shared/primitives";

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste your draft",
    body: "Drop in any AI-generated or stiff text. Pick a tone, and toggle condense if you want it tighter.",
  },
  {
    icon: Wand2,
    title: "Run the rewrite",
    body: "A first pass restyles the voice; a second pass cleans up any machine tells that slipped through.",
  },
  {
    icon: CopyCheck,
    title: "Check the score & copy",
    body: "See the human-ness score and what changed. Re-humanize if needed, then copy it out — done.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, about a minute"
            description="No accounts, no setup, no learning curve. Paste, rewrite, copy."
          />
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 110} className="relative text-center">
              <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-card">
                <step.icon className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary font-body text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl text-foreground">{step.title}</h3>
              <p className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
