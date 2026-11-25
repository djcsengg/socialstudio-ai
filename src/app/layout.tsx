import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://socialstudio.ats.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SocialStudio AI — AI LinkedIn Carousel & Visual Hook Studio",
    template: "%s | SocialStudio AI",
  },
  description:
    "Transform raw thoughts, blog posts, and notes into high-converting LinkedIn carousels, crisp vector PDFs, and companion Twitter threads in 30 seconds.",
  keywords: [
    "LinkedIn Carousel Generator",
    "AI LinkedIn Studio",
    "Visual Hook Generator",
    "Twitter Thread Generator",
    "LinkedIn PDF Creator",
    "B2B Creator Tools",
    "Slide Deck Generator",
  ],
  authors: [{ name: "ATS Studio", url: siteUrl }],
  creator: "ATS Studio",
  publisher: "SocialStudio AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "SocialStudio AI — AI LinkedIn Carousel & Visual Hook Studio",
    description:
      "Generate high-converting LinkedIn slide decks and companion Twitter threads in 30 seconds. Instant vector PDF download.",
    siteName: "SocialStudio AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialStudio AI — AI LinkedIn Carousel & Visual Hook Studio",
    description:
      "Generate high-converting LinkedIn slide decks and companion Twitter threads in 30 seconds. Instant vector PDF download.",
    creator: "@ats_ai",
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
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SocialStudio AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        price: "9.00",
        priceCurrency: "USD",
        name: "Creator Starter Pack (35 credits)",
      },
      {
        "@type": "Offer",
        price: "49.00",
        priceCurrency: "USD",
        name: "Founder Lifetime Deal",
      },
    ],
    description:
      "AI-powered LinkedIn carousel and visual hook generator for creators and B2B founders.",
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased font-sans flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
