"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/Button";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Input } from "@/components/Input";
import { api } from "@/lib/api";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await api.signup({ email, password, display_name: displayName || undefined });
      } else {
        await api.login({ email, password });
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      {mode === "signup" ? (
        <Input label="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
      ) : null}
      <Input label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      <Input
        label="Password"
        type="password"
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button className="w-full" disabled={loading}>
        {loading ? "Working..." : mode === "signup" ? "Create account" : "Login"}
      </Button>
    </form>
  );
}
