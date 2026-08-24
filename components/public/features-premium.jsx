"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { features } from "@/lib/data";
import { cn } from "@/lib/utils";

const featureLayouts = [
  {
    span: "col-span-12 lg:col-span-4 lg:row-span-2",
    imageClassName: "h-56 sm:h-64 lg:h-[19rem] object-cover object-center",
    tone: "bg-[#e8e1d8]",
    cta: true,
  },
  {
    span: "col-span-12 md:col-span-8 lg:col-span-5",
    imageClassName: "h-40 sm:h-44 object-cover object-center",
    tone: "bg-[#ebe6df]",
  },
  {
    span: "col-span-12 md:col-span-4 lg:col-span-3",
    imageClassName: "h-40 sm:h-44 object-cover object-center",
    tone: "bg-[#e7e2db]",
  },
  {
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    imageClassName: "h-40 sm:h-44 object-cover object-center",
    tone: "bg-[#ece7e0]",
  },
  {
    span: "col-span-12 md:col-span-6 lg:col-span-3 lg:row-span-2",
    imageClassName: "h-56 sm:h-64 lg:h-[19rem] object-cover object-center",
    tone: "bg-[#e5dfd7]",
  },
  {
    span: "col-span-12 md:col-span-6 lg:col-span-5",
    imageClassName: "h-40 sm:h-44 object-cover object-center",
    tone: "bg-[#ece8e1]",
  },
  {
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    imageClassName: "h-40 sm:h-44 object-cover object-center",
    tone: "bg-[#ebe4dc]",
  },
  {
    span: "col-span-12 md:col-span-6 lg:col-span-6",
    imageClassName: "h-44 sm:h-48 object-cover object-center",
    tone: "bg-[#e7e1d8]",
  },
  {
    span: "col-span-12 md:col-span-6 lg:col-span-6",
    imageClassName: "h-44 sm:h-48 object-cover object-center",
    tone: "bg-[#ece7df]",
  },
];

const featureVisuals = [
  {
    src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
    alt: "Premium close-up of handwriting on paper",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    alt: "Stylish group conversation representing community",
  },
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    alt: "Analytics dashboard on a large display",
  },
  {
    src: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=80",
    alt: "Minimal desk planner and schedule setup",
  },
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
    alt: "Photographer working with premium camera equipment",
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    alt: "Creative team researching content on screens",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    alt: "Modern creative workspace for content generation",
  },
  {
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=80",
    alt: "Mobile devices representing cross-platform sharing",
  },
  {
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80",
    alt: "Secure digital payment and privacy workflow",
  },
];

function FeatureTile({ feature, visual, layout, index, reduceMotion }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0.18 : 0.55,
        delay: reduceMotion ? 0 : index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -4,
              scale: 1.006,
              transition: { duration: 0.24, ease: "easeOut" },
            }
      }
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
      className={cn(
        "group relative overflow-hidden rounded-[28px] p-px",
        layout.span,
      )}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-70"
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
                duration: 16,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }
        }
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.08), rgba(255,255,255,0.22), rgba(255,255,255,0.05), rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at ${pointer.x}px ${pointer.y}px, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 34%, transparent 68%)`,
        }}
      />
      <div className="relative flex h-full flex-col rounded-[27px] bg-[#050505] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.4)] sm:p-4">
        <div className="pointer-events-none absolute inset-px rounded-[26px] border border-white/[0.06]" />
        <div className="relative overflow-hidden rounded-[20px] bg-[#0b0b0b]">
          <img
            src={visual.src}
            alt={visual.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              "w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]",
              layout.imageClassName,
            )}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between gap-4 px-1 pb-1 pt-4 text-white">
          <div className="space-y-2.5">
            <h3 className="max-w-[18ch] text-xl font-semibold tracking-tight text-white sm:text-[1.75rem] sm:leading-[1.05]">
              {feature.title}
            </h3>
            <p className="max-w-[32ch] text-sm leading-6 text-slate-300/78 sm:text-[15px]">
              {feature.desc}
            </p>
          </div>

          {layout.cta ? (
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white transition-transform duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.06]"
              >
                Explore Features
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturesPremium() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="features"
      className="relative z-10 -mt-10 overflow-hidden bg-black px-4 pb-16 pt-20 sm:-mt-14 sm:px-6 sm:pb-24 sm:pt-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[38px]">
          <motion.div
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 50,
              scale: reduceMotion ? 1 : 0.96,
            }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{
              duration: reduceMotion ? 0.2 : 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative overflow-hidden rounded-[38px] p-4"
          >
            {/* 2. Rotating Border Effect */}
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
                      duration: 24,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    }
              }
            />
            <div className="pointer-events-none absolute inset-px rounded-[36px] border border-white/[0.06]" />
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: reduceMotion ? 0.18 : 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-10 border-b border-white/[0.06] px-3 pb-7 pt-3 text-center sm:px-5 sm:pb-9 sm:pt-4 lg:px-8 lg:pb-10 lg:pt-7 lg:text-left"
            >
              <div className="mx-auto max-w-3xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[1.3fr_0.9fr] lg:items-end lg:gap-10">
                <div>
                  <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
                    <span className="h-px w-10 bg-white/12" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
                      Features
                    </span>
                    <span className="h-px w-10 bg-white/12" />
                  </div>

                  <h2 className="text-balance text-3xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl lg:max-w-3xl lg:text-7xl lg:leading-[0.9]">
                    <span className="block">Everything</span>
                    <span className="block">
                      <span className="text-purple-600">You</span> Need
                    </span>
                  </h2>
                </div>

                <div className="mx-auto mt-5 max-w-2xl lg:mx-0 lg:mt-0 lg:max-w-none lg:border-l lg:border-white/[0.08] lg:pl-8 lg:pb-1">
                  <p className="text-pretty text-sm leading-7 text-slate-300/78 sm:text-base lg:text-lg lg:leading-8">
                    The complete AI toolkit for creators to write, publish, and
                    grow.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                    <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-300 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)] transition-colors hover:border-purple-500/60 hover:bg-purple-500/20">
                      Write
                    </span>
                    <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-300 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)] transition-colors hover:border-purple-500/60 hover:bg-purple-500/20">
                      Publish
                    </span>
                    <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-300 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)] transition-colors hover:border-purple-500/60 hover:bg-purple-500/20">
                      Grow
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="relative grid grid-cols-1 gap-3 pt-3 md:grid-cols-12 lg:auto-rows-[minmax(170px,auto)] lg:gap-4 lg:pt-4">
              {features.map((feature, index) => (
                <FeatureTile
                  key={feature.title}
                  feature={feature}
                  visual={featureVisuals[index]}
                  layout={featureLayouts[index]}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
