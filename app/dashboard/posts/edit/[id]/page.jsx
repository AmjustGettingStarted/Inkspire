"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import PostEditor from "@/components/post-editor";

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id;

  // Get post data
  const {
    data: post,
    isLoading,
    error,
  } = useConvexQuery(api.posts.getById, { id: postId });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          <span className="text-zinc-400">Loading post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <p className="text-zinc-500">
            The post you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <PostEditor initialData={post} mode="edit" />;
}
