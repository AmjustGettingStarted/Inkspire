"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

// Local dataset with custom background SVG patterns
const statsData = [
  {
    metric: "50K+",
    label: "Active Creators",
    description: "Building, creating and growing every day.",
    bgPattern: (
      <svg
        className="absolute top-0 right-0 w-full h-full opacity-20 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M50 0C100 50 150 100 200 200"
          stroke="url(#purple-grad-1)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <path
          d="M0 50C50 100 100 150 150 200"
          stroke="url(#purple-grad-1)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <defs>
          <linearGradient id="purple-grad-1" x1="0" y1="0" x2="200" y2="200">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#6b21a8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    metric: "2M+",
    label: "Published Posts",
    description: "High-quality content shared with the world.",
    bgPattern: (
      <svg
        className="absolute top-0 right-0 w-full h-full opacity-20 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M0 100Q100 0 200 100T400 100"
          stroke="#a855f7"
          strokeWidth="1.5"
        />
        <path
          d="M0 120Q100 20 200 120T400 120"
          stroke="#c084fc"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    metric: "10M+",
    label: "Monthly Readers",
    description: "Engaged readers across the globe.",
    bgPattern: (
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full border border-purple-500/20 group-hover:border-purple-500/70 transition-colors duration-500 -translate-y-12 translate-x-12 pointer-events-none" />
    ),
  },
  {
    metric: "99.9%",
    label: "Uptime",
    description: "Built for reliability. Always on, always fast.",
    bgPattern: (
      <svg
        className="absolute -bottom-10 -right-10 w-40 h-40 opacity-20 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
        viewBox="0 0 100 100"
      >
        <path
          d="M10 50 L40 80 L90 20"
          stroke="#a855f7"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// Helper to extract numbers for Framer Motion animation
function parseMetric(metricStr) {
  if (typeof metricStr !== "string")
    return { target: 0, decimals: 0, suffix: "" };

  const numericMatch = metricStr.match(/^[\d.]+/);
  if (!numericMatch) return { target: 0, decimals: 0, suffix: metricStr };

  const target = parseFloat(numericMatch[0]);
  const decimals = numericMatch[0].includes(".")
    ? numericMatch[0].split(".")[1].length
    : 0;
  const suffix = metricStr.replace(numericMatch[0], "");

  return { target, decimals, suffix };
}

function StatCard({ metric, label, description, bgPattern, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");
  const { target, decimals, suffix } = parseMetric(metric);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(current) {
        setDisplayValue(current.toFixed(decimals));
      },
    });

    return () => controls.stop();
  }, [isInView, target, decimals]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 text-left transition-all hover:bg-background duration-500 hover:border-purple-500/80 hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.3)] overflow-hidden"
    >
      {/* Background Pattern */}
      {bgPattern}

      {/* Metric Values */}
      <div className="relative z-10 pt-4">
        <div className="text-4xl sm:text-5xl font-black tracking-tight">
          <span ref={ref} className="text-white">
            {displayValue}
          </span>
          <span className="text-zinc-400 group-hover:text-purple-400 transition-colors duration-300 ml-0.5">
            {suffix}
          </span>
        </div>

        {/* Purple Accent Line */}
        <div className="w-10 h-0.5 bg-purple-600 my-5 rounded-full group-hover:w-14 transition-all duration-300" />
      </div>

      {/* Label & Description */}
      <div className="relative z-10">
        <h3 className="text-base font-semibold text-white tracking-wide">
          {label}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function SocialStatsSection() {
  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
      {/* Bounded Outer Panel */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto rounded-[2.5rem] border border-zinc-800 bg-background p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
      >
        {/* Section Header - Styled Exactly Like Features Section */}
        <div className="mb-12 border-b border-white/[0.06] pb-8 lg:pb-10">
          <div className="mx-auto max-w-3xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[1.3fr_0.9fr] lg:items-end lg:gap-10 text-center lg:text-left">
            <div>
              <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-px w-10 bg-white/12" />
                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
                  Impact
                </span>
                <span className="h-px w-10 bg-white/12" />
              </div>

              <h2 className="text-balance text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl lg:max-w-3xl lg:text-7xl lg:leading-[0.9]">
                <span className="block">Loved By</span>
                <span className="block">
                  <span className="text-purple-600">Creators</span> Worldwide
                </span>
              </h2>
            </div>

            <div className="mx-auto mt-5 max-w-2xl lg:mx-0 lg:mt-0 lg:max-w-none lg:border-l lg:border-white/[0.08] lg:pl-8 lg:pb-1">
              <p className="text-pretty text-sm leading-7 text-slate-300/78 sm:text-base lg:text-lg lg:leading-8">
                Empowering creators and brands to automate content, grow
                audiences, and scale faster.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-300 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)] transition-colors hover:border-purple-500/60 hover:bg-purple-500/20">
                  Scale
                </span>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-300 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)] transition-colors hover:border-purple-500/60 hover:bg-purple-500/20">
                  Reach
                </span>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-300 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)] transition-colors hover:border-purple-500/60 hover:bg-purple-500/20">
                  Engage
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              index={index}
              metric={stat.metric}
              label={stat.label}
              description={stat.description}
              bgPattern={stat.bgPattern}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
