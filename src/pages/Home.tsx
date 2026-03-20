import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
});

export function Home() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="text-center pt-16 pb-8">
        <motion.p {...fade(0)} className="text-[#0071e3] text-[14px] font-semibold tracking-wide mb-4">
          Simply AI
        </motion.p>
        <motion.h1 {...fade(0.08)} className="text-[52px] font-semibold tracking-tight leading-[1.05] text-[#1d1d1f] max-w-2xl mx-auto">
          AI for everyone.
          <br />
          <span className="text-[#86868b]">Set up by you.</span>
        </motion.h1>
        <motion.p {...fade(0.16)} className="text-[19px] text-[#86868b] mt-5 max-w-lg mx-auto leading-relaxed">
          You install Perplexity, Copilot, and ChatGPT on people's desktops.
          They get AI. You get paid. Everything else is automated.
        </motion.p>
        <motion.div {...fade(0.24)} className="mt-8 flex justify-center gap-4">
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 bg-[#0071e3] text-white px-6 py-3 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors"
          >
            See the plan <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-[#0071e3] px-6 py-3 rounded-full text-[15px] font-medium hover:bg-[#0071e3]/5 transition-colors"
          >
            View pricing
          </Link>
        </motion.div>
      </section>

      {/* What you sell */}
      <section>
        <motion.h2 {...fade(0)} className="text-[32px] font-semibold tracking-tight text-center mb-12">
          What you're selling.
        </motion.h2>
        <div className="grid grid-cols-3 gap-5">
          {[
            {
              emoji: '🔍',
              name: 'Perplexity',
              desc: 'AI search with real citations. The safest, easiest AI for beginners. Free or $20/mo Pro.',
            },
            {
              emoji: '🪟',
              name: 'Microsoft Copilot',
              desc: 'Already on every Windows PC. Free. Integrates with Office. Very safe, backed by Microsoft.',
            },
            {
              emoji: '💬',
              name: 'ChatGPT',
              desc: 'The best general-purpose AI. Desktop app for Mac and Windows. Image gen, writing, analysis.',
            },
          ].map((product, i) => (
            <motion.div
              key={product.name}
              {...fade(i * 0.08)}
              className="bg-white rounded-2xl p-7 text-center hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-500 border border-black/[0.04]"
            >
              <span className="text-4xl">{product.emoji}</span>
              <h3 className="text-[17px] font-semibold mt-4 mb-2">{product.name}</h3>
              <p className="text-[14px] text-[#86868b] leading-relaxed">{product.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#1d1d1f] -mx-6 px-6 py-20 rounded-3xl text-white text-center">
        <motion.h2 {...fade(0)} className="text-[32px] font-semibold tracking-tight mb-4">
          How it works.
        </motion.h2>
        <motion.p {...fade(0.06)} className="text-[17px] text-white/50 mb-14 max-w-md mx-auto">
          Four steps. You only do step 3.
        </motion.p>
        <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { step: '01', title: 'They find you', desc: 'Website, Google, Nextdoor, or a referral' },
            { step: '02', title: 'AI books it', desc: 'Phone agent or website booking — no work from you' },
            { step: '03', title: 'You show up', desc: 'Install the AI, teach them how to use it, get paid' },
            { step: '04', title: 'AI follows up', desc: 'Automated review request and future upsell' },
          ].map((item, i) => (
            <motion.div key={item.step} {...fade(0.1 + i * 0.08)}>
              <p className="text-[36px] font-bold text-white/10 mb-3">{item.step}</p>
              <h3 className="text-[15px] font-semibold mb-1.5">{item.title}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Numbers */}
      <section className="text-center">
        <motion.h2 {...fade(0)} className="text-[32px] font-semibold tracking-tight mb-12">
          The numbers.
        </motion.h2>
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { value: '$300–$1,000', label: 'Per install' },
            { value: '~$173/mo', label: 'Your overhead' },
            { value: '$4,500+', label: 'Monthly target (10 installs)' },
          ].map((stat, i) => (
            <motion.div key={stat.label} {...fade(i * 0.08)}>
              <p className="text-[34px] font-semibold tracking-tight text-[#1d1d1f]">{stat.value}</p>
              <p className="text-[13px] text-[#86868b] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Next Step */}
      <section className="text-center pb-12">
        <motion.div {...fade(0)} className="bg-white rounded-2xl p-10 border border-black/[0.04]">
          <h2 className="text-[24px] font-semibold tracking-tight mb-2">simplyai.tech</h2>
          <p className="text-[15px] text-[#86868b] mb-6">
            Your domain is live. Let's build your site.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {['simplyai.tech'].map((name) => (
              <button
                key={name}
                className="px-5 py-2.5 rounded-full text-[14px] font-medium border border-black/[0.08] hover:bg-[#1d1d1f] hover:text-white hover:border-transparent transition-all duration-300"
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
