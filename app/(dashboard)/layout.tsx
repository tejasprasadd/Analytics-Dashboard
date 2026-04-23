"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ActivityFeed } from "@/components/collaboration/ActivityFeed";
import { useCollabActivity } from "@/hooks/realtime/useCollabActivity";
import { useAppSelector } from "@/store/hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  useCollabActivity();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login?next=" + encodeURIComponent(pathname ?? "/dashboard"));
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) return null;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0">{children}</main>
        <ActivityFeed />
      </div>
    </div>
  );
}

