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
  Lookbook,
  SavedItem,
  SavedLookbookSession,
  User,
} from "@/app/types/domain";
import { STORAGE_KEYS } from "@/app/types/domain";
import { persistLookbookToArchive } from "@/app/services/lookbook.service";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  fetchUserLookbooks,
  saveLookbookToApi,
} from "@/app/services/archive.api";
import {
  getOrCreateGuestId,
  guestArchiveKey,
  migrateGuestLookbooksToAccount,
} from "@/lib/guest/storage";

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
  supabaseEnabled: boolean;
  authError: string | null;
  completeIntro: () => void;
  signIn: (params: {
    email?: string;
    password?: string;
    name?: string;
    provider: AuthProvider;
    mode?: "sign-up" | "sign-in";
  }) => Promise<boolean>;
  signOut: () => Promise<void>;
  saveLookbook: (
    lookbook: Lookbook,
    session?: Pick<SavedLookbookSession, "looks" | "method" | "buildPreferences">
  ) => Promise<void>;
  refreshArchive: () => Promise<void>;
  createCollection: (name: string, description?: string) => ArchiveCollection;
  addToCollection: (
    itemId: string,
    type: SavedItem["type"],
    collectionId: string
  ) => void;
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

function mapSupabaseUser(
  authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> },
  provider: AuthProvider
): User {
  return {
    id: authUser.id,
    email: authUser.email,
    name:
      (authUser.user_metadata?.name as string) ??
      authUser.email?.split("@")[0] ??
      "Member",
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
    isGuest: false,
    createdAt: new Date().toISOString(),
  };
}

function guestUser(guestId: string, name?: string): User {
  return {
    id: guestId,
    name: name ?? "Guest",
    preferredCurrency: "USD",
    preferences: {
      sizes: [],
      aesthetics: [],
      silhouettePreferences: [],
      colorPreferences: [],
      independentDesignersOnly: false,
    },
    onboardingStatus: "complete",
    authProvider: "guest",
    isGuest: true,
    createdAt: new Date().toISOString(),
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [collections, setCollections] = useState<ArchiveCollection[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const supabaseEnabled = isSupabaseConfigured();

  const loadGuestArchive = useCallback((guestId: string) => {
    setLookbooks(readStorage(guestArchiveKey(guestId), []));
    setCollections(readStorage(`${STORAGE_KEYS.collections}-${guestId}`, []));
  }, []);

  const refreshArchive = useCallback(async () => {
    if (!user || user.isGuest || !supabaseEnabled) return;
    try {
      const lbs = await fetchUserLookbooks();
      setLookbooks(lbs);
    } catch {
      // keep local state
    }
  }, [user, supabaseEnabled]);

  useEffect(() => {
    async function init() {
      setIntroComplete(readStorage(STORAGE_KEYS.onboarding, false));

      if (supabaseEnabled) {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const mapped = mapSupabaseUser(authUser, "email");
          setUser(mapped);
          try {
            const lbs = await fetchUserLookbooks();
            setLookbooks(lbs);
          } catch {
            setLookbooks([]);
          }
          setIsLoading(false);
          return;
        }
      }

      const legacy = readStorage<User | null>(STORAGE_KEYS.session, null);
      if (legacy?.isGuest) {
        setUser(legacy);
        loadGuestArchive(legacy.id);
      } else if (legacy && !supabaseEnabled) {
        setUser(legacy);
        setLookbooks(readStorage(`${STORAGE_KEYS.archive}-${legacy.id}`, []));
      }

      setSavedItems(readStorage(STORAGE_KEYS.savedItems, []));
      setIsLoading(false);
    }
    init();
  }, [supabaseEnabled, loadGuestArchive]);

  useEffect(() => {
    if (!isLoading) writeStorage(STORAGE_KEYS.onboarding, introComplete);
  }, [introComplete, isLoading]);

  useEffect(() => {
    if (!isLoading && user?.isGuest) {
      writeStorage(STORAGE_KEYS.session, user);
      writeStorage(guestArchiveKey(user.id), lookbooks);
    }
  }, [lookbooks, user, isLoading]);

  const completeIntro = useCallback(() => setIntroComplete(true), []);

  const signIn = useCallback(
    async ({
      email,
      password,
      name,
      provider,
      mode = "sign-up",
    }: {
      email?: string;
      password?: string;
      name?: string;
      provider: AuthProvider;
      mode?: "sign-up" | "sign-in";
    }) => {
      setAuthError(null);

      if (provider === "guest") {
        const guestId = getOrCreateGuestId();
        const nextUser = guestUser(guestId, name);
        setUser(nextUser);
        loadGuestArchive(guestId);
        writeStorage(STORAGE_KEYS.session, nextUser);
        return true;
      }

      if (provider === "google") {
        if (!supabaseEnabled) {
          setAuthError("Google sign-in requires Supabase configuration.");
          return false;
        }
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          setAuthError(error.message);
          return false;
        }
        return true;
      }

      const normalizedEmail = email?.trim().toLowerCase();
      if (!normalizedEmail || !password) {
        setAuthError("Email and password are required.");
        return false;
      }

      if (supabaseEnabled) {
        const supabase = createClient();
        let authUser;

        if (mode === "sign-up") {
          const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: { data: { name: name ?? normalizedEmail.split("@")[0] } },
          });
          if (error) {
            setAuthError(error.message);
            return false;
          }
          authUser = data.user;
          if (!authUser) {
            setAuthError("Check your email to confirm your account, then sign in.");
            return false;
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });
          if (error) {
            setAuthError(error.message);
            return false;
          }
          authUser = data.user;
        }

        if (!authUser) return false;

        await migrateGuestLookbooksToAccount();
        const mapped = mapSupabaseUser(authUser, "email");
        setUser(mapped);
        localStorage.removeItem(STORAGE_KEYS.session);
        const lbs = await fetchUserLookbooks();
        setLookbooks(lbs);
        return true;
      }

      // Offline fallback when Supabase is not configured
      const fallback = guestUser(`user-${normalizedEmail}`, name ?? "Member");
      fallback.email = normalizedEmail;
      fallback.authProvider = "email";
      fallback.isGuest = false;
      fallback.id = `user-${normalizedEmail}`;
      setUser(fallback);
      setLookbooks(readStorage(`${STORAGE_KEYS.archive}-${fallback.id}`, []));
      writeStorage(STORAGE_KEYS.session, fallback);
      return true;
    },
    [supabaseEnabled, loadGuestArchive]
  );

  const signOut = useCallback(async () => {
    if (supabaseEnabled) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setLookbooks([]);
    localStorage.removeItem(STORAGE_KEYS.session);
  }, [supabaseEnabled]);

  const saveLookbook = useCallback(
    async (
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

      if (session?.looks) {
        persistLookbookToArchive({
          lookbook: saved,
          looks: session.looks,
          method: session.method,
          buildPreferences: session.buildPreferences,
        });
      }

      if (!user.isGuest && supabaseEnabled && session?.looks) {
        try {
          await saveLookbookToApi({
            lookbook: saved,
            looks: session.looks,
            method: session.method,
            buildPreferences: session.buildPreferences,
          });
        } catch (err) {
          console.error("Save to API failed", err);
        }
      }

      setLookbooks((prev) => {
        const exists = prev.find((l) => l.id === saved.id);
        return exists
          ? prev.map((l) => (l.id === saved.id ? saved : l))
          : [saved, ...prev];
      });

      if (user.isGuest) {
        writeStorage(guestArchiveKey(user.id), [
          saved,
          ...readStorage<Lookbook[]>(guestArchiveKey(user.id), []).filter(
            (l) => l.id !== saved.id
          ),
        ]);
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
    [user, supabaseEnabled]
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
      supabaseEnabled,
      authError,
      completeIntro,
      signIn,
      signOut,
      saveLookbook,
      refreshArchive,
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
      supabaseEnabled,
      authError,
      completeIntro,
      signIn,
      signOut,
      saveLookbook,
      refreshArchive,
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
