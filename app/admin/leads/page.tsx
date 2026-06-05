import type { Metadata } from "next";
import { LeadsStatusFilter } from "@/app/components/LeadsStatusFilter";
import { LeadStatusSelect } from "@/app/components/LeadStatusSelect";
import { isLeadStatus, LEAD_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Arizalar",
};

type LeadsPageProps = {
  searchParams: Promise<{ error?: string; status?: string }>;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;

  const activeStatus =
    params.status && isLeadStatus(params.status) ? params.status : "Hammasi";

  const [leads, allLeads] = await Promise.all([
    prisma.lead.findMany({
      where:
        activeStatus === "Hammasi" ? undefined : { status: activeStatus },
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.findMany({
      select: { status: true },
    }),
  ]);

  const counts: Record<string, number> = { Hammasi: allLeads.length };
  for (const status of LEAD_STATUSES) {
    counts[status] = allLeads.filter((lead) => lead.status === status).length;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Arizalar</h2>
        <p className="mt-1 text-sm text-loom-muted">
          {activeStatus === "Hammasi"
            ? "Barcha ulgurji kiyim bo'yicha murojaatlar"
            : `"${activeStatus}" holatidagi arizalar`}
        </p>
      </div>

      {params.error === "forbidden" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Ushbu sahifaga kirish uchun admin huquqlari talab qilinadi.
        </div>
      )}

      <div className="mb-6">
        <LeadsStatusFilter activeStatus={activeStatus} counts={counts} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-loom-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-loom-border bg-loom-linen/60">
                <th className="px-6 py-4 font-medium text-loom-muted">Ism</th>
                <th className="px-6 py-4 font-medium text-loom-muted">
                  Telefon
                </th>
                <th className="px-6 py-4 font-medium text-loom-muted">
                  Mahsulot
                </th>
                <th className="px-6 py-4 font-medium text-loom-muted">
                  Holat
                </th>
                <th className="px-6 py-4 font-medium text-loom-muted">
                  Sana
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-loom-muted"
                  >
                    {activeStatus === "Hammasi"
                      ? "Hozircha arizalar yo'q."
                      : `"${activeStatus}" holatida arizalar yo'q.`}
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-loom-border last:border-b-0"
                  >
                    <td className="px-6 py-4 font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-loom-muted">{lead.phone}</td>
                    <td className="px-6 py-4">{lead.product}</td>
                    <td className="px-6 py-4">
                      <LeadStatusSelect
                        leadId={lead.id}
                        currentStatus={lead.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
