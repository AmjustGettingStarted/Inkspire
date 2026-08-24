"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Bell, PanelLeft } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const routeTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/create": "Create Post",
  "/dashboard/posts": "My Posts",
  "/dashboard/followers": "Followers",
  "/dashboard/settings": "Settings",
};

export function AppHeader({ isCollapsed, onMobileMenuToggle }) {
  const pathname = usePathname();
  const { user } = useUser();

  // Determine dynamic title based on path
  const currentTitle = routeTitles[pathname] || "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between rounded-2xl bg-black border border-white/10 px-3.5 md:px-4 mb-3 md:mb-4 shadow-md select-none">
      {/* Left: Dynamic Page Title & Mobile Trigger */}
      <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          type="button"
          aria-label="Open mobile menu"
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors shrink-0 cursor-pointer"
        >
          <PanelLeft className="h-4.5 w-4.5 stroke-[1.75]" />
        </button>

        <h1 className="text-base sm:text-lg font-semibold text-white tracking-wide truncate">
          {currentTitle}
        </h1>
      </div>

      {/* Right: Search, Notifications, Logo / User Toggle */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 w-60 text-sm text-zinc-400 gap-2 focus-within:border-white/30 transition-colors">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-zinc-500"
          />
        </div>

        {/* Bell Notification */}
        <button className="h-9 w-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer">
          <Bell className="h-4 w-4" />
        </button>

        {/* Dynamic Logo / User Profile Switcher */}
        {isCollapsed ? (
          /* Sidebar Collapsed -> Show User Profile */
          <div className="flex items-center gap-2.5 bg-zinc-900 rounded-xl p-1 pr-3 border border-white/10">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7 rounded-lg cursor-pointer",
                },
              }}
              afterSignOutUrl="/"
            />
            <span className="hidden sm:block text-xs font-medium text-zinc-200 truncate max-w-[120px]">
              {user?.firstName || user?.username || "Account"}
            </span>
          </div>
        ) : (
          /* Sidebar Expanded -> Show App Logo */
          <Link
            href="/feed"
            className="flex items-center gap-2 bg-zinc-900 rounded-xl px-3 py-1.5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={24}
              height={24}
              className="h-5 w-5 object-contain"
            />
            <span className="hidden sm:block text-xs font-semibold text-white tracking-wide">
              Inkspire
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
