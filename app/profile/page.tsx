"use client";

import Link from "next/link";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";
import { useApp } from "@/app/context/AppContext";

function ProfileContent() {
  const { user, signOut, lookbooks, collections } = useApp();

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain className="max-w-2xl space-y-8">
        <header>
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Profile</p>
          <h1 className="mt-2 font-display text-3xl text-ivory md:text-4xl">
            {user?.name ?? "Member"}
          </h1>
          <p className="mt-2 text-sm text-muted">{user?.email ?? "Guest session"}</p>
          {user?.isGuest && (
            <p className="mobile-card mt-4 p-4 text-sm text-accent">
              Guest mode — saved lookbooks are temporary. Create an account to keep your Archive.
            </p>
          )}
        </header>

        <section>
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted">Account</p>
          <div className="mobile-settings-group">
            <div className="mobile-settings-row">
              <span className="text-muted">Currency</span>
              <span className="text-ivory">{user?.preferredCurrency ?? "USD"}</span>
            </div>
            <div className="mobile-settings-row">
              <span className="text-muted">Saved lookbooks</span>
              <span className="text-ivory">{lookbooks.length}</span>
            </div>
            <div className="mobile-settings-row">
              <span className="text-muted">Collections</span>
              <span className="text-ivory">{collections.length}</span>
            </div>
            <div className="mobile-settings-row">
              <span className="text-muted">Sign-in</span>
              <span className="text-ivory">{user?.authProvider ?? "—"}</span>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted">Actions</p>
          <div className="mobile-settings-group">
            <Link href="/archive" className="mobile-settings-row text-ivory active:bg-smoke/20">
              My Archive
              <span className="text-muted">→</span>
            </Link>
            <Link
              href={
                process.env.NEXT_PUBLIC_BETA_FEEDBACK_URL ??
                "mailto:hello@archive411.studio?subject=Archive411%20Beta%20Feedback"
              }
              className="mobile-settings-row text-ivory active:bg-smoke/20"
            >
              Beta feedback
              <span className="text-muted">→</span>
            </Link>
            <Link href="/for-designers" className="mobile-settings-row text-ivory active:bg-smoke/20">
              For Designers
              <span className="text-muted">→</span>
            </Link>
          </div>
        </section>

        <div className="flex flex-wrap gap-4 pt-2">
          {!user?.isGuest ? (
            <EditorialButton variant="ghost" onClick={() => void signOut()}>
              Sign out
            </EditorialButton>
          ) : (
            <EditorialButton href="/auth">Create account</EditorialButton>
          )}
        </div>

        <footer className="border-t border-smoke/30 pt-8 text-sm text-muted">
          <p>archive.411 · @archive411.studio</p>
        </footer>
      </AppPageMain>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <ProfileContent />
    </RouteGuard>
  );
}
