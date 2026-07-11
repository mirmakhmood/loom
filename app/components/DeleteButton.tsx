"use client";

import { useTransition } from "react";

type DeleteButtonProps = {
  id: number;
  label: string;
  confirmMessage: string;
  onDelete: (
    id: number,
  ) => Promise<{ error?: string; success?: string } | null | void>;
  disabled?: boolean;
};

export function DeleteButton({
  id,
  label,
  confirmMessage,
  onDelete,
  disabled = false,
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(confirmMessage)) {
      return;
    }

    startTransition(async () => {
      const result = await onDelete(id);
      if (result?.error) {
        window.alert(result.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={disabled || isPending}
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "..." : label}
    </button>
  );
}
