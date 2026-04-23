"use client";

import { formatDistanceToNow } from "date-fns";

import { useCollabEvents } from "@/hooks/useCollabEvents";

export function ActivityFeed() {
  const events = useCollabEvents();

  return (
    <aside className="w-full rounded-xl border border-border bg-background p-4">
      <div className="text-sm font-semibold">Activity</div>
      <div className="mt-3 h-[200px] space-y-3 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-sm text-muted-foreground">No activity yet.</div>
        ) : (
          events.map((e) => (
            <div key={e.id} className="text-sm">
              <div className="text-foreground">{e.text}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(e.at), { addSuffix: true })}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

