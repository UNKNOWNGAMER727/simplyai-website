# SimplyAI — Pricing & Service Redesign

**Date:** 2026-03-23
**Status:** Approved

---

## What We're Changing

Redesign the service offering, pricing tiers, and copy on the SimplyAI landing page (`src/pages/Landing.tsx`) to:

1. Accurately reflect the actual service (Perplexity on computer + phone)
2. Remove all time references from pricing cards and FAQ
3. Use outcome-based language ("fully set up", "you leave knowing how to use it")
4. Make pricing feel like a deal through savings math and slight price drops
5. Rename tiers from Basic/Pro/Premium to Solo/Household/Business

---

## Service Definition

**One service, done right:** Come to the customer, install Perplexity AI on their computer, show them how to use it on their phone too. Leave when they're comfortable. Every tier includes phone setup — it's called out explicitly as part of the value.

---

## New Pricing Tiers

### Tier Data Shape

Add two new optional fields to each tier object:
```ts
{
  name: string
  price: number
  originalPrice?: number   // shown with strikethrough inline after new price
  slug: string
  desc: string
  features: string[]
  popular?: boolean        // if true: dark card treatment
  savings?: string         // badge shown above the price (e.g. "Saves $390")
}
```

**Strikethrough price** renders inline after the new price: `$279 ~~$300~~`
**Savings badge** renders as a small pill/label directly above the tier name, in the same slot as the "Most popular" label.

Render logic for the label slot:
- If `savings` is set → show savings badge (green/`#34c759` text), suppress "Most popular" text
- If `popular` is true but `savings` is not set → show "Most popular" (blue text, existing behavior)
- The `popular` flag still controls dark card background/styling regardless of which label shows

So Household (`popular: true`, `savings: "Saves $390"`) → shows dark card background + green "Saves $390" badge (NOT "Most popular" text).

---

### Solo — $279 (originalPrice: $300)
**Slug:** `basic-ai-setup-300` — **keep existing Cal.com slug, do not change**
**popular:** false
**savings:** none
**desc:** Just you, fully set up

Features:
- Perplexity on your computer
- Perplexity on your phone
- Personal walkthrough so you know how to use it
- Quick-start cheat sheet to keep

---

### Household — $449 (originalPrice: $500) ⭐ popular: true
**Slug:** `pro-ai-setup-500` — **keep existing Cal.com slug, do not change**
**popular:** true (dark card treatment)
**savings:** "Saves $390" (intentional display value — actual math is $388, rounded up for cleaner copy)
**desc:** The whole family, fully set up

Features:
- Up to 3 computers
- Everyone's phones
- Each person gets their own walkthrough
- Quick-start cheat sheet for each person

---

### Business — $799 (originalPrice: $1,000)
**Slug:** `premium-ai-setup-1000` — **keep existing Cal.com slug, do not change**
**popular:** false
**savings:** "Saves $1,434" (intentional display value — actual math is $1,433, rounded up for cleaner copy)
**desc:** Your whole team, fully set up

Features:
- Up to 8 devices
- Everyone's phones
- Each person gets their own walkthrough
- Custom AI prompt library built for your business
- Quick-start cheat sheet for each person

---

## Copy Changes

### Remove everywhere:
- All time references: "45-minute", "90-minute", "2-hour", "60 min", "90 min", "2 hrs", "45 minutes", "90 minutes", "2 hours", "about 3 hours"
- Old tier names in copy: Basic, Pro, Premium
- Old prices in copy: $300, $500, $1,000 (replace with new prices where they appear as copy)

### Hero subtext update:
**From:** "We come to your home, install Perplexity AI on your computer, and show you how to actually use it. No tech skills needed."
**To:** "We come to you, install Perplexity AI on your computer and your phone — so you're set up everywhere you actually use it. No tech skills needed."

---

## FAQ Updates

**Question 3 ("How long does a visit take?") — replace answer entirely:**

Old answer: `"Basic visits take about 45 minutes. Pro is around 90 minutes. Premium (multiple devices) is about 2 hours. We don't rush — we make sure you feel comfortable before we leave."`

New answer: `"It depends on how many devices you have and how many questions you have — we don't rush. We stay until you feel comfortable and confident using it. Most solo visits wrap up in under an hour, but we're not watching the clock."`

All other FAQ answers remain unchanged.

---

## Testimonial Updates

Update two testimonials to match new pricing/naming:

**Barbara M.** — change `"Best $300 I've spent in years."` → `"Best $279 I've spent in years."`

**Frank R.** — change `"After the Pro session"` → `"After the visit"` (remove specific tier name reference)

---

## Booking CTA Mini-Cards (bottom section)

Replace the `time` field with a short `tagline` field. New mini-card data:

```ts
{ name: 'Solo',      price: '$279', slug: 'basic-ai-setup-300',    tagline: 'Just you' },
{ name: 'Household', price: '$449', slug: 'pro-ai-setup-500',       tagline: 'Up to 3 computers' },
{ name: 'Business',  price: '$799', slug: 'premium-ai-setup-1000',  tagline: 'Up to 8 devices' },
```

Render as: `{tier.name} · {tier.tagline}` (replaces `{tier.name} · {tier.time}`)

---

## What We're NOT Changing

- Site layout and visual design
- Color scheme
- Section order
- Cal.com booking links (keep all existing slugs as-is)
- Trust badges
- Email capture section
