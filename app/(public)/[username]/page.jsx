"use client";

import React from "react";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import PostCard from "@/components/post-card";
import PublicHeader from "./_components/public-header";

export default function ProfilePage({ params }) {
  const { username } = React.use(params);
  const { user: currentUser } = useUser();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useConvexQuery(api.users.getByUsername, { username });

  const { data: postsData, isLoading: postsLoading } = useConvexQuery(
    api.public.getPublishedPostsByUsername,
    {
      username,
      limit: 20,
    },
  );

  const { data: followerCount } = useConvexQuery(
    api.follows.getFollowerCount,
    user ? { userId: user._id } : "skip",
  );

  const { data: isFollowing } = useConvexQuery(
    api.follows.isFollowing,
    currentUser && user ? { followingId: user._id } : "skip",
  );

  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  if (userLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    notFound();
  }

  const posts = postsData?.posts || [];
  const isOwnProfile =
    currentUser && currentUser.publicMetadata?.username === user.username;

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }

    try {
      await toggleFollow.mutate({ followingId: user._id });
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Integrated Banner Header */}
      <PublicHeader
        link="/"
        title="Back to Home"
        user={user}
        isFollowing={isFollowing}
        isOwnProfile={isOwnProfile}
        onToggleFollow={handleFollowToggle}
        isLoading={toggleFollow.isLoading}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* User Info & Stats Block */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            {user.name}
          </h1>
          <p className="text-slate-400 text-sm mb-8">@{user.username}</p>

          {/* Clean Stats Breakdown (Dividers Removed) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-2">
            <div>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase mb-1">
                Posts
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">
                {posts.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase mb-1">
                Followers
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">
                {followerCount || 0}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase mb-1">
                Total Views
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">
                {posts
                  .reduce((acc, post) => acc + post.viewCount, 0)
                  .toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium tracking-wider uppercase mb-1">
                Total Likes
              </div>
              <div className="text-2xl font-semibold text-white tracking-tight">
                {posts
                  .reduce((acc, post) => acc + post.likeCount, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center text-xs text-slate-500 mt-6">
            <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-80" />
            Joined{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Recent Posts
          </h2>

          {posts.length === 0 ? (
            <Card className="bg-slate-950/40 border border-slate-900 rounded-2xl">
              <CardContent className="text-center py-12">
                <p className="text-slate-400 text-lg">No posts yet</p>
                <p className="text-slate-500 text-sm mt-2">
                  Check back later for new content!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  showActions={false}
                  showAuthor={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
