"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { getPlatformMeta } from "@/features/system/api/get-platform-meta";
import { usePlatformStore } from "@/features/system/store/platform-store";
import { cn } from "@/lib/cn";

export function PlatformOverview() {
  const { selectedCapability, setSelectedCapability } = usePlatformStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["platform-meta"],
    queryFn: getPlatformMeta,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 md:px-10 lg:px-12">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[0_30px_80px_rgba(17,17,17,0.08)] backdrop-blur">
          <span className="font-medium uppercase tracking-[0.28em] text-[var(--accent-alt)]">
            Phase 1 Foundation
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] [font-family:var(--font-heading)] md:text-6xl">
            Resume intelligence infrastructure built for truthful optimization at scale.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
            This platform foundation connects a typed Next.js workspace with a service-layer
            FastAPI backend, real health contracts, and infrastructure ready for parsing,
            semantic matching, ATS analysis, and recruiter simulation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Truthful AI", "ATS-safe pipeline", "Semantic matching", "Recruiter feedback"].map(
              (pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-medium"
                >
                  {pill}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-[#111111] p-8 text-white shadow-[0_30px_80px_rgba(17,17,17,0.18)]">
          <p className="text-sm uppercase tracking-[0.25em] text-white/60">Platform Status</p>
          <div className="mt-5 space-y-4">
            <StatusRow label="API metadata" value={isLoading ? "Loading" : isError ? "Error" : "Live"} />
            <StatusRow
              label="Guardrails"
              value={data?.guardrails.length ? `${data.guardrails.length} active` : "Pending"}
            />
            <StatusRow
              label="Capabilities"
              value={data?.capabilities.length ? `${data.capabilities.length} mapped` : "Pending"}
            />
          </div>
          <p className="mt-6 text-sm leading-6 text-white/70">
            The backend exposes typed system contracts first so every later AI workflow can sit on
            top of observable, testable infrastructure.
          </p>
        </div>
      </motion.section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[var(--border)] bg-white/70 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Capabilities</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {data?.capabilities.map((capability) => {
              const selected = selectedCapability === capability;

              return (
                <Button
                  key={capability}
                  onClick={() => setSelectedCapability(selected ? null : capability)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition",
                    selected
                      ? "border-transparent bg-[var(--accent)] text-white"
                      : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--accent)]",
                  )}
                >
                  {capability}
                </Button>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Select a capability to keep product scope visible as we add deeper AI pipelines in the
            next phases.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-white/80 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent-alt)]">
            System Dependencies
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {data?.dependencies.map((dependency) => (
              <article
                key={dependency.name}
                className="rounded-3xl border border-[var(--border)] bg-[#fcfbf7] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold">{dependency.name}</h2>
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white">
                    {dependency.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{dependency.message}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-sm text-white/70">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
