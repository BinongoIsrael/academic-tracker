"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Course,
  Assessment,
  AssessmentGrade,
  GradingScale,
} from "@/types";
import Toast from "../../components/Toast";
import AssessmentGradeInput from "./components/AssessmentGradeInput";
import GradingScaleSetup from "./components/GradingScaleSetup";
import CourseHeader from "./components/CourseHeader";
import GradeSummaryCard from "./components/GradeSummaryCard";
import ActionButtons from "./components/ActionButtons";
import EditCourseModal from "./components/EditCourseModal";
import { useGradeCalculations } from "./hooks/useGradeCalculations";
import CardErrorBoundary from "@/components/CardErrorBoundary";
import { getTermStatus } from "@/lib/utils";

import { 
  useUser, 
  useCourseDetail, 
  useTerms,
  useUpdateCourseMutation,
  useUpdateAssessmentOccurrencesMutation,
  useSaveGradingScaleMutation,
  useSaveGradesMutation
} from "@/lib/hooks/useAcademicData";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { data: user } = useUser();
  const { data: courseData, isLoading, isError } = useCourseDetail(courseId, user?.id);
  const { data: terms = [] } = useTerms(user?.id);

  const updateCourseMutation = useUpdateCourseMutation();
  const updateOccurrencesMutation = useUpdateAssessmentOccurrencesMutation();
  const saveGradingScaleMutation = useSaveGradingScaleMutation();
  const saveGradesMutation = useSaveGradesMutation();

  const [showGradingSetup, setShowGradingSetup] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [autoFilledGradeKeys, setAutoFilledGradeKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const course = courseData?.course ?? null;
  const assessments = useMemo(() => courseData?.assessments ?? [], [courseData?.assessments]);
  const initialGrades = useMemo(() => courseData?.grades ?? [], [courseData?.grades]);
  const gradingScale = useMemo(() => courseData?.gradingScale ?? [], [courseData?.gradingScale]);

  const [localGrades, setLocalGrades] = useState<AssessmentGrade[]>([]);

  useEffect(() => {
    if (initialGrades.length > 0) {
      setLocalGrades(initialGrades);
    }
  }, [initialGrades]);

  const {
    currentPercentage,
    finalPercentage,
    currentGPA,
    finalGPA,
    requiredScoreToTarget,
    targetStatus,
    calculateGrades,
  } = useGradeCalculations(course);

  useEffect(() => {
    if (assessments.length > 0 && localGrades.length > 0) {
      calculateGrades(assessments, localGrades, gradingScale, course);
    }
  }, [assessments, localGrades, gradingScale, calculateGrades, course]);

  const isReadOnly = useMemo(() => {
    if (!isMounted || !course?.term) return false;
    return getTermStatus(course.term.startDate, course.term.endDate) === 'past';
  }, [isMounted, course?.term]);

  const PASSING_GRADE_POINT = 3.0;

  const handleUpdateOccurrences = async (
    assessmentId: string,
    newOccurrences: number
  ) => {
    try {
      const assessment = assessments.find((a) => a.id === assessmentId);
      if (!assessment) return;

      await updateOccurrencesMutation.mutateAsync({
        courseId,
        assessmentId,
        newOccurrences,
        oldOccurrences: assessment.occurrences,
      });

      setToast({
        message: `Updated occurrences for ${assessment.assessment_name}`,
        type: "success",
      });
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
      await updateCourseMutation.mutateAsync({
        id: courseId,
        data: updatedCourse,
      });

      setToast({
        message: "Course updated successfully!",
        type: "success",
      });
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
    const gradeKey = `${assessmentId}:${occurrenceNumber}`;

    setAutoFilledGradeKeys((prev) => {
      if (!prev.has(gradeKey)) return prev;
      const next = new Set(prev);
      next.delete(gradeKey);
      return next;
    });

    setLocalGrades((prev) =>
      prev.map((g) =>
        g.assessment_id === assessmentId &&
        g.occurrence_number === occurrenceNumber
          ? { ...g, grade: gradeValue }
          : g
      )
    );
  };

  const handleCalculate = () => {
    calculateGrades(assessments, localGrades, gradingScale, course);
    setToast({
      message: "Grades calculated successfully!",
      type: "success",
    });
  };

  const getTargetScaleEntry = (targetGradePoint: number) => {
    if (gradingScale.length === 0) return null;

    const exactMatch = gradingScale.find(
      (scale) => scale.grade_point === targetGradePoint
    );

    if (exactMatch) return exactMatch;

    const passingScales = gradingScale
      .filter((scale) => scale.grade_point <= PASSING_GRADE_POINT)
      .sort((a, b) => b.grade_point - a.grade_point);

    return passingScales[0] ?? null;
  };

  const calculateRequiredScore = (targetGradePoint: number) => {
    if (assessments.length === 0) {
      return { status: "no_assessments" as const, requiredScore: null };
    }

    const scaleEntry = getTargetScaleEntry(targetGradePoint);
    if (!scaleEntry) {
      return { status: "missing_scale" as const, requiredScore: null };
    }

    let totalEarnedContribution = 0;
    let totalRemainingWeight = 0;
    let emptyGradeCount = 0;

    for (const assessment of assessments) {
      const assessmentGrades = localGrades.filter(
        (g) => g.assessment_id === assessment.id
      );
      const weightPerOccurrence =
        assessment.percentage / assessment.occurrences;

      for (let i = 1; i <= assessment.occurrences; i++) {
        const gradeEntry = assessmentGrades.find(
          (g) => g.occurrence_number === i
        );
        const gradeKey = `${assessment.id}:${i}`;
        const shouldTreatAsRemaining =
          gradeEntry?.grade == null || autoFilledGradeKeys.has(gradeKey);

        if (!shouldTreatAsRemaining && gradeEntry?.grade != null) {
          totalEarnedContribution +=
            (gradeEntry.grade * weightPerOccurrence) / 100;
        } else {
          totalRemainingWeight += weightPerOccurrence;
          emptyGradeCount += 1;
        }
      }
    }

    if (emptyGradeCount === 0 || totalRemainingWeight === 0) {
      return { status: "no_remaining" as const, requiredScore: null };
    }

    const pointsNeeded = scaleEntry.min_percentage - totalEarnedContribution;

    if (pointsNeeded <= 0) {
      return { status: "reached" as const, requiredScore: 0 };
    }

    const requiredScore = (pointsNeeded / totalRemainingWeight) * 100;

    if (requiredScore > 100) {
      return { status: "impossible" as const, requiredScore };
    }

    return { status: "possible" as const, requiredScore };
  };

  const applyRequiredScoresToEmptyGrades = (
    targetGradePoint: number,
    label: string
  ) => {
    const result = calculateRequiredScore(targetGradePoint);

    if (result.status === "missing_scale") {
      setToast({
        message: "Set a grading scale to calculate required scores.",
        type: "error",
      });
      return;
    }

    if (result.status === "no_assessments") {
      setToast({
        message: "No assessments available for score predictions.",
        type: "error",
      });
      return;
    }

    if (result.status === "no_remaining") {
      setToast({
        message: "All assessment inputs already have grades.",
        type: "success",
      });
      return;
    }

    if (result.status === "impossible" && result.requiredScore != null) {
      setToast({
        message: `Cannot reach ${label}. Required average is ${result.requiredScore.toFixed(1)}%.`,
        type: "error",
      });
      return;
    }

    const scoreValue = Math.max(0, Math.min(100, result.requiredScore ?? 0));
    const roundedScore = Math.min(100, Math.ceil(scoreValue * 100) / 100);
    const updatedKeys = new Set<string>();

    const nextGrades = localGrades.map((grade) => {
      const gradeKey = `${grade.assessment_id}:${grade.occurrence_number}`;
      const shouldFill =
        grade.grade === null || autoFilledGradeKeys.has(gradeKey);

      if (!shouldFill) return grade;

      updatedKeys.add(gradeKey);
      return { ...grade, grade: roundedScore };
    });

    setLocalGrades(nextGrades);
    setAutoFilledGradeKeys(updatedKeys);
    calculateGrades(assessments, nextGrades, gradingScale, course);

    setToast({
      message: `Filled remaining grades with ${roundedScore.toFixed(2)}% to reach ${label}.`,
      type: "success",
    });
  };

  const handleFillPassingScores = () => {
    applyRequiredScoresToEmptyGrades(
      PASSING_GRADE_POINT,
      `passing grade (${PASSING_GRADE_POINT.toFixed(2)})`
    );
  };

  const handleFillTargetScores = () => {
    const goalGPA = course?.target_gpa ?? PASSING_GRADE_POINT;
    applyRequiredScoresToEmptyGrades(
      goalGPA,
      `goal grade (${goalGPA.toFixed(2)})`
    );
  };

  const handleClearAutoFilledScores = () => {
    if (autoFilledGradeKeys.size === 0) {
      setToast({
        message: "No auto-filled grades to clear.",
        type: "success",
      });
      return;
    }

    const nextGrades = localGrades.map((grade) => {
      const gradeKey = `${grade.assessment_id}:${grade.occurrence_number}`;
      if (!autoFilledGradeKeys.has(gradeKey)) return grade;
      return { ...grade, grade: null };
    });

    setLocalGrades(nextGrades);
    setAutoFilledGradeKeys(new Set());
    calculateGrades(assessments, nextGrades, gradingScale, course);

    setToast({
      message: "Auto-filled grades cleared.",
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
      await saveGradingScaleMutation.mutateAsync({
        courseId,
        scales,
      });

      setToast({
        message: "Grading scale saved successfully!",
        type: "success",
      });

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
      calculateGrades(assessments, localGrades, gradingScale, course);

      await saveGradesMutation.mutateAsync({
        courseId,
        localGrades,
        assessments,
        gradingScale,
      });

      setToast({
        message: "Grades saved successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving grades:", error);
      setToast({
        message: "Failed to save grades. Please try again.",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-on-surface-variant font-medium">Synchronizing Academic Records...</p>
            </div>
          </div>
      </div>
    );
  }

  if (!course || isError) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Portfolio Link Not Detected</h1>
            <p className="text-on-surface-variant font-medium leading-relaxed">The specific course entry you are attempting to access has been relocated or removed from your curriculum database.</p>
            <button onClick={() => router.push("/courses")} className="text-primary font-bold hover:underline flex items-center gap-2 mx-auto transition-all">
                <span className="material-symbols-outlined">arrow_back</span>
                Return to Portfolio
            </button>
        </div>
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
  const hasFinalGradeOnly = assessments.length === 0 && course.grade !== null;

  const displayCurrentGPA = hasFinalGradeOnly
    ? course?.grade ?? null
    : currentGPA;
  const displayFinalGPA = hasFinalGradeOnly ? course?.grade ?? null : finalGPA;

  if (!isMounted) return null;

  return (
    <>
      <div className="min-h-screen bg-surface">
          <main className="max-w-[1200px] mx-auto pt-6 lg:pt-10 px-4 sm:px-8 lg:px-12 pb-24 sm:pb-12">
            <div className="max-w-4xl mx-auto w-full space-y-8">
              <CourseHeader
                course={course}
                courseColor={courseColor}
                onBack={() => router.push("/courses")}
                onGradingScaleClick={() =>
                  setShowGradingSetup(!showGradingSetup)
                }
                onEditClick={() => setShowEditModal(true)}
                isReadOnly={isReadOnly}
              />

              {isReadOnly && (
                <div className="bg-surface-container-highest border border-outline-variant/20 rounded-lg p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="material-symbols-outlined text-on-surface">lock</span>
                  <div>
                    <p className="text-sm font-bold text-on-surface uppercase tracking-wider mb-1">Archived Course</p>
                    <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                        This course belongs to a past academic term. It is currently in a read-only state for historical reference.
                    </p>
                  </div>
                </div>
              )}

              {showGradingSetup && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <GradingScaleSetup
                    courseId={courseId}
                    onSave={handleSaveGradingScale}
                    initialScales={gradingScale}
                    isSaving={saveGradingScaleMutation.isPending}
                  />
                </div>
              )}

              {!hasGradingScale && !hasFinalGradeOnly && (
                <div className="bg-primary-container/10 border border-primary/10 rounded-lg p-6 flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <div>
                    <p className="text-sm font-bold text-on-primary-container uppercase tracking-wider mb-1">Configuration Required</p>
                    <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                        No grading scale established for this course. Initialize your grading metrics to unlock real-time GPA projections and tracking.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-8">
                <CardErrorBoundary title="Grade Summary">
                  <GradeSummaryCard
                    targetGPA={targetGPA}
                    currentGPA={displayCurrentGPA ?? null}
                    currentPercentage={currentPercentage}
                    finalGPA={displayFinalGPA ?? null}
                    finalPercentage={finalPercentage}
                    hasGradingScale={hasGradingScale}
                    requiredScoreToTarget={requiredScoreToTarget}
                    targetStatus={targetStatus}
                  />
                </CardErrorBoundary>
              </div>

              {hasFinalGradeOnly && (
                <div className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    <h3 className="text-lg font-black text-on-surface uppercase tracking-tight">Direct Grade Entry Mode</h3>
                  </div>
                  <p className="text-on-surface-variant font-medium leading-relaxed max-w-2xl">
                    This course portfolio utilizes a static final grade of <span className="font-black text-on-surface">{course.grade?.toFixed(2)}</span>. Dynamic assessment tracking is currently bypassed for this record.
                  </p>
                </div>
              )}

              {!hasFinalGradeOnly && (
                <div className="space-y-12">
                  {lectureAssessments.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                      <CardErrorBoundary title="Lecture Assessments">
                        <AssessmentGradeInput
                          title={`Lecture Assessments (${lecturePercentage}%)`}
                          assessments={lectureAssessments}
                          grades={localGrades}
                          onGradeChange={handleGradeChange}
                          autoFilledGradeKeys={autoFilledGradeKeys}
                          isReadOnly={isReadOnly}
                        />
                      </CardErrorBoundary>
                    </div>
                  )}

                  {labAssessments.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                      <CardErrorBoundary title="Laboratory Assessments">
                        <AssessmentGradeInput
                          title={`Laboratory Assessments (${laboratoryPercentage}%)`}
                          assessments={labAssessments}
                          grades={localGrades}
                          onGradeChange={handleGradeChange}
                          autoFilledGradeKeys={autoFilledGradeKeys}
                          isReadOnly={isReadOnly}
                        />
                      </CardErrorBoundary>
                    </div>
                  )}

                  <div className="pt-8 animate-in fade-in duration-700 delay-500">
                    <ActionButtons
                      onCalculate={handleCalculate}
                      onFillPassingScores={handleFillPassingScores}
                      onFillTargetScores={handleFillTargetScores}
                      onClearAutoFilledScores={handleClearAutoFilledScores}
                      onSave={handleSaveGrades}
                      isSaving={saveGradesMutation.isPending}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                </div>
              )}
            </div>
          </main>
      </div>

      {showEditModal && course && (
        <EditCourseModal
          course={course}
          terms={terms}
          assessments={assessments}
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
