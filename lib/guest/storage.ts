import type { SavedLookbookSession } from "@/app/types/domain";
import { STORAGE_KEYS } from "@/app/types/domain";

export const GUEST_ID_KEY = "archive411-guest-id";

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "guest-ssr";
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function guestArchiveKey(guestId: string): string {
  return `${STORAGE_KEYS.archive}-${guestId}`;
}

export function readGuestLookbooks(guestId: string): SavedLookbookSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedLookbookSessions);
    const map: Record<string, SavedLookbookSession> = raw ? JSON.parse(raw) : {};
    const archiveRaw = localStorage.getItem(guestArchiveKey(guestId));
    const lookbookIds: string[] = archiveRaw ? JSON.parse(archiveRaw) : [];
    return lookbookIds
      .map((id) => map[id])
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function clearGuestData(guestId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(guestArchiveKey(guestId));
  localStorage.removeItem(GUEST_ID_KEY);
}

export async function migrateGuestLookbooksToAccount(): Promise<number> {
  if (typeof window === "undefined") return 0;
  const guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) return 0;

  const sessions = readGuestLookbooks(guestId);
  let migrated = 0;

  for (const session of sessions) {
    try {
      const res = await fetch("/api/lookbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lookbook: session.lookbook,
          looks: session.looks,
          method: session.method,
          buildPreferences: session.buildPreferences,
        }),
      });
      if (res.ok) migrated++;
    } catch {
      // continue migrating others
    }
  }

  if (migrated > 0) clearGuestData(guestId);
  return migrated;
}
