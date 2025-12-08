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
  name: string;
  grade?: number;
}

export interface CoursesCardProps {
  courses?: Course[];
  onAddCourse?: () => void;
}