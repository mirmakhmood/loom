import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LeadsSearchForm } from "@/app/components/LeadsSearchForm";
import { LeadsStatusFilter } from "@/app/components/LeadsStatusFilter";
import { LeadStatusSelect } from "@/app/components/LeadStatusSelect";
import { requireAuth } from "@/lib/auth";
import { isLeadStatus, LEAD_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Arizalar",
};

type LeadsPageProps = {
  searchParams: Promise<{
    error?: string;
    status?: string;
    q?: string;
    mine?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const session = await requireAuth();
  const params = await searchParams;

  const activeStatus =
    params.status && isLeadStatus(params.status) ? params.status : "Hammasi";
  const query = params.q?.trim() ?? "";
  const mineOnly = params.mine === "1";

  const where: Prisma.LeadWhereInput = {};

  if (activeStatus !== "Hammasi") {
    where.status = activeStatus;
  }

  if (mineOnly) {
    where.assignedToId = session.userId;
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { phone: { contains: query, mode: "insensitive" } },
      { product: { contains: query, mode: "insensitive" } },
    ];
  }

  const [leads, allLeads] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: { select: { username: true } },
        company: { select: { name: true } },
      },
    }),
    prisma.lead.findMany({
      where: mineOnly ? { assignedToId: session.userId } : undefined,
      select: { status: true },
    }),
  ]);

  const counts: Record<string, number> = { Hammasi: allLeads.length };
  for (const status of LEAD_STATUSES) {
    counts[status] = allLeads.filter((lead) => lead.status === status).length;
  }

  const mineHref = mineOnly
    ? activeStatus === "Hammasi"
      ? "/admin/leads"
      : `/admin/leads?status=${encodeURIComponent(activeStatus)}`
    : activeStatus === "Hammasi"
      ? "/admin/leads?mine=1"
      : `/admin/leads?status=${encodeURIComponent(activeStatus)}&mine=1`;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Arizalar</h2>
          <p className="mt-1 text-sm text-loom-muted">
            {mineOnly
              ? "Sizga biriktirilgan arizalar"
              : "Barcha ulgurji kiyim bo'yicha murojaatlar"}
          </p>
        </div>
        <Link
          href={mineHref}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            mineOnly
              ? "bg-loom-charcoal text-white"
              : "border border-loom-border bg-white text-loom-muted hover:border-loom-gold"
          }`}
        >
          Mening arizalarim
        </Link>
      </div>

      {params.error === "forbidden" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Ushbu sahifaga kirish uchun admin huquqlari talab qilinadi.
        </div>
      )}

      <div className="mb-6">
        <Suspense fallback={null}>
          <LeadsSearchForm />
        </Suspense>
      </div>

      <div className="mb-6">
        <LeadsStatusFilter
          activeStatus={activeStatus}
          counts={counts}
          mine={mineOnly}
          q={query}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-loom-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-loom-border bg-loom-linen/60">
                <th className="px-6 py-4 font-medium text-loom-muted">Ism</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Telefon</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Mahsulot</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Kompaniya</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Mas&apos;ul</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Holat</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Sana</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-loom-muted"
                  >
                    Arizalar topilmadi.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-loom-border last:border-b-0"
                  >
                    <td className="px-6 py-4 font-medium">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="hover:text-loom-gold-dark hover:underline"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-loom-muted">{lead.phone}</td>
                    <td className="px-6 py-4">{lead.product}</td>
                    <td className="px-6 py-4 text-loom-muted">
                      {lead.company?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {lead.assignedTo?.username ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <LeadStatusSelect
                        leadId={lead.id}
                        currentStatus={lead.status}
                      />
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {formatDateTime(lead.createdAt)}
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
