"use client";

import { useEffect, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, toggleTheme, type ThemeMode } from "@/store/slices/themeSlice";

export function useTheme() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return useMemo(
    () => ({
      mode,
      isDark: mode === "dark",
      toggle: () => dispatch(toggleTheme()),
      set: (m: ThemeMode) => dispatch(setTheme(m)),
    }),
    [dispatch, mode],
  );
}

