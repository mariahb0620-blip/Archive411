"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "archive411-beta-banner-dismissed";

/** Set in Vercel: NEXT_PUBLIC_BETA_FEEDBACK_URL (Google Form, Tally, etc.) */
const FEEDBACK_URL =
  process.env.NEXT_PUBLIC_BETA_FEEDBACK_URL ??
  "mailto:hello@archive411.studio?subject=Archive411%20Beta%20Feedback";

export default function BetaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(DISMISS_KEY) !== "1");
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="border-b border-accent/30 bg-accent/5 px-4 py-3 md:px-6"
    >
      <div className="container-editorial flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs leading-relaxed text-ivory/90">
          <span className="font-medium uppercase tracking-[0.15em] text-accent">
            Beta
          </span>
          {" · "}
          Product data is mock for testing. Try Build My Look or Search — then tell
          us what worked.
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <a
            href={FEEDBACK_URL}
            target={FEEDBACK_URL.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] text-accent hover:underline"
          >
            Send feedback
          </a>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(DISMISS_KEY, "1");
              setVisible(false);
            }}
            className="text-[10px] uppercase tracking-[0.15em] text-muted hover:text-ivory"
            aria-label="Dismiss beta notice"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
