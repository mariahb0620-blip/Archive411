"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DISMISS_KEY = "archive411-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (!isMobileDevice()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    setVisible(true);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const handleInstall = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      setVisible(false);
      localStorage.setItem(DISMISS_KEY, "1");
    }

    setInstallEvent(null);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Install ARCHIVE411 app"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[100] md:hidden"
        >
          <div className="border border-smoke/60 bg-charcoal/95 p-5 shadow-2xl backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">
              Install on your device
            </p>
            <p className="mt-2 text-base leading-relaxed text-ivory">
              {installEvent
                ? "Install ARCHIVE411 for one-tap access to your style registry — no browser required."
                : isIOS()
                  ? "Add to your Home Screen for the full app experience. Tap Share, then Add to Home Screen."
                  : "Install ARCHIVE411 on your home screen for faster, full-screen access to your looks."}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {installEvent ? (
                <button
                  type="button"
                  onClick={handleInstall}
                  className="touch-target flex-1 border border-accent bg-accent/10 text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/20"
                >
                  Install app
                </button>
              ) : (
                <button
                  type="button"
                  onClick={dismiss}
                  className="touch-target flex-1 border border-accent bg-accent/10 text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/20"
                >
                  {isIOS() ? "Show me how" : "Got it"}
                </button>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="touch-target border border-smoke/40 px-5 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ivory"
              >
                Continue in browser
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
