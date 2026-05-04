import Link from "next/link";

import { AuthForm } from "@/components/AuthForm";
import { Navbar } from "@/components/Navbar";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar user={null} />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-ink">Create your account</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your session is stored in an httpOnly cookie. The frontend never stores JWTs in localStorage.
          </p>
          <div className="mt-8">
            <AuthForm mode="signup" />
          </div>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-moss" href="/login">
              Login
            </Link>
          </p>
        </section>
        <section className="rounded-lg bg-mint p-8">
          <h2 className="text-2xl font-bold text-ink">A calmer first pass through unfamiliar code.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Create projects, add files, run analysis, and keep question history attached to the codebase.
          </p>
        </section>
      </main>
    </div>
  );
}
