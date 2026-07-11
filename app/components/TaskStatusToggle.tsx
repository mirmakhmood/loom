"use client";

import { useTransition } from "react";
import { updateTaskStatus } from "@/app/actions";
import type { TaskStatus } from "@/lib/constants";

type TaskStatusToggleProps = {
  taskId: number;
  currentStatus: string;
};

export function TaskStatusToggle({
  taskId,
  currentStatus,
}: TaskStatusToggleProps) {
  const [isPending, startTransition] = useTransition();
  const isDone = currentStatus === "Done";

  function handleToggle() {
    const next: TaskStatus = isDone ? "Open" : "Done";
    startTransition(async () => {
      await updateTaskStatus(taskId, next);
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-wait disabled:opacity-60 ${
        isDone
          ? "border border-loom-border bg-white text-loom-muted hover:border-loom-gold"
          : "bg-emerald-700 text-white hover:bg-emerald-800"
      }`}
    >
      {isPending ? "..." : isDone ? "Qayta ochish" : "Bajarildi"}
    </button>
  );
}
