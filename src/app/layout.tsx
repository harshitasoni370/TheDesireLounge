import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Toast } from "@/components/common/Toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://thedesirelounge.com"),
  title: {
    default: "DESIRE SHEESHA LOUNGE | Eat. Chill. Play. 24/7 — Oud Metha, Dubai",
    template: "%s | DESIRE SHEESHA LOUNGE",
  },
  description:
    "DESIRE SHEESHA LOUNGE — Eat. Chill. Play. 24/7. Premium lounge, multi-cuisine food, live sports & gaming zone in Oud Metha, Dubai.",
  icons: {
    icon: [
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Great+Vibes&family=Roboto:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-brand-bg text-white antialiased home-page">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <MobileContactBar />
        <WhatsAppFloat />
        <Toast />
      </body>
    </html>
  );
}