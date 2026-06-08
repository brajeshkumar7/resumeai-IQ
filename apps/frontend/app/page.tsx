import { auth } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10 lg:px-12">
      <header className="flex items-center justify-between rounded-full border border-[var(--border)] bg-white/70 px-5 py-3 backdrop-blur">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--accent-alt)]">
            ResumeIQ AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isSignedIn ? (
            <>
            <SignInButton mode="modal">
              <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white">
                Get started
              </button>
            </SignUpButton>
            </>
          ) : (
            <>
            <Link
              href="/dashboard"
              prefetch={false}
              className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white"
            >
              Open dashboard
            </Link>
            <UserButton />
            </>
          )}
        </div>
      </header>

      <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--accent)]">
            Production auth foundation
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] [font-family:var(--font-heading)] md:text-7xl">
            Secure identity, protected dashboards, and a first-party user profile layer.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Users can sign in with email or Google, reach protected application routes, and manage
            their ResumeIQ profile through validated backend APIs backed by Clerk session tokens.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {!isSignedIn ? (
              <>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                Create account
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sign-in"
                className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold"
              >
                Sign in
              </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                Go to dashboard
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-white/75 p-8 shadow-[0_30px_80px_rgba(17,17,17,0.08)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Email and Google sign-in",
              "Protected dashboard routes",
              "JWT-secured backend APIs",
              "Persistent profile metadata",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-[var(--border)] bg-[#fcfbf7] p-4">
                <p className="text-sm font-medium leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
