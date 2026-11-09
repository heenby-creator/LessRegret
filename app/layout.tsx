import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s · LessRegret",
  },
  description:
    "A paper-quiet deck of 57 regrets, kept beside the age when the choice is still open.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
};

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
