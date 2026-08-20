"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import PostEditorContent from "./post-editor-content";
import PostEditorSettings from "./post-editor-settings";
import ImageUploadModal from "./image-upload-modal";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").default([]),
  featuredImage: z.string().optional(),
  scheduledFor: z.string().optional(),
});

export default function PostEditor({ initialData = null, mode = "create" }) {
  const router = useRouter();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalType, setImageModalType] = useState("featured");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [quillRef, setQuillRef] = useState(null);

  const { mutate: createPost, isLoading: isCreateLoading } = useConvexMutation(
    api.posts.create,
  );
  const { mutate: updatePost, isLoading: isUpdating } = useConvexMutation(
    api.posts.update,
  );

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      featuredImage: initialData?.featuredImage || "",
      scheduledFor: initialData?.scheduledFor
        ? new Date(initialData.scheduledFor).toISOString().slice(0, 16)
        : "",
    },
  });

  const { handleSubmit, watch, setValue } = form;
  const watchedValues = watch();

  const onSubmit = useCallback(
    async (data, action, silent = false) => {
      try {
        const postData = {
          title: data.title,
          content: data.content,
          category: data.category || undefined,
          tags: data.tags || [],
          featuredImage: data.featuredImage || undefined,
          status: action === "publish" ? "published" : "draft",
          scheduledFor: data.scheduledFor
            ? new Date(data.scheduledFor).getTime()
            : undefined,
        };

        let resultId;
        if (mode === "edit" && initialData?._id) {
          resultId = await updatePost({ id: initialData._id, ...postData });
        } else if (initialData?._id && action === "draft") {
          resultId = await updatePost({ id: initialData._id, ...postData });
        } else {
          resultId = await createPost(postData);
        }

        if (!silent) {
          toast.success(
            action === "publish" ? "Post published!" : "Draft saved!",
          );
          if (action === "publish") router.push("/dashboard/posts");
        }
        return resultId;
      } catch (error) {
        if (!silent) toast.error(error.message || "Failed to save post");
        throw error;
      }
    },
    [mode, initialData, createPost, updatePost, router],
  );

  useEffect(() => {
    if (!watchedValues.title && !watchedValues.content) return;
    const autoSaveInterval = setInterval(() => {
      if (mode === "create" && (watchedValues.title || watchedValues.content)) {
        handleSubmit((data) => onSubmit(data, "draft", true))();
      }
    }, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [
    watchedValues.title,
    watchedValues.content,
    mode,
    handleSubmit,
    onSubmit,
  ]);

  const handleImageSelect = (imageData) => {
    if (imageModalType === "featured") {
      setValue("featuredImage", imageData.url, { shouldValidate: true });
      toast.success("Featured image attached!");
    } else if (imageModalType === "content" && quillRef) {
      try {
        const quill = quillRef.getEditor ? quillRef.getEditor() : quillRef;
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        quill.insertEmbed(index, "image", imageData.url);
        quill.setSelection(index + 1);
        toast.success("Image inserted!");
      } catch (err) {
        toast.error("Failed to insert image");
      }
    }
    setIsImageModalOpen(false);
  };

  const isPending = isCreateLoading || isUpdating;

  return (
    <div className="w-full min-h-screen text-white">
      <PostEditorContent
        form={form}
        setQuillRef={setQuillRef}
        isPending={isPending}
        onSave={() => handleSubmit((data) => onSubmit(data, "draft"))()}
        onPublish={() => handleSubmit((data) => onSubmit(data, "publish"))()}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onBack={() => router.push("/dashboard")}
        onImageUpload={(type) => {
          setImageModalType(type);
          setIsImageModalOpen(true);
        }}
      />

      <PostEditorSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        form={form}
        mode={mode}
      />

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelect={handleImageSelect}
        title={
          imageModalType === "featured"
            ? "Upload Featured Image"
            : "Insert Image Into Post"
        }
      />
    </div>
  );
}
