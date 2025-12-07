"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg p-8 text-center">
        <div className="mb-6">
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
          <p className="text-subtle text-sm">
            We've sent a confirmation email to:
          </p>
          <p className="text-slate-900 font-medium mt-2 break-all">
            {email || "your email address"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-subtle mb-3">
            To complete your registration:
          </p>
          <ol className="text-sm text-subtle space-y-2 list-decimal list-inside">
            <li>Open the email from Gradient</li>
            <li>Click the confirmation link</li>
            <li>You'll be redirected to your dashboard</li>
          </ol>
        </div>

        <div className="text-xs text-subtle mb-6">
          <p>Didn't receive the email? Check your spam folder.</p>
          <p className="mt-1">The link will expire in 24 hours.</p>
        </div>

        <Link
          href="/signup"
          className="inline-block text-sm text-slate-900 hover:underline"
        >
          ← Back to Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}