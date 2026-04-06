import { CursorSpotlight } from '../components/landing/shared/CursorSpotlight';
import { ScrollProgress } from '../components/landing/shared/ScrollProgress';
import { Nav } from '../components/landing/Nav';
import { Hero } from '../components/landing/Hero';
import { TrustBar } from '../components/landing/TrustBar';
import { WhatItDoes } from '../components/landing/WhatItDoes';
import { BeforeAfter } from '../components/landing/BeforeAfter';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { EmailCapture } from '../components/landing/EmailCapture';
import { FAQ } from '../components/landing/FAQ';
import { BookingCTA } from '../components/landing/BookingCTA';
import { Footer } from '../components/landing/Footer';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-clip noise-bg">
      <CursorSpotlight />
      <ScrollProgress />
      <Nav />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <WhatItDoes />
        <BeforeAfter />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <EmailCapture />
        <FAQ />
        <BookingCTA />
      </main>
      <Footer />
    </div>
  );
}
