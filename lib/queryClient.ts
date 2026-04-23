import { QueryClient } from "@tanstack/react-query";

import { ErrorCodes } from "@/lib/errors/errorCodes";
import { AppError } from "@/lib/errors/AppError";

let queryClient: QueryClient | null = null;

function exposeToDevtools(client: QueryClient) {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined") return;
  window.__TANSTACK_QUERY_CLIENT__ = client;
}

function getCode(err: unknown): string | null {
  if (err instanceof AppError) return err.code;
  if (typeof err === "object" && err !== null) {
    const maybe = err as Record<string, unknown>;
    const code = maybe.code;
    if (typeof code === "string") return code;
  }
  return null;
}

export function getQueryClient(): QueryClient {
  if (queryClient) return queryClient;

  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,// 5 minutes is stale time means the data will be considered stale after 5 minutes.
        gcTime: 10 * 60 * 1000,// 10 minutes is garbage collection time means the data will be garbage collected after 10 minutes.
        refetchOnWindowFocus: true,// Refetch on window focus means the data will be refetched when the window is focused.
        refetchOnReconnect: true,// Refetch on reconnect means the data will be refetched when the reconnect.
        networkMode: "online",
        retry: (count, err) => {// Retry is the function that retries the request.  
          const code = getCode(err);
          if (code === ErrorCodes.RATE_LIMITED) return false;
          return count < 2;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),//Retry delay is the time to wait before retrying the request.
      },
      mutations: {
        retry: 0,
        throwOnError: false,
      },
    },
  });

  exposeToDevtools(queryClient);
  return queryClient;
}

