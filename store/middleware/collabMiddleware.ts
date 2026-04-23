import type { Middleware } from "@reduxjs/toolkit";

import { addCollabEvent } from "@/store/slices/collabSlice";

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

type AnyAction = { type: string; payload?: unknown };

function isAnyAction(a: unknown): a is AnyAction {
  return typeof a === "object" && a !== null && typeof (a as AnyAction).type === "string";
}

export const collabMiddleware: Middleware =
  (storeApi) => (next) => (action: unknown) => {
    const result = next(action);

    // Only generate events for filter changes.
    if (!isAnyAction(action) || !action.type.startsWith("filters/")) {
      return result;
    }

    let text: string | null = null;
    switch (action.type) {
      case "filters/setWeatherQuery":
        text = `looked up weather for '${String(action.payload)}'`;
        break;
      case "filters/setStocksPage":
        text = `paged stocks list to ${String(action.payload)}`;
        break;
      case "filters/setStocksLimit":
        text = `changed stocks page size to ${String(action.payload)}`;
        break;
      case "filters/setUserSearchQuery":
        text = action.payload
          ? `searched users for '${String(action.payload)}'`
          : "cleared user search";
        break;
      case "filters/setUsersPage":
        text = `paged users list to ${String(action.payload)}`;
        break;
      case "filters/selectUser":
        text = action.payload
          ? `opened user #${String(action.payload)}`
          : "closed user drill-down";
        break;
      case "filters/selectPost":
        text = action.payload
          ? `opened post #${String(action.payload)}`
          : "closed post drill-down";
        break;
      default:
        break;
    }

    if (text) {
      storeApi.dispatch(
        addCollabEvent({
          id: newId(),
          at: nowIso(),
          text,
        }),
      );
    }

    return result;
  };

