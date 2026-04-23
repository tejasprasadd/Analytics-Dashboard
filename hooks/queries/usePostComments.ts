import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getCommentsByPost } from "@/services/posts.service";

// A custom hook that fetches the comments for a given post.
export function usePostComments(postId: number | null) {
  return useQuery({
    queryKey: [...queryKeys.comments.root, "byPost", postId] as const,
    queryFn: ({ signal }) => getCommentsByPost(postId as number, signal),
    enabled: Boolean(postId),
    staleTime: 5 * 60 * 1000,//It means that the data will be considered stale after 5 minutes.
    //If the data is stale, the hook will refetch the data from the server.
    //If the data is not stale, the hook will return the cached data.
  });
}

