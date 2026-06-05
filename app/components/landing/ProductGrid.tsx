"use client";

import { useState } from "react";
import { ProductCard } from "@/app/components/landing/ProductCard";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import {
  CATALOG_PRODUCTS,
  PRODUCT_FILTERS,
  type ProductFilter,
} from "@/lib/catalog";

export function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("Hammasi");

  const filteredProducts =
    activeFilter === "Hammasi"
      ? CATALOG_PRODUCTS
      : CATALOG_PRODUCTS.filter((product) => product.category === activeFilter);

  return (
    <section id="products" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-loom-gold">
              Katalog
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-loom-charcoal sm:text-4xl">
              Mahsulotlarimiz
            </h2>
            <p className="mt-4 text-loom-muted">
              Har bir yo&apos;nalish bo&apos;yicha ulgurji narxlar va moslashtirilgan
              yetkazib berish.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-10 flex flex-wrap gap-2">
            {PRODUCT_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "scale-105 bg-loom-charcoal text-white shadow-md"
                    : "border border-loom-border bg-white text-loom-muted hover:scale-105 hover:border-loom-gold hover:text-loom-charcoal"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 80}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="mt-12 text-center text-loom-muted">
            Ushbu kategoriyada mahsulot topilmadi.
          </p>
        )}
      </div>
    </section>
  );
}
