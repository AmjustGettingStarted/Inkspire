"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Plus,
  Minus,
  ArrowLeft,
  Settings,
  Save,
  Send,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { generateBlogContent, improveContent } from "@/app/actions/gemini";
import { BarLoader } from "react-spinners";
import { motion, useReducedMotion } from "framer-motion";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-[#050508] border border-white/5 rounded-2xl animate-pulse flex items-center justify-center text-zinc-600 text-xs">
      Loading editor...
    </div>
  ),
});

if (typeof window !== "undefined") {
  import("react-quill-new/dist/quill.snow.css");
}

const quillConfig = {
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["image", "video"],
      ],
      handlers: { image: function () {} },
    },
  },
  formats: [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "link",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "image",
    "video",
  ],
};

export default function PostEditorContent({
  form,
  setQuillRef,
  onImageUpload,
  onSave,
  onPublish,
  onSettingsOpen,
  onBack,
  isPending,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const reduceMotion = useReducedMotion();

  if (!form) return null;

  const {
    register = () => ({}),
    watch = () => ({}),
    setValue = () => {},
    formState: { errors = {} } = {},
  } = form;

  const watchedValues = watch() || {};

  const getQuillModules = () => ({
    ...quillConfig.modules,
    toolbar: {
      ...quillConfig.modules.toolbar,
      handlers: { image: () => onImageUpload && onImageUpload("content") },
    },
  });

  const handleAI = async (type, improvementType = null) => {
    const { title, content, category, tags } = watchedValues;

    if (type === "generate") {
      if (!title?.trim())
        return toast.error("Please add a title before generating content");
      if (
        content &&
        content !== "<p><br></p>" &&
        !window.confirm("This will replace your existing content. Continue?")
      )
        return;
      setIsGenerating(true);
    } else {
      if (!content || content === "<p><br></p>")
        return toast.error("Please add some content before improving it");
      setIsImproving(true);
    }

    try {
      const result =
        type === "generate"
          ? await generateBlogContent(title, category, tags || [])
          : await improveContent(content, improvementType);

      if (result?.success) {
        setValue("content", result.content);
        toast.success(
          `Content ${
            type === "generate" ? "generated" : improvementType + "d"
          } successfully!`,
        );
      } else {
        toast.error(result?.error || "Failed to process AI action");
      }
    } catch (error) {
      toast.error(`Failed to ${type} content. Please try again.`);
    } finally {
      type === "generate" ? setIsGenerating(false) : setIsImproving(false);
    }
  };

  const hasTitle = Boolean(watchedValues.title?.trim());
  const hasContent =
    Boolean(watchedValues.content) && watchedValues.content !== "<p><br></p>";

  return (
    <div className="w-full max-w-5xl mx-auto pt-0 pb-6 px-0 sm:px-2">
      <div className="rounded-3xl bg-[#030305] border border-white/10 p-5 sm:p-8 shadow-2xl space-y-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onSettingsOpen}
              className="rounded-xl border cursor-pointer border-white/10 bg-black/60 text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              disabled={isPending}
              onClick={onSave}
              className="rounded-xl border cursor-pointer border-white/10 bg-black/60 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 gap-2 px-4 py-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </Button>

            <Button
              type="button"
              disabled={isPending}
              onClick={onPublish}
              className="rounded-xl border cursor-pointer border-white/10 bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white gap-2 px-5 py-2 shadow-lg shadow-purple-950/50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish</span>
            </Button>
          </div>
        </div>

        {/* 1. Large Auto-Sizing Title Input */}
        <div className="space-y-1">
          <textarea
            {...register("title")}
            placeholder="Post title..."
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="w-full resize-none border-0 text-3xl sm:text-5xl font-black bg-transparent placeholder:text-zinc-700 text-white p-0 focus:outline-none focus:ring-0 leading-tight tracking-tight overflow-hidden"
          />
          {errors.title && (
            <p className="text-rose-400 text-xs font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 2. Featured Image Box */}
        {watchedValues.featuredImage ? (
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black">
            <img
              src={watchedValues.featuredImage}
              alt="Featured"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
              <Button
                type="button"
                onClick={() => onImageUpload && onImageUpload("featured")}
                variant="secondary"
                size="sm"
                className="rounded-xl bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800"
              >
                Change Image
              </Button>
              <Button
                type="button"
                onClick={() => setValue("featuredImage", "")}
                variant="destructive"
                size="sm"
                className="rounded-xl bg-rose-950/80 border border-rose-500/20 text-rose-300 hover:bg-rose-900"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onImageUpload && onImageUpload("featured")}
            className="w-full h-28 border border-dashed border-white/10 hover:border-purple-500/40 bg-white/[0.02] hover:bg-purple-950/10 rounded-2xl flex items-center justify-center gap-4 transition-all cursor-pointer group px-6"
          >
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 group-hover:scale-105 transition-transform">
              <Upload className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-medium">
                Add a featured image
              </p>
              <p className="text-zinc-500 text-xs mt-0.5">
                Upload custom cover or transform with AI
              </p>
            </div>
          </button>
        )}

        {/* 3. AI Generation Button */}
        <div>
          {!hasContent ? (
            <button
              type="button"
              onClick={() => handleAI("generate")}
              disabled={!hasTitle || isGenerating || isImproving}
              className="group relative z-10 w-full py-4 px-8 rounded-2xl bg-[#050508] border border-purple-500/30 text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:border-purple-500/60 hover:bg-purple-950/20 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-200 group-hover:text-white transition-colors">
                Generate Content with AI
              </span>

              {/* Gemini Spark Logo on Right with Simple Hover Scale */}
              <div className="group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-400 fill-purple-400"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
                </svg>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-3 w-full gap-3">
              <button
                type="button"
                onClick={() => handleAI("improve", "enhance")}
                disabled={isGenerating || isImproving}
                className="py-2.5 px-3 rounded-xl bg-black/80 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>AI Enhance</span>
              </button>

              <button
                type="button"
                onClick={() => handleAI("improve", "expand")}
                disabled={isGenerating || isImproving}
                className="py-2.5 px-3 rounded-xl bg-black/80 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 text-purple-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5 text-purple-400" />
                <span>AI Expand</span>
              </button>

              <button
                type="button"
                onClick={() => handleAI("improve", "simplify")}
                disabled={isGenerating || isImproving}
                className="py-2.5 px-3 rounded-xl bg-black/80 backdrop-blur-sm border border-amber-500/20 hover:border-amber-500/50 text-amber-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5 text-amber-400" />
                <span>AI Simplify</span>
              </button>
            </div>
          )}
          {!hasTitle && (
            <p className="text-[11px] text-zinc-500 pt-2 font-medium">
              Add a title above to enable AI generation.
            </p>
          )}
        </div>

        {(isGenerating || isImproving) && (
          <BarLoader width={"100%"} color="#a855f7" />
        )}

        {/* 4. Text Editor Canvas */}
        <div className="rounded-2xl bg-black/80 border border-white/10 p-2 sm:p-4">
          <ReactQuill
            ref={setQuillRef}
            theme="snow"
            value={watchedValues.content || ""}
            onChange={(content) => setValue("content", content)}
            modules={getQuillModules()}
            formats={quillConfig.formats}
            placeholder="Tell your story... or use AI to generate content!"
          />
          {errors.content && (
            <p className="text-rose-400 text-xs font-medium mt-2 px-2">
              {errors.content.message}
            </p>
          )}
        </div>
      </div>

      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          background: #000000 !important;
          border-radius: 14px !important;
          padding: 0.6rem !important;
          margin-bottom: 0.75rem !important;
        }
        .ql-container.ql-snow {
          border: none !important;
        }
        .ql-editor {
          color: #f4f4f5 !important;
          font-size: 1.05rem !important;
          line-height: 1.75 !important;
          padding: 0.75rem !important;
          min-height: 360px !important;
        }
        .ql-editor.ql-blank::before {
          color: #52525b !important;
          font-style: normal !important;
        }
        .ql-snow .ql-stroke {
          stroke: #a1a1aa !important;
        }
        .ql-snow .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: #a1a1aa !important;
        }
        .ql-snow .ql-picker {
          color: #a1a1aa !important;
        }
        .ql-snow .ql-picker-options {
          background: #09090b !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
        }
        .ql-snow .ql-tooltip {
          background: #09090b !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  );
}
