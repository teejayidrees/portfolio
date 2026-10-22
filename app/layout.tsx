import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmad.com.ng"),
  title: {
    default: "Ahmad Idris | Full-Stack Software Engineer",
    template: "%s | Ahmad Idris",
  },
  description:
    "Portfolio of Ahmad Idris, a Full-Stack Software Engineer specializing in modern web architectures (Next.js, PostgreSQL) and IoT integrations.",
  keywords: [
    "Ahmad Idris",
    "Software Engineer",
    "Full-Stack Developer",
    "Next.js Developer",
    "React",
    "Node.js",
    "IoT Developer",
    "Hardware Hacker",
    "Nigeria Developer",
  ],
  authors: [{ name: "Ahmad Idris", url: "https://ahmad.com.ng" }],
  creator: "Ahmad Idris",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ahmad.com.ng",
    title: "Ahmad Idris | Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer specializing in modern web architectures (Next.js, PostgreSQL) and IoT integrations.",
    siteName: "Ahmad Idris Portfolio",
    images: [
      {
        url: "/og-image.jpg", // Place an image named og-image.jpg in your public folder for link previews
        width: 1200,
        height: 630,
        alt: "Ahmad Idris Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Idris | Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer specializing in modern web architectures (Next.js, PostgreSQL) and IoT integrations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${jetbrains.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Analytics />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(240 8% 7%)",
                border: "1px solid hsl(240 6% 16%)",
                color: "hsl(210 20% 92%)",
                fontFamily: "var(--font-jetbrains), monospace",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}