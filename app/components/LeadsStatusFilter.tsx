import Link from "next/link";
import { LEAD_STATUSES } from "@/lib/constants";

const FILTERS = ["Hammasi", ...LEAD_STATUSES] as const;

type LeadsStatusFilterProps = {
  activeStatus: string;
  counts: Record<string, number>;
};

export function LeadsStatusFilter({
  activeStatus,
  counts,
}: LeadsStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((status) => {
        const isActive = activeStatus === status;
        const href =
          status === "Hammasi"
            ? "/admin/leads"
            : `/admin/leads?status=${encodeURIComponent(status)}`;
        const count = counts[status] ?? 0;

        return (
          <Link
            key={status}
            href={href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-loom-charcoal text-white"
                : "border border-loom-border bg-white text-loom-muted hover:border-loom-gold hover:text-loom-charcoal"
            }`}
          >
            {status}
            <span
              className={`ml-1.5 text-xs ${isActive ? "text-white/70" : "text-loom-muted"}`}
            >
              ({count})
            </span>
          </Link>
        );
      })}
    </div>
  );
}
