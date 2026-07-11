"use client";

import { useActionState } from "react";
import { updateLead, type ActionState } from "@/app/actions";
import { LEAD_STATUSES } from "@/lib/constants";

type Option = { id: number; name: string };
type UserOption = { id: number; username: string };

type EditLeadFormProps = {
  lead: {
    id: number;
    name: string;
    phone: string;
    product: string;
    status: string;
    notes: string | null;
    companyId: number | null;
    contactId: number | null;
    assignedToId: number | null;
  };
  companies: Option[];
  contacts: Option[];
  users: UserOption[];
};

const initialState: ActionState = null;

export function EditLeadForm({
  lead,
  companies,
  contacts,
  users,
}: EditLeadFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateLead,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={lead.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className="mb-1.5 block text-sm font-medium">
            Ism
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            minLength={2}
            defaultValue={lead.name}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="lead-phone" className="mb-1.5 block text-sm font-medium">
            Telefon
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            minLength={7}
            defaultValue={lead.phone}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="lead-product" className="mb-1.5 block text-sm font-medium">
            Mahsulot
          </label>
          <input
            id="lead-product"
            name="product"
            type="text"
            required
            defaultValue={lead.product}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="lead-status" className="mb-1.5 block text-sm font-medium">
            Holat
          </label>
          <select
            id="lead-status"
            name="status"
            defaultValue={lead.status}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-assignee" className="mb-1.5 block text-sm font-medium">
            Mas&apos;ul menejer
          </label>
          <select
            id="lead-assignee"
            name="assignedToId"
            defaultValue={lead.assignedToId ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          >
            <option value="">— Tayinlanmagan —</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-company" className="mb-1.5 block text-sm font-medium">
            Kompaniya
          </label>
          <select
            id="lead-company"
            name="companyId"
            defaultValue={lead.companyId ?? ""}
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
        <div>
          <label htmlFor="lead-contact" className="mb-1.5 block text-sm font-medium">
            Kontakt
          </label>
          <select
            id="lead-contact"
            name="contactId"
            defaultValue={lead.contactId ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          >
            <option value="">— Tanlanmagan —</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-notes" className="mb-1.5 block text-sm font-medium">
            Umumiy izoh
          </label>
          <textarea
            id="lead-notes"
            name="notes"
            rows={3}
            defaultValue={lead.notes ?? ""}
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
