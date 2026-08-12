"use client";

import Link from "next/link";
import { Chakra_Petch, DM_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import { SplineScene } from "@/components/ui/spline-scene";

const displayFont = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-screen overflow-hidden bg-black text-white flex flex-col justify-between px-5 pt-24 pb-6 sm:px-8 sm:pt-28 sm:pb-8 md:px-10 md:pt-32 lg:px-16 lg:pt-36 lg:pb-10">
      {/* Background 3D Spline Scene */}
      <div className="absolute inset-0 z-0 w-full h-full flex items-start lg:items-end justify-center overflow-hidden">
        {/* Centered Purple Ambient Glow Behind Robot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Scaled Spline Robot */}
        <div className="w-full h-full translate-y-24 sm:translate-y-28 md:translate-y-32 lg:translate-y-16 xl:translate-y-18 scale-[0.7] sm:scale-[0.8] md:scale-[0.9] lg:scale-[1.22] xl:scale-[1.32] origin-center transition-transform duration-700 ease-out md:-mb-8">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Bottom Shadow Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 lg:h-10 bg-black pointer-events-none z-10" />
      </div>

      {/* Content Container - Fixed to Bottom */}
      <div className="relative z-20 flex h-full w-full flex-col pt-10 sm:pt-14 md:pt-20 pointer-events-none lg:mt-auto lg:h-auto lg:block lg:w-full lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start lg:items-end h-full lg:h-auto">

          {/* Bottom-left: Supporting Sentence + Three-line Stacked Headline */}
          <div className="lg:col-span-8 flex flex-col space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Small supporting sentence */}
            <p className={`${bodyFont.className} text-[11px] sm:text-xs font-medium tracking-[0.24em] sm:tracking-[0.28em] text-purple-400 uppercase transition-colors duration-300 hover:text-purple-300 max-w-[19rem] sm:max-w-sm lg:max-w-none`}>
              Simple, expressive, and built for modern creators.
            </p>

            {/* Headline */}
            <h1 className={`${displayFont.className} text-[4rem] sm:text-[4.8rem] md:text-[5.25rem] lg:text-[6.6rem] xl:text-[7.7rem] 2xl:text-[8.5rem] font-bold tracking-[-0.05em] leading-[0.8] text-white flex flex-col uppercase select-none`}>
              <span className="transition-colors duration-300 hover:text-purple-800">CREATE</span>
              <span className="transition-colors duration-300 hover:text-purple-800">SHARE</span>
              <span className="transition-colors duration-300 hover:text-purple-800">INSPIRE</span>
            </h1>
          </div>

          {/* Bottom-right: Description + CTA Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-6 mt-auto lg:mt-0 max-w-[19rem] sm:max-w-md lg:max-w-sm lg:ml-auto lg:items-end lg:text-right pb-2 sm:pb-4 lg:pb-0">
            <p className={`${bodyFont.className} text-[15px] sm:text-[15px] text-gray-400 font-normal leading-relaxed transition-colors duration-300 hover:text-purple-300`}>
              The platform that turns your ideas into engaging content and helps you grow a thriving creator business.
            </p>

            <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-end lg:flex-nowrap pointer-events-auto">
              {/* Primary CTA (Purple Rectangle) */}
              <Button
                asChild
                className="bg-purple-800 hover:bg-purple-700 lg:bg-purple-600 lg:hover:bg-purple-700 text-white font-semibold px-6 py-4 lg:px-7 lg:py-6 rounded-3xl text-sm transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98] border-0 shadow-lg shadow-purple-950/40 cursor-pointer"
              >
                <Link href="/dashboard">Start Creating for Free</Link>
              </Button>

              {/* Secondary CTA (White Rectangle) */}
              <Button
                asChild
                className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-4 lg:px-7 lg:py-6 rounded-3xl text-sm transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98] border-0 shadow-md cursor-pointer"
              >
                <Link href="/feed">Explore the Feed</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
