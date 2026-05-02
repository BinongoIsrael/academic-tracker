"use client";

import Link from "next/link";
import Image from "next/image";
import { signup, signInWithGoogle } from "@/lib/auth-actions";
import { useState } from "react";
import { SignUpErrors } from "@/types";
import { useFormStatus } from "react-dom";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full bg-primary-container text-on-primary-container py-4 rounded font-bold transition-all hover:translate-y-[-2px] active:scale-95 shadow-[4px_4px_0px_#191A23] hover:shadow-[6px_6px_0px_#191A23] mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <div className="w-5 h-5 border-2 border-on-primary-container/30 border-t-on-primary-container rounded-full animate-spin" />
          Creating Account...
        </>
      ) : (
        <>
          Create Account
          <span className="material-symbols-outlined text-lg">person_add</span>
        </>
      )}
    </button>
  );
}

export function SignUpForm() {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes("@")) return;
    setIsCheckingEmail(true);
    try {
      const response = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToCheck }),
      });
      const data = await response.json();
      if (data.exists) {
        setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailSignup = async (formData: FormData) => {
    setServerError("");
    const pwd = formData.get("password") as string;
    const confirmPwd = formData.get("confirm-password") as string;

    if (pwd !== confirmPwd) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    const result = await signup(formData);
    if (result?.error) {
      setServerError(result.error);
    } else if (result?.success) {
      setIsSuccess(true);
    }
  };

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One digit", valid: /\d/.test(password) },
    { label: "One symbol (!@#$%^&*...)", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  if (isSuccess) {
    return (
      <div className="w-full text-center py-12">
        <div className="mb-8 w-20 h-20 bg-primary-container flex items-center justify-center rounded-full mx-auto">
          <span className="material-symbols-outlined text-4xl text-on-primary-container">mail</span>
        </div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-4">Check Your Email</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-sm mx-auto">
          We&apos;ve sent a confirmation link to <span className="font-bold text-primary">{email}</span>. 
          Please check your inbox to activate your account.
        </p>
        <Link 
          href="/signin" 
          className="inline-flex items-center gap-2 px-10 py-4 bg-primary-container text-on-primary-container font-black text-lg rounded neo-shadow-hover transition-all"
        >
          Go to Sign In
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">Create an Account</h2>
        <p className="text-on-surface-variant text-sm mt-1">Enter your credentials to access your academic workspace.</p>
      </header>

      {serverError && (
        <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg border border-error/10">
          <p className="text-sm font-medium">{serverError}</p>
        </div>
      )}

      <form action={handleEmailSignup} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="username">Username</label>
          <input
            name="username"
            id="username"
            type="text"
            placeholder="username"
            className="w-full bg-surface-container-low border-0 rounded p-3 text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/50 text-sm"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">Email Address</label>
          <div className="relative">
            <input
              name="email"
              id="email"
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => checkEmailExists(email)}
              className={`w-full bg-surface-container-low border-0 rounded p-3 text-on-surface focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/50 text-sm ${errors.email ? "ring-2 ring-error" : ""}`}
              required
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
          {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
          <div className="relative">
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border-0 rounded p-3 text-on-surface focus:ring-2 focus:ring-primary transition-all text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
          
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {passwordChecks.map((check, i) => (
              <div key={i} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${check.valid ? "text-primary" : "text-on-surface-variant"}`}>
                <span className={`material-symbols-outlined text-[14px] ${check.valid ? "fill-1" : ""}`}>
                  {check.valid ? "check_circle" : "circle"}
                </span>
                {check.label}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="confirm-password">Confirm Password</label>
          <input
            name="confirm-password"
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full bg-surface-container-low border-0 rounded p-3 text-on-surface focus:ring-2 focus:ring-primary transition-all text-sm ${errors.confirmPassword ? "ring-2 ring-error" : ""}`}
            required
          />
          {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword}</p>}
        </div>

        <SubmitButton disabled={isCheckingEmail || !!errors.email || !!errors.confirmPassword} />
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/30"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface-container-lowest px-4 text-on-surface-variant font-bold tracking-widest">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signInWithGoogle()}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface-container rounded transition-all hover:bg-surface-container-high active:scale-[0.98] font-semibold text-sm text-on-surface"
      >
        <Image src="/Google-G-logo.svg" alt="Google" width={20} height={20} />
        Continue with Google
      </button>

      <footer className="mt-8 text-center text-sm">
        <p className="text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
            Sign In
          </Link>
        </p>
      </footer>
    </div>
  );
}
