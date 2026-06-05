"use client";

import { useActionState } from "react";
import { createLead, type ActionState } from "@/app/actions";
import { PRODUCT_OPTIONS } from "@/lib/constants";

const initialState: ActionState = null;

const inputClassName =
  "w-full rounded-xl border border-loom-border bg-loom-linen/50 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-loom-gold focus:bg-white focus:ring-2 focus:ring-loom-gold/20";

type LeadFormProps = {
  defaultProduct?: string;
  productNote?: string;
};

export function LeadForm({ defaultProduct, productNote }: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(createLead, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {productNote && (
        <div className="rounded-xl border border-loom-gold/30 bg-loom-gold/10 px-4 py-3 text-sm text-loom-charcoal">
          <span className="font-medium">Tanlangan mahsulot:</span> {productNote}
        </div>
      )}

      {productNote && (
        <input type="hidden" name="productNote" value={productNote} />
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-loom-charcoal"
        >
          Ismingiz
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          placeholder="To'liq ism"
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-loom-charcoal"
        >
          Telefon raqam
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          minLength={7}
          placeholder="+998 90 000 00 00"
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="product"
          className="mb-1.5 block text-sm font-medium text-loom-charcoal"
        >
          Mahsulot turi
        </label>
        <select
          id="product"
          name="product"
          required
          defaultValue={defaultProduct ?? ""}
          key={defaultProduct}
          className={inputClassName}
        >
          <option value="" disabled>
            Tanlang...
          </option>
          {PRODUCT_OPTIONS.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-loom-charcoal px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-loom-espresso disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Yuborilmoqda..." : "Ariza yuborish"}
      </button>
    </form>
  );
}
