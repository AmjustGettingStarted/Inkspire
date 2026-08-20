"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { AppHeader } from "@/components/dashboard/app-header";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#0d0b14] text-white p-3 gap-3 overflow-hidden select-none">
      {/* Custom Collapsible Sidebar */}
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        {/* Integrated Header Wrapper with Subtle Bottom Purple Border Highlight */}
        <div className="relative px-6 py-2">
          {/* Subtle Glow Behind the Header Border */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-purple-500/40 blur-sm pointer-events-none" />

          <AppHeader isCollapsed={isCollapsed} />
        </div>

        {/* Dynamic Page Content Area */}
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
