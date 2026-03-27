# Cal.com Audit Notes — 2026-03-27

## Current Setup

- **Username:** `simplytech.ai` → booking URL: `cal.com/simplytech.ai`
- **Google Calendar:** 4kylelee@gmail.com (connected)
- **Event types (3):**
  | Slug | Display Name | Price |
  |------|-------------|-------|
  | basic-ai-setup-300 | Basic AI Setup | $300 |
  | pro-ai-setup-500 | Pro AI Setup | $500 |
  | premium-ai-setup-1000 | Premium AI Setup | $1,000 |

---

## Audit Findings

### ✅ What's Working
- 3 event types match the current pricing tiers exactly
- Google Calendar sync prevents double-booking
- Cal.com IDs are wired correctly in `elevenlabs-webhook.mjs` (IDs: 5104292, 5104737, 5104746)
- Webhook receives booking confirmation and routes to Paperclip agents

### ⚠️ Recommended Changes for B2B Pivot

#### 1. Event Names → B2B Language
Current names ("Basic AI Setup") skew toward consumers. For businesses:
- `basic-ai-setup-300` → rename to **"Starter Setup — 1 Workstation"**
- `pro-ai-setup-500` → rename to **"Business Setup — 1 Workstation"**
- `premium-ai-setup-1000` → rename to **"Team Setup — Up to 3 Workstations"**

#### 2. Add Buffer Time Between Appointments
Currently unknown if buffer is set. Recommended:
- **30 min buffer** after each appointment (travel time + wrap-up)
- Set in Cal.com: Event settings → Buffer time → 30 min after event

#### 3. Booking Questions — Capture Business Context
Add custom questions to each event type so Kyle/installer knows what to expect:
- "Company name (if applicable)"
- "Operating system: Mac / Windows / Both"
- "Number of workstations to set up"
- "Any IT restrictions or company security policies?"

#### 4. Duration Alignment
- Basic: set to **45 min** (gives installer room without rushing)
- Pro: set to **60 min**
- Premium: set to **75 min** (up to 3 devices)

#### 5. Payment Collection Before Appointment
- Enable **Stripe** or **PayPal** payment collection at booking time
- This prevents no-shows and ensures Kyle gets paid before the installer goes out

#### 6. Confirmation Emails — B2B Wording
Update the Cal.com confirmation email template to say:
> "Your AI workstation setup appointment is confirmed. Our installer will arrive at [time]. No preparation needed — we handle everything."

Remove consumer language ("walkthrough", "training session") from event descriptions since Kyle no longer wants training included.

#### 7. Consider a Separate Booking Link for the Installer
Once a tech is hired, consider creating a separate Cal.com user or team so:
- The installer has their own calendar
- Kyle can see all installer bookings in one dashboard
- Clients book Kyle's link → Kyle assigns to installer

---

## Priority Actions

| Priority | Action | Where |
|----------|--------|-------|
| HIGH | Add buffer time (30 min after) | Cal.com event settings |
| HIGH | Enable payment at booking (Stripe) | Cal.com payments |
| HIGH | Update event descriptions — remove "training" language | Cal.com event settings |
| MED | Add booking questions (company name, OS, # workstations) | Cal.com event settings |
| MED | Rename events to B2B-friendly names | Cal.com event settings |
| LOW | Create installer sub-calendar or team | Cal.com teams |

---

## No Breaking Changes Required

The Cal.com event IDs (5104292, 5104737, 5104746) are hardcoded in `elevenlabs-webhook.mjs` and `webhook-server.mjs`. **Do not change event IDs.** Renaming the display name and slug is safe — IDs stay the same.
