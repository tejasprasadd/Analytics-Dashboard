import { configureStore } from "@reduxjs/toolkit";

import { PERSIST_KEYS } from "@/lib/persist/keys";
import { getStoredAuthToken, getStoredAuthUser, safeGet } from "@/lib/persist/storage";
import authReducer from "@/store/slices/authSlice";
import collabReducer from "@/store/slices/collabSlice";
import filtersReducer, { type FiltersState } from "@/store/slices/filtersSlice";
import { INITIAL_FILTERS } from "@/store/slices/filtersSlice";
import themeReducer, { type ThemeState } from "@/store/slices/themeSlice";
import { collabMiddleware } from "@/store/middleware/collabMiddleware";
import { persistMiddleware } from "@/store/middleware/persistMiddleware";
import type { AuthSession } from "@/types/auth.types";

function hydrateAuthFromStorage(): {
  user: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} {
  const user = getStoredAuthUser<AuthSession>();
  const token = getStoredAuthToken();

  // If token exists but user blob is missing, keep auth false until proper login.
  if (!token || !user?.token) {
    return { user: null, isAuthenticated: false, isLoading: false, error: null };
  }
  return { user, isAuthenticated: true, isLoading: false, error: null };
}

function hydrateThemeFromStorage(): ThemeState {
  return safeGet<ThemeState>(PERSIST_KEYS.theme) ?? { mode: "light" };
}

function hydrateFiltersFromStorage(): FiltersState {
  const stored = safeGet<Partial<FiltersState>>(PERSIST_KEYS.filters);
  // Merge defaults with whatever is stored so older/partial payloads
  // (e.g. from the pre-DummyJSON schema) can't corrupt the store shape.
  return { ...INITIAL_FILTERS, ...(stored ?? {}) };
}

const preloadedState = {
  auth: hydrateAuthFromStorage(),
  theme: hydrateThemeFromStorage(),
  filters: hydrateFiltersFromStorage(),
  // collab is not persisted
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    filters: filtersReducer,
    collab: collabReducer,
  },
  preloadedState,
  middleware: (getDefault) => getDefault().concat(persistMiddleware, collabMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

