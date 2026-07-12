import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SnowFans",
    template: "%s | SnowFans",
  },
  description: "專為中文語系滑雪愛好者打造的社群平台",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SnowFans",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
