import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#what', label: 'What It Does' },
  { href: '#how', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-50 overflow-hidden border-t border-white/[0.05] sm:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1 bg-[#09090b]/95 backdrop-blur-xl">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="text-[15px] text-zinc-400 py-3 font-medium border-b border-white/[0.05] last:border-0 transition-colors duration-150 hover:text-white"
                >
                  {label}
                </a>
              ))}
              <a
                href="tel:+13613158585"
                className="mt-3 inline-flex items-center justify-center gap-2 bg-white/[0.05] border border-white/[0.08] text-white px-5 py-3.5 rounded-full text-[15px] font-medium min-h-[44px]"
              >
                <Phone className="w-4 h-4" /> (361) 315-8585
              </a>
              <a
                href="https://cal.com/simplytech.ai/basic-ai-setup-300"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                aria-label="Book a free discovery call - opens in new tab"
                className="mt-2 inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-3.5 rounded-full text-[15px] font-medium min-h-[44px] hover:bg-zinc-200 transition-colors"
              >
                Book Discovery Call
              </a>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Nav() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(9,9,11,0.8)' : 'rgba(9,9,11,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to main content
      </a>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 flex items-center justify-between h-16">
        <span className="text-[16px] font-semibold tracking-tight text-white">
          Simply AI
        </span>

        <div className="hidden sm:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[14px] text-zinc-400 hover:text-white transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <a
            href="tel:+13613158585"
            className="inline-flex items-center gap-1.5 text-[14px] text-zinc-400 hover:text-white transition-colors duration-200"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={1.8} />
            (361) 315-8585
          </a>
          <a
            href="https://cal.com/simplytech.ai/basic-ai-setup-300"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book a free discovery call - opens in new tab"
            className="text-white px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 border border-white/10 hover:bg-white/[0.05] min-h-[36px] inline-flex items-center"
          >
            Discovery Call
          </a>
        </div>

        <button
          onClick={() => setMobileNavOpen(o => !o)}
          className="sm:hidden flex items-center justify-center w-10 h-10 text-white"
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  );
}
