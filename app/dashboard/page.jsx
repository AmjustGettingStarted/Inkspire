"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Eye,
  Heart,
  MessageCircle,
  Users,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import DailyViewsChart from "@/components/daily-views-chart";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("most-viewed");
  const [activePeriod, setActivePeriod] = useState("1M");

  const dailyViewsData = useQuery(api.dashboard.getDailyViews, {
    timeframe: activePeriod,
  });

  const chartLoading = dailyViewsData === undefined;

  const { data: analytics, isLoading: analyticsLoading } = useConvexQuery(
    api.dashboard.getAnalytics,
  );
  const { data: recentPosts, isLoading: postsLoading } = useConvexQuery(
    api.dashboard.getPostsWithAnalytics,
    { limit: 4 },
  );

  if (analyticsLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
          <p className="text-zinc-400 text-sm mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = analytics || {
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalFollowers: 0,
    viewsGrowth: 0,
    likesGrowth: 0,
    commentsGrowth: 0,
    followersGrowth: 0,
  };

  const firstName = user?.firstName || "Creator";

  return (
    <div className="space-y-6">
      {/* Shared SVG Defs for Card Vector Overlays */}
      <svg className="hidden">
        <defs>
          <linearGradient id="cardPurpleGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome, <span className="text-purple-400">{firstName}</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Here's your content performance overview
          </p>

          <div className="flex gap-2 mt-4">
            <Button className="px-5 py-1.5 text-xs font-semibold rounded-full bg-purple-600 text-white shadow-lg shadow-purple-900/40 hover:bg-purple-600">
              Overview
            </Button>
            <Button
              disabled
              className="px-5 py-1.5 text-xs  font-medium rounded-full bg-[#13111c] hover:bg-[#1c1829] text-zinc-400 hover:text-white border border-purple-500/10 transition-all cursor-pointer"
            >
              Activity
            </Button>
            <Button
              disabled
              className="px-5 py-1.5 text-xs font-medium rounded-full bg-[#13111c] hover:bg-[#1c1829] text-zinc-400 hover:text-white border border-purple-500/10 transition-all cursor-pointer"
            >
              AI Assist
            </Button>
          </div>
        </div>

        <Link href="/dashboard/create">
          <button className="px-5 py-2.5 rounded-full text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer">
            <PlusCircle className="h-4 w-4" />
            Create New Post
          </button>
        </Link>
      </div>

      {/* Grid Layout (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: Total Views + AI Feature Card */}
        <div className="lg:col-span-4 space-y-5">
          {/* Total Views Card - Clean Horizontal Layout */}
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0812] border border-purple-500/25 border-t-purple-400/40 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-between min-h-[160px]">
            {/* Left Column: Title & Breakdown Metrics */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="text-purple-300 text-xs font-bold tracking-widest uppercase block">
                  Total Views
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Overall Performance
                </p>
              </div>

              {/* Breakdown Sub-metrics */}
              <div className="space-y-1.5 pt-1 border-t border-purple-500/15">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-zinc-400 text-[11px] font-medium">
                    Views Growth
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    ▲ +{stats.viewsGrowth || 0}%
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-zinc-400 text-[11px] font-medium">
                    Engagement
                  </span>
                  <span className="text-purple-300 font-bold text-[11px]">
                    {stats.totalViews > 0
                      ? `${(((stats.totalLikes + stats.totalComments) / stats.totalViews) * 100).toFixed(1)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Ring with Centered Total Number */}
            <div className="relative z-10 flex items-center justify-center shrink-0 ml-4">
              <svg className="w-32 h-32 -rotate-90 filter drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                {/* Dark Maroon/Purple Segment (~30% Arc) */}
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#3b0764"
                  strokeWidth="9"
                  strokeDasharray="314"
                  strokeDashoffset="0"
                  fill="transparent"
                />
                {/* Vibrant Glowing Purple Arc (~70% Arc) */}
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#c084fc"
                  strokeWidth="9"
                  strokeDasharray="314"
                  strokeDashoffset="94"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Centered Total Count */}
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Total
                </span>
                <span className="text-xl font-extrabold text-white tracking-tight leading-none mt-0.5">
                  {stats.totalViews.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* AI Feature Card */}
          <div className="relative overflow-hidden rounded-3xl bg-[#0d0b14] border border-purple-500/25 border-t-purple-400/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-24 bg-purple-600/20 blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-purple-400 fill-purple-400" />
                Decisions Powered by Data
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mt-3">
                Move beyond guesswork with AI-driven content generation and
                audience insights tailored to your strategy.
              </p>
            </div>

            <div className="mt-8 relative z-10">
              <Link href="/dashboard/create">
                <button className="w-full py-2.5 rounded-full bg-[#1a1429] hover:bg-[#231b38] text-purple-200 text-xs font-semibold border border-purple-500/30 transition-all cursor-pointer">
                  Explore AI Insights
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Column 2: Watchlist Card */}
        <div className="lg:col-span-4">
          <div className="relative overflow-hidden rounded-3xl bg-[#0d0b14] border border-purple-500/20 border-t-purple-400/30 p-6 h-full flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-16 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white text-sm font-semibold tracking-wide">
                  Watchlist
                </span>
                <div className="flex bg-[#181524] p-1 rounded-full border border-purple-500/20 text-[10px]">
                  <button
                    onClick={() => setActiveTab("most-viewed")}
                    className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                      activeTab === "most-viewed"
                        ? "bg-purple-600 text-white shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Top Posts
                  </button>
                  <button
                    onClick={() => setActiveTab("gain")}
                    className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                      activeTab === "gain"
                        ? "bg-purple-600 text-white shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Gain
                  </button>
                </div>
              </div>

              {/* Watchlist Post List */}
              <div className="space-y-3 mt-4">
                {!recentPosts || recentPosts.length === 0 ? (
                  <div className="text-center py-16 text-xs text-zinc-500 font-medium">
                    No posts published yet
                  </div>
                ) : (
                  recentPosts.map((post) => (
                    <div
                      key={post._id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#14111f] hover:bg-[#1a1729] transition-all cursor-pointer border border-purple-500/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-[10px] font-bold text-purple-300">
                          {post.title?.substring(0, 2).toUpperCase() || "IP"}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                            {post.title || "Untitled Post"}
                          </p>
                          <p className="text-[10px] text-zinc-500 uppercase">
                            {post.status}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white">
                        {post.viewCount || 0}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: My Portfolio 2x2 Grid */}
        <div className="lg:col-span-4">
          <div className="relative overflow-hidden rounded-3xl bg-[#0d0b14] border border-purple-500/20 border-t-purple-400/30 p-6 h-full flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-16 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white text-sm font-semibold tracking-wide">
                  My Portfolio
                </span>
                <Link
                  href="/dashboard/posts"
                  className="flex items-center gap-1 text-zinc-400 hover:text-white transition-all text-xs"
                >
                  <span>See all</span>
                  <div className="h-5 w-5 rounded-full bg-[#181524] border border-purple-500/20 flex items-center justify-center">
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </Link>
              </div>

              {/* 2x2 Inner Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Views Card */}
                <div className="relative overflow-hidden bg-[#14111f] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between h-32">
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block">
                        Views
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">
                        {stats.totalViews >= 1000
                          ? `${(stats.totalViews / 1000).toFixed(1)}k`
                          : stats.totalViews}
                      </h4>
                      <span className="text-[10px] font-medium text-emerald-400 block mt-0.5">
                        +{stats.viewsGrowth || 0}%
                      </span>
                    </div>

                    {/* Moved & Styled Icon Container to Top-Right */}
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-900/40 border border-purple-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.35)]">
                      <Eye className="h-4 w-4 text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                    </div>
                  </div>

                  <div className="relative z-10 text-right">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                      Views
                    </span>
                  </div>

                  {/* SVG Wave Overlay */}
                  <svg
                    className="absolute bottom-0 right-0 w-full h-16 pointer-events-none opacity-25"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 30 Q 25 10, 50 25 T 100 5 V 40 H 0 Z"
                      fill="url(#cardPurpleGlow)"
                    />
                    <path
                      d="M0 30 Q 25 10, 50 25 T 100 5"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Likes Card */}
                <div className="relative overflow-hidden bg-[#14111f] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between h-32">
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block">
                        Likes
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">
                        {stats.totalLikes >= 1000
                          ? `${(stats.totalLikes / 1000).toFixed(1)}k`
                          : stats.totalLikes}
                      </h4>
                      <span className="text-[10px] font-medium text-emerald-400 block mt-0.5">
                        +{stats.likesGrowth || 0}%
                      </span>
                    </div>

                    {/* Moved & Styled Icon Container to Top-Right */}
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-900/40 border border-purple-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.35)]">
                      <Heart className="h-4 w-4 text-purple-300 fill-purple-400/40 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                    </div>
                  </div>

                  <div className="relative z-10 text-right">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                      Likes
                    </span>
                  </div>

                  {/* Mini Bar Chart Overlay */}
                  <div className="absolute bottom-2 right-3 flex items-end gap-1 opacity-20 pointer-events-none">
                    <div className="w-1.5 h-3 bg-purple-500 rounded-t" />
                    <div className="w-1.5 h-6 bg-purple-400 rounded-t" />
                    <div className="w-1.5 h-2 bg-purple-500 rounded-t" />
                    <div className="w-1.5 h-8 bg-purple-300 rounded-t" />
                    <div className="w-1.5 h-5 bg-purple-500 rounded-t" />
                  </div>
                </div>

                {/* Comments Card */}
                <div className="relative overflow-hidden bg-[#14111f] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between h-32">
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block">
                        Comments
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">
                        {stats.totalComments >= 1000
                          ? `${(stats.totalComments / 1000).toFixed(1)}k`
                          : stats.totalComments}
                      </h4>
                      <span className="text-[10px] font-medium text-emerald-400 block mt-0.5">
                        +{stats.commentsGrowth || 0}%
                      </span>
                    </div>

                    {/* Moved & Styled Icon Container to Top-Right */}
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-900/40 border border-purple-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.35)]">
                      <MessageCircle className="h-4 w-4 text-purple-300 fill-purple-400/20 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                    </div>
                  </div>

                  <div className="relative z-10 text-right">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                      Replies
                    </span>
                  </div>

                  {/* Secondary SVG Wave Overlay */}
                  <svg
                    className="absolute bottom-0 right-0 w-full h-14 pointer-events-none opacity-25"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 35 Q 30 35, 50 15 T 100 20 V 40 H 0 Z"
                      fill="url(#cardPurpleGlow)"
                    />
                    <path
                      d="M0 35 Q 30 35, 50 15 T 100 20"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Followers Card */}
                <div className="relative overflow-hidden bg-[#14111f] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between h-32">
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block">
                        Followers
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">
                        {stats.totalFollowers >= 1000
                          ? `${(stats.totalFollowers / 1000).toFixed(1)}k`
                          : stats.totalFollowers}
                      </h4>
                      <span className="text-[10px] font-medium text-emerald-400 block mt-0.5">
                        +{stats.followersGrowth || 0}%
                      </span>
                    </div>

                    {/* Moved & Styled Icon Container to Top-Right */}
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-900/40 border border-purple-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.35)]">
                      <Users className="h-4 w-4 text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                    </div>
                  </div>

                  <div className="relative z-10 text-right">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                      Audience
                    </span>
                  </div>

                  {/* Progress Ring Background Accent */}
                  <svg
                    className="absolute -bottom-2 -right-2 w-16 h-16 opacity-15 pointer-events-none"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-purple-900"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-400"
                      strokeDasharray="60, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Performance Chart Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0d0b14] border border-purple-500/20 border-t-purple-400/30 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-16 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
          <div>
            <h3 className="text-white text-base font-semibold">
              Portfolio Performance
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Views timeline analytics
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#181524] border border-purple-500/20 rounded-full p-1">
            {["1D", "1W", "1M", "6M", "1Y"].map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activePeriod === period
                    ? "bg-purple-600 text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 relative z-10">
          <DailyViewsChart data={dailyViewsData} isLoading={chartLoading} />
        </div>
      </div>
    </div>
  );
}
