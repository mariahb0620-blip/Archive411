export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EDITORIAL_EASE },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.4, ease: EDITORIAL_EASE },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EDITORIAL_EASE },
  },
};

export const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 30, stiffness: 300 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.3, ease: EDITORIAL_EASE },
  },
};

export const bottomSheetVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { type: "spring", damping: 32, stiffness: 340 },
  },
  exit: {
    y: "100%",
    transition: { duration: 0.28, ease: EDITORIAL_EASE },
  },
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const LOADING_PHRASES = [
  "Sourcing from the archives...",
  "Balancing luxury with accessibility...",
  "Curating your edit...",
  "Finalizing twelve looks...",
  "Refining the high-low mix...",
  "Selecting Macy's foundations...",
  "Elevating with luxury accents...",
];
