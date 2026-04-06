import { Phone, Calendar } from 'lucide-react';
import { RevealDiv } from './shared/RevealDiv';

export function BookingCTA() {
  return (
    <section
      id="book"
      className="py-20 sm:py-28 md:py-32 relative overflow-hidden"
      style={{ scrollMarginTop: 72 }}
    >
      {/* Gradient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 70%, rgba(139,92,246,0.06) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <RevealDiv>
          <h2 className="text-[32px] sm:text-[44px] lg:text-[56px] font-bold tracking-tight text-white mb-4 leading-[1.1]">
            Ready to save your team hours every week?
          </h2>
          <p className="text-[16px] sm:text-[18px] text-zinc-400 mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
            Book a free 15-minute Discovery Call. No commitment, no pressure.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a
              href="https://cal.com/simplytech.ai/basic-ai-setup-300"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a free discovery call - opens in new tab"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-10 py-4 sm:py-3.5 rounded-full text-[16px] font-medium hover:bg-zinc-200 transition-colors min-h-[48px]"
            >
              <Calendar className="w-4 h-4" /> Book My Free Call
            </a>
            <a
              href="tel:+13613158585"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white px-8 py-4 sm:py-3.5 rounded-full text-[16px] font-medium border border-white/20 hover:bg-white/[0.05] transition-colors min-h-[48px]"
            >
              <Phone className="w-4 h-4" /> (361) 315-8585
            </a>
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}
