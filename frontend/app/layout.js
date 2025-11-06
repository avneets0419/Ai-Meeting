/* eslint-disable @next/next/no-page-custom-font */
import { Geist, Geist_Mono } from "next/font/google";
import { Readex_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { HeroUIProvider } from "@heroui/system";
import { SpeedInsights } from '@vercel/speed-insights/next';


const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-readex-pro",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Meet Wise ",
  description: "You AI Meeting Buddy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* If using Google Fonts import for ReadexPro, keep this */}
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@160..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${readexPro.variable} antialiased`}
      >
        <Providers>
          <HeroUIProvider>{children}
            <SpeedInsights/></HeroUIProvider></Providers>
      </body>
    </html>
  );
}
