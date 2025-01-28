import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  title: "YKS Net Hesaplama | TYT ve AYT Net Hesaplama Aracı",
  description: "YKS sınavı için TYT ve AYT net hesaplama aracı. Doğru ve yanlış sayılarınızı girerek netlerinizi ve puan türlerinize göre toplam netlerinizi hesaplayın.",
  keywords: "YKS, TYT, AYT, net hesaplama, YKS net hesaplama, TYT net hesaplama, AYT net hesaplama, üniversite sınavı",
  authors: [{ name: "Net Hesaplama" }],
  creator: "Net Hesaplama",
  publisher: "Net Hesaplama",
  metadataBase: new URL("https://net-hesaplama.vercel.app"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://net-hesaplama.vercel.app",
    title: "YKS Net Hesaplama | TYT ve AYT Net Hesaplama Aracı",
    description: "YKS sınavı için TYT ve AYT net hesaplama aracı. Doğru ve yanlış sayılarınızı girerek netlerinizi hesaplayın.",
    siteName: "YKS Net Hesaplama"
  },
  twitter: {
    card: "summary_large_image",
    title: "YKS Net Hesaplama | TYT ve AYT Net Hesaplama Aracı",
    description: "YKS sınavı için TYT ve AYT net hesaplama aracı. Doğru ve yanlış sayılarınızı girerek netlerinizi hesaplayın."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      </head>
      <body className={`${GeistSans.className} min-h-screen bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
