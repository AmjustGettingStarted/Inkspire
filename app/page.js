"use client";

import React from "react";

import { platformTabs, testimonials } from "@/lib/data";
import HeroSection from "@/components/public/hero-section";
import FeaturesPremium from "@/components/public/features-premium";
import HowItWorksAccordion from "@/components/public/how-it-works-accordion";
import SocialStatsSection from "@/components/public/social-stats-section";
import Footer from "@/components/public/footer";
import CtaSection from "@/components/public/cta-section";
import TestimonialsSection from "@/components/public/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Hero Section */}
      <HeroSection />

      <FeaturesPremium />

      {/* How it Works Section */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <HowItWorksAccordion items={platformTabs} defaultIndex={0} />
        </div>
      </section>

      {/* Social Proof Stats */}
      <SocialStatsSection />

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
