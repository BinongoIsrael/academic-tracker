"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Assessment, Course, Term } from "@/types";
import MyCoursesTable from "./components/MyCoursesTable";
import Toast from "../components/Toast";
import CreateCourseModal from "./components/CreateCourseModal";
import CardErrorBoundary from "@/components/CardErrorBoundary";
import { useUser, useCourses, useTerms, useCreateCourseMutation } from "@/lib/hooks/useAcademicData";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPageClient() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: terms = [], isLoading: isLoadingTerms } = useTerms(user?.id);
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses(user?.id);
  const createCourseMutation = useCreateCourseMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const loading = isLoadingTerms || isLoadingCourses;

  const handleCreateCourse = async (courseData: {
    courseTitle: string;
    courseCode: string;
    academicTerm: string;
    courseType: string;
    units: string;
    courseStructure: string;
    targetGPA: string;
    courseColor: string;
    lectureAssessments: Partial<Assessment>[];
    laboratoryAssessments: Partial<Assessment>[];
    lecturePercentage: number;
    laboratoryPercentage: number;
    finalGrade?: number;
    gradeInputMode?: "assessments" | "final";
  }) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (
      !courseData.courseTitle ||
      !courseData.academicTerm ||
      !courseData.courseType ||
      !courseData.units
    ) {
      setToast({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    try {
      await createCourseMutation.mutateAsync({ user, courseData });
      
      setToast({
        message: `Course created successfully${
          courseData.gradeInputMode === "final" ? " with final grade!" : "!"
        }`,
        type: "success",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
      setToast({
        message: "Failed to create course. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <main className="max-w-[1200px] mx-auto pt-6 lg:pt-10 px-4 sm:px-8 lg:px-12 pb-12">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-64" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-xl" />
                <Skeleton className="h-4 w-3/4 max-w-md" />
              </div>
            </div>
            <Skeleton className="h-12 w-48 rounded" />
          </header>

          <div className="space-y-12">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-surface">
        <main className="max-w-[1200px] mx-auto pt-6 lg:pt-10 px-4 sm:px-8 lg:px-12 pb-12">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-dashboard-title text-on-surface mb-2">
                Academic Portfolio
              </h1>
              <p className="text-body-large text-on-surface-variant max-w-xl">
                Curate and manage your academic trajectory. Define course structures, assessment metrics, and track performance indicators.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-3 bg-primary text-on-primary rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all flex items-center justify-center gap-2 shrink-0"
            >
              REGISTER NEW COURSE
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </header>

          <div className="space-y-12">
            <CardErrorBoundary title="My Courses">
              <MyCoursesTable courses={courses} />
            </CardErrorBoundary>
          </div>
        </main>

        {/* Mobile Floating Action Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="md:hidden fixed right-6 bottom-24 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-40 animate-in slide-in-from-bottom-10 duration-300"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      <CreateCourseModal 
        terms={terms} 
        onSubmit={handleCreateCourse} 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
