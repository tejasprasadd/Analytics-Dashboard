import { useQueries } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getCommentsByPost } from "@/services/posts.service";
import type { DummyJsonCommentsResponse } from "@/types/comment.types";

export function useCommentsByPosts(postIds: number[] | null | undefined) {
  const ids = postIds ?? [];

  const queries = useQueries({
    queries: ids.map((postId) => ({
      queryKey: queryKeys.comments.byPost(postId),
      queryFn: ({ signal }: { signal: AbortSignal }) => getCommentsByPost(postId, signal),
      enabled: postId > 0,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const map: Record<number, DummyJsonCommentsResponse | undefined> = {};
  for (let i = 0; i < ids.length; i++) {
    const postId = ids[i];
    const q = queries[i];
    map[postId] = q?.data;
  }

  return {
    queries,
    byPostId: map,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  };
}

