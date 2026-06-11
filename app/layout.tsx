import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/LanguageContext";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "HundredFold | 百福 — Insurance & Tax Services",
  description:
    "Independent insurance agency and tax practice. Life insurance, annuities, commercial insurance, travel insurance, and professional tax services — in English and Chinese.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
