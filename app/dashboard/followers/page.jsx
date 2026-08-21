"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, UserMinus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";
import { api } from "@/convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { toast } from "sonner";

const UserCard = ({
  user,
  isLoading = false,
  variant = "follower",
  onToggle,
}) => {
  // Filter out any Clerk domain images to trigger the initial-letter fallback
  const hasCustomImage =
    user.imageUrl && !user.imageUrl.includes("img.clerk.com");

  return (
    <div className="relative flex items-center justify-between p-4 overflow-hidden rounded-2xl bg-purple-950/20 border border-purple-500/20">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-3 z-10">
        <Link href={`/${user.username || ""}`}>
          <div className="relative w-11 h-11 cursor-pointer rounded-full overflow-hidden border border-white/10">
            {hasCustomImage ? (
              <Image
                src={user.imageUrl}
                alt={user.name || "User"}
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <div className="w-full h-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
        </Link>
        <Link href={user.username ? `/${user.username}` : ""}>
          <div className="cursor-pointer">
            <p className="font-medium text-white hover:text-purple-400 transition-colors">
              {user.name}
            </p>
            {user.username && (
              <p className="text-sm text-zinc-500">@{user.username}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Action Button */}
      <div className="z-10">
        {variant === "follower" ? (
          !user.followsBack && (
            <Button
              onClick={() => onToggle(user._id)}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-purple-600/50 text-purple-400 hover:bg-purple-600 hover:text-white hover:border-purple-600 cursor-pointer rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Follow Back
                </>
              )}
            </Button>
          )
        ) : (
          <Button
            onClick={() => onToggle(user._id)}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="h-auto p-0 !bg-transparent hover:!bg-transparent text-zinc-400 hover:text-red-400 shadow-none border-0 cursor-pointer transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Unfollow
                {/* <UserMinus className="h-4 w-4 mr-1.5" /> */}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Border Beam Animation */}
      <BorderBeam
        duration={8}
        size={80}
        colorFrom="#a855f7"
        colorTo="#ec4899"
      />
    </div>
  );
};
const FollowersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("followers");

  // Data fetching
  const { data: followers, isLoading: followersLoading } = useConvexQuery(
    api.follows.getMyFollowers,
    { limit: 100 },
  );

  const { data: following, isLoading: followingLoading } = useConvexQuery(
    api.follows.getMyFollowing,
    { limit: 100 },
  );

  // Mutations
  const { mutate: toggleFollow, isLoading: isToggling } = useConvexMutation(
    api.follows.toggleFollow,
  );

  // Handle follow/unfollow
  const handleFollowToggle = async (userId) => {
    try {
      await toggleFollow({ followingId: userId });
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  // Filter users based on search
  const filterUsers = (users) => {
    if (!searchQuery.trim()) return users || [];

    return (users || []).filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.username &&
          user.username.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  };

  const filteredFollowers = filterUsers(followers);
  const filteredFollowing = filterUsers(following);

  return (
    <div className="space-y-6">
      {/* Top Bar: Search on left, Animated custom tabs on right */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-10 bg-[#09090b] border-white/10 text-white h-10 rounded-xl"
          />
        </div>

        {/* Custom Pill Tabs */}
        <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-zinc-950/80 p-1 flex-shrink-0 self-start sm:self-auto">
          {[
            {
              key: "followers",
              label: `Followers (${filteredFollowers.length})`,
            },
            {
              key: "following",
              label: `Following (${filteredFollowing.length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer",
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
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content area based on active tab */}
      {activeTab === "followers" ? (
        <div className="space-y-3">
          {filteredFollowers.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              No followers found
            </div>
          ) : (
            filteredFollowers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                variant="follower"
                isLoading={isToggling}
                onToggle={handleFollowToggle}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFollowing.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              Not following anyone yet
            </div>
          ) : (
            filteredFollowing.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                variant="following"
                isLoading={isToggling}
                onToggle={handleFollowToggle}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FollowersPage;
