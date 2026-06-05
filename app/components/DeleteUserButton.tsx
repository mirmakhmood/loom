"use client";

import { useTransition } from "react";
import { deleteUser } from "@/app/actions";

type DeleteUserButtonProps = {
  userId: number;
  username: string;
  disabled?: boolean;
};

export function DeleteUserButton({
  userId,
  username,
  disabled = false,
}: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `"${username}" foydalanuvchisini o'chirmoqchimisiz?`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteUser(userId);
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
      {isPending ? "..." : "O'chirish"}
    </button>
  );
}
