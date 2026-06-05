import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <article className="loom-card-hover group overflow-hidden rounded-2xl border border-loom-border bg-loom-card">
        <div className="relative aspect-[4/5] overflow-hidden bg-loom-sand">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-loom-espresso/70 via-loom-espresso/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.tag && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-loom-charcoal backdrop-blur-sm">
                {product.tag}
              </span>
            )}
            <span className="rounded-full bg-loom-gold/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Ulgurji narx
            </span>
          </div>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-loom-charcoal opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Batafsil ko&apos;rish
          </span>
        </div>
        <div className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-loom-gold">
            {product.category}
          </span>
          <h3 className="mt-1 font-display text-xl font-semibold text-loom-charcoal transition-colors duration-300 group-hover:text-loom-gold-dark">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-loom-muted">
            {product.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
