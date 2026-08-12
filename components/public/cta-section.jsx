"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function CtaSection() {
  const reduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
      {/* Outer Shell with Animated Conic Border & Pointer Tracker */}
      <div
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPointer({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }}
        className="max-w-7xl mx-auto group relative overflow-hidden rounded-[38px] p-px"
      >
        {/* Rotating Border Glow */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[38px] opacity-75"
          animate={
            reduceMotion
              ? undefined
              : {
                  rotate: 360,
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 20,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }
          }
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.08), rgba(255,255,255,0.2), rgba(255,255,255,0.05), rgba(147,51,234,0.4), rgba(255,255,255,0.08))",
          }}
        />

        {/* Interactive Pointer Spotlight Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[38px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${pointer.x}px ${pointer.y}px, rgba(168,85,247,0.15), rgba(255,255,255,0.03) 40%, transparent 80%)`,
          }}
        />

        {/* Inner Card Container */}
        <div className="relative rounded-[37px] bg-[#030303] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute inset-px rounded-[36px] border border-white/[0.06]" />

          {/* Subtle Radial Purple Glow Background */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

          {/* 2-Column Grid Layout */}
          <div className="relative z-10 mx-auto max-w-3xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[1.3fr_0.9fr] lg:items-center lg:gap-10 text-center lg:text-left">
            {/* Left Column: Eyebrow + Big Heading */}
            <div>
              <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-px w-10 bg-white/12" />
                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
                  Get Started
                </span>
                <span className="h-px w-10 bg-white/12" />
              </div>

              <h2 className="text-balance text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl lg:max-w-3xl lg:text-7xl lg:leading-[0.9]">
                <span className="block">Ready To</span>
                <span className="block text-purple-600">Create?</span>
              </h2>
            </div>

            {/* Right Column: Description + Buttons */}
            <div className="mx-auto mt-6 max-w-2xl lg:mx-0 lg:mt-0 lg:max-w-none lg:border-l lg:border-white/[0.08] lg:pl-8">
              <p className="text-pretty text-sm leading-7 text-slate-300/78 sm:text-base lg:text-lg lg:leading-8">
                Join thousands of creators who are already building their
                audience and growing their business with our AI-powered
                platform.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Primary Purple Pill Button */}
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto cursor-pointer px-6 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_8px_20px_-4px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2">
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                {/* Secondary White Pill Button */}
                <Link href="/feed" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto cursor-pointer px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2.5">
                    <Play className="w-3.5 h-3.5 fill-current text-black" />
                    <span>Explore Feed</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
