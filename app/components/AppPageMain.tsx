import type { ReactNode } from "react";

/** Consistent main area: safe-area top + space for bottom tab bar on mobile. */
export default function AppPageMain({
  children,
  className = "",
  stickyFooter = false,
}: {
  children: ReactNode;
  className?: string;
  /** Extra bottom padding when a StickyActionBar is used */
  stickyFooter?: boolean;
}) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`container-editorial mobile-page-top pb-mobile-nav md:pb-16 ${
        stickyFooter ? "pb-[calc(8.5rem+env(safe-area-inset-bottom))] md:pb-16" : ""
      } ${className}`}
    >
      {children}
    </main>
  );
}
