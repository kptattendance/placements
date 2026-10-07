import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutWrapper from "./components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KPT Placements | Training & Placement Cell",

  description:
    "Training & Placement Cell of Karnataka Government Polytechnic, Mangalore. Find placement opportunities, internships, recruitment information, and career updates for students.",

  keywords: [
    "KPT Placements",
    "KPT Mangalore Placements",
    "KPT Mangalore",
    "Karnataka Government Polytechnic Mangalore",
    "KPT Training and Placement Cell",
    "KPT Internship",
    "KPT Recruitment",
    "Polytechnic Placements",
    "Diploma Placements Mangalore",
    "KPT Students",
  ],

  authors: [
    {
      name: "Karnataka Government Polytechnic, Mangalore",
    },
  ],

  creator: "Karnataka Government Polytechnic, Mangalore",
  publisher: "Karnataka Government Polytechnic, Mangalore",

  metadataBase: new URL(
    "https://placements.kptmangaluru.in"
  ),

  alternates: {
    canonical: "https://placements.kptmangaluru.in",
  },

  openGraph: {
    title: "KPT Placements | Training & Placement Cell",

    description:
      "Official Training & Placement Cell portal of Karnataka Government Polytechnic, Mangalore.",

    url: "https://placements.kptmangaluru.in",

    siteName: "KPT Placements",

    locale: "en_IN",

    type: "website",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google Search Console Verification */}
          <meta
            name="google-site-verification"
            content="O67tWHY9xLUtBxSrAxCliKSiLNqr1KiTwmd_uKb_iVA"
          />

          {/* PWA */}
          <link rel="manifest" href="/manifest.json" />

          <meta
            name="theme-color"
            content="#004aad"
          />

          <link
            rel="apple-touch-icon"
            href="/icons/icon-192.png"
          />

          <meta
            name="apple-mobile-web-app-capable"
            content="yes"
          />

          <meta
            name="mobile-web-app-capable"
            content="yes"
          />
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 min-h-screen`}
        >
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}