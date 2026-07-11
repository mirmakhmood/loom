"use client";

import { useActionState } from "react";
import { addLeadNote, type ActionState } from "@/app/actions";

type AddLeadNoteFormProps = {
  leadId: number;
};

const initialState: ActionState = null;

export function AddLeadNoteForm({ leadId }: AddLeadNoteFormProps) {
  const [state, formAction, isPending] = useActionState(
    addLeadNote,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="leadId" value={leadId} />
      <textarea
        name="content"
        required
        minLength={2}
        rows={3}
        placeholder="Qo'ng'iroq natijasi, kelishuv, eslatma..."
        className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
      />
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
        {isPending ? "Saqlanmoqda..." : "Izoh qo'shish"}
      </button>
    </form>
  );
}
