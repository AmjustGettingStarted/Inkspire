"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function TestimonialsSection({ testimonials = [] }) {
  return (
    <section
      id="testimonials"
      className="relative z-10 py-16 sm:py-24 px-4 sm:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto rounded-[2.5rem] bg-background p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
      >
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 text-xs uppercase tracking-widest text-zinc-500 font-semibold">
              — Testimonials —
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[-0.04em] text-white">
              Trusted by{" "}
              <span className="text-purple-600">industry leaders</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-400">
              See how creators and teams are scaling their workflow with our
              platform.
            </p>
          </div>
        </div>

        {/* Animated Testimonials with Passed Data */}
        <div className="relative z-10">
          <AnimatedTestimonials testimonials={testimonials} />
        </div>
      </motion.div>
    </section>
  );
}
