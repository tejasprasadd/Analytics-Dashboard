"use client";

import * as React from "react";

//Catches Rendering errors.
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state: { hasError: boolean; error?: Error } = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      this.props.fallback ?? (
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="text-sm font-semibold">Something went wrong</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {this.state.error?.message ?? "Unknown error"}
          </div>
          <button
            className="mt-4 inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
            onClick={() => this.setState({ hasError: false, error: undefined })}
            type="button"
          >
            Try again
          </button>
        </div>
      )
    );
  }
}

