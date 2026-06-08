import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-[0_30px_80px_rgba(17,17,17,0.1)]",
          },
        }}
      />
    </main>
  );
}
