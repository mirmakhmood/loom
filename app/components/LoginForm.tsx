"use client";

import { useActionState } from "react";
import { loginUser, type ActionState } from "@/app/actions";

const initialState: ActionState = null;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="username"
          className="mb-1.5 block text-sm font-medium text-loom-charcoal"
        >
          Foydalanuvchi nomi
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-loom-border bg-white px-4 py-3 text-sm outline-none transition focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-loom-charcoal"
        >
          Parol
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-loom-border bg-white px-4 py-3 text-sm outline-none transition focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-loom-charcoal px-6 py-3.5 text-sm font-medium text-white transition hover:bg-loom-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Kirish..." : "Kirish"}
      </button>
    </form>
  );
}
