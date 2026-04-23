import { QueryClient } from "@tanstack/react-query";

import { ErrorCodes } from "@/lib/errors/errorCodes";
import { AppError } from "@/lib/errors/AppError";

let queryClient: QueryClient | null = null;

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
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        networkMode: "online",
        retry: (count, err) => {
          const code = getCode(err);
          if (code === ErrorCodes.RATE_LIMITED) return false;
          return count < 2;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      },
      mutations: {
        retry: 0,
        throwOnError: false,
      },
    },
  });

  return queryClient;
}

