"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { dashboardNav, isDashboardNavActive } from "@/components/shell/Sidebar";

export function Header() {
  const { isDark, toggle } = useTheme();
  const { user, handleLogout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <nav className="flex flex-wrap items-center gap-1">
        {dashboardNav.map((item) => {
          const active = pathname ? isDashboardNavActive(pathname, item.href) : false;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm transition-colors",
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

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {isDark ? "Dark" : "Light"}
        </Button>

        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-2 py-1.5">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted" />
          )}
          <div className="hidden sm:block">
            <div className="text-xs font-medium leading-4">
              {user ? `${user.firstName} ${user.lastName}` : "Anonymous"}
            </div>
            <div className="text-[11px] leading-4 text-muted-foreground">{user?.email ?? ""}</div>
          </div>
          <Button size="sm" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

