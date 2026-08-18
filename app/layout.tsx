import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import TtsWarmup from "@/components/TtsWarmup";
import AuthGate from "@/components/AuthGate";

// Fredoka: rounded, playful, but still crisp at small sizes - reads as a
// designed kids'-app typeface instead of the generic system sans-serif
// every screen was using before.
const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: "Adrit Learns",
  description: "Senior KG Learning Platform",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Adrit Learns",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#e07b39",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fredoka.variable}>
      <body>
        <TtsWarmup />
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
