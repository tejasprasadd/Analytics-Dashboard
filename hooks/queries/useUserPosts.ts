import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getPostsByUser } from "@/services/users.service";

// A custom hook that fetches the posts for a given user.
export function useUserPosts(userId: number | null) {
  return useQuery({
    queryKey: [...queryKeys.posts.root, "byUser", userId] as const,
    queryFn: ({ signal }) => getPostsByUser(userId as number, signal),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });
}

