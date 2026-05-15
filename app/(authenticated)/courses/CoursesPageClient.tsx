"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Assessment, Course, Term } from "@/types";
import MyCoursesTable from "./components/MyCoursesTable";
import Toast from "../components/Toast";
import CreateCourseModal from "./components/CreateCourseModal";
import CardErrorBoundary from "@/components/CardErrorBoundary";

export default function CoursesPageClient() {
  const router = useRouter();
  const [terms, setTerms] = useState<Term[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      const { data: termsData, error: termsError } = await supabase
        .from("terms")
        .select("id, academic_year, semester, user_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (termsError) throw termsError;

      const mappedTerms: Term[] = (termsData || []).map((term) => ({
        id: term.id,
        user_id: term.user_id,
        academicYear: term.academic_year,
        semester: term.semester,
        startDate: null,
        endDate: null,
        created_at: "",
        updated_at: "",
        courses: 0,
        units: 0,
        gpa: 0,
        isActive: false,
      }));
      setTerms(mappedTerms);

      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select(
          `
          *,
          terms:term_id (
            academic_year,
            semester
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

      const mappedCourses: Course[] = (coursesData || []).map((course) => ({
        id: course.id,
        user_id: course.user_id,
        term_id: course.term_id,
        course_name: course.course_name,
        course_code: course.course_code || "",
        course_type: course.course_type,
        course_structure: course.course_structure,
        units: course.units || 0,
        target_gpa: course.target_gpa,
        grade: course.grade || 0,
        lecture_percentage: course.lecture_percentage,
        laboratory_percentage: course.laboratory_percentage,
        course_color: course.course_color,
        created_at: course.created_at || "",
        updated_at: course.updated_at || "",
        term: mappedTerms.find((t) => t.id === course.term_id),
      }));
      setCourses(mappedCourses);
    } catch (error) {
      console.error("Error fetching data:", error);
      setToast({
        message: "Failed to fetch data. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

      const courseInsertData: any = {
        user_id: user.id,
        term_id: courseData.academicTerm,
        course_name: courseData.courseTitle,
        course_code: courseData.courseCode,
        course_type: courseData.courseType,
        units: parseFloat(courseData.units),
        course_structure: courseData.courseStructure,
        target_gpa: courseData.targetGPA
          ? parseFloat(courseData.targetGPA)
          : null,
        course_color: courseData.courseColor,
        lecture_percentage: courseData.lecturePercentage,
        laboratory_percentage: courseData.laboratoryPercentage,
      };

      if (
        courseData.gradeInputMode === "final" &&
        courseData.finalGrade !== undefined
      ) {
        courseInsertData.grade = courseData.finalGrade;
      }

      const { data: newCourse, error: courseError } = await supabase
        .from("courses")
        .insert(courseInsertData)
        .select()
        .single();

      if (courseError) throw courseError;

      if (
        courseData.gradeInputMode === "assessments" ||
        !courseData.gradeInputMode
      ) {
        const allAssessments = [];

        const lectureAssessmentData = courseData.lectureAssessments
          .filter((a) => a.assessment_name && a.occurrences && a.percentage)
          .map((a) => ({
            course_id: newCourse.id,
            assessment_name: a.assessment_name,
            occurrences: a.occurrences,
            percentage: a.percentage,
            component_type: "Lecture",
          }));
        allAssessments.push(...lectureAssessmentData);

        if (courseData.courseStructure === "Lecture + Laboratory") {
          const labAssessmentData = courseData.laboratoryAssessments
            .filter((a) => a.assessment_name && a.occurrences && a.percentage)
            .map((a) => ({
              course_id: newCourse.id,
              assessment_name: a.assessment_name,
              occurrences: a.occurrences,
              percentage: a.percentage,
              component_type: "Laboratory",
            }));
          allAssessments.push(...labAssessmentData);
        }

        if (allAssessments.length > 0) {
          const { data: insertedAssessments, error: assessmentError } =
            await supabase.from("assessments").insert(allAssessments).select();

          if (assessmentError) throw assessmentError;

          const gradeRecords = [];
          for (const assessment of insertedAssessments) {
            for (let i = 1; i <= assessment.occurrences; i++) {
              gradeRecords.push({
                course_id: newCourse.id,
                assessment_id: assessment.id,
                occurrence_number: i,
                grade: null,
              });
            }
          }

          if (gradeRecords.length > 0) {
            const { error: gradesError } = await supabase
              .from("assessment_grades")
              .insert(gradeRecords);

            if (gradesError) throw gradesError;
          }
        }
      }

      await fetchData();
      setToast({
        message: `Course created successfully${
          courseData.gradeInputMode === "final" ? " with final grade!" : "!"
        }`,
        type: "success",
      });
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
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-on-surface-variant">Loading academic portfolio...</p>
            </div>
          </div>
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
