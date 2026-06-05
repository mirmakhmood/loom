"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/app/actions";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/constants";

type LeadStatusSelectProps = {
  leadId: number;
  currentStatus: string;
};

export function LeadStatusSelect({
  leadId,
  currentStatus,
}: LeadStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const status = event.target.value as LeadStatus;

    startTransition(async () => {
      await updateLeadStatus(leadId, status);
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="w-full min-w-[160px] rounded-lg border border-loom-border bg-white px-3 py-2 text-sm outline-none transition focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20 disabled:cursor-wait disabled:opacity-60"
    >
      {LEAD_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
