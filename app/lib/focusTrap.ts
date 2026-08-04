const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
  );
}

export function createFocusTrap(container: HTMLElement, onEscape?: () => void) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onEscape?.();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener("keydown", handleKeyDown);

  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}
