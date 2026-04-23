"use client";

import { memo, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/errors/ErrorState";
import { UserPostsChart } from "@/components/users/UserPostsChart";
import { useUsersList } from "@/hooks/queries/useUsersList";
import { useUserPosts } from "@/hooks/queries/useUserPosts";
import { usePostComments } from "@/hooks/queries/usePostComments";
import { useCommentsByPosts } from "@/hooks/queries/useCommentsByPosts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectPost,
  selectUser,
  setUserSearchQuery,
  setUsersLimit,
  setUsersPage,
} from "@/store/slices/filtersSlice";
import type { DummyJsonComment } from "@/types/comment.types";

const UsersTable = memo(function UsersTable({
  users,
  selectedUserId,
  onSelect,
}: {
  users: { id: number; username: string; email: string }[];
  selectedUserId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-sm font-semibold">Users</div>
      <div className="mt-3 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2 pr-3">Username</th>
              <th className="py-2 pr-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const active = selectedUserId === u.id;
              return (
                <tr
                  key={u.id}
                  className={active ? "bg-muted" : "hover:bg-muted/60"}
                  onClick={() => onSelect(u.id)}
                >
                  <td className="cursor-pointer py-2 pr-3 font-medium">{u.username}</td>
                  <td className="cursor-pointer py-2 pr-3 text-muted-foreground">{u.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const PostsTable = memo(function PostsTable({
  posts,
  selectedPostId,
  onSelect,
}: {
  posts: { id: number; title: string; views: number; commentsTotal?: number }[];
  selectedPostId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-sm font-semibold">Posts</div>
      <div className="mt-3 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2 pr-3">Post ID</th>
              <th className="py-2 pr-3">Title</th>
              <th className="py-2 pr-3">Comments</th>
              <th className="py-2 pr-3">Views</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => {
              const active = selectedPostId === p.id;
              return (
                <tr
                  key={p.id}
                  className={active ? "bg-muted" : "hover:bg-muted/60"}
                  onClick={() => onSelect(p.id)}
                >
                  <td className="cursor-pointer py-2 pr-3 font-medium">{p.id}</td>
                  <td className="cursor-pointer py-2 pr-3 font-medium">{p.title}</td>
                  <td className="cursor-pointer py-2 pr-3 text-muted-foreground">
                    {typeof p.commentsTotal === "number" ? p.commentsTotal : "—"}
                  </td>
                  <td className="cursor-pointer py-2 pr-3 text-muted-foreground">{p.views}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const CommentsList = memo(function CommentsList({
  comments,
}: {
  comments: { id: number; body: string; user: { username: string } }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-sm font-semibold">Comments</div>
      <div className="mt-3 space-y-3">
        {comments.length === 0 ? (
          <div className="text-sm text-muted-foreground">No comments.</div>
        ) : (
          comments.slice(0, 20).map((c) => (
            <div key={c.id} className="text-sm">
              <div className="font-medium">{c.user.username}</div>
              <div className="text-muted-foreground">{c.body}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const [draft, setDraft] = useState(filters.userSearchQuery);

  const usersQ = useUsersList({
    q: filters.userSearchQuery,
    page: filters.usersPage,
    limit: filters.usersLimit,
  });

  const postsQ = useUserPosts(filters.selectedUserId);
  const commentsQ = usePostComments(filters.selectedPostId);

  const users = useMemo(() => usersQ.data?.users ?? [], [usersQ.data?.users]);
  const posts = useMemo(() => postsQ.data?.posts ?? [], [postsQ.data?.posts]);
  const comments: DummyJsonComment[] = commentsQ.data?.comments ?? [];

  const postIds = useMemo(() => posts.map((p) => p.id), [posts]);
  const commentsMulti = useCommentsByPosts(postIds);

  const commentsByPost = commentsMulti.byPostId;
  const postsWithCounts = useMemo(() => {
    return posts.map((p) => ({
      id: p.id,
      title: p.title,
      views: p.views,
      commentsTotal: commentsByPost[p.id]?.total,
    }));
  }, [commentsByPost, posts]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Users → Posts → Comments</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Search then drill down by selecting a user and a post.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              className="h-9 w-64 max-w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Search users (press Enter)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") dispatch(setUserSearchQuery(draft));
              }}
            />
            <Button variant="outline" onClick={() => dispatch(setUserSearchQuery(draft))}>
              Search
            </Button>
            <select
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={String(filters.usersLimit)}
              onChange={(e) => dispatch(setUsersLimit(Number(e.target.value)))}
            >
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(setUsersPage(Math.max(1, filters.usersPage - 1)))}
                disabled={filters.usersPage <= 1}
              >
                Prev
              </Button>
              <div className="px-2 text-sm text-muted-foreground">Page {filters.usersPage}</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(setUsersPage(filters.usersPage + 1))}
                disabled={Boolean(usersQ.data) && users.length < filters.usersLimit}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {usersQ.isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-[260px] w-full" />
          <Skeleton className="h-[260px] w-full" />
        </div>
      ) : usersQ.isError ? (
        <ErrorState title="Couldn’t load users" error={usersQ.error} onRetry={() => usersQ.refetch()} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UsersTable
            users={users.map((u) => ({ id: u.id, username: u.username, email: u.email }))}
            selectedUserId={filters.selectedUserId}
            onSelect={(id) => dispatch(selectUser(id))}
          />

          {postsQ.isLoading && filters.selectedUserId ? (
            <Skeleton className="h-[260px] w-full" />
          ) : postsQ.isError ? (
            <ErrorState title="Couldn’t load posts" error={postsQ.error} onRetry={() => postsQ.refetch()} />
          ) : (
            <PostsTable
              posts={postsWithCounts}
              selectedPostId={filters.selectedPostId}
              onSelect={(id) => dispatch(selectPost(id))}
            />
          )}
        </div>
      )}

      {filters.selectedPostId ? (
        commentsQ.isLoading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : commentsQ.isError ? (
          <ErrorState
            title="Couldn’t load comments"
            error={commentsQ.error}
            onRetry={() => commentsQ.refetch()}
          />
        ) : (
          <CommentsList comments={comments} />
        )
      ) : null}

      <UserPostsChart
        postsByUser={postsQ.data ?? null}
        commentsByPost={commentsByPost}
      />
    </div>
  );
}

