"use client";

import { AppError } from "@/lib/errors/AppError";
import { ErrorCodes } from "@/lib/errors/errorCodes";

function friendlyMessage(err: unknown): string {
  if (err instanceof AppError) {
    switch (err.code) {
      case ErrorCodes.UNAUTHORIZED:
        return "You’re not authorized. Please sign in again.";
      case ErrorCodes.RATE_LIMITED:
        return "Rate limited. Please wait a moment and retry.";
      case ErrorCodes.NETWORK:
        return "Network error. Check your connection and retry.";
      case ErrorCodes.TIMEOUT:
        return "Request timed out. Please retry.";
      case ErrorCodes.VALIDATION:
        return "Invalid input. Please adjust and retry.";
      default:
        return err.message || "Something went wrong.";
    }
  }
  return err instanceof Error ? err.message : "Something went wrong.";
}

export function ErrorState({
  title = "Couldn’t load data",
  error,
  onRetry,
}: {
  title?: string;
  error: unknown;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{friendlyMessage(error)}</div>
      {onRetry ? (
        <button
          type="button"
          className="mt-3 inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
          onClick={onRetry}
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

