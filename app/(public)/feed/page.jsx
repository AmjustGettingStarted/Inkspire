"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Plus,
  Check,
  TrendingUp,
  Sparkles,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Strip HTML tags from rich-text content for a clean preview snippet
function toPlainText(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function Avatar({ src, alt, size = 40, online = false, className = "" }) {
  const isClerkImage = src?.includes("clerk.com");

  return (
    <div
      className={cn("relative flex-shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || "User"}
          fill
          className="rounded-full object-cover"
          sizes={`${size}px`}
          unoptimized={isClerkImage}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-900 text-sm font-bold text-white">
          {(alt || "U").charAt(0).toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-emerald-400" />
      )}
    </div>
  );
}

function PostCardPremium({ post, index }) {
  const reduceMotion = useReducedMotion();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const snippet = useMemo(
    () => toPlainText(post.content).slice(0, 220),
    [post.content],
  );
  const timestamp =
    post.status === "published" && post.publishedAt
      ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
      : formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true });

  const publicUrl =
    post.status === "published" && (post.author?.username || post?.username)
      ? `/${post.author?.username || post?.username}/${post._id}`
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0.15 : 0.4,
        delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#080808] p-5 shadow-xl transition-colors duration-200 hover:border-purple-500/30"
    >
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={post.author?.username ? `/${post.author.username}` : "#"}
          className="flex items-center gap-3 overflow-hidden"
        >
          <Avatar
            src={post.author?.imageUrl}
            alt={post.author?.name}
            size={42}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold text-white hover:text-purple-300">
                {post.author?.name || "Anonymous"}
              </span>
              {post.author?.username && (
                <span className="text-xs text-purple-400">♥</span>
              )}
            </div>
            <p className="truncate text-xs text-slate-400">
              {timestamp} {post.category ? `• ${post.category}` : ""}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-purple-500/40 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-600 hover:text-white"
          >
            Follow
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Post Title & Preview Text */}
      <Link
        href={publicUrl || "#"}
        className={cn("mt-4 block", !publicUrl && "pointer-events-none")}
      >
        <h3 className="text-lg font-extrabold leading-snug text-white transition-colors group-hover:text-purple-300 sm:text-xl">
          {post.title}
        </h3>
        {snippet && (
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            {snippet}
            {toPlainText(post.content).length > 220 ? "…" : ""}
          </p>
        )}
      </Link>

      {/* 3. Featured Image */}
      {post.featuredImage && (
        <Link
          href={publicUrl || "#"}
          className={cn("mt-4 block", !publicUrl && "pointer-events-none")}
        >
          <div className="relative h-60 w-full overflow-hidden rounded-[20px] bg-zinc-900 sm:h-72">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              sizes="100vw"
            />
          </div>
        </Link>
      )}

      {/* Read More Link */}
      {publicUrl && (
        <Link
          href={publicUrl}
          className="mt-3 inline-block text-xs font-semibold text-purple-400 transition-colors hover:text-purple-300"
        >
          Read full article →
        </Link>
      )}

      {/* 5. Footer Actions & Views */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1.5 transition-colors hover:text-purple-300"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount || 213}</span>
          </button>

          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              saved ? "text-purple-400" : "hover:text-purple-300",
            )}
          >
            <Bookmark className={cn("h-4 w-4", saved && "fill-purple-400")} />
            <span>{post.bookmarkCount || 467}</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 transition-colors hover:text-purple-300"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <span>👁</span>
          <span>{post.views || "2.5k"}</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function FeedPage() {
  const { user: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("feed");
  const reduceMotion = useReducedMotion();

  const { ref: loadMoreRef } = useInView({ threshold: 0, rootMargin: "100px" });

  const { data: feedData, isLoading: feedLoading } = useConvexQuery(
    api.feed.getFeed,
    { limit: 15 },
  );

  const { data: suggestedUsers, isLoading: suggestionsLoading } =
    useConvexQuery(api.feed.getSuggestedUsers, { limit: 8 });

  const { data: trendingPosts, isLoading: trendingLoading } = useConvexQuery(
    api.feed.getTrendingPosts,
    { limit: 15 },
  );

  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  const handleFollowToggle = async (userId) => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }
    try {
      await toggleFollow.mutate({ followingId: userId });
      toast.success("Follow status updated");
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  const currentPosts =
    activeTab === "trending" ? trendingPosts || [] : feedData?.posts || [];
  const isLoading =
    feedLoading || (activeTab === "trending" && trendingLoading);

  return (
    <div className="min-h-screen bg-black pb-16 pt-28 text-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Main Feed Column */}
          <div className="space-y-4 lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pb-2"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
                  Feed
                </span>
                <span className="h-px w-8 bg-white/12" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Discover Amazing{" "}
                <span className="text-purple-500">Content</span>
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Stay up to date with the latest posts from creators you follow.
              </p>
            </motion.div>

            {/* Control Bar — scrolls normally with the feed */}
            <div className="py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 sm:gap-3 rounded-[24px] border border-white/[0.08] bg-[#050505] p-2 sm:p-2.5">
                {currentUser && (
                  <Avatar
                    src={currentUser.imageUrl}
                    alt={currentUser.firstName}
                    size={36}
                  />
                )}

                <Link
                  href="/dashboard/create"
                  className="flex-1 min-w-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-xs sm:text-sm text-slate-500 transition-colors hover:border-white/[0.12] truncate"
                >
                  What's on your mind?...
                </Link>

                <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-zinc-950/80 p-1 flex-shrink-0">
                  {[
                    { key: "feed", label: "For You" },
                    { key: "trending", label: "Trending" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "relative flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        activeTab === tab.key
                          ? "text-white"
                          : "text-slate-400 hover:text-slate-200",
                      )}
                    >
                      {activeTab === tab.key && (
                        <motion.span
                          layoutId="feed-tab-pill-unified"
                          className="absolute inset-0 rounded-full bg-purple-600 shadow-[0_0_16px_-2px_rgba(168,85,247,0.6)]"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1">
                        {tab.key === "trending" && (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>

                <Link
                  href="/dashboard/create"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-white shadow-[0_0_16px_-2px_rgba(168,85,247,0.7)] transition-transform hover:scale-105"
                  aria-label="Create Post"
                >
                  <Plus className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Posts Stream */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-purple-500" />
                  <p className="text-sm text-slate-500">Loading posts...</p>
                </div>
              </div>
            ) : currentPosts.length === 0 ? (
              <div className="rounded-[28px] border border-white/[0.08] bg-[#050505] px-6 py-16 text-center">
                <div className="mb-4 text-5xl">📝</div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  {activeTab === "trending"
                    ? "No trending posts right now"
                    : "No posts to show"}
                </h3>
                <p className="text-sm text-slate-500">
                  {activeTab === "trending"
                    ? "Check back later for trending content"
                    : "Follow some creators to see their posts here"}
                </p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} className="space-y-5 pt-2">
                    {currentPosts.map((post, index) => (
                      <PostCardPremium
                        key={post._id}
                        post={post}
                        index={index}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {activeTab === "feed" && feedData?.hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar Column — sticky is on the grid item itself for reliability */}
          <aside
            className="hidden lg:block lg:col-span-3 sticky top-28 space-y-6 self-start rounded-[28px] border border-white/[0.08] bg-[#050505] p-4 sm:p-5"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Suggested for you
              </h3>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>

            {suggestionsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              </div>
            ) : !suggestedUsers || suggestedUsers.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">
                No suggestions available
              </p>
            ) : (
              <div className="space-y-1">
                {suggestedUsers.map((user, i) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="group flex items-center justify-between gap-2 rounded-2xl p-2 transition-colors hover:bg-white/[0.03]"
                  >
                    <Link
                      href={user.username ? `/${user.username}` : "#"}
                      className="flex flex-1 items-center gap-3 overflow-hidden"
                    >
                      <Avatar
                        src={user.imageUrl}
                        alt={user.name}
                        size={38}
                        online={i < 2}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {user.name || user.username || "Creator"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {user.followerCount ?? 0} followers
                        </p>
                      </div>
                    </Link>

                    {/* Follow Toggle Button with Followed State Support */}
                    <button
                      onClick={() => handleFollowToggle(user._id)}
                      aria-label={`Follow ${user.name || user.username}`}
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all",
                        user.isFollowed
                          ? "border-purple-500 bg-purple-600 text-white"
                          : "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500 hover:text-white",
                      )}
                    >
                      {user.isFollowed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            <Button variant="ghost" className="mt-3 cursor-pointer flex w-full items-center justify-center gap-1 rounded-full py-2 text-xs font-semibold text-purple-400 transition-colors hover:text-purple-300" disabled>
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
