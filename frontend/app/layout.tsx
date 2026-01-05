import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/icon.svg",
    },
  },
  title: "Recap - AI-Powered Document Assistant",
  description:
    "Chat with your documents, organize knowledge, and get instant summaries with Recap. Your personal AI research assistant.",
  keywords: [
    "AI",
    "Chatbot",
    "Document Analysis",
    "RAG",
    "PDF",
    "Knowledge Base",
    "Research",
  ],
  authors: [{ name: "Recap Team" }],
  openGraph: {
    title: "Recap - AI-Powered Document Assistant",
    description:
      "Chat with your documents, organize knowledge, and get instant summaries with Recap.",
    type: "website",
    locale: "en_US",
    siteName: "Recap",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recap - AI-Powered Document Assistant",
    description:
      "Chat with your documents, organize knowledge, and get instant summaries with Recap.",
  },
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
