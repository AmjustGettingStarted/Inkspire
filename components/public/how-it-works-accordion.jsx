"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const moduleImages = {
  "Content Creation":
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
  "Audience Growth":
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
  "Content Management":
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1600&q=80",
  "Discovery Feed":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  "AI Image Studio":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
];

function getPanelImage(item, index) {
  return (
    item.image ||
    moduleImages[item.title] ||
    fallbackImages[index % fallbackImages.length]
  );
}

export default function HowItWorksAccordion({ items = [], defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const reduceMotion = useReducedMotion();

  const panels = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        image: getPanelImage(item, index),
      })),
    [items],
  );

  if (!panels.length) return null;

  return (
    <div className="w-full">
      {/* 1. Header Animated Block */}
      <motion.div
        initial={{
          opacity: 0,
          y: reduceMotion ? 0 : 35,
        }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: reduceMotion ? 0.2 : 1.0,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="mb-12 text-center"
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
            — Workflow —
          </div>
          <h2 className="text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            <span className="text-white">How it </span>
            <span className="text-purple-600">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-400">
            Five interconnected modules working together to scale your content
            strategy.
          </p>
        </div>
      </motion.div>

      {/* 2. Accordion Container Animated Block */}
      <motion.div
        initial={{
          opacity: 0,
          y: reduceMotion ? 0 : 45,
          scale: reduceMotion ? 1 : 0.97,
        }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{
          duration: reduceMotion ? 0.2 : 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="mb-3 flex justify-center md:hidden">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500 motion-safe:animate-pulse">
            Swipe horizontally to explore →
          </p>
        </div>

        <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex h-[460px] min-w-[1120px] w-full gap-3 overflow-hidden rounded-[30px] md:h-[560px] md:min-w-0 md:gap-4">
            {panels.map((item, index) => {
              const isActive = activeIndex === index;
              const stepLabel = `0${index + 1}`.slice(-2);

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`group relative h-full min-w-[88px] overflow-hidden rounded-[24px] border border-white/10 text-left will-change-[flex-grow,filter,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:min-w-[96px] ${
                    isActive ? "flex-[4.8]" : "flex-[0.95] hover:flex-[1.08]"
                  }`}
                  style={{
                    transition:
                      "flex-grow 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease, transform 0.45s ease",
                  }}
                  aria-pressed={isActive}
                  aria-label={`Open ${item.title}`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[24px]">
                    <div
                      className={`absolute inset-0 bg-cover bg-center will-change-transform ${
                        isActive ? "scale-100" : "scale-[1.04]"
                      }`}
                      style={{
                        backgroundImage: `url(${item.image})`,
                        transition:
                          "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease, opacity 0.4s ease",
                        filter: isActive
                          ? "grayscale(0) brightness(1)"
                          : "grayscale(0.4) brightness(0.55)",
                        transform: isActive
                          ? "scale(1) translateZ(0)"
                          : "scale(1.04) translateZ(0)",
                      }}
                    />

                    <div
                      className={`absolute inset-0 ${
                        isActive
                          ? "bg-gradient-to-t from-black/90 via-black/45 to-transparent"
                          : "bg-gradient-to-t from-black/95 via-black/75 to-black/45"
                      }`}
                      style={{
                        transition: "opacity 0.35s ease, background 0.35s ease",
                      }}
                    />

                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  {!isActive && (
                    <div className="absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-white/80 backdrop-blur-md">
                          Step {stepLabel}
                        </span>
                        <span className="rounded-full bg-black/30 px-2 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white [writing-mode:vertical-rl] [text-orientation:mixed] backdrop-blur-sm">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-8"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : "translateY(22px)",
                      transition:
                        "opacity 0.3s ease 0.16s, transform 0.42s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <div className="max-w-xl space-y-4 sm:space-y-5">
                      <div className="space-y-3">
                        <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-white/75 backdrop-blur-sm">
                          Step {stepLabel}
                        </span>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2rem]">
                            {item.title}
                          </h3>
                          <p className="max-w-lg text-sm leading-6 text-white/72 sm:text-base">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                        {item.features?.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-3.5 py-2.5 text-xs text-white/88 backdrop-blur-sm sm:px-4 sm:py-3 sm:text-sm"
                          >
                            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/90" />
                            <span className="leading-5">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
