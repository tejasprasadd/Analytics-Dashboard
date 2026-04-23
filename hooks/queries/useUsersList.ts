import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getUsers, type ListUsersParams } from "@/services/users.service";

// A custom hook that fetches the users list.
export function useUsersList(params: ListUsersParams) {
  const q = params.q?.trim() ?? "";
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return useQuery({
    queryKey: [...queryKeys.users.root, { q, page, limit }] as const,
    queryFn: ({ signal }) => getUsers({ q, page, limit }, signal),
    staleTime: 5 * 60 * 1000,
  });
}

