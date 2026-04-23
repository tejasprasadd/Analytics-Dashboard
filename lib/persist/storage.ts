import { CURRENT_SCHEMA_VERSION, PERSIST_KEYS } from "@/lib/persist/keys";

function isClient(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeJsonStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

/**
 * SSR-safe localStorage read for JSON values.
 */
export function safeGet<T>(key: string): T | null {
  if (!isClient()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return safeJsonParse<T>(raw);
  } catch {
    return null;
  }
}

/**
 * SSR-safe localStorage write for JSON values.
 */
export function safeSet<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    const raw = safeJsonStringify(value);
    if (raw === null) return;
    window.localStorage.setItem(key, raw);
  } catch {
    // ignore
  }
}

export function safeRemove(key: string): void {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * Read stored bearer token. SSR-safe: returns null on the server.
 */
export function getStoredAuthToken(): string | null {
  if (!isClient()) return null;
  try {
    return window.localStorage.getItem(PERSIST_KEYS.authToken);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string | null): void {
  if (!isClient()) return;
  try {
    if (token) window.localStorage.setItem(PERSIST_KEYS.authToken, token);
    else window.localStorage.removeItem(PERSIST_KEYS.authToken);
  } catch {
    // ignore
  }
}

export function getStoredAuthUser<TUser>(): TUser | null {
  return safeGet<TUser>(PERSIST_KEYS.authUser);
}

export function setStoredAuthUser<TUser>(user: TUser | null): void {
  if (user === null) safeRemove(PERSIST_KEYS.authUser);
  else safeSet(PERSIST_KEYS.authUser, user);
}

/**
 * Migration hook. For now, v1 has no migrations, but we keep the wiring so future
 * versions can evolve without scattering storage logic.
 */
export function migrateIfNeeded(): void {
  if (!isClient()) return;
  const stored = safeGet<number>(PERSIST_KEYS.schemaVersion);

  if (stored === null) {
    safeSet(PERSIST_KEYS.schemaVersion, CURRENT_SCHEMA_VERSION);
    return;
  }

  if (stored < CURRENT_SCHEMA_VERSION) {
    // v1 → v2: the filters slice changed shape (OMDb fields removed, DummyJSON
    // user/post fields added). Drop the stale blob so the store rehydrates
    // from INITIAL_FILTERS instead of re-seeding invalid keys.
    if (stored < 2) safeRemove(PERSIST_KEYS.filters);
    safeSet(PERSIST_KEYS.schemaVersion, CURRENT_SCHEMA_VERSION);
    return;
  }

  if (stored > CURRENT_SCHEMA_VERSION) {
    // User downgraded app version; safest move is to wipe persisted keys.
    safeRemove(PERSIST_KEYS.authToken);
    safeRemove(PERSIST_KEYS.authUser);
    safeRemove(PERSIST_KEYS.theme);
    safeRemove(PERSIST_KEYS.filters);
    safeSet(PERSIST_KEYS.schemaVersion, CURRENT_SCHEMA_VERSION);
  }
}
