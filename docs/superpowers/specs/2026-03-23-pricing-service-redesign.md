# SimplyAI — Pricing & Service Redesign

**Date:** 2026-03-23
**Status:** Approved

---

## What We're Changing

Redesign the service offering, pricing tiers, and copy on the SimplyAI landing page (`src/pages/Landing.tsx`) to:

1. Accurately reflect the actual service (Perplexity on computer + phone)
2. Remove all time references from pricing cards
3. Use outcome-based language ("fully set up", "you leave knowing how to use it")
4. Make pricing feel like a deal through savings math and slight price drops
5. Rename tiers from Basic/Pro/Premium to Solo/Household/Business

---

## Service Definition

**One service, done right:** Come to the customer, install Perplexity AI on their computer, show them how to use it on their phone too. Leave when they're comfortable. Every tier includes phone setup — it's called out explicitly as part of the value.

---

## New Pricing Tiers

### Solo — $279 ~~$300~~
**Tagline:** Just you, fully set up

Features:
- Perplexity on your computer
- Perplexity on your phone
- Personal walkthrough so you know how to use it
- Quick-start cheat sheet to keep

---

### Household — $449 ~~$500~~ ⭐ Best Value · Saves $390
**Tagline:** The whole family, fully set up

Features:
- Up to 3 computers
- Everyone's phones
- Each person gets their own walkthrough
- Quick-start cheat sheet for each person

Savings math: 3 × $279 = $837 → pay $449 = saves $388 (show as "Saves $390")

---

### Business — $799 ~~$1,000~~ · Saves $1,434 vs solo visits
**Tagline:** Your whole team, fully set up

Features:
- Up to 8 devices
- Everyone's phones
- Each person gets their own walkthrough
- Custom AI prompt library built for your business
- Quick-start cheat sheet for each person

Savings math: 8 × $279 = $2,232 → pay $799 = saves $1,433 (show as "Saves $1,434")

---

## Copy Changes

### Remove everywhere:
- All time references: "45-minute", "90-minute", "2-hour", "60 min", "90 min", "2 hrs"
- Old tier names: Basic, Pro, Premium
- Old prices: $300, $500, $1,000 (replace with new prices)

### Add everywhere:
- Phone setup called out explicitly in each tier's feature list
- "Saves $X" badge on Household and Business tiers
- Strikethrough old price next to new price on all tiers
- Outcome language: "fully set up", "you leave knowing exactly what to do"

### Hero/description copy update:
From: "We come to your home, install Perplexity AI on your computer, and show you how to actually use it."
To: "We come to you, install Perplexity AI on your computer, and show you how to use it on your phone too — so you're set up everywhere you actually use it."

---

## Files to Change

- `src/pages/Landing.tsx` — tiers array, booking CTA mini-cards, hero subtext

### Specific changes in `tiers` array:
- Rename slugs: `basic-ai-setup-300` → `solo-ai-setup-279`, etc. (or keep old slugs if Cal.com links can't change)
- Update all `name`, `price`, `desc`, `features` fields
- Add `savings` field for the badge text on Household and Business
- Add `originalPrice` field for strikethrough display

### Booking CTA section (bottom of page):
- Update mini-cards: Solo $279 / Household $449 / Business $799
- Remove time references ("60 min", "90 min", "2 hrs")

---

## What We're NOT Changing

- Site layout and visual design
- Color scheme
- Section order
- Cal.com booking links structure (just update slugs/prices)
- FAQ content (mostly still accurate, minor review needed)
- Testimonials
- Trust badges
- Email capture section (just added)
