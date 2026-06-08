import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <SignUp
        appearance={{
          elements: {
            card: "shadow-[0_30px_80px_rgba(17,17,17,0.1)]",
          },
        }}
      />
    </main>
  );
}
