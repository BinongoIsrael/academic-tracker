"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup, signInWithGoogle } from "@/lib/auth-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { SignUpErrors } from "@/types";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const router = useRouter();

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasLowercase = /[a-z]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (!minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasLowercase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasDigit) {
      return "Password must contain at least one digit";
    }
    if (!hasSymbol) {
      return "Password must contain at least one symbol (!@#$%^&*...)";
    }
    return null;
  };

  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@')) {
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck }),
      });

      const data = await response.json();

      if (data.exists) {
        setErrors(prev => ({ 
          ...prev, 
          email: "This email is already registered. Please sign in instead." 
        }));
      } else {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setErrors(prev => ({ ...prev, email: undefined }));
  };

  const handleEmailBlur = () => {
    checkEmailExists(email);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    const error = validatePassword(newPassword);
    setErrors(prev => ({ ...prev, password: error || undefined }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (newConfirmPassword && newConfirmPassword !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleEmailSignup = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const email = formData.get("email") as string;
      const pwd = formData.get("password") as string;
      const confirmPwd = formData.get("confirm-password") as string;

      // Check email one more time before submission
      await checkEmailExists(email);
      if (errors.email) {
        setIsLoading(false);
        return;
      }

      const passwordError = validatePassword(pwd);
      if (passwordError) {
        setErrors(prev => ({ ...prev, password: passwordError }));
        setIsLoading(false);
        return;
      }

      if (pwd !== confirmPwd) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        setIsLoading(false);
        return;
      }

      await signup(formData);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[604px] bg-white border border-slate-300 rounded-lg p-8">
      <h4 className="text-center text-slate-900 font-medium text-xl leading-7 mb-3">
        Create an Account
      </h4>
      <p className="text-center text-subtle text-sm leading-5 mb-8">
        Ready to enhance your academic journey? Let's get started
      </p>
      <form action={handleEmailSignup} className="space-y-4">
        <div className="w-full">
          <Input
            name="username"
            id="username"
            type="text"
            placeholder="Username"
            className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
        </div>

        <div className="w-full">
          <div className="relative">
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={`w-full h-9 px-3 py-2 text-sm border rounded-md text-gray-600 placeholder:text-gray-500 ${
                errors.email ? "border-red-500" : "border-slate-300"
              }`}
              required
              disabled={isLoading}
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="w-full">
          <div className="relative">
            <Input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full h-9 px-3 py-2 pr-10 text-sm border rounded-md text-gray-600 placeholder:text-gray-500 ${
                errors.password ? "border-red-500" : "border-slate-300"
              }`}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
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
          <Input
            name="confirm-password"
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full h-9 px-3 py-2 text-sm border rounded-md text-gray-600 placeholder:text-gray-500 ${
              errors.confirmPassword ? "border-red-500" : "border-slate-300"
            }`}
            required
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md mt-5"
          disabled={isLoading || isCheckingEmail || !!errors.email || !!errors.password || !!errors.confirmPassword}
        >
          {isLoading ? "Signing up..." : "Sign up with Email"}
        </Button>
      </form>

      <div className="relative flex items-center justify-center my-6">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-4 text-sm font-medium text-subtle">
          OR SIGN UP WITH
        </span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <button
        type="button"
        onClick={() => signInWithGoogle()}
        className="w-full h-11 flex items-center justify-center gap-3 bg-white border border-gray-400 rounded-md hover:bg-gray-50 transition-colors"
        disabled={isLoading}
      >
        <Image
          src="/Google-G-logo.svg"
          alt="Google"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <span className="text-sm font-medium text-black">Google</span>
      </button>

      <p className="text-center text-subtle text-sm mt-6">
        Already have an account?{" "}
        <Link href="/signin" className="text-slate-900 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}