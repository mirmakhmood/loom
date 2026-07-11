import type { Metadata } from "next";
import Link from "next/link";
import { LeadStatusSelect } from "@/app/components/LeadStatusSelect";
import { LEAD_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Pipeline",
};

export default async function PipelinePage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: { select: { username: true } },
      company: { select: { name: true } },
    },
  });

  const columns = LEAD_STATUSES.map((status) => ({
    status,
    leads: leads.filter((lead) => lead.status === status),
  }));

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Pipeline</h2>
        <p className="mt-1 text-sm text-loom-muted">
          Arizalarni holat bo&apos;yicha kuzatish
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.status}
            className="w-72 shrink-0 rounded-2xl border border-loom-border bg-white shadow-sm"
          >
            <div className="border-b border-loom-border px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{column.status}</h3>
                <span className="rounded-full bg-loom-linen px-2.5 py-0.5 text-xs text-loom-muted">
                  {column.leads.length}
                </span>
              </div>
            </div>
            <div className="max-h-[70vh] space-y-3 overflow-y-auto p-3">
              {column.leads.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-loom-muted">
                  Bo&apos;sh
                </p>
              ) : (
                column.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-xl border border-loom-border bg-loom-linen/50 p-3"
                  >
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium hover:text-loom-gold-dark hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <p className="mt-1 text-xs text-loom-muted">{lead.product}</p>
                    {lead.company && (
                      <p className="mt-1 text-xs text-loom-muted">
                        {lead.company.name}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-loom-muted">
                      {lead.assignedTo?.username ?? "Tayinlanmagan"} ·{" "}
                      {formatDateTime(lead.createdAt)}
                    </p>
                    <div className="mt-3">
                      <LeadStatusSelect
                        leadId={lead.id}
                        currentStatus={lead.status}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
