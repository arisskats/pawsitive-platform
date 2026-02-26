import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";
import Sidebar from "@/src/components/layout/Sidebar";
import { LanguageProvider } from "@/src/components/i18n/LanguageProvider";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pawsitive Platform",
  description: "Pet wellness dashboard for health tracking, AI tools, and local community insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <LanguageProvider>
          <div className="min-h-screen md:flex">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
