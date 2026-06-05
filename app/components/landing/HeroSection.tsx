import Image from "next/image";
import { HERO_IMAGES } from "@/lib/catalog";

export function HeroSection() {
  return (
    <section className="loom-gradient-hero border-b border-loom-border px-6 py-16 lg:min-h-[85vh] lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="loom-animate-fade-up mb-4 text-sm font-medium uppercase tracking-[0.2em] text-loom-gold">
            Ulgurji kiyim savdosi
          </p>
          <h1 className="loom-animate-fade-up loom-delay-100 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-loom-charcoal sm:text-5xl lg:text-6xl">
            Premium matolar va kiyimlar
          </h1>
          <p className="loom-animate-fade-up loom-delay-200 mt-2 font-display text-2xl font-medium text-loom-gold-dark sm:text-3xl">
            B2B hamkorlar uchun
          </p>
          <p className="loom-animate-fade-up loom-delay-300 mt-6 max-w-lg text-base leading-relaxed text-loom-muted lg:text-lg">
            Loom — O&apos;zbekiston va mintaqadagi ishlab chiqaruvchilar uchun
            ishonchli ulgurji ta&apos;minotchi. Sifatli mahsulotlar, barqaror
            yetkazib berish va shaxsiy menejer yordami.
          </p>
          <div className="loom-animate-fade-up loom-delay-400 mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-full bg-loom-charcoal px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-loom-espresso"
            >
              Ariza qoldirish
            </a>
            <a
              href="#products"
              className="rounded-full border border-loom-border bg-white/80 px-8 py-3.5 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-loom-gold hover:text-loom-gold-dark"
            >
              Katalogni ko&apos;rish
            </a>
          </div>
        </div>

        <div className="relative order-1 mx-auto h-[420px] w-full max-w-lg sm:h-[480px] lg:order-2 lg:h-[560px] lg:max-w-none">
          {HERO_IMAGES.map((img, index) => (
            <div
              key={img.src}
              className={`loom-animate-scale-in absolute overflow-hidden rounded-2xl border border-white/80 shadow-xl ${img.className} ${index === 0 ? "" : index === 1 ? "loom-delay-200" : index === 2 ? "loom-delay-400" : "loom-delay-500"}`}
              style={{ zIndex: index + 1 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                priority={index < 2}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
