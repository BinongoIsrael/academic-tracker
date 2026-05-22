import { z } from "zod";

export const termSchema = z.object({
  academicYear: z.string()
    .regex(/^\d{4}-\d{4}$/, "Academic year must be in YYYY-YYYY format")
    .refine((val) => {
      const [start, end] = val.split("-").map(Number);
      return end === start + 1;
    }, "End year must be exactly one year after start year"),
  semester: z.string().min(1, "Semester is required"),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "Start date must be before or equal to end date",
  path: ["endDate"],
});

export const assessmentSchema = z.object({
  assessment_name: z.string().min(1, "Assessment name is required"),
  occurrences: z.number().int().min(1, "Must have at least 1 occurrence"),
  percentage: z.number().min(0.01, "Percentage must be greater than 0").max(100, "Percentage cannot exceed 100"),
});

export const courseSchema = z.object({
  course_name: z.string().min(1, "Course name is required"),
  course_code: z.string().min(1, "Course code is required"),
  term_id: z.string().uuid("Invalid term selected"),
  units: z.number().min(0.5, "Units must be at least 0.5").max(10, "Units cannot exceed 10"),
  target_gpa: z.number().min(1.0, "GPA must be at least 1.0").max(5.0, "GPA cannot exceed 5.0").nullable().optional(),
  course_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  course_structure: z.enum(["Lecture", "Lecture + Laboratory"]),
  lecture_percentage: z.number().min(0).max(100),
  laboratory_percentage: z.number().min(0).max(100),
}).refine((data) => {
  if (data.course_structure === "Lecture + Laboratory") {
    return Math.abs(data.lecture_percentage + data.laboratory_percentage - 100) < 0.01;
  }
  return true;
}, {
  message: "Lecture and Laboratory percentages must sum to 100%",
  path: ["laboratory_percentage"],
});
