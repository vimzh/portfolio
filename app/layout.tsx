import { Schibsted_Grotesk, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { MetaColor } from "@/components/MetaColor";
import { SelectionColor } from "@/components/SelectionColor";
import { ThemeProvider } from "@/components/ThemeProvider";
import { routes } from "@/content/routes";
import { site } from "@/content/site";
import { user } from "@/content/user";
import { getProfileJsonLd } from "@/lib/json-ld";
import { metaThemeColors } from "@/lib/theme";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

import type { Metadata, Viewport } from "next";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const eightiesComeback = localFont({
  src: "./fonts/EightiesComebackVAR-Regular.ttf",
  variable: "--font-eighties-comeback",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.browserTitle,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  alternates: {
    canonical: routes.home,
  },
  authors: [{ name: user.name, url: user.accounts.x.href }],
  creator: user.name,
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
    creator: user.accounts.x.handle,
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
      className={`${schibstedGrotesk.variable} ${geistMono.variable} ${eightiesComeback.variable} antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-dvh flex-col">
        <JsonLd data={getProfileJsonLd()} />
        <SelectionColor />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
