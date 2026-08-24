"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useStoreUser } from "@/hooks/use-store-user";
import { BarLoader } from "react-spinners";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import { BorderBeam } from "./ui/border-beam"; // 1. Import BorderBeam

export default function Header() {
  const { isLoading, isAuthenticated } = useStoreUser();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && path === "/") {
      router.push("/feed");
    }
  }, [isLoading, isAuthenticated, path, router]);

  if (path.includes("/dashboard")) {
    return null;
  }

  if (path !== "/" && path !== "/feed" && path.split("/").length >= 2) {
    return null;
  }

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      {/* 2. Added relative and overflow-hidden to the header container */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-black/60 border border-white/10 rounded-full px-5 sm:px-7 py-3 flex items-center justify-between gap-4 shadow-2xl">
        {/* 3. Border Beam component added here */}
        <BorderBeam
          size={120}
          duration={8}
          colorFrom="#a855f7"
          colorTo="#ec4899"
        />

        {/* Logo */}
        <Link
          href={isAuthenticated ? "/feed" : "/"}
          className="flex-shrink-0 z-10"
        >
          <Image
            src="/logo.png"
            alt="InkSpire Logo"
            width={96}
            height={48}
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>

        {/* Navigation */}
        {path === "/" && (
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center text-sm font-medium z-10">
            <Link
              href="#features"
              className="text-gray-300 transition-colors duration-300 hover:text-white cursor-pointer"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-300 transition-colors duration-300 hover:text-white cursor-pointer"
            >
              Testimonials
            </Link>
          </div>
        )}

        {/* Auth Actions */}
        <div className="flex items-center gap-3 flex-shrink-0 z-10">
          <Authenticated>
            {path === "/feed" && (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="relative group cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-black/80 rounded-full border border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] hover:border-purple-400 hover:bg-purple-950/30 transition-all duration-300"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="inline">Dashboard</span>
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-lg border border-white/20",
                  userButtonPopoverCard:
                    "shadow-xl backdrop-blur-md bg-slate-900/90 border border-white/20",
                  userPreviewMainIdentifier: "font-semibold text-white",
                },
              }}
              signOutUrl="/"
            />
          </Authenticated>

          <Unauthenticated>
            <SignInButton>
              <Button
                size="sm"
                className="bg-transparent hover:bg-transparent text-gray-300 hover:text-purple-300 hover:[text-shadow:0_0_12px_rgba(168,85,247,0.8)] cursor-pointer text-sm font-medium transition-all duration-300 shadow-none border-0"
              >
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button
                size="lg"
                className="relative group cursor-pointer inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-black/80 rounded-full border border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] hover:border-purple-400 hover:bg-purple-950/30 transition-all duration-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <span>Get Started</span>
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>

        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
            <BarLoader
              width={"95%"}
              height={2} /* Reduced thickness (default is 4) */
              color="#a855f7" /* Matches the purple BorderBeam color */
            />
          </div>
        )}
      </div>
    </header>
  );
}
