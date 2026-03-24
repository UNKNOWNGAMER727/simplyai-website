# Pricing & Service Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `src/pages/Landing.tsx` to reflect new pricing (Solo $279 / Household $449 / Business $799), outcome-based copy, phone setup called out in every tier, and savings math badges — with no time references anywhere.

**Architecture:** All changes are confined to a single file: `src/pages/Landing.tsx`. The tiers data array is updated, the pricing card JSX is extended to render strikethrough prices and savings badges, and scattered copy (hero, FAQ, testimonials, booking CTA) is updated in-place.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4, TypeScript. No test framework installed — verification is via `npm run build` (TypeScript + Vite) and visual browser check at `npm run dev`.

---

## Files

| Action | File | What changes |
|--------|------|-------------|
| Modify | `src/pages/Landing.tsx` | All changes in this plan |

No new files. No other files touched.

---

### Task 1: Update the `tiers` array data

**File:** `src/pages/Landing.tsx` — the `tiers` const (currently lines ~35–78)

- [ ] **Step 1: Update the TypeScript type for tiers**

Find the `tiers` array (starts with `const tiers = [`). The array elements are plain objects with no explicit type — that's fine, TypeScript will infer. We're adding two optional fields. No explicit type annotation needed; TypeScript will widen the inference automatically.

- [ ] **Step 2: Replace the entire `tiers` array**

Replace from `const tiers = [` through the closing `];` with:

```ts
const tiers = [
  {
    name: 'Solo',
    price: 279,
    originalPrice: 300,
    slug: 'basic-ai-setup-300',
    desc: 'Just you, fully set up.',
    features: [
      'Perplexity on your computer',
      'Perplexity on your phone',
      'Personal walkthrough so you know how to use it',
      'Quick-start cheat sheet to keep',
    ],
  },
  {
    name: 'Household',
    price: 449,
    originalPrice: 500,
    slug: 'pro-ai-setup-500',
    desc: 'The whole family, fully set up.',
    popular: true,
    savings: 'Saves $390',
    features: [
      'Up to 3 computers',
      "Everyone's phones",
      'Each person gets their own walkthrough',
      'Quick-start cheat sheet for each person',
    ],
  },
  {
    name: 'Business',
    price: 799,
    originalPrice: 1000,
    slug: 'premium-ai-setup-1000',
    desc: 'Your whole team, fully set up.',
    savings: 'Saves $1,434',
    features: [
      'Up to 8 devices',
      "Everyone's phones",
      'Each person gets their own walkthrough',
      'Custom AI prompt library built for your business',
      'Quick-start cheat sheet for each person',
    ],
  },
];
```

- [ ] **Step 3: Verify build passes**

```bash
cd ~/ai-setup-crm && npm run build 2>&1 | tail -10
```

Expected: `✓ built in Xms` with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: update tiers data — Solo/Household/Business with new pricing"
```

---

### Task 2: Update pricing card JSX to render strikethrough prices and savings badges

**File:** `src/pages/Landing.tsx` — the `{/* Pricing */}` section (currently around lines 453–523)

The current card renders the price as:
```tsx
<p className="text-[36px] sm:text-[42px] font-semibold tracking-tight mt-2 leading-none">
  ${tier.price}
</p>
```

And the "Most popular" badge as:
```tsx
{tier.popular && (
  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0071e3] mb-4 block truncate">
    Most popular
  </span>
)}
```

- [ ] **Step 1: Update the label slot (savings badge + Most popular logic)**

Replace the `{tier.popular && ...}` block with:

```tsx
{(tier.savings || tier.popular) && (
  <span className={`text-[10px] font-bold uppercase tracking-widest mb-4 block truncate ${
    tier.savings ? 'text-[#34c759]' : 'text-[#0071e3]'
  }`}>
    {tier.savings ?? 'Most popular'}
  </span>
)}
```

Logic: if `savings` is set → show savings text in green. If only `popular` is true (no savings) → show "Most popular" in blue. The dark card background is still controlled by `tier.popular` on the wrapper div, unchanged.

- [ ] **Step 2: Update the price display to show strikethrough**

Replace the price `<p>` tag with:

```tsx
<div className="flex items-baseline gap-2 mt-2">
  <p className="text-[36px] sm:text-[42px] font-semibold tracking-tight leading-none">
    ${tier.price}
  </p>
  {tier.originalPrice && (
    <span className={`text-[16px] font-normal line-through ${
      tier.popular ? 'text-white/30' : 'text-[#bbb]'
    }`}>
      ${tier.originalPrice.toLocaleString()}
    </span>
  )}
</div>
```

Note: `toLocaleString()` formats 1000 as "1,000" automatically.

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: clean build, no TS errors.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Open http://localhost:5173 and verify:
- Solo card: shows `$279` with `$300` strikethrough, no badge
- Household card: dark background, green "Saves $390" badge, `$449` with `$500` strikethrough
- Business card: green "Saves $1,434" badge, `$799` with `$1,000` strikethrough

- [ ] **Step 5: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: pricing cards show savings badges and strikethrough original prices"
```

---

### Task 3: Update hero subtext

**File:** `src/pages/Landing.tsx` — the `<motion.p>` in the Hero section (around line 288)

- [ ] **Step 1: Find and replace the hero paragraph text**

Find:
```tsx
We come to your home, install Perplexity AI on your computer,
and show you how to actually use it. No tech skills needed.
```

Replace with:
```tsx
We come to you, install Perplexity AI on your computer and your phone — so you're set up everywhere you actually use it. No tech skills needed.
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "fix: update hero copy to mention phone setup"
```

---

### Task 4: Update FAQ answer for "How long does a visit take?"

**File:** `src/pages/Landing.tsx` — the `faqs` array (around lines 80–105)

- [ ] **Step 1: Find and replace the third FAQ answer**

Find the FAQ object with `q: 'How long does a visit take?'` and replace its `a` field:

**From:**
```ts
a: "Basic visits take about 45 minutes. Pro is around 90 minutes. Premium (multiple devices) is about 2 hours. We don't rush — we make sure you feel comfortable before we leave.",
```

**To:**
```ts
a: "It depends on how many devices you have and how many questions you have — we don't rush. We stay until you feel comfortable and confident using it. Most solo visits wrap up in under an hour, but we're not watching the clock.",
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "fix: remove time references from FAQ answer"
```

---

### Task 5: Update testimonials

**File:** `src/pages/Landing.tsx` — the `testimonials` array (around lines 107–132)

- [ ] **Step 1: Update Barbara M.'s quote**

Find: `"Best $300 I've spent in years."`
Replace with: `"Best $279 I've spent in years."`

- [ ] **Step 2: Update Frank R.'s quote**

Find: `"After the Pro session,"`
Replace with: `"After the visit,"`

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "fix: update testimonials to match new pricing and tier names"
```

---

### Task 6: Update booking CTA mini-cards

**File:** `src/pages/Landing.tsx` — the booking CTA section at the bottom (around lines 563–582)

The current mini-card data looks like:
```ts
{ name: 'Basic', price: '$300', slug: 'basic-ai-setup-300', time: '60 min' },
{ name: 'Pro', price: '$500', slug: 'pro-ai-setup-500', time: '90 min' },
{ name: 'Premium', price: '$1,000', slug: 'premium-ai-setup-1000', time: '2 hrs' },
```

And renders as: `{tier.name} · {tier.time}`

- [ ] **Step 1: Replace the mini-card inline array**

Replace the three object literals with:

```ts
{ name: 'Solo',      price: '$279', slug: 'basic-ai-setup-300',    tagline: 'Just you' },
{ name: 'Household', price: '$449', slug: 'pro-ai-setup-500',       tagline: 'Up to 3 computers' },
{ name: 'Business',  price: '$799', slug: 'premium-ai-setup-1000',  tagline: 'Up to 8 devices' },
```

- [ ] **Step 2: Update the render to use `tagline` instead of `time`**

Find: `{tier.name} · {tier.time}`
Replace with: `{tier.name} · {tier.tagline}`

- [ ] **Step 3: Build check — this will fail if TypeScript infers `time` as required**

```bash
npm run build 2>&1 | tail -15
```

If TS errors about `time` not existing on the new type: TypeScript infers the type from the array itself, so replacing all three objects removes `time` from the inferred type and `tagline` appears. This should resolve cleanly. If it doesn't, add an explicit type or use `as const` on the array.

- [ ] **Step 4: Visual check of bottom CTA section**

```bash
npm run dev
```

Scroll to bottom CTA. Verify: "Solo · Just you", "Household · Up to 3 computers", "Business · Up to 8 devices" with prices $279 / $449 / $799.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: update booking CTA mini-cards with new tiers and taglines"
```

---

### Task 7: Final build, full visual review, and deploy

- [ ] **Step 1: Full build**

```bash
cd ~/ai-setup-crm && npm run build 2>&1
```

Expected: clean build, `✓ built in Xms`, no TypeScript errors, only the pre-existing chunk-size warning.

- [ ] **Step 2: Search for any remaining old tier names or prices in Landing.tsx**

```bash
grep -n "Basic\|Pro\|Premium\|\$300\|\$500\|\$1,000\|45 min\|90 min\|2 hour\|2-hour\|45-minute\|90-minute\|about 3 hours\|3 hrs" src/pages/Landing.tsx
```

Expected output: **no matches**. If any matches remain, fix them before deploying.

- [ ] **Step 3: Deploy to production**

```bash
vercel --prod
```

Expected: `Aliased: https://www.simplyai.tech`

- [ ] **Step 4: Final commit if any last fixes were made**

```bash
git add src/pages/Landing.tsx
git commit -m "chore: final cleanup before deploy"
git push
```

---

## Summary of All Changes

| Section | Change |
|---------|--------|
| `tiers` array | Solo/Household/Business, new prices, `savings`, `originalPrice` fields |
| Pricing card JSX | Label slot: savings badge (green) or Most popular (blue). Price: strikethrough original |
| Hero subtext | Add "and your phone" to service description |
| FAQ Q3 | Remove all time references, new answer |
| Testimonials | Barbara: $300→$279. Frank: "Pro session"→"visit" |
| Booking CTA mini-cards | New names/prices, `tagline` replaces `time` |
