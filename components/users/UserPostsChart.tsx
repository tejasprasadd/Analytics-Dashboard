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
      name: String(p.id),
      views: p.views,
    }));
  }, [postsByUser?.posts]);

  const lineData = useMemo(() => {
    const posts = postsByUser?.posts ?? [];
    return posts.map((p) => ({
      x: String(p.id),
      likes: p.reactions.likes,
      dislikes: p.reactions.dislikes,
      views: p.views,
    }));
  }, [postsByUser?.posts]);

  const pieData = useMemo(() => {
    const posts = (postsByUser?.posts ?? []).slice(0, 5);
    return posts.map((p) => ({
      name: p.title.length > 18 ? p.title.slice(0, 18) + "…" : p.title,
      value: commentsByPost[p.id]?.total ?? 0,
    }));
  }, [commentsByPost, postsByUser?.posts]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-sm font-semibold">Views per post (selected user)</div>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="views" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-sm font-semibold">Reactions & views (selected user)</div>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="x" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="likes" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="dislikes" stroke="#f87171" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="views" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-sm font-semibold">Comments (top posts)</div>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

