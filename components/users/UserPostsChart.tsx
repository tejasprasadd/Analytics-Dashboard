"use client";

import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import type { DummyJsonPostsResponse } from "@/types/post.types";
import type { DummyJsonCommentsResponse } from "@/types/comment.types";

const PIE_COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"] as const;

const tooltipStyle = {
  backgroundColor: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  color: "hsl(var(--foreground))",
} as const;

const tooltipLabelStyle = { color: "hsl(var(--foreground))" } as const;

export const UserPostsChart = memo(function UserPostsChart({
  postsByUser,
  commentsByPost,
}: {
  postsByUser: DummyJsonPostsResponse | null;
  commentsByPost: Record<number, DummyJsonCommentsResponse | undefined>;
}) {
  const barData = useMemo(() => {
    const posts = postsByUser?.posts ?? [];
    return posts.map((p) => ({
      postId: String(p.id),
      views: p.views,
    }));
  }, [postsByUser?.posts]);

  const lineData = useMemo(() => {
    const posts = postsByUser?.posts ?? [];
    return posts.map((p) => ({
      postId: String(p.id),
      likes: p.reactions.likes,
      dislikes: p.reactions.dislikes,
      views: p.views,
    }));
  }, [postsByUser?.posts]);

  const pieData = useMemo(() => {
    const posts = (postsByUser?.posts ?? []).slice(0, 5);
    return posts.map((p) => ({
      name: `#${p.id}`,
      value: commentsByPost[p.id]?.total ?? 0,
    }));
  }, [commentsByPost, postsByUser?.posts]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-sm font-semibold">Bar chart — Views per post (selected user)</div>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={barData}>
              <XAxis dataKey="postId" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
              <Bar dataKey="views" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-sm font-semibold">Line chart — Reactions & views (selected user)</div>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={lineData}>
              <XAxis dataKey="postId" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
              <Line type="monotone" dataKey="likes" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="dislikes" stroke="#f87171" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="views" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-sm font-semibold">Pie chart — # comments per post</div>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                // Keep tooltip from covering the slice under the cursor.
                position={{ x: 12, y: 12 }}
                wrapperStyle={{ pointerEvents: "none" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

