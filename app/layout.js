import "./globals.css";
import { Open_Sans } from "next/font/google";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"

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
  apple: "/lll.png"
}
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={openSans.className}>
          <Provider>{children}</Provider>
          <Toaster/>
          <Analytics/>
        </body>
      </html>
    </ClerkProvider>
  );
}
