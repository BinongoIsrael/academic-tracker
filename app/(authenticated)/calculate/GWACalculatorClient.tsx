"use client";
import React, { useState, useEffect } from "react";
import GWATypeSelection from "./components/GWATypeSelection";
import GWAResults from "./components/GWAResults";
import GWABreakdown from "./components/GWABreakdown";
import { supabase } from "@/utils/supabase/client";
import { Course, Term } from "@/types";
import { useRouter } from "next/navigation";
import Toast from "../components/Toast";

export default function GWACalculatorClient() {
  const router = useRouter();
  const [selectionType, setSelectionType] = useState<"all" | "specific">("all");
  const [selectedTermId, setSelectedTermId] = useState("");

  const [academicGWA, setAcademicGWA] = useState("-.--");
  const [totalGWA, setTotalGWA] = useState("-.--");
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      setLoadingTerms(true);
      setTermsError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/signin");
          return;
        }

        const { data, error } = await supabase
          .from("terms")
          .select("*")
          .order("academic_year", { ascending: false })
          .order("semester", { ascending: true })
          .eq("user_id", user.id);

        if (error) {
          const errorMessage = error.message || "Failed to fetch terms";
          setTermsError(errorMessage);
          setToast({ message: errorMessage, type: "error" });
          setTerms([]);
        } else if (!data || (Array.isArray(data) && data.length === 0)) {
          setTerms([]);
        } else {
          const mapped: Term[] = (data as any[]).map((t) => ({
            id: t.id,
            user_id: t.user_id ?? "",
            academicYear: t.academic_year ?? t.academicYear ?? "",
            semester: t.semester ?? "",
            startDate: t.start_date ?? t.startDate ?? null,
            endDate: t.end_date ?? t.endDate ?? null,
            courses: t.courses ?? 0, 
            units: t.units ?? 0,
            gpa: t.gpa ?? null,
            isActive: t.is_active ?? t.isActive ?? false,
            created_at: t.created_at ?? "",
            updated_at: t.updated_at ?? "",
          }));
          setTerms(mapped);
          if (selectedTermId && !mapped.some(term => term.id === selectedTermId)) {
            setSelectedTermId("");
          }
        }
      } catch (err) {
        console.error("fetchTerms exception:", err);
        const errorMessage = "An unexpected error occurred while fetching terms.";
        setTermsError(errorMessage);
        setToast({ message: errorMessage, type: "error" });
        setTerms([]);
      } finally {
        setLoadingTerms(false);
      }
    };

    fetchTerms();
  }, [router, selectedTermId]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        setCourses([]);
        setAcademicGWA("-.--");
        setTotalGWA("-.--");

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/signin");
          return;
        }

        let query = supabase.from("courses").select("*").eq("user_id", user.id);

        if (selectionType === "specific") {
          if (!selectedTermId) {
            setCourses([]);
            return;
          }
          query = query.eq("term_id", selectedTermId);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        if (data) {
          setCourses(data as Course[]);
        } else {
          setCourses([]);
        }
      } catch (error: any) {
          console.error("Error fetching courses:", error.message);
          setToast({ message: "Failed to fetch courses.", type: "error" });
          setCourses([]);
      } finally {
          setLoading(false);
      }
    };
    fetchCourses();
  }, [selectionType, selectedTermId, router]);

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
          loadingTerms={loadingTerms}
          termsError={termsError}
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
