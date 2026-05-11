import { User } from "@supabase/supabase-js";
import { ReactNode } from "react";

export interface UserMenuProps {
  user: {
    email?: string;
    user_metadata?: {
      avatar_url?: string;
      full_name?: string;
    };
  };
}

export interface SignUpErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface CurrentGWACardProps {
  gwa: number;
}

export interface GWATrendCardProps {
  currentGWA: number;
  trendData?: number[];
}

export interface AddCourseButtonProps {
  onClick?: () => void;
}

export interface Course {
  id: string;
  term_id: string;
  user_id: string;
  course_code: string;
  course_name: string;
  units: number;
  course_type?: string;
  course_structure?: string;
  target_gpa?: number | null;
  grade?: number | null;
  lecture_percentage?: number;
  laboratory_percentage?: number;
  course_color?: string;
  created_at?: string;
  updated_at?: string;
  term?: Term;
}
export interface CoursesCardProps {
  courses?: Course[];
  onAddCourse?: () => void;
}

export interface Term {
  id: string;
  user_id: string;
  academicYear: string;
  semester: string;
  startDate: string | null;
  endDate: string | null;
  courses: number;
  units: number;
  gpa: number | null;
  isActive: boolean;
  isUpcoming?: boolean;
  isPast?: boolean;
  isUnscheduled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNewTermProps {
  onCreateTerm: (data: {
    academicYear: string;
    startDate: string | null;
    endDate: string | null;
    semester: string;
  }) => void;
}

export interface TermCardProps {
  term: Term;
  onEdit: (termId: string) => void;
  onAddCourse?: (termId: string) => void;
}

export interface MyTermsProps {
  terms: Term[];
  onEditTerm: (termId: string) => void;
  onAddCourse: (termId: string) => void;
}

export interface EditTermModalProps {
  term: Term | null;
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (termId: string, data: {
    academicYear: string;
    semester: string;
    startDate: string | null;
    endDate: string | null;
  }) => Promise<void>;
  onDeleteClick: (term: Term) => void;
  onRemoveCourse: (courseId: string) => Promise<void>;
  onAddCourse: (termId: string) => void;
}

export interface DeleteTermModalProps {
  term: Term | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (termId: string) => Promise<void>;
}

export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export interface Assessment {
  id: string;
  course_id: string;
  assessment_name: string;
  occurrences: number;
  percentage: number;
  component_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseFormProps {
  terms: Term[];
  onSubmit: (courseData: {
    courseTitle: string;
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
    gradeInputMode?: "final" | "assessments";
  }) => Promise<void>;
}

export interface CourseStructureRadioProps {
  value: string;
  onChange: (value: string) => void;
}

export interface CourseAssessmentSectionProps {
  title: string;
  assessments: Partial<Assessment>[];
  onUpdate: (index: number, field: keyof Assessment, value: string | number) => void;
  onRemove: (index: number) => void;
  addButton: ReactNode;
}

export interface AddAssessmentButtonProps {
  onClick: () => void;
}

export interface MyCoursesTableProps {
  courses: Course[];
}

export interface WeightDistributionProps {
  lecturePercentage: string;
  laboratoryPercentage: string;
  onLecturePercentageChange: (value: string) => void;
  onLaboratoryPercentageChange: (value: string) => void;
}

export interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export interface AssessmentGrade {
  id: string;
  course_id: string,
  assessment_id: string;
  occurrence_number: number;
  grade: number | null;
}

export interface AssessmentGradeInputProps {
  title: string;
  assessments: Assessment[];
  grades: AssessmentGrade[];
  onGradeChange: (
    assessmentId: string,
    occurrenceNumber: number,
    value: string
  ) => void;
}

export interface GradingScale {
  id: string;
  course_id: string;
  grade_point: number;
  min_percentage: number;
  max_percentage: number;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_GRADING_SCALE: Omit<GradingScale, 'id' | 'course_id' | 'created_at' | 'updated_at'>[] = [
  { grade_point: 1.00, min_percentage: 97, max_percentage: 100 },
  { grade_point: 1.25, min_percentage: 94, max_percentage: 96.99 },
  { grade_point: 1.50, min_percentage: 91, max_percentage: 93.99 },
  { grade_point: 1.75, min_percentage: 88, max_percentage: 90.99 },
  { grade_point: 2.00, min_percentage: 85, max_percentage: 87.99 },
  { grade_point: 2.25, min_percentage: 82, max_percentage: 84.99 },
  { grade_point: 2.50, min_percentage: 79, max_percentage: 81.99 },
  { grade_point: 2.75, min_percentage: 76, max_percentage: 78.99 },
  { grade_point: 3.00, min_percentage: 75, max_percentage: 75.99 },
  { grade_point: 5.00, min_percentage: 0, max_percentage: 74.99 },
];

export interface GradingScaleSetupProps {
  courseId: string;
  onSave: (scales: Omit<GradingScale, 'id' | 'course_id' | 'created_at' | 'updated_at'>[]) => void;
  initialScales?: GradingScale[];
}

export interface ActionButtonsProps {
  onCalculate: () => void;
  onSave: () => void;
}

export interface CourseHeaderProps {
  course: Course;
  courseColor: string;
  onBack: () => void;
  onGradingScaleClick: () => void;
  onEditClick: () => void;
}

export interface GradeSummaryCardProps {
  targetGPA: number;
  currentGPA: number | null;
  currentPercentage: number | null;
  finalGPA: number | null;
  finalPercentage: number | null;
  hasGradingScale: boolean;
}

export interface EditCourseModalProps {
  course: Course;
  terms: Term[];
  onSave: (updatedCourse: {
    course_name: string;
    term_id: string;
    course_type: string;
    units: number;
    target_gpa: number | null;
    course_color: string;
    course_structure: string;
    lecture_percentage: number;
    laboratory_percentage: number;
  }) => Promise<void>;
  onClose: () => void;
}

export interface AssessmentManagementProps {
  lectureAssessments: Assessment[];
  labAssessments: Assessment[];
  onUpdateOccurrences: (assessmentId: string, newOccurrences: number) => Promise<void>;
  lecturePercentage: number;
  laboratoryPercentage: number;
}

export interface GradeInputModeRadioProps {
  value: "assessments" | "final";
  onChange: (value: "assessments" | "final") => void;
}

export interface DeleteCourseModalProps {
  courseName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export interface GWATypeSelectionProps {
  selectionType: "all" | "specific";
  setSelectionType: (v: "all" | "specific") => void;
  selectedTermId: string;
  setSelectedTermId: (v: string) => void;
  terms: Term[];
  loadingTerms?: boolean;
  termsError?: string | null;
}

export interface GWAResultsProps {
  academicGWA: string;
  totalGWA: string;
}

export interface GWABreakdownProps {
  academicYear: string;
  specificRange: string;
  courses: Course[];
}

export interface AvatarUploaderProps {
  user: User | null;
  url: string | null;
  onUpload: (publicUrl: string) => void;
}