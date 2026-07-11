"use client";

import { useActionState } from "react";
import { createCompany, type ActionState } from "@/app/actions";

const initialState: ActionState = null;

export function CreateCompanyForm() {
  const [state, formAction, isPending] = useActionState(
    createCompany,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="company-name" className="mb-1.5 block text-sm font-medium">
            Nomi *
          </label>
          <input
            id="company-name"
            name="name"
            type="text"
            required
            minLength={2}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="company-phone" className="mb-1.5 block text-sm font-medium">
            Telefon
          </label>
          <input
            id="company-phone"
            name="phone"
            type="tel"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="company-email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="company-email"
            name="email"
            type="email"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="company-city" className="mb-1.5 block text-sm font-medium">
            Shahar
          </label>
          <input
            id="company-city"
            name="city"
            type="text"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="company-address" className="mb-1.5 block text-sm font-medium">
            Manzil
          </label>
          <input
            id="company-address"
            name="address"
            type="text"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="company-notes" className="mb-1.5 block text-sm font-medium">
            Izoh
          </label>
          <textarea
            id="company-notes"
            name="notes"
            rows={2}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-loom-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-loom-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Qo'shilmoqda..." : "Kompaniya qo'shish"}
      </button>
    </form>
  );
}
