"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: string; title: string; description?: string };

type ToastContextValue = {
  toast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = newId();
    setItems((prev) => [{ id, ...t }, ...prev].slice(0, 3));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[320px] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-xl border border-border bg-background p-3 shadow-sm"
          >
            <div className="text-sm font-semibold">{t.title}</div>
            {t.description ? (
              <div className="mt-1 text-sm text-muted-foreground">{t.description}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

