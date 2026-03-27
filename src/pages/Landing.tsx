import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
  useAnimate,
  useSpring,
  animate,
} from 'framer-motion';
import { Check, Phone, Calendar, Star, ChevronDown, MapPin, ArrowRight, Menu, X, Mail, Search, Zap, GraduationCap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

function useReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return { ref, isInView };
}

function RevealDiv({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, isInView } = useReveal();
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(8px)', scale: 0.97 }}
      animate={isInView ? (shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }) : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Cursor spotlight — subtle blue shimmer on white ───────────────────────────
function CursorSpotlight() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const tx = useTransform(springX, v => v - 350);
  const ty = useTransform(springY, v => v - 350);

  useEffect(() => {
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 w-[700px] h-[700px] rounded-full blur-[140px]"
      style={{ x: tx, y: ty, background: 'radial-gradient(ellipse, rgba(0,113,227,0.06) 0%, transparent 70%)' }}
    />
  );
}

// ── 3-D perspective tilt card ─────────────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const srX = useSpring(rX, { stiffness: 180, damping: 22 });
  const srY = useSpring(rY, { stiffness: 180, damping: 22 });
  const shouldReduce = useReducedMotion();
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || isTouch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rY.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8);
    rX.set(-((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 5);
  };
  const onLeave = () => { rX.set(0); rY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Magnetic button ───────────────────────────────────────────────────────────
function MagneticButton({ children, className = '', href, target, rel }: {
  children: React.ReactNode; className?: string;
  href?: string; target?: string; rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });
  const shouldReduce = useReducedMotion();
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const onMove = (e: React.MouseEvent) => {
    if (shouldReduce || isTouch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.28);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref} href={href} target={target} rel={rel}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy }} whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// ── CountUp ───────────────────────────────────────────────────────────────────
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const ctrl = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return ctrl.stop;
  }, [isInView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const tiers = [
  {
    name: 'Starter', price: 199, slug: 'discovery',
    desc: 'Per computer. Perplexity Free, fully installed.',
    features: ['Perplexity AI installed & configured on each computer','Account setup per user','Privacy & security settings applied','Quick-start tips sheet for each employee'],
  },
  {
    name: 'Pro', price: 299, slug: 'discovery',
    desc: 'Per computer. Full Perplexity Pro setup.', popular: true,
    features: ['Everything in Starter','Perplexity Pro (first month included)','Custom shortcuts & workflow setup','Industry-specific team tips sheet built for your business','Priority scheduling'],
  },
  {
    name: 'Phone Add-on', price: 99, slug: 'discovery',
    desc: 'Per employee phone. Mobile Perplexity setup.',
    features: ['Perplexity installed on employee phones','Mobile app configured & synced to desktop','Same account as computer setup','Add to any Starter or Pro plan'],
  },
];

const faqs = [
  { q: 'What exactly do you install?', a: 'We install and configure Perplexity AI — the leading AI research tool for businesses. It answers questions with cited sources, helps your team draft documents, research anything, and get work done faster. We handle every step: installation, account setup, privacy configuration, and shortcuts tailored to your industry.' },
  { q: 'Does my team need any tech skills?', a: "None. Perplexity is the easiest AI tool available — your team will pick it up immediately. We configure everything, get it running on every machine, and leave a tips sheet. Most employees are using it confidently within minutes of us finishing." },
  { q: 'How long does an office visit take?', a: "For most offices of 2–5 people, we're done in under an hour. Larger teams may take a bit longer. We work efficiently — this isn't a training session, it's a setup. We get in, get it done, and get out." },
  { q: 'Is this a one-time fee or ongoing?', a: "Our service is a one-time fee per computer. We don't charge monthly retainers. Perplexity has a free version that works great for most businesses, and an optional Pro upgrade at $20/month per user if you want the full power — we'll show you both and you decide." },
  { q: 'What area do you serve?', a: 'We serve the greater Los Angeles area in person — including the Valley (Chatsworth, Northridge, Encino, Tarzana), West LA, and surrounding neighborhoods. Outside LA? We offer remote setup via Zoom for businesses anywhere in the US.' },
  { q: 'Is Perplexity safe for business use?', a: "Yes. Perplexity is a well-funded company trusted by millions of professionals worldwide. We configure privacy settings on every install to ensure your team's searches and data are handled appropriately from day one." },
];

const testimonials = [
  { name: 'Marcus T.', location: 'Studio City, CA', role: 'Law firm office manager', stars: 5,
    quote: "We had 5 attorneys and none of them were using AI. SimplyAI came in, set up Perplexity on every computer in under an hour, and left. No long meetings, no training sessions. Our team figured it out on their own — it's that intuitive." },
  { name: 'Frank R.', location: 'Encino, CA', role: 'Plumbing company owner', stars: 5,
    quote: 'I had zero idea how AI could help my business. After the visit, I now use it to write estimates, answer customer emails, and look up codes. It paid for itself in the first week.' },
  { name: 'Diane L.', location: 'Tarzana, CA', role: 'Real estate team lead', stars: 5,
    quote: "I run a small real estate team. They installed Perplexity on all three of our computers in about 45 minutes. No disruption to our day. We were using it the same afternoon to write listings. Highly recommend." },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-[#ff9f0a] fill-[#ff9f0a]" strokeWidth={0} />
      ))}
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.06] last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left min-h-[44px]">
        <span className="text-[14px] sm:text-[16px] font-medium text-[#1d1d1f] pr-4 sm:pr-6 break-words">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#86868b] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} strokeWidth={1.8} />
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
        {[{ href: '#pricing', label: 'Pricing' },{ href: '#how', label: 'How It Works' },{ href: '#faq', label: 'FAQ' }].map(({ href, label }) => (
          <a key={href} href={href} onClick={onClose} className="text-[15px] text-[#1d1d1f] py-3 font-medium border-b border-black/[0.04] last:border-0">{label}</a>
        ))}
        <a href="tel:+18186006825" className="mt-3 inline-flex items-center justify-center gap-2 bg-[#f5f5f7] text-[#1d1d1f] px-5 py-3.5 rounded-full text-[15px] font-medium min-h-[44px]">
          <Phone className="w-4 h-4" /> (818) 600-6825
        </a>
        <a href="https://cal.com/simplytech.ai/discovery" target="_blank" rel="noopener noreferrer" onClick={onClose} className="mt-2 inline-flex items-center justify-center gap-2 bg-[#0071e3] text-white px-5 py-3.5 rounded-full text-[15px] font-medium min-h-[44px]">
          Book Discovery Call
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'checklist-optin', name: '' }),
      });
      setStatus('done'); setEmail('');
    } catch { setStatus('error'); }
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
            Free: Business AI Readiness Guide
          </h2>
          <p className="text-[14px] sm:text-[16px] text-[#86868b] mb-7 max-w-md mx-auto">
            10 ways your team can use Perplexity AI starting today — with real examples for LA businesses. Sent straight to your inbox.
          </p>
          {status === 'done' ? (
            <div className="flex items-center justify-center gap-2 text-[#34c759] font-medium text-[15px]">
              <Check className="w-5 h-5" strokeWidth={2.5} /> Sent! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required placeholder="Your email address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full border border-black/[0.1] bg-white text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none focus:ring-2 focus:ring-[#0071e3]/30 min-h-[48px]"
              />
              <button type="submit" disabled={status === 'loading'}
                className="bg-[#0071e3] text-white px-6 py-3.5 rounded-full text-[14px] font-medium hover:bg-[#0077ED] transition-colors min-h-[48px] shrink-0 disabled:opacity-60">
                {status === 'loading' ? 'Sending…' : 'Send it to me'}
              </button>
            </form>
          )}
          {status === 'error' && <p className="mt-3 text-[13px] text-red-500">Something went wrong — try calling us instead.</p>}
          <p className="text-[11px] text-[#86868b] mt-4">No spam. Unsubscribe any time.</p>
        </RevealDiv>
      </div>
    </section>
  );
}

// ── Hero orb with mouse parallax ──────────────────────────────────────────────
function HeroOrb() {
  const shouldReduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px  = useSpring(rawX, { stiffness: 25, damping: 20 });
  const py  = useSpring(rawY, { stiffness: 25, damping: 20 });
  const px2 = useSpring(useTransform(rawX, v => v * 0.55), { stiffness: 20, damping: 20 });
  const py2 = useSpring(useTransform(rawY, v => v * 0.55), { stiffness: 20, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 60);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [rawX, rawY, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#0071e3]/15 blur-[100px]" />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Blue core — follows cursor */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#0071e3]/20 blur-[100px]"
        style={{ x: px, y: py }}
      />
      {/* Purple accent — lags */}
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.32, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-[-20px] right-[20%] w-[380px] h-[380px] rounded-full bg-[#7c3aed]/12 blur-[90px]"
        style={{ x: px2, y: py2 }}
      />
    </div>
  );
}

function HeroHeadline() {
  const shouldReduceMotion = useReducedMotion();
  const words = ['We', 'install', 'Perplexity', 'AI', 'at', 'your', 'office.'];
  if (shouldReduceMotion) {
    return (
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.07 }}
        className="text-[40px] sm:text-[52px] lg:text-[60px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] max-w-3xl mx-auto">
        We install Perplexity AI at your office.
      </motion.h1>
    );
  }
  return (
    <h1 className="text-[40px] sm:text-[52px] lg:text-[60px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] max-w-3xl mx-auto">
      {words.map((word, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.07 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          className={`inline-block mr-[0.25em] ${i >= 6 ? 'text-[#86868b]' : ''}`}
        >{word}</motion.span>
      ))}
    </h1>
  );
}

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

const PERPLEXITY_TEAL = '#20b8cd';
const DEMO_QUERY = "Find me some relaxing jazz on YouTube";
const YOUTUBE_RESULTS = [
  { title: "Relaxing Jazz Music 🎷 — 3 Hour Study & Focus", channel: "Calm Music Café", views: "4.2M views" },
  { title: "Smooth Jazz Coffee Shop Ambience ☕", channel: "Chilled Cow", views: "12M views" },
];
const STEP_LABELS = [
  { headline: "Book a free 15-minute discovery call.", sub: "Tell us how many computers your team uses." },
  { headline: "We come to your office.", sub: "Usually within the week — no disruption to your workflow." },
  { headline: "Perplexity installed on every computer.", sub: "Complete setup done in under an hour." },
  { headline: "Your team is AI-ready.", sub: "On every computer — and every phone if you want." },
];

function LaptopScreen({ typedQuery, bulletStage, glowActive, showYoutube }: {
  typedQuery: string; bulletStage: number; glowActive: boolean; showYoutube: boolean;
}) {
  const showCursor = typedQuery.length > 0 && typedQuery.length < DEMO_QUERY.length;
  return (
    <div className="relative w-[520px] sm:w-[600px]">
      <div className="absolute -inset-8 rounded-3xl blur-[100px] -z-10 transition-all duration-700"
        style={{ opacity: glowActive ? 1 : 0, backgroundColor: showYoutube ? 'rgba(255,0,0,0.18)' : 'rgba(0,113,227,0.22)' }}
        aria-hidden="true" />
      <div className="bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] rounded-t-2xl border border-white/10 shadow-2xl" style={{ padding: '8px 8px 0' }}>
        <div className="relative bg-[#1c1c1e] rounded-xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2a2a2a] border border-white/10 z-10" />
          <motion.div className="absolute inset-0 bg-[#0f0f0f] flex flex-col text-white" animate={{ opacity: showYoutube ? 0 : 1 }} transition={{ duration: 0.55 }}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: PERPLEXITY_TEAL }}>
                  <span className="text-white font-bold" style={{ fontSize: 9 }}>P</span>
                </div>
                <span className="text-white font-semibold" style={{ fontSize: 11 }}>Perplexity</span>
              </div>
              <div className="flex gap-1"><div className="w-4 h-4 rounded bg-white/5" /><div className="w-4 h-4 rounded bg-white/5" /></div>
            </div>
            <div className="flex-1 px-3 py-2.5 overflow-hidden space-y-2.5">
              <div className="flex gap-1.5">
                {['youtube.com', 'music.youtube.com'].map(s => (
                  <div key={s} className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5">
                    <div className="w-2.5 h-2.5 rounded-sm flex items-center justify-center bg-[#ff0000]/80">
                      <svg width="5" height="5" viewBox="0 0 5 5" fill="white"><polygon points="1.5,1 4,2.5 1.5,4"/></svg>
                    </div>
                    <span style={{ fontSize: 8 }} className="text-white/50">{s}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10 }} className="text-white/40 uppercase tracking-wider font-medium">Results</p>
              {YOUTUBE_RESULTS.map((result, i) => (
                <motion.div key={i} animate={{ opacity: bulletStage > i ? 1 : 0, y: bulletStage > i ? 0 : 8 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="flex gap-2.5 items-start">
                  <div className="shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-[#1a1520] to-[#0d1a2e] flex items-center justify-center border border-white/5" style={{ width: 64, height: 42 }}>
                    <div className="w-0 h-0 border-l-[9px] border-l-white/50 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 leading-tight" style={{ fontSize: 10 }}>{result.title}</p>
                    <p className="text-white/40 mt-0.5" style={{ fontSize: 8 }}>{result.channel} · {result.views}</p>
                    <div className="inline-flex items-center gap-0.5 mt-1 bg-[#ff0000]/20 border border-[#ff0000]/30 rounded px-1 py-px">
                      <svg width="6" height="6" viewBox="0 0 6 6" fill="#ff4444"><polygon points="1,1 5,3 1,5"/></svg>
                      <span className="text-[#ff6666]" style={{ fontSize: 7 }}>Open on YouTube</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-3 pb-3">
              <div className="bg-white/[0.08] border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                <span style={{ fontSize: 10 }} className="flex-1 text-white/50 font-mono truncate">
                  {typedQuery || <span className="opacity-40">Ask anything...</span>}
                  {showCursor && <span className="animate-pulse" style={{ color: PERPLEXITY_TEAL }}>|</span>}
                </span>
                <div className="w-5 h-5 rounded-full flex items-center justify-center opacity-60" style={{ backgroundColor: PERPLEXITY_TEAL }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="white"><path d="M1 4h6M4 1l3 3-3 3" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div className="absolute inset-0 bg-[#0f0f0f] flex flex-col text-white" animate={{ opacity: showYoutube ? 1 : 0 }} transition={{ duration: 0.55 }}>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#202020] border-b border-white/[0.06]">
              <div className="flex-1 bg-[#2a2a2a] rounded px-2 py-0.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]/70 shrink-0" />
                <span className="text-white/35" style={{ fontSize: 8 }}>youtube.com/watch?v=...</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 bg-[#181818] border-b border-white/[0.05]">
              <div className="flex items-center gap-1 shrink-0">
                <div className="bg-[#ff0000] rounded-sm flex items-center justify-center" style={{ width: 18, height: 13 }}>
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="white"><polygon points="2,1.5 5.5,3.5 2,5.5"/></svg>
                </div>
                <span className="text-white font-bold" style={{ fontSize: 9 }}>YouTube</span>
              </div>
              <div className="flex-1 bg-[#121212] border border-white/10 rounded-full px-2 py-0.5">
                <span className="text-white/40" style={{ fontSize: 8 }}>relaxing jazz music</span>
              </div>
            </div>
            <div className="relative bg-black w-full flex-shrink-0" style={{ paddingTop: '37%' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1520] via-[#0c1828] to-[#1a100a] flex items-center justify-center">
                <div className="flex items-end gap-0.5 h-5 opacity-25 mr-4">
                  {[3,6,4,8,5,7,3,6,4,8,5].map((h, i) => (<div key={i} className="w-[2px] rounded-full bg-white" style={{ height: `${h * 3}px` }} />))}
                </div>
                <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center border border-white/10">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><rect x="2" y="2" width="2.5" height="6" rx="0.8"/><rect x="5.5" y="2" width="2.5" height="6" rx="0.8"/></svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                <div className="h-full bg-[#ff0000]" style={{ width: '22%' }} />
                <div className="absolute right-[78%] -top-[2px] w-2 h-2 rounded-full bg-[#ff0000] -translate-y-px" />
              </div>
            </div>
            <div className="px-2.5 py-1.5 flex-1">
              <p className="text-white font-medium leading-tight" style={{ fontSize: 10 }}>Relaxing Jazz Music 🎷 — 3 Hour Study &amp; Focus Session</p>
              <p className="text-white/40 mt-0.5" style={{ fontSize: 8 }}>Calm Music Café · 4.2M views</p>
              <p className="text-white/25 mt-0.5" style={{ fontSize: 7 }}>14:22 / 3:02:14</p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#3d3d3f] to-[#2d2d2f] h-[18px] rounded-b-2xl border border-t-0 border-white/10 relative">
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-2 rounded-sm bg-white/5" />
      </div>
      <div className="bg-[#1a1a1a] h-[3px] w-[70%] mx-auto rounded-b-sm" />
    </div>
  );
}

function PhoneScreen({ showYoutube }: { showYoutube: boolean }) {
  return (
    <div className="w-[160px] sm:w-[175px] bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] rounded-[36px] border border-white/15 shadow-2xl relative shrink-0" style={{ padding: '12px 6px 16px' }}>
      <div className="w-14 h-5 bg-black rounded-full mx-auto mb-2" />
      <div className="bg-[#0f0f0f] rounded-[24px] overflow-hidden relative" style={{ minHeight: 220 }}>
        <motion.div className="absolute inset-0 flex flex-col" animate={{ opacity: showYoutube ? 0 : 1 }} transition={{ duration: 0.55 }}>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/5">
            <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: PERPLEXITY_TEAL }}>
              <span className="text-white font-bold" style={{ fontSize: 6 }}>P</span>
            </div>
            <span className="text-white font-semibold" style={{ fontSize: 8 }}>Perplexity</span>
          </div>
          <div className="px-2.5 py-2">
            <div className="bg-white/[0.08] border border-white/10 rounded-lg px-2 py-1.5 mb-2">
              <span style={{ fontSize: 8 }} className="text-white/50 font-mono truncate block">{DEMO_QUERY}</span>
            </div>
            <div className="flex gap-1 mb-1.5">
              {['youtube.com', 'music.yt'].map(s => (
                <div key={s} className="flex items-center gap-0.5 bg-white/5 rounded-full px-1.5 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-sm bg-[#ff0000]/70" />
                  <span style={{ fontSize: 6 }} className="text-white/40">{s}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 7 }} className="text-white/40 uppercase tracking-wider font-medium mb-1.5">Results</p>
            {YOUTUBE_RESULTS.map((r, i) => (
              <div key={i} className="flex gap-1.5 items-start mb-2">
                <div className="shrink-0 rounded bg-gradient-to-br from-[#1a1520] to-[#0d1a2e] flex items-center justify-center border border-white/5" style={{ width: 36, height: 24 }}>
                  <svg width="6" height="6" viewBox="0 0 6 6" fill="white" opacity="0.5"><polygon points="1,1 5,3 1,5"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 leading-tight truncate" style={{ fontSize: 8 }}>{r.title}</p>
                  <p className="text-white/35" style={{ fontSize: 7 }}>{r.channel}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div className="absolute inset-0 flex flex-col bg-[#0f0f0f]" animate={{ opacity: showYoutube ? 1 : 0 }} transition={{ duration: 0.55 }}>
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#181818] border-b border-white/5">
            <div className="flex items-center gap-1">
              <div className="bg-[#ff0000] rounded-sm flex items-center justify-center" style={{ width: 14, height: 10 }}>
                <svg width="5" height="5" viewBox="0 0 5 5" fill="white"><polygon points="1,1 4,2.5 1,4"/></svg>
              </div>
              <span className="text-white font-bold" style={{ fontSize: 8 }}>YouTube</span>
            </div>
            <div className="w-4 h-4 rounded-full bg-white/10" />
          </div>
          <div className="relative bg-black w-full flex-shrink-0" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1520] via-[#0c1828] to-[#1a100a] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center border border-white/10">
                <svg width="7" height="7" viewBox="0 0 7 7" fill="white"><rect x="1.5" y="1.5" width="1.5" height="4" rx="0.5"/><rect x="4" y="1.5" width="1.5" height="4" rx="0.5"/></svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10"><div className="h-full bg-[#ff0000]" style={{ width: '22%' }} /></div>
          </div>
          <div className="px-2.5 py-2">
            <p className="text-white leading-tight" style={{ fontSize: 8 }}>Relaxing Jazz Music 🎷 — 3 Hour Study &amp; Focus</p>
            <p className="text-white/40 mt-0.5" style={{ fontSize: 7 }}>Calm Music Café · 4.2M views</p>
            <p className="text-white/25 mt-0.5" style={{ fontSize: 6 }}>14:22 / 3:02:14</p>
          </div>
        </motion.div>
      </div>
      <div className="w-24 h-1 bg-white/20 rounded-full mx-auto mt-3" />
    </div>
  );
}

function DeviceDemo() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollYProgress = useMotionValue(0);
  const [stage, setStage] = useState(-1);
  const [activeStep, setActiveStep] = useState(0);
  const [typedQuery, setTypedQuery] = useState('');
  const [bulletStage, setBulletStage] = useState(0);
  const [phoneBulletsVisible, setPhoneBulletsVisible] = useState(false);
  const [continueVisible, setContinueVisible] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [laptopRef, animateLaptop] = useAnimate();
  const [phoneRef, animatePhone] = useAnimate();

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v >= 0.05 && stage < 0) setStage(0);
    else if (v >= 0.30 && stage < 1) setStage(1);
    else if (v >= 0.52 && stage < 2) setStage(2);
    else if (v >= 0.72 && stage < 3) setStage(3);
    if (v < 0.30) setActiveStep(0);
    else if (v < 0.52) setActiveStep(1);
    else if (v < 0.72) setActiveStep(2);
    else setActiveStep(3);
  });

  useEffect(() => {
    const update = () => {
      const s = sectionRef.current;
      if (!s) return;
      scrollYProgress.set(Math.max(0, Math.min(1, (window.scrollY - s.offsetTop) / (s.offsetHeight - window.innerHeight))));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [scrollYProgress]);

  useEffect(() => {
    const v = scrollYProgress.get();
    if (v >= 0.72) setStage(3); else if (v >= 0.52) setStage(2); else if (v >= 0.30) setStage(1); else if (v >= 0.05) setStage(0);
    if (v < 0.30) setActiveStep(0); else if (v < 0.52) setActiveStep(1); else if (v < 0.72) setActiveStep(2); else setActiveStep(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage < 0) return;
    animateLaptop(laptopRef.current, { opacity: 1, scale: 1, rotateX: 0, y: 0 }, { type: 'spring', stiffness: 70, damping: 18, duration: 1.0 });
    const t = setTimeout(() => setGlowActive(true), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage >= 0]);

  useEffect(() => {
    if (stage < 1 || typedQuery === DEMO_QUERY) return;
    let i = typedQuery.length;
    const iv = setInterval(() => { i++; setTypedQuery(DEMO_QUERY.slice(0, i)); if (i >= DEMO_QUERY.length) clearInterval(iv); }, 45);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage >= 1]);

  useEffect(() => {
    if (stage < 2) return;
    let c = 0;
    const iv = setInterval(() => { c++; setBulletStage(c); if (c >= 3) clearInterval(iv); }, 200);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage >= 2]);

  useEffect(() => {
    if (stage < 3) return;
    animatePhone(phoneRef.current, { opacity: 1, x: 0, scale: 1 }, { type: 'spring', stiffness: 90, damping: 15 });
    animateLaptop(laptopRef.current, { x: -28 }, { type: 'spring', stiffness: 60, damping: 20, delay: 0.1 });
    const t1 = setTimeout(() => setPhoneBulletsVisible(true), 400);
    const t2 = setTimeout(() => setContinueVisible(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage >= 3]);

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  if (shouldReduceMotion) {
    return (
      <section id="how" className="bg-[#1d1d1f] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 text-white text-center">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-white/40 mb-3">How It Works</p>
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight mb-10">Four steps. Under an hour.</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <LaptopScreen typedQuery={DEMO_QUERY} bulletStage={3} glowActive={true} showYoutube={true} />
            <PhoneScreen showYoutube={true} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="how" className="bg-[#1d1d1f] relative md:min-h-[350vh]">
      <div className="sticky top-0 h-screen hidden md:flex flex-col items-center justify-center overflow-visible px-6 lg:px-10">
        <div className="flex flex-col items-center max-w-4xl w-full">
          <div className="text-center mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-3">How It Works</p>
            <h2 className="text-[32px] lg:text-[40px] font-semibold tracking-tight text-white">Four steps. Under an hour.</h2>
          </div>
          <div className="text-center mb-4 min-h-[60px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={activeStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="text-center">
                <p className="text-white font-semibold text-[20px] lg:text-[22px] leading-snug">{STEP_LABELS[activeStep].headline}</p>
                <p className="text-white/40 text-[14px] lg:text-[15px] mt-1.5 leading-relaxed">{STEP_LABELS[activeStep].sub}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex gap-2.5 mb-8 justify-center">
            {STEP_LABELS.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-300 ${i === activeStep ? 'w-6 h-1.5 bg-[#0071e3]' : 'w-1.5 h-1.5 bg-white/20'}`} />
            ))}
          </div>
          <div className="flex items-end justify-center gap-5">
            <motion.div ref={laptopRef} style={{ opacity: 0, scale: 0.88, rotateX: 15, y: 20, transformPerspective: 1200 }}>
              <LaptopScreen typedQuery={typedQuery} bulletStage={bulletStage} glowActive={glowActive} showYoutube={stage >= 3} />
            </motion.div>
            <motion.div ref={phoneRef} style={{ opacity: 0, x: 80, scale: 0.92 }} className="drop-shadow-2xl flex flex-col items-center">
              <PhoneScreen showYoutube={phoneBulletsVisible} />
              <motion.p animate={{ opacity: continueVisible ? 1 : 0 }} transition={{ duration: 0.4 }} className="text-[10px] font-semibold mt-2.5 uppercase tracking-[0.12em] whitespace-nowrap" style={{ color: '#ff4444' }}>
                On every device.
              </motion.p>
            </motion.div>
          </div>
        </div>
        <motion.div style={{ opacity: scrollHintOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[11px] uppercase tracking-[0.12em] text-white/25">Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 text-white/20 animate-bounce" />
        </motion.div>
      </div>

      {/* Mobile */}
      <div className="md:hidden py-12 px-5">
        <div className="text-center mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-3">How It Works</p>
          <h2 className="text-[26px] font-semibold tracking-tight text-white">Four steps. Under an hour.</h2>
          <p className="text-white/40 text-[14px] mt-2">From discovery call to AI-ready office.</p>
        </div>
        <div className="flex items-end justify-center gap-3 mb-3">
          <div className="w-[210px] shrink-0">
            <div className="bg-[#2a2a2a] rounded-t-xl border border-white/10" style={{ padding: '6px 6px 0' }}>
              <div className="bg-black rounded-md overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <div className="flex items-center gap-1 px-1.5 py-1 bg-[#1c1c1e] border-b border-white/5">
                  <div className="flex gap-0.5"><div className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]"/><div className="w-1.5 h-1.5 rounded-full bg-[#febc2e]"/><div className="w-1.5 h-1.5 rounded-full bg-[#28c840]"/></div>
                  <div className="flex-1 bg-white/5 rounded px-1.5 py-0.5 mx-1"><span className="text-white/40 truncate block" style={{ fontSize: 6 }}>youtube.com/watch?v=...</span></div>
                </div>
                <div className="bg-[#0f0f0f] h-full flex flex-col">
                  <div className="flex items-center gap-1 px-1.5 py-1 bg-[#181818]">
                    <div className="bg-[#ff0000] rounded-sm flex items-center justify-center" style={{ width: 13, height: 9 }}><svg width="5" height="5" viewBox="0 0 5 5" fill="white"><polygon points="1,1 4,2.5 1,4"/></svg></div>
                    <span className="text-white font-bold" style={{ fontSize: 7 }}>YouTube</span>
                  </div>
                  <div className="mx-1.5 my-1 bg-gradient-to-br from-[#1a1520] to-[#0d1a2e] rounded flex-1 relative flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-black/50 border border-white/10 flex items-center justify-center"><svg width="6" height="6" viewBox="0 0 6 6" fill="white"><rect x="1" y="1" width="1.5" height="4" rx="0.4"/><rect x="3.5" y="1" width="1.5" height="4" rx="0.4"/></svg></div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10"><div className="h-full bg-[#ff0000]" style={{ width: '22%' }}/></div>
                  </div>
                  <div className="px-1.5 pb-1"><p className="text-white/80 truncate" style={{ fontSize: 7 }}>Relaxing Jazz Music 🎷 — Study &amp; Focus</p><p className="text-white/40" style={{ fontSize: 6 }}>Calm Music Café · 4.2M views</p></div>
                </div>
              </div>
            </div>
            <div className="bg-[#333] h-2 rounded-b-xl border border-t-0 border-white/10"/>
            <div className="bg-[#2a2a2a] h-1 w-2/3 mx-auto rounded-b-sm"/>
          </div>
          <div className="w-[105px] shrink-0 bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] rounded-[28px] border border-white/15 shadow-xl" style={{ padding: '8px 4px 12px' }}>
            <div className="w-10 h-3.5 bg-black rounded-full mx-auto mb-1.5"/>
            <div className="bg-[#0f0f0f] rounded-[18px] overflow-hidden" style={{ minHeight: 150 }}>
              <div className="flex items-center justify-between px-2 py-1 bg-[#181818] border-b border-white/5">
                <div className="flex items-center gap-0.5"><div className="bg-[#ff0000] rounded-sm flex items-center justify-center" style={{ width: 10, height: 7 }}><svg width="4" height="4" viewBox="0 0 4 4" fill="white"><polygon points="0.5,0.5 3.5,2 0.5,3.5"/></svg></div><span className="text-white font-bold" style={{ fontSize: 6 }}>YouTube</span></div>
              </div>
              <div className="relative bg-gradient-to-br from-[#1a1520] to-[#0d1a2e] flex items-center justify-center" style={{ aspectRatio: '16/9', width: '100%' }}>
                <div className="w-4 h-4 rounded-full bg-black/50 border border-white/10 flex items-center justify-center"><svg width="5" height="5" viewBox="0 0 5 5" fill="white"><rect x="1" y="1" width="1" height="3" rx="0.3"/><rect x="3" y="1" width="1" height="3" rx="0.3"/></svg></div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10"><div className="h-full bg-[#ff0000]" style={{ width: '22%' }}/></div>
              </div>
              <div className="px-2 py-1.5"><p className="text-white/80 truncate" style={{ fontSize: 6.5 }}>Relaxing Jazz 🎷</p><p className="text-white/35" style={{ fontSize: 5.5 }}>Calm Music Café</p></div>
            </div>
            <div className="w-14 h-0.5 bg-white/20 rounded-full mx-auto mt-2"/>
          </div>
        </div>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.15em] mb-8" style={{ color: '#ff4444' }}>On every device.</p>
        <div className="space-y-2.5 max-w-sm mx-auto">
          {STEP_LABELS.map((s, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3">
              <div className="w-6 h-6 rounded-full bg-[#0071e3]/20 border border-[#0071e3]/40 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#0071e3] text-[10px] font-bold">{i + 1}</span>
              </div>
              <div><p className="text-white text-[13px] font-semibold leading-snug">{s.headline}</p><p className="text-white/40 text-[12px] mt-0.5">{s.sub}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function Landing() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-clip">

      <CursorSpotlight />

      {/* ── Nav ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-white/80 backdrop-blur-xl border-b border-black/[0.04]'}`}>
        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex items-center justify-between h-12 sm:h-14">
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">Simply AI</span>
          <div className="hidden sm:flex items-center gap-6">
            {[{ href: '#pricing', label: 'Pricing' },{ href: '#how', label: 'How It Works' },{ href: '#faq', label: 'FAQ' }].map(({ href, label }) => (
              <a key={href} href={href} className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">{label}</a>
            ))}
            <a href="https://cal.com/simplytech.ai/discovery" target="_blank" rel="noopener noreferrer" className="bg-[#0071e3] text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#0077ED] transition-colors min-h-[32px] inline-flex items-center">Discovery Call</a>
          </div>
          <button onClick={() => setMobileNavOpen(o => !o)} className="sm:hidden flex items-center justify-center w-10 h-10 text-[#1d1d1f]" aria-label="Toggle menu">
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      </header>

      {/* ── Hero ── */}
      <section className="relative max-w-5xl mx-auto px-5 sm:px-6 pt-14 sm:pt-24 pb-14 sm:pb-20 text-center">
        <HeroOrb />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex items-center gap-2 bg-[#f5f5f7] rounded-full px-4 py-1.5 mb-5">
          <MapPin className="w-3.5 h-3.5 text-[#0071e3]" strokeWidth={2} />
          <span className="text-[12px] font-medium text-[#86868b]">Serving LA Businesses In-Person</span>
        </motion.div>

        <HeroHeadline />

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[17px] sm:text-[19px] text-[#86868b] mt-5 sm:mt-6 max-w-xl mx-auto leading-relaxed px-2">
          We come to your office and set up Perplexity AI on every computer in under an hour — no disruption, no IT headaches. Your team is productive immediately.
        </motion.p>

        {/* CTA — magnetic buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.21, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-7 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <MagneticButton href="#book"
            className="inline-flex items-center justify-center gap-2 bg-[#0071e3] text-white px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0077ED] transition-colors min-h-[52px] sm:min-h-[44px]">
            Book a Free Discovery Call <ArrowRight className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton href="tel:+18186006825"
            className="inline-flex items-center justify-center gap-2 text-[#0071e3] px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0071e3]/5 transition-colors border border-[#0071e3]/20 min-h-[52px] sm:min-h-[44px]">
            <Phone className="w-4 h-4" /> (818) 600-6825
          </MagneticButton>
        </motion.div>

        {/* Stat badges — CountUp */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 sm:mt-12 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {[
            { to: 500, suffix: '+', label: 'Setups done' },
            { to: 5, suffix: '.0★', label: 'Google rating' },
            { to: 1, suffix: ' hr', label: 'Avg. office visit' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 bg-[#f5f5f7] rounded-2xl px-5 py-3 border border-black/[0.05]">
              <span className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight tabular-nums">
                <CountUp to={stat.to} suffix={stat.suffix} />
              </span>
              <span className="text-[12px] text-[#86868b]">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="bg-[#f5f5f7] py-5 sm:py-6">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 flex items-center justify-center gap-x-4 gap-y-2 sm:gap-10 flex-wrap">
          {['Perplexity AI certified setup','Privacy & security configured','In-person at your LA office','Flat one-time fee — no subscriptions'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#34c759]" strokeWidth={2.5} />
              <span className="text-[12px] sm:text-[13px] font-medium text-[#6e6e73]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── What We Install ── */}
      <section className="bg-gradient-to-b from-white to-[#f5f5f7] w-full py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <RevealDiv className="text-center">
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1d1d1f] mb-3 sm:mb-4">Who is this for?</h2>
            <p className="text-[15px] sm:text-[17px] text-[#86868b] mb-10 sm:mb-12 max-w-lg mx-auto">
              Any LA-area business that wants smarter research — without the IT overhead.
            </p>
          </RevealDiv>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: <Search className="w-6 h-6 text-[#0071e3]" strokeWidth={1.8} />, iconBg: 'bg-[#0071e3]/10', name: 'Law Firms & Consultants', desc: 'Research cases, summarize documents, and draft communications in seconds. Perplexity cites its sources — critical for professional work.' },
              { icon: <Zap className="w-6 h-6 text-[#f59e0b]" strokeWidth={1.8} />, iconBg: 'bg-[#f59e0b]/10', name: 'Real Estate & Contractors', desc: 'Pull comps, write property descriptions, research codes, and answer client questions faster than ever.' },
              { icon: <GraduationCap className="w-6 h-6 text-[#34c759]" strokeWidth={1.8} />, iconBg: 'bg-[#34c759]/10', name: 'Medical, Dental & Retail', desc: 'Look up policies, supplier info, and patient FAQs instantly. Save your front desk hours every single week.' },
            ].map((product, i) => (
              <RevealDiv key={product.name} delay={i * 0.07}>
                <TiltCard className="h-full">
                  <motion.div whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }} transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 border border-black/[0.06] h-full">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${product.iconBg} mb-5`}>{product.icon}</div>
                    <h3 className="text-[16px] sm:text-[17px] font-semibold mb-2 text-[#1d1d1f]">{product.name}</h3>
                    <p className="text-[13px] sm:text-[14px] text-[#86868b] leading-relaxed">{product.desc}</p>
                  </motion.div>
                </TiltCard>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── Device Demo ── */}
      <DeviceDemo />

      {/* ── Testimonials ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <RevealDiv className="text-center mb-10 sm:mb-12">
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1d1d1f] mb-3">What our customers say.</h2>
          <p className="text-[15px] sm:text-[17px] text-[#86868b] max-w-md mx-auto">Real LA businesses. Real results. No tech background required.</p>
        </RevealDiv>

        <RevealDiv delay={0.05} className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap mb-10 sm:mb-12">
          {[
            { label: 'Google', rating: '5.0', stars: 5, color: '#4285F4' },
            { label: 'Yelp', rating: '5.0', stars: 5, color: '#d32323' },
            { label: 'BBB Accredited', rating: 'A+', stars: 0, color: '#003f87' },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5 bg-white rounded-2xl px-5 py-3 border border-black/[0.07] shadow-sm">
              <span className="text-[13px] font-bold tracking-tight" style={{ color: badge.color }}>{badge.label}</span>
              <span className="text-[13px] font-semibold text-[#1d1d1f]">{badge.rating}</span>
              {badge.stars > 0 && <StarRow count={badge.stars} />}
            </div>
          ))}
        </RevealDiv>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {testimonials.map((t, i) => (
            <RevealDiv key={t.name} delay={i * 0.08}>
              <TiltCard className="h-full">
                <motion.div whileHover={{ boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }} transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-black/[0.06] p-6 sm:p-7 h-full">
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="text-[48px] leading-none text-[#0071e3]/20 font-serif mb-2 select-none" aria-hidden="true">"</motion.div>
                  <StarRow count={t.stars} />
                  <p className="text-[14px] sm:text-[15px] text-[#424245] leading-relaxed mt-4 mb-5">"{t.quote}"</p>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1d1d1f]">{t.name}</p>
                    <p className="text-[12px] text-[#86868b] mt-0.5">{t.role} · {t.location}</p>
                  </div>
                </motion.div>
              </TiltCard>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* ── Email Capture ── */}
      <EmailCapture />

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-[#f5f5f7] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <RevealDiv className="text-center mb-10 sm:mb-12">
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1d1d1f] mb-3 sm:mb-4">Simple, per-computer pricing.</h2>
            <p className="text-[15px] sm:text-[17px] text-[#86868b]">Most offices of 3–5 people pay $600–$1,500 for a complete AI setup.</p>
          </RevealDiv>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((tier, i) => (
              <RevealDiv key={tier.name} delay={i * 0.07}>
                <TiltCard className="h-full">
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                    className={`relative rounded-3xl p-5 sm:p-7 h-full overflow-visible ${tier.popular ? 'bg-[#1d1d1f] text-white ring-1 ring-[#1d1d1f]' : 'bg-white border border-black/[0.06]'}`}>
                    {tier.popular && <PricingPulseRing />}
                    {tier.popular && (
                      <span className="text-[10px] font-bold uppercase tracking-widest mb-4 block truncate text-[#0071e3]">
                        Most popular
                      </span>
                    )}
                    <h3 className={`text-[13px] font-semibold uppercase tracking-wider ${tier.popular ? 'text-white/50' : 'text-[#86868b]'}`}>{tier.name}</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <p className="text-[36px] sm:text-[42px] font-semibold tracking-tight leading-none">${tier.price}</p>
                    </div>
                    <p className={`text-[14px] mt-2 mb-5 sm:mb-7 ${tier.popular ? 'text-white/40' : 'text-[#86868b]'}`}>{tier.desc}</p>
                    <a href={`https://cal.com/simplytech.ai/${tier.slug}`} target="_blank" rel="noopener noreferrer"
                      className={`w-full block text-center py-3 rounded-full text-[14px] font-medium mb-5 sm:mb-6 transition-colors min-h-[44px] flex items-center justify-center ${tier.popular ? 'bg-[#0071e3] text-white hover:bg-[#0077ED]' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'}`}>
                      Book Discovery Call
                    </a>
                    <div className="space-y-2 sm:space-y-3">
                      {tier.features.map((f) => (
                        <div key={f} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? 'text-[#0071e3]' : 'text-[#34c759]'}`} strokeWidth={2.5} />
                          <span className={`text-[12px] sm:text-[13px] leading-snug ${tier.popular ? 'text-white/70' : 'text-[#424245]'}`}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TiltCard>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-2xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <RevealDiv className="text-center mb-10 sm:mb-12">
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1d1d1f]">Questions? Answers.</h2>
        </RevealDiv>
        <RevealDiv delay={0.06} className="bg-white rounded-2xl border border-black/[0.06] px-5 sm:px-6">
          {faqs.map((faq) => <FAQ key={faq.q} q={faq.q} a={faq.a} />)}
        </RevealDiv>
      </section>

      {/* ── Booking CTA ── */}
      <section id="book" className="max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-20">
        <RevealDiv>
          <div className="bg-[#1d1d1f] rounded-3xl p-6 sm:p-12 text-center text-white">
            <h2 className="text-[22px] sm:text-[32px] font-semibold tracking-tight mb-3">Ready to see what AI can do for your team?</h2>
            <p className="text-[14px] sm:text-[17px] text-white/50 mb-6 sm:mb-8 max-w-md mx-auto">
              Book a free 15-minute discovery call. We'll assess your office setup, answer your questions, and give you a custom quote — no obligation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <a href="tel:+18186006825" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1d1d1f] px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-white/90 transition-colors min-h-[52px] sm:min-h-[44px]">
                <Phone className="w-4 h-4" /> (818) 600-6825
              </a>
              <a href="https://cal.com/simplytech.ai/discovery" target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white px-7 py-4 sm:py-3.5 rounded-full text-[16px] font-medium border border-white/20 hover:bg-white/10 transition-colors min-h-[52px] sm:min-h-[44px]">
                <Calendar className="w-4 h-4" /> Book Discovery Call
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto">
              {[
                { name: 'Starter', price: '$199/computer', slug: 'discovery', tagline: 'Perplexity Free setup' },
                { name: 'Pro', price: '$299/computer', slug: 'discovery', tagline: 'Perplexity Pro setup' },
                { name: 'Phone Add-on', price: '$99/phone', slug: 'discovery', tagline: 'Mobile setup per employee' },
              ].map((tier) => (
                <a key={tier.name} href={`https://cal.com/simplytech.ai/${tier.slug}`} target="_blank" rel="noopener noreferrer"
                  className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-xl p-3 sm:p-5 text-center transition-all duration-300 min-h-[44px]">
                  <p className="text-[18px] sm:text-[20px] font-semibold text-white">{tier.price}</p>
                  <p className="text-[12px] sm:text-[13px] text-white/50 mt-1">{tier.name} · {tier.tagline}</p>
                  <p className="text-[12px] text-[#0071e3] mt-2 font-medium">Book Discovery Call</p>
                </a>
              ))}
            </div>
          </div>
        </RevealDiv>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.06] py-8">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <p className="text-[13px] font-semibold text-[#1d1d1f]">Simply AI</p>
            <p className="text-[12px] text-[#86868b] mt-0.5">Perplexity AI setup for LA businesses.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
            <div className="flex items-center gap-5">
              <a href="tel:+18186006825" className="text-[12px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">(818) 600-6825</a>
              <a href="mailto:hello@simplyai.tech" className="text-[12px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">hello@simplyai.tech</a>
            </div>
            <p className="text-[12px] text-[#86868b]">© {new Date().getFullYear()} Simply AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
