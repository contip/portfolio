import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import { Suspense } from "react";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Peter Conti | Software & Cloud Engineering Consultancy",
    template: "%s | Peter Conti Consulting",
  },
  description:
    "Lead-focused software and cloud engineering consultancy delivering platform modernization, cloud architecture, DevOps automation, and measurable product outcomes.",
  keywords: [
    "software engineering consultant",
    "cloud engineering consultant",
    "AWS architecture",
    "platform engineering",
    "DevOps consulting",
    "lead generation website",
    "technical case studies",
  ],
  authors: [{ name: "Peter Conti" }],
  creator: "Peter Conti",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Peter Conti Consulting",
    title: "Peter Conti | Software & Cloud Engineering Consultancy",
    description:
      "Technical execution for ambitious teams: cloud architecture, performance, reliability, and product delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peter Conti | Software & Cloud Engineering Consultancy",
    description:
      "Cloud and software engineering consultancy focused on outcomes and client growth.",
  },
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
      className={`${manrope.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <Suspense
            fallback={
              <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md">
                <div className="mx-auto flex h-[var(--nav-height)] max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                  <div className="h-6 w-32 animate-pulse rounded-full bg-muted/60" />
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-16 animate-pulse rounded-full bg-muted/50" />
                    <div className="h-9 w-24 animate-pulse rounded-full bg-muted/50" />
                  </div>
                </div>
              </header>
            }
          >
            <Nav />
          </Suspense>
          <main>{children}</main>
          <Suspense
            fallback={
              <footer className="border-t border-border/60 bg-card/70">
                <div className="container-art py-16">
                  <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
                    <div className="space-y-4">
                      <div className="h-8 w-40 animate-pulse rounded-full bg-muted/50" />
                      <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted/40" />
                      <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted/40" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-20 animate-pulse rounded-full bg-muted/40" />
                      <div className="h-4 w-24 animate-pulse rounded-full bg-muted/30" />
                      <div className="h-4 w-28 animate-pulse rounded-full bg-muted/30" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-20 animate-pulse rounded-full bg-muted/40" />
                      <div className="h-4 w-24 animate-pulse rounded-full bg-muted/30" />
                      <div className="h-4 w-28 animate-pulse rounded-full bg-muted/30" />
                    </div>
                  </div>
                </div>
              </footer>
            }
          >
            <Footer />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
