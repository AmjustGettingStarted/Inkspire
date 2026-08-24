"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  PlusCircle,
  Users,
  Settings,
  PanelLeft,
  LayoutDashboard,
  Podcast,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Create Post", href: "/dashboard/create", icon: PlusCircle },
  { title: "My Posts", href: "/dashboard/posts", icon: Podcast },
  { title: "Followers", href: "/dashboard/followers", icon: Users },
];

export function AppSidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen = false,
  setMobileOpen = () => {},
}) {
  const pathname = usePathname();
  const { user } = useUser();

  // Active Button Style Helper Component
  const ActiveGlow = () => (
    <>
      {/* Right-to-left subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-purple-500/25 via-purple-500/5 to-transparent pointer-events-none" />

      {/* Purple vertical indicator pill */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full bg-purple-500 shadow-[0_0_12px_#a855f7] pointer-events-none" />
    </>
  );

  return (
    <>
      {/* --- MOBILE DRAWER (Sheet) --- */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-72 bg-black/95 border-r border-white/10 p-5 text-white flex flex-col justify-between backdrop-blur-xl md:hidden select-none"
        >
          <SheetHeader className="p-0 text-left border-b border-white/10 pb-4">
            <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu for dashboard
            </SheetDescription>
            <div className="flex items-center gap-3 min-w-0 pr-6">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 rounded-full border border-purple-500/40 cursor-pointer",
                  },
                }}
                afterSignOutUrl="/"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate text-white">
                  {user?.firstName || user?.username || "Account"}
                </span>
                <span className="text-[11px] text-zinc-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress || "creator@app.com"}
                </span>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation Section */}
          <nav className="flex flex-col gap-1.5 flex-1 py-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all duration-200 cursor-pointer overflow-hidden border border-transparent",
                    isActive
                      ? "bg-zinc-900/90 border-white/10 text-white font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  {isActive && <ActiveGlow />}
                  <div className="relative z-10 flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-4.5 w-4.5 shrink-0 stroke-[1.75]",
                        isActive ? "text-white" : "text-zinc-400",
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer Settings */}
          <div className="pt-3 border-t border-white/10">
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer overflow-hidden border border-transparent",
                pathname === "/dashboard/settings"
                  ? "bg-zinc-900/90 border-white/10 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/5",
              )}
            >
              {pathname === "/dashboard/settings" && <ActiveGlow />}
              <div className="relative z-10 flex items-center gap-3">
                <Settings
                  className={cn(
                    "h-4.5 w-4.5 stroke-[1.75]",
                    pathname === "/dashboard/settings"
                      ? "text-white"
                      : "text-zinc-400",
                  )}
                />
                <span>Settings</span>
              </div>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* --- DESKTOP SIDEBAR VIEW --- */}
      {isCollapsed ? (
        /* Shrunk Sidebar View */
        <aside className="hidden md:flex h-full shrink-0 flex-col items-center justify-between bg-black border border-white/10 rounded-[2.5rem] py-4 px-2.5 shadow-2xl transition-all duration-300 w-16 select-none cursor-pointer">
          {/* Top Brand Logo */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/feed"
              className="flex h-10 w-10 items-center justify-center p-1 cursor-pointer"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </Link>

            <div className="h-[1px] w-6 bg-white/10 my-1" />

            {/* Navigation Icons */}
            <nav className="flex flex-col gap-2.5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    title={item.title}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden",
                      isActive
                        ? "bg-zinc-900 border border-white/10 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-white/10",
                    )}
                  >
                    {isActive && <ActiveGlow />}
                    <item.icon className="relative z-10 h-4.5 w-4.5 shrink-0 stroke-[1.75]" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions inside the same capsule */}
          <div className="flex flex-col items-center gap-3 pt-3 border-t border-white/10 w-full">
            <Link
              href="/dashboard/settings"
              title="Settings"
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all cursor-pointer overflow-hidden",
                pathname === "/dashboard/settings"
                  ? "bg-zinc-900 border border-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/10",
              )}
            >
              {pathname === "/dashboard/settings" && <ActiveGlow />}
              <Settings className="relative z-10 h-4.5 w-4.5 stroke-[1.75]" />
            </Link>

            {/* Expand Toggle Button at Bottom */}
            <button
              onClick={() => setIsCollapsed(false)}
              title="Expand Sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <PanelLeft className="h-4.5 w-4.5 stroke-[1.75]" />
            </button>
          </div>
        </aside>
      ) : (
        /* Expanded Sidebar View */
        <aside className="hidden md:flex h-full shrink-0 flex-col justify-between rounded-[2.5rem] bg-black border border-white/10 p-5 text-white shadow-2xl transition-all duration-300 w-64 select-none cursor-pointer">
          <div className="flex flex-col gap-6">
            {/* Header: User Profile + Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-9 h-9 rounded-full border border-purple-500/40 cursor-pointer",
                    },
                  }}
                  afterSignOutUrl="/"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate text-white">
                    {user?.firstName || user?.username || "Account"}
                  </span>
                  <span className="text-[11px] text-zinc-400 truncate">
                    {user?.primaryEmailAddress?.emailAddress || "creator@app.com"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCollapsed(true)}
                title="Collapse Sidebar"
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <PanelLeft className="h-4.5 w-4.5 stroke-[1.75]" />
              </button>
            </div>

            {/* Navigation Section */}
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all duration-200 cursor-pointer overflow-hidden border border-transparent",
                      isActive
                        ? "bg-zinc-900/90 border-white/10 text-white font-medium"
                        : "text-zinc-400 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {isActive && <ActiveGlow />}
                    <div className="relative z-10 flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-4.5 w-4.5 shrink-0 stroke-[1.75]",
                          isActive ? "text-white" : "text-zinc-400",
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Settings */}
          <div className="pt-3 border-t border-white/10">
            <Link
              href="/dashboard/settings"
              className={cn(
                "relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer overflow-hidden border border-transparent",
                pathname === "/dashboard/settings"
                  ? "bg-zinc-900/90 border-white/10 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/5",
              )}
            >
              {pathname === "/dashboard/settings" && <ActiveGlow />}
              <div className="relative z-10 flex items-center gap-3">
                <Settings
                  className={cn(
                    "h-4.5 w-4.5 stroke-[1.75]",
                    pathname === "/dashboard/settings"
                      ? "text-white"
                      : "text-zinc-400",
                  )}
                />
                <span>Settings</span>
              </div>
            </Link>
          </div>
        </aside>
      )}
    </>
  );
}
