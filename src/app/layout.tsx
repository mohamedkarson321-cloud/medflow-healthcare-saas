import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "@/providers/session-provider";
import { auth } from "@/lib/auth";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "MedFlow — Healthcare Management Platform",
    template: "%s | MedFlow",
  },
  description:
    "World-class clinic management platform trusted by leading healthcare providers. Streamline appointments, EMR, billing, and more.",
  keywords: [
    "clinic management",
    "healthcare software",
    "EMR",
    "electronic medical records",
    "appointment scheduling",
    "hospital management",
    "medical billing",
    "patient portal",
  ],
  authors: [{ name: "MedFlow", url: "https://medflow.health" }],
  creator: "MedFlow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medflow.health",
    title: "MedFlow — Healthcare Management Platform",
    description: "World-class clinic management software for modern healthcare providers.",
    siteName: "MedFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedFlow — Healthcare Management Platform",
    description: "World-class clinic management software for modern healthcare providers.",
    creator: "@medflow",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                classNames: {
                  toast: "!rounded-xl !shadow-card-lg !border-border",
                  title: "!font-semibold",
                },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
