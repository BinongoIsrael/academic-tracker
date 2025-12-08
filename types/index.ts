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
  grade?: number | null;
  created_at?: string;
  updated_at?: string;
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
  startDate: string;
  endDate: string;
  courses: number;
  units: number;
  gpa: number | null;
  isActive: boolean;
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