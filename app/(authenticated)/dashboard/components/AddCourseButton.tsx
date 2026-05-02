"use client";

import { AddCourseButtonProps } from "@/types";
import { Plus } from "lucide-react";

export default function AddCourseButton({ onClick }: AddCourseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 h-[50px] px-4 bg-brand-green border border-black rounded-[30px] text-button text-black hover:bg-green-light transition-all active:scale-95 neo-shadow-hover flex-shrink-0"
    >
      <span className="font-bold">Add Course</span>
      <Plus className="w-5 h-5" strokeWidth={3} />
    </button>
  );
}
