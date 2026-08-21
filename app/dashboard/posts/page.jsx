"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, Filter, FileText } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { toast } from "sonner";
import Link from "next/link";
import PostCard from "@/components/post-card";

export default function PostsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Data fetching
  const { data: posts, isLoading } = useConvexQuery(api.posts.getUserPosts);
  const deletePost = useConvexMutation(api.posts.deletePost);

  // Filter and sort posts
  const filteredPosts = React.useMemo(() => {
    if (!posts) return [];

    let filtered = posts.filter((post) => {
      // Search filter
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "mostViews":
          return b.viewCount - a.viewCount;
        case "mostLikes":
          return b.likeCount - a.likeCount;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return filtered;
  }, [posts, searchQuery, statusFilter, sortBy]);

  // Handle post actions
  const handleEditPost = (post) => {
    router.push(`/dashboard/posts/edit/${post._id}`);
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePost.mutate({ id: post._id });
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleDuplicatePost = (post) => {
    toast.info("Duplication feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-zinc-500 mt-4">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Filters, and Create Button in one unified row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#09090b] border-white/10 text-white h-10 rounded-xl"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-[#09090b] border-white/10 text-white h-10 rounded-xl cursor-pointer">
              <Filter className="h-4 w-4 mr-2 text-zinc-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#09090b] border border-white/10 text-white rounded-xl">
              <SelectItem value="all" className="cursor-pointer">
                All Status
              </SelectItem>
              <SelectItem value="published" className="cursor-pointer">
                Published
              </SelectItem>
              <SelectItem value="draft" className="cursor-pointer">
                Draft
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40 bg-[#09090b] border-white/10 text-white h-10 rounded-xl cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#09090b] border border-white/10 text-white rounded-xl">
              <SelectItem value="newest" className="cursor-pointer">
                Newest First
              </SelectItem>
              <SelectItem value="oldest" className="cursor-pointer">
                Oldest First
              </SelectItem>
              <SelectItem value="mostViews" className="cursor-pointer">
                Most Views
              </SelectItem>
              <SelectItem value="mostLikes" className="cursor-pointer">
                Most Likes
              </SelectItem>
              <SelectItem value="alphabetical" className="cursor-pointer">
                A-Z
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create New Post Button */}
        <Link href="/dashboard/create" className="flex-shrink-0">
          <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white h-10 px-4 rounded-xl shadow-lg cursor-pointer">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Posts Grid or Empty State */}
      {filteredPosts.length === 0 ? (
        <div className="max-w-xl mx-auto px-4 flex flex-col justify-center items-center min-h-[50vh] text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              {searchQuery || statusFilter !== "all"
                ? "No posts found"
                : "No posts yet"}
            </h3>
            <p className="text-sm text-zinc-400">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first post to get started"}
            </p>
          </div>

          {!searchQuery && statusFilter === "all" && (
            <div>
              <Link href="/dashboard/create">
                <Button className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/20 cursor-pointer">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              showActions={true}
              showAuthor={false}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onDuplicate={handleDuplicatePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}
