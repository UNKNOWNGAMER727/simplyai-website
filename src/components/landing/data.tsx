import type { Tier, FaqItem, Testimonial, StepLabel } from './types';

export const tiers: Tier[] = [
  {
    name: 'Starter', price: 199, slug: 'basic-ai-setup-300',
    desc: 'Per computer. AI assistant installed & configured.',
    features: ['AI assistant installed & configured on each computer', 'Account setup per user', 'Privacy & security settings applied', 'Quick-start tips sheet for each employee'],
  },
  {
    name: 'Pro', price: 299, slug: 'basic-ai-setup-300',
    desc: 'Per computer. Full AI Pro setup.', popular: true,
    features: ['Everything in Starter', 'AI Pro features activated & configured', 'Custom shortcuts & workflow setup', 'Industry-specific team tips sheet built for your business', 'Priority scheduling'],
  },
  {
    name: 'Phone Add-on', price: 99, slug: 'basic-ai-setup-300',
    desc: 'Per employee phone. Mobile AI assistant setup.',
    features: ['AI assistant installed on employee phones', 'Mobile app configured & synced to desktop', 'Same account as computer setup', 'Add to any Starter or Pro plan'],
  },
];

export const faqs: FaqItem[] = [
  { q: 'Do I need to buy a subscription?', a: "Yes — the AI tool has a free version that works great, and an optional Pro upgrade at $20/mo per user. You purchase it directly. Our setup fee covers the installation and configuration only. We'll help you pick the right plan during your Discovery Call." },
  { q: 'What AI tool do you install?', a: 'We install Perplexity AI — a professional research assistant used by millions of businesses. You\'ll purchase your own subscription (there\'s a free tier), and we handle every step of the setup: installation, account creation, privacy configuration, and shortcuts tailored to your industry.' },
  { q: 'What if my team isn\'t tech-savvy?', a: "That's exactly who we built this for. The AI assistant is as easy as Google — type a question, get an answer. We set everything up and leave a quick-start guide. Most teams are using it confidently within 5 minutes." },
  { q: 'What if I don\'t like it?', a: "We offer a 100% setup guarantee. If you're not happy with the installation, we come back and fix it free. No questions asked." },
  { q: 'How is this different from just using ChatGPT?', a: "ChatGPT requires your team to know what to do with it. We install a purpose-built AI assistant that's configured for your specific business, with privacy settings, shortcuts, and everything ready to go. Think of it as the difference between buying furniture from IKEA and having it delivered assembled." },
  { q: 'How long does an office visit take?', a: "For most offices of 2–5 people, we're done in under an hour. Larger teams may take a bit longer. We work efficiently — this isn't a training session, it's a setup. We get in, get it done, and get out." },
  { q: 'What if I need help after setup?', a: "Call us anytime at (361) 315-8585. Our AI receptionist Simi is available 24/7, and Kyle personally follows up on every call within the hour." },
  { q: 'Is this a one-time fee or ongoing?', a: "Our service is a one-time fee per computer. We don't charge monthly retainers. The AI assistant has a free version that works great for most businesses, and an optional Pro upgrade at $20/month per user if you want the full power — we'll show you both and you decide." },
  { q: 'What area do you serve?', a: 'We serve the greater Los Angeles area in person — including the Valley (Chatsworth, Northridge, Encino, Tarzana), West LA, and surrounding neighborhoods. Outside LA? We offer remote setup via Zoom for businesses anywhere in the US.' },
  { q: 'Is the AI assistant safe for business use?', a: "Yes. The AI tool we install is trusted by millions of professionals worldwide. We configure privacy settings on every install to ensure your team's searches and data are handled appropriately from day one." },
];

export const testimonials: Testimonial[] = [
  { name: 'Marcus T., Attorney', location: 'Encino, CA', role: 'Law Firm', stars: 5,
    quote: "We had 5 attorneys and none of them were using AI. SimplyAI came in, set up the AI assistant on every computer in under an hour, and left. No long meetings, no training sessions. Our team figured it out on their own — it's that intuitive." },
  { name: 'Frank R., Contractor', location: 'Studio City, CA', role: 'Plumbing Company', stars: 5,
    quote: 'I had zero idea how AI could help my business. After the visit, I now use it to write estimates, answer customer emails, and look up codes. It paid for itself in the first week.' },
  { name: 'Diane L., Broker', location: 'Tarzana, CA', role: 'Real Estate Team', stars: 5,
    quote: "I run a small real estate team. They installed the AI tool on all three of our computers in about 45 minutes. No disruption to our day. We were using it the same afternoon to write listings. Highly recommend." },
  { name: 'Sarah K., Office Manager', location: 'Northridge, CA', role: 'Dental Office', stars: 5,
    quote: "Our front desk used to spend 20 minutes per patient on follow-up emails. Now it takes 30 seconds. The whole office is obsessed with it." },
  { name: 'James W., Freelancer', location: 'West Hollywood, CA', role: 'Graphic Designer', stars: 5,
    quote: "I'm not a business — just a guy who wanted AI on his laptop without the hassle. Kyle came over, set it up in 20 minutes, and now I use it every single day for client proposals." },
  { name: 'Linda M., Property Manager', location: 'Sherman Oaks, CA', role: 'Property Management', stars: 5,
    quote: "Managing 40 units means constant tenant emails. The AI drafts responses in my voice perfectly. I just review and send. It's saved me at least 10 hours a week." },
];

export const STEP_LABELS: StepLabel[] = [
  { headline: "Book a free 15-minute call.", sub: "Tell us about your business and how many computers need setup. We'll help you pick the right AI subscription plan." },
  { headline: "We visit your office.", sub: "Our tech installs and configures the AI assistant on each computer you've purchased setup for." },
  { headline: "Your team starts using it immediately.", sub: "No training needed. We leave a quick-start guide. Need help later? Call us anytime — we personally follow up within the hour." },
];

