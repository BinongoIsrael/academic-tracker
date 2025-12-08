"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/lib/auth-actions";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyCode = async () => {
      const code = searchParams.get('code');
      
      if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          setError("Invalid or expired reset link. Please request a new one.");
        }
      }
      
      setIsVerifying(false);
    };

    verifyCode();
  }, [searchParams]);

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasLowercase = /[a-z]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (!minLength) return "Password must be at least 8 characters long";
    if (!hasLowercase) return "Password must contain at least one lowercase letter";
    if (!hasUppercase) return "Password must contain at least one uppercase letter";
    if (!hasDigit) return "Password must contain at least one digit";
    if (!hasSymbol) return "Password must contain at least one symbol";
    return null;
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError("");

    const pwd = formData.get("password") as string;
    const confirmPwd = formData.get("confirm-password") as string;

    const passwordError = validatePassword(pwd);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (pwd !== confirmPwd) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-subtle">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 text-center">
          Create New Password
        </h1>
        <p className="text-center text-subtle text-sm mb-8">
          Enter a strong password for your account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="w-full">
            <div className="relative">
              <Input
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 px-3 py-2 pr-10 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">Password must contain:</p>
              <ul className="text-xs text-gray-500 space-y-0.5 ml-4">
                <li className={password.length >= 8 ? "text-green-600" : ""}>
                  • At least 8 characters
                </li>
                <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>
                  • One lowercase letter
                </li>
                <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                  • One uppercase letter
                </li>
                <li className={/\d/.test(password) ? "text-green-600" : ""}>
                  • One digit
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : ""}>
                  • One symbol (!@#$%^&*...)
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full">
            <div className="relative">
              <Input
                name="confirm-password"
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-9 px-3 py-2 pr-10 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md mt-5"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}