"use client";

import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import PostEditor from "@/components/post-editor";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreatePostPage() {
  // Get existing draft
  const { data: existingDraft, isLoading: isDraftLoading } = useConvexQuery(
    api.posts.getUserDraft,
  );

  const { data: currentUser, isLoading: userLoading } = useConvexQuery(
    api.users.getCurrentUser,
  );

  if (isDraftLoading || userLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          <span className="text-zinc-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser?.username) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">Username Required</h1>
          <p className="text-zinc-500 text-lg">
            Set up a username to create and share your posts
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/settings">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white">
                Set Up Username
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PostEditor initialData={existingDraft} mode="create" />;
}
