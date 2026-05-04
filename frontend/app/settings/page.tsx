"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api, getApiUrl } from "@/lib/api";
import type { User } from "@/lib/types";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load settings."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-ink">Settings</h1>
        <ErrorMessage message={error} />
        {loading ? <LoadingSpinner label="Loading settings" /> : null}
        {user ? (
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">Account</h2>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-500">Email</dt>
                <dd className="mt-1 text-ink">{user.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Display name</dt>
                <dd className="mt-1 text-ink">{user.display_name || "Not set"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">API URL</dt>
                <dd className="mt-1 break-all text-ink">{getApiUrl()}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Auth storage</dt>
                <dd className="mt-1 text-ink">httpOnly cookie</dd>
              </div>
            </dl>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
