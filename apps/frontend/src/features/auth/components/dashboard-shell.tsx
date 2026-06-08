"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getCurrentProfile, updateCurrentProfile } from "@/features/auth/api/profile";
import { syncSession } from "@/features/auth/api/session";

const profileSchema = z.object({
  firstName: z.string().max(120).nullable(),
  lastName: z.string().max(120).nullable(),
  imageUrl: z.string().url().nullable(),
  headline: z.string().max(180).optional(),
  targetRole: z.string().max(120).optional(),
  linkedInUrl: z.string().url().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function DashboardShell() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: null,
      lastName: null,
      imageUrl: null,
      headline: "",
      targetRole: "",
      linkedInUrl: "",
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!user?.primaryEmailAddress?.emailAddress) {
        throw new Error("Authenticated user email is unavailable.");
      }

      return syncSession(getToken, {
        email: user.primaryEmailAddress.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
        image_url: user.imageUrl,
      });
    },
  });
  const {
    mutateAsync: syncUserSession,
    isPending: isSyncPending,
    isSuccess: isSyncSuccess,
    error: syncError,
  } = syncMutation;

  const profileQuery = useQuery({
    queryKey: ["current-profile"],
    queryFn: async () => getCurrentProfile(getToken),
    enabled: isSyncSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) =>
      updateCurrentProfile(getToken, {
        first_name: values.firstName,
        last_name: values.lastName,
        image_url: values.imageUrl,
        profile_metadata: {
          headline: values.headline,
          target_role: values.targetRole,
          linkedin_url: values.linkedInUrl,
        },
      }),
    onSuccess: (profile) => {
      queryClient.setQueryData(["current-profile"], profile);
    },
  });
  const { isPending: isUpdatePending, isSuccess: isUpdateSuccess, error: updateError } =
    updateMutation;

  useEffect(() => {
    if (isLoaded && user && !isSyncPending && !isSyncSuccess) {
      void syncUserSession();
    }
  }, [isLoaded, isSyncPending, isSyncSuccess, syncUserSession, user]);

  const combinedError = (syncError ?? profileQuery.error ?? updateError) as Error | null;

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        firstName: profileQuery.data.first_name,
        lastName: profileQuery.data.last_name,
        imageUrl: profileQuery.data.image_url,
        headline: String(profileQuery.data.profile_metadata.headline ?? ""),
        targetRole: String(profileQuery.data.profile_metadata.target_role ?? ""),
        linkedInUrl: String(profileQuery.data.profile_metadata.linkedin_url ?? ""),
      });
    }
  }, [form, profileQuery.data]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 md:px-10 lg:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[var(--border)] bg-white/75 px-6 py-5 shadow-[0_30px_80px_rgba(17,17,17,0.08)]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--accent-alt)]">
            Authenticated Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] [font-family:var(--font-heading)]">
            Welcome back, {user?.firstName ?? "there"}.
          </h1>
        </div>
        <UserButton />
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-[2rem] border border-[var(--border)] bg-[#111111] p-6 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">Session Security</p>
          <div className="mt-4 space-y-4 text-sm leading-6 text-white/75">
            <p>Clerk middleware protects dashboard routes before rendering.</p>
            <p>The backend only accepts validated Clerk session JWTs.</p>
            <p>User profile data is stored in PostgreSQL, not inside oversized session claims.</p>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
                Profile Management
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                Resume intelligence account profile
              </h2>
            </div>
            {isUpdateSuccess ? (
              <span className="rounded-full bg-[var(--accent-alt)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Saved
              </span>
            ) : null}
          </div>

          {isSyncPending || profileQuery.isLoading ? (
            <p className="mt-6 text-sm text-[var(--muted)]">Loading your secure profile...</p>
          ) : null}

          {combinedError ? (
            <p className="mt-6 text-sm text-[var(--accent)]">{combinedError.message}</p>
          ) : null}

          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit(async (values) => {
              await updateMutation.mutateAsync(values);
            })}
          >
            <label className="grid gap-2 text-sm font-medium">
              First name
              <input
                className="rounded-2xl border border-[var(--border)] bg-[#fcfbf7] px-4 py-3"
                {...form.register("firstName", {
                  setValueAs: (value) => value || null,
                })}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Last name
              <input
                className="rounded-2xl border border-[var(--border)] bg-[#fcfbf7] px-4 py-3"
                {...form.register("lastName", {
                  setValueAs: (value) => value || null,
                })}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium md:col-span-2">
              Profile image URL
              <input
                className="rounded-2xl border border-[var(--border)] bg-[#fcfbf7] px-4 py-3"
                {...form.register("imageUrl", {
                  setValueAs: (value) => value || null,
                })}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium md:col-span-2">
              Headline
              <input
                className="rounded-2xl border border-[var(--border)] bg-[#fcfbf7] px-4 py-3"
                {...form.register("headline")}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Target role
              <input
                className="rounded-2xl border border-[var(--border)] bg-[#fcfbf7] px-4 py-3"
                {...form.register("targetRole")}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              LinkedIn URL
              <input
                className="rounded-2xl border border-[var(--border)] bg-[#fcfbf7] px-4 py-3"
                {...form.register("linkedInUrl")}
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isUpdatePending}
                className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isUpdatePending ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
