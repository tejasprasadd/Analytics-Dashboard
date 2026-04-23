import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getWeatherByQuery } from "@/services/weather.service";

export function useWeatherCurrent(weatherQuery: string | null | undefined) {
  const q = weatherQuery?.trim() ?? "";

  return useQuery({
    queryKey: queryKeys.weather.current(q),
    queryFn: ({ signal }) => getWeatherByQuery(q, signal),
    enabled: Boolean(q),
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}

