import { Star } from 'lucide-react';
import { RevealDiv } from './shared/RevealDiv';
import { testimonials } from './data';

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5 fill-amber-400"
          style={{ color: '#f59e0b' }}
          strokeWidth={0}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div
      className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-7 shrink-0 w-[340px] group hover:border-blue-500/20 transition-all duration-300"
      style={{
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Opening quote in gradient */}
      <span
        className="text-4xl leading-none mb-1 block select-none bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        aria-hidden="true"
      >
        {'\u201C'}
      </span>

      <StarRow count={t.stars} />

      <p className="text-sm sm:text-[15px] text-zinc-400 leading-relaxed mt-4 mb-6">
        {t.quote}
      </p>

      <div>
        <p className="text-[13px] font-semibold text-white">{t.name}</p>
        <p className="text-xs text-zinc-400 mt-0.5">
          {t.role}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {t.location}
        </p>
      </div>
    </div>
  );
}

export function Testimonials() {
  // Double the testimonials for seamless infinite scroll
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-20 sm:py-28 md:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <RevealDiv className="text-center mb-12 sm:mb-16">
          <h2 className="text-[28px] sm:text-[40px] font-bold tracking-tight text-white mb-3 leading-tight">
            What LA business owners are saying.
          </h2>
          <p className="text-[15px] sm:text-lg text-zinc-400 max-w-md mx-auto">
            Real businesses. Real results. No tech background required.
          </p>
        </RevealDiv>

        {/* Rating badges */}
        <RevealDiv
          delay={0.05}
          className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap mb-12 sm:mb-16"
        >
          {[
            { label: 'Google', rating: '5.0', stars: 5, color: '#4285F4' },
            { label: 'Yelp', rating: '5.0', stars: 5, color: '#d32323' },
            { label: 'BBB Accredited', rating: 'A+', stars: 0, color: '#4a90d9' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5"
            >
              <span
                className="text-[12px] font-bold tracking-tight"
                style={{ color: badge.color }}
              >
                {badge.label}
              </span>
              <span className="text-[13px] font-semibold text-white">{badge.rating}</span>
              {badge.stars > 0 && <StarRow count={badge.stars} />}
            </div>
          ))}
        </RevealDiv>
      </div>

      {/* Marquee on desktop, vertical stack on mobile */}
      <RevealDiv>
        {/* Desktop marquee */}
        <div className="hidden md:block relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#09090b] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#09090b] to-transparent" />

          <div className="flex gap-5 marquee-track" style={{ width: 'max-content' }}>
            {doubled.map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Mobile stack */}
        <div className="md:hidden flex flex-col gap-4 px-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </RevealDiv>
    </section>
  );
}
