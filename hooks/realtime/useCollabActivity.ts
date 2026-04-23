"use client";

import { useEffect } from "react";

import { env } from "@/lib/env";
import { useAppDispatch } from "@/store/hooks";
import { addCollabEvent } from "@/store/slices/collabSlice";

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

const MOCK_USERS = ["Ava", "Noah", "Mia", "Leo", "Zara"] as const;
const MOCK_ACTIONS = [
  "refreshed the dashboard",
  "changed a filter",
  "opened the users module",
  "checked the weather",
  "looked at stocks",
] as const;

export function useCollabActivity() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const intervalMs = Number.isFinite(env.collabSimIntervalMs) ? env.collabSimIntervalMs : 8_000;
    const t = window.setInterval(() => {
      const who = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      const what = MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)];

      dispatch(
        addCollabEvent({
          id: newId(),
          at: nowIso(),
          text: `${who} ${what}`,
        }),
      );
    }, Math.max(1_000, intervalMs));

    return () => window.clearInterval(t);
  }, [dispatch]);
}

