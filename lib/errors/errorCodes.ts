export const ErrorCodes = {
  NETWORK: "NETWORK", // no connectivity / DNS / CORS / offline
  TIMEOUT: "TIMEOUT",
  UNAUTHORIZED: "UNAUTHORIZED", // 401
  FORBIDDEN: "FORBIDDEN", // 403
  NOT_FOUND: "NOT_FOUND", // 404
  RATE_LIMITED: "RATE_LIMITED", // 429
  VALIDATION: "VALIDATION", // 400/422
  SERVER: "SERVER", // 5xx
  PARSE: "PARSE", // response body didn't match schema (optional usage)
  ABORTED: "ABORTED", // AbortController / axios cancel
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

