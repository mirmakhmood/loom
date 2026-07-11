"use client";

import { useActionState } from "react";
import { createTask, type ActionState } from "@/app/actions";

type UserOption = {
  id: number;
  username: string;
};

type LeadOption = {
  id: number;
  name: string;
};

type CreateTaskFormProps = {
  users: UserOption[];
  leads: LeadOption[];
  defaultLeadId?: number;
  defaultAssigneeId?: number;
};

const initialState: ActionState = null;

export function CreateTaskForm({
  users,
  leads,
  defaultLeadId,
  defaultAssigneeId,
}: CreateTaskFormProps) {
  const [state, formAction, isPending] = useActionState(
    createTask,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="task-title" className="mb-1.5 block text-sm font-medium">
            Vazifa *
          </label>
          <input
            id="task-title"
            name="title"
            type="text"
            required
            minLength={2}
            placeholder="Masalan: Mijozga qo'ng'iroq qilish"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="task-due" className="mb-1.5 block text-sm font-medium">
            Muddat
          </label>
          <input
            id="task-due"
            name="dueDate"
            type="date"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>
        <div>
          <label htmlFor="task-assignee" className="mb-1.5 block text-sm font-medium">
            Mas&apos;ul
          </label>
          <select
            id="task-assignee"
            name="assignedToId"
            defaultValue={defaultAssigneeId ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="task-lead" className="mb-1.5 block text-sm font-medium">
            Ariza
          </label>
          <select
            id="task-lead"
            name="leadId"
            defaultValue={defaultLeadId ?? ""}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          >
            <option value="">— Bog&apos;lanmagan —</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                #{lead.id} — {lead.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="task-desc" className="mb-1.5 block text-sm font-medium">
            Tavsif
          </label>
          <textarea
            id="task-desc"
            name="description"
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
        {isPending ? "Yaratilmoqda..." : "Vazifa yaratish"}
      </button>
    </form>
  );
}
