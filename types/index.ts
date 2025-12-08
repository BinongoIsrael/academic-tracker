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