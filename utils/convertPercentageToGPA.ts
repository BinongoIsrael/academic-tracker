import { GradingScale } from "@/types";

export function convertPercentageToGPA(
  percentage: number,
  gradingScale: GradingScale[]
): number {
  const sortedScale = [...gradingScale].sort(
    (a, b) => a.grade_point - b.grade_point
  );

  for (const scale of sortedScale) {
    if (
      percentage >= scale.min_percentage &&
      percentage <= scale.max_percentage
    ) {
      return scale.grade_point;
    }
  }

  return 5.0;
}

export function getGradeRemark(gpa: number): string {
  if (gpa >= 1.0 && gpa <= 1.25) return "Excellent";
  if (gpa > 1.25 && gpa <= 1.75) return "Very Good";
  if (gpa > 1.75 && gpa <= 2.25) return "Good";
  if (gpa > 2.25 && gpa <= 2.75) return "Satisfactory";
  if (gpa > 2.75 && gpa <= 3.0) return "Passed";
  return "Failed";
}
