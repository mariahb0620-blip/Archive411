"use client";

import AppHeader from "@/app/components/AppHeader";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";
import { useApp } from "@/app/context/AppContext";

function ProfileContent() {
  const { user, signOut, lookbooks, collections } = useApp();

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <main id="main-content" tabIndex={-1} className="container-editorial max-w-2xl pt-24 pb-16 md:pt-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Profile</p>
        <h1 className="mt-4 font-display text-4xl text-ivory">{user?.name ?? "Member"}</h1>
        <p className="mt-2 text-sm text-muted">{user?.email ?? "Guest session"}</p>
        {user?.isGuest && (
          <p className="mt-4 text-sm text-accent">
            Guest mode — saved lookbooks are temporary. Create an account to keep your Archive.
          </p>
        )}

        <section className="mt-12 grid gap-4 border-y border-smoke/30 py-8">
          <Row label="Currency" value={user?.preferredCurrency ?? "USD"} />
          <Row label="Saved lookbooks" value={String(lookbooks.length)} />
          <Row label="Collections" value={String(collections.length)} />
          <Row label="Auth" value={user?.authProvider ?? "—"} />
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          {!user?.isGuest ? (
            <EditorialButton variant="ghost" onClick={signOut}>Sign out</EditorialButton>
          ) : (
            <EditorialButton href="/auth">Create account</EditorialButton>
          )}
          <EditorialButton variant="ghost" href="/archive">My Archive</EditorialButton>
          <EditorialButton
            variant="ghost"
            href={
              process.env.NEXT_PUBLIC_BETA_FEEDBACK_URL ??
              "mailto:hello@archive411.studio?subject=Archive411%20Beta%20Feedback"
            }
          >
            Beta feedback
          </EditorialButton>
        </div>

        <footer className="mt-20 border-t border-smoke/30 pt-8 text-sm text-muted">
          <p>archive.411 · @archive411.studio</p>
          <a href="/for-designers" className="mt-2 inline-block text-accent hover:text-ivory">
            For Designers →
          </a>
        </footer>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-ivory">{value}</span>
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
