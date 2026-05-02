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
      scaleList: GradingScale[]
    ) => {
      if (!course || assessmentsList.length === 0) return;

      let currentTotal = 0;

      for (const assessment of assessmentsList) {
        const assessmentGrades = gradesList.filter(
          (g) => g.assessment_id === assessment.id
        );

        const filledGrades = assessmentGrades.filter((g) => g.grade !== null);

        if (filledGrades.length > 0) {
          const totalSum = filledGrades.reduce(
            (sum, g) => sum + (g.grade || 0),
            0
          );
          const avgPercentage = totalSum / filledGrades.length;
          const contribution = (avgPercentage * assessment.percentage) / 100;
          currentTotal += contribution;
        }
      }

      setCurrentPercentage(currentTotal);

      if (scaleList.length > 0) {
        const gpa = convertPercentageToGPA(currentTotal, scaleList);
        setCurrentGPA(gpa);
      } else {
        setCurrentGPA(null);
      }

      let finalTotal = 0;
      let hasAllGrades = true;

      for (const assessment of assessmentsList) {
        const assessmentGrades = gradesList.filter(
          (g) => g.assessment_id === assessment.id
        );

        const filledGrades = assessmentGrades.filter((g) => g.grade !== null);

        if (filledGrades.length < assessment.occurrences) {
          hasAllGrades = false;
        }

        if (filledGrades.length > 0) {
          const avgPercentage =
            filledGrades.reduce((sum, g) => sum + (g.grade || 0), 0) /
            filledGrades.length;
          finalTotal += (avgPercentage * assessment.percentage) / 100;
        }
      }

      if (hasAllGrades) {
        setFinalPercentage(finalTotal);
        if (scaleList.length > 0) {
          const gpa = convertPercentageToGPA(finalTotal, scaleList);
          setFinalGPA(gpa);
        } else {
          setFinalGPA(null);
        }
      } else {
        setFinalPercentage(null);
        setFinalGPA(null);
      }
    },
    [course]
  );

  return {
    currentPercentage,
    finalPercentage,
    currentGPA,
    finalGPA,
    calculateGrades,
  };
}
