import { describe, it, expect } from 'vitest';
import { termSchema, assessmentSchema, courseSchema } from './validations';

describe('termSchema', () => {
  it('validates a correct term', () => {
    const validTerm = {
      academicYear: "2023-2024",
      semester: "1st Semester",
      startDate: "2023-08-01",
      endDate: "2023-12-20"
    };
    const result = termSchema.safeParse(validTerm);
    expect(result.success).toBe(true);
  });

  it('fails if end year is not start year + 1', () => {
    const invalidYear = {
      academicYear: "2023-2025",
      semester: "1st Semester"
    };
    const result = termSchema.safeParse(invalidYear);
    expect(result.success).toBe(false);
  });

  it('fails if start date is after end date', () => {
    const invalidDates = {
      academicYear: "2023-2024",
      semester: "1st Semester",
      startDate: "2023-12-20",
      endDate: "2023-08-01"
    };
    const result = termSchema.safeParse(invalidDates);
    expect(result.success).toBe(false);
  });
});

describe('assessmentSchema', () => {
  it('validates a correct assessment', () => {
    const validAssessment = {
      assessment_name: "Quizzes",
      occurrences: 5,
      percentage: 20
    };
    const result = assessmentSchema.safeParse(validAssessment);
    expect(result.success).toBe(true);
  });

  it('fails if percentage is zero or negative', () => {
    expect(assessmentSchema.safeParse({ assessment_name: "Q", occurrences: 1, percentage: 0 }).success).toBe(false);
    expect(assessmentSchema.safeParse({ assessment_name: "Q", occurrences: 1, percentage: -1 }).success).toBe(false);
  });
});

describe('courseSchema', () => {
  it('validates a correct course', () => {
    const validCourse = {
      course_name: "Data Structures",
      course_code: "CS201",
      term_id: "550e8400-e29b-41d4-a716-446655440000",
      units: 3.0,
      course_color: "#FF5733",
      course_structure: "Lecture",
      lecture_percentage: 100,
      laboratory_percentage: 0
    };
    const result = courseSchema.safeParse(validCourse);
    expect(result.success).toBe(true);
  });

  it('fails if lecture + lab percentage does not sum to 100 for combined structure', () => {
    const invalidCombined = {
      course_name: "Physics",
      course_code: "PHY101",
      term_id: "550e8400-e29b-41d4-a716-446655440000",
      units: 4.0,
      course_color: "#0000FF",
      course_structure: "Lecture + Laboratory",
      lecture_percentage: 60,
      laboratory_percentage: 30 // Sum 90
    };
    const result = courseSchema.safeParse(invalidCombined);
    expect(result.success).toBe(false);
  });
});
