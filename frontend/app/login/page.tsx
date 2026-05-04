import Link from "next/link";

import { AuthForm } from "@/components/AuthForm";
import { Navbar } from "@/components/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar user={null} />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-ink">Welcome back</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Login to continue mapping your projects.</p>
          <div className="mt-8">
            <AuthForm mode="login" />
          </div>
          <p className="mt-5 text-sm text-slate-600">
            New here?{" "}
            <Link className="font-semibold text-moss" href="/signup">
              Create an account
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
