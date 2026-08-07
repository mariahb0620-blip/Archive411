"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "@/app/components/AppHeader";
import AppPageMain from "@/app/components/AppPageMain";
import EditorialButton from "@/app/components/EditorialButton";
import RouteGuard from "@/app/components/RouteGuard";

interface CollectionRow {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
}

function CollectionsContent() {
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => (r.ok ? r.json() : { collections: [] }))
      .then((d) => setCollections(d.collections ?? []))
      .finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      const { id } = await res.json();
      setCollections((c) => [
        { id, name: name.trim(), description: null, cover_image_url: null },
        ...c,
      ]);
      setName("");
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <AppHeader />
      <AppPageMain className="max-w-2xl space-y-8">
        <header>
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Archive</p>
          <h1 className="mt-2 font-display text-3xl text-ivory">Collections</h1>
          <p className="mt-2 text-sm text-muted">
            Organize saved lookbooks and pieces into private collections.
          </p>
        </header>

        <div className="mobile-card flex gap-3 p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New collection name"
            className="mobile-input flex-1"
          />
          <EditorialButton onClick={create}>Create</EditorialButton>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : collections.length === 0 ? (
          <p className="text-sm text-muted">No collections yet.</p>
        ) : (
          <div className="mobile-settings-group">
            {collections.map((col) => (
              <Link
                key={col.id}
                href="/archive"
                className="mobile-settings-row text-ivory active:bg-smoke/20"
              >
                {col.name}
                <span className="text-muted">→</span>
              </Link>
            ))}
          </div>
        )}

        <EditorialButton variant="ghost" href="/archive">
          Back to Archive
        </EditorialButton>
      </AppPageMain>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <RouteGuard requireIntro requireAuth>
      <CollectionsContent />
    </RouteGuard>
  );
}
