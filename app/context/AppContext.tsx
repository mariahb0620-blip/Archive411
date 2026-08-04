"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ArchiveCollection,
  AuthProvider,
  BuildLookAnswers,
  Look,
  Lookbook,
  SavedItem,
  SavedLookbookSession,
  User,
} from "@/app/types/domain";
import { STORAGE_KEYS } from "@/app/types/domain";
import { persistLookbookToArchive } from "@/app/services/lookbook.service";

interface SessionState {
  user: User | null;
  introComplete: boolean;
  lookbooks: Lookbook[];
  collections: ArchiveCollection[];
  savedItems: SavedItem[];
}

interface AppContextValue extends SessionState {
  isLoading: boolean;
  isAuthenticated: boolean;
  completeIntro: () => void;
  signIn: (params: {
    email?: string;
    name?: string;
    provider: AuthProvider;
  }) => void;
  signOut: () => void;
  saveLookbook: (
    lookbook: Lookbook,
    session?: Pick<SavedLookbookSession, "looks" | "method" | "buildPreferences">
  ) => void;
  createCollection: (name: string, description?: string) => ArchiveCollection;
  addToCollection: (
    itemId: string,
    type: SavedItem["type"],
    collectionId: string
  ) => void;
}

const defaultUser = (
  provider: AuthProvider,
  email?: string,
  name?: string
): User => {
  const normalizedEmail = email?.trim().toLowerCase();
  const id =
    provider === "guest"
      ? `guest-${Date.now()}`
      : normalizedEmail
        ? `user-${normalizedEmail}`
        : `user-${Date.now()}`;

  return {
    id,
    email: normalizedEmail,
    name: name ?? (provider === "guest" ? "Guest" : "Member"),
    preferredCurrency: "USD",
    preferences: {
      sizes: [],
      aesthetics: [],
      silhouettePreferences: [],
      colorPreferences: [],
      independentDesignersOnly: false,
    },
    onboardingStatus: "complete",
    authProvider: provider,
    isGuest: provider === "guest",
    createdAt: new Date().toISOString(),
  };
};

function archiveStorageKey(userId: string) {
  return `${STORAGE_KEYS.archive}-${userId}`;
}

function collectionsStorageKey(userId: string) {
  return `${STORAGE_KEYS.collections}-${userId}`;
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [collections, setCollections] = useState<ArchiveCollection[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    setIntroComplete(readStorage(STORAGE_KEYS.onboarding, false));
    const sessionUser = readStorage<User | null>(STORAGE_KEYS.session, null);
    setUser(sessionUser);
    if (sessionUser) {
      setLookbooks(readStorage(archiveStorageKey(sessionUser.id), []));
      setCollections(readStorage(collectionsStorageKey(sessionUser.id), []));
    }
    setSavedItems(readStorage(STORAGE_KEYS.savedItems, []));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) writeStorage(STORAGE_KEYS.onboarding, introComplete);
  }, [introComplete, isLoading]);

  useEffect(() => {
    if (!isLoading) writeStorage(STORAGE_KEYS.session, user);
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading && user) {
      writeStorage(archiveStorageKey(user.id), lookbooks);
      writeStorage(collectionsStorageKey(user.id), collections);
    }
  }, [lookbooks, collections, user, isLoading]);

  useEffect(() => {
    if (!isLoading) writeStorage(STORAGE_KEYS.savedItems, savedItems);
  }, [savedItems, isLoading]);

  const completeIntro = useCallback(() => setIntroComplete(true), []);

  const signIn = useCallback(
    ({ email, name, provider }: { email?: string; name?: string; provider: AuthProvider }) => {
      const nextUser = defaultUser(provider, email, name);
      setUser(nextUser);
      setLookbooks(readStorage(archiveStorageKey(nextUser.id), []));
      setCollections(readStorage(collectionsStorageKey(nextUser.id), []));
    },
    []
  );

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.session);
  }, []);

  const saveLookbook = useCallback(
    (
      lookbook: Lookbook,
      session?: Pick<SavedLookbookSession, "looks" | "method" | "buildPreferences">
    ) => {
      if (!user) return;
      const saved: Lookbook = {
        ...lookbook,
        userId: user.id,
        saved: true,
        buildPreferences: session?.buildPreferences ?? lookbook.buildPreferences,
      };
      setLookbooks((prev) => {
        const exists = prev.find((l) => l.id === saved.id);
        return exists
          ? prev.map((l) => (l.id === saved.id ? saved : l))
          : [saved, ...prev];
      });
      if (session?.looks) {
        persistLookbookToArchive({
          lookbook: saved,
          looks: session.looks,
          method: session.method,
          buildPreferences: session.buildPreferences,
        });
      }
      setSavedItems((prev) => [
        {
          id: `saved-${saved.id}`,
          userId: user.id,
          type: "lookbook",
          referenceId: saved.id,
          collectionIds: saved.collectionIds,
          savedAt: new Date().toISOString(),
        },
        ...prev.filter((p) => p.referenceId !== saved.id),
      ]);
    },
    [user]
  );

  const createCollection = useCallback(
    (name: string, description?: string) => {
      if (!user) throw new Error("Sign in required");
      const collection: ArchiveCollection = {
        id: `col-${Date.now()}`,
        userId: user.id,
        name,
        description,
        createdAt: new Date().toISOString(),
        visibility: "private",
      };
      setCollections((prev) => [collection, ...prev]);
      return collection;
    },
    [user]
  );

  const addToCollection = useCallback(
    (itemId: string, type: SavedItem["type"], collectionId: string) => {
      if (!user) return;
      setSavedItems((prev) => {
        const existing = prev.find(
          (s) => s.referenceId === itemId && s.type === type
        );
        if (existing) {
          return prev.map((s) =>
            s.id === existing.id
              ? {
                  ...s,
                  collectionIds: [...new Set([...s.collectionIds, collectionId])],
                }
              : s
          );
        }
        return [
          {
            id: `saved-${itemId}-${Date.now()}`,
            userId: user.id,
            type,
            referenceId: itemId,
            collectionIds: [collectionId],
            savedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    },
    [user]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      introComplete,
      lookbooks,
      collections,
      savedItems,
      isLoading,
      isAuthenticated: Boolean(user),
      completeIntro,
      signIn,
      signOut,
      saveLookbook,
      createCollection,
      addToCollection,
    }),
    [
      user,
      introComplete,
      lookbooks,
      collections,
      savedItems,
      isLoading,
      completeIntro,
      signIn,
      signOut,
      saveLookbook,
      createCollection,
      addToCollection,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
