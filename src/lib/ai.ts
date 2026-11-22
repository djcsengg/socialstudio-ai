import { GoogleGenerativeAI } from "@google/generative-ai";
import { CarouselData, GenerateCarouselRequest, SlideData } from "./types";

export async function generateCarouselWithAI(
  req: GenerateCarouselRequest
): Promise<CarouselData> {
  const topic = req.topic.trim();
  const rawText = req.rawText?.trim() || "";
  const framework = req.framework || "story";
  const aspectRatio = req.aspectRatio || "4:5";
  const theme = req.theme || "modern_minimal";
  const authorName = req.authorName?.trim() || "Founder & Creator";
  const authorHandle = req.authorHandle?.trim() || "@founder";
  const targetSlideCount = req.slideCount || 6;

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey && apiKey !== "mock_key") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const prompt = `You are an elite LinkedIn ghostwriter and visual carousel director specializing in 7-figure viral LinkedIn carousels and companion Twitter/X threads.

Create a high-converting ${targetSlideCount}-slide LinkedIn carousel and a companion Twitter thread based on the following input:

Topic / Goal: "${topic}"
${rawText ? `Source Context / Article:\n"""\n${rawText}\n"""\n` : ""}
Chosen Framework: "${framework}"
Target Audience: Founders, Executives, Tech Leaders, Builders, and Creators.

Format rules for slides:
- Slide 1 MUST be a high-stopping-power visual HOOK (bold headline, compelling subtitle, high curiosity).
- Middle slides MUST deliver punchy, actionable value with clear separation (tagline like 'STEP 1', 'INSIGHT', 'THE TRUTH', bold headline, concise 2-sentence body, 2-3 short bullet points, and an impactful highlight quote).
- Final slide MUST be a compelling CTA (Save this post, repost to help a colleague, follow ${authorHandle} for daily frameworks).
- Every slide title must be concise (under 8 words).
- Body text must be scannable and punchy.
- Output MUST be valid JSON adhering exactly to this JSON schema:

{
  "title": "Short title for the carousel deck",
  "topic": "${topic}",
  "slides": [
    {
      "slideNumber": 1,
      "slideType": "hook",
      "tagline": "SWIPE TO UNLOCK",
      "title": "Punchy hook headline",
      "body": "Opening sentence that creates immediate intrigue and states the big promise.",
      "bulletPoints": ["Key takeaway 1", "Key takeaway 2"],
      "highlight": "The 1 rule top 1% leaders never break"
    }
  ],
  "twitterThread": "1/7 The complete companion thread text formatted with emojis and numbered tweets..."
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
        return {
          title: parsed.title || topic,
          topic,
          framework,
          aspectRatio,
          theme,
          authorName,
          authorHandle,
          showWatermark: true,
          slides: parsed.slides.map((s: any, idx: number) => ({
            slideNumber: idx + 1,
            slideType: s.slideType || (idx === 0 ? "hook" : idx === parsed.slides.length - 1 ? "cta" : "content"),
            tagline: s.tagline || (idx === 0 ? "SWIPE ➔" : `SLIDE ${idx + 1}`),
            title: s.title || `Key Insight #${idx + 1}`,
            body: s.body || "",
            bulletPoints: Array.isArray(s.bulletPoints) ? s.bulletPoints : [],
            highlight: s.highlight || "",
          })),
          twitterThread: parsed.twitterThread || generateCompanionThread(topic, parsed.slides, authorHandle),
        };
      }
    } catch (err) {
      console.warn("Gemini generation failed or timed out, falling back to deterministic template engine:", err);
    }
  }

  // Robust fallback template generator tailored to framework & topic
  return generateDeterministicCarousel(req);
}

export function generateDeterministicCarousel(req: GenerateCarouselRequest): CarouselData {
  const topic = req.topic.trim() || "Building a High-Leverage Tech Business";
  const framework = req.framework || "story";
  const aspectRatio = req.aspectRatio || "4:5";
  const theme = req.theme || "modern_minimal";
  const authorName = req.authorName?.trim() || "Alex Mercer";
  const authorHandle = req.authorHandle?.trim() || "@alexmercer";

  let slides: SlideData[] = [];

  switch (framework) {
    case "step_by_step":
      slides = [
        {
          slideNumber: 1,
          slideType: "hook",
          tagline: "STEP-BY-STEP PLAYBOOK",
          title: `How to Master ${topic} in 5 Practical Steps`,
          body: `Most people spend 6+ months overcomplicating ${topic.toLowerCase()}. Here is the exact systematic blueprint to achieve results in 14 days.`,
          bulletPoints: ["Zero fluff or theory", "Battle-tested execution playbook", "Framework used by top 1% operators"],
          highlight: "Swipe to inspect the 5 core milestones ➔",
        },
        {
          slideNumber: 2,
          slideType: "content",
          tagline: "MILESTONE 01",
          title: "Audit & Eliminate the Friction",
          body: "Before building new systems, you must ruthlessly eliminate the bottlenecks slowing your velocity down.",
          bulletPoints: ["Identify the single constraint costing 80% of momentum", "Cut low-leverage activities immediately", "Establish a baseline metric"],
          highlight: "Speed of iteration beats perfection every single time.",
        },
        {
          slideNumber: 3,
          slideType: "content",
          tagline: "MILESTONE 02",
          title: "Build the Core Architecture",
          body: "Design simple, repeatable systems that run predictably without constant manual intervention.",
          bulletPoints: ["Standardize the recurring workflow into 3 phases", "Automate manual handoffs and state sync", "Document key decision criteria"],
          highlight: "Simple systems scale. Complex architectures collapse under load.",
        },
        {
          slideNumber: 4,
          slideType: "insight",
          tagline: "MILESTONE 03",
          title: "Accelerate Feedback Loops",
          body: "Compress the time between launching an experiment and gathering real-world validation data.",
          bulletPoints: ["Ship daily micro-iterations instead of monthly releases", "Listen to high-intent user signals", "Iterate based on quantifiable outcomes"],
          highlight: "The company with the fastest learning cycle always wins the market.",
        },
        {
          slideNumber: 5,
          slideType: "takeaway",
          tagline: "KEY TAKEAWAY",
          title: "The Compounding Flywheel",
          body: "When all 3 milestones operate simultaneously, you create an unstoppable compounding feedback loop.",
          bulletPoints: ["Consistency creates leverage", "Process clarity frees up creative mental bandwidth", "Predictable execution drives outsized returns"],
          highlight: "Focus on execution cadence rather than theoretical debate.",
        },
        {
          slideNumber: 6,
          slideType: "cta",
          tagline: "ACTION REQUIRED",
          title: "Save This Guide for Your Next Sprint",
          body: "Implement these steps this week and measure your velocity jump. Repost to share with your network.",
          bulletPoints: ["Bookmark 📌 for quick reference", "Follow for daily high-leverage frameworks", "Drop your biggest question in the comments"],
          highlight: "Created with SocialStudio AI",
        },
      ];
      break;

    case "myth_vs_fact":
      slides = [
        {
          slideNumber: 1,
          slideType: "hook",
          tagline: "UNPOPULAR TRUTH",
          title: `3 Destructive Myths About ${topic}`,
          body: "What 90% of industry experts preach is actively sabotaging your growth. Let's dismantle the conventional wisdom with hard data.",
          bulletPoints: ["Debunking outdated best practices", "What actually drives results today", "Real-world empirical data"],
          highlight: "Swipe to expose Myth #1 ➔",
        },
        {
          slideNumber: 2,
          slideType: "content",
          tagline: "MYTH #1 VS REALITY",
          title: "Myth: 'You Need Massive Scale First'",
          body: "Reality: Scale amplifies existing flaws. If you cannot produce high ROI with 10 customers or units, 10,000 will simply burn your runway faster.",
          bulletPoints: ["Focus on density before scale", "Perfect the unit economics first", "Depth creates sustainable moat"],
          highlight: "Fix the conversion machine before pouring fuel on the fire.",
        },
        {
          slideNumber: 3,
          slideType: "content",
          tagline: "MYTH #2 VS REALITY",
          title: "Myth: 'Move Fast and Break Everything'",
          body: "Reality: Top performers move fast on experiments, but move deliberately on foundational architecture and user trust.",
          bulletPoints: ["Speed without direction is just expensive chaos", "Build robust automated guardrails", "Decouple rapid prototypes from core systems"],
          highlight: "Velocities without governance lead directly to catastrophic downtime.",
        },
        {
          slideNumber: 4,
          slideType: "insight",
          tagline: "THE GOLDEN RULE",
          title: "The High-Leverage Shift",
          body: "Stop copying the tactics of multi-billion dollar incumbents. Execute with the precision of an agile, focused challenger.",
          bulletPoints: ["Focus on your unique wedge", "Deliver 10x better experience on one core vector", "Own the customer relationship"],
          highlight: "Niche dominance precedes broad category leadership.",
        },
        {
          slideNumber: 5,
          slideType: "cta",
          tagline: "FINAL TAKEAWAY",
          title: "Which Myth Are You Ready to Drop?",
          body: "Drop your thoughts below. Repost this carousel if you believe in practical, data-backed execution over buzzwords.",
          bulletPoints: ["Save 📌 to revisit during strategy sessions", "Tag a teammate who needs to hear this", "Follow for weekly contrarian analysis"],
          highlight: "Created with SocialStudio AI",
        },
      ];
      break;

    case "contrarian":
      slides = [
        {
          slideNumber: 1,
          slideType: "hook",
          tagline: "CONTRARIAN PERSPECTIVE",
          title: `Why Most Advice on ${topic} is Completely Backwards`,
          body: "The consensus strategy guarantees mediocre outcomes. Here is the contrarian framework that actually moves the needle.",
          bulletPoints: ["Why standard playbooks fail", "The hidden asymmetry most ignore", "How to exploit this gap right now"],
          highlight: "Swipe to see the shift ➔",
        },
        {
          slideNumber: 2,
          slideType: "content",
          tagline: "THE STATUS QUO TRAP",
          title: "The Consensus Is Overcrowded",
          body: "When everyone runs the exact same marketing and product playbook, customer acquisition costs skyrocket and margins evaporate.",
          bulletPoints: ["Diminishing returns on traditional channels", "Generic messaging that gets filtered out", "Race to the bottom on pricing"],
          highlight: "If your strategy looks like everyone else's, you have no strategy.",
        },
        {
          slideNumber: 3,
          slideType: "insight",
          tagline: "THE NEW SYSTEM",
          title: "The Asymmetric Advantage",
          body: "Instead of fighting for attention, manufacture scarcity and authority through deep proprietary insight and rapid execution.",
          bulletPoints: ["Build high-conviction micro-tools", "Publish transparent, non-obvious case studies", "Turn users into vocal brand advocates"],
          highlight: "Attention follows authenticity and undeniable results.",
        },
        {
          slideNumber: 4,
          slideType: "cta",
          tagline: "WHAT'S NEXT",
          title: "Build Your Unfair Advantage",
          body: "Stop following the herd. Apply this framework and lead your category.",
          bulletPoints: ["Bookmark this post 📌", "Repost to inspire your network", "Follow for actionable growth playbooks"],
          highlight: "Created with SocialStudio AI",
        },
      ];
      break;

    case "listicle":
      slides = [
        {
          slideNumber: 1,
          slideType: "hook",
          tagline: "THE ULTIMATE LISTICLE",
          title: `5 High-Impact Lessons on ${topic}`,
          body: "Distilled from 1,000+ hours of hands-on experimentation, these 5 principles will transform your approach overnight.",
          bulletPoints: ["Immediate actionable takeaways", "Battle-tested in real production", "Designed for maximum leverage"],
          highlight: "Swipe to dive in ➔",
        },
        {
          slideNumber: 2,
          slideType: "content",
          tagline: "PRINCIPLE #1",
          title: "Clarity Over Volume",
          body: "One crystal-clear message delivered with conviction outperforms 10 confusing, watered-down campaigns.",
          bulletPoints: ["Define the single most important user benefit", "Cut jargon and corporate buzzwords", "Speak directly to your target buyer"],
          highlight: "Confusion is the #1 silent killer of conversions.",
        },
        {
          slideNumber: 3,
          slideType: "content",
          tagline: "PRINCIPLE #2",
          title: "Automate the Repetitive",
          body: "If a task is performed more than 3 times a week, build a script, prompt, or workflow to handle it autonomously.",
          bulletPoints: ["Free up hours of cognitive load", "Eliminate human data entry errors", "Scale without linear headcount growth"],
          highlight: "Your time should be spent on strategy and relationships.",
        },
        {
          slideNumber: 4,
          slideType: "insight",
          tagline: "PRINCIPLE #3",
          title: "Relentless Follow-Through",
          body: "Great ideas are cheap. World-class consistency and obsessive refinement are extraordinarily rare.",
          bulletPoints: ["Show up every single day with high standards", "Track performance metrics weekly", "Celebrate small incremental wins"],
          highlight: "Success is the natural byproduct of boring daily discipline.",
        },
        {
          slideNumber: 5,
          slideType: "cta",
          tagline: "SUMMARY",
          title: "Which Principle Will You Implement Today?",
          body: "Drop a comment with your favorite principle. Repost to help other builders in your network.",
          bulletPoints: ["Save 📌 for your next team standup", "Follow for daily operational frameworks", "Connect on LinkedIn & X"],
          highlight: "Created with SocialStudio AI",
        },
      ];
      break;

    case "story":
    default:
      slides = [
        {
          slideNumber: 1,
          slideType: "hook",
          tagline: "CASE STUDY & BREAKTHROUGH",
          title: `The Surprising Reality of ${topic}`,
          body: "A year ago, I was stuck on the hamster wheel trying to make this work. Here is the raw story of what changed everything.",
          bulletPoints: ["The initial roadblock and frustration", "The epiphany that unlocked 10x growth", "3 rules you can adopt immediately"],
          highlight: "Swipe to read the breakdown ➔",
        },
        {
          slideNumber: 2,
          slideType: "content",
          tagline: "THE STRUGGLE",
          title: "Doing Everything 'Right' and Still Failing",
          body: "We followed every textbook guide and standard template. Yet our conversion stayed flat and burn rate kept ticking up.",
          bulletPoints: ["Over-engineered solutions nobody asked for", "High effort, shockingly low leverage", "Burnout looming on the horizon"],
          highlight: "Hard work in the wrong direction just gets you lost faster.",
        },
        {
          slideNumber: 3,
          slideType: "insight",
          tagline: "THE TURNING POINT",
          title: "The 80/20 Revelation",
          body: "We stripped away 80% of the complexity and focused obsessively on the single metric that actually created customer value.",
          bulletPoints: ["Narrowed target user persona to exact ICP", "Simplified product onboarding from 7 steps to 1", "Doubled down on visual storytelling"],
          highlight: "Simplicity is the ultimate competitive advantage.",
        },
        {
          slideNumber: 4,
          slideType: "takeaway",
          tagline: "THE BREAKTHROUGH",
          title: "What the Numbers Revealed",
          body: "Within 30 days of this pivot, engagement quadrupled and inbound organic leads skyrocketed without an extra dollar in ad spend.",
          bulletPoints: ["4x lift in engagement and share rate", "Customer acquisition cost cut in half", "Sustainable word-of-mouth momentum"],
          highlight: "When your message resonates, distribution takes care of itself.",
        },
        {
          slideNumber: 5,
          slideType: "cta",
          tagline: "NEXT STEPS",
          title: "Don't Repeat Our Early Mistakes",
          body: "Steal this framework and apply it to your business today. Save this post so it's handy when you need it.",
          bulletPoints: ["Hit the 📌 save button below", "Repost 🔁 to inspire your connections", "Follow for weekly high-signal growth breakdowns"],
          highlight: "Created with SocialStudio AI",
        },
      ];
      break;
  }

  const twitterThread = generateCompanionThread(topic, slides, authorHandle);

  return {
    title: `${topic} — Masterclass Carousel`,
    topic,
    framework,
    aspectRatio,
    theme,
    authorName,
    authorHandle,
    showWatermark: true,
    slides,
    twitterThread,
  };
}

function generateCompanionThread(
  topic: string,
  slides: SlideData[],
  handle: string
): string {
  const tweets: string[] = [];

  // Tweet 1: Hook
  const hookSlide = slides[0];
  tweets.push(
    `1/${slides.length + 1} 🧵 ${hookSlide.title}\n\n${hookSlide.body}\n\nHere is the step-by-step breakdown (bookmark this for later): 👇`
  );

  // Middle tweets
  for (let i = 1; i < slides.length - 1; i++) {
    const s = slides[i];
    const bullets = s.bulletPoints?.map((b) => `• ${b}`).join("\n") || "";
    tweets.push(
      `${i + 1}/${slides.length + 1} ${s.tagline ? `[${s.tagline}] ` : ""}${s.title}\n\n${s.body}\n\n${bullets}${s.highlight ? `\n\n💡 "${s.highlight}"` : ""}`
    );
  }

  // Summary tweet
  const summarySlide = slides[slides.length - 1];
  tweets.push(
    `${slides.length}/${slides.length + 1} Key Takeaway:\n\n${summarySlide.body}\n\nExecution beats theory every single time.`
  );

  // Final CTA tweet
  tweets.push(
    `${slides.length + 1}/${slides.length + 1} That's a wrap!\n\nIf you found this thread valuable:\n1. Follow ${handle} for daily deep-dives\n2. Retweet the 1st tweet to share with your audience\n\n⚡ Generated with SocialStudio AI`
  );

  return tweets.join("\n\n---\n\n");
}
