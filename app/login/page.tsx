import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/components/LoginForm";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Loom CRM — Kirish",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin/leads");
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-semibold tracking-tight text-loom-charcoal"
          >
            Loom CRM
          </Link>
          <p className="mt-2 text-sm text-loom-muted">
            Boshqaruv paneliga kirish
          </p>
        </div>

        <div className="rounded-2xl border border-loom-border bg-white p-8 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-loom-muted">
          <Link href="/" className="transition hover:text-loom-charcoal">
            &larr; Bosh sahifaga qaytish
          </Link>
        </p>
      </div>
    </div>
  );
}
