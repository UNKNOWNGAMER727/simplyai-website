import { motion, useInView, useScroll } from 'framer-motion';
import { Check, Phone, Calendar, Shield, Star, ChevronDown, MapPin, ArrowRight, Menu, X, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Scroll-triggered fade variant
function useReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return { ref, isInView };
}

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
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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

const faqs = [
  {
    q: 'What exactly do you install?',
    a: 'We install and set up Perplexity AI — the smartest AI search tool available. It answers questions with real sources, helps you research anything, drafts emails, and saves you hours every week. We get it fully configured and show you how to get the most out of it.',
  },
  {
    q: 'Do I need to be tech-savvy?',
    a: "Not at all. That's exactly why we exist. We handle everything — installation, setup, and a hands-on tutorial in plain English. By the time we leave, you'll actually know how to use it.",
  },
  {
    q: 'How long does a visit take?',
    a: "It depends on how many devices you have and how many questions you have — we don't rush. We stay until you feel comfortable and confident using it. Most solo visits wrap up in under an hour, but we're not watching the clock.",
  },
  {
    q: 'Is this a subscription? Will I owe monthly fees?',
    a: "Our service is a one-time fee. Perplexity has a free version that works great. There's an optional Pro upgrade for $20/month if you want extra features, but we'll show you both and you decide — no pressure.",
  },
  {
    q: 'What area do you serve?',
    a: 'We serve the greater Los Angeles area in person (Chatsworth, Northridge, Encino, Tarzana, and surrounding neighborhoods). We also offer remote setup via Zoom for customers anywhere in the US.',
  },
  {
    q: 'Is Perplexity safe to use?',
    a: "Yes. Perplexity is a trusted, well-funded company used by millions of people worldwide. We configure your privacy settings as part of every install so you start off right.",
  },
];

const testimonials = [
  {
    name: 'Barbara M.',
    location: 'Northridge, CA',
    role: 'Retired teacher',
    quote:
      "I was so nervous about AI — I thought it was just for young people. The technician was incredibly patient, explained everything in plain English, and now I use Perplexity every single day. Best $300 I've spent in years.",
    stars: 5,
  },
  {
    name: 'Frank R.',
    location: 'Encino, CA',
    role: 'Small business owner',
    quote:
      'I run a plumbing company and had zero idea how AI could help me. After the Pro session, I now use it to write estimates, answer customer emails, and research codes. It paid for itself in the first week.',
    stars: 5,
  },
  {
    name: 'Diane L.',
    location: 'Tarzana, CA',
    role: 'Realtor',
    quote:
      "Setting up software always stressed me out. These guys showed up on time, set everything up perfectly on my laptop and iPad, and actually taught me how to use it. No confusion, no tech jargon. Highly recommend.",
    stars: 5,
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-[#ff9f0a] fill-[#ff9f0a]" strokeWidth={0} />
      ))}
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left min-h-[44px]"
      >
        <span className="text-[14px] sm:text-[16px] font-medium text-[#1d1d1f] pr-4 sm:pr-6 break-words">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#86868b] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.8}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="overflow-hidden"
      >
        <p className="text-[14px] sm:text-[15px] text-[#86868b] leading-relaxed pb-5">{a}</p>
      </motion.div>
    </div>
  );
}

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="overflow-hidden border-t border-black/[0.04] sm:hidden"
    >
      <nav className="flex flex-col px-6 py-4 gap-1 bg-white/95 backdrop-blur-xl">
        {[
          { href: '#pricing', label: 'Pricing' },
          { href: '#how', label: 'How It Works' },
          { href: '#faq', label: 'FAQ' },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={onClose}
            className="text-[15px] text-[#1d1d1f] py-3 font-medium border-b border-black/[0.04] last:border-0"
          >
            {label}
          </a>
        ))}
        <a
          href="tel:+13613158585"
          className="mt-3 inline-flex items-center justify-center gap-2 bg-[#f5f5f7] text-[#1d1d1f] px-5 py-3.5 rounded-full text-[15px] font-medium min-h-[44px]"
        >
          <Phone className="w-4 h-4" /> (361) 315-8585
        </a>
        <a
          href="#book"
          onClick={onClose}
          className="mt-2 inline-flex items-center justify-center gap-2 bg-[#0071e3] text-white px-5 py-3.5 rounded-full text-[15px] font-medium min-h-[44px]"
        >
          Book Now
        </a>
      </nav>
    </motion.div>
  );
}

function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await fetch('https://webhook.simplyai.tech/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'checklist-optin', name: '' }),
      });
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="bg-[#f0f7ff] py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 text-center">
        <RevealDiv>
          <div className="inline-flex items-center gap-2 bg-[#0071e3]/10 rounded-full px-4 py-1.5 mb-5">
            <Mail className="w-3.5 h-3.5 text-[#0071e3]" />
            <span className="text-[12px] font-medium text-[#0071e3]">Free resource</span>
          </div>
          <h2 className="text-[24px] sm:text-[30px] font-semibold tracking-tight text-[#1d1d1f] mb-3">
            Get the free AI Quick-Start Checklist
          </h2>
          <p className="text-[14px] sm:text-[16px] text-[#86868b] mb-7 max-w-md mx-auto">
            10 things you can do with Perplexity AI today — even if you've never used AI before. Sent straight to your inbox.
          </p>

          {status === 'done' ? (
            <div className="flex items-center justify-center gap-2 text-[#34c759] font-medium text-[15px]">
              <Check className="w-5 h-5" strokeWidth={2.5} />
              Sent! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full border border-black/[0.1] bg-white text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none focus:ring-2 focus:ring-[#0071e3]/30 min-h-[48px]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#0071e3] text-white px-6 py-3.5 rounded-full text-[14px] font-medium hover:bg-[#0077ED] transition-colors min-h-[48px] shrink-0 disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Send it to me'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-3 text-[13px] text-red-500">Something went wrong — try calling us instead.</p>
          )}
          <p className="text-[11px] text-[#86868b] mt-4">No spam. Unsubscribe any time.</p>
        </RevealDiv>
      </div>
    </section>
  );
}

export function Landing() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 20));
    return unsub;
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-white/80 backdrop-blur-xl border-b border-black/[0.04]'
        }`}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex items-center justify-between h-12 sm:h-14">
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">Simply AI</span>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            <a href="#pricing" className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">Pricing</a>
            <a href="#how" className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">How It Works</a>
            <a href="#faq" className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">FAQ</a>
            <a
              href="#book"
              className="bg-[#0071e3] text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#0077ED] transition-colors min-h-[32px] inline-flex items-center"
            >
              Book Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            className="sm:hidden flex items-center justify-center w-10 h-10 text-[#1d1d1f]"
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 pt-14 sm:pt-24 pb-14 sm:pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex items-center gap-2 bg-[#f5f5f7] rounded-full px-4 py-1.5 mb-5"
        >
          <MapPin className="w-3.5 h-3.5 text-[#0071e3]" strokeWidth={2} />
          <span className="text-[12px] font-medium text-[#86868b]">Serving Los Angeles & Remote Nationwide</span>
        </motion.div>

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

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[17px] sm:text-[19px] text-[#86868b] mt-5 sm:mt-6 max-w-xl mx-auto leading-relaxed px-2"
        >
          We come to you, install Perplexity AI on your computer and your phone — so you're set up everywhere you actually use it. No tech skills needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.21, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-7 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
        >
          <a
            href="#book"
            className="inline-flex items-center justify-center gap-2 bg-[#0071e3] text-white px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0077ED] transition-colors min-h-[52px] sm:min-h-[44px]"
          >
            Book Your Install <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="tel:+13613158585"
            className="inline-flex items-center justify-center gap-2 text-[#0071e3] px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0071e3]/5 transition-colors border border-[#0071e3]/20 min-h-[52px] sm:min-h-[44px]"
          >
            <Phone className="w-4 h-4" /> (361) 315-8585
          </a>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#f5f5f7] py-5 sm:py-6">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 flex items-center justify-center gap-5 sm:gap-10 flex-wrap">
          {[
            'Trusted AI tools only',
            'Privacy configured',
            'In-person or remote',
            'No subscriptions',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#34c759]" strokeWidth={2.5} />
              <span className="text-[12px] sm:text-[13px] font-medium text-[#6e6e73]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What We Install */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <RevealDiv className="text-center">
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1d1d1f] mb-3 sm:mb-4">
            What we set up for you.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#86868b] mb-10 sm:mb-12 max-w-lg mx-auto">
            We specialize in Perplexity AI — the smartest, most useful AI tool for everyday people.
          </p>
        </RevealDiv>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              emoji: '🔍',
              name: 'Perplexity AI',
              desc: "Ask any question, get a clear answer with real sources. Like Google, but it actually understands what you're asking.",
            },
            {
              emoji: '⚡',
              name: 'Personalized Setup',
              desc: 'We configure it for how you actually use your computer — shortcuts, settings, and a workflow that fits your life.',
            },
            {
              emoji: '🎓',
              name: 'Hands-On Training',
              desc: "We don't just install and leave. We sit with you, show you the best tricks, and make sure you feel confident.",
            },
          ].map((product, i) => (
            <RevealDiv
              key={product.name}
              delay={i * 0.07}
              className="bg-white rounded-2xl p-6 sm:p-7 text-center border border-black/[0.06] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-500"
            >
              <span className="text-4xl">{product.emoji}</span>
              <h3 className="text-[16px] sm:text-[17px] font-semibold mt-4 mb-2 text-[#1d1d1f]">{product.name}</h3>
              <p className="text-[13px] sm:text-[14px] text-[#86868b] leading-relaxed">{product.desc}</p>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-[#1d1d1f] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center text-white">
          <RevealDiv>
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight mb-3 sm:mb-4">
              How it works.
            </h2>
            <p className="text-[15px] sm:text-[17px] text-white/50 mb-12 sm:mb-16 max-w-md mx-auto">
              Four simple steps. We handle most of them.
            </p>
          </RevealDiv>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '01', icon: Calendar, title: 'You book', desc: 'Pick a time that works for you online or by phone' },
              { step: '02', icon: MapPin, title: 'We come to you', desc: 'We arrive at your home or connect via Zoom' },
              { step: '03', icon: Shield, title: 'We set it up', desc: 'Install Perplexity AI, configure privacy, and personalize it for you' },
              { step: '04', icon: Star, title: 'We teach you', desc: 'Hands-on training until you feel confident' },
            ].map((item, i) => (
              <RevealDiv key={item.step} delay={0.06 + i * 0.07}>
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-[#0071e3]" strokeWidth={1.8} />
                </div>
                <h3 className="text-[14px] sm:text-[15px] font-semibold mb-1.5">{item.title}</h3>
                <p className="text-[12px] sm:text-[13px] text-white/40 leading-relaxed">{item.desc}</p>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <RevealDiv className="text-center mb-10 sm:mb-12">
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1d1d1f] mb-3">
            What our customers say.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#86868b] max-w-md mx-auto">
            Real people from the LA area. No tech background required.
          </p>
        </RevealDiv>

        {/* Trust badges row */}
        <RevealDiv delay={0.05} className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap mb-10 sm:mb-12">
          {[
            { label: 'Google', rating: '5.0', stars: 5, color: '#4285F4' },
            { label: 'Yelp', rating: '5.0', stars: 5, color: '#d32323' },
            { label: 'BBB Accredited', rating: 'A+', stars: 0, color: '#003f87' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2.5 bg-[#f5f5f7] rounded-xl px-4 py-2.5"
            >
              <span className="text-[13px] font-bold" style={{ color: badge.color }}>
                {badge.label}
              </span>
              <span className="text-[13px] font-semibold text-[#1d1d1f]">{badge.rating}</span>
              {badge.stars > 0 && <StarRow count={badge.stars} />}
            </div>
          ))}
        </RevealDiv>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
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
              <div>
                <p className="text-[13px] font-semibold text-[#1d1d1f]">{t.name}</p>
                <p className="text-[12px] text-[#86868b] mt-0.5">{t.role} · {t.location}</p>
              </div>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* Email Capture */}
      <EmailCapture />

      {/* Pricing */}
      <section id="pricing" className="bg-[#f5f5f7] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <RevealDiv className="text-center mb-10 sm:mb-12">
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1d1d1f] mb-3 sm:mb-4">
              Simple pricing.
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#86868b]">
              One visit. One fee. No monthly charges from us.
            </p>
          </RevealDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-5">
            {tiers.map((tier, i) => (
              <RevealDiv key={tier.name} delay={i * 0.07}>
                <div
                  className={`rounded-3xl p-5 sm:p-7 h-full ${
                    tier.popular
                      ? 'bg-[#1d1d1f] text-white ring-1 ring-[#1d1d1f]'
                      : 'bg-white border border-black/[0.06]'
                  }`}
                >
                  {(tier.savings || tier.popular) && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-4 block truncate ${
                      tier.savings ? 'text-[#34c759]' : 'text-[#0071e3]'
                    }`}>
                      {tier.savings ?? 'Most popular'}
                    </span>
                  )}
                  <h3
                    className={`text-[13px] font-semibold uppercase tracking-wider ${
                      tier.popular ? 'text-white/50' : 'text-[#86868b]'
                    }`}
                  >
                    {tier.name}
                  </h3>
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
                  <p className={`text-[14px] mt-2 mb-5 sm:mb-7 ${tier.popular ? 'text-white/40' : 'text-[#86868b]'}`}>
                    {tier.desc}
                  </p>
                  <a
                    href={`https://cal.com/simplytech.ai/${tier.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full block text-center py-3 rounded-full text-[14px] font-medium mb-5 sm:mb-6 transition-colors min-h-[44px] flex items-center justify-center ${
                      tier.popular
                        ? 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
                        : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                    }`}
                  >
                    Book Now
                  </a>
                  <div className="space-y-2 sm:space-y-3">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? 'text-[#0071e3]' : 'text-[#34c759]'}`}
                          strokeWidth={2.5}
                        />
                        <span className={`text-[12px] sm:text-[13px] leading-snug ${tier.popular ? 'text-white/70' : 'text-[#424245]'}`}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-2xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <RevealDiv className="text-center mb-10 sm:mb-12">
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1d1d1f]">
            Questions? Answers.
          </h2>
        </RevealDiv>
        <RevealDiv delay={0.06} className="bg-white rounded-2xl border border-black/[0.06] px-5 sm:px-6">
          {faqs.map((faq) => (
            <FAQ key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </RevealDiv>
      </section>

      {/* Booking CTA */}
      <section id="book" className="max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-20">
        <RevealDiv>
          <div className="bg-[#1d1d1f] rounded-3xl p-6 sm:p-12 text-center text-white">
            <h2 className="text-[22px] sm:text-[32px] font-semibold tracking-tight mb-3">Ready to get started?</h2>
            <p className="text-[14px] sm:text-[17px] text-white/50 mb-6 sm:mb-8 max-w-md mx-auto">
              Book your Perplexity install today. We'll come to you, get everything set up, and make sure you're comfortable using it before we leave.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <a
                href="tel:+13613158585"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1d1d1f] px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-white/90 transition-colors min-h-[52px] sm:min-h-[44px]"
              >
                <Phone className="w-4 h-4" /> (361) 315-8585
              </a>
              <a
                href="https://cal.com/simplytech.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium border border-white/20 hover:bg-white/10 transition-colors min-h-[52px] sm:min-h-[44px]"
              >
                <Calendar className="w-4 h-4" /> Book Online
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {[
                { name: 'Basic', price: '$300', slug: 'basic-ai-setup-300', time: '60 min' },
                { name: 'Pro', price: '$500', slug: 'pro-ai-setup-500', time: '90 min' },
                { name: 'Premium', price: '$1,000', slug: 'premium-ai-setup-1000', time: '2 hrs' },
              ].map((tier) => (
                <a
                  key={tier.name}
                  href={`https://cal.com/simplytech.ai/${tier.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl p-3 sm:p-5 text-center transition-all duration-300 min-h-[44px]"
                >
                  <p className="text-[18px] sm:text-[20px] font-semibold text-white">{tier.price}</p>
                  <p className="text-[12px] sm:text-[13px] text-white/50 mt-1">{tier.name} · {tier.time}</p>
                  <p className="text-[12px] text-[#0071e3] mt-2 font-medium">Book Now</p>
                </a>
              ))}
            </div>
          </div>
        </RevealDiv>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-8">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <p className="text-[13px] font-semibold text-[#1d1d1f]">Simply AI</p>
            <p className="text-[12px] text-[#86868b] mt-0.5">AI setup for everyone. Los Angeles & remote.</p>
          </div>
          <div className="flex items-center gap-5 sm:gap-6">
            <a href="tel:+13613158585" className="text-[12px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">(361) 315-8585</a>
            <a href="https://cal.com/simplytech.ai" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">Book Online</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
