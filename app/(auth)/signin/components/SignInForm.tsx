"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signin, signInWithGoogle } from "@/lib/auth-actions";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccessMessage(message);
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 10000); //10 secs
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const result = await signin(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[604px] bg-white border border-slate-300 rounded-lg p-8">
      <h4 className="text-center text-slate-900 font-medium text-xl leading-7 mb-3">
        Welcome Back
      </h4>
      <p className="text-center text-subtle text-sm leading-5 mb-8">
        Fill in your information to pick up right where you left off
      </p>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form action={handleSignIn} className="space-y-4">
        <div className="w-full">
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
        </div>
        <div className="w-full">
          <div className="relative">
            <Input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full h-9 px-3 py-2 pr-10 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
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
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-slate-900 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md mt-5"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in with Email"}
        </Button>
      </form>

      <div className="relative flex items-center justify-center my-6">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-4 text-sm font-medium text-subtle">
          OR CONTINUE WITH
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
        Don't have an account?{" "}
        <Link href="/signup" className="text-slate-900 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
