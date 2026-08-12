"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { platformTabs, socialProofStats, testimonials } from "@/lib/data";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import HeroSection from "@/components/public/hero-section";
import FeaturesPremium from "@/components/public/features-premium";
import HowItWorksAccordion from "@/components/public/how-it-works-accordion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Hero Section */}
      <HeroSection />

      <FeaturesPremium />

      {/* Platform Showcase */}
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

      {/* Social Proof Stats */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-12 sm:mb-16">
            <span className="gradient-text-primary">
              Loved by creators worldwide
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {socialProofStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-3xl sm:text-5xl font-black mb-2 gradient-text-accent">
                  {stat.metric}
                </div>
                <div className="text-gray-400 text-base sm:text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-12">
            <span className="gradient-text-primary">What Creators Say</span>
          </h2>
          <AnimatedTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-black mb-6">
            <span className="gradient-text-primary">Ready to create?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Join thousands of creators who are already building their audience
            and growing their business with our AI-powered platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard">
              <Button
                size="xl"
                variant="primary"
                className="rounded-full text-white w-full"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button
                variant="outline"
                size="xl"
                className="rounded-full w-full"
              >
                Explore the Feed
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-400 text-sm">
          <p>
            Made with ❤️ by{" "}
            <span className="text-white font-semibold">HMV</span>
          </p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
