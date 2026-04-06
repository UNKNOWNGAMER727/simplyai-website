import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { DesktopDemo } from './DesktopDemo';
import { VideoBackground } from './shared/VideoBackground';

function HeroHeadline() {
  const shouldReduceMotion = useReducedMotion();

  const line1 = ['We', 'put', 'an', 'AI', 'assistant'];
  const line2 = ['on', 'your'];
  const highlight = ['office', 'computers.'];

  if (shouldReduceMotion) {
    return (
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.07 }}
        className="text-[44px] sm:text-[64px] lg:text-[84px] font-bold tracking-[-0.03em] leading-[1.05] max-w-4xl mx-auto"
      >
        <span className="text-white">We put an AI assistant on your </span>
        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          office computers.
        </span>
      </motion.h1>
    );
  }

  const allWords = [...line1, ...line2, ...highlight];

  return (
    <motion.h1
      initial={{ scale: 0.95, filter: 'blur(8px)' }}
      animate={{ scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-[44px] sm:text-[64px] lg:text-[84px] font-bold tracking-[-0.03em] leading-[1.05] max-w-4xl mx-auto"
    >
      {allWords.map((word, i) => {
        const isHighlight = i >= line1.length + line2.length;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1 + i * 0.06,
              ease: [0.22, 0.03, 0.26, 1],
            }}
            className={`inline-block mr-[0.25em] ${
              isHighlight
                ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent'
                : 'text-white'
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 text-center overflow-hidden">
      {/* Cinematic video background with darker overlay */}
      <VideoBackground
        videoSrc="/videos/hero-bg.mp4"
        posterSrc="/videos/hero-bg-poster.jpg"
        overlayOpacity={0.7}
      />

      {/* Radial glow behind headline */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto pt-24 pb-16">
        <HeroHeadline />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[16px] sm:text-[18px] text-zinc-300 mt-6 sm:mt-8 max-w-xl mx-auto leading-relaxed"
        >
          Your team wastes hours every week on emails, research, and admin tasks that a computer could handle in seconds. We fix that — in one visit.
        </motion.p>

        {/* Audience callout */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[13px] sm:text-[14px] text-zinc-400 mt-3 max-w-lg mx-auto"
        >
          Trusted by law firms, dental offices, contractors, and real estate teams across Los Angeles
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
        >
          <a
            href="https://cal.com/simplytech.ai/basic-ai-setup-300"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-full text-[16px] font-medium transition-all duration-200 hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] min-h-[48px] w-full sm:w-auto"
          >
            Book a Free Discovery Call
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="tel:+13613158585"
            className="inline-flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-full text-[16px] font-medium transition-all duration-200 border border-white/20 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] min-h-[48px] w-full sm:w-auto"
          >
            <Phone className="w-4 h-4" /> (361) 315-8585
          </a>
        </motion.div>
      </div>

      {/* DesktopDemo below the fold -- users scroll to see it */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-3xl mx-auto pb-20"
      >
        <DesktopDemo />
      </motion.div>
    </section>
  );
}
