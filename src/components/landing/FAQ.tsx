import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { RevealDiv } from './shared/RevealDiv';
import { faqs } from './data';

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left min-h-[56px] py-5 transition-colors duration-200 group"
      >
        <span className="text-[16px] sm:text-[18px] font-medium text-white pr-4 sm:pr-6 break-words leading-snug">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0 group-hover:text-zinc-400 transition-colors" strokeWidth={1.8} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="faq-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[14px] sm:text-[15px] text-zinc-400 leading-[1.65] pb-5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28" style={{ scrollMarginTop: 72 }}>
      <div className="max-w-[640px] mx-auto px-5 sm:px-6">
        <RevealDiv className="text-center mb-12 sm:mb-16">
          <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-white">
            Questions? Answers.
          </h2>
        </RevealDiv>

        <RevealDiv delay={0.06}>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </RevealDiv>
      </div>
    </section>
  );
}
