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

export interface CreateClientOptions {
  upstream: AppErrorUpstream;
  baseURL: string;
  timeoutMs?: number;
  defaultParams?: Record<string, string | number | boolean | undefined>;
  defaultHeaders?: Record<string, string>;
  /** If true, attach `Authorization: Bearer <token>` when a token exists in localStorage. THis is ignored as we are just mocking the auth flow using the reqres API her please*/
  attachAuth?: boolean;
}

/**
 * Shared axios factory. **This is the single place where interceptors live.**
 */

//ONe place for creating all axios instances and attaching interceptors.
export function createClient(opts: CreateClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL: opts.baseURL,
    timeout: opts.timeoutMs ?? 10_000,
    params: opts.defaultParams,
    headers: { "Content-Type": "application/json", ...opts.defaultHeaders },
  });

  //An Axios request interceptor that generates a request ID and attaches it to the config.
  //Request id is a small correlation token that is attached with each HTTP call.
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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
