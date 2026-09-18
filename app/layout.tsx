import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

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
      <body className={`${cairo.variable} font-sans antialiased min-h-screen bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
