# SocialStudio AI

> **AI LinkedIn Carousel & Visual Hook Studio**  
> *Transform raw thoughts, bullet points, and articles into viral, high-converting LinkedIn slide carousels and companion X threads in 30 seconds.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-32%2F32%20Passing-brightgreen)](https://vitest.dev/)

---

## 1. Overview

**SocialStudio AI** is engineered for founders, solopreneurs, creators, and B2B marketers who want to dominate LinkedIn and X without hiring expensive design agencies or spending hours in Canva.

### Core Value Propositions
* **30-Second AI Transformation:** Input raw notes, blog links, or rough ideas. SocialStudio AI automatically structures them into hooked, multi-slide narratives engineered for LinkedIn's document algorithm.
* **8 High-Converting Visual Themes:** Instant switching between **Modern Minimal**, **Dark Tech**, **Bold Gradient**, **Editorial Classic**, **Neo Brutalist**, **Emerald Growth**, **Crimson Bold**, and **Nordic Frost** styling presets.
* **Pixel-Perfect Vector PDF Export:** Generates crisp 1080x1350 (4:5) and 1080x1080 (1:1) vector PDFs formatted for LinkedIn document carousels with instant client-side download. Free exports include a discreet watermark; paid plans export watermark-free.
* **Companion X/Twitter Threads:** Automatically produces ready-to-post companion threads matched to the carousel's talking points to maximize cross-platform reach.
* **Self-Serve Monetization & Dual Pricing:**
  * **Creator Starter Pack ($9 / ₹499):** 35 high-res carousel exports, watermark-free, all 8 visual themes.
  * **Founder Lifetime Deal ($49 / ₹1,499):** 200 generations/year, custom brand kit, lifetime access.
  * **BYOK Lifetime License ($29 / ₹999):** Bring your own Gemini/OpenAI key for unlimited generations with zero AI markups.
  * **SocialStudio Pro ($19/mo / ₹999):** Flexible monthly recurring subscription.
* **Scalable Edge Infrastructure & Security:**
  * In-memory sliding window rate limiting on `/api/generate` (5 req/min for anonymous; 20 req/min for paid accounts).
  * Strict Zod schema validation on prompt payloads and model outputs.
  * Idempotent Stripe webhook deduplication via `WebhookEvent` table.
  * AI search optimization via `/llms.txt`, `sitemap.xml`, and JSON-LD structured metadata.
* **Zero-Friction Offline Fallbacks:** Operates seamlessly even without external API credentials using smart heuristic templates and mock checkout testing.

---

## 2. System Architecture

```
src/
├── app/
│   ├── page.tsx                     # Main Studio (Input, Preview & Live Deck Editor)
│   ├── layout.tsx                   # Root HTML layout, SEO/GEO metadata & JSON-LD
│   ├── sitemap.ts                   # Dynamic Next.js sitemap generator
│   ├── globals.css                  # Custom styling & font definitions
│   ├── checkout/success/page.tsx    # Stripe payment confirmation & license activation
│   └── api/
│       ├── generate/route.ts        # AI generation with rate limiting & credit checks
│       ├── export-pdf/route.ts      # Server-side high-res PDF generation fallback
│       ├── checkout/route.ts        # Stripe checkout session creation
│       ├── checkout/verify/route.ts # License verification endpoint
│       └── webhooks/stripe/route.ts # Idempotent webhook listener for payment events
├── components/
│   ├── Navbar.tsx                   # Header with Pro upgrade modal & theme controls
│   ├── StudioControls.tsx           # Topic/idea input, tone selector, slide count
│   ├── SlideDeck.tsx                # Multi-slide visual carousel manager
│   ├── SlidePreview.tsx             # Interactive slide card renderer
│   ├── CompanionThreadModal.tsx     # 1-click copy companion X thread
│   ├── PricingSection.tsx           # 4-tier monetization cards (Starter, LTD, BYOK, Pro)
│   └── Footer.tsx                   # Footer & copyright
├── lib/
│   ├── ai.ts                        # Gemini API client & intelligent template engine
│   ├── pdf.ts                       # jsPDF vector carousel rendering engine
│   ├── rate-limit.ts                # In-memory sliding window edge rate limiter
│   ├── themes.ts                    # 8 visual theme presets (fonts, colors, contrast)
│   ├── stripe.ts                    # Stripe integration & webhook signature verification
│   ├── prisma.ts                    # Database client for users & generated decks
│   └── types.ts                     # TypeScript definitions for slides & themes
├── public/
│   ├── llms.txt                     # Machine-readable documentation for AI search crawlers
│   └── robots.txt                   # Search crawler directives
└── tests/                           # 32 automated unit & integration tests
```

---

## 3. Getting Started

### Prerequisites
* Node.js 18.17+ or Node.js 20+
* npm or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize local database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Run development server:
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
* `tests/rate-limit.test.ts`: Verifies sliding-window rate limiting for anonymous and authenticated accounts.
* `tests/themes.test.ts`: Validates visual theme styling, palette contrast, and typography definitions for all 8 presets.
* `tests/stripe.test.ts`: Verifies checkout session creation, webhook payload handling, and license activation.

---

## 6. Daily Wrap-Up & Git Protocol

In accordance with ATS company operating standards:
* Daily work wraps at **11:00 PM IST**.
* Prior to cutoff, all active updates are documented, README files verified, test suites executed, and changes committed cleanly.
