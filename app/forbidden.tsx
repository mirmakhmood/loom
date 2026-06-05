import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-loom-gold">
          403
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Ruxsat berilmagan
        </h1>
        <p className="mt-4 text-loom-muted">
          Ushbu sahifaga kirish uchun admin huquqlari talab qilinadi.
        </p>
        <Link
          href="/admin/leads"
          className="mt-8 inline-block rounded-lg bg-loom-charcoal px-6 py-3 text-sm font-medium text-white transition hover:bg-loom-gold-dark"
        >
          Arizalarga qaytish
        </Link>
      </div>
    </div>
  );
}
