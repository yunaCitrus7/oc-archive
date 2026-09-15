import type { Metadata } from "next";
import "./globals.css";
import MobileNav from "./MobileNav";
import {sitePath} from "./sitePath";

export const metadata: Metadata = {
  title: "CITRUSODA · Splatoon OC Archive",
  description: "CITRUSODA 的 Splatoon 原創角色與故事檔案。",
  icons: {
    icon: sitePath("/favicon.svg"),
    shortcut: sitePath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        {children}
        <MobileNav />
        <footer className="footer site-footer">
          <div className="brand"><span>CITRU</span>SODA</div>
          <p>ORIGINAL CHARACTER ARCHIVE · FAN WORK</p>
          <a href={sitePath("/")}>BACK TO HOME ↑</a>
        </footer>
      </body>
    </html>
  );
}
