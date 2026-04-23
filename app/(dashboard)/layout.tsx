"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login?next=" + encodeURIComponent(pathname ?? "/dashboard"));
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

