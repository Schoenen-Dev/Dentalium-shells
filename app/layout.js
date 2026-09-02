// =====================================================================
//  REPLACE:  app/layout.js
//  Only change: NoticeHost is mounted once, so toasts and confirm
//  dialogs work on every page.
// =====================================================================

import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import NoticeHost from "@/components/Notice";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Dentalium Shells — Authentic Tusk Shells & Coastal Jewelry",
  description:
    "Hand-curated dentalium tusk shells, heirloom seashell jewelry and coastal decor. Sustainably sourced. Worldwide shipping.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#FBF7F1] text-[#1a2a3a]">
        {children}

        <NoticeHost />
      </body>
    </html>
  );
}
