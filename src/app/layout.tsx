"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {siteConfig} from "@/config/site.config";
import {Providers} from "@/providers/providers";
import {Toaster} from "@/components/ui/sonner";
import {Footer} from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
    
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased dark:bg-[#212121]`}
      >
        <Providers>{children}
          <div className="w-full flex justify-center"><Toaster/></div></Providers>
      </body>
    </html>
  );
}
