# Animated Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `Landing.tsx` into an Apple-style animated page with a scroll-driven cross-device demo, blur-in card reveals, hero gradient orb, card hover lifts, testimonial quote animations, and a pulse ring on the Household pricing card.

**Architecture:** All changes are confined to `src/pages/Landing.tsx`. Five independent animation layers are added in sequence: imports/RevealDiv → Hero → card hovers → pricing → Device Demo (the centerpiece). The Device Demo replaces the existing static "How It Works" section entirely.

**Tech Stack:** React 19, Vite 8, TypeScript, Tailwind CSS v4, framer-motion v12. No new dependencies. Verification via `npm run build` (TypeScript + Vite) and `npm run dev` visual check.

---

## Files

| Action | File | What changes |
|--------|------|-------------|
| Modify | `src/pages/Landing.tsx` | All changes in this plan |

No new files created.

---

## Codebase Context

Read `src/pages/Landing.tsx` before starting. Key landmarks:
- **Line 1** — framer-motion import (currently: `motion, useInView, useScroll`)
- **Lines 3** — React imports (currently: `useState, useRef, useEffect`)
- **Lines 6–10** — `useReveal()` hook
- **Lines 12–33** — `RevealDiv` component
- **Lines 332–382** — Hero section
- **Lines 401–440** — "What We Install" section with 3 product cards
- **Lines 442–470** — "How It Works" section (`<section id="how">`) — **this entire section is replaced in Task 5**
- **Lines 472–521** — Testimonials section
- **Lines 527–607** — Pricing section
- **Line 285** — `const { scrollY } = useScroll()` inside `Landing()` — note: `useScroll` is already used here for nav scroll detection; the Device Demo will add a SECOND `useScroll` call with a `target` ref inside a new `DeviceDemo` component

---

## Task 1: Update framer-motion imports and RevealDiv

**File:** `src/pages/Landing.tsx` — line 1 (imports) and lines 12–33 (RevealDiv)

**No tests exist for this project.** Verification is always: `npm run build 2>&1 | tail -10` (expected: `✓ built in Xms`), then visual check in browser.

- [ ] **Step 1: Update framer-motion import line**

Find line 1:
```tsx
import { motion, useInView, useScroll } from 'framer-motion';
```

Replace with:
```tsx
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
  motionValue,
} from 'framer-motion';
```

- [ ] **Step 2: Add `useReducedMotion` call to RevealDiv**

Find the `RevealDiv` component (lines 12–33). Replace the entire component:

```tsx
function RevealDiv({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isInView } = useReveal();
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 24, filter: 'blur(8px)', scale: 0.97 }
      }
      animate={
        isInView
          ? shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
          : {}
      }
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Build check**

```bash
cd ~/ai-setup-crm && npm run build 2>&1 | tail -10
```

Expected: `✓ built in Xms` with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
cd ~/ai-setup-crm && git add src/pages/Landing.tsx && git commit -m "feat: update framer-motion imports and RevealDiv blur+scale reveal"
```

---

## Task 2: Hero — gradient orb, word-by-word headline, button hover

**File:** `src/pages/Landing.tsx` — Hero section (lines ~332–382)

- [ ] **Step 1: Add `relative` to the hero section wrapper and insert gradient orb**

Find the hero section opening tag (line ~332):
```tsx
<section className="max-w-5xl mx-auto px-5 sm:px-6 pt-14 sm:pt-24 pb-14 sm:pb-20 text-center">
```

Replace with:
```tsx
<section className="relative max-w-5xl mx-auto px-5 sm:px-6 pt-14 sm:pt-24 pb-14 sm:pb-20 text-center">
```

Then insert this block immediately after the opening `<section ...>` tag, before the location badge `<motion.div>`:

```tsx
{/* Animated gradient orb */}
<HeroOrb />
```

And add the `HeroOrb` component as a new top-level function **above** the `Landing` export (anywhere after `RevealDiv`):

```tsx
function HeroOrb() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#0071e3]/20 blur-[80px] opacity-[0.15]" />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#0071e3]/20 blur-[80px]"
      />
    </div>
  );
}
```

- [ ] **Step 2: Replace single-block headline with word-by-word reveal**

Find the hero `<motion.h1>` block (lines ~343–352):
```tsx
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.07, ease: [0.25, 0.1, 0.25, 1] }}
  className="text-[40px] sm:text-[52px] lg:text-[60px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] max-w-3xl mx-auto"
>
  Finally — AI that someone
  <br className="hidden sm:block" />
  <span className="text-[#86868b]"> actually sets up for you.</span>
</motion.h1>
```

Replace with:
```tsx
<HeroHeadline />
```

Add `HeroHeadline` as a new component above `Landing`:

```tsx
function HeroHeadline() {
  const shouldReduceMotion = useReducedMotion();
  const words = ['Finally', '—', 'AI', 'that', 'someone', 'actually', 'sets', 'up', 'for', 'you.'];

  if (shouldReduceMotion) {
    return (
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.07 }}
        className="text-[40px] sm:text-[52px] lg:text-[60px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] max-w-3xl mx-auto"
      >
        Finally — AI that someone actually sets up for you.
      </motion.h1>
    );
  }

  // Words 0–4: "Finally — AI that someone" (dark)
  // Words 5–9: "actually sets up for you." (grey, matching original design)
  return (
    <h1 className="text-[40px] sm:text-[52px] lg:text-[60px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] max-w-3xl mx-auto">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.07 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          className={`inline-block mr-[0.25em] ${i >= 5 ? 'text-[#86868b]' : ''}`}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
```

- [ ] **Step 3: Add whileHover/whileTap to both hero CTA buttons**

Find the two `<a>` tags inside the hero button `<motion.div>`. They are plain `<a>` elements. Change **both** to `motion.a`:

First button (Book Your Install):
```tsx
<motion.a
  href="#book"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="inline-flex items-center justify-center gap-2 bg-[#0071e3] text-white px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0077ED] transition-colors min-h-[52px] sm:min-h-[44px]"
>
  Book Your Install <ArrowRight className="w-4 h-4" />
</motion.a>
```

Second button (phone):
```tsx
<motion.a
  href="tel:+13613158585"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="inline-flex items-center justify-center gap-2 text-[#0071e3] px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0071e3]/5 transition-colors border border-[#0071e3]/20 min-h-[52px] sm:min-h-[44px]"
>
  <Phone className="w-4 h-4" /> (361) 315-8585
</motion.a>
```

- [ ] **Step 4: Build check**

```bash
cd ~/ai-setup-crm && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 5: Commit**

```bash
cd ~/ai-setup-crm && git add src/pages/Landing.tsx && git commit -m "feat: hero gradient orb, word-by-word headline, button hover animations"
```

---

## Task 3: "What We Install" card hovers + Testimonial enhancements

**File:** `src/pages/Landing.tsx` — product cards (~lines 428–438) and testimonial cards (~lines 503–520)

- [ ] **Step 1: Add hover lift to the three product cards in "What We Install"**

Find the product card `RevealDiv` inside the `.map()` (lines ~429–438):
```tsx
<RevealDiv
  key={product.name}
  delay={i * 0.07}
  className="bg-white rounded-2xl p-6 sm:p-7 text-center border border-black/[0.06] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-500"
>
```

Replace with (wrap inside a motion.div with whileHover):
```tsx
<RevealDiv key={product.name} delay={i * 0.07}>
  <motion.div
    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}
    transition={{ duration: 0.2 }}
    className="bg-white rounded-2xl p-6 sm:p-7 text-center border border-black/[0.06] h-full"
  >
```

Also close the new `motion.div` before the closing `</RevealDiv>`:
```tsx
  </motion.div>
</RevealDiv>
```

- [ ] **Step 2: Add quote mark animation + hover lift to testimonial cards**

Find the testimonial map (lines ~503–519):
```tsx
{testimonials.map((t, i) => (
  <RevealDiv
    key={t.name}
    delay={i * 0.08}
    className="bg-white rounded-2xl border border-black/[0.06] p-6 sm:p-7"
  >
    <StarRow count={t.stars} />
    <p className="text-[14px] sm:text-[15px] text-[#424245] leading-relaxed mt-4 mb-5">
      "{t.quote}"
    </p>
```

Replace the entire `{testimonials.map(...)}` block with:
```tsx
{testimonials.map((t, i) => (
  <RevealDiv key={t.name} delay={i * 0.08}>
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-black/[0.06] p-6 sm:p-7 h-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.4, delay: i * 0.08 }}
        className="text-[48px] leading-none text-[#0071e3]/20 font-serif mb-2 select-none"
        aria-hidden="true"
      >
        "
      </motion.div>
      <StarRow count={t.stars} />
      <p className="text-[14px] sm:text-[15px] text-[#424245] leading-relaxed mt-4 mb-5">
        "{t.quote}"
      </p>
      <div>
        <p className="text-[13px] font-semibold text-[#1d1d1f]">{t.name}</p>
        <p className="text-[12px] text-[#86868b] mt-0.5">{t.role} · {t.location}</p>
      </div>
    </motion.div>
  </RevealDiv>
))}
```

- [ ] **Step 3: Build check**

```bash
cd ~/ai-setup-crm && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
cd ~/ai-setup-crm && git add src/pages/Landing.tsx && git commit -m "feat: card hover lifts and testimonial quote mark animations"
```

---

## Task 4: Pricing cards — hover lift + Household pulse ring

**File:** `src/pages/Landing.tsx` — Pricing section (~lines 538–605)

- [ ] **Step 1: Wrap each pricing card in motion.div with hover lift**

Find the pricing card map (lines ~539–604). The outer structure is:
```tsx
{tiers.map((tier, i) => (
  <RevealDiv key={tier.name} delay={i * 0.07}>
    <div
      className={`rounded-3xl p-5 sm:p-7 h-full ${
        tier.popular
          ? 'bg-[#1d1d1f] text-white ring-1 ring-[#1d1d1f]'
          : 'bg-white border border-black/[0.06]'
      }`}
    >
```

Replace the `RevealDiv` + inner `<div>` with:
```tsx
{tiers.map((tier, i) => (
  <RevealDiv key={tier.name} delay={i * 0.07}>
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-3xl p-5 sm:p-7 h-full overflow-visible ${
        tier.popular
          ? 'bg-[#1d1d1f] text-white ring-1 ring-[#1d1d1f]'
          : 'bg-white border border-black/[0.06]'
      }`}
    >
```

**Important:** Also close `</motion.div>` where `</div>` currently closes the inner card div (before `</RevealDiv>`).

- [ ] **Step 2: Add pulse ring for the Household (popular) card**

Inside the pricing card `motion.div`, immediately after the opening tag, add:
```tsx
{tier.popular && <PricingPulseRing />}
```

Add `PricingPulseRing` as a new component above `Landing`:

```tsx
function PricingPulseRing() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;
  return (
    <motion.div
      animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-3xl ring-2 ring-[#0071e3]/40 -z-10"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 3: Build check**

```bash
cd ~/ai-setup-crm && npm run build 2>&1 | tail -10
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
cd ~/ai-setup-crm && git add src/pages/Landing.tsx && git commit -m "feat: pricing card hover lifts and Household pulse ring"
```

---

## Task 5: Device Demo Section (replace "How It Works")

This is the main feature. The existing `<section id="how" ...>` (lines 442–470) is completely replaced with a scroll-driven device demo component.

**File:** `src/pages/Landing.tsx`

- [ ] **Step 1: Add the `DeviceDemo` component above the `Landing` export**

Insert the following complete component somewhere above `export function Landing()`. This is a large addition — paste it in full:

```tsx
const DEMO_QUERY = "How do I dispute a charge on my bill?";
const DEMO_BULLETS = [
  "Call your bank's customer service number",
  "Explain the charge and request a review",
  "Ask for a reference number for your case",
];
const STEP_LABELS = [
  { headline: "Open Perplexity on your computer.", sub: "It's already set up and ready." },
  { headline: "Ask anything.", sub: "How do I dispute a charge on my bill?" },
  { headline: "Get a real answer.", sub: "With sources. In plain English." },
  { headline: "Continue on your phone.", sub: "Same Perplexity. Set up on both." },
];

function LaptopScreen({ typedQuery, bullet1Opacity, bullet2Opacity, bullet3Opacity, glowOpacity }: {
  typedQuery: string;
  bullet1Opacity: import('framer-motion').MotionValue<number>;
  bullet2Opacity: import('framer-motion').MotionValue<number>;
  bullet3Opacity: import('framer-motion').MotionValue<number>;
  glowOpacity: import('framer-motion').MotionValue<number>;
}) {
  const showCursor = typedQuery.length > 0 && typedQuery.length < DEMO_QUERY.length;
  return (
    <div className="relative w-[340px] sm:w-[420px]">
      {/* Screen glow */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute -inset-4 rounded-2xl bg-blue-500/10 blur-xl -z-10"
        aria-hidden="true"
      />
      {/* Lid */}
      <div className="bg-[#2a2a2a] rounded-t-xl border border-white/10 p-2" style={{ paddingBottom: 0 }}>
        <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
          {/* Screen content */}
          <div className="h-full flex flex-col p-3 gap-2">
            {/* Perplexity wordmark */}
            <div className="text-white/60 text-[10px] font-semibold tracking-wider uppercase">Perplexity</div>
            {/* Answer area */}
            <div className="flex-1 overflow-hidden space-y-1.5">
              {DEMO_BULLETS.map((bullet, i) => {
                const opacities = [bullet1Opacity, bullet2Opacity, bullet3Opacity];
                return (
                  <motion.div
                    key={i}
                    style={{ opacity: opacities[i] }}
                    className="flex items-start gap-1.5"
                  >
                    <span className="text-[#0071e3] text-[9px] mt-0.5 shrink-0">•</span>
                    <span className="text-white/80 text-[9px] leading-tight">{bullet}</span>
                  </motion.div>
                );
              })}
            </div>
            {/* Search bar */}
            <div className="bg-white/10 rounded-lg px-2 py-1.5 text-[9px] text-white/60 font-mono truncate min-h-[24px]">
              {typedQuery || <span className="opacity-30">Ask anything…</span>}
              {showCursor && <span className="animate-pulse">|</span>}
            </div>
          </div>
        </div>
      </div>
      {/* Base */}
      <div className="bg-[#333] h-3 rounded-b-xl border border-t-0 border-white/10" />
      <div className="bg-[#2a2a2a] h-1.5 w-2/3 mx-auto rounded-b-lg" />
    </div>
  );
}

function PhoneScreen({ phoneOpacity, phoneBulletsOpacity }: {
  phoneOpacity: import('framer-motion').MotionValue<number>;
  phoneBulletsOpacity: import('framer-motion').MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ opacity: phoneOpacity }}
      className="w-[120px] sm:w-[140px] bg-[#1a1a1a] rounded-[28px] border border-white/10 p-2 relative shrink-0"
    >
      {/* Notch */}
      <div className="w-12 h-3 bg-black rounded-full mx-auto mb-1" />
      {/* Screen */}
      <div className="bg-black rounded-2xl overflow-hidden p-2" style={{ minHeight: 180 }}>
        <div className="text-white/60 text-[8px] font-semibold tracking-wider uppercase mb-1">Perplexity</div>
        <div className="bg-white/10 rounded px-1.5 py-1 text-[7px] text-white/50 font-mono truncate mb-2">
          {DEMO_QUERY}
        </div>
        <motion.div style={{ opacity: phoneBulletsOpacity }} className="space-y-1">
          {DEMO_BULLETS.map((bullet, i) => (
            <div key={i} className="flex items-start gap-1">
              <span className="text-[#0071e3] text-[7px] mt-0.5 shrink-0">•</span>
              <span className="text-white/70 text-[7px] leading-tight">{bullet}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function DeviceDemo() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const [typedQuery, setTypedQuery] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Typing animation
    if (v < 0.35) {
      setTypedQuery('');
    } else if (v > 0.55) {
      setTypedQuery(DEMO_QUERY);
    } else {
      const progress = (v - 0.35) / (0.55 - 0.35);
      const chars = Math.round(progress * DEMO_QUERY.length);
      setTypedQuery(DEMO_QUERY.slice(0, chars));
    }
    // Step label
    if (v < 0.35) setActiveStep(0);
    else if (v < 0.55) setActiveStep(1);
    else if (v < 0.70) setActiveStep(2);
    else setActiveStep(3);
  });

  // Laptop transforms
  const laptopScale = useTransform(scrollYProgress, [0.15, 0.35], [0.8, 1]);
  const laptopX = useTransform(scrollYProgress, [0.70, 0.85], [0, -60]);
  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Bullet opacities
  const bullet1Opacity = useTransform(scrollYProgress, [0.55, 0.60], [0, 1]);
  const bullet2Opacity = useTransform(scrollYProgress, [0.60, 0.65], [0, 1]);
  const bullet3Opacity = useTransform(scrollYProgress, [0.65, 0.70], [0, 1]);

  // Phone transforms
  const phoneOpacity = useTransform(scrollYProgress, [0.70, 0.85], [0, 1]);
  const phoneX = useTransform(scrollYProgress, [0.70, 0.85], [60, 0]);
  const phoneBulletsOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const continueOpacity = useTransform(scrollYProgress, [0.85, 1.0], [0, 1]);

  if (shouldReduceMotion) {
    return (
      <section id="how" className="bg-[#1d1d1f] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 text-white text-center">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-3">How It Works</p>
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight mb-10">See it in action.</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <LaptopScreen
              typedQuery={DEMO_QUERY}
              bullet1Opacity={motionValue(1)}
              bullet2Opacity={motionValue(1)}
              bullet3Opacity={motionValue(1)}
              glowOpacity={motionValue(1)}
            />
            <PhoneScreen
              phoneOpacity={motionValue(1)}
              phoneBulletsOpacity={motionValue(1)}
            />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
            {STEP_LABELS.map((s, i) => (
              <div key={i}>
                <p className="text-white text-[13px] font-semibold">{s.headline}</p>
                <p className="text-white/40 text-[12px] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="how" className="bg-[#1d1d1f] relative" style={{ minHeight: '300vh' }}>
      {/* Desktop sticky scroll */}
      <div className="sticky top-0 h-screen hidden md:flex flex-col items-center justify-center overflow-hidden px-5">
        {/* Section label + headline */}
        <motion.div style={{ opacity: headlineOpacity }} className="text-center mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-3">How It Works</p>
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-white">See it in action.</h2>
        </motion.div>

        {/* Devices + step labels row */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Laptop */}
          <motion.div style={{ scale: laptopScale, x: laptopX }}>
            <LaptopScreen
              typedQuery={typedQuery}
              bullet1Opacity={bullet1Opacity}
              bullet2Opacity={bullet2Opacity}
              bullet3Opacity={bullet3Opacity}
              glowOpacity={glowOpacity}
            />
          </motion.div>

          {/* Phone */}
          <motion.div style={{ x: phoneX }}>
            <PhoneScreen
              phoneOpacity={phoneOpacity}
              phoneBulletsOpacity={phoneBulletsOpacity}
            />
          </motion.div>

          {/* Step labels */}
          <div className="w-[200px] shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-white font-semibold text-[16px] leading-snug">
                  {STEP_LABELS[activeStep].headline}
                </p>
                <p className="text-white/50 text-[13px] mt-1.5">
                  {STEP_LABELS[activeStep].sub}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* "Continue anywhere." label */}
            <motion.p
              style={{ opacity: continueOpacity }}
              className="text-[#0071e3] text-[12px] font-semibold mt-4 uppercase tracking-widest"
            >
              Continue anywhere.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Mobile static fallback */}
      <div className="md:hidden py-16 px-5">
        <div className="text-center mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-3">How It Works</p>
          <h2 className="text-[28px] font-semibold tracking-tight text-white">See it in action.</h2>
        </div>
        <div className="flex justify-center gap-4 mb-10">
          <LaptopScreen
            typedQuery={DEMO_QUERY}
            bullet1Opacity={motionValue(1)}
            bullet2Opacity={motionValue(1)}
            bullet3Opacity={motionValue(1)}
            glowOpacity={motionValue(1)}
          />
          <PhoneScreen
            phoneOpacity={motionValue(1)}
            phoneBulletsOpacity={motionValue(1)}
          />
        </div>
        <div className="grid grid-cols-2 gap-5 max-w-sm mx-auto">
          {STEP_LABELS.map((s, i) => (
            <div key={i}>
              <p className="text-white text-[13px] font-semibold">{s.headline}</p>
              <p className="text-white/40 text-[12px] mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Note on static MotionValues:** The reduced-motion and mobile fallback paths use `motionValue(1)` (framer-motion's non-hook factory, imported in Task 1) to create real MotionValues for the always-visible state. This is safe — `motionValue()` returns a real `MotionValue` instance with all methods framer-motion may call internally.

- [ ] **Step 2: Replace the old "How It Works" section JSX with `<DeviceDemo />`**

Find in the `Landing` component JSX (lines ~442–470):
```tsx
{/* How It Works */}
<section id="how" className="bg-[#1d1d1f] py-16 sm:py-20">
  <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center text-white">
    ...
  </div>
</section>
```

Replace the **entire section** (from `{/* How It Works */}` comment through the closing `</section>`) with:
```tsx
{/* Device Demo */}
<DeviceDemo />
```

- [ ] **Step 3: Build check**

```bash
cd ~/ai-setup-crm && npm run build 2>&1 | tail -20
```

Expected: `✓ built in Xms`. If TypeScript errors about MotionValue prop types: see the note in Step 1 about the static fallback approach and fix accordingly.

- [ ] **Step 4: Visual check**

```bash
cd ~/ai-setup-crm && npm run dev
```

Open http://localhost:5173 and verify:
- Desktop (> 768px): scroll through the "How It Works" section — laptop appears, query types, bullets fade in, phone slides in
- Mobile (< 768px): static layout with both devices and 4 step labels visible immediately
- Check prefers-reduced-motion by opening DevTools → Rendering → enable "Emulate CSS prefers-reduced-motion: reduce" — should show static layout

- [ ] **Step 5: Commit**

```bash
cd ~/ai-setup-crm && git add src/pages/Landing.tsx && git commit -m "feat: replace How It Works with scroll-driven device demo"
```

---

## Task 6: Final build, search for regressions, and deploy

- [ ] **Step 1: Full build**

```bash
cd ~/ai-setup-crm && npm run build 2>&1
```

Expected: clean build, `✓ built in Xms`, no TypeScript errors.

- [ ] **Step 2: Verify old static icon grid is removed**

```bash
grep -n "grid-cols-2 md:grid-cols-4\|step.*'01'\|'02'.*icon.*Calendar" src/pages/Landing.tsx
```

Expected: zero matches. These patterns are unique to the old 4-step icon grid in the static section. The `DeviceDemo` component contains "How It Works" as label text — that is expected and not a sign of leftover code.

- [ ] **Step 3: Verify all new imports are present**

```bash
grep -n "AnimatePresence\|useTransform\|useMotionValueEvent\|useReducedMotion" src/pages/Landing.tsx | head -20
```

Expected: each name appears at least once.

- [ ] **Step 4: Deploy to production**

```bash
cd ~/ai-setup-crm && vercel --prod
```

Expected: `Aliased: https://www.simplyai.tech`

- [ ] **Step 5: Final commit if any last-minute fixes were made**

```bash
cd ~/ai-setup-crm && git add src/pages/Landing.tsx && git commit -m "chore: final animation polish before deploy"
```

---

## Summary of Changes

| Section | Change |
|---------|--------|
| framer-motion import | Add `AnimatePresence, useTransform, useMotionValueEvent, useReducedMotion` |
| `RevealDiv` | blur+scale reveal with `useReducedMotion` fallback |
| Hero | Gradient orb (`HeroOrb`), word-by-word headline (`HeroHeadline`), button hover |
| "What We Install" cards | `motion.div` hover lift (y: -4) |
| Testimonials | Decorative quote mark animation, card hover (y: -3, scale: 1.01) |
| Pricing cards | `motion.div` hover lift, `PricingPulseRing` on Household |
| "How It Works" section | **Fully replaced** with `DeviceDemo` scroll-driven component |
| All animations | `useReducedMotion()` respected throughout |
