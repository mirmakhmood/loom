"use client";

import { useActionState } from "react";
import { updateContact, type ActionState } from "@/app/actions";

type CompanyOption = { id: number; name: string };

type EditContactFormProps = {
  contact: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    position: string | null;
    notes: string | null;
    companyId: number | null;
  };
  companies: CompanyOption[];
};

const initialState: ActionState = null;

export function EditContactForm({ contact, companies }: EditContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateContact,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={contact.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="edit-contact-name" className="mb-1.5 block text-sm font-medium">
            Ism
          </label>
          <input
            id="edit-contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            defaultValue={contact.name}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="edit-contact-phone" className="mb-1.5 block text-sm font-medium">
            Telefon
          </label>
          <input
            id="edit-contact-phone"
            name="phone"
            type="tel"
            required
            minLength={7}
            defaultValue={contact.phone}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="edit-contact-email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="edit-contact-email"
            name="email"
            type="email"
            defaultValue={contact.email ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="edit-contact-position" className="mb-1.5 block text-sm font-medium">
            Lavozim
          </label>
          <input
            id="edit-contact-position"
            name="position"
            type="text"
            defaultValue={contact.position ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="edit-contact-company" className="mb-1.5 block text-sm font-medium">
            Kompaniya
          </label>
          <select
            id="edit-contact-company"
            name="companyId"
            defaultValue={contact.companyId ?? ""}
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
        <div className="sm:col-span-2">
          <label htmlFor="edit-contact-notes" className="mb-1.5 block text-sm font-medium">
            Izoh
          </label>
          <textarea
            id="edit-contact-notes"
            name="notes"
            rows={3}
            defaultValue={contact.notes ?? ""}
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
