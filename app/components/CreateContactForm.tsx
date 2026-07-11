"use client";

import { useActionState } from "react";
import { createContact, type ActionState } from "@/app/actions";

type CompanyOption = {
  id: number;
  name: string;
};

type CreateContactFormProps = {
  companies: CompanyOption[];
  defaultCompanyId?: number;
};

const initialState: ActionState = null;

export function CreateContactForm({
  companies,
  defaultCompanyId,
}: CreateContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    createContact,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
            Ism *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium">
            Telefon *
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            minLength={7}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="contact-position" className="mb-1.5 block text-sm font-medium">
            Lavozim
          </label>
          <input
            id="contact-position"
            name="position"
            type="text"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="contact-company" className="mb-1.5 block text-sm font-medium">
            Kompaniya
          </label>
          <select
            id="contact-company"
            name="companyId"
            defaultValue={defaultCompanyId ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          >
            <option value="">— Tanlanmagan —</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="contact-notes" className="mb-1.5 block text-sm font-medium">
            Izoh
          </label>
          <textarea
            id="contact-notes"
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
        {isPending ? "Qo'shilmoqda..." : "Kontakt qo'shish"}
      </button>
    </form>
  );
}
