import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCompany } from "@/app/actions";
import { CreateContactForm } from "@/app/components/CreateContactForm";
import { DeleteButton } from "@/app/components/DeleteButton";
import { EditCompanyForm } from "@/app/components/EditCompanyForm";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type CompanyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CompanyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const companyId = Number(id);
  if (!Number.isInteger(companyId)) {
    return { title: "Kompaniya" };
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { name: true },
  });

  return { title: company ? company.name : "Kompaniya" };
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { id } = await params;
  const companyId = Number(id);

  if (!Number.isInteger(companyId) || companyId <= 0) {
    notFound();
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      contacts: { orderBy: { name: "asc" } },
      leads: {
        orderBy: { createdAt: "desc" },
        include: { assignedTo: { select: { username: true } } },
      },
    },
  });

  if (!company) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/companies"
            className="text-sm text-loom-muted hover:text-loom-gold-dark"
          >
            ← Kompaniyalar
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {company.name}
          </h2>
        </div>
        <DeleteButton
          id={company.id}
          label="O'chirish"
          confirmMessage={`"${company.name}" kompaniyasini o'chirmoqchimisiz?`}
          onDelete={deleteCompany}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
            Ma&apos;lumotlar
          </h3>
          <EditCompanyForm company={company} />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
              Kontaktlar ({company.contacts.length})
            </h3>
            <CreateContactForm
              companies={[{ id: company.id, name: company.name }]}
              defaultCompanyId={company.id}
            />
            <ul className="mt-6 divide-y divide-loom-border">
              {company.contacts.length === 0 ? (
                <li className="py-4 text-sm text-loom-muted">
                  Kontaktlar yo&apos;q.
                </li>
              ) : (
                company.contacts.map((contact) => (
                  <li key={contact.id} className="py-3">
                    <Link
                      href={`/admin/contacts/${contact.id}`}
                      className="font-medium hover:text-loom-gold-dark hover:underline"
                    >
                      {contact.name}
                    </Link>
                    <p className="text-xs text-loom-muted">
                      {contact.phone}
                      {contact.position ? ` · ${contact.position}` : ""}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
              Arizalar ({company.leads.length})
            </h3>
            <ul className="divide-y divide-loom-border">
              {company.leads.length === 0 ? (
                <li className="py-4 text-sm text-loom-muted">
                  Arizalar yo&apos;q.
                </li>
              ) : (
                company.leads.map((lead) => (
                  <li key={lead.id} className="py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium hover:text-loom-gold-dark hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <p className="text-xs text-loom-muted">
                      {lead.status} · {lead.product} ·{" "}
                      {formatDateTime(lead.createdAt)}
                    </p>
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
