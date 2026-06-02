import { Schibsted_Grotesk, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { SelectionColor } from "@/components/SelectionColor";
import { ThemeProvider } from "@/components/ThemeProvider";
import { profile, site } from "@/lib/data";
import "./globals.css";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1c" },
  ],
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
      className={`${schibstedGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SelectionColor />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
