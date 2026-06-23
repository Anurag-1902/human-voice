import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/primitives";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-16 text-center shadow-float sm:px-12 sm:py-20">
            <div className="ambient-glow pointer-events-none absolute inset-x-0 top-0 h-full" />
            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Free to try
              </span>
              <h2 className="mt-6 font-display text-4xl font-normal leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                Give your draft a <em className="text-gradient-primary not-italic">human voice</em>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Paste your text and watch it turn from robotic to real — no account required.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild variant="hero" size="xl" className="w-full sm:w-auto">
                  <Link to="/app">
                    Open the workspace
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
