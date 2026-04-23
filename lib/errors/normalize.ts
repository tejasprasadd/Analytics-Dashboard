import axios, { type AxiosError } from "axios";

import { AppError, type AppErrorUpstream } from "@/lib/errors/AppError";
import { ErrorCodes, type ErrorCode } from "@/lib/errors/errorCodes";

function getRequestIdFromAxiosError(err: AxiosError): string | undefined {
  const cfg = err.config as unknown as { __reqId?: string } | undefined;
  return cfg?.__reqId;
}

function mapHttpStatusToCode(status: number): ErrorCode {
  switch (status) {
    case 401:
      return ErrorCodes.UNAUTHORIZED;
    case 403:
      return ErrorCodes.FORBIDDEN;
    case 404:
      return ErrorCodes.NOT_FOUND;
    case 429:
      return ErrorCodes.RATE_LIMITED;
    case 400:
    case 422:
      return ErrorCodes.VALIDATION;
    default:
      if (status >= 500) return ErrorCodes.SERVER;
      return ErrorCodes.UNKNOWN;
  }
}

function isRetryable(code: ErrorCode, httpStatus?: number): boolean {
  if (code === ErrorCodes.NETWORK) return true;
  if (code === ErrorCodes.TIMEOUT) return false;
  if (code === ErrorCodes.SERVER) return true;
  if (code === ErrorCodes.RATE_LIMITED) return false;

  // Treat some transient 408-like cases as retryable if they appear.
  if (httpStatus === 408) return true;

  return false;
}

function messageFromAxiosError(err: AxiosError, code: ErrorCode): string {
  const status = err.response?.status;
  if (code === ErrorCodes.ABORTED) return "Request cancelled";
  if (code === ErrorCodes.TIMEOUT) return "Request timed out";
  if (code === ErrorCodes.NETWORK) return "Network error";
  if (typeof status === "number") return `Request failed with status ${status}`;
  return err.message || "Request failed";
}

/**
 * Normalize any thrown value into an AppError.
 *
 * - Never throws
 * - Preserves the original error as `cause`
 */
export function normalize(err: unknown, upstream: AppErrorUpstream): AppError {
  if (err instanceof AppError) return err;

  // Axios cancellation uses `CanceledError` (code: ERR_CANCELED) in v1+.
  if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
    return new AppError({
      code: ErrorCodes.ABORTED,
      message: "Request cancelled",
      upstream,
      httpStatus: err.response?.status,
      retryable: false,
      requestId: getRequestIdFromAxiosError(err),
      cause: err,
    });
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;

    let code: ErrorCode;
    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      code = ErrorCodes.TIMEOUT;
    } else if (!err.response) {
      code = ErrorCodes.NETWORK;
    } else if (typeof status === "number") {
      code = mapHttpStatusToCode(status);
    } else {
      code = ErrorCodes.UNKNOWN;
    }

    return new AppError({
      code,
      message: messageFromAxiosError(err, code),
      upstream,
      httpStatus: status,
      retryable: isRetryable(code, status),
      requestId: getRequestIdFromAxiosError(err),
      cause: err,
    });
  }

  return new AppError({
    code: ErrorCodes.UNKNOWN,
    message: err instanceof Error ? err.message : "Unknown error",
    upstream,
    retryable: false,
    cause: err,
  });
}

