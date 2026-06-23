import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/shared/ScoreGauge";

const TRUST = ["No sign-up to try", "Two-pass rewriting", "Built-in AI detector"];

export function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="ambient-glow pointer-events-none absolute inset-x-0 top-0 h-[520px]" />

      <div className="container relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div className="animate-fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-card">
            <Sparkles className="h-3.5 w-3.5" />
            AI &rarr; Human
          </span>

          <h1 className="mt-6 font-display text-5xl font-normal leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Make AI writing
            <br />
            sound <em className="text-gradient-primary not-italic">unmistakably human</em>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
            HumanVoice rewrites robotic, detectable AI text into natural prose with real rhythm,
            voice, and imperfection — while keeping every fact exactly as you wrote it.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild variant="hero" size="xl" className="w-full sm:w-auto animate-pulse-glow">
              <Link to="/app">
                Humanize your text
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: signature transformation card */}
        <div className="animate-scale-in [animation-delay:120ms]">
          <TransformationCard />
        </div>
      </div>
    </section>
  );
}

function TransformationCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* floating gauge */}
      <div className="absolute -right-4 -top-6 z-20 rounded-2xl border border-border bg-card p-3 shadow-float animate-float">
        <ScoreGauge value={94} aiScore={6} size={104} stroke={9} label="Human" />
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-float">
        {/* before */}
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-signal-bad" />
            AI draft
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Moreover, this comprehensive approach leverages cutting-edge methodologies to
            significantly enhance outcomes and foster a robust, multifaceted framework.
          </p>
        </div>

        <div className="my-3 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Humanized
          </span>
        </div>

        {/* after */}
        <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-signal-good" />
            Human voice
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            And here's the thing — a few smart tweaks do most of the work. The results get better,
            sure. But it doesn't read like a press release anymore. It reads like a person.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-signal-good" />
            Facts preserved
          </span>
          <span className="tabular-nums">42 words &middot; casual tone</span>
        </div>
      </div>
    </div>
  );
}
