"use client";

import { AddCourseButtonProps } from "@/types";
import { Plus } from "lucide-react";

export default function AddCourseButton({ onClick }: AddCourseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 h-[50px] px-4 bg-brand-green border border-black rounded-[30px] text-button text-black hover:bg-green-light transition-colors flex-shrink-0"
    >
      <span>Add Course</span>
      <Plus className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}