"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { api, ApiError } from "@/lib/api";
import type { User } from "@/lib/types";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .me()
      .then((currentUser) => {
        if (mounted) setUser(currentUser);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login");
          return;
        }
        if (mounted) setError(err instanceof Error ? err.message : "Unable to load account.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper">
        <LoadingSpinner label="Checking your session" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <ErrorMessage message={error} />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar user={user} />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </>
  );
}
