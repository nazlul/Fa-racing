import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SDKInitializer from "./SDKInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Road Rush",
  description: "Go fast in the right track",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://fa-roadrush.vercel.app/preview.png",
      button: {
        title: "Play Road Rush",
        action: {
          type: "launch_frame",
          name: "Road Rush",
          url: "https://fa-roadrush.vercel.app",
          splashImageUrl: "https://fa-roadrush.vercel.app/icon.png",
          splashBackgroundColor: "#1a1a2a"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SDKInitializer />
        {children}
      </body>
    </html>
  );
}
