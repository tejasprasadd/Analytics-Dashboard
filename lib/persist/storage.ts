import { PERSIST_KEYS } from "@/lib/persist/keys";


//Next.js is a server-side rendering framework. So we need to check if the code is running on the client side.
function isClient(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

//This function is used to parse the JSON string into an object.
function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

//This function is used to stringify the object into a JSON string.
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

//This function is used to remove the item from the localStorage.
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

//This function is used to set the auth token in the localStorage.
export function setStoredAuthToken(token: string | null): void {
  if (!isClient()) return;
  try {
    if (token) window.localStorage.setItem(PERSIST_KEYS.authToken, token);
    else window.localStorage.removeItem(PERSIST_KEYS.authToken);
  } catch {
    // ignore
  }
}

//This function is used to get the auth user from the localStorage.
export function getStoredAuthUser<TUser>(): TUser | null {
  return safeGet<TUser>(PERSIST_KEYS.authUser);
}

//This function is used to set the auth user in the localStorage.
export function setStoredAuthUser<TUser>(user: TUser | null): void {
  if (user === null) safeRemove(PERSIST_KEYS.authUser);
  else safeSet(PERSIST_KEYS.authUser, user);
}
