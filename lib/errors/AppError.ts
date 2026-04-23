import type { ErrorCode } from "@/lib/errors/errorCodes";

export type AppErrorUpstream =
  | "reqres"
  | "dummyJson"
  | "weather"
  | "stocks"
  | "internal";

export class AppError extends Error {
  code: ErrorCode;
  httpStatus?: number;
  upstream: AppErrorUpstream;
  cause?: unknown;
  retryable: boolean;
  requestId?: string;

  constructor(init: {
    code: ErrorCode;
    message: string;
    upstream: AppErrorUpstream;
    httpStatus?: number;
    cause?: unknown;
    retryable?: boolean;
    requestId?: string;
  }) {
    super(init.message);
    this.name = "AppError";
    this.code = init.code;
    this.httpStatus = init.httpStatus;
    this.upstream = init.upstream;
    this.cause = init.cause;
    this.retryable = init.retryable ?? false;
    this.requestId = init.requestId;
  }
}

