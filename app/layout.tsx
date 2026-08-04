import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import MobileAppShell from "@/app/components/MobileAppShell";
import { AppProvider } from "@/app/context/AppContext";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://archive411.studio";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "ARCHIVE411 — Personal Style Registry",
  description:
    "Mobile-first fashion intelligence and high-low lookbook registry. Installable app for personal style discovery.",
  keywords: ["fashion", "styling", "editorial", "outfits", "lookbook"],
  applicationName: "ARCHIVE411",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ARCHIVE411",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${displayFont.variable} ${sansFont.variable} bg-ink font-sans text-ivory antialiased`}
      >
        <AppProvider>
          <MobileAppShell>{children}</MobileAppShell>
        </AppProvider>
      </body>
    </html>
  );
}
