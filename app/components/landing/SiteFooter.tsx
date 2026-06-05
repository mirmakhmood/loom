import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-loom-border bg-loom-espresso px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-xl font-semibold text-white">Loom</p>
          <p className="mt-1 text-sm text-loom-sand/70">
            Premium ulgurji kiyim va mato ta&apos;minotchi
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#products"
            className="text-sm text-loom-sand/70 transition hover:text-white"
          >
            Mahsulotlar
          </a>
          <a
            href="#contact"
            className="text-sm text-loom-sand/70 transition hover:text-white"
          >
            Bog&apos;lanish
          </a>
          <Link
            href="/login"
            className="text-sm text-loom-sand/70 transition hover:text-white"
          >
            Loom CRM
          </Link>
        </div>
        <p className="text-sm text-loom-sand/50">
          &copy; {new Date().getFullYear()} Loom
        </p>
      </div>
    </footer>
  );
}
