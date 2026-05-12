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

      for (const assessment of assessmentsList) {
        const assessmentGrades = gradesList.filter(
          (g) => g.assessment_id === assessment.id
        );

        const filledGrades = assessmentGrades.filter((g) => g.grade !== null);

        if (filledGrades.length > 0) {
          const avgGrade = filledGrades.reduce((sum, g) => sum + (g.grade || 0), 0) / filledGrades.length;
          const contribution = (avgGrade * assessment.percentage) / 100;
          totalEarnedContribution += contribution;    
          totalCompletedWeight += assessment.percentage;
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
    },
    []
  );

  return {
    currentPercentage,
    finalPercentage,
    currentGPA,
    finalGPA,
    calculateGrades,
  };
}
