"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { env } from "@/lib/env";
import { getQueryClient } from "@/lib/queryClient";

//This plugs the tanstack query client into the application.
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const client = getQueryClient();
  return (
    <QueryClientProvider client={client}>
      {children}
      {env.enableDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}

