import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/shared/primitives";
import { ScoreGauge } from "@/components/shared/ScoreGauge";

const BENEFITS = [
  {
    title: "Pass as human, honestly",
    body: "Lower your detection score by fixing the patterns that flag AI — not by stuffing in gibberish.",
  },
  {
    title: "Keep your meaning intact",
    body: "Faithful summarization is the core mandate. The rewrite never adds opinions or invents claims.",
  },
  {
    title: "Sound like a person, not a template",
    body: "Varied sentence lengths, real contractions, the occasional fragment. Writing with a pulse.",
  },
  {
    title: "Save hours of manual editing",
    body: "Skip the line-by-line rewriting. Get a natural draft in seconds and polish from there.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Benefits"
            title={<>Writing that earns <em className="text-gradient-primary not-italic">trust</em></>}
            description="The goal isn't to trick anyone. It's to make solid ideas read the way a thoughtful person would actually write them."
          />

          <ul className="mt-8 space-y-5">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div>
                  <h3 className="font-body font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <Button asChild variant="hero" size="lg" className="mt-9">
            <Link to="/app">
              Try it free
              <ArrowRight />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="grain relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-float">
            <div className="ambient-glow pointer-events-none absolute inset-0" />
            <div className="relative flex flex-col items-center gap-6">
              <div className="flex items-end gap-8">
                <div className="text-center">
                  <ScoreGauge value={28} aiScore={72} size={108} stroke={9} label="Before" animate={false} />
                </div>
                <ArrowRight className="mb-10 h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <ScoreGauge value={94} aiScore={6} size={108} stroke={9} label="After" animate={false} />
                </div>
              </div>
              <p className="max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
                A typical rewrite moves text from a strong AI signal to a strongly human read — measured by
                the same detector that scores your output.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
