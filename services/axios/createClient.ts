import axios, {
  type AxiosInstance,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

import { normalize } from "@/lib/errors/normalize";
import type { AppErrorUpstream } from "@/lib/errors/AppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";
import { authEventBus } from "@/lib/errors/authEventBus";
import { getStoredAuthToken } from "@/lib/persist/storage";

/** How we want this client to behave (base URL, timeouts, auth, and which “upstream” name we use in errors). */
export interface CreateClientOptions {
  upstream: AppErrorUpstream;
  baseURL: string;
  timeoutMs?: number;
  defaultParams?: Record<string, string | number | boolean | undefined>;
  defaultHeaders?: Record<string, string>;
  /** If true, we add a Bearer token header when a token is saved in the browser. */
  attachAuth?: boolean;
}

/**
 * Builds one axios client and wires up interceptors here, so all HTTP errors and auth
 * are handled the same way across the app.
 */
export function createClient(opts: CreateClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL: opts.baseURL,
    timeout: opts.timeoutMs ?? 10_000,
    params: opts.defaultParams,
    headers: { "Content-Type": "application/json", ...opts.defaultHeaders },
  });

  // Runs before each request. `config` is axios’s one-request recipe (url, method, headers, body…).
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Tiny id for this one call, so logs and support can follow a single request.
    const reqId =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    (config as InternalAxiosRequestConfig & { __reqId?: string }).__reqId = reqId;

    if (opts.attachAuth) {
      const token = getStoredAuthToken();
      if (token) {
        const headers = AxiosHeaders.from(config.headers ?? {});
        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.debug(`[${opts.upstream}]`, config.method?.toUpperCase(), config.baseURL, config.url, reqId);
    }
    return config;
  });

  // On success, pass the response through. On failure, turn the error into our app shape and maybe signal logout.
  instance.interceptors.response.use(
    (response) => response,
    (err) => {
      const normalized = normalize(err, opts.upstream);
      if (normalized.code === ErrorCodes.UNAUTHORIZED) authEventBus.emit("UNAUTHORIZED");
      return Promise.reject(normalized);
    },
  );

  return instance;
}
