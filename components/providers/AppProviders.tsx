"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeBoot } from "@/components/providers/ThemeBoot";
import { authEventBus } from "@/lib/errors/authEventBus";
import { getQueryClient } from "@/lib/queryClient";
import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";


//Stacks all the providers for the application in the right order. 
export function AppProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = authEventBus.subscribe((reason) => {
      if (reason !== "UNAUTHORIZED") return;

      store.dispatch(logout());
      getQueryClient().clear();

      if (pathname !== "/login") router.replace("/login");
    });
    return unsub;
  }, [pathname, router]);

  return (
    <ReduxProvider>
      <QueryProvider>
        <ThemeBoot>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeBoot>
      </QueryProvider>
    </ReduxProvider>
  );
}

