import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import JsonLd from "@/components/json-ld";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Curt - Speed Reading Accelerated",
    template: "%s | Curt",
  },
  description:
    "Stream knowledge directly into your mind with RSVP technology. No eye movements. No distractions. Just pure signal.",
  metadataBase: new URL("https://curtt.vercel.app"), // Replace with actual domain if different
  keywords: [
    "speed reading",
    "RSVP",
    "rapid serial visual presentation",
    "productivity",
    "reading tool",
    "focus",
    "ADHD reading",
    "bionic reading",
  ],
  authors: [{ name: "Anant Singhal", url: "https://github.com/GithubAnant" }],
  creator: "Anant Singhal",
  publisher: "Anant Singhal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://curtt.vercel.app",
    title: "Curt - Speed Reading Accelerated",
    description:
      "Stream knowledge directly into your mind with RSVP technology. No eye movements. No distractions. Just pure signal.",
    siteName: "Curt",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or use a generic one
        width: 1200,
        height: 630,
        alt: "Curt - Speed Reading App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curt - Speed Reading Accelerated",
    description:
      "Stream knowledge directly into your mind with RSVP technology. No eye movements. No distractions. Just pure signal.",
    creator: "@anant_hq",
    images: ["/og-image.png"],
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
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://cdn.databuddy.cc/databuddy.js"
          data-client-id={process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID}
          data-track-hash-changes="true"
          data-track-attributes="true"
          data-track-interactions="true"
          crossOrigin="anonymous"
          async
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <JsonLd />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
