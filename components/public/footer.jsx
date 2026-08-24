"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ParticleText from "@/components/ui/ParticleText";

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 40,
      }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: reduceMotion ? 0.2 : 1.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative z-10 w-full bg-black pt-8 pb-4 overflow-hidden"
    >
      {/* Metadata Row - Padded internally so text stays aligned */}
      <div className="w-full px-4 sm:px-6 md:px-8 flex flex-wrap justify-between items-end gap-y-4 gap-x-6 text-[10px] sm:text-xs text-zinc-400 font-sans tracking-tight leading-tight">
        <div className="flex flex-col">
          <span>All Rights Reserved</span>
          <span>© {new Date().getFullYear()} Inkspire</span>
        </div>

        <div className="flex items-center gap-6 sm:gap-12 ml-auto">
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[9px]">
              Business Inquiries
            </span>
            <span className="text-zinc-300 hover:text-purple-400 transition-colors cursor-pointer font-medium">
              newbiz@inkspire.ai
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[9px]">
              General
            </span>
            <span className="text-zinc-300 hover:text-purple-400 transition-colors cursor-pointer font-medium">
              hello@inkspire.ai
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-zinc-600 uppercase tracking-wider text-[9px]">
              Created By
            </span>
            <span className="text-zinc-300 font-semibold">
              Made with <span className="text-purple-500">💜</span> by HMV
            </span>
          </div>
        </div>
      </div>

      {/* Edge-to-Edge Particle Canvas */}
      <div className="w-full h-[22vw] min-h-[220px] max-h-[450px] select-none mt-4 -mb-14">
        <ParticleText
          text="I N K S P I R E"
          particleSize={2.4}
          density={3.5}
          color="#ffffff"
          highlightColor="#9333ea"
          scatter={100}
          gatherDuration={1400}
          stagger={250}
          pointerRepel={50}
          repelRadius={160}
          idleDrift={0.5}
          trigger="mount"
          fontSize="clamp(4rem, 18vw, 22rem)"
          fontWeight={900}
          glow={false}
        />
      </div>
    </motion.footer>
  );
}
