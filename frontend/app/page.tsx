import Link from "next/link";

import { Button } from "@/components/Button";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar user={null} />
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Secure codebase orientation</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-tight text-ink sm:text-6xl">
              RepoRadar
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              A full-stack app for getting a quick overview of an unfamiliar codebase.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button className="w-full sm:w-auto">Start mapping</Button>
              </Link>
              <Link href="/login">
                <Button className="w-full sm:w-auto" variant="secondary">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="rounded-md bg-ink p-5 font-mono text-sm text-mint">
              <p>project: My React App</p>
              <p>stack: Next.js, TypeScript, Tailwind</p>
              <p>entry: src/app/page.tsx</p>
              <p>risk: missing error boundary</p>
              <p>next: inspect auth flow</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Plain text only", "Secret redaction", "Cookie auth"].map((item) => (
                <div className="rounded-md bg-mint p-3 text-sm font-semibold text-moss" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
            {[
              ["Map structure", "Summaries cover architecture, data flow, run steps, and key files."],
              ["Ask in context", "Follow-up answers are grounded in uploaded files and saved analysis."],
              ["Stay careful", "Files are treated as untrusted text and never executed by the app."],
            ].map(([title, body]) => (
              <div className="rounded-lg border border-slate-200 bg-paper p-5" key={title}>
                <h2 className="text-lg font-semibold text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
