import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";

//This hook is used to invalidate the queries when the data is changed.
export function useQueryInvalidation() {
  const qc = useQueryClient();
  return {
    invalidateUsers: () => qc.invalidateQueries({ queryKey: queryKeys.users.root }),
    invalidatePosts: () => qc.invalidateQueries({ queryKey: queryKeys.posts.root }),
    invalidateComments: () => qc.invalidateQueries({ queryKey: queryKeys.comments.root }),
    invalidateWeather: () => qc.invalidateQueries({ queryKey: queryKeys.weather.root }),
    invalidateStocks: () => qc.invalidateQueries({ queryKey: queryKeys.stocks.root }),
    invalidateAll: () => qc.invalidateQueries(),
  };
}

