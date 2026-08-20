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
            <button className="px-5 py-1.5 text-xs font-semibold rounded-full bg-purple-600 text-white shadow-lg shadow-purple-900/40 cursor-pointer">
              Overview
            </button>
            <button className="px-5 py-1.5 text-xs font-medium rounded-full bg-[#13111c] hover:bg-[#1c1829] text-zinc-400 hover:text-white border border-purple-500/10 transition-all cursor-pointer">
              Activity
            </button>
            <button className="px-5 py-1.5 text-xs font-medium rounded-full bg-[#13111c] hover:bg-[#1c1829] text-zinc-400 hover:text-white border border-purple-500/10 transition-all cursor-pointer">
              AI Assist
            </button>
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
          {/* Total Views Card */}
          <div className="relative overflow-hidden rounded-3xl bg-[#0d0b14] border border-purple-500/20 border-t-purple-400/30 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">
                Total Views
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181524] border border-purple-500/20 text-xs text-zinc-300">
                <span>30D</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>
            </div>
            <div className="mt-6 relative z-10">
              <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-1.5">
                <span className="text-purple-400 text-2xl font-semibold">
                  #
                </span>
                {stats.totalViews.toLocaleString()}
              </h2>
              <p className="text-xs text-zinc-500 mt-2">No growth update</p>
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
                {/* Views */}
                <div className="bg-[#14111f] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between">
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
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-6 w-6 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                      <Eye className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase">
                      Views
                    </span>
                  </div>
                </div>

                {/* Likes */}
                <div className="bg-[#14111f] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between">
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
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-6 w-6 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                      <Heart className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase">
                      Likes
                    </span>
                  </div>
                </div>

                {/* Comments */}
                <div className="bg-[#14111f] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between">
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
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-6 w-6 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                      <MessageCircle className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase">
                      Replies
                    </span>
                  </div>
                </div>

                {/* Followers */}
                <div className="bg-[#14111f] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between">
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
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-6 w-6 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                      <Users className="h-3 w-3 text-purple-400" />
                    </div>
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase">
                      Audience
                    </span>
                  </div>
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
