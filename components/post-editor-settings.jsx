"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  X,
  Calendar as CalendarIcon,
  Tag,
  Folder,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const CATEGORIES = [
  "Technology",
  "Design",
  "Marketing",
  "Business",
  "Lifestyle",
  "Education",
  "Health",
  "Travel",
  "Food",
  "Entertainment",
];

export default function PostEditorSettings({ isOpen, onClose, form, mode }) {
  const [tagInput, setTagInput] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const { watch, setValue } = form;
  const watchedValues = watch();

  const handleTagInput = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (
      tag &&
      !watchedValues.tags.includes(tag) &&
      watchedValues.tags.length < 10
    ) {
      setValue("tags", [...watchedValues.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setValue(
      "tags",
      watchedValues.tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const currentScheduled = watchedValues.scheduledFor || "";
  const selectedDate = currentScheduled
    ? new Date(currentScheduled)
    : undefined;

  const selectedTime =
    currentScheduled && currentScheduled.includes("T")
      ? currentScheduled.split("T")[1].slice(0, 5)
      : "12:00";

  const formatScheduledDate = (dateTimeString) => {
    if (!dateTimeString) return "Select date & time...";
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "Select date & time...";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    setValue("scheduledFor", `${dateStr}T${selectedTime}`);
  };

  const handleTimeSelect = (timeValue) => {
    const baseDate = selectedDate || new Date();
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, "0");
    const day = String(baseDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    setValue("scheduledFor", `${dateStr}T${timeValue}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-[#030305] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-white/5">
          <DialogTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Post Settings
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Configure metadata and publication options for your post.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-zinc-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-purple-400" />
              Category
            </label>
            <Select
              value={watchedValues.category}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger className="w-full bg-black/60 border border-white/10 hover:border-purple-500/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-xl text-sm text-zinc-200 h-11 px-3.5 cursor-pointer transition-all duration-200">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent className="bg-[#09090b] border border-white/10 rounded-xl p-1 shadow-2xl z-[100]">
                {CATEGORIES.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="rounded-lg text-sm font-medium text-zinc-300 cursor-pointer transition-colors duration-150 focus:bg-purple-600 focus:text-white hover:bg-purple-600 hover:text-white my-0.5"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2.5">
            <label className="text-zinc-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              Tags
            </label>

            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder="Add tags..."
                className="bg-black/60 border border-white/10 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 rounded-xl text-sm text-white placeholder:text-zinc-600 h-11 px-3.5"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="h-11 px-4 rounded-xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-600 hover:text-white text-purple-300 transition-all cursor-pointer flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {watchedValues.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {watchedValues.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-purple-500/25 transition-colors"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-white cursor-pointer transition-colors p-0.5 rounded-full hover:bg-purple-500/40"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-[11px] text-zinc-500 font-medium">
              {watchedValues.tags.length}/10 tags • Press Enter or comma to add
            </p>
          </div>

          {/* Inline Expandable Schedule Picker */}
          {mode === "create" && (
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between pt-2">
                <label className="text-zinc-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-purple-400" />
                  Schedule Publication
                </label>
                {watchedValues.scheduledFor && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("scheduledFor", "");
                      setShowCalendar(false);
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer font-medium"
                  >
                    Clear schedule
                  </button>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full bg-black/60 border border-white/10 hover:border-purple-500/50 hover:bg-purple-950/10 rounded-xl text-sm h-11 px-3.5 justify-between font-normal text-white cursor-pointer transition-all"
              >
                <span
                  className={
                    watchedValues.scheduledFor
                      ? "text-purple-300 font-medium"
                      : "text-zinc-500"
                  }
                >
                  {formatScheduledDate(watchedValues.scheduledFor)}
                </span>
                {showCalendar ? (
                  <ChevronUp className="w-4 h-4 text-purple-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-purple-400" />
                )}
              </Button>

              {showCalendar && (
                <div className="pt-2 space-y-3 animate-in fade-in-50 duration-200">
                  <div className="flex justify-center w-full">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      className="rounded-xl bg-transparent text-white p-1 cursor-pointer w-full"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <label className="text-zinc-400 text-xs font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" /> Time
                    </label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => handleTimeSelect(e.target.value)}
                      className="bg-black/60 border border-white/10 hover:border-purple-500/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-xl text-sm text-white h-10 px-3 cursor-pointer [color-scheme:dark]"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowCalendar(false)}
                      className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs px-4 h-8 font-semibold cursor-pointer"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-zinc-500 font-medium">
                Leave empty to publish immediately
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
