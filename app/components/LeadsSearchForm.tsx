"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function LeadsSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const defaultQuery = searchParams.get("q") ?? "";
  const status = searchParams.get("status");
  const mine = searchParams.get("mine");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = String(formData.get("q") ?? "").trim();

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (mine) params.set("mine", mine);

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/admin/leads?${query}` : "/admin/leads");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        name="q"
        type="search"
        defaultValue={defaultQuery}
        placeholder="Ism, telefon yoki mahsulot..."
        className="min-w-[220px] flex-1 rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-loom-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-loom-gold-dark disabled:opacity-60"
      >
        {isPending ? "..." : "Qidirish"}
      </button>
    </form>
  );
}
