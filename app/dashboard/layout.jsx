"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { AppHeader } from "@/components/dashboard/app-header";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#0d0b14] text-white p-0 md:p-3 md:gap-3 overflow-hidden select-none">
      {/* Custom Collapsible Sidebar (Desktop + Mobile Drawer) */}
      <AppSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        {/* Integrated Header Wrapper with Subtle Bottom Purple Border Highlight */}
        <div className="relative px-3 pt-3 pb-1 md:px-6 md:py-2">
          {/* Subtle Glow Behind the Header Border */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-purple-500/40 blur-sm pointer-events-none" />

          <AppHeader
            isCollapsed={isCollapsed}
            onMobileMenuToggle={() => setMobileOpen(true)}
          />
        </div>

        {/* Dynamic Page Content Area */}
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

