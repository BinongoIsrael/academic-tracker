"use client";

import Link from "next/link";
import Image from "next/image";
import { signin, signInWithGoogle } from "@/lib/auth-actions";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
      }, 10000);
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
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Welcome Back</h2>
        <p className="text-on-surface-variant">Enter your credentials to access your curator tools.</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-secondary-container text-on-secondary-container rounded-lg border border-primary/10">
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/10">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form action={handleSignIn} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface" htmlFor="email">Email Address</label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="name@university.edu"
            className="w-full px-4 py-3 bg-surface-container-high border-none rounded focus:ring-2 focus:ring-primary transition-all text-sm placeholder:text-on-surface-variant/50"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface" htmlFor="password">Password</label>
            <Link href="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-surface-container-high border-none rounded focus:ring-2 focus:ring-primary transition-all text-sm placeholder:text-on-surface-variant/50"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface flex items-center justify-center"
              disabled={isLoading}
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="remember"
            className="rounded-sm text-primary focus:ring-primary border-outline-variant bg-surface-container w-4 h-4"
          />
          <label className="text-sm text-on-surface-variant" htmlFor="remember">
            Keep me signed in for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded neo-shadow-hover transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </form>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/30"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
          <span className="bg-surface px-4 text-on-surface-variant">OR CONTINUE WITH</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => signInWithGoogle()}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-lowest border border-outline-variant/20 rounded font-semibold text-sm hover:bg-surface-container-low transition-colors"
        >
          <Image
            src="/Google-G-logo.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Authenticate with Google
        </button>
      </div>

      <p className="mt-10 text-center text-sm text-on-surface-variant">
        Don&apos;t have an account yet?{" "}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          Join the community
        </Link>
      </p>
    </div>
  );
}
