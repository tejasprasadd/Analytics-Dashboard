"use client";

import { useEffect } from "react";

import { useAppSelector } from "@/store/hooks";

export function ThemeBoot({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);

  return <>{children}</>;
}

