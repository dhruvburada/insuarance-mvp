"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Overview", href: "/" },
  { name: "Clients", href: "/clients" },
  { name: "Catalog", href: "/products" },
  { name: "Payments", href: "/payments" },
];

export function DashboardNav() {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="flex items-center gap-1 md:gap-2 text-sm font-semibold">
      {NAV_ITEMS.map((item) => {
        const active = isItemActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150",
              active
                ? "text-white font-bold bg-pine-900/90 border border-pine-800 shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-pine-900/40"
            )}
          >
            {active && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_rgba(220,247,99,0.8)]"
                aria-hidden="true"
              />
            )}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
