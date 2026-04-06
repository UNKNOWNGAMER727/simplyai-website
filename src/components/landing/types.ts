export interface Tier {
  name: string;
  price: number;
  slug: string;
  desc: string;
  popular?: boolean;
  features: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Testimonial {
  name: string;
  location: string;
  role: string;
  stars: number;
  quote: string;
}

export interface StepLabel {
  headline: string;
  sub: string;
}
