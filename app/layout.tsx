import type { Metadata } from "next";
import "./globals.css";
import TtsWarmup from "@/components/TtsWarmup";
import AuthGate from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "Adrit Learns",
  description: "Senior KG Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TtsWarmup />
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
