import { LeadForm } from "@/app/components/LeadForm";
import { ScrollReveal } from "@/app/components/ScrollReveal";

const benefits = [
  "Minimal buyurtma hajmi bo'yicha maslahat",
  "Namuna va katalog yuborish",
  "Shaxsiy narx taklifi",
  "Tezkor menejer javobi",
];

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-loom-border px-6 py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
        <ScrollReveal direction="left">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-loom-gold">
              Hamkorlik
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-loom-charcoal sm:text-4xl">
              Hamkorlik uchun murojaat
            </h2>
            <p className="mt-4 leading-relaxed text-loom-muted">
              Ulgurji buyurtma yoki hamkorlik bo&apos;yicha ma&apos;lumot olish uchun
              formani to&apos;ldiring. Menejerimiz tez orada siz bilan bog&apos;lanadi.
            </p>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-loom-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-loom-gold/15 text-loom-gold-dark">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={150}>
          <div className="rounded-3xl border border-loom-border bg-white p-8 shadow-lg shadow-loom-charcoal/5 transition-shadow duration-500 hover:shadow-xl lg:p-10">
            <h3 className="font-display text-xl font-semibold text-loom-charcoal">
              Ariza formasi
            </h3>
            <p className="mt-2 text-sm text-loom-muted">
              Ma&apos;lumotlaringizni qoldiring — biz sizga qo&apos;ng&apos;iroq qilamiz.
            </p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
