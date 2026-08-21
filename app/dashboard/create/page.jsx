"use client";

import React from "react";
import { ArrowRight, Loader2, UserCheck } from "lucide-react";
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
      <div className="max-w-xl mx-auto md:-mt-12 flex flex-col h-full justify-center items-center px-4 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Username Required
          </h1>
          <p className="text-sm text-zinc-400">
            You need to set up a unique username before you can start creating
            and publishing your posts.
          </p>
        </div>

        <div>
          <Link href="/dashboard/settings">
            <Button className="bg-purple-600 group hover:bg-purple-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/20 cursor-pointer">
              <span>Set Up Username</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <PostEditor initialData={existingDraft} mode="create" />;
}
