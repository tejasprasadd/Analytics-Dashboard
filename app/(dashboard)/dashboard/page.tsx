"use client";

import { ActivityFeed } from "@/components/collaboration/ActivityFeed";

export default function OverviewPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0 rounded-xl border border-border bg-background p-5">
        <h1 className="text-lg font-semibold">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">Welcome.</p>
      </section>
      <ActivityFeed />
    </div>
  );
}

