import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/app/components/LeadForm";
import { ProductCard } from "@/app/components/landing/ProductCard";
import { SiteFooter } from "@/app/components/landing/SiteFooter";
import { SiteNavbar } from "@/app/components/landing/SiteNavbar";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import {
  CATALOG_PRODUCTS,
  getProductById,
  getRelatedProducts,
} from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return CATALOG_PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Mahsulot topilmadi" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <div className="loom-page-enter flex min-h-full flex-1 flex-col">
      <SiteNavbar />

      <main className="flex-1">
        <div className="border-b border-loom-border bg-loom-sand/50 px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-loom-muted">
            <Link href="/" className="transition-colors hover:text-loom-charcoal">
              Bosh sahifa
            </Link>
            <span>/</span>
            <Link
              href="/#products"
              className="transition-colors hover:text-loom-charcoal"
            >
              Mahsulotlar
            </Link>
            <span>/</span>
            <span className="text-loom-charcoal">{product.name}</span>
          </div>
        </div>

        <section className="px-6 py-12 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
            <ScrollReveal direction="left">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-loom-sand shadow-xl">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
                {product.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-loom-charcoal backdrop-blur-sm">
                    {product.tag}
                  </span>
                )}
              </div>
            </ScrollReveal>

            <div className="flex flex-col">
              <ScrollReveal direction="right">
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-loom-gold">
                  {product.category}
                </span>
                <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-loom-charcoal sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-loom-muted">
                  {product.longDescription}
                </p>

                <ul className="mt-8 flex flex-wrap gap-2">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-full border border-loom-border bg-white px-4 py-1.5 text-sm text-loom-charcoal"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                <span className="mt-8 inline-flex w-fit rounded-full bg-loom-gold/15 px-4 py-2 text-sm font-medium text-loom-gold-dark">
                  Ulgurji narx — menejer bilan bog&apos;laning
                </span>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={200} className="mt-10">
                <div
                  id="inquiry"
                  className="rounded-3xl border border-loom-border bg-white p-8 shadow-lg shadow-loom-charcoal/5"
                >
                  <h2 className="font-display text-2xl font-semibold text-loom-charcoal">
                    Murojaat qoldirish
                  </h2>
                  <p className="mt-2 text-sm text-loom-muted">
                    Ushbu mahsulot bo&apos;yicha ulgurji narx va yetkazib berish
                    shartlarini bilish uchun formani to&apos;ldiring.
                  </p>
                  <div className="mt-6">
                    <LeadForm
                      defaultProduct={product.category}
                      productNote={product.name}
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="border-t border-loom-border bg-loom-linen px-6 py-16 lg:py-20">
            <div className="mx-auto max-w-7xl">
              <ScrollReveal>
                <h2 className="font-display text-2xl font-semibold text-loom-charcoal sm:text-3xl">
                  O&apos;xshash mahsulotlar
                </h2>
                <p className="mt-2 text-loom-muted">
                  {product.category} kategoriyasidagi boshqa mahsulotlar
                </p>
              </ScrollReveal>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((related, index) => (
                  <ScrollReveal key={related.id} delay={index * 100}>
                    <ProductCard product={related} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
