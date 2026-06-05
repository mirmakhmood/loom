import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from "@/lib/catalog";

function getCategoryProductId(categoryName: string): string | undefined {
  return CATALOG_PRODUCTS.find((product) => product.category === categoryName)?.id;
}

export function CategoryBanners() {
  return (
    <section id="categories" className="border-t border-loom-border bg-loom-sand px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-loom-gold">
              Yo&apos;nalishlar
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-loom-charcoal sm:text-4xl">
              Kategoriyalar
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {CATALOG_CATEGORIES.map((category, index) => {
            const productId = getCategoryProductId(category.name);
            const href = productId ? `/products/${productId}` : "#contact";

            return (
              <ScrollReveal key={category.id} delay={index * 120}>
                <Link
                  href={href}
                  className="loom-card-hover group relative block h-64 overflow-hidden rounded-2xl sm:h-80"
                >
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-loom-espresso/90 via-loom-espresso/30 to-transparent transition-opacity duration-500 group-hover:from-loom-espresso/95" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="font-display text-3xl font-semibold text-white">
                      {category.name}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-white/80">
                      {category.description}
                    </p>
                    <span className="mt-4 inline-flex w-fit items-center text-sm font-medium text-loom-gold transition-all duration-300 group-hover:translate-x-2">
                      Ko&apos;rish &rarr;
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
