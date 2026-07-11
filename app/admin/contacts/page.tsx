import type { Metadata } from "next";
import Link from "next/link";
import { deleteContact } from "@/app/actions";
import { CreateContactForm } from "@/app/components/CreateContactForm";
import { DeleteButton } from "@/app/components/DeleteButton";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Kontaktlar",
};

type ContactsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ContactsPage({
  searchParams,
}: ContactsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const [contacts, companies] = await Promise.all([
    prisma.contact.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        company: { select: { id: true, name: true } },
        _count: { select: { leads: true } },
      },
    }),
    prisma.company.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Kontaktlar</h2>
        <p className="mt-1 text-sm text-loom-muted">
          Mijoz vakillari va aloqa shaxslari
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-loom-border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-loom-muted">
          Yangi kontakt
        </h3>
        <CreateContactForm companies={companies} />
      </div>

      <form className="mb-6">
        <div className="flex flex-wrap gap-2">
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Ism, telefon yoki email..."
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
                <th className="px-6 py-4 font-medium text-loom-muted">Ism</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Telefon</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Lavozim</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Kompaniya</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Arizalar</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Sana</th>
                <th className="px-6 py-4 font-medium text-loom-muted">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-loom-muted"
                  >
                    Kontaktlar topilmadi.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-loom-border last:border-b-0"
                  >
                    <td className="px-6 py-4 font-medium">
                      <Link
                        href={`/admin/contacts/${contact.id}`}
                        className="hover:text-loom-gold-dark hover:underline"
                      >
                        {contact.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-loom-muted">{contact.phone}</td>
                    <td className="px-6 py-4 text-loom-muted">
                      {contact.position ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-loom-muted">
                      {contact.company ? (
                        <Link
                          href={`/admin/companies/${contact.company.id}`}
                          className="hover:underline"
                        >
                          {contact.company.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4">{contact._count.leads}</td>
                    <td className="px-6 py-4 text-loom-muted">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <DeleteButton
                        id={contact.id}
                        label="O'chirish"
                        confirmMessage={`"${contact.name}" kontaktini o'chirmoqchimisiz?`}
                        onDelete={deleteContact}
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
