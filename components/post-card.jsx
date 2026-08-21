"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PostCard = ({
  post,
  showActions = false,
  onEdit,
  onDelete,
  onDuplicate,
  className = "",
}) => {
  // Get status badge configuration
  const getStatusBadge = (post) => {
    if (post.status === "published") {
      if (post.scheduledFor && post.scheduledFor > Date.now()) {
        return {
          variant: "secondary",
          className:
            "bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px] px-2 py-0.5 backdrop-blur-md",
          label: "Scheduled",
        };
      }
      return {
        variant: "default",
        className:
          "bg-green-500/20 text-green-300 border-green-500/30 text-[10px] px-2 py-0.5 backdrop-blur-md",
        label: "Published",
      };
    }
    return {
      variant: "outline",
      className:
        "bg-orange-500/20 text-orange-300 border-orange-500/30 text-[10px] px-2 py-0.5 backdrop-blur-md",
      label: "Draft",
    };
  };

  // Get post URL for public viewing
  const getPostUrl = () => {
    if (
      post.status === "published" &&
      (post.author?.username || post?.username)
    ) {
      return `/${post.author?.username || post?.username}/${post._id}`;
    }
    return null;
  };

  const statusBadge = getStatusBadge(post);
  const publicUrl = getPostUrl();

  return (
    <Card
      className={`overflow-hidden border border-white/10 bg-[#09090b] hover:border-purple-500/50 transition-all duration-300 p-0 gap-0 ${className}`}
    >
      {/* Full-Bleed Image covering the entire top edge with NO gaps */}
      <div className="relative w-full h-48">
        <Link
          href={publicUrl || "#"}
          className={`block relative w-full h-full overflow-hidden ${!publicUrl ? "pointer-events-none" : ""}`}
          target="_blank"
        >
          <Image
            src={post.featuredImage || "/placeholder.png"}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Status Badge floating on top-left of the image */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <Badge
            variant={statusBadge.variant}
            className={statusBadge.className}
          >
            {statusBadge.label}
          </Badge>
        </div>

        {/* Actions Menu (...) floating on top-right of the image */}
        {showActions && (
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#09090b] border border-white/10 text-white"
              >
                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(post)}
                    className="cursor-pointer focus:bg-purple-600 focus:text-white text-xs"
                  >
                    <Edit className="h-3.5 w-3.5 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                )}
                {publicUrl && (
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-purple-600 focus:text-white text-xs"
                  >
                    <Link href={publicUrl} target="_blank">
                      <ExternalLink className="h-3.5 w-3.5 mr-2" />
                      View Public
                    </Link>
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem
                    onClick={() => onDuplicate(post)}
                    className="cursor-pointer focus:bg-purple-600 focus:text-white text-xs"
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => onDelete(post)}
                      className="text-red-400 focus:text-red-400 cursor-pointer text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        {/* Title and Scheduled Info */}
        <div className="space-y-0.5">
          <Link
            href={publicUrl || "#"}
            className={!publicUrl ? "pointer-events-none" : ""}
          >
            <h3 className="text-sm font-bold text-white hover:text-purple-300 transition-colors line-clamp-1">
              {post.title}
            </h3>
          </Link>
          {post.scheduledFor && post.scheduledFor > Date.now() && (
            <div className="flex items-center text-[10px] text-blue-400">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(post.scheduledFor).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Footer: Stats on the left, time on the right */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span className="text-[11px]">
                {post.viewCount?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span className="text-[11px]">
                {post.likeCount?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span className="text-[11px]">0</span>
            </div>
          </div>
          <time className="text-[10px]">
            {post.status === "published" && post.publishedAt
              ? formatDistanceToNow(new Date(post.publishedAt), {
                  addSuffix: true,
                })
              : formatDistanceToNow(new Date(post.updatedAt), {
                  addSuffix: true,
                })}
          </time>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
