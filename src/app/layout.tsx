import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialStudio AI — AI LinkedIn Carousel & Visual Hook Studio",
  description:
    "Transform raw thoughts, blog posts, and notes into high-converting LinkedIn carousels and companion Twitter threads in 30 seconds.",
  keywords: [
    "LinkedIn Carousel Generator",
    "AI LinkedIn Studio",
    "Visual Hook Generator",
    "Twitter Thread Generator",
    "LinkedIn PDF Creator",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
