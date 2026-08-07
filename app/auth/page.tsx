"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/context/AppContext";
import RouteGuard from "@/app/components/RouteGuard";
import EditorialButton from "@/app/components/EditorialButton";

function AuthContent() {
  const router = useRouter();
  const { signIn, authError, supabaseEnabled } = useApp();
  const [mode, setMode] = useState<"entry" | "sign-up" | "sign-in">("entry");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitEmail = async (authMode: "sign-up" | "sign-in") => {
    setSubmitting(true);
    const ok = await signIn({
      provider: "email",
      email,
      password,
      name,
      mode: authMode,
    });
    setSubmitting(false);
    if (ok) router.push("/home");
  };

  return (
    <div
      className="flex min-h-[100dvh] flex-col justify-center bg-ink px-5 py-12"
      style={{ paddingTop: "max(3rem, env(safe-area-inset-top))", paddingBottom: "max(3rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto w-full max-w-md">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">
          archive.411
        </p>
        <h1 className="mt-4 font-display text-4xl text-ivory">
          Enter your Archive
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Create an account with email to sync your Archive across devices.
          Guests can explore and save lookbooks on this device only.
        </p>
        {!supabaseEnabled && (
          <p className="mt-3 text-xs text-accent">
            Supabase is not configured — using local device storage for this session.
          </p>
        )}

        {authError && (
          <p className="mt-4 text-sm text-accent" role="alert">
            {authError}
          </p>
        )}

        {mode === "entry" ? (
          <div className="mt-10 space-y-3">
            <EditorialButton onClick={() => setMode("sign-up")} className="w-full">
              Create account with email
            </EditorialButton>
            <EditorialButton
              variant="ghost"
              onClick={() => setMode("sign-in")}
              className="w-full"
            >
              Sign in with email
            </EditorialButton>
            <EditorialButton
              variant="ghost"
              onClick={() => void signIn({ provider: "google" })}
              className="w-full"
              disabled={!supabaseEnabled}
            >
              Continue with Google
            </EditorialButton>
            <button
              type="button"
              onClick={async () => {
                setSubmitting(true);
                const ok = await signIn({ provider: "guest" });
                setSubmitting(false);
                if (ok) router.push("/home");
              }}
              disabled={submitting}
              className="touch-target w-full text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ivory disabled:opacity-50"
            >
              Continue as guest
            </button>
          </div>
        ) : (
          <form
            className="mt-10 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await submitEmail(mode === "sign-up" ? "sign-up" : "sign-in");
            }}
          >
            {mode === "sign-up" && (
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
            )}
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
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Password
              </span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-smoke/60 bg-charcoal px-4 py-3 text-ivory"
                placeholder="Minimum 8 characters"
              />
            </label>
            <EditorialButton type="submit" className="w-full" disabled={submitting}>
              {submitting
                ? "Please wait..."
                : mode === "sign-up"
                  ? "Create account"
                  : "Sign in"}
            </EditorialButton>
            <button
              type="button"
              onClick={() => setMode("entry")}
              className="touch-target w-full text-xs uppercase tracking-[0.2em] text-muted hover:text-ivory"
            >
              Back
            </button>
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
