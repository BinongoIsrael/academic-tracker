"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/lib/auth-actions";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

function ResetPasswordContent() {
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
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-outline-variant/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Verifying Restoration Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-10 shadow-[0_20px_40px_rgba(26,27,36,0.06)]">
        <header className="mb-10 text-center">
            <div className="w-12 h-12 bg-primary-container flex items-center justify-center rounded-lg mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">
            New Credentials
            </h1>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed px-4">
            Initialize your secured academic profile with a robust primary password.
            </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-error-container/20 border border-error/10 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-error text-xl">error</span>
            <p className="text-sm font-semibold text-error leading-tight">{error}</p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant ml-1">New Primary Password</label>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create robust password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border-outline-variant/30 rounded p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold h-12 pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3">Security Complexity</p>
              <ul className="text-xs font-semibold space-y-2">
                <li className={`flex items-center gap-2 ${password.length >= 8 ? "text-primary" : "text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-sm">{password.length >= 8 ? "check_circle" : "circle"}</span>
                  Primary Length (8+ chars)
                </li>
                <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-primary" : "text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-sm">{/[a-z]/.test(password) ? "check_circle" : "circle"}</span>
                  Lowercase Alphabetic
                </li>
                <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-primary" : "text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-sm">{/[A-Z]/.test(password) ? "check_circle" : "circle"}</span>
                  Uppercase Alphabetic
                </li>
                <li className={`flex items-center gap-2 ${/\d/.test(password) ? "text-primary" : "text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-sm">{/\d/.test(password) ? "check_circle" : "circle"}</span>
                  Numeric Digit
                </li>
                <li className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-primary" : "text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-sm">{/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "check_circle" : "circle"}</span>
                  Special Character Symbol
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant ml-1">Confirm Primary Password</label>
            <div className="relative">
              <Input
                name="confirm-password"
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat robust password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface border-outline-variant/30 rounded p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold h-12 pr-12"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-primary text-on-primary rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all flex items-center justify-center gap-2 group mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Restoring Access..." : (
                <>
                FINALIZE RESTORATION
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">security</span>
                </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}