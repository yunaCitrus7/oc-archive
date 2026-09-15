import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNav from "./MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CITRUSODA · Splatoon OC Archive",
  description: "CITRUSODA 的 Splatoon 原創角色與故事檔案。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <MobileNav />
        <footer className="footer site-footer">
          <div className="brand"><span>CITRU</span>SODA</div>
          <p>ORIGINAL CHARACTER ARCHIVE · FAN WORK</p>
          <a href="/">BACK TO HOME ↑</a>
        </footer>
      </body>
    </html>
  );
}
