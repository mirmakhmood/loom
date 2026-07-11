import Link from "next/link";
import { logoutUser } from "@/app/actions";
import { AdminNav } from "@/app/components/AdminNav";
import { requireAuth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const isAdmin = session.role === "Admin";

  return (
    <div className="flex min-h-full flex-1">
      <aside className="flex w-64 shrink-0 flex-col border-r border-loom-border bg-white">
        <div className="border-b border-loom-border px-6 py-6">
          <Link href="/admin" className="text-xl font-semibold tracking-tight">
            Loom
          </Link>
          <p className="mt-1 text-xs text-loom-muted">CRM Dashboard</p>
        </div>

        <AdminNav isAdmin={isAdmin} />

        <div className="border-t border-loom-border px-4 py-6">
          <div className="mb-4 rounded-lg bg-loom-linen px-4 py-3">
            <p className="text-sm font-medium">{session.username}</p>
            <p className="text-xs text-loom-muted">{session.role}</p>
          </div>
          <form action={logoutUser}>
            <button
              type="submit"
              className="w-full rounded-lg border border-loom-border px-4 py-2.5 text-sm font-medium transition hover:border-loom-gold hover:text-loom-gold-dark"
            >
              Chiqish
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-loom-border bg-white px-8 py-5">
          <h1 className="text-lg font-semibold tracking-tight">
            Loom CRM Dashboard
          </h1>
        </header>
        <main className="flex-1 bg-loom-linen p-8">{children}</main>
      </div>
    </div>
  );
}
