import type { Metadata } from "next";
import { CreateUserForm } from "@/app/components/CreateUserForm";
import { DeleteUserButton } from "@/app/components/DeleteUserButton";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Xodimlar",
};

export default async function UsersPage() {
  const session = await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Xodimlar</h2>
        <p className="mt-1 text-sm text-loom-muted">
          Jamoa a&apos;zolarini boshqarish (faqat Admin)
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
          Yangi xodim qo&apos;shish
        </h3>
        <CreateUserForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-loom-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-loom-border bg-loom-linen/60">
                <th className="px-6 py-4 font-medium text-loom-muted">ID</th>
                <th className="px-6 py-4 font-medium text-loom-muted">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-4 font-medium text-loom-muted">Rol</th>
                <th className="px-6 py-4 font-medium text-loom-muted">
                  Qo&apos;shilgan
                </th>
                <th className="px-6 py-4 font-medium text-loom-muted">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-loom-border last:border-b-0"
                >
                  <td className="px-6 py-4 text-loom-muted">{user.id}</td>
                  <td className="px-6 py-4 font-medium">{user.username}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-loom-charcoal text-white"
                          : "bg-loom-linen text-loom-charcoal"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-loom-muted">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <DeleteUserButton
                      userId={user.id}
                      username={user.username}
                      disabled={user.id === session.userId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
