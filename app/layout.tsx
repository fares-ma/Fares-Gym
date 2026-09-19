import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter, Cairo } from "next/font/google";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-latin",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fares Hub — لوحة فارس الشخصية",
  description: "لوحة التحكم الشخصية لمتابعة الجيم والتغذية والأنشطة",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fares Hub",
  },
  icons: {
    icon: "/character/avatar.png",
    apple: "/character/avatar.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body className={`${ibmPlexArabic.variable} ${inter.variable} ${cairo.variable} font-sans antialiased min-h-screen bg-[#0D0C0F] text-[#F1E9DD]`}>
        {children}
      </body>
    </html>
  );
}
