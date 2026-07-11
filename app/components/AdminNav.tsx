"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Arizalar" },
  { href: "/admin/pipeline", label: "Pipeline" },
  { href: "/admin/companies", label: "Kompaniyalar" },
  { href: "/admin/contacts", label: "Kontaktlar" },
  { href: "/admin/tasks", label: "Vazifalar" },
  { href: "/admin/users", label: "Xodimlar", adminOnly: true },
];

type AdminNavProps = {
  isAdmin: boolean;
};

export function AdminNav({ isAdmin }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
      {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-loom-charcoal text-white"
                : "hover:bg-loom-linen"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
