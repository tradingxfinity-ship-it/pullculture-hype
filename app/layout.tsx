import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Rail from "@/components/layout/Rail";
import TopBar from "@/components/layout/TopBar";
import Announcement from "@/components/layout/Announcement";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic", "normal"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Pull Culture — Rip packs. Pull grails.", template: "%s — Pull Culture" },
  description:
    "Curated packs of graded sports and Pokémon cards. Provably fair odds, instant buyback, and a marketplace for the cards you actually want.",
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
          Skip to content
        </a>
        <AuthProvider>
          <Rail />
          <div className="lg:pl-rail">
            <Announcement />
            <TopBar />
            <main id="main">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
