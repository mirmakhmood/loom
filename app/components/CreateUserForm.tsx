"use client";

import { useActionState } from "react";
import { createUser, type ActionState } from "@/app/actions";
import { ROLES } from "@/lib/constants";

const initialState: ActionState = null;

export function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-sm font-medium"
          >
            Foydalanuvchi nomi
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            minLength={3}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium"
          >
            Parol
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
        </div>

        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium">
            Rol
          </label>
          <select
            id="role"
            name="role"
            required
            defaultValue="Menejer"
            className="w-full rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
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
        {isPending ? "Qo'shilmoqda..." : "Xodim qo'shish"}
      </button>
    </form>
  );
}
