import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const serifFont = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — Coming Soon`,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#1c140d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serifFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
