"use client";

import { useActionState } from "react";
import { updateCompany, type ActionState } from "@/app/actions";

type EditCompanyFormProps = {
  company: {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    notes: string | null;
  };
};

const initialState: ActionState = null;

export function EditCompanyForm({ company }: EditCompanyFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCompany,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={company.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="edit-company-name" className="mb-1.5 block text-sm font-medium">
            Nomi
          </label>
          <input
            id="edit-company-name"
            name="name"
            type="text"
            required
            minLength={2}
            defaultValue={company.name}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="edit-company-phone" className="mb-1.5 block text-sm font-medium">
            Telefon
          </label>
          <input
            id="edit-company-phone"
            name="phone"
            type="tel"
            defaultValue={company.phone ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="edit-company-email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="edit-company-email"
            name="email"
            type="email"
            defaultValue={company.email ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="edit-company-city" className="mb-1.5 block text-sm font-medium">
            Shahar
          </label>
          <input
            id="edit-company-city"
            name="city"
            type="text"
            defaultValue={company.city ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="edit-company-address" className="mb-1.5 block text-sm font-medium">
            Manzil
          </label>
          <input
            id="edit-company-address"
            name="address"
            type="text"
            defaultValue={company.address ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="edit-company-notes" className="mb-1.5 block text-sm font-medium">
            Izoh
          </label>
          <textarea
            id="edit-company-notes"
            name="notes"
            rows={3}
            defaultValue={company.notes ?? ""}
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
        {isPending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
