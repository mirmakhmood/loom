import { ScrollReveal } from "@/app/components/ScrollReveal";
import { STATS } from "@/lib/catalog";

export function StatsBar() {
  return (
    <section className="border-b border-loom-border bg-loom-espresso px-6 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((stat, index) => (
          <ScrollReveal key={stat.label} delay={index * 100} direction="up">
            <div className="text-center">
              <p className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-loom-sand/80">{stat.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
