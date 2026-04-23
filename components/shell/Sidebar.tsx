"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const dashboardNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/weather", label: "Weather" },
  { href: "/dashboard/stocks", label: "Stocks" },
] as const;

export function isDashboardNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-xl border border-border bg-background p-4">
      <div className="text-sm font-semibold">Dashboard</div>
      <nav className="mt-4 space-y-1">
        {dashboardNav.map((item) => {
          const active = pathname ? isDashboardNavActive(pathname, item.href) : false;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

