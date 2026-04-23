"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/hooks/mutations/useLoginMutation";
import { useAppSelector } from "@/store/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error } = useAppSelector((s) => s.auth);
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  return (
    <main className="flex min-h-[calc(100vh-0px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mock auth using ReqRes. No real user security is implied.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate({ email, password });
          }}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="email"
              placeholder="eve.holt@reqres.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              type="password"
              autoComplete="current-password"
              placeholder="cityslicka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {(error || loginMutation.error) && (
            <p className="text-sm text-destructive">
              {error ?? (loginMutation.error as Error)?.message}
            </p>
          )}

          <Button className="w-full" type="submit" disabled={isLoading || loginMutation.isPending}>
            {isLoading || loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="text-primary underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

