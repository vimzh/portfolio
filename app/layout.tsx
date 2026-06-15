import { Schibsted_Grotesk, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { MetaColor } from "@/components/MetaColor";
import { SelectionColor } from "@/components/SelectionColor";
import { ThemeProvider } from "@/components/ThemeProvider";
import { metaThemeColors, profile, site } from "@/lib/data";
import { getProfileJsonLd } from "@/lib/json-ld";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

import type { Metadata, Viewport } from "next";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: profile.name, url: profile.handleUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
    creator: profile.handle,
  },
};

export const viewport: Viewport = {
  themeColor: metaThemeColors.light,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${schibstedGrotesk.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={getProfileJsonLd()} />
        <SelectionColor />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          <MetaColor />
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
