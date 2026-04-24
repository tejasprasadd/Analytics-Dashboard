export interface CookieOptions {
  maxAgeSeconds?: number;
  path?: string;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
}

function isClient(): boolean {
  return typeof document !== "undefined";
}

//This function is used to set the cookie in the browser.
export function setCookie(name: string, value: string, opts: CookieOptions = {}): void {
  if (!isClient()) return;
  const parts: string[] = [];
  parts.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
  parts.push(`Path=${opts.path ?? "/"}`);
  parts.push(`SameSite=${opts.sameSite ?? "Lax"}`);
  if (typeof opts.maxAgeSeconds === "number") parts.push(`Max-Age=${opts.maxAgeSeconds}`);
  if (opts.secure) parts.push("Secure");
  document.cookie = parts.join("; ");
}

//This function is used to clear the cookie in the browser.
export function clearCookie(name: string, opts: Pick<CookieOptions, "path"> = {}): void {
  // Max-Age=0 deletes the cookie
  setCookie(name, "", { ...opts, maxAgeSeconds: 0 });
}

//This function is used to get the cookie from the browser.
export function getCookie(name: string): string | null {
  if (!isClient()) return null;
  const target = `${encodeURIComponent(name)}=`;
  const items = document.cookie.split(";").map((s) => s.trim());
  for (const item of items) {
    if (item.startsWith(target)) return decodeURIComponent(item.slice(target.length));
  }
  return null;
}

