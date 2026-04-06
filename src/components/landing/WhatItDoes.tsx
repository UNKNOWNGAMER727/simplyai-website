import { motion } from 'framer-motion';
import { Search, Zap, GraduationCap, Scale, Hammer, Stethoscope, FileText, Calendar, User, Home } from 'lucide-react';
import { RevealDiv } from './shared/RevealDiv';

interface BentoItem {
  icon: React.ReactNode;
  name: string;
  desc: string;
  span: 1 | 2;
}

const features: BentoItem[] = [
  {
    icon: <Search className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Answers Any Question',
    desc: '"How do I get more Google reviews?" -- instant, accurate answers with sources your team can trust.',
    span: 2,
  },
  {
    icon: <Zap className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Writes For You',
    desc: 'Emails, proposals, listing descriptions, patient letters. Draft anything in seconds.',
    span: 1,
  },
  {
    icon: <GraduationCap className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Does Your Research',
    desc: 'Competitor pricing, code lookups, legal summaries. Hours of work in minutes.',
    span: 1,
  },
  {
    icon: <FileText className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Organizes Your Files',
    desc: 'Summarize documents, extract key info from contracts, and organize your digital workspace effortlessly.',
    span: 1,
  },
  {
    icon: <Calendar className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Manages Your Schedule',
    desc: 'Draft meeting agendas, prep for calls, and stay on top of deadlines without the mental overhead.',
    span: 1,
  },
];

const industries: BentoItem[] = [
  {
    icon: <Scale className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Law Firms',
    desc: 'Your team researches cases and drafts letters in seconds instead of hours.',
    span: 1,
  },
  {
    icon: <Hammer className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Contractors & Real Estate',
    desc: 'Look up codes, write estimates, and answer client emails instantly.',
    span: 2,
  },
  {
    icon: <Stethoscope className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Medical & Dental',
    desc: 'Draft patient communications and research anything without leaving your desk.',
    span: 1,
  },
  {
    icon: <User className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Freelancers & Solopreneurs',
    desc: 'Write proposals, handle client emails, and research anything — like having a virtual assistant on call 24/7.',
    span: 1,
  },
  {
    icon: <Home className="w-6 h-6" strokeWidth={1.5} />,
    name: 'Personal Use',
    desc: 'Plan trips, compare products, draft letters, and get instant answers to any question from your home computer.',
    span: 2,
  },
];

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  return (
    <RevealDiv
      delay={index * 0.08}
      className={item.span === 2 ? 'md:col-span-2' : ''}
    >
      <motion.div
        whileHover={{
          y: -4,
          borderColor: 'rgba(59,130,246,0.2)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 md:p-8 h-full overflow-hidden group"
        style={{ minHeight: item.span === 2 ? 200 : 180 }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.06) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5 bg-blue-500/10 text-blue-400">
            {item.icon}
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-2 text-white tracking-tight">
            {item.name}
          </h3>
          <p className="text-sm md:text-[15px] text-zinc-400 leading-relaxed">
            {item.desc}
          </p>
        </div>
      </motion.div>
    </RevealDiv>
  );
}

function BentoGrid({
  items,
  sectionTitle,
  sectionSub,
}: {
  items: BentoItem[];
  sectionTitle: string;
  sectionSub: string;
}) {
  return (
    <>
      <RevealDiv className="text-center">
        <h2 className="text-[28px] sm:text-[40px] font-bold tracking-tight text-white mb-3 sm:mb-4 leading-tight">
          {sectionTitle}
        </h2>
        <p className="text-[15px] sm:text-lg text-zinc-400 mb-10 sm:mb-14 max-w-lg mx-auto">
          {sectionSub}
        </p>
      </RevealDiv>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <BentoCard key={item.name} item={item} index={i} />
        ))}
      </div>
    </>
  );
}

export function WhatItDoes() {
  return (
    <>
      <section
        id="what"
        className="w-full py-20 sm:py-28 md:py-32"
        style={{ scrollMarginTop: 72 }}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <BentoGrid
            items={features}
            sectionTitle="What It Does"
            sectionSub="An AI assistant that helps your team work faster -- right from their computers."
          />
        </div>
      </section>

      <section className="w-full py-20 sm:py-28 md:py-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <BentoGrid
            items={industries}
            sectionTitle="Who It's For"
            sectionSub="Anyone who wants to work smarter — from LA businesses to everyday users."
          />
        </div>
      </section>
    </>
  );
}
