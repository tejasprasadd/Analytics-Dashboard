"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, handleLogout } = useAuth();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted" />
          )}
          <div>
            <div className="text-sm font-medium">
              {user ? `${user.firstName} ${user.lastName}` : "Anonymous"}
            </div>
            <div className="text-xs text-muted-foreground">{user?.email ?? ""}</div>
          </div>
        </div>

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="mt-8 rounded-xl border border-border p-5">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You’re signed in via the mock ReqRes flow.
        </p>
      </div>
    </main>
  );
}

