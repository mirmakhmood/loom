import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteLead } from "@/app/actions";
import { AddLeadNoteForm } from "@/app/components/AddLeadNoteForm";
import { CreateTaskForm } from "@/app/components/CreateTaskForm";
import { DeleteButton } from "@/app/components/DeleteButton";
import { EditLeadForm } from "@/app/components/EditLeadForm";
import { TaskStatusToggle } from "@/app/components/TaskStatusToggle";
import { TASK_STATUS_LABELS, type TaskStatus } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: LeadDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) {
    return { title: "Ariza" };
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { name: true },
  });

  return { title: lead ? `${lead.name} — Ariza` : "Ariza" };
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  await requireAuth();
  const { id } = await params;
  const leadId = Number(id);

  if (!Number.isInteger(leadId) || leadId <= 0) {
    notFound();
  }

  const [lead, companies, contacts, users] = await Promise.all([
    prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        company: true,
        contact: true,
        assignedTo: { select: { id: true, username: true } },
        leadNotes: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { username: true } } },
        },
        tasks: {
          orderBy: { createdAt: "desc" },
          include: { assignedTo: { select: { username: true } } },
        },
      },
    }),
    prisma.company.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.contact.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.user.findMany({
      orderBy: { username: "asc" },
      select: { id: true, username: true },
    }),
  ]);

  if (!lead) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/leads"
            className="text-sm text-loom-muted hover:text-loom-gold-dark"
          >
            ← Arizalar
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {lead.name}
          </h2>
          <p className="mt-1 text-sm text-loom-muted">
            #{lead.id} · {formatDateTime(lead.createdAt)}
          </p>
        </div>
        <DeleteButton
          id={lead.id}
          label="O'chirish"
          confirmMessage={`"${lead.name}" arizasini o'chirmoqchimisiz?`}
          onDelete={deleteLead}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
              Ariza ma&apos;lumotlari
            </h3>
            <EditLeadForm
              lead={lead}
              companies={companies}
              contacts={contacts}
              users={users}
            />
          </div>

          <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
              Faoliyat izohlari
            </h3>
            <AddLeadNoteForm leadId={lead.id} />
            <ul className="mt-6 divide-y divide-loom-border">
              {lead.leadNotes.length === 0 ? (
                <li className="py-4 text-sm text-loom-muted">
                  Hozircha izohlar yo&apos;q.
                </li>
              ) : (
                lead.leadNotes.map((note) => (
                  <li key={note.id} className="py-4">
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    <p className="mt-2 text-xs text-loom-muted">
                      {note.author.username} · {formatDateTime(note.createdAt)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
              Bog&apos;lanishlar
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-loom-muted">Telefon</dt>
                <dd className="font-medium">
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-loom-muted">Kompaniya</dt>
                <dd className="font-medium">
                  {lead.company ? (
                    <Link
                      href={`/admin/companies/${lead.company.id}`}
                      className="hover:text-loom-gold-dark hover:underline"
                    >
                      {lead.company.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-loom-muted">Kontakt</dt>
                <dd className="font-medium">
                  {lead.contact ? (
                    <Link
                      href={`/admin/contacts/${lead.contact.id}`}
                      className="hover:text-loom-gold-dark hover:underline"
                    >
                      {lead.contact.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-loom-muted">Mas&apos;ul</dt>
                <dd className="font-medium">
                  {lead.assignedTo?.username ?? "Tayinlanmagan"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
              Vazifalar
            </h3>
            <CreateTaskForm
              users={users}
              leads={[{ id: lead.id, name: lead.name }]}
              defaultLeadId={lead.id}
              defaultAssigneeId={lead.assignedToId ?? undefined}
            />
            <ul className="mt-6 divide-y divide-loom-border">
              {lead.tasks.length === 0 ? (
                <li className="py-4 text-sm text-loom-muted">
                  Vazifalar yo&apos;q.
                </li>
              ) : (
                lead.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start justify-between gap-3 py-4"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-loom-muted">
                        {TASK_STATUS_LABELS[task.status as TaskStatus] ??
                          task.status}{" "}
                        · {task.assignedTo.username}
                        {task.dueDate
                          ? ` · ${formatDate(task.dueDate)}`
                          : ""}
                      </p>
                    </div>
                    <TaskStatusToggle
                      taskId={task.id}
                      currentStatus={task.status}
                    />
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
