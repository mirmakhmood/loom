import type { Metadata } from "next";
import Link from "next/link";
import { deleteTask } from "@/app/actions";
import { CreateTaskForm } from "@/app/components/CreateTaskForm";
import { DeleteButton } from "@/app/components/DeleteButton";
import { TaskStatusToggle } from "@/app/components/TaskStatusToggle";
import { requireAuth } from "@/lib/auth";
import {
  isTaskStatus,
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Vazifalar",
};

type TasksPageProps = {
  searchParams: Promise<{ status?: string; mine?: string }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const session = await requireAuth();
  const params = await searchParams;

  const statusFilter =
    params.status && isTaskStatus(params.status) ? params.status : null;
  const mineOnly = params.mine === "1";

  const where: Prisma.TaskWhereInput = {};
  if (statusFilter) where.status = statusFilter;
  if (mineOnly) where.assignedToId = session.userId;

  const [tasks, users, leads, openCount, doneCount] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      include: {
        assignedTo: { select: { username: true } },
        lead: { select: { id: true, name: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { username: "asc" },
      select: { id: true, username: true },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, name: true },
    }),
    prisma.task.count({
      where: {
        status: "Open",
        ...(mineOnly ? { assignedToId: session.userId } : {}),
      },
    }),
    prisma.task.count({
      where: {
        status: "Done",
        ...(mineOnly ? { assignedToId: session.userId } : {}),
      },
    }),
  ]);

  const filters = [
    {
      label: "Hammasi",
      href: mineOnly ? "/admin/tasks?mine=1" : "/admin/tasks",
      active: !statusFilter,
      count: openCount + doneCount,
    },
    {
      label: "Ochiq",
      href: mineOnly ? "/admin/tasks?status=Open&mine=1" : "/admin/tasks?status=Open",
      active: statusFilter === "Open",
      count: openCount,
    },
    {
      label: "Bajarilgan",
      href: mineOnly ? "/admin/tasks?status=Done&mine=1" : "/admin/tasks?status=Done",
      active: statusFilter === "Done",
      count: doneCount,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Vazifalar</h2>
          <p className="mt-1 text-sm text-loom-muted">
            Qo&apos;ng&apos;iroqlar, eslatmalar va follow-up lar
          </p>
        </div>
        <Link
          href={mineOnly ? "/admin/tasks" : "/admin/tasks?mine=1"}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            mineOnly
              ? "bg-loom-charcoal text-white"
              : "border border-loom-border bg-white text-loom-muted hover:border-loom-gold"
          }`}
        >
          Mening vazifalarim
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
          Yangi vazifa
        </h3>
        <CreateTaskForm
          users={users}
          leads={leads}
          defaultAssigneeId={session.userId}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.label}
            href={filter.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter.active
                ? "bg-loom-charcoal text-white"
                : "border border-loom-border bg-white text-loom-muted hover:border-loom-gold"
            }`}
          >
            {filter.label}
            <span
              className={`ml-1.5 text-xs ${filter.active ? "text-white/70" : "text-loom-muted"}`}
            >
              ({filter.count})
            </span>
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-loom-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-loom-border bg-loom-linen/60">
                <th className="px-6 py-4 font-medium text-loom-muted">Vazifa</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Ariza</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Mas&apos;ul</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Muddat</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Holat</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-loom-muted"
                  >
                    Vazifalar topilmadi.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-loom-border last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <p
                        className={`font-medium ${task.status === "Done" ? "text-loom-muted line-through" : ""}`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-1 text-xs text-loom-muted">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {task.lead ? (
                        <Link
                          href={`/admin/leads/${task.lead.id}`}
                          className="hover:underline"
                        >
                          {task.lead.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {task.assignedTo.username}
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {task.dueDate ? formatDate(task.dueDate) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          task.status === "Done"
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {TASK_STATUS_LABELS[task.status as TaskStatus] ??
                          task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <TaskStatusToggle
                          taskId={task.id}
                          currentStatus={task.status}
                        />
                        <DeleteButton
                          id={task.id}
                          label="O'chirish"
                          confirmMessage={`"${task.title}" vazifasini o'chirmoqchimisiz?`}
                          onDelete={deleteTask}
                        />
                      </div>
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
