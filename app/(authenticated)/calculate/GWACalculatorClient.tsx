"use client";
import React, { useState, useEffect } from "react";
import GWATypeSelection from "./components/GWATypeSelection";
import GWAResults from "./components/GWAResults";
import GWABreakdown from "./components/GWABreakdown";
import { useRouter } from "next/navigation";
import Toast from "../components/Toast";
import { useUser, useTerms, useCourses } from "@/lib/hooks/useAcademicData";

export default function GWACalculatorClient() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: terms = [], isLoading: isLoadingTerms, error: termsError } = useTerms(user?.id);
  const { data: allCourses = [], isLoading: isLoadingCourses } = useCourses(user?.id);

  const [selectionType, setSelectionType] = useState<"all" | "specific">("all");
  const [selectedTermId, setSelectedTermId] = useState("");

  const [academicGWA, setAcademicGWA] = useState("-.--");
  const [totalGWA, setTotalGWA] = useState("-.--");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const courses = selectionType === "all" 
    ? allCourses 
    : allCourses.filter(c => c.term_id === selectedTermId);

  const loading = isLoadingTerms || isLoadingCourses;

  useEffect(() => {
    if (terms.length > 0 && selectedTermId && !terms.some(term => term.id === selectedTermId)) {
      setSelectedTermId("");
    }
  }, [terms, selectedTermId]);

  useEffect(() => {
    if (courses.length === 0) {
      setAcademicGWA("-.--");
      setTotalGWA("-.--");
      return;
    }

    let sumOfWeightedGrades_Academic = 0;
    let sumOfUnits_Academic = 0;
    let sumOfWeightedGrades_Total = 0;
    let sumOfUnits_Total = 0;

    for (const course of courses) {
      const grade = parseFloat(String(course.grade ?? 0));
      const units = parseFloat(String(course.units ?? 0));

      if (!isNaN(grade) && !isNaN(units) && units > 0) {
        const weightedGrade = grade * units;

        sumOfWeightedGrades_Total += weightedGrade;
        sumOfUnits_Total += units;

        if (course.course_type === "Academic" || course.course_type === "Major") {
          sumOfWeightedGrades_Academic += weightedGrade;
          sumOfUnits_Academic += units;
        }
      }
    }

    const finalAcademicGWA =
      sumOfUnits_Academic > 0
        ? (sumOfWeightedGrades_Academic / sumOfUnits_Academic).toFixed(2)
        : "-.--";
    
    const finalTotalGWA =
      sumOfUnits_Total > 0
        ? (sumOfWeightedGrades_Total / sumOfUnits_Total).toFixed(2)
        : "-.--";

    setAcademicGWA(finalAcademicGWA);
    setTotalGWA(finalTotalGWA);

  }, [courses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-medium">Quantifying Performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      <main className="max-w-6xl mx-auto pt-6 lg:pt-10 px-4 sm:px-8 lg:px-12 pb-12">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="text-dashboard-title text-on-surface mb-2">
            Calculate GWA
          </h1>
          <p className="text-body-large text-on-surface-variant max-w-2xl">
            Detailed academic performance tracking. Review your General Weighted Average across your entire curriculum or specific academic periods.
          </p>
        </header>

        <GWAResults academicGWA={academicGWA} totalGWA={totalGWA} />

        <GWATypeSelection
          selectionType={selectionType}
          setSelectionType={setSelectionType}
          selectedTermId={selectedTermId}
          setSelectedTermId={setSelectedTermId}
          terms={terms}
          loadingTerms={isLoadingTerms}
          termsError={termsError ? (termsError as Error).message : null}
        />

        <GWABreakdown
          academicYear={
            selectionType === "specific" && selectedTermId
              ? terms.find((t) => t.id === selectedTermId)?.academicYear ?? "N/A"
              : selectionType === "all"
              ? "All Academic Terms"
              : ""
          }
          specificRange={
            selectionType === "specific" && selectedTermId
              ? terms.find((t) => t.id === selectedTermId)?.semester ?? ""
              : ""
          }
          courses={courses}
        />
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
