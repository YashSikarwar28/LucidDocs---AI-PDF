// app/layout.js
import "./globals.css";
import { Open_Sans } from "next/font/google";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "LucidDocs",
  description: "AI PDF Chat & Summaries",
  icons: {
    icon: "/lll.png",
    shortcut: "/lll.png",
    apple: "/lll.png",
  },
  // Open Graph
  openGraph: {
    title: "LucidDocs - AI PDF Chat & Summaries",
    description:
      "Chat with your PDFs, get instant answers, and summarize long documents effortlessly — powered by AI.",
    url: "https://lucid-docs-ai-pdf.vercel.app",
    siteName: "LucidDocs",
    images: [
      {
        url: "https://raw.githubusercontent.com/YashSikarwar28/LucidDocs---AI-PDF/main/Screenshot%20(3).png",
        width: 1200,
        height: 630,
        alt: "LucidDocs — AI PDF Chat",
      },
    ],
    type: "website",
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image", 
    title: "LucidDocs - AI PDF Chat & Summaries",
    description:
      "Chat with your PDFs, get instant answers, and summarize long documents effortlessly — powered by AI.",
    images: [
      "https://raw.githubusercontent.com/YashSikarwar28/LucidDocs---AI-PDF/main/Screenshot%20(3).png",
    ],
    // Put your real twitter handle (no URL). Example: "@YashSikarwar28"
    creator: "@YashzzX",
    site: "@YashzzX",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={openSans.className}>
          <Provider>{children}</Provider>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}


