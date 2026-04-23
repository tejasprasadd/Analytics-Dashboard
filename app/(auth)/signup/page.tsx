"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/hooks/mutations/useRegisterMutation";
import { useAppSelector } from "@/store/hooks";

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error } = useAppSelector((s) => s.auth);
  const registerMutation = useRegisterMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  return (
    <main className="flex min-h-[calc(100vh-0px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mock signup using ReqRes. This does not create a real account.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            registerMutation.mutate({ email, password });
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
              autoComplete="new-password"
              placeholder="pistol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {(error || registerMutation.error) && (
            <p className="text-sm text-destructive">
              {error ?? (registerMutation.error as Error)?.message}
            </p>
          )}

          <Button
            className="w-full"
            type="submit"
            disabled={isLoading || registerMutation.isPending}
          >
            {isLoading || registerMutation.isPending ? "Creating..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

