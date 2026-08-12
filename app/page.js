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

      {/* How it Works */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <div className="mx-auto max-w-3xl">
              <div className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
                — Workflow —
              </div>
              <h2 className="text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                <span className="text-white">How it </span>
                <span className="text-purple-600">Works</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-400">
                Five interconnected modules working together to scale your
                content strategy.
              </p>
            </div>
          </div>

          <HowItWorksAccordion items={platformTabs} defaultIndex={0} />
        </div>
      </section>

      {/* Social Proof Stats (Restored to original placement) */}
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
