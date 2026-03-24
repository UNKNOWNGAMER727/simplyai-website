# SimplyAI — Animated Landing Page

**Date:** 2026-03-24
**Status:** Approved

---

## Goal

Transform the SimplyAI landing page from a static reveal-based page into an Apple-style storytelling experience. The centerpiece is a scroll-driven device demo that shows Perplexity working on a laptop then continuing on a phone. Supporting animations upgrade the rest of the page with polish: blur-in reveals, hover lifts, hero glow, and a pulse ring on the featured pricing card.

All animations respect `prefers-reduced-motion`. No new npm dependencies — framer-motion is already installed.

---

## Files

All changes confined to `src/pages/Landing.tsx`.

---

## Section-by-Section Spec

---

### 1. Hero — Animated Gradient Glow

**Current:** Simple fade-in text and buttons. Static white background.

**New:**

Add a soft animated gradient orb behind the headline. Implemented as an absolutely-positioned `<div>` inside the hero section:

```tsx
<div
  aria-hidden="true"
  className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
>
  <motion.div
    animate={{
      scale: [1, 1.15, 1],
      opacity: [0.25, 0.4, 0.25],
    }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#0071e3]/20 blur-[80px]"
  />
</div>
```

The hero section wrapper needs `position: relative` — add `relative` to its className.

**Headline animation:** Replace single-block fade-in with word-by-word reveal. Split "Finally — AI that someone actually sets up for you." into individual `<motion.span>` words, each with a staggered delay (0.05s per word).

**Button hover:** Add `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}` to both hero CTAs using `motion.a`.

---

### 2. Card Reveals — Blur + Scale

**Current:** All `RevealDiv` uses `{ opacity: 0, y: 24 }` → `{ opacity: 1, y: 0 }`.

**New:** Update `RevealDiv` initial/animate to also include blur and scale:

```tsx
initial={{ opacity: 0, y: 24, filter: 'blur(8px)', scale: 0.97 }}
animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
```

Duration stays 0.65s. This applies globally to all sections that use `RevealDiv`.

**Card hover lift:** For the three product cards in "What we set up" and the three testimonial cards, wrap each in a `motion.div` (or change the existing div) with:

```tsx
whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}
transition={{ duration: 0.2 }}
```

---

### 3. "How It Works" → Device Demo Section (REPLACED)

This is the main feature. The existing dark `<section id="how">` is completely replaced.

**Layout:** Dark background (`bg-[#1d1d1f]`), tall scroll section (`min-h-[300vh]`), sticky inner container.

**Sticky mechanism:**
```tsx
<section id="how" className="bg-[#1d1d1f] relative" style={{ minHeight: '300vh' }}>
  <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-5">
    {/* content */}
  </div>
</section>
```

**Scroll progress:** Use framer-motion `useScroll` with `target` ref on the section and `offset: ['start start', 'end end']`. This gives a `scrollYProgress` value from 0→1 as the section scrolls.

**Animation stages** (driven by `scrollYProgress`):

| Progress range | What happens |
|---|---|
| 0.00 → 0.15 | Section label + headline fade in |
| 0.15 → 0.35 | Laptop mockup scales in (0.8→1.0), screen glows on |
| 0.35 → 0.55 | Query types itself character by character on laptop screen |
| 0.55 → 0.70 | AI answer bullet points fade in one by one on laptop screen |
| 0.70 → 0.85 | Phone mockup slides in from right (x: 60→0), laptop shifts left |
| 0.85 → 1.00 | Same conversation appears on phone screen. "Continue anywhere." label fades in |

Use `useTransform(scrollYProgress, [start, end], [from, to])` for each property.

**Device Mockups:** CSS-only (no images). Built with divs styled as:

*Laptop:*
```tsx
<div className="relative w-[340px] sm:w-[420px]">
  {/* lid */}
  <div className="bg-[#2a2a2a] rounded-t-xl border border-white/10 p-2" style={{ paddingBottom: 0 }}>
    {/* screen bezel */}
    <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
      {/* screen content goes here */}
    </div>
  </div>
  {/* base */}
  <div className="bg-[#333] h-3 rounded-b-xl border border-t-0 border-white/10" />
  <div className="bg-[#2a2a2a] h-1.5 w-2/3 mx-auto rounded-b-lg" />
</div>
```

*Phone:*
```tsx
<div className="w-[140px] sm:w-[160px] bg-[#1a1a1a] rounded-[28px] border border-white/10 p-2 relative">
  {/* notch */}
  <div className="w-16 h-4 bg-black rounded-full mx-auto mb-1" />
  {/* screen */}
  <div className="bg-black rounded-2xl overflow-hidden" style={{ minHeight: 220 }}>
    {/* screen content */}
  </div>
</div>
```

**Screen content — Perplexity-style UI:**

Laptop screen shows (in order, animated in):
1. A small "Perplexity" wordmark at top (white text, small)
2. A search/input bar at bottom with the query typing in
3. Answer area with 3 bullet points:
   - "Call your bank's customer service number"
   - "Explain the charge and request a review"
   - "Ask for a reference number for your case"

Phone screen shows (appears at step 4):
- Same Perplexity wordmark
- The query (static, already typed)
- Same 3 bullet points (fade in together)

**Step labels:** On the right side of the device, 4 text labels that swap based on scroll progress. Each label: white headline + white/50 subtext.

| Stage | Headline | Subtext |
|---|---|---|
| 1 | "Open Perplexity on your computer." | "It's already set up and ready." |
| 2 | "Ask anything." | "How do I dispute a charge on my bill?" |
| 3 | "Get a real answer." | "With sources. In plain English." |
| 4 | "Continue on your phone." | "Same Perplexity. Set up on both." |

**Mobile:** On small screens (< md), simplify to a static two-device image with the 4 steps listed below. The sticky scroll mechanic is md+ only. Use `hidden md:flex` on the sticky container and a simplified `md:hidden` static version.

---

### 4. Testimonials — Quote Mark Animation

Each testimonial card gets:
- A large decorative `"` that animates in first (opacity 0→1, scale 0.5→1, delay 0)
- Then card content fades up (existing RevealDiv pattern)
- Hover: `whileHover={{ y: -3, scale: 1.01 }}`

---

### 5. Pricing Cards — Hover Lift + Household Pulse Ring

**All cards hover:** `whileHover={{ y: -4 }}` with smooth transition.

**Household card (popular: true) — pulse ring:**

Add an animated ring behind the Household card:
```tsx
{tier.popular && (
  <motion.div
    animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    className="absolute inset-0 rounded-3xl ring-2 ring-[#0071e3]/40 -z-10"
    aria-hidden="true"
  />
)}
```

The pricing card wrapper needs `position: relative` and `overflow: visible`.

---

## Accessibility

All animations check `prefers-reduced-motion`. Wrap all `motion.*` animation props:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// or use the framer-motion hook: useReducedMotion()
```

When reduced motion is preferred:
- Skip blur/scale in RevealDiv (fade only)
- Skip hero orb animation (show static, lower opacity)
- Skip device demo scroll animation (show static mockup)
- Skip pulse ring

Use framer-motion's `useReducedMotion()` hook — it's built in.

---

## What Is NOT Changing

- Page layout, section order, color scheme
- All copy (just updated in previous session)
- Pricing tiers, Cal.com links, FAQ content
- Email capture section
- Mobile hamburger nav
- Footer
