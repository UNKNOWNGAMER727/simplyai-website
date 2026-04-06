import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { RevealDiv } from './shared/RevealDiv';

export function EmailCapture() {
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
    <section className="py-16 sm:py-24 relative" style={{ scrollMarginTop: 72 }}>
      {/* Radial glow behind the form */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-xl mx-auto px-5 sm:px-6 text-center">
        <RevealDiv>
          <h2 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-white mb-2">
            Not ready to book? No problem.
          </h2>
          <p className="text-[14px] sm:text-[16px] text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
            Get our free guide: 10 ways AI can save your business time this week.
          </p>

          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex items-center justify-center gap-2 text-green-400 font-medium text-[15px]"
              >
                <Check className="w-5 h-5" strokeWidth={2.5} /> Sent! Check your inbox.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <label htmlFor="email-capture-input" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-capture-input"
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 h-12 rounded-xl bg-white/[0.05] border border-white/10 text-[14px] text-white placeholder:text-zinc-500 outline-none focus:border-blue-500 transition-all duration-200"
                  style={{
                    boxShadow: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-white text-black px-6 h-12 rounded-xl text-[14px] font-medium transition-all duration-200 shrink-0 disabled:opacity-60 hover:bg-zinc-200"
                >
                  {status === 'loading' ? 'Sending\u2026' : 'Send it to me'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {status === 'error' && (
            <p className="mt-3 text-[13px] text-red-400">
              Something went wrong -- try calling us instead.
            </p>
          )}
          <p className="text-[12px] text-zinc-500 mt-4">No spam. Unsubscribe any time.</p>
        </RevealDiv>
      </div>
    </section>
  );
}
