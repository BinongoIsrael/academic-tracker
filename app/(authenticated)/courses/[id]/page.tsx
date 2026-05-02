"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import {
  Course,
  Assessment,
  AssessmentGrade,
  GradingScale,
  Term,
} from "@/types";
import Toast from "../../components/Toast";
import AssessmentGradeInput from "./components/AssessmentGradeInput";
import GradingScaleSetup from "./components/GradingScaleSetup";
import CourseHeader from "./components/CourseHeader";
import GradeSummaryCard from "./components/GradeSummaryCard";
import ActionButtons from "./components/ActionButtons";
import EditCourseModal from "./components/EditCourseModal";
import { useGradeCalculations } from "./hooks/useGradeCalculations";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [grades, setGrades] = useState<AssessmentGrade[]>([]);
  const [gradingScale, setGradingScale] = useState<GradingScale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGradingSetup, setShowGradingSetup] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hasFinalGradeOnly, setHasFinalGradeOnly] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    currentPercentage,
    finalPercentage,
    currentGPA,
    finalGPA,
    calculateGrades,
  } = useGradeCalculations(course);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (
      assessments.length > 0 &&
      grades.length > 0 &&
      gradingScale.length > 0 &&
      !hasFinalGradeOnly
    ) {
      calculateGrades(assessments, grades, gradingScale);
    }
  }, [assessments, grades, gradingScale, hasFinalGradeOnly]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      const { data: termsData } = await supabase
        .from("terms")
        .select("id, academic_year, semester, user_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

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

      const { data: courseData, error: courseError } = await supabase
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
        .eq("id", courseId)
        .eq("user_id", user.id)
        .single();

      if (courseError) throw courseError;

      const mappedCourse: Course = {
        id: courseData.id,
        user_id: courseData.user_id,
        term_id: courseData.term_id,
        course_name: courseData.course_name,
        course_code: courseData.course_code || "",
        course_type: courseData.course_type,
        course_structure: courseData.course_structure,
        units: courseData.units,
        target_gpa: courseData.target_gpa,
        grade: courseData.grade,
        lecture_percentage: courseData.lecture_percentage,
        laboratory_percentage: courseData.laboratory_percentage,
        course_color: courseData.course_color,
        created_at: courseData.created_at,
        updated_at: courseData.updated_at,
        term: mappedTerms.find((t) => t.id === courseData.term_id),
      };

      console.log("Mapped course:", mappedCourse);

      setCourse(mappedCourse);

      const { data: scaleData } = await supabase
        .from("grading_scale")
        .select("*")
        .eq("course_id", courseId)
        .order("grade_point", { ascending: true });

      if (scaleData && scaleData.length > 0) {
        setGradingScale(scaleData);
      }

      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from("assessments")
        .select("*")
        .eq("course_id", courseId)
        .order("component_type", { ascending: true })
        .order("created_at", { ascending: true });

      if (assessmentsError) throw assessmentsError;

      const mappedAssessments: Assessment[] = (assessmentsData || []).map(
        (assessment) => ({
          id: assessment.id,
          course_id: assessment.course_id,
          assessment_name: assessment.assessment_name,
          occurrences: assessment.occurrences,
          percentage: assessment.percentage,
          component_type: assessment.component_type,
          created_at: assessment.created_at,
          updated_at: assessment.updated_at,
        })
      );

      setAssessments(mappedAssessments);

      const isFinalGradeOnly =
        mappedAssessments.length === 0 && courseData.grade !== null;
      setHasFinalGradeOnly(isFinalGradeOnly);

      if (isFinalGradeOnly) {
        setGrades([]);
      } else {
        const { data: existingGrades } = await supabase
          .from("assessment_grades")
          .select("*")
          .eq("course_id", courseId);

        const allGrades: AssessmentGrade[] = [];
        for (const assessment of mappedAssessments) {
          for (let i = 1; i <= assessment.occurrences; i++) {
            const existing = (existingGrades || []).find(
              (g) =>
                g.assessment_id === assessment.id && g.occurrence_number === i
            );

            allGrades.push({
              id: existing?.id || `new-${assessment.id}-${i}`,
              course_id: courseId,
              assessment_id: assessment.id,
              occurrence_number: i,
              grade: existing?.grade || null,
            });
          }
        }
        setGrades(allGrades);
        calculateGrades(mappedAssessments, allGrades, scaleData || []);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      setToast({
        message: "Failed to load course data. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOccurrences = async (
    assessmentId: string,
    newOccurrences: number
  ) => {
    try {
      const assessment = assessments.find((a) => a.id === assessmentId);
      if (!assessment) return;

      const oldOccurrences = assessment.occurrences;

      const { error: updateError } = await supabase
        .from("assessments")
        .update({ occurrences: newOccurrences })
        .eq("id", assessmentId);

      if (updateError) throw updateError;

      if (newOccurrences > oldOccurrences) {
        const newGradeRecords = [];
        for (let i = oldOccurrences + 1; i <= newOccurrences; i++) {
          newGradeRecords.push({
            course_id: courseId,
            assessment_id: assessmentId,
            occurrence_number: i,
            grade: null,
          });
        }

        if (newGradeRecords.length > 0) {
          const { error: insertError } = await supabase
            .from("assessment_grades")
            .insert(newGradeRecords);

          if (insertError) throw insertError;
        }
      } else if (newOccurrences < oldOccurrences) {
        const { error: deleteError } = await supabase
          .from("assessment_grades")
          .delete()
          .eq("assessment_id", assessmentId)
          .gt("occurrence_number", newOccurrences);

        if (deleteError) throw deleteError;
      }

      setToast({
        message: `Updated occurrences for ${assessment.assessment_name}`,
        type: "success",
      });

      await fetchCourseData();
    } catch (error) {
      console.error("Error updating occurrences:", error);
      setToast({
        message: "Failed to update occurrences. Please try again.",
        type: "error",
      });
    }
  };

  const handleEditCourse = async (updatedCourse: {
    course_name: string;
    term_id: string;
    course_type: string;
    units: number;
    target_gpa: number | null;
    course_color: string;
    course_structure: string;
    lecture_percentage: number;
    laboratory_percentage: number;
  }) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update(updatedCourse)
        .eq("id", courseId);

      if (error) throw error;

      setToast({
        message: "Course updated successfully!",
        type: "success",
      });

      await fetchCourseData();
    } catch (error) {
      console.error("Error updating course:", error);
      setToast({
        message: "Failed to update course. Please try again.",
        type: "error",
      });
      throw error;
    }
  };

  const handleGradeChange = (
    assessmentId: string,
    occurrenceNumber: number,
    value: string
  ) => {
    const gradeValue = value === "" ? null : parseFloat(value);
    setGrades((prev) =>
      prev.map((g) =>
        g.assessment_id === assessmentId &&
        g.occurrence_number === occurrenceNumber
          ? { ...g, grade: gradeValue }
          : g
      )
    );
  };

  const handleCalculate = () => {
    calculateGrades(assessments, grades, gradingScale);
    setToast({
      message: "Grades calculated successfully!",
      type: "success",
    });
  };

  const handleSaveGradingScale = async (
    scales: Omit<
      GradingScale,
      "id" | "course_id" | "created_at" | "updated_at"
    >[]
  ) => {
    try {
      await supabase.from("grading_scale").delete().eq("course_id", courseId);

      const { error } = await supabase.from("grading_scale").insert(
        scales.map((s) => ({
          course_id: courseId,
          grade_point: s.grade_point,
          min_percentage: s.min_percentage,
          max_percentage: s.max_percentage,
        }))
      );

      if (error) throw error;

      setToast({
        message: "Grading scale saved successfully!",
        type: "success",
      });

      await fetchCourseData();
      setShowGradingSetup(false);
    } catch (error) {
      console.error("Error saving grading scale:", error);
      setToast({
        message: "Failed to save grading scale. Please try again.",
        type: "error",
      });
    }
  };

  const handleSaveGrades = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      calculateGrades(assessments, grades, gradingScale);

      const existingGrades = grades.filter((g) => !g.id.startsWith("new-"));
      const newGrades = grades.filter(
        (g) => g.id.startsWith("new-") && g.grade !== null
      );

      for (const grade of existingGrades) {
        const { error } = await supabase.from("assessment_grades").upsert({
          id: grade.id,
          course_id: courseId,
          assessment_id: grade.assessment_id,
          occurrence_number: grade.occurrence_number,
          grade: grade.grade,
        });

        if (error) throw error;
      }

      if (newGrades.length > 0) {
        const { error } = await supabase.from("assessment_grades").insert(
          newGrades.map((g) => ({
            course_id: courseId,
            assessment_id: g.assessment_id,
            occurrence_number: g.occurrence_number,
            grade: g.grade,
          }))
        );

        if (error) throw error;
      }

      let calculatedFinalGPA: number | null = null;

      if (gradingScale.length > 0) {
        let totalWeightedGrade = 0;
        let totalWeight = 0;

        for (const assessment of assessments) {
          const assessmentGrades = grades.filter(
            (g) => g.assessment_id === assessment.id && g.grade !== null
          );

          if (assessmentGrades.length > 0) {
            const avgGrade =
              assessmentGrades.reduce((sum, g) => sum + (g.grade || 0), 0) /
              assessmentGrades.length;
            totalWeightedGrade += avgGrade * assessment.percentage;
            totalWeight += assessment.percentage;
          }
        }

        const finalPercentageValue =
          totalWeight > 0 ? totalWeightedGrade / totalWeight : 0;

        for (const scale of gradingScale) {
          if (
            finalPercentageValue >= scale.min_percentage &&
            finalPercentageValue <= scale.max_percentage
          ) {
            calculatedFinalGPA = scale.grade_point;
            break;
          }
        }
      }

      if (calculatedFinalGPA !== null && calculatedFinalGPA !== undefined) {
        const { error: courseError } = await supabase
          .from("courses")
          .update({ grade: calculatedFinalGPA })
          .eq("id", courseId);

        if (courseError) throw courseError;
      }

      setToast({
        message: "Grades saved successfully!",
        type: "success",
      });

      await fetchCourseData();
    } catch (error) {
      console.error("Error saving grades:", error);
      setToast({
        message: "Failed to save grades. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course details...</p>
            </div>
          </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-lg font-medium">Course not found</p>
      </div>
    );
  }

  const lectureAssessments = assessments.filter(
    (a) => a.component_type === "Lecture"
  );
  const labAssessments = assessments.filter(
    (a) => a.component_type === "Laboratory"
  );

  const lecturePercentage =
    course.lecture_percentage ||
    (course.course_structure === "Lecture" ? 100 : 50);
  const laboratoryPercentage =
    course.laboratory_percentage ||
    (course.course_structure === "Lecture + Laboratory" ? 50 : 0);
  const courseColor = course?.course_color || "#3B82F6";
  const targetGPA = course.target_gpa || 3.0;
  const hasGradingScale = gradingScale.length > 0;

  const displayCurrentGPA = hasFinalGradeOnly
    ? course?.grade ?? null
    : currentGPA;
  const displayFinalGPA = hasFinalGradeOnly ? course?.grade ?? null : finalGPA;

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="flex flex-col lg:flex-row">
          <main className="flex-1 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-12 ml-0 lg:ml-[325px] max-w-full pb-24 sm:pb-12">
            <div className="max-w-3xl mx-auto w-full">
              <CourseHeader
                course={course}
                courseColor={courseColor}
                onBack={() => router.push("/courses")}
                onGradingScaleClick={() =>
                  setShowGradingSetup(!showGradingSetup)
                }
                onEditClick={() => setShowEditModal(true)}
              />

              {showGradingSetup && (
                <div className="mb-4 sm:mb-6">
                  <GradingScaleSetup
                    courseId={courseId}
                    onSave={handleSaveGradingScale}
                    initialScales={gradingScale}
                  />
                </div>
              )}

              {!hasGradingScale && !hasFinalGradeOnly && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-8">
                  <p className="text-xs sm:text-sm md:text-base text-yellow-800">
                    No grading scale configured. Please set up your grading
                    scale to see GPA calculations.
                  </p>
                </div>
              )}

              <div className="mb-4 sm:mb-8">
                <GradeSummaryCard
                  targetGPA={targetGPA}
                  currentGPA={displayCurrentGPA ?? null}
                  currentPercentage={currentPercentage}
                  finalGPA={displayFinalGPA ?? null}
                  finalPercentage={finalPercentage}
                  hasGradingScale={hasGradingScale}
                />
              </div>

              {hasFinalGradeOnly && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-6 mb-4 sm:mb-8">
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-blue-900 mb-2">
                    Final Grade Set
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-blue-800">
                    This course has a final grade of{" "}
                    <strong>{course.grade?.toFixed(2)}</strong> set directly. No
                    assessment tracking is configured for this course.
                  </p>
                </div>
              )}

              {!hasFinalGradeOnly && (
                <>
                  {lectureAssessments.length > 0 && (
                    <div className="mb-4">
                      <AssessmentGradeInput
                        title={`Lecture Assessments (${lecturePercentage}%)`}
                        assessments={lectureAssessments}
                        grades={grades}
                        onGradeChange={handleGradeChange}
                      />
                    </div>
                  )}

                  {labAssessments.length > 0 && (
                    <div className="mb-4">
                      <AssessmentGradeInput
                        title={`Laboratory Assessments (${laboratoryPercentage}%)`}
                        assessments={labAssessments}
                        grades={grades}
                        onGradeChange={handleGradeChange}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <ActionButtons
                      onCalculate={handleCalculate}
                      onSave={handleSaveGrades}
                    />
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {showEditModal && course && (
        <EditCourseModal
          course={course}
          terms={terms}
          onSave={handleEditCourse}
          onClose={() => setShowEditModal(false)}
        />
      )}

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
