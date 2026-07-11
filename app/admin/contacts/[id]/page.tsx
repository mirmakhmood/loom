import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteContact } from "@/app/actions";
import { DeleteButton } from "@/app/components/DeleteButton";
import { EditContactForm } from "@/app/components/EditContactForm";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type ContactDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ContactDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const contactId = Number(id);
  if (!Number.isInteger(contactId)) {
    return { title: "Kontakt" };
  }

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { name: true },
  });

  return { title: contact ? contact.name : "Kontakt" };
}

export default async function ContactDetailPage({
  params,
}: ContactDetailPageProps) {
  const { id } = await params;
  const contactId = Number(id);

  if (!Number.isInteger(contactId) || contactId <= 0) {
    notFound();
  }

  const [contact, companies] = await Promise.all([
    prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        company: true,
        leads: {
          orderBy: { createdAt: "desc" },
          include: { assignedTo: { select: { username: true } } },
        },
      },
    }),
    prisma.company.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!contact) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/contacts"
            className="text-sm text-loom-muted hover:text-loom-gold-dark"
          >
            ← Kontaktlar
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {contact.name}
          </h2>
          <p className="mt-1 text-sm text-loom-muted">{contact.phone}</p>
        </div>
        <DeleteButton
          id={contact.id}
          label="O'chirish"
          confirmMessage={`"${contact.name}" kontaktini o'chirmoqchimisiz?`}
          onDelete={deleteContact}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
            Ma&apos;lumotlar
          </h3>
          <EditContactForm contact={contact} companies={companies} />
        </div>

        <div className="rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
            Bog&apos;langan arizalar ({contact.leads.length})
          </h3>
          {contact.company && (
            <p className="mb-4 text-sm">
              Kompaniya:{" "}
              <Link
                href={`/admin/companies/${contact.company.id}`}
                className="font-medium hover:text-loom-gold-dark hover:underline"
              >
                {contact.company.name}
              </Link>
            </p>
          )}
          <ul className="divide-y divide-loom-border">
            {contact.leads.length === 0 ? (
              <li className="py-4 text-sm text-loom-muted">
                Arizalar yo&apos;q.
              </li>
            ) : (
              contact.leads.map((lead) => (
                <li key={lead.id} className="py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium hover:text-loom-gold-dark hover:underline"
                  >
                    {lead.name}
                  </Link>
                  <p className="text-xs text-loom-muted">
                    {lead.status} · {formatDateTime(lead.createdAt)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
