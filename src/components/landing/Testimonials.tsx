import { Star, Quote } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/shared/primitives";

const TESTIMONIALS = [
  {
    quote:
      "I write a weekly newsletter and lean on AI for first drafts. HumanVoice is the step that makes them actually sound like me before they go out.",
    name: "Priya R.",
    role: "Newsletter writer",
  },
  {
    quote:
      "The score is the part I didn't know I needed. Seeing which patterns got flagged taught me to write cleaner the first time.",
    name: "Marcus T.",
    role: "Content lead",
  },
  {
    quote:
      "Academic tone keeps the hedging and citations but drops the robotic rhythm. My drafts read like a person wrote them now.",
    name: "Elena V.",
    role: "PhD candidate",
  },
  {
    quote:
      "Condense mode is quietly brilliant. It trims the fluff without flattening the argument. Saves me a real editing pass.",
    name: "Dawit K.",
    role: "Product marketer",
  },
  {
    quote:
      "Re-humanize when the score is still high is a lifesaver. Two clicks and the stiff bits are gone.",
    name: "Sofia L.",
    role: "Freelance copywriter",
  },
];

function Card({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="w-[340px] shrink-0 rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="flex gap-0.5 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-foreground">{t.quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary">
          {t.name.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-foreground">{t.name}</span>
          <span className="block text-xs text-muted-foreground">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section id="reviews" className="scroll-mt-20 overflow-hidden border-y border-border bg-card/40 py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Reviews"
            title="Writers actually like the results"
            description="Editors, students, and marketers using HumanVoice to ship writing with a human pulse."
          />
        </Reveal>

        {/* Featured */}
        <Reveal delay={100} className="mx-auto mt-12 max-w-3xl">
          <div className="relative rounded-3xl border border-border bg-card p-8 text-center shadow-float sm:p-10">
            <Quote className="mx-auto h-8 w-8 text-primary/30" />
            <p className="mt-4 font-display text-2xl leading-snug text-foreground sm:text-3xl">
              "It's the difference between text that's <em className="text-gradient-primary not-italic">technically fine</em> and
              text someone actually wants to read."
            </p>
            <p className="mt-6 text-sm font-medium text-muted-foreground">— Jordan M., Managing editor</p>
          </div>
        </Reveal>
      </div>

      {/* Marquee row */}
      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-card/40 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-card/40 to-transparent" />
        <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
