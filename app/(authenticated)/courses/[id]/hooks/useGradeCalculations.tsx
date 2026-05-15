import { useState, useCallback } from "react";
import { Assessment, AssessmentGrade, GradingScale, Course } from "@/types";
import { convertPercentageToGPA } from "@/utils/convertPercentageToGPA";

export function useGradeCalculations(course: Course | null) {
  const [currentPercentage, setCurrentPercentage] = useState<number | null>(
    null
  );
  const [finalPercentage, setFinalPercentage] = useState<number | null>(null);
  const [currentGPA, setCurrentGPA] = useState<number | null>(null);
  const [finalGPA, setFinalGPA] = useState<number | null>(null);
  const [requiredScoreToTarget, setRequiredScoreToTarget] = useState<number | null>(null);
  const [targetStatus, setTargetStatus] = useState<"possible" | "reached" | "impossible" | "missing_scale" | "no_target">("no_target");

  const calculateGrades = useCallback(
    (
      assessmentsList: Assessment[],
      gradesList: AssessmentGrade[],
      scaleList: GradingScale[],
      currentCourse: Course | null
    ) => {
      if (!currentCourse || assessmentsList.length === 0) return;

      let totalEarnedContribution = 0;
      let totalCompletedWeight = 0;
      let totalPointsEarnedRaw = 0;
      let totalRemainingWeight = 0;

      for (const assessment of assessmentsList) {
        const assessmentGrades = gradesList.filter(
          (g) => g.assessment_id === assessment.id
        );

        const weightPerOccurrence = assessment.percentage / assessment.occurrences;

        for (let i = 1; i <= assessment.occurrences; i++) {
          const gradeEntry = assessmentGrades.find(g => g.occurrence_number === i);
          
          if (gradeEntry && gradeEntry.grade !== null) {
            const contribution = (gradeEntry.grade * weightPerOccurrence) / 100;
            totalEarnedContribution += contribution;
            totalPointsEarnedRaw += contribution * 100; // Raw points (0-100 scale)
            totalCompletedWeight += weightPerOccurrence;
          } else {
            totalRemainingWeight += weightPerOccurrence;
          }
        }
      }

      const normalizedAverage = totalCompletedWeight > 0 
        ? (totalEarnedContribution / totalCompletedWeight) * 100 
        : null;

      setCurrentPercentage(normalizedAverage);

      if (scaleList.length > 0 && normalizedAverage !== null) {
        setCurrentGPA(convertPercentageToGPA(normalizedAverage, scaleList));
      } else {
        setCurrentGPA(null);
      }

      setFinalPercentage(totalEarnedContribution);

      if (scaleList.length > 0) {
        setFinalGPA(convertPercentageToGPA(totalEarnedContribution, scaleList));
      } else {
        setFinalGPA(null);
      }

      // Prediction Logic
      if (!currentCourse.target_gpa) {
        setTargetStatus("no_target");
        setRequiredScoreToTarget(null);
      } else if (scaleList.length === 0) {
        setTargetStatus("missing_scale");
        setRequiredScoreToTarget(null);
      } else {
        const targetScaleEntry = scaleList.find(s => s.grade_point === currentCourse.target_gpa);
        
        if (!targetScaleEntry) {
          setTargetStatus("missing_scale");
          setRequiredScoreToTarget(null);
        } else {
          const goalPercentage = targetScaleEntry.min_percentage;
          const pointsNeeded = goalPercentage - totalPointsEarnedRaw;

          if (pointsNeeded <= 0) {
            setTargetStatus("reached");
            setRequiredScoreToTarget(null);
          } else if (totalRemainingWeight === 0) {
            setTargetStatus("impossible");
            setRequiredScoreToTarget(null);
          } else {
            const requiredScore = (pointsNeeded / totalRemainingWeight) * 100;
            
            if (requiredScore > 100) {
              setTargetStatus("impossible");
              setRequiredScoreToTarget(requiredScore);
            } else {
              setTargetStatus("possible");
              setRequiredScoreToTarget(requiredScore);
            }
          }
        }
      }
    },
    []
  );

  return {
    currentPercentage,
    finalPercentage,
    currentGPA,
    finalGPA,
    requiredScoreToTarget,
    targetStatus,
    calculateGrades,
  };
}
