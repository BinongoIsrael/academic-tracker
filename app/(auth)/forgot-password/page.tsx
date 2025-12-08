"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/auth-actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError("");

    const result = await requestPasswordReset(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-slate-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Check Your Email
          </h1>
          <p className="text-subtle text-sm mb-4">
            We've sent a password reset link to:
          </p>
          <p className="text-slate-900 font-medium break-all mb-6">{email}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-subtle mb-3">Next steps:</p>
            <ol className="text-sm text-subtle space-y-2 list-decimal list-inside">
              <li>Open the email from Gradient</li>
              <li>Click the reset password link</li>
              <li>Create your new password</li>
            </ol>
          </div>

          <div className="text-xs text-subtle mb-6">
            <p>Didn't receive the email? Check your spam folder.</p>
            <p className="mt-1">The link will expire in 1 hour.</p>
          </div>

          <Link
            href="/signin"
            className="inline-block text-sm text-slate-900 hover:underline"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 text-center">
          Reset Your Password
        </h1>
        <p className="text-center text-subtle text-sm mb-8">
          Enter your email address and we'll send you a link to reset your password
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="w-full">
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-9 px-3 py-2 text-sm border border-slate-300 rounded-md text-gray-600 placeholder:text-gray-500"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/signin"
            className="text-sm text-slate-900 hover:underline"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}