import Link from "next/link";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-loom-border/60 bg-loom-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-loom-charcoal"
        >
          Loom
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          <a
            href="#products"
            className="text-sm text-loom-muted transition hover:text-loom-charcoal"
          >
            Mahsulotlar
          </a>
          <a
            href="#categories"
            className="text-sm text-loom-muted transition hover:text-loom-charcoal"
          >
            Kategoriyalar
          </a>
          <a
            href="#contact"
            className="text-sm text-loom-muted transition hover:text-loom-charcoal"
          >
            Bog&apos;lanish
          </a>
        </nav>
        <Link
          href="/login"
          className="rounded-full bg-loom-charcoal px-5 py-2 text-sm font-medium text-white transition hover:bg-loom-espresso"
        >
          CRM kirish
        </Link>
      </div>
    </header>
  );
}
