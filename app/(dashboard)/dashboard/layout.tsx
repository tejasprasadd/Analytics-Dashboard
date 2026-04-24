"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { Header } from "@/components/shell/Header";
import { useCollabActivity } from "@/hooks/realtime/useCollabActivity";
import { useAppSelector } from "@/store/hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  useCollabActivity();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?next=" + encodeURIComponent(pathname ?? "/dashboard"));
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="min-w-0 space-y-4">
        <Header />
        <ErrorBoundary>
          <main className="min-w-0">{children}</main>
        </ErrorBoundary>
      </div>
    </div>
  );
}

