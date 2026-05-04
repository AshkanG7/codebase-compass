"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/Button";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

export function Navbar({ user }: { user?: User | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await api.logout();
      router.push("/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 font-semibold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-moss text-white">CC</span>
          <span>Codebase Compass</span>
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-mint sm:inline-flex" href="/dashboard">
                Dashboard
              </Link>
              <Link className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-mint sm:inline-flex" href="/settings">
                Settings
              </Link>
              <Button variant="ghost" onClick={handleLogout} disabled={busy}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-mint" href="/login">
                Login
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
