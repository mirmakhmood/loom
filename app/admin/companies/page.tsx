import type { Metadata } from "next";
import Link from "next/link";
import { deleteCompany } from "@/app/actions";
import { CreateCompanyForm } from "@/app/components/CreateCompanyForm";
import { DeleteButton } from "@/app/components/DeleteButton";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Kompaniyalar",
};

type CompaniesPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const companies = await prisma.company.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { contacts: true, leads: true } },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Kompaniyalar</h2>
        <p className="mt-1 text-sm text-loom-muted">
          Ulgurji mijozlar va hamkor tashkilotlar
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
          Yangi kompaniya
        </h3>
        <CreateCompanyForm />
      </div>

      <form className="mb-6">
        <div className="flex flex-wrap gap-2">
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Kompaniya, shahar yoki telefon..."
            className="min-w-[220px] flex-1 rounded-lg border border-loom-border bg-white px-4 py-2.5 text-sm outline-none focus:border-loom-gold focus:ring-2 focus:ring-loom-gold/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-loom-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-loom-gold-dark"
          >
            Qidirish
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-loom-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-loom-border bg-loom-linen/60">
                <th className="px-6 py-4 font-medium text-loom-muted">Nomi</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Telefon</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Shahar</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Kontaktlar</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Arizalar</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Sana</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-loom-muted"
                  >
                    Kompaniyalar topilmadi.
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-loom-border last:border-b-0"
                  >
                    <td className="px-6 py-4 font-medium">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="hover:text-loom-gold-dark hover:underline"
                      >
                        {company.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {company.phone ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {company.city ?? "—"}
                    </td>
                    <td className="px-6 py-4">{company._count.contacts}</td>
                    <td className="px-6 py-4">{company._count.leads}</td>
                    <td className="px-6 py-4 text-loom-muted">
                      {formatDate(company.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <DeleteButton
                        id={company.id}
                        label="O'chirish"
                        confirmMessage={`"${company.name}" kompaniyasini o'chirmoqchimisiz?`}
                        onDelete={deleteCompany}
                      />
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
