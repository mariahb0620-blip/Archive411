"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import RouteGuard from "@/app/components/RouteGuard";
import EditorialButton from "@/app/components/EditorialButton";

function AuthContent() {
  const router = useRouter();
  const { signIn } = useApp();
  const [mode, setMode] = useState<"entry" | "email">("entry");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const enter = (provider: "email" | "google" | "guest") => {
    signIn({
      provider,
      email: provider === "email" ? email : undefined,
      name: name || undefined,
    });
    router.push("/home");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-ink px-6 py-20">
      <div className="mx-auto w-full max-w-md">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
          archive.411
        </p>
        <h1 className="mt-4 font-display text-4xl text-ivory">
          Enter your Archive
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Create an account with email to keep your Archive across visits. Guests
          can explore, generate looks, and save lookbooks on this device.
        </p>

        {mode === "entry" ? (
          <div className="mt-10 space-y-3">
            <EditorialButton onClick={() => setMode("email")} className="w-full">
              Create account with email
            </EditorialButton>
            <EditorialButton
              variant="ghost"
              onClick={() => {
                if (!email.trim()) {
                  setMode("email");
                  return;
                }
                enter("email");
              }}
              className="w-full"
            >
              Sign in with email
            </EditorialButton>
            <EditorialButton
              variant="ghost"
              onClick={() => enter("google")}
              className="w-full"
            >
              Continue with Google
            </EditorialButton>
            <button
              type="button"
              onClick={() => enter("guest")}
              className="touch-target w-full text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ivory"
            >
              Continue as guest
            </button>
          </div>
        ) : (
          <form
            className="mt-10 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              enter("email");
            }}
          >
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
                placeholder="you@email.com"
              />
            </label>
            <EditorialButton type="submit" className="w-full">
              Create account
            </EditorialButton>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <RouteGuard requireIntro requireAuth={false}>
      <AuthContent />
    </RouteGuard>
  );
}
