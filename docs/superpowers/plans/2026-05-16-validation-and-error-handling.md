# Error Handling & Validation Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement consistent Zod-based form validation and isolated React Error Boundaries to improve application resilience and user experience.

**Architecture:** Use Zod schemas for pre-submission validation in all course/term modals and wrap high-risk UI components in `CardErrorBoundary` to prevent cascading failures.

**Tech Stack:** React, TypeScript, Zod, Lucide-React (icons).

---

### Task 1: Refine Zod Schemas

**Files:**
- Modify: `lib/validations.ts`

- [ ] **Step 1: Update schemas for strictness**
Ensure `courseSchema` and `termSchema` cover all edge cases (negative units, invalid percentages).

```typescript
// lib/validations.ts
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/validations.ts
git commit -m "refactor: refine zod validation schemas for courses and terms"
```

### Task 2: Standardize Course Modals Validation

**Files:**
- Modify: `app/(authenticated)/courses/components/CreateCourseModal.tsx`
- Modify: `app/(authenticated)/courses/[id]/components/EditCourseModal.tsx`

- [ ] **Step 1: Implement Zod validation in CreateCourseModal**
Ensure all field errors are displayed.

- [ ] **Step 2: Implement Zod validation in EditCourseModal**
Update the assessment editing logic to use `assessmentSchema`.

- [ ] **Step 3: Commit**

```bash
git add app/(authenticated)/courses/components/CreateCourseModal.tsx app/(authenticated)/courses/[id]/components/EditCourseModal.tsx
git commit -m "feat: standardize course modal validation with zod"
```

### Task 3: Standardize Term Modals Validation

**Files:**
- Modify: `app/(authenticated)/terms/components/CreateNewTerm.tsx`
- Modify: `app/(authenticated)/terms/components/EditTermModal.tsx`

- [ ] **Step 1: Implement Zod validation in CreateNewTerm**
Display errors for academic year format and dates.

- [ ] **Step 2: Implement Zod validation in EditTermModal**
Synchronize validation logic with creation logic.

- [ ] **Step 3: Commit**

```bash
git add app/(authenticated)/terms/components/CreateNewTerm.tsx app/(authenticated)/terms/components/EditTermModal.tsx
git commit -m "feat: standardize term modal validation with zod"
```

### Task 4: Isolated Error Boundaries - Dashboard & Lists

**Files:**
- Modify: `app/(authenticated)/dashboard/DashboardPageClient.tsx`
- Modify: `app/(authenticated)/courses/CoursesPageClient.tsx`
- Modify: `app/(authenticated)/terms/TermsPageClient.tsx`

- [ ] **Step 1: Verify Dashboard isolation**
Wrap `CurrentGWACard`, `GWATrendCard`, and `CoursesCard` if not already fully isolated.

- [ ] **Step 2: Protect Course List**
Wrap `MyCoursesTable` in `CardErrorBoundary`.

- [ ] **Step 3: Protect Term List**
Wrap `MyTerms` in `CardErrorBoundary`.

- [ ] **Step 4: Commit**

```bash
git add app/(authenticated)/dashboard/DashboardPageClient.tsx app/(authenticated)/courses/CoursesPageClient.tsx app/(authenticated)/terms/TermsPageClient.tsx
git commit -m "feat: add isolated error boundaries to dashboard and list pages"
```

### Task 5: Isolated Error Boundaries - Course Details

**Files:**
- Modify: `app/(authenticated)/courses/[id]/page.tsx`

- [ ] **Step 1: Wrap high-risk sections**
Wrap `GradeSummaryCard` and `AssessmentGradeInput` sections.

- [ ] **Step 2: Commit**

```bash
git add app/(authenticated)/courses/[id]/page.tsx
git commit -m "feat: add isolated error boundaries to course detail page"
```
