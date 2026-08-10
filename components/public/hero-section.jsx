"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SplineScene } from "@/components/ui/spline-scene";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-black text-white flex flex-col justify-between p-6 sm:p-10 lg:p-16">
      {/* Background 3D Spline Scene */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {/* Centered Purple Ambient Glow Behind Robot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />

        {/* Bottom Shadow Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-10" />
      </div>

      {/* Content Container - Fixed to Bottom Left */}
      <div className="relative z-20 mt-auto max-w-2xl space-y-4 pb-4">
        {/* Solid White Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
          Create <span className="text-purple-600">AI</span> content <br />
          without limits.
        </h1>

        {/* Subtitle / Description */}
        <p className="text-sm sm:text-base text-gray-300 font-normal max-w-lg leading-relaxed">
          The AI-powered platform that turns your ideas into{" "}
          <span className="text-white font-medium">engaging content</span> and
          helps you grow a thriving creator business.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {/* Primary CTA (Purple Rectangle) */}
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-600 text-white font-medium px-7 py-6 rounded-sm text-sm transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98] border-0 shadow-lg shadow-purple-950/40"
          >
            <Link href="/dashboard">Start Creating for Free</Link>
          </Button>

          {/* Secondary CTA (White Rectangle) */}
          <Button
            asChild
            className="bg-white hover:bg-white text-black font-medium px-7 py-6 rounded-sm text-sm transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98] border-0 shadow-md"
          >
            <Link href="/feed">Explore the Feed</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
