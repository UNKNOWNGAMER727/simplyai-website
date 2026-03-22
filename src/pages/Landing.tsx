import { motion } from 'framer-motion';
import { Check, Phone, Calendar, Shield, Star, ChevronDown, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
});

const tiers = [
  {
    name: 'Basic',
    price: 300,
    slug: 'basic-ai-setup-300',
    desc: 'Get started with AI on your computer.',
    features: [
      'Perplexity AI installed & configured',
      'Microsoft Copilot activated',
      'Account creation & setup',
      '30-minute hands-on tutorial',
      'Quick-start cheat sheet to keep',
    ],
  },
  {
    name: 'Pro',
    price: 500,
    slug: 'pro-ai-setup-500',
    desc: 'The full AI experience, personalized for you.',
    popular: true,
    features: [
      'Everything in Basic',
      'Perplexity Pro upgrade (first month included)',
      'ChatGPT installed & configured',
      'Privacy & safety settings configured',
      '1-hour personal training session',
      'Custom bookmarks & workflow tips',
      '7 days of email support',
    ],
  },
  {
    name: 'Premium',
    price: 1000,
    slug: 'premium-ai-setup-1000',
    desc: 'Complete AI transformation for your life.',
    features: [
      'Everything in Pro',
      'Perplexity Pro + ChatGPT Plus + Copilot Pro',
      'Set up on up to 3 devices',
      'Custom prompt library built for you',
      '2-hour deep-dive training',
      '30 days of phone & email support',
      'Follow-up home visit included',
    ],
  },
];

const faqs = [
  {
    q: 'What exactly do you install?',
    a: 'We set up Perplexity AI, Microsoft Copilot, and ChatGPT on your computer. These are trusted AI tools from major companies that help you search the web smarter, write emails, answer questions, and much more.',
  },
  {
    q: 'Do I need to be tech-savvy?',
    a: 'Not at all! That\'s exactly why we exist. We handle everything — installation, setup, and we teach you how to use it in plain English. No technical knowledge needed.',
  },
  {
    q: 'How long does an install take?',
    a: 'A Basic install takes about 45 minutes. Pro takes about 1.5 hours, and Premium can take 2-3 hours depending on how many devices. We don\'t rush — we make sure you\'re comfortable before we leave.',
  },
  {
    q: 'Is this a subscription? Will I owe monthly fees?',
    a: 'Our service is a one-time fee. Some AI tools have optional paid upgrades ($20/month for premium features), but the basic versions we install are completely free to use forever.',
  },
  {
    q: 'What area do you serve?',
    a: 'We serve the greater Los Angeles area in person (Chatsworth, Northridge, Encino, Tarzana, and surrounding neighborhoods). We also offer remote setup via Zoom for customers anywhere in the US.',
  },
  {
    q: 'Is AI safe to use?',
    a: 'Yes! The tools we install are made by Microsoft, OpenAI, and Perplexity — trusted companies. We also configure privacy and safety settings as part of every install. We never install anything that could harm your computer.',
  },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-[16px] font-medium text-[#1d1d1f] pr-8">{q}</span>
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
        <p className="text-[15px] text-[#86868b] leading-relaxed pb-5">{a}</p>
      </motion.div>
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-12">
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">Simply AI</span>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">Pricing</a>
            <a href="#how" className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">How It Works</a>
            <a href="#faq" className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">FAQ</a>
            <a
              href="#book"
              className="bg-[#0071e3] text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#0077ED] transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-[#f5f5f7] rounded-full px-4 py-1.5 mb-6">
          <MapPin className="w-3.5 h-3.5 text-[#0071e3]" strokeWidth={2} />
          <span className="text-[12px] font-medium text-[#86868b]">Serving Los Angeles & Remote Nationwide</span>
        </motion.div>
        <motion.h1 {...fade(0.06)} className="text-[56px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] max-w-3xl mx-auto">
          AI on your computer.
          <br />
          <span className="text-[#86868b]">Set up in under an hour.</span>
        </motion.h1>
        <motion.p {...fade(0.12)} className="text-[19px] text-[#86868b] mt-6 max-w-xl mx-auto leading-relaxed">
          We come to your home, install AI tools on your desktop or laptop,
          and teach you how to use them. No tech skills needed.
        </motion.p>
        <motion.div {...fade(0.18)} className="mt-8 flex justify-center gap-4">
          <a
            href="#book"
            className="inline-flex items-center gap-2 bg-[#0071e3] text-white px-7 py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0077ED] transition-colors"
          >
            Book Your Install <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="tel:+13613158585"
            className="inline-flex items-center gap-2 text-[#0071e3] px-7 py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0071e3]/5 transition-colors border border-[#0071e3]/20"
          >
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#f5f5f7] py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-10 flex-wrap">
          {[
            'Trusted AI tools only',
            'Privacy configured',
            'In-person or remote',
            'No subscriptions',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#34c759]" strokeWidth={2.5} />
              <span className="text-[13px] font-medium text-[#6e6e73]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What We Install */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fade(0)} className="text-[36px] font-semibold tracking-tight text-center text-[#1d1d1f] mb-4">
          What we set up for you.
        </motion.h2>
        <motion.p {...fade(0.04)} className="text-[17px] text-[#86868b] text-center mb-12 max-w-lg mx-auto">
          Trusted AI tools from the biggest names in tech. Safe, easy to use, and genuinely helpful.
        </motion.p>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              emoji: '🔍',
              name: 'Perplexity',
              desc: 'Ask any question and get a clear answer with real sources. Like Google, but it actually answers you.',
            },
            {
              emoji: '🪟',
              name: 'Microsoft Copilot',
              desc: 'Built into Windows. Helps you write emails, summarize documents, and get things done faster.',
            },
            {
              emoji: '💬',
              name: 'ChatGPT',
              desc: 'The world\'s most popular AI. Write, brainstorm, learn, create — just by having a conversation.',
            },
          ].map((product, i) => (
            <motion.div
              key={product.name}
              {...fade(i * 0.06)}
              className="bg-white rounded-2xl p-7 text-center border border-black/[0.06] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-500"
            >
              <span className="text-4xl">{product.emoji}</span>
              <h3 className="text-[17px] font-semibold mt-4 mb-2 text-[#1d1d1f]">{product.name}</h3>
              <p className="text-[14px] text-[#86868b] leading-relaxed">{product.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-[#1d1d1f] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <motion.h2 {...fade(0)} className="text-[36px] font-semibold tracking-tight mb-4">
            How it works.
          </motion.h2>
          <motion.p {...fade(0.04)} className="text-[17px] text-white/50 mb-16 max-w-md mx-auto">
            Four simple steps. We handle most of them.
          </motion.p>
          <div className="grid grid-cols-4 gap-8">
            {[
              { step: '01', icon: Calendar, title: 'You book', desc: 'Pick a time that works for you online or by phone' },
              { step: '02', icon: MapPin, title: 'We come to you', desc: 'We arrive at your home or connect via Zoom' },
              { step: '03', icon: Shield, title: 'We set it up', desc: 'Install AI tools, configure privacy, and customize' },
              { step: '04', icon: Star, title: 'We teach you', desc: 'Hands-on training until you feel confident' },
            ].map((item, i) => (
              <motion.div key={item.step} {...fade(0.06 + i * 0.06)}>
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-[#0071e3]" strokeWidth={1.8} />
                </div>
                <h3 className="text-[15px] font-semibold mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fade(0)} className="text-[36px] font-semibold tracking-tight text-center text-[#1d1d1f] mb-4">
          Simple pricing.
        </motion.h2>
        <motion.p {...fade(0.04)} className="text-[17px] text-[#86868b] text-center mb-12">
          One visit. One fee. No monthly charges from us.
        </motion.p>
        <div className="grid grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              {...fade(i * 0.06)}
              className={`rounded-3xl p-8 ${
                tier.popular
                  ? 'bg-[#1d1d1f] text-white ring-1 ring-[#1d1d1f]'
                  : 'bg-white border border-black/[0.06]'
              }`}
            >
              {tier.popular && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0071e3] mb-4 block">
                  Most popular
                </span>
              )}
              <h3 className={`text-[13px] font-semibold uppercase tracking-wider ${
                tier.popular ? 'text-white/50' : 'text-[#86868b]'
              }`}>
                {tier.name}
              </h3>
              <p className="text-[48px] font-semibold tracking-tight mt-2 leading-none">
                ${tier.price}
              </p>
              <p className={`text-[14px] mt-2 mb-8 ${tier.popular ? 'text-white/40' : 'text-[#86868b]'}`}>
                {tier.desc}
              </p>
              <a
                href={`https://cal.com/simplytech.ai/${tier.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center py-2.5 rounded-full text-[14px] font-medium mb-6 transition-colors ${
                  tier.popular
                    ? 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                }`}
              >
                Book Now
              </a>
              <div className="space-y-3">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? 'text-[#0071e3]' : 'text-[#34c759]'}`}
                      strokeWidth={2.5}
                    />
                    <span className={`text-[13px] leading-snug ${tier.popular ? 'text-white/70' : 'text-[#424245]'}`}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-2xl mx-auto px-6 py-20">
        <motion.h2 {...fade(0)} className="text-[36px] font-semibold tracking-tight text-center text-[#1d1d1f] mb-12">
          Questions? Answers.
        </motion.h2>
        <motion.div {...fade(0.06)} className="bg-white rounded-2xl border border-black/[0.06] px-6">
          {faqs.map((faq) => (
            <FAQ key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </motion.div>
      </section>

      {/* Booking CTA */}
      <section id="book" className="max-w-5xl mx-auto px-6 py-20">
        <motion.div {...fade(0)} className="bg-[#1d1d1f] rounded-3xl p-12 text-center text-white">
          <h2 className="text-[32px] font-semibold tracking-tight mb-3">Ready to get started?</h2>
          <p className="text-[17px] text-white/50 mb-8 max-w-md mx-auto">
            Book your AI setup today. We'll come to you, set everything up, and make sure you're comfortable before we leave.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="tel:+13613158585"
              className="inline-flex items-center gap-2 bg-white text-[#1d1d1f] px-7 py-3.5 rounded-full text-[16px] font-medium hover:bg-white/90 transition-colors"
            >
              <Phone className="w-4 h-4" /> (361) 315-8585
            </a>
            <a
              href="https://cal.com/simplytech.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-full text-[16px] font-medium border border-white/20 hover:bg-white/10 transition-colors"
            >
              <Calendar className="w-4 h-4" /> Book Online
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
            {[
              { name: 'Basic', price: '$300', slug: 'basic-ai-setup-300', time: '60 min' },
              { name: 'Pro', price: '$500', slug: 'pro-ai-setup-500', time: '90 min' },
              { name: 'Premium', price: '$1,000', slug: 'premium-ai-setup-1000', time: '3 hrs' },
            ].map((tier) => (
              <a
                key={tier.name}
                href={`https://cal.com/simplytech.ai/${tier.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl p-5 text-center transition-all duration-300"
              >
                <p className="text-[20px] font-semibold text-white">{tier.price}</p>
                <p className="text-[13px] text-white/50 mt-1">{tier.name} · {tier.time}</p>
                <p className="text-[12px] text-[#0071e3] mt-2 font-medium">Book Now</p>
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[#1d1d1f]">Simply AI</p>
            <p className="text-[12px] text-[#86868b] mt-0.5">AI setup for everyone. Los Angeles & remote.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+13613158585" className="text-[12px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">(361) 315-8585</a>
            <a href="https://cal.com/simplytech.ai" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">Book Online</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
