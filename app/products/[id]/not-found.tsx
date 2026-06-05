import Link from "next/link";
import { SiteFooter } from "@/app/components/landing/SiteFooter";
import { SiteNavbar } from "@/app/components/landing/SiteNavbar";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteNavbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-loom-gold">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold">
          Mahsulot topilmadi
        </h1>
        <p className="mt-4 text-loom-muted">
          Ushbu mahsulot mavjud emas yoki olib tashlangan.
        </p>
        <Link
          href="/#products"
          className="mt-8 rounded-full bg-loom-charcoal px-6 py-3 text-sm font-medium text-white transition hover:bg-loom-espresso"
        >
          Katalogga qaytish
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
