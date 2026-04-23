import type { Middleware } from "@reduxjs/toolkit";

import { PERSIST_KEYS } from "@/lib/persist/keys";
import { safeSet, setStoredAuthToken, setStoredAuthUser } from "@/lib/persist/storage";
import { clearCookie, setCookie } from "@/lib/persist/cookie";
import type { RootState } from "@/store";

const AUTH_COOKIE_NAME = "auth-token";

/**
 * Persists selected slices to localStorage after actions run.
 * SSR-safe: no-ops in `safeSet`/`setCookie` when not in browser.
 */
type AnyAction = { type: string; payload?: unknown };

export const persistMiddleware: Middleware =
  (storeApi) => (next) => (action: unknown) => {
    const result = next(action);
    const state = storeApi.getState() as RootState;
    const a = action as AnyAction;

    switch (a.type) {
      case "auth/loginSuccess": {
        // Persist token + user for axios interceptor and boot hydration.
        setStoredAuthToken(state.auth.user?.token ?? null);
        setStoredAuthUser(state.auth.user);

        // Cookie is used by edge middleware (optional). Keep it in sync.
        if (state.auth.user?.token) {
          setCookie(AUTH_COOKIE_NAME, state.auth.user.token, {
            maxAgeSeconds: 60 * 60 * 24,
            sameSite: "Lax",
            path: "/",
          });
        }
        break;
      }
      case "auth/logout": {
        setStoredAuthToken(null);
        setStoredAuthUser(null);
        clearCookie(AUTH_COOKIE_NAME, { path: "/" });
        break;
      }
      case "theme/setTheme":
      case "theme/toggleTheme": {
        safeSet(PERSIST_KEYS.theme, state.theme);
        break;
      }
      case "filters/setWeatherQuery":
      case "filters/setStocksPage":
      case "filters/setStocksLimit":
      case "filters/setUserSearchQuery":
      case "filters/setUsersPage":
      case "filters/setUsersLimit":
      case "filters/selectUser":
      case "filters/selectPost":
      case "filters/resetFilters": {
        safeSet(PERSIST_KEYS.filters, state.filters);
        break;
      }
      default:
        break;
    }

    return result;
  };

