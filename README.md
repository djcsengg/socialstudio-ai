# SocialStudio AI

> **AI LinkedIn Carousel & Visual Hook Studio**  
> *Transform raw thoughts, bullet points, and articles into viral, high-converting LinkedIn slide carousels and companion X threads in 30 seconds.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-22%2F22%20Passing-brightgreen)](https://vitest.dev/)

---

## 1. Overview

**SocialStudio AI** is engineered for founders, solopreneurs, creators, and B2B marketers who want to dominate LinkedIn and X without hiring expensive design agencies or spending hours in Canva.

### Core Value Propositions
* **30-Second AI Transformation:** Input raw notes, blog links, or rough ideas. SocialStudio AI automatically structures them into hooked, multi-slide narratives engineered for LinkedIn's document algorithm.
* **4 High-Converting Visual Themes:** Instant switching between **Minimal Dark**, **Editorial Clean**, **Bold Punchy**, and **Gradient Glow** styling presets.
* **Pixel-Perfect PDF Export:** Generates crisp vector PDFs formatted for LinkedIn document carousels with 1-click download. Free exports include a discreet viral watermark; paid plans export watermark-free.
* **Companion X/Twitter Threads:** Automatically produces ready-to-post companion threads matched to the carousel's talking points to maximize cross-platform reach.
* **Self-Serve Monetization:** Built-in Stripe Checkout supporting the $49 Founder Lifetime Deal and $19/month Pro subscription, with webhook verification.
* **Zero-Friction Offline Fallbacks:** Operates seamlessly even without external API credentials using smart heuristic templates and mock checkout testing.

---

## 2. System Architecture

```
src/
├── app/
│   ├── page.tsx                     # Main Studio (Input, Preview & Live Deck Editor)
│   ├── layout.tsx                   # Root HTML layout and metadata
│   ├── globals.css                  # Custom styling & font definitions
│   ├── checkout/success/page.tsx    # Stripe payment confirmation & license activation
│   └── api/
│       ├── generate/route.ts        # AI Slide generation endpoint (Gemini + fallback)
│       ├── export-pdf/route.ts      # Server-side high-res PDF generation
│       ├── checkout/route.ts        # Stripe checkout session creation
│       ├── checkout/verify/route.ts # License verification endpoint
│       └── webhooks/stripe/route.ts # Webhook listener for payment events
├── components/
│   ├── Navbar.tsx                   # Header with Pro upgrade modal & theme controls
│   ├── StudioControls.tsx           # Topic/idea input, tone selector, slide count
│   ├── SlideDeck.tsx                # Multi-slide visual carousel manager
│   ├── SlidePreview.tsx             # Interactive slide card renderer
│   ├── CompanionThreadModal.tsx     # 1-click copy companion X thread
│   ├── PricingSection.tsx           # Lifetime & Monthly Pro upgrade cards
│   └── Footer.tsx                   # Footer & copyright
├── lib/
│   ├── ai.ts                        # Gemini API client & intelligent template engine
│   ├── pdf.ts                       # jsPDF vector carousel rendering engine
│   ├── themes.ts                    # Theme definitions (fonts, colors, contrast)
│   ├── stripe.ts                    # Stripe integration & webhook signature verification
│   ├── prisma.ts                    # Database client for users & generated decks
│   └── types.ts                     # TypeScript definitions for slides & themes
└── tests/                           # 22 automated unit & integration tests
```

---

## 3. Getting Started

### Prerequisites
* Node.js 18.17+ or Node.js 20+
* npm or pnpm

### Installation

1. Navigate to the project directory:
   ```bash
   cd fc40f234-e02f-4cc6-bb6a-322c61c4b86b/_default
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize local database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 4. Environment Variables

Create a `.env` file in the project root:

```env
# Google Gemini AI (Optional - falls back to smart templates if omitted)
GEMINI_API_KEY=""

# Stripe Billing (Optional - falls back to mock checkout if omitted)
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
```

---

## 5. Verification & Testing

Run the automated test suite with Vitest:

```bash
npm test
```

### Test Coverage Highlights
* `tests/ai.test.ts`: Validates topic parsing, slide structuring, and offline fallback generation.
* `tests/pdf.test.ts`: Verifies PDF formatting, multi-page layout, and watermark removal for Pro users.
* `tests/themes.test.ts`: Validates visual theme styling, palette contrast, and typography definitions.
* `tests/stripe.test.ts`: Verifies checkout session creation, webhook payload handling, and license activation.

---

## 6. Daily Wrap-Up & Git Protocol

In accordance with ATS company operating standards:
* Daily work wraps at **11:00 PM IST**.
* Prior to cutoff, all active updates are documented, README files verified, test suites executed, and changes pushed to respective GitHub repositories.
