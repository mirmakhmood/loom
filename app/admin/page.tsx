import type { Metadata } from "next";
import Link from "next/link";
import { LEAD_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
};

type DashboardPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminDashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await requireAuth();
  const params = await searchParams;

  const [
    totalLeads,
    newLeads,
    openTasks,
    companiesCount,
    contactsCount,
    recentLeads,
    myLeads,
    myTasks,
    statusGroups,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "Yangi" } }),
    prisma.task.count({ where: { status: "Open" } }),
    prisma.company.count(),
    prisma.contact.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { assignedTo: { select: { username: true } } },
    }),
    prisma.lead.count({ where: { assignedToId: session.userId } }),
    prisma.task.findMany({
      where: { assignedToId: session.userId, status: "Open" },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { lead: { select: { id: true, name: true } } },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const statusCounts = Object.fromEntries(
    LEAD_STATUSES.map((status) => [
      status,
      statusGroups.find((g) => g.status === status)?._count.status ?? 0,
    ]),
  );

  const stats = [
    { label: "Jami arizalar", value: totalLeads, href: "/admin/leads" },
    { label: "Yangi arizalar", value: newLeads, href: "/admin/leads?status=Yangi" },
    { label: "Mening arizalarim", value: myLeads, href: "/admin/leads?mine=1" },
    { label: "Ochiq vazifalar", value: openTasks, href: "/admin/tasks?status=Open" },
    { label: "Kompaniyalar", value: companiesCount, href: "/admin/companies" },
    { label: "Kontaktlar", value: contactsCount, href: "/admin/contacts" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-loom-muted">
          Salom, {session.username}. Bugungi CRM holati.
        </p>
      </div>

      {params.error === "forbidden" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Ushbu sahifaga kirish uchun admin huquqlari talab qilinadi.
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-loom-border bg-white p-5 shadow-sm transition hover:border-loom-gold"
          >
            <p className="text-sm text-loom-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-loom-muted">
            Pipeline holati
          </h3>
          <Link
            href="/admin/pipeline"
            className="text-sm font-medium text-loom-gold-dark hover:underline"
          >
            Pipeline ochish
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LEAD_STATUSES.map((status) => (
            <Link
              key={status}
              href={`/admin/leads?status=${encodeURIComponent(status)}`}
              className="rounded-xl bg-loom-linen px-4 py-3 transition hover:bg-loom-sand"
            >
              <p className="text-xs text-loom-muted">{status}</p>
              <p className="mt-1 text-xl font-semibold">
                {statusCounts[status]}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-loom-muted">
              So&apos;nggi arizalar
            </h3>
            <Link
              href="/admin/leads"
              className="text-sm font-medium text-loom-gold-dark hover:underline"
            >
              Barchasi
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-loom-muted">Hozircha arizalar yo&apos;q.</p>
          ) : (
            <ul className="divide-y divide-loom-border">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-start justify-between gap-3 hover:text-loom-gold-dark"
                  >
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-loom-muted">
                        {lead.product} · {lead.status}
                        {lead.assignedTo
                          ? ` · ${lead.assignedTo.username}`
                          : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-loom-muted">
                      {formatDateTime(lead.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-loom-muted">
              Mening vazifalarim
            </h3>
            <Link
              href="/admin/tasks?mine=1"
              className="text-sm font-medium text-loom-gold-dark hover:underline"
            >
              Barchasi
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <p className="text-sm text-loom-muted">Ochiq vazifalar yo&apos;q.</p>
          ) : (
            <ul className="divide-y divide-loom-border">
              {myTasks.map((task) => (
                <li key={task.id} className="py-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-loom-muted">
                    {task.lead
                      ? `Ariza: ${task.lead.name}`
                      : "Arizaga bog'lanmagan"}
                    {task.dueDate
                      ? ` · Muddat: ${formatDateTime(task.dueDate)}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
