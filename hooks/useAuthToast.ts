"use client";

import { useEffect, useRef } from "react";

import { useToast } from "@/components/ui/toast";
import { useAppSelector } from "@/store/hooks";

export function useAuthToast() {
  const { toast } = useToast();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);
  const prev = useRef(isAuthenticated);

  useEffect(() => {
    if (!prev.current && isAuthenticated) {
      toast({
        title: "Signed in",
        description: user?.email ? `Welcome, ${user.email}` : "Welcome back",
      });
    }
    prev.current = isAuthenticated;
  }, [isAuthenticated, toast, user?.email]);
}

