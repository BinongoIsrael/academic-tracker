"use client";

import { DeleteTermModalProps, Term } from "@/types";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function DeleteTermModal({
  term,
  isOpen,
  onClose,
  onConfirm,
}: DeleteTermModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !term) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(term.id);
      onClose();
    } catch (error) {
      console.error("Error deleting term:", error);
      alert("Failed to delete term. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSemesterDisplay = () => {
    const semesterLower = term.semester.toLowerCase();
    if (semesterLower.includes("summer")) {
      return `Summer (${term.academicYear})`;
    }
    return `${term.semester} Semester (${term.academicYear})`;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-slate-300 rounded-lg shadow-xl z-50 p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Term</h2>
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">
            {getSemesterDisplay()}
          </span>
          ? This action cannot be undone and will also delete all courses associated with this term.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-red-900 mb-2">
            This will permanently delete:
          </p>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• {term.courses} course{term.courses !== 1 ? "s" : ""}</li>
            <li>• {term.units} unit{term.units !== 1 ? "s" : ""} of credit</li>
            {term.gpa && <li>• GWA data ({term.gpa.toFixed(2)})</li>}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-slate-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Term"}
          </button>
        </div>
      </div>
    </>
  );
}